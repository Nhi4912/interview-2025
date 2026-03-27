# Go Concurrency — Deep Theory & Interview Questions

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Go Fundamentals](./01-language-fundamentals.md) | [OS Theory](../../shared/01-cs-fundamentals/os-theory.md)
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> **Phạm vi**: Goroutines, Scheduler (GMP), Channels, sync, Context, Concurrency Patterns, Race/Deadlock.
> Đây là chủ đề **quan trọng nhất** trong phỏng vấn Go — Google, Zalo, Grab đều hỏi sâu.
> ~70% lý thuyết, ~30% code minh họa. Bilingual: English headings + Vietnamese explanations.

---

## Real-World Scenario / Tình Huống Thực Tế

API server nhận 10,000 requests/second. Mỗi request: validate → DB query → external API call → response.

**OS threads approach:** 10,000 threads × 1MB stack = **10GB RAM** chỉ cho threads. Không khả thi.

**Go goroutines:** 10,000 goroutines × 2KB stack = **20MB RAM**. Go scheduler (GMP model) multiplexes M goroutines lên N OS threads trên P logical processors.

Đây là lý do Go scale tốt cho high-concurrency backends — và là chủ đề hỏi nhiều nhất trong Go interviews.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Nhà bếp restaurant:**

- **OS Thread** = đầu bếp thực (expensive, giới hạn 8-32 per machine)
- **Goroutine** = task/order cần làm (có thể có hàng nghìn)
- **Go Scheduler** = manager phân công task cho đầu bếp có sẵn
- **Channel** = khay truyền đồ giữa các đầu bếp (communicate, không share trực tiếp)

**Go Concurrency Philosophy:**

> "Don't communicate by sharing memory; share memory by communicating." — Rob Pike

| Pattern   | Khi nào                          | Tool              |
| --------- | -------------------------------- | ----------------- |
| Goroutine | Mọi concurrent task              | `go func()`       |
| Channel   | Communicate between goroutines   | `make(chan T)`    |
| Mutex     | Protect shared state (đơn giản)  | `sync.Mutex`      |
| WaitGroup | Wait for goroutines to finish    | `sync.WaitGroup`  |
| Context   | Cancellation, timeout, deadlines | `context.Context` |

---

## Concept Map / Bản Đồ Khái Niệm

```
    [OS Threads & CPU Scheduling]
              │
              ▼
     [GO CONCURRENCY]  ← bạn đang ở đây
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
[Goroutine] [Channel] [sync pkg]
go keyword   buffered   Mutex/RWMutex
GMP model    unbuffered  WaitGroup
Stack growth  select     Once/Map
              close      atomic ops
    │
    ▼
[Patterns]
Worker pool | Fan-out/fan-in | Pipeline | Semaphore
    │
    ▼
[Pitfalls to avoid]
Race conditions | Deadlock | Goroutine leak | Channel leak
```

---

## Overview / Tổng Quan

Go concurrency là **chủ đề hỏi nhiều nhất** trong Go interviews (~40% câu hỏi). File này bao gồm 7 nhóm khái niệm cốt lõi:

| #   | Core Concept                | Role / Vai Trò                                            | Interview Weight |
| --- | --------------------------- | --------------------------------------------------------- | ---------------- |
| 1   | **Concurrency Model (CSP)** | Triết lý thiết kế Go — message passing over shared memory | ⭐⭐             |
| 2   | **Goroutines**              | Lightweight user-space threads — nền tảng concurrent Go   | ⭐⭐⭐           |
| 3   | **GMP Scheduler**           | Runtime scheduler multiplexes goroutines onto OS threads  | ⭐⭐⭐           |
| 4   | **Channels & Select**       | Communication primitives — typed message pipes            | ⭐⭐⭐           |
| 5   | **Sync Primitives**         | Mutex, WaitGroup, Once, atomic — protecting shared state  | ⭐⭐             |
| 6   | **Context Package**         | Request-scoped cancellation, timeout, value propagation   | ⭐⭐⭐           |
| 7   | **Concurrency Patterns**    | Reusable solutions: Pipeline, Fan-out/in, Worker Pool     | ⭐⭐             |

**Relationship / Mối Quan Hệ**: CSP philosophy (1) guides how goroutines (2) communicate via channels (4). GMP scheduler (3) makes goroutines efficient. Sync primitives (5) protect shared state when channels aren't ideal. Context (6) controls goroutine lifecycle. Patterns (7) compose all primitives into production solutions.

---

## Core Concepts — Phase 2 Deep Elements / Khái Niệm Cốt Lõi

### Concept 1: Concurrency Model (CSP)

> 🧠 **Memory Hook**: "**Don't share memory, share messages**" — Rob Pike's mantra = entire Go concurrency philosophy in one sentence.

**Why This Exists / Tại Sao Tồn Tại:**

- **Level 1**: Shared memory + locks = complex bugs (data races, deadlocks). Message passing is simpler to reason about.
- **Level 2**: CSP (Hoare 1978) proved that independent processes communicating via channels can be **formally verified** — Go adopted this for practical safety.

**Common Mistakes / Lỗi Thường Gặp:**

- ❌ Thinking Go is pure CSP — Go has `sync.Mutex` too; CSP is **preferred**, not mandatory
- ❌ Confusing concurrency (structure) with parallelism (execution) — 1 core can be concurrent but not parallel

**🎯 Interview Pattern**: Define CSP → Compare with shared memory → Go's implementation (goroutines + channels) → When to use mutex instead

**🔗 Knowledge Chain**: `Tony Hoare CSP (1978)` → `Erlang actor model` → `Go channels` → `Rob Pike's philosophy`

---

### Concept 2: Goroutines

> 🧠 **Memory Hook**: "**2KB employee** vs 1MB contractor" — goroutine starts 500x lighter than OS thread.

**Why This Exists / Tại Sao Tồn Tại:**

- **Level 1**: OS threads too heavy for 10K+ concurrent connections (10GB RAM just for stacks).
- **Level 2**: M:N threading model — Go runtime schedules M goroutines on N OS threads, amortizing kernel overhead.
- **Level 3**: Growable stack (2KB → 1GB) eliminates fixed allocation waste; compiler inserts stack check prologues.

**Common Mistakes / Lỗi Thường Gặp:**

- ❌ No exit strategy → **goroutine leak** (most common Go bug in production)
- ❌ Expecting goroutine ID — Go deliberately omits it to prevent thread-local storage abuse
- ❌ Ignoring error handling in spawned goroutines — panics crash the entire process

**🎯 Interview Pattern**: Compare with thread (table) → Stack growth mechanism → Lifecycle states → Leak detection (`goleak`, `pprof`)

**🔗 Knowledge Chain**: `OS threads (heavy)` → `goroutines (light)` → `GMP scheduler` → `channels for coordination` → `context for lifecycle`

---

### Concept 3: GMP Scheduler

> 🧠 **Memory Hook**: "**G**ofer slips, **M**achine workers, **P**rocessor workstations" — G = task, M = OS thread, P = run queue + resources.

**Why This Exists / Tại Sao Tồn Tại:**

- **Level 1**: Can't create 100K OS threads; need multiplexing layer.
- **Level 2**: Work stealing balances load across Ps — idle P steals from busy P's queue.
- **Level 3**: Syscall handling: when M blocks on syscall, P detaches and finds/creates new M — other goroutines don't stall.

**Common Mistakes / Lỗi Thường Gặp:**

- ❌ Thinking P = CPU core — P is **logical processor** (defaults to `GOMAXPROCS`)
- ❌ Confusing M with goroutine — M is OS thread, not goroutine
- ❌ Not understanding preemption — before Go 1.14, tight loops couldn't be preempted (now SIGURG signal-based)

**🎯 Interview Pattern**: Draw GMP diagram → Normal scheduling flow → Syscall scenario → Work stealing → Preemption evolution

**🔗 Knowledge Chain**: `OS scheduler` → `GMP model` → `work stealing` → `syscall handling` → `network poller` → `preemption (SIGURG)`

---

### Concept 4: Channels & Select

> 🧠 **Memory Hook**: "Channel = **conveyor belt**" — unbuffered = direct hand-off (both wait), buffered = belt with N slots.

**Why This Exists / Tại Sao Tồn Tại:**

- **Level 1**: Safe goroutine communication without shared memory.
- **Level 2**: Ownership transfer — once sent, sender doesn't touch data anymore.
- **Level 3**: `hchan` struct internally uses ring buffer + wait queues; direct copy optimization avoids buffer for waiting receivers.

**Common Mistakes / Lỗi Thường Gặp:**

- ❌ Sending to nil channel → blocks forever (not panic)
- ❌ Forgetting to close producer channel → consumer goroutine leaks
- ❌ Reading from closed channel returns zero value (not error) — use `v, ok := <-ch` pattern

**🎯 Interview Pattern**: Channel axioms table → Internal structure (hchan) → Buffered vs unbuffered → `select` randomness → Patterns

**🔗 Knowledge Chain**: `CSP theory` → `channels (hchan)` → `select multiplexing` → `patterns (fan-out, pipeline)` → `errgroup`

---

### Concept 5: Sync Primitives

> 🧠 **Memory Hook**: "**Mutex = bathroom lock** (one person), **RWMutex = library** (many readers, one writer at a time)."

**Why This Exists / Tại Sao Tồn Tại:**

- **Level 1**: Not everything fits channel model — simple state protection is cleaner with mutex.
- **Level 2**: `sync.Pool` reduces GC pressure by reusing objects; `sync.Once` guarantees one-time initialization.

**Common Mistakes / Lỗi Thường Gặp:**

- ❌ Copying sync types (Mutex, WaitGroup) — `go vet` catches this
- ❌ `RLock()` then `Lock()` without releasing → deadlock
- ❌ Forgetting `defer mu.Unlock()` — any panic leaves mutex locked forever

**🎯 Interview Pattern**: When mutex vs channel → Mutex vs RWMutex (read-heavy workloads) → WaitGroup for fan-out → Pool for GC

**🔗 Knowledge Chain**: `shared memory model` → `Mutex/RWMutex` → `atomic (single var)` → `sync.Map (concurrent map)` → `sync.Pool (GC pressure)`

---

### Concept 6: Context Package

> 🧠 **Memory Hook**: "Context = **phone tree** — cancel the root call, everyone hangs up automatically."

**Why This Exists / Tại Sao Tồn Tại:**

- **Level 1**: HTTP request spawns 5 goroutines → client disconnects → all 5 must stop (prevent resource waste).
- **Level 2**: Tree-structured cancellation — parent cancel cascades to all children via `Done()` channel.
- **Level 3**: `context.Value` carries request-scoped data (trace ID, auth token) without parameter explosion.

**Common Mistakes / Lỗi Thường Gặp:**

- ❌ Using `context.Value` as dependency injection (meant for request-scoped metadata only)
- ❌ Forgetting `defer cancel()` → context leak (holds resources until parent dies)
- ❌ Storing context in struct fields — context is per-request, pass as first parameter

**🎯 Interview Pattern**: Why context exists → WithCancel/WithTimeout → Cascading cancellation mechanism → Best practices (first param, defer cancel)

**🔗 Knowledge Chain**: `request lifecycle` → `context tree` → `cancellation propagation` → `graceful shutdown` → `distributed tracing`

---

### Concept 7: Concurrency Patterns

