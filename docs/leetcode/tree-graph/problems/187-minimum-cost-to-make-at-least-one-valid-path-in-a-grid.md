---
layout: page
title: "Minimum Cost to Make at Least One Valid Path in a Grid"
difficulty: Hard
category: Tree-Graph
tags: [Array, Breadth-First Search, Graph, Heap (Priority Queue), Matrix]
leetcode_url: "https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid"
---

# Minimum Cost to Make at Least One Valid Path in a Grid / Chi Phí Nhỏ Nhất Tạo Đường Đi Hợp Lệ Trong Lưới

🔴 Hard | 0-1 BFS | Dijkstra

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Mỗi ô có một mũi tên chỉ hướng. Đi theo mũi tên: **miễn phí**. Đổi hướng: **tốn 1 đồng**. Bài toán là tìm đường từ `(0,0)` đến `(m-1,n-1)` với chi phí ít nhất — dùng **0-1 BFS** (deque): cạnh 0 thêm vào đầu, cạnh 1 thêm vào cuối.

```
Grid:  →  ↓  ←
       →  ↑  ←
       ↑  ↑  ←

(0,0)→(0,1) cost=0, (0,1)↓(1,1) cost=0, (1,1)→(1,2)?cost=1
```

**Key insight:** 0-1 BFS on cells. Moving in the arrow's direction costs 0; any other direction costs 1. Use deque: cost-0 edges go to front, cost-1 to back.

## Problem Description

Given an `m x n` grid where each cell has direction `1=right, 2=left, 3=down, 4=up`, return the minimum cost to modify arrows to create a valid path from `(0,0)` to `(m-1,n-1)`. Modifying one arrow costs 1.

**Example 1:**

- Input: `[[1,1,1,1],[2,2,2,2],[1,1,1,1],[2,2,2,2]]`
- Output: `3`

**Example 2:**

- Input: `[[1,1,3],[3,2,2],[1,1,4]]`
- Output: `0`

## 📝 Interview Tips

- **Q: Why 0-1 BFS instead of Dijkstra? / Tại sao dùng 0-1 BFS thay vì Dijkstra?**
  - A: Edge weights are only 0 or 1, deque-based BFS is O(V+E) vs O(V log V) / Trọng số chỉ là 0 hoặc 1, BFS với deque nhanh hơn.
- **Q: How encode directions? / Mã hoá hướng thế nào?**
  - A: 1=right [0,1], 2=left [0,-1], 3=down [1,0], 4=up [-1,0] / Mỗi số tương ứng một vector hướng.
- **Q: Time complexity? / Độ phức tạp?**
  - A: O(m*n) with 0-1 BFS / O(m*n) với 0-1 BFS.
- **Q: Can Dijkstra solve this? / Dijkstra có giải được không?**
  - A: Yes, O(m*n*log(m\*n)) — but 0-1 BFS is optimal / Có, nhưng 0-1 BFS tối ưu hơn.
- **Q: What if grid is 1x1? / Nếu lưới 1x1?**
  - A: Return 0 — already at destination / Trả về 0.
- **Q: Can we modify multiple cells? / Có thể sửa nhiều ô không?**
  - A: Yes, count = number of direction changes needed / Có, đếm số lần cần đổi hướng.

## Solutions

### Solution 1: 0-1 BFS (Optimal)

```typescript
/**
 * Minimum cost path in directional grid using 0-1 BFS.
 * Time: O(m*n)  Space: O(m*n)
 */
function minCost(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  // dir[d] = [dr, dc] for directions 1=R, 2=L, 3=D, 4=U
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  dist[0][0] = 0;

  // Deque: [row, col, cost]
  const deque: [number, number][] = [[0, 0]];

  while (deque.length) {
    const [r, c] = deque.shift()!;
    const curCost = dist[r][c];

    for (let d = 0; d < 4; d++) {
      const [dr, dc] = dirs[d];
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;

      // Cost 0 if following current cell's arrow (1-indexed dir)
      const moveCost = grid[r][c] === d + 1 ? 0 : 1;
      const newCost = curCost + moveCost;

      if (newCost < dist[nr][nc]) {
        dist[nr][nc] = newCost;
        if (moveCost === 0) deque.unshift([nr, nc]);
        else deque.push([nr, nc]);
      }
    }
  }

  return dist[m - 1][n - 1];
}

// Tests
console.log(
  minCost([
    [1, 1, 1, 1],
    [2, 2, 2, 2],
    [1, 1, 1, 1],
    [2, 2, 2, 2],
  ]),
); // 3
console.log(
  minCost([
    [1, 1, 3],
    [3, 2, 2],
    [1, 1, 4],
  ]),
); // 0
console.log(minCost([[1]])); // 0
```

### Solution 2: Dijkstra with Priority Queue

```typescript
/**
 * Minimum cost path using Dijkstra.
 * Time: O(m*n*log(m*n))  Space: O(m*n)
 */
function minCostDijkstra(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  dist[0][0] = 0;

  // Min-heap: [cost, row, col]
  const heap: [number, number, number][] = [[0, 0, 0]];

  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [cost, r, c] = heap.shift()!;
    if (cost > dist[r][c]) continue;
    if (r === m - 1 && c === n - 1) return cost;

    for (let d = 0; d < 4; d++) {
      const [dr, dc] = dirs[d];
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const newCost = cost + (grid[r][c] === d + 1 ? 0 : 1);
      if (newCost < dist[nr][nc]) {
        dist[nr][nc] = newCost;
        heap.push([newCost, nr, nc]);
      }
    }
  }

  return dist[m - 1][n - 1];
}

// Tests
console.log(
  minCostDijkstra([
    [1, 1, 1, 1],
    [2, 2, 2, 2],
    [1, 1, 1, 1],
    [2, 2, 2, 2],
  ]),
); // 3
console.log(
  minCostDijkstra([
    [1, 1, 3],
    [3, 2, 2],
    [1, 1, 4],
  ]),
); // 0
```

## 🔗 Related Problems

| #    | Problem                         | Difficulty | Key Concept  |
| ---- | ------------------------------- | ---------- | ------------ |
| 743  | Network Delay Time              | Medium     | Dijkstra     |
| 1091 | Shortest Path in Binary Matrix  | Medium     | BFS          |
| 1368 | Minimum Cost to Make Valid Path | Hard       | 0-1 BFS      |
| 1584 | Min Cost to Connect All Points  | Medium     | Prim/Kruskal |
