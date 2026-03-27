# Operating Systems — Go Backend Interview Prep

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> **Target:** Middle/Senior Go Backend Developer
> **Companies:** Zalo, Grab, Axon, Employment Hero, Microsoft, Google
> **Difficulty:** 🟢 Junior | 🟡 Middle | 🔴 Senior

---

## Real-World Scenario / Tình Huống Thực Tế

**Employment Hero production incident:** Go service consume nhiều CPU bất thường sau deploy. Dùng `pprof` thấy goroutine count tăng từ 500 → 50,000 sau 2 tiếng. Root cause: goroutine leak — mỗi request tạo goroutine gọi downstream service với `http.Get()`, nhưng nếu downstream timeout, goroutine block mãi mãi vì không có `context.WithTimeout`. Fix: thêm context timeout + kiểm tra goroutine count bằng `runtime.NumGoroutine()` trong metrics.

**Bài học:** Go runtime (goroutine scheduler, GC, memory model) không phải black box — biết cách nó hoạt động giúp debug vấn đề production mà không cần restart server.

## What & Why / Cái Gì & Tại Sao

**Analogy:** OS là nhà quản lý tài nguyên — CPU như nhân viên, processes như phòng ban, threads như cá nhân trong phòng. Go thêm một tầng nữa: goroutines như micro-tasks trong mỗi thread, và Go scheduler (G-M-P model) phân công công việc cho OS threads mà không cần lập trình viên quản lý trực tiếp.

**Why it matters:** Go ẩn đi sự phức tạp của OS threads, nhưng khi debug memory leak, goroutine leak, hay CPU spike, phải hiểu Go runtime scheduling để tìm root cause.

## Concept Map / Bản Đồ Khái Niệm

```
[OS Concepts for Go]
        │
        ├── Process vs Thread vs Goroutine
        │     ├── Process: isolated memory space, expensive context switch
        │     ├── Thread: shared memory, OS-managed, ~1MB stack
        │     └── Goroutine: Go-managed, ~8KB stack, M:N scheduling
        │
        ├── Go Scheduler (G-M-P Model)
        │     ├── G = Goroutine (work unit)
        │     ├── M = Machine (OS thread)
        │     ├── P = Processor (execution context, GOMAXPROCS count)
        │     └── Work stealing: idle P steals from busy P's queue
        │
        └── Signals & Graceful Shutdown
              ├── SIGTERM: graceful (Kubernetes pre-kill)
              ├── SIGKILL: cannot catch (hard kill)
              └── Pattern: signal.NotifyContext → server.Shutdown(ctx)
```

---

## Overview / Tổng Quan

File này cover 7 nhóm kiến thức OS thiết yếu cho Go Backend Developer, từ process/thread fundamentals đến Linux container internals:

| #   | Concept                        | Vai trò                               | Interview Weight |
| --- | ------------------------------ | ------------------------------------- | ---------------- |
| 1   | Process vs Thread vs Goroutine | Nền tảng concurrency model            | ⭐⭐⭐⭐⭐       |
| 2   | CPU Scheduling & GMP Model     | Go scheduler internals                | ⭐⭐⭐⭐⭐       |
| 3   | Memory Management              | Virtual memory, stack/heap, allocator | ⭐⭐⭐⭐         |
| 4   | IPC & Synchronization          | Process communication patterns        | ⭐⭐⭐           |
| 5   | I/O Models & Netpoller         | Non-blocking I/O, epoll/kqueue        | ⭐⭐⭐⭐⭐       |
| 6   | Linux Internals                | Namespaces, cgroups, syscalls         | ⭐⭐⭐⭐         |
| 7   | Signals & Context Switching    | Graceful shutdown, switch cost        | ⭐⭐⭐⭐         |

**Mối quan hệ:** Process/Thread → GMP Scheduler → Memory Model → I/O Models tạo thành pipeline hiểu biết từ OS primitives đến Go runtime. Linux Internals là nền tảng containerization (Docker/K8s). Signals & Context Switching kết nối graceful shutdown với scheduling cost.

---

## Core Concepts — Deep Dive / Khái Niệm Cốt Lõi

### Concept 1: Process vs Thread vs Goroutine

- **🧠 Memory Hook:** "Process = apartment (isolated), Thread = roommate (shared kitchen), Goroutine = micro-task post-it (stack-on-demand)"
- **Why exists (Level 1):** OS cần cách isolate running programs → process. Cần lightweight execution within process → thread. Go cần millions of concurrent tasks → goroutine.
- **Why exists (Level 2):** Process isolation (separate address space) prevents one program crashing another. Thread shared memory enables fast communication but introduces data races. Goroutine M:N scheduling avoids 1:1 thread overhead — 8KB initial stack vs 1-8MB OS thread stack.
- **Why exists (Level 3):** Fork-exec model creates process from parent's copy (COW optimization). POSIX threads require kernel involvement for scheduling. Go goroutines use cooperative + preemptive (since Go 1.14) scheduling entirely in user-space, with stack growth via copying (not segmented stacks — abandoned after Go 1.4).
- **Common Mistakes:** ❌ "Goroutine = green thread" → Green threads are 1:1 user-thread, goroutine is M:N with work-stealing. ❌ "More goroutines = more parallelism" → Parallelism limited by GOMAXPROCS (= CPU cores). ❌ "Process fork is expensive" → Linux uses COW, actual copy only on write.
- **Interview Pattern:** "Explain the cost difference between process switch, thread switch, and goroutine switch" → Process: flush TLB + save full context (~1-10µs). Thread: save registers only, same address space (~1µs). Goroutine: save 3 registers in user-space (~200ns). Key: TLB invalidation is the expensive part.
- **Knowledge Chain:** Process → Thread → Goroutine → GMP Scheduler → Work Stealing → Netpoller

### Concept 2: CPU Scheduling & GMP Model

- **🧠 Memory Hook:** "GMP = Go's 3-body system: G(oroutine) wants work, M(achine thread) does work, P(rocessor) assigns work"
- **Why exists (Level 1):** OS needs to share CPU time fairly among processes/threads. Go needs its own scheduler to manage millions of goroutines on limited OS threads.
- **Why exists (Level 2):** OS schedulers (CFS in Linux) optimize for fairness and responsiveness. Go scheduler optimizes for goroutine throughput — work-stealing ensures no P sits idle while others are overloaded. Local run queue (LRQ) per P avoids global lock contention.
- **Why exists (Level 3):** GMP evolution: Go 1.0 had global queue with single lock (bottleneck). Go 1.1 added P (per-processor local queue). Go 1.14 added async preemption via signals (SIGURG) — before this, tight loops without function calls could starve other goroutines. Sysmon thread monitors long-running goroutines and preempts after 10ms.
- **Common Mistakes:** ❌ "GOMAXPROCS = number of goroutines that can run" → It's number of P's (logical processors), not goroutines. ❌ "Setting GOMAXPROCS higher = faster" → Beyond CPU count, adds contention. ❌ "Go scheduler is cooperative only" → Since 1.14, it's cooperative + preemptive.
- **Interview Pattern:** "Draw the GMP model and explain work stealing" → Draw P with LRQ, G's in queue, M executing. When P1's LRQ empty, it steals half of P2's LRQ. Global queue is fallback. Network poller returns ready G's to any P.
- **Knowledge Chain:** OS Scheduling → GMP Model → Work Stealing → Preemption → GOMAXPROCS tuning

### Concept 3: Memory Management

- **🧠 Memory Hook:** "Virtual Memory = every process thinks it has the whole building, but actually shares floors through page tables"
- **Why exists (Level 1):** Programs need more memory than physically available. Each program needs isolated address space. OS needs to manage physical memory efficiently.
- **Why exists (Level 2):** Virtual memory provides: isolation (separate page tables), abstraction (contiguous virtual addresses mapped to fragmented physical), overcommit (allocate more than physical RAM using swap). TLB caches page table lookups — TLB miss costs 10-100x memory access.
- **Why exists (Level 3):** Go's memory allocator (TCMalloc-inspired): mcache (per-P, no lock) → mcentral (per-size-class, lock) → mheap (global, lock). Size classes: tiny (<16B), small (16B-32KB), large (>32KB direct from heap). Escape analysis decides stack vs heap — stack is free (just move SP), heap needs GC.
- **Common Mistakes:** ❌ "Stack is always faster than heap" → True for allocation, but stack size is limited. ❌ "Go doesn't use virtual memory" → Go uses mmap for heap, OS manages virtual→physical. ❌ "Page fault = error" → Minor page fault (COW, lazy alloc) is normal; major page fault (disk swap) is slow.
- **Interview Pattern:** "Explain escape analysis in Go" → Compiler determines if variable outlives function → if yes, allocates on heap. `go build -gcflags='-m'` shows decisions. Common escapes: returning pointer to local, closure captures, interface conversion.
- **Knowledge Chain:** Virtual Memory → Page Tables → TLB → Go Allocator → Escape Analysis → GC

### Concept 4: IPC & Synchronization

- **🧠 Memory Hook:** "IPC = postal service between apartments (processes) — pipes are tubes, shared memory is a shared whiteboard, sockets are phone calls"
- **Why exists (Level 1):** Processes have isolated memory → need mechanisms to communicate. Within Go, goroutines share memory but need synchronization.
- **Why exists (Level 2):** Pipes (anonymous/named) for parent-child streaming. Shared memory + semaphores for high-throughput. Unix sockets for local IPC. TCP sockets for network. Go channels as first-class IPC within process — "Don't communicate by sharing memory, share memory by communicating."
- **Common Mistakes:** ❌ "Channels are always better than mutexes in Go" → Channels have overhead; mutex is faster for simple state protection. ❌ "Shared memory IPC is safe by default" → Needs explicit synchronization (semaphores/mutexes). ❌ "Pipes are bidirectional" → Anonymous pipes are unidirectional; named pipes (FIFO) too.
- **Interview Pattern:** "When would you use mutex vs channel in Go?" → Mutex: protecting shared state (counters, maps). Channel: signaling, ownership transfer, pipeline patterns. Rule of thumb: if transferring data ownership → channel; if guarding access → mutex.
- **Knowledge Chain:** IPC Mechanisms → Go Channels → Select → sync.Mutex → sync.WaitGroup → Context

### Concept 5: I/O Models & Netpoller

