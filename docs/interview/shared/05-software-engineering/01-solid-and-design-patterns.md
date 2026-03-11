# SOLID and Design Patterns — SOLID và Mẫu thiết kế

> Shared theory for both Frontend and Backend tracks.
> Cross-references:
> - `docs/interview/shared/02-system-design/system-design-theory.md`
> - `docs/interview/shared/03-database/database-theory.md`
> - `docs/interview/shared/04-security/01-security-fundamentals.md`
> - `docs/interview/fe-track/08-fe-system-design/01-architecture-patterns.md`
> - `docs/interview/be-track/02-backend-knowledge/02-microservices.md`

---

## 1. Why design principles matter — Vì sao nguyên lý thiết kế quan trọng

### 🟢 Q: Why should interview candidates learn design principles? `[Junior]`

**A:** Trong phỏng vấn, nhà tuyển dụng không chỉ hỏi viết code chạy được, mà muốn biết bạn có thể viết code **dễ thay đổi, dễ test, dễ scale team** hay không. SOLID + design patterns là ngôn ngữ chung để trao đổi trade-off.

### 🟡 Q: Principle-first hay pattern-first? `[Mid]`

**A:** Nên **principle-first**. Pattern là công cụ, principle là tiêu chí chọn công cụ. Nếu thuộc pattern nhưng không hiểu coupling/cohesion thì dễ áp dụng sai.

---

## 2. SOLID Principles — 5 nguyên lý cốt lõi

### 🟢 Q: What is Single Responsibility Principle (SRP)? `[Junior]`

**A:** **S** — Một module/class chỉ nên có **một lý do để thay đổi**.

**Dấu hiệu vi phạm (smell):**
- Class `UserService` vừa validate, vừa gửi email, vừa ghi DB.
- Pull request thường đụng nhiều module không liên quan.
- Unit test khó viết hoặc setup quá nặng.

**Refactor gợi ý:**
- Tách thành `UserValidator`, `UserRepository`, `WelcomeEmailSender`.
- Introduce interface tại boundary để giảm phụ thuộc concrete.
- Viết test contract cho abstraction.

```ts
// TypeScript sketch
class UserValidator {
  validate(email: string): boolean {
    return email.includes('@')
  }
}

class UserRepository {
  save(email: string): void {
    // persist
  }
}
```

**Interview tip:** Trả lời theo cấu trúc `definition → violation example → refactor path → trade-off` sẽ thuyết phục hơn.

### 🟢 Q: What is Open/Closed Principle (OCP)? `[Junior]`

**A:** **O** — Entity nên **mở để mở rộng** nhưng **đóng để sửa đổi**.

**Dấu hiệu vi phạm (smell):**
- Mỗi lần thêm payment method lại sửa `if/else` dài.
- Pull request thường đụng nhiều module không liên quan.
- Unit test khó viết hoặc setup quá nặng.

**Refactor gợi ý:**
- Dùng `PaymentStrategy` + đăng ký implementation mới.
- Introduce interface tại boundary để giảm phụ thuộc concrete.
- Viết test contract cho abstraction.

```ts
// TypeScript sketch
interface DiscountStrategy {
  apply(total: number): number
}

class LoyaltyDiscount implements DiscountStrategy {
  apply(total: number) { return total * 0.9 }
}

class CheckoutService {
  constructor(private strategy: DiscountStrategy) {}
  checkout(total: number) { return this.strategy.apply(total) }
}
```

**Interview tip:** Trả lời theo cấu trúc `definition → violation example → refactor path → trade-off` sẽ thuyết phục hơn.

### 🟡 Q: What is Liskov Substitution Principle (LSP)? `[Mid]`

**A:** **L** — Subtype phải thay thế được cho base type mà không phá behavior.

**Dấu hiệu vi phạm (smell):**
- `Square extends Rectangle` nhưng override setWidth/setHeight gây sai diện tích.
- Pull request thường đụng nhiều module không liên quan.
- Unit test khó viết hoặc setup quá nặng.

**Refactor gợi ý:**
- Tách abstraction phù hợp: `Shape` với `area()`.
- Introduce interface tại boundary để giảm phụ thuộc concrete.
- Viết test contract cho abstraction.

```ts
// TypeScript sketch
interface Bird {
  move(): string
}

class Sparrow implements Bird {
  move() { return 'fly' }
}

class Penguin implements Bird {
  move() { return 'swim' }
}
```

