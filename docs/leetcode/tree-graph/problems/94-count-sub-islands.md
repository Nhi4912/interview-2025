---
layout: page
title: "Count Sub Islands"
difficulty: Medium
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Union Find, Matrix]
leetcode_url: "https://leetcode.com/problems/count-sub-islands"
---

# Count Sub Islands / Đếm Đảo Con

> **Difficulty**: 🟡 Medium | **Category**: Tree-Graph | **Pattern**: DFS Island Flood Fill

## 🧠 Intuition / Tư Duy

**Như kiểm tra bản đồ lãnh thổ** — đảo của grid2 là "đảo con" nếu mọi ô đất của đảo đó đều nằm trên đất của grid1. Chỉ cần một ô đất trong grid2 mà grid1 là biển → đảo đó không phải đảo con.

**Pattern Recognition:**

- "Đảo" trong grid → DFS/BFS flood fill từ mỗi ô đất chưa thăm
- "Sub-island" = mọi ô trong island2 phải là land trong grid1
- Xử lý "không phải sub-island": vẫn flood fill để đánh dấu visited, chỉ không đếm

**Visual:**

```
grid1: 1 1 1    grid2: 1 1 1
       1 1 0           0 1 0
       0 0 0           0 0 0
Island in grid2: {(0,0),(0,1),(0,2),(1,1)}
All of these are 1 in grid1? Yes → count as sub-island
Answer = 3 (three separate islands in grid2, check each)
```

## Problem Description

Given two `m x n` binary matrices `grid1` and `grid2`, an island in `grid2` is a **sub-island** if every cell of that island in `grid2` also exists as land (`1`) in `grid1`. Return the count of sub-islands in `grid2`.

**Example:** grid1=`[[1,1,1,0],[0,1,1,1],[0,0,0,0]]`, grid2=`[[1,1,1,0],[0,0,1,1],[0,1,0,0]]` → `2`

**Constraints:** m,n ≤ 500, cells are 0 or 1

## 📝 Interview Tips

1. **Clarify**: Sub-island means every cell of the grid2 island must be 1 in grid1. Diagonal doesn't count as connected.
2. **Approach**: For each unvisited land cell in grid2, DFS to flood fill the whole island. Track if any cell is 0 in grid1.
3. **Edge cases**: Island of size 1: check if grid1 cell is also 1. Islands touching grid boundary are fine.
4. **Optimize**: Can preprocess — flood fill all grid2 land cells where grid1=0 first (they can't be sub-islands), then count remaining islands.
5. **Follow-up**: What if islands can be diagonal? Adjust 4-directional to 8-directional DFS.
6. **Complexity**: O(m·n) time and space.

## Solutions

```typescript
// Solution 1: DFS flood fill — return isSubIsland flag
// Time: O(m*n) | Space: O(m*n) recursion stack
function countSubIslands(grid1: number[][], grid2: number[][]): number {
  const m = grid1.length,
    n = grid1[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function dfs(r: number, c: number): boolean {
    if (r < 0 || r >= m || c < 0 || c >= n || grid2[r][c] === 0) return true;
    grid2[r][c] = 0; // Mark visited
    let isSubIsland = grid1[r][c] === 1; // This cell must be land in grid1
    for (const [dr, dc] of dirs) {
      // Must call dfs for ALL neighbors (can't short-circuit with &&)
      const childResult = dfs(r + dr, c + dc);
      isSubIsland = isSubIsland && childResult;
    }
    return isSubIsland;
  }

  let count = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid2[r][c] === 1) {
        if (dfs(r, c)) count++;
      }
    }
  }
  return count;
}

// Solution 2: Preprocess — sink grid2 islands where grid1=0, then count
// Time: O(m*n) | Space: O(m*n)
function countSubIslands2(grid1: number[][], grid2: number[][]): number {
  const m = grid1.length,
    n = grid1[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function sink(r: number, c: number): void {
    if (r < 0 || r >= m || c < 0 || c >= n || grid2[r][c] === 0) return;
    grid2[r][c] = 0;
    for (const [dr, dc] of dirs) sink(r + dr, c + dc);
  }

  // Step 1: Flood fill any grid2 island cell where grid1=0 (not sub-island)
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid1[r][c] === 0 && grid2[r][c] === 1) sink(r, c);
    }
  }

  // Step 2: Count remaining islands in grid2 (all are sub-islands)
  let count = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid2[r][c] === 1) {
        sink(r, c);
        count++;
      }
    }
  }
  return count;
}

// Tests
console.log(
  countSubIslands(
    [
      [1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1],
      [0, 1, 1, 1, 1],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 1],
      [0, 0, 1, 1, 0],
      [0, 0, 1, 0, 1],
      [0, 0, 0, 0, 0],
    ],
  ),
); // 2

console.log(
  countSubIslands(
    [
      [1, 0],
      [0, 1],
    ],
    [
      [1, 0],
      [0, 1],
    ],
  ),
); // 2 (each single cell island is sub-island)

console.log(
  countSubIslands2(
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 0],
    ],
  ),
); // 1

console.log(
  countSubIslands2(
    [
      [0, 0],
      [1, 0],
    ],
    [
      [1, 0],
      [0, 0],
    ],
  ),
); // 0 (grid2 island at (0,0) but grid1[0][0]=0)
```

## 🔗 Related Problems

| Problem                                                                       | Relationship                  |
| ----------------------------------------------------------------------------- | ----------------------------- |
| [Number of Islands](https://leetcode.com/problems/number-of-islands/)         | Foundation: island flood fill |
| [Max Area of Island](https://leetcode.com/problems/max-area-of-island/)       | Island DFS with return value  |
| [Making A Large Island](https://leetcode.com/problems/making-a-large-island/) | Advanced island merging       |
