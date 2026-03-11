# Data Structures in Go - Interview Prep

> **Target:** Go Backend Developer (Middle/Senior) — Zalo, Grab, Axon, Employment Hero, Microsoft, Google
>
> **Format:** Q&A | English headings + Vietnamese explanations | Full Go code | Difficulty tags

---

## 1. Array & Slice


## Câu Hỏi Phỏng Vấn / Interview Q&A
### Q1: Array vs Slice - what is the fundamental difference? 🟢 🟢 [Junior]

**A:** Array có kích thước cố định, là value type (copy toàn bộ khi gán/truyền vào function). Slice là reference type — bản chất là một struct header trỏ tới underlying array.

```go
// Array: fixed size, value type
var a [3]int = [3]int{1, 2, 3}
b := a        // b là bản copy hoàn toàn mới
b[0] = 99
fmt.Println(a) // [1 2 3] — không bị ảnh hưởng
fmt.Println(b) // [99 2 3]

// Slice: dynamic, reference type (shares underlying array)
s1 := []int{1, 2, 3}
s2 := s1       // s2 trỏ cùng underlying array
s2[0] = 99
fmt.Println(s1) // [99 2 3] — bị ảnh hưởng!
```

**Interview tip:** Luôn nhấn mạnh rằng slice header gồm 3 fields: pointer, length, capacity. Đây là kiến thức nền tảng mà interviewer expect bạn biết ngay.

---

### Q2: Explain the slice header struct in detail. 🟡 🟡 [Mid]

**A:** Bên trong runtime, slice được biểu diễn bằng struct `reflect.SliceHeader`:

```go
// Đây là cấu trúc thực tế trong Go runtime (reflect package)
type SliceHeader struct {
    Data uintptr // pointer tới underlying array
    Len  int     // số phần tử hiện tại
    Cap  int     // capacity - tổng số phần tử underlying array có thể chứa
}
```

Minh họa cách slice header hoạt động:

```go
package main

import (
    "fmt"
    "unsafe"
)

func main() {
    arr := [5]int{10, 20, 30, 40, 50}
    s := arr[1:3] // slice từ index 1 đến 2

    fmt.Println("Slice:", s)           // [20 30]
    fmt.Println("Len:", len(s))        // 2
    fmt.Println("Cap:", cap(s))        // 4 (từ index 1 đến hết arr)

    // Chứng minh slice trỏ tới underlying array
    fmt.Println("Array addr [1]:", &arr[1])
    fmt.Println("Slice addr [0]:", &s[0])
    // Hai địa chỉ giống nhau!

    // Sizeof slice header = 24 bytes trên 64-bit system
    // (8 bytes pointer + 8 bytes len + 8 bytes cap)
    fmt.Println("Slice header size:", unsafe.Sizeof(s)) // 24
}
```

**Key insight:** Khi truyền slice vào function, chỉ copy 24 bytes (header), KHÔNG copy data. Nhưng nếu function append và trigger reallocation, caller sẽ không thấy elements mới.

---

### Q3: How does slice append and growth work? (Go 1.18+) 🟡 🟡 [Mid]

**A:** Khi `append` vượt capacity, Go allocate underlying array mới với size lớn hơn, copy data sang, rồi trả về slice header mới.

**Growth strategy (Go 1.18+):**
- `cap < 256`: **double** capacity (nhân đôi)
- `cap >= 256`: tăng thêm `cap + cap/4 + 192` (~25% + padding)

```go
package main

import "fmt"

func main() {
    var s []int
    prevCap := 0

    for i := 0; i < 2000; i++ {
        s = append(s, i)
        if cap(s) != prevCap {
            fmt.Printf("len=%-5d cap=%-5d growth=%.2fx\n",
                len(s), cap(s), float64(cap(s))/max(float64(prevCap), 1))
            prevCap = cap(s)
        }
    }
}

// Output (Go 1.22):
// len=1     cap=1     growth=1.00x
// len=2     cap=2     growth=2.00x
// len=3     cap=4     growth=2.00x
// len=5     cap=8     growth=2.00x
// len=9     cap=16    growth=2.00x
// ...
// len=257   cap=512   growth=2.00x   <-- vẫn double tại ngưỡng
// len=513   cap=848   growth=1.66x   <-- bắt đầu giảm tốc độ tăng
// len=849   cap=1280  growth=1.51x
```

**Pre-allocate khi biết size — tránh reallocations:**

```go
// BAD: O(n) reallocations
func buildSliceBad(n int) []int {
    var s []int
    for i := 0; i < n; i++ {
        s = append(s, i) // nhiều lần realloc + copy
    }
    return s
}

// GOOD: O(1) allocation
func buildSliceGood(n int) []int {
    s := make([]int, 0, n) // pre-allocate capacity
    for i := 0; i < n; i++ {
        s = append(s, i) // không bao giờ realloc
    }
    return s
}
```

**Interview tip:** Khi interviewer hỏi "optimize this code", pre-allocate slice capacity là low-hanging fruit.

---

### Q4: Common slice tricks — remove, insert, reverse, filter? 🟡 🟡 [Mid]

**A:**

```go
package main

import "fmt"

// Remove element at index i (preserving order) - O(n)
func removeOrdered[T any](s []T, i int) []T {
    return append(s[:i], s[i+1:]...)
}

// Remove element at index i (NOT preserving order) - O(1)
func removeUnordered[T any](s []T, i int) []T {
    s[i] = s[len(s)-1]       // swap with last
    return s[:len(s)-1]       // shrink
}

// Insert element at index i - O(n)
func insert[T any](s []T, i int, val T) []T {
    s = append(s, *new(T))     // grow by 1
    copy(s[i+1:], s[i:])      // shift right
    s[i] = val
    return s
}

// Reverse in-place - O(n)
func reverse[T any](s []T) {
    for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
        s[i], s[j] = s[j], s[i]
    }
}

// Filter in-place (zero allocation) - O(n)
func filterInPlace(s []int, keep func(int) bool) []int {
    n := 0
    for _, v := range s {
        if keep(v) {
            s[n] = v
            n++
        }
    }
    return s[:n]
}

func main() {
    // Remove ordered
    s := []int{1, 2, 3, 4, 5}
    s = removeOrdered(s, 2)
    fmt.Println("Remove ordered:", s) // [1 2 4 5]

    // Remove unordered
    s = []int{1, 2, 3, 4, 5}
    s = removeUnordered(s, 1)
    fmt.Println("Remove unordered:", s) // [1 5 3 4]

    // Insert
    s = []int{1, 2, 4, 5}
    s = insert(s, 2, 3)
    fmt.Println("Insert:", s) // [1 2 3 4 5]

    // Reverse
    s = []int{1, 2, 3, 4, 5}
    reverse(s)
    fmt.Println("Reverse:", s) // [5 4 3 2 1]

    // Filter in-place
    s = []int{1, 2, 3, 4, 5, 6, 7, 8}
    evens := filterInPlace(s, func(v int) bool { return v%2 == 0 })
    fmt.Println("Filter evens:", evens) // [2 4 6 8]
}
```

---

### Q5: What are the gotchas with shared underlying arrays and memory leaks? 🔴 🔴 [Senior]

**A:** Đây là câu phân biệt Senior vs Junior. Có 2 gotcha chính:

**Gotcha 1: Shared underlying array — mutation ảnh hưởng nhau**

```go
func main() {
    original := []int{1, 2, 3, 4, 5}
    sub := original[1:3] // [2, 3] - shares underlying array

    // Append vào sub có thể OVERWRITE original!
    sub = append(sub, 99)
    fmt.Println(original) // [1 2 3 99 5] — original[3] bị ghi đè!
    fmt.Println(sub)      // [2 3 99]
}
```

**Gotcha 2: Memory leak từ sub-slice giữ reference tới array lớn**

```go
// BAD: 1MB array bị giữ trong memory vì sub-slice tham chiếu nó
func getFirstTenBad(data []byte) []byte {
    return data[:10] // giữ reference tới toàn bộ underlying array
}

// GOOD: Copy ra slice mới, cho phép GC thu hồi array lớn
func getFirstTenGood(data []byte) []byte {
    result := make([]byte, 10)
    copy(result, data[:10])
    return result
}

// Ví dụ thực tế: đọc file 100MB, chỉ cần 10 bytes đầu
func processLargeFile(filename string) []byte {
    data, _ := os.ReadFile(filename) // 100MB
    // Nếu return data[:10] => 100MB bị giữ trong memory
    // Phải copy ra để GC giải phóng 100MB
    header := make([]byte, 10)
    copy(header, data[:10])
    return header // chỉ giữ 10 bytes, 100MB được GC
}
```

**Interview tip:** Nếu interviewer hỏi "khi nào slice gây memory leak", đây là câu trả lời perfect.

---

### Q6: Full slice expression `a[low:high:max]` — what and why? 🔴 🔴 [Senior]

**A:** Full slice expression giới hạn capacity của slice mới, ngăn chặn việc append vô tình ghi đè underlying array.

