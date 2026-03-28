# Architecture Styles / Các Phong Cách Kiến Trúc

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [SOLID & Design Patterns](./01-solid-and-design-patterns.md)
> **See also**: [SOLID & Design Patterns](./01-solid-and-design-patterns.md) | [System Design Theory](../02-system-design/system-design-theory.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Netflix bắt đầu là một monolith Ruby on Rails app. Khi scale lên 100M+ users, mỗi lần deploy một tính năng nhỏ đòi hỏi test và redeploy TOÀN BỘ ứng dụng. Một bug nhỏ trong payments code có thể làm sập video streaming.

**Quyết định**: Migrate sang microservices — 500+ services, mỗi service deploy độc lập. Kết quả: payments deploy không ảnh hưởng video streaming.

**Nhưng**: Martin Fowler nói "Don't start with microservices." — tại sao? Vì microservices là complexity trả trước cho benefit sau. Với team nhỏ, monolith thường là lựa chọn tốt hơn.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng:**

- **Monolith** = căn hộ: một không gian, dễ xây, nhưng sửa một phòng ảnh hưởng phòng khác
- **Microservices** = chung cư: nhiều căn độc lập, nhưng cần quản lý hạ tầng chung
- **Serverless** = khách sạn: chỉ trả tiền khi có khách, không lo maintenance

**Decision framework:**

| Câu hỏi                        | Gợi ý                     |
| ------------------------------ | ------------------------- |
| Team < 10 người?               | Monolith — đơn giản hơn   |
| Cần scale từng part độc lập?   | Microservices             |
| Workload spiky, không đều?     | Serverless                |
| Event-driven, loosely coupled? | Event-driven architecture |
| Legacy system integration?     | Strangler fig pattern     |

---

## Concept Map / Bản Đồ Khái Niệm

```
      [SOLID Principles] + [System Design]
                    │
                    ▼
         [ARCHITECTURE STYLES]  ← bạn đang ở đây
                    │
         ┌──────────┼──────────┐
         ▼          ▼          ▼
  [Monolith]  [Microservices] [Event-driven]
  Layered      Service mesh    Event sourcing
  Hexagonal    API Gateway     CQRS / Pub-Sub
  Clean Arch   Service disco   Choreography
         │
         ▼
  [Serverless / Edge]
  FaaS | BaaS | Edge functions
         │
         ▼
  [Frontend Architecture]
  MPA | SPA | SSR | Islands | Micro-frontends
```

---

## Visual: Architecture Evolution / Tiến Hóa Kiến Trúc

```
MONOLITH → SOA → MICROSERVICES → SERVERLESS

MONOLITH:
  ┌────────────────────────────────────┐
  │          Single Deployable Unit    │
  │  [UI] [Business Logic] [Data Layer]│
  │              │                     │
  │              ▼                     │
  │         [Single DB]                │
  └────────────────────────────────────┘
  + Simple to develop and deploy
  + Easy transactions across modules
  - Scale everything together or nothing
  - One bug can crash entire app

MICROSERVICES:
  [User Service]──┐
  [Order Service]─┤
  [Payment Svc]───┤──[API Gateway]──[Client]
  [Product Svc]───┤
  [Search Svc]────┘
  Each service:    + Independent deployment
    own DB         + Scale independently
    own team       - Network latency
    own repo       - Distributed transactions hard
                   - Operational complexity

EVENT-DRIVEN:
  Service A ──publishes──► [Event Bus] ──subscribes──► Service B
                                       └──subscribes──► Service C
  + Loose coupling (A doesn't know about B,C)
  + Async = higher throughput
  - Eventual consistency (not immediate)
  - Hard to trace request flow
  - Order of events matters

SERVERLESS (FaaS):
  HTTP trigger → [Function] → return response
  + No server management
  + Auto-scaling to zero
  - Cold start latency (100ms-3s)
  - Max execution time limits
  - Hard to test locally
```

### When to Choose What / Khi Nào Chọn Gì

```
START HERE → Monolith
              │
              Is the team > 10 engineers?     NO → Stay monolith
              │ YES
              Is there a clear service boundary?  NO → Stay monolith
              │ YES
              Are different parts scaling differently? NO → Consider modular monolith
              │ YES
              ▼
         Microservices
              │
              Do you need async processing?    YES → Add Event-Driven
              Do you have variable traffic?    YES → Consider Serverless for parts
```

---

## 1. Monolithic Architecture — Monolithic Architecture trong thực tế

> 🧠 **Memory Hook:** "**Một mình làm tất**" — monolith = tiệm tạp hóa 1 chủ, 1 mái nhà, 1 két tiền. Một codebase, một deploy, một database.

**Tại sao tồn tại? / Why does this exist?**

Khi bắt đầu xây phần mềm, cần ship nhanh với ít người và domain chưa rõ ràng. → **Why?** Coordinate nhiều team tốn kém hơn là viết chung một codebase — mỗi microservice call thêm là thêm network, thêm retry, thêm ops. → **Why?** Distributed systems là complexity trả trước; với domain chưa ổn định, tách sớm gây chia cắt sai ranh giới và tạo ra distributed monolith tệ hơn.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tiệm tạp hóa của bà Lan ở góc phố — một mình bán gạo, nước ngọt, bánh kẹo, và thu tiền. Mọi thứ nằm trong một căn nhà duy nhất: lấy hàng nhanh, không cần hẹn giờ với ai. Nhưng khi shop đông khách quá, chỉ mình bà Lan không thể phục vụ hết. Và nếu bà bệnh, cả tiệm đóng cửa — không có "đồng nghiệp khác" tự chạy tiếp.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

1. Một codebase duy nhất chứa toàn bộ modules (UI, business logic, data access)
2. Build → một artifact duy nhất (JAR, Docker image, binary)
3. Deploy → tất cả modules chạy trong cùng một process
4. Function call là in-process → không có network latency giữa các module
5. Một database chung → ACID transactions đơn giản, không cần distributed saga

```
┌──────────────────────────────────────┐
│          Monolith Process            │
│  ┌──────────┐ ┌──────────┐ ┌──────┐ │
│  │  UI /    │→│ Business │→│  DB  │ │
│  │ Controller│ │  Logic   │ │Layer │ │
│  └──────────┘ └──────────┘ └──────┘ │
│     in-process calls (no network)    │
└──────────────────────────────────────┘
           │ single artifact
           ▼
     [Production Server]
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Scale bottleneck**: muốn scale chỉ phần payment thì phải scale toàn bộ app → lãng phí resource khi các module có load khác nhau
- **Long build times**: thay đổi 1 dòng code phải retest toàn bộ suite → CI/CD chậm dần khi codebase đạt hàng trăm nghìn dòng
- **Technology lock-in**: toàn codebase dùng chung language/framework; không thể dùng Go cho performance-critical module
- **Big ball of mud**: thiếu kỷ luật thì module boundaries nhòa dần → monolith rối loạn còn khó maintain hơn cả microservices

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                                     | Đúng là                                                  |
| --------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------- |
| Ngay từ đầu chia microservices vì "sẽ scale"  | Domain chưa rõ → chia sai ranh giới, gây distributed monolith   | Bắt đầu monolith modular, tách khi có pain point đo được |
| Deploy monolith mà không có module boundaries | Mọi layer phụ thuộc nhau → thay đổi nhỏ gây regression lan rộng | Áp dụng bounded context ngay trong monolith              |
| Nghĩ monolith = bad, microservices = good     | Kiến trúc phụ thuộc ngữ cảnh, không có "best" tuyệt đối         | Đánh giá theo team size, domain stability, budget        |

**🎯 Interview Pattern:**

- Khi thấy: câu hỏi "monolith vs microservices khi nào chọn?" → Nhớ đến: team size + domain stability + pain point thực tế → Mở đầu: "Tôi sẽ bắt đầu với monolith modular vì chi phí phối hợp thấp hơn, và chỉ tách service khi có pain point cụ thể đo được như release bottleneck hoặc scaling mismatch."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [SOLID & Design Patterns](./01-solid-and-design-patterns.md)
- ➡️ Để hiểu tiếp: [Microservices Architecture](#2-microservices-architecture----microservices-architecture-trong-thực-tế)

### 🟢 Q: What is Monolithic Architecture? `[Junior]`

**A:** Một codebase, một deployable unit, thường một database chung.

**Ưu điểm:**

- Tăng độ rõ ràng về ranh giới trách nhiệm.
- Hỗ trợ scale kỹ thuật hoặc scale tổ chức tùy mô hình.
- Giúp team giao tiếp bằng ngôn ngữ kiến trúc chuẩn.

**Nhược điểm:**

- Có trade-off về độ phức tạp triển khai/vận hành.
- Cần kỷ luật engineering và observability.
- Sai ngữ cảnh sẽ tạo overhead không cần thiết.

**When to use:**

- Đánh giá theo team size, domain volatility, SLA, compliance và budget.
- Ưu tiên mô hình đơn giản nhất đáp ứng được yêu cầu hiện tại + near future.

```text
Business Requirement
  -> Quality Attributes (scalability, reliability, speed)
    -> Candidate: Monolithic Architecture
      -> Risks + Mitigations
```

```ts
// architecture sketch
interface UseCase<I, O> {
  execute(input: I): Promise<O>;
}
interface Repository<T> {
  save(entity: T): Promise<void>;
}
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O;
    await this.repo.save(output);
    return output;
  }
}
```

## 2. Microservices Architecture — Microservices Architecture trong thực tế

> 🧠 **Memory Hook:** "**Mỗi gian hàng tự trị**" — microservices = trung tâm thương mại, mỗi shop độc lập: nhân viên riêng, máy tính tiền riêng, kho hàng riêng.

**Tại sao tồn tại? / Why does this exist?**

Khi monolith quá lớn, một bug trong payments làm sập video streaming vì chúng cùng process. → **Why?** Các team khác nhau cần deploy theo nhịp riêng mà không phải đợi nhau test và release cùng lúc. → **Why?** Conway's Law: cấu trúc hệ thống phản chiếu cấu trúc team giao tiếp; để team scale độc lập, service boundary phải tương ứng.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Trung tâm thương mại Vincom có hàng trăm cửa hàng — Nike, KFC, rạp phim, siêu thị. Mỗi gian hàng tự quản lý nhân sự, hàng hóa, và máy tính tiền riêng. Siêu thị đông khách cuối tuần thì mở thêm quầy — không ảnh hưởng rạp phim. Nhưng nếu điện tòa nhà cúp (shared infrastructure), tất cả cùng tắt — đây là điểm chung phải quản lý.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
        [API Gateway / Load Balancer]
                    │
     ┌──────────────┼──────────────┐
     ▼              ▼              ▼
[User Svc]    [Order Svc]   [Payment Svc]
 own DB (PG)  own DB (MySQL) own DB (Redis+PG)
 own team      own CI/CD      own SLA
     │              │              │
     └──────[Message Broker]───────┘
            (Kafka / RabbitMQ)
```

