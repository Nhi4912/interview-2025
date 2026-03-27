# Advanced Go Patterns — Mẫu nâng cao trong Go cho phỏng vấn Senior

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Backend Track — Go/DevOps
> Difficulty: `[Junior]` `[Mid]` `[Senior]`

---

## Real-World Scenario / Tình Huống Thực Tế

**Zalo backend refactor (thực tế):** Service có `NewUserService(db, cache, emailer, smsProvider, logger, metrics, config)` — 7 dependencies, mỗi lần thêm feature phải thay đổi constructor signature ở 15 nơi. Refactor sang Functional Options pattern: `NewUserService(db, opts...)` với `WithCache(cache)`, `WithLogger(logger)` — optional dependencies không breaking, có defaults an toàn. Tương tự, Pipeline pattern (middleware chain) thay thế nested if/else trong request processing.

**Bài học:** Advanced Go patterns không phải "fancy code" — chúng giải quyết vấn đề maintainability thực tế: API stability, testability, và separation of concerns.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Advanced patterns giống công thức nấu ăn của đầu bếp chuyên nghiệp: không nhất thiết phức tạp hơn, nhưng giải quyết được vấn đề mà người mới gặp khó khăn (flavor balance, texture, timing). Functional Options giống việc đầu bếp có "seasoning kit" — dùng cái nào tùy dish, không bắt buộc mọi thứ.

**Why it matters:** Senior Go developers được nhận ra qua việc họ dùng patterns này một cách tự nhiên — không phải vì "biết thuật ngữ" mà vì đã gặp vấn đề mà pattern giải quyết.

---

## Concept Map / Bản Đồ Khái Niệm

```
ADVANCED GO PATTERNS
├── Context Propagation ─────── timeout/cancel/tracing xuyên layers
│   ├── WithCancel / WithTimeout / WithDeadline
│   └── context.Value (metadata only, not config)
├── Error Handling ──────────── sentinel → wrap → custom type → errgroup
│   ├── %w wrapping + errors.Is/As
│   └── fail-fast vs error-group patterns
├── Testing Excellence ──────── table-driven + benchmark + fuzz
│   ├── t.Run subtests → parallel safe
│   └── compiler optimization traps
├── Profiling (pprof) ──────── CPU/heap/allocs/goroutine/mutex
│   └── flame graph → identify bottleneck
├── Module Management ──────── go.mod/sum + semver + private modules
│   └── vendor vs proxy + dependency strategy
├── Build Optimization ──────── CGO_ENABLED=0 + ldflags + cross-compile
│   └── build tags + cache strategy
└── Design Patterns ─────────── Functional Options + Middleware + DI
    ├── Worker Pool + backpressure
    └── Graceful Shutdown sequence
```

---

## Overview / Tổng Quan

File này cover **7 nhóm patterns nâng cao** mà Senior Go developer cần master. Không phải "fancy code" — mỗi pattern giải quyết production pain point cụ thể.

| #   | Concept                     | Vai trò                                             | Interview Weight |
| --- | --------------------------- | --------------------------------------------------- | ---------------- |
| 1   | **Context Propagation**     | Timeout/cancel/tracing xuyên request chain          | ⭐⭐⭐⭐⭐       |
| 2   | **Advanced Error Handling** | Sentinel → wrap → custom type → errgroup            | ⭐⭐⭐⭐⭐       |
| 3   | **Testing & Benchmarking**  | Table-driven tests, benchmark safety, t.Parallel    | ⭐⭐⭐⭐         |
| 4   | **pprof Profiling**         | CPU/heap/goroutine profiling workflow               | ⭐⭐⭐⭐         |
| 5   | **Module & Build**          | go.mod semver, private modules, binary optimization | ⭐⭐⭐           |
| 6   | **Design Patterns**         | Functional Options, Middleware chain, DI            | ⭐⭐⭐⭐⭐       |
| 7   | **Production Patterns**     | Worker Pool, Graceful Shutdown, backpressure        | ⭐⭐⭐⭐⭐       |

**Mối quan hệ:** Context Propagation là backbone (mọi pattern khác dùng ctx) → Error Handling là contract layer → Testing/Profiling validate correctness & performance → Module/Build là delivery layer → Design Patterns + Production Patterns là synthesis của tất cả.

---

## Core Concepts — Deep Knowledge / Kiến Thức Chuyên Sâu

### Concept 1: Context Propagation

**🧠 Memory Hook:** "Context = passport của request — timeout là visa hết hạn, cancel là hủy chuyến bay, values là stamp metadata. Mất passport = request vô chủ, chạy mãi không dừng"