> 🧠 **Memory Hook**: "**PFWSP** — Pipeline, Fan-out/in, Worker pool, Semaphore, Pub/Sub" (5 production patterns).

**Why This Exists / Tại Sao Tồn Tại:**

- **Level 1**: Reusable solutions to recurring concurrent problems (like design patterns but for concurrency).
- **Level 2**: Patterns compose — Pipeline + Worker Pool + Context = production-grade data processing.

**Common Mistakes / Lỗi Thường Gặp:**

- ❌ Over-engineering — using Worker Pool when simple goroutine + WaitGroup suffices
- ❌ Wrong pool size — CPU-bound: `GOMAXPROCS`, I/O-bound: higher (100-1000)
- ❌ Missing cancellation in patterns — every pattern must respect `ctx.Done()`

**🎯 Interview Pattern**: Name pattern → Draw data flow diagram → Code skeleton → Production considerations (error handling, cancellation, backpressure)

**🔗 Knowledge Chain**: `basic channel ops` → `patterns (pipeline, fan-out)` → `errgroup/singleflight` → `system design (rate limiter, crawler)`

---

## 1. Concurrency vs Parallelism

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1: Phân biệt concurrency và parallelism theo Rob Pike? 🟢 🟢 [Junior]

**A:**

Rob Pike (đồng tác giả Go): _"Concurrency is about dealing with lots of things at once. Parallelism is about doing lots of things at once."_

| Aspect     | Concurrency                                        | Parallelism                                           |
| ---------- | -------------------------------------------------- | ----------------------------------------------------- |
| Định nghĩa | **Cấu trúc** chương trình thành các tác vụ độc lập | **Thực thi** nhiều tác vụ đồng thời trên nhiều CPU    |
| Ẩn dụ      | Một người bồi bàn phục vụ nhiều bàn (switching)    | Nhiều người bồi bàn, mỗi người một bàn                |
| Yêu cầu HW | 1 CPU core vẫn concurrent được                     | Cần ≥ 2 CPU cores                                     |
| Mục tiêu   | **Thiết kế** tốt, dễ quản lý                       | **Tốc độ** thực thi                                   |
| Trong Go   | goroutines + channels                              | GOMAXPROCS > 1, goroutines chạy trên nhiều OS threads |

**Key insight**: Concurrency là **prerequisite** cho parallelism, nhưng concurrent program không nhất thiết chạy parallel. Trên máy 1 core, Go vẫn concurrent (scheduler time-slices giữa goroutines) nhưng không parallel.

---

### Q2: Go theo mô hình CSP — CSP là gì? 🟡 🟡 [Mid]

**A:**

**CSP** = Communicating Sequential Processes, lý thuyết của Tony Hoare (1978).

Ý tưởng cốt lõi: các **process độc lập** giao tiếp qua **message passing** thay vì shared memory.

Go triển khai CSP qua:

- **Goroutines** = sequential processes
- **Channels** = communication primitives (typed message pipes)

**Câu thần chú của Go**: _"Don't communicate by sharing memory; share memory by communicating."_

| Approach          | Shared Memory (Java/C++)        | Message Passing (Go CSP)         |
| ----------------- | ------------------------------- | -------------------------------- |
| Cách chia sẻ data | Nhiều thread truy cập cùng biến | Gửi copy/ownership qua channel   |
| Đồng bộ           | Mutex, semaphore, CAS           | Channel send/receive tự đồng bộ  |
| Dễ sai            | Data race, deadlock phức tạp    | Deadlock đơn giản hơn, dễ reason |
| Mental model      | Lock rồi mới truy cập           | Ai giữ data thì mới truy cập     |

> **Lưu ý**: Go vẫn có `sync.Mutex` — CSP không phải dogma. Dùng mutex khi protecting internal state đơn giản, dùng channel khi coordinating giữa goroutines.

---

## 2. Goroutines — Deep Theory

### Q3: Goroutine là gì? So sánh chi tiết với OS thread? 🔴 🔴 [Senior]

**A:**

Goroutine là **lightweight, user-space thread** được quản lý bởi Go runtime scheduler (không phải OS).

**Bảng so sánh chi tiết:**

| Aspect                  | OS Thread                                                        | Goroutine                                                          |
| ----------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Quản lý bởi**         | OS kernel                                                        | Go runtime scheduler                                               |
| **Stack size khởi tạo** | ~1-8 MB (fixed)                                                  | **2 KB** (growable)                                                |
| **Stack growth**        | Fixed, stack overflow → crash                                    | Dynamic, tự grow/shrink (tối đa ~1 GB)                             |
| **Chi phí tạo**         | ~1-10 μs (syscall)                                               | **~0.3 μs** (user-space allocation)                                |
| **Context switch**      | ~1-10 μs (kernel mode switch, save/restore registers, TLB flush) | **~0.2 μs** (user-space, chỉ save/restore 3 registers: PC, SP, DX) |
| **Số lượng thực tế**    | ~10K threads → OS chật vật                                       | **100K-1M goroutines** bình thường                                 |
| **Scheduling**          | Preemptive (OS quyết định)                                       | Cooperative + signal-based preemption (Go 1.14+)                   |
| **Identity**            | Có thread ID                                                     | **Không có** goroutine ID (by design)                              |
| **Memory overhead**     | ~1 MB+ per thread (stack + kernel structures)                    | ~4-8 KB per goroutine (stack + runtime structures)                 |

**Tại sao không có goroutine ID?**

- Tránh thread-local storage pattern (anti-pattern trong Go)
- Buộc developer pass data explicitly qua parameters/context
- Tránh lạm dụng goroutine identity cho logic control

**Growable stack cơ chế:**

1. Goroutine bắt đầu với 2 KB stack
2. Mỗi function call, compiler chèn **stack check prologue**
3. Nếu stack không đủ → runtime allocate stack mới gấp đôi → copy toàn bộ old stack → update pointers
4. Stack cũng có thể **shrink** khi GC phát hiện dùng < 1/4

---

### Q4: Goroutine lifecycle và các trạng thái? 🟡 🟡 [Mid]

**A:**

```
                    ┌──────────┐
         go func() │ _Grunnable│ ← mới tạo, chờ được schedule
                    └─────┬────┘
                          │ scheduler picks
                          ▼
                    ┌──────────┐
                    │ _Grunning │ ← đang chạy trên M (OS thread)
                    └──┬───┬───┘
                       │   │
          channel/IO/  │   │ function returns
          syscall      │   │
                       ▼   ▼
                 ┌──────────┐  ┌───────┐
                 │ _Gwaiting │  │ _Gdead │ ← kết thúc, có thể reuse
                 └─────┬────┘  └───────┘
                       │
                       │ event ready
                       ▼
                 ┌──────────┐
                 │_Grunnable │ ← quay lại hàng đợi
                 └──────────┘
```

Các trạng thái chính trong runtime:

- **\_Gidle**: goroutine mới allocated, chưa sử dụng
- **\_Grunnable**: trong run queue, chờ được chạy
- **\_Grunning**: đang thực thi trên M, được gán P
- **\_Gsyscall**: đang trong syscall, M bị block
- **\_Gwaiting**: bị block (channel, IO, sleep, mutex...)
- **\_Gdead**: đã kết thúc, có thể được free cache reuse
- **\_Gpreempted**: bị preempt bởi signal (Go 1.14+)

---

### Q5: Goroutine leak là gì? Nguyên nhân và cách detect? 🔴 🔴 [Senior]

**A:**

**Goroutine leak** = goroutine được tạo nhưng không bao giờ kết thúc, chiếm memory mãi mãi. Đây là **memory leak phổ biến nhất trong Go**.

**Nguyên nhân thường gặp:**

| #   | Nguyên nhân                            | Ví dụ                                         |
| --- | -------------------------------------- | --------------------------------------------- |
| 1   | **Channel send không ai receive**      | `ch <- data` nhưng không goroutine nào đọc    |
| 2   | **Channel receive không ai send**      | `<-ch` nhưng không ai gửi và không close      |
| 3   | **Thiếu context cancellation**         | HTTP request không timeout, goroutine chờ mãi |
| 4   | **Infinite loop không exit condition** | `for { select { ... } }` thiếu done channel   |
| 5   | **Mutex deadlock**                     | Goroutine chờ lock mãi không có               |
| 6   | **Nil channel**                        | Send/receive trên nil channel block forever   |

```go
// BUG: goroutine leak — channel send nhưng function return sớm
func search(query string) string {
    ch := make(chan string)
    go func() {
        result := slowSearch(query)
        ch <- result // LEAK: nếu search() return trước khi goroutine send
    }()

    select {
    case r := <-ch:
        return r
    case <-time.After(100 * time.Millisecond):
        return "timeout" // goroutine vẫn đang chờ send → LEAK
    }
}

// FIX: dùng buffered channel size 1
func search(query string) string {
    ch := make(chan string, 1) // buffered — goroutine send rồi exit
    go func() {
        ch <- slowSearch(query) // không block dù không ai receive
    }()
    select {
    case r := <-ch:
        return r
    case <-time.After(100 * time.Millisecond):
        return "timeout"
    }
}
```

**Cách detect goroutine leak:**

1. **runtime.NumGoroutine()** — monitor số goroutine theo thời gian, nếu tăng liên tục → leak
2. **pprof** — `go tool pprof http://localhost:6060/debug/pprof/goroutine` → xem stack trace mỗi goroutine
3. **goleak** (Uber) — test package detect leaked goroutines sau mỗi test
4. **Prometheus metric** — export `go_goroutines` metric, alert khi vượt threshold

```go
// Dùng goleak trong test
import "go.uber.org/goleak"

func TestMain(m *testing.M) {
    goleak.VerifyTestMain(m)
}
```

---

## 3. Go Scheduler — GMP Model (DEEP DIVE)

### Q6: GMP Model là gì? Giải thích chi tiết từng thành phần? 🔴 🔴 [Senior]

**A:**

Go scheduler dùng mô hình **M:N threading**: multiplexes M goroutines lên N OS threads, thông qua P (logical processors).

**Ba thành phần:**

| Component | Tên đầy đủ              | Mô tả                                                                     |
| --------- | ----------------------- | ------------------------------------------------------------------------- |
| **G**     | Goroutine               | Đơn vị công việc, chứa stack, instruction pointer, state                  |
| **M**     | Machine (OS Thread)     | OS thread thực sự, thực thi code. Mỗi M phải gắn với 1 P để chạy G        |
| **P**     | Processor (Logical CPU) | Context cho scheduling. Số lượng P = GOMAXPROCS. Mỗi P có local run queue |

