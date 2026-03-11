# Advanced Go Patterns — Mẫu nâng cao trong Go cho phỏng vấn Senior

> Backend Track — Go/DevOps
> Difficulty: `[Junior]` `[Mid]` `[Senior]`

---

## Learning Objectives

### 🟡 Q: What should you be able to explain after finishing this document? `[Mid]`
**A:** Sau tài liệu này, bạn nên có khả năng:

- Giải thích luồng sống của `context.Context` xuyên qua HTTP handler → service → repository.
- Thiết kế chiến lược xử lý lỗi theo tầng (transport, application, domain, infrastructure).
- Viết table-driven test rõ ràng, dễ maintain, tránh flaky test.
- Đọc benchmark result và tránh benchmark sai do compiler optimization.
- Dùng `pprof` để tìm bottleneck CPU, memory, goroutine.
- Quản lý Go modules trong team lớn, private modules, versioning và reproducible build.
- Tối ưu build cho CI/CD, giảm binary size, cross-compile cho nhiều môi trường.

Cross-reference:
- Concurrency nền tảng: [03-concurrency.md](./03-concurrency.md)
- Testing & profiling cơ bản: [05-testing-profiling.md](./05-testing-profiling.md)
- Memory/GC nền tảng: [04-memory-gc.md](./04-memory-gc.md)
- OS/network theory: [../../shared/01-cs-fundamentals/os-theory.md](../../shared/01-cs-fundamentals/os-theory.md), [../../shared/01-cs-fundamentals/networking-theory.md](../../shared/01-cs-fundamentals/networking-theory.md)

---

## 1) Context Propagation

### 🟡 Q: Why do Go services treat context propagation as a first-class design concern? `[Mid]`
**A:** Trong hệ thống backend thật, mỗi request đều có hạn mức thời gian (timeout), khả năng bị client cancel, và metadata để tracing. `context.Context` là cơ chế thống nhất để truyền những tín hiệu đó xuống tất cả layers.

Nếu bạn **không** propagate context:
- DB query có thể tiếp tục chạy dù client đã disconnect.
- Goroutine nền có thể leak vì không nhận được cancel signal.
- Tracing ID không đi xuyên qua downstream call.

Mẫu signature tiêu chuẩn:

```go
func (s *UserService) GetProfile(ctx context.Context, userID string) (*UserProfile, error)
```

Nguyên tắc: `ctx` luôn là tham số đầu tiên (trừ receiver), không lưu vào struct.

---

### 🟢 Q: What is the difference between context.Background() and context.TODO()? `[Junior]`
**A:**

- `context.Background()` dùng ở **top-level root** (main, test setup, CLI root command).
- `context.TODO()` dùng khi bạn **chưa biết** context phù hợp là gì (placeholder tạm thời trong quá trình refactor).

Ví dụ:

```go
func main() {
    // Root context chuẩn ở entrypoint.
    ctx := context.Background()
    if err := run(ctx); err != nil {
        log.Fatal(err)
    }
}

func legacyCall() error {
    // TODO chỉ nên tạm thời, không để lâu trong production path.
    return callRemote(context.TODO())
}
```

Best practice: tạo ticket để loại bỏ `TODO()` khỏi critical paths.

---

### 🟡 Q: How do WithCancel, WithTimeout, and WithDeadline differ semantically? `[Mid]`
**A:**

- `WithCancel(parent)`: cancel thủ công khi điều kiện nghiệp vụ xảy ra.
- `WithTimeout(parent, d)`: tự cancel sau duration `d`.
- `WithDeadline(parent, t)`: tự cancel tại thời điểm tuyệt đối `t`.

```go
func processOrder(ctx context.Context, orderID string) error {
    ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
    defer cancel()

    if err := validate(ctx, orderID); err != nil {
        return fmt.Errorf("validate failed: %w", err)
    }
    if err := reserveInventory(ctx, orderID); err != nil {
        return fmt.Errorf("reserve inventory failed: %w", err)
    }
    return nil
}
```

Khi nào dùng gì?
- Deadline có ý nghĩa khi bạn đã có SLA absolute từ upstream.
- Timeout dễ dùng hơn khi local operation có budget tương đối.

---

### 🔴 Q: What are production-safe cancellation propagation patterns? `[Senior]`
**A:** Pattern phổ biến trong service thực tế:

1. **HTTP request context as root**
   - `r.Context()` là root cho toàn bộ chuỗi call.
2. **Per-layer narrowing timeout**
   - Handler có 2s, DB call có 300ms, cache call có 50ms.
3. **Fan-out with errgroup + shared ctx**
   - Một nhánh fail thì cancel các nhánh còn lại.
4. **Background tasks detached explicitly**
   - Nếu cần task sống sau request, tạo root mới rõ ràng (không reuse `r.Context()`).

