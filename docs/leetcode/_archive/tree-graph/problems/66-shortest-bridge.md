---
layout: page
title: "Shortest Bridge"
difficulty: Medium
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/shortest-bridge"
---

# Shortest Bridge / Cầu Ngắn Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS + BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Max Area of Island](https://leetcode.com/problems/max-area-of-island) | [Making A Large Island](https://leetcode.com/problems/making-a-large-island)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như hai hòn đảo trên biển — bạn đứng ở đảo thứ nhất và muốn xây cầu ngắn nhất sang đảo thứ hai. Trước tiên khám phá toàn bộ đảo 1 bằng DFS, rồi BFS mở rộng "sóng nước" từ bờ đảo 1 ra cho đến khi chạm đảo 2.

**Pattern Recognition:**

- Signal: "shortest path" + "two separate components" → **DFS paint + BFS expand**
- Phase 1: DFS tô màu toàn bộ island 1, đẩy tất cả ô vào BFS queue
- Phase 2: BFS mở rộng từng lớp cho đến khi gặp ô `1` của island 2

**Visual:**

```
Grid:          DFS paint island1:    BFS expand:
0 1 0 0        0 A 0 0              wave 1: →→
1 1 0 0   →    A A 0 0   →  queue   wave 2: →→ hits 1!
0 0 0 1        0 0 0 1
0 0 1 1        0 0 1 1
Answer: 2 steps (BFS levels before hitting island 2)
```

---

## Problem Description

Given an `n x n` binary matrix `grid` containing exactly **two islands**, return the **minimum number of 0s** you must flip to connect the two islands. The two islands are guaranteed to exist and be connected 4-directionally.

**Example 1:** `grid = [[0,1],[1,0]]` → `1`
**Example 2:** `grid = [[0,1,0],[0,0,0],[0,0,1]]` → `2`

Constraints: `n == grid.length == grid[i].length`, `2 <= n <= 100`, `grid[i][j]` is `0` or `1`.

---

## 📝 Interview Tips

1. **Clarify**: "Có đúng 2 islands không?" / Confirm exactly two islands exist — the problem guarantees it
2. **Phase separation**: "Tách DFS tìm island 1 và BFS xây cầu ra 2 bước riêng" / Two-phase: paint then expand
3. **BFS init**: "Đẩy toàn bộ island 1 vào queue ngay từ đầu" / Seed BFS with all cells of island 1 simultaneously
4. **Edge cases**: "n=2, islands adjacent → answer 0?" / No — problem guarantees at least one bridge cell needed
5. **Visited**: "Mark island1 cells as 2 để phân biệt với island2" / Use value 2 as visited marker
6. **Follow-up**: "Nếu có nhiều hơn 2 islands?" / Extend to multi-island with Dijkstra between all pairs

---

## Solutions

```typescript
/**
 * Solution 1: DFS (find island1) + BFS (expand to island2)
 * Time: O(N²) — visit every cell at most twice
 * Space: O(N²) — queue and visited state
 */
function shortestBridge(grid: number[][]): number {
  const n = grid.length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const queue: [number, number][] = [];

  // Phase 1: DFS to paint island 1 and seed BFS queue
  function dfs(r: number, c: number): void {
    if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] !== 1) return;
    grid[r][c] = 2; // mark visited
    queue.push([r, c]);
    for (const [dr, dc] of dirs) dfs(r + dr, c + dc);
  }

  // Find first 1 and DFS from it
  outer: for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        dfs(i, j);
        break outer;
      }
    }
  }

  // Phase 2: BFS expanding from island 1
  let steps = 0;
  while (queue.length > 0) {
    const size = queue.length;
    for (let k = 0; k < size; k++) {
      const [r, c] = queue.shift()!;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
        if (grid[nr][nc] === 1) return steps; // reached island 2
        if (grid[nr][nc] === 0) {
          grid[nr][nc] = 2; // mark visited
          queue.push([nr, nc]);
        }
      }
    }
    steps++;
  }
  return -1;
}

// === Test Cases ===
console.log(
  shortestBridge([
    [0, 1],
    [1, 0],
  ]),
); // 1
console.log(
  shortestBridge([
    [0, 1, 0],
    [0, 0, 0],
    [0, 0, 1],
  ]),
); // 2
console.log(
  shortestBridge([
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ]),
); // 1
```

---

## 🔗 Related Problems

| Problem                                                                      | Pattern          | Difficulty |
| ---------------------------------------------------------------------------- | ---------------- | ---------- |
| [Max Area of Island](https://leetcode.com/problems/max-area-of-island)       | DFS flood fill   | 🟡 Medium  |
| [Making A Large Island](https://leetcode.com/problems/making-a-large-island) | DFS + Union Find | 🔴 Hard    |
| [Flood Fill](https://leetcode.com/problems/flood-fill)                       | DFS/BFS matrix   | 🟢 Easy    |
| [Number of Islands](https://leetcode.com/problems/number-of-islands)         | DFS components   | 🟡 Medium  |
| [01 Matrix](https://leetcode.com/problems/01-matrix)                         | Multi-source BFS | 🟡 Medium  |