**Why exists (2 levels):**

- Level 1: HTTP request có deadline — nếu downstream service lag, cần cancel tất cả goroutines spawned từ request đó. Không có context = goroutine leak
- Level 2: Context tree propagation — `WithTimeout` tạo child context, child cancel không ảnh hưởng parent nhưng parent cancel kills all children. Đây là hierarchical cancellation
- Level 3: `context.Value` là metadata transport (tracing ID, auth token) — KHÔNG dùng cho config/dependency injection vì type-unsafe và implicit

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                | Tại sao sai                                                                              | Đúng là                                                                           |
| -------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Lưu context vào struct                 | Context phải pass explicitly — struct store tạo lifetime mismatch và implicit dependency | Pass context như first parameter của mọi function                                 |
| Dùng `context.TODO()` rồi quên replace | Production code chạy không timeout → goroutine leak, hung requests                       | `context.TODO()` chỉ là placeholder — replace ngay với proper context có deadline |
| `context.Value` cho business logic     | Hidden dependency, type-unsafe, untestable                                               | `context.Value` chỉ cho request-scoped metadata (trace ID, auth token)            |

**Interview Pattern:** "How do you propagate timeout across microservices?" → Describe context chain: HTTP handler → service → DB/gRPC calls

**Knowledge Chain:** Context basics → Cancellation propagation → Timeout budget splitting → Distributed tracing integration

### Concept 2: Advanced Error Handling

**🧠 Memory Hook:** "Error handling trong Go = hệ thống bưu điện — sentinel error là mã zip (check nhanh), %w wrap là phong bì lồng nhau (unwrap để xem gốc), custom type là registered mail (carries metadata)"

**Why exists (2 levels):**

- Level 1: Go không có exceptions — errors are values, phải handle explicitly. `if err != nil` là pattern bắt buộc, không phải boilerplate
- Level 2: Error wrapping (%w) tạo chain — `errors.Is` traverse chain tìm sentinel, `errors.As` extract custom type. Không wrap đúng = chain đứt, caller không phân biệt được error type
- Level 3: Error domain mapping — transport layer returns HTTP status, domain layer returns business errors, infra layer returns wrapped DB/network errors. Clean boundaries = testable

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                                           | Đúng là                                                                     |
| ------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Dùng `%v` thay vì `%w` khi wrap error | Loses error chain — `errors.Is` và `errors.As` fails                  | Dùng `%w`: `fmt.Errorf("op: %w", err)` để preserve chain                    |
| Over-wrapping errors                  | Mỗi layer wrap thêm 1 lần tạo "matryoshka" error chain không đọc được | Wrap một lần ở layer boundary; không wrap lại trong internal calls          |
| Panic for expected errors             | Panic unwinds stack và crash service — expected errors là normal flow | Panic chỉ cho truly unrecoverable (nil dereference, initialization failure) |

**Interview Pattern:** "How do you map domain errors to HTTP status?" → Show custom error type with code/message + middleware maps to status

**Knowledge Chain:** Sentinel errors → Error wrapping → Custom error types → errgroup patterns → Domain error mapping

### Concept 3: Testing & Benchmarking

**🧠 Memory Hook:** "Table-driven test = spreadsheet kiểm tra — mỗi row là 1 scenario, thêm row = thêm test case không cần code mới. Benchmark = đồng hồ bấm giờ cho code — nhưng cẩn thận compiler tối ưu 'cheat' kết quả"

**Why exists (2 levels):**

- Level 1: Table-driven tests leverage Go's `t.Run` cho subtests — mỗi case chạy independently, fail không block others, parallel safe
- Level 2: Benchmark phải dùng `b.ResetTimer` (exclude setup), `b.ReportAllocs` (track allocations), và `var sink` pattern (prevent compiler optimization eliminating code)
- Level 3: `t.Parallel` trong table-driven tests cần capture loop variable — Go 1.22 fixed this nhưng older versions: `tc := tc` pattern required

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                               | Đúng là                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Benchmark quên prevent compiler optimization | Compiler eliminates unused result → kết quả 0ns (hoàn toàn sai)           | Dùng `var sink` pattern để capture result và prevent elimination |
| `t.Parallel` + shared fixture                | Multiple goroutines modify shared state → race condition, flaky tests     | Mỗi parallel test cần own copy của test data                     |
| Không dùng `t.Cleanup`                       | Test leaves state (temp files, DB records) → next test fails mysteriously | Dùng `t.Cleanup(func() { /* cleanup */ })` cho mọi test resource |