```go
func (h *Handler) Dashboard(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()

    g, gctx := errgroup.WithContext(ctx)

    var profile *Profile
    var stats *Stats

    g.Go(func() error {
        cctx, cancel := context.WithTimeout(gctx, 200*time.Millisecond)
        defer cancel()
        p, err := h.profileSvc.Get(cctx)
        if err != nil {
            return err
        }
        profile = p
        return nil
    })

    g.Go(func() error {
        cctx, cancel := context.WithTimeout(gctx, 120*time.Millisecond)
        defer cancel()
        s, err := h.statsSvc.Get(cctx)
        if err != nil {
            return err
        }
        stats = s
        return nil
    })

    if err := g.Wait(); err != nil {
        http.Error(w, err.Error(), http.StatusGatewayTimeout)
        return
    }

    _ = json.NewEncoder(w).Encode(map[string]any{
        "profile": profile,
        "stats":   stats,
    })
}
```

---

### 🔴 Q: Why is storing context in struct considered an anti-pattern? `[Senior]`
**A:** `Context` đại diện cho **request-scoped lifecycle**. Struct/service thường có lifecycle dài hơn request. Lưu `ctx` trong struct gây:

- Dùng nhầm context cũ/expired cho request mới.
- Data race nếu struct dùng concurrent.
- Khó reason về ownership và cancel path.

Sai:

```go
type UserService struct {
    ctx context.Context // anti-pattern
    db  *sql.DB
}
```

Đúng:

```go
type UserService struct {
    db *sql.DB
}

func (s *UserService) GetByID(ctx context.Context, id string) (*User, error) {
    // truyền ctx theo call chain
    row := s.db.QueryRowContext(ctx, "SELECT id, name FROM users WHERE id = ?", id)
    var u User
    if err := row.Scan(&u.ID, &u.Name); err != nil {
        return nil, err
    }
    return &u, nil
}
```

---

### 🟡 Q: Is context.WithValue suitable for optional function parameters? `[Mid]`
**A:** Không. `WithValue` chỉ nên dùng cho **request-scoped metadata cross-cutting** như trace ID, auth principal, request ID.

Không nên dùng để truyền business optional param (ví dụ `sortBy`, `pageSize`) vì:
- Mất type safety rõ ràng ở API.
- Khó discover qua function signature.
- Tăng coupling ngầm.

```go
type traceIDKey struct{}

func WithTraceID(ctx context.Context, traceID string) context.Context {
    return context.WithValue(ctx, traceIDKey{}, traceID)
}

func TraceIDFrom(ctx context.Context) (string, bool) {
    v, ok := ctx.Value(traceIDKey{}).(string)
    return v, ok
}
```

Rule: luôn dùng custom unexported key type để tránh key collision.

---

## 2) Advanced Error Handling

### 🟡 Q: What are sentinel errors and when are they useful? `[Mid]`
**A:** Sentinel error là biến lỗi predefined, dùng để biểu diễn một trạng thái đặc biệt ổn định, ví dụ:

- `io.EOF`
- `sql.ErrNoRows`
- `context.Canceled`
- `context.DeadlineExceeded`

Ưu điểm:
- Caller so sánh bằng `errors.Is` dễ dàng.
- Tạo contract rõ ràng giữa package producer/consumer.

```go
var ErrInsufficientBalance = errors.New("insufficient balance")

func Withdraw(balance, amount int64) error {
    if amount > balance {
        return ErrInsufficientBalance
    }
    return nil
}

func HandleWithdraw(err error) string {
    if errors.Is(err, ErrInsufficientBalance) {
        return "declined"
    }
    return "unknown"
}
```

---

### 🔴 Q: Why should you wrap errors with %w instead of %v? `[Senior]`
**A:** `%w` giữ chain để caller unwrap được bằng `errors.Is/As`. `%v` chỉ format string, mất semantic chain.

```go
func (r *Repo) GetUser(ctx context.Context, id int64) (*User, error) {
    row := r.db.QueryRowContext(ctx, "SELECT id, email FROM users WHERE id = ?", id)
    var u User
    if err := row.Scan(&u.ID, &u.Email); err != nil {
        return nil, fmt.Errorf("repo get user id=%d: %w", id, err)
    }
    return &u, nil
}
```

Ở layer handler:

```go
u, err := svc.GetUser(ctx, userID)
if err != nil {
    switch {
    case errors.Is(err, sql.ErrNoRows):
        http.Error(w, "not found", http.StatusNotFound)
    case errors.Is(err, context.DeadlineExceeded):
        http.Error(w, "timeout", http.StatusGatewayTimeout)
    default:
        http.Error(w, "internal error", http.StatusInternalServerError)
    }
    return
}
_ = json.NewEncoder(w).Encode(u)
```

---

### 🟡 Q: How do custom error types help in domain-rich services? `[Mid]`
**A:** Khi cần metadata có cấu trúc (entity, field, operation), custom error type giúp logging/metrics/decision ở tầng trên chính xác hơn string matching.

```go
type ValidationError struct {
    Field string
    Rule  string
    Msg   string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed field=%s rule=%s: %s", e.Field, e.Rule, e.Msg)
}

func validateEmail(email string) error {
    if !strings.Contains(email, "@") {
        return &ValidationError{
            Field: "email",
            Rule:  "contains_at",
            Msg:   "email must contain @",
        }
    }
    return nil
}
```