```go
func main() {
    a := []int{1, 2, 3, 4, 5}

    // Thường: cap = len(a) - low
    s1 := a[1:3]
    fmt.Println(len(s1), cap(s1)) // 2, 4

    // Full slice expression: cap = max - low
    s2 := a[1:3:3] // cap bị giới hạn = 3 - 1 = 2
    fmt.Println(len(s2), cap(s2)) // 2, 2

    // Bây giờ append sẽ FORCE allocation mới thay vì ghi đè
    s2 = append(s2, 99)
    fmt.Println(a)  // [1 2 3 4 5] — KHÔNG bị ảnh hưởng
    fmt.Println(s2) // [2 3 99]    — array riêng
}
```

**Pattern thực tế: Safe sub-slicing trong library code**

```go
// Trả về sub-slice mà caller không thể ghi đè data gốc
func SafeSubSlice(data []int, from, to int) []int {
    return data[from:to:to] // cap == len => append luôn alloc mới
}
```

---

## 2. String & Rune

### Q7: Explain string vs []byte vs []rune in Go. 🟢 🟢 [Junior]

**A:** Trong Go, `string` là immutable sequence of bytes (UTF-8 encoded). `[]byte` là mutable byte slice. `[]rune` là mutable slice of Unicode code points.

```go
package main

import "fmt"

func main() {
    s := "Xin chào 🇻🇳"

    fmt.Println("String len (bytes):", len(s))         // 18 (UTF-8 bytes)
    fmt.Println("Rune count:", len([]rune(s)))          // 11 (Unicode code points)
    // Lưu ý: flag emoji 🇻🇳 = 2 runes (U+1F1FB + U+1F1F3)

    // Index access = byte access
    fmt.Printf("s[0] = %d (%c)\n", s[0], s[0]) // 88 (X)

    // Range over string = rune iteration
    for i, r := range s {
        fmt.Printf("byte_index=%d rune=%c (U+%04X)\n", i, r, r)
    }

    // Conversions (có allocation cost!)
    bytes := []byte(s)   // copy, O(n)
    runes := []rune(s)   // copy + decode, O(n)
    back := string(bytes) // copy, O(n)
    _ = back

    // Modify string: phải convert sang []byte hoặc []rune
    bs := []byte(s)
    bs[0] = 'Y'
    modified := string(bs)
    fmt.Println(modified) // "Yin chào 🇻🇳"

    // Chú ý: []byte không safe cho multi-byte characters
    rs := []rune(s)
    rs[4] = 'C' // thay 'c' bằng 'C' (an toàn cho Unicode)
    fmt.Println(string(rs)) // "Xin Chào 🇻🇳"
}
```

**So sánh nhanh:**

| Feature | `string` | `[]byte` | `[]rune` |
|---------|----------|----------|----------|
| Mutable | No | Yes | Yes |
| Encoding | UTF-8 | Raw bytes | Unicode code points |
| `len()` | Bytes | Bytes | Runes |
| Index | Byte | Byte | Rune |
| Use case | Text, keys | I/O, binary | Unicode manipulation |

---

### Q8: strings.Builder — why and how? 🟡 🟡 [Mid]

**A:** String concatenation bằng `+` tạo string mới mỗi lần (vì string immutable), dẫn đến O(n^2) cho n concatenations. `strings.Builder` sử dụng internal `[]byte` buffer, chỉ convert sang string 1 lần cuối.

```go
package main

import (
    "fmt"
    "strings"
    "testing"
)

// BAD: O(n^2) - mỗi + tạo string mới
func concatBad(n int) string {
    s := ""
    for i := 0; i < n; i++ {
        s += "a" // allocate string mới mỗi lần
    }
    return s
}

// GOOD: O(n) - dùng strings.Builder
func concatGood(n int) string {
    var b strings.Builder
    b.Grow(n) // pre-allocate buffer — tránh realloc
    for i := 0; i < n; i++ {
        b.WriteByte('a')
    }
    return b.String()
}

// Benchmark so sánh
func BenchmarkConcatBad(b *testing.B) {
    for i := 0; i < b.N; i++ {
        concatBad(10000)
    }
}

func BenchmarkConcatGood(b *testing.B) {
    for i := 0; i < b.N; i++ {
        concatGood(10000)
    }
}

// BenchmarkConcatBad-8     100    15234967 ns/op    53014528 B/op
// BenchmarkConcatGood-8  30000       42056 ns/op       10240 B/op
// => Builder nhanh ~360x, ít allocation hơn ~5000x

func main() {
    // Practical example: build SQL query
    var b strings.Builder
    b.WriteString("SELECT * FROM users WHERE 1=1")

    conditions := map[string]string{
        "name":   "Nguyen",
        "status": "active",
    }
    for col, val := range conditions {
        b.WriteString(" AND ")
        b.WriteString(col)
        b.WriteString(" = '")
        b.WriteString(val)
        b.WriteString("'")
    }
    fmt.Println(b.String())
}
```

**Interview tip:** `strings.Builder` internally dùng `[]byte` và method `String()` dùng `unsafe` để tránh copy cuối cùng — zero-copy conversion.

---

### Q9: Range over string — bytes vs runes? 🟢 🟢 [Junior]

**A:**

```go
package main

import "fmt"

func main() {
    s := "café" // é = 2 bytes in UTF-8

    // Index loop: iterates over BYTES
    fmt.Println("=== Byte iteration ===")
    for i := 0; i < len(s); i++ {
        fmt.Printf("index=%d byte=0x%02X char=%c\n", i, s[i], s[i])
    }
    // index=0 byte=0x63 char=c
    // index=1 byte=0x61 char=a
    // index=2 byte=0x66 char=f
    // index=3 byte=0xC3 char=Ã   <-- first byte of é
    // index=4 byte=0xA9 char=©   <-- second byte of é

    // Range loop: iterates over RUNES (decodes UTF-8)
    fmt.Println("=== Rune iteration ===")
    for i, r := range s {
        fmt.Printf("byte_index=%d rune=%c (U+%04X) size=%d\n",
            i, r, r, len(string(r)))
    }
    // byte_index=0 rune=c (U+0063) size=1
    // byte_index=1 rune=a (U+0061) size=1
    // byte_index=2 rune=f (U+0066) size=1
    // byte_index=3 rune=é (U+00E9) size=2   <-- skip index 4

    // Đếm runes chính xác
    fmt.Println("Byte len:", len(s))                          // 5
    fmt.Println("Rune count:", len([]rune(s)))                // 4
    // Hoặc dùng utf8.RuneCountInString (không allocate)
    // fmt.Println("Rune count:", utf8.RuneCountInString(s))  // 4
}
```

---

## 3. Hash Map (Go `map`)

### Q10: How does Go map work internally? 🔴 🔴 [Senior]

**A:** Go map là hash table implementation với bucket-based design. Kiến thức này rất hay được hỏi ở Senior level.

**Cấu trúc `hmap` (runtime/map.go):**

```
hmap struct:
├── count      int           // số phần tử
├── flags      uint8         // trạng thái (writing, growing...)
├── B          uint8         // log2(số buckets), buckets = 2^B
├── noverflow  uint16        // số overflow buckets
├── hash0      uint32        // hash seed (random mỗi lần tạo map)
├── buckets    unsafe.Pointer // pointer tới array of buckets
├── oldbuckets unsafe.Pointer // pointer tới old buckets (khi growing)
└── ...

Mỗi bucket (bmap) chứa:
├── tophash [8]uint8    // 8 byte đầu, mỗi byte = top 8 bits của hash
├── keys    [8]keyType  // 8 keys
├── values  [8]valType  // 8 values
└── overflow *bmap      // pointer tới overflow bucket
```

**Quá trình lookup:**

```
1. hash = hash_function(key, hash0)
2. bucket_index = hash & (2^B - 1)        // low B bits chọn bucket
3. tophash_byte = hash >> (64 - 8)        // top 8 bits
4. Scan tophash[0..7] trong bucket tìm match
5. Nếu tophash match → so sánh full key
6. Nếu không tìm thấy → follow overflow pointer
```

```go
package main

import "fmt"

func main() {
    // Map cơ bản
    m := make(map[string]int)
    m["alice"] = 100
    m["bob"] = 200

    // Lookup với comma-ok idiom
    if val, ok := m["alice"]; ok {
        fmt.Println("Found alice:", val)
    }

    // Delete
    delete(m, "bob")

    // Iterate (thứ tự RANDOM mỗi lần chạy!)
    for k, v := range m {
        fmt.Println(k, v)
    }

    // Map with initial capacity hint (không giới hạn size)
    users := make(map[int]string, 1000) // hint: ~1000 entries
    _ = users
}
```

**Load factor và growing:**

```
- Load factor = count / (2^B * 8)
- Khi load factor > 6.5 → trigger grow (double buckets)
- Khi too many overflow buckets → trigger same-size grow (rehash)
- Growing là INCREMENTAL: mỗi insert/delete di chuyển 1-2 buckets
  từ oldbuckets sang buckets (không block tất cả operations)
```

---

### Q11: Why is Go map NOT thread-safe? What happens with concurrent access? 🔴 🔴 [Senior]