**Interview tip:** Trả lời theo cấu trúc `definition → violation example → refactor path → trade-off` sẽ thuyết phục hơn.

### 🟡 Q: What is Interface Segregation Principle (ISP)? `[Mid]`

**A:** **I** — Không ép client phụ thuộc method mà nó không dùng.

**Dấu hiệu vi phạm (smell):**
- Interface `Worker` có `code()`, `eat()`, `sleep()` cho cả robot.
- Pull request thường đụng nhiều module không liên quan.
- Unit test khó viết hoặc setup quá nặng.

**Refactor gợi ý:**
- Tách `CodeWorker`, `BiologicalNeeds` nhỏ hơn.
- Introduce interface tại boundary để giảm phụ thuộc concrete.
- Viết test contract cho abstraction.

```ts
// TypeScript sketch
interface ReadableRepo<T> {
  findById(id: string): Promise<T | null>
}
interface WritableRepo<T> {
  save(entity: T): Promise<void>
}
class QueryService<T> {
  constructor(private repo: ReadableRepo<T>) {}
}
```

**Interview tip:** Trả lời theo cấu trúc `definition → violation example → refactor path → trade-off` sẽ thuyết phục hơn.

### 🟡 Q: What is Dependency Inversion Principle (DIP)? `[Mid]`

**A:** **D** — High-level policy không phụ thuộc low-level details; cả hai phụ thuộc abstraction.

**Dấu hiệu vi phạm (smell):**
- `ReportService` new trực tiếp `MySQLClient`.
- Pull request thường đụng nhiều module không liên quan.
- Unit test khó viết hoặc setup quá nặng.

**Refactor gợi ý:**
- Inject `ReportRepository` interface vào service.
- Introduce interface tại boundary để giảm phụ thuộc concrete.
- Viết test contract cho abstraction.

```ts
// TypeScript sketch
interface PaymentGateway {
  charge(amount: number): Promise<string>
}

class StripeGateway implements PaymentGateway {
  async charge(amount: number) { return `stripe-${amount}` }
}

class BillingService {
  constructor(private gateway: PaymentGateway) {}
  async pay(amount: number) { return this.gateway.charge(amount) }
}
```

**Interview tip:** Trả lời theo cấu trúc `definition → violation example → refactor path → trade-off` sẽ thuyết phục hơn.

---

## 3. DRY, KISS, YAGNI — Bộ nguyên tắc thực dụng

### 🟢 Q: What is DRY (Don't Repeat Yourself)? `[Junior]`

**A:**
- Mục tiêu là tối ưu **chi phí thay đổi** về lâu dài.
- Tránh hai cực đoan: copy-paste vô tội vạ và abstraction quá sớm.
- Luôn cân bằng readability, velocity, và maintainability.

| Situation | Áp dụng đúng | Áp dụng sai |
|---|---|---|
| Feature nhỏ 1 sprint | Code thẳng, rõ | Dựng framework nặng |
| Rule lặp ở 4 nơi | Trích xuất module | Chấp nhận trùng lâu dài |
| Chưa có yêu cầu mở rộng | Giữ seam tối thiểu | Xây plugin system từ đầu |

### 🟢 Q: What is KISS (Keep It Simple, Stupid)? `[Junior]`

**A:**
- Mục tiêu là tối ưu **chi phí thay đổi** về lâu dài.
- Tránh hai cực đoan: copy-paste vô tội vạ và abstraction quá sớm.
- Luôn cân bằng readability, velocity, và maintainability.

| Situation | Áp dụng đúng | Áp dụng sai |
|---|---|---|
| Feature nhỏ 1 sprint | Code thẳng, rõ | Dựng framework nặng |
| Rule lặp ở 4 nơi | Trích xuất module | Chấp nhận trùng lâu dài |
| Chưa có yêu cầu mở rộng | Giữ seam tối thiểu | Xây plugin system từ đầu |

### 🟡 Q: What is YAGNI (You Aren't Gonna Need It)? `[Mid]`

**A:**
- Mục tiêu là tối ưu **chi phí thay đổi** về lâu dài.
- Tránh hai cực đoan: copy-paste vô tội vạ và abstraction quá sớm.
- Luôn cân bằng readability, velocity, và maintainability.

