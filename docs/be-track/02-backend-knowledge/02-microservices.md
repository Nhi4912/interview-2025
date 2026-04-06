# Microservices Architecture - Deep Theory

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [API Design](./01-api-design.md)
> **See also**: [Table of Contents](../../00-table-of-contents.md) | [Message Queues (Shared)](../../shared/02-system-design/05-message-queues.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Tiki.vn, 2019:** Monolith Rails app, 50+ developers, mỗi deploy phải release toàn bộ app — 1 bug trong Payment block cả team Catalog deploy. Black Friday traffic: chỉ cần scale Checkout service nhưng phải scale toàn bộ monolith. Quyết định: tách dần sang microservices theo **Strangler Fig pattern** — wrapping từng module trong API, không rewrite từ đầu.

**Thực tế:** Microservices không phải "silver bullet". Amazon, Netflix phải build years of infrastructure (service mesh, distributed tracing, circuit breakers) trước khi benefit vượt cost. Interviewer hỏi để biết bạn hiểu trade-off, không phải để bạn ca ngợi microservices.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Monolith giống **một siêu thị lớn** — tất cả phòng ban trong cùng toà nhà, dễ quản lý khi nhỏ, nhưng khi mở rộng thì tắc nghẽn ở tất cả phòng khi chỉ 1 phòng đông. Microservices giống **khu mua sắm (mall)** — mỗi cửa hàng độc lập, tự quyết giờ mở cửa, tự scale nhân viên — nhưng cần parking lot, bảo vệ, wifi chung (infra overhead).

**Why the decision matters:** Rule of thumb (Martin Fowler): _"Don't start with microservices. When the monolith becomes painful to change, migrate — not before."_ Premature microservices thêm distributed systems complexity (network failures, eventual consistency) khi team chưa ready.

## Concept Map / Bản Đồ Khái Niệm

```
[Monolith] ──growth──► [Modular Monolith] ──pain──► [Microservices]
                                                           │
                    ┌──────────────────────────────────────┤
                    │                                      │
              [Communication]                    [Data Management]
              ├── Sync: REST/gRPC                ├── Database-per-service
              └── Async: Kafka/RabbitMQ          └── Saga pattern (distributed tx)
                    │
              [Reliability Patterns]
              ├── Circuit Breaker (Hystrix/resilience4j)
              ├── Retry with backoff
              └── Bulkhead (isolate failures)
                    │
              [Observability]
              ├── Distributed Tracing (Jaeger/Zipkin)
              ├── Centralized Logging (ELK)
              └── Metrics (Prometheus/Grafana)
```

---

## Overview / Tổng Quan

File này cover toàn bộ Microservices Architecture theory — từ khi nào nên tách monolith, cách decompose services, communication patterns, distributed transactions, đến observability và deployment.

| #   | Core Concept                   | Vai trò                                                 | Interview Weight |
| --- | ------------------------------ | ------------------------------------------------------- | ---------------- |
| 1   | **Architecture Patterns**      | Monolith → Modular → Microservices — khi nào chuyển     | ⭐⭐⭐⭐⭐       |
| 2   | **Service Decomposition**      | DDD, Bounded Context, Strangler Fig — cách tách         | ⭐⭐⭐⭐         |
| 3   | **Communication Patterns**     | Sync/Async, Choreography/Orchestration — cách giao tiếp | ⭐⭐⭐⭐⭐       |
| 4   | **Distributed Transactions**   | Saga, Outbox/CDC — consistency without 2PC              | ⭐⭐⭐⭐⭐       |
| 5   | **Event-Driven Architecture**  | Event Sourcing, CQRS — async data flow                  | ⭐⭐⭐⭐         |
| 6   | **Resilience Patterns**        | Circuit Breaker, Retry, Bulkhead — fault tolerance      | ⭐⭐⭐⭐⭐       |
| 7   | **Observability & Operations** | Three Pillars, Service Mesh, 12-Factor, Deployment      | ⭐⭐⭐⭐         |

**Mối quan hệ:** Architecture decision → Decomposition → Communication → Transaction management → Event-driven for async → Resilience against failures → Observability to debug distributed systems.

---

## Core Concepts — Deep Analysis / Phân Tích Sâu

### Concept 1: Architecture Patterns (Monolith → Microservices)

> 🧠 **Memory Hook:** "Mall vs Supermarket" — Monolith = siêu thị (tất cả trong 1 toà nhà), Microservices = mall (mỗi cửa hàng độc lập, cần parking + security chung).

**Tại sao tồn tại? / Why does this exist?**

Monolith chậm deploy khi team lớn — 50 devs, 1 deploy block tất cả
→ **Why?** Independent scaling impossible — chỉ cần scale Checkout nhưng phải scale toàn bộ monolith, lãng phí tài nguyên
→ **Why?** Conway's Law — org structure maps to system architecture. Khi team grows beyond 2-pizza (8 người), communication overhead forces architectural split. Microservices align service boundaries with team boundaries.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bạn đang vận hành một siêu thị lớn kiểu Vinmart. Mọi khu vực — rau củ, hải sản, quần áo, điện tử — đều nằm trong cùng một toà nhà, dùng chung kho hàng và hệ thống tính tiền. Khi hệ thống điện của khu hải sản bị sự cố, toàn bộ siêu thị phải đóng cửa. Ngược lại, một trung tâm thương mại (Vincom) gồm nhiều cửa hàng độc lập — nếu cửa hàng giày bị cháy, các cửa hàng khác vẫn mở cửa bình thường. Microservices cũng vậy: mỗi "cửa hàng" (service) tự deploy, tự scale, tự quyết công nghệ — nhưng cần "ban quản lý trung tâm" (infra: CI/CD, tracing, service mesh) để vận hành trơn tru.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Kiến trúc phần mềm tiến hóa theo 3 giai đoạn dựa trên quy mô team và domain complexity:

1. **Monolith**: Toàn bộ code trong 1 codebase, 1 deploy unit, 1 database. Phù hợp khi team ≤ 10 người.
2. **Modular Monolith**: Vẫn 1 codebase nhưng enforce module boundaries nghiêm ngặt qua interfaces. Middle ground tuyệt vời.
3. **Microservices**: Tách thành services độc lập, mỗi service có DB riêng, deploy riêng, team riêng.

```
Team Size & Complexity Growth
         │
  Small  ├──[Monolith]────────────────────────────────
  (<10)  │   • 1 codebase, 1 DB, 1 deploy unit
         │   • Fast startup, simple local debugging
         │   • Risk: coupling grows as team scales
         │
  Medium ├──[Modular Monolith]──────────────────────
  (10-30)│   • 1 codebase, enforced module APIs
         │   • Modules communicate via interfaces
         │   • Can extract to service when ready
         │
  Large  └──[Microservices]──────────────────────────
  (30+)      • N services, N DBs, N CI/CD pipelines
             • Requires: distributed tracing + mesh
             • Team owns service end-to-end
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Conway's Law backfire**: Nếu team structure không match service boundaries → "distributed monolith": tách service nhưng vẫn deploy cùng nhau vì business logic vẫn coupled
- **Domain instability trap**: Nếu business thay đổi liên tục, wrong boundaries cực tốn kém khi refactor — phải di chuyển data, thay đổi API contracts của nhiều consumers cùng lúc
- **Startup overhead**: 90% startups không cần microservices trong 2 năm đầu — latency, eventual consistency, và infra overhead > benefit khi scale nhỏ
- **Nano-service hell**: Chia quá nhỏ → operational overhead lớn hơn business value → khó trace lỗi, khó onboard developer mới

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                   | Tại sao sai                                                                             | Đúng là                                                                        |
| ----------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Bắt đầu dự án mới bằng microservices ngay | Chưa hiểu domain, service boundaries sai → cực kỳ tốn kém khi refactor sau này          | Monolith/Modular Monolith trước, migrate khi domain ổn định và có lý do cụ thể |
| Tách services nhưng share database        | Distributed monolith — worst of both worlds: distributed complexity + monolith coupling | Database-per-service, giao tiếp qua API, không truy cập DB của service khác    |
| Migrate mà chưa có tracing và CI/CD       | Không thể debug failures trong distributed system, không thể deploy reliably            | Đầu tư observability + automated CI/CD pipeline trước khi bắt đầu migrate      |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Monolith vs Microservices? Khi nào nên chuyển?"
- → Nhớ đến: Trade-offs cả hai, Monolith First (Martin Fowler), Conway's Law, distributed systems cost
- → Mở đầu trả lời: _"Microservices không phải silver bullet — tôi sẽ phân tích trade-offs và khi nào thực sự nên chuyển dựa trên team size, domain clarity và DevOps maturity..."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [API Design](./01-api-design.md) — REST/gRPC là nền tảng giao tiếp giữa các services
- ➡️ Để hiểu tiếp: [Distributed Systems](./03-distributed-systems.md) — CAP theorem và consistency challenges trong hệ phân tán

---

### Concept 2: Service Decomposition

> 🧠 **Memory Hook:** DDD Bounded Context = "Biên giới quốc gia" — mỗi context có "ngôn ngữ" riêng (ubiquitous language), "luật" riêng (business rules), không shared database.

**Tại sao tồn tại? / Why does this exist?**

Cần criteria rõ ràng để quyết định service boundaries — không thể split ngẫu nhiên theo trực giác
→ **Why?** Wrong boundaries → tight coupling → sửa 1 feature phải deploy 5 services → tệ hơn monolith
→ **Why?** DDD cung cấp domain-driven approach: identify bounded contexts từ business domains, không phải từ technical layers. Strangler Fig cho phép migrate dần mà không cần Big Bang rewrite — wrap legacy bằng API rồi route traffic dần dần.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến cách Việt Nam được chia thành các tỉnh, thành phố. Tỉnh Đà Lạt có "ngôn ngữ" riêng về du lịch (homestay, trekking, cà phê vườn), tỉnh Vũng Tàu có "ngôn ngữ" riêng về dầu khí (offshore, platform, refinery). Từ "khách hàng" trong context du lịch Đà Lạt là người đặt tour, còn trong context dầu khí Vũng Tàu là doanh nghiệp ký hợp đồng khai thác. Bounded Context trong DDD cũng vậy — cùng từ "Product" nhưng ý nghĩa hoàn toàn khác trong Catalog service (thông tin mô tả) vs Inventory service (số lượng tồn kho). Mỗi bounded context có domain model riêng, không mix chung.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Quy trình xác định service boundaries theo DDD gồm 4 bước:

1. **Event Storming**: Workshop với domain experts, dán sticky notes cho domain events trên timeline
2. **Identify Bounded Contexts**: Tìm điểm ngôn ngữ thay đổi → ranh giới context
3. **Evaluate Coupling**: High cohesion + Low coupling = good boundary
4. **Apply Strangler Fig**: Wrap từng module bằng API facade, route traffic dần dần

```
Event Storming → Service Boundaries

Domain Events (orange):
[UserRegistered]──[OrderPlaced]──[PaymentProcessed]──[ItemShipped]
       │                │                │                  │
   User BC          Order BC        Payment BC         Shipping BC
       │                │                │                  │
  [User Svc]       [Order Svc]     [Payment Svc]      [Ship Svc]
  own: users DB    own: orders DB  own: payments DB   own: ship DB

Context Mapping (relationships):
  User Svc ──[published event]──► Order Svc
  Order Svc ──[command]──────────► Payment Svc
  Payment Svc ──[event]──────────► Order Svc (confirm/reject)
  Order Svc ──[event]────────────► Shipping Svc
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Technical layer trap**: Nếu chia theo UserController/UserService/UserRepo thay vì business domain → tất cả services phải deploy cùng nhau khi sửa 1 user feature
- **Boundary too fine**: Service chỉ có 1-2 API endpoints → network overhead > business logic, team phải maintain 50+ repos
- **Shared kernel risk**: Khi 2 bounded contexts share common domain model → coupling dần dần, thay đổi shared model ảnh hưởng cả hai
- **Strangler Fig timing**: Extract sai thứ tự → service mới phụ thuộc vào code trong monolith chưa được extract → circular dependency

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                  | Tại sao sai                                                               | Đúng là                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Decompose theo technical layer (Controller/Service/Repo) | Tất cả layers cho 1 feature nằm ở 3 services khác nhau → deploy coupling  | Decompose theo business domain (Order, Payment, Inventory)           |
| Tạo nano-services quá nhỏ                                | Network overhead + operational cost > business value, khó onboard dev mới | Mỗi service nên có đủ business logic để justify operational cost     |
| Không có Anti-Corruption Layer khi Strangler Fig         | Old system data model "nhiễm" vào new service → coupling tái xuất hiện    | Tạo ACL layer để translate giữa old domain model và new domain model |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Làm sao tách monolith? Xác định service boundaries thế nào?"
- → Nhớ đến: DDD Bounded Context, Event Storming, Strangler Fig Pattern, Anti-Corruption Layer
- → Mở đầu trả lời: _"Tôi sẽ dùng DDD để xác định bounded contexts từ business domain, sau đó áp dụng Strangler Fig để migrate từng phần mà không cần rewrite toàn bộ..."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [API Design](./01-api-design.md) — API contracts giữa services là biên giới của bounded contexts
- ➡️ Để hiểu tiếp: [Distributed Systems](./03-distributed-systems.md) — sau khi tách services, cần hiểu consistency challenges

---

### Concept 3: Communication Patterns

> 🧠 **Memory Hook:** Sync = "Gọi điện thoại" (đợi trả lời), Async = "Gửi email" (gửi xong làm việc khác). Choreography = "Jazz band" (mỗi nhạc cụ tự phối), Orchestration = "Orchestra" (conductor điều khiển).

**Tại sao tồn tại? / Why does this exist?**

Microservices communicate qua network → cần patterns đảm bảo reliability và decoupling giữa các services
→ **Why?** Sync coupling tạo cascade failures — Service A → B → C, C down = toàn bộ chain down. Async decouples qua message broker → sender tiếp tục làm việc ngay.
→ **Why?** Choreography scales tốt hơn (không có central coordinator) nhưng harder to debug khi flow phức tạp. Orchestration dễ hiểu hơn nhưng có single point of failure. Real systems dùng hybrid: sync cho queries, async cho commands/events.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng bạn đặt một bữa tiệc tất niên. Cách sync: bạn gọi điện cho từng người — Linh làm MC, Tuấn mua bánh, Hương đặt nhà hàng — và chờ từng người xác nhận trước khi gọi người tiếp theo. Nếu Tuấn không nghe máy, bạn bị kẹt. Cách async: bạn gửi group chat một tin nhắn duy nhất, mọi người tự đọc và xử lý theo lịch trình — bạn không cần chờ. Choreography giống nhóm bạn thân tự phân công nhau không cần ai chỉ đạo. Orchestration giống bạn đứng ra làm "trưởng ban tổ chức" điều phối từng bước: "Tuấn mua bánh xong rồi báo Hương đặt bàn nhé."

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Hai paradigm communication chính, mỗi cái phù hợp với use case khác nhau:

1. **Sync (REST/gRPC)**: Caller chờ response → tight temporal coupling, nhưng immediate feedback
2. **Async (Message Queue)**: Caller gửi message vào broker rồi tiếp tục → loose coupling, resilient
3. **Choreography**: Services react to events độc lập, không có central coordinator
4. **Orchestration**: Một coordinator service điều phối toàn bộ workflow

```
Sync Call (REST/gRPC):
Service A ──────request─────► Service B
    │        (blocked/waiting)      │
    │ ◄───────response──────────────│
    ▼ (continues after response)

Async Call (Message Broker):
Service A ──publish──► [Kafka/RabbitMQ] ──deliver──► Service B
    │       (returns immediately)              (processes when ready)
    ▼ (continues without waiting)

Choreography:
  OrderSvc ──"OrderCreated"──► Bus ──► PaymentSvc
                                  ──► InventorySvc
  PaymentSvc ──"PaymentDone"──► Bus ──► ShippingSvc

Orchestration:
  Coordinator ──1.Validate──► OrderSvc
               ──2.Charge───► PaymentSvc
               ──3.Reserve──► InventorySvc
               ──4.Ship─────► ShippingSvc
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Async idempotency**: Message broker có thể deliver cùng message nhiều lần (at-least-once delivery) → consumer phải idempotent, dùng idempotency key để deduplicate
- **Choreography spaghetti**: Khi flow có 7+ services, rất khó trace "OrderCreated" trigger gì, và gì trigger gì tiếp theo → cần distributed tracing bắt buộc
- **Orchestrator SPOF**: Nếu orchestrator service crash giữa chừng → cần persistent state (Temporal, AWS Step Functions) để resume từ điểm cuối cùng
- **Mixed pattern complexity**: Hybrid sync+async làm khó hiểu overall data flow — cần document rõ which calls are sync và which are async

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                       | Đúng là                                                                               |
| -------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Dùng sync cho tất cả communications          | Cascade failures: 1 service slow/down kéo theo toàn bộ chain      | Sync cho queries cần immediate response, async cho commands và events                 |
| Dùng async cho tất cả communications         | Khó debug, eventual consistency ở mọi nơi, khó guarantee ordering | Hybrid: sync khi cần immediate feedback (payment), async khi không cần (notification) |
| Choreography mà không có distributed tracing | Impossible to follow event flow qua nhiều services khi có bug     | Setup distributed tracing (Jaeger/Tempo) trước khi dùng choreography                  |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Sync vs Async? Choreography vs Orchestration?"
- → Nhớ đến: Cascade failure risk của sync, decoupling benefit của async, debug complexity của choreography
- → Mở đầu trả lời: _"Tôi sẽ phân tích trade-offs: sync phù hợp khi cần immediate response như payment validation, async phù hợp khi có thể tolerate delay như email notification..."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [API Design](./01-api-design.md) — REST/gRPC protocols là building blocks của sync communication
- ➡️ Để hiểu tiếp: [Message Queues](./08-message-queues.md) — Kafka/RabbitMQ internals cho async communication patterns

---

### Concept 4: Distributed Transactions (Saga Pattern)

> 🧠 **Memory Hook:** Saga = "Du lịch theo tour" — mỗi stop (service) xử lý riêng, nếu 1 stop cancel → compensating actions (refund) cho tất cả stops trước đó.

**Tại sao tồn tại? / Why does this exist?**

Microservices có database-per-service → không thể dùng single ACID transaction cross services
→ **Why?** 2PC (Two-Phase Commit) blocks resources trong toàn bộ quá trình → latency cao và coordinator failure làm tất cả participants bị stuck indefinitely
→ **Why?** Saga trades strong consistency cho availability (CAP theorem): mỗi service thực hiện local transaction + publishes event → service tiếp theo continues hoặc compensates. Transactional Outbox + CDC đảm bảo reliable event publishing mà không có dual-write problem.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến quy trình đặt tour du lịch Đà Nẵng - Hội An - Huế. Bạn cần book vé máy bay (bước 1), đặt khách sạn ở 3 nơi (bước 2-4), và thuê xe (bước 5) — mỗi bước là một "transaction" với một nhà cung cấp khác nhau. Nếu đến bước 4 khách sạn Huế báo hết phòng, bạn không thể "rollback database" — thay vào đó bạn phải gọi điện hủy vé máy bay, hủy 2 khách sạn đã đặt, và hủy xe. Đây chính xác là Saga: chuỗi local transactions với compensating transactions để "undo" khi có lỗi — không phải database rollback, mà là business actions ngược lại.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Saga là chuỗi local transactions, mỗi bước xử lý trong 1 service và publish event cho bước tiếp theo. Khi fail → compensating transactions được kích hoạt ngược lại:

1. **Happy Path**: T1 → event → T2 → event → T3 → ... → Tn
2. **Failure Path**: T1 → T2 → T3 fails → C2 (compensate T2) → C1 (compensate T1)
3. **Choreography**: Events truyền tự động giữa services qua message broker
4. **Orchestration**: Một Saga orchestrator điều khiển toàn bộ flow và compensations

```
Choreography Saga — Happy Path:
OrderSvc       PaymentSvc      InventorySvc    ShippingSvc
    │               │               │               │
    ├─"OrderCreated"►│               │               │
    │               ├─"PaymentDone"─►│               │
    │               │               ├─"StockReserved"►│
    │               │               │               │ ship()
    │◄──────────────────────"OrderShipped"───────────│

Choreography Saga — Compensation:
OrderSvc       PaymentSvc      InventorySvc
    │               │               │
    ├─"OrderCreated"►│               │
    │               ├─"PaymentDone"─►│
    │               │               │ FAILS!
    │               │◄─"StockFailed"─│
    │               │ refund()        │
    │◄─"PaymentRefunded"             │
    │ cancel()                        │
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Compensating transaction failures**: Compensating transaction cũng có thể fail → cần retry logic và idempotency trên compensation operations
- **Saga timeout**: Nếu một step không respond, orchestrator cần timeout policy — cancel toàn bộ hay chờ thêm?
- **Concurrent sagas**: Hai sagas song song cùng modify inventory → race condition → cần optimistic locking hoặc reservation pattern
- **Strong consistency domains**: Payments thực tế vẫn cần eventual consistency được thiết kế cẩn thận, không phải tùy tiện — cần idempotency keys để tránh double charge

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                               | Tại sao sai                                                                                                        | Đúng là                                                                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Quên implement compensating transactions cho mỗi step | Khi có failure, không thể undo → data inconsistency vĩnh viễn                                                      | Thiết kế compensating transaction ngay khi thiết kế forward transaction                                        |
| Assume Saga phù hợp cho tất cả cases                  | Payments và financial transfers cần được thiết kế với idempotency keys, không thể dùng eventual consistency sơ sài | Phân tích từng domain: financial = design carefully with idempotency, catalog update = eventual consistency OK |
| Dual-write: write DB và publish event riêng lẻ        | Nếu event publish fail sau khi DB commit → inconsistency; nếu DB fail sau khi event publish → ghost events         | Dùng Transactional Outbox pattern: ghi event vào cùng DB transaction, relay process publish sau                |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Distributed transactions? Làm sao đảm bảo consistency across services?"
- → Nhớ đến: 2PC limitations, Saga (choreography vs orchestration), compensating transactions, Outbox/CDC
- → Mở đầu trả lời: _"Trong microservices, chúng ta không dùng 2PC vì nó blocking và có coordinator SPOF. Thay vào đó tôi dùng Saga pattern với compensating transactions..."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Distributed Systems](./03-distributed-systems.md) — CAP theorem và eventual consistency fundamentals
- ➡️ Để hiểu tiếp: [Message Queues](./08-message-queues.md) — Kafka/RabbitMQ làm backbone cho Saga choreography

