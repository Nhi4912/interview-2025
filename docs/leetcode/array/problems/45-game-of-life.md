---
layout: page
title: "Game of Life"
difficulty: Medium
category: Array
tags: [Array, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/game-of-life"
---

# Game of Life / Trò Chơi Sự Sống

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Matrix / Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) | [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một khu dân cư — mỗi căn nhà có người ở (1) hoặc bỏ hoang (0). Mỗi tháng, nhà nào quá ít hoặc quá nhiều hàng xóm thì người rời đi, nhà bỏ hoang đủ hàng xóm thì có người dọn vào. Vấn đề: không thể cập nhật từng nhà riêng lẻ vì sẽ ảnh hưởng tới tính toán nhà bên cạnh!

**Pattern Recognition:**

- Signal: "update all cells simultaneously based on neighbors" → encode old state in same cell to avoid extra space
- Use extra bits: `2` = was alive, now dead; `3` = was dead, now alive
- After marking, decode final state in second pass

**Visual — In-place state encoding:**

```
Original:  0=dead, 1=alive
Encoded:   0→0 (stays dead), 1→1 (stays alive)
           1→0 encoded as 2  (was alive, dies)
           0→1 encoded as 3  (was dead, becomes alive)

Pass 1: mark transitions using encoded values
Pass 2: decode → 2%2=0, 3%2=1  (bitwise trick: & 1 for old, >> 1 for new state)

Neighbor count uses: (cell & 1) to read original value
Final decode: (cell >> 1) & 1 for new state, OR use % 2
```

---

## Problem Description

Given an `m x n` board where each cell is 0 (dead) or 1 (alive), apply Conway's Game of Life rules simultaneously to produce the next state **in-place**: a live cell with < 2 or > 3 live neighbors dies; a live cell with 2–3 neighbors survives; a dead cell with exactly 3 live neighbors becomes alive.

**Example 1:** `board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]` → `[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]`

**Example 2:** `board = [[1,1],[1,0]]` → `[[1,1],[1,1]]`

Constraints:

- `m == board.length`, `n == board[0].length`
- `1 <= m, n <= 25`; `board[i][j]` is 0 or 1

---

## 📝 Interview Tips

1. **Clarify**: "Cập nhật đồng thời hay tuần tự?" / Updates are simultaneous — all cells read old state, write new state together
2. **Brute force**: "Copy board sang mảng mới — O(m\*n) space" / Straightforward with a copy; ask if in-place is required
3. **Optimize**: "Encode trạng thái cũ/mới vào cùng ô bằng bit thứ 2" / Encode old+new state together using bit manipulation
4. **Edge cases**: "Board 1×1, toàn 0, toàn 1" / Single cell board, all dead, all alive
5. **Follow-up**: "Board vô hạn? → dùng HashSet lưu live cells" / Infinite board → store only live cells in a set
6. **Complexity**: "O(m\*n) time, O(1) extra space với in-place encoding" / Linear time, constant extra space

---

## Solutions

```typescript
/**
 * Solution 1: Extra copy — straightforward simulation
 * Time: O(m*n) — visit every cell once
 * Space: O(m*n) — copy of entire board
 */
function gameOfLifeCopy(board: number[][]): void {
  const m = board.length,
    n = board[0].length;
  const copy = board.map((row) => [...row]);
  const dirs = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      let liveNeighbors = 0;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
          liveNeighbors += copy[nr][nc];
        }
      }
      if (copy[r][c] === 1) {
        board[r][c] = liveNeighbors === 2 || liveNeighbors === 3 ? 1 : 0;
      } else {
        board[r][c] = liveNeighbors === 3 ? 1 : 0;
      }
    }
  }
}

/**
 * Solution 2: Optimized — in-place state encoding (O(1) extra space)
 * Encoding: bit0 = current state, bit1 = next state
 *   - 0b01 (1): currently alive
 *   - 0b10 (2): currently dead, next alive
 *   - 0b11 (3): currently alive, next alive
 *   - 0b00 (0): currently dead, next dead
 * Time: O(m*n) — two passes over the board
 * Space: O(1) — no extra data structures
 */
function gameOfLife(board: number[][]): void {
  const m = board.length,
    n = board[0].length;
  const dirs = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  // Pass 1: encode next state in bit 1
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      let liveNeighbors = 0;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
          liveNeighbors += board[nr][nc] & 1; // read original state
        }
      }
      const cur = board[r][c] & 1;
      if (cur === 1 && (liveNeighbors === 2 || liveNeighbors === 3)) {
        board[r][c] |= 0b10; // next = alive
      } else if (cur === 0 && liveNeighbors === 3) {
        board[r][c] |= 0b10; // next = alive
      }
      // else: next = dead (bit 1 stays 0)
    }
  }

  // Pass 2: shift right to extract next state
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      board[r][c] >>= 1;
    }
  }
}

// === Test Cases ===
const board1 = [
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 1],
  [0, 0, 0],
];
gameOfLife(board1);
console.log(JSON.stringify(board1)); // [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]

const board2 = [
  [1, 1],
  [1, 0],
];
gameOfLife(board2);
console.log(JSON.stringify(board2)); // [[1,1],[1,1]]
```

---

## 🔗 Related Problems

| Problem                                                              | Pattern             | Difficulty |
| -------------------------------------------------------------------- | ------------------- | ---------- |
| [Spiral Matrix](https://leetcode.com/problems/spiral-matrix)         | Matrix / Simulation | Medium     |
| [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii)   | Matrix / Simulation | Medium     |
| [Candy Crush](https://leetcode.com/problems/candy-crush)             | Matrix / Simulation | Medium     |
| [Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse) | Matrix / Simulation | Medium     |
| [Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes) | In-place Encoding   | Medium     |
