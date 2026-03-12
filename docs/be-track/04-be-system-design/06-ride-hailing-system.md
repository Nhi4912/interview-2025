# Ride-Hailing System Design / Thiết Kế Hệ Thống Gọi Xe

> **Track**: BE | **Difficulty**: 🔴 Senior
> **Prerequisites**: [Design Framework](./01-design-framework.md) | [Classic Problems](./02-classic-problems.md)
> **See also**: [Message Queues](../02-backend-knowledge/08-message-queues.md) | [Distributed Systems](../02-backend-knowledge/03-distributed-systems.md) | [Grab Company Guide](../../shared/07-company-guides/03-grab.md)

---

## Why This Matters / Tại Sao Quan Trọng

Grab's core product là ride-hailing. Câu hỏi "Design Grab" hoặc "Design a ride-matching system" rất phổ biến ở phỏng vấn Grab, Go-Jek, và các công ty transport tech. Đây cũng là bài toán hay được dùng để test distributed systems knowledge ở Senior level.

---

## Requirements Clarification / Làm Rõ Yêu Cầu

**Functional requirements:**
- Rider requests a ride with pickup + destination
- Driver receives nearby ride requests
- Real-time driver location tracking
- Matching algorithm assigns best driver
- Trip tracking (start, in-progress, completed)
- Fare estimation and calculation
- Payment processing

**Non-functional requirements:**
- Low latency matching: < 1s to show driver ETA
- Location updates: every 5s per driver
- Scale: 5M daily active users, 500k drivers online peak
- Availability: 99.9% (ride matching critical path)

**Estimates (back of envelope):**
```
Peak DAU: 5M riders, 500k drivers
Location updates: 500k × 1 update/5s = 100k writes/s (location service)
Ride requests peak: ~50k/s
Storage (location): 500k drivers × 24 bytes × 720 events/hour = ~8GB/day
Storage (trips): 5M trips/day × 1KB = 5GB/day
```

---

## High-Level Architecture / Kiến Trúc Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                  │
│         [Rider App]              [Driver App]                   │
└──────────────┬───────────────────────┬──────────────────────────┘
               │ REST/WebSocket        │ REST/WebSocket + GPS
               ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY / LB                             │
└──────────┬──────────────┬──────────────┬───────────────────────┘
           ▼              ▼              ▼
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │   Location   │ │   Matching   │ │     Trip     │
  │   Service    │ │   Service    │ │   Service    │
  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
         │                │                 │
         ▼                ▼                 ▼
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │  Location DB │ │   Geospatial │ │   Trip DB    │
  │  (Redis)     │ │   Index      │ │  (Postgres)  │
  └──────────────┘ │   (Redis     │ └──────────────┘
                   │   GEO /      │
                   │   PostGIS)   │
                   └──────────────┘
         │                                  │
         ▼                                  ▼
  ┌──────────────────────────────────────────────────┐
  │              EVENT BUS (Kafka)                   │
  │  driver.location.updated | ride.requested        │
  │  ride.matched | trip.started | trip.completed    │
  └──────────────────────────────────────────────────┘
         │
         ▼
  [Surge Pricing Service]  [Analytics]  [Notification Service]
```

---

## Component Deep Dives / Chi Tiết Từng Thành Phần

### 1. Location Service / Dịch Vụ Vị Trí

**Challenge**: 500k drivers sending GPS updates every 5s = 100k writes/s

```
Driver App → Location Service → Redis (GEOADD)
                              → Kafka: driver.location.updated

Redis GEO commands:
GEOADD drivers:active 106.6917 10.7651 "driver:123"
GEORADIUSBYMEMBER drivers:active "pickup_point" 5 km ASC COUNT 20
→ returns 20 nearest drivers within 5km, sorted by distance

Redis GEO stores coordinates with O(log N) spatial indexing
N = number of active drivers globally → still fast
```

**Tiered location storage:**
```
Redis (hot, 10 min TTL):  real-time active driver positions
Cassandra (warm):          last 24h location history (trip reconstruction)
S3/Data Lake (cold):       > 24h, for analytics, ML training
```

**Location update flow:**
```go
// Driver sends location every 5s
type LocationUpdate struct {
    DriverID  string
    Lat, Lng  float64
    Bearing   float32  // heading direction
    Speed     float32
    Timestamp time.Time
}

