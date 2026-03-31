---
layout: page
title: "Check if Every Row and Column Contains All Numbers"
difficulty: Easy
category: Array
tags: [Array, Hash Table, Matrix]
leetcode_url: "https://leetcode.com/problems/check-if-every-row-and-column-contains-all-numbers"
---

# Check if Every Row and Column Contains All Numbers / Kiểm Tra Mỗi Hàng và Cột Chứa Đủ Số

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Valid Sudoku](https://leetcode.com/problems/valid-sudoku) | [Find Winner on a Tic Tac Toe Game](https://leetcode.com/problems/find-winner-on-a-tic-tac-toe-game)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống kiểm tra bảng Sudoku đơn giản — mỗi hàng và mỗi cột phải chứa đủ các số từ 1 đến n, không trùng lặp. Dùng Set để phát hiện trùng lặp trong O(1).

```
n=3, matrix:
  1 2 3     Row 0: {1,2,3} ✅
  3 1 2  →  Row 1: {3,1,2} ✅
  2 3 1     Row 2: {2,3,1} ✅
            Col 0: {1,3,2} ✅  Col 1: {2,1,3} ✅  Col 2: {3,2,1} ✅
```

---

## Problem Description

An `n x n` matrix is **valid** if every row and every column contains all integers from `1` to `n` (inclusive). Given an `n x n` integer matrix `matrix`, return `true` if the matrix is valid, otherwise `false`.

- Example 1: `matrix = [[1,2,3],[3,1,2],[2,3,1]]` → `true`
- Example 2: `matrix = [[1,1,1],[1,2,3],[1,2,3]]` → `false`

Constraints: `n == matrix.length == matrix[i].length`, `1 <= n <= 100`, `1 <= matrix[i][j] <= n`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Ma trận luôn là n×n không? Giá trị trong [1..n] không?" / Confirm square matrix and value range.
2. **Approach / Hướng tiếp cận**: "Dùng Set cho mỗi hàng và cột — nếu size < n thì có trùng lặp" / A Set smaller than n means duplicates exist.
3. **Alternative / Cách khác**: "Cũng có thể sort mỗi hàng/cột rồi so sánh với [1..n]" / Sorting works but O(n²logn) vs O(n²).
4. **Edge case / Trường hợp đặc biệt**: "n=1: ma trận [[1]] luôn valid" / 1×1 matrix with value 1 is always valid.
5. **Complexity / Độ phức tạp**: "O(n²) time, O(n) space cho Set mỗi lần kiểm tra" / Two nested sweeps for rows then columns.
6. **Optimize / Tối ưu**: "Có thể kiểm tra hàng và cột song song trong một vòng lặp" / Check row i and col i simultaneously to halve iterations.

---

## Solutions

```typescript
/**
 * Solution 1: Two-Pass with Sets (rows then columns)
 * Time: O(n²) — check all rows then all columns
 * Space: O(n) — Set holds at most n elements at a time
 */
function checkValid(matrix: number[][]): boolean {
  const n = matrix.length;

  // Check each row
  for (let r = 0; r < n; r++) {
    const seen = new Set(matrix[r]);
    if (seen.size !== n) return false;
  }

  // Check each column
  for (let c = 0; c < n; c++) {
    const seen = new Set<number>();
    for (let r = 0; r < n; r++) seen.add(matrix[r][c]);
    if (seen.size !== n) return false;
  }

  return true;
}

/**
 * Solution 2: Single-Pass — check row[i] and col[i] together
 * Time: O(n²) — same asymptotic, half iterations
 * Space: O(n) — two Sets per iteration
 */
function checkValidOptimized(matrix: number[][]): boolean {
  const n = matrix.length;

  for (let i = 0; i < n; i++) {
    const rowSet = new Set<number>();
    const colSet = new Set<number>();
    for (let j = 0; j < n; j++) {
      rowSet.add(matrix[i][j]);
      colSet.add(matrix[j][i]);
    }
    if (rowSet.size !== n || colSet.size !== n) return false;
  }

  return true;
}

// === Test Cases ===
console.log(
  checkValid([
    [1, 2, 3],
    [3, 1, 2],
    [2, 3, 1],
  ]),
); // true
console.log(
  checkValid([
    [1, 1, 1],
    [1, 2, 3],
    [1, 2, 3],
  ]),
); // false
console.log(
  checkValidOptimized([
    [1, 2, 3],
    [3, 1, 2],
    [2, 3, 1],
  ]),
); // true
```

---

## 🔗 Related Problems

| Problem                                                                                              | Pattern            | Difficulty |
| ---------------------------------------------------------------------------------------------------- | ------------------ | ---------- |
| [Valid Sudoku](https://leetcode.com/problems/valid-sudoku)                                           | Hash Set on matrix | 🟡 Medium  |
| [Find Winner on a Tic Tac Toe Game](https://leetcode.com/problems/find-winner-on-a-tic-tac-toe-game) | Matrix simulation  | 🟢 Easy    |
| [Equal Row and Column Pairs](https://leetcode.com/problems/equal-row-and-column-pairs)               | Hash Map on matrix | 🟡 Medium  |
| [Sudoku Solver](https://leetcode.com/problems/sudoku-solver)                                         | Backtracking + Set | 🔴 Hard    |