**ASCII Diagram — GMP Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                      Go Runtime Scheduler                    │
│                                                              │
│  ┌──────────────── Global Run Queue ──────────────────┐     │
│  │  [G7] [G8] [G9] [G10] ...                         │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌─── P0 ────────┐    ┌─── P1 ────────┐    ┌─── P2 ──┐    │
│  │ Local Queue:   │    │ Local Queue:   │    │ Local Q: │    │
│  │ [G3][G4][G5]   │    │ [G6]           │    │ (empty)  │    │
│  │                │    │                │    │          │    │
│  │ ┌──────────┐  │    │ ┌──────────┐  │    │ ┌──────┐ │    │
│  │ │ Current: │  │    │ │ Current: │  │    │ │ No G │ │    │
│  │ │   G1     │  │    │ │   G2     │  │    │ └──────┘ │    │
│  │ └────┬─────┘  │    │ └────┬─────┘  │    │    │     │    │
│  └──────┼────────┘    └──────┼────────┘    └────┼─────┘    │
│         │                    │                   │           │
│         ▼                    ▼                   ▼           │
│  ┌──────────┐        ┌──────────┐        ┌──────────┐      │
│  │   M0     │        │   M1     │        │   M2     │      │
│  │(OS Thrd) │        │(OS Thrd) │        │(OS Thrd) │      │
│  └────┬─────┘        └────┬─────┘        └────┬─────┘      │
│       │                   │                    │             │
└───────┼───────────────────┼────────────────────┼────────────┘
        │                   │                    │
        ▼                   ▼                    ▼
   ┌─────────┐        ┌─────────┐         ┌─────────┐
   │ CPU 0   │        │ CPU 1   │         │ CPU 2   │
   └─────────┘        └─────────┘         └─────────┘
```

---

### Q7: Scheduling cycle hoạt động như thế nào? 🔴 🔴 [Senior]

**A:**

**Flow khi `go func()` được gọi:**

1. Runtime tạo **G mới** (struct `g` trong runtime)
2. G được đặt vào **local run queue** của P hiện tại (P đang chạy goroutine gọi `go`)
3. Nếu local queue đầy (cap = 256) → chuyển nửa queue vào **global run queue**
4. Nếu có P rảnh (idle) → runtime **wake** 1 M để lấy P đó chạy G mới

**Schedule loop của mỗi M (runtime.schedule):**

```
schedule() {
    // 1. Kiểm tra GC STW (stop-the-world)
    // 2. Mỗi 61 tick → check global run queue (tránh starvation)
    // 3. Lấy G từ local run queue của P
    // 4. Nếu empty → findRunnable():
    //    a. Check local queue (lần nữa)
    //    b. Check global queue
    //    c. Check network poller
    //    d. Work stealing: random chọn P khác, steal 1/2 queue
    // 5. execute(G)
}
```

**Chi tiết từng bước findRunnable:**

| Priority | Source           | Mô tả                                            |
| -------- | ---------------- | ------------------------------------------------ |
| 1        | Local run queue  | Lấy G đầu tiên từ queue của P hiện tại           |
| 2        | Global run queue | Kiểm tra mỗi 61 ticks để tránh starvation        |
| 3        | Network poller   | Kiểm tra goroutines chờ I/O đã sẵn sàng chưa     |
| 4        | Work stealing    | Random chọn P khác, steal nửa local queue của nó |

---

### Q8: Work Stealing hoạt động như thế nào? 🔴 🔴 [Senior]

**A:**

**Work stealing** là cơ chế cân bằng tải giữa các P. Khi một P hết việc (local queue rỗng):

```
P2 (idle)          P0 (busy)           P1 (busy)
┌──────┐          ┌──────────────┐    ┌──────────┐
│empty │ ──steal→ │[G3][G4][G5]  │    │[G6][G7]  │
│      │          │[G8][G9][G10] │    │          │
└──────┘          └──────────────┘    └──────────┘

After stealing half from P0:
P2                 P0                  P1
┌──────────┐      ┌──────────┐       ┌──────────┐
│[G8][G9]  │      │[G3][G4]  │       │[G6][G7]  │
│[G10]     │      │[G5]      │       │          │
└──────────┘      └──────────┘       └──────────┘
```

**Quy trình:**

1. P2 phát hiện local queue rỗng
2. Random chọn 1 P khác (ví dụ P0)
3. Steal **nửa** local queue của P0 (giữ lại nửa cho P0)
4. Nếu steal thất bại (P0 cũng rỗng) → thử P khác, tối đa 4 lần
5. Nếu tất cả P đều rỗng → check global queue → check netpoller → M ngủ (park)

**Tại sao random chứ không round-robin?**

- Tránh contention: nếu nhiều P rảnh cùng lúc, random giúp phân tán steal target
- Đã chứng minh work stealing random đạt O(1) amortized overhead

---

### Q9: Syscall handling trong GMP? 🔴 🔴 [Senior]

**A:**

Khi goroutine gọi **blocking syscall** (file I/O, CGo), M bị block ở kernel:

```
Before syscall:                    During syscall:
┌─────┐                           ┌─────┐
│  P0 │──── M0 (running G1)      │  P0 │──── M2 (running G3) ← P0 detach, gắn M mới
└──┬──┘                           └─────┘
   │ local: [G3][G4]                        M0 (blocked in syscall with G1)
                                             │
                                             ▼
                                        [kernel I/O]

After syscall returns:
M0 wakes up with G1 → tries to acquire idle P
  → If P available: bind P, continue running G1
  → If no P available: put G1 to global queue, M0 goes to sleep (park)
```

**Quy trình chi tiết:**

1. G1 trên M0/P0 gọi syscall (ví dụ `file.Read()`)
2. Runtime gọi `entersyscall()`: M0 release P0, M0+G1 vào trạng thái syscall
3. **Sysmon** (system monitor goroutine) phát hiện P0 không có M → gắn P0 cho M mới (hoặc tạo M mới)
4. P0 lấy G3 từ local queue, tiếp tục chạy trên M mới
5. Syscall return → M0 gọi `exitsyscall()`:
   - Thử lấy lại P0 → nếu P0 busy → thử lấy idle P → nếu không có → G1 vào global queue, M0 park

**Sysmon** là special goroutine chạy trên dedicated M (không cần P):

- Chạy mỗi 10ms-10s (adaptive)
- Retake P từ M đang syscall quá lâu (>10ms)
- Trigger preemption cho goroutines chạy quá lâu
- Force GC nếu cần
- Flush network poller results

---

### Q10: Network Poller integration trong scheduler? 🔴 🔴 [Senior]

**A:**

Khác với blocking syscall, **network I/O** trong Go **không block M**. Go dùng OS-level I/O multiplexing:

- Linux: **epoll**
- macOS: **kqueue**
- Windows: **IOCP**

```
Goroutine G1 gọi conn.Read():
1. Runtime gọi epoll_ctl() đăng ký fd vào epoll
2. G1 trạng thái → _Gwaiting (park), P tiếp tục chạy G khác
3. Khi data đến, epoll_wait() trả về fd ready
4. Scheduler đưa G1 vào run queue → G1 tiếp tục đọc data

Timeline:
G1: [running]──[park on I/O]──────────────[resume, data ready]──[running]
G2: ────────────[running on same M/P]─────[preempt]─────────────
                                    ↑
                              netpoller wakes G1
```

**Key insight**: Đây là lý do Go HTTP server handle **10K+ concurrent connections** dễ dàng — mỗi connection 1 goroutine nhưng M/P rất ít (= GOMAXPROCS), network I/O không block M.

---

### Q11: Preemption trong Go — cooperative vs signal-based? 🔴 🔴 [Senior]

**A:**

**Trước Go 1.14 — Cooperative preemption:**

- Goroutine chỉ bị preempt tại **safe points**: function calls, channel ops, syscalls
- Vấn đề: tight loop **không có function call** → goroutine chiếm M mãi mãi

```go
// BUG trước Go 1.14: goroutine này KHÔNG BAO GIỜ bị preempt
go func() {
    for { // tight loop, no function calls
        i++
    }
}()
// Các goroutine khác trên cùng P bị starve!
```

**Từ Go 1.14+ — Signal-based (asynchronous) preemption:**

- Sysmon phát hiện goroutine chạy >10ms → gửi **SIGURG signal** tới M
- Signal handler inject preemption tại bất kỳ instruction nào (safe or not)
- Goroutine bị suspend, đặt lại vào run queue

| Aspect        | Cooperative (< 1.14)               | Signal-based (≥ 1.14)     |
| ------------- | ---------------------------------- | ------------------------- |
| Preempt tại   | Function call, channel, syscall    | Bất kỳ instruction nào    |
| Tight loop    | KHÔNG preempt được                 | Preempt được              |
| Overhead      | Zero (check tại function prologue) | Minimal (signal handling) |
| Latency bound | Không có guarantee                 | ~10-20ms worst case       |
| Signal dùng   | N/A                                | SIGURG                    |

**Tại sao chọn SIGURG?**

- Không conflict với signal thông dụng (SIGTERM, SIGINT...)
- Không bị default handler killed process
- Đã tồn tại nhưng rất hiếm dùng trong thực tế

---

### Q12: GOMAXPROCS là gì và ảnh hưởng thế nào? 🟡 🟡 [Mid]

**A:**

**GOMAXPROCS** = số lượng **P** (logical processors) = số OS threads tối đa có thể **đồng thời thực thi Go code**.

| GOMAXPROCS         | Ý nghĩa                                                         |
| ------------------ | --------------------------------------------------------------- |
| Default (= NumCPU) | Tận dụng tất cả CPU cores                                       |
| 1                  | Tất cả goroutines chạy trên 1 thread (concurrent, not parallel) |
| > NumCPU           | Không có lợi, thậm chí tăng contention                          |

**Lưu ý quan trọng:**

- GOMAXPROCS giới hạn P, **không** giới hạn M. Số M có thể lớn hơn nhiều (mỗi blocking syscall cần 1 M riêng)
- Default max M = 10,000 (tunable qua `runtime/debug.SetMaxThreads`)
- Trong container (Docker/K8s): Go runtime **không** tự detect CPU limit → cần `GOMAXPROCS` manual hoặc dùng `go.uber.org/automaxprocs`

```go
import _ "go.uber.org/automaxprocs" // auto-set GOMAXPROCS theo container CPU limit
```

---

## 4. Channels — Deep Theory

### Q13: Channel hoạt động bên trong như thế nào? (hchan struct) 🔴 🔴 [Senior]

**A:**

Channel trong Go được implement bởi struct `hchan` trong `runtime/chan.go`:

```
hchan struct {
    qcount   uint           // số phần tử hiện tại trong buffer
    dataqsiz uint           // kích thước buffer (0 = unbuffered)
    buf      unsafe.Pointer // circular buffer (ring buffer)
    elemsize uint16         // kích thước mỗi element
    closed   uint32         // 1 nếu channel đã close
    sendx    uint           // send index trong buffer
    recvx    uint           // receive index trong buffer
    recvq    waitq          // danh sách goroutines đang chờ receive (linked list of sudog)
    sendq    waitq          // danh sách goroutines đang chờ send
    lock     mutex          // protects tất cả fields ở trên
}
```

```
Buffered channel (size 3):
┌─────────────────────────────────┐
│           hchan                  │
│  ┌─────────────────────────┐    │
│  │ buf (ring buffer):      │    │
│  │ [val1] [val2] [   ]     │    │
│  │   ↑recvx       ↑sendx   │    │
│  └─────────────────────────┘    │
│                                  │
│  sendq: (empty — buffer chưa đầy)│
│  recvq: (empty — buffer có data) │
│  lock: mutex                     │
└─────────────────────────────────┘