**A:** Go map không thread-safe by design (vì mutex cost cho mọi operation sẽ giảm performance cho single-goroutine use case — chiếm đa số). Concurrent read+write sẽ **crash chương trình** (fatal error, không recover được).

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    // THIS WILL CRASH (fatal error: concurrent map writes)
    m := make(map[int]int)
    var wg sync.WaitGroup

    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func(i int) {
            defer wg.Done()
            m[i] = i // concurrent write → CRASH
        }(i)
    }
    wg.Wait()
    fmt.Println(m)
}
```

**Runtime phát hiện concurrent access bằng flag `hashWriting` trong hmap.flags.**

---

### Q12: sync.Map vs map+sync.RWMutex — when to use which? 🔴 🔴 [Senior]

**A:**

```go
package main

import (
    "fmt"
    "sync"
)

// Solution 1: map + sync.RWMutex (general purpose)
type SafeMap struct {
    mu sync.RWMutex
    m  map[string]int
}

func NewSafeMap() *SafeMap {
    return &SafeMap{m: make(map[string]int)}
}

func (sm *SafeMap) Get(key string) (int, bool) {
    sm.mu.RLock()
    defer sm.mu.RUnlock()
    v, ok := sm.m[key]
    return v, ok
}

func (sm *SafeMap) Set(key string, val int) {
    sm.mu.Lock()
    defer sm.mu.Unlock()
    sm.m[key] = val
}

func (sm *SafeMap) Delete(key string) {
    sm.mu.Lock()
    defer sm.mu.Unlock()
    delete(sm.m, key)
}

// Solution 2: sync.Map (specialized use cases)
func syncMapExample() {
    var m sync.Map

    m.Store("key1", 100)
    m.Store("key2", 200)

    if val, ok := m.Load("key1"); ok {
        fmt.Println("key1:", val)
    }

    // LoadOrStore: atomic get-or-set
    actual, loaded := m.LoadOrStore("key3", 300)
    fmt.Println(actual, loaded) // 300, false (stored new)

    // Range
    m.Range(func(key, value any) bool {
        fmt.Println(key, value)
        return true // false to stop
    })
}

func main() {
    sm := NewSafeMap()
    sm.Set("go", 1)
    v, _ := sm.Get("go")
    fmt.Println(v)

    syncMapExample()
}
```

**So sánh:**

| Criteria | `map + RWMutex` | `sync.Map` |
|----------|-----------------|------------|
| Type-safe | Yes (generics) | No (any → cần cast) |
| Read-heavy, stable keys | OK | **Tối ưu** (lock-free reads) |
| Frequent writes | **Tốt hơn** | Chậm hơn |
| Disjoint key sets (per goroutine) | OK | **Tối ưu** |
| Enumerate all keys | Easy (range) | `.Range()` callback |
| Memory overhead | Lower | Higher (double storage) |
| General recommendation | **Dùng mặc định** | Chỉ khi profile chứng minh cần |

**Interview tip:** Mặc định dùng `map + RWMutex`. Chỉ dùng `sync.Map` khi: (1) read-heavy với key set ổn định, hoặc (2) nhiều goroutines truy cập disjoint key sets.

---

## 4. Linked List

### Q13: Implement a singly linked list in Go. 🟢 🟢 [Junior]

**A:**

```go
package main

import "fmt"

type ListNode struct {
    Val  int
    Next *ListNode
}

type LinkedList struct {
    Head *ListNode
    Size int
}

func (ll *LinkedList) PushFront(val int) {
    ll.Head = &ListNode{Val: val, Next: ll.Head}
    ll.Size++
}

func (ll *LinkedList) PushBack(val int) {
    node := &ListNode{Val: val}
    if ll.Head == nil {
        ll.Head = node
    } else {
        curr := ll.Head
        for curr.Next != nil {
            curr = curr.Next
        }
        curr.Next = node
    }
    ll.Size++
}

func (ll *LinkedList) DeleteVal(val int) bool {
    dummy := &ListNode{Next: ll.Head} // dummy node trick
    prev := dummy
    for prev.Next != nil {
        if prev.Next.Val == val {
            prev.Next = prev.Next.Next
            ll.Size--
            ll.Head = dummy.Next
            return true
        }
        prev = prev.Next
    }
    return false
}

func (ll *LinkedList) Print() {
    for curr := ll.Head; curr != nil; curr = curr.Next {
        fmt.Printf("%d -> ", curr.Val)
    }
    fmt.Println("nil")
}

func main() {
    ll := &LinkedList{}
    ll.PushFront(3)
    ll.PushFront(2)
    ll.PushFront(1)
    ll.PushBack(4)
    ll.Print() // 1 -> 2 -> 3 -> 4 -> nil

    ll.DeleteVal(3)
    ll.Print() // 1 -> 2 -> 4 -> nil
}
```

---

### Q14: Reverse a linked list (iterative & recursive). 🟡 🟡 [Mid]

**A:** Bài kinh điển — Google và Grab rất hay hỏi.

```go
// Iterative — O(n) time, O(1) space
func reverseIterative(head *ListNode) *ListNode {
    var prev *ListNode
    curr := head
    for curr != nil {
        next := curr.Next  // lưu next
        curr.Next = prev   // đảo pointer
        prev = curr        // tiến prev
        curr = next        // tiến curr
    }
    return prev
}

// Recursive — O(n) time, O(n) space (call stack)
func reverseRecursive(head *ListNode) *ListNode {
    if head == nil || head.Next == nil {
        return head
    }
    newHead := reverseRecursive(head.Next)
    head.Next.Next = head // node kế trỏ ngược lại
    head.Next = nil       // cắt link cũ
    return newHead
}

func main() {
    // Build: 1 -> 2 -> 3 -> 4 -> nil
    head := &ListNode{1, &ListNode{2, &ListNode{3, &ListNode{4, nil}}}}

    head = reverseIterative(head)
    // Now: 4 -> 3 -> 2 -> 1 -> nil

    head = reverseRecursive(head)
    // Back to: 1 -> 2 -> 3 -> 4 -> nil
}
```

---

### Q15: Detect cycle in linked list (Floyd's Tortoise and Hare). 🟡 🟡 [Mid]

**A:**

```go
// Floyd's Cycle Detection — O(n) time, O(1) space
func hasCycle(head *ListNode) bool {
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next      // 1 step
        fast = fast.Next.Next // 2 steps
        if slow == fast {
            return true
        }
    }
    return false
}

// Tìm node bắt đầu cycle
func detectCycleStart(head *ListNode) *ListNode {
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
        if slow == fast {
            // Phase 2: tìm entry point
            slow = head
            for slow != fast {
                slow = slow.Next
                fast = fast.Next // cả hai đi 1 step
            }
            return slow // đây là entry point
        }
    }
    return nil // no cycle
}
```

**Toán học đằng sau:** Khi slow và fast gặp nhau trong cycle, khoảng cách từ head đến cycle entry = khoảng cách từ meeting point đến cycle entry (đi cùng chiều).

---

### Q16: Find middle node and merge two sorted linked lists. 🟡 🟡 [Mid]

**A:**

```go
// Tìm middle node — slow/fast pointer
func findMiddle(head *ListNode) *ListNode {
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
    }
    return slow // middle (hoặc second middle nếu even)
}

// Merge two sorted lists — O(n+m) time, O(1) space
func mergeTwoSorted(l1, l2 *ListNode) *ListNode {
    dummy := &ListNode{}
    tail := dummy

    for l1 != nil && l2 != nil {
        if l1.Val <= l2.Val {
            tail.Next = l1
            l1 = l1.Next
        } else {
            tail.Next = l2
            l2 = l2.Next
        }
        tail = tail.Next
    }

    // Nối phần còn lại
    if l1 != nil {
        tail.Next = l1
    } else {
        tail.Next = l2
    }

    return dummy.Next
}

func main() {
    l1 := &ListNode{1, &ListNode{3, &ListNode{5, nil}}}
    l2 := &ListNode{2, &ListNode{4, &ListNode{6, nil}}}
    merged := mergeTwoSorted(l1, l2)
    // 1 -> 2 -> 3 -> 4 -> 5 -> 6
    for n := merged; n != nil; n = n.Next {
        fmt.Printf("%d ", n.Val)
    }
}
```

**Interview tip:** `container/list` trong standard library là doubly-linked list. Nhưng interview thường yêu cầu implement từ đầu để test understanding.

---

## 5. Stack & Queue

### Q17: Implement Stack and Queue using slices. 🟢 🟢 [Junior]

**A:**

```go
package main

import "fmt"

// ========== STACK (LIFO) ==========
type Stack[T any] struct {
    data []T
}

func (s *Stack[T]) Push(val T) {
    s.data = append(s.data, val)
}

func (s *Stack[T]) Pop() (T, bool) {
    if len(s.data) == 0 {
        var zero T
        return zero, false
    }
    top := s.data[len(s.data)-1]
    s.data = s.data[:len(s.data)-1]
    return top, true
}

func (s *Stack[T]) Peek() (T, bool) {
    if len(s.data) == 0 {
        var zero T
        return zero, false
    }
    return s.data[len(s.data)-1], true
}

