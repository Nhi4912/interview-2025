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

> 🧠 **Memory Hook:** "Đầu bếp chỉ nấu ăn" — một đầu bếp giỏi không kiêm luôn kế toán, phục vụ, và dọn dẹp. Class tốt cũng vậy.

**Tại sao tồn tại? / Why does this exist?**

Khi một class làm quá nhiều việc, mỗi lần thay đổi bất kỳ chức năng nào đều có thể làm hỏng các chức năng khác. Team A sửa logic thanh toán lại break luôn phần gửi email mà Team B đang dùng.
→ **Why?** Vì code bị coupled — các lý do thay đổi khác nhau bị trộn lẫn vào một nơi.
→ **Why?** Vì không có ranh giới rõ ràng giữa các "actor" (ai yêu cầu thay đổi) — kế toán muốn đổi cách tính thuế, IT muốn đổi cách lưu DB, đều đụng vào cùng một class.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng một nhà hàng. Đầu bếp giỏi **chỉ nấu ăn** — anh ta không ra bàn phục vụ, không tính tiền, không dọn bàn. Nếu khách phàn nàn về hóa đơn, bạn tìm thu ngân, không phải đầu bếp. Nếu muốn thêm món mới, bạn chỉ cần gặp đầu bếp. Mỗi người có **một lý do duy nhất** để được gọi đến. Class trong code cũng vậy — mỗi class nên có đúng một lý do để thay đổi.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
VI PHẠM SRP:                        TUÂN THỦ SRP:
┌──────────────────────┐            ┌──────────────┐
│     UserService      │            │  UserValidator│ ← validate logic
│  + validate()        │            └──────────────┘
│  + saveToDatabase()  │  refactor  ┌──────────────┐
│  + sendEmail()       │  ────────► │   UserRepo   │ ← DB logic
│  + generateReport()  │            └──────────────┘
│                      │            ┌──────────────┐
│ 4 reasons to change! │            │  UserMailer  │ ← email logic
└──────────────────────┘            └──────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Micro-class syndrome**: Áp dụng SRP cực đoan → tạo ra hàng trăm class nhỏ li ti, khó trace flow và tăng cognitive load cho người mới
- **False SRP**: Tách class theo method count, không phải theo "actor" — `UserReader` và `UserWriter` không phải SRP nếu cùng một actor dùng cả hai
- **Transaction boundary**: Validate + Save thường phải nằm cùng nhau trong transaction — tách ra là SRP đúng nhưng cần xử lý transaction cẩn thận
- **SRP ở module level**: SRP không chỉ áp dụng cho class — một module/package cũng nên chỉ phục vụ một bounded context

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                        | Tại sao sai                                           | Đúng là                                                          |
| -------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------- |
| "Mỗi class chỉ có 1 method là đúng SRP"                        | SRP về _lý do thay đổi_, không phải số method         | Một class có nhiều method nhưng cùng phục vụ một actor là hợp lệ |
| Tách class theo loại kỹ thuật: `Reader`, `Writer`, `Processor` | Tách theo loại kỹ thuật ≠ tách theo actor nghiệp vụ   | Tách theo ai yêu cầu thay đổi: kế toán, IT, marketing...         |
| Refactor SRP ngay khi mới viết code                            | Over-engineering sớm, chưa biết ai là "actor" thực sự | Chờ đến khi thấy class bị sửa vì ≥2 lý do khác nhau              |

**🎯 Interview Pattern:**

