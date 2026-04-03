---
layout: page
title: "Best Time to Buy and Sell Stock III"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii"
---

# Best Time to Buy and Sell Stock III / Mua Bán Cổ Phiếu III

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: State Machine DP
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Best Time to Buy and Sell Stock IV](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv) | [Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn là nhà đầu tư có thể thực hiện tối đa 2 giao dịch mua-bán cổ phiếu. Mỗi ngày bạn đang ở một trong 4 trạng thái: "đang giữ cổ phiếu lần 1", "vừa bán lần 1", "đang giữ cổ phiếu lần 2", "vừa bán lần 2". Như một người chơi cờ — theo dõi trạng thái hiện tại, chọn nước đi tốt nhất.

**Pattern Recognition:**

- Signal: "at most 2 transactions" + "maximize profit" → **State Machine DP**
- Track 4 variables: buy1, sell1, buy2, sell2
- Key insight: mỗi state phụ thuộc state trước đó, không cần mảng DP

**Visual — prices = [3,3,5,0,0,3,1,4]:**

```
Day:    0    1    2    3    4    5    6    7
Price:  3    3    5    0    0    3    1    4

buy1:  -3   -3   -3    0    0    0    0    0   (max profit after 1st buy)
sell1:  0    0    2    2    2    3    3    3   (max profit after 1st sell)
buy2:  -3   -3   -1    2    2    2    2    2   (max profit after 2nd buy)
sell2:  0    0    2    2    2    5    5    6   (max profit after 2nd sell)
                                           ↑ Answer = 6
```

---

## Problem Description

Given an array `prices` where `prices[i]` is the price of a stock on day `i`, find the maximum profit from **at most 2 transactions**. You must sell before buying again. ([LeetCode 123](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii))

Difficulty: Hard | Acceptance: 51.1%

- **Example 1**: prices = [3,3,5,0,0,3,1,4] → **6** (buy day 3, sell day 5 = +3; buy day 6, sell day 7 = +3)
- **Example 2**: prices = [1,2,3,4,5] → **4** (one transaction: buy day 0, sell day 4)

Constraints:

- `1 <= prices.length <= 10^5`
- `0 <= prices[i] <= 10^5`

---

## 📝 Interview Tips

1. **Clarify**: "Tối đa 2 giao dịch, không phải đúng 2?" / At most 2 transactions, not exactly 2?
2. **Brute force**: "Thử mọi cặp (buy1,sell1,buy2,sell2) → O(n⁴)" / Four nested loops, very slow
3. **State machine**: "4 trạng thái: buy1→sell1→buy2→sell2, cập nhật mỗi ngày" / Track 4 state variables
4. **Key transition**: "buy1 = max(buy1, -price); sell1 = max(sell1, buy1+price)" / State machine transitions
5. **Space optimize**: "Chỉ cần 4 biến, không cần mảng" / O(1) space, no dp array needed
6. **Edge cases**: "prices giảm liên tục → profit = 0; một phần tử → 0" / Decreasing prices, single element

---

## Solutions

```typescript
/**
 * Solution 1: DP with state table
 * Time: O(n) — single pass through prices
 * Space: O(n) — store all states
 */
function maxProfitIIIDP(prices: number[]): number {
  const n = prices.length;
  // states[i] = [buy1, sell1, buy2, sell2] after processing prices[0..i]
  const buy1 = new Array(n).fill(0);
  const sell1 = new Array(n).fill(0);
  const buy2 = new Array(n).fill(0);
  const sell2 = new Array(n).fill(0);

  buy1[0] = -prices[0];
  sell1[0] = 0;
  buy2[0] = -prices[0];
  sell2[0] = 0;

  for (let i = 1; i < n; i++) {
    buy1[i] = Math.max(buy1[i - 1], -prices[i]);
    sell1[i] = Math.max(sell1[i - 1], buy1[i - 1] + prices[i]);
    buy2[i] = Math.max(buy2[i - 1], sell1[i - 1] - prices[i]);
    sell2[i] = Math.max(sell2[i - 1], buy2[i - 1] + prices[i]);
  }
  return sell2[n - 1];
}

/**
 * Solution 2: State Machine with O(1) Space (Optimal)
 * Time: O(n) — single pass
 * Space: O(1) — only 4 variables
 */
function maxProfitIII(prices: number[]): number {
  // State: max profit after each state
  let buy1 = -Infinity; // max profit after first buy
  let sell1 = 0; // max profit after first sell
  let buy2 = -Infinity; // max profit after second buy
  let sell2 = 0; // max profit after second sell

  for (const price of prices) {
    // Each state is the max of: staying in prev state OR making this day's move
    buy1 = Math.max(buy1, -price); // buy on this day
    sell1 = Math.max(sell1, buy1 + price); // sell on this day
    buy2 = Math.max(buy2, sell1 - price); // buy again on this day
    sell2 = Math.max(sell2, buy2 + price); // sell final on this day
  }

  return sell2;
}

// === Test Cases ===
console.log(maxProfitIII([3, 3, 5, 0, 0, 3, 1, 4])); // 6
console.log(maxProfitIII([1, 2, 3, 4, 5])); // 4
console.log(maxProfitIII([7, 6, 4, 3, 1])); // 0 (no profit possible)
console.log(maxProfitIII([1])); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                                                    | Difficulty | Pattern                  |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------ |
| [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock)                                           | 🟢 Easy    | 1 transaction            |
| [Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii)                                     | 🟡 Medium  | Unlimited transactions   |
| [Best Time to Buy and Sell Stock IV](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv)                                     | 🔴 Hard    | k transactions           |
| [Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown)               | 🟡 Medium  | State machine + cooldown |
| [Best Time to Buy and Sell Stock with Transaction Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee) | 🟡 Medium  | State machine + fee      |