func (s *Stack[T]) IsEmpty() bool { return len(s.data) == 0 }
func (s *Stack[T]) Len() int     { return len(s.data) }

// ========== QUEUE (FIFO) ==========
type Queue[T any] struct {
    data []T
}

func (q *Queue[T]) Enqueue(val T) {
    q.data = append(q.data, val)
}

func (q *Queue[T]) Dequeue() (T, bool) {
    if len(q.data) == 0 {
        var zero T
        return zero, false
    }
    front := q.data[0]
    q.data = q.data[1:] // Lưu ý: memory leak tiềm ẩn nếu queue lớn
    return front, true
}

func (q *Queue[T]) IsEmpty() bool { return len(q.data) == 0 }

func main() {
    // Stack
    var s Stack[int]
    s.Push(1)
    s.Push(2)
    s.Push(3)
    v, _ := s.Pop()
    fmt.Println("Stack pop:", v) // 3

    // Queue
    var q Queue[string]
    q.Enqueue("first")
    q.Enqueue("second")
    q.Enqueue("third")
    v2, _ := q.Dequeue()
    fmt.Println("Queue dequeue:", v2) // "first"
}
```

**Lưu ý:** Queue dùng `data[1:]` sẽ không bao giờ giải phóng memory ở đầu slice. Với production queue, dùng ring buffer hoặc linked list.

---

### Q18: Implement MinStack — getMin in O(1). 🟡 🟡 [Mid]

**A:** Bài LeetCode classic, hay được hỏi ở Grab và Google.

```go
package main

import "fmt"

type MinStack struct {
    data []int
    mins []int // parallel stack giữ min tại mỗi level
}

func NewMinStack() *MinStack {
    return &MinStack{}
}

func (s *MinStack) Push(val int) {
    s.data = append(s.data, val)
    if len(s.mins) == 0 || val <= s.mins[len(s.mins)-1] {
        s.mins = append(s.mins, val)
    } else {
        // Lặp lại min hiện tại
        s.mins = append(s.mins, s.mins[len(s.mins)-1])
    }
}

func (s *MinStack) Pop() int {
    n := len(s.data)
    val := s.data[n-1]
    s.data = s.data[:n-1]
    s.mins = s.mins[:n-1]
    return val
}

func (s *MinStack) Top() int {
    return s.data[len(s.data)-1]
}

func (s *MinStack) GetMin() int {
    return s.mins[len(s.mins)-1] // O(1)!
}

func main() {
    ms := NewMinStack()
    ms.Push(5)
    ms.Push(3)
    ms.Push(7)
    ms.Push(1)

    fmt.Println("Min:", ms.GetMin()) // 1
    ms.Pop()                          // remove 1
    fmt.Println("Min:", ms.GetMin()) // 3
    ms.Pop()                          // remove 7
    fmt.Println("Min:", ms.GetMin()) // 3
    ms.Pop()                          // remove 3
    fmt.Println("Min:", ms.GetMin()) // 5
}
```

---

### Q19: Thread-safe bounded queue using channels. 🟡 🟡 [Mid]

**A:** Channel trong Go bản chất là bounded, thread-safe queue.

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

// Bounded thread-safe queue backed by channel
type ChanQueue[T any] struct {
    ch chan T
}

func NewChanQueue[T any](capacity int) *ChanQueue[T] {
    return &ChanQueue[T]{ch: make(chan T, capacity)}
}

func (q *ChanQueue[T]) Enqueue(val T) bool {
    select {
    case q.ch <- val:
        return true
    default:
        return false // queue full
    }
}

func (q *ChanQueue[T]) Dequeue() (T, bool) {
    select {
    case val := <-q.ch:
        return val, true
    default:
        var zero T
        return zero, false // queue empty
    }
}

func (q *ChanQueue[T]) DequeueBlocking() T {
    return <-q.ch // blocks until item available
}

func (q *ChanQueue[T]) Len() int { return len(q.ch) }

func main() {
    q := NewChanQueue[int](5)
    var wg sync.WaitGroup

    // Producer
    wg.Add(1)
    go func() {
        defer wg.Done()
        for i := 0; i < 10; i++ {
            q.ch <- i
            fmt.Println("Produced:", i)
            time.Sleep(100 * time.Millisecond)
        }
        close(q.ch)
    }()

    // Consumer
    wg.Add(1)
    go func() {
        defer wg.Done()
        for val := range q.ch {
            fmt.Println("Consumed:", val)
            time.Sleep(200 * time.Millisecond)
        }
    }()

    wg.Wait()
}
```

---

## 6. Tree

### Q20: Implement all binary tree traversals in Go. 🟢 🟢 [Junior]

**A:**

```go
package main

import "fmt"

type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

// ========== INORDER: Left → Root → Right ==========
// Recursive
func inorder(root *TreeNode, result *[]int) {
    if root == nil {
        return
    }
    inorder(root.Left, result)
    *result = append(*result, root.Val)
    inorder(root.Right, result)
}

// Iterative (dùng stack)
func inorderIterative(root *TreeNode) []int {
    var result []int
    var stack []*TreeNode
    curr := root

    for curr != nil || len(stack) > 0 {
        for curr != nil {
            stack = append(stack, curr)
            curr = curr.Left
        }
        curr = stack[len(stack)-1]
        stack = stack[:len(stack)-1]
        result = append(result, curr.Val)
        curr = curr.Right
    }
    return result
}

// ========== PREORDER: Root → Left → Right ==========
func preorder(root *TreeNode, result *[]int) {
    if root == nil {
        return
    }
    *result = append(*result, root.Val)
    preorder(root.Left, result)
    preorder(root.Right, result)
}

// ========== POSTORDER: Left → Right → Root ==========
func postorder(root *TreeNode, result *[]int) {
    if root == nil {
        return
    }
    postorder(root.Left, result)
    postorder(root.Right, result)
    *result = append(*result, root.Val)
}

// ========== LEVEL-ORDER (BFS) ==========
func levelOrder(root *TreeNode) [][]int {
    if root == nil {
        return nil
    }
    var result [][]int
    queue := []*TreeNode{root}

    for len(queue) > 0 {
        levelSize := len(queue)
        var level []int

        for i := 0; i < levelSize; i++ {
            node := queue[0]
            queue = queue[1:]
            level = append(level, node.Val)

            if node.Left != nil {
                queue = append(queue, node.Left)
            }
            if node.Right != nil {
                queue = append(queue, node.Right)
            }
        }
        result = append(result, level)
    }
    return result
}

func main() {
    //        4
    //       / \
    //      2   6
    //     / \ / \
    //    1  3 5  7
    root := &TreeNode{4,
        &TreeNode{2,
            &TreeNode{1, nil, nil},
            &TreeNode{3, nil, nil}},
        &TreeNode{6,
            &TreeNode{5, nil, nil},
            &TreeNode{7, nil, nil}},
    }

    var res []int
    inorder(root, &res)
    fmt.Println("Inorder:   ", res) // [1 2 3 4 5 6 7]

    fmt.Println("Inorder(i):", inorderIterative(root)) // [1 2 3 4 5 6 7]

    res = nil
    preorder(root, &res)
    fmt.Println("Preorder:  ", res) // [4 2 1 3 6 5 7]

    res = nil
    postorder(root, &res)
    fmt.Println("Postorder: ", res) // [1 3 2 5 7 6 4]

    fmt.Println("Level-order:", levelOrder(root)) // [[4] [2 6] [1 3 5 7]]
}
```

---

### Q21: BST operations — search, insert, validate, LCA. 🟡 🟡 [Mid]

**A:**

```go
package main

import (
    "fmt"
    "math"
)

type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

// Search BST — O(h) where h = height
func searchBST(root *TreeNode, target int) *TreeNode {
    if root == nil || root.Val == target {
        return root
    }
    if target < root.Val {
        return searchBST(root.Left, target)
    }
    return searchBST(root.Right, target)
}

// Insert into BST — O(h)
func insertBST(root *TreeNode, val int) *TreeNode {
    if root == nil {
        return &TreeNode{Val: val}
    }
    if val < root.Val {
        root.Left = insertBST(root.Left, val)
    } else if val > root.Val {
        root.Right = insertBST(root.Right, val)
    }
    return root
}

// Validate BST — kiểm tra có phải BST hợp lệ không
func isValidBST(root *TreeNode) bool {
    return validate(root, math.MinInt64, math.MaxInt64)
}

func validate(node *TreeNode, min, max int) bool {
    if node == nil {
        return true
    }
    if node.Val <= min || node.Val >= max {
        return false
    }
    return validate(node.Left, min, node.Val) &&
        validate(node.Right, node.Val, max)
}

// Lowest Common Ancestor (LCA) trong BST — O(h)
// Lợi dụng BST property: left < root < right
func lcaBST(root *TreeNode, p, q int) *TreeNode {
    if root == nil {
        return nil
    }
    if p < root.Val && q < root.Val {
        return lcaBST(root.Left, p, q)   // cả hai bên trái
    }
    if p > root.Val && q > root.Val {
        return lcaBST(root.Right, p, q)  // cả hai bên phải
    }
    return root // split point → đây là LCA
}

func main() {
    //        8
    //       / \
    //      3   10
    //     / \    \
    //    1   6    14
    root := &TreeNode{8,
        &TreeNode{3,
            &TreeNode{1, nil, nil},
            &TreeNode{6, nil, nil}},
        &TreeNode{10,
            nil,
            &TreeNode{14, nil, nil}},
    }

    fmt.Println("Search 6:", searchBST(root, 6) != nil) // true
    fmt.Println("Search 99:", searchBST(root, 99))      // nil
    fmt.Println("Valid BST:", isValidBST(root))          // true

    lca := lcaBST(root, 1, 6)
    fmt.Println("LCA(1,6):", lca.Val)  // 3

    lca = lcaBST(root, 1, 14)
    fmt.Println("LCA(1,14):", lca.Val) // 8
}
```

