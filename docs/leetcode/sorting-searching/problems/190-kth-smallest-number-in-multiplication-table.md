---
layout: page
title: "Kth Smallest Number in Multiplication Table"
difficulty: Hard
category: Sorting-Searching
tags: [Math, Binary Search]
leetcode_url: "https://leetcode.com/problems/kth-smallest-number-in-multiplication-table"
---

# Kth Smallest Number in Multiplication Table / Số Nhỏ Thứ K Trong Bảng Nhân

🔴 Hard | 🏷️ Math, Binary Search

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Bảng nhân m×n: hàng i chứa i, 2i, 3i, ..., n×i. Tổng m×n phần tử. Binary search trên giá trị: với một giá trị `mid`, đếm bao nhiêu phần tử ≤ mid? Hàng i có `min(floor(mid/i), n)` phần tử ≤ mid. Tìm giá trị nhỏ nhất sao cho số phần tử ≤ nó ≥ k.

```
m=3, n=3, k=5
Table:  1 2 3
        2 4 6
        3 6 9

Binary search: mid=4
  row1: min(4/1,3)=3  row2: min(4/2,3)=2  row3: min(4/3,3)=1
  count=6 ≥ 5 → try smaller

mid=3: row1=3, row2=1, row3=1 → count=5 ≥ 5 → answer=3
```

## Problem Description

Given `m`, `n`, and `k`, return the **k-th smallest** element in the m×n multiplication table. The table's cell `(i,j) = i*j`.

**Example 1:** `m=3, n=3, k=5` → `3`

**Example 2:** `m=2, n=3, k=6` → `6`

## 📝 Interview Tips

- 🔑 **Key insight / Chìa khóa:** Binary search on value; count(val) = sum over rows of min(floor(val/i), n)
- 🔑 **Count formula / Công thức đếm:** Row i contributes `min(⌊val/i⌋, n)` elements ≤ val
- 🔑 **Answer is exact / Chính xác:** The binary search target (lo) is always an element that exists in the table
- ⚠️ **Search space / Không gian tìm:** lo=1, hi=m\*n (max value in table)
- ⚠️ **Strictly less / Chặt:** We search for smallest x where count(x) >= k; this x is in the table
- 🔗 **Pattern / Mẫu:** "Kth in implicit sorted matrix" → binary search on answer value + counting function

## Solutions

### Solution 1: Binary Search on Value

```typescript
/**
 * Binary search on the multiplication table value range [1, m*n].
 * Count elements <= mid across all rows in O(m) per step.
 * Time: O(m * log(m*n))  Space: O(1)
 */
function findKthNumber(m: number, n: number, k: number): number {
  // Count how many elements in table are <= val
  const countLE = (val: number): number => {
    let count = 0;
    for (let i = 1; i <= m; i++) {
      count += Math.min(Math.floor(val / i), n);
    }
    return count;
  };

  let lo = 1,
    hi = m * n;

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (countLE(mid) >= k) hi = mid;
    else lo = mid + 1;
  }

  return lo;
}

console.log(findKthNumber(3, 3, 5)); // 3
console.log(findKthNumber(2, 3, 6)); // 6
console.log(findKthNumber(1, 1, 1)); // 1
console.log(findKthNumber(3, 3, 1)); // 1
console.log(findKthNumber(3, 3, 9)); // 9
```

### Solution 2: Heap-Based (For Verification, Less Efficient)

```typescript
/**
 * Use a min-heap to extract elements one by one until kth.
 * Time: O(k * log m)  Space: O(m)
 * Only feasible for small k; here for comparison.
 */
function findKthNumberHeap(m: number, n: number, k: number): number {
  // Heap: [value, row, col]  (col tracks position in each row)
  type Entry = [number, number, number];
  const heap: Entry[] = [];

  const push = (entry: Entry) => {
    heap.push(entry);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] > heap[i][0]) {
        [heap[p], heap[i]] = [heap[i], heap[p]];
        i = p;
      } else break;
    }
  };

  const pop = (): Entry => {
    const top = heap[0];
    heap[0] = heap.pop()!;
    let i = 0;
    while (true) {
      let s = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < heap.length && heap[l][0] < heap[s][0]) s = l;
      if (r < heap.length && heap[r][0] < heap[s][0]) s = r;
      if (s === i) break;
      [heap[i], heap[s]] = [heap[s], heap[i]];
      i = s;
    }
    return top;
  };

  // Push first element of each row
  for (let i = 1; i <= m; i++) push([i, i, 1]);

  let val = 0;
  for (let i = 0; i < k; i++) {
    const [v, row, col] = pop();
    val = v;
    if (col < n) push([row * (col + 1), row, col + 1]);
  }
  return val;
}

console.log(findKthNumberHeap(3, 3, 5)); // 3
console.log(findKthNumberHeap(2, 3, 6)); // 6
```

### Solution 3: Annotated Binary Search with Proof

```typescript
/**
 * Same as Solution 1 but with detailed commentary for interview explanation.
 */
function findKthNumberVerbose(m: number, n: number, k: number): number {
  // Why does lo converge to the answer?
  // Invariant: the kth smallest is always in [lo, hi]
  // count(mid) >= k means there are at least k elements <= mid, so kth <= mid → hi = mid
  // count(mid) < k means fewer than k elements <= mid, so kth > mid → lo = mid+1
  // Loop terminates with lo = hi = smallest x with count(x) >= k
  // This x IS in the table (proof: count(x) >= k > count(x-1), so x must appear)

  const count = (val: number): number => {
    let c = 0;
    for (let i = 1; i <= m; i++) c += Math.min(Math.floor(val / i), n);
    return c;
  };

  let lo = 1,
    hi = m * n;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    count(mid) >= k ? (hi = mid) : (lo = mid + 1);
  }
  return lo;
}

console.log(findKthNumberVerbose(3, 3, 5)); // 3
console.log(findKthNumberVerbose(2, 3, 6)); // 6
console.log(findKthNumberVerbose(1, 1, 1)); // 1
```

## 🔗 Related Problems

| Problem                                                                                                           | Difficulty | Pattern                |
| ----------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------- |
| [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) | Medium     | Binary search on value |
| [Find K-th Smallest Pair Distance](https://leetcode.com/problems/find-k-th-smallest-pair-distance/)               | Hard       | Binary search + count  |
| [Median of a Row Wise Sorted Matrix](https://leetcode.com/problems/median-of-a-row-wise-sorted-matrix/)           | Medium     | Binary search on value |
| [Super Ugly Number](https://leetcode.com/problems/super-ugly-number/)                                             | Medium     | Heap / DP              |
