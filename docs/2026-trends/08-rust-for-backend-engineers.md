> **Track**: Backend / Systems | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prereq**: Go or TypeScript backend experience, basic concurrency
> **Back to**: [Table of Contents](../00-table-of-contents.md) · [2026 Trends Index](./README.md)

# 08 — Rust for Backend Engineers (transitioning from Go/TS)

> **🧠 Memory Hook**: **OBE** = **O**wnership (no GC), **B**orrow checker (compile-time race-free), **E**rror as value (`Result<T,E>`, no exceptions). If you understand OBE, 70% of Rust pain disappears.

> **🇻🇳 Tóm tắt 1 câu**: Rust = Go's concurrency safety + C++'s zero-cost abstractions, trade off learning cost cao trong 2-3 tuần đầu để đổi lấy zero null/zero data race/zero hidden allocation suốt vòng đời service.

---

## 🌍 Real-World Scenario — Discord switching read states from Go to Rust (2020 → still in production 2025)

Discord's "read states" service tracks which messages each user has read across billions of channels. Original Go implementation hit a wall:

| Metric                  | Go version (2019)         | Rust rewrite (2020+)  |
| ----------------------- | ------------------------- | --------------------- |
| P99 latency             | 300ms+ spikes every 2 min | <20ms, no spikes      |
| Memory                  | Constant 5GB, GC pauses   | 1.5GB, no GC pauses   |
| CPU                     | 70% baseline              | 20% baseline          |
| Tail latency root cause | Go GC stop-the-world      | None — Rust has no GC |

**The killer insight**: Discord's engineers said the bottleneck wasn't algorithmic — it was **Go's garbage collector forcing tail latency floors**. No amount of tuning `GOGC` fixed it. Rust's ownership model means memory is freed deterministically when values go out of scope. No GC, no STW pauses, **predictable tail latency**.

**Bài học (VN)**: Đừng chuyển sang Rust vì hype. Chuyển khi bạn có **bài toán cụ thể mà GC, runtime overhead, hoặc memory safety bugs đang cản trở** (latency-sensitive, embedded, security-critical, hoặc systems programming). Với 95% CRUD APIs, Go/TS vẫn là lựa chọn đúng vì **time-to-market quan trọng hơn nanoseconds**.

Other 2024-2025 production rewrites worth knowing:

- **Cloudflare Pingora** (Nginx → Rust): 70% less CPU, 67% less memory, no buffer overflow CVEs
- **Figma multiplayer server**: Rust + Tokio, handles 1M concurrent edit sessions
- **1Password backend services**: Rust for crypto-critical paths (one codebase, audited once)
- **Astral (uv, ruff)**: Python tooling rewritten in Rust → 10-100x faster

---

## 📚 Part A — Theory (Core Concepts)

### Concept A1: Ownership & Borrowing — the brain transplant

#### Layer 1 — Simple analogy

Go/TS memory: bạn có một thư viện chung (heap), GC là **bác bảo vệ** đi tuần và dọn sách không ai mượn nữa. Đôi khi bác phải đóng cửa thư viện 50ms để dọn → đó là GC pause.

Rust ownership: mỗi cuốn sách có **chính xác 1 chủ sở hữu** tại 1 thời điểm. Khi chủ ra khỏi phòng (scope), sách tự động bị hủy. Bạn có thể **cho mượn** (`&` borrow) nhưng:

- Cho nhiều người đọc cùng lúc (`&T` immutable borrow) ✅
- Hoặc 1 người duy nhất viết (`&mut T` mutable borrow) ✅
- **Không bao giờ cả hai cùng lúc** ❌ → đây là cách Rust loại bỏ data race tại compile time

Không cần bác bảo vệ → không có GC pause.

#### Layer 2 — How it works

```
┌──────────────────────────────────────────────────────────┐
│  Ownership rules (compile-time enforced)                 │
│                                                           │
│  1. Each value has ONE owner                              │
│  2. When owner goes out of scope → value dropped (free)   │
│  3. You can have:                                         │
│     - Many immutable references: &T &T &T  ✅             │
│     - OR exactly one mutable reference: &mut T  ✅        │
│     - But NEVER both at the same time  ❌                 │
└──────────────────────────────────────────────────────────┘

Example:
  let s = String::from("hello");  // s owns the heap allocation
  let r1 = &s;                    // immutable borrow (OK)
  let r2 = &s;                    // another immutable borrow (OK)
  // let r3 = &mut s;             // ❌ COMPILE ERROR: cannot borrow as mutable
                                  //    while immutable borrows exist
  println!("{} {}", r1, r2);
}  // s dropped here → memory freed deterministically
```

**Comparison with Go**:

```go
// Go: GC tracks references, frees when no one points
func process() {
    s := make([]byte, 1<<20)  // 1MB allocation
    go background(s)          // shared with goroutine
    // s "freed" by GC sometime later, after goroutine releases
}
```

```rust
// Rust: explicit transfer or borrow
fn process() {
    let s = vec![0u8; 1 << 20];  // 1MB allocation
    background(s);               // ownership MOVED to background
    // s no longer accessible here — compile error if you try
}  // memory freed inside background() when its scope ends
```

#### Layer 3 — Edge cases