- **🧠 Memory Hook:** "5 I/O models = 5 ways to wait for pizza delivery: blocking (sit at door), non-blocking (check every minute), multiplexing (one person watches all doors), signal-driven (doorbell), async (pizza appears in kitchen)"
- **Why exists (Level 1):** Network servers need to handle thousands of connections. Blocking I/O = one thread per connection = expensive. Need efficient ways to wait for I/O.
- **Why exists (Level 2):** epoll (Linux) / kqueue (macOS) = O(1) readiness notification for thousands of fds. Go's netpoller wraps epoll/kqueue, making goroutine blocking I/O actually non-blocking at OS level — goroutine parks, runtime polls for readiness, resumes goroutine when ready.
- **Why exists (Level 3):** Go netpoller integration: when goroutine does `conn.Read()` → runtime calls epoll_ctl to register fd → goroutine is parked (removed from P's run queue) → sysmon/dedicated thread calls epoll_wait → when fd ready, goroutine is put back on run queue. This is why Go handles 100K+ connections with only GOMAXPROCS threads.
- **Common Mistakes:** ❌ "Go uses blocking I/O so it's slow" → Go I/O looks blocking to developer but uses epoll/kqueue underneath. ❌ "select() and epoll are the same" → select is O(n) scan, epoll is O(1) notification. ❌ "async I/O (io_uring) is always better" → Adds complexity; Go's netpoller is simpler and sufficient for most cases.
- **Interview Pattern:** "How does Go handle 100K concurrent connections?" → Netpoller wraps epoll/kqueue. Each connection = goroutine (cheap). Goroutine parks on I/O wait. No thread blocked. GOMAXPROCS threads serve all goroutines.
- **Knowledge Chain:** Blocking I/O → select → poll → epoll/kqueue → Go Netpoller → Goroutine scheduling

### Concept 6: Linux Internals (Containers)

- **🧠 Memory Hook:** "Namespaces = separate rooms with own furniture, Cgroups = meter on each room's electricity/water"
- **Why exists (Level 1):** Containers need process isolation without full VM overhead. Namespaces provide isolation, cgroups provide resource limits.
- **Why exists (Level 2):** 7 namespace types: PID (process tree), NET (network stack), MNT (filesystem), UTS (hostname), IPC (message queues), USER (uid mapping), CGROUP. Docker = namespaces + cgroups + union filesystem (overlay2). Go's `GOMAXPROCS` should match cgroup CPU limit, not host CPU count.
- **Why exists (Level 3):** cgroup v2 unified hierarchy vs v1 per-resource trees. `runtime.GOMAXPROCS` auto-detection issue: Go reads `/proc/cpuinfo` (host CPUs), not cgroup limit → set explicitly or use `uber-go/automaxprocs`. Memory cgroup OOM killer sends SIGKILL (can't catch) — monitor `memory.current` vs `memory.max`.
- **Common Mistakes:** ❌ "Docker is a VM" → It's process isolation using kernel features. ❌ "GOMAXPROCS auto-detects container limits" → Not by default before Go 1.19. ❌ "Namespace provides security" → It provides isolation, not security hardening (need seccomp, AppArmor).
- **Interview Pattern:** "Why does your Go service use 800% CPU in a container limited to 2 cores?" → GOMAXPROCS defaults to host CPU count. Fix: `GOMAXPROCS=2` or `automaxprocs`. Also check: goroutine leak, busy-wait loops.
- **Knowledge Chain:** Linux Kernel → Namespaces → Cgroups → Docker → Kubernetes → GOMAXPROCS tuning

### Concept 7: Signals & Context Switching

- **🧠 Memory Hook:** "Signals = phone calls from OS (SIGTERM = 'please leave', SIGKILL = 'security escort'), Context Switch = saving your desk before someone else uses it"
- **Why exists (Level 1):** OS needs to notify processes of events (termination, interrupt). CPU needs to switch between tasks — context switch is the mechanism.
- **Why exists (Level 2):** Kubernetes sends SIGTERM, waits terminationGracePeriodSeconds (default 30s), then SIGKILL. Go's `signal.NotifyContext` ties signal handling to context cancellation — idiomatic graceful shutdown. Context switch cost hierarchy: goroutine (~200ns) < thread (~1µs) < process (~1-10µs) — driven by TLB flush and cache invalidation.
- **Common Mistakes:** ❌ "SIGKILL can be caught" → Never. SIGKILL and SIGSTOP cannot be caught/ignored. ❌ "Graceful shutdown = just catch SIGTERM" → Must also drain connections, flush buffers, cancel background workers. ❌ "Context switch cost is fixed" → Depends on cache state, NUMA topology, CPU features.
- **Interview Pattern:** "Write graceful shutdown for Go HTTP server on Kubernetes" → `signal.NotifyContext` → `server.Shutdown(ctx)` → cancel background workers → `os.Exit(0)`. Key: buffered signal channel, timeout context for shutdown, readiness probe returns 503 during drain.
- **Knowledge Chain:** Unix Signals → signal.NotifyContext → Graceful Shutdown → K8s terminationGracePeriod → Readiness Probes

---

## Table of Contents

1. [Process vs Thread](#1-process-vs-thread)
2. [CPU Scheduling](#2-cpu-scheduling)
3. [Memory Management](#3-memory-management)
4. [Inter-Process Communication (IPC)](#4-inter-process-communication-ipc)
5. [Deadlocks](#5-deadlocks)
6. [I/O Models](#6-io-models)
7. [File Systems](#7-file-systems)
8. [Linux Internals (for Containerization)](#8-linux-internals-for-containerization)
9. [Signals](#9-signals)
10. [Context Switching](#10-context-switching)
11. [Cheat Sheet & Interview Tips](#11-cheat-sheet--interview-tips)

---

## 1. Process vs Thread

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 Q: Process là gì? Mô tả các thành phần và trạng thái của process. 🟢 [Junior]

**Process** (tiến trình) là một chương trình đang được thực thi. Mỗi process có không gian địa chỉ riêng biệt, được OS quản lý thông qua **PCB (Process Control Block)**.

**PCB bao gồm:**

| Thành phần       | Mô tả                                                          |
| ---------------- | -------------------------------------------------------------- |
| Process ID (PID) | Định danh duy nhất                                             |
| Process State    | Trạng thái hiện tại (new, ready, running, waiting, terminated) |
| Program Counter  | Địa chỉ lệnh tiếp theo cần thực thi                            |
| CPU Registers    | Giá trị các thanh ghi khi bị context switch                    |
| Memory Info      | Page table, segment table, base/limit registers                |
| I/O Status       | Danh sách file descriptors đang mở                             |
| Scheduling Info  | Priority, CPU time đã dùng                                     |

**Các trạng thái của process (5-state model):**

```
    ┌─────────┐
    │   New   │
    └────┬────┘
         │ admit
         ▼
    ┌─────────┐  dispatch  ┌─────────┐
    │  Ready  │───────────▶│ Running │
    └─────────┘◀───────────└────┬────┘
         ▲      preempt/        │
         │      timeout         │ I/O or
         │                      │ event wait
         │  I/O done    ┌──────▼──────┐
         └──────────────│   Waiting   │
                        └─────────────┘
                              │ exit
                        ┌─────▼─────┐
                        │ Terminated│
                        └───────────┘
```

**Context switching giữa processes rất tốn kém:**

- Lưu toàn bộ registers, program counter vào PCB cũ
- Flush TLB (Translation Lookaside Buffer)
- Load PCB mới, khôi phục registers
- Chi phí: ~1-10 microseconds (tùy hardware)

---

### 🟢 Q: Thread là gì? Phân biệt kernel thread và user thread. 🟢 [Junior]

**Thread** (luồng) là đơn vị thực thi nhỏ nhất trong một process. Các threads trong cùng process chia sẻ:

- Code segment, data segment
- Heap memory
- File descriptors, signal handlers

Mỗi thread có riêng: **stack, registers, program counter, thread ID**.

**Kernel Thread vs User Thread:**

| Đặc điểm       | Kernel Thread                     | User Thread                                  |
| -------------- | --------------------------------- | -------------------------------------------- |
| Quản lý bởi    | OS kernel                         | User-space library                           |
| Context switch | Cần kernel intervention (~1-10μs) | Không cần kernel (~100ns)                    |
| Scheduling     | OS scheduler                      | User-space scheduler                         |
| Blocking I/O   | Chỉ block thread đó               | Có thể block toàn bộ process (1:1 thì không) |
| Tạo mới        | Tốn kém (system call)             | Rẻ                                           |
| Stack size     | Cố định ~1-8MB                    | Linh hoạt                                    |

**Threading models:**

- **1:1** (One-to-One): Mỗi user thread map đến 1 kernel thread. Linux pthreads dùng model này.
- **N:1** (Many-to-One): Nhiều user threads map đến 1 kernel thread. Không tận dụng multicore.
- **M:N** (Many-to-Many): M user threads map đến N kernel threads. **Go dùng model này.**

---

### 🟡 Q: Go goroutine hoạt động như thế nào? So sánh với process và thread. 🟡 [Mid]

**Goroutine** là lightweight thread do Go runtime quản lý, chạy trên M:N threading model.

**So sánh chi tiết:**

| Đặc điểm            | Process                       | OS Thread             | Goroutine                   |
| ------------------- | ----------------------------- | --------------------- | --------------------------- |
| Memory overhead     | ~GB (riêng address space)     | ~1-8MB (stack)        | ~2-8KB (stack, growable)    |
| Creation cost       | ~ms (fork + exec)             | ~10-100μs             | ~1-2μs                      |
| Context switch      | ~1-10μs (TLB flush)           | ~1-5μs (kernel mode)  | ~100-200ns (user-space)     |
| Scheduling          | OS scheduler                  | OS scheduler          | Go runtime scheduler        |
| Communication       | IPC (pipes, sockets)          | Shared memory + locks | Channels (CSP model)        |
| Max practical count | ~hundreds                     | ~thousands            | ~millions                   |
| Isolation           | Full (separate address space) | Partial (shared heap) | Minimal (shared everything) |

**Go code: Goroutines vs OS Process:**

```go
package main

import (
    "fmt"
    "os/exec"
    "runtime"
    "sync"
    "time"
)

// Tạo process con bằng os/exec
func spawnProcess() {
    cmd := exec.Command("ls", "-la")
    output, err := cmd.CombinedOutput()
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    fmt.Printf("Process output:\n%s\n", output)
}

// Tạo hàng triệu goroutines
func spawnGoroutines() {
    var wg sync.WaitGroup
    numGoroutines := 100_000

    start := time.Now()
    for i := 0; i < numGoroutines; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            // Simulate work
            time.Sleep(10 * time.Millisecond)
        }(i)
    }
    wg.Wait()
    elapsed := time.Since(start)

    fmt.Printf("Spawned %d goroutines in %v\n", numGoroutines, elapsed)
    fmt.Printf("Num OS threads used: %d\n", runtime.GOMAXPROCS(0))
}

func main() {
    fmt.Println("=== Process ===")
    spawnProcess()

    fmt.Println("\n=== Goroutines ===")
    spawnGoroutines()
}
```

> **Interview Tip (Grab, Google):** Phải giải thích rõ tại sao goroutine rẻ: stack nhỏ (2KB, growable), context switch ở user-space không cần system call, scheduling bởi Go runtime chứ không phải OS. Đây là câu hỏi mở đầu phổ biến.

---

## 2. CPU Scheduling

### 🟢 Q: Giải thích các thuật toán CPU Scheduling cơ bản. 🟢 [Junior]

**1. FCFS (First-Come, First-Served):**

- Non-preemptive. Process đến trước được chạy trước.
- Vấn đề: **Convoy effect** — process ngắn phải đợi process dài.
- Ví dụ: P1(24ms), P2(3ms), P3(3ms) → Average wait = (0+24+27)/3 = 17ms

**2. SJF (Shortest Job First):**

- Chọn process có burst time ngắn nhất.
- Optimal cho average waiting time, nhưng cần biết trước burst time (thường dùng exponential averaging để predict).
- **Non-preemptive SJF:** Chạy đến khi xong.
- **Preemptive SJF (SRTF):** Nếu process mới có remaining time ngắn hơn, preempt.

**3. Priority Scheduling:**

- Mỗi process có priority number. Priority thấp = ưu tiên cao (convention).
- Vấn đề: **Starvation** — process priority thấp không bao giờ được chạy.
- Giải pháp: **Aging** — tăng priority theo thời gian chờ.

**4. Round Robin (RR):**

- Mỗi process được chạy 1 **time quantum** (thường 10-100ms).
- Hết quantum → chuyển sang process tiếp theo trong ready queue.
- Time quantum nhỏ → nhiều context switch, overhead cao.
- Time quantum lớn → trở thành FCFS.

**5. Multilevel Queue:**

- Chia processes vào nhiều queue theo loại (foreground/background).
- Mỗi queue có scheduling algorithm riêng.
- Giữa các queue: fixed priority hoặc time-slice.

**Preemptive vs Non-preemptive:**

| Preemptive                       | Non-preemptive                     |
| -------------------------------- | ---------------------------------- |
| OS có thể dừng process đang chạy | Process chạy đến khi tự nhường CPU |
| Tốt cho interactive systems      | Đơn giản, ít overhead              |
| Round Robin, SRTF                | FCFS, SJF (non-preemptive)         |

---

### 🔴 Q: Giải thích GMP model trong Go scheduler. 🔴 [Senior]

**GMP Model** là trái tim của Go runtime scheduler:

```
┌─────────────────────────────────────────────┐
│                Go Runtime                    │
│                                              │
│   G₁  G₂  G₃  G₄  G₅  ...  Gₙ             │
│   (Goroutines - hàng triệu)                 │
│          │    │    │                         │
│          ▼    ▼    ▼                         │
│   ┌────┐ ┌────┐ ┌────┐                      │
│   │ P₁ │ │ P₂ │ │ P₃ │  (Processors)        │
│   │LRQ │ │LRQ │ │LRQ │  GOMAXPROCS cái      │
│   └──┬─┘ └──┬─┘ └──┬─┘                      │
│      │       │      │                        │
│      ▼       ▼      ▼                        │
│   ┌────┐ ┌────┐ ┌────┐                      │
│   │ M₁ │ │ M₂ │ │ M₃ │  (OS Threads)        │
│   └────┘ └────┘ └────┘                      │
│                                              │
│   Global Run Queue (GRQ): G₆, G₇, G₈, ...  │
└─────────────────────────────────────────────┘
```

**G (Goroutine):**

- Đơn vị thực thi user code.
- Mỗi G có: stack (~2KB, growable), program counter, function pointer, status.
- Status: `_Grunnable`, `_Grunning`, `_Gwaiting`, `_Gsyscall`, `_Gdead`.

**M (Machine / OS Thread):**

- Thực sự chạy code trên CPU.
- Mỗi M phải gắn với 1 P để chạy goroutines.
- Nếu M bị block ở syscall → runtime tạo M mới hoặc dùng M đang idle.
- Giới hạn mặc định: 10,000 M (`runtime.SetMaxThreads()`).

**P (Processor / Logical Processor):**

- "Context" để chạy Go code. Giữ local run queue (LRQ).
- Số P = `GOMAXPROCS` (mặc định = số CPU cores).
- Mỗi P có: LRQ (tối đa 256 G), mcache (memory allocator cache).

**Scheduling Flow:**

1. G mới được tạo → đưa vào LRQ của P hiện tại.
2. Nếu LRQ đầy → chuyển nửa sang GRQ.
3. P lấy G từ LRQ để chạy trên M.
4. Nếu LRQ trống → **work-stealing**: lấy G từ GRQ hoặc steal từ LRQ của P khác.

**Work-Stealing Algorithm:**

```
Khi P không có G để chạy:
1. Kiểm tra LRQ (local run queue)
2. Kiểm tra GRQ (global run queue) — lấy n = min(len(GRQ)/GOMAXPROCS+1, len(GRQ)/2) G
3. Steal nửa LRQ từ P khác (random victim)
4. Nếu không có gì → sleep M, đợi P có work
```

**Preemption trong Go:**

- **Go < 1.14:** Cooperative scheduling — goroutine phải tự nhường CPU (tại function call, channel op, etc.). Tight loop không có function call → không bị preempt → starve goroutine khác.
- **Go 1.14+:** **Asynchronous preemption** — dùng OS signal (SIGURG trên Linux) để preempt goroutine đang chạy tight loop. sysmon goroutine gửi signal sau ~10ms.

```go
package main

import (
    "fmt"
    "runtime"
    "time"
)

func main() {
    // Set GOMAXPROCS = 1 để thấy rõ scheduling behavior
    runtime.GOMAXPROCS(1)

    // Trước Go 1.14, goroutine này sẽ starve goroutine khác
    // Từ Go 1.14+, nó sẽ bị preempt bởi async preemption
    go func() {
        for {
            // tight loop — no function calls
            // Go 1.14+ sẽ preempt bằng SIGURG signal
        }
    }()

    // Goroutine này vẫn được chạy nhờ preemption
    go func() {
        time.Sleep(100 * time.Millisecond)
        fmt.Println("I can still run thanks to preemption!")
    }()

    time.Sleep(200 * time.Millisecond)
}
```

**GOMAXPROCS:**

```go
package main

import (
    "fmt"
    "runtime"
)

func main() {
    // Lấy số CPU cores
    numCPU := runtime.NumCPU()
    fmt.Printf("Number of CPUs: %d\n", numCPU)

    // GOMAXPROCS mặc định = numCPU
    fmt.Printf("GOMAXPROCS: %d\n", runtime.GOMAXPROCS(0))

    // Thay đổi GOMAXPROCS (trả về giá trị cũ)
    old := runtime.GOMAXPROCS(2)
    fmt.Printf("Old GOMAXPROCS: %d, New: %d\n", old, runtime.GOMAXPROCS(0))

    // Xem số goroutines hiện tại
    fmt.Printf("Number of goroutines: %d\n", runtime.NumGoroutine())
}
```

> **Interview Tip (Google, Grab):** GMP model là câu hỏi senior bắt buộc. Cần giải thích: tại sao cần P (để giới hạn concurrency thật sự, mỗi P giữ mcache riêng), work-stealing (load balancing), và sysmon goroutine (preemption, GC trigger, network poller). Vẽ diagram khi phỏng vấn.

---

## 3. Memory Management

### 🟢 Q: Giải thích Virtual Memory, Paging, và TLB. 🟢 [Junior]

**Virtual Memory** cho phép mỗi process có không gian địa chỉ ảo riêng, ánh xạ sang physical memory qua **page table**.

**Paging:**

- Physical memory chia thành **frames** (thường 4KB).
- Virtual memory chia thành **pages** (cùng kích thước).
- **Page table** ánh xạ virtual page → physical frame.
- Khi access page chưa có trong memory → **page fault** → OS load từ disk.

```
Virtual Address: [Page Number | Offset]
                      │
                      ▼
              ┌──────────────┐
              │  Page Table  │
              │  PN → Frame  │
              └──────┬───────┘
                     │
                     ▼
Physical Address: [Frame Number | Offset]
```

**TLB (Translation Lookaside Buffer):**

- Cache cho page table, nằm trong CPU.
- TLB hit: 1-2 cycles. TLB miss: 10-100 cycles (phải walk page table).
- Context switch giữa processes → **flush TLB** (rất tốn kém).
- Context switch giữa threads cùng process → **không flush** (share address space).
- Context switch giữa goroutines → **không flush** (same thread, same address space).

---

### 🟡 Q: Giải thích các thuật toán Page Replacement. 🟡 [Mid]

Khi physical memory đầy và cần load page mới → phải chọn page nào để evict.

**1. FIFO (First-In, First-Out):**

- Evict page cũ nhất. Đơn giản nhưng kém hiệu quả.
- **Belady's anomaly:** Tăng số frames có thể tăng page faults!

**2. LRU (Least Recently Used):**

- Evict page không được dùng lâu nhất.
- Cần tracking mỗi lần access → overhead hardware (counter hoặc stack).
- Thực tế: xấp xỉ LRU bằng **clock algorithm** (second chance).

**3. LFU (Least Frequently Used):**

- Evict page ít được access nhất.
- Vấn đề: page cũ có count cao không bao giờ bị evict.
- Giải pháp: aging — giảm count theo thời gian.

**Segmentation vs Paging:**

| Segmentation                                  | Paging                                      |
| --------------------------------------------- | ------------------------------------------- |
| Chia theo logical unit (code, data, stack)    | Chia theo fixed-size pages                  |
| Kích thước khác nhau → external fragmentation | Kích thước cố định → internal fragmentation |
| Programmer-visible                            | Transparent to programmer                   |
| Ít dùng trong modern OS                       | Dominant approach                           |

---

### 🟡 Q: Stack vs Heap allocation khác nhau thế nào? Go xử lý ra sao? 🟡 [Mid]

| Stack                                             | Heap                                     |
| ------------------------------------------------- | ---------------------------------------- |
| LIFO, tự động quản lý                             | Manual/GC quản lý                        |
| Cực nhanh (chỉ move stack pointer)                | Chậm hơn (allocator phải tìm free block) |
| Size giới hạn (~1-8MB cho OS thread)              | Size lớn (limited by RAM + swap)         |
| Local variables, function parameters              | Dynamic allocation, escaped variables    |
| Thread-safe by nature (mỗi thread có stack riêng) | Cần synchronization                      |

**Go Escape Analysis:** Go compiler quyết định variable đặt ở stack hay heap.

```go
package main

// Biến KHÔNG escape → stack allocation
func stackAlloc() int {
    x := 42 // stays on stack
    return x
}

// Biến ESCAPE → heap allocation (vì trả về pointer)
func heapAlloc() *int {
    x := 42    // escapes to heap vì lấy pointer trả về
    return &x  // compiler biết x phải sống lâu hơn function
}

// Kiểm tra escape analysis:
// go build -gcflags="-m" main.go
// Output: "./main.go:9:2: moved to heap: x"
```

---

### 🔴 Q: Go Memory Allocator hoạt động như thế nào? (TCMalloc-inspired) 🔴 [Senior]

Go memory allocator lấy cảm hứng từ **TCMalloc** (Thread-Caching Malloc) với 3 cấp:

```
┌─────────────────────────────────────────────────────┐
│                    Goroutine                         │
│                       │                              │
│                       ▼                              │
│              ┌──────────────┐                        │
│              │   mcache     │  Per-P cache            │
│              │  (per-P)     │  Không cần lock          │
│              │  size classes │  Nhanh nhất              │
│              └──────┬───────┘                        │
│                     │ miss                            │
│                     ▼                                │
│              ┌──────────────┐                        │
│              │  mcentral    │  Shared, per-size-class │
│              │  (central)   │  Cần lock                │
│              │  free lists  │                         │
│              └──────┬───────┘                        │
│                     │ miss                            │
│                     ▼                                │
│              ┌──────────────┐                        │
│              │   mheap      │  Global heap             │
│              │  (heap)      │  Quản lý spans           │
│              │              │  Lock nặng nhất          │
│              └──────┬───────┘                        │
│                     │ miss                            │
│                     ▼                                │
│              ┌──────────────┐                        │
│              │     OS       │  mmap/sbrk               │
│              └──────────────┘                        │
└─────────────────────────────────────────────────────┘
```

**Size Classes:**

- Tiny objects (< 16 bytes): đặc biệt, gom nhiều object vào 1 allocation.
- Small objects (16B - 32KB): dùng mcache → mcentral → mheap.
- Large objects (> 32KB): allocate trực tiếp từ mheap.

**Go Growable Stacks:**

- Goroutine bắt đầu với stack ~2-8KB (tuỳ version).
- Khi stack overflow → runtime allocate stack mới gấp đôi, **copy** toàn bộ stack cũ sang.
- Pointers trong stack được update (stack objects are movable).
- Khi stack shrink (ít dùng) → thu nhỏ lại.

```go
package main

import (
    "fmt"
    "runtime"
)

func printMemStats() {
    var m runtime.MemStats
    runtime.ReadMemStats(&m)

    fmt.Printf("=== Memory Stats ===\n")
    fmt.Printf("Alloc (heap in use):    %d MB\n", m.Alloc/1024/1024)
    fmt.Printf("TotalAlloc (cumulative): %d MB\n", m.TotalAlloc/1024/1024)
    fmt.Printf("Sys (OS memory):         %d MB\n", m.Sys/1024/1024)
    fmt.Printf("HeapObjects:             %d\n", m.HeapObjects)
    fmt.Printf("HeapAlloc:               %d MB\n", m.HeapAlloc/1024/1024)
    fmt.Printf("HeapIdle:                %d MB\n", m.HeapIdle/1024/1024)
    fmt.Printf("HeapReleased:            %d MB\n", m.HeapReleased/1024/1024)
    fmt.Printf("StackInuse:              %d KB\n", m.StackInuse/1024)
    fmt.Printf("NumGC:                   %d\n", m.NumGC)
    fmt.Printf("GoroutineCount:          %d\n", runtime.NumGoroutine())
}

func main() {
    printMemStats()

    // Allocate nhiều object
    data := make([][]byte, 0, 100000)
    for i := 0; i < 100000; i++ {
        data = append(data, make([]byte, 1024))
    }

    fmt.Println("\nAfter allocating 100K * 1KB objects:")
    printMemStats()

    // Force GC
    runtime.GC()
    fmt.Println("\nAfter GC (data still referenced):")
    printMemStats()

    // Release reference
    data = nil
    runtime.GC()
    fmt.Println("\nAfter releasing & GC:")
    printMemStats()
}
```

**Debug GC:**

```bash
# Enable GC trace
GODEBUG=gctrace=1 go run main.go

# Output format:
# gc 1 @0.012s 5%: 0.021+2.1+0.039 ms clock, 0.17+0.42/2.0/0+0.31 ms cpu, 4->4->1 MB, 5 MB goal, 8 P
#    │    │     │        │                          │                       │             │       │
#    │    │     │        │                          │                       │             │       └── Num processors
#    │    │     │        │                          │                       │             └── GC target heap size
#    │    │     │        │                          │                       └── heap before -> heap after -> live
#    │    │     │        │                          └── CPU time (assist/bg/idle)
#    │    │     │        └── Wall-clock time (sweep term + mark + mark term)
#    │    │     └── % time spent in GC
#    │    └── Time since program start
#    └── GC cycle number
```

> **Interview Tip (Microsoft, Google):** Hiểu Go memory allocator sâu thể hiện bạn không chỉ viết Go mà còn hiểu runtime. Câu hỏi follow-up thường: "Khi nào Go trả memory lại cho OS?" → Trả lời: `runtime.ReadMemStats` xem HeapReleased; Go >= 1.12 dùng MADV_FREE, Go >= 1.16 dùng scavenging background.

---

## 4. Inter-Process Communication (IPC)

### 🟢 Q: Liệt kê và giải thích các phương thức IPC. 🟢 [Junior]

**1. Pipes (Unnamed):**

- Unidirectional, giữa parent-child process.
- Data = byte stream, FIFO.
- Bị destroy khi process kết thúc.

**2. Named Pipes (FIFO):**

- Giống pipe nhưng có tên trong filesystem.
- Cho phép giao tiếp giữa processes không liên quan.

**3. Shared Memory:**

- Nhanh nhất vì không cần copy data qua kernel.
- Cần synchronization (semaphore, mutex).
- `shmget`, `shmat` trên Linux.

**4. Message Queues:**

- Structured messages, priority-based.
- Kernel-managed buffer.
- POSIX: `mq_open`, `mq_send`, `mq_receive`.

**5. Sockets:**

- Linh hoạt nhất, hoạt động cả local và network.
- **Unix Domain Socket:** Nhanh hơn TCP cho local IPC (không qua network stack).
- **TCP Socket:** Cross-machine communication.

**6. Signals:**

- Asynchronous notification.
- Limited information (chỉ signal number).
- Dùng cho: kill process, reload config, graceful shutdown.

**So sánh:**

| Method        | Speed   | Complexity | Cross-machine | Data size           |
| ------------- | ------- | ---------- | ------------- | ------------------- |
| Pipe          | Fast    | Low        | No            | Unlimited (stream)  |
| Named Pipe    | Fast    | Low        | No            | Unlimited (stream)  |
| Shared Memory | Fastest | High       | No            | Large               |
| Message Queue | Medium  | Medium     | No            | Limited per message |
| Unix Socket   | Fast    | Medium     | No            | Unlimited           |
| TCP Socket    | Slower  | High       | Yes           | Unlimited           |
| Signal        | Fast    | Low        | No            | Minimal (signal #)  |

---

### 🟡 Q: Viết Go code cho các phương thức IPC. 🟡 [Mid]

**Pipes:**

```go
package main

import (
    "fmt"
    "io"
    "os"
)

func main() {
    // os.Pipe() tạo connected pair: reader và writer
    reader, writer, err := os.Pipe()
    if err != nil {
        panic(err)
    }

    // Writer goroutine (simulate child process writing)
    go func() {
        defer writer.Close()
        writer.Write([]byte("Hello from pipe!"))
    }()

    // Reader (parent process reading)
    data, err := io.ReadAll(reader)
    if err != nil {
        panic(err)
    }
    fmt.Printf("Received: %s\n", data)
    reader.Close()
}
```

**Unix Domain Socket:**

```go
package main

import (
    "fmt"
    "net"
    "os"
    "time"
)

const socketPath = "/tmp/go_ipc_demo.sock"

func server() {
    // Cleanup old socket file
    os.Remove(socketPath)

    listener, err := net.Listen("unix", socketPath)
    if err != nil {
        panic(err)
    }
    defer listener.Close()
    defer os.Remove(socketPath)

    fmt.Println("Server listening on", socketPath)

    conn, err := listener.Accept()
    if err != nil {
        panic(err)
    }
    defer conn.Close()

    buf := make([]byte, 1024)
    n, err := conn.Read(buf)
    if err != nil {
        panic(err)
    }
    fmt.Printf("Server received: %s\n", buf[:n])

    conn.Write([]byte("Hello from server!"))
}

func client() {
    time.Sleep(100 * time.Millisecond) // Wait for server to start

    conn, err := net.Dial("unix", socketPath)
    if err != nil {
        panic(err)
    }
    defer conn.Close()

    conn.Write([]byte("Hello from client!"))

    buf := make([]byte, 1024)
    n, err := conn.Read(buf)
    if err != nil {
        panic(err)
    }
    fmt.Printf("Client received: %s\n", buf[:n])
}

func main() {
    go server()
    client()
}
```

**Signal Handling (chi tiết ở Section 9):**

```go
package main

import (
    "fmt"
    "os"
    "os/signal"
    "syscall"
)

func main() {
    sigs := make(chan os.Signal, 1)
    signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

    fmt.Println("Waiting for signal... (Ctrl+C to send SIGINT)")
    sig := <-sigs
    fmt.Printf("Received signal: %v\n", sig)
}
```

> **Interview Tip (Zalo, Grab):** Khi được hỏi IPC, luôn đề cập Go channels là IPC mechanism giữa goroutines (trong cùng process). Nếu cần cross-process → Unix domain socket (local) hoặc TCP/gRPC (remote). Đây là thiết kế microservices cơ bản.

---

## 5. Deadlocks

### 🟢 Q: 4 điều kiện cần để xảy ra Deadlock là gì? 🟢 [Junior]

**4 điều kiện Coffman (phải xảy ra đồng thời):**

1. **Mutual Exclusion:** Ít nhất 1 resource chỉ được dùng bởi 1 process tại 1 thời điểm.
2. **Hold and Wait:** Process đang giữ resource và đợi thêm resource khác.
3. **No Preemption:** Resource không thể bị lấy lại bằng force, chỉ được release tự nguyện.
4. **Circular Wait:** Tồn tại chu trình P1→R1→P2→R2→...→Pn→Rn→P1.

**Phá vỡ bất kỳ 1 điều kiện → không deadlock.**

**Prevention vs Avoidance vs Detection:**

| Strategy       | Cách hoạt động                              | Ví dụ                             |
| -------------- | ------------------------------------------- | --------------------------------- |
| **Prevention** | Loại bỏ 1 trong 4 điều kiện                 | Lock ordering (phá circular wait) |
| **Avoidance**  | Kiểm tra trước khi cấp resource             | Banker's algorithm                |
| **Detection**  | Cho deadlock xảy ra rồi phát hiện & recover | Wait-for graph, timeout           |

---

### 🟡 Q: Deadlock trong Go xảy ra như thế nào? Cho ví dụ và cách fix. 🟡 [Mid]

**1. Channel Deadlock — Unbuffered channel, gửi mà không có ai nhận:**

```go
package main

func main() {
    ch := make(chan int) // unbuffered channel

    // DEADLOCK! Main goroutine block ở send,
    // không có goroutine khác để receive.
    ch <- 42 // fatal error: all goroutines are asleep - deadlock!

    // Go runtime phát hiện khi TẤT CẢ goroutines đều block.
}
```

**Fix:** Tạo goroutine riêng để receive hoặc dùng buffered channel.

```go
package main

import "fmt"

func main() {
    ch := make(chan int, 1) // buffered channel size 1
    ch <- 42
    fmt.Println(<-ch) // 42

    // Hoặc dùng goroutine
    ch2 := make(chan int)
    go func() {
        ch2 <- 42
    }()
    fmt.Println(<-ch2) // 42
}
```

**2. Mutex Deadlock — Lock ordering violation:**

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

// DEADLOCK scenario: 2 goroutines lock 2 mutexes ngược thứ tự
func deadlockDemo() {
    var mu1, mu2 sync.Mutex

    // Goroutine 1: lock mu1 → mu2
    go func() {
        mu1.Lock()
        fmt.Println("G1: locked mu1")
        time.Sleep(100 * time.Millisecond) // Tạo window cho deadlock
        mu2.Lock() // Block! G2 đang giữ mu2
        fmt.Println("G1: locked mu2")
        mu2.Unlock()
        mu1.Unlock()
    }()

    // Goroutine 2: lock mu2 → mu1 (NGƯỢC THỨ TỰ!)
    go func() {
        mu2.Lock()
        fmt.Println("G2: locked mu2")
        time.Sleep(100 * time.Millisecond)
        mu1.Lock() // Block! G1 đang giữ mu1
        fmt.Println("G2: locked mu1")
        mu1.Unlock()
        mu2.Unlock()
    }()

    time.Sleep(2 * time.Second)
    fmt.Println("This will never print (deadlock)")
}

// FIX: Luôn lock theo cùng thứ tự
func fixedDemo() {
    var mu1, mu2 sync.Mutex

    lock := func(name string) {
        mu1.Lock() // Luôn lock mu1 trước
        mu2.Lock() // Rồi mu2
        fmt.Printf("%s: locked both mutexes\n", name)
        mu2.Unlock()
        mu1.Unlock()
    }

    go lock("G1")
    go lock("G2")

    time.Sleep(1 * time.Second)
}

func main() {
    fmt.Println("=== Fixed Demo ===")
    fixedDemo()
    // deadlockDemo() // Uncomment to see deadlock
}
```

**3. Goroutine Leak — Goroutine bị block vĩnh viễn:**

```go
package main

import (
    "context"
    "fmt"
    "runtime"
    "time"
)

// LEAK: goroutine gửi vào channel mà không ai nhận
func leakyFunction() <-chan int {
    ch := make(chan int)
    go func() {
        // Nếu caller không nhận từ ch → goroutine này leak forever
        val := expensiveComputation()
        ch <- val // Block vĩnh viễn nếu không ai nhận
    }()
    return ch
}

func expensiveComputation() int {
    time.Sleep(5 * time.Second)
    return 42
}

// FIX: Dùng context để cancel
func safeFunction(ctx context.Context) <-chan int {
    ch := make(chan int, 1) // buffered = 1 để goroutine không leak nếu không ai nhận
    go func() {
        val := expensiveComputation()
        select {
        case ch <- val:
        case <-ctx.Done(): // Thoát nếu context bị cancel
            return
        }
    }()
    return ch
}

func main() {
    fmt.Printf("Goroutines before: %d\n", runtime.NumGoroutine())

    ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
    defer cancel()

    ch := safeFunction(ctx)
    select {
    case val := <-ch:
        fmt.Printf("Got value: %d\n", val)
    case <-ctx.Done():
        fmt.Println("Timeout, goroutine will clean up via context")
    }

    time.Sleep(100 * time.Millisecond) // Đợi goroutine cleanup
    fmt.Printf("Goroutines after: %d\n", runtime.NumGoroutine())
}
```

**Go Race Detector:**

```bash
# Phát hiện data race (KHÔNG phát hiện deadlock ngoài all-goroutines-asleep)
go run -race main.go
go test -race ./...
go build -race -o myapp

# Race detector hoạt động bằng cách instrument memory access tại compile time.
# Overhead: 2-20x slowdown, 5-10x memory.
# PHẢI dùng trong CI/CD test pipeline!
```

```go
package main

import (
    "fmt"
    "sync"
)

// DATA RACE example (go run -race sẽ báo)
func raceExample() {
    counter := 0
    var wg sync.WaitGroup

    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            counter++ // DATA RACE! Concurrent read+write without sync
        }()
    }
    wg.Wait()
    fmt.Println("Counter:", counter) // Kết quả không deterministic
}

// FIX with mutex
func fixedRaceExample() {
    counter := 0
    var mu sync.Mutex
    var wg sync.WaitGroup

    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            mu.Lock()
            counter++
            mu.Unlock()
        }()
    }
    wg.Wait()
    fmt.Println("Counter:", counter) // Luôn = 1000
}

func main() {
    raceExample()
    fixedRaceExample()
}
```

> **Interview Tip (Axon, Employment Hero):** Deadlock là câu hỏi yêu thích. Pattern phổ biến: "Tìm bug trong code này" → thường là lock ordering, channel deadlock, hoặc goroutine leak. Nhắc đến `-race` flag và `go vet` để detect.

---

## 6. I/O Models

### 🟡 Q: Giải thích 5 I/O Models. 🟡 [Mid]

**1. Blocking I/O:**

- Thread gọi `read()` → block cho đến khi data sẵn sàng.
- Đơn giản nhưng 1 thread chỉ handle 1 connection.
- Cần thread-per-connection model → tốn memory cho nhiều connections.

**2. Non-blocking I/O:**

- `read()` trả về ngay lập tức: có data → trả data, không có → trả EAGAIN.
- Application phải polling liên tục → **busy waiting**, tốn CPU.

**3. I/O Multiplexing (select/poll/epoll):**

- 1 thread monitor nhiều file descriptors cùng lúc.
- **select:** Limited (FD_SETSIZE = 1024), O(n) scan.
- **poll:** Không giới hạn FDs, nhưng vẫn O(n) scan.
- **epoll (Linux):** O(1) cho event notification, chỉ trả về FDs có events. Dùng cho high-performance servers.
- **kqueue (macOS/BSD):** Tương tự epoll.

```
         select/poll                    epoll
    ┌─────────────────┐          ┌─────────────────┐
    │ Check ALL fds   │          │ Kernel notifies  │
    │ every time O(n) │          │ only READY fds   │
    │                 │          │ O(1) per event   │
    └─────────────────┘          └─────────────────┘
```

**4. Signal-driven I/O:**

- Kernel gửi signal (SIGIO) khi data ready.
- Application handle signal → read data.
- Ít dùng trong practice.

**5. Asynchronous I/O (AIO / io_uring):**

- Application submit request → kernel xử lý hoàn toàn → thông báo khi xong.
- **io_uring (Linux 5.1+):** Modern async I/O, shared ring buffers giữa user/kernel space. Zero-copy capable.
- Thực sự async (cả wait for data + copy data đều do kernel).

**So sánh:**

| Model            | Wait for data         | Copy data      | Blocking?            |
| ---------------- | --------------------- | -------------- | -------------------- |
| Blocking I/O     | Block                 | Block          | Yes                  |
| Non-blocking I/O | Poll (EAGAIN)         | Block          | Partially            |
| I/O Multiplexing | Block on select/epoll | Block          | Yes (on multiplexer) |
| Signal-driven    | Signal notification   | Block          | Partially            |
| Async I/O        | Kernel handles        | Kernel handles | No                   |

---

### 🔴 Q: Go netpoller hoạt động như thế nào? Tại sao blocking I/O trong Go lại hiệu quả? 🔴 [Senior]

**Go netpoller** là lớp trừu tượng trên epoll/kqueue, cho phép goroutines viết code "blocking" nhưng runtime xử lý bằng I/O multiplexing.

```
┌────────────────────────────────────────────────┐
│                  Application                    │
│                                                 │
│   Goroutine 1     Goroutine 2     Goroutine 3  │
│   conn.Read()     conn.Read()     conn.Write() │
│       │               │               │        │
│       │  "blocking"   │  "blocking"   │        │
│       ▼               ▼               ▼        │
│   ┌─────────────────────────────────────────┐  │
│   │           Go Runtime Netpoller           │  │
│   │                                          │  │
│   │  • Goroutine "parks" (gopark)            │  │
│   │  • FD registered with epoll/kqueue       │  │
│   │  • Goroutine removed from P's run queue  │  │
│   │  • P picks another runnable goroutine    │  │
│   │                                          │  │
│   │  When I/O ready:                         │  │
│   │  • epoll_wait returns ready FDs          │  │
│   │  • Goroutine "unparked" (goready)        │  │
│   │  • Back to run queue                     │  │
│   └─────────────────────────────────────────┘  │
│                      │                          │
│                      ▼                          │
│              ┌──────────────┐                   │
│              │  epoll/kqueue │  (1 thread polls) │
│              │  (OS kernel)  │                   │
│              └──────────────┘                   │
└────────────────────────────────────────────────┘
```

**Flow khi goroutine gọi `conn.Read()`:**

1. Goroutine gọi `conn.Read()`.
2. Runtime thử non-blocking read. Nếu EAGAIN (no data yet):
3. Register FD với netpoller (epoll_ctl).
4. **Park goroutine** — chuyển status sang `_Gwaiting`, remove khỏi P's LRQ.
5. P lấy goroutine khác để chạy → **OS thread KHÔNG bị block!**
6. `sysmon` goroutine hoặc dedicated netpoller thread gọi `epoll_wait`.
7. Khi data ready → epoll_wait trả về FD → **unpark goroutine** → đưa lại vào run queue.
8. Goroutine resume, `Read()` trả về data.

**Tại sao hiệu quả?**

- Developer viết code đơn giản (sequential, blocking style).
- Runtime dùng epoll/kqueue (best-in-class I/O multiplexing).
- Goroutine park/unpark rẻ (~100ns, user-space, không kernel switch).
- 1 OS thread có thể "serve" hàng nghìn goroutines (khi chúng waiting I/O).
- Kết quả: **millions of concurrent connections** với code đơn giản.

```go
package main

import (
    "fmt"
    "io"
    "net"
    "sync/atomic"
    "time"
)

// Simple TCP echo server — code looks blocking but uses netpoller internally
func main() {
    var activeConns int64

    listener, err := net.Listen("tcp", ":8080")
    if err != nil {
        panic(err)
    }
    defer listener.Close()
    fmt.Println("Echo server listening on :8080")

    for {
        conn, err := listener.Accept() // "Blocks" but actually parks goroutine
        if err != nil {
            fmt.Printf("Accept error: %v\n", err)
            continue
        }

        atomic.AddInt64(&activeConns, 1)

        go func(c net.Conn) { // 1 goroutine per connection — cheap!
            defer func() {
                c.Close()
                atomic.AddInt64(&activeConns, -1)
            }()

            c.SetDeadline(time.Now().Add(30 * time.Second))

            buf := make([]byte, 4096)
            for {
                n, err := c.Read(buf) // "Blocks" but goroutine parks, OS thread freed
                if err != nil {
                    if err != io.EOF {
                        fmt.Printf("Read error: %v\n", err)
                    }
                    return
                }
                _, err = c.Write(buf[:n]) // Same — non-blocking under the hood
                if err != nil {
                    return
                }
            }
        }(conn)

        fmt.Printf("Active connections: %d\n", atomic.LoadInt64(&activeConns))
    }
}
```

**So sánh models:**

| Approach                  | Connections/thread   | Code complexity     | Example            |
| ------------------------- | -------------------- | ------------------- | ------------------ |
| Thread-per-connection     | 1                    | Simple              | Java (traditional) |
| Event loop (epoll manual) | Many                 | Complex (callbacks) | Node.js, Nginx     |
| Goroutine-per-connection  | Many (via netpoller) | Simple              | **Go**             |

> **Interview Tip (Google, Grab):** Đây là câu hỏi kinh điển phân biệt Middle vs Senior Go developer. Phải giải thích được: goroutine park (gopark) khi I/O chưa ready, netpoller dùng epoll/kqueue, sysmon goroutine poll epoll, và tại sao code "blocking" lại scalable. Vẽ diagram khi phỏng vấn.

---

## 7. File Systems

### 🟢 Q: Giải thích inode, directory, và file descriptor. 🟢 [Junior]

**Inode:**

- Mỗi file/directory trên disk có 1 inode chứa metadata.
- Inode chứa: permissions, owner, size, timestamps, **pointers to data blocks**.
- Inode KHÔNG chứa filename — filename nằm trong directory entry.
- Inode number là unique identifier trong filesystem.

**Directory:**

- Là file đặc biệt chứa danh sách `(filename, inode_number)` pairs.
- Hard link = thêm entry trỏ đến cùng inode. Symbolic link = file mới chứa path.

**File Descriptor (FD):**

- Integer đại diện cho file đang mở trong process.
- 0 = stdin, 1 = stdout, 2 = stderr.
- Process → FD table → Open File table (shared) → Inode table.

```
Process FD Table    System Open File Table    Inode Table
┌───┬──────┐       ┌─────────────────┐       ┌──────────┐
│ 0 │ ──────────▶ │ offset, flags   │──────▶│ inode    │
│ 1 │ ──────────▶ │ offset, flags   │──────▶│ metadata │
│ 2 │ ──────────▶ │ offset, flags   │──────▶│ blocks   │
│ 3 │ ──────────▶ │ offset, flags   │──────▶│          │
└───┴──────┘       └─────────────────┘       └──────────┘
```

---

### 🟡 Q: Journaling file system hoạt động thế nào? 🟡 [Mid]

**Journaling** ghi thay đổi vào journal (log) trước khi ghi vào filesystem thật → crash recovery.

**Ext4 journaling modes:**

- **Journal:** Ghi cả metadata + data vào journal trước. An toàn nhất, chậm nhất.
- **Ordered (default):** Ghi data trước, rồi metadata vào journal. Cân bằng.
- **Writeback:** Chỉ journal metadata. Nhanh nhất, data có thể corrupt nếu crash.

**Write flow (ordered mode):**

1. Ghi data blocks vào disk.
2. Ghi metadata changes vào journal.
3. Commit journal transaction.
4. Ghi metadata vào vị trí thật trên disk.
5. Mark journal entry as done.

**Crash → recovery:** Replay journal entries chưa complete.

---

### 🟡 Q: Go code làm việc với files. 🟡 [Mid]

```go
package main

import (
    "bufio"
    "fmt"
    "io/fs"
    "os"
    "path/filepath"
    "syscall"
)

// Basic file operations
func basicFileOps() {
    // Create/Write
    f, err := os.Create("example.txt")
    if err != nil {
        panic(err)
    }

    _, err = f.WriteString("Hello, OS!\n")
    if err != nil {
        f.Close()
        panic(err)
    }
    f.Close()

    // Read
    data, err := os.ReadFile("example.txt")
    if err != nil {
        panic(err)
    }
    fmt.Printf("Content: %s", data)

    // File info (maps to inode metadata)
    info, err := os.Stat("example.txt")
    if err != nil {
        panic(err)
    }
    fmt.Printf("Name: %s, Size: %d, Mode: %v, ModTime: %v\n",
        info.Name(), info.Size(), info.Mode(), info.ModTime())

    // Access underlying syscall stat (Linux-specific inode info)
    if stat, ok := info.Sys().(*syscall.Stat_t); ok {
        fmt.Printf("Inode: %d, Hard links: %d, UID: %d, GID: %d\n",
            stat.Ino, stat.Nlink, stat.Uid, stat.Gid)
    }

    os.Remove("example.txt")
}

// Walk directory tree using filepath.WalkDir (Go 1.16+, faster than Walk)
func walkDirectory() {
    fmt.Println("\n=== Directory Walk ===")
    err := filepath.WalkDir(".", func(path string, d fs.DirEntry, err error) error {
        if err != nil {
            return err
        }
        info, _ := d.Info()
        if info != nil {
            fmt.Printf("%s  %8d  %s\n", info.Mode(), info.Size(), path)
        }
        return nil
    })
    if err != nil {
        fmt.Printf("Walk error: %v\n", err)
    }
}

// Buffered I/O for performance
func bufferedIO() {
    f, _ := os.Create("buffered_example.txt")
    defer os.Remove("buffered_example.txt")
    defer f.Close()

    // bufio.Writer batches writes → fewer syscalls
    writer := bufio.NewWriterSize(f, 4096) // 4KB buffer
    for i := 0; i < 1000; i++ {
        fmt.Fprintf(writer, "Line %d\n", i)
    }
    writer.Flush() // Don't forget to flush!
}

// File locking using syscall.Flock
func fileLocking() {
    f, err := os.OpenFile("lockfile.lock", os.O_CREATE|os.O_WRONLY, 0644)
    if err != nil {
        panic(err)
    }
    defer f.Close()
    defer os.Remove("lockfile.lock")

    // Advisory lock (other processes should cooperate)
    err = syscall.Flock(int(f.Fd()), syscall.LOCK_EX|syscall.LOCK_NB)
    if err != nil {
        fmt.Println("Could not acquire lock:", err)
        return
    }
    fmt.Println("Lock acquired!")
    defer syscall.Flock(int(f.Fd()), syscall.LOCK_UN)

    // Do work while holding lock
    f.WriteString("locked data\n")
}

func main() {
    basicFileOps()
    walkDirectory()
    bufferedIO()
    fileLocking()
}
```

> **Interview Tip (Employment Hero, Axon):** File system questions thường gắn với practical scenarios: "Làm sao đảm bảo 2 instances của app không ghi cùng file?" → File locking. "Tại sao app chậm khi ghi nhiều file nhỏ?" → Buffered I/O, batch writes.

---

## 8. Linux Internals (for Containerization)

### 🟡 Q: Namespaces trong Linux là gì? Docker dùng chúng như thế nào? 🟡 [Mid]

**Namespaces** tạo isolation cho processes, mỗi namespace giới hạn "view" của process về 1 tài nguyên hệ thống.

| Namespace   | Isolates         | Flag              | Ví dụ                                 |
| ----------- | ---------------- | ----------------- | ------------------------------------- |
| **PID**     | Process IDs      | `CLONE_NEWPID`    | Container thấy PID 1 là entrypoint    |
| **Network** | Network stack    | `CLONE_NEWNET`    | Container có network interface riêng  |
| **Mount**   | Mount points     | `CLONE_NEWNS`     | Container có filesystem riêng         |
| **UTS**     | Hostname, domain | `CLONE_NEWUTS`    | Container có hostname riêng           |
| **IPC**     | IPC resources    | `CLONE_NEWIPC`    | Shared memory, semaphores riêng       |
| **User**    | UID/GID mappings | `CLONE_NEWUSER`   | Root trong container ≠ root trên host |
| **Cgroup**  | Cgroup root      | `CLONE_NEWCGROUP` | Container thấy cgroup riêng           |

```
Host OS
├── PID Namespace (host)
│   ├── PID 1 (init/systemd)
│   ├── PID 100 (dockerd)
│   └── PID Namespace (container A)
│       ├── PID 1 (nginx)        ← PID 1 trong container = PID 200 trên host
│       └── PID 2 (worker)
│   └── PID Namespace (container B)
│       ├── PID 1 (python app)
│       └── PID 2 (celery)
```

---

### 🟡 Q: Cgroups là gì? Cách giới hạn resources. 🟡 [Mid]

**Cgroups (Control Groups)** giới hạn, theo dõi, và isolate resource usage của process groups.

**Cgroups v2 controllers:**

| Controller | Giới hạn        | File                           |
| ---------- | --------------- | ------------------------------ |
| **cpu**    | CPU time/shares | `cpu.max`, `cpu.weight`        |
| **memory** | RAM usage       | `memory.max`, `memory.current` |
| **io**     | Disk I/O        | `io.max`, `io.stat`            |
| **pids**   | Số processes    | `pids.max`                     |

**Docker = Namespaces + Cgroups + Union Filesystem:**

```
Docker Container = Namespaces (isolation)
                 + Cgroups (resource limits)
                 + Union FS/OverlayFS (layered filesystem)
                 + Seccomp + AppArmor/SELinux (security)
```

**Docker resource limits → cgroups:**

```bash
# Docker sẽ tạo cgroup entries
docker run --cpus=2 --memory=512m --pids-limit=100 myapp

# Tương đương cgroup settings:
# /sys/fs/cgroup/docker/<container-id>/cpu.max = "200000 100000"   (2 CPUs)
# /sys/fs/cgroup/docker/<container-id>/memory.max = 536870912      (512MB)
# /sys/fs/cgroup/docker/<container-id>/pids.max = 100
```

---

### 🟡 Q: /proc filesystem — Các entries quan trọng. 🟡 [Mid]

`/proc` là virtual filesystem cung cấp thông tin kernel/process.

| Path                             | Mô tả                                |
| -------------------------------- | ------------------------------------ |
| `/proc/[pid]/status`             | Trạng thái process (memory, threads) |
| `/proc/[pid]/maps`               | Memory mappings                      |
| `/proc/[pid]/fd/`                | Open file descriptors                |
| `/proc/[pid]/limits`             | Resource limits (ulimit)             |
| `/proc/[pid]/cgroup`             | Cgroup membership                    |
| `/proc/cpuinfo`                  | CPU information                      |
| `/proc/meminfo`                  | Memory usage                         |
| `/proc/loadavg`                  | System load averages                 |
| `/proc/net/tcp`                  | TCP connections                      |
| `/proc/sys/vm/overcommit_memory` | Memory overcommit policy             |

---

### 🔴 Q: Go code tương tác với Linux syscalls. 🔴 [Senior]

```go
//go:build linux

package main

import (
    "fmt"
    "os"
    "runtime"
    "syscall"
)

// Đọc thông tin từ /proc
func readProcInfo() {
    pid := os.Getpid()

    // Read process status
    data, err := os.ReadFile(fmt.Sprintf("/proc/%d/status", pid))
    if err != nil {
        fmt.Printf("Error reading /proc: %v\n", err)
        return
    }
    fmt.Printf("=== /proc/%d/status ===\n%s\n", pid, string(data[:500]))

    // Read memory info
    meminfo, err := os.ReadFile("/proc/meminfo")
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    fmt.Printf("=== /proc/meminfo (first 500 bytes) ===\n%s\n", string(meminfo[:500]))
}

// Get system info using syscall
func sysInfo() {
    var info syscall.Sysinfo_t
    err := syscall.Sysinfo(&info)
    if err != nil {
        fmt.Printf("Sysinfo error: %v\n", err)
        return
    }

    fmt.Printf("=== System Info ===\n")
    fmt.Printf("Uptime: %d seconds\n", info.Uptime)
    fmt.Printf("Total RAM: %d MB\n", info.Totalram/1024/1024)
    fmt.Printf("Free RAM: %d MB\n", info.Freeram/1024/1024)
    fmt.Printf("Procs: %d\n", info.Procs)
}

// Set resource limits (useful for self-contained apps)
func setResourceLimits() {
    // Get current file descriptor limit
    var rLimit syscall.Rlimit
    err := syscall.Getrlimit(syscall.RLIMIT_NOFILE, &rLimit)
    if err != nil {
        fmt.Printf("Getrlimit error: %v\n", err)
        return
    }
    fmt.Printf("File descriptors — Cur: %d, Max: %d\n", rLimit.Cur, rLimit.Max)

    // Try to increase (may need root)
    rLimit.Cur = 65536
    err = syscall.Setrlimit(syscall.RLIMIT_NOFILE, &rLimit)
    if err != nil {
        fmt.Printf("Setrlimit error (need root?): %v\n", err)
    }
}

// Lock OS thread — useful for namespace operations
func lockThread() {
    // LockOSThread locks the calling goroutine to its current OS thread.
    // Cần thiết khi làm việc với namespaces vì namespace gắn với thread.
    runtime.LockOSThread()
    defer runtime.UnlockOSThread()

    fmt.Printf("Goroutine locked to OS thread. PID: %d, TID: %d\n",
        os.Getpid(), syscall.Gettid())
}

func main() {
    readProcInfo()
    sysInfo()
    setResourceLimits()
    lockThread()
}
```

> **Interview Tip (Grab, Google):** Container questions rất phổ biến cho Senior. Phải hiểu: Docker KHÔNG phải VM, nó dùng kernel features (namespaces + cgroups). "Docker container bị OOM killed" → cgroup memory limit. "Container không thấy host network" → network namespace.

---

## 9. Signals

### 🟢 Q: Các signals quan trọng trong Linux. 🟢 [Junior]

| Signal      | Number | Default Action | Mô tả                                     | Catchable? |
| ----------- | ------ | -------------- | ----------------------------------------- | ---------- |
| **SIGTERM** | 15     | Terminate      | Yêu cầu terminate gracefully              | Yes        |
| **SIGKILL** | 9      | Terminate      | Kill ngay lập tức                         | **No**     |
| **SIGINT**  | 2      | Terminate      | Ctrl+C từ terminal                        | Yes        |
| **SIGHUP**  | 1      | Terminate      | Terminal disconnected / reload config     | Yes        |
| **SIGUSR1** | 10     | Terminate      | User-defined (thường dùng cho log rotate) | Yes        |
| **SIGUSR2** | 12     | Terminate      | User-defined                              | Yes        |
| **SIGSTOP** | 19     | Stop           | Pause process                             | **No**     |
| **SIGCONT** | 18     | Continue       | Resume process                            | Yes        |
| **SIGCHLD** | 17     | Ignore         | Child process terminated                  | Yes        |
| **SIGPIPE** | 13     | Terminate      | Write to pipe with no reader              | Yes        |

**Lưu ý cho Go:**

- Go runtime handle một số signals đặc biệt.
- SIGURG dùng nội bộ cho preemption (Go 1.14+).
- SIGPIPE: Go mặc định ignore khi write to closed pipe trên non-socket FDs.

---

### 🟡 Q: Viết graceful shutdown pattern trong Go. 🟡 [Mid]

```go
package main

import (
    "context"
    "errors"
    "fmt"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"
)

func main() {
    // ========================================
    // Graceful Shutdown Pattern (Production)
    // ========================================

    // 1. Setup HTTP server
    mux := http.NewServeMux()
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        // Simulate slow request
        time.Sleep(2 * time.Second)
        fmt.Fprintf(w, "Hello, World!")
    })
    mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
        fmt.Fprintf(w, "OK")
    })

    server := &http.Server{
        Addr:         ":8080",
        Handler:      mux,
        ReadTimeout:  15 * time.Second,
        WriteTimeout: 15 * time.Second,
        IdleTimeout:  60 * time.Second,
    }

    // 2. Channel nhận shutdown signals
    // Buffer size = 1 để signal không bị drop
    quit := make(chan os.Signal, 1)
    signal.Notify(quit,
        syscall.SIGINT,  // Ctrl+C
        syscall.SIGTERM, // docker stop, kill -15, Kubernetes termination
    )

    // 3. Start server trong goroutine
    go func() {
        fmt.Println("Server starting on :8080")
        if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
            fmt.Printf("Server error: %v\n", err)
            os.Exit(1)
        }
    }()

    // 4. Block waiting for signal
    sig := <-quit
    fmt.Printf("\nReceived signal: %v. Shutting down gracefully...\n", sig)

    // 5. Graceful shutdown with timeout
    // Cho phép in-flight requests hoàn thành trong 30 giây
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    // Shutdown stops accepting new requests and waits for in-flight to finish
    if err := server.Shutdown(ctx); err != nil {
        fmt.Printf("Server forced to shutdown: %v\n", err)
        os.Exit(1)
    }

    // 6. Cleanup resources
    fmt.Println("Closing database connections...")
    // db.Close()
    fmt.Println("Flushing logs...")
    // logger.Sync()
    fmt.Println("Server exited gracefully")
}
```

**Advanced: Multiple services graceful shutdown:**

```go
package main

import (
    "context"
    "fmt"
    "os"
    "os/signal"
    "sync"
    "syscall"
    "time"
)

// Service interface cho graceful shutdown
type Service interface {
    Start(ctx context.Context) error
    Stop(ctx context.Context) error
    Name() string
}

// GracefulManager quản lý lifecycle của nhiều services
type GracefulManager struct {
    services []Service
}

func (gm *GracefulManager) Register(s Service) {
    gm.services = append(gm.services, s)
}

func (gm *GracefulManager) Run() error {
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()

    // Start all services
    var wg sync.WaitGroup
    errCh := make(chan error, len(gm.services))

    for _, svc := range gm.services {
        wg.Add(1)
        go func(s Service) {
            defer wg.Done()
            fmt.Printf("[%s] Starting...\n", s.Name())
            if err := s.Start(ctx); err != nil {
                errCh <- fmt.Errorf("[%s] start error: %w", s.Name(), err)
            }
        }(svc)
    }

    // Wait for shutdown signal
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

    select {
    case sig := <-quit:
        fmt.Printf("\nReceived %v, initiating graceful shutdown...\n", sig)
    case err := <-errCh:
        fmt.Printf("Service error: %v, shutting down...\n", err)
    }

    // Cancel context to signal all services
    cancel()

    // Stop all services with timeout (reverse order)
    shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer shutdownCancel()

    for i := len(gm.services) - 1; i >= 0; i-- {
        svc := gm.services[i]
        fmt.Printf("[%s] Stopping...\n", svc.Name())
        if err := svc.Stop(shutdownCtx); err != nil {
            fmt.Printf("[%s] Stop error: %v\n", svc.Name(), err)
        } else {
            fmt.Printf("[%s] Stopped\n", svc.Name())
        }
    }

    wg.Wait()
    return nil
}

func main() {
    manager := &GracefulManager{}
    // manager.Register(httpService)
    // manager.Register(grpcService)
    // manager.Register(workerService)
    _ = manager.Run()
}
```

> **Interview Tip (tất cả companies):** Graceful shutdown là câu hỏi thực tế rất phổ biến. Key points: `signal.Notify` với buffered channel, `http.Server.Shutdown()`, context with timeout, cleanup resources theo reverse order. Kubernetes gửi SIGTERM trước khi SIGKILL (grace period 30s mặc định).

---

## 10. Context Switching

### 🟡 Q: Chuyện gì xảy ra khi context switch? 🟡 [Mid]

**Process Context Switch (đắt nhất):**

1. Save toàn bộ CPU registers, program counter vào PCB.
2. Save memory management info (page table base register).
3. **Flush TLB** (cache page table entries bị invalid vì address space khác).
4. Update process state (running → ready/waiting).
5. Select next process (scheduler decision).
6. Load PCB mới: registers, program counter.
7. Load page table base register mới.
8. TLB phải warm up lại (cold TLB → page table walks → chậm).

**Thread Context Switch (rẻ hơn process):**

1. Save registers, program counter, stack pointer.
2. **KHÔNG flush TLB** (cùng address space).
3. Load registers, stack pointer mới.
4. Vẫn cần kernel mode switch (system call overhead).

**Goroutine Context Switch (rẻ nhất):**

1. Save chỉ ~15 registers (callee-saved) + stack pointer + program counter.
2. **KHÔNG flush TLB, KHÔNG kernel mode switch.**
3. Chỉ thay đổi goroutine context trong Go runtime (user-space).
4. Schedule goroutine mới trên cùng OS thread.

---

### 🔴 Q: So sánh chi phí context switch. 🔴 [Senior]

| Metric              | Process Switch      | Thread Switch | Goroutine Switch     |
| ------------------- | ------------------- | ------------- | -------------------- |
| **Time**            | ~1-10μs             | ~1-5μs        | ~100-200ns           |
| **TLB flush**       | Yes                 | No            | No                   |
| **Kernel mode**     | Yes                 | Yes           | **No**               |
| **Registers saved** | All + FPU + MMX/SSE | All + FPU     | ~15 (callee-saved)   |
| **Memory overhead** | New address space   | ~1-8MB stack  | ~2-8KB stack         |
| **Cache impact**    | Heavy (cold cache)  | Moderate      | Minimal              |
| **Triggered by**    | OS scheduler        | OS scheduler  | Go runtime scheduler |

**Tại sao goroutine switch rẻ:**

1. **User-space:** Không cần `syscall` để chuyển context → không trap vào kernel.
2. **Ít registers:** Go compiler biết goroutine cần save gì (chỉ callee-saved registers theo Go ABI).
3. **Không TLB flush:** Tất cả goroutines trong 1 process share address space.
4. **Stack nhỏ:** 2-8KB start, growable. OS thread cần reserve 1-8MB.
5. **Cooperative points:** Goroutine switch thường tại known points (function call, channel op, I/O) → compiler tối ưu register allocation.

```go
package main

import (
    "fmt"
    "runtime"
    "sync"
    "time"
)

// Benchmark goroutine context switch
func benchGoroutineSwitch() {
    runtime.GOMAXPROCS(1) // Force 1 CPU để measure context switch

    n := 1_000_000
    ch := make(chan struct{})

    var wg sync.WaitGroup
    wg.Add(2)

    start := time.Now()

    // Ping goroutine
    go func() {
        defer wg.Done()
        for i := 0; i < n; i++ {
            ch <- struct{}{} // send → switch to pong
            <-ch             // receive → switch from pong
        }
    }()

    // Pong goroutine
    go func() {
        defer wg.Done()
        for i := 0; i < n; i++ {
            <-ch             // receive → switch from ping
            ch <- struct{}{} // send → switch to ping
        }
    }()

    wg.Wait()
    elapsed := time.Since(start)

    // Mỗi iteration = 2 context switches (ping→pong, pong→ping)
    // Nhưng cũng bao gồm channel overhead, nên đây là upper bound
    totalSwitches := n * 2
    fmt.Printf("Total switches: %d\n", totalSwitches)
    fmt.Printf("Total time: %v\n", elapsed)
    fmt.Printf("Per switch: %v\n", elapsed/time.Duration(totalSwitches))
}

func main() {
    benchGoroutineSwitch()
    // Typical output: Per switch: ~100-300ns
    // So sánh: OS thread context switch: ~1-5μs (10-50x slower)
}
```

> **Interview Tip (Google, Microsoft):** Context switching cost là fundamental knowledge. Key insight: goroutine switch rẻ vì hoàn toàn user-space. Nhưng phải biết giới hạn: nếu goroutine bị block ở syscall (không phải network I/O) → M bị block → runtime phải tạo M mới (thread creation cost).

---

## 11. Cheat Sheet & Interview Tips

### OS Concepts Cheat Sheet

```
┌────────────────────────────────────────────────────────────────┐
│                    OS CONCEPTS CHEAT SHEET                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  PROCESS vs THREAD vs GOROUTINE                                │
│  ┌──────────┬───────────┬─────────────┬──────────────┐        │
│  │          │  Process  │   Thread    │  Goroutine   │        │
│  ├──────────┼───────────┼─────────────┼──────────────┤        │
│  │ Memory   │ Separate  │ Shared heap │ Shared all   │        │
│  │ Stack    │ Separate  │ 1-8MB fixed │ 2-8KB grow   │        │
│  │ Create   │ ~ms       │ ~10-100μs   │ ~1-2μs       │        │
│  │ Switch   │ ~1-10μs   │ ~1-5μs      │ ~100-200ns   │        │
│  │ Max #    │ ~100s     │ ~1000s      │ ~millions    │        │
│  │ TLB flush│ Yes       │ No          │ No           │        │
│  └──────────┴───────────┴─────────────┴──────────────┘        │
│                                                                │
│  GO SCHEDULER (GMP)                                            │
│  G = Goroutine (millions) → P = Processor (GOMAXPROCS)         │
│  → M = Machine/OS Thread (bounded by GOMAXPROCS in practice)   │
│  Work-stealing: idle P steals from other P's LRQ or GRQ        │
│  Preemption: Go 1.14+ async via SIGURG after ~10ms             │
│                                                                │
│  MEMORY ALLOCATION                                             │
│  Tiny (<16B) → Small (16B-32KB): mcache→mcentral→mheap        │
│  Large (>32KB): directly from mheap                            │
│  Escape analysis: go build -gcflags="-m"                       │
│  Debug: GODEBUG=gctrace=1, runtime.ReadMemStats                │
│                                                                │
│  I/O MODELS                                                    │
│  Blocking → Non-blocking → Multiplexing → Async                │
│  Go netpoller: goroutine parks on epoll/kqueue                 │
│  "Blocking" code + non-blocking runtime = best of both worlds  │
│                                                                │
│  DEADLOCK CONDITIONS (Coffman)                                 │
│  1. Mutual Exclusion  3. No Preemption                         │
│  2. Hold and Wait     4. Circular Wait                         │
│  Go: go run -race, channel deadlocks, lock ordering            │
│                                                                │
│  LINUX CONTAINERS                                              │
│  Docker = Namespaces (isolation) + Cgroups (limits)            │
│         + OverlayFS (layers) + Seccomp (syscall filter)        │
│  Key namespaces: PID, Network, Mount, UTS, IPC, User           │
│  Key cgroups: cpu.max, memory.max, pids.max                    │
│                                                                │
│  SIGNALS & GRACEFUL SHUTDOWN                                   │
│  signal.Notify(quit, SIGINT, SIGTERM)                          │
│  server.Shutdown(ctx) → drain in-flight requests               │
│  Context with timeout for cleanup deadline                     │
│                                                                │
│  PAGE REPLACEMENT                                              │
│  FIFO: Simple, Belady's anomaly                                │
│  LRU: Best practical, hardware-assisted                        │
│  LFU: Frequency-based, aging needed                            │
│                                                                │
│  FILE SYSTEMS                                                  │
│  Inode: metadata (no filename). Dir: (name, inode) pairs.      │
│  FD table → Open File table → Inode table                      │
│  Journaling: journal → ordered → writeback (speed vs safety)   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Company-Specific Focus Areas

| Company             | Primary Focus                                       | Secondary Focus             | Typical Questions                                                             |
| ------------------- | --------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------- |
| **Google**          | GMP scheduler, Memory management, Context switching | I/O models, Linux internals | "Explain Go scheduler in detail", "How does Go handle million connections?"   |
| **Grab**            | Concurrency (goroutines), I/O models, Deadlocks     | Containers, Signals         | "Design concurrent data pipeline", "How to handle graceful shutdown in K8s?"  |
| **Zalo**            | IPC, Networking (sockets), Memory                   | Process/Thread, Scheduling  | "How do microservices communicate?", "Optimize memory for chat server"        |
| **Axon**            | Deadlocks, Race conditions, File systems            | Signals, Linux security     | "Find the bug in this concurrent code", "Explain data race vs race condition" |
| **Employment Hero** | Practical: Graceful shutdown, Docker, IPC           | Deadlocks, Memory           | "How to deploy Go app in container?", "Handle SIGTERM in K8s pod"             |
| **Microsoft**       | Memory management, Virtual memory, Scheduling       | File systems, Process model | "Explain virtual memory and TLB", "Stack vs Heap in Go"                       |

### Common Interview Questions List

**🟢 Junior Level:**

1. Process và thread khác nhau thế nào?
2. Goroutine khác gì OS thread?
3. Deadlock là gì? 4 điều kiện Coffman?
4. Virtual memory hoạt động ra sao?
5. Stack vs Heap allocation?
6. SIGTERM vs SIGKILL?
7. File descriptor là gì?
8. IPC có những phương thức nào?

**🟡 Middle Level:**

9. Giải thích GMP model trong Go scheduler.
10. Go netpoller hoạt động thế nào?
11. Tại sao goroutine context switch rẻ?
12. Escape analysis trong Go là gì? Ảnh hưởng performance ra sao?
13. Viết graceful shutdown pattern cho HTTP server.
14. Docker dùng Linux features nào để tạo containers?
15. LRU page replacement hoạt động thế nào? Implement LRU cache.
16. Giải thích Blocking vs Non-blocking vs Async I/O.
17. Go memory allocator hoạt động ra sao? (mcache → mcentral → mheap)
18. Viết code phát hiện và fix goroutine leak.

**🔴 Senior Level:**

19. So sánh chi tiết context switch cost: process vs thread vs goroutine. Giải thích tại sao mỗi cái tốn bao nhiêu.
20. Go scheduler: work-stealing algorithm, sysmon goroutine, cooperative vs preemptive scheduling (Go 1.14+ changes).
21. Khi nào goroutine bị block ở syscall thật sự (không phải network I/O)? Runtime xử lý thế nào? (hand-off P to another M)
22. Thiết kế server handle 1M concurrent connections trong Go. Giải thích từ OS level lên application level.
23. Cgroups v2 vs v1. Cách tune cgroup settings cho Go application (GOMAXPROCS in container).
24. Go GC hoạt động thế nào? (Tri-color mark & sweep, write barrier, GC pauses). Cách tune: GOGC, GOMEMLIMIT.
25. `io_uring` là gì? Go có dùng không? So sánh với epoll-based netpoller.
26. Giải thích toàn bộ flow: user gõ URL → browser → DNS → TCP → HTTP → Go server accept → goroutine handle → response, ở mỗi layer liên quan OS concepts nào?
27. Linux OOM killer hoạt động thế nào? Cách protect Go service khỏi OOM? (cgroups memory limit, GOMEMLIMIT, monitoring)
28. Giải thích memory-mapped files (mmap). Khi nào dùng mmap vs read/write trong Go? (`syscall.Mmap`)

---

### Quick Review Trước Phỏng Vấn (5 phút)

**Nếu chỉ có 5 phút, nhớ:**

1. **Goroutine = user-space thread, 2KB stack, ~200ns switch, M:N model trên GMP.**
2. **Go netpoller = epoll/kqueue bên dưới. "Blocking" Go code thực ra non-blocking ở OS level.**
3. **Deadlock = 4 điều kiện Coffman. Go: channel deadlock, lock ordering, goroutine leak. Dùng `-race`.**
4. **Docker = Namespaces (isolation) + Cgroups (limits). Không phải VM.**
5. **Graceful shutdown = signal.Notify + server.Shutdown(ctx) + context.WithTimeout.**
6. **Memory: stack (auto, fast, local) vs heap (GC, slower, escaped). `go build -gcflags="-m"` để check.**
7. **I/O: Blocking → epoll/kqueue → Go netpoller wraps epoll for goroutine-friendly I/O.**

---

> **Final Tip:** Khi phỏng vấn OS, luôn kết nối lý thuyết với Go implementation. Đừng chỉ nói "virtual memory uses paging" — nói thêm "Go memory allocator dùng mmap để lấy memory từ OS, chia thành spans, quản lý qua mcache/mcentral/mheap hierarchy." Điều này thể hiện bạn không chỉ học lý thuyết mà còn hiểu implementation thực tế.

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: How does a goroutine differ from an OS thread, and what are the scheduling implications? / Goroutine khác OS thread như thế nào và hệ quả về scheduling là gì? 🟡 Mid

**A:** A goroutine is a user-space, cooperatively-and-preemptively scheduled unit of execution managed by the Go runtime (GMP model). It starts at 2KB stack (grows dynamically up to 1GB), vs OS thread which starts at 1–8MB fixed stack. Context switching between goroutines costs ~200ns vs ~1–10µs for OS threads (no kernel involvement).

Vietnamese explanation: Go runtime dùng M:N threading — M goroutines chạy trên N OS threads (thường N = số CPU). Scheduler là work-stealing: nếu một P (processor) hết việc, nó steal goroutines từ P khác. Khi goroutine gọi blocking syscall (file I/O cũ), runtime detach thread khỏi P và tạo thread mới để P tiếp tục chạy goroutine khác. Với network I/O, Go dùng netpoller (epoll/kqueue) nên goroutine không block thread — đây là lý do Go xử lý 100K connections tốt hơn Java thread-per-connection model.

---

### Q: What is a context switch and what does the OS save/restore during one? / Context switch là gì và OS lưu/khôi phục gì trong quá trình đó? 🟢 Junior

**A:** A context switch is the OS saving the state (context) of the currently running process/thread and loading the saved state of the next one to run. Saved state includes: CPU registers (PC, SP, general-purpose), memory mappings (if switching processes), kernel stack pointer, and scheduling metadata.

Vietnamese explanation: Context switch tốn kém vì: (1) CPU pipeline bị flush; (2) CPU cache (L1/L2 TLB) bị invalidate khi switch process (do address space thay đổi); (3) kernel phải thực hiện privileged mode transition (user → kernel → user). Thread switch trong cùng process rẻ hơn process switch vì dùng chung address space, không flush TLB. Goroutine switch rẻ nhất vì hoàn toàn user-space, không cần kernel trap. Trong Go interview, liên kết: `runtime.Gosched()` yields goroutine; `GOMAXPROCS` controls parallelism.

---

### Q: Explain the Go memory model with respect to goroutine communication. What guarantees does it provide? / Giải thích Go memory model liên quan đến goroutine communication. Nó đảm bảo điều gì? 🔴 Senior

**A:** The Go memory model defines _happens-before_ relationships: if event A happens-before B, then B is guaranteed to observe A's writes. Key guarantees: a send on a channel happens-before the corresponding receive completes; `sync.Mutex` Unlock happens-before the next Lock; `sync.WaitGroup.Done` happens-before `Wait` returns.

Vietnamese explanation: Không có happens-before relationship thì compiler và CPU có thể reorder instructions (out-of-order execution, store buffering). Ví dụ sai: hai goroutines đọc/ghi một biến không qua channel hay mutex — đây là **data race**, undefined behavior trong Go memory model. `go build -race` dùng ThreadSanitizer để phát hiện. Thực tế: bất kỳ shared mutable state nào đều cần synchronization primitive (channel, mutex, atomic). `sync/atomic` chỉ đảm bảo visibility, không đảm bảo ordering cho non-atomic reads trên cùng variable.

---

### Q: What are file descriptors? How does Go manage them at scale, and what happens when they run out? / File descriptor là gì? Go quản lý chúng thế nào ở scale lớn và điều gì xảy ra khi hết? 🟡 Mid

**A:** A file descriptor (fd) is a non-negative integer index into the per-process open file table maintained by the OS kernel. Every open file, socket, pipe, and timer uses an fd. Linux default limit: 1024 per process (`ulimit -n`), configurable up to millions system-wide.

Vietnamese explanation: Khi hết fd (`EMFILE: too many open files`): `net.Listen` và `os.Open` trả về error, Go server không nhận được connection mới. Nguyên nhân phổ biến trong Go: **goroutine/connection leak** — `http.Client` mà không drain và close response body, TCP connections không được close đúng (`defer resp.Body.Close()`). Cách kiểm tra: `lsof -p <pid> | wc -l`. Production fix: set `MaxIdleConnsPerHost` trong `http.Transport`, dùng connection pool, và set `SO_REUSEPORT`. Monitoring: export `process_open_fds` metric từ Prometheus Go client library.

---

### Q: How does Go handle OS signals, and what is the correct pattern for graceful shutdown on SIGTERM? / Go xử lý OS signals như thế nào và pattern đúng cho graceful shutdown với SIGTERM là gì? 🟡 Mid

**A:** Go exposes signal handling via `signal.Notify(ch, syscall.SIGTERM, syscall.SIGINT)` which routes signals to a buffered channel. Go 1.16+ provides `signal.NotifyContext(ctx, ...)` which cancels a context when the signal arrives.

Vietnamese explanation: Signals là cơ chế IPC của Unix để OS/process gửi thông báo bất đồng bộ. `SIGTERM` (15) là "please terminate gracefully" — Kubernetes gửi cái này trước khi kill. `SIGKILL` (9) không thể catch — đây là hard kill. `SIGINT` là Ctrl+C. Pattern sai: ignore signal và cho OS force-kill — in-flight requests bị drop, DB transactions không complete. Pattern đúng với `signal.NotifyContext`: context cancel trigger `server.Shutdown(ctx)` → drain connections → cancel background workers → flush buffers → exit 0. Buffer size của signal channel phải ít nhất 1 để không miss signal nếu goroutine chưa ready receive.

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                             | Difficulty | Core Concept      | Key Signal                                                |
| --- | ------------------------------------ | ---------- | ----------------- | --------------------------------------------------------- |
| Q1  | Process là gì? Mô tả PCB             | 🟢         | Process vs Thread | PCB components, 5 states                                  |
| Q2  | Thread là gì? Kernel vs user thread  | 🟢         | Process vs Thread | Shared memory, 1:1 vs M:N                                 |
| Q3  | Goroutine hoạt động thế nào? So sánh | 🟡         | Process vs Thread | 8KB stack, M:N, work-stealing                             |
| Q4  | CPU Scheduling algorithms cơ bản     | 🟢         | CPU Scheduling    | FCFS, SJF, Round Robin, Priority                          |
| Q5  | GMP model trong Go scheduler         | 🔴         | CPU Scheduling    | G-M-P roles, work stealing, preemption                    |
| Q6  | Virtual Memory, Paging, TLB          | 🟢         | Memory Management | Page table, TLB miss cost                                 |
| Q7  | Page Replacement algorithms          | 🟡         | Memory Management | LRU, FIFO, Optimal, Belady's anomaly                      |
| Q8  | Stack vs Heap allocation trong Go    | 🟡         | Memory Management | Escape analysis, `-gcflags='-m'`                          |
| Q9  | Go Memory Allocator (TCMalloc)       | 🔴         | Memory Management | mcache→mcentral→mheap, size classes                       |
| Q10 | IPC methods liệt kê                  | 🟢         | IPC               | Pipes, shared memory, sockets, signals                    |
| Q11 | Go code cho IPC methods              | 🟡         | IPC               | os/exec.Cmd, net.Pipe, mmap                               |
| Q12 | 4 điều kiện Deadlock                 | 🟢         | Deadlocks         | Mutual exclusion, hold-wait, no preemption, circular wait |
| Q13 | Deadlock trong Go + fix              | 🟡         | Deadlocks         | Channel deadlock, lock ordering                           |
| Q14 | 5 I/O Models                         | 🟡         | I/O Models        | Blocking, non-blocking, multiplexing, signal, async       |
| Q15 | Go netpoller hoạt động               | 🔴         | I/O Models        | epoll/kqueue, goroutine park/resume                       |
| Q16 | inode, directory, file descriptor    | 🟢         | File Systems      | inode structure, fd table                                 |
| Q17 | Journaling file system               | 🟡         | File Systems      | Write-ahead journal, ext4, fsync                          |
| Q18 | Go code file operations              | 🟡         | File Systems      | os.OpenFile, bufio, defer Close                           |
| Q19 | Linux Namespaces + Docker            | 🟡         | Linux Internals   | 7 namespace types, isolation                              |
| Q20 | Cgroups resource limiting            | 🟡         | Linux Internals   | v1 vs v2, memory/CPU limits                               |
| Q21 | /proc filesystem entries             | 🟡         | Linux Internals   | /proc/pid/status, /proc/cpuinfo                           |
| Q22 | Go + Linux syscalls                  | 🔴         | Linux Internals   | syscall package, seccomp                                  |
| Q23 | Linux signals quan trọng             | 🟢         | Signals           | SIGTERM, SIGKILL, SIGINT                                  |
| Q24 | Graceful shutdown Go pattern         | 🟡         | Signals           | signal.NotifyContext, server.Shutdown                     |
| Q25 | Context switch chuyện gì xảy ra      | 🟡         | Context Switching | Save/restore registers, TLB flush                         |
| Q26 | So sánh context switch cost          | 🔴         | Context Switching | Process vs thread vs goroutine ns                         |
| A1  | Goroutine vs OS thread + scheduling  | 🟡         | Process vs Thread | M:N, 200ns switch, netpoller                              |
| A2  | Context switch OS save/restore       | 🟢         | Context Switching | Registers, TLB, pipeline flush                            |
| A3  | Go memory model happens-before       | 🔴         | Memory Management | Channel send HB receive, -race                            |
| A4  | File descriptors at scale            | 🟡         | File Systems      | EMFILE, resp.Body.Close, ulimit                           |
| A5  | Go OS signals + graceful shutdown    | 🟡         | Signals           | signal.NotifyContext, K8s SIGTERM                         |

**Distribution:** 🟢 8 (26%) | 🟡 16 (52%) | 🔴 7 (22%) — Total: 31 Q&As

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

**Interviewer:** "Your Go service running in Kubernetes suddenly shows GOMAXPROCS=64 but the pod only has 2 CPU cores allocated. What's happening and what's the impact?"

**30-second answer:**

> Go's `runtime.GOMAXPROCS` defaults to the number of CPUs visible in `/proc/cpuinfo`, which in a container shows the **host's** CPU count, not the cgroup limit. With 64 P's but only 2 cores, Go creates 64 logical processors competing for 2 physical cores — causing excessive context switching, cache thrashing, and higher tail latency. Fix: set `GOMAXPROCS=2` explicitly or use `uber-go/automaxprocs` which reads cgroup limits. Go 1.19+ has `GOEXPERIMENT=containermaxprocs` but it's not default yet.

**Follow-up:** "What about memory? If the container has 512MB limit but the host has 64GB, how does Go GC behave?"

> Go GC uses `GOGC` (default 100, means trigger GC when heap doubles). Without `GOMEMLIMIT`, GC doesn't know about cgroup memory limit → can grow heap to OOM. Fix: set `GOMEMLIMIT=450MiB` (leaving headroom for stack + off-heap). Go 1.19+ `GOMEMLIMIT` is the recommended approach over tuning `GOGC`.

---

## Self-Check / Tự Kiểm Tra

> **Retrieval Practice / Thực Hành Truy Xuất:** Đóng tài liệu, trả lời từ trí nhớ trước khi kiểm tra đáp án.

| #   | Question                                                                          | Key Points                                                                                                                                                                      |
| --- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Vẽ GMP model — G, M, P làm gì? Work stealing hoạt động thế nào?                   | G=goroutine (work), M=OS thread (executor), P=processor (context, GOMAXPROCS count). Idle P steals half of busy P's LRQ                                                         |
| 2   | Process switch tốn bao nhiêu? Thread switch? Goroutine switch? Tại sao khác nhau? | Process ~1-10µs (TLB flush), Thread ~1µs (same address space), Goroutine ~200ns (user-space, 3 registers). TLB invalidation is the key cost                                     |
| 3   | Go netpoller biến blocking I/O thành non-blocking thế nào?                        | goroutine calls Read → runtime registers fd with epoll → goroutine parks → epoll_wait returns ready → goroutine resumes. Developer writes blocking code, runtime makes it async |
| 4   | 7 Linux namespace types? Docker dùng chúng thế nào?                               | PID, NET, MNT, UTS, IPC, USER, CGROUP. Docker creates new namespaces per container for isolation without VM overhead                                                            |
| 5   | Viết graceful shutdown pattern cho Go HTTP server trên K8s                        | signal.NotifyContext(SIGTERM) → set readiness=false → server.Shutdown(ctx) → drain connections → cancel workers → flush buffers → exit 0                                        |
| 6   | Escape analysis là gì? Khi nào variable escape to heap?                           | Compiler decides stack vs heap. Escapes when: return pointer to local, closure captures, interface conversion, slice grows beyond stack. Check with `-gcflags='-m'`             |
| 7   | GOMAXPROCS mặc định trong container có vấn đề gì? Cách fix?                       | Defaults to host CPU count, not cgroup limit. Fix: explicit GOMAXPROCS, automaxprocs library, or GOMEMLIMIT for memory                                                          |

### 📅 Spaced Repetition Schedule / Lịch Ôn Tập

| Round | When          | Focus                                                      |
| ----- | ------------- | ---------------------------------------------------------- |
| 1     | Day 1 (Today) | Read all Memory Hooks + draw GMP model from memory         |
| 2     | Day 3         | Self-Check questions 1-4 without notes                     |
| 3     | Day 7         | Cold Call simulation + explain netpoller to rubber duck    |
| 4     | Day 14        | Full Self-Check + write graceful shutdown from scratch     |
| 5     | Day 30        | Mock interview: all 🔴 Q&As + container debugging scenario |

---

## Connections / Liên Kết

### Same Track / Cùng Track

- ⬅️ **Built on**: [Go Concurrency](../01-golang/03-concurrency.md) — goroutines, channels, sync primitives are Go's concurrency layer on top of OS primitives
- ⬅️ **Built on**: [Memory & GC](../01-golang/04-memory-gc.md) — GC pauses, escape analysis, allocator interact with OS memory management
- ➡️ **Applied in**: [Testing & Profiling](../01-golang/05-testing-profiling.md) — pprof uses OS-level profiling hooks (perf_events, CPU sampling)
- 🔗 **Related**: [Networking for Go](./06-networking-go.md) — TCP/socket programming, epoll/kqueue builds directly on I/O models
- 🔗 **Related**: [Resilience Patterns](./07-resilience-patterns.md) — circuit breaker, timeout patterns rely on OS signal handling

### Cross Track / Khác Track

- 🔗 **[Distributed Systems](./03-distributed-systems.md)** — OS IPC concepts scale to distributed message passing (RPC, message queues)
- 🔗 **[System Design](../04-be-system-design/01-design-framework.md)** — capacity planning uses OS resource understanding (CPU, memory, fd limits)
- 🔗 **[DevOps](../05-devops/01-kubernetes-docker.md)** — Docker/K8s containerization relies on Linux namespaces, cgroups, signals

---
