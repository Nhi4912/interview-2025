# Code Quality and Review — Chất lượng code và Review code

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)
> - `docs/shared/05-software-engineering/01-solid-and-design-patterns.md`
> - `docs/shared/05-software-engineering/03-sdlc-and-practices.md`
> - `docs/shared/05-software-engineering/04-testing-theory.md`

---

## 0. Learning Goals — Mục tiêu học tập

Sau khi hoàn thành phần này, bạn sẽ:

1. **Hiểu** code quality là gì, phân biệt internal vs external quality, và tại sao nó quan trọng cho team.
2. **Nhận diện** các code smell phổ biến theo 5 nhóm (Bloaters, OO Abusers, Change Preventers, Dispensables, Couplers).
3. **Áp dụng** được danh mục refactoring cơ bản: Extract Method, Extract Class, Replace Conditional with Polymorphism, v.v.
4. **Đo lường** code quality qua Cyclomatic Complexity, Cognitive Complexity, Coupling/Cohesion, Maintainability Index.
5. **Thiết lập** static analysis, linting, và formatting trong CI/CD pipeline.
6. **Thực hành** code review hiệu quả: biết cho feedback xây dựng, nhận feedback chuyên nghiệp, giữ PR nhỏ.
7. **Quản lý** technical debt có hệ thống: debt quadrant, debt register, phân bổ capacity.
8. **Viết** documentation hiệu quả: self-documenting code, ADRs, API docs, runbooks.
9. **Nắm vững** Clean Code principles: meaningful names, small functions, DRY/KISS/YAGNI, Boy Scout Rule.
10. **Xây dựng** quality culture trong team thay vì quality police.

---

## 1. What is Code Quality — Chất lượng code là gì

### 🟢 Q: What is code quality? `[Junior]`

**A:** Code quality là tập hợp các thuộc tính giúp code dễ đọc, dễ bảo trì, đáng tin cậy và hiệu quả. Không chỉ là "chạy đúng" — code chất lượng cao là code mà **cả team có thể hiểu, sửa đổi và mở rộng an toàn**.

**4 trụ cột chính:**

| Thuộc tính | Mô tả | Ví dụ vi phạm |
|------------|--------|----------------|
| **Readability** | Người khác đọc hiểu nhanh | Biến tên `x`, `tmp`, hàm 200 dòng |
| **Maintainability** | Dễ sửa đổi, thêm feature | Sửa 1 chỗ phải đổi 10 file |
| **Reliability** | Chạy đúng, ít bug | Không handle edge case, null pointer |
| **Efficiency** | Dùng tài nguyên hợp lý | O(n³) khi có thể O(n log n) |

### 🟡 Q: What is the difference between internal and external quality? `[Mid]`

**A:** Đây là phân biệt quan trọng mà nhiều developer bỏ qua:

**External quality** — Chất lượng mà user/stakeholder thấy được:
- Ít bug, performance tốt, UI mượt, feature đầy đủ.
- Đo bằng: bug count, response time, user satisfaction, uptime.

**Internal quality** — Chất lượng mà chỉ developer thấy:
- Code readable, modular, test coverage tốt, dependency rõ ràng.
- Đo bằng: cyclomatic complexity, coupling, test coverage, code smells.

**Mối quan hệ:**
```text
Internal Quality cao → Dễ thay đổi → Deliver feature nhanh hơn → External Quality tốt
Internal Quality thấp → Khó thay đổi → Chậm, nhiều bug → External Quality xấu dần
```

**Trade-off:** Short-term, bạn có thể ship nhanh bằng cách hy sinh internal quality. Long-term, internal quality thấp làm chậm mọi thay đổi — đây chính là bản chất của technical debt.

### 🟡 Q: Why does code quality matter for teams? `[Mid]`

**A:** Code quality không phải thẩm mỹ cá nhân — nó ảnh hưởng trực tiếp đến hiệu suất team:

**1. Onboarding speed:**
- Code rõ ràng: dev mới productive trong 1-2 tuần.
- Code rối: 1-2 tháng vẫn chưa dám sửa gì.

**2. Debugging efficiency:**
- Code tốt: đọc stack trace → biết lỗi ở đâu → sửa trong 30 phút.
- Code tệ: grep khắp nơi → không hiểu flow → sửa 1 bug tạo 2 bug mới.

**3. Delivery velocity:**
- Tuần 1-4: team viết code bẩn ship nhanh hơn.
- Tháng 3+: team viết code sạch vượt xa vì cost-of-change thấp.

**4. Team morale:**
- Developer giỏi muốn làm việc với codebase tốt. Code xấu → developer giỏi rời đi → code xấu hơn → vòng lặp tiêu cực.

```text
Quality Investment Over Time:

Productivity
  ^
  |        /--- Clean code
  |       /
  |      /
  |     / ---- Messy code (starts faster)
  |    /  \
  |   /    \
  |  /      \______ (slowing down)
  | /
  +-----------------------> Time
```

### 🔴 Q: How do you build a business case for investing in code quality? `[Senior]`

**A:** Đây là kỹ năng quan trọng cho Senior/Lead — thuyết phục stakeholder non-technical:

**Framework RICE cho quality investment:**
1. **Reach**: Bao nhiêu developer bị ảnh hưởng? Bao nhiêu feature bị chậm?
2. **Impact**: Giảm bao nhiêu % thời gian debug? Tăng bao nhiêu % delivery speed?
3. **Confidence**: Có metric chứng minh không? (cycle time, bug rate, deployment frequency)
4. **Effort**: Cần bao nhiêu sprint để cải thiện?

**Metric-driven approach:**
- Track **cycle time** (commit → production): nếu tăng dần → quality problem.
- Track **bug escape rate**: bugs found in production / total bugs.
- Track **change failure rate**: % deployments gây incident.
- So sánh trước/sau khi đầu tư vào quality.

**Interview tip:** Nếu được hỏi "how do you prioritize refactoring vs features?", trả lời bằng data và business impact, không phải "vì code xấu".

---

## 2. Code Smells — Mùi code

### 🟢 Q: What are code smells? `[Junior]`

**A:** Code smell là dấu hiệu trong source code gợi ý **có thể** có vấn đề sâu hơn về design. Smell không phải bug — code vẫn chạy đúng — nhưng nó báo hiệu code khó bảo trì, khó mở rộng.

Thuật ngữ do Kent Beck đặt, Martin Fowler phổ biến trong cuốn "Refactoring" (1999).

**Quan trọng:** Smell ≠ chắc chắn sai. Cần judgment để quyết định có refactor hay không.

### 🟡 Q: What are Bloater smells? `[Mid]`

**A:** Bloaters là code smell liên quan đến **kích thước quá lớn** — code phình to đến mức khó hiểu và khó làm việc.

**2.1 Long Method / Long Function:**
- **What:** Hàm quá dài (thường >20-30 dòng logic).
- **Detect:** Cần scroll để đọc hết; có comment chia section trong hàm; nhiều indent level.
- **Refactor:** Extract Method — tách thành các hàm nhỏ với tên mô tả rõ ý đồ.

**2.2 Large Class / God Class:**
- **What:** Class có quá nhiều responsibility, quá nhiều field/method.
- **Detect:** File >500 dòng; class name generic (`Manager`, `Handler`, `Processor`); nhiều import không liên quan.
- **Refactor:** Extract Class — tách thành nhiều class nhỏ theo SRP.

**2.3 Primitive Obsession:**
- **What:** Dùng primitive types (string, int) thay vì tạo domain type.
- **Detect:** `string email`, `string phone`, `int currency` — không có validation tại type level.
- **Refactor:** Introduce Value Object — tạo `Email`, `PhoneNumber`, `Money` type.

**2.4 Long Parameter List:**
- **What:** Hàm nhận quá nhiều tham số (>3-4).
- **Detect:** Khó nhớ thứ tự tham số; caller truyền `null` cho param không cần.
- **Refactor:** Introduce Parameter Object hoặc Builder Pattern.

**2.5 Data Clumps:**
- **What:** Nhóm data luôn xuất hiện cùng nhau nhưng không được gom thành object.
- **Detect:** Nhiều hàm cùng nhận `(street, city, zipCode, country)`.
- **Refactor:** Extract Class — tạo `Address` object.

### 🟡 Q: What are Object-Orientation Abuser smells? `[Mid]`

**A:** Nhóm smell do áp dụng OOP không đúng cách:

**2.6 Switch Statements (Repeated conditionals):**
- **What:** `switch/case` hoặc `if/else` chain lặp lại ở nhiều nơi theo cùng condition.
- **Detect:** Thêm một case mới → phải sửa nhiều switch ở nhiều file.
- **Refactor:** Replace Conditional with Polymorphism — tạo class hierarchy hoặc strategy map.

**2.7 Refused Bequest:**
- **What:** Subclass kế thừa nhưng không dùng hoặc override hầu hết method của parent.
- **Detect:** Subclass throw `NotImplementedException` trong inherited method.
- **Refactor:** Replace Inheritance with Delegation hoặc tách interface nhỏ hơn.