**Interview Pattern:** "Write a table-driven test for X" → Show struct slice with name/input/expected, t.Run loop, parallel-safe

**Knowledge Chain:** Unit test → Table-driven → Subtests → Parallel → Benchmark → Fuzz → Integration

### Concept 4: pprof Profiling

**🧠 Memory Hook:** "pprof = X-ray cho Go program — CPU profile thấy function nào 'ăn' CPU, heap profile thấy ai 'ăn' memory, goroutine profile thấy ai đang 'ngủ' (blocked)"

**Why exists (2 levels):**

- Level 1: Production performance issues cần data, không phải guessing — pprof cho CPU, memory, goroutine, mutex profiles
- Level 2: CPU profiling = sampling based (mỗi 10ms capture stack). Heap profile phân biệt allocs (tổng allocated) vs inuse (current live). Flame graph visualize hotspots
- Level 3: Production exposure: `net/http/pprof` trên internal port, không public. Continuous profiling (Google Cloud Profiler, Pyroscope) cho always-on monitoring

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                          | Tại sao sai                                                                      | Đúng là                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Expose pprof trên public port    | Heap dump chứa sensitive data (tokens, passwords) → security risk                | Chỉ expose pprof trên internal/admin port, never public                 |
| Nhầm allocs vs inuse             | allocs = tổng GC pressure (cumulative); inuse = current live objects — khác nhau | Debug leak: dùng inuse. Debug GC pressure: dùng allocs                  |
| Profile trên development machine | Different workload, CPU architecture, NUMA topology → kết quả misleading         | Profile với production-like workload, ideally dùng continuous profiling |

**Interview Pattern:** "How do you diagnose memory leak?" → pprof heap inuse profile, compare 2 snapshots, find growing objects

**Knowledge Chain:** Benchmark → pprof CPU → pprof heap → Flame graph → Continuous profiling → Production debugging

### Concept 5: Module & Build Management

**🧠 Memory Hook:** "go.mod = recipe book (declare ingredients), go.sum = receipt (verify exact versions bought). Build tags = kitchen labels (which recipe for which occasion)"

**Why exists (2 levels):**

- Level 1: Reproducible builds — go.sum ensures exact same dependency versions across machines. Semantic versioning (v1.2.3) communicates breaking changes
- Level 2: Private modules need GOPRIVATE/GONOSUMDB config. Vendor directory for air-gapped CI. `replace` directive for local development of multi-module repos
- Level 3: CGO_ENABLED=0 cho static binary (scratch Docker image). `-ldflags="-s -w"` strip debug info (~30% smaller). Build tags gate platform-specific or feature-gated code

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                     | Tại sao sai                                                            | Đúng là                                                                 |
| ------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Quên chạy `go mod tidy` trước commit        | Stale go.sum → CI fails với checksum mismatch                          | Chạy `go mod tidy` như bước bắt buộc trước commit                       |
| Major version bump mà không thêm `/v2` path | Go module resolution dựa trên path — thiếu `/v2` gây import conflict   | v2+ modules phải có `/v2` suffix trong module path                      |
| `-ldflags="-s -w"` trong production build   | Strip debug symbols → không có full stack trace khi incident debugging | Giữ debug symbols trong production; strip chỉ trong release/ship builds |

**Interview Pattern:** "How do you manage private dependencies?" → GOPRIVATE + GONOSUMDB + vendor for CI

**Knowledge Chain:** go.mod basics → Semver contract → Private modules → Vendor strategy → Build optimization → Docker multi-stage

### Concept 6: Design Patterns (Functional Options, Middleware, DI)

**🧠 Memory Hook:** "Functional Options = menu order (chọn topping tùy ý, default pizza vẫn ngon). Middleware = security checkpoints at airport (mỗi checkpoint check 1 thứ, order matters). DI = plug-and-play (swap implementation không đổi wiring)"

**Why exists (2 levels):**

- Level 1: Functional Options giải quyết constructor với 7+ optional params — backward compatible, có defaults. Middleware chain cho cross-cutting concerns (logging, auth, rate-limit). DI qua interfaces cho testability
- Level 2: Options pattern: `type Option func(*config)` + `WithX` helpers. Middleware: `func(next http.Handler) http.Handler`. DI: constructor injection > framework (explicit > magic)
- Level 3: google/wire (compile-time codegen) vs uber/fx (runtime reflection DI). wire safer nhưng less flexible. fx power nhưng runtime errors

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                    | Tại sao sai                                                                    | Đúng là                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Middleware quên gọi `next.ServeHTTP`       | Request silently dropped — no response sent, client hangs                      | Always call `next.ServeHTTP(w, r)` trong middleware                              |
| Dùng DI container (fx) cho simple app      | Overhead không đáng — fx dùng reflection, runtime errors, steep learning curve | Manual constructor injection đủ cho hầu hết apps; dùng fx khi complexity đòi hỏi |
| Options pattern không có sensible defaults | User phải set every option — không có "zero value is useful" principle         | Options pattern phải work với zero options (defaults đủ dùng ngay)               |

