---
layout: page
title: "Available Captures for Rook"
difficulty: Easy
category: Array
tags: [Array, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/available-captures-for-rook"
---

# Available Captures for Rook / Quân Xe Có Thể Ăn Bao Nhiêu Quân

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Tiếng Việt:** Tìm vị trí quân Xe (R). Quét 4 hướng: Trên, Dưới, Trái, Phải. Đếm số quân Tốt (p) gặp được trước khi bị chặn bởi quân Tượng (B) hoặc hết bàn cờ.

**English:** Find the Rook 'R'. Scan all 4 directions. In each direction: stop at bishop 'B' (blocked), count a pawn 'p' (capture available), or stop at board edge.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Available Captures for Rook example:**

```
Board (8x8):
. . . . . . . .
. . . . . . . .
. . . . . . . .
. . p . . . . .
. . R . . B . .   ← Rook at (4,2)
. . . . . . . .
. . . . p . . .
. . . . . . . .

Up: (3,2)='p' → capture! count=1
Down: (5,2)='.', (6,2)='.', (7,2)='.' → 0
Left: (4,1)='.', (4,0)='.' → 0
Right: (4,3)='.', (4,4)='.', (4,5)='B' → blocked, 0

Answer: 1
```

---

## Problem Description

| Problem                                                                                           | Difficulty | Pattern          |
| ------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Queens That Can Attack the King](https://leetcode.com/problems/queens-that-can-attack-the-king/) | 🟡 Medium  | 8-direction scan |
| [Battleships in a Board](https://leetcode.com/problems/battleships-in-a-board/)                   | 🟡 Medium  | Matrix           |
| [Robot Return to Origin](https://leetcode.com/problems/robot-return-to-origin/)                   | 🟢 Easy    | Simulation       |

---

## 📝 Interview Tips

- 🔑 **EN:** Find 'R' first — guaranteed exactly one rook on the board | **VI:** Tìm 'R' trước — đề đảm bảo đúng một quân Xe trên bàn cờ
- 🔑 **EN:** Scan each direction independently until boundary or 'B' | **VI:** Quét mỗi hướng độc lập cho đến khi gặp biên hoặc 'B'
- 🔑 **EN:** 'B' blocks the rook — stop without counting | **VI:** 'B' chặn quân Xe — dừng lại không đếm
- 🔑 **EN:** 'p' is a capture — count and stop (rook captures only one per direction) | **VI:** 'p' là quân bị ăn — đếm rồi dừng (xe chỉ ăn một quân mỗi hướng)
- 🔑 **EN:** '.' means empty square — continue scanning | **VI:** '.' là ô trống — tiếp tục quét
- 🔑 **EN:** O(8²) = O(1) since board is always 8×8 | **VI:** O(8²) = O(1) vì bàn cờ luôn là 8×8

---

## Solutions

```typescript
/**
 * Available Captures for Rook using 4-direction scan
 * Time: O(1) — board is always 8x8
 * Space: O(1)
 */
function numRookCaptures(board: string[][]): number {
  const N = 8;
  let rr = 0, rc = 0;

  // Find the rook
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (board[r][c] === 'R') { rr = r; rc = c; }
    }
  }

  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let captures = 0;

  for (const [dr, dc] of dirs) {
    let r = rr + dr;
    let c = rc + dc;
    while (r >= 0 && r < N && c >= 0 && c < N) {
      if (board[r][c] === 'B') break;       // blocked by bishop
      if (board[r][c] === 'p') { captures++; break; } // capture pawn
      r += dr;
      c += dc;
    }
  }

  return captures;
}

const board1 = [
  ['.','.','.','.','.','.','.','.'],['.','.','.','p','.','.','.','.'],['.','.','.','R','.','.','.','p'],
  ['.','.','.','.','.','.','.','.'],['.','.','.','.','.','.','.','.'],['.','.','.','p','.','.','.','.'],['.','.','.','.','.','.','.','.'],['.','.','.','.','.','.','.','.']]
];
console.log(numRookCaptures(board1)); // 3

/**
 * Scan each direction with explicit loops — easier to read
 * Time: O(1) | Space: O(1)
 */
function numRookCaptures2(board: string[][]): number {
  let rr = 0,
    rc = 0;
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c] === "R") {
        rr = r;
        rc = c;
      }

  let count = 0;

  // Up
  for (let r = rr - 1; r >= 0; r--) {
    if (board[r][rc] === "B") break;
    if (board[r][rc] === "p") {
      count++;
      break;
    }
  }
  // Down
  for (let r = rr + 1; r < 8; r++) {
    if (board[r][rc] === "B") break;
    if (board[r][rc] === "p") {
      count++;
      break;
    }
  }
  // Left
  for (let c = rc - 1; c >= 0; c--) {
    if (board[rr][c] === "B") break;
    if (board[rr][c] === "p") {
      count++;
      break;
    }
  }
  // Right
  for (let c = rc + 1; c < 8; c++) {
    if (board[rr][c] === "B") break;
    if (board[rr][c] === "p") {
      count++;
      break;
    }
  }

  return count;
}

const board2 = [
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", "p", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", "R", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", "p", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
];
console.log(numRookCaptures2(board2)); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                           | Difficulty | Pattern          |
| ------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Queens That Can Attack the King](https://leetcode.com/problems/queens-that-can-attack-the-king/) | 🟡 Medium  | 8-direction scan |
| [Battleships in a Board](https://leetcode.com/problems/battleships-in-a-board/)                   | 🟡 Medium  | Matrix           |
| [Robot Return to Origin](https://leetcode.com/problems/robot-return-to-origin/)                   | 🟢 Easy    | Simulation       |