1. Mỗi service có database riêng → không shared schema, không coupling ngầm
2. Giao tiếp qua API (sync/gRPC) hoặc event (async/Kafka)
3. Deploy độc lập → thay đổi Order Service không ảnh hưởng Payment Service
4. Scale từng service theo load → User Service x3, Payment Service x1

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Distributed monolith**: chia service nhưng gọi synchronous A→B→C→D — một service chậm làm cả chain chậm; worst case của microservices
- **Data consistency**: transaction across services phức tạp → phải dùng Saga pattern, eventual consistency thay vì ACID
- **Network overhead**: mỗi call giữa service = network hop → latency tăng, failure modes mới (timeout, retry storm, circuit breaker)
- **Operational overhead**: cần service discovery, distributed tracing, centralized logging — cost cực kỳ cao cho team nhỏ < 5 người

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                                   | Tại sao sai                                                | Đúng là                                          |
| ------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------ |
| Chia service theo technical layer (Controller svc, Service svc, Repo svc) | Tạo distributed monolith — mọi request đi qua cả 3 service | Chia theo business capability / bounded context  |
| Dùng shared database write giữa services                                  | Phá vỡ service autonomy, tạo coupling ngầm qua schema      | Mỗi service owns data, tích hợp qua API/event    |
| Deploy microservices khi team < 5 người                                   | Operational overhead ngốn hết bandwidth engineering        | Bắt đầu modular monolith, tách khi team đã scale |

**🎯 Interview Pattern:**

