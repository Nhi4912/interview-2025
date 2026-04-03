---
layout: page
title: "Swim in Rising Water"
difficulty: Hard
category: Tree-Graph
tags: [Array, Binary Search, Depth-First Search, Breadth-First Search, Union Find]
leetcode_url: "https://leetcode.com/problems/swim-in-rising-water"
---

# Swim in Rising Water / Bơi Trong Nước Dâng

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dijkstra / Binary Search + BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort) | [Path With Maximum Minimum Value](https://leetcode.com/problems/path-with-maximum-minimum-value)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như leo núi tìm đường từ góc trái-trên xuống góc phải-dưới — bạn muốn đường đi mà đỉnh núi cao nhất trên đường thấp nhất có thể. Đây là bài toán "minimax path" — minimize the maximum value along the path.

**Pattern Recognition:**

- Signal: "minimize the maximum value on path" → **Dijkstra (min-heap on max)** or **Binary search + BFS**
- Dijkstra: `dist[i][j]` = minimum possible `max(grid values)` to reach `(i,j)` from `(0,0)`
- Binary search: binary search on answer `t`, BFS/DFS to check if path exists with all cells ≤ t

**Visual:**

```
grid = [[0,2],[1,3]]

Dijkstra:
Start: (0,0) val=0, heap=[(0,0,0)]
Pop (0,0,0): neighbors (0,1)val=2, (1,0)val=1
Push (2,0,1) and (1,1,0) → heap=[(1,1,0),(2,0,1)]
Pop (1,1,0): neighbor (1,1)val=3 → push (max(1,3),1,1)=(3,1,1)
Pop (2,0,1): neighbor (1,1) → push (max(2,3),1,1)=(3,1,1) — already 3
Pop (3,1,1): reached destination → answer=3
```

---

## Problem Description

Given an `n x n` grid where `grid[i][j]` represents the elevation of that cell (all distinct, `0` to `n²-1`), you can swim from cell to adjacent cell (4-dir) only if time `t >= max(both cells' elevations)`. Return the minimum time `t` to swim from `(0,0)` to `(n-1,n-1)`.

**Example 1:** `grid=[[0,2],[1,3]]` → `3`
**Example 2:** `grid=[[0,1,2,3,4],[24,23,22,21,5],...]` → `16`

Constraints: `1 <= n <= 50`, all values in `[0, n²-1]` are unique.

---

## 📝 Interview Tips

1. **Minimax framing**: "Minimize the maximum grid value along the path — classic minimax" / Identify as minimax path problem
2. **Dijkstra variant**: "Thay vì sum, dùng max làm edge weight; min-heap theo max value" / Use max instead of sum as path cost
3. **Binary search alt**: "Binary search trên t ∈ [0, n²-1]; với mỗi t, BFS check path tồn tại không" / Binary search on answer
4. **Union Find alt**: "Sort cells by value, union theo thứ tự; dừng khi (0,0) và (n-1,n-1) connected" / Union-Find by elevation order
5. **Edge cases**: "n=1 → answer = grid[0][0]" / Single cell: answer is its value
6. **Follow-up**: "Nếu cần trace lại đường đi?" / Track parent pointers in Dijkstra for path reconstruction

---

## Solutions

```typescript
/**
 * Solution 1: Dijkstra (min-heap on max path value) — optimal
 * Time: O(N² · log N) — heap operations over N² cells
 * Space: O(N²) — dist array + heap
 */
function swimInWater(grid: number[][]): number {
  const n = grid.length;
  if (n === 1) return grid[0][0];

  // Min-heap: [maxVal, row, col]
  const heap: [number, number, number][] = [[grid[0][0], 0, 0]];
  const dist = Array.from({ length: n }, () => new Array(n).fill(Infinity));
  dist[0][0] = grid[0][0];
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // Simple min-heap using sorted array (for clarity; use proper heap in production)
  const push = (item: [number, number, number]) => {
    heap.push(item);
    heap.sort((a, b) => a[0] - b[0]);
  };

  while (heap.length > 0) {
    const [t, r, c] = heap.shift()!;
    if (r === n - 1 && c === n - 1) return t;
    if (t > dist[r][c]) continue;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
      const newDist = Math.max(t, grid[nr][nc]);
      if (newDist < dist[nr][nc]) {
        dist[nr][nc] = newDist;
        push([newDist, nr, nc]);
      }
    }
  }
  return dist[n - 1][n - 1];
}

/**
 * Solution 2: Binary Search + BFS
 * Time: O(N² · log N) — binary search O(logN²)=O(logN) * BFS O(N²)
 * Space: O(N²) — visited array
 */
function swimInWaterBS(grid: number[][]): number {
  const n = grid.length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function canReach(t: number): boolean {
    if (grid[0][0] > t) return false;
    const visited = Array.from({ length: n }, () => new Array(n).fill(false));
    const queue: [number, number][] = [[0, 0]];
    visited[0][0] = true;
    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      if (r === n - 1 && c === n - 1) return true;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] && grid[nr][nc] <= t) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
    return false;
  }

  let lo = grid[0][0],
    hi = n * n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canReach(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// === Test Cases ===
console.log(
  swimInWater([
    [0, 2],
    [1, 3],
  ]),
); // 3
console.log(
  swimInWaterBS([
    [0, 2],
    [1, 3],
  ]),
); // 3
console.log(
  swimInWater([
    [0, 1, 2, 3, 4],
    [24, 23, 22, 21, 5],
    [12, 13, 14, 15, 16],
    [11, 17, 18, 19, 20],
    [10, 9, 8, 7, 6],
  ]),
); // 16
console.log(swimInWater([[0]])); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                                                        | Pattern             | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ---------- |
| [Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort)                                                             | Dijkstra minimax    | 🟡 Medium  |
| [Path With Maximum Minimum Value](https://leetcode.com/problems/path-with-maximum-minimum-value)                                               | Dijkstra maximin    | 🟡 Medium  |
| [Find the Safest Path in a Grid](https://leetcode.com/problems/find-the-safest-path-in-a-grid)                                                 | Binary search + BFS | 🟡 Medium  |
| [Minimum Cost to Make at Least One Valid Path in a Grid](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid) | 0-1 BFS             | 🔴 Hard    |
| [Last Day Where You Can Still Cross](https://leetcode.com/problems/last-day-where-you-can-still-cross)                                         | Binary search + BFS | 🔴 Hard    |