**Interview Pattern:** "Design an HTTP service with middleware" → Show Functional Options constructor + middleware chain + handler

**Knowledge Chain:** Constructor patterns → Functional Options → Middleware chain → DI manual → DI frameworks → Clean Architecture

### Concept 7: Production Patterns (Worker Pool, Graceful Shutdown)

**🧠 Memory Hook:** "Worker Pool = assembly line (N workers, 1 conveyor belt/channel, backpressure khi belt full). Graceful Shutdown = evacuation drill (stop accepting, finish current, cleanup, exit)"

**Why exists (2 levels):**

- Level 1: Unbounded goroutine spawning = resource exhaustion. Worker Pool bounds concurrency. Graceful Shutdown prevents data loss on deployment
- Level 2: Worker Pool: buffered channel for backpressure, `context.Done()` for shutdown, `sync.WaitGroup` for drain. Pool size: `NumCPU()` for CPU-bound, 4-10x for I/O-bound
- Level 3: Graceful Shutdown sequence: SIGTERM → stop accept → drain in-flight → cancel bg workers → flush metrics → exit. K8s: preStop hook sleep 5-10s for LB drain

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                              | Tại sao sai                                                                  | Đúng là                                                            |
| ------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Worker Pool: không close channel     | Workers range over channel forever → goroutine leak, memory không freed      | Close job channel sau khi gửi hết jobs để workers exit cleanly     |
| Graceful Shutdown không có timeout   | Một hung request (DB lock, slow client) block entire shutdown forever        | Luôn set timeout cho shutdown: `server.Shutdown(ctx)` với deadline |
| Background goroutines ignore context | Continue after main exits → resource leak, unexpected behavior trong K8s pod | Mọi long-running goroutine phải respect `ctx.Done()` signal        |

**Interview Pattern:** "Design a worker pool with graceful shutdown" → Show channel + workers + WaitGroup + context cancel + SIGTERM handler

**Knowledge Chain:** Goroutines → Channel patterns → Worker Pool → errgroup → Graceful Shutdown → K8s lifecycle

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

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: What is the Functional Options pattern and why is it preferred over config structs or many parameters? / Functional Options pattern là gì và tại sao nó được ưa chuộng hơn config struct hoặc nhiều tham số? 🟡 Mid

**A:** Functional Options is a pattern where a constructor accepts variadic `Option` functions that mutate a private config struct. Each option is a closure returned by a named helper (`WithTimeout`, `WithRetries`, etc.).

Vietnamese explanation: Pattern này giải quyết bài toán constructor có nhiều tham số optional. So với plain config struct, Functional Options cho phép thêm option mới mà không break existing callers (backward compatible). So với builder pattern, nó gọn hơn vì không cần method chaining và không có trạng thái trung gian có thể dùng chưa xong. Trade-off: harder to discover available options nếu không có good documentation — dùng `godoc` và sensible defaults để bù đắp.

---

### Q: How do you implement a middleware chain in Go HTTP handlers, and what are the pitfalls? / Làm thế nào để triển khai middleware chain trong Go HTTP và những pitfall cần tránh là gì? 🟡 Mid

**A:** A middleware wraps `http.Handler`: `func Middleware(next http.Handler) http.Handler`. Chaining is done by composing wrappers: `auth(logging(rateLimit(mux)))`. Order matters — outermost runs first on request, last on response.

Vietnamese explanation: Pitfalls phổ biến: (1) **không gọi `next.ServeHTTP`** khiến request bị dừng — thường xảy ra khi return sớm mà quên; (2) **chia sẻ mutable state** giữa requests trong middleware closure gây race condition; (3) **ghi vào `http.ResponseWriter` sau khi đã ghi** — dùng `ResponseRecorder` pattern để intercept status code. Ngoài ra, middleware nên propagate context đúng cách thay vì đọc/ghi header trực tiếp để đảm bảo tracing hoạt động.

---

### Q: Explain dependency injection in Go without a framework. How does it differ from using a DI container? / Giải thích dependency injection trong Go không dùng framework. Khác gì so với DI container? 🟡 Mid

