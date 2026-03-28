# Code Quality and Review — Chất lượng code và Review code

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)
>
> - `docs/shared/05-software-engineering/01-solid-and-design-patterns.md`
> - `docs/shared/05-software-engineering/03-sdlc-and-practices.md`
> - `docs/shared/05-software-engineering/04-testing-theory.md`

---

## Real-World Scenario / Tình Huống Thực Tế

**Grab code review culture (thực tế):** Một senior developer approve PR chứa `db.Exec("DELETE FROM orders WHERE id=" + userInput)` — không nhận ra SQL injection vì review quá nhanh (60 PRs/week). Sau security audit, team triển khai review checklist bắt buộc: correctness, security, performance, tests. Review time tăng 20% nhưng production security incidents giảm 80%.

**Bài học:** Code review không phải "policing" — nó là knowledge sharing + quality gate. Reviewer phải biết _gì cần tìm_, không chỉ _nhìn xem code có đẹp không_.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Code review giống biên tập bài báo: editor không chỉ sửa chính tả (style) mà còn check factual accuracy (correctness), logical flow (design), và legal issues (security). Reviewer là "first user" của code — nếu code khó hiểu với reviewer, nó sẽ khó maintain với team.

**Why it matters:** Behavioral interviews thường hỏi "How do you handle disagreement in code review?" — biết principles của good review giúp trả lời authentic, không chỉ là câu template.

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

> 🧠 **Memory Hook:** Chất lượng code = ngôi nhà sạch sẽ — nhà gọn thì tìm chìa khóa 1 giây, nhà bừa thì tìm 20 phút!

**Tại sao tồn tại? / Why does this exist?**

Code quality measures exist because software that works today but can't be changed tomorrow is a liability, not an asset. → **Why?** Because requirements always evolve, and unmaintainable code makes every new change exponentially expensive and risky. → **Why?** Because code is read ~10× more than it's written—optimizing for readability and maintainability pays compound dividends across the entire lifetime of a product.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng hai ngôi nhà: một nhà ngăn nắp, đồ đạc có chỗ cố định — bạn cần cái gì là biết ngay ở đâu. Một nhà bừa bộn — tìm chìa khóa mất 20 phút. Code chất lượng cao giống ngôi nhà gọn: dev mới vào biết ngay logic ở file nào, hàm nào xử lý việc gì. Code chất lượng thấp giống nhà bừa: đọc mãi vẫn không hiểu, sửa 1 chỗ vô tình phá 3 chỗ khác.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
4 Trụ Cột Code Quality:

1. READABILITY     → Đặt tên rõ, hàm ngắn      → Dev đọc hiểu nhanh → ít thời gian parse
2. MAINTAINABILITY → Module hóa, ít coupling    → Sửa 1 chỗ, không phá 10 chỗ khác
3. RELIABILITY     → Handle edge cases + tests  → Ít bug production, đáng tin cậy
4. EFFICIENCY      → Đúng algorithm/data struct  → Tài nguyên hợp lý, không lãng phí

Internal Quality ↑ → Dễ thay đổi → Deliver nhanh → External Quality ↑
Internal Quality ↓ → Khó thay đổi → Chậm + bug → External Quality xấu dần
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Code "rất clean" nhưng logic sai → external quality (user experience) vẫn tệ như thường
- Over-engineering (tạo abstractions không cần thiết) là một dạng quality problem, không phải quality tốt
- Legacy code "xấu" theo chuẩn hiện tại nhưng ổn định và không cần thay đổi → đừng refactor vì thẩm mỹ
- Startup early-stage: chấp nhận internal quality thấp hơn để validate market — nhưng phải có plan trả nợ

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                               | Đúng là                                                            |
| ----------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------ |
| "Code chạy được là đủ"              | Ignores maintainability — change #2 sẽ rất chậm và đắt    | Cân bằng external (working) + internal (maintainable) quality      |
| "Clean code = comment nhiều vào"    | Comments giải thích "what" là smell — code đã làm điều đó | Clean code = self-documenting names + small functions + types      |
| "Dành thời gian quality khi có hạn" | Debt compound như lãi suất — chờ càng lâu càng đắt        | Quality là continuous practice, không phải phase riêng cuối sprint |

**🎯 Interview Pattern:**

