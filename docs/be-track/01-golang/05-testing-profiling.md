# Testing & Profiling in Go — Deep Theory & Interview Questions

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Go Interfaces & Generics](./02-interfaces-generics.md), [Go Memory & GC](./04-memory-gc.md)
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> **Phạm vi**: Unit test, benchmark, fuzz, mocking, integration test, HTTP test, race detector, coverage, profiling, static analysis.
> Tập trung lý thuyết sâu (~75%), code minh họa pattern (~25%) — phù hợp ôn phỏng vấn Golang Backend.

---

## Real-World Scenario / Tình Huống Thực Tế

**Zalo backend review:** PR được approve, CI xanh, deploy lên staging. 30 phút sau production báo lỗi: transfer amount đôi khi bị nhân đôi. `go test -race` locally không phát hiện vì không chạy concurrent test. Thêm `t.Parallel()` + `-race` flag → data race phát hiện ngay trên goroutine counter.

**Bài học:** Testing trong Go không chỉ là "viết test". Race detector, benchmark, pprof profiling là công cụ phân biệt backend dev biết tìm bug production vs chỉ đảm bảo unit test xanh.

## What & Why / Cái Gì & Tại Sao

**Analogy:** `go test` giống **phòng thí nghiệm tích hợp** trong nhà máy sản xuất: không chỉ kiểm tra từng linh kiện (unit test), mà còn kiểm tra toàn bộ dây chuyền dưới tải nặng (benchmark), tìm tình huống bất thường (fuzz test), và đo hiệu năng thực tế (pprof). Tất cả đều built-in, không cần cài thêm gì.

**Why Go's approach matters:** Mocking trong Go không cần framework — chỉ cần interface. Viết `DatabaseStore interface { Save(u User) error }` thì `FakeStore` chỉ là struct implement interface đó. Điều này giúp test nhanh hơn và không phụ thuộc vào magic reflection.

## Concept Map / Bản Đồ Khái Niệm

```
[go test toolchain]
     │
     ├──► Unit Test (*_test.go, Test* prefix, t.Error/t.Fatal)
     │       └── Table-driven tests (slice of struct → t.Run)
     │
     ├──► Benchmark (Benchmark* prefix, b.N loop)
     │       └── pprof integration (cpu, mem, goroutine profiles)
     │
     ├──► Fuzz Test (Fuzz* prefix, f.Add seeds, Go 1.18+)
     │
     ├──► Integration Test (httptest.NewServer, testcontainers)
     │
     └──► Race Detector (-race flag → ThreadSanitizer)
              └── Required in CI for concurrent code

[Mocking without frameworks]
     Dependency → interface → FakeImpl in _test.go
```

---

## 1. Testing Philosophy in Go

### Q1: Triết lý thiết kế testing trong Go khác gì so với các ngôn ngữ khác? 🟡

**A:**

Go có cách tiếp cận **minimalist** và **convention-over-configuration** cho testing:

| Đặc điểm | Go | Java/C#/Python |
|-----------|-----|----------------|
| Framework | Built-in `testing` package | JUnit, NUnit, pytest (third-party) |
| Assertion library | Không có sẵn — dùng `if` + `t.Error` | `assertEquals`, `assert.Equal` |
| Test runner | `go test` (built-in toolchain) | Cần cấu hình riêng |
| Test discovery | Convention: `*_test.go` + `Test*` prefix | Annotations, decorators |
| Mocking framework | Không có sẵn — dùng interface | Built-in hoặc third-party |

**Lý do Go không có assertion library:**
- Rob Pike và team tin rằng assertion khuyến khích **lazy testing** — dev viết `assertEqual` rồi không suy nghĩ về error message
- Go khuyến khích viết **error message mô tả rõ context**: `t.Errorf("Add(2,3) = %d, want 5", got)`
- Điều này tạo ra test output **self-documenting** — khi fail, bạn biết ngay cái gì sai

**Test file convention:**
- File `foo.go` → test trong `foo_test.go` (cùng directory)
- File `_test.go` **không được compile** vào binary production — Go compiler tự loại bỏ

> **Phỏng vấn**: "Go không cần testing framework vì testing đã là first-class citizen trong toolchain."

---

### Q2: Table-driven tests là gì và tại sao nó là Go idiom? 🟢

**A:**

Table-driven test tổ chức test cases thành **slice of struct**, mỗi phần tử là một test case:

