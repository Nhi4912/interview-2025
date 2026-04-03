---
layout: page
title: "Minimum Number of Visited Cells in a Grid"
difficulty: Hard
category: Tree-Graph
tags: [Array, Dynamic Programming, Stack, Breadth-First Search, Union Find]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid"
---

# Minimum Number of Visited Cells in a Grid / Số Ô Tối Thiểu Cần Thăm Trong Lưới

> **Difficulty**: 🔴 Hard | **Category**: Tree-Graph | **Pattern**: BFS + Monotonic Stack

## 🧠 Intuition / Tư Duy

**Tưởng tượng bạn đang nhảy qua các tảng đá trong một con suối** — từ mỗi tảng đá, bạn có thể nhảy tối đa `grid[i][j]` bước về phía phải hoặc xuống dưới. Hỏi cần tối thiểu bao nhiêu bước nhảy để đến cuối suối?

**Pattern Recognition:**

- Tìm đường đi ngắn nhất (bước ít nhất) → BFS (mỗi bước = 1 lớp)
- Từ mỗi ô có thể đến nhiều ô → cần tránh re-visit → monotonic stack theo cột/hàng
- Grid traversal với jump range → BFS + sorted structures để prune

**Visual:**

```
grid = [[3,4,2],[3,2,1],[1,1,3]]
Start (0,0) val=3 → can reach (0,1),(0,2),(0,3?no),(1,0),(2,0),(3,0?no)
BFS level 1: {(0,1),(0,2),(1,0),(2,0)}
BFS level 2: from (0,2) val=2 → (0,3?no),(0,4?no),(1,2),(2,2) ← reach (2,2)!
Answer = 3 steps
```

## Problem Description

Given an `m x n` integer matrix `grid`, start at `(0,0)` and reach `(m-1,n-1)`. From cell `(i,j)` with value `v`, you can move right to `(i,j+1..j+v)` or down to `(i+1..i+v,j)`. Return the minimum number of cells visited, or -1 if unreachable.

**Example:** `grid=[[3,4,2],[3,2,1],[1,1,3]]` → `3` (path: (0,0)→(0,2)→(2,2))

**Constraints:** `1 <= m,n <= 10^5`, total cells ≤ 10^5, `0 <= grid[i][j] <= 10^5`

## 📝 Interview Tips

1. **Clarify**: Can you revisit cells? No. Is diagonal movement allowed? No, only right/down.
2. **Approach**: BFS for minimum steps; for each row/col keep a sorted list of unvisited reachable cells.
3. **Edge cases**: Single cell grid returns 1. `grid[0][0]=0` returns -1.
4. **Optimize**: Use SortedList / monotonic stack per row and column to skip visited ranges in O(α) amortized.
5. **Follow-up**: What if movement allowed in all 4 directions? Standard BFS still works.
6. **Complexity**: O(m·n·α(n)) with Union-Find or O(m·n·log n) with sorted sets.

## Solutions

```typescript
// Solution 1: BFS with SortedSet simulation (TreeSet via sorted array + pointer)
// Time: O(m*n*log(m*n)) | Space: O(m*n)
function minimumVisitedCells(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  if (m === 1 && n === 1) return 1;

  // rowSets[i] = sorted unvisited col indices in row i
  // colSets[j] = sorted unvisited row indices in col j
  const rowSets: Set<number>[] = Array.from(
    { length: m },
    (_, i) => new Set(Array.from({ length: n }, (_, j) => j)),
  );
  const colSets: Set<number>[] = Array.from(
    { length: n },
    (_, j) => new Set(Array.from({ length: m }, (_, i) => i)),
  );

  // BFS
  const queue: [number, number][] = [[0, 0]];
  rowSets[0].delete(0);
  colSets[0].delete(0);
  let steps = 1;

  while (queue.length > 0) {
    const size = queue.length;
    for (let q = 0; q < size; q++) {
      const [r, c] = queue[q];
      const v = grid[r][c];

      // Move right in same row
      const toDeleteCol: number[] = [];
      for (const nc of rowSets[r]) {
        if (nc > c + v) break;
        if (nc > c) {
          if (r === m - 1 && nc === n - 1) return steps + 1;
          queue.push([r, nc]);
          toDeleteCol.push(nc);
          colSets[nc].delete(r);
        }
      }
      toDeleteCol.forEach((nc) => rowSets[r].delete(nc));

      // Move down in same col
      const toDeleteRow: number[] = [];
      for (const nr of colSets[c]) {
        if (nr > r + v) break;
        if (nr > r) {
          if (nr === m - 1 && c === n - 1) return steps + 1;
          queue.push([nr, c]);
          toDeleteRow.push(nr);
          rowSets[r].delete(c); // already visited
        }
      }
      toDeleteRow.forEach((nr) => colSets[c].delete(nr));
    }
    queue.splice(0, size);
    steps++;
  }
  return -1;
}

// Solution 2: BFS with sorted arrays + binary search pointer (more practical)
// Time: O(m*n*log(mn)) | Space: O(m*n)
function minimumVisitedCells2(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  dist[0][0] = 1;

  // For each row/col, keep sorted list of unvisited indices
  const rowAvail: number[][] = Array.from({ length: m }, (_, i) =>
    Array.from({ length: n }, (_, j) => j),
  );
  const colAvail: number[][] = Array.from({ length: n }, (_, j) =>
    Array.from({ length: m }, (_, i) => i),
  );

  const queue: [number, number][] = [[0, 0]];
  rowAvail[0] = rowAvail[0].filter((j) => j !== 0);
  colAvail[0] = colAvail[0].filter((i) => i !== 0);

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const d = dist[r][c];
    const v = grid[r][c];

    // Right
    const newRowAvail: number[] = [];
    for (const nc of rowAvail[r]) {
      if (nc > c + v) {
        newRowAvail.push(nc);
        continue;
      }
      if (nc > c && dist[r][nc] === Infinity) {
        dist[r][nc] = d + 1;
        queue.push([r, nc]);
        colAvail[nc] = colAvail[nc].filter((x) => x !== r);
      }
    }
    // Keep only those beyond range or already visited
    rowAvail[r] = rowAvail[r].filter((nc) => nc > c + v);

    // Down
    for (const nr of colAvail[c]) {
      if (nr > r + v) break;
      if (nr > r && dist[nr][c] === Infinity) {
        dist[nr][c] = d + 1;
        queue.push([nr, c]);
      }
    }
    colAvail[c] = colAvail[c].filter((nr) => nr > r + v || nr <= r);
  }

  return dist[m - 1][n - 1] === Infinity ? -1 : dist[m - 1][n - 1];
}

// Tests
console.log(
  minimumVisitedCells([
    [3, 4, 2],
    [3, 2, 1],
    [1, 1, 3],
  ]),
); // 3
console.log(
  minimumVisitedCells([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]),
); // 5 (longest path needed)
console.log(
  minimumVisitedCells([
    [0, 1],
    [1, 0],
  ]),
); // -1
console.log(minimumVisitedCells([[1]])); // 1
console.log(
  minimumVisitedCells([
    [2, 1],
    [1, 0],
  ]),
); // 2
```

## 🔗 Related Problems

| Problem                                                                                         | Relationship                           |
| ----------------------------------------------------------------------------------------------- | -------------------------------------- |
| [Jump Game](https://leetcode.com/problems/jump-game/)                                           | Same 1D jump mechanics                 |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii/)                                     | Minimum jumps in 1D — direct precursor |
| [Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/) | BFS on grid for minimum steps          |