Dùng `errors.As` ở caller:

```go
var ve *ValidationError
if errors.As(err, &ve) {
    // map to 400, include field-level message
}
```

---

### 🔴 Q: Explain fail-fast and error-group patterns in concurrent workflows. `[Senior]`
**A:** Trong fan-out calls, pattern fail-fast giúp giảm lãng phí tài nguyên:

- Khởi chạy nhiều goroutine với `errgroup.WithContext`.
- Bất kỳ nhánh nào fail → cancel context chung.
- Các nhánh khác thoát sớm theo `ctx.Done()`.

```go
func fetchComposite(ctx context.Context, c Client) (*Composite, error) {
    g, ctx := errgroup.WithContext(ctx)

    var (
        user User
        cart Cart
        recs []Item
    )

    g.Go(func() error {
        u, err := c.GetUser(ctx)
        if err != nil {
            return fmt.Errorf("user: %w", err)
        }
        user = u
        return nil
    })

    g.Go(func() error {
        v, err := c.GetCart(ctx)
        if err != nil {
            return fmt.Errorf("cart: %w", err)
        }
        cart = v
        return nil
    })

    g.Go(func() error {
        v, err := c.GetRecommendations(ctx)
        if err != nil {
            return fmt.Errorf("recs: %w", err)
        }
        recs = v
        return nil
    })

    if err := g.Wait(); err != nil {
        return nil, err
    }

    return &Composite{User: user, Cart: cart, Recs: recs}, nil
}
```

---

### 🔴 Q: When should you panic, and when must you return error? `[Senior]`
**A:** Rule-of-thumb cho production backend:

Return `error` khi:
- Input/user/system failure có thể xảy ra ở runtime bình thường.
- Caller có thể quyết định retry/fallback/map status code.

`panic` chỉ dùng khi:
- Invariant nội bộ bị phá (programmer bug nghiêm trọng).
- Startup-time misconfiguration mà app không thể chạy đúng.

Ví dụ startup fail fast:

```go
func mustLoadConfig() Config {
    cfg, err := LoadConfig()
    if err != nil {
        panic(fmt.Sprintf("invalid config: %v", err))
    }
    return cfg
}
```

Nhưng trong request handler, không panic cho lỗi business. Nếu panic, cần recover middleware để tránh crash process.

Cross-reference: [02-backend-knowledge/01-api-design.md](../02-backend-knowledge/01-api-design.md)

---

## 3) Table-Driven Tests

### 🟡 Q: What is the canonical structure of a table-driven test? `[Mid]`
**A:** Pattern chuẩn:

1. Khai báo test case slice of struct.
2. Lặp từng case.
3. `t.Run(caseName, ...)` để isolate output.
4. Assert expected value/error.

```go
func TestNormalizeEmail(t *testing.T) {
    tests := []struct {
        name    string
        input   string
        want    string
        wantErr bool
    }{
        {name: "trim and lower", input: "  A@EXAMPLE.COM ", want: "a@example.com"},
        {name: "invalid no at", input: "abc", wantErr: true},
        {name: "empty", input: "", wantErr: true},
    }

    for _, tc := range tests {
        tc := tc
        t.Run(tc.name, func(t *testing.T) {
            got, err := NormalizeEmail(tc.input)
            if tc.wantErr {
                if err == nil {
                    t.Fatalf("expected error, got nil")
                }
                return
            }
            if err != nil {
                t.Fatalf("unexpected error: %v", err)
            }
            if got != tc.want {
                t.Fatalf("got %q, want %q", got, tc.want)
            }
        })
    }
}
```

---

### 🟡 Q: Why use t.Run subtests instead of one flat loop? `[Mid]`
**A:** `t.Run` cho phép:
- Selective run: `go test -run TestNormalizeEmail/empty`
- Better report granularity.
- Subtest-level setup/cleanup và parallel hóa.

```go
t.Run("invalid no at", func(t *testing.T) {
    _, err := NormalizeEmail("abc")
    if err == nil {
        t.Fatal("expected error")
    }
})
```

---

### 🟢 Q: What is t.Helper and how should helpers be organized? `[Junior]`
**A:** Helper giúp giảm duplicate assert/setup code. Mọi helper assertion nên gọi `t.Helper()` để stack trace trỏ đúng nơi test fail.

```go
func mustNoErr(t *testing.T, err error) {
    t.Helper()
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
}

func assertStatus(t *testing.T, got, want int) {
    t.Helper()
    if got != want {
        t.Fatalf("status=%d want=%d", got, want)
    }
}
```

---

### 🔴 Q: How to use t.Parallel safely in table-driven tests? `[Senior]`
**A:** Chỉ parallel khi test cases độc lập hoàn toàn:

- Không share mutable global state.
- Không reuse fixed network port/file path.
- Không depend vào execution order.