Unbuffered channel:
┌─────────────────────────────────┐
│           hchan                  │
│  buf: nil, dataqsiz: 0          │
│                                  │
│  sendq: [G1 waiting to send]    │
│  recvq: (empty)                  │
│  → G1 blocked until receiver    │
└─────────────────────────────────┘
```

**Cơ chế send trên buffered channel:**

1. Lock hchan
2. Nếu có goroutine trong `recvq` → **trực tiếp copy data** vào stack goroutine receiver → wake receiver (bypass buffer)
3. Nếu buffer chưa đầy → copy data vào `buf[sendx]`, tăng sendx
4. Nếu buffer đầy → sender goroutine vào `sendq`, park (block)
5. Unlock

**Cơ chế receive:**

1. Lock hchan
2. Nếu có goroutine trong `sendq`:
   - Buffered: lấy từ `buf[recvx]`, copy sender data vào buf → wake sender
   - Unbuffered: copy trực tiếp từ sender stack → wake sender
3. Nếu buffer có data → lấy từ `buf[recvx]`
4. Nếu buffer rỗng → receiver vào `recvq`, park (block)
5. Unlock

---

### Q14: Bảng tổng hợp channel behaviors (Channel Axioms)? 🔴 🔴 [Senior]

**A:**

| Operation            | Unbuffered `ch`              | Buffered `ch` (not full/empty)          | Buffered `ch` (full)  | Buffered `ch` (empty) | Nil channel       | Closed channel               |
| -------------------- | ---------------------------- | --------------------------------------- | --------------------- | --------------------- | ----------------- | ---------------------------- |
| **`ch <- v`** (send) | Block đến khi receiver ready | Không block, ghi vào buffer             | Block đến khi có slot | Không block           | **Block forever** | **panic**                    |
| **`<-ch`** (receive) | Block đến khi sender ready   | Không block, đọc từ buffer              | Không block           | Block đến khi có data | **Block forever** | Trả **zero value** + `false` |
| **`close(ch)`**      | OK                           | OK (data còn trong buffer vẫn đọc được) | OK                    | OK                    | **panic**         | **panic**                    |
| **`len(ch)`**        | 0                            | Số items trong buffer                   | cap(ch)               | 0                     | 0                 | items remaining              |

**Những điều PHẢI nhớ (hay hỏi phỏng vấn):**

1. **Send to closed channel → panic** (không recovery được nếu không dùng defer/recover)
2. **Receive from closed channel → zero value immediately** (không block)
3. **Send/receive on nil channel → block forever** (dùng trong select để disable case)
4. **Close nil channel → panic**
5. **Double close → panic**
6. Chỉ **sender** nên close channel, không bao giờ receiver close

```go
// Idiom: range over channel (tự dừng khi channel closed)
for val := range ch {
    process(val) // loop kết thúc khi ch closed VÀ buffer rỗng
}

// Idiom: comma-ok để kiểm tra channel đã close chưa
val, ok := <-ch
if !ok {
    // channel closed
}
```

---

### Q15: Unbuffered vs Buffered channel — khi nào dùng gì? 🟡 🟡 [Mid]

**A:**

| Aspect          | Unbuffered (`make(chan T)`)                          | Buffered (`make(chan T, n)`)                       |
| --------------- | ---------------------------------------------------- | -------------------------------------------------- |
| Synchronization | **Synchronous** — sender block đến khi receiver nhận | **Asynchronous** (đến khi full)                    |
| Guarantee       | Sender biết chắc receiver đã nhận data               | Sender chỉ biết data vào buffer, chưa chắc ai nhận |
| Use case        | Signal, handoff, rendezvous point                    | Decouple producer/consumer tốc độ khác nhau        |
| Performance     | Chậm hơn (phải đợi nhau)                             | Nhanh hơn (burst handling)                         |
| Analogy         | Đưa đồ tay-tay (handshake)                           | Bỏ đồ vào hộp thư (mailbox)                        |

**Khi nào dùng unbuffered:**

- Signal/notification (done channel): `done := make(chan struct{})`
- Guarantee delivery: muốn chắc data đã được xử lý
- Synchronization point giữa 2 goroutines

**Khi nào dùng buffered:**

- Producer nhanh hơn consumer tạm thời (burst absorbing)
- Semaphore pattern: `sem := make(chan struct{}, maxConcurrency)`
- Pipeline stages có throughput khác nhau
- Avoid goroutine leak (buffer size 1 cho fire-and-forget)

---

### Q16: Directional channels là gì? 🟢 🟢 [Junior]

**A:**

Go cho phép khai báo channel chỉ gửi hoặc chỉ nhận — **compile-time safety:**

```go
func producer(out chan<- int) { // send-only: chỉ được gửi
    out <- 42
    // <-out  // compile error!
}

func consumer(in <-chan int) { // receive-only: chỉ được nhận
    val := <-in
    // in <- 1  // compile error!
}

func main() {
    ch := make(chan int) // bidirectional
    go producer(ch)      // implicit conversion: chan → chan<-
    go consumer(ch)      // implicit conversion: chan → <-chan
}
```

**Quy tắc conversion:**

- `chan T` → `chan<- T` ✅ (bidirectional → send-only)
- `chan T` → `<-chan T` ✅ (bidirectional → receive-only)
- `chan<- T` → `chan T` ❌ (send-only → bidirectional)
- `<-chan T` → `chan T` ❌ (receive-only → bidirectional)

---

## 5. Select Statement

### Q17: Select hoạt động như thế nào? 🟡 🟡 [Mid]

**A:**

`select` là **multiplexer cho channels** — chờ nhiều channel operations đồng thời, thực thi case nào ready trước.

**Hành vi chi tiết:**

| Tình huống                            | Hành vi                                           |
| ------------------------------------- | ------------------------------------------------- |
| 1 case ready                          | Thực thi case đó                                  |
| Nhiều cases ready                     | **Random chọn 1** (không phải top-down!)          |
| Không case nào ready, có `default`    | Thực thi `default` (non-blocking)                 |
| Không case nào ready, không `default` | **Block** đến khi 1 case ready                    |
| Empty `select{}`                      | **Block forever** (hữu ích để giữ main goroutine) |

**Tại sao random selection?**

- Tránh starvation: nếu deterministic (luôn chọn case đầu), case cuối có thể không bao giờ được chọn
- Fairness guarantee giữa các channels

```go
// Pattern: timeout
select {
case result := <-ch:
    fmt.Println(result)
case <-time.After(3 * time.Second):
    fmt.Println("timeout!")
}

// Pattern: non-blocking send/receive
select {
case ch <- data:
    // sent
default:
    // channel full hoặc không ai receive → drop
}

// Pattern: done channel for cancellation
select {
case data := <-workCh:
    process(data)
case <-done:
    return // cancelled
}
```

---

## 6. sync Package

### Q18: Mutex vs RWMutex — khi nào dùng gì? 🟡 🟡 [Mid]

**A:**

| Aspect           | `sync.Mutex`                           | `sync.RWMutex`                        |
| ---------------- | -------------------------------------- | ------------------------------------- |
| Lock modes       | 1: exclusive                           | 2: shared read + exclusive write      |
| Read concurrent  | ❌ Chỉ 1 goroutine vào                 | ✅ Nhiều readers đồng thời            |
| Write concurrent | ❌                                     | ❌ (exclusive)                        |
| Overhead         | Thấp hơn                               | Cao hơn (quản lý reader count)        |
| Khi nào dùng     | Write-heavy hoặc critical section ngắn | **Read-heavy** (nhiều read, ít write) |

**Quy tắc chọn:**

- Nếu **read:write ≥ 10:1** → RWMutex có lợi
- Nếu critical section < 100ns → Mutex (overhead RWMutex không đáng)
- Nếu nghi ngờ → benchmark, đừng đoán

```go
type SafeMap struct {
    mu   sync.RWMutex
    data map[string]string
}

func (m *SafeMap) Get(key string) string {
    m.mu.RLock()         // shared lock — nhiều goroutines đọc cùng lúc
    defer m.mu.RUnlock()
    return m.data[key]
}

func (m *SafeMap) Set(key, val string) {
    m.mu.Lock()          // exclusive lock — chỉ 1 goroutine write
    defer m.mu.Unlock()
    m.data[key] = val
}
```

**Lưu ý quan trọng:**

- **Mutex không reentrant** trong Go: cùng 1 goroutine Lock() 2 lần → deadlock
- **Không copy Mutex** sau khi sử dụng (dùng `go vet` để detect)
- Defer Unlock() để tránh quên unlock khi panic

---

### Q19: sync.WaitGroup, sync.Once, sync.Pool — giải thích? 🟡 🟡 [Mid]

**A:**

**sync.WaitGroup** — chờ N goroutines hoàn thành:

```go
var wg sync.WaitGroup
for i := 0; i < 10; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done() // Done = Add(-1)
        doWork(id)
    }(i)
}
wg.Wait() // block đến khi counter = 0
```

**Lỗi hay gặp:** `wg.Add(1)` phải gọi **trước** `go func()`, không phải bên trong goroutine. Nếu gọi trong goroutine, `wg.Wait()` có thể return trước khi Add được gọi.

---

**sync.Once** — thực thi function đúng 1 lần (thread-safe singleton):

```go
var (
    instance *Database
    once     sync.Once
)

func GetDB() *Database {
    once.Do(func() {
        instance = connectDB() // chỉ chạy 1 lần dù 1000 goroutines gọi
    })
    return instance
}
```

Bên trong: dùng `atomic` check fast path + `Mutex` cho slow path. Nếu `f()` panic, Once vẫn coi là "done" — các lần gọi sau **không retry**.

---

**sync.Pool** — object reuse pool, giảm GC pressure:

```go
var bufPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func handler(w http.ResponseWriter, r *http.Request) {
    buf := bufPool.Get().(*bytes.Buffer)
    buf.Reset()
    defer bufPool.Put(buf) // trả lại pool

    buf.WriteString("response data")
    w.Write(buf.Bytes())
}
```

| Đặc điểm Pool  | Mô tả                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------- |
| GC interaction | Pool bị **drain toàn bộ** mỗi lần GC chạy (Go 1.12-). Từ Go 1.13+: victim cache, survive 1 GC cycle |
| Thread-safe    | Có, nội bộ dùng per-P local pool + shared pool                                                      |
| Use case       | Temporary objects: buffers, encoders, heavy structs                                                 |
| KHÔNG dùng cho | Connection pools, limited resources (dùng channel-based pool)                                       |

---

### Q20: sync.Cond và sync.Map — khi nào cần? 🟡 🟡 [Mid]

**A:**

**sync.Cond** — condition variable, notify goroutines khi điều kiện thay đổi:

```go
cond := sync.NewCond(&sync.Mutex{})

// Waiter goroutine:
cond.L.Lock()
for !condition() { // PHẢI dùng for loop, không dùng if (spurious wakeup)
    cond.Wait()    // unlock → sleep → lock khi woken
}
// condition is true, do work
cond.L.Unlock()

// Notifier:
cond.L.Lock()
updateCondition()
cond.Signal()    // wake 1 waiter
// cond.Broadcast() // wake ALL waiters
cond.L.Unlock()
```

Rất hiếm dùng trong Go — channel thường thay thế được. Cond hữu ích khi: multiple waiters cần wake on same condition, và channel-based solution quá phức tạp.

---

**sync.Map** — concurrent map, KHÔNG cần external lock:

| Khi nào dùng sync.Map                         | Khi nào dùng map + RWMutex           |
| --------------------------------------------- | ------------------------------------ |
| Key set ổn định, chủ yếu **read**             | Key set thay đổi liên tục            |
| Nhiều goroutines read/write **disjoint keys** | Cần iterate toàn bộ map thường xuyên |
| Cache-like workload                           | Cần typed keys/values (generics)     |

```go
var cache sync.Map

