---
layout: page
title: "Trapping Rain Water II"
difficulty: Hard
category: Tree-Graph
tags: [Array, Breadth-First Search, Heap (Priority Queue), Matrix]
leetcode_url: "https://leetcode.com/problems/trapping-rain-water-ii"
---

# Trapping Rain Water II / Giữ Nước Mưa II (3D)

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) | [Minimum Number of Visited Cells in a Grid](https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đổ nước vào bể 3D — nước chảy ra ngoài qua điểm thấp nhất trên tường biên. Dùng min-heap để luôn xử lý "bức tường thấp nhất" trước — mực nước bên trong không thể cao hơn mức nước của tường bao quanh.

**Pattern Recognition:**

- Signal: "water trapped in 3D grid" + "process lowest boundary first" → **BFS + Min-Heap**
- This is like Dijkstra: expand from border inward, always pick the lowest unvisited boundary cell
- Key insight: `water at (r,c) = max(0, currentWaterLevel - heightmap[r][c])`

**Visual — Min-heap BFS approach:**

```
heightMap:
  1 4 3 1 3 2
  3 2 1 3 2 4
  2 3 3 2 3 1
  1 2 1 4 4 1
  (border cells → initial heap)

Process lowest border cell:
  pop (height=1, r=0, c=3): check neighbors
    neighbor (1,3) height=3 → no water trapped
    water level = max(1, neighbor.h) = 3 going forward

At each cell: water += max(0, waterLevel - cell_height)
              push neighbor with height=max(waterLevel, cell_height)
```

---

## Problem Description

Given an `m x n` integer matrix `heightMap` representing a 3D elevation map where each cell's height is given, compute how much water can be trapped after raining. Water fills enclosed depressions but flows freely out of any border opening.

- Example 1: `[[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1],[1,2,1,4,4,1]]` → `4`
- Example 2: `[[3,3,3],[3,1,3],[3,3,3]]` → `2`

Constraints: `1 <= m, n <= 200`, `0 <= heightMap[i][j] <= 2*10^4`.

---

## 📝 Interview Tips

1. **Clarify**: "3D version của Trapping Rain Water I — 2D grid thay vì 1D array" / Extension from 1D; same principle but needs 2D boundary thinking
2. **Key insight**: "Nước bị giữ bởi tường thấp nhất — luôn expand từ tường thấp nhất (min-heap)" / Water level bounded by minimum surrounding wall
3. **Min-heap role**: "Pop cell thấp nhất, check neighbors — nước = max(0, popped_height - neighbor_height)" / Min-heap ensures we always process constraining boundary first
4. **Visited array**: "Cần visited để tránh re-process — quan trọng như BFS thường" / Mark visited when pushed to heap, not when popped
5. **Edge cases**: "m<=2 hoặc n<=2 → tất cả là biên → 0 nước" / All border = no interior → 0
6. **Follow-up**: "Nếu heightMap thay đổi dynamic? Cần re-run BFS từ đầu — không cache được" / Dynamic updates require full recomputation

---

## Solutions

```typescript
/**
 * Solution: BFS + Min-Heap (priority queue simulation)
 * Process border cells in min-height order, track water level, BFS inward
 * Time: O(M*N*log(M*N)) — each cell pushed to heap once
 * Space: O(M*N) — heap + visited matrix
 */
function trapRainWater(heightMap: number[][]): number {
  const m = heightMap.length,
    n = heightMap[0].length;
  if (m < 3 || n < 3) return 0;

  // Min-heap: [height, row, col]
  const heap: [number, number, number][] = [];
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));

  function heapPush(item: [number, number, number]): void {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent][0] <= heap[i][0]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  }

  function heapPop(): [number, number, number] {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let smallest = i;
        const l = 2 * i + 1,
          r = 2 * i + 2;
        if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l;
        if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r;
        if (smallest === i) break;
        [heap[smallest], heap[i]] = [heap[i], heap[smallest]];
        i = smallest;
      }
    }
    return top;
  }

  // Seed with all border cells
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (r === 0 || r === m - 1 || c === 0 || c === n - 1) {
        heapPush([heightMap[r][c], r, c]);
        visited[r][c] = true;
      }
    }
  }

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let water = 0;

  while (heap.length > 0) {
    const [level, r, c] = heapPop();
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || visited[nr][nc]) continue;
      visited[nr][nc] = true;
      water += Math.max(0, level - heightMap[nr][nc]);
      heapPush([Math.max(level, heightMap[nr][nc]), nr, nc]);
    }
  }

  return water;
}

// === Test Cases ===
console.log(
  trapRainWater([
    [1, 4, 3, 1, 3, 2],
    [3, 2, 1, 3, 2, 4],
    [2, 3, 3, 2, 3, 1],
    [1, 2, 1, 4, 4, 1],
  ]),
); // 4
console.log(
  trapRainWater([
    [3, 3, 3],
    [3, 1, 3],
    [3, 3, 3],
  ]),
); // 2
console.log(
  trapRainWater([
    [1, 1],
    [1, 1],
  ]),
); // 0 (too small, all border)
console.log(
  trapRainWater([
    [12, 13, 1, 12],
    [13, 4, 13, 12],
    [13, 8, 10, 12],
    [12, 13, 12, 12],
    [13, 13, 13, 13],
  ]),
); // 14
```

---

## 🔗 Related Problems

- [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water) — 1D version, two-pointer O(N)
- [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) — min-heap BFS to find minimum max-height path
- [Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort) — Dijkstra on grid minimizing max edge weight
- [Find the Safest Path in a Grid](https://leetcode.com/problems/find-the-safest-path-in-a-grid) — BFS + binary search on grid distance
