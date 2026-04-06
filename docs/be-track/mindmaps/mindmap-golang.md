# Go (Golang) Mind Map - Sơ Đồ Tổng Hợp

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp tất cả kiến thức Golang để review nhanh trước phỏng vấn

---

## Go Complete Mind Map

```
                                    ┌──────────────────────────────────────────────────────────────────┐
                                    │                         GOLANG CORE                                │
                                    └──────────────────────────────────────────────────────────────────┘
                                                                │
             ┌──────────────────┬───────────────────────────────┼───────────────────────────┬──────────────────┐
             │                  │                               │                           │                  │
     ┌───────▼──────┐  ┌────────▼───────┐             ┌────────▼───────┐         ┌─────────▼──────┐  ┌────────▼───────┐
     │   LANGUAGE   │  │  CONCURRENCY   │             │   MEMORY &     │         │    TESTING &   │  │   ADVANCED     │
     │ FUNDAMENTALS │  │                │             │      GC        │         │   PROFILING    │  │   PATTERNS     │
     └───────┬──────┘  └────────┬───────┘             └────────┬───────┘         └─────────┬──────┘  └────────┬───────┘
             │                  │                               │                           │                  │
   ┌─────────┼──────┐    ┌──────┼──────┐               ┌───────┼───────┐           ┌───────┼───────┐   ┌──────┼──────┐
   │         │      │    │      │      │               │       │       │           │       │       │   │      │      │
Types    Structs  Iface  Gorout Chan  Sync           Stack   Heap    GC         Unit  Bench  pprof  Gen  Reflect Embed
```

---

