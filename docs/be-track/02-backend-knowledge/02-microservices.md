# Microservices Architecture - Deep Theory

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

| Aspect | Monolith | Microservices |
|---|---|---|
| **Deployment** | Deploy toàn bộ app | Deploy từng service độc lập |
| **Scaling** | Scale toàn bộ (vertical) | Scale từng service (horizontal) |
| **Tech stack** | Một tech stack duy nhất | Mỗi service chọn tech phù hợp |
| **Team autonomy** | Tất cả team cùng codebase | Mỗi team own một/nhiều service |
| **Debugging** | Dễ - single process, stack trace | Khó - distributed tracing cần thiết |
| **Data consistency** | ACID transactions dễ dàng | Eventual consistency, saga pattern |
| **Network latency** | In-process calls (nanoseconds) | Network calls (milliseconds) |
| **Operational cost** | Thấp - ít infra | Cao - cần CI/CD, monitoring, mesh |
| **Initial velocity** | Nhanh | Chậm (setup overhead lớn) |
| **Long-term velocity** | Giảm dần (coupling) | Ổn định (nếu boundary đúng) |

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

| Protocol | Use Case | Pros | Cons |
|---|---|---|---|
| **REST/HTTP** | CRUD, public APIs, simple queries | Ubiquitous, cacheable, human-readable | Text-based (JSON) → overhead, no streaming |
| **gRPC** | Internal service-to-service, high perf | Binary (protobuf) → nhỏ/nhanh, streaming, code gen, strongly typed | Khó debug (binary), cần protobuf tooling |

**Asynchronous (Message-Based):**

Sender gửi message và **không chờ**. Message được lưu trong broker. Consumer xử lý khi sẵn sàng.

```
Service A ──publish──► [Message Broker] ──deliver──► Service B
    │                  (Kafka/RabbitMQ)
    │ (continues                          (processes
    │  immediately)                        when ready)
    ▼
```

| Pattern | Use Case | Pros | Cons |
|---|---|---|---|
| **Message Queue** | Task processing, work distribution | Load leveling, guaranteed delivery | Queue thêm component cần maintain |
| **Pub/Sub (Event Bus)** | Event notification, fan-out | Loose coupling, nhiều consumers | Message ordering challenges, debugging khó |

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

| Aspect | Choreography | Orchestration |
|---|---|---|
| **Coupling** | Loose — services chỉ biết events | Tighter — orchestrator biết all services |
| **Visibility** | Khó thấy overall flow | Dễ thấy flow trong orchestrator |
| **Single point of failure** | Không có | Orchestrator là SPOF |
| **Complexity** | Tăng khi nhiều services (spaghetti events) | Tập trung trong orchestrator |
| **Adding steps** | Thêm subscriber mới | Sửa orchestrator code |
| **Best for** | Simple flows, < 4 steps | Complex flows, nhiều branching |
| **Example tools** | Kafka, RabbitMQ | Temporal, Cadence, AWS Step Functions |

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

| Tool | Consensus | Features |
|---|---|---|
| **Consul** (HashiCorp) | Raft | Service discovery, health check, KV store, service mesh |
| **etcd** | Raft | KV store, dùng làm backbone cho Kubernetes |
| **ZooKeeper** | ZAB | Mature, complex, dùng cho Kafka (đang dần loại bỏ) |

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

| Problem | Giải thích |
|---|---|
| **Blocking** | Participants phải lock resources trong toàn bộ quá trình, giảm throughput |
| **Coordinator SPOF** | Nếu coordinator crash giữa phase 1 và 2, participants bị stuck (resources locked vô thời hạn) |
| **Latency** | Mỗi phase cần network round-trip tới tất cả participants |
| **Not supported** | Nhiều modern databases (NoSQL) và message brokers không support 2PC |
| **Coupling** | Tất cả participants phải available cùng lúc |

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

| Aspect | Choreography Saga | Orchestration Saga |
|---|---|---|
| **Coordinator** | Không có, mỗi service tự biết bước tiếp | OrderSaga orchestrator quản lý flow |
| **Coupling** | Services chỉ know events | Orchestrator knows tất cả services |
| **Visibility** | Flow nằm rải rác trong code của mỗi service | Flow tập trung, dễ đọc |
| **Testing** | Khó test end-to-end | Dễ test orchestrator logic |
| **Cyclic deps** | Dễ tạo circular event chains | Không có cyclic deps |
| **Adding steps** | Add subscriber mới (distributed change) | Sửa orchestrator (centralized change) |
| **Best for** | 2-4 simple steps | Complex flows, conditional logic, nhiều branches |
| **Go tools** | Kafka consumers, NATS | Temporal, go-saga libraries |

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

| Event Type | Mục đích | Payload | Ví dụ |
|---|---|---|---|
| **Event Notification** | Thông báo something happened, minimal data | Chỉ chứa ID + event type | `{type: "OrderPlaced", orderId: "123"}` |
| **Event-Carried State Transfer** | Chứa đủ data để consumer không cần callback | Full entity data | `{type: "OrderPlaced", order: {id, items, total, ...}}` |
| **Domain Event** | Internal within bounded context | Domain-specific | `OrderSubmitted` (trong Order domain) |
| **Integration Event** | Cross bounded context | Translated for external consumption | `OrderCreatedIntegrationEvent` |

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

