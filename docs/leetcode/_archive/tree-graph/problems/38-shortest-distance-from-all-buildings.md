---
layout: page
title: "Shortest Distance from All Buildings"
difficulty: Hard
category: Tree-Graph
tags: [Array, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/shortest-distance-from-all-buildings"
---

# Shortest Distance from All Buildings / Khoảng Cách Ngắn Nhất Từ Tất Cả Tòa Nhà

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Multi-Source BFS

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như chọn vị trí đặt siêu thị để tổng quãng đường đi bộ từ tất cả các khu nhà là ngắn nhất. Thay vì chạy BFS từ mỗi ô đất trống (có thể hàng nghìn ô), ta chạy BFS **từ mỗi tòa nhà** và cộng dồn khoảng cách vào mỗi ô đất trống. Cuối cùng, ô nào có khoảng cách tổng nhỏ nhất và **tiếp cận được từ tất cả** tòa nhà là đáp án.

**Pattern Recognition:**

- Signal: "find empty cell minimizing total distance to all buildings" → **BFS from each building**
- Key insight: BFS from buildings (few) instead of from empty cells (many) — typically much faster
- Track: `dist[r][c]` = sum of distances from all buildings; `reach[r][c]` = how many buildings can reach it

**Visual — BFS from each building:**

```
Grid:  1 0 2    Buildings at (0,0)=1, (0,2)=2, (2,2)=1
       0 0 0
       0 0 1

BFS from (0,0):        BFS from (0,2):        BFS from (2,2):
dist:  0 1 2           dist:  2 1 0           dist:  4 3 2
       1 2 3                  1 2 1                  3 2 1
       2 3 4                  2 3 2                  2 1 0

Sum at each empty cell:
       _ 5 _     (skip buildings)
       5 6 _
       _ _ _

All 3 buildings must reach cell:
(0,1): reached by all 3? sum=5 ✓
(1,0): sum=5 ✓
Answer: min = 5 at cells (0,1) or (1,0)
```

---

## Problem Description

You are given an `m × n` grid. Cells are `0` (empty), `1` (building), or `2` (obstacle). You want to build a house on an empty cell such that the **total travel distance** from the house to all buildings is minimized. You can only walk through empty cells (value `0`). Return the minimum total travel distance, or `-1` if no valid empty cell exists.

**Example 1:**

- Input: `grid = [[1,0,2,0,1],[0,0,0,0,0],[0,0,1,0,0]]` → Output: `7`

**Example 2:**

- Input: `grid = [[1,0]]` → Output: `1`

**Constraints:**

- `m == grid.length`, `n == grid[i].length`
- `1 <= m, n <= 50`
- `grid[i][j]` is `0`, `1`, or `2`

---

## 📝 Interview Tips

1. **Clarify**: "Có thể đi qua tòa nhà khác không? Không — chỉ qua ô 0" / Can we walk through other buildings? No, only through empty cells (0)
2. **BFS from buildings**: "Ít tòa nhà hơn ô trống → BFS từ tòa nhà hiệu quả hơn" / Fewer buildings than empty cells → BFS from buildings is faster
3. **Reachability**: "Phải đảm bảo ô được chọn tiếp cận được từ TẤT CẢ tòa nhà" / Must ensure chosen cell is reachable from ALL buildings
4. **Optimization**: "Dùng `visited` marker trick: giảm `visited` mỗi vòng BFS để tránh re-allocate" / Decrement visited counter each BFS round to reuse visited grid
5. **Edge cases**: "Không có ô 0, tất cả ô 0 bị chặn bởi obstacles, chỉ 1 tòa nhà" / No empty cells, all blocked by obstacles, single building
6. **Complexity**: "O(B × M × N) where B = buildings count — worst case O(M²N²)" / O(B·M·N) where B is number of buildings

---

## Solutions

```typescript
/**
 * Solution 1: BFS from each building, accumulate distances
 * Time: O(B × M × N) where B = number of buildings
 * Space: O(M × N) for distance and reach matrices
 *
 * For each building, BFS outward and add distances to dist matrix.
 * Also track how many buildings can reach each empty cell.
 * Answer = min(dist[r][c]) where reach[r][c] == totalBuildings
 */
function shortestDistance(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // dist[r][c] = cumulative BFS distance from all buildings to (r,c)
  const dist = Array.from({ length: m }, () => new Array(n).fill(0));
  // reach[r][c] = how many buildings can reach this cell
  const reach = Array.from({ length: m }, () => new Array(n).fill(0));

  let totalBuildings = 0;

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] !== 1) continue;
      totalBuildings++;

      // BFS from this building
      const visited = Array.from({ length: m }, () => new Array(n).fill(false));
      const queue: [number, number, number][] = [[r, c, 0]];
      visited[r][c] = true;

      while (queue.length > 0) {
        const [cr, cc, d] = queue.shift()!;
        for (const [dr, dc] of dirs) {
          const nr = cr + dr,
            nc = cc + dc;
          if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
          if (visited[nr][nc] || grid[nr][nc] !== 0) continue;
          visited[nr][nc] = true;
          dist[nr][nc] += d + 1;
          reach[nr][nc]++;
          queue.push([nr, nc, d + 1]);
        }
      }
    }
  }

  let ans = Infinity;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 0 && reach[r][c] === totalBuildings) {
        ans = Math.min(ans, dist[r][c]);
      }
    }
  }
  return ans === Infinity ? -1 : ans;
}

/**
 * Solution 2: Optimized — shrink accessible empty cells each BFS round
 * Time: O(B × M × N), Space: O(M × N)
 *
 * Trick: use `visited` value = -(buildingCount) per round.
 * Empty cells that weren't reached this round can never be the answer.
 * We restrict next BFS to only cells reached in ALL previous BFS rounds.
 */
function shortestDistanceOpt(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const dist = Array.from({ length: m }, () => new Array(n).fill(0));
  let empty = 0; // decremented each BFS: cells that qualify

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1) {
        let minDist = Infinity;
        const queue: [number, number][] = [[r, c]];
        let d = 0;
        while (queue.length > 0) {
          d++;
          const size = queue.length;
          for (let i = 0; i < size; i++) {
            const [cr, cc] = queue.shift()!;
            for (const [dr, dc] of dirs) {
              const nr = cr + dr,
                nc = cc + dc;
              if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === empty) {
                grid[nr][nc]--; // mark as visited for this round
                dist[nr][nc] += d;
                minDist = Math.min(minDist, dist[nr][nc]);
                queue.push([nr, nc]);
              }
            }
          }
        }
        empty--;
        if (minDist === Infinity) return -1; // no empty cell reachable from this building
      }
    }
  }

  let ans = Infinity;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === empty) ans = Math.min(ans, dist[r][c]);
    }
  }
  return ans === Infinity ? -1 : ans;
}

// === Test Cases ===
console.log(
  shortestDistance([
    [1, 0, 2, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
  ]),
); // 7
console.log(shortestDistance([[1, 0]])); // 1
console.log(shortestDistance([[1]])); // -1 (no empty cell)
console.log(
  shortestDistance([
    [0, 2, 1],
    [1, 0, 2],
    [0, 1, 0],
  ]),
); // 10 or check
```

---

## 🔗 Related Problems

| Problem                                                                                                                  | Pattern            | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------ | ---------- |
| [Rotting Oranges](https://leetcode.com/problems/rotting-oranges)                                                         | Multi-source BFS   | Medium     |
| [01 Matrix](https://leetcode.com/problems/01-matrix)                                                                     | Multi-source BFS   | Medium     |
| [As Far from Land as Possible](https://leetcode.com/problems/as-far-from-land-as-possible)                               | Multi-source BFS   | Medium     |
| [Minimum Number of Days to Disconnect Island](https://leetcode.com/problems/minimum-number-of-days-to-disconnect-island) | BFS + Articulation | Hard       |
| [Snakes and Ladders](https://leetcode.com/problems/snakes-and-ladders)                                                   | BFS on board       | Medium     |
