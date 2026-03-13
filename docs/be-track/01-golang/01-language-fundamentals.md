# Go Language Fundamentals

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> **Focus**: ~75% theory (WHY & HOW internally), ~25% code examples
> **Format**: Q&A, Bilingual (English headings + Vietnamese explanations)
> **Difficulty**: `[Junior]` `[Mid]` `[Senior]`

---

## 1. Go Philosophy

### Q: Why was Go created? What problems does it solve? `[Junior]`

**A:** Go được tạo ra bởi Robert Griesemer, Rob Pike, và Ken Thompson tại Google vào năm 2007 (public 2009) để giải quyết các vấn đề thực tế:

| Problem | Go's Solution |
|---------|---------------|
| C++ compilation quá chậm (hàng giờ ở Google) | Compiler cực nhanh, dependency analysis đơn giản |
| Concurrency phức tạp (threads, locks) | Goroutines + channels là first-class citizens |
| Code phức tạp, khó đọc (C++ templates, Java generics lúc đó) | Syntax tối giản, chỉ 25 keywords |
| Dependency management hỗn loạn | Built-in module system |
| Deploy phức tạp (JVM, runtime dependencies) | Static binary, zero dependencies |

**Triết lý cốt lõi:** Go chọn **simplicity over cleverness**. Ngôn ngữ cố tình KHÔNG có nhiều feature (ban đầu không generics, không exceptions, không inheritance) để buộc developer viết code đơn giản, dễ đọc.

### Q: What are the important Go Proverbs? `[Mid]`

**A:** Go Proverbs (by Rob Pike) là kim chỉ nam thiết kế:

- **"Don't communicate by sharing memory; share memory by communicating"** — Dùng channels thay vì shared state + mutex
- **"Concurrency is not parallelism"** — Concurrency là cấu trúc code, parallelism là thực thi đồng thời
- **"The bigger the interface, the weaker the abstraction"** — Interface nhỏ (1-2 methods) mạnh hơn interface lớn
- **"Make the zero value useful"** — `sync.Mutex{}` sẵn sàng dùng, không cần constructor
- **"A little copying is better than a little dependency"** — Copy vài dòng code tốt hơn import cả thư viện
- **"Clear is better than clever"** — Code dễ đọc quan trọng hơn code "thông minh"
- **"Errors are values"** — Error không phải exception, xử lý chúng như data bình thường

### Q: How does Go handle composition over inheritance? `[Junior]`

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

---

## 2. Type System

### Q: Explain Go's type system and all basic types `[Junior]`

**A:** Go là **statically typed, strongly typed** language. Mọi variable đều có type cố định lúc compile time.

**Basic types:**

| Category | Types | Notes |
|----------|-------|-------|
| Boolean | `bool` | `true` / `false` |
| Integer (signed) | `int8, int16, int32, int64, int` | `int` = platform-dependent (32 hoặc 64 bit) |
| Integer (unsigned) | `uint8, uint16, uint32, uint64, uint, uintptr` | `byte` = alias cho `uint8` |
| Float | `float32, float64` | Không có `float`, phải chọn rõ |
| Complex | `complex64, complex128` | Ít dùng, cho scientific computing |
| String | `string` | Immutable sequence of bytes |
| Rune | `rune` | Alias cho `int32`, đại diện Unicode code point |

### Q: What are the zero values for all types in Go? `[Junior]`

**A:** Mọi variable trong Go nếu không khởi tạo sẽ nhận **zero value**. Đây là thiết kế có chủ đích — "make the zero value useful":

| Type | Zero Value | Example |
|------|-----------|---------|
| `bool` | `false` | `var b bool` → `false` |
| All integers | `0` | `var i int` → `0` |
| All floats | `0.0` | `var f float64` → `0.0` |
| `string` | `""` (empty string) | `var s string` → `""` |
| Pointer | `nil` | `var p *int` → `nil` |
| Slice | `nil` | `var s []int` → `nil` (len=0, cap=0) |
| Map | `nil` | `var m map[string]int` → `nil` |
| Channel | `nil` | `var ch chan int` → `nil` |
| Interface | `nil` | `var i interface{}` → `nil` |
| Function | `nil` | `var f func()` → `nil` |
| Struct | Each field = its zero value | `var u User` → `User{Name:"", Age:0}` |

**Lưu ý quan trọng:** `nil` slice vẫn dùng được với `append()`, nhưng `nil` map sẽ **panic** nếu ghi vào.

### Q: Type alias vs type definition — what's the difference? `[Mid]`

**A:** Hai cách tạo type mới với behavior rất khác:

```go
type MyInt int      // Type DEFINITION — tạo type hoàn toàn mới
type YourInt = int  // Type ALIAS — chỉ là tên khác cho cùng type
```

| Aspect | Type Definition (`type X int`) | Type Alias (`type X = int`) |
|--------|-------------------------------|----------------------------|
| Tạo type mới? | Có — `X` ≠ `int` | Không — `X` == `int` |
| Cần convert? | `int(x)` để chuyển | Không cần, interchangeable |
| Gắn method? | Được | Không (phải gắn vào original type) |
| Dùng khi nào? | Tạo domain type, thêm method | Gradual refactoring, backward compat |

**Type definition** tạo type mới hoàn toàn, compiler sẽ báo lỗi nếu assign sai type — đây là cách tạo **domain types** an toàn (vd: `type UserID int64` để tránh nhầm với `OrderID int64`).

### Q: How does type inference work in Go? `[Junior]`

**A:** Go dùng `:=` (short variable declaration) để suy luận type từ giá trị bên phải:

```go
x := 42          // int (default cho integer literal)
y := 3.14        // float64 (default cho float literal)
z := "hello"     // string
w := true        // bool
p := &x          // *int
```

Compiler xác định type tại **compile time**, không phải runtime. Sau khi infer, type cố định — không thể gán giá trị khác type.

---

## 3. Value Types vs Reference Types

### Q: Is Go pass-by-value or pass-by-reference? `[Mid]`

**A:** Go **LUÔN pass-by-value**. Không có exception. Mọi thứ truyền vào function đều là **copy**.

Nhưng câu chuyện phức tạp hơn vì một số type chứa **internal pointer**:

| Type | Passed as | Contains pointer? | Mutation visible? |
|------|-----------|-------------------|-------------------|
| `int, float, bool, string` | Copy of value | No | No |
| `struct` | Copy of entire struct | No (trừ khi field là pointer) | No |
| `array` | Copy of entire array | No | No |
| `slice` | Copy of **slice header** | Yes (pointer to backing array) | Yes (modify elements), No (append may not) |
| `map` | Copy of **map pointer** | Yes (internal hash table pointer) | Yes |
| `channel` | Copy of **channel pointer** | Yes (internal queue pointer) | Yes |
| `pointer` | Copy of **pointer value** | Yes (it IS a pointer) | Yes |
| `interface` | Copy of **interface value** (type + data pointers) | Yes | Depends |

**Giải thích sâu:** Khi bạn pass một slice vào function, Go copy 3 fields: `(pointer, len, cap)`. Cả bản copy và bản gốc cùng trỏ đến **same backing array**, nên sửa element thì cả hai đều thấy. Nhưng `append()` có thể tạo backing array mới — lúc đó bản copy trỏ chỗ khác, bản gốc không thấy thay đổi.

```go
func modify(s []int) {
    s[0] = 999    // Visible outside — same backing array
    s = append(s, 1, 2, 3)  // If cap exceeded, new backing array
    // changes after this append may NOT be visible outside
}
```

### Q: Why does Go not have "reference types" officially? `[Senior]`

**A:** Thuật ngữ "reference type" gây nhầm lẫn. Go spec không dùng từ này. Chính xác hơn:

- **Slice** là struct `{pointer, len, cap}` — pass-by-value struct có chứa pointer
- **Map** là pointer đến runtime hash table (`*runtime.hmap`) — pass-by-value pointer
- **Channel** là pointer đến runtime channel struct (`*runtime.hchan`) — pass-by-value pointer

Nói "map là reference type" là **không chính xác**. Map là **pointer được pass by value**. Sự khác biệt: trong C++ reference type, bạn có thể reassign và caller thấy. Trong Go, reassign map variable trong function KHÔNG ảnh hưởng caller.

---

## 4. Structs

### Q: Explain struct value semantics and embedding `[Mid]`

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

### Q: What are struct tags and how do they work? `[Mid]`

**A:** Struct tags là metadata gắn vào field, chỉ đọc được qua **reflection** lúc runtime:

```go
type User struct {
    Name     string `json:"name" validate:"required,min=2"`
    Email    string `json:"email" db:"email_address"`
    Password string `json:"-"`               // Bỏ qua khi JSON encode
    Age      int    `json:"age,omitempty"`    // Bỏ qua nếu zero value
}
```

| Tag | Library | Purpose |
|-----|---------|---------|
| `json:"name"` | `encoding/json` | JSON field mapping |
| `db:"col_name"` | `sqlx`, `gorm` | Database column mapping |
| `validate:"required"` | `go-playground/validator` | Validation rules |
| `yaml:"key"` | `gopkg.in/yaml.v3` | YAML mapping |
| `mapstructure:"key"` | `mapstructure` | Config mapping |

