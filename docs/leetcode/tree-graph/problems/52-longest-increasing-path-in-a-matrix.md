---
layout: page
title: "Longest Increasing Path in a Matrix"
difficulty: Hard
category: Tree-Graph
tags: [Array, Dynamic Programming, Depth-First Search, Breadth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix"
---

# Longest Increasing Path in a Matrix / Đường Đi Tăng Dần Dài Nhất Trong Ma Trận

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DFS + Memoization (DAG)
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence) | [Number of Increasing Paths in a Grid](https://leetcode.com/problems/number-of-increasing-paths-in-a-grid)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như leo núi — chỉ được bước lên chỗ cao hơn vị trí hiện tại. Không cần "visited" vì không thể quay lại (strictly increasing → no cycles = DAG). Memoize chiều dài đường dài nhất từ mỗi ô.

**Pattern Recognition:**

- Signal: "longest path with monotone condition in grid" → **DFS + memo (no visited needed)**
- Strictly increasing → no cycles → DAG → memoization safe
- Key insight: `memo[r][c]` = chiều dài đường dài nhất bắt đầu từ (r,c)

**Visual — DFS + Memoization:**

```
Matrix:    memo after DFS:
9 9 4      1 1 2
6 6 8  →   1 1 3
2 1 1      4 3 2

DFS(2,0)=4: 2→6→9 (can't go further from 9, but go 2→6→9=3 or 2→6→8=3)
Actually: 1→2→6→9 = length 4 starting from (2,1)=1
→ DFS(2,1): 1→2 ok, 1→6 ok
     DFS(2,0)=2: 2→6→9=3, so DFS(2,0)=3
   1→2→6→9: longest starting (2,1) = 4
```

---

## Problem Description

Cho ma trận `m×n`, tìm độ dài của **đường đi tăng nghiêm ngặt** (strictly increasing, 4 hướng) dài nhất. ([LeetCode](https://leetcode.com/problems/longest-increasing-path-in-a-matrix))

**Example 1:** matrix=[[9,9,4],[6,6,8],[2,1,1]] → Output: `4` (path: 1→2→6→9)

**Example 2:** matrix=[[3,4,5],[3,2,6],[2,2,1]] → Output: `4` (path: 3→4→5→6)

Constraints: `1 <= m,n <= 200`, `0 <= matrix[i][j] <= 2^31-1`

---

## 📝 Interview Tips

1. **Clarify**: "Strictly increasing 4 directions, không được diagonal" / Strictly increasing, 4 directions only (no diagonal)
2. **No visited needed**: "Strictly increasing loại bỏ cycles → không cần visited set" / No cycles in strictly increasing path → no visited array needed
3. **Memoization**: "memo[r][c] = longest path starting here — compute once" / Cache longest path from each cell
4. **Direction**: "Check tất cả 4 hướng từ mỗi cell, chỉ tiến nếu neighbor > curr" / Go to neighbor only if strictly greater
5. **Edge cases**: "1×1 matrix → 1; tất cả cùng giá trị → 1" / 1x1 matrix gives 1; all same values gives 1
6. **Follow-up**: "Đếm số đường đi có độ dài = longest?" / Count number of paths with maximum length → DP variant

---

## Solutions

```typescript
/**
 * Solution 1: DFS + Memoization (top-down DP)
 * Time: O(m·n) — each cell computed once, cached
 * Space: O(m·n) — memo table + recursion stack
 */
function longestIncreasingPath(matrix: number[][]): number {
  const m = matrix.length,
    n = matrix[0].length;
  const memo = Array.from({ length: m }, () => new Array(n).fill(0));
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  function dfs(r: number, c: number): number {
    if (memo[r][c] !== 0) return memo[r][c];
    let best = 1; // minimum: path of length 1 (just this cell)
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (matrix[nr][nc] <= matrix[r][c]) continue; // must be strictly increasing
      best = Math.max(best, 1 + dfs(nr, nc));
    }
    memo[r][c] = best;
    return best;
  }

  let ans = 0;
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) ans = Math.max(ans, dfs(r, c));
  return ans;
}

/**
 * Solution 2: Topological Sort (BFS Kahn's) — iterative
 * Time: O(m·n) — compute in-degrees + BFS all cells
 * Space: O(m·n) — in-degree array + queue
 */
function longestIncreasingPathBFS(matrix: number[][]): number {
  const m = matrix.length,
    n = matrix[0].length;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  // in-degree: count of smaller neighbors (cells that could come before us)
  const inDeg = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && matrix[nr][nc] < matrix[r][c]) inDeg[r][c]++; // nr,nc is a predecessor of r,c
      }
    }
  }
  // Start BFS from cells with no predecessors (local minima)
  const queue: [number, number][] = [];
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (inDeg[r][c] === 0) queue.push([r, c]);

  let levels = 0,
    head = 0;
  while (head < queue.length) {
    const size = queue.length - head;
    levels++;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue[head++];
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
        if (matrix[nr][nc] <= matrix[r][c]) continue;
        if (--inDeg[nr][nc] === 0) queue.push([nr, nc]);
      }
    }
  }
  return levels;
}

// === Test Cases ===
console.log(
  longestIncreasingPath([
    [9, 9, 4],
    [6, 6, 8],
    [2, 1, 1],
  ]),
); // 4
console.log(
  longestIncreasingPath([
    [3, 4, 5],
    [3, 2, 6],
    [2, 2, 1],
  ]),
); // 4
console.log(longestIncreasingPath([[1]])); // 1
console.log(
  longestIncreasingPathBFS([
    [9, 9, 4],
    [6, 6, 8],
    [2, 1, 1],
  ]),
); // 4
```

---

## 🔗 Related Problems

- [Number of Increasing Paths in a Grid](https://leetcode.com/problems/number-of-increasing-paths-in-a-grid) — đếm số đường tăng dần thay vì độ dài → cùng DFS+memo
- [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence) — bản 1D của cùng pattern
- [Out of Boundary Paths](https://leetcode.com/problems/out-of-boundary-paths) — DFS+memo trên grid với hướng di chuyển
- [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) — DP trên array với điều kiện monotone
