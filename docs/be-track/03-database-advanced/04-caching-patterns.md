# Caching Patterns & Strategies

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Theory-focused guide (~85% theory, 15% examples). Bilingual: English headings + Vietnamese explanations.
> Difficulty: 🟢 Junior | 🟡 Middle | 🔴 Senior

---

## Real-World Scenario / Tình Huống Thực Tế

**Shopee Product Page (thực tế):** Trang chi tiết sản phẩm call 3 APIs: product info, seller info, và review count — mỗi cái query DB riêng. Tổng latency: 450ms. Sau khi implement Cache-Aside với Redis TTL 60s: product info hit cache (0.3ms), seller info hit cache (0.3ms), chỉ có review count query DB. Tổng latency: ~50ms. DB load giảm 80%.

**Vấn đề mới xuất hiện:** Khi sản phẩm flash sale bắt đầu, 100,000 user đồng loạt vào trang → Redis key expire cùng lúc → **Cache Stampede**: 100,000 requests đổ vào DB. Fix: probabilistic early expiration + mutex lock khi rebuild cache.

**Bài học:** Caching giải quyết latency nhưng tạo ra vấn đề mới: cache invalidation, stampede, stale data. Senior engineer giải thích được cả vấn đề và giải pháp.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Cache giống bàn làm việc: thay vì đi xuống kho (database) mỗi lần cần tài liệu, bạn để tài liệu thường dùng trên bàn. Bàn nhỏ (memory đắt) nên phải chọn lọc tài liệu nào để lên — đây là eviction policy (LRU, LFU).

**Why it matters:** Database disk I/O: ~1-10ms. Redis in-memory: ~0.1ms. Chênh lệch 100x. Ở scale 10,000 QPS, caching là sự khác biệt giữa server $1,000/tháng và $100,000/tháng.

## Concept Map / Bản Đồ Khái Niệm

```
[Caching Patterns]
        │
        ├── Cache-Aside (Lazy Loading)
        │     ├── App checks cache first, fallback to DB
        │     ├── Cache miss = DB query + populate cache
        │     └── Risk: cache stampede on cold start
        │
        ├── Write-Through
        │     ├── Write to cache + DB simultaneously
        │     ├── Cache always fresh
        │     └── Cost: every write hits both stores
        │
        ├── Write-Behind (Write-Back)
        │     ├── Write to cache only, async flush to DB
        │     ├── Faster writes, risk data loss on crash
        │     └── Use: high-write workloads, analytics
        │
        └── Cache Invalidation Strategies
              ├── TTL: simple, safe, some staleness
              ├── Event-driven: DB triggers Redis DEL
              └── Versioning: cache key includes version hash
```

---

## Overview / Tổng Quan

| #   | Concept                      | Role                                                                        | Interview Weight |
| --- | ---------------------------- | --------------------------------------------------------------------------- | ---------------- |
| 1   | Why Caching                  | Foundation: latency hierarchy, cache hit ratio, Pareto principle            | ⭐⭐⭐⭐         |
| 2   | Caching Strategies           | Core patterns: Cache-Aside, Read/Write-Through, Write-Behind, Refresh-Ahead | ⭐⭐⭐⭐⭐       |
| 3   | Cache Invalidation           | Hardest problem: TTL, event-driven, versioning, delete vs update            | ⭐⭐⭐⭐⭐       |
| 4   | Cache Stampede               | Failure mode: thundering herd, singleflight, probabilistic early expiration | ⭐⭐⭐⭐⭐       |
| 5   | Eviction Policies            | Memory management: LRU, LFU, TTL, FIFO — Redis allkeys-lfu                  | ⭐⭐⭐⭐         |
| 6   | Multi-Level Caching          | Architecture: L1 local → L2 Redis → L3 CDN + consistency between tiers      | ⭐⭐⭐⭐         |
| 7   | Cache Consistency & Pitfalls | Production: penetration, breakdown, avalanche, CDC-based invalidation       | ⭐⭐⭐⭐⭐       |

**Relationships:** Why Caching (1) motivates all patterns. Caching Strategies (2) are the core building blocks. Invalidation (3) is the hardest part — every strategy addresses it differently. Stampede (4) is the most-asked failure scenario. Eviction (5) governs memory pressure. Multi-Level (6) combines strategies across tiers. Consistency & Pitfalls (7) are senior differentiators — knowing what goes wrong matters more than knowing what works.

---

## Core Concepts — Phase 2 Deep Content

### Concept 1: Why Caching — Latency Hierarchy

> 🪝 **Memory Hook:** "If L1 cache = 1 second, then RAM = 3 minutes, SSD = 9 hours, HDD = 46 days — that's why we cache"

**Why exists (Root-cause):**

- **Level 1:** Disk I/O (1-10ms) is 100-1000x slower than memory (0.1ms); caching avoids repeated slow access
- **Level 2:** Pareto principle — 20% of data serves 80% of requests; caching exploits this skew
- **Level 3:** At scale (10K+ QPS), DB connection pool becomes the bottleneck; caching shifts load to cheaper, faster memory layer

**Common Mistakes:**

- ❌ Caching everything → Low-hit-ratio keys waste memory; only cache data with high read-to-write ratio
- ❌ Not measuring hit ratio → Without metrics, you can't know if cache is effective (target: >95%)
- ❌ Ignoring cold start → First request always hits DB; use cache warming for predictable traffic patterns

**Interview Pattern:** "Why is caching important?" → Latency numbers (Jeff Dean) + Pareto principle + cost reduction at scale. Follow up: "What's a good hit ratio?" → >95% for most workloads; <80% means re-evaluate key selection

**Knowledge Chain:** Memory hierarchy → Latency numbers → Hit ratio → Pareto principle → Cache strategy selection

### Concept 2: Caching Strategies

> 🪝 **Memory Hook:** "Cache-Aside = lazy student (only studies what's asked), Write-Through = diligent student (notes everything), Write-Behind = procrastinator (writes notes later, might lose them)"

**Why exists (Root-cause):**

- **Level 1:** Different read/write patterns need different strategies — read-heavy favors Cache-Aside, write-heavy favors Write-Behind
- **Level 2:** Cache-Aside gives application full control but risks stampede on cold start; Write-Through ensures consistency but doubles write latency
- **Level 3:** Refresh-Ahead proactively refreshes before TTL expires, trading background CPU for zero-latency reads on hot keys

**Common Mistakes:**

- ❌ Using Write-Through for high-write workloads → Every write hits both cache + DB; use Write-Behind for throughput
- ❌ Updating cache instead of deleting on write → Race condition: thread A writes DB, thread B reads stale DB, thread B updates cache with stale data
- ❌ Not combining strategies → Production systems typically use Cache-Aside + TTL + event-driven invalidation together

**Interview Pattern:** "Compare Cache-Aside vs Write-Through" → Diagram both flows, explain consistency vs latency trade-off, name when to use each

**Knowledge Chain:** Access patterns → Strategy selection → Cache-Aside flow → Write-Through flow → Write-Behind risks → Refresh-Ahead optimization

### Concept 3: Cache Invalidation

> 🪝 **Memory Hook:** "2 hard problems in CS: cache invalidation, naming things, and off-by-one errors — invalidation is genuinely hard because distributed state is hard"

**Why exists (Root-cause):**

- **Level 1:** Cached data becomes stale when source data changes; invalidation keeps cache consistent
- **Level 2:** TTL is simple but allows staleness window; event-driven is precise but needs infrastructure (CDC/Kafka)
- **Level 3:** In distributed systems, invalidation ordering matters — delete before write vs after write has different race conditions

**Common Mistakes:**

