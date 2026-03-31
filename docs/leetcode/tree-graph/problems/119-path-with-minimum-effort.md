---
layout: page
title: "Path With Minimum Effort"
difficulty: Medium
category: Tree-Graph
tags: [Array, Binary Search, Depth-First Search, Breadth-First Search, Union Find]
leetcode_url: "https://leetcode.com/problems/path-with-minimum-effort"
---

# Path With Minimum Effort / Đường Đi Với Nỗ Lực Nhỏ Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dijkstra (Minimize Maximum)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) | [Path With Maximum Minimum Value](https://leetcode.com/problems/path-with-maximum-minimum-value)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng leo núi qua nhiều đỉnh — "effort" là sự chênh lệch độ cao lớn nhất giữa hai ô kề nhau dọc đường đi. Ta muốn con đường mà bước khó nhất là ít nhất. Đây là bài **minimize the maximum** — Dijkstra vẫn áp dụng được với cách định nghĩa "khoảng cách" là `max_diff_so_far`, không phải tổng.

**Pattern Recognition:**

- Signal: "grid path", "minimize max difference" → **Dijkstra với state = (max_effort, row, col)**
- Thay `dist = min(dist, d + w)` → `effort = min(effort, max(e, |h[nr][nc]-h[r][c]|))`
- Binary Search + BFS cũng là giải pháp hay: binary search on answer, BFS để check feasibility

**Visual — Dijkstra on Grid:**

```
heights = [[1,2,2],[3,8,2],[5,3,5]]
effort[][] init = [[0,∞,∞],[∞,∞,∞],[∞,∞,∞]]

Heap: [(0, 0, 0)]
Pop (0, 0,0): neighbors:
  (0,1): max(0, |2-1|)=1 < ∞ → effort[0][1]=1, push(1, 0,1)
  (1,0): max(0, |3-1|)=2 < ∞ → effort[1][0]=2, push(2, 1,0)

Pop (1, 0,1): neighbors:
  (0,2): max(1, |2-2|)=1 → effort[0][2]=1, push(1, 0,2)
  (1,1): max(1, |8-2|)=6 → effort[1][1]=6
  ...

Eventually: effort[2][2] = 2  (path: 1→2→2→2→2→3→5, max diff=2)
           or path: 1→3→5→3→5 with max diff=2 also
Answer = 2 ✓
```

---

## Problem Description

2D grid `heights[m][n]`. Route from `(0,0)` to `(m-1,n-1)`. The **effort** of a route = maximum absolute difference in heights between consecutive cells. Return the **minimum effort** of any route.

- `1 ≤ m,n ≤ 100`, `1 ≤ heights[i][j] ≤ 10^6`

```
Example 1: heights=[[1,2,2],[3,8,2],[5,3,5]] → 2
  Path: (0,0)→(0,1)→(0,2)→(1,2)→(2,2) diffs=[1,0,0,3] → max=3? No
  Path: (0,0)→(1,0)→(2,0)→(2,1)→(2,2) diffs=[2,2,2,2] → max=2 ✓

Example 2: heights=[[1,2,3],[3,8,4],[5,3,5]] → 1
  Path: (0,0)→(0,1)→(0,2)→(1,2)→(2,2) diffs=[1,1,1,1] → max=1 ✓

Example 3: heights=[[1,2,1,1,1]] → 0
  All diffs on straight path: 1,1,0,0 → max=1? Actually [1→2→1→1→1] → diffs=[1,1,0,0] → max=1
  Wait: [[1,2,1,1,1]] → path is only horizontal: diffs=[1,1,0,0] → 1
```

---

## 📝 Interview Tips

