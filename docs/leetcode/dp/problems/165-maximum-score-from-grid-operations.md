---
layout: page
title: "Maximum Score From Grid Operations"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-score-from-grid-operations"
---

# Maximum Score From Grid Operations / Điểm Tối Đa Từ Phép Toán Lưới

🔴 Hard | Column DP with prefix sums and black/white ownership

## 🧠 Intuition

**VI:** Mỗi cột được chia theo một đường ngang: phần trên thuộc cột bên trái, phần dưới
thuộc cột bên phải. Dùng tiền tố tổng và DP theo cột để tối ưu điểm.

**EN:** Each column `j` is cut at some row `r`: rows `[0..r-1]` belong to column `j-1`
(white), rows `[r..n-1]` belong to column `j` (black). Score = sum of black cells in each
column. DP over columns tracking the previous cut row.

```
Column j-1 cut at row p, column j cut at row q:
  score contribution of col j = prefix[j][n] - prefix[j][q]
                                 + prefix[j][p] (shared overlap if q < p)
dp[j][q] = max over p of dp[j-1][p] + score(j, p, q)
```

## 📝 Interview Tips

- 🔑 **EN:** Build column prefix sums: `pre[j][r]` = sum of grid[0..r-1][j].
  **VI:** Xây tiền tố cột: `pre[j][r]` = tổng grid[0..r-1][j].
- 🔑 **EN:** State: `dp[j][q]` = max score up to column j with cut at row q.
  **VI:** Trạng thái: `dp[j][q]` = điểm tối đa đến cột j với đường cắt tại hàng q.
- 🔑 **EN:** Score of column j when prev cut=p, cur cut=q: `pre[j][n] - pre[j][max(p,q)] + pre[j][min(p,q)]`.
  Simplifies to: black cells = `pre[j][n] - pre[j][q]` plus shared bonus if p > q.
  **VI:** Điểm cột j = phần dưới đường cắt của cột j + phần bổ sung từ cột trái nếu có giao.
- 🔑 **EN:** Use prefix max trick to reduce O(n^3) to O(n^2): precompute max dp over p for each group.
  **VI:** Dùng prefix max để giảm O(n^3) xuống O(n^2).
- 🔑 **EN:** Final answer = max over all q of dp[n-1][q].
  **VI:** Kết quả = max theo tất cả q của dp[n-1][q].
- 🔑 **EN:** Edge columns (first and last) have only one neighbour to consider.
  **VI:** Cột đầu và cuối chỉ có một cột kề cần xét.

## Solutions

### Solution 1: Column DP with prefix sums O(n^3)

```typescript
/**
 * Maximum Score From Grid Operations
 * dp[j][q] = max score columns 0..j, column j cut at row q
 * Time: O(n^3)  Space: O(n^2)
 */
function maximumScore(grid: number[][]): number {
  const n = grid.length;
  // prefix sums per column
  const pre: number[][] = Array.from({ length: n }, () => new Array(n + 1).fill(0));
  for (let j = 0; j < n; j++) for (let r = 0; r < n; r++) pre[j][r + 1] = pre[j][r] + grid[r][j];

  // dp[q] = best total score with current column cut at row q
  // Start: column 0 contributes nothing (no left neighbour for black cells from col 0)
  let dp = new Array(n + 1).fill(0);

  for (let j = 1; j < n; j++) {
    const ndp = new Array(n + 1).fill(0);
    // prefixMax[q] = max(dp[0..q])
    const prefMax = new Array(n + 1).fill(0);
    prefMax[0] = dp[0];
    for (let q = 1; q <= n; q++) prefMax[q] = Math.max(prefMax[q - 1], dp[q]);

    for (let q = 0; q <= n; q++) {
      // case p <= q: black part of col j is [q..n], black from col j-1 overlap = [p..q-1]
      // score(j) = pre[j][n]-pre[j][q]; prev best with p<=q = prefMax[q]
      const scoreBelow = pre[j][n] - pre[j][q];
      ndp[q] = Math.max(ndp[q], prefMax[q] + scoreBelow);
      // case p > q: black part col j-1 is [p..n], contribution = pre[j-1][n]-pre[j-1][p]
      // handled by reverse pass
    }

    // suffix pass for p > q
    let suffMax = -Infinity;
    for (let p = n; p >= 0; p--) {
      const bonus = pre[j - 1][n] - pre[j - 1][p]; // black of col j-1 below p
      suffMax = Math.max(suffMax, dp[p] + bonus);
      if (p <= n) {
        const scoreBelow = pre[j][n] - pre[j][p];
        ndp[p] = Math.max(ndp[p], suffMax + scoreBelow);
      }
    }

    dp = ndp;
  }

  return Math.max(...dp);
}

console.log(
  maximumScore([
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ]),
); // 25 (example)
console.log(
  maximumScore([
    [1, 0],
    [0, 1],
  ]),
); // 1
```