1. **Dễ thêm case mới** — chỉ thêm 1 struct vào slice
2. **DRY** — logic test chỉ viết 1 lần, data thay đổi
3. **Readable** — tất cả edge cases nằm cùng 1 chỗ, dễ review
4. **Convention** — Go standard library sử dụng pattern này rất nhiều

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive numbers", 2, 3, 5},
        {"negative numbers", -1, -2, -3},
        {"zero", 0, 0, 0},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := Add(tt.a, tt.b); got != tt.expected {
                t.Errorf("Add(%d, %d) = %d, want %d", tt.a, tt.b, got, tt.expected)
            }
        })
    }
}
```

**Tại sao anonymous struct?** Test case struct chỉ dùng trong 1 function → không cần pollute package namespace. Named struct chỉ khi nhiều test functions share cùng format.

---

### Q3: Test naming conventions và tổ chức test file? 🟢

**A:**

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| Unit test | `TestXxx(t *testing.T)` | `TestAdd`, `TestUser_Validate` |
| Benchmark | `BenchmarkXxx(b *testing.B)` | `BenchmarkSort` |
| Fuzz test | `FuzzXxx(f *testing.F)` | `FuzzParseJSON` |
| Example | `ExampleXxx()` | `ExampleAdd` |

**Subtest**: `t.Run("name", ...)` tạo `TestParent/name`. Tên nên mô tả **scenario** (`"empty input"`) không phải implementation (`"len is zero"`).

```
package/
├── user.go           # Production code
├── user_test.go      # Tests cho user.go
├── testdata/         # Test fixtures, golden files (go build tự bỏ qua)
│   └── golden/
└── export_test.go    # Export internal cho black-box tests
```

---

## 2. Unit Testing

### Q4: Các method quan trọng của `testing.T`? 🟡

**A:**

| Method | Hành vi | Dùng khi |
|--------|---------|----------|
| `t.Error/Errorf` | Log + **tiếp tục chạy** | Report nhiều failures trong 1 test |
| `t.Fatal/Fatalf` | Log + **dừng test ngay** | Failure làm assertion sau vô nghĩa |
| `t.Skip` | Bỏ qua test | Điều kiện không thỏa (CI, OS...) |
| `t.Helper()` | Đánh dấu function là helper | Error report ở caller, không ở helper |
| `t.Cleanup(func())` | Đăng ký cleanup | Teardown resource sau test |
| `t.Parallel()` | Chạy song song | Test không share mutable state |
| `t.TempDir()` | Tạo temp dir, tự cleanup | Cần viết file tạm |

**`t.Error` vs `t.Fatal`**: Dùng `Fatal` khi failure sẽ khiến assertion tiếp theo **panic hoặc vô nghĩa** (VD: `err != nil` → result là nil → dereference panic).

---

### Q5: `t.Helper()` giải quyết vấn đề gì? 🟢

**A:**

Khi viết helper function, error message mặc định report **dòng code trong helper** — không hữu ích. `t.Helper()` khiến Go report **dòng code nơi gọi helper**.

```go
func assertEqual(t *testing.T, got, want int) {
    t.Helper()  // ← Không có dòng này, error chỉ vào assertEqual thay vì caller
    if got != want {
        t.Errorf("got %d, want %d", got, want)
    }
}
```

`t.Helper()` stack — nếu helper A gọi helper B, cả hai cùng gọi `t.Helper()`, error chỉ đến nơi gọi A.

---

### Q6: `t.Parallel()` hoạt động như thế nào? Caveats? 🟡

**A:**

**Cơ chế:**
1. Khi gặp `t.Parallel()`, test **pause** vào parallel queue
2. Parent test chạy hết subtests → parallel subtests chạy đồng thời
3. Mặc định `GOMAXPROCS` goroutines song song, override: `go test -parallel N`

**Caveat — loop variable capture (trước Go 1.22):**

```go
for _, tt := range tests {
    tt := tt  // ← BẮT BUỘC trước Go 1.22, shadow biến loop
    t.Run(tt.name, func(t *testing.T) {
        t.Parallel()
        got := Process(tt.input)
    })
}
```

> **Go 1.22+**: Loop variable tạo mới mỗi iteration → không cần `tt := tt`. Nhưng nên biết pattern cũ vì legacy code.

**Khi KHÔNG dùng**: Test modify shared state, cần thứ tự, dùng resource giới hạn (port cố định).

---

### Q7: `t.Cleanup()` vs `defer`? 🟢

**A:**

| | `defer` | `t.Cleanup()` |
|--|---------|---------------|
| Scope | Function hiện tại | Test hiện tại (kể cả subtests) |
| Dùng trong helper | Cleanup khi helper return (**SAI**) | Cleanup khi **test** kết thúc (**ĐÚNG**) |

```go
func setupDB(t *testing.T) *sql.DB {
    t.Helper()
    db, _ := sql.Open("postgres", dsn)
    t.Cleanup(func() { db.Close() })  // ← close khi TEST kết thúc
    return db
}
```

**Rule**: `t.Cleanup()` trong **helper functions**, `defer` trong **test function trực tiếp**.

---

## 3. Table-Driven Tests — Advanced Patterns

### Q8: Các pattern nâng cao? 🟡

**A:**

**Pattern 1 — Check function thay vì expected value** (khi validation phức tạp):

```go
tests := []struct {
    name  string
    input string
    check func(t *testing.T, result *Result, err error)
}{
    {
        name: "valid input",
        input: "hello",
        check: func(t *testing.T, r *Result, err error) {
            t.Helper()
            if err != nil { t.Fatalf("unexpected error: %v", err) }
            if r.Len != 5 { t.Errorf("Len = %d, want 5", r.Len) }
        },
    },
}
```

**Pattern 2 — Map thay vì slice**: `tests := map[string]struct{ ... }{}`. Map iteration không deterministic → phát hiện order-dependent bugs, nhưng có thể gây flaky tests.

**Pattern 3 — Per-test setup**: Thêm `setup func(t *testing.T)` vào struct, gọi trước mỗi test case.

---

## 4. Benchmarking

### Q9: Go benchmark hoạt động như thế nào? `b.N` là gì? 🟡

**A:**

`b.N` là số lần lặp do **Go tự động quyết định**:
1. Go chạy với `b.N = 1`, nếu quá nhanh (< 1s), tăng lên (2, 5, 10, 100...)
2. Lặp cho đến tổng thời gian >= 1 giây (hoặc `-benchtime`)
3. Tính trung bình: `total_time / b.N`

```go
func BenchmarkFib(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Fib(20)
    }
}
```

**Output giải thích:**

```
BenchmarkFib-8    5000000    234 ns/op    16 B/op    2 allocs/op
│             │   │          │            │          └── allocations/op
│             │   │          │            └── bytes allocated/op
│             │   │          └── nanoseconds/op
│             │   └── b.N
│             └── GOMAXPROCS
└── Tên benchmark
```

**Các method quan trọng:**

| Method | Dùng khi |
|--------|----------|
| `b.ResetTimer()` | Sau expensive setup (không tính setup time) |
| `b.StopTimer()` / `b.StartTimer()` | Per-iteration setup |
| `b.ReportAllocs()` | Luôn luôn (hoặc dùng `-benchmem`) |
| `b.SetBytes(n)` | I/O benchmarks (report MB/s) |

---

### Q10: So sánh benchmark results với `benchstat`? 🟡

**A:**

```bash
go test -bench=. -count=10 > old.txt
# ... thay đổi code ...
go test -bench=. -count=10 > new.txt
benchstat old.txt new.txt
```

```
name      old time/op  new time/op  delta
Fib-8     234ns ± 2%   189ns ± 1%  -19.23%  (p=0.000 n=10+10)
```

- `± 2%` — variance giữa các lần chạy
- `p=0.000` — p-value (< 0.05 = statistically significant)
- **Luôn chạy `--count=N` (N >= 5)** — benchmark 1 lần không có ý nghĩa thống kê

---

## 5. Fuzz Testing (Go 1.18+)

### Q11: Fuzz testing là gì và Go triển khai thế nào? 🟡

**A:**

**Fuzzing** = engine **tự sinh input ngẫu nhiên** để tìm bugs. Go dùng **coverage-guided fuzzing**:

1. Bắt đầu với **seed corpus** (inputs cung cấp qua `f.Add()`)
2. Engine **mutate** seeds (flip bits, thêm/bớt bytes, swap...)
3. Mutation tăng **code coverage** → giữ lại làm corpus mới
4. Input gây crash → lưu vào `testdata/fuzz/FuzzXxx/` làm **regression test**

```go
func FuzzParseJSON(f *testing.F) {
    f.Add([]byte(`{"name": "Go"}`))
    f.Add([]byte(`{}`))

    f.Fuzz(func(t *testing.T, data []byte) {
        var v interface{}
        if err := json.Unmarshal(data, &v); err != nil {
            return  // Invalid input → OK
        }
        // Verify roundtrip
        encoded, err := json.Marshal(v)
        if err != nil {
            t.Fatalf("Marshal failed after Unmarshal: %v", err)
        }
        var v2 interface{}
        if err := json.Unmarshal(encoded, &v2); err != nil {
            t.Fatalf("Roundtrip failed: %v", err)
        }
    })
}
```

```bash
go test -fuzz=FuzzParseJSON -fuzztime=30s  # Chạy 30 giây
go test -run=FuzzParseJSON                 # Chỉ chạy seed corpus (như unit test)
```

**Khi nào dùng**: Parse input từ user, serialize/deserialize roundtrip, cryptographic code, bất kỳ function nhận `[]byte`/`string` từ untrusted source.

**Bugs thực tế**: `encoding/gob` panic, `archive/zip` infinite loop, `image/png` OOM — tất cả tìm bởi fuzzing.

> **Phỏng vấn**: Fuzzing tìm bugs ở **ranh giới** mà con người không nghĩ tới — đó là giá trị chính.

---

## 6. Mocking Strategies

### Q12: Go tiếp cận mocking như thế nào? 🟡

**A:**

Go dựa vào **interfaces** + **implicit satisfaction**. Triết lý: **"Accept interfaces, return structs"**

```go
// Production — depend on interface
type UserRepository interface {
    FindByID(ctx context.Context, id string) (*User, error)
}
type UserService struct { repo UserRepository }

