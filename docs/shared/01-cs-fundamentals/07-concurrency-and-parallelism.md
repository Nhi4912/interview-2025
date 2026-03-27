# Concurrency and Parallelism Theory — Lý thuyết Đồng thời và Song song

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Shared theory for both Frontend and Backend tracks.
> Cross-referenced by: `docs/shared/01-cs-fundamentals/os-theory.md`, `docs/be-track/01-golang/03-concurrency.md`, `docs/fe-track/01-javascript/06-event-loop-async.md`

---

## Real-World Scenario / Tình Huống Thực Tế

**Grab Go service (thực tế):** Service xử lý driver matching chạy 8 goroutines để fetch data song song (location, rating, availability). Developer dùng shared `map` để collect results — không có mutex. Kết quả: race condition, map corrupted, service crash với `fatal error: concurrent map writes`. Fix: `sync.Mutex` hoặc `sync.Map` hoặc channel để aggregate. `go test -race` phát hiện race condition ngay trong CI.

**Bài học:** Concurrent code đúng khác với concurrent code nhanh. Race condition thường xảy ra intermittently — khó reproduce và debug. Understanding memory model prevents bugs trước khi chúng xảy ra.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Concurrency giống nhiều người cùng dùng chung một cái bếp: có thể nấu nhiều món cùng lúc (concurrent), nhưng chỉ một người dùng bếp tại một thời điểm (single CPU). Parallelism là nhiều bếp (multiple CPUs). Mutex là "biển hiệu bếp đang có người dùng" — ngăn collision. Deadlock là hai người cầm dao và thớt của nhau — cả hai đều chờ mãi.

**Why it matters:** Backend systems inherently concurrent. Không hiểu mutex, deadlock, race condition → không debug được production issues.

---

## Concept Map / Bản Đồ Khái Niệm

```
         [CONCURRENCY & PARALLELISM]
                    │
         ┌──────────┼──────────────┐
         ▼          ▼              ▼
   [Foundation]  [Synchronization]  [Models]
   Concurrency   Mutex/Semaphore    Fork-Join
   vs Parallel   Condition Var      MapReduce
   Process/Thread RW Lock/CAS       Actor/CSP
         │          │              │
         ▼          ▼              ▼
   [Problems]    [Hazards]       [Async]
   Producer-     Race Condition   Event Loop
   Consumer      Deadlock         Callback→Promise
   Readers-      Livelock         →Async/Await
   Writers       Starvation       Reactor/Proactor
   Dining Phil.  Memory Model
         │
         ▼
   [Applied]
   Web Server | Connection Pool | Worker Pool | GUI Thread Safety
```

---

## Overview / Tổng Quan

| #   | Concept                        | Vai trò                                                                       | Interview Weight |
| --- | ------------------------------ | ----------------------------------------------------------------------------- | ---------------- |
| 1   | Concurrency vs Parallelism     | Foundation — structure vs execution, Amdahl's Law                             | ⭐⭐⭐⭐         |
| 2   | Process/Thread/Green Thread    | Execution units — isolation, shared memory, M:N model                         | ⭐⭐⭐⭐         |
| 3   | Synchronization Primitives     | Mutex, semaphore, condition var, CAS — tools cho correctness                  | ⭐⭐⭐⭐⭐       |
| 4   | Classic Problems               | Producer-Consumer, Readers-Writers, Dining Philosophers — pattern recognition | ⭐⭐⭐⭐         |
| 5   | Deadlock & Hazards             | Coffman conditions, livelock, starvation — diagnosis skill                    | ⭐⭐⭐⭐⭐       |
| 6   | Race Conditions & Memory Model | Data race vs race condition, happens-before, ordering                         | ⭐⭐⭐⭐         |
| 7   | Parallel & Async Models        | Fork-Join, MapReduce, Actor, CSP, Event Loop — architecture selection         | ⭐⭐⭐⭐         |

**Mối quan hệ:** Concurrency/Parallelism là nền tảng → Process/Thread là execution unit → Synchronization primitives giải quyết shared state → Classic problems demo pattern → Deadlock/Race là hazards cần tránh → Parallel/Async models là high-level architectures build trên tất cả.

---

## Core Concepts — Phase 2 Deep Dive / Khái Niệm Cốt Lõi — Đào Sâu

### Concept 1: Concurrency vs Parallelism

🧠 **Memory Hook:** "**Concurrency = 1 Chef, 3 Dishes**" (xen kẽ nấu). "**Parallelism = 3 Chefs, 3 Dishes**" (nấu cùng lúc). Rob Pike: "dealing with vs doing."

❓ **Why exists:**

- Level 1: Modern apps cần handle nhiều task cùng lúc — web server, GUI, data pipeline.
- Level 2: Hardware evolution: single-core speed hit wall → multi-core. Concurrency cho structure, parallelism cho throughput. Amdahl's Law: 10% serial → max 10x speedup dù infinite cores.

🔵 **Layer 1 — Analogy:** Concurrency: 1 barista nhận order, pha cà phê, phục vụ — xen kẽ nhanh nên quán không đứng im. Parallelism: 3 barista cùng pha — thực sự nhanh hơn.

🟡 **Layer 2 — Mechanics:**

```
Amdahl's Law: Speedup = 1 / (S + P/N)
S = serial fraction, P = parallel, N = cores

20% serial → max 5x (với ∞ cores)
 5% serial → max 20x
 1% serial → max 100x

Gustafson's Law: Speedup = S + P × N
(Tăng problem size cùng cores → lạc quan hơn)
```

🔴 **Layer 3 — Edge Cases:** Node.js: concurrent (event loop) nhưng NOT parallel (single-threaded) — CPU-bound task blocks everything. Go: concurrent AND parallel — goroutines multiplexed trên OS threads.

| Sai lầm                            | Tại sao sai                                        | Đúng là                                                 |
| ---------------------------------- | -------------------------------------------------- | ------------------------------------------------------- |
| "Concurrency = parallelism"        | Concurrency là structure, parallelism là execution | Có thể concurrent không parallel (event loop)           |
| "Thêm core = tuyến tính nhanh hơn" | Amdahl's Law — serial fraction limits speedup      | Phải giảm serial portion trước khi thêm cores           |
| "Async = parallel"                 | Async là non-blocking I/O trên 1 thread            | Async là form of concurrency, không nhất thiết parallel |

🎯 **Interview Pattern:** "Concurrency vs parallelism" → Rob Pike quote + concrete examples (Node.js vs Go) + Amdahl's Law as reality check.