---

### Q22: B-Tree vs B+ Tree — why do databases use B+ Tree? 🔴 🔴 [Senior]

**A:** Đây là câu rất hay hỏi cho Backend Senior (đặc biệt system design và database internals).

```
B-Tree:
- Keys và values ở CẢ internal nodes lẫn leaf nodes
- Mỗi node có m children (m = order)
- Dùng cho: general purpose indexing

B+ Tree:
- Chỉ KEYS ở internal nodes, VALUES chỉ ở LEAF nodes
- Leaf nodes liên kết nhau bằng linked list
- Dùng cho: database indexes (MySQL InnoDB, PostgreSQL)

Tại sao Database chọn B+ Tree:

1. RANGE QUERIES nhanh hơn:
   B+ Tree: leaf nodes linked → scan tuần tự O(log n + k)
   B-Tree: phải traverse lên xuống tree

2. Internal nodes NHỎ hơn → nhiều keys hơn mỗi node:
   Vì internal nodes không chứa value (chỉ key + pointer)
   → Fan-out cao hơn → tree thấp hơn → ít disk I/O hơn

3. Disk I/O optimization:
   Node size = disk page size (4KB/16KB)
   B+ Tree internal node chứa ~500 keys vs B-Tree ~250 keys
   → 500^3 = 125 triệu records chỉ cần 3 levels (3 disk reads)

4. Full table scan = sequential leaf scan:
   Rất hiệu quả vì leaf nodes nằm liên tiếp trên disk
```

```
Ví dụ trực quan:

B-Tree (order 3):
        [10, 20]
       /    |    \
   [5,K]  [15,K] [25,30]  ← K = actual data values
                            Mỗi node chứa cả key+value

B+ Tree (order 3):
        [10, 20]          ← chỉ keys, không có values
       /    |    \
   [5]→[10,15]→[20,25,30] ← leaf nodes chứa values
                             liên kết linked list
```

**Interview tip:** Khi hỏi "tại sao MySQL dùng B+ Tree", focus vào: (1) range query qua linked list, (2) higher fan-out do internal nodes nhỏ hơn, (3) ít disk I/O.

---

## 7. Heap / Priority Queue

### Q23: Implement priority queue using container/heap. 🟡 🟡 [Mid]

**A:** Go standard library có `container/heap` interface. Bạn implement 5 methods rồi `heap` lo phần logic.

```go
package main

import (
    "container/heap"
    "fmt"
)

// Item in priority queue
type Item struct {
    Value    string
    Priority int
}

// PriorityQueue implements heap.Interface
type PriorityQueue []*Item

func (pq PriorityQueue) Len() int            { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool  { return pq[i].Priority < pq[j].Priority } // min-heap
func (pq PriorityQueue) Swap(i, j int)       { pq[i], pq[j] = pq[j], pq[i] }

func (pq *PriorityQueue) Push(x any) {
    *pq = append(*pq, x.(*Item))
}

func (pq *PriorityQueue) Pop() any {
    old := *pq
    n := len(old)
    item := old[n-1]
    old[n-1] = nil // tránh memory leak
    *pq = old[:n-1]
    return item
}

func main() {
    pq := &PriorityQueue{}
    heap.Init(pq)

    heap.Push(pq, &Item{Value: "low-priority-task", Priority: 10})
    heap.Push(pq, &Item{Value: "urgent-task", Priority: 1})
    heap.Push(pq, &Item{Value: "medium-task", Priority: 5})

    for pq.Len() > 0 {
        item := heap.Pop(pq).(*Item)
        fmt.Printf("Priority=%d Value=%s\n", item.Priority, item.Value)
    }
    // Output (min-heap → thấp nhất ra trước):
    // Priority=1  Value=urgent-task
    // Priority=5  Value=medium-task
    // Priority=10 Value=low-priority-task
}
```

---

### Q24: Top K elements pattern with heap. 🟡 🟡 [Mid]

**A:** Pattern quan trọng — dùng min-heap size K để tìm top K lớn nhất trong O(n log K).

```go
package main

import (
    "container/heap"
    "fmt"
)

// IntMinHeap — min-heap of ints
type IntMinHeap []int

func (h IntMinHeap) Len() int            { return len(h) }
func (h IntMinHeap) Less(i, j int) bool  { return h[i] < h[j] }
func (h IntMinHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *IntMinHeap) Push(x any)         { *h = append(*h, x.(int)) }
func (h *IntMinHeap) Pop() any {
    old := *h
    n := len(old)
    val := old[n-1]
    *h = old[:n-1]
    return val
}

// TopK — tìm K phần tử lớn nhất, O(n log k)
func TopK(nums []int, k int) []int {
    h := &IntMinHeap{}
    heap.Init(h)

    for _, num := range nums {
        heap.Push(h, num)
        if h.Len() > k {
            heap.Pop(h) // loại phần tử nhỏ nhất
        }
    }

    result := make([]int, h.Len())
    for i := h.Len() - 1; i >= 0; i-- {
        result[i] = heap.Pop(h).(int)
    }
    return result
}

func main() {
    nums := []int{3, 1, 5, 12, 2, 11, 9, 7}
    fmt.Println("Top 3:", TopK(nums, 3)) // [9 11 12]
}
```

---

### Q25: K closest points to origin (Grab geospatial interview). 🟡 🟡 [Mid]

**A:** Bài thường gặp ở Grab vì liên quan tới geospatial — tìm K tài xế gần nhất.

```go
package main

import (
    "container/heap"
    "fmt"
    "math"
)

type Point struct {
    X, Y float64
    ID   string // driver ID, restaurant ID, etc.
}

func (p Point) DistSq() float64 {
    return p.X*p.X + p.Y*p.Y // không cần sqrt để so sánh
}

// MaxHeap of Points (by distance) — giữ K điểm gần nhất
type PointMaxHeap []Point

func (h PointMaxHeap) Len() int            { return len(h) }
func (h PointMaxHeap) Less(i, j int) bool  { return h[i].DistSq() > h[j].DistSq() } // max-heap!
func (h PointMaxHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *PointMaxHeap) Push(x any)         { *h = append(*h, x.(Point)) }
func (h *PointMaxHeap) Pop() any {
    old := *h
    n := len(old)
    val := old[n-1]
    *h = old[:n-1]
    return val
}

func kClosest(points []Point, k int) []Point {
    h := &PointMaxHeap{}
    heap.Init(h)

    for _, p := range points {
        heap.Push(h, p)
        if h.Len() > k {
            heap.Pop(h) // loại điểm xa nhất
        }
    }

    result := make([]Point, h.Len())
    for i := h.Len() - 1; i >= 0; i-- {
        result[i] = heap.Pop(h).(Point)
    }
    return result
}

func main() {
    // Giả lập: tìm 2 tài xế gần nhất với user tại (0,0)
    drivers := []Point{
        {1, 3, "driver-A"},
        {-2, 2, "driver-B"},
        {5, 8, "driver-C"},
        {0, 1, "driver-D"},
    }

    closest := kClosest(drivers, 2)
    for _, p := range closest {
        fmt.Printf("%s at (%.0f,%.0f) dist=%.2f\n",
            p.ID, p.X, p.Y, math.Sqrt(p.DistSq()))
    }
    // driver-D at (0,1) dist=1.00
    // driver-B at (-2,2) dist=2.83
}
```

---

## 8. Graph

### Q26: Represent a graph with adjacency list in Go. 🟢 🟢 [Junior]

**A:**

```go
package main

import "fmt"

// Unweighted graph
type Graph struct {
    adjacency map[int][]int
    directed  bool
}

func NewGraph(directed bool) *Graph {
    return &Graph{
        adjacency: make(map[int][]int),
        directed:  directed,
    }
}

func (g *Graph) AddEdge(u, v int) {
    g.adjacency[u] = append(g.adjacency[u], v)
    if !g.directed {
        g.adjacency[v] = append(g.adjacency[v], u)
    }
}

// Weighted graph
type WeightedGraph struct {
    adjacency map[int][]Edge
}

type Edge struct {
    To     int
    Weight int
}

func NewWeightedGraph() *WeightedGraph {
    return &WeightedGraph{adjacency: make(map[int][]Edge)}
}

func (g *WeightedGraph) AddEdge(from, to, weight int) {
    g.adjacency[from] = append(g.adjacency[from], Edge{to, weight})
}

func main() {
    g := NewGraph(false) // undirected
    g.AddEdge(0, 1)
    g.AddEdge(0, 2)
    g.AddEdge(1, 3)
    g.AddEdge(2, 3)

    for node, neighbors := range g.adjacency {
        fmt.Printf("%d → %v\n", node, neighbors)
    }
}
```

