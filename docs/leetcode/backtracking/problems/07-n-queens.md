---
layout: page
title: "N-Queens"
difficulty: Hard
category: Backtracking
tags: [Array, Backtracking]
leetcode_url: "https://leetcode.com/problems/n-queens/"
leetcode_number: 51
pattern: "Backtracking with Constraint Tracking"
frequency_tier: 2
companies: [Amazon, Google, Microsoft, Palantir]
target_time_minutes: 35
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# N-Queens / Bài Toán N Quân Hậu

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Sudoku Solver](https://leetcode.com/problems/sudoku-solver/) | [Permutations](https://leetcode.com/problems/permutations/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như xếp N nhân viên bảo vệ vào N hành lang của trung tâm thương mại, sao cho không ai có thể "trông thấy" nhau theo hàng ngang, hàng dọc, hoặc đường chéo. Backtracking thử từng vị trí theo từng hàng — nếu phát hiện xung đột, rút lại và thử vị trí khác. Như một người chơi cờ kiên nhẫn sửa lại từng nước đi sai.

**Pattern Recognition:**

- Signal: "place n items with constraints", "return all valid configurations" → **Backtracking**
- Place exactly one queen per row (pigeonhole); check column + two diagonals
- Use sets for O(1) constraint checking: cols, diag1 (row+col), diag2 (row-col)

**Visual — N=4, placing row by row:**

```
  Row 0: try col=1 → OK           cols={1}, d1={1}, d2={-1}
  Row 1: try col=3 → OK           cols={1,3}, d1={1,4}, d2={-1,-2}
  Row 2: try col=0 → OK           cols={0,1,3}, d1={0,1,4}, d2={-1,-2,2}
  Row 3: try col=2 → OK ✅
  Board: [".Q..", "...Q", "Q...", "..Q."]

  Diagonal keys:
  ↘ diagonal: row+col is same for all cells on that diagonal
  ↗ diagonal: row-col is same for all cells on that diagonal
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| When you see... | Think... | Template | Complexity |
|---|---|---|---|
| "Place N queens on NxN board, no attacks" | Backtracking row by row — track cols, diagonals, anti-diagonals in sets | `place(row): for col in 0..n: if not in cols/diag/antiDiag: place and recurse next row; remove after` | O(n!) time, O(n) space |
| Need O(1) conflict detection | Three sets: cols, row+col diagonals, row-col diagonals | `cols.has(col) \|\| diag1.has(row+col) \|\| diag2.has(row-col)` | O(1) per check |
| Which diagonal formula to use? | ↘ diagonal: row+col constant; ↗ anti-diagonal: row-col constant | Add both values to respective sets on placement | — |
| Build output board from stored positions | Collect queen column per row; join into strings at base case | `".".repeat(col) + "Q" + ".".repeat(n-col-1)` | O(n²) output |

**Memory hook:** "N-Queens = backtrack theo hàng — 3 tập hợp cấm: cột, đường chéo, đường chéo ngược"

---

## Problem Description

Place `n` queens on an `n×n` chessboard so no two queens attack each other (same row, column, or diagonal). Return all distinct board configurations.

```
Example 1: n=4 → 2 solutions
  [".Q..","...Q","Q...","..Q."]  and  ["..Q.","Q...","...Q",".Q.."]

Example 2: n=1 → [["Q"]]

Example 3: n=2 → []   (no valid placement exists)
```

Constraints:

- 1 ≤ n ≤ 9

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

> "Confirming: we place exactly n queens on an n×n board, no two in the same row, column, or diagonal — and we return all valid board configurations as arrays of strings?"

> "Since there must be exactly one queen per row (n queens, n rows), I'll backtrack row by row. For each row, I try each column. To check conflicts in O(1), I'll maintain three sets: one for used columns, one for diagonals where row+col is constant (same ↘ diagonal), and one for anti-diagonals where row-col is constant (same ↗ diagonal)."

> "When I place a queen at (row, col): add col to cols, row+col to diag1, row-col to diag2. Recurse to next row. After recursion returns, remove all three to backtrack."

> "At row === n, all queens are placed validly — build the board strings from stored positions and push to result."

> "Time O(n!) with backtracking pruning, Space O(n) for the three sets plus O(n) recursion depth. The output itself is O(n²) per solution."

---

## 📝 Interview Tips

1. **Clarify**: One queen per row guaranteed? (Yes — n queens on n×n, pigeonhole) / Mỗi hàng chính xác 1 quân hậu.
2. **Brute force**: Try all n^n placements → O(n^n), infeasible / Thử toàn bộ vị trí quá chậm.
3. **Optimize**: Backtrack row by row O(n!) with pruning; O(1) conflict check using sets vs O(n) board scan / Dùng set để kiểm tra xung đột O(1) thay vì quét bảng O(n).
4. **Diagonal trick**: d1=row+col (same ↘), d2=row-col (same ↗) — use as set keys / Hai đường chéo xác định bởi tổng và hiệu tọa độ.
5. **Edge cases**: n=2 and n=3 have zero solutions / n=2, n=3 không có nghiệm.
6. **Follow-up**: N-Queens II — count only, not enumerate / Chỉ đếm số lượng nghiệm, không cần liệt kê.

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

1. **Checking all previous queens O(n) per placement instead of O(1) sets** — scanning the board for conflicts on every placement is O(n) per check, making each backtrack path O(n²) slower. Using three hash sets gives O(1) conflict detection per placement, a significant improvement.

2. **Using row-col for anti-diagonal instead of row+col** — the ↘ diagonal (top-left to bottom-right) has constant row-col; the ↗ anti-diagonal (top-right to bottom-left) has constant row+col. Swapping these blocks the wrong cells. Remember: diagonal=row-col (decreasing col as row increases on ↘), anti-diagonal=row+col (increasing col as row increases on ↗).

3. **Constructing the board incorrectly from stored positions** — don't try to maintain a 2D board array during backtracking. Instead, only store the column index per row; build the full board string output only when a valid solution is found at the base case (`row === n`). This avoids rebuilding the board on every backtrack step.

---

## Solutions

```typescript

/**

- Solution 1: Backtracking with Board Scan (Simpler to understand)
- Time: O(n!) — backtracking prunes invalid branches
- Space: O(n²) — board array storage
  */
  function solveNQueensBrute(n: number): string[][] {
  const result: string[][] = [];
  const board = Array.from({ length: n }, () => Array(n).fill("."));

function isValid(row: number, col: number): boolean {
// Check column above
for (let i = 0; i < row; i++) {
if (board[i][col] === "Q") return false;
}
// Check top-left diagonal
for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
if (board[i][j] === "Q") return false;
}
// Check top-right diagonal
for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
if (board[i][j] === "Q") return false;
}
return true;
}

