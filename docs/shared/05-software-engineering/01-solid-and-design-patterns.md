# SOLID Principles & Design Patterns / Nguyên Tắc SOLID và Mẫu Thiết Kế

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Architecture Styles](./02-architecture-styles.md) | [Code Quality](./05-code-quality-and-review.md)

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