// Test — hand-written mock
type mockUserRepo struct {
    findByIDFunc func(ctx context.Context, id string) (*User, error)
}
func (m *mockUserRepo) FindByID(ctx context.Context, id string) (*User, error) {
    return m.findByIDFunc(ctx, id)
}
```

### Q13: So sánh các mocking approaches? 🟡

**A:**

| Approach | Pros | Cons | Dùng khi |
|----------|------|------|----------|
| **Hand-written mock** | Simple, explicit, no deps | Boilerplate nhiều | Interface nhỏ (1-3 methods) |
| **gomock + mockgen** | Auto-generate, verify call order | Learning curve | Interface lớn, cần verify behavior |
| **testify/mock** | Fluent API, popular | Runtime panics, reflection | Team đã quen testify |
| **Real implementation** | Most realistic | Slow, setup phức tạp | Integration test |

**Khi nào KHÔNG mock:**
- Không mock types bạn không sở hữu (mock ở interface level)
- Không mock value objects (struct nhỏ, không side effects)
- Không mock everything — over-mocking làm test fragile

> **Go community**: Hand-written mocks ưa chuộng hơn cho interfaces nhỏ. "A little copying is better than a little dependency."

---

## 7. Integration Testing

### Q14: Cách tổ chức integration tests tách biệt? 🟡

**A:**

**Approach 1 — Build tags (khuyến nghị):**

```go
//go:build integration
package myapp_test
```

```bash
go test ./...                       # Chỉ unit tests
go test -tags=integration ./...     # Cả integration tests
```

**Approach 2 — `testing.Short()`:** `t.Skip` khi `-short` flag. **Approach 3 — Env var:** `t.Skip` khi `INTEGRATION` env không set.

### Q15: `TestMain` dùng để làm gì? 🟡

**A:**

Kiểm soát **toàn bộ lifecycle** test trong 1 package:

```go
func TestMain(m *testing.M) {
    pool, resource := setupPostgres()   // Setup 1 lần
    code := m.Run()                     // Chạy tất cả tests
    pool.Purge(resource)                // Teardown
    os.Exit(code)                       // BẮT BUỘC gọi os.Exit
}
```

**Lưu ý**: Mỗi package chỉ 1 `TestMain`. Nếu quên `os.Exit`, exit code luôn 0 (ẩn failures). Không có `testing.T` trong TestMain.

### Q16: Testcontainers-go? 🟡

**A:**

Spin up **Docker containers** trong test — mỗi run có environment sạch. Ưu điểm: isolation hoàn toàn, không cần cài DB local, reproducible. Nhược điểm: vài giây spin up → dùng `TestMain` để reuse container.

```go
func setupPostgres(t *testing.T) *sql.DB {
    t.Helper()
    container, _ := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
        ContainerRequest: testcontainers.ContainerRequest{
            Image: "postgres:15-alpine", ExposedPorts: []string{"5432/tcp"},
            WaitingFor: wait.ForListeningPort("5432/tcp"),
        },
        Started: true,
    })
    t.Cleanup(func() { container.Terminate(ctx) })
    // ... connect and return db
}
```

---

## 8. HTTP Testing

### Q17: `httptest` package cung cấp gì? 🟡

**A:**

| | `httptest.NewRecorder()` | `httptest.NewServer()` |
|--|--------------------------|------------------------|
| Network | Không | Có (localhost) |
| Tốc độ | Rất nhanh | Nhanh |
| Test scope | Handler logic only | Full HTTP stack |
| Dùng cho | Unit test handlers | Test HTTP clients, middleware chain |

```go
// NewRecorder — test handler trực tiếp
func TestHealth(t *testing.T) {
    req := httptest.NewRequest("GET", "/health", nil)
    w := httptest.NewRecorder()
    HealthHandler(w, req)
    if w.Code != 200 { t.Errorf("status = %d, want 200", w.Code) }
}