```go
func TestSlugify(t *testing.T) {
    tests := []struct {
        name  string
        input string
        want  string
    }{
        {"simple", "Go Lang", "go-lang"},
        {"spaces", "A  B", "a-b"},
        {"unicode", "Điện toán", "dien-toan"},
    }

    for _, tc := range tests {
        tc := tc
        t.Run(tc.name, func(t *testing.T) {
            t.Parallel()
            got := Slugify(tc.input)
            if got != tc.want {
                t.Fatalf("got=%s want=%s", got, tc.want)
            }
        })
    }
}
```

---

### 🟡 Q: How do fixtures and cleanup with t.Cleanup improve test reliability? `[Mid]`
**A:** Fixture setup rõ ràng + cleanup chuẩn giúp tránh state leak giữa test cases.

```go
func setupTempSQLite(t *testing.T) *sql.DB {
    t.Helper()

    dir := t.TempDir()
    dsn := filepath.Join(dir, "test.db")

    db, err := sql.Open("sqlite3", dsn)
    if err != nil {
        t.Fatalf("open sqlite: %v", err)
    }

    if _, err := db.Exec(`CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT)`); err != nil {
        t.Fatalf("create schema: %v", err)
    }

    t.Cleanup(func() { _ = db.Close() })
    return db
}
```

Pattern này đặc biệt hữu ích cho integration tests.

---

## 4) Benchmark Testing

### 🟡 Q: What is the required format of a Go benchmark function? `[Mid]`
**A:** Format chuẩn:

```go
func BenchmarkXxx(b *testing.B) {
    // setup
    for i := 0; i < b.N; i++ {
        // code under benchmark
    }
}
```

`b.N` được framework tự động tăng để đạt thống kê ổn định.

---

### 🟡 Q: When should you use b.ResetTimer and b.ReportAllocs? `[Mid]`
**A:**

- `b.ResetTimer()` sau setup nặng, để loại setup cost khỏi measure.
- `b.ReportAllocs()` để hiển thị alloc/op và bytes/op.

```go
func BenchmarkParseJWT(b *testing.B) {
    token := buildSignedToken()

    b.ReportAllocs()
    b.ResetTimer()

    for i := 0; i < b.N; i++ {
        _, err := ParseJWT(token)
        if err != nil {
            b.Fatalf("parse jwt: %v", err)
        }
    }
}
```

---

### 🔴 Q: How do you prevent compiler optimizations from invalidating benchmark results? `[Senior]`
**A:** Nếu kết quả không dùng tới, compiler có thể dead-code eliminate làm benchmark “ảo nhanh”.

Kỹ thuật chống tối ưu hóa sai:

1. Gán output vào package-level sink variable.
2. Dùng realistic input.
3. Tránh constant-folding dễ đoán.

```go
var sink string

func BenchmarkHashEmail(b *testing.B) {
    email := "candidate@example.com"
    b.ReportAllocs()

    for i := 0; i < b.N; i++ {
        sink = HashEmail(email)
    }
}
```

---

### 🔴 Q: How do you compare before/after benchmark changes correctly? `[Senior]`
**A:** Không so 1 lần chạy. Dùng nhiều mẫu + `benchstat`:

```bash
go test -run=^$ -bench=BenchmarkParseJWT -benchmem -count=10 ./... > old.txt
# apply optimization

go test -run=^$ -bench=BenchmarkParseJWT -benchmem -count=10 ./... > new.txt
benchstat old.txt new.txt
```

`benchstat` cho p-value và delta %, giúp quyết định thay đổi có ý nghĩa thống kê không.

---

### 🟡 Q: How should you read benchmark output quickly in interviews? `[Mid]`
**A:** Ví dụ output:

```text
BenchmarkParseJWT-8    500000    2350 ns/op    512 B/op    6 allocs/op
```

Đọc nhanh:
- `-8`: số logical CPUs benchmark runner dùng.
- `ns/op`: latency trung bình mỗi operation.
- `B/op`: bytes cấp phát mỗi operation.
- `allocs/op`: số lần allocation.

Backend performance thường tối ưu alloc/op trước vì giảm pressure cho GC (cross-ref: [04-memory-gc.md](./04-memory-gc.md)).

---

## 5) pprof Profiling

### 🔴 Q: What profiles matter most in Go backend performance debugging? `[Senior]`
**A:** 4 profile chính:

1. **CPU profile**: function nào ăn CPU nhất.
2. **Heap profile**: object sống trong heap tại thời điểm snapshot.
3. **Allocs profile**: tổng allocation volume theo thời gian.
4. **Goroutine profile**: stack traces của goroutine đang tồn tại.

---

### 🔴 Q: How do you expose pprof safely in services? `[Senior]`
**A:** Dùng `net/http/pprof` trên admin port nội bộ, không public Internet.

```go
func startDebugServer() {
    mux := http.NewServeMux()
    mux.HandleFunc("/debug/pprof/", pprof.Index)
    mux.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
    mux.HandleFunc("/debug/pprof/profile", pprof.Profile)
    mux.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
    mux.HandleFunc("/debug/pprof/trace", pprof.Trace)

    srv := &http.Server{
        Addr:              "127.0.0.1:6060",
        Handler:           mux,
        ReadHeaderTimeout: 2 * time.Second,
    }

    go func() {
        if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
            log.Printf("debug server error: %v", err)
        }
    }()
}
```

