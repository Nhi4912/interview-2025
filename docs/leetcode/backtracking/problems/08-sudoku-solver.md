---
layout: page
title: "Sudoku Solver"
difficulty: Hard
category: Backtracking
tags: [Array, Backtracking, Matrix]
leetcode_url: "https://leetcode.com/problems/sudoku-solver/"
---

# Sudoku Solver / Giải Sudoku

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking + Constraint Sets
> **Frequency**: 📘 Tier 2 — Tests constraint-based backtracking; common in system design or algorithm rounds
> **See also**: [Word Search II](./09-word-search-ii.md) | [Palindrome Partitioning](./10-palindrome-partitioning.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Như điền bài kiểm tra điền khuyết — mỗi ô bị ràng buộc bởi hàng ngang, cột dọc, và ô 3×3. Bạn thử từng chữ số 1-9, nếu vi phạm ràng buộc thì bỏ qua, nếu điền được thì tiến tới ô tiếp. Nếu kẹt không ô nào hợp lệ, xóa đi và quay lại thử chữ số khác.

- **Pattern Recognition:**
  - Signal: fill 9×9 grid with constraints per row/col/box → backtracking
  - Tối ưu: dùng Set để track ký tự đã dùng trong mỗi row/col/box → O(1) check
  - Box index: `Math.floor(row/3)*3 + Math.floor(col/3)` maps (row,col) → box 0-8

- **Visual — điền ô (0,2) với constraints:**

```
Row 0:  [5,3,_,_,7,_,_,_,_]  used={5,3,7}
Col 2:  [_,_,8,_,_,_,_,_,_]  used={8}
Box 0:  [5,3,_,6,_,_,_,9,8]  used={5,3,6,9,8}

Union of constraints: {3,5,6,7,8,9}
Valid digits for (0,2): {1,2,4} → try 1 first
  → if further cells fail, backtrack and try 2, then 4
```

## Problem Description

Fill all `'.'` cells so each row, column, and 3×3 box contains digits 1-9 exactly once.

```
Input:  board with '.' for empty cells (standard 9×9 Sudoku)
Output: board filled in-place with valid solution (guaranteed unique)
```

## 📝 Interview Tips

1. **Box index = `floor(r/3)*3 + floor(c/3)` — maps any cell to one of 9 boxes / Box index formula is the key — memorize it**
2. **Precompute sets: O(1) lookup per check vs O(9) scan per digit / Using Sets for rows/cols/boxes: O(1) vs O(9) naive check**
3. **Không cần trả về bool — chỉ cần modify board in-place; dừng khi không còn ô trống / No need to return bool; modify in-place, stop when no empty cells**
4. **Backtrack: xóa khỏi board VÀ khỏi cả 3 sets / Backtrack: restore board cell AND remove from all 3 sets**
5. **Advanced: pick cell với ít ứng viên nhất (MRV heuristic) → giảm search space đáng kể / MRV: pick cell with fewest valid digits first for speedup**
6. **Guarantee: puzzle luôn có đúng 1 lời giải → không cần collect nhiều solutions / Unique solution guaranteed — no need to collect all**

## Solutions

{% raw %}
/\*\*

- Solution 1 — Basic Backtracking (isValid scan)
- Validate by scanning entire row/col/box on each attempt
- Time: O(9^empty_cells) | Space: O(81) recursion
  _/
  function solveSudoku(board: string[][]): void {
  function isValid(r: number, c: number, num: string): boolean {
  for (let i = 0; i < 9; i++) {
  if (board[r][i] === num) return false; // row check
  if (board[i][c] === num) return false; // col check
  const br = Math.floor(r / 3) _ 3 + Math.floor(i / 3);
  const bc = Math.floor(c / 3) \* 3 + (i % 3);
  if (board[br][bc] === num) return false; // box check
  }
  return true;
  }

function backtrack(): boolean {
for (let r = 0; r < 9; r++) {
for (let c = 0; c < 9; c++) {
if (board[r][c] !== '.') continue;
for (let d = 1; d <= 9; d++) {
const num = String(d);
if (isValid(r, c, num)) {
board[r][c] = num;
if (backtrack()) return true;
board[r][c] = '.';
}
}
return false; // no digit worked — backtrack
}
}
return true; // no empty cells left — solved!
}

backtrack();
}

/\*\*

- Solution 2 — Backtracking + Constraint Sets ✅ Recommended
- Precompute sets for O(1) validity check; much faster in practice
- Time: O(9^empty_cells) | Space: O(81) for sets
  \*/
  function solveSudokuSets(board: string[][]): void {
  const rows = Array.from({ length: 9 }, () => new Set<string>());
  const cols = Array.from({ length: 9 }, () => new Set<string>());
  const boxes = Array.from({ length: 9 }, () => new Set<string>());

// Initialise constraints from existing digits
for (let r = 0; r < 9; r++) {
for (let c = 0; c < 9; c++) {
if (board[r][c] === '.') continue;
const num = board[r][c];
const box = Math.floor(r / 3) \* 3 + Math.floor(c / 3);
rows[r].add(num); cols[c].add(num); boxes[box].add(num);
}
}

function place(r: number, c: number, num: string): void {
const box = Math.floor(r / 3) \* 3 + Math.floor(c / 3);
board[r][c] = num;
rows[r].add(num); cols[c].add(num); boxes[box].add(num);
}

function remove(r: number, c: number, num: string): void {
const box = Math.floor(r / 3) \* 3 + Math.floor(c / 3);
board[r][c] = '.';
rows[r].delete(num); cols[c].delete(num); boxes[box].delete(num);
}

function backtrack(): boolean {
for (let r = 0; r < 9; r++) {
for (let c = 0; c < 9; c++) {
if (board[r][c] !== '.') continue;
const box = Math.floor(r / 3) \* 3 + Math.floor(c / 3);
for (let d = 1; d <= 9; d++) {
const num = String(d);
if (rows[r].has(num) || cols[c].has(num) || boxes[box].has(num)) continue;
place(r, c, num);
if (backtrack()) return true;
remove(r, c, num);
}
return false;
}
}
return true;
}

backtrack();
}

// ── inline tests ──
// const board = [
// ["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".",".",],
// [".","9","8",".",".",".",".","6","."],[...], ...
// ];
// solveSudokuSets(board);
// board[0][2] → "4" board[0][5] → "8" board[4][4] → "5"
{% endraw %}

## 🔗 Related Problems

- [LC #36 Valid Sudoku](https://leetcode.com/problems/valid-sudoku/) — validation only (no solving)
- [LC #212 Word Search II](./09-word-search-ii.md) — backtracking on 2D grid
- [LC #52 N-Queens II](https://leetcode.com/problems/n-queens-ii/) — constraint-based backtracking
- [LC #51 N-Queens](https://leetcode.com/problems/n-queens/) — classic constrained placement
