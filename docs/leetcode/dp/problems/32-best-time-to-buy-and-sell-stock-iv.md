---
layout: page
title: "Best Time to Buy and Sell Stock IV"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv"
---

# Best Time to Buy and Sell Stock IV / Mua Bán Cổ Phiếu IV

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: State Machine DP (k transactions)
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Best Time to Buy and Sell Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii) | [Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn là nhà đầu tư chuyên nghiệp với tối đa k lần mua-bán. Với mỗi "lần mua-bán", bạn có 2 trạng thái: đang giữ cổ phiếu hay đã bán xong. Khi k lớn (≥ n/2), bạn có thể giao dịch mỗi ngày — tương đương bài Stock II không giới hạn.

**Pattern Recognition:**

- Signal: "at most k transactions" → **DP with states (transaction_count, holding)**
- If k ≥ n/2 → unlimited transactions (greedy approach)
- Key insight: dp[t][0/1] = max profit using t transactions, 0=not holding, 1=holding

**Visual — k=2, prices=[2,4,1,7]:**

```
         t=1 buy  t=1 sell  t=2 buy  t=2 sell
Day 0(2): -2       0         -2        0
Day 1(4): -2       2         -2+2=0→0  2
Day 2(1): -2       2        max(-2,2-1)=1  2
Day 3(7): -2       2         1        max(2, 1+7)=8

Answer: dp[2][sell] = 8  (buy@2 sell@4=+2, buy@1 sell@7=+6)
```

---

## Problem Description

Given `prices[i]` as the stock price on day `i` and integer `k`, find the maximum profit using **at most k transactions**. You must sell before buying again. ([LeetCode 188](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv))

Difficulty: Hard | Acceptance: 47.1%

- **Example 1**: k = 2, prices = [2,4,1,7] → **8** (buy@2 sell@4, buy@1 sell@7 = 2+6=8)
- **Example 2**: k = 2, prices = [3,2,6,5,0,3] → **7** (buy@2 sell@6, buy@0 sell@3 = 4+3=7)

Constraints:

- `1 <= k <= 100`
- `1 <= prices.length <= 1000`
- `0 <= prices[i] <= 1000`

---

## 📝 Interview Tips

1. **Clarify**: "k có thể lớn hơn n/2 không? Nếu k≥n/2 → unlimited" / Large k becomes unlimited problem
2. **Reduce**: "Khi k ≥ n/2 dùng greedy O(n) thay vì DP O(k×n)" / Greedy for large k
3. **State**: "dp[t] = [maxWithoutStock, maxWithStock] cho t giao dịch" / 2 states per transaction count
4. **Transition**: "buy: maxWithStock = max(prev, maxWithout - price); sell: maxWithout = max(prev, maxWithStock + price)" / State machine update
5. **Space**: "1D array of size k đủ rồi" / O(k) space after optimization
6. **Edge cases**: "k=0 → 0; prices có 1 phần tử → 0; prices giảm dần → 0" / Zero profit cases

---

## Solutions

```typescript
/**
 * Solution 1: Full DP table
 * Time: O(k × n) — k transactions × n days
 * Space: O(k × n) — dp table
 */
function maxProfitIVFull(k: number, prices: number[]): number {
  const n = prices.length;
  if (n === 0 || k === 0) return 0;

  // Unlimited transactions when k >= n/2
  if (k >= Math.floor(n / 2)) {
    let profit = 0;
    for (let i = 1; i < n; i++) {
      if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
    }
    return profit;
  }

  // dp[t][i] = max profit using at most t transactions on first i+1 days
  // dp[t][i][0] = not holding, dp[t][i][1] = holding
  const dp: number[][][] = Array.from({ length: k + 1 }, () =>
    Array.from({ length: n }, () => [-Infinity, -Infinity]),
  );
  for (let t = 0; t <= k; t++) {
    dp[t][0][0] = 0;
    dp[t][0][1] = -prices[0];
  }

  for (let t = 1; t <= k; t++) {
    for (let i = 1; i < n; i++) {
      dp[t][i][0] = Math.max(dp[t][i - 1][0], dp[t - 1][i - 1][1] + prices[i]);
      dp[t][i][1] = Math.max(dp[t][i - 1][1], dp[t][i - 1][0] - prices[i]);
    }
  }

  return Math.max(0, dp[k][n - 1][0]);
}

/**
 * Solution 2: Space-Optimized State Machine (Optimal)
 * Time: O(k × n) — iterate k transactions × n days
 * Space: O(k) — arrays of size k for buy/sell states
 */
function maxProfitIV(k: number, prices: number[]): number {
  const n = prices.length;
  if (n === 0 || k === 0) return 0;

  // Unlimited transactions: greedy
  if (k >= Math.floor(n / 2)) {
    let profit = 0;
    for (let i = 1; i < n; i++) {
      if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
    }
    return profit;
  }

  // buy[t] = max profit after t-th buy; sell[t] = max profit after t-th sell
  const buy = new Array(k + 1).fill(-Infinity);
  const sell = new Array(k + 1).fill(0);

  for (const price of prices) {
    for (let t = 1; t <= k; t++) {
      // Buy on this day (use profit from t-1 sells)
      buy[t] = Math.max(buy[t], sell[t - 1] - price);
      // Sell on this day
      sell[t] = Math.max(sell[t], buy[t] + price);
    }
  }

  return sell[k];
}

// === Test Cases ===
console.log(maxProfitIV(2, [2, 4, 1, 7])); // 8
console.log(maxProfitIV(2, [3, 2, 6, 5, 0, 3])); // 7
console.log(maxProfitIV(2, [1, 2, 3, 4, 5])); // 4
console.log(maxProfitIV(0, [1, 2])); // 0
console.log(maxProfitIV(1, [7, 6, 4, 3, 1])); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                                      | Difficulty | Pattern                  |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------ |
| [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock)                             | 🟢 Easy    | 1 transaction            |
| [Best Time to Buy and Sell Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii)                     | 🔴 Hard    | 2 transactions           |
| [Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii)                       | 🟡 Medium  | Unlimited transactions   |
| [Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown) | 🟡 Medium  | State machine + cooldown |
| [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling)                           | 🔴 Hard    | DP + binary search       |
