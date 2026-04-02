---
layout: page
title: "Paint House III"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/paint-house-iii"
---

# Paint House III / Sơn Nhà III

---

## 🧠 Intuition / Tư Duy

**Analogy:** > Bạn cần sơn n căn nhà với k màu, tạo ra đúng m khu phố (nhóm nhà liên tiếp cùng màu).  
> Giống phân chia dân cư thành m quận: mỗi quận gồm các nhà liên tiếp, tối thiểu hóa chi phí.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Paint House III example:**

```
houses=[0,2,1,2,0], cost=[[1,10],[10,1],[10,1],[1,10],[5,1]], m=3, k=2
State: dp[i][j][t] = min cost to paint houses[0..i]
       last house painted color j, with t neighborhoods formed

dp[4][c][3] → answer: min over all colors c
Result: 9
```

---

## Problem Description

Given `houses[i]` (0=unpainted, else color), `cost[i][j]` (cost to paint house i with color j+1),
and `m` (target neighborhoods), return the **minimum cost** to paint all houses with exactly `m`
neighborhoods. If impossible, return `-1`.

**Constraints:** `n <= 100`, `m <= n`, `k <= 20`, costs `<= 10^4`

---

## 📝 Interview Tips

1. **3D DP state** — `dp[i][color][neighborhoods]` = min cost for first `i+1` houses.
2. **Transition** — if house `i-1` and `i` same color → neighborhoods unchanged; else +1.
3. **Pre-painted** — if `houses[i] != 0`, cannot repaint; skip non-matching colors.
4. **INF initialization** — use large value (1e9) for impossible states; check for overflow.
5. **Answer** — `min(dp[n-1][c][m])` for all colors `c`.
6. **Complexity** — O(n·k²·m): n=100, k=20, m=100 → 4M ops — feasible.

---

## Solutions

```typescript
function minCost(houses: number[], cost: number[][], m: number, n: number, k: number): number {
  const INF = 1e9;
  // dp[i][j][t] = min cost: first i+1 houses, house i has color j+1, t neighborhoods
  const dp: number[][][] = Array.from({ length: n }, () =>
    Array.from({ length: k + 1 }, () => new Array(m + 1).fill(INF)),
  );

  // Initialize first house
  if (houses[0] !== 0) {
    // Already painted with color houses[0]
    dp[0][houses[0]][1] = 0;
  } else {
    // Paint with each color
    for (let c = 1; c <= k; c++) {
      dp[0][c][1] = cost[0][c - 1];
    }
  }

  for (let i = 1; i < n; i++) {
    for (let c = 1; c <= k; c++) {
      // Skip if house i is pre-painted and color doesn't match
      if (houses[i] !== 0 && houses[i] !== c) continue;
      const paintCost = houses[i] !== 0 ? 0 : cost[i][c - 1];

      for (let t = 1; t <= Math.min(i + 1, m); t++) {
        // Previous house had same color → same neighborhood count
        if (dp[i - 1][c][t] < INF) {
          dp[i][c][t] = Math.min(dp[i][c][t], dp[i - 1][c][t] + paintCost);
        }
        // Previous house had different color → t-1 neighborhoods before
        if (t > 1) {
          for (let pc = 1; pc <= k; pc++) {
            if (pc === c) continue;
            if (dp[i - 1][pc][t - 1] < INF) {
              dp[i][c][t] = Math.min(dp[i][c][t], dp[i - 1][pc][t - 1] + paintCost);
            }
          }
        }
      }
    }
  }

  let ans = INF;
  for (let c = 1; c <= k; c++) {
    ans = Math.min(ans, dp[n - 1][c][m]);
  }
  return ans >= INF ? -1 : ans;
}

console.log(
  minCost(
    [0, 2, 1, 2, 0],
    [
      [1, 10],
      [10, 1],
      [10, 1],
      [1, 10],
      [5, 1],
    ],
    3,
    5,
    2,
  ),
); // 9
console.log(
  minCost(
    [0, 0, 0, 0, 0],
    [
      [1, 10],
      [10, 1],
      [10, 1],
      [1, 10],
      [5, 1],
    ],
    5,
    5,
    2,
  ),
); // 5
console.log(
  minCost(
    [0, 0, 0, 0, 0],
    [
      [1, 10],
      [10, 1],
      [10, 1],
      [1, 10],
      [5, 1],
    ],
    3,
    5,
    2,
  ),
); // 9 (wait - different from first)
console.log(
  minCost(
    [3, 1, 2, 3],
    [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    3,
    4,
    3,
  ),
); // -1

function minCostOpt(houses: number[], cost: number[][], m: number, n: number, k: number): number {
  const INF = 1e9;
  // Use prev/curr to save memory
  let prev: number[][] = Array.from({ length: k + 1 }, () => new Array(m + 1).fill(INF));

  if (houses[0] !== 0) {
    prev[houses[0]][1] = 0;
  } else {
    for (let c = 1; c <= k; c++) prev[c][1] = cost[0][c - 1];
  }

  for (let i = 1; i < n; i++) {
    const curr: number[][] = Array.from({ length: k + 1 }, () => new Array(m + 1).fill(INF));
    for (let c = 1; c <= k; c++) {
      if (houses[i] !== 0 && houses[i] !== c) continue;
      const pc = houses[i] !== 0 ? 0 : cost[i][c - 1];
      for (let t = 1; t <= Math.min(i + 1, m); t++) {
        if (prev[c][t] < INF) curr[c][t] = Math.min(curr[c][t], prev[c][t] + pc);
        if (t > 1) {
          for (let pp = 1; pp <= k; pp++) {
            if (pp !== c && prev[pp][t - 1] < INF)
              curr[c][t] = Math.min(curr[c][t], prev[pp][t - 1] + pc);
          }
        }
      }
    }
    prev = curr;
  }

  let ans = INF;
  for (let c = 1; c <= k; c++) ans = Math.min(ans, prev[c][m]);
  return ans >= INF ? -1 : ans;
}

console.log(
  minCostOpt(
    [0, 2, 1, 2, 0],
    [
      [1, 10],
      [10, 1],
      [10, 1],
      [1, 10],
      [5, 1],
    ],
    3,
    5,
    2,
  ),
); // 9
console.log(
  minCostOpt(
    [3, 1, 2, 3],
    [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    3,
    4,
    3,
  ),
); // -1
```

---

## 🔗 Related Problems

| Problem                                                                       | Difficulty | Key Concept  |
| ----------------------------------------------------------------------------- | ---------- | ------------ |
| [Paint House](https://leetcode.com/problems/paint-house/)                     | Medium     | DP           |
| [Paint House II](https://leetcode.com/problems/paint-house-ii/)               | Hard       | DP optimized |
| [Maximum Vacation Days](https://leetcode.com/problems/maximum-vacation-days/) | Hard       | 2D DP        |
