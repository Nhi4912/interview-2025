---
layout: page
title: "Coin Change II"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/coin-change-ii"
---

# coin change ii

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Bạn có vô hạn xu mỗi loại. Hỏi có bao nhiêu **cách** (tổ hợp, không tính thứ tự) để đổi đúng số tiền `amount`? Khác với Coin Change I (tìm ít xu nhất), bài này **đếm số tổ hợp**.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
coins = [1,2,5], amount = 5

dp[0] = 1  (1 cách: không dùng xu nào)
Process coin=1: dp[1]=1, dp[2]=1, dp[3]=1, dp[4]=1, dp[5]=1
Process coin=2: dp[2]+=dp[0]=1→2, dp[3]+=dp[1]=1→2, dp[4]+=dp[2]=2→3, dp[5]+=dp[3]=2→3
Process coin=5: dp[5]+=dp[0]=1→4

Answer: dp[5] = 4
  {1+1+1+1+1}, {1+1+1+2}, {1+2+2}, {5}
```

**Key insight:** Outer loop = coins (ensures combinations, not permutations). Inner loop = amount 0→amount. This is the classic **unbounded knapsack** count.

---

---

## Problem Description

Given integer `amount` and array `coins`, return number of **combinations** (order doesn't matter, unlimited supply of each coin) that sum to `amount`. Return 0 if impossible.

- Example: `coins=[1,2,5]`, `amount=5` → **4**
- Example: `coins=[2]`, `amount=3` → **0**
- Example: `coins=[10]`, `amount=10` → **1**

---

---

## 📝 Interview Tips

- 🎯 **Combinations vs permutations**: outer loop = coins gives combinations; outer loop = amount gives permutations
- 🎯 **Unbounded knapsack**: each coin can be used unlimited times → inner loop goes forward (not backward)
- 🎯 **1D DP**: `dp[j] += dp[j - coin]` for each coin, for each amount j ≥ coin
- 🎯 **Base case**: `dp[0] = 1` (one way to make 0: use no coins)
- 🎯 **Complexity**: O(coins.length × amount) time, O(amount) space
- 🎯 **Why forward scan?** Forward allows reusing the same coin multiple times in one pass

---

---

## Solutions

```typescript
function change(amount: number, coins: number[]): number {
  // dp[j] = number of combinations to make amount j
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1; // base: one way to make 0

  // Outer: coins (ensures each combination counted once)
  for (const coin of coins) {
    // Inner: forward (unbounded — can reuse coin)
    for (let j = coin; j <= amount; j++) {
      dp[j] += dp[j - coin];
    }
  }

  return dp[amount];
}

function change2D(amount: number, coins: number[]): number {
  const n = coins.length;
  // dp[i][j] = ways to make j using first i coins
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(amount + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = 1; // 0 amount: 1 way

  for (let i = 1; i <= n; i++) {
    const coin = coins[i - 1];
    for (let j = 0; j <= amount; j++) {
      dp[i][j] = dp[i - 1][j]; // don't use coin i
      if (j >= coin) dp[i][j] += dp[i][j - coin]; // use coin i (unbounded)
    }
  }

  return dp[n][amount];
}

function changeMemo(amount: number, coins: number[]): number {
  const memo = new Map<string, number>();

  function dp(idx: number, remaining: number): number {
    if (remaining === 0) return 1;
    if (remaining < 0 || idx >= coins.length) return 0;
    const key = `${idx},${remaining}`;
    if (memo.has(key)) return memo.get(key)!;

    // Use coin[idx] zero or more times, then move to next coin
    let ways = 0;
    for (let k = 0; k * coins[idx] <= remaining; k++) {
      ways += dp(idx + 1, remaining - k * coins[idx]);
    }

    memo.set(key, ways);
    return ways;
  }

  return dp(0, amount);
}
```

---

## 🔗 Related Problems

| Problem                                                                                      | Difficulty | Key Technique      |
| -------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [322. Coin Change](https://leetcode.com/problems/coin-change/)                               | Medium     | Min Coins DP       |
| [377. Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/)                 | Medium     | Permutations DP    |
| [279. Perfect Squares](https://leetcode.com/problems/perfect-squares/)                       | Medium     | Unbounded Knapsack |
| [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) | Medium     | 0/1 Knapsack       |