cache.Store("key", "value")
val, ok := cache.Load("key")
cache.Delete("key")
cache.Range(func(k, v interface{}) bool {
    // iterate — KHÔNG guarantee snapshot
    return true // continue
})
```

Bên trong: sync.Map dùng 2 maps — `read` (atomic, lock-free) và `dirty` (mutex-protected). Reads từ `read` map không cần lock. Writes vào `dirty`, promote to `read` khi miss count > len(dirty).

---

## 7. Context Package

### Q21: Context tồn tại để giải quyết vấn đề gì? 🟡 🟡 [Mid]

**A:**

**Vấn đề**: Trong microservices, 1 request tạo ra hàng chục goroutines (DB query, RPC calls, cache...). Khi client disconnect hoặc timeout → cần **cancel tất cả** goroutines liên quan để tránh lãng phí resource.

**Context cung cấp:**

1. **Cancellation propagation** — cancel parent → tất cả children tự cancel
2. **Deadline/Timeout** — tự động cancel sau thời gian
3. **Request-scoped values** — truyền metadata (request ID, auth token)

```
Client Request
    │
    ▼
[HTTP Handler] ← ctx with timeout 5s
    │
    ├──→ [DB Query] ← child ctx, inherits 5s deadline
    │        │
    │        └──→ [Connection Pool] ← grandchild ctx
    │
    ├──→ [RPC to Service B] ← child ctx
    │        │
    │        └──→ [Cache Lookup] ← grandchild ctx
    │
    └──→ [Log Async] ← child ctx

Nếu client cancel → TẤT CẢ nodes trong tree nhận cancel signal
```

---

### Q22: Các loại Context và cách sử dụng? 🟡 🟡 [Mid]

**A:**

| Function                          | Mô tả                                      | Khi nào dùng                         |
| --------------------------------- | ------------------------------------------ | ------------------------------------ |
| `context.Background()`            | Root context, không cancel, không deadline | Entry point: main(), init(), test    |
| `context.TODO()`                  | Placeholder khi chưa biết dùng context gì  | Refactoring code cũ, temporary       |
| `context.WithCancel(parent)`      | Cancel manually                            | Khi cần cancel goroutines explicitly |
| `context.WithTimeout(parent, d)`  | Auto-cancel sau duration                   | HTTP client calls, DB queries        |
| `context.WithDeadline(parent, t)` | Auto-cancel tại time point                 | SLA deadlines, batch jobs            |
| `context.WithValue(parent, k, v)` | Attach key-value                           | Request ID, auth info, trace span    |

```go
// WithCancel — manual cancellation
ctx, cancel := context.WithCancel(context.Background())
defer cancel() // LUÔN LUÔN defer cancel() để tránh leak

go func() {
    select {
    case <-ctx.Done():
        fmt.Println("cancelled:", ctx.Err()) // context.Canceled
        return
    case result := <-doWork():
        fmt.Println(result)
    }
}()

// Khi muốn cancel:
cancel() // tất cả goroutines listening ctx.Done() sẽ nhận signal

// WithTimeout
ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
defer cancel()

result, err := db.QueryContext(ctx, "SELECT ...") // tự cancel sau 3s
```

**Cancellation cascade — child context:**

```go
parentCtx, parentCancel := context.WithTimeout(ctx, 10*time.Second)
childCtx, childCancel := context.WithTimeout(parentCtx, 5*time.Second)

// childCtx deadline = min(parent 10s, child 5s) = 5s
// Cancel parent → child cũng cancel
// Cancel child → parent KHÔNG bị cancel
```

---

### Q23: Context best practices? 🟡 🟡 [Mid]

**A:**

| Rule                                        | Giải thích                                                                   |
| ------------------------------------------- | ---------------------------------------------------------------------------- |
| **Context là parameter đầu tiên**           | `func DoSomething(ctx context.Context, arg int)` — convention toàn ecosystem |
| **Không store context trong struct**        | Context có lifecycle ngắn (per-request), struct có lifecycle dài → mismatch  |
| **Luôn defer cancel()**                     | Tránh resource leak (timer, goroutine) dù function return sớm                |
| **Không dùng WithValue cho business logic** | Chỉ dùng cho request-scoped metadata (traceID, auth). Type-safe key!         |
| **Không pass nil context**                  | Dùng `context.TODO()` nếu chưa biết                                          |
| **Check ctx.Err() trong long operations**   | Trong loop dài, check `ctx.Err() != nil` để bail out sớm                     |

```go
// WithValue — type-safe key pattern
type contextKey string
const requestIDKey contextKey = "requestID"

func WithRequestID(ctx context.Context, id string) context.Context {
    return context.WithValue(ctx, requestIDKey, id)
}

func GetRequestID(ctx context.Context) string {
    id, _ := ctx.Value(requestIDKey).(string)
    return id
}
```

---

## 8. Concurrency Patterns (DEEP)

### Q24: Fan-out / Fan-in pattern? 🔴 🔴 [Senior]

**A:**

**Fan-out**: phân phối work từ 1 source tới nhiều goroutines.
**Fan-in**: gom kết quả từ nhiều goroutines vào 1 channel.

```
Fan-out:                    Fan-in:
              ┌→ worker1 ─┐
    source ───┼→ worker2 ─┼──→ collector
              └→ worker3 ─┘
```

```go
func fanOut(input <-chan int, workers int) []<-chan int {
    channels := make([]<-chan int, workers)
    for i := 0; i < workers; i++ {
        channels[i] = worker(input) // mỗi worker đọc cùng input channel
    }
    return channels
}

func fanIn(channels ...<-chan int) <-chan int {
    var wg sync.WaitGroup
    merged := make(chan int)

    for _, ch := range channels {
        wg.Add(1)
        go func(c <-chan int) {
            defer wg.Done()
            for val := range c {
                merged <- val
            }
        }(ch)
    }

    go func() {
        wg.Wait()
        close(merged)
    }()
    return merged
}
```

**Use case**: Nhiều API calls cùng lúc, aggregate results (search nhiều backends).

---

### Q25: Worker Pool pattern? 🔴 🔴 [Senior]

**A:**

Bounded concurrency — giới hạn số goroutines chạy đồng thời. Tránh tạo quá nhiều goroutines gây resource exhaustion.

```go
func workerPool(jobs <-chan Job, results chan<- Result, numWorkers int) {
    var wg sync.WaitGroup
    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            for job := range jobs { // worker lấy job từ shared channel
                results <- process(job)
            }
        }(i)
    }

    go func() {
        wg.Wait()
        close(results)
    }()
}

// Usage
jobs := make(chan Job, 100)    // buffered cho burst
results := make(chan Result, 100)
workerPool(jobs, results, 10)  // 10 workers

for _, j := range allJobs {
    jobs <- j
}
close(jobs) // signal workers to stop

for r := range results {
    handleResult(r)
}
```

---

### Q26: Pipeline pattern? 🟡 🟡 [Mid]

**A:**

Chuỗi các **stages**, mỗi stage là goroutine(s) connected bởi channels. Data flows: stage1 → stage2 → stage3.

```go
// Stage 1: Generate numbers
func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range nums {
            out <- n
        }
    }()
    return out
}

// Stage 2: Square each number
func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            out <- n * n
        }
    }()
    return out
}

// Stage 3: Filter (only even)
func filterEven(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            if n%2 == 0 {
                out <- n
            }
        }
    }()
    return out
}

// Compose pipeline
result := filterEven(square(generate(1, 2, 3, 4, 5)))
for v := range result {
    fmt.Println(v) // 4, 16
}
```

**Cancellation trong pipeline**: truyền `done` channel hoặc `context.Context` vào mỗi stage.

---

### Q27: Semaphore, Rate Limiter, Generator patterns? 🟡 🟡 [Mid]

**A:**

**Semaphore** — buffered channel làm counting semaphore:

```go
sem := make(chan struct{}, 10) // max 10 concurrent

for _, url := range urls {
    sem <- struct{}{} // acquire (block nếu đã 10)
    go func(u string) {
        defer func() { <-sem }() // release
        fetch(u)
    }(url)
}
```

---

**Rate Limiter** — `time.Ticker` giới hạn throughput:

```go
// 10 requests per second
limiter := time.NewTicker(100 * time.Millisecond) // 1 token mỗi 100ms
defer limiter.Stop()

for req := range requests {
    <-limiter.C // chờ token
    go handle(req)
}

// Burst rate limiter: buffered channel pre-filled
burstyLimiter := make(chan time.Time, 3) // burst of 3
for i := 0; i < 3; i++ {
    burstyLimiter <- time.Now() // pre-fill
}
go func() {
    for t := range time.Tick(200 * time.Millisecond) {
        burstyLimiter <- t // refill
    }
}()
```

---

**Generator** — function trả về read-only channel:

```go
func fibonacci() <-chan int {
    ch := make(chan int)
    go func() {
        defer close(ch)
        a, b := 0, 1
        for i := 0; i < 100; i++ {
            ch <- a
            a, b = b, a+b
        }
    }()
    return ch
}

for n := range fibonacci() {
    fmt.Println(n)
}
```

---

### Q28: Or-channel, errgroup, singleflight? 🔴 🔴 [Senior]

**A:**

**Or-channel** — trả về khi **bất kỳ** done channel nào close (first-one-wins):

```go
func or(channels ...<-chan struct{}) <-chan struct{} {
    switch len(channels) {
    case 0:
        return nil
    case 1:
        return channels[0]
    }

    orDone := make(chan struct{})
    go func() {
        defer close(orDone)
        switch len(channels) {
        case 2:
            select {
            case <-channels[0]:
            case <-channels[1]:
            }
        default:
            select {
            case <-channels[0]:
            case <-channels[1]:
            case <-channels[2]:
            case <-or(append(channels[3:], orDone)...): // recursive
            }
        }
    }()
    return orDone
}
```

---

**errgroup** (`golang.org/x/sync/errgroup`) — WaitGroup + error handling:

```go
g, ctx := errgroup.WithContext(context.Background())

g.Go(func() error {
    return fetchUserProfile(ctx, userID)
})
g.Go(func() error {
    return fetchUserOrders(ctx, userID)
})
g.Go(func() error {
    return fetchUserPreferences(ctx, userID)
})

if err := g.Wait(); err != nil {
    // trả về error ĐẦU TIÊN
    // ctx tự cancel → các goroutines khác nhận cancel signal
    log.Fatal(err)
}
```

`errgroup.SetLimit(n)` — giới hạn concurrency (Go 1.20+).

---

**singleflight** (`golang.org/x/sync/singleflight`) — deduplicate concurrent calls cùng key:

```go
var group singleflight.Group

func getUser(id string) (*User, error) {
    // Nếu 100 goroutines gọi getUser("123") cùng lúc
    // → chỉ 1 goroutine thực sự gọi DB, 99 goroutines chờ kết quả
    result, err, shared := group.Do("user:"+id, func() (interface{}, error) {
        return db.QueryUser(id) // chỉ chạy 1 lần
    })
    // shared = true nếu result được chia sẻ với goroutines khác
    return result.(*User), err
}
```

**Use case nổi bật**: Cache stampede prevention — khi cache expire, hàng trăm requests đồng thời gọi DB → singleflight chỉ cho 1 request qua.

---

### Q29: Pub/Sub pattern trong Go? 🟡 🟡 [Mid]

**A:**

```go
type Broker struct {
    mu          sync.RWMutex
    subscribers map[string][]chan interface{}
}

