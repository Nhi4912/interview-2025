# Classic System Design Problems - Deep Theory

---

## Framework Approach (RESHADED)

Mỗi bài system design nên follow framework sau:

```
┌──────────────────────────────────────────────────┐
│  1. Requirements  → Functional + Non-functional  │
│  2. Estimation    → QPS, storage, bandwidth      │
│  3. High-Level    → Core components + data flow  │
│  4. Deep Dive     → Tricky parts + tradeoffs     │
│  5. Wrap-up       → Bottlenecks + improvements   │
└──────────────────────────────────────────────────┘
```

| Level | Interviewer kỳ vọng gì? |
|-------|-------------------------|
| **Middle** | Vẽ được high-level design hợp lý, biết các component cơ bản, explain được data flow |
| **Senior** | Deep dive vào tradeoffs, giải thích WHY chọn giải pháp này, handle edge cases, estimation chính xác, discuss scale bottlenecks |

---

## 1. URL Shortener (TinyURL)

### Q: Design một URL Shortener service. Walk through từng bước. 🟢 [Junior]

**A:**

#### Step 1 — Requirements

| Functional | Non-functional |
|-----------|---------------|
| Shorten a long URL → short URL | High availability (99.99%) |
| Redirect short URL → original URL | Low latency redirect (< 10ms) |
| Custom alias (optional) | Read-heavy (100:1 read/write ratio) |
| Link expiration (TTL) | URL không đoán được (not sequential) |
| Analytics (click count, geo) | Scale to billions of URLs |

#### Step 2 — Estimation

```
Write: 100M URLs/day → ~1200 URLs/sec
Read:  100:1 ratio  → 120,000 redirects/sec

Storage per URL: ~500 bytes (short_url + long_url + metadata)
Storage/day:     100M × 500B = 50GB/day
Storage/5 years: 50GB × 365 × 5 ≈ 91TB

Bandwidth:
  Write: 1200 × 500B = 600KB/s (trivial)
  Read:  120K × 500B = 60MB/s

Cache (20% hot URLs theo Pareto):
  120K × 86400 × 0.2 × 500B ≈ 100GB → fits in memory
```

#### Step 3 — High-Level Design

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐
│  Client   │────▶│  API Gateway  │────▶│  App Server  │
└──────────┘     │  (Rate Limit) │     │  (Go/Java)   │
                 └──────────────┘     └──────┬──────┘
                                             │
                      ┌──────────────────────┼──────────────┐
                      │                      │              │
                      ▼                      ▼              ▼
               ┌────────────┐      ┌──────────────┐  ┌──────────┐
               │   Cache     │      │   Database    │  │ Analytics│
               │  (Redis)    │      │  (Cassandra/  │  │ (Kafka → │
               │             │      │   DynamoDB)   │  │  Spark)  │
               └────────────┘      └──────────────┘  └──────────┘

API:
  POST /api/v1/shorten  { "url": "https://...", "alias": "my-link" }
  GET  /:shortCode       → 301/302 Redirect
  GET  /api/v1/stats/:shortCode → click analytics
```

#### Step 4 — Deep Dive

**Q: Hash function nào cho short URL? Tại sao?**

| Approach | Pros | Cons |
|----------|------|------|
| **MD5 → Base62 (first 7 chars)** | Deterministic, no coordination | Collision possible, cần check DB |
| **Base62 encoding of auto-increment ID** | No collision | Sequential → predictable, single point of failure |
| **Snowflake ID → Base62** | No collision, distributed | Longer URL, complex setup |
| **Random Base62 (7 chars)** | Simple, unpredictable | Collision check needed |

Base62 với 7 ký tự: `62^7 = 3.5 trillion` combinations → đủ dùng cho hàng tỉ URL.

```
Recommended: Counter-based with Zookeeper range allocation

┌─────────────────────────────────────────────────────────┐
│  Zookeeper assigns ID ranges to each app server:        │
│                                                         │
│  Server 1: [1..1,000,000]                               │
│  Server 2: [1,000,001..2,000,000]                       │
│  Server 3: [2,000,001..3,000,000]                       │
│                                                         │
│  Each server increments locally → no coordination!      │
│  ID → Base62 encode → short URL                         │
│                                                         │
│  ID = 12345 → Base62("12345") = "dnh" (3 chars)        │
│  ID = 3,500,000,000 → Base62 = "3dJ2k5" (6 chars)     │
└─────────────────────────────────────────────────────────┘
```

**Q: 301 vs 302 redirect — chọn cái nào?**

| Redirect | Meaning | Implication |
|----------|---------|-------------|
| **301 Moved Permanently** | Browser cache redirect | Ít request tới server → giảm load, NHƯNG mất analytics |
| **302 Found (Temporary)** | Browser luôn gọi lại server | Mỗi click đều qua server → đếm analytics chính xác |

→ Nếu cần analytics: dùng **302**. Nếu chỉ cần redirect nhanh: dùng **301**.

**Q: Collision handling thế nào?**

```
shortURL = base62(md5(longURL)[:7])

if exists(shortURL):
    # Collision! Append random suffix và retry
    shortURL = base62(md5(longURL + random_salt)[:7])
    retry up to N times

# Alternative: Bloom filter check trước khi query DB
# Bloom filter ~1GB cho 10B entries → rất nhẹ
```

**Q: Caching strategy cho redirect?**

```
┌────────┐  miss   ┌──────┐  miss   ┌────────┐
│ Client  │───────▶│ Redis │───────▶│   DB    │
└────────┘        │ Cache │        └────┬───┘
                  └───┬──┘             │
                      │◀───────────────┘
                      │   write-back to cache
                      │
Cache policy: LRU eviction
TTL: 24-48 hours (hot URLs)
Hit rate mong đợi: 80-90% (Pareto distribution)
```

**Q: Analytics pipeline design?**

```
Click event → Kafka topic "url_clicks"
  → Consumer group 1: Real-time counter (Redis INCR)
  → Consumer group 2: Batch analytics (Spark → data warehouse)
  
Event payload:
{
  "short_url": "abc123",
  "timestamp": "2024-01-15T10:30:00Z",
  "ip": "...",
  "user_agent": "...",
  "referer": "..."
}
```

| Level | Kỳ vọng |
|-------|---------|
| **Middle** | Biết hash + Base62, vẽ basic architecture, biết cần cache |
| **Senior** | Distributed ID generation, explain 301 vs 302 tradeoff, Bloom filter cho collision, analytics pipeline, consistent hashing cho DB sharding |

---

## 2. Chat System (WhatsApp/Zalo-like) ⭐ VERY RELEVANT FOR ZALO

### Q: Design một real-time chat system giống WhatsApp/Zalo. 🟡 [Mid]

**A:**

#### Step 1 — Requirements

| Functional | Non-functional |
|-----------|---------------|
| 1-on-1 chat | Low latency (< 100ms same region) |
| Group chat (up to 500 members) | High availability 99.99% |
| Online/offline status | Message ordering guaranteed |
| Read receipts (delivered, read) | At-least-once delivery |
| Media sharing (image, video) | End-to-end encryption |
| Push notification for offline users | Support 50M concurrent users |

#### Step 2 — Estimation

```
DAU: 50M users
Messages/day: 50M × 40 msgs = 2B messages/day
QPS: 2B / 86400 ≈ 23,000 messages/sec (peak: ~70K/sec)

Message size: ~200 bytes (text) → 2B × 200B = 400GB/day
Media: 10% messages have media, avg 200KB → 200M × 200KB = 40TB/day

Concurrent WebSocket connections: ~5M (10% of DAU online)
```

#### Step 3 — High-Level Design

```
┌──────────┐   WebSocket    ┌──────────────────┐
│ Client A  │◀─────────────▶│  Chat Server 1    │
└──────────┘               │  (Go - goroutine) │
                           └────────┬─────────┘
                                    │
┌──────────┐   WebSocket    ┌───────┴──────────┐     ┌──────────────┐
│ Client B  │◀─────────────▶│  Chat Server 2    │◀───▶│ Message Queue │
└──────────┘               │  (Go - goroutine) │     │   (Kafka)     │
                           └───────┬──────────┘     └──────┬───────┘
                                   │                        │
                           ┌───────┴────────┐       ┌──────┴───────┐
                           │  Session/       │       │  Message DB   │
                           │  Presence       │       │  (Cassandra)  │
                           │  Service        │       │               │
                           │  (Redis)        │       │  Media: S3    │
                           └────────────────┘       └──────────────┘

                           ┌────────────────┐
                           │  Push Notif     │
                           │  Service        │
                           │  (APNs/FCM)     │
                           └────────────────┘