**Internally:** Tags được lưu trong binary dưới dạng raw string. `reflect.StructField.Tag` parse string này theo convention `key:"value"` pairs. Compiler KHÔNG validate tag syntax — sai format chỉ bị bỏ qua lặng lẽ (dùng `go vet` để check).

### Q: Explain method sets and their rules `[Senior]`

**A:** Method set quyết định type nào satisfy interface nào:

| Receiver type | Method set includes |
|--------------|-------------------|
| Value `T` | Chỉ methods với receiver `T` |
| Pointer `*T` | Methods với receiver `T` VÀ `*T` |

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

---

## 5. Pointers

### Q: When should you use pointers vs values? `[Mid]`

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

### Q: What is escape analysis? `[Senior]`

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

### Q: What happens with nil pointer dereference? `[Junior]`

**A:** Dereference nil pointer gây **runtime panic** — không phải compile error vì compiler không luôn biết pointer có nil không:

```go
var p *int          // p = nil
fmt.Println(*p)     // PANIC: runtime error: invalid memory address

// Safe pattern
if p != nil {
    fmt.Println(*p)
}
```

Method call trên nil pointer cũng panic TRỪKHI method không dereference receiver:

```go
type List struct{ items []string }

func (l *List) Len() int {
    if l == nil { return 0 }   // nil receiver check — valid pattern
    return len(l.items)
}

var l *List   // nil
l.Len()       // OK! Returns 0 — method handles nil receiver
```

---

## 6. Slice Internals

### Q: How does a slice work internally? `[Mid]`

**A:** Slice là một **struct header** gồm 3 fields (24 bytes trên 64-bit):

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

### Q: How does slice growth work? `[Mid]`

**A:** Khi `append()` vượt capacity, Go allocate backing array mới và copy data:

**Growth strategy (Go 1.18+):**
- `cap < 256`: double capacity (`newCap = oldCap * 2`)
- `cap >= 256`: tăng ~25% + padding (`newCap = oldCap + oldCap/4 + 192`)
- Sau đó round up theo memory allocator size classes

**Trước Go 1.18:**
- `cap < 1024`: double
- `cap >= 1024`: tăng 25%

Chiến lược mới smooth hơn — tránh jump đột ngột khi cap đạt 1024.

### Q: What are common slice gotchas? `[Senior]`

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

---

## 7. Map Internals

### Q: How does Go's map work internally? `[Senior]`

**A:** Go map là **hash table** implementation trong `runtime/map.go`:

```
┌───────────────────────────────────────────────┐
│                  hmap struct                   │
├───────┬────────┬───────┬──────────────────────┤
│ count │   B    │ flags │ buckets pointer       │
│       │(log2)  │       │        │              │
└───────┴────────┴───────┴────────┼──────────────┘
                                  ▼
                    ┌──────────────────────────┐
                    │ Bucket 0 (bmap struct)    │
                    │ ┌──────────────────────┐ │
                    │ │ tophash [8]uint8      │ │ ← high 8 bits of hash
                    │ │ keys    [8]KeyType    │ │ ← 8 key-value pairs
                    │ │ values  [8]ValueType  │ │   per bucket
                    │ │ overflow *bmap        │ │ ← chain to next bucket
                    │ └──────────────────────┘ │
                    ├──────────────────────────┤
                    │ Bucket 1                  │
                    │ ...                       │
                    └──────────────────────────┘
```

**Cơ chế hoạt động:**

1. **Hash key** → lấy hash value (dùng hash function tùy key type)
2. **Low B bits** của hash → chọn bucket (bucket index)
3. **High 8 bits** (tophash) → so sánh nhanh trong bucket (tránh full key comparison)
4. Mỗi bucket chứa **8 key-value pairs** — nếu đầy, tạo **overflow bucket** (chaining)

**Load factor = 6.5**: Khi `count / 2^B > 6.5`, map sẽ **grow** — double số buckets và **incremental evacuate** (không copy tất cả cùng lúc, mỗi insert/delete di chuyển 1-2 buckets cũ).

### Q: Why is map NOT thread-safe? `[Mid]`

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

### Q: Why is map iteration order random? `[Mid]`

**A:** Go **cố tình randomize** iteration order (từ Go 1.0). Lý do:

1. **Hash table không đảm bảo order** — phụ thuộc hash function, resize timing
2. **Tránh developer phụ thuộc vào order** — nếu order "tình cờ" ổn định, code sẽ giả định order, rồi break khi runtime thay đổi
3. **Security** — random seed mỗi lần chạy giúp chống hash collision DoS attacks

