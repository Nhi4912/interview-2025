---
layout: page
title: "Minesweeper"
difficulty: Medium
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/minesweeper"
---

# Minesweeper / Dò Mìn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS/BFS Flood Fill
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Flood Fill](https://leetcode.com/problems/flood-fill) | [Number of Islands](https://leetcode.com/problems/number-of-islands)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chơi game Dò Mìn thực sự — khi click vào ô trống ('E'), nếu xung quanh không có mìn thì tự động mở rộng ra các ô lân cận. Đây là DFS/BFS flood fill với 8 hướng (kể cả đường chéo).

**Pattern Recognition:**

- Signal: "reveal cells" + "expand if no adjacent mines" → **DFS/BFS 8-directional**
- Click vào mine ('M') → đổi thành 'X' và dừng
- Click vào empty ('E') → đếm mines xung quanh → nếu >0: show digit; nếu =0: flood fill tiếp

**Visual:**

```
Board:          Click (3,0):        Result:
E E E E E       E E E E E           B 1 E E E
E E M E E  →    B 1 M E E    →      B 1 M E E
E E E E E       B 1 1 1 E           B 1 1 1 E
B 1 E 1 E       B 1 E 1 E           B 1 E 1 E
B B E E E       B B E E E           B B E E E
Flood fill stops at digits (adjacent mines exist)
```

---

## Problem Description

Given a Minesweeper board and a click position, reveal cells following the rules: (1) if `'M'` (mine) is clicked, change to `'X'` — game over; (2) if `'E'` (empty), count adjacent mines; if count > 0, show digit; if count = 0, mark `'B'` and recursively reveal all 8 neighbors.

**Example 1:** Board with `M` at `[0][2]`, click `[3][0]` → flood reveal producing `B`s and digits
**Example 2:** Click directly on `'M'` → board shows `'X'` at that position

Constraints: `1 <= m, n <= 50`, `board[i][j]` is `'M'` or `'E'`, `click` is unrevealed cell.

---

## 📝 Interview Tips

1. **Clarify**: "8 hướng hay 4 hướng? 'B' là blank hay border?" / Confirm 8-directional and what 'B' represents
2. **Mine click**: "Click vào 'M' → return ngay sau khi đổi thành 'X'" / Short-circuit on mine click
3. **Count first**: "Đếm mines trong 8 ô lân cận TRƯỚC khi quyết định expand" / Count neighbors before deciding to expand
4. **Mark before recurse**: "Đổi 'E' thành 'B' hoặc digit TRƯỚC khi thêm vào queue — tránh visited set" / Mark cell before enqueuing to avoid re-processing
5. **Edge cases**: "Ô nằm ở góc/biên → kiểm tra bounds cho 8 hướng" / Boundary check for all 8 directions
6. **Follow-up**: "Nếu cần track game state qua nhiều lượt click?" / Maintain board state across multiple clicks

---

## Solutions

```typescript
/**
 * Solution 1: DFS recursive flood fill
 * Time: O(M·N) — each cell visited at most once
 * Space: O(M·N) — recursion stack
 */
function updateBoard(board: string[][], click: number[]): string[][] {
  const [cr, cc] = click;
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
  const m = board.length,
    n = board[0].length;

  if (board[cr][cc] === "M") {
    board[cr][cc] = "X";
    return board;
  }

  function dfs(r: number, c: number): void {
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== "E") return;
    // Count adjacent mines
    let mines = 0;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] === "M") mines++;
    }
    if (mines > 0) {
      board[r][c] = String(mines); // show digit, stop expanding
    } else {
      board[r][c] = "B"; // blank, expand to neighbors
      for (const [dr, dc] of dirs) dfs(r + dr, c + dc);
    }
  }

  dfs(cr, cc);
  return board;
}

/**
 * Solution 2: BFS iterative (avoids stack overflow on large boards)
 * Time: O(M·N) — each cell visited at most once
 * Space: O(M·N) — queue
 */
function updateBoardBFS(board: string[][], click: number[]): string[][] {
  const [cr, cc] = click;
  if (board[cr][cc] === "M") {
    board[cr][cc] = "X";
    return board;
  }

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
  const m = board.length,
    n = board[0].length;
  const queue: [number, number][] = [[cr, cc]];
  board[cr][cc] = "B"; // pre-mark to avoid duplicates in queue

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    let mines = 0;
    const neighbors: [number, number][] = [];
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
        if (board[nr][nc] === "M") mines++;
        else if (board[nr][nc] === "E") neighbors.push([nr, nc]);
      }
    }
    if (mines > 0) {
      board[r][c] = String(mines);
    } else {
      for (const [nr, nc] of neighbors) {
        board[nr][nc] = "B";
        queue.push([nr, nc]);
      }
    }
  }
  return board;
}

// === Test Cases ===
const board1 = [
  ["E", "E", "E", "E", "E"],
  ["E", "E", "M", "E", "E"],
  ["E", "E", "E", "E", "E"],
  ["E", "E", "E", "E", "E"],
];
console.log(updateBoard(board1, [3, 0]));
// [['B','1','E','1','B'],['B','1','M','1','B'],['B','1','1','1','B'],['B','B','B','B','B']]

const board2 = [
  ["B", "1", "E", "1", "B"],
  ["B", "1", "M", "1", "B"],
  ["B", "1", "1", "1", "B"],
  ["B", "B", "B", "B", "B"],
];
console.log(updateBoard(board2, [1, 2]));
// board2 with M at [1][2] → X
```

---

## 🔗 Related Problems

| Problem                                                                                  | Pattern           | Difficulty |
| ---------------------------------------------------------------------------------------- | ----------------- | ---------- |
| [Flood Fill](https://leetcode.com/problems/flood-fill)                                   | DFS flood fill    | 🟢 Easy    |
| [Number of Islands](https://leetcode.com/problems/number-of-islands)                     | DFS components    | 🟡 Medium  |
| [Max Area of Island](https://leetcode.com/problems/max-area-of-island)                   | DFS area counting | 🟡 Medium  |
| [Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow) | Multi-source DFS  | 🟡 Medium  |
| [Surrounded Regions](https://leetcode.com/problems/surrounded-regions)                   | BFS boundary fill | 🟡 Medium  |
