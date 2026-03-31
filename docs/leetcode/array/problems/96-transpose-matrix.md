---
layout: page
title: "Transpose Matrix"
difficulty: Easy
category: Array
tags: [Array, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/transpose-matrix"
---

# Transpose Matrix / Chuyển Vị Ma Trận

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Matrix / Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) | [Rotate Image](https://leetcode.com/problems/rotate-image)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống lật bảng điểm — hàng thành cột, cột thành hàng. Học sinh (hàng) trở thành môn học (cột) và ngược lại. Phần tử ở vị trí `[i][j]` chuyển sang `[j][i]`.

**Visual:**

```
Original (3×2):      Transposed (2×3):
 1  2  3              1  4
 4  5  6    →→→       2  5
                      3  6

result[j][i] = matrix[i][j]
Dimensions: (m×n) → (n×m)
```

---

## Problem Description

Given a 2D integer array `matrix`, return the **transpose** of `matrix`. The transpose of a matrix is obtained by flipping it over its main diagonal: element at `matrix[i][j]` goes to position `[j][i]`.

- Example 1: `matrix=[[1,2,3],[4,5,6],[7,8,9]]` → `[[1,4,7],[2,5,8],[3,6,9]]`
- Example 2: `matrix=[[1,2,3],[4,5,6]]` → `[[1,4],[2,5],[3,6]]`

**Constraints:** `m == matrix.length`, `n == matrix[i].length`, `1 <= m, n <= 1000`, `1 <= m * n <= 10^5`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Ma trận có vuông (n×n) hay chữ nhật (m×n)?" / Must handle non-square matrices (m×n → n×m).
2. **Index swap**: "result[j][i] = matrix[i][j] — đổi chỗ hai index" / Simple index swap is the core insight.
3. **Dimensions**: "Kết quả có kích thước n×m, không phải m×n" / Output dimensions are flipped.
4. **In-place for square**: "Ma trận vuông có thể transpose tại chỗ: swap upper/lower triangle" / Square matrix can be done in-place.
5. **Edge case**: "Ma trận 1×n → kết quả n×1" / A single row becomes a single column.
6. **Complexity**: "O(m\*n) time and space — mỗi phần tử copy một lần" / Each element copied exactly once.

---

## Solutions

```typescript
/**
 * Solution 1: New Matrix Construction
 * Time: O(m * n) — visit every element once
 * Space: O(m * n) — new result matrix
 */
function transposeMatrixNew(matrix: number[][]): number[][] {
  const m = matrix.length;
  const n = matrix[0].length;
  // Result is n×m (dimensions flipped)
  const result: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  return result;
}

console.log(
  transposeMatrixNew([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
); // [[1,4,7],[2,5,8],[3,6,9]]
console.log(
  transposeMatrixNew([
    [1, 2, 3],
    [4, 5, 6],
  ]),
); // [[1,4],[2,5],[3,6]]

/**
 * Solution 2: Functional Map Style
 * Time: O(m * n)
 * Space: O(m * n)
 *
 * Build each row of result by picking column j from each row of original.
 */
function transpose(matrix: number[][]): number[][] {
  const m = matrix.length;
  const n = matrix[0].length;

  // For each column j in original, build a new row by collecting matrix[i][j]
  return Array.from({ length: n }, (_, j) => Array.from({ length: m }, (_, i) => matrix[i][j]));
}

console.log(
  transpose([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
); // [[1,4,7],[2,5,8],[3,6,9]]
console.log(
  transpose([
    [1, 2, 3],
    [4, 5, 6],
  ]),
); // [[1,4],[2,5],[3,6]]
console.log(transpose([[7]])); // [[7]]

/**
 * Bonus: In-Place Transpose for Square Matrix
 * Time: O(n²), Space: O(1)
 */
function transposeSquareInPlace(matrix: number[][]): void {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
}
```

---

## 🔗 Related Problems

| Problem                                                            | Pattern           | Difficulty |
| ------------------------------------------------------------------ | ----------------- | ---------- |
| [Rotate Image](https://leetcode.com/problems/rotate-image)         | Matrix + In-Place | Medium     |
| [Spiral Matrix](https://leetcode.com/problems/spiral-matrix)       | Matrix Traversal  | Medium     |
| [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii) | Matrix Simulation | Medium     |
| [Game of Life](https://leetcode.com/problems/game-of-life)         | Matrix Simulation | Medium     |