Runtime thêm random offset vào starting bucket khi iterate — nên cùng map, mỗi `range` cho thứ tự khác.

---

## 8. String Internals

### Q: How are strings represented internally? `[Mid]`

**A:** String trong Go là **immutable read-only byte slice**:

```
┌──────────────────────────┐
│     String Header        │
├──────────┬───────────────┤
│ pointer  │    len        │
│ (8 bytes)│  (8 bytes)    │
└────┬─────┴───────────────┘
     │
     ▼
┌────┬────┬────┬────┬────┐
│ 0x48│0x65│0x6C│0x6C│0x6F│  ← UTF-8 encoded bytes "Hello"
└────┴────┴────┴────┴────┘
```

- **16 bytes** header (pointer + length), không có capacity (vì immutable)
- Content là **UTF-8 encoded bytes** — 1 character có thể chiếm 1-4 bytes
- **Immutable**: mọi operation tạo string mới, không sửa in-place

### Q: String vs []byte vs []rune — when to use which? `[Mid]`

**A:**

| Type | Represents | Mutable | Khi nào dùng |
|------|-----------|---------|-------------|
| `string` | UTF-8 byte sequence | No | Text thông thường, map keys, constants |
| `[]byte` | Raw byte sequence | Yes | I/O operations, JSON marshal, buffer |
| `[]rune` | Unicode code points | Yes | Khi cần xử lý từng CHARACTER (emoji, CJK) |

**Vấn đề UTF-8:**
```go
s := "Việt Nam"
len(s)          // 10 — bytes, KHÔNG phải characters!
len([]rune(s))  // 8  — rune count = actual characters

// Iterate by byte — sai với Unicode
for i := 0; i < len(s); i++ { /* s[i] là byte, không phải char */ }

// Iterate by rune — đúng
for i, r := range s { /* r là rune (Unicode code point) */ }
```

### Q: Why use strings.Builder? `[Mid]`

**A:** Vì string immutable, nối string bằng `+` trong loop tạo N copies → **O(n²)**:

```go
// BAD — O(n²), N allocations
s := ""
for i := 0; i < 10000; i++ {
    s += "x"   // mỗi lần tạo string mới, copy toàn bộ
}

// GOOD — O(n), minimal allocations
var b strings.Builder
for i := 0; i < 10000; i++ {
    b.WriteString("x")  // append vào internal []byte
}
result := b.String()     // chỉ 1 conversion cuối cùng
```

`strings.Builder` nội bộ dùng `[]byte` buffer, chỉ convert sang `string` một lần khi gọi `String()`. Ngoài ra có thể `Grow(n)` để pre-allocate nếu biết trước size.

---

## 9. Error Handling Philosophy

### Q: Why does Go use "errors as values" instead of exceptions? `[Mid]`

**A:** Go chọn **explicit error handling** thay vì exceptions vì:

1. **Control flow rõ ràng** — nhìn code biết ngay chỗ nào có thể fail
2. **Không có hidden control flow** — exception có thể propagate qua N layers mà bạn không thấy
3. **Buộc handle error** — compiler cảnh báo nếu bỏ qua return value (với `errcheck` linter)
4. **Error là first-class value** — có thể wrap, transform, compare, store

```go
// Error interface chỉ có 1 method
type error interface {
    Error() string
}
```

### Q: How to create and wrap custom errors properly? `[Mid]`

**A:**

**Sentinel errors** — predefined error values:
```go
var (
    ErrNotFound     = errors.New("not found")
    ErrUnauthorized = errors.New("unauthorized")
)

if err == ErrNotFound { /* handle */ }
```

**Custom error types** — khi cần chứa thêm context:
```go
type ValidationError struct {
    Field   string
    Message string
}
func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation: %s — %s", e.Field, e.Message)
}
```

**Wrapping errors** với `%w` (Go 1.13+):
```go
func getUser(id int) (*User, error) {
    row := db.QueryRow("SELECT ...", id)
    if err := row.Scan(&user); err != nil {
        return nil, fmt.Errorf("getUser(%d): %w", id, err)
        // %w wraps — giữ error chain intact
        // %v chỉ format string — KHÔNG wrap, mất error chain
    }
    return &user, nil
}
```

### Q: Explain errors.Is and errors.As `[Mid]`

**A:**