**2.8 Alternative Classes with Different Interfaces:**
- **What:** Hai class làm cùng việc nhưng có interface khác nhau.
- **Detect:** Khi dùng thay thế nhau phải viết adapter code.
- **Refactor:** Rename Methods để thống nhất, hoặc Extract Superclass/Interface.

### 🟡 Q: What are Change Preventer smells? `[Mid]`

**A:** Nhóm smell khiến việc thay đổi code trở nên khó khăn bất thường:

**2.9 Divergent Change:**
- **What:** Một class phải thay đổi vì nhiều lý do khác nhau.
- **Detect:** "Mỗi lần thêm payment method, sửa file này. Mỗi lần đổi DB schema, cũng sửa file này."
- **Refactor:** Extract Class — tách thành nhiều class, mỗi class thay đổi vì 1 lý do (SRP).

**2.10 Shotgun Surgery:**
- **What:** Một thay đổi logic phải sửa ở rất nhiều class/file khác nhau.
- **Detect:** PR cho 1 feature nhỏ nhưng đụng 15+ file.
- **Refactor:** Move Method/Field — gom logic liên quan vào cùng module.

**2.11 Parallel Inheritance Hierarchies:**
- **What:** Mỗi khi tạo subclass ở hierarchy A, phải tạo subclass tương ứng ở hierarchy B.
- **Detect:** Class names có prefix giống nhau ở 2 hierarchy (`OrderProcessor` + `OrderValidator`, `PaymentProcessor` + `PaymentValidator`).
- **Refactor:** Move Method — merge hierarchy hoặc dùng composition.

### 🟡 Q: What are Dispensable smells? `[Mid]`

**A:** Nhóm smell là những thứ **không cần thiết** — bỏ đi code sẽ sạch và dễ hiểu hơn:

**2.12 Comments (as smell):**
- **What:** Comment giải thích "what" thay vì "why" — thường nghĩa là code không đủ rõ ràng.
- **Detect:** Comment mô tả lại chính xác dòng code bên dưới; comment outdated (nói khác code).
- **Refactor:** Rename variables/methods cho rõ ý đồ; Extract Method với tên mô tả. Giữ comment cho "why" và business context.

**2.13 Duplicate Code:**
- **What:** Logic giống nhau xuất hiện ở nhiều nơi.
- **Detect:** Copy-paste code; sửa bug ở 1 chỗ nhưng quên chỗ khác.
- **Refactor:** Extract Method/Function cho code chung; Template Method pattern cho class hierarchy.

**2.14 Lazy Class:**
- **What:** Class quá nhỏ, không đủ justify sự tồn tại.
- **Detect:** Class chỉ có 1-2 method đơn giản; chỉ delegate sang class khác.
- **Refactor:** Inline Class — merge vào class sử dụng nó.

**2.15 Speculative Generality:**
- **What:** Code được thiết kế cho use case tương lai nhưng chưa cần.
- **Detect:** Abstract class chỉ có 1 subclass; parameter không ai dùng; "future-proof" interface phức tạp.
- **Refactor:** Collapse Hierarchy; Remove Parameter; Inline Class. Áp dụng YAGNI.

**2.16 Dead Code:**
- **What:** Code không bao giờ được execute.
- **Detect:** Unreachable branches; unused variables, imports, functions; commented-out code.
- **Refactor:** Delete nó. Version control giữ history nếu cần lại.

### 🔴 Q: What are Coupler smells? `[Senior]`

**A:** Nhóm smell liên quan đến **coupling quá chặt** giữa các class:

**2.17 Feature Envy:**
- **What:** Method dùng data/method của class khác nhiều hơn class của chính nó.
- **Detect:** Method gọi getter của object khác 5-6 lần liên tục.
- **Refactor:** Move Method — chuyển method sang class chứa data nó cần.

**2.18 Inappropriate Intimacy:**
- **What:** Hai class truy cập private details của nhau quá nhiều.
- **Detect:** Class A dùng private field/method của Class B (qua reflection, friend, package-private).
- **Refactor:** Move Method/Field; Extract Class cho shared logic; Replace Inheritance with Delegation.

**2.19 Message Chains:**
- **What:** Client gọi chuỗi dài: `a.getB().getC().getD().doSomething()`.
- **Detect:** Chuỗi `.` dài; client phải biết internal structure của nhiều object.
- **Refactor:** Hide Delegate — tạo method trung gian. Áp dụng Law of Demeter.

**2.20 Middle Man:**
- **What:** Class chỉ delegate hầu hết method sang class khác, không thêm logic gì.
- **Detect:** >50% method chỉ gọi thẳng method tương ứng của delegate.
- **Refactor:** Remove Middle Man — cho client gọi trực tiếp. Hoặc Inline Class.

**Interview tip:** Khi được hỏi về code smells, nhóm theo category (Bloaters, Couplers...) thể hiện sự hiểu biết có hệ thống, thay vì liệt kê random.

---

## 3. Refactoring Catalog — Danh mục tái cấu trúc

### 🟢 Q: What is refactoring? `[Junior]`

**A:** Refactoring là quá trình thay đổi cấu trúc code mà **không thay đổi hành vi bên ngoài**. Mục đích: làm code dễ hiểu hơn, dễ thay đổi hơn.

**Điều kiện tiên quyết:**
- Phải có test coverage đủ tốt trước khi refactor.
- Refactor từng bước nhỏ, chạy test sau mỗi bước.
- Không thêm feature trong lúc refactor.

### 🟢 Q: What is Extract Method/Function? `[Junior]`

**A:** Tách một đoạn code từ hàm lớn thành hàm riêng với tên mô tả rõ ý đồ.

**Before:**
```
function processOrder(order) {
  // validate
  if (!order.items || order.items.length === 0) {
    throw new Error('Empty order')
  }
  if (!order.customer) {
    throw new Error('No customer')
  }

  // calculate total
  let total = 0
  for (const item of order.items) {
    total += item.price * item.quantity
  }
  if (order.discount) {
    total *= (1 - order.discount)
  }

  // send notification
  sendEmail(order.customer.email, `Order total: ${total}`)
}
```

**After:**
```
function processOrder(order) {
  validateOrder(order)
  const total = calculateTotal(order)
  notifyCustomer(order.customer, total)
}
```

**Khi áp dụng:** Hàm quá dài; có comment chia section; code block có thể đặt tên ý nghĩa.

### 🟡 Q: What is Inline Method? `[Mid]`

**A:** Ngược với Extract Method — thay thế hàm gọi bằng body của hàm đó khi hàm quá đơn giản hoặc tên không thêm thông tin gì.

**Before:**
```
function isAdult(age) {
  return age >= 18
}

function canPurchaseAlcohol(person) {
  return isAdult(person.age)
}
```

**After (nếu `isAdult` chỉ dùng 1 chỗ và quá trivial):**
```
function canPurchaseAlcohol(person) {
  return person.age >= 18
}
```

**Khi áp dụng:** Hàm chỉ gọi 1 chỗ; body đơn giản hơn tên; indirection không thêm giá trị.

### 🟡 Q: What is Extract Class? `[Mid]`

**A:** Tách một class có quá nhiều responsibility thành 2+ class nhỏ hơn.

**Dấu hiệu cần Extract Class:**
- Class có nhóm field/method liên quan chặt với nhau nhưng lỏng lẻo với phần còn lại.
- Class name quá generic: `UserManager` → tách thành `UserRepository` + `UserNotifier` + `UserValidator`.

**Khi áp dụng:** Vi phạm SRP; God Class; class >300-500 dòng logic.

### 🟡 Q: What is Move Method? `[Mid]`

**A:** Chuyển method từ class này sang class khác khi method dùng data/behavior của class kia nhiều hơn.

**Dấu hiệu:** Feature Envy smell — method gọi getter của object khác nhiều hơn dùng field của chính nó.

**Quy tắc:** Method nên ở gần data nó thao tác nhất.

### 🟡 Q: What is Replace Conditional with Polymorphism? `[Mid]`

**A:** Thay thế `switch/case` hoặc `if/else` chain bằng class hierarchy + polymorphism.

**Before:**
```
function calculateShipping(order) {
  switch (order.type) {
    case 'standard':
      return order.weight * 1.5
    case 'express':
      return order.weight * 3.0 + 5
    case 'overnight':
      return order.weight * 5.0 + 15
  }
}
```

**After:**
```
interface ShippingStrategy {
  calculate(weight: number): number
}

class StandardShipping implements ShippingStrategy {
  calculate(weight: number) { return weight * 1.5 }
}

class ExpressShipping implements ShippingStrategy {
  calculate(weight: number) { return weight * 3.0 + 5 }
}
```

**Khi áp dụng:** `switch` xuất hiện ở nhiều nơi theo cùng condition; thêm case mới phải sửa nhiều file.
**Khi KHÔNG áp dụng:** `switch` chỉ ở 1 chỗ; logic đơn giản; ít case và hiếm khi thay đổi.