- ❌ Only using TTL → Stale data for entire TTL duration; combine with event-driven for critical data
- ❌ Forgetting to invalidate across all cache tiers → L1 local cache may still hold stale data even after L2 Redis is cleared
- ❌ Cache-DB race condition → Write DB → network delay → another request reads stale cache before invalidation arrives

**Interview Pattern:** "How do you handle cache invalidation in microservices?" → CDC (Debezium) → Kafka → cache invalidation consumer → Redis DEL. Explain eventual consistency trade-off

**Knowledge Chain:** TTL basics → Event-driven invalidation → CDC pipeline → Cross-tier consistency → Distributed invalidation ordering

### Concept 4: Cache Stampede

> 🪝 **Memory Hook:** "100K users all knock on DB's door at t=60s when cache key expires — singleflight = one person goes in, everyone else waits for the answer"

**Why exists (Root-cause):**

- **Level 1:** When a popular cache key expires, all concurrent requests miss cache and hit DB simultaneously
- **Level 2:** DB load spikes 100x → timeouts → cascade failure → more requests queue → system down
- **Level 3:** Prevention requires breaking the simultaneous miss: singleflight (deduplicate), PER (probabilistic refresh), TTL jitter (desynchronize), stale-while-revalidate (serve stale)

**Common Mistakes:**

- ❌ No stampede protection on hot keys → Single most common production caching incident
- ❌ Using distributed lock instead of singleflight → Lock adds network round trip; singleflight is per-instance, lock-free
- ❌ Not applying TTL jitter by default → base_ttl + random(0, 10%) prevents synchronized expiry across keys

**Interview Pattern:** "What is cache stampede and how do you prevent it?" → Name 4 strategies (singleflight, PER, TTL jitter, stale-while-revalidate) + explain Go singleflight package

**Knowledge Chain:** Key expiry → Thundering herd → DB overload → Singleflight → PER → TTL jitter → Stale-while-revalidate → Production deployment

### Concept 5: Eviction Policies

> 🪝 **Memory Hook:** "LRU = throw away what you haven't touched longest; LFU = throw away what you touch least often; TTL = throw away after timer expires"

**Why exists (Root-cause):**

- **Level 1:** Memory is finite; when full, must decide which entries to remove
- **Level 2:** LRU is simple (O(1) with doubly-linked list + hashmap) but susceptible to scan pollution; LFU tracks frequency but needs decay mechanism
- **Level 3:** Redis allkeys-lfu is recommended for cache workloads — approximated LFU with logarithmic decay counter in 24 bits per key

**Common Mistakes:**

- ❌ Not setting maxmemory in Redis → OOM kills the process; always set maxmemory + eviction policy
- ❌ Using volatile-_ policies for pure cache → Only evicts keys with TTL; use allkeys-_ for cache where all keys are evictable
- ❌ LRU for scan-heavy workloads → Full table scan pollutes LRU cache; use LFU or segmented LRU

**Interview Pattern:** "Implement LRU cache" → Doubly-linked list + hashmap, O(1) get/put. Follow up: "Why does Redis use approximated LFU?" → Exact LFU requires full frequency counter; Redis uses 8-bit counter with logarithmic increment + decay

**Knowledge Chain:** Memory limits → Eviction decision → LRU/LFU/TTL comparison → Redis implementation → allkeys-lfu recommendation

### Concept 6: Multi-Level Caching

> 🪝 **Memory Hook:** "L1 = desk (nanoseconds, tiny), L2 = filing cabinet (milliseconds, medium), L3 = warehouse (seconds, huge) — each layer catches what the previous missed"

**Why exists (Root-cause):**

- **Level 1:** Single cache layer can't optimize for both latency and capacity; tiered approach balances both
- **Level 2:** L1 local (ristretto/sync.Map, ~ns, per-instance) absorbs burst traffic; L2 Redis (~0.3ms, shared) handles cache misses; L3 CDN (~50ms, global) serves static content
- **Level 3:** Cross-tier consistency requires pub/sub invalidation: write → delete L2 → publish event → all instances delete L1

**Common Mistakes:**

- ❌ L1 TTL too long → Stale data persists in local cache even after L2 is invalidated; keep L1 TTL short (1-5s)
- ❌ No L1 at all → Every request hits network (Redis); L1 absorbs 30-50% of traffic for hot keys
- ❌ Ignoring per-instance cache divergence → Different instances may have different L1 state; pub/sub notification mitigates

**Interview Pattern:** "Design caching for 100K req/s" → L1 ristretto (1-5s TTL) + L2 Redis cluster (5-10min TTL) + L3 CDN for static. Explain invalidation flow across tiers

**Knowledge Chain:** Single cache limits → Tiered architecture → L1/L2/L3 roles → Cross-tier invalidation → Pub/sub notification → Consistency guarantees

### Concept 7: Cache Consistency & Pitfalls

> 🪝 **Memory Hook:** "Penetration = ghost key, Breakdown = hot key death, Avalanche = mass extinction — three horsemen of cache failure"

**Why exists (Root-cause):**

- **Level 1:** Cache and DB are separate stores; any inconsistency means stale reads or missed writes
- **Level 2:** Penetration (query non-existent data bypasses cache) → bloom filter; Breakdown (single hot key expires) → singleflight; Avalanche (many keys expire simultaneously) → TTL jitter
- **Level 3:** CDC-based invalidation via Debezium → Kafka → cache consumer is the gold standard for microservices but adds infrastructure complexity and eventual consistency lag

**Common Mistakes:**

- ❌ Not using bloom filter for penetration → Attacker can DDoS DB by querying non-existent IDs
- ❌ Setting same TTL for all keys → Synchronized expiry causes avalanche; always add jitter
- ❌ Assuming cache is always consistent → Design application to tolerate stale reads; use version checks for critical data

**Interview Pattern:** "What are the three cache failure modes?" → Name penetration/breakdown/avalanche + solution for each. Senior: explain CDC pipeline for consistency

**Knowledge Chain:** Failure modes → Penetration (bloom filter) → Breakdown (singleflight) → Avalanche (TTL jitter) → CDC invalidation → Dual-write problems → Eventual consistency

---

## 1. Why Caching

### 🟢 Q: Tại sao caching quan trọng? Latency numbers every programmer should know?

Caching hoạt động vì có sự **chênh lệch khổng lồ** về latency giữa các tầng lưu trữ. Jeff Dean (Google) đã tổng hợp các con số kinh điển:

```
╔══════════════════════════════════════════════════════════╗
║  LATENCY NUMBERS EVERY PROGRAMMER SHOULD KNOW          ║
╠══════════════════════════════════════════════════════════╣
║  L1 cache reference ................... 0.5 ns          ║
║  L2 cache reference ...................   7 ns          ║
║  Main memory (RAM) reference ..........  100 ns         ║
║  SSD random read ..................... 16,000 ns (16µs) ║
║  HDD disk seek .................. 2,000,000 ns (2ms)    ║
║  Network round trip (same DC) ... 500,000 ns (0.5ms)    ║
║  Network round trip (cross DC) .. 150,000,000 ns (150ms)║
╚══════════════════════════════════════════════════════════╝

Scale: Nếu L1 = 1 giây thì:
  RAM       = 3 phút
  SSD       = 9 giờ
  HDD       = 46 ngày
  Network   = 9.5 năm (cross-region)
```

**Bản chất của caching:** Lưu trữ kết quả ở tầng **nhanh hơn** để tránh truy cập tầng **chậm hơn** nhiều lần.

---

### 🟢 Q: Cache hit ratio là gì? Tại sao Pareto principle liên quan?

**Cache hit ratio** = (số lần tìm thấy trong cache) / (tổng số lần truy vấn).

```
Hit Ratio = Cache Hits / (Cache Hits + Cache Misses)

Ví dụ: 950 hits / 1000 requests = 95% hit ratio
```