// NewServer — fake server cho client testing
server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte(`[{"id":1}]`))
}))
defer server.Close()
client := NewAPIClient(server.URL)  // Test client với fake server
```

**Test middleware**: Tạo inner handler giả (luôn trả 200), wrap bằng middleware, verify middleware behavior (auth reject, header injection, etc.)

---

## 9. Race Detector

### Q18: Go race detector hoạt động như thế nào? 🔴

**A:**

Dựa trên **ThreadSanitizer (TSan)** của Google, ported sang Go runtime.

**Nguyên lý:**
1. Compiler **instrument** mọi memory access khi build với `-race`
2. Runtime duy trì **shadow memory** — metadata cho mỗi memory location
3. Ghi lại: **goroutine nào**, **thời điểm nào**, **read hay write**
4. Khi 2 goroutines truy cập cùng location, ít nhất 1 write, **không có synchronization** → RACE

**Happens-before analysis**: Track sync qua channel ops, mutex, WaitGroup, atomic. Nếu access A happens-before B → OK. Nếu không → RACE.

```bash
go test -race ./...       # Test với race detector
go build -race -o app     # Build binary với race detector
```

**Performance overhead**: CPU 2-20x, Memory 5-10x — chấp nhận được cho testing.

**Quan trọng:**
- **Không false positives** — report race = chắc chắn có race
- **Có false negatives** — race tồn tại nhưng code path chưa trigger
- Luôn chạy `-race` trong CI. Nhiều team coi race failure là **blocking**.

---

## 10. Code Coverage

### Q19: Coverage hoạt động thế nào? Ý nghĩa? 🟡

**A:**

Compiler insert **counter** vào mỗi **basic block**. Test chạy → counter ghi block nào execute → tính %.

```bash
go test -coverprofile=c.out ./...          # Xuất coverage
go tool cover -html=c.out -o cover.html    # HTML report
go tool cover -func=c.out                  # Per-function
```

**Cover modes**: `set` (boolean, default), `count` (số lần), `atomic` (thread-safe, dùng với `-race`).

| Coverage | Đánh giá |
|----------|----------|
| < 40% | Thiếu nghiêm trọng |
| 60-80% | Tốt — hầu hết logic quan trọng |
| > 80% | Diminishing returns |
| 100% | Gần như không cần thiết |

**Vanity vs Meaningful coverage**: 90% coverage nhưng chỉ test happy path = vanity. 70% nhưng cover critical paths + error handling = meaningful.

> **Phỏng vấn**: "Coverage tells you what code was executed, not whether it was tested correctly."

---

## 11. Test Organization

### Q20: `package foo` vs `package foo_test`? 🟡

**A:**

| | `package foo` (white-box) | `package foo_test` (black-box) |
|--|---------------------------|-------------------------------|
| Access | Exported + unexported | Chỉ exported API |
| Test gì | Internal implementation | Public API contract |
| Khi nào | Test private logic | Test public interface, prevent import cycles |

Cả 2 package có thể ở **cùng file** `foo_test.go`!

**`export_test.go` pattern** — khi black-box test cần access internal:

```go
// file: export_test.go, package foo
var InternalHelper = internalHelper  // Export cho foo_test package
```

Standard library dùng pattern này rất nhiều (`strings/export_test.go`).

### Q21: Golden files pattern? 🟢

**A:**

**File chứa expected output**, dùng cho functions có output phức tạp:

1. Lần đầu: `go test -run TestRender -update` → tạo golden file
2. Review golden file → commit vào git
3. Sau đó: `go test` → so sánh output với golden file
4. Output thay đổi intentional: chạy `-update` lại, review diff

Ưu điểm: Không cần assertion phức tạp. Git diff cho thấy chính xác gì thay đổi.

---

## 12. Profiling in Production

### Q22: Go profiling tools và khi nào dùng? 🔴

**A:**

| Profile | Đo gì | Dùng khi |
|---------|-------|----------|
| **CPU** | Thời gian CPU/function | App chậm, CPU cao |
| **Heap** | Memory đang giữ | Memory leak, OOM |
| **Allocs** | Tổng allocations | Giảm GC pressure |
| **Goroutine** | Stack traces | Goroutine leak |
| **Block** | Block trên sync primitives | Contention |
| **Mutex** | Thời gian giữ mutex | Lock contention |

**Setup production:**

```go
import _ "net/http/pprof"
go func() { log.Println(http.ListenAndServe("localhost:6060", nil)) }()
```

```bash
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30  # CPU
go tool pprof http://localhost:6060/debug/pprof/heap                # Memory
# Interactive: top 20, list funcName, web, svg
```

**Continuous profiling**: Pyroscope (open-source, Grafana Cloud), Parca (eBPF-based), Google Cloud Profiler, Datadog.

**Production-safe principles:**
- CPU profiling ~5% overhead — OK cho short bursts
- Heap profiling: sampling-based, gần zero overhead — safe bật luôn
- Block/Mutex: overhead cao (10-30%) — KHÔNG bật mặc định
- pprof endpoint **phải** internal port — KHÔNG expose public (leak source, secrets trong goroutine stacks)

---

## 13. Go Vet and Static Analysis

### Q23: `go vet` phát hiện được gì? 🟢

**A:**

Static analysis **built-in**, chạy nhanh, gần zero false positives:

| Check | Phát hiện | Ví dụ |
|-------|-----------|-------|
| `printf` | Format string mismatch | `Printf("%d", "string")` |
| `structtag` | Malformed struct tags | `` `json:"name" xml:name` `` |
| `unusedresult` | Ignored return values | `fmt.Sprintf("hi")` không assign |
| `copylock` | Copy mutex/lock | `var mu2 = mu1` |
| `loopclosure` | Closure capture loop var | `go func() { use(v) }()` |

### Q24: `golangci-lint` — khi nào và cách dùng? 🟡

**A:**

| Tool | Dùng khi |
|------|----------|
| `go vet` | Luôn luôn (minimum, built-in) |
| `staticcheck` | Cần deep analysis, low false positive |
| `golangci-lint` | **Meta-linter** ~100+ linters, team CI |

**Common linter rules**: `errcheck` (unchecked errors), `gosec` (security), `ineffassign` (dead assignment), `goconst` (repeated strings), `prealloc` (slice preallocation).

```bash
golangci-lint run ./...                    # Tất cả linters
golangci-lint run --new-from-rev=main      # Chỉ code mới (CI best practice)
```

---

## Testing Best Practices Checklist

**Must Have (P0):**
- [ ] `go test -race ./...` trong CI — **blocking**
- [ ] `go vet ./...` trong CI — **blocking**
- [ ] Table-driven tests cho functions có nhiều cases
- [ ] `t.Helper()` trong mọi test helper function
- [ ] `t.Parallel()` cho tests không share mutable state

**Should Have (P1):**
- [ ] `golangci-lint` trong CI
- [ ] Coverage tracking (target 60-80%)
- [ ] Integration tests với build tags tách biệt
- [ ] Benchmark cho performance-critical code
- [ ] Mock qua interfaces, không mock concrete types

**Nice to Have (P2):**
- [ ] Fuzz testing cho parsers/serializers
- [ ] Golden file tests cho complex output
- [ ] Continuous profiling production (Pyroscope/Parca)
- [ ] `benchstat` cho benchmark comparison

---

## Interview Questions — Testing & Profiling

### Level Junior 🟢

**Q25: Viết 1 table-driven test cho `Max(a, b int) int`?**

**A:** Interviewer muốn thấy: anonymous struct, `t.Run`, tên case mô tả scenario, error message có context (`got`/`want`). Xem Q2 pattern.

**Q26: `t.Error` vs `t.Fatal`?**

**A:** `t.Error` tiếp tục chạy → report nhiều failures. `t.Fatal` dừng ngay → failure làm assertion tiếp vô nghĩa (nil pointer, setup failed).

**Q27: Chạy 1 test cụ thể?**

```bash
go test -run TestAdd ./...              # Regex match tên test
go test -run TestAdd/positive ./...     # Subtest cụ thể
go test -v -count=1 ./pkg/math         # Verbose, disable cache
```

---

### Level Mid 🟡

**Q28: Test service có external dependencies?**

**A:** 3 levels:
1. **Unit test**: Mock dependencies qua interfaces → nhanh, isolated
2. **Integration test**: testcontainers-go + real DB → build tags + CI
3. **Contract test**: Verify giao tiếp đúng protocol

**Q29: Benchmark function A nhanh hơn B 5%. Switch không?**

**A:** Cần xem xét: benchstat significant? (p < 0.05, count >= 5). Readable/maintainable? Hot path hay cold path? **Premature optimization is the root of all evil** — chỉ optimize khi profiling chỉ bottleneck thực.

**Q30: Race detector — tại sao không false positive nhưng có false negative?**

**A:** Dùng **happens-before analysis** instrument mọi memory access. Không false positive vì chỉ report khi **thực sự observe** conflicting accesses. False negative vì chỉ detect races **xảy ra** during execution — code path không chạy = race không phát hiện.

---

### Level Senior 🔴

**Q31: Production service bị memory leak. Diagnose?**

**A:**
1. **Confirm**: RSS tăng liên tục, không giảm sau GC
2. **Heap profile**: `pprof heap` xem top allocations
3. **Goroutine profile**: goroutine leak là nguyên nhân phổ biến nhất
4. **Diff profiles**: `pprof -diff_base` ở 2 thời điểm xem cái gì tăng
5. **Inuse vs Alloc**: `inuse_space` tăng = leak

**Common Go memory leaks**: Goroutine leak (blocked channel, missing context cancel), slice header giữ large backing array, `time.After` trong loop, global map không eviction.

**Q32: Thiết kế testing strategy cho microservice mới?**

**A:** Testing pyramid:
- **Unit tests (70%)**: Table-driven, mock external deps, `t.Parallel`, `-race`
- **Integration tests (20%)**: Testcontainers, build tags, `TestMain` shared setup
- **Contract tests (5%)**: API schema compatibility
- **E2E tests (5%)**: Full deployment, critical user journeys only
- **CI pipeline**: Unit → Integration → Contract → E2E (each stage gates previous)

**Q33: Production profiling — khi nào, risks?**

**A:** Khi benchmark không reproduce production behavior, performance regression under load, need real allocation patterns. **Risks**: CPU profile 5% overhead (time-limit 30s), heap safe always-on, **pprof endpoint MUST be internal** (leaks source/secrets), block/mutex 10-30% overhead (never default-on).

---

**Quick Reference — Commands Cheat Sheet:**

```bash
# Testing
go test -race ./...                    # Race detection (CI must-have)
go test -coverprofile=c.out ./...      # Coverage
go test -short ./...                   # Skip slow tests
go test -tags=integration ./...        # Integration tests
go test -count=1 ./...                 # Disable cache