| Situation | Áp dụng đúng | Áp dụng sai |
|---|---|---|
| Feature nhỏ 1 sprint | Code thẳng, rõ | Dựng framework nặng |
| Rule lặp ở 4 nơi | Trích xuất module | Chấp nhận trùng lâu dài |
| Chưa có yêu cầu mở rộng | Giữ seam tối thiểu | Xây plugin system từ đầu |

---

## 4. GoF Design Patterns — Mẫu thiết kế theo nhóm

### 🟡 Q: What is the **Singleton** pattern? `[Mid]`

**Category:** Creational

**Intent:** Đảm bảo chỉ có một instance duy nhất và cung cấp global access point.

**Structure (simplified):**
```text
Client
  ↓
Singleton Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Khi cần shared config, logger, connection pool metadata.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- Use private constructor + static getInstance().
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Lạm dụng global state, test khó.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Singleton - minimal TypeScript sketch
class AppConfig {
  private static instance: AppConfig
  private constructor(public readonly env = 'prod') {}
  static getInstance() {
    if (!this.instance) this.instance = new AppConfig()
    return this.instance
  }
}
```

### 🟡 Q: What is the **Factory Method** pattern? `[Mid]`

**Category:** Creational

**Intent:** Định nghĩa interface tạo object, để subclass quyết định class cụ thể.

**Structure (simplified):**
```text
Client
  ↓
Factory Method Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Khi logic tạo object phụ thuộc runtime condition.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- Tạo NotificationFactory theo channel email/sms/push.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Nhiều class nhỏ nếu over-engineer.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Factory Method - minimal TypeScript sketch
interface Transport { deliver(): string }
class Truck implements Transport { deliver() { return 'land' } }
class Ship implements Transport { deliver() { return 'sea' } }
const createTransport = (kind: 'truck'|'ship'): Transport =>
  kind === 'truck' ? new Truck() : new Ship()
```

### 🟡 Q: What is the **Abstract Factory** pattern? `[Mid]`

**Category:** Creational

**Intent:** Tạo họ object liên quan mà không chỉ định class cụ thể.

**Structure (simplified):**
```text
Client
  ↓
Abstract Factory Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Khi cần đảm bảo tính tương thích giữa các product.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- UI factory LightTheme vs DarkTheme cho Button/Input.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Khó mở rộng nếu thêm product type mới.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Abstract Factory - minimal TypeScript sketch
interface Transport { deliver(): string }
class Truck implements Transport { deliver() { return 'land' } }
class Ship implements Transport { deliver() { return 'sea' } }
const createTransport = (kind: 'truck'|'ship'): Transport =>
  kind === 'truck' ? new Truck() : new Ship()
```

### 🟡 Q: What is the **Builder** pattern? `[Mid]`

**Category:** Creational

**Intent:** Tách quá trình xây dựng object phức tạp khỏi representation.

**Structure (simplified):**
```text
Client
  ↓
Builder Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Khi object có nhiều optional fields hoặc validation nhiều bước.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- RequestBuilder tạo HTTP request immutable.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Boilerplate nếu object đơn giản.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Builder - minimal TypeScript sketch
class QueryBuilder {
  private clauses: string[] = []
  select(fields: string) { this.clauses.push(`SELECT ${fields}`); return this }
  from(table: string) { this.clauses.push(`FROM ${table}`); return this }
  where(cond: string) { this.clauses.push(`WHERE ${cond}`); return this }
  build() { return this.clauses.join(' ') }
}
```

### 🟡 Q: What is the **Prototype** pattern? `[Mid]`

**Category:** Creational

**Intent:** Tạo object mới bằng cách clone prototype object.

**Structure (simplified):**
```text
Client
  ↓
Prototype Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Khi cost khởi tạo object cao hoặc cần copy template.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- Clone cấu hình dashboard mặc định cho user mới.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Clone sâu/nông dễ lỗi.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Prototype - minimal TypeScript sketch
type Dashboard = { widgets: string[]; theme: string }
const prototype: Dashboard = { widgets: ['chart'], theme: 'light' }
const clone = structuredClone(prototype)
clone.theme = 'dark'
```

### 🟡 Q: What is the **Adapter** pattern? `[Mid]`

**Category:** Structural

**Intent:** Chuyển đổi interface class này sang interface client mong muốn.

