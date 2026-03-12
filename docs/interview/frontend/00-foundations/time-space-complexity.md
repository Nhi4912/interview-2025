# Time & Space Complexity

> Phân tích độ phức tạp thuật toán - kỹ năng quan trọng trong phỏng vấn Big Tech.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLEXITY ANALYSIS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   BIG O NOTATION:                                               │
│   ──────────────                                                 │
│   • Describes WORST CASE performance                            │
│   • Measures GROWTH RATE as input increases                     │
│   • Ignores constants and lower-order terms                     │
│                                                                   │
│   COMPLEXITY RANKING (Tốt → Xấu):                               │
│   ─────────────────────────────────                              │
│   O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n) < O(n!) │
│                                                                   │
│   WHAT WE MEASURE:                                              │
│   ────────────────                                               │
│   • TIME: Number of operations                                  │
│   • SPACE: Memory used                                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📖 Common Complexities

### O(1) - Constant

```javascript
// Không phụ thuộc vào input size
function getFirst(arr) {
  return arr[0];  // O(1)
}

function hashLookup(map, key) {
  return map.get(key);  // O(1) average
}

// Array operations
arr[i];           // Access by index - O(1)
arr.push(item);   // Add to end - O(1) amortized
arr.pop();        // Remove from end - O(1)
```

### O(log n) - Logarithmic

```javascript
// Mỗi step loại bỏ một nửa input
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left <= right) {        // O(log n) iterations
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

// n = 1,000,000 → ~20 operations
// n = 1,000,000,000 → ~30 operations
```

### O(n) - Linear

```javascript
// Tỷ lệ thuận với input size
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {  // O(n)
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// Common O(n) operations
arr.map(fn);      // Transform all elements
arr.filter(fn);   // Check all elements
arr.reduce(fn);   // Process all elements
arr.indexOf(x);   // Search all elements
```

### O(n log n) - Linearithmic

```javascript
// Thường gặp ở sorting algorithms
arr.sort((a, b) => a - b);  // O(n log n)

// Merge Sort
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));   // T(n/2)
  const right = mergeSort(arr.slice(mid));     // T(n/2)

  return merge(left, right);  // O(n)
}
// T(n) = 2T(n/2) + O(n) = O(n log n)
```

### O(n²) - Quadratic

```javascript
// Nested loops over same data
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {       // O(n)
    for (let j = 0; j < arr.length - i; j++) { // O(n)
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Common O(n²) patterns
// Two nested loops over array
// Comparing all pairs
// Simple 2D grid traversal
```

### O(2^n) - Exponential

```javascript
// Doubles with each input increase
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
// T(n) = T(n-1) + T(n-2) + O(1) ≈ O(2^n)

// Subsets generation
function subsets(nums) {
  const result = [[]];
  for (const num of nums) {           // O(n)
    const len = result.length;
    for (let i = 0; i < len; i++) {   // O(2^n)
      result.push([...result[i], num]);
    }
  }
  return result;  // 2^n subsets
}
```

---

## 📊 Visual Comparison

```
INPUT SIZE n vs OPERATIONS:
───────────────────────────

n       O(1)    O(log n)  O(n)      O(n log n)  O(n²)      O(2^n)
────────────────────────────────────────────────────────────────────
10      1       3         10        33          100        1,024
100     1       7         100       664         10,000     1.27×10³⁰
1,000   1       10        1,000     9,966       1,000,000  HUGE
10,000  1       13        10,000    132,877     100M       ∞


GROWTH VISUALIZATION:
─────────────────────

Operations
    │
    │                                          • O(n²)
    │                                    •
    │                              •
    │                        •
    │                 • O(n log n)
    │           • • •
    │      • • • • • O(n)
    │ • • • • • • • •
──────────────────────────────────────────── Input Size
    │ O(1)   O(log n)
```

---

## 🧮 How to Analyze

### Rules

```
RULE 1: Drop Constants
──────────────────────
O(2n) = O(n)
O(n/2) = O(n)
O(100n) = O(n)

RULE 2: Drop Lower-Order Terms
──────────────────────────────
O(n² + n) = O(n²)
O(n³ + n² + n) = O(n³)
O(n + log n) = O(n)

RULE 3: Different Inputs = Different Variables
──────────────────────────────────────────────
function compare(arr1, arr2) {
  for (let a of arr1) {    // O(a)
    for (let b of arr2) {  // O(b)
      // ...
    }
  }
}
// = O(a × b), NOT O(n²)
```

### Step-by-Step Analysis

```javascript
function example(arr) {           // arr.length = n
  let sum = 0;                    // O(1)

  for (let i = 0; i < arr.length; i++) {  // Loop runs n times
    sum += arr[i];                // O(1) per iteration
  }                               // Total: O(n)

  for (let i = 0; i < arr.length; i++) {  // O(n)
    for (let j = 0; j < arr.length; j++) {  // O(n)
      console.log(arr[i], arr[j]);  // O(1)
    }
  }                               // Total: O(n²)

  return sum;                     // O(1)
}

// TOTAL: O(1) + O(n) + O(n²) + O(1) = O(n²)
```

---

## 💾 Space Complexity

### Common Patterns

