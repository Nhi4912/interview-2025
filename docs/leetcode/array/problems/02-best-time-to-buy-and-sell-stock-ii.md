---
layout: page
title: "Best Time to Buy and Sell Stock II"
difficulty: Medium
category: Array
tags: [Array, Greedy, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/"
---

# Best Time to Buy and Sell Stock II / Thời Điểm Tốt Nhất Để Mua Và Bán Cổ Phiếu II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy  
> **Frequency**: 📗 Tier 2 — Common in FAANG rounds, tests greedy thinking  
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Container With Most Water](18-container-with-most-water.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Bạn là thương nhân ở chợ rau. Mỗi ngày bạn biết giá rau hôm đó. Bạn có thể mua và bán bao nhiêu lần tuỳ thích. Bí quyết: mỗi khi giá ngày mai cao hơn hôm nay, cứ mua hôm nay bán ngày mai. Tổng lãi bằng tổng tất cả các khoảng tăng giá liên tiếp.

- **Pattern Recognition:**
  - Unlimited transactions + maximize profit → **Greedy: collect every upward slope**
  - `prices[i] > prices[i-1]` → take the difference (equivalent to buy low, sell high every step)
  - DP thường quá phức tạp cho bài này — Greedy là đủ và tối ưu

- **Visual — Collect Every Upslope:**

```
prices = [7, 1, 5, 3, 6, 4]
              ↑       ↑
         buy=1  sell=5   buy=3  sell=6
         profit  +4       profit  +3   = 7 total

Greedy view (consecutive diffs):
Day: 0  1  2  3  4  5
  p: 7  1  5  3  6  4
diff:  -6 +4 -2 +3 -2
          ↑      ↑       ← only collect positives → 4+3 = 7
```

## Problem Description

Given `prices[i]` = stock price on day `i`, you may buy and sell on any days (hold at most 1 share at a time, but can transact multiple times). Return the **maximum profit**.

```
Input:  [7, 1, 5, 3, 6, 4]   → 7    (buy@1 sell@5, buy@3 sell@6)
Input:  [1, 2, 3, 4, 5]      → 4    (buy@1 sell@5, or collect each +1)
Input:  [7, 6, 4, 3, 1]      → 0    (always decreasing, never buy)
```

## 📝 Interview Tips

1. **Nhận dạng pattern**: "Unlimited transactions" → Greedy / **Pattern signal**: unlimited trades = greedy, not DP
2. **Giải thích Greedy**: Tổng lãi của một giao dịch dài = tổng các khoảng tăng ngắn bên trong / **Greedy proof**: `sell - buy = sum of all daily gains in between`
3. **Sai lầm phổ biến**: Cố tìm đỉnh/đáy rõ ràng — không cần thiết, chỉ cần cộng diff dương / **Trap**: Finding local min/max explicitly — the consecutive-diff trick is simpler
4. **Edge cases**: mảng rỗng, 1 phần tử, giá giảm đều → return 0
5. **So sánh với Stock I**: Stock I = 1 transaction (find max `prices[j]-prices[i]`); Stock II = unlimited → greedy sum / **vs Stock I**: 1 transaction needs min-prefix tracking; unlimited = sum positive diffs
6. **Follow-up**: "At most k transactions?" → DP with `dp[k][holding]` — escalate to interviewer

## Solutions

```typescript
/**

- Solution 1: Greedy — Collect Every Positive Slope (Optimal)
- Time: O(n) | Space: O(1)
  */
  function maxProfit(prices: number[]): number {
  let profit = 0;

for (let i = 1; i < prices.length; i++) {
if (prices[i] > prices[i - 1]) {
profit += prices[i] - prices[i - 1];
}
}

return profit;
}

/**

- Solution 2: Space-Optimized DP (equivalent result, shows DP thinking)
- dp[0] = max profit NOT holding stock
- dp[1] = max profit HOLDING stock
- Time: O(n) | Space: O(1)
  */
  function maxProfitDP(prices: number[]): number {
  if (prices.length <= 1) return 0;

let notHold = 0;
let hold = -prices[0];

for (let i = 1; i < prices.length; i++) {
notHold = Math.max(notHold, hold + prices[i]);
hold = Math.max(hold, notHold - prices[i]);
}

return notHold;
}

// Inline tests
console.log(maxProfit([7, 1, 5, 3, 6, 4]) === 7); // true
console.log(maxProfit([1, 2, 3, 4, 5]) === 4); // true
console.log(maxProfit([7, 6, 4, 3, 1]) === 0); // true
console.log(maxProfit([1]) === 0); // true
```

## 🔗 Related Problems

| Problem                                                                | Relationship                                         |
| ---------------------------------------------------------------------- | ---------------------------------------------------- |
| [#18 Container With Most Water](18-container-with-most-water.md)       | Greedy two-pointer pattern on arrays                 |
| [#20 Trapping Rain Water](20-trapping-rain-water.md)                   | Array traversal collecting values based on neighbors |
| [#17 Product of Array Except Self](17-product-of-array-except-self.md) | Single-pass O(n) array computation                   |
| [#04 Two Sum](04-two-sum.md)                                           | Array traversal with state tracking                  |
