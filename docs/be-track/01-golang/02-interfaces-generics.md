# Interfaces & Generics in Go — Deep Theory & Interview Questions

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Go Language Fundamentals](./01-language-fundamentals.md)
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> **Phạm vi**: Interface semantics, internal representation (iface/eface), design principles, generics (Go 1.18+), reflection.
> Tập trung lý thuyết sâu (~75%), code minh hoạ ngắn gọn (~25%) — phù hợp ôn phỏng vấn Golang Backend.

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn đang xây dựng **payment service** tại Grab. Ban đầu chỉ hỗ trợ Stripe. Sau 3 tháng, cần thêm VNPay, MoMo, ZaloPay. Nếu code ban đầu hardcode `StripeClient`, mỗi lần thêm payment method phải sửa business logic.

**Interface giải quyết bằng cách:** `ProcessPayment(p PaymentProvider)` nhận bất kỳ struct nào có method `Charge(amount float64) error` — Stripe, VNPay, MoMo đều được, không cần sửa business logic, không cần khai báo `implements`. Sau Go 1.18, generics cho phép viết `Min[T constraints.Ordered](a, b T)` thay vì 3 hàm riêng cho `int`, `float64`, `string`.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Interface trong Go giống như **ổ cắm điện tiêu chuẩn**. Ổ cắm không biết cái gì cắm vào — điện thoại, máy tính, quạt — miễn là phích cắm đúng hình dạng (đúng method signature) là hoạt động. Nhà sản xuất thiết bị không cần xin phép người tạo ổ cắm.

**Why Go's approach is different:** Java/C# require explicit `implements ClassName` — tight coupling between the type and the interface. Go's **implicit satisfaction** means any type automatically satisfies an interface if it has the right methods. This enables **retroactive design**: you define an interface AFTER the concrete types exist, which is impossible in Java without modifying the original class.

**Why Generics (Go 1.18):** Before generics, writing a `Min` function required either `interface{}` (losing type safety) or 3 separate functions (`MinInt`, `MinFloat64`, `MinString`). Generics let you write it once with compile-time type checking.

## Concept Map / Bản Đồ Khái Niệm

```
[Go Structs + Methods]
        │
        ▼
[Interfaces — implicit satisfaction]
        │
        ├──► Small interfaces (io.Reader, io.Writer) → composability
        ├──► Dependency injection → testability (mock = new struct)
        ├──► Empty interface (any) → escape hatch for unknown types
        │
        ▼
[Generics (Go 1.18) — type parameters]
        │
        ├──► Constraints → type-safe generics
        └──► Replaces: interface{} + type assertion patterns

[Reflection] ← inspect types at runtime (slower, use sparingly)
```

---

## 1. Interface Basics

### Q1: Interface trong Go hoạt động theo cơ chế nào? Tại sao gọi là "implicit satisfaction"? 🟢

**A:**

Go sử dụng **structural typing** (hay thường gọi là **duck typing** tại compile time): một type **tự động** satisfy một interface nếu nó implement đủ tất cả method trong interface đó — **không cần khai báo `implements` tường minh** như Java/C#.

**So sánh với Java/C#:**

| Đặc điểm | Go (Implicit) | Java/C# (Explicit) |
|-----------|---------------|---------------------|
| Khai báo implement | Không cần | Bắt buộc `implements`/`:` |
| Coupling | Thấp — type không biết interface tồn tại | Cao — type phụ thuộc interface |
| Retroactive implementation | ✅ Thêm interface sau cho type đã tồn tại | ❌ Phải sửa type gốc |
| Third-party type | Có thể satisfy interface của bạn | Không thể (trừ wrapper) |

**Retroactive implementation** là sức mạnh lớn nhất: định nghĩa interface **sau khi** type đã tồn tại, thậm chí cho type từ thư viện bên ngoài → **decoupling hoàn toàn**.

```go
// Package A defines a type (knows nothing about any interface)
type Dog struct{ Name string }
func (d Dog) Speak() string { return "Woof!" }

// Package B defines an interface (knows nothing about Dog)
type Speaker interface { Speak() string }

// Dog automatically satisfies Speaker — no modification needed
var s Speaker = Dog{Name: "Rex"} // compiles fine
```

> **Lưu ý phỏng vấn**: "Implicit satisfaction" là nền tảng để hiểu tại sao Go khuyến khích **small interfaces** — vì càng ít method, càng nhiều type tự nhiên satisfy mà không cần sửa đổi.

---

### Q2: Empty interface (`interface{}` / `any`) là gì? Khi nào nên dùng? 🟢

**A:**

**Empty interface** không có method nào → **mọi type** đều satisfy nó. Từ Go 1.18, `any` là alias cho `interface{}`.

**Khi nào dùng:** Container tổng quát (pre-generics), JSON decoding (`map[string]any`), logging/debugging (`fmt.Println`), plugin systems.

**Khi nào KHÔNG dùng:** Khi biết rõ type, khi cần type safety (dùng generics), khi chỉ cần vài type (dùng constraint).

**Chi phí**: Mất type safety tại compile time, cần type assertion khi lấy giá trị ra, compiler không thể optimize.

> **Quy tắc**: `any` là escape hatch — dùng càng ít càng tốt. Trong Go 1.18+, hãy tự hỏi "generics có giải quyết được không?".

---

### Q3: Interface as contract — điều gì xảy ra nếu method signature không khớp chính xác? 🟡

**A:**

Compiler yêu cầu **chính xác 100%** về method signature: tên method, parameter types, return types, số lượng parameters — tất cả phải khớp.

**Những trường hợp KHÔNG satisfy:**