Khuyến nghị bảo mật:
- Bind localhost hoặc private subnet.
- Bọc qua mTLS/VPN/IAP.
- Không expose pprof endpoint trên public ingress.

---

### 🔴 Q: Show a practical CPU profiling workflow end-to-end. `[Senior]`
**A:**

1. Tạo tải ổn định (wrk/vegeta/k6).
2. Thu profile 30-60s:

```bash
go tool pprof http://127.0.0.1:6060/debug/pprof/profile?seconds=30
```

3. Trong shell pprof:

```text
(pprof) top
(pprof) top -cum
(pprof) list expensiveFunc
(pprof) web
```

4. Xác định hot path (JSON encode, regex, map growth, lock contention...)
5. Tối ưu nhỏ, rerun benchmark/profile, so sánh lại.

---

### 🔴 Q: How do heap and allocs profiles answer different questions? `[Senior]`
**A:**

- `heap`: “đang giữ gì trong memory bây giờ?”
- `allocs`: “đã cấp phát nhiều nhất ở đâu theo thời gian?”

Ví dụ:
- Heap cao ở cache map ⇒ xem eviction policy.
- Allocs cao ở string concat/path parse ⇒ tối ưu buffer pooling.

```bash
go tool pprof http://127.0.0.1:6060/debug/pprof/heap
go tool pprof http://127.0.0.1:6060/debug/pprof/allocs
```

---

### 🔴 Q: What common performance issues do flame graphs usually reveal? `[Senior]`
**A:** Những vấn đề gặp nhiều:

- Excessive `encoding/json` reflection cost.
- String formatting (`fmt.Sprintf`) trong hot loop.
- High lock contention (`sync.Mutex`).
- Small object churn gây GC pressure.
- Excessive goroutines blocked on channel/network IO.

Fix patterns:
- Preallocate slices/maps.
- Reuse buffers (`sync.Pool`) cẩn thận.
- Reduce lock granularity, sharding.
- Batch I/O.
- Cache parsed templates/regex.

---

## 6) Go Module Management

### 🟡 Q: What are go.mod and go.sum responsibilities? `[Mid]`
**A:**

- `go.mod`: khai báo module path, Go version, dependency requirements, replace/exclude directives.
- `go.sum`: checksum lock file để đảm bảo integrity/reproducibility khi tải module.

Ví dụ:

```go
module github.com/acme/order-service

go 1.23

require (
    github.com/gin-gonic/gin v1.10.0
    go.uber.org/zap v1.27.0
)
```

Không nên xóa `go.sum` tùy tiện trong team CI/CD.

---

### 🟡 Q: How does semantic versioning map to Go modules? `[Mid]`
**A:**

- `vMAJOR.MINOR.PATCH`
- PATCH: fix bug, backward-compatible.
- MINOR: feature mới backward-compatible.
- MAJOR: breaking change.

Với Go module, từ v2 trở lên cần suffix trong module path:

```go
module github.com/acme/payment-sdk/v2
```

Import cũng cần `/v2`.

---

### 🔴 Q: What are practical dependency update strategies in large services? `[Senior]`
**A:**

1. Cập nhật định kỳ theo batch nhỏ.
2. Ưu tiên security patch CVE trước.
3. Chạy full test + smoke benchmark trước merge.
4. Theo dõi binary size/startup regression sau update.

Command thường dùng:

```bash
go get -u ./...
go mod tidy
go list -m -u all
```

Tránh update all dependencies trong một PR quá lớn.

---

### 🟡 Q: When should you vendor dependencies? `[Mid]`
**A:** `go mod vendor` hữu ích khi:
- Environment bị giới hạn Internet.
- Cần reproducible build nghiêm ngặt theo policy công ty.
- Build trong regulated environment.

Trade-off:
- Repo lớn hơn.
- Phải đồng bộ vendor khi update deps.

---

### 🔴 Q: How do private modules work in enterprise environments? `[Senior]`
**A:** Cấu hình chính:

```bash
go env -w GOPRIVATE=github.com/acme/*
go env -w GONOSUMDB=github.com/acme/*
```

Kèm theo auth:
- SSH deploy key hoặc token cho Git host.
- CI secret management chuẩn.

Lưu ý: thiết kế module boundary rõ để tránh circular dependency giữa internal modules.

---

## 7) Build Optimization

### 🔴 Q: What are build tags and when are they useful? `[Senior]`
**A:** Build tags cho phép compile condition theo môi trường/feature.

```go
//go:build linux
// +build linux

package epoll
```

Use cases:
- OS-specific implementation.
- Enable/disable experimental feature.
- Separate integration test helpers.

Cross-ref concurrency & OS: [../02-backend-knowledge/05-os-go.md](../02-backend-knowledge/05-os-go.md)

---

### 🔴 Q: Why do many teams set CGO_ENABLED=0 for production binaries? `[Senior]`
**A:** `CGO_ENABLED=0` tạo static-ish binary dễ deploy, ít phụ thuộc libc/system packages.