---

### Concept 5: Event-Driven Architecture

> 🧠 **Memory Hook:** Event Sourcing = "Sổ kế toán" — không sửa balance trực tiếp, ghi mọi giao dịch (event), replay để tính balance hiện tại. CQRS = "2 cửa sổ ngân hàng" — 1 cửa gửi tiền (write), 1 cửa check balance (read).

**Tại sao tồn tại? / Why does this exist?**

Traditional CRUD mất lịch sử — chỉ biết current state, không biết làm sao đến trạng thái đó, không audit trail
→ **Why?** Event Sourcing cung cấp complete audit trail + time travel (rebuild state tại bất kỳ thời điểm). CQRS tách read/write models → optimize mỗi model độc lập.
→ **Why?** Ở quy mô lớn, read và write patterns khác nhau đáng kể (read 100x nhiều hơn write). CQRS + Event Sourcing cho phép dùng storage khác nhau per model (write: event store, read: denormalized DB). Nhưng thêm complexity đáng kể — chỉ worth it cho specific domains (financial, audit-heavy).

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ về sổ kế toán của một tiệm tạp hóa. Cách CRUD truyền thống: mỗi lần có giao dịch, kế toán xóa số cũ và ghi số mới vào ô "Tồn kho: 50". Cuối ngày, nếu sếp hỏi "Tại sao chỉ còn 50 thùng?" — không ai biết. Cách Event Sourcing: kế toán ghi từng dòng — "Nhập 100 thùng lúc 8:00", "Bán 30 thùng lúc 10:00", "Bán 20 thùng lúc 14:00". Muốn biết tồn kho? Cộng lại. Muốn biết tại sao giảm? Đọc lịch sử. CQRS thêm vào đó hai "quầy" riêng — quầy nhập hàng (write) và quầy tra cứu (read, có thể dùng bảng tóm tắt riêng cho nhanh).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Event Sourcing lưu state dưới dạng immutable event log. Để đọc current state, chạy projection function qua toàn bộ events:

1. **Write**: Append event vào event store (immutable log)
2. **Read**: Projection function replay events → build materialized view
3. **Snapshot**: Sau N events, lưu snapshot để tăng tốc replay
4. **CQRS**: Write side dùng event store, Read side dùng optimized read DB

