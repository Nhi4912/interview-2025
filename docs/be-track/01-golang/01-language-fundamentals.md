# Go Language Fundamentals

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: Programming basics (any language) | [OS Theory](../../shared/01-cs-fundamentals/os-theory.md)
> **See also**: [Table of Contents](../../00-table-of-contents.md) | [Go Concurrency](./03-concurrency.md)

> **Focus**: ~75% theory (WHY & HOW internally), ~25% code examples
> **Format**: Q&A, Bilingual (English headings + Vietnamese explanations)
> **Difficulty**: 🟢 Junior | 🟡 Mid | 🔴 Senior

---

## Real-World Scenario / Tình Huống Thực Tế

Grab cần xử lý hàng triệu ride requests đồng thời với latency thấp. Python gặp khó khăn với CPU-bound concurrency. Java có JVM startup overhead. **Go được chọn vì:**

- Goroutines (2KB/goroutine vs 1MB/OS thread) → hàng triệu concurrent connections
- Compile to native binary — không có JVM cold start, deploy Docker image nhỏ hơn
- Simple syntax giảm onboarding time cho team lớn

Go là ngôn ngữ chính tại Grab, Google, CloudFlare, Docker, Kubernetes — và đang phổ biến tại tech companies Vietnam.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng:** Go được thiết kế tại Google để giải quyết "C có performance, Python có simplicity" — nhưng một ngôn ngữ có cả hai.

**Những gì Go cố tình KHÔNG có (và tại sao):**

| Bị bỏ                    | Lý do                                              |
| ------------------------ | -------------------------------------------------- |
| Class inheritance        | Composition > Inheritance — dùng embedding         |
| Exceptions (try/catch)   | Explicit `if err != nil` → không bỏ qua lỗi        |
| Implicit type conversion | Forces clarity, prevents bugs                      |
| Generics (trước Go 1.18) | Simplicity first — added later when clearly needed |

**Go's killer features:** Goroutines + Channels + Interfaces (implicit) + Fast compile

---

## Concept Map / Bản Đồ Khái Niệm

```
    [GO LANGUAGE FUNDAMENTALS]  ← bạn đang ở đây
                    │
         ┌──────────┼──────────┐
         ▼          ▼          ▼
  [Types]      [Functions]  [Error Handling]
  Primitives   First-class  if err != nil
  Structs      Defer/panic  errors.Is/As
  Interfaces   Closures     Wrapping
  Pointers     Multiple ret Custom errors
         │
         ▼
  [Go Concurrency](./03-concurrency.md)
  Goroutines | Channels | sync | Context
         │
         ▼
  [Go Interfaces & Generics](./02-interfaces-generics.md)
  Implicit interface | Type constraints | Generic functions
```

---

## Overview / Tổng Quan

Go's fundamentals cover 7 interconnected concepts: the philosophy driving every design decision, a strict but ergonomic type system, value-vs-reference semantics that eliminate hidden mutation, structs as the composition primitive, pointers governed by escape analysis, slices with their shared-backing-array gotchas, and maps with bucket-based hash internals.

Go fundamentals xoay quanh 7 khái niệm liên kết: triết lý thiết kế định hình mọi quyết định, hệ thống type nghiêm ngặt nhưng tiện dụng, value/reference semantics loại bỏ mutation ẩn, struct là building block cho composition, pointer được quản lý bởi escape analysis, slice với gotcha backing array, và map với cơ chế hash bucket nội bộ. Mỗi khái niệm connect trực tiếp — hiểu sai value semantics sẽ gặp bug slice; hiểu sai type system sẽ confuse interface satisfaction.

---

## 1. Go Philosophy

> 🧠 **Memory Hook:** "Go là ngôn ngữ nói 'không' nhiều nhất — không inheritance, không exceptions, không generics ban đầu. Mỗi lần từ chối là một lần giữ cho codebase đơn giản."

**Tại sao tồn tại? / Why does this exist?**

Go cần giải quyết vấn đề cụ thể tại Google: compile C++ mất hàng giờ, concurrency với threads quá phức tạp, và code Java khó đọc cho team lớn.
→ **Why?** Google có hàng ngàn engineer cùng làm việc trên cùng codebase — ngôn ngữ phức tạp làm chậm onboarding và tăng bugs.
→ **Why?** Complexity trong ngôn ngữ nhân lên thành complexity trong code — một team 1000 người viết complex Go sẽ tệ hơn team 1000 người viết simple Go.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng bạn thiết kế một chiếc dao bếp. Bạn có thể thêm 50 tính năng: corkscrew, scissors, screwdriver. Kết quả là Swiss Army Knife — có mọi thứ nhưng không cái nào tốt. Go chọn làm dao bếp chuyên biệt: không nhiều feature, nhưng feature nào cũng làm tốt và developer không phải đắn đo "tôi nên dùng feature nào?"

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Go's design decisions flow từ 3 nguyên tắc:

1. **Compilation speed**: Dependency graph tuyến tính (no circular imports) + simple syntax → compiler không cần phân tích phức tạp
2. **Readability at scale**: 25 keywords (Python 35, Java 51, C++ 92) → ít cách viết code → mọi người đọc code giống nhau
3. **Explicit over implicit**: Error handling, type conversion, interface implementation đều phải nói rõ — không có magic

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

Go's simplicity-first approach có cost thực sự:

- Trước Go 1.18: không có generics → rất nhiều code duplication hoặc `interface{}` unsafe casts
- Không có function overloading → cần nhiều function names (`ReadString`, `ReadBytes`, `ReadRune`)
- Verbose error handling → một function có 5 operations có thể có 5 `if err != nil` blocks

### Q: Why was Go created? What problems does it solve? 🟢 Junior

**A:** Go được tạo ra bởi Robert Griesemer, Rob Pike, và Ken Thompson tại Google vào năm 2007 (public 2009) để giải quyết các vấn đề thực tế:

| Problem                                                      | Go's Solution                                    |
| ------------------------------------------------------------ | ------------------------------------------------ |
| C++ compilation quá chậm (hàng giờ ở Google)                 | Compiler cực nhanh, dependency analysis đơn giản |
| Concurrency phức tạp (threads, locks)                        | Goroutines + channels là first-class citizens    |
| Code phức tạp, khó đọc (C++ templates, Java generics lúc đó) | Syntax tối giản, chỉ 25 keywords                 |
| Dependency management hỗn loạn                               | Built-in module system                           |
| Deploy phức tạp (JVM, runtime dependencies)                  | Static binary, zero dependencies                 |

**Triết lý cốt lõi:** Go chọn **simplicity over cleverness**. Ngôn ngữ cố tình KHÔNG có nhiều feature (ban đầu không generics, không exceptions, không inheritance) để buộc developer viết code đơn giản, dễ đọc.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Kể được ít nhất 2 concrete problems ở Google (compile time, concurrency) và giải thích tại sao simplicity là design goal, không phải limitation
- ❌ Weak: Nói "Go nhanh và dễ học" mà không giải thích context tại sao các ngôn ngữ trước không đủ tốt

### Q: What are the important Go Proverbs? 🟡 Mid

**A:** Go Proverbs (by Rob Pike) là kim chỉ nam thiết kế:

- **"Don't communicate by sharing memory; share memory by communicating"** — Dùng channels thay vì shared state + mutex
- **"Concurrency is not parallelism"** — Concurrency là cấu trúc code, parallelism là thực thi đồng thời
- **"The bigger the interface, the weaker the abstraction"** — Interface nhỏ (1-2 methods) mạnh hơn interface lớn
- **"Make the zero value useful"** — `sync.Mutex{}` sẵn sàng dùng, không cần constructor
- **"A little copying is better than a little dependency"** — Copy vài dòng code tốt hơn import cả thư viện
- **"Clear is better than clever"** — Code dễ đọc quan trọng hơn code "thông minh"
- **"Errors are values"** — Error không phải exception, xử lý chúng như data bình thường

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Không chỉ đọc thuộc mà giải thích được trade-off đằng sau ít nhất 2 proverbs — ví dụ "bigger interface, weaker abstraction" liên kết đến Liskov và dependency inversion
- ❌ Weak: Chỉ list proverbs mà không giải thích tại sao chúng tồn tại

### Q: How does Go handle composition over inheritance? 🟢 Junior

**A:** Go **không có inheritance** (không class, không extends). Thay vào đó dùng **composition** qua struct embedding:

- **Inheritance (OOP truyền thống):** "Dog IS-A Animal" — tight coupling, fragile base class problem
- **Composition (Go):** "Dog HAS-A ability to walk, bark" — loose coupling, flexible

Lý do Go chọn composition:

1. **Tránh diamond problem** — không cần giải quyết multiple inheritance conflicts
2. **Explicit hơn implicit** — bạn thấy rõ struct chứa gì
3. **Dễ thay đổi** — thêm/bớt behavior không break hierarchy
4. **Interface satisfaction implicit** — không cần `implements` keyword

```go
// Composition, not inheritance
type Walker struct{}
func (w Walker) Walk() string { return "walking" }

type Dog struct {
    Walker  // embedding = composition, Dog "has" walking ability
    Name string
}
// Dog.Walk() is promoted — looks like inheritance but is delegation
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích promoted methods là delegation (receiver vẫn là `Walker`, không phải `Dog`) và phân biệt với inheritance thực sự
- ❌ Weak: Nói "Go dùng embedding thay inheritance" mà không giải thích tại sao và sự khác biệt kỹ thuật

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                | Tại sao sai                                                                                    | Đúng là                                                                                     |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| "Go's struct embedding là inheritance" | Embedded method receiver vẫn là embedded type, không phải outer struct — không có polymorphism | Embedding là delegation/composition — promoted methods là convenience, không phải subtyping |
| "Go không thể làm OOP"                 | Go có encapsulation, polymorphism qua interface, và composition                                | Go làm OOP theo cách khác — không có class hierarchy                                        |
| "Proverbs là best practices tùy chọn"  | Proverbs phản ánh design constraints của runtime và compiler                                   | Proverbs là architectural decisions với technical reasons đằng sau                          |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Why Go?", "Go vs Java/Python", "Go design philosophy", "composition vs inheritance"
- → Nhớ đến: Go giải quyết problems cụ thể tại Google-scale, mỗi design decision có concrete reason
- → Mở đầu trả lời: _"Go được tạo ra để giải quyết vấn đề scale của Google — compile time hàng giờ, concurrency phức tạp, và team size hàng ngàn người. Mỗi feature bị bỏ ra đều có lý do kỹ thuật rõ ràng, không phải thiếu sót."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [OS Theory](../../shared/01-cs-fundamentals/os-theory.md) — threads, processes, memory model
- ➡️ Để hiểu tiếp: [Go Concurrency](./03-concurrency.md) — goroutines implement triết lý "share memory by communicating"

#### Block C — Study Cases / Tình Huống Thực Tế Sâu

**Case: Google — Tại sao Go được tạo ra từ một buổi chờ compile C++**

Năm 2007, Robert Griesemer, Rob Pike, và Ken Thompson đang chờ một binary C++ lớn compile xong tại Google. Trong lúc chờ, họ phác thảo những gì một ngôn ngữ lý tưởng cho Google-scale cần có. Vấn đề không phải là C++ chậm khi chạy — mà là developer productivity bị giết bởi compile time hàng chục phút, dependency management hỗn loạn, và syntax quá phức tạp để review code nhanh. Go được thiết kế từ đầu với constraint: compile phải nhanh hơn bạn có thể uống cà phê. Trade-off chấp nhận: không có generic ban đầu (thêm 11 năm sau ở Go 1.18), không có exception, không có macro. Bài học: Design constraints từ real pain points tạo ra ngôn ngữ tốt hơn design-by-committee với feature list dài.

---

## 2. Type System

> 🧠 **Memory Hook:** "Go's type system = traffic lights — màu xanh chỉ di chuyển khi đúng type, compiler là cảnh sát không cho vượt đèn đỏ lúc compile time."

**Tại sao tồn tại? / Why does this exist?**

Go cần type safety mạnh để catch bugs sớm nhất có thể, nhưng không cần ceremony của Java (explicit type everywhere).
→ **Why?** Runtime type errors ở production (như Python/JavaScript) rất tốn kém — outage, data corruption.
→ **Why?** Static typing + type inference = best of both worlds: compiler catches errors, developer không phải viết types ở khắp nơi.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ type như nhãn dán trên hộp. `int` nghĩa là hộp này chỉ chứa số nguyên. `string` là hộp chỉ chứa chữ. Go là nhà kho có quy tắc nghiêm: bạn không thể bỏ chữ vào hộp số nguyên — compiler kiểm tra lúc bạn đóng gói (compile time), không phải lúc khách hàng mở ra (runtime).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Go's type system có 3 tầng:

1. **Basic types**: primitives (int, float64, bool, string, rune, byte) — đây là các hộp cơ bản
2. **Composite types**: array, slice, map, struct, channel — các hộp chứa nhiều hộp khác
3. **Interface types**: tập hợp method signatures — không phải hộp mà là "hợp đồng hành vi"

Type inference (`:=`) cho phép compiler đoán type từ right-hand side tại compile time — không phải dynamic typing.

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- `int` là platform-dependent (32-bit trên 32-bit OS, 64-bit trên 64-bit OS) — **không dùng `int` khi cần exact size** (serialization, network protocols)
- `byte` là alias của `uint8`, `rune` là alias của `int32` — interchangeable với underlying type
- Untyped constants có arbitrary precision — `const x = 1<<200` hợp lệ nhưng chỉ dùng được nơi nào precision đủ lớn

### Q: Explain Go's type system and all basic types 🟢 Junior

**A:** Go là **statically typed, strongly typed** language. Mọi variable đều có type cố định lúc compile time.

**Basic types:**

| Category           | Types                                          | Notes                                          |
| ------------------ | ---------------------------------------------- | ---------------------------------------------- |
| Boolean            | `bool`                                         | `true` / `false`                               |
| Integer (signed)   | `int8, int16, int32, int64, int`               | `int` = platform-dependent (32 hoặc 64 bit)    |
| Integer (unsigned) | `uint8, uint16, uint32, uint64, uint, uintptr` | `byte` = alias cho `uint8`                     |
| Float              | `float32, float64`                             | Không có `float`, phải chọn rõ                 |
| Complex            | `complex64, complex128`                        | Ít dùng, cho scientific computing              |
| String             | `string`                                       | Immutable sequence of bytes                    |
| Rune               | `rune`                                         | Alias cho `int32`, đại diện Unicode code point |

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích được tại sao `int` không phải `int64` luôn (platform-dependent), và khi nào dùng `byte` vs `uint8` (semantics: `byte` = raw data, `uint8` = small number)
- ❌ Weak: Chỉ list types mà không giải thích khi nào dùng cái nào

### Q: What are the zero values for all types in Go? 🟢 Junior

**A:** Mọi variable trong Go nếu không khởi tạo sẽ nhận **zero value**. Đây là thiết kế có chủ đích — "make the zero value useful":

| Type         | Zero Value                  | Example                               |
| ------------ | --------------------------- | ------------------------------------- |
| `bool`       | `false`                     | `var b bool` → `false`                |
| All integers | `0`                         | `var i int` → `0`                     |
| All floats   | `0.0`                       | `var f float64` → `0.0`               |
| `string`     | `""` (empty string)         | `var s string` → `""`                 |
| Pointer      | `nil`                       | `var p *int` → `nil`                  |
| Slice        | `nil`                       | `var s []int` → `nil` (len=0, cap=0)  |
| Map          | `nil`                       | `var m map[string]int` → `nil`        |
| Channel      | `nil`                       | `var ch chan int` → `nil`             |
| Interface    | `nil`                       | `var i interface{}` → `nil`           |
| Function     | `nil`                       | `var f func()` → `nil`                |
| Struct       | Each field = its zero value | `var u User` → `User{Name:"", Age:0}` |

**Lưu ý quan trọng:** `nil` slice vẫn dùng được với `append()`, nhưng `nil` map sẽ **panic** nếu ghi vào.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Phân biệt `nil` slice (functional với append) vs `nil` map (panic on write) — đây là gotcha phổ biến nhất
- ❌ Weak: Chỉ nói "zero value là 0 hoặc nil" mà không giải thích practical implications

### Q: Type alias vs type definition — what's the difference? 🟡 Mid

**A:** Hai cách tạo type mới với behavior rất khác:

```go
type MyInt int      // Type DEFINITION — tạo type hoàn toàn mới
type YourInt = int  // Type ALIAS — chỉ là tên khác cho cùng type
```

| Aspect        | Type Definition (`type X int`) | Type Alias (`type X = int`)          |
| ------------- | ------------------------------ | ------------------------------------ |
| Tạo type mới? | Có — `X` ≠ `int`               | Không — `X` == `int`                 |
| Cần convert?  | `int(x)` để chuyển             | Không cần, interchangeable           |
| Gắn method?   | Được                           | Không (phải gắn vào original type)   |
| Dùng khi nào? | Tạo domain type, thêm method   | Gradual refactoring, backward compat |

**Type definition** tạo type mới hoàn toàn, compiler sẽ báo lỗi nếu assign sai type — đây là cách tạo **domain types** an toàn (vd: `type UserID int64` để tránh nhầm với `OrderID int64`).

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Đưa ví dụ `UserID` vs `OrderID` — type definition prevents passing wrong ID at compile time, giải thích type alias là transitional tool khi refactor lớn
- ❌ Weak: Nói "type alias chỉ là tên khác" mà không giải thích use case refactoring hay domain type safety

### Q: How does type inference work in Go? 🟢 Junior

**A:** Go dùng `:=` (short variable declaration) để suy luận type từ giá trị bên phải:

```go
x := 42          // int (default cho integer literal)
y := 3.14        // float64 (default cho float literal)
z := "hello"     // string
w := true        // bool
p := &x          // *int
```

Compiler xác định type tại **compile time**, không phải runtime. Sau khi infer, type cố định — không thể gán giá trị khác type.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích đây là static type inference (compile time) — khác với dynamic typing của Python. Và `42` mặc định là `int`, không phải `int64` — cần explicit `var x int64 = 42` nếu muốn
- ❌ Weak: Nhầm lẫn type inference với dynamic typing

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                        | Tại sao sai                                     | Đúng là                                           |
| ---------------------------------------------- | ----------------------------------------------- | ------------------------------------------------- |
| Dùng `int` cho network/serialization data size | `int` platform-dependent: 32-bit trên 32-bit OS | Dùng `int64` hoặc `int32` explicit cho exact size |
| Ghi vào `nil` map                              | `nil` map panic on write                        | Luôn `make(map[K]V)` trước khi ghi                |
| Nhầm `nil` slice với empty slice trong JSON    | `nil` slice → `null`, empty slice → `[]`        | Dùng `make([]T, 0)` nếu cần `[]` trong JSON       |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: zero values, type safety, nil panics, domain modeling
- → Nhớ đến: Go's zero values là thiết kế có chủ đích — "make the zero value useful" là proverb có reason
- → Mở đầu trả lời: _"Go đảm bảo mọi variable luôn có giá trị hợp lệ qua zero values — đây không phải default, mà là thiết kế để `sync.Mutex{}` sẵn dùng, `nil` slice có thể append. Nhưng `nil` map là exception quan trọng cần nhớ."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Go Philosophy](#1-go-philosophy) — "make the zero value useful" proverb
- ➡️ Để hiểu tiếp: [Structs](#4-structs) — struct zero values và embedding; [Go Interfaces](./02-interfaces-generics.md) — interface nil gotcha

#### Block C — Study Cases / Tình Huống Thực Tế Sâu

**Case: Dropbox — Domain types ngăn chặn production bug nghiêm trọng**

Dropbox migration từ Python sang Go gặp vấn đề kinh điển: trong Python, một function nhận `user_id` (int) và `file_id` (int) không có gì ngăn developer truyền ngược thứ tự. Một bug như vậy từng xóa nhầm files của user khác trong staging. Sau khi chuyển sang Go, team implement `type UserID int64` và `type FileID int64` — hai types hoàn toàn khác nhau dù cùng underlying `int64`. Compiler từ chối compile nếu pass `FileID` vào function nhận `UserID`. Trade-off chấp nhận: cần explicit conversion `UserID(rawInt)` ở boundary (DB layer, API layer). Bài học: type system là documentation và safety net đồng thời — zero runtime cost với compile-time protection.

---

## 3. Value Types vs Reference Types

> 🧠 **Memory Hook:** "Go LUÔN pass by value — nhưng một số value là địa chỉ nhà. Copy địa chỉ nhà không copy ngôi nhà."

**Tại sao tồn tại? / Why does this exist?**

Go cần semantics nhất quán để developer không bị surprise khi function modify data.
→ **Why?** "Pass by reference" tạo ra action-at-a-distance bugs — function thay đổi data mà caller không biết, đặc biệt nguy hiểm trong concurrent code.
→ **Why?** Nhất quán "always copy" cho phép compiler optimize stack allocation và garbage collection dự đoán được.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Khi bạn share "địa chỉ nhà" với bạn bè — bạn copy tờ giấy có địa chỉ, không copy ngôi nhà. Cả hai người có tờ giấy riêng (pass by value), nhưng đều trỏ đến cùng ngôi nhà. Nếu bạn sơn lại ngôi nhà (modify elements), người kia cũng thấy ngôi nhà mới màu. Nhưng nếu bạn xé tờ giấy của mình và viết địa chỉ nhà khác lên (reassign map/slice variable) — tờ giấy của người kia vẫn trỏ ngôi nhà cũ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

| Type                       | Passed as                                          | Contains pointer?                 | Mutation visible?                          |
| -------------------------- | -------------------------------------------------- | --------------------------------- | ------------------------------------------ |
| `int, float, bool, string` | Copy of value                                      | No                                | No                                         |
| `struct`                   | Copy of entire struct                              | No (trừ khi field là pointer)     | No                                         |
| `array`                    | Copy of entire array                               | No                                | No                                         |
| `slice`                    | Copy of **slice header**                           | Yes (pointer to backing array)    | Yes (modify elements), No (append may not) |
| `map`                      | Copy of **map pointer**                            | Yes (internal hash table pointer) | Yes                                        |
| `channel`                  | Copy of **channel pointer**                        | Yes (internal queue pointer)      | Yes                                        |
| `pointer`                  | Copy of **pointer value**                          | Yes (it IS a pointer)             | Yes                                        |
| `interface`                | Copy of **interface value** (type + data pointers) | Yes                               | Depends                                    |

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

Slice append gotcha là edge case quan trọng nhất: pass slice vào function, function append vượt capacity → function thấy extended slice nhưng caller không. Caller vẫn thấy slice header cũ với len/cap cũ. Đây là source of bugs thường gặp nhất trong Go beginner code.

### Q: Is Go pass-by-value or pass-by-reference? 🟡 Mid

**A:** Go **LUÔN pass-by-value**. Không có exception. Mọi thứ truyền vào function đều là **copy**.

Nhưng câu chuyện phức tạp hơn vì một số type chứa **internal pointer**:

**Giải thích sâu:** Khi bạn pass một slice vào function, Go copy 3 fields: `(pointer, len, cap)`. Cả bản copy và bản gốc cùng trỏ đến **same backing array**, nên sửa element thì cả hai đều thấy. Nhưng `append()` có thể tạo backing array mới — lúc đó bản copy trỏ chỗ khác, bản gốc không thấy thay đổi.

```go
func modify(s []int) {
    s[0] = 999    // Visible outside — same backing array
    s = append(s, 1, 2, 3)  // If cap exceeded, new backing array
    // changes after this append may NOT be visible outside
}
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Phân biệt "copy của pointer" vs "pass by reference" — reassign map variable inside function KHÔNG ảnh hưởng caller. Giải thích slice header gồm 3 fields
- ❌ Weak: Nói "slice và map là reference types" — Go spec không dùng từ này, và nó technically không chính xác

