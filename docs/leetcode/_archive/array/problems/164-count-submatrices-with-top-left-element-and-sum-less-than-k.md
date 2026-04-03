---
layout: page
title: "Count Submatrices with Top-Left Element and Sum Less Than k"
difficulty: Medium
category: Array
tags: [Array, Matrix, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/count-submatrices-with-top-left-element-and-sum-less-than-k"
---

# Count Submatrices with Top-Left Element and Sum Less Than k / Đếm Ma Trận Con Có Tổng Nhỏ Hơn k

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Tiếng Việt:** Vì tất cả ma trận con đều phải chứa phần tử góc trên trái (0,0), chỉ cần xây dựng prefix sum 2D. Mỗi ô (i,j) trong prefix sum là tổng của hình chữ nhật từ (0,0) đến (i,j). Đếm số ô có prefix[i][j] < k.

**English:** Since all valid submatrices must include (0,0), build a 2D prefix sum. Each cell prefix[i][j] = sum from (0,0) to (i,j). Count cells where this sum < k.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Count Submatrices with Top-Left Element and Sum Less Than k example:**

```
grid = [[2,1,3],[4,6,2],[7,2,9]]  k=9

prefix:
  [2, 3, 6]
  [6,13,18]
  [13,22,33]

Cells < 9: (0,0)=2✓ (0,1)=3✓ (0,2)=6✓ (1,0)=6✓
Count = 4
```

---

## Problem Description

| Problem                                                                                                                                                 | Difficulty | Pattern       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable/)                                                           | 🟡 Medium  | 2D Prefix Sum |
| [Max Side Length of a Square with Sum ≤ Threshold](https://leetcode.com/problems/max-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold/) | 🟡 Medium  | 2D Prefix Sum |
| [Number of Submatrices That Sum to Target](https://leetcode.com/problems/number-of-submatrices-that-sum-to-target/)                                     | 🔴 Hard    | Prefix Sum    |

---

## 📝 Interview Tips

- 🔑 **EN:** All valid submatrices anchor at (0,0) — key constraint | **VI:** Mọi ma trận con hợp lệ đều bắt đầu từ (0,0) — ràng buộc quan trọng
- 🔑 **EN:** 2D prefix sum formula: P[i][j] = grid[i][j] + P[i-1][j] + P[i][j-1] - P[i-1][j-1] | **VI:** Công thức prefix 2D: tổng hiện tại + hai cạnh - góc chéo
- 🔑 **EN:** Can compute prefix in-place on the grid itself | **VI:** Có thể tính prefix trực tiếp trên grid mà không cần mảng mới
- 🔑 **EN:** Check boundary conditions for i=0 and j=0 rows/cols | **VI:** Kiểm tra điều kiện biên cho hàng i=0 và cột j=0
- 🔑 **EN:** O(m*n) time — single pass to build prefix and count | **VI:** O(m*n) thời gian — một lần duyệt để xây dựng và đếm
- 🔑 **EN:** Can modify grid in-place saving O(m\*n) space | **VI:** Có thể sửa grid tại chỗ để tiết kiệm không gian

---

## Solutions

```typescript
/**
 * Count submatrices containing top-left element with sum < k
 * Time: O(m*n) — single pass builds prefix + counts
 * Space: O(m*n) — prefix sum matrix
 */
function countSubmatrices(grid: number[][], k: number): number {
  const m = grid.length;
  const n = grid[0].length;
  const prefix: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  let count = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      prefix[i][j] =
        grid[i][j] +
        (i > 0 ? prefix[i - 1][j] : 0) +
        (j > 0 ? prefix[i][j - 1] : 0) -
        (i > 0 && j > 0 ? prefix[i - 1][j - 1] : 0);
      if (prefix[i][j] < k) count++;
    }
  }

  return count;
}

console.log(
  countSubmatrices(
    [
      [2, 1, 3],
      [4, 6, 2],
      [7, 2, 9],
    ],
    9,
  ),
); // 4
console.log(
  countSubmatrices(
    [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    5,
  ),
); // 6
console.log(countSubmatrices([[1]], 1)); // 0

/**
 * Modify grid in-place to avoid extra matrix
 * Time: O(m*n) | Space: O(1) extra (modifies input)
 */
function countSubmatricesInPlace(grid: number[][], k: number): number {
  const m = grid.length;
  const n = grid[0].length;
  let count = 0;

  // Build row prefix sums
  for (let i = 0; i < m; i++) {
    for (let j = 1; j < n; j++) {
      grid[i][j] += grid[i][j - 1];
    }
  }

  // Accumulate column-wise and count
  for (let j = 0; j < n; j++) {
    for (let i = 1; i < m; i++) {
      grid[i][j] += grid[i - 1][j];
    }
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] < k) count++;
    }
  }

  return count;
}

console.log(
  countSubmatricesInPlace(
    [
      [2, 1, 3],
      [4, 6, 2],
      [7, 2, 9],
    ],
    9,
  ),
); // 4

/**
 * Compute prefix row-by-row, count inline
 * Time: O(m*n) | Space: O(n) — single row buffer
 */
function countSubmatricesCombined(grid: number[][], k: number): number {
  const m = grid.length;
  const n = grid[0].length;
  const rowSum = new Array<number>(n).fill(0);
  let count = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      rowSum[j] += grid[i][j];
    }
    let colPrefix = 0;
    for (let j = 0; j < n; j++) {
      colPrefix += rowSum[j];
      if (colPrefix < k) count++;
    }
  }

  return count;
}

console.log(
  countSubmatricesCombined(
    [
      [2, 1, 3],
      [4, 6, 2],
      [7, 2, 9],
    ],
    9,
  ),
); // 4
```

---

## 🔗 Related Problems

| Problem                                                                                                                                                 | Difficulty | Pattern       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable/)                                                           | 🟡 Medium  | 2D Prefix Sum |
| [Max Side Length of a Square with Sum ≤ Threshold](https://leetcode.com/problems/max-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold/) | 🟡 Medium  | 2D Prefix Sum |
| [Number of Submatrices That Sum to Target](https://leetcode.com/problems/number-of-submatrices-that-sum-to-target/)                                     | 🔴 Hard    | Prefix Sum    |
