---
layout: page
title: "Cut Off Trees for Golf Event"
difficulty: Hard
category: Tree-Graph
tags: [Array, Breadth-First Search, Heap (Priority Queue), Matrix]
leetcode_url: "https://leetcode.com/problems/cut-off-trees-for-golf-event"
---

# Cut Off Trees for Golf Event / Chặt Cây Theo Thứ Tự Chiều Cao

## Analogy / Tương Tự

> Bạn là người chặt cây trên sân golf. Quy tắc: phải chặt cây theo thứ tự **từ thấp đến cao**. Từ vị trí hiện tại, tìm đường ngắn nhất đến cây tiếp theo, tránh các vật cản (ô = 0). Nếu không thể đến được, trả về -1.

## ASCII Visual

```
Grid:            Sorted trees (height):
[54,  0, 36]     (2,2,1) h=1 → skip (already low)
[26,  0, 18]     BFS: (0,0)→(2,0) = 4 steps
[12, 26,  1]     BFS: (2,0)→(1,2) = 3 steps
                  Total = 7 steps
```

## Problem

Given an `m x n` matrix `forest` where `forest[i][j]` represents a tree height (0=obstacle, 1=flat ground, >1=tree). Starting at `(0,0)`, cut all trees in ascending order of height. Return the minimum total steps, or -1 if impossible.

## Interview Tips

1. **Sort first** — collect all trees with height > 1, sort by height ascending
2. **BFS for each leg** — find shortest path between consecutive positions
3. **Early exit** — if any BFS returns -1, immediately return -1
4. **Start position** — begin at (0,0), move to each tree in order
5. **BFS handles obstacles** — cells with 0 block movement
6. **Time complexity** — O((m·n)² ) worst case: O(m·n) trees × O(m·n) BFS each

## Solutions

### Solution 1: BFS Between Consecutive Trees

```typescript
function cutOffTree(forest: number[][]): number {
  const m = forest.length,
    n = forest[0].length;

  // Collect all trees (height > 1) sorted by height
  const trees: [number, number, number][] = [];
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) if (forest[i][j] > 1) trees.push([forest[i][j], i, j]);
  trees.sort((a, b) => a[0] - b[0]);

  // BFS to find min distance between two points
  function bfs(sr: number, sc: number, tr: number, tc: number): number {
    if (sr === tr && sc === tc) return 0;
    const dirs = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    const visited = Array.from({ length: m }, () => new Array(n).fill(false));
    const queue: [number, number, number][] = [[sr, sc, 0]];
    visited[sr][sc] = true;
    while (queue.length) {
      const [r, c, dist] = queue.shift()!;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
        if (visited[nr][nc] || forest[nr][nc] === 0) continue;
        if (nr === tr && nc === tc) return dist + 1;
        visited[nr][nc] = true;
        queue.push([nr, nc, dist + 1]);
      }
    }
    return -1;
  }

  let total = 0,
    cr = 0,
    cc = 0;
  for (const [, tr, tc] of trees) {
    const steps = bfs(cr, cc, tr, tc);
    if (steps === -1) return -1;
    total += steps;
    cr = tr;
    cc = tc;
  }
  return total;
}

// Tests
console.log(
  cutOffTree([
    [1, 2, 3],
    [0, 0, 4],
    [7, 6, 5],
  ]),
); // 6
console.log(
  cutOffTree([
    [2, 3, 4],
    [0, 0, 5],
    [8, 7, 6],
  ]),
); // 6
console.log(cutOffTree([[0]])); // -1
```

### Solution 2: Hadlock's Algorithm (Fewer Detours, Faster)

```typescript
function cutOffTreeHadlock(forest: number[][]): number {
  const m = forest.length,
    n = forest[0].length;
  const trees: [number, number, number][] = [];
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) if (forest[i][j] > 1) trees.push([forest[i][j], i, j]);
  trees.sort((a, b) => a[0] - b[0]);

  // A* style BFS with Manhattan heuristic
  function minSteps(sr: number, sc: number, tr: number, tc: number): number {
    if (sr === tr && sc === tc) return 0;
    const dirs = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));
    dist[sr][sc] = 0;
    // Simple BFS (Dijkstra not needed - equal weights)
    const queue: [number, number][] = [[sr, sc]];
    let head = 0;
    while (head < queue.length) {
      const [r, c] = queue[head++];
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
        if (forest[nr][nc] === 0 || dist[nr][nc] <= dist[r][c] + 1) continue;
        dist[nr][nc] = dist[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
    return dist[tr][tc] === Infinity ? -1 : dist[tr][tc];
  }

  let total = 0,
    cr = 0,
    cc = 0;
  for (const [, tr, tc] of trees) {
    const steps = minSteps(cr, cc, tr, tc);
    if (steps === -1) return -1;
    total += steps;
    cr = tr;
    cc = tc;
  }
  return total;
}

console.log(
  cutOffTreeHadlock([
    [1, 2, 3],
    [0, 0, 4],
    [7, 6, 5],
  ]),
); // 6
```

## Related Problems

| #    | Problem                                 | Difficulty | Tags        |
| ---- | --------------------------------------- | ---------- | ----------- |
| 675  | Cut Off Trees for Golf Event (original) | Hard       | BFS, Matrix |
| 1091 | Shortest Path in Binary Matrix          | Medium     | BFS         |
| 286  | Walls and Gates                         | Medium     | BFS         |
| 994  | Rotting Oranges                         | Medium     | BFS, Matrix |
