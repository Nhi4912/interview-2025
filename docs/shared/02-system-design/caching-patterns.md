# Caching Patterns / Mẫu Thiết Kế Cache

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [System Design Theory](./system-design-theory.md) | [BE Caching](../../be-track/03-database-advanced/04-caching-patterns.md) | [Replication & Partitioning](./replication-partitioning.md)

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

## 1. Caching Fundamentals / Nền tảng về cache

### 🟢 Q: What is caching, and why does it matter in system design? `[Junior]`
**A:** Caching là kỹ thuật lưu tạm dữ liệu đã truy cập để lần sau đọc nhanh hơn, giảm truy vấn xuống tầng chậm như database hoặc service ngoài.
Trong phỏng vấn, bạn cần nhấn mạnh 4 lợi ích: giảm latency, giảm tải backend, tăng throughput, và cải thiện trải nghiệm người dùng.
Ví dụ: query DB mất 30ms, đọc Redis mất 1ms. Nếu cache hit 90%, latency trung bình của luồng đọc giảm rất mạnh.
Công thức đơn giản: average_latency = hit_rate * cache_latency + miss_rate * backend_latency.
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

| Question | Level | Key Point |
|----------|-------|-----------|
| Cache-aside pattern | 🟢 | App manages; check→miss→DB→cache; DELETE on write (not update) |
| Cache stampede prevention | 🟡 | Singleflight + TTL jitter; stale-while-revalidate |
| Write-through vs write-behind | 🟡 | Through=consistent+slower; behind=fast+data loss risk |