| Tình huống | Satisfy? | Lý do |
|-----------|----------|-------|
| Method trên pointer receiver `*T` | Type `T` ❌, `*T` ✅ | Value không thể gọi pointer method |
| Method trên value receiver `T` | Cả `T` ✅ và `*T` ✅ | Pointer luôn có thể dereference |
| Tên method giống, param type khác | ❌ | Không phải overloading |
| Return thêm error | ❌ | Signature không khớp |

**Receiver rule** là câu hỏi phỏng vấn phổ biến nhất:

```go
type Writer interface { Write([]byte) (int, error) }
type MyWriter struct{}
func (m *MyWriter) Write(p []byte) (int, error) { return len(p), nil }

var w Writer = MyWriter{}   // ❌ Compile error
var w Writer = &MyWriter{}  // ✅ *MyWriter có Write
```

**Lý do**: value `MyWriter` có thể là bản copy, không lấy được address ổn định → Go không cho phép gọi pointer receiver method trên value.

---

## 2. Interface Internals

### Q4: Bên trong runtime, interface được biểu diễn bằng cấu trúc gì? Phân biệt iface vs eface? 🔴

**A:**

Go runtime sử dụng **2 struct khác nhau** tuỳ loại interface:

**`eface` — empty interface** (16 bytes): `{ _type *_type, data unsafe.Pointer }`
- `_type`: pointer tới type metadata (size, kind, hash, methods)
- `data`: pointer tới actual value (hoặc value trực tiếp nếu ≤ pointer size)

**`iface` — interface with methods** (16 bytes): `{ tab *itab, data unsafe.Pointer }`
- `tab`: pointer tới **itab** — chứa type info VÀ method dispatch table
- `data`: pointer tới actual value

**So sánh:**

| | eface | iface |
|---|-------|-------|
| Khi nào dùng | `interface{}` / `any` | Interface có method(s) |
| Type info | `_type` pointer | Nằm trong `itab` |
| Method table | Không có | Có — mảng function pointers |
| Size | 16 bytes | 16 bytes |
| Dispatch cost | Không (không có method) | 1 indirect call qua itab |

**Hệ quả quan trọng**: bất kỳ giá trị nào gán vào interface đều trở thành **2-word struct** (16 bytes trên 64-bit). Đây là lý do interface value **không bao giờ nil** nếu concrete type đã được gán — ngay cả khi data pointer là nil.

---

### Q5: itab (interface table) hoạt động ra sao? Method dispatch qua interface tốn bao nhiêu? 🔴

**A:**

**Cấu trúc itab** gồm: `inter` (interface type metadata), `_type` (concrete type metadata), `hash` (fast type switch), và `fun` (variable-length method pointer array).