1. **Dijkstra "minimize max"** — State = current max effort along path; relax bằng `max(e, |diff|)` thay vì `e + diff` / _State tracks max effort so far — relax with max instead of sum_
2. **Binary Search + BFS** — Binary search on answer `mid`, BFS check if path exists with all diffs ≤ `mid`: O(m×n×log(max_height)) / _Alternative: binary search the answer, verify with BFS/DFS_
3. **Union Find approach** — Sort all edges by diff, add incrementally until (0,0) and (m-1,n-1) connect: O(m×n×log(m×n)) / _Union Find: sort edges by diff, add until src-dst connected_
4. **Priority queue key** — Heap key là effort hiện tại (max_diff), không phải tổng; pop nhỏ nhất trước / _Heap on current max-effort, not sum — min-heap gives optimal path_
5. **Early termination** — Dừng khi pop (m-1,n-1) khỏi heap: đó là min effort / _Early exit when destination is popped from heap_
6. **Edge case** — 1×1 grid → effort = 0 (không cần di chuyển) / _Single cell → effort is 0_

---

## Solutions

```typescript
/**
 * Solution 1: Binary Search + BFS
 * Time: O(m×n×log(maxHeight)) — binary search × BFS
 * Space: O(m×n)
 * Binary search on answer, BFS to verify path with all diffs ≤ mid.
 */
function minimumEffortPathBS(heights: number[][]): number {
  const m = heights.length,
    n = heights[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function canReach(maxEffort: number): boolean {
    const visited = Array.from({ length: m }, () => new Array(n).fill(false));
    const queue: [number, number][] = [[0, 0]];
    visited[0][0] = true;
    while (queue.length) {
      const [r, c] = queue.shift()!;
      if (r === m - 1 && c === n - 1) return true;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n || visited[nr][nc]) continue;
        if (Math.abs(heights[nr][nc] - heights[r][c]) <= maxEffort) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
    return false;
  }

  let lo = 0,
    hi = 1_000_000;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canReach(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

/**
 * Solution 2: Dijkstra — Minimize Maximum Effort
 * Time: O(m×n×log(m×n)) — Dijkstra with heap
 * Space: O(m×n)
 * effort[r][c] = minimum possible max-effort to reach (r,c) from (0,0).
 */
function minimumEffortPath(heights: number[][]): number {
  const m = heights.length,
    n = heights[0].length;
  const effort = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  effort[0][0] = 0;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // Simulate min-heap: [effort, row, col]
  const heap: [number, number, number][] = [[0, 0, 0]];

  while (heap.length > 0) {
    heap.sort((a, b) => a[0] - b[0]); // min-heap by effort
    const [e, r, c] = heap.shift()!;

    if (r === m - 1 && c === n - 1) return e; // reached destination
    if (e > effort[r][c]) continue; // stale entry

    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const newEffort = Math.max(e, Math.abs(heights[nr][nc] - heights[r][c]));
      if (newEffort < effort[nr][nc]) {
        effort[nr][nc] = newEffort;
        heap.push([newEffort, nr, nc]);
      }
    }
  }
  return effort[m - 1][n - 1];
}

// === Test Cases ===
console.log(
  minimumEffortPath([
    [1, 2, 2],
    [3, 8, 2],
    [5, 3, 5],
  ]),
); // 2
console.log(
  minimumEffortPath([
    [1, 2, 3],
    [3, 8, 4],
    [5, 3, 5],
  ]),
); // 1
console.log(minimumEffortPath([[1, 2, 1, 1, 1]])); // 1
console.log(minimumEffortPath([[3]])); // 0  (single cell)

console.log(
  minimumEffortPathBS([
    [1, 2, 2],
    [3, 8, 2],
    [5, 3, 5],
  ]),
); // 2
console.log(
  minimumEffortPathBS([
    [1, 2, 3],
    [3, 8, 4],
    [5, 3, 5],
  ]),
); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                                                        | Pattern             | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ---------- |
| [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water)                                                                     | Dijkstra (min max)  | Hard       |
| [Path With Maximum Minimum Value](https://leetcode.com/problems/path-with-maximum-minimum-value)                                               | Dijkstra (max min)  | Medium     |
| [Find the Safest Path in a Grid](https://leetcode.com/problems/find-the-safest-path-in-a-grid)                                                 | Binary Search + BFS | Medium     |
| [Minimum Cost to Make at Least One Valid Path in a Grid](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid) | 0-1 BFS             | Hard       |
