---
layout: page
title: "Coin Change"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming, BFS]
leetcode_url: "https://leetcode.com/problems/coin-change/"
leetcode_number: 322
pattern: "Unbounded Knapsack"
frequency_tier: 1
companies: [Amazon, Apple, Google, Goldman Sachs]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Coin Change / Đổi Tiền

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DP — Unbounded Knapsack
> **Frequency**: 🔥 Tier 1 — Classic DP, mọi danh sách must-know
> **Target**: ⏱️ 20 min | **Companies**: Amazon, Apple, Google, Goldman Sachs
> **See also**: [Coin Change II](./08-coin-change-2.md) | [House Robber](./04-house-robber.md) | [Climbing Stairs](./01-climbing-stairs.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Đổi tiền tại ngân hàng — có mệnh giá [1, 5, 10] đồng, cần đổi 11 đồng với ÍT tờ nhất. Tự hỏi: "11 đồng = 1 tờ + cách tối ưu đổi (11 - mệnh_giá)."

**Pattern Recognition:**

- Signal: "minimum number of X to reach target" → **DP bottom-up**
- `dp[i]` = số xu ít nhất để đổi được `i` đồng
- Transition: `dp[i] = min(dp[i], dp[i - coin] + 1)` với mỗi coin ≤ i

**Visual — coins=[1,5,10], amount=11:**

```
dp[0]  = 0  (base case)
dp[1]  = 1          → [1]
dp[5]  = min(dp[4]+1, dp[0]+1) = 1   → [5]
dp[10] = min(dp[9]+1, dp[5]+1, dp[0]+1) = 1 → [10]
dp[11] = min(dp[10]+1, dp[6]+1, dp[1]+1) = 2 → [10,1]
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                               |
| ---------------- | ------------------------------------------------------ |
| **When you see** | "fewest coins", "minimum items to reach amount/target" |
| **Think**        | Unbounded Knapsack DP — mỗi coin dùng không giới hạn   |
| **Template**     | `dp[i] = min(dp[i], dp[i - coin] + 1)` for each coin   |
| **Time target**  | ⏱️ 20 min (Medium)                                     |

> 💡 **Memory hook / Móc nhớ:** "Mỗi số tiền = 1 đồng + cách tối ưu đổi phần còn lại!"

---

## Problem Description

Given coins of different denominations and a total amount, return the fewest number of coins needed to make up that amount. Return -1 if impossible.

```
Example 1: coins = [1,2,5], amount = 11 → 3   (5+5+1)
Example 2: coins = [2],     amount = 3  → -1  (impossible)
Example 3: coins = [1],     amount = 0  → 0
```

Constraints:

- `1 <= coins.length <= 12`
- `1 <= coins[i] <= 2³¹ - 1`
- `0 <= amount <= 10⁴`

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We have coin denominations and a target amount. We need the minimum number of coins to make exactly that amount. Each coin can be used unlimited times. Return -1 if impossible."

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "Greedy doesn't work — [1,3,4] amount=6: greedy picks 4+1+1=3 coins, but 3+3=2 is better. This is unbounded knapsack DP. dp[i] = min coins for amount i. Transition: dp[i] = min(dp[i-coin]+1) for each coin. O(amount × coins) time, O(amount) space."

### Step 3 — Implement / Viết Code (5-7 min)

> "Initialize dp array size amount+1 with Infinity, dp[0]=0. For each amount i from 1 to target, try each coin — if coin ≤ i and dp[i-coin]+1 < dp[i], update. Return dp[amount] or -1 if still Infinity."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace coins=[1,2,5], amount=11: dp[1]=1, dp[2]=1, dp[3]=2, dp[5]=1, dp[10]=2, dp[11]=min(dp[10]+1, dp[9]+1, dp[6]+1)=3. Result 3 (5+5+1). Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(amount × n) where n = coins.length. Space: O(amount). Edge cases: amount=0 → 0; no valid combination → -1. Follow-up: Coin Change II counts ways instead of min."

---

## 📝 Interview Tips

1. **Why not Greedy?**: [1,3,4] amount=6: greedy=3 coins, DP=2 / Greedy sai với coin tùy ý
2. **Init with Infinity**: Not 0 or -1 — sentinel for "unreachable" / Infinity = chưa đạt được
3. **Base case**: dp[0]=0, not dp[coin]=1 — let the loop handle it / Để vòng lặp tự tính
4. **Return -1**: When `dp[amount] === Infinity` / Khi không thể đổi được
5. **Follow-up**: Coin Change II (#518) — count ways: `dp[i] += dp[i-coin]` / Đếm số cách

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                                           | Why Wrong / Tại sao sai                                       | Fix / Cách sửa                           |
| --- | ----------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------- |
| 1   | Using greedy (always pick largest coin)                     | Doesn't guarantee minimum for arbitrary denominations         | Use DP — try all coins at each amount    |
| 2   | Initializing dp with 0 instead of Infinity                  | Can't distinguish "reachable with 0 coins" from "unreachable" | Use `Infinity` as sentinel, only dp[0]=0 |
| 3   | Forgetting to check `coin <= i` before accessing dp[i-coin] | Array index out of bounds or negative index                   | Guard with `if (coin <= i)`              |

---

## Solutions

```typescript
/**
 * Solution 1: Bottom-Up DP (Optimal)
 * Time: O(amount × n) — n = coins.length
 * Space: O(amount) — dp array
 */
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

/**
 * Solution 2: Top-Down Memoization
 * Time: O(amount × n) — same complexity
 * Space: O(amount) — memo map + recursion stack
 */
function coinChangeMemo(coins: number[], amount: number): number {
  const memo = new Map<number, number>();

  function dp(target: number): number {
    if (target === 0) return 0;
    if (target < 0) return -1;
    if (memo.has(target)) return memo.get(target)!;

    let best = Infinity;
    for (const coin of coins) {
      const sub = dp(target - coin);
      if (sub !== -1) best = Math.min(best, sub + 1);
    }

    const result = best === Infinity ? -1 : best;
    memo.set(target, result);
    return result;
  }

  return dp(amount);
}

// === Test Cases ===
console.log(coinChange([1, 2, 5], 11)); // 3
console.log(coinChange([2], 3)); // -1
console.log(coinChange([1], 0)); // 0
```

---

## 🔗 Related Problems

- [Coin Change II](./08-coin-change-2.md) — count ways instead of min: `dp[i] += dp[i-coin]`
- [Climbing Stairs](./01-climbing-stairs.md) — DP Fibonacci, simpler version
- [House Robber](./04-house-robber.md) — linear DP with skip constraint
- [Perfect Squares](https://leetcode.com/problems/perfect-squares/) — same pattern, coins = perfect squares

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 20 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
