---
layout: page
title: "Coloring A Border"
difficulty: Medium
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/coloring-a-border"
---

# Coloring A Border / Tô Màu Viền

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Tìm thành phần liên thông chứa ô (row, col). Một ô là "viền" nếu nó nằm ở rìa lưới HOẶC có ít nhất một hàng xóm không cùng thành phần. Chỉ tô màu các ô viền — nội tâm giữ nguyên.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Coloring A Border example:**

```
grid=[[1,1],[1,2]]  (row=0,col=0)  color=3
Connected component of (0,0): {(0,0),(0,1),(1,0)}  (all 1s reachable)

Border cells:
  (0,0): edge of grid → border ✓
  (0,1): right neighbor (1,1) is value 2, not in component → border ✓
  (1,0): bottom edge of grid → border ✓
  (1,1): value 2, not in component → skip

Result: color (0,0),(0,1),(1,0) with 3 → [[3,3],[3,2]]
```

---

---

## Problem Description

| Problem                                                                    | Difficulty | Key Idea                       |
| -------------------------------------------------------------------------- | ---------- | ------------------------------ |
| [Flood Fill 733](https://leetcode.com/problems/flood-fill)                 | Easy       | BFS/DFS color all connected    |
| [Number of Islands 200](https://leetcode.com/problems/number-of-islands)   | Medium     | BFS/DFS connected components   |
| [Max Area of Island 695](https://leetcode.com/problems/max-area-of-island) | Medium     | BFS component size             |
| [Surrounded Regions 130](https://leetcode.com/problems/surrounded-regions) | Medium     | BFS from border, mark interior |

---

## 📝 Interview Tips

- 🔑 **EN:** Step 1: BFS/DFS from (row,col) to collect all cells with same original color | **VI:** BFS/DFS để tìm tất cả ô cùng màu kết nối
- 🔑 **EN:** Step 2: border cell = in component AND (at grid edge OR has out-of-component neighbor) | **VI:** Ô viền = trong thành phần VÀ (ở rìa lưới HOẶC có hàng xóm ngoài thành phần)
- 🔑 **EN:** Color ONLY border cells — interior cells keep original color | **VI:** Chỉ tô viền — ô bên trong giữ màu gốc
- 🔑 **EN:** Use visited set to avoid reprocessing; original grid value as component membership check | **VI:** Dùng visited set, kiểm tra màu gốc để xác định thành phần
- 🔑 **EN:** Don't modify grid during BFS — color after collecting component | **VI:** Không đổi màu khi đang BFS — tô sau khi thu thập xong
- 🔑 **EN:** Edge case: if color == original color, still need to apply (grid may look same) | **VI:** Dù màu mới = màu cũ vẫn phải xử lý đúng

---

---

## Solutions

```typescript
/**
 * BFS: collect connected component, then color border cells
 * Time: O(m*n)  Space: O(m*n)
 */
function colorBorder(grid: number[][], row: number, col: number, color: number): number[][] {
  const m = grid.length,
    n = grid[0].length;
  const origColor = grid[row][col];
  const component = new Set<number>();
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // BFS to find all cells in connected component
  const queue: [number, number][] = [[row, col]];
  component.add(row * n + col);

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      const key = nr * n + nc;
      if (
        nr >= 0 &&
        nr < m &&
        nc >= 0 &&
        nc < n &&
        !component.has(key) &&
        grid[nr][nc] === origColor
      ) {
        component.add(key);
        queue.push([nr, nc]);
      }
    }
  }

  // Identify border cells and color them
  for (const key of component) {
    const r = Math.floor(key / n),
      c = key % n;
    const isBorder =
      r === 0 ||
      r === m - 1 ||
      c === 0 ||
      c === n - 1 ||
      dirs.some(([dr, dc]) => {
        const nr = r + dr,
          nc = c + dc;
        return !component.has(nr * n + nc);
      });
    if (isBorder) grid[r][c] = color;
  }

  return grid;
}

// Test cases
console.log(
  colorBorder(
    [
      [1, 1],
      [1, 2],
    ],
    0,
    0,
    3,
  ),
); // [[3,3],[3,2]]
console.log(
  colorBorder(
    [
      [1, 2, 2],
      [2, 3, 2],
    ],
    0,
    1,
    3,
  ),
); // [[1,3,3],[2,3,3]]
console.log(
  colorBorder(
    [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    1,
    1,
    2,
  ),
); // border 2, interior 1

/**
 * DFS variant — same logic, recursive traversal
 * Time: O(m*n)  Space: O(m*n) recursion stack
 */
function colorBorderDFS(grid: number[][], row: number, col: number, color: number): number[][] {
  const m = grid.length,
    n = grid[0].length;
  const origColor = grid[row][col];
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  const component: [number, number][] = [];
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const dfs = (r: number, c: number): void => {
    visited[r][c] = true;
    component.push([r, c]);
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (
        nr >= 0 &&
        nr < m &&
        nc >= 0 &&
        nc < n &&
        !visited[nr][nc] &&
        grid[nr][nc] === origColor
      ) {
        dfs(nr, nc);
      }
    }
  };

  dfs(row, col);

  for (const [r, c] of component) {
    const isBorder =
      r === 0 ||
      r === m - 1 ||
      c === 0 ||
      c === n - 1 ||
      dirs.some(([dr, dc]) => {
        const nr = r + dr,
          nc = c + dc;
        return nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc];
      });
    if (isBorder) grid[r][c] = color;
  }

  return grid;
}

console.log(
  colorBorderDFS(
    [
      [1, 1],
      [1, 2],
    ],
    0,
    0,
    3,
  ),
); // [[3,3],[3,2]]
```

---

## 🔗 Related Problems

| Problem                                                                    | Difficulty | Key Idea                       |
| -------------------------------------------------------------------------- | ---------- | ------------------------------ |
| [Flood Fill 733](https://leetcode.com/problems/flood-fill)                 | Easy       | BFS/DFS color all connected    |
| [Number of Islands 200](https://leetcode.com/problems/number-of-islands)   | Medium     | BFS/DFS connected components   |
| [Max Area of Island 695](https://leetcode.com/problems/max-area-of-island) | Medium     | BFS component size             |
| [Surrounded Regions 130](https://leetcode.com/problems/surrounded-regions) | Medium     | BFS from border, mark interior |
