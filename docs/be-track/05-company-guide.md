# Company-Specific Interview Guide

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../00-table-of-contents.md)

## Hướng dẫn phỏng vấn theo từng công ty cho Go Backend Developer

> Tài liệu này tập trung vào **thực chiến**: format phỏng vấn, câu hỏi thường gặp, và cách chuẩn bị cụ thể cho từng công ty.
> Mỗi công ty có culture và kỳ vọng khác nhau — chuẩn bị đúng hướng giúp tiết kiệm rất nhiều thời gian.

---

## 1. Zalo (VNG Corporation)

### Company Overview
- **Sản phẩm**: Ứng dụng nhắn tin lớn nhất Việt Nam, 70M+ người dùng hoạt động
- **Quy mô kỹ thuật**: Hàng triệu tin nhắn/giây, real-time voice/video call, Zalo Pay, Zalo Mini App
- **Tech stack chính**: Go, C++, Java, Kafka, Redis, MySQL, custom binary protocols
- **Đặc điểm**: Rất chú trọng performance và low-level optimization. Nhiều hệ thống tự build thay vì dùng off-the-shelf

### Interview Format
- **Vòng 1**: Phone screen / Online test (algorithms + Go basics) — 45-60 phút
- **Vòng 2**: Technical deep dive (Go concurrency, system design) — 60-90 phút
- **Vòng 3**: System design + Architecture discussion với senior engineer/manager — 60 phút
- Đôi khi có thêm vòng behavioral với HR

### What They Focus On

**Go Concurrency — Trọng tâm số 1**
- Zalo xử lý hàng triệu concurrent connections. Họ cần người hiểu sâu goroutine, channel, và sync primitives
- Câu hỏi thường xoay quanh: làm sao handle 1M+ WebSocket connections trên 1 server?
- Cần hiểu rõ `epoll` (Linux) và cách Go runtime map goroutines lên OS threads (GMP model)

**Real-time Messaging System Design**
- Thiết kế hệ thống chat: message ordering, delivery guarantee, read receipts
- Online/offline status tracking cho hàng chục triệu users
- Group chat fan-out: khi gửi tin vào group 500 người, làm sao đảm bảo delivery nhanh và đúng thứ tự?

**High-throughput Data Processing**
- Pipeline xử lý data: ingest → process → store, throughput hàng triệu events/sec
- Kafka consumer group design, partition strategy
- Backpressure handling khi downstream service chậm

**Database Optimization**
- MySQL: query optimization, index design cho bảng hàng tỷ rows
- Redis: caching strategy, data structure selection (sorted set cho leaderboard, HyperLogLog cho unique count)
- Sharding strategy cho message storage

**Networking**
- WebSocket vs long polling vs Server-Sent Events
- Custom binary protocol design (tại sao Zalo không dùng JSON cho messaging?)
- Protocol Buffers: schema design, backward compatibility

### Sample Questions with Answer Hints

**Q1: Thiết kế hệ thống delivery message cho chat app với 70M users**
- Hint: Dùng write-ahead log + persistent connection. Mỗi user có message queue riêng (có thể dùng Redis List hoặc Kafka topic-per-user). Khi user online → push qua WebSocket. Khi offline → store và push notification. Cần idempotent delivery (message ID dedup). Ordering dùng logical clock hoặc server timestamp per conversation.

**Q2: Goroutine pool: tại sao cần và implement như thế nào?**
- Hint: Mặc dù goroutine lightweight (~2KB stack), nhưng với 10M+ connections, không thể spawn unlimited goroutines. Goroutine pool giới hạn concurrency, tái sử dụng goroutines. Implement bằng buffered channel làm semaphore, hoặc dùng worker pool pattern. Nói về `ants` library hoặc tự implement với channel + sync.WaitGroup.

**Q3: MySQL table có 2 tỷ messages, query lấy 50 messages mới nhất của 1 conversation. Optimize như thế nào?**
- Hint: Composite index `(conversation_id, created_at DESC)`. Partition table theo conversation_id hoặc time range. Dùng covering index nếu chỉ cần vài columns. Tránh `OFFSET` lớn — dùng cursor-based pagination (WHERE created_at < last_seen_time). Có thể cache hot conversations trong Redis.

**Q4: Implement rate limiter cho API gateway, handle 100K requests/sec**
- Hint: Token bucket hoặc sliding window counter. Distributed: dùng Redis INCR + EXPIRE (fixed window) hoặc sorted set (sliding window). Token bucket: key per user, mỗi request DECR, background process refill. Lua script cho atomic operation. Fallback khi Redis down: local in-memory rate limiter (graceful degradation). Return 429 Too Many Requests + Retry-After header.

**Q5: So sánh goroutine và OS thread. Khi nào goroutine KHÔNG phù hợp?**
- Hint: Goroutine: ~2KB stack (growable), user-space scheduling, fast context switch (~ns). OS thread: ~1MB stack, kernel scheduling, slow context switch (~μs). Goroutine không phù hợp khi: CPU-bound intensive work (cần GOMAXPROCS goroutines, không cần nhiều hơn), cần real-time guarantees (Go GC có STW pauses), cần priority scheduling (Go scheduler không hỗ trợ priority), cần fine-grained CPU affinity.

### Tips for Zalo Interview
1. **Nhấn mạnh kinh nghiệm high-load**: Zalo quan tâm throughput và latency hơn clean code
2. **Hiểu low-level**: Đọc về epoll, TCP tuning, kernel bypass (DPDK) — dù không cần chuyên gia, biết concept là điểm cộng lớn
3. **Benchmark mindset**: Khi trả lời, luôn kèm con số (throughput, latency, memory usage)
4. **Chuẩn bị tiếng Việt**: Phỏng vấn hoàn toàn bằng tiếng Việt, nên tập diễn đạt kỹ thuật bằng tiếng Việt trước
5. **Đọc source code Go networking**: `net/http`, `net` package — hiểu cách Go handle connections ở mức code
6. **Chuẩn bị câu chuyện production incident**: Zalo thích nghe bạn đã debug và fix vấn đề performance thực tế như thế nào

---

## 2. Grab

### Company Overview
- **Sản phẩm**: Superapp Đông Nam Á — ride-hailing, food delivery, payment (GrabPay), insurance, lending
- **Quy mô**: Hoạt động tại 8 quốc gia, hàng triệu transactions/ngày
- **Tech stack chính**: Go (core platform services), Java, Kafka, PostgreSQL, DynamoDB, Redis, AWS (ECS, EKS, S3, SQS)
- **Đặc điểm**: Engineering culture mạnh, publish nhiều tech blog. Process tuyển dụng rất structured, gần giống FAANG

### Interview Format
- **Vòng 1**: Online coding assessment (HackerRank/CoderPad) — 60-90 phút, 2 bài algorithms
- **Vòng 2**: Technical phone screen — Go deep dive + coding — 60 phút
- **Vòng 3**: System design — 60 phút
- **Vòng 4**: Behavioral / Hiring Manager round — 45-60 phút
- Senior level có thể thêm 1 vòng system design nữa

### What They Focus On

**Algorithms — LeetCode Medium/Hard**
- Grab yêu cầu giải thuật rõ ràng, tối ưu. Không chấp nhận brute force cho medium problems
- Patterns thường gặp: sliding window, two pointers, BFS/DFS trên graph, dynamic programming, interval scheduling
- Có thể code bằng Go hoặc bất kỳ ngôn ngữ nào, nhưng dùng Go là điểm cộng

**System Design — Ride-matching, Pricing, Payment**
- Thiết kế ride-matching: driver gần nhất, ETA calculation, surge pricing
- Payment processing: exactly-once guarantee, reconciliation, fraud detection
- Food delivery: restaurant → rider → customer matching, order tracking real-time

