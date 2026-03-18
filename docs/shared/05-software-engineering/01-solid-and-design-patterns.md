# SOLID Principles & Design Patterns / Nguyên Tắc SOLID và Mẫu Thiết Kế

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [OOP Basics](./00-programming-paradigms.md)
> **See also**: [Architecture Styles](./02-architecture-styles.md) | [Code Quality](./05-code-quality-and-review.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn viết một `PaymentService` xử lý thanh toán qua Stripe. 6 tháng sau, sếp nói: "Thêm PayPal đi." Bạn mở file ra và thấy `if (provider === "stripe") {...} else if (provider === "paypal") {...}` — code rải rác khắp nơi, test cũ bắt đầu fail, bug xuất hiện ở những chỗ không liên quan.

**Vấn đề**: Code được viết mà không có nguyên tắc thiết kế. Mỗi lần thêm tính năng = phá vỡ những thứ đã hoạt động.

**Giải pháp**: SOLID — 5 nguyên tắc giúp code **dễ mở rộng mà không sợ vỡ**.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Bộ phận trong công ty:**

Hãy nghĩ code như một công ty. Công ty tốt có:
- Mỗi **phòng ban** (class) chỉ làm **một việc** → không bị "kiêm nhiệm quá nhiều" (SRP)
- Khi có dự án mới, **thêm phòng ban** thay vì đập hết cấu trúc cũ (OCP)
- Nhân viên mới (subclass) làm được **mọi việc của người cũ** (LSP)
- Không ép nhân viên IT học bán hàng (ISP)
- Sếp giao việc qua **mô tả công việc**, không phải giao trực tiếp cho từng người (DIP)

**Tại sao phải học SOLID?**
- Phỏng vấn tại mọi công ty tech đều hỏi ít nhất 1-2 nguyên tắc SOLID
- Code không có SOLID = "spaghetti code" — khó test, khó sửa, tốn kém bảo trì
- Design Patterns (Factory, Strategy, Observer...) đều là SOLID in action — hiểu SOLID trước mới hiểu tại sao pattern đó tồn tại

**3 câu hỏi để nhận ra vi phạm SOLID:**
1. Class này có bao nhiêu lý do để thay đổi? (> 1 → vi phạm SRP)
2. Muốn thêm tính năng có phải sửa code cũ không? (Có → vi phạm OCP)
3. Có thể thay thế object bằng subtype mà không break không? (Không → vi phạm LSP)

---

## Concept Map / Bản Đồ Khái Niệm

```
         [OOP BASICS]
         (class, inheritance, interface)
                │
                ▼
         [SOLID PRINCIPLES]
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
  [SRP]       [OCP]       [LSP]
  1 reason    Open for    Subtypes
  to change   extension,  must be
              closed for  substitutable
              modification
    ▼           ▼           ▼
  [ISP]       [DIP]
  Small       Depend on
  interfaces  abstractions
    │
    ▼
[DESIGN PATTERNS]  ← SOLID enables these
    │
    ├── Creational: Factory, Builder, Singleton
    ├── Structural: Adapter, Decorator, Facade
    └── Behavioral: Strategy, Observer, Command
    │
    ▼
[ARCHITECTURE PATTERNS]
Layered, Hexagonal, Clean Architecture, Event-Driven
```

---

## Visual: SOLID Principles at a Glance / Tổng Quan SOLID

```
S — Single Responsibility         O — Open/Closed
  BAD:                              BAD:
  class User {                      if (type == "circle") area = π×r²
    validate()                      if (type == "square") area = s×s
    saveToDb()                      ← must modify code to add "triangle"
    sendEmail()
  }                                 GOOD:
  ↑ 3 reasons to change             interface Shape { area(): number }
                                    class Circle implements Shape {...}
  GOOD:                             class Square implements Shape {...}
  class User {}          ← data     class Triangle implements Shape {...}
  class UserValidator {} ← validate ← add new shape without changing old code
  class UserRepo {}      ← persist
  class UserMailer {}    ← notify

L — Liskov Substitution             I — Interface Segregation
  BAD:                              BAD:
  class Bird {                      interface Worker {
    fly(): void                       work(): void
  }                                   eat(): void   ← robot can't eat!
  class Penguin extends Bird {        sleep(): void ← robot doesn't sleep!
    fly() { throw Error("can't!") }
  }                                   GOOD:
  ↑ breaks substitutability          interface Workable { work(): void }
                                      interface Eatable { eat(): void }
  GOOD:                               interface Sleepable { sleep(): void }
  interface Bird { move(): void }     Human implements Workable, Eatable, Sleepable
  class FlyingBird extends Bird       Robot implements Workable
  class Penguin extends Bird          ← each class only implements what it needs

D — Dependency Inversion
  BAD:                              GOOD:
  class OrderService {              interface PaymentGateway {
    stripe = new Stripe()             charge(amount): void
    pay(amount) {                   }
      this.stripe.charge(amount)    class OrderService {
    }                                 constructor(payment: PaymentGateway)
  }                                 }
  ↑ hard-coded dependency           ↑ depend on abstraction, not concrete
  ↑ can't test without Stripe       ↑ inject Stripe, PayPal, or mock
```

### Design Patterns Map / Bản Đồ Mẫu Thiết Kế

```
CREATIONAL (how objects are created):
  Singleton    ← one instance globally (DB connection, config)
  Factory      ← create objects without specifying exact class
  Builder      ← construct complex objects step by step
  Prototype    ← clone existing objects

STRUCTURAL (how objects are composed):
  Adapter      ← wrap incompatible interface to make compatible
  Decorator    ← add behavior without modifying the original
  Facade       ← simplified interface to complex subsystem
  Proxy        ← control access to an object (lazy init, caching, auth)
  Composite    ← tree structures of objects (file system, DOM)

BEHAVIORAL (how objects communicate):
  Observer     ← subscribe/publish to events (EventEmitter, Redux)
  Strategy     ← swap algorithm at runtime (sort strategies)
  Command      ← encapsulate actions as objects (undo/redo)
  Iterator     ← traverse collection without exposing internals
  Template     ← define skeleton algorithm, subclasses fill in steps
  Chain of Resp ← pass request down a chain (middleware, express)
```

---

## Core Engineering Mindset
### Explanation / Giải thích
- Nguyên lý thiết kế không phải mục tiêu tự thân; mục tiêu là giảm chi phí thay đổi và tăng độ tin cậy.
- Cần cân bằng giữa simplicity hôm nay và flexibility ngày mai.
### Example / Ví dụ
- Team nhỏ và domain ổn định: ưu tiên KISS, hạn chế framework hóa sớm.
- Domain thay đổi mạnh và nhiều integration points: tạo abstraction rõ ở boundary.

## Single Responsibility Principle (SRP)
### Overview / Tổng Quan
- Một module chỉ nên có một lý do thay đổi theo actor nghiệp vụ.
### Explanation / Giải thích
- Khi giải thích nguyên lý, nên nêu 1 ví dụ vi phạm + 1 hướng refactor cụ thể.
- Trình bày trade-off: thêm abstraction tăng testability nhưng cũng tăng cognitive load.
### Example / Ví dụ
- Vi phạm: một service vừa validate, vừa persistence, vừa gọi external API.
- Refactor: tách validator/repository/provider và inject qua interface.
- Kết quả: unit test nhẹ hơn, blast radius của thay đổi nhỏ hơn.
### Interview Notes
- Dùng công thức trả lời: Definition -> Violation -> Refactor -> Trade-off -> Result.

## Open/Closed Principle (OCP)
### Overview / Tổng Quan
- Mở để mở rộng nhưng đóng để sửa đổi code cũ.
### Explanation / Giải thích
- Khi giải thích nguyên lý, nên nêu 1 ví dụ vi phạm + 1 hướng refactor cụ thể.
- Trình bày trade-off: thêm abstraction tăng testability nhưng cũng tăng cognitive load.
### Example / Ví dụ
- Vi phạm: một service vừa validate, vừa persistence, vừa gọi external API.
- Refactor: tách validator/repository/provider và inject qua interface.
- Kết quả: unit test nhẹ hơn, blast radius của thay đổi nhỏ hơn.
### Interview Notes
- Dùng công thức trả lời: Definition -> Violation -> Refactor -> Trade-off -> Result.

## Liskov Substitution Principle (LSP)
### Overview / Tổng Quan
- Subtype phải thay thế được cho base type mà không phá contract.
### Explanation / Giải thích
- Khi giải thích nguyên lý, nên nêu 1 ví dụ vi phạm + 1 hướng refactor cụ thể.
- Trình bày trade-off: thêm abstraction tăng testability nhưng cũng tăng cognitive load.
### Example / Ví dụ
- Vi phạm: một service vừa validate, vừa persistence, vừa gọi external API.
- Refactor: tách validator/repository/provider và inject qua interface.
- Kết quả: unit test nhẹ hơn, blast radius của thay đổi nhỏ hơn.
### Interview Notes
- Dùng công thức trả lời: Definition -> Violation -> Refactor -> Trade-off -> Result.

## Interface Segregation Principle (ISP)
### Overview / Tổng Quan
- Không ép client phụ thuộc vào method mà nó không dùng.
### Explanation / Giải thích
- Khi giải thích nguyên lý, nên nêu 1 ví dụ vi phạm + 1 hướng refactor cụ thể.
- Trình bày trade-off: thêm abstraction tăng testability nhưng cũng tăng cognitive load.
### Example / Ví dụ
- Vi phạm: một service vừa validate, vừa persistence, vừa gọi external API.
- Refactor: tách validator/repository/provider và inject qua interface.
- Kết quả: unit test nhẹ hơn, blast radius của thay đổi nhỏ hơn.
### Interview Notes
- Dùng công thức trả lời: Definition -> Violation -> Refactor -> Trade-off -> Result.

## Dependency Inversion Principle (DIP)
### Overview / Tổng Quan
- High-level policy phụ thuộc abstraction, không phụ thuộc detail cụ thể.
### Explanation / Giải thích
- Khi giải thích nguyên lý, nên nêu 1 ví dụ vi phạm + 1 hướng refactor cụ thể.
- Trình bày trade-off: thêm abstraction tăng testability nhưng cũng tăng cognitive load.
### Example / Ví dụ
- Vi phạm: một service vừa validate, vừa persistence, vừa gọi external API.
- Refactor: tách validator/repository/provider và inject qua interface.
- Kết quả: unit test nhẹ hơn, blast radius của thay đổi nhỏ hơn.
### Interview Notes
- Dùng công thức trả lời: Definition -> Violation -> Refactor -> Trade-off -> Result.

## DRY, KISS, YAGNI
### Overview / Tổng Quan
- Đây là ba nguyên tắc thực dụng để tránh over-engineering.
### Explanation / Giải thích
- DRY tránh lặp tri thức; KISS ưu tiên cách hiểu đơn giản; YAGNI ngăn xây thứ chưa cần.
- Không nên áp dụng cực đoan; luôn xét bối cảnh sản phẩm, team, và roadmap.
### Example / Ví dụ
- Chưa có yêu cầu plugin thì đừng tạo plugin framework ngay.
- Rule nghiệp vụ lặp lại trên nhiều service thì nên trích xuất shared module.

## Creational Patterns
### Overview / Tổng Quan
- Nhóm pattern này giải quyết một lớp vấn đề lặp đi lặp lại trong thiết kế.
### Explanation / Giải thích
- Chọn pattern theo áp lực thực tế: biến thể tăng, phụ thuộc phức tạp, hoặc yêu cầu testability cao.
### Example / Ví dụ
- Đặt pattern trong bối cảnh cụ thể thay vì nêu định nghĩa khô khan.

### Singleton
#### Overview / Tổng Quan
- Singleton là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Factory Method
#### Overview / Tổng Quan
- Factory Method là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Abstract Factory
#### Overview / Tổng Quan
- Abstract Factory là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Builder
#### Overview / Tổng Quan
- Builder là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Prototype
#### Overview / Tổng Quan
- Prototype là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

## Structural Patterns
### Overview / Tổng Quan
- Nhóm pattern này giải quyết một lớp vấn đề lặp đi lặp lại trong thiết kế.
### Explanation / Giải thích
- Chọn pattern theo áp lực thực tế: biến thể tăng, phụ thuộc phức tạp, hoặc yêu cầu testability cao.
### Example / Ví dụ
- Đặt pattern trong bối cảnh cụ thể thay vì nêu định nghĩa khô khan.

### Adapter
#### Overview / Tổng Quan
- Adapter là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Bridge
#### Overview / Tổng Quan
- Bridge là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Composite
#### Overview / Tổng Quan
- Composite là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Decorator
#### Overview / Tổng Quan
- Decorator là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Facade
#### Overview / Tổng Quan
- Facade là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Flyweight
#### Overview / Tổng Quan
- Flyweight là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Proxy
#### Overview / Tổng Quan
- Proxy là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

## Behavioral Patterns
### Overview / Tổng Quan
- Nhóm pattern này giải quyết một lớp vấn đề lặp đi lặp lại trong thiết kế.
### Explanation / Giải thích
- Chọn pattern theo áp lực thực tế: biến thể tăng, phụ thuộc phức tạp, hoặc yêu cầu testability cao.
### Example / Ví dụ
- Đặt pattern trong bối cảnh cụ thể thay vì nêu định nghĩa khô khan.

### Observer
#### Overview / Tổng Quan
- Observer là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Strategy
#### Overview / Tổng Quan
- Strategy là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Command
#### Overview / Tổng Quan
- Command là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### State
#### Overview / Tổng Quan
- State là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Template Method
#### Overview / Tổng Quan
- Template Method là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Iterator
#### Overview / Tổng Quan
- Iterator là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Chain of Responsibility
#### Overview / Tổng Quan
- Chain of Responsibility là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Mediator
#### Overview / Tổng Quan
- Mediator là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Memento
#### Overview / Tổng Quan
- Memento là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

### Visitor
#### Overview / Tổng Quan
- Visitor là pattern thường gặp trong câu hỏi thiết kế hệ thống và refactor codebase.
#### Explanation / Giải thích
- Nên nêu intent, cấu trúc, thời điểm áp dụng, và anti-case (khi không nên dùng).
- Nếu cần, đưa thêm pseudo-code ngắn để chứng minh hiểu boundary và collaboration.
#### Example / Ví dụ
- Ví dụ production: kết hợp logging/metrics/retry quanh use case thực tế.
- Ví dụ interview: chuyển chuỗi if/else dài sang strategy/factory để mở rộng an toàn.

## Anti-Patterns
### Overview / Tổng Quan
- Nhận diện mẫu xấu giúp bạn phản biện thiết kế và đề xuất refactor đúng hướng.
### Explanation / Giải thích
- Anti-pattern phổ biến: God Object, Spaghetti Code, Golden Hammer, Premature Optimization, Copy-Paste Architecture.
### Example / Ví dụ
- Khi một class vượt quá phạm vi responsibility, tách theo bounded context và thêm module boundaries.
- Khi flow rối khó test, chuẩn hóa layering và enforce dependency rules bằng static analysis.

## Pattern Selection Matrix
### Explanation / Giải thích
- Bảng này hỗ trợ chọn pattern theo symptom thay vì chọn theo sở thích cá nhân.

| Symptom | Pattern Candidates | Why |
| --- | --- | --- |
| Many if/else by type | Strategy + Factory Method | Dễ mở rộng variant |
| Need to wrap 3rd party API | Adapter | Chuẩn hóa interface nội bộ |
| Add behavior without modifying base | Decorator | Composition linh hoạt |
| Complex subsystem surface | Facade | Đơn giản hóa cho caller |
| Workflow by states | State | Giảm condition branching |
| Event fan-out updates | Observer | Tách publisher/subscriber |

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] SRP khác gì với việc “mỗi class chỉ có một method”?
- **Trả lời:** SRP nói về một lý do thay đổi theo actor nghiệp vụ, không phải giới hạn số method một cách máy móc.
- **Giải thích:** Câu trả lời mạnh cần kèm refactor plan và trade-off rõ ràng.

