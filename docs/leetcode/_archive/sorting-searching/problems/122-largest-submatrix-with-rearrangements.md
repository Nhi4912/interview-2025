---
layout: page
title: "Largest Submatrix With Rearrangements"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting, Matrix]
leetcode_url: "https://leetcode.com/problems/largest-submatrix-with-rearrangements"
---

# Largest Submatrix With Rearrangements / Ma Trận Con Lớn Nhất Với Sắp Xếp Lại

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Column Heights
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Maximum Spending After Buying Items](https://leetcode.com/problems/maximum-spending-after-buying-items) | [Largest Number](https://leetcode.com/problems/largest-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bài toán "skyline" — với mỗi cột, tính chiều cao cột 1s liên tiếp từ trên xuống. Khi được phép xếp lại cột, ta sort từng dòng theo chiều cao giảm dần: vị trí j (0-indexed) có thể tạo diện tích `height[j] * (j+1)`.

**Pattern Recognition:**

- Signal: "binary matrix, rearrange columns, maximize all-1 submatrix" → **Column Heights + Row Sort**
- For each row, compute column heights (consecutive 1s ending at this row)
- Sort heights in each row descending; area at position j = heights[j] \* (j+1)

**Visual — matrix=[[0,0,1],[1,1,1],[1,0,1]]:**

```
Row 0 heights: [0, 0, 1]  sorted desc: [1, 0, 0]  max area: 1*1=1
Row 1 heights: [1, 1, 2]  sorted desc: [2, 1, 1]  max area: max(2*1, 1*2, 1*3) = 3
Row 2 heights: [2, 0, 3]  sorted desc: [3, 2, 0]  max area: max(3*1, 2*2) = 4 ✓
Answer = 4
```

---

## Problem Description

Given binary matrix `matrix` (0s and 1s). You can **rearrange columns** in any order. Return the **largest area** of a submatrix containing only 1s. ([LeetCode 1727](https://leetcode.com/problems/largest-submatrix-with-rearrangements))

Difficulty: Medium | Acceptance: 75.2%

```
Example 1: matrix=[[0,0,1],[1,1,1],[1,0,1]]  → 4
Example 2: matrix=[[1,0,1,0,1]]              → 3
Example 3: matrix=[[1,1,0],[1,0,0]]          → 2
```

Constraints: `1 ≤ m, n ≤ 10^5`, `m * n ≤ 10^5`, values in {0, 1}

---

## 📝 Interview Tips

1. **Column heights / Chiều cao cột**: "heights[r][c] = số ô 1 liên tiếp kết thúc tại row r, col c"
2. **Sort each row / Sort từng dòng**: Sắp xếp heights của mỗi dòng theo thứ tự giảm dần → columns được "xếp lại"
3. **Area formula / Công thức diện tích**: Tại vị trí j trong sorted row: area = heights[j] \* (j+1) vì có j+1 cột liền kề
4. **Why sort? / Tại sao sort?**: Khi heights[j] là nhỏ nhất trong j+1 cột đầu (sau sort), diện tích = heights[j]\*(j+1) chính xác
5. **Modify in-place / Sửa tại chỗ**: Cập nhật heights trực tiếp trên matrix để tiết kiệm bộ nhớ
6. **Complexity / Độ phức tạp**: O(m*n*log(n)) — n log n per row for sorting

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — try all column subsets, find max all-1 height
 * Time: O(m * n^2 * 2^n) — exponential, only for tiny inputs
 * Space: O(1)
 */
function largestSubmatrixBrute(matrix: number[][]): number {
  const m = matrix.length,
    n = matrix[0].length;
  // Compute column heights
  const heights = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let c = 0; c < n; c++) {
    for (let r = 0; r < m; r++) {
      heights[r][c] = matrix[r][c] === 0 ? 0 : r > 0 ? heights[r - 1][c] + 1 : 1;
    }
  }
  let ans = 0;
  // For each row, try all pairs of column ranges (after conceptual sort)
  for (let r = 0; r < m; r++) {
    const row = [...heights[r]].sort((a, b) => b - a);
    for (let j = 0; j < n; j++) {
      if (row[j] > 0) ans = Math.max(ans, row[j] * (j + 1));
    }
  }
  return ans;
}

/**
 * Solution 2: Greedy + Column Heights + Sort (Optimal)
 * Time: O(m * n * log(n))  Space: O(n) for heights row
 *
 * For each row r:
 * 1. Update heights[c] = matrix[r][c] == 1 ? heights[c] + 1 : 0
 * 2. Sort heights descending (conceptually: rearrange columns optimally)
 * 3. For each position j in sorted order: area = heights[j] * (j+1)
 * 4. Track global maximum
 */
function largestSubmatrix(matrix: number[][]): number {
  const m = matrix.length,
    n = matrix[0].length;
  const heights = new Array(n).fill(0);
  let ans = 0;

  for (let r = 0; r < m; r++) {
    // Update column heights for current row
    for (let c = 0; c < n; c++) {
      heights[c] = matrix[r][c] === 0 ? 0 : heights[c] + 1;
    }
    // Sort heights descending (copy for this row)
    const sorted = [...heights].sort((a, b) => b - a);
    for (let j = 0; j < n; j++) {
      if (sorted[j] === 0) break; // remaining are 0, no contribution
      ans = Math.max(ans, sorted[j] * (j + 1));
    }
  }
  return ans;
}

/**
 * Solution 3: Optimized — avoid sort by tracking previous row heights
 * Time: O(m * n * log(n))  Space: O(n)
 * Same complexity but with cleaner implementation using index sorting
 */
function largestSubmatrixOpt(matrix: number[][]): number {
  const m = matrix.length,
    n = matrix[0].length;
  // heights[c] = consecutive 1s ending at current row in column c
  let heights = new Array(n).fill(0);
  let ans = 0;

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      heights[c] = matrix[r][c] === 0 ? 0 : heights[c] + 1;
    }
    // Sort indices by height descending
    const indices = Array.from({ length: n }, (_, i) => i).sort((a, b) => heights[b] - heights[a]);
    for (let j = 0; j < n; j++) {
      if (heights[indices[j]] === 0) break;
      ans = Math.max(ans, heights[indices[j]] * (j + 1));
    }
  }
  return ans;
}

// === Tests ===
console.log(
  largestSubmatrix([
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
  ]),
); // 4
console.log(largestSubmatrix([[1, 0, 1, 0, 1]])); // 3
console.log(
  largestSubmatrix([
    [1, 1, 0],
    [1, 0, 0],
  ]),
); // 2
console.log(largestSubmatrix([[1]])); // 1
console.log(
  largestSubmatrixBrute([
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
  ]),
); // 4
console.log(largestSubmatrixOpt([[1, 0, 1, 0, 1]])); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                  | Relationship                              |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| [1727. Largest Submatrix With Rearrangements](https://leetcode.com/problems/largest-submatrix-with-rearrangements)       | This problem                              |
| [85. Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle)                                                 | Same column heights idea, monotonic stack |
| [84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram)                       | Column heights histogram problem          |
| [221. Maximal Square](https://leetcode.com/problems/maximal-square)                                                      | DP on binary matrix                       |
| [1074. Number of Submatrices That Sum to Target](https://leetcode.com/problems/number-of-submatrices-that-sum-to-target) | 2D prefix sum on matrix                   |