func (b *Broker) Subscribe(topic string) <-chan interface{} {
    b.mu.Lock()
    defer b.mu.Unlock()

    ch := make(chan interface{}, 16) // buffered tránh slow subscriber block publisher
    b.subscribers[topic] = append(b.subscribers[topic], ch)
    return ch
}

func (b *Broker) Publish(topic string, msg interface{}) {
    b.mu.RLock()
    defer b.mu.RUnlock()

    for _, ch := range b.subscribers[topic] {
        select {
        case ch <- msg:
        default:
            // subscriber too slow, drop message (hoặc log warning)
        }
    }
}

func (b *Broker) Unsubscribe(topic string, sub <-chan interface{}) {
    b.mu.Lock()
    defer b.mu.Unlock()
    // remove sub from b.subscribers[topic] và close channel
}
```

**Production**: dùng library chuyên dụng (NATS, Redis Pub/Sub) — pattern trên chỉ minh họa concept.

---

## 9. Race Conditions

### Q30: Data race là gì? Cách detect? 🔴 🔴 [Senior]

**A:**

**Data race** xảy ra khi ≥ 2 goroutines truy cập cùng memory location **đồng thời**, và ít nhất 1 là **write**, mà **không có synchronization**.

```go
// DATA RACE — counter không chính xác
var counter int

for i := 0; i < 1000; i++ {
    go func() {
        counter++ // READ counter → ADD 1 → WRITE counter (3 steps, not atomic!)
    }()
}
// counter có thể < 1000 do lost updates
```

**Detect bằng Race Detector:**

```bash
go run -race main.go
go test -race ./...
go build -race -o myapp    # build với race detector, dùng cho staging
```

Race detector dùng **ThreadSanitizer** (Google) — track mọi memory access, report khi phát hiện data race. Overhead ~2-10x CPU, ~5-10x memory → **chỉ dùng cho testing/staging, KHÔNG production**.

**Những pattern hay gây race:**

| Pattern                                                         | Vấn đề                                       | Fix                               |
| --------------------------------------------------------------- | -------------------------------------------- | --------------------------------- |
| `counter++` trong nhiều goroutines                              | Read-modify-write không atomic               | `atomic.AddInt64` hoặc `Mutex`    |
| `map` concurrent read/write                                     | Go map không thread-safe                     | `sync.Map` hoặc `map` + `RWMutex` |
| Slice append từ nhiều goroutines                                | Slice header bị race                         | Mutex protect hoặc channel        |
| Read struct field trong 1 goroutine, write trong goroutine khác | Partial read                                 | Mutex hoặc atomic                 |
| `time.After` trong loop                                         | Timer leak (không phải race, nhưng hay nhầm) | `time.NewTimer` + Reset           |

```go
// FIX 1: Mutex
var mu sync.Mutex
mu.Lock()
counter++
mu.Unlock()

// FIX 2: Atomic (nhanh hơn, cho operation đơn giản)
var counter int64
atomic.AddInt64(&counter, 1)

// FIX 3: Channel (CSP style)
counterCh := make(chan int)
go func() {
    count := 0
    for delta := range counterCh {
        count += delta
    }
}()
counterCh <- 1 // increment
```

---

## 10. Deadlock

### Q31: Các pattern deadlock phổ biến trong Go? 🔴 🔴 [Senior]

**A:**

**Deadlock** = tất cả goroutines bị block, không ai có thể tiến lên. Go runtime detect khi **ALL** goroutines asleep → `fatal error: all goroutines are asleep - deadlock!`

**Pattern 1: Unbuffered channel — send nhưng không ai receive**

```go
func main() {
    ch := make(chan int)
    ch <- 1 // DEADLOCK: main goroutine block, không goroutine khác để receive
}
```

**Pattern 2: Circular wait giữa 2 channels**

```go
ch1 := make(chan int)
ch2 := make(chan int)

go func() {
    val := <-ch1 // chờ ch1
    ch2 <- val   // rồi mới send ch2
}()

val := <-ch2 // chờ ch2
ch1 <- val   // rồi mới send ch1
// DEADLOCK: goroutine 1 chờ ch1, main chờ ch2 → circular
```

**Pattern 3: Lock ordering — mutex A rồi B vs B rồi A**

```go
var muA, muB sync.Mutex

// Goroutine 1:          // Goroutine 2:
muA.Lock()               muB.Lock()    // ← opposite order
muB.Lock() // wait B     muA.Lock()    // wait A → DEADLOCK
```

**Fix:** Luôn lock theo **thứ tự cố định** (alphabetical, by address, by level).

**Pattern 4: Self-deadlock (non-reentrant mutex)**

```go
var mu sync.Mutex

func A() {
    mu.Lock()
    defer mu.Unlock()
    B() // gọi B trong khi đang giữ mu
}

func B() {
    mu.Lock()    // DEADLOCK: cùng goroutine lock lần 2
    defer mu.Unlock()
}
```

**Lưu ý**: Go runtime chỉ detect deadlock khi **TẤT CẢ** goroutines bị block. Nếu có 1 goroutine vẫn chạy (ví dụ HTTP server), runtime KHÔNG detect → deadlock âm thầm, goroutines leak dần.

---

## 11. atomic Package

### Q32: Khi nào dùng atomic thay vì mutex? 🟡 🟡 [Mid]

**A:**

| Aspect        | `sync/atomic`                               | `sync.Mutex`                           |
| ------------- | ------------------------------------------- | -------------------------------------- |
| Use case      | **Single variable** operations              | **Multiple variables** / complex logic |
| Performance   | Lock-free, ~1-5ns                           | ~20-50ns (lock overhead)               |
| Operations    | Load, Store, Add, CAS, Swap                 | Arbitrary code block                   |
| Compose       | Không compose được (mỗi op atomic riêng lẻ) | Compose: lock → do nhiều thứ → unlock  |
| Deadlock risk | Không                                       | Có                                     |

**Quy tắc**: Dùng atomic khi chỉ thao tác **1 biến đơn** (counter, flag, pointer). Dùng mutex khi cần **consistency giữa nhiều biến**.

```go
// Atomic counter
var ops int64
atomic.AddInt64(&ops, 1)
val := atomic.LoadInt64(&ops)

// CAS (Compare-And-Swap) — optimistic locking
var state int32 = 0  // 0: idle, 1: running
if atomic.CompareAndSwapInt32(&state, 0, 1) {
    // successfully changed 0 → 1, do work
    defer atomic.StoreInt32(&state, 0)
}

// atomic.Value — config hot-reload (type-safe wrapper)
var config atomic.Value

// Writer (infrequent):
config.Store(newConfig) // atomic store, no lock needed

// Readers (concurrent, frequent):
cfg := config.Load().(*Config) // atomic load, no lock needed
```

**atomic.Value use case phổ biến:**

- Config hot-reload: 1 goroutine periodically load config → Store. Nhiều goroutines Load.
- Feature flags, routing table, TLS certificate rotation.
- Bất kỳ **read-heavy, infrequent-write** scenario.

---

## 12. Real-World Concurrency

### Q33: HTTP server — goroutine per request model? 🟡 🟡 [Mid]

**A:**

Go `net/http` tự động tạo **1 goroutine per request**:

```go
// Bên trong net/http server (simplified):
func (srv *Server) Serve(l net.Listener) error {
    for {
        conn, err := l.Accept()
        if err != nil { return err }
        go srv.handleConn(conn) // 1 goroutine mỗi connection
    }
}
```

**Tại sao OK?**

- Goroutine cost ~4-8 KB, 10K connections = ~40-80 MB (chấp nhận được)
- Network I/O dùng netpoller (epoll/kqueue) → goroutine park, không block M
- Scheduler + GMP đảm bảo fairness

**Khi nào cần giới hạn?**

- CPU-bound handlers (image processing) → dùng worker pool / semaphore
- Connection limit → `netutil.LimitListener`
- Downstream protection → rate limiter

---

### Q34: Graceful shutdown pattern? 🔴 🔴 [Senior]

**A:**

```go
func main() {
    srv := &http.Server{Addr: ":8080", Handler: router}

    // Start server in goroutine
    go func() {
        if err := srv.ListenAndServe(); err != http.ErrServerClosed {
            log.Fatalf("listen: %v", err)
        }
    }()

    // Wait for interrupt signal
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit // block until signal

    log.Println("Shutting down...")

    // Give in-flight requests time to complete
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        log.Fatalf("forced shutdown: %v", err)
    }

    log.Println("Server exited cleanly")
}
```

**Shutdown sequence:**

1. Nhận SIGTERM/SIGINT
2. `srv.Shutdown(ctx)`:
   - Stop accepting new connections
   - Chờ in-flight requests hoàn thành (hoặc timeout)
   - Close idle connections immediately
3. Clean up resources (close DB, flush logs)

**Lưu ý Kubernetes**: K8s gửi SIGTERM → chờ `terminationGracePeriodSeconds` (default 30s) → SIGKILL. App cần handle SIGTERM và shutdown within grace period.

---

### Q35: Connection Pool và Background Workers pattern? 🟡 🟡 [Mid]

**A:**

**Connection Pool** (database/sql đã built-in):

```go
db, _ := sql.Open("postgres", dsn)
db.SetMaxOpenConns(25)    // max concurrent connections
db.SetMaxIdleConns(10)    // idle connections kept alive
db.SetConnMaxLifetime(5 * time.Minute) // recycle connections
db.SetConnMaxIdleTime(1 * time.Minute) // close idle too long
```

Bên trong: `database/sql` dùng channel + mutex để manage pool. `db.QueryContext(ctx, ...)` chờ connection available hoặc ctx cancel.

---

**Background Workers pattern:**

```go
type WorkerManager struct {
    jobs    chan Job
    results chan Result
    wg      sync.WaitGroup
    ctx     context.Context
    cancel  context.CancelFunc
}

func NewWorkerManager(numWorkers int) *WorkerManager {
    ctx, cancel := context.WithCancel(context.Background())
    wm := &WorkerManager{
        jobs:    make(chan Job, 100),
        results: make(chan Result, 100),
        ctx:     ctx,
        cancel:  cancel,
    }

    for i := 0; i < numWorkers; i++ {
        wm.wg.Add(1)
        go wm.worker(i)
    }
    return wm
}

func (wm *WorkerManager) worker(id int) {
    defer wm.wg.Done()
    for {
        select {
        case job, ok := <-wm.jobs:
            if !ok { return } // channel closed
            wm.results <- process(job)
        case <-wm.ctx.Done():
            return // shutdown signal
        }
    }
}