### 🟢 [Junior] Khi nào DRY có thể phản tác dụng?
- **Trả lời:** Khi trích xuất abstraction quá sớm làm code khó hiểu hơn và giảm tốc độ thay đổi.
- **Giải thích:** Câu trả lời mạnh cần kèm refactor plan và trade-off rõ ràng.

### 🟡 [Mid] Factory Method và Strategy thường đi cùng nhau thế nào?
- **Trả lời:** Factory Method tạo strategy phù hợp theo context, strategy xử lý thuật toán tại runtime.
- **Giải thích:** Câu trả lời mạnh cần kèm refactor plan và trade-off rõ ràng.

### 🟡 [Mid] LSP violation thường biểu hiện ra sao trong test?
- **Trả lời:** Contract test của base class pass cho một số subtype nhưng fail cho subtype vi phạm.
- **Giải thích:** Câu trả lời mạnh cần kèm refactor plan và trade-off rõ ràng.

### 🔴 [Senior] Làm sao tránh over-patterning trong team lớn?
- **Trả lời:** Áp dụng nguyên tắc evidence-based: pattern chỉ thêm khi có pain thực, đo lường trước/sau, và review định kỳ.
- **Giải thích:** Câu trả lời mạnh cần kèm refactor plan và trade-off rõ ràng.