Ưu điểm:
- Image nhỏ hơn (distroless/scratch dễ hơn).
- Giảm runtime dependency mismatch.

Trade-off:
- Một số package cần cgo (ví dụ một số DB drivers/native libs).

```bash
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o bin/app ./cmd/app
```

---

### 🔴 Q: How do you cross-compile Go binaries for multiple targets? `[Senior]`
**A:**

```bash
GOOS=linux   GOARCH=amd64 go build -o dist/app-linux-amd64 ./cmd/app
GOOS=linux   GOARCH=arm64 go build -o dist/app-linux-arm64 ./cmd/app
GOOS=darwin  GOARCH=arm64 go build -o dist/app-darwin-arm64 ./cmd/app
GOOS=windows GOARCH=amd64 go build -o dist/app-windows-amd64.exe ./cmd/app
```

Nếu có cgo thì cross compile phức tạp hơn do cần cross C toolchain.

---

### 🔴 Q: How can you reduce binary size in CI artifacts? `[Senior]`
**A:** Kỹ thuật phổ biến:

```bash
go build -trimpath -ldflags="-s -w" -o bin/app ./cmd/app
```

- `-trimpath`: bỏ local path info, build reproducibility tốt hơn.
- `-s -w`: strip symbol + debug info.

Có thể thêm upx trong vài môi trường, nhưng cân nhắc startup/security/tooling compatibility.

---

### 🟡 Q: How does build cache improve developer and CI speed? `[Mid]`
**A:** Go cache object theo content hash của source + flags + env.

Tips:
- Giữ module cache giữa CI runs.
- Tránh invalidate toàn bộ cache không cần thiết.
- Tách steps `go mod download`, `go build`, `go test` hợp lý trong pipeline.

Cross-reference CI/CD: [../06-devops-infrastructure.md](../06-devops-infrastructure.md)

---

## 8) Interview Q&A (Focused Round)

### 🟡 Q1: In a request chain, where should timeout be defined first? `[Mid]`
**A:** Timeout tổng nên define ở entrypoint (HTTP/gRPC handler) theo SLA request. Các call xuống dưới nên “cắt nhỏ budget” chứ không tự ý tăng timeout. Nếu tầng dưới đặt timeout lớn hơn upstream thì vô nghĩa vì upstream đã cancel trước.

---

### 🔴 Q2: A downstream returns `context deadline exceeded` intermittently. What should you inspect first? `[Senior]`
**A:** Kiểm tra theo thứ tự:

1. Deadline budget còn lại tại thời điểm gọi downstream.
2. Queueing/wait time trước khi thực sự call.
3. Connection pool saturation (DB/HTTP).
4. Retry policy có nhân timeout tổng hay không.
5. P99 latency downstream gần đây.

Thường lỗi nằm ở budget propagation và retry không bounded.

---

### 🟡 Q3: Why is `errors.Is(err, sql.ErrNoRows)` preferred over `err == sql.ErrNoRows`? `[Mid]`
**A:** Vì `err` có thể đã được wrap nhiều lớp. `errors.Is` đi qua chain unwrap để match đúng sentinel. So sánh trực tiếp `==` fail khi có wrapping.

---

### 🔴 Q4: How would you map domain errors to HTTP status cleanly? `[Senior]`
**A:** Dùng centralized error mapper ở transport layer:

```go
func mapErr(err error) (int, string) {
    switch {
    case errors.Is(err, ErrUnauthorized):
        return http.StatusUnauthorized, "unauthorized"
    case errors.Is(err, ErrForbidden):
        return http.StatusForbidden, "forbidden"
    case errors.Is(err, ErrNotFound):
        return http.StatusNotFound, "not found"
    case errors.Is(err, ErrConflict):
        return http.StatusConflict, "conflict"
    case errors.Is(err, context.DeadlineExceeded):
        return http.StatusGatewayTimeout, "timeout"
    default:
        return http.StatusInternalServerError, "internal"
    }
}
```

Tránh scattering mapping logic ở từng handler.

---

### 🟡 Q5: What makes a table-driven test maintainable over years? `[Mid]`
**A:**
- Case name mô tả hành vi.
- One assertion intent per test block.
- Shared helpers có `t.Helper()`.
- Fixture setup tách rõ (không hidden magic).
- Flaky external dependency được cô lập bằng fake/testcontainer.

---

### 🔴 Q6: Should all benchmarks run in CI on every PR? `[Senior]`
**A:** Không nhất thiết. Benchmark nhiễu cao trên shared runner. Chiến lược hợp lý:

- Smoke benchmark nhỏ mỗi PR cho regression lớn.
- Full benchmark suite theo schedule hoặc nhãn PR đặc biệt.
- Dùng dedicated runner ổn định CPU nếu cần quyết định performance-sensitive.

---

### 🟡 Q7: What is a quick signal that GC pressure is hurting latency? `[Mid]`
**A:** `allocs/op` cao trong benchmark + pprof allocs hot trong path request + metrics GC pause/pacing tăng theo traffic. Tối ưu object churn thường cải thiện tail latency rõ rệt.