**A:** In Go, DI is manual: dependencies are passed as interface parameters to constructors. `NewUserService(db DB, cache Cache, logger Logger) *UserService`. The `wire` tool (or `fx`) auto-generates the wiring code from provider functions.

Vietnamese explanation: Go idiom ưa chuộng **constructor injection** vì nó explicit — bạn đọc code thấy ngay dependency là gì. DI container (như Java Spring) dùng reflection để resolve dependency tự động, tiện nhưng ẩn đi relationship giữa components và khó debug hơn. Trong Go, `google/wire` là code generation (không runtime reflection), còn `uber/fx` là runtime DI container dùng reflection. Trade-off: `wire` an toàn hơn, compile-time error; `fx` linh hoạt hơn nhưng lỗi chỉ thấy lúc runtime.

---

### Q: Design a worker pool in Go. How do you handle backpressure and avoid goroutine leaks? / Thiết kế worker pool trong Go. Làm thế nào xử lý backpressure và tránh goroutine leak? 🔴 Senior

**A:** Core structure: a buffered job channel + N goroutines reading from it. Backpressure is handled by the channel buffer — when full, `Send` blocks the caller (or use a `select` with a `default` to drop/reject). Shutdown: close the job channel or use a `context.Context` with cancel.

Vietnamese explanation: Goroutine leak xảy ra khi: (1) job channel không bao giờ đóng, worker goroutine block mãi; (2) context cancel không được check trong worker loop. Pattern đúng: `for { select { case job, ok := <-jobs: if !ok { return }; case <-ctx.Done(): return } }`. Về sizing pool: số worker thường bằng `runtime.NumCPU()` cho CPU-bound tasks, nhưng với I/O-bound tasks có thể gấp 4–10 lần vì goroutines block waiting for I/O. Dùng `sync.WaitGroup` để đảm bảo tất cả workers đã xử lý xong trước khi graceful shutdown hoàn tất.

---

### Q: Walk through a production-grade graceful shutdown sequence for a Go HTTP server. What can go wrong? / Mô tả quy trình graceful shutdown production cho Go HTTP server. Những gì có thể sai? 🔴 Senior

**A:** Steps: (1) catch `SIGTERM`/`SIGINT` via `signal.NotifyContext`; (2) call `server.Shutdown(ctx)` with a deadline (e.g. 30s); (3) stop accepting new connections, wait for in-flight requests; (4) cancel background workers via context; (5) flush metrics/logs; (6) exit with code 0.