**Pareto Principle (80/20 rule) trong caching:**

- ~20% data phục vụ ~80% requests → chỉ cần cache 20% data là phục vụ được phần lớn traffic
- Đây là lý do caching hiệu quả dù cache size rất nhỏ so với total data
- Thực tế: nhiều hệ thống có phân bố **Zipf** — top 1% keys chiếm 30-50% traffic

**Tác động của hit ratio đến latency trung bình:**

| Hit Ratio | Avg Latency (cache=1ms, DB=50ms) | Speedup |
| --------- | -------------------------------- | ------- |
| 0%        | 50ms                             | 1x      |
| 80%       | 0.8 + 10 = 10.8ms                | 4.6x    |
| 95%       | 0.95 + 2.5 = 3.45ms              | 14.5x   |
| 99%       | 0.99 + 0.5 = 1.49ms              | 33.6x   |

**Insight:** Từ 95% → 99% hit ratio, performance cải thiện **hơn gấp đôi**. Mỗi phần trăm cuối cùng đều có giá trị rất lớn.

---

## 2. Caching Strategies

### 🟡 Q: Cache-Aside (Lazy Loading) hoạt động như thế nào?

**Application** chịu trách nhiệm quản lý cache. Đây là pattern phổ biến nhất.

```
  ┌───────────┐     1. GET key     ┌───────────┐
  │           │ ─────────────────► │           │
  │           │ ◄───────────────── │   Cache   │
  │           │   2a. HIT → return │           │
  │   App     │                    └───────────┘
  │           │   2b. MISS
  │           │ ─────────────────► ┌───────────┐
  │           │ ◄───────────────── │    DB     │
  │           │   3. Query DB      └───────────┘
  │           │
  │           │ ─── 4. SET key ──► ┌───────────┐
  └───────────┘     (populate)     │   Cache   │
                                   └───────────┘
```

**Flow:**

1. App kiểm tra cache trước
2. Cache **HIT** → trả kết quả ngay, Cache **MISS** → query DB
3. Kết quả từ DB được **ghi lại vào cache** với TTL
4. Request tiếp theo cho cùng key sẽ HIT cache

| Pros                                    | Cons                                              |
| --------------------------------------- | ------------------------------------------------- |
| Đơn giản, dễ implement                  | Cache miss penalty (trả thêm cost ghi cache)      |
| Chỉ cache data thực sự cần              | Data có thể stale (DB đã update nhưng cache chưa) |
| Cache down → app vẫn chạy (fallback DB) | Cold start — cache trống sau restart              |

**Use cases:** Hầu hết read-heavy applications, user profiles, product catalog.

---

### 🟡 Q: Read-Through khác gì Cache-Aside?

Khác biệt chính: **cache library/layer tự biết cách load data**, app không cần quan tâm.

```
  ┌───────────┐   1. GET key   ┌──────────────────────────┐
  │           │ ──────────────►│       Cache Layer         │
  │   App     │                │                           │
  │           │◄───────────────│  2a. HIT → return         │
  │           │   return data  │  2b. MISS:                │
  └───────────┘                │    ┌──── 3. Load from DB  │
                               │    ▼                      │
                               │  ┌──────┐   ┌──────┐     │
                               │  │ Cache │◄──│  DB  │     │
                               │  └──────┘   └──────┘     │
                               │  4. Store & return        │
                               └──────────────────────────┘
```

**So sánh:**

- **Cache-Aside:** App gọi cache, nếu miss thì app gọi DB rồi app ghi cache
- **Read-Through:** App chỉ gọi cache layer, cache layer tự lo việc load từ DB

| Pros                                       | Cons                                |
| ------------------------------------------ | ----------------------------------- |
| App code sạch hơn (không biết cache logic) | Cache layer phức tạp hơn            |
| Logic load data tập trung một chỗ          | Ít linh hoạt khi cần custom logic   |
| Tránh duplicate code                       | Phụ thuộc vào cache library support |

**Use cases:** ORM-level caching, CDN origin fetch, caching frameworks (Guava LoadingCache, Caffeine).

---

### 🟡 Q: Write-Through hoạt động như thế nào?

Mọi write đều đi qua cache **trước**, cache đồng bộ ghi xuống DB.

```
  ┌───────────┐  1. WRITE  ┌───────────┐  2. WRITE  ┌───────────┐
  │           │ ──────────►│           │ ──────────►│           │
  │   App     │            │   Cache   │            │    DB     │
  │           │◄───────────│           │◄───────────│           │
  └───────────┘  4. ACK    └───────────┘  3. ACK    └───────────┘

  App nhận ACK chỉ khi CẢ cache VÀ DB đều ghi xong.
```

| Pros                               | Cons                                          |
| ---------------------------------- | --------------------------------------------- |
| Cache luôn consistent với DB       | Write latency cao (ghi 2 nơi đồng bộ)         |
| Không bao giờ cache miss sau write | Không phù hợp write-heavy workloads           |
| Đơn giản về mặt consistency        | Cache chứa data có thể không bao giờ được đọc |

**Use cases:** Financial data, inventory count — nơi consistency quan trọng hơn write latency.

---

### 🔴 Q: Write-Behind (Write-Back) khác Write-Through ở điểm nào?

Write-Behind ghi cache **ngay lập tức**, rồi **bất đồng bộ** flush xuống DB sau.

```
  ┌───────────┐  1. WRITE  ┌───────────┐
  │           │ ──────────►│           │──── 2. ACK (ngay lập tức)
  │   App     │◄───────────│   Cache   │
  └───────────┘            │           │
                           │  (async)  │  3. Batch write
                           │     │     │     (sau N giây hoặc N items)
                           │     ▼     │
                           │ ┌───────┐ │
                           │ │ Queue │ │──────►┌───────────┐
                           │ └───────┘ │       │    DB     │
                           └───────────┘       └───────────┘
```

| Pros                                   | Cons                                         |
| -------------------------------------- | -------------------------------------------- |
| Write latency rất thấp (chỉ ghi cache) | **Mất data nếu cache crash** trước khi flush |
| Batch writes → giảm DB load đáng kể    | Phức tạp, khó debug                          |
| Hấp thụ write spikes hiệu quả          | Eventual consistency giữa cache và DB        |

**Use cases:** Logging, analytics, session data, gaming leaderboard — nơi tolerant với data loss nhỏ.

---

### 🔴 Q: Refresh-Ahead pattern là gì?

Cache **proactively** refresh data **trước khi** nó hết hạn, dựa trên dự đoán access pattern.

```
  Timeline:
  ├──────────────────────────────┤
  0              TTL × factor    TTL
  │   Normal serving             │ Trigger │ Would expire
  │                              │ refresh │
  │                              ▼         │
  │                        Background      │
  │                        reload from DB  │
  │                              │         │
  │                              ▼         │
  │                        Cache updated   │
  │                        with fresh data │
  │                        + new TTL       │
```

**Ví dụ:** TTL = 60s, factor = 0.8. Khi key được access sau 48s → trigger background refresh.

| Pros                                    | Cons                            |
| --------------------------------------- | ------------------------------- |
| Gần như zero cache miss cho hot keys    | Phức tạp implementation         |
| Latency ổn định (không có miss penalty) | Waste resources nếu dự đoán sai |
| Tốt cho frequently accessed data        | Cần track access patterns       |

**Use cases:** Homepage data, frequently accessed configs, popular product listings.

---

## 3. Cache Invalidation

### 🟡 Q: Tại sao cache invalidation khó? Có những cách nào?

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

**Tại sao khó:**

- Cache và DB là **hai hệ thống riêng biệt** → không có distributed transaction dễ dàng
- Race conditions giữa concurrent reads và writes
- Nhiều service cùng đọc/ghi cùng data nhưng cache riêng

