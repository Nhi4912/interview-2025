---
layout: page
title: "Minimum Falling Path Sum II"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/minimum-falling-path-sum-ii"
---

# Minimum Falling Path Sum II / Minimum Falling Path Sum II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximal Square](https://leetcode.com/problems/maximal-square) | [Unique Paths II](https://leetcode.com/problems/unique-paths-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như giọt mưa rơi qua các tầng nhà — mỗi tầng phải chọn một cột khác với tầng trước. Mẹo: chỉ cần nhớ hai giá trị nhỏ nhất của hàng trước thay vì toàn bộ hàng.

**Visual — Grid 3×3, falling path avoiding same column:**

```
Grid:            DP values:
[1, 2, 3]        row0: [1,  2,  3 ]
[4, 5, 6]        row1: [6,  5,  6 ]  (col1=1+4? No — can't use same col)
[7, 8, 9]              dp[1][0] = min(dp[0][1], dp[0][2]) + grid[1][0]
                                = min(2,3) + 4 = 6
                       dp[1][1] = min(dp[0][0], dp[0][2]) + 5
                                = min(1,3) + 5 = 6  (wrong col same)
                       dp[1][2] = min(dp[0][0], dp[0][1]) + 6
                                = min(1,2) + 6 = 7

Key trick: track min1, min2, minCol from previous row
→ dp[i][j] = (j==minCol ? min2 : min1) + grid[i][j]
→ O(n²) time, O(1) extra space per row
```

---

## Problem Description

Given an `n x n` integer matrix `grid`, return the minimum sum of a **falling path with non-zero shifts**. A falling path visits exactly one element per row, and no two adjacent rows can use the same column index. ([LeetCode](https://leetcode.com/problems/minimum-falling-path-sum-ii))

Difficulty: Hard | Acceptance: 63.8%

**Example 1:**

```
Input: grid = [[1,2,3],[4,5,6],[7,8,9]]
Output: 13
Explanation: 1 → 5 → 7 (columns 0,1,0) = 13
```

**Example 2:**

```
Input: grid = [[7]]
Output: 7
```

Constraints:

- `n == grid.length == grid[i].length`
- `1 <= n <= 200`
- `-99 <= grid[i][j] <= 99`

---

## 📝 Interview Tips

1. **Clarify**: "Adjacent rows không thể dùng cùng cột — khác với Falling Path I (chỉ cần cột liền kề)" / Confirm non-adjacent columns rule.
2. **Brute force**: "O(n³): với mỗi ô, duyệt toàn bộ hàng trước trừ cùng cột" / Naive O(n³) checks all previous row cells.
3. **Key insight**: "Chỉ cần min1 và min2 của hàng trước — nếu j trùng cột min1, dùng min2" / Track two minimums to avoid O(n) inner scan.
4. **Transition**: "dp[i][j] = grid[i][j] + (j==minCol ? secondMin : firstMin)" / Clean O(1) per cell transition.
5. **Edge cases**: "n=1 → chỉ một ô, trả về grid[0][0]" / Single cell is trivially the answer.
6. **Space optimize**: "Có thể mutate grid in-place hoặc chỉ dùng O(n) cho prev row" / Rolling array reduces space.

---

## Solutions

```typescript
/**
 * Solution 1: DP with full row scan (O(n³))
 * Time: O(n³) — for each of n² cells, scan n previous values
 * Space: O(n²) — dp table
 */
function minFallingPathSumIISlow(grid: number[][]): number {
  const n = grid.length;
  const dp: number[][] = grid.map((row) => [...row]);

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let best = Infinity;
      for (let k = 0; k < n; k++) {
        if (k !== j) best = Math.min(best, dp[i - 1][k]);
      }
      dp[i][j] = grid[i][j] + best;
    }
  }

  return Math.min(...dp[n - 1]);
}

/**
 * Solution 2: DP with two-minimum optimization (O(n²))
 * Time: O(n²) — track min1/min2 per row, O(1) per cell
 * Space: O(n) — only previous row needed
 */
function minFallingPathSumII(grid: number[][]): number {
  const n = grid.length;
  if (n === 1) return grid[0][0];

  let prev = [...grid[0]];

  for (let i = 1; i < n; i++) {
    // Find first and second minimums of previous row
    let min1 = Infinity,
      min2 = Infinity,
      minCol = -1;
    for (let j = 0; j < n; j++) {
      if (prev[j] < min1) {
        min2 = min1;
        min1 = prev[j];
        minCol = j;
      } else if (prev[j] < min2) {
        min2 = prev[j];
      }
    }

    const curr = new Array(n);
    for (let j = 0; j < n; j++) {
      curr[j] = grid[i][j] + (j === minCol ? min2 : min1);
    }
    prev = curr;
  }

  return Math.min(...prev);
}

// === Test Cases ===
console.log(
  minFallingPathSumII([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
); // 13
console.log(minFallingPathSumII([[7]])); // 7
console.log(
  minFallingPathSumII([
    [-73, 61, 43, -48, -36],
    [3, 3, 32, -4, -20],
    [96, -127, 99, -14, 51],
    [20, -4, 52, 10, -5],
    [15, -9, 53, 46, -48],
  ]),
); // -660
```

---

## 🔗 Related Problems

- [Maximal Square](https://leetcode.com/problems/maximal-square) — same pattern: Dynamic Programming
- [Unique Paths II](https://leetcode.com/problems/unique-paths-ii) — same pattern: Dynamic Programming
- [Minimum Falling Path Sum](https://leetcode.com/problems/minimum-falling-path-sum) — simpler version without column constraint
- [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum) — same pattern: Dynamic Programming
- [Minimum Falling Path Sum II — LeetCode](https://leetcode.com/problems/minimum-falling-path-sum-ii) — problem page
