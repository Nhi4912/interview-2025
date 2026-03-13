# Go Memory Management & Garbage Collection — Deep Dive


> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> **Target:** Middle/Senior Go Backend Developer
> **Companies:** Zalo, Grab, Axon, Employment Hero, Microsoft, Google
> **Difficulty:** 🟢 Junior | 🟡 Middle | 🔴 Senior

---

## Table of Contents

1. [Go Memory Model](#1-go-memory-model)
2. [Stack vs Heap Allocation](#2-stack-vs-heap-allocation)
3. [Memory Allocator (TCMalloc-inspired)](#3-memory-allocator-tcmalloc-inspired)
4. [Garbage Collector Deep Dive](#4-garbage-collector-deep-dive)
5. [GC Tuning](#5-gc-tuning)
6. [Memory Profiling (pprof)](#6-memory-profiling-pprof)
7. [Common Memory Leaks in Go](#7-common-memory-leaks-in-go)
8. [sync.Pool](#8-syncpool)
9. [Memory Optimization Techniques](#9-memory-optimization-techniques)
10. [Cheat Sheet & Interview Questions](#10-cheat-sheet--interview-questions)

---

## 1. Go Memory Model

### 🟡 Q: Go Memory Model là gì? Giải thích happens-before relationship.

**A:**

Go Memory Model định nghĩa **các điều kiện** mà một goroutine khi đọc biến có thể **quan sát được** giá trị do goroutine khác ghi. Nếu không có synchronization, **không có gì đảm bảo** goroutine A thấy được thay đổi từ goroutine B.

**Happens-before relationship:** Nếu event `e1` happens-before event `e2`, thì `e2` được đảm bảo thấy hiệu ứng của `e1`.

**Các happens-before guarantees trong Go:**

| Operation | Guarantee |
|-----------|-----------|
| **Package init** | `init()` của package import xong happens-before `init()` của package importing |
| **Goroutine creation** | `go f()` statement happens-before `f()` bắt đầu chạy |
| **Channel send** | Send trên channel happens-before receive tương ứng hoàn thành |
| **Channel close** | Close happens-before receive nhận zero value (từ closed channel) |
| **Unbuffered channel** | Receive hoàn thành happens-before send hoàn thành |
| **Mutex** | `mu.Unlock()` call n happens-before `mu.Lock()` call n+1 returns |
| **sync.Once** | `once.Do(f)` — `f()` hoàn thành happens-before mọi `once.Do` khác return |
| **sync.WaitGroup** | `wg.Done()` happens-before `wg.Wait()` returns |

### 🔴 Q: Tại sao cần synchronization? Điều gì xảy ra nếu không sync?

**A:**

Không có synchronization, compiler và CPU đều có quyền **reorder** instructions. Goroutine khác có thể thấy giá trị **không nhất quán** hoặc **không bao giờ thấy** thay đổi.

```go
// BUG: Không có synchronization
var a string
var done bool

func setup() { a = "hello"; done = true }

func main() {
    go setup()
    for !done {} // Có thể loop mãi! (compiler/CPU reorder, store buffer)
    print(a)     // Có thể in "" (a chưa visible dù done = true)
}

// FIX: Dùng channel (send happens-before receive completes)
func main() {
    ch := make(chan struct{})
    go func() { a = "hello"; ch <- struct{}{} }()
    <-ch       // Đảm bảo thấy a = "hello"
    print(a)   // Luôn in "hello"
}
```

---

## 2. Stack vs Heap Allocation

### 🟡 Q: Go quyết định allocate biến trên stack hay heap như thế nào?

**A:**

Go compiler dùng **escape analysis** để quyết định. Nguyên tắc:

- **Stack:** Biến chỉ sống trong scope của function → goroutine stack (nhanh, auto-free khi return)
- **Heap:** Biến "escape" ra khỏi function scope → heap (chậm hơn, cần GC)

**Stack advantages:** Cực nhanh (chỉ move stack pointer), không cần GC, cache-friendly.

### 🟡 Q: Những trường hợp nào gây escape to heap?

**A:**

Dùng lệnh `go build -gcflags="-m"` để xem escape analysis:

```bash
go build -gcflags="-m" ./...
# Thêm -m nữa để xem chi tiết hơn:
go build -gcflags="-m -m" ./...
```

**Các trường hợp phổ biến gây escape:**

| Trường hợp | Ví dụ | Lý do |
|------------|-------|-------|
| **Return pointer** | `return &x` | Caller cần truy cập sau khi function return |
| **Interface conversion** | `fmt.Println(x)` | Compiler không biết size tại compile time |
| **Closure capture by reference** | `go func() { use(x) }()` | Goroutine có thể outlive stack frame |
| **Slice/map quá lớn** | `make([]byte, 1<<20)` | Quá lớn cho stack (thường >64KB) |
| **Dynamic size** | `make([]byte, n)` | Size chưa biết tại compile time |
| **Assign to interface field** | `var i interface{} = x` | Boxing value vào interface |
| **Send pointer to channel** | `ch <- &x` | Receiver ở goroutine khác |

```go
// Return pointer → escapes
func newUser() *User {
    u := User{Name: "Tung"} // moved to heap
    return &u
}

// Interface conversion → escapes
func logValue(v int) {
    fmt.Println(v) // v escapes — Println takes interface{}
}

// Closure capture → escapes
func startWorker() {
    data := make([]byte, 1024)
    go func() { process(data) }() // data escapes — goroutine outlives function
}

// No escape — stays on stack
func sum(a, b int) int {
    result := a + b
    return result // value copy, not pointer
}
```

### 🟡 Q: Goroutine stack hoạt động như thế nào?

**A:**

- **Initial size:** 2KB (vs OS thread 1-8MB)
- **Growable:** Khi đầy, runtime allocate stack gấp đôi, copy toàn bộ sang. Mỗi function call có prologue check stack space → nếu thiếu gọi `runtime.morestack`.
- **Shrinkable:** GC thu nhỏ stack nếu dùng < 1/4 capacity
- **No stack overflow:** Stack tăng linh hoạt đến khi hết memory (default limit 1GB, `runtime.SetMaxStack`)

---

## 3. Memory Allocator (TCMalloc-inspired)

### 🔴 Q: Mô tả kiến trúc memory allocator của Go.

**A:**

Go memory allocator lấy cảm hứng từ **TCMalloc** (Thread-Caching Malloc) của Google. Thiết kế phân tầng giảm lock contention:

```
┌────────────────────────────────────────────────────┐
│             Go Memory Allocator                     │
│                                                    │
│  ┌────────┐ ┌────────┐ ┌────────┐                 │
│  │mcache  │ │mcache  │ │mcache  │  Per-P (NO LOCK)│
│  │ (P0)   │ │ (P1)   │ │ (P2)   │                 │
│  └───┬────┘ └───┬────┘ └───┬────┘                 │
│      └──────────┼──────────┘                       │
│                 ▼                                   │
│  ┌──────────────────────────────┐                  │
│  │  mcentral (per size class)   │  MUTEX per class │
│  └──────────────┬───────────────┘                  │
│                 ▼                                   │
│  ┌──────────────────────────────┐                  │
│  │  mheap (global)              │  GLOBAL MUTEX    │
│  │  └── OS Memory (mmap, 64MB) │                   │
│  └──────────────────────────────┘                  │
└────────────────────────────────────────────────────┘
```

**Phân tầng chi tiết:**

| Layer | Mô tả | Lock |
|-------|--------|------|
| **mcache** | Mỗi P (logical processor) có 1 mcache riêng. Chứa free list cho mỗi size class. Allocation KHÔNG cần lock | None |
| **mcentral** | Shared cache cho từng size class. Khi mcache hết, lấy span từ mcentral | Mutex (per size class) |
| **mheap** | Quản lý toàn bộ heap memory. Khi mcentral hết, lấy page từ mheap | Global mutex |
| **OS** | mheap request memory từ OS bằng `mmap` syscall, theo chunks 64MB (arena) | N/A |

### 🔴 Q: Size classes và tiny allocator là gì?

**A:**

**Size classes:** Go chia objects thành ~67 size classes (8B, 16B, 24B, 32B, 48B, ..., 32KB). Object được round lên size class gần nhất → giảm fragmentation, chút waste.

**Tiny allocator (< 16 bytes, no pointers):** Gom nhiều tiny objects vào cùng 1 block 16 bytes. Giảm overhead cho small strings, bytes.

**Large objects (> 32KB):** Allocate trực tiếp từ mheap, bypass mcache/mcentral.

```
Allocation flow:
  size ≤ 16B, no ptr  → tiny allocator (mcache)
  size ≤ 32KB         → mcache → mcentral → mheap → OS
  size > 32KB         → mheap → OS (direct)
```

---

## 4. Garbage Collector Deep Dive

### 🟡 Q: Go dùng thuật toán GC nào? Mô tả tri-color mark-and-sweep.

**A:**

Go dùng **concurrent, tri-color, mark-and-sweep** garbage collector. Ba màu phân loại objects:

| Màu | Ý nghĩa |
|------|---------|
| **White** | Chưa được visit — potentially unreachable (sẽ bị sweep nếu vẫn white cuối phase) |
| **Grey** | Đã được mark reachable, nhưng children chưa scan |
| **Black** | Đã mark reachable VÀ tất cả children đã scan xong |

**Thuật toán:**

1. Ban đầu: tất cả objects là **white**
2. Đưa tất cả **root objects** (global vars, stack vars, registers) vào grey set
3. Lặp: lấy object từ grey set → scan children → đưa children vào grey → chuyển object thành black
4. Khi grey set rỗng → tất cả white objects là garbage → sweep (free memory)

```
 Start:           Step 1:          Step 2:          Final:
 All White        Roots → Grey     Scan Grey        Grey empty

 ○ ○ ○ ○         ◐ ○ ○ ○         ● ◐ ○ ○         ● ● ○ ○
 │ │              │ │              │ │              │ │
 ○ ○              ◐ ○              ● ◐              ● ●
   │                │                │                │
   ○                ○                ◐                ●
                    │                │
                    ○                ○ ← GARBAGE

 ○ = White (unmarked)
 ◐ = Grey (reachable, children not yet scanned)
 ● = Black (reachable, fully scanned)
```

### 🔴 Q: Tại sao cần write barrier? Write barrier hoạt động như thế nào?

**A:**

**Vấn đề:** GC chạy **concurrent** với mutator (application goroutines). Nếu trong lúc GC đang scan, mutator thay đổi pointer, có thể xảy ra **lost object bug:**

```
Trước khi GC scan B:              Mutator thay đổi:
   [A ●] ──▶ [B ◐] ──▶ [C ○]    [A ●] ──▶ [B ◐]     [C ○]
                                       │                  ▲
                                       └──────────────────┘
                                   A (black) → C (white) TRỰC TIẾP!

Vấn đề: A đã scan xong (black), sẽ KHÔNG scan lại
         → C không bao giờ được mark → bị sweep nhầm!

Invariant bị vi phạm: "Black object must NOT point to white object"
(Gọi là tri-color invariant / strong tri-color invariant)
```

**Write barrier** là code inject vào **mỗi pointer write** trong GC mark phase. Go dùng **hybrid write barrier** (Go 1.8+):

- **Dijkstra:** Khi ghi pointer mới → mark object mới là grey
- **Yuasa:** Khi overwrite pointer cũ → mark object cũ là grey

```go
// Pseudo-code: Hybrid write barrier
func writePointer(slot *unsafe.Pointer, new unsafe.Pointer) {
    shade(*slot)   // Yuasa: shade old object
    if currentGoroutineStackScanned { shade(new) } // Dijkstra
    *slot = new
}
```

**Lưu ý:** Write barrier chỉ active trong mark phase (~5-30% overhead). Stack writes KHÔNG có write barrier (stacks re-scanned thay vì).

### 🔴 Q: Mô tả các phases của GC cycle.

**A:**

```
  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐
  │Mark Setup│  │  Concurrent  │  │    Mark      │  │Concurrent│
  │  (STW)   │→ │  Mark & Scan │→ │ Termination  │→ │  Sweep   │
  │ ~10-30μs │  │  (app runs)  │  │   (STW)      │  │(app runs)│
  └──────────┘  └──────────────┘  │  ~10-30μs    │  └──────────┘
                                  └──────────────┘
```

**Phase 1: Mark Setup (STW)** — Stop all goroutines, enable write barrier, enqueue roots → grey set. Duration: ~10-30μs.

**Phase 2: Concurrent Mark** — GC goroutines chạy song song với app. Scan grey → mark children → move to black. **Mark assist:** goroutine allocate quá nhanh bị buộc giúp GC (back-pressure). Chiếm ~25% CPU.

**Phase 3: Mark Termination (STW)** — Stop all goroutines, drain remaining grey objects, disable write barrier, calculate next GC trigger. Duration: ~10-30μs.

**Phase 4: Concurrent Sweep** — Reclaim white objects. Lazy: sweep khi mcache cần memory. Không STW.

### 🔴 Q: STW pauses kéo dài bao lâu? Làm sao minimize?

**A:**

Go 1.18+ STW pauses: typical **10-50 microseconds** (sub-millisecond). Target < 500μs.

**Nguyên nhân STW kéo dài:** Nhiều goroutines cần stop; goroutine trong tight loop (fixed Go 1.14+ async preemption); nhiều finalizers.

**Cách minimize:**
1. Giảm allocations → ít GC cycles
2. Dùng `sync.Pool` cho hot-path allocations
3. Pre-allocate slices/maps
4. Reuse buffers thay vì allocate mới
5. Tránh quá nhiều goroutines (10K+ = slower STW)

---

## 5. GC Tuning

### 🟡 Q: GOGC là gì? Điều chỉnh GOGC ảnh hưởng thế nào?

**A:**

**GOGC** (Go Garbage Collection target percentage) điều chỉnh **tần suất GC** dựa trên heap growth ratio.

```
GOGC=100 (default):  GC khi heap doubles.     Live=100MB → trigger 200MB
GOGC=50:             GC khi heap +50%.         Live=100MB → trigger 150MB (more GC, less mem)
GOGC=200:            GC khi heap triples.      Live=100MB → trigger 300MB (less GC, more mem)
GOGC=off:            Disable GC entirely
```

```go
import "runtime/debug"
debug.SetGCPercent(50) // Or: GOGC=50 ./myapp
```

### 🔴 Q: GOMEMLIMIT (Go 1.19+) là gì? Nó thay thế ballast technique như thế nào?

**A:**

**GOMEMLIMIT** đặt **soft memory limit** cho Go runtime. Khi memory tiến gần limit, GC chạy aggressive hơn.

```go
// GOMEMLIMIT=1GiB ./myapp
debug.SetMemoryLimit(1 << 30) // Or at runtime
```

**Tại sao cần:** Với GOGC=100, live heap 2GB → GC trigger at 4GB. Container 4GB → OOM! GOMEMLIMIT forces GC trước khi đạt limit.

**Ballast technique (trước Go 1.19):** Allocate large unused slice (`make([]byte, 1<<30)`) để GC nghĩ live heap lớn → trigger GC muộn hơn. Hacky — **GOMEMLIMIT** thay thế hoàn toàn.

```bash
# Best practice: Container 4GB RAM
GOGC=100 GOMEMLIMIT=3500MiB ./myapp  # ~500MB cho non-Go memory
```

### 🔴 Q: GC pacing hoạt động thế nào? Đọc GC trace output.

**A:**

**GC pacing:** Runtime tự tính thời điểm trigger GC tiếp theo dựa trên:
- Live heap size sau GC trước
- GOGC ratio
- GOMEMLIMIT
- Allocation rate hiện tại
- GC CPU time target (~25% GOMAXPROCS)

**Enable GC trace:**

```bash
GODEBUG=gctrace=1 ./myapp
```

**Output format:**

```
gc 12 @1.234s 2%: 0.015+2.5+0.018 ms clock, 0.12+1.8/4.2/0.5+0.14 ms cpu,
  26->27->14 MB, 28 MB goal, 0 MB stacks, 0 MB globals, 8 P
```

**Giải thích từng trường:**

```
gc 12          — GC cycle thứ 12
@1.234s        — Thời điểm (seconds since start)
2%             — Tổng % CPU time dành cho GC

0.015+2.5+0.018 ms clock:
  0.015ms — STW mark setup | 2.5ms — Concurrent mark | 0.018ms — STW mark termination

0.12+1.8/4.2/0.5+0.14 ms cpu:
  0.12ms — STW setup | 1.8ms — Mark assist | 4.2ms — Dedicated GC | 0.5ms — Idle GC | 0.14ms — STW termination

26->27->14 MB:
  26MB — Heap khi GC start | 27MB — Heap peak | 14MB — Live heap sau GC

28 MB goal — Target heap size cho next GC
8 P        — GOMAXPROCS
```

---

## 6. Memory Profiling (pprof)

### 🟡 Q: Sử dụng pprof để profile memory như thế nào?

**A:**

**Cách 1: net/http/pprof (production-safe)**

```go
import _ "net/http/pprof"

func main() {
    go func() {
        log.Println(http.ListenAndServe("localhost:6060", nil))
    }()
    // ... application code
}
```

```bash
# Heap profile
go tool pprof http://localhost:6060/debug/pprof/heap

# CPU profile (30 seconds)
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30

# Goroutine profile
go tool pprof http://localhost:6060/debug/pprof/goroutine

# Allocs profile (cumulative allocations)
go tool pprof http://localhost:6060/debug/pprof/allocs
```

### 🟡 Q: Heap profile có những loại nào? Phân biệt inuse vs alloc.

**A:**

| Profile Type | Ý nghĩa | Use Case |
|-------------|---------|----------|
| **inuse_space** | Bytes đang được sử dụng (live) | Tìm code đang giữ nhiều memory nhất |
| **inuse_objects** | Số objects đang live | Tìm code tạo nhiều small objects |
| **alloc_space** | Tổng bytes đã allocate (cumulative) | Tìm code allocate nhiều nhất (dù đã free) |
| **alloc_objects** | Tổng objects đã allocate | Tìm hot allocation sites |

```bash
# Interactive mode
go tool pprof mem.prof
(pprof) top 10             # Top 10 functions by memory
(pprof) top -inuse_space   # By memory currently in use
(pprof) top -alloc_space   # By total allocated (cumulative)
(pprof) list funcName      # Source-level breakdown
(pprof) web                # Open SVG in browser

# Web UI (recommended — flame graph, source view, graph view)
go tool pprof -http=:8080 mem.prof
```

### 🟡 Q: Các profile types khác ngoài heap?

| Profile | Mô tả | Endpoint |
|---------|--------|----------|
| **CPU** | CPU time distribution | `/debug/pprof/profile?seconds=30` |
| **Heap** | Memory (inuse/alloc) | `/debug/pprof/heap` |
| **Goroutine** | All goroutine stacks | `/debug/pprof/goroutine` |
| **Block** | Goroutine blocking time | `/debug/pprof/block` |
| **Mutex** | Mutex contention | `/debug/pprof/mutex` |

**Benchmark memory:**

```go
func BenchmarkProcess(b *testing.B) {
    b.ReportAllocs()
    for i := 0; i < b.N; i++ { process() }
}
// Output: BenchmarkProcess-8  1000000  1500 ns/op  256 B/op  3 allocs/op
```

```bash
go test -bench=. -benchmem -memprofile=mem.prof
go tool pprof -http=:8080 mem.prof
```

---

## 7. Common Memory Leaks in Go

### 🟡 Q: Go có GC mà vẫn bị memory leak sao? Liệt kê các loại leak phổ biến.

**A:**

Go CÓ GC nhưng vẫn leak nếu **references tồn tại** mà developer không nhận ra. GC chỉ free objects mà không ai reference tới.

### Leak 1: Goroutine Leak 🔴

```go
// BUG: Goroutine bị block forever → leak goroutine + mọi thứ nó reference
func processRequest(ctx context.Context) {
    ch := make(chan result)
    go func() {
        data := fetchFromDB()  // Nếu DB slow hoặc down...
        ch <- data             // Blocked forever nếu không ai receive
    }()
    
    select {
    case r := <-ch:
        handle(r)
    case <-ctx.Done():
        return // Goroutine vẫn block trên ch <- data → LEAK!
    }
}

// FIX: Buffered channel + context cancellation
func processRequest(ctx context.Context) {
    ch := make(chan result, 1) // Buffered: send won't block even if nobody receives
    go func() {
        select {
        case ch <- fetchFromDB():
        case <-ctx.Done():
            return
        }
    }()
    select {
    case r := <-ch:
        handle(r)
    case <-ctx.Done():
        return
    }
}
```

### Leak 2: Unclosed Resources 🟡

```go
// BUG: HTTP response body not closed → connection leak
resp, _ := http.Get("https://api.example.com/data")
// QUÊN defer resp.Body.Close()

// FIX: Luôn close
resp, err := http.Get("https://api.example.com/data")
if err != nil { return err }
defer resp.Body.Close()
```

### Leak 3: Slice Capacity Retention 🟡

```go
// BUG: Sub-slice giữ reference to toàn bộ backing array
func getFirstTen(data []byte) []byte {
    return data[:10] // Backing array (có thể 1MB) vẫn không được GC!
}

// FIX: Copy vào slice mới
func getFirstTen(data []byte) []byte {
    result := make([]byte, 10)
    copy(result, data[:10])
    return result // Original backing array có thể bị GC
}
```

### Leak 4: String Interning / Substring 🟡

```go
// BUG: Tương tự slice — substring giữ ref tới original string
var cache map[string]int

func processLog(line string) { // line = very long string (1KB)
    key := line[:10] // key vẫn share underlying memory với line!
    cache[key] = 1   // line (1KB) không bao giờ bị GC
}

// FIX: strings.Clone (Go 1.20+) hoặc copy
func processLog(line string) {
    key := strings.Clone(line[:10]) // Tạo copy riêng
    cache[key] = 1                  // line có thể bị GC
}
```

### Leak 5: Forgotten Timers/Tickers 🟡

```go
// BUG: time.After tạo Timer mới mỗi iteration — không bao giờ được GC
// cho đến khi fire (leaked nếu select exits sớm)
for {
    select {
    case msg := <-ch:
        handle(msg)
    case <-time.After(5 * time.Second): // Timer leak mỗi loop!
        return
    }
}

// FIX: Reuse timer
timer := time.NewTimer(5 * time.Second)
defer timer.Stop()
for {
    if !timer.Stop() { <-timer.C }
    timer.Reset(5 * time.Second)
    select {
    case msg := <-ch:
        handle(msg)
    case <-timer.C:
        return
    }
}
```

**Ticker leak:** Luôn `defer ticker.Stop()` — nếu không, ticker goroutine chạy mãi.

### Leak 6: Global Variables Accumulating 🟡

```go
// BUG: Cache grow forever
var globalCache = make(map[string][]byte)

func handleRequest(key string, data []byte) {
    globalCache[key] = data // Never evicted → unbounded growth!
}

// FIX: LRU cache với size limit, TTL, hoặc periodic cleanup
```

### 🟡 Q: Cách detect memory leaks?

**A:**

```bash
# 1. Monitor goroutine count — should be stable
runtime.NumGoroutine()

# 2. Diff heap profiles (shows ONLY growth → pinpoints leaks)
go tool pprof -base heap1.prof heap2.prof

# 3. Export runtime.MemStats: HeapAlloc, HeapInuse, NumGoroutine

# 4. goleak for tests (go.uber.org/goleak)
func TestNoLeak(t *testing.T) {
    defer goleak.VerifyNone(t)
    // ... test code
}
```

---

## 8. sync.Pool

### 🟡 Q: sync.Pool hoạt động thế nào? Khi nào nên dùng?

**A:**

`sync.Pool` là **temporary object cache** — cho phép reuse allocated objects thay vì allocate mới rồi để GC thu hồi.

**Internal structure:**

```
┌─────────────────────────────────────────────┐
│                sync.Pool                     │
│                                             │
│  Per-P:  [private slot] + [shared list]     │
│  P0: ┌────────┐ ┌────────────────────┐      │
│      │1 object│ │ [obj] [obj] [obj]  │      │
│      └────────┘ └────────────────────┘      │
│  P1: ┌────────┐ ┌────────────────────┐      │
│      │1 object│ │ [obj] [obj]        │      │
│      └────────┘ └────────────────────┘      │
│                                             │
│  ⚠️  GC clears ALL pool objects each cycle!  │
└─────────────────────────────────────────────┘
```

**Get/Put flow:**
1. `Get()`: private slot → local shared list → steal from other P's shared → call `New()`
2. `Put()`: store in private slot (nếu trống) → push to local shared list

**Đặc tính quan trọng:**
- **GC sẽ xóa sạch** pool mỗi GC cycle — KHÔNG dùng làm long-term cache
- **No size limit** — pool có thể grow unbounded giữa các GC cycles
- **Thread-safe** — designed cho concurrent access

### 🟡 Q: Cho ví dụ thực tế dùng sync.Pool.

**A:**

**Pattern 1: bytes.Buffer pool**

```go
var bufPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func processData(data []byte) string {
    buf := bufPool.Get().(*bytes.Buffer)
    defer func() {
        buf.Reset() // QUAN TRỌNG: reset trước khi put lại
        bufPool.Put(buf)
    }()
    
    buf.WriteString("prefix:")
    buf.Write(data)
    buf.WriteString(":suffix")
    return buf.String()
}
```

**Pitfalls:**

```go
// ❌ Pool as cache: objects cleared every GC → unreliable
// ❌ Forget reset: next Get() sees stale data
// ❌ Pool tiny objects: overhead > benefit (interface boxing, locking)
// ✅ Only use when allocation cost significantly exceeds pool overhead
```

---

## 9. Memory Optimization Techniques

### 🟡 Q: Struct field ordering ảnh hưởng memory thế nào?

**A:**

CPU yêu cầu **alignment** — fields phải bắt đầu tại address chia hết cho size. Compiler thêm **padding**.

```go
// BAD: 24 bytes (padding waste)
type Bad struct {
    a bool   // 1 + 7 padding
    b int64  // 8
    c bool   // 1 + 7 padding
}

// GOOD: 16 bytes — sort fields large→small
type Good struct {
    b int64  // 8
    a bool   // 1
    c bool   // 1 + 6 end padding
}
```

Kiểm tra: `go vet -fieldalignment ./...`

### 🟡 Q: Những kỹ thuật optimization phổ biến khác?

**A:**

**1. Pre-allocate slices và maps:**

```go
// ❌ Grow slice dynamically — multiple allocations + copies
var items []Item
for _, raw := range rawData {
    items = append(items, parse(raw)) // May trigger 5-10 reallocations
}

// ✅ Pre-allocate with known size
items := make([]Item, 0, len(rawData)) // 1 allocation
for _, raw := range rawData {
    items = append(items, parse(raw))
}

// ✅ Pre-allocate map
m := make(map[string]int, expectedSize)
```

**2. strings.Builder cho string concatenation:**

```go
// ❌ String concatenation — O(n²) allocations
s := ""
for _, item := range items {
    s += item.Name + ", " // New string allocation each iteration!
}

// ✅ strings.Builder — amortized O(n)
var b strings.Builder
b.Grow(estimatedSize) // Optional: pre-allocate
for _, item := range items {
    b.WriteString(item.Name)
    b.WriteString(", ")
}
result := b.String()
```

**3. Reuse buffers (caller provides destination):**

```go
// ❌ Allocate on every call
func process(data []byte) []byte {
    result := make([]byte, len(data))
    // ... transform
    return result
}

// ✅ Caller provides buffer
func process(dst, src []byte) []byte {
    dst = dst[:len(src)]
    // ... transform src into dst
    return dst
}
```

**4. Avoid boxing vào interface khi không cần:** `fmt.Sprintf("count: %d", count)` causes `count` to escape (boxed into `interface{}`). Prefer `strconv.Itoa(count)` — no heap allocation.

**5. Pointer vs Value receiver:** Value receiver cho small structs tránh heap escape; pointer receiver cho large structs tránh copy overhead.

### 🔴 Q: Arena allocator concept trong Go là gì?

**A:**

**Arena** (experimental, Go 1.20): Allocate nhiều objects vào cùng 1 vùng memory, rồi **free tất cả cùng lúc** thay vì để GC scan từng object.

```
Traditional GC:                    Arena:
┌───┐ ┌───┐ ┌───┐ ┌───┐          ┌────────────────────┐
│obj│ │obj│ │obj│ │obj│          │ obj obj obj obj     │
└───┘ └───┘ └───┘ └───┘          └────────────────────┘
  ↑     ↑     ↑     ↑              ↑
  GC scans each individually        Free entire arena at once
```

**Use case:** Request-scoped allocations — allocate tất cả objects cho 1 HTTP request vào arena, free toàn bộ khi request kết thúc. Giảm GC pressure cho high-throughput services. API vẫn experimental — nhắc trong interview để thể hiện hiểu biết sâu.

---

## 10. Cheat Sheet & Interview Questions

### Memory Optimization Checklist

```
┌──────────────────────────────────────────────────────────┐
│              Memory Optimization Checklist                │
│                                                          │
│  □ Run escape analysis: go build -gcflags="-m"           │
│  □ Profile heap: go tool pprof -http=:8080 heap.prof     │
│  □ Check GC trace: GODEBUG=gctrace=1                     │
│  □ Pre-allocate slices/maps with known capacity           │
│  □ Use sync.Pool for hot-path allocations                │
│  □ Reuse buffers (bytes.Buffer, []byte)                  │
│  □ Use strings.Builder for string concatenation           │
│  □ Order struct fields large→small (reduce padding)       │
│  □ Avoid unnecessary interface conversions                │
│  □ Close all resources (resp.Body, files, DB conns)       │
│  □ Copy sub-slices to release backing array               │
│  □ Use context cancellation to prevent goroutine leaks    │
│  □ Stop all timers/tickers when done                     │
│  □ Set GOMEMLIMIT for containerized workloads             │
│  □ Benchmark with -benchmem: go test -bench=. -benchmem  │
└──────────────────────────────────────────────────────────┘
```

### Profiling Workflow

```
1. Identify → High memory? (heap inuse_space) | High GC? (gctrace + alloc_space)
              Goroutine leak? (goroutine profile) | Lock contention? (mutex/block)

2. Capture  → Production: net/http/pprof | Benchmark: go test -memprofile
              Ad-hoc: runtime/pprof.WriteHeapProfile()

3. Analyze  → go tool pprof -http=:8080 profile.prof
              Flame graph → hottest paths | top/list → drill into functions
              -base flag → diff two profiles to find growth

4. Verify   → Re-benchmark, compare B/op and allocs/op, re-profile
```

### Interview Questions by Difficulty

**🟢 Junior:**

1. **Q: Stack và heap khác nhau thế nào?**
   A: Stack: per-goroutine, auto-free, nhanh. Heap: shared, GC-managed, cho vars escape khỏi function.

2. **Q: `go build -gcflags="-m"` dùng để làm gì?**
   A: Escape analysis — cho biết biến nào allocate stack vs heap và lý do.

3. **Q: Tránh memory leak khi dùng HTTP client?**
   A: Luôn `defer resp.Body.Close()`. Drain body nếu không đọc hết.

**🟡 Middle:**

4. **Q: GOGC=50 vs GOGC=200?**
   A: 50 → GC khi heap +50% → ít memory, nhiều CPU. 200 → GC khi heap +200% → nhiều memory, ít CPU.

5. **Q: `time.After` trong loop gây leak sao?**
   A: Mỗi call tạo Timer mới, không GC đến khi fire. Loop nhanh → nghìn Timers leaked. Fix: reuse `time.NewTimer` + `Reset()`.

6. **Q: sync.Pool objects có bị GC không?**
   A: Có, GC xóa sạch pool mỗi cycle. Chỉ dùng giảm allocation pressure, không làm cache.

7. **Q: Sub-slice gây memory leak?**
   A: Có — share backing array. Giữ sub-slice nhỏ → toàn bộ array không GC. Fix: `copy()` sang slice mới.

**🔴 Senior:**

8. **Q: Write barrier trong Go GC?**
   A: Ngăn lost object bug khi mutator ghi pointer từ black→white object. Go dùng hybrid write barrier (Dijkstra + Yuasa) từ 1.8.

9. **Q: Kiến trúc memory allocator 3 tầng?**
   A: mcache (per-P, no lock) → mcentral (per-size-class, mutex) → mheap (global mutex) → OS. Tiny allocator cho <16B. Large >32KB direct từ mheap.

10. **Q: K8s pod bị OOM killed — debug?**
    A: Set GOMEMLIMIT < pod limit. Capture heap profiles, compare với `-base`. Check goroutine count. Check GOGC.

11. **Q: Khi nào tắt GC (GOGC=off)?**
    A: Hầu như không. Chỉ short-lived batch jobs biết trước memory. Kết hợp GOMEMLIMIT.

12. **Q: GC phases nào STW?**
    A: Mark Setup (~10-30μs) và Mark Termination (~10-30μs). Concurrent Mark + Sweep không STW. Tổng < 100μs trên Go 1.18+.

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: How does Go decide whether a variable is allocated on the stack or the heap? / Go quyết định allocate biến lên stack hay heap như thế nào? 🟡 Mid

**A:** Go uses **escape analysis** at compile time to determine allocation. A variable "escapes" to the heap when: (1) its address is returned from a function; (2) it's stored in a heap-allocated struct; (3) it's assigned to an interface (boxing); (4) it's too large for the stack (typically >8KB); (5) its size is not known at compile time (e.g., dynamic slices). Stack allocation is preferred — it's faster (no GC involvement, no lock, just pointer bump) and automatically freed when the function returns. Run `go build -gcflags='-m'` to see escape analysis output.

Vietnamese explanation: Compiler chạy escape analysis để tối ưu allocation. **Stack rẻ hơn heap rất nhiều**: stack chỉ cần tăng/giảm stack pointer, không cần GC scan. Heap cần GC theo dõi và thu dọn. Một lỗi phổ biến là trả về pointer đến local variable — variable bắt buộc escape lên heap. Với interface boxing (`var i interface{} = v`), giá trị cũng thường escape. Dùng `go build -gcflags='-m -m'` để xem chi tiết lý do escape — đây là kỹ năng quan trọng khi optimize performance.

---

### Q: Explain Go's tri-color mark-and-sweep GC algorithm. What problem does the write barrier solve? / Giải thích thuật toán GC tri-color mark-and-sweep. Write barrier giải quyết vấn đề gì? 🔴 Senior

**A:** Go's GC uses **tri-color marking**: all objects start White (unreachable), the GC colors them Grey (reachable, children not scanned) then Black (reachable, children scanned). At the end, White objects are garbage. The challenge is that the mutator (application) runs concurrently with the GC. A **write barrier** intercepts pointer writes during the concurrent mark phase to prevent the "lost object" problem: if a black object gains a pointer to a white object and the grey object loses its reference, the white object would be incorrectly collected. Go uses a **hybrid write barrier** (combining Dijkstra insertion barrier + Yuasa deletion barrier) since Go 1.14.

Vietnamese explanation: Thuật toán 3 màu cho phép GC chạy **concurrent** với application, giảm STW xuống còn vài chục microseconds thay vì milliseconds. Vấn đề: khi mutator ghi pointer đồng thời với GC scanning, có thể xảy ra "lost object" — object reachable bị thu hồi nhầm. Write barrier là "hook" được inject vào mọi pointer write để thông báo cho GC. Trade-off: write barrier thêm latency nhỏ vào mọi pointer assignment trong mark phase, nhưng đánh đổi này xứng đáng để tránh STW dài.

---

### Q: What is GOGC and GOMEMLIMIT? How do you tune them for a latency-sensitive service? / GOGC và GOMEMLIMIT là gì? Tune thế nào cho latency-sensitive service? 🔴 Senior

**A:** `GOGC` (default: 100) controls when GC triggers: GC runs when heap size reaches `(1 + GOGC/100) * live_heap`. Setting `GOGC=200` halves GC frequency but doubles peak memory. Setting `GOGC=off` disables GC entirely — only safe for short-lived batch jobs. `GOMEMLIMIT` (Go 1.19+) is an absolute memory ceiling — when the process approaches this limit, GC becomes more aggressive regardless of GOGC. The recommended pattern for latency-sensitive services: set `GOMEMLIMIT` to ~90% of container memory limit, keep `GOGC` at default (100) or increase slightly (150-200) to reduce GC frequency.

Vietnamese explanation: GOGC là percentage-based trigger — tăng GOGC giảm tần suất GC nhưng tăng memory. GOMEMLIMIT mới hơn và thực dụng hơn cho containerized environments: nó đảm bảo process không bị OOM killed bởi Kubernetes. Pattern thường dùng: `GOMEMLIMIT=1800MiB` khi pod limit là 2GiB. Không nên set GOGC quá cao mà không có GOMEMLIMIT — nếu traffic spike, heap có thể tăng không giới hạn cho đến khi OOM. Với latency-sensitive service (ví dụ: payment API), nên chạy `GOGC=50` để GC thường xuyên hơn, heap nhỏ hơn, latency spike thấp hơn.

---

### Q: How do you use pprof to find a memory leak in a Go service? / Dùng pprof thế nào để tìm memory leak trong Go service? 🟡 Mid

**A:** Steps: (1) Enable pprof endpoint: import `_ "net/http/pprof"` and start an HTTP server. (2) Capture baseline heap profile: `go tool pprof http://host:6060/debug/pprof/heap`. (3) Wait for traffic/time to pass. (4) Capture a second profile. (5) Compare with `pprof -base base.prof current.prof` to see what allocated memory grew. Key pprof views: `alloc_objects` (total allocations), `inuse_objects` (currently live), `alloc_space` (total bytes allocated), `inuse_space` (currently live bytes). Focus on `inuse_space` for leaks. The `top`, `tree`, and `web` commands show call stacks responsible for allocations.

Vietnamese explanation: Memory leak trong Go thường do: (1) goroutine leak — goroutine blocked mãi, giữ reference; (2) global map không được clear; (3) channel không được close; (4) slice giữ reference đến large backing array. Workflow chuẩn: capture 2 heap profiles cách nhau vài phút, so sánh bằng `-base` để thấy net growth. Nếu `inuse_space` tăng đều theo thời gian → leak. `go tool pprof -http=:8080` mở web UI với flamegraph rất trực quan. Đây là kỹ năng thực chiến quan trọng ở Senior level.

---

### Q: What is the difference between `sync.Pool` and regular heap allocation? When should you use it? / `sync.Pool` khác heap allocation thường thế nào? Khi nào nên dùng? 🔴 Senior

**A:** `sync.Pool` is a thread-safe cache of temporary objects that reduces GC pressure by reusing allocated objects instead of discarding them. Objects in the pool are freed during GC — there is **no guarantee** an object will still be there after the next GC. This makes it unsuitable for persistent state. Use cases: byte buffers (e.g., `bytes.Buffer`), JSON encoders/decoders, HTTP request/response objects in high-throughput paths. The standard library uses `sync.Pool` extensively in `fmt`, `encoding/json`, and `net/http`. Avoid using it for objects with complex state that needs resetting — you must reset the object before returning it to the pool.

Vietnamese explanation: `sync.Pool` giải quyết vấn đề GC pressure trong high-throughput service. Thay vì allocate mới và GC sau mỗi request, pool tái sử dụng objects. Điểm quan trọng: **pool bị clear sau mỗi GC cycle**, nên không dùng cho objects cần tồn tại lâu dài. Pattern chuẩn: `Get()` lấy object → dùng → **reset state** → `Put()` trả lại. Nếu quên reset, object cũ có thể lẫn data của request trước — đây là security bug nghiêm trọng. `sync.Pool` thích hợp nhất cho `[]byte` buffers trong parsing/serialization hot paths.
