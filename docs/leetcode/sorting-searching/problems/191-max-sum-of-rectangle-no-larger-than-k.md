---
layout: page
title: "Max Sum of Rectangle No Larger Than K"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Matrix, Prefix Sum, Ordered Set]
leetcode_url: "https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k"
---

# Max Sum of Rectangle No Larger Than K / Tổng Lớn Nhất Hình Chữ Nhật Không Vượt K

🔴 Hard | 🏷️ Array, Binary Search, Matrix, Prefix Sum, Ordered Set

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Cần tìm hình chữ nhật trong ma trận có tổng lớn nhất nhưng ≤ k. Ý tưởng: cố định cột trái và cột phải, cộng dồn từng hàng vào mảng 1D. Bài toán rút về: tìm subarray 1D có tổng ≤ k lớn nhất. Dùng prefix sum + sorted set để tìm trong O(n log n).

```
Matrix:      Fix col1=0, col2=1 → row sums:
1  0          [1+0, 0+2, 5+(-1)] = [1, 2, 4]
0  2    →     Prefix: [0,1,3,7]
5 -1          Want max prefix[j]-prefix[i] ≤ k=2
              For prefix[j]=3: find smallest prefix[i] ≥ 3-2=1 → prefix[i]=1
              Sum = 3-1 = 2 ✓
```

## Problem Description

Given an `m x n` matrix `matrix` and an integer `k`, return the **max sum** of a rectangle in the matrix such that its sum is **no larger than** `k`.

**Example 1:** `matrix = [[1,0,1],[0,-2,3]], k = 2` → `2`

**Example 2:** `matrix = [[2,2],[-1,-2]], k = 3` → `3`

## 📝 Interview Tips

- 🔑 **Column compression / Nén cột:** Fix left/right column pair; compress rows into 1D; solve 1D subarray problem
- 🔑 **1D problem / Bài 1D:** For prefix sums p[], find max p[j]-p[i] ≤ k → for each j, find smallest p[i] ≥ p[j]-k in sorted set
- 🔑 **Sorted set via sorted array / Tập đã sắp:** JS lacks TreeSet; use sorted array + binary search insert/search
- ⚠️ **Iterate shorter dimension / Chiều ngắn:** Fix pairs along shorter dimension to minimize O(min(m,n)^2 × max(m,n) log max)
- ⚠️ **Empty set init / Khởi tạo:** Always insert 0 into sorted set before processing (empty subarray base case)
- 🔗 **Pattern / Mẫu:** 2D → 1D reduction + ordered set is a classic hard matrix pattern

## Solutions

### Solution 1: Column Pairs + Sorted Prefix Sum

```typescript
/**
 * Fix column boundaries, reduce to 1D max subarray sum <= k using sorted prefix sums.
 * Time: O(min(m,n)^2 * max(m,n) * log(max(m,n)))  Space: O(max(m,n))
 */
function maxSumSubmatrix(matrix: number[][], k: number): number {
  const m = matrix.length,
    n = matrix[0].length;
  let result = -Infinity;

  // Iterate column pairs (fix left and right column)
  for (let left = 0; left < n; left++) {
    const rowSums = new Array(m).fill(0);

    for (let right = left; right < n; right++) {
      // Add column `right` to row sums
      for (let r = 0; r < m; r++) rowSums[r] += matrix[r][right];

      // Find max subarray sum <= k in rowSums using sorted set
      // sorted set stores prefix sums seen so far
      const sortedPrefixes: number[] = [0];
      let prefixSum = 0;

      for (const s of rowSums) {
        prefixSum += s;
        // Find smallest prefix >= prefixSum - k  (binary search)
        const target = prefixSum - k;
        let lo = 0,
          hi = sortedPrefixes.length;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (sortedPrefixes[mid] < target) lo = mid + 1;
          else hi = mid;
        }
        if (lo < sortedPrefixes.length) {
          result = Math.max(result, prefixSum - sortedPrefixes[lo]);
        }

        // Insert prefixSum into sorted position
        let ins = 0,
          inHi = sortedPrefixes.length;
        while (ins < inHi) {
          const mid = (ins + inHi) >> 1;
          if (sortedPrefixes[mid] < prefixSum) ins = mid + 1;
          else inHi = mid;
        }
        sortedPrefixes.splice(ins, 0, prefixSum);
      }
    }
  }

  return result;
}

console.log(
  maxSumSubmatrix(
    [
      [1, 0, 1],
      [0, -2, 3],
    ],
    2,
  ),
); // 2
console.log(
  maxSumSubmatrix(
    [
      [2, 2],
      [-1, -2],
    ],
    3,
  ),
); // 3
console.log(maxSumSubmatrix([[1]], 1)); // 1
console.log(
  maxSumSubmatrix(
    [
      [5, -4, -3, 4],
      [-3, -4, 4, 5],
      [5, 1, 5, -4],
    ],
    8,
  ),
); // 8
```

### Solution 2: Brute Force (O(m^2 n^2)) for Small Inputs

```typescript
/**
 * Enumerate all rectangles using 2D prefix sums.
 * Time: O(m^2 * n^2)  Space: O(m*n)
 * Use for verification; not optimal.
 */
function maxSumSubmatrixBrute(matrix: number[][], k: number): number {
  const m = matrix.length,
    n = matrix[0].length;

  // Build 2D prefix sums
  const ps: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      ps[i][j] = matrix[i - 1][j - 1] + ps[i - 1][j] + ps[i][j - 1] - ps[i - 1][j - 1];

  let result = -Infinity;
  for (let r1 = 1; r1 <= m; r1++)
    for (let r2 = r1; r2 <= m; r2++)
      for (let c1 = 1; c1 <= n; c1++)
        for (let c2 = c1; c2 <= n; c2++) {
          const s = ps[r2][c2] - ps[r1 - 1][c2] - ps[r2][c1 - 1] + ps[r1 - 1][c1 - 1];
          if (s <= k) result = Math.max(result, s);
        }

  return result;
}

console.log(
  maxSumSubmatrixBrute(
    [
      [1, 0, 1],
      [0, -2, 3],
    ],
    2,
  ),
); // 2
console.log(
  maxSumSubmatrixBrute(
    [
      [2, 2],
      [-1, -2],
    ],
    3,
  ),
); // 3
```

## 🔗 Related Problems

| Problem                                                                                       | Difficulty | Pattern                        |
| --------------------------------------------------------------------------------------------- | ---------- | ------------------------------ |
| [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)                           | Medium     | Kadane's algorithm             |
| [Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable/) | Medium     | 2D prefix sum                  |
| [Find Pivot Index](https://leetcode.com/problems/find-pivot-index/)                           | Easy       | Prefix sum                     |
| [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)         | Medium     | Sliding window / binary search |
