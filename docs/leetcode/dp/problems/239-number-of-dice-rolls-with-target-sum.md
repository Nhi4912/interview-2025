---
layout: page
title: "Number of Dice Rolls With Target Sum"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/number-of-dice-rolls-with-target-sum"
---

# Number of Dice Rolls With Target Sum / Số Cách Tung Xúc Xắc Ra Tổng Mục Tiêu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming (Knapsack)
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Maximal Square](https://leetcode.com/problems/maximal-square)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Như đếm số cách tung n con xúc xắc để được tổng điểm đúng bằng target. Mỗi con xúc xắc có k mặt (1..k). Bài này giống bài đếm số cách đổi tiền nhưng mỗi đồng xu chỉ được dùng đúng 1 lần (mỗi xúc xắc tung 1 lần), và mỗi lần dùng đồng xu từ 1 đến k.

**Pattern Recognition:**

- Signal: n items each contributing [1..k] to a target sum, count arrangements → **DP Knapsack (bounded)**
- Key insight: `dp[i][j]` = ways to get sum `j` using exactly `i` dice. `dp[i][j] = sum(dp[i-1][j-f])` for `f` in `1..k`. Can optimize to 1D with rolling array.

**Visual — n=2, k=6, target=7 example:**

```
dp[0] = [1, 0, 0, 0, 0, 0, 0, 0]  (0 dice: only sum=0 possible)

After dice 1 (faces 1..6):
dp[1] = [0, 1, 1, 1, 1, 1, 1, 0]  (each face once)

After dice 2 (faces 1..6):
dp[2][7] = dp[1][6]+dp[1][5]+dp[1][4]+dp[1][3]+dp[1][2]+dp[1][1]
         =  1  +  1  +  1  +  1  +  1  +  1  = 6

6 ways to roll 7 with 2 dice: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) ✓
```

---

## 📝 Problem Description

You have `n` dice, each with `k` faces numbered `1` to `k`. Return the number of ways to roll the dice so that the face sum equals `target`. Answer modulo `10^9 + 7`.

- **Example 1:** `n=1, k=6, target=3` → `1`
- **Example 2:** `n=2, k=6, target=7` → `6`
- **Example 3:** `n=30, k=30, target=500` → `222616187`
- **Constraints:** `1 ≤ n, k ≤ 30`, `1 ≤ target ≤ 1000`

---

## 🎯 Interview Tips

1. **Bounded knapsack** / Knapsack có giới hạn: mỗi con xúc xắc tung đúng 1 lần, mỗi lần chọn 1 trong k mặt
2. **Rolling array** / Mảng cuộn: dp chỉ cần hàng dice i dựa vào hàng dice i-1 → dùng 2 mảng hoặc 1D + reverse
3. **Prefix sum optimization** / Tối ưu tổng tiền tố: `dp[i][j] = prefix[j-1] - prefix[j-k-1]` → O(n×target) không có k trong inner loop
4. **MOD arithmetic** / Phép mod: nhớ mod mỗi phép cộng để tránh overflow với n=target=1000
5. **Early termination** / Dừng sớm: nếu `i*k < target` thì dp[i][target] = 0 (không thể đạt được)
6. **Space optimization** / Tối ưu không gian: từ O(n×target) xuống O(target) bằng rolling array

---

## 💡 Solutions

### Approach 1: 2D DP — Clear but More Memory

/\*_ @complexity Time: O(n × target × k) | Space: O(n × target) _/

```typescript
function numRollsToTargetFull(n: number, k: number, target: number): number {
  const MOD = 1_000_000_007;
  // dp[i][j] = ways to get sum j using exactly i dice
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(0));
  dp[0][0] = 1;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= target; j++) {
      for (let face = 1; face <= Math.min(k, j); face++) {
        dp[i][j] = (dp[i][j] + dp[i - 1][j - face]) % MOD;
      }
    }
  }
  return dp[n][target];
}
```

### Approach 2: Rolling Array + Prefix Sum — Optimal

/\*_ @complexity Time: O(n × target) | Space: O(target) _/

```typescript
function numRollsToTarget(n: number, k: number, target: number): number {
  const MOD = 1_000_000_007;
  let dp = new Array(target + 1).fill(0);
  dp[0] = 1; // base: 0 dice, sum=0

  for (let i = 0; i < n; i++) {
    const ndp = new Array(target + 1).fill(0);
    // Use prefix sum to compute sum over a sliding window of size k
    let prefix = 0;
    for (let j = 1; j <= target; j++) {
      // Add dp[j-1] (face value j would need dp[0..j-1] — wait, we want dp[j-f] for f=1..k)
      // prefix[j] = dp[0] + dp[1] + ... + dp[j] (old dp)
      // ndp[j] = prefix[j-1] - prefix[j-k-1]  (sum of dp[j-k..j-1])
      prefix = (prefix + dp[j - 1]) % MOD;
      if (j > k) prefix = (prefix - dp[j - 1 - k] + MOD) % MOD;
      ndp[j] = prefix;
    }
    for (let j = 0; j <= target; j++) dp[j] = ndp[j];
  }

  return dp[target];
}
```

### Approach 3: Memoization (Top-Down) — Intuitive

/\*_ @complexity Time: O(n × target × k) | Space: O(n × target) _/

```typescript
function numRollsToTargetMemo(n: number, k: number, target: number): number {
  const MOD = 1_000_000_007;
  const memo = new Map<string, number>();

  function dp(diceLeft: number, remaining: number): number {
    if (diceLeft === 0) return remaining === 0 ? 1 : 0;
    if (remaining <= 0) return 0;
    const key = `${diceLeft},${remaining}`;
    if (memo.has(key)) return memo.get(key)!;
    let ways = 0;
    for (let f = 1; f <= Math.min(k, remaining); f++) {
      ways = (ways + dp(diceLeft - 1, remaining - f)) % MOD;
    }
    memo.set(key, ways);
    return ways;
  }

  return dp(n, target);
}
```

---

## 🧪 Test Cases

```typescript
console.log(numRollsToTarget(1, 6, 3)); // → 1
console.log(numRollsToTarget(2, 6, 7)); // → 6
console.log(numRollsToTarget(2, 5, 10)); // → 1  (only 5+5)
console.log(numRollsToTarget(1, 2, 3)); // → 0  (max sum = 2 < 3)
console.log(numRollsToTarget(30, 30, 500)); // → 222616187
```

---

## Related Problems

| Problem                                                                                | Difficulty | Pattern      |
| -------------------------------------------------------------------------------------- | ---------- | ------------ |
| [Coin Change II](https://leetcode.com/problems/coin-change-ii)                         | Medium     | DP Knapsack  |
| [Combination Sum IV](https://leetcode.com/problems/combination-sum-iv)                 | Medium     | DP (ordered) |
| [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum) | Medium     | DP Knapsack  |
| [Unique Paths](https://leetcode.com/problems/unique-paths)                             | Medium     | DP Grid      |
