---
layout: page
title: "Unique Paths III"
difficulty: Hard
category: Backtracking
tags: [Array, Backtracking, Bit Manipulation, Matrix]
leetcode_url: "https://leetcode.com/problems/unique-paths-iii"
---

# Unique Paths III / Đường Đi Độc Nhất III

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking (Grid DFS)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Unique Paths II](https://leetcode.com/problems/unique-paths-ii) | [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đi lau sàn nhà — bạn phải đi qua mọi ô trống đúng một lần trước khi về điểm đích. Mỗi bước đi là một "choose", quay đầu là "un-choose".

**Pattern Recognition:**

- Signal: "walk every cell exactly once" → **Grid Backtracking**
- Đếm số empty cells trước, mỗi path hợp lệ phải thăm đúng tất cả
- Key insight: dùng `remaining` counter thay vì `visited` matrix để prune nhanh hơn

**Visual — Grid Backtracking:**

```
grid:  1=start  2=end  0=empty  -1=obstacle
[ 1  0  0 ]     empty cells = 4 (including start/end)
[ 0  0  0 ]
[ 0  0  2 ]

DFS from (0,0): must visit all 0s before reaching (2,2)
Path 1: → → ↓ ↓ ← ← ↓ ↓ →  ✓ (visits all)
Prune:  if remaining > reachable cells → cut branch
```

---

## Problem Description

On a 2D grid, `1` = start, `2` = end, `0` = empty, `-1` = obstacle. ([LeetCode 980](https://leetcode.com/problems/unique-paths-iii))

Return the number of 4-directional walks from start to end that walk over **every non-obstacle cell exactly once**.

**Example 1:** `grid = [[1,0,0],[0,0,0],[0,0,2]]` → `2`
**Example 2:** `grid = [[1,0,0],[0,0,0],[0,0,2],[0,-1,0]]` → `0`

Constraints: `1 <= m, n <= 20`, values in `{-1, 0, 1, 2}`

---

## 📝 Interview Tips

1. **Clarify**: "Đi qua obstacle được không? Có thể thăm lại không?" / Obstacles can't be visited; no cell revisited
2. **Count empties first**: "Đếm số ô cần thăm trước khi DFS" / Pre-count empty+start+end cells
3. **Pruning**: "remaining == 0 và ở điểm end → count++" / Only count when ALL cells visited
4. **State**: "Dùng visited[][] hoặc bitmask cho nhỏ" / Visited array sufficient; bitmask for optimization
5. **Complexity**: "4^(m\*n) worst case nhưng pruning cắt rất nhiều" / Exponential but heavily pruned

---

## Solutions

```typescript
/**
 * Solution 1: Backtracking with visited array
 * Time: O(4^(m*n)) — heavily pruned in practice
 * Space: O(m*n) — recursion stack + visited array
 */
function uniquePathsIII(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  let startR = 0,
    startC = 0,
    totalToVisit = 0;

  // Count all non-obstacle cells; find start
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] !== -1) totalToVisit++;
      if (grid[r][c] === 1) {
        startR = r;
        startC = c;
      }
    }
  }

  let result = 0;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function dfs(r: number, c: number, visited: number): void {
    if (grid[r][c] === 2) {
      // End cell — valid only if visited all non-obstacle cells
      if (visited === totalToVisit) result++;
      return;
    }
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (grid[nr][nc] === -1) continue;
      // Encode visited as bitmask index
      const idx = nr * n + nc;
      if ((visited >> idx) & 1) continue; // already visited
      dfs(nr, nc, visited | (1 << idx));
    }
  }

  const startIdx = startR * n + startC;
  dfs(startR, startC, 1 << startIdx); // mark start as visited
  return result;
}

/**
 * Solution 2: Backtracking with in-place marking (cleaner)
 * Time: O(4^(m*n)) — same complexity, no bitmask overhead
 * Space: O(m*n) — recursion depth
 */
function uniquePathsIIIClean(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  let startR = 0,
    startC = 0,
    remaining = 0;

  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) {
      if (grid[r][c] !== -1) remaining++;
      if (grid[r][c] === 1) {
        startR = r;
        startC = c;
      }
    }

  let result = 0;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function dfs(r: number, c: number, rem: number): void {
    if (grid[r][c] === 2) {
      if (rem === 1) result++; // end cell counts as 1 remaining
      return;
    }
    const orig = grid[r][c];
    grid[r][c] = -1; // mark visited
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (grid[nr][nc] === -1) continue;
      dfs(nr, nc, rem - 1);
    }
    grid[r][c] = orig; // unmark
  }

  dfs(startR, startC, remaining);
  return result;
}

// === Test Cases ===
console.log(
  uniquePathsIIIClean([
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 2],
  ]),
); // 2
console.log(
  uniquePathsIIIClean([
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 2],
    [0, -1, 0],
  ]),
); // 0
console.log(
  uniquePathsIIIClean([
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 2, -1],
  ]),
); // 4
```

---

## 🔗 Related Problems

- [Unique Paths II](https://leetcode.com/problems/unique-paths-ii) — same grid, DP with obstacles
- [Word Search](https://leetcode.com/problems/word-search) — same pattern: Grid DFS backtracking
- [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement) — same: visit all positions once
- [Hamiltonian Path](https://en.wikipedia.org/wiki/Hamiltonian_path) — theoretical equivalent
- [Unique Paths III — LeetCode](https://leetcode.com/problems/unique-paths-iii) — problem page