### 🔴 [Senior] DIP giúp migration database/cloud provider như thế nào?
- **Trả lời:** Abstraction ở repository/provider layer giúp thay implementation với impact nhỏ lên core domain logic.
- **Giải thích:** Câu trả lời mạnh cần kèm refactor plan và trade-off rõ ràng.

### 🟢 [Junior] Practice question 1: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 2: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 3: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 4: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 5: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 6: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 7: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 8: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 9: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 10: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 11: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 12: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 13: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 14: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 15: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 16: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 17: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 18: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 19: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 20: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 21: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 22: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 23: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 24: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 25: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 26: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 27: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 28: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 29: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 30: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 31: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 32: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 33: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 34: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 35: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 36: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 37: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 38: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 39: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 40: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 41: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 42: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 43: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 44: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 45: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 46: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 47: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 48: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 49: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟢 [Junior] Practice question 50: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 51: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 52: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 53: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 54: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 55: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 56: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 57: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 58: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 59: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 60: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 61: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 62: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 63: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 64: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 65: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 66: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 67: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 68: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 69: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 70: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 71: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 72: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 73: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 74: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 75: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 76: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 77: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 78: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 79: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 80: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 81: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 82: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 83: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 84: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 85: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 86: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 87: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 88: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 89: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 90: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 91: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 92: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 93: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 94: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 95: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 96: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 97: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 98: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 99: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 100: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 101: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 102: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 103: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 104: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 105: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 106: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 107: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 108: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 109: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🟡 [Mid] Practice question 110: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 111: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 112: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 113: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 114: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 115: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 116: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 117: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 118: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 119: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 120: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 121: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 122: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 123: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 124: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 125: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 126: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 127: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 128: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 129: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 130: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 131: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 132: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 133: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 134: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 135: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 136: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 137: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 138: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 139: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 140: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 141: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 142: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 143: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 144: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 145: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 146: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 147: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 148: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 149: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 150: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 151: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 152: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 153: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