func (s *LocationService) UpdateLocation(ctx context.Context, update LocationUpdate) error {
    // 1. Store in Redis GEO (for spatial queries)
    pipe := s.redis.Pipeline()
    pipe.GeoAdd(ctx, "drivers:active", &redis.GeoLocation{
        Name:      update.DriverID,
        Longitude: update.Lng,
        Latitude:  update.Lat,
    })
    pipe.Expire(ctx, fmt.Sprintf("driver:%s:location", update.DriverID), 30*time.Second)
    _, err := pipe.Exec(ctx)

    // 2. Publish to Kafka for downstream services
    s.producer.PublishLocationUpdate(ctx, update)
    return err
}
```

---

### 2. Matching Service / Dịch Vụ Ghép Cặp

**Core algorithm:**
```
Rider requests ride at (lat=10.77, lng=106.69):

Step 1: Find candidate drivers
  GEORADIUSBYMEMBER drivers:active <pickup> 3km ASC COUNT 20
  → [driver:456 (0.8km), driver:789 (1.2km), driver:123 (2.1km)]

Step 2: Filter candidates
  - Only drivers with status=AVAILABLE
  - Rating >= threshold
  - Vehicle type matches request

Step 3: Score candidates
  score = w1×(1/distance) + w2×(driver_rating) + w3×(acceptance_rate)
  
Step 4: Dispatch to top candidate
  SETNX dispatch:driver:456 rider:request:999  (atomic, expires in 15s)
  If SETNX fails (driver already being dispatched) → try next candidate

Step 5: Wait for driver response
  Driver accepts → create trip
  Driver rejects / timeout (15s) → dispatch to next candidate
```

**Preventing double-dispatch (race condition):**
```
Problem: Two rider requests dispatching to same driver simultaneously

Solution: Redis distributed lock
SETNX driver:456:lock "request:A" EX 15
→ SET if Not Exists + Expire in 15s
→ Atomic operation → only ONE request can claim the driver
→ If driver doesn't respond in 15s → lock expires → driver available again
```

**Surge pricing integration:**
```
Surge price = base_fare × surge_multiplier
surge_multiplier = demand/supply in geo-cell