Vietnamese explanation: Những điều thường sai: (1) **không set timeout** cho `Shutdown` — nếu một request hung, server không bao giờ thoát; (2) **background goroutines không nghe context** — chúng tiếp tục chạy sau khi main goroutine exit, gây resource leak trong Kubernetes pod chưa terminate hẳn; (3) **database connections không được drain** — transactions bị rollback mà không có retry ở client; (4) **load balancer chưa kịp drain** trước khi Kubernetes gửi SIGTERM — cần `preStop` hook sleep 5–10s. Kết hợp tốt: `signal.NotifyContext` + `errgroup` + `sync.WaitGroup` cho tất cả background workers.

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                                           | Difficulty | Core Concept        | Key Signal                                                |
| --- | -------------------------------------------------- | ---------- | ------------------- | --------------------------------------------------------- |
| Q1  | Context propagation as first-class design concern? | 🟡         | Context             | Giải thích timeout/cancel/tracing chain                   |
| Q2  | Background() vs TODO() difference?                 | 🟢         | Context             | Root vs placeholder, know when to use each                |
| Q3  | WithCancel vs WithTimeout vs WithDeadline?         | 🟡         | Context             | Semantic difference, parent-child relationship            |
| Q4  | Production-safe cancellation propagation?          | 🔴         | Context             | Hierarchical cancel, cleanup on early return              |
| Q5  | Why storing context in struct is anti-pattern?     | 🔴         | Context             | Lifetime mismatch, implicit dependency                    |
| Q6  | context.WithValue for optional params?             | 🟡         | Context             | Type-unsafe, hidden dependency, use sparingly             |
| Q7  | Sentinel errors and when useful?                   | 🟡         | Error Handling      | errors.Is traversal, well-known error constants           |
| Q8  | Why wrap errors with %w instead of %v?             | 🔴         | Error Handling      | Error chain preservation, unwrap capability               |
| Q9  | Custom error types for domain services?            | 🟡         | Error Handling      | errors.As, typed metadata, HTTP mapping                   |
| Q10 | Fail-fast and errgroup patterns?                   | 🔴         | Error Handling      | errgroup cancel on first failure, WaitGroup alternative   |
| Q11 | When to panic vs return error?                     | 🔴         | Error Handling      | Truly unrecoverable only, init failures                   |
| Q12 | Table-driven test canonical structure?             | 🟡         | Testing             | Struct slice + t.Run + name/input/expected                |
| Q13 | Why t.Run subtests over flat loop?                 | 🟡         | Testing             | Parallel, -run filter, independent failure                |
| Q14 | t.Helper and helper organization?                  | 🟢         | Testing             | Error points to caller, not helper                        |
| Q15 | t.Parallel safely in table-driven?                 | 🔴         | Testing             | Capture loop var, no shared mutable state                 |
| Q16 | Fixtures and t.Cleanup?                            | 🟡         | Testing             | LIFO cleanup, no leftover state                           |
| Q17 | Benchmark function format?                         | 🟡         | Benchmark           | b.N loop, b.ResetTimer, b.ReportAllocs                    |
| Q18 | b.ResetTimer and b.ReportAllocs?                   | 🟡         | Benchmark           | Exclude setup, track allocations                          |
| Q19 | Prevent compiler invalidating benchmarks?          | 🔴         | Benchmark           | var sink pattern, BenchmarkResult                         |
| Q20 | Compare before/after benchmarks (benchstat)?       | 🔴         | Benchmark           | Statistical comparison, avoid false conclusions           |
| Q21 | Read benchmark output quickly?                     | 🟡         | Benchmark           | ns/op, B/op, allocs/op interpretation                     |
| Q22 | What pprof profiles matter most?                   | 🔴         | Profiling           | CPU, heap (inuse vs allocs), goroutine, mutex             |
| Q23 | Expose pprof safely in services?                   | 🔴         | Profiling           | Internal port, not public, auth gate                      |
| Q24 | CPU profiling workflow end-to-end?                 | 🔴         | Profiling           | Capture → analyze → flame graph → optimize                |
| Q25 | Heap vs allocs profiles?                           | 🔴         | Profiling           | inuse = current footprint, allocs = GC pressure           |
| Q26 | Flame graph common patterns?                       | 🔴         | Profiling           | Wide bars = hot functions, tall stacks = deep calls       |
| Q27 | go.mod and go.sum responsibilities?                | 🟡         | Modules             | Declaration vs verification, reproducible builds          |
| Q28 | Semver mapping to Go modules?                      | 🟡         | Modules             | /v2 path for major, minor backward compat                 |
| Q29 | Dependency update strategies?                      | 🔴         | Modules             | go get -u, Renovate/Dependabot, vendor                    |
| Q30 | When to vendor dependencies?                       | 🟡         | Modules             | Air-gapped CI, reproducibility guarantee                  |
| Q31 | Private modules in enterprise?                     | 🔴         | Modules             | GOPRIVATE, GONOSUMDB, GOPROXY config                      |
| Q32 | Build tags when useful?                            | 🔴         | Build               | Platform-specific, feature gating, test/debug             |
| Q33 | CGO_ENABLED=0 for production?                      | 🔴         | Build               | Static binary, scratch Docker, no libc dependency         |
| Q34 | Cross-compile Go binaries?                         | 🔴         | Build               | GOOS/GOARCH, CI matrix, Docker multi-platform             |
| Q35 | Reduce binary size in CI?                          | 🔴         | Build               | -ldflags="-s -w", UPX, strip debug                        |
| Q36 | Build cache for CI speed?                          | 🟡         | Build               | GOCACHE persistence, layer caching in Docker              |
| Q37 | Timeout definition in request chain?               | 🟡         | Interview Round     | Budget splitting: handler > service > DB                  |
| Q38 | Context deadline exceeded diagnosis?               | 🔴         | Interview Round     | Check timeout chain, downstream latency, queue            |
| Q39 | errors.Is vs == for error comparison?              | 🟡         | Interview Round     | Chain traversal, wrapped error compatibility              |
| Q40 | Domain errors to HTTP status mapping?              | 🔴         | Interview Round     | Middleware switch on error type, clean boundaries         |
| Q41 | Table-driven test maintainability?                 | 🟡         | Interview Round     | Descriptive names, minimal setup per case                 |
| Q42 | Benchmarks in CI on every PR?                      | 🔴         | Interview Round     | Noise concern, benchstat threshold, dedicated runner      |
| Q43 | GC pressure signal for latency?                    | 🟡         | Interview Round     | GOGC, GOMEMLIMIT, pprof allocs profile                    |
| Q44 | Goroutine leak investigation?                      | 🔴         | Interview Round     | pprof goroutine profile, count growth                     |
| Q45 | Go /v2 suffix requirement?                         | 🟢         | Interview Round     | Import path uniqueness, semver contract                   |
| Q46 | replace directive in go.mod?                       | 🟡         | Interview Round     | Local development, fork override, multi-module            |
| Q47 | -ldflags="-s -w" affect debugging?                 | 🔴         | Interview Round     | No symbol table, harder incident debugging                |
| Q48 | Context keys unexported types?                     | 🟡         | Interview Round     | Prevent collision, package-scoped keys                    |
| Q49 | Retry danger in fan-out calls?                     | 🔴         | Interview Round     | Amplification, thundering herd, exponential backoff       |
| Q50 | Error design red flags in review?                  | 🔴         | Interview Round     | String matching, no wrap, panic for expected              |
| Q51 | P99 increase diagnosis?                            | 🔴         | Scenario            | pprof diff, trace span analysis, GC check                 |
| Q52 | Batch worker hangs forever fix?                    | 🔴         | Scenario            | Context with timeout, select on ctx.Done                  |
| Q53 | Error contracts across packages?                   | 🔴         | Scenario            | Exported sentinel/types, interface assertion              |
| Q54 | Benchmark improved locally, regressed prod?        | 🔴         | Scenario            | CPU differences, workload differences, contention         |
| Q55 | Error when context canceled?                       | 🟢         | Rapid-Fire          | context.Canceled                                          |
| Q56 | Library creating own background context?           | 🟢         | Rapid-Fire          | No — accept ctx param from caller                         |
| Q57 | Avoid broad defer in benchmark loops?              | 🟡         | Rapid-Fire          | Defer overhead per iteration                              |
| Q58 | go mod tidy does what?                             | 🟡         | Rapid-Fire          | Add missing, remove unused dependencies                   |
| Q59 | Custom error types always pointers?                | 🔴         | Rapid-Fire          | Usually yes for errors.As, interface satisfaction         |
| Q60 | context.Value for logger passing?                  | 🟡         | Rapid-Fire          | Discouraged — use explicit param or middleware            |
| Q61 | Over-wrapping errors?                              | 🔴         | Rapid-Fire          | Each layer adds noise, wrap at boundary only              |
| Q62 | Timeout budget split for 2 downstream?             | 🟡         | Rapid-Fire          | handler_timeout > sum(downstream) + buffer                |
| Q63 | Panic+recover for expected errors?                 | 🔴         | Rapid-Fire          | No — return error, panic only for unrecoverable           |
| Q64 | -run=^$ for benchmarks only?                       | 🟢         | Rapid-Fire          | Skip unit tests, run only bench                           |
| Q65 | pprof in short-lived CLI?                          | 🟡         | Rapid-Fire          | runtime/pprof to file                                     |
| Q66 | Profile mutex contention?                          | 🔴         | Rapid-Fire          | SetMutexProfileFraction + pprof                           |
| Q67 | Safe HTTP client timeout default?                  | 🟡         | Rapid-Fire          | Set explicit per SLA, never use default 0                 |
| Q68 | errors.Is fail with custom wrappers?               | 🔴         | Rapid-Fire          | Missing Unwrap() method breaks chain                      |
| Q69 | Benchmark data randomized?                         | 🟡         | Rapid-Fire          | Pre-generate dataset, benchmark operation only            |
| Q70 | Cancellation-safe function meaning?                | 🔴         | Rapid-Fire          | Check ctx, no infinite block, cleanup on cancel           |
| Q71 | Senior interview verbalization framework?          | 🟡         | Final Checklist     | Contract→Correctness→Observability→Operability→Trade-offs |
| Q72 | Functional Options pattern?                        | 🟡         | Design Patterns     | Variadic Option func, backward compat, defaults           |
| Q73 | Middleware chain implementation?                   | 🟡         | Design Patterns     | Wrapping http.Handler, order matters, next.ServeHTTP      |
| Q74 | DI without framework in Go?                        | 🟡         | Design Patterns     | Constructor injection, wire vs fx trade-off               |
| Q75 | Worker Pool with backpressure?                     | 🔴         | Production Patterns | Buffered channel, context cancel, WaitGroup drain         |
| Q76 | Graceful shutdown sequence?                        | 🔴         | Production Patterns | SIGTERM→stop accept→drain→cancel bg→flush→exit            |

