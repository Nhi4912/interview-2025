---
layout: page
title: "Unique Paths II"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/unique-paths-ii"
---

# Unique Paths II / Số Đường Đi Duy Nhất II (Có Chướng Ngại Vật)

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: 2D DP with Obstacle Handling
> **Frequency**: 📘 Tier 3 — Gặp ở 18 companies
> **See also**: [Unique Paths](https://leetcode.com/problems/unique-paths) | [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Hãy tưởng tượng đi từ nhà đến trường qua các con đường một chiều (chỉ đi thẳng hoặc rẽ phải). Một số giao lộ bị chặn do sửa đường (chướng ngại vật). Số cách đến một giao lộ = số cách từ trên xuống + số cách từ trái sang — nếu giao lộ bị chặn thì bằng 0.

**Pattern Recognition:**

- Signal: "grid" + "only right/down moves" + "obstacles" → **2D DP**
- `dp[i][j]` = số đường đến ô (i, j)
- Nếu `grid[i][j] == 1` (obstacle) → `dp[i][j] = 0`
- Else: `dp[i][j] = dp[i-1][j] + dp[i][j-1]`
- Optimize to 1D: `dp[j] += dp[j-1]` (reuse same row)

**Visual — obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]:**

```
Grid (1=obstacle):      DP table:
  0  0  0               1  1  1
  0  1  0               1  0  1
  0  0  0               1  1  2 ← answer

Fill order (row by row):
dp[0][0]=1 (start), dp[0][1]=1, dp[0][2]=1  (first row: only from left)
dp[1][0]=1 (only from above)
dp[1][1]=0 (OBSTACLE → 0)
dp[1][2]=dp[0][2]+dp[1][1]=1+0=1
dp[2][0]=1, dp[2][1]=dp[1][1]+dp[2][0]=0+1=1, dp[2][2]=dp[1][2]+dp[2][1]=1+1=2 ✅
```

---

## Problem Description

Given an `m × n` grid where `1` means obstacle and `0` means open, a robot starts at `(0,0)` and must reach `(m-1, n-1)` using only right or down moves. Return the number of unique paths avoiding all obstacles. ([LeetCode 63](https://leetcode.com/problems/unique-paths-ii))

```
Input: obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]  → Output: 2
Input: obstacleGrid = [[0,1],[0,0]]              → Output: 1
Input: obstacleGrid = [[1,0]]                    → Output: 0 (start blocked)
```

Constraints: `1 <= m, n <= 100`, `grid[i][j]` is `0` or `1`

---

## 📝 Interview Tips

1. **Clarify**: "Chỉ đi phải và xuống — không đi ngược / Only right and down, no backtracking"
2. **Start/end obstacle**: "Nếu start hoặc end là obstacle → return 0 ngay / Early return if start or end is blocked"
3. **Base case**: "First row/column: nếu gặp obstacle thì mọi ô sau đó trong cùng hàng/cột = 0" / Obstacle in first row/col blocks all after it
4. **State**: "dp[i][j] = paths reaching (i,j) = 0 if obstacle, else dp[i-1][j]+dp[i][j-1]" / Clear state definition
5. **Space optimize**: "1D array: duyệt từng hàng, dp[j] += dp[j-1] (bỏ qua obstacle)" / Roll to 1D for O(n) space
6. **Overflow**: "m=n=100, paths có thể rất lớn nhưng fits trong int / Paths fit in 32-bit int for 100×100"

---

## Solutions

```typescript
/**
 * Solution 1: Recursion + Memoization (Top-Down)
 * Name: Top-Down DP
 * Time: O(m*n) — each cell computed once
 * Space: O(m*n) — memo + call stack
 */
function uniquePathsWithObstaclesMemo(obstacleGrid: number[][]): number {
  const m = obstacleGrid.length,
    n = obstacleGrid[0].length;
  const memo: number[][] = Array.from({ length: m }, () => new Array(n).fill(-1));

  function dp(i: number, j: number): number {
    if (i < 0 || j < 0 || obstacleGrid[i][j] === 1) return 0;
    if (i === 0 && j === 0) return 1;
    if (memo[i][j] !== -1) return memo[i][j];
    return (memo[i][j] = dp(i - 1, j) + dp(i, j - 1));
  }

  return dp(m - 1, n - 1);
}

/**
 * Solution 2: Bottom-Up 2D DP (Recommended)
 * Name: 2D DP Table
 * Time: O(m*n) — fill entire grid
 * Space: O(m*n) — dp table
 */
function uniquePathsWithObstacles(obstacleGrid: number[][]): number {
  const m = obstacleGrid.length,
    n = obstacleGrid[0].length;
  if (obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n - 1] === 1) return 0;

  const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  dp[0][0] = 1;

  // fill first column
  for (let i = 1; i < m; i++) {
    dp[i][0] = obstacleGrid[i][0] === 1 ? 0 : dp[i - 1][0];
  }
  // fill first row
  for (let j = 1; j < n; j++) {
    dp[0][j] = obstacleGrid[0][j] === 1 ? 0 : dp[0][j - 1];
  }
  // fill rest
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = obstacleGrid[i][j] === 1 ? 0 : dp[i - 1][j] + dp[i][j - 1];
    }
  }

  return dp[m - 1][n - 1];
}

/**
 * Solution 3: 1D DP (Space Optimized)
 * Name: 1D Rolling Array
 * Time: O(m*n)
 * Space: O(n) — single row
 */
function uniquePathsWithObstacles1D(obstacleGrid: number[][]): number {
  const m = obstacleGrid.length,
    n = obstacleGrid[0].length;
  const dp = new Array(n).fill(0);
  dp[0] = 1; // start

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (obstacleGrid[i][j] === 1) {
        dp[j] = 0; // obstacle: no paths through here
      } else if (j > 0) {
        dp[j] += dp[j - 1]; // add paths from left
      }
    }
  }

  return dp[n - 1];
}

// === Test Cases ===
console.log(
  uniquePathsWithObstacles([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]),
); // 2
console.log(
  uniquePathsWithObstacles([
    [0, 1],
    [0, 0],
  ]),
); // 1
console.log(uniquePathsWithObstacles([[1, 0]])); // 0
console.log(
  uniquePathsWithObstacles1D([
    [0, 0],
    [0, 0],
  ]),
); // 2
console.log(
  uniquePathsWithObstaclesMemo([
    [0, 0, 0],
    [0, 0, 0],
  ]),
); // 3
```

---

## 🔗 Related Problems

| Problem | Relationship |
|---|---|
| [Unique Paths](https://leetcode.com/problems/unique-paths) | Same grid DP without obstacles (use math: C(m+n-2, m-1)) |
| [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum) | Same 2D DP grid traversal, minimize sum instead of count paths |
| [Maximal Square](https://leetcode.com/problems/maximal-square) | 2D DP on matrix — dp[i][j] depends on neighbors |
| [Cherry Pickup](https://leetcode.com/problems/cherry-pickup) | Extended: two robots on same grid, 3D DP |
| [Dungeon Game](https://leetcode.com/problems/dungeon-game) | Grid DP with health constraint — fill bottom-right to top-left |