## 1. Language Fundamentals / Kiến Thức Nền Tảng

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              LANGUAGE FUNDAMENTALS                                    │
├──────────────────────┬──────────────────────┬──────────────────────┬────────────────┤
│      TYPES           │      STRUCTS         │     INTERFACES       │ ERROR HANDLING │
├──────────────────────┼──────────────────────┼──────────────────────┼────────────────┤
│                      │                      │                      │                │
│  Basic Types:        │  type Person struct{ │  type Writer interface│ • errors.New() │
│  • bool              │    Name string       │    Write([]byte)(int,│ • fmt.Errorf() │
│  • int/int8..int64   │    Age  int          │      error)          │ • %w wrapping  │
│  • float32/float64   │  }                   │  }                   │                │
│  • string            │                      │                      │ Custom errors: │
│  • byte (uint8)      │  Methods:            │  Implicit impl:      │  type ErrNotFnd│
│  • rune (int32)      │  func (p Person)     │  Any type with the   │    struct{ ID }│
│                      │    Greet() string    │  right methods satis-│  func (e) Err()│
│  Composite:          │                      │  fies the interface  │    string      │
│  • array [n]T        │  Value vs Pointer    │                      │                │
│  • slice  []T        │  receivers:          │  Empty interface:    │ Sentinel:      │
│  • map[K]V           │  • Value: copy       │  interface{} / any   │ • io.EOF       │
│  • channel chan T     │  • Pointer: mutate   │                      │ • sql.ErrNoRows│
│                      │                      │  Type assertion:     │                │
│  Zero values:        │  Embedding:          │  v, ok := x.(T)      │ errors.Is()    │
│  • 0, false, ""      │  type Employee struct│                      │ errors.As()    │
│  • nil for ptrs      │    Person  ← embed   │  Type switch:        │                │
│                      │    Dept string       │  switch v := x.(type)│ panic/recover: │
│  Type assertion:     │  }                   │  case int:           │ • last resort  │
│  var x interface{}   │                      │  case string:        │ • use in defer │
│  n := x.(int)        │  Struct tags:        │  default:            │ • catch panics │
│                      │  `json:"name"`       │                      │                │
└──────────────────────┴──────────────────────┴──────────────────────┴────────────────┘
```

---

## 2. Concurrency / Lập Trình Đồng Thời

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                  CONCURRENCY                                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────┐    ┌──────────────────────────┐                         │
│  │       GOROUTINES        │    │         CHANNELS          │                         │
│  ├─────────────────────────┤    ├──────────────────────────┤                         │
│  │                         │    │                          │                         │
│  │  go func() {            │    │  ch := make(chan int)     │                         │
│  │      // runs            │    │  ch := make(chan int, 5)  │  ← buffered             │
│  │      // concurrently    │    │                          │                         │
│  │  }()                    │    │  Send:    ch <- value    │                         │
│  │                         │    │  Receive: v := <-ch      │                         │
│  │  Lightweight: ~2KB      │    │  Close:   close(ch)      │                         │
│  │  M:N scheduling         │    │                          │                         │
│  │  GOMAXPROCS controls    │    │  Directional:            │                         │
│  │  OS threads             │    │  func f(in <-chan int,   │                         │
│  │                         │    │         out chan<- int)  │                         │
│  │  Lifecycle: runs until  │    │                          │                         │
│  │  function returns       │    │  Range over channel:     │                         │
│  │                         │    │  for v := range ch { }  │                         │
│  └─────────────────────────┘    └──────────────────────────┘                         │
│                                                                                       │
│  ┌───────────────────────────────────────────────────────────────────────────────┐   │
│  │                           SYNC PACKAGE                                          │   │
│  ├────────────────┬──────────────────┬───────────────────┬───────────────────────┤   │
│  │   sync.Mutex   │   sync.RWMutex   │   sync.WaitGroup  │    sync.Once          │   │
│  ├────────────────┼──────────────────┼───────────────────┼───────────────────────┤   │
│  │ var mu sync.   │ var rw sync.     │ var wg sync.      │ var once sync.Once    │   │
│  │   Mutex        │   RWMutex        │   WaitGroup        │                       │   │
│  │                │                  │                   │ once.Do(func() {      │   │
│  │ mu.Lock()      │ rw.RLock()  ← R  │ wg.Add(n)         │   // runs once        │   │
│  │ // critical    │ rw.RUnlock()     │ go func() {       │ })                    │   │
│  │ mu.Unlock()    │                  │   defer wg.Done() │                       │   │
│  │                │ rw.Lock()   ← W  │ }()               │ Use: singleton init,  │   │
│  │ defer mu.      │ rw.Unlock()      │ wg.Wait()         │ lazy initialization   │   │
│  │   Unlock()     │                  │                   │                       │   │
│  └────────────────┴──────────────────┴───────────────────┴───────────────────────┘   │
│                                                                                       │
│  ┌───────────────────────────────────────────────────────────────────────────────┐   │
│  │                            CONTEXT PACKAGE                                      │   │
│  ├─────────────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                                 │  │
│  │  context.Background()           ← root context                                 │  │
│  │  context.TODO()                 ← placeholder                                  │  │
│  │  context.WithCancel(parent)     → ctx, cancel; defer cancel()                  │  │
│  │  context.WithTimeout(parent, d) → ctx, cancel; cancels after duration          │  │
│  │  context.WithDeadline(parent,t) → ctx, cancel; cancels at absolute time        │  │
│  │  context.WithValue(parent,k,v)  → carries request-scoped values                │  │
│  │                                                                                 │  │
│  │  Best practices:                                                                │  │
│  │  • Always pass ctx as first parameter                                          │  │
│  │  • Check ctx.Done() in long-running operations                                 │  │
│  │  • Don't store context in struct fields                                        │  │
│  │                                                                                 │  │
│  └─────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                       │
│  ┌───────────────────────────────────────────────────────────────────────────────┐   │
│  │                              SELECT STATEMENT                                   │   │
│  ├─────────────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                                 │  │
│  │  select {                                                                       │  │
│  │      case v := <-ch1:   // receive from ch1                                    │  │
│  │          process(v)                                                             │  │
│  │      case ch2 <- val:   // send to ch2                                         │  │
│  │          sent()                                                                 │  │
│  │      case <-ctx.Done(): // cancellation                                        │  │
│  │          return ctx.Err()                                                       │  │
│  │      default:           // non-blocking                                        │  │
│  │          // do other work                                                       │  │
│  │  }                                                                              │  │
│  │                                                                                 │  │
│  └─────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                       │
│  CONCURRENCY PATTERNS:                                                               │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────────────┐   │
│  │  Worker Pool  │ │   Fan-Out /   │ │   Pipeline    │ │   Semaphore via       │   │
│  │               │ │   Fan-In      │ │               │ │   Buffered Channel    │   │
│  │ Create N      │ │ Distribute    │ │ Stage1 →      │ │ sem := make(chan      │   │
│  │ goroutines    │ │ work across   │ │ Stage2 →      │ │   struct{}, maxN)     │   │
│  │ reading from  │ │ goroutines,   │ │ Stage3        │ │ sem <- struct{}{}     │   │
│  │ jobs channel  │ │ merge results │ │               │ │ defer <-sem           │   │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Memory & Garbage Collection / Bộ Nhớ & GC

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              MEMORY & GC                                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌──────────────────────────────┐    ┌──────────────────────────────────────────┐   │
│  │          STACK               │    │                  HEAP                     │   │
│  ├──────────────────────────────┤    ├──────────────────────────────────────────┤   │
│  │ • Fixed size per goroutine   │    │ • Dynamically allocated                  │   │
│  │ • Starts ~8KB, can grow      │    │ • GC managed                             │   │
│  │ • Local vars, function args  │    │ • Shared across goroutines               │   │
│  │ • Very fast allocation       │    │ • Objects that escape to heap            │   │
│  │ • Auto cleanup on return     │    │                                          │   │
│  └──────────────────────────────┘    └──────────────────────────────────────────┘   │
│                                                                                       │
│  ESCAPE ANALYSIS:                                                                    │
│  go build -gcflags="-m" ./... ← shows what escapes to heap                          │
│                                                                                       │
│  Escapes to heap when:                                                               │
│  • Pointer returned from function                                                    │
│  • Variable too large for stack                                                      │
│  • Stored in interface{}                                                             │
│  • Sent on channel                                                                   │
│                                                                                       │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │                        GARBAGE COLLECTOR                                       │   │
│  ├──────────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                                │   │
│  │  Algorithm: Tri-color concurrent mark & sweep                                 │   │
│  │                                                                                │   │
│  │  WHITE ──unreachable──▶ Collected                                             │   │
│  │  GREY  ──being scanned──▶ to BLACK                                            │   │
│  │  BLACK ──reachable, scanned──▶ Kept                                           │   │
│  │                                                                                │   │
│  │  STW (Stop-The-World): very short pauses (< 1ms typical)                      │   │
│  │  GOGC env var: controls GC frequency (default 100 = 2x memory growth)         │   │
│  │  GOMEMLIMIT: soft memory limit (Go 1.19+)                                     │   │
│  │                                                                                │   │
│  │  Tuning:                                                                       │   │
│  │  • GOGC=off      ← disable GC (manual runtime.GC())                           │   │
│  │  • GOGC=200      ← GC less often, more memory, less CPU                       │   │
│  │  • sync.Pool     ← reuse objects, reduce allocations                          │   │
│  │                                                                                │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
│  MEMORY OPTIMIZATION:                                                                │
│  • Use sync.Pool for frequent allocations                                           │
│  • Preallocate slices: make([]T, 0, capacity)                                       │
│  • Avoid string concatenation in loops → use strings.Builder                        │
│  • Reuse byte slices with bytes.Buffer                                               │
│  • Avoid interface{} boxing of small types                                           │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Testing & Profiling / Kiểm Tra & Phân Tích

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                             TESTING & PROFILING                                       │
├──────────────────────────────┬──────────────────────────────┬────────────────────────┤
│       UNIT TESTING           │       BENCHMARKS             │       PROFILING        │
├──────────────────────────────┼──────────────────────────────┼────────────────────────┤
│                              │                              │                        │
│ func TestAdd(t *testing.T) { │ func BenchmarkAdd(           │ pprof:                 │
│   got := Add(1, 2)           │   b *testing.B) {            │                        │
│   want := 3                  │   for i := 0; i < b.N; i++ {│ import _ "net/http/    │
│   if got != want {           │     Add(1, 2)                │   pprof"               │
│     t.Errorf("got %d,        │   }                          │                        │
│       want %d", got, want)   │ }                            │ go tool pprof          │
│   }                          │                              │   cpu.prof             │
│ }                            │ go test -bench=.             │                        │
│                              │ go test -bench=. -benchmem   │ Profiles:              │
│ Table tests:                 │                              │ • CPU profile          │
│ tests := []struct{           │ BENCHMARK REPORT:            │ • Memory profile       │
│   input int                  │ BenchmarkAdd-8   │ • Goroutine profile    │
│   want  int                  │   1000000        │ • Block profile        │
│ }{                           │   1.23 ns/op     │ • Mutex profile        │
│   {1, 2},                    │   0 B/op         │                        │
│   {-1, 0},                   │   0 allocs/op    │ go test -cpuprofile    │
│ }                            │                  │   cpu.out              │
│                              │ -benchtime=10s   │ go test -memprofile    │
│ go test ./...                │ -count=5         │   mem.out              │
│ go test -v                   │ -benchmem        │                        │
│ go test -run TestAdd         │                  │ trace:                 │
│ go test -race                │                  │ go test -trace=t.out   │
│ go test -cover               │                  │ go tool trace t.out    │
│                              │                  │                        │
└──────────────────────────────┴──────────────────┴────────────────────────┘
```

