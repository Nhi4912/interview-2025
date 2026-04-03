---
layout: page
title: "Best Time to Buy and Sell Stock"
difficulty: Easy
category: Dynamic Programming
tags: [Dynamic Programming, Greedy, Array]
leetcode_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
leetcode_number: 121
pattern: "Greedy / Kadane"
frequency_tier: 1
companies: [Amazon, Google, Meta, Microsoft, Goldman Sachs]
target_time_minutes: 10
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Best Time to Buy and Sell Stock / Thời Điểm Tốt Nhất Để Mua Bán Cổ Phiếu

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Greedy / Kadane
> **Frequency**: 🔥 Tier 1 — Gặp >90% interviews | **Target**: ⏱️ 10 min
> **Companies**: Amazon, Google, Meta, Microsoft, Goldman Sachs
> **See also**: [Maximum Subarray](./03-maximum-subarray.md) | [Best Time II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như người đi chợ theo dõi giá rau mỗi ngày: bạn muốn mua lúc giá thấp nhất và bán lúc giá cao nhất _sau đó_. Mỗi ngày bạn chỉ cần hỏi: "Nếu tôi đã mua ở mức giá thấp nhất từ trước đến hôm nay, lợi nhuận hôm nay là bao nhiêu?" — chỉ cần một lần duyệt.

**Pattern Recognition:**

- Signal: "maximize profit", "single transaction", "buy before sell" → **Greedy / Kadane variant**
- Duy trì `minPrice` liên tục — tại mỗi điểm, lợi nhuận = `price[i] - minPrice`
- Tương đương tìm max subarray trên mảng diff `prices[i] - prices[i-1]`

**Visual — prices = [7, 1, 5, 3, 6, 4]:**

```
Day:      0    1    2    3    4    5
Price:    7    1    5    3    6    4
minPrice: 7    1    1    1    1    1
profit:   0    0    4    2    5    3
                              ↑
                         maxProfit = 5  (buy day 1, sell day 4)
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------ |
| **When you see** | "maximize profit", "buy low sell high", "single transaction"                               |
| **Think**        | Track running minimum, compute profit at each step                                         |
| **Template**     | `minPrice = Math.min(minPrice, price); maxProfit = Math.max(maxProfit, price - minPrice);` |
| **Time target**  | ⏱️ 10 min (Easy)                                                                           |

> 💡 **Memory hook / Móc nhớ:** "Luôn nhớ giá rẻ nhất đã thấy — mỗi ngày tính lời nếu bán hôm nay!"

---

## Problem Description

Given an array `prices` where `prices[i]` is the stock price on day `i`, choose one day to buy and a later day to sell to maximize profit. Return the maximum profit, or `0` if no profit is possible.

```
Example 1: [7,1,5,3,6,4] → 5    (buy@1, sell@6)
Example 2: [7,6,4,3,1]   → 0    (prices only fall)
Example 3: [2,4,1]       → 2    (buy@2, sell@4)
```

Constraints:

- `1 <= prices.length <= 10^5`
- `0 <= prices[i] <= 10^4`

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1 min)

> "We have daily stock prices. We can buy on one day and sell on a later day.
> We want to maximize profit from a single transaction.
> Clarification: Must we make a transaction? → No, return 0 if no profit possible."

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2 min)

> "Brute force: try all (buy, sell) pairs where buy < sell — O(n²).
> But I notice we just need the minimum price seen so far at each point.
> I'll track running minimum and compute max profit in one pass.
> O(n) time, O(1) space. Should I go ahead?"

### Step 3 — Implement / Viết Code (3-5 min)

> "I'll initialize minPrice to first element and maxProfit to 0.
> For each price starting from index 1, update minPrice if lower.
> Then update maxProfit if current price minus minPrice is larger."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace [7,1,5,3,6,4]: min=7,profit=0 → min=1,profit=0 → profit=4 →
> profit=4 → profit=5 → profit=5. Return 5. Buy day 1 ($1), sell day 4 ($6). Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — one pass. Space: O(1) — two variables.
> Edge cases: single element → 0, all same prices → 0, strictly decreasing → 0.
> This is optimal. Follow-up: multiple transactions → greedy sum all positive diffs."

---

## 📝 Interview Tips

1. **Clarify**: Only one transaction allowed? Must we trade? / Chỉ 1 giao dịch, không bắt buộc
2. **Brute force**: Try all pairs — O(n²) / Thử tất cả cặp mua-bán
3. **Optimize**: Track running minimum — single pass O(n) / Duyệt 1 lần, cập nhật giá min
4. **Edge cases**: All same prices → 0; single element → 0; strictly decreasing → 0
5. **Follow-up**: Multiple transactions? → LC 122; with cooldown? → LC 309 / Nhiều giao dịch

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                  | Why Wrong / Tại sao sai                                   | Fix / Cách sửa                                            |
| --- | ---------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| 1   | Find global min and max separately | Max might come BEFORE min — can't sell before buying      | Track min as you go, only compute profit from current min |
| 2   | Return negative profit             | Problem says return 0 if no profit possible               | Initialize maxProfit = 0, never goes negative             |
| 3   | Use DP array when not needed       | Wastes O(n) space for a problem solvable with 2 variables | Just use `minPrice` and `maxProfit` variables             |

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Try All Pairs
 * Time: O(n²) — check every buy/sell pair
 * Space: O(1) — no extra memory
 */
function maxProfitBrute(prices: number[]): number {
  let maxProfit = 0;

  for (let i = 0; i < prices.length - 1; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      maxProfit = Math.max(maxProfit, prices[j] - prices[i]);
    }
  }

  return maxProfit;
}

/**
 * Solution 2: One-Pass Greedy (Optimal)
 * Time: O(n) — single scan, update min and max profit
 * Space: O(1) — two variables only
 */
function maxProfit(prices: number[]): number {
  let minPrice = prices[0];
  let maxProfit = 0;

  for (let i = 1; i < prices.length; i++) {
    minPrice = Math.min(minPrice, prices[i]);
    maxProfit = Math.max(maxProfit, prices[i] - minPrice);
  }

  return maxProfit;
}

// === Test Cases ===
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5
console.log(maxProfit([7, 6, 4, 3, 1])); // 0
console.log(maxProfit([1])); // 0
console.log(maxProfit([2, 4, 1])); // 2
```

---

## 🔗 Related Problems

- [Maximum Subarray](./03-maximum-subarray.md) — same Kadane idea, find max contiguous gain
- [Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) — unlimited transactions
- [Best Time with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) — state machine DP
- [Best Time with Transaction Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/) — greedy with fee

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 10 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
