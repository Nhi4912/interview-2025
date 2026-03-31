---
layout: page
title: "Flood Fill"
difficulty: Easy
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/flood-fill"
---

# Flood Fill / Tô Màu Vùng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Max Area of Island](https://leetcode.com/problems/max-area-of-island) | [Making A Large Island](https://leetcode.com/problems/making-a-large-island)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như công cụ "Paint Bucket" trong MS Paint — click vào một điểm, màu lan ra tất cả ô liền kề cùng màu. DFS đi sâu từng nhánh, BFS lan ra đều theo từng lớp.

**Pattern Recognition:**

- Signal: "fill connected region" + "4-directional spread" → **DFS or BFS on grid**
- Start from `(sr, sc)`, replace all reachable cells with same original color
- Key insight: If `newColor == originalColor`, return early to avoid infinite loop

**Visual — Flood fill example:**

```
image:                    after floodFill(1,1, 2):
1 1 1                     2 2 2
1 1 0    sr=1,sc=1        2 2 0
1 0 1    color=2          2 0 1

DFS from (1,1) [color=1]:
  → (0,1)→(0,0)→(0,2) [all 1]
  → (1,0)→(2,0)       [all 1]
  → (1,1) already visited
Stop at 0-borders and non-1 cells
```

---

## Problem Description

Given a 2D grid `image` representing an image, a starting pixel `(sr, sc)`, and a new color `color`, perform a flood fill starting from `(sr, sc)`: change the color of all pixels connected 4-directionally to the starting pixel that have the same original color, then return the modified image.

- Example 1: `image=[[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2` → `[[2,2,2],[2,2,0],[2,0,1]]`
- Example 2: `image=[[0,0,0],[0,0,0]], sr=0, sc=0, color=0` → same image (color already 0)

Constraints: `1 <= m, n <= 50`, `0 <= image[i][j], color <= 65535`.

---

## 📝 Interview Tips

1. **Clarify**: "Kết nối 4 chiều hay 8 chiều? (thường là 4)" / 4-directional (up/down/left/right) is standard
2. **Early exit**: "Nếu newColor == originalColor → return ngay, tránh vòng lặp vô hạn" / Must check this or DFS loops forever
3. **DFS vs BFS**: "DFS đơn giản hơn cho flood fill; BFS tốt hơn nếu cần level info" / DFS simpler to implement here
4. **In-place**: "Sửa trực tiếp image — không cần visited array nếu check màu gốc đúng cách" / Modify in-place; original color check prevents revisit
5. **Edge cases**: "sr/sc nằm ngoài biên? image một ô? newColor trùng originalColor?" / Boundary start, 1x1 grid, same color
6. **Follow-up**: "8-direction fill? Thêm 4 diagonal directions vào dirs array" / Just extend dirs to 8 elements

---

## Solutions

```typescript
/**
 * Solution 1: DFS Recursive — simple and elegant
 * Time: O(M*N) — visit each cell at most once
 * Space: O(M*N) — recursion stack depth
 */
function floodFillDFS(image: number[][], sr: number, sc: number, color: number): number[][] {
  const originalColor = image[sr][sc];
  if (originalColor === color) return image;

  function dfs(r: number, c: number): void {
    if (r < 0 || r >= image.length || c < 0 || c >= image[0].length) return;
    if (image[r][c] !== originalColor) return;
    image[r][c] = color;
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  dfs(sr, sc);
  return image;
}

/**
 * Solution 2: BFS — iterative, avoids stack overflow on large grids
 * Time: O(M*N) — each cell enqueued at most once
 * Space: O(M*N) — queue size
 */
function floodFill(image: number[][], sr: number, sc: number, color: number): number[][] {
  const originalColor = image[sr][sc];
  if (originalColor === color) return image;

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const queue: [number, number][] = [[sr, sc]];
  image[sr][sc] = color;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (
        nr >= 0 &&
        nr < image.length &&
        nc >= 0 &&
        nc < image[0].length &&
        image[nr][nc] === originalColor
      ) {
        image[nr][nc] = color;
        queue.push([nr, nc]);
      }
    }
  }

  return image;
}

// === Test Cases ===
console.log(
  floodFill(
    [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
    ],
    1,
    1,
    2,
  ),
);
// [[2,2,2],[2,2,0],[2,0,1]]
console.log(
  floodFill(
    [
      [0, 0, 0],
      [0, 0, 0],
    ],
    0,
    0,
    0,
  ),
);
// [[0,0,0],[0,0,0]] — no change (same color)
console.log(floodFill([[0]], 0, 0, 5));
// [[5]]
console.log(
  floodFill(
    [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
    ],
    0,
    0,
    3,
  ),
);
// [[3,3,3],[3,3,0],[3,0,1]]
```

---

## 🔗 Related Problems

- [Max Area of Island](https://leetcode.com/problems/max-area-of-island) — DFS on grid counting connected cells
- [Making A Large Island](https://leetcode.com/problems/making-a-large-island) — flood fill + island merging
- [Surrounded Regions](https://leetcode.com/problems/surrounded-regions) — DFS/BFS from border to mark safe cells
- [Number of Islands](https://leetcode.com/problems/number-of-islands) — count connected components in grid
