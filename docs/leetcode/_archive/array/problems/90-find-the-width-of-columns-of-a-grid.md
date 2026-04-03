---
layout: page
title: "Find the Width of Columns of a Grid"
difficulty: Easy
category: Array
tags: [Array, Matrix]
leetcode_url: "https://leetcode.com/problems/find-the-width-of-columns-of-a-grid"
---

# Find the Width of Columns of a Grid / Tìm Độ Rộng Các Cột Của Lưới

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Matrix / Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Transpose Matrix](https://leetcode.com/problems/transpose-matrix) | [Spiral Matrix](https://leetcode.com/problems/spiral-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống kẻ bảng Excel — mỗi cột phải đủ rộng để chứa số dài nhất. Độ rộng của số = số ký tự khi in ra (kể cả dấu `-` cho số âm).

```
grid = [[−15, 1, 3],[15, 7, 12],[5, 6,−2]]

Col 0: -15, 15, 5  → string widths: 3, 2, 1 → max = 3
Col 1:   1,  7, 6  → string widths: 1, 1, 1 → max = 1
Col 2:   3, 12,-2  → string widths: 1, 2, 2 → max = 2
Result: [3, 1, 2]
```

---

## Problem Description

Given an `m x n` integer matrix `grid`, return an array of size `n` where `ans[j]` is the **width** of column `j` — defined as the maximum number of characters needed to represent any integer in that column (including the `-` sign for negatives).

- Example 1: `grid = [[-15,1,3],[15,7,12],[5,6,-2]]` → `[3,1,2]`
- Example 2: `grid = [[-1],[2],[−299]]` → `[4]`

Constraints: `1 <= m, n <= 100`, `-10^9 <= grid[i][j] <= 10^9`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Độ rộng tính cả dấu trừ của số âm?" / Confirm that negative sign counts as 1 character.
2. **String conversion / Chuyển chuỗi**: "Dùng `String(n).length` hoặc `Math.abs(n).toString().length + (n<0?1:0)`" / `String(n).length` handles negatives automatically in JS.
3. **Column-first / Duyệt theo cột**: "Với mỗi cột j, duyệt qua tất cả hàng để tìm max width" / Transpose the iteration: outer loop is columns.
4. **Edge case / Trường hợp đặc biệt**: "`grid[i][j] = 0` → width = 1; âm với nhiều chữ số" / Zero is width 1; confirm negative handling.
5. **Complexity / Độ phức tạp**: "O(m×n) time — duyệt mỗi ô đúng một lần" / Each cell visited once.
6. **Alternative / Cách khác**: "Có thể transpose grid trước rồi map mỗi row — cùng độ phức tạp" / Transposing then mapping per column is equivalent.

---

## Solutions

```typescript
/**
 * Solution 1: Column-major scan
 * Time: O(m × n) — visit each cell once
 * Space: O(1) — output array only
 */
function findColumnWidth(grid: number[][]): number[] {
  const m = grid.length;
  const n = grid[0].length;
  const result: number[] = new Array(n).fill(0);

  for (let col = 0; col < n; col++) {
    for (let row = 0; row < m; row++) {
      const width = String(grid[row][col]).length;
      result[col] = Math.max(result[col], width);
    }
  }

  return result;
}

/**
 * Solution 2: Row-major scan (cache-friendly for row-major storage)
 * Time: O(m × n) — same complexity
 * Space: O(1) — output array only
 */
function findColumnWidthRowMajor(grid: number[][]): number[] {
  const n = grid[0].length;
  const result: number[] = new Array(n).fill(0);

  for (const row of grid) {
    for (let col = 0; col < n; col++) {
      result[col] = Math.max(result[col], String(row[col]).length);
    }
  }

  return result;
}

/**
 * Solution 3: Functional style with transpose
 * Time: O(m × n) — map over transposed columns
 * Space: O(m × n) — transposed array
 */
function findColumnWidthFunctional(grid: number[][]): number[] {
  const m = grid.length;
  const n = grid[0].length;
  return Array.from({ length: n }, (_, col) =>
    Math.max(...Array.from({ length: m }, (__, row) => String(grid[row][col]).length)),
  );
}

// === Test Cases ===
console.log(
  findColumnWidth([
    [-15, 1, 3],
    [15, 7, 12],
    [5, 6, -2],
  ]),
); // [3,1,2]
console.log(findColumnWidth([[-1], [2], [-299]])); // [4]
console.log(findColumnWidthRowMajor([[0], [1000000000]])); // [10]
```

---

## 🔗 Related Problems

| Problem                                                                                                              | Pattern                 | Difficulty |
| -------------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------- |
| [Transpose Matrix](https://leetcode.com/problems/transpose-matrix)                                                   | Matrix column traversal | 🟢 Easy    |
| [Reshape the Matrix](https://leetcode.com/problems/reshape-the-matrix)                                               | Matrix reshaping        | 🟢 Easy    |
| [Spiral Matrix](https://leetcode.com/problems/spiral-matrix)                                                         | Matrix traversal        | 🟡 Medium  |
| [Count Negative Numbers in a Sorted Matrix](https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix) | Matrix scan             | 🟢 Easy    |