**Các phương pháp invalidation:**

**1. TTL-based (Time-To-Live):**

- Đơn giản nhất — set thời gian sống, hết hạn tự xóa
- Trade-off: TTL ngắn = fresher data nhưng miss nhiều, TTL dài = stale data nhưng hit nhiều
- Phù hợp: data chấp nhận stale vài giây/phút (product listings, user profiles)

**2. Event-based (Active Invalidation):**

- Khi data thay đổi → gửi event invalidate cache ngay
- Qua message queue (Kafka, RabbitMQ) hoặc pub/sub (Redis Pub/Sub)
- Fresher data nhưng phức tạp hơn, có thể miss events

**3. Versioned Keys:**

- Key chứa version: `user:123:v5` → khi update, tăng version → `user:123:v6`
- Data cũ (`v5`) tự expire theo TTL, không cần xóa explicitly
- Tránh race conditions nhưng tốn memory (nhiều versions cùng tồn tại)

**4. Hybrid (TTL + Event):**

- Event-based invalidation cho real-time + TTL làm safety net
- Best practice cho production: event miss → TTL vẫn đảm bảo data không stale mãi

---

## 4. Cache Stampede / Thundering Herd

### 🔴 Q: Cache stampede là gì? Hậu quả và giải pháp?

**Hiện tượng:** Một hot key hết hạn → **hàng nghìn requests đồng thời** miss cache → tất cả đều query DB → DB quá tải.

```
  Trước expire:        Sau expire (stampede):

  Req1 ─► Cache ✓      Req1 ─► Cache ✗ ─► DB ─┐
  Req2 ─► Cache ✓      Req2 ─► Cache ✗ ─► DB ─┤
  Req3 ─► Cache ✓      Req3 ─► Cache ✗ ─► DB ─┼─► DB OVERWHELMED
  Req4 ─► Cache ✓      Req4 ─► Cache ✗ ─► DB ─┤
  Req5 ─► Cache ✓      Req5 ─► Cache ✗ ─► DB ─┘
```

**Giải pháp:**

**1. Locking (Mutex):**

- Chỉ **1 request** được phép rebuild cache, các request khác chờ hoặc nhận stale data
- Đơn giản, hiệu quả, nhưng cần distributed lock nếu multi-instance

**2. Probabilistic Early Expiration (PER):**

- Mỗi request tính xác suất refresh **trước khi** key thực sự hết hạn
- `should_refresh = (now + TTL × β × log(rand())) >= expiry`
- Spread load tự nhiên, không cần lock

**3. Go singleflight Pattern:**

- `golang.org/x/sync/singleflight` — deduplicate concurrent calls cho cùng key
- Chỉ **1 goroutine** thực sự gọi DB, tất cả goroutine khác chờ kết quả

```go
// Ví dụ minh họa singleflight
var group singleflight.Group

func GetUser(id string) (*User, error) {
    val, err, shared := group.Do("user:"+id, func() (interface{}, error) {
        // Chỉ 1 goroutine chạy đoạn này dù 1000 goroutine gọi đồng thời
        return db.QueryUser(id)
    })
    // shared=true nếu result được chia sẻ từ goroutine khác
    return val.(*User), err
}
```

**So sánh giải pháp:**

| Approach     | Complexity | Distributed?         | Latency Impact      |
| ------------ | ---------- | -------------------- | ------------------- |
| Mutex lock   | Thấp       | Cần distributed lock | Requests chờ lock   |
| PER          | Trung bình | Tự nhiên distributed | Gần zero            |
| singleflight | Thấp       | Chỉ per-process      | Requests chờ leader |

---

## 5. Cache Eviction Policies

### 🟡 Q: Các chính sách eviction phổ biến? So sánh?

Khi cache đầy, cần loại bỏ entry nào đó để nhường chỗ. Eviction policy quyết định entry nào bị loại.

**LRU (Least Recently Used):**

- Loại bỏ entry **không được truy cập lâu nhất**
- Giả định: data dùng gần đây sẽ được dùng lại → temporal locality
- Implementation: doubly linked list + hash map → O(1) get/put

**LFU (Least Frequently Used):**

- Loại bỏ entry **được truy cập ít nhất**
- Giả định: data dùng nhiều lần = quan trọng → frequency matters
- Vấn đề: data từng hot nhưng không còn hot nữa vẫn ở lại lâu

**FIFO (First In First Out):**

- Loại bỏ entry **cũ nhất** (vào trước ra trước)
- Đơn giản nhất nhưng không tính đến access pattern

**Random:**

- Loại bỏ entry **ngẫu nhiên**
- Surprisingly decent performance, O(1), không overhead tracking

**TTL-based:**

- Entry tự hết hạn sau thời gian cố định
- Thường kết hợp với policy khác (LRU + TTL)

**Bảng so sánh:**

| Policy | Hit Ratio  | Overhead                      | Best For                     |
| ------ | ---------- | ----------------------------- | ---------------------------- |
| LRU    | Cao        | Trung bình (recency tracking) | General purpose, web apps    |
| LFU    | Cao nhất\* | Cao (frequency counters)      | Stable access patterns       |
| FIFO   | Trung bình | Thấp nhất                     | Simple, predictable data     |
| Random | Trung bình | Không có                      | Large caches, uniform access |
| TTL    | Tùy TTL    | Thấp                          | Time-sensitive data          |

\*LFU tốt nhất khi access pattern ổn định, nhưng tệ khi pattern thay đổi.

**Biến thể nâng cao:**

- **W-TinyLFU** (dùng trong Caffeine/Ristretto): kết hợp LRU cho new entries + LFU cho frequent entries → best of both worlds
- **ARC (Adaptive Replacement Cache):** tự điều chỉnh giữa LRU và LFU dựa trên workload

---

## 6. Multi-Level Caching

### 🔴 Q: Multi-level caching architecture hoạt động như thế nào?

Giống CPU cache hierarchy (L1/L2/L3), application caching cũng có nhiều tầng:

```
  Request Flow:

  ┌─────────┐   miss   ┌──────────────┐   miss   ┌─────────────┐   miss   ┌──────┐
  │ Client  │ ────────►│ L1: In-Process│ ────────►│ L2: Redis   │ ────────►│  DB  │
  │         │◄─────────│ (µs latency)  │◄─────────│ (sub-ms)    │◄─────────│      │
  └─────────┘  return  └──────────────┘  return  └─────────────┘  return  └──────┘
                        │                         │
                        │ sync.Map / bigcache     │ Redis / Memcached
                        │ ristretto               │ (shared across instances)
                        │ (per-instance, private)  │

  L1 Hit: ~100ns-1µs    L2 Hit: ~0.5-2ms          DB: ~5-50ms
```

**L1 — In-Process Cache (Go options):**

- `sync.Map`: built-in, tốt cho read-heavy với stable keys, không có eviction
- `bigcache`: zero-GC, pre-allocated memory, chỉ hỗ trợ `[]byte` values
- `ristretto`: W-TinyLFU eviction, metrics built-in, best hit ratio

**L2 — Distributed Cache:**

- Redis: feature-rich, data structures, persistence optional
- Memcached: simpler, multi-threaded, thuần cache

**Khi nào dùng multi-level:**

- Traffic rất cao → L1 giảm load cho Redis
- Hot keys cần latency cực thấp → L1 tránh network hop
- Tổng data lớn nhưng hot set nhỏ → L1 cho hot set, L2 cho warm set

**Consistency challenges:**

- L1 private per-instance → mỗi instance có thể cache data khác nhau
- Invalidation: xóa L2 dễ (centralized) nhưng xóa L1 trên tất cả instances khó
- Solutions: short L1 TTL (1-5s), Redis Pub/Sub broadcast invalidation, accept eventual consistency

