---
layout: page
title: "Minimum Path Sum"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/minimum-path-sum"
---

# Minimum Path Sum / Tổng Đường Đi Nhỏ Nhất

> **Track**: DP | **Difficulty**: 🟡 Medium | **Pattern**: 2D Dynamic Programming
> **Frequency**: 📗 Tier 2 — Gặp ở 25+ companies (Amazon, Google, Facebook)
> **See also**: [Unique Paths](https://leetcode.com/problems/unique-paths) | [Triangle](https://leetcode.com/problems/triangle)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang đi từ góc trên-trái đến góc dưới-phải của một bản đồ có chi phí di chuyển. Mỗi ô chỉ đến được từ ô trên hoặc ô trái — bạn chọn đường rẻ hơn. Đây là bài toán DP 2D cổ điển: `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`.

**Pattern Recognition:**

- Signal: "grid path", "only right or down", "minimum cost" → **2D DP**
- `dp[i][j]` = min cost to reach cell (i,j) from (0,0)
- Space optimization: in-place hoặc rolling 1D array

**Visual — dp table build-up:**

```
Grid:           dp table:
1  3  1        1   4   5
1  5  1   →    2   7   6
4  2  1        6   8   7 ✅

dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
Answer = dp[n-1][m-1] = 7
Path: (0,0)→(0,1)→(0,2)→(1,2)→(2,2) = 1+3+1+1+1 = 7
```

---

## Problem Description

Given an `m × n` grid filled with non-negative numbers, find a path from top-left to bottom-right that minimizes the sum of all numbers along the path. You can only move right or down at each step.

```
Example 1: grid=[[1,3,1],[1,5,1],[4,2,1]] → 7  (1→3→1→1→1)
Example 2: grid=[[1,2,3],[4,5,6]] → 12  (1→2→3→6)
```

Constraints: `1 <= m, n <= 200`, `0 <= grid[i][j] <= 200`

---

## 📝 Interview Tips

1. **Clarify**: "Chỉ đi phải/xuống? Grid có giá trị âm không?" / Confirm directions and value range.
2. **State**: `dp[i][j]` = min cost to reach (i,j) — transition từ trên và trái.
3. **Base cases**: First row accumulates horizontally; first column accumulates vertically.
4. **In-place**: Modify grid directly to save O(mn) space — acceptable if input can be mutated.
5. **1D rolling**: Chỉ cần 1 hàng trước đó → O(n) space — mention as follow-up optimization.
6. **Edge**: 1×1 grid → return grid[0][0]; single row/column → linear sum.

---

## Solutions

```typescript
/**
 * Solution 1: 2D DP with separate dp table
 * Time: O(mn) — visit every cell once
 * Space: O(mn) — full dp table
 */
function minPathSum1(grid: number[][]): number {
  const n = grid.length,
    m = grid[0].length;
  const dp: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));

  dp[0][0] = grid[0][0];
  for (let j = 1; j < m; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];
  for (let i = 1; i < n; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];

  for (let i = 1; i < n; i++) {
    for (let j = 1; j < m; j++) {
      dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[n - 1][m - 1];
}

/**
 * Solution 2: In-place modification (O(1) extra space)
 * Time: O(mn)
 * Space: O(1) — mutates the input grid
 *
 * Same recurrence but writes directly into grid[i][j].
 * Trade-off: destroys input — ask interviewer if that's acceptable.
 */
function minPathSum2(grid: number[][]): number {
  const n = grid.length,
    m = grid[0].length;

  for (let j = 1; j < m; j++) grid[0][j] += grid[0][j - 1];
  for (let i = 1; i < n; i++) grid[i][0] += grid[i - 1][0];

  for (let i = 1; i < n; i++) {
    for (let j = 1; j < m; j++) {
      grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
    }
  }
  return grid[n - 1][m - 1];
}

/**
 * Solution 3: 1D Rolling Array
 * Time: O(mn)
 * Space: O(n) — single array representing current row, updated column by column
 *
 * dp[j] after processing row i = min cost to reach (i, j).
 * dp[j] = grid[i][j] + min(dp[j] /*from above*\/, dp[j-1] /*from left*\/)
 */
function minPathSum(grid: number[][]): number {
  const n = grid.length,
    m = grid[0].length;
  const dp = new Array(m).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (i === 0 && j === 0) dp[j] = grid[0][0];
      else if (i === 0) dp[j] = dp[j - 1] + grid[i][j];
      else if (j === 0) dp[j] = dp[j] + grid[i][j];
      else dp[j] = grid[i][j] + Math.min(dp[j], dp[j - 1]);
    }
  }
  return dp[m - 1];
}

// === Test Cases ===
console.log(
  minPathSum([
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1],
  ]),
); // 7
console.log(
  minPathSum([
    [1, 2, 3],
    [4, 5, 6],
  ]),
); // 12
console.log(minPathSum([[1]])); // 1
console.log(
  minPathSum1([
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1],
  ]),
); // 7
console.log(
  minPathSum2([
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1],
  ]),
); // 7
```

---

## 🔗 Related Problems

| Problem                                                                                  | Relationship                           |
| ---------------------------------------------------------------------------------------- | -------------------------------------- |
| [62. Unique Paths](https://leetcode.com/problems/unique-paths/)                          | Same grid DP, count paths (no weights) |
| [63. Unique Paths II](https://leetcode.com/problems/unique-paths-ii/)                    | Add obstacle constraint to grid DP     |
| [64. Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/)                  | This problem                           |
| [120. Triangle](https://leetcode.com/problems/triangle/)                                 | Same min-path DP on triangle shape     |
| [931. Minimum Falling Path Sum](https://leetcode.com/problems/minimum-falling-path-sum/) | Diagonal moves allowed variant         |