- **Move vs Copy**: Primitive types (`i32`, `bool`, `f64`) implement `Copy` → assignment copies bits. Non-Copy types (`String`, `Vec`) **move** → original variable becomes inaccessible. This trips up Go devs constantly.
- **Cloning**: When you genuinely need 2 owners, `.clone()` deep-copies. Rust forces you to acknowledge the cost (vs Go's implicit copy of structs).
- **Lifetimes (`'a`)**: When a function returns a reference, Rust needs to know "this reference lives at least as long as X". 90% of cases use elided lifetimes (compiler infers). The other 10% — explicit annotations — is what breaks beginners.
- **Interior mutability**: `RefCell<T>` (single-thread runtime borrow check) and `Mutex<T>` (multi-thread) let you mutate through `&T` when needed. Use sparingly — they shift checks from compile time to runtime.

---

### Concept A2: `Result<T, E>` and `?` — errors as values, no exceptions

#### Layer 1 — Simple analogy

TS/JS: hàm có thể `throw`, bạn dùng `try/catch`. Vấn đề: type system không bắt buộc bạn phải catch → bug ẩn ai cũng từng gặp.

Go: hàm trả `(value, error)`, bạn phải check `if err != nil` mỗi lần → verbose nhưng explicit.

Rust: hàm trả `Result<T, E>`, là **enum chỉ có 2 nhánh**: `Ok(T)` hoặc `Err(E)`. Compiler **bắt bạn xử lý cả 2 nhánh** (nếu không sẽ warning/error). Toán tử `?` rút gọn việc "nếu Err thì return Err sớm".

#### Layer 2 — How it works

```rust
use std::fs;
use std::io;

// Without ?:
fn read_config_verbose(path: &str) -> Result<String, io::Error> {
    let content = match fs::read_to_string(path) {
        Ok(c) => c,
        Err(e) => return Err(e),
    };
    Ok(content)
}

// With ?:
fn read_config(path: &str) -> Result<String, io::Error> {
    let content = fs::read_to_string(path)?;  // ? propagates Err automatically
    Ok(content)
}

// Chaining with multiple error types — use thiserror crate:
use thiserror::Error;

#[derive(Error, Debug)]
enum AppError {
    #[error("io error: {0}")]
    Io(#[from] io::Error),
    #[error("parse error: {0}")]
    Parse(#[from] serde_json::Error),
    #[error("config missing field {0}")]
    MissingField(String),
}

fn load(path: &str) -> Result<Config, AppError> {
    let raw = fs::read_to_string(path)?;          // io::Error → AppError::Io
    let cfg: Config = serde_json::from_str(&raw)?; // serde error → AppError::Parse
    if cfg.api_key.is_empty() {
        return Err(AppError::MissingField("api_key".into()));
    }
    Ok(cfg)
}
```

**Why this beats exceptions**:

- Function signature documents **what can go wrong**
- Compiler enforces handling — no unchecked exceptions
- No hidden control flow (try/catch can jump from anywhere)
- Zero-cost: no stack unwinding overhead in hot path

#### Layer 3 — Edge cases

- **`unwrap()` and `expect()`**: Crash if `Err`. Acceptable in tests, prototypes, and **truly impossible** cases. In production code, replace with `?` or proper handling. Code review red flag: any non-test `.unwrap()` without a comment explaining why it cannot fail.
- **`anyhow` vs `thiserror`**: Use `anyhow::Error` in **applications/binaries** for ergonomic catch-all. Use `thiserror` in **libraries** to expose typed errors so callers can pattern-match.
- **Panic vs Error**: Panics = bugs (programmer error, e.g., index out of bounds). Errors = expected runtime failures (network down, file not found). Don't catch panics for control flow.

---

### Concept A3: Async Rust with Tokio — `async fn`, `.await`, no green threads

#### Layer 1 — Simple analogy

Go: mỗi `go func()` tạo **goroutine** (~2KB stack), runtime tự schedule. Rất dễ dùng nhưng có cost: stack growth, runtime overhead, GC tracking.

Rust: `async fn` trả về một **`Future`** (enum state machine compiler-generated). Future không chạy gì cả cho đến khi bạn `.await`. Một runtime như **Tokio** sẽ schedule futures lên N threads (M:N scheduling). **Không có goroutine, không có green thread runtime**.

Hệ quả: zero overhead khi không await, nhưng async function **"truyền màu"** — caller cũng phải `async` (giống `await` trong JS).

#### Layer 2 — How it works

```rust
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    // Sequential — 2 seconds total
    fetch_user(1).await;
    fetch_user(2).await;

    // Concurrent — 1 second total
    let (u1, u2) = tokio::join!(fetch_user(1), fetch_user(2));

    // Concurrent N — collect results
    let handles: Vec<_> = (1..=10).map(|id| tokio::spawn(fetch_user(id))).collect();
    for h in handles {
        let user = h.await.unwrap();
        println!("{:?}", user);
    }
}

async fn fetch_user(id: u64) -> User {
    sleep(Duration::from_secs(1)).await;
    User { id, name: format!("user-{id}") }
}
```

**Tokio runtime architecture**:

```
┌────────────────────────────────────────────────────────┐
│  Tokio multi-threaded runtime                           │
│                                                         │
│  Worker thread 1 ──┐                                    │
│  Worker thread 2 ──┼── Work-stealing scheduler          │
│  Worker thread 3 ──┘    (default = num CPUs)            │
│         │                                               │
│         ▼                                               │
│  ┌────────────────────────────────────┐                 │
│  │  Task queue (Future state machines)│                 │
│  └────────────────────────────────────┘                 │
│         │                                               │
│         ▼                                               │
│  ┌────────────────────────────────────┐                 │
│  │  I/O driver (epoll/kqueue/IOCP)    │                 │
│  │  Timer driver                       │                 │
│  └────────────────────────────────────┘                 │
└────────────────────────────────────────────────────────┘
```

#### Layer 3 — Edge cases

- **Blocking in async = death**: Calling sync I/O (e.g., `std::fs::read`) inside `async fn` blocks the entire worker thread → starves all other tasks on it. Use `tokio::fs::read` or wrap in `tokio::task::spawn_blocking`.
- **`Send` bounds for spawn**: `tokio::spawn` requires the future to be `Send` (move across threads). Holding a `Rc<T>` or `RefCell<T>` across `.await` breaks this. Use `Arc<Mutex<T>>` instead.
- **Cancellation safety**: Awaiting a future can be cancelled (the parent task drops it). State left in inconsistent shape = bug. Critical for database transactions — use `tokio::select!` carefully.
- **Async traits**: Stable in Rust 1.75+ via `async fn` in traits, but with caveats (no `dyn AsyncTrait` directly — use `async-trait` crate or `BoxFuture`).

---

### Concept A4: Building HTTP services with Axum + Tower

#### Layer 1 — Simple analogy

Axum = **Rust's Express/Gin/Echo**, but type-safe end to end. Built on Tokio + Hyper + Tower (middleware standard). If you've used Express middleware (`app.use(...)`), Tower is the same idea but with type-checked composition.

#### Layer 2 — How it works

Minimal Axum server with extractors, middleware, and graceful shutdown:

```rust
use axum::{
    routing::{get, post},
    extract::{State, Path, Json},
    http::StatusCode,
    middleware,
    Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;

#[derive(Clone)]
struct AppState {
    db: sqlx::PgPool,
}

#[derive(Deserialize)]
struct CreateUser { name: String, email: String }

#[derive(Serialize)]
struct User { id: i64, name: String, email: String }

async fn get_user(
    State(state): State<Arc<AppState>>,
    Path(id): Path<i64>,
) -> Result<Json<User>, (StatusCode, String)> {
    let user = sqlx::query_as!(User,
        "SELECT id, name, email FROM users WHERE id = $1", id
    )
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    .ok_or((StatusCode::NOT_FOUND, "user not found".into()))?;
    Ok(Json(user))
}

async fn create_user(
    State(state): State<Arc<AppState>>,
    Json(body): Json<CreateUser>,
) -> Result<Json<User>, (StatusCode, String)> {
    let user = sqlx::query_as!(User,
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email",
        body.name, body.email
    )
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(user))
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let db = sqlx::PgPool::connect(&std::env::var("DATABASE_URL")?).await?;
    let state = Arc::new(AppState { db });

    let app = Router::new()
        .route("/users/{id}", get(get_user))
        .route("/users", post(create_user))
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    let listener = TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;
    Ok(())
}

async fn shutdown_signal() {
    tokio::signal::ctrl_c().await.ok();
}
```

**Production stack you'll use in interviews**:

| Layer                         | Crate                               | Equivalent                   |
| ----------------------------- | ----------------------------------- | ---------------------------- |
| HTTP framework                | `axum`                              | Express / Gin                |
| Async runtime                 | `tokio`                             | Node event loop / Go runtime |
| HTTP client                   | `reqwest`                           | axios / net/http             |
| DB (compile-time checked SQL) | `sqlx`                              | Prisma / GORM                |
| ORM (optional)                | `sea-orm` / `diesel`                | TypeORM / GORM               |
| Serialization                 | `serde` + `serde_json`              | JSON.parse / encoding/json   |
| Errors                        | `anyhow` (apps), `thiserror` (libs) | —                            |
| Logging                       | `tracing` + `tracing-subscriber`    | pino / zerolog               |
| Config                        | `figment` / `config`                | dotenv / viper               |
| Validation                    | `validator`                         | zod / validator              |
| Auth                          | `jsonwebtoken` + `argon2`           | jsonwebtoken / bcrypt        |
| Testing                       | built-in `#[test]` + `wiremock`     | jest / testify               |

#### Layer 3 — Edge cases

- **Compile times**: Initial cargo build can take 5-15 min for an Axum + sqlx + tokio app. Use `cargo-chef` in Docker layers, `sccache` for caching. Incremental builds are 5-30s.
- **`sqlx` offline mode**: `sqlx` checks SQL against your DB at compile time. In CI without DB access, run `cargo sqlx prepare` locally to generate `.sqlx/` JSON cache, commit it, then CI builds offline.
- **Graceful shutdown is mandatory in production**: SIGTERM handling so in-flight requests complete before pod terminates. Forgetting this = 502s during deploys.

---

### 🚨 Common Mistakes (Sai lầm khi học Rust)

| Sai lầm                                          | Tại sao sai                                                    | Đúng là                                                                                                  |
| ------------------------------------------------ | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Fight the borrow checker by `clone()` everywhere | Loses Rust's perf benefit, slow heap thrash                    | First try restructuring data; clone only when ownership genuinely needed                                 |
| Use `unwrap()` in production code                | Crashes service on `None`/`Err`, no recovery path              | Use `?`, proper match, or document why unwrap is safe                                                    |
| Holding `MutexGuard` across `.await`             | Deadlock + breaks `Send` bound                                 | Drop guard before await, or use `tokio::sync::Mutex`                                                     |
| Spawn one task per request without bounds        | Unbounded memory growth under load                             | Use semaphore or bounded channel for backpressure                                                        |
| Translate Go interfaces 1:1 to Rust traits       | Different generics model — leads to `dyn` everywhere           | Use generics + trait bounds; reach for `dyn Trait` only for heterogeneous collections                    |
| Use `String` everywhere                          | Allocates per call, slow                                       | Use `&str` for read-only params, `String` only when ownership needed                                     |
| Ignoring lifetimes by `'static` everything       | Forces leaking or `Box::leak`, anti-pattern                    | Learn elision rules; explicit `'a` only when compiler asks                                               |
| Async `Mutex` always                             | Has overhead vs `std::sync::Mutex` for short critical sections | Use `std::sync::Mutex` for short non-await sections, `tokio::sync::Mutex` only when holding across await |
| Building monolithic enum errors with 50 variants | Hard to maintain, every caller cascades changes                | Layer errors per module; use `#[from]` conversions                                                       |
| Skipping `cargo clippy` and `cargo fmt`          | Code review nightmare                                          | CI gate: `cargo clippy -- -D warnings` + `cargo fmt --check`                                             |

---

### 🎯 Interview Pattern (when you hear these triggers)

| Trigger phrase                          | Open with                                                                                                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "Why would you choose Rust over Go?"    | "Tail latency floors from GC, embedded, security-critical paths, or systems programming. Otherwise Go's productivity wins."                                  |
| "Explain ownership / borrow checker"    | "Each value has one owner; references are either many-readonly or one-mutable, enforced at compile time. This eliminates data races without GC."             |
| "How does async work in Rust?"          | "`async fn` returns a Future state machine, runtime like Tokio polls them on a thread pool. No goroutines, no GC overhead, but async colors the call chain." |
| "How do you handle errors?"             | "`Result<T,E>` enum + `?` operator. Use `thiserror` for libraries (typed), `anyhow` for apps (catch-all)."                                                   |
| "How do you debug a slow Rust service?" | "`tokio-console` for runtime inspection, `tracing` spans for distributed traces, `cargo flamegraph` for CPU, `heaptrack`/`bytehound` for memory."            |

---

### 🔑 Knowledge Chain

📚 **Prerequisites**:

- [Concurrency fundamentals](../be-track/01-golang/04-goroutines-channels.md) — channels, mutexes, race conditions
- [Memory management](../shared/01-cs-fundamentals/05-os-fundamentals.md) — heap, stack, allocators
- [Error handling philosophy](../shared/05-software-engineering/03-error-handling.md)

➡️ **Enables**:

- [WebAssembly via Rust](./07-webassembly-fe-be.md) — Rust → Wasm is the dominant pipeline
- [Modern observability](./11-modern-observability.md) — `tracing` ecosystem maps directly to OTel
- [Edge computing](./04-edge-computing-serverless-2026.md) — Rust + Wasm at edge runtimes

---

## 💼 Part B — Interview Q&A (Bilingual EN+VI, Bloom-graded)

### B1 (🟢 Junior, Bloom L1-L2 Remember/Understand) — "What is the borrow checker?"

> **💡 Interview Signal**:
> ✅ Strong: mentions compile-time enforcement, mutual exclusion of `&` and `&mut`, eliminates data races without GC
> ❌ Weak: "it's strict" / "it makes Rust hard" without explaining what it prevents

**EN**: The borrow checker is a compile-time analyzer that enforces Rust's ownership rules. Each value has one owner; references are either many-immutable (`&T`) or exactly one mutable (`&mut T`), never both simultaneously. This guarantees no data races in concurrent code and no use-after-free, all without runtime garbage collection.

**VN**: Borrow checker là phần compiler kiểm tra lúc build. Mỗi giá trị có 1 chủ; tham chiếu hoặc nhiều readonly hoặc 1 mutable, không bao giờ cả hai. Đây là cách Rust loại bỏ data race và use-after-free **mà không cần GC** — chỉ tốn thời gian compile, không tốn runtime.

---

### B2 (🟢 Junior) — "Stack vs heap in Rust — what goes where?"

> **💡 Interview Signal**:
> ✅ Strong: `i32` `bool` arrays of fixed size on stack; `String` `Vec` `Box` on heap; mentions `Copy` trait
> ❌ Weak: confused with C++ rules or Go's escape analysis

**EN**: Fixed-size types implementing `Copy` (i32, bool, char, fixed arrays) live on the stack. Dynamic-size or growable types (String, Vec, HashMap, Box<T>) allocate on the heap with stack-resident pointer/length/capacity. Ownership rules apply identically to both, but heap values get freed when their owner's scope ends — deterministic, no GC.

**VN**: Type kích thước cố định + `Copy` (i32, bool…) nằm trên stack. Type dynamic (String, Vec, HashMap…) nằm trên heap, chỉ pointer/len/cap nằm trên stack. Khi owner ra khỏi scope, heap memory được free ngay — deterministic, không GC.

---

### B3 (🟢 Junior) — "What does `?` do?"

> **💡 Interview Signal**:
> ✅ Strong: explains early return on `Err`, `From` trait conversion, contrast with try/catch
> ❌ Weak: "shorthand for unwrap" (wrong — unwrap panics)

**EN**: `?` after a `Result`: if `Ok(v)` it unwraps to `v`; if `Err(e)` it returns early from the function with `Err(e.into())` (using the `From` trait to convert error types). It's the equivalent of writing a `match` that returns Err early — explicit error propagation without exceptions or hidden control flow.

**VN**: `?` đứng sau `Result`: nếu `Ok` thì lấy giá trị, nếu `Err` thì return luôn khỏi hàm với error đó (tự convert qua `From`). Tương đương `match` thủ công nhưng ngắn — propagate error rõ ràng, không có exception ẩn.

---

### B4 (🟡 Mid, Bloom L3 Apply) — "How do you share state across Tokio tasks?"

> **💡 Interview Signal**:
> ✅ Strong: `Arc<Mutex<T>>` or `Arc<RwLock<T>>`, mentions `tokio::sync::Mutex` for await-holding, channels as alternative
> ❌ Weak: tries to use `Rc<RefCell<T>>` (not `Send`)

**EN**: For shared mutable state, use `Arc<Mutex<T>>` (multi-thread reference counting + lock). If you need to hold the lock across `.await`, use `tokio::sync::Mutex` instead of `std::sync::Mutex` to avoid blocking the runtime. For read-heavy workloads, `Arc<RwLock<T>>`. Often better: avoid shared state entirely — use channels (`tokio::sync::mpsc`) for actor-style message passing.

**VN**: Dùng `Arc<Mutex<T>>` để share mutable state giữa nhiều Tokio task. Nếu phải hold lock qua `.await` thì dùng `tokio::sync::Mutex` (không phải `std::sync::Mutex`) để không block runtime. Read-heavy thì dùng `RwLock`. Thường tốt hơn: dùng channel `mpsc` theo mô hình actor để tránh shared state.

---

### B5 (🟡 Mid) — "When would you use generics vs `dyn Trait`?"

> **💡 Interview Signal**:
> ✅ Strong: generics = monomorphization (zero cost, larger binary); `dyn` = vtable (runtime dispatch, smaller binary, needed for heterogeneous collections)
> ❌ Weak: doesn't know the trade-off, picks one arbitrarily

**EN**: Generics (`fn foo<T: Trait>(x: T)`) get monomorphized — compiler generates a specialized version per type, zero runtime cost but larger binary. `dyn Trait` (`fn foo(x: &dyn Trait)`) uses a vtable for dynamic dispatch — small binary, slight runtime cost (one indirection), but required when you need a heterogeneous collection like `Vec<Box<dyn Trait>>`. Default to generics; reach for `dyn` only when you genuinely need runtime polymorphism.

**VN**: Generics monomorphize (compiler gen 1 bản cho mỗi type) — zero runtime cost, binary lớn hơn. `dyn Trait` dùng vtable — binary nhỏ, runtime cost nhẹ (1 indirection), cần khi muốn collection chứa nhiều loại type khác nhau. Mặc định dùng generics, chỉ chọn `dyn` khi thực sự cần runtime polymorphism.

---

### B6 (🟡 Mid) — "What's wrong with `Vec<String>` if you only need to read strings?"

> **💡 Interview Signal**:
> ✅ Strong: mentions `&[&str]` for borrowed slices, `Cow<'a, str>` for maybe-owned
> ❌ Weak: doesn't see the allocation cost

**EN**: `Vec<String>` allocates one heap String per element + Vec backing. If you only read, use `&[&str]` (slice of borrowed str refs) — zero new allocations. If sometimes you need to own (modify), `Cow<'a, str>` (Clone-on-Write) lets you borrow by default and only allocate when you mutate. Choosing the right type is half of Rust performance work.

**VN**: `Vec<String>` cấp phát heap cho mỗi String + cho Vec. Nếu chỉ đọc, dùng `&[&str]` — không alloc thêm. Nếu thỉnh thoảng cần own (modify), dùng `Cow<'a, str>` — borrow mặc định, chỉ alloc khi mutate. Chọn đúng type chiếm nửa hiệu năng Rust.

---

### B7 (🟡 Mid) — "Walk through how you'd add a Postgres connection pool to an Axum app"

> **💡 Interview Signal**:
> ✅ Strong: `sqlx::PgPool` in `AppState`, share via `State<Arc<AppState>>`, sets max connections, mentions migrations and prepared statements
> ❌ Weak: opens new connection per request

**EN**: Create a `sqlx::PgPool::connect_with(PgPoolOptions::new().max_connections(20))` once at startup. Wrap it in `Arc<AppState>` and pass to Axum via `.with_state(state)`. Handlers extract via `State<Arc<AppState>>` and call `sqlx::query_as!(...).fetch_one(&state.db).await`. Use `sqlx::migrate!` macro to embed migration files; run them on startup. The `query_as!` macro **type-checks SQL against your DB at compile time** — no runtime SQL injection risk and refactor-safe.

**VN**: Tạo `PgPool` 1 lần khi start (set max_connections). Wrap trong `Arc<AppState>`, share qua `Router::with_state`. Handler extract `State<Arc<AppState>>` rồi `sqlx::query_as!(...).fetch_one(&state.db).await`. Migrations dùng `sqlx::migrate!` macro embed file, chạy lúc start. `query_as!` check SQL với DB tại compile time — không lo SQL injection, refactor an toàn.

---

### B8 (🔴 Senior, Bloom L4 Analyze) — "Discord rewrote read-states from Go to Rust to fix tail latency. Walk me through the analysis you'd do BEFORE recommending such a rewrite."

> **💡 Interview Signal**:
> ✅ Strong: identifies GC pause as suspect, profiles to confirm, considers Go alternatives (GOGC tuning, manual pools, off-heap storage), estimates rewrite cost (engineer-months), risk-adjusted ROI
> ❌ Weak: "Rust is faster, let's rewrite"

**EN**:

1. **Confirm the bottleneck is GC, not algorithm**:
   - Enable `GODEBUG=gctrace=1`, capture pprof CPU + heap profiles during P99 incidents
   - Check `runtime.MemStats.PauseNs` percentiles. If P99 latency spikes correlate with GC pauses → confirmed
2. **Try Go-side mitigations first**:
   - Tune `GOGC` (lower = more frequent shorter pauses), set `GOMEMLIMIT`
   - `sync.Pool` for hot allocations
   - Move large state off-heap (mmap, embedded BoltDB, or external Redis)
   - Sharded maps with `sync.Map` to reduce contention
   - Use `runtime.LockOSThread` for latency-critical goroutines
3. **Quantify the gap remaining after mitigations**:
   - "After optimizations, P99 still 80ms, target is 20ms" → real case for rewrite
   - "After optimizations, P99 is 25ms, target was 100ms" → don't rewrite
4. **Estimate rewrite cost**:
   - Lines of code, team Rust expertise (training time?), CI/CD changes, dependency mapping (does sqlx replace your ORM cleanly?)
   - Discord's read-states was small (few thousand LOC) and isolated — perfect candidate. A 100K LOC monolith is not.
5. **Run partial rewrite in shadow**:
   - Implement Rust version, dual-write production traffic, compare latency/correctness for 4-8 weeks
   - Only cut over after evidence
6. **Plan the long tail**: hiring, on-call rotation, monitoring tooling familiarity, runbook rewrite

**VN**:
Trước khi recommend rewrite Go → Rust:

1. **Xác nhận bottleneck là GC**: bật `gctrace`, profile pprof, check correlation P99 spike vs `PauseNs`. Nếu không phải GC, rewrite không giải quyết được.
2. **Thử mitigations bên Go trước**: tune `GOGC`/`GOMEMLIMIT`, `sync.Pool`, off-heap state (mmap/Redis), `sync.Map` shard, `LockOSThread`.
3. **Định lượng gap còn lại**: nếu sau optimize mà vẫn miss SLO 4x thì rewrite có cơ sở. Nếu chỉ miss 1.2x thì không bõ.
4. **Ước lượng cost rewrite**: LOC, expertise team (training 2-3 tháng), CI/CD, dependency mapping. Discord chọn read-states vì nhỏ + isolated.
5. **Shadow run**: chạy song song Rust version 4-8 tuần, dual-write, so sánh latency/correctness, mới cut over.
6. **Long tail**: hiring, on-call, observability tools, runbook rewrite.

**Key**: rewrite is a 6-12 month bet with multi-million-dollar cost. Profile first, mitigate first, rewrite last.

---

### B9 (🔴 Senior, Bloom L5 Evaluate) — "Compare Rust + Axum vs Go + Echo for a high-throughput API gateway. Build a decision matrix."

> **💡 Interview Signal**:
> ✅ Strong: multi-axis matrix (perf/safety/ecosystem/team/time-to-market), quantitative numbers where possible, conditional recommendation
> ❌ Weak: picks one as "always better"

**EN**:

| Axis                               | Rust + Axum              | Go + Echo               | Winner        |
| ---------------------------------- | ------------------------ | ----------------------- | ------------- |
| Tail latency (P99 under load)      | 5-15ms, no GC pauses     | 20-100ms with GC spikes | Rust          |
| Throughput (req/s on 4 cores)      | ~250K                    | ~150K                   | Rust ~1.7x    |
| Memory footprint per pod           | 50-150MB                 | 200-500MB               | Rust ~3x less |
| Cold start (binary boot)           | 5-30ms                   | 20-100ms                | Rust          |
| Dev velocity (lines/day per dev)   | 30-50                    | 100-150                 | Go ~3x        |
| Compile time clean build           | 5-15 min                 | 5-30s                   | Go            |
| Compile time incremental           | 5-30s                    | 1-3s                    | Go            |
| Hiring pool (devs/month available) | ~100                     | ~1000                   | Go            |
| Ecosystem for HTTP/DB/cloud        | Good (axum/sqlx/aws-sdk) | Excellent (mature)      | Go            |
| Memory safety bugs in production   | ~0                       | possible (slices, maps) | Rust          |
| Onboarding time for new dev        | 4-12 weeks               | 1-2 weeks               | Go            |
| Cloud cost at 100M req/day         | Lower (better density)   | Higher                  | Rust          |

**Decision rubric**:

- **Choose Rust** if: latency-sensitive (HFT, real-time, gaming), security-critical (crypto, auth), edge/embedded, or running at scale where pod density saves >$100K/year
- **Choose Go** if: standard CRUD APIs, fast iteration, hiring constrained, time-to-market is the metric

**Hybrid pattern (common in 2025)**: Go for 90% of services, Rust for the 5-10 hot spots (gateway, message broker, crypto service). 1Password and Cloudflare both ship this pattern.

**VN**:
| Axis | Rust+Axum | Go+Echo |
|---|---|---|
| P99 latency | 5-15ms | 20-100ms (GC) |
| Throughput | ~250K req/s | ~150K req/s |
| Memory | 50-150MB | 200-500MB |
| Dev velocity | 30-50 LOC/day | 100-150 LOC/day |
| Compile time | 5-15 min clean | 5-30s |
| Hiring | khó (~100/tháng) | dễ (~1000/tháng) |

**Rule**: Rust khi latency/security-critical hoặc scale lớn (cost density). Go khi CRUD chuẩn + cần ship nhanh + team đông. Hybrid: Go cho 90%, Rust cho 5-10 hot spot.

---

### B10 (🔴 Senior, Bloom L6 Create) — "Design a real-time order matching engine for a crypto exchange in Rust. Cover data structures, concurrency, persistence, latency targets."

> **💡 Interview Signal**:
> ✅ Strong: lock-free or single-writer order book, channels for ingress, async network + sync core, append-only log, latency budget breakdown
> ❌ Weak: skips concurrency model, hand-waves latency

**EN**:

**Latency budget (P99 target: <500µs match-to-ack)**:

- Network ingress (TCP socket → Tokio): 50µs
- Deserialize order: 30µs
- Validation (auth, balance): 50µs
- Order book match: 100µs
- Persistence (write-ahead log): 150µs
- Network egress (response): 50µs
- Buffer for tail: 70µs

**Architecture**:

```
┌──────────────────────────────────────────────────────────┐
│  Single matching engine thread per trading pair (BTC-USD)│
│  - Owns the order book (no locks needed)                  │
│  - Processes orders sequentially from MPSC channel        │
└──────────────────────────────────────────────────────────┘
                      ▲                          │
                      │                          ▼
              ┌───────────────┐         ┌────────────────┐
              │  Tokio I/O    │         │  WAL writer    │
              │  thread pool  │         │  (separate     │
              │  (per-conn    │         │   thread,      │
              │   tasks)      │         │   batched      │
              └───────────────┘         │   fsync)       │
                                        └────────────────┘
```

**Key design choices**:

1. **Single-writer order book per pair**: One Tokio task owns the order book for BTC-USD, another for ETH-USD, etc. No locks. Orders arrive via `tokio::sync::mpsc` from network tasks. Sequential processing = no contention, predictable latency.
2. **Order book data structure**: `BTreeMap<Price, VecDeque<Order>>` for each side (bids/asks). Top of book O(log n) to access, FIFO within price level. Some exchanges use custom B+tree for cache efficiency.
3. **Network layer**: Tokio + `tungstenite` for WebSocket, async accept connections, parse → push to engine via channel. Network thread pool sized to CPU count.
4. **Persistence (WAL)**:
   - Every accepted order appended to a write-ahead log on a dedicated SSD
   - Batch fsync every 100µs or 64 orders, whichever first (group commit)
   - Replay WAL on startup to rebuild order book state
5. **Snapshotting**: Every 5 minutes, snapshot order book to S3. Recovery = latest snapshot + WAL tail.
6. **Risk checks**: Pre-trade balance check via `Arc<DashMap<UserId, Balance>>` (sharded concurrent map), updated post-match.
7. **Market data dissemination**: Engine emits `Trade` events to a broadcast channel; subscriber tasks fan out to WebSocket clients (best-effort, lossy on slow consumers).
8. **Error handling**: `thiserror` for typed engine errors (insufficient funds, price out of bounds), all logged with `tracing` spans correlated by order ID.
9. **Testing**:
   - Property-based tests with `proptest` (random orders, invariants: sum of bids ≤ market depth, no negative balance)
   - Deterministic simulator replaying historical CME data
   - Chaos testing: kill engine mid-match, verify WAL replay reconstructs identical state
10. **Monitoring**: P50/P99/P999 latency per stage (deserialize, validate, match, persist) via `tracing` + Prometheus exporter. Alert if P999 match latency > 1ms.

**Why Rust here**:

- Predictable latency (no GC) → meets P999 SLO
- Memory safety in concurrent code → no race conditions destroying balance state
- Zero-cost abstractions → ergonomic code without runtime tax
- Mature crates: `tokio`, `axum`, `sqlx`, `dashmap`, `tracing`

**Why NOT Java/Go**: Java GC pauses violate P999. Go GC tunable but still hits 50-200µs pauses under load — too much when budget is 500µs total.

**VN**:
**Latency budget P99 < 500µs**: ingress 50 + decode 30 + validate 50 + match 100 + WAL 150 + egress 50 + buffer 70.

**Kiến trúc**:

1. **Single-writer per pair**: 1 Tokio task own order book BTC-USD, 1 task khác own ETH-USD, không cần lock. Order vào qua MPSC channel từ network task.
2. **Order book**: `BTreeMap<Price, VecDeque<Order>>` cho bids/asks; top-of-book O(log n).
3. **Network**: Tokio + WebSocket, parse → push channel.
4. **WAL**: append mỗi order, group commit fsync mỗi 100µs hoặc 64 orders. Replay khi restart.
5. **Snapshot** mỗi 5 phút lên S3.
6. **Risk check**: `Arc<DashMap<UserId, Balance>>` sharded.
7. **Market data**: broadcast channel, fan-out WebSocket.
8. **Errors**: `thiserror` typed, log với `tracing` span theo order ID.
9. **Test**: `proptest` invariants, replay CME data, chaos kill engine.
10. **Monitor**: P50/P99/P999 mỗi stage, alert P999 match > 1ms.

**Vì sao Rust**: predictable latency (no GC), memory safety concurrent, zero-cost abstraction. Java/Go GC pause vi phạm budget P999.

---

## 🎓 Part C — Study Cases (Real-World Production)

### Study Case 1: Discord — Read States service (Go → Rust, 2020, still in prod 2025)

**Problem**: Tracking read message position per user per channel for 200M+ users, 19B+ messages/day. Go service was hitting **P99 latency spikes every 2 minutes** matching Go's GC cycle.

**Solution**:

- Rewrote in Rust + Tokio
- Used `BTreeMap` for sorted channel state
- Sharded by user ID across cores
- Custom serialization to avoid allocations on hot path

**Result**:

- P99 latency: 300ms → <20ms, no spikes
- Memory: 5GB → 1.5GB
- CPU: 70% → 20%
- **Service has not had a single language-related outage in 5 years**

**Source**: [Discord engineering blog — "Why Discord is switching from Go to Rust"](https://discord.com/blog/why-discord-is-switching-from-go-to-rust)

**Lesson**: Rewrite when GC tail latency is the proven bottleneck AND the service is small + isolated. Don't generalize this to your CRUD API.

---

### Study Case 2: Cloudflare Pingora — Nginx replacement (Rust, 2022 → today)

**Problem**: Nginx serving 1T+ requests/day at Cloudflare. Hit limits: thread-per-connection model, painful config reloads, C-language CVEs, lack of async-first design.

**Solution**:

- Built **Pingora**: Rust + Tokio HTTP proxy library
- Single shared connection pool across all worker threads (Nginx is per-worker)
- Async I/O end-to-end
- Open-sourced 2024

**Result**:

- 70% less CPU per request
- 67% less memory
- Connection reuse: 99.92% (Nginx ~85%) → fewer TLS handshakes
- Zero buffer overflow CVEs since launch
- Saves ~$tens-of-millions/year in compute

**Source**: [Cloudflare blog — "How we built Pingora"](https://blog.cloudflare.com/pingora-open-source/)

**Lesson**: Rust shines when you can leverage shared-state across cores (impossible safely in C without locks) and when memory safety bugs have outsized cost (security-critical edge).

---

### Study Case 3: 1Password — backend services (Rust for crypto-sensitive paths)

**Problem**: 1Password runs on iOS, Android, macOS, Windows, Linux, browsers. Auditing the same crypto code 6 times across 6 languages was expensive and error-prone. Backend services handling vault sync also had to be unimpeachable.

**Solution**:

- Crypto core written in Rust
- Compiled to native binary for backend services (Axum + Tokio)
- Compiled to **WebAssembly** for browser extension
- Compiled to **mobile FFI** for iOS (Swift) and Android (Kotlin)
- Single audit, six platforms

**Result**:

- One codebase to audit (vs six)
- No memory safety bugs in 5 years of production
- Mobile crypto perf 10-100x faster than previous Swift/Kotlin implementations
- Backend services handle 100M+ vault sync ops/day with zero downtime from language-level bugs

**Source**: 1Password engineering blog + RustConf 2023 talk

**Lesson**: Rust + Wasm = "write once, audit once, ship everywhere" for security-critical logic. This pattern is becoming standard for crypto, DRM, and any code where one bug = company-ending event.

---

## 🧠 Part C — End-of-File Study Tools

### C1 — 📋 Overview / Tổng quan

You learned: ownership/borrowing as the core mental model, `Result`/`?` for error handling, async/Tokio for concurrency, Axum + sqlx for production HTTP services, common mistakes and idiomatic patterns. You now have decision rubrics for **when Rust is worth the cost** vs sticking with Go/TS.

**Bạn đã học**: Mental model ownership/borrowing, error handling với `Result` + `?`, async với Tokio, Axum + sqlx cho HTTP service production, các lỗi phổ biến. Có quyết định khi nào dùng Rust vs Go/TS.

---

### C2 — 📊 Interview Q&A Summary

| #   | Question                            | Difficulty | Core Concept | Key Signal                                                 |
| --- | ----------------------------------- | ---------- | ------------ | ---------------------------------------------------------- |
| B1  | What is the borrow checker?         | 🟢         | Ownership    | compile-time enforcement, eliminates data races without GC |
| B2  | Stack vs heap in Rust?              | 🟢         | Memory model | `Copy` types stack, dynamic types heap, deterministic free |
| B3  | What does `?` do?                   | 🟢         | Errors       | early-return on Err with `From` conversion                 |
| B4  | Share state across Tokio tasks      | 🟡         | Async        | `Arc<Mutex<T>>`, async vs sync mutex, channels alternative |
| B5  | Generics vs `dyn Trait`             | 🟡         | Generics     | monomorphization vs vtable trade-off                       |
| B6  | `Vec<String>` vs `&[&str]` vs `Cow` | 🟡         | Allocation   | minimize allocations, use borrows                          |
| B7  | Postgres pool in Axum               | 🟡         | Production   | `PgPool` in `Arc<AppState>`, sqlx compile-time check       |
| B8  | Analyze before Go→Rust rewrite      | 🔴         | Architecture | confirm GC bottleneck, mitigate first, shadow run          |
| B9  | Rust vs Go decision matrix          | 🔴         | Trade-offs   | quantitative axes, conditional recommendation              |
| B10 | Order matching engine design        | 🔴         | Systems      | single-writer, WAL, latency budget, why no GC matters      |

---

### C3 — ⚡ Cold Call Simulation (30-second answer)

**Q**: "I have a Go service hitting P99 latency spikes during GC. Should I rewrite in Rust?"

**You (4 sentences, ~30s)**:

> "Not yet — first profile to confirm the spikes correlate with GC pauses (`gctrace`, pprof). Then try Go-side mitigations: tune `GOGC`/`GOMEMLIMIT`, `sync.Pool` for hot allocations, move large state off-heap. If after mitigation you still miss SLO by 3-4x and the service is small + isolated like Discord's read-states, then Rust + Tokio is justified. Otherwise the rewrite cost (6-12 months, hiring, retraining, runbooks) outweighs the latency win for typical CRUD APIs."

**Follow-up**: "What's the team cost?"

> "Rust ramp-up is 4-12 weeks per engineer for basic productivity, 6 months for senior-level. Hiring pool is ~10x smaller than Go. Compile times 5-15min clean — slows iteration. Counted against ~3x density savings in cloud cost at scale, only worth it above ~$100K/year compute or for security-critical services."

---

### C4 — 🔍 Self-Check (close the doc)

Without rereading, can you:

- [ ] **Retrieval**: State the 3 ownership rules and what each prevents
- [ ] **Visual**: Sketch the relationship between async fn, Future, Tokio runtime, and OS threads
- [ ] **Application**: Write the type signature for a function that takes a borrowed string slice and returns a Result with a custom error type
- [ ] **Debug**: Given "cannot borrow `x` as mutable more than once at a time", explain the cause and 2 ways to fix
- [ ] **Teach**: Explain to a Go developer why Rust has no GC pauses, in under 90 seconds, without saying "memory safety"

If you can't do all 5 → re-read Concepts A1, A3, and Q&A B4 + B8.

---

### C5 — 💬 Feynman Prompt

Pretend you're explaining to a TypeScript backend developer who has never seen Rust:

> "Why do Rust developers say 'fighting the borrow checker is a phase you grow out of', and what changes when you internalize ownership? Give an example of code that the borrow checker rejects but is actually a real bug it caught."

Write your 3-4 paragraph answer, then check it against Concept A1 and Common Mistakes table.

---

### C6 — 🔁 Spaced Repetition Schedule

| Day       | Action                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| Day 1     | Read entire file end-to-end. Build & run the Axum example.                                                           |
| Day 3     | Re-do Q&A B1-B5 from memory. Write a small CLI in Rust that reads JSON file → outputs CSV.                           |
| Day 7     | Re-do Q&A B6-B7. Add Postgres + migrations to your CLI as a service.                                                 |
| Day 14    | Re-do Q&A B8-B9. Build a TODO REST API with Axum + sqlx + auth middleware. Compare your code to the Layer 2 example. |
| Day 30    | Tackle B10 design from scratch (no peeking). Code a simplified order book in Rust handling 2 trading pairs.          |
| Quarterly | Read latest Rust release notes (every 6 weeks). Skim 1 production rewrite story (Cloudflare blog, Discord blog).     |

---

### C7 — 🔗 Connections

**Same track (BE)**:

- [Go fundamentals](../be-track/01-golang/01-go-fundamentals.md) — your reference baseline
- [Goroutines & channels](../be-track/01-golang/04-goroutines-channels.md) — contrast with Rust async
- [Error handling patterns](../shared/05-software-engineering/03-error-handling.md)
- [Database advanced](../be-track/03-database-advanced/01-postgres-internals.md) — sqlx connects here
- [Resilience patterns](../be-track/02-backend-knowledge/07-resilience-patterns.md) — circuit breakers in Rust

**Cross-track (2026 trends)**:

- [07 — WebAssembly](./07-webassembly-fe-be.md) — Rust → Wasm is THE pipeline
- [04 — Edge computing](./04-edge-computing-serverless-2026.md) — Rust on edge runtimes (Cloudflare Workers, Fastly)
- [11 — Modern observability](./11-modern-observability.md) — `tracing` crate maps to OTel
- [02 — LLM system design](./02-llm-system-design.md) — Rust for high-perf inference proxies (vLLM is Python but proxies wrap in Rust)
- [10 — Senior engineer in AI era](./10-senior-engineer-ai-era.md) — judgment about when rewrites are worth it

---

> **🎯 One-liner to remember**: _"Rust trades 2-3 weeks of learning pain for years of zero-data-race, zero-GC-pause, zero-segfault production. Choose it when latency tail or memory safety bugs cost more than developer velocity does."_