---

## 7. Redis as Cache

### 🟡 Q: Cấu hình Redis cho caching workload cần chú ý gì?

**Memory Management:**

- `maxmemory`: giới hạn RAM tối đa Redis sử dụng. **Bắt buộc set** cho cache use case.
- Không set → Redis dùng hết RAM → OS OOM killer → crash

**Eviction Policies (`maxmemory-policy`):**

| Policy           | Mô tả                     | Khi nào dùng                |
| ---------------- | ------------------------- | --------------------------- |
| `noeviction`     | Trả lỗi khi đầy           | Không phải cache (default)  |
| `allkeys-lru`    | LRU trên tất cả keys      | **Recommended cho cache**   |
| `allkeys-lfu`    | LFU trên tất cả keys      | Stable access patterns      |
| `volatile-lru`   | LRU chỉ trên keys có TTL  | Mix cache + persistent data |
| `allkeys-random` | Random eviction           | Uniform access patterns     |
| `volatile-ttl`   | Evict key sắp expire nhất | TTL-based workloads         |

**Best practices cho Redis cache:**

- Set `maxmemory-policy allkeys-lru` (hoặc `allkeys-lfu`)
- Luôn set TTL trên mọi cache key — safety net chống memory leak
- Dùng `SCAN` thay `KEYS *` trong production (non-blocking)
- Monitor `evicted_keys`, `keyspace_hits/misses` qua `INFO stats`

**Cluster Mode cho caching:**

- Hash slot sharding: 16384 slots phân bố trên N nodes
- Horizontal scaling: thêm node = thêm memory + throughput
- Trade-off: multi-key operations (MGET) chỉ hiệu quả khi keys cùng slot
- Dùng hash tags `{user}:123:profile`, `{user}:123:settings` để group related keys vào cùng slot

---

## 8. CDN Caching

### 🟡 Q: Browser cache, CDN edge, và origin cache khác nhau thế nào?

```
  ┌──────────┐     ┌───────────┐     ┌────────────┐     ┌──────────┐
  │ Browser  │────►│ CDN Edge  │────►│  Origin    │────►│    DB    │
  │  Cache   │     │  (PoP)    │     │  Server    │     │          │
  └──────────┘     └───────────┘     └────────────┘     └──────────┘
   L1: local        L2: edge          L3: server         L4: storage
   ~0ms             ~10-50ms          ~50-200ms          ~5-50ms
   per-user         per-region        per-origin
```

**Cache-Control Headers:**

| Directive                   | Ý nghĩa                                               |
| --------------------------- | ----------------------------------------------------- |
| `max-age=3600`              | Cache 1 giờ                                           |
| `s-maxage=600`              | CDN cache 10 phút (override max-age cho shared cache) |
| `no-cache`                  | Phải revalidate mỗi lần (KHÔNG phải no-store)         |
| `no-store`                  | Không cache gì cả                                     |
| `private`                   | Chỉ browser cache, CDN không cache                    |
| `public`                    | CDN được phép cache                                   |
| `stale-while-revalidate=60` | Serve stale data trong khi background refresh         |

**Conditional Requests (Revalidation):**

```
  Lần đầu:
  Client ──GET──► Server
  Client ◄──200── Server  (ETag: "abc123", Last-Modified: Wed, 01 Jan)

  Lần sau (revalidate):
  Client ──GET──► Server  (If-None-Match: "abc123")
  Client ◄──304── Server  (Not Modified — không gửi body, tiết kiệm bandwidth)
```

- **ETag:** Hash/fingerprint của content → chính xác nhất
- **If-Modified-Since / Last-Modified:** Dựa trên thời gian → đơn giản hơn, kém chính xác hơn

---

## 9. Application-Level Caching in Go

### 🟡 Q: Các loại application-level caching phổ biến trong Go?

**1. HTTP Response Caching:**

- Cache toàn bộ HTTP response cho idempotent endpoints (GET)
- Middleware level: kiểm tra cache trước khi handler xử lý
- Key = HTTP method + URL + query params (+ vary headers nếu cần)

**2. Database Query Caching:**

- Cache kết quả query thay vì gọi DB mỗi lần
- Key = query hash + parameters
- Invalidation khó: phải biết query nào bị ảnh hưởng khi data thay đổi

**3. Computation Caching (Memoization):**

- Cache kết quả tính toán tốn kém (aggregation, report generation)
- Key = function name + input parameters hash
- Phù hợp cho pure functions (cùng input → cùng output)

```go
// Ví dụ minh họa: Cache decorator pattern trong Go
type CacheLayer struct {
    l1    *ristretto.Cache   // in-process
    l2    *redis.Client      // distributed
    db    *sql.DB
}

func (c *CacheLayer) GetProduct(ctx context.Context, id string) (*Product, error) {
    key := "product:" + id

    // L1 check (in-process, ~100ns)
    if val, ok := c.l1.Get(key); ok {
        return val.(*Product), nil
    }

    // L2 check (Redis, ~1ms)
    data, err := c.l2.Get(ctx, key).Bytes()
    if err == nil {
        var p Product
        json.Unmarshal(data, &p)
        c.l1.Set(key, &p, 1)  // backfill L1
        return &p, nil
    }

    // DB query + populate both levels
    p, err := c.queryDB(ctx, id)
    if err != nil {
        return nil, err
    }
    encoded, _ := json.Marshal(p)
    c.l2.Set(ctx, key, encoded, 10*time.Minute)
    c.l1.Set(key, p, 1)
    return p, nil
}
```

---

## 10. Cache Consistency Patterns

### 🔴 Q: Làm sao đảm bảo consistency giữa Cache và DB?

Đây là vấn đề **fundamental** — cache và DB là hai hệ thống riêng, không có atomic operation trên cả hai.

**Vấn đề race condition với Cache-Aside:**

```
  Thread A (write):               Thread B (read):
  1. UPDATE DB (price=100→200)
                                  2. GET cache → MISS
                                  3. SELECT DB → price=200
  4. DELETE cache
                                  5. SET cache (price=200) ← OK case

  Race condition (worst case):
  1. Cache MISS → Thread B reads DB (price=100)
  2. Thread A updates DB (price=200)
  3. Thread A deletes cache
  4. Thread B sets cache (price=100) ← STALE!

  Kết quả: Cache giữ price=100, DB có price=200 → INCONSISTENT
```

**Các solution patterns:**

**Pattern 1: Delete cache (not update) + TTL safety net:**

- Write: Update DB → Delete cache (không set cache mới)
- Read miss sẽ load fresh data từ DB
- TTL đảm bảo stale data tồn tại tối đa N giây
- Đơn giản, chấp nhận inconsistency ngắn

**Pattern 2: Double-delete:**

- Update DB → Delete cache → sleep(500ms) → Delete cache lần nữa
- Lần delete thứ 2 xóa stale data từ race condition
- Hacky nhưng hiệu quả trong thực tế

**Pattern 3: Write-Through:**

- Ghi cache + DB trong cùng operation → luôn consistent
- Trade-off: write latency cao, tight coupling

**Pattern 4: CDC-based Invalidation (Change Data Capture):**

```
  ┌───────┐  write  ┌──────┐  binlog/WAL  ┌──────────┐  invalidate  ┌───────┐
  │  App  │ ──────► │  DB  │ ────────────► │ CDC Tool │ ───────────► │ Cache │
  └───────┘         └──────┘               │(Debezium)│              └───────┘
                                           └──────────┘

  App CHỈ ghi DB. Cache invalidation hoàn toàn từ DB change stream.
```

