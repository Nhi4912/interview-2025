---
layout: page
title: "Maximum Number of Points From Grid Queries"
difficulty: Hard
category: Tree-Graph
tags: [Array, Two Pointers, Breadth-First Search, Union Find, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-points-from-grid-queries"
---

# Maximum Number of Points From Grid Queries / Điểm Tối Đa Từ Grid

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: BFS + Sorted Queries
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) | [Minimum Number of Visited Cells in a Grid](https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như nước dâng từ từ trong bể cá — ô nào có giá trị nhỏ hơn mức nước (query) thì được "ngập" và kết nối. Sort queries tăng dần, mở rộng BFS từ (0,0) mỗi lần mực nước tăng.

**Visual — BFS expands as query threshold increases:**

```
Grid:          Queries (sorted): [1, 2, 4, 6]
1 2 3
3 2 1          q=1: only cells < 1 → none reachable from (0,0) → 0
2 1 2          q=2: cells < 2 → only (0,0)=1 ✓ → count=1
                     can't expand (neighbors ≥ 2)
               q=4: cells < 4 → (0,0)=1,(0,1)=2,(1,1)=2,(1,2)=1,(2,1)=1
                     BFS from (0,0): expands to all ≤3 cells
               q=6: all 9 cells < 6 → count=9

Min-heap BFS: always expand cheapest neighbor first
As threshold increases → more cells unlock
```

---

## Problem Description

Given an `m×n` grid and `k` queries. For each `queries[i]`, count how many cells you can collect starting from `(0,0)` by moving to adjacent cells **strictly less than** `queries[i]`. You must be able to enter `(0,0)` too (i.e., `grid[0][0] < queries[i]`). Return answer array. ([LeetCode 2503](https://leetcode.com/problems/maximum-number-of-points-from-grid-queries))

**Example 1:** grid=[[1,2,3],[2,5,7],[3,5,1]], queries=[5,6,2] → [5,8,1]
**Example 2:** grid=[[5,2,1],[1,1,2]], queries=[3] → [0]

**Constraints:** m,n ≤ 1000, 1 ≤ queries[i] ≤ 10⁶, grid values ≥ 1.

---

## 📝 Interview Tips

1. **Sort trick**: Sort queries → process thresholds monotonically, BFS only expands / Offline processing key.
2. **Min-heap BFS**: Thêm ô vào heap khi discovered; pop khi threshold đủ cao / Dijkstra-like expansion.
3. **Không BFS lại**: Từng query BFS từ đầu → O(k·m·n). Sort + incremental = O((mn+k)log(mn)).
4. **Entry condition**: grid[0][0] phải < query, ngay cả ô gốc / Check starting cell.
5. **Edge case**: query ≤ grid[0][0] → answer = 0; all cells < query → answer = m\*n.
6. **Follow-up**: "Nếu có nhiều starting points?" / Multi-source BFS with same heap approach.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — BFS from (0,0) for each query independently
 * Time: O(k · m·n) — full BFS per query
 * Space: O(m·n)
 */
function maxPointsBrute(grid: number[][], queries: number[]): number[] {
  const m = grid.length,
    n = grid[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  return queries.map((threshold) => {
    if (grid[0][0] >= threshold) return 0;
    const visited = Array.from({ length: m }, () => new Array(n).fill(false));
    visited[0][0] = true;
    const queue: [number, number][] = [[0, 0]];
    let count = 0,
      head = 0;
    while (head < queue.length) {
      const [r, c] = queue[head++];
      count++;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (
          nr >= 0 &&
          nr < m &&
          nc >= 0 &&
          nc < n &&
          !visited[nr][nc] &&
          grid[nr][nc] < threshold
        ) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
    return count;
  });
}

/**
 * Solution 2: Offline sort + Min-Heap BFS (incremental expansion)
 * Sort queries ascending; expand BFS frontier lazily as threshold increases.
 * Time: O((m·n + k) · log(m·n)) — each cell pushed/popped from heap once
 * Space: O(m·n + k)
 */
function maxPoints(grid: number[][], queries: number[]): number[] {
  const m = grid.length,
    n = grid[0].length;
  const result = new Array(queries.length).fill(0);
  const sortedQ = queries.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // Min-heap: [cellValue, row, col]
  const heap: [number, number, number][] = [];
  const heapPush = (val: number, r: number, c: number) => {
    heap.push([val, r, c]);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] <= heap[i][0]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };
  const heapPop = (): [number, number, number] => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1,
          r = 2 * i + 2;
        if (l < heap.length && heap[l][0] < heap[s][0]) s = l;
        if (r < heap.length && heap[r][0] < heap[s][0]) s = r;
        if (s === i) break;
        [heap[s], heap[i]] = [heap[i], heap[s]];
        i = s;
      }
    }
    return top;
  };

  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  visited[0][0] = true;
  heapPush(grid[0][0], 0, 0);
  let count = 0;

  for (const [qVal, qIdx] of sortedQ) {
    // Expand all cells with value < qVal
    while (heap.length > 0 && heap[0][0] < qVal) {
      const [, r, c] = heapPop();
      count++;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
          visited[nr][nc] = true;
          heapPush(grid[nr][nc], nr, nc);
        }
      }
    }
    result[qIdx] = count;
  }

  return result;
}

// === Test Cases ===
console.log(
  JSON.stringify(
    maxPoints(
      [
        [1, 2, 3],
        [2, 5, 7],
        [3, 5, 1],
      ],
      [5, 6, 2],
    ),
  ),
); // [5,8,1]
console.log(
  JSON.stringify(
    maxPoints(
      [
        [5, 2, 1],
        [1, 1, 2],
      ],
      [3],
    ),
  ),
); // [0]
console.log(JSON.stringify(maxPoints([[1]], [1]))); // [0]
console.log(JSON.stringify(maxPoints([[1]], [2]))); // [1]
```

---

## 🔗 Related Problems

| Problem                                                                                                                           | Pattern             | Difficulty |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ---------- |
| [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water)                                                        | Min-heap BFS        | Hard       |
| [Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort)                                                | Dijkstra            | Medium     |
| [Find the Safest Path in a Grid](https://leetcode.com/problems/find-the-safest-path-in-a-grid)                                    | BFS + binary search | Medium     |
| [Minimum Number of Visited Cells in a Grid](https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid)              | BFS                 | Hard       |
| [Maximum Number of Points From Grid Queries — LeetCode](https://leetcode.com/problems/maximum-number-of-points-from-grid-queries) | —                   | Hard       |