---

### Q27: BFS and DFS — both iterative and recursive. 🟡 🟡 [Mid]

**A:**

```go
package main

import "fmt"

type Graph struct {
    adj map[int][]int
}

func NewGraph() *Graph {
    return &Graph{adj: make(map[int][]int)}
}

func (g *Graph) AddEdge(u, v int) {
    g.adj[u] = append(g.adj[u], v)
    g.adj[v] = append(g.adj[v], u)
}

// ========== BFS — Iterative (dùng queue) ==========
func (g *Graph) BFS(start int) []int {
    visited := make(map[int]bool)
    queue := []int{start}
    visited[start] = true
    var order []int

    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        order = append(order, node)

        for _, neighbor := range g.adj[node] {
            if !visited[neighbor] {
                visited[neighbor] = true
                queue = append(queue, neighbor)
            }
        }
    }
    return order
}

// ========== DFS — Recursive ==========
func (g *Graph) DFSRecursive(start int) []int {
    visited := make(map[int]bool)
    var order []int
    g.dfsHelper(start, visited, &order)
    return order
}

func (g *Graph) dfsHelper(node int, visited map[int]bool, order *[]int) {
    visited[node] = true
    *order = append(*order, node)
    for _, neighbor := range g.adj[node] {
        if !visited[neighbor] {
            g.dfsHelper(neighbor, visited, order)
        }
    }
}

// ========== DFS — Iterative (dùng stack) ==========
func (g *Graph) DFSIterative(start int) []int {
    visited := make(map[int]bool)
    stack := []int{start}
    var order []int

    for len(stack) > 0 {
        node := stack[len(stack)-1]
        stack = stack[:len(stack)-1]

        if visited[node] {
            continue
        }
        visited[node] = true
        order = append(order, node)

        // Push neighbors (reverse order to match recursive)
        neighbors := g.adj[node]
        for i := len(neighbors) - 1; i >= 0; i-- {
            if !visited[neighbors[i]] {
                stack = append(stack, neighbors[i])
            }
        }
    }
    return order
}

func main() {
    g := NewGraph()
    //   0 --- 1
    //   |     |
    //   2 --- 3 --- 4
    g.AddEdge(0, 1)
    g.AddEdge(0, 2)
    g.AddEdge(1, 3)
    g.AddEdge(2, 3)
    g.AddEdge(3, 4)

    fmt.Println("BFS from 0:          ", g.BFS(0))
    fmt.Println("DFS recursive from 0:", g.DFSRecursive(0))
    fmt.Println("DFS iterative from 0:", g.DFSIterative(0))
}
```

---

### Q28: Dijkstra's shortest path with priority queue. 🔴 🔴 [Senior]

**A:** Dijkstra tìm shortest path từ nguồn đến tất cả nodes trong weighted graph (non-negative weights). Complexity: O((V + E) log V) với priority queue.

```go
package main

import (
    "container/heap"
    "fmt"
    "math"
)

type Edge struct {
    To, Weight int
}

type Graph struct {
    adj map[int][]Edge
}

func NewGraph() *Graph {
    return &Graph{adj: make(map[int][]Edge)}
}

func (g *Graph) AddEdge(from, to, weight int) {
    g.adj[from] = append(g.adj[from], Edge{to, weight})
    g.adj[to] = append(g.adj[to], Edge{from, weight}) // undirected
}

// Priority queue item
type PQItem struct {
    Node, Dist int
}

type PQ []PQItem

func (pq PQ) Len() int            { return len(pq) }
func (pq PQ) Less(i, j int) bool  { return pq[i].Dist < pq[j].Dist }
func (pq PQ) Swap(i, j int)       { pq[i], pq[j] = pq[j], pq[i] }
func (pq *PQ) Push(x any)         { *pq = append(*pq, x.(PQItem)) }
func (pq *PQ) Pop() any {
    old := *pq
    n := len(old)
    val := old[n-1]
    *pq = old[:n-1]
    return val
}

func Dijkstra(g *Graph, source int) (dist map[int]int, prev map[int]int) {
    dist = make(map[int]int)
    prev = make(map[int]int)

    // Initialize distances to infinity
    for node := range g.adj {
        dist[node] = math.MaxInt64
    }
    dist[source] = 0
    prev[source] = -1

    pq := &PQ{{source, 0}}
    heap.Init(pq)

    for pq.Len() > 0 {
        curr := heap.Pop(pq).(PQItem)

        // Skip nếu đã tìm được path ngắn hơn
        if curr.Dist > dist[curr.Node] {
            continue
        }

        for _, edge := range g.adj[curr.Node] {
            newDist := dist[curr.Node] + edge.Weight
            if newDist < dist[edge.To] {
                dist[edge.To] = newDist
                prev[edge.To] = curr.Node
                heap.Push(pq, PQItem{edge.To, newDist})
            }
        }
    }
    return
}

// Reconstruct path từ source đến target
func reconstructPath(prev map[int]int, target int) []int {
    var path []int
    for node := target; node != -1; node = prev[node] {
        path = append(path, node)
    }
    // Reverse
    for i, j := 0, len(path)-1; i < j; i, j = i+1, j-1 {
        path[i], path[j] = path[j], path[i]
    }
    return path
}

func main() {
    g := NewGraph()
    //   0 --4-- 1 --1-- 3
    //   |       |       |
    //   2       2       5
    //   |       |       |
    //   2 --3-- 4 --1-- 5
    g.AddEdge(0, 1, 4)
    g.AddEdge(0, 2, 2)
    g.AddEdge(1, 3, 1)
    g.AddEdge(1, 4, 2)
    g.AddEdge(2, 4, 3)
    g.AddEdge(3, 5, 5)
    g.AddEdge(4, 5, 1)

    dist, prev := Dijkstra(g, 0)

    fmt.Println("Shortest distances from node 0:")
    for node, d := range dist {
        path := reconstructPath(prev, node)
        fmt.Printf("  → Node %d: distance=%d path=%v\n", node, d, path)
    }
    // → Node 0: distance=0 path=[0]
    // → Node 1: distance=4 path=[0 1]
    // → Node 2: distance=2 path=[0 2]
    // → Node 3: distance=5 path=[0 1 3]
    // → Node 4: distance=5 path=[0 2 4]
    // → Node 5: distance=6 path=[0 2 4 5]
}
```

---

### Q29: Topological Sort — Kahn's algorithm (BFS). 🔴 🔴 [Senior]

**A:** Topological sort xác định thứ tự thực hiện tasks có dependencies. Dùng nhiều trong build systems, course scheduling, microservice deployment order.

```go
package main

import "fmt"

func topologicalSort(numNodes int, edges [][]int) ([]int, bool) {
    // Build adjacency list và in-degree count
    adj := make([][]int, numNodes)
    inDegree := make([]int, numNodes)

    for _, e := range edges {
        from, to := e[0], e[1]
        adj[from] = append(adj[from], to)
        inDegree[to]++
    }

    // Enqueue tất cả nodes có in-degree = 0
    var queue []int
    for i := 0; i < numNodes; i++ {
        if inDegree[i] == 0 {
            queue = append(queue, i)
        }
    }

    var order []int
    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        order = append(order, node)

        for _, neighbor := range adj[node] {
            inDegree[neighbor]--
            if inDegree[neighbor] == 0 {
                queue = append(queue, neighbor)
            }
        }
    }

    // Nếu không visit hết → có cycle
    if len(order) != numNodes {
        return nil, false // cycle detected!
    }
    return order, true
}

func main() {
    // Course prerequisites:
    // 0: Intro CS
    // 1: Data Structures (requires 0)
    // 2: Algorithms (requires 1)
    // 3: Databases (requires 1)
    // 4: System Design (requires 2, 3)
    edges := [][]int{
        {0, 1}, // 0 → 1
        {1, 2}, // 1 → 2
        {1, 3}, // 1 → 3
        {2, 4}, // 2 → 4
        {3, 4}, // 3 → 4
    }

    order, ok := topologicalSort(5, edges)
    if ok {
        fmt.Println("Course order:", order) // [0 1 2 3 4] or [0 1 3 2 4]
    }

    // Test cycle detection
    cycleEdges := [][]int{{0, 1}, {1, 2}, {2, 0}}
    _, ok = topologicalSort(3, cycleEdges)
    fmt.Println("Has valid order (cycle):", ok) // false
}
```

---

## 9. Trie (Prefix Tree)

### Q30: Implement Trie with Insert, Search, StartsWith, and Autocomplete. 🟡 🟡 [Mid]

**A:** Trie (prefix tree) cực kỳ hiệu quả cho prefix-based operations. Dùng trong autocomplete, spell check, IP routing (longest prefix match).