- **DB là single source of truth**, cache invalidation derived từ DB changes
- Đảm bảo mọi DB change đều invalidate cache (không miss)
- Tools: Debezium (MySQL binlog, PostgreSQL WAL), Maxwell, Canal
- Trade-off: infrastructure phức tạp, eventual consistency (có delay)

**Comparison:**

| Pattern       | Consistency           | Complexity | Latency |
| ------------- | --------------------- | ---------- | ------- |
| Delete + TTL  | Eventual (seconds)    | Thấp       | Thấp    |
| Double-delete | Eventual (shorter)    | Thấp       | Thấp    |
| Write-through | Strong                | Trung bình | Cao     |
| CDC-based     | Eventual (sub-second) | Cao        | Thấp    |

---

## 11. Common Caching Pitfalls

### 🔴 Q: Cache Penetration, Cache Breakdown, và Cache Avalanche khác nhau thế nào?

Ba vấn đề này nghe giống nhau nhưng **nguyên nhân và giải pháp hoàn toàn khác:**

**1. Cache Penetration (xuyên thủng cache):**

```
  Attacker/Bug: query key KHÔNG TỒN TẠI trong cả cache VÀ DB

  Request("user:999999") → Cache MISS → DB: NOT FOUND → Không cache gì
  Request("user:999999") → Cache MISS → DB: NOT FOUND → Không cache gì
  ... lặp lại vô hạn → DB bị query liên tục cho data không tồn tại
```

**Giải pháp:**

- **Cache null/empty result:** Lưu `user:999999 → NULL` với TTL ngắn (1-5 phút)
- **Bloom filter:** Kiểm tra trước key có **khả năng** tồn tại không. False positive OK, false negative = chắc chắn không tồn tại → skip DB
- **Input validation:** Reject invalid IDs trước khi query

**2. Cache Breakdown (hot key hết hạn):**

```
  Hot key phục vụ 10K req/s → key expires → 10K requests đồng thời hit DB

  Khác stampede? Thực ra là CÙNG hiện tượng, breakdown tập trung vào 1 hot key.
```

**Giải pháp:**

- **singleflight / mutex lock** (như Section 4)
- **Never expire hot keys:** Dùng background refresh thay vì TTL
- **Stale-while-revalidate:** Serve stale data trong khi refresh

**3. Cache Avalanche (tuyết lở cache):**

```
  Nhiều keys cùng expire đồng thời → MASS cache miss → DB overload

  Nguyên nhân:
  - Tất cả keys có cùng TTL (ví dụ: warm-up lúc deploy, cùng set TTL=1h)
  - Cache server crash/restart → toàn bộ cache mất
```

**Giải pháp:**

- **Jitter TTL:** `TTL = baseTTL + random(0, jitterRange)` → spread expiry time
- **Circuit breaker:** Khi DB quá tải, trả fallback/error thay vì tiếp tục query
- **Redundant cache:** Redis Sentinel/Cluster → cache server crash không mất hết data
- **Warm-up strategy:** Pre-load cache sau deploy thay vì để cold start

**Bảng tổng hợp:**

| Problem     | Root Cause               | Key Solution                 |
| ----------- | ------------------------ | ---------------------------- |
| Penetration | Query non-existent data  | Cache NULL + Bloom filter    |
| Breakdown   | Single hot key expires   | singleflight / no-expire     |
| Avalanche   | Mass keys expire at once | Jitter TTL + circuit breaker |

---

## Caching Decision Flowchart

```
  Start: Cần cải thiện read performance?
  │
  ├── Data thay đổi thường xuyên? (< vài giây)
  │   ├── YES → Cân nhắc: có thực sự cần cache?
  │   │         Nếu cần → Short TTL + Event-based invalidation
  │   └── NO  → Cache phù hợp. Tiếp:
  │
  ├── Có bao nhiêu instances?
  │   ├── 1 instance → L1 in-process cache là đủ (ristretto/bigcache)
  │   └── N instances → L2 distributed cache (Redis)
  │                     Hot keys? → Thêm L1 phía trước
  │
  ├── Consistency requirement?
  │   ├── Strong → Write-through hoặc Read-through
  │   ├── Eventual (seconds OK) → Cache-aside + TTL
  │   └── Eventual (sub-second) → Cache-aside + CDC invalidation
  │
  ├── Write pattern?
  │   ├── Read-heavy (>90% reads) → Cache-aside (đơn giản, hiệu quả)
  │   ├── Write-heavy → Write-behind (buffer writes)
  │   └── Mixed → Write-through + Read-through
  │
  └── Eviction policy?
      ├── General workload → LRU (safe default)
      ├── Frequency matters → LFU hoặc W-TinyLFU
      └── Simplicity first → FIFO hoặc TTL-only
```

---

## Interview Questions — Quick Reference

### 🟢 Junior Level

**Q: Cache-aside pattern hoạt động thế nào? Vẽ flow.**

> Trả lời: App check cache → miss → query DB → populate cache → return. App chịu trách nhiệm quản lý cache. (Xem Section 2)

**Q: LRU eviction hoạt động thế nào?**

> Trả lời: Loại bỏ entry không được access lâu nhất. Implement bằng doubly linked list + hash map. Mỗi access → move to head. Evict → remove tail. O(1) cho get và put.

**Q: Cache-Control header `no-cache` và `no-store` khác nhau thế nào?**

> `no-cache` = vẫn cache nhưng phải revalidate mỗi lần (hỏi server "data còn mới không?"). `no-store` = không lưu gì cả.

### 🟡 Middle Level

**Q: Giải thích sự khác biệt giữa cache penetration, breakdown, và avalanche.**

> Penetration = query data không tồn tại xuyên qua cache. Breakdown = 1 hot key expire gây spike. Avalanche = nhiều keys expire cùng lúc. Giải pháp khác nhau cho từng vấn đề. (Xem Section 11)

**Q: Tại sao nên delete cache thay vì update cache khi data thay đổi?**

> Update cache có race condition: Thread A update DB, Thread B read DB (giá cũ), Thread A update cache (giá mới), Thread B update cache (giá cũ) → stale. Delete an toàn hơn — next read miss sẽ load fresh data.

**Q: So sánh Write-Through và Write-Behind.**

> Write-Through: ghi đồng bộ cả cache + DB → consistent nhưng latency cao. Write-Behind: ghi cache, async flush DB → latency thấp nhưng risk mất data nếu cache crash. (Xem Section 2)

### 🔴 Senior Level

**Q: Thiết kế multi-level caching cho hệ thống 100K req/s. Giải quyết consistency giữa L1 (per-instance) và L2 (Redis).**

> L1 (ristretto, TTL 1-5s) + L2 (Redis, TTL 5-10min). L1 short TTL chấp nhận stale ngắn. Invalidation: write → delete L2 → publish Redis Pub/Sub → tất cả instances listen và delete L1. Fallback: L1 TTL tự expire nếu miss pub/sub message.

**Q: Hệ thống có hot key phục vụ 50K req/s. Key expire gây cache breakdown. Giải pháp production-ready?**

> Kết hợp: (1) singleflight per instance deduplicate DB calls, (2) stale-while-revalidate — serve stale data trong khi 1 goroutine refresh, (3) refresh-ahead — background refresh trước khi expire. Never let TTL actually expire for hot keys.

**Q: CDC-based cache invalidation có ưu nhược điểm gì so với application-level invalidation?**

> CDC: DB là single source of truth, không miss changes, works across services. Nhưng: thêm infrastructure (Debezium/Kafka), eventual consistency (delay vài trăm ms), schema changes phức tạp. Application-level: đơn giản hơn nhưng dễ quên invalidate, tight coupling giữa write path và cache logic. (Xem Section 10)

---

_Caching không chỉ là "thêm Redis" — nó đòi hỏi hiểu rõ access patterns, consistency requirements, và failure modes. Một cache strategy tốt bắt đầu từ việc đo lường (latency, hit ratio) chứ không phải giả định._