- Khi thấy: câu hỏi "what is code quality?" → Nhớ đến: 4 trụ cột + internal vs external distinction → Mở đầu: "Code quality là tập hợp các thuộc tính giúp cả team đọc, sửa và mở rộng code an toàn — quan trọng nhất là maintainability vì code đọc nhiều hơn viết gấp 10 lần."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [SOLID & Design Patterns](./01-solid-and-design-patterns.md)
- ➡️ Để hiểu tiếp: [Code Smells](#2-code-smells--mùi-code)

### 🟢 Q: What is code quality? `[Junior]`

**A:** Code quality là tập hợp các thuộc tính giúp code dễ đọc, dễ bảo trì, đáng tin cậy và hiệu quả. Không chỉ là "chạy đúng" — code chất lượng cao là code mà **cả team có thể hiểu, sửa đổi và mở rộng an toàn**.

**4 trụ cột chính:**

| Thuộc tính          | Mô tả                     | Ví dụ vi phạm                        |
| ------------------- | ------------------------- | ------------------------------------ |
| **Readability**     | Người khác đọc hiểu nhanh | Biến tên `x`, `tmp`, hàm 200 dòng    |
| **Maintainability** | Dễ sửa đổi, thêm feature  | Sửa 1 chỗ phải đổi 10 file           |
| **Reliability**     | Chạy đúng, ít bug         | Không handle edge case, null pointer |
| **Efficiency**      | Dùng tài nguyên hợp lý    | O(n³) khi có thể O(n log n)          |

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

> 🧠 **Memory Hook:** Code smell = mùi thức ăn hỏng trong tủ lạnh — chưa biết cái gì thối, nhưng biết phải kiểm tra ngay!

**Tại sao tồn tại? / Why does this exist?**

Code smells exist as heuristics because software design problems rarely manifest as immediate failures—they accumulate silently until change becomes painful. → **Why?** Because as code evolves without refactoring, coupling increases, cohesion drops, and every new change takes longer. → **Why?** At root: humans write code with full context in their head, but future readers lack that context—smells are the signals that the context gap has grown dangerous enough to act on.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Khi mở tủ lạnh và ngửi thấy mùi lạ—bạn chưa biết chính xác thứ gì đang hỏng, nhưng biết ngay là có vấn đề cần tìm hiểu. Code smell cũng vậy: không phải lỗi xác nhận (code vẫn chạy được), nhưng là dấu hiệu cảnh báo rằng cấu trúc code đang có vấn đề bên dưới. Ví dụ: hàm 500 dòng không chắc là sai—nhưng nó "có mùi" rằng có quá nhiều việc đang xảy ra ở đó, và tương lai sẽ rất khó sửa.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
5 Nhóm Code Smell (Fowler's Taxonomy):

┌─────────────────┬─────────────────────────────────────────────────────┐
│ Nhóm            │ Smell tiêu biểu                                     │
├─────────────────┼─────────────────────────────────────────────────────┤
│ 1. Bloaters     │ Long Method, God Class, Primitive Obsession,         │
│   (quá lớn)    │ Long Param List, Data Clumps                         │
├─────────────────┼─────────────────────────────────────────────────────┤
│ 2. OO Abusers   │ Switch Statements, Refused Bequest,                  │
│   (OOP sai)    │ Alternative Classes w/ Different Interfaces          │
├─────────────────┼─────────────────────────────────────────────────────┤
│ 3. Change Prev. │ Divergent Change (1 class thay đổi vì nhiều lý do), │
│   (khó đổi)   │ Shotgun Surgery (1 thay đổi → sửa nhiều file)        │
├─────────────────┼─────────────────────────────────────────────────────┤
│ 4. Dispensables │ Dead Code, Duplicate Code, Lazy Class,               │
│   (thừa)      │ Speculative Generality                                │
├─────────────────┼─────────────────────────────────────────────────────┤
│ 5. Couplers     │ Feature Envy, Inappropriate Intimacy, Middle Man     │
│   (phụ thuộc) │                                                       │
└─────────────────┴─────────────────────────────────────────────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Một số "smell" acceptable trong context đặc biệt: parser/compiler code có switch lớn là bình thường
- Smell detection cần judgment — đừng refactor máy móc khi không có test coverage
- Không phải tất cả "dài" đều là smell: migration script 1000 dòng sequential có thể hoàn toàn ổn
- Team conventions ảnh hưởng: "30 dòng/hàm = sạch" ở team này có thể là smell ở team khác

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                     | Tại sao sai                                                 | Đúng là                                                             |
| ------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| Refactor ngay khi thấy smell, không có test | Không có test → refactor tạo regression bugs mới            | Viết test để capture current behavior trước, rồi mới refactor       |
| Chỉ nhớ 1-2 smell quen thuộc                | Miss các smell tinh vi hơn như Divergent Change, Middle Man | Học theo 5 nhóm — mỗi nhóm có pattern riêng để nhận diện            |
| Coi smell là bug xác nhận → panic fix       | Smell là dấu hiệu, không phải lỗi chắc chắn                 | Đánh giá: impact là gì, change frequency thế nào, có đáng refactor? |

**🎯 Interview Pattern:**

- Khi thấy: "name some code smells" → Nhớ đến: 5 nhóm (Bloaters, OO Abusers, Change Preventers, Dispensables, Couplers) → Mở đầu: "Code smells thuộc 5 nhóm chính — tôi hay gặp nhất là Bloaters (Long Method, God Class) và Couplers (Feature Envy) trong codebase thực tế."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [What is Code Quality](#1-what-is-code-quality--chất-lượng-code-là-gì)
- ➡️ Để hiểu tiếp: [Refactoring Catalog](#3-refactoring-catalog--danh-mục-tái-cấu-trúc)

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

> 🧠 **Memory Hook:** Refactoring = dọn dẹp nhà — chuyển đồ đạc cho gọn, chứ không mua thêm đồ mới hay phá tường!

**Tại sao tồn tại? / Why does this exist?**

Refactoring catalogs exist because "improve the code" is too vague to be actionable—developers need named, repeatable techniques with clear preconditions. → **Why?** Because naming a technique (Extract Method, Replace Conditional with Polymorphism) creates shared vocabulary enabling precise team communication about _what_ to change and _why_. → **Why?** At root: code design is a craft accumulated through pattern recognition—catalogs externalize decades of collective expertise into learnable, transferable moves that anyone can apply safely.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Dọn nhà không phải mua đồ mới hay phá tường—là sắp xếp lại những gì đã có cho gọn gàng hơn. Refactoring cũng vậy: không thêm feature, không thay đổi kết quả cuối—chỉ tái tổ chức code để dễ đọc và dễ sửa hơn. "Extract Method" giống tách tủ quần áo lộn xộn thành nhiều ngăn có dán nhãn—bên ngoài nhà trông y chang, nhưng bên trong ngăn nắp hẳn.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Catalog theo 4 mục đích:

┌──────────────────────────────┬──────────────────────────────┐
│ COMPOSE METHODS               │ ORGANIZE DATA                 │
│ • Extract Method              │ • Replace Primitive w/ Object │
│ • Inline Method               │ • Introduce Value Object      │
│ • Extract Variable            │ • Change Value to Reference   │
├──────────────────────────────┼──────────────────────────────┤
│ MOVE FEATURES                 │ SIMPLIFY CONDITIONALS         │
│ • Move Method / Field         │ • Decompose Conditional       │
│ • Extract Class               │ • Replace Conditional w/      │
│ • Inline Class                │   Polymorphism                │
│ • Hide Delegate               │ • Introduce Guard Clause      │
└──────────────────────────────┴──────────────────────────────┘

Quy trình an toàn:
[Test Coverage ✓] → [Pick 1 technique] → [Apply small step]
      → [Run tests ✓] → [Commit] → [Repeat]
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Phải có test coverage trước khi refactor—không có test = thay đổi mà không biết có break gì không
- Refactor từng bước nhỏ, commit thường xuyên để dễ rollback khi phát hiện vấn đề
- Đừng refactor và thêm feature cùng lúc—2 việc riêng, khó review và khó xác định nguồn gốc bug
- IDE refactoring tools (rename, extract) an toàn hơn manual vì có AST awareness

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                                   | Đúng là                                                        |
| ----------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| Refactor + thêm feature cùng 1 PR   | Khó review, khó biết bug từ đâu: refactor hay feature?        | 2 PR riêng: refactor trước (behavior unchanged), feature sau   |
| "Refactor = viết lại từ đầu"        | Rewrite mất domain knowledge, rủi ro cao, tốn nhiều thời gian | Refactor từng bước nhỏ, không đổi observable behavior          |
| Refactor khi không có test coverage | Không biết liệu behavior có bị thay đổi hay không             | Test first: capture current behavior → refactor → verify green |

**🎯 Interview Pattern:**

- Khi thấy: "how do you refactor safely?" → Nhớ đến: test first + small steps + named catalog techniques → Mở đầu: "Tôi luôn đảm bảo có test coverage trước, sau đó dùng từng kỹ thuật cụ thể như Extract Method hay Move Method, chạy test sau mỗi bước nhỏ."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Code Smells](#2-code-smells--mùi-code)
- ➡️ Để hiểu tiếp: [Code Metrics](#4-code-metrics--các-chỉ-số-đo-lường-code)

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

> 🧠 **Memory Hook:** Code metrics = cân và nhiệt kế — không chữa bệnh được, nhưng giúp bác sĩ biết bệnh nhân đang ổn hay không!

**Tại sao tồn tại? / Why does this exist?**

Code metrics exist because intuition doesn't scale—you can't "feel" the quality of 500,000 lines of code across 50 modules. → **Why?** Because teams need objective, comparable measurements to track quality trends over time and justify data-driven refactoring decisions to non-technical stakeholders. → **Why?** At root: without metrics, quality decisions become political ("I think the code is fine") rather than empirical ("complexity increased 40% this quarter, correlating with a 30% rise in bug rate").

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bác sĩ không chỉ nhìn mặt bệnh nhân để chẩn đoán—họ dùng nhiệt kế, máy đo huyết áp, xét nghiệm máu. Những con số này không "chữa bệnh" nhưng phát hiện vấn đề sớm và theo dõi tiến triển. Code metrics y vậy: Cyclomatic Complexity không tự sửa bug, nhưng cho bạn biết "hàm này có 15 nhánh thực thi, cần tối thiểu 15 test cases—đang ở mức nguy hiểm." Metric là triệu chứng, không phải chẩn đoán.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Metric           Đo gì                     Ngưỡng thực tế
─────────────────────────────────────────────────────────────
Cyclomatic CC    Số đường thực thi độc lập  1-10: OK
                 = số decision points + 1   11-25: cảnh báo
                                            >25: nguy hiểm

Cognitive CC     Độ khó đọc/hiểu của người  <15: OK
                 (penalty tăng theo nesting) >15: nên refactor

LOC/Function     Kích thước hàm             <30: OK
                                            >50: cần extract

Coupling (Ce)    Phụ thuộc ra module ngoài  Thấp = stable
Cohesion (LCOM)  Các method có liên quan?   Cao = cohesive

Test Coverage    % code được test           <60%: rủi ro cao
                                            >80%: healthy
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Metric thấp ≠ code tốt: đạt CC thấp bằng cách tách hàm trivial vô nghĩa — metric xanh, quality vẫn tệ
- Metric cao không phải lúc nào cũng xấu: parser/compiler code inherently complex, CC cao là bình thường
- Goodhart's Law: nếu team bị đánh giá theo metric → họ optimize metric, không phải chất lượng thật
- Cross-language comparison vô nghĩa: LOC Java vs Python không so sánh được do verbosity khác nhau

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                  | Đúng là                                                       |
| -------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| Dùng LOC/ngày để đo năng suất                | Khuyến khích verbose code, penalize refactoring và xóa code  | Dùng cycle time, deployment frequency, bug escape rate        |
| Target CC = 0 cho mọi hàm                    | Một số logic inherently complex (state machine, parser)      | Set ngưỡng hợp lý và review exception với business context    |
| Chỉ nhìn coverage % để đánh giá test quality | 100% coverage không đảm bảo đúng logic hay assertion quality | Coverage + mutation testing + review assertion meaningfulness |

**🎯 Interview Pattern:**

- Khi thấy: "how do you measure code quality?" → Nhớ đến: Cyclomatic/Cognitive Complexity + coupling/cohesion + coverage → Mở đầu: "Tôi dùng Cyclomatic Complexity để detect hard-to-test code, coupling metrics để detect fragile dependencies, và coverage % kết hợp với mutation testing..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Refactoring Catalog](#3-refactoring-catalog--danh-mục-tái-cấu-trúc)
- ➡️ Để hiểu tiếp: [Static Analysis & Linting](#5-static-analysis--linting--phân-tích-tĩnh)

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

| Loại                       | Mô tả                                 | Mức độ                                                      |
| -------------------------- | ------------------------------------- | ----------------------------------------------------------- |
| **Afferent Coupling (Ca)** | Số module phụ thuộc VÀO module này    | Ca cao → module quan trọng, thay đổi rủi ro lớn             |
| **Efferent Coupling (Ce)** | Số module mà module này PHỤ THUỘC vào | Ce cao → module phụ thuộc nhiều, fragile                    |
| **Instability (I)**        | I = Ce / (Ca + Ce)                    | I = 0: stable (nhiều module phụ thuộc vào); I = 1: unstable |

**Cohesion — Mức độ liên kết trong nội bộ module:**

| Loại                       | Mô tả                                             |
| -------------------------- | ------------------------------------------------- |
| **Functional** (tốt nhất)  | Mọi phần đóng góp vào 1 task duy nhất             |
| **Sequential**             | Output của phần này là input phần kia             |
| **Communicational**        | Các phần dùng chung data                          |
| **Temporal**               | Các phần chạy cùng thời điểm (init code)          |
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
- Halstead Volume V = N \* log2(n), với N = total operators+operands, n = unique operators+operands.
- Ít dùng trực tiếp trong thực tế, nhưng là input cho Maintainability Index.

### 🟡 Q: What are practical thresholds for code metrics? `[Mid]`

**A:** Bảng ngưỡng thực tế để config cho tool:

| Metric                           | Good | Warning | Bad  | Tool                     |
| -------------------------------- | ---- | ------- | ---- | ------------------------ |
| Cyclomatic Complexity / function | 1-10 | 11-20   | >20  | ESLint, golangci-lint    |
| Cognitive Complexity / function  | 1-15 | 16-25   | >25  | SonarQube                |
| Function length (LOC)            | <30  | 30-60   | >60  | ESLint, custom           |
| File length (LOC)                | <300 | 300-500 | >500 | Custom                   |
| Parameter count                  | 1-3  | 4-5     | >5   | ESLint, golangci-lint    |
| Nesting depth                    | 1-3  | 4-5     | >5   | ESLint                   |
| Class method count               | <15  | 15-25   | >25  | SonarQube                |
| Test coverage                    | >80% | 60-80%  | <60% | Istanbul, go test        |
| Maintainability Index            | >20  | 10-20   | <10  | Visual Studio, SonarQube |

**Lưu ý:** Đây là guidelines, không phải rules cứng. Context matters — một parser function có CC = 25 có thể acceptable nếu logic inherently complex.

---

## 5. Static Analysis & Linting — Phân tích tĩnh

> 🧠 **Memory Hook:** Static analysis = kiểm tra chính tả tự động trong Word — bắt lỗi trước khi bạn nộp bài, không cần ai đọc lại!

**Tại sao tồn tại? / Why does this exist?**

Static analysis exists because humans are inconsistent reviewers—we miss the same class of bugs repeatedly under cognitive load and time pressure. → **Why?** Because code review is expensive human work, and reviewers can't reliably catch semantic bugs AND style violations AND security patterns simultaneously in a single pass. → **Why?** At root: automating what can be automated (pattern matching, type checking, format enforcement) frees human reviewers to focus on what requires genuine human judgment—design quality, business logic correctness, and architectural trade-offs.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Microsoft Word gạch đỏ dưới chữ viết sai trước khi bạn in ra—không cần đọc lại toàn bộ bài từng chữ. Static analysis linter hoạt động y hệt: chạy tự động, tìm các pattern nguy hiểm (`if (x = 5)` thay vì `if (x === 5)`), báo ngay lập tức trong editor hoặc CI trước khi code lên production. Không cần chờ reviewer, không cần runtime để crash—lỗi bị bắt ngay từ khi code còn là text.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Source Code
    │
    ▼
[Lexer] → Tokens: if, (, x, =, 5, ), {, ...
    │
    ▼
[Parser] → AST (Abstract Syntax Tree):
    │         IfStatement
    │            └── condition: AssignmentExpression ← suspect!
    │                   ├── left: Identifier(x)
    │                   └── right: Literal(5)
    ▼
[Analysis Rules] → Walk AST, match patterns:
    │   • eqeqeq: "==" không cho phép → suggest "==="
    │   • no-unused-vars: biến khai báo nhưng không dùng
    │   • max-complexity: CC tính được = 8, ngưỡng = 10 → OK
    ▼
[Report / Auto-fix] → Warning/Error + suggestion + auto-fix patch
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- False positives: rule bắt nhầm → team suppress → mất protection dần dần
- Quá nhiều rules bật → warning fatigue → developer ignore tất cả warnings
- Linting chỉ catch static patterns—không phát hiện runtime logic errors hay race conditions
- Formatter và linter có thể conflict về style (Prettier vs ESLint formatting rules)—cần configure để không override nhau

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                                     | Đúng là                                                          |
| ---------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| Bật hết rules mặc định cùng một lúc      | Tạo warning fatigue ngay ngày đầu → team disable linter         | Bắt đầu với `recommended` ruleset, thêm dần theo learning        |
| Chỉ chạy lint locally, không trong CI    | Dev quên chạy → inconsistency → CI surprise fail                | Pre-commit hook + CI gate—không thể merge khi lint fail          |
| Suppress warnings không giải thích lý do | Mất protection, không biết tại sao suppress → không remove được | `// eslint-disable-next-line reason: [lý do cụ thể + JIRA link]` |

**🎯 Interview Pattern:**

- Khi thấy: "how do you enforce coding standards?" → Nhớ đến: linter + formatter + type checker trong CI pipeline → Mở đầu: "Chúng tôi dùng linter trong CI để enforce standards tự động, formatter để loại bỏ style debates trong review, và type checker cho compile-time safety."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Code Metrics](#4-code-metrics--các-chỉ-số-đo-lường-code)
- ➡️ Để hiểu tiếp: [Code Review Best Practices](#6-code-review-best-practices--thực-hành-review-code)

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

| Tool             | Mục đích                                                         | Ví dụ                                  | Scope            |
| ---------------- | ---------------------------------------------------------------- | -------------------------------------- | ---------------- |
| **Linter**       | Phát hiện bugs, bad patterns, style issues                       | ESLint, golangci-lint, Pylint          | Logic + style    |
| **Formatter**    | Enforce formatting nhất quán (spacing, indentation, line breaks) | Prettier, gofmt, Black                 | Style only       |
| **Type Checker** | Kiểm tra type safety tại compile time                            | TypeScript compiler, mypy, Go compiler | Type correctness |

**Mối quan hệ:**

- Formatter: "Code trông thế nào" → **không bao giờ thay đổi logic**.
- Linter: "Code có vấn đề gì không" → có thể suggest logic changes.
- Type checker: "Types có khớp không" → compiler-level safety.

**Best practice:** Dùng cả 3 cùng nhau. Formatter chạy trước (hoặc on-save), linter + type checker chạy trong CI.

### 🟡 Q: What are common linting rules and why do they exist? `[Mid]`

**A:** Mỗi rule tồn tại vì một lý do thực tế:

| Rule                       | Lý do tồn tại                                            |
| -------------------------- | -------------------------------------------------------- |
| `no-unused-vars`           | Dead code gây confusion; indicate incomplete refactoring |
| `no-implicit-coercion`     | `!!x` vs `Boolean(x)` — explicit rõ ràng hơn             |
| `eqeqeq` (strict equality) | `==` có coercion rules phức tạp, dễ gây bug              |
| `no-var`                   | `var` có hoisting quirks, `let/const` an toàn hơn        |
| `max-lines-per-function`   | Hàm dài → khó hiểu, khó test                             |
| `max-depth`                | Nesting sâu → cognitive load cao                         |
| `no-magic-numbers`         | Literal numbers không có context                         |
| `exhaustive-deps` (React)  | Missing dependency trong useEffect → stale closure bug   |
| `errcheck` (Go)            | Unchecked errors → silent failures                       |
| `shadow` (Go)              | Variable shadowing → unexpected behavior                 |

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

> 🧠 **Memory Hook:** Code review = giáo viên chấm bài — không phải trừng phạt học sinh, mà để giúp học sinh tiến bộ và tránh sai lầm trước khi nộp!

**Tại sao tồn tại? / Why does this exist?**

Code review exists because no developer—regardless of seniority—reliably catches all their own bugs and design flaws. → **Why?** Because the author has deep cognitive bias: they know what the code is _supposed_ to do, making it structurally difficult to see what it _actually_ does wrong or misses. → **Why?** At root: fresh eyes plus domain knowledge from a reviewer creates the cross-check that catches individual blind spots before they reach production, while simultaneously spreading knowledge across the team.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Khi học sinh viết bài kiểm tra, giáo viên chấm lại không phải vì nghĩ học sinh kém—mà vì ai cũng có điểm mù. Code review cũng vậy: developer senior nhất vẫn cần người khác đọc lại, vì người viết code thường "nhìn thấy" những gì họ muốn viết, không phải những gì thực sự có trong code. Reviewer mang "con mắt mới" phát hiện lỗi tác giả bỏ qua, đồng thời học được kỹ thuật mới từ cách tiếp cận của author.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Review Priorities — Theo tầng quan trọng (Tier 1 = quan trọng nhất):

Tier 1: CORRECTNESS  ────────────────────────────────────── CRITICAL
  • Logic đúng? Edge cases handled?
  • Error handling: null, empty, network failures
  • Concurrency: race conditions, deadlocks

Tier 2: DESIGN  ─────────────────────────────────────────── HIGH
  • Đúng abstraction? Vi phạm SOLID?
  • Unnecessary coupling? Fit vào architecture?

Tier 3: READABILITY  ────────────────────────────────────── MEDIUM
  • Naming rõ ý đồ? Self-documenting?

Tier 4: SECURITY  ───────────────────────────────────────── HIGH (context)
  • Input validation? SQL injection? Auth checks?

Tier 5: PERFORMANCE  ────────────────────────────────────── MEDIUM
  • N+1 queries? Missing pagination?

Tier 6: TESTS  ──────────────────────────────────────────── MEDIUM
  • Edge cases tested? Tests readable?
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- PR quá lớn (>500 dòng) → reviewer mệt mỏi → review quality giảm → break thành nhiều PR nhỏ hơn
- Approve vì áp lực thời gian hoặc sợ xung đột → ship code xấu → bugs production → tốn time hơn
- Review tập trung style (indent, spacing) thay vì substance → lãng phí cả reviewer lẫn author time
- Ego-driven feedback ("cách của tôi tốt hơn") → toxic culture → team sợ nhận feedback

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                   | Tại sao sai                                                   | Đúng là                                                           |
| ----------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| Comment "fix this" không giải thích lý do | Author không hiểu why → không học → implement sai alternative | "Fix this because [lý do]. Suggestion: [code example or link]"    |
| Review style thay vì substance            | Lãng phí reviewer time—linter và formatter làm được tự động   | Dùng linter cho style; review tập trung vào correctness và design |
| Approve vì sợ làm chậm team               | Ship code xấu → bug production → tốn 10x time để fix          | Block với lý do cụ thể; pair review nếu urgent và complex         |

**🎯 Interview Pattern:**

- Khi thấy: "how do you do code reviews?" hay "how do you handle disagreements in review?" → Nhớ đến: Tier 1-6 checklist + comment on code not person → Mở đầu: "Tôi review theo thứ tự ưu tiên: correctness trước, design, rồi readability. Style tôi để linter handle. Feedback tôi frame theo code không phải người viết."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Static Analysis & Linting](#5-static-analysis--linting--phân-tích-tĩnh)
- ➡️ Để hiểu tiếp: [Technical Debt](#7-technical-debt--nợ-kỹ-thuật)

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

> 🧠 **Memory Hook:** Technical debt = nợ thẻ tín dụng — dùng trước trả sau, nhưng lãi compound rất nhanh nếu quên trả!

**Tại sao tồn tại? / Why does this exist?**

Technical debt exists as a concept because software teams routinely make trade-offs between short-term delivery speed and long-term code health—and they need a shared language to discuss those trade-offs with non-technical stakeholders. → **Why?** Because business pressures (deadlines, investor demos, competitive threats) create incentives to cut corners that are individually rational but collectively destructive over time. → **Why?** At root: unlike a bridge built with substandard materials (which visibly sags), bad code doesn't physically fail—its costs are invisible to non-technical leadership until the debt compounds into a productivity crisis.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Mua điện thoại trả góp $50/tháng—cảm giác nhẹ nhàng ban đầu, nhưng nếu quên trả, lãi compound: tháng sau $60, tháng sau $75, rồi $100... Technical debt y hệt: viết code nhanh kiểu tắt (vay tiền) cảm giác như đang tiến nhanh, nhưng mỗi lần sửa code sau tốn thêm công (trả lãi). Không trả nợ gốc, lãi chồng lãi đến lúc team "phá sản kỹ thuật"—dành toàn bộ thời gian fix bugs thay vì làm feature mới.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Technical Debt Quadrant (Martin Fowler):

                  Reckless               Prudent
              ┌──────────────────┬──────────────────────┐
  Deliberate  │ "No time for     │ "We must ship now    │
  (chủ động)  │  design"         │  and deal with it"   │
              │ → Tệ nhất        │ → Chấp nhận được     │
              │ → Không justify   │   nếu có plan trả    │
              ├──────────────────┼──────────────────────┤
  Inadvertent │ "What's          │ "Now we know how     │
  (vô ý)      │  layering?"      │  we should've done"  │
              │ → Cần upskill    │ → Tự nhiên nhất      │
              │ → Mentoring      │   inevitable learning │
              └──────────────────┴──────────────────────┘

Interest Rate = (effort per change) × (change frequency)
Debt trong hot path (thay đổi hàng tuần) → lãi suất RẤT CAO
Debt trong stable path (ít thay đổi)    → lãi suất thấp, có thể để yên
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Không phải mọi debt đều xấu: Prudent + Deliberate debt với plan rõ ràng là business decision hợp lý
- Debt trong code ít thay đổi có interest thấp—đừng refactor vì thẩm mỹ nếu không tăng velocity
- Debt register cần prioritize theo interest rate (frequency × cost), không phải abstract severity
- Rewriting from scratch thường không trả hết debt—thường tạo một loại debt mới khác loại

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                   | Tại sao sai                                               | Đúng là                                                                          |
| ----------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Không track debt ở bất kỳ đâu             | Debt "vô hình" → không bao giờ được ưu tiên trong sprint  | Maintain debt register với effort estimate + business impact                     |
| "Sẽ refactor sau" mà không có plan cụ thể | "Sau" không bao giờ đến khi feature backlog dài           | Đặt lịch cụ thể: "Sprint N+2, 20% capacity cho module X"                         |
| Pitch debt payback theo thẩm mỹ kỹ thuật  | Management không quan tâm "code đẹp" hay "best practices" | Quantify: "Module này gây 30% bug, 2 sprint refactor → tiết kiệm 1 sprint/month" |

**🎯 Interview Pattern:**

- Khi thấy: "how do you handle technical debt?" → Nhớ đến: Fowler's quadrant + debt register + quantified business impact → Mở đầu: "Tôi phân loại debt theo quadrant của Fowler—deliberate vs inadvertent—track trong debt register, và pitch refactoring bằng impact cụ thể lên velocity và bug rate."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Code Review Best Practices](#6-code-review-best-practices--thực-hành-review-code)
- ➡️ Để hiểu tiếp: [Documentation as Code Quality](#8-documentation-as-code-quality--tài-liệu-như-chất-lượng)

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

| Debt              | Interest per change                                   |
| ----------------- | ----------------------------------------------------- |
| No tests          | +2h manual testing mỗi deploy; unexpected regressions |
| Monolith coupling | +1h tìm hiểu side effects mỗi PR                      |
| No CI/CD          | +30m build + deploy manual mỗi release                |
| Outdated docs     | +1h hỏi đồng nghiệp mỗi lần onboard feature area      |
| Copy-pasted logic | +1h sửa bug ở N chỗ thay vì 1 chỗ                     |

**Compound interest:** Debt tạo thêm debt. Monolith coupling → harder to test → less tests → more bugs → more hotfixes → more coupling.

**Interest rate không cố định:** Debt ở code path ít thay đổi → interest thấp. Debt ở hot path (code thay đổi hàng tuần) → interest rất cao. Ưu tiên trả debt ở hot path trước.

---

## 8. Documentation as Code Quality — Tài liệu như chất lượng

> 🧠 **Memory Hook:** Documentation = bản đồ địa hình cho người sau — không có bản đồ, người leo núi mới phải tự khám phá lại từng con đường nguy hiểm!

**Tại sao tồn tại? / Why does this exist?**

Documentation as a quality practice exists because code describes HOW a system works, but almost never WHY it was built that way. → **Why?** Because design decisions carry context—constraints, alternatives considered, trade-offs accepted—that evaporates when the original developer leaves, switches teams, or simply forgets. → **Why?** At root: software systems outlive the cognitive maps of their creators, and documentation is the only mechanism by which institutional knowledge survives team turnover and organizational memory fades.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bản đồ địa hình giúp người leo núi sau không cần tự mình khám phá lại từng con đường—họ thấy ngay chỗ nào có suối, chỗ nào vách đá nguy hiểm. Tài liệu code cũng vậy: dev mới không cần hỏi "tại sao đoạn này lại viết thế này?" mỗi 5 phút—họ đọc ADR và thấy ngay: "À, lúc đó team đã cân nhắc PostgreSQL vs DynamoDB, chọn Dynamo vì traffic unpredictable và không cần joins." Bản đồ tốt tiết kiệm hàng giờ chạy vòng vòng.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Documentation Pyramid (từ gần code → xa code nhất):

┌─────────────────────────────────────────────────────┐
│ Level 4: External Docs (README, Wiki, runbooks)     │ ← Users, PMs, Ops
├─────────────────────────────────────────────────────┤
│ Level 3: Architecture (ADRs, system diagrams)       │ ← New team members
├─────────────────────────────────────────────────────┤
│ Level 2: API Docs (JSDoc, OpenAPI, type signatures) │ ← Integrators, consumers
├─────────────────────────────────────────────────────┤
│ Level 1: Self-documenting code                      │ ← All devs (daily)
│ (good names, small functions, types, guard clauses) │
└─────────────────────────────────────────────────────┘

Rule: Code giải thích WHAT → Comments giải thích WHY
ADR format: Context → Decision → Alternatives considered → Consequences
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Docs drift: code thay đổi nhưng docs không update → docs sai còn tệ hơn không có docs (misdirects)
- Over-documentation: giải thích "what" thay vì "why" → noise, tốn time viết và đọc mà không có giá trị
- Runbook thiếu → incident kéo dài vì engineer on-call không biết cách rollback hay escalate
- API docs sai → consumers viết code dựa theo docs sai → bugs ở phía client mà team không hay biết

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                                                | Đúng là                                                                    |
| --------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Viết docs sau khi xong code (hoặc không viết) | Context fresh nhất khi đang code—delay → forget → docs vĩnh viễn không có  | Viết ADR trước implement; code comments trong lúc code khi context rõ nhất |
| Comment giải thích "what" thay vì "why"       | Code đã giải thích "what"—comment trùng lặp là noise và maintenance burden | Comment cho business reason, known workaround, performance constraint      |
| README không update khi code thay đổi         | Docs sai hướng dẫn người mới đi sai, mất thêm thời gian tự debug           | Coi docs update là part của Definition of Done và PR checklist             |

**🎯 Interview Pattern:**

- Khi thấy: "how do you document your code?" → Nhớ đến: documentation pyramid + self-documenting code + ADRs cho WHY → Mở đầu: "Tôi ưu tiên self-documenting code ở tầng nền: good names, small functions, types. Sau đó ADR cho architecture decisions vì chúng capture context mà code không capture được."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Technical Debt](#7-technical-debt--nợ-kỹ-thuật)
- ➡️ Để hiểu tiếp: [Clean Code Principles](#9-clean-code-principles--nguyên-tắc-clean-code)

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

> 🧠 **Memory Hook:** Clean code = bếp nhà hàng 5 sao — mọi dụng cụ có chỗ, đầu bếp nào vào cũng làm được ngay mà không cần hỏi!

**Tại sao tồn tại? / Why does this exist?**

Clean Code principles exist because "write good code" is too subjective to be teachable—developers need concrete, actionable rules they can apply consistently. → **Why?** Because code style and structure directly impact reading speed and comprehension, and the average developer reads code ~10× more than they write it, making readability far more economically valuable than write-time convenience. → **Why?** At root: programming is collaboration across time—the "future developer" maintaining your code (often yourself 6 months later) needs to understand decisions made without your original context, and clean code is the only reliable way to transfer that understanding.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bếp nhà hàng 5 sao: dao để đúng ngăn, gia vị xếp theo thứ tự chữ cái, mặt bàn sạch sau mỗi món nấu xong. Đầu bếp mới vào ngay ngày đầu cũng biết tìm gì ở đâu và làm việc hiệu quả ngay. Clean code y vậy: naming conventions, small functions, DRY—không phải để "đẹp" hay "nghệ thuật" mà để bất kỳ developer nào vào codebase cũng đọc và sửa được mà không phải hỏi "cái này nghĩa là gì?" mỗi 5 phút.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Clean Code Core Rules (Robert C. Martin):

NAMING ─────────────────── FUNCTIONS ────────────────────────
• Intention-revealing      • Small: ideally 5-15 lines
• Pronounceable            • Do ONE thing (no "and"/"or" in desc)
• Searchable               • One level of abstraction per function
• No type encoding (iCount)• Max 3 params (else: Parameter Object)
• Boolean: is/has/can/should

DRY / KISS / YAGNI ─────── BOY SCOUT RULE ───────────────────
DRY: extract duplication   "Leave code cleaner than you found it"
KISS: simplest solution    → Each commit: one tiny improvement
YAGNI: no speculative code → No heroic refactoring sprints needed
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Over-DRY: tạo abstraction khi 2 code blocks chỉ tình cờ giống nhau → wrong abstraction tệ hơn duplication
- YAGNI vs good architecture: đôi khi cần cân bằng "không đoán mò" với "không tạo dead end architecture"
- Boy Scout Rule có thể thành scope creep: fix 1 bug → refactor cả module → PR to và rủi ro cao
- "Clean" là ngữ cảnh: Kotlin idiomatic code "sạch" với Kotlin dev nhưng "lạ" với Java dev đọc lần đầu

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                        | Tại sao sai                                                            | Đúng là                                                                |
| ---------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| DRY mọi thứ ngay lần thứ 2 trùng lặp           | Premature abstraction tệ hơn một chút duplication                      | "Rule of Three": duplicate 1-2 lần trước khi extract abstraction       |
| Function "clean" = function ngắn nhất có thể   | Tách quá nhỏ → 50 hàm 1 dòng → khó track execution flow                | Clean function = làm 1 việc rõ ràng, không nhất thiết phải ngắn tối đa |
| Áp dụng Clean Code tuyệt đối không xem context | Script migration, data processing có requirements khác production code | Clean Code là principles cần judgment, không phải laws áp cứng         |

**🎯 Interview Pattern:**

- Khi thấy: "what does clean code mean to you?" → Nhớ đến: meaningful names + small focused functions + DRY/KISS/YAGNI + Boy Scout Rule → Mở đầu: "Clean code có 4 pillars theo tôi: meaningful naming để code self-document, small functions làm 1 việc, DRY/KISS để tránh complexity không cần thiết, và Boy Scout Rule để quality improve liên tục."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Documentation as Code Quality](#8-documentation-as-code-quality--tài-liệu-như-chất-lượng)
- ➡️ Để hiểu tiếp: [Code Quality in Practice](#10-code-quality-in-practice--áp-dụng-thực-tế)

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

> 🧠 **Memory Hook:** Quality in practice = tập gym đều đặn — không có ngày "tập siêu nhiều để bù tuần trước," chỉ có thói quen consistent mỗi ngày!

**Tại sao tồn tại? / Why does this exist?**

Code quality practices exist as a systematic discipline because sporadic quality efforts are ineffective—quality degrades continuously and requires continuous counter-pressure to maintain. → **Why?** Because technical entropy is the natural state: without active investment, code quality trends toward disorder as new features are added faster than old code is cleaned up—each developer optimizing locally without considering global code health. → **Why?** At root: quality systems (CI gates, review culture, metrics dashboards) are needed to make quality the path of least resistance rather than an individual heroic effort that only happens when someone has energy left after shipping.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Không ai tập gym 24 tiếng một ngày rồi nghỉ cả tháng—sức khỏe đến từ thói quen đều đặn: 30 phút mỗi ngày. Code quality cũng vậy: không có "refactoring sprint" cuối năm để sửa hết tất cả một lúc—cần CI gates tự động chặn code xấu, pre-commit hooks bắt lỗi ngay khi commit, review culture nhất quán, và Boy Scout Rule áp dụng mỗi ngày. Quality là thói quen của cả team, không phải dự án one-time.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Quality System End-to-End:

Developer writes code
    │
    ▼
[Pre-commit hooks]  ← Instant feedback (<30s)
  • lint-staged: lint + format chỉ staged files
  • Type check
  • Related unit tests
    │
    ▼ (commit created)
[CI Pipeline]  ← Automated gate (1-10 min)
  ├── Stage 1: Fast checks (lint, format, types)
  ├── Stage 2: Unit tests + coverage threshold
  ├── Stage 3: Static analysis (SonarQube, Snyk)
  └── Stage 4: Build + integration tests
    │
    ▼ (all green)
[Code Review]  ← Human judgment layer
  • Automated checks already passed
  • Focus on: design, correctness, business logic
    │
    ▼ (approved + merged)
[Production Monitoring]
  ├── Bug rate trending
  ├── Cycle time tracking
  └── Debt register update
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Quality gates quá strict hoặc quá slow → developer frustrated → bypass hooks → worse than no gates
- Metricized culture → Goodhart's Law: metric trở thành target, không còn đo quality thật nữa
- Small team: heavy process giết velocity—cần lightweight version phù hợp team size
- Quality culture phải từ leadership xuống: nếu tech lead approve code xấu, team học theo ngay

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                      | Đúng là                                                                           |
| -------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Quality review chỉ vào cuối sprint           | Quá muộn—cost fix lỗi tăng 10x sau khi code integrated           | Shift left: lint/type check trong pre-commit, test trong CI ngay từ đầu           |
| "Quality team" riêng biệt sở hữu quality     | Quality trở thành outsourced → dev không cảm thấy có trách nhiệm | Quality là shared responsibility của mọi dev—QA là enabler, không phải gatekeeper |
| Chỉ đo output metrics (LOC merged, PRs/week) | Không phản ánh quality; dev tăng output quantity = giảm quality  | Đo outcome: cycle time, change failure rate, bug escape rate, MTTR                |

**🎯 Interview Pattern:**

- Khi thấy: "how do you build a quality culture in a team?" → Nhớ đến: automated gates + review norms + metrics tracking + leadership buy-in → Mở đầu: "Quality culture bắt đầu từ automation—CI gates, pre-commit hooks—để làm quality path of least resistance. Sau đó là review norms, rồi metrics để track trends và make data-driven decisions."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Clean Code Principles](#9-clean-code-principles--nguyên-tắc-clean-code)
- ➡️ Để hiểu tiếp: [Testing Theory](./04-testing-theory.md)

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

| Smell                  | Primary Refactoring                   |
| ---------------------- | ------------------------------------- |
| Long Method            | Extract Method                        |
| Large Class            | Extract Class                         |
| Primitive Obsession    | Introduce Value Object                |
| Long Parameter List    | Introduce Parameter Object            |
| Feature Envy           | Move Method                           |
| Duplicate Code         | Extract Method / Pull Up Method       |
| Switch Statements      | Replace Conditional with Polymorphism |
| Message Chains         | Hide Delegate                         |
| Speculative Generality | Collapse Hierarchy / Inline Class     |
| Dead Code              | Delete it                             |

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

| Level              | Description            | Practices                                                       |
| ------------------ | ---------------------- | --------------------------------------------------------------- |
| **1 — Ad hoc**     | No standards           | Nothing automated                                               |
| **2 — Repeatable** | Basic linting          | ESLint/gofmt, manual reviews                                    |
| **3 — Defined**    | CI quality gates       | Automated tests, coverage thresholds, PR templates              |
| **4 — Managed**    | Metrics-driven         | DORA metrics, quality dashboards, debt register                 |
| **5 — Optimizing** | Continuous improvement | Quality culture, automated recommendations, predictive analysis |

---

> **Liên kết tiếp theo:**
>
> - SOLID & Design Patterns: `docs/shared/05-software-engineering/01-solid-and-design-patterns.md`
> - SDLC & Practices: `docs/shared/05-software-engineering/03-sdlc-and-practices.md`
> - Testing Theory: `docs/shared/05-software-engineering/04-testing-theory.md`

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What makes a good code review? / Code review tốt gồm những gì? 🟢 Junior

**A:** A good code review checks: (1) **Correctness** — does it work? edge cases handled? (2) **Tests** — adequate coverage? (3) **Design** — right abstraction level? too complex? (4) **Readability** — future maintainers understand it? (5) **Security** — input validation, auth checks, no secrets in code?

Key behaviors:

- Comment on code, not the person ("This function is complex" not "You wrote bad code")
- Ask questions instead of demanding ("Why did you choose X?")
- Distinguish blocking ([must fix]) from suggestions ([nit], [optional])
- Approve with context — explain what you checked

Vietnamese explanation: Code review mục tiêu chính: knowledge transfer + defect prevention, không phải gatekeeping. Author checklist: self-review diff trước, add comments cho non-obvious decisions, ensure tests pass, description explains WHY not just WHAT. Google research: diminishing returns after 400 LOC/hour → review small PRs (< 400 lines ideal).

---

### Q: What is technical debt and how do you manage it? / Technical debt và cách manage? 🟡 Mid

**A:** Technical debt: shortcuts taken now that create future cost. **Deliberate** (strategic): "Ship fast, refactor after funding." **Inadvertent**: developer didn't know better patterns. **Bit rot**: code degraded as system evolved.

```
Management strategies:
- Tech debt backlog: track explicitly, prioritize like features
- Boy Scout Rule: "leave code cleaner than you found it"
- Strangler Fig: gradually replace legacy components
- Threshold: debt slows dev by > 20% → prioritize payback

How to pitch to management:
"This feature takes 2 weeks now but 1 week after refactoring.
 3 features from now we break even."

Metrics: "We spend 20% of sprint on bugs from this legacy module."
```

Vietnamese explanation: Không phải tất cả refactoring đều trả nợ — đôi khi là gold plating. Quantify impact cho management — đừng chỉ nói "code bad." Jeff Sutherland: debt không repaid = interest compounds → eventually pays all productivity. Ward Cunningham (coiner of term): "the debt metaphor" — technical debt không phải sin, là conscious trade-off cần repay.

---

## Interview Q&A Summary / Tổng Kết

| Question         | Level | Key Point                                                           |
| ---------------- | ----- | ------------------------------------------------------------------- |
| Good code review | 🟢    | Check correctness+tests+design+security; comment on code not person |
| Technical debt   | 🟡    | Track in backlog; quantify impact for mgmt; Boy Scout Rule          |

---

## Self-Check / Tự Kiểm Tra

| #   | Câu hỏi tự kiểm tra                                                                                                         | Loại        | Mức       | Đánh giá |
| --- | --------------------------------------------------------------------------------------------------------------------------- | ----------- | --------- | -------- |
| 1   | Can I list 5 things to check in every code review — beyond style (correctness, design, security, performance, tests)?       | Concept     | 🟢 Junior | [ ]      |
| 2   | Can I explain technical debt with a concrete example and quantify its impact to a non-technical manager?                    | Application | 🟡 Mid    | [ ]      |
| 3   | Can I describe the Boy Scout Rule and when it becomes harmful (scope creep, over-refactoring)?                              | Trade-off   | 🟡 Mid    | [ ]      |
| 4   | Can I give constructive code review feedback — and explain the difference between "comment on code" vs "comment on person"? | Behaviour   | 🟢 Junior | [ ]      |
| 5   | Can I explain Cyclomatic vs Cognitive Complexity — and which is more useful for humans reading the code?                    | Concept     | 🟡 Mid    | [ ]      |

💬 **Feynman Prompt:** Giải thích "comment on code, not person" — đưa ra ví dụ cụ thể của một comment tồi và rewrite nó theo cách vừa honest vừa constructive, sau đó giải thích tại sao cách viết mới lại tốt hơn cho cả author lẫn team culture.

## Connections / Liên Kết

- ⬅️ **Built on**: [SOLID & Design Patterns](./01-solid-and-design-patterns.md) — patterns provide shared vocabulary for code review
- ⬅️ **Built on**: [SDLC Practices](./03-sdlc-and-practices.md) — code review is a gate in the CI/CD pipeline
- ➡️ **Applied in**: [Testing Theory](./04-testing-theory.md) — test coverage is part of code review checklist
- 🔗 **Related**: [Project Management](./06-project-management.md) — technical debt feeds into project planning
