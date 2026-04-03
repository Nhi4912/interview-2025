---
layout: page
title: "Find Winner on a Tic Tac Toe Game"
difficulty: Easy
category: Array
tags: [Array, Hash Table, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/find-winner-on-a-tic-tac-toe-game"
---

# Find Winner on a Tic Tac Toe Game / Tìm Người Thắng Tic-Tac-Toe

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Check if Every Row and Column Contains All Numbers](https://leetcode.com/problems/check-if-every-row-and-column-contains-all-numbers) | [Valid Tic-Tac-Toe State](https://leetcode.com/problems/valid-tic-tac-toe-state)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống trọng tài trận tic-tac-toe — sau mỗi nước đi, kiểm tra xem người vừa đánh có thắng không. Thắng khi điền đủ 1 hàng, 1 cột, hoặc 1 đường chéo.

```
moves = [[0,0],[2,0],[1,1],[2,1],[2,2]]
Board after each A move:
  A plays (0,0): row[0]=1, col[0]=1, diag=1
  A plays (1,1): row[1]=1, col[1]=1, diag=2, anti=1
  A plays (2,2): row[2]=1, col[2]=1, diag=3 → WIN! → "A"
```

---

## Problem Description

`A` and `B` alternately play Tic-Tac-Toe on a 3×3 board — `A` goes first. Given `moves` array where `moves[i] = [row, col]`, return `"A"` if A wins, `"B"` if B wins, `"Draw"` if board is full with no winner, or `"Pending"` if moves are still possible.

- Example 1: `moves=[[0,0],[2,0],[1,1],[2,1],[2,2]]` → `"A"`
- Example 2: `moves=[[0,0],[1,1],[0,1],[0,2],[1,0],[2,0]]` → `"B"`

Constraints: `1 <= moves.length <= 9`, all moves valid and non-repeating.

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Chỉ bàn 3×3 thôi? A luôn đi trước?" / Board is always 3×3 and A always moves first.
2. **Tracking / Theo dõi**: "Đếm số ô đã điền trên mỗi hàng, cột, 2 đường chéo — thắng khi = 3" / Maintain counters per row/col/diag; no need for full board.
3. **Player sign / Dấu**: "Gán A=1, B=-1 — khi sum=3 thì A thắng, sum=-3 thì B thắng" / Using +1/-1 lets one check cover both players.
4. **Edge case / Trường hợp đặc biệt**: "9 nước mà chưa thắng → Draw; ít hơn 9 → Pending" / After checking winners, distinguish Draw vs Pending by move count.
5. **Complexity / Độ phức tạp**: "O(1) time và space — tối đa 9 nước, 8 đường cần check" / Constant time since board is fixed 3×3.
6. **Follow-up / Câu hỏi tiếp theo**: "Nếu bàn n×n? Nếu cần undo nước đi?" / Generalize to n×n by keeping same counters; undo = decrement.

---

## Solutions

```typescript
/**
 * Solution 1: Counter arrays for rows, cols, diagonals
 * Time: O(1) — at most 9 moves on fixed 3×3 board
 * Space: O(1) — fixed-size arrays
 */
function tictactoe(moves: number[][]): string {
  const rows = [0, 0, 0];
  const cols = [0, 0, 0];
  let diag = 0,
    anti = 0;

  for (let i = 0; i < moves.length; i++) {
    const [r, c] = moves[i];
    const sign = i % 2 === 0 ? 1 : -1; // A=1, B=-1

    rows[r] += sign;
    cols[c] += sign;
    if (r === c) diag += sign;
    if (r + c === 2) anti += sign;

    if (
      Math.abs(rows[r]) === 3 ||
      Math.abs(cols[c]) === 3 ||
      Math.abs(diag) === 3 ||
      Math.abs(anti) === 3
    ) {
      return sign === 1 ? "A" : "B";
    }
  }

  return moves.length === 9 ? "Draw" : "Pending";
}

/**
 * Solution 2: Explicit board simulation (easier to reason about)
 * Time: O(1) — fixed 3×3 board with max 9 moves
 * Space: O(1) — 3×3 board constant size
 */
function tictactoeBoard(moves: number[][]): string {
  const board: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  for (let i = 0; i < moves.length; i++) {
    const [r, c] = moves[i];
    board[r][c] = i % 2 === 0 ? 1 : -1;
  }

  const check = (val: number): boolean => {
    for (let i = 0; i < 3; i++) {
      if (board[i].every((v) => v === val)) return true;
      if (board.every((row) => row[i] === val)) return true;
    }
    return (
      (board[0][0] === val && board[1][1] === val && board[2][2] === val) ||
      (board[0][2] === val && board[1][1] === val && board[2][0] === val)
    );
  };

  if (check(1)) return "A";
  if (check(-1)) return "B";
  return moves.length === 9 ? "Draw" : "Pending";
}

// === Test Cases ===
console.log(
  tictactoe([
    [0, 0],
    [2, 0],
    [1, 1],
    [2, 1],
    [2, 2],
  ]),
); // "A"
console.log(
  tictactoe([
    [0, 0],
    [1, 1],
    [0, 1],
    [0, 2],
    [1, 0],
    [2, 0],
  ]),
); // "B"
console.log(
  tictactoe([
    [0, 0],
    [1, 1],
    [2, 0],
    [1, 0],
    [1, 2],
    [2, 1],
    [0, 1],
    [0, 2],
    [2, 2],
  ]),
); // "Draw"
console.log(
  tictactoe([
    [0, 0],
    [1, 1],
  ]),
); // "Pending"
```

---

## 🔗 Related Problems

| Problem                                                                                                                                | Pattern           | Difficulty |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------- |
| [Valid Tic-Tac-Toe State](https://leetcode.com/problems/valid-tic-tac-toe-state)                                                       | Board validation  | 🟡 Medium  |
| [Check if Every Row and Column Contains All Numbers](https://leetcode.com/problems/check-if-every-row-and-column-contains-all-numbers) | Matrix check      | 🟢 Easy    |
| [Game of Life](https://leetcode.com/problems/game-of-life)                                                                             | Matrix simulation | 🟡 Medium  |
| [Spiral Matrix](https://leetcode.com/problems/spiral-matrix)                                                                           | Matrix traversal  | 🟡 Medium  |