### Q: Why does Go not have "reference types" officially? 🔴 Senior

**A:** Thuật ngữ "reference type" gây nhầm lẫn. Go spec không dùng từ này. Chính xác hơn:

- **Slice** là struct `{pointer, len, cap}` — pass-by-value struct có chứa pointer
- **Map** là pointer đến runtime hash table (`*runtime.hmap`) — pass-by-value pointer
- **Channel** là pointer đến runtime channel struct (`*runtime.hchan`) — pass-by-value pointer

Nói "map là reference type" là **không chính xác**. Map là **pointer được pass by value**. Sự khác biệt: trong C++ reference type, bạn có thể reassign và caller thấy. Trong Go, reassign map variable trong function KHÔNG ảnh hưởng caller.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Biết `runtime.hmap` và `runtime.hchan` là concrete types, giải thích được tại sao reassign map inside function không ảnh hưởng caller — cần `*map[K]V` nếu muốn thật sự reference
- ❌ Weak: Dùng "reference type" như định nghĩa chính xác mà không giải thích nuance

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                            | Tại sao sai                                                                        | Đúng là                                                                 |
| -------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| "Slice và map là reference types"                  | Go spec không định nghĩa reference types — map là pointer passed by value          | Map là `*runtime.hmap` passed by value; slice là struct `{ptr,len,cap}` |
| "Modify slice trong function luôn visible ở ngoài" | Chỉ đúng khi modify existing elements, không đúng với append vượt cap              | Pass `*[]int` nếu cần function extend slice và caller thấy              |
| "Copy struct là deep copy"                         | Struct field là pointer → copy struct chỉ copy pointer, không copy pointed-to data | Deep copy cần implement manually hoặc dùng `encoding/json` round-trip   |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: pass by value/reference, slice mutation, function side effects, concurrent data access
- → Nhớ đến: Go always copies — sự khác biệt là "copy của gì" (value vs pointer to shared data)
- → Mở đầu trả lời: _"Go luôn pass by value — không có exception. Nhưng 'value' của slice là struct header gồm pointer+len+cap, của map là pointer đến runtime hash table. Copy pointer không copy data — nên mutations qua pointer vẫn visible, nhưng reassign variable thì không."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Go Type System](#2-type-system) — value types vs pointer types
- ➡️ Để hiểu tiếp: [Pointers](#5-pointers) — khi nào dùng `*T`; [Slice Internals](#6-slice-internals) — backing array mechanics

#### Block C — Study Cases / Tình Huống Thực Tế Sâu

**Case: Uber — Slice append bug gây silent data loss trong fare calculation**

Một team tại Uber (theo engineering blog 2018) gặp bug trong service tính surge pricing: một function nhận slice of ride requests, append additional data bên trong, rồi trả về. Caller tiếp tục dùng original slice không biết append đã xảy ra — với capacity đủ lớn (pre-allocated), function's append đã ghi đè data của backing array ngay phía sau len của caller's slice. Result: fare calculation đọc wrong data trong edge case khi slice được pre-allocated với extra capacity. Bug chỉ xuất hiện dưới specific load pattern. Fix: dùng full slice expression `s[0:len:len]` khi pass vào function để cap == len, buộc append tạo backing array mới. Bài học: slice sharing là subtle — luôn explicit về ownership.

---

## 4. Structs

> 🧠 **Memory Hook:** "Struct là record trong database — một row, nhiều columns, mỗi column có type riêng. Embedding là foreign key inlined."

**Tại sao tồn tại? / Why does this exist?**

Go cần cách group related data mà không cần class hierarchy của OOP.
→ **Why?** Class hierarchy tạo tight coupling — thay đổi base class có thể break toàn bộ hierarchy (fragile base class problem).
→ **Why?** Data grouping (struct) và behavior (interface) nên tách biệt — cho phép compose flexibly mà không cần commit vào hierarchy trước.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Struct là như form khai báo hải quan: tên, quốc tịch, số hộ chiếu — mỗi field có type riêng, tất cả grouped thành một đơn vị. Embedding là như form khai báo có thêm "kèm theo form A đã điền sẵn" — bạn không cần điền lại, chỉ reference đến.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Struct trong Go:

- **Value type** — assign hoặc pass tạo complete copy (trừ pointer fields)
- **Memory layout** = fields packed theo order, với alignment padding
- **Embedding** = anonymous field với tên là type name — fields và methods promoted lên outer struct
- **Tags** = raw string metadata, chỉ accessible qua reflection

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Struct với pointer fields: copy struct nhưng pointer field vẫn trỏ cùng data → "shallow copy"
- Embedded methods khi gọi qua outer struct: receiver vẫn là embedded type — nếu embedded method gọi `self.someMethod()`, nó gọi embedded type's method, không phải outer struct's
- Struct tags compiler không validate — typo trong tag bị bỏ qua lặng lẽ

### Q: Explain struct value semantics and embedding 🟡 Mid

**A:** Struct trong Go là **value type** — assign hoặc pass sẽ tạo **deep copy** (trừ khi struct chứa pointer fields).

**Embedding (Composition):**

```go
type Base struct {
    ID int
}
func (b Base) Identify() string { return fmt.Sprintf("ID:%d", b.ID) }

type User struct {
    Base        // Embedded — fields/methods được "promoted"
    Name string
}

u := User{Base: Base{ID: 1}, Name: "Alice"}
u.ID          // promoted field — truy cập trực tiếp
u.Identify()  // promoted method
u.Base.ID     // vẫn truy cập explicit được
```

**Embedding KHÔNG phải inheritance vì:**

1. Không có polymorphism tự động — `User` không phải subtype của `Base`
2. Method của `Base` khi gọi qua `User`, receiver vẫn là `Base`, không phải `User`
3. Nếu `User` define method cùng tên, nó **shadow** (không override) method của `Base`

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích "promoted method receiver vẫn là embedded type" — nếu `Base.Identify()` gọi method khác của `Base`, nó không thể thấy `User`-specific fields
- ❌ Weak: Mô tả embedding như inheritance và bỏ qua sự khác biệt receiver semantics

### Q: What are struct tags and how do they work? 🟡 Mid

**A:** Struct tags là metadata gắn vào field, chỉ đọc được qua **reflection** lúc runtime:

```go
type User struct {
    Name     string `json:"name" validate:"required,min=2"`
    Email    string `json:"email" db:"email_address"`
    Password string `json:"-"`               // Bỏ qua khi JSON encode
    Age      int    `json:"age,omitempty"`    // Bỏ qua nếu zero value
}
```

| Tag                   | Library                   | Purpose                 |
| --------------------- | ------------------------- | ----------------------- |
| `json:"name"`         | `encoding/json`           | JSON field mapping      |
| `db:"col_name"`       | `sqlx`, `gorm`            | Database column mapping |
| `validate:"required"` | `go-playground/validator` | Validation rules        |
| `yaml:"key"`          | `gopkg.in/yaml.v3`        | YAML mapping            |
| `mapstructure:"key"`  | `mapstructure`            | Config mapping          |

**Internally:** Tags được lưu trong binary dưới dạng raw string. `reflect.StructField.Tag` parse string này theo convention `key:"value"` pairs. Compiler KHÔNG validate tag syntax — sai format chỉ bị bỏ qua lặng lẽ (dùng `go vet` để check).

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích tags là runtime reflection data — có performance cost khi parse. Biết `json:"-"` để skip field, `omitempty` cho zero values, và tại sao compiler không validate tag syntax
- ❌ Weak: Chỉ biết `json:"fieldname"` mà không hiểu reflection mechanism đằng sau

### Q: Explain method sets and their rules 🔴 Senior

**A:** Method set quyết định type nào satisfy interface nào:

| Receiver type | Method set includes              |
| ------------- | -------------------------------- |
| Value `T`     | Chỉ methods với receiver `T`     |
| Pointer `*T`  | Methods với receiver `T` VÀ `*T` |

```go
type Sizer interface { Size() int }
type Resizer interface { Resize(int) }

type Box struct{ width int }
func (b Box) Size() int      { return b.width }     // value receiver
func (b *Box) Resize(w int)  { b.width = w }         // pointer receiver

var b Box
var _ Sizer = b    // OK — Box has Size()
var _ Resizer = b  // COMPILE ERROR — Box does NOT have Resize()
var _ Resizer = &b // OK — *Box has both Size() and Resize()
```

**Tại sao quy tắc này tồn tại?** Vì nếu bạn có interface value chứa non-pointer, Go không thể lấy address đáng tin cậy của nó (giá trị có thể nằm trong register, hoặc là temporary). Gọi pointer receiver method yêu cầu address — nên compiler cấm.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích tại sao quy tắc này tồn tại (addressability — interface value không có stable address), không chỉ đọc thuộc rule. Biết `var _ Interface = (*Type)(nil)` là compile-time check
- ❌ Weak: Chỉ nói "pointer receiver có thể gọi value receiver methods nhưng không ngược lại" mà không giải thích tại sao

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                                        | Đúng là                                                      |
| --------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| Mix value và pointer receivers trên cùng type | Gây confusing — method set của `T` và `*T` không nhất quán         | Nếu bất kỳ method nào dùng pointer receiver, tất cả nên dùng |
| Struct tag typo bị bỏ qua                     | `json:"nme"` thay vì `json:"name"` không báo lỗi — field bị ignore | Dùng `go vet ./...` để catch tag errors                      |
| Nhầm embedding với inheritance                | Embedded method receiver không thể truy cập outer struct's fields  | Embedding chỉ là syntax convenience — không phải subtyping   |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: struct design, interface satisfaction, method receivers, composition
- → Nhớ đến: Method sets rule là về addressability — pointer receiver cần stable address để mutate
- → Mở đầu trả lời: *"Struct trong Go là value type — assignment tạo copy. Nhưng method set của `T` chỉ có value receiver methods, còn `*T` có cả hai. Quy tắc này tồn tại vì pointer receiver cần stable memory address để mutate — non-addressable values (interface contents, map values, function returns) không thể có pointer receiver called on them."\*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Value Types vs Reference Types](#3-value-types-vs-reference-types) — value semantics
- ➡️ Để hiểu tiếp: [Go Interfaces](./02-interfaces-generics.md) — interface satisfaction và method sets; [Pointers](#5-pointers) — pointer receiver implications

#### Block C — Study Cases / Tình Huống Thực Tế Sâu

**Case: CloudFlare — Struct tag typo gây silent data leak trong API response**

CloudFlare engineering team kể về một incident trong internal service: một struct field chứa internal cost data có tag `json:"internal_cost"` bị developer refactor thành `json:"internalCost"` nhưng typo thành `json:"inernalCost"`. JSON encoder vẫn chạy bình thường — field được serialized với key `inernalCost` thay vì expected key. External client code expecting `internalCost` không nhận được data (field mới key không match), nhưng không báo error. Bug tồn tại 3 sprints trước khi bị phát hiện qua data discrepancy report. Fix: thêm `go vet` vào CI pipeline và integration test verify JSON output schema. Bài học: compiler silence không có nghĩa là correctness — struct tags cần automated verification.

---

## 5. Pointers

> 🧠 **Memory Hook:** "Pointer là địa chỉ nhà trong danh bạ điện thoại — bạn có thể copy trang danh bạ (pass pointer by value), nhưng cả bản gốc và bản copy đều dẫn đến cùng ngôi nhà."

**Tại sao tồn tại? / Why does this exist?**

Go cần cách để function mutate caller's data mà không cần return value, và để share large data structures mà không copy.
→ **Why?** Copy large structs (>64 bytes) mỗi function call tốn kém — cả CPU (copy operation) và memory (stack space).
→ **Why?** Một số operations vốn phải mutate data (linked list manipulation, in-place sort) — không thể pure function với reasonable performance.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Pointer như chìa khóa nhà. Bạn có thể copy chìa khóa và đưa cho nhiều người — tất cả đều vào được cùng ngôi nhà, thay đổi furniture (mutate data). Nhưng nếu người A thay chìa khóa (reassign pointer), người B vẫn còn chìa khóa cũ trỏ đến ngôi nhà cũ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

- `&x` — lấy address của `x` (x phải addressable: variable, struct field, array element — NOT map value, function return, interface content)
- `*p` — dereference: truy cập value tại địa chỉ `p` trỏ đến
- `new(T)` — allocate `T` trên heap, return `*T` với zero value
- Escape analysis — compiler quyết định pointer sống trên stack hay heap

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Pointer to interface anti-pattern: `*io.Reader` thường là mistake — interface đã là pointer-like; dùng `io.Reader` directly
- Nil pointer vs zero value struct: `*User` nil vs `User{}` — semantic difference (absent vs empty)
- Self-referential structs (linked lists, trees) yêu cầu pointer để tránh infinite size: `type Node struct { Next *Node }`

### Q: When should you use pointers vs values? 🟡 Mid

**A:** Quy tắc thực tế:

**Dùng pointer (`*T`) khi:**

1. **Cần mutate** — function cần thay đổi giá trị gốc
2. **Struct lớn** — copy struct >64 bytes tốn kém (heuristic, không phải hard rule)
3. **Interface satisfaction** — khi method dùng pointer receiver
4. **Represent "optional"** — `nil` pointer = không có giá trị (thay cho Option type)
5. **Shared state** — nhiều goroutine cần truy cập cùng data

**Dùng value (`T`) khi:**

1. **Small immutable data** — `time.Time`, small structs, primitives
2. **Thread safety** — value copy inherently safe, không cần lock
3. **Predictability** — function không thể mutate input bất ngờ

**Consistency rule:** Nếu một method dùng pointer receiver, TẤT CẢ methods của type đó nên dùng pointer receiver. Tránh mix — gây confusing.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nhắc đến consistency rule (mix pointer/value receivers gây confusing method set), và semantic của nil pointer (optional/absent) vs zero value struct
- ❌ Weak: Chỉ nói "dùng pointer khi cần modify" mà không giải thích size heuristic, interface satisfaction, hoặc nil semantics

### Q: What is escape analysis? 🔴 Senior

**A:** Escape analysis là quá trình compiler quyết định variable sẽ ở **stack** hay **heap**:

- **Stack**: nhanh, tự giải phóng khi function return, không cần GC
- **Heap**: chậm hơn, cần GC thu hồi, nhưng sống lâu hơn function scope

**Compiler rule**: Nếu compiler chứng minh được variable KHÔNG "escape" ra ngoài function scope → stack. Ngược lại → heap.

**Các trường hợp escape phổ biến:**

1. Return pointer đến local variable → escape
2. Gửi vào channel → escape
3. Gán vào variable có scope rộng hơn → escape
4. Variable quá lớn cho stack → escape
5. Gán vào interface value (compiler không biết concrete type lúc compile) → có thể escape

```bash
# Xem escape analysis
go build -gcflags="-m" ./...
# Output: "moved to heap: x", "does not escape"
```

**Ý nghĩa thực tế:** Không cần lo lắng quá — Go compiler rất thông minh. Chỉ optimize khi profiling cho thấy GC pressure cao. Premature optimization is the root of all evil.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích tại sao interface boxing causes escape (compiler không biết concrete type size at compile time — phải heap alloc), và cách dùng `go build -gcflags="-m"` để verify
- ❌ Weak: Nói "pointer thì heap, value thì stack" — đây là oversimplification sai. Compiler có thể stack-allocate ngay cả khi có pointer nếu không escape

### Q: What happens with nil pointer dereference? 🟢 Junior

**A:** Dereference nil pointer gây **runtime panic** — không phải compile error vì compiler không luôn biết pointer có nil không:

```go
var p *int          // p = nil
fmt.Println(*p)     // PANIC: runtime error: invalid memory address

// Safe pattern
if p != nil {
    fmt.Println(*p)
}
```

Method call trên nil pointer cũng panic TRỪ KHI method không dereference receiver:

```go
type List struct{ items []string }

func (l *List) Len() int {
    if l == nil { return 0 }   // nil receiver check — valid pattern
    return len(l.items)
}

var l *List   // nil
l.Len()       // OK! Returns 0 — method handles nil receiver
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Biết nil receiver method là valid pattern (giống `http.Handler` nil check), và phân biệt compile-time vs runtime — compiler không thể luôn detect nil pointer statically
- ❌ Weak: Nói "nil pointer luôn crash" mà không biết nil receiver method pattern

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                                                                | Đúng là                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| "Pointer thì heap, value thì stack" | Compiler escape analysis quyết định — không phải pointer/value                             | Compiler stack-allocates pointers nếu không escape; heap-allocates values nếu escape |
| Dùng `*interface{}`                 | Interface đã là pointer-like (type+data pointers) — thêm pointer nữa là indirection vô ích | Dùng `interface{}` hoặc concrete type                                                |
| Không check nil trước deref         | Nil dereference = runtime panic, không recover được clean                                  | Luôn guard `if ptr != nil` trước `*ptr`                                              |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: stack vs heap, GC pressure, performance optimization, nil panics
- → Nhớ đến: Escape analysis — compiler, không phải developer, quyết định stack/heap. Nil pointer panic là runtime, không compile time
- → Mở đầu trả lời: _"Go không có garbage collection pressure do pointer hay value — compiler's escape analysis quyết định location dựa trên lifetime. Return pointer đến local variable không phải bug — compiler auto-promotes to heap. Nil dereference là runtime panic, không compile error, vì compiler không luôn track nil statically."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Value Types vs Reference Types](#3-value-types-vs-reference-types) — copy semantics
- ➡️ Để hiểu tiếp: [Go Concurrency](./03-concurrency.md) — shared pointers cần synchronization; [Go Testing](./05-testing-profiling.md) — profiling heap allocations

#### Block C — Study Cases / Tình Huống Thực Tế Sâu

**Case: Docker — Escape analysis optimization giảm 40% GC pause trong container runtime**

Docker engineering team (2019 blog post) profiling containerd — core container runtime — phát hiện unexpected GC pressure trong hot path của container start/stop. `go tool pprof` cho thấy hàng triệu small allocations mỗi giây từ một struct được pass bằng value vào interface. Khi struct được assign vào `interface{}`, escape analysis buộc nó lên heap — mỗi assignment là 1 heap alloc. Fix: thay vì pass struct by value vào interface, họ dùng `sync.Pool` để reuse allocations và avoid interface boxing cho hot path. GC pause giảm từ ~8ms xuống ~5ms average. Bài học: interface boxing là invisible allocation cost — profiling trước khi optimize, nhưng biết escape analysis giúp interpret profiling data đúng hơn.

---

## 6. Slice Internals

> 🧠 **Memory Hook:** "Slice = thư mục chỉ mục (pointer+len+cap) + ngăn kéo thật (backing array). Copy thư mục không copy ngăn kéo."

**Tại sao tồn tại? / Why does this exist?**

Go cần dynamic arrays mà không có overhead của Java ArrayList hay Python list (object headers, GC overhead per element).
→ **Why?** Array cố định size không đủ linh hoạt cho real-world data. Dynamic allocation per-element (như linked list) quá chậm cho sequential access.
→ **Why?** Slice header design (3 fields, 24 bytes) là optimal: minimal overhead, O(1) slicing, amortized O(1) append.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Backing array là cuốn sách trong thư viện. Slice header là bookmark: trang bắt đầu (pointer), số trang bạn đang đọc (len), và tổng trang sách còn lại từ chỗ bắt đầu (cap). Nhiều bookmark có thể trỏ đến cùng cuốn sách — sửa trang thứ 5 thì tất cả bookmark đều thấy thay đổi.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
┌──────────────────────────────────────┐
│           Slice Header               │
├──────────┬──────────┬────────────────┤
│ pointer  │   len    │     cap        │
│ (8 bytes)│ (8 bytes)│   (8 bytes)    │
└────┬─────┴──────────┴────────────────┘
     │
     ▼
┌───┬───┬───┬───┬───┬───┬───┬───┐
│ 0 │ 1 │ 2 │ 3 │ 4 │ . │ . │ . │  ← Backing array (trên heap)
└───┴───┴───┴───┴───┴───┴───┴───┘
     ◄── len=5 ──►
     ◄────── cap=8 ─────────────►
```

- **pointer**: trỏ đến element đầu tiên của slice trong backing array
- **len**: số element hiện có (truy cập được)
- **cap**: số element tối đa trước khi cần allocate array mới

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

Growth strategy thay đổi ở Go 1.18 để tránh jump đột ngột tại cap=1024. Memory leak từ slice-of-large-array là production bug thực sự: GC không thu hồi backing array khi còn sub-slice reference dù chỉ dùng 5 bytes của 10MB array.

### Q: How does a slice work internally? 🟡 Mid

**A:** Slice là một **struct header** gồm 3 fields (24 bytes trên 64-bit):

- **pointer**: trỏ đến element đầu tiên của slice trong backing array
- **len**: số element hiện có (truy cập được)
- **cap**: số element tối đa trước khi cần allocate array mới

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Có thể vẽ diagram slice header + backing array, giải thích tại sao `len(s)` và `cap(s)` có thể khác nhau, và ý nghĩa của sub-slice chia sẻ backing array
- ❌ Weak: Nói "slice là dynamic array" mà không giải thích internal structure

### Q: How does slice growth work? 🟡 Mid

**A:** Khi `append()` vượt capacity, Go allocate backing array mới và copy data:

**Growth strategy (Go 1.18+):**

- `cap < 256`: double capacity (`newCap = oldCap * 2`)
- `cap >= 256`: tăng ~25% + padding (`newCap = oldCap + oldCap/4 + 192`)
- Sau đó round up theo memory allocator size classes

**Trước Go 1.18:**

- `cap < 1024`: double
- `cap >= 1024`: tăng 25%

Chiến lược mới smooth hơn — tránh jump đột ngột khi cap đạt 1024.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích tại sao growth strategy quan trọng — pre-allocate với `make([]T, 0, estimatedSize)` để tránh N reallocations trong hot path. Biết threshold thay đổi ở Go 1.18
- ❌ Weak: Chỉ nói "append double capacity" mà không biết threshold và pre-allocation pattern

### Q: What are common slice gotchas? 🔴 Senior

**A:**

**Gotcha 1: Shared backing array**

```go
a := []int{1, 2, 3, 4, 5}
b := a[1:3]    // b = [2, 3], shares backing array with a
b[0] = 999     // a is now [1, 999, 3, 4, 5] — SURPRISE!
```

**Gotcha 2: Append may or may not share**

```go
a := []int{1, 2, 3, 4, 5}
b := a[1:3]         // b = [2,3], len=2, cap=4
b = append(b, 999)  // cap enough → writes into a's backing array!
// a is now [1, 2, 3, 999, 5] — SURPRISE!
```

**Gotcha 3: Memory leak khi slice từ large array**

```go
// large là []byte 10MB
func getHeader(large []byte) []byte {
    return large[:5]  // Vẫn giữ reference đến 10MB array!
}
// Fix: copy ra slice mới
func getHeader(large []byte) []byte {
    h := make([]byte, 5)
    copy(h, large[:5])
    return h
}
```

**Full slice expression** `a[low:high:max]` — giới hạn capacity để tránh shared array issues:

```go
a := []int{1, 2, 3, 4, 5}
b := a[1:3:3]       // len=2, cap=2 (max-low = 3-1 = 2)
b = append(b, 999)  // cap exceeded → NEW backing array, safe!
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Biết và giải thích cả 3 gotchas, đặc biệt memory leak pattern và full slice expression `a[low:high:max]` như fix
- ❌ Weak: Chỉ biết gotcha 1 (shared backing array) mà không biết gotcha 2 (append with cap) và gotcha 3 (memory leak)

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                            | Đúng là                                                         |
| ---------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------- |
| Giả định append không ảnh hưởng caller   | Nếu cap đủ, append ghi vào shared backing array        | Pass `s[0:len(s):len(s)]` để force new backing array khi append |
| Return sub-slice của large response body | Sub-slice giữ toàn bộ large backing array trong memory | `copy` ra slice mới trước khi return                            |
| Không pre-allocate khi biết size         | N appends trong loop → log(N) reallocations            | `make([]T, 0, expectedSize)` trước loop                         |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: memory leaks, GC pressure, shared state bugs, performance optimization
- → Nhớ đến: Slice backing array sharing — sub-slice ghim toàn bộ backing array; append với còn cap viết đè
- → Mở đầu trả lời: _"Slice trong Go là 3-field struct header — pointer, len, cap — trỏ đến backing array. Sub-slicing chia sẻ backing array nên sửa element visible cả hai phía. Nguy hiểm hơn: append với đủ cap ghi đè vào backing array của original slice, và return sub-slice của large array ghim toàn bộ array trong memory dù chỉ dùng vài bytes."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Value Types vs Reference Types](#3-value-types-vs-reference-types) — slice header là value với internal pointer
- ➡️ Để hiểu tiếp: [Go Concurrency](./03-concurrency.md) — slice concurrent access cần sync; [Go Testing](./05-testing-profiling.md) — benchmark slice pre-allocation

#### Block C — Study Cases / Tình Huống Thực Tế Sâu

**Case: CloudFlare — Slice memory leak trong DNS response parser gây OOM**

CloudFlare's DNS-over-HTTPS service (Cloudflare 1.1.1.1) gặp memory leak không rõ nguyên nhân trong load testing. `pprof` heap profile cho thấy large byte slices không được GC. Root cause: DNS response parser nhận `[]byte` buffer 64KB từ network, parse xong trả về `[]byte` sub-slice chứa DNS record data — nhưng sub-slice giữ reference đến toàn bộ 64KB buffer. Với hàng triệu requests, hàng triệu 64KB buffers bị ghim trong memory. Fix: thêm `copy` step — parse ra sub-slice, rồi `copy` into fresh `make([]byte, len(subslice))` trước khi cache. Memory usage giảm từ ~8GB xuống ~200MB cho cùng load. Bài học: sub-slice là O(1) convenience nhưng có ẩn cost về memory lifetime — luôn `copy` khi return sub-slice ra ngoài scope ban đầu.

---

## 7. Map Internals

> 🧠 **Memory Hook:** "Map là tủ đựng 8 ngăn/bucket — hash key quyết định ngăn nào, rồi kiểm tra 8 slot trong ngăn. Khi đầy quá (>6.5 avg/bucket), mở thêm tủ mới và dọn dần."

**Tại sao tồn tại? / Why does this exist?**

Go cần O(1) average lookup data structure tích hợp vào language, không phải library add-on.
→ **Why?** Hash table là data structure phổ biến nhất trong backend development — key-value lookup, deduplication, indexing.
→ **Why?** Design của Go map (8 items/bucket, incremental rehash) tối ưu cho cache locality và amortized performance hơn chained hash tables truyền thống.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Map như tòa nhà văn phòng với tầng (bucket) và phòng (slot). Khi bạn đến tìm người, bảo vệ hash tên bạn → chọn tầng → lên tầng đó và check 8 phòng. Nếu tầng quá đông (load factor > 6.5), tòa nhà mở rộng thêm tầng và chuyển dần người sang — không chuyển tất cả cùng lúc vì quá tốn thời gian.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
hmap struct:
  count, B (log2 bucket count), flags, buckets pointer
     │
     ▼
  Bucket (bmap):
    tophash [8]uint8    ← high 8 bits of hash (quick comparison)
    keys    [8]KeyType
    values  [8]ValueType
    overflow *bmap      ← chain to next bucket if >8 items
```

1. Hash key → lấy hash value
2. Low B bits → chọn bucket index
3. High 8 bits (tophash) → so sánh nhanh trong bucket
4. Full key comparison chỉ khi tophash match
5. Load factor 6.5 → grow: double buckets + incremental evacuation

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Không thể take address của map element (`&m[key]` compile error) — map có thể rehash và move elements
- Concurrent read+write gây fatal error (không recover được) — không phải panic
- Iteration order random intentionally — security (hash DoS protection) + prevent dependency on order

### Q: How does Go's map work internally? 🔴 Senior

**A:** Go map là **hash table** implementation trong `runtime/map.go`:

**Cơ chế hoạt động:**

1. **Hash key** → lấy hash value (dùng hash function tùy key type)
2. **Low B bits** của hash → chọn bucket (bucket index)
3. **High 8 bits** (tophash) → so sánh nhanh trong bucket (tránh full key comparison)
4. Mỗi bucket chứa **8 key-value pairs** — nếu đầy, tạo **overflow bucket** (chaining)

**Load factor = 6.5**: Khi `count / 2^B > 6.5`, map sẽ **grow** — double số buckets và **incremental evacuate** (không copy tất cả cùng lúc, mỗi insert/delete di chuyển 1-2 buckets cũ).

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích tại sao tophash optimization quan trọng (so sánh uint8 trước khi compare full key — huge speedup với large key types), và tại sao incremental evacuation (thay vì stop-the-world copy) ảnh hưởng latency
- ❌ Weak: Nói "map là hash table" mà không giải thích bucket structure hay incremental rehash

### Q: Why is map NOT thread-safe? 🟡 Mid

**A:** Go map **không có built-in locking** — concurrent read+write gây **fatal error** (không phải panic, không recover được):

```
fatal error: concurrent map read and map write
```

Go cố tình KHÔNG làm map thread-safe vì:

1. **Performance** — mutex cho mọi operation quá tốn kém cho single-goroutine use case (phổ biến nhất)
2. **Explicit is better** — developer phải chọn sync strategy phù hợp

**Solutions:**

- `sync.Mutex` hoặc `sync.RWMutex` wrapper — đơn giản, general purpose
- `sync.Map` — optimized cho 2 patterns: (1) write-once-read-many, (2) key-disjoint goroutines. KHÔNG phải "thread-safe map" general purpose

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Biết đây là **fatal error** (không recover được), không phải panic. Giải thích khi nào `sync.Map` appropriate vs `sync.RWMutex` wrapper (write-once-read-many vs general concurrent access)
- ❌ Weak: Nói "dùng sync.Map cho thread-safe map" mà không biết sync.Map có specific use cases — dùng sai pattern thì chậm hơn mutex

### Q: Why is map iteration order random? 🟡 Mid

**A:** Go **cố tình randomize** iteration order (từ Go 1.0). Lý do:

1. **Hash table không đảm bảo order** — phụ thuộc hash function, resize timing
2. **Tránh developer phụ thuộc vào order** — nếu order "tình cờ" ổn định, code sẽ giả định order, rồi break khi runtime thay đổi
3. **Security** — random seed mỗi lần chạy giúp chống hash collision DoS attacks

Runtime thêm random offset vào starting bucket khi iterate — nên cùng map, mỗi `range` cho thứ tự khác.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích security angle (hash DoS — kẻ tấn công có thể craft input gây worst-case O(n) lookup nếu biết hash function + seed), và engineering angle (prevent accidental order dependency trong tests)
- ❌ Weak: Chỉ nói "hash table không có order" mà không giải thích tại sao Go **cố tình** randomize (extra step, không phải natural behavior)

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                    | Tại sao sai                                     | Đúng là                                                 |
| ------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------- |
| `&m[key]` để lấy pointer đến map value     | Compiler error — map rehash di chuyển elements  | Copy value ra variable rồi lấy `&variable`              |
| Concurrent map read+write với goroutines   | Fatal error — program crash, không recover      | Dùng `sync.RWMutex` wrapper hoặc channel-based access   |
| Dùng `sync.Map` cho general concurrent map | `sync.Map` chỉ optimal cho write-once-read-many | `sync.RWMutex` + regular map cho general concurrent use |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: concurrent data access, hash collision, performance của map operations, memory layout
- → Nhớ đến: Map = hash table với 8-slot buckets, incremental rehash, fatal error on concurrent write (không recover)
- → Mở đầu trả lời: _"Go map là hash table với 8 key-value slots per bucket. Hash key xác định bucket, tophash (8-bit prefix) cho quick comparison trước khi full key compare. Map không thread-safe vì Go cố tình — concurrent read+write là fatal error không recover được, không phải panic. Developer chọn sync strategy: RWMutex cho general use, sync.Map cho write-once-read-many."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Value Types vs Reference Types](#3-value-types-vs-reference-types) — map là pointer passed by value
- ➡️ Để hiểu tiếp: [Go Concurrency](./03-concurrency.md) — sync.Map, RWMutex, goroutine-safe patterns

#### Block C — Study Cases / Tình Huống Thực Tế Sâu

**Case: Grab — Concurrent map write crash trong driver matching service**

Grab's driver matching service (2019) gặp intermittent crash chỉ xảy ra dưới peak load (New Year's Eve, major events). Stack trace: `fatal error: concurrent map read and map write`. Root cause: một global map cache driver locations được đọc và ghi từ nhiều goroutines xử lý incoming location updates. Vì crash chỉ ở peak load, không bao giờ reproduce trong testing (ít goroutines). Fix: replace global map với `sync.RWMutex`-protected struct, sau đó migrate sang sharded map (16 shards với separate mutex) vì single RWMutex vẫn có contention. Latency giảm 15% so với single mutex. Bài học: fatal error không phải panic — không có recover, toàn bộ service crash. Race detector (`go test -race`) là mandatory trong CI.

---

## Interview Q&A Summary / Tổng Hợp Q&A Phỏng Vấn

| #   | Question                                           | Difficulty | Core Concept       | Key Signal                                                                              |
| --- | -------------------------------------------------- | ---------- | ------------------ | --------------------------------------------------------------------------------------- |
| 1   | Why was Go created? What problems does it solve?   | 🟢         | Go Philosophy      | Kể 2+ concrete Google problems (compile time, concurrency), simplicity là design goal   |
| 2   | What are the important Go Proverbs?                | 🟡         | Go Philosophy      | Giải thích trade-off đằng sau 2+ proverbs, không chỉ đọc thuộc                          |
| 3   | How does Go handle composition over inheritance?   | 🟢         | Go Philosophy      | Promoted methods là delegation (receiver vẫn là embedded type)                          |
| 4   | Explain Go's type system and all basic types       | 🟢         | Type System        | `int` platform-dependent, `byte` vs `uint8` semantics                                   |
| 5   | What are the zero values for all types in Go?      | 🟢         | Type System        | `nil` slice functional với append, `nil` map panic on write                             |
| 6   | Type alias vs type definition — difference?        | 🟡         | Type System        | `UserID`/`OrderID` domain safety, alias là refactoring tool                             |
| 7   | How does type inference work in Go?                | 🟢         | Type System        | Static inference (compile time), không phải dynamic typing                              |
| 8   | Is Go pass-by-value or pass-by-reference?          | 🟡         | Value vs Reference | LUÔN pass-by-value, "copy của gì" là key (slice header, map pointer)                    |
| 9   | Why does Go not have "reference types" officially? | 🔴         | Value vs Reference | `runtime.hmap`/`runtime.hchan`, reassign map inside function không ảnh hưởng caller     |
| 10  | Explain struct value semantics and embedding       | 🟡         | Structs            | Promoted method receiver vẫn là embedded type, shadow ≠ override                        |
| 11  | What are struct tags and how do they work?         | 🟡         | Structs            | Runtime reflection data, `go vet` để catch tag errors                                   |
| 12  | Explain method sets and their rules                | 🔴         | Structs            | Addressability — interface value không có stable address cho pointer receiver           |
| 13  | When should you use pointers vs values?            | 🟡         | Pointers           | Consistency rule, nil pointer semantics (optional/absent), 64-byte heuristic            |
| 14  | What is escape analysis?                           | 🔴         | Pointers           | Interface boxing causes escape, `go build -gcflags="-m"` verify                         |
| 15  | What happens with nil pointer dereference?         | 🟢         | Pointers           | Nil receiver method valid pattern, compile-time vs runtime                              |
| 16  | How does a slice work internally?                  | 🟡         | Slice Internals    | Vẽ diagram header (ptr+len+cap) + backing array                                         |
| 17  | How does slice growth work?                        | 🟡         | Slice Internals    | Go 1.18 threshold change, `make([]T, 0, size)` pre-allocate                             |
| 18  | What are common slice gotchas?                     | 🔴         | Slice Internals    | 3 gotchas: shared array, append-with-cap overwrite, memory leak + full slice `a[l:h:m]` |
| 19  | How does Go's map work internally?                 | 🔴         | Map Internals      | 8-slot buckets, tophash optimization, incremental evacuation                            |
| 20  | Why is map NOT thread-safe?                        | 🟡         | Map Internals      | Fatal error (không recover), `sync.Map` chỉ 2 specific patterns                         |
| 21  | Why is map iteration order random?                 | 🟡         | Map Internals      | Security (hash DoS), prevent accidental order dependency                                |

**Distribution:** 🟢 Junior × 6 | 🟡 Mid × 10 | 🔴 Senior × 5

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Bất Chợt

> **Scenario:** Senior engineer hỏi bất chợt trong phỏng vấn: "Is Go pass-by-value or pass-by-reference?"

**30-second answer:**

"Go luôn pass-by-value — không có exception. Nhưng 'value' của một số type chứa pointer: slice header là struct gồm pointer+len+cap, map là pointer đến `runtime.hmap`. Khi copy slice header, cả bản gốc và bản copy cùng trỏ đến backing array — nên modify element visible cả hai phía. Nhưng reassign map variable hoặc append vượt cap thì chỉ ảnh hưởng bản copy, vì chúng ta copy pointer chứ không phải reference."

**Nếu hỏi thêm:** "So is a map a reference type?"

"Go spec không dùng khái niệm 'reference type'. Map là pointer `*runtime.hmap` được pass by value. Nếu bạn reassign map variable inside function, caller không thấy — đó là sự khác biệt cốt lõi so với true pass-by-reference trong C++."

---

## 🔄 Self-Check / Tự Kiểm Tra

> **Hướng dẫn:** Đóng tài liệu lại. Trả lời từng câu bằng cách viết ra giấy hoặc nói thành tiếng. Sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                     |
| --- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Go cố tình KHÔNG có 3 thứ gì? Lý do kỹ thuật cho mỗi thứ?                                                   |
| 2   | 🎨 Visual      | Vẽ diagram slice header (ptr, len, cap) khi `append()` vượt capacity — chuyện gì xảy ra với caller?         |
| 3   | 🛠️ Application | Viết code minh họa shared backing array bug và full slice expression `s[low:high:max]` fix.                 |
| 4   | 🐛 Debug       | `var m map[string]int; m["key"] = 1` — chuyện gì xảy ra? Tại sao? Làm sao fix?                              |
| 5   | 🎓 Teach       | Giải thích cho junior: embedding trong Go khác inheritance trong Java ở điểm nào? Dùng ví dụ struct cụ thể. |

### Key Points (tự kiểm tra)

| #   | Đáp án nhanh                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | No inheritance (composition), no exceptions (explicit error), no generics ban đầu (simplicity). Mỗi thứ có lý do từ Google-scale problems. |
| 2   | New backing array allocated → function sees new array, caller keeps old header (old ptr, old len, old cap).                                |
| 3   | `b := a[1:3:3]` — cap=2, append tạo new array, tránh overwrite shared backing array.                                                       |
| 4   | Panic: assignment to entry in nil map. Fix: `m = make(map[string]int)` hoặc `m = map[string]int{}`.                                        |
| 5   | Promoted method receiver vẫn là embedded type, không có polymorphism. Go dùng interface cho polymorphism thay vì class hierarchy.          |

💬 **Feynman Prompt:** Giải thích cho một developer Python tại sao Go dùng value semantics mặc định (pass-by-value) thay vì reference semantics — và khi nào cần dùng pointer. Dùng ví dụ slice vs struct để minh họa sự khác biệt.

### 📅 Spaced Repetition / Lặp Lại Cách Quãng

- **Ngày 1 (hôm nay):** Đọc toàn bộ + làm Self-Check
- **Ngày 3:** Chỉ làm Self-Check (không mở tài liệu)
- **Ngày 7:** Chỉ làm Cold Call + 3 câu Self-Check khó nhất
- **Ngày 14:** Review Interview Q&A Summary — đánh giá câu nào còn yếu
- **Ngày 30:** Mock interview với partner — dùng bảng Summary làm question bank

---

## 🔗 Connections / Liên Kết Kiến Thức

### Trong cùng track (BE → Go)

| Topic                    | Connection                                                                                                                  | File                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Go Interfaces & Generics | Method sets rule từ Section 4 quyết định interface satisfaction; implicit interface là triết lý Go Philosophy               | [02-interfaces-generics.md](./02-interfaces-generics.md) |
| Go Concurrency           | Goroutines implement "share memory by communicating" (Proverb); map concurrent access → fatal error; slice sharing cần sync | [03-concurrency.md](./03-concurrency.md)                 |
| Go Memory & GC           | Escape analysis (Section 5) quyết định stack/heap; slice growth (Section 6) tạo GC pressure                                 | [04-memory-gc.md](./04-memory-gc.md)                     |
| Go Testing & Profiling   | `go test -race` detect concurrent map bug; `pprof` để verify escape analysis optimization                                   | [05-testing-profiling.md](./05-testing-profiling.md)     |
| Go Data Structures       | Slice/map internals là foundation cho custom data structures implementation                                                 | [06-data-structures-go.md](./06-data-structures-go.md)   |

### Cross-track connections

| Topic         | Connection                                                                               | File                                                              |
| ------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| OS Theory     | Thread model (goroutine vs OS thread), memory layout (stack vs heap), process scheduling | [OS Theory](../../shared/01-cs-fundamentals/os-theory.md)         |
| API Design    | Go's error handling philosophy ảnh hưởng API error response design                       | [API Design](../02-backend-knowledge/01-api-design.md)            |
| System Design | Go's concurrency model là foundation cho backend service design patterns                 | [Design Framework](../04-be-system-design/01-design-framework.md) |

---

## Quick Recap / Tóm Tắt Nhanh

### Key Takeaways / Điểm Chính

- **Go is value-typed by default** — assignment copies the value; use pointers to share / **Go mặc định là value type** — gán biến là copy; dùng pointer để chia sẻ.
- **Slices are 3-word headers** (ptr + len + cap), not the underlying array — appending may allocate a new array / **Slice là header 3 từ** (ptr + len + cap), không phải mảng thật — append có thể cấp phát mảng mới.
- **Maps are unordered hash tables**; zero value is `nil` — always make before use / **Map là hash table không có thứ tự**; zero value là `nil` — luôn phải make trước khi dùng.
- **Interfaces are implicit** — any type with the right methods satisfies the interface, no declaration needed / **Interface là implicit** — type nào có đủ method là thoả mãn, không cần khai báo.
- **`defer` runs LIFO** at function return; captures variables by reference (closure) / **`defer` chạy LIFO** khi function kết thúc; capture biến theo tham chiếu (closure).
- **Error handling is explicit** — return `error` as last value; never ignore `_` in production / **Xử lý lỗi là tường minh** — trả `error` ở cuối; đừng bao giờ bỏ qua `_` trong production.
- **`make` vs `new`**: `make` for slices/maps/channels (returns initialised value); `new` for any type (returns zero-value pointer) / **`make` vs `new`**: `make` dùng cho slice/map/channel; `new` dùng cho mọi type trả pointer zero-value.
- **Stack vs Heap**: Go compiler decides via escape analysis; variables that escape the function are heap-allocated / **Stack vs Heap**: compiler quyết định qua escape analysis; biến thoát ra ngoài function thì cấp phát trên heap.

### Interview Tips / Mẹo Phỏng Vấn

- **"What's the difference between a slice and an array?"** — Always mention len/cap header, append behaviour, and that slices share underlying arrays / **"Slice và array khác nhau thế nào?"** — Luôn nhắc header len/cap, hành vi append, và slice chia sẻ mảng nền.
- **"When do you use a pointer receiver?"** — When the method must mutate state, or the struct is large (avoid copy cost) / **"Khi nào dùng pointer receiver?"** — Khi method cần thay đổi state, hoặc struct lớn để tránh copy.
- **"How does interface nil work?"** — An interface is nil only if both type AND value are nil; a typed nil satisfies the interface but is not == nil / **"Interface nil hoạt động thế nào?"** — Interface chỉ nil khi cả type lẫn value đều nil; typed nil vẫn thoả mãn interface nhưng không bằng nil.
- **"What does `defer` capture?"** — Named return values are shared; loop variable in defer needs explicit copy / **"`defer` capture cái gì?"** — Named return value được chia sẻ; biến vòng lặp trong defer cần copy tường minh.
- **"How do you handle errors in Go?"** — Wrap with `fmt.Errorf("%w", err)` for sentinel matching; use `errors.Is/As` to inspect the chain / **"Xử lý lỗi trong Go thế nào?"** — Wrap bằng `fmt.Errorf("%w", err)` để matching; dùng `errors.Is/As` để kiểm tra chuỗi lỗi.