H3 hexagonal grid (Uber's approach):
- Divide city into hexagonal cells (~km² each)
- Count riders waiting vs drivers available per cell
- Surge triggers when ratio > threshold
- Multiplier scales with ratio

Grab alternative: dynamic pricing algorithm
- Adjust multiplier per zone every 5 minutes
- Broadcast to both rider and driver apps via WebSocket
```

---

### 3. Real-Time Communication / Giao Tiếp Thời Gian Thực

**WebSocket for driver location → rider app:**
```
After match:
Driver App → Location Service → Kafka: driver.location.updated
                                     ↓
                               Trip Tracking Service
                                     ↓
                          WebSocket push → Rider App

Rider sees driver moving on map in real-time

Connection management at scale:
- WebSocket Gateway handles 5M concurrent connections
- Stateful (each connection = session) → sticky routing needed
- Each gateway server handles ~100k connections
- 50 gateway servers for 5M concurrent

Publish to correct WebSocket server:
  Redis Pub/Sub: channel = rider:riderid
  All gateway servers subscribe
  Trip service publishes: "driver at (lat, lng)"
  → Only gateway holding rider's WebSocket receives and pushes
```

---

### 4. Geospatial Indexing / Đánh Chỉ Mục Địa Lý

**Q: How does spatial indexing work for finding nearby drivers?**

```
NAIVE: For each rider request:
  Compare distance to all 500k drivers → O(N) → 500k calculations → slow!

GEOHASH (simplified explanation):
World → divide into grid cells by encoding lat/lng as string
  lat=10.77, lng=106.69 → geohash = "w3gv"
  Nearby points have similar geohash prefix

Uber H3 Hexagonal Grid:
  Divide world into hexagons at multiple resolutions
  Resolution 7: ~5km² cells (good for ride matching)
  Resolution 9: ~0.1km² (surge pricing granularity)

  ┌─────┬─────┬─────┐
  │     │     │     │
  │ 87f │ 87e │ 87d │  ← H3 cell IDs
  │     │     │     │
  └─────┴─────┴─────┘

  Driver at (10.77, 106.69) → H3 cell: 87f2e340dffffff
  Rider at (10.78, 106.70) → same cell or adjacent
  
  Nearby search: find all drivers in current cell + 6 adjacent cells
  = k+1 cells (vs full scan of 500k drivers)

Redis GEO (what Grab actually uses):
  Stores as sorted set with geohash as score
  GEORADIUSBYMEMBER: binary search on geohash → O(log N)
  Fast enough for production at Grab's scale
```

---

## Data Model / Mô Hình Dữ Liệu

```sql
-- Trips (Postgres - ACID, transactional)
CREATE TABLE trips (
    id          UUID PRIMARY KEY,
    rider_id    UUID NOT NULL,
    driver_id   UUID,
    status      trip_status NOT NULL,  -- REQUESTED, MATCHED, IN_PROGRESS, COMPLETED, CANCELLED
    pickup_lat  DECIMAL(9,6),
    pickup_lng  DECIMAL(9,6),
    dest_lat    DECIMAL(9,6),
    dest_lng    DECIMAL(9,6),
    distance_km DECIMAL(8,3),
    fare_amount DECIMAL(10,2),
    surge_mult  DECIMAL(4,2) DEFAULT 1.0,
    started_at  TIMESTAMPTZ,
    ended_at    TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_trips_rider ON trips(rider_id, created_at DESC);
CREATE INDEX idx_trips_driver ON trips(driver_id, created_at DESC);
CREATE INDEX idx_trips_status ON trips(status) WHERE status IN ('REQUESTED','MATCHED','IN_PROGRESS');

-- Redis (location + session)
-- Key: drivers:active (GEO sorted set)
-- Key: driver:{id}:status  (AVAILABLE|ON_TRIP|OFFLINE, TTL=30s)
-- Key: trip:{id}:driver_location  (last known position during trip)
```

---

## Failure Scenarios / Kịch Bản Lỗi

```
1. Driver crashes during trip:
   - Location updates stop (heartbeat timeout after 30s)
   - Trip service detects missing heartbeat → alert rider
   - System waits X minutes → auto-cancel with refund
   - Grab: human support intervention

2. Matching service goes down:
   - Rider requests queue in Kafka (durable)
   - New matching service instance starts
   - Consumes from Kafka → processes pending requests
   - No requests lost

3. Redis location store goes down:
   - Fallback: Last known location from Cassandra
   - Matching degrades to last-known instead of real-time
   - Redis recovers → location data repopulated from drivers

4. Payment failure at trip completion:
   - Trip marked COMPLETED but payment PENDING
   - Retry queue with exponential backoff
   - After 3 failures → manual review
   - Driver paid eventually (Grab guarantees driver payment)
```

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: How do you prevent a driver from being matched to two riders simultaneously? 🔴 Senior

**A:** Redis SETNX distributed lock:
```
SETNX driver:456:lock "trip:999" EX 15
→ Atomic. Only ONE request can acquire this lock.
→ Expires in 15s if driver doesn't respond
→ Retry logic in matching service for failed acquisitions
```

### Q: How does surge pricing work at scale? 🔴 Senior

**A:** H3 hex grid cells → real-time demand/supply ratio per cell → multiplier published every 5 min via Kafka → all apps receive update → pricing adjusts. Cells computed by a dedicated pricing service reading from location events.

### Q: Design for 10x traffic during peak (New Year Eve) 🔴 Senior

**A:**
- Location service: auto-scale write instances (Kafka consumers)
- Matching service: pre-warm instances, increase Redis cluster nodes
- Pre-compute surge cells more frequently (every 1 min vs 5 min)
- Enable graceful degradation: if matching takes > 500ms → show "High demand" instead of failing
- Rate limit aggressive retry from apps

---

**See also**: [Classic System Design Problems](./02-classic-problems.md) | [Message Queues Go](../02-backend-knowledge/08-message-queues.md) | [Grab Company Guide](../../shared/07-company-guides/03-grab.md)
