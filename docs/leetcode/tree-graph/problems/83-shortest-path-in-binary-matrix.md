---
layout: page
title: "Shortest Path in Binary Matrix"
difficulty: Medium
category: Tree-Graph
tags: [Array, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/shortest-path-in-binary-matrix"
---

# Shortest Path in Binary Matrix / Đường Đi Ngắn Nhất Trong Ma Trận Nhị Phân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Rotting Oranges](https://leetcode.com/problems/rotting-oranges) | [Shortest Path to Get All Keys](https://leetcode.com/problems/shortest-path-to-get-all-keys)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như tìm đường thoát qua bãi mìn — mỗi ô `0` an toàn để đi qua, ô `1` là mìn cần tránh. Đi theo 8 hướng (kể cả đường chéo). BFS đảm bảo tìm đường ngắn nhất.

**Pattern Recognition:**

- Signal: "shortest path" + "unweighted grid" + "8 directions" → **BFS**
- Mark ô đã thăm ngay khi enqueue (không phải khi dequeue) để tránh duplicate
- Key insight: có thể modify grid in-place để mark visited, tiết kiệm bộ nhớ

**Visual — BFS 8-directional:**

```
Grid (0=free, 1=blocked):
 0 1 0 0
 0 0 0 1
 1 0 0 0
 0 1 0 0

Start(0,0)→...→End(3,3)
BFS layers:
Layer 1: (0,0)=1
Layer 2: (1,0),(1,1)=2
Layer 3: (2,1),(1,2),(0,2)=3
Layer 4: (3,2),(2,2)=4
Layer 5: (3,3)=5  ← answer
```

---

## Problem Description

Given an `n×n` binary matrix, find the length of the shortest clear path from top-left `(0,0)` to bottom-right `(n-1,n-1)`. ([LeetCode #1091](https://leetcode.com/problems/shortest-path-in-binary-matrix))

A clear path has all cells equal to `0` and can move in 8 directions. Path length = number of cells visited. Return `-1` if no clear path exists.

**Example 1:** `[[0,1],[1,0]]` → `2`
**Example 2:** `[[0,0,0],[1,1,0],[1,1,0]]` → `4`

---

## 📝 Interview Tips

1. **Clarify**: "8 directions hay 4? Ô cuối có thể là ô đầu không (n=1)?" / 8 or 4 directions? n=1 edge case?
2. **BFS vs DFS**: "BFS cho shortest path; DFS sẽ phải explore tất cả paths" / Always BFS for shortest
3. **In-place marking**: "Đặt `grid[r][c] = 1` khi enqueue để tránh revisit" / Mark visited on enqueue
4. **Edge cases**: "`grid[0][0] == 1` hoặc `grid[n-1][n-1] == 1` → trả về -1 ngay" / Check start/end blocked
5. **n=1**: "Nếu `grid[0][0] == 0` thì path length = 1" / Single cell special case
6. **Follow-up**: "Nếu weighted → Dijkstra; nếu obstacles di chuyển → BFS với time state" / Weighted or dynamic variants

---

## Solutions

```typescript
/**
 * Solution 1: BFS (Standard)
 * Time: O(N²) — visit each cell at most once
 * Space: O(N²) — queue size
 */
function shortestPathBinaryMatrixBFS(grid: number[][]): number {
  const n = grid.length;
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return -1;
  if (n === 1) return 1;

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
  const queue: [number, number, number][] = [[0, 0, 1]]; // [row, col, dist]
  grid[0][0] = 1; // mark visited

  while (queue.length > 0) {
    const [r, c, dist] = queue.shift()!;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n || grid[nr][nc] !== 0) continue;
      if (nr === n - 1 && nc === n - 1) return dist + 1;
      grid[nr][nc] = 1; // mark visited in-place
      queue.push([nr, nc, dist + 1]);
    }
  }
  return -1;
}

/**
 * Solution 2: BFS with explicit visited set (non-destructive)
 * Time: O(N²)
 * Space: O(N²) — visited set + queue
 */
function shortestPathBinaryMatrix(grid: number[][]): number {
  const n = grid.length;
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return -1;
  if (n === 1) return 1;

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
  const visited = Array.from({ length: n }, () => new Array(n).fill(false));
  const queue: [number, number][] = [[0, 0]];
  visited[0][0] = true;
  let dist = 1;

  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift()!;
      if (r === n - 1 && c === n - 1) return dist;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] && grid[nr][nc] === 0) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
    dist++;
  }
  return -1;
}

// === Test Cases ===
console.log(
  shortestPathBinaryMatrix([
    [0, 1],
    [1, 0],
  ]),
); // 2
console.log(
  shortestPathBinaryMatrix([
    [0, 0, 0],
    [1, 1, 0],
    [1, 1, 0],
  ]),
); // 4
console.log(
  shortestPathBinaryMatrix([
    [1, 0, 0],
    [1, 1, 0],
    [1, 1, 0],
  ]),
); // -1
console.log(shortestPathBinaryMatrix([[0]])); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                      | Difficulty | Pattern              |
| -------------------------------------------------------------------------------------------- | ---------- | -------------------- |
| [Rotting Oranges](https://leetcode.com/problems/rotting-oranges)                             | 🟡 Medium  | Multi-source BFS     |
| [Snakes and Ladders](https://leetcode.com/problems/snakes-and-ladders)                       | 🟡 Medium  | BFS on modified grid |
| [Shortest Path to Get All Keys](https://leetcode.com/problems/shortest-path-to-get-all-keys) | 🔴 Hard    | BFS + bitmask        |
| [01 Matrix](https://leetcode.com/problems/01-matrix)                                         | 🟡 Medium  | Multi-source BFS     |