```go
package main

import "fmt"

type TrieNode struct {
    children map[rune]*TrieNode
    isEnd    bool
    word     string // lưu word đầy đủ tại leaf (tiện cho autocomplete)
}

type Trie struct {
    root *TrieNode
}

func NewTrie() *Trie {
    return &Trie{root: &TrieNode{children: make(map[rune]*TrieNode)}}
}

// Insert word — O(m) where m = word length
func (t *Trie) Insert(word string) {
    node := t.root
    for _, ch := range word {
        if _, ok := node.children[ch]; !ok {
            node.children[ch] = &TrieNode{children: make(map[rune]*TrieNode)}
        }
        node = node.children[ch]
    }
    node.isEnd = true
    node.word = word
}

// Search exact word — O(m)
func (t *Trie) Search(word string) bool {
    node := t.findNode(word)
    return node != nil && node.isEnd
}

// StartsWith — check if any word has this prefix — O(m)
func (t *Trie) StartsWith(prefix string) bool {
    return t.findNode(prefix) != nil
}

// helper: traverse to node matching prefix
func (t *Trie) findNode(prefix string) *TrieNode {
    node := t.root
    for _, ch := range prefix {
        if _, ok := node.children[ch]; !ok {
            return nil
        }
        node = node.children[ch]
    }
    return node
}

// Autocomplete — trả về tất cả words có prefix cho trước
func (t *Trie) Autocomplete(prefix string, limit int) []string {
    node := t.findNode(prefix)
    if node == nil {
        return nil
    }

    var results []string
    t.collectWords(node, &results, limit)
    return results
}

func (t *Trie) collectWords(node *TrieNode, results *[]string, limit int) {
    if len(*results) >= limit {
        return
    }
    if node.isEnd {
        *results = append(*results, node.word)
    }
    for _, child := range node.children {
        t.collectWords(child, results, limit)
    }
}

func main() {
    trie := NewTrie()

    words := []string{
        "golang", "google", "good", "goodbye",
        "grab", "graph", "great",
        "microsoft", "microservice",
    }
    for _, w := range words {
        trie.Insert(w)
    }

    fmt.Println("Search 'golang':", trie.Search("golang"))     // true
    fmt.Println("Search 'golan':", trie.Search("golan"))       // false
    fmt.Println("StartsWith 'go':", trie.StartsWith("go"))     // true
    fmt.Println("StartsWith 'gy':", trie.StartsWith("gy"))     // false

    fmt.Println("\nAutocomplete 'go':", trie.Autocomplete("go", 10))
    // [golang google good goodbye]

    fmt.Println("Autocomplete 'gr':", trie.Autocomplete("gr", 10))
    // [grab graph great]

    fmt.Println("Autocomplete 'micro':", trie.Autocomplete("micro", 10))
    // [microsoft microservice]
}
```

**Use cases thực tế:**
- **Autocomplete:** Search bar suggestions (Google, Zalo search)
- **Spell checker:** Suggest corrections by finding closest prefix matches
- **IP routing:** Longest prefix match cho routing table
- **T9 keyboard:** Phone number to word mapping

---

## 10. Advanced Structures

### Q31: Bloom Filter — concept and Go implementation. 🔴 🔴 [Senior]

**A:** Bloom Filter là probabilistic data structure: trả lời "definitely NOT in set" hoặc "PROBABLY in set". Không bao giờ false negative, nhưng có thể false positive.

**Use cases:**
- **LSM-Tree** (LevelDB, RocksDB, CockroachDB): check key có trong SSTable không trước khi đọc disk
- **Cache check:** tránh query database cho keys chắc chắn không tồn tại
- **Spam filter:** check email/URL có trong blacklist không
- **CDN:** check nếu content đã cached

```go
package main

import (
    "fmt"
    "hash"
    "hash/fnv"
    "math"
)

type BloomFilter struct {
    bits    []bool
    size    uint
    hashFns []hash.Hash64
    numHash int
}

// NewBloomFilter tạo Bloom Filter với expected items và false positive rate
func NewBloomFilter(expectedItems int, fpRate float64) *BloomFilter {
    // Tính optimal size: m = -n*ln(p) / (ln2)^2
    m := uint(math.Ceil(-float64(expectedItems) * math.Log(fpRate) / (math.Ln2 * math.Ln2)))
    // Tính optimal number of hash functions: k = (m/n) * ln2
    k := int(math.Ceil(float64(m) / float64(expectedItems) * math.Ln2))

    return &BloomFilter{
        bits:    make([]bool, m),
        size:    m,
        numHash: k,
    }
}

// hash trả về k hash values cho data
func (bf *BloomFilter) hash(data []byte) []uint {
    h1 := fnv.New64()
    h1.Write(data)
    hash1 := h1.Sum64()

    h2 := fnv.New64a()
    h2.Write(data)
    hash2 := h2.Sum64()

    // Double hashing technique: h(i) = h1 + i*h2
    hashes := make([]uint, bf.numHash)
    for i := 0; i < bf.numHash; i++ {
        hashes[i] = uint((hash1 + uint64(i)*hash2) % uint64(bf.size))
    }
    return hashes
}

func (bf *BloomFilter) Add(item string) {
    for _, h := range bf.hash([]byte(item)) {
        bf.bits[h] = true
    }
}

// Test: false = definitely not in set, true = probably in set
func (bf *BloomFilter) Test(item string) bool {
    for _, h := range bf.hash([]byte(item)) {
        if !bf.bits[h] {
            return false // definitely NOT in set
        }
    }
    return true // PROBABLY in set (có thể false positive)
}

func main() {
    // Tạo Bloom Filter cho 1 triệu items, 1% false positive rate
    bf := NewBloomFilter(1_000_000, 0.01)
    fmt.Printf("Bloom filter: %d bits (%.2f MB), %d hash functions\n",
        bf.size, float64(bf.size)/(8*1024*1024), bf.numHash)

    // Add items
    bf.Add("alice@example.com")
    bf.Add("bob@example.com")
    bf.Add("charlie@example.com")

    // Test
    fmt.Println("alice:", bf.Test("alice@example.com"))     // true
    fmt.Println("bob:", bf.Test("bob@example.com"))         // true
    fmt.Println("unknown:", bf.Test("unknown@example.com")) // false (definitely not)
    fmt.Println("dave:", bf.Test("dave@example.com"))       // false (probably)
}
```

**Interview tip:** Bloom Filter KHÔNG support delete (vì clear bit có thể ảnh hưởng item khác). Nếu cần delete, dùng **Counting Bloom Filter** (thay bool bằng counter).

---

### Q32: Ring Buffer (Circular Buffer) implementation. 🔴 🔴 [Senior]

**A:** Ring Buffer là fixed-size buffer hoạt động như circular queue. Rất hiệu quả cho producer-consumer patterns, logging, network I/O buffering.

```go
package main

import (
    "errors"
    "fmt"
)

type RingBuffer[T any] struct {
    data  []T
    head  int  // read position
    tail  int  // write position
    count int  // current number of elements
    cap   int
}

func NewRingBuffer[T any](capacity int) *RingBuffer[T] {
    return &RingBuffer[T]{
        data: make([]T, capacity),
        cap:  capacity,
    }
}

func (rb *RingBuffer[T]) Write(val T) error {
    if rb.count == rb.cap {
        return errors.New("buffer full")
    }
    rb.data[rb.tail] = val
    rb.tail = (rb.tail + 1) % rb.cap // wrap around
    rb.count++
    return nil
}

// WriteOverwrite ghi đè phần tử cũ nhất nếu buffer đầy
func (rb *RingBuffer[T]) WriteOverwrite(val T) {
    if rb.count == rb.cap {
        rb.head = (rb.head + 1) % rb.cap // skip oldest
        rb.count--
    }
    rb.data[rb.tail] = val
    rb.tail = (rb.tail + 1) % rb.cap
    rb.count++
}

func (rb *RingBuffer[T]) Read() (T, error) {
    if rb.count == 0 {
        var zero T
        return zero, errors.New("buffer empty")
    }
    val := rb.data[rb.head]
    rb.head = (rb.head + 1) % rb.cap
    rb.count--
    return val, nil
}

func (rb *RingBuffer[T]) Len() int  { return rb.count }
func (rb *RingBuffer[T]) Cap() int  { return rb.cap }
func (rb *RingBuffer[T]) Full() bool { return rb.count == rb.cap }

func main() {
    rb := NewRingBuffer[string](3)

    rb.Write("msg-1")
    rb.Write("msg-2")
    rb.Write("msg-3")
    fmt.Println("Full:", rb.Full()) // true

    // Đọc
    v, _ := rb.Read()
    fmt.Println("Read:", v) // msg-1

    // Ghi thêm (có slot trống)
    rb.Write("msg-4")

    // Đọc hết
    for rb.Len() > 0 {
        v, _ := rb.Read()
        fmt.Println("Read:", v)
    }
    // msg-2, msg-3, msg-4

    fmt.Println("\n--- Overwrite mode ---")
    rb2 := NewRingBuffer[int](3)
    for i := 1; i <= 5; i++ {
        rb2.WriteOverwrite(i)
        fmt.Printf("Write %d → buffer len=%d\n", i, rb2.Len())
    }
    // Buffer chứa: [3, 4, 5] (1 và 2 bị overwrite)
    for rb2.Len() > 0 {
        v, _ := rb2.Read()
        fmt.Println("Read:", v) // 3, 4, 5
    }
}
```

