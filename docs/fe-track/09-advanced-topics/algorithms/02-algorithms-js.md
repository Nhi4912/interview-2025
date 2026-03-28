# Algorithms / Thuật Toán

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Computer Science Fundamentals - Chapter 2 / Khoa Học Máy Tính Cơ Bản - Chương 2

[← Previous: Data Structures](./01-data-structures-js.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Complexity Analysis →](./08-web-performance-theory.md)

---

## Overview / Tổng Quan

**English:** Algorithms are step-by-step procedures for solving computational problems. Understanding algorithmic paradigms, complexity analysis, and optimization techniques is fundamental to computer science and essential for technical interviews.

**Tiếng Việt:** Thuật toán là các thủ tục từng bước để giải quyết các vấn đề tính toán. Hiểu các mô hình thuật toán, phân tích độ phức tạp và kỹ thuật tối ưu hóa là nền tảng của khoa học máy tính và cần thiết cho phỏng vấn kỹ thuật.

---

## Table of Contents / Mục Lục

1. [Sorting Algorithms / Thuật Toán Sắp Xếp](#sorting-algorithms--thuật-toán-sắp-xếp)
2. [Searching Algorithms / Thuật Toán Tìm Kiếm](#searching-algorithms--thuật-toán-tìm-kiếm)
3. [Divide and Conquer / Chia Để Trị](#divide-and-conquer--chia-để-trị)
4. [Dynamic Programming / Quy Hoạch Động](#dynamic-programming--quy-hoạch-động)
5. [Greedy Algorithms / Thuật Toán Tham Lam](#greedy-algorithms--thuật-toán-tham-lam)
6. [Backtracking / Quay Lui](#backtracking--quay-lui)
7. [Graph Algorithms / Thuật Toán Đồ Thị](#graph-algorithms--thuật-toán-đồ-thị)
8. [String Algorithms / Thuật Toán Chuỗi](#string-algorithms--thuật-toán-chuỗi)
9. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## Sorting Algorithms / Thuật Toán Sắp Xếp

### Comparison of Sorting Algorithms / So Sánh Thuật Toán Sắp Xếp

```
Algorithm      | Best    | Average | Worst   | Space | Stable
---------------|---------|---------|---------|-------|--------
Bubble Sort    | O(n)    | O(n²)   | O(n²)   | O(1)  | Yes
Selection Sort | O(n²)   | O(n²)   | O(n²)   | O(1)  | No
Insertion Sort | O(n)    | O(n²)   | O(n²)   | O(1)  | Yes
Merge Sort     | O(nlogn)| O(nlogn)| O(nlogn)| O(n)  | Yes
Quick Sort     | O(nlogn)| O(nlogn)| O(n²)   | O(logn)| No
Heap Sort      | O(nlogn)| O(nlogn)| O(nlogn)| O(1)  | No
```

### Bubble Sort / Sắp Xếp Nổi Bọt

**Theory / Lý Thuyết:**
Repeatedly steps through the list, compares adjacent elements and swaps them if they're in wrong order.

**Tiếng Việt:** Lặp đi lặp lại qua danh sách, so sánh các phần tử liền kề và hoán đổi chúng nếu chúng sai thứ tự.

```typescript
function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap / Hoán đổi
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // If no swaps, array is sorted / Nếu không hoán đổi, mảng đã sắp xếp
    if (!swapped) break;
  }
  
  return arr;
}

// Time: O(n²), Space: O(1)
console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
// [11, 12, 22, 25, 34, 64, 90]
```

### Merge Sort / Sắp Xếp Trộn

**Theory / Lý Thuyết:**
Divide-and-conquer algorithm that divides array into halves, recursively sorts them, then merges sorted halves.

**Tiếng Việt:** Thuật toán chia để trị chia mảng thành các nửa, sắp xếp đệ quy chúng, sau đó trộn các nửa đã sắp xếp.

```typescript
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// Time: O(n log n), Space: O(n)
console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));
// [3, 9, 10, 27, 38, 43, 82]
```

### Quick Sort / Sắp Xếp Nhanh

**Theory / Lý Thuyết:**
Picks a pivot element, partitions array around pivot, recursively sorts partitions.

**Tiếng Việt:** Chọn phần tử trục, phân vùng mảng xung quanh trục, sắp xếp đệ quy các phân vùng.

```typescript
function quickSort(arr: number[], low = 0, high = arr.length - 1): number[] {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// Time: O(n log n) average, O(n²) worst, Space: O(log n)
console.log(quickSort([10, 7, 8, 9, 1, 5]));
// [1, 5, 7, 8, 9, 10]
```

---

## Searching Algorithms / Thuật Toán Tìm Kiếm

### Binary Search / Tìm Kiếm Nhị Phân

**Theory / Lý Thuyết:**
Efficiently searches sorted array by repeatedly dividing search interval in half.

**Tiếng Việt:** Tìm kiếm hiệu quả mảng đã sắp xếp bằng cách liên tục chia khoảng tìm kiếm làm đôi.

```typescript
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Not found / Không tìm thấy
}

// Recursive version / Phiên bản đệ quy
function binarySearchRecursive(
  arr: number[],
  target: number,
  left = 0,
  right = arr.length - 1
): number {
  if (left > right) return -1;
  
  const mid = Math.floor((left + right) / 2);
  
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);
  return binarySearchRecursive(arr, target, left, mid - 1);
}

// Time: O(log n), Space: O(1) iterative, O(log n) recursive
const sorted = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(sorted, 7)); // 3
console.log(binarySearch(sorted, 6)); // -1
```

### Binary Search Variations / Biến Thể Tìm Kiếm Nhị Phân

```typescript
// Find first occurrence / Tìm lần xuất hiện đầu tiên
function findFirst(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      result = mid;
      right = mid - 1; // Continue searching left / Tiếp tục tìm bên trái
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}

// Find last occurrence / Tìm lần xuất hiện cuối cùng
function findLast(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      result = mid;
      left = mid + 1; // Continue searching right / Tiếp tục tìm bên phải
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}

// Find insertion position / Tìm vị trí chèn
function searchInsert(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return left;
}
```

---

## Divide and Conquer / Chia Để Trị

### Theory / Lý Thuyết

**English:** Divide problem into smaller subproblems, solve recursively, combine solutions.

**Tiếng Việt:** Chia vấn đề thành các vấn đề con nhỏ hơn, giải đệ quy, kết hợp các giải pháp.

### Steps / Các Bước

1. **Divide** / Chia: Break problem into subproblems
2. **Conquer** / Chinh phục: Solve subproblems recursively
3. **Combine** / Kết hợp: Merge solutions

### Example: Maximum Subarray / Ví Dụ: Mảng Con Tối Đa

```typescript
// Kadane's Algorithm / Thuật toán Kadane
function maxSubArray(nums: number[]): number {
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  
  return maxSoFar;
}

// Divide and Conquer approach / Cách tiếp cận chia để trị
function maxSubArrayDC(nums: number[], left = 0, right = nums.length - 1): number {
  if (left === right) return nums[left];
  
  const mid = Math.floor((left + right) / 2);
  
  const leftMax = maxSubArrayDC(nums, left, mid);
  const rightMax = maxSubArrayDC(nums, mid + 1, right);
  const crossMax = maxCrossingSum(nums, left, mid, right);
  
  return Math.max(leftMax, rightMax, crossMax);
}

function maxCrossingSum(nums: number[], left: number, mid: number, right: number): number {
  let leftSum = -Infinity;
  let sum = 0;
  
  for (let i = mid; i >= left; i--) {
    sum += nums[i];
    leftSum = Math.max(leftSum, sum);
  }
  
  let rightSum = -Infinity;
  sum = 0;
  
  for (let i = mid + 1; i <= right; i++) {
    sum += nums[i];
    rightSum = Math.max(rightSum, sum);
  }
  
  return leftSum + rightSum;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
```

---

## Dynamic Programming / Quy Hoạch Động

### Theory / Lý Thuyết

**English:** Solve complex problems by breaking them down into simpler subproblems and storing results to avoid redundant calculations.

**Tiếng Việt:** Giải quyết các vấn đề phức tạp bằng cách chia chúng thành các vấn đề con đơn giản hơn và lưu trữ kết quả để tránh tính toán dư thừa.

### Characteristics / Đặc Điểm

1. **Optimal Substructure** / Cấu trúc con tối ưu
2. **Overlapping Subproblems** / Các vấn đề con chồng chéo

### Fibonacci Sequence / Dãy Fibonacci

```typescript
// Naive recursive / Đệ quy ngây thơ - O(2^n)
function fibRecursive(n: number): number {
  if (n <= 1) return n;
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

// Memoization (Top-down DP) / Ghi nhớ (DP từ trên xuống) - O(n)
function fibMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;
  
  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

// Tabulation (Bottom-up DP) / Lập bảng (DP từ dưới lên) - O(n)
function fibTab(n: number): number {
  if (n <= 1) return n;
  
  const dp: number[] = [0, 1];
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// Space optimized / Tối ưu không gian - O(1)
function fibOptimized(n: number): number {
  if (n <= 1) return n;
  
  let prev = 0, curr = 1;
  
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr;
}

console.log(fibMemo(10)); // 55
console.log(fibTab(10)); // 55
console.log(fibOptimized(10)); // 55
```

### Longest Common Subsequence / Dãy Con Chung Dài Nhất

```typescript
function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}

console.log(longestCommonSubsequence('abcde', 'ace')); // 3
```

### 0/1 Knapsack Problem / Bài Toán Cái Túi 0/1

```typescript
function knapsack(weights: number[], values: number[], capacity: number): number {
  const n = weights.length;
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][capacity];
}

const weights = [1, 3, 4, 5];
const values = [1, 4, 5, 7];
const capacity = 7;
console.log(knapsack(weights, values, capacity)); // 9
```

---

## Greedy Algorithms / Thuật Toán Tham Lam

### Theory / Lý Thuyết

**English:** Make locally optimal choice at each step, hoping to find global optimum.

**Tiếng Việt:** Đưa ra lựa chọn tối ưu cục bộ ở mỗi bước, hy vọng tìm được tối ưu toàn cục.

### Activity Selection / Lựa Chọn Hoạt Động

```typescript
interface Activity {
  start: number;
  end: number;
}

function activitySelection(activities: Activity[]): Activity[] {
  // Sort by end time / Sắp xếp theo thời gian kết thúc
  activities.sort((a, b) => a.end - b.end);
  
  const selected: Activity[] = [activities[0]];
  let lastEnd = activities[0].end;
  
  for (let i = 1; i < activities.length; i++) {
    if (activities[i].start >= lastEnd) {
      selected.push(activities[i]);
      lastEnd = activities[i].end;
    }
  }
  
  return selected;
}

const activities = [
  { start: 1, end: 3 },
  { start: 2, end: 4 },
  { start: 3, end: 5 },
  { start: 0, end: 6 },
  { start: 5, end: 7 },
  { start: 8, end: 9 },
  { start: 5, end: 9 }
];

console.log(activitySelection(activities));
// [{ start: 1, end: 3 }, { start: 3, end: 5 }, { start: 5, end: 7 }, { start: 8, end: 9 }]
```

### Coin Change (Greedy) / Đổi Tiền (Tham Lam)

```typescript
function coinChangeGreedy(coins: number[], amount: number): number[] {
  coins.sort((a, b) => b - a); // Sort descending / Sắp xếp giảm dần
  const result: number[] = [];
  
  for (const coin of coins) {
    while (amount >= coin) {
      result.push(coin);
      amount -= coin;
    }
  }
  
  return amount === 0 ? result : [];
}

console.log(coinChangeGreedy([25, 10, 5, 1], 63)); // [25, 25, 10, 1, 1, 1]
```

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Question 1: When to use which sorting algorithm?

**English Answer:**
- **Quick Sort**: General purpose, average O(n log n)
- **Merge Sort**: Stable sort needed, guaranteed O(n log n)
- **Insertion Sort**: Small arrays, nearly sorted data
- **Heap Sort**: Memory constrained, O(n log n) worst case

**Tiếng Việt:**
- **Quick Sort**: Mục đích chung, trung bình O(n log n)
- **Merge Sort**: Cần sắp xếp ổn định, đảm bảo O(n log n)
- **Insertion Sort**: Mảng nhỏ, dữ liệu gần như đã sắp xếp
- **Heap Sort**: Hạn chế bộ nhớ, O(n log n) trường hợp xấu nhất

### Question 2: DP vs Greedy?

**English Answer:**
- **DP**: Optimal substructure + overlapping subproblems, guarantees optimal solution
- **Greedy**: Local optimal choices, may not guarantee global optimum, faster
- **Use DP** when: Need optimal solution, greedy doesn't work
- **Use Greedy** when: Greedy choice property holds, faster solution acceptable

**Tiếng Việt:**
- **DP**: Cấu trúc con tối ưu + vấn đề con chồng chéo, đảm bảo giải pháp tối ưu
- **Tham lam**: Lựa chọn tối ưu cục bộ, có thể không đảm bảo tối ưu toàn cục, nhanh hơn
- **Dùng DP** khi: Cần giải pháp tối ưu, tham lam không hoạt động
- **Dùng Tham lam** khi: Thuộc tính lựa chọn tham lam đúng, giải pháp nhanh chấp nhận được

---

## Key Takeaways / Điểm Chính

**English:**
1. Master fundamental sorting and searching algorithms
2. Understand time/space complexity trade-offs
3. Recognize when to apply each algorithmic paradigm
4. Practice implementing algorithms from scratch
5. Analyze problem constraints to choose optimal approach
6. Dynamic programming for optimization problems

**Tiếng Việt:**
1. Thành thạo thuật toán sắp xếp và tìm kiếm cơ bản
2. Hiểu sự đánh đổi độ phức tạp thời gian/không gian
3. Nhận biết khi nào áp dụng mỗi mô hình thuật toán
4. Thực hành triển khai thuật toán từ đầu
5. Phân tích ràng buộc vấn đề để chọn cách tiếp cận tối ưu
6. Quy hoạch động cho các vấn đề tối ưu hóa

---

[← Previous: Data Structures](./01-data-structures-js.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Complexity Analysis →](./08-web-performance-theory.md)