| Concept | Definition | Scope |
|---|---|---|
| **Event-Driven Architecture** | Services communicate qua events | **Communication pattern** giữa services |
| **Event Sourcing** | Lưu state changes thành events | **Persistence pattern** trong 1 service |
| **CQRS** | Tách read/write models | **Architecture pattern** trong 1 service |

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

| Layer | Role | Components |
|---|---|---|
| **Data Plane** | Handle actual network traffic giữa services | Envoy sidecar proxies |
| **Control Plane** | Configure và manage proxies, push policies | istiod (Istio), Linkerd control plane |

**What Service Mesh handles:**
- **mTLS** — Automatic mutual TLS giữa tất cả services (zero-trust networking)
- **Traffic management** — Routing, load balancing, canary deployments, traffic splitting
- **Observability** — Distributed tracing, metrics, access logs (automatic, no code change)
- **Resilience** — Retries, timeouts, circuit breaking (configured at infra level)
- **Rate limiting** — Control request rates per service

### Q: Service Mesh vs API Gateway? 🟡 🟡 [Mid]

| Aspect | API Gateway | Service Mesh |
|---|---|---|
| **Position** | Edge — giữa client và services | Interior — giữa services |
| **Traffic** | North-South (external → internal) | East-West (internal ↔ internal) |
| **Focus** | API management, auth, rate limit | Inter-service networking |
| **Implementation** | Centralized proxy | Distributed sidecars |
| **mTLS** | Client → Gateway only | Service ↔ Service (full mesh) |
| **Examples** | Kong, AWS API GW, Nginx | Istio, Linkerd, Consul Connect |

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

| # | Factor | Giải thích | Go Relevance |
|---|---|---|---|
| 1 | **Codebase** | Một codebase tracked trong VCS, nhiều deploys (dev, staging, prod) | Mono-repo hoặc một repo per service |
| 2 | **Dependencies** | Khai báo và isolate dependencies rõ ràng | `go.mod` + `go.sum` |
| 3 | **Config** | Config lưu trong environment variables, KHÔNG trong code | `os.Getenv()`, Viper |
| 4 | **Backing services** | Treat backing services (DB, cache, queue) như attached resources, swap được | Connection strings trong env vars |
| 5 | **Build, release, run** | Tách rõ build stage, release stage, run stage | Docker multi-stage build |
| 6 | **Processes** | App chạy như stateless processes, không lưu state trên local disk | Go services nên stateless, session vào Redis |
| 7 | **Port binding** | Export service qua port binding, self-contained | `http.ListenAndServe(":8080", ...)` |
| 8 | **Concurrency** | Scale out qua process model (nhiều instances) | Kubernetes replicas |
| 9 | **Disposability** | Fast startup, graceful shutdown | `signal.NotifyContext`, `server.Shutdown()` |
| 10 | **Dev/prod parity** | Giữ dev, staging, prod giống nhau nhất có thể | Docker + docker-compose cho local dev |
| 11 | **Logs** | Treat logs như event streams, write to stdout | `log.Printf` → stdout → log collector |
| 12 | **Admin processes** | Run admin/management tasks như one-off processes | DB migration scripts, CLI commands |

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

| Strategy | Downtime | Rollback Speed | Resource Cost | Risk | Complexity |
|---|---|---|---|---|---|
| **Blue-Green** | Zero | Instant (switch back) | 2x resources | Low | Medium |
| **Canary** | Zero | Fast (route back) | 1x + small | Very Low | High |
| **Rolling** | Zero | Slow (roll back 1-by-1) | 1x | Medium | Low |
| **Recreate** | Yes | Slow (redeploy old) | 1x | High | Very Low |

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

| Question | Key Points to Cover |
|---|---|
| "Thiết kế order processing system" | Saga pattern, event-driven, eventual consistency, idempotency |
| "Service A gọi B gọi C, C chậm/down thì sao?" | Circuit breaker, timeout, retry, fallback, bulkhead |
| "Làm sao đảm bảo data consistency giữa services?" | Saga (choreography vs orchestration), outbox pattern, CDC |
| "Monitoring microservices thế nào?" | 3 pillars, RED method, distributed tracing, SLO/SLI |
| "Migrate monolith sang microservices?" | Strangler Fig, modular monolith first, identify bounded contexts |
| "Event sourcing vs traditional CRUD?" | When to use, tradeoffs, projections, snapshots |
| "gRPC vs REST?" | Binary vs text, streaming, code gen, when to use each |
| "Service mesh có cần không?" | Depends on scale, tradeoffs, sidecar overhead |
| "Database per service, query across services?" | API Composition, CQRS read model, data replication |

---

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|---|---|---|
| **Distributed Monolith** | Services coupled, deploy together | Proper bounded contexts, async communication |
| **Shared Database** | Schema coupling, bypass business logic | Database per service, API communication |
| **Sync chain calls** | A→B→C→D, latency compounds, fragile | Async events, or aggregate at gateway |
| **No idempotency** | Retries cause duplicate processing | Idempotency keys, deduplication |
| **Chatty services** | Too many network calls for one operation | Batch APIs, coarser-grained services |
| **Distributed transactions** | 2PC across services | Saga pattern |
| **Big Bang rewrite** | Rewrite entire monolith at once | Strangler Fig, incremental migration |
| **No circuit breaker** | Cascade failures | Circuit breaker + fallback for all external calls |
| **Ignoring CAP theorem** | Expecting strong consistency everywhere | Accept eventual consistency, design for it |