**Use cases:**
- **Logging:** giữ N log entries gần nhất, overwrite cũ nhất
- **Network:** TCP receive buffer, rate limiter sliding window
- **Audio/Video:** streaming buffer
- **Metrics:** circular buffer cho last N samples (p99 latency)

---

### Q33: Skip List concept — why Redis uses it for sorted sets. 🔴 🔴 [Senior]

**A:** Skip List là probabilistic data structure — multi-level linked list cho phép O(log n) search, insert, delete. Redis dùng thay vì balanced BST cho ZSET.

```
Level 3:  1 ─────────────────────────────── 9
Level 2:  1 ──────── 4 ──────────────────── 9
Level 1:  1 ──── 3 ─ 4 ──── 6 ──── 7 ───── 9
Level 0:  1 ─ 2 ─ 3 ─ 4 ─ 5 ─ 6 ─ 7 ─ 8 ─ 9  (full linked list)

Search for 7:
- Start at Level 3, head: 1 → 9 (overshoot) → go down
- Level 2: 1 → 4 → 9 (overshoot) → go down
- Level 1: 4 → 6 → 7 ✓ Found!
```

```go
package main

import (
    "fmt"
    "math/rand"
)

const maxLevel = 16

type SkipNode struct {
    key   int
    value string
    next  []*SkipNode // next[i] = pointer at level i
}

type SkipList struct {
    head  *SkipNode
    level int // current max level
}

func NewSkipList() *SkipList {
    head := &SkipNode{next: make([]*SkipNode, maxLevel)}
    return &SkipList{head: head, level: 0}
}

// randomLevel — mỗi level có 50% chance
func randomLevel() int {
    level := 0
    for level < maxLevel-1 && rand.Float64() < 0.5 {
        level++
    }
    return level
}

func (sl *SkipList) Insert(key int, value string) {
    update := make([]*SkipNode, maxLevel)
    curr := sl.head

    // Tìm vị trí insert ở mỗi level (từ cao xuống thấp)
    for i := sl.level; i >= 0; i-- {
        for curr.next[i] != nil && curr.next[i].key < key {
            curr = curr.next[i]
        }
        update[i] = curr
    }

    level := randomLevel()
    if level > sl.level {
        for i := sl.level + 1; i <= level; i++ {
            update[i] = sl.head
        }
        sl.level = level
    }

    node := &SkipNode{
        key:   key,
        value: value,
        next:  make([]*SkipNode, level+1),
    }
    for i := 0; i <= level; i++ {
        node.next[i] = update[i].next[i]
        update[i].next[i] = node
    }
}

func (sl *SkipList) Search(key int) (string, bool) {
    curr := sl.head
    for i := sl.level; i >= 0; i-- {
        for curr.next[i] != nil && curr.next[i].key < key {
            curr = curr.next[i]
        }
    }
    curr = curr.next[0]
    if curr != nil && curr.key == key {
        return curr.value, true
    }
    return "", false
}

func (sl *SkipList) Print() {
    for i := sl.level; i >= 0; i-- {
        fmt.Printf("Level %d: ", i)
        node := sl.head.next[i]
        for node != nil {
            fmt.Printf("%d ", node.key)
            node = node.next[i]
        }
        fmt.Println()
    }
}

func main() {
    sl := NewSkipList()
    pairs := []struct{ k int; v string }{
        {3, "three"}, {6, "six"}, {7, "seven"},
        {9, "nine"}, {12, "twelve"}, {19, "nineteen"},
        {17, "seventeen"}, {26, "twenty-six"}, {21, "twenty-one"},
    }
    for _, p := range pairs {
        sl.Insert(p.k, p.v)
    }

    sl.Print()

    if v, ok := sl.Search(19); ok {
        fmt.Println("Found 19:", v)
    }
    if _, ok := sl.Search(15); !ok {
        fmt.Println("15 not found")
    }
}
```

**Tại sao Redis chọn Skip List thay vì Red-Black Tree cho ZSET:**

| Criteria | Skip List | Red-Black Tree |
|----------|-----------|----------------|
| Range queries | **Dễ** — follow next pointers | Phức tạp — cần in-order traversal |
| Implementation | **Đơn giản hơn** (~150 LOC) | Phức tạp (rotations, recoloring) |
| Concurrency | **Lock-free possible** | Khó implement lock-free |
| Memory locality | Tương đương | Tương đương |
| Avg complexity | O(log n) | O(log n) |
| ZRANGEBYSCORE | **O(log n + k)** — rất nhanh | O(log n + k) nhưng phức tạp hơn |

> *"Skip lists are simpler to implement, debug, and maintain. They also allow a very efficient implementation of ZRANGEBYSCORE."* — Salvatore Sanfilippo (Redis creator)

---

## Complexity Cheat Sheet

| Data Structure | Access | Search | Insert | Delete | Space | Notes |
|----------------|--------|--------|--------|--------|-------|-------|
| **Array** | O(1) | O(n) | O(n) | O(n) | O(n) | Fixed size |
| **Slice** | O(1) | O(n) | O(n)* | O(n) | O(n) | *Amortized O(1) append |
| **String** | O(1) byte | O(n) | - | - | O(n) | Immutable |
| **Map** | - | O(1) avg | O(1) avg | O(1) avg | O(n) | O(n) worst case |
| **Linked List** | O(n) | O(n) | O(1)** | O(1)** | O(n) | **With pointer to node |
| **Stack** | O(1) top | O(n) | O(1) push | O(1) pop | O(n) | LIFO |
| **Queue** | O(1) front | O(n) | O(1) enq | O(1) deq | O(n) | FIFO |
| **BST** | - | O(h) | O(h) | O(h) | O(n) | h = log n if balanced |
| **AVL Tree** | - | O(log n) | O(log n) | O(log n) | O(n) | Strictly balanced |
| **B+ Tree** | - | O(log n) | O(log n) | O(log n) | O(n) | High fan-out, disk-optimized |
| **Heap** | O(1) min/max | O(n) | O(log n) | O(log n) | O(n) | O(1) peek |
| **Trie** | - | O(m) | O(m) | O(m) | O(ALPHABET * m * n) | m = key length |
| **Bloom Filter** | - | O(k) | O(k) | - | O(m) | Probabilistic, no delete |
| **Skip List** | - | O(log n) | O(log n) | O(log n) | O(n log n) | Probabilistic |
| **Ring Buffer** | O(1) | - | O(1) | O(1) | O(n) | Fixed capacity |

---

## Interview Tips

### General Strategy

1. **Clarify first:** Luôn hỏi lại input constraints, edge cases, expected output format trước khi code
2. **Talk through approach:** Giải thích approach bằng lời trước khi viết code. Interviewer đánh giá thinking process nhiều hơn code hoàn chỉnh
3. **Start with brute force:** Nêu brute force solution trước, phân tích complexity, rồi optimize
4. **Test with examples:** Chạy dry-run code với 1-2 test cases sau khi viết xong

### Per-Company Patterns

| Company | Focus Areas | Tips |
|---------|-------------|------|
| **Google** | Tree, Graph, DP, System Design | Ưa chuộng optimal solution. Code phải clean. Hỏi follow-up nhiều |
| **Grab** | Graph (geospatial), Heap (K closest), Concurrency | Liên hệ bài toán với ride-hailing domain (tìm driver gần nhất, shortest route) |
| **Microsoft** | Linked List, Tree, Array | Coi trọng edge case handling và code quality |
| **Zalo** | Map, Concurrency, String processing | Focus messaging domain: string ops, concurrent data structures |
| **Axon** | Data pipeline, concurrent structures | Focus throughput, ring buffer, producer-consumer patterns |
| **Employment Hero** | Practical Go patterns, clean code | Coi trọng code readability, error handling, testing |

### Red Flags to Avoid

- Dùng `map` mà không handle concurrency khi hỏi concurrent scenario
- Quên pre-allocate slice khi biết trước size
- String concatenation bằng `+` trong loop
- Không dùng `comma, ok` idiom cho map lookup
- Return sub-slice từ large slice (memory leak)
- Confuse `len()` của string (bytes) với số ký tự (runes)

### Must-Know Patterns

1. **Two pointers:** Array/Linked List problems
2. **Sliding window:** Substring/subarray problems
3. **Stack:** Parentheses matching, monotonic stack
4. **BFS/DFS:** Graph traversal, tree problems
5. **Binary search:** Sorted array, search space reduction
6. **Heap/PQ:** Top K, merge K sorted, scheduling
7. **Trie:** Prefix matching, autocomplete
8. **Union-Find:** Connected components, cycle detection in undirected graph

---

> **Next:** [02-algorithms.md](./02-algorithms.md) — Sorting, Searching, Dynamic Programming, Greedy