🔗 **Knowledge Chain:** Concurrency vs Parallelism → [Thread/Process] → [Sync primitives] → [Parallel models] → [Amdahl's Law]

---

### Concept 2: Process/Thread/Green Thread

🧠 **Memory Hook:** "**Process = Apartment**" (riêng biệt hoàn toàn). "**Thread = Roommates**" (chung nhà, chung bếp, riêng phòng ngủ). "**Green Thread = Bunk Beds**" (nhẹ nhất, runtime quản lý).

❓ **Why exists:**

- Level 1: Cần multiple execution units. Process cho isolation (crash 1 không ảnh hưởng khác), Thread cho performance (shared memory, lightweight).
- Level 2: OS threads (~1MB stack, expensive context switch) không scale đến 100K. Green threads/goroutines (~2KB stack, user-space switch) scale đến millions.

🔵 **Layer 1 — Analogy:** Process: mỗi công ty có building riêng → giao tiếp qua email (IPC). Thread: nhân viên cùng công ty, dùng chung tài liệu → cần rules (sync). Green thread: freelancers trong coworking space → scheduler phân bổ desk.

🟡 **Layer 2 — Mechanics:**

```
Context Switch Cost:
Process: ~1-10ms (TLB flush, cache cold, page table switch)
Thread:  ~1-10μs (same address space, TLB valid)
Green:   ~100ns (user-space stack pointer swap)

M:N Threading (Go model):
M goroutines ←→ N OS threads
┌───────────────────────────────────┐
│ Goroutine 1  Goroutine 2  G3  G4 │ (millions)
│      ↕           ↕        ↕   ↕  │
│    OS Thread 1    OS Thread 2     │ (= GOMAXPROCS)
│      ↕                ↕          │
│    CPU Core 1    CPU Core 2      │
└───────────────────────────────────┘
```

🔴 **Layer 3 — Edge Cases:** Blocking syscall in green thread → blocks OS thread underneath → Go runtime detects via sysmon, spawns new OS thread. Python GIL: threads exist but only 1 runs at a time → concurrent not parallel for CPU-bound.

| Sai lầm                       | Tại sao sai                                       | Đúng là                                                     |
| ----------------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| "Thread luôn tốt hơn process" | Process isolation prevents cascade failure        | Tradeoff: isolation (process) vs performance (thread)       |
| "Green threads = OS threads"  | Green threads user-space, not preemptive by OS    | Runtime scheduler manages green threads                     |
| "More threads = faster"       | Context switching overhead tăng theo thread count | Optimal thread count ≈ CPU cores × (1 + wait/compute ratio) |

🎯 **Interview Pattern:** "Process vs thread" → Shared memory tradeoff + IPC mechanisms + mention green threads as modern solution.

🔗 **Knowledge Chain:** Process/Thread → [Context switching cost] → [M:N model] → [Green threads] → [Goroutines/Erlang]

---

### Concept 3: Synchronization Primitives

🧠 **Memory Hook:** "**Mutex = Bathroom Lock**" (1 person at a time). "**Semaphore = Parking Lot**" (N spots). "**Condition Var = Waiting Room Bell**" (notify when ready). "**CAS = Optimistic Grab**" (try → retry if someone took it).

❓ **Why exists:**

- Level 1: Shared mutable state + concurrent access = corruption. Need tools to coordinate.
- Level 2: Different granularity for different needs: mutex (exclusive), semaphore (bounded), RW lock (read parallelism), CAS (lock-free for hot paths).

🔵 **Layer 1 — Analogy:** Mutex: bathroom key — only holder can enter. Semaphore(5): parking lot with 5 spots — 6th car waits. Condition variable: doctor's office — sit and wait, bell rings when your turn. CAS: trying to grab last item on shelf — if still there, take it; if someone grabbed it, go back and check again.

🟡 **Layer 2 — Mechanics:**

```
CAS (Compare-And-Swap) — hardware atomic instruction:
loop:
  old = load(addr)
  new = compute(old)
  if CAS(addr, old, new): break  // success
  // else: retry (someone changed it)

Lock hierarchy:
Spinlock → Mutex → Semaphore → RW Lock → Condition Var
  ↑ lighter, lower-level           heavier, higher-level ↑
```

🔴 **Layer 3 — Edge Cases:** ABA problem with CAS: value A→B→A, CAS sees A and succeeds but state changed. Fix: version counter (tagged pointer). Spurious wakeup: condition variable wait can return without signal → always use `while` loop, never `if`.

| Sai lầm                                 | Tại sao sai                                             | Đúng là                                        |
| --------------------------------------- | ------------------------------------------------------- | ---------------------------------------------- |
| "Mutex = semaphore(1)"                  | Mutex has owner semantics — only locker can unlock      | Semaphore has no owner — any thread can signal |
| "Lock-free = faster"                    | CAS retry loop under contention can be worse than mutex | Lock-free shines at low-moderate contention    |
| "`if` instead of `while` with cond var" | Spurious wakeup makes `if` unsafe                       | Always `while(!condition) wait()`              |

🎯 **Interview Pattern:** "When mutex vs semaphore vs channel?" → Mutex for exclusive access, semaphore for bounded concurrency (pool), channel for communication (CSP). In Go: prefer channels unless protecting simple shared state.

🔗 **Knowledge Chain:** Atomic ops (CAS) → [Spinlock] → [Mutex] → [Semaphore] → [Condition Var] → [RW Lock] → [Lock-free]

---

### Concept 4: Classic Concurrency Problems

🧠 **Memory Hook:** "**Producer-Consumer = Kitchen → Belt → Packing**" (bounded buffer). "**Readers-Writers = Library**" (many read, one write). "**Dining Philosophers = Chopstick Deadlock**" (circular wait demo).

❓ **Why exists:**

- Level 1: Abstract patterns that recur in real systems — queue processing, cache access, resource contention.
- Level 2: Interview signal — showing you understand synchronization tradeoffs through classic patterns, not just API calls.

🔵 **Layer 1 — Analogy:** Producer-Consumer: factory assembly line with limited belt space — too fast production overflows belt, too fast consumption empties it. Readers-Writers: Wikipedia — millions read simultaneously, but editing needs exclusive access. Dining Philosophers: 5 people sharing 5 chopsticks around a table — if all grab left chopstick simultaneously, deadlock.

🟡 **Layer 2 — Mechanics:**

```
Producer-Consumer solution:
mutex + not_full (cond var) + not_empty (cond var)
- Producer: lock → while(full) wait(not_full) → insert → signal(not_empty) → unlock
- Consumer: lock → while(empty) wait(not_empty) → remove → signal(not_full) → unlock

Dining Philosophers — break circular wait:
Solution: resource hierarchy — always pick lower-numbered chopstick first
Philosopher 0: pick(0), pick(1)
Philosopher 1: pick(1), pick(2)
Philosopher 4: pick(0), pick(4)  ← breaks cycle!
```

🔴 **Layer 3 — Edge Cases:** Readers-Writers starvation: readers-priority → writer starves if readers stream continuously. Fix: fair variant with turnstile. Sleeping Barber: demonstrates signaling coordination — barber sleeps when no customers, customers leave when no chairs.

| Sai lầm                                      | Tại sao sai                                   | Đúng là                                  |
| -------------------------------------------- | --------------------------------------------- | ---------------------------------------- |
| "Producer-Consumer chỉ là queue"             | Cần bounded buffer + backpressure + signaling | Unbounded queue → OOM; bounded cần sync  |
| "Readers-Writers — readers never conflict"   | Reader-priority starves writers               | Need fair variant for production         |
| "Dining Philosophers — just use global lock" | Works but serializes everything               | Resource hierarchy preserves parallelism |

🎯 **Interview Pattern:** "Solve dining philosophers" → Identify circular wait → break with resource ordering → prove no deadlock → discuss starvation.

🔗 **Knowledge Chain:** Producer-Consumer → [Message queues (Kafka)] → Readers-Writers → [RW locks, caches] → Dining Philosophers → [Lock ordering in DB]

---

### Concept 5: Deadlock & Hazards

🧠 **Memory Hook:** "**MHNC = Must Have No Circular**" — 4 Coffman conditions: **M**utual exclusion, **H**old-and-wait, **N**o preemption, **C**ircular wait. Break ANY one → no deadlock.

❓ **Why exists:**

- Level 1: Deadlock = system freeze. Production databases, microservices, OS kernel all susceptible.
- Level 2: Prevention (design-time) preferred over detection (runtime). Lock ordering is cheapest prevention. Database engines use detection + victim rollback because ordering impractical at scale.

🔵 **Layer 1 — Analogy:** Deadlock: two cars at narrow bridge from opposite sides — neither can back up. Livelock: two people in hallway both stepping aside same direction repeatedly. Starvation: VIP line always cuts regular line — regular never served.

🟡 **Layer 2 — Mechanics:**

```
Coffman Conditions (ALL 4 must hold for deadlock):
1. Mutual Exclusion — resource exclusive
2. Hold and Wait — hold some, wait for more
3. No Preemption — can't force release
4. Circular Wait — A waits B waits C waits A

Break each:
1. Lock-free (CAS) → no mutual exclusion
2. Acquire all-or-nothing → no hold-and-wait
3. tryLock + timeout → allow preemption
4. Lock ordering → no circular wait ✓ (most common)

Resource Allocation Graph:
Cycle + single instance per resource = DEADLOCK
Cycle + multiple instances = MAYBE deadlock
```

🔴 **Layer 3 — Edge Cases:** Distributed deadlock: Service A calls B, B calls C, C calls A → timeout cascade. Harder to detect than local deadlock — no shared resource graph. Fix: timeout budgets, circuit breakers. Database: PostgreSQL detects deadlock via wait-for graph, kills youngest transaction.

| Sai lầm                     | Tại sao sai                                                    | Đúng là                                                |
| --------------------------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| "Deadlock = any blocking"   | Blocking is normal; deadlock is circular permanent block       | Deadlock requires all 4 Coffman conditions             |
| "Timeout = deadlock solved" | Timeout converts deadlock to livelock if all retry immediately | Need exponential backoff + jitter                      |
| "Livelock is harmless"      | Threads burn CPU making no progress                            | Livelock wastes resources like deadlock wastes threads |

🎯 **Interview Pattern:** "What is deadlock?" → 4 Coffman conditions → break circular wait with ordering → mention tryLock+timeout → discuss database detection/rollback.

🔗 **Knowledge Chain:** Coffman conditions → [Lock ordering] → [tryLock timeout] → [Database deadlock detection] → [Distributed timeout/CB]

---

### Concept 6: Race Conditions & Memory Model

🧠 **Memory Hook:** "**Data Race = Two Hands One Cookie**" (concurrent unsynced write). "**Race Condition = Check-then-Act Gap**" (logic depends on timing). Data race ⊂ Race condition.

❓ **Why exists:**

- Level 1: Shared mutable state + concurrency → non-deterministic bugs. "Works on my machine" → fails in production under load.
- Level 2: CPU/compiler reorder instructions for performance → visibility problems. Memory model defines when writes become visible to other threads.

🔵 **Layer 1 — Analogy:** Data race: two people editing same Google Doc cell simultaneously without real-time sync — one overwrites the other. Race condition: checking seat availability then booking — between check and book, someone else takes the seat.

🟡 **Layer 2 — Mechanics:**

```
Happens-before relationship:
unlock(m) → lock(m)  (next acquire sees all prior writes)
ch <- val → val = <-ch  (channel send happens-before receive)
go f() → first instruction of f  (goroutine creation)

Memory ordering:
Sequential Consistency → Acquire-Release → Relaxed
(strongest, slowest)     (mutex pattern)   (counter only)
```

🔴 **Layer 3 — Edge Cases:** Go: concurrent map writes = `fatal error` (not just corruption — runtime detects and crashes intentionally). Double-checked locking without proper memory barrier = broken on weak-memory architectures (ARM).

| Sai lầm                                   | Tại sao sai                                                    | Đúng là                                                                           |
| ----------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| "Data race = race condition"              | Data race is unsync memory access; race condition is logic bug | Can have race condition WITHOUT data race (each access synced but sequence wrong) |
| "Tests catch race conditions"             | Races are timing-dependent — may never trigger in tests        | Use `-race` flag (Go), ThreadSanitizer (C++) for detection                        |
| "Relaxed ordering is fine for everything" | Relaxed only guarantees atomicity, not visibility              | Use acquire-release for sync, relaxed only for counters                           |

🎯 **Interview Pattern:** "Data race vs race condition" → Define each + example where race condition exists without data race (check-then-act with mutex) → mention `-race` flag and memory model.

🔗 **Knowledge Chain:** Data race → [Memory model] → [Happens-before] → [Memory ordering] → [Lock-free correctness]

---

### Concept 7: Parallel & Async Models

🧠 **Memory Hook:** "**Fork-Join = Divide & Conquer Team**" (split→parallel→merge). "**MapReduce = Assembly Line**" (map→shuffle→reduce). "**Actor = Isolated Offices + Email**" (private state, message passing). "**Event Loop = Reception Desk**" (1 person, many calls, no blocking).

❓ **Why exists:**

- Level 1: Different workloads need different concurrency architectures — no one-size-fits-all.
- Level 2: I/O-bound → event loop/async. CPU-bound → thread pool/fork-join. Distributed + fault-tolerant → actor model. Pipeline → CSP.

🔵 **Layer 1 — Analogy:** Fork-Join: divide homework among study group, combine answers. MapReduce: census — each counter processes one city (map), results grouped by category (shuffle), totals computed (reduce). Actor: independent departments communicating by memos. Event Loop: single receptionist juggling phone calls (put on hold, pick up, put on hold).

🟡 **Layer 2 — Mechanics:**

```
Model Selection Matrix:
┌─────────────────┬──────────────────┬────────────────┐
│ Workload        │ Best Model       │ Example        │
├─────────────────┼──────────────────┼────────────────┤
│ I/O-bound       │ Event loop/async │ Web server     │
│ CPU-bound       │ Thread pool      │ Image process  │
│ Pipeline        │ CSP (channels)   │ Go services    │
│ Distributed     │ Actor            │ Erlang/Akka    │
│ Big data        │ MapReduce        │ Hadoop/Spark   │
│ Divide-conquer  │ Fork-Join        │ Merge sort     │
└─────────────────┴──────────────────┴────────────────┘
```

🔴 **Layer 3 — Edge Cases:** Event loop + CPU-bound = disaster (blocks entire loop). Fix: offload to worker threads. Actor mailbox overflow: if consumer actor slower than producer → unbounded queue → OOM. Fix: backpressure, bounded mailbox.

| Sai lầm                             | Tại sao sai                                                    | Đúng là                                                         |
| ----------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------- |
| "Event loop cho mọi thứ"            | CPU-bound blocks event loop entirely                           | Event loop cho I/O-bound; worker pool cho CPU-bound             |
| "Actor model = no concurrency bugs" | Mailbox overflow, message ordering across actors               | Fewer bugs, not zero bugs — still need design discipline        |
| "MapReduce cho mọi parallel work"   | MapReduce overhead (shuffle, disk I/O) too high for small data | MapReduce cho big data batch; Fork-Join cho in-process parallel |

🎯 **Interview Pattern:** "When would you use actor model?" → Private state eliminates shared memory bugs → fault tolerance via supervision → distributed-ready. But: mention tradeoffs (mailbox overflow, debugging difficulty).

🔗 **Knowledge Chain:** Event Loop (async) → [Thread Pool] → [Fork-Join] → [MapReduce] → [Actor/CSP] → [Hybrid architectures]

---

## 0. Learning Goals

- Hiểu rõ sự khác biệt giữa concurrency (đồng thời) và parallelism (song song), không nhầm lẫn hai khái niệm.
- Nắm vững các nguyên thủy đồng bộ (mutex, semaphore, condition variable) và biết khi nào dùng cái nào.
- Phân tích được các bài toán concurrency kinh điển: Producer-Consumer, Readers-Writers, Dining Philosophers.
- Hiểu bốn điều kiện Coffman cho deadlock và các chiến lược phòng tránh/phát hiện.
- Phân biệt data race và race condition, hiểu memory model ở mức khái niệm.
- Biết các mô hình lập trình song song: Fork-Join, MapReduce, Actor, CSP và giới hạn theo Amdahl's Law.
- Hiểu mô hình bất đồng bộ (event loop, async/await) và khi nào chọn async thay vì multi-thread.
- Kết nối lý thuyết với thực tiễn: web server, connection pool, task queue, GUI thread safety.

---

## 1. Concurrency vs Parallelism — Khác biệt cốt lõi

### Definition

- **Concurrency** (đồng thời): khả năng xử lý nhiều tác vụ bằng cách xen kẽ (interleaving) trong cùng khoảng thời gian. Các tác vụ không nhất thiết chạy cùng lúc — chúng luân phiên nhau trên cùng tài nguyên.
- **Parallelism** (song song): nhiều tác vụ thực sự chạy đồng thời trên nhiều đơn vị xử lý (CPU cores, machines). Đây là tập con của concurrency — parallelism luôn concurrent nhưng ngược lại không đúng.
- Rob Pike: "Concurrency is about dealing with lots of things at once. Parallelism is about doing lots of things at once."

### Core Concepts

| Concept           | Concurrency                         | Parallelism                                |
| ----------------- | ----------------------------------- | ------------------------------------------ |
| Định nghĩa        | Quản lý nhiều tác vụ xen kẽ         | Thực thi nhiều tác vụ cùng lúc             |
| Yêu cầu phần cứng | 1 core đủ                           | Cần >= 2 cores                             |
| Mục tiêu chính    | Cải thiện responsiveness, structure | Cải thiện throughput, speed                |
| Ví dụ             | OS scheduler trên single-core       | GPU render hàng triệu pixel                |
| Khó khăn chính    | Synchronization, deadlock           | Data partitioning, communication overhead  |
| Determinism       | Non-deterministic (do scheduling)   | Có thể deterministic nếu không share state |

### Analogy

- **Concurrency**: Một đầu bếp nấu 3 món — xen kẽ giữa việc xào rau, nấu canh, chiên cá. Tại mỗi thời điểm chỉ làm 1 việc nhưng cả 3 món đều "đang được nấu".
- **Parallelism**: Ba đầu bếp, mỗi người nấu 1 món cùng lúc. Thực sự đồng thời về mặt vật lý.

### When Each Matters

- **Concurrency quan trọng khi**: I/O-bound tasks (network, disk), server xử lý nhiều request, GUI cần responsive.
- **Parallelism quan trọng khi**: CPU-bound computation (image processing, ML training, scientific simulation), dữ liệu lớn có thể chia nhỏ.

### Pseudocode (Language-agnostic)

```text
// Concurrency: interleaving on single core
scheduler_loop:
    tasks = [taskA, taskB, taskC]
    while any task not done:
        for task in tasks:
            if task.ready():
                run(task, time_slice)
                if task.blocked_on_io():
                    mark_waiting(task)

// Parallelism: true simultaneous execution
parallel_map(data, function):
    chunks = split(data, num_cores)
    results = []
    for i = 0 to num_cores - 1:
        spawn worker[i] to compute function(chunks[i])
    wait_all(workers)
    return merge(results)
```

### Interview Q&A

### 🟢 Q: What is the difference between concurrency and parallelism? `[Junior]`

**A:** Concurrency là khả năng xử lý nhiều tác vụ bằng cách xen kẽ (có thể trên 1 core). Parallelism là thực thi nhiều tác vụ cùng lúc trên nhiều core. Concurrency là về cấu trúc (structure), parallelism là về thực thi (execution).

### 🟡 Q: Can you have concurrency without parallelism? Give an example. `[Mid]`

**A:** Có. Một chương trình single-threaded dùng event loop (như Node.js) xử lý hàng nghìn request đồng thời mà không parallel — nó xen kẽ xử lý I/O callbacks trên 1 thread. Ngược lại, một chương trình chạy cùng đoạn code trên nhiều core (SIMD) là parallel nhưng không cần concurrent nếu không có tương tác giữa các phần.

### 🔴 Q: Why is non-determinism inherent in concurrent systems? `[Senior]`

**A:** Vì thứ tự thực thi phụ thuộc vào scheduler của OS, tốc độ I/O, cache state, và nhiều yếu tố ngoài tầm kiểm soát. Hai lần chạy cùng chương trình concurrent có thể cho kết quả khác nhau nếu không có synchronization đúng cách. Đây là lý do testing concurrent code rất khó — bugs có thể không reproduce được (heisenbug).

---

## 2. Processes vs Threads — Tiến trình và Luồng

### Definition

- **Process** (tiến trình): một chương trình đang chạy, có bộ nhớ riêng biệt (address space), file descriptors, và trạng thái riêng. Các process giao tiếp qua IPC (Inter-Process Communication).
- **Thread** (luồng): đơn vị thực thi nhỏ nhất trong một process. Các thread cùng process chia sẻ bộ nhớ (heap, global data) nhưng có stack riêng.
- **Green threads / Coroutines**: luồng do runtime quản lý (không phải OS), nhẹ hơn OS thread rất nhiều.

### Core Concepts & Comparison

| Aspect              | Process                                     | Thread                                  | Green Thread / Coroutine                  |
| ------------------- | ------------------------------------------- | --------------------------------------- | ----------------------------------------- |
| Memory              | Riêng biệt (isolated)                       | Chia sẻ heap, riêng stack               | Chia sẻ, stack rất nhỏ                    |
| Creation cost       | Nặng (fork, copy page table)                | Nhẹ hơn (clone)                         | Rất nhẹ (vài KB)                          |
| Context switch cost | Cao (TLB flush, cache cold)                 | Trung bình (cùng address space)         | Thấp (user-space switch)                  |
| Communication       | IPC: pipe, socket, shared memory            | Shared memory trực tiếp                 | Channel, message passing                  |
| Isolation           | Mạnh — crash 1 process không ảnh hưởng khác | Yếu — 1 thread crash = cả process crash | Tùy runtime                               |
| Scheduling          | OS scheduler                                | OS scheduler                            | Runtime scheduler                         |
| Scalability         | Hàng trăm                                   | Hàng nghìn                              | Hàng triệu (Go goroutine, Erlang process) |
| Debugging           | Dễ hơn (isolated state)                     | Khó hơn (shared state)                  | Tùy thuộc tooling                         |

### IPC Mechanisms (Inter-Process Communication)

- **Pipe**: luồng byte một chiều giữa 2 process có quan hệ parent-child.
- **Named pipe (FIFO)**: pipe có tên trong filesystem, giữa process không liên quan.
- **Message queue**: hàng đợi thông điệp do kernel quản lý, nhiều producer/consumer.
- **Shared memory**: vùng nhớ chung được map vào address space của nhiều process — nhanh nhất nhưng cần synchronization.
- **Socket**: giao tiếp qua network hoặc Unix domain socket, linh hoạt nhất.
- **Signal**: thông báo bất đồng bộ từ kernel hoặc process khác (e.g., SIGTERM, SIGKILL).

### Context Switching Cost

- Khi OS chuyển giữa 2 thread/process, nó phải: lưu registers, program counter, stack pointer của thread cũ → khôi phục cho thread mới.
- Process switch tốn hơn vì cần flush TLB (Translation Lookaside Buffer), tải page table mới.
- Thread switch nhẹ hơn vì cùng address space — TLB vẫn hợp lệ phần lớn.
- Green thread switch gần như chỉ swap stack pointer trong user-space — nhanh nhất.

### Pseudocode (Language-agnostic)

```text
// Process creation (fork model)
function main():
    pid = fork()
    if pid == 0:
        // child process
        exec("worker_program")
    else:
        // parent process
        wait(pid)

// Thread creation
function main():
    shared_counter = 0
    mutex = create_mutex()
    threads = []
    for i = 0 to N-1:
        t = create_thread(worker, shared_counter, mutex)
        threads.append(t)
    for t in threads:
        join(t)

function worker(counter, mutex):
    for i = 0 to 1000:
        lock(mutex)
        counter = counter + 1
        unlock(mutex)

// Green thread / Coroutine
function main():
    scheduler = create_scheduler()
    for i = 0 to 100000:
        scheduler.spawn(lightweight_task, i)
    scheduler.run_all()
```

### Interview Q&A

### 🟢 Q: What is the main difference between a process and a thread? `[Junior]`

**A:** Process có bộ nhớ riêng biệt và cô lập — 1 process crash không ảnh hưởng process khác. Thread chia sẻ bộ nhớ trong cùng process nên giao tiếp nhanh hơn nhưng cần synchronization và 1 thread crash có thể sập cả process.

### 🟡 Q: What are green threads and why are they useful? `[Mid]`

**A:** Green threads là các luồng do runtime (user-space) quản lý thay vì OS. Chúng rất nhẹ (vài KB stack thay vì MB), context switch nhanh, và có thể tạo hàng triệu. Go goroutines và Erlang processes là ví dụ. Runtime multiplexes green threads lên số ít OS threads (M:N model).

### 🔴 Q: Explain the M:N threading model and its trade-offs. `[Senior]`

**A:** M:N model map M green threads lên N OS threads. Ưu điểm: tạo rất nhiều logical thread mà không tốn tài nguyên OS, runtime tự schedule tối ưu. Nhược điểm: runtime scheduler phức tạp, khó debug (stack trace không rõ ràng), blocking syscall có thể block cả OS thread (cần careful handling — Go dùng sysmon để detect và spawn OS thread mới). Complexity cũng tăng khi cần preemption trong user-space.

---

## 3. Synchronization Primitives — Các nguyên thủy đồng bộ

### Definition

- Synchronization primitives là các cơ chế để điều phối truy cập tài nguyên chia sẻ giữa nhiều thread/process, đảm bảo tính đúng đắn (correctness) trong môi trường concurrent.

### 3.1 Mutex (Mutual Exclusion)

| Property        | Description                               | Vietnamese                          |
| --------------- | ----------------------------------------- | ----------------------------------- |
| Mục đích        | Đảm bảo chỉ 1 thread vào critical section | Khóa loại trừ tương hỗ              |
| Owner semantics | Thread nào lock thì phải unlock           | Có tính sở hữu                      |
| Recursive mutex | Cho phép cùng thread lock nhiều lần       | Cần đếm số lần lock/unlock          |
| Cost            | Moderate — kernel call nếu contention     | Nặng hơn spinlock khi ít contention |

```text
mutex = create_mutex()

function safe_increment(counter, mutex):
    lock(mutex)          // acquire — block nếu thread khác đang giữ
    counter = counter + 1
    unlock(mutex)        // release — cho thread khác vào

// CRITICAL: luôn unlock trong finally/defer để tránh deadlock khi exception
```

### 3.2 Semaphore (Counting vs Binary)

| Type               | Description                                           | Vietnamese                                 |
| ------------------ | ----------------------------------------------------- | ------------------------------------------ |
| Binary semaphore   | Giá trị 0 hoặc 1, tương tự mutex nhưng không có owner | Dùng cho signaling                         |
| Counting semaphore | Giá trị 0..N, cho phép tối đa N thread đồng thời      | Dùng giới hạn tài nguyên (connection pool) |
| wait(P)            | Giảm giá trị, block nếu = 0                           | Proberen (thử)                             |
| signal(V)          | Tăng giá trị, đánh thức 1 thread đang chờ             | Verhogen (tăng)                            |

```text
// Counting semaphore cho connection pool (max 5 connections)
sem = create_semaphore(5)

function use_connection():
    wait(sem)          // giảm count, block nếu = 0
    conn = get_connection()
    do_work(conn)
    release_connection(conn)
    signal(sem)        // tăng count, đánh thức thread chờ
```

### 3.3 Condition Variables

| Concept         | Description                                                      | Vietnamese                  |
| --------------- | ---------------------------------------------------------------- | --------------------------- |
| Mục đích        | Cho phép thread chờ đến khi điều kiện cụ thể xảy ra              | Biến điều kiện              |
| wait(cv, mutex) | Giải phóng mutex + sleep, khi thức dậy tự re-acquire mutex       | Chờ + nhả khóa atomically   |
| signal(cv)      | Đánh thức 1 thread đang wait                                     | Báo hiệu                    |
| broadcast(cv)   | Đánh thức tất cả threads đang wait                               | Báo hiệu tất cả             |
| Spurious wakeup | Thread có thể thức dậy mà không ai signal — phải dùng while loop | Luôn kiểm tra lại điều kiện |

```text
mutex = create_mutex()
cv = create_condition_variable()
queue = []

function producer(item):
    lock(mutex)
    queue.append(item)
    signal(cv)         // đánh thức consumer
    unlock(mutex)

function consumer():
    lock(mutex)
    while queue.is_empty():     // WHILE, không phải IF (spurious wakeup)
        wait(cv, mutex)         // nhả mutex + sleep, thức dậy tự lock lại
    item = queue.pop()
    unlock(mutex)
    return item
```

### 3.4 Read-Write Locks

| Scenario         | Allowed                 | Vietnamese                       |
| ---------------- | ----------------------- | -------------------------------- |
| Multiple readers | Cho phép đồng thời      | Nhiều thread đọc cùng lúc OK     |
| Reader + Writer  | Không — writer phải chờ | Writer cần exclusive access      |
| Multiple writers | Không — chỉ 1 writer    | Chỉ 1 thread ghi tại 1 thời điểm |

```text
rwlock = create_rwlock()

function read_data():
    read_lock(rwlock)    // nhiều reader có thể vào cùng lúc
    data = shared_data
    read_unlock(rwlock)
    return data

function write_data(value):
    write_lock(rwlock)   // exclusive — block cả reader lẫn writer khác
    shared_data = value
    write_unlock(rwlock)
```

### 3.5 Spinlocks vs Blocking Locks

| Aspect            | Spinlock                              | Blocking Lock (Mutex)             |
| ----------------- | ------------------------------------- | --------------------------------- |
| Cơ chế chờ        | Busy-wait (vòng lặp liên tục check)   | Sleep — OS đánh thức khi sẵn sàng |
| CPU usage khi chờ | 100% core                             | 0% (thread sleeping)              |
| Tốt khi           | Critical section rất ngắn, multi-core | Critical section dài, ít core     |
| Latency           | Rất thấp nếu lock nhanh khả dụng      | Cao hơn do context switch         |
| Dùng trong        | Kernel code, lock-free algorithms     | User-space application code       |

```text
// Spinlock implementation
function spin_lock(lock):
    while not compare_and_swap(lock, UNLOCKED, LOCKED):
        // spin — busy wait
        cpu_pause()    // hint cho CPU giảm power khi spin

function spin_unlock(lock):
    store(lock, UNLOCKED)
```

### 3.6 Compare-and-Swap (CAS) & Atomic Operations

| Operation                | Semantics                                              | Vietnamese                              |
| ------------------------ | ------------------------------------------------------ | --------------------------------------- |
| CAS(addr, expected, new) | Nếu *addr == expected thì set *addr = new, return true | So sánh và hoán đổi atomically          |
| Atomic load/store        | Đọc/ghi đảm bảo không bị torn read/write               | Đọc/ghi nguyên tử                       |
| Fetch-and-add            | Cộng giá trị và trả về giá trị cũ, atomically          | Cộng nguyên tử                          |
| ABA problem              | Giá trị thay đổi A→B→A, CAS không phát hiện            | Cần version counter hoặc tagged pointer |

```text
// Lock-free counter using CAS
function atomic_increment(counter):
    loop:
        old = atomic_load(counter)
        new = old + 1
        if compare_and_swap(counter, old, new):
            return new
        // CAS failed — another thread changed it, retry
```

### 3.7 Barriers

| Concept  | Description                                                                       | Vietnamese                   |
| -------- | --------------------------------------------------------------------------------- | ---------------------------- |
| Barrier  | Điểm đồng bộ nơi tất cả thread phải đến trước khi bất kỳ thread nào được tiếp tục | Rào chắn đồng bộ             |
| Use case | Parallel computation chia thành phases — phase N+1 cần kết quả phase N            | Tính toán song song theo pha |

```text
barrier = create_barrier(num_threads)

function worker(id, data):
    // Phase 1: compute local result
    local_result = compute(data[id])

    barrier.wait()    // tất cả thread chờ nhau ở đây

    // Phase 2: merge results (mọi thread đã xong phase 1)
    merge(local_result, global_result)
```

### Interview Q&A

### 🟢 Q: What is a mutex and why do we need it? `[Junior]`

**A:** Mutex (mutual exclusion) là cơ chế khóa đảm bảo chỉ 1 thread được truy cập critical section (vùng code thao tác shared data) tại một thời điểm. Không có mutex, 2 thread có thể đọc-sửa-ghi cùng biến dẫn đến kết quả sai (race condition).

### 🟡 Q: When would you use a semaphore instead of a mutex? `[Mid]`

**A:** Mutex chỉ cho 1 thread vào. Semaphore (counting) cho phép N thread đồng thời — dùng khi muốn giới hạn số lượng truy cập đồng thời (e.g., connection pool 10 connections, rate limiting). Ngoài ra semaphore không có owner semantics nên thread A có thể signal thay thread B — hữu ích cho producer-consumer signaling.

### 🟡 Q: Why must you use a while loop (not if) with condition variables? `[Mid]`

**A:** Vì spurious wakeup — thread có thể bị đánh thức mà không ai signal (do OS implementation). Ngoài ra, giữa lúc signal và lúc thread được schedule chạy, điều kiện có thể đã thay đổi (một thread khác đã xử lý xong). Vì vậy luôn dùng `while(!condition)` thay vì `if(!condition)` trước `wait()`.

### 🔴 Q: Explain the ABA problem with CAS and how to solve it. `[Senior]`

**A:** CAS check giá trị hiện tại có bằng expected không. Nếu thread A đọc giá trị X=A, bị preempted, thread B đổi X: A→B→A, khi thread A chạy lại, CAS thấy X vẫn = A nên thành công — nhưng state đã thay đổi (B ở giữa có thể đã free memory chẳng hạn). Giải pháp: dùng version counter (tagged pointer) — CAS kiểm tra cả giá trị lẫn version number. Trong thực tế nhiều ngôn ngữ cung cấp AtomicStampedReference (Java) hoặc double-width CAS.

---

## 4. Classic Concurrency Problems — Các bài toán kinh điển

### Definition

- Các bài toán kinh điển minh họa các thách thức cốt lõi của concurrent programming: synchronization, deadlock, starvation, fairness.

### 4.1 Producer-Consumer (Bounded Buffer)

| Aspect    | Description                                                             | Vietnamese                     |
| --------- | ----------------------------------------------------------------------- | ------------------------------ |
| Bài toán  | Producer tạo item bỏ vào buffer có giới hạn; Consumer lấy item ra xử lý | Nhà sản xuất — Người tiêu dùng |
| Ràng buộc | Producer phải chờ nếu buffer đầy; Consumer phải chờ nếu buffer rỗng     | Bounded buffer = có giới hạn   |
| Nguy hiểm | Race condition khi đọc/ghi buffer; deadlock nếu signal sai              | Cần synchronization đúng       |

```text
buffer = array of size N
count = 0
mutex = create_mutex()
not_full = create_condition()
not_empty = create_condition()

function producer(item):
    lock(mutex)
    while count == N:
        wait(not_full, mutex)       // buffer đầy, chờ consumer lấy bớt
    buffer[count] = item
    count = count + 1
    signal(not_empty)                // báo consumer có item mới
    unlock(mutex)

function consumer():
    lock(mutex)
    while count == 0:
        wait(not_empty, mutex)      // buffer rỗng, chờ producer thêm
    item = buffer[count - 1]
    count = count - 1
    signal(not_full)                 // báo producer có chỗ trống
    unlock(mutex)
    return item
```

**Deadlock analysis**: Deadlock không xảy ra vì signal luôn được gọi sau khi thay đổi count, và while loop đảm bảo kiểm tra lại điều kiện sau mỗi lần wakeup.

### 4.2 Readers-Writers

| Variant        | Description                                    | Vietnamese            |
| -------------- | ---------------------------------------------- | --------------------- |
| First variant  | Readers priority — writer có thể bị starvation | Ưu tiên reader        |
| Second variant | Writers priority — reader có thể bị starvation | Ưu tiên writer        |
| Third variant  | Fair — không ai bị starvation                  | Công bằng, dùng queue |

```text
// First Readers-Writers (readers priority)
reader_count = 0
rw_mutex = create_mutex()      // bảo vệ shared data
count_mutex = create_mutex()   // bảo vệ reader_count

function reader():
    lock(count_mutex)
    reader_count = reader_count + 1
    if reader_count == 1:
        lock(rw_mutex)          // reader đầu tiên block writer
    unlock(count_mutex)

    // --- read shared data ---

    lock(count_mutex)
    reader_count = reader_count - 1
    if reader_count == 0:
        unlock(rw_mutex)        // reader cuối cùng cho writer vào
    unlock(count_mutex)

function writer():
    lock(rw_mutex)              // exclusive access
    // --- write shared data ---
    unlock(rw_mutex)
```

**Starvation analysis**: Nếu reader liên tục đến, reader_count không bao giờ về 0, writer bị starvation vĩnh viễn. Writer-priority variant giải quyết bằng cách block reader mới khi có writer chờ.

### 4.3 Dining Philosophers

| Aspect     | Description                                                                  | Vietnamese      |
| ---------- | ---------------------------------------------------------------------------- | --------------- |
| Bài toán   | 5 triết gia ngồi quanh bàn tròn, giữa mỗi 2 người là 1 đũa. Cần 2 đũa để ăn. | Dijkstra, 1965  |
| Deadlock   | Tất cả cùng cầm đũa trái → ai cũng chờ đũa phải → deadlock                   | Circular wait   |
| Starvation | Triết gia liên tục bị 2 hàng xóm ăn trước                                    | Không công bằng |

```text
// Solution 1: Asymmetric — philosopher 4 cầm đũa phải trước
forks = array of 5 mutexes

function philosopher(id):
    loop:
        think()
        if id == 4:
            lock(forks[(id + 1) % 5])    // cầm đũa phải trước
            lock(forks[id])               // rồi đũa trái
        else:
            lock(forks[id])               // cầm đũa trái trước
            lock(forks[(id + 1) % 5])     // rồi đũa phải
        eat()
        unlock(forks[id])
        unlock(forks[(id + 1) % 5])

// Solution 2: Resource hierarchy — luôn cầm đũa số nhỏ trước
function philosopher_v2(id):
    loop:
        think()
        first = min(id, (id + 1) % 5)
        second = max(id, (id + 1) % 5)
        lock(forks[first])
        lock(forks[second])
        eat()
        unlock(forks[second])
        unlock(forks[first])
```

**Deadlock analysis**: Solution 2 phá vỡ circular wait (Coffman condition #4) bằng cách áp đặt thứ tự lock — không bao giờ hình thành vòng chờ.

### 4.4 Sleeping Barber

| Aspect     | Description                                                                                                                               | Vietnamese          |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| Bài toán   | 1 barber, N ghế chờ. Barber ngủ khi không có khách. Khách đến: nếu có ghế trống thì ngồi chờ và đánh thức barber, nếu hết ghế thì rời đi. | Dijkstra            |
| Thách thức | Race condition giữa barber check ghế trống và khách ngồi vào ghế                                                                          | Cần synchronization |

```text
waiting = 0
max_chairs = N
mutex = create_mutex()
customer_ready = create_semaphore(0)
barber_ready = create_semaphore(0)

function barber():
    loop:
        wait(customer_ready)     // ngủ cho đến khi có khách
        lock(mutex)
        waiting = waiting - 1
        signal(barber_ready)     // sẵn sàng cắt tóc
        unlock(mutex)
        cut_hair()

function customer():
    lock(mutex)
    if waiting < max_chairs:
        waiting = waiting + 1
        signal(customer_ready)   // đánh thức barber
        unlock(mutex)
        wait(barber_ready)       // chờ barber sẵn sàng
        get_haircut()
    else:
        unlock(mutex)            // hết ghế, rời đi
```

### Interview Q&A

### 🟢 Q: Describe the Producer-Consumer problem and a basic solution. `[Junior]`

**A:** Producer tạo data bỏ vào buffer có giới hạn, Consumer lấy ra xử lý. Cần đảm bảo: (1) producer chờ khi buffer đầy, (2) consumer chờ khi buffer rỗng, (3) không có race condition khi đọc/ghi buffer. Giải pháp cơ bản: dùng mutex bảo vệ buffer + 2 condition variables (not_full, not_empty) để signal giữa producer và consumer.

### 🟡 Q: How does the Dining Philosophers problem illustrate deadlock? `[Mid]`

**A:** 5 triết gia cùng cầm đũa trái → tất cả đang giữ 1 tài nguyên và chờ tài nguyên kế tiếp → hình thành vòng chờ (circular wait). Đây là deadlock kinh điển: đủ 4 điều kiện Coffman. Giải pháp: phá vỡ 1 điều kiện — ví dụ áp đặt thứ tự cầm đũa (resource hierarchy) phá circular wait.

### 🔴 Q: In Readers-Writers, how do you prevent writer starvation while maintaining read concurrency? `[Senior]`

**A:** Dùng fair variant: khi writer đang chờ, reader mới phải xếp hàng sau writer (không được "nhảy cóc" vào cùng batch reader hiện tại). Implementation: dùng thêm một turnstile semaphore — writer lock turnstile khi bắt đầu chờ, reader mới phải qua turnstile trước khi tăng reader_count. Kết quả: reader hiện tại hoàn thành → writer được vào → reader mới xếp hàng sau. Đảm bảo bounded waiting cho cả hai bên.

---

## 5. Deadlock — Bế tắc

### Definition

- **Deadlock**: trạng thái mà một nhóm thread/process chờ nhau vĩnh viễn — không ai có thể tiến lên vì đang giữ tài nguyên mà thread khác cần và đang chờ tài nguyên mà thread khác giữ.

### 5.1 Four Necessary Conditions (Coffman Conditions)

| Condition           | Description                                                      | Vietnamese        |
| ------------------- | ---------------------------------------------------------------- | ----------------- |
| 1. Mutual Exclusion | Tài nguyên không thể chia sẻ — chỉ 1 thread dùng tại 1 thời điểm | Loại trừ tương hỗ |
| 2. Hold and Wait    | Thread giữ tài nguyên đã có và chờ thêm tài nguyên mới           | Giữ và chờ        |
| 3. No Preemption    | Tài nguyên không thể bị giật lại từ thread đang giữ              | Không tước quyền  |
| 4. Circular Wait    | Tồn tại chuỗi vòng: T1 chờ T2, T2 chờ T3, ..., Tn chờ T1         | Chờ vòng          |

**Quan trọng**: Deadlock xảy ra khi và chỉ khi CẢ 4 điều kiện đồng thời thỏa mãn. Phá vỡ bất kỳ 1 điều kiện là đủ để ngăn deadlock.

### 5.2 Prevention vs Avoidance vs Detection

| Strategy                 | Approach                                                      | Trade-off                                          | Vietnamese             |
| ------------------------ | ------------------------------------------------------------- | -------------------------------------------------- | ---------------------- |
| **Prevention**           | Thiết kế hệ thống để 1 trong 4 điều kiện không bao giờ xảy ra | Có thể giảm concurrency hoặc hiệu suất             | Ngăn chặn — static     |
| **Avoidance**            | Runtime check — chỉ cấp tài nguyên nếu hệ thống vẫn safe      | Cần biết trước max resource cần — overhead runtime | Tránh né — dynamic     |
| **Detection + Recovery** | Cho phép deadlock xảy ra, phát hiện rồi xử lý                 | Overhead kiểm tra định kỳ, recovery phức tạp       | Phát hiện và khôi phục |

### Prevention Methods (phá từng điều kiện)

| Condition to break | Method                                                                 | Example                               |
| ------------------ | ---------------------------------------------------------------------- | ------------------------------------- |
| Mutual Exclusion   | Dùng lock-free algorithms hoặc immutable data                          | CAS-based data structures             |
| Hold and Wait      | Yêu cầu tất cả tài nguyên cùng lúc (all-or-nothing)                    | Two-phase locking acquire all upfront |
| No Preemption      | Cho phép tước quyền — nếu không lấy được lock, nhả hết và retry        | tryLock with timeout                  |
| Circular Wait      | Áp đặt thứ tự toàn cục cho tài nguyên — luôn lock theo thứ tự tăng dần | Resource hierarchy                    |

### 5.3 Resource Allocation Graph

- Đồ thị 2 loại node: process (hình tròn) và resource (hình vuông).
- Cạnh request: P → R (process yêu cầu resource).
- Cạnh assignment: R → P (resource được gán cho process).
- **Nếu đồ thị có cycle VÀ mỗi resource chỉ có 1 instance → deadlock.**
- Nếu resource có nhiều instance, cycle là điều kiện cần nhưng chưa đủ.

### 5.4 Banker's Algorithm (Concept)

- Ý tưởng: trước khi cấp tài nguyên, kiểm tra xem hệ thống có còn ở trạng thái safe không.
- **Safe state**: tồn tại ít nhất 1 thứ tự thực thi mà tất cả process đều hoàn thành được.
- Algorithm: thử cấp → kiểm tra safe → nếu safe thì cho, không thì từ chối.
- Nhược điểm thực tế: cần biết trước max resource mỗi process cần — không thực tế cho hầu hết ứng dụng thực.

```text
function is_safe(available, max_need, allocation, n_processes, n_resources):
    work = copy(available)
    finish = array of false, size n_processes

    loop:
        found = false
        for i = 0 to n_processes - 1:
            if not finish[i] and (max_need[i] - allocation[i]) <= work:
                work = work + allocation[i]
                finish[i] = true
                found = true
        if not found:
            break

    return all(finish)    // true = safe state
```

### 5.5 Livelock and Starvation

| Concept          | Description                                                                                            | Vietnamese                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| **Livelock**     | Các thread liên tục thay đổi state phản ứng lẫn nhau nhưng không ai tiến lên                           | Giống deadlock nhưng thread vẫn "chạy" — chạy vô ích |
| **Starvation**   | Thread không bao giờ được cấp tài nguyên vì thread khác liên tục ưu tiên                               | Đói tài nguyên                                       |
| Ví dụ livelock   | 2 người đi ngược chiều trong hành lang, cả hai cùng tránh sang trái, rồi cùng tránh sang phải, lặp mãi | Giải pháp: random backoff                            |
| Ví dụ starvation | Reader-priority Readers-Writers: writer không bao giờ được chạy nếu reader liên tục đến                | Giải pháp: fair scheduling, aging                    |

### Interview Q&A

### 🟢 Q: What is a deadlock and what are its four conditions? `[Junior]`

**A:** Deadlock là khi các thread chờ nhau vĩnh viễn. Bốn điều kiện Coffman: (1) Mutual Exclusion — tài nguyên exclusive, (2) Hold and Wait — giữ tài nguyên rồi chờ thêm, (3) No Preemption — không bị giật lại, (4) Circular Wait — chờ vòng. Cả 4 phải đồng thời xảy ra.

### 🟡 Q: How would you prevent deadlock in practice? `[Mid]`

**A:** Cách phổ biến nhất: phá circular wait bằng lock ordering — quy định thứ tự toàn cục cho tất cả lock, luôn acquire theo thứ tự tăng dần. Cách khác: dùng tryLock với timeout — nếu không lấy được lock trong thời gian giới hạn, nhả hết lock đang giữ và retry (phá No Preemption). Trong database: dùng deadlock detection + rollback victim transaction.

### 🔴 Q: What is the difference between deadlock, livelock, and starvation? `[Senior]`

**A:** Deadlock: tất cả thread bị block — không ai chạy. Livelock: thread vẫn chạy nhưng liên tục phản ứng lẫn nhau mà không tiến lên (spinning uselessly). Starvation: thread có thể chạy nhưng không bao giờ được schedule vì ưu tiên thấp. Deadlock và livelock ảnh hưởng nhóm thread, starvation ảnh hưởng cá nhân. Giải pháp starvation: aging (tăng priority theo thời gian chờ), fair scheduling. Giải pháp livelock: random backoff, jitter.

---

## 6. Race Conditions & Memory Models — Điều kiện tranh chấp

### Definition

- **Race condition**: kết quả chương trình phụ thuộc vào thứ tự thực thi (scheduling) của các thread — chương trình cho kết quả đúng hoặc sai tùy thuộc vào timing.
- **Data race**: hai thread cùng truy cập một vùng nhớ, ít nhất một thread ghi, và không có synchronization. Data race là undefined behavior trong hầu hết ngôn ngữ.

### Data Race vs Race Condition

| Aspect                                       | Data Race                                             | Race Condition                                                                     |
| -------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Định nghĩa                                   | Concurrent access không synchronized, ít nhất 1 write | Logic bug do timing-dependent behavior                                             |
| Ví dụ                                        | 2 thread cùng `counter++` không có lock               | Check-then-act: `if (file not exists) create(file)`                                |
| Undefined behavior?                          | Có (C/C++, Go)                                        | Không nhất thiết — chương trình "chạy" nhưng sai logic                             |
| Fix                                          | Dùng mutex hoặc atomic                                | Dùng atomic operation hoặc transaction cho cả sequence                             |
| Có thể có race condition mà không data race? | Có — dùng mutex đúng nhưng logic vẫn sai              | Ví dụ: 2 ATM check balance rồi withdraw — mỗi bước synchronized nhưng sequence sai |

```text
// Data race example
shared counter = 0
// Thread A:  temp = counter; temp++; counter = temp;   (counter = 0 → 1)
// Thread B:  temp = counter; temp++; counter = temp;   (counter = 0 → 1)
// Expected: 2, Got: 1  (lost update)

// Race condition WITHOUT data race
// Thread A:                    Thread B:
// lock(m)                      lock(m)
// balance = read_balance()     balance = read_balance()  // both see 100
// unlock(m)                    unlock(m)
// lock(m)                      lock(m)
// write_balance(balance - 80)  write_balance(balance - 70) // both ok individually
// unlock(m)                    unlock(m)
// Result: balance = 30 instead of -50 (overdraft not detected)
// Each access is synchronized, but the check-then-act sequence is not atomic
```

### 6.1 Happens-Before Relationship

- Nếu event A happens-before event B (ký hiệu A → B), thì hiệu ứng của A đảm bảo được thấy bởi B.
- Quy tắc cơ bản:
  - Trong cùng thread: lệnh trước → lệnh sau (program order).
  - `unlock(m)` → `lock(m)` tiếp theo trên cùng mutex.
  - Thread creation → first instruction of new thread.
  - Last instruction of thread → join() return.
  - `signal(cv)` → `wait(cv)` return.
- Nếu hai event không có quan hệ happens-before → chúng concurrent → cần synchronization.

### 6.2 Memory Ordering

| Model                  | Guarantee                                                     | Cost                             | Vietnamese                                      |
| ---------------------- | ------------------------------------------------------------- | -------------------------------- | ----------------------------------------------- |
| Sequential Consistency | Mọi thread thấy cùng thứ tự tổng thể cho tất cả operations    | Cao nhất — barrier mỗi operation | Nhất quán tuần tự                               |
| Acquire-Release        | Thread acquire thấy mọi thứ released bởi thread khác trước đó | Trung bình                       | Đảm bảo visibility khi lock/unlock              |
| Relaxed                | Chỉ đảm bảo atomicity, không đảm bảo ordering                 | Thấp nhất                        | Chỉ dùng cho counter, không cho synchronization |

### 6.3 Memory Barriers / Fences

- CPU và compiler có thể reorder instructions để tối ưu performance.
- Memory barrier (fence) là chỉ thị ngăn reorder qua barrier.
- **Store barrier**: đảm bảo mọi store trước barrier hoàn thành trước bất kỳ store nào sau.
- **Load barrier**: đảm bảo mọi load trước barrier hoàn thành trước bất kỳ load nào sau.
- **Full barrier**: kết hợp cả store và load barrier.
- Trong practice, mutex lock/unlock đã bao gồm barrier — developer hiếm khi cần dùng trực tiếp.

### 6.4 Visibility vs Atomicity

| Concept                 | Description                                                              | Vietnamese                                         |
| ----------------------- | ------------------------------------------------------------------------ | -------------------------------------------------- |
| **Visibility**          | Khi thread A ghi giá trị, thread B có thấy giá trị mới không?            | CPU cache có thể giữ bản cũ                        |
| **Atomicity**           | Operation hoàn thành trọn vẹn hoặc không — không có trạng thái nửa chừng | Ví dụ: 64-bit write trên 32-bit CPU có thể bị torn |
| Mutex giải quyết cả hai | Lock acquire = load barrier (visibility) + mutual exclusion (atomicity)  | Đây là lý do mutex "nặng" nhưng an toàn nhất       |

### Interview Q&A

### 🟢 Q: What is a race condition? Give a simple example. `[Junior]`

**A:** Race condition xảy ra khi kết quả phụ thuộc vào thứ tự thực thi không thể đoán trước. Ví dụ đơn giản: 2 thread cùng `counter++`. Cả hai đọc counter = 5, cộng lên 6, ghi lại 6. Kết quả: counter = 6 thay vì 7. Mất 1 lần cập nhật (lost update).

### 🟡 Q: What is the difference between a data race and a race condition? `[Mid]`

**A:** Data race: 2 thread truy cập cùng memory location, ít nhất 1 ghi, không synchronized — undefined behavior. Race condition: bug logic do timing — có thể xảy ra ngay cả khi mỗi access đã synchronized riêng lẻ, nếu cả sequence không atomic. Ví dụ: check-then-act pattern — check balance (synchronized) rồi withdraw (synchronized) nhưng giữa 2 bước thread khác chen vào.

### 🔴 Q: Explain memory ordering models and when you would use relaxed ordering. `[Senior]`

**A:** Sequential consistency đảm bảo mọi thread thấy cùng thứ tự nhưng chậm. Acquire-release đảm bảo visibility khi dùng lock/unlock — đủ cho hầu hết synchronization patterns. Relaxed chỉ đảm bảo atomicity, không ordering — dùng cho counter thuần túy (statistics, metrics) nơi thứ tự không quan trọng. Ví dụ: counting page views — không cần biết view nào trước, chỉ cần tổng cuối cùng đúng. Relaxed nhanh hơn đáng kể trên ARM/weak-memory architectures vì không cần memory barrier.

---

## 7. Concurrent Data Structures — Cấu trúc dữ liệu đồng thời

### Definition

- Concurrent data structures cho phép nhiều thread truy cập đồng thời mà vẫn đảm bảo correctness. Có nhiều mức độ từ coarse-grained locking đến lock-free và wait-free.

### Levels of Thread Safety

| Level                  | Description                                                  | Vietnamese                              |
| ---------------------- | ------------------------------------------------------------ | --------------------------------------- |
| Coarse-grained locking | 1 lock toàn bộ structure — đơn giản nhưng serial hóa mọi thứ | Khóa thô — bottleneck                   |
| Fine-grained locking   | Lock riêng cho từng phần (per-bucket, per-node)              | Khóa mịn — phức tạp hơn, concurrent hơn |
| Lock-free              | Ít nhất 1 thread luôn tiến lên (dùng CAS)                    | Không khóa — tránh deadlock             |
| Wait-free              | Mọi thread hoàn thành trong bounded steps                    | Không chờ — strongest guarantee         |

### 7.1 Thread-safe Queue

```text
// Lock-based bounded queue
function enqueue(queue, item):
    lock(queue.mutex)
    while queue.size == queue.capacity:
        wait(queue.not_full, queue.mutex)
    queue.buffer[queue.tail] = item
    queue.tail = (queue.tail + 1) % queue.capacity
    queue.size = queue.size + 1
    signal(queue.not_empty)
    unlock(queue.mutex)

function dequeue(queue):
    lock(queue.mutex)
    while queue.size == 0:
        wait(queue.not_empty, queue.mutex)
    item = queue.buffer[queue.head]
    queue.head = (queue.head + 1) % queue.capacity
    queue.size = queue.size - 1
    signal(queue.not_full)
    unlock(queue.mutex)
    return item
```

### 7.2 Lock-free Stack (Treiber Stack)

```text
// Lock-free stack using CAS
function push(stack, value):
    node = create_node(value)
    loop:
        old_top = atomic_load(stack.top)
        node.next = old_top
        if compare_and_swap(stack.top, old_top, node):
            return    // success

function pop(stack):
    loop:
        old_top = atomic_load(stack.top)
        if old_top == null:
            return EMPTY
        new_top = old_top.next
        if compare_and_swap(stack.top, old_top, new_top):
            return old_top.value    // success
        // CAS failed — retry (another thread modified top)
```

### 7.3 CAS-based Linked List (Lock-free Insert)

```text
// Lock-free sorted insert
function insert(head, value):
    new_node = create_node(value)
    loop:
        prev = head
        curr = atomic_load(prev.next)
        while curr != null and curr.value < value:
            prev = curr
            curr = atomic_load(curr.next)
        new_node.next = curr
        if compare_and_swap(prev.next, curr, new_node):
            return    // success
        // retry — list changed under us
```

**Lưu ý**: Lock-free delete phức tạp hơn nhiều — cần logical deletion (mark node) trước physical deletion để tránh ABA problem. Harris's linked list là giải pháp kinh điển dùng marked pointers.

### 7.4 Concurrent Hash Map Approaches

| Approach            | Description                                        | Vietnamese                              |
| ------------------- | -------------------------------------------------- | --------------------------------------- |
| Global lock         | 1 mutex cho toàn bộ map — đơn giản nhất            | Bottleneck nghiêm trọng                 |
| Striped locking     | N lock cho N nhóm bucket (lock[hash % N])          | Java ConcurrentHashMap v1               |
| Lock-free           | CAS-based per-bucket linked list                   | Phức tạp, cần careful memory management |
| Copy-on-write       | Clone toàn bộ map khi write, readers thấy snapshot | Tốt khi read >> write                   |
| Split ordered lists | Lock-free hash map dựa trên reversed-bit ordering  | Michael, 2002 — lý thuyết               |

```text
// Striped locking hash map
num_stripes = 16
locks = array of num_stripes mutexes
buckets = array of num_buckets linked_lists

function get(key):
    bucket_idx = hash(key) % num_buckets
    stripe_idx = bucket_idx % num_stripes
    lock(locks[stripe_idx])
    result = buckets[bucket_idx].search(key)
    unlock(locks[stripe_idx])
    return result

function put(key, value):
    bucket_idx = hash(key) % num_buckets
    stripe_idx = bucket_idx % num_stripes
    lock(locks[stripe_idx])
    buckets[bucket_idx].insert_or_update(key, value)
    unlock(locks[stripe_idx])
```

### Interview Q&A

### 🟢 Q: What does "thread-safe" mean for a data structure? `[Junior]`

**A:** Thread-safe nghĩa là data structure có thể được truy cập bởi nhiều thread đồng thời mà vẫn đảm bảo kết quả đúng — không có data corruption, lost updates, hay inconsistent reads. Thường đạt được bằng mutex hoặc atomic operations.

### 🟡 Q: What is a lock-free data structure and why would you use one? `[Mid]`

**A:** Lock-free data structure dùng CAS thay vì mutex — đảm bảo ít nhất 1 thread luôn tiến lên (system-wide progress), không thể deadlock. Dùng khi: (1) contention cao khiến mutex trở thành bottleneck, (2) cần tránh priority inversion (thread ưu tiên cao bị block bởi thread ưu tiên thấp đang giữ lock), (3) real-time systems cần bounded latency. Nhược điểm: rất khó implement đúng, ABA problem, memory reclamation phức tạp.

### 🔴 Q: Explain the difference between lock-free and wait-free. Why is wait-free rare in practice? `[Senior]`

**A:** Lock-free: ít nhất 1 thread hoàn thành trong finite steps (system progress). Wait-free: MỌI thread hoàn thành trong bounded steps (per-thread progress, no starvation). Wait-free mạnh hơn nhưng hiếm vì: (1) implementation phức tạp cực kỳ, (2) overhead cao hơn lock-free đáng kể, (3) trong thực tế lock-free + backoff đủ tốt cho hầu hết use case. Wait-free chỉ cần thiết cho hard real-time systems nơi worst-case latency quan trọng hơn average throughput. Universal construction (Herlihy) chứng minh mọi sequential object CÓ THỂ làm wait-free nhưng overhead quá lớn.

---

## 8. Parallel Computing Models — Mô hình tính toán song song

### Definition

- Parallel computing models mô tả cách tổ chức và phối hợp computation trên nhiều đơn vị xử lý. Mỗi model phù hợp với loại bài toán khác nhau.

### 8.1 Fork-Join

| Aspect        | Description                                                        | Vietnamese              |
| ------------- | ------------------------------------------------------------------ | ----------------------- |
| Mô hình       | Chia task thành subtasks (fork), chạy parallel, hợp kết quả (join) | Chia để trị song song   |
| Cấu trúc      | Đệ quy — subtask có thể fork tiếp                                  | Tree-shaped parallelism |
| Work stealing | Idle worker lấy task từ queue của worker bận                       | Load balancing tự động  |
| Ví dụ         | Merge sort parallel, tree traversal, divide-and-conquer            | Java ForkJoinPool       |

```text
function parallel_mergesort(arr, lo, hi):
    if hi - lo <= THRESHOLD:
        sequential_sort(arr, lo, hi)
        return
    mid = (lo + hi) / 2
    left_task = fork(parallel_mergesort, arr, lo, mid)
    right_task = fork(parallel_mergesort, arr, mid, hi)
    join(left_task)
    join(right_task)
    merge(arr, lo, mid, hi)
```

### 8.2 MapReduce

| Phase   | Description                                           | Vietnamese                       |
| ------- | ----------------------------------------------------- | -------------------------------- |
| Map     | Mỗi worker xử lý 1 phần dữ liệu, emit key-value pairs | Ánh xạ — embarrassingly parallel |
| Shuffle | Framework nhóm các values theo key                    | Phân phối lại theo key           |
| Reduce  | Mỗi reducer tổng hợp values cho 1 key                 | Tổng hợp kết quả                 |

```text
// Word count example
function map(document):
    for word in document.split():
        emit(word, 1)

function reduce(word, counts):
    emit(word, sum(counts))

// Framework orchestration:
// 1. Split input into chunks
// 2. Run map on each chunk (parallel)
// 3. Shuffle: group by key
// 4. Run reduce on each key group (parallel)
// 5. Collect final output
```

### 8.3 Actor Model

| Concept         | Description                                                                    | Vietnamese                     |
| --------------- | ------------------------------------------------------------------------------ | ------------------------------ |
| Actor           | Entity có state riêng, nhận message, xử lý tuần tự                             | Mỗi actor là 1 "micro-process" |
| Message passing | Actors giao tiếp bằng gửi message (async, no shared memory)                    | Không chia sẻ bộ nhớ           |
| Mailbox         | Queue chứa messages chờ xử lý                                                  | Mỗi actor có inbox riêng       |
| Supervision     | Actor parent giám sát child — child crash thì parent quyết định restart/stop   | Erlang/Akka "let it crash"     |
| No lock needed  | Vì mỗi actor xử lý 1 message tại 1 thời điểm, state không bị concurrent access | Concurrent by isolation        |

```text
// Actor definition
actor Counter:
    state = 0

    on receive(message):
        match message:
            Increment(n) → state = state + n
            GetCount(reply_to) → send(reply_to, state)

// Usage
counter = spawn(Counter)
send(counter, Increment(5))
send(counter, Increment(3))
send(counter, GetCount(self))
// receive → 8
```

### 8.4 CSP (Communicating Sequential Processes)

| Concept    | Description                                                  | Vietnamese                     |
| ---------- | ------------------------------------------------------------ | ------------------------------ |
| Process    | Sequential code chạy độc lập                                 | Không chia sẻ memory           |
| Channel    | Đường ống typed để giao tiếp giữa processes                  | Synchronous hoặc buffered      |
| Select     | Chờ trên nhiều channels cùng lúc                             | Multiplexing                   |
| Khác Actor | Channel là first-class entity (không gắn với process cụ thể) | Go goroutines + channels = CSP |

```text
// CSP-style pipeline
function main():
    ch1 = create_channel()
    ch2 = create_channel()

    spawn(generator, ch1)
    spawn(squarer, ch1, ch2)
    spawn(printer, ch2)

function generator(out):
    for i = 0 to infinity:
        send(out, i)

function squarer(in, out):
    loop:
        x = receive(in)
        send(out, x * x)

function printer(in):
    loop:
        x = receive(in)
        print(x)
```

### 8.5 SIMD vs MIMD

| Architecture | Description                                                                                   | Vietnamese                          |
| ------------ | --------------------------------------------------------------------------------------------- | ----------------------------------- |
| SIMD         | Single Instruction, Multiple Data — 1 lệnh xử lý nhiều data point cùng lúc                    | GPU, vector instructions (SSE, AVX) |
| MIMD         | Multiple Instruction, Multiple Data — nhiều processor chạy code khác nhau trên data khác nhau | Multi-core CPU, cluster             |
| SISD         | Single Instruction, Single Data — sequential                                                  | Von Neumann truyền thống            |
| SPMD         | Single Program, Multiple Data — cùng program nhưng mỗi processor xử lý data riêng             | MPI programs, MapReduce workers     |

### 8.6 Amdahl's Law & Gustafson's Law

| Law                 | Formula                                                                             | Vietnamese                           |
| ------------------- | ----------------------------------------------------------------------------------- | ------------------------------------ |
| **Amdahl's Law**    | Speedup = 1 / (S + P/N) where S = serial fraction, P = parallel fraction, N = cores | Giới hạn speedup bởi phần sequential |
| **Gustafson's Law** | Speedup = S + P × N (giả sử problem size tăng theo N)                               | Scaled speedup — lạc quan hơn        |

```text
// Amdahl's Law example:
// Program: 20% sequential (S=0.2), 80% parallelizable (P=0.8)
// With 4 cores:  Speedup = 1 / (0.2 + 0.8/4) = 1 / 0.4 = 2.5x
// With 8 cores:  Speedup = 1 / (0.2 + 0.8/8) = 1 / 0.3 = 3.33x
// With ∞ cores:  Speedup = 1 / 0.2 = 5x (maximum!)
// → 20% serial code limits max speedup to 5x regardless of cores

// Gustafson's Law: nếu tăng problem size cùng cores, phần serial giữ nguyên:
// With 4 cores:  Speedup = 0.2 + 0.8 × 4 = 3.4x
// With 8 cores:  Speedup = 0.2 + 0.8 × 8 = 6.6x
// → Lạc quan hơn vì giả sử ta tăng workload theo tài nguyên
```

### Interview Q&A

### 🟢 Q: What is Amdahl's Law and what does it tell us? `[Junior]`

**A:** Amdahl's Law cho biết speedup tối đa khi song song hóa bị giới hạn bởi phần sequential. Nếu 10% code là sequential, dù có vô hạn core cũng chỉ nhanh hơn tối đa 10x. Công thức: Speedup = 1 / (S + P/N). Bài học: phải giảm phần serial trước khi thêm core.

### 🟡 Q: Compare the Actor model with CSP. Which languages use each? `[Mid]`

**A:** Cả hai đều dùng message passing thay vì shared memory. Khác biệt chính: Actor gửi message trực tiếp đến actor khác (point-to-point, gắn với identity), CSP giao tiếp qua channel (anonymous, decoupled). Actor: Erlang, Akka (Scala/Java), Elixir. CSP: Go (goroutines + channels), Clojure core.async. Actor model phù hợp distributed systems (có identity để route), CSP phù hợp pipeline/streaming patterns.

### 🔴 Q: When would Gustafson's Law be more applicable than Amdahl's Law? `[Senior]`

**A:** Amdahl giả sử problem size cố định — thêm core thì phần parallel chia nhỏ hơn nhưng phần serial giữ nguyên → diminishing returns. Gustafson giả sử ta tăng problem size khi có thêm core — phần serial giữ nguyên nhưng phần parallel tăng tuyến tính. Gustafson đúng hơn cho: big data processing (thêm node → xử lý thêm data), scientific simulation (mesh finer), ML training (larger batch/model). Amdahl đúng hơn cho: interactive applications với latency constraint cố định.

---

## 9. Asynchronous Programming Models — Mô hình bất đồng bộ

### Definition

- Asynchronous programming cho phép chương trình tiếp tục chạy trong khi chờ I/O hoàn thành, thay vì block thread. Đây là dạng concurrency phổ biến cho I/O-bound workloads.

### 9.1 Event Loop (Single-threaded Concurrency)

| Concept          | Description                                                         | Vietnamese                            |
| ---------------- | ------------------------------------------------------------------- | ------------------------------------- |
| Event loop       | Vòng lặp liên tục: poll events → dispatch handlers → poll tiếp      | 1 thread xử lý hàng nghìn connections |
| Non-blocking I/O | I/O call return ngay, kết quả được thông báo sau qua callback/event | Không chờ I/O                         |
| Event queue      | Hàng đợi chứa events sẵn sàng xử lý                                 | FIFO processing                       |
| Single-threaded  | Chỉ 1 thread chạy code — không cần lock cho application state       | Nhưng CPU-bound task sẽ block loop    |

```text
function event_loop():
    while running:
        events = poll_for_events(timeout)    // OS epoll/kqueue/IOCP
        for event in events:
            handler = lookup_handler(event)
            handler(event.data)              // phải return nhanh!
        process_timers()
        process_microtasks()
```

**Ưu điểm**: rất ít overhead (không context switch giữa threads), memory hiệu quả (1 thread thay vì hàng nghìn), đơn giản (không cần mutex cho app state).

**Nhược điểm**: CPU-bound computation block toàn bộ event loop, callback hell (nếu không có async/await), khó debug stack traces.

### 9.2 Callback → Promise → Async/Await Evolution

| Pattern        | Description                                                   | Vietnamese                                          |
| -------------- | ------------------------------------------------------------- | --------------------------------------------------- |
| Callback       | Truyền function sẽ được gọi khi operation hoàn thành          | Đơn giản nhưng callback hell khi lồng nhiều         |
| Promise/Future | Object đại diện cho giá trị sẽ có trong tương lai — chainable | Giải quyết callback hell bằng .then()               |
| Async/Await    | Syntax giống synchronous code nhưng thực chất là non-blocking | Dễ đọc nhất, compiler transform thành state machine |

```text
// Callback style (callback hell)
read_file("a.txt", function(err, data_a):
    if err: handle_error(err)
    read_file("b.txt", function(err, data_b):
        if err: handle_error(err)
        write_file("c.txt", data_a + data_b, function(err):
            if err: handle_error(err)
            print("done")
        )
    )
)

// Promise style (chainable)
read_file("a.txt")
    .then(data_a => read_file("b.txt").then(data_b => [data_a, data_b]))
    .then([data_a, data_b] => write_file("c.txt", data_a + data_b))
    .then(() => print("done"))
    .catch(err => handle_error(err))

// Async/Await style (reads like sync)
async function process():
    data_a = await read_file("a.txt")
    data_b = await read_file("b.txt")
    await write_file("c.txt", data_a + data_b)
    print("done")
```

### 9.3 Reactor vs Proactor Pattern

| Pattern       | Description                                                     | Vietnamese                            |
| ------------- | --------------------------------------------------------------- | ------------------------------------- |
| **Reactor**   | OS thông báo "ready to read/write" → app thực hiện I/O          | epoll (Linux), kqueue (BSD), Node.js  |
| **Proactor**  | App phát lệnh I/O → OS thực hiện → OS thông báo "I/O completed" | IOCP (Windows), io_uring (Linux 5.1+) |
| Reactor flow  | poll → event ready → app calls read() → process data            | App chủ động đọc/ghi                  |
| Proactor flow | app calls async_read() → OS does I/O → callback with data       | OS chủ động, app chỉ xử lý result     |

### 9.4 Non-blocking I/O

| Approach         | Mechanism                                                     | Vietnamese                                 |
| ---------------- | ------------------------------------------------------------- | ------------------------------------------ |
| Blocking I/O     | Thread bị block cho đến khi I/O hoàn thành                    | Đơn giản nhưng lãng phí thread             |
| Non-blocking I/O | I/O call return ngay với EAGAIN nếu chưa sẵn sàng             | App phải poll hoặc dùng event notification |
| I/O Multiplexing | 1 thread monitor nhiều file descriptors (select, poll, epoll) | Event loop dùng cách này                   |
| Async I/O        | OS thực hiện I/O hoàn toàn async, thông báo khi xong          | Proactor pattern                           |

```text
// Non-blocking I/O flow
socket = create_socket(NON_BLOCKING)

function handle_connection(socket):
    result = read(socket, buffer)
    if result == WOULD_BLOCK:
        register_with_event_loop(socket, ON_READABLE, handle_connection)
        return    // không block, quay lại event loop
    if result == ERROR:
        close(socket)
        return
    process(buffer)
    // register interest cho lần đọc tiếp
    register_with_event_loop(socket, ON_READABLE, handle_connection)
```

### Interview Q&A

### 🟢 Q: What is an event loop and why is it useful? `[Junior]`

**A:** Event loop là vòng lặp liên tục check events (I/O ready, timer, etc.) và chạy handlers tương ứng — tất cả trên 1 thread. Hữu ích vì: xử lý hàng nghìn concurrent connections mà chỉ dùng 1 thread (tiết kiệm memory, không cần context switch). Node.js là ví dụ: 1 thread xử lý hàng nghìn HTTP requests concurrent nhờ non-blocking I/O.

### 🟡 Q: Why does async/await exist if we already have Promises? `[Mid]`

**A:** Promise giải quyết callback hell nhưng vẫn cần `.then()` chain — code khó đọc khi có branching, loops, try-catch. Async/await cho phép viết async code giống sync code: dùng `try-catch` thay `.catch()`, dùng `for` loop thay recursive `.then()`, dễ debug (stack trace rõ ràng hơn). Bên dưới, compiler transform async function thành state machine tương đương Promise chain.

### 🔴 Q: Compare the Reactor and Proactor patterns. What are the implications for performance? `[Senior]`

**A:** Reactor: OS báo "socket ready" → app gọi read() (synchronous, non-blocking) → app xử lý data. Proactor: app gọi async_read() → OS copy data vào buffer → OS báo "read complete". Proactor tránh 1 syscall read() sau notification nên throughput cao hơn, nhưng cần OS support (IOCP trên Windows, io_uring trên Linux). Reactor phổ biến hơn vì portable (epoll/kqueue). io_uring đang thay đổi landscape trên Linux — cho phép proactor-style với batched syscalls, giảm kernel-user transitions.

---

## 10. Real-world Applications — Ứng dụng thực tế

### Definition

- Các pattern và kiến trúc thực tế áp dụng lý thuyết concurrency/parallelism để giải quyết bài toán production.

### 10.1 Web Servers: Thread-per-request vs Event-driven

| Model              | Description                                              | Vietnamese                               |
| ------------------ | -------------------------------------------------------- | ---------------------------------------- |
| Thread-per-request | Mỗi request được xử lý bởi 1 thread riêng                | Apache prefork, traditional Java servers |
| Thread pool        | Pool cố định N threads, request xếp hàng chờ thread rảnh | Tomcat, most Java app servers            |
| Event-driven       | 1 event loop thread + worker pool cho CPU tasks          | Node.js, Nginx, Go net/http              |
| Hybrid             | Event loop cho I/O + thread pool cho computation         | Netty, many modern frameworks            |

| Metric                 | Thread-per-request                    | Event-driven               |
| ---------------------- | ------------------------------------- | -------------------------- |
| Concurrent connections | ~1K-10K (limited by threads)          | ~100K-1M                   |
| Memory per connection  | ~1MB (thread stack)                   | ~KB                        |
| CPU-bound handling     | Tốt (mỗi thread chạy trên core riêng) | Kém nếu block event loop   |
| Code complexity        | Đơn giản (sequential per request)     | Phức tạp (callbacks/async) |
| Latency per request    | Có thể cao nếu thread pool hết        | Thấp cho I/O-bound         |

### 10.2 Database Connection Pools

```text
// Connection pool pattern
pool = create_pool(min=5, max=20, idle_timeout=30s)

function handle_request(query):
    conn = pool.acquire(timeout=5s)    // chờ nếu pool hết
    if conn == null:
        return error("connection pool exhausted")
    try:
        result = conn.execute(query)
        return result
    finally:
        pool.release(conn)    // trả lại pool, không close

// Pool internals
function acquire(timeout):
    semaphore.wait(timeout)    // counting semaphore = max connections
    lock(mutex)
    if idle_connections.not_empty():
        conn = idle_connections.pop()
        if conn.is_alive():
            unlock(mutex)
            return conn
        else:
            conn.close()     // stale connection
    conn = create_new_connection()
    unlock(mutex)
    return conn
```

**Tại sao cần pool**: Tạo TCP connection + TLS handshake + DB authentication tốn ~10-50ms. Pool tái sử dụng connections → amortize cost. Semaphore giới hạn concurrent connections tránh overwhelm database.

### 10.3 Task Queues and Worker Pools

| Component         | Description                                        | Vietnamese                   |
| ----------------- | -------------------------------------------------- | ---------------------------- |
| Task queue        | Hàng đợi chứa units of work                        | FIFO, priority, delay queue  |
| Worker pool       | Nhóm threads/processes lấy task từ queue xử lý     | Fixed size hoặc auto-scaling |
| Backpressure      | Khi queue đầy, producer phải chờ hoặc bị reject    | Ngăn system overload         |
| Graceful shutdown | Đợi workers hoàn thành task hiện tại trước khi tắt | Không mất dữ liệu            |

```text
// Worker pool pattern
function create_worker_pool(num_workers, queue):
    workers = []
    for i = 0 to num_workers - 1:
        w = spawn(worker_loop, queue)
        workers.append(w)
    return workers

function worker_loop(queue):
    while not shutdown_signal:
        task = queue.dequeue(timeout=1s)   // block with timeout
        if task != null:
            try:
                task.execute()
            catch error:
                log_error(error)
                task.retry_or_dead_letter()

function submit_task(queue, task):
    if queue.size() >= max_queue_size:
        return error("backpressure: queue full")   // reject
    queue.enqueue(task)

function graceful_shutdown(workers, queue):
    stop_accepting_new_tasks()
    wait_until(queue.is_empty(), timeout=30s)
    send_shutdown_signal()
    for w in workers:
        join(w, timeout=10s)
```

### 10.4 GUI Thread Safety

| Rule              | Description                                                         | Vietnamese                                |
| ----------------- | ------------------------------------------------------------------- | ----------------------------------------- |
| Main thread only  | UI updates chỉ được thực hiện trên main (UI) thread                 | Hầu hết GUI frameworks yêu cầu            |
| Background thread | Heavy computation, I/O phải chạy trên background thread             | Tránh freeze UI                           |
| Post to main      | Background thread gửi result về main thread qua message/event queue | runOnUiThread, Dispatch.main, postMessage |
| Immutable data    | Pass immutable data giữa threads tránh synchronization              | Không cần lock nếu data readonly          |

```text
// GUI pattern: offload work to background, post result to UI thread
function on_button_click():
    show_loading_spinner()
    spawn_background(function():
        result = expensive_computation()     // không block UI
        post_to_main_thread(function():
            hide_loading_spinner()
            update_ui(result)                // chỉ update UI trên main thread
        )
    )
```

### 10.5 Summary: Choosing the Right Concurrency Model

| Workload                    | Recommended Model                | Vietnamese                        |
| --------------------------- | -------------------------------- | --------------------------------- |
| I/O-bound, many connections | Event loop + async I/O           | Web server, API gateway           |
| CPU-bound, divisible data   | Thread pool + fork-join          | Image processing, data analysis   |
| Mixed I/O + CPU             | Hybrid: event loop + worker pool | Most real applications            |
| Distributed, fault-tolerant | Actor model                      | Telecom, chat systems (Erlang)    |
| Pipeline / streaming        | CSP (channels)                   | Data processing, Go microservices |
| Embarrassingly parallel     | MapReduce / SPMD                 | Big data, batch processing        |

### Interview Q&A

### 🟢 Q: Why do web servers use thread pools instead of creating a new thread per request? `[Junior]`

**A:** Tạo thread tốn tài nguyên (~1MB stack + OS overhead). Nếu 10,000 requests đến cùng lúc, tạo 10,000 threads sẽ hết memory và context switching quá nhiều. Thread pool tái sử dụng số lượng threads cố định — request xếp hàng chờ thread rảnh. Kiểm soát được resource usage.

### 🟡 Q: How does a database connection pool work and why is it important? `[Mid]`

**A:** Pool duy trì tập connections đã sẵn sàng. Khi cần: acquire connection từ pool (thay vì tạo mới — tiết kiệm 10-50ms handshake). Khi xong: release về pool (không close). Counting semaphore giới hạn max connections tránh overwhelm DB. Quan trọng vì: (1) giảm latency, (2) kiểm soát tải lên DB, (3) tránh connection leak. Nếu không có pool, mỗi request tạo + close connection → chậm và DB có thể refuse connections.

### 🔴 Q: Design a graceful shutdown mechanism for a worker pool system. `[Senior]`

**A:** Quy trình: (1) Ngừng nhận task mới (close intake). (2) Drain existing queue — đợi workers xử lý hết hoặc timeout. (3) Gửi shutdown signal đến workers. (4) Workers hoàn thành task hiện tại rồi exit (không abort giữa chừng). (5) Với timeout: nếu worker chạy quá lâu, force kill và move task sang dead-letter queue để retry sau. (6) Cleanup resources: close DB connections, flush logs. Key insight: cần phân biệt in-flight tasks (phải đợi) vs queued tasks (có thể persist rồi xử lý sau restart). Dùng cooperative cancellation — worker tự check shutdown flag tại safe points thay vì bị kill bất kỳ lúc nào.

---

## Summary Table — Tổng kết

| Topic                      | Key Takeaway                                                     | Vietnamese                            |
| -------------------------- | ---------------------------------------------------------------- | ------------------------------------- |
| Concurrency vs Parallelism | Concurrency = structure, Parallelism = execution                 | Đồng thời ≠ song song                 |
| Process vs Thread          | Process = isolated, Thread = shared memory                       | Trade-off isolation vs performance    |
| Synchronization            | Mutex, semaphore, condition variable — biết khi nào dùng cái nào | Đồng bộ là cốt lõi                    |
| Classic Problems           | Producer-Consumer, Readers-Writers, Dining Philosophers          | Pattern recognition cho interview     |
| Deadlock                   | 4 Coffman conditions — phá 1 là đủ                               | Prevention > Detection                |
| Race Conditions            | Data race ≠ race condition, cần đúng cả atomicity lẫn logic      | Memory model quan trọng cho low-level |
| Concurrent Data Structures | Coarse → fine-grained → lock-free → wait-free                    | Trade-off complexity vs scalability   |
| Parallel Models            | Fork-Join, MapReduce, Actor, CSP — chọn theo workload            | Amdahl's Law = reality check          |
| Async Programming          | Event loop cho I/O-bound, thread pool cho CPU-bound              | async/await = best ergonomics         |
| Real-world                 | Connection pools, worker pools, graceful shutdown                | Theory → production                   |

---

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is the difference between concurrency and parallelism? / Concurrency và parallelism khác nhau như thế nào? 🟢 Junior

**A:** **Concurrency** is about _structure_ — designing a program to handle multiple tasks that can overlap in time. **Parallelism** is about _execution_ — actually running multiple tasks simultaneously on multiple CPU cores.

```
Concurrency (1 core, interleaved):
Time → [Task A][Task B][Task A][Task B]
       fast context switching = appears simultaneous

Parallelism (multi-core, truly simultaneous):
Core 1 → [Task A────────────]
Core 2 → [Task B────────────]

You can have concurrency without parallelism (Node.js single-threaded event loop)
You need concurrency to have parallelism (parallel tasks must be designed concurrently)
```

Vietnamese explanation: Rob Pike: "Concurrency is about dealing with lots of things at once. Parallelism is about doing lots of things at once." Node.js: concurrency (event loop) nhưng không parallelism (single-threaded, trừ Worker Threads). Go: cả hai — concurrent bởi design, parallel khi GOMAXPROCS > 1 (default = CPU cores). Amdahl's Law: speedup limited by sequential portion — 95% parallel code → max 20x speedup dù infinite cores.

---

### Q: What is a race condition and how do you prevent it? / Race condition là gì và cách phòng tránh? 🟡 Mid

**A:** A race condition occurs when program behavior depends on the relative timing/interleaving of thread execution. Multiple threads read/write shared state without synchronization → non-deterministic, incorrect results.

```
Race condition example:
counter = 0

Thread A:              Thread B:
read counter (0)       read counter (0)   ← both read 0!
increment → 1          increment → 1
write counter (1)      write counter (1)
                       → counter = 1, expected 2!

Fix with mutex:
lock()
  read → increment → write  (atomic block)
unlock()
→ counter = 2 ✓
```

Vietnamese explanation: Data race (two threads access same memory without sync) ≠ race condition (logic depends on timing even with some sync). Ví dụ: check-then-act (if file exists → create) có race condition dù từng operation atomic. Prevention: mutex/lock cho shared mutable state, immutable data (no mutation = no race), message passing (Go: "don't communicate by sharing memory, share memory by communicating"). Tools: Go `-race` flag; ThreadSanitizer cho C/C++.

---

### Q: Explain deadlock vs livelock vs starvation. / Deadlock, livelock, starvation khác nhau thế nào? 🟡 Mid

**A:** Three types of progress failure: **Deadlock**: threads permanently blocked waiting for each other. **Livelock**: threads keep responding to each other but make no real progress. **Starvation**: thread perpetually denied resources because others keep getting priority.

```
Deadlock (frozen):
Thread A: holds Lock1, waiting for Lock2
Thread B: holds Lock2, waiting for Lock1  → circular wait

Livelock (busy but no progress):
Thread A: releases Lock1 to let B proceed
Thread B: releases Lock2 to let A proceed
Thread A: takes Lock1 again...  → active but stuck

Starvation:
High-priority threads always run
Low-priority thread never scheduled → waiting forever
```

Vietnamese explanation: Deadlock = no thread running. Livelock = all threads running but no progress (như hai người lịch sự nhường nhau mãi). Starvation = unfair scheduling. Phòng deadlock: lock ordering (luôn acquire Lock1 trước Lock2 = breaks circular wait), timeout. Database: deadlock detection + kill lowest-priority transaction (PostgreSQL auto-detects). Livelock: add randomization (random backoff như Ethernet CSMA/CD).

---

### Q: What is the Actor model and how does it differ from shared-memory concurrency? / Actor model so với shared-memory concurrency? 🔴 Senior

**A:** The Actor model treats everything as an **actor** — independent unit with private state, a mailbox, and behavior. Actors communicate only via **message passing** (no shared memory). Each actor processes messages sequentially → no locks needed within an actor.

```
Shared-memory:                    Actor model:
┌──────────┐                      ┌────────┐  msg  ┌────────┐
│ Thread A │──→ shared state      │Actor A │──────→│Actor B │
│ Thread B │──→ (needs locks)     │(private│       │(private│
└──────────┘   deadlock risk      │ state) │       │ state) │
                                  └────────┘       └────────┘
                                  No shared state → no locks → no deadlock
```

Vietnamese explanation: Actor model dùng trong Erlang/Elixir (WhatsApp handles 2B users), Akka (Scala/Java), Go goroutine + channel (CSP — similar). Ưu điểm: fault isolation (actor crash không ảnh hưởng actor khác), distributed-ready (message có thể qua network). Supervision tree (Erlang): parent actor monitors children, restarts on crash → "let it crash" philosophy. CSP (Go channels): channel là first-class citizen, không phải actor mailbox.

---

### Q: What are memory ordering and happens-before relationships? / Memory ordering và happens-before là gì? 🔴 Senior

**A:** Modern CPUs and compilers reorder instructions for performance. Memory ordering defines when writes by one thread become visible to others. **Happens-before**: if A happens-before B, then B sees A's effects.

```
Without sync (CPU can reorder):
Thread A: x = 1; flag = true   (CPU may write flag before x!)
Thread B: if (flag) print(x)   → may print 0 even after A wrote 1!

With happens-before (mutex):
Thread A: x = 1; lock(); flag = true; unlock()
Thread B: lock(); if (flag) print(x); unlock()
          ↑ acquire sees ALL writes before release → prints 1 ✓
```

Vietnamese explanation: Java Memory Model và C++ memory_order define happens-before. Go memory model: synchronization via channel send/receive, mutex lock/unlock establishes happens-before. `sync/atomic`: load/store/CAS với memory ordering guarantee. Double-checked locking pattern cần `volatile` trong Java (memory fence). Go: dùng channel/mutex → compiler handles ordering automatically. Practical: lý do tại sao race condition với global variable không có sync = undefined behavior trong Go.

---

## Interview Q&A Summary / Tổng Kết Câu Hỏi Phỏng Vấn

| #   | Question                              | Difficulty | Core Concept     | Key Signal                                                   |
| --- | ------------------------------------- | ---------- | ---------------- | ------------------------------------------------------------ |
| 1   | Concurrency vs parallelism            | 🟢         | Foundation       | Rob Pike quote + Node.js vs Go examples + Amdahl's Law       |
| 2   | Process vs thread difference          | 🟢         | Process/Thread   | Shared memory tradeoff + crash isolation                     |
| 3   | What is a mutex                       | 🟢         | Sync Primitives  | Critical section protection + owner semantics                |
| 4   | Producer-Consumer solution            | 🟢         | Classic Problems | mutex + 2 condition vars + while loop                        |
| 5   | What is deadlock + 4 conditions       | 🟢         | Deadlock         | Coffman MHNC + break any one                                 |
| 6   | What is a race condition              | 🟢         | Race Conditions  | Lost update example + timing-dependent                       |
| 7   | Thread-safe data structure            | 🟢         | Concurrent DS    | Correct under concurrent access → mutex or atomic            |
| 8   | Amdahl's Law                          | 🟢         | Parallel Models  | Serial fraction limits max speedup                           |
| 9   | Event loop explained                  | 🟢         | Async            | Single thread + non-blocking I/O + no context switch         |
| 10  | Thread pool for web server            | 🟢         | Real-world       | Resource reuse + bounded concurrency                         |
| 11  | Concurrency without parallelism       | 🟡         | Foundation       | Event loop = concurrent not parallel                         |
| 12  | Green threads usefulness              | 🟡         | Process/Thread   | M:N model, millions of goroutines, ~2KB stack                |
| 13  | Semaphore vs mutex                    | 🟡         | Sync Primitives  | Counting semaphore for bounded resources                     |
| 14  | While loop with cond var              | 🟡         | Sync Primitives  | Spurious wakeup protection                                   |
| 15  | Dining Philosophers deadlock          | 🟡         | Classic Problems | Circular wait → resource hierarchy breaks it                 |
| 16  | Prevent deadlock in practice          | 🟡         | Deadlock         | Lock ordering + tryLock timeout                              |
| 17  | Data race vs race condition           | 🟡         | Race Conditions  | Data race=unsync access, race cond=timing logic bug          |
| 18  | Lock-free data structure              | 🟡         | Concurrent DS    | CAS-based, no deadlock, good for high contention             |
| 19  | Actor model vs CSP                    | 🟡         | Parallel Models  | Actor=point-to-point identity, CSP=anonymous channels        |
| 20  | Why async/await over Promises         | 🟡         | Async            | Sync-like syntax, better error handling, easier debug        |
| 21  | Race condition prevention             | 🟡         | Race Conditions  | Mutex or message passing; Go -race flag                      |
| 22  | Deadlock vs livelock vs starvation    | 🟡         | Deadlock         | Frozen vs busy-no-progress vs unfair scheduling              |
| 23  | DB connection pool                    | 🟡         | Real-world       | Reuse connections + semaphore bounds + avoid overwhelm       |
| 24  | Non-determinism in concurrent systems | 🔴         | Foundation       | Scheduler + I/O timing → heisenbug                           |
| 25  | M:N threading tradeoffs               | 🔴         | Process/Thread   | Runtime scheduler complexity + blocking syscall handling     |
| 26  | ABA problem with CAS                  | 🔴         | Sync Primitives  | Value A→B→A fools CAS → version counter fix                  |
| 27  | Readers-Writers prevent starvation    | 🔴         | Classic Problems | Fair variant with turnstile semaphore                        |
| 28  | Deadlock vs livelock vs starvation    | 🔴         | Deadlock         | Distinctions + fixes: ordering, random backoff, aging        |
| 29  | Memory ordering models                | 🔴         | Race Conditions  | SeqCst vs Acquire-Release vs Relaxed tradeoffs               |
| 30  | Lock-free vs wait-free                | 🔴         | Concurrent DS    | Wait-free = bounded steps per thread, rare in practice       |
| 31  | Gustafson vs Amdahl                   | 🔴         | Parallel Models  | Fixed vs scaled problem size assumption                      |
| 32  | Reactor vs Proactor                   | 🔴         | Async            | OS notifies ready vs completed; io_uring = proactor on Linux |
| 33  | Graceful shutdown design              | 🔴         | Real-world       | Stop intake → drain queue → cooperative cancel → cleanup     |
| 34  | Actor model vs shared-memory          | 🔴         | Parallel Models  | Private state + message = no locks; Erlang supervision       |
| 35  | Happens-before relationships          | 🔴         | Race Conditions  | CPU reorder; sync primitives establish visibility            |

**Distribution:** 🟢 10 | 🟡 13 | 🔴 12

---

## Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **⚡ "Your Go service is crashing with 'fatal error: concurrent map writes' under load. What happened and how do you fix it?"**

**30-second answer:**
"Go's runtime detects concurrent unsynchronized writes to a map and intentionally crashes (not just corruption — it's a safety mechanism). The fix depends on the access pattern: if it's a simple shared counter-like map, use `sync.Mutex` to protect read/write. If reads dominate, use `sync.RWMutex`. If keys are mostly independent, use `sync.Map` (optimized for read-heavy + disjoint writes). For tests: `go test -race` would have caught this before production."

**Follow-up: "How would you redesign to avoid shared state entirely?"**
"Switch to CSP pattern: each goroutine owns its data, communicates results via channels. Instead of N goroutines writing to shared map, have them send results to a single aggregator goroutine that owns the map — no lock needed because only one goroutine accesses the map."

---

## Self-Check / Tự Kiểm Tra

Đóng tài liệu và trả lời:

| #   | Câu hỏi                                                                                      | Key Points                                                                                 |
| --- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1   | **Retrieval:** Liệt kê 4 điều kiện Coffman cho deadlock                                      | Mutual Exclusion, Hold-and-Wait, No Preemption, Circular Wait                              |
| 2   | **Visual:** Vẽ Producer-Consumer với bounded buffer + sync primitives                        | mutex + not_full + not_empty condition vars, while loop                                    |
| 3   | **Application:** 10K concurrent API requests — chọn thread-per-request hay event loop?       | Event loop cho I/O-bound (10K threads = ~10GB RAM, event loop = ~MBs)                      |
| 4   | **Debug:** Livelock xảy ra khi 2 goroutines liên tục retry — giải thích và fix               | Both release-and-retry in lockstep → add random backoff/jitter                             |
| 5   | **Teach:** Giải thích cho junior tại sao `go test -race` quan trọng dù test pass bình thường | Race conditions timing-dependent → normal tests miss them; -race instruments memory access |

💬 **Feynman Prompt:** Giải thích tại sao concurrent `map` writes cause `fatal error` in Go — Go runtime làm gì khi detect race condition trên map? Tại sao crash thay vì silent corruption?

---

## Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | Thời điểm | Focus                                                             |
| ----- | --------- | ----------------------------------------------------------------- |
| 1     | Day 1     | Đọc full bài, vẽ Concept Map từ trí nhớ                           |
| 2     | Day 3     | Cold Call + Self-Check (đóng tài liệu)                            |
| 3     | Day 7     | Giải thích deadlock conditions, solve Dining Philosophers cho bạn |
| 4     | Day 14    | Mock interview: race condition + memory model + Actor vs CSP      |
| 5     | Day 30    | Chỉ review Common Mistakes tables + model selection matrix        |

---

## Connections / Liên Kết

**Same-track (Shared CS Fundamentals):**

- ⬅️ [OS Theory](./os-theory.md) — Process/thread, scheduling, IPC = OS-level foundation
- ↔️ [Algorithms Theory](./algorithms-theory.md) — Parallel sorting, concurrent data structures
- ↔️ [Data Structures Theory](./data-structures-theory.md) — Thread-safe collections, lock-free stacks/queues
- ↔️ [Networking Theory](./networking-theory.md) — Event loop for network I/O, connection pooling
- ↔️ [Complexity Analysis](./complexity-analysis.md) — Amdahl's Law, parallel speedup analysis

**Cross-track:**

- 🔗 [Go Concurrency](../../be-track/01-golang/03-concurrency.md) — Goroutines, channels, select, GMP scheduler
- 🔗 [JS Event Loop](../../fe-track/01-javascript/06-event-loop-async.md) — Single-threaded concurrency model
- 🔗 [Distributed Systems](../../be-track/02-backend-knowledge/03-distributed-systems.md) — Distributed locks, consensus, distributed deadlock
