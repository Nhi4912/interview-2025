---
layout: page
title: "Shortest Path to Get Food"
difficulty: Medium
category: Tree-Graph
tags: [Array, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/shortest-path-to-get-food"
---

# shortest path to get food

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Vietnamese analogy:** Bạn đang đói trong mê cung — bắt đầu từ vị trí của mình `@`, tìm đường ngắn nhất đến thức ăn `#`. BFS đảm bảo tìm được đường ngắn nhất theo số bước.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
Grid:
  X X X X X X X
  X * * * * * X
  X @ 0 0 0 # X
  X X X X X X X

BFS from @: spread level by level → reach # in 4 steps
```

---

---

## Problem Description

Given a `m x n` character matrix `grid`:

- `'*'` = open space
- `'#'` = food
- `'X'` = obstacle
- `'@'` = starting position (exactly one)

Return the **minimum number of steps** to reach any food cell. Return `-1` if impossible.

**Example:**

- Input: `grid = [["X","X","X","X","X","X"],["X","*","*","#","*","X"],["X","@","X","X","X","X"]]`
- Output: `-1`

**Constraints:** `1 <= m, n <= 200`

---

---

## 📝 Interview Tips

- 🔑 **BFS** guarantees shortest path in unweighted grid
- 🔑 Find `@` first (starting cell), then do multi-source BFS
- 🔑 Stop immediately when you reach `#` — first time is shortest
- ⚠️ Mark visited as you enqueue (not dequeue) to avoid re-queueing
- ⚠️ `'X'` is a wall; only move through `'*'`, `'#'` (stop), `'@'`
- 💡 Can also work with multiple food sources using multi-source BFS from all `#`

---

---

## Solutions

```typescript
function getFood(grid: string[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // Find starting position '@'
  let startR = -1,
    startC = -1;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === "@") {
        startR = r;
        startC = c;
      }
    }
  }

  const queue: [number, number][] = [[startR, startC]];
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  visited[startR][startC] = true;
  let steps = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;
    steps++;
    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift()!;
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
        if (visited[nr][nc] || grid[nr][nc] === "X") continue;
        if (grid[nr][nc] === "#") return steps;
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }

  return -1;
}

function getFoodDist(grid: string[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const dist = Array.from({ length: m }, () => new Array(n).fill(-1));

  const queue: [number, number][] = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === "@") {
        dist[r][c] = 0;
        queue.push([r, c]);
      }
    }
  }

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (dist[nr][nc] !== -1 || grid[nr][nc] === "X") continue;
      dist[nr][nc] = dist[r][c] + 1;
      if (grid[nr][nc] === "#") return dist[nr][nc];
      queue.push([nr, nc]);
    }
  }

  return -1;
}
```

---

## 🔗 Related Problems

| #    | Problem                        | Difficulty | Tags        |
| ---- | ------------------------------ | ---------- | ----------- |
| 994  | Rotting Oranges                | 🟡 Medium  | BFS, Matrix |
| 1091 | Shortest Path in Binary Matrix | 🟡 Medium  | BFS, Matrix |
| 542  | 01 Matrix                      | 🟡 Medium  | BFS, DP     |
| 1293 | Shortest Path with Obstacles   | 🔴 Hard    | BFS         |