### 🔴 [Senior] Practice question 154: How would you apply SOLID/patterns without over-engineering?
- **Trả lời:** Bắt đầu từ pain point cụ thể, chọn nguyên lý/pattern tối thiểu để giải quyết, rồi đo hiệu quả bằng testability và change lead time.
- **Giải thích:** Nếu không có pain rõ ràng thì ưu tiên giải pháp đơn giản; abstraction thừa sẽ tăng cognitive load.
- **Ví dụ:** Tách interface tại boundary external service để test dễ hơn, nhưng giữ domain core đơn giản để team mới dễ đọc.

## Cross-References
- Architecture styles: `./02-architecture-styles.md`
- SDLC and engineering practices: `./03-sdlc-and-practices.md`


---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What are the SOLID principles? / SOLID principles là gì? 🟡 Mid

**A:** 5 object-oriented design principles:
- **S** — Single Responsibility: one reason to change per class
- **O** — Open/Closed: open for extension, closed for modification
- **L** — Liskov Substitution: subclasses substitutable for base class
- **I** — Interface Segregation: many small interfaces vs one fat interface
- **D** — Dependency Inversion: depend on abstractions not concretions

```typescript
// DIP — Dependency Inversion (enables testability)
// BAD: high-level depends on low-level
class UserService {
  private db = new MySQLDatabase(); // tightly coupled
}

// GOOD: depend on abstraction
interface Database { query(id: string): User; }
class UserService {
  constructor(private db: Database) {} // injected!
}
// Can now swap MySQL → PostgreSQL → mock in tests
```

