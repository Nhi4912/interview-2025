# Complexity Analysis / Phân Tích Độ Phức Tạp

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Data Structures](./data-structures-theory.md)
> **See also**: [Algorithms Theory](./algorithms-theory.md) | [Data Structures](./data-structures-theory.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn build tính năng "tìm kiếm sản phẩm" cho e-commerce. Với 100 sản phẩm: hoạt động tốt. Với 1 triệu sản phẩm: **browser đơ 30 giây** mỗi lần gõ ký tự.

**Nguyên nhân**: Code dùng nested loop O(n²) — 1 triệu × 1 triệu = 1 nghìn tỷ phép tính.
**Giải pháp**: Thay bằng hash map lookup O(1) — 1 triệu phép tính thay vì 1 nghìn tỷ.

Đây là lý do tại sao mọi cuộc phỏng vấn kỹ thuật đều hỏi về **Big O** — nó là ngôn ngữ chung để đánh giá code có "scale" được không.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Tìm số điện thoại:**

Bạn cần tìm số điện thoại của "Nguyễn Văn A":
- **Danh bạ không sắp xếp** (O(n)): lật từng trang một → 500 trang = 500 lần lật
- **Danh bạ sắp xếp theo tên** (O(log n)): mở giữa → đi đúng nửa → tiếp tục → 10 lần lật cho 500 trang
- **Danh bạ có index theo chữ cái** (O(1)): mở thẳng tab "N" → 1 giây

Big O = "nếu dữ liệu tăng 10x, thời gian tăng bao nhiêu?"

| Kịch bản | Big O | 1,000 items | 1,000,000 items |
|----------|-------|-------------|-----------------|
| Hash map lookup | O(1) | 1 op | 1 op |
| Binary search | O(log n) | 10 ops | 20 ops |
| Linear scan | O(n) | 1,000 ops | 1,000,000 ops |
| Nested loop | O(n²) | 1,000,000 ops | 10¹² ops (đơ!) |

**Tại sao phải biết Complexity Analysis?**
- Viết code chạy được ≠ viết code chạy nhanh. Phỏng vấn luôn hỏi: "Time complexity là gì?"
- Giúp chọn đúng data structure: cần tìm nhanh → HashMap, cần sort → TreeSet
- Phát hiện bottleneck trước khi production bị sập

---

## Concept Map / Bản Đồ Khái Niệm

```
       [DATA STRUCTURES]
       (Array, HashMap, Tree...)
              │
              ▼
    [COMPLEXITY ANALYSIS]  ← bạn đang ở đây
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
[Time]   [Space]   [Amortized]
 O(1)     O(1)      ArrayList
 O(logn)  O(n)      append()
 O(n)     O(n²)
 O(n²)
    │
    ▼
[Asymptotic Notations]
 Big O (worst) | Theta (average) | Omega (best)
    │
    ▼
[Master Theorem]
 Analyze recursive algorithms: T(n) = aT(n/b) + f(n)
    │
    ▼
[ALGORITHMS THEORY]
 Choose right algorithm for the complexity you need
```

---

## Overview / Tổng Quan

**English:** Big O notation describes algorithm efficiency — how time and space requirements grow as input size increases. Mastering this lets you predict performance before writing a single line of code.

**Tiếng Việt:** Big O mô tả hiệu quả thuật toán — thời gian và bộ nhớ tăng thế nào khi dữ liệu tăng. Nắm vững Big O giúp bạn dự đoán hiệu suất trước khi viết code.

---

## Table of Contents / Mục Lục

1. [Big O Notation / Ký Hiệu Big O](#big-o-notation--ký-hiệu-big-o)
2. [Time Complexity / Độ Phức Tạp Thời Gian](#time-complexity--độ-phức-tạp-thời-gian)
3. [Space Complexity / Độ Phức Tạp Không Gian](#space-complexity--độ-phức-tạp-không-gian)
4. [Asymptotic Notations / Ký Hiệu Tiệm Cận](#asymptotic-notations--ký-hiệu-tiệm-cận)
5. [Amortized Analysis / Phân Tích Khấu Hao](#amortized-analysis--phân-tích-khấu-hao)
6. [Master Theorem / Định Lý Master](#master-theorem--định-lý-master)
7. [Practical Examples / Ví Dụ Thực Tế](#practical-examples--ví-dụ-thực-tế)
8. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## Big O Notation / Ký Hiệu Big O

### Definition / Định Nghĩa

**English:** Big O describes the upper bound of algorithm growth rate, representing worst-case scenario.

**Tiếng Việt:** Big O mô tả giới hạn trên của tốc độ tăng trưởng thuật toán, đại diện cho trường hợp xấu nhất.

### Mathematical Definition / Định Nghĩa Toán Học

```
f(n) = O(g(n)) if there exist positive constants c and n₀ such that:
f(n) ≤ c · g(n) for all n ≥ n₀

f(n) = O(g(n)) nếu tồn tại các hằng số dương c và n₀ sao cho:
f(n) ≤ c · g(n) với mọi n ≥ n₀
```

### Common Complexities / Độ Phức Tạp Phổ Biến

```
Notation    | Name              | Example
------------|-------------------|---------------------------
O(1)        | Constant          | Array access, hash lookup
O(log n)    | Logarithmic       | Binary search
O(n)        | Linear            | Array traversal
O(n log n)  | Linearithmic      | Merge sort, quick sort
O(n²)       | Quadratic         | Nested loops, bubble sort
O(n³)       | Cubic             | Triple nested loops
O(2ⁿ)       | Exponential       | Recursive fibonacci
O(n!)       | Factorial         | Permutations
```

### Growth Rate Comparison / So Sánh Tốc Độ Tăng Trưởng

```
For n = 100:
O(1)      = 1
O(log n)  = 7
O(n)      = 100
O(n log n)= 700
O(n²)     = 10,000
O(2ⁿ)     = 1.27 × 10³⁰
O(n!)     = 9.33 × 10¹⁵⁷
```

---

## Time Complexity / Độ Phức Tạp Thời Gian

### O(1) - Constant Time / Thời Gian Hằng Số

**English:** Operations that take same time regardless of input size.

**Tiếng Việt:** Các thao tác mất cùng thời gian bất kể kích thước đầu vào.

```typescript
// O(1) examples / Ví dụ O(1)
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0]; // Single operation / Thao tác đơn
}

function hashLookup<K, V>(map: Map<K, V>, key: K): V | undefined {
  return map.get(key); // Hash table lookup / Tra cứu bảng băm
}

function swap(arr: number[], i: number, j: number): void {
  [arr[i], arr[j]] = [arr[j], arr[i]]; // Fixed operations / Thao tác cố định
}
```

### O(log n) - Logarithmic Time / Thời Gian Logarit

**English:** Divides problem size by constant factor each iteration.

**Tiếng Việt:** Chia kích thước vấn đề theo hệ số hằng số mỗi lần lặp.

```typescript
// Binary search - O(log n)
function binarySearch(arr: number[], target: number): number {
  let left = 0,
    right = arr.length - 1;

  while (left <= right) {
    // log₂(n) iterations / lần lặp
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// Binary tree height / Chiều cao cây nhị phân
function treeHeight(node: TreeNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(treeHeight(node.left), treeHeight(node.right));
}
// For balanced tree: O(log n) / Với cây cân bằng: O(log n)
```

### O(n) - Linear Time / Thời Gian Tuyến Tính

**English:** Time grows linearly with input size.

**Tiếng Việt:** Thời gian tăng tuyến tính với kích thước đầu vào.

```typescript
// Array traversal - O(n)
function findMax(arr: number[]): number {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    // n iterations / lần lặp
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// Linear search - O(n)
function linearSearch<T>(arr: T[], target: T): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// Sum array - O(n)
function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0);
}
```

### O(n log n) - Linearithmic Time / Thời Gian Tuyến Tính Logarit

**English:** Efficient sorting algorithms complexity.

**Tiếng Việt:** Độ phức tạp của thuật toán sắp xếp hiệu quả.

```typescript
// Merge sort - O(n log n)
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid)); // log n levels / cấp
  const right = mergeSort(arr.slice(mid));

  return merge(left, right); // O(n) merge / trộn
}

// Quick sort average case - O(n log n)
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter((x) => x < pivot);
  const middle = arr.filter((x) => x === pivot);
  const right = arr.filter((x) => x > pivot);

  return [...quickSort(left), ...middle, ...quickSort(right)];
}
```

### O(n²) - Quadratic Time / Thời Gian Bậc Hai

**English:** Nested iterations over input.

**Tiếng Việt:** Các vòng lặp lồng nhau trên đầu vào.

```typescript
// Bubble sort - O(n²)
function bubbleSort(arr: number[]): number[] {
  for (let i = 0; i < arr.length; i++) {
    // n iterations
    for (let j = 0; j < arr.length - i - 1; j++) {
      // n iterations
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Find all pairs - O(n²)
function findPairs(arr: number[]): number[][] {
  const pairs: number[][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
}

// Matrix multiplication - O(n³)
function matrixMultiply(a: number[][], b: number[][]): number[][] {
  const n = a.length;
  const result = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}
```

### O(2ⁿ) - Exponential Time / Thời Gian Mũ

**English:** Doubles with each additional input element.

**Tiếng Việt:** Tăng gấp đôi với mỗi phần tử đầu vào bổ sung.

```typescript
// Naive fibonacci - O(2ⁿ)
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
// Each call spawns 2 more calls / Mỗi lời gọi tạo ra 2 lời gọi khác

// Power set - O(2ⁿ)
function powerSet<T>(arr: T[]): T[][] {
  if (arr.length === 0) return [[]];

  const [first, ...rest] = arr;
  const subsetsWithoutFirst = powerSet(rest);
  const subsetsWithFirst = subsetsWithoutFirst.map((subset) => [first, ...subset]);

  return [...subsetsWithoutFirst, ...subsetsWithFirst];
}
```

---

## Space Complexity / Độ Phức Tạp Không Gian

### Definition / Định Nghĩa

**English:** Amount of memory used by algorithm relative to input size.

**Tiếng Việt:** Lượng bộ nhớ được sử dụng bởi thuật toán so với kích thước đầu vào.

### Examples / Ví Dụ

```typescript
// O(1) space - Constant / Hằng số
function sumArray(arr: number[]): number {
  let sum = 0; // Single variable / Biến đơn
  for (const num of arr) {
    sum += num;
  }
  return sum;
}

// O(n) space - Linear / Tuyến tính
function reverseArray<T>(arr: T[]): T[] {
  const reversed: T[] = []; // New array of size n / Mảng mới kích thước n
  for (let i = arr.length - 1; i >= 0; i--) {
    reversed.push(arr[i]);
  }
  return reversed;
}

// O(n) space - Recursive call stack / Ngăn xếp gọi đệ quy
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // n recursive calls / lời gọi đệ quy
}

// O(n²) space - 2D array / Mảng 2D
function createMatrix(n: number): number[][] {
  return Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));
}

// O(log n) space - Binary search recursive / Tìm kiếm nhị phân đệ quy
function binarySearchRecursive(
  arr: number[],
  target: number,
  left = 0,
  right = arr.length - 1,
): number {
  if (left > right) return -1;
  const mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);
  return binarySearchRecursive(arr, target, left, mid - 1);
}
// Call stack depth: log n / Độ sâu ngăn xếp gọi: log n
```

---

## Asymptotic Notations / Ký Hiệu Tiệm Cận

### Big O (O) - Upper Bound / Giới Hạn Trên

**English:** Worst-case complexity, upper bound on growth rate.

**Tiếng Việt:** Độ phức tạp trường hợp xấu nhất, giới hạn trên của tốc độ tăng trưởng.

```
f(n) = O(g(n)) means f(n) ≤ c · g(n) for large n
```

### Big Omega (Ω) - Lower Bound / Giới Hạn Dưới

**English:** Best-case complexity, lower bound on growth rate.

**Tiếng Việt:** Độ phức tạp trường hợp tốt nhất, giới hạn dưới của tốc độ tăng trưởng.

```
f(n) = Ω(g(n)) means f(n) ≥ c · g(n) for large n
```

### Big Theta (Θ) - Tight Bound / Giới Hạn Chặt

**English:** Average-case complexity, both upper and lower bound.

**Tiếng Việt:** Độ phức tạp trường hợp trung bình, cả giới hạn trên và dưới.

```
f(n) = Θ(g(n)) means c₁ · g(n) ≤ f(n) ≤ c₂ · g(n) for large n
```

### Example Analysis / Phân Tích Ví Dụ

```typescript
// Linear search / Tìm kiếm tuyến tính
function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// Best case: Ω(1) - target at first position / mục tiêu ở vị trí đầu
// Worst case: O(n) - target at last or not found / mục tiêu ở cuối hoặc không tìm thấy
// Average case: Θ(n) - on average check n/2 elements / trung bình kiểm tra n/2 phần tử
```

---

## Amortized Analysis / Phân Tích Khấu Hao

### Definition / Định Nghĩa

**English:** Average time per operation over a sequence of operations, accounting for expensive operations that occur rarely.

**Tiếng Việt:** Thời gian trung bình mỗi thao tác trên một chuỗi thao tác, tính đến các thao tác tốn kém xảy ra hiếm khi.

### Dynamic Array Example / Ví Dụ Mảng Động

```typescript
class DynamicArray<T> {
  private items: T[];
  private capacity: number;
  private size: number;

  constructor() {
    this.capacity = 1;
    this.items = new Array(this.capacity);
    this.size = 0;
  }

  push(item: T): void {
    if (this.size === this.capacity) {
      this.resize(); // O(n) but rare / nhưng hiếm
    }
    this.items[this.size++] = item; // O(1) most of time / hầu hết thời gian
  }

  private resize(): void {
    this.capacity *= 2;
    const newItems = new Array(this.capacity);
    for (let i = 0; i < this.size; i++) {
      newItems[i] = this.items[i];
    }
    this.items = newItems;
  }
}

/*
Analysis / Phân tích:
- Individual push: O(1) or O(n)
- Resize happens at: 1, 2, 4, 8, 16, ..., n
- Total cost for n pushes: n + (1 + 2 + 4 + ... + n) < 3n
- Amortized cost per push: O(1)
*/
```

---

## Master Theorem / Định Lý Master

### Definition / Định Nghĩa

**English:** Provides asymptotic analysis for divide-and-conquer recurrences.

**Tiếng Việt:** Cung cấp phân tích tiệm cận cho các quan hệ đệ quy chia để trị.

### Formula / Công Thức

```
T(n) = aT(n/b) + f(n)

where:
a = number of subproblems / số vấn đề con
b = factor by which problem size is reduced / hệ số giảm kích thước vấn đề
f(n) = cost of work outside recursive calls / chi phí công việc ngoài lời gọi đệ quy
```

### Cases / Các Trường Hợp

```
Case 1: If f(n) = O(n^(log_b(a) - ε)) for some ε > 0
        Then T(n) = Θ(n^(log_b(a)))

Case 2: If f(n) = Θ(n^(log_b(a)))
        Then T(n) = Θ(n^(log_b(a)) · log n)

Case 3: If f(n) = Ω(n^(log_b(a) + ε)) for some ε > 0
        and af(n/b) ≤ cf(n) for some c < 1
        Then T(n) = Θ(f(n))
```

### Examples / Ví Dụ

```typescript
// Binary search: T(n) = T(n/2) + O(1)
// a=1, b=2, f(n)=O(1)
// log_b(a) = log_2(1) = 0
// f(n) = O(1) = O(n^0) = Θ(n^(log_b(a)))
// Case 2: T(n) = Θ(log n)

// Merge sort: T(n) = 2T(n/2) + O(n)
// a=2, b=2, f(n)=O(n)
// log_b(a) = log_2(2) = 1
// f(n) = O(n) = Θ(n^(log_b(a)))
// Case 2: T(n) = Θ(n log n)

// Karatsuba multiplication: T(n) = 3T(n/2) + O(n)
// a=3, b=2, f(n)=O(n)
// log_b(a) = log_2(3) ≈ 1.585
// f(n) = O(n) = O(n^1) < O(n^1.585)
// Case 1: T(n) = Θ(n^1.585)
```

---

## Practical Examples / Ví Dụ Thực Tế

### Analyzing Real Code / Phân Tích Code Thực Tế

```typescript
// Example 1: Nested loops with different ranges
function example1(n: number): void {
  for (let i = 0; i < n; i++) {
    // n iterations
    for (let j = 0; j < i; j++) {
      // 0, 1, 2, ..., n-1 iterations
      console.log(i, j);
    }
  }
}
// Total iterations: 0 + 1 + 2 + ... + (n-1) = n(n-1)/2
// Time complexity: O(n²)

// Example 2: Logarithmic inner loop
function example2(n: number): void {
  for (let i = 0; i < n; i++) {
    // n iterations
    for (let j = 1; j < n; j *= 2) {
      // log n iterations
      console.log(i, j);
    }
  }
}
// Time complexity: O(n log n)

// Example 3: Multiple independent loops
function example3(n: number): void {
  for (let i = 0; i < n; i++) {
    // O(n)
    console.log(i);
  }

  for (let i = 0; i < n; i++) {
    // O(n)
    for (let j = 0; j < n; j++) {
      // O(n)
      console.log(i, j);
    }
  }
}
// Time complexity: O(n) + O(n²) = O(n²)

// Example 4: Recursive with memoization
function fibonacci(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  memo.set(n, result);
  return result;
}
// Without memo: O(2ⁿ) time, O(n) space
// With memo: O(n) time, O(n) space
```

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### 🟡 [Mid] Question 1: Analyze this code complexity

```typescript
function mystery(n: number): number {
  let count = 0;
  for (let i = n; i > 0; i = Math.floor(i / 2)) {
    for (let j = 0; j < i; j++) {
      count++;
    }
  }
  return count;
}
```

**English Answer:**

- Outer loop: i = n, n/2, n/4, ..., 1 → log n iterations
- Inner loop: n + n/2 + n/4 + ... + 1 ≈ 2n iterations total
- Time complexity: O(n)

**Tiếng Việt:**

- Vòng ngoài: i = n, n/2, n/4, ..., 1 → log n lần lặp
- Vòng trong: n + n/2 + n/4 + ... + 1 ≈ 2n lần lặp tổng
- Độ phức tạp thời gian: O(n)

### 🟡 [Mid] Question 2: Space vs Time trade-off

**English Answer:**
Often can trade space for time:

- **Memoization**: Store results, O(n) space for O(n) time
- **Hash tables**: O(n) space for O(1) lookup
- **Precomputation**: Store results, instant lookup

**Tiếng Việt:**
Thường có thể đánh đổi không gian cho thời gian:

- **Ghi nhớ**: Lưu kết quả, O(n) không gian cho O(n) thời gian
- **Bảng băm**: O(n) không gian cho O(1) tra cứu
- **Tính toán trước**: Lưu kết quả, tra cứu tức thì

---

## Key Takeaways / Điểm Chính

**English:**

1. Big O describes worst-case upper bound
2. Focus on dominant term, drop constants
3. Analyze both time and space complexity
4. Amortized analysis for sequences of operations
5. Master theorem for divide-and-conquer
6. Trade-offs between time and space

**Tiếng Việt:**

1. Big O mô tả giới hạn trên trường hợp xấu nhất
2. Tập trung vào số hạng chi phối, bỏ hằng số
3. Phân tích cả độ phức tạp thời gian và không gian
4. Phân tích khấu hao cho chuỗi thao tác
5. Định lý Master cho chia để trị
6. Đánh đổi giữa thời gian và không gian

---

[← Previous: Algorithms](./algorithms-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Design Patterns →](./data-structures-theory.md)

---

## Interview Q&A Summary / Tổng hợp câu hỏi phỏng vấn

### Q: What is Big O notation and why does it matter? / Big O là gì và tại sao quan trọng? 🟢 Junior

**A:** Big O describes algorithm performance as input size n grows — ignoring constants and lower-order terms.

```
Common complexities (best → worst):
O(1)       Constant    Array index access, hash lookup
O(log n)   Logarithmic Binary search, balanced BST operations
O(n)       Linear      Linear scan, single loop
O(n log n) Linearithmic Merge sort, heap sort (optimal comparison sort)
O(n²)      Quadratic   Bubble/insertion sort, nested loops
O(2ⁿ)      Exponential Fibonacci naive recursion, subset enumeration
O(n!)      Factorial   Permutations, brute-force TSP

Visual growth comparison (n=1000):
O(1)       → 1 operation
O(log n)   → 10 operations
O(n)       → 1,000 operations
O(n log n) → 10,000 operations
O(n²)      → 1,000,000 operations  ← often unacceptable at scale
O(2ⁿ)      → 10^301 operations     ← computationally infeasible
```

**Rules for calculating Big O:**
```
1. Drop constants:   O(3n) → O(n)
2. Drop lower terms: O(n² + n) → O(n²)
3. Different inputs: O(n) for array A + O(m) for array B = O(n + m), NOT O(n²)
4. Nested loops:     O(n) × O(n) = O(n²) — only if both depend on same n
```

**Best/Average/Worst case:**
```
Algorithm    Best      Average   Worst
Quicksort    O(n logn) O(n logn) O(n²)  ← pivot always min/max
Mergesort    O(n logn) O(n logn) O(n logn) — always predictable
Binary search O(1)     O(log n)  O(log n)
Hash lookup  O(1)      O(1)      O(n)   ← all keys collide
```

**Điểm quan trọng:** Big O đo lường scalability, không phải absolute speed. O(log n) đánh bại O(n) khi n lớn dù constant factor của O(log n) lớn hơn. Trong interview, luôn phân tích cả time và space complexity.

### Q: How do you analyze space complexity? / Phân tích space complexity như thế nào? 🟡 Mid

**A:**

```
Space complexity = extra memory your algorithm uses (beyond input)

Common patterns:
O(1)    Constant space: use fixed variables, in-place operations
        Example: two-pointer, sliding window, bubble sort

O(log n) Recursive call stack in balanced tree/binary search
        Example: binary search recursion → log n stack frames

O(n)    Store copy of input, or output proportional to n
        Example: creating new array, hash map of all elements

O(n²)   2D matrix proportional to input
        Example: DP table for sequence alignment

Recursive algorithms — count call stack depth:
  fibonacci(n) → depth n → O(n) space
  binary search(n) → depth log n → O(log n) space
  merge sort → depth log n levels → O(n) total (merge step)

Space vs Time tradeoff:
  Naive:     O(n²) time, O(1) space
  Optimized: O(n) time, O(n) space  ← hash map as cache
  Example: Two Sum
    Brute force: nested loop O(n²) time, O(1) space
    Hash map: O(n) time, O(n) space (store seen values)
```

**Điểm interview:** Space complexity thường bị quên. Luôn mention cả time và space. Nếu dùng recursion, mention call stack space. Trade-off thường là O(n) space đổi lấy O(n) time improvement.

### Q: What is amortized analysis? Give an example / Phân tích amortized là gì? 🔴 Senior

**A:** Amortized analysis = average cost per operation over a sequence of N operations, even if some operations are expensive.

```
Classic example: Dynamic Array (ArrayList/Go slice)

When append() causes resize:
├── Allocate 2× current capacity
├── Copy all elements to new array
└── This resize is O(n) — expensive!

But how often does resize happen?
  capacity: 1 → 2 → 4 → 8 → 16 → 32 → ...
  copies:   1 + 2 + 4 + 8 + 16 = 31 total copies for 16 elements
  Average copies per append = 31/16 ≈ 2 → O(1) amortized!

Formal accounting method:
  "Charge" each append $3:
  ├── $1 for the current append
  ├── $1 to pay for future copy of this element
  └── $1 to pay for copying an old element when resize happens
  → Bank account always positive → O(1) amortized

Other amortized examples:
  Stack with push/pop + getMin: O(1) amortized with auxiliary stack
  Fibonacci heap: decrease-key O(1) amortized
  Union-Find (path compression): O(α(n)) ≈ O(1) amortized
  HashMap: occasional O(n) rehash → O(1) amortized insert
```

**Điểm senior:** Amortized khác với average-case (probabilistic). Amortized là guarantee về sequence of operations, không phải single operation. Thường xuất hiện trong data structures với lazy operations (resize, consolidation, path compression).

---

## Self-Check / Tự Kiểm Tra

- [ ] Tôi có thể giải thích O(1), O(log n), O(n), O(n log n), O(n²) bằng ví dụ thực tế không?
- [ ] Tôi có thể tính Big O của một đoạn code có nested loop không?
- [ ] Tôi có thể giải thích tại sao HashMap lookup là O(1) nhưng đôi khi là O(n) không?
- [ ] Tôi có thể phân biệt time complexity vs space complexity không?
- [ ] Tôi có thể giải thích "amortized O(1)" của ArrayList.append() không?

💬 **Feynman Prompt:** Giải thích Big O Notation cho người không biết lập trình. Dùng ví dụ tìm kiếm trong danh bạ điện thoại hoặc tìm sách trong thư viện.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Data Structures](./data-structures-theory.md) — cần hiểu data structures để phân tích complexity của chúng
- ➡️ **Enables:** [Algorithms Theory](./algorithms-theory.md) — complexity analysis là ngôn ngữ để so sánh các giải thuật
- 🔗 **Applied in:** LeetCode — mọi solution cần state time + space complexity