- Khi thấy: "Design a system for X million users" → Nhớ đến: bounded context + independent scaling → Mở đầu: "Tôi sẽ xác định bounded contexts trước, sau đó quyết định service boundary dựa trên team structure và scaling requirement khác nhau của từng domain."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Monolithic Architecture](#1-monolithic-architecture----monolithic-architecture-trong-thực-tế)
- ➡️ Để hiểu tiếp: [System Design Theory](../02-system-design/system-design-theory.md)

### 🟡 Q: What is Microservices Architecture? `[Mid]`

**A:** Nhiều service nhỏ, deploy độc lập, ownership theo domain.

**Ưu điểm:**

- Tăng độ rõ ràng về ranh giới trách nhiệm.
- Hỗ trợ scale kỹ thuật hoặc scale tổ chức tùy mô hình.
- Giúp team giao tiếp bằng ngôn ngữ kiến trúc chuẩn.

**Nhược điểm:**

- Có trade-off về độ phức tạp triển khai/vận hành.
- Cần kỷ luật engineering và observability.
- Sai ngữ cảnh sẽ tạo overhead không cần thiết.

**When to use:**

- Đánh giá theo team size, domain volatility, SLA, compliance và budget.
- Ưu tiên mô hình đơn giản nhất đáp ứng được yêu cầu hiện tại + near future.

```text
Business Requirement
  -> Quality Attributes (scalability, reliability, speed)
    -> Candidate: Microservices Architecture
      -> Risks + Mitigations
```

**Decomposition strategies (microservices):**

- By bounded context: Billing, Catalog, Order, Identity.
- By business capability: Checkout, Search, Recommendation.
- Avoid: split by technical layer (all repositories service riêng).

**Communication patterns:**

- Sync: HTTP/gRPC (request-response, dễ hiểu).
- Async: message broker (decoupling tốt, eventual consistency).
- Saga choreography/orchestration cho transaction phân tán.

```ts
// architecture sketch
interface UseCase<I, O> {
  execute(input: I): Promise<O>;
}
interface Repository<T> {
  save(entity: T): Promise<void>;
}
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O;
    await this.repo.save(output);
    return output;
  }
}
```

## 3. Serverless Architecture — Serverless Architecture trong thực tế

> 🧠 **Memory Hook:** "**Gọi là có, xong là mất**" — serverless = gọi xe Grab, chạy xong trả tiền đúng chuyến, không cần nuôi tài xế 24/7.

**Tại sao tồn tại? / Why does this exist?**

Nhiều workload chỉ chạy vài giây mỗi ngày nhưng phải trả tiền server 24/7 dù idle. → **Why?** Provisioning và managing server tốn nhân lực ops mà không tạo business value trực tiếp. → **Why?** Cloud provider có thể pool server cho hàng nghìn tenant, charge per-use — chi phí thực tế rẻ hơn nhiều so với dedicated server cho spike traffic không đều.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bạn cần giao một kiện hàng. Thay vì mua xe máy, thuê tài xế, mua xăng, đóng bảo hiểm — bạn chỉ mở app Grab, đặt xe, xong việc trả tiền đúng chuyến đó. Không có hàng thì không tốn đồng nào. Có 100 kiện cùng lúc thì 100 tài xế xuất hiện tự động. Nhưng nếu tài xế phải di chuyển từ xa đến lấy hàng mới bắt đầu chạy — đó chính là "cold start".

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
HTTP Request / Cron / Queue Event
          │
          ▼
  [Cloud Runtime checks: warm instance?]
          │ NO (cold)           │ YES (warm)
          ▼                     ▼
  [Spin up container]     [Execute directly]
   ~100ms – 3s cold              ~ms
          └──────────┬───────────┘
                     ▼
            [Execute Function]
                     │
                     ▼
          [Return response / write DB]
                     │
          [Container idle → scale to 0]

Cost = invocations × execution_time_ms × memory_GB
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Cold start latency**: function không được gọi thường xuyên bị "đông lạnh" → request đầu tiên delay 100ms-3s → không phù hợp real-time low-latency API
- **Execution time limit**: AWS Lambda max 15 phút, Cloudflare Workers max 30s → long-running batch jobs hoàn toàn không phù hợp
- **Vendor lock-in**: function code gắn chặt platform-specific trigger format (API Gateway event shape) → khó migrate sang provider khác
- **Local debugging khó**: không thể emulate chính xác cloud environment locally → dev feedback loop chậm hơn server truyền thống

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                          | Tại sao sai                                                   | Đúng là                                                            |
| ------------------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| Dùng serverless cho long-running job (> 15 phút) | Vượt timeout limit, bị cắt giữa chừng, không thể resume       | Dùng serverless cho short tasks; SQS + EC2/container cho long jobs |
| Ignore cold start trong SLA                      | User thấy delay bất thường khi traffic thấp, khó debug        | Dùng provisioned concurrency hoặc keep-warm ping strategy          |
| Không set memory / timeout đúng                  | Memory quá cao → cost tăng vô lý; timeout quá thấp → fail sớm | Profile function thực tế, set memory và timeout dựa trên p95 data  |

**🎯 Interview Pattern:**

- Khi thấy: "Traffic rất bất thường, có lúc 0, có lúc spike 1000x" → Nhớ đến: serverless = auto-scale to zero + pay-per-use → Mở đầu: "Với traffic profile không đều như vậy, tôi sẽ cân nhắc serverless vì cost model phù hợp và không cần capacity planning thủ công."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Microservices Architecture](#2-microservices-architecture----microservices-architecture-trong-thực-tế)
- ➡️ Để hiểu tiếp: [Event-Driven Architecture](#4-event-driven-architecture----event-driven-architecture-trong-thực-tế)

### 🟡 Q: What is Serverless Architecture? `[Mid]`

**A:** Chạy theo event/invocation, trả phí theo usage, hạ tầng được managed.

**Ưu điểm:**

- Tăng độ rõ ràng về ranh giới trách nhiệm.
- Hỗ trợ scale kỹ thuật hoặc scale tổ chức tùy mô hình.
- Giúp team giao tiếp bằng ngôn ngữ kiến trúc chuẩn.

**Nhược điểm:**

- Có trade-off về độ phức tạp triển khai/vận hành.
- Cần kỷ luật engineering và observability.
- Sai ngữ cảnh sẽ tạo overhead không cần thiết.

**When to use:**

- Đánh giá theo team size, domain volatility, SLA, compliance và budget.
- Ưu tiên mô hình đơn giản nhất đáp ứng được yêu cầu hiện tại + near future.

```text
Business Requirement
  -> Quality Attributes (scalability, reliability, speed)
    -> Candidate: Serverless Architecture
      -> Risks + Mitigations
```

**FaaS/BaaS terms:**

- FaaS: deploy function theo event (HTTP, queue, cron).
- BaaS: auth, DB, storage managed service.
- Cold start: latency tăng cho request đầu.
- Cost model: pay-per-request + execution time + memory.

```ts
// architecture sketch
interface UseCase<I, O> {
  execute(input: I): Promise<O>;
}
interface Repository<T> {
  save(entity: T): Promise<void>;
}
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O;
    await this.repo.save(output);
    return output;
  }
}
```

## 4. Event-Driven Architecture — Event-Driven Architecture trong thực tế

> 🧠 **Memory Hook:** "**Gửi thư không cần gặp mặt**" — event-driven = bưu điện, người gửi không biết người nhận xử lý lúc nào, mỗi bên làm việc của mình.

**Tại sao tồn tại? / Why does this exist?**

Khi service A cần báo cho B, C, D điều gì đó đã xảy ra, gọi trực tiếp A→B→C→D tạo coupling và failure chain — B lỗi thì A không xử lý được dù công việc của A hoàn toàn đúng. → **Why?** Direct call nghĩa là producer phải biết tất cả consumers và chờ tất cả phản hồi — hệ thống tight-coupled, fragile. → **Why?** Async event cho phép A hoàn thành ngay, còn B/C/D retry riêng khi sẵn sàng — separation of concerns thực sự.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bưu điện Hà Nội: bạn viết thư, gửi vào hòm thư. Bưu điện nhận, phân loại, chuyển đến địa chỉ. Người nhận có thể đọc sáng, tối, hay để ngày mai — bạn không cần ngồi chờ. Nếu người nhận vắng nhà, bưu điện cất thư lại và thử lại sau. Bạn đã làm xong việc của mình ngay lúc bỏ thư vào hòm.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
[Order Service]
      │ emit: OrderPlaced { orderId, amount, userId }
      ▼
[Event Broker: Kafka / RabbitMQ / SQS]
      │
      ├──────────────────────┬──────────────────────┐
      ▼                      ▼                      ▼
[Email Service]     [Inventory Service]     [Billing Service]
 subscribe:          subscribe:              subscribe:
 OrderPlaced         OrderPlaced             OrderPlaced
 → send confirm      → reduce stock          → generate invoice
 (retry + DLQ)       (retry + DLQ)           (retry + DLQ)

Key: Producer KHÔNG biết ai consume — loose coupling thực sự
     Event = fact đã xảy ra (past tense: "OrderPlaced", not "PlaceOrder")
     DLQ = Dead Letter Queue, nơi event lỗi được cất để audit/retry
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Eventual consistency**: Email service nhận event sau 200ms → user thấy "Order confirmed" trước khi email đến → UI phải handle trạng thái "processing" hợp lý
- **Event ordering**: Kafka đảm bảo order trong cùng partition; consumer nhiều instance xử lý order khác nhau → phải design idempotent consumer
- **Poison pill**: event có format sai hoặc data corrupt → consumer crash loop → cần DLQ + alert + manual investigation
- **Schema evolution**: producer đổi event schema → consumer cũ break → cần backward-compatible schema versioning (Avro/Protobuf/CloudEvents)

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                               | Tại sao sai                                                            | Đúng là                                                             |
| ----------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Consumer không idempotent                             | Event deliver at-least-once → xử lý 2 lần gây duplicate (charge 2 lần) | Luôn check event ID đã xử lý chưa trước khi process (deduplication) |
| Bỏ qua DLQ                                            | Event lỗi biến mất không trace được, mất data âm thầm                  | Cấu hình DLQ + alert + retry policy rõ ràng cho mọi consumer        |
| Dùng EDA cho flow cần strong consistency ngay lập tức | Eventual consistency không phù hợp payment final confirmation          | Dùng sync call cho critical path, async event cho side effects      |

**🎯 Interview Pattern:**

- Khi thấy: "Khi user đặt hàng, cần gửi email, cập nhật kho, thông báo seller đồng thời..." → Nhớ đến: event-driven = loose coupling, retry độc lập → Mở đầu: "Tôi sẽ emit event `OrderPlaced` và để các service downstream subscribe độc lập — Order Service không bị block bởi Email Service, mỗi consumer tự retry khi cần."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Microservices Architecture](#2-microservices-architecture----microservices-architecture-trong-thực-tế)
- ➡️ Để hiểu tiếp: [System Design Theory](../02-system-design/system-design-theory.md)

### 🔴 Q: What is Event-Driven Architecture? `[Senior]`

**A:** Thành phần giao tiếp qua event bất đồng bộ thay vì gọi trực tiếp.

**Ưu điểm:**

- Tăng độ rõ ràng về ranh giới trách nhiệm.
- Hỗ trợ scale kỹ thuật hoặc scale tổ chức tùy mô hình.
- Giúp team giao tiếp bằng ngôn ngữ kiến trúc chuẩn.

**Nhược điểm:**

- Có trade-off về độ phức tạp triển khai/vận hành.
- Cần kỷ luật engineering và observability.
- Sai ngữ cảnh sẽ tạo overhead không cần thiết.

**When to use:**

- Đánh giá theo team size, domain volatility, SLA, compliance và budget.
- Ưu tiên mô hình đơn giản nhất đáp ứng được yêu cầu hiện tại + near future.

```text
Business Requirement
  -> Quality Attributes (scalability, reliability, speed)
    -> Candidate: Event-Driven Architecture
      -> Risks + Mitigations
```

**Core concepts:**

- Event: fact đã xảy ra trong quá khứ (`OrderPlaced`).
- Event bus/broker: kênh phân phối event.
- Consumer: xử lý side effects độc lập.
- Event sourcing: lưu chuỗi event làm source of truth.

```ts
// architecture sketch
interface UseCase<I, O> {
  execute(input: I): Promise<O>;
}
interface Repository<T> {
  save(entity: T): Promise<void>;
}
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O;
    await this.repo.save(output);
    return output;
  }
}
```

## 5. Layered Architecture — Layered Architecture trong thực tế

> 🧠 **Memory Hook:** "**Tầng trên gọi tầng dưới, không vượt cấp**" — layered = tòa nhà văn phòng, thang máy chỉ đi từ tầng này sang tầng kế, không nhảy cóc.

**Tại sao tồn tại? / Why does this exist?**

Khi code đan xen nhau — UI query thẳng DB, business logic nằm trong SQL — thay đổi DB schema phá vỡ UI response format. → **Why?** Mỗi concern (presentation, logic, persistence) thay đổi vì lý do khác nhau, cần được isolate để không cascade. → **Why?** Separation of concerns là nguyên tắc căn bản: một module thay đổi không nên buộc module khác phải thay đổi theo.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tòa nhà Keangnam có 72 tầng. Tầng 1 là lobby — tiếp đón khách và điều phối (Presentation Layer). Tầng 20-50 là văn phòng làm việc — xử lý nghiệp vụ thực sự (Business Logic Layer). Tầng hầm là kho lưu trữ và server (Data Access Layer). Khách vào lobby không được đi thẳng xuống hầm kho — phải qua văn phòng trung gian. Quy tắc này giúp quản lý an ninh và vận hành rõ ràng.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
┌──────────────────────────────────────┐
│  Presentation Layer (Controller)     │ ← HTTP request đến đây
│  Validate input, format output, auth │
└──────────────────┬───────────────────┘
                   │ calls (downward only)
┌──────────────────▼───────────────────┐
│  Business Logic Layer (Service)      │ ← Pure domain rules, calculations
│  No HTTP, no SQL — just logic        │
└──────────────────┬───────────────────┘
                   │ calls (downward only)
┌──────────────────▼───────────────────┐
│  Data Access Layer (Repository)      │ ← SQL, ORM, cache, external API
│  Wraps DB, hides persistence details │
└──────────────────┬───────────────────┘
                   │
            [Database / Cache]

RULE: upper layer → lower layer ✅
      lower layer → upper layer ❌ (never)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Layer skip**: Controller gọi thẳng Repository bỏ qua Service layer → business rules bypass, validation mất tác dụng, logic duplicated
- **Fat service layer**: Service biết HTTP status code, format JSON response → presentation concern leak vào business layer, khó test
- **Anemic domain model**: Service quá nhiều logic, Entity chỉ là dumb data holder → vi phạm OOP, behavior không đặt cạnh data
- **Transitive dependency**: thêm caching layer giữa Service và Repository → phải update toàn bộ code trung gian nếu interface không được define rõ

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                                   | Đúng là                                             |
| --------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------- |
| Controller gọi thẳng Repository               | Business rules bị bỏ qua, validation không nhất quán          | Controller chỉ gọi Service; Service gọi Repository  |
| Để DB model (ORM entity) leak lên Controller  | Thay đổi DB schema phá UI response format                     | Dùng DTO để map và tách biệt giữa các layers        |
| Business logic nằm trong SQL stored procedure | Không test được, khó version control, DB trở thành bottleneck | Logic trong Service layer, DB chỉ lưu trữ thuần túy |

**🎯 Interview Pattern:**

- Khi thấy: "Làm sao tổ chức code cho dễ maintain và test?" → Nhớ đến: layered = separation of concerns, mỗi layer một trách nhiệm → Mở đầu: "Tôi sẽ chia thành 3 layer rõ ràng: Controller nhận request và validate, Service xử lý business logic thuần túy, Repository tương tác DB — dependency chỉ đi xuống."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [SOLID & Design Patterns](./01-solid-and-design-patterns.md)
- ➡️ Để hiểu tiếp: [Hexagonal Architecture](#6-hexagonal-architecture-ports--adapters----hexagonal-architecture-ports--adapters-trong-thực-tế)

### 🟢 Q: What is Layered Architecture? `[Junior]`

**A:** Tách lớp presentation, application/business, data access.

**Ưu điểm:**

- Tăng độ rõ ràng về ranh giới trách nhiệm.
- Hỗ trợ scale kỹ thuật hoặc scale tổ chức tùy mô hình.
- Giúp team giao tiếp bằng ngôn ngữ kiến trúc chuẩn.

**Nhược điểm:**

- Có trade-off về độ phức tạp triển khai/vận hành.
- Cần kỷ luật engineering và observability.
- Sai ngữ cảnh sẽ tạo overhead không cần thiết.

**When to use:**

- Đánh giá theo team size, domain volatility, SLA, compliance và budget.
- Ưu tiên mô hình đơn giản nhất đáp ứng được yêu cầu hiện tại + near future.

```text
Business Requirement
  -> Quality Attributes (scalability, reliability, speed)
    -> Candidate: Layered Architecture
      -> Risks + Mitigations
```

```ts
// architecture sketch
interface UseCase<I, O> {
  execute(input: I): Promise<O>;
}
interface Repository<T> {
  save(entity: T): Promise<void>;
}
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O;
    await this.repo.save(output);
    return output;
  }
}
```

## 6. Hexagonal Architecture (Ports & Adapters) — Hexagonal Architecture (Ports & Adapters) trong thực tế

> 🧠 **Memory Hook:** "**Cắm vào đâu cũng chạy**" — hexagonal = ổ cắm đa năng, domain core không quan tâm nguồn điện từ đâu, chỉ cần đúng interface.

**Tại sao tồn tại? / Why does this exist?**

Layered architecture vẫn có vấn đề: business logic import ORM annotation trực tiếp → khó test isolated vì phải spin up database thật. → **Why?** Concrete dependency (import MySQL driver trong Service) khiến test chậm, brittle, và coupling infra vào domain. → **Why?** Dependency Inversion Principle: business logic nên depend vào abstraction (interface), không depend vào concrete infra — swap DB chỉ cần viết adapter mới.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bộ sạc laptop có đầu cắm đa năng — cắm được ổ điện Việt Nam (2 chân tròn), Singapore (3 chân vuông), hay Mỹ (2 chân dẹt). Bên trong laptop không quan tâm nguồn điện từ đâu, chỉ cần đủ 19V theo đúng interface. Hexagonal architecture giống vậy: domain core (laptop) chỉ biết "cần data theo interface này", còn adapter (đầu cắm) tự xử lý lấy data từ MySQL, MongoDB, file, hay mock.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
[HTTP Request]        [CLI Command]        [Test/Mock]
      │                    │                    │
[REST Adapter]       [CLI Adapter]       [InMemory Adapter]
      └─────────────────┬──────────────────────┘
                        │ calls Input Port (interface)
               ┌────────▼────────────────┐
               │      DOMAIN CORE        │
               │  (Pure Business Logic)  │
               │  PlaceOrderUseCase      │
               │  Order, Money entities  │
               └────────┬────────────────┘
                        │ calls Output Port (interface)
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
  [DB Port]       [Email Port]    [Payment Port]   ← interfaces in domain
        │               │               │
  [PG Adapter]  [SendGrid Adapter] [Stripe Adapter] ← implementations in infra

Test trick: swap [PG Adapter] → [InMemoryAdapter] → unit test không cần DB!
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Port bloat**: tạo interface cho từng dependency nhỏ nhặt → boilerplate quá nhiều, files tăng nhanh, giảm readability cho team mới
- **Adapter coupling**: adapter biết quá nhiều về domain model → thay đổi domain phải sửa adapter liên tục
- **Over-abstraction for simple CRUD**: CRUD app nhỏ không cần hexagonal → overhead không justify, tốn thời gian setup
- **Port leakage**: domain vô tình import concrete adapter class thay vì interface → phá vỡ kiến trúc, dependency inversion mất tác dụng

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                | Tại sao sai                                                     | Đúng là                                                         |
| ------------------------------------------------------ | --------------------------------------------------------------- | --------------------------------------------------------------- |
| Domain import trực tiếp ORM entity (@Entity decorator) | Domain phụ thuộc infra framework → không test isolated          | Domain define interface riêng, adapter map ORM ↔ domain model   |
| Nhầm Port và Adapter                                   | Port = interface trong domain; Adapter = implementation ở infra | Port nằm trong domain layer, Adapter nằm ở infrastructure layer |
| Hexagonal nhưng vẫn test với real database             | Mất đi lợi thế chính: unit test nhanh, không cần DB             | Dùng in-memory adapter hoặc fake repository trong unit tests    |

**🎯 Interview Pattern:**

- Khi thấy: "Làm sao đổi database mà không sửa business logic?" → Nhớ đến: hexagonal = domain depend interface, swap adapter → Mở đầu: "Tôi sẽ define Repository interface trong domain layer, implement MySQL adapter ở infra layer — sau này swap sang PostgreSQL chỉ cần viết adapter mới, không đụng một dòng business logic nào."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Layered Architecture](#5-layered-architecture----layered-architecture-trong-thực-tế)
- ➡️ Để hiểu tiếp: [Clean Architecture](#7-clean-architecture----clean-architecture-trong-thực-tế)

### 🟡 Q: What is Hexagonal Architecture (Ports & Adapters)? `[Mid]`

**A:** Domain core ở giữa, infra/framework bọc bên ngoài qua ports.

**Ưu điểm:**

- Tăng độ rõ ràng về ranh giới trách nhiệm.
- Hỗ trợ scale kỹ thuật hoặc scale tổ chức tùy mô hình.
- Giúp team giao tiếp bằng ngôn ngữ kiến trúc chuẩn.

**Nhược điểm:**

- Có trade-off về độ phức tạp triển khai/vận hành.
- Cần kỷ luật engineering và observability.
- Sai ngữ cảnh sẽ tạo overhead không cần thiết.

**When to use:**

- Đánh giá theo team size, domain volatility, SLA, compliance và budget.
- Ưu tiên mô hình đơn giản nhất đáp ứng được yêu cầu hiện tại + near future.

```text
Business Requirement
  -> Quality Attributes (scalability, reliability, speed)
    -> Candidate: Hexagonal Architecture (Ports & Adapters)
      -> Risks + Mitigations
```

**Ports & Adapters mapping:**

- Input Port: use case interface (`PlaceOrderUseCase`).
- Output Port: dependency interface (`PaymentPort`).
- Adapter: REST controller, DB repo, queue publisher.

```ts
// architecture sketch
interface UseCase<I, O> {
  execute(input: I): Promise<O>;
}
interface Repository<T> {
  save(entity: T): Promise<void>;
}
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O;
    await this.repo.save(output);
    return output;
  }
}
```

## 7. Clean Architecture — Clean Architecture trong thực tế

> 🧠 **Memory Hook:** "**Trong sạch, mũi tên chỉ vào trong**" — clean architecture = vòng tròn đồng tâm, dependency chỉ được phép đi từ ngoài vào trong, không bao giờ ngược lại.

**Tại sao tồn tại? / Why does this exist?**

Hexagonal giải quyết dependency inversion nhưng chưa phân tầng rõ entities vs use cases vs adapters — không rõ cái gì ổn định nhất cần bảo vệ nhất. → **Why?** Entities (business rules) thay đổi rất hiếm; Use Cases thay đổi theo business; Frameworks thay đổi thường xuyên — phân tầng để change propagation không đi ngược vào core. → **Why?** The Dependency Rule: source code dependencies chỉ trỏ hướng vào trong — tầng trong không bao giờ biết tầng ngoài tồn tại.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Trái Đất có vòng tròn đồng tâm: lõi sắt (entities — ổn định nhất), lớp mantle (use cases — thay đổi theo địa chất), lớp vỏ (adapters — thay đổi theo môi trường), bầu khí quyển (frameworks — thay đổi theo thời tiết). Gió bão bên ngoài không làm lõi thay đổi. Nhưng lõi ảnh hưởng đến mọi thứ bên ngoài qua trọng lực — đó là dependency rule.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
┌──────────────────────────────────────────────────┐
│  Frameworks & Drivers  (outermost — changes most)│
│  Express, NestJS, TypeORM, Jest, React, CLI      │
│  ┌────────────────────────────────────────────┐  │
│  │  Interface Adapters                        │  │
│  │  Controllers, Presenters, Gateway impls    │  │
│  │  ┌──────────────────────────────────────┐  │  │
│  │  │  Use Cases / Application Layer       │  │  │
│  │  │  PlaceOrderUseCase, GetUserUseCase   │  │  │
│  │  │  ┌────────────────────────────────┐  │  │  │
│  │  │  │  Entities  (innermost — most   │  │  │  │
│  │  │  │  stable)                       │  │  │  │
│  │  │  │  Order, User, Money, Email     │  │  │  │
│  │  │  │  Pure business rules only      │  │  │  │
│  │  │  └────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
DEPENDENCY RULE: arrows point INWARD only →→→
Inner layers know NOTHING about outer layers
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Use case explosion**: mỗi action tạo một UseCase class riêng → khi business phức tạp, có thể 200+ UseCase files, navigation khó
- **DTO proliferation**: phải map data giữa mỗi vòng tròn → InputDTO, OutputDTO, DomainModel, PersistenceModel — boilerplate tăng nhanh
- **Framework bleed**: vô tình import Express/axios vào Use Case layer → vi phạm dependency rule, khó test và khó swap framework
- **Premature abstraction**: áp Clean Architecture cho CRUD todo app → complexity cao hơn benefit, gây frustration cho team junior

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                             | Đúng là                                                             |
| -------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------- |
| Entity có @Column decorator (ORM annotation) | Entity phụ thuộc ORM framework — framework ở outer ring | Entity là plain class, mapping ORM nằm ở adapter layer              |
| Use Case return HTTP status code (200, 404)  | Use Case biết về HTTP protocol — outer layer concern    | Use Case return domain result object, Controller map sang HTTP      |
| Import Express trong Use Case                | Phá vỡ dependency rule — Express là outermost ring      | Use Case chỉ depend interfaces; Controller (adapter) handle Express |

**🎯 Interview Pattern:**

- Khi thấy: "Làm sao tách business logic khỏi framework để có thể swap?" → Nhớ đến: dependency rule → mũi tên chỉ vào trong → Mở đầu: "Tôi sẽ đặt business rule vào Entities, workflow vào Use Cases, và đảm bảo không có import nào từ Use Cases hướng ra phía framework — Clean Architecture dependency rule."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Hexagonal Architecture](#6-hexagonal-architecture-ports--adapters----hexagonal-architecture-ports--adapters-trong-thực-tế)
- ➡️ Để hiểu tiếp: [DDD Basics](#8-ddd-basics----ddd-basics-trong-thực-tế)

### 🔴 Q: What is Clean Architecture? `[Senior]`

**A:** Tập trung use cases, entities, dependency rule hướng vào trong.

**Ưu điểm:**

- Tăng độ rõ ràng về ranh giới trách nhiệm.
- Hỗ trợ scale kỹ thuật hoặc scale tổ chức tùy mô hình.
- Giúp team giao tiếp bằng ngôn ngữ kiến trúc chuẩn.

**Nhược điểm:**

- Có trade-off về độ phức tạp triển khai/vận hành.
- Cần kỷ luật engineering và observability.
- Sai ngữ cảnh sẽ tạo overhead không cần thiết.

**When to use:**

- Đánh giá theo team size, domain volatility, SLA, compliance và budget.
- Ưu tiên mô hình đơn giản nhất đáp ứng được yêu cầu hiện tại + near future.

```text
Business Requirement
  -> Quality Attributes (scalability, reliability, speed)
    -> Candidate: Clean Architecture
      -> Risks + Mitigations
```

**Dependency rule:**

- Entities không import framework.
- Use Cases phụ thuộc Entities + interfaces.
- Interface adapters implement ports ở outer layer.
- Frameworks/DB/UI ở layer ngoài cùng.

```ts
// architecture sketch
interface UseCase<I, O> {
  execute(input: I): Promise<O>;
}
interface Repository<T> {
  save(entity: T): Promise<void>;
}
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O;
    await this.repo.save(output);
    return output;
  }
}
```

## 8. DDD Basics — DDD Basics trong thực tế

> 🧠 **Memory Hook:** "**Mỗi phố có ngôn ngữ riêng**" — DDD = bản đồ khu phố, Hàng Đào (vải lụa) khác Hàng Bạc (trang sức) dù cùng thành phố, cùng từ "khách" nhưng nghĩa khác nhau.

**Tại sao tồn tại? / Why does this exist?**

Khi nhiều team làm việc trên cùng domain, cùng từ "Order" có thể có nghĩa khác nhau với Sales team vs Warehouse team — gây bug khi code của các team tương tác. → **Why?** Model mơ hồ dùng chung gây coupling ngầm và mismatch kỳ vọng giữa các team. → **Why?** Ubiquitous Language và explicit Bounded Context giúp mỗi team model đúng cho domain của mình mà không cần đồng ý về một "God Model" chung.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hà Nội có 36 phố phường. Phố Hàng Đào chuyên bán vải lụa — "khách" ở đây là người mua vải buôn. Phố Hàng Bạc chuyên trang sức — "khách" ở đây là người đặt nhẫn cưới. Dùng bản đồ thành phố chung nhưng mỗi phố có ngôn ngữ nghề riêng. DDD giống vậy: Billing context và Shipping context đều có "Order" nhưng model khác nhau, phù hợp với nghiệp vụ từng ngữ cảnh — không cần đồng ý về một Order chung cho tất cả.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
BOUNDED CONTEXT — Billing           BOUNDED CONTEXT — Shipping
┌────────────────────────┐          ┌────────────────────────┐
│  Order (billing view)  │          │  Order (shipping view) │
│  - orderId             │          │  - orderId             │
│  - totalAmount: Money  │◄─── shared id only ───►│  - deliveryAddress     │
│  - paymentStatus       │          │  - packageWeight       │
└────────────────────────┘          └────────────────────────┘

AGGREGATE — Order (inside Billing BC)
  ┌──── Order ────────────────────┐  ← Aggregate Root (has OrderId)
  │  - orderId: OrderId           │     Entity (has identity)
  │  - status: OrderStatus        │
  │  - lines: OrderLine[]         │
  └──────────────────┬────────────┘
                     │ contains
              ┌──────▼──────────────┐
              │  OrderLine          │  ← Child Entity
              │  - productId        │
              │  - quantity         │
              │  - price: Money     │  ← Value Object (immutable)
              └─────────────────────┘
RULE: chỉ truy cập OrderLine qua Order root → consistency boundary
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Anemic domain model**: Entities chỉ là data bag, toàn bộ logic nằm trong Service → DDD in name only, không có behavior trong model
- **God aggregate**: một Aggregate quá lớn (Order + Product + Customer + Payment cùng nhau) → contention cao vì lock cả aggregate khi update một field nhỏ
- **Context boundary erosion**: team dùng chung database model cho 2 bounded context → coupling quay lại, DDD không hiệu quả
- **Ubiquitous language drift**: code dùng từ khác domain expert nói ("user" vs "customer") → model không phản chiếu đúng domain, bug do hiểu nhầm

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                 | Tại sao sai                                                      | Đúng là                                                          |
| ------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Một Entity dùng chung cho toàn bộ hệ thống (God Entity) | Coupling giữa các context, model không phù hợp nhu cầu từng team | Mỗi Bounded Context có model riêng phù hợp ngôn ngữ nghiệp vụ    |
| Value Object mutable (có setter thay đổi giá trị)       | Value Object phải immutable để đảm bảo tính nhất quán            | Tạo Value Object mới thay vì modify, dùng factory method         |
| Aggregate quá lớn (nhiều entity không liên quan)        | Lock contention khi concurrent access, performance kém           | Giữ Aggregate nhỏ, chỉ include những gì cần để duy trì invariant |

**🎯 Interview Pattern:**

- Khi thấy: "System phức tạp, nhiều team, domain rộng lớn, khó maintain" → Nhớ đến: DDD = bounded context + ubiquitous language + aggregate → Mở đầu: "Tôi sẽ bắt đầu bằng Event Storming để xác định bounded contexts và ubiquitous language với domain experts, sau đó chia team theo context boundaries — Conway's Law theo hướng có chủ đích."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Clean Architecture](#7-clean-architecture----clean-architecture-trong-thực-tế)
- ➡️ Để hiểu tiếp: [System Design Theory](../02-system-design/system-design-theory.md)

### 🟢 Q: What is DDD Basics? `[Junior]`

**A:** Mô hình hóa domain bằng bounded context, aggregate, entity, value object.

**Ưu điểm:**

- Tăng độ rõ ràng về ranh giới trách nhiệm.
- Hỗ trợ scale kỹ thuật hoặc scale tổ chức tùy mô hình.
- Giúp team giao tiếp bằng ngôn ngữ kiến trúc chuẩn.

**Nhược điểm:**

- Có trade-off về độ phức tạp triển khai/vận hành.
- Cần kỷ luật engineering và observability.
- Sai ngữ cảnh sẽ tạo overhead không cần thiết.

**When to use:**

- Đánh giá theo team size, domain volatility, SLA, compliance và budget.
- Ưu tiên mô hình đơn giản nhất đáp ứng được yêu cầu hiện tại + near future.

```text
Business Requirement
  -> Quality Attributes (scalability, reliability, speed)
    -> Candidate: DDD Basics
      -> Risks + Mitigations
```

**DDD building blocks:**

- Bounded Context: ranh giới ngôn ngữ và model.
- Entity: có identity (`OrderId`).
- Value Object: immutable (`Money`, `EmailAddress`).
- Aggregate: consistency boundary (`Order` + `OrderLines`).

```ts
// architecture sketch
interface UseCase<I, O> {
  execute(input: I): Promise<O>;
}
interface Repository<T> {
  save(entity: T): Promise<void>;
}
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O;
    await this.repo.save(output);
    return output;
  }
}
```

---

## 9. Comparison Matrix — Bảng so sánh chọn kiến trúc

### 🔴 Q: How to choose the right architecture style? `[Senior]`

**A:** Không có architecture best tuyệt đối, chỉ có architecture phù hợp nhất cho ngữ cảnh.

| Criterion              | Monolith   | Microservices | Serverless | Event-driven | Hexagonal/Clean |
| ---------------------- | ---------- | ------------- | ---------- | ------------ | --------------- |
| Time-to-market         | High       | Medium        | High       | Medium       | Medium          |
| Operational complexity | Low        | High          | Medium     | High         | Medium          |
| Team autonomy          | Low-Medium | High          | Medium     | High         | Medium          |
| Cost predictability    | High       | Medium        | Variable   | Medium       | High            |
| Scaling granularity    | Coarse     | Fine          | Fine       | Fine         | Depends         |
| Testability            | Medium     | Medium        | Medium     | Complex      | High            |

**Rule of thumb:**

1. Team < 8, domain chưa rõ -> bắt đầu monolith modular.
2. Domain rõ + team nhiều stream -> cân nhắc microservices.
3. Traffic bursty, event-driven workloads -> cân nhắc serverless/event-driven.
4. Hệ thống cần longevity + maintainability cao -> ưu tiên Clean/Hexagonal/DDD mindset.

---

## 10. Monolith-to-Microservices Migration — Lộ trình chuyển đổi

### 🔴 Q: What is a safe migration strategy? `[Senior]`

**A:**

- Bước 1: Đo baseline (latency, error rate, deploy frequency, MTTR).
- Bước 2: Chọn một bounded context ít rủi ro để tách trước.
- Bước 3: Dùng **Strangler Fig Pattern** để route dần traffic.
- Bước 4: Tách data ownership; tránh shared write giữa monolith và service mới.
- Bước 5: Xây observability trước (tracing, logs correlation, SLO).
- Bước 6: Thiết kế rollback plan và kill switch.

```text
Client -> API Gateway
           |
           +--> Legacy Monolith (remaining domains)
           +--> New Order Service (extracted domain)
```

---

## 11. Interview Q&A Bank — Bộ câu hỏi phỏng vấn

### 🟢 Q: When is monolith the right choice? `[Junior]`

**A:** Khi team nhỏ, domain chưa ổn định, cần ship nhanh và tối ưu cognitive load.

**Điểm cần nhấn mạnh khi trả lời:**

- Context trước khi chọn pattern/architecture.
- Trade-off cụ thể: latency, cost, complexity, team skill.
- Cách giảm rủi ro rollout (feature flags, canary, rollback).

### 🟡 Q: How do you split microservices? `[Mid]`

**A:** Ưu tiên split theo bounded context và business capability, không split theo technical layer.

**Điểm cần nhấn mạnh khi trả lời:**

- Context trước khi chọn pattern/architecture.
- Trade-off cụ thể: latency, cost, complexity, team skill.
- Cách giảm rủi ro rollout (feature flags, canary, rollback).

### 🟡 Q: Cold start in serverless means what? `[Mid]`

**A:** Là độ trễ khi function instance mới được khởi tạo trước khi xử lý request đầu tiên.

**Điểm cần nhấn mạnh khi trả lời:**

- Context trước khi chọn pattern/architecture.
- Trade-off cụ thể: latency, cost, complexity, team skill.
- Cách giảm rủi ro rollout (feature flags, canary, rollback).

### 🔴 Q: Event sourcing vs CRUD trade-off? `[Senior]`

**A:** Event sourcing audit tốt và replay được nhưng tăng độ phức tạp projection, consistency và migration.

**Điểm cần nhấn mạnh khi trả lời:**

- Context trước khi chọn pattern/architecture.
- Trade-off cụ thể: latency, cost, complexity, team skill.
- Cách giảm rủi ro rollout (feature flags, canary, rollback).

### 🟡 Q: Hexagonal architecture có lợi gì cho test? `[Mid]`

**A:** Domain core độc lập framework nên unit test nhanh, không cần mock nặng infra.

**Điểm cần nhấn mạnh khi trả lời:**

- Context trước khi chọn pattern/architecture.
- Trade-off cụ thể: latency, cost, complexity, team skill.
- Cách giảm rủi ro rollout (feature flags, canary, rollback).

### 🔴 Q: How to migrate monolith to microservices safely? `[Senior]`

**A:** Dùng strangler pattern, tách dần theo domain slice, observability đầy đủ, rollback rõ ràng.

**Điểm cần nhấn mạnh khi trả lời:**

- Context trước khi chọn pattern/architecture.
- Trade-off cụ thể: latency, cost, complexity, team skill.
- Cách giảm rủi ro rollout (feature flags, canary, rollback).

### 🟢 Q: DDD Value Object khác Entity thế nào? `[Junior]`

**A:** Value Object so sánh theo giá trị và immutable; Entity có identity xuyên suốt vòng đời.

**Điểm cần nhấn mạnh khi trả lời:**

- Context trước khi chọn pattern/architecture.
- Trade-off cụ thể: latency, cost, complexity, team skill.
- Cách giảm rủi ro rollout (feature flags, canary, rollback).

### 🔴 Q: Clean Architecture dependency rule là gì? `[Senior]`

**A:** Dependency source code chỉ trỏ từ outer layer vào inner layer, không ngược lại.

**Điểm cần nhấn mạnh khi trả lời:**

- Context trước khi chọn pattern/architecture.
- Trade-off cụ thể: latency, cost, complexity, team skill.
- Cách giảm rủi ro rollout (feature flags, canary, rollback).

### 🟡 Q: Khi nào event-driven không phù hợp? `[Mid]`

**A:** Khi business cần strong consistency tức thì và đội chưa sẵn sàng vận hành async complexity.

**Điểm cần nhấn mạnh khi trả lời:**

- Context trước khi chọn pattern/architecture.
- Trade-off cụ thể: latency, cost, complexity, team skill.
- Cách giảm rủi ro rollout (feature flags, canary, rollback).

---

## 12. Quick checklist — Checklist ôn tập

- [ ] Giải thích được 7 phong cách kiến trúc chính và use-case phù hợp.
- [ ] Phân biệt synchronous vs asynchronous communication trong microservices.
- [ ] Nắm cơ bản DDD terms: bounded context, aggregate, value object.
- [ ] Biết dependency rule của Clean Architecture.
- [ ] Trình bày được migration plan từ monolith sang microservices.

---

## 13. Architecture Fitness Functions — Kiểm định kiến trúc bằng tiêu chí đo được

### 🔴 Q: What are architecture fitness functions? `[Senior]`

**A:** Fitness function là tập kiểm tra tự động hoặc bán tự động để xác nhận kiến trúc vẫn tuân thủ mục tiêu đã đặt (security, latency, coupling, deployability).

**Ví dụ fitness functions thường gặp:**

- Static rule: domain layer không import framework/web adapters.
- Runtime rule: p95 latency của `Checkout` < 200ms.
- Delivery rule: mỗi service deploy độc lập không cần big-bang release.
- Resilience rule: dependency outage không làm sập toàn bộ user flow.

```text
Architectural Intent
  -> Define measurable constraints
    -> Automate checks in CI/CD
      -> Alert when violated
```

### 🔴 Q: How to introduce fitness functions incrementally? `[Senior]`

**A:**

1. Chọn 2-3 pain points lớn nhất (ví dụ coupling + release risk).
2. Định nghĩa baseline metric từ production data.
3. Viết rule đơn giản trước (lint/dependency graph).
4. Tích hợp vào CI ở chế độ warning, sau đó chuyển sang fail gate.
5. Review định kỳ để tránh rule lỗi thời.

| Problem       | Fitness Function                | Tooling gợi ý            |
| ------------- | ------------------------------- | ------------------------ |
| Coupling cao  | Cấm import chéo bounded context | dependency linter        |
| API drift     | Contract test bắt buộc          | pact/openapi checks      |
| Latency tăng  | p95 endpoint threshold          | observability + SLO gate |
| Deploy rủi ro | Canary success rate >= 99%      | rollout controller       |

## 14. Data Architecture Choices — Lựa chọn kiến trúc dữ liệu

### 🟡 Q: Database-per-service có bắt buộc cho microservices? `[Mid]`

**A:** Không bắt buộc tuyệt đối lúc đầu, nhưng là hướng đi tốt để đạt autonomy. Giai đoạn chuyển tiếp có thể dùng shared DB read-only hoặc shared schema tạm thời kèm migration plan rõ ràng.

**Mức độ tách dữ liệu:**

- Level 0: Shared DB + shared schema (nhanh nhưng coupling cao).
- Level 1: Shared DB + schema riêng từng service.
- Level 2: DB riêng từng service, integration qua API/event.
- Level 3: Polyglot persistence theo domain needs.

### 🔴 Q: What are common consistency patterns in distributed architecture? `[Senior]`

**A:**

- Strong consistency cục bộ trong một aggregate/transaction boundary.
- Eventual consistency giữa các service thông qua event + projection.
- Saga (orchestration/choreography) cho workflow đa service.
- Outbox pattern để đồng bộ DB write và event publish đáng tin cậy.

```text
[Service Transaction]
  write business data
  write outbox event
       |
   CDC/Publisher
       |
   Event Broker -> Consumers
```

### 🔴 Q: CQRS có phải luôn đi kèm event sourcing? `[Senior]`

**A:** Không. CQRS chỉ tách mô hình đọc/ghi; event sourcing là cách lưu state bằng event log. Có thể dùng CQRS với CRUD DB bình thường nếu cần tối ưu read model.

| Pattern        | Mục tiêu chính                 | Độ phức tạp |
| -------------- | ------------------------------ | ----------- |
| CRUD           | Đơn giản, nhanh triển khai     | Thấp        |
| CQRS           | Tối ưu read/write khác nhu cầu | Trung bình  |
| Event Sourcing | Audit/replay mạnh              | Cao         |

```ts
// Outbox-friendly domain event sketch
type DomainEvent = { type: string; payload: Record<string, unknown>; occurredAt: string };
interface OutboxRepo {
  append(event: DomainEvent): Promise<void>;
}
interface OrderRepo {
  save(orderId: string, status: string): Promise<void>;
}
class OrderService {
  constructor(
    private orderRepo: OrderRepo,
    private outbox: OutboxRepo,
  ) {}
  async markPaid(orderId: string): Promise<void> {
    await this.orderRepo.save(orderId, "PAID");
    await this.outbox.append({
      type: "OrderPaid",
      payload: { orderId },
      occurredAt: new Date().toISOString(),
    });
  }
}
```

## 15. Team Topologies and Architecture — Cấu trúc đội ngũ và kiến trúc

### 🟡 Q: Why does team structure affect architecture? `[Mid]`

**A:** Theo Conway's Law, hệ thống thường phản chiếu cách team giao tiếp. Nếu team chia theo layer kỹ thuật, kiến trúc dễ bị layer-centric; nếu chia theo domain, kiến trúc thường domain-centric.

### 🔴 Q: How to align architecture with team growth? `[Senior]`

**A:**

- Team nhỏ: ưu tiên modular monolith để giảm coordination cost.
- Team trung bình: tách ownership theo domain module + clear API contracts.
- Team lớn: microservices có platform support (CI templates, observability, security baseline).

| Team size      | Architecture ưu tiên           | Risk nếu làm quá sớm           |
| -------------- | ------------------------------ | ------------------------------ |
| 3-7 engineers  | Modular monolith               | Microservices overkill         |
| 8-20 engineers | Monolith + domain boundaries   | Team collision nếu boundary mờ |
| 20+ engineers  | Domain services/platform model | Ops complexity bùng nổ         |

### 🔴 Q: Platform team đóng vai trò gì trong microservices? `[Senior]`

**A:** Platform team xây paved road: CI/CD template, service scaffolding, policy-as-code, secret management, tracing/logging chuẩn để product teams tập trung domain logic.

**Paved road checklist:**

- Standard service template (health check, metrics, tracing).
- Secure default (authN/Z middleware, rate limit, audit log).
- Deployment strategy chuẩn (canary + rollback automation).
- Dependency update automation + vulnerability gates.

## 16. Interview Simulation Set — Bộ câu hỏi mô phỏng nâng cao

### 🟢 Q: What is layered architecture in one sentence? `[Junior]`

**A:** Là cách tổ chức hệ thống thành các lớp trách nhiệm rõ ràng (UI/presentation, business logic, data access) để giảm phụ thuộc chéo.

### 🟢 Q: Why is a modular monolith often recommended first? `[Junior]`

**A:** Vì nó giữ được tốc độ phát triển ban đầu, debug đơn giản, nhưng vẫn tạo boundary tốt để tách service sau này khi cần.

### 🟡 Q: Synchronous call vs async event in microservices? `[Mid]`

**A:** Sync call phù hợp cần phản hồi ngay; async event phù hợp workflow chịu được eventual consistency và muốn giảm coupling giữa producer/consumer.

### 🟡 Q: How do you prevent distributed monolith? `[Mid]`

**A:** Tránh shared database write, tránh service gọi chéo dây chuyền sâu, thiết kế API theo domain, và theo dõi coupling bằng metrics/service dependency graph.

### 🟡 Q: What causes serverless bill shock? `[Mid]`

**A:** Invocation tăng đột biến, function timeout dài, memory config quá cao, và external calls chậm khiến execution duration đội chi phí.

### 🔴 Q: How would you defend architecture choice in an interview? `[Senior]`

**A:** Trả lời theo khung: context business -> quality attributes ưu tiên -> lựa chọn kiến trúc -> trade-offs -> risk mitigations -> rollout plan -> success metrics.

### 🔴 Q: What migration anti-patterns should be avoided? `[Senior]`

**A:**

- Big-bang rewrite không có fallback.
- Tách service theo technical layers thay vì business capability.
- Không đầu tư observability trước khi tách.
- Shared database write kéo dài quá lâu.

### 🔴 Q: How do you know migration is successful? `[Senior]`

**A:** Theo dõi DORA + product metrics: deploy frequency tăng, lead time giảm, change failure rate giảm, MTTR giảm, đồng thời business KPI không xấu đi.

---

## 17. Architecture Decision Record (ADR) Template — Mẫu ghi quyết định

### 🟡 Q: Why write ADRs? `[Mid]`

**A:** ADR giúp team hiểu vì sao một quyết định được chọn tại thời điểm đó, giảm tranh luận lặp lại và hỗ trợ onboarding.

```markdown
# ADR-012: Choose Modular Monolith for Phase 1

Date: 2026-03-11
Status: Accepted

## Context

- Team 6 engineers
- Need MVP in 4 months
- Domain still evolving

## Decision

- Use modular monolith with strict domain module boundaries

## Consequences

- Pros: fast delivery, easier debugging
- Cons: need discipline to avoid shared mutable modules

## Revisit Trigger

- Team > 12 engineers or release bottleneck persists for 2 quarters
```

### 🔴 Q: What ADR mistakes are common? `[Senior]`

**A:** ADR quá chung chung, thiếu context đo được, không có trigger review lại, hoặc không cập nhật status khi quyết định thay đổi.

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: When should you choose microservices over a monolith? / Khi nào chọn microservices thay vì monolith? 🟡 Mid

**A:** Start with a monolith; migrate when you hit specific pain points. Choose microservices when: different components need **independent scaling**, teams need **independent deployment**, or different parts need **different tech stacks**.

```
Monolith advantages:      Microservices advantages:
Simple development        Independent scaling per service
Easy debugging            Independent deployment per team
No network overhead       Technology flexibility
Transactional consistency Fault isolation

Decision:
Team < 10 devs?     → monolith
Domain unclear?     → monolith
Traffic uniform?    → monolith
Team > 50 devs?     → consider services
Domain well-known?  → services
Traffic spiky/service? → services
```

Vietnamese explanation: "Monolith first" — Martin Fowler. Lý do: microservices = distributed systems complexity (network failures, distributed transactions, eventual consistency). Netflix, Uber bắt đầu monolith → split khi scale required. "Modular monolith" = middle ground: single deployment, separate modules with clear boundaries → easy to extract later. Conway's Law: system architecture mirrors team communication structure.

---

### Q: What is Event-Driven Architecture and when is it useful? / Event-Driven Architecture là gì? 🔴 Senior

**A:** Components communicate by producing/consuming events asynchronously. No direct coupling between services. Producer emits event, consumers react independently.

```
Synchronous coupling (problem):
OrderService → calls EmailService → calls InventoryService
If any service down → whole flow fails

Event-Driven (loose coupling):
OrderService → emits OrderPlaced → Kafka
                                  ↓
                         EmailService (subscribes)
                         InventoryService (subscribes)
                         BillingService (subscribes)
Each processes independently, retries on failure
```

Benefits: loose coupling, independent scaling, fault isolation, natural audit log.
Challenges: eventual consistency, debugging harder (need distributed tracing), event ordering, schema evolution.

Vietnamese explanation: EDA phổ biến trong microservices (Kafka, RabbitMQ, AWS EventBridge). Event sourcing = store events as source of truth. CQRS + EDA: write side emits events, read side consumes and updates read models. Pitfalls: event versioning (backward compat), poison pills (bad event crashes consumer → dead letter queue), ordering (Kafka: per-partition order only).

---

## Interview Q&A Summary / Tổng Kết

| Question                  | Level | Key Point                                                               |
| ------------------------- | ----- | ----------------------------------------------------------------------- |
| Microservices vs monolith | 🟡    | Monolith first; microservices when team/scale requires; Conway's Law    |
| Event-Driven Architecture | 🔴    | Async events = loose coupling; resilient; eventual consistency tradeoff |

---

## Self-Check / Tự Kiểm Tra

| #   | Concept                     | Kiểm tra bằng cách                                                                                     | Level     | Đạt chưa? |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------ | --------- | --------- |
| 1   | Monolith vs Microservices   | Giải thích khi nào chọn từng loại, nêu 3 trade-off cụ thể có số liệu (team size, deploy freq)          | 🟢 Junior | [ ]       |
| 2   | Hexagonal Architecture      | Giải thích Ports & Adapters, demo swap adapter từ MySQL → InMemory mà không sửa business logic         | 🟡 Mid    | [ ]       |
| 3   | Event Sourcing & CQRS       | Phân biệt 2 pattern, giải thích khi nào dùng, kể trade-off về projection complexity và migration       | 🔴 Senior | [ ]       |
| 4   | Microservices System Design | Thiết kế hệ thống microservices, giải thích service discovery, circuit breaker, và distributed tracing | 🔴 Senior | [ ]       |
| 5   | Clean Architecture          | Giải thích dependency rule bằng sơ đồ vòng tròn, tại sao domain logic phải tách khỏi infrastructure    | 🟡 Mid    | [ ]       |

💬 **Feynman Prompt:** Giải thích sự khác biệt giữa Monolith và Microservices cho CEO. Dùng ví dụ nhà hàng: một bếp lớn (monolith) vs nhiều food stations (microservices) — trade-off về tốc độ, chi phí, và quản lý.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [SOLID & Design Patterns](./01-solid-and-design-patterns.md) | [System Design Theory](../02-system-design/system-design-theory.md)
- ➡️ **Enables:** Microservices patterns | Distributed Systems | Frontend architecture decisions
- 🔗 **Real examples:** Netflix (microservices) | Shopify (modular monolith) | Vercel (serverless/edge)
