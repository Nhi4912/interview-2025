# Caching Patterns & Strategies

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Theory-focused guide (~85% theory, 15% examples). Bilingual: English headings + Vietnamese explanations.
> Difficulty: 🟢 Junior | 🟡 Middle | 🔴 Senior

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
|-----------|----------------------------------|---------|
| 0%        | 50ms                             | 1x      |
| 80%       | 0.8 + 10 = 10.8ms               | 4.6x    |
| 95%       | 0.95 + 2.5 = 3.45ms             | 14.5x   |
| 99%       | 0.99 + 0.5 = 1.49ms             | 33.6x   |

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

| Pros | Cons |
|------|------|
| Đơn giản, dễ implement | Cache miss penalty (trả thêm cost ghi cache) |
| Chỉ cache data thực sự cần | Data có thể stale (DB đã update nhưng cache chưa) |
| Cache down → app vẫn chạy (fallback DB) | Cold start — cache trống sau restart |

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

| Pros | Cons |
|------|------|
| App code sạch hơn (không biết cache logic) | Cache layer phức tạp hơn |
| Logic load data tập trung một chỗ | Ít linh hoạt khi cần custom logic |
| Tránh duplicate code | Phụ thuộc vào cache library support |

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

| Pros | Cons |
|------|------|
| Cache luôn consistent với DB | Write latency cao (ghi 2 nơi đồng bộ) |
| Không bao giờ cache miss sau write | Không phù hợp write-heavy workloads |
| Đơn giản về mặt consistency | Cache chứa data có thể không bao giờ được đọc |

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

| Pros | Cons |
|------|------|
| Write latency rất thấp (chỉ ghi cache) | **Mất data nếu cache crash** trước khi flush |
| Batch writes → giảm DB load đáng kể | Phức tạp, khó debug |
| Hấp thụ write spikes hiệu quả | Eventual consistency giữa cache và DB |

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

| Pros | Cons |
|------|------|
| Gần như zero cache miss cho hot keys | Phức tạp implementation |
| Latency ổn định (không có miss penalty) | Waste resources nếu dự đoán sai |
| Tốt cho frequently accessed data | Cần track access patterns |

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

| Approach | Complexity | Distributed? | Latency Impact |
|----------|-----------|-------------|----------------|
| Mutex lock | Thấp | Cần distributed lock | Requests chờ lock |
| PER | Trung bình | Tự nhiên distributed | Gần zero |
| singleflight | Thấp | Chỉ per-process | Requests chờ leader |

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

| Policy | Hit Ratio | Overhead | Best For |
|--------|----------|----------|----------|
| LRU | Cao | Trung bình (recency tracking) | General purpose, web apps |
| LFU | Cao nhất* | Cao (frequency counters) | Stable access patterns |
| FIFO | Trung bình | Thấp nhất | Simple, predictable data |
| Random | Trung bình | Không có | Large caches, uniform access |
| TTL | Tùy TTL | Thấp | Time-sensitive data |

*LFU tốt nhất khi access pattern ổn định, nhưng tệ khi pattern thay đổi.

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

| Policy | Mô tả | Khi nào dùng |
|--------|--------|-------------|
| `noeviction` | Trả lỗi khi đầy | Không phải cache (default) |
| `allkeys-lru` | LRU trên tất cả keys | **Recommended cho cache** |
| `allkeys-lfu` | LFU trên tất cả keys | Stable access patterns |
| `volatile-lru` | LRU chỉ trên keys có TTL | Mix cache + persistent data |
| `allkeys-random` | Random eviction | Uniform access patterns |
| `volatile-ttl` | Evict key sắp expire nhất | TTL-based workloads |

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

| Directive | Ý nghĩa |
|-----------|---------|
| `max-age=3600` | Cache 1 giờ |
| `s-maxage=600` | CDN cache 10 phút (override max-age cho shared cache) |
| `no-cache` | Phải revalidate mỗi lần (KHÔNG phải no-store) |
| `no-store` | Không cache gì cả |
| `private` | Chỉ browser cache, CDN không cache |
| `public` | CDN được phép cache |
| `stale-while-revalidate=60` | Serve stale data trong khi background refresh |

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

| Pattern | Consistency | Complexity | Latency |
|---------|------------|------------|---------|
| Delete + TTL | Eventual (seconds) | Thấp | Thấp |
| Double-delete | Eventual (shorter) | Thấp | Thấp |
| Write-through | Strong | Trung bình | Cao |
| CDC-based | Eventual (sub-second) | Cao | Thấp |

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

| Problem | Root Cause | Key Solution |
|---------|-----------|-------------|
| Penetration | Query non-existent data | Cache NULL + Bloom filter |
| Breakdown | Single hot key expires | singleflight / no-expire |
| Avalanche | Mass keys expire at once | Jitter TTL + circuit breaker |

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

*Caching không chỉ là "thêm Redis" — nó đòi hỏi hiểu rõ access patterns, consistency requirements, và failure modes. Một cache strategy tốt bắt đầu từ việc đo lường (latency, hit ratio) chứ không phải giả định.*