**Structure (simplified):**
```text
Client
  ↓
Adapter Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Tích hợp thư viện legacy hoặc third-party API khác format.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- Bọc payment gateway cũ vào PaymentProvider chung.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Adapter chồng adapter gây rối.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Adapter - minimal TypeScript sketch
interface PaymentProvider { pay(amount: number): Promise<void> }
class LegacyGateway { async makePayment(cents: number) {} }
class GatewayAdapter implements PaymentProvider {
  constructor(private legacy: LegacyGateway) {}
  async pay(amount: number) { await this.legacy.makePayment(amount * 100) }
}
```

### 🟡 Q: What is the **Bridge** pattern? `[Mid]`

**Category:** Structural

**Intent:** Tách abstraction và implementation để phát triển độc lập.

**Structure (simplified):**
```text
Client
  ↓
Bridge Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Khi có 2 chiều biến đổi (vd: hình dạng × renderer).
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- Notification (abstraction) + Channel (implementation).
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Thiết kế quá sớm gây dư abstraction.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Bridge - minimal TypeScript sketch
interface Channel { send(msg: string): void }
class EmailChannel implements Channel { send(msg: string) {} }
class Notification { constructor(private channel: Channel) {}
  notify(msg: string) { this.channel.send(msg) }
}
```

### 🟡 Q: What is the **Composite** pattern? `[Mid]`

**Category:** Structural

**Intent:** Biểu diễn cấu trúc cây part-whole, xử lý leaf và composite thống nhất.

**Structure (simplified):**
```text
Client
  ↓
Composite Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Menu UI, file system tree, org chart.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- Folder chứa file/folder con với API chung getSize().
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Khó enforce ràng buộc với leaf/composite khác hành vi.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Composite - minimal TypeScript sketch
interface Node { size(): number }
class FileNode implements Node { constructor(private s:number){} size(){return this.s} }
class FolderNode implements Node {
  constructor(private children: Node[]) {}
  size() { return this.children.reduce((a,c)=>a+c.size(),0) }
}
```

### 🟡 Q: What is the **Decorator** pattern? `[Mid]`

**Category:** Structural

**Intent:** Gắn thêm behavior vào object tại runtime mà không sửa class gốc.

**Structure (simplified):**
```text
Client
  ↓
Decorator Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Thêm logging, caching, metrics theo lớp.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- HTTP client wrapped bởi RetryDecorator + MetricsDecorator.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Nhiều lớp decorator khó debug thứ tự.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Decorator - minimal TypeScript sketch
interface ApiClient { get(path: string): Promise<string> }
class BaseClient implements ApiClient { async get(path: string){ return path } }
class LoggingClient implements ApiClient {
  constructor(private inner: ApiClient) {}
  async get(path: string){ console.log(path); return this.inner.get(path) }
}
```

### 🟡 Q: What is the **Facade** pattern? `[Mid]`

**Category:** Structural

**Intent:** Cung cấp interface đơn giản cho subsystem phức tạp.

**Structure (simplified):**
```text
Client
  ↓
Facade Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Ẩn complexity module lớn, tạo API easy-to-use.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- CheckoutFacade gọi inventory/payment/shipping.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Facade phình to thành God Facade.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Facade - minimal TypeScript sketch
class CheckoutFacade {
  async placeOrder() {
    // reserve inventory -> charge payment -> create shipment
  }
}
```

### 🟡 Q: What is the **Flyweight** pattern? `[Mid]`

**Category:** Structural

**Intent:** Chia sẻ state chung để giảm memory footprint.

**Structure (simplified):**
```text
Client
  ↓
Flyweight Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Khi có nhiều object nhỏ giống nhau (characters, map tiles).
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- Text editor chia sẻ glyph objects.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Phân biệt intrinsic/extrinsic state khó.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Flyweight - minimal TypeScript sketch
class GlyphFactory {
  private cache = new Map<string, object>()
  get(char: string) {
    if (!this.cache.has(char)) this.cache.set(char, { char })
    return this.cache.get(char)!
  }
}
```

### 🟡 Q: What is the **Proxy** pattern? `[Mid]`

**Category:** Structural

**Intent:** Đại diện object khác để kiểm soát truy cập.

**Structure (simplified):**
```text
Client
  ↓
Proxy Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Lazy loading, access control, remote service wrapper.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- ImageProxy chỉ load ảnh khi cần render.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Ẩn latency network nếu dùng remote proxy.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Proxy - minimal TypeScript sketch
interface Image { render(): void }
class RealImage implements Image { render() {} }
class ImageProxy implements Image {
  private real?: RealImage
  render(){ this.real ??= new RealImage(); this.real.render() }
}
```

### 🔴 Q: What is the **Observer** pattern? `[Senior]`

