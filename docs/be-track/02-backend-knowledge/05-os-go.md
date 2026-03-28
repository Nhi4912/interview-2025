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

> 🧠 **Memory Hook:** "Process = apartment (isolated), Thread = roommate (shared kitchen), Goroutine = micro-task post-it (stack-on-demand)"

**Tại sao tồn tại? / Why does this exist?**

OS cần cách isolate running programs → process. Cần lightweight execution within process → thread. Go cần millions of concurrent tasks → goroutine.
→ **Why?** Process isolation (separate address space) prevents one program crashing another. Thread shared memory enables fast communication but introduces data races. Goroutine M:N scheduling avoids 1:1 thread overhead — 8KB initial stack vs 1-8MB OS thread stack.
→ **Why?** Fork-exec model creates process from parent's copy (COW optimization). POSIX threads require kernel involvement for scheduling. Go goroutines use cooperative + preemptive (since Go 1.14) scheduling entirely in user-space, with stack growth via copying (not segmented stacks — abandoned after Go 1.4).

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng một tòa chung cư: mỗi **căn hộ (process)** có điện, nước, bếp riêng — hoàn toàn cô lập, hàng xóm sập điện cũng không ảnh hưởng bạn. **Người ở chung (threads)** trong một căn hộ dùng chung bếp, tủ lạnh — giao tiếp nhanh nhưng phải xếp hàng để tránh đụng nhau. **Post-it task (goroutines)** là những mảnh giấy ghi việc cần làm — siêu nhỏ, siêu rẻ, được quản lý bởi ban quản lý tòa nhà (Go runtime), không phải từng người tự sắp xếp.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