### 🟡 Q: What is Introduce Parameter Object? `[Mid]`

**A:** Gom nhóm parameters luôn đi cùng nhau thành một object.

**Before:**
```
function searchFlights(from, to, departDate, returnDate, passengers, cabinClass) { ... }
```

**After:**
```
interface FlightSearchCriteria {
  from: string
  to: string
  departDate: Date
  returnDate?: Date
  passengers: number
  cabinClass: CabinClass
}

function searchFlights(criteria: FlightSearchCriteria) { ... }
```

**Lợi ích:** Giảm parameter count; tạo nơi đặt validation logic; dễ add optional params sau này.

### 🟢 Q: What is Replace Magic Number with Named Constant? `[Junior]`

**A:** Thay literal number/string bằng constant có tên mô tả ý nghĩa.

**Before:**
```
if (response.status === 429) {
  await sleep(3600000)
}
```

**After:**
```
const HTTP_TOO_MANY_REQUESTS = 429
const ONE_HOUR_MS = 60 * 60 * 1000

if (response.status === HTTP_TOO_MANY_REQUESTS) {
  await sleep(ONE_HOUR_MS)
}
```

### 🟡 Q: What is Compose Method? `[Mid]`

**A:** Transform method thành một chuỗi các bước ở cùng mức abstraction, mỗi bước là một method call với tên rõ ràng.

**Nguyên tắc:** Mọi statement trong method phải ở cùng level of abstraction. Nếu mix high-level (`validateUser`) với low-level (`if (email.indexOf('@') > -1)`), Extract Method cho low-level code.

### 🔴 Q: When should you NOT refactor? `[Senior]`

**A:** Refactoring không phải lúc nào cũng là quyết định đúng:

**1. Đang deadline gấp:**
- Refactor tăng risk; nếu break production lúc này → hậu quả lớn.
- Ghi technical debt vào backlog, refactor sau release.

**2. Code sắp bị xóa/replace:**
- Module sẽ deprecated trong 1-2 sprint → refactor là waste.
- System đang rewrite → đầu tư vào system mới.

**3. Không có test coverage:**
- Refactor không test = thay đổi behavior không biết.
- Viết characterization tests trước, rồi mới refactor.

**4. Không hiểu rõ domain:**
- Refactor khi chưa hiểu sẽ tạo abstraction sai.
- Đợi hiểu rõ hơn qua 2-3 feature cycles rồi mới refactor.

**5. Over-engineering risk:**
- Đừng refactor chỉ vì "có thể cần sau này" (YAGNI).
- Đừng abstract hóa khi chỉ có 1 concrete case.

**Interview tip:** Trả lời "khi nào KHÔNG refactor" thể hiện pragmatism — rất được đánh giá cao ở Senior level.

---

## 4. Code Metrics — Các chỉ số đo lường code

### 🟡 Q: What is Cyclomatic Complexity? `[Mid]`

**A:** Cyclomatic Complexity (CC) — do Thomas McCabe đề xuất năm 1976 — đo **số đường thực thi độc lập** qua một hàm.

**Cách tính đơn giản:** Đếm số decision point + 1.
- Mỗi `if`, `else if`, `case`, `for`, `while`, `catch`, `&&`, `||` = +1 decision point.

**Ví dụ:**
```
function validate(user) {          // CC starts at 1
  if (!user.name) return false     // +1 → CC = 2
  if (!user.email) return false    // +1 → CC = 3
  if (user.age < 0               // +1 → CC = 4
      || user.age > 150) {        // +1 → CC = 5
    return false
  }
  return true
}
// CC = 5
```

**Ý nghĩa thực tế:**
- CC = số test case tối thiểu cần viết để cover tất cả branches.
- CC cao → hàm khó test, khó hiểu, nhiều bug potential.

### 🟡 Q: What is Cognitive Complexity? `[Mid]`

**A:** Cognitive Complexity — do SonarSource phát triển — đo **mức độ khó hiểu** của code cho con người, cải tiến hạn chế của Cyclomatic Complexity.

**Khác biệt với CC:**
- Nesting tăng thêm penalty: `if` trong `if` trong `for` → penalty cao hơn 3 `if` liên tiếp.
- `switch` toàn bộ chỉ tính +1 (thay vì +1 mỗi case như CC).
- Shorthand syntax (`?.`, ternary) không bị penalty vì dễ đọc.

**Ví dụ:**
```
function getLabel(user) {
  if (user.isAdmin) {                    // +1
    if (user.isSuperAdmin) {             // +2 (nesting = 1)
      return 'Super Admin'
    }
    return 'Admin'
  } else if (user.isModerator) {         // +1
    return 'Moderator'
  }
  return 'User'
}
// Cognitive Complexity = 4
// Cyclomatic Complexity = 4 (same here, but differs on switch/nesting)
```

### 🟢 Q: What is Lines of Code (LOC) and what are its limitations? `[Junior]`

**A:** LOC đếm số dòng code trong file/function/project.

**Variants:**
- **Physical LOC**: Tổng số dòng kể cả blank lines, comments.
- **Logical LOC**: Chỉ đếm statements thực thi.

**Limitations:**
- Không phản ánh complexity: 50 dòng `if/else` lồng nhau phức tạp hơn 200 dòng sequential code.
- Language bias: Java verbose hơn Python → so sánh cross-language vô nghĩa.
- Incentive sai: đo LOC/day → developer viết code verbose, không refactor.
- Xóa code cũng là contribution có giá trị.

**Dùng hợp lý:** Indicator sơ bộ cho file/function quá lớn. Kết hợp với metric khác.

### 🔴 Q: Explain Coupling and Cohesion metrics. `[Senior]`

**A:**

**Coupling — Mức độ phụ thuộc giữa modules:**

| Loại | Mô tả | Mức độ |
|------|--------|--------|
| **Afferent Coupling (Ca)** | Số module phụ thuộc VÀO module này | Ca cao → module quan trọng, thay đổi rủi ro lớn |
| **Efferent Coupling (Ce)** | Số module mà module này PHỤ THUỘC vào | Ce cao → module phụ thuộc nhiều, fragile |
| **Instability (I)** | I = Ce / (Ca + Ce) | I = 0: stable (nhiều module phụ thuộc vào); I = 1: unstable |

**Cohesion — Mức độ liên kết trong nội bộ module:**

| Loại | Mô tả |
|------|--------|
| **Functional** (tốt nhất) | Mọi phần đóng góp vào 1 task duy nhất |
| **Sequential** | Output của phần này là input phần kia |
| **Communicational** | Các phần dùng chung data |
| **Temporal** | Các phần chạy cùng thời điểm (init code) |
| **Coincidental** (tệ nhất) | Các phần không liên quan, chỉ tình cờ ở cùng file |

**LCOM (Lack of Cohesion of Methods):**
- LCOM = 0: perfectly cohesive — mọi method dùng mọi field.
- LCOM cao: class nên được tách ra.

**Robert C. Martin's Stable Dependencies Principle:** Module nên phụ thuộc vào module stable hơn nó (I thấp hơn).

### 🔴 Q: What is the Maintainability Index? `[Senior]`

**A:** Maintainability Index (MI) là composite metric kết hợp nhiều metric nhỏ thành 1 con số duy nhất.

**Công thức (phiên bản Visual Studio):**
```
MI = max(0, (171 - 5.2 * ln(HV) - 0.23 * CC - 16.2 * ln(LOC)) * 100 / 171)
```

Trong đó:
- HV = Halstead Volume (đo complexity dựa trên operators + operands)
- CC = Cyclomatic Complexity
- LOC = Lines of Code

**Thang điểm:**
| Khoảng | Đánh giá |
|--------|----------|
| 20-100 | Good maintainability |
| 10-19 | Moderate — cần chú ý |
| 0-9 | Low — khó bảo trì, ưu tiên refactor |

**Halstead Metrics (brief):**
- Đo complexity dựa trên số **operators** (unique + total) và **operands** (unique + total).
- Halstead Volume V = N * log2(n), với N = total operators+operands, n = unique operators+operands.
- Ít dùng trực tiếp trong thực tế, nhưng là input cho Maintainability Index.

### 🟡 Q: What are practical thresholds for code metrics? `[Mid]`

**A:** Bảng ngưỡng thực tế để config cho tool:

| Metric | Good | Warning | Bad | Tool |
|--------|------|---------|-----|------|
| Cyclomatic Complexity / function | 1-10 | 11-20 | >20 | ESLint, golangci-lint |
| Cognitive Complexity / function | 1-15 | 16-25 | >25 | SonarQube |
| Function length (LOC) | <30 | 30-60 | >60 | ESLint, custom |
| File length (LOC) | <300 | 300-500 | >500 | Custom |
| Parameter count | 1-3 | 4-5 | >5 | ESLint, golangci-lint |
| Nesting depth | 1-3 | 4-5 | >5 | ESLint |
| Class method count | <15 | 15-25 | >25 | SonarQube |
| Test coverage | >80% | 60-80% | <60% | Istanbul, go test |
| Maintainability Index | >20 | 10-20 | <10 | Visual Studio, SonarQube |

