---
layout: page
title: "Largest 1-Bordered Square"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/largest-1-bordered-square"
---

# Largest 1-Bordered Square / Hình Vuông Viền 1 Lớn Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming (Prefix sums on matrix)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Maximal Square](https://leetcode.com/problems/maximal-square) | [Count Submatrices With All Ones](https://leetcode.com/problems/count-submatrices-with-all-ones)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Như tìm khung tranh lớn nhất làm từ toàn số 1 — chỉ cần viền 4 cạnh là 1, phần trong không cần quan tâm. Precompute số 1 liên tiếp từ trái (`left`) và từ trên (`top`) tại mỗi ô, rồi kiểm tra mọi ô là góc dưới-phải có thể tạo được hình vuông viền cạnh k không.

**Pattern Recognition:**

- Signal: "1-bordered square in binary matrix" → **DP prefix on left/top consecutive 1s**
- Với mỗi ô (i,j) là góc dưới-phải, thử kích thước k từ lớn đến nhỏ
- Key insight: hình vuông cạnh k hợp lệ khi `left[i][j]>=k`, `top[i][j]>=k`, `left[i-k+1][j]>=k`, `top[i][j-k+1]>=k`

**Visual — grid = [[1,1,1],[1,0,1],[1,1,1]]:**

```
left table:      top table:
1 2 3            1 1 1
1 0 1            2 0 2
1 2 3            3 0 3

Check (i=2,j=2) as bottom-right, k=3:
  left[2][2]=3>=3 ✓, top[2][2]=3>=3 ✓
  left[0][2]=3>=3 ✓ (top-right corner row)
  top[2][0]=3>=3 ✓  (bottom-left corner col)
  → Valid! Area = 3² = 9
```

---

## Problem Description

Given an `m x n` binary matrix `grid`, return the area of the largest square subgrid that has all `1`s on its border, or `0` if no such subgrid exists.

- Example 1: `grid = [[1,1,1],[1,0,1],[1,1,1]]` → `9`
- Example 2: `grid = [[1,1,0,0]]` → `1`

Constraints: `1 <= m, n <= 100`, `grid[i][j]` is `0` or `1`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Chỉ cần viền là 1 — phần trong có thể 0" / Only the border needs to be all 1s
2. **Precompute left/top**: left[i][j] = consecutive 1s ending at (i,j) going left; top same going up
3. **Check 4 corners**: Để verify square of side k with bottom-right at (i,j):
   - Bottom edge: `left[i][j] >= k`
   - Right edge: `top[i][j] >= k`
   - Top edge: `left[i-k+1][j] >= k`
   - Left edge: `top[i][j-k+1] >= k`
4. **Try k from min(left,top) down to 1**: Break as soon as first valid k found
5. **Answer is area = k²**: Return max k² found, or 0 if none
6. **Edge case**: Single 1 in grid → 1x1 square → answer = 1

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Check all possible squares
 * Time: O(m * n * min(m,n)²) — for each cell, for each size, verify all 4 edges
 * Space: O(1) — no extra space
 */
function largest1BorderedSquareBrute(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  let ans = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 1; i + k - 1 < m && j + k - 1 < n; k++) {
        // Check all 4 borders of k×k square with top-left (i,j)
        let valid = true;
        for (let d = 0; d < k && valid; d++) {
          if (!grid[i][j + d] || !grid[i + k - 1][j + d]) valid = false;
          if (!grid[i + d][j] || !grid[i + d][j + k - 1]) valid = false;
        }
        if (valid) ans = Math.max(ans, k * k);
      }
    }
  }
  return ans;
}

/**
 * Solution 2: DP Precompute left/top (Optimal)
 * Time: O(m * n * min(m,n)) — O(mn) build + O(mn·min(m,n)) check
 * Space: O(m * n) — two 2D arrays
 */
function largest1BorderedSquare(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;

  // left[i][j] = consecutive 1s ending at (i,j) going left (horizontal)
  // top[i][j]  = consecutive 1s ending at (i,j) going up (vertical)
  const left: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  const top: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        left[i][j] = j > 0 ? left[i][j - 1] + 1 : 1;
        top[i][j] = i > 0 ? top[i - 1][j] + 1 : 1;
      }
    }
  }

  let ans = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Try each cell (i,j) as bottom-right corner
      const maxK = Math.min(left[i][j], top[i][j]);
      for (let k = maxK; k >= 1; k--) {
        // Check top-right corner (i-k+1, j) and bottom-left corner (i, j-k+1)
        if (top[i][j - k + 1] >= k && left[i - k + 1][j] >= k) {
          ans = Math.max(ans, k * k);
          break; // found largest valid k for this corner
        }
      }
    }
  }

  return ans;
}

// === Test Cases ===
console.log(
  largest1BorderedSquare([
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ]),
); // 9
console.log(largest1BorderedSquare([[1, 1, 0, 0]])); // 1
console.log(
  largest1BorderedSquare([
    [0, 0],
    [0, 0],
  ]),
); // 0
console.log(largest1BorderedSquare([[1]])); // 1
```

---

## 🔗 Related Problems

- [Maximal Square](https://leetcode.com/problems/maximal-square) — find largest all-1 square (not just border)
- [Count Submatrices With All Ones](https://leetcode.com/problems/count-submatrices-with-all-ones) — count submatrices using same left/top technique
- [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle) — largest rectangle of 1s using histogram
- [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum) — 2D DP on matrix
- [Matrix Block Sum](https://leetcode.com/problems/matrix-block-sum) — 2D prefix sums
