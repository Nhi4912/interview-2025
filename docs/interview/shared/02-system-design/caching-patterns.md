# Caching Patterns — Mẫu thiết kế cache

> Shared theory for both Frontend and Backend tracks.
> Cross-referenced by: `be-track/03-database-advanced/04-caching-patterns.md`, `be-track/04-be-system-design/01-design-framework.md`, `shared/02-system-design/system-design-theory.md`, `fe-track/modules/07-performance.md`

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

- `docs/interview/shared/02-system-design/system-design-theory.md`
- `docs/interview/shared/03-database/database-theory.md`
- `docs/interview/shared/01-cs-fundamentals/networking-theory.md`
- `docs/interview/be-track/03-database-advanced/04-caching-patterns.md`
- `docs/interview/be-track/04-be-system-design/01-design-framework.md`
- `docs/interview/fe-track/modules/07-performance.md`

### 🟡 Q: Quick check #208: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #212: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #216: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #220: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #224: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #228: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #232: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #236: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #240: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #244: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #248: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #252: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #256: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #260: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #264: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #268: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #272: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #276: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #280: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #284: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #288: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #292: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #296: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #300: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #304: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #308: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #312: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #316: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #320: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #324: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #328: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #332: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #336: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #340: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #344: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #348: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #352: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #356: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #360: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #364: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #368: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #372: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #376: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #380: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #384: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #388: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #392: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #396: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #400: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #404: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #408: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #412: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #416: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #420: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #424: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #428: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #432: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #436: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #440: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #444: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #448: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #452: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #456: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #460: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #464: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #468: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #472: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #476: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #480: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #484: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #488: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #492: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #496: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #500: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #504: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #508: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #512: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #516: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #520: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #524: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #528: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #532: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #536: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #540: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #544: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #548: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #552: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #556: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #560: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #564: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #568: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #572: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #576: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #580: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #584: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #588: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #592: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #596: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #600: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #604: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #608: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #612: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #616: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #620: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #624: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #628: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #632: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.

### 🟡 Q: Quick check #636: Why add TTL jitter for many keys? `[Mid]`
**A:** TTL jitter giúp phân tán thời điểm hết hạn, tránh hiện tượng nhiều key expire cùng lúc gây spike vào backend.
Nếu không jitter, hệ thống dễ gặp mini-stampede theo chu kỳ.
### 🟡 Q: Extra drill on caching trade-offs #1? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #2? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #3? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #4? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #5? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #6? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #7? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #8? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #9? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #10? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #11? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #12? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #13? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #14? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #15? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #16? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #17? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #18? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #19? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #20? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #21? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #22? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #23? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #24? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #25? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #26? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #27? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #28? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #29? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #30? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #31? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #32? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #33? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #34? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #35? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #36? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #37? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #38? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #39? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #40? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #41? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #42? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #43? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #44? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #45? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.

### 🟡 Q: Extra drill on caching trade-offs #46? `[Mid]`
**A:** Trong phỏng vấn, hãy nêu rõ hit ratio, miss penalty, và chiến lược invalidation trước khi kết luận pattern tối ưu.
Không có cache strategy nào đúng cho mọi bài toán; phải gắn với SLA và consistency requirement.