**Lưu ý:** Đây là guidelines, không phải rules cứng. Context matters — một parser function có CC = 25 có thể acceptable nếu logic inherently complex.

---

## 5. Static Analysis & Linting — Phân tích tĩnh

### 🟢 Q: What is static analysis? `[Junior]`

**A:** Static analysis là **phân tích code mà không cần chạy nó**. Tool đọc source code, phát hiện lỗi tiềm ẩn, vi phạm convention, security issues.

**Tại sao "static"?** Vì phân tích code ở trạng thái tĩnh (text/AST), không execute. Đối lập với dynamic analysis (profiling, runtime monitoring).

**Lợi ích:**
- Phát hiện bug trước khi code chạy (shift-left).
- Enforce coding standards tự động.
- Catch security vulnerabilities sớm.
- Giảm workload cho code reviewer.

### 🟡 Q: How does AST-based analysis work? `[Mid]`

**A:** Hầu hết static analysis tool hiện đại hoạt động trên **Abstract Syntax Tree (AST)**:

```text
Source Code → Lexer → Tokens → Parser → AST → Analysis Rules → Findings
```

**Ví dụ:** Code `if (x = 5)` (assignment thay vì comparison):
1. Parser tạo AST node: `IfStatement > AssignmentExpression`.
2. Rule kiểm tra: "IfStatement condition không nên là AssignmentExpression".
3. Report: "Possible accidental assignment in condition".

**Tại sao AST chứ không regex?**
- Regex không hiểu cấu trúc ngôn ngữ (nesting, scope, type).
- AST giữ semantic information → phân tích chính xác hơn.
- AST cho phép auto-fix: modify tree → generate code.

### 🟡 Q: What is the difference between linters, formatters, and type checkers? `[Mid]`

**A:**

| Tool | Mục đích | Ví dụ | Scope |
|------|----------|-------|-------|
| **Linter** | Phát hiện bugs, bad patterns, style issues | ESLint, golangci-lint, Pylint | Logic + style |
| **Formatter** | Enforce formatting nhất quán (spacing, indentation, line breaks) | Prettier, gofmt, Black | Style only |
| **Type Checker** | Kiểm tra type safety tại compile time | TypeScript compiler, mypy, Go compiler | Type correctness |

**Mối quan hệ:**
- Formatter: "Code trông thế nào" → **không bao giờ thay đổi logic**.
- Linter: "Code có vấn đề gì không" → có thể suggest logic changes.
- Type checker: "Types có khớp không" → compiler-level safety.

**Best practice:** Dùng cả 3 cùng nhau. Formatter chạy trước (hoặc on-save), linter + type checker chạy trong CI.

### 🟡 Q: What are common linting rules and why do they exist? `[Mid]`

**A:** Mỗi rule tồn tại vì một lý do thực tế:

| Rule | Lý do tồn tại |
|------|----------------|
| `no-unused-vars` | Dead code gây confusion; indicate incomplete refactoring |
| `no-implicit-coercion` | `!!x` vs `Boolean(x)` — explicit rõ ràng hơn |
| `eqeqeq` (strict equality) | `==` có coercion rules phức tạp, dễ gây bug |
| `no-var` | `var` có hoisting quirks, `let/const` an toàn hơn |
| `max-lines-per-function` | Hàm dài → khó hiểu, khó test |
| `max-depth` | Nesting sâu → cognitive load cao |
| `no-magic-numbers` | Literal numbers không có context |
| `exhaustive-deps` (React) | Missing dependency trong useEffect → stale closure bug |
| `errcheck` (Go) | Unchecked errors → silent failures |
| `shadow` (Go) | Variable shadowing → unexpected behavior |

### 🔴 Q: How do you write custom lint rules? `[Senior]`

**A:** Khi built-in rules không đủ, bạn có thể viết custom rules:

**ESLint custom rule structure:**
```
module.exports = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow console.log in production code' },
    fixable: 'code',
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.object?.name === 'console'
            && node.callee.property?.name === 'log') {
          context.report({
            node,
            message: 'Unexpected console.log. Use logger instead.',
            fix(fixer) {
              return fixer.replaceText(node.callee, 'logger.debug')
            }
          })
        }
      }
    }
  }
}
```

**Go custom linter (sử dụng `go/analysis`):**
- Truy cập AST qua `analysis.Pass`.
- Inspect nodes, report diagnostics.
- Tích hợp vào `golangci-lint` qua plugin.

**Khi nào cần custom rule:**
- Domain-specific convention (e.g., "API handlers phải log request ID").
- Team convention không có sẵn built-in rule.
- Migration enforcement (e.g., "không dùng deprecated function X").

### 🟡 Q: How do you integrate static analysis in CI/CD? `[Mid]`

**A:** Static analysis nên là **gate** trong CI — code không pass thì không merge.

**Pipeline setup:**
```text
Push → Lint + Format check → Type check → Unit tests → Build → Deploy
        ↑ fail fast here
```

**Best practices:**
1. **Run on PR**: Chạy khi mở/update PR, block merge nếu fail.
2. **Incremental analysis**: Chỉ check file thay đổi (tốc độ nhanh hơn).
3. **Baseline**: Cho codebase cũ, set baseline → chỉ fail trên violations mới.
4. **Cache**: Cache dependencies và lint results giữa các run.
5. **Pre-commit hooks**: Chạy local trước khi push (giảm CI feedback loop).

**Auto-fix capabilities:**
- ESLint `--fix`: tự sửa formatting và simple patterns.
- Prettier `--write`: format lại file.
- `gofmt` / `goimports`: Go auto-format.
- CI có thể auto-commit fixes hoặc suggest fixes trong PR comment.

---

## 6. Code Review Best Practices — Thực hành review code

### 🟢 Q: Why is code review important? `[Junior]`

**A:** Code review là process để đồng nghiệp kiểm tra code trước khi merge. Nó quan trọng vì 3 lý do chính:

**1. Knowledge sharing:**
- Reviewer học cách tiếp cận mới từ author.
- Author học từ feedback của reviewer.
- Giảm "bus factor" — nhiều người hiểu mỗi phần code.

**2. Bug catching:**
- Fresh eyes phát hiện lỗi mà author bỏ qua (blind spot).
- Studies cho thấy code review catch 60-70% defects (trước khi test).

**3. Consistency:**
- Enforce coding standards, naming conventions, architecture patterns.
- Đảm bảo code mới phù hợp với codebase hiện tại.

### 🟡 Q: What should you look for in a code review? `[Mid]`

**A:** Review checklist theo thứ tự ưu tiên:

**Tier 1 — Correctness (quan trọng nhất):**
- Logic có đúng không? Edge cases có handled không?
- Error handling: null/undefined, empty arrays, network failures.
- Concurrency: race conditions, deadlocks (nếu applicable).
- Data integrity: off-by-one, integer overflow, timezone issues.

**Tier 2 — Design:**
- Có đúng abstraction level không?
- Có vi phạm SOLID principles không?
- Có tạo unnecessary coupling không?
- Có fit vào architecture hiện tại không?

**Tier 3 — Readability:**
- Naming rõ ý đồ? Code self-documenting?
- Functions/methods có quá dài không?
- Comments giải thích "why" chứ không phải "what"?

**Tier 4 — Security:**
- Input validation? SQL injection? XSS?
- Secrets hardcoded? Sensitive data logged?
- Auth/authz checks đúng chỗ?

**Tier 5 — Performance:**
- N+1 queries? Unnecessary loops?
- Large memory allocation? Missing pagination?
- Cache strategy hợp lý?

**Tier 6 — Tests:**
- Test coverage cho logic mới?
- Test có đọc được và dễ hiểu không?
- Edge cases được test?

### 🟡 Q: What does a good code review checklist look like? `[Mid]`

**A:** Template thực tế cho team:

```text
## Code Review Checklist

### Correctness
- [ ] Logic handles all expected inputs correctly
- [ ] Edge cases handled (empty, null, boundary values)
- [ ] Error paths return appropriate errors / status codes
- [ ] No data races or concurrency issues

### Design
- [ ] Changes follow existing patterns in the codebase
- [ ] No unnecessary abstractions or over-engineering
- [ ] Single Responsibility: each function/class does one thing
- [ ] Dependencies are reasonable (no circular deps)

### Readability
- [ ] Variable/function names are descriptive
- [ ] No magic numbers or strings
- [ ] Complex logic has explanatory comments (why, not what)
- [ ] Function length is reasonable (<30 lines)

### Security
- [ ] User input is validated and sanitized
- [ ] No secrets in code or logs
- [ ] Auth checks are in place for protected resources

### Testing
- [ ] New logic has corresponding tests
- [ ] Tests cover happy path AND error paths
- [ ] Tests are readable and maintainable

### Operations
- [ ] Logging is appropriate (not too verbose, not too sparse)
- [ ] Metrics/alerts added for new failure modes
- [ ] Database migrations are backward-compatible
- [ ] Feature flags for risky changes
```