```go
// errors.Is — check error CHAIN có chứa target error không (by value)
if errors.Is(err, ErrNotFound) {
    // err hoặc bất kỳ wrapped error nào == ErrNotFound
}
// ĐỪNG dùng: err == ErrNotFound — chỉ check top level

// errors.As — check error CHAIN có chứa target TYPE không
var valErr *ValidationError
if errors.As(err, &valErr) {
    fmt.Println(valErr.Field)  // access typed error fields
}
// ĐỪNG dùng: valErr, ok := err.(*ValidationError) — chỉ check top level
```

**Khi nào panic vs return error?**

| Situation | Approach |
|-----------|----------|
| File not found, network error, invalid input | Return `error` |
| Programmer bug (index out of bounds, nil deref) | `panic` (let it crash) |
| Unrecoverable state (corrupted data) | `panic` hoặc `log.Fatal` |
| Library initialization failure | `panic` acceptable (như `regexp.MustCompile`) |
| HTTP handler muốn tránh crash server | `recover` in middleware |

**Rule of thumb:** `panic` cho bugs, `error` cho expected failures.

---

## 10. Defer, Panic, Recover

### Q: How does defer work internally? `[Mid]`

**A:** `defer` đăng ký function call vào **defer stack** của current goroutine. Khi function return (bình thường hoặc panic), deferred calls thực thi theo **LIFO** (Last-In-First-Out):

```go
func example() {
    defer fmt.Println("1st")  // pushed first
    defer fmt.Println("2nd")  // pushed second
    defer fmt.Println("3rd")  // pushed third
    fmt.Println("main")
}
// Output: main, 3rd, 2nd, 1st
```

**Quan trọng:** Arguments được evaluate **lúc defer được gọi**, KHÔNG phải lúc deferred function execute:

```go
func example() {
    x := 0
    defer fmt.Println(x)  // x evaluated NOW → 0
    x = 42
}
// Output: 0 (NOT 42)
```

### Q: What is the defer closure gotcha? `[Senior]`

**A:** Khi dùng **closure** (anonymous function) với defer, nó capture **variable reference**, không phải value:

```go
// GOTCHA: closure captures variable by reference
func example() {
    x := 0
    defer func() {
        fmt.Println(x)  // x is captured by reference
    }()
    x = 42
}
// Output: 42 (closure sees final value)

// FIX: pass as argument
func example() {
    x := 0
    defer func(val int) {
        fmt.Println(val)  // val is copy of x at defer time
    }(x)
    x = 42
}
// Output: 0
```

**Common pattern — defer in loop:**
```go
// BUG: all defers use same loop variable
for _, f := range files {
    defer f.Close()  // OK — f is evaluated each iteration (Go 1.22+)
    // Before Go 1.22, closure over f was a classic bug
}
```

### Q: How do panic and recover work together? `[Mid]`

**A:**

**Panic propagation:**
1. `panic(value)` dừng execution hiện tại
2. Chạy tất cả deferred functions của current function
3. Return đến caller, chạy caller's deferred functions
4. Tiếp tục lên stack cho đến khi goroutine crash

**Recover chỉ hoạt động trong deferred function:**
```go
func safeCall() (err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered: %v", r)
            // Có thể log stack trace:
            // debug.PrintStack()
        }
    }()
    dangerousFunction()  // may panic
    return nil
}
```

**Practical pattern — HTTP middleware:**
```go
func RecoveryMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if err := recover(); err != nil {
                log.Printf("panic: %v\n%s", err, debug.Stack())
                http.Error(w, "Internal Server Error", 500)
            }
        }()
        next.ServeHTTP(w, r)
    })
}
```

---

## 11. init() Function

### Q: How does init() work and what is the execution order? `[Mid]`

**A:** `init()` là special function tự động chạy trước `main()`:

**Execution order:**
1. Import dependencies (recursive, depth-first)
2. Package-level variable initialization (theo thứ tự khai báo)
3. `init()` functions (theo thứ tự khai báo trong file, files theo alphabetical order)
4. Repeat cho mỗi package, bottom-up
5. Cuối cùng: `main.init()` rồi `main.main()`

```
imported pkg A init() → imported pkg B init() → main.init() → main.main()
```

**Đặc biệt:**
- Một file có thể có **nhiều `init()`** — chạy theo thứ tự khai báo
- Một package có thể có **nhiều file có `init()`** — files theo alphabetical order
- `init()` **không có parameters và return values**
- **Không thể gọi `init()` manually** — chỉ runtime gọi

### Q: What are init() anti-patterns? `[Senior]`

**A:**

| Anti-pattern | Problem | Alternative |
|-------------|---------|-------------|
| Heavy I/O (DB connection) | Fail silently, hard to test | Explicit `Setup()` function |
| Global mutable state | Hidden side effects, test interference | Dependency injection |
| Complex logic | Hard to debug, order-dependent | Constructor functions |
| Panic in init | Crash trước main, khó debug | Return error từ explicit init |