# Benchmarking
go test -bench=. -benchmem -count=5    # Benchmark + memory stats
benchstat old.txt new.txt              # Compare results

# Fuzzing
go test -fuzz=FuzzFunc -fuzztime=60s   # Run fuzzer

# Profiling
go tool pprof http://host:6060/debug/pprof/profile?seconds=30
go tool pprof http://host:6060/debug/pprof/heap

# Static Analysis
go vet ./...                           # Built-in (always run)
golangci-lint run ./...                # Meta-linter
```

---

## Interview Q&A Summary / Tổng hợp câu hỏi phỏng vấn

### Q: How do you write tests in Go? What makes a good Go test? / Viết test trong Go như thế nào? 🟢 Junior

**A:**

```go
// Standard Go test: file must end in _test.go, function starts with Test
// go test ./... runs all tests

// math/math.go
package math

func Add(a, b int) int { return a + b }

// math/math_test.go
package math

import "testing"

// Table-driven tests — idiomatic Go pattern
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive numbers", 2, 3, 5},
        {"negative numbers", -1, -2, -3},
        {"zero", 0, 5, 5},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Add(tt.a, tt.b)
            if got != tt.expected {
                t.Errorf("Add(%d, %d) = %d, want %d", tt.a, tt.b, got, tt.expected)
            }
        })
    }
}

