---
layout: page
title: "As Far from Land as Possible"
difficulty: Medium
category: Tree-Graph
tags: [Array, Dynamic Programming, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/as-far-from-land-as-possible"
---

# As Far from Land as Possible / Xa Đất Liền Nhất Có Thể

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Multi-Source BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [01 Matrix](https://leetcode.com/problems/01-matrix) | [Rotting Oranges](https://leetcode.com/problems/rotting-oranges)

---

## 🧠 Intuition / Tư Duy

**Analogy (VI):** Như lũ từ tất cả đất liền cùng lan ra một lúc — BFS multi-source. Ô nước cuối cùng bị "ngập" chính là ô xa đất nhất. Khoảng cách của nó là đáp án.

**Analogy (EN):** Multi-source BFS: enqueue all land cells (value 1) simultaneously. BFS spreads outward — the last water cell reached has the maximum distance to any land.

```
Grid:        After BFS:
1  0  1      1   1   1
0  0  0  →   1   2   1    ← distance from nearest land
1  0  1      1   1   1
Max = 2  (center cell)

All 0 or all 1 → return -1 (no land or no water)
```

---

## 📝 Interview Tips

1. **Multi-source BFS / BFS đa nguồn**: Enqueue ALL land cells first, BFS simultaneously — same as 01 Matrix / Start from all land cells at once
2. **Last cell / Ô cuối**: Ô cuối cùng BFS chạm tới = xa nhất. Lưu dist của nó / Track distance of the last dequeued water cell
3. **Edge case / Biên**: Nếu không có water cell → return -1; nếu không có land cell → return -1
4. **In-place / Chỉnh sửa tại chỗ**: Có thể modify grid để đánh dấu visited, tiết kiệm bộ nhớ / Modify grid values to mark visited (saves separate boolean array)
5. **DP alternative / Cách DP**: DP 2 lượt (top-left → bottom-right rồi ngược lại) cũng ra kết quả đúng / Two-pass DP also works
6. **Follow-up**: "Nếu grid không phải vuông?" → same algorithm, just use m and n separately

---

## Solutions

```typescript
/**
 * Solution 1: Multi-Source BFS (Optimal)
 * Time: O(M × N) — each cell enqueued/dequeued at most once
 * Space: O(M × N) — queue in worst case
 *
 * Enqueue tất cả land (1) cells. BFS ra ngoài. Ô cuối cùng là xa nhất.
 */
function maxDistance(grid: number[][]): number {
  const n = grid.length;
  const queue: [number, number][] = [];

  // Enqueue all land cells
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1) queue.push([r, c]);
    }
  }

  // Edge: all land or all water
  if (queue.length === 0 || queue.length === n * n) return -1;

  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  let maxDist = -1;
  let dist = 0;

  while (queue.length > 0) {
    dist++;
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift()!;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr < 0 || nr >= n || nc < 0 || nc >= n || grid[nr][nc] !== 0) continue;
        grid[nr][nc] = dist + 1; // mark visited with distance+1 (avoid 0/1 confusion)
        maxDist = dist;
        queue.push([nr, nc]);
      }
    }
  }
  return maxDist;
}

/**
 * Solution 2: Two-Pass Dynamic Programming
 * Time: O(M × N) — two linear passes
 * Space: O(M × N) — dp array
 *
 * Pass 1 (top-left→bottom-right): dp[r][c] = min dist from top-left land.
 * Pass 2 (bottom-right→top-left): dp[r][c] = min of both directions.
 * Answer = max(dp) where grid==0.
 */
function maxDistanceDP(grid: number[][]): number {
  const n = grid.length;
  const INF = n * n + 1;
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(INF));

  // Initialize land cells with distance 0
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (grid[r][c] === 1) dp[r][c] = 0;

  // Pass 1: top → bottom, left → right
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (r > 0) dp[r][c] = Math.min(dp[r][c], dp[r - 1][c] + 1);
      if (c > 0) dp[r][c] = Math.min(dp[r][c], dp[r][c - 1] + 1);
    }
  }

  // Pass 2: bottom → top, right → left
  for (let r = n - 1; r >= 0; r--) {
    for (let c = n - 1; c >= 0; c--) {
      if (r < n - 1) dp[r][c] = Math.min(dp[r][c], dp[r + 1][c] + 1);
      if (c < n - 1) dp[r][c] = Math.min(dp[r][c], dp[r][c + 1] + 1);
    }
  }

  let ans = -1;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) if (grid[r][c] === 0) ans = Math.max(ans, dp[r][c]);

  return ans === INF ? -1 : ans;
}

// === Test Cases ===
console.log(
  maxDistance([
    [1, 0, 1],
    [0, 0, 0],
    [1, 0, 1],
  ]),
); // 2
console.log(
  maxDistance([
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]),
); // 4
console.log(
  maxDistance([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]),
); // -1 (no water)
console.log(
  maxDistance([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]),
); // -1 (no land)

console.log(
  maxDistanceDP([
    [1, 0, 1],
    [0, 0, 0],
    [1, 0, 1],
  ]),
); // 2
console.log(
  maxDistanceDP([
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]),
); // 4
```

---

## 🔗 Related Problems

| Problem                                                                                                  | Pattern          | Difficulty |
| -------------------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| [01 Matrix](https://leetcode.com/problems/01-matrix)                                                     | Multi-source BFS | 🟡 Medium  |
| [Rotting Oranges](https://leetcode.com/problems/rotting-oranges)                                         | Multi-source BFS | 🟡 Medium  |
| [Nearest Exit from Entrance in Maze](https://leetcode.com/problems/nearest-exit-from-entrance-in-maze)   | BFS              | 🟡 Medium  |
| [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) | DFS + Memo       | 🔴 Hard    |