**Method dispatch flow:**
1. Compiler biết method index tại compile time (ví dụ `Read` là method #0 trong `io.Reader`)
2. Runtime lấy `itab` từ interface value → gọi `itab.fun[index]` — **indirect function call**

**Chi phí so với direct call:**

| Call type | Cost | Lý do |
|-----------|------|-------|
| Direct (concrete type) | ~1-2ns | Compiler inline được, branch prediction tốt |
| Interface dispatch | ~3-5ns | 1 memory load (itab) + 1 indirect call, không inline được |
| Reflection | ~100-500ns | Nhiều lookup, allocation |

**itab caching**: Go runtime **cache itab** trong global hash table. Khi gán concrete type vào interface lần đầu, runtime tính toán itab và cache lại. Lần sau cùng pair (interface type, concrete type) → tra cache O(1).

**Tại sao interface call không inline được?**
Compiler không biết concrete type tại compile time → không biết gọi hàm nào → không thể inline. Đây là trade-off cơ bản: **flexibility (polymorphism) vs performance (inlining)**.

> **Phỏng vấn nâng cao**: Nếu hot path gọi interface method triệu lần/giây với cùng 1 concrete type, hãy xem xét dùng concrete type trực tiếp hoặc generics để compiler inline được.

---

### Q6: "Nil interface" vs "Interface holding nil" — bug phổ biến nhất? 🟡

**A:**

**Gotcha kinh điển** xuất phát từ iface/eface struct:
- **Nil interface**: cả `tab` và `data` đều nil → `== nil` ✅
- **Interface holding nil**: `tab` = valid itab, `data` = nil → `== nil` ❌

```go
func getError() error {
    var err *MyError = nil  // typed nil pointer
    return err              // ❌ returns non-nil interface holding nil pointer!
}

if getError() != nil {
    // ALWAYS enters here — vì interface có type info dù data = nil
}
```

**Fix pattern:**

```go
func getError() error {
    var err *MyError = nil
    if err == nil {
        return nil  // ✅ return untyped nil → nil interface
    }
    return err
}
```

> **Quy tắc**: Luôn return `nil` trực tiếp thay vì return một typed nil variable khi hàm return interface.

---

## 3. Interface Design Principles

### Q7: "Accept interfaces, return structs" — tại sao đây là nguyên tắc vàng? 🟡

**A:**

Đây là một trong những Go proverbs quan trọng nhất, dựa trên lý do:

**Accept interfaces (tham số):** Flexibility (caller truyền bất kỳ implementation), testability (mock/stub), decoupling (không phụ thuộc concrete type).

**Return structs (giá trị trả về):** Clarity (caller biết chính xác type), no allocation overhead (stack-allocatable), forward compatibility (thêm method vào struct không break code; thêm method vào interface break TẤT CẢ implementations).

**Ví dụ:**

```go
// ✅ Good
func NewServer(logger Logger, store DataStore) *Server { ... }
// ❌ Bad — returns interface / accepts concrete
func NewServer(logger *ZapLogger, store *PostgresStore) ServerInterface { ... }
```

**Ngoại lệ** khi return interface: factory pattern (nhiều implementations), standard library interfaces (`error`, `io.Reader`), hide unexported struct.

---

### Q8: Rob Pike nói "The bigger the interface, the weaker the abstraction" — giải thích? 🟡

**A:**

Đây là trích dẫn từ Go Proverbs, thể hiện **triết lý thiết kế cốt lõi** của Go:

**Toán học đơn giản:**
- Interface có **N methods** → chỉ những type implement **đủ N methods** mới satisfy
- N càng lớn → càng ÍT type satisfy → interface càng KẾCH SÚ specific → abstraction càng YẾU

**So sánh thực tế:**

| Interface | Methods | Abstraction |
|-----------|---------|-------------|
| `io.Reader` | 1 | Rất mạnh — hàng nghìn types satisfy |
| `io.ReadWriteCloser` | 3 | Trung bình |
| Hypothetical 20+ method interface | 20+ | Rất yếu — gần như chỉ 1 type |

**Thống kê standard library:** ~70% interfaces có 1 method, ~15% có 2 methods, ~15% có 3+.

> **Interface Segregation Principle (SOLID)** hoàn toàn tương đồng: "Clients should not be forced to depend on interfaces they do not use."

---

## 4. Common Standard Library Interfaces

### Q9: Liệt kê và giải thích các interface quan trọng nhất trong standard library? 🟢

**A:**

| Interface | Package | Method(s) | Tại sao quan trọng |
|-----------|---------|-----------|---------------------|
| `Reader` | `io` | `Read(p []byte) (n int, err error)` | Abstraction cho MỌI nguồn data có thể đọc |
| `Writer` | `io` | `Write(p []byte) (n int, err error)` | Abstraction cho MỌI đích có thể ghi |
| `Closer` | `io` | `Close() error` | Resource cleanup pattern |
| `Stringer` | `fmt` | `String() string` | Tương đương `toString()` — fmt package tự gọi |
| `error` | builtin | `Error() string` | Nền tảng error handling trong Go |
| `Interface` | `sort` | `Len()`, `Less(i,j)`, `Swap(i,j)` | Custom sorting (trước generics) |
| `Handler` | `net/http` | `ServeHTTP(ResponseWriter, *Request)` | Nền tảng HTTP server |
| `Marshaler` | `encoding/json` | `MarshalJSON() ([]byte, error)` | Custom JSON serialization |

**Tại sao `io.Reader` là interface quan trọng nhất?** Chỉ 1 method nhưng implement bởi: `*os.File`, `*bytes.Buffer`, `*strings.Reader`, `net.Conn`, `*http.Response.Body`, `*gzip.Reader`, `*bufio.Reader`... Bất kỳ hàm nhận `io.Reader` đều hoạt động với TẤT CẢ nguồn data trên.

**`error` interface đặc biệt:** Là builtin interface duy nhất. Mọi type có `Error() string` đều là error → custom error types, error wrapping (`%w`), error inspection (`errors.Is`, `errors.As`).

---

### Q10: Composition pattern trong standard library — io.ReadWriter được xây dựng thế nào? 🟢

**A:**

Standard library sử dụng **interface embedding** rất triệt để:

```go
// Small, focused interfaces
type Reader interface { Read(p []byte) (n int, err error) }
type Writer interface { Write(p []byte) (n int, err error) }
type Closer interface { Close() error }
type Seeker interface { Seek(offset int64, whence int) (int64, error) }

// Composed interfaces — built from small ones
type ReadWriter interface { Reader; Writer }
type ReadCloser interface { Reader; Closer }
type WriteCloser interface { Writer; Closer }
type ReadWriteCloser interface { Reader; Writer; Closer }
type ReadWriteSeeker interface { Reader; Writer; Seeker }
```

**Pattern này tuân theo mô hình tổ hợp (combinatorial)**: từ 4 interface cơ bản, tạo được nhiều biến thể mà không duplicate method signatures. Đây là minh hoạ hoàn hảo cho "compose small interfaces".

---

## 5. Interface Composition

### Q11: Interface embedding khác gì struct embedding? Có giới hạn gì? 🟡

**A:**

| Đặc điểm | Interface embedding | Struct embedding |
|-----------|-------------------|-----------------|
| Kết quả | Gộp method sets | Promoted methods + fields |
| Conflict | Compile error nếu cùng tên khác signature | Ambiguity — cần explicit access |
| Diamond problem | Hợp lệ nếu cùng signature (de-duplicate) | Cần disambiguate |

**Diamond embedding trong interface:**

```go
type A interface { Do() }
type B interface { A; Extra() }
type C interface { A; Other() }
type D interface { B; C } // ✅ OK — Do() xuất hiện 2 lần nhưng cùng signature
```

Go giải quyết diamond problem cho interface bằng cách **de-duplicate**: nếu cùng method signature xuất hiện nhiều lần qua nhiều đường embed, nó chỉ tính 1 lần. Compile error chỉ xảy ra khi **cùng tên nhưng khác signature**.

**Best practice composition:**
1. Bắt đầu với interface 1 method
2. Compose khi cần — đừng tạo "god interface" từ đầu
3. Đặt tên rõ ràng: `ReadWriter` (không phải `ReaderAndWriter`)
4. Consumer package nên định nghĩa interface nó cần (không phải provider package)

---

## 6. Type Assertion and Type Switch

### Q12: Type assertion hoạt động thế nào internally? Khi nào dùng comma-ok? 🟡

**A:**

**Type assertion** trích xuất concrete type từ interface value — kiểm tra `itab`/`_type` có khớp target type không.

```go
value := iface.(ConcreteType)           // Panic nếu sai type
value, ok := iface.(ConcreteType)       // Comma-ok — an toàn
if rw, ok := r.(io.ReadWriter); ok { }  // Assert sang interface khác
```

**Quy tắc**: Dùng dạng panic khi chắc chắn 100%. Dùng comma-ok khi không chắc chắn (pattern phổ biến hơn).

**Assert sang interface khác** là cách `io.Copy` optimize: kiểm tra `Reader` có implement `WriterTo` hay `Writer` có implement `ReaderFrom` không.

---

### Q13: Type switch — so sánh hiệu năng với chuỗi if-else type assertion? 🟡

**A:**

**Type switch** là syntactic sugar nhưng compiler có thể optimize tốt hơn chuỗi if-else:

```go
switch v := iface.(type) {
case *bytes.Buffer:
    // v is *bytes.Buffer
case string:
    // v is string
case nil:
    // iface is nil
default:
    // unknown type
}
```

**So sánh hiệu năng:**

| Approach | Cơ chế | Performance |
|----------|--------|-------------|
| Type switch | Compiler có thể dùng hash-based jump (từ `itab.hash`) | O(1) amortized cho nhiều cases |
| Chuỗi if-else assertion | Sequential check | O(n) với n cases |
| Single type assertion | Direct type compare | O(1) |

**Khi nào dùng type switch:**
- Xử lý **union-like** types (ví dụ: JSON value có thể là string, number, bool, array, object)
- **Visitor pattern** — xử lý khác nhau theo concrete type
- **Protocol handling** — khác nhau theo message type

**Anti-pattern**: Type switch > 5 cases → code smell. Xem xét thêm method vào interface, strategy pattern với map, hoặc redesign để tận dụng polymorphism.

---

## 7. Interface vs Concrete Type Decision

### Q14: Khi nào nên dùng interface, khi nào dùng concrete type? 🟡

**A:**

**Dùng interface khi:**

| Tình huống | Lý do |
|-----------|-------|
| Hàm cần nhận nhiều implementation | Polymorphism |
| Cần mock/stub cho testing | Dependency injection |
| Cross-package boundary | Decoupling packages |
| Behavior quan trọng hơn data | "What it does" > "What it is" |
| Standard library patterns | `io.Reader`, `http.Handler` |

**Dùng concrete type khi:**

| Tình huống | Lý do |
|-----------|-------|
| Chỉ có 1 implementation | Interface vô nghĩa |
| Performance-critical code | Tránh interface dispatch overhead |
| Internal package code | Không cần abstraction |
| Data structure (DTO, model) | Struct fields quan trọng hơn methods |
| Return type của function | "Accept interfaces, return structs" |

**Over-abstraction anti-pattern — "premature interfacing":**

```go
// ❌ Tệ — interface cho 1 implementation duy nhất
type UserServiceInterface interface {
    GetUser(id int) (*User, error)
    CreateUser(u *User) error
    UpdateUser(u *User) error
    DeleteUser(id int) error
}
type UserService struct { ... }  // implementation duy nhất

// ✅ Tốt — dùng concrete type, tạo interface ở consumer khi cần
type UserService struct { ... }

// Consumer tự định nghĩa interface nhỏ nó cần
type UserGetter interface {
    GetUser(id int) (*User, error)
}
```

**Testing with interfaces (Dependency Injection):**

Interface tỏa sáng nhất khi testing. Thay vì mock toàn bộ service, chỉ cần mock interface nhỏ mà function cần:

```go
// Production code — hàm chỉ cần đọc user
func HandleGetUser(store UserGetter, id int) (*User, error) {
    return store.GetUser(id)
}

// Test — mock rất đơn giản
type mockStore struct{ user *User }
func (m mockStore) GetUser(id int) (*User, error) { return m.user, nil }
```

> **Nguyên tắc**: Đừng tạo interface "phòng khi cần". Tạo khi thực sự có 2+ implementations hoặc khi cần test isolation. Go community gọi đây là **"define interfaces at the point of use"**.

---

## 8. Generics (Go 1.18+)

### Q15: Tại sao Go mất 12 năm mới thêm generics? Trade-off nào được cân nhắc? 🟡

**A:**

Go team (đặc biệt Rob Pike và Ian Lance Taylor) đã cân nhắc generics từ trước Go 1.0 nhưng trì hoãn vì **3 mối lo lớn**:

| Mối lo | Giải thích |
|--------|-----------|
| **Complexity** | Generics làm language spec phức tạp hơn đáng kể — Go tự hào về simplicity |
| **Compile time** | C++ templates gây compile time rất chậm — Go muốn tránh |
| **Code readability** | Generic code thường khó đọc hơn concrete code |

**Trước generics, Go dùng 3 workaround:** `interface{}` (mất type safety), code generation (`go generate`), copy-paste (vi phạm DRY).

**Generics được thêm vì:** standard library duplicate quá nhiều (`sort.Ints`, `sort.Strings`, `sort.Float64s`...) — community consensus: cost of NOT having generics > cost of having them.

**Design choice — Type Parameters + Constraints:**

Go chọn approach **constrained parametric polymorphism**, khác biệt với:

| Language | Approach | Trade-off |
|----------|----------|-----------|
| C++ | Templates (duck typing at compile time) | Flexible nhưng error messages khủng khiếp |
| Java | Type erasure | Simple nhưng mất type info at runtime |
| Rust | Traits (monomorphization) | Type-safe + fast nhưng binary size lớn |
| **Go** | **Type parameters + interface constraints** | Balance giữa simplicity và expressiveness |

---

### Q16: Type parameters, type constraints, và type sets là gì? 🟡

**A:**

**Type parameter** — biến đại diện cho type, khai báo trong `[]`:

```go
func Map[T any, U any](s []T, f func(T) U) []U {
    result := make([]U, len(s))
    for i, v := range s {
        result[i] = f(v)
    }
    return result
}
```

**Type constraint** — giới hạn type parameter phải thoả mãn điều kiện gì. Constraint chính là **interface** nhưng mở rộng thêm khái niệm **type set**:

| Constraint | Ý nghĩa | Type set |
|-----------|---------|----------|
| `any` | Mọi type | Universal set |
| `comparable` | Type dùng được `==`, `!=` | Tất cả comparable types |
| `interface{ ~int \| ~string }` | Underlying type là int hoặc string | Union of type sets |
| `interface{ Read([]byte) (int, error) }` | Có method Read | Tất cả types có method Read |

**Type set** (khái niệm mới Go 1.18) — mỗi interface giờ đây định nghĩa một **tập hợp types** (không chỉ tập method):

```go
// Method-based constraint (giống interface cũ)
type Stringer interface {
    String() string
}

// Type-based constraint (mới)
type Signed interface {
    ~int | ~int8 | ~int16 | ~int32 | ~int64
}

// Kết hợp cả hai
type SignedStringer interface {
    Signed
    String() string
}
```

**Toán tử `~`** (tilde): `~int` nghĩa là "bất kỳ type nào có underlying type là `int`". Nếu không có `~`, chỉ chấp nhận **chính xác** type `int`.

```go
type MyInt int  // underlying type = int

type OnlyInt interface { int }    // MyInt ❌ — chỉ nhận int
type AlsoMyInt interface { ~int } // MyInt ✅ — nhận mọi type based on int
```

---

### Q17: `comparable` constraint đặc biệt ở điểm nào? 🟡

**A:**

`comparable` là **predeclared constraint** (không phải keyword) cho phép dùng `==` và `!=`. Nó đặc biệt vì:

1. **Không thể biểu diễn bằng interface thông thường** — `==` không phải method
2. **Bắt buộc cho map key** — `map[K]V` yêu cầu `K` là `comparable`
3. **Loại trừ**: slice, map, function — vì Go không define equality cho chúng

```go
func Contains[T comparable](s []T, target T) bool {
    for _, v := range s {
        if v == target {
            return true
        }
    }
    return false
}
```

**Subtlety quan trọng** (Go 1.20 thay đổi): interface types satisfy `comparable` tại compile time, nhưng có thể panic tại runtime nếu dynamic type không comparable. Ví dụ: `any` satisfies `comparable`, nhưng `any` holding `[]int` sẽ panic khi `==`.

---

## 9. Generic Patterns

### Q18: Các generic patterns phổ biến trong Go? 🟡

**A:**

**Pattern 1 — Generic data structures:**

```go
type Stack[T any] struct { items []T }
func (s *Stack[T]) Push(item T)    { s.items = append(s.items, item) }
func (s *Stack[T]) Pop() (T, bool) { /* return last item or zero */ }
```

**Pattern 2 — Utility functions (Map, Filter, Reduce):**

```go
func Filter[T any](s []T, pred func(T) bool) []T {
    var result []T
    for _, v := range s { if pred(v) { result = append(result, v) } }
    return result
}
```

**Pattern 3 — Constrained operations:**

```go
type Number interface { ~int | ~int32 | ~int64 | ~float32 | ~float64 }
func Sum[T Number](nums []T) T {
    var total T
    for _, n := range nums { total += n }
    return total
}
```

**Pattern 4 — Generic result type:**

```go
type Result[T any] struct { Value T; Err error }
```

> **Lưu ý**: Go community khuyến cáo **không lạm dụng generics** chỉ vì có thể. Nếu `any` đủ dùng, hoặc concrete type rõ ràng hơn — đừng dùng generics. "A little copying is better than a little dependency" — Go Proverb.

---

## 10. Generics vs Interfaces

### Q19: Khi nào dùng generics, khi nào dùng interfaces? Performance khác nhau thế nào? 🔴

**A:**

**Decision framework:**

| Tiêu chí | Dùng Interface | Dùng Generics |
|----------|---------------|---------------|
| Behavior-based abstraction | ✅ "Bất kỳ ai biết Read" | ❌ |
| Type-safe containers | ❌ (cần type assert) | ✅ `Stack[int]` |
| Operations cần operators (`+`, `==`) | ❌ (operators không phải method) | ✅ với constraints |
| Runtime polymorphism | ✅ Khác implementation mỗi lần gọi | ❌ Type biết tại compile time |
| Multiple implementations cùng lúc | ✅ Slice of different impl | ❌ Slice cần cùng type |

**Performance comparison — Implementation strategy:**

Go generics sử dụng **GC Shape Stenciling** (hybrid approach), KHÔNG phải full monomorphization như Rust:

| Strategy | Language | Cách hoạt động |
|----------|---------|----------------|
| **Full monomorphization** | Rust, C++ | Tạo bản copy riêng cho MỖI concrete type |
| **Type erasure** | Java | Xoá type info, dùng Object + cast |
| **GC Shape Stenciling** | **Go** | Tạo bản copy cho mỗi **GC shape** (pointer types share 1 copy) |
| **Interface dispatch** | Go (pre-generics) | Indirect call qua itab |

**GC Shape Stenciling giải thích:** Tất cả pointer types share 1 bản code (truyền type info qua hidden dictionary). Value types khác GC shape tạo bản riêng. Kết quả: ít binary bloat hơn Rust, nhưng pointer types không nhanh bằng full monomorphization.

**Benchmark thực tế (approximate):**

| Approach | Container access | Function call |
|----------|-----------------|---------------|
| Concrete type | 1x (baseline) | 1x — inlineable |
| Generics (value type) | ~1x | ~1-1.2x — inlineable |
| Generics (pointer type) | ~1.1-1.3x | ~1.2-1.5x — dictionary overhead |
| Interface | ~1.5-2x | ~2-3x — indirect call, no inline |
| `any` + type assertion | ~2-3x | ~3-5x — assertion + indirect |

> **Guidelines**: Dùng generics khi cần type safety + performance (data structures, utility functions). Dùng interfaces khi cần runtime polymorphism (plugin systems, dependency injection, handler patterns).

---

## 11. Reflection

### Q20: reflect package hoạt động thế nào? TypeOf vs ValueOf? 🟡

**A:**

Package `reflect` cho phép **inspect và manipulate types/values tại runtime**. Nó xây dựng trên nền tảng interface internal representation:

**Hai trụ cột:**

| Function | Trả về | Mục đích |
|----------|--------|----------|
| `reflect.TypeOf(x)` | `reflect.Type` | Metadata: tên type, kind, methods, fields, tags |
| `reflect.ValueOf(x)` | `reflect.Value` | Giá trị runtime: đọc/ghi value, gọi method |

`reflect.TypeOf` thực chất đọc `_type` pointer từ eface/iface. `reflect.ValueOf` đọc `data` pointer. Cả hai nhận `any` → cần interface wrapper để có type info.

**Struct tag reading** — use case phổ biến nhất:

```go
type User struct {
    Name  string `json:"name" validate:"required"`
    Email string `json:"email" validate:"email"`
}

t := reflect.TypeOf(User{})
for i := 0; i < t.NumField(); i++ {
    field := t.Field(i)
    fmt.Printf("Field: %s, JSON: %s, Validate: %s\n",
        field.Name,
        field.Tag.Get("json"),
        field.Tag.Get("validate"))
}
```

---

### Q21: Khi nào dùng reflection? Khi nào TRÁNH? Performance cost ra sao? 🔴

**A:**

**Khi nào dùng (hợp lý):** Serialization (`encoding/json`), ORM mapping (`gorm`, `sqlx`), validation frameworks, dependency injection, template engines, testing utilities (`assert.Equal`).

**Khi nào KHÔNG dùng:** Type-safe operations (→ generics), known types at compile time (→ type switch), performance hot path (→ concrete types / codegen), simple type checking (→ interface assertion).

**Performance cost:**

| Operation | Relative cost | Lý do |
|-----------|--------------|-------|
| Direct field access | 1x | Compile-time offset |
| Interface method call | 3-5x | Indirect call |
| `reflect.ValueOf` | 50-100x | Allocation + type analysis |
| `reflect.Value.Field` | 20-50x | Runtime offset lookup |
| `reflect.Value.Call` | 100-500x | Argument boxing + dynamic dispatch |

**Rob Pike's Laws of Reflection:**
1. Reflection goes from **interface value** to **reflection object**
2. Reflection goes from **reflection object** to **interface value** (`.Interface()`)
3. To modify a reflection object, the value must be **settable** (addressable → cần pass pointer)

**Law #3 là nguồn bug phổ biến:**

```go
var x float64 = 3.14
v := reflect.ValueOf(x)    // v holds COPY of x
v.SetFloat(2.71)            // ❌ panic: using unaddressable value

v = reflect.ValueOf(&x).Elem()  // v holds reference to x
v.SetFloat(2.71)                 // ✅ works — x is now 2.71
```

> **Quy tắc vàng**: "Clear is better than clever" — Go Proverb. Reflection là công cụ mạnh nhưng tạo ra code khó đọc, khó debug, và chậm. Chỉ dùng khi KHÔNG CÓ cách nào khác.

---

## 12. Design Patterns in Go (Using Interfaces)

### Q22: Các design pattern phổ biến trong Go sử dụng interfaces? 🟡

**A:**

**Pattern 1 — Strategy Pattern:** Thay đổi behavior bằng interface parameter:

```go
type Compressor interface { Compress(data []byte) ([]byte, error) }
func ProcessFile(c Compressor, data []byte) ([]byte, error) { return c.Compress(data) }
```

**Pattern 2 — Decorator/Middleware:** Wrap interface để thêm behavior (logging, metrics, retry):

```go
type LoggingReader struct { reader io.Reader; logger *log.Logger }
func (lr *LoggingReader) Read(p []byte) (int, error) {
    n, err := lr.reader.Read(p)
    lr.logger.Printf("Read %d bytes", n)
    return n, err
}
// LoggingReader satisfies io.Reader → Open/Closed Principle
```

**Pattern 3 — Functional Options:** Flexible configuration without interface:

```go
type Option func(*Server)
func WithTimeout(d time.Duration) Option { return func(s *Server) { s.timeout = d } }
func NewServer(opts ...Option) *Server { /* apply opts */ }
```

**Pattern 4 — Repository (interface for testing):**

```go
type UserRepository interface {
    FindByID(ctx context.Context, id int64) (*User, error)
    Save(ctx context.Context, u *User) error
}
// Production: PostgresUserRepo | Testing: InMemoryUserRepo
```

**Pattern 5 — Plugin/Registry:** Dynamic registration via interface, `map[string]Plugin` lookup.

---

## 13. Interview Questions — Tổng hợp

### Câu hỏi lý thuyết

**🟢 Cơ bản:**

1. **Q**: Interface trong Go khác interface trong Java/C# ở điểm nào?
   **A**: Implicit satisfaction — không cần khai báo `implements`. Điều này cho phép retroactive implementation và khuyến khích small interfaces.

2. **Q**: Empty interface `any` tương đương khái niệm gì trong Java?
   **A**: Tương tự `Object` trong Java — là supertype của mọi type. Nhưng `any` an toàn hơn vì Go không cho phép gọi method trực tiếp trên `any` (phải type assert trước).

3. **Q**: Tại sao Go khuyến khích interface nhỏ (1-3 methods)?
   **A**: Implicit satisfaction → interface nhỏ = nhiều type tự nhiên satisfy → abstraction mạnh hơn. "The bigger the interface, the weaker the abstraction" — Rob Pike.

**🟡 Trung bình:**

4. **Q**: Giải thích "nil interface" bug. Viết code gây ra bug này.
   **A**: Interface chỉ nil khi cả `type` và `value` đều nil. Return typed nil qua interface → interface không nil dù value = nil. Fix: return `nil` trực tiếp.

5. **Q**: "Accept interfaces, return structs" — có ngoại lệ không?
   **A**: Có — khi factory function cần return nhiều implementation khác nhau, khi trả về standard library interfaces (`error`, `io.Reader`), hoặc khi cần hide unexported struct.

6. **Q**: Generics vs Interface — khi nào dùng cái nào?
   **A**: Interface cho runtime polymorphism (plugin, handler, DI). Generics cho type-safe operations cần operators hoặc type-safe containers. Interface khi cần heterogeneous collection (slice chứa nhiều types khác nhau).

7. **Q**: `comparable` constraint có thể panic runtime không?
   **A**: Có — nếu interface type satisfies `comparable` nhưng dynamic value không comparable (ví dụ `any` holding `[]int`).

**🔴 Nâng cao:**

8. **Q**: Giải thích sự khác biệt giữa iface và eface trong runtime. Tại sao cần 2 struct?
   **A**: `eface` cho empty interface (chỉ cần `_type` + `data`). `iface` cho interface có method (cần thêm `itab` chứa method dispatch table). Tách 2 struct vì empty interface rất phổ biến và không cần method table overhead.

9. **Q**: Go generics dùng strategy gì? Khác monomorphization của Rust ở đâu?
   **A**: GC Shape Stenciling — tạo code riêng cho mỗi GC shape, pointer types share 1 bản với hidden dictionary. Rust full monomorphization → nhanh hơn nhưng binary lớn hơn. Go chọn balance giữa speed và binary size.

10. **Q**: Khi nào reflection là lựa chọn DUY NHẤT? Cho ví dụ không thể thay thế bằng generics.
    **A**: Khi cần đọc **struct tags** (`json:"name"`), dùng **struct field name as string** (ORM mapping), hoặc **build type tại runtime** (`reflect.StructOf`). Generics hoạt động tại compile time, không thể đọc tag hay tạo type dynamically.

11. **Q**: Interface dispatch cost ảnh hưởng thế nào ở production scale? Khi nào cần optimize?
    **A**: ~2-5ns overhead per call thường negligible. Chỉ quan trọng khi: (1) tight loop triệu lần/giây (serialization, encoding), (2) latency-critical path (trading systems). Profile trước, optimize sau. Cách optimize: dùng concrete type hoặc generics ở hot path, giữ interface ở boundary.

12. **Q**: Thiết kế interface cho một hệ thống notification gửi qua Email, SMS, Push. Áp dụng interface segregation.
    **A**: Không tạo 1 `Notifier` interface lớn. Tách thành `Sender` (1 method: `Send`), `TemplateRenderer` (1 method: `Render`), `DeliveryTracker` (1 method: `Track`). Mỗi implementation chỉ implement interface nó cần. Compose khi cần: `TrackedSender` embeds `Sender` + `DeliveryTracker`.

---

## Quick Reference — Decision Flowchart

```
Cần abstraction?
├─ Không → Dùng concrete type
└─ Có
   ├─ Cần runtime polymorphism? (khác implementation mỗi lần)
   │  └─ Có → Interface
   ├─ Cần type-safe container/utility?
   │  └─ Có → Generics
   ├─ Cần operators (+, ==, <)?
   │  └─ Có → Generics with constraints
   ├─ Cần đọc struct tags / runtime type info?
   │  └─ Có → Reflection
   └─ Cần mock cho testing?
      └─ Có → Interface (defined at point of use)
```

---

> **Tóm tắt**: Interface là trái tim của Go — implicit satisfaction cho phép decoupling mạnh mẽ với minimum boilerplate. Generics (Go 1.18+) bổ sung type safety cho containers và utilities mà interface không handle tốt. Reflection là công cụ cuối cùng khi compile-time information không đủ. Hiểu internal representation (iface/eface/itab) giúp bạn viết code hiệu quả hơn và debug interface-related bugs nhanh hơn.

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: How does Go determine if a type satisfies an interface? / Go xác định một type có thỏa mãn interface như thế nào? 🟢 Junior

**A:** Go uses **structural typing** (implicit interface satisfaction). A type satisfies an interface if it implements all methods in the interface with matching signatures — no explicit declaration is needed. The compiler checks this at compile time. A pointer type `*T` and value type `T` satisfy different sets of interfaces: pointer receivers are only callable on pointer types, but value receivers are callable on both.

Vietnamese explanation: Go không yêu cầu khai báo `implements` như Java. Compiler tự kiểm tra xem type có đủ method không. Điểm quan trọng cần nhớ: method với **pointer receiver** chỉ satisfy interface khi dùng pointer (`*T`), còn **value receiver** thì cả `T` và `*T` đều satisfy. Lỗi phổ biến là truyền value type khi interface cần pointer receiver — compiler sẽ báo lỗi ngay.

---

### Q: What is the difference between `interface{}` and `any`? When should you use the empty interface? / `interface{}` và `any` khác nhau thế nào? Khi nào nên dùng? 🟢 Junior

**A:** `any` is an alias for `interface{}` introduced in Go 1.18 — they are identical at runtime. The empty interface has no methods, so every type satisfies it. Use cases: generic containers before Go 1.18, encoding/decoding unknown JSON, logging, and fmt functions. The downside is loss of type safety — the caller must type-assert back to the concrete type, which can panic if wrong. Prefer generics or typed interfaces when the set of types is known.

Vietnamese explanation: `any` chỉ là alias đẹp hơn của `interface{}`, không có sự khác biệt về runtime. Dùng empty interface khi thực sự không biết trước kiểu dữ liệu (ví dụ: JSON unmarshal vào `map[string]any`). Tuy nhiên, mỗi lần truy cập giá trị phải type-assert, và nếu assert sai sẽ **panic**. Go 1.18+ với generics cho phép viết code type-safe hơn cho nhiều trường hợp trước đây phải dùng `interface{}`.

---

### Q: What is a type assertion vs a type switch? When does a type assertion panic? / Type assertion và type switch khác nhau thế nào? Khi nào type assertion panic? 🟡 Mid

**A:** A **type assertion** `v, ok := i.(T)` extracts the concrete value of type `T` from an interface. The two-value form (`v, ok`) never panics — `ok` is `false` if the type doesn't match. The single-value form `v := i.(T)` panics if the interface does not hold type `T`. A **type switch** `switch v := i.(type)` is syntactic sugar for multiple type assertions and is the idiomatic way to handle multiple concrete types without risk of panic.

Vietnamese explanation: Type assertion một giá trị có thể panic nếu interface đang giữ type khác — luôn dùng dạng two-value `v, ok` trong production code. Type switch là cách idiomatic khi cần xử lý nhiều concrete types, ví dụ trong error handling hoặc JSON parsing. Một pattern thường gặp trong phỏng vấn: implement `Stringer` check — `if s, ok := v.(fmt.Stringer); ok { return s.String() }`.

---

### Q: When should you use generics instead of interfaces in Go 1.18+? / Khi nào nên dùng generics thay vì interface? 🟡 Mid

**A:** Use **generics** when: (1) you need type-safe containers (e.g., `Stack[T]`, `Set[T]`); (2) you want to avoid boxing/unboxing overhead with `interface{}`; (3) the operation is the same for all types (e.g., `Map`, `Filter`, `Reduce` on slices); (4) you need type constraints that express capability (`~int | ~float64`). Use **interfaces** when: you need runtime polymorphism where the concrete type is determined at runtime, or when you're designing APIs that external packages implement.

Vietnamese explanation: Rule of thumb — **interfaces cho runtime polymorphism, generics cho compile-time type safety**. Generics không thể thay thế interface hoàn toàn: bạn không thể có `[]Animal[T]` chứa cả Dog và Cat. Generics tốt nhất cho utility functions và containers. Trade-off: generics làm tăng binary size (monomorphization), nhưng thường nhanh hơn interface do tránh allocation và vtable lookup. Tránh over-generics — nếu chỉ có 2-3 types cụ thể, interface thường rõ ràng hơn.

---

### Q: What are type constraints in Go generics? How do you define a custom constraint? / Type constraints trong Go generics là gì? Cách định nghĩa custom constraint? 🔴 Senior

**A:** A **type constraint** is an interface that restricts which types a generic type parameter can be. The `comparable` built-in constraint allows `==` and `!=`. The `constraints` package (or inline union types) allows arithmetic: `~int | ~float64`. The tilde `~` means "underlying type" — `~int` includes any named type whose underlying type is `int` (e.g., `type UserID int`). Custom constraints are defined as interfaces with a type set: `type Number interface { ~int | ~int64 | ~float64 }`. A type parameter can also be constrained by method sets: `type Stringer interface { String() string }`.

Vietnamese explanation: Constraint trong generics là interface dùng ở vị trí type parameter. `comparable` là built-in, dùng cho map keys và `==` operations. Khi cần arithmetic operators (`+`, `-`, `*`), bạn phải dùng union constraint vì operators không thể express qua methods. Tilde `~` rất quan trọng — không có tilde, `type Celsius float64` sẽ không satisfy `float64` constraint dù underlying type là float64. Đây là câu hỏi phân biệt candidate hiểu sâu về generics.

---

## Self-Check / Tự Kiểm Tra

- [ ] Can I explain why Go uses implicit interface satisfaction instead of explicit `implements`?
- [ ] Can I draw the `iface` struct (type pointer + data pointer) from memory?
- [ ] Can I name 3 real use cases where interfaces enable better testability?
- [ ] Can I write a generic function with a custom type constraint?
- [ ] Can I explain when to use interfaces vs generics vs `any`?
- 💬 **Feynman Prompt:** Giải thích Go interfaces cho một Java developer — tại sao bạn không cần viết `implements`, và điều đó thay đổi cách thiết kế code như thế nào?

## Connections / Liên Kết

- ⬅️ **Built on**: [Go Language Fundamentals](./01-language-fundamentals.md) — struct methods, type system
- ➡️ **Enables**: [Go Concurrency](./03-concurrency.md) — channels are interface-driven (`io.Reader`/`io.Writer`)
- ➡️ **Enables**: [Go Testing](./05-testing-profiling.md) — mock = new struct satisfying interface, no frameworks needed
- 🔗 **Applied in**: [API Design](../02-backend-knowledge/01-api-design.md) — handler interfaces for middleware chains