// Subtests with t.Run — run specific: go test -run TestAdd/zero
```

**Test helpers and assertions:**
```go
// No built-in assert — use testify (most popular)
import "github.com/stretchr/testify/assert"
import "github.com/stretchr/testify/require"

func TestSomething(t *testing.T) {
    result, err := DoSomething()
    require.NoError(t, err)         // Fatal — stops test on failure
    assert.Equal(t, expected, result) // Non-fatal — continues test
}

// t.Helper() — marks function as test helper, better stack traces
func assertEqual(t *testing.T, expected, got int) {
    t.Helper()
    if expected != got {
        t.Errorf("expected %d, got %d", expected, got)
    }
}
```

**Điểm then chốt:** Table-driven tests là idiomatic Go. `t.Run()` cho subtests. `require` (fatal) vs `assert` (non-fatal) từ testify. Dùng `t.Helper()` trong test helpers để stack trace chính xác.

### Q: How do you mock dependencies in Go tests? / Mock dependencies trong Go như thế nào? 🟡 Mid

**A:**

```go
// Interface-based mocking — Go's primary mocking pattern

// Define interface (already good practice for DI)
type EmailService interface {
    SendEmail(to, subject, body string) error
}

// Production implementation
type SMTPEmailService struct { /* ... */ }
func (s *SMTPEmailService) SendEmail(to, subject, body string) error { /* ... */ }

