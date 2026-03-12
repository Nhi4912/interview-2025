# Algorithms & Coding Patterns in Go / Thuật Toán và Mẫu Coding Go

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Data Structures Go](./06-data-structures-go.md) | [Algorithms Theory](../../shared/01-cs-fundamentals/algorithms-theory.md) | [LeetCode](../../leetcode/)

---

## Visual: Algorithm Pattern Map / Bản Đồ Các Mẫu Thuật Toán

```
PROBLEM TYPE                    PATTERN              TIME      GO STRUCTURE
────────────────────────────────────────────────────────────────────────────
"Find subarray/window"       →  Sliding Window       O(n)      two indices i,j
"Find pair with condition"   →  Two Pointers         O(n)      lo, hi from ends
"Search in sorted array"     →  Binary Search        O(log n)  lo,hi,mid loop
"Shortest path (unweighted)" →  BFS                  O(V+E)    [][]int + queue
"All paths / combinations"   →  Backtracking         O(n!)     recursion + undo
"Optimal subproblem"         →  Dynamic Programming  varies    dp[] array
"Top K elements"             →  Heap                 O(n log k) container/heap
"Sort"                       →  sort.Slice           O(n log n) standard library
"Connectivity"               →  Union-Find           O(α(n))   parent[] array
```

### Sorting Algorithm Comparison / So Sánh Thuật Toán Sắp Xếp
```
Input: [5, 3, 8, 1, 9, 2, 4, 7, 6]

QUICK SORT (divide by pivot):
  pivot=5: [3,1,2,4] 5 [8,9,7,6]
  Recurse: [1,2,3,4] 5 [6,7,8,9]
  Best/Avg: O(n log n) | Worst: O(n²) bad pivot | Space: O(log n)

MERGE SORT (divide, sort, merge):
  [5,3,8,1] [9,2,4,7,6]
  [5,3][8,1] [9,2][4,7,6]
  [3,5][1,8] [2,9][4,6,7]
  [1,3,5,8] [2,4,6,7,9]
  [1,2,3,4,5,6,7,8,9]
  Always: O(n log n) | Space: O(n) | Stable ✓

HEAP SORT:
  Build max-heap: O(n)
  Extract max n times: O(n log n)
  Always: O(n log n) | Space: O(1) | Not stable

Go standard library:
  sort.Slice → IntroSort (Quick+Heap+Insertion hybrid)
  Adaptive: uses insertion sort for n<12, merge sort for stability
```

### Two Pointers Pattern / Mẫu Hai Con Trỏ
```
OPPOSITE ENDS (sorted array, find pair sum):
arr = [1, 2, 3, 4, 5, 6]  target = 7
lo=0(1), hi=5(6): sum=7 ✓

lo=0   →→→→→→
              ←←←← hi=5
Move lo right if sum < target
Move hi left  if sum > target

SAME DIRECTION (remove duplicates, fast/slow):
arr = [1,1,2,2,3]
slow=0
fast scans: 1(dup,skip) 2(new,write) 2(dup,skip) 3(new,write)
Result: arr[:3] = [1,2,3]
```

### Binary Search Template / Mẫu Tìm Kiếm Nhị Phân
```
FIND EXACT VALUE:
  lo, hi = 0, len-1
  while lo <= hi:
    mid = lo + (hi-lo)/2
    if arr[mid] == target: return mid
    if arr[mid] < target: lo = mid+1
    else: hi = mid-1

FIND FIRST TRUE (leftmost):
  lo, hi = 0, len-1; result = -1
  while lo <= hi:
    mid = lo + (hi-lo)/2
    if condition(arr[mid]):
      result = mid; hi = mid-1  ← search left for first
    else: lo = mid+1

BINARY SEARCH ON ANSWER:
  lo, hi = minPossible, maxPossible
  while lo < hi:
    mid = lo + (hi-lo)/2
    if canAchieve(mid): hi = mid  ← try smaller
    else: lo = mid+1
  return lo
```

---

## Table of Contents