```

#### Step 4 — Deep Dive

**Q: Message flow cho 1-on-1 chat diễn ra thế nào?**

```
User A sends message to User B:

1. A ──[WebSocket]──▶ Chat Server 1
2. Chat Server 1:
   a. Generate message_id (Snowflake)
   b. Store message to Cassandra (async)
   c. Lookup "Which chat server is B connected to?" (Redis)
3. If B is ONLINE on Chat Server 2:
   a. Chat Server 1 ──[Kafka/internal]──▶ Chat Server 2
   b. Chat Server 2 ──[WebSocket]──▶ B
   c. B sends ACK → mark as "delivered" ✓✓
4. If B is OFFLINE:
   a. Store in offline message queue
   b. Send push notification via APNs/FCM
   c. When B comes online → pull offline messages

Timeline:
  A sends ──[10ms]──▶ Server ──[5ms]──▶ Kafka ──[5ms]──▶ Server 2 ──[10ms]──▶ B
  Total: ~30ms same region
```

**Q: Message ordering đảm bảo thế nào?**

Đây là vấn đề QUAN TRỌNG nhất trong chat system.

```
Problem: Network delay có thể khiến message đến sai thứ tự

Solution: Server-side sequence number per conversation

┌─────────────────────────────────────────────────────┐
│  Mỗi conversation có một monotonically increasing   │
│  sequence number (atomic counter trong Redis)        │
│                                                     │
│  conversation_id: "A-B"                              │
│  Message 1: seq=1, "Hello"        (from A)          │
│  Message 2: seq=2, "Hi there"     (from B)          │
│  Message 3: seq=3, "How are you?" (from A)          │
│                                                     │
│  Client hiển thị theo seq number, KHÔNG theo         │
│  timestamp nhận được                                │
└─────────────────────────────────────────────────────┘

Tại sao không dùng timestamp?
- Clock skew giữa các server (vài ms → sai thứ tự)
- Network delay không đều
→ Dùng Lamport timestamp hoặc server-assigned sequence
```

**Q: Group message fan-out strategy?**

```
Scenario: Group có 500 members, 1 user gửi message

Option A — Write-time fan-out (small groups):
  ┌──────────────────────────────────────────────┐
  │  User sends msg to Group G (500 members)     │
  │  → Write 500 entries to message_inbox table  │
  │  → Mỗi member có 1 copy trong inbox          │
  │                                              │
  │  Pros: Read đơn giản (query own inbox)       │
  │  Cons: Write amplification 500x              │
  └──────────────────────────────────────────────┘

Option B — Read-time fan-out (large groups):
  ┌──────────────────────────────────────────────┐
  │  Write 1 entry to group_messages table       │
  │  → Mỗi member query group_messages khi mở   │
  │    conversation                              │
  │                                              │
  │  Pros: 1 write only                          │
  │  Cons: Read cần query group table            │
  └──────────────────────────────────────────────┘

WhatsApp/Zalo approach:
  - Groups ≤ 200 members: Write-time fan-out
  - Groups > 200 members: Read-time fan-out
  - Notify online members via WebSocket immediately
  - Offline members: push notification + pull khi online
```

**Q: Presence system (online/offline status) design thế nào?**

```
Heartbeat-based presence:

┌─────────┐  heartbeat every 5s  ┌───────────────┐
│  Client  │────────────────────▶│ Presence Service│
└─────────┘                     │ (Redis)         │
                                └───────┬─────────┘
                                        │
                                Redis key per user:
                                  user:123:last_seen = timestamp
                                  TTL = 30 seconds

Logic:
  - Client gửi heartbeat mỗi 5s
  - Server SET key với TTL 30s
  - Nếu key expired → user offline
  - User online? → EXISTS user:123:last_seen

Optimization cho group:
  - KHÔNG broadcast online status cho mọi member
  - Chỉ query status khi user mở conversation
  - Subscribe status changes cho users đang hiển thị trên screen
  
Fan-out vấn đề:
  User có 500 friends, mỗi lần online/offline → 500 notifications?
  → Dùng pull model: friends query status khi cần
  → Hoặc pub/sub chỉ cho users đang active trên app
```

**Q: Tại sao Go phù hợp cho chat server?**

```
Go goroutine model cho WebSocket:

┌─────────────────────────────────────────────────────┐
│  Mỗi WebSocket connection = 1 goroutine             │
│  Goroutine stack: ~2-8KB (vs thread: ~1MB)          │
│                                                     │
│  1 server (32GB RAM) có thể handle:                 │
│    32GB / 8KB = ~4M goroutines = ~4M connections    │
│                                                     │
│  Thực tế (với buffer, state):                       │
│    ~500K-1M connections per server                   │
│                                                     │
│  So sánh:                                           │
│    Java (Netty): ~100K-500K connections/server       │
│    Node.js: ~100K connections/server                 │
│    Go: ~500K-1M connections/server                   │
│                                                     │
│  → Go rất phù hợp cho chat server nhờ lightweight   │
│    goroutine + efficient scheduler                  │
└─────────────────────────────────────────────────────┘
```

**Q: Media storage design?**

```
Upload flow:
1. Client request pre-signed URL from server
2. Client upload trực tiếp lên S3 (bypass app server)
3. S3 trigger → generate thumbnail + compress
4. Store media_url trong message metadata
5. Serve qua CDN

┌────────┐  1. get upload URL  ┌──────────┐
│ Client  │───────────────────▶│ App Server│
└───┬────┘                    └─────┬────┘
    │  2. upload directly              │ pre-signed URL
    ▼                                  ▼
┌────────┐  3. process        ┌──────────┐
│   S3    │──────────────────▶│  Lambda   │ (thumbnail, compress)
└───┬────┘                    └──────────┘
    │  4. serve via CDN
    ▼
┌────────┐
│  CDN    │──────────▶ Recipients
└────────┘

Tại sao pre-signed URL?
- App server không cần handle large file upload
- Giảm bandwidth + CPU trên app server
- S3 handle scale tốt hơn
```

| Level | Kỳ vọng |
|-------|---------|
| **Middle** | WebSocket connection, basic message flow, biết cần message queue |
| **Senior** | Message ordering (sequence number), group fan-out strategy, presence optimization, Go goroutine model, media upload via pre-signed URL, offline message handling, E2E encryption concept |

---

## 3. Ride-Sharing Service (Grab-like) ⭐ VERY RELEVANT FOR GRAB

### Q: Design một ride-sharing service như Grab. 🟡 [Mid]

**A:**

#### Step 1 — Requirements

| Functional | Non-functional |
|-----------|---------------|
| Rider request a ride | Low latency matching (< 5s) |
| Match nearby driver | Real-time location tracking |
| Real-time tracking on map | High availability 99.99% |
| Fare estimation + surge pricing | Handle 1M concurrent rides |
| Payment processing | Accurate ETA |
| Rating system | Location update: 3s interval |

#### Step 2 — Estimation

```
Active drivers: 1M simultaneously
Active riders:  5M simultaneously
Rides/day:      10M
Peak concurrent rides: 1M

Location updates:
  1M drivers × update every 3s = 333K updates/sec
  Each update: ~100 bytes (lat, lng, timestamp, driver_id)
  Bandwidth: 333K × 100B = 33MB/s

Matching requests: peak 10K/sec
```

#### Step 3 — High-Level Design

```
┌──────────┐                    ┌──────────┐
│  Rider    │                    │  Driver   │
│  App      │                    │  App      │
└─────┬────┘                    └─────┬────┘
      │                               │ location updates (3s)
      │  request ride                  │
      ▼                               ▼
┌──────────────────────────────────────────────────┐
│                 API Gateway / LB                  │
└──────┬──────────┬───────────┬──────────┬─────────┘
       │          │           │          │
       ▼          ▼           ▼          ▼
┌──────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐
│  Trip     │ │ Location  │ │ Matching│ │ Pricing  │
│  Service  │ │ Service   │ │ Service │ │ Service  │
└──────────┘ └──────────┘ └─────────┘ └──────────┘
       │          │           │          │
       ▼          ▼           ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Trip DB   │ │ Location  │ │ Driver   │ │ Pricing  │
│ (Postgres)│ │ Index     │ │ Queue    │ │ Rules    │
│           │ │ (Redis +  │ │ (Redis)  │ │ (Config) │
│           │ │  H3/S2)   │ │          │ │          │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