```
Event Sourcing Flow:

Write Side:                      Read Side:
Command ──► Aggregate           Event Store ──replay──► Projection
             │                      │                        │
             ▼                      │                        ▼
         Validate ─────────────────►│               Read Model (DB)
             │          events       │               (denormalized,
             ▼                       │               optimized for
         Event Store                 │               query patterns)
    ┌────────────────┐               │
    │ OrderCreated   │◄──────────────┘
    │ ItemAdded      │
    │ PaymentDone    │
    │ OrderShipped   │
    └────────────────┘
         (immutable log)

Snapshot Optimization:
Events 1-1000 → Snapshot(state@1000) → Events 1001-1200
Replay = load snapshot + apply events 1001-1200 (not 1-1200)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Schema evolution**: Event schema thay đổi sau khi events đã được lưu → cần event upcasting (transform old event format sang new format khi replay)
- **Projection lag**: Read model có delay so với write model → queries trả về stale data → UI cần xử lý eventual consistency gracefully
- **Event store size**: Aggregates tồn tại lâu (e.g., user account 10 năm) → replay từ đầu rất chậm → cần snapshot strategy
- **Không phải domain nào cũng cần**: Shopping cart đơn giản không cần audit trail → Event Sourcing over-engineering, thêm complexity không cần thiết

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                               | Tại sao sai                                                                         | Đúng là                                                                                    |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Áp dụng Event Sourcing cho toàn bộ hệ thống           | Complexity cao hơn CRUD đáng kể, team cần mindset shift hoàn toàn                   | Chỉ dùng cho domains thực sự cần audit trail hoặc temporal queries (financial, healthcare) |
| CQRS mà không understand eventual consistency         | Read model lag behind write model → user thấy stale data sau khi update             | Design UI với eventual consistency: "Thay đổi sẽ phản ánh sau vài giây"                    |
| Nhầm lẫn Event-Driven Architecture với Event Sourcing | EDA = communication pattern giữa services; ES = persistence pattern trong 1 service | EDA và ES là hai concepts độc lập, có thể dùng một hoặc cả hai                             |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Event Sourcing? CQRS? Event-Driven Architecture?"
- → Nhớ đến: 3 concepts khác nhau (EDA=communication, ES=persistence, CQRS=read/write separation), khi nào combine, khi nào KHÔNG nên dùng
- → Mở đầu trả lời: _"Ba concepts này thường bị nhầm lẫn nhưng hoàn toàn độc lập. Event Sourcing là persistence pattern, CQRS là architecture pattern, Event-Driven là communication pattern..."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Distributed Systems](./03-distributed-systems.md) — CAP theorem và eventual consistency là prerequisite
- ➡️ Để hiểu tiếp: [Message Queues](./08-message-queues.md) — Kafka làm event store và event bus cho Event-Driven Architecture

---

### Concept 6: Resilience Patterns

> 🧠 **Memory Hook:** Circuit Breaker = "Cầu dao điện" — quá tải thì ngắt (Open), chờ nguội thì thử lại (Half-Open), ổn thì đóng lại (Closed). Bulkhead = "Vách ngăn tàu" — 1 khoang ngập không chìm cả tàu.

**Tại sao tồn tại? / Why does this exist?**

Distributed systems = network failures là normal, không phải exception — cần chuẩn bị sẵn sàng
→ **Why?** Không có resilience patterns, 1 failing service cascades đến toàn bộ dependent services → total system failure (cascade failure)
→ **Why?** Ngăn cascade failure cần nhiều lớp bảo vệ: Circuit Breaker (dừng gọi service đang fail) + Retry với exponential backoff + jitter (tránh thundering herd) + Bulkhead (isolate failure domain) + Timeout (không chờ mãi) + Fallback (degrade gracefully thay vì lỗi hoàn toàn).

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến hệ thống điện trong một toà nhà chung cư. Cầu dao điện (Circuit Breaker) tự ngắt khi phát hiện quá tải — bảo vệ toàn bộ hệ thống khỏi cháy. Sau khi thợ điện sửa xong, bạn đóng cầu dao thử lại. Vách ngăn (Bulkhead) trong tàu thủy ngăn nước từ 1 khoang bị thủng không chảy sang khoang khác. Retry with backoff giống như khi nhắn tin cho người yêu không trả lời — bạn chờ 1 phút, rồi 2 phút, rồi 5 phút — không nhắn liên tục mỗi giây (đó là thundering herd). Fallback giống như backup generator khi mất điện — không phải chức năng đầy đủ, nhưng đủ để tiếp tục hoạt động cơ bản.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Circuit Breaker hoạt động như state machine với 3 states, tự động chuyển trạng thái dựa trên failure metrics:

1. **CLOSED**: Normal operation, count failures trong sliding window
2. **OPEN**: Reject all requests fast (không gọi downstream), timer chạy
3. **HALF-OPEN**: Cho phép một số test requests qua để kiểm tra recovery

```
Circuit Breaker State Machine:

┌──────────────┐  failure_rate > threshold  ┌──────────────┐
│              │──────────────────────────►│              │
│    CLOSED    │                            │     OPEN     │
│  (normal)    │◄──────────────────────────│  (reject all)│
│              │    success in half-open    │              │
└──────────────┘                            └──────┬───────┘
       ▲                                           │
       │                               timeout expires
       │                                           │
       │                                    ┌──────▼───────┐
       └────────────────────────────────────│  HALF-OPEN   │
                  success                   │ (test probes)│
                                            └──────────────┘
                                               │ failure
                                               ▼
                                          back to OPEN

Retry + Jitter Formula:
  base_delay = min(cap, base * 2^attempt)
  actual_delay = base_delay + random(0, base_delay * 0.3)

  attempt=0: 1s + jitter
  attempt=1: 2s + jitter
  attempt=2: 4s + jitter   ← spread out retries
  attempt=3: 8s + jitter
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Threshold tuning**: Circuit breaker quá sensitive (low threshold) → trips on transient errors, giảm availability; quá tolerant → cascade failure xảy ra trước khi trip
- **Thundering herd after recovery**: Nếu không có jitter, khi service recover → tất cả clients retry cùng lúc → service quá tải ngay lập tức → trip lại
- **Bulkhead resource sizing**: Thread pool cho ServiceA quá nhỏ → legitimate traffic bị reject; quá lớn → không isolate được failure
- **Fallback data staleness**: Cache fallback trả về stale data → user thấy cũ, nhưng tốt hơn 500 error. Cần communicate clearly về data freshness.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                 | Tại sao sai                                                                               | Đúng là                                                                   |
| --------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Retry mà không có exponential backoff   | Retry ngay lập tức liên tục → overwhelm service đang cố recover                           | Retry với exponential backoff: 1s → 2s → 4s → 8s (max 30s)                |
| Retry với backoff nhưng không có jitter | Tất cả instances retry cùng lúc (thundering herd) → service quá tải đúng lúc đang recover | Thêm random jitter vào mỗi backoff interval để spread out retries         |
| Không có fallback khi circuit open      | User nhận 500 Internal Error thay vì degraded experience                                  | Implement fallback: cached response, default value, hoặc partial response |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Service B đang fail, làm sao ngăn cascade failure? Hệ thống resilient thế nào?"
- → Nhớ đến: Circuit Breaker states, Retry with backoff + jitter, Bulkhead isolation, Fallback, Timeout propagation
- → Mở đầu trả lời: _"Tôi sẽ áp dụng multiple layers of resilience: Circuit Breaker để fail fast khi Service B down, Retry với exponential backoff + jitter khi có transient errors, Bulkhead để isolate failures..."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Distributed Systems](./03-distributed-systems.md) — failure modes trong distributed systems
- ➡️ Để hiểu tiếp: [Resilience Patterns](./07-resilience-patterns.md) — Circuit Breaker, Retry, Bulkhead deep dive với implementation

---

### Concept 7: Observability & Operations

> 🧠 **Memory Hook:** Three Pillars = "3 giác quan của bác sĩ" — Logs (bệnh nhân kể triệu chứng), Metrics (đo nhiệt độ/huyết áp), Traces (chụp X-ray theo dõi request qua từng organ/service).

**Tại sao tồn tại? / Why does this exist?**

Distributed systems = một request đi qua 10+ services → impossible to debug mà không có tracing
→ **Why?** Ba trụ cột bổ sung lẫn nhau: Metrics phát hiện anomalies → Traces xác định service nào bị lỗi → Logs hiển thị exact error. Thiếu 1 trong 3, debugging distributed systems là guesswork.
→ **Why?** SLI/SLO/SLA tạo feedback loop: define acceptable performance → measure → alert khi budget burning → prioritize reliability work. Service Mesh (Istio/Linkerd) thêm observability ở infrastructure layer mà không cần code changes.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bác sĩ khám bệnh nhân bị đau bụng. Logs giống bệnh nhân tường thuật: "Tôi ăn hải sản tối qua, sau đó đau bụng lúc 11 giờ đêm, đau quặn ở vùng bụng dưới bên phải." Metrics giống kết quả đo lường: nhiệt độ 38.5°C, huyết áp 130/90, bạch cầu 12.000. Distributed Tracing giống chụp CT scan — bác sĩ theo dõi từng "organ" (service) mà cơn đau đi qua, xem chính xác điểm nào bị tắc nghẽn và mất bao lâu. Thiếu 1 trong 3, bác sĩ rất khó chẩn đoán — và trong microservices, "bệnh nhân" của bạn là một request đi qua API Gateway → Order Svc → Payment Svc → Inventory Svc.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Ba trụ cột hoạt động cùng nhau qua correlation ID (trace ID) để có full observability:

1. **Metrics**: Prometheus scrape metrics từ services → Grafana visualize → Alert khi threshold breach
2. **Logs**: Services write structured JSON logs → Collector (Fluentd/Vector) → Elasticsearch/Loki → Kibana/Grafana
3. **Traces**: OpenTelemetry instrument code → Jaeger/Tempo store spans → Visualize request journey

```
Request Flow & Observability Correlation:

Client ──► API GW ──► Order Svc ──► Payment Svc ──► Inventory Svc
  │           │            │               │                │
  │     trace_id:abc123    │               │                │
  │           │            │               │                │
  ▼           ▼            ▼               ▼                ▼
[Metrics]  latency=250ms  cpu=40%    latency=80ms       latency=40ms
[Logs]     "req start"  "order OK"  "charge $50"      "stock -1"
[Traces]   span:0-250ms span:10-200ms span:50-130ms   span:140-180ms

Trace Waterfall (Jaeger view):
API GW       [═══════════════════════════ 250ms ══════════════]
  Order Svc    [══════════════════ 200ms ═══════════]
    Payment Svc   [════════ 80ms ════]
      Bank API        [══ 50ms ══]
    Inventory Svc              [════ 40ms ════]

Alert Pipeline:
Prometheus ──► AlertManager ──► PagerDuty/Slack
  (SLO breach: p99 latency > 500ms → fire alert)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Async trace propagation**: Khi request đi qua Kafka message → trace context phải được nhúng vào message headers để trace không bị "đứt"
- **Cardinality explosion**: Nếu dùng user_id làm Prometheus label → hàng triệu label → OOM. Labels phải có low cardinality (status_code, service_name, method)
- **Log volume cost**: Structured logging với DEBUG level ở production → log volume khổng lồ → storage cost cao. Production nên dùng INFO+, bật DEBUG chỉ khi troubleshoot
- **100% SLO là sai**: Ngay cả Google target 99.99% (52 phút downtime/năm). 100% SLO loại bỏ error budget → không thể deploy, không thể experiment

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                            | Tại sao sai                                                                       | Đúng là                                                                          |
| -------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Chỉ có logging, không có metrics hoặc tracing      | "Log searching" thay vì observability — tìm kim trong đống cỏ khô khi có incident | Setup cả 3 trụ cột: metrics cho alerting, traces cho root cause, logs cho detail |
| SLO target 100% availability                       | Loại bỏ error budget → freeze deployments mãi mãi, không thể improve              | Target 99.9% hoặc 99.99% với error budget rõ ràng                                |
| Không propagate trace context qua async boundaries | Trace bị đứt tại Kafka/RabbitMQ → không thể trace end-to-end request journey      | Nhúng trace context vào message headers khi publish async events                 |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Debug slow request trong microservices? Monitor hệ thống thế nào?"
- → Nhớ đến: Distributed tracing (trace ID qua services), metrics (p99 latency), logs (error detail), SLO/error budget
- → Mở đầu trả lời: _"Tôi bắt đầu với distributed tracing — tìm trace ID của request chậm, xem waterfall diagram để identify bottleneck service, sau đó check metrics và logs của service đó..."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Distributed Systems](./03-distributed-systems.md) — hiểu distributed system failures trước khi monitor chúng
- ➡️ Để hiểu tiếp: [Auth & Security](./04-auth-security.md) — Service Mesh cung cấp cả observability lẫn mTLS security

---

## 1. Monolith vs Microservices

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: So sánh Monolith và Microservices architecture? Khi nào chọn kiến trúc nào? 🟢 🟢 [Junior]

**Monolith Architecture:**

Toàn bộ application được build và deploy như **một đơn vị duy nhất**. Tất cả modules (user, order, payment, notification) chạy trong cùng một process, share cùng database.

```
┌─────────────────────────────────────┐
│           MONOLITH APP              │
│  ┌─────┐ ┌───────┐ ┌───────────┐   │
│  │User │ │Order  │ │Notification│   │
│  │Mod  │ │Module │ │Module     │   │
│  └──┬──┘ └──┬────┘ └─────┬─────┘   │
│     │       │             │         │
│  ┌──┴───────┴─────────────┴──┐      │
│  │     Shared Database       │      │
│  └───────────────────────────┘      │
└─────────────────────────────────────┘
```

**Microservices Architecture:**

Application được chia thành **các service nhỏ, độc lập**, mỗi service có database riêng, deploy riêng, communicate qua network (HTTP/gRPC/messaging).

```
┌──────────┐    ┌──────────┐    ┌──────────────┐
│User Svc  │    │Order Svc │    │Notification  │
│          │◄──►│          │◄──►│Svc           │
└────┬─────┘    └────┬─────┘    └──────┬───────┘
     │               │                 │