**Acceptable use cases:**
- Register drivers: `import _ "github.com/lib/pq"` (side-effect import)
- Compute tables: lookup tables, compile regex `regexp.MustCompile`
- Verify build constraints

**Best practice:** Hạn chế `init()` tối đa. Prefer explicit initialization cho testability.

---

## 12. Constants and iota

### Q: How do untyped constants work in Go? `[Mid]`

**A:** Go có khái niệm **untyped constants** — constants chưa có type cụ thể, linh hoạt hơn typed constants:

```go
const x = 42        // Untyped integer constant
const y int = 42    // Typed constant (int)

var a int32 = x     // OK — untyped x adapts to int32
var b int32 = y     // ERROR — y is typed int, cannot assign to int32
```

**Untyped constants có precision rất cao:**
```go
const big = 1e1000  // OK — untyped, stored with arbitrary precision
// var big float64 = 1e1000  // ERROR — overflows float64
const ratio = big / 1e999  // = 10.0, computed at compile time with full precision
```

Compiler giữ untyped constants ở **arbitrary precision** trong compile time. Chỉ khi assign vào typed variable mới kiểm tra overflow.

### Q: Explain iota patterns `[Mid]`

**A:** `iota` là compile-time counter, reset về 0 mỗi `const` block:

```go
// Basic enum
const (
    StatusPending  = iota  // 0
    StatusActive           // 1 (iota increments)
    StatusInactive         // 2
)

// Skip zero value (common pattern)
const (
    _ = iota        // 0 — discarded
    RoleUser        // 1
    RoleAdmin       // 2
    RoleSuperAdmin  // 3
)

// Bitmask pattern
const (
    FlagRead    = 1 << iota  // 1  (001)
    FlagWrite                // 2  (010)
    FlagExecute              // 4  (100)
)
perms := FlagRead | FlagWrite  // 3 (011)

// Size units
const (
    _  = iota
    KB = 1 << (10 * iota)  // 1024
    MB                      // 1048576
    GB                      // 1073741824
    TB                      // 1099511627776
)
```

**const vs var:** Constants được resolve hoàn toàn tại **compile time** — không có memory address, không thể lấy pointer, không thể dùng với `&`. Variables tồn tại tại **runtime** với memory address.

---

## 13. Packages and Visibility

### Q: How does visibility work in Go? `[Junior]`

**A:** Go dùng **capitalization** thay vì keywords (public/private):

| Naming | Visibility | Example |
|--------|-----------|---------|
| `Uppercase` first letter | Exported (public) | `User`, `GetName()`, `MaxSize` |
| `lowercase` first letter | Unexported (private to package) | `user`, `getName()`, `maxSize` |

Quy tắc này áp dụng cho: types, functions, methods, variables, constants, struct fields.

**Struct field visibility:**
```go
type User struct {
    Name  string  // Exported — JSON, other packages can see
    email string  // Unexported — chỉ package này truy cập
}
// json.Marshal(user) sẽ BỎ QUA field "email" vì unexported
```

### Q: What are internal packages? `[Mid]`

**A:** Thư mục `internal/` là special convention (enforced by Go toolchain):

```
myproject/
├── internal/
│   └── auth/         ← chỉ myproject và sub-packages import được
├── pkg/
│   └── utils/        ← ai cũng import được
└── cmd/
    └── server/
```

Code trong `internal/` chỉ accessible bởi code trong **parent directory tree**. Đây là cách expose public API mà không lộ implementation details.

### Q: How to avoid circular dependencies? `[Senior]`

**A:** Go **cấm circular imports** (compile error). Đây là design choice để đảm bảo fast compilation và clean architecture.

**Strategies:**
1. **Interface in consumer package** — package A define interface, package B implement
2. **Extract shared types** — tạo package C chứa shared types mà A và B cùng dùng
3. **Dependency inversion** — high-level module define interface, low-level module implement
4. **Merge packages** — nếu 2 packages quá coupled, có thể chúng nên là 1 package

```
// BAD: circular
// package order imports package user
// package user imports package order

// GOOD: extract interface
// package order defines UserGetter interface
// package user implements UserGetter
// package main wires them together
```

---

## 14. Go Modules

### Q: Explain go.mod and go.sum `[Junior]`

**A:**

**`go.mod`** — khai báo module path và dependencies:
```
module github.com/myorg/myproject

go 1.22

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/lib/pq v1.10.9
)

require (
    // indirect dependencies (auto-managed)
    golang.org/x/crypto v0.14.0 // indirect
)
```