**Distribution:** 🟢 6 | 🟡 30 | 🔴 40 — **Total: 76 Q&As**

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Bất Chợt

> **Interviewer:** "Your Go service has occasional request timeouts but the downstream services report normal latency. Where do you look?"

**30-second answer:**
"First check context timeout budget — if handler sets 5s but has 3 sequential downstream calls at 2s each, the total 6s > 5s budget causes timeout before last call completes. Second, check for goroutine leaks eating resources — pprof goroutine profile shows count trend. Third, check GC pressure — GOGC too low causes frequent pauses that add latency."

**Follow-up:** "How would you implement proper timeout budget splitting?"
→ "Parent context sets overall deadline (e.g., 5s). Each downstream call gets derived context with proportional timeout: `context.WithTimeout(ctx, 1500ms)` per call. Reserve 500ms buffer for local processing. Key: child timeouts must sum to less than parent deadline."

---

## Self-Check / Tự Kiểm Tra

> **Hướng dẫn:** Đóng tài liệu lại. Trả lời từng câu bằng cách viết ra giấy hoặc nói thành tiếng. Sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                    |
| --- | -------------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Functional Options pattern: 3 thành phần chính? So sánh với config struct approach.                        |
| 2   | 🎨 Visual      | Vẽ middleware chain: Handler → Logger → Auth → RateLimit → Handler. Request flow và response flow.         |
| 3   | 🛠️ Application | Implement graceful shutdown cho HTTP server: context signal, drain connections, timeout.                   |
| 4   | 🐛 Debug       | Service restart mất 30s (connection drain timeout) — nhưng clients vẫn bị error. Root cause? Fix?          |
| 5   | 🎓 Teach       | Giải thích cho team: tại sao Dependency Injection trong Go dùng interface thay vì DI framework như Spring? |

