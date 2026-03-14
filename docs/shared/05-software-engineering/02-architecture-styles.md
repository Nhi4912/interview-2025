# Architecture Styles / Các Phong Cách Kiến Trúc

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [SOLID & Design Patterns](./01-solid-and-design-patterns.md) | [System Design Theory](../02-system-design/system-design-theory.md)

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
interface UseCase<I, O> { execute(input: I): Promise<O> }
interface Repository<T> { save(entity: T): Promise<void> }
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O
    await this.repo.save(output)
    return output
  }
}
```

## 2. Microservices Architecture — Microservices Architecture trong thực tế

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
interface UseCase<I, O> { execute(input: I): Promise<O> }
interface Repository<T> { save(entity: T): Promise<void> }
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O
    await this.repo.save(output)
    return output
  }
}
```

## 3. Serverless Architecture — Serverless Architecture trong thực tế

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
interface UseCase<I, O> { execute(input: I): Promise<O> }
interface Repository<T> { save(entity: T): Promise<void> }
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O
    await this.repo.save(output)
    return output
  }
}
```

## 4. Event-Driven Architecture — Event-Driven Architecture trong thực tế

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
interface UseCase<I, O> { execute(input: I): Promise<O> }
interface Repository<T> { save(entity: T): Promise<void> }
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O
    await this.repo.save(output)
    return output
  }
}
```

## 5. Layered Architecture — Layered Architecture trong thực tế

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
interface UseCase<I, O> { execute(input: I): Promise<O> }
interface Repository<T> { save(entity: T): Promise<void> }
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O
    await this.repo.save(output)
    return output
  }
}
```

## 6. Hexagonal Architecture (Ports & Adapters) — Hexagonal Architecture (Ports & Adapters) trong thực tế

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
interface UseCase<I, O> { execute(input: I): Promise<O> }
interface Repository<T> { save(entity: T): Promise<void> }
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O
    await this.repo.save(output)
    return output
  }
}
```

## 7. Clean Architecture — Clean Architecture trong thực tế

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
interface UseCase<I, O> { execute(input: I): Promise<O> }
interface Repository<T> { save(entity: T): Promise<void> }
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O
    await this.repo.save(output)
    return output
  }
}
```

## 8. DDD Basics — DDD Basics trong thực tế

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
interface UseCase<I, O> { execute(input: I): Promise<O> }
interface Repository<T> { save(entity: T): Promise<void> }
class AppService<I, O> implements UseCase<I, O> {
  constructor(private readonly repo: Repository<O>) {}
  async execute(input: I): Promise<O> {
    const output = input as unknown as O
    await this.repo.save(output)
    return output
  }
}
```

---

## 9. Comparison Matrix — Bảng so sánh chọn kiến trúc

### 🔴 Q: How to choose the right architecture style? `[Senior]`

**A:** Không có architecture best tuyệt đối, chỉ có architecture phù hợp nhất cho ngữ cảnh.

| Criterion | Monolith | Microservices | Serverless | Event-driven | Hexagonal/Clean |
|---|---|---|---|---|---|
| Time-to-market | High | Medium | High | Medium | Medium |
| Operational complexity | Low | High | Medium | High | Medium |
| Team autonomy | Low-Medium | High | Medium | High | Medium |
| Cost predictability | High | Medium | Variable | Medium | High |
| Scaling granularity | Coarse | Fine | Fine | Fine | Depends |
| Testability | Medium | Medium | Medium | Complex | High |

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

| Problem | Fitness Function | Tooling gợi ý |
|---|---|---|
| Coupling cao | Cấm import chéo bounded context | dependency linter |
| API drift | Contract test bắt buộc | pact/openapi checks |
| Latency tăng | p95 endpoint threshold | observability + SLO gate |
| Deploy rủi ro | Canary success rate >= 99% | rollout controller |

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

| Pattern | Mục tiêu chính | Độ phức tạp |
|---|---|---|
| CRUD | Đơn giản, nhanh triển khai | Thấp |
| CQRS | Tối ưu read/write khác nhu cầu | Trung bình |
| Event Sourcing | Audit/replay mạnh | Cao |

```ts
// Outbox-friendly domain event sketch
type DomainEvent = { type: string; payload: Record<string, unknown>; occurredAt: string }
interface OutboxRepo { append(event: DomainEvent): Promise<void> }
interface OrderRepo { save(orderId: string, status: string): Promise<void> }
class OrderService {
  constructor(private orderRepo: OrderRepo, private outbox: OutboxRepo) {}
  async markPaid(orderId: string): Promise<void> {
    await this.orderRepo.save(orderId, 'PAID')
    await this.outbox.append({
      type: 'OrderPaid',
      payload: { orderId },
      occurredAt: new Date().toISOString(),
    })
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

| Team size | Architecture ưu tiên | Risk nếu làm quá sớm |
|---|---|---|
| 3-7 engineers | Modular monolith | Microservices overkill |
| 8-20 engineers | Monolith + domain boundaries | Team collision nếu boundary mờ |
| 20+ engineers | Domain services/platform model | Ops complexity bùng nổ |

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

| Question | Level | Key Point |
|----------|-------|-----------|
| Microservices vs monolith | 🟡 | Monolith first; microservices when team/scale requires; Conway's Law |
| Event-Driven Architecture | 🔴 | Async events = loose coupling; resilient; eventual consistency tradeoff |