| Property      | Process     | Thread    | Goroutine        |
| ------------- | ----------- | --------- | ---------------- |
| Memory space  | Isolated    | Shared    | Shared (Go heap) |
| Stack size    | MBs         | 1–8 MB    | 8 KB (grows)     |
| Creation cost | High (fork) | Medium    | ~1 µs            |
| Switch cost   | ~1–10 µs    | ~1 µs     | ~200 ns          |
| Managed by    | OS kernel   | OS kernel | Go runtime       |
| Max count     | ~1K         | ~10K      | ~Millions        |

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Goroutine leak: goroutine blocked vĩnh viễn (thiếu context timeout) → memory không được giải phóng, count tăng dần tới OOM
- GOMAXPROCS=1 → goroutines chạy concurrent nhưng không parallel (chỉ 1 OS thread thực thi)
- Stack growth: goroutine stack tăng bằng cách copy toàn bộ (không dùng segmented stack) → latency spike nếu stack copy lớn
- `fork()` trong multi-threaded process cực kỳ nguy hiểm — sau fork chỉ async-signal-safe functions được phép gọi

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                              | Tại sao sai                                                                      | Đúng là                                                                   |
| ------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| "Goroutine = green thread"           | Green threads dùng 1:1 user-thread mapping, goroutine dùng M:N với work-stealing | Goroutine là M:N — nhiều goroutines chạy trên ít OS threads hơn           |
| "More goroutines = more parallelism" | Parallelism bị giới hạn bởi GOMAXPROCS, không phải số goroutines                 | Thêm goroutine chỉ tăng concurrency, parallelism phụ thuộc vào GOMAXPROCS |
| "Process fork is expensive"          | Linux dùng COW — actual copy chỉ xảy ra khi write, không phải khi fork           | Fork nhanh nhờ COW, chỉ tốn kém khi modified pages được copy              |

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Go Concurrency](../01-golang/03-concurrency.md) — goroutines, channels, sync primitives là Go's concurrency layer
- ➡️ Để hiểu tiếp: [Concept 2: CPU Scheduling & GMP Model](#concept-2-cpu-scheduling--gmp-model) — cách Go scheduler phân công goroutines cho OS threads

**🎯 Interview Pattern:**

- Khi thấy câu hỏi "Explain the cost difference between process switch, thread switch, and goroutine switch" → Nhớ đến TLB invalidation là yếu tố đắt nhất
- Mở đầu: "Process switch phải flush TLB và lưu full context (~1-10µs). Thread switch chỉ lưu registers, cùng address space (~1µs). Goroutine switch lưu 3 registers trong user-space (~200ns) — không cần kernel involvement."

---

### Concept 2: CPU Scheduling & GMP Model

> 🧠 **Memory Hook:** "GMP = Go's 3-body system: G(oroutine) wants work, M(achine thread) does work, P(rocessor) assigns work"

**Tại sao tồn tại? / Why does this exist?**

OS needs to share CPU time fairly among processes/threads. Go needs its own scheduler to manage millions of goroutines on limited OS threads.
→ **Why?** OS schedulers (CFS in Linux) optimize for fairness and responsiveness. Go scheduler optimizes for goroutine throughput — work-stealing ensures no P sits idle while others are overloaded. Local run queue (LRQ) per P avoids global lock contention.
→ **Why?** GMP evolution: Go 1.0 had global queue with single lock (bottleneck). Go 1.1 added P (per-processor local queue). Go 1.14 added async preemption via signals (SIGURG) — before this, tight loops without function calls could starve other goroutines. Sysmon thread monitors long-running goroutines and preempts after 10ms.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng một nhà máy sản xuất: **G (Goroutine)** là những đơn hàng cần xử lý — nhỏ, nhiều, liên tục đến. **M (Machine/OS thread)** là công nhân — số lượng hữu hạn, mỗi người chỉ làm một việc tại một thời điểm. **P (Processor)** là dây chuyền sản xuất — mỗi dây chuyền có hàng đợi riêng (LRQ) và được giao cho một công nhân. Khi một dây chuyền hết việc, nó "ăn cắp" nửa hàng của dây chuyền bận nhất — đây là work-stealing.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
P0 [LRQ: G3→G4→G5]        P1 [LRQ: G6→G7]
 │                           │
 M0 (executing G1)           M1 (executing G2)

Work Stealing (P0 LRQ empty):
P0 [LRQ: ∅] ──steal half──▶ P1 [LRQ: G6→G7]
P0 [LRQ: G7] ◀─────────────  P1 [LRQ: G6]

Global Run Queue (GRQ): G8→G9 (checked every 61 ticks)
Network Poller: fd ready → inject G into any P's LRQ
Sysmon: detects G running >10ms → sends SIGURG → preempt
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- GOMAXPROCS > CPU cores → OS context-switch overhead tăng, cache thrashing, higher tail latency
- Goroutine starved: tight loop không có function call (trước Go 1.14) → thêm `runtime.Gosched()` để yield
- Work-stealing không phải free: atomic operations trên LRQ, cache line bouncing khi steal xảy ra thường xuyên
- Sysmon goroutine: nếu bị block (trong syscall), có thể delay preemption detection lên đến 20ms

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                                        | Đúng là                                                                |
| ---------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| "GOMAXPROCS = số goroutines có thể chạy" | GOMAXPROCS là số P (logical processors), không phải số goroutines  | Số goroutines không bị giới hạn bởi GOMAXPROCS, chỉ parallelism mới bị |
| "Tăng GOMAXPROCS = nhanh hơn"            | Vượt quá số CPU cores thật sẽ tăng contention và context switching | Đặt GOMAXPROCS = số CPU cores vật lý (hoặc cgroup limit)               |
| "Go scheduler chỉ là cooperative"        | Từ Go 1.14, đã thêm async preemption qua SIGURG signal             | Go scheduler là hybrid: cooperative + preemptive (signal-based)        |

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Concept 1: Process vs Thread vs Goroutine](#concept-1-process-vs-thread-vs-goroutine) — hiểu goroutine là gì trước khi học cách schedule chúng
- ➡️ Để hiểu tiếp: [Concept 3: Memory Management](#concept-3-memory-management) — GMP model ảnh hưởng trực tiếp đến memory allocator (mcache per-P)

**🎯 Interview Pattern:**

- Khi thấy câu hỏi "Draw the GMP model and explain work stealing" → Nhớ đến P có LRQ, M thực thi G, steal từ busy P
- Mở đầu: "G là goroutine (đơn vị công việc), M là OS thread (thực thi), P là processor context (GOMAXPROCS count, có LRQ riêng). Khi P hết việc, nó steal nửa LRQ của P bận nhất. Global queue là fallback. Network poller inject G ready vào bất kỳ P nào."

---

### Concept 3: Memory Management

> 🧠 **Memory Hook:** "Virtual Memory = every process thinks it has the whole building, but actually shares floors through page tables"

**Tại sao tồn tại? / Why does this exist?**

Programs need more memory than physically available. Each program needs isolated address space. OS needs to manage physical memory efficiently.
→ **Why?** Virtual memory provides: isolation (separate page tables), abstraction (contiguous virtual addresses mapped to fragmented physical), overcommit (allocate more than physical RAM using swap). TLB caches page table lookups — TLB miss costs 10-100x memory access.
→ **Why?** Go's memory allocator (TCMalloc-inspired): mcache (per-P, no lock) → mcentral (per-size-class, lock) → mheap (global, lock). Size classes: tiny (<16B), small (16B-32KB), large (>32KB direct from heap). Escape analysis decides stack vs heap — stack is free (just move SP), heap needs GC.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng một chung cư cao tầng với hàng nghìn căn hộ: **virtual memory** giống như mỗi căn hộ (process) được cấp một bộ chìa khóa riêng đến "toàn bộ tòa nhà" — nhưng thực ra OS dùng page table như sơ đồ tầng để ánh xạ chìa khóa ảo sang phòng thật. **Go allocator** như ban quản lý 3 cấp: tủ đồ riêng của từng tầng (mcache/per-P, không cần khóa) → kho chung mỗi loại phòng (mcentral) → kho tổng tòa nhà (mheap).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Goroutine allocation request
          │
     size < 32KB?
     /           \
   Yes             No (large object)
    │               │
 mcache            mheap (direct mmap)
 (per-P, lock-free)
    │
  miss?
    │
 mcentral
 (per size-class, mutex)
    │
  miss?
    │
 mheap
 (global, mutex, mmap from OS)

Stack vs Heap (escape analysis):
  variable escapes function scope? → heap (GC tracked)
  variable stays in scope?         → stack (free, just move SP)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Stack overflow: goroutine stack tự grow bằng cách copy, nhưng nếu recursive quá sâu → "stack overflow" panic
- False sharing: hai goroutines write vào cùng cache line (64 bytes) → performance degradation dù không share variable
- Escape analysis không hoàn hảo: interface conversion luôn escape → profile với `-gcflags='-m'` để verify
- Huge page: OS có thể dùng 2MB TLB entries (transparent hugepages) → giảm TLB miss rate cho Go heap lớn

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                        | Tại sao sai                                                                                  | Đúng là                                                               |
| ------------------------------ | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| "Stack luôn nhanh hơn heap"    | Đúng cho allocation, nhưng stack size giới hạn và stack copy tốn CPU                         | Stack nhanh hơn cho allocation; heap cần GC nhưng không giới hạn size |
| "Go không dùng virtual memory" | Go dùng mmap cho heap, OS quản lý virtual→physical mapping                                   | Go hoàn toàn dùng virtual memory, visible qua RSS vs VSZ trong `ps`   |
| "Page fault = lỗi"             | Minor page fault (COW, lazy alloc) là bình thường; chỉ major page fault (disk swap) mới chậm | Minor page fault là OS optimization, không phải error                 |

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Memory & GC](../01-golang/04-memory-gc.md) — GC pauses, escape analysis, allocator tương tác với OS memory
- ➡️ Để hiểu tiếp: [Concept 4: IPC & Synchronization](#concept-4-ipc--synchronization) — shared memory IPC dựa trên virtual memory model

**🎯 Interview Pattern:**

- Khi thấy câu hỏi "Explain escape analysis in Go" → Nhớ đến compiler quyết định stack vs heap dựa trên lifetime của variable
- Mở đầu: "Escape analysis là bước compiler phân tích xem variable có outlive function không. Nếu có → allocate trên heap (GC tracked). Nếu không → stack (free, just move SP). Dùng `go build -gcflags='-m'` để xem quyết định. Common escapes: return pointer to local, closure captures, interface conversion."

---

### Concept 4: IPC & Synchronization

> 🧠 **Memory Hook:** "IPC = postal service between apartments (processes) — pipes are tubes, shared memory is a shared whiteboard, sockets are phone calls"

**Tại sao tồn tại? / Why does this exist?**

Processes have isolated memory → need mechanisms to communicate. Within Go, goroutines share memory but need synchronization.
→ **Why?** Pipes (anonymous/named) for parent-child streaming. Shared memory + semaphores for high-throughput. Unix sockets for local IPC. TCP sockets for network. Go channels as first-class IPC within process — "Don't communicate by sharing memory, share memory by communicating."
→ **Why?** Channels are typed, directional, and composable with `select`. Under the hood, channel is a ring buffer + mutex + two wait queues (sendq/recvq). Mutex is faster for simple state protection (no buffer, no goroutine parking overhead). `sync.WaitGroup` + `context.Context` are the idiomatic Go patterns for coordinating goroutine lifecycles.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng khu chung cư với bưu điện nội bộ: **pipes** như ống thư một chiều giữa hai căn — bên gửi nhét thư vào, bên nhận lấy ra theo thứ tự. **Shared memory** như bảng thông báo chung ở hành lang — nhanh, nhưng nhiều người viết cùng lúc cần quy tắc (mutex/semaphore). **Sockets** như điện thoại — hai căn bất kỳ có thể nói chuyện qua tổng đài. **Go channels** như hộp thư riêng trong apartment — giao tiếp an toàn, có thể chờ khi hộp đầy hoặc trống.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Go Channel internals (buffered chan):
  ┌──────────────────────────────────┐
  │  buf: [G1_data][G2_data][      ] │  ← ring buffer
  │  sendq: [G3_waiting]             │  ← blocked senders
  │  recvq: []                       │  ← blocked receivers
  │  mutex: (lock)                   │
  └──────────────────────────────────┘

Send operation:
  buf not full → copy data to buf → return immediately
  buf full     → park sender G in sendq → context switch

Receive operation:
  buf not empty → copy from buf → unpark sendq head (if any)
  buf empty     → park receiver G in recvq → context switch

select: Go runtime pseudo-randomly picks a ready case
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Unbuffered channel: sender và receiver phải đồng thời ready → dùng cho synchronization, không phải data transfer
- Channel direction: `chan<- T` (send-only), `<-chan T` (receive-only) → giúp compiler enforce ownership
- Mutex vs Channel: mutex nhanh hơn 3-5x cho simple counter; channel phù hợp cho pipeline và ownership transfer
- `select` với default case → non-blocking check; không có default case → block cho đến khi có case ready

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                | Tại sao sai                                                                            | Đúng là                                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| "Channels luôn tốt hơn mutex trong Go" | Channel có overhead (buffer copy, goroutine parking); mutex nhanh hơn cho simple state | Dùng mutex để guard access, channel để transfer ownership hoặc signal |
| "Shared memory IPC an toàn mặc định"   | Cần synchronization explicit (semaphores/mutexes) để tránh race condition              | Shared memory luôn cần synchronization primitive đi kèm               |
| "Pipes là bidirectional"               | Anonymous pipes (os.Pipe) là unidirectional; named pipes (FIFO) cũng vậy               | Mỗi pipe chỉ một chiều; cần 2 pipes cho 2 chiều communication         |

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Go Concurrency](../01-golang/03-concurrency.md) — channels, mutex, WaitGroup là Go's sync primitives
- ➡️ Để hiểu tiếp: [Concept 5: I/O Models & Netpoller](#concept-5-io-models--netpoller) — IPC qua network sockets dùng I/O model nào

**🎯 Interview Pattern:**

- Khi thấy câu hỏi "When would you use mutex vs channel in Go?" → Nhớ đến ownership transfer vs state protection
- Mở đầu: "Mutex để protect shared state (counter, map). Channel để signal, transfer ownership, hay pipeline. Rule of thumb: transfer data ownership → channel; guard access to shared state → mutex."

---

### Concept 5: I/O Models & Netpoller

> 🧠 **Memory Hook:** "5 I/O models = 5 ways to wait for pizza delivery: blocking (sit at door), non-blocking (check every minute), multiplexing (one person watches all doors), signal-driven (doorbell), async (pizza appears in kitchen)"

**Tại sao tồn tại? / Why does this exist?**

Network servers need to handle thousands of connections. Blocking I/O = one thread per connection = expensive. Need efficient ways to wait for I/O.
→ **Why?** epoll (Linux) / kqueue (macOS) = O(1) readiness notification for thousands of fds. Go's netpoller wraps epoll/kqueue, making goroutine blocking I/O actually non-blocking at OS level — goroutine parks, runtime polls for readiness, resumes goroutine when ready.
→ **Why?** Go netpoller integration: when goroutine does `conn.Read()` → runtime calls epoll_ctl to register fd → goroutine is parked (removed from P's run queue) → sysmon/dedicated thread calls epoll_wait → when fd ready, goroutine is put back on run queue. This is why Go handles 100K+ connections with only GOMAXPROCS threads.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng 5 cách đợi pizza delivery: **Blocking** — ngồi trước cửa, không làm gì đến khi pizza đến. **Non-blocking** — cứ 1 phút lại ra kiểm tra, pizza chưa đến lại vào. **Multiplexing (epoll)** — một người ngồi canh tất cả cửa một lúc, cửa nào có pizza thì báo ngay. **Signal-driven** — gắn chuông cửa, pizza đến tự kêu. **Async (io_uring)** — pizza tự xuất hiện trong bếp khi sẵn sàng, bạn không cần làm gì. Go dùng epoll/kqueue để implement mô hình async cho developer mà trông như blocking.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
goroutine calls conn.Read()
        │
   fd not ready (no data)?
        │
runtime: epoll_ctl(epollfd, EPOLL_CTL_ADD, fd, EPOLLIN)
        │
goroutine PARKED → removed from P's run queue
        │
   [other goroutines run on M/P]
        │
netpoll thread: epoll_wait() ← blocks here
        │
   fd becomes ready (data arrived)
        │
goroutine UNPARKED → added to any P's run queue
        │
goroutine RESUMES → conn.Read() returns data
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- `select()` là O(n) scan qua tất cả fds — không scale với 10K+ connections
- epoll là O(1) notification nhưng chỉ Linux; kqueue trên macOS/BSD — Go netpoller abstract hóa cả hai
- io_uring (Linux 5.1+): zero-copy async I/O, Go chưa dùng mặc định vì thêm complexity
- File I/O (disk): Go KHÔNG dùng netpoller cho regular files — vẫn blocking, dùng separate thread pool (goroutine + syscall)

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                                            | Đúng là                                                           |
| ----------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------- |
| "Go dùng blocking I/O nên chậm"     | Go I/O trông blocking với developer nhưng dùng epoll/kqueue phía dưới  | Go I/O là non-blocking ở OS level, goroutine chỉ park khi chờ fd  |
| "`select()` và `epoll` giống nhau"  | `select()` là O(n) scan tất cả fds; epoll là O(1) event notification   | epoll scale tốt hơn nhiều với số lượng connection lớn             |
| "async I/O (io_uring) luôn tốt hơn" | io_uring thêm complexity, Go's netpoller đủ dùng cho hầu hết use cases | Chọn tool phù hợp; netpoller đơn giản và hiệu quả cho network I/O |

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Networking for Go](./06-networking-go.md) — TCP/socket programming là nền tảng của netpoller
- ➡️ Để hiểu tiếp: [Concept 6: Linux Internals](#concept-6-linux-internals-containers) — epoll là Linux kernel feature, hiểu Linux internals để debug netpoller

**🎯 Interview Pattern:**

- Khi thấy câu hỏi "How does Go handle 100K concurrent connections?" → Nhớ đến netpoller + goroutine parking
- Mở đầu: "Go dùng netpoller wrap epoll/kqueue. Mỗi connection = 1 goroutine (cheap, 8KB stack). Khi I/O chưa sẵn sàng, goroutine park — không block OS thread. Chỉ GOMAXPROCS OS threads phục vụ tất cả goroutines."

---

### Concept 6: Linux Internals (Containers)

> 🧠 **Memory Hook:** "Namespaces = separate rooms with own furniture, Cgroups = meter on each room's electricity/water"

**Tại sao tồn tại? / Why does this exist?**

Containers need process isolation without full VM overhead. Namespaces provide isolation, cgroups provide resource limits.
→ **Why?** 7 namespace types: PID (process tree), NET (network stack), MNT (filesystem), UTS (hostname), IPC (message queues), USER (uid mapping), CGROUP. Docker = namespaces + cgroups + union filesystem (overlay2). Go's `GOMAXPROCS` should match cgroup CPU limit, not host CPU count.
→ **Why?** cgroup v2 unified hierarchy vs v1 per-resource trees. `runtime.GOMAXPROCS` auto-detection issue: Go reads `/proc/cpuinfo` (host CPUs), not cgroup limit → set explicitly or use `uber-go/automaxprocs`. Memory cgroup OOM killer sends SIGKILL (can't catch) — monitor `memory.current` vs `memory.max`.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng một dãy phòng trọ trong cùng một tòa nhà: **namespace** như tường ngăn cách — mỗi phòng có tên riêng, số phòng riêng, cửa sổ riêng (network), nhìn vào thấy chỉ đồ của mình. Nhưng thực ra tất cả đều ở trong cùng một tòa nhà (Linux kernel). **Cgroup** như đồng hồ điện nước riêng cho từng phòng — phòng A dùng quá điện bị ngắt (OOM kill), phòng B bị giới hạn 2 CPU cores dù tòa nhà có 64 cores.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

| Namespace | Isolates          | Container impact             |
| --------- | ----------------- | ---------------------------- |
| PID       | Process IDs       | Container thấy PID=1         |
| NET       | Network stack     | IP, ports riêng biệt         |
| MNT       | Filesystem mounts | Root filesystem riêng        |
| UTS       | Hostname          | Hostname riêng của container |
| IPC       | Message queues    | SysV IPC riêng biệt          |
| USER      | UID/GID mapping   | Root trong container ≠ host  |
| CGROUP    | Cgroup tree       | Resource limit visibility    |

```
cgroup v2 hierarchy:
/sys/fs/cgroup/
  └── docker/
        └── <container-id>/
              ├── memory.max    ← set GOMEMLIMIT to match this
              ├── memory.current
              └── cpu.max       ← set GOMAXPROCS to match this
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- GOMAXPROCS mặc định đọc host CPU count từ `/proc/cpuinfo`, không đọc cgroup limit → over-schedule P's
- OOM kill từ memory cgroup gửi SIGKILL — không thể catch, không graceful shutdown → set GOMEMLIMIT với headroom
- cgroup v1 vs v2: v1 có hierarchy phức tạp per-resource; v2 unified — một số tool cũ chỉ đọc v1 paths
- Namespace isolation ≠ security: cần thêm seccomp (restrict syscalls), AppArmor/SELinux profiles

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                 | Tại sao sai                                                                   | Đúng là                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| "Docker là một VM"                      | Docker dùng Linux kernel features (namespaces + cgroups), không có hypervisor | Docker là process isolation, share kernel với host                         |
| "GOMAXPROCS tự detect container limits" | Mặc định Go đọc `/proc/cpuinfo` (host), không đọc cgroup → trước Go 1.19      | Phải set explicit hoặc dùng `uber-go/automaxprocs` để đọc cgroup CPU limit |
| "Namespace cung cấp security"           | Namespace chỉ cung cấp isolation, không hardening                             | Cần thêm seccomp profiles, AppArmor, và non-root user cho security         |

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [DevOps/Kubernetes](../05-devops/01-kubernetes-docker.md) — Docker/K8s containerization dựa trên namespaces và cgroups
- ➡️ Để hiểu tiếp: [Concept 7: Signals & Context Switching](#concept-7-signals--context-switching) — OOM kill gửi SIGKILL, K8s gửi SIGTERM → hiểu signal handling

**🎯 Interview Pattern:**

- Khi thấy câu hỏi "Why does your Go service use 800% CPU in a container limited to 2 cores?" → Nhớ đến GOMAXPROCS đọc host CPUs
- Mở đầu: "GOMAXPROCS mặc định đọc `/proc/cpuinfo` — thấy host có 64 cores → tạo 64 P's. Nhưng container chỉ có 2 CPU cores → 64 P's tranh nhau 2 cores → context switching overhead. Fix: `GOMAXPROCS=2` hoặc `automaxprocs` library."

---

### Concept 7: Signals & Context Switching

> 🧠 **Memory Hook:** "Signals = phone calls from OS (SIGTERM = 'please leave', SIGKILL = 'security escort'), Context Switch = saving your desk before someone else uses it"

**Tại sao tồn tại? / Why does this exist?**

OS needs to notify processes of events (termination, interrupt). CPU needs to switch between tasks — context switch is the mechanism.
→ **Why?** Kubernetes sends SIGTERM, waits terminationGracePeriodSeconds (default 30s), then SIGKILL. Go's `signal.NotifyContext` ties signal handling to context cancellation — idiomatic graceful shutdown. Context switch cost hierarchy: goroutine (~200ns) < thread (~1µs) < process (~1-10µs) — driven by TLB flush and cache invalidation.
→ **Why?** Context switch at goroutine level happens entirely in user-space: save 3 registers (SP, PC, DX), no kernel mode switch, no TLB flush. Thread/process switch requires kernel mode transition (ring 3→0), full register save (~100 registers), TLB flush (invalidate entire address space cache). This is why Go can handle millions of goroutines while OS threads max out at tens of thousands.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng cuộc gọi từ ban quản lý tòa nhà: **SIGTERM** như "anh/chị ơi, tháng sau hết hợp đồng, dọn đồ ra nhé" — bạn có thời gian chuẩn bị, gói ghém đồ đạc, dọn dẹp sạch sẽ. **SIGKILL** như bảo vệ đến khóa cửa ngay lập tức — không thể từ chối, không có thời gian dọn, đồ còn ngổn ngang. **Context switch** như công nhân lưu lại trạng thái bàn làm việc (thanh ghi CPU) trước khi người khác ngồi vào — process phải lưu rất nhiều thứ (TLB flush), goroutine chỉ cần lưu 3 thanh ghi.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
K8s SIGTERM received
       │
signal.NotifyContext(ctx, syscall.SIGTERM)
       │
   ctx cancelled
       │
┌──────▼──────────────────────────────────┐
│  1. Readiness probe → return 503        │ ← stop new traffic
│  2. server.Shutdown(shutdownCtx)        │ ← drain in-flight requests
│  3. cancel background workers via ctx  │ ← stop goroutines
│  4. flush buffers, close DB conns      │ ← cleanup resources
│  5. os.Exit(0)                         │ ← clean exit
└─────────────────────────────────────────┘
       │
(if > terminationGracePeriodSeconds = 30s)
       │
K8s sends SIGKILL ←── CANNOT catch, no cleanup possible
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- SIGTERM trong container không forward đến child processes nếu Go là PID 1 và không trap — dùng `tini` hoặc handle signal forwarding
- `signal.Notify` cần buffered channel (size ≥ 1) — nếu unbuffered và goroutine chưa ready receive → signal bị drop
- Graceful shutdown timeout: nếu `server.Shutdown(ctx)` mà ctx expired trước → in-flight requests bị drop đột ngột
- SIGPIPE: viết vào closed pipe/socket → SIGPIPE signal → Go default handler trả về pipe broken write error

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                     | Tại sao sai                                                                           | Đúng là                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| "SIGKILL có thể catch được"                 | SIGKILL và SIGSTOP là hai signal duy nhất không thể catch, block, hay ignore          | SIGKILL là hard kill — không thể intercept, không thể cleanup            |
| "Graceful shutdown = chỉ cần catch SIGTERM" | Phải drain connections, flush buffers, cancel background workers mới thực sự graceful | SIGTERM là trigger; phải thực hiện đầy đủ shutdown sequence              |
| "Context switch cost là cố định"            | Cost phụ thuộc vào cache state, NUMA topology, CPU pipeline state                     | Context switch cost dao động; goroutine switch ổn định hơn vì user-space |

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Resilience Patterns](./07-resilience-patterns.md) — circuit breaker và timeout patterns dựa trên signal handling
- ➡️ Để hiểu tiếp: [DevOps/Kubernetes](../05-devops/01-kubernetes-docker.md) — K8s terminationGracePeriod, readiness probes dựa trên signal lifecycle

**🎯 Interview Pattern:**

- Khi thấy câu hỏi "Write graceful shutdown for Go HTTP server on Kubernetes" → Nhớ đến signal.NotifyContext + server.Shutdown pattern
- Mở đầu: "`signal.NotifyContext(ctx, SIGTERM, SIGINT)` → khi signal đến, ctx cancelled → `server.Shutdown(shutdownCtx)` drain in-flight requests → cancel background workers → `os.Exit(0)`. Key: buffered signal channel, timeout context cho shutdown, readiness probe return 503 trong lúc drain."

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

| #   | Loại           | Câu hỏi                                                                                                                                                                   |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Vẽ GMP model từ trí nhớ — G, M, P làm gì? Work stealing hoạt động thế nào? Sysmon đóng vai trò gì?                                                                        |
| 2   | 🎨 Visual      | Vẽ sơ đồ so sánh Process/Thread/Goroutine (memory space, stack size, switch cost) và flow netpoller từ goroutine blocks → epoll → resume                                  |
| 3   | 🛠️ Application | Viết đầy đủ graceful shutdown pattern cho Go HTTP server trên K8s dùng `signal.NotifyContext` — bao gồm readiness probe 503, drain connections, cancel background workers |
| 4   | 🐛 Debug       | Go service dùng 800% CPU trong container giới hạn 2 cores và 512MB RAM — liệt kê ít nhất 3 nguyên nhân có thể và cách debug + fix từng cái                                |
| 5   | 🎓 Teach       | Giải thích cho junior dev tại sao Go có thể handle 1M goroutines nhưng chỉ cần vài OS threads — dùng analogy nhà máy sản xuất (G/M/P)                                     |

💬 **Feynman Prompt:** Giải thích GMP model và netpoller cho người chưa biết Go, dùng analogy nhà máy sản xuất. Nếu họ hỏi "tại sao không dùng 1 OS thread per connection như các ngôn ngữ khác?", bạn sẽ giải thích thế nào về cost tradeoff?

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
