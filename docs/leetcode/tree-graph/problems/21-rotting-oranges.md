---
layout: page
title: "Rotting Oranges"
difficulty: Medium
category: Tree-Graph
tags: [Array, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/rotting-oranges"
---

# Rotting Oranges / Cam Thối

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Multi-source BFS
> **Frequency**: ⭐ Tier 2 — Gặp ở 25+ companies

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống như tin đồn lan truyền trong lớp học — nhiều bạn cùng bắt đầu kể một lúc. Sau 1 phút, những bạn ngồi cạnh họ biết. Sau 2 phút, lan thêm. Multi-source BFS = nhiều điểm xuất phát cùng lúc, mỗi vòng lặp = 1 phút trôi qua.

**Pattern Recognition:**

- Signal: "minimum time to spread/infect" + "grid/matrix" → **Multi-source BFS**
- Khởi tạo queue với TẤT CẢ nguồn cùng lúc (không phải từng nguồn riêng)
- Mỗi level của BFS = 1 đơn vị thời gian
- Sau BFS, nếu còn fresh orange → return -1

**Visual — grid = [[2,1,1],[1,1,0],[0,1,1]]:**

```
Initial:          Minute 1:         Minute 2:         Minute 3:
[2, 1, 1]        [2, 2, 1]        [2, 2, 2]        [2, 2, 2]
[1, 1, 0]   →   [2, 1, 0]   →   [2, 2, 0]   →   [2, 2, 0]
[0, 1, 1]        [0, 1, 1]        [0, 2, 1]        [0, 2, 2]

Queue init: [(0,0)]
Min 1: spread to (0,1),(1,0)       fresh=4→2
Min 2: spread to (0,2),(1,1)       fresh=2→0 + (2,1)  fresh=1
Min 3: spread to (2,2)             fresh=0 ✅

Answer: 4 minutes ✅
```

---

## Problem Description

Cho lưới `m x n` với 3 loại ô: `0` (trống), `1` (cam tươi), `2` (cam thối). Mỗi phút, cam thối lây sang 4 ô lân cận. Trả về số phút tối thiểu để tất cả cam tươi thối đi, hoặc `-1` nếu không thể. ([LeetCode 994](https://leetcode.com/problems/rotting-oranges))

Difficulty: Medium | Acceptance: 56.6%

```
Example 1: [[2,1,1],[1,1,0],[0,1,1]] → 4
Example 2: [[2,1,1],[0,1,1],[1,0,1]] → -1  (cam góc dưới trái bị cô lập)
Example 3: [[0,2]]                   → 0   (không có cam tươi)
```

Constraints:

- `m == grid.length`, `n == grid[i].length`
- `1 <= m, n <= 10`
- `grid[i][j]` là 0, 1, hoặc 2

---

## 📝 Interview Tips

1. **Clarify**: "Grid có cam tươi nào không? Grid toàn 0?" / Any fresh oranges? All-empty grid?
2. **Multi-source**: "Thêm TẤT CẢ cam thối vào queue ngay từ đầu — không chạy BFS riêng từng cái" / Add ALL rotten oranges to queue at start, not separate BFS per orange
3. **Count fresh**: "Đếm fresh trước, decrement khi lây — cuối BFS nếu fresh > 0 thì return -1" / Count fresh upfront, decrement on spread, return -1 if any remain
4. **Level tracking**: "Dùng `queue.length` snapshot mỗi vòng để đếm minutes, hoặc lưu time trong queue" / Snapshot queue size each round to count levels
5. **Edge case**: "Grid không có cam tươi → return 0 ngay" / No fresh oranges → return 0 immediately
6. **Follow-up**: "Nếu có thêm cam không thể bị lây?" / What if some fresh oranges are immune?

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force (Simulation)
 * Name: Round-by-Round Simulation
 * Time: O((m*n)²) — each round scans entire grid
 * Space: O(m*n)
 */
function rottingOrangesBrute(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const g = grid.map((r) => [...r]);
  let minutes = 0;

  while (true) {
    const toRot: [number, number][] = [];
    for (let r = 0; r < m; r++)
      for (let c = 0; c < n; c++)
        if (g[r][c] === 2)
          for (const [dr, dc] of [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
          ])
            if (r + dr >= 0 && r + dr < m && c + dc >= 0 && c + dc < n && g[r + dr][c + dc] === 1)
              toRot.push([r + dr, c + dc]);
    if (toRot.length === 0) break;
    toRot.forEach(([r, c]) => {
      g[r][c] = 2;
    });
    minutes++;
  }

  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (g[r][c] === 1) return -1;

  return minutes;
}

/**
 * Solution 2: Multi-source BFS  ← OPTIMAL
 * Name: Multi-source BFS
 * Time: O(m*n) — each cell visited once
 * Space: O(m*n) — queue
 */
function orangesRotting(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const queue: [number, number][] = [];
  let fresh = 0;

  // Collect all rotten oranges and count fresh
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }

  if (fresh === 0) return 0;

  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let minutes = 0;
  let head = 0; // use pointer for O(1) dequeue

  while (head < queue.length) {
    const size = queue.length - head;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue[head++];
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          fresh--;
          queue.push([nr, nc]);
        }
      }
    }
    minutes++;
  }

  return fresh === 0 ? minutes - 1 : -1;
}

// === Test Cases ===
console.log(
  orangesRotting([
    [2, 1, 1],
    [1, 1, 0],
    [0, 1, 1],
  ]),
); // 4
console.log(
  orangesRotting([
    [2, 1, 1],
    [0, 1, 1],
    [1, 0, 1],
  ]),
); // -1
console.log(orangesRotting([[0, 2]])); // 0
console.log(orangesRotting([[1]])); // -1
console.log(orangesRotting([[2]])); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                    | Relationship                 |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------- |
| [01 Matrix](https://leetcode.com/problems/01-matrix)                                                       | Multi-source BFS from all 0s |
| [Walls and Gates](https://leetcode.com/problems/walls-and-gates)                                           | Multi-source BFS from gates  |
| [Shortest Distance from All Buildings](https://leetcode.com/problems/shortest-distance-from-all-buildings) | BFS from multiple sources    |
| [Snakes and Ladders](https://leetcode.com/problems/snakes-and-ladders)                                     | BFS for minimum moves        |
| [Max Area of Island](https://leetcode.com/problems/max-area-of-island)                                     | Grid traversal pattern       |
