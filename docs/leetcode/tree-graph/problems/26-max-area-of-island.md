---
layout: page
title: "Max Area of Island"
difficulty: Medium
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Union Find, Matrix]
leetcode_url: "https://leetcode.com/problems/max-area-of-island"
---

# Max Area of Island / Diện Tích Đảo Lớn Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS / BFS / Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [Number of Islands](https://leetcode.com/problems/number-of-islands) | [Making A Large Island](https://leetcode.com/problems/making-a-large-island)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Tưởng tượng bản đồ biển với các hòn đảo. Mỗi khi gặp ô đất `1`, bạn bơi ra và "flood fill" — đánh dấu toàn bộ đảo đó rồi đếm diện tích. Giống DFS trên cây: thăm nút, rồi đệ quy sang 4 hướng.

**Pattern Recognition:** "Connected components in grid" → DFS/BFS flood fill hoặc Union Find.

```
Grid:           DFS from (0,0):
0 0 1 0 0       → visit (0,2): mark visited, explore 4 dirs
0 1 1 0 0       → area accumulates: 1+1+1+1 = 4
0 1 0 0 0       maxArea = 4
0 0 0 1 1

After flood fill: grid cells → 0 (visited marker)
```

---

## 📋 Problem / Bài Toán

Given a binary matrix `grid` (0=water, 1=land), return the **maximum area** of an island. An island is a group of 1s connected 4-directionally. Return 0 if no island exists.

- Grid with one 4-cell island and one 1-cell island → `4`
- All zeros grid → `0`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Flood fill pattern**: Khi gặp `grid[r][c] === 1`, DFS/BFS từ đó — đánh dấu `0` để tránh đếm lại, cộng dồn diện tích.
- 🔑 **Nhận biết**: "Matrix" + "connected component" + "count" → DFS/BFS; thêm "merge groups" → Union Find.
- ⚡ **DFS vs BFS**: DFS đơn giản hơn code (đệ quy 4 hướng); BFS tránh stack overflow trên grid lớn.
- ⚡ **Union Find**: Tốt khi cần merge islands động (e.g. bài Making a Large Island); overkill cho bài này.
- 🚨 **Bounds check**: Luôn kiểm tra `r >= 0 && r < m && c >= 0 && c < n` trước khi truy cập ô.
- 💡 **In-place marking**: Đặt `grid[r][c] = 0` khi visit thay vì dùng `visited` set — tiết kiệm O(mn) space.

---

## Solutions

### Solution 1 — DFS Flood Fill · O(mn) time · O(mn) space (call stack)

```typescript
/**
 * For each unvisited land cell, DFS to count island area.
 * Mark visited cells as 0 in-place to avoid revisiting.
 * Time: O(m*n) | Space: O(m*n) recursive stack worst case
 */
function maxAreaOfIsland_dfs(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  let maxArea = 0;

  function dfs(r: number, c: number): number {
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] === 0) return 0;
    grid[r][c] = 0; // mark visited
    return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);
  }

  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) if (grid[r][c] === 1) maxArea = Math.max(maxArea, dfs(r, c));

  return maxArea;
}

console.log(
  maxAreaOfIsland_dfs([
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  ]),
); // 6
console.log(maxAreaOfIsland_dfs([[0, 0, 0, 0, 0, 0, 0, 0]])); // 0
```

### Solution 2 — BFS Flood Fill · O(mn) time · O(mn) space

```typescript
/**
 * BFS avoids deep recursion stack. Use queue; expand 4 directions.
 * Time: O(m*n) | Space: O(m*n)
 */
function maxAreaOfIsland_bfs(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let maxArea = 0;

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] !== 1) continue;
      let area = 0;
      const queue: [number, number][] = [[r, c]];
      grid[r][c] = 0;
      while (queue.length) {
        const [cr, cc] = queue.shift()!;
        area++;
        for (const [dr, dc] of dirs) {
          const nr = cr + dr,
            nc = cc + dc;
          if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {
            grid[nr][nc] = 0;
            queue.push([nr, nc]);
          }
        }
      }
      maxArea = Math.max(maxArea, area);
    }
  }
  return maxArea;
}

console.log(
  maxAreaOfIsland_bfs([
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
  ]),
); // 4
```

### Solution 3 — Union Find · O(mn·α) time · O(mn) space

```typescript
/**
 * Union Find with size tracking. Union adjacent 1-cells, track max component size.
 * Time: O(m*n*α) ≈ O(m*n) | Space: O(m*n)
 */
function maxAreaOfIsland(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const parent = Array.from({ length: m * n }, (_, i) => i);
  const size = new Array(m * n).fill(1);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(a: number, b: number): void {
    const ra = find(a),
      rb = find(b);
    if (ra === rb) return;
    if (size[ra] < size[rb]) {
      parent[ra] = rb;
      size[rb] += size[ra];
    } else {
      parent[rb] = ra;
      size[ra] += size[rb];
    }
  }

  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (grid[r][c] === 1) {
        if (r + 1 < m && grid[r + 1][c] === 1) union(r * n + c, (r + 1) * n + c);
        if (c + 1 < n && grid[r][c + 1] === 1) union(r * n + c, r * n + c + 1);
      }

  let maxArea = 0;
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (grid[r][c] === 1) maxArea = Math.max(maxArea, size[find(r * n + c)]);
  return maxArea;
}

console.log(
  maxAreaOfIsland([
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
  ]),
); // 4
console.log(maxAreaOfIsland([[0, 0, 0, 0, 0, 0, 0, 0]])); // 0
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                      | Difficulty | Pattern          |
| ---------------------------------------------------------------------------- | ---------- | ---------------- |
| [Number of Islands](https://leetcode.com/problems/number-of-islands)         | 🟡 Medium  | DFS / Union Find |
| [Making A Large Island](https://leetcode.com/problems/making-a-large-island) | 🔴 Hard    | DFS / Union Find |
| [Count Sub Islands](https://leetcode.com/problems/count-sub-islands)         | 🟡 Medium  | DFS              |
| [Surrounded Regions](https://leetcode.com/problems/surrounded-regions)       | 🟡 Medium  | DFS / BFS        |