---

## Interview Q&A Summary / Tổng hợp câu hỏi phỏng vấn

### Q: What are the main cache invalidation strategies? / Các chiến lược cache invalidation? 🟡 Mid

**A:**

```
Cache invalidation is one of the 2 hard problems in CS:
"There are only two hard things in CS: cache invalidation and naming things." — Phil Karlton

Strategies:

1. TTL (Time To Live) — simplest
   ├── Cache entry expires after fixed time
   ├── Pro: simple, no invalidation logic needed
   ├── Con: stale data until TTL expires
   └── Use for: semi-static data (product prices, user profiles)

2. Write-through
   ├── Write to cache AND database simultaneously
   ├── Pro: cache always consistent with DB
   ├── Con: write latency = DB write latency (no benefit for write speed)
   └── Use for: read-heavy with rare writes, consistency critical

3. Write-around
   ├── Write to DB only, cache not updated on write
   ├── Cache populated on next read (miss → fill)
   ├── Pro: avoids polluting cache with write-once data
   └── Use for: bulk loads, data rarely re-read

4. Write-behind (write-back)
   ├── Write to cache immediately, async flush to DB later
   ├── Pro: write very fast (just cache write)
   ├── Con: data loss if cache dies before flush
   └── Use for: high-write scenarios, eventual consistency OK

5. Event-driven invalidation
   ├── Database change → event → invalidate cache entries
   ├── Example: order updated → clear order cache key
   ├── Pro: cache always fresh
   ├── Con: complex (need event pipeline), race conditions
   └── Use for: microservices (CDC → Kafka → cache clear)

6. Cache-aside (Lazy loading) — most common pattern
   Read: cache miss → load from DB → store in cache → return
   Write: write to DB → invalidate cache key (NOT update)
   └── Simple, reliable, but first-request always slow (cold start)
```

**Điểm then chốt:** Không có một strategy phù hợp với tất cả. Cache-aside + TTL là default safe choice. Write-through cho consistency. Write-behind cho throughput. Event-driven cho microservices with CDC.

### Q: How do you prevent cache stampede? / Ngăn chặn cache stampede như thế nào? 🔴 Senior

**A:**

```
Cache Stampede = Thundering Herd
When cache key expires, many concurrent requests all miss cache
simultaneously → all hit DB at once → DB overloaded

Scenario:
  t=0: 1000 req/s → cache hit (key expires at t=60)
  t=60: key expires
  t=60-60.1: 100 requests all miss cache, all query DB simultaneously
  → DB gets 100× normal load → timeout → more requests queue up → cascade failure

Prevention strategies:

1. Mutex / Singleflight
   ├── First request: gets lock, queries DB, populates cache
   ├── Other requests: wait for lock, then read from cache
   └── Go implementation:
```

```go
var group singleflight.Group

func GetUser(id string) (*User, error) {
    result, err, _ := group.Do("user:"+id, func() (interface{}, error) {
        // Only 1 goroutine runs this per key
        user, err := db.GetUser(id)
        if err != nil { return nil, err }
        cache.Set("user:"+id, user, 5*time.Minute)
        return user, nil
    })
    return result.(*User), err
}
```

```
2. Probabilistic Early Expiration (PER)
   ├── Before TTL expires, some requests probabilistically refresh
   └── Formula: if random() < β × log(ttl) × (now - created) / ttl → refresh

3. TTL Jitter
   ├── Add random spread to TTLs to prevent synchronized expiry
   └── TTL = base_ttl + random(0, base_ttl * 0.1)

4. Background refresh
   ├── Async refresh when TTL is about to expire (< 20% remaining)
   ├── Return slightly stale data while refreshing
   └── "Stale-while-revalidate" pattern (HTTP Cache-Control too)

5. Two-tier TTL (soft + hard)
   ├── Soft TTL: treat as stale, try to refresh async
   ├── Hard TTL: definitely invalid, block until refreshed
   └── data.setExpiry(soft=4min, hard=5min)
```

**Điểm senior:** Singleflight là Go-native solution đơn giản nhất. TTL jitter là best practice phải áp dụng mặc định. Background refresh với stale-while-revalidate tốt cho UX (không block user). Biết tên "thundering herd" / "cache stampede" quan trọng trong phỏng vấn system design.

### Q: When should you use Redis vs Memcached? / Khi nào dùng Redis vs Memcached? 🟡 Mid

**A:**

```
Feature Comparison:
                Redis              Memcached
Data types:     Rich (string,      String only (key-value)
                list, set, hash,
                sorted set, stream)
Persistence:    Yes (RDB + AOF)    No (memory only)
Replication:    Yes (primary/replica) No (each node independent)
Clustering:     Redis Cluster       Client-side sharding
Pub/Sub:        Yes                 No
Transactions:   Yes (MULTI/EXEC)    No
Lua scripting:  Yes                 No
Memory:         More overhead       More cache-efficient
Threading:      Single-threaded*    Multi-threaded
                (*v6+ I/O threads)

Performance:
├── Both: ~1M ops/sec single node
├── Memcached: slightly faster for simple get/set (less overhead)
└── Redis: faster for complex data structure operations

Choose Redis when:
├── Need data persistence (cache survives restart)
├── Need pub/sub (real-time features)
├── Need sorted sets (leaderboards, priority queues)
├── Need streams (message queuing)
├── Need atomic operations (rate limiting, distributed locks)
└── Most new projects (unless you NEED Memcached's speed)

Choose Memcached when:
├── Pure caching, no persistence needed
├── Multi-threaded is important (large servers, many CPU cores)
└── Existing infrastructure already uses it
```

**Redis data structures → use cases:**

```
String:       session tokens, API response cache, counters (INCR)
List:         recent activity feed, job queue (LPUSH/BRPOP)
Hash:         user profile fields (HGET/HSET individual fields)
Set:          unique visitors, tags, friend lists (SISMEMBER)
Sorted Set:   leaderboard (ZADD score member, ZRANGE by score)
Stream:       event log, message bus (XADD, XREAD)
HyperLogLog:  approximate unique count (PFADD, PFCOUNT) — O(1) space!
```

**Điểm phỏng vấn:** Trong 90% cases, chọn Redis vì feature-rich hơn và maintain dễ hơn. Memcached còn dùng khi cần simplicity và có large-scale existing infrastructure. Biết Redis data structures và use case của mỗi loại là điểm cộng lớn.

---

## Interview Q&A Summary Table / Bảng Tóm Tắt Q&A Phỏng Vấn