┌────┴─────┐    ┌────┴─────┐    ┌──────┴───────┐
│User DB   │    │Order DB  │    │Notif DB      │
└──────────┘    └──────────┘    └──────────────┘
```

**Comparison Table:**

| Aspect                 | Monolith                         | Microservices                       |
| ---------------------- | -------------------------------- | ----------------------------------- |
| **Deployment**         | Deploy toàn bộ app               | Deploy từng service độc lập         |
| **Scaling**            | Scale toàn bộ (vertical)         | Scale từng service (horizontal)     |
| **Tech stack**         | Một tech stack duy nhất          | Mỗi service chọn tech phù hợp       |
| **Team autonomy**      | Tất cả team cùng codebase        | Mỗi team own một/nhiều service      |
| **Debugging**          | Dễ - single process, stack trace | Khó - distributed tracing cần thiết |
| **Data consistency**   | ACID transactions dễ dàng        | Eventual consistency, saga pattern  |
| **Network latency**    | In-process calls (nanoseconds)   | Network calls (milliseconds)        |
| **Operational cost**   | Thấp - ít infra                  | Cao - cần CI/CD, monitoring, mesh   |
| **Initial velocity**   | Nhanh                            | Chậm (setup overhead lớn)           |
| **Long-term velocity** | Giảm dần (coupling)              | Ổn định (nếu boundary đúng)         |

**Decision Framework - Khi nào chọn gì:**

Chọn **Monolith** khi:

- Team nhỏ (< 10 devs), startup giai đoạn đầu
- Domain chưa rõ ràng, business thay đổi liên tục
- Cần time-to-market nhanh
- Chưa có DevOps maturity (CI/CD, container orchestration)

Chọn **Microservices** khi:

- Team lớn, cần autonomous delivery
- Domain đã ổn định, bounded context rõ ràng
- Cần scale từng phần khác nhau (order service cần scale 10x, user service 2x)
- Có DevOps maturity đủ (Kubernetes, CI/CD pipeline, monitoring)

### Q: Giải thích "Monolith First" approach của Martin Fowler? 🟡 🟡 [Mid]

Martin Fowler khuyên: **"Don't start with microservices."**

Lý do: Khi bắt đầu dự án mới, bạn chưa hiểu rõ domain → chưa thể xác định đúng service boundaries. Nếu chia sai, chi phí refactor microservices **cực kỳ lớn** (phải move data, change APIs, update consumers).

**Approach đúng:**

1. Bắt đầu với monolith, nhưng **structure code theo modules rõ ràng**
2. Khi domain ổn định, identify boundaries tự nhiên
3. Extract modules thành services khi có **lý do cụ thể** (scale, team autonomy, tech diversity)

**Modular Monolith** là middle ground tuyệt vời:

- Codebase đơn nhất nhưng **enforce module boundaries nghiêm ngặt**
- Modules communicate qua **well-defined interfaces** (không truy cập trực tiếp internal)
- Mỗi module có thể có schema riêng trong cùng database
- Khi cần, extract module thành service dễ dàng hơn

```
┌────────────────────────────────────────┐
│         MODULAR MONOLITH               │
│  ┌──────────┐  ┌──────────┐           │
│  │  User    │  │  Order   │           │
│  │  Module  │  │  Module  │           │
│  │          │  │          │           │
│  │ ┌──────┐ │  │ ┌──────┐ │           │
│  │ │Public│ │  │ │Public│ │           │
│  │ │ API  │◄├──┤►│ API  │ │           │
│  │ └──────┘ │  │ └──────┘ │           │
│  │ (no direct access to internals)    │
│  └────┬─────┘  └────┬─────┘           │
│       │              │                 │
│  ┌────┴──────────────┴─────┐           │
│  │  Shared DB (separate    │           │
│  │  schemas per module)    │           │
│  └─────────────────────────┘           │
└────────────────────────────────────────┘
```

---

## 2. Service Decomposition

### Q: Giải thích các khái niệm DDD liên quan đến microservices? 🟡 🟡 [Mid]

**Domain-Driven Design (DDD)** cung cấp toolkit để xác định service boundaries. Các concept cốt lõi:

**Bounded Context** — Ranh giới ngữ cảnh, là concept QUAN TRỌNG NHẤT cho microservices. Một bounded context là phạm vi mà một domain model cụ thể có ý nghĩa. Cùng một khái niệm "Customer" có thể có nghĩa khác nhau trong Sales context vs Support context.

**Aggregate** — Một cluster of domain objects được treat như một đơn vị cho data changes. Có một Aggregate Root là entry point duy nhất. Ví dụ: `Order` aggregate chứa `OrderLines`, `ShippingAddress`. Mọi thay đổi phải đi qua `Order`.

**Entity** — Object có identity riêng, có lifecycle. Phân biệt bởi ID, không phải attributes. Ví dụ: hai `User` cùng tên nhưng khác ID là hai entity khác nhau.

**Value Object** — Object không có identity, chỉ defined bởi attributes. Immutable. Ví dụ: `Money(100, "USD")`, `Address("123 Main St")`.

**Domain Event** — Sự kiện đã xảy ra trong domain mà các phần khác cần biết. Past tense: `OrderPlaced`, `PaymentCompleted`, `UserRegistered`.

**Mapping DDD → Microservices:**

```
Bounded Context  ──►  Microservice (1:1 or 1:N mapping)
Aggregate        ──►  Service internal consistency boundary
Domain Event     ──►  Integration event giữa services
```

### Q: Làm sao xác định service boundaries từ bounded contexts? 🔴 🔴 [Senior]

**Bước 1: Event Storming** — Workshop với domain experts và devs. Dán sticky notes cho domain events trên timeline. Nhóm events liên quan lại → nhận ra boundaries tự nhiên.

**Bước 2: Identify Bounded Contexts** — Tìm điểm mà ngôn ngữ thay đổi. Nếu "Product" trong Catalog context khác "Product" trong Inventory context → đó là 2 bounded contexts.

**Bước 3: Evaluate Coupling** — Service tốt có **high cohesion** (chức năng liên quan gom lại) và **low coupling** (ít phụ thuộc service khác). Nếu 2 services luôn phải deploy cùng nhau → boundary sai.

**Bước 4: Apply Heuristics:**

- Mỗi service nên deployable bởi **1 team** (2-pizza team)
- Mỗi service có **1 reason to change** (Single Responsibility)
- Data ownership rõ ràng — không có 2 services cùng write vào 1 table

### Q: Strangler Fig Pattern là gì? 🟡 🟡 [Mid]

Pattern để **migrate dần từ monolith sang microservices** mà không cần rewrite toàn bộ (Big Bang rewrite rất rủi ro).

Lấy tên từ cây Strangler Fig trong tự nhiên: cây mọc bám vào cây chủ, dần dần bao phủ và thay thế cây chủ.

```
Phase 1: Route all traffic through facade
┌──────┐    ┌──────────┐    ┌──────────┐
│Client│───►│  Facade  │───►│ Monolith │
└──────┘    │(API GW)  │    │          │
            └──────────┘    └──────────┘

Phase 2: Extract and redirect specific routes
┌──────┐    ┌──────────┐    ┌──────────┐
│Client│───►│  Facade  │───►│ Monolith │
└──────┘    │          │    │(smaller) │
            │          │    └──────────┘
            │          │    ┌──────────┐
            │          │───►│ New Svc  │
            └──────────┘    └──────────┘

Phase 3: Continue until monolith is empty
┌──────┐    ┌──────────┐    ┌──────────┐
│Client│───►│  Facade  │───►│ Svc A    │
└──────┘    │          │    └──────────┘
            │          │───►┌──────────┐
            │          │    │ Svc B    │
            │          │───►└──────────┘
            └──────────┘    ┌──────────┐
                        ───►│ Svc C    │
                            └──────────┘
```

**Key principles:**

- Không sửa monolith code (ngoại trừ routing)
- Từng feature được extract, test, redirect traffic dần
- Có thể rollback bất kỳ lúc nào
- Monolith dần shrink cho đến khi có thể decomission

### Q: Anti-patterns trong microservices decomposition? 🟡 🟡 [Mid]

**Distributed Monolith** — Trông như microservices nhưng behave như monolith. Các services coupled chặt, phải deploy cùng nhau, share database, gọi synchronous chain dài. Bạn chịu **nhược điểm của cả hai**: complexity của distributed system + coupling của monolith.

Dấu hiệu: Deploy service A bắt buộc phải deploy service B,C cùng lúc. Thay đổi một field phải sửa 5 services.

**Nano-services** — Chia quá nhỏ, mỗi service chỉ làm một function đơn giản. Network overhead lớn hơn business logic. Operational cost cực cao.

Dấu hiệu: Service chỉ có 1-2 API endpoints, team phải maintain 50+ services.

---

## 3. Communication Patterns

### Q: So sánh Synchronous vs Asynchronous communication? 🟢 🟢 [Junior]

**Synchronous (Request-Response):**

Client gửi request và **chờ** response. Caller bị block cho đến khi nhận được response hoặc timeout.

```
Service A ────request────► Service B
    │                         │
    │      (waiting...)       │
    │                         │
    │ ◄───response────────────│
    ▼
(continues)
```

| Protocol      | Use Case                               | Pros                                                               | Cons                                       |
| ------------- | -------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------ |
| **REST/HTTP** | CRUD, public APIs, simple queries      | Ubiquitous, cacheable, human-readable                              | Text-based (JSON) → overhead, no streaming |
| **gRPC**      | Internal service-to-service, high perf | Binary (protobuf) → nhỏ/nhanh, streaming, code gen, strongly typed | Khó debug (binary), cần protobuf tooling   |

**Asynchronous (Message-Based):**

Sender gửi message và **không chờ**. Message được lưu trong broker. Consumer xử lý khi sẵn sàng.

```
Service A ──publish──► [Message Broker] ──deliver──► Service B
    │                  (Kafka/RabbitMQ)
    │ (continues                          (processes
    │  immediately)                        when ready)
    ▼
```

| Pattern                 | Use Case                           | Pros                               | Cons                                       |
| ----------------------- | ---------------------------------- | ---------------------------------- | ------------------------------------------ |
| **Message Queue**       | Task processing, work distribution | Load leveling, guaranteed delivery | Queue thêm component cần maintain          |
| **Pub/Sub (Event Bus)** | Event notification, fan-out        | Loose coupling, nhiều consumers    | Message ordering challenges, debugging khó |

**Decision Guide:**

- Cần response ngay? → Synchronous
- Fire-and-forget? → Async
- Cần resilience (sender không care receiver up/down)? → Async
- Long-running task? → Async
- Query data? → Sync (REST/gRPC)

### Q: Phân biệt Request-Reply, Event-Driven, và Command patterns? 🟡 🟡 [Mid]

**Request-Reply:** "Tôi cần thông tin, cho tôi ngay." Sender biết receiver, expects response.

**Command:** "Hãy làm điều này." Sender biết receiver, nhưng không nhất thiết cần response ngay. One-to-one. Ví dụ: `PlaceOrder`, `SendEmail`.

**Event:** "Điều này đã xảy ra." Sender KHÔNG biết (hoặc care) ai đang listen. One-to-many. Ví dụ: `OrderPlaced`, `UserRegistered`. Publisher hoàn toàn decoupled khỏi subscribers.

```
Request-Reply:     A ──"Get user #5"──► B ──"Here's user #5"──► A

Command:           A ──"Send email to X"──► B (B handles it)

Event:             A ──"OrderPlaced"──► [Event Bus] ──► B (update inventory)
                                                   ──► C (send email)
                                                   ──► D (update analytics)
```

### Q: So sánh Choreography vs Orchestration? 🔴 🔴 [Senior]

**Choreography** — Không có coordinator trung tâm. Mỗi service listen events và react, publish events tiếp. Giống như dancers tự phối hợp theo nhạc.

```
Choreography (Order Flow):

OrderSvc                    PaymentSvc              InventorySvc
    │                           │                       │
    │──"OrderCreated"──►[Bus]──►│                       │
    │                           │──"PaymentCompleted"──►│
    │                           │   ──►[Bus]────────────│
    │                           │                       │
    │◄──"InventoryReserved"─────│◄──────────────────────│
    │   ◄──[Bus]──              │                       │
