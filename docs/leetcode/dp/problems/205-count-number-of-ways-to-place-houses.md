---
layout: page
title: "Count Number of Ways to Place Houses"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/count-number-of-ways-to-place-houses"
---

## 🏠 2320. Count Number of Ways to Place Houses / Đếm Số Cách Đặt Nhà

**Difficulty:** 🟡 Medium

---

## 🧠 Intuition

**Analogy (Vietnamese):** Hai dãy đất đối diện nhau, mỗi dãy có `n` lô. Bạn đặt nhà vào các lô sao cho **không có 2 nhà liền kề** trên cùng một dãy (nhưng đối diện thì được). Đây là biến thể kinh điển của bài toán "không chọn 2 liền nhau" — giống Fibonacci!

```
One side (n=3):
  _  _  _   (no house)    → 1 way
  H  _  _                 → 1 way
  _  H  _                 → 1 way
  H  _  H                 → 1 way  (1,3)
  _  _  H                 → 1 way
Total one side: 5 = fib(n+2)

Two independent sides: 5 × 5 = 25
```

**Key insight:** Two sides are **independent** — each side follows Fibonacci-style DP. The answer is `(ways for one side)^2 mod (10^9+7)`.

For one side: `f(i) = f(i-1) + f(i-2)` (either no house at slot i, or house at i and no house at i-1).

---

## 📋 Problem Description

Given `n` plots on each side of a street (2 sides total). Count arrangements placing houses such that no two adjacent plots (on the same side) both have houses. Return answer mod 10^9+7.

- Example: `n=1` → **4** (each side: house or no-house = 2 choices; 2×2=4)
- Example: `n=2` → **9** (one side has 3 ways: `00,10,01`; 3×3=9)

---

## 📝 Interview Tips

- 🎯 **Independence**: two sides are independent → multiply their counts
- 🎯 **One side = Fibonacci**: `dp[i]` = ways for i plots with no 2 adjacent houses = `dp[i-1] + dp[i-2]`
- 🎯 **Why Fibonacci?** Plot i: either empty (dp[i-1] ways) or has house (plot i-1 must be empty → dp[i-2] ways)
- 🎯 **Space optimization**: only need 2 previous values
- 🎯 **MOD**: apply mod at each step to avoid overflow (though JS numbers handle up to ~10^15)
- 🎯 **Base cases**: `dp[0]=1` (empty — 1 way), `dp[1]=2` (house or no house)

---

## 💡 Solutions

### Solution 1: Fibonacci DP — Space Optimized

```typescript
function countHousePlacements(n: number): number {
  const MOD = 1_000_000_007;

  // Count ways for one side of n plots (no 2 adjacent houses)
  // dp[i] = ways for i plots
  // dp[0]=1, dp[1]=2, dp[i] = dp[i-1] + dp[i-2]
  let prev2 = 1; // dp[0]
  let prev1 = 2; // dp[1]

  if (n === 1) {
    const oneSide = 2;
    return (oneSide * oneSide) % MOD;
  }

  let curr = 0;
  for (let i = 2; i <= n; i++) {
    curr = (prev1 + prev2) % MOD;
    prev2 = prev1;
    prev1 = curr;
  }

  // Two independent sides: answer = oneSide^2 mod MOD
  return (prev1 * prev1) % MOD;
}
```

### Solution 2: Full DP Array (explicit)

```typescript
function countHousePlacementsDPArray(n: number): number {
  const MOD = 1_000_000_007;

  // dp[i] = ways to place houses in i plots on one side
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; // 0 plots: 1 empty arrangement
  dp[1] = 2; // 1 plot: house or no house

  for (let i = 2; i <= n; i++) {
    dp[i] = (dp[i - 1] + dp[i - 2]) % MOD;
  }

  // Both sides are independent
  return (dp[n] * dp[n]) % MOD;
}
```

### Solution 3: Compact Fibonacci via matrix (for large n)

```typescript
function countHousePlacementsMatrix(n: number): number {
  const MOD = 1_000_000_007n;
  const bigN = BigInt(n);

  // Matrix multiplication for Fibonacci
  function matMul(A: bigint[][], B: bigint[][]): bigint[][] {
    return [
      [
        (A[0][0] * B[0][0] + A[0][1] * B[1][0]) % MOD,
        (A[0][0] * B[0][1] + A[0][1] * B[1][1]) % MOD,
      ],
      [
        (A[1][0] * B[0][0] + A[1][1] * B[1][0]) % MOD,
        (A[1][0] * B[0][1] + A[1][1] * B[1][1]) % MOD,
      ],
    ];
  }

  function matPow(M: bigint[][], p: bigint): bigint[][] {
    let result: bigint[][] = [
      [1n, 0n],
      [0n, 1n],
    ]; // identity
    while (p > 0n) {
      if (p & 1n) result = matMul(result, M);
      M = matMul(M, M);
      p >>= 1n;
    }
    return result;
  }

  if (n === 0) return 1;
  // [F(n+1), F(n)] = [[1,1],[1,0]]^n * [F(1), F(0)] = [[1,1],[1,0]]^n * [2,1]
  const M: bigint[][] = [
    [1n, 1n],
    [1n, 0n],
  ];
  const res = matPow(M, bigN);
  // dp[n] = res[0][0]*2 + res[0][1]*1
  const oneSide = (res[0][0] * 2n + res[0][1]) % MOD;
  return Number((oneSide * oneSide) % MOD);
}
```

---

## 🔗 Related Problems

| Problem                                                                                  | Difficulty | Key Technique |
| ---------------------------------------------------------------------------------------- | ---------- | ------------- |
| [198. House Robber](https://leetcode.com/problems/house-robber/)                         | Medium     | Fibonacci DP  |
| [213. House Robber II](https://leetcode.com/problems/house-robber-ii/)                   | Medium     | Circular DP   |
| [746. Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/) | Easy       | Fibonacci DP  |
| [509. Fibonacci Number](https://leetcode.com/problems/fibonacci-number/)                 | Easy       | Fibonacci     |
