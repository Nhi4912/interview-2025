---
layout: page
title: "Best Time to Buy and Sell Stock with Cooldown"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown"
---

# Best Time to Buy and Sell Stock with Cooldown / Mua Bán Cổ Phiếu Với Cooldown

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming (State Machine)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii) | [Best Time to Buy and Sell Stock with Transaction Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn có 3 trạng thái như một cỗ máy: **đang giữ cổ phiếu**, **vừa bán xong** (đang cooldown), **nghỉ xong có thể mua lại**. Mỗi ngày bạn chuyển trạng thái theo giá thị trường.

**Pattern Recognition:**

- 3 states: `hold` (đang cầm), `sold` (vừa bán), `rest` (cooldown xong)
- Transition: `hold → sold → rest → hold`
- Key insight: sau khi bán phải chờ 1 ngày (cooldown), không thể mua ngay

**Visual — State Machine:**

```
         buy           sell
  rest -------> hold -------> sold
   ↑                            |
   └────────────────────────────┘
              (cooldown 1 day)

rest[i]  = max(rest[i-1], sold[i-1])      ← relax or continue resting
hold[i]  = max(hold[i-1], rest[i-1] - p)  ← keep or buy today
sold[i]  = hold[i-1] + p                  ← sell today
```

---

## Problem Description

You have an array `prices` where `prices[i]` is the stock price on day `i`. You may complete as many transactions as you like, but after selling you must wait one cooldown day before buying again. Find the maximum profit. ([LeetCode #309](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown))

**Example 1:** `prices = [1,2,3,0,2]` → `3` (buy@1, sell@2, cooldown, buy@0, sell@2)
**Example 2:** `prices = [1]` → `0` (can't make any transaction)

Constraints: `1 <= prices.length <= 5000`, `0 <= prices[i] <= 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Cooldown là 1 ngày — sau bán không mua ngay hôm sau được" / Cooldown is exactly 1 day after selling
2. **State machine**: "Vẽ 3 states và transitions trước khi code / Draw the state diagram first"
3. **Brute force**: "Recursion + memo dp(i, state) O(n) time O(n) space / Memoized DFS is clean"
4. **Optimize**: "Chỉ cần biến prev, không cần mảng vì chỉ dùng i-1 / Only need O(1) space with 3 vars"
5. **Edge cases**: "prices.length=1 → 0, all same → 0, strictly decreasing → 0 / No profit if can't sell high"
6. **Follow-up**: "k ngày cooldown? Cần thêm state hoặc deque / Generalize with k-day cooldown"

---

## Solutions

```typescript
/**
 * Solution 1: State Machine DP with Arrays
 * Time: O(n) — single pass through prices
 * Space: O(n) — three dp arrays
 */
function maxProfitDP(prices: number[]): number {
  const n = prices.length;
  const hold = new Array(n).fill(0);
  const sold = new Array(n).fill(0);
  const rest = new Array(n).fill(0);

  hold[0] = -prices[0]; // buy on day 0
  sold[0] = 0;
  rest[0] = 0;

  for (let i = 1; i < n; i++) {
    hold[i] = Math.max(hold[i - 1], rest[i - 1] - prices[i]);
    sold[i] = hold[i - 1] + prices[i];
    rest[i] = Math.max(rest[i - 1], sold[i - 1]);
  }
  return Math.max(sold[n - 1], rest[n - 1]);
}

/**
 * Solution 2: State Machine DP — Space Optimized (Optimal)
 * Time: O(n) — single pass
 * Space: O(1) — three variables only
 */
function maxProfit(prices: number[]): number {
  let hold = -prices[0]; // max profit while holding stock
  let sold = 0; // max profit right after selling
  let rest = 0; // max profit during cooldown/rest

  for (let i = 1; i < prices.length; i++) {
    const prevHold = hold;
    const prevSold = sold;
    const prevRest = rest;

    hold = Math.max(prevHold, prevRest - prices[i]);
    sold = prevHold + prices[i];
    rest = Math.max(prevRest, prevSold);
  }
  return Math.max(sold, rest);
}

// === Test Cases ===
console.log(maxProfit([1, 2, 3, 0, 2])); // 3
console.log(maxProfit([1])); // 0
console.log(maxProfit([2, 1])); // 0 (can't profit)
console.log(maxProfit([1, 3, 1, 3, 1, 3])); // 4
```

---

## 🔗 Related Problems

| Problem                                                                                                                                    | Pattern            | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | ---------- |
| [Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii)                                     | Greedy             | Medium     |
| [Best Time to Buy and Sell Stock with Transaction Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee) | State Machine DP   | Medium     |
| [Best Time to Buy and Sell Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii)                                   | DP                 | Hard       |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii)                                                                                 | Greedy / DP        | Medium     |
| [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling)                                         | DP + Binary Search | Hard       |
