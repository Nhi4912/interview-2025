# Operating Systems Theory / Lý Thuyết Hệ Điều Hành

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Concurrency & Parallelism](./07-concurrency-and-parallelism.md) | [Go OS](../../be-track/02-backend-knowledge/05-os-go.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Node.js server của bạn xử lý 1000 concurrent requests. Bỗng nhiên memory tăng liên tục cho đến khi process crash: `Error: EMFILE: too many open files`.

**Nguyên nhân:** Mỗi network connection là một file descriptor. OS có giới hạn (thường 1024 hoặc 65536). Không đóng connections đúng cách → leak descriptors → crash.

Không hiểu OS concepts → không debug được loại bug này. OS ảnh hưởng trực tiếp đến backend performance và stability.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Quản lý văn phòng:**
OS là manager của một văn phòng lớn:

- **Process** = nhân viên (có bàn làm việc riêng, không truy cập bàn người khác)
- **Thread** = các task mà một nhân viên làm song song (share cùng bàn)
- **Memory management** = manager phân bổ bàn làm việc
- **Scheduler** = quyết định ai được dùng CPU và khi nào
- **File descriptors** = thẻ mượn đồ dùng văn phòng (có giới hạn số lượng)

| OS Concept          | Ảnh hưởng đến code                                        |
| ------------------- | --------------------------------------------------------- |
| Process vs Thread   | Node.js single-threaded, Go goroutines, Docker containers |
| Memory (stack/heap) | Memory leaks, stack overflow, GC tuning                   |
| File descriptors    | Connection pooling, "too many open files"                 |
| System calls        | I/O performance, blocking vs non-blocking                 |
| Scheduling          | CPU-bound vs I/O-bound optimization                       |

---

## Concept Map / Bản Đồ Khái Niệm

```
        [OPERATING SYSTEM THEORY]
                    │
         ┌──────────┼──────────┐
         ▼          ▼          ▼
  [Processes]  [Memory]    [I/O & Files]
  Process/Thread  Virtual mem  File descriptors
  Context switch  Paging/seg   Sockets
  Scheduling      Stack/Heap   System calls
  IPC             GC impact    Buffering
         │
         ▼
  [Concurrency Primitives]
  Mutex | Semaphore | Condition variable | Spinlock
         │
         ▼
  [Applied to Software]
  Node.js event loop | Go goroutines | Docker namespaces
```

---

## Understanding System Software Fundamentals / Hiểu về Phần Mềm Hệ Thống

**English:** An operating system is system software that manages computer hardware, software resources, and provides common services for computer programs, acting as an intermediary between users and computer hardware.

**Tiếng Việt:** Hệ điều hành là phần mềm hệ thống quản lý phần cứng máy tính, tài nguyên phần mềm và cung cấp các dịch vụ chung cho các chương trình máy tính, hoạt động như trung gian giữa người dùng và phần cứng máy tính.

## Overview / Tổng Quan

| #   | Concept                        | Role                                                              | Interview Weight |
| --- | ------------------------------ | ----------------------------------------------------------------- | ---------------- |
| 1   | Process vs Thread              | Isolation vs shared memory — goroutine = user-level thread on GMP | ⭐⭐⭐⭐⭐       |
| 2   | Memory Management (Stack/Heap) | Stack auto-freed O(1), heap dynamic + GC — escape analysis        | ⭐⭐⭐⭐         |
| 3   | Virtual Memory & Paging        | Process isolation, demand paging, TLB cache, swap = 1000× slower  | ⭐⭐⭐⭐         |
| 4   | CPU Scheduling                 | CFS vruntime fairness, preemptive, interactive priority           | ⭐⭐⭐           |
| 5   | IPC & Synchronization          | Mutex (ownership), semaphore (signaling), pipe, shared memory     | ⭐⭐⭐⭐         |
| 6   | Deadlock                       | 4 Coffman conditions, prevention via lock ordering                | ⭐⭐⭐⭐         |
| 7   | File Systems & I/O             | File descriptors, blocking/non-blocking, epoll/kqueue             | ⭐⭐⭐           |

**Quan hệ:** Process/Thread (1) → cần Memory (2) + Virtual Memory (3). CPU Scheduling (4) decides who runs. IPC (5) for communication. Deadlock (6) = scheduling + sync gone wrong. File Systems (7) = I/O interface.

---

## Core Concepts — Phase 2 Deep Dive

### Concept 1: Process vs Thread

🪝 **Memory Hook:** Process = **apartment riêng** (tường cách ly, khóa riêng). Thread = **người ở cùng apartment** (share phòng khách, nhà bếp nhưng có phòng ngủ riêng). Goroutine = **khách trong hostel** — share mọi thứ, manager (GMP scheduler) phân phòng.

**Why exists / Tại sao tồn tại:**

- Level 1: Process isolation bảo vệ — crash 1 process không ảnh hưởng process khác. Thread share memory cho communication nhanh
- Level 2: Context switch cost: process switch = TLB flush + page table swap (~μs). Thread switch = register save only (~ns). Goroutine switch = ~200ns (user-space)
- Level 3: Docker container = process + Linux namespaces (PID, network, mount isolation) + cgroups (resource limits). Lightweight isolation without VM overhead

**Layer 1 — Simple Analogy / Lớp 1:**
Process = nhân viên có phòng riêng, muốn giao tiếp phải gửi email (IPC). Thread = nhân viên cùng phòng, nói chuyện trực tiếp (shared memory) nhưng đôi khi tranh nhau bàn (race condition).

**Layer 2 — Mechanics / Lớp 2:**

```
Process:                          Thread:
┌──────────────────────┐         ┌──────────────────────┐
│ PID, virtual address │         │ Shared: heap, globals │
│ Own heap, stack      │         │ Own: stack, registers │
│ Own file descriptors │         │ Own: thread ID        │
│ Own page table       │         │ Shared: file desc     │
│ Context switch: heavy│         │ Context switch: light │
│ Create: fork() ~ms   │         │ Create: ~μs           │
└──────────────────────┘         └──────────────────────┘

Goroutine (Go):
├── 4KB initial stack (vs 1-8MB for OS thread)
├── User-space scheduling (GMP: G=goroutine, M=OS thread, P=processor)
├── ~200ns context switch (vs ~1μs OS thread)
└── Millions of goroutines on single machine
```

**Layer 3 — Edge Cases / Lớp 3:**

- Fork bomb: `while(true) fork()` → exponential process creation → system crash. Prevention: ulimit
- Thread safety: shared memory = shared bugs. Data race = undefined behavior in C/C++, Go: `-race` detector
- Zombie process: child exits before parent calls wait() → lingers in process table

| Sai lầm                             | Tại sao sai                                          | Đúng là                                                              |
| ----------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------- |
| "Thread always better than process" | No isolation — one thread crash = all crash          | Process for isolation (microservices), thread for shared-memory perf |
| "Go goroutine = OS thread"          | Goroutine is user-space, multiplexed onto OS threads | M:N scheduling — many goroutines on few OS threads                   |

🎯 **Interview Pattern:** "Process vs Thread" → mention isolation, memory, context switch cost, use cases. Add goroutine comparison.

🔗 **Knowledge Chain:** Process/Thread → Context Switch → Scheduling → Concurrency Patterns → Go GMP

---

### Concept 2: Memory Management (Stack/Heap)

🪝 **Memory Hook:** Stack = **chồng đĩa** — đặt lên, lấy ra từ trên (LIFO), tự dọn. Heap = **bãi đỗ xe** — đỗ bất kỳ chỗ nào trống, phải nhớ chỗ để lấy xe, quên = memory leak.

**Why exists / Tại sao tồn tại:**

- Level 1: Stack cho local variables (auto-freed, O(1)), heap cho dynamic allocation (runtime size unknown)
- Level 2: Stack overflow = recursive depth > limit (~8000 frames default). Heap fragmentation = allocator can't find contiguous block
- Level 3: Go escape analysis: compiler decides stack vs heap. `go build -gcflags="-m"` xem decisions

**Layer 1 — Simple Analogy / Lớp 1:**
Stack giống **tủ tạm ở lối vào** — gửi đồ khi vào (function call), lấy lại khi ra (return). Heap giống **nhà kho** — thuê chỗ bất kỳ, phải trả lại (free/GC), quên trả = memory leak.

**Layer 2 — Mechanics / Lớp 2:**

```
Process memory layout:
┌────────────────┐ High address
│ Kernel space   │
├────────────────┤
│ Stack ↓        │ Auto-allocated, LIFO, ~8MB limit
│                │ Local vars, return addresses
├────────────────┤
│     ↕ gap      │
├────────────────┤
│ Heap  ↑        │ malloc/new, dynamic, GC managed
├────────────────┤
│ BSS (uninit)   │
│ Data (init)    │
│ Text (code)    │
└────────────────┘ Low address

Allocation speed:
├── Stack: move stack pointer = O(1), ~1 CPU cycle
├── Heap: find free block = O(varies), ~100s CPU cycles
└── GC pause: Go < 1ms, JVM G1 ~10-50ms
```

**Layer 3 — Edge Cases / Lớp 3:**

- Go escape analysis: returning pointer to local var → escapes to heap. Hot path optimization: avoid heap allocation
- Fragmentation: external (free space not contiguous), internal (allocated block > requested). Buddy system, slab allocator
- Memory-mapped files: mmap = treat file as memory region → zero-copy I/O

| Sai lầm                  | Tại sao sai                                        | Đúng là                                                            |
| ------------------------ | -------------------------------------------------- | ------------------------------------------------------------------ |
| "Stack is always faster" | True for allocation, but stack has size limit      | Stack for small, short-lived. Heap for large, dynamic. Both needed |
| "Go has no memory leaks" | GC prevents dangling pointers, NOT reference leaks | Goroutine leak = hold references → objects never GC'd              |

🎯 **Interview Pattern:** "Explain stack vs heap" → mention allocation speed, lifetime, fragmentation, GC impact.

🔗 **Knowledge Chain:** Stack/Heap → Escape Analysis → GC Tuning → Memory Profiling (pprof)

---

### Concept 3: Virtual Memory & Paging

🪝 **Memory Hook:** Virtual memory = **ảo thuật** — mỗi process nghĩ mình có toàn bộ 4GB RAM riêng. Thực tế OS chia thành "trang" 4KB, chỉ load trang đang dùng vào RAM, còn lại để trên disk.

**Why exists / Tại sao tồn tại:**

- Level 1: Process isolation — mỗi process có address space riêng, không truy cập memory process khác
- Level 2: Run programs lớn hơn RAM: 16GB program trên 8GB RAM → demand paging chỉ load pages đang dùng
- Level 3: TLB (Translation Lookaside Buffer) cache page table entries → virtual→physical translation O(1) khi TLB hit, ~100ns TLB miss

**Layer 1 — Simple Analogy / Lớp 1:**
Virtual memory giống **sách có 1000 trang nhưng bàn chỉ đặt được 10 trang**: đọc trang nào thì lấy trang đó ra bàn (RAM), trang không đọc để trên kệ (disk). Page fault = "trang không trên bàn, phải lấy từ kệ" → chậm.

**Layer 2 — Mechanics / Lớp 2:**

```
Virtual → Physical translation:
┌──────────────┐     ┌───────────┐     ┌──────────────┐
│ Virtual addr │ ──→ │ Page Table│ ──→ │ Physical addr│
│ (per process)│     │ (per proc)│     │ (shared RAM) │
└──────────────┘     └───────────┘     └──────────────┘
                         ↑
                    TLB cache (CPU)
                    Hit: ~1ns | Miss: ~100ns

Page fault flow:
1. CPU accesses virtual address
2. TLB miss → check page table
3. Page not in RAM → PAGE FAULT (trap to kernel)
4. OS loads page from disk → ~10ms (10,000,000ns!)
5. Update page table, resume process

Page replacement algorithms:
├── LRU: evict least recently used (optimal but expensive to track)
├── Clock (approximate LRU): circular buffer with reference bits
└── Linux: two-list (active/inactive) with aging
```

**Layer 3 — Edge Cases / Lớp 3:**

- Thrashing: working set > physical RAM → constant page faults → system grinds to halt
- Huge pages: 2MB/1GB pages → fewer TLB entries needed → better for large in-memory databases
- NUMA: Non-Uniform Memory Access — access remote node memory ~2× slower than local

| Sai lầm                             | Tại sao sai                   | Đúng là                                                    |
| ----------------------------------- | ----------------------------- | ---------------------------------------------------------- |
| "Swap = free extra RAM"             | Swap is 1000× slower than RAM | Swap = last resort. If swapping frequently → add more RAM  |
| "More RAM always fixes performance" | Thrashing = working set issue | Reduce working set size or optimize memory access patterns |

🎯 **Interview Pattern:** "How does virtual memory work?" → page table, TLB, demand paging, page fault cost.

🔗 **Knowledge Chain:** Virtual Memory → Paging → TLB → Cache Hierarchy → NUMA → Database Buffer Pool

---

### Concept 4: CPU Scheduling

🪝 **Memory Hook:** CPU scheduler = **quản lý sân bay** — mỗi process = máy bay chờ runway (CPU). Preemptive = quản lý có thể "đuổi" máy bay đang cất cánh nếu có VIP (high priority). CFS = "mỗi máy bay được cất cánh fair, ai chờ lâu nhất đi trước".

**Why exists / Tại sao tồn tại:**

- Level 1: Multiple processes, 1 CPU → scheduler decides who runs and when
- Level 2: Interactive vs batch tradeoff: interactive needs low latency, batch needs throughput. CFS balances both
- Level 3: Real-time scheduling: hard real-time (missed deadline = failure), soft real-time (missed = degraded). Linux SCHED_FIFO/SCHED_RR for RT

**Layer 1 — Simple Analogy / Lớp 1:**
Scheduling giống **xếp hàng ở ngân hàng**: FIFO = ai đến trước phục vụ trước. Round Robin = mỗi người 5 phút, hết giờ ra sau xếp lại. CFS = ai chờ lâu nhất được phục vụ tiếp.

**Layer 2 — Mechanics / Lớp 2:**

```
Linux CFS (Completely Fair Scheduler):
├── Each process has vruntime (virtual runtime)
├── Process that ran LEAST gets scheduled next
├── Stored in Red-Black tree (O(log n) lookup)
├── Interactive process: short CPU bursts → low vruntime → prioritized naturally
└── nice value: -20 (highest priority) to +19 (lowest)

Scheduling algorithms comparison:
┌─────────────┬──────────┬──────────┬────────────┐
│ Algorithm   │ Type     │ Fairness │ Latency    │
├─────────────┼──────────┼──────────┼────────────┤
│ FIFO        │ Non-preemp│ Poor    │ Convoy effect│
│ SJF         │ Non-preemp│ Poor    │ Starvation │
│ Round Robin │ Preemptive│ Good    │ Quantum dep│
│ CFS         │ Preemptive│ Excellent│ Low        │
│ MLFQ        │ Preemptive│ Good    │ Adaptive   │
└─────────────┴──────────┴──────────┴────────────┘
```

**Layer 3 — Edge Cases / Lớp 3:**

- Priority inversion: low-priority task holds lock needed by high-priority → Mars Pathfinder bug. Fix: priority inheritance
- GOMAXPROCS in container: Go reads /proc/cpuinfo (host CPUs), not cgroup limit → set manually in K8s
- CPU pinning: bind process to specific core → reduce context switch, better cache utilization

| Sai lầm                                    | Tại sao sai                                | Đúng là                                                |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------------------------ |
| "GOMAXPROCS = host CPU count in container" | Go may not read cgroup limits correctly    | Set GOMAXPROCS explicitly or use uber-go/automaxprocs  |
| "More threads = faster"                    | Beyond CPU count → context switch overhead | CPU-bound: threads ≈ cores. I/O-bound: more threads OK |

🎯 **Interview Pattern:** "CPU-bound vs I/O-bound?" → scheduling implications, thread pool sizing, Go GOMAXPROCS.

🔗 **Knowledge Chain:** Scheduling → GOMAXPROCS → Container Limits → Performance Tuning

---

### Concept 5: IPC & Synchronization

🪝 **Memory Hook:** IPC = **cách nhân viên ở phòng khác nhau giao tiếp**: Pipe = ống chuyển giấy tờ (one-way). Shared memory = bảng trắng chung (fast but need lock). Socket = điện thoại (across machines). Mutex = khóa phòng (only 1 person inside).

**Why exists / Tại sao tồn tại:**

- Level 1: Processes have isolated memory → need mechanism to communicate
- Level 2: Mutex = ownership (lock/unlock same thread), Semaphore = signaling (producer/consumer, counting)
- Level 3: Lock-free programming: CAS (Compare-And-Swap) → atomic operations → avoid mutex overhead. Go: sync/atomic, channels (CSP model)

**Layer 1 — Simple Analogy / Lớp 1:**
Mutex giống **chìa khóa toilet** — chỉ 1 người dùng, xong trả lại. Semaphore giống **bãi đỗ xe 10 chỗ** — semaphore(10) = 10 xe vào cùng lúc, xe thứ 11 chờ. Channel (Go) giống **bàn giao hàng** — người gửi đặt lên, người nhận lấy đi.

**Layer 2 — Mechanics / Lớp 2:**

```
IPC mechanisms:
┌──────────────────┬────────────┬──────────────┬────────────┐
│ Mechanism        │ Speed      │ Scope        │ Use Case   │
├──────────────────┼────────────┼──────────────┼────────────┤
│ Pipe             │ Medium     │ Parent-child │ Shell: a|b │
│ Named pipe(FIFO) │ Medium     │ Any process  │ IPC on host│
│ Shared memory    │ Fastest    │ Same host    │ High-perf  │
│ Message queue    │ Medium     │ Same host    │ Async msgs │
│ Socket           │ Slower     │ Network      │ Client/srvr│
│ Signal           │ Fast       │ Same host    │ SIGTERM etc│
│ Go channel       │ Fast       │ Same process │ CSP model  │
└──────────────────┴────────────┴──────────────┴────────────┘

Mutex vs Semaphore:
├── Mutex: binary, ownership (lock thread must unlock), priority inheritance
├── Semaphore: counting, no ownership, signaling pattern
└── Go: sync.Mutex + sync.RWMutex + channels (prefer channels for Go)
```

**Layer 3 — Edge Cases / Lớp 3:**

- Spinlock vs Mutex: spinlock = busy-wait (good for short critical sections on multicore), mutex = sleep/wake (good for long waits)
- Reader-Writer lock: multiple readers OR single writer → RWMutex in Go
- Go channels: unbuffered = synchronous (sender blocks until receiver ready), buffered = async up to capacity

| Sai lầm                            | Tại sao sai                            | Đúng là                                                                     |
| ---------------------------------- | -------------------------------------- | --------------------------------------------------------------------------- |
| "Mutex and semaphore are the same" | Mutex has ownership, semaphore doesn't | Mutex = lock/unlock by owner. Semaphore = signal/wait by anyone             |
| "Always use mutex for Go"          | Go prefers channels for communication  | "Share memory by communicating" — use channels, mutex for shared state only |

🎯 **Interview Pattern:** "Mutex vs Semaphore?" → ownership, counting, use cases. "Go concurrency?" → channels + select.

🔗 **Knowledge Chain:** IPC → Mutex/Semaphore → Channels → Concurrent Patterns → Distributed Systems

---

### Concept 6: Deadlock

🪝 **Memory Hook:** Deadlock = **2 xe gặp nhau trên cầu 1 lane** — xe A chờ xe B lùi, xe B chờ xe A lùi → cả 2 đứng mãi. 4 điều kiện Coffman: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.

**Why exists / Tại sao tồn tại:**

- Level 1: Multiple threads/processes competing for shared resources → circular dependency → freeze
- Level 2: Distributed deadlock: Service A calls Service B, B calls A → both waiting → timeout. Database: transaction A locks row 1, needs row 2; transaction B locks row 2, needs row 1
- Level 3: Detection vs Prevention: detection = wait-for graph cycle detection (DB). Prevention = break 1 of 4 conditions (lock ordering)

**Layer 1 — Simple Analogy / Lớp 1:**
4 người ngồi bàn tròn, mỗi người cần 2 đũa để ăn. Mỗi người cầm 1 đũa bên trái và chờ đũa bên phải → tất cả chờ mãi = deadlock (Dining Philosophers Problem).

**Layer 2 — Mechanics / Lớp 2:**

```
4 Coffman Conditions (ALL must hold for deadlock):
1. Mutual Exclusion: resource held exclusively
2. Hold and Wait: hold one, wait for another
3. No Preemption: can't forcibly take resource
4. Circular Wait: A→B→C→A dependency cycle

Prevention strategies (break any 1 condition):
├── Break #2: Request all resources at once (atomic)
├── Break #4: Global lock ordering (always lock A before B)
├── Break #3: Allow preemption (timeout + retry)
└── Detection: periodically check wait-for graph for cycles

Database deadlock handling:
├── Detection: wait-for graph → find cycle
├── Resolution: abort one transaction (victim selection)
└── Go DB: context.WithTimeout → avoid indefinite waits
```

**Layer 3 — Edge Cases / Lớp 3:**

- Distributed deadlock: no global view → use timeouts as practical solution
- Livelock: processes keep changing state but make no progress (like 2 people side-stepping in hallway)
- Go: goroutine leak is similar to deadlock — goroutine waits on channel nobody sends to

| Sai lầm                           | Tại sao sai                                         | Đúng là                                                    |
| --------------------------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| "Deadlock only in multi-threaded" | DB transactions, distributed services also deadlock | Any shared resource with circular wait → deadlock          |
| "Timeout prevents deadlock"       | Timeout detects, doesn't prevent                    | Prevention = lock ordering. Timeout = detection + recovery |

🎯 **Interview Pattern:** "What causes deadlock?" → 4 Coffman conditions + "How to prevent?" → lock ordering. DB context.

🔗 **Knowledge Chain:** Deadlock → Lock Ordering → Distributed Locks → Database Isolation → Timeout Patterns

---

### Concept 7: File Systems & I/O

🪝 **Memory Hook:** File descriptor = **thẻ mượn sách thư viện** — OS phát cho mỗi file/socket/pipe opened. Giới hạn = 1024 thẻ default. Không trả lại (close) = "too many open files" crash.

**Why exists / Tại sao tồn tại:**

- Level 1: Everything in Unix is a file — regular files, sockets, pipes, devices. File descriptors = uniform interface
- Level 2: Blocking vs non-blocking I/O: blocking = thread waits → wastes CPU. Non-blocking + epoll/kqueue = event-driven (Node.js, Go netpoller)
- Level 3: Zero-copy: sendfile() avoids user-space copy → Kafka, Nginx performance. mmap = memory-mapped file for random access

**Layer 1 — Simple Analogy / Lớp 1:**
I/O giống **đặt hàng ở nhà hàng**: Blocking = ngồi chờ order xong mới đặt tiếp. Non-blocking = đặt order, làm việc khác, waiter (kernel) gọi khi xong. Multiplexing (epoll) = 1 waiter phục vụ 1000 bàn.

**Layer 2 — Mechanics / Lớp 2:**

```
I/O Models:
┌───────────────┬──────────────────┬────────────────────┐
│ Model         │ Mechanism        │ Use Case           │
├───────────────┼──────────────────┼────────────────────┤
│ Blocking      │ Thread waits     │ Simple scripts     │
│ Non-blocking  │ Poll repeatedly  │ Busy-wait (rare)   │
│ I/O Mux       │ select/poll/epoll│ Servers (Nginx)    │
│ Async I/O     │ Kernel callback  │ io_uring (Linux)   │
│ Signal-driven │ SIGIO            │ Legacy             │
└───────────────┴──────────────────┴────────────────────┘

File system layers:
Application → VFS (Virtual File System) → ext4/xfs/btrfs → Block layer → Disk

File descriptor table:
├── fd 0: stdin
├── fd 1: stdout
├── fd 2: stderr
├── fd 3: open file / socket / pipe
└── ulimit -n: max open FDs (default 1024, prod: 65536+)
```

**Layer 3 — Edge Cases / Lớp 3:**

- epoll vs kqueue: Linux uses epoll, macOS/BSD uses kqueue. Go runtime abstracts both via netpoller
- fd leak: forgot to close → accumulates → "too many open files". Use defer close() in Go
- Write-ahead log (WAL): write to log first, then data → crash recovery. PostgreSQL, etcd, Kafka all use WAL

| Sai lầm                        | Tại sao sai                                                                            | Đúng là                                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| "Non-blocking I/O = async I/O" | Non-blocking = returns immediately (may need retry). Async = kernel notifies when done | Non-blocking + epoll ≈ async behavior. True async = io_uring/IOCP           |
| "Default fd limit is enough"   | 1024 FDs = ~1024 connections                                                           | Production: set ulimit -n 65536+. Kubernetes: configure in security context |

🎯 **Interview Pattern:** "Explain blocking vs non-blocking I/O" → models, epoll/kqueue, Go netpoller, fd limits.

🔗 **Knowledge Chain:** File System → I/O Models → epoll/kqueue → Go Netpoller → Event-Driven Architecture

---

## Table of Contents

1. [OS Fundamentals](#os-fundamentals)
2. [Process Management](#process-management)
3. [Thread Management](#thread-management)
4. [CPU Scheduling](#cpu-scheduling)
5. [Memory Management](#memory-management)
6. [File Systems](#file-systems)
7. [I/O Systems](#io-systems)
8. [Deadlocks](#deadlocks)
9. [Security](#security)
10. [Modern OS Concepts](#modern-os-concepts)

## OS Fundamentals

### What is an Operating System?

**Definition:** Software that manages hardware and provides services to applications

**Main Functions:**

```
1. Resource Management
   - CPU, memory, storage, I/O devices

2. Process Management
   - Creation, scheduling, termination

3. Memory Management
   - Allocation, deallocation, virtual memory

4. File System Management
   - File operations, directories, permissions

5. I/O Management
   - Device drivers, buffering, caching

6. Security and Protection
   - Authentication, authorization, access control
```

### OS Structure

**Layered Architecture:**

```
┌─────────────────────────┐
│   User Applications     │
├─────────────────────────┤
│   System Libraries      │
├─────────────────────────┤
│   System Calls          │
├─────────────────────────┤
│   Kernel                │
├─────────────────────────┤
│   Hardware              │
└─────────────────────────┘
```

**Kernel Types:**

**Monolithic Kernel:**

```
All OS services in kernel space
- Fast (no context switching)
- Less secure (everything privileged)
- Example: Linux, Unix
```

**Microkernel:**

```
Minimal kernel, services in user space
- More secure (isolation)
- Slower (more context switching)
- Example: Minix, QNX
```

**Hybrid Kernel:**

```
Combination of both
- Balance performance and security
- Example: Windows NT, macOS
```

### System Calls

**Definition:** Interface between user programs and OS

**Categories:**

```
1. Process Control
   - fork(), exec(), exit(), wait()

2. File Management
   - open(), read(), write(), close()

3. Device Management
   - ioctl(), read(), write()

4. Information Maintenance
   - getpid(), alarm(), sleep()

5. Communication
   - pipe(), shmget(), mmap()
```

**Example (Unix):**

```c
// Process creation
pid_t pid = fork();

if (pid == 0) {
    // Child process
    execl("/bin/ls", "ls", "-l", NULL);
} else {
    // Parent process
    wait(NULL);
}

// File operations
int fd = open("file.txt", O_RDONLY);
char buffer[1024];
read(fd, buffer, sizeof(buffer));
close(fd);
```

## Process Management

### Process Concept

**Definition:** Program in execution

**Process Components:**

```
┌─────────────────────┐
│   Stack             │ ← Function calls, local variables
├─────────────────────┤
│   Heap              │ ← Dynamic memory
├─────────────────────┤
│   Data              │ ← Global variables
├─────────────────────┤
│   Text (Code)       │ ← Program instructions
└─────────────────────┘
```

**Process Control Block (PCB):**

```
- Process ID (PID)
- Process State
- Program Counter
- CPU Registers
- Memory Management Info
- I/O Status
- Accounting Info
```

### Process States

**State Diagram:**

```
        ┌─────────┐
        │   New   │
        └────┬────┘
             ↓
        ┌─────────┐
   ┌───→│  Ready  │←───┐
   │    └────┬────┘    │
   │         ↓         │
   │    ┌─────────┐    │
   │    │ Running │    │
   │    └────┬────┘    │
   │         ↓         │
   │    ┌─────────┐    │
   └────│ Waiting │────┘
        └────┬────┘
             ↓
        ┌─────────┐
        │Terminated│
        └─────────┘
```

**State Transitions:**

```
New → Ready: Process created, loaded into memory
Ready → Running: Scheduler selects process
Running → Ready: Time quantum expired (preemption)
Running → Waiting: I/O or event wait
Waiting → Ready: I/O or event completion
Running → Terminated: Process completes
```

### Process Creation

**Unix fork():**

```c
#include <stdio.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();

    if (pid < 0) {
        // Fork failed
        fprintf(stderr, "Fork failed\n");
        return 1;
    } else if (pid == 0) {
        // Child process
        printf("Child process: PID = %d\n", getpid());
        execlp("/bin/ls", "ls", NULL);
    } else {
        // Parent process
        printf("Parent process: PID = %d, Child PID = %d\n",
               getpid(), pid);
        wait(NULL);
        printf("Child completed\n");
    }

    return 0;
}
```

### Inter-Process Communication (IPC)

**Shared Memory:**

```c
// Create shared memory
int shmid = shmget(IPC_PRIVATE, 1024, IPC_CREAT | 0666);

// Attach to shared memory
char *shared = (char *)shmat(shmid, NULL, 0);

// Write to shared memory
strcpy(shared, "Hello from process");

// Detach
shmdt(shared);

// Remove
shmctl(shmid, IPC_RMID, NULL);
```

**Message Passing:**

```c
// Create message queue
int msgid = msgget(IPC_PRIVATE, IPC_CREAT | 0666);

// Send message
struct message {
    long type;
    char text[100];
};

struct message msg;
msg.type = 1;
strcpy(msg.text, "Hello");
msgsnd(msgid, &msg, sizeof(msg.text), 0);

// Receive message
msgrcv(msgid, &msg, sizeof(msg.text), 1, 0);
```

**Pipes:**

```c
int pipefd[2];
pipe(pipefd);

if (fork() == 0) {
    // Child: write to pipe
    close(pipefd[0]); // Close read end
    write(pipefd[1], "Hello", 5);
    close(pipefd[1]);
} else {
    // Parent: read from pipe
    close(pipefd[1]); // Close write end
    char buffer[10];
    read(pipefd[0], buffer, 5);
    close(pipefd[0]);
}
```

## Thread Management

### Thread Concept

**Definition:** Lightweight process, unit of execution within process

**Process vs Thread:**

```
Process:
- Own address space
- Heavy context switch
- Independent
- Isolated

Thread:
- Shared address space
- Light context switch
- Dependent on process
- Not isolated
```

**Thread Components:**

```
Shared:
- Code section
- Data section
- Heap
- Open files

Private:
- Thread ID
- Program counter
- Register set
- Stack
```

### Thread Models

**User-Level Threads:**

```
Managed by user-level library
- Fast (no kernel involvement)
- Portable
- Cannot utilize multiple CPUs
- Blocking system call blocks all threads
```

**Kernel-Level Threads:**

```
Managed by OS kernel
- Can utilize multiple CPUs
- Blocking call doesn't block all threads
- Slower (kernel involvement)
- OS-specific
```

**Hybrid Model:**

```
Many-to-many mapping
- Combines benefits of both
- Complex implementation
```

### POSIX Threads (pthreads)

```c
#include <pthread.h>
#include <stdio.h>

void *thread_function(void *arg) {
    int *num = (int *)arg;
    printf("Thread %d running\n", *num);
    return NULL;
}

int main() {
    pthread_t threads[5];
    int thread_args[5];

    // Create threads
    for (int i = 0; i < 5; i++) {
        thread_args[i] = i;
        pthread_create(&threads[i], NULL, thread_function, &thread_args[i]);
    }

    // Wait for threads
    for (int i = 0; i < 5; i++) {
        pthread_join(threads[i], NULL);
    }

    return 0;
}
```

### Thread Synchronization

**Mutex:**

```c
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
int counter = 0;

void *increment(void *arg) {
    for (int i = 0; i < 1000000; i++) {
        pthread_mutex_lock(&mutex);
        counter++;
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}
```

**Semaphore:**

```c
#include <semaphore.h>

sem_t semaphore;
sem_init(&semaphore, 0, 1); // Binary semaphore

void *thread_function(void *arg) {
    sem_wait(&semaphore); // P operation
    // Critical section
    sem_post(&semaphore); // V operation
    return NULL;
}
```

## CPU Scheduling

### Scheduling Algorithms

**First-Come, First-Served (FCFS):**

```
Non-preemptive
Simple but can cause convoy effect

Process | Burst Time | Arrival Time
--------|------------|-------------
P1      | 24         | 0
P2      | 3          | 0
P3      | 3          | 0

Gantt Chart:
|  P1  |P2|P3|
0     24  27 30

Average Waiting Time: (0 + 24 + 27) / 3 = 17
```

**Shortest Job First (SJF):**

```
Non-preemptive
Optimal average waiting time
Requires burst time prediction

Process | Burst Time
--------|------------
P1      | 6
P2      | 8
P3      | 7
P4      | 3

Gantt Chart:
|P4|  P1  |  P3  |   P2   |
0  3     9      16       24

Average Waiting Time: (0 + 3 + 9 + 16) / 4 = 7
```

**Round Robin (RR):**

```
Preemptive
Time quantum = 4

Process | Burst Time
--------|------------
P1      | 24
P2      | 3
P3      | 3

Gantt Chart:
|P1|P2|P3|P1|P1|P1|P1|P1|P1|
0  4  7 10 14 18 22 26 30

Average Waiting Time: 5.66
```

**Priority Scheduling:**

```
Each process has priority
Lower number = higher priority
Can be preemptive or non-preemptive

Process | Burst | Priority
--------|-------|----------
P1      | 10    | 3
P2      | 1     | 1
P3      | 2     | 4
P4      | 1     | 5
P5      | 5     | 2

Order: P2, P5, P1, P3, P4
```

**Multilevel Queue:**

```
Multiple queues with different priorities

┌──────────────────┐
│ System Processes │ ← Highest priority
├──────────────────┤
│ Interactive      │
├──────────────────┤
│ Batch            │ ← Lowest priority
└──────────────────┘
```

## Memory Management

### Memory Hierarchy

```
┌──────────────┐
│  Registers   │ ← Fastest, smallest
├──────────────┤
│  Cache       │
├──────────────┤
│  Main Memory │
├──────────────┤
│  Disk        │ ← Slowest, largest
└──────────────┘
```

### Memory Allocation

**Contiguous Allocation:**

```
Fixed Partitioning:
┌────────┐
│  OS    │
├────────┤
│ Part 1 │
├────────┤
│ Part 2 │
├────────┤
│ Part 3 │
└────────┘

Dynamic Partitioning:
┌────────┐
│  OS    │
├────────┤
│ Proc 1 │
├────────┤
│  Free  │
├────────┤
│ Proc 2 │
└────────┘
```

**Allocation Strategies:**

```
First Fit: Allocate first hole large enough
Best Fit: Allocate smallest hole large enough
Worst Fit: Allocate largest hole
```

### Paging

**Concept:** Divide memory into fixed-size pages

```
Logical Address: [Page Number | Offset]
Physical Address: [Frame Number | Offset]

Page Table:
Page | Frame
-----|------
0    | 5
1    | 2
2    | 7
3    | 1
```

**Address Translation:**

```
Logical Address: 0x1234
Page Size: 4KB (0x1000)

Page Number: 0x1234 / 0x1000 = 0x1
Offset: 0x1234 % 0x1000 = 0x234

Page Table: Page 1 → Frame 5

Physical Address: (5 × 0x1000) + 0x234 = 0x5234
```

### Virtual Memory

**Demand Paging:**

```
Load pages only when needed
- Reduces memory usage
- Increases multiprogramming
- Page faults when page not in memory
```

**Page Replacement Algorithms:**

**FIFO:**

```
Reference String: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5
Frames: 3

Time: 1  2  3  4  1  2  5  1  2  3  4  5
      1  1  1  4  4  4  4  4  4  3  3  3
         2  2  2  2  2  5  5  5  5  4  4
            3  3  3  3  3  3  3  3  3  5
      F  F  F  F  -  -  F  -  -  F  F  F

Page Faults: 9
```

**LRU (Least Recently Used):**

```
Replace page not used for longest time
Better performance than FIFO
More complex implementation
```

## File Systems

### File Concept

**File Attributes:**

```
- Name
- Type
- Location
- Size
- Protection
- Time, date
- User ID
```

**File Operations:**

```
- Create
- Open
- Read
- Write
- Seek
- Close
- Delete
```

### Directory Structure

**Single-Level:**

```
/
├── file1
├── file2
└── file3

Simple but no organization
```

**Two-Level:**

```
/
├── user1/
│   ├── file1
│   └── file2
└── user2/
    ├── file1
    └── file3

Separate directories per user
```

**Tree-Structured:**

```
/
├── home/
│   ├── user1/
│   │   ├── docs/
│   │   └── pics/
│   └── user2/
└── etc/

Most common structure
```

### File Allocation Methods

**Contiguous:**

```
File stored in contiguous blocks
- Fast sequential access
- External fragmentation
- Hard to grow files
```

**Linked:**

```
Each block points to next
- No external fragmentation
- Slow random access
- Pointer overhead
```

**Indexed:**

```
Index block contains pointers
- Fast random access
- No external fragmentation
- Index block overhead
```

### Unix File System

**inode Structure:**

```
- File type and permissions
- Owner and group
- File size
- Timestamps
- Direct pointers (12)
- Single indirect pointer
- Double indirect pointer
- Triple indirect pointer
```

## I/O Systems

### I/O Hardware

**Device Types:**

```
Block Devices:
- Fixed-size blocks
- Random access
- Example: Disk, SSD

Character Devices:
- Stream of characters
- Sequential access
- Example: Keyboard, mouse
```

### I/O Methods

**Programmed I/O:**

```
CPU polls device status
- Simple
- Wastes CPU time
```

**Interrupt-Driven I/O:**

```
Device interrupts CPU when ready
- More efficient
- Still involves CPU for data transfer
```

**DMA (Direct Memory Access):**

```
Device transfers data directly to memory
- Most efficient
- CPU only involved at start and end
```

### Buffering

**Single Buffer:**

```
┌──────┐    ┌────────┐    ┌──────┐
│Device│ →  │ Buffer │ →  │ User │
└──────┘    └────────┘    └──────┘
```

**Double Buffer:**

```
┌──────┐    ┌────────┐
│Device│ →  │Buffer 1│ ⇄ User
└──────┘    ├────────┤
            │Buffer 2│
            └────────┘
```

## Deadlocks

### Deadlock Conditions

**Four Necessary Conditions:**

```
1. Mutual Exclusion
   - Resource cannot be shared

2. Hold and Wait
   - Process holds resource while waiting

3. No Preemption
   - Resource cannot be forcibly taken

4. Circular Wait
   - Circular chain of waiting processes
```

### Deadlock Prevention

**Break One Condition:**

```
1. Mutual Exclusion
   - Make resources sharable (not always possible)

2. Hold and Wait
   - Request all resources at once
   - Release all before requesting new

3. No Preemption
   - Allow resource preemption

4. Circular Wait
   - Order resources, request in order
```

### Deadlock Avoidance

**Banker's Algorithm:**

```
Check if granting request leaves system in safe state

Available: [3, 3, 2]

Process | Allocation | Max | Need
--------|------------|-----|------
P0      | [0,1,0]    |[7,5,3]|[7,4,3]
P1      | [2,0,0]    |[3,2,2]|[1,2,2]
P2      | [3,0,2]    |[9,0,2]|[6,0,0]
P3      | [2,1,1]    |[2,2,2]|[0,1,1]
P4      | [0,0,2]    |[4,3,3]|[4,3,1]

Safe sequence: P1, P3, P4, P2, P0
```

## Security

### Protection Mechanisms

**Access Control:**

```
Access Control Matrix:

        File1  File2  File3
User1   RW     R      -
User2   R      RW     R
User3   -      R      RWX
```

**Access Control Lists (ACL):**

```
File1: User1(RW), User2(R)
File2: User1(R), User2(RW), User3(R)
File3: User3(RWX)
```

**Capabilities:**

```
User1: File1(RW), File2(R)
User2: File1(R), File2(RW)
User3: File2(R), File3(RWX)
```

### Authentication

**Methods:**

```
1. Something you know (password)
2. Something you have (token)
3. Something you are (biometric)
```

## Modern OS Concepts

### Virtualization

**Virtual Machines:**

```
┌─────────────────────────┐
│   Guest OS 1 | Guest OS 2│
├─────────────────────────┤
│   Virtual Machine Monitor│
├─────────────────────────┤
│      Host OS             │
├─────────────────────────┤
│      Hardware            │
└─────────────────────────┘
```

### Containers

**Docker Architecture:**

```
┌─────────────────────────┐
│ Container 1 | Container 2│
├─────────────────────────┤
│   Container Runtime      │
├─────────────────────────┤
│      Host OS             │
├─────────────────────────┤
│      Hardware            │
└─────────────────────────┘

Lighter than VMs
Share kernel
Isolated user space
```

## Interview Questions

**🟢 [Junior] Q: Explain the difference between process and thread.**

A: Process is independent program with own memory space, heavy context switch. Thread is lightweight unit within process, shares memory, light context switch. Use threads for concurrent tasks within application, processes for isolation and security.

**🟡 [Mid] Q: What is a deadlock and how can it be prevented?**

A: Deadlock occurs when processes wait for each other in cycle. Four conditions: mutual exclusion, hold and wait, no preemption, circular wait. Prevention: break one condition (resource ordering, preemption, request all at once). Avoidance: Banker's algorithm checks safe states.

**🟡 [Mid] Q: Explain virtual memory and paging.**

A: Virtual memory gives each process illusion of large address space. Paging divides memory into fixed-size pages, maps virtual to physical addresses via page table. Enables: more processes than physical memory, memory protection, shared memory. Uses demand paging to load pages only when needed.

**🟡 [Mid] Q: What are the main CPU scheduling algorithms?**

A: FCFS (simple, convoy effect), SJF (optimal waiting time, needs prediction), Round Robin (fair, time quantum), Priority (can starve low priority), Multilevel Queue (different queues for different types). Choose based on: fairness, response time, throughput requirements.

**🟡 [Mid] Q: Explain the difference between mutex and semaphore.**

A: Mutex is binary lock for mutual exclusion, owned by thread that locks it. Semaphore is counter for resource access control, can be binary or counting, no ownership. Use mutex for critical sections, semaphore for resource pools or signaling between threads.

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is the difference between a process and a thread? / Process và thread khác nhau như thế nào? 🟢 Junior

**A:** A process is an independent program with its own address space, PCB, file descriptors, and isolated memory. Context switch costs ~1-10µs (save/restore PCB + TLB flush). A thread is a lightweight unit within a process — shares heap/code/globals, has own stack + registers. Context switch costs ~100-300ns (just registers).

```
Process:                          Thread:
┌──────────────────┐              ┌──────────────────┐
│  Code / Data     │              │  Code / Data     │ ← shared
│  Heap            │              │  Heap            │ ← shared
│  Stack           │              │  Stack A │Stack B │ ← per-thread
│  File Descriptors│              │  Registers A / B │ ← per-thread
└──────────────────┘              └──────────────────┘
Isolated — crash safe             Shared — race condition risk
```

Vietnamese explanation: Rule: dùng process cho isolation (Chrome: mỗi tab = 1 process → crash một tab không chết cả browser). Dùng thread cho concurrency trong cùng app (web server xử lý nhiều requests). Go goroutine: ~4KB stack (vs 1-8MB cho OS thread) → có thể tạo hàng triệu goroutines. M:N threading: Go scheduler maps M goroutines onto N OS threads → minimize syscall cost.

---

### Q: What causes a deadlock and how do you prevent it? / Deadlock xảy ra do đâu và cách phòng tránh? 🟡 Mid

**A:** Deadlock requires ALL four Coffman conditions: (1) Mutual exclusion, (2) Hold & Wait, (3) No preemption, (4) Circular wait. Break any one to prevent deadlock.

```
Deadlock example:
Thread A: holds Lock1 → waiting for Lock2
Thread B: holds Lock2 → waiting for Lock1
→ circular wait, both frozen forever

Prevention strategies:
1. Lock ordering: always acquire Lock1 before Lock2 (breaks circular wait)
2. Timeout + retry: tryLock(timeout) → release and retry (breaks hold & wait)
3. Resource allocation graph: detect cycle before granting
4. Banker's algorithm: only grant if safe state maintained (avoidance)
```

Vietnamese explanation: "4 điều kiện Coffman" là câu hỏi kinh điển — phải thuộc. Thực tế: PostgreSQL auto-detects deadlock bằng cycle detection trong wait-for graph → kills one transaction. MySQL: innodb_lock_wait_timeout (default 50s) → transaction timeout. Go: `-race` flag detect data races (không phải deadlock) — dùng goroutine leak detector cho deadlock.

---

### Q: How does virtual memory work? / Virtual memory hoạt động như thế nào? 🟡 Mid

**A:** Each process gets its own 64-bit virtual address space (2^48 usable on x86-64). MMU translates virtual → physical via page table. Demand paging: pages only loaded when accessed. Page fault → OS loads page from disk into RAM.

```
Virtual memory layout (per process):
┌──────────────────┐ 0xFFFFFFFF
│  Kernel space    │
├──────────────────┤
│  Stack (grows ↓) │
│  ...             │
│  Heap (grows ↑)  │
├──────────────────┤
│  Code / Data     │
└──────────────────┘ 0x00000000

TLB: hardware cache for recent page table entries
TLB miss → expensive multi-level page table walk (~100ns)
```

Vietnamese explanation: Swap space = khi RAM đầy, OS đẩy cold pages ra disk (SSD ~100µs vs RAM ~100ns = 1000x slower). Thrashing = OS liên tục swap vào/ra → giảm bằng cách tăng RAM hoặc giảm processes. `mmap()` = map file vào virtual memory → cơ sở của Redis AOF, database buffer pool. Copy-on-write (COW): fork() copies page table entries, not actual pages → fast fork, pages only copied when written.

---

### Q: Explain CPU scheduling — how does the Linux CFS work? / Giải thích CPU scheduling — Linux CFS hoạt động thế nào? 🟡 Mid

**A:** Modern OS (Linux, macOS) don't use simple Round Robin. Linux CFS (Completely Fair Scheduler): tracks each process's "virtual runtime" (vruntime) — CPU time weighted by priority (nice value). Always picks process with smallest vruntime next (stored in red-black tree).

```
CFS scheduling:
vruntime = actual_runtime / weight (nice value)
Lower nice = higher weight = lower vruntime increment per tick
→ high-priority process accumulates vruntime slowly → scheduled more often

Red-black tree ordered by vruntime:
[proc_A: 100ms] [proc_B: 150ms] [proc_C: 200ms]
→ always pick leftmost (smallest vruntime) = proc_A
```

Vietnamese explanation: "Fair" trong CFS: mỗi process nhận equal CPU share theo weight. Interactive process (UI, terminal) tự nhiên sleep nhiều → vruntime thấp → được ưu tiên khi wake up. Batch process = continuous CPU user → vruntime tăng nhanh → preempted. MLFQ (Multi-Level Feedback Queue): dùng trong nhiều systems — high priority → short quantum → interactive feel; CPU-bound → demoted lower priority.

---

### Q: What is the difference between mutex and semaphore? / Mutex và semaphore khác nhau thế nào? 🟡 Mid

**A:** **Mutex**: binary lock (0/1) with **ownership** — only the thread that locked it can unlock. Used for mutual exclusion. **Semaphore**: counter, **no ownership** — one thread signals, another can wait. Binary semaphore enables signaling; counting semaphore controls access to N resources.

```
Mutex (ownership):             Semaphore (no ownership):
Thread A: lock()               Producer: sem.signal() ← post
... critical section ...       Consumer: sem.wait()   ← P operation
Thread A: unlock()             (Thread B can signal what Thread A waits on)

Counting semaphore (connection pool of 10):
sem = Semaphore(10)
acquire: sem.wait()   → decrement, block if 0
release: sem.signal() → increment, wake waiter
```

Vietnamese explanation: Key difference: mutex có ownership (Thread B không thể unlock mutex của Thread A). Semaphore không có ownership → flexible signaling. Practical: mutex cho critical section, semaphore cho "N resources available" (rate limiting, DB connection pool). Go: `sync.Mutex`, `chan struct{}` as semaphore pattern, `golang.org/x/sync/semaphore`. Deadlock risk: mutex trong ISR (interrupt service routine) = không ổn vì mutex có sleeping wait.

---

### Q: How does the OS manage memory? What is fragmentation? / OS quản lý memory như thế nào? Fragmentation là gì? 🔴 Senior

**A:** OS memory management: stack allocation (O(1), auto-freed, LIFO), heap allocation (dynamic, fragmentation risk). Two fragmentation types: **Internal**: allocated block larger than requested (alignment/padding waste). **External**: free memory exists but not contiguous enough for large allocation.

```
External fragmentation:
[FREE 10KB][USED 5KB][FREE 10KB][USED 5KB][FREE 10KB]
Request 25KB → FAILS (30KB free total but not contiguous!)

Buddy system (powers of 2):
32KB free → split for 10KB request: [16KB][8KB][used 8KB]
Merge on free: adjacent buddies merge → reduces external fragmentation

Go GC: concurrent tri-color mark-and-sweep
- Mark: identify live objects
- Sweep: collect garbage
- Compaction: NOT done (Go uses free lists instead)
- STW pause: < 1ms target (Go 1.21+)
```

Vietnamese explanation: Stack vs heap allocation: stack = O(1) deterministic, auto-freed; heap = O(1) amortized nhưng fragmentation + GC overhead. Go escape analysis: compiler decides stack vs heap — nếu object không escape khỏi function → stack (fast, no GC pressure). `go build -gcflags="-m"` xem escape analysis. jemalloc (Firefox, Rust allocator): thread-local arenas giảm lock contention. Virtual memory + paging giải quyết external fragmentation (any physical pages mapped to contiguous virtual range).

---

## Interview Q&A Summary / Tổng Hợp Q&A Phỏng Vấn

| #   | Question                           | Difficulty | Core Concept      | Key Signal                                                             |
| --- | ---------------------------------- | ---------- | ----------------- | ---------------------------------------------------------------------- |
| 1   | Process vs thread differences?     | 🟢 Junior  | Process vs Thread | Isolation/memory/context switch cost. Add goroutine comparison         |
| 2   | What causes deadlock? Prevention?  | 🟡 Mid     | Deadlock          | 4 Coffman conditions. Break circular wait via lock ordering            |
| 3   | How does virtual memory work?      | 🟡 Mid     | Virtual Memory    | Page table, TLB, demand paging, page fault cost (~10ms)                |
| 4   | Linux CFS scheduling?              | 🟡 Mid     | CPU Scheduling    | vruntime fairness, RB tree, interactive prioritized naturally          |
| 5   | Mutex vs semaphore?                | 🟡 Mid     | IPC & Sync        | Mutex=ownership, semaphore=counting/signaling. Go prefers channels     |
| 6   | Memory management & fragmentation? | 🔴 Senior  | Memory            | Stack O(1) vs heap dynamic. Internal/external frag. Go escape analysis |

**Distribution:** 🟢 1 | 🟡 4 | 🔴 1

---

## Cold Call Simulation / Mô Phỏng Cold Call

> **⚡ "Server Node.js báo lỗi 'too many open files' — bạn debug thế nào?"**

**30-second answer:**
"This is a file descriptor leak. Each connection, file open, or pipe consumes an fd. The default limit is 1024. I'd check `lsof -p <pid> | wc -l` to see open FDs, identify which connections aren't being closed, then fix with proper defer/close handling. For production, increase ulimit -n to 65536+ and implement connection pooling."

**Follow-up: "Tại sao Go goroutine có thể handle 100K connections mà Node.js single thread cũng handle được?"**
"Both use event-driven I/O under the hood. Go's netpoller wraps epoll/kqueue — goroutines appear blocking but the runtime multiplexes onto actual I/O events. Node.js event loop does the same with libuv. The difference: Go's goroutine model lets you write synchronous-looking code, while Node requires callbacks/promises."

---

## Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại và trả lời 5 câu sau:

| #   | Type           | Question                                                                               |
| --- | -------------- | -------------------------------------------------------------------------------------- |
| 1   | 🔄 Retrieval   | Liệt kê 4 điều kiện Coffman cho deadlock. Cách phòng tránh phổ biến nhất?              |
| 2   | 🎨 Visual      | Vẽ process memory layout (text, data, BSS, heap, stack) với chiều tăng địa chỉ         |
| 3   | 🛠️ Application | Server Go handle 50K connections — cần set gì ở OS level? (ulimit, GOMAXPROCS, sysctl) |
| 4   | 🐛 Debug       | Goroutine leak: goroutine đọc channel nhưng không ai gửi — triệu chứng và fix?         |
| 5   | 🎓 Teach       | Giải thích virtual memory cho junior — tại sao 4GB process chạy trên 2GB RAM?          |

| #   | Key Points                                                                                           |
| --- | ---------------------------------------------------------------------------------------------------- |
| 1   | Mutual Exclusion, Hold&Wait, No Preemption, Circular Wait. Prevention: lock ordering (break #4)      |
| 2   | Low→High: Text, Data, BSS, Heap↑, gap, Stack↓, Kernel                                                |
| 3   | ulimit -n 65536, GOMAXPROCS=CPU cores, net.core.somaxconn, tcp keepalive                             |
| 4   | goroutine hangs forever, count grows (pprof goroutine profile). Fix: context timeout or done channel |
| 5   | Demand paging: only load pages being used into RAM. Rest stays on disk. Page fault = slow disk read  |

💬 **Feynman Prompt:** Giải thích sự khác biệt giữa Process và Thread cho người mới học lập trình. Dùng ví dụ từ cuộc sống thực.

📅 **Spaced Repetition / Lịch Ôn Tập:**

- Day 1: Đọc toàn bộ, làm Self-Check
- Day 3: Cold Call + Interview Q&A Summary (che answer)
- Day 7: Core Concepts Memory Hooks + Common Mistakes tables
- Day 14: Full Self-Check + giải thích Feynman cho bạn
- Day 30: Mock interview — debug "too many open files" + explain virtual memory

---

## Connections / Liên Kết

**Same track:**

- ➡️ [Concurrency & Parallelism](./07-concurrency-and-parallelism.md) — concurrency patterns dựa trên OS primitives
- 🔗 [Data Structures](./data-structures-theory.md) — DS implementations ảnh hưởng bởi memory layout
- 🔗 [Algorithms](./algorithms-theory.md) — algorithm performance phụ thuộc cache locality
- 🔗 [Complexity Analysis](./complexity-analysis.md) — OS overhead affects constant factors
- 🔗 [Networking Theory](./networking-theory.md) — sockets = OS-level networking

**Cross track:**

- 🔗 [Go OS](../../be-track/02-backend-knowledge/05-os-go.md) — Go-specific OS concepts (GMP, netpoller)
- 🔗 [Go Memory & GC](../../be-track/01-golang/04-memory-gc.md) — Go memory model, escape analysis, pprof
- 🔗 [System Design](../02-system-design/system-design-theory.md) — OS concepts applied to distributed systems
