---
layout: page
title: "Pacific Atlantic Water Flow"
difficulty: Medium
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/pacific-atlantic-water-flow"
---

# Pacific Atlantic Water Flow / Dòng Nước Chảy Ra Cả Hai Đại Dương

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Reverse BFS/DFS from borders
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Surrounded Regions](https://leetcode.com/problems/surrounded-regions) | [Number of Islands](https://leetcode.com/problems/number-of-islands)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Thay vì mô phỏng nước chảy từ mỗi ô xuống đại dương (tốn O(M²N²)), hãy "bơm nước ngược" từ đại dương lên — mọi ô mà nước từ Pacific có thể lên đến VÀ nước từ Atlantic có thể lên đến đều là đáp án.

**Pattern Recognition:**

- Signal: "water flows from high to low" + "reach two boundaries" → **Reverse BFS from both borders**
- BFS từ Pacific border (top + left) với điều kiện đi ngược: chỉ đi đến ô cao hơn hoặc bằng
- BFS từ Atlantic border (bottom + right) tương tự
- Giao điểm của hai reachable sets = answer

**Visual — Reverse BFS:**

```
heights:  1 2 2 3 5      Pacific: top row + left col
          3 2 3 4 4      Atlantic: bottom row + right col
          2 4 5 3 1
          6 7 1 4 5      BFS Pacific → pacific[r][c] = true
          5 1 1 2 4      BFS Atlantic → atlantic[r][c] = true
                         Answer: cells where both = true
                         → (0,4),(1,3),(1,4),(2,2),(3,0),(3,1),(4,0)
```

---

## Problem Description

Given an `m×n` integer matrix `heights` representing island elevation, rain water flows to adjacent cells with height ≤ current. Find all cells that can flow to **both** the Pacific ocean (top/left border) and Atlantic ocean (bottom/right border). ([LeetCode #417](https://leetcode.com/problems/pacific-atlantic-water-flow))

**Example 1:** `heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]` → `[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]`
**Example 2:** `heights=[[1]]` → `[[0,0]]`

---

## 📝 Interview Tips

1. **Clarify**: "Nước có thể chảy theo đường chéo không? (Không — chỉ 4 hướng)" / Only 4 directions, not diagonal
2. **Reverse insight**: "Thay vì DFS từ mỗi ô, BFS ngược từ borders — O(MN) thay vì O(M²N²)" / Reverse flow is the key optimization
3. **Two-pass**: "Một lần từ Pacific, một lần từ Atlantic, rồi intersect" / Two separate BFS passes
4. **Condition**: "Đi ngược: chỉ chọn ô kế tiếp có height >= current (nước ngược chiều)" / Reverse: go to higher or equal cells
5. **Edge cases**: "Grid 1x1: luôn là answer; tất cả ô cùng height: tất cả là answer" / Single cell, uniform height
6. **Follow-up**: "Nếu thêm rain mỗi ngày? → dynamic reachability problem" / Dynamic variant

---

## Solutions

```typescript
/**
 * Solution 1: BFS from both borders (Recommended)
 * Time: O(M * N) — each cell processed at most twice
 * Space: O(M * N) — two visited arrays + queue
 */
function pacificAtlanticBFS(heights: number[][]): number[][] {
  const rows = heights.length,
    cols = heights[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function bfs(starts: [number, number][]): boolean[][] {
    const reach = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const queue: [number, number][] = [...starts];
    for (const [r, c] of starts) reach[r][c] = true;
    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          !reach[nr][nc] &&
          heights[nr][nc] >= heights[r][c]
        ) {
          reach[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
    return reach;
  }

  const pacificStarts: [number, number][] = [];
  const atlanticStarts: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    pacificStarts.push([r, 0]);
    atlanticStarts.push([r, cols - 1]);
  }
  for (let c = 0; c < cols; c++) {
    pacificStarts.push([0, c]);
    atlanticStarts.push([rows - 1, c]);
  }

  const pac = bfs(pacificStarts);
  const atl = bfs(atlanticStarts);
  const result: number[][] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) if (pac[r][c] && atl[r][c]) result.push([r, c]);
  return result;
}

/**
 * Solution 2: DFS from borders
 * Time: O(M * N)
 * Space: O(M * N)
 */
function pacificAtlantic(heights: number[][]): number[][] {
  const rows = heights.length,
    cols = heights[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const pac = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const atl = Array.from({ length: rows }, () => new Array(cols).fill(false));

  function dfs(r: number, c: number, visited: boolean[][]): void {
    visited[r][c] = true;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !visited[nr][nc] &&
        heights[nr][nc] >= heights[r][c]
      ) {
        dfs(nr, nc, visited);
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    dfs(r, 0, pac);
    dfs(r, cols - 1, atl);
  }
  for (let c = 0; c < cols; c++) {
    dfs(0, c, pac);
    dfs(rows - 1, c, atl);
  }

  const res: number[][] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) if (pac[r][c] && atl[r][c]) res.push([r, c]);
  return res;
}

// === Test Cases ===
const h = [
  [1, 2, 2, 3, 5],
  [3, 2, 3, 4, 4],
  [2, 4, 5, 3, 1],
  [6, 7, 1, 4, 5],
  [5, 1, 1, 2, 4],
];
console.log(JSON.stringify(pacificAtlantic(h))); // [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
console.log(JSON.stringify(pacificAtlanticBFS(h))); // same
console.log(JSON.stringify(pacificAtlantic([[1]]))); // [[0,0]]
```

---

## 🔗 Related Problems

| Problem                                                                                                  | Difficulty | Pattern                 |
| -------------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| [Number of Islands](https://leetcode.com/problems/number-of-islands)                                     | 🟡 Medium  | DFS/BFS grid            |
| [Surrounded Regions](https://leetcode.com/problems/surrounded-regions)                                   | 🟡 Medium  | Reverse BFS from border |
| [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) | 🔴 Hard    | DFS + memoization       |
| [Max Area of Island](https://leetcode.com/problems/max-area-of-island)                                   | 🟡 Medium  | DFS flood fill          |
