---
layout: page
title: "Making A Large Island"
difficulty: Hard
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Union Find, Matrix]
leetcode_url: "https://leetcode.com/problems/making-a-large-island"
---

# Making A Large Island / Tạo Đảo Lớn

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DFS Island Labeling + Merge

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như trò ghép lục địa — bạn có bản đồ nhiều đảo nhỏ, và được phép xây một cây cầu (lật một ô `0` thành `1`). Để tìm đảo lớn nhất sau khi xây cầu, bạn cần biết **kích thước của từng đảo hiện có** trước, rồi thử từng ô `0` và tính tổng kích thước các đảo kề nó. Gán nhãn đảo bằng DFS, rồi merge.

**Pattern Recognition:**

- Signal: "flip one cell, maximize connected region" → **Label islands first, then merge at zeros**
- Two-pass: Pass 1 = label each island with ID + store size; Pass 2 = try each 0, sum unique neighbor islands
- Key insight: Using island IDs instead of re-running DFS on every 0 cell drops complexity from O(n⁴) to O(n²)

**Visual — Two-pass approach:**

```
Input grid:          Pass 1 (label islands):   islandSize:
1 0              →   2 0                        {2: 1, 3: 3}
0 1                  0 3
1 1                  0 3
                     0 3
Wait, let's use 4-connectivity:

Grid:   1 1 0        Label:  2 2 0      sizes: {2:2, 3:2}
        0 0 1   →           0 0 3
        1 0 0               4 0 0      sizes: {2:2, 3:2, 4:1}

Try each 0:
  (0,2): neighbors with land → island 3  → 0+1 + size[3] = 3
  (1,0): neighbors → island 2, 4        → 0+1 + size[2]+size[4] = 4  ← best
  (1,1): neighbors → island 2,3,4       → 0+1 + 2+2+1 = 6            ← best
Answer: 6 (if grid is all 1s, return n*n)
```

---

## Problem Description

You are given an `n × n` binary grid. You may change **at most one** `0` to `1`. Return the size of the largest island after applying this operation.

**Example 1:**

- Input: `grid = [[1,0],[0,1]]` → Output: `3`

**Example 2:**

- Input: `grid = [[1,1],[1,0]]` → Output: `4`

**Constraints:**

- `n == grid.length == grid[i].length`
- `1 <= n <= 500`
- `grid[i][j]` is `0` or `1`

---

## 📝 Interview Tips

1. **Clarify**: "Nếu không có ô 0 nào thì sao? Trả về n*n" / If no 0s exist, return n*n (all already land)
2. **Naive approach**: "Với mỗi ô 0, flip và BFS/DFS đếm component — O(n^4)" / Try every 0 and BFS: O(n²) cells × O(n²) BFS = O(n⁴)
3. **Optimal**: "Label islands first O(n²), then for each 0 sum unique neighbor islands O(1)" / Two-pass: O(n²) total
4. **Island ID**: "Dùng ID bắt đầu từ 2 để tránh nhầm với 0 và 1" / Start IDs at 2 to avoid confusion with grid values 0/1
5. **Unique neighbors**: "Dùng Set để tránh đếm cùng đảo hai lần khi hai ô 1 cùng đảo kề ô 0" / Use Set to deduplicate island IDs around each 0
6. **Complexity**: "O(n²) time, O(n²) space — optimal for this problem" / Linear in grid size

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — flip each 0, BFS/DFS for island size
 * Time: O(n^4) — n^2 zeros × n^2 BFS each
 * Space: O(n^2) for visited
 */
function largestIslandBrute(grid: number[][]): number {
  const n = grid.length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function bfsSize(r: number, c: number, visited: boolean[][]): number {
    let size = 0;
    const queue = [[r, c]];
    visited[r][c] = true;
    while (queue.length > 0) {
      const [cr, cc] = queue.shift()!;
      size++;
      for (const [dr, dc] of dirs) {
        const nr = cr + dr,
          nc = cc + dc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] && grid[nr][nc] === 1) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
    return size;
  }

  let ans = 0;
  let hasZero = false;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 0) {
        hasZero = true;
        grid[r][c] = 1;
        const visited = Array.from({ length: n }, () => new Array(n).fill(false));
        ans = Math.max(ans, bfsSize(r, c, visited));
        grid[r][c] = 0;
      }
    }
  }
  return hasZero ? ans : n * n;
}

/**
 * Solution 2: Two-Pass Island Labeling (optimal)
 * Time: O(n^2) — one DFS pass + one scan pass
 * Space: O(n^2) for island size map
 *
 * Pass 1: Label each island with unique ID (starting at 2), record sizes
 * Pass 2: For each 0, collect unique island IDs of 4-neighbors, sum their sizes + 1
 */
function largestIsland(grid: number[][]): number {
  const n = grid.length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const islandSize: Map<number, number> = new Map();
  let islandId = 2; // IDs start at 2 (grid values are 0 and 1)

  // DFS to label all cells of an island with islandId, return size
  function dfs(r: number, c: number, id: number): number {
    if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] !== 1) return 0;
    grid[r][c] = id;
    let size = 1;
    for (const [dr, dc] of dirs) size += dfs(r + dr, c + dc, id);
    return size;
  }

  // Pass 1: Label all islands
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1) {
        const size = dfs(r, c, islandId);
        islandSize.set(islandId, size);
        islandId++;
      }
    }
  }

  // If no 0s exist, the whole grid is one island
  let ans = islandSize.size === 1 ? islandSize.get(2)! : 0;

  // Pass 2: Try flipping each 0
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 0) {
        const neighborIds = new Set<number>();
        for (const [dr, dc] of dirs) {
          const nr = r + dr,
            nc = c + dc;
          if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] > 1) {
            neighborIds.add(grid[nr][nc]);
          }
        }
        let total = 1; // the flipped cell itself
        for (const id of neighborIds) total += islandSize.get(id)!;
        ans = Math.max(ans, total);
      }
    }
  }

  return ans;
}

// === Test Cases ===
console.log(
  largestIsland([
    [1, 0],
    [0, 1],
  ]),
); // 3
console.log(
  largestIsland([
    [1, 1],
    [1, 0],
  ]),
); // 4
console.log(
  largestIsland([
    [1, 1],
    [1, 1],
  ]),
); // 4 (no zeros)
console.log(
  largestIsland([
    [0, 0],
    [0, 0],
  ]),
); // 1
```

---

## 🔗 Related Problems

| Problem                                                                    | Pattern             | Difficulty |
| -------------------------------------------------------------------------- | ------------------- | ---------- |
| [Max Area of Island](https://leetcode.com/problems/max-area-of-island)     | DFS / BFS on grid   | Medium     |
| [Number of Islands](https://leetcode.com/problems/number-of-islands)       | DFS / Union Find    | Medium     |
| [Count Sub Islands](https://leetcode.com/problems/count-sub-islands)       | DFS on grid         | Medium     |
| [Surrounded Regions](https://leetcode.com/problems/surrounded-regions)     | DFS boundary fill   | Medium     |
| [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) | Binary Search + BFS | Hard       |