### 🟡 Q: How do you give constructive feedback in code reviews? `[Mid]`

**A:** Feedback tốt vừa phát hiện vấn đề, vừa giữ mối quan hệ tốt trong team:

**Nguyên tắc:**

**1. Comment vào code, không phải vào người:**
- Tệ: "You didn't handle errors properly."
- Tốt: "This function could fail if the API returns 500. Consider adding error handling here."

**2. Hỏi trước khi assert:**
- Tệ: "This is wrong. Use a map instead of array."
- Tốt: "What was the reasoning for using an array here? A map might give O(1) lookup — thoughts?"

**3. Giải thích why, không chỉ what:**
- Tệ: "Extract this into a function."
- Tốt: "Extracting this into a function would make the test easier to write for the discount logic specifically."

**4. Phân loại severity:**
- `[nit]`: Style/preference, không block merge.
- `[suggestion]`: Có thể cải thiện, consider cho PR này hoặc follow-up.
- `[must-fix]`: Bug hoặc security issue, phải sửa trước merge.

**5. Khen khi thấy code tốt:**
- "Nice refactoring here — much cleaner than before."
- "Good test coverage for the edge cases."

### 🟡 Q: How do you receive code review feedback gracefully? `[Mid]`

**A:** Nhận feedback là kỹ năng quan trọng không kém cho feedback:

**1. Không defensive:**
- Comment review không phải tấn công cá nhân.
- Đọc kỹ, hiểu intent trước khi reply.

**2. Assume good intent:**
- Reviewer muốn code tốt hơn, không muốn chứng minh bạn sai.
- Nếu tone comment harsh, hỏi clarification thay vì phản ứng.

**3. Explain, don't justify:**
- Nếu có lý do cho quyết định, giải thích context.
- "I chose this approach because of X constraint. Would you still recommend Y given that?"

**4. Pick your battles:**
- Đồng ý với feedback hợp lý ngay.
- Chỉ push back khi có lý do kỹ thuật rõ ràng.

**5. Say thank you:**
- Reviewer đã dành thời gian đọc và suy nghĩ về code của bạn.

### 🔴 Q: Why should PRs be small, and what is the ideal size? `[Senior]`

**A:** PR size ảnh hưởng trực tiếp đến review quality:

**Nghiên cứu từ SmartBear / Cisco:**
- Review hiệu quả nhất khi **<400 LOC changed**.
- Sau 400 LOC, defect detection rate giảm mạnh.
- Sau 1000 LOC, reviewer thường skim thay vì review kỹ.

```text
Defect Detection Rate vs PR Size:

Detection
Rate (%)
100 |  ___
    | /   \
 75 |/     \
    |       \
 50 |        \___
    |             \____
 25 |                   \__________
    |
  0 +----+----+----+----+----+-----> LOC
    0   200  400  600  800  1000
```

**Strategies cho small PRs:**
1. **Stacked PRs**: Chia feature lớn thành chuỗi PRs nhỏ, mỗi PR build on previous.
2. **Feature flags**: Ship incomplete feature behind flag → merge nhỏ, release riêng.
3. **Refactor first, feature second**: Tách PR refactoring ra khỏi PR feature.
4. **Extract config/migration**: DB migration, config changes = PR riêng.

**Ideal PR structure:**
- Title rõ ràng: what and why.
- Description: context, screenshots nếu UI, test plan.
- <400 LOC (excluding generated files, tests ideally counted separately).
- Self-contained: có thể review và merge độc lập.

### 🟡 Q: What is async review culture and how does it compare to pair programming? `[Mid]`

**A:**

**Async Code Review:**
- Author push PR → Reviewer review khi available → Author address feedback → Merge.
- **Ưu điểm:** Flexible schedule; written record; reviewer có thời gian suy nghĩ.
- **Nhược điểm:** Feedback loop chậm (hours-days); context lost qua text; nit-picking dễ xảy ra.

**Pair Programming:**
- Hai developer code cùng nhau real-time (driver + navigator).
- **Ưu điểm:** Instant feedback; knowledge transfer nhanh; ít bug hơn.
- **Nhược điểm:** Tốn gấp đôi developer time; scheduling khó; introvert burnout.

**Khi nào dùng cái nào:**
| Situation | Approach |
|-----------|----------|
| Complex new feature, unfamiliar domain | Pair programming |
| Bug fix, routine change | Async review |
| Junior onboarding | Pair programming |
| Distributed team, different timezones | Async review |
| Critical path, tight deadline | Pair programming (less rework) |

### 🔴 Q: What is the LGTM problem? `[Senior]`

**A:** "LGTM" (Looks Good To Me) culture problem xảy ra khi reviewer approve PR mà không review kỹ:

**Nguyên nhân:**
- PR quá lớn → reviewer overwhelmed → skim và LGTM.
- Social pressure: không muốn block đồng nghiệp.
- Reviewer quá bận → rubber stamp.
- Không có accountability cho review quality.

**Hậu quả:**
- Bugs slip through → "nhưng đã có người review mà?"
- Code quality giảm dần → broken window effect.
- Knowledge sharing không xảy ra.

**Giải pháp:**
1. **Small PRs** (giải quyết root cause lớn nhất).
2. **Review metrics**: Track comment count, time spent — không phải để punish mà để spot trends.
3. **Review rotation**: Mọi người đều review, không chỉ 1-2 senior.
4. **Required context**: Author phải cung cấp description, test plan, reasoning.
5. **Pair review**: Cho complex PRs, 2 người review cùng nhau (sync).
6. **Review SLA**: Set expectation rõ (e.g., review trong 4 business hours).

---

## 7. Technical Debt — Nợ kỹ thuật

### 🟢 Q: What is technical debt? `[Junior]`

**A:** Technical debt là metaphor do **Ward Cunningham** (1992) đặt ra, so sánh những quyết định kỹ thuật tắt với **vay nợ tài chính**.

**Analogy:**
- **Vay nợ (taking debt):** Ship code nhanh bằng cách tắt, bỏ qua design tốt.
- **Lãi suất (interest):** Mỗi thay đổi sau này tốn thêm effort vì code tắt.
- **Trả nợ gốc (pay principal):** Refactor code về design đúng.

**Ví dụ thực tế:**
- Hardcode config → mỗi lần deploy phải sửa code → interest = time mỗi lần deploy.
- Copy-paste logic → sửa bug 1 chỗ, quên chỗ khác → interest = bugs + rework.
- Không viết test → sửa code luôn sợ break → interest = slow delivery + regressions.

### 🟡 Q: What is the Technical Debt Quadrant? `[Mid]`

**A:** Martin Fowler phân loại technical debt theo 2 chiều:

```text
                    Reckless                    Prudent
           ┌────────────────────────┬────────────────────────┐
           │                        │                        │
           │  "We don't have time   │  "We must ship now     │
Deliberate │   for design"          │   and deal with        │
           │                        │   consequences"        │
           │  → Worst kind          │  → Acceptable          │
           │                        │                        │
           ├────────────────────────┼────────────────────────┤
           │                        │                        │
           │  "What's layering?"    │  "Now we know how we   │
Inadvertent│                        │   should have done it" │
           │  → Lack of skill       │  → Learning outcome    │
           │                        │                        │
           └────────────────────────┴────────────────────────┘
```

**4 loại:**

1. **Reckless + Deliberate:** Biết design sai nhưng cố tình bỏ qua vì lười. "Kệ, cứ ship đi." → Tệ nhất, khó justify.

2. **Prudent + Deliberate:** Biết design chưa tối ưu, nhưng chọn ship trước vì business reason rõ ràng. Có plan trả nợ. → Acceptable trong nhiều trường hợp.

3. **Reckless + Inadvertent:** Không biết mình đang tạo debt vì thiếu kiến thức. "What's SOLID?" → Giải quyết bằng training, mentoring, code review.

4. **Prudent + Inadvertent:** Sau khi implement xong mới nhận ra design tốt hơn. "Bây giờ mới hiểu nên dùng event-driven." → Tự nhiên nhất, inevitable trong mọi project.

### 🟡 Q: How do you measure technical debt? `[Mid]`

**A:** Technical debt khó đo chính xác, nhưng có proxy metrics:

**Direct indicators:**
- **Code quality metrics**: Cyclomatic complexity trends, code smells count (SonarQube).
- **TODO/FIXME/HACK count**: Grep codebase, track over time.
- **Dependency age**: Outdated dependencies = security debt.

**Indirect indicators (hậu quả của debt):**
- **Cycle time increasing**: Thời gian từ commit đến production tăng dần.
- **Bug rate per feature**: Mỗi feature mới tạo nhiều bug hơn.
- **Change failure rate**: % deployment gây incident.
- **Time to onboard**: Dev mới mất bao lâu để productive.

**SonarQube SQALE method:**
- Estimate effort (person-days) để fix tất cả issues.
- Technical Debt Ratio = Remediation cost / Development cost.
- Debt Ratio <5% = A rating, >50% = E rating.