Vietnamese explanation: SOLID là guidelines không phải rules cứng. DIP là foundation của Dependency Injection (Spring, NestJS, Go interfaces). LSP hay vi phạm: Rectangle vs Square (Square extends Rectangle nhưng setWidth/setHeight không work the same). OCP: dùng Strategy pattern (swap behavior) không dùng inheritance chain. Interview: explain bằng concrete violation example.

---

### Q: What is the Observer pattern? Where is it used in frontend? / Observer pattern trong frontend? 🟡 Mid

**A:** Observer: one-to-many dependency — when Subject changes state, all Observers notified automatically.

```typescript
class EventEmitter {
  private listeners = new Map<string, Set<Function>>();

  on(event: string, fn: Function) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(fn);
  }
  off(event: string, fn: Function) { this.listeners.get(event)?.delete(fn); }
  emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach(fn => fn(...args));
  }
}

// Observer everywhere in frontend:
// DOM addEventListener, Node.js EventEmitter, RxJS, Redux store, React Query cache
```

Vietnamese explanation: Publisher-Subscriber (Pub/Sub) = Observer + message broker (observers don't know about publisher). Key pitfall: memory leaks — không removeEventListener/unsubscribe → listeners retained in memory. React useEffect cleanup = unsubscribe pattern. Redux: store is Subject, connected components are Observers.

---

### Q: What is the Factory pattern and its variants? / Factory pattern và các variants? 🟡 Mid

**A:** **Factory Method**: interface for creating objects, subclasses decide which class. **Abstract Factory**: create families of related objects — ensures consistency across product family.

```typescript
// Factory Method — one product type
abstract class PaymentProcessor {
  abstract createPayment(): Payment; // factory method
  process(amount: number) {
    const p = this.createPayment(); // delegates creation
    p.charge(amount);
  }
}
class StripeProcessor extends PaymentProcessor {
  createPayment() { return new StripePayment(); }
}

// Abstract Factory — consistent product families
interface UIFactory {
  createButton(): Button;
  createDialog(): Dialog;
}
class MacUIFactory implements UIFactory {
  createButton() { return new MacButton(); }  // Mac-style
  createDialog() { return new MacDialog(); }  // Mac-style (consistent!)
}
```

Vietnamese explanation: Factory Method: decouple creation từ usage (know type at runtime). Abstract Factory: ensure consistency (all Mac-style, no mixing Mac button + Windows dialog). Practical React: component libraries use Abstract Factory for theming. Cross-platform apps: React Native components for iOS vs Android = Abstract Factory concept.

---

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Point |
|----------|-------|-----------|
| SOLID principles | 🟡 | 5 OO design guidelines; DIP enables dependency injection |
| Observer pattern | 🟡 | Subject notifies observers; DOM events, Redux, RxJS all use it |
| Factory patterns | 🟡 | Factory Method=one product; Abstract Factory=consistent families |

---

## Self-Check / Tự Kiểm Tra

- [ ] Tôi có thể giải thích SRP và cho ví dụ một class vi phạm nó không?
- [ ] Tôi có thể giải thích OCP bằng ví dụ thêm payment provider mới không làm vỡ code cũ không?
- [ ] Tôi có thể phân biệt Strategy Pattern vs State Pattern không?
- [ ] Tôi có thể implement Observer Pattern (ví dụ event system) từ đầu không?
- [ ] Tôi có thể chỉ ra 2 design patterns trong code React/Go tôi đang viết không?

💬 **Feynman Prompt:** Giải thích "Open/Closed Principle" cho junior developer bằng ví dụ thực tế — tại sao thêm tính năng bằng cách "thêm code mới" tốt hơn "sửa code cũ"?

---

## Connections / Liên Kết

- ⬅️ **Built on:** OOP fundamentals (class, interface, inheritance) — SOLID chỉ apply được khi bạn hiểu OOP
- ➡️ **Enables:** [Architecture Styles](./02-architecture-styles.md) — Clean Architecture, Hexagonal đều built on SOLID
- 🔗 **Patterns in practice:** React components (SRP), Redux (Observer), React Context (DIP), Go interfaces (LSP)