```

**Orchestration** — Có một central coordinator (orchestrator) điều phối workflow. Giống như conductor chỉ huy dàn nhạc.

```
Orchestration (Order Flow):

                    OrderOrchestrator
                         │
            ┌────────────┼────────────┐
            │            │            │
            ▼            ▼            ▼
      1.Validate    2.Process    3.Reserve
        Order        Payment      Inventory
            │            │            │
            └────────────┼────────────┘
                         │
                    4.Confirm Order
```

**Comparison:**

| Aspect                      | Choreography                               | Orchestration                            |
| --------------------------- | ------------------------------------------ | ---------------------------------------- |
| **Coupling**                | Loose — services chỉ biết events           | Tighter — orchestrator biết all services |
| **Visibility**              | Khó thấy overall flow                      | Dễ thấy flow trong orchestrator          |
| **Single point of failure** | Không có                                   | Orchestrator là SPOF                     |
| **Complexity**              | Tăng khi nhiều services (spaghetti events) | Tập trung trong orchestrator             |
| **Adding steps**            | Thêm subscriber mới                        | Sửa orchestrator code                    |
| **Best for**                | Simple flows, < 4 steps                    | Complex flows, nhiều branching           |
| **Example tools**           | Kafka, RabbitMQ                            | Temporal, Cadence, AWS Step Functions    |

**Thực tế:** Nhiều system dùng **hybrid** — orchestration cho complex business flows (order processing), choreography cho cross-cutting events (analytics, notifications).

---

## 4. Service Discovery

### Q: Giải thích Service Discovery và các patterns? 🟡 🟡 [Mid]

Trong microservices, service instances có thể **scale up/down dynamically**, IP thay đổi liên tục. Service Discovery giải quyết: "Làm sao Service A biết address của Service B?"

**Client-Side Discovery:**

Client tự query service registry, nhận danh sách instances, tự load balance.

```
┌──────────┐  1.Query  ┌──────────────┐
│ Service A │─────────►│  Service     │
│ (client)  │◄─────────│  Registry    │
│           │ 2.List   │ (Consul/etcd)│
│           │          └──────────────┘
│           │                ▲
│           │  3.Call        │ Register/
│           │  directly      │ Heartbeat
│           │          ┌─────┴────┐
│           │─────────►│Service B │
│           │          │Instance 1│
│           │          ├──────────┤
│           │─────────►│Instance 2│
└──────────┘          └──────────┘
```

Ưu: Client có full control over load balancing. Cons: Client phải implement discovery logic (thường dùng library).

**Server-Side Discovery:**

Client gọi qua load balancer. LB query registry và route request.

```
┌──────────┐         ┌──────────────┐     ┌──────────────┐
│ Service A │────────►│ Load Balancer│────►│  Service B   │
│ (client)  │        │              │     │  Instance 1  │
└──────────┘        │              │     ├──────────────┤
                     │              │────►│  Instance 2  │
                     └──────┬───────┘     └──────────────┘
                            │
                            │ Query
                            ▼
                     ┌──────────────┐
                     │  Service     │
                     │  Registry    │
                     └──────────────┘
```

Ưu: Client đơn giản, chỉ cần biết LB address. Cons: LB là additional hop, potential bottleneck.

**DNS-Based Discovery (Kubernetes):**

Kubernetes cung cấp built-in service discovery qua DNS. Mỗi Service object có DNS name: `<service-name>.<namespace>.svc.cluster.local`. kube-dns/CoreDNS tự động resolve sang Pod IPs.

Đây là dạng server-side discovery, nhưng transparent — client chỉ cần biết service name.

**Service Registry Tools:**

| Tool                   | Consensus | Features                                                |
| ---------------------- | --------- | ------------------------------------------------------- |
| **Consul** (HashiCorp) | Raft      | Service discovery, health check, KV store, service mesh |
| **etcd**               | Raft      | KV store, dùng làm backbone cho Kubernetes              |
| **ZooKeeper**          | ZAB       | Mature, complex, dùng cho Kafka (đang dần loại bỏ)      |

### Q: Phân biệt Liveness Probe và Readiness Probe? 🟢 🟢 [Junior]

**Liveness Probe** — "Service còn sống không?" Nếu fail → Kubernetes **restart** container. Dùng để detect deadlock, infinite loop, service treo.

**Readiness Probe** — "Service đã sẵn sàng nhận traffic chưa?" Nếu fail → Kubernetes **ngừng gửi traffic** đến pod (remove khỏi Service endpoints), nhưng KHÔNG restart. Dùng khi service đang warmup, loading cache, waiting for dependencies.

**Startup Probe** — "Service đã khởi động xong chưa?" Dùng cho slow-starting containers. Khi startup probe pass, liveness và readiness probe mới bắt đầu check.

```
Container Start
      │
      ▼
[Startup Probe] ──fail──► (keep waiting, no restart yet)
      │ pass
      ▼
[Liveness Probe]  ──fail──► RESTART container
      │ pass
      ▼
[Readiness Probe] ──fail──► Remove from traffic (no restart)
      │ pass
      ▼
Serving Traffic ✓
```

**Best practice trong Go:**

- Liveness: `/healthz` — check process alive, minimal (return 200)
- Readiness: `/readyz` — check DB connection, cache loaded, dependencies ready
- Không để liveness check dependencies — nếu DB down, restart service không giúp gì

---

## 5. Distributed Transactions

### Q: Tại sao ACID transactions không hoạt động trong microservices? 🟡 🟡 [Mid]

Trong monolith, bạn dùng **một database transaction** wrap toàn bộ business logic:

```
BEGIN TRANSACTION
  INSERT INTO orders ...
  UPDATE inventory SET stock = stock - 1 ...
  INSERT INTO payments ...
COMMIT
```

Trong microservices, mỗi service có **database riêng**. Không thể dùng single DB transaction across multiple databases owned by different services. Lý do:

1. **Network boundary** — Distributed transactions qua network chậm và unreliable
2. **Autonomy** — Services phải independent, không share DB connections
3. **Heterogeneous** — Mỗi service có thể dùng DB khác nhau (PostgreSQL, MongoDB, Redis)
4. **CAP Theorem** — Trong distributed system, bạn phải chọn giữa Consistency và Availability khi có Partition

→ Microservices accept **eventual consistency** thay vì strong consistency.

### Q: Two-Phase Commit (2PC) hoạt động thế nào và tại sao không phù hợp? 🟡 🟡 [Mid]

**2PC** là distributed transaction protocol truyền thống, dùng coordinator để đảm bảo all-or-nothing.

```
Phase 1: PREPARE (Voting)
                    Coordinator
                    │
         ┌──────────┼──────────┐
         │ Prepare?  │ Prepare? │
         ▼          ▼          ▼
     Participant  Participant  Participant
         A           B           C
         │          │          │
         │ YES      │ YES      │ YES
         └──────────┼──────────┘
                    │
Phase 2: COMMIT
                    Coordinator
                    │
         ┌──────────┼──────────┐
         │ Commit!   │ Commit!  │
         ▼          ▼          ▼
     Participant  Participant  Participant
         A           B           C
```

**Vấn đề của 2PC trong microservices:**

| Problem              | Giải thích                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------- |
| **Blocking**         | Participants phải lock resources trong toàn bộ quá trình, giảm throughput                     |
| **Coordinator SPOF** | Nếu coordinator crash giữa phase 1 và 2, participants bị stuck (resources locked vô thời hạn) |
| **Latency**          | Mỗi phase cần network round-trip tới tất cả participants                                      |
| **Not supported**    | Nhiều modern databases (NoSQL) và message brokers không support 2PC                           |
| **Coupling**         | Tất cả participants phải available cùng lúc                                                   |

→ **2PC phù hợp** cho: databases trong cùng data center, short-lived transactions. **Không phù hợp** cho microservices communication.

### Q: Saga Pattern là gì? Giải thích chi tiết Choreography Saga và Orchestration Saga? 🔴 🔴 [Senior]

**Saga** là sequence of local transactions. Mỗi service thực hiện local transaction và publish event/command để trigger bước tiếp theo. Nếu bước nào fail → thực hiện **compensating transactions** để undo các bước trước.

**Key insight:** Thay vì 1 ACID transaction lớn → N local ACID transactions + compensating transactions.

**Choreography Saga:**

```
Happy Path:
OrderSvc          PaymentSvc        InventorySvc       ShippingSvc
    │                  │                  │                  │
    │ 1.Create Order   │                  │                  │
    │─"OrderCreated"──►│                  │                  │
    │                  │ 2.Process Payment│                  │
    │                  │─"PaymentDone"───►│                  │
    │                  │                  │ 3.Reserve Stock  │
    │                  │                  │─"StockReserved"─►│
    │                  │                  │                  │ 4.Ship
    │◄─────────────────┼──────────────────┼─"OrderShipped"──│
    │ 5.Complete Order │                  │                  │

Failure + Compensation:
OrderSvc          PaymentSvc        InventorySvc
    │                  │                  │
    │─"OrderCreated"──►│                  │
    │                  │─"PaymentDone"───►│
    │                  │                  │ Reserve FAILS!
    │                  │◄"StockFailed"────│
    │                  │ Refund payment   │
    │◄"PaymentRefunded"│                  │
    │ Cancel order     │                  │
```

**Orchestration Saga:**

```
                    OrderSaga Orchestrator
                           │
              ┌────────────┼───────────────┐
              │            │               │
         1.Create     2.Process       3.Reserve
          Order        Payment         Stock
              │            │               │
              │   OK       │   OK          │  FAIL!
              │◄───────────┤◄──────────────│
              │            │               │
         (no undo     4.Refund        (nothing
          needed)      Payment         to undo)
                           │
                      5.Cancel
                       Order
```

**Choreography vs Orchestration Saga:**

| Aspect           | Choreography Saga                           | Orchestration Saga                               |
| ---------------- | ------------------------------------------- | ------------------------------------------------ |
| **Coordinator**  | Không có, mỗi service tự biết bước tiếp     | OrderSaga orchestrator quản lý flow              |
| **Coupling**     | Services chỉ know events                    | Orchestrator knows tất cả services               |
| **Visibility**   | Flow nằm rải rác trong code của mỗi service | Flow tập trung, dễ đọc                           |
| **Testing**      | Khó test end-to-end                         | Dễ test orchestrator logic                       |
| **Cyclic deps**  | Dễ tạo circular event chains                | Không có cyclic deps                             |
| **Adding steps** | Add subscriber mới (distributed change)     | Sửa orchestrator (centralized change)            |
| **Best for**     | 2-4 simple steps                            | Complex flows, conditional logic, nhiều branches |
| **Go tools**     | Kafka consumers, NATS                       | Temporal, go-saga libraries                      |

**Compensating Transaction Design:**

Compensating transaction phải là **semantic inverse**, KHÔNG phải undo:

- `CreateOrder` → compensate: `CancelOrder` (không phải DELETE)
- `DebitAccount` → compensate: `CreditAccount`
- `ReserveStock` → compensate: `ReleaseStock`

Rules:

1. Compensating transactions phải **idempotent** (chạy nhiều lần cùng kết quả)
2. Compensating transactions phải **always succeed** (retryable)
3. Ghi log mỗi step để có thể recover sau crash

### Q: Transactional Outbox Pattern và CDC là gì? 🔴 🔴 [Senior]

**Problem:** Service cần vừa update database vừa publish event. Nếu DB commit nhưng publish fail → data inconsistency.

```
WRONG: Dual-write problem
    │ 1. Update DB     ✓ Success
    │ 2. Publish Event  ✗ Failed (broker down)
    │
    └──► DB updated but no event published = INCONSISTENCY
```

**Transactional Outbox Pattern:**

Thay vì publish trực tiếp, ghi event vào **outbox table** trong cùng DB transaction. Một separate process đọc outbox và publish events.

```
┌─────────────────────────────────────┐
│         Service Database            │
│                                     │
│  ┌──────────┐    ┌───────────────┐  │
│  │ Business │    │ Outbox Table  │  │
│  │ Table    │    │               │  │
│  │          │    │ id | event    │  │
│  │ orders   │    │ 1  | OrderNew│  │
│  └──────────┘    │ 2  | OrderUpd│  │
│                  └───────┬───────┘  │
│   (same DB transaction)  │          │
└──────────────────────────┼──────────┘
                           │
                  Message Relay
                  (polling or CDC)
                           │
                           ▼
                  ┌─────────────────┐
                  │  Message Broker │
                  └─────────────────┘