### 🔴 Q: How do you manage technical debt strategically? `[Senior]`

**A:** Quản lý debt là kỹ năng leadership, không chỉ engineering:

**1. Debt Register:**
- Maintain list tất cả known debt items.
- Mỗi item: description, impact, estimated effort, owner, priority.
- Review monthly trong technical planning.

**2. Phân bổ capacity (20% rule):**
- Dành ~20% sprint capacity cho debt repayment.
- Không cần xin permission — embed vào estimation.
- Track debt items giống feature stories.

**3. Boy Scout Rule:**
- Mỗi PR cải thiện ít nhất 1 thứ nhỏ xung quanh code mình đụng.
- Không cần refactoring sprint riêng cho small improvements.

**4. Opportunistic refactoring:**
- Khi implement feature, refactor phần code liên quan.
- "Make the change easy, then make the easy change." — Kent Beck.

**5. Debt sprints (dùng khi cần):**
- Dành 1 sprint hoàn toàn cho debt khi accumulation quá lớn.
- Có clear goals: "Giảm build time từ 20 phút xuống 5 phút."

### 🔴 Q: When is technical debt acceptable? `[Senior]`

**A:** Debt không phải lúc nào cũng xấu — giống như nợ tài chính có thể là investment:

**Acceptable:**
- **Prototype / MVP**: Validate idea trước khi invest vào quality. Plan rewrite nếu thành công.
- **Time-to-market critical**: First mover advantage > perfect code. Nhưng phải có plan trả nợ.
- **Throwaway code**: Script chạy 1 lần, migration tool, hackathon project.
- **Learning debt (prudent inadvertent)**: Inevitable — bạn sẽ hiểu domain tốt hơn sau.

**Không acceptable:**
- **Reckless deliberate**: "Kệ, mai tính." — thường không bao giờ "mai" đến.
- **Security debt**: Không bao giờ acceptable để delay security fixes.
- **Debt on debt**: Thêm feature lên trên debt mà không trả nợ trước → compound interest.

### 🟡 Q: What is the "interest" on technical debt? `[Mid]`

**A:** Interest là **extra cost** mà team trả cho MỖI thay đổi vì existence của debt:

**Ví dụ cụ thể:**

| Debt | Interest per change |
|------|-------------------|
| No tests | +2h manual testing mỗi deploy; unexpected regressions |
| Monolith coupling | +1h tìm hiểu side effects mỗi PR |
| No CI/CD | +30m build + deploy manual mỗi release |
| Outdated docs | +1h hỏi đồng nghiệp mỗi lần onboard feature area |
| Copy-pasted logic | +1h sửa bug ở N chỗ thay vì 1 chỗ |

**Compound interest:** Debt tạo thêm debt. Monolith coupling → harder to test → less tests → more bugs → more hotfixes → more coupling.

**Interest rate không cố định:** Debt ở code path ít thay đổi → interest thấp. Debt ở hot path (code thay đổi hàng tuần) → interest rất cao. Ưu tiên trả debt ở hot path trước.

---

## 8. Documentation as Code Quality — Tài liệu như chất lượng

### 🟢 Q: What is self-documenting code? `[Junior]`

**A:** Self-documenting code là code đủ rõ ràng để người đọc hiểu mà **không cần comment giải thích "what"**.

**Cách đạt được:**
1. **Meaningful names:** `calculateMonthlyRevenue()` thay vì `calc()`.
2. **Small functions:** Mỗi function làm 1 việc, tên function = documentation.
3. **Named constants:** `MAX_RETRY_ATTEMPTS = 3` thay vì magic number `3`.
4. **Type annotations:** `function pay(amount: Money, to: Account)` thay vì `function pay(a, b)`.
5. **Guard clauses:** Early returns cho edge cases thay vì nested if.

**Before:**
```
// Check if user can access the resource
function check(u, r) {
  if (u.r === 1 || (u.r === 2 && r.o === u.id)) {
    return true
  }
  return false
}
```

**After (self-documenting):**
```
function canAccessResource(user: User, resource: Resource): boolean {
  if (user.role === Role.Admin) return true
  if (user.role === Role.Editor && resource.ownerId === user.id) return true
  return false
}
```

### 🟡 Q: When are comments necessary? `[Mid]`

**A:** Self-documenting code giảm nhu cầu comment, nhưng một số trường hợp comment là **essential**:

**Comment cần thiết (WHY, not WHAT):**

1. **Business reason:**
```
// Tax calculation uses 2023 rates per government regulation XYZ-123.
// Update required by Jan 1 each year.
const TAX_RATE = 0.08
```

2. **Non-obvious performance optimization:**
```
// Using manual loop instead of .map() because V8 optimizes
// this pattern 3x faster for arrays >10k elements.
// Benchmark: https://jsperf.com/xxx
```

3. **Workaround for known bug:**
```
// HACK: Safari 16 doesn't support structuredClone on Blobs.
// Remove after Safari 17 adoption >90%. Tracking: JIRA-4521
```

4. **Intentional complexity:**
```
// Bitwise XOR swap avoids allocating temp variable in hot loop.
// This function is called ~1M times per frame.
[a, b] = [a ^ b, a ^ b ^ (a ^ b)]
```

5. **Contract / invariant:**
```
// Callers MUST hold the mutex before calling this function.
// Returns sorted array — DO NOT re-sort.
```

**Comment KHÔNG cần (smell):**
```
// Increment counter by 1
counter++

// Get user by ID
function getUserById(id) { ... }
```

### 🟡 Q: What are the main approaches to API documentation? `[Mid]`

**A:**

**1. OpenAPI / Swagger (REST APIs):**
- Specification format (YAML/JSON) mô tả endpoints, params, responses.
- Generate docs, client SDKs, mock servers từ spec.
- Best practice: spec-first design → implement → validate against spec.

**2. JSDoc (JavaScript/TypeScript):**
```
/**
 * Calculate compound interest over a period.
 * @param principal - Initial investment amount
 * @param rate - Annual interest rate (0.05 = 5%)
 * @param years - Number of years
 * @returns Final amount after compound interest
 */
function compoundInterest(principal: number, rate: number, years: number): number
```

**3. GoDoc (Go):**
```
// CompoundInterest calculates the final amount after applying
// compound interest over the specified number of years.
// Rate should be expressed as a decimal (0.05 = 5%).
func CompoundInterest(principal, rate float64, years int) float64
```

**Convention:** Go docs = comment ngay trước declaration, bắt đầu bằng tên function.

**Best practice chung:**
- Document **public** API thoroughly. Internal code = self-documenting + occasional comments.
- Include examples (Go: `Example` functions, JS: `@example` tag).
- Document error conditions and edge cases.

### 🔴 Q: What are Architecture Decision Records (ADRs)? `[Senior]`

**A:** ADR là document ngắn ghi lại **quyết định kiến trúc quan trọng** cùng context và consequences.

**Format (Michael Nygard):**

```text
# ADR-001: Use PostgreSQL as primary database

## Status
Accepted (2024-03-15)

## Context
We need a relational database for our order management system.
Expected load: 10K orders/day, complex queries for reporting.
Team has experience with both PostgreSQL and MySQL.

## Decision
Use PostgreSQL 16 with pgvector extension.

## Consequences
### Positive
- Strong JSON support for flexible schemas
- pgvector enables future AI/ML features
- Team expertise reduces learning curve

### Negative
- Slightly more complex replication setup vs MySQL
- Fewer managed hosting options in Vietnam region

## Alternatives Considered
- MySQL 8: Simpler replication but weaker JSON/vector support
- MongoDB: Flexible schema but complex transactions
```

**Tại sao ADR quan trọng:**
- Người mới join hiểu **tại sao** architecture là như vậy.
- Tránh re-debate quyết định cũ khi context không thay đổi.
- Khi context thay đổi, có record để biết khi nào nên reconsider.

**Best practices:**
- Lưu trong repo (e.g., `docs/adr/`), version control cùng code.
- Immutable: không sửa ADR cũ, tạo ADR mới supersede nếu thay đổi.
- Numbered, short, decision-focused (không phải research paper).

### 🟡 Q: What makes a good README? `[Mid]`

**A:** README là document đầu tiên người mới đọc:

**Template tối thiểu:**
```text
# Project Name
One-line description of what this project does.

## Quick Start
- Prerequisites (Node 18+, Go 1.21+, Docker)
- Installation steps (copy-paste-able commands)
- Run locally (1-2 commands max)

## Architecture Overview
Brief diagram or description of major components.

## Development
- How to run tests
- How to lint/format
- Branching strategy
- PR process

## Deployment
- How to deploy to staging/production
- Environment variables (table with description, NOT values)

## Troubleshooting
Common issues and solutions.
```

**Common mistakes:**
- Outdated Quick Start (first impression = broken → bad).
- Missing environment variables documentation.
- Too long (README > 500 lines → tách thành docs/).

### 🔴 Q: What are runbooks and why are they important? `[Senior]`