---

## 5. Data Structures in Go / Cấu Trúc Dữ Liệu

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           DATA STRUCTURES IN GO                                       │
├──────────────────────┬─────────────────────────┬─────────────────────────────────────┤
│       SLICES         │         MAPS            │           CHANNELS                  │
├──────────────────────┼─────────────────────────┼─────────────────────────────────────┤
│                      │                         │                                     │
│ Header: {ptr, len,   │ Hash map internally     │ [ptr to hchan struct]               │
│          cap}        │                         │                                     │
│                      │ m := map[K]V{}           │ Unbuffered: sync rendez-vous        │
│ make([]T, len, cap)  │ m := make(map[K]V, hint)│ Buffered: async up to cap           │
│ append(s, elems...)  │                         │                                     │
│                      │ v, ok := m[key]         │ Nil channel:                        │
│ Gotchas:             │ delete(m, key)           │ • Send: blocks forever              │
│ • Shares underlying  │                         │ • Receive: blocks forever           │
│   array after append │ Not safe for concurrent │ • Close: panic                      │
│ • copy() for true    │ use → sync.Map or       │                                     │
│   independent copy   │ mutex-protected map     │ Closed channel:                     │
│                      │                         │ • Send: panic                       │
│ s2 := make([]T, len) │ Iteration order:        │ • Receive: returns zero + false     │
│ copy(s2, s1)         │ non-deterministic!      │ • Range: exits loop                 │
│                      │                         │                                     │
├──────────────────────┴─────────────────────────┴─────────────────────────────────────┤
│                         COMMON PATTERNS                                               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  Stack (using slice):          Queue (using slice):                                  │
│  push: s = append(s, v)        enqueue: q = append(q, v)                            │
│  pop:  v, s = s[len-1], s[:n-1]dequeue: v, q = q[0], q[1:]                         │
│                                                                                       │
│  Set (using map):              Heap (container/heap):                                │
│  set := map[T]struct{}{}       type IntHeap []int                                   │
│  set[v] = struct{}{}           func (h IntHeap) Len() int                           │
│  _, ok := set[v]               func (h IntHeap) Less(i,j int) bool                  │
│                                func (h IntHeap) Swap(i,j int)                        │
│                                heap.Init(&h); heap.Push(&h, v)                      │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Advanced Patterns / Mẫu Nâng Cao

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              ADVANCED PATTERNS                                        │
├──────────────────────────────────┬──────────────────────────────────────────────────┤
│            GENERICS              │              REFLECTION                           │
├──────────────────────────────────┼──────────────────────────────────────────────────┤
│                                  │                                                  │
│  // Type parameter               │  import "reflect"                                │
│  func Map[T, U any](             │                                                  │
│    s []T, f func(T) U,           │  t := reflect.TypeOf(x)   // type info          │
│  ) []U {                         │  v := reflect.ValueOf(x)  // value info         │
│    result := make([]U, len(s))   │                                                  │
│    for i, v := range s {         │  t.Kind()  // int, string, struct...            │
│      result[i] = f(v)            │  t.Name()  // type name                         │
│    }                             │  t.NumField()                                    │
│    return result                 │  t.Field(i).Name                                 │
│  }                               │                                                  │
│                                  │  // Modify value:                                │
│  // Type constraints:            │  v.Elem().FieldByName("X").SetInt(42)            │
│  type Number interface {         │                                                  │
│    int | float64 | float32       │  Use cases:                                      │
│  }                               │  • JSON marshaling/unmarshaling                 │
│                                  │  • ORM field mapping                             │
│  // Comparable constraint:       │  • Dependency injection                         │
│  func Contains[T comparable](    │  • Testing utilities                             │
│    s []T, v T) bool              │                                                  │
│                                  │  Performance: reflection is slow!               │
│  // interface constraint:        │  Cache reflect.Type when possible               │
│  type Stringer interface {       │                                                  │
│    String() string               │                                                  │
│  }                               │                                                  │
│                                  │                                                  │
├──────────────────────────────────┴──────────────────────────────────────────────────┤
│                               EMBEDDING                                               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  // Struct embedding (composition over inheritance)                                  │
│  type Animal struct {                                                                │
│      Name string                                                                     │
│  }                                                                                   │
│  func (a Animal) Speak() string { return a.Name }                                   │
│                                                                                       │
│  type Dog struct {                                                                   │
│      Animal          ← promoted fields and methods                                  │
│      Breed string                                                                    │
│  }                                                                                   │
│                                                                                       │
│  d := Dog{Animal{"Rex"}, "Lab"}                                                     │
│  d.Speak() // calls Animal.Speak() → "Rex"                                          │
│  d.Name    // promoted field access                                                  │
│                                                                                       │
│  // Interface embedding                                                               │
│  type ReadWriter interface {                                                         │
│      io.Reader     ← embeds Reader                                                  │
│      io.Writer     ← embeds Writer                                                  │
│  }                                                                                   │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Quick Reference / Tham Khảo Nhanh

