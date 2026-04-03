---
layout: page
title: "Island Perimeter"
difficulty: Easy
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/island-perimeter"
---

# Island Perimeter / Chu Vi Hòn Đảo

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Mỗi ô đất đóng góp 4 cạnh vào chu vi. Nhưng mỗi cạnh chung giữa hai ô đất liền kề làm giảm chu vi đi 2 (mỗi phía mất 1 cạnh). Công thức: `chu vi = 4 × số ô đất - 2 × số cặp liền kề`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Island Perimeter example:**

```
grid:
0 1 0 0
1 1 1 0
0 1 0 0
0 1 0 0

Land cells = 5
Adjacencies (shared edges between two land cells):
  (0,1)-(1,1), (1,0)-(1,1), (1,1)-(1,2), (1,1)-(2,1), (2,1)-(3,1) = 5 pairs

Perimeter = 4×5 - 2×5 = 20 - 10 = 10  ✓
Alternative: count exposed edges per cell = 12
```

---

---

## Problem Description

| Problem                                                                                 | Difficulty | Key Idea                |
| --------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| [Max Area of Island 695](https://leetcode.com/problems/max-area-of-island)              | Medium     | BFS/DFS area counting   |
| [Count Sub Islands 1905](https://leetcode.com/problems/count-sub-islands)               | Medium     | BFS island membership   |
| [Number of Closed Islands 1254](https://leetcode.com/problems/number-of-closed-islands) | Medium     | BFS/DFS avoid border    |
| [Number of Islands 200](https://leetcode.com/problems/number-of-islands)                | Medium     | BFS/DFS component count |

---

## 📝 Interview Tips

- 🔑 **EN:** Formula: perimeter = 4*land - 2*shared_edges is O(m*n) one-pass | **VI:** Công thức 4*đất - 2*cạnh_chung, một lần duyệt O(m*n)
- 🔑 **EN:** Only check right and down neighbors to avoid double-counting pairs | **VI:** Chỉ kiểm tra phải và dưới để tránh đếm trùng
- 🔑 **EN:** Alternative: for each land cell count exposed edges (4 - num_land_neighbors) | **VI:** Cách khác: đếm cạnh lộ = 4 - số hàng xóm là đất
- 🔑 **EN:** DFS/BFS also works but O(m\*n) with overhead — formula is simpler | **VI:** DFS/BFS cũng được nhưng công thức đơn giản hơn
- 🔑 **EN:** Problem guarantees exactly one island (no holes) | **VI:** Bài đảm bảo đúng một hòn đảo không có lỗ
- 🔑 **EN:** Edge cells bordering grid boundary already don't have a neighbor there | **VI:** Ô biên lưới tự nhiên không có hàng xóm

---

---

## Solutions

```typescript
/**
 * Formula: 4*land - 2*shared_edges (one pass)
 * Time: O(m*n)  Space: O(1)
 */
function islandPerimeter(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  let land = 0,
    shared = 0;

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1) {
        land++;
        // Only check right and down to avoid double-counting
        if (c + 1 < n && grid[r][c + 1] === 1) shared++;
        if (r + 1 < m && grid[r + 1][c] === 1) shared++;
      }
    }
  }

  return 4 * land - 2 * shared;
}

// Test cases
console.log(
  islandPerimeter([
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 1, 0, 0],
    [1, 1, 0, 0],
  ]),
); // 16
console.log(islandPerimeter([[1]])); // 4
console.log(islandPerimeter([[1, 0]])); // 4
console.log(
  islandPerimeter([
    [1, 1],
    [1, 1],
  ]),
); // 8

/**
 * Per-cell exposed edges count — equally clean
 * Time: O(m*n)  Space: O(1)
 */
function islandPerimeterV2(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let perimeter = 0;

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] !== 1) continue;
      // Each exposed edge (no neighbor or out-of-bounds) contributes 1
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n || grid[nr][nc] === 0) {
          perimeter++;
        }
      }
    }
  }

  return perimeter;
}

console.log(
  islandPerimeterV2([
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 1, 0, 0],
    [1, 1, 0, 0],
  ]),
); // 16
console.log(islandPerimeterV2([[1]])); // 4

/**
 * DFS approach — traverse island from first land cell
 * Time: O(m*n)  Space: O(m*n) recursion stack
 */
function islandPerimeterDFS(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const dfs = (r: number, c: number): number => {
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] === 0) return 1;
    if (visited[r][c]) return 0;
    visited[r][c] = true;
    let p = 0;
    for (const [dr, dc] of dirs) p += dfs(r + dr, c + dc);
    return p;
  };

  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (grid[r][c] === 1) return dfs(r, c);

  return 0;
}

console.log(
  islandPerimeterDFS([
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 1, 0, 0],
    [1, 1, 0, 0],
  ]),
); // 16
```

---

## 🔗 Related Problems

| Problem                                                                                 | Difficulty | Key Idea                |
| --------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| [Max Area of Island 695](https://leetcode.com/problems/max-area-of-island)              | Medium     | BFS/DFS area counting   |
| [Count Sub Islands 1905](https://leetcode.com/problems/count-sub-islands)               | Medium     | BFS island membership   |
| [Number of Closed Islands 1254](https://leetcode.com/problems/number-of-closed-islands) | Medium     | BFS/DFS avoid border    |
| [Number of Islands 200](https://leetcode.com/problems/number-of-islands)                | Medium     | BFS/DFS component count |
