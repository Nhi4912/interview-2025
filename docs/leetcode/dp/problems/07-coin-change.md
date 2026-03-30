---
layout: page
title: "Coin Change"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming, BFS]
leetcode_url: "https://leetcode.com/problems/coin-change/"
---

# Coin Change / Đổi Tiền

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DP — Unbounded Knapsack
> **Frequency**: 🔥 Tier 1 — Classic DP, mọi danh sách must-know
> **See also**: [Coin Change II](./08-coin-change-2.md) | [House Robber](./04-house-robber.md) | [Climbing Stairs](./01-climbing-stairs.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Đổi tiền tại ngân hàng — có mệnh giá [1, 5, 10] đồng, cần đổi 11 đồng với ÍT tờ nhất. Tự hỏi: "11 đồng = 1 tờ + cách tối ưu đổi (11 - mệnh_giá)"

**Pattern:** "minimum number of X to reach amount" → **DP bottom-up**

- `dp[i]` = số xu ít nhất để đổi được `i` đồng
- Transition: `dp[i] = min(dp[i], dp[i - coin] + 1)` với mỗi coin ≤ i

**Visual — dp table for coins=[1,5,10], amount=11:**

```
dp[0] = 0  (base: 0 coins to make 0)
dp[1] = min(dp[1-1]+1) = 1          → [1]
dp[2] = min(dp[2-1]+1) = 2          → [1,1]
dp[5] = min(dp[4]+1, dp[0]+1) = 1   → [5]
dp[6] = min(dp[5]+1, dp[1]+1) = 2   → [5,1]
dp[10]= min(dp[9]+1, dp[5]+1, dp[0]+1) = 1 → [10]
dp[11]= min(dp[10]+1, dp[6]+1, dp[1]+1) = 2 → [10,1]

Answer: dp[11] = 2
```

---

## Problem Description

**LeetCode #322.** Given coins of different denominations and an amount, return the fewest coins to make up amount. Return -1 if impossible.

```
Example 1: coins = [1,2,5], amount = 11 → 3   (5+5+1)
Example 2: coins = [2],     amount = 3  → -1  (impossible)
Example 3: coins = [1],     amount = 0  → 0
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **Tại sao Greedy sai?** — `[1,3,4]`, amount=6: greedy chọn 4+1+1=3 coins, nhưng 3+3=2 coins → Greedy không đảm bảo optimal với coin tùy ý
2. **Init dp với Infinity** — không phải 0 hay -1; sentinel để phân biệt "chưa đạt được"
3. **dp[0] = 0 là base case** — không phải dp[coin] = 1; let the loop handle it
4. **Trả lời -1 khi nào** — `dp[amount] === Infinity` sau khi fill xong
5. **Top-down vs bottom-up** — bottom-up thường dễ code hơn và không có stack overflow risk
6. **Follow-up** — Coin Change II (#518): count số cách → `dp[i] += dp[i - coin]` thay vì `min`

---

## Solutions

{% raw %}
// Solution 1: Bottom-Up DP — O(n \* amount) time, O(amount) space ← OPTIMAL
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

// Solution 2: Top-Down Memoization — O(n \* amount) time, O(amount) space
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
{% endraw %}

---

## 🔗 Related Problems

| #   | Problem                                                           | Difficulty | Pattern         |
| --- | ----------------------------------------------------------------- | ---------- | --------------- |
| 518 | [Coin Change II](https://leetcode.com/problems/coin-change-ii/)   | 🟡 Medium  | DP — Count Ways |
| 70  | [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) | 🟢 Easy    | DP — Fibonacci  |
| 198 | [House Robber](https://leetcode.com/problems/house-robber/)       | 🟡 Medium  | DP — Linear     |
| 279 | [Perfect Squares](https://leetcode.com/problems/perfect-squares/) | 🟡 Medium  | DP / BFS        |