func (wm *WorkerManager) Shutdown() {
    wm.cancel()      // signal all workers to stop
    close(wm.jobs)   // no more jobs
    wm.wg.Wait()     // wait all workers finish
    close(wm.results)
}
```

---

## 13. Concurrency Best Practices Checklist

| #   | Practice                                                         | Giải thích                                                                                                              |
| --- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | **Start goroutines with clear ownership**                        | Ai tạo goroutine, người đó chịu trách nhiệm lifecycle (start, stop, error handling)                                     |
| 2   | **Luôn có exit strategy cho goroutine**                          | context.Done, done channel, hoặc close input channel                                                                    |
| 3   | **Prefer channels cho coordination, mutex cho state protection** | Channel = communication giữa goroutines. Mutex = protect internal data structure                                        |
| 4   | **Buffered channel size phải có lý do**                          | Đừng random chọn buffer size. Size 0 = synchronous. Size 1 = async handoff. Size N = known producer/consumer rate ratio |
| 5   | **Đừng leak goroutines**                                         | Dùng `goleak` trong test, monitor `runtime.NumGoroutine()`                                                              |
| 6   | **`go run -race` trong CI**                                      | Bắt buộc chạy race detector trong CI pipeline                                                                           |
| 7   | **Context là parameter đầu tiên**                                | Pass context explicitly, không dùng global hoặc store trong struct                                                      |
| 8   | **Defer cancel() ngay sau WithCancel/WithTimeout**               | Tránh context leak                                                                                                      |
| 9   | **Không copy sync types**                                        | Mutex, WaitGroup, Cond — dùng pointer. `go vet` detect được                                                             |
| 10  | **Keep critical section ngắn**                                   | Lock → do minimum work → unlock. Đừng I/O trong lock                                                                    |
| 11  | **Lock ordering nhất quán**                                      | Tránh deadlock bằng cách luôn lock theo thứ tự cố định                                                                  |
| 12  | **Dùng `select` với timeout/context**                            | Tránh block forever, luôn có escape hatch                                                                               |
| 13  | **Worker pool cho CPU-bound work**                               | Giới hạn concurrency = GOMAXPROCS cho CPU tasks                                                                         |
| 14  | **singleflight cho cache stampede**                              | Deduplicate concurrent DB/API calls cho cùng key                                                                        |
| 15  | **Graceful shutdown = SIGTERM + context + WaitGroup**            | Production apps phải handle shutdown cleanly                                                                            |

---

## 14. Interview Questions — Google / Zalo / Grab Focus

### Câu hỏi lý thuyết (Theory) 🟡 [Mid]

| #   | Question                                                | Difficulty | Key Points                                                                            |
| --- | ------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| 1   | Explain GMP model                                       | 🔴         | G=goroutine, M=OS thread, P=logical processor, work stealing, syscall handling        |
| 2   | How does Go scheduler differ from OS scheduler?         | 🔴         | User-space, M:N threading, cooperative+signal preemption, no context switch to kernel |
| 3   | What happens when a goroutine makes a blocking syscall? | 🔴         | M blocks, P detaches, finds/creates new M, sysmon retakes P after 10ms                |
| 4   | Explain channel internal structure                      | 🔴         | hchan: ring buffer, sendq/recvq wait queues, mutex, direct copy optimization          |
| 5   | What is goroutine leak? How to prevent?                 | 🟡         | Goroutine that never exits; context cancellation, buffered channel, goleak            |
| 6   | Difference between Mutex and RWMutex                    | 🟡         | Shared read lock vs exclusive; RWMutex for read-heavy workloads                       |
| 7   | Why does Go have no goroutine ID?                       | 🟡         | Prevent thread-local storage abuse, force explicit data passing                       |
| 8   | What is signal-based preemption? Why needed?            | 🔴         | SIGURG, tight loops couldn't be preempted before Go 1.14                              |
| 9   | Explain context cancellation cascade                    | 🟡         | Parent cancel → all children cancel; child cancel → parent unaffected                 |
| 10  | When to use atomic vs mutex?                            | 🟡         | Single variable → atomic; multiple variables → mutex                                  |

### Câu hỏi thiết kế (Design / Coding) 🟡 [Mid]

| #   | Question                                                | Difficulty | Expected Answer                                                            |
| --- | ------------------------------------------------------- | ---------- | -------------------------------------------------------------------------- |
| 1   | Design a bounded worker pool                            | 🔴         | Channel-based: jobs channel + N workers + WaitGroup + context for shutdown |
| 2   | Implement timeout for concurrent API calls              | 🟡         | errgroup + context.WithTimeout, hoặc select + time.After                   |
| 3   | How to prevent cache stampede?                          | 🔴         | singleflight.Group + TTL-based cache                                       |
| 4   | Design rate limiter using channels                      | 🟡         | Ticker-based token bucket, buffered channel for burst                      |
| 5   | Implement graceful shutdown for HTTP server             | 🔴         | Signal notification + srv.Shutdown(ctx) + WaitGroup for background workers |
| 6   | Fix this goroutine leak (given buggy code)              | 🟡         | Identify missing done channel / unbuffered channel / missing context       |
| 7   | Design pub/sub system in Go                             | 🔴         | Broker with subscriber map, buffered channels, unsubscribe + cleanup       |
| 8   | How would you debug high goroutine count in production? | 🔴         | pprof goroutine profile, runtime.NumGoroutine, identify stack traces       |
| 9   | Implement pipeline with cancellation                    | 🟡         | Chain of stages with `<-done` select in each stage                         |
| 10  | What's wrong with this concurrent map access?           | 🟡         | No synchronization → data race; fix with sync.Map or map+RWMutex           |

### Câu hỏi tình huống (Scenario) 🟡 [Mid]

> **Q: Bạn có 1 triệu URLs cần crawl. Thiết kế concurrent crawler.**

Approach:

1. **Worker pool**: N workers (50-100) consume từ jobs channel
2. **Semaphore**: buffered channel limit concurrent HTTP requests
3. **Rate limiter**: per-domain rate limiting (`time.Ticker` per domain)
4. **Context**: global timeout + per-request timeout
5. **errgroup**: collect errors, cancel on fatal
6. **Dedup**: `sync.Map` hoặc bloom filter check visited URLs
7. **Graceful shutdown**: SIGTERM → stop adding new URLs → drain workers → save state

> **Q: Service nhận 10K RPS, mỗi request cần query 3 downstream services. Thiết kế concurrency.**

Approach:

1. **errgroup** cho 3 concurrent downstream calls per request
2. **context.WithTimeout** per request (inherit từ HTTP handler)
3. **singleflight** nếu nhiều requests query cùng downstream data
4. **Connection pool** (DB, HTTP client) đủ lớn: maxConns ≥ expected concurrency
5. **Circuit breaker** nếu downstream slow/fail
6. **GOMAXPROCS** = CPU cores, automaxprocs trong container

---

## Câu Hỏi Phỏng Vấn Bổ Sung / Additional Interview Q&A

### Q: What is the difference between a goroutine and an OS thread? / Goroutine khác OS thread như thế nào? 🟢 Junior

**A:** Goroutines are user-space lightweight threads managed by the Go runtime scheduler, not the OS. A goroutine starts with ~2KB of stack (growable up to 1GB), whereas an OS thread typically uses 1–8MB of fixed stack. The Go runtime multiplexes thousands of goroutines onto a small pool of OS threads using the GMP model (Goroutines, Machine threads, Processors). Context switching between goroutines is handled in user space and is orders of magnitude cheaper than OS thread context switches which require kernel mode transitions.

Vietnamese explanation: Goroutine là luồng nhẹ (lightweight thread) chạy trong user space, được Go runtime quản lý qua mô hình GMP. Stack ban đầu chỉ ~2KB (so với ~1-8MB của OS thread) và tự động mở rộng khi cần. Hàng nghìn goroutine có thể chạy trên chỉ vài OS threads. Context switch của goroutine xảy ra trong user space — nhanh hơn nhiều so với kernel-level context switch của OS thread. Đây là lý do Go xử lý concurrency hiệu quả hơn mô hình thread-per-request truyền thống.

---

### Q: When should you use a buffered channel vs an unbuffered channel? / Khi nào dùng buffered channel, khi nào dùng unbuffered channel? 🟡 Mid

**A:** An **unbuffered channel** (`make(chan T)`) synchronizes sender and receiver — the sender blocks until the receiver is ready, enforcing a rendezvous. Use it when you need guaranteed handoff and synchronization between goroutines. A **buffered channel** (`make(chan T, N)`) allows the sender to continue until the buffer is full, decoupling producer from consumer. Use buffered channels for: worker pool job queues, rate limiting (semaphore pattern with `make(chan struct{}, N)`), or when a producer is faster than a consumer and you want to absorb bursts. Choosing the wrong type causes subtle bugs — buffered channels can hide synchronization issues and cause goroutine leaks if the receiver exits early.

Vietnamese explanation: Unbuffered channel đảm bảo **rendezvous** — sender và receiver phải đồng bộ nhau. Dùng khi cần chắc chắn data đã được xử lý trước khi tiếp tục. Buffered channel cho phép sender tiếp tục mà không cần chờ receiver ngay — hữu ích khi muốn tách producer/consumer về tốc độ. Pattern semaphore (`make(chan struct{}, N)`) giới hạn N goroutine chạy đồng thời. Lưu ý: buffered channel có thể che giấu race condition — nếu receiver thoát sớm mà channel vẫn còn data, goroutine leak xảy ra.

---

### Q: Explain how the `select` statement works with multiple channels and a default case. / `select` statement hoạt động như thế nào? 🟡 Mid

**A:** `select` blocks until one of its channel cases is ready to proceed. If multiple cases are ready simultaneously, Go picks one **uniformly at random** (not top-to-bottom), which prevents starvation. A `default` case makes `select` non-blocking — if no channel is ready, `default` executes immediately. Common patterns: (1) timeout with `time.After`, (2) cancellation with `<-ctx.Done()`, (3) non-blocking send/receive with `default`, (4) fan-in merging multiple channels into one. Without a `default`, a `select{}` with no ready cases blocks forever — useful for keeping a goroutine alive.

Vietnamese explanation: `select` chờ cho đến khi **ít nhất một** case sẵn sàng. Nếu nhiều case sẵn sàng cùng lúc, Go chọn **ngẫu nhiên đều** để tránh starvation. `default` biến select thành non-blocking — nếu không case nào sẵn sàng, default chạy ngay. Pattern thường gặp trong production: kết hợp `<-ctx.Done()` để cancel, `time.After(timeout)` để timeout, và channel data để nhận kết quả — ba case trong một select xử lý graceful shutdown rất gọn.

---

### Q: What are the differences between `sync.Mutex` and `sync.RWMutex`, and when do you use each? / Phân biệt `sync.Mutex` và `sync.RWMutex`? 🟡 Mid

**A:** `sync.Mutex` has two states: locked and unlocked. Only one goroutine can hold the lock at a time, regardless of whether it reads or writes. `sync.RWMutex` distinguishes reads from writes: **multiple goroutines can hold RLock() simultaneously** (concurrent reads), but a `Lock()` (write) requires exclusive access — all readers must release first. Use `RWMutex` when your workload is **read-heavy** (e.g., an in-memory cache with rare writes). If writes are frequent or reads are very short, `Mutex` has less overhead since `RWMutex` is more complex internally. Never promote an `RLock` to a `Lock` without releasing first — that causes deadlock.

Vietnamese explanation: `Mutex` đơn giản: một goroutine giữ lock, tất cả còn lại chờ — dù đọc hay ghi. `RWMutex` tối ưu cho workload đọc nhiều: nhiều goroutine có thể `RLock()` đồng thời, nhưng `Lock()` (ghi) yêu cầu exclusive. Dùng `RWMutex` khi cache có tỉ lệ đọc/ghi cao (ví dụ 99% đọc, 1% ghi). Tuy nhiên, nếu critical section ngắn hoặc ghi thường xuyên, overhead của RWMutex không đáng — dùng Mutex đơn giản hơn. Lỗi hay gặp: giữ `RLock` rồi cố `Lock()` mà không unlock trước → deadlock.

---

### Q: How does `context.WithCancel` and `context.WithTimeout` enable cancellation propagation? / Context cancellation hoạt động như thế nào trong chuỗi goroutine? 🔴 Senior

**A:** `context.Context` forms a tree — a child context is derived from a parent. When you call `cancel()` on a context (from `WithCancel`) or the deadline expires (`WithTimeout`/`WithDeadline`), all derived children are cancelled automatically by closing their `Done()` channel. Goroutines cooperate by selecting on `<-ctx.Done()` and returning when cancelled. This enables **cascading cancellation**: cancelling a request at the HTTP handler level propagates through all downstream goroutines (DB queries, HTTP calls, background workers) that received the same context. Key rule: always call the cancel function (usually `defer cancel()`) to avoid context leaks — an uncancelled context holds resources until the parent is cancelled or the program exits.

Vietnamese explanation: Context tạo thành **cây phân cấp**: cancel parent → tất cả children bị cancel. Goroutine "hợp tác" (cooperative) bằng cách check `<-ctx.Done()` định kỳ trong select. Pattern production: HTTP handler nhận `r.Context()`, truyền xuống tất cả downstream calls (DB, RPC, worker). Khi client disconnect, context bị cancel, tất cả goroutines dọn dẹp — tránh lãng phí resource. Lỗi thường gặp: quên `defer cancel()` → context leak (bộ nhớ không được giải phóng). Lỗi khác: pass `context.Background()` vào hàm thay vì ctx từ request — mất toàn bộ cancellation chain.

---

> **Tổng kết**: Concurrency là DNA của Go. Hiểu sâu GMP, channels, patterns sẽ giúp bạn trả lời 70%+ câu hỏi phỏng vấn Go tại các công ty lớn. Luôn chạy `-race` trong CI, luôn có exit strategy cho goroutines, và prefer simplicity over cleverness.

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                          | Difficulty | Core Concept      | Key Signal                                                     |
| --- | --------------------------------- | ---------- | ----------------- | -------------------------------------------------------------- |
| Q1  | Concurrency vs Parallelism        | 🟢         | Concurrency Model | Structure vs execution, 1 core can be concurrent               |
| Q2  | CSP model là gì?                  | 🟡         | Concurrency Model | Hoare 1978, message passing vs shared memory                   |
| Q3  | Goroutine vs OS thread (chi tiết) | 🔴         | Goroutines        | 2KB vs 1MB, M:N threading, user-space scheduling               |
| Q4  | Goroutine lifecycle & states      | 🟡         | Goroutines        | \_Grunnable → \_Grunning → \_Gwaiting → \_Gdead                |
| Q5  | Goroutine leak detection          | 🔴         | Goroutines        | goleak, pprof, context cancellation                            |
| Q6  | GMP Model components              | 🔴         | GMP Scheduler     | G=goroutine, M=OS thread, P=logical processor                  |
| Q7  | Scheduling cycle                  | 🔴         | GMP Scheduler     | Local queue → global queue → work stealing → network poller    |
| Q8  | Work Stealing                     | 🔴         | GMP Scheduler     | Idle P steals half from busy P's queue                         |
| Q9  | Syscall handling                  | 🔴         | GMP Scheduler     | M blocks → P detaches → new M → sysmon reclaims                |
| Q10 | Network Poller                    | 🔴         | GMP Scheduler     | epoll/kqueue, non-blocking I/O, goroutine parking              |
| Q11 | Preemption evolution              | 🔴         | GMP Scheduler     | Cooperative → SIGURG signal-based (Go 1.14+)                   |
| Q12 | GOMAXPROCS                        | 🟡         | GMP Scheduler     | Defaults to CPU cores, P count, container awareness            |
| Q13 | Channel internals (hchan)         | 🔴         | Channels          | Ring buffer, sendq/recvq, direct copy optimization             |
| Q14 | Channel axioms table              | 🔴         | Channels          | nil/closed/full/empty behavior matrix                          |
| Q15 | Unbuffered vs Buffered            | 🟡         | Channels          | Rendezvous vs decoupled, semaphore pattern                     |
| Q16 | Directional channels              | 🟢         | Channels          | `chan<-` send-only, `<-chan` receive-only, compile-time safety |
| Q17 | Select statement                  | 🟡         | Channels          | Random selection, default non-blocking, timeout pattern        |
| Q18 | Mutex vs RWMutex                  | 🟡         | Sync              | Exclusive vs shared read, read-heavy workloads                 |
| Q19 | WaitGroup/Once/Pool               | 🟡         | Sync              | Fan-out sync, one-time init, GC pressure reduction             |
| Q20 | Cond/Map                          | 🟡         | Sync              | Broadcast wake, concurrent map (O(1) read, amortized write)    |
| Q21 | Context problem it solves         | 🟡         | Context           | Request-scoped cancellation, cascading cancel                  |
| Q22 | Context types & usage             | 🟡         | Context           | Background, TODO, WithCancel, WithTimeout, WithValue           |
| Q23 | Context best practices            | 🟡         | Context           | First param, defer cancel, don't store in struct               |
| Q24 | Fan-out/Fan-in                    | 🔴         | Patterns          | Multiple goroutines → merge results → single output            |
| Q25 | Worker Pool                       | 🔴         | Patterns          | jobs channel + N workers + WaitGroup + context                 |
| Q26 | Pipeline                          | 🟡         | Patterns          | Chain of stages, each stage = goroutine + channel              |
| Q27 | Semaphore/Rate Limiter            | 🟡         | Patterns          | Buffered channel for semaphore, ticker for rate limit          |
| Q28 | errgroup/singleflight             | 🔴         | Patterns          | Concurrent error collection, cache stampede prevention         |
| Q29 | Pub/Sub                           | 🟡         | Patterns          | Broker + subscriber map + buffered channels                    |
| Q30 | Data race detection               | 🔴         | Safety            | `go run -race`, happens-before model, `go vet`                 |
| Q31 | Deadlock patterns                 | 🔴         | Safety            | Lock ordering, channel cycle, select with no ready case        |
| Q32 | Atomic vs Mutex                   | 🟡         | Sync              | Single variable → atomic, multiple → mutex                     |
| Q33 | HTTP goroutine model              | 🟡         | Real-World        | goroutine-per-request, connection pool, timeout                |
| Q34 | Graceful shutdown                 | 🔴         | Real-World        | SIGTERM → context cancel → WaitGroup drain → srv.Shutdown      |
| Q35 | Connection Pool & Workers         | 🟡         | Real-World        | Pool sizing, background worker lifecycle, health checks        |
| A1  | Goroutine vs OS thread            | 🟢         | Goroutines        | 2KB stack, user-space, GMP multiplexing                        |
| A2  | Buffered vs Unbuffered channel    | 🟡         | Channels          | Rendezvous vs burst absorption, semaphore                      |
| A3  | Select with default               | 🟡         | Channels          | Random selection, non-blocking, timeout                        |
| A4  | Mutex vs RWMutex                  | 🟡         | Sync              | Read-heavy → RWMutex, RLock→Lock deadlock                      |
| A5  | Context cancellation cascade      | 🔴         | Context           | Tree structure, Done() channel, defer cancel()                 |

**Distribution**: 🟢 Junior: 3 | 🟡 Mid: 20 | 🔴 Senior: 17 | **Total: 40 Q&As**

---

## Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **⚡ Interviewer**: "Explain how Go's GMP scheduler works and why it makes goroutines efficient."

**30-second answer / Trả lời 30 giây:**

"Go uses a GMP scheduler — G is goroutines, M is OS threads, P is logical processors. The key insight is M:N threading: thousands of goroutines multiplex onto a small pool of OS threads. Each P has a local run queue; when it's empty, it steals work from other Ps. When a goroutine makes a blocking syscall, the M blocks but the P detaches and finds another M — so other goroutines on that P aren't affected. Since Go 1.14, signal-based preemption using SIGURG ensures even tight loops can be interrupted. This is why Go handles 100K+ concurrent connections efficiently."

> **Follow-up**: "What happens if all Ms are blocked on syscalls?"
> → "The sysmon background thread detects Ps idle for >10ms and retakes them. It also creates new Ms as needed. In practice, the runtime limits M creation and uses the network poller (epoll/kqueue) for non-blocking I/O to minimize blocked Ms."

---

## Self-Check / Tự Kiểm Tra

> Che cột "Key Points", tự trả lời, rồi kiểm tra. Nếu đúng ≥ 5/7 → ready for interviews.

| #   | Question (tự hỏi)                                                   | Key Points (che lại)                                                                                                 |
| --- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | GMP model có 3 thành phần gì? Vai trò mỗi thành phần?               | G = goroutine (task), M = OS thread (worker), P = logical processor (run queue + resources)                          |
| 2   | Goroutine khác OS thread ở những điểm nào? (≥ 4 điểm)               | Stack 2KB vs 1MB, user-space scheduling, 100K+ scale, no thread ID, growable stack                                   |
| 3   | Channel axioms: gửi vào nil channel thì sao? Đọc từ closed channel? | Nil → block forever, Closed → returns zero value (use `v, ok := <-ch`)                                               |
| 4   | Khi nào dùng Mutex, khi nào dùng Channel?                           | Mutex: protect internal state. Channel: coordinate between goroutines. Simple state → mutex, communication → channel |
| 5   | Context tree cancellation hoạt động thế nào?                        | Parent cancel → all children cancel via Done() channel. Child cancel → parent unaffected. Always `defer cancel()`    |
| 6   | Worker Pool pattern cần những gì?                                   | Jobs channel + N worker goroutines + WaitGroup + context for graceful shutdown                                       |
| 7   | 3 cách phổ biến gây goroutine leak?                                 | Unbuffered channel no receiver, missing context cancellation, infinite loop without exit condition                   |

💬 **Feynman Prompt:** Giải thích Go concurrency model cho developer Java quen với threads. Tại sao "goroutines + channels" tốt hơn "threads + locks" trong hầu hết trường hợp?

### Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | Khi nào          | Làm gì                                                        |
| ----- | ---------------- | ------------------------------------------------------------- |
| 1     | Ngay sau khi đọc | Trả lời 7 câu Self-Check ở trên                               |
| 2     | Sau 3 ngày       | Cold Call: giải thích GMP model trong 30 giây                 |
| 3     | Sau 7 ngày       | Viết Worker Pool + Graceful Shutdown từ đầu (không xem code)  |
| 4     | Sau 14 ngày      | Mock interview: trả lời 5 câu 🔴 random từ bảng Summary       |
| 5     | Sau 30 ngày      | Design exercise: thiết kế concurrent crawler (1M URLs) từ đầu |

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Go Fundamentals](./01-language-fundamentals.md) | [OS Theory](../../shared/01-cs-fundamentals/os-theory.md) — goroutines map to OS threads via scheduler
- ➡️ **Enables:** [Distributed Systems](../02-backend-knowledge/03-distributed-systems.md) | [Go Memory & GC](./04-memory-gc.md)
- 🔗 **Patterns used in production:** Worker pools in API handlers | Fan-out for parallel DB queries | Context for request cancellation