| Topic         | Key Concept                         | Common Interview Question                 |
| ------------- | ----------------------------------- | ----------------------------------------- |
| Goroutines    | Lightweight threads, M:N scheduling | Goroutine vs OS thread                    |
| Channels      | CSP-style communication             | Buffered vs unbuffered channel            |
| select        | Non-blocking multi-channel ops      | How to implement timeout                  |
| defer         | Run on function exit, LIFO order    | defer in loops (gotcha)                   |
| panic/recover | Last resort error handling          | When to use panic                         |
| interface     | Implicit satisfaction               | nil interface vs interface with nil value |
| sync.Mutex    | Mutual exclusion                    | Deadlock scenarios                        |
| context       | Cancellation propagation            | Why pass ctx as first param               |
| generics      | Type-safe polymorphism              | Constraints and type sets                 |
| GC            | Tri-color mark & sweep              | How to reduce GC pressure                 |

---

## 8. Go Gotchas - Lỗi Thường Gặp

```go
// 1. Loop variable capture (Go < 1.22)
for i := 0; i < 3; i++ {
    go func() { fmt.Println(i) }()  // prints 3,3,3 NOT 0,1,2
}
// Fix: pass i as arg or use i := i

// 2. nil interface vs typed nil
var p *Person = nil
var i interface{} = p
fmt.Println(i == nil)  // false! interface has type info

// 3. Slice gotcha: shared backing array
a := []int{1, 2, 3}
b := a[:2]
b[0] = 99  // also modifies a!
// Fix: copy(c, a[:2])

// 4. Map returns zero value, not error
m := map[string]int{}
v := m["missing"]  // v = 0, no error
v, ok := m["missing"]  // ok = false

// 5. defer in loop
for _, f := range files {
    defer f.Close()  // all deferred until function returns!
}
// Fix: wrap in closure func() { defer f.Close(); process(f) }()
```

---

> **Sử dụng:** In ra hoặc lưu file này để review nhanh trước phỏng vấn