- Khi thấy: class có method `validate()`, `save()`, `sendEmail()` trong cùng một file
- → Nhớ đến: Single Responsibility Principle — nhiều "actor" đang dùng chung một class
- → Mở đầu: "Tôi thấy class này đang vi phạm SRP vì nó có nhiều hơn một lý do để thay đổi — tôi sẽ tách theo actor nghiệp vụ..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [OOP Basics](./00-programming-paradigms.md)
- ➡️ Để hiểu tiếp: [Open/Closed Principle](#openclosed-principle-ocp)

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

> 🧠 **Memory Hook:** "Ổ cắm điện" — bạn không cắt dây kéo điện để thêm thiết bị mới, bạn chỉ cần cắm vào ổ cắm có sẵn.

**Tại sao tồn tại? / Why does this exist?**

Mỗi lần thêm tính năng mới mà phải sửa code cũ, bạn đang đặt cược rằng code cũ không bị vỡ. Với codebase lớn, không ai dám chắc điều đó. Test cũ fail, bug xuất hiện ở chỗ không ngờ tới.
→ **Why?** Vì code cũ đã được test và hoạt động — sửa nó đồng nghĩa với rủi ro regression.
→ **Why?** Vì không có điểm mở rộng (extension point) được thiết kế trước — thiếu abstraction, mọi thứ bị hardcode.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nhìn vào ổ cắm điện ở nhà bạn. Khi muốn dùng thêm máy tính, quạt, hay bếp điện — bạn **không cần đục tường kéo thêm dây**. Bạn chỉ cắm vào ổ cắm đã có. Ổ cắm được "đóng" để sửa đổi (bạn không phá hủy nó) nhưng "mở" để mở rộng (thêm thiết bị bất kỳ). Code tuân thủ OCP cũng vậy — thêm tính năng bằng cách thêm code mới, không sửa code cũ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
VI PHẠM OCP:                         TUÂN THỦ OCP:
function calcArea(shape) {            interface Shape {
  if (shape.type === 'circle')          area(): number
    return Math.PI * r²               }
  if (shape.type === 'square')        class Circle implements Shape { area() {...} }
    return s * s                      class Square implements Shape { area() {...} }
  // Thêm triangle → phải sửa fn!    class Triangle implements Shape { area() {...} }
}                                     // Thêm mới → chỉ thêm class, không sửa gì!

          ┌─────────────┐
          │  <<Shape>>  │ ← abstraction (đóng để sửa)
          └──────┬──────┘
        ┌────────┼────────┐
        ▼        ▼        ▼
     Circle   Square  Triangle  ← mở để mở rộng
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Over-abstraction sớm**: Tạo interface cho mọi thứ khi chỉ có 1 implementation — YAGNI vi phạm, chờ đến khi có 2+ variants mới extract
- **Plugin architecture cost**: OCP hoàn hảo thường đòi hỏi plugin system phức tạp — cân nhắc chi phí vs lợi ích thực tế
- **Configuration vs Extension**: Đôi khi thêm config parameter đơn giản hơn tạo subclass — không phải lúc nào OCP cũng cần class hierarchy
- **OCP ở API level**: API public contract cũng cần OCP — breaking change = vi phạm OCP với consumers của bạn

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                               | Tại sao sai                                                   | Đúng là                                                            |
| ----------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| "OCP = không được sửa code cũ bao giờ"                | Bug fix và refactor vẫn được phép sửa code cũ                 | OCP chỉ áp dụng khi _thêm tính năng mới_ — không phải fix bug      |
| Tạo interface ngay từ đầu khi chỉ có 1 implementation | Premature abstraction, không ai biết extension point ở đâu    | Chờ lần thứ 2 cần extend, lúc đó mới extract interface             |
| "Closed" có nghĩa là code bị khóa, không ai sửa được  | Misunderstanding — "closed" có nghĩa là stable, không cần sửa | Module được coi là "done" và tested — thêm mới qua extension point |

**🎯 Interview Pattern:**

- Khi thấy: chuỗi `if/else if` hoặc `switch/case` theo type, phải thêm case mới mỗi lần có loại mới
- → Nhớ đến: Open/Closed Principle — thiếu extension point, đang vi phạm OCP
- → Mở đầu: "Pattern này vi phạm OCP — tôi sẽ extract interface và dùng polymorphism để thêm loại mới mà không sửa code cũ..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Single Responsibility Principle](#single-responsibility-principle-srp)
- ➡️ Để hiểu tiếp: [Liskov Substitution Principle](#liskov-substitution-principle-lsp)

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

> 🧠 **Memory Hook:** "Pin AA" — bất kỳ pin AA nào cũng hoạt động trong cùng một thiết bị, bạn không cần đọc manual khi thay pin.

**Tại sao tồn tại? / Why does this exist?**

Khi bạn có một list `Bird[]` và gọi `.fly()` trên tất cả, bạn kỳ vọng tất cả đều bay được. Nếu `Penguin extends Bird` và `fly()` throw exception — chương trình crash ở runtime. Subclass phá vỡ kỳ vọng của caller.
→ **Why?** Vì inheritance bị dùng sai — "Penguin IS-A Bird" về mặt sinh học, nhưng không phải về mặt hành vi bay.
→ **Why?** Vì không kiểm tra behavioral contract, chỉ kiểm tra structural inheritance — "có extends là được" nhưng quên mất caller cần gì.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Pin AA có một chuẩn chung: điện áp 1.5V, kích thước chuẩn. Khi bạn thay pin AA Duracell bằng pin AA Energizer, thiết bị vẫn chạy bình thường — bạn không cần sửa thiết bị. Nhưng nếu ai đó bán "pin AA" mà thực ra chỉ là vỏ rỗng trông giống pin AA — thiết bị không chạy được dù về hình dáng là đúng. LSP nói rằng: subtype phải **thực sự thay thế được** cho base type, không chỉ trông giống.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
VI PHẠM LSP:                           TUÂN THỦ LSP:
class Bird {                           interface Bird {
  fly(): void { ... }                    move(): void  ← chung cho mọi loài
}                                      }
class Penguin extends Bird {           interface FlyingBird extends Bird {
  fly() {                                fly(): void
    throw new Error("Can't fly!")      }
  }                                    class Eagle implements FlyingBird {
}                                        move() { fly() }
// Caller bị lừa:                        fly() { ... }
birds.forEach(b => b.fly()) // CRASH!  }
                                       class Penguin implements Bird {
                                         move() { swim() }  ← không có fly()
                                       }
                                       // Caller an toàn — chỉ gọi move()
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Precondition strengthening**: Subclass không được yêu cầu input điều kiện chặt hơn base class — vi phạm LSP
- **Postcondition weakening**: Subclass không được trả về ít hơn những gì base class đã hứa
- **History constraint**: Subclass không nên thêm state mutation mà base class không cho phép (ví dụ: immutable base, mutable subclass)
- **LSP ≠ Don't Override**: Override method là hợp lệ, miễn là vẫn thỏa mãn contract của base — đây là điểm hay bị nhầm

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                                   | Tại sao sai                                                 | Đúng là                                                                           |
| ------------------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------- |
| "Penguin là Bird nên phải extends Bird, fly() thì throw exception cho có" | Throw exception phá vỡ contract — caller không expect crash | Tách interface: `Bird` (move) và `FlyingBird` (fly) — Penguin chỉ implements Bird |
| "LSP chỉ là về override method"                                           | LSP bao gồm cả preconditions, postconditions, và invariants | Kiểm tra toàn bộ behavioral contract, không chỉ method signature                  |
| Dùng `instanceof` check để handle subtypes khác nhau                      | Đây là dấu hiệu rõ ràng của LSP violation trong caller      | Thiết kế lại hierarchy để polymorphism hoạt động đúng                             |

**🎯 Interview Pattern:**

- Khi thấy: subclass override method và throw `NotImplementedException` hoặc return giá trị bất ngờ
- → Nhớ đến: Liskov Substitution Principle — subtype không thay thế được base type
- → Mở đầu: "Đây là LSP violation — tôi sẽ tách interface theo hành vi thực sự thay vì theo phân loại tự nhiên..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Open/Closed Principle](#openclosed-principle-ocp)
- ➡️ Để hiểu tiếp: [Interface Segregation Principle](#interface-segregation-principle-isp)

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

> 🧠 **Memory Hook:** "Menu riêng cho từng khách" — khách ăn chay không cần xem menu thịt, khách không uống rượu không cần danh sách wine.

**Tại sao tồn tại? / Why does this exist?**

Khi một interface quá lớn, các class implement nó buộc phải định nghĩa những method chúng không dùng — thường là để trống hoặc throw exception. Điều này tạo ra coupling không cần thiết và code giả mạo.
→ **Why?** Vì interface "béo" ép client phụ thuộc vào những thứ họ không quan tâm — thay đổi một method không liên quan cũng có thể break nhiều class.
→ **Why?** Vì thiếu tư duy về "ai dùng gì" — thiết kế interface từ góc nhìn implementer thay vì từ góc nhìn client.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Nhà hàng 5 sao có menu riêng: menu đồ ăn, menu rượu, menu tráng miệng. Khách ăn chay chỉ nhận menu chay — họ không cần lật qua 20 trang thịt bò để tìm món của mình. Robot nhà máy có thể "làm việc" nhưng không "ăn" và không "ngủ". ISP nói rằng: đừng tạo một interface khổng lồ buộc mọi người implement những thứ họ không cần.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
VI PHẠM ISP:                          TUÂN THỦ ISP:
interface Worker {                    interface Workable {
  work(): void                          work(): void
  eat(): void   // Robot không ăn!    }
  sleep(): void // Robot không ngủ!   interface Eatable {
}                                       eat(): void
class Robot implements Worker {       }
  work() { ... }                      interface Sleepable {
  eat() { ??? }  // Phải viết gì?      sleep(): void
  sleep() { ??? }                     }
}                                     class Human implements
                                        Workable, Eatable, Sleepable { ... }
                                      class Robot implements Workable { ... }
                                      // Mỗi class chỉ implement những gì nó cần
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Interface explosion**: Tách quá nhiều interface nhỏ → phải compose nhiều interface khi implement — cân bằng giữa granularity và usability
- **Role interfaces vs header interfaces**: ISP khuyến khích "role interfaces" (theo hành vi) thay vì "header interfaces" (copy method của class)
- **ISP ở REST API**: Endpoint trả về quá nhiều field mà client không dùng = vi phạm ISP ở API level → consider GraphQL hoặc field projection
- **Backward compatibility**: Thêm method vào interface đã public là breaking change — ISP giúp giảm tần suất phải break interface

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                         | Tại sao sai                                                            | Đúng là                                                          |
| --------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Tạo một `IService` interface với mọi method của class           | Interface béo buộc mọi mock/test phải implement method không liên quan | Tạo nhiều interface nhỏ theo từng use case hoặc client           |
| Để trống method hoặc throw `UnsupportedOperation` khi implement | Đây là dấu hiệu rõ ràng của ISP violation                              | Tách interface để class chỉ implement những gì nó thực sự hỗ trợ |
| "Chỉ có 1 class implement interface thì tách nhỏ làm gì"        | Ngay cả với 1 implementation, interface nhỏ giúp test dễ hơn           | Tách theo client usage, không phải theo số implementation        |

**🎯 Interview Pattern:**

- Khi thấy: class implement interface nhưng nhiều method bị để trống hoặc throw `NotImplemented`
- → Nhớ đến: Interface Segregation Principle — interface quá béo, không phù hợp với client
- → Mở đầu: "Interface này vi phạm ISP — tôi sẽ tách thành các role interface nhỏ hơn theo từng client's need..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Liskov Substitution Principle](#liskov-substitution-principle-lsp)
- ➡️ Để hiểu tiếp: [Dependency Inversion Principle](#dependency-inversion-principle-dip)

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

> 🧠 **Memory Hook:** "Ổ cắm chuẩn quốc tế" — laptop của bạn không được thiết kế cho riêng nguồn điện ở Việt Nam, nó dùng adapter chuẩn để cắm được ở bất kỳ đâu.

**Tại sao tồn tại? / Why does this exist?**

Khi `OrderService` trực tiếp tạo `new Stripe()` bên trong, bạn không thể test `OrderService` mà không kết nối thực sự đến Stripe. Không thể swap sang PayPal mà không sửa `OrderService`. High-level business logic bị trói vào detail kỹ thuật cụ thể.
→ **Why?** Vì thiếu tầng abstraction giữa business logic và infrastructure — hai thứ có lý do thay đổi hoàn toàn khác nhau.
→ **Why?** Vì dependency được "pulled" vào thay vì được "injected" từ ngoài vào — mất kiểm soát, mất khả năng thay thế.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Laptop của bạn có cổng USB-C chuẩn. Nó không quan tâm bạn cắm sạc hiệu Apple, Anker, hay Samsung — miễn là đúng chuẩn USB-C. Đây là DIP: laptop (high-level) phụ thuộc vào chuẩn USB-C (abstraction), không phụ thuộc vào sạc Apple cụ thể (detail). Bạn có thể thay sạc bất kỳ lúc nào mà không cần mua laptop mới. Code với DIP cũng vậy — business logic phụ thuộc vào interface, không phụ thuộc vào implementation cụ thể.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
VI PHẠM DIP:                           TUÂN THỦ DIP:
class OrderService {                   interface PaymentGateway {
  private stripe = new Stripe()          charge(amount: number): void
  pay(amount: number) {                }
    this.stripe.charge(amount)         class OrderService {
  }                                      constructor(
}                                          private payment: PaymentGateway
// Cannot test without real Stripe         ) {}
// Cannot swap to PayPal                 pay(amount: number) {
                                           this.payment.charge(amount)
                                         }
                                       }

HIGH-LEVEL → LOW-LEVEL (BAD)           // Inject bất kỳ:
                                       new OrderService(new Stripe())
HIGH-LEVEL → ABSTRACTION ← LOW-LEVEL  new OrderService(new PayPalGateway())
(GOOD: both depend on interface)       new OrderService(new MockPayment())
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **DI Container overhead**: Framework DI (Spring, NestJS) giúp tự động inject nhưng thêm "magic" — junior có thể khó debug khi injection fail
- **Constructor injection vs property injection**: Constructor injection tốt hơn (dependencies rõ ràng, class luôn valid); property injection dễ miss khi test
- **Circular dependency**: DI tốt nhưng nếu A phụ thuộc B và B phụ thuộc A qua abstraction → circular, cần redesign
- **DIP ≠ DI**: Dependency Injection là một cách _implement_ DIP — DIP là nguyên lý, DI là kỹ thuật

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                                                                      | Đúng là                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| "Dùng `new` trong constructor là vi phạm DIP" | Tạo value object (DTO, entity) bằng `new` là ổn                                                  | Chỉ vi phạm khi `new` tạo _service/infrastructure_ dependency               |
| Nhầm DIP với DI Framework                     | DIP là nguyên lý thiết kế, DI Container là tool                                                  | Có thể làm DIP bằng tay (manual injection) mà không cần framework           |
| Tạo interface cho mọi thứ để "comply DIP"     | Over-engineering — interface không giá trị nếu chỉ có 1 implementation và không bao giờ thay đổi | Áp dụng DIP ở _boundary_ — nơi thực sự cần swap: DB, external API, email... |

**🎯 Interview Pattern:**

- Khi thấy: `new ConcreteService()` hoặc `new Repository()` bên trong business logic class
- → Nhớ đến: Dependency Inversion Principle — high-level đang phụ thuộc trực tiếp vào detail
- → Mở đầu: "Để tuân thủ DIP và cho phép test/swap dễ dàng, tôi sẽ extract interface và inject dependency từ ngoài vào..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Interface Segregation Principle](#interface-segregation-principle-isp)
- ➡️ Để hiểu tiếp: [Creational Patterns](#creational-patterns)

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

> 🧠 **Memory Hook:** "Số điện thoại tổng đài" — công ty có một đầu số duy nhất, ai cũng gọi vào đó, không ai tự quản lý số riêng. Sửa một chỗ, tất cả cập nhật.

**Tại sao tồn tại? / Why does this exist?**

Code bị lặp lại ở nhiều nơi nghĩa là khi cần sửa logic, bạn phải tìm và sửa tất cả các chỗ — bỏ sót một chỗ là có bug. Code phức tạp không cần thiết khiến người đọc mất thời gian giải mã thay vì hiểu business logic. Code xây trước khi cần thường sai về yêu cầu và phải bỏ đi.
→ **Why?** Vì knowledge bị scatter — khi rule nghiệp vụ thay đổi, không biết cần update bao nhiêu chỗ.
→ **Why?** Vì thiếu single source of truth — mỗi lần copy-paste là tạo thêm một "phiên bản" sẽ drift khỏi phiên bản gốc theo thời gian.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

**DRY** như số điện thoại tổng đài: công ty có một số hotline duy nhất, in trên danh thiếp, website, mọi nơi. Khi đổi số, chỉ cần đổi một chỗ — tất cả cập nhật. **KISS** như chỉ đường: "đi thẳng 500m, rẽ trái" rõ ràng hơn là bản đồ 20 bước phức tạp. **YAGNI** như đặt đồ ăn: chỉ đặt những gì bạn sắp ăn ngay, không "đặt phòng" cho khách tưởng tượng chưa xuất hiện.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
DRY — Don't Repeat Yourself:
  VI PHẠM:                          TUÂN THỦ:
  // File A                         // utils.ts
  const tax = price * 0.1           function calcTax(price: number) {
  // File B                           return price * 0.1
  const tax = price * 0.1           }
  // File C                         // Dùng ở mọi nơi:
  const tax = price * 0.1           const tax = calcTax(price)
  // Đổi thuế suất → sửa 3 chỗ!    // Đổi thuế suất → sửa 1 chỗ!

KISS — Keep It Simple, Stupid:
  ❌ Đừng: regex 50 ký tự để validate email khi .includes('@') đủ dùng cho context
  ✅ Làm: code đơn giản nhất pass được test là code tốt nhất

YAGNI — You Aren't Gonna Need It:
  ❌ Đừng: xây plugin system khi chỉ có 1 loại plugin trong roadmap hiện tại
  ✅ Làm: viết code cho yêu cầu hiện tại, refactor khi yêu cầu mới xuất hiện
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **DRY ≠ No Copy-Paste**: Hai đoạn code trông giống nhau nhưng có thể evolve theo hai hướng khác nhau — đừng DRY chúng nếu chúng thuộc hai domain khác nhau
- **KISS không có nghĩa là đơn giản hóa sai**: Code đơn giản nhất là code dễ hiểu nhất cho người _maintain_ — không phải ít line nhất
- **YAGNI vs Technical Debt**: Đôi khi xây abstraction sớm là hợp lý nếu cost của việc thêm sau cao hơn — đây là engineering judgment, không phải rule cứng
- **Rule of Three**: Tốt hơn là chờ đến lần lặp thứ 3 mới extract abstraction — lần đầu: write, lần hai: duplicate với điều chỉnh, lần ba: refactor

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                        | Tại sao sai                                                                  | Đúng là                                                                        |
| ---------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| DRY mọi đoạn code trông giống nhau             | Code giống nhau ≠ knowledge giống nhau — coupling hai domain khác nhau       | DRY khi hai chỗ thể hiện cùng một _rule nghiệp vụ_, không phải cùng _syntax_   |
| "YAGNI = không bao giờ chuẩn bị cho tương lai" | YAGNI ngăn _implement_ thứ chưa cần, không ngăn _thiết kế_ cho extensibility | Thiết kế tốt (tên rõ, module nhỏ) vẫn OK; đừng xây feature chưa có requirement |
| Ép KISS = code ngắn nhất                       | Code ngắn có thể cực kỳ khó đọc (one-liner phức tạp, nested ternary)         | KISS = code mà đồng nghiệp không cần giải thích mới hiểu được                  |

**🎯 Interview Pattern:**

- Khi thấy: logic giống nhau ở 3+ file, hoặc class có 500+ lines làm mọi thứ, hoặc feature "phòng khi sau này cần"
- → Nhớ đến: DRY (extract), KISS (simplify), YAGNI (remove premature)
- → Mở đầu: "Tôi thấy thuế suất 10% được hardcode ở 5 chỗ — vi phạm DRY, tôi sẽ extract thành constant để có single source of truth..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [SOLID Principles](#solid-principles--nguyên-tắc-solid)
- ➡️ Để hiểu tiếp: [Creational Patterns](#creational-patterns)

### Overview / Tổng Quan

- Đây là ba nguyên tắc thực dụng để tránh over-engineering.

### Explanation / Giải thích

- DRY tránh lặp tri thức; KISS ưu tiên cách hiểu đơn giản; YAGNI ngăn xây thứ chưa cần.
- Không nên áp dụng cực đoan; luôn xét bối cảnh sản phẩm, team, và roadmap.

### Example / Ví dụ

- Chưa có yêu cầu plugin thì đừng tạo plugin framework ngay.
- Rule nghiệp vụ lặp lại trên nhiều service thì nên trích xuất shared module.

## Creational Patterns

> 🧠 **Memory Hook:** "Nhà máy sản xuất" — bạn đặt hàng, nhà máy biết cách tạo ra sản phẩm đúng chuẩn. Bạn không cần biết dây chuyền bên trong.

**Tại sao tồn tại? / Why does this exist?**

Khi logic tạo object phức tạp (nhiều bước, nhiều variant, nhiều điều kiện), code `new Foo(arg1, arg2, ...)` rải khắp nơi trở nên khó maintain. Muốn đổi cách tạo object phải tìm và sửa tất cả chỗ gọi `new`.
→ **Why?** Vì creation logic và usage logic bị trộn lẫn — vi phạm SRP.
→ **Why?** Vì caller không nên biết _cách_ tạo object, chỉ cần biết _loại_ object họ muốn — abstraction bị thiếu ở tầng creation.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Khi bạn đặt hàng tại nhà máy Toyota, bạn chỉ chọn model (Camry, Corolla, RAV4) và màu sắc. Nhà máy biết cách lắp ráp từng phiên bản — bạn không cần biết có bao nhiêu bước, cần bao nhiêu linh kiện. **Factory** = đặt hàng theo loại. **Builder** = đặt hàng tùy chỉnh từng chi tiết (xe tùy chọn). **Singleton** = showroom mẫu — chỉ có một chiếc trưng bày, ai vào cũng xem cùng một chiếc. **Prototype** = photocopy bản mẫu — clone nhanh thay vì làm lại từ đầu.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
CREATIONAL PATTERNS — Khi nào dùng gì:

┌─────────────────┬──────────────────────────┬────────────────────────────┐
│ Pattern         │ Vấn đề giải quyết        │ Ví dụ thực tế              │
├─────────────────┼──────────────────────────┼────────────────────────────┤
│ Singleton       │ Cần đúng 1 instance      │ DB connection pool, Config │
│ Factory Method  │ Không biết type lúc      │ UI components, parsers     │
│                 │ compile time             │ theo format                │
│ Abstract Factory│ Tạo family objects       │ UI theme (Dark/Light),     │
│                 │ consistent nhau          │ cross-platform components  │
│ Builder         │ Object nhiều param       │ Query builder, HTTP request│
│                 │ tùy chọn phức tạp        │ builder, test fixtures     │
│ Prototype       │ Clone nhanh object       │ Copy document, game spawn  │
│                 │ có state sẵn             │ enemies with presets       │
└─────────────────┴──────────────────────────┴────────────────────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Singleton và global state**: Singleton dễ trở thành global mutable state — khó test, gây hidden coupling; prefer dependency injection thay thế
- **Abstract Factory complexity**: Khi chỉ có 1-2 variant, Abstract Factory là overkill — Simple Factory function thường đủ
- **Builder fluent API**: Fluent builder (chainable methods) rất readable nhưng nếu object luôn cần tất cả fields thì regular constructor rõ hơn
- **Prototype deep vs shallow copy**: Clone object phức tạp có nested reference cần deep copy — JavaScript `structuredClone()` vs custom clone logic

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                             | Tại sao sai                                                                     | Đúng là                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Dùng Singleton cho mọi service "chỉ cần 1 instance" | Singleton cứng nhắc, khó test, gây global state coupling                        | Dùng DI container với singleton scope — linh hoạt hơn, testable     |
| Nhầm Factory Method và Simple Factory               | Factory Method là pattern có subclass override; Simple Factory là static helper | Simple Factory đủ dùng trong hầu hết trường hợp — chọn đúng công cụ |
| Builder khi constructor đơn giản                    | Builder thêm boilerplate không cần thiết cho object ít param                    | Dùng Builder khi ≥4 optional params hoặc cần validate khi build     |

**🎯 Interview Pattern:**

- Khi thấy: nhiều `new ConcreteClass()` rải khắp code, hoặc logic tạo object phức tạp với nhiều điều kiện
- → Nhớ đến: Creational Patterns — cần centralize và abstract object creation
- → Mở đầu: "Tôi thấy object creation đang bị scatter và phức tạp — tôi sẽ dùng Factory để centralize và OCP để dễ thêm loại mới..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [SOLID Principles](#solid-principles--nguyên-tắc-solid)
- ➡️ Để hiểu tiếp: [Structural Patterns](#structural-patterns)

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

> 🧠 **Memory Hook:** "Lắp ghép LEGO" — mỗi mảnh LEGO có chuẩn chốt riêng, bạn ghép chúng lại theo cách bạn muốn mà không cần phá vỡ mảnh nào.

**Tại sao tồn tại? / Why does this exist?**

Khi cần tích hợp hệ thống có interface không tương thích, hoặc thêm behavior mà không muốn sửa class gốc, hoặc che giấu độ phức tạp của một subsystem khổng lồ — bạn cần patterns để _compose_ objects theo cách linh hoạt.
→ **Why?** Vì class hierarchy cứng nhắc không đủ linh hoạt — inheritance không giải quyết được composition-time decisions.
→ **Why?** Vì thế giới thực có nhiều hệ thống legacy, third-party API, và subsystem phức tạp cần được wrap và expose theo cách phù hợp.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

LEGO cho phép bạn ghép bất kỳ mảnh nào với nhau nhờ chuẩn chốt chung — mảnh tàu vũ trụ có thể ghép với mảnh lâu đài mà không cần thiết kế lại. **Adapter** = đầu chuyển đổi phích cắm (chuyển chuẩn EU sang UK). **Decorator** = áo mưa mặc thêm vào bên ngoài (thêm waterproof mà không đổi quần áo trong). **Facade** = remote TV (một nút, hàng trăm lệnh phức tạp bên trong). **Proxy** = lễ tân văn phòng (kiểm soát ai được gặp sếp và khi nào).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
STRUCTURAL PATTERNS — Compose objects:

Adapter:                              Decorator:
┌──────────┐    ┌──────────┐         ┌──────────────────────────────┐
│  Client  │───►│ Adapter  │         │ LoggingDecorator             │
└──────────┘    └────┬─────┘         │  ┌────────────────────────┐  │
                     │ wraps         │  │  CachingDecorator      │  │
                     ▼               │  │  ┌──────────────────┐  │  │
              ┌──────────┐           │  │  │  RealService     │  │  │
              │  Adaptee │           │  │  └──────────────────┘  │  │
              │ (Old API)│           │  └────────────────────────┘  │
              └──────────┘           └──────────────────────────────┘

Facade:                               Proxy:
┌────────┐  ┌──────────────────┐     ┌────────┐  ┌───────┐  ┌─────────┐
│ Client │─►│     Facade       │     │ Client │─►│ Proxy │─►│ RealObj │
└────────┘  │ ┌────┐ ┌──────┐ │     └────────┘  └───────┘  └─────────┘
            │ │ S1 │ │  S2  │ │                (auth / cache / lazy-init)
            │ └────┘ └──────┘ │
            └──────────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Decorator ordering matters**: Thứ tự wrap Decorator ảnh hưởng đến kết quả — `Logging(Caching(Service))` vs `Caching(Logging(Service))` khác nhau
- **Facade không che hết**: Facade đơn giản hóa nhưng không ẩn hoàn toàn — đôi khi caller vẫn cần truy cập subsystem trực tiếp
- **Proxy vs Decorator**: Proxy kiểm soát _access_, Decorator thêm _behavior_ — dùng nhầm gây khó hiểu cho maintainer
- **Adapter hai chiều**: Object adapter (composition) linh hoạt hơn class adapter (inheritance) — prefer composition

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                         | Tại sao sai                                                                   | Đúng là                                                                                 |
| ----------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Nhầm Decorator với Inheritance để thêm behavior | Inheritance tạo coupling cứng, không linh hoạt at runtime                     | Decorator dùng composition — có thể thêm/bỏ behavior lúc runtime                        |
| Facade phải che hết mọi method của subsystem    | Facade quá lớn trở thành God Object                                           | Facade chỉ expose những gì client thực sự cần — partial coverage là OK                  |
| Proxy và Adapter hay bị nhầm nhau               | Adapter thay đổi interface; Proxy giữ nguyên interface nhưng kiểm soát access | Proxy: same interface + cross-cutting concerns; Adapter: bridge hai interface khác nhau |

**🎯 Interview Pattern:**

- Khi thấy: tích hợp third-party library không compatible, cần thêm logging/caching/auth mà không sửa class gốc
- → Nhớ đến: Structural Patterns — Adapter (bridge interface), Decorator (add behavior), Proxy (control access)
- → Mở đầu: "Thay vì sửa class gốc, tôi sẽ dùng Decorator để wrap và thêm behavior — giữ nguyên OCP và SRP..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Creational Patterns](#creational-patterns)
- ➡️ Để hiểu tiếp: [Behavioral Patterns](#behavioral-patterns)

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

> 🧠 **Memory Hook:** "Luật giao thông" — mỗi người tham gia giao thông biết phải làm gì theo luật, không ai cần ra lệnh trực tiếp từng người.

**Tại sao tồn tại? / Why does this exist?**

Khi objects cần giao tiếp với nhau nhưng không muốn couple chặt chẽ — ví dụ Button không nên biết chi tiết về Database, hay khi cần swap algorithm lúc runtime, hay khi một sự kiện cần notify nhiều nơi mà không biết trước có bao nhiêu.
→ **Why?** Vì object communication patterns phức tạp và hay lặp lại — nếu không có pattern, mọi người sẽ tự invented ra các cách khác nhau, khó maintain.
→ **Why?** Vì coupling giữa sender và receiver cần được giảm thiểu — thay đổi receiver không nên ép buộc thay đổi sender.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Luật giao thông là behavioral pattern của xã hội: khi đèn đỏ, tất cả xe dừng — không cần cảnh sát đứng ra lệnh từng xe. **Observer** = đèn giao thông thông báo cho tất cả xe. **Strategy** = GPS chọn đường: nhanh nhất, tránh phí, tránh đường cao tốc — swap thuật toán mà không đổi app. **Command** = lệnh lái xe được ghi lại, có thể undo (lùi lại). **Chain of Responsibility** = trạm kiểm soát trên cao tốc — mỗi trạm xử lý loại xe của mình, chuyển tiếp nếu không phải phần mình.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
BEHAVIORAL PATTERNS — Quản lý communication:

Observer:                              Strategy:
┌───────────┐ notify()  ┌──────┐      ┌──────────────────────────────┐
│  Subject  │──────────►│ Obs1 │      │ Context                      │
│(EventBus) │           └──────┘      │  strategy: SortStrategy      │
│           │──────────►│ Obs2 │      │  execute() {                 │
└───────────┘           └──────┘      │    strategy.sort(data)       │
 subscribe / unsubscribe              │  }                           │
                                      └──────────────────────────────┘
Command:                               ┌────────────┐ ┌─────────────┐
┌─────────┐ ┌──────────┐ ┌────────┐   │ BubbleSort │ │  QuickSort  │
│ Invoker │►│ Command  │►│Receive │   └────────────┘ └─────────────┘
│(Button) │ │ execute()│ │   r    │   swap at runtime — no if/else!
└─────────┘ │  undo()  │ └────────┘
            └──────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Observer memory leak**: Subscriber đăng ký nhưng quên unsubscribe → memory leak trong long-lived apps (React useEffect cleanup)
- **Strategy over-engineering**: Nếu chỉ có 2 algorithms và không thay đổi, simple if/else rõ ràng hơn Strategy pattern
- **Command undo complexity**: Undo stack cần lưu state trước mỗi command — với complex state, cần Memento pattern kết hợp
- **Chain of Responsibility vs Middleware**: Express/Koa middleware là Chain of Responsibility — thứ tự middleware quan trọng, sai thứ tự là bug

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                   | Tại sao sai                                                          | Đúng là                                                               |
| --------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Observer và EventEmitter là khác nhau hoàn toàn           | EventEmitter là implementation của Observer pattern                  | EventEmitter, Redux store, RxJS Observable đều là Observer variations |
| Strategy phải là class riêng biệt                         | Over-engineering — strategy chỉ cần là function trong nhiều ngôn ngữ | Trong TypeScript/JS, function-as-strategy thường đủ và đơn giản hơn   |
| "Chain of Responsibility = nếu không ai xử lý thì bỏ qua" | Request bị dropped silently là bug tiềm ẩn                           | Luôn có default handler hoặc throw explicit error khi không ai handle |

**🎯 Interview Pattern:**

- Khi thấy: nhiều component cần react với cùng một event, hoặc cần swap algorithm at runtime, hoặc cần undo/redo
- → Nhớ đến: Behavioral Patterns — Observer (event fan-out), Strategy (swap algo), Command (undo)
- → Mở đầu: "Vì nhiều component cần respond với sự kiện này, tôi sẽ dùng Observer pattern để decouple publisher khỏi subscribers..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Structural Patterns](#structural-patterns)
- ➡️ Để hiểu tiếp: [Architecture Styles](./02-architecture-styles.md)

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

| Symptom                             | Pattern Candidates        | Why                        |
| ----------------------------------- | ------------------------- | -------------------------- |
| Many if/else by type                | Strategy + Factory Method | Dễ mở rộng variant         |
| Need to wrap 3rd party API          | Adapter                   | Chuẩn hóa interface nội bộ |
| Add behavior without modifying base | Decorator                 | Composition linh hoạt      |
| Complex subsystem surface           | Facade                    | Đơn giản hóa cho caller    |
| Workflow by states                  | State                     | Giảm condition branching   |
| Event fan-out updates               | Observer                  | Tách publisher/subscriber  |

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
interface Database {
  query(id: string): User;
}
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
  off(event: string, fn: Function) {
    this.listeners.get(event)?.delete(fn);
  }
  emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach((fn) => fn(...args));
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
  createPayment() {
    return new StripePayment();
  }
}

// Abstract Factory — consistent product families
interface UIFactory {
  createButton(): Button;
  createDialog(): Dialog;
}
class MacUIFactory implements UIFactory {
  createButton() {
    return new MacButton();
  } // Mac-style
  createDialog() {
    return new MacDialog();
  } // Mac-style (consistent!)
}
```

Vietnamese explanation: Factory Method: decouple creation từ usage (know type at runtime). Abstract Factory: ensure consistency (all Mac-style, no mixing Mac button + Windows dialog). Practical React: component libraries use Abstract Factory for theming. Cross-platform apps: React Native components for iOS vs Android = Abstract Factory concept.

---

## Interview Q&A Summary / Tổng Kết

| Question         | Level | Key Point                                                        |
| ---------------- | ----- | ---------------------------------------------------------------- |
| SOLID principles | 🟡    | 5 OO design guidelines; DIP enables dependency injection         |
| Observer pattern | 🟡    | Subject notifies observers; DOM events, Redux, RxJS all use it   |
| Factory patterns | 🟡    | Factory Method=one product; Abstract Factory=consistent families |

---

## Self-Check / Tự Kiểm Tra

| #   | Loại / Type    | Câu Hỏi Kiểm Tra                                                      | Đạt Khi                                                                                                     |
| --- | -------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1   | 🔁 Retrieval   | Giải thích SRP và cho ví dụ một class vi phạm nó                      | Nêu được "1 lý do thay đổi", ví dụ UserService vừa validate vừa save vừa gửi email                          |
| 2   | 👁️ Visual      | Vẽ sơ đồ OCP: thêm payment provider mới không làm vỡ code cũ          | Vẽ được interface `PaymentGateway` + 2+ implementors, không có `if/else` theo type                          |
| 3   | ⚙️ Application | Implement Observer Pattern (event system) từ đầu trong 10 phút        | Viết được `subscribe`/`unsubscribe`/`notify` với TypeScript type-safe                                       |
| 4   | 🐛 Debug       | Phân biệt Strategy Pattern vs State Pattern qua một ví dụ bug thực tế | Giải thích: Strategy = swap algorithm từ ngoài; State = object tự đổi behavior theo state nội tại           |
| 5   | 🎓 Teach       | Giải thích DIP cho junior developer trong 2 phút bằng analogy         | Dùng được analogy "ổ cắm chuẩn USB-C" và chỉ ra tại sao `new ConcreteService()` trong business logic là bad |

💬 **Feynman Prompt:** Giải thích "Open/Closed Principle" cho junior developer bằng ví dụ thực tế — tại sao thêm tính năng bằng cách "thêm code mới" tốt hơn "sửa code cũ"?

---

## Connections / Liên Kết

- ⬅️ **Built on:** OOP fundamentals (class, interface, inheritance) — SOLID chỉ apply được khi bạn hiểu OOP
- ➡️ **Enables:** [Architecture Styles](./02-architecture-styles.md) — Clean Architecture, Hexagonal đều built on SOLID
- 🔗 **Patterns in practice:** React components (SRP), Redux (Observer), React Context (DIP), Go interfaces (LSP)