**A:** Runbook là document hướng dẫn **step-by-step** cho operational tasks, đặc biệt incident response.

**Tại sao quan trọng:**
- 3AM incident, on-call engineer không quen system → runbook giúp resolve nhanh.
- Giảm dependency on tribal knowledge.
- Consistent response quality bất kể ai on-call.

**Runbook template:**
```text
# Runbook: Database Connection Pool Exhaustion

## Symptoms
- API returns 503
- Logs show "connection pool exhausted"
- Grafana alert: db_active_connections > 95%

## Impact
- All API requests fail
- Severity: P1

## Diagnosis Steps
1. Check active connections: `SELECT count(*) FROM pg_stat_activity`
2. Find long-running queries: `SELECT * FROM pg_stat_activity WHERE state = 'active' ORDER BY duration DESC`
3. Check application logs for connection leak patterns

## Resolution Steps
1. Kill long-running queries: `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE duration > interval '5 minutes'`
2. Restart application pods: `kubectl rollout restart deployment/api`
3. If persists, increase pool size temporarily: update CONFIG_DB_POOL_MAX

## Prevention
- Set statement_timeout = 30s
- Add connection pool metrics alert at 80%
- Review queries in slow query log weekly
```

---

## 9. Clean Code Principles — Nguyên tắc Clean Code

### 🟢 Q: What makes a good name in code? `[Junior]`

**A:** Naming là kỹ năng quan trọng nhất trong programming (theo Robert C. Martin):

**1. Intention-revealing (bộc lộ ý đồ):**
```
// Bad
const d = 7
const list = getItems()

// Good
const MAX_DAYS_UNTIL_EXPIRY = 7
const activeUsers = getActiveUsers()
```

**2. Pronounceable (đọc được):**
```
// Bad
const genYMDStr = () => ...
const modRec = () => ...

// Good
const generateDateString = () => ...
const modifyRecord = () => ...
```

**3. Searchable (tìm kiếm được):**
```
// Bad — search "7" in codebase, get 1000 results
if (days > 7) { ... }

// Good — search "MAX_DAYS_UNTIL_EXPIRY", get exact results
if (days > MAX_DAYS_UNTIL_EXPIRY) { ... }
```

**4. Avoid encoding (không mã hóa type vào tên):**
```
// Bad (Hungarian notation)
const strName = 'John'
const iCount = 5
const arrItems = []

// Good — type system handles this
const name = 'John'
const count = 5
const items: Item[] = []
```

**5. Naming conventions by context:**
| Context | Convention | Example |
|---------|-----------|---------|
| Boolean | is/has/can/should prefix | `isActive`, `hasPermission` |
| Function | verb + noun | `calculateTotal`, `sendEmail` |
| Class | noun | `OrderProcessor`, `UserRepository` |
| Constant | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_BASE_URL` |
| Interface (Go) | verb + -er suffix | `Reader`, `Closer`, `Handler` |

### 🟡 Q: How should functions be structured for clean code? `[Mid]`

**A:** Robert C. Martin's function rules:

**1. Small:** Ideally 5-15 lines. Max 20-30 lines.

**2. Do One Thing:**
- Nếu bạn có thể extract một phần thành hàm riêng với tên khác → function đang làm nhiều hơn 1 việc.
- Test: mô tả function bằng 1 câu KHÔNG có "and" hoặc "or".

**3. One Level of Abstraction:**
```
// Bad — mixing abstraction levels
function createUser(data) {
  // High level
  validateUserData(data)

  // Low level
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(data.password, salt, 1000, 64, 'sha512')

  // High level again
  return saveToDatabase({ ...data, passwordHash: hash })
}

// Good — consistent abstraction
function createUser(data) {
  validateUserData(data)
  const credentials = hashPassword(data.password)
  return saveToDatabase({ ...data, ...credentials })
}
```

**4. Stepdown Rule:** Đọc file từ trên xuống như đọc newspaper — high-level functions trước, detail functions sau.

**5. No Side Effects (khi possible):**
- Function tên `checkPassword` không nên gọi `session.initialize()` bên trong.
- Nếu có side effect, reflect trong tên: `checkPasswordAndInitSession`.

### 🟢 Q: What are DRY, KISS, and YAGNI? `[Junior]`

**A:** Ba nguyên tắc nền tảng:

**DRY — Don't Repeat Yourself:**
- "Every piece of knowledge must have a single, unambiguous, authoritative representation."
- Không chỉ về duplicate code → duplicate logic, duplicate data sources.
- **Cẩn thận:** DRY quá mức → coupling sai. Hai đoạn code giống nhau nhưng represent khác concept → KHÔNG nên merge.

**KISS — Keep It Simple, Stupid:**
- Giải pháp đơn giản nhất thường là giải pháp tốt nhất.
- Complexity là kẻ thù: mỗi abstraction layer thêm cognitive load.
- "Can a junior developer understand this code in 5 minutes?"

**YAGNI — You Aren't Gonna Need It:**
- Không implement feature/abstraction cho use case tương lai.
- "Build the simplest thing that could possibly work."
- 80% "future-proof" code không bao giờ cần.
- YAGNI không có nghĩa viết code cẩu thả — vẫn cần clean, tested, nhưng không over-design.

**Mối quan hệ:**
```text
YAGNI: "Don't build what you don't need"
KISS:  "Build it simply"
DRY:   "Build it once"
```

### 🟡 Q: What is the Boy Scout Rule? `[Mid]`

**A:** "Leave the campground cleaner than you found it." — Robert C. Martin.

**Áp dụng:** Mỗi khi đụng vào file, cải thiện ít nhất 1 thứ nhỏ:
- Rename biến cho rõ hơn.
- Extract magic number thành constant.
- Xóa dead code.
- Thêm type annotation.
- Fix linting warning.

**Tại sao hiệu quả:**
- Không cần "refactoring sprint" riêng.
- Codebase cải thiện dần tự nhiên theo thời gian.
- Tạo culture of ownership.

**Giới hạn:** Không refactor lớn trong PR feature. Boy Scout = small, safe improvements.

### 🟡 Q: What is the Principle of Least Surprise? `[Mid]`

**A:** Code nên behave theo cách mà người đọc/người dùng **mong đợi** dựa trên tên, context, và conventions.

**Vi phạm:**
```
// Function tên "get" nhưng có side effect
function getUser(id) {
  const user = db.findById(id)
  user.lastAccessedAt = new Date()  // surprise mutation!
  db.save(user)                      // surprise DB write!
  return user
}
```

**Áp dụng tốt:**
```
function getUser(id) {
  return db.findById(id)  // just reads, no surprises
}

function recordUserAccess(id) {
  // name clearly indicates side effect
  const user = db.findById(id)
  user.lastAccessedAt = new Date()
  db.save(user)
}
```

**Ở API level:** `DELETE /users/123` nên xóa user, không nên archive. Nếu archive, dùng `POST /users/123/archive`.

### 🔴 Q: What is Command-Query Separation (CQS)? `[Senior]`

**A:** Bertrand Meyer's principle: mỗi method nên là **command** hoặc **query**, không phải cả hai.

**Command:** Thay đổi state, không return value (hoặc return void).
```
function addItem(cart, item) {
  cart.items.push(item)
  // returns nothing
}
```

**Query:** Return value, không thay đổi state.
```
function getTotal(cart) {
  return cart.items.reduce((sum, item) => sum + item.price, 0)
  // no side effects
}
```

**Lợi ích:**
- Reasoning dễ hơn: query gọi bao nhiêu lần cũng cùng kết quả.
- Testing dễ hơn: query test return value, command test state change.
- Caching an toàn cho queries.

**Exception thực tế:**
- `stack.pop()` vừa command (remove) vừa query (return element) — widely accepted.
- Pragmatic: CQS là guideline, không phải rule tuyệt đối.

**CQS vs CQRS:** CQS ở method level. CQRS (Command Query Responsibility Segregation) ở architecture level — separate read model và write model.

### 🔴 Q: What is the Law of Demeter? `[Senior]`

**A:** Law of Demeter (Principle of Least Knowledge): method chỉ nên gọi method của:
1. Object chính nó (`this`).
2. Parameters được truyền vào.
3. Objects mà nó tạo ra.
4. Direct component objects (fields).

**Vi phạm:**
```
// Method chains expose internal structure
const zip = order.getCustomer().getAddress().getZipCode()
```

**Tuân thủ:**
```
// Order hides internal structure
const zip = order.getShippingZipCode()
```

**Tại sao quan trọng:**
- Giảm coupling: client không phụ thuộc vào internal structure.
- Thay đổi Address class không break Order clients.
- Testable: mock 1 object thay vì chain 3 objects.

**Giới hạn:**
- Data structures (DTOs, value objects) không cần tuân theo — chúng expose data by design.
- Fluent APIs (`builder.setName().setAge().build()`) return `this` → không vi phạm.

---

## 10. Code Quality in Practice — Áp dụng thực tế

### 🟡 Q: How do you set up quality gates in CI? `[Mid]`

**A:** Quality gates là automated checks block merge khi code không đạt tiêu chuẩn:

**Typical CI quality pipeline:**
```text
PR Created/Updated
  │
  ├── Stage 1: Fast Checks (< 1 min)
  │   ├── Lint (ESLint / golangci-lint)
  │   ├── Format check (Prettier --check / gofmt)
  │   └── Type check (tsc --noEmit / go vet)
  │
  ├── Stage 2: Tests (1-5 min)
  │   ├── Unit tests with coverage
  │   └── Coverage threshold check (e.g., >80%)
  │
  ├── Stage 3: Analysis (2-5 min)
  │   ├── SonarQube / CodeClimate scan
  │   ├── Security scan (Snyk, Trivy)
  │   └── License compliance check
  │
  └── Stage 4: Build
      ├── Build production artifact
      └── Integration tests (if applicable)