function backtrack(row: number): void {
if (row === n) { result.push(board.map(r => r.join(""))); return; }
for (let col = 0; col < n; col++) {
if (isValid(row, col)) {
board[row][col] = "Q";
backtrack(row + 1);
board[row][col] = ".";
}
}
}

backtrack(0);
return result;
}

/**

- Solution 2: Backtracking with Sets (Optimal — O(1) constraint check)
- Time: O(n!) — same pruning, but constant-time conflict detection
- Space: O(n) — three sets + O(n) board rows as strings
  */
  function solveNQueens(n: number): string[][] {
  const result: string[][] = [];
  const cols = new Set<number>();
  const diag1 = new Set<number>(); // row+col constant on ↘ diagonal
  const diag2 = new Set<number>(); // row-col constant on ↗ diagonal

function backtrack(row: number, board: string[]): void {
if (row === n) { result.push([...board]); return; }
for (let col = 0; col < n; col++) {
if (cols.has(col) || diag1.has(row + col) || diag2.has(row - col)) continue;

      cols.add(col); diag1.add(row + col); diag2.add(row - col);
      board.push(".".repeat(col) + "Q" + ".".repeat(n - col - 1));
      backtrack(row + 1, board);
      board.pop();
      cols.delete(col); diag1.delete(row + col); diag2.delete(row - col);
    }

}

backtrack(0, []);
return result;
}

// === Test Cases ===
console.log(solveNQueens(1).length); // 1
console.log(solveNQueens(4).length); // 2
console.log(solveNQueens(2).length); // 0
console.log(solveNQueens(8).length); // 92

```

---

## 🔗 Related Problems

- [N-Queens II](https://leetcode.com/problems/n-queens-ii/) — same problem, return count only (can optimize with symmetry)
- [Sudoku Solver](https://leetcode.com/problems/sudoku-solver/) — same backtracking pattern, more complex constraint set
- [Permutations](https://leetcode.com/problems/permutations/) — foundational backtracking: generate all orderings
- [Combination Sum](https://leetcode.com/problems/combination-sum/) — backtracking with repeat choices and pruning

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric | Target | Actual |
|---|---|---|
| Time to solve | 35 min | __ min |
| Solution correctness | All test cases pass | ✅ / ❌ |
| Used sets for O(1) conflict check | cols, diag1, diag2 | ✅ / ❌ |
| Diagonal formulas correct | row+col and row-col | ✅ / ❌ |

**SRS Schedule:** Day 1 → Day 3 → Day 7 → Day 14 → Day 30

| Date | Solve Time | Confidence (1-5) | Notes |
|---|---|---|---|
| | | | |
