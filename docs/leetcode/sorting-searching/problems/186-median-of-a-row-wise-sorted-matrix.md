---
layout: page
title: "Median of a Row Wise Sorted Matrix"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Matrix]
leetcode_url: "https://leetcode.com/problems/median-of-a-row-wise-sorted-matrix"
---

# Median of a Row Wise Sorted Matrix / Trung Vị Của Ma Trận Đã Sắp Xếp Theo Hàng

🟡 Medium | 🏷️ Array, Binary Search, Matrix

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Ma trận có m×n phần tử (luôn lẻ). Trung vị là phần tử thứ (m×n+1)/2. Binary search trên giá trị: với một giá trị `mid`, đếm bao nhiêu phần tử ≤ mid trong toàn ma trận. Vì mỗi hàng đã sắp xếp, dùng `upperBound` trên từng hàng — O(m log n) cho mỗi bước binary search.

```
Matrix:          Binary search val=4:
1  3  5          Row0: [1,3,5] → 2 elements ≤ 4
2  6  9   →      Row1: [2,6,9] → 1 element  ≤ 4
3  6  9          Row2: [3,6,9] → 1 element  ≤ 4
                 Total = 4 ≥ (3*3+1)/2=5? No → go right
```

## Problem Description

Given an `m x n` matrix `grid` where each row is sorted in **non-decreasing** order and `m * n` is **odd**, return the **median** of the matrix.

**Example 1:** `grid = [[1,1,2],[2,3,3],[1,3,4]]` → `2`

**Example 2:** `grid = [[1,3,5],[2,6,9],[3,6,9]]` → `5`

## 📝 Interview Tips

- 🔑 **Key insight / Chìa khóa:** Binary search on value range [min, max]; count elements ≤ mid using upperBound per row
- 🔑 **Count function / Hàm đếm:** For each row, `upperBound(row, mid)` = number of elements ≤ mid; sum across rows
- 🔑 **Target / Mục tiêu:** Median is the smallest value `x` where count(≤ x) ≥ (m\*n+1)/2
- ⚠️ **Integer median / Trung vị nguyên:** The answer must be an element in the matrix, so binary search on integers works
- ⚠️ **Off-by-one / Lệch 1:** Use `count >= required` (not >) so we find the leftmost valid value
- 🔗 **Pattern / Mẫu:** "Find kth element in sorted structure" → binary search on answer value

## Solutions

### Solution 1: Binary Search on Value

```typescript
/**
 * Binary search on the answer value. For each candidate, count elements <= candidate
 * across all sorted rows using binary search per row.
 * Time: O(m * log(n) * log(max-min))  Space: O(1)
 */
function matrixMedian(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const required = Math.floor((m * n + 1) / 2);

  let lo = grid[0][0];
  let hi = grid[0][n - 1];
  for (let i = 1; i < m; i++) {
    lo = Math.min(lo, grid[i][0]);
    hi = Math.max(hi, grid[i][n - 1]);
  }

  // Count elements <= val across all rows
  const countLE = (val: number): number => {
    let total = 0;
    for (const row of grid) {
      // Upper bound: first index where row[idx] > val
      let l = 0,
        r = n;
      while (l < r) {
        const mid = (l + r) >> 1;
        if (row[mid] <= val) l = mid + 1;
        else r = mid;
      }
      total += l; // l = count of elements <= val in this row
    }
    return total;
  };

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (countLE(mid) >= required) hi = mid;
    else lo = mid + 1;
  }

  return lo;
}

console.log(
  matrixMedian([
    [1, 1, 2],
    [2, 3, 3],
    [1, 3, 4],
  ]),
); // 2
console.log(
  matrixMedian([
    [1, 3, 5],
    [2, 6, 9],
    [3, 6, 9],
  ]),
); // 5
console.log(matrixMedian([[1]])); // 1
console.log(
  matrixMedian([
    [1, 2],
    [3, 4],
    [5, 6],
  ]),
); // n/a - even; odd only
```

### Solution 2: Flatten and Sort (Brute Force for Verification)

```typescript
/**
 * Flatten matrix, sort, pick middle element.
 * Time: O(m*n*log(m*n))  Space: O(m*n)
 * Use for verification only — doesn't meet the O(m log n log max) expectation.
 */
function matrixMedianBrute(grid: number[][]): number {
  const flat: number[] = [];
  for (const row of grid) for (const val of row) flat.push(val);
  flat.sort((a, b) => a - b);
  return flat[Math.floor(flat.length / 2)];
}

console.log(
  matrixMedianBrute([
    [1, 1, 2],
    [2, 3, 3],
    [1, 3, 4],
  ]),
); // 2
console.log(
  matrixMedianBrute([
    [1, 3, 5],
    [2, 6, 9],
    [3, 6, 9],
  ]),
); // 5
```

### Solution 3: Binary Search with Min-Heap Row Merge

```typescript
/**
 * Merge rows using min-heap, advance until reaching the median position.
 * Time: O(m*n/2 * log m)  Space: O(m)
 */
function matrixMedianHeap(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const target = Math.floor((m * n) / 2);

  // Min-heap: [value, row, col]
  type Entry = [number, number, number];
  const heap: Entry[] = [];

  const push = (entry: Entry) => {
    heap.push(entry);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent][0] > heap[i][0]) {
        [heap[parent], heap[i]] = [heap[i], heap[parent]];
        i = parent;
      } else break;
    }
  };

  const pop = (): Entry => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let smallest = i;
        const l = 2 * i + 1,
          r = 2 * i + 2;
        if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l;
        if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r;
        if (smallest === i) break;
        [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
        i = smallest;
      }
    }
    return top;
  };

  for (let r = 0; r < m; r++) push([grid[r][0], r, 0]);

  let count = 0;
  let val = 0;
  while (count <= target) {
    const [v, r, c] = pop();
    val = v;
    if (c + 1 < n) push([grid[r][c + 1], r, c + 1]);
    count++;
  }
  return val;
}

console.log(
  matrixMedianHeap([
    [1, 1, 2],
    [2, 3, 3],
    [1, 3, 4],
  ]),
); // 2
console.log(
  matrixMedianHeap([
    [1, 3, 5],
    [2, 6, 9],
    [3, 6, 9],
  ]),
); // 5
```

## 🔗 Related Problems

| Problem                                                                                                                                         | Difficulty | Pattern                |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------- |
| [Find K-th Smallest Pair Distance](https://leetcode.com/problems/find-k-th-smallest-pair-distance/)                                             | Hard       | Binary search on value |
| [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)                               | Medium     | Binary search or heap  |
| [Find the Kth Smallest Sum of a Matrix With Sorted Rows](https://leetcode.com/problems/find-the-kth-smallest-sum-of-a-matrix-with-sorted-rows/) | Hard       | Heap merge             |
| [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/)                                                       | Hard       | Binary search on rank  |