### Key Points (tự kiểm tra)

| #   | Đáp án nhanh                                                                                                                                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `type Option func(*Config)`, `func WithX(v T) Option`, `func New(opts ...Option)`. Config struct: less flexible, requires zero-value handling. |
| 2   | Request: outer→inner. Response: inner→outer (like stack). Each middleware wraps next handler.                                                  |
| 3   | `signal.NotifyContext(ctx, syscall.SIGTERM)` → `server.Shutdown(ctx)` → `wg.Wait()` for background tasks → `os.Exit(0)`.                       |
| 4   | LB health check still routing traffic during drain. Fix: fail health check first → wait → then drain → shutdown.                               |
| 5   | Go interfaces are implicit — no registration needed. Small interfaces (1-2 methods) → easy to mock. No reflection magic = explicit, testable.  |

💬 **Feynman Prompt:** Giải thích cho product manager: tại sao "graceful shutdown" quan trọng cho user experience? Chuyện gì xảy ra nếu server tắt đột ngột khi user đang checkout?

### 📅 Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | Ngày   | Focus                                                                       | Phương pháp                      |
| ----- | ------ | --------------------------------------------------------------------------- | -------------------------------- |
| 1     | Day 1  | Đọc toàn bộ, focus Core Concepts 7 blocks                                   | Đọc + vẽ Concept Map từ memory   |
| 2     | Day 3  | Self-check 7 câu + implement Functional Options pattern từ memory           | Code trên whiteboard             |
| 3     | Day 7  | Cold call + implement Worker Pool với graceful shutdown                     | Timed 30-min coding exercise     |
| 4     | Day 14 | Full mock: context budget design + error handling strategy cho microservice | System design discussion format  |
| 5     | Day 30 | Review Interview Q&A Summary + scenario drills (P99, goroutine leak)        | Senior mock interview simulation |

---

## Connections / Liên Kết

**Same Track:**

- ⬅️ **Built on**: [Interfaces & Generics](./02-interfaces-generics.md) — patterns leverage interfaces heavily
- ⬅️ **Built on**: [Concurrency](./03-concurrency.md) — errgroup, Worker Pool, channel patterns
- ⬅️ **Built on**: [Memory & GC](./04-memory-gc.md) — pprof, GC tuning, memory optimization
- ⬅️ **Built on**: [Testing & Profiling](./05-testing-profiling.md) — benchmark, test foundations
- 🔗 **Fundamentals**: [Language Fundamentals](./01-language-fundamentals.md) — type system, structs, pointers

**Cross-Track:**

- 🔗 **API Design**: [API Design](../02-backend-knowledge/01-api-design.md) — error mapping, middleware patterns
- 🔗 **Microservices**: [Microservices](../02-backend-knowledge/02-microservices.md) — patterns in service implementations
- 🔗 **Distributed Systems**: [Distributed Systems](../02-backend-knowledge/03-distributed-systems.md) — timeout, retry, circuit breaker
- 🔗 **System Design**: [System Design Theory](../../shared/02-system-design/system-design-theory.md) — architecture applying these patterns
