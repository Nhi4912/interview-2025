---
layout: page
title: "Surrounded Regions"
difficulty: Medium
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Union Find, Matrix]
leetcode_url: "https://leetcode.com/problems/surrounded-regions"
---

# Surrounded Regions / Vùng Bị Bao Quanh

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Max Area of Island](https://leetcode.com/problems/max-area-of-island) | [Making A Large Island](https://leetcode.com/problems/making-a-large-island)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như trò chơi Go — quân cờ trắng bị bao vây bởi quân đen thì bị ăn. Nhưng quân cờ ở mép bảng không bao giờ bị ăn. Trick: **đi từ biên vào** để đánh dấu những 'O' an toàn, còn lại đều bị flip.

**Pattern Recognition:**

- Signal: "capture all 'O' not connected to border" → **DFS/BFS from border + reverse logic**
- Reverse thinking: mark safe cells first (border-connected 'O'), then flip everything else
- Key insight: Any 'O' connected to a border 'O' is safe; mark them 'S', then restore

**Visual — Surrounded regions example:**

```
Input:             Mark border O:      Final:
X X X X            X X X X             X X X X
X O O X    →       X S S X      →      X X X X
X X O X            X X S X             X X X X
X O X X            X O X X             X O X X
           (border O at row3,col1 stays safe)
```

---

## Problem Description

Given an `m x n` matrix of `'X'` and `'O'`, capture all regions surrounded by `'X'`: flip all `'O'` cells not connected to any border `'O'` to `'X'`. A region is captured if it is completely surrounded by `'X'` (4-directionally, not touching the border).

- Example 1: `[["X","X","X"],["X","O","X"],["X","X","X"]]` → all 'O' flipped to 'X'
- Example 2: `[["X"]]` → unchanged

Constraints: `1 <= m, n <= 200`, cells are `'X'` or `'O'`.

---

## 📝 Interview Tips

1. **Clarify**: "4-directional connectivity? Ô ở biên không bao giờ bị flip?" / 4-dir; border 'O' and anything reachable from border is safe
2. **Reverse thinking**: "Thay vì tìm surrounded O, hãy đánh dấu UN-surrounded O trước" / Mark safe O from border first, then flip
3. **DFS from border**: "Duyệt 4 cạnh bảng, DFS mọi 'O' gặp phải — đánh dấu 'S'" / Border-sweep then DFS inward
4. **Restore**: "Sau DFS: O→X (captured), S→O (safe, restore), X→X (unchanged)" / Three-way remap at end
5. **Edge cases**: "Board toàn X, board 1 hàng/cột (tất cả là biên → không flip gì)" / Single row/col: everything is border
6. **Follow-up**: "8-directional? Thêm diagonal dirs. Nhiều states? Union Find với virtual border node" / UF variant: connect border O to a virtual node

---

## Solutions

```typescript
/**
 * Solution 1: DFS from border — mark safe O cells, then remap
 * Time: O(M*N) — each cell visited at most twice
 * Space: O(M*N) — recursion stack
 */
function solveDFS(board: string[][]): void {
  const m = board.length,
    n = board[0].length;

  function dfs(r: number, c: number): void {
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== "O") return;
    board[r][c] = "S"; // mark as safe
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  // Mark all border-connected O cells as safe
  for (let r = 0; r < m; r++) {
    dfs(r, 0);
    dfs(r, n - 1);
  }
  for (let c = 0; c < n; c++) {
    dfs(0, c);
    dfs(m - 1, c);
  }

  // Remap: O→X (captured), S→O (safe/restore)
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c] === "O") board[r][c] = "X";
      else if (board[r][c] === "S") board[r][c] = "O";
    }
  }
}

/**
 * Solution 2: BFS from border — iterative, safe for large boards
 * Time: O(M*N) — each cell enqueued once
 * Space: O(M*N) — BFS queue
 */
function solve(board: string[][]): void {
  const m = board.length,
    n = board[0].length;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const queue: [number, number][] = [];

  // Seed queue with all border O cells
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if ((r === 0 || r === m - 1 || c === 0 || c === n - 1) && board[r][c] === "O") {
        board[r][c] = "S";
        queue.push([r, c]);
      }
    }
  }

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] === "O") {
        board[nr][nc] = "S";
        queue.push([nr, nc]);
      }
    }
  }

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c] === "O") board[r][c] = "X";
      else if (board[r][c] === "S") board[r][c] = "O";
    }
  }
}

// === Test Cases ===
const b1 = [
  ["X", "X", "X", "X"],
  ["X", "O", "O", "X"],
  ["X", "X", "O", "X"],
  ["X", "O", "X", "X"],
];
solve(b1);
console.log(b1);
// [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]

const b2 = [["X"]];
solve(b2);
console.log(b2); // [["X"]] unchanged

const b3 = [
  ["O", "O"],
  ["O", "O"],
];
solve(b3);
console.log(b3); // All O, all on border → no change

const b4 = [
  ["O", "X", "X", "O"],
  ["X", "O", "O", "X"],
  ["X", "O", "O", "X"],
  ["O", "X", "X", "O"],
];
solve(b4);
console.log(b4); // inner O→X; corner O stay
```

---

## 🔗 Related Problems

- [Number of Islands](https://leetcode.com/problems/number-of-islands) — DFS/BFS to count connected regions
- [Max Area of Island](https://leetcode.com/problems/max-area-of-island) — DFS measuring island size
- [Count Sub Islands](https://leetcode.com/problems/count-sub-islands) — DFS with containment condition
- [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) — BFS/Dijkstra on grid with elevation