ALL PASS → Eligible for review + merge
ANY FAIL → Block merge, notify author
```

**Configuration example (GitHub Actions):**
```yaml
# Quality gate checks
- lint-check:
    fail_on: error
    allow_warnings: 5

- test-coverage:
    minimum: 80%
    fail_on_decrease: true

- complexity:
    max_cyclomatic: 15
    max_cognitive: 20

- pr-size:
    max_lines: 500
    exclude: ["*.generated.go", "*.snap"]
```

### 🟡 Q: How do pre-commit hooks improve quality? `[Mid]`

**A:** Pre-commit hooks chạy checks trước khi commit được tạo → catch issues trước khi push lên CI.

**Typical pre-commit setup:**
```text
git commit
  │
  ├── lint-staged: chỉ check files staged
  │   ├── *.ts → eslint --fix + prettier --write
  │   ├── *.go → gofmt + golangci-lint
  │   └── *.css → stylelint --fix
  │
  ├── Type check: tsc --noEmit (TypeScript)
  │
  └── Test: run tests related to changed files
      (jest --findRelatedTests / go test ./changed/...)
```

**Tools:**
- **Husky** (Node.js): Git hooks manager.
- **lint-staged** (Node.js): Chỉ lint staged files (nhanh hơn lint toàn bộ).
- **pre-commit** (Python): Framework-agnostic hook manager.

**Trade-offs:**
| Pro | Con |
|-----|-----|
| Instant feedback | Slow commit nếu hook nặng |
| Giảm CI failures | Developer có thể skip (`--no-verify`) |
| Auto-fix format issues | Setup effort ban đầu |

**Best practice:** Hooks nên chạy <10 giây. Nếu lâu hơn → developer sẽ skip.

### 🔴 Q: How do you build a quality culture vs quality police? `[Senior]`

**A:** Sai lầm phổ biến: coi quality là **enforcement** thay vì **culture**.

**Quality Police (anti-pattern):**
- 1-2 senior "gatekeep" tất cả PRs.
- Strict rules không ai hiểu lý do.
- Blame khi quality drop.
- Developer cảm thấy bị kiểm soát → làm đối phó, không tự giác.

**Quality Culture (target):**
- Mọi người hiểu **why** mỗi practice tồn tại.
- Team cùng define standards (team agreement, not top-down mandate).
- Automate enforcement (linting, CI) → human review focus on design + logic.
- Celebrate quality improvements, không chỉ feature delivery.
- Psychological safety: ok để hỏi "tại sao convention này tồn tại?"

**Cách xây dựng:**

1. **Start with why:**
   - Không nói "phải dùng linter". Nói "linter giúp catch 60% review comments tự động → reviewer focus vào logic".

2. **Make it easy:**
   - Auto-format on save.
   - Pre-configured linting rules (không cần developer tự setup).
   - Good templates cho PR, tests, ADRs.

3. **Make it visible:**
   - Dashboard hiển thị quality metrics trend.
   - Celebrate khi coverage tăng, complexity giảm.

4. **Make it collaborative:**
   - Team retro: discuss quality pain points.
   - Rotate "quality champion" role hàng sprint.
   - Pair programming sessions cho complex code.

### 🟡 Q: What is an incremental improvement strategy? `[Mid]`

**A:** Cải thiện code quality từng bước, không phải "big bang rewrite":

**Strangler Fig Pattern (cho codebase legacy):**
```text
Old System ─────────────────────────────────────>
     \                                     /
      \   New System (gradually grows)    /
       \  ┌─────────────────────────┐   /
        \ │ New module A (week 2)    │  /
         \│ New module B (week 4)    │ /
          │ New module C (week 6)    │/
          │ ...                      │
          └─────────────────────────┘
```

**Practical steps:**
1. **Week 1:** Setup linting + formatting. Auto-fix existing code. No new violations allowed.
2. **Week 2-3:** Add pre-commit hooks. Team adjusts to new workflow.
3. **Week 4-5:** Setup CI quality gates. Start with lenient thresholds.
4. **Week 6-8:** Tighten thresholds gradually (e.g., coverage 50% → 60% → 70%).
5. **Ongoing:** Boy Scout Rule. Review debt register monthly. 20% capacity for improvements.

**Ratchet technique:**
- Set threshold = current value.
- Rule: new code cannot make metric worse.
- Metric can only stay same or improve.
- Over time, quality naturally improves.

### 🔴 Q: How do you measure code quality improvement over time? `[Senior]`

**A:** Metrics cần track theo thời gian để thấy trend:

**Leading indicators (measure effort):**
| Metric | Tool | Target Trend |
|--------|------|-------------|
| Lint violations (new per week) | ESLint, SonarQube | ↓ Decreasing |
| Test coverage (%) | Istanbul, go test | ↑ Increasing |
| Average cyclomatic complexity | SonarQube | ↓ Decreasing |
| PR size (average LOC) | GitHub analytics | ↓ Decreasing |
| Code review turnaround time | GitHub analytics | ↓ Decreasing |
| Dependencies outdated count | Renovate, Dependabot | ↓ Decreasing |

**Lagging indicators (measure outcome):**
| Metric | Tool | Target Trend |
|--------|------|-------------|
| Bug escape rate | JIRA, Linear | ↓ Decreasing |
| Change failure rate | Deployment tracking | ↓ Decreasing |
| Mean time to recovery (MTTR) | Incident tracking | ↓ Decreasing |
| Cycle time (commit → prod) | CI/CD analytics | ↓ Decreasing |
| Developer satisfaction | Survey (quarterly) | ↑ Increasing |
| Time to onboard new developer | Tracking | ↓ Decreasing |

**DORA Metrics (DevOps Research and Assessment):**
4 key metrics đo software delivery performance:
1. **Deployment Frequency**: How often deploy to production.
2. **Lead Time for Changes**: Commit → production.
3. **Change Failure Rate**: % deployments causing incident.
4. **Mean Time to Recovery**: Thời gian restore service.

**Reporting:**
- Monthly quality report cho team.
- Quarterly trend analysis cho leadership.
- Không dùng metric để blame individuals — dùng để identify systemic issues.

**Interview tip:** Nói về DORA metrics và leading vs lagging indicators thể hiện bạn hiểu quality ở system level, không chỉ code level — rất impressive ở Senior interviews.

---

## Quick Reference — Tóm tắt nhanh

### Code Smell → Refactoring Map

| Smell | Primary Refactoring |
|-------|-------------------|
| Long Method | Extract Method |
| Large Class | Extract Class |
| Primitive Obsession | Introduce Value Object |
| Long Parameter List | Introduce Parameter Object |
| Feature Envy | Move Method |
| Duplicate Code | Extract Method / Pull Up Method |
| Switch Statements | Replace Conditional with Polymorphism |
| Message Chains | Hide Delegate |
| Speculative Generality | Collapse Hierarchy / Inline Class |
| Dead Code | Delete it |

### Clean Code Checklist

```text
[ ] Functions < 20 lines
[ ] Meaningful names (intention-revealing)
[ ] One level of abstraction per function
[ ] No magic numbers
[ ] DRY — no copy-paste logic
[ ] YAGNI — no speculative features
[ ] Error handling is explicit
[ ] Tests cover happy path + edge cases
[ ] Self-documenting code (comments explain "why")
[ ] Boy Scout Rule applied
```

### Quality Maturity Model

| Level | Description | Practices |
|-------|------------|-----------|
| **1 — Ad hoc** | No standards | Nothing automated |
| **2 — Repeatable** | Basic linting | ESLint/gofmt, manual reviews |
| **3 — Defined** | CI quality gates | Automated tests, coverage thresholds, PR templates |
| **4 — Managed** | Metrics-driven | DORA metrics, quality dashboards, debt register |
| **5 — Optimizing** | Continuous improvement | Quality culture, automated recommendations, predictive analysis |

---

> **Liên kết tiếp theo:**
> - SOLID & Design Patterns: `docs/shared/05-software-engineering/01-solid-and-design-patterns.md`
> - SDLC & Practices: `docs/shared/05-software-engineering/03-sdlc-and-practices.md`
> - Testing Theory: `docs/shared/05-software-engineering/04-testing-theory.md`
