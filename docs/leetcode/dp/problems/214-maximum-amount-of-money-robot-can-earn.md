---
layout: page
title: "Maximum Amount of Money Robot Can Earn"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/maximum-amount-of-money-robot-can-earn"
---

# Maximum Amount of Money Robot Can Earn / Robot Kiếm Tiền Tối Đa

## Tương tự thực tế (Vietnamese Analogy)

> Robot di chuyển từ ô trên-trái đến dưới-phải, thu tiền ở mỗi ô. Có tên trộm (ô âm) nhưng robot có thể vô hiệu hóa tối đa 2 tên.  
> Giống đi qua phố có cướp — nếu bạn có 2 lần "vượt qua miễn phí", chọn khôn ngoan hai điểm tệ nhất.

## ASCII Visualization

```
coin = [[1,-1,-1],[2,-1,3]]
dp[i][j][k] = max coins at (i,j) with k robbers neutralized

k=0: must avoid negatives (take negative = lose money)
k=1: can skip 1 negative cell (treat as 0)
k=2: can skip 2 negative cells (both treated as 0)

Optimal path: (0,0)→(1,0)→(1,1)→(1,2)
Coins: 1 + 2 + skip(-1) + 3 = 6, with 1 neutralization
```

## Problem

A robot starts at `(0,0)` and moves only right or down to reach `(m-1, n-1)`.
`coin[i][j]` is the value at each cell (negative = robber steals money).
The robot can **neutralize at most 2 robbers** (treat their cells as 0).
Return the **maximum** coins collected.

**Constraints:** `m, n <= 500`, `-1000 <= coin[i][j] <= 1000`

## Interview Tips

1. **DP state** — `dp[i][j][k]` = max coins at `(i,j)` having neutralized `k` robbers (k=0,1,2).
2. **Transition** — move from `(i-1,j)` or `(i,j-1)`; if `coin[i][j] < 0` can optionally neutralize (+1 to k).
3. **Neutralize choice** — at a robber cell, choose: add `coin[i][j]` (lose money) OR neutralize (add 0, k+1).
4. **Space optimization** — only need previous row; use two 2D arrays.
5. **Base case** — `dp[0][0][0] = coin[0][0]`; if `coin[0][0] < 0`, also `dp[0][0][1] = 0`.
6. **Answer** — `max(dp[m-1][n-1][0..2])`.

## Solutions

### Solution 1: 3D DP — O(m·n) time, O(m·n) space

```typescript
function maximumAmount(coin: number[][]): number {
  const m = coin.length,
    n = coin[0].length;
  const NEG_INF = -Infinity;

  // dp[i][j][k] = max coins at (i,j) with k neutralizations used
  const dp: number[][][] = Array.from({ length: m }, () =>
    Array.from({ length: n }, () => [NEG_INF, NEG_INF, NEG_INF]),
  );

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const val = coin[i][j];
      for (let k = 0; k <= 2; k++) {
        // Get best incoming value from top or left
        let incoming = NEG_INF;
        if (i === 0 && j === 0) {
          incoming = k === 0 ? 0 : k === 1 && val < 0 ? 0 : NEG_INF;
          if (k === 0) dp[i][j][k] = val;
          else if (k === 1 && val < 0) dp[i][j][k] = 0; // neutralize first cell
          continue;
        }
        if (i > 0 && dp[i - 1][j][k] > NEG_INF) incoming = Math.max(incoming, dp[i - 1][j][k]);
        if (j > 0 && dp[i][j - 1][k] > NEG_INF) incoming = Math.max(incoming, dp[i][j - 1][k]);

        if (incoming === NEG_INF) continue;

        // Option 1: take coin as-is
        dp[i][j][k] = Math.max(dp[i][j][k], incoming + val);

        // Option 2: neutralize this robber (only if val < 0 and k > 0)
        if (val < 0 && k > 0) {
          let incK1 = NEG_INF;
          if (i > 0 && dp[i - 1][j][k - 1] > NEG_INF) incK1 = Math.max(incK1, dp[i - 1][j][k - 1]);
          if (j > 0 && dp[i][j - 1][k - 1] > NEG_INF) incK1 = Math.max(incK1, dp[i][j - 1][k - 1]);
          if (incK1 > NEG_INF) dp[i][j][k] = Math.max(dp[i][j][k], incK1); // + 0 (neutralized)
        }
      }
    }
  }

  return Math.max(...dp[m - 1][n - 1]);
}

console.log(
  maximumAmount([
    [1, 2],
    [3, 4],
  ]),
); // 10
console.log(
  maximumAmount([
    [1, -1, -1],
    [2, -1, 3],
  ]),
); // 6
console.log(maximumAmount([[-1]])); // 0 (neutralize it)
console.log(
  maximumAmount([
    [1, -5],
    [3, -2],
  ]),
); // 4
```

### Solution 2: Cleaner 3D DP (unified transition)

```typescript
function maximumAmountV2(coin: number[][]): number {
  const m = coin.length,
    n = coin[0].length;
  const NEG_INF = -1e15;
  const dp: number[][][] = Array.from({ length: m }, () =>
    Array.from({ length: n }, () => new Array(3).fill(NEG_INF)),
  );
  dp[0][0][0] = coin[0][0];
  if (coin[0][0] < 0) dp[0][0][1] = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) continue;
      for (let k = 0; k <= 2; k++) {
        const from: number[] = [];
        if (i > 0) from.push(dp[i - 1][j][k]);
        if (j > 0) from.push(dp[i][j - 1][k]);
        const best = from.reduce((a, b) => Math.max(a, b), NEG_INF);
        if (best > NEG_INF) dp[i][j][k] = Math.max(dp[i][j][k], best + coin[i][j]);

        // Neutralize: use one from k-1 budget
        if (k > 0 && coin[i][j] < 0) {
          const from2: number[] = [];
          if (i > 0) from2.push(dp[i - 1][j][k - 1]);
          if (j > 0) from2.push(dp[i][j - 1][k - 1]);
          const best2 = from2.reduce((a, b) => Math.max(a, b), NEG_INF);
          if (best2 > NEG_INF) dp[i][j][k] = Math.max(dp[i][j][k], best2);
        }
      }
    }
  }

  return Math.max(dp[m - 1][n - 1][0], dp[m - 1][n - 1][1], dp[m - 1][n - 1][2]);
}

console.log(
  maximumAmountV2([
    [1, 2],
    [3, 4],
  ]),
); // 10
console.log(
  maximumAmountV2([
    [1, -1, -1],
    [2, -1, 3],
  ]),
); // 6
console.log(maximumAmountV2([[-1]])); // 0
```

## Related Problems

| Problem                                                             | Difficulty | Key Concept            |
| ------------------------------------------------------------------- | ---------- | ---------------------- |
| [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/) | Medium     | Grid DP                |
| [Unique Paths II](https://leetcode.com/problems/unique-paths-ii/)   | Medium     | Grid DP with obstacles |
| [Cherry Pickup](https://leetcode.com/problems/cherry-pickup/)       | Hard       | Grid DP two passes     |