| #   | Question                                     | Difficulty | Core Concept | Key Signal                                                         |
| --- | -------------------------------------------- | ---------- | ------------ | ------------------------------------------------------------------ |
| 1   | Tại sao caching quan trọng? Latency numbers? | 🟢 Junior  | Why Caching  | Jeff Dean numbers + 100x gap + Pareto                              |
| 2   | Cache hit ratio + Pareto principle?          | 🟢 Junior  | Why Caching  | 20% data serves 80% requests, target >95%                          |
| 3   | Cache-Aside hoạt động?                       | 🟡 Mid     | Strategies   | App check→miss→DB→populate→return                                  |
| 4   | Read-Through khác Cache-Aside?               | 🟡 Mid     | Strategies   | Cache library handles DB call, not app                             |
| 5   | Write-Through hoạt động?                     | 🟡 Mid     | Strategies   | Sync write cache+DB, always fresh, high latency                    |
| 6   | Write-Behind vs Write-Through?               | 🔴 Senior  | Strategies   | Async flush DB, fast writes, data loss risk                        |
| 7   | Refresh-Ahead pattern?                       | 🔴 Senior  | Strategies   | Proactive refresh before TTL, zero latency for hot keys            |
| 8   | Cache invalidation strategies?               | 🟡 Mid     | Invalidation | TTL+event-driven+versioning, delete not update                     |
| 9   | Cache stampede + solutions?                  | 🔴 Senior  | Stampede     | Singleflight+PER+TTL jitter+stale-while-revalidate                 |
| 10  | Eviction policies comparison?                | 🟡 Mid     | Eviction     | LRU vs LFU vs TTL + Redis allkeys-lfu                              |
| 11  | Multi-level caching architecture?            | 🔴 Senior  | Multi-Level  | L1 local→L2 Redis→L3 CDN + pub/sub invalidation                    |
| 12  | Redis caching config?                        | 🟡 Mid     | Redis Cache  | maxmemory + allkeys-lfu + pipeline + pool sizing                   |
| 13  | Browser/CDN/origin cache?                    | 🟡 Mid     | CDN          | Cache-Control headers + edge vs origin + stale-while-revalidate    |
| 14  | Go application caching?                      | 🟡 Mid     | Go Patterns  | ristretto, sync.Map, singleflight, bigcache                        |
| 15  | Cache-DB consistency?                        | 🔴 Senior  | Consistency  | Delete-then-write + CDC + delayed double-delete                    |
| 16  | Penetration vs Breakdown vs Avalanche?       | 🔴 Senior  | Pitfalls     | Bloom filter + singleflight + TTL jitter                           |
| R1  | Cache-aside flow (Junior)?                   | 🟢 Junior  | Strategies   | Check→miss→DB→populate→return flow                                 |
| R2  | LRU eviction (Junior)?                       | 🟢 Junior  | Eviction     | Doubly linked list + hashmap, O(1) get/put                         |
| R3  | no-cache vs no-store (Junior)?               | 🟢 Junior  | CDN          | no-cache=revalidate, no-store=don't store                          |
| R4  | Penetration/breakdown/avalanche (Mid)?       | 🟡 Mid     | Pitfalls     | Ghost key, hot key death, mass expiry                              |
| R5  | Delete cache vs update cache (Mid)?          | 🟡 Mid     | Invalidation | Update has race condition; delete is safe                          |
| R6  | Write-Through vs Write-Behind (Mid)?         | 🟡 Mid     | Strategies   | Sync vs async, consistency vs speed                                |
| R7  | Multi-level 100K req/s (Senior)?             | 🔴 Senior  | Multi-Level  | L1 ristretto + L2 Redis + pub/sub invalidation                     |
| R8  | Hot key breakdown (Senior)?                  | 🔴 Senior  | Stampede     | Singleflight + stale-while-revalidate + refresh-ahead              |
| R9  | CDC vs app-level invalidation (Senior)?      | 🔴 Senior  | Consistency  | CDC = no miss changes; app-level = simpler but error-prone         |
| B1  | Cache invalidation strategies bilingual?     | 🟡 Mid     | Invalidation | 6 strategies: TTL, write-through/around/behind, event, cache-aside |
| B2  | Cache stampede prevention bilingual?         | 🔴 Senior  | Stampede     | Mutex, PER, TTL jitter, background refresh, two-tier TTL           |
| B3  | Redis vs Memcached bilingual?                | 🟡 Mid     | Redis Cache  | Rich types+persistence vs simple+multi-threaded                    |

**Distribution:** 🟢 5 Junior | 🟡 12 Mid | 🔴 11 Senior — Total: 28 Q&As

---

## Cold Call Simulation / Mô Phỏng Hỏi Bất Chợt

> **Interviewer:** "Your product page cache has 99% hit ratio, but during flash sale, latency spikes to 5 seconds. What happened?"

**⚡ 30-second answer:**
"Classic cache stampede. Flash sale drives 100x traffic spike. When the product cache key expires, thousands of concurrent requests all miss cache simultaneously and hit the database. The DB can't handle the burst, queries queue up, and latency spikes. Solution: implement singleflight so only one goroutine rebuilds the cache while others wait; add TTL jitter to prevent synchronized expiry; and use stale-while-revalidate to serve slightly stale data while background refresh happens."

**Follow-up:** "What if it's not stampede but a genuinely new product with no cache?"
→ "That's cache warming, not stampede. For predictable events like flash sale, pre-warm the cache before the event starts — a cron job loads all flash sale product data into Redis 5 minutes before start time. For unpredictable traffic, use a bloom filter to distinguish 'never cached' from 'cache expired' and apply different strategies."

---

## Self-Check / Tự Kiểm Tra

> **Instructions:** Cover the right column. Try to recall from memory, then verify.

| #   | Question                                           | Key Points                                                                                                                                                   |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Name 5 caching strategies and when to use each     | Cache-Aside (read-heavy), Read-Through (library-managed), Write-Through (consistency), Write-Behind (high writes), Refresh-Ahead (hot keys)                  |
| 2   | Explain cache stampede and 3 prevention methods    | Key expires→many miss→DB spike. Prevent: singleflight (deduplicate), TTL jitter (desynchronize), stale-while-revalidate (serve stale)                        |
| 3   | What are penetration, breakdown, avalanche?        | Penetration: non-existent key→bloom filter. Breakdown: hot key expires→singleflight. Avalanche: mass expiry→TTL jitter                                       |
| 4   | Design 3-tier caching for 100K req/s               | L1: ristretto 1-5s TTL (per-instance), L2: Redis cluster 5-10min TTL (shared), L3: CDN for static. Invalidation: write→delete L2→pub/sub→instances delete L1 |
| 5   | Why delete cache instead of update on write?       | Update has race condition: A writes DB, B reads stale DB, B updates cache with stale. Delete is safe—next read fills fresh data                              |
| 6   | LRU implementation? Redis eviction recommendation? | Doubly-linked list + hashmap, O(1). Redis: allkeys-lfu for cache workloads, always set maxmemory                                                             |
| 7   | CDC vs application-level invalidation?             | CDC: DB is source of truth, no missed changes, needs Debezium/Kafka infrastructure. App-level: simpler but easy to forget invalidation, tight coupling       |

### Spaced Repetition Schedule / Lịch Ôn Tập

| Round | When          | Focus                                                            |
| ----- | ------------- | ---------------------------------------------------------------- |
| 1     | Day 1 (today) | Read all Core Concepts + answer Self-Check from memory           |
| 2     | Day 3         | Caching Strategies + Stampede — practice Cold Call aloud         |
| 3     | Day 7         | Invalidation + Consistency + Pitfalls — do Interview Q&A Summary |
| 4     | Day 14        | Full Self-Check without notes + explain to someone               |
| 5     | Day 30        | Mock interview: pick 5 random questions from Summary table       |

---

## Connections / Liên Kết

**Same Track (Database Advanced):**

- ⬅️ [SQL Fundamentals](./01-sql-fundamentals.md) — understand query performance to know what to cache
- ⬅️ [Indexing Optimization](./02-indexing-optimization.md) — well-indexed queries reduce cache dependency
- ⬅️ [NoSQL & Redis](./03-nosql-redis-mongo.md) — Redis is the primary cache store; data types and cluster topology

**Cross-Track:**

- 🔗 [Resilience Patterns](../02-backend-knowledge/07-resilience-patterns.md) — cache stampede is a resilience problem; circuit breaker protects DB during cache miss storms
- 🔗 [System Design Framework](../04-be-system-design/01-design-framework.md) — caching is always discussed in Deep Dive phase
- 🔗 [Distributed Systems](../02-backend-knowledge/03-distributed-systems.md) — cache consistency relates to distributed consistency models
- 🔗 [Microservices](../02-backend-knowledge/02-microservices.md) — CDC-based invalidation in microservice architectures