```javascript
// O(1) - Constant Space
function sum(arr) {
  let total = 0;  // Just one variable
  for (const num of arr) {
    total += num;
  }
  return total;
}

// O(n) - Linear Space
function duplicate(arr) {
  const result = [];  // New array of same size
  for (const item of arr) {
    result.push(item);
  }
  return result;
}

// O(n) - Call Stack
function recursiveSum(arr, i = 0) {
  if (i === arr.length) return 0;
  return arr[i] + recursiveSum(arr, i + 1);
}
// n recursive calls = O(n) stack space

// O(log n) - Balanced Recursion
function binarySearchRecursive(arr, target, left, right) {
  if (left > right) return -1;
  const mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  }
  return binarySearchRecursive(arr, target, left, mid - 1);
}
// log n recursive calls
```

### Time vs Space Trade-offs

```javascript
// Trade-off Example: Two Sum

// Approach 1: O(n²) time, O(1) space
function twoSumBruteForce(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
}

// Approach 2: O(n) time, O(n) space
function twoSumHashMap(nums, target) {
  const map = new Map();  // Extra O(n) space
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}

// Usually prefer faster time complexity
// Unless memory is severely constrained
```

---

## 📋 Quick Reference

### JavaScript Built-in Methods

```
┌────────────────────────────┬──────────────┬──────────────┐
│ Method                     │ Time         │ Space        │
├────────────────────────────┼──────────────┼──────────────┤
│ arr[i]                     │ O(1)         │ O(1)         │
│ arr.push()                 │ O(1)*        │ O(1)         │
│ arr.pop()                  │ O(1)         │ O(1)         │
│ arr.shift()                │ O(n)         │ O(1)         │
│ arr.unshift()              │ O(n)         │ O(1)         │
│ arr.slice()                │ O(n)         │ O(n)         │
│ arr.splice()               │ O(n)         │ O(n)         │
│ arr.sort()                 │ O(n log n)   │ O(log n)     │
│ arr.map/filter/reduce      │ O(n)         │ O(n)         │
│ arr.indexOf/includes       │ O(n)         │ O(1)         │
│ arr.find/findIndex         │ O(n)         │ O(1)         │
│                            │              │              │
│ obj[key]                   │ O(1)*        │ O(1)         │
│ Object.keys/values         │ O(n)         │ O(n)         │
│                            │              │              │
│ Map.get/set/has/delete     │ O(1)*        │ O(1)         │
│ Set.add/has/delete         │ O(1)*        │ O(1)         │
│                            │              │              │
│ str.indexOf                │ O(n×m)       │ O(1)         │
│ str.slice                  │ O(n)         │ O(n)         │
│ str + str                  │ O(n)         │ O(n)         │
└────────────────────────────┴──────────────┴──────────────┘
* Amortized, worst case may be O(n)
```

### Algorithm Patterns

```
┌──────────────────────────────┬──────────────┬──────────────┐
│ Pattern                      │ Time         │ Space        │
├──────────────────────────────┼──────────────┼──────────────┤
│ Two Pointers                 │ O(n)         │ O(1)         │
│ Sliding Window               │ O(n)         │ O(1) or O(k) │
│ Hash Map Lookup              │ O(n)         │ O(n)         │
│ Binary Search                │ O(log n)     │ O(1)         │
│ BFS/DFS (graph)              │ O(V + E)     │ O(V)         │
│ Sorting-based                │ O(n log n)   │ O(n)         │
│ Brute Force (2 loops)        │ O(n²)        │ O(1)         │
│ Backtracking                 │ O(k^n)       │ O(n)         │
│ DP (bottom-up)               │ varies       │ O(n) - O(n²) │
└──────────────────────────────┴──────────────┴──────────────┘
```

---

## 🎯 Interview Tips

### How to Discuss Complexity

```
TEMPLATE:
─────────
"This solution is O(n) time because we iterate through
the array once, and O(1) space because we only use
a constant number of variables."

ALWAYS MENTION:
• Time complexity
• Space complexity
• Best/Average/Worst case if different
• Trade-offs with alternative approaches
```

### Common Mistakes

```
MISTAKE 1: Forgetting hidden loops
──────────────────────────────────
arr.indexOf(x)  // O(n), not O(1)
str.includes(x) // O(n), not O(1)

MISTAKE 2: String concatenation in loop
────────────────────────────────────────
let result = "";
for (const char of str) {
  result += char;  // Creates new string each time: O(n²)
}
// Fix: Use array + join
const chars = [];
for (const char of str) chars.push(char);
result = chars.join("");  // O(n)

MISTAKE 3: Recursive without memoization
────────────────────────────────────────
fib(n) without memo: O(2^n)
fib(n) with memo: O(n)
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

1. **Q: What is O(n)?**

   A: O(n) means the algorithm's runtime grows linearly with input size. If n doubles, time roughly doubles.

### 🟡 Mid-Level

2. **Q: Analyze this code's complexity:**
   ```javascript
   for (let i = 0; i < n; i++) {
     for (let j = i; j < n; j++) {
       // ...
     }
   }
   ```

   A: O(n²). Inner loop runs n + (n-1) + (n-2) + ... + 1 = n(n+1)/2 ≈ n²/2 = O(n²).

### 🔴 Senior

3. **Q: How would you optimize O(n²) to O(n log n)?**

   A: Common approaches: (1) Sort first, then use two pointers, (2) Use binary search instead of linear search, (3) Use divide and conquer.

---

> **Tiếp theo:** [Mind Map](./mindmap-foundations.md) | **Quay lại:** [Foundations](./README.md)
