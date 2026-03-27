# Ride-Hailing System Design / Thiết Kế Hệ Thống Gọi Xe

> **Track**: BE | **Difficulty**: 🔴 Senior
> **Prerequisites**: [Design Framework](./01-design-framework.md) | [Classic Problems](./02-classic-problems.md)
> **See also**: [Message Queues](../02-backend-knowledge/08-message-queues.md) | [Distributed Systems](../02-backend-knowledge/03-distributed-systems.md) | [Grab Company Guide](../../shared/07-company-guides/03-grab.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Grab Engineering Blog (public):** Lúc peak hour tại TP.HCM, 500,000 driver đang online liên tục gửi location updates 5 giây/lần — tức 100,000 writes/giây chỉ riêng location data. PostgreSQL truyền thống không chịu được. Grab dùng Redis Sorted Set với geohash làm score: `ZADD drivers {geohash_score} {driver_id}`, tra cứu nearby drivers bằng `ZRANGEBYSCORE`. Matching latency: < 200ms.

**Bài học:** Ride-hailing không phải chỉ là CRUD app. Location indexing, real-time matching, và surge pricing phải được thiết kế từ đầu với scale constraints cụ thể.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Thiết kế hệ thống gọi xe giống điều phối taxi sân bay: có dispatcher (matching service), bộ đàm (WebSocket/MQTT cho real-time), bản đồ với vị trí xe cập nhật liên tục (location service), và hệ thống tính giá (fare service). Mỗi bộ phận phải làm việc trong < 1 giây để rider không bỏ đi.

**Why this problem:** "Design Grab" là câu hỏi kinh điển ở Grab, Go-Jek, và Be. Nó test đồng thời: geospatial indexing, real-time communication, distributed matching, và payment processing — tất cả trong 45 phút.

## Concept Map / Bản Đồ Khái Niệm

```
[Ride-Hailing Architecture]
        │
        ├── Location Service
        │     ├── Driver pushes location every 5s (WebSocket/MQTT)
        │     ├── Redis Sorted Set with geohash score
        │     └── ZRANGEBYSCORE for nearby driver lookup
        │
        ├── Matching Service
        │     ├── Rider request → find top-N nearby drivers
        │     ├── Score = distance + rating + acceptance rate
        │     └── Push via WebSocket, 30s timeout → reassign
        │
        ├── Trip Service
        │     ├── State machine: requested → accepted → in-progress → completed
        │     ├── Saga pattern: booking → payment → notification
        │     └── PostgreSQL for trip records (ACID for payments)
        │
        └── Surge Pricing
              ├── Supply/demand ratio per geo-cell
              ├── Recalculated every 30s
              └── Redis cache for price lookup
```

---

## Overview / Tổng Quan

| #   | Concept                     | Role                                                | Interview Weight |
| --- | --------------------------- | --------------------------------------------------- | ---------------- |
| 1   | **Location Service**        | Ingest 100k GPS writes/s, Redis GEO spatial index   | ⭐⭐⭐⭐⭐       |
| 2   | **Matching Service**        | Score & dispatch drivers, prevent double-dispatch   | ⭐⭐⭐⭐⭐       |
| 3   | **Geospatial Indexing**     | Geohash / H3 hex grid for O(log N) nearby search    | ⭐⭐⭐⭐         |
| 4   | **Real-Time Communication** | WebSocket gateway at 5M concurrent connections      | ⭐⭐⭐⭐         |
| 5   | **Trip State Machine**      | REQUESTED→MATCHED→IN_PROGRESS→COMPLETED + Saga      | ⭐⭐⭐⭐         |
| 6   | **Surge Pricing**           | Supply/demand per geo-cell, dynamic multiplier      | ⭐⭐⭐           |
| 7   | **Failure Handling**        | Driver crash, Redis down, payment failure, peak 10x | ⭐⭐⭐⭐         |

> Ride-hailing kết hợp **mọi thứ**: geospatial (Location + Indexing), real-time (WebSocket + Kafka), distributed coordination (Matching + double-dispatch lock), state management (Trip FSM + Saga), và dynamic pricing. Đây là bài test tổng hợp senior-level.

---

## Core Concepts — Phase 2 Deep Treatment

### Concept 1: Location Service

**🧠 Memory Hook:** "GPS heartbeat — 500k drivers, mỗi 5 giây, 100k writes/s. Redis GEO = bản đồ sống."

**Why exists (2+ levels):**

- Level 1: Cần biết driver ở đâu → để match với rider gần nhất
- Level 2: 100k writes/s vượt PostgreSQL write throughput → cần in-memory spatial index
- Level 3: Location data có TTL ngắn (30s) → stale driver tự expire → Redis fit perfect

**Layer 1 — Analogy / Ví dụ đơn giản:**
Giống bảng tracking xe buýt ở trạm: mỗi 5 giây GPS chip trên xe gửi vị trí → bảng cập nhật → hành khách thấy "xe gần nhất 0.8km". Redis GEO = bảng tracking với tốc độ microsecond.

**Layer 2 — Mechanics + Visual / Cơ chế kỹ thuật:**

```
Driver App (GPS) ──5s──▶ Location Service
                            │
                  ┌─────────┼──────────┐
                  ▼         ▼          ▼
              Redis GEO   Kafka      TTL 30s
              (GEOADD)   (event)    (heartbeat)
                  │
                  ▼
            GEORADIUSBYMEMBER
            → 20 nearest trong 5km
```

- `GEOADD drivers:active {lng} {lat} {driver_id}` — O(log N) insert
- `GEORADIUSBYMEMBER` — binary search trên geohash score
- Tiered storage: Redis (hot, 10min) → Cassandra (warm, 24h) → S3 (cold, analytics)

**Layer 3 — Edge Cases / Tình huống biên:**

- GPS drift trong tunnel → location nhảy → cần smoothing filter trước khi write
- Driver offline mà không disconnect → TTL 30s tự cleanup, nhưng matching window 30s có thể dispatch ghost driver
- Redis master failover → 1-2s write loss → location data self-heals từ next GPS push (idempotent by nature)

| Sai lầm                                  | Tại sao sai                                          | Đúng là                                            |
| ---------------------------------------- | ---------------------------------------------------- | -------------------------------------------------- |
| Dùng PostgreSQL cho location writes      | 100k writes/s vượt PG throughput, spatial query chậm | Redis GEO: in-memory, O(log N), auto-expire        |
| Không set TTL cho driver location        | Ghost drivers trong matching pool → phantom dispatch | TTL 30s, driver phải heartbeat liên tục            |
| Store toàn bộ location history vào Redis | Memory explosion: 500k × 720 events/h × 24h          | Tiered: Redis (hot) → Cassandra (warm) → S3 (cold) |

**🎯 Interview Pattern:** "Mô tả location ingestion pipeline cho 500K concurrent drivers" → Nêu write throughput → Redis GEO choice → tiered storage → TTL + heartbeat → Kafka for downstream

**🔗 Knowledge Chain:** Redis GEO → [Geospatial Indexing] → [Matching Service] → [Caching Patterns](../03-database-advanced/04-caching-patterns.md) → [Message Queues](../02-backend-knowledge/08-message-queues.md)

---

### Concept 2: Matching Service

**🧠 Memory Hook:** "SETNX = atomic claim ticket. Chỉ 1 rider được 1 driver. 15s timeout → next candidate."

**Why exists (2+ levels):**

- Level 1: Rider cần driver gần nhất, nhanh nhất → cần scoring algorithm
- Level 2: Race condition khi 2 rider cùng request 1 driver → cần distributed lock (SETNX)
- Level 3: Driver response time unpredictable → timeout + reassign logic để đảm bảo UX

**Layer 1 — Analogy / Ví dụ đơn giản:**
Giống dispatcher taxi sân bay: có danh sách taxi xếp hàng, khách đến → dispatcher chọn taxi đầu hàng → gọi qua bộ đàm → taxi confirm trong 15s hoặc skip. SETNX = "giữ chỗ" atomic — chỉ 1 dispatcher giữ được.

**Layer 2 — Mechanics + Visual / Cơ chế kỹ thuật:**

```
Rider Request
    │
    ▼
GEORADIUSBYMEMBER (top 20 candidates)
    │
    ▼
Filter (status=AVAILABLE, rating, vehicle)
    │
    ▼
Score = w1×(1/distance) + w2×rating + w3×acceptance
    │
    ▼
SETNX driver:{id}:lock "trip:{id}" EX 15
    │
    ├── Success → Push to Driver via WebSocket
    │               │
    │               ├── Accept → Create Trip
    │               └── Reject/Timeout → Release lock, next candidate
    │
    └── Fail (already locked) → Skip, try next
```

- Scoring weights tunable per market (VN vs SG vs Indonesia)
- Candidate pool size = tradeoff: 20 = fast, 50 = better match quality

**Layer 3 — Edge Cases / Tình huống biên:**

- Driver accepts request A, nhưng SETNX đã expire (15s) và rider B đã claim → driver thấy 2 trips → cần idempotent accept check
- Tất cả 20 candidates reject → widen radius (3km → 5km → 10km) → nếu vẫn không có → "No drivers available"
- Thundering herd: 1000 riders cùng request trong 1 geo-cell → queue + rate limit matching per cell

| Sai lầm                                  | Tại sao sai                                                         | Đúng là                                            |
| ---------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| Không dùng distributed lock cho matching | 2 riders matched cùng 1 driver → bad UX                             | SETNX atomic lock với TTL 15s                      |
| SETNX không có TTL                       | Driver crash → lock permanent → driver offline forever              | Luôn EX 15s (hoặc tunable timeout)                 |
| Match chỉ by distance                    | Driver gần nhưng rating thấp, acceptance rate thấp → bad experience | Multi-factor score: distance + rating + acceptance |

**🎯 Interview Pattern:** "How to prevent double-dispatch?" → SETNX atomic lock → TTL for safety → multi-factor scoring → timeout + reassign → race condition handling

**🔗 Knowledge Chain:** [Location Service] → Matching → [Distributed Locking](../02-backend-knowledge/03-distributed-systems.md) → [Circuit Breaker](./04-distributed-patterns.md) → [Trip State Machine]

---

### Concept 3: Geospatial Indexing

**🧠 Memory Hook:** "Geohash = GPS → string prefix. Nearby = same prefix. H3 hexagon = Uber's grid. Redis GEO = Grab's shortcut."

**Why exists (2+ levels):**

- Level 1: Naive O(N) distance calculation cho 500k drivers quá chậm
- Level 2: Geohash encode lat/lng thành string → nearby points share prefix → O(log N)
- Level 3: H3 hexagonal grid giải quyết edge effects của square grids (không có "corner neighbors" problem)

**Layer 1 — Analogy / Ví dụ đơn giản:**
Giống mã bưu điện: biết ZIP code 70000 = Sài Gòn, 70001 = Quận 1. Tìm "hàng xóm" = cùng prefix. Geohash = "ZIP code cho GPS" — "w3gv" = khu vực cụ thể, "w3g" = khu vực rộng hơn.

**Layer 2 — Mechanics + Visual / Cơ chế kỹ thuật:**

```
        Geohash Grid (zoom level 4)
    ┌──────┬──────┬──────┐
    │ w3gv │ w3gy │ w3gz │
    │  🚗  │      │  🚗  │
    ├──────┼──────┼──────┤
    │ w3gt │ w3gw │ w3gx │
    │      │  📍  │  🚗  │  📍 = Rider pickup
    ├──────┼──────┼──────┤
    │ w3gs │ w3gu │ w3gv │  🚗 = Driver
    │  🚗  │      │      │
    └──────┴──────┴──────┘

    Nearby search = current cell + 8 adjacent
    = 9 cells vs 500k full scan

H3 Hexagonal (Uber):
    Resolution 7 (~5km²): ride matching
    Resolution 9 (~0.1km²): surge pricing
    6 neighbors (hex) vs 8 neighbors (square)
```

- Redis GEO internally uses geohash-encoded sorted set scores
- `GEORADIUSBYMEMBER` = range scan trên sorted set → O(log N + M) where M = results

**Layer 3 — Edge Cases / Tình huống biên:**

- Geohash boundary problem: 2 points cạnh nhau nhưng khác prefix cell → phải search adjacent cells
- H3 resolution selection matters: quá coarse → too many drivers per cell, quá fine → too many cells to scan
- Over water / river boundary: driver bên kia sông geohash gần nhưng route xa → cần route distance, not straight-line

| Sai lầm                                           | Tại sao sai                                      | Đúng là                                                                     |
| ------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------- |
| Chỉ search current geohash cell                   | Miss drivers ở boundary → incomplete results     | Search current + adjacent cells (8 for square, 6 for hex)                   |
| Dùng straight-line distance cho matching          | Sông, cầu, one-way streets → actual route gấp 3x | Use straight-line for candidate filtering, route distance for final scoring |
| Dùng single resolution cho cả matching và pricing | Matching cần ~5km, pricing cần ~0.1km resolution | Multi-resolution: coarse for matching, fine for pricing                     |

**🎯 Interview Pattern:** "Explain spatial indexing for ride-hailing" → geohash concept → adjacent cell search → H3 hex advantage → Redis GEO implementation → boundary edge case

**🔗 Knowledge Chain:** [Location Service] → Geospatial → [Matching Service] → [NoSQL/Redis](../03-database-advanced/03-nosql-redis-mongo.md) → [Indexing](../03-database-advanced/02-indexing-optimization.md)

---

### Concept 4: Real-Time Communication

**🧠 Memory Hook:** "WebSocket gateway = 50 servers × 100k connections = 5M concurrent. Redis Pub/Sub route message to correct server."

**Why exists (2+ levels):**

- Level 1: Rider cần thấy driver di chuyển real-time trên map → push, không phải poll
- Level 2: HTTP polling mỗi 1s × 5M users = 5M req/s → waste bandwidth, high latency
- Level 3: WebSocket stateful → cần sticky routing + Redis Pub/Sub để route message đến đúng server

**Layer 1 — Analogy / Ví dụ đơn giản:**
Giống bộ đàm taxi: dispatcher phát "Xe 456 đang ở ngã tư Lê Lợi" → chỉ rider đang đợi xe 456 nghe được. WebSocket = kênh bộ đàm riêng. Redis Pub/Sub = tổng đài route đúng kênh.

**Layer 2 — Mechanics + Visual / Cơ chế kỹ thuật:**

```
Driver GPS ──▶ Location Service ──▶ Kafka
                                       │
                                       ▼
                              Trip Tracking Service
                                       │
                              Redis Pub/Sub: channel="rider:{id}"
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
              WS Gateway 1      WS Gateway 2      WS Gateway 50
              (100k conns)      (100k conns)      (100k conns)
                    │
                    ▼
              Rider App (map update)
```

- MQTT alternative cho mobile (lower battery, reconnect handling built-in)
- Sticky session via consistent hashing: rider_id → gateway server

**Layer 3 — Edge Cases / Tình huống biên:**

- Gateway server crash → 100k connections drop → client reconnect → load spike on remaining servers → need circuit breaker
- Redis Pub/Sub message loss (fire-and-forget) → use Redis Streams for critical events (ride status changes)
- Mobile goes to background → WebSocket disconnect → push notification fallback for critical events (driver arrived)

| Sai lầm                                     | Tại sao sai                                    | Đúng là                                                 |
| ------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------- |
| Dùng HTTP polling thay WebSocket            | 5M × 1 req/s = 5M req/s, high latency          | WebSocket push: chỉ gửi khi có update, < 100ms latency  |
| Không có sticky routing cho WebSocket       | Broadcast all servers → waste, race conditions | Consistent hashing: rider_id → specific gateway         |
| Rely 100% Redis Pub/Sub cho critical events | Pub/Sub fire-and-forget, message loss possible | Redis Streams cho ride status, Pub/Sub cho location chỉ |

**🎯 Interview Pattern:** "How to push real-time driver location to millions of riders?" → WebSocket + gateway cluster → Redis Pub/Sub routing → sticky sessions → fallback strategies

**🔗 Knowledge Chain:** [Location Service] → [Kafka](../02-backend-knowledge/08-message-queues.md) → Real-Time → [Networking](../02-backend-knowledge/06-networking-go.md) → [Resilience](../02-backend-knowledge/07-resilience-patterns.md)

---

### Concept 5: Trip State Machine

**🧠 Memory Hook:** "5 states: REQUESTED → MATCHED → IN_PROGRESS → COMPLETED → (CANCELLED). Saga = booking + payment + notification."

**Why exists (2+ levels):**

- Level 1: Trip lifecycle cần tracking chính xác → state machine đảm bảo valid transitions only
- Level 2: Payment phải ACID (PostgreSQL) nhưng notification + analytics có thể eventual → Saga pattern
- Level 3: Invalid state transitions (e.g., COMPLETED → MATCHED) phải bị reject → state machine constraint

**Layer 1 — Analogy / Ví dụ đơn giản:**
Giống đơn hàng Shopee: Đặt hàng → Xác nhận → Đang giao → Hoàn thành → (Hủy). Mỗi bước có action cụ thể. Không thể "Hoàn thành" trước "Đang giao". State machine = rule book.

**Layer 2 — Mechanics + Visual / Cơ chế kỹ thuật:**

```
    REQUESTED ──match──▶ MATCHED ──pickup──▶ IN_PROGRESS ──complete──▶ COMPLETED
        │                    │                    │
        └────cancel──────────┴────cancel──────────┘
                             │
                         CANCELLED

    Saga Pattern (distributed):
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ Booking  │───▶│ Payment  │───▶│  Notify  │
    │ Service  │    │ Service  │    │ Service  │
    └──────────┘    └──────────┘    └──────────┘
         │               │
         ▼               ▼
    Compensate:     Compensate:
    Cancel trip     Refund payment
```

- Trip table in PostgreSQL (ACID for payment integrity)
- State transitions logged to Kafka for audit trail
- Saga compensations: cancel booking → refund → notify rider

**Layer 3 — Edge Cases / Tình huống biên:**

- Driver accepts nhưng rider cancels 1s sau → race condition → cần optimistic locking hoặc version check
- Trip COMPLETED nhưng payment fails → trip stays COMPLETED, payment retries in background → driver guaranteed payment
- Network partition: driver marks "arrived" nhưng server doesn't receive → client retry with idempotency key

| Sai lầm                                      | Tại sao sai                                                               | Đúng là                                                            |
| -------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Không dùng state machine, dùng boolean flags | is_matched + is_started + is_completed = 8 possible states, nhiều invalid | Enum state machine: chỉ 5 valid states, valid transitions enforced |
| Dùng 2PC cho cross-service transaction       | Blocking, poor availability, overkill cho ride-hailing                    | Saga pattern: local transactions + compensations                   |
| Không có idempotency cho state transitions   | Network retry → duplicate state change → inconsistent                     | Idempotency key per transition + version check                     |

**🎯 Interview Pattern:** "How to manage trip lifecycle across services?" → State machine → PostgreSQL for ACID → Saga for distributed → compensation logic → idempotency

**🔗 Knowledge Chain:** [Matching Service] → Trip FSM → [Distributed Transactions](../02-backend-knowledge/03-distributed-systems.md) → [Saga Pattern](./04-distributed-patterns.md) → [Payment]

---

### Concept 6: Surge Pricing

**🧠 Memory Hook:** "H3 hex cell → count riders/drivers → ratio > threshold → multiplier. Recalculate every 30s-5min."

**Why exists (2+ levels):**

- Level 1: Peak demand (mưa, giờ cao điểm) → drivers thiếu → cần incentive tăng giá để thu hút driver
- Level 2: Global flat surge không fair → per-cell pricing (Quận 1 surge 2x, Thủ Đức normal)
- Level 3: Surge phải real-time nhưng stable (không nhảy giá mỗi giây) → 30s-5min window + smoothing

**Layer 1 — Analogy / Ví dụ đơn giản:**
Giống giá vé máy bay: ngày Tết nhiều người bay → giá tăng. Nhưng thay vì 1 giá cho cả nước, chia theo tuyến (SGN→HAN surge, SGN→ĐN normal). H3 cell = "tuyến" cho ride-hailing.

**Layer 2 — Mechanics + Visual / Cơ chế kỹ thuật:**

```
    H3 Resolution 9 cells (~0.1km²)
    ┌─────┬─────┬─────┐
    │ 1.0 │ 1.5 │ 2.0 │  ← surge multiplier
    │ 3R  │ 5R  │ 8R  │  R = riders waiting
    │ 5D  │ 4D  │ 2D  │  D = drivers available
    └─────┴─────┴─────┘

    Calculation:
    ratio = riders_waiting / drivers_available
    if ratio > 1.5: surge = 1.0 + (ratio - 1.5) × 0.5
    cap at 3.0x (regulatory limit VN)

    Pipeline:
    Location events → Aggregate per H3 cell (30s window)
                   → Pricing Service calculates multiplier
                   → Redis cache: surge:{cell_id} = 2.0
                   → Kafka broadcast → all apps update
```

**Layer 3 — Edge Cases / Tình huống biên:**

- Surge oscillation: giá tăng → rider cancel → demand giảm → giá giảm → rider quay lại → loop → cần dampening algorithm
- Regulatory cap: VN/Indonesia có giới hạn surge multiplier → hard cap in pricing logic
- Gaming: driver group tắt app cùng lúc → supply giảm → surge tăng → bật lại → cần anti-gaming detection

| Sai lầm                                      | Tại sao sai                                               | Đúng là                                    |
| -------------------------------------------- | --------------------------------------------------------- | ------------------------------------------ |
| Global surge (1 multiplier cho cả thành phố) | Quận 1 mưa surge 3x, Thủ Đức nắng normal → unfair pricing | Per-cell H3 surge: granular, fair          |
| Recalculate mỗi giây                         | Surge nhảy liên tục → bad UX, oscillation                 | 30s-5min window + dampening smoothing      |
| Không có surge cap                           | Price spike 10x → backlash, regulatory issues             | Hard cap (VN: 3x) + soft cap with warnings |

**🎯 Interview Pattern:** "How does surge pricing work at scale?" → H3 geo-cells → demand/supply ratio → multiplier formula → dampening → Redis cache → broadcast

**🔗 Knowledge Chain:** [Geospatial Indexing] → Surge Pricing → [Location Service] → [Caching](../03-database-advanced/04-caching-patterns.md) → [Analytics]

---

### Concept 7: Failure Handling

**🧠 Memory Hook:** "4 failure modes: Driver crash (heartbeat timeout), Matching down (Kafka buffer), Redis down (Cassandra fallback), Payment fail (retry queue)."

**Why exists (2+ levels):**

- Level 1: Distributed system → components will fail → need graceful degradation
- Level 2: Rider đang trong trip mà driver crash → cần detect + alert + re-assign trong 30s
- Level 3: Redis down = no real-time location → fallback to last-known (Cassandra) → degraded matching still works

**Layer 1 — Analogy / Ví dụ đơn giản:**
Giống hãng hàng không: máy bay hư → chuyển sang máy bay dự phòng (failover). Phi công bệnh → co-pilot tiếp quản (fallback). Hệ thống đặt vé sập → queue chờ (Kafka buffer). Mỗi failure có playbook riêng.

**Layer 2 — Mechanics + Visual / Cơ chế kỹ thuật:**

```
    Failure Detection & Recovery
    ┌─────────────────┬──────────────────┬────────────────────┐
    │ Component       │ Detection        │ Recovery           │
    ├─────────────────┼──────────────────┼────────────────────┤
    │ Driver crash    │ No heartbeat 30s │ Alert rider, queue │
    │ Matching svc    │ Health check     │ Kafka buffer rides │
    │ Redis location  │ Sentinel detect  │ Cassandra fallback │
    │ Payment fail    │ Timeout/error    │ Retry queue + DLQ  │
    │ WS Gateway      │ LB health check  │ Client reconnect   │
    │ Kafka broker    │ ISR < min        │ Replica promotion  │
    └─────────────────┴──────────────────┴────────────────────┘
```

- Circuit breaker on matching service → fallback to "wider radius" matching
- Bulkhead: location writes isolated from trip writes → location failure doesn't affect payment
- Chaos engineering: Grab runs Game Day exercises simulating Redis failure, Kafka partition loss

**Layer 3 — Edge Cases / Tình huống biên:**

- Cascading failure: Redis down → matching slow → requests queue → Kafka lag → all services degraded → need load shedding
- Split brain: 2 matching instances both think they're leader → double dispatch → need consensus (Raft/SETNX)
- New Year's Eve 10x traffic: pre-warm instances, increase Redis nodes, tighter surge recalculation (1min vs 5min), graceful degradation (show "High demand" vs error)

| Sai lầm                          | Tại sao sai                              | Đúng là                                                       |
| -------------------------------- | ---------------------------------------- | ------------------------------------------------------------- |
| Không có fallback khi Redis down | Entire matching service fails → no rides | Cassandra fallback for last-known location, degraded matching |
| Retry payment vô hạn             | Charge rider multiple times              | Idempotency key + max 3 retries → DLQ → manual review         |
| Không test failure scenarios     | First real failure = chaos               | Game Day exercises, chaos engineering regularly               |

**🎯 Interview Pattern:** "What happens if [component] fails?" → Detection mechanism → Recovery strategy → Degradation level → Blast radius containment → Chaos testing

**🔗 Knowledge Chain:** [Resilience Patterns](../02-backend-knowledge/07-resilience-patterns.md) → Failure Handling → [Circuit Breaker](./04-distributed-patterns.md) → [Observability](./05-observability-and-scale.md) → [Distributed Systems](../02-backend-knowledge/03-distributed-systems.md)

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

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                               | Difficulty | Core Concept     | Key Signal                                                   |
| --- | -------------------------------------- | ---------- | ---------------- | ------------------------------------------------------------ |
| Q1  | How to prevent driver double-dispatch? | 🔴         | Matching         | SETNX atomic lock + TTL → only 1 rider claims driver         |
| Q2  | How does surge pricing work at scale?  | 🔴         | Surge Pricing    | H3 hex cells + demand/supply ratio + dampening + Redis cache |
| Q3  | Design for 10x traffic (New Year Eve)  | 🔴         | Failure Handling | Pre-warm + auto-scale + tighter surge + graceful degradation |

**Distribution:** 🟢 0 | 🟡 0 | 🔴 3

> **Note:** File này là deep dive system design — Q&A ít nhưng mỗi câu là senior-level trả lời 5+ phút. Toàn bộ content trong Component Deep Dives chính là "theory block" cho interview.

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **"Rider request a ride — walk me through what happens from tap to driver assignment."**

**30-second answer:**
"Rider taps request → API Gateway → Matching Service queries Redis GEO với GEORADIUSBYMEMBER lấy 20 drivers gần nhất trong 3km. Filter by status=AVAILABLE + rating + vehicle type. Score mỗi driver bằng weighted formula (distance + rating + acceptance rate). SETNX lock top candidate driver với TTL 15s → push qua WebSocket. Driver accept trong 15s → create trip record (PostgreSQL) + notify rider. Nếu timeout → release lock, try next candidate."

**Follow-up:** "What if all 20 candidates reject or timeout?"
→ "Widen radius: 3km → 5km → 10km. Nếu vẫn không → return 'No drivers available' + suggest retry in 2min. Track failure rate per geo-cell → nếu cao liên tục → trigger surge để attract drivers."

---

## Self-Check / Tự Kiểm Tra

Đóng tài liệu. Trả lời trong 2 phút mỗi câu:

| #   | Type        | Question                                                            | Key Points                                                                                                           |
| --- | ----------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | Retrieval   | Vẽ high-level architecture của ride-hailing (6+ components)         | API GW → Location Svc (Redis GEO) → Matching Svc → Trip Svc (PG) → WS Gateway → Kafka → Surge/Analytics/Notification |
| 2   | Visual      | Vẽ trip state machine với 5 states và 2 cancellation paths          | REQUESTED→MATCHED→IN_PROGRESS→COMPLETED, cancel from REQUESTED/MATCHED/IN_PROGRESS                                   |
| 3   | Application | 500k drivers, 5s interval → tính QPS location writes và storage/day | 100k writes/s, ~8GB/day raw location, Redis chỉ giữ latest per driver                                                |
| 4   | Debug       | Redis location store down → impact gì và recovery strategy?         | Matching degrades to Cassandra last-known, location data self-heals khi Redis recover từ next GPS push               |
| 5   | Teach       | Giải thích geohash boundary problem cho đồng nghiệp non-spatial     | 2 points cạnh nhau nhưng khác geohash prefix → phải search adjacent cells (8 square / 6 hex)                         |

💬 **Feynman Prompt:** Giải thích tại sao matching service cần "timeout + reassign" logic — và điều gì xảy ra nếu driver accept sau khi đã được reassign cho rider khác?

---

## Spaced Repetition / Lặp Lại Theo Khoảng Cách

| Round | When   | Focus                                                                |
| ----- | ------ | -------------------------------------------------------------------- |
| 1     | Day 1  | Đọc toàn bộ + vẽ architecture diagram from memory                    |
| 2     | Day 3  | Cold Call + Self-Check (close doc, 2 min/question)                   |
| 3     | Day 7  | Mock interview: "Design Grab" 45-minute whiteboard                   |
| 4     | Day 14 | Focus on failure scenarios: Redis down, 10x traffic, payment fail    |
| 5     | Day 30 | Full review: architecture + matching + geospatial + surge + failures |

---

## Connections / Liên Kết

**Same-track (BE System Design):**

- ⬅️ [Design Framework](./01-design-framework.md) — apply all 5 steps to this problem
- ⬅️ [Classic Problems](./02-classic-problems.md) — chat system (WebSocket), rate limiter (per geo-cell)
- ⬅️ [Advanced Problems](./03-advanced-problems.md) — notification system, payment idempotency
- ⬅️ [Distributed Patterns](./04-distributed-patterns.md) — Saga for booking flow, Circuit Breaker for matching
- ⬅️ [Observability & Scale](./05-observability-and-scale.md) — SLI/SLO for matching latency, incident response

**Cross-track:**

- 🔗 [Message Queues](../02-backend-knowledge/08-message-queues.md) — Kafka for location events, ride events
- 🔗 [Distributed Systems](../02-backend-knowledge/03-distributed-systems.md) — CAP tradeoffs, distributed locking
- 🔗 [NoSQL/Redis](../03-database-advanced/03-nosql-redis-mongo.md) — Redis GEO, Sorted Sets, Pub/Sub
- 🔗 [Grab Company Guide](../../shared/07-company-guides/03-grab.md) — interview expectations and past questions