**`go.sum`** — checksum database để verify integrity:
- Chứa cryptographic hash của mỗi module version
- **PHẢI commit vào git** — đảm bảo mọi người dùng cùng exact dependency bytes
- Format: `module version hash` pairs

### Q: What are common go.mod directives? `[Mid]`

**A:**

| Directive | Purpose | Example |
|-----------|---------|---------|
| `module` | Module path | `module github.com/org/repo` |
| `go` | Minimum Go version | `go 1.22` |
| `require` | Declare dependency | `require github.com/pkg/errors v0.9.1` |
| `replace` | Override module source | `replace github.com/old => ../local-fork` |
| `exclude` | Skip specific version | `exclude github.com/pkg v1.2.3` |
| `retract` | Mark own versions as bad | `retract v1.0.0 // critical bug` |

**`replace` directive** — dùng khi:
- Local development với fork
- Monorepo với multiple modules
- Override broken dependency
- **Chỉ có hiệu lực ở main module** — library's replace bị ignore

### Q: How does the module proxy work? `[Mid]`

**A:** Go module proxy (`proxy.golang.org`) là caching layer giữa `go` command và source repos:

```
go get github.com/gin-gonic/gin
         │
         ▼
┌─────────────────┐    miss    ┌──────────────────┐
│  Module Proxy   │ ────────→  │   Source (GitHub)  │
│ proxy.golang.org│ ←───────── │                    │
│  (cache + serve)│   fetch    └──────────────────┘
└─────────────────┘
```

**Lợi ích:**
1. **Availability** — module vẫn có nếu source repo bị xóa
2. **Immutability** — version đã published không thể thay đổi
3. **Performance** — faster downloads từ CDN
4. **Security** — `sum.golang.org` verify checksums globally

**`GONOSUMCHECK`** và **`GONOSUMDB`** để skip cho private repos. **`GOPRIVATE`** để cấu hình private module patterns.

### Q: Explain vendoring and when to use it `[Mid]`

**A:** `go mod vendor` copy tất cả dependencies vào thư mục `vendor/`:

```bash
go mod vendor       # copy deps to ./vendor/
go build -mod=vendor  # build using vendor directory
```

**Khi nào dùng vendor:**
- CI/CD cần reproducible builds không phụ thuộc external network
- Corporate environment không truy cập được module proxy
- Muốn audit toàn bộ dependency code trong repo

**Khi nào KHÔNG vendor:**
- Project nhỏ — `go.sum` đã đảm bảo integrity
- Module proxy reliable — `proxy.golang.org` rất stable

---

## Go Language Cheat Sheet

### Type System Quick Reference

```
┌─────────── Value Types ───────────┐  ┌──── Types with Internal Pointers ────┐
│ bool, int*, uint*, float*, complex │  │ slice  → {ptr, len, cap}            │
│ string (immutable)                 │  │ map    → pointer to runtime.hmap    │
│ array  [N]T (fixed size)           │  │ channel→ pointer to runtime.hchan   │
│ struct (all fields copied)         │  │ pointer→ address                    │
└────────────────────────────────────┘  │ interface→ {type ptr, data ptr}     │
                                        │ function → pointer to code          │
                                        └──────────────────────────────────────┘
```

### Common Patterns

```go
// 1. Functional options pattern
type Option func(*Server)
func WithPort(p int) Option { return func(s *Server) { s.port = p } }
func NewServer(opts ...Option) *Server {
    s := &Server{port: 8080}
    for _, opt := range opts { opt(s) }
    return s
}

// 2. Error wrapping chain
if err != nil {
    return fmt.Errorf("operation X: %w", err)
}

// 3. Nil slice is functional
var s []int            // nil, but append works
s = append(s, 1, 2, 3) // [1, 2, 3]

// 4. Map existence check
val, ok := m[key]
if !ok { /* key does not exist */ }

// 5. Type assertion
if v, ok := i.(string); ok { /* v is string */ }

// 6. Ensure interface compliance at compile time
var _ io.Reader = (*MyType)(nil)
```

### Memory & Performance Quick Rules

| Guideline | Rule |
|-----------|------|
| Slice pre-allocation | `make([]T, 0, estimatedCap)` — tránh repeated growth |
| Map pre-allocation | `make(map[K]V, estimatedSize)` — giảm rehashing |
| String concatenation | `strings.Builder` cho loops, `+` cho 2-3 strings OK |
| Pointer vs value | Value cho small structs (<64B), pointer cho large/mutable |
| Slice as function arg | Full slice `s[a:b:b]` để tránh shared backing array |

