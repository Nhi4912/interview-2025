---
layout: page
title: "K Highest Ranked Items Within a Price Range"
difficulty: Medium
category: Tree-Graph
tags: [Array, Breadth-First Search, Sorting, Heap (Priority Queue), Matrix]
leetcode_url: "https://leetcode.com/problems/k-highest-ranked-items-within-a-price-range"
---

# K Highest Ranked Items Within a Price Range / K Hàng Xếp Hạng Cao Nhất Trong Khoảng Giá

🟡 Medium | BFS from Start + Sort by Rank Criteria | [LeetCode 2146](https://leetcode.com/problems/k-highest-ranked-items-within-a-price-range)

---

## 🧠 Intuition / Trực giác

**Vietnamese:** Từ vị trí xuất phát, BFS lan ra để tìm tất cả hàng hoá có giá trong khoảng [low, high]. Mỗi hàng hoá có "rank" theo thứ tự ưu tiên: (1) khoảng cách gần nhất, (2) giá thấp hơn, (3) hàng nhỏ hơn, (4) cột nhỏ hơn. Sắp xếp rồi lấy k đầu.

```
grid=[[1,2,0,1],[1,3,4,2],[2,3,1,1],[4,0,3,2]]
pricing=[2,5]  start=[0,0]  k=3

BFS from (0,0):
  dist=0: (0,0) val=1 → not in range
  dist=1: (0,1) val=2 ✓, (1,0) val=1 → skip
  dist=2: (0,2)=0 wall, (1,1)=3 ✓, (2,0)=2 ✓
  dist=3: (1,2)=4 ✓, (2,1)=3 ✓, (3,0)=4 ✓, ...

Sort by (dist, price, row, col) → pick top 3
```

---

## 📝 Interview Tips / Gợi ý phỏng vấn

- 🔑 **EN:** BFS naturally gives minimum distance from start | **VI:** BFS tự động cho khoảng cách tối thiểu
- 🔑 **EN:** 0 = wall (impassable), 1 = empty (no item), 2+ = item with price | **VI:** 0 là tường, 1 là ô trống, ≥2 là hàng hoá
- 🔑 **EN:** Collect all reachable items in price range, then sort by (distance, price, row, col) | **VI:** Thu thập hàng trong tầm, sắp xếp theo 4 tiêu chí
- 🔑 **EN:** Don't need a heap — collect all then sort is simpler and O(items log items) | **VI:** Không cần heap — thu thập rồi sort đơn giản hơn
- 🔑 **EN:** Start cell itself counts if it has an item in range | **VI:** Ô xuất phát cũng tính nếu có hàng trong khoảng giá
- 🔑 **EN:** Result size may be less than k if fewer items in range | **VI:** Kết quả có thể ít hơn k nếu không đủ hàng

---

## 💡 Solutions / Giải pháp

```typescript
/**
 * BFS + Sort by rank criteria
 * Time: O(m*n * log(m*n))  Space: O(m*n)
 */
function highestRankedKItems(
  grid: number[][],
  pricing: number[],
  start: number[],
  k: number,
): number[][] {
  const m = grid.length,
    n = grid[0].length;
  const [low, high] = pricing;
  const [sr, sc] = start;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const items: [number, number, number, number][] = []; // [dist, price, row, col]
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  const queue: [number, number, number][] = [[sr, sc, 0]]; // [row, col, dist]
  visited[sr][sc] = true;

  while (queue.length > 0) {
    const [r, c, dist] = queue.shift()!;
    const val = grid[r][c];

    // Add item if price in range
    if (val >= low && val <= high) items.push([dist, val, r, c]);

    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc] && grid[nr][nc] !== 0) {
        visited[nr][nc] = true;
        queue.push([nr, nc, dist + 1]);
      }
    }
  }

  // Sort by (distance ASC, price ASC, row ASC, col ASC)
  items.sort((a, b) =>
    a[0] !== b[0]
      ? a[0] - b[0]
      : a[1] !== b[1]
        ? a[1] - b[1]
        : a[2] !== b[2]
          ? a[2] - b[2]
          : a[3] - b[3],
  );

  return items.slice(0, k).map(([, , r, c]) => [r, c]);
}

// Test cases
console.log(
  highestRankedKItems(
    [
      [1, 2, 0, 1],
      [1, 3, 4, 2],
      [2, 3, 1, 1],
      [4, 0, 3, 2],
    ],
    [2, 3],
    [0, 0],
    3,
  ),
); // [[2,1],[1,1],[2,0]]
console.log(
  highestRankedKItems(
    [
      [1, 2, 0, 1],
      [1, 3, 4, 2],
      [2, 3, 1, 1],
      [4, 0, 3, 2],
    ],
    [2, 3],
    [0, 0],
    1,
  ),
); // [[2,1]]
```

```typescript
/**
 * Same approach — slightly more readable with named type
 * Time: O(m*n * log(m*n))  Space: O(m*n)
 */
type Item = { dist: number; price: number; row: number; col: number };

function highestRankedKItemsV2(
  grid: number[][],
  pricing: number[],
  start: number[],
  k: number,
): number[][] {
  const m = grid.length,
    n = grid[0].length;
  const [low, high] = pricing;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const items: Item[] = [];
  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(-1));
  const queue: [number, number][] = [[start[0], start[1]]];
  dist[start[0]][start[1]] = 0;

  while (queue.length) {
    const [r, c] = queue.shift()!;
    const d = dist[r][c];
    const price = grid[r][c];

    if (price >= low && price <= high) items.push({ dist: d, price, row: r, col: c });

    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && dist[nr][nc] === -1 && grid[nr][nc] !== 0) {
        dist[nr][nc] = d + 1;
        queue.push([nr, nc]);
      }
    }
  }

  items.sort((a, b) => a.dist - b.dist || a.price - b.price || a.row - b.row || a.col - b.col);

  return items.slice(0, k).map((item) => [item.row, item.col]);
}

console.log(
  highestRankedKItemsV2(
    [
      [1, 2, 0, 1],
      [1, 3, 4, 2],
      [2, 3, 1, 1],
      [4, 0, 3, 2],
    ],
    [2, 3],
    [0, 0],
    3,
  ),
); // [[2,1],[1,1],[2,0]]
```

---

## 🔗 Related Problems / Bài liên quan

| Problem                                                                                                     | Difficulty | Key Idea                  |
| ----------------------------------------------------------------------------------------------------------- | ---------- | ------------------------- |
| [Nearest Exit from Entrance in Maze 1926](https://leetcode.com/problems/nearest-exit-from-entrance-in-maze) | Medium     | BFS shortest path in grid |
| [Shortest Path in Binary Matrix 1091](https://leetcode.com/problems/shortest-path-in-binary-matrix)         | Medium     | BFS with obstacle         |
| [As Far From Land as Possible 1162](https://leetcode.com/problems/as-far-from-land-as-possible)             | Medium     | Multi-source BFS          |
| [Kth Largest Element in Array 215](https://leetcode.com/problems/kth-largest-element-in-an-array)           | Medium     | Heap / Quickselect        |
