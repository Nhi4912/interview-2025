---
layout: page
title: "Maximal Square"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/maximal-square"
---

# Maximal Square / Hình Vuông Lớn Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: 2D Dynamic Programming
> **Frequency**: ⭐ Tier 2 — Gặp ở 20+ companies

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống như xếp gạch lát sàn — để đặt một viên gạch vuông cỡ 3x3, cả vùng trên, trái, và chéo trên-trái phải đều có gạch. Nếu một trong ba hướng đó yếu nhất (nhỏ nhất), thì hình vuông của bạn bị giới hạn bởi chiều đó. `dp[i][j]` = cạnh của hình vuông lớn nhất kết thúc tại góc dưới-phải `(i,j)`.

**Pattern Recognition:**

- Signal: "largest square of 1s in binary matrix" → **2D DP**
- `dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1` nếu `matrix[i][j] == '1'`
- Ý nghĩa: hình vuông lớn nhất bị giới hạn bởi cạnh ngắn nhất trong 3 hướng

**Visual — matrix:**

```
matrix:        dp table:
1 0 1 0 0      1 0 1 0 0
1 0 1 1 1  →   1 0 1 1 1
1 1 1 1 1      1 1 1 2 2
1 0 0 1 0      1 0 0 1 0

dp[2][3]: matrix='1', min(dp[1][3]=1, dp[2][2]=1, dp[1][2]=1)+1 = 2
dp[2][4]: matrix='1', min(dp[1][4]=1, dp[2][3]=2, dp[1][3]=1)+1 = 2

maxSide = 2 → maxArea = 4 ✅
```

---

## Problem Description

Cho ma trận nhị phân `m x n` gồm `'0'` và `'1'`, tìm hình vuông lớn nhất chỉ chứa `'1'` và trả về diện tích của nó. ([LeetCode 221](https://leetcode.com/problems/maximal-square))

Difficulty: Medium | Acceptance: 48.8%

```
Example 1:
  matrix = [["1","0","1","0","0"],
            ["1","0","1","1","1"],
            ["1","1","1","1","1"],
            ["1","0","0","1","0"]]
  → 4  (hình vuông 2x2)

Example 2:
  matrix = [["0","1"],["1","0"]] → 1

Example 3:
  matrix = [["0"]] → 0
```

Constraints:

- `m == matrix.length`, `n == matrix[i].length`
- `1 <= m, n <= 300`
- `matrix[i][j]` là `'0'` hoặc `'1'`

---

## 📝 Interview Tips

1. **Clarify**: "Matrix chứa chars '0'/'1' hay numbers 0/1?" / Matrix contains char '0'/'1' or numbers?
2. **State**: "`dp[i][j]` = chiều dài cạnh hình vuông lớn nhất có góc dưới-phải tại (i,j)" / dp[i][j] = side length of largest square with bottom-right at (i,j)
3. **Transition**: "`min(top, left, top-left) + 1` — bottleneck là cạnh ngắn nhất" / Bottleneck is the shortest of 3 neighbors
4. **Base cases**: "Hàng 0 và cột 0: dp = matrix value (0 or 1)" / First row and column: dp equals matrix value
5. **Space optimize**: "Chỉ cần prev row → O(n) space với 1 biến extra cho `dp[i-1][j-1]`" / Only need previous row → O(n) space
6. **Answer**: "`maxSide²` — không phải maxSide" / Return maxSide² not maxSide

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Name: Check All Squares
 * Time: O(m*n * min(m,n)²) — check every top-left corner + every side length
 * Space: O(1)
 */
function maximalSquareBrute(matrix: string[][]): number {
  const m = matrix.length,
    n = matrix[0].length;
  let maxSide = 0;

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c] === "0") continue;
      let side = 1;
      outer: while (r + side < m && c + side < n) {
        // Check new row and new column for this side length
        for (let k = 0; k <= side; k++) {
          if (matrix[r + side][c + k] === "0") break outer;
          if (matrix[r + k][c + side] === "0") break outer;
        }
        side++;
      }
      maxSide = Math.max(maxSide, side);
    }
  }
  return maxSide * maxSide;
}

/**
 * Solution 2: 2D DP  ← OPTIMAL
 * Name: Bottom-Up 2D DP
 * Time: O(m*n)
 * Space: O(m*n) — can optimize to O(n)
 */
function maximalSquare(matrix: string[][]): number {
  const m = matrix.length,
    n = matrix[0].length;
  const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  let maxSide = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === "0") {
        dp[i][j] = 0;
        continue;
      }
      if (i === 0 || j === 0) {
        dp[i][j] = 1; // Base case: first row/col
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
      maxSide = Math.max(maxSide, dp[i][j]);
    }
  }
  return maxSide * maxSide;
}

/**
 * Solution 3: Space-Optimized DP
 * Name: Rolling Array DP
 * Time: O(m*n)
 * Space: O(n) — single row
 */
function maximalSquareOptimized(matrix: string[][]): number {
  const m = matrix.length,
    n = matrix[0].length;
  const dp = new Array(n + 1).fill(0);
  let maxSide = 0,
    prev = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      if (matrix[i][j - 1] === "1") {
        dp[j] = Math.min(dp[j], dp[j - 1], prev) + 1;
        maxSide = Math.max(maxSide, dp[j]);
      } else {
        dp[j] = 0;
      }
      prev = temp;
    }
  }
  return maxSide * maxSide;
}

// === Test Cases ===
const m1 = [
  ["1", "0", "1", "0", "0"],
  ["1", "0", "1", "1", "1"],
  ["1", "1", "1", "1", "1"],
  ["1", "0", "0", "1", "0"],
];
console.log(maximalSquare(m1)); // 4
console.log(
  maximalSquare([
    ["0", "1"],
    ["1", "0"],
  ]),
); // 1
console.log(maximalSquare([["0"]])); // 0
console.log(maximalSquare([["1"]])); // 1
console.log(
  maximalSquare([
    ["1", "1"],
    ["1", "1"],
  ]),
); // 4
```