**Category:** Behavioral

**Intent:** Thiết lập one-to-many dependency để tự động notify khi state đổi.

**Structure (simplified):**
```text
Client
  ↓
Observer Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Event system, pub/sub UI state updates.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- Order service publish OrderCreated event.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Memory leak nếu không unsubscribe.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Observer - minimal TypeScript sketch
type Listener = (event: string) => void
class EventBus {
  private listeners: Listener[] = []
  subscribe(l: Listener){ this.listeners.push(l) }
  publish(e: string){ this.listeners.forEach(l => l(e)) }
}
```

### 🔴 Q: What is the **Strategy** pattern? `[Senior]`

**Category:** Behavioral

**Intent:** Đóng gói các thuật toán, cho phép thay thế linh hoạt.

**Structure (simplified):**
```text
Client
  ↓
Strategy Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Nhiều business rules có thể swap runtime.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- PricingStrategy cho normal/member/vip.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Quá nhiều strategy class nhỏ.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Strategy - minimal TypeScript sketch
interface SortStrategy { sort(input: number[]): number[] }
class QuickSort implements SortStrategy { sort(i:number[]){ return [...i].sort((a,b)=>a-b) } }
class Sorter { constructor(private s: SortStrategy) {} run(i:number[]){ return this.s.sort(i) } }
```

### 🔴 Q: What is the **Command** pattern? `[Senior]`

**Category:** Behavioral

**Intent:** Đóng gói request thành object để queue/log/undo.

**Structure (simplified):**
```text
Client
  ↓
Command Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Queue jobs, retry, audit commands.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- CreateInvoiceCommand đưa vào async worker.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Command object quá nhỏ gây overhead.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Command - minimal TypeScript sketch
interface Command { execute(): Promise<void> }
class EmailCommand implements Command { async execute() {} }
class Queue { async run(c: Command){ await c.execute() } }
```

### 🔴 Q: What is the **State** pattern? `[Senior]`

**Category:** Behavioral

**Intent:** Cho phép object đổi hành vi khi state nội bộ thay đổi.

**Structure (simplified):**
```text
Client
  ↓
State Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Workflow nhiều trạng thái với transition rõ.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- Order state: Pending→Paid→Shipped→Completed.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Số state tăng nhanh khó quản lý.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// State - minimal TypeScript sketch
interface OrderState { next(): OrderState; label(): string }
class Pending implements OrderState {
  next(){ return new Paid() }
  label(){ return 'PENDING' }
}
class Paid implements OrderState { next(){ return this } label(){ return 'PAID' } }
```

### 🔴 Q: What is the **Template Method** pattern? `[Senior]`

**Category:** Behavioral

**Intent:** Định nghĩa skeleton của thuật toán, subclass override từng bước.

**Structure (simplified):**
```text
Client
  ↓
Template Method Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Quy trình chuẩn có vài biến thể.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- Import pipeline chuẩn hóa parse-validate-save.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Inheritance sâu gây cứng.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Template Method - minimal TypeScript sketch
abstract class ImportJob {
  run(){ this.parse(); this.validate(); this.save() }
  protected abstract parse(): void
  protected abstract validate(): void
  protected abstract save(): void
}
```

### 🔴 Q: What is the **Iterator** pattern? `[Senior]`

**Category:** Behavioral

**Intent:** Cung cấp cách duyệt collection mà không lộ cấu trúc bên trong.

**Structure (simplified):**
```text
Client
  ↓
Iterator Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Expose traversal nhất quán cho nhiều data structure.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- Paginated iterator cho API list endpoints.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Iterator invalidation khi collection đổi.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Iterator - minimal TypeScript sketch
function* pageIterator<T>(pages: T[][]){
  for (const p of pages) for (const item of p) yield item
}
```

### 🔴 Q: What is the **Chain of Responsibility** pattern? `[Senior]`

**Category:** Behavioral

**Intent:** Chuyển request qua chuỗi handler đến khi được xử lý.

**Structure (simplified):**
```text
Client
  ↓
Chain of Responsibility Abstraction
  ↓
Concrete Components / Collaborators
```

**When to use:**
- Middleware pipeline, validation chain.
- Khi cần giảm `if/else` hoặc `switch` tăng trưởng theo thời gian.
- Khi muốn kiểm soát coupling tại boundary.

**Real-world example:**
- HTTP middleware auth→rateLimit→handler.
- Mapping sang production thường đi cùng logging, metrics, retry policy.

