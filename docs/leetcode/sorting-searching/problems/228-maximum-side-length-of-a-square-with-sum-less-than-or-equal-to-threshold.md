---
layout: page
title: "Maximum Side Length of a Square with Sum Less than or Equal to Threshold"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Matrix, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold"
---

# Maximum Side Length of a Square ≤ Threshold / Cạnh Hình Vuông Tối Đa Với Tổng ≤ Ngưỡng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Max Sum of Rectangle No Larger Than K](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k) | [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đặt một tấm kính hình vuông lên bản đồ nhiệt và hỏi "tấm kính lớn nhất bao nhiêu để tổng nhiệt độ vẫn trong ngưỡng?" — dùng prefix sum 2D để tính tổng bất kỳ hình vuông trong O(1).

**Pattern Recognition:**

- Signal: "2D matrix" + "sum of submatrix" + "threshold" → 2D prefix sum + binary search on side length
- Key insight: prefix[r][c] = sum of mat[0..r-1][0..c-1]; square sum = O(1) lookup

**Visual — Maximum Side Length:**

```
mat = [[1,1,3,2,4,3,2],
       [1,1,3,2,4,3,2],
       [1,1,3,2,4,3,2]]
threshold = 4

2D Prefix Sum:
  prefix[i][j] = sum of top-left rectangle ending at (i-1, j-1)

Square of side k at (r, c):
  sum = prefix[r+k][c+k] - prefix[r][c+k] - prefix[r+k][c] + prefix[r][c]

Binary search on k:
  k=1: find any 1x1 with val ≤ 4? Yes (1,1) → valid
  k=2: find any 2x2 with sum ≤ 4? (0,0): 1+1+1+1=4 ✓ → valid
  k=3: any 3x3 ≤ 4? Min 3x3 = 9*1=9 > 4 → invalid
Answer = 2
```

---

## Problem Description

Given an `m x n` matrix `mat` and an integer `threshold`, return the **maximum side length** of a square submatrix with a sum ≤ `threshold`, or 0 if no such square exists.

Difficulty: Medium | Acceptance: 53.5%

```
Example 1:
  Input:  mat = [[1,1,3,2,4,3,2],[1,1,3,2,4,3,2],[1,1,3,2,4,3,2]], threshold = 4
  Output: 2

Example 2:
  Input:  mat = [[2,2,2,2,2]], threshold = 1
  Output: 0
```

Constraints:

- `m == mat.length`
- `n == mat[i].length`
- `1 <= m, n <= 300`
- `0 <= mat[i][j] <= 10^4`
- `0 <= threshold <= 10^5`

---

## 📝 Interview Tips

1. **Clarify**: "Submatrix phải là hình vuông (m=n) hay hình chữ nhật bất kỳ?" / Confirm it's a square, not a rectangle.
2. **2D Prefix Sum**: "prefix[i][j] = tổng hình chữ nhật từ (0,0) đến (i-1,j-1)" / Build 2D prefix sum for O(1) area queries.
3. **Square sum formula**: "`sum = prefix[r+k][c+k] - prefix[r][c+k] - prefix[r+k][c] + prefix[r][c]`" / Inclusion-exclusion for rectangle.
4. **Binary search**: "Kết hợp binary search trên k và check từng vị trí top-left" / Binary search on side length k (monotone: if k works, k-1 also works).
5. **Edge cases**: "threshold=0 chỉ valid nếu có ô bằng 0; n=1 hình vuông tối đa là 1" / threshold=0 needs cell=0.
6. **Follow-up**: "Hình chữ nhật thay vì hình vuông? Thêm vòng lặp chiều rộng" / For rectangle: iterate over both dimensions.

---

## Solutions

```typescript
/**
 * Build 2D prefix sum
 * prefix[i][j] = sum of mat[0..i-1][0..j-1]
 */
function build2DPrefix(mat: number[][]): number[][] {
  const m = mat.length,
    n = mat[0].length;
  const p = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      p[i][j] = mat[i - 1][j - 1] + p[i - 1][j] + p[i][j - 1] - p[i - 1][j - 1];
    }
  }
  return p;
}

function squareSum(p: number[][], r: number, c: number, k: number): number {
  return p[r + k][c + k] - p[r][c + k] - p[r + k][c] + p[r][c];
}

/**
 * Solution 1: 2D Prefix Sum + Binary Search
 * Time: O(m*n*log(min(m,n))) — for each binary search step, scan all top-left corners
 * Space: O(m*n) — prefix sum matrix
 */
function maxSideLength(mat: number[][], threshold: number): number {
  const m = mat.length,
    n = mat[0].length;
  const p = build2DPrefix(mat);

  const canFit = (k: number): boolean => {
    for (let r = 0; r + k <= m; r++) {
      for (let c = 0; c + k <= n; c++) {
        if (squareSum(p, r, c, k) <= threshold) return true;
      }
    }
    return false;
  };

  let lo = 1,
    hi = Math.min(m, n),
    ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (canFit(mid)) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
}

/**
 * Solution 2: 2D Prefix Sum + Linear Scan (no binary search)
 * Time: O(m*n*min(m,n)) — for each cell, try increasing side lengths
 * Space: O(m*n)
 */
function maxSideLengthLinear(mat: number[][], threshold: number): number {
  const m = mat.length,
    n = mat[0].length;
  const p = build2DPrefix(mat);
  let ans = 0;

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      // Try to extend side from current best answer
      const k = ans + 1;
      if (r + k <= m && c + k <= n && squareSum(p, r, c, k) <= threshold) {
        ans++;
      }
    }
  }
  return ans;
}

// === Test Cases ===
console.log(
  maxSideLength(
    [
      [1, 1, 3, 2, 4, 3, 2],
      [1, 1, 3, 2, 4, 3, 2],
      [1, 1, 3, 2, 4, 3, 2],
    ],
    4,
  ),
); // 2
console.log(maxSideLength([[2, 2, 2, 2, 2]], 1)); // 0
console.log(
  maxSideLength(
    [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
    100,
  ),
); // 3
console.log(
  maxSideLengthLinear(
    [
      [1, 1, 3, 2, 4, 3, 2],
      [1, 1, 3, 2, 4, 3, 2],
      [1, 1, 3, 2, 4, 3, 2],
    ],
    4,
  ),
); // 2
```

---

## 🔗 Related Problems

- [Max Sum of Rectangle No Larger Than K](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k) — 2D prefix sum + sorted set
- [Range Sum Query 2D](https://leetcode.com/problems/range-sum-query-2d-immutable) — 2D prefix sum fundamentals
- [Count Submatrices With All Ones](https://leetcode.com/problems/count-submatrices-with-all-ones) — matrix DP
- [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix) — binary search on matrix
- [Maximum Side Length of a Square — LeetCode](https://leetcode.com/problems/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold) — problem page