---

### 🔴 Q8: How to investigate goroutine leak in production? `[Senior]`
**A:**

1. Thu goroutine profile nhiều thời điểm.
2. So sánh count tăng dần theo thời gian tải.
3. Xem stack signatures lặp lại (blocked receive/send, net/http readLoop...).
4. Kiểm tra missing cancel, unclosed channels, no timeout I/O.
5. Viết regression test leak detection nếu có thể.

---

### 🟢 Q9: Why does Go require `/v2` suffix in module path for major v2+? `[Junior]`
**A:** Để giải quyết version selection rõ ràng và cho phép v1/v2 cùng tồn tại trong dependency graph mà không ambiguity import path.

---

### 🟡 Q10: When should you choose `replace` directive in go.mod? `[Mid]`
**A:** Dùng tạm thời cho local development, fork hotfix, hoặc migration ngắn hạn. Không lạm dụng lâu dài trong main branch vì dễ tạo drift giữa môi trường dev và CI.

---

### 🔴 Q11: Can `-ldflags="-s -w"` affect debugging in incidents? `[Senior]`
**A:** Có. Binary strip symbols khó debug thấp tầng hơn. Team nên có chiến lược artifact song song: bản production tối ưu + bản debug symbol cho incident forensics (bảo mật lưu trữ phù hợp).

---

### 🟡 Q12: Why should you keep context keys unexported types? `[Mid]`
**A:** Tránh collision giữa packages. Nếu dùng string key public, package khác có thể vô tình đụng key giống nhau và gây bug khó truy vết.

---

### 🔴 Q13: What is the danger of retrying on all errors in fan-out calls? `[Senior]`
**A:** Amplification + cascading failure. Retry vô điều kiện khi downstream quá tải sẽ làm tệ hơn. Cần retry có điều kiện (idempotent, transient errors), exponential backoff + jitter, và bounded by context deadline.

Cross-ref distributed systems: [../02-backend-knowledge/03-distributed-systems.md](../02-backend-knowledge/03-distributed-systems.md)

---

### 🔴 Q14: In code review, what red flags indicate weak error design? `[Senior]`
**A:**
- `if err != nil { return err }` xuyên suốt mà không thêm context.
- Dùng string compare để phân loại lỗi.
- Panic trong request path.
- Log error nhiều tầng gây duplicate noisy logs.
- Không phân biệt expected errors (4xx) và unexpected errors (5xx).

---

## 9) Scenario Drills (Senior Mock)

### 🔴 Q: Your API p99 increased from 120ms to 480ms after adding a JSON enrichment step. How do you diagnose? `[Senior]`
**A:** Quy trình nhanh:

1. Chạy benchmark focused vào enrichment function.
2. Thu CPU + allocs profiles dưới tải tương đương production.
3. Xem flame graph có hotspot ở `encoding/json`, `mapassign`, `fmt.Sprintf` hay không.
4. Kiểm tra payload size growth và additional network calls.
5. Compare before/after bằng `benchstat`.

Checklist fix:
- Dùng struct typed thay vì `map[string]any` ở hot path.
- Tránh marshal/unmarshal nhiều lần trong cùng request.
- Cache phần dữ liệu ít đổi.

---

### 🔴 Q: A batch worker occasionally hangs forever. What context strategy prevents this? `[Senior]`
**A:** Mỗi unit work phải có timeout riêng và có chain cancel rõ:

```go
func runWorker(ctx context.Context, jobs <-chan Job) error {
    for {
        select {
        case <-ctx.Done():
            return ctx.Err()
        case job, ok := <-jobs:
            if !ok {
                return nil
            }

            jobCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
            err := processJob(jobCtx, job)
            cancel()

            if err != nil {
                // record + continue / dead-letter
            }
        }
    }
}
```

Không dùng `context.Background()` bên trong loop vì sẽ cắt mất cancellation chain.

---

### 🔴 Q: How do you enforce error contracts across packages? `[Senior]`
**A:**

- Domain package export sentinel/custom errors giới hạn.
- Service layer wrap có ngữ cảnh nhưng không đổi semantic.
- Transport layer map chuẩn hóa.
- Unit tests verify `errors.Is/As` contract thay vì match string.

```go
func TestCreateUser_EmailConflict(t *testing.T) {
    err := svc.CreateUser(context.Background(), "a@example.com")
    if !errors.Is(err, ErrEmailConflict) {
        t.Fatalf("want ErrEmailConflict, got %v", err)
    }
}
```

---

### 🔴 Q: A benchmark improved 40% locally but regressed in production. Why can this happen? `[Senior]`
**A:** Có thể do:

- Benchmark input không đại diện traffic thật.
- Không đo contention/concurrency.
- CPU architecture runner khác production.
- Bottleneck thật nằm ở I/O/downstream chứ không phải function được benchmark.
- GC behavior khác do heap size/live-set production.

Kết luận: benchmark là tín hiệu cục bộ; luôn validate end-to-end bằng load test + observability.