┌──────────┐  ┌──────────────┐
│ Payment   │  │ Notification  │
│ Service   │  │ Service       │
└──────────┘  └──────────────┘
```

#### Step 4 — Deep Dive

**Q: Geospatial indexing — làm sao tìm driver gần rider?**

Đây là BÀI TOÁN CORE của ride-sharing.

```
Option 1: Geohash
  - Chia map thành grid cells bằng geohash prefix
  - Geohash "w21z" → specific area ~5km × 5km
  - Tìm drivers: query geohash prefix + 8 neighbors
  
  Vấn đề: grid cells có kích thước cố định
  → Vùng đông đúc (city center) có quá nhiều drivers trong 1 cell
  → Vùng thưa thớt (rural) cell quá rộng

Option 2: H3 (Uber's hexagonal grid) ← Recommended
  ┌────────────────────────────────────────────────────┐
  │  H3 chia Earth thành hexagonal cells               │
  │  Multiple resolutions: 0 (biggest) → 15 (smallest)│
  │                                                    │
  │  Resolution 9: ~0.1 km² (phù hợp urban)          │
  │  Resolution 7: ~5 km²   (phù hợp suburban)       │
  │                                                    │
  │     ╱╲   ╱╲   ╱╲                                  │
  │    │ D│  │  │  │ D│   D = driver                   │
  │     ╲╱   ╲╱   ╲╱                                  │
  │     ╱╲   ╱╲   ╱╲                                  │
  │    │ R│  │ D│  │  │   R = rider                    │
  │     ╲╱   ╲╱   ╲╱                                  │
  │                                                    │
  │  Tìm driver: lấy H3 cell của rider + k-ring       │
  │  neighbors → query all drivers in these cells      │
  └────────────────────────────────────────────────────┘

Option 3: Quadtree
  - Dynamic subdivision: vùng đông chia nhỏ hơn
  - Good cho non-uniform distribution
  - Nhưng phức tạp hơn khi update (driver di chuyển)

Storage trong Redis:
  Key: "h3:resolution9:892a1234567ffff"
  Value: SET of driver_ids
  
  Driver update location:
  1. Remove driver_id from old H3 cell
  2. Compute new H3 cell from (lat, lng)
  3. Add driver_id to new H3 cell
  → 333K operations/sec → Redis handle tốt
```

**Q: Driver matching algorithm?**

```
Khi rider request ride:

┌─────────────────────────────────────────────────────────┐
│  Step 1: Find nearby available drivers                   │
│    - Query H3 cell + k-ring(1) neighbors                │
│    - Filter: status=available, vehicle_type matches      │
│    - Radius: start 2km, expand to 5km if needed         │
│                                                         │
│  Step 2: Rank drivers by score                           │
│    score = w1 × (1/distance) +                          │
│            w2 × driver_rating +                          │
│            w3 × (1/ETA) +                               │
│            w4 × acceptance_rate                          │
│                                                         │
│  Step 3: Dispatch to top-ranked driver                   │
│    - Send ride request to driver                        │
│    - Driver has 15s to accept                            │
│    - If decline/timeout → next driver                    │
│    - Max 3 attempts, then expand radius                  │
└─────────────────────────────────────────────────────────┘

Optimization — Batch matching:
  Instead of matching 1-by-1, collect requests in 2s window
  → Solve assignment problem (Hungarian algorithm)
  → Globally optimal matching
  → Grab, Uber dùng approach này cho peak hours
```

**Q: Surge pricing design?**

```
┌─────────────────────────────────────────────────────┐
│  Supply-Demand model per H3 region:                  │
│                                                     │
│  demand_count = ride_requests in last 5 min         │
│  supply_count = available_drivers in region          │
│                                                     │
│  ratio = demand_count / supply_count                 │
│                                                     │
│  if ratio > 1.5: surge = 1.2x                       │
│  if ratio > 2.0: surge = 1.5x                       │
│  if ratio > 3.0: surge = 2.0x                       │
│  max surge cap: 3.0x                                │
│                                                     │
│  Update surge multiplier mỗi 2-5 phút              │
│  Display surge zone trên rider app                   │
│  Rider phải confirm surge price trước khi request   │
└─────────────────────────────────────────────────────┘

Architecture:
  Location events → Kafka → Surge Calculator (Flink/Spark Streaming)
  → Write surge_multiplier per H3 region to Redis
  → Pricing Service reads from Redis
```

**Q: Real-time location tracking cho trip?**

```
Driver location update flow (during trip):

Driver App ──[every 3s]──▶ Location Service
  │                              │
  │                              ├── Store to time-series DB (InfluxDB)
  │                              │   (for trip history, route replay)
  │                              │
  │                              ├── Update Redis (current location)
  │                              │
  │                              └── Push to Rider via WebSocket/SSE
  │                                       │
  ▼                                       ▼
┌───────────────────────────────────────────────┐
│  ETA recalculation:                            │
│  - Every location update → recalc ETA          │
│  - Use graph-based routing (OSRM / Valhalla)   │
│  - Factor in real-time traffic data            │
│  - Push updated ETA to rider                   │
└───────────────────────────────────────────────┘
```

**Q: Scale cho 1M concurrent drivers gửi location mỗi 3s?**

```
333K updates/sec — cần horizontal scaling:

┌────────────────────────────────────────────────────────┐
│  Approach: Partition by geographic region               │
│                                                        │
│  Vietnam: 6 regions → 6 location service clusters      │
│  HCM (heavy): 3 instances, Hanoi: 3, others: 1 each   │
│                                                        │
│  Driver → consistent hash(driver_id) → specific server │
│  → mỗi server handle ~50K updates/sec                  │
│  → Go service: easily handle 50K goroutine ops/sec     │
│                                                        │
│  Redis cluster: 6 shards (by H3 region prefix)         │
│  Write: 333K ops/sec / 6 = ~55K ops/sec per shard      │
│  → Well within Redis capacity (~100K ops/sec/node)     │
└────────────────────────────────────────────────────────┘
```

| Level | Kỳ vọng |
|-------|---------|
| **Middle** | Biết cần geospatial index, vẽ basic services, explain matching flow |
| **Senior** | H3/S2 vs Geohash tradeoffs, batch matching optimization, surge pricing model, ETA calculation, handle 333K location updates/sec, trip state machine, payment integration |

---

## 4. News Feed / Timeline (Facebook/Zalo Feed)

### Q: Design News Feed system cho social network. 🟡 [Mid]

**A:**

#### Step 1 — Requirements

| Functional | Non-functional |
|-----------|---------------|
| Create post (text, image, video) | Feed load time < 200ms |
| View personalized feed | Eventual consistency OK |
| Like, comment, share | Support 500M DAU |
| Real-time feed update | Ranked feed (not just chronological) |

#### Step 2 — Estimation

```
DAU: 500M
Average friends: 200
Posts/day/user: 2 → 1B posts/day
Feed reads/day: 500M × 10 opens = 5B reads/day

Feed QPS: 5B / 86400 = ~58K reads/sec (peak: ~150K/sec)
Post QPS: 1B / 86400 = ~12K writes/sec
```

#### Step 3 — High-Level Design

```
                    WRITE PATH                    READ PATH
                    
┌──────┐  create   ┌──────────┐              ┌──────────┐  get feed
│ User  │─────────▶│ Post     │              │ Feed     │◀─────────
└──────┘          │ Service  │              │ Service  │
                  └────┬─────┘              └────┬─────┘
                       │                         │
                       ▼                         ▼
                  ┌──────────┐              ┌──────────┐
                  │ Post DB   │              │ Feed     │
                  │           │              │ Cache    │
                  └────┬─────┘              │ (Redis)  │
                       │                    └────┬─────┘
                       ▼                         │ miss
                  ┌──────────┐                   ▼
                  │ Fan-out   │◀────────── ┌──────────┐
                  │ Service   │            │ Feed DB   │
                  └────┬─────┘            └──────────┘
                       │
                       ▼
                  Write to followers' feed caches
```

#### Step 4 — Deep Dive

**Q: Fan-out-on-Write vs Fan-out-on-Read — sự khác biệt?**

```
Fan-out-on-Write (Push model):
┌─────────────────────────────────────────────────────┐
│  User A posts → immediately write to ALL followers'  │
│  feed cache/table                                    │
│                                                     │
│  A has 1000 followers → 1000 writes                  │
│                                                     │
│  Pros:                                              │
│    ✓ Read feed siêu nhanh (pre-computed)            │
│    ✓ Feed sẵn sàng khi user mở app                  │
│                                                     │
│  Cons:                                              │
│    ✗ Celebrity problem: user có 10M followers       │
│      → 10M writes per post (hotspot!)               │
│    ✗ Waste resources cho inactive users              │
│    ✗ Write latency cao                              │
└─────────────────────────────────────────────────────┘

Fan-out-on-Read (Pull model):
┌─────────────────────────────────────────────────────┐
│  User B opens feed → query posts from ALL friends   │
│  → merge + rank → return feed                        │
│                                                     │
│  B has 200 friends → query 200 users' posts         │
│                                                     │
│  Pros:                                              │
│    ✓ No write amplification                         │
│    ✓ Always fresh data                              │
│                                                     │
│  Cons:                                              │
│    ✗ Read latency cao (query many sources)           │
│    ✗ Mỗi feed request = expensive computation       │
└─────────────────────────────────────────────────────┘
```

**Q: Hybrid approach — giải pháp thực tế?**

```
┌─────────────────────────────────────────────────────┐
│  HYBRID APPROACH (Facebook / Twitter actual design)  │
│                                                     │
│  Regular users (< 10K followers):                    │
│    → Fan-out-on-Write (push to followers' cache)    │
│    → Instant feed update                            │
│                                                     │
│  Celebrity users (> 10K followers):                  │
│    → Fan-out-on-Read (pull khi follower opens feed) │
│    → Avoid 10M writes per celebrity post            │
│                                                     │
│  Feed construction:                                 │
│    user_feed = pre_computed_feed (from push)         │
│              + fetch_celebrity_posts (from pull)     │
│              + merge + rank                          │
│                                                     │
│  Threshold: configurable (10K followers)            │
└─────────────────────────────────────────────────────┘
```

**Q: Feed ranking algorithm (simplified)?**

```
Mỗi post có một relevance score:

score = affinity × post_weight × time_decay

  affinity:     mức độ thân thiết với author
                (interaction history: like, comment, message)
  
  post_weight:  loại post (video > image > text)
                × engagement (like_count, comment_count)
  
  time_decay:   1 / (time_since_post)^1.5
                (post cũ → score giảm nhanh)

Feed = top-N posts sorted by score

Implementation:
  - Pre-compute affinity scores offline (batch job)
  - Real-time scoring khi build feed
  - Cache scored feed in Redis, TTL 5 min
```

**Q: Feed caching + pagination?**

```
Redis structure cho mỗi user's feed:

Key: feed:{user_id}
Type: Sorted Set (score = post relevance score)
Members: post_ids

ZREVRANGE feed:123 0 19        → page 1 (top 20 posts)
ZREVRANGE feed:123 20 39       → page 2

Cache strategy:
  - Cache top 200 posts per user
  - TTL: 5 minutes (re-rank periodically)
  - Cache miss → compute feed from DB → cache
  - New post from friend → ZADD to feed cache

Cursor-based pagination (not offset):
  GET /feed?cursor=post_id_123&limit=20
  → More stable than offset when new posts are added
```

| Level | Kỳ vọng |
|-------|---------|
| **Middle** | Biết fan-out concept, vẽ basic architecture, explain push vs pull |
| **Senior** | Hybrid approach cho celebrity, feed ranking, cursor-based pagination, cache invalidation strategy, real-time update via WebSocket |

---

## 5. Notification System

### Q: Design một notification system hỗ trợ push, SMS, email, in-app. 🟢 [Junior]

**A:**

#### Step 1 — Requirements

| Functional | Non-functional |
|-----------|---------------|
| Push notification (iOS/Android) | At-least-once delivery |
| SMS notification | Latency < 5s for push |
| Email notification | Support 100M notifications/day |
| In-app notification | No duplicate notifications |
| User preferences (opt-in/out) | Rate limiting per user |
| Template-based content | Priority levels |

#### Step 2 — Estimation

```
100M notifications/day
QPS: ~1200/sec, peak: ~5000/sec
Storage: 100M × 200B = 20GB/day (notification records)
```

#### Step 3 — High-Level Design

```
┌──────────────┐     ┌──────────────┐     ┌───────────────────┐
│  Caller       │────▶│ Notification │────▶│  Validation &      │
│  Services     │     │ API          │     │  Rate Limiter      │
│  (Order,Chat) │     └──────────────┘     └─────────┬─────────┘
└──────────────┘                                     │
                                                     ▼
                                              ┌──────────────┐
                                              │  Priority     │
                                              │  Queue        │
                                              │  (Kafka)      │
                                              └──┬───┬───┬───┘
                                                 │   │   │
                      ┌──────────────────────────┘   │   └──────────────┐
                      ▼                              ▼                  ▼
               ┌──────────┐                   ┌──────────┐       ┌──────────┐
               │  Push     │                   │  SMS     │       │  Email   │
               │  Worker   │                   │  Worker  │       │  Worker  │
               └─────┬────┘                   └─────┬────┘       └─────┬────┘
                     ▼                               ▼                  ▼
               ┌──────────┐                   ┌──────────┐       ┌──────────┐
               │  APNs /   │                   │ Twilio / │       │ SES /    │
               │  FCM      │                   │ Vonage   │       │ SendGrid │
               └──────────┘                   └──────────┘       └──────────┘

               ┌────────────────────────────────────────────┐
               │  Notification DB   │  User Preferences DB  │
               │  (history, status) │  (channels, opt-out)  │
               └────────────────────────────────────────────┘
```

#### Step 4 — Deep Dive

**Q: Rate limiting per user tránh spam thế nào?**

```
Rules:
  - Max 3 push notifications per app per hour
  - Max 1 SMS per event type per day
  - Max 5 emails per day (non-transactional)
  - Critical alerts: bypass rate limit

Implementation:
  Redis sliding window per user per channel:
  
  Key: "ratelimit:{user_id}:{channel}:{window}"
  
  MULTI
    ZADD ratelimit:user123:push:hourly {timestamp} {notif_id}
    ZREMRANGEBYSCORE ratelimit:user123:push:hourly 0 {1_hour_ago}
    ZCARD ratelimit:user123:push:hourly
  EXEC
  
  if count >= limit: drop notification (or queue for later)
```

**Q: Deduplication — tránh gửi notification trùng?**

```
Problem: Retry mechanism có thể gửi duplicate

Solution: Idempotency key per notification

┌─────────────────────────────────────────────────────────┐
│  Mỗi notification có unique idempotency_key:            │
│  key = hash(event_type + user_id + entity_id + time)    │
│                                                         │
│  Trước khi gửi:                                         │
│    SETNX dedup:{key} 1 EX 86400  (TTL 24h)             │
│    if already exists → skip (duplicate)                 │
│    if set success → proceed to send                     │
│                                                         │
│  Example:                                               │
│    "order_shipped:user123:order456:2024-01-15"          │
│    → Nếu retry, cùng key → skip                        │
└─────────────────────────────────────────────────────────┘
```

**Q: Retry with exponential backoff?**

```
Khi delivery fail (APNs timeout, SMS gateway error):

attempt 1: immediate
attempt 2: wait 1s
attempt 3: wait 4s
attempt 4: wait 16s
attempt 5: wait 64s (give up → Dead Letter Queue)

Implementation with Kafka:
  - Failed notification → delay topic (Kafka / RabbitMQ delay queue)
  - Delay consumer picks up after backoff period
  - After max retries → move to DLQ for manual review

Dead Letter Queue (DLQ):
  - Notifications that failed all retries
  - Alert ops team for investigation
  - Manual retry capability via admin dashboard
```

**Q: Priority system design?**

```
Priority levels:
  P0 (Critical): OTP, security alerts → immediate, bypass rate limit
  P1 (High):     Payment confirmation  → < 30s delivery
  P2 (Medium):   Order updates         → < 5 min delivery
  P3 (Low):      Marketing, social     → best effort, batch OK

Implementation:
  Separate Kafka topics per priority:
    notif-p0 → 10 consumer instances (fast processing)
    notif-p1 → 5 consumer instances
    notif-p2 → 3 consumer instances
    notif-p3 → 1 consumer instance (can batch)

  Workers poll P0 first → then P1 → etc. (priority scheduling)
```

| Level | Kỳ vọng |
|-------|---------|
| **Middle** | Biết cần message queue, multiple channels, basic flow |
| **Senior** | Rate limiting, deduplication, retry strategy, DLQ, priority queue, user preferences, template engine, analytics (delivery rate, open rate) |

---

## 6. Rate Limiter (API Rate Limiting)

### Q: Design một distributed rate limiter. 🟢 [Junior]

**A:**

#### Step 1 — Requirements

| Functional | Non-functional |
|-----------|---------------|
| Limit requests per user per API | Low latency (< 1ms overhead) |
| Different limits per API tier | Highly available |
| Return rate limit headers | Distributed (multi-server) |
| Support burst traffic | Accurate counting |

#### Step 2 — Algorithms Comparison

```
┌────────────────────────────────────────────────────────────────────┐
│  Algorithm          │ Pros                │ Cons                   │
├─────────────────────┼─────────────────────┼────────────────────────┤
│  Fixed Window       │ Simple, memory      │ Burst at window edge   │
│  Counter            │ efficient           │ (2x limit possible)    │
├─────────────────────┼─────────────────────┼────────────────────────┤
│  Sliding Window     │ Smooth rate         │ More memory (store     │
│  Log                │ limiting            │ all timestamps)        │
├─────────────────────┼─────────────────────┼────────────────────────┤
│  Sliding Window     │ Good balance        │ Not 100% exact         │
│  Counter            │ memory + accuracy   │ (approximation)        │
├─────────────────────┼─────────────────────┼────────────────────────┤
│  Token Bucket       │ Allows burst,       │ Race conditions in     │
│  ← RECOMMENDED      │ smooth average      │ distributed setup      │
├─────────────────────┼─────────────────────┼────────────────────────┤
│  Leaky Bucket       │ Constant output     │ Burst traffic gets     │
│                     │ rate                │ queued/dropped         │
└────────────────────────────────────────────────────────────────────┘
```

#### Step 3 — High-Level Design

```
┌──────────┐    ┌───────────────┐    ┌──────────────┐
│  Client   │───▶│  Rate Limiter │───▶│  API Server  │
└──────────┘    │  Middleware    │    └──────────────┘
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │    Redis       │
               │  (centralized  │
               │   counter)     │
               └───────────────┘

Response headers:
  X-RateLimit-Limit: 100       (max requests per window)
  X-RateLimit-Remaining: 57    (remaining in current window)
  X-RateLimit-Reset: 1642000   (unix timestamp when window resets)
  Retry-After: 30              (seconds to wait, on 429)

HTTP 429 Too Many Requests when limit exceeded
```

#### Step 4 — Deep Dive

**Q: Token Bucket algorithm chi tiết?**

```
┌─────────────────────────────────────────────────────────┐
│  Token Bucket:                                          │
│                                                         │
│  Parameters:                                            │
│    bucket_size = 10 (max tokens = max burst)            │
│    refill_rate = 2 tokens/sec                           │
│                                                         │
│  State:                                                 │
│    tokens = current available tokens                    │
│    last_refill = last time tokens were added            │
│                                                         │
│  On each request:                                       │
│    elapsed = now - last_refill                          │
│    tokens += elapsed × refill_rate                      │
│    tokens = min(tokens, bucket_size)  // cap at max     │
│    last_refill = now                                    │
│                                                         │
│    if tokens >= 1:                                      │
│      tokens -= 1                                        │
│      ALLOW request                                      │
│    else:                                                │
│      REJECT (429)                                       │
└─────────────────────────────────────────────────────────┘
```

**Q: Distributed rate limiting với Redis — race condition thế nào?**

```
Problem: 2 servers đọc cùng counter, cả 2 thấy tokens=1, cả 2 allow

Naive approach (WRONG):
  tokens = GET rate:user123       # Both read tokens=1
  if tokens > 0:
    SET rate:user123 (tokens-1)   # Both decrement to 0
    ALLOW                         # Both allow! Over-limit!

Solution: Lua script (atomic operation in Redis):

  local key = KEYS[1]
  local limit = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  
  local current = tonumber(redis.call('GET', key) or '0')
  if current < limit then
    redis.call('INCR', key)
    if current == 0 then
      redis.call('EXPIRE', key, window)
    end
    return 1  -- allowed
  end
  return 0  -- rejected

→ Lua script runs atomically in Redis
→ No race condition
→ Overhead: ~0.1ms per request
```

**Q: Sliding Window Counter — hybrid approach?**

```
Combines fixed window + sliding:

┌─────────────────────────────────────────────────────┐
│  Window size: 1 minute, Limit: 100 requests         │
│                                                     │
│  Time: 01:15:30                                      │
│  Current window (01:15:00 - 01:16:00): 40 requests  │
│  Previous window (01:14:00 - 01:15:00): 80 requests │
│                                                     │
│  Weighted count:                                     │
│    overlap = 1 - (30/60) = 0.5  (50% into window)  │
│    count = prev × overlap + current                  │
│          = 80 × 0.5 + 40                            │
│          = 80                                        │
│                                                     │
│  80 < 100 → ALLOW                                   │
│                                                     │
│  Redis: chỉ cần 2 counters per window               │
│  → Memory efficient!                                │
└─────────────────────────────────────────────────────┘
```

**Q: Multi-level rate limiting?**

```
Layer 1: Per-user per-API       (100 req/min for /api/posts)
Layer 2: Per-user global        (1000 req/min total)
Layer 3: Per-IP                 (5000 req/min - DDoS protection)
Layer 4: Global per-API         (100K req/min - service protection)

Check order: IP → Global → User Global → User per-API
→ Reject sớm nhất có thể để tiết kiệm resources
```

| Level | Kỳ vọng |
|-------|---------|
| **Middle** | Biết token bucket / sliding window, explain basic flow |
| **Senior** | Distributed race condition + Lua script, sliding window counter, multi-level limiting, rate limit headers, edge cases (clock drift, Redis failover) |

---

## 7. Key-Value Store (like Redis/DynamoDB)

### Q: Design một distributed key-value store. 🔴 [Senior]

**A:**

#### Step 1 — Requirements

| Functional | Non-functional |
|-----------|---------------|
| put(key, value) | High availability (AP preferred) |
| get(key) → value | Low latency (< 10ms) |
| delete(key) | Scalable to petabytes |
| TTL expiration | Tunable consistency |

#### Step 2 — High-Level Design

```
┌───────────────────────────────────────────────────────────┐
│                    Client                                  │
│                      │                                     │
│                      ▼                                     │
│              ┌──────────────┐                              │
│              │  Coordinator  │ (any node can be coord.)    │
│              └──────┬───────┘                              │
│                     │                                      │
│         ┌───────────┼───────────┐                          │
│         ▼           ▼           ▼                          │
│    ┌─────────┐ ┌─────────┐ ┌─────────┐                    │
│    │ Node A   │ │ Node B   │ │ Node C   │  ← replicas     │
│    │ (primary)│ │ (replica)│ │ (replica)│                  │
│    └─────────┘ └─────────┘ └─────────┘                    │
│                                                           │
│    Consistent Hash Ring:                                   │
│    ┌───────────────────────────────┐                       │
│    │     A ──── B ──── C ────      │                       │
│    │    ╱                    ╲     │                       │
│    │   F                      D    │                       │
│    │    ╲                    ╱     │                       │
│    │     E ──── D ──── C ────      │                       │
│    └───────────────────────────────┘                       │
└───────────────────────────────────────────────────────────┘
```

#### Step 3 — Deep Dive

**Q: Consistent hashing hoạt động thế nào?**

```
┌─────────────────────────────────────────────────────────┐
│  Hash ring: 0 ─────────────────────────────────▶ 2^32   │
│                                                         │
│  Nodes placed on ring by hash(node_id):                 │
│    hash("NodeA") = 100                                  │
│    hash("NodeB") = 300                                  │
│    hash("NodeC") = 600                                  │
│                                                         │
│  Key placement: hash(key) → walk clockwise → first node │
│    hash("user:123") = 250 → NodeB (300 > 250)          │
│    hash("user:456") = 450 → NodeC (600 > 450)          │
│                                                         │
│  Virtual nodes (vnodes): Mỗi physical node có nhiều     │
│  positions trên ring → phân bố đều hơn                  │
│    NodeA: [100, 400, 700]                               │
│    NodeB: [200, 500, 800]                               │
│    NodeC: [300, 600, 900]                               │
│                                                         │
│  Khi add/remove node: chỉ cần di chuyển keys ở         │
│  affected range → minimize data movement                │
└─────────────────────────────────────────────────────────┘
```

**Q: Replication và Quorum — đảm bảo consistency thế nào?**

```
Parameters:
  N = number of replicas (typically 3)
  W = write quorum (number of ACKs needed for write success)
  R = read quorum (number of responses needed for read success)

Rule: W + R > N → strong consistency

┌──────────────────────────────────────────────────────────┐
│  Configuration examples:                                  │
│                                                          │
│  N=3, W=2, R=2: Strong consistency (2+2 > 3)            │
│    → Ít nhất 1 node overlap giữa read và write          │
│    → Luôn đọc được version mới nhất                      │
│                                                          │
│  N=3, W=1, R=1: High availability, eventual consistency  │
│    → Write + Read nhanh nhất                             │
│    → Có thể đọc stale data                               │
│                                                          │
│  N=3, W=3, R=1: Strong write consistency                 │
│    → Mọi replica đều có latest data                      │
│    → Write chậm hơn, nhưng read fast + consistent       │
│                                                          │
│  N=3, W=1, R=3: Read-repair consistency                  │
│    → Write fast, read từ tất cả replicas + pick latest  │
└──────────────────────────────────────────────────────────┘
```

**Q: Write path bên trong mỗi node?**

```
Write path (LSM-Tree based — giống Cassandra, LevelDB):

Client write ──▶ WAL (Write-Ahead Log) ──▶ Memtable (in-memory)
                  │                           │
                  │ durability                 │ when full
                  ▼                           ▼
               Disk log                   Flush to SSTable (disk)
               (sequential)               (sorted, immutable)

┌─────────────────────────────────────────────────────────┐
│  1. Write to WAL (append-only log on disk)              │
│     → Ensures durability even if crash                  │
│                                                         │
│  2. Write to Memtable (sorted tree in memory, e.g.      │
│     red-black tree or skiplist)                         │
│     → Fast writes: O(log N)                             │
│                                                         │
│  3. When Memtable full (e.g. 64MB):                     │
│     → Flush to SSTable on disk (Sorted String Table)    │
│     → SSTable is immutable, sorted by key               │
│                                                         │
│  4. Compaction (background):                             │
│     → Merge multiple SSTables → remove duplicates       │
│     → Strategies: Size-tiered vs Leveled compaction     │
│                                                         │
│  Read path:                                              │
│     Memtable → Bloom filter → SSTable (newest first)    │
│     Bloom filter: check if key MIGHT be in SSTable      │
│     → Avoid unnecessary disk reads                      │
└─────────────────────────────────────────────────────────┘
```

**Q: Conflict resolution khi concurrent write?**

```
Scenario: 2 clients write cùng key tới 2 different replicas

┌─────────────────────────────────────────────────────────┐
│  Option 1: Last-Write-Wins (LWW)                        │
│    Mỗi write có timestamp/version                       │
│    → Giữ version mới nhất, discard cũ                   │
│    → Simple nhưng có thể mất data                       │
│                                                         │
│  Option 2: Vector Clocks                                │
│    Mỗi node maintain counter per node                   │
│    A:  {A:1, B:0}  "value_1"                            │
│    B:  {A:0, B:1}  "value_2"                            │
│    → Detect conflict (neither dominates)                │
│    → Return both → client resolves                      │
│    Dynamo / Riak dùng approach này                       │
│                                                         │
│  Option 3: CRDTs (Conflict-free Replicated Data Types)  │
│    Data types tự merge không conflict                   │
│    G-Counter, PN-Counter, OR-Set, LWW-Register          │
│    → Không cần coordination                             │
│    Redis CRDT, Riak dùng approach này                   │
└─────────────────────────────────────────────────────────┘
```

**Q: Failure detection bằng Gossip protocol?**

```
┌─────────────────────────────────────────────────────────┐
│  Gossip Protocol:                                        │
│                                                         │
│  Mỗi node periodically (1s) chọn random node để trao   │
│  đổi membership list:                                   │
│                                                         │
│  Node A → Node C: "Here's my view of cluster"           │
│    {A: alive:t1, B: alive:t2, C: alive:t3, D: suspect} │
│                                                         │
│  Node C merges + responds with its view                  │
│                                                         │
│  Failure detection:                                     │
│    - No heartbeat from D for 10s → mark SUSPECT         │
│    - If majority nodes agree D is suspect → mark DEAD   │
│    - Convey failure to all nodes via gossip              │
│                                                         │
│  Tại sao Gossip mà không dùng central heartbeat?        │
│    - No SPOF (single point of failure)                  │
│    - Scale tốt: O(log N) rounds to propagate info      │
│    - Epidemic-style spreading → reliable                │
└─────────────────────────────────────────────────────────┘
```

| Level | Kỳ vọng |
|-------|---------|
| **Middle** | Consistent hashing concept, replication cơ bản, get/put flow |
| **Senior** | Quorum math (W+R>N), LSM-tree write path, vector clocks, gossip protocol, compaction strategies, Bloom filter optimization, tunable consistency |

---

## 8. Distributed Task Scheduler / Job Queue

### Q: Design một distributed task scheduler / job queue. 🟡 [Mid]

**A:**

#### Step 1 — Requirements

| Functional | Non-functional |
|-----------|---------------|
| Submit task (immediate or scheduled) | At-least-once execution |
| Cron-like recurring tasks | Low scheduling latency |
| Priority levels | Scalable to millions of tasks/day |
| Retry failed tasks | Fault tolerant (no task loss) |
| Task status tracking | Exactly-once execution (ideal) |
| Dead letter queue for poison tasks | Distributed workers |

#### Step 2 — High-Level Design

```
┌────────────────┐     ┌────────────────────────────────────┐
│  Task Producer  │────▶│         Task Scheduler              │
│  (API / Cron)   │     │                                    │
└────────────────┘     │  ┌──────────┐   ┌──────────────┐   │
                       │  │ Immediate │   │  Delayed /    │   │
                       │  │ Queue     │   │  Cron Store   │   │
                       │  │ (Kafka)   │   │  (Redis ZSET) │   │
                       │  └─────┬────┘   └──────┬───────┘   │
                       │        │                │            │
                       │        │    Timer scans  │            │
                       │        │◀───────────────┘            │
                       └────────┼──────────────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │ Worker 1  │ │ Worker 2  │ │ Worker 3  │
              └─────┬────┘ └─────┬────┘ └─────┬────┘
                    │            │            │
                    ▼            ▼            ▼
              ┌────────────────────────────────────┐
              │  Result Store (Postgres / Redis)    │
              │  Task Status: pending → running →   │
              │               success / failed      │
              └────────────────────────────────────┘
```

#### Step 3 — Deep Dive

**Q: Delayed task scheduling thế nào?**

```
Cron / Delayed tasks:

┌─────────────────────────────────────────────────────────┐
│  Redis Sorted Set cho delayed tasks:                     │
│                                                         │
│  Key: "delayed_tasks"                                    │
│  Score: execution_timestamp (unix epoch)                │
│  Member: task_id                                         │
│                                                         │
│  ZADD delayed_tasks 1705300000 "task:abc123"            │
│  ZADD delayed_tasks 1705300060 "task:def456"            │
│                                                         │
│  Scheduler thread (every 1s):                           │
│    tasks = ZRANGEBYSCORE delayed_tasks 0 {now}          │
│    for each task:                                       │
│      ZREM delayed_tasks task_id  (atomic remove)        │
│      Enqueue to Kafka for immediate execution           │
│                                                         │
│  Cron tasks:                                             │
│    After execution, calculate next_run_time             │
│    ZADD delayed_tasks {next_run_time} task_id           │
└─────────────────────────────────────────────────────────┘
```

**Q: Exactly-once execution — có thể đạt được không?**

```
Short answer: KHÔNG thể đạt exactly-once trong distributed system.
Nhưng có thể simulate bằng at-least-once + idempotency.

┌─────────────────────────────────────────────────────────┐
│  Problem scenario:                                       │
│                                                         │
│  1. Worker picks task, processes it                      │
│  2. Worker sends "task complete" ACK                     │
│  3. Network failure → ACK lost                           │
│  4. Scheduler thinks task failed → re-enqueue            │
│  5. Another worker picks same task → DUPLICATE!          │
│                                                         │
│  Solution: Idempotent task execution                     │
│                                                         │
│  Before processing:                                     │
│    SETNX lock:task:{task_id} {worker_id} EX 300         │
│    if not acquired → skip (another worker has it)       │
│                                                         │
│  After processing:                                       │
│    SET result:task:{task_id} {result} EX 86400          │
│    Mark task as completed in DB                         │
│                                                         │
│  On re-delivery:                                        │
│    Check result:task:{task_id} exists?                   │
│    if yes → skip (already processed)                    │
│                                                         │
│  Task itself should be idempotent:                      │
│    "Send email to user X" → check if already sent       │
│    "Charge $10" → use idempotency key with payment API  │
└─────────────────────────────────────────────────────────┘
```

**Q: Worker failure handling?**

```
┌─────────────────────────────────────────────────────────┐
│  Visibility timeout pattern (like SQS):                  │
│                                                         │
│  1. Worker dequeues task → task becomes INVISIBLE        │
│     (other workers can't see it)                        │
│  2. Visibility timeout = 5 minutes                       │
│  3. Worker completes → ACK → delete from queue          │
│  4. Worker crashes → no ACK → after 5 min, task         │
│     becomes VISIBLE again → another worker picks it     │
│                                                         │
│  Implementation with Redis:                              │
│    BRPOPLPUSH task_queue processing_queue               │
│    (atomically move from ready → processing)            │
│                                                         │
│    Background checker every 30s:                        │
│    - Scan processing_queue                              │
│    - If task_started_at > 5 min ago → move back to      │
│      task_queue (re-enqueue)                            │
│    - Increment retry_count                              │
│    - If retry_count > max_retries → move to DLQ         │
└─────────────────────────────────────────────────────────┘
```

**Q: Priority scheduling?**

```
Multiple queues per priority:

  queue:p0  → Critical tasks (process first)
  queue:p1  → High priority
  queue:p2  → Normal priority
  queue:p3  → Low priority (background jobs)

Worker polling strategy:
  Weighted fair queuing:
    70% time polling p0
    20% time polling p1
    8%  time polling p2
    2%  time polling p3

  OR: BLPOP queue:p0 queue:p1 queue:p2 queue:p3 0
  (Redis blocks until any queue has item, checks in order)
  
  Starvation prevention:
    If p2/p3 task waits > 10 min → promote to p1
    → Ensure all tasks eventually execute
```

| Level | Kỳ vọng |
|-------|---------|
| **Middle** | Queue + worker pattern, retry concept, basic scheduling |
| **Senior** | Exactly-once challenges + idempotency solution, visibility timeout, delayed scheduling with Redis ZSET, priority with starvation prevention, DLQ, distributed locking |

---

## 9. Payment System ⭐ RELEVANT FOR GRAB, E-COMMERCE

### Q: Design một payment processing system. 🔴 [Senior]

**A:**

#### Step 1 — Requirements

| Functional | Non-functional |
|-----------|---------------|
| Process payment (charge) | Exactly-once payment (CRITICAL) |
| Refund | High availability (99.999%) |
| Payment status tracking | Audit trail (every change logged) |
| Multiple payment methods | PCI DSS compliance |
| Idempotent operations | Reconciliation capability |
| Webhook notifications | Sub-second processing |

#### Step 2 — High-Level Design

```
┌──────────┐     ┌───────────────┐     ┌──────────────────┐
│  Client   │────▶│ Payment API    │────▶│ Payment Service   │
│  (App)    │     │ Gateway        │     │                  │
└──────────┘     └───────────────┘     └────────┬─────────┘
                                                │
                      ┌─────────────────────────┤
                      │                         │
                      ▼                         ▼
               ┌──────────────┐          ┌──────────────┐
               │ Payment      │          │  Ledger       │
               │ State Machine│          │  Service      │
               │ (Postgres)   │          │  (Double      │
               └──────┬───────┘          │   Entry)      │
                      │                  └──────────────┘
                      ▼
               ┌──────────────┐
               │  PSP Adapter  │  (Payment Service Provider)
               │  (Stripe,     │
               │   PayPal,     │
               │   VNPay)      │
               └──────┬───────┘
                      │
                      ▼
               ┌──────────────┐
               │  External     │
               │  Payment      │
               │  Gateway      │
               └──────────────┘

Async flows:
  Payment events → Kafka → Notification Service (email receipt)
                        → Analytics Service
                        → Reconciliation Service
```

#### Step 3 — Deep Dive

**Q: Idempotency — tại sao CRITICAL và implement thế nào?**

```
Scenario: User click "Pay" button 2 lần (hoặc network retry)
→ KHÔNG ĐƯỢC charge 2 lần!

┌─────────────────────────────────────────────────────────┐
│  Idempotency Key Flow:                                   │
│                                                         │
│  1. Client generate unique idempotency_key per payment  │
│     key = UUID or hash(user_id + order_id + amount)     │
│                                                         │
│  2. Server receives request:                            │
│     a. Check idempotency_key in Redis/DB                │
│     b. If exists → return cached result (no re-charge)  │
│     c. If not exists → process payment                  │
│     d. Store result with idempotency_key                │
│                                                         │
│  Implementation:                                        │
│    SETNX payment:idemp:{key} "processing" EX 86400      │
│    if already exists:                                   │
│      result = GET payment:idemp:{key}                   │
│      if result == "processing": return 409 (in-progress)│
│      else: return cached result                        │
│    else:                                                │
│      process payment...                                 │
│      SET payment:idemp:{key} {result} EX 86400          │
└─────────────────────────────────────────────────────────┘
```

**Q: Payment state machine?**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  CREATED ──▶ PROCESSING ──▶ SUCCESS ──▶ REFUND_PENDING │
│    │              │              │             │         │
│    │              ▼              │             ▼         │
│    │          FAILED             │         REFUNDED      │
│    │              │              │                       │
│    ▼              ▼              │                       │
│  CANCELLED    RETRY_PENDING ────┘                       │
│                                                         │
│  Transition rules (enforced in code):                   │
│    CREATED → PROCESSING:     only once                  │
│    PROCESSING → SUCCESS:     PSP confirms charge        │
│    PROCESSING → FAILED:      PSP rejects               │
│    FAILED → RETRY_PENDING:   if retriable error         │
│    SUCCESS → REFUND_PENDING: refund requested           │
│    REFUND_PENDING → REFUNDED: PSP confirms refund       │
│                                                         │
│  Every transition logged to audit_log table             │
│  (immutable, append-only)                               │
└─────────────────────────────────────────────────────────┘
```

**Q: Double-entry bookkeeping trong payment system?**

```
Nguyên tắc: Mỗi transaction tạo ÍT NHẤT 2 ledger entries
  Tổng debit = Tổng credit (luôn luôn)

Example: User pays 100K for a ride:

┌──────────────────────────────────────────────────────────┐
│  Transaction: RIDE_PAYMENT_001                           │
│                                                         │
│  Debit  | User Wallet Account    | 100,000 VND          │
│  Credit | Platform Revenue       |  15,000 VND (15%)    │
│  Credit | Driver Payout Account  |  85,000 VND (85%)    │
│                                                         │
│  Sum(Debit) = Sum(Credit) = 100,000 VND  ✓              │
│                                                         │
│  Refund scenario:                                       │
│  Debit  | Platform Revenue       |  15,000 VND          │
│  Debit  | Driver Payout Account  |  85,000 VND          │
│  Credit | User Wallet Account    | 100,000 VND          │
│                                                         │
│  → Balance automatically correct after refund           │
└──────────────────────────────────────────────────────────┘

Ledger table (immutable, NEVER update/delete):
  id | transaction_id | account_id | type   | amount | created_at
  1  | TXN_001        | user_123   | DEBIT  | 100000 | 2024-01-15
  2  | TXN_001        | platform   | CREDIT |  15000 | 2024-01-15
  3  | TXN_001        | driver_456 | CREDIT |  85000 | 2024-01-15
```

**Q: Distributed transaction — Saga pattern cho payment?**

```
Cross-service payment flow cần Saga:

┌─────────────────────────────────────────────────────────┐
│  Saga: Complete a Ride Payment                           │
│                                                         │
│  Step 1: Reserve rider balance                           │
│    → Call Wallet Service: reserve(rider, 100K)          │
│    → Compensate: release_reserve(rider, 100K)           │
│                                                         │
│  Step 2: Charge payment via PSP                          │
│    → Call PSP Adapter: charge(100K)                     │
│    → Compensate: refund(100K)                           │
│                                                         │
│  Step 3: Credit driver account                           │
│    → Call Wallet Service: credit(driver, 85K)           │
│    → Compensate: debit(driver, 85K)                     │
│                                                         │
│  Step 4: Record in ledger                                │
│    → Call Ledger Service: record entries                 │
│    → Compensate: void entries                           │
│                                                         │
│  If Step 3 fails:                                       │
│    → Compensate Step 2 (refund PSP)                     │
│    → Compensate Step 1 (release reserve)                │
│    → Mark payment as FAILED                             │
│                                                         │
│  Orchestrator (Saga Manager) coordinates all steps      │
│  and handles compensations on failure                   │
└─────────────────────────────────────────────────────────┘
```

**Q: Reconciliation — tại sao cần và design thế nào?**

```
Reconciliation = so khớp records giữa hệ thống internal và PSP

┌─────────────────────────────────────────────────────────┐
│  Tại sao cần?                                           │
│  - PSP charge thành công nhưng webhook fail → internal  │
│    records show "processing" but money was charged      │
│  - Network timeout → unclear state                      │
│  - Bug in code → records inconsistent                   │
│                                                         │
│  Daily reconciliation job:                               │
│  1. Fetch PSP settlement report (all transactions)      │
│  2. Fetch internal ledger records                       │
│  3. Match by transaction_id / idempotency_key           │
│  4. Find discrepancies:                                 │
│     - In PSP but not internal → missed webhook          │
│     - In internal but not PSP → phantom transaction     │
│     - Amount mismatch → need investigation              │
│  5. Auto-fix simple cases, alert for complex ones       │
│                                                         │
│  Run: daily batch job + real-time spot checks           │
└─────────────────────────────────────────────────────────┘
```

| Level | Kỳ vọng |
|-------|---------|
| **Middle** | Basic payment flow, biết cần idempotency, state machine concept |
| **Senior** | Idempotency key implementation, double-entry bookkeeping, Saga pattern, reconciliation, PCI compliance awareness, event sourcing for audit trail |

---

## 10. Search Autocomplete / Typeahead

### Q: Design search autocomplete (typeahead suggestions). 🟢 [Junior]

**A:**

#### Step 1 — Requirements

| Functional | Non-functional |
|-----------|---------------|
| Return top suggestions as user types | Latency < 100ms |
| Ranked by popularity/relevance | High availability |
| Support multiple languages | Scale to 10B queries/day |
| Personalized suggestions (optional) | Update suggestions near real-time |

#### Step 2 — Estimation

```
QPS: 10B queries/day → ~116K QPS
Average 5 characters typed per query → 5 × 116K = 580K autocomplete QPS
Peak: ~1M autocomplete requests/sec

Storage:
  5M unique query prefixes × avg 20 bytes = 100MB (fits in memory!)
  With top-10 suggestions per prefix: 5M × 10 × 20B = 1GB
```

#### Step 3 — High-Level Design

```
┌──────────┐  "ho"  ┌───────────────┐  cache hit  ┌──────────────┐
│  Client   │───────▶│  API Gateway   │────────────▶│  CDN / Edge  │
└──────────┘        └───────┬───────┘              │  Cache       │
                            │ cache miss           └──────────────┘
                            ▼
                    ┌───────────────┐
                    │  Autocomplete  │
                    │  Service       │
                    └───────┬───────┘
                            │
               ┌────────────┼──────────────┐
               ▼            ▼              ▼
        ┌──────────┐ ┌──────────────┐ ┌───────────────┐
        │  Trie     │ │ Precomputed  │ │ Data Pipeline  │
        │  (memory) │ │ Cache(Redis) │ │ (Kafka→Spark)  │
        └──────────┘ └──────────────┘ └───────────────┘

Data collection:
  User queries → Kafka → Spark aggregation (hourly/daily)
  → Update Trie / precomputed suggestions
```

#### Step 4 — Deep Dive

**Q: Trie data structure cho autocomplete?**

```
Trie cho queries: "tree", "try", "true", "toy"

           root
          / | \
         t   ...
        / \
       r    o
      / \    \
     e   u    y (toy: freq=500)
     |   |
     e   e (true: freq=200)
     |
    (tree: freq=1000)
     \
      y (try: freq=800)

Optimization — Precomputed top-K per node:

  Node "tr" stores: [
    {query: "tree", freq: 1000},
    {query: "try",  freq: 800},
    {query: "true", freq: 200}
  ]
  
  → Khi user type "tr" → immediately return top-K
  → KHÔNG cần traverse subtree
  → O(1) lookup per prefix (after Trie navigation)

Memory optimization:
  - Chỉ lưu top 10-15 suggestions per node
  - Prune nodes với frequency < threshold
  - Compressed trie (merge single-child chains)
```

**Q: Trie update — real-time hay batch?**

```
┌─────────────────────────────────────────────────────────┐
│  KHÔNG update Trie real-time cho mỗi query!             │
│  → 580K QPS update = quá heavy, lock contention         │
│                                                         │
│  Approach: Batch update + serving Trie separation        │
│                                                         │
│  ┌────────────┐    ┌─────────────┐    ┌──────────────┐  │
│  │  Query Log  │──▶│  Spark Job   │──▶│  New Trie     │  │
│  │  (Kafka)    │   │  (hourly)    │   │  Build        │  │
│  └────────────┘   └─────────────┘    └──────┬───────┘  │
│                                              │          │
│                                              ▼          │
│  Serving:                                               │
│    Trie_v1 (serving) ← swap → Trie_v2 (new build)     │
│                                                         │
│  Blue-green deployment cho Trie:                        │
│    - Build new Trie offline (Spark)                     │
│    - Atomic swap: old → new                             │
│    - Zero downtime update                               │
│                                                         │
│  Update frequency:                                      │
│    - Popular queries: hourly update                     │
│    - Trending queries: near real-time (5-min window)    │
│    - Long-tail queries: daily batch                     │
└─────────────────────────────────────────────────────────┘
```

**Q: Caching strategy cho autocomplete?**

```
Multi-layer caching:

Layer 1: Browser cache
  - Cache responses per prefix for 1 hour
  - User types "ho" → cached from last session

Layer 2: CDN / Edge cache
  - Popular prefixes (top 1000): cache at CDN
  - "how", "wha", "fac" → cache hit at edge
  - 80%+ requests served from CDN

Layer 3: Application cache (Redis)
  Key: "autocomplete:{prefix}"
  Value: JSON array of top-10 suggestions
  TTL: 1 hour
  
  Size: 5M prefixes × 200B = 1GB (fits in Redis)

Layer 4: In-memory Trie (last resort)
  - Only for cache misses
  - Should be rare (< 5% of requests)

Result: 95% requests served from cache
  → Effective latency < 10ms
```

**Q: Personalized suggestions?**

```
Combine global popularity + personal history:

score = 0.7 × global_popularity + 0.3 × personal_score

Personal signals:
  - Recent searches by this user
  - Search frequency per query
  - Click-through on previous suggestions

Implementation:
  - Global suggestions: precomputed, cached (same for all)
  - Personal suggestions: per-user recent queries in Redis
    Key: "user_history:{user_id}"
    Type: Sorted Set (score = timestamp)
    Keep last 100 queries
  
  Merge at query time:
    global_results = cache.get("autocomplete:ho")
    personal_results = redis.zrevrange("user_history:123")
                       .filter(startsWith("ho"))
    return merge_and_rank(global_results, personal_results)
```

**Q: Multi-language support?**

```
Challenges:
  - Vietnamese: dấu (á, à, ả, ã, ạ) → cần normalize
  - Chinese/Japanese: character-level prefix khác word-level
  - Mixed language queries: "mua iphone 15"

Solution:
  - Normalize input: "hà nội" → "ha noi" (for matching)
  - Store both normalized AND original in Trie
  - Return original form in suggestions
  - Separate Trie per language/market
```

| Level | Kỳ vọng |
|-------|---------|
| **Middle** | Trie concept, basic caching, explain query flow |
| **Senior** | Precomputed top-K per Trie node, batch update pipeline, multi-layer caching, blue-green Trie swap, personalization, multi-language handling |

---

## Summary: Interview Strategy per Problem

```
┌────────────────────┬──────────────────────────────────────────────┐
│  Problem           │  Key things interviewer wants to hear        │
├────────────────────┼──────────────────────────────────────────────┤
│  URL Shortener     │  Hash/encoding choice, 301 vs 302, cache    │
│  Chat System       │  WebSocket, message ordering, fan-out       │
│  Ride-Sharing      │  Geospatial index (H3), matching, surge     │
│  News Feed         │  Fan-out tradeoff, hybrid, ranking          │
│  Notification      │  Rate limit, dedup, retry, priority         │
│  Rate Limiter      │  Token bucket, distributed race condition   │
│  Key-Value Store   │  Consistent hash, quorum, LSM-tree          │
│  Task Scheduler    │  Exactly-once challenge, visibility timeout │
│  Payment           │  Idempotency, saga, double-entry ledger     │
│  Autocomplete      │  Trie with precomputed top-K, batch update  │
└────────────────────┴──────────────────────────────────────────────┘
```

**Golden rules cho system design interview:**

1. **Luôn bắt đầu bằng requirements** — hỏi interviewer clarify trước khi vẽ
2. **Estimation trước khi design** — biết scale để chọn giải pháp phù hợp
3. **Vẽ high-level trước, deep dive sau** — đừng nhảy vào details quá sớm
4. **Nói rõ tradeoffs** — không có giải pháp perfect, explain WHY chọn option này
5. **Drive the conversation** — đừng đợi interviewer hỏi, tự đề xuất deep dive areas