**Interview relevance:**
- Thể hiện khả năng nhìn vấn đề ở mức design, không chỉ syntax.
- Giúp trình bày trade-off về complexity vs flexibility.
- Dễ liên hệ với framework features (React hooks, Spring beans, Go interfaces).

**Common pitfall:**
- Khó debug handler nào xử lý cuối.
- Nếu team không hiểu pattern, code sẽ khó đọc hơn bản đơn giản.

```ts
// Chain of Responsibility - minimal TypeScript sketch
type Next = () => Promise<void>
type Middleware = (next: Next) => Promise<void>
const chain = (mws: Middleware[], final: Next): Next =>
  mws.reduceRight((next, mw) => () => mw(next), final)
```

---

## 5. Anti-patterns to avoid — Mẫu xấu cần tránh

### 🔴 Q: Why is **God Object** dangerous? `[Senior]`

**A:** Một object chứa quá nhiều logic/domain state.

**Hậu quả:**
- Cycle time tăng vì mỗi thay đổi đụng nhiều file.
- Onboarding khó vì không có ranh giới module rõ ràng.
- Incident recovery chậm do blast radius lớn.

**Cách xử lý:**
- Tách theo bounded context, service, module rõ trách nhiệm.
- Bổ sung architecture decision record (ADR) để giữ quyết định nhất quán.
- Đặt quality gate: max file size, max function length, dependency rule.

### 🔴 Q: Why is **Spaghetti Code** dangerous? `[Senior]`

**A:** Luồng điều khiển rối, phụ thuộc chéo, khó test.

**Hậu quả:**
- Cycle time tăng vì mỗi thay đổi đụng nhiều file.
- Onboarding khó vì không có ranh giới module rõ ràng.
- Incident recovery chậm do blast radius lớn.

**Cách xử lý:**
- Chuẩn hóa architecture layer + linting + code review checklist.
- Bổ sung architecture decision record (ADR) để giữ quyết định nhất quán.
- Đặt quality gate: max file size, max function length, dependency rule.

### 🔴 Q: Why is **Golden Hammer** dangerous? `[Senior]`

**A:** Dùng một tool/pattern cho mọi bài toán.

**Hậu quả:**
- Cycle time tăng vì mỗi thay đổi đụng nhiều file.
- Onboarding khó vì không có ranh giới module rõ ràng.
- Incident recovery chậm do blast radius lớn.

**Cách xử lý:**
- Đánh giá ràng buộc domain trước khi chọn giải pháp.
- Bổ sung architecture decision record (ADR) để giữ quyết định nhất quán.
- Đặt quality gate: max file size, max function length, dependency rule.

---

## 6. Interview Q&A Bank — Bộ câu hỏi phỏng vấn

### 🟢 Q: What does one reason to change mean in SRP? `[Junior]`

**A:** Nó nghĩa là một class nên gắn với **một actor nghiệp vụ**. Nếu có nhiều actor (QA, kế toán, vận hành) đều có thể yêu cầu sửa class, class đó đang vi phạm SRP.

**Follow-up gợi ý:**
- Nêu một ví dụ thực tế bạn từng refactor.
- Trình bày trade-off trước/sau refactor bằng metric (defect rate, lead time).

### 🟢 Q: DRY có nghĩa là không bao giờ lặp code? `[Junior]`

**A:** Không tuyệt đối. DRY là tránh lặp **knowledge/business rule**. Lặp nhỏ chấp nhận được nếu giúp code rõ hơn và tránh abstraction sớm.

**Follow-up gợi ý:**
- Nêu một ví dụ thực tế bạn từng refactor.
- Trình bày trade-off trước/sau refactor bằng metric (defect rate, lead time).

### 🟡 Q: Khi nào nên ưu tiên KISS hơn pattern? `[Mid]`

**A:** Khi bài toán nhỏ, domain ổn định, đội chưa cần mở rộng. Pattern chỉ dùng khi có pressure thực tế (thêm biến thể, cần testability, cần giảm coupling).

**Follow-up gợi ý:**
- Nêu một ví dụ thực tế bạn từng refactor.
- Trình bày trade-off trước/sau refactor bằng metric (defect rate, lead time).

### 🟡 Q: Làm sao nhận biết LSP bị vi phạm trong review? `[Mid]`

**A:** Dấu hiệu: subtype throw `UnsupportedOperation`, phải thêm `instanceof` để né subtype, hoặc post-condition của subtype yếu hơn base contract.