```

Outbox relay có 2 approaches:

1. **Polling publisher** — Periodically query outbox table, publish pending events, mark as published. Simple nhưng có delay.
2. **Transaction log tailing (CDC)** — Đọc database transaction log (WAL in PostgreSQL, binlog in MySQL) để detect new outbox entries. Near real-time.

**Change Data Capture (CDC):**

CDC capture changes từ database transaction log. Tool phổ biến: **Debezium** (đọc WAL/binlog → publish to Kafka).

```
┌──────────┐     ┌───────────┐     ┌──────┐     ┌──────────┐
│PostgreSQL│────►│ Debezium  │────►│Kafka │────►│Consumers │
│  WAL     │     │ Connector │     │      │     │          │
└──────────┘     └───────────┘     └──────┘     └──────────┘
```

Advantage: Không cần outbox table, capture mọi change. Dùng nhiều cho data synchronization giữa services.

---

## 6. Event-Driven Architecture

### Q: Phân loại các loại events trong microservices? 🟡 🟡 [Mid]

| Event Type                       | Mục đích                                    | Payload                             | Ví dụ                                                   |
| -------------------------------- | ------------------------------------------- | ----------------------------------- | ------------------------------------------------------- |
| **Event Notification**           | Thông báo something happened, minimal data  | Chỉ chứa ID + event type            | `{type: "OrderPlaced", orderId: "123"}`                 |
| **Event-Carried State Transfer** | Chứa đủ data để consumer không cần callback | Full entity data                    | `{type: "OrderPlaced", order: {id, items, total, ...}}` |
| **Domain Event**                 | Internal within bounded context             | Domain-specific                     | `OrderSubmitted` (trong Order domain)                   |
| **Integration Event**            | Cross bounded context                       | Translated for external consumption | `OrderCreatedIntegrationEvent`                          |

**Tradeoffs:**

- Event Notification: Payload nhỏ, nhưng consumer phải query lại source → coupling
- Event-Carried State Transfer: Payload lớn, nhưng consumer self-sufficient → decoupled

### Q: Event Sourcing là gì? Ưu nhược điểm? 🔴 🔴 [Senior]

**Event Sourcing** lưu trạng thái domain object như **sequence of events** thay vì current state. Để lấy current state → replay tất cả events từ đầu.

```
Traditional (State-based):
┌─────────────────────────┐
│ orders table            │
│ id=1, status="shipped", │
│ total=100               │
└─────────────────────────┘
  (chỉ biết trạng thái hiện tại)

Event Sourcing:
┌──────────────────────────────────────┐
│ event_store                          │
│ 1. OrderCreated   {total: 100}       │
│ 2. ItemAdded      {item: "book"}     │
│ 3. PaymentReceived{amount: 100}      │
│ 4. OrderShipped   {tracking: "X123"} │
└──────────────────────────────────────┘
  (biết TOÀN BỘ lịch sử từ đầu)
```

**Để build current state (Projection):**

Events được replay qua projection function để tạo **read model** (materialized view):

```
Event Store ──replay──► Projection ──► Read Model (DB/Cache)
                        Function
                                       ┌──────────────┐
OrderCreated ──────►                   │ Order:       │
ItemAdded ─────────► Apply events ───► │  status=shipped│
PaymentReceived ───►  sequentially     │  total=100   │
OrderShipped ──────►                   │  items=[book]│
                                       └──────────────┘