// Mock for testing — manual
type MockEmailService struct {
    SentEmails []string
    ReturnErr  error
}
func (m *MockEmailService) SendEmail(to, subject, body string) error {
    m.SentEmails = append(m.SentEmails, to)
    return m.ReturnErr
}

// Test using mock
func TestUserRegistration(t *testing.T) {
    mockEmail := &MockEmailService{}
    svc := NewUserService(mockEmail) // inject mock

    err := svc.Register("user@example.com")

    assert.NoError(t, err)
    assert.Contains(t, mockEmail.SentEmails, "user@example.com")
}

// Generated mocks with mockery or gomock:
// go install github.com/vektra/mockery/v2@latest
// mockery --name EmailService --output ./mocks
```

**Testing HTTP handlers:**
```go
import "net/http/httptest"

func TestGetUserHandler(t *testing.T) {
    req := httptest.NewRequest("GET", "/users/123", nil)
    w := httptest.NewRecorder()

    handler := NewUserHandler(mockRepo)
    handler.GetUser(w, req)

    assert.Equal(t, http.StatusOK, w.Code)
    // parse w.Body for assertions
}
```

**Điểm quan trọng:** Go không có built-in mock framework như Java/Kotlin. Pattern chuẩn là interfaces + manual mocks hoặc generated mocks (mockery/gomock). Dependency injection qua interfaces là key — nếu dùng concrete types thay vì interfaces thì không mock được.

### Q: How do you profile Go applications? / Profile ứng dụng Go như thế nào? 🔴 Senior

**A:**

```go
// pprof — Go's built-in profiler

