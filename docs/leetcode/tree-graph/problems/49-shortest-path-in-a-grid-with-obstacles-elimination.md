---
layout: page
title: "Shortest Path in a Grid with Obstacles Elimination"
difficulty: Hard
category: Tree-Graph
tags: [Array, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination"
---

# Shortest Path in a Grid with Obstacles Elimination / Đường Đi Ngắn Nhất Qua Lưới Có Loại Bỏ Chướng Ngại Vật

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: BFS with Extended State
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Shortest Path in a Grid](https://leetcode.com/problems/shortest-path-in-binary-matrix) | [Cut Off Trees for Golf Event](https://leetcode.com/problems/cut-off-trees-for-golf-event)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như lái xe có `k` lượt phá tường — trạng thái không chỉ là vị trí (row, col) mà còn là số lượt phá còn lại. Hai lần đến cùng ô nhưng khác số lượt phá = 2 trạng thái KHÁC NHAU.

**Pattern Recognition:**

- Signal: "shortest path" + "limited resource (k eliminations)" → **BFS with state = (row, col, remaining_k)**
- State space: m × n × (k+1) — thay vì m × n
- Key insight: visited[r][c][k] ngăn xử lý cùng state nhiều lần

**Visual — State space BFS:**

```
Grid (0=free, 1=obstacle), k=1:
  0 0 0
  0 1 0     State: (row, col, remaining_k)
  0 0 0

BFS from (0,0,k=1):
  → (0,1,1),(1,0,1)
  → (0,2,1),(1,1,0)[uses k!],(2,0,1)
  → (1,2,1),(2,1,1),(2,1,0)
  → (2,2,1) ← reached! distance=4 ✅

Key: (2,1,1) and (2,1,0) are DIFFERENT states
```

---

## Problem Description

Cho grid `m×n` (0=free, 1=obstacle). Bắt đầu từ (0,0), đến (m-1,n-1). Được phép loại bỏ tối đa `k` obstacle. Trả về số bước tối thiểu, hoặc -1 nếu không thể đến. ([LeetCode](https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination))

**Example 1:** grid=[[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k=1 → Output: `6`

**Example 2:** grid=[[0,1,1],[1,1,1],[1,0,0]], k=1 → Output: `-1`

Constraints: `1 <= m,n <= 40`, `0 <= k <= m*n`, `grid[i][j] ∈ {0,1}`, start/end are always 0

---

## 📝 Interview Tips

1. **Clarify**: "k là số obstacle có thể xuyên qua, hay số obstacle có thể xóa?" / k obstacles we can eliminate (pass through)
2. **State**: "State = (row, col, remaining_k) — thiếu k sẽ bị revisit sai" / Must include remaining k in state, not just position
3. **Optimization**: "Nếu k >= m+n-2, luôn có đường thẳng" / If k >= m+n-2, Manhattan path always works → return m+n-2
4. **BFS vs Dijkstra**: "BFS đủ vì mọi bước cost = 1" / BFS sufficient since all steps cost 1
5. **Visited**: "visited[r][c][k] — mark khi enqueue không phải khi dequeue" / Mark visited at enqueue time, not dequeue
6. **Follow-up**: "Nếu mỗi obstacle có chi phí loại bỏ khác nhau?" / Different elimination costs → Dijkstra with priority queue

---

## Solutions

```typescript
/**
 * Solution 1: BFS with state (row, col, k_remaining)
 * Time: O(m·n·k) — each state visited at most once
 * Space: O(m·n·k) — visited array + queue
 */
function shortestPath(grid: number[][], k: number): number {
  const m = grid.length,
    n = grid[0].length;
  if (m === 1 && n === 1) return 0;

  // Optimization: if k is large enough, direct Manhattan path exists
  if (k >= m + n - 2) return m + n - 2;

  // visited[r][c][rem] = true if state (r,c,rem) has been enqueued
  const visited = Array.from({ length: m }, () =>
    Array.from({ length: n }, () => new Array(k + 1).fill(false)),
  );

  // Queue: [row, col, remaining_k, steps]
  const queue: [number, number, number, number][] = [[0, 0, k, 0]];
  visited[0][0][k] = true;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let head = 0;

  while (head < queue.length) {
    const [r, c, rem, steps] = queue[head++];
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (nr === m - 1 && nc === n - 1) return steps + 1;
      const newRem = rem - grid[nr][nc];
      if (newRem < 0) continue; // can't eliminate this obstacle
      if (visited[nr][nc][newRem]) continue;
      visited[nr][nc][newRem] = true;
      queue.push([nr, nc, newRem, steps + 1]);
    }
  }
  return -1;
}

/**
 * Solution 2: BFS with greedy pruning — keep max k per cell
 * Time: O(m·n·k) — same asymptotic, faster in practice
 * Space: O(m·n) — only track max remaining k per cell
 */
function shortestPathOptimized(grid: number[][], k: number): number {
  const m = grid.length,
    n = grid[0].length;
  if (m === 1 && n === 1) return 0;
  if (k >= m + n - 2) return m + n - 2;

  // bestK[r][c] = max k remaining when reaching (r,c)
  const bestK = Array.from({ length: m }, () => new Array(n).fill(-1));
  bestK[0][0] = k;

  const queue: [number, number, number, number][] = [[0, 0, k, 0]];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let head = 0;

  while (head < queue.length) {
    const [r, c, rem, steps] = queue[head++];
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (nr === m - 1 && nc === n - 1) return steps + 1;
      const newRem = rem - grid[nr][nc];
      if (newRem < 0 || newRem <= bestK[nr][nc]) continue;
      bestK[nr][nc] = newRem;
      queue.push([nr, nc, newRem, steps + 1]);
    }
  }
  return -1;
}

// === Test Cases ===
console.log(
  shortestPath(
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 0, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    1,
  ),
); // 6
console.log(
  shortestPath(
    [
      [0, 1, 1],
      [1, 1, 1],
      [1, 0, 0],
    ],
    1,
  ),
); // -1
console.log(shortestPath([[0]], 0)); // 0
console.log(
  shortestPath(
    [
      [0, 0],
      [0, 0],
    ],
    0,
  ),
); // 2
```

---

## 🔗 Related Problems

- [Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix) — BFS không có k, đơn giản hơn
- [Minimum Knight Moves](https://leetcode.com/problems/minimum-knight-moves) — BFS với state = position
- [Jump Game IV](https://leetcode.com/problems/jump-game-iv) — BFS với extended state
- [Cut Off Trees for Golf Event](https://leetcode.com/problems/cut-off-trees-for-golf-event) — multi-BFS trên grid với obstacles
