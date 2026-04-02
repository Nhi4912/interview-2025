---
layout: page
title: "Best Time to Buy and Sell Stock with Transaction Fee"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee"
---

# Best Time to Buy and Sell Stock with Transaction Fee / Thời Điểm Tốt Nhất Mua Bán Cổ Phiếu Có Phí Giao Dịch

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: State-Machine DP (hold / cash)

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Mỗi ngày bạn chỉ ở một trong hai trạng thái: đang giữ cổ phiếu (`hold`) hoặc không giữ (`cash`). Chuyển trạng thái = mua hoặc bán (khi bán trả phí `fee`). Mỗi ngày chọn tốt nhất giữa giữ nguyên hoặc chuyển.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Best Time to Buy and Sell Stock with Transaction Fee example:**

```
prices = [1, 3, 2, 8, 4, 9], fee = 2

State:  cash = max profit with NO stock held
        hold = max profit WITH stock held

Day 0  (price=1): cash=0,  hold=max(-∞, 0-1)=-1
Day 1  (price=3): cash=max(0, -1+3-2)=0, hold=max(-1, 0-3)=-1
Day 2  (price=2): cash=max(0, -1+2-2)=0, hold=max(-1, 0-2)=-1
Day 3  (price=8): cash=max(0, -1+8-2)=5, hold=max(-1, 0-8)=-1
Day 4  (price=4): cash=max(5, -1+4-2)=5, hold=max(-1, 5-4)=1
Day 5  (price=9): cash=max(5, 1+9-2)=8, hold=max(1, 5-9)=1

Answer: cash = 8
```

---

## Problem Description

| #   | Title                                         | Difficulty | Connection                             |
| --- | --------------------------------------------- | ---------- | -------------------------------------- |
| 121 | Best Time to Buy and Sell Stock               | 🟢 Easy    | Single transaction — simpler base case |
| 122 | Best Time to Buy and Sell Stock II            | 🟡 Medium  | Unlimited transactions, no fee         |
| 309 | Best Time to Buy and Sell Stock with Cooldown | 🟡 Medium  | 3-state machine (hold/sold/rest)       |
| 188 | Best Time to Buy and Sell Stock IV            | 🔴 Hard    | At most k transactions                 |

---

## 📝 Interview Tips

- 🔑 **EN:** Two states: `cash` (no stock) and `hold` (has stock); transitions happen each day | **VI:** 2 trạng thái rõ ràng: `cash` và `hold`, chuyển qua lại mỗi ngày
- 🔑 **EN:** Fee paid **on sell** (add to sell side): `cash = max(cash, hold + price - fee)` | **VI:** Phí tính lúc bán: `cash = max(cash, hold + price - fee)`
- 🔑 **EN:** Alternatively fee on buy: `hold = max(hold, cash - price - fee)` — both are correct | **VI:** Tính phí lúc mua hay bán đều đúng, chỉ cần nhất quán
- 🔑 **EN:** Space O(1): only keep previous `cash` and `hold` values | **VI:** Chỉ cần 2 biến — không cần mảng
- 🔑 **EN:** Greedy insight: always buy if tomorrow's profit (after fee) beats holding | **VI:** Tương đương greedy: mua khi lợi nhuận ngày mai vượt chi phí phí
- 🔑 **EN:** Unlimited transactions allowed — key difference from "at most k transactions" | **VI:** Không giới hạn số lần giao dịch — khác bài "at most k transactions"

---

## Solutions

```typescript
// ─── Solution 1: Greedy O(n) time, O(1) space ─────────────────────────────
// Insight: treat fee as reducing every sell price. Greedily accumulate profit
// whenever price rises, then subtract fee when we "sell" (close a trade).
function maxProfitGreedy(prices: number[], fee: number): number {
  let profit = 0;
  let minPrice = prices[0];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i]; // better buy price found
    } else if (prices[i] > minPrice + fee) {
      profit += prices[i] - fee - minPrice;
      minPrice = prices[i] - fee; // allow "extending" the trade
    }
  }
  return profit;
}

// ─── Solution 2: State-Machine DP — O(n) time, O(1) space ─────────────────
function maxProfit(prices: number[], fee: number): number {
  // cash = max profit when NOT holding stock
  // hold = max profit when holding stock
  let cash = 0;
  let hold = -prices[0]; // buy on day 0

  for (let i = 1; i < prices.length; i++) {
    const prevCash = cash;
    cash = Math.max(cash, hold + prices[i] - fee); // sell today (pay fee)
    hold = Math.max(hold, prevCash - prices[i]); // buy today
  }
  return cash; // always better to not hold at the end
}

// ─── Solution 3: Full DP Array (for clarity) ──────────────────────────────
function maxProfitDP(prices: number[], fee: number): number {
  const n = prices.length;
  const cash = new Array(n).fill(0);
  const hold = new Array(n).fill(0);
  hold[0] = -prices[0];

  for (let i = 1; i < n; i++) {
    cash[i] = Math.max(cash[i - 1], hold[i - 1] + prices[i] - fee);
    hold[i] = Math.max(hold[i - 1], cash[i - 1] - prices[i]);
  }
  return cash[n - 1];
}

// ─── Tests ─────────────────────────────────────────────────────────────────
console.log(maxProfit([1, 3, 2, 8, 4, 9], 2)); // 8
console.log(maxProfit([1, 3, 7, 5, 10, 3], 3)); // 6
console.log(maxProfitGreedy([1, 3, 2, 8, 4, 9], 2)); // 8
console.log(maxProfitDP([1, 3, 2, 8, 4, 9], 2)); // 8
```

---

## 🔗 Related Problems

| #   | Title                                         | Difficulty | Connection                             |
| --- | --------------------------------------------- | ---------- | -------------------------------------- |
| 121 | Best Time to Buy and Sell Stock               | 🟢 Easy    | Single transaction — simpler base case |
| 122 | Best Time to Buy and Sell Stock II            | 🟡 Medium  | Unlimited transactions, no fee         |
| 309 | Best Time to Buy and Sell Stock with Cooldown | 🟡 Medium  | 3-state machine (hold/sold/rest)       |
| 188 | Best Time to Buy and Sell Stock IV            | 🔴 Hard    | At most k transactions                 |