// 1. Add to HTTP server (for running services)
import _ "net/http/pprof"
// Automatically registers /debug/pprof/ endpoints

// 2. For CLI/batch programs
import "runtime/pprof"

func main() {
    // CPU profile
    f, _ := os.Create("cpu.prof")
    pprof.StartCPUProfile(f)
    defer pprof.StopCPUProfile()

    // ... your program ...

    // Memory profile
    memF, _ := os.Create("mem.prof")
    pprof.WriteHeapProfile(memF)
}

// 3. In benchmarks
func BenchmarkMyFunc(b *testing.B) {
    for i := 0; i < b.N; i++ {
        MyFunc()
    }
}
// go test -bench=. -cpuprofile=cpu.prof -memprofile=mem.prof
```

**Analyzing profiles:**
```bash
# Interactive analysis
go tool pprof cpu.prof
# (pprof) top10     — show top 10 functions by CPU time
# (pprof) web       — open flame graph in browser
# (pprof) list Func — show source with annotations

# Web UI (recommended)
go tool pprof -http=:8080 cpu.prof

# Live profiling from running service
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30
go tool pprof http://localhost:6060/debug/pprof/heap
```

**Profile types:**
```
CPU profile:   where program spends CPU time
Heap profile:  current memory allocations (who holds memory)
Alloc profile: all allocations over time (GC pressure)
Goroutine:     all goroutine stacks (detect leaks/deadlocks)
Block:         blocking on channels/mutexes (concurrency bottlenecks)
Mutex:         mutex contention
```

**Common findings and fixes:**
```
High GC pressure: too many small allocations → use sync.Pool, reuse buffers
String concat in loop: use strings.Builder (O(n) vs O(n²))
JSON marshal/unmarshal hot path: use jsoniter or sonic
Regex in hot path: compile once with regexp.MustCompile at package level
Interface conversion: avoid in hot path — use concrete types
```

**Điểm senior:** pprof là tool bắt buộc phải biết. Quy trình: benchmark first (measure baseline) → profile → identify bottleneck → optimize → benchmark again (verify improvement). Không optimize mà không có data từ profiler — "premature optimization is the root of all evil".

---

## Self-Check / Tự Kiểm Tra

- [ ] Can I write a table-driven test with `t.Run` subtests from memory?
- [ ] Can I explain why `go test -race` is essential for concurrent code?
- [ ] Can I mock a database dependency using only Go interfaces (no mockery/gomock)?
- [ ] Can I write a benchmark and read `ns/op`, `B/op`, `allocs/op` output?
- [ ] Can I use `go tool pprof` to identify the top CPU-consuming function?
- 💬 **Feynman Prompt:** Giải thích cách mock database trong Go cho một dev mới — tại sao dùng interface thay vì mock framework, và trade-off là gì?

## Connections / Liên Kết

- ⬅️ **Built on**: [Go Interfaces & Generics](./02-interfaces-generics.md) — mocking is just implementing an interface
- ⬅️ **Built on**: [Go Memory & GC](./04-memory-gc.md) — pprof profiles memory and GC behavior
- 🔗 **Applied in**: [API Design](../02-backend-knowledge/01-api-design.md) — `httptest` for testing HTTP handlers