---

## Interview Questions

### Junior Level

1. **Q: What is the zero value of a slice? Can you append to it?**
   A: `nil`. Có — `append(nilSlice, 1)` hoạt động bình thường. `nil` slice có len=0, cap=0, nhưng `append` sẽ allocate backing array mới.

2. **Q: What's the difference between `var s []int` and `s := make([]int, 0)`?**
   A: `var s []int` tạo `nil` slice. `make([]int, 0)` tạo empty non-nil slice (pointer trỏ đến empty array). Functionally gần giống nhưng `json.Marshal` cho `null` vs `[]`.

3. **Q: Can you take the address of a map element? Why not?**
   A: Không. Map có thể rehash bất kỳ lúc nào (khi grow), address của element sẽ thay đổi. Compiler cấm `&m[key]` để tránh dangling pointer.

4. **Q: What does `defer` do? In what order are deferred calls executed?**
   A: `defer` register function call để chạy khi surrounding function return. Thứ tự LIFO — last deferred, first executed.

5. **Q: How do you check if a key exists in a map?**
   A: `val, ok := m[key]` — `ok` là `false` nếu key không tồn tại. Đừng chỉ dùng `val := m[key]` vì zero value và key-not-found không phân biệt được.

### Mid Level

6. **Q: Explain how slice growth works. What happens when you append beyond capacity?**
   A: Go allocate backing array mới (double cap nếu <256, ~25%+192 nếu >=256), copy elements cũ sang, trả slice header mới. Backing array cũ sẽ được GC nếu không còn reference.

7. **Q: What's the difference between `errors.Is` and `==` for error comparison?**
   A: `==` chỉ compare top-level error. `errors.Is` unwrap toàn bộ error chain để tìm match. Luôn dùng `errors.Is` khi errors có thể wrapped.

8. **Q: Why can't you call a pointer receiver method on a non-addressable value?**
   A: Pointer receiver cần address của receiver. Non-addressable values (map elements, function returns, interface values) không có stable address. Compiler cấm vì không thể lấy `&value` an toàn.

9. **Q: How does Go ensure map iteration is random?**
   A: Runtime chọn random starting bucket và random offset trong bucket mỗi lần `range`. Seed thay đổi mỗi lần chạy program. Đây là design choice, không phải implementation accident.

10. **Q: What happens if you modify a slice inside a function — is it visible to the caller?**
    A: Modifying existing elements — CÓ (shared backing array). `append` mà không exceed capacity — CÓ (ghi vào backing array cũ). `append` exceed capacity — KHÔNG (new backing array, caller không thấy). Đây là nguồn bugs phổ biến.

### Senior Level

11. **Q: Explain escape analysis. How would you verify if a variable escapes to the heap?**
    A: Compiler phân tích xem variable có "sống" lâu hơn function scope không. Nếu có (return pointer, assign to global, interface boxing) → heap allocation. Dùng `go build -gcflags="-m"` để xem. Heap allocation tốn kém hơn vì cần GC.

12. **Q: Design a type-safe enum in Go without generics. What are the trade-offs?**
    A: Dùng unexported base type + exported constants + `String()` method. Trade-off: không thể restrict giá trị tại compile time (ai cũng có thể cast `MyEnum(999)`). Dùng `go generate` với `stringer` tool để auto-generate `String()`.

13. **Q: Why does Go's map use load factor 6.5? What's the significance?**
    A: Load factor 6.5 = trung bình 6.5 entries/bucket (mỗi bucket chứa 8 slots). Đây là trade-off: cao hơn → ít memory waste, nhiều overflow buckets, slower lookup. Thấp hơn → nhiều empty buckets, faster lookup. 6.5/8 ≈ 81% utilization — balance giữa memory và performance.

14. **Q: How would you handle a goroutine that panics? What's the scope of recover?**
    A: `recover()` chỉ hoạt động trong deferred function của cùng goroutine bị panic. Goroutine khác KHÔNG thể recover panic của goroutine này. Nếu goroutine panic mà không recover → entire program crash. Pattern: wrapper function với defer+recover cho mỗi goroutine.

15. **Q: Explain the internal difference between `type MyInt int` and `type MyInt = int`. When would each be appropriate in a large codebase refactoring?**
    A: Type definition tạo type mới — methods riêng, không assignable trực tiếp. Type alias giữ nguyên type — dùng cho gradual refactoring (di chuyển type từ package A sang B mà không break callers). Alias là transitional tool, definition là permanent design choice.

---

> **Next**: [02-interfaces-and-generics.md](./02-interfaces-generics.md) — Interface internals, type assertion, generics