**Geospatial Algorithms**
- H3 (Uber's hexagonal hierarchical spatial index) hoặc S2 Geometry (Google)
- Tại sao dùng hexagonal grid thay vì square grid? (uniform distance to neighbors)
- Geofencing: xác định user thuộc zone nào, dynamic pricing theo zone

**Kafka and Event-driven Architecture**
- Consumer group rebalancing: chuyện gì xảy ra khi 1 consumer chết?
- Exactly-once semantics trong Kafka (idempotent producer + transactional consumer)
- Event sourcing vs event notification: khi nào dùng cái nào?
- Dead letter queue: xử lý message thất bại

**Distributed Systems**
- CAP theorem trong thực tế: Grab chọn AP hay CP cho từng service?
- Distributed locking: Redlock algorithm, pitfalls
- Saga pattern cho distributed transactions (ride booking = payment + driver assignment + notification)
- Circuit breaker, retry with exponential backoff

**Observability**
- Distributed tracing (Jaeger/OpenTelemetry): trace 1 request qua 10+ services
- Prometheus metrics: RED method (Rate, Error, Duration) cho mỗi service
- Alerting strategy: severity levels, runbook

### Sample Questions with Answer Hints

**Q1: Design a ride-matching system that matches riders with nearest available drivers**
- Hint: Drivers gửi location update mỗi 3-5s → store trong geospatial index (Redis GEO hoặc custom H3 grid). Khi rider request → query drivers trong radius (bắt đầu 2km, mở rộng dần). Rank drivers theo: distance, ETA (dùng routing engine), driver rating, acceptance rate. Dùng dispatch queue + locking để tránh 2 riders match cùng 1 driver. Notify driver → timeout 15s → nếu reject → match driver tiếp theo.

**Q2: Implement an LRU Cache in Go (LeetCode 146)**
- Hint: Dùng doubly-linked list + hash map. Get O(1): lookup map → move node to front. Put O(1): if exists → update + move to front; if not → insert front, if over capacity → remove tail. Trong Go, dùng `container/list` hoặc tự implement. Cẩn thận concurrent access → dùng `sync.RWMutex`.

**Q3: Grab cần tính surge pricing real-time. Thiết kế system.**
- Hint: Divide city thành hexagonal zones (H3 resolution 7-8). Mỗi zone track supply (available drivers) và demand (ride requests) trong sliding window 5 phút. Surge multiplier = f(demand/supply). Dùng Kafka stream processing để aggregate real-time. Cache kết quả trong Redis với TTL 30s. Có price cap để tránh over-charge. A/B testing framework để tune formula.

**Q4: Design a food delivery order tracking system (real-time location updates)**
- Hint: Rider app gửi GPS location mỗi 3s → Kafka topic (partitioned by rider_id) → Consumer update Redis GEO + WebSocket server push to customer. Location history → append-only table (time-series: rider_id, lat, lng, timestamp). ETA calculation: route distance remaining / average speed (update real-time). Customer app subscribe WebSocket room by order_id. Handling: rider offline → last known location + "location unavailable" status. Scale: 1M concurrent deliveries → 330K location updates/sec → partition Kafka by city + rider_id hash.

**Q5: Implement a distributed lock using Redis. What are the pitfalls?**
- Hint: Simple: `SET key value NX EX 30`. Release: Lua script check value before DEL (avoid releasing someone else's lock). Pitfalls: (1) Clock drift — nếu lock holder process chậm, lock expire → 2 holders. (2) Redis failover — lock trên master, master die trước replicate → new master không có lock. Redlock (Martin Kleppmann đã criticize): acquire lock trên N/2+1 Redis nodes. Alternative: dùng lease-based approach với fencing token. Trong thực tế, Grab dùng ZooKeeper hoặc etcd cho critical distributed locks.

### Tips for Grab Interview
1. **LeetCode là bắt buộc**: Giải ít nhất 150-200 bài, tập trung medium. Hard chỉ cần biết approach
2. **Đọc Grab Engineering Blog**: https://engineering.grab.com — nhiều bài rất hay về architecture decisions
3. **Practice nói bằng tiếng Anh**: Phỏng vấn bằng tiếng Anh (trừ HR round), cần diễn đạt trôi chảy
4. **STAR method cho behavioral**: Chuẩn bị 5-6 stories về leadership, conflict resolution, failure handling
5. **Hỏi ngược**: Cuối mỗi vòng, chuẩn bị 2-3 câu hỏi thông minh về team/product
6. **Ride-hailing domain knowledge**: Hiểu basics — matching, dispatch, surge pricing, ETA. Đọc Uber/Grab engineering blog
7. **Distributed systems vocabulary**: Nắm vững CAP, ACID, BASE, eventual consistency — Grab hỏi practical trade-offs, không hỏi lý thuyết suông

---

## 3. Axon (formerly Axon Active)

### Company Overview
- **Mô hình**: Outsourcing/Product company, build products cho clients quốc tế (chủ yếu Thụy Sĩ, Đức)
- **Quy mô VN**: Văn phòng tại HCM và Đà Nẵng, 300+ engineers
- **Tech stack chính**: Go, Python, PostgreSQL, Docker, Kubernetes, GitLab CI
- **Đặc điểm**: Rất chú trọng software craftsmanship — clean code, TDD, Agile. Culture giống Thoughtworks

### Interview Format
- **Vòng 1**: Technical screening — Go knowledge + OOP/design principles — 45-60 phút
- **Vòng 2**: Live coding / Pair programming session — 60-90 phút
- **Vòng 3**: Cultural fit + Architecture discussion — 45-60 phút
- Đôi khi có take-home assignment thay vì live coding

### What They Focus On

**Go Language Deep Dive**
- Interface: implicit satisfaction, empty interface, interface composition
- Error handling: custom errors, error wrapping (`%w`), errors.Is/As
- Goroutines + channels: fan-in/fan-out, pipeline pattern, context cancellation
- Go modules, dependency management

**Clean Architecture / Hexagonal Architecture**
- Dependency rule: inner layers không biết outer layers
- Port và Adapter: interface (port) ở domain layer, implementation (adapter) ở infrastructure
- Tách biệt business logic khỏi framework/database
- Axon rất coi trọng kiến trúc này — chuẩn bị kỹ

**TDD and Testing**
- Red-Green-Refactor cycle
- Table-driven tests trong Go
- Test doubles: mock, stub, fake, spy — khi nào dùng cái nào
- Integration test với testcontainers-go
- Test coverage expectations (Axon thường yêu cầu >80%)

**Microservices Patterns**
- CQRS: tách read và write model, khi nào nên dùng
- Event sourcing: store events thay vì current state, replay, projection
- Saga pattern: orchestration vs choreography
- API Gateway, service mesh basics

**Code Quality — SOLID in Go**
- **S**: Mỗi struct/package có single responsibility
- **O**: Extend behavior qua interfaces, không sửa existing code
- **L**: Interface segregation (nhỏ, focused interfaces) thay thế Liskov trong Go
- **I**: Nhiều interface nhỏ tốt hơn 1 interface lớn (io.Reader, io.Writer)
- **D**: Accept interfaces, return structs

**Docker and Kubernetes**
- Multi-stage Docker build cho Go (build stage → scratch/distroless)
- Kubernetes: Pod, Deployment, Service, ConfigMap, Secret
- Liveness vs Readiness probe cho Go service
- Resource requests/limits, HPA basics

### Sample Questions with Answer Hints

**Q1: Implement hexagonal architecture cho một Order Service**
- Hint: Domain layer: `Order` entity, `OrderRepository` interface (port), `OrderService` (business logic). Application layer: Use cases (`CreateOrder`, `CancelOrder`). Infrastructure layer: `PostgresOrderRepository` (adapter), `KafkaEventPublisher` (adapter). HTTP handler ở outermost layer, gọi use case. Tất cả dependencies inject qua interfaces.

**Q2: Viết unit test cho function tính shipping fee với nhiều edge cases**
- Hint: Table-driven test pattern trong Go. Mỗi test case là struct: `{name, input, expected, wantErr}`. Cover: normal case, free shipping threshold, international shipping, oversized package, zero weight, negative weight. Dùng `t.Run(tc.name, ...)` cho subtests. Mock external dependencies (distance calculator, tax service) bằng interface.

**Q3: Giải thích sự khác biệt giữa CQRS và traditional CRUD, khi nào nên dùng CQRS?**
- Hint: CRUD: 1 model cho cả read/write, đơn giản. CQRS: tách command (write) và query (read) model — có thể dùng DB khác nhau (PostgreSQL cho write, Elasticsearch cho read). Nên dùng khi: read/write có load rất khác nhau, cần optimize read performance riêng, domain phức tạp. Không nên dùng khi: app đơn giản, team nhỏ, không cần scale read/write independently. Eventual consistency là trade-off chính.

**Q4: Trong pair programming session, refactor một function 200 dòng thành clean code. Approach?**
- Hint: Bước 1: Đọc hiểu function, identify responsibilities (thường 1 function dài = multiple responsibilities). Bước 2: Viết tests cho behavior hiện tại (characterization tests) — đảm bảo refactor không break. Bước 3: Extract methods theo responsibility. Bước 4: Identify shared state → encapsulate vào struct. Bước 5: Replace concrete dependencies bằng interfaces. Bước 6: Run tests sau mỗi bước refactor. Key: communicate reasoning tại mỗi bước — "I'm extracting this because it has a different responsibility".

**Q5: Design a notification system that supports email, SMS, push notification. How to make it extensible?**
- Hint: Strategy pattern qua interfaces. Define `Notifier` interface: `Send(ctx context.Context, msg Message) error`. Implement: `EmailNotifier`, `SMSNotifier`, `PushNotifier`. `NotificationService` nhận `[]Notifier`, loop qua và send. Thêm channel mới = implement interface mới, không sửa code cũ (Open/Closed). Retry logic: decorator pattern — `RetryNotifier` wraps any `Notifier`. Queue: mỗi notification type có riêng SQS queue, fan-out từ SNS topic. User preferences: table `user_notification_preferences(user_id, channel, enabled)`.

### Tips for Axon Interview
1. **Đọc sách Clean Architecture (Robert C. Martin)**: Ít nhất phần concepts chính
2. **Practice TDD thật sự**: Viết test trước, rồi code — không phải viết code xong bổ sung test
3. **Prepare pair programming**: Họ đánh giá cách bạn communicate trong khi code, không chỉ kết quả
4. **Nói về refactoring**: Chia sẻ kinh nghiệm refactoring legacy code, cải thiện code quality
5. **Agile vocabulary**: Hiểu Scrum ceremonies, definition of done, user stories
6. **Prepare code samples**: Mang theo 1-2 project cá nhân có clean architecture, TDD — có thể được yêu cầu walkthrough
7. **Design patterns in Go**: Nắm 5-7 patterns phổ biến nhất và cách implement trong Go (không dùng class-based pattern)

---

## 4. Employment Hero

### Company Overview
- **Sản phẩm**: Nền tảng HR/Payroll SaaS, phục vụ 300K+ businesses tại Úc, NZ, UK, Singapore, Malaysia
- **Quy mô VN**: Engineering hub lớn tại HCM, 200+ engineers
- **Tech stack chính**: Go (new services), Ruby on Rails (legacy), PostgreSQL, Redis, AWS (SQS, SNS, Lambda, S3)
- **Đặc điểm**: Đang chuyển dần từ Ruby monolith sang Go microservices. Rất cần người biết cả hai thế giới

### Interview Format
- **Vòng 1**: Take-home assignment (3-5 ngày) HOẶC Live coding session — tùy position
- **Vòng 2**: System design + Technical deep dive — 60-90 phút
- **Vòng 3**: Cultural fit với Engineering Manager — 45-60 phút
- Take-home thường là build 1 small API service hoàn chỉnh

### What They Focus On

**Go Service Design**
- Clean architecture applied to Go microservice
- Dependency injection without frameworks (wire hoặc manual)
- Configuration management (env vars, config files, feature flags)
- Graceful shutdown: handle in-flight requests, close DB connections, drain queues

**PostgreSQL Deep Dive — Trọng tâm lớn**
- Index types: B-tree (default), GIN (full-text search, JSONB), GiST (geometric), partial index
- Query optimization: `EXPLAIN ANALYZE`, sequential scan vs index scan, join strategies (nested loop, hash join, merge join)
- Migrations: zero-downtime migration strategies (add column → backfill → add NOT NULL constraint)
- Connection pooling: PgBouncer, transaction vs session mode
- MVCC: how PostgreSQL handles concurrent reads/writes, vacuum, bloat

**Multi-tenant Database Design**
- Strategies: shared database + shared schema (row-level tenant_id), shared database + separate schema, separate database
- Employment Hero dùng shared schema approach — mọi table có `organisation_id`
- Row-Level Security (RLS) trong PostgreSQL
- Tenant isolation: đảm bảo query không bao giờ leak data giữa tenants
- Performance: index trên `(organisation_id, ...)` cho mọi query

**Background Job Processing**
- Worker queue: AWS SQS, Sidekiq (Ruby) → dần chuyển sang Go workers
- Job patterns: idempotency (chạy lại không ảnh hưởng), retry strategy, dead letter queue
- Payroll calculation: batch processing hàng triệu employees, error handling per-employee
- Scheduled jobs: cron-like (payroll runs, report generation)

**RESTful API Design**
- Resource naming, HTTP method semantics, status codes
- Pagination: cursor-based vs offset-based (cursor tốt hơn cho dataset thay đổi)
- Filtering, sorting, partial response (field selection)
- Versioning strategy: URL path vs header
- Rate limiting, request validation

**AWS Services Integration**
- SQS: standard vs FIFO, visibility timeout, long polling
- SNS: pub/sub, fan-out pattern (1 event → nhiều SQS queues)
- Lambda: khi nào dùng serverless vs container-based Go service
- S3: presigned URLs cho file upload, lifecycle policies

**Testing Strategies**
- Unit test: table-driven, mocking interfaces
- Integration test: test với real PostgreSQL (docker-compose hoặc testcontainers)
- Contract test: Pact — đảm bảo API không break consumers
- E2E test: chỉ cho critical paths (payroll calculation, payment)

### Sample Questions with Answer Hints

**Q1: Thiết kế multi-tenant payroll service. Mỗi tháng tính lương cho 1M+ employees across 10K organizations.**
- Hint: Dùng shared schema, mọi table có `organisation_id`. Payroll run triggered per org (SQS message per org). Go worker pool consume messages, mỗi worker xử lý 1 org. Tính lương per-employee: gross → tax → deductions → net. Store kết quả transactionally. Error per-employee không fail whole org — log lỗi, continue, report. Dùng database transaction per org (không per-employee — quá nhiều transactions). Idempotent: payroll run có unique `run_id`, check trước khi tính.

**Q2: PostgreSQL query đang chạy 5s, cần optimize xuống <100ms. Approach?**
- Hint: Bước 1: `EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)` để xem execution plan. Bước 2: Tìm sequential scan trên table lớn → thêm index. Bước 3: Check join order, có thể cần rewrite query. Bước 4: Check `work_mem` setting nếu sort/hash join spill to disk. Bước 5: Check table bloat, run VACUUM nếu cần. Bước 6: Nếu query complex → consider materialized view hoặc denormalize. Nói rõ từng bước diagnostic, không nhảy thẳng vào giải pháp.

**Q3: Zero-downtime migration: thêm NOT NULL column vào table có 50M rows**
- Hint: Không thể `ALTER TABLE ADD COLUMN ... NOT NULL DEFAULT ...` trực tiếp trên PostgreSQL <11 (lock table). Approach: (1) Add column nullable, (2) Backfill data in batches (UPDATE ... WHERE id BETWEEN x AND y, commit mỗi batch), (3) Add NOT NULL constraint using `ALTER TABLE ... ADD CONSTRAINT ... CHECK (col IS NOT NULL) NOT VALID` → sau đó `VALIDATE CONSTRAINT` (không lock writes). Hoặc PostgreSQL 11+ cho phép `ADD COLUMN ... NOT NULL DEFAULT val` mà không rewrite table — nhưng vẫn cần hiểu approach cũ.

**Q4: Design a background job system for processing CSV imports (100K+ rows per file)**
- Hint: Upload CSV → S3 → SQS message trigger. Go worker download file, parse streaming (không load toàn bộ vào memory — dùng `csv.NewReader` với `bufio`). Process per-batch (500-1000 rows): validate → transform → bulk insert PostgreSQL (`COPY` hoặc batch INSERT). Progress tracking: update job record mỗi batch (processed_count, error_count). Error handling: collect errors per-row, continue processing, cuối cùng generate error report. Idempotent: mỗi import có unique job_id, check trước khi process. Timeout: nếu file quá lớn → split thành chunks, mỗi chunk 1 SQS message.

**Q5: Explain the difference between SQS Standard and FIFO. When would you choose each?**
- Hint: Standard: at-least-once delivery, best-effort ordering, nearly unlimited throughput. FIFO: exactly-once processing, strict ordering per message group, 300 msg/sec (3000 with batching). Choose Standard khi: order không quan trọng (send email, resize image), cần high throughput, idempotent consumers. Choose FIFO khi: order matters (financial transactions, state machine transitions), dedup critical. Employment Hero context: payroll calculation order matters (FIFO per org), but notification sends don't (Standard). Gotcha: FIFO message group ID quyết định ordering scope — choose wisely (per-user? per-org? per-entity?).

### Tips for Employment Hero Interview
1. **Take-home quality**: Nếu có take-home, đầu tư thời gian — viết README, tests, clean architecture. Đây là cơ hội show best work
2. **PostgreSQL là must-know**: Đọc kỹ về indexing, EXPLAIN ANALYZE, migration strategies
3. **Monolith-to-microservices story**: Chuẩn bị chia sẻ kinh nghiệm migrate từ monolith (nếu có)
4. **Payroll domain**: Hiểu basics về payroll (gross, net, tax, superannuation) — không cần chi tiết nhưng biết concepts
5. **Culture**: Employment Hero coi trọng ownership và proactive communication
6. **Multi-tenant experience**: Nếu từng làm SaaS multi-tenant, prepare deep story. Nếu chưa, đọc kỹ section multi-tenant ở trên
7. **Migration stories**: Prepare 1-2 stories về database migration phức tạp — zero-downtime, large table, backward compatibility

---

## 5. Microsoft

### Company Overview
- **Quy mô**: Global tech giant, Azure cloud platform (thị phần #2 thế giới sau AWS)
- **VN presence**: Tuyển remote hoặc relocate (Singapore, US, etc.)
- **Đặc điểm phỏng vấn**: Structured, standardized across teams. Ít Go-specific, nhiều general CS hơn

### Interview Format
- **Vòng 1**: Online assessment (2 coding problems trên Codility/HackerRank) — 90 phút
- **Vòng 2**: Phone screen — 1 coding + behavioral — 60 phút
- **Vòng 3-4**: Virtual onsite — 2 coding rounds (45 phút mỗi vòng)
- **Vòng 5**: System design — 60 phút
- **Vòng 6**: Behavioral / "As-appropriate" round với hiring manager — 45 phút
- Tổng: 4-5 vòng technical, đôi khi gộp lại trong 1 ngày (virtual onsite loop)

### What They Focus On

**Algorithms — LeetCode Medium/Hard**
- Mỗi coding round: 1 bài, 45 phút. Cần giải sạch, tối ưu, handle edge cases
- **Top patterns**: Binary search variations, graph BFS/DFS, dynamic programming, tree traversal, sliding window, stack/queue applications
- Microsoft thích bài real-world (design data structures, implement features) hơn bài toán thuần
- Code bằng ngôn ngữ nào cũng được, nhưng phải proficient

**System Design — Azure Scale**
- Thiết kế services scale Azure level: CDN, blob storage, message queue
- Focus vào: reliability, scalability, availability
- Trade-off discussions: consistency vs availability, cost vs performance
- Data partitioning, replication strategies

**OS Fundamentals**
- Process vs thread: memory model, context switching cost
- Concurrency primitives: mutex, semaphore, condition variable
- Memory management: virtual memory, paging, cache (L1/L2/L3)
- Networking: TCP handshake, congestion control, DNS resolution flow

**Object-Oriented Design in Go Context**
- Design patterns adapted for Go: Strategy (interfaces), Factory, Observer (channels)
- SOLID principles applied to Go packages and interfaces
- Dependency injection in Go (no framework needed)
- Package design: when to split, when to keep together

**Behavioral — Growth Mindset**
- Microsoft cực kỳ coi trọng "Growth Mindset" — khả năng học hỏi và adapt
- STAR method (Situation, Task, Action, Result)
- Themes: collaboration, handling failure, giving/receiving feedback, dealing with ambiguity
- Prepare ít nhất 6 stories covering: leadership, conflict, failure, learning, impact, teamwork

### Sample Questions with Answer Hints

**Q1: Design a URL shortener (like bit.ly)**
- Hint: Requirements — shorten URL, redirect, analytics. Hashing: MD5/SHA256 của URL → lấy 7 chars (base62 encoding) → 62^7 = 3.5 trillion combinations. Storage: key-value store (DynamoDB hoặc Redis + PostgreSQL). Read-heavy → cache hot URLs. Redirect: 301 (permanent) vs 302 (temporary) — dùng 302 nếu cần track analytics. Scale: partition by hash prefix, replicate reads. Analytics: async log clicks → batch process.

**Q2: Find the median of two sorted arrays (LeetCode 4 — Hard)**
- Hint: Binary search approach, O(log(min(m,n))). Partition cả 2 arrays sao cho left half chứa đúng (m+n)/2 elements. Binary search trên array ngắn hơn. Condition: maxLeft1 <= minRight2 && maxLeft2 <= minRight1. Handle edge cases: empty arrays, all elements of one array smaller.

**Q3: Tell me about a time you disagreed with your team's technical decision**
- STAR hint: **S**: Team muốn dùng microservices cho project nhỏ. **T**: Tôi cần convince team rằng monolith phù hợp hơn ở giai đoạn này. **A**: Thu thập data (team size, timeline, complexity), present trade-offs trong design review, propose monolith-first approach với clear extraction path. **R**: Team đồng ý, ship nhanh hơn 2 tháng, sau đó extract 2 services khi cần. Lesson: data-driven arguments effective hơn opinion.

**Q4: Design Azure Blob Storage (like S3)**
- Hint: Core: store arbitrary binary data, retrieve by key. API: PUT/GET/DELETE blob. Storage: partition data across storage nodes by hash of (account + container + blob name). Replication: 3 replicas across fault domains (rack-aware). Consistency: strong consistency for single-blob operations (read-after-write). Large blobs: split into blocks, parallel upload, commit block list. Metadata: separate metadata store (SQL-like) from data store. CDN integration: edge caching for frequently accessed blobs. Access control: SAS tokens (time-limited, permission-scoped).

**Q5: Implement a LFU (Least Frequently Used) Cache in Go (LeetCode 460 — Hard)**
- Hint: HashMap cho key→value+freq. HashMap cho freq→doubly-linked-list (ordered by recency). Track min_freq. Get: lookup key, increment freq, move node from freq_list to freq+1_list, update min_freq nếu old list empty. Put: if exists → update + increment freq. If not → if full, evict from min_freq list (tail = LRU among LFU), insert with freq=1, min_freq=1. All operations O(1). Trong Go: tự implement doubly-linked list hoặc dùng `container/list`.

### STAR Method — Detailed Preparation

Chuẩn bị ít nhất 1 story cho mỗi theme sau:

| Theme | Câu hỏi mẫu | Tip |
|-------|-------------|-----|
| Leadership | "Tell me about a time you led a project" | Focus vào influence, không cần formal authority |
| Conflict | "Disagreement with a teammate" | Show resolution, không blame |
| Failure | "Tell me about a mistake you made" | Nhấn mạnh lesson learned và action taken |
| Ambiguity | "How do you handle unclear requirements?" | Show structured approach to discover requirements |
| Impact | "Most impactful project you worked on" | Quantify results (giảm X%, tăng Y%) |
| Growth | "What have you learned recently?" | Show continuous learning habit |

### Tips for Microsoft Interview
1. **LeetCode daily**: 2-3 tháng trước interview, giải 1-2 bài/ngày. Focus medium
2. **System design**: Đọc "Designing Data-Intensive Applications" (Martin Kleppmann) — sách này cover 90% topics
3. **Behavioral quan trọng ngang coding**: Microsoft reject ứng viên code tốt nhưng behavioral kém
4. **Growth mindset**: Thể hiện bạn thích learn, không defensive khi nhận feedback
5. **Ask clarifying questions**: Microsoft đánh giá cao việc hỏi rõ requirements trước khi code
6. **Communicate while coding**: Explain approach trước khi viết code, narrate while coding

---

## 6. Google

### Company Overview
- **Đặc biệt**: Google invented Go (Robert Griesemer, Rob Pike, Ken Thompson). Phỏng vấn Go ở Google có bar cao nhất
- **Quy mô**: Search, YouTube, Maps, Cloud, Android — mỗi product có billions of users
- **VN presence**: Tuyển relocate (Singapore, US, Europe) hoặc remote cho một số vị trí

### Interview Format
- **Vòng 1**: Online assessment hoặc phone screen — 1-2 coding problems — 45-60 phút
- **Vòng 2-6**: Virtual/Onsite loop — thường 5 rounds trong 1 ngày:
  - **3 rounds Coding**: Mỗi round 45 phút, 1-2 bài algorithms
  - **1-2 rounds System Design**: Large-scale system design (45-60 phút mỗi round)
  - **1 round Googleyness & Leadership (G&L)**: Behavioral — 45 phút
- Sau interview loop → Hiring Committee review → Team matching → Offer
- Process dài: 4-8 tuần từ apply đến offer

### What They Focus On

**Algorithms — LeetCode Hard Level**
- Google kỳ vọng **optimal solution** — brute force không đủ, even cho medium
- Cần giải thích **time/space complexity** rõ ràng
- Top patterns: graph algorithms (Dijkstra, topological sort, union-find), dynamic programming (2D DP, bitmask DP), advanced tree structures, string algorithms (KMP, Rabin-Karp)
- Google thích bài có nhiều follow-ups: giải xong → "what if the input is too large for memory?" → "what if distributed?"

**Advanced Data Structures**
- Segment tree: range query + point update (range sum, range min)
- Trie: autocomplete, spell checker, IP routing
- Disjoint Set (Union-Find): connected components, Kruskal's MST
- Suffix array / suffix tree: string matching problems
- Bloom filter: probabilistic membership test (Google dùng cho Chrome safe browsing)

**System Design at Google Scale**
- Web crawler: crawl billions of pages, politeness, dedup, freshness
- Search engine: inverted index, ranking (PageRank concept), query processing pipeline
- YouTube: video upload pipeline, transcoding, CDN, recommendation
- Google Maps: routing (Dijkstra trên road graph), ETA prediction, real-time traffic
- Chat/messaging: presence, delivery, ordering (giống Zalo nhưng global scale)

**Go Internals — Deep Knowledge**
- **GMP Scheduler**: G (goroutine), M (OS thread), P (logical processor). Work stealing, preemption (Go 1.14+ asynchronous preemption), handoff. Biết khi nào goroutine bị schedule ra (syscall, channel block, runtime.Gosched)
- **Channel implementation**: Internal structure (hchan struct), circular buffer cho buffered channels, waitq (sudog linked list) cho blocked goroutines, lock-free fast path
- **Garbage Collector**: Tri-color mark-and-sweep, write barrier, concurrent GC phases (mark setup → concurrent mark → mark termination → sweep). GC tuning: GOGC, GOMEMLIMIT (Go 1.19+). Pacer algorithm
- **Memory model**: Happens-before relationship, memory ordering, khi nào dùng sync/atomic vs mutex. Data race vs race condition

**Distributed Systems Concepts**
- **Bigtable**: Sparse, distributed, sorted map. Row key design, column families, tablets, compaction (SSTable → LSM tree)
- **Spanner**: Globally distributed, externally consistent. TrueTime API, Paxos-based replication
- **MapReduce**: Map → Shuffle → Reduce. Khi nào dùng, limitations (batch only)
- **Borg/Kubernetes**: Resource scheduling, bin packing, preemption. (Borg là tiền thân của K8s)
- Consensus: Paxos/Raft basics — leader election, log replication

**Googleyness & Leadership**
- "Doing the right thing" — ethical decision making
- Handling ambiguity: structured approach khi requirements unclear
- Navigating complexity: simplify complex problems
- Collaboration: work effectively across teams
- Không giống behavioral thông thường — Google muốn thấy thinking process, không chỉ kết quả

### Sample Questions with Answer Hints

**Q1: Design a distributed web crawler that crawls 1 billion pages per day**
- Hint: Architecture: URL Frontier (priority queue, politeness per domain) → Fetcher (distributed, respect robots.txt) → Parser (extract links, content) → Dedup (URL dedup bằng Bloom filter, content dedup bằng SimHash) → Storage (Bigtable cho content, Graph DB cho link structure). Challenges: politeness (rate limit per domain), trap detection (infinite URLs), freshness (re-crawl strategy based on change frequency). Scale: 1B pages/day = ~12K pages/sec → partition by domain → nhiều worker nodes.

**Q2: Given a stream of integers, find the median at any point (LeetCode 295 — Hard)**
- Hint: Two heaps approach: max-heap cho lower half, min-heap cho upper half. Maintain balance: size difference <= 1. Median = top of max-heap (odd count) hoặc average of both tops (even count). Add: O(log n), Find median: O(1). Follow-up nếu distributed: approximate median bằng count-min sketch hoặc t-digest.

**Q3: Explain Go's garbage collector. How would you tune it for a latency-sensitive service?**
- Hint: Go dùng concurrent, tri-color mark-and-sweep. 3 phases: (1) STW mark setup (rất ngắn, ~μs), (2) Concurrent marking (goroutines vẫn chạy, write barrier track mutations), (3) STW mark termination (ngắn), (4) Concurrent sweep. Tuning: Giảm GOGC (default 100) → GC chạy thường hơn nhưng mỗi lần nhanh hơn → lower latency spikes. Go 1.19+: dùng GOMEMLIMIT thay vì GOGC — set memory limit, GC tự adjust. Giảm allocation: reuse objects (sync.Pool), pre-allocate slices. Profile: `go tool pprof` để tìm allocation hotspots.

**Q4: Design a notification delivery system at Google scale (billions of devices)**
- Hint: Multi-channel: push (FCM/APNs), email, SMS, in-app. Architecture: Notification Service (API) → Priority Queue (Kafka/Pub-Sub, separate topics by priority: P0 critical, P1 high, P2 normal) → Channel Dispatchers (separate workers per channel). Dedup: notification_id + device_id → check before send. Rate limiting per user (anti-spam). Device registry: map user → devices (multiple per user). Batching: group notifications for efficiency (email digest). Analytics: delivery rate, open rate, latency percentiles. Failure handling: retry with exponential backoff, circuit breaker per downstream (FCM, email provider). At Google scale: partition by user_id hash → regional processing → edge delivery.

**Q5: Implement a thread-safe generic LRU cache in Go using generics (Go 1.18+)**
```go
// Interviewer expects you to design the API and discuss trade-offs
type LRUCache[K comparable, V any] struct {
    capacity int
    items    map[K]*list.Element
    order    *list.List
    mu       sync.RWMutex
}
```
- Hint: Discuss: RWMutex (read-heavy) vs Mutex (simple). Sharded cache cho higher concurrency (N shards, hash key to shard, each shard has own lock). Eviction callback (notify when item evicted). TTL support (lazy expiration on access + background cleanup goroutine). Benchmark: `sync.RWMutex` vs `sync.Map` — RWMutex tốt hơn khi read/write ratio known và consistent.

### How Google Evaluates Candidates

Google dùng rubric 4 mức cho mỗi dimension:

| Level | Coding | System Design | G&L |
|-------|--------|---------------|-----|
| Strong No Hire | Không giải được, logic sai | Không hiểu basic concepts | Red flags, no collaboration |
| No Hire | Giải được nhưng không optimal, hints nhiều | Thiếu depth, miss trade-offs | Weak examples |
| Hire | Optimal solution, clean code, good communication | Solid design, good trade-offs | Clear examples, good judgment |
| Strong Hire | Optimal + handle all edge cases + follow-ups, teach interviewer something | Novel insights, experience-backed decisions | Exceptional leadership, strong self-awareness |

Cần **majority Hire hoặc Strong Hire** qua Hiring Committee. Một "No Hire" có thể chấp nhận nếu các vòng khác Strong Hire.

### Tips for Google Interview
1. **6+ tháng chuẩn bị**: Google có bar cao nhất, cần thời gian dài
2. **LeetCode 300+ bài**: Focus patterns, không chỉ memorize solutions. Phải giải lại bài khó
3. **"Think out loud"**: Google đánh giá thought process nhiều hơn correct answer
4. **Follow-up questions**: Luôn sẵn sàng cho "what if" — bigger data, more constraints, distributed
5. **Đọc Google research papers**: Bigtable, Spanner, MapReduce, GFS — ít nhất ở mức overview
6. **Mock interviews**: Pramp, interviewing.io, hoặc nhờ bạn — cực kỳ quan trọng
7. **Đừng nản**: Tỷ lệ pass ~1-2%. Reject không có nghĩa bạn yếu — có thể apply lại sau 6-12 tháng

---

## 7. General Preparation Strategy

### 8-Week Study Plan

> Plan này dành cho người đã có kinh nghiệm Go 1-2 năm, target Middle/Senior position tại các công ty trên.

#### Week 1-2: Foundations
| Day | Morning (2h) | Evening (2h) |
|-----|-------------|-------------|
| Mon-Fri | LeetCode Easy/Medium (2 bài/ngày) | Go fundamentals review (concurrency, interfaces, error handling) |
| Sat | Mock coding interview (tự practice) | Review Go internals (GMP, GC, memory model) |
| Sun | Rest / Light review | Read 1 engineering blog post |

**Focus patterns**: Array, String, HashMap, Two Pointers, Sliding Window

#### Week 3-4: Core Algorithms + Database
| Day | Morning (2h) | Evening (2h) |
|-----|-------------|-------------|
| Mon-Fri | LeetCode Medium (2 bài/ngày) — Tree, Graph, DP | Database deep dive (PostgreSQL, Redis, indexing) |
| Sat | Mock coding interview | SQL practice (complex queries, EXPLAIN ANALYZE) |
| Sun | Review weak areas | System design: read 1 chapter DDIA |

**Focus patterns**: BFS/DFS, Binary Search, DP (1D → 2D), Heap/Priority Queue

#### Week 5-6: System Design + Advanced Topics
| Day | Morning (2h) | Evening (2h) |
|-----|-------------|-------------|
| Mon-Fri | LeetCode Medium/Hard (1-2 bài/ngày) | System design practice (1 topic/ngày) |
| Sat | Mock system design interview | Microservices patterns, distributed systems |
| Sun | Review | Read target company's engineering blog |

**System design topics**: URL shortener, chat system, ride matching, news feed, rate limiter, payment system, notification service, search autocomplete

#### Week 7-8: Company-Specific Prep + Mock Interviews
| Day | Morning (2h) | Evening (2h) |
|-----|-------------|-------------|
| Mon-Wed | Target company's focus areas | Mock interviews (coding + system design) |
| Thu-Fri | Behavioral prep (STAR stories) | Review weak areas, redo failed problems |
| Sat | Full mock interview loop (3 rounds) | Rest |
| Sun | Light review, mental prep | Prepare questions to ask interviewer |

### How to Practice System Design

1. **Pick a system** (e.g., "Design WhatsApp")
2. **Set timer 45 minutes**
3. **Follow framework**:
   - Clarify requirements (5 min): functional + non-functional (scale, latency, availability)
   - Estimate scale (5 min): DAU, QPS, storage
   - High-level design (10 min): core components, data flow
   - Deep dive (20 min): database schema, API design, key algorithms
   - Trade-offs & bottlenecks (5 min): what could go wrong, how to scale
4. **Review**: Compare với solutions trên các resource (System Design Primer, DDIA, YouTube channels)
5. **Mock interviews**: Pramp (free), interviewing.io (paid), hoặc nhờ đồng nghiệp senior

### LeetCode Strategy — Patterns to Focus On

| Pattern | Số bài recommend | Ví dụ | Company hay hỏi |
|---------|-----------------|-------|-----------------|
| Two Pointers | 15 | 3Sum, Container With Most Water | Grab, Microsoft |
| Sliding Window | 12 | Minimum Window Substring, Longest Substring Without Repeating | Grab, Google |
| Binary Search | 15 | Search in Rotated Array, Find Minimum | Microsoft, Google |
| BFS/DFS | 20 | Number of Islands, Word Ladder | All companies |
| Tree | 15 | LCA, Serialize/Deserialize | Microsoft, Google |
| Dynamic Programming | 25 | Coin Change, Longest Common Subsequence, Edit Distance | Google, Microsoft |
| Graph | 15 | Course Schedule, Network Delay Time | Google, Grab |
| Heap/Priority Queue | 10 | Merge K Sorted Lists, Find Median | Google |
| Stack/Monotonic Stack | 10 | Daily Temperatures, Largest Rectangle | Google |
| Trie | 5 | Implement Trie, Word Search II | Google |
| Union-Find | 5 | Number of Connected Components, Accounts Merge | Google |

**Total: ~150 bài carefully selected > 500 bài random**

### Common Go Interview Questions — Across All Companies

Dù mỗi company focus khác nhau, có một số câu hỏi Go xuất hiện lặp đi lặp lại. Nắm vững những câu này giúp bạn tự tin ở bất kỳ đâu:

**Concurrency Questions (hỏi ở mọi nơi)**

| # | Question | Short Answer Key Points |
|---|----------|----------------------|
| 1 | Goroutine vs Thread? | Goroutine: user-space, ~2KB stack, M:N scheduling. Thread: kernel-space, ~1MB stack |
| 2 | Channel vs Mutex — khi nào dùng cái nào? | Channel: transfer ownership of data, coordinate goroutines. Mutex: protect shared state, simple lock |
| 3 | Buffered vs Unbuffered channel? | Unbuffered: synchronous, sender blocks until receiver ready. Buffered: async up to capacity |
| 4 | Giải thích `select` statement | Multiplexes channel operations, random choice if multiple ready, `default` for non-blocking |
| 5 | Cách detect và fix goroutine leak? | `runtime.NumGoroutine()`, pprof goroutine profile, ensure all goroutines have exit path (context cancel, done channel) |
| 6 | `sync.WaitGroup` vs `errgroup.Group`? | WaitGroup: wait for all, no error. errgroup: wait + collect first error + cancel context |
| 7 | What is `context.Context` used for? | Cancellation, timeout, deadline, request-scoped values. Pass as first param. Never store in struct |

**Language & Runtime Questions**

| # | Question | Short Answer Key Points |
|---|----------|----------------------|
| 1 | Interface satisfaction — implicit vs explicit? | Go: implicit (no `implements` keyword). Duck typing at compile time |
| 2 | Value receiver vs Pointer receiver? | Value: copy, safe for concurrent use, works with both value and pointer. Pointer: mutate, no copy, only with pointer |
| 3 | `defer` execution order? | LIFO (stack). Evaluated immediately, executed when surrounding function returns |
| 4 | Slice vs Array? | Array: fixed size, value type. Slice: dynamic, reference type (header: pointer, len, cap) |
| 5 | What happens when you append to a slice? | If len < cap → append in place. If len == cap → allocate new array (2x or 1.25x), copy, append |
| 6 | `nil` interface vs `nil` pointer in interface? | `nil` interface = (nil, nil). Interface holding nil pointer = (type, nil) ≠ nil. Common gotcha |
| 7 | How does Go handle errors vs exceptions? | Errors as values (return error). No try/catch. panic/recover for truly exceptional cases only |
| 8 | What is `init()` function? | Runs before main(), can have multiple per file, order: imported packages first. Avoid side effects |

**Design & Architecture Questions**

| # | Question | Short Answer Key Points |
|---|----------|----------------------|
| 1 | How to structure a Go project? | Standard layout: `/cmd`, `/internal`, `/pkg`, `/api`. Or flat for small projects |
| 2 | Dependency injection in Go? | Constructor injection via interfaces. No framework needed. `wire` for large projects |
| 3 | How to handle configuration? | Env vars (12-factor app) + config file fallback. `viper` library or manual |
| 4 | Graceful shutdown pattern? | `signal.NotifyContext` → stop accepting new requests → drain in-flight → close DB/connections → exit |
| 5 | How to implement middleware in Go? | Function that takes http.Handler and returns http.Handler. Chain pattern |

### How to Handle "I Don't Know"

Đây là kỹ năng quan trọng mà nhiều ứng viên thiếu:

**Tuyệt đối không**: Im lặng, hoặc nói "I don't know" rồi dừng

**Nên làm**:
1. **Acknowledge honestly**: "I haven't worked with this directly, but..."
2. **Relate to what you know**: "...it's similar to X which I've used. Based on that understanding..."
3. **Reason from first principles**: "...if I think about the problem from scratch, I would approach it by..."
4. **Ask clarifying question**: "Could you give me a hint about which aspect you'd like me to focus on?"

**Ví dụ**: Interviewer hỏi về Raft consensus algorithm mà bạn chưa đọc:
> "I haven't implemented Raft specifically, but I understand it's a consensus protocol. From what I know about distributed consensus — we need leader election, log replication, and safety guarantees. I'd expect Raft handles leader election through term-based voting, and replicates logs from leader to followers with majority acknowledgment. Is this the right direction? Could you help me understand which specific aspect you'd like me to dive deeper into?"

### Negotiation Basics for Vietnam Market

**Salary Expectations — Go Backend Developer (2025-2026 estimates, gross monthly, VND)**

| Level | Zalo/VNG | Grab | Axon | Employment Hero | Microsoft (SG reloc) | Google (SG reloc) |
|-------|---------|------|------|----------------|---------------------|-------------------|
| Junior (1-2y) | 15-25M | 20-35M | 15-25M | 18-30M | N/A | N/A |
| Middle (2-4y) | 25-45M | 35-60M | 25-40M | 30-50M | $4-6K SGD | $5-8K SGD |
| Senior (4-7y) | 40-70M | 55-100M | 40-65M | 50-80M | $6-10K SGD | $8-15K SGD |
| Staff/Lead (7y+) | 70-120M | 90-150M+ | 60-90M | 70-120M | $10-15K SGD | $15-25K SGD |

*Lưu ý: Grab và Google/Microsoft còn có equity (RSU) đáng kể, có thể gấp 1.5-2x base*

**Negotiation Tips:**
1. **Không nói lương hiện tại**: Nói "My expectation is X based on my skills and market rate"
2. **Luôn negotiate**: Offer đầu tiên hiếm khi là max. Negotiate respectfully, có data support
3. **Total compensation**: Đừng chỉ nhìn base salary — hỏi rõ: bonus, equity, benefits, remote policy
4. **Multiple offers**: Nếu có thể, interview nhiều nơi cùng lúc. Competing offer là leverage tốt nhất
5. **Biết market rate**: Dùng Glassdoor, TopDev, ITviec để research trước

### Red Flags — Dấu hiệu nên cảnh giác khi interview

Không chỉ company đánh giá bạn — bạn cũng nên đánh giá company:

| Red Flag | Tại sao | Câu hỏi để verify |
|----------|---------|-------------------|
| Không nói rõ tech stack | Có thể bạn sẽ làm tech cũ, không phải Go | "What % of codebase is in Go? Any plans to migrate?" |
| Interview quá dễ | Đồng nghiệp có thể không strong, hoặc họ đang cần người gấp | "What's the most challenging technical problem your team solved recently?" |
| Không có system design round | Vị trí có thể không phải senior thật | "What level of autonomy do engineers have in design decisions?" |
| Interviewer không biết Go | Go có thể không phải priority | "How many Go services are in production? Who maintains them?" |
| Không đề cập testing | Culture có thể thiếu engineering rigor | "What's your testing strategy? What's the typical test coverage?" |
| Salary discussion quá sớm (vòng 1) | Có thể muốn anchor bạn ở mức thấp | Defer: "I'd prefer to discuss compensation after understanding the role better" |

---

## 8. Interview Day Checklist

### Before Interview — Chuẩn bị

**1 tuần trước:**
- [ ] Confirm thời gian, timezone, platform (Zoom/Meet/Teams)
- [ ] Test camera, microphone, internet connection
- [ ] Setup coding environment: IDE/editor mà bạn quen, Go installed
- [ ] Chuẩn bị 1 trang cheat sheet cá nhân (không dùng trong interview, chỉ review trước)

**1 ngày trước:**
- [ ] Review target company's recent blog posts hoặc product updates
- [ ] Ôn lại 3-5 STAR stories
- [ ] Review top 5 Go concepts bạn hay quên
- [ ] Chuẩn bị 3-5 câu hỏi để hỏi interviewer
- [ ] Ngủ đủ giấc — tối thiểu 7 tiếng

**30 phút trước:**
- [ ] Đóng tất cả notification, app không cần thiết
- [ ] Mở sẵn coding platform, test nếu cần
- [ ] Để nước uống trong tầm tay
- [ ] Chuẩn bị giấy bút (draw diagrams nếu system design)
- [ ] Thở sâu, relax — bạn đã chuẩn bị rồi

### During Interview — Communication Tips

**Coding Round:**
1. **Đọc kỹ đề** (2 phút): Đừng vội code. Repeat lại requirements bằng lời
2. **Clarify** (2-3 phút): Hỏi input constraints, edge cases, expected output format
3. **Approach** (5 phút): Nói ra approach trước khi code. "I'm thinking of using X because Y"
4. **Code** (20-25 phút): Viết clean code, meaningful variable names. Comment nếu logic phức tạp
5. **Test** (5-10 phút): Trace qua 1-2 test cases bằng tay. Check edge cases
6. **Optimize** (if time): Discuss time/space complexity, có cách nào tốt hơn không

**System Design Round:**
1. **Requirements** (5 phút): Functional + Non-functional. Hỏi scale numbers
2. **Estimation** (3-5 phút): QPS, storage, bandwidth
3. **High-level** (10 phút): Draw core components, data flow
4. **API Design** (5 phút): Key endpoints, request/response
5. **Data Model** (5 phút): Database schema, key access patterns
6. **Deep Dive** (15 phút): Interviewer sẽ chọn area để đào sâu — follow their lead
7. **Trade-offs** (5 phút): Bottlenecks, failure scenarios, how to scale further

**General Communication:**
- Nói rõ ràng, không cần nhanh. Pause để suy nghĩ là hoàn toàn OK
- Khi stuck: nói ra bạn đang nghĩ gì, đừng im lặng
- Viết pseudo-code trước nếu algorithm phức tạp
- Nếu interviewer cho hint → take it gracefully, đừng cảm thấy bị đánh giá thấp

### After Interview — Follow-up

- [ ] Gửi thank-you email trong vòng 24h (ngắn, professional)
- [ ] Ghi lại các câu hỏi được hỏi (để review và cải thiện)
- [ ] Note những gì trả lời tốt và chưa tốt
- [ ] Nếu không pass, hỏi feedback (nhiều công ty sẵn sàng share)
- [ ] Reflect và adjust study plan cho lần sau

### Questions to Ask the Interviewer — Câu hỏi nên hỏi ngược

Hỏi ngược thể hiện bạn serious về opportunity và có tư duy. Chuẩn bị 3-5 câu, chọn 2-3 câu phù hợp nhất:

**Về team & engineering culture:**
- "What does a typical day look like for a Go backend engineer on your team?"
- "How does your team handle technical debt? Is there dedicated time for it?"
- "What's the code review process like? How many reviewers per PR?"
- "How do you handle on-call? What's the incident response process?"

**Về technology & architecture:**
- "What's the biggest technical challenge your team is facing right now?"
- "How do you decide when to build vs buy? Any recent examples?"
- "What does your CI/CD pipeline look like? How often do you deploy?"
- "Are there any major architecture migrations planned?"

**Về growth & career:**
- "What does career progression look like for engineers here?"
- "How do you support engineers who want to grow into staff/principal roles?"
- "Is there a learning budget? Conference attendance?"

**Câu hỏi NÊN TRÁNH ở technical rounds:**
- Salary, benefits, vacation (hỏi HR round)
- "Did I get the job?" (awkward, they can't answer)
- Questions dễ tìm trên website (thể hiện bạn chưa research)

---

## Company Comparison Table

| Criteria | Zalo | Grab | Axon | Employment Hero | Microsoft | Google |
|----------|------|------|------|-----------------|-----------|--------|
| **Language** | VN | EN | EN | EN | EN | EN |
| **Rounds** | 2-3 | 3-4 | 2-3 | 2-3 | 4-5 | 5-6 |
| **Algo difficulty** | Medium | Medium-Hard | Easy-Medium | Easy-Medium | Medium-Hard | Hard |
| **System design** | Chat/Messaging | Ride/Payment | Microservices | SaaS/Multi-tenant | Cloud-scale | Google-scale |
| **Go depth** | High | Medium | High | Medium | Low | Very High |
| **Clean code focus** | Low | Medium | Very High | High | Medium | Medium |
| **DB knowledge** | MySQL+Redis | Multi-DB | PostgreSQL | PostgreSQL (deep) | General | Bigtable/Spanner |
| **Behavioral** | Light | Important | Important | Important | Very Important | Important |
| **LeetCode needed** | 50-100 | 150-200 | 30-50 | 30-50 | 150-200 | 300+ |
| **Prep time** | 4-6 weeks | 6-8 weeks | 3-4 weeks | 3-4 weeks | 8-10 weeks | 12-16 weeks |
| **Salary range (Mid)** | 25-45M | 35-60M | 25-40M | 30-50M | $4-6K SGD | $5-8K SGD |
| **Work-life balance** | Variable | Good | Very Good | Good | Very Good | Very Good |
| **Remote** | No (mostly) | Hybrid | Hybrid | Hybrid/Remote | Hybrid | Hybrid |

---

## Final Tips — Lời khuyên cuối

### Mindset
- **Interview là kỹ năng riêng**, khác với coding hàng ngày. Cần practice riêng
- **Rejection là bình thường**: Ngay cả senior engineers cũng fail interviews. Mỗi lần fail là data để improve
- **Không so sánh**: Mỗi người có background khác nhau, đừng so sánh progress với người khác

### Strategy
- **Apply nhiều nơi cùng lúc**: Tăng xác suất success, tạo competing offers, giảm pressure mỗi interview
- **Bắt đầu từ company ít muốn nhất**: Interview đầu tiên là warmup, save dream company cho sau
- **Consistency > Intensity**: 2 tiếng/ngày x 8 tuần hiệu quả hơn 10 tiếng/ngày x 1 tuần

### Technical
- **Viết code bằng tay** (whiteboard hoặc plain text editor): Đừng phụ thuộc autocomplete
- **Practice explaining**: Record bản thân giải bài, nghe lại. Cải thiện cách communicate
- **Build something real**: Side project dùng Go + PostgreSQL + Redis + Docker → material tốt để discuss trong interview
- **Review your own code**: Đọc lại code mình viết 6 tháng trước — bạn sẽ thấy improvement areas

### Common Mistakes to Avoid — Lỗi thường gặp

| Mistake | Tại sao sai | Nên làm |
|---------|------------|---------|
| Nhảy vào code ngay | Interviewer muốn thấy thinking process | Discuss approach trước, get buy-in, rồi code |
| Không hỏi clarification | Có thể giải sai bài hoàn toàn | Luôn hỏi: input range, constraints, expected output |
| Over-engineering system design | Thêm quá nhiều components không cần thiết | Bắt đầu simple, add complexity khi interviewer yêu cầu |
| Bỏ qua edge cases | Thể hiện thiếu attention to detail | Test: empty input, single element, max values, negative |
| Chỉ nói "I used X" | Không show depth | Giải thích WHY: "I chose X over Y because Z" |
| Không test code | Code có bug mà không biết | Dry-run code với 1-2 examples trước khi nói "done" |
| Panic khi stuck | Thể hiện không handle pressure well | Nói: "Let me take a step back and think about this differently" |
| Nói xấu công ty cũ | Huge red flag ở mọi company | Focus vào what you learned, not what was wrong |

### Resources (theo thứ tự ưu tiên)
1. **LeetCode** — Algorithms practice (focus curated lists: Blind 75, Neetcode 150)
2. **"Designing Data-Intensive Applications"** — Martin Kleppmann (system design bible)
3. **"The Go Programming Language"** — Donovan & Kernighan (Go deep dive)
4. **System Design Primer** — github.com/donnemartin/system-design-primer (free)
5. **Go blog** — go.dev/blog (official, covers internals)
6. **Grab Engineering Blog** — engineering.grab.com (real-world architecture)
7. **ByteByteGo** — Alex Xu's System Design Interview books + YouTube
8. **Pramp / interviewing.io** — Mock interviews with real people

### Recommended Practice Timeline by Target Company

Nếu bạn chỉ target 1-2 companies, đây là cách phân bổ thời gian tối ưu:

**Target: Zalo/VNG**
```
Week 1-2: Go concurrency deep dive (40%) + LeetCode medium (30%) + Networking (30%)
Week 3-4: System design - messaging systems (40%) + MySQL/Redis optimization (40%) + LeetCode (20%)
Week 5-6: Mock interviews + review weak areas + read Zalo tech sharing (if available)
```

**Target: Grab**
```
Week 1-3: LeetCode grind — 100 problems minimum (50%)  + Go review (25%) + System design reading (25%)
Week 4-6: System design practice (40%) + Kafka/distributed systems (30%) + Behavioral prep (30%)
Week 7-8: Mock interviews (all types) + Grab blog reading + company-specific prep
```

**Target: Axon / Employment Hero**
```
Week 1-2: Go language deep dive (40%) + Clean architecture study (30%) + Testing practices (30%)
Week 3-4: Database deep dive (40%) + Design patterns (30%) + LeetCode easy-medium (30%)
Week 5-6: Build mini project with TDD + clean architecture + mock interviews
```

**Target: Microsoft / Google**
```
Week 1-4: LeetCode intensive — 150+ problems (60%) + DS&A theory (20%) + Go review (20%)
Week 5-8: System design (40%) + Advanced algorithms (30%) + Behavioral STAR prep (30%)
Week 9-12: Mock interviews (3+ per week) + weak area review + company-specific research
Week 13+: (Google only) Hard problems + distributed systems papers + Go internals deep dive
```

---

> **Ghi nhớ**: Không ai ready 100% cho mọi câu hỏi. Mục tiêu là cover 80% topics ở mức solid, và biết cách approach 20% còn lại bằng first principles. Interviewer không tìm người biết mọi thứ — họ tìm người có thể learn và solve problems effectively.
>
> Chúc bạn phỏng vấn thành công!