**Follow-up gợi ý:**
- Nêu một ví dụ thực tế bạn từng refactor.
- Trình bày trade-off trước/sau refactor bằng metric (defect rate, lead time).

### 🟡 Q: Decorator khác kế thừa như thế nào? `[Mid]`

**A:** Decorator thêm behavior tại runtime bằng composition; inheritance thêm behavior tại compile time và dễ bị class explosion.

**Follow-up gợi ý:**
- Nêu một ví dụ thực tế bạn từng refactor.
- Trình bày trade-off trước/sau refactor bằng metric (defect rate, lead time).

### 🟡 Q: Factory Method vs Abstract Factory khác nhau gì? `[Mid]`

**A:** Factory Method tạo một product qua method override; Abstract Factory tạo **họ product liên quan** qua nhiều method thống nhất.

**Follow-up gợi ý:**
- Nêu một ví dụ thực tế bạn từng refactor.
- Trình bày trade-off trước/sau refactor bằng metric (defect rate, lead time).

### 🔴 Q: Làm sao tránh over-engineering khi áp dụng GoF patterns? `[Senior]`

**A:** Áp dụng theo nguyên tắc evidence-based design: bắt đầu đơn giản, đo pain point, chỉ thêm pattern khi có biến thể lặp lại hoặc requirement thay đổi rõ.

**Follow-up gợi ý:**
- Nêu một ví dụ thực tế bạn từng refactor.
- Trình bày trade-off trước/sau refactor bằng metric (defect rate, lead time).

### 🔴 Q: DIP hỗ trợ testability như thế nào? `[Senior]`

**A:** Nhờ phụ thuộc abstraction, ta inject fake/stub repository hoặc gateway trong unit test mà không cần DB/network thật.

**Follow-up gợi ý:**
- Nêu một ví dụ thực tế bạn từng refactor.
- Trình bày trade-off trước/sau refactor bằng metric (defect rate, lead time).

### 🔴 Q: Golden Hammer gây hậu quả gì ở scale lớn? `[Senior]`

**A:** Đội ngũ dùng một kỹ thuật cho mọi vấn đề làm tăng coupling, giảm hiệu năng, và bỏ lỡ giải pháp domain-specific tốt hơn.

**Follow-up gợi ý:**
- Nêu một ví dụ thực tế bạn từng refactor.
- Trình bày trade-off trước/sau refactor bằng metric (defect rate, lead time).

### 🔴 Q: Observer trong distributed systems có gì cần lưu ý? `[Senior]`

**A:** Cần cân nhắc delivery semantics (at-least-once), idempotency, ordering, dead-letter queue và versioning event schema.

**Follow-up gợi ý:**
- Nêu một ví dụ thực tế bạn từng refactor.
- Trình bày trade-off trước/sau refactor bằng metric (defect rate, lead time).

### 🟡 Q: YAGNI mâu thuẫn với thiết kế mở rộng không? `[Mid]`

**A:** Không. YAGNI ngăn xây thứ chưa cần, còn thiết kế mở rộng chỉ tạo seam tối thiểu để thay đổi sau này với chi phí thấp.

**Follow-up gợi ý:**
- Nêu một ví dụ thực tế bạn từng refactor.
- Trình bày trade-off trước/sau refactor bằng metric (defect rate, lead time).

### 🟢 Q: Anti-pattern God Object là gì? `[Junior]`

**A:** Một class biết và làm quá nhiều thứ, trở thành điểm nghẽn thay đổi. Nên tách theo bounded responsibility.

**Follow-up gợi ý:**
- Nêu một ví dụ thực tế bạn từng refactor.
- Trình bày trade-off trước/sau refactor bằng metric (defect rate, lead time).

---

## 7. Quick revision checklist — Checklist ôn tập nhanh

- [ ] Bạn có thể giải thích cả 5 nguyên lý SOLID bằng ví dụ code ngắn.
- [ ] Bạn phân biệt được Factory Method vs Abstract Factory vs Builder.
- [ ] Bạn biết lúc nào nên dùng Strategy thay vì if/else dài.
- [ ] Bạn nhận diện được anti-pattern trong code review.
- [ ] Bạn liên hệ pattern với hệ thống thực tế (payment, notification, workflow).
- [ ] Bạn có thể trình bày một case refactor theo STAR (Situation-Task-Action-Result).