---

## 10) Practice Appendix — Rapid-Fire Q&A

### 🟢 Q: What error should be returned when context is canceled? `[Junior]`
**A:** Trả `ctx.Err()` để caller phân biệt `context.Canceled` và `context.DeadlineExceeded`.

### 🟢 Q: Should a library function create its own background context? `[Junior]`
**A:** Không. Library nên nhận context từ caller để giữ cancellation chain.

### 🟡 Q: Why avoid broad `defer` in tight benchmark loops? `[Mid]`
**A:** `defer` trong loop tạo overhead và làm sai mục tiêu đo nếu production path không dùng tương tự.

### 🟡 Q: What does `go mod tidy` do? `[Mid]`
**A:** Xóa dependency không dùng, thêm dependency thiếu, đồng bộ `go.mod`/`go.sum` theo imports hiện tại.

### 🔴 Q: Should custom error types always be pointers? `[Senior]`
**A:** Không bắt buộc, nhưng thường dùng pointer để tránh copy lớn và hỗ trợ nil semantics rõ hơn; cần nhất quán để `errors.As` predictable.

### 🟡 Q: Why is `context.Value` discouraged for logger instance passing? `[Mid]`
**A:** Logger instance thường là dependency cấu hình ứng dụng, không phải request metadata. Inject qua struct/constructor rõ ràng hơn.

### 🔴 Q: How to avoid over-wrapping errors? `[Senior]`
**A:** Chỉ wrap tại boundary quan trọng (I/O call, layer transition). Tránh wrap mọi dòng khiến chain dài/noise và log khó đọc.

### 🟡 Q: What is a good timeout budget split for handler with 2 downstream calls? `[Mid]`
**A:** Không có số cố định, nhưng thường chừa headroom cho marshalling/network jitter; ví dụ total 500ms, mỗi call 150ms, còn lại cho orchestration + response encoding.

### 🔴 Q: Is panic+recover a valid control flow for expected errors? `[Senior]`
**A:** Không. Đây là anti-pattern; dùng error return. panic/recover cho exceptional invariant break.

### 🟢 Q: Why use `-run=^$` when running only benchmarks? `[Junior]`
**A:** Để skip unit tests, chỉ chạy benchmark (`go test -run=^$ -bench=.`).

### 🟡 Q: Can pprof be used in short-lived CLI tools? `[Mid]`
**A:** Có, bằng `runtime/pprof` ghi file profile thay vì HTTP endpoint.

### 🔴 Q: How do you profile mutex contention? `[Senior]`
**A:** Bật mutex profile (`runtime.SetMutexProfileFraction`) và phân tích với pprof để tìm vùng lock contention.

### 🟡 Q: What is a safe default for HTTP client timeout? `[Mid]`
**A:** Thiết lập timeout rõ ràng theo SLA use-case; không dùng client mặc định không timeout trong production.

### 🔴 Q: Why might `errors.Is` fail unexpectedly with custom wrappers? `[Senior]`
**A:** Nếu wrapper không implement `Unwrap()` đúng cách, chain bị đứt nên `errors.Is/As` không đi qua được.

### 🟡 Q: Should benchmark data be randomized each iteration? `[Mid]`
**A:** Tùy mục tiêu; random mỗi iteration có thể đo thêm cost randomization. Thường chuẩn bị dataset trước, benchmark operation chính.

### 🔴 Q: What does “cancellation-safe function” mean? `[Senior]`
**A:** Function luôn check/propagate context đúng, không block vô hạn khi canceled, và cleanup resource khi thoát sớm.

---

## 11) Cross-Reference Map

- Go fundamentals: [01-language-fundamentals.md](./01-language-fundamentals.md)
- Interfaces & generics: [02-interfaces-generics.md](./02-interfaces-generics.md)
- Concurrency deep dive: [03-concurrency.md](./03-concurrency.md)
- Memory & GC: [04-memory-gc.md](./04-memory-gc.md)
- Testing & profiling foundations: [05-testing-profiling.md](./05-testing-profiling.md)
- API design patterns: [../02-backend-knowledge/01-api-design.md](../02-backend-knowledge/01-api-design.md)
- Distributed systems reliability: [../02-backend-knowledge/03-distributed-systems.md](../02-backend-knowledge/03-distributed-systems.md)
- Shared system design theory: [../../shared/02-system-design/system-design-theory.md](../../shared/02-system-design/system-design-theory.md)

---

## 12) Final Interview Checklist

### 🟡 Q: What should you verbalize in a senior Go interview when discussing advanced patterns? `[Mid]`
**A:** Hãy nói theo khung:

1. **Contract**: context + error semantics rõ ràng.
2. **Correctness**: cancellation, retries, error mapping đúng.
3. **Observability**: benchmark + profiling + metrics.
4. **Operability**: build/release/module strategy cho team.
5. **Trade-offs**: performance vs readability vs maintainability.

Nếu trình bày được “pattern + pitfall + production guardrail + code example” thì interviewer sẽ đánh giá bạn ở mức senior-ready.