```

**Snapshot:** Khi event history quá dài, lưu snapshot tại một thời điểm để không phải replay từ đầu. Replay = load snapshot + replay events sau snapshot.

**Advantages:**

- **Complete audit trail** — Biết chính xác mọi thay đổi, bởi ai, khi nào
- **Temporal queries** — "Trạng thái order vào ngày 15/3 là gì?" → replay events đến ngày đó
- **Debugging** — Reproduce bug bằng cách replay events
- **Event replay** — Tạo read model mới bằng cách replay toàn bộ events

**Disadvantages:**

- **Complexity** — Khó hơn CRUD đáng kể, team cần mindset shift
- **Eventual consistency** — Read model không phải real-time (có projection lag)
- **Schema evolution** — Event schema thay đổi → cần upcasting (transform old events sang new schema)
- **Event store size** — Cần snapshot strategy cho aggregate dài
- **Querying** — Không thể query trực tiếp event store, cần projections

### Q: CQRS là gì? Khi nào nên và KHÔNG nên dùng? 🔴 🔴 [Senior]

**CQRS (Command Query Responsibility Segregation):** Tách **write model** (commands) và **read model** (queries) thành 2 models riêng biệt, có thể khác database.

```
                    ┌──────────────────┐
                    │    API Layer     │
                    └────┬────────┬────┘
                         │        │
              Commands   │        │  Queries
              (write)    │        │  (read)
                         ▼        ▼
              ┌──────────┐  ┌──────────┐
              │  Write   │  │  Read    │
              │  Model   │  │  Model   │
              │(normalized│  │(denorm-  │
              │ domain)  │  │ alized,  │
              │          │  │ optimized│
              │          │  │ for query│
              └────┬─────┘  └────▲─────┘
                   │             │
                   │  Sync       │
                   └─────────────┘
                   (events/CDC/polling)
```

**Tại sao tách?**

- Write model: normalized, enforce business rules, consistency
- Read model: denormalized, optimized cho specific queries, no joins needed
- Read/write ratio thường 90/10 → scale independently

**CQRS WITHOUT Event Sourcing** (phổ biến hơn):

- Write vào primary DB (PostgreSQL)
- Sync sang read DB (Elasticsearch, Redis) via CDC hoặc application events
- Đơn giản hơn, đủ cho hầu hết use cases

**CQRS WITH Event Sourcing:**

- Write = append events vào event store
- Read = projections từ events vào read DB
- Powerful nhưng complex, chỉ dùng khi thực sự cần audit trail + temporal queries

**Khi nào dùng CQRS:**

- Read/write workload rất khác nhau cần scale riêng
- Complex domain với nhiều business rules cho writes
- Read queries phức tạp, cần nhiều denormalized views
- Collaboration domain (nhiều user cùng modify)

**Khi nào KHÔNG dùng:**

- Simple CRUD application
- Domain đơn giản, ít business logic
- Team nhỏ, chưa có experience với eventual consistency
- Data consistency requirement cao (banking transfers cần strong consistency)

### Q: Phân biệt Event-Driven, Event Sourcing, và CQRS? 🔴 🔴 [Senior]

Ba concept này thường bị nhầm lẫn. Chúng **independent** và có thể dùng riêng lẻ:

| Concept                       | Definition                      | Scope                                    |
| ----------------------------- | ------------------------------- | ---------------------------------------- |
| **Event-Driven Architecture** | Services communicate qua events | **Communication pattern** giữa services  |
| **Event Sourcing**            | Lưu state changes thành events  | **Persistence pattern** trong 1 service  |
| **CQRS**                      | Tách read/write models          | **Architecture pattern** trong 1 service |

```
Event-Driven:  ServiceA ──event──► ServiceB  (inter-service communication)

Event Sourcing: [Event1, Event2, Event3] → Current State  (data storage)

CQRS:          Write Model ──sync──► Read Model  (read/write separation)
```

Bạn có thể dùng:

- Event-Driven WITHOUT Event Sourcing (rất phổ biến)
- CQRS WITHOUT Event Sourcing (phổ biến)
- Event Sourcing WITHOUT CQRS (hiếm, nhưng possible)
- Tất cả 3 cùng nhau (complex systems like financial platforms)

---

## 7. Resilience Patterns

### Q: Circuit Breaker pattern hoạt động thế nào? 🟡 🟡 [Mid]

Circuit Breaker ngăn service liên tục gọi một dependency đang fail, tránh **cascade failure** và cho dependency thời gian recover.

**State Machine:**

```
                    ┌──────────────────┐
                    │                  │
         success   │    CLOSED        │  failure count++
        (reset     │  (normal flow)   │
         counter)  │                  │
                    └────────┬─────────┘
                             │
                    failure threshold reached
                             │
                             ▼
                    ┌──────────────────┐
          all      │                  │
          requests │    OPEN          │  timer
          fail     │  (reject all     │  running
          fast     │   requests)      │
                    └────────┬─────────┘
                             │
                    timeout expires
                             │
                             ▼
                    ┌──────────────────┐
                    │                  │
                    │   HALF-OPEN     │
                    │  (allow limited  │
                    │   test requests) │
                    └───┬─────────┬───┘
                        │         │
                   success       failure
                        │         │
                        ▼         ▼
                    CLOSED      OPEN
```

**States:**

1. **CLOSED** — Normal operation. Requests đi qua bình thường. Đếm failures. Khi failure count vượt threshold trong time window → chuyển sang OPEN.
2. **OPEN** — Reject tất cả requests ngay lập tức (fail fast). Không gọi downstream service. Sau timeout duration → chuyển sang HALF-OPEN.
3. **HALF-OPEN** — Allow một số test requests đi qua. Nếu success → CLOSED. Nếu fail → OPEN lại.

**Configuration quan trọng:**

- `failureThreshold`: Bao nhiêu failures trước khi trip (e.g., 5 failures)
- `failureRateThreshold`: Tỉ lệ failure (e.g., 50% requests fail)
- `timeout`: Bao lâu ở OPEN state trước khi thử lại (e.g., 30 seconds)
- `halfOpenMaxRequests`: Bao nhiêu test requests trong HALF-OPEN (e.g., 3)

### Q: Giải thích Retry with Exponential Backoff + Jitter? 🟢 🟢 [Junior]

**Retry** — Khi request fail, thử lại. Nhưng retry ngay lập tức có thể **overwhelm** service đang recovery.

**Exponential Backoff** — Tăng wait time theo cấp số nhân: 1s → 2s → 4s → 8s. Cho service thời gian recover.

**Jitter** — Thêm random variance vào wait time. Tránh **thundering herd** (tất cả clients retry cùng lúc).

```
Without jitter (thundering herd):
Client A: ─fail──[2s]──retry──[4s]──retry──[8s]──retry
Client B: ─fail──[2s]──retry──[4s]──retry──[8s]──retry
Client C: ─fail──[2s]──retry──[4s]──retry──[8s]──retry
                  ▲           ▲           ▲
             All retry   All retry   All retry
             at same     at same     at same
             time!       time!       time!

With jitter (spread out):
Client A: ─fail──[1.7s]──retry──[3.2s]──retry──[7.1s]──retry
Client B: ─fail──[2.3s]──retry──[4.8s]──retry──[8.9s]──retry
Client C: ─fail──[1.9s]──retry──[3.5s]──retry──[6.4s]──retry
```

**Formula:** `sleep = min(cap, base * 2^attempt) + random(0, base * 2^attempt)`

**Rules:**

- Set **max retries** (e.g., 3-5) — don't retry forever
- Set **max delay cap** (e.g., 30s)
- Only retry **transient** errors (5xx, timeout). Don't retry 4xx (client error).
- Ensure operations are **idempotent** before retrying

### Q: Bulkhead Pattern là gì? 🟡 🟡 [Mid]

Lấy ý tưởng từ **vách ngăn** trong tàu thủy — nếu một khoang bị ngập, các khoang khác vẫn an toàn.

Trong software: **isolate resources** cho từng dependency để failure của một dependency không ảnh hưởng toàn bộ system.

```
Without Bulkhead:
┌───────────────────────────────┐
│   Shared Thread Pool (100)    │
│                               │
│  ServiceA calls  ████████████ │ ← ServiceA slow, consuming
│  ServiceB calls  ░░           │    all threads
│  ServiceC calls  ░            │ ← B,C starved even though
│                               │    they're healthy!
└───────────────────────────────┘

With Bulkhead:
┌────────────┐ ┌────────────┐ ┌────────────┐
│Pool A (40) │ │Pool B (30) │ │Pool C (30) │
│            │ │            │ │            │
│SvcA ██████ │ │SvcB ███    │ │SvcC ██     │
│(slow but   │ │(healthy,   │ │(healthy,   │
│ contained) │ │ unaffected)│ │ unaffected)│
└────────────┘ └────────────┘ └────────────┘
```

**Implementation approaches:**

- **Thread pool isolation** — Mỗi dependency dùng thread pool riêng. Strong isolation nhưng overhead (context switching).
- **Semaphore isolation** — Limit concurrent calls bằng semaphore/counter. Lightweight hơn, dùng same thread.

### Q: Fallback Pattern? 🟢 🟢 [Junior]

Khi dependency fail (sau retries, circuit open), trả về **fallback response** thay vì error.

**Strategies:**

1. **Default value** — Trả về giá trị mặc định (`recommendations = []`)
2. **Cache fallback** — Trả về cached data (stale but available)
3. **Degraded mode** — Bỏ bớt features, giữ core functionality
4. **Alternative service** — Gọi backup service

**Priority:** Cache fallback > Degraded mode > Default value > Error

---

## 8. Service Mesh

### Q: Service Mesh là gì? Tại sao cần? 🟡 🟡 [Mid]

**Service Mesh** là dedicated infrastructure layer xử lý **service-to-service communication**. Thay vì mỗi service tự implement networking concerns (retries, circuit breaker, mTLS, tracing), service mesh xử lý transparent.

**Sidecar Proxy Pattern:**

Mỗi service instance có một **sidecar proxy** (Envoy) chạy alongside. Tất cả inbound/outbound traffic đi qua sidecar.

```
┌─────────────────────┐    ┌─────────────────────┐
│       Pod A         │    │       Pod B         │
│                     │    │                     │
│  ┌──────┐  ┌─────┐ │    │ ┌─────┐  ┌──────┐  │
│  │Svc A │──│Envoy│─┼────┼─│Envoy│──│Svc B │  │
│  │      │  │Proxy│ │    │ │Proxy│  │      │  │
│  └──────┘  └─────┘ │    │ └─────┘  └──────┘  │
│                     │    │                     │
└─────────────────────┘    └─────────────────────┘
       ▲                          ▲
       │     ┌──────────────┐     │
       └─────│ Control Plane│─────┘
             │  (istiod)    │
             └──────────────┘
```

**Data Plane vs Control Plane:**

| Layer             | Role                                        | Components                            |
| ----------------- | ------------------------------------------- | ------------------------------------- |
| **Data Plane**    | Handle actual network traffic giữa services | Envoy sidecar proxies                 |
| **Control Plane** | Configure và manage proxies, push policies  | istiod (Istio), Linkerd control plane |

**What Service Mesh handles:**

- **mTLS** — Automatic mutual TLS giữa tất cả services (zero-trust networking)
- **Traffic management** — Routing, load balancing, canary deployments, traffic splitting
- **Observability** — Distributed tracing, metrics, access logs (automatic, no code change)
- **Resilience** — Retries, timeouts, circuit breaking (configured at infra level)
- **Rate limiting** — Control request rates per service

### Q: Service Mesh vs API Gateway? 🟡 🟡 [Mid]

| Aspect             | API Gateway                       | Service Mesh                    |
| ------------------ | --------------------------------- | ------------------------------- |
| **Position**       | Edge — giữa client và services    | Interior — giữa services        |
| **Traffic**        | North-South (external → internal) | East-West (internal ↔ internal) |
| **Focus**          | API management, auth, rate limit  | Inter-service networking        |
| **Implementation** | Centralized proxy                 | Distributed sidecars            |
| **mTLS**           | Client → Gateway only             | Service ↔ Service (full mesh)   |
| **Examples**       | Kong, AWS API GW, Nginx           | Istio, Linkerd, Consul Connect  |

```
                    North-South (API Gateway)
                         │
External ──────► ┌───────┴──────┐
Clients          │  API Gateway │
                 └───────┬──────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────┴────┐    ┌─────┴────┐    ┌─────┴────┐
    │Svc A    │◄──►│Svc B     │◄──►│Svc C     │
    │+ sidecar│    │+ sidecar │    │+ sidecar │
    └─────────┘    └──────────┘    └──────────┘
         ◄─── East-West (Service Mesh) ───►
```

**Khi nào dùng Service Mesh:**

- Nhiều services (> 10-15), communication complex
- Cần zero-trust security (mTLS everywhere)
- Cần observability mà không muốn modify application code
- Platform team có capacity manage thêm infra

**Khi nào KHÔNG cần:**

- Ít services (< 5), simple communication
- Team nhỏ, không có dedicated platform team
- Overhead của sidecar proxy không chấp nhận được (latency-sensitive)

---

## 9. Observability (The Three Pillars)

### Q: Ba trụ cột của Observability là gì? 🟢 🟢 [Junior]

Observability là khả năng **hiểu internal state** của system bằng cách quan sát **external outputs**. Ba trụ cột:

**1. Logging — Discrete events**

Ghi lại events cụ thể đã xảy ra. Mỗi log entry là một sự kiện rời rạc.

Best practices:

- **Structured logging** (JSON) — machine-parseable, queryable
- **Correlation ID** — Mỗi request có unique ID, truyền qua tất cả services → trace một request flow
- **Log levels** — DEBUG, INFO, WARN, ERROR, FATAL (production = INFO+)
- **Stack:** ELK (Elasticsearch + Logstash + Kibana) hoặc Loki + Grafana

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "ERROR",
  "service": "order-svc",
  "correlation_id": "abc-123-def",
  "message": "payment failed",
  "user_id": "user_456",
  "order_id": "order_789",
  "error": "insufficient funds"
}
```

**2. Metrics — Aggregated measurements**

Numeric measurements aggregated over time. Dùng để biết system "how" — how fast, how much, how often.

**RED Method** (cho request-driven services):

- **R**ate — Requests/second
- **E**rrors — Error rate (errors/second)
- **D**uration — Latency distribution (p50, p95, p99)

**USE Method** (cho infrastructure resources):

- **U**tilization — % resource đang được sử dụng (CPU 80%)
- **S**aturation — Lượng work đang queue (pending requests)
- **E**rrors — Error count

Stack: **Prometheus** (collect + store) + **Grafana** (visualize)

**3. Distributed Tracing — Request journey**

Theo dõi một request xuyên suốt tất cả services nó đi qua. Mỗi trace gồm nhiều **spans** (đoạn xử lý trong mỗi service).

```
Trace: abc-123-def
═══════════════════════════════════════════════════════
│ API Gateway        [──────────── 250ms ────────────]│
│   │                                                 │
│   └► Order Svc     [──────── 200ms ────────]        │
│       │                                             │
│       ├► User Svc   [── 30ms ──]                    │
│       │                                             │
│       ├► Payment Svc    [──── 80ms ────]            │
│       │   │                                         │
│       │   └► Bank API       [── 50ms ──]            │
│       │                                             │
│       └► Inventory Svc         [── 40ms ──]         │
│                                                     │
═══════════════════════════════════════════════════════
   0ms        50ms      100ms     150ms    200ms  250ms
```

Key concepts:

- **Trace** — Toàn bộ journey of a request (unique trace ID)
- **Span** — Một đoạn xử lý trong 1 service (span ID, parent span ID)
- **Context propagation** — Pass trace/span IDs qua HTTP headers hoặc gRPC metadata

Stack: **OpenTelemetry** (instrumentation standard) + **Jaeger** hoặc **Tempo** (backend)

### Q: SLI, SLO, SLA là gì? Error Budget? 🟡 🟡 [Mid]

**SLI (Service Level Indicator)** — Metric đo lường chất lượng service. Là con số cụ thể.

- Ví dụ: "99.2% requests trả về < 200ms", "Error rate = 0.1%"

**SLO (Service Level Objective)** — Target cho SLI. Là mục tiêu team đặt ra.

- Ví dụ: "99.9% requests phải trả về < 200ms" (SLO cho latency SLI)

**SLA (Service Level Agreement)** — Hợp đồng với customer, kèm consequences nếu vi phạm.

- Ví dụ: "99.95% uptime, nếu vi phạm → refund 10% monthly fee"

```
Relationship:
  SLI (measurement) ← SLO (target) ← SLA (contract)

  SLI: Current availability = 99.95%
  SLO: Target availability ≥ 99.9%     ← stricter than SLA
  SLA: Guaranteed availability ≥ 99.5%  ← customer-facing

  SLO luôn stricter hơn SLA (buffer zone)
```

**Error Budget:**

Error budget = 100% - SLO. Nếu SLO = 99.9% → Error budget = 0.1%.

Trong 30 ngày (43,200 minutes): 0.1% = **43.2 minutes** downtime được phép.

- Error budget còn nhiều → Deploy freely, experiment, take risks
- Error budget sắp hết → Freeze deployments, focus stability
- Error budget hết → Chỉ fix reliability issues, không ship features

Đây là cách engineering teams **balance velocity vs reliability** một cách data-driven.

---

## 10. 12-Factor App

### Q: Giải thích 12-Factor App methodology? 🟢 🟢 [Junior]

12-Factor App (by Heroku co-founder) là 12 nguyên tắc xây dựng **cloud-native, scalable applications**. Rất relevant cho Go microservices.

| #   | Factor                  | Giải thích                                                                  | Go Relevance                                 |
| --- | ----------------------- | --------------------------------------------------------------------------- | -------------------------------------------- |
| 1   | **Codebase**            | Một codebase tracked trong VCS, nhiều deploys (dev, staging, prod)          | Mono-repo hoặc một repo per service          |
| 2   | **Dependencies**        | Khai báo và isolate dependencies rõ ràng                                    | `go.mod` + `go.sum`                          |
| 3   | **Config**              | Config lưu trong environment variables, KHÔNG trong code                    | `os.Getenv()`, Viper                         |
| 4   | **Backing services**    | Treat backing services (DB, cache, queue) như attached resources, swap được | Connection strings trong env vars            |
| 5   | **Build, release, run** | Tách rõ build stage, release stage, run stage                               | Docker multi-stage build                     |
| 6   | **Processes**           | App chạy như stateless processes, không lưu state trên local disk           | Go services nên stateless, session vào Redis |
| 7   | **Port binding**        | Export service qua port binding, self-contained                             | `http.ListenAndServe(":8080", ...)`          |
| 8   | **Concurrency**         | Scale out qua process model (nhiều instances)                               | Kubernetes replicas                          |
| 9   | **Disposability**       | Fast startup, graceful shutdown                                             | `signal.NotifyContext`, `server.Shutdown()`  |
| 10  | **Dev/prod parity**     | Giữ dev, staging, prod giống nhau nhất có thể                               | Docker + docker-compose cho local dev        |
| 11  | **Logs**                | Treat logs như event streams, write to stdout                               | `log.Printf` → stdout → log collector        |
| 12  | **Admin processes**     | Run admin/management tasks như one-off processes                            | DB migration scripts, CLI commands           |

**Most critical cho interview:** #3 (Config), #6 (Stateless), #9 (Disposability), #11 (Logs)

---

## 11. Deployment Patterns

### Q: So sánh các deployment strategies? 🟡 🟡 [Mid]

**Blue-Green Deployment:**

Có 2 environments identical: Blue (current) và Green (new). Deploy lên Green, test, rồi switch traffic.

```
Before:
  Users ──► [LB] ──► Blue (v1) ✓ active
                     Green (v2) idle, deploying

After switch:
  Users ──► [LB] ──► Blue (v1) idle (rollback ready)
                     Green (v2) ✓ active
```

**Canary Deployment:**

Route small % traffic sang version mới. Monitor. Tăng dần nếu OK.

```
Phase 1:   Users ──► [LB] ──95%──► v1
                           ──5%───► v2 (canary)

Phase 2:   Users ──► [LB] ──70%──► v1
                           ──30%──► v2

Phase 3:   Users ──► [LB] ──0%───► v1 (decommission)
                           ──100%─► v2
```

**Rolling Update:**

Replace instances từng cái một. Kubernetes default strategy.

```
Time 0:  [v1] [v1] [v1] [v1]
Time 1:  [v2] [v1] [v1] [v1]   ← replace first
Time 2:  [v2] [v2] [v1] [v1]
Time 3:  [v2] [v2] [v2] [v1]
Time 4:  [v2] [v2] [v2] [v2]   ← complete
```

**Comparison Table:**

| Strategy       | Downtime | Rollback Speed          | Resource Cost | Risk     | Complexity |
| -------------- | -------- | ----------------------- | ------------- | -------- | ---------- |
| **Blue-Green** | Zero     | Instant (switch back)   | 2x resources  | Low      | Medium     |
| **Canary**     | Zero     | Fast (route back)       | 1x + small    | Very Low | High       |
| **Rolling**    | Zero     | Slow (roll back 1-by-1) | 1x            | Medium   | Low        |
| **Recreate**   | Yes      | Slow (redeploy old)     | 1x            | High     | Very Low   |

**Feature Flags** — Deploy code nhưng ẩn feature behind flag. Enable/disable runtime mà không cần redeploy. Dùng cho: gradual rollout, A/B testing, kill switch.

**A/B Testing** — Route different user segments sang different versions để **measure business impact**. Khác canary ở mục đích: canary = technical validation, A/B = business validation.

---

## 12. Data Management in Microservices

### Q: Database per Service pattern và các challenges? 🟡 🟡 [Mid]

**Database per Service** là principle: mỗi service own private database. Không service nào truy cập trực tiếp DB của service khác.

```
CORRECT: Database per Service
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Order Svc│    │ User Svc │    │Inventory │
└────┬─────┘    └────┬─────┘    └────┬─────┘
     │ (API)         │ (API)         │ (API)
     │               │               │
┌────┴─────┐    ┌────┴─────┐    ┌────┴─────┐
│Order DB  │    │User DB   │    │Inv DB    │
│(Postgres)│    │(Postgres)│    │(MongoDB) │
└──────────┘    └──────────┘    └──────────┘

WRONG: Shared Database (Anti-pattern)
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Order Svc│    │ User Svc │    │Inventory │
└─────┬────┘    └────┬─────┘    └─────┬────┘
      │              │                │
      └──────────────┼────────────────┘
                     │
              ┌──────┴──────┐
              │ Shared DB   │
              │ (coupling!) │
              └─────────────┘
```

**Shared Database anti-pattern problems:**

- Schema change ảnh hưởng tất cả services → deployment coupling
- Không thể chọn DB technology phù hợp per service
- Một service có thể bypass another service's business logic bằng cách write trực tiếp vào DB
- Performance coupling — heavy query từ 1 service ảnh hưởng DB cho tất cả

### Q: Làm sao query data across services (API Composition)? 🟡 🟡 [Mid]

**Problem:** Customer dashboard cần: user info (User Svc) + recent orders (Order Svc) + loyalty points (Loyalty Svc). Không thể JOIN across databases.

**API Composition Pattern:**

Một composer service (hoặc API Gateway) gọi multiple services và aggregate results.

```
Client ──► API Composer / BFF
               │
      ┌────────┼────────┐
      │        │        │
      ▼        ▼        ▼
  User Svc  Order Svc  Loyalty Svc
      │        │        │
      └────────┼────────┘
               │
          Aggregate results
               │
               ▼
          Response to Client
```

**Challenges:**

- **Latency** — Sequential calls = sum of latencies. Parallel calls giảm nhưng vẫn = max latency.
- **Availability** — Nếu 1 service down, toàn bộ query fail (cần fallback strategy).
- **Data volume** — Không thể push filtering/sorting xuống database level, phải fetch nhiều data rồi filter in-memory.
- **Consistency** — Data có thể inconsistent giữa services tại thời điểm query.

**Alternatives:**

- **CQRS với read model** — Tạo denormalized view chứa data cần thiết, sync qua events. Best cho frequent reads.
- **Data replication** — Service subscribe events từ other services, maintain local copy. Tăng autonomy nhưng thêm eventual consistency.

---

## Architecture Decision Checklist

Khi thiết kế microservices, trả lời các câu hỏi sau:

```
□ Team đã hiểu domain đủ rõ để xác định service boundaries?
□ Có DevOps maturity (CI/CD, container orchestration, monitoring)?
□ Communication pattern: sync hay async? Choreography hay orchestration?
□ Data consistency strategy? Saga? Outbox?
□ Service discovery mechanism?
□ Resilience: circuit breaker, retry, timeout, bulkhead configured?
□ Observability: logging, metrics, tracing instrumented?
□ Deployment strategy: canary, blue-green, rolling?
□ Security: service-to-service auth (mTLS)?
□ How will services be tested (contract testing, integration testing)?
```

---

## Common Interview Questions by Company

### Grab, Axon, Employment Hero Focus:

| Question                                          | Key Points to Cover                                              |
| ------------------------------------------------- | ---------------------------------------------------------------- |
| "Thiết kế order processing system"                | Saga pattern, event-driven, eventual consistency, idempotency    |
| "Service A gọi B gọi C, C chậm/down thì sao?"     | Circuit breaker, timeout, retry, fallback, bulkhead              |
| "Làm sao đảm bảo data consistency giữa services?" | Saga (choreography vs orchestration), outbox pattern, CDC        |
| "Monitoring microservices thế nào?"               | 3 pillars, RED method, distributed tracing, SLO/SLI              |
| "Migrate monolith sang microservices?"            | Strangler Fig, modular monolith first, identify bounded contexts |
| "Event sourcing vs traditional CRUD?"             | When to use, tradeoffs, projections, snapshots                   |
| "gRPC vs REST?"                                   | Binary vs text, streaming, code gen, when to use each            |
| "Service mesh có cần không?"                      | Depends on scale, tradeoffs, sidecar overhead                    |
| "Database per service, query across services?"    | API Composition, CQRS read model, data replication               |

---

## Anti-Patterns to Avoid

| Anti-Pattern                 | Problem                                  | Solution                                          |
| ---------------------------- | ---------------------------------------- | ------------------------------------------------- |
| **Distributed Monolith**     | Services coupled, deploy together        | Proper bounded contexts, async communication      |
| **Shared Database**          | Schema coupling, bypass business logic   | Database per service, API communication           |
| **Sync chain calls**         | A→B→C→D, latency compounds, fragile      | Async events, or aggregate at gateway             |
| **No idempotency**           | Retries cause duplicate processing       | Idempotency keys, deduplication                   |
| **Chatty services**          | Too many network calls for one operation | Batch APIs, coarser-grained services              |
| **Distributed transactions** | 2PC across services                      | Saga pattern                                      |
| **Big Bang rewrite**         | Rewrite entire monolith at once          | Strangler Fig, incremental migration              |
| **No circuit breaker**       | Cascade failures                         | Circuit breaker + fallback for all external calls |
| **Ignoring CAP theorem**     | Expecting strong consistency everywhere  | Accept eventual consistency, design for it        |

---

## Interview Q&A Summary / Tổng Kết Câu Hỏi Phỏng Vấn

| #   | Question                                  | Difficulty | Core Concept    | Key Signal                                             |
| --- | ----------------------------------------- | ---------- | --------------- | ------------------------------------------------------ |
| Q1  | Monolith vs Microservices comparison      | 🟢         | Architecture    | Trade-offs cả 2, "Monolith First" approach             |
| Q2  | "Monolith First" approach (Martin Fowler) | 🟡         | Architecture    | Start monolith, migrate khi painful, Strangler Fig     |
| Q3  | DDD concepts cho microservices            | 🟡         | Decomposition   | Bounded Context, Ubiquitous Language, Aggregate        |
| Q4  | Service boundaries từ bounded contexts    | 🔴         | Decomposition   | Domain analysis, not technical layers                  |
| Q5  | Strangler Fig Pattern                     | 🟡         | Decomposition   | Incremental migration, wrap legacy with API            |
| Q6  | Anti-patterns trong decomposition         | 🟡         | Decomposition   | Distributed monolith, shared DB, nano-services         |
| Q7  | Sync vs Async communication               | 🟢         | Communication   | Sync=tight coupling, Async=decoupled via broker        |
| Q8  | Request-Reply, Event-Driven, Command      | 🟡         | Communication   | 3 patterns, khi nào dùng gì                            |
| Q9  | Choreography vs Orchestration             | 🔴         | Communication   | Jazz band vs Orchestra, scalability vs debuggability   |
| Q10 | Service Discovery patterns                | 🟡         | Communication   | Client-side vs Server-side, Consul/Eureka/K8s DNS      |
| Q11 | Liveness vs Readiness Probe               | 🟢         | Communication   | Live=process alive, Ready=can serve traffic            |
| Q12 | ACID trong microservices                  | 🟡         | Distributed Tx  | Database-per-service → no cross-service ACID           |
| Q13 | Two-Phase Commit (2PC)                    | 🟡         | Distributed Tx  | Blocking protocol, coordinator SPOF                    |
| Q14 | Saga Pattern chi tiết                     | 🔴         | Distributed Tx  | Choreography/Orchestration, compensating transactions  |
| Q15 | Transactional Outbox/CDC                  | 🔴         | Distributed Tx  | Solve dual-write, Debezium CDC, reliable events        |
| Q16 | Event types classification                | 🟡         | Event-Driven    | Domain events, integration events, notification events |
| Q17 | Event Sourcing pros/cons                  | 🔴         | Event-Driven    | Complete audit trail, replay, complexity trade-off     |
| Q18 | CQRS khi nào nên/không nên                | 🔴         | Event-Driven    | Separate read/write, eventual consistency, overhead    |
| Q19 | Event-Driven vs ES vs CQRS                | 🔴         | Event-Driven    | 3 different concepts, when to combine                  |
| Q20 | Circuit Breaker pattern                   | 🟡         | Resilience      | Closed→Open→Half-Open states, threshold tuning         |
| Q21 | Retry with Exponential Backoff + Jitter   | 🟢         | Resilience      | Prevent thundering herd, jitter randomizes             |
| Q22 | Bulkhead Pattern                          | 🟡         | Resilience      | Isolate failures, thread pool per dependency           |
| Q23 | Fallback Pattern                          | 🟢         | Resilience      | Graceful degradation, cached/default response          |
| Q24 | Service Mesh tại sao cần                  | 🟡         | Observability   | Sidecar proxy, cross-cutting concerns at infra layer   |
| Q25 | Service Mesh vs API Gateway               | 🟡         | Observability   | East-west vs North-south traffic                       |
| Q26 | Three Pillars of Observability            | 🟢         | Observability   | Logs + Metrics + Traces, correlation via trace ID      |
| Q27 | SLI/SLO/SLA và Error Budget               | 🟡         | Observability   | Define → Measure → Alert → Prioritize reliability      |
| Q28 | 12-Factor App methodology                 | 🟢         | Operations      | Config in env, stateless processes, port binding       |
| Q29 | Deployment strategies comparison          | 🟡         | Operations      | Blue-green, canary, rolling — risk vs speed            |
| Q30 | Database per Service challenges           | 🟡         | Data Management | Data consistency, cross-service queries                |
| Q31 | API Composition for cross-service queries | 🟡         | Data Management | Aggregator pattern, CQRS materialized view             |

> **Phân bổ:** 🟢 Junior: 7 | 🟡 Mid: 17 | 🔴 Senior: 7 | **Tổng: 31 câu hỏi**

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn Bất Ngờ

> **Interviewer:** "Your monolith is getting slow to deploy and hard to scale. How would you approach migrating to microservices?"

**30-second answer:**
"I would NOT rewrite from scratch. I'd use the **Strangler Fig Pattern** — identify the most painful bounded context (e.g., the one blocking deploys most), wrap it with an API facade, gradually route traffic to the new service while the monolith still handles the rest. Key prerequisites: **database-per-service** from day one (avoid distributed monolith), invest in **observability** (distributed tracing, centralized logging) before migrating, and use **Saga pattern** for cross-service transactions instead of 2PC. The goal is incremental migration with rollback capability at each step."

**Follow-up:** "What's the biggest risk in this migration?"
→ "Creating a **distributed monolith** — services that are deployed separately but still tightly coupled via shared database or synchronous call chains. The fix is strict bounded context boundaries, async communication where possible, and the Transactional Outbox pattern for reliable event publishing."

---

## Self-Check / Tự Kiểm Tra — Retrieval Practice

> ⏱️ Che cột "Câu hỏi" rồi tự trả lời, sau đó mở ra kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                              |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Khi nào KHÔNG nên dùng microservices? Liệt kê 3 dấu hiệu team chưa sẵn sàng.                                                         |
| 2   | 🎨 Visual      | Vẽ sơ đồ Saga choreography cho order flow: Order → Payment → Inventory → Shipping, kể cả compensation path khi Inventory fail.       |
| 3   | 🛠️ Application | Service Payment đang bị chậm (p99 = 3s). Describe từng bước bạn debug — dùng tool gì, nhìn vào đâu?                                  |
| 4   | 🐛 Debug       | Team vừa migrate sang microservices nhưng thấy "phải deploy Order Svc và Payment Svc cùng lúc mỗi lần release". Lỗi gì? Fix thế nào? |
| 5   | 🎓 Teach       | Giải thích Transactional Outbox Pattern cho một junior developer mới biết microservices — tại sao cần, hoạt động thế nào.            |

💬 **Feynman Prompt:** Giải thích cho một người bạn không biết lập trình: Tại sao khi đặt hàng trên Shopee, đôi khi bạn thấy "đơn hàng đã xác nhận" nhưng tiền chưa bị trừ ngay — sau đó mới thấy thông báo trừ tiền? Đó là vì hệ thống microservices hoạt động thế nào?

### 📅 Spaced Repetition Schedule

| Round | Timing        | Focus                                          |
| ----- | ------------- | ---------------------------------------------- |
| 1     | Day 1 (today) | Đọc toàn bộ, highlight Memory Hooks            |
| 2     | Day 3         | Self-Check without looking — đạt ≥4/5          |
| 3     | Day 7         | Cold Call simulation — trả lời trong 30s       |
| 4     | Day 14        | Q&A 🔴 only — Saga, CQRS, Event Sourcing deep  |
| 5     | Day 30        | Mock interview — design microservice migration |

---

## Connections / Liên Kết

**Cùng track (be-track):**

- ⬅️ [API Design](./01-api-design.md) — REST/gRPC/GraphQL communication between services
- ➡️ [Distributed Systems](./03-distributed-systems.md) — microservices IS distributed systems (CAP, consensus)
- ➡️ [Auth & Security](./04-auth-security.md) — JWT propagation, service-to-service auth (mTLS)
- ➡️ [Resilience Patterns](./07-resilience-patterns.md) — Circuit breaker, retry, bulkhead deep dive
- ➡️ [Message Queues](./08-message-queues.md) — Kafka/RabbitMQ for async communication

**Khác track:**

- 🔗 [System Design](../04-be-system-design/01-design-framework.md) — Microservices decisions in system design interviews
- 🔗 [Database Advanced](../03-database-advanced/01-sql-fundamentals.md) — Database-per-service, sharding, replication
- 🔗 [Kubernetes](../05-devops-infra/01-kubernetes.md) — Container orchestration for microservices deployment