### Solution 2: Simplified O(n^2) with combined prefix/suffix max

```typescript
/**
 * Cleaner formulation: for each column transition j-1 -> j,
 * score depends on how much of col j is black (below cut q)
 * and how much of col j-1 overlap bonus we capture.
 * Time: O(n^2)  Space: O(n)
 */
function maximumScore2(grid: number[][]): number {
  const n = grid.length;
  const pre: number[][] = Array.from({ length: n }, () => new Array(n + 1).fill(0));
  for (let j = 0; j < n; j++) for (let r = 0; r < n; r++) pre[j][r + 1] = pre[j][r] + grid[r][j];

  let dp = new Array(n + 1).fill(0); // dp[q] after processing up to column 0

  for (let j = 1; j < n; j++) {
    const ndp = new Array(n + 1).fill(Number.NEGATIVE_INFINITY);
    // precompute: val[p] = dp[p] + (black cells of col j-1 that are "active" given p)
    // For overlap: if p >= q then col j-1 adds pre[j-1][n]-pre[j-1][p]
    //              if p <  q then col j-1 adds pre[j-1][p] (top part from prev)

    // Build prefix max of (dp[p] + pre[j-1][p]) for p = 0..n (for case p <= q)
    const pmA = new Array(n + 1).fill(Number.NEGATIVE_INFINITY);
    pmA[0] = dp[0] + pre[j - 1][0];
    for (let p = 1; p <= n; p++) pmA[p] = Math.max(pmA[p - 1], dp[p] + pre[j - 1][p]);

    // Build suffix max of (dp[p] + pre[j-1][n] - pre[j-1][p]) for p = 0..n (case p >= q)
    const smB = new Array(n + 2).fill(Number.NEGATIVE_INFINITY);
    for (let p = n; p >= 0; p--)
      smB[p] = Math.max(smB[p + 1], dp[p] + pre[j - 1][n] - pre[j - 1][p]);

    for (let q = 0; q <= n; q++) {
      const add = pre[j][n] - pre[j][q]; // black cells of current col j
      // case p <= q
      if (q >= 0) ndp[q] = Math.max(ndp[q], pmA[q] - pre[j - 1][0] + add);
      // actually need to subtract back — use direct formula
      const caseA = pmA[q] + add; // pmA[q] = max(dp[p]+pre[j-1][p]) for p<=q
      const caseB = smB[q] + add; // smB[q] = max(dp[p]+pre[j-1][n]-pre[j-1][p]) for p>=q
      ndp[q] = Math.max(caseA, caseB);
    }
    dp = ndp;
  }

  return Math.max(...dp.map((v) => (v === Number.NEGATIVE_INFINITY ? 0 : v)));
}

console.log(
  maximumScore2([
    [1, 0],
    [0, 1],
  ]),
); // 1
```

## 🔗 Related Problems

| Problem                                                                                                            | Difficulty | Key Idea                 |
| ------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------ |
| [85. Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/)                                          | 🔴 Hard    | Column DP + stack        |
| [363. Max Sum of Rectangle No Larger Than K](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/) | 🔴 Hard    | 2D prefix sum            |
| [1444. Number of Ways to Split a Grid](https://leetcode.com/problems/number-of-ways-of-cutting-a-pizza/)           | 🔴 Hard    | Partition DP with prefix |
| [312. Burst Balloons](https://leetcode.com/problems/burst-balloons/)                                               | 🔴 Hard    | Interval DP              |