1. [Complexity Analysis (Big-O)](#1-complexity-analysis-big-o)
2. [Sorting Algorithms](#2-sorting-algorithms)
3. [Searching](#3-searching)
4. [Two Pointers Pattern](#4-two-pointers-pattern)
5. [Sliding Window Pattern](#5-sliding-window-pattern)
6. [Dynamic Programming](#6-dynamic-programming)
7. [Greedy Algorithms](#7-greedy-algorithms)
8. [Graph Algorithms](#8-graph-algorithms)
9. [Backtracking](#9-backtracking)
10. [String Algorithms](#10-string-algorithms)
11. [Bit Manipulation](#11-bit-manipulation)
12. [Interview Coding Patterns Summary](#12-interview-coding-patterns-summary)
13. [Cheat Sheet & Practice Recommendations](#13-cheat-sheet--practice-recommendations)

---

## 1. Complexity Analysis (Big-O)


## Câu Hỏi Phỏng Vấn / Interview Q&A
### Q: Big-O là gì và tại sao quan trọng trong interview? 🟢 🟢 [Junior]

**A:** Big-O notation mô tả **upper bound** của thời gian/bộ nhớ mà algorithm cần khi input tăng lên. Trong interview, interviewer đánh giá bạn qua khả năng phân tích complexity — đây là skill bắt buộc.

**Các mức complexity phổ biến (từ nhanh → chậm):**

| Big-O | Name | Ví dụ |
|-------|------|-------|
| O(1) | Constant | Hash map lookup, array index access |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Single loop qua array |
| O(n log n) | Linearithmic | Merge sort, Quick sort (average) |
| O(n²) | Quadratic | Nested loops, Bubble sort |
| O(2^n) | Exponential | Recursive Fibonacci (naive), subsets |
| O(n!) | Factorial | Permutations (brute force) |

```go
package main

import "fmt"

// O(1) — Constant time: không phụ thuộc vào n
func getFirst(arr []int) int {
    return arr[0]
}

// O(log n) — Logarithmic: mỗi bước chia đôi search space
func binarySearch(arr []int, target int) int {
    lo, hi := 0, len(arr)-1
    for lo <= hi {
        mid := lo + (hi-lo)/2
        if arr[mid] == target {
            return mid
        } else if arr[mid] < target {
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }
    return -1
}

// O(n) — Linear: duyệt qua mỗi element 1 lần
func sum(arr []int) int {
    total := 0
    for _, v := range arr {
        total += v
    }
    return total
}

// O(n log n) — Linearithmic: sort rồi process
// sort.Slice internally uses pdqsort -> O(n log n) average
func sortExample(arr []int) {
    // sort.Ints(arr) // O(n log n)
    _ = arr
}

// O(n²) — Quadratic: nested loops
func hasDuplicate(arr []int) bool {
    for i := 0; i < len(arr); i++ {
        for j := i + 1; j < len(arr); j++ {
            if arr[i] == arr[j] {
                return true
            }
        }
    }
    return false
}

// O(2^n) — Exponential: recursive subsets
func subsets(nums []int) [][]int {
    result := [][]int{}
    var backtrack func(start int, current []int)
    backtrack = func(start int, current []int) {
        tmp := make([]int, len(current))
        copy(tmp, current)
        result = append(result, tmp)
        for i := start; i < len(nums); i++ {
            backtrack(i+1, append(current, nums[i]))
        }
    }
    backtrack(0, []int{})
    return result
}

func main() {
    arr := []int{1, 3, 5, 7, 9}
    fmt.Println("First:", getFirst(arr))         // O(1)
    fmt.Println("Search:", binarySearch(arr, 5))  // O(log n)
    fmt.Println("Sum:", sum(arr))                 // O(n)
    fmt.Println("Dup:", hasDuplicate(arr))        // O(n²)
    fmt.Println("Subsets:", subsets([]int{1, 2})) // O(2^n)
}
```

---

### Q: Phân tích Space Complexity như thế nào? 🟡 🟡 [Mid]

**A:** Space complexity đo **bộ nhớ phụ** (auxiliary space) mà algorithm cần, **không tính input**.

```go
// O(1) space — chỉ dùng vài biến
func reverseInPlace(arr []int) {
    l, r := 0, len(arr)-1
    for l < r {
        arr[l], arr[r] = arr[r], arr[l]
        l++
        r--
    }
}

// O(n) space — tạo array mới
func reverseNewArray(arr []int) []int {
    n := len(arr)
    result := make([]int, n)
    for i, v := range arr {
        result[n-1-i] = v
    }
    return result
}

// O(n) space — recursion stack depth = n
func factorial(n int) int {
    if n <= 1 {
        return 1
    }
    return n * factorial(n-1) // stack depth = n
}

// O(log n) space — recursion stack depth = log n
func binarySearchRecursive(arr []int, target, lo, hi int) int {
    if lo > hi {
        return -1
    }
    mid := lo + (hi-lo)/2
    if arr[mid] == target {
        return mid
    }
    if arr[mid] < target {
        return binarySearchRecursive(arr, target, mid+1, hi)
    }
    return binarySearchRecursive(arr, target, lo, mid-1)
}
```

**Lưu ý quan trọng cho interview:**
- Recursion luôn tốn stack space = O(depth)
- Hash map tốn O(n) space
- Khi interviewer hỏi "optimize", thường ý là giảm space complexity

---

### Q: Amortized Analysis là gì? Cho ví dụ với Go slice? 🔴 🔴 [Senior]

**A:** Amortized analysis tính **chi phí trung bình** trên một chuỗi operations. Dù một operation riêng lẻ có thể đắt (ví dụ: resize slice), trung bình mỗi operation vẫn rẻ.

**Ví dụ kinh điển: Go slice append**

```go
package main

import "fmt"

func main() {
    // Go slice doubles capacity khi cần grow (với small slices)
    // Khi len < 256: cap mới = cap cũ * 2
    // Khi len >= 256: cap mới ≈ cap cũ * 1.25 (smooth growth)
    s := make([]int, 0)
    for i := 0; i < 20; i++ {
        s = append(s, i)
        fmt.Printf("len=%d cap=%d\n", len(s), cap(s))
    }
    // Mỗi lần resize: copy O(n) elements
    // Nhưng resize chỉ xảy ra O(log n) lần
    // => Amortized cost per append = O(1)
}

// Phân tích chi tiết:
// - append 1 element: thường O(1) vì có capacity thừa
// - Khi đầy: allocate array mới gấp đôi, copy n elements -> O(n)
// - Nhưng resize chỉ xảy ra khi n = 1, 2, 4, 8, 16, ...
// - Tổng cost cho n appends: n + n/2 + n/4 + ... + 1 ≈ 2n
// - Amortized cost per append: 2n/n = O(1)
```

---

### Q: Phân tích complexity của nested loops và recursion? 🟡 🟡 [Mid]

**A:**

```go
// === NESTED LOOPS ===

// Case 1: Dependent inner loop -> O(n²)
func case1(n int) int {
    count := 0
    for i := 0; i < n; i++ {
        for j := 0; j < n; j++ {
            count++
        }
    }
    return count // n * n = n²
}

// Case 2: Inner loop depends on outer -> O(n²)
// Tổng: 0 + 1 + 2 + ... + (n-1) = n*(n-1)/2 = O(n²)
func case2(n int) int {
    count := 0
    for i := 0; i < n; i++ {
        for j := 0; j < i; j++ {
            count++
        }
    }
    return count
}

// Case 3: Inner loop halves -> O(n log n)
func case3(n int) int {
    count := 0
    for i := 0; i < n; i++ {
        for j := n; j > 0; j /= 2 {
            count++
        }
    }
    return count // n * log(n)
}

// === RECURSION ===

// Master Theorem cho T(n) = aT(n/b) + O(n^d)
// Case 1: d < log_b(a) => O(n^(log_b(a)))
// Case 2: d == log_b(a) => O(n^d * log n)
// Case 3: d > log_b(a) => O(n^d)

// Merge sort: T(n) = 2T(n/2) + O(n)
// a=2, b=2, d=1 => log_2(2) = 1 = d => Case 2 => O(n log n)

// Binary search: T(n) = T(n/2) + O(1)
// a=1, b=2, d=0 => log_2(1) = 0 = d => Case 2 => O(log n)

// Fibonacci naive: T(n) = T(n-1) + T(n-2) ≈ 2T(n-1)
// => O(2^n)
func fibNaive(n int) int {
    if n <= 1 {
        return n
    }
    return fibNaive(n-1) + fibNaive(n-2) // O(2^n) time, O(n) stack space
}
```

> **Interview Tip:** Khi interviewer hỏi complexity, luôn nói cả **Time** và **Space**. Nhiều candidate quên phân tích space, mất điểm.

---

## 2. Sorting Algorithms

### Q: Implement Quick Sort trong Go? Phân tích kỹ. 🟡 🟡 [Mid]

**A:** Quick Sort là **divide-and-conquer** algorithm. Chọn pivot, partition array thành 2 phần (nhỏ hơn pivot / lớn hơn pivot), rồi sort đệ quy.

```go
package main

import (
    "fmt"
    "math/rand"
)

// Quick Sort — Lomuto partition scheme
func quickSort(arr []int, lo, hi int) {
    if lo < hi {
        p := partition(arr, lo, hi)
        quickSort(arr, lo, p-1)
        quickSort(arr, p+1, hi)
    }
}

func partition(arr []int, lo, hi int) int {
    pivot := arr[hi] // Chọn phần tử cuối làm pivot
    i := lo - 1      // Index of smaller element
    for j := lo; j < hi; j++ {
        if arr[j] <= pivot {
            i++
            arr[i], arr[j] = arr[j], arr[i]
        }
    }
    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    return i + 1
}

// Quick Sort — Hoare partition (hiệu quả hơn, ít swap hơn)
func quickSortHoare(arr []int, lo, hi int) {
    if lo < hi {
        p := partitionHoare(arr, lo, hi)
        quickSortHoare(arr, lo, p)
        quickSortHoare(arr, p+1, hi)
    }
}

func partitionHoare(arr []int, lo, hi int) int {
    pivot := arr[lo+(hi-lo)/2] // Pivot ở giữa — tránh worst case
    i, j := lo-1, hi+1
    for {
        for {
            i++
            if arr[i] >= pivot {
                break
            }
        }
        for {
            j--
            if arr[j] <= pivot {
                break
            }
        }
        if i >= j {
            return j
        }
        arr[i], arr[j] = arr[j], arr[i]
    }
}

// Randomized Quick Sort — Tránh worst case O(n²)
// Khi input đã sorted hoặc nearly sorted
func quickSortRandomized(arr []int, lo, hi int) {
    if lo < hi {
        // Random pivot giúp expected time luôn O(n log n)
        randIdx := lo + rand.Intn(hi-lo+1)
        arr[randIdx], arr[hi] = arr[hi], arr[randIdx]
        p := partition(arr, lo, hi)
        quickSortRandomized(arr, lo, p-1)
        quickSortRandomized(arr, p+1, hi)
    }
}

func main() {
    arr := []int{10, 7, 8, 9, 1, 5}
    quickSort(arr, 0, len(arr)-1)
    fmt.Println("Quick Sort:", arr)

    arr2 := []int{10, 7, 8, 9, 1, 5}
    quickSortHoare(arr2, 0, len(arr2)-1)
    fmt.Println("Quick Sort Hoare:", arr2)
}
```

| Metric | Quick Sort |
|--------|-----------|
| Best | O(n log n) |
| Average | O(n log n) |
| Worst | O(n²) — khi pivot luôn là min/max |
| Space | O(log n) — recursion stack |
| Stable | No |
| In-place | Yes |

---

### Q: Implement Merge Sort? Khi nào dùng Merge Sort thay Quick Sort? 🟡 🟡 [Mid]

**A:** Merge Sort ổn định O(n log n) trong **mọi trường hợp**. Là **stable sort** — giữ thứ tự tương đối của equal elements. Phù hợp cho sorting linked lists (không cần random access).

```go
package main

import "fmt"

func mergeSort(arr []int) []int {
    n := len(arr)
    if n <= 1 {
        return arr
    }

    mid := n / 2
    left := mergeSort(arr[:mid])
    right := mergeSort(arr[mid:])

    return merge(left, right)
}

func merge(left, right []int) []int {
    result := make([]int, 0, len(left)+len(right))
    i, j := 0, 0

    for i < len(left) && j < len(right) {
        if left[i] <= right[j] { // <= đảm bảo stable
            result = append(result, left[i])
            i++
        } else {
            result = append(result, right[j])
            j++
        }
    }

    result = append(result, left[i:]...)
    result = append(result, right[j:]...)
    return result
}

// In-place merge sort (giảm space nhưng phức tạp hơn)
func mergeSortInPlace(arr []int, lo, hi int) {
    if lo >= hi {
        return
    }
    mid := lo + (hi-lo)/2
    mergeSortInPlace(arr, lo, mid)
    mergeSortInPlace(arr, mid+1, hi)
    mergeInPlace(arr, lo, mid, hi)
}

func mergeInPlace(arr []int, lo, mid, hi int) {
    left := make([]int, mid-lo+1)
    right := make([]int, hi-mid)
    copy(left, arr[lo:mid+1])
    copy(right, arr[mid+1:hi+1])

    i, j, k := 0, 0, lo
    for i < len(left) && j < len(right) {
        if left[i] <= right[j] {
            arr[k] = left[i]
            i++
        } else {
            arr[k] = right[j]
            j++
        }
        k++
    }
    for i < len(left) {
        arr[k] = left[i]
        i++
        k++
    }
    for j < len(right) {
        arr[k] = right[j]
        j++
        k++
    }
}

func main() {
    arr := []int{38, 27, 43, 3, 9, 82, 10}
    sorted := mergeSort(arr)
    fmt.Println("Merge Sort:", sorted)

    arr2 := []int{38, 27, 43, 3, 9, 82, 10}
    mergeSortInPlace(arr2, 0, len(arr2)-1)
    fmt.Println("Merge Sort In-Place:", arr2)
}
```

| Metric | Merge Sort |
|--------|-----------|
| Best/Avg/Worst | O(n log n) |
| Space | O(n) |
| Stable | Yes |
| In-place | No (standard) |

**Khi nào dùng Merge Sort thay Quick Sort:**
- Cần **stable sort** (giữ thứ tự equal elements)
- Sort **linked list** (merge sort không cần random access)
- Cần **guaranteed O(n log n)** worst case (Quick Sort worst = O(n²))
- External sorting (sort file lớn hơn RAM)

---

### Q: Implement Heap Sort dùng container/heap? 🟡 🟡 [Mid]

**A:**

```go
package main

import (
    "container/heap"
    "fmt"
)

// === Heap Sort from scratch ===
func heapSort(arr []int) {
    n := len(arr)

    // Build max heap: bắt đầu từ node không phải leaf
    for i := n/2 - 1; i >= 0; i-- {
        heapify(arr, n, i)
    }

    // Extract elements from heap one by one
    for i := n - 1; i > 0; i-- {
        arr[0], arr[i] = arr[i], arr[0] // Move max to end
        heapify(arr, i, 0)              // Heapify reduced heap
    }
}

func heapify(arr []int, n, i int) {
    largest := i
    left := 2*i + 1
    right := 2*i + 2

    if left < n && arr[left] > arr[largest] {
        largest = left
    }
    if right < n && arr[right] > arr[largest] {
        largest = right
    }
    if largest != i {
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)
    }
}

// === Sử dụng container/heap (Go standard library) ===
type IntHeap []int

func (h IntHeap) Len() int           { return len(h) }
func (h IntHeap) Less(i, j int) bool { return h[i] < h[j] } // Min-heap
func (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *IntHeap) Push(x interface{}) {
    *h = append(*h, x.(int))
}

func (h *IntHeap) Pop() interface{} {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}

func heapSortWithStdLib(arr []int) []int {
    h := &IntHeap{}
    heap.Init(h)

    for _, v := range arr {
        heap.Push(h, v)
    }

    result := make([]int, 0, len(arr))
    for h.Len() > 0 {
        result = append(result, heap.Pop(h).(int))
    }
    return result
}

func main() {
    arr := []int{12, 11, 13, 5, 6, 7}
    heapSort(arr)
    fmt.Println("Heap Sort:", arr)

    arr2 := []int{12, 11, 13, 5, 6, 7}
    fmt.Println("Heap Sort (stdlib):", heapSortWithStdLib(arr2))
}
```

| Metric | Heap Sort |
|--------|----------|
| Best/Avg/Worst | O(n log n) |
| Space | O(1) — in-place |
| Stable | No |

---

### Q: Go's sort package dùng algorithm gì? pdqsort là gì? 🔴 🔴 [Senior]

**A:** Từ Go 1.19, `sort.Slice` dùng **pdqsort (Pattern-Defeating Quicksort)** — hybrid algorithm kết hợp:
1. **Quicksort** cho average case
2. **Heap sort** khi phát hiện worst case (quá nhiều recursion)
3. **Insertion sort** cho small subarrays (< ~12 elements)

```go
package main

import (
    "fmt"
    "sort"
)

// sort.Slice — dùng pdqsort internally
func sortSliceExample() {
    nums := []int{5, 3, 8, 1, 9, 2}
    sort.Slice(nums, func(i, j int) bool {
        return nums[i] < nums[j]
    })
    fmt.Println("sort.Slice:", nums)
}

// sort.Interface — khi cần custom sorting
type Employee struct {
    Name   string
    Salary int
}

type BySalary []Employee

func (a BySalary) Len() int           { return len(a) }
func (a BySalary) Less(i, j int) bool { return a[i].Salary < a[j].Salary }
func (a BySalary) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

// sort.SliceStable — stable sort (dùng merge sort variant)
// Giữ thứ tự tương đối của equal elements
func stableSortExample() {
    people := []Employee{
        {"Alice", 50000},
        {"Bob", 50000},
        {"Charlie", 60000},
    }
    sort.SliceStable(people, func(i, j int) bool {
        return people[i].Salary < people[j].Salary
    })
    // Alice vẫn trước Bob vì stable sort
    fmt.Println("Stable sort:", people)
}

func main() {
    sortSliceExample()

    employees := BySalary{
        {"Charlie", 60000},
        {"Alice", 50000},
        {"Bob", 70000},
    }
    sort.Sort(employees)
    fmt.Println("sort.Interface:", employees)

    stableSortExample()
}
```

**pdqsort so với introsort (trước Go 1.19):**
- pdqsort phát hiện patterns (đã sorted, reverse sorted, few unique) và optimize
- Pivot chọn bằng **median-of-three** hoặc **ninther** (median of medians of three)
- Khi recursion depth > 2*log(n) -> fallback sang heapsort
- Kết quả: nhanh hơn ~10-30% trên real-world data

---

### Q: So sánh tất cả sorting algorithms? 🟡 🟡 [Mid]

| Algorithm | Best | Average | Worst | Space | Stable | Use Case |
|-----------|------|---------|-------|-------|--------|----------|
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No | General purpose, in-memory |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes | Linked lists, external sort, need stable |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No | Memory constrained, priority queue |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes | Small arrays, nearly sorted |
| Go pdqsort | O(n) | O(n log n) | O(n log n) | O(log n) | No | Go default, best hybrid |

> **Interview Tip:** Biết khi nào dùng `sort.Slice` vs `sort.SliceStable`. Nếu cần stable -> dùng `SliceStable`. Google/Grab hay hỏi "sort phức tạp" (ví dụ: sort by multiple keys) — dùng `sort.SliceStable` rồi sort 2 lần (secondary key trước, primary key sau).

---

## 3. Searching

### Q: Implement Binary Search — tìm chính xác, tìm first/last occurrence? 🟡 🟡 [Mid]

**A:** Binary Search là thuật toán tìm kiếm trên **sorted array** với O(log n).

```go
package main

import (
    "fmt"
    "sort"
)

// Standard Binary Search
func binarySearch(arr []int, target int) int {
    lo, hi := 0, len(arr)-1
    for lo <= hi {
        mid := lo + (hi-lo)/2 // Tránh overflow so với (lo+hi)/2
        if arr[mid] == target {
            return mid
        } else if arr[mid] < target {
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }
    return -1
}

// Find FIRST occurrence (lower bound)
// Khi có duplicates, tìm index nhỏ nhất có arr[i] == target
func findFirst(arr []int, target int) int {
    lo, hi := 0, len(arr)-1
    result := -1
    for lo <= hi {
        mid := lo + (hi-lo)/2
        if arr[mid] == target {
            result = mid  // Ghi nhận nhưng tiếp tục tìm bên trái
            hi = mid - 1
        } else if arr[mid] < target {
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }
    return result
}

// Find LAST occurrence (upper bound)
func findLast(arr []int, target int) int {
    lo, hi := 0, len(arr)-1
    result := -1
    for lo <= hi {
        mid := lo + (hi-lo)/2
        if arr[mid] == target {
            result = mid  // Ghi nhận nhưng tiếp tục tìm bên phải
            lo = mid + 1
        } else if arr[mid] < target {
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }
    return result
}

// Search in Rotated Sorted Array (LeetCode 33) — rất hay hỏi
func searchRotated(nums []int, target int) int {
    lo, hi := 0, len(nums)-1
    for lo <= hi {
        mid := lo + (hi-lo)/2
        if nums[mid] == target {
            return mid
        }
        // Xác định nửa nào sorted
        if nums[lo] <= nums[mid] { // Left half is sorted
            if target >= nums[lo] && target < nums[mid] {
                hi = mid - 1
            } else {
                lo = mid + 1
            }
        } else { // Right half is sorted
            if target > nums[mid] && target <= nums[hi] {
                lo = mid + 1
            } else {
                hi = mid - 1
            }
        }
    }
    return -1
}

func main() {
    arr := []int{1, 2, 2, 2, 3, 4, 5}
    fmt.Println("Binary Search:", binarySearch(arr, 2))    // any occurrence
    fmt.Println("First of 2:", findFirst(arr, 2))          // 1
    fmt.Println("Last of 2:", findLast(arr, 2))            // 3

    rotated := []int{4, 5, 6, 7, 0, 1, 2}
    fmt.Println("Rotated search:", searchRotated(rotated, 0)) // 4

    // Go's sort.Search — tìm index nhỏ nhất mà f(i) == true
    // Equivalent to lower_bound in C++
    idx := sort.Search(len(arr), func(i int) bool {
        return arr[i] >= 2
    })
    fmt.Println("sort.Search:", idx) // 1
}
```

---

### Q: Binary Search on Answer (Parametric Search) là gì? 🔴 🔴 [Senior]

**A:** Kỹ thuật dùng binary search **trên kết quả** thay vì trên array. Khi bài toán có dạng: "tìm giá trị nhỏ nhất/lớn nhất thỏa mãn điều kiện" và hàm điều kiện **monotonic**.

```go
package main

import "fmt"

// Ví dụ: Koko Eating Bananas (LeetCode 875)
// Cho piles bananas, tìm tốc độ ăn chậm nhất k để ăn hết trong h giờ.
func minEatingSpeed(piles []int, h int) int {
    // Binary search on answer: k từ 1 đến max(piles)
    lo, hi := 1, 0
    for _, p := range piles {
        if p > hi {
            hi = p
        }
    }

    canFinish := func(speed int) bool {
        hours := 0
        for _, p := range piles {
            hours += (p + speed - 1) / speed // ceiling division
        }
        return hours <= h
    }

    for lo < hi {
        mid := lo + (hi-lo)/2
        if canFinish(mid) {
            hi = mid // mid có thể là answer, tìm nhỏ hơn
        } else {
            lo = mid + 1 // mid không đủ nhanh
        }
    }
    return lo
}

// Ví dụ: Capacity To Ship Packages (LeetCode 1011)
func shipWithinDays(weights []int, days int) int {
    lo, hi := 0, 0
    for _, w := range weights {
        if w > lo {
            lo = w // Min capacity = max single package
        }
        hi += w // Max capacity = sum of all
    }

    canShip := func(cap int) bool {
        d, currentLoad := 1, 0
        for _, w := range weights {
            if currentLoad+w > cap {
                d++
                currentLoad = 0
            }
            currentLoad += w
        }
        return d <= days
    }

    for lo < hi {
        mid := lo + (hi-lo)/2
        if canShip(mid) {
            hi = mid
        } else {
            lo = mid + 1
        }
    }
    return lo
}

func main() {
    fmt.Println(minEatingSpeed([]int{3, 6, 7, 11}, 8))                       // 4
    fmt.Println(shipWithinDays([]int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, 5))    // 15
}
```

> **Interview Tip:** Binary search on answer rất phổ biến trong interview Google/Grab. Pattern nhận diện: "tìm min/max value thỏa mãn condition" + condition là monotonic (nếu k thỏa thì k+1 cũng thỏa).

---

## 4. Two Pointers Pattern

### Q: Giải thích Two Pointers pattern với các bài toán kinh điển? 🟡 🟡 [Mid]

**A:** Two Pointers dùng 2 con trỏ di chuyển trên array (thường sorted) để giảm complexity từ O(n²) xuống O(n).

```go
package main

import (
    "fmt"
    "sort"
)

// === Two Sum (sorted array) — O(n) ===
func twoSum(numbers []int, target int) []int {
    l, r := 0, len(numbers)-1
    for l < r {
        sum := numbers[l] + numbers[r]
        if sum == target {
            return []int{l, r}
        } else if sum < target {
            l++
        } else {
            r--
        }
    }
    return nil
}

// === Container With Most Water (LeetCode 11) — O(n) ===
// Rất hay hỏi ở Grab, Google
func maxArea(height []int) int {
    l, r := 0, len(height)-1
    maxWater := 0
    for l < r {
        width := r - l
        h := height[l]
        if height[r] < h {
            h = height[r]
        }
        water := width * h
        if water > maxWater {
            maxWater = water
        }
        // Di chuyển con trỏ phía thấp hơn
        // Vì giữ lại thanh thấp không thể tăng diện tích
        if height[l] < height[r] {
            l++
        } else {
            r--
        }
    }
    return maxWater
}

// === Remove Duplicates from Sorted Array (LeetCode 26) — O(n), O(1) space ===
func removeDuplicates(nums []int) int {
    if len(nums) == 0 {
        return 0
    }
    slow := 0 // slow pointer: vị trí write
    for fast := 1; fast < len(nums); fast++ {
        if nums[fast] != nums[slow] {
            slow++
            nums[slow] = nums[fast]
        }
    }
    return slow + 1
}

// === Three Sum (LeetCode 15) — O(n²) ===
// Rất phổ biến: Google, Microsoft, Grab đều hỏi
func threeSum(nums []int) [][]int {
    sort.Ints(nums) // Sort trước
    result := [][]int{}

    for i := 0; i < len(nums)-2; i++ {
        // Skip duplicates for first element
        if i > 0 && nums[i] == nums[i-1] {
            continue
        }

        l, r := i+1, len(nums)-1
        target := -nums[i]

        for l < r {
            sum := nums[l] + nums[r]
            if sum == target {
                result = append(result, []int{nums[i], nums[l], nums[r]})
                // Skip duplicates
                for l < r && nums[l] == nums[l+1] {
                    l++
                }
                for l < r && nums[r] == nums[r-1] {
                    r--
                }
                l++
                r--
            } else if sum < target {
                l++
            } else {
                r--
            }
        }
    }
    return result
}

func main() {
    fmt.Println("Two Sum:", twoSum([]int{2, 7, 11, 15}, 9))
    fmt.Println("Max Area:", maxArea([]int{1, 8, 6, 2, 5, 4, 8, 3, 7}))

    nums := []int{1, 1, 2, 2, 3}
    k := removeDuplicates(nums)
    fmt.Println("Remove Dups:", nums[:k])

    fmt.Println("Three Sum:", threeSum([]int{-1, 0, 1, 2, -1, -4}))
}
```

> **Interview Tip:** 3Sum là "must-know". Interviewer đánh giá bạn qua: (1) biết sort trước, (2) xử lý duplicate đúng, (3) phân tích complexity rõ ràng. Edge cases: empty array, tất cả cùng giá trị.

---

## 5. Sliding Window Pattern

### Q: Fixed vs Variable Sliding Window? Implement cả hai. 🟡 🟡 [Mid]

**A:** Sliding Window là kỹ thuật maintain một "cửa sổ" trên array/string, di chuyển từ trái sang phải. Giảm O(n*k) xuống O(n).

```go
package main

import "fmt"

// ============================================================
// FIXED WINDOW: Max sum subarray of size K
// ============================================================
func maxSumSubarrayK(arr []int, k int) int {
    if len(arr) < k {
        return -1
    }

    // Tính sum của window đầu tiên
    windowSum := 0
    for i := 0; i < k; i++ {
        windowSum += arr[i]
    }

    maxSum := windowSum
    // Slide window: thêm phần tử mới, bỏ phần tử cũ
    for i := k; i < len(arr); i++ {
        windowSum += arr[i] - arr[i-k]
        if windowSum > maxSum {
            maxSum = windowSum
        }
    }
    return maxSum
}

// ============================================================
// VARIABLE WINDOW: Smallest subarray with sum >= target (LeetCode 209)
// ============================================================
func minSubArrayLen(target int, nums []int) int {
    left := 0
    currentSum := 0
    minLen := len(nums) + 1

    for right := 0; right < len(nums); right++ {
        currentSum += nums[right]

        // Shrink window từ bên trái khi sum >= target
        for currentSum >= target {
            windowLen := right - left + 1
            if windowLen < minLen {
                minLen = windowLen
            }
            currentSum -= nums[left]
            left++
        }
    }

    if minLen == len(nums)+1 {
        return 0
    }
    return minLen
}

// ============================================================
// Longest Substring Without Repeating Characters (LeetCode 3)
// Rất hay hỏi: Google, Grab, Microsoft
// ============================================================
func lengthOfLongestSubstring(s string) int {
    charIndex := make(map[byte]int) // last index of each char
    maxLen := 0
    left := 0

    for right := 0; right < len(s); right++ {
        // Nếu char đã tồn tại trong window, move left pointer
        if idx, ok := charIndex[s[right]]; ok && idx >= left {
            left = idx + 1
        }
        charIndex[s[right]] = right

        if right-left+1 > maxLen {
            maxLen = right - left + 1
        }
    }
    return maxLen
}

// ============================================================
// Minimum Window Substring (LeetCode 76) — HARD
// Rất hay hỏi ở Google, Microsoft
// ============================================================
func minWindow(s string, t string) string {
    if len(s) == 0 || len(t) == 0 {
        return ""
    }

    // Count characters needed
    need := make(map[byte]int)
    for i := 0; i < len(t); i++ {
        need[t[i]]++
    }

    have := make(map[byte]int)
    formed := 0  // Number of unique chars in t that are satisfied
    required := len(need)

    left := 0
    minLen := len(s) + 1
    minLeft := 0

    for right := 0; right < len(s); right++ {
        c := s[right]
        have[c]++

        if need[c] > 0 && have[c] == need[c] {
            formed++
        }

        // Try to shrink window
        for formed == required {
            windowLen := right - left + 1
            if windowLen < minLen {
                minLen = windowLen
                minLeft = left
            }

            // Remove leftmost char
            leftChar := s[left]
            have[leftChar]--
            if need[leftChar] > 0 && have[leftChar] < need[leftChar] {
                formed--
            }
            left++
        }
    }

    if minLen == len(s)+1 {
        return ""
    }
    return s[minLeft : minLeft+minLen]
}

func main() {
    fmt.Println("Max Sum K=3:", maxSumSubarrayK([]int{2, 1, 5, 1, 3, 2}, 3)) // 9
    fmt.Println("Min SubArray:", minSubArrayLen(7, []int{2, 3, 1, 2, 4, 3}))  // 2
    fmt.Println("Longest Substring:", lengthOfLongestSubstring("abcabcbb"))     // 3
    fmt.Println("Min Window:", minWindow("ADOBECODEBANC", "ABC"))              // "BANC"
}
```

**Sliding Window template:**
```
1. Expand: move right pointer, add element to window
2. Shrink: while window is valid, try to shrink from left
3. Update answer at the appropriate point
```

> **Interview Tip:** Minimum Window Substring là bài **hard** nhưng rất phổ biến. Key insight: dùng 2 hash maps (`need` và `have`) + counter `formed` để biết khi nào window valid. Time: O(|s| + |t|), Space: O(|s| + |t|).

---

## 6. Dynamic Programming

### Q: Giải thích DP concepts: overlapping subproblems, optimal substructure? 🟡 🟡 [Mid]

**A:** Dynamic Programming giải bài toán bằng cách chia thành **subproblems** và lưu kết quả để tránh tính lại.

**2 điều kiện để dùng DP:**
1. **Overlapping Subproblems**: Cùng 1 subproblem được tính nhiều lần (ví dụ: fib(3) được gọi nhiều lần khi tính fib(5))
2. **Optimal Substructure**: Lời giải tối ưu của bài toán được xây dựng từ lời giải tối ưu của subproblems

**2 cách implement:**
- **Top-down (Memoization)**: Recursive + cache. Viết tự nhiên hơn.
- **Bottom-up (Tabulation)**: Iterative + build table. Thường tối ưu hơn (no recursion overhead).

```go
package main

import "fmt"

// ============================================================
// Fibonacci — Minh họa cả 3 approach
// ============================================================

// Naive recursive: O(2^n) time, O(n) space
func fibNaive(n int) int {
    if n <= 1 {
        return n
    }
    return fibNaive(n-1) + fibNaive(n-2)
}

// Top-down memoization: O(n) time, O(n) space
func fibMemo(n int) int {
    memo := make(map[int]int)
    var dp func(int) int
    dp = func(n int) int {
        if n <= 1 {
            return n
        }
        if v, ok := memo[n]; ok {
            return v
        }
        memo[n] = dp(n-1) + dp(n-2)
        return memo[n]
    }
    return dp(n)
}

// Bottom-up tabulation: O(n) time, O(n) space
func fibTab(n int) int {
    if n <= 1 {
        return n
    }
    dp := make([]int, n+1)
    dp[0], dp[1] = 0, 1
    for i := 2; i <= n; i++ {
        dp[i] = dp[i-1] + dp[i-2]
    }
    return dp[n]
}

// Space optimized: O(n) time, O(1) space
func fibOptimal(n int) int {
    if n <= 1 {
        return n
    }
    a, b := 0, 1
    for i := 2; i <= n; i++ {
        a, b = b, a+b
    }
    return b
}

// ============================================================
// Climbing Stairs (LeetCode 70) — n cách leo n bậc (1 hoặc 2 bước)
// ============================================================
func climbStairs(n int) int {
    if n <= 2 {
        return n
    }
    a, b := 1, 2
    for i := 3; i <= n; i++ {
        a, b = b, a+b
    }
    return b
}

// ============================================================
// Coin Change (LeetCode 322) — ít đồng xu nhất để đổi amount
// ============================================================
func coinChange(coins []int, amount int) int {
    dp := make([]int, amount+1)
    for i := range dp {
        dp[i] = amount + 1 // Sentinel value (impossible)
    }
    dp[0] = 0

    for i := 1; i <= amount; i++ {
        for _, coin := range coins {
            if coin <= i && dp[i-coin]+1 < dp[i] {
                dp[i] = dp[i-coin] + 1
            }
        }
    }

    if dp[amount] > amount {
        return -1
    }
    return dp[amount]
}

// ============================================================
// Longest Common Subsequence (LeetCode 1143) — LCS
// ============================================================
func longestCommonSubsequence(text1, text2 string) int {
    m, n := len(text1), len(text2)
    dp := make([][]int, m+1)
    for i := range dp {
        dp[i] = make([]int, n+1)
    }

    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if text1[i-1] == text2[j-1] {
                dp[i][j] = dp[i-1][j-1] + 1
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
            }
        }
    }
    return dp[m][n]
}

func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}

// ============================================================
// Longest Increasing Subsequence (LeetCode 300) — LIS
// ============================================================

// O(n²) DP approach
func lengthOfLIS(nums []int) int {
    n := len(nums)
    dp := make([]int, n) // dp[i] = length of LIS ending at i
    for i := range dp {
        dp[i] = 1
    }

    maxLen := 1
    for i := 1; i < n; i++ {
        for j := 0; j < i; j++ {
            if nums[j] < nums[i] && dp[j]+1 > dp[i] {
                dp[i] = dp[j] + 1
            }
        }
        if dp[i] > maxLen {
            maxLen = dp[i]
        }
    }
    return maxLen
}

// O(n log n) — patience sorting with binary search
func lengthOfLISOptimal(nums []int) int {
    // tails[i] = smallest tail element for LIS of length i+1
    tails := []int{}

    for _, num := range nums {
        // Binary search for the first tail >= num
        lo, hi := 0, len(tails)
        for lo < hi {
            mid := lo + (hi-lo)/2
            if tails[mid] < num {
                lo = mid + 1
            } else {
                hi = mid
            }
        }
        if lo == len(tails) {
            tails = append(tails, num)
        } else {
            tails[lo] = num
        }
    }
    return len(tails)
}

// ============================================================
// 0/1 Knapsack
// ============================================================
func knapsack(weights, values []int, capacity int) int {
    n := len(weights)
    dp := make([][]int, n+1)
    for i := range dp {
        dp[i] = make([]int, capacity+1)
    }

    for i := 1; i <= n; i++ {
        for w := 0; w <= capacity; w++ {
            dp[i][w] = dp[i-1][w] // Don't take item i
            if weights[i-1] <= w {
                val := dp[i-1][w-weights[i-1]] + values[i-1]
                if val > dp[i][w] {
                    dp[i][w] = val
                }
            }
        }
    }
    return dp[n][capacity]
}

// Space optimized: O(capacity) space
func knapsackOptimized(weights, values []int, capacity int) int {
    dp := make([]int, capacity+1)

    for i := 0; i < len(weights); i++ {
        // Traverse BACKWARDS to avoid using same item twice
        for w := capacity; w >= weights[i]; w-- {
            val := dp[w-weights[i]] + values[i]
            if val > dp[w] {
                dp[w] = val
            }
        }
    }
    return dp[capacity]
}

// ============================================================
// Edit Distance (LeetCode 72) — rất hay hỏi ở Google
// ============================================================
func minDistance(word1, word2 string) int {
    m, n := len(word1), len(word2)
    dp := make([][]int, m+1)
    for i := range dp {
        dp[i] = make([]int, n+1)
    }

    // Base cases
    for i := 0; i <= m; i++ {
        dp[i][0] = i // Delete all chars from word1
    }
    for j := 0; j <= n; j++ {
        dp[0][j] = j // Insert all chars of word2
    }

    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if word1[i-1] == word2[j-1] {
                dp[i][j] = dp[i-1][j-1] // Same char, no cost
            } else {
                dp[i][j] = 1 + minThree(
                    dp[i-1][j],   // Delete
                    dp[i][j-1],   // Insert
                    dp[i-1][j-1], // Replace
                )
            }
        }
    }
    return dp[m][n]
}

func minThree(a, b, c int) int {
    if a < b {
        if a < c {
            return a
        }
        return c
    }
    if b < c {
        return b
    }
    return c
}

// ============================================================
// Maximum Subarray — Kadane's Algorithm (LeetCode 53)
// ============================================================
func maxSubArray(nums []int) int {
    maxSum := nums[0]
    currentSum := nums[0]

    for i := 1; i < len(nums); i++ {
        // Either extend current subarray or start new one
        if currentSum+nums[i] > nums[i] {
            currentSum = currentSum + nums[i]
        } else {
            currentSum = nums[i]
        }
        if currentSum > maxSum {
            maxSum = currentSum
        }
    }
    return maxSum
}

func main() {
    fmt.Println("=== Fibonacci ===")
    fmt.Println("Naive:", fibNaive(10))
    fmt.Println("Memo:", fibMemo(10))
    fmt.Println("Tab:", fibTab(10))
    fmt.Println("Optimal:", fibOptimal(10))

    fmt.Println("\n=== Climbing Stairs ===")
    fmt.Println("n=5:", climbStairs(5)) // 8

    fmt.Println("\n=== Coin Change ===")
    fmt.Println(coinChange([]int{1, 5, 10, 25}, 30)) // 2 (25+5)

    fmt.Println("\n=== LCS ===")
    fmt.Println(longestCommonSubsequence("abcde", "ace")) // 3

    fmt.Println("\n=== LIS ===")
    fmt.Println(lengthOfLIS([]int{10, 9, 2, 5, 3, 7, 101, 18}))        // 4
    fmt.Println(lengthOfLISOptimal([]int{10, 9, 2, 5, 3, 7, 101, 18})) // 4

    fmt.Println("\n=== Knapsack ===")
    fmt.Println(knapsack([]int{1, 3, 4, 5}, []int{1, 4, 5, 7}, 7))          // 9
    fmt.Println(knapsackOptimized([]int{1, 3, 4, 5}, []int{1, 4, 5, 7}, 7)) // 9

    fmt.Println("\n=== Edit Distance ===")
    fmt.Println(minDistance("horse", "ros")) // 3

    fmt.Println("\n=== Max Subarray (Kadane's) ===")
    fmt.Println(maxSubArray([]int{-2, 1, -3, 4, -1, 2, 1, -5, 4})) // 6
}
```

> **Interview Tip:** DP là topic khó nhất. Approach khi gặp bài DP:
> 1. Xác định **state**: dp[i] hoặc dp[i][j] đại diện cho gì
> 2. Xác định **transition**: dp[i] = f(dp[i-1], ...)
> 3. Xác định **base case**
> 4. Xác định **answer**: dp[n] hay max(dp[i])
> 5. Optimize space nếu chỉ phụ thuộc previous row

---

## 7. Greedy Algorithms

### Q: Khi nào dùng Greedy? Cho ví dụ kinh điển? 🟡 🟡 [Mid]

**A:** Greedy chọn **locally optimal** ở mỗi bước, hy vọng đạt **globally optimal**. Chỉ đúng khi bài toán có **greedy choice property** (chọn local optimal không ảnh hưởng khả năng đạt global optimal).

```go
package main

import (
    "fmt"
    "sort"
)

// ============================================================
// Activity Selection / Interval Scheduling Maximization
// Chọn nhiều nhất các hoạt động không overlap
// ============================================================
type Interval struct {
    Start, End int
}

func maxActivities(intervals []Interval) int {
    // Sort by end time — greedy: chọn hoạt động kết thúc sớm nhất
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i].End < intervals[j].End
    })

    count := 1
    lastEnd := intervals[0].End

    for i := 1; i < len(intervals); i++ {
        if intervals[i].Start >= lastEnd {
            count++
            lastEnd = intervals[i].End
        }
    }
    return count
}

// ============================================================
// Jump Game (LeetCode 55) — có thể đến cuối array không?
// ============================================================
func canJump(nums []int) bool {
    maxReach := 0
    for i := 0; i < len(nums); i++ {
        if i > maxReach {
            return false // Không thể đến vị trí i
        }
        if i+nums[i] > maxReach {
            maxReach = i + nums[i]
        }
    }
    return true
}

// Jump Game II (LeetCode 45) — ít nhảy nhất để đến cuối
func jump(nums []int) int {
    jumps := 0
    currentEnd := 0  // Farthest we can reach with current jumps
    farthest := 0    // Farthest we can reach overall

    for i := 0; i < len(nums)-1; i++ {
        if i+nums[i] > farthest {
            farthest = i + nums[i]
        }
        if i == currentEnd { // Phải nhảy thêm 1 bước
            jumps++
            currentEnd = farthest
        }
    }
    return jumps
}

// ============================================================
// Merge Intervals (LeetCode 56) — RẤT HAY HỎI ở mọi company
// ============================================================
func mergeIntervals(intervals [][]int) [][]int {
    if len(intervals) <= 1 {
        return intervals
    }

    // Sort by start time
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })

    result := [][]int{intervals[0]}

    for i := 1; i < len(intervals); i++ {
        last := result[len(result)-1]
        if intervals[i][0] <= last[1] { // Overlap
            // Merge: extend end
            if intervals[i][1] > last[1] {
                last[1] = intervals[i][1]
            }
        } else {
            result = append(result, intervals[i])
        }
    }
    return result
}

// Insert Interval (LeetCode 57) — follow-up thường hỏi
func insertInterval(intervals [][]int, newInterval []int) [][]int {
    result := [][]int{}
    i := 0
    n := len(intervals)

    // Add all intervals that end before new interval starts
    for i < n && intervals[i][1] < newInterval[0] {
        result = append(result, intervals[i])
        i++
    }

    // Merge overlapping intervals
    for i < n && intervals[i][0] <= newInterval[1] {
        if intervals[i][0] < newInterval[0] {
            newInterval[0] = intervals[i][0]
        }
        if intervals[i][1] > newInterval[1] {
            newInterval[1] = intervals[i][1]
        }
        i++
    }
    result = append(result, newInterval)

    // Add remaining
    for i < n {
        result = append(result, intervals[i])
        i++
    }
    return result
}

func main() {
    // Activity Selection
    activities := []Interval{{1, 3}, {2, 5}, {3, 9}, {6, 8}}
    fmt.Println("Max Activities:", maxActivities(activities)) // 2

    // Jump Game
    fmt.Println("Can Jump:", canJump([]int{2, 3, 1, 1, 4}))  // true
    fmt.Println("Can Jump:", canJump([]int{3, 2, 1, 0, 4}))  // false
    fmt.Println("Min Jumps:", jump([]int{2, 3, 1, 1, 4}))    // 2

    // Merge Intervals
    intervals := [][]int{{1, 3}, {2, 6}, {8, 10}, {15, 18}}
    fmt.Println("Merged:", mergeIntervals(intervals)) // [[1,6],[8,10],[15,18]]

    // Insert Interval
    intervals2 := [][]int{{1, 3}, {6, 9}}
    fmt.Println("Insert:", insertInterval(intervals2, []int{2, 5})) // [[1,5],[6,9]]
}
```

> **Interview Tip:** Merge Intervals là bài **most-asked** qua mọi company. Variation thường gặp: Insert Interval, Meeting Rooms, Meeting Rooms II (min rooms needed). Luôn sort trước, rồi merge/process.

---

## 8. Graph Algorithms

### Q: BFS và DFS — implement full trong Go? 🟡 🟡 [Mid]

**A:**

```go
package main

import "fmt"

// Graph representation dùng adjacency list
type Graph struct {
    adjList map[int][]int
}

func NewGraph() *Graph {
    return &Graph{adjList: make(map[int][]int)}
}

func (g *Graph) AddEdge(u, v int) {
    g.adjList[u] = append(g.adjList[u], v)
    g.adjList[v] = append(g.adjList[v], u) // undirected
}

// ============================================================
// BFS — Breadth-First Search
// Use case: shortest path (unweighted), level-order traversal
// Time: O(V+E), Space: O(V)
// ============================================================
func (g *Graph) BFS(start int) []int {
    visited := make(map[int]bool)
    queue := []int{start}
    visited[start] = true
    order := []int{}

    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        order = append(order, node)

        for _, neighbor := range g.adjList[node] {
            if !visited[neighbor] {
                visited[neighbor] = true
                queue = append(queue, neighbor)
            }
        }
    }
    return order
}

// BFS Shortest Path (unweighted graph)
func (g *Graph) ShortestPath(start, end int) []int {
    visited := make(map[int]bool)
    parent := make(map[int]int)
    queue := []int{start}
    visited[start] = true
    parent[start] = -1

    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]

        if node == end {
            // Reconstruct path
            path := []int{}
            for node != -1 {
                path = append([]int{node}, path...)
                node = parent[node]
            }
            return path
        }

        for _, neighbor := range g.adjList[node] {
            if !visited[neighbor] {
                visited[neighbor] = true
                parent[neighbor] = node
                queue = append(queue, neighbor)
            }
        }
    }
    return nil // No path found
}

// Multi-source BFS — ví dụ: rotten oranges (LeetCode 994)
func orangesRotting(grid [][]int) int {
    rows, cols := len(grid), len(grid[0])
    queue := [][2]int{}
    fresh := 0

    // Find all rotten oranges and count fresh
    for r := 0; r < rows; r++ {
        for c := 0; c < cols; c++ {
            if grid[r][c] == 2 {
                queue = append(queue, [2]int{r, c})
            } else if grid[r][c] == 1 {
                fresh++
            }
        }
    }

    if fresh == 0 {
        return 0
    }

    directions := [][2]int{{0, 1}, {0, -1}, {1, 0}, {-1, 0}}
    minutes := 0

    for len(queue) > 0 && fresh > 0 {
        minutes++
        size := len(queue)
        for i := 0; i < size; i++ {
            cell := queue[0]
            queue = queue[1:]
            for _, d := range directions {
                nr, nc := cell[0]+d[0], cell[1]+d[1]
                if nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1 {
                    grid[nr][nc] = 2
                    fresh--
                    queue = append(queue, [2]int{nr, nc})
                }
            }
        }
    }

    if fresh > 0 {
        return -1
    }
    return minutes
}

// ============================================================
// DFS — Depth-First Search
// Time: O(V+E), Space: O(V)
// ============================================================
func (g *Graph) DFS(start int) []int {
    visited := make(map[int]bool)
    order := []int{}

    var dfs func(node int)
    dfs = func(node int) {
        visited[node] = true
        order = append(order, node)
        for _, neighbor := range g.adjList[node] {
            if !visited[neighbor] {
                dfs(neighbor)
            }
        }
    }

    dfs(start)
    return order
}

// DFS — Count Connected Components
func (g *Graph) CountComponents(n int) int {
    visited := make(map[int]bool)
    count := 0

    var dfs func(node int)
    dfs = func(node int) {
        visited[node] = true
        for _, neighbor := range g.adjList[node] {
            if !visited[neighbor] {
                dfs(neighbor)
            }
        }
    }

    for i := 0; i < n; i++ {
        if !visited[i] {
            count++
            dfs(i)
        }
    }
    return count
}

// DFS — Cycle Detection (directed graph)
func hasCycleDirected(n int, edges [][]int) bool {
    adj := make(map[int][]int)
    for _, e := range edges {
        adj[e[0]] = append(adj[e[0]], e[1])
    }

    // 0: unvisited, 1: in current path, 2: fully processed
    state := make([]int, n)

    var dfs func(node int) bool
    dfs = func(node int) bool {
        state[node] = 1 // Visiting
        for _, neighbor := range adj[node] {
            if state[neighbor] == 1 {
                return true // Back edge = cycle
            }
            if state[neighbor] == 0 && dfs(neighbor) {
                return true
            }
        }
        state[node] = 2 // Done
        return false
    }

    for i := 0; i < n; i++ {
        if state[i] == 0 && dfs(i) {
            return true
        }
    }
    return false
}

func main() {
    g := NewGraph()
    g.AddEdge(0, 1)
    g.AddEdge(0, 2)
    g.AddEdge(1, 3)
    g.AddEdge(2, 3)
    g.AddEdge(3, 4)

    fmt.Println("BFS:", g.BFS(0))
    fmt.Println("DFS:", g.DFS(0))
    fmt.Println("Shortest Path 0->4:", g.ShortestPath(0, 4))
    fmt.Println("Components:", g.CountComponents(5))

    fmt.Println("Has Cycle:", hasCycleDirected(4, [][]int{{0, 1}, {1, 2}, {2, 0}, {2, 3}})) // true

    grid := [][]int{{2, 1, 1}, {1, 1, 0}, {0, 1, 1}}
    fmt.Println("Rotten Oranges:", orangesRotting(grid)) // 4
}
```

---

### Q: Dijkstra's Algorithm — Weighted Shortest Path? 🔴 🔴 [Senior]

**A:** Dijkstra tìm shortest path từ **một nguồn** đến tất cả nodes trong graph có **non-negative weights**. Dùng min-heap (priority queue).

```go
package main

import (
    "container/heap"
    "fmt"
    "math"
)

// Edge with weight
type Edge struct {
    To, Weight int
}

// Priority Queue item
type Item struct {
    Node, Dist int
}

type PQ []Item

func (pq PQ) Len() int            { return len(pq) }
func (pq PQ) Less(i, j int) bool  { return pq[i].Dist < pq[j].Dist }
func (pq PQ) Swap(i, j int)       { pq[i], pq[j] = pq[j], pq[i] }
func (pq *PQ) Push(x interface{}) { *pq = append(*pq, x.(Item)) }
func (pq *PQ) Pop() interface{} {
    old := *pq
    n := len(old)
    x := old[n-1]
    *pq = old[:n-1]
    return x
}

func dijkstra(n int, adj [][]Edge, src int) []int {
    dist := make([]int, n)
    for i := range dist {
        dist[i] = math.MaxInt64
    }
    dist[src] = 0

    pq := &PQ{{Node: src, Dist: 0}}
    heap.Init(pq)

    for pq.Len() > 0 {
        curr := heap.Pop(pq).(Item)

        // Skip if we already found a shorter path
        if curr.Dist > dist[curr.Node] {
            continue
        }

        for _, edge := range adj[curr.Node] {
            newDist := dist[curr.Node] + edge.Weight
            if newDist < dist[edge.To] {
                dist[edge.To] = newDist
                heap.Push(pq, Item{Node: edge.To, Dist: newDist})
            }
        }
    }
    return dist
}

func main() {
    // Graph: 0->1(4), 0->2(1), 2->1(2), 1->3(1), 2->3(5)
    n := 4
    adj := make([][]Edge, n)
    adj[0] = []Edge{{1, 4}, {2, 1}}
    adj[2] = []Edge{{1, 2}, {3, 5}}
    adj[1] = []Edge{{3, 1}}

    dist := dijkstra(n, adj, 0)
    fmt.Println("Dijkstra from 0:", dist) // [0, 3, 1, 4]
    // 0->2->1->3 = 1+2+1 = 4 (shortest to 3)
}
```

**Complexity:** Time O((V+E) log V), Space O(V+E)

---

### Q: Topological Sort — Kahn's BFS và DFS-based? 🟡 🟡 [Mid]

**A:** Topological sort sắp xếp DAG (Directed Acyclic Graph) sao cho nếu có edge u->v thì u đứng trước v. Dùng cho: build systems, course scheduling, dependency resolution.

```go
package main

import "fmt"

// ============================================================
// Kahn's Algorithm (BFS-based)
// ============================================================
func topologicalSortKahn(n int, edges [][]int) ([]int, bool) {
    adj := make([][]int, n)
    inDegree := make([]int, n)

    for _, e := range edges {
        adj[e[0]] = append(adj[e[0]], e[1])
        inDegree[e[1]]++
    }

    // Start with nodes having in-degree 0
    queue := []int{}
    for i := 0; i < n; i++ {
        if inDegree[i] == 0 {
            queue = append(queue, i)
        }
    }

    order := []int{}
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

    if len(order) != n {
        return nil, false // Cycle detected
    }
    return order, true
}

// ============================================================
// DFS-based Topological Sort
// ============================================================
func topologicalSortDFS(n int, edges [][]int) ([]int, bool) {
    adj := make([][]int, n)
    for _, e := range edges {
        adj[e[0]] = append(adj[e[0]], e[1])
    }

    state := make([]int, n) // 0: unvisited, 1: in-progress, 2: done
    stack := []int{}
    hasCycle := false

    var dfs func(node int)
    dfs = func(node int) {
        if hasCycle {
            return
        }
        state[node] = 1
        for _, neighbor := range adj[node] {
            if state[neighbor] == 1 {
                hasCycle = true
                return
            }
            if state[neighbor] == 0 {
                dfs(neighbor)
            }
        }
        state[node] = 2
        stack = append(stack, node)
    }

    for i := 0; i < n; i++ {
        if state[i] == 0 {
            dfs(i)
        }
    }

    if hasCycle {
        return nil, false
    }

    // Reverse the stack
    result := make([]int, n)
    for i, v := range stack {
        result[n-1-i] = v
    }
    return result, true
}

// Course Schedule (LeetCode 207) — classic application
func canFinish(numCourses int, prerequisites [][]int) bool {
    _, ok := topologicalSortKahn(numCourses, prerequisites)
    return ok
}

func main() {
    // 0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3
    edges := [][]int{{0, 1}, {0, 2}, {1, 3}, {2, 3}}

    order1, ok1 := topologicalSortKahn(4, edges)
    fmt.Println("Kahn's:", order1, "Valid:", ok1) // [0 1 2 3]

    order2, ok2 := topologicalSortDFS(4, edges)
    fmt.Println("DFS:", order2, "Valid:", ok2) // [0 2 1 3] or similar

    // With cycle
    cycleEdges := [][]int{{0, 1}, {1, 2}, {2, 0}}
    _, ok3 := topologicalSortKahn(3, cycleEdges)
    fmt.Println("Has cycle:", !ok3) // true

    fmt.Println("Can finish courses:", canFinish(4, edges)) // true
}
```

---

### Q: Union-Find (Disjoint Set) với path compression + union by rank? 🔴 🔴 [Senior]

**A:** Union-Find quản lý tập hợp rời nhau. Hỗ trợ 2 operations: `Find` (tìm root) và `Union` (gộp 2 tập). Với path compression + union by rank, mỗi operation gần O(1) amortized (chính xác: O(alpha(n)) — inverse Ackermann).

```go
package main

import "fmt"

type UnionFind struct {
    parent []int
    rank   []int
    count  int // Số connected components
}

func NewUnionFind(n int) *UnionFind {
    parent := make([]int, n)
    rank := make([]int, n)
    for i := range parent {
        parent[i] = i // Mỗi node là root của chính nó
    }
    return &UnionFind{parent: parent, rank: rank, count: n}
}

// Find with path compression
func (uf *UnionFind) Find(x int) int {
    if uf.parent[x] != x {
        uf.parent[x] = uf.Find(uf.parent[x]) // Path compression
    }
    return uf.parent[x]
}

// Union by rank
func (uf *UnionFind) Union(x, y int) bool {
    rootX := uf.Find(x)
    rootY := uf.Find(y)

    if rootX == rootY {
        return false // Already in same set
    }

    // Attach smaller tree under larger tree
    if uf.rank[rootX] < uf.rank[rootY] {
        uf.parent[rootX] = rootY
    } else if uf.rank[rootX] > uf.rank[rootY] {
        uf.parent[rootY] = rootX
    } else {
        uf.parent[rootY] = rootX
        uf.rank[rootX]++
    }
    uf.count--
    return true
}

func (uf *UnionFind) Connected(x, y int) bool {
    return uf.Find(x) == uf.Find(y)
}

// ============================================================
// Kruskal's MST using Union-Find
// ============================================================
type KruskalEdge struct {
    U, V, Weight int
}

func kruskalMST(n int, edges []KruskalEdge) (int, []KruskalEdge) {
    // Sort edges by weight (simple sort)
    sortedEdges := make([]KruskalEdge, len(edges))
    copy(sortedEdges, edges)
    for i := 1; i < len(sortedEdges); i++ {
        key := sortedEdges[i]
        j := i - 1
        for j >= 0 && sortedEdges[j].Weight > key.Weight {
            sortedEdges[j+1] = sortedEdges[j]
            j--
        }
        sortedEdges[j+1] = key
    }

    uf := NewUnionFind(n)
    mstWeight := 0
    mstEdges := []KruskalEdge{}

    for _, edge := range sortedEdges {
        if uf.Union(edge.U, edge.V) {
            mstWeight += edge.Weight
            mstEdges = append(mstEdges, edge)
            if len(mstEdges) == n-1 {
                break
            }
        }
    }
    return mstWeight, mstEdges
}

// Number of Connected Components (LeetCode 323)
func countComponents(n int, edges [][]int) int {
    uf := NewUnionFind(n)
    for _, e := range edges {
        uf.Union(e[0], e[1])
    }
    return uf.count
}

// Number of Islands using Union-Find (LeetCode 200)
func numIslands(grid [][]byte) int {
    if len(grid) == 0 {
        return 0
    }
    rows, cols := len(grid), len(grid[0])
    uf := NewUnionFind(rows * cols)
    water := 0

    for r := 0; r < rows; r++ {
        for c := 0; c < cols; c++ {
            if grid[r][c] == '0' {
                water++
                continue
            }
            // Union with right and down neighbors
            if r+1 < rows && grid[r+1][c] == '1' {
                uf.Union(r*cols+c, (r+1)*cols+c)
            }
            if c+1 < cols && grid[r][c+1] == '1' {
                uf.Union(r*cols+c, r*cols+c+1)
            }
        }
    }
    return uf.count - water
}

func main() {
    uf := NewUnionFind(5)
    uf.Union(0, 1)
    uf.Union(2, 3)
    uf.Union(1, 3)
    fmt.Println("0 and 3 connected:", uf.Connected(0, 3)) // true
    fmt.Println("0 and 4 connected:", uf.Connected(0, 4)) // false
    fmt.Println("Components:", uf.count)                    // 2

    // Kruskal's MST
    edges := []KruskalEdge{
        {0, 1, 10}, {0, 2, 6}, {0, 3, 5},
        {1, 3, 15}, {2, 3, 4},
    }
    weight, mst := kruskalMST(4, edges)
    fmt.Println("MST Weight:", weight) // 19
    fmt.Println("MST Edges:", mst)

    // Connected Components
    fmt.Println("Components:", countComponents(5, [][]int{{0, 1}, {1, 2}, {3, 4}})) // 2
}
```

> **Interview Tip:** Union-Find thường hỏi ở Grab, Google (level Senior). Phải biết path compression + union by rank. Applications: connected components, cycle detection (undirected), Kruskal's MST, dynamic connectivity.

---

## 9. Backtracking

### Q: Backtracking template và các bài kinh điển? 🟡 🟡 [Mid]

**A:** Backtracking = DFS + pruning. Explore tất cả possibilities, "backtrack" (quay lại) khi path hiện tại không thỏa mãn.

**Template:**
```
function backtrack(state, choices):
    if is_solution(state):
        record(state)
        return
    for choice in choices:
        if is_valid(choice):
            make_choice(choice)
            backtrack(state, remaining_choices)
            undo_choice(choice)  // BACKTRACK
```

```go
package main

import "fmt"

// ============================================================
// Permutations (LeetCode 46)
// ============================================================
func permute(nums []int) [][]int {
    result := [][]int{}
    used := make([]bool, len(nums))

    var backtrack func(current []int)
    backtrack = func(current []int) {
        if len(current) == len(nums) {
            tmp := make([]int, len(current))
            copy(tmp, current)
            result = append(result, tmp)
            return
        }
        for i := 0; i < len(nums); i++ {
            if used[i] {
                continue
            }
            used[i] = true
            backtrack(append(current, nums[i]))
            used[i] = false // Backtrack
        }
    }

    backtrack([]int{})
    return result
}

// ============================================================
// Combinations (LeetCode 77)
// ============================================================
func combine(n int, k int) [][]int {
    result := [][]int{}

    var backtrack func(start int, current []int)
    backtrack = func(start int, current []int) {
        if len(current) == k {
            tmp := make([]int, k)
            copy(tmp, current)
            result = append(result, tmp)
            return
        }
        // Pruning: cần còn đủ elements
        remaining := k - len(current)
        for i := start; i <= n-remaining+1; i++ {
            backtrack(i+1, append(current, i))
        }
    }

    backtrack(1, []int{})
    return result
}

// ============================================================
// Subsets (LeetCode 78) — Power Set
// ============================================================
func subsets(nums []int) [][]int {
    result := [][]int{}

    var backtrack func(start int, current []int)
    backtrack = func(start int, current []int) {
        tmp := make([]int, len(current))
        copy(tmp, current)
        result = append(result, tmp)

        for i := start; i < len(nums); i++ {
            backtrack(i+1, append(current, nums[i]))
        }
    }

    backtrack(0, []int{})
    return result
}

// ============================================================
// N-Queens (LeetCode 51) — Classic backtracking
// ============================================================
func solveNQueens(n int) [][]string {
    result := [][]string{}
    board := make([][]byte, n)
    for i := range board {
        board[i] = make([]byte, n)
        for j := range board[i] {
            board[i][j] = '.'
        }
    }

    cols := make(map[int]bool)
    diag1 := make(map[int]bool) // row - col
    diag2 := make(map[int]bool) // row + col

    var backtrack func(row int)
    backtrack = func(row int) {
        if row == n {
            solution := make([]string, n)
            for i := range board {
                solution[i] = string(board[i])
            }
            result = append(result, solution)
            return
        }

        for col := 0; col < n; col++ {
            if cols[col] || diag1[row-col] || diag2[row+col] {
                continue
            }
            board[row][col] = 'Q'
            cols[col] = true
            diag1[row-col] = true
            diag2[row+col] = true

            backtrack(row + 1)

            // Backtrack
            board[row][col] = '.'
            delete(cols, col)
            delete(diag1, row-col)
            delete(diag2, row+col)
        }
    }

    backtrack(0)
    return result
}

// ============================================================
// Word Search (LeetCode 79) — grid backtracking
// ============================================================
func exist(board [][]byte, word string) bool {
    rows, cols := len(board), len(board[0])

    var backtrack func(r, c, idx int) bool
    backtrack = func(r, c, idx int) bool {
        if idx == len(word) {
            return true
        }
        if r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] != word[idx] {
            return false
        }

        // Mark as visited
        temp := board[r][c]
        board[r][c] = '#'

        // Explore 4 directions
        found := backtrack(r+1, c, idx+1) ||
            backtrack(r-1, c, idx+1) ||
            backtrack(r, c+1, idx+1) ||
            backtrack(r, c-1, idx+1)

        // Backtrack
        board[r][c] = temp
        return found
    }

    for r := 0; r < rows; r++ {
        for c := 0; c < cols; c++ {
            if backtrack(r, c, 0) {
                return true
            }
        }
    }
    return false
}

func main() {
    fmt.Println("Permutations:", permute([]int{1, 2, 3}))
    fmt.Println("Combinations C(4,2):", combine(4, 2))
    fmt.Println("Subsets:", subsets([]int{1, 2, 3}))

    fmt.Println("N-Queens (4):")
    for _, sol := range solveNQueens(4) {
        for _, row := range sol {
            fmt.Println(" ", row)
        }
        fmt.Println()
    }

    board := [][]byte{
        {'A', 'B', 'C', 'E'},
        {'S', 'F', 'C', 'S'},
        {'A', 'D', 'E', 'E'},
    }
    fmt.Println("Word Search 'ABCCED':", exist(board, "ABCCED")) // true
}
```

> **Interview Tip:** Backtracking = DFS + undo. Luôn nhớ pattern: **choose -> explore -> unchoose**. Khi implement, chú ý: (1) copy slice trước khi append vào result (Go slice reference trap!), (2) pruning để cải thiện runtime.

---

## 10. String Algorithms

### Q: KMP và Rabin-Karp string matching? 🔴 🔴 [Senior]

**A:**

```go
package main

import "fmt"

// ============================================================
// KMP (Knuth-Morris-Pratt) String Matching
// Time: O(n+m), Space: O(m) for LPS table
// ============================================================

// Build Longest Proper Prefix which is also Suffix (LPS) table
func buildLPS(pattern string) []int {
    m := len(pattern)
    lps := make([]int, m)
    length := 0 // Length of previous longest prefix suffix
    i := 1

    for i < m {
        if pattern[i] == pattern[length] {
            length++
            lps[i] = length
            i++
        } else {
            if length != 0 {
                length = lps[length-1] // Don't increment i
            } else {
                lps[i] = 0
                i++
            }
        }
    }
    return lps
}

func kmpSearch(text, pattern string) []int {
    n, m := len(text), len(pattern)
    lps := buildLPS(pattern)
    matches := []int{}

    i, j := 0, 0
    for i < n {
        if text[i] == pattern[j] {
            i++
            j++
        }

        if j == m {
            matches = append(matches, i-j) // Found match at index i-j
            j = lps[j-1]
        } else if i < n && text[i] != pattern[j] {
            if j != 0 {
                j = lps[j-1]
            } else {
                i++
            }
        }
    }
    return matches
}

// ============================================================
// Rabin-Karp Rolling Hash
// Time: O(n+m) average, O(nm) worst case
// ============================================================
func rabinKarp(text, pattern string) []int {
    n, m := len(text), len(pattern)
    if m > n {
        return nil
    }

    const (
        base = 256
        mod  = 101 // Prime number
    )

    matches := []int{}

    // Calculate hash of pattern and first window
    patternHash := 0
    textHash := 0
    h := 1 // base^(m-1) % mod

    for i := 0; i < m-1; i++ {
        h = (h * base) % mod
    }

    for i := 0; i < m; i++ {
        patternHash = (base*patternHash + int(pattern[i])) % mod
        textHash = (base*textHash + int(text[i])) % mod
    }

    for i := 0; i <= n-m; i++ {
        if patternHash == textHash {
            // Hash match — verify character by character
            match := true
            for j := 0; j < m; j++ {
                if text[i+j] != pattern[j] {
                    match = false
                    break
                }
            }
            if match {
                matches = append(matches, i)
            }
        }

        // Calculate hash for next window
        if i < n-m {
            textHash = (base*(textHash-int(text[i])*h) + int(text[i+m])) % mod
            if textHash < 0 {
                textHash += mod
            }
        }
    }
    return matches
}

// ============================================================
// Anagram Check — O(n)
// ============================================================
func isAnagram(s, t string) bool {
    if len(s) != len(t) {
        return false
    }
    count := [26]int{}
    for i := 0; i < len(s); i++ {
        count[s[i]-'a']++
        count[t[i]-'a']--
    }
    for _, c := range count {
        if c != 0 {
            return false
        }
    }
    return true
}

// Find All Anagrams (LeetCode 438) — Sliding Window
func findAnagrams(s, p string) []int {
    if len(s) < len(p) {
        return nil
    }

    result := []int{}
    pCount := [26]int{}
    sCount := [26]int{}

    for i := 0; i < len(p); i++ {
        pCount[p[i]-'a']++
    }

    for i := 0; i < len(s); i++ {
        sCount[s[i]-'a']++
        if i >= len(p) {
            sCount[s[i-len(p)]-'a']--
        }
        if sCount == pCount { // Array comparison in Go
            result = append(result, i-len(p)+1)
        }
    }
    return result
}

// ============================================================
// Palindrome Check — O(n) time, O(1) space
// ============================================================
func isPalindrome(s string) bool {
    l, r := 0, len(s)-1
    for l < r {
        if s[l] != s[r] {
            return false
        }
        l++
        r--
    }
    return true
}

// Valid Palindrome (LeetCode 125) — chỉ xét alphanumeric, ignore case
func isPalindromeAlphaNum(s string) bool {
    l, r := 0, len(s)-1
    for l < r {
        for l < r && !isAlphaNum(s[l]) {
            l++
        }
        for l < r && !isAlphaNum(s[r]) {
            r--
        }
        if toLower(s[l]) != toLower(s[r]) {
            return false
        }
        l++
        r--
    }
    return true
}

func isAlphaNum(c byte) bool {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')
}

func toLower(c byte) byte {
    if c >= 'A' && c <= 'Z' {
        return c + 32
    }
    return c
}

// Longest Palindromic Substring (LeetCode 5) — Expand from center
func longestPalindrome(s string) string {
    if len(s) < 2 {
        return s
    }

    start, maxLen := 0, 1

    expand := func(l, r int) {
        for l >= 0 && r < len(s) && s[l] == s[r] {
            if r-l+1 > maxLen {
                start = l
                maxLen = r - l + 1
            }
            l--
            r++
        }
    }

    for i := 0; i < len(s); i++ {
        expand(i, i)   // Odd length palindrome
        expand(i, i+1) // Even length palindrome
    }

    return s[start : start+maxLen]
}

func main() {
    text := "ABABDABACDABABCABAB"
    pattern := "ABABCABAB"

    fmt.Println("KMP matches at:", kmpSearch(text, pattern))
    fmt.Println("Rabin-Karp matches at:", rabinKarp(text, pattern))

    fmt.Println("Anagram:", isAnagram("anagram", "nagaram"))         // true
    fmt.Println("Find Anagrams:", findAnagrams("cbaebabacd", "abc")) // [0, 6]

    fmt.Println("Palindrome 'racecar':", isPalindrome("racecar")) // true
    fmt.Println("Longest Palindrome:", longestPalindrome("babad")) // "bab" or "aba"
}
```

> **Interview Tip:** KMP hiếm khi phải code từ đầu trong interview — nhưng cần hiểu concept. Anagram check, palindrome, và Longest Palindromic Substring thì hay hỏi. Grab thích hỏi sliding window anagram.

---

## 11. Bit Manipulation

### Q: Các bit operation phổ biến trong Go? 🟡 🟡 [Mid]

**A:**

```go
package main

import (
    "fmt"
    "math/bits"
)

// ============================================================
// Common Bit Operations
// ============================================================
func bitBasics() {
    a := 0b1010 // 10
    b := 0b1100 // 12

    fmt.Printf("AND:  %04b & %04b = %04b (%d)\n", a, b, a&b, a&b)   // 1000 (8)
    fmt.Printf("OR:   %04b | %04b = %04b (%d)\n", a, b, a|b, a|b)   // 1110 (14)
    fmt.Printf("XOR:  %04b ^ %04b = %04b (%d)\n", a, b, a^b, a^b)   // 0110 (6)
    fmt.Printf("NOT:  ^%04b = %d\n", a, ^a)                          // -11 (two's complement)
    fmt.Printf("Left: %04b << 1 = %04b (%d)\n", a, a<<1, a<<1)     // 10100 (20)
    fmt.Printf("Right: %04b >> 1 = %04b (%d)\n", a, a>>1, a>>1)    // 0101 (5)

    // Go-specific: &^ (AND NOT / bit clear)
    fmt.Printf("AND NOT: %04b &^ %04b = %04b (%d)\n", a, b, a&^b, a&^b) // 0010 (2)
}

// ============================================================
// Check if power of 2 — O(1)
// n & (n-1) == 0 khi n là power of 2
// Ví dụ: 8 = 1000, 7 = 0111 => 8 & 7 = 0000
// ============================================================
func isPowerOfTwo(n int) bool {
    return n > 0 && n&(n-1) == 0
}

// ============================================================
// Count Set Bits (Hamming Weight) — LeetCode 191
// ============================================================
func countSetBits(n uint) int {
    count := 0
    for n > 0 {
        count += int(n & 1)
        n >>= 1
    }
    return count
}

// Brian Kernighan's method — chỉ loop qua set bits
func countSetBitsKernighan(n uint) int {
    count := 0
    for n > 0 {
        n &= n - 1 // Clear lowest set bit
        count++
    }
    return count
}

// Go's standard library method
func countSetBitsStdLib(n uint) int {
    return bits.OnesCount(n)
}

// ============================================================
// XOR Tricks
// ============================================================

// Find single number (mọi số xuất hiện 2 lần, 1 số xuất hiện 1 lần)
// LeetCode 136
func singleNumber(nums []int) int {
    result := 0
    for _, n := range nums {
        result ^= n // a ^ a = 0, a ^ 0 = a
    }
    return result
}

// Find TWO non-repeating numbers (LeetCode 260)
// Mọi số xuất hiện 2 lần, trừ 2 số xuất hiện 1 lần
func singleNumberIII(nums []int) []int {
    // Step 1: XOR all -> result = a ^ b
    xorAll := 0
    for _, n := range nums {
        xorAll ^= n
    }

    // Step 2: Find rightmost set bit (a and b differ at this bit)
    rightmostBit := xorAll & (-xorAll)

    // Step 3: Partition into two groups and XOR separately
    a, b := 0, 0
    for _, n := range nums {
        if n&rightmostBit != 0 {
            a ^= n
        } else {
            b ^= n
        }
    }
    return []int{a, b}
}

// ============================================================
// Useful Bit Tricks
// ============================================================
func bitTricks() {
    n := 42

    // Get i-th bit (0-indexed from right)
    i := 3
    bit := (n >> i) & 1
    fmt.Printf("Bit %d of %d: %d\n", i, n, bit)

    // Set i-th bit
    set := n | (1 << i)
    fmt.Printf("Set bit %d: %d -> %d\n", i, n, set)

    // Clear i-th bit
    clear := n &^ (1 << i)
    fmt.Printf("Clear bit %d: %d -> %d\n", i, n, clear)

    // Toggle i-th bit
    toggle := n ^ (1 << i)
    fmt.Printf("Toggle bit %d: %d -> %d\n", i, n, toggle)

    // Check odd/even
    fmt.Printf("%d is odd: %v\n", n, n&1 == 1)

    // Multiply/divide by 2
    fmt.Printf("%d * 2 = %d\n", n, n<<1)
    fmt.Printf("%d / 2 = %d\n", n, n>>1)

    // Swap without temp
    a, b := 5, 7
    a ^= b
    b ^= a
    a ^= b
    fmt.Printf("Swapped: a=%d, b=%d\n", a, b)
}

func main() {
    bitBasics()

    fmt.Println("\nPower of 2:")
    fmt.Println("16:", isPowerOfTwo(16)) // true
    fmt.Println("18:", isPowerOfTwo(18)) // false

    fmt.Println("\nCount Set Bits (13 = 1101):")
    fmt.Println("Loop:", countSetBits(13))               // 3
    fmt.Println("Kernighan:", countSetBitsKernighan(13)) // 3
    fmt.Println("StdLib:", countSetBitsStdLib(13))        // 3

    fmt.Println("\nSingle Number:")
    fmt.Println(singleNumber([]int{4, 1, 2, 1, 2})) // 4

    fmt.Println("\nTwo Non-Repeating:")
    fmt.Println(singleNumberIII([]int{1, 2, 1, 3, 2, 5})) // [3, 5]

    fmt.Println("\nBit Tricks:")
    bitTricks()
}
```

> **Interview Tip:** Bit manipulation ít hỏi ở Grab/Zalo nhưng Google/Microsoft thích hỏi. Must-know: XOR tricks, power of 2 check, count set bits. Go có package `math/bits` rất hữu ích — mention trong interview thể hiện kiến thức Go standard library.

---

## 12. Interview Coding Patterns Summary

### Q: Làm sao nhận diện pattern khi gặp bài mới? 🔴 🔴 [Senior]

**A:** Đây là bảng pattern recognition — skill quan trọng nhất trong coding interview:

| Dấu hiệu nhận biết | Pattern | Ví dụ bài |
|---------------------|---------|-----------|
| Sorted array, tìm pair | **Two Pointers** | Two Sum II, 3Sum, Container With Most Water |
| Subarray/substring contiguous | **Sliding Window** | Max Sum Subarray, Min Window Substring |
| Tìm min/max thỏa điều kiện | **Binary Search on Answer** | Koko Eating Bananas, Split Array Largest Sum |
| Tối ưu hóa, đếm cách | **DP** | Coin Change, LCS, Knapsack |
| Chọn/không chọn, decision tại mỗi step | **DP hoặc Backtracking** | 0/1 Knapsack, Subsets |
| Liệt kê tất cả combinations | **Backtracking** | Permutations, N-Queens, Word Search |
| Shortest path (unweighted) | **BFS** | Word Ladder, Rotten Oranges |
| Shortest path (weighted) | **Dijkstra** | Network Delay Time |
| Dependencies/ordering | **Topological Sort** | Course Schedule |
| Connected components | **Union-Find hoặc DFS** | Number of Islands, Accounts Merge |
| Intervals overlap | **Sort + Greedy** | Merge Intervals, Meeting Rooms |
| Tree traversal | **DFS/BFS** | Max Depth, Level Order, Path Sum |
| Find k-th element | **Heap/Quick Select** | Kth Largest, Top K Frequent |
| Prefix sum, range query | **Prefix Sum** | Subarray Sum Equals K |

### Common Go Idioms for Coding Interviews

```go
package main

import (
    "container/heap"
    "math"
    "sort"
)

// ============================================================
// Useful Go patterns for interviews
// ============================================================

// 1. Hash map for counting
func countFrequency(arr []int) map[int]int {
    freq := make(map[int]int)
    for _, v := range arr {
        freq[v]++
    }
    return freq
}

// 2. Stack using slice
type Stack []int

func (s *Stack) Push(v int)    { *s = append(*s, v) }
func (s *Stack) Pop() int      { v := (*s)[len(*s)-1]; *s = (*s)[:len(*s)-1]; return v }
func (s *Stack) Peek() int     { return (*s)[len(*s)-1] }
func (s *Stack) IsEmpty() bool { return len(*s) == 0 }

// 3. Queue using slice (for BFS)
// Dequeue: queue[0], queue = queue[1:]
// Enqueue: queue = append(queue, val)

// 4. Set using map
type Set map[int]struct{}

func (s Set) Add(v int)      { s[v] = struct{}{} }
func (s Set) Has(v int) bool { _, ok := s[v]; return ok }
func (s Set) Remove(v int)   { delete(s, v) }

// 5. Min/Max (trước Go 1.21, phải tự viết)
func minInt(a, b int) int {
    if a < b {
        return a
    }
    return b
}

func maxInt(a, b int) int {
    if a > b {
        return a
    }
    return b
}

// Từ Go 1.21: dùng min() và max() built-in

// 6. Abs for int
func abs(a int) int {
    if a < 0 {
        return -a
    }
    return a
}

// 7. 2D Grid directions
var directions = [][2]int{{0, 1}, {0, -1}, {1, 0}, {-1, 0}}

// 8. Initialize 2D slice
func make2D(rows, cols int) [][]int {
    grid := make([][]int, rows)
    for i := range grid {
        grid[i] = make([]int, cols)
    }
    return grid
}

// 9. Sort with custom comparator
func sortCustom() {
    intervals := [][]int{{1, 3}, {2, 6}, {8, 10}}
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })
}

// 10. Priority Queue (Min-Heap)
type MinHeap []int

func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x interface{}) { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() interface{} {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}

// 11. Prefix Sum
func prefixSum(nums []int) []int {
    prefix := make([]int, len(nums)+1)
    for i, v := range nums {
        prefix[i+1] = prefix[i] + v
    }
    return prefix
    // Sum of nums[l..r] = prefix[r+1] - prefix[l]
}

// 12. Binary search template (generic)
func lowerBound(arr []int, target int) int {
    lo, hi := 0, len(arr)
    for lo < hi {
        mid := lo + (hi-lo)/2
        if arr[mid] < target {
            lo = mid + 1
        } else {
            hi = mid
        }
    }
    return lo
}

func main() {
    _ = heap.Init
    _ = math.MaxInt64
    _ = sort.Search
}
```

---

## 13. Cheat Sheet & Practice Recommendations

### Algorithm Complexity Cheat Sheet

```
+-------------------+----------+----------+----------+--------+--------+
| Algorithm         | Best     | Average  | Worst    | Space  | Stable |
+-------------------+----------+----------+----------+--------+--------+
| Quick Sort        | O(nlogn) | O(nlogn) | O(n^2)   | O(logn)| No     |
| Merge Sort        | O(nlogn) | O(nlogn) | O(nlogn) | O(n)   | Yes    |
| Heap Sort         | O(nlogn) | O(nlogn) | O(nlogn) | O(1)   | No     |
| Go pdqsort        | O(n)     | O(nlogn) | O(nlogn) | O(logn)| No     |
| Insertion Sort    | O(n)     | O(n^2)   | O(n^2)   | O(1)   | Yes    |
+-------------------+----------+----------+----------+--------+--------+
| Binary Search     | O(1)     | O(logn)  | O(logn)  | O(1)   | —      |
| BFS               | —        | O(V+E)   | O(V+E)   | O(V)   | —      |
| DFS               | —        | O(V+E)   | O(V+E)   | O(V)   | —      |
| Dijkstra          | —        |O((V+E)logV)| same   | O(V)   | —      |
| Kruskal           | —        | O(ElogE) | O(ElogE) | O(V)   | —      |
| Topological Sort  | —        | O(V+E)   | O(V+E)   | O(V)   | —      |
+-------------------+----------+----------+----------+--------+--------+
| Hash Table Insert | O(1)     | O(1)     | O(n)     | O(n)   | —      |
| Hash Table Search | O(1)     | O(1)     | O(n)     | —      | —      |
| BST Search        | O(logn)  | O(logn)  | O(n)     | O(n)   | —      |
| Heap Insert/Del   | O(logn)  | O(logn)  | O(logn)  | O(n)   | —      |
+-------------------+----------+----------+----------+--------+--------+

+---------------------+----------+-----------+-------------------------+
| DP Problem          | Time     | Space     | Key Idea                |
+---------------------+----------+-----------+-------------------------+
| Fibonacci           | O(n)     | O(1)      | dp[i] = dp[i-1]+dp[i-2]|
| Climbing Stairs     | O(n)     | O(1)      | Same as Fibonacci       |
| Coin Change         | O(n*m)   | O(n)      | dp[i] = min over coins  |
| LCS                 | O(m*n)   | O(m*n)    | 2D table                |
| LIS                 | O(nlogn) | O(n)      | Patience sorting        |
| 0/1 Knapsack        | O(n*W)   | O(W)      | Backwards iteration     |
| Edit Distance       | O(m*n)   | O(m*n)    | Insert/Delete/Replace   |
| Max Subarray        | O(n)     | O(1)      | Extend or restart       |
+---------------------+----------+-----------+-------------------------+
```

---

### LeetCode Practice by Company

#### Google (thường hỏi Hard, focus DP + Graph + Binary Search)

| # | Problem | Pattern | Difficulty |
|---|---------|---------|------------|
| 4 | Median of Two Sorted Arrays | Binary Search | Hard |
| 42 | Trapping Rain Water | Two Pointers / Stack | Hard |
| 76 | Minimum Window Substring | Sliding Window | Hard |
| 72 | Edit Distance | DP | Hard |
| 200 | Number of Islands | DFS/BFS/Union-Find | Medium |
| 239 | Sliding Window Maximum | Deque | Hard |
| 297 | Serialize/Deserialize Binary Tree | BFS/DFS | Hard |
| 322 | Coin Change | DP | Medium |
| 410 | Split Array Largest Sum | Binary Search on Answer | Hard |
| 843 | Guess the Word | Interactive | Hard |

#### Grab (focus System Design + Medium coding)

| # | Problem | Pattern | Difficulty |
|---|---------|---------|------------|
| 1 | Two Sum | Hash Map | Easy |
| 15 | 3Sum | Two Pointers | Medium |
| 20 | Valid Parentheses | Stack | Easy |
| 33 | Search in Rotated Sorted Array | Binary Search | Medium |
| 46 | Permutations | Backtracking | Medium |
| 56 | Merge Intervals | Sort + Greedy | Medium |
| 146 | LRU Cache | Hash Map + Linked List | Medium |
| 200 | Number of Islands | BFS/DFS | Medium |
| 207 | Course Schedule | Topological Sort | Medium |
| 253 | Meeting Rooms II | Sort + Heap | Medium |

#### Microsoft (balanced, LL/Tree + medium DP)

| # | Problem | Pattern | Difficulty |
|---|---------|---------|------------|
| 2 | Add Two Numbers | Linked List | Medium |
| 3 | Longest Substring Without Repeating | Sliding Window | Medium |
| 21 | Merge Two Sorted Lists | Linked List | Easy |
| 53 | Maximum Subarray | DP (Kadane's) | Medium |
| 54 | Spiral Matrix | Matrix | Medium |
| 138 | Copy List with Random Pointer | Hash Map + LL | Medium |
| 146 | LRU Cache | Design | Medium |
| 212 | Word Search II | Trie + Backtracking | Hard |
| 236 | LCA of Binary Tree | Tree DFS | Medium |
| 300 | Longest Increasing Subsequence | DP + Binary Search | Medium |

#### Zalo / Axon / Employment Hero (Medium focus)

| # | Problem | Pattern | Difficulty |
|---|---------|---------|------------|
| 1 | Two Sum | Hash Map | Easy |
| 3 | Longest Substring Without Repeating | Sliding Window | Medium |
| 5 | Longest Palindromic Substring | DP / Expand | Medium |
| 15 | 3Sum | Two Pointers | Medium |
| 56 | Merge Intervals | Sort | Medium |
| 78 | Subsets | Backtracking | Medium |
| 102 | Binary Tree Level Order | BFS | Medium |
| 121 | Best Time to Buy and Sell Stock | DP | Easy |
| 206 | Reverse Linked List | Linked List | Easy |
| 347 | Top K Frequent Elements | Heap / Bucket Sort | Medium |

---

### Interview Tips for Coding Rounds

**Truoc interview:**
1. Luyen **50-100 bai** LeetCode theo pattern (khong random)
2. Moi pattern luyen 5-10 bai, tu Easy -> Hard
3. Viet code bang Go tren LeetCode (khong dung Python)
4. Practice **time-boxed**: 20 phut cho Medium, 30-40 phut cho Hard

**Trong interview:**
1. **Clarify** (2-3 phut): hoi constraints, edge cases, input size
   - "What's the range of n?"
   - "Can there be duplicates?"
   - "Is the array sorted?"

2. **Approach** (3-5 phut): noi approach truoc khi code
   - "I'm thinking of using a sliding window because we need contiguous subarray..."
   - Noi complexity truoc: "This would be O(n) time and O(1) space"
   - Neu co brute force, noi truoc roi optimize

3. **Code** (15-20 phut): viet code sach
   - Dat ten bien ro rang: `left`, `right` thay vi `i`, `j`
   - Viet helper functions neu can
   - Dung Go idioms: `range`, multiple return, error handling

4. **Test** (3-5 phut): chay qua test cases bang tay
   - Normal case
   - Edge case: empty, single element, all same, already sorted

5. **Optimize** (neu co thoi gian):
   - "We could optimize space by using X..."
   - "If the input were different (e.g., stream), we'd use Y..."

**Common mistakes to avoid:**
- Nhay vao code ngay khong noi approach
- Code xong khong test
- Khong handle edge cases (nil, empty, single element)
- Off-by-one errors trong binary search
- Quen copy slice truoc khi append vao result (Go trap!)
- Khong noi complexity khi duoc hoi

**Go-specific tips:**
- Biet dung `sort.Slice`, `sort.Search`, `container/heap`
- Biet Go slice internals (append, capacity, copy)
- Handle integer overflow: dung `lo + (hi-lo)/2` thay vi `(lo+hi)/2`
- Biet `math.MaxInt64`, `math.MinInt64`
- Tu Go 1.21: dung `min()`, `max()` built-in

---

> **Tong ket**: Algorithms interview khong phai test "biet nhieu thuat toan" ma test **problem-solving skill** — kha nang nhan dien pattern, chon dung approach, implement sach se, va phan tich complexity. Luyen deu dan 1-2 bai/ngay, focus vao **hieu sau** hon **lam nhieu**.
