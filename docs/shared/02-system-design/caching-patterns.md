# Caching Patterns / Mẫu Thiết Kế Cache

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [System Design Theory](./system-design-theory.md) | [BE Caching](../../be-track/03-database-advanced/04-caching-patterns.md) | [Replication & Partitioning](./replication-partitioning.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Lazada product search (thực tế):** Product catalog API call takes 200ms (DB join 5 tables). With cache-aside: first request misses (200ms), subsequent requests hit cache (1ms). All good until Black Friday: 10,000 users search for "iPhone" at midnight when TTL expires simultaneously → **cache stampede**: 10,000 DB queries in 1 second. DB overloaded, cache takes 30 seconds to rebuild → all 10,000 users see 30s timeout. Fix: singleflight (only 1 request rebuilds, others wait) + TTL jitter (random 60±10s expiry).

**Bài học:** Cache giải quyết latency nhưng tạo ra stampede và stale data problems. Senior engineer designs around these failure modes.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Cache giống bộ nhớ ngắn hạn của não: không cần đi thư viện (database) mỗi lần muốn biết ngày sinh của bạn thân. Nhưng nếu thông tin trong bộ nhớ quá cũ (stale data), bạn có thể đưa ra thông tin sai. Eviction = quên đi thứ ít quan trọng để nhớ thứ mới hơn (LRU).

**Why it matters:** Caching là một trong những kỹ thuật tối ưu hiệu quả nhất trong system design. Cache stampede và cache invalidation là hai vấn đề khó nhất — Senior phải biết cả hai.

---

## Visual Overview / Sơ Đồ Tổng Quan

### Cache Position in System Architecture

```
CLIENT
  │
  ▼
[CDN / Edge Cache]          ← static assets, geo-distributed
  │
  ▼
[Load Balancer]
  │
  ▼
[Application Server]
  │  ├──[In-Memory Cache (local)]  ← process-level, fastest, non-shared
  │  │
  │  └──[Distributed Cache]        ← Redis, Memcached, shared across instances
  │             │
  ▼             │
[Database]◄─────┘             ← source of truth, slowest
```

### Cache-Aside vs Write-Through vs Write-Behind

```
CACHE-ASIDE (Lazy Loading):       WRITE-THROUGH:
Read:                             Write:
 App → Cache HIT → return         App → Cache → DB (sync)
 App → Cache MISS → DB → Cache    Read always hits cache ✓
 → return                         Write latency = Cache + DB latency ✗

WRITE-BEHIND (Write-Back):        READ-THROUGH:
Write:                            Read:
 App → Cache only (fast!)         App → Cache (miss) → Cache fetches DB
 Background: Cache → DB (async)   App never touches DB directly
 Risk: data loss if cache crashes  Simpler app code ✓
```

### Cache Eviction Policies Visualization

```
LRU (Least Recently Used):
Access order: A, B, C, D (capacity=3)
Cache: [A, B, C]
Access D → evict A (least recently used)
Cache: [B, C, D]

LFU (Least Frequently Used):
Freq:  A=3, B=1, C=5  (capacity=3, evict 1)
Access D → evict B (lowest frequency=1)
Cache: [A, C, D] (D starts at freq=1)

FIFO (First In, First Out):
Insert: A, B, C (capacity=3)
Insert D → evict A (first inserted)

TTL-based:
key:user:123 → set with TTL=300s
After 300s → automatically evicted regardless of access
```

---

---

---

## Overview / Tổng Quan

| #   | Concept                            | Vai trò                                                          | Interview Weight |
| --- | ---------------------------------- | ---------------------------------------------------------------- | ---------------- |
| 1   | **Cache Access Patterns**          | Aside, Through, Behind, Read-Through — khi nào dùng pattern nào  | ⭐⭐⭐⭐⭐       |
| 2   | **Cache Invalidation & TTL**       | Event-based, version-based, TTL jitter — "hardest problem in CS" | ⭐⭐⭐⭐⭐       |
| 3   | **Eviction Policies**              | LRU, LFU, FIFO — memory management strategy                      | ⭐⭐⭐⭐         |
| 4   | **Distributed Cache**              | Redis vs Memcached, cluster topology, hot keys                   | ⭐⭐⭐⭐⭐       |
| 5   | **CDN Caching**                    | Edge cache, HTTP cache headers, static vs dynamic                | ⭐⭐⭐           |
| 6   | **Cache Stampede & Failure Modes** | Thundering herd, negative caching, stale data                    | ⭐⭐⭐⭐⭐       |
| 7   | **Multi-Level Caching**            | L1/L2/L3 architecture, invalidation cascade, consistency         | ⭐⭐⭐⭐         |

> Mối quan hệ: Access Patterns define HOW cache is used → Invalidation & TTL manage freshness → Eviction manages memory → Distributed Cache scales across servers → CDN extends to edge → Stampede is the failure mode → Multi-Level combines all layers.

---

## Core Concepts — Phase 2 Deep Treatment

### Concept 1: Cache Access Patterns

🪝 **Memory Hook:** Cache-Aside = "tự lấy tự trả" (app manages). Write-Through = "viết 2 nơi cùng lúc". Write-Behind = "viết trước trả sau" (async DB). / 3 patterns = 3 trade-offs: simplicity vs consistency vs speed.

**Why exists (2+ levels):**

- Level 1: Different write/read ratios need different caching strategies
- Level 2: Cache-Aside is simplest but has consistency gap (delete-on-write); Write-Through guarantees cache freshness but doubles write latency
- Level 3: Write-Behind maximizes write throughput but risks data loss on cache failure

**Layer 1 — Simple Analogy:** Bảng ghi chú trên tủ lạnh (cache). Aside: tự đọc sách (DB) rồi ghi lên bảng. Through: ai viết vào DB cũng đồng thời ghi bảng. Behind: ghi bảng trước, cuối ngày mới cập nhật sách.

**Layer 2 — Mechanics + Visual:**

```
CACHE-ASIDE:                    WRITE-THROUGH:
App → Cache?                    App → Cache → DB (sync)
  HIT → return                  Read → always from cache
  MISS → DB → set cache         Consistent but slow writes

WRITE-BEHIND:                   READ-THROUGH:
App → Cache (return)            App → Cache?
Cache → DB (async batch)          HIT → return
Fast writes, data loss risk       MISS → Cache fetches DB
```

Key: Cache-Aside uses DELETE on write (not UPDATE) to avoid race conditions.

**Layer 3 — Edge Cases:**

- Cache-Aside race: Thread A reads stale, Thread B updates DB + deletes cache, Thread A sets stale → use short TTL as safety net
- Write-Behind batch: if cache crashes before flush → data loss; use WAL or Redis AOF
- Read-Through: cache becomes SPOF; need fallback to direct DB read

| Sai lầm                   | Tại sao sai                                         | Đúng là                                                         |
| ------------------------- | --------------------------------------------------- | --------------------------------------------------------------- |
| UPDATE cache on write     | Race condition: concurrent reads can set stale data | DELETE on write, let next read populate                         |
| Write-Behind for payments | Data loss risk on cache failure                     | Write-Through for critical data, Behind for analytics           |
| One pattern fits all      | Different data has different consistency needs      | Cache-Aside for most; Through for critical; Behind for counters |

🎯 **Interview Pattern:** "For product catalog: Cache-Aside with 60s TTL. For inventory count: Write-Through (must be accurate). For view counts: Write-Behind (loss tolerable)."

🔗 **Knowledge Chain:** Access Patterns → [Invalidation](#concept-2) → [BE Caching](../../be-track/03-database-advanced/04-caching-patterns.md)

---

### Concept 2: Cache Invalidation & TTL

🪝 **Memory Hook:** "There are only two hard things in CS: cache invalidation and naming things." TTL jitter = random expires to prevent stampede. / Khi nào data trong cache hết hạn? Quá sớm: miss nhiều. Quá trễ: stale data.

**Why exists (2+ levels):**

- Level 1: Cached data becomes stale when source of truth changes
- Level 2: TTL-based is simplest but either too fresh (low hit) or too stale (wrong data)
- Level 3: Event-based invalidation is most accurate but requires event infrastructure (Kafka/CDC)

**Layer 1 — Simple Analogy:** Sữa trong tủ lạnh có hạn dùng (TTL). Sữa hết hạn = phải mua mới (cache miss). Nếu ai đó báo "sữa mới về" (event-based) thì bạn biết ngay — không cần đợi hết hạn.

**Layer 2 — Mechanics + Visual:**

```
TTL-BASED:           EVENT-BASED:           VERSION-BASED:
Set TTL=60s          DB change → event      key = "product:v3"
After 60s → expire   → invalidate cache     New version → new key
Simple, imprecise    Accurate, complex      No invalidation needed
Jitter: 60±10s       Need Kafka/CDC         Old keys auto-expire
```

**Layer 3 — Edge Cases:**

- TTL jitter prevents stampede: instead of all 10K keys expiring at second 60, spread across 50-70s
- Event-based with CDC (Change Data Capture): Debezium reads DB WAL → publishes to Kafka → cache invalidation consumer
- Version-based: no invalidation needed but memory grows with versions; combine with TTL cleanup

| Sai lầm                          | Tại sao sai                                     | Đúng là                                                        |
| -------------------------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| TTL=0 (no cache)                 | Defeats purpose; every request hits DB          | TTL based on data change frequency + tolerance for staleness   |
| Same TTL for all keys            | Uniform expiration = stampede                   | Add jitter: TTL ± 10-20% random offset                         |
| Invalidate cache before DB write | If DB write fails, cache is wrongly invalidated | Write DB first → then invalidate cache (or use Outbox pattern) |

🎯 **Interview Pattern:** "TTL jitter for general data. Event-based via CDC for critical data (inventory, pricing). Version keys for config/feature flags."

🔗 **Knowledge Chain:** Invalidation → [Stampede](#concept-6) → [Message Queues](./05-message-queues.md)

---

### Concept 3: Eviction Policies

🪝 **Memory Hook:** LRU = đuổi khách ít đến nhất. LFU = đuổi khách đến ít lần nhất. FIFO = đuổi khách đến sớm nhất. / Khi tủ đầy, quên thứ gì?

**Why exists (2+ levels):**

- Level 1: Cache memory is finite; must decide what to remove when full
- Level 2: Different access patterns favor different policies (recency vs frequency)
- Level 3: LRU is default in most systems (Redis, Memcached) but LFU better for skewed distributions

**Layer 1 — Simple Analogy:** Tủ lạnh đầy. LRU: bỏ thứ lâu không dùng. LFU: bỏ thứ ít dùng nhất. FIFO: bỏ thứ cũ nhất. Random: bỏ bất kỳ.

**Layer 2 — Mechanics + Visual:**

```
LRU (Least Recently Used):    LFU (Least Frequently Used):
Access order matters           Count matters
HashMap + Doubly Linked List   HashMap + Frequency Buckets
O(1) get/put                   O(1) with min-frequency pointer
Redis default: allkeys-lru     Redis: allkeys-lfu
```

**Layer 3 — Edge Cases:**

- LRU scan pollution: bulk scan (report query) evicts hot keys → use separate cache or noeviction policy for hot keys
- LFU cold start: new items have count=1 → may be evicted immediately → use time-decay LFU
- Redis approximated LRU: samples 5 keys, evicts oldest (not true LRU) → increase sample size for better accuracy

| Sai lầm                    | Tại sao sai                                             | Đúng là                                            |
| -------------------------- | ------------------------------------------------------- | -------------------------------------------------- |
| LRU always best            | Scan pollution, one-time access patterns evict hot keys | LFU for skewed workloads; LRU for general          |
| FIFO is fine               | Ignores access pattern entirely                         | FIFO only for truly time-based data (logs, events) |
| Don't worry about eviction | Surprise evictions cause cache miss storms              | Monitor eviction rate; alert when > 5% of capacity |

🎯 **Interview Pattern:** "Default LRU for most caches. LFU for CDN edge caches (popular content should stay). Monitor eviction rate as early warning."

🔗 **Knowledge Chain:** Eviction → [Distributed Cache](#concept-4) → [Data Structures](../01-cs-fundamentals/data-structures-theory.md)

---

### Concept 4: Distributed Cache (Redis vs Memcached)

🪝 **Memory Hook:** Redis = Swiss Army knife (data structures, persistence, pub/sub). Memcached = simple hammer (fast, multi-threaded, key-value only). / Redis = đa năng; Memcached = chuyên cache.

**Why exists (2+ levels):**

- Level 1: Single-server cache can't serve multiple app instances (shared state needed)
- Level 2: Redis adds data structures (sorted set, list, stream) beyond simple key-value → enables use cases beyond caching
- Level 3: Cluster topology (hash slots, replication, failover) determines availability and partition tolerance

**Layer 1 — Simple Analogy:** Memcached = bảng trắng chung (ai cũng đọc/ghi, xóa khi đầy). Redis = bảng trắng + ngăn kéo + lịch nhắc + loa phát thanh.

**Layer 2 — Mechanics + Visual:**

```
REDIS CLUSTER (16384 hash slots):
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Master A    │  │ Master B    │  │ Master C    │
│ Slots 0-5460│  │ Slots 5461- │  │ Slots 10923-│
│ Replica A'  │  │ 10922       │  │ 16383       │
└─────────────┘  │ Replica B'  │  │ Replica C'  │
                 └─────────────┘  └─────────────┘
Hot key: "product:iphone" → all traffic to one master → replicate hot key or use client-side cache
```

**Layer 3 — Edge Cases:**

- Hot key: single key receiving 100K+ QPS → solution: key replication (product:iphone:1, :2, :3) or local cache layer
- Big key: 1MB+ value → blocks Redis single-thread → split into sub-keys or use lazy delete
- Redis persistence: RDB (snapshot) vs AOF (append log) → AOF + fsync every second for balance

| Sai lầm                 | Tại sao sai                                            | Đúng là                                                            |
| ----------------------- | ------------------------------------------------------ | ------------------------------------------------------------------ |
| Redis for everything    | Single-threaded; big keys block all operations         | Redis for complex data; Memcached for simple high-throughput cache |
| Ignore hot keys         | One hot key saturates one Redis node → cluster useless | Monitor key access patterns; replicate hot keys                    |
| No persistence = faster | True, but crash = cold cache = DB stampede             | RDB snapshot every 5min as safety net; AOF for critical data       |

🎯 **Interview Pattern:** "Redis Cluster for session store + sorted set leaderboard. Monitor hot keys with `redis-cli --hotkeys`. Client-side L1 cache + Redis L2 for hot data."

🔗 **Knowledge Chain:** Distributed Cache → [BE Redis](../../be-track/03-database-advanced/03-nosql-redis-mongo.md) → [Replication](./replication-partitioning.md)

---

### Concept 5: CDN Caching

🪝 **Memory Hook:** CDN = copy shop ở mỗi thành phố. Thay vì bay về trụ sở lấy tài liệu (origin), lấy bản copy gần nhất. / Giảm latency bằng cách đưa data gần user.

**Why exists (2+ levels):**

- Level 1: Physical distance = network latency (light speed limit: ~100ms cross-continent)
- Level 2: CDN absorbs traffic: 80%+ of requests never reach origin server
- Level 3: Edge computing (Cloudflare Workers) extends CDN beyond static content to dynamic logic

**Layer 1 — Simple Analogy:** Netflix: phim không stream từ 1 server ở Mỹ. CDN copy phim đến 100+ PoPs (Points of Presence) worldwide. User Việt Nam xem từ Singapore PoP (20ms vs 200ms).

**Layer 2 — Mechanics + Visual:**

```
USER (VN) → CDN PoP (SG) → Origin (US)
               │
          Cache-Control: max-age=86400
          ETag: "abc123"
          │
     HIT: return cached (1ms)
     MISS: fetch origin, cache, return
     STALE: serve stale + revalidate async
```

Key headers: `Cache-Control`, `ETag`, `Last-Modified`, `Vary`. Purge: API call to CDN to invalidate specific URLs.

**Layer 3 — Edge Cases:**

- Dynamic content at edge: Cloudflare Workers run JS at edge → personalized responses without hitting origin
- Cache key collision: different content served to mobile vs desktop → use `Vary: User-Agent` header
- CDN cold start after purge: thundering herd to origin → use stale-while-revalidate

| Sai lầm                   | Tại sao sai                                                               | Đúng là                                                                |
| ------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| CDN only for images/JS    | CDN can cache API responses, HTML with appropriate headers                | Cache static (long TTL) + dynamic (short TTL + stale-while-revalidate) |
| Purge CDN on every deploy | Defeats caching; origin gets full traffic temporarily                     | Version URLs (/v2/style.css) or content-hash filenames                 |
| Ignore Vary header        | Same URL returns different content for different clients → wrong response | Set Vary: Accept-Encoding, Accept-Language as needed                   |

🎯 **Interview Pattern:** "Static assets on CDN with content-hash URLs (infinite cache). API responses with Cache-Control: max-age=10, stale-while-revalidate=60 for near-real-time."

🔗 **Knowledge Chain:** CDN → [System Design Building Blocks](./system-design-theory.md) → [Load Balancing](./06-load-balancing.md)

---

### Concept 6: Cache Stampede & Failure Modes

🪝 **Memory Hook:** Stampede = 10,000 horses running to the same door when it opens (TTL expires). Singleflight = only 1 horse goes, others wait. / Khi cache expire, 10K requests đồng loạt hit DB.

**Why exists (2+ levels):**

- Level 1: Cache expiration creates a window where all requests hit the slow backend
- Level 2: Hot keys amplify the problem: popular items = most requests = biggest stampede
- Level 3: Negative caching and stale-while-revalidate are complementary defense strategies

**Layer 1 — Simple Analogy:** Sale 12h đêm: cửa hàng chỉ có 1 cửa. 10K người đợi → cửa mở → chen lấn (stampede). Fix: 1 người vào lấy hàng, còn lại đợi ngoài (singleflight).

**Layer 2 — Mechanics + Visual:**

```
STAMPEDE:                           SINGLEFLIGHT FIX:
TTL expires                         TTL expires
  │                                   │
10K requests → DB (overload!)      1 request → DB
  │                                 9999 wait
  └→ DB crash                         │
                                   Result → cache + return to all 10K

STALE-WHILE-REVALIDATE:
TTL expires → serve stale immediately
  + async revalidation in background
  → zero latency impact on users
```

**Layer 3 — Edge Cases:**

- Lock stampede: singleflight with distributed lock (Redis SETNX) → what if lock holder crashes? Use lock with TTL
- Negative caching: cache "not found" results → prevents DB scan for non-existent keys (cache penetration attack)
- Cache avalanche: many keys expire simultaneously → stagger TTL with jitter; pre-warm before known events

| Sai lầm                    | Tại sao sai                                                | Đúng là                                                    |
| -------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| Only handle cache miss     | Stampede is about SIMULTANEOUS misses, not single miss     | Singleflight + TTL jitter + stale-while-revalidate         |
| Ignore negative caching    | Attacker queries non-existent keys → every request hits DB | Cache "not found" with short TTL (30s)                     |
| Pre-warm solves everything | Pre-warming only works for predictable traffic patterns    | Pre-warm + singleflight + jitter for comprehensive defense |

🎯 **Interview Pattern:** "Three-layer defense: (1) TTL jitter prevents synchronized expiration. (2) Singleflight coalesces concurrent requests. (3) Stale-while-revalidate serves stale during rebuild."

🔗 **Knowledge Chain:** Stampede → [Resilience Patterns](../../be-track/02-backend-knowledge/07-resilience-patterns.md) → [MQ](./05-message-queues.md)

---

### Concept 7: Multi-Level Caching & Consistency

🪝 **Memory Hook:** L1 = bộ nhớ cá nhân (process cache, 1μs). L2 = bảng chung văn phòng (Redis, 1ms). L3 = thư viện (DB, 10ms). / Càng gần = càng nhanh nhưng càng khó invalidate.

**Why exists (2+ levels):**

- Level 1: Different cache layers have different latency/capacity trade-offs
- Level 2: L1 (in-process) is fastest but non-shared; L2 (distributed) is shared but network hop
- Level 3: Invalidation across levels is the hardest part: L1 may hold stale data after L2 is invalidated

**Layer 1 — Simple Analogy:** Não (L1): nhớ ngay, nhưng chỉ 1 người biết. Bảng trắng (L2): cả team thấy, nhưng phải đi xem. Sách (L3): chính xác nhất, nhưng lâu nhất.

**Layer 2 — Mechanics + Visual:**

```
REQUEST → L1 (process cache, 1μs)
           │ MISS
           ▼
          L2 (Redis, 1ms)
           │ MISS
           ▼
          L3 (Database, 10ms)
           │
     Populate L2 → L1

INVALIDATION FLOW (reverse):
DB change → invalidate L2 → broadcast to all L1 instances
(pub/sub or polling with version check)
```

**Layer 3 — Edge Cases:**

- L1 inconsistency: 10 app servers each have L1 cache → DB updates → L2 invalidated → but 9 servers still serve stale L1 → need pub/sub broadcast
- L1 memory pressure: unbounded L1 → OOM kill → use size-limited LRU with short TTL
- Cache-aside at each level: complexity explosion → standardize with cache abstraction library

| Sai lầm                     | Tại sao sai                                           | Đúng là                                                       |
| --------------------------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| L1 cache everything         | Memory leak risk; stale data across instances         | L1 only for hot, rarely-changing data (config, feature flags) |
| Skip L2, go L1→L3           | Every L1 miss hits DB directly → DB overload at scale | L2 (Redis) as shared buffer between L1 and L3                 |
| No L1 invalidation strategy | L1 serves stale data indefinitely                     | Short TTL (10-30s) + event-driven invalidation (pub/sub)      |

🎯 **Interview Pattern:** "L1 (Go sync.Map, 10s TTL) for top-100 products. L2 (Redis, 60s TTL) for all products. L3 (PostgreSQL) as source of truth. Invalidation via Redis pub/sub."

🔗 **Knowledge Chain:** Multi-Level → [Distributed Cache](#concept-4) → [System Design Theory](./system-design-theory.md)

---

## 1. Caching Fundamentals / Nền tảng về cache

### 🟢 Q: What is caching, and why does it matter in system design? `[Junior]`

**A:** Caching là kỹ thuật lưu tạm dữ liệu đã truy cập để lần sau đọc nhanh hơn, giảm truy vấn xuống tầng chậm như database hoặc service ngoài.
Trong phỏng vấn, bạn cần nhấn mạnh 4 lợi ích: giảm latency, giảm tải backend, tăng throughput, và cải thiện trải nghiệm người dùng.
Ví dụ: query DB mất 30ms, đọc Redis mất 1ms. Nếu cache hit 90%, latency trung bình của luồng đọc giảm rất mạnh.
Công thức đơn giản: average*latency = hit_rate * cache*latency + miss_rate * backend_latency.
Trade-off: hệ thống nhanh hơn nhưng phải xử lý invalidation và consistency phức tạp hơn.
Xem thêm: `shared/03-database/database-theory.md` (query processing), `shared/02-system-design/system-design-theory.md` (performance).

### 🟢 Q: What is cache hit, cache miss, and hit ratio? `[Junior]`

**A:** Cache hit là khi dữ liệu đã có trong cache nên trả về ngay, còn cache miss là không có nên phải đọc từ source of truth.
Hit ratio = số request hit / tổng request. Đây là KPI quan trọng nhất của tầng cache.
Miss penalty là chi phí thêm khi miss: network hop + DB query + (có thể) serialize/deserialize.
Trong production, theo dõi thêm: p95/p99 latency, evictions, memory usage, key churn rate.
Nếu hit ratio cao nhưng p99 vẫn xấu, có thể do hot key, lock contention, hoặc cache stampede.

## 2. Core Access Patterns / Các mẫu truy cập chính

### 🟡 Q: How does Cache-Aside (Lazy Loading) work? `[Mid]`

**A:** Cache-aside: ứng dụng tự quản lý logic cache. Khi read: check cache -> miss thì đọc DB -> ghi vào cache -> trả kết quả.
Ưu điểm: đơn giản, linh hoạt, chỉ cache dữ liệu thực sự được truy cập.
Nhược điểm: miss đầu tiên chậm, có thể tạo stampede nếu nhiều request cùng miss một key nóng.
Write path thường là update DB trước rồi xóa key cache liên quan (invalidate).
Phù hợp cho read-heavy workloads và data thay đổi không quá liên tục.
Cross-reference: `be-track/03-database-advanced/04-caching-patterns.md`.

### 🟡 Q: What is Write-Through caching? `[Mid]`

**A:** Write-through: mỗi lần ghi dữ liệu, ứng dụng ghi đồng thời vào cache và database (hoặc cache tự forward xuống DB).
Ưu điểm: đọc sau ghi thường hit cache, giảm stale window cho read-heavy flows.
Nhược điểm: write latency tăng do đường ghi đi qua nhiều tầng; có thể gây write amplification.
Cần cơ chế atomicity hoặc transactional outbox để tránh trạng thái cache/DB lệch nhau khi lỗi giữa chừng.
Rất hữu ích cho profile/session metadata cần read-after-write nhanh.

### 🟡 Q: What is Write-Behind (Write-Back), and when is it risky? `[Mid]`

**A:** Write-behind: ghi vào cache trước, sau đó flush xuống DB theo batch hoặc theo thời gian.
Ưu điểm: write latency rất thấp ở phía client, tận dụng batch để tối ưu I/O DB.
Nhược điểm lớn: nguy cơ mất dữ liệu khi cache node crash trước khi flush; consistency yếu hơn.
Để giảm rủi ro, cần AOF/WAL bền vững, replication, retry idempotent, và monitoring backlog flush.
Phù hợp với telemetry/counter không yêu cầu tuyệt đối tức thời.

### 🟡 Q: What is Read-Through caching? `[Mid]`

**A:** Read-through: ứng dụng chỉ đọc qua cache layer; nếu miss thì cache layer tự lấy từ DB rồi trả về.
Ưu điểm: tách logic cache khỏi business code, giảm duplication trong service.
Nhược điểm: phụ thuộc mạnh vào cache provider; custom logic khó hơn cache-aside.
Trong enterprise, read-through hay đi cùng write-through để đồng nhất behavior đọc/ghi.

## 3. Invalidation & Expiration / Vô hiệu hóa và hết hạn

### 🟡 Q: Why is cache invalidation considered hard? `[Mid]`

**A:** Vì dữ liệu có nhiều bản sao theo thời gian: DB là truth, cache là snapshot. Khi dữ liệu đổi, phải biết key nào cần xóa/cập nhật.
Nếu invalidate thiếu -> stale reads; nếu invalidate quá nhiều -> miss rate cao, mất lợi ích cache.
Khó hơn trong distributed systems vì delay mạng, retry, out-of-order events.
Câu nói kinh điển trong phỏng vấn: 'There are only two hard things in CS: cache invalidation and naming things.'

### 🟢 Q: What is TTL-based invalidation? `[Junior]`

**A:** TTL (time-to-live) đặt thời gian sống cho key. Hết TTL thì key tự hết hạn.
Ưu điểm: đơn giản, không cần biết domain event cụ thể.
Nhược điểm: dữ liệu có thể stale trong khoảng TTL; chọn TTL quá ngắn gây tốn tài nguyên refill.
Thực tế thường dùng TTL có jitter ngẫu nhiên để tránh nhiều key hết hạn cùng lúc.

### 🟡 Q: How does event-based invalidation work? `[Mid]`

**A:** Khi dữ liệu đổi (ví dụ UserUpdated), service phát event qua Kafka/SNS; consumer invalidate key liên quan.
Ưu điểm: freshness cao hơn TTL đơn thuần.
Nhược điểm: cần mapping event -> key, xử lý duplicate/out-of-order event, và đảm bảo at-least-once semantics.
Nên kết hợp TTL như safety net nếu event pipeline lỗi.
Cross-reference: `be-track/02-backend-knowledge/03-distributed-systems.md`.

### 🟡 Q: What is version-based invalidation? `[Mid]`

**A:** Version-based: key chứa version (vd `product:42:v17`). Khi dữ liệu đổi, tăng version, key cũ tự thành rác logic.
Ưu điểm: tránh race condition xóa nhầm key mới, hỗ trợ immutable cache entries.
Nhược điểm: cần chỗ lưu version chuẩn (DB/meta store) và quy trình cleanup key cũ.

## 4. Eviction Policies / Chính sách đẩy dữ liệu khỏi cache

### 🟢 Q: What is LRU and when is it effective? `[Junior]`

**A:** LRU (Least Recently Used) loại bỏ item lâu không được truy cập gần đây nhất.
Hiệu quả khi tính 'temporal locality' cao: dữ liệu vừa truy cập có xu hướng được truy cập lại.
Nhược điểm: có thể fail với scan workload lớn vì item nóng cũ bị đẩy khỏi cache.

### 🟢 Q: How is LFU different from LRU? `[Junior]`

**A:** LFU (Least Frequently Used) loại item có tần suất truy cập thấp nhất, thiên về độ 'hot' dài hạn.
LFU tốt cho workload có long-term hot keys, nhưng cần lưu counter và aging để tránh key cũ thống trị mãi.
Một số hệ thống dùng approximate LFU để giảm memory/CPU overhead.

### 🟢 Q: When do FIFO or Random eviction make sense? `[Junior]`

**A:** FIFO đơn giản, chi phí thấp, phù hợp cache nhỏ hoặc dữ liệu đồng đều.
Random đôi khi surprisingly good khi workload không có pattern rõ ràng và cần implementation cực nhẹ.
Trong phỏng vấn, nêu rõ: simplicity vs optimal hit ratio.

## 5. Distributed Caching / Cache phân tán

### 🟡 Q: Redis vs Memcached: key differences? `[Mid]`

**A:** Redis hỗ trợ nhiều data structure (string, hash, list, set, zset), persistence (RDB/AOF), replication, Lua/transactions cơ bản.
Memcached tập trung key-value in-memory đơn giản, rất nhanh, footprint nhẹ, không persistence mặc định.
Redis phù hợp khi cần tính năng phong phú; Memcached phù hợp cache thuần túy, dễ scale ngang.
Cả hai thường dùng cho session cache, query result cache, rate limiting metadata.

### 🟡 Q: What challenges appear in distributed cache clusters? `[Mid]`

**A:** Phân bố key (sharding), failover, replication lag, hot partition, network split là các vấn đề chính.
Client-side sharding cần consistent hashing để giảm key remap khi thêm/bớt node.
Cần quan sát: per-node hit ratio, memory fragmentation, replication offset, command latency.

## 6. CDN Caching / Cache ở biên mạng

### 🟡 Q: How does CDN caching work end-to-end? `[Mid]`

**A:** Client request đi đến edge PoP gần nhất. Nếu edge hit -> trả ngay; nếu miss -> fetch origin, lưu lại, rồi trả client.
CDN giảm RTT xuyên lục địa và giảm tải origin, đặc biệt cho static assets và API cacheable.
Cần thiết kế cache key đúng: URL path + query chuẩn hóa + header quan trọng (Accept-Language, Authorization nếu cần).
Cross-reference: `shared/01-cs-fundamentals/networking-theory.md`.

### 🟢 Q: Which HTTP cache headers are commonly used? `[Junior]`

**A:** `Cache-Control`: `max-age`, `s-maxage`, `public`, `private`, `no-store`, `stale-while-revalidate`.
`ETag` và `If-None-Match`: revalidation theo fingerprint nội dung.
`Last-Modified` và `If-Modified-Since`: revalidation theo timestamp.
`Vary`: xác định header nào ảnh hưởng cache key ở proxy/CDN.

## 7. Consistency & Failure Modes / Nhất quán và lỗi phân tán

### 🔴 Q: What consistency issues happen between cache and database? `[Senior]`

**A:** Các anomaly thường gặp: stale read, read-after-write violation, lost update, dual-write inconsistency.
Ví dụ race: request A update DB rồi invalidate chậm; request B đọc miss, lấy dữ liệu cũ từ replica lagging và ghi lại cache stale.
Mitigation: write fencing token, versioned key, read-your-writes routing, và monotonic reads theo session.
Trong interview senior, cần mô tả timeline race bằng sequence rõ ràng.

### 🔴 Q: What is cache stampede (thundering herd), and how to mitigate? `[Senior]`

**A:** Stampede xảy ra khi nhiều request đồng thời miss một key nóng và cùng đập vào backend.
Biện pháp: request coalescing/single-flight, mutex per-key, probabilistic early refresh, stale-while-revalidate.
Ngoài ra: TTL jitter, warmup trước giờ cao điểm, và rate limit fallback.
Nếu backend critical, dùng circuit breaker để ngăn cascading failure.

### 🔴 Q: What is negative caching and when should we use it? `[Senior]`

**A:** Negative caching là cache cả kết quả 'không tồn tại' (404, empty result) trong thời gian ngắn.
Nó giảm load cho các key bot hoặc brute-force query lặp lại.
Rủi ro: nếu object vừa được tạo sau đó, client có thể thấy false negative trong thời gian TTL.
Giải pháp: TTL ngắn + event invalidate khi object được tạo.

## 8. Multi-Level Caching / Cache nhiều tầng

### 🟡 Q: What is L1/L2/L3 cache in application architecture? `[Mid]`

**A:** L1: in-process/local memory cache (rất nhanh, scope theo instance).
L2: distributed cache (Redis/Memcached) dùng chung cho nhiều instance.
L3: CDN/edge cache gần người dùng cuối.
Mục tiêu: tối ưu latency theo nhiều lớp, nhưng phải quản lý invalidation xuyên tầng.

### 🔴 Q: How do you design invalidation across multi-level cache? `[Senior]`

**A:** Thiết kế chuẩn: event từ DB change stream -> invalidate L2 -> propagate/purge L3 -> broadcast local L1 bust signal.
Nếu không thể strong sync, dùng bounded staleness + version token để đảm bảo không đọc dữ liệu quá cũ.
Luôn có fallback path từ L1 miss -> L2 -> DB và metrics từng tầng để tìm bottleneck.

## 9. Interview Drill Q&A / Bộ câu hỏi luyện phỏng vấn

### 🟢 Q: When should we avoid caching entirely? `[Junior]`

**A:** Tránh cache khi dữ liệu cực kỳ nhạy về độ mới (ví dụ số dư giao dịch thời gian thực) mà stale dù vài giây cũng không chấp nhận được.
Nếu workload nhỏ, DB đủ nhanh, thêm cache có thể làm tăng độ phức tạp không cần thiết.

### 🟢 Q: What is a good starting TTL for user profile cache? `[Junior]`

**A:** Không có con số cố định; bắt đầu từ 5-15 phút với dữ liệu ít đổi, rồi tune theo hit ratio và stale complaint.
Quan trọng hơn là có event invalidate khi profile update.

### 🟡 Q: How do you cache paginated API responses safely? `[Mid]`

**A:** Đưa page, page_size, filter đã chuẩn hóa vào cache key; tránh cache key bị nổ do query tự do.
Dùng short TTL + cache top pages trước, không cache toàn bộ page-space.

### 🟡 Q: How would you cache personalized data? `[Mid]`

**A:** Phân tách phần public và private; private key cần user scope (ví dụ `feed:user:{id}:v{n}`).
Cẩn thận với CDN: thường không cache response có Authorization trừ khi đã thiết kế vary/key đúng.

### 🟡 Q: How do you measure cache effectiveness? `[Mid]`

**A:** Theo dõi hit ratio theo endpoint/key prefix, backend offload %, p95/p99 latency, và cost per request.
Đo theo business metric: conversion hoặc time-to-first-content.

### 🔴 Q: How to prevent hot-key overload in Redis? `[Senior]`

**A:** Dùng local L1 cache, request collapsing, và replication read scaling (nếu semantics cho phép).
Có thể shard logical hot object thành nhiều sub-keys hoặc precompute fanout.

### 🔴 Q: How do you migrate cache key schema without outage? `[Senior]`

**A:** Dùng versioned key (`v1`, `v2`) chạy dual-read/dual-write tạm thời, rồi cutover bằng feature flag.
Đặt sunset window để xóa key cũ an toàn.

### 🔴 Q: Can cache improve availability during DB outage? `[Senior]`

**A:** Có, nếu dữ liệu còn nóng trong cache và chấp nhận stale-read mode.
Nhưng cần guardrail: stale TTL cap, degrade mode banner, và replay writes sau khi DB hồi phục.

### 🔴 Q: How do you explain cache consistency trade-off with CAP context? `[Senior]`

**A:** Trong partition, bạn thường ưu tiên availability của read bằng cache, chấp nhận eventual consistency.
Nếu business yêu cầu strict consistency, cần route về source-of-truth và chấp nhận latency/error cao hơn.

### 🟡 Q: What are common cache anti-patterns? `[Mid]`

**A:** Cache everything without key design, TTL đồng loạt không jitter, không metrics, và invalidate bằng `flushall`.
Anti-pattern khác: dùng cache như DB chính mà không durability plan.

## 10. Cross-References / Tài liệu liên quan

- `docs/shared/02-system-design/system-design-theory.md`
- `docs/shared/03-database/database-theory.md`
- `docs/shared/01-cs-fundamentals/networking-theory.md`
- `docs/be-track/03-database-advanced/04-caching-patterns.md`
- `docs/be-track/04-be-system-design/01-design-framework.md`
- `docs/fe-track/modules/07-performance.md`

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is cache-aside pattern and when should you use it? / Cache-aside pattern là gì? 🟢 Junior

**A:** Cache-aside (lazy loading): app manages cache directly. Check cache → miss → query DB → populate cache → return. On write: update DB then DELETE cache key (not update).

```
Read flow:
1. App checks cache → MISS
2. App queries DB
3. App writes to cache (with TTL)
4. App returns result

Write flow:
1. App updates DB
2. App DELETEs cache key ← delete not update!
3. Next read miss → populate fresh data
```

Vietnamese explanation: Cache-aside là pattern phổ biến nhất vì đơn giản và linh hoạt. "Tại sao DELETE thay vì UPDATE?" → UPDATE có race condition (2 threads đồng thời write → stale value wins). DELETE an toàn hơn. Use when: read-heavy, acceptable cache miss latency. Avoid: multiple services write same data (coordination hard).

---

### Q: What is cache stampede and how do you prevent it? / Cache stampede là gì và cách phòng? 🟡 Mid

**A:** Cache stampede (thundering herd): when a popular cache key expires, many concurrent requests all miss and rush to query DB simultaneously — overwhelming it.

```
Stampede:
Time T: hot_key expires (TTL=60s)
→ 5000 concurrent requests all MISS
→ 5000 simultaneous DB queries → DB overload!

Prevention:
1. Singleflight: first request queries DB, others wait for same result
   (golang.org/x/sync/singleflight)

2. TTL jitter: TTL = base + random(0, base/10)
   → spread expiry across time

3. Stale-while-revalidate: serve stale immediately,
   refresh in background → no wait
```

Vietnamese explanation: Thundering herd phổ biến sau deployment (cache cleared) hoặc hot key expire. Thực tế: singleflight + TTL jitter là combination phổ biến nhất. Preemptive refresh: background worker refresh hot keys trước khi expire. Interview: luôn nhắc đến singleflight + jitter khi nói về stampede.

---

### Q: What is the difference between write-through and write-behind? / Write-through vs write-behind? 🟡 Mid

**A:** **Write-through**: update cache AND DB synchronously on every write. Consistent but higher latency. **Write-behind** (write-back): update cache immediately, flush to DB asynchronously. Low latency but data loss risk if cache crashes.

```
Write-through:
App → Cache + DB (sync)  ← consistent, always both updated
Latency: DB write RTT

Write-behind:
App → Cache (sync, fast return)
         ↓ async batch
        DB (eventually)
Risk: crash between cache write and DB flush = data loss
```

Vietnamese explanation: Write-through phổ biến hơn vì an toàn (no data loss). Write-behind: high-throughput counters, analytics where loss tolerable. Hybrid: write-through cho critical data (orders, payments), write-behind cho non-critical (view counts). Redis không có native write-behind — cần async worker implementation.

---

## Interview Q&A Summary / Tổng Kết

| #   | Question                          | Level | Core Concept    | Key Signal                                                               |
| --- | --------------------------------- | ----- | --------------- | ------------------------------------------------------------------------ |
| 1   | What is caching?                  | 🟢    | Fundamentals    | Latency formula: avg = hit_rate × cache_lat + miss_rate × db_lat         |
| 2   | Cache hit/miss/ratio              | 🟢    | Fundamentals    | KPI: hit ratio + p99 latency + eviction rate                             |
| 3   | Cache-Aside pattern               | 🟢    | Access Patterns | DELETE on write (not update); race condition awareness                   |
| 4   | Write-Through                     | 🟡    | Access Patterns | Sync write to both; consistent but slower                                |
| 5   | Write-Behind                      | 🟡    | Access Patterns | Async DB; fast but data loss risk                                        |
| 6   | Read-Through                      | 🟡    | Access Patterns | Cache manages fetching; transparent to app                               |
| 7   | Cache invalidation hard?          | 🟡    | Invalidation    | Event-based + TTL as safety net                                          |
| 8   | TTL-based invalidation            | 🟢    | Invalidation    | Add jitter to prevent stampede                                           |
| 9   | Event-based invalidation          | 🟡    | Invalidation    | CDC + Kafka → cache consumer                                             |
| 10  | Version-based invalidation        | 🟡    | Invalidation    | No invalidation needed; old keys auto-expire                             |
| 11  | LRU eviction                      | 🟢    | Eviction        | HashMap + DLL, O(1); Redis default                                       |
| 12  | LFU vs LRU                        | 🟢    | Eviction        | LFU for skewed distributions                                             |
| 13  | FIFO/Random eviction              | 🟢    | Eviction        | FIFO for time-based data only                                            |
| 14  | Redis vs Memcached                | 🟡    | Distributed     | Redis: data structures + persistence; Memcached: simple + multi-threaded |
| 15  | Distributed cache challenges      | 🟡    | Distributed     | Consistent hashing, hot partitions, failover                             |
| 16  | CDN end-to-end                    | 🟡    | CDN             | Edge PoP → origin on miss; cache key design                              |
| 17  | HTTP cache headers                | 🟢    | CDN             | Cache-Control, ETag, Vary                                                |
| 18  | Cache-DB consistency              | 🔴    | Failure Modes   | Race timeline: stale read from lagging replica                           |
| 19  | Cache stampede                    | 🔴    | Failure Modes   | Singleflight + TTL jitter + stale-while-revalidate                       |
| 20  | Negative caching                  | 🔴    | Failure Modes   | Cache "not found" with short TTL against penetration attack              |
| 21  | L1/L2/L3 architecture             | 🟡    | Multi-Level     | Process → Redis → DB; invalidation cascade                               |
| 22  | Multi-level invalidation          | 🔴    | Multi-Level     | DB CDC → L2 invalidate → broadcast L1 bust                               |
| 23  | When avoid caching?               | 🟢    | Interview Drill | Frequently changing data, small dataset, strong consistency required     |
| 24  | Starting TTL for user profile?    | 🟢    | Interview Drill | 5-15min; balance freshness vs hit ratio                                  |
| 25  | Cache paginated API?              | 🟡    | Interview Drill | Cache per page+filters; invalidate on data change                        |
| 26  | Cache personalized data?          | 🟡    | Interview Drill | User-scoped keys; careful with CDN (no public cache)                     |
| 27  | Cache effectiveness metrics?      | 🟡    | Interview Drill | Hit ratio, latency, eviction rate, memory usage                          |
| 28  | Hot-key overload in Redis?        | 🔴    | Interview Drill | Key replication, local cache, read replicas                              |
| 29  | Migrate cache key schema?         | 🔴    | Interview Drill | Dual-write period; version keys; gradual rollover                        |
| 30  | Cache for DB outage availability? | 🔴    | Interview Drill | Stale serving; circuit breaker; graceful degradation                     |
| 31  | Cache + CAP consistency?          | 🔴    | Interview Drill | Cache is AP (stale possible); design for eventual consistency            |
| 32  | Cache anti-patterns?              | 🟡    | Interview Drill | Cache-everything, no TTL, no eviction monitoring                         |
| 33  | Cache-aside bilingual             | 🟢    | Bilingual       | DELETE on write; race condition explanation                              |
| 34  | Stampede bilingual                | 🟡    | Bilingual       | Singleflight + jitter combination                                        |
| 35  | Write-through vs behind bilingual | 🟡    | Bilingual       | Through for critical; behind for analytics                               |

**Distribution:** 🟢 10 | 🟡 14 | 🔴 11

---

## Cold Call Simulation / Mô Phỏng Phỏng Vấn Bất Chợt

> ⚡ **Interviewer:** "Your product page has 50K RPM. Response time is 200ms. How would you add caching to reduce it to under 5ms?"

**30-second answer:**
"Cache-Aside with Redis: on first request, query DB (200ms), store in Redis with 60s TTL + 10% jitter. Subsequent requests hit Redis (1ms). For the top-100 hot products, add in-process L1 cache (sync.Map, 10s TTL) for sub-millisecond reads. Delete cache key on product update. Expected: 95%+ hit ratio → average latency = 0.95 × 1ms + 0.05 × 200ms = ~11ms. L1 pushes hot products under 5ms."

> **Follow-up:** "What happens on Black Friday when your most popular product's cache key expires?"

"TTL jitter prevents synchronized expiration. If it still expires: singleflight ensures only 1 request rebuilds cache, other 5K requests wait and share the result. Additionally, stale-while-revalidate serves the expired value immediately while async rebuild happens — zero user impact."

---

## Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại và trả lời 5 câu hỏi:

| #   | Type           | Question                                                                                         | Key Points                                                                        |
| --- | -------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| 1   | 🔄 Retrieval   | Vẽ Cache-Aside flow (read miss + write invalidation) và giải thích tại sao DELETE thay vì UPDATE | Race condition: 2 concurrent writes → stale value wins with UPDATE                |
| 2   | 🎨 Visual      | Vẽ multi-level cache architecture (L1→L2→L3) với invalidation flow ngược lại                     | L1 process → L2 Redis → L3 DB; invalidation: DB CDC → L2 → broadcast L1           |
| 3   | 🛠️ Application | Flash sale: 100K users đồng thời query cùng 1 product. Thiết kế caching strategy                 | Singleflight + TTL jitter + stale-while-revalidate + pre-warm hot keys            |
| 4   | 🐛 Debug       | Cache hit ratio 95% nhưng p99 latency vẫn 500ms. Root cause?                                     | Hot key saturating 1 Redis node, or big value serialization, or L1 miss + network |
| 5   | 🎓 Teach       | Giải thích cache stampede cho junior dev bằng ví dụ quán phở                                     | 1000 khách đến lúc 12h, menu hết (TTL expire) → 1000 người gọi chef (DB) cùng lúc |

💬 **Feynman Prompt:** Giải thích tại sao "delete on write" (cache invalidation) tốt hơn "update on write" — edge case nào mà update cache có thể dẫn đến inconsistency?

---

## Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | Timing | Focus                                                                   |
| ----- | ------ | ----------------------------------------------------------------------- |
| 1     | Day 1  | Đọc Overview + 7 Core Concepts (Hook + Layer 1)                         |
| 2     | Day 3  | Làm Self-Check không mở tài liệu; vẽ Cache-Aside + stampede flow        |
| 3     | Day 7  | Layer 2: Redis cluster topology, CDN headers, multi-level invalidation  |
| 4     | Day 14 | Cold Call practice: 30s answer; review Common Mistakes tables           |
| 5     | Day 30 | Mock interview: design caching layer for e-commerce with all 7 concepts |

---

## Connections / Liên Kết

**Same track (System Design):**

- ⬅️ [System Design Theory](./system-design-theory.md) — caching is core building block
- ➡️ [Replication & Partitioning](./replication-partitioning.md) — cache sits in front of replicated DB
- ➡️ [Load Balancing](./06-load-balancing.md) — LB distributes to cache-enabled servers
- ➡️ [Message Queues](./05-message-queues.md) — MQ enables async cache invalidation
- ➡️ [Consensus](./consensus-algorithms.md) — Redis Sentinel uses leader election

**Cross-track:**

- 🔗 [BE Caching Patterns](../../be-track/03-database-advanced/04-caching-patterns.md) — Go implementation with Redis
- 🔗 [NoSQL & Redis](../../be-track/03-database-advanced/03-nosql-redis-mongo.md) — Redis deep dive
- 🔗 [Resilience Patterns](../../be-track/02-backend-knowledge/07-resilience-patterns.md) — circuit breaker + cache fallback
