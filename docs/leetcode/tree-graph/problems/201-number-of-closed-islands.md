---
layout: page
title: "Number of Closed Islands"
difficulty: Medium
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Union Find, Matrix]
leetcode_url: "https://leetcode.com/problems/number-of-closed-islands"
---

# number of closed islands

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Vietnamese analogy:** Đảo "đóng" là đảo không chạm biên. Trick hay: trước tiên nhấn chìm (flood-fill) tất cả đảo chạm biên. Sau đó đếm các vùng `0` còn lại — đó là đảo đóng.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
Grid (0=land, 1=water):
1 1 1 1 1
1 0 0 0 1    ← Closed island (doesn't touch border)
1 0 1 0 1
1 0 0 0 1
1 1 1 1 1

Answer: 1
```

---

---

## Problem Description

Given a binary matrix `grid` where `0` = land and `1` = water, return the number of **closed islands** — islands (connected `0`s) completely surrounded by `1`s, **not** touching any border cell.

**Example:**

- Input: `grid = [[1,1,1,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,1,1,1,1]]`
- Output: `2`

**Constraints:** `1 <= m, n <= 100`

---

---

## 📝 Interview Tips

- 🔑 **Two-pass trick:** flood-fill border-touching `0`s first, then count remaining islands
- 🔑 A closed island = connected component of `0`s entirely surrounded by `1`s
- 🔑 DFS/BFS flood-fill from each border `0`, marking them as `1`
- ⚠️ Different from standard "number of islands" — here border islands don't count
- ⚠️ Note `0`=land, `1`=water — opposite of many island problems!
- 💡 Single-pass also works: DFS returns `false` if it touches the border during exploration

---

---

## Solutions

```typescript
function closedIsland(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;

  function fill(r: number, c: number): void {
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== 0) return;
    grid[r][c] = 1; // Flood with water
    fill(r + 1, c);
    fill(r - 1, c);
    fill(r, c + 1);
    fill(r, c - 1);
  }

  // Step 1: Flood all border-touching land
  for (let r = 0; r < m; r++) {
    fill(r, 0);
    fill(r, n - 1);
  }
  for (let c = 0; c < n; c++) {
    fill(0, c);
    fill(m - 1, c);
  }

  // Step 2: Count remaining closed islands
  let count = 0;
  for (let r = 1; r < m - 1; r++) {
    for (let c = 1; c < n - 1; c++) {
      if (grid[r][c] === 0) {
        fill(r, c);
        count++;
      }
    }
  }

  return count;
}

function closedIslandSinglePass(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  let count = 0;

  function dfs(r: number, c: number): boolean {
    if (r < 0 || r >= m || c < 0 || c >= n) return false; // Hit border → not closed
    if (grid[r][c] === 1) return true; // Water → OK boundary
    grid[r][c] = 1; // Mark visited

    const top = dfs(r - 1, c);
    const bottom = dfs(r + 1, c);
    const left = dfs(r, c - 1);
    const right = dfs(r, c + 1);

    return top && bottom && left && right; // All 4 directions must be enclosed
  }

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 0 && dfs(r, c)) {
        count++;
      }
    }
  }

  return count;
}

function closedIslandUF(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const total = m * n;
  const parent = Array.from({ length: total + 1 }, (_, i) => i);
  const borderNode = total; // Virtual node for border

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x: number, y: number): void {
    parent[find(x)] = find(y);
  }

  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 0) {
        const id = r * n + c;
        if (r === 0 || r === m - 1 || c === 0 || c === n - 1) union(id, borderNode);
        for (const [dr, dc] of dirs) {
          const nr = r + dr,
            nc = c + dc;
          if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 0) {
            union(id, nr * n + nc);
          }
        }
      }
    }
  }

  const roots = new Set<number>();
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 0) {
        const root = find(r * n + c);
        if (root !== find(borderNode)) roots.add(root);
      }
    }
  }
  return roots.size;
}
```

---

## 🔗 Related Problems

| #    | Problem            | Difficulty | Tags            |
| ---- | ------------------ | ---------- | --------------- |
| 200  | Number of Islands  | 🟡 Medium  | DFS, BFS        |
| 130  | Surrounded Regions | 🟡 Medium  | DFS, Union Find |
| 695  | Max Area of Island | 🟡 Medium  | DFS, BFS        |
| 1905 | Count Sub Islands  | 🟡 Medium  | DFS, BFS        |
