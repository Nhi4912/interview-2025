---
layout: page
title: "Best Time to Buy and Sell Stock"
difficulty: Easy
category: Dynamic Programming
tags: [Dynamic Programming, Greedy, Array]
leetcode_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
---

# Best Time to Buy and Sell Stock / Thời Điểm Tốt Nhất Để Mua và Bán Cổ Phiếu

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DP/Greedy (Kadane variant)
> **Frequency**: 🔥 Tier 1 — Bài kinh điển xuất hiện trong hầu hết vòng coding interview
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

## Problem Description

Given an array `prices` where `prices[i]` is the stock price on day `i`, choose **one day to buy** and a **later day to sell** to maximize profit. Return the maximum profit, or `0` if no profit is possible.

```
Example 1: [7,1,5,3,6,4] → 5    (buy@1, sell@6)
Example 2: [7,6,4,3,1]   → 0    (prices only fall)
Example 3: [2,4,1]       → 2    (buy@2, sell@4)
```

Constraints:

- `1 <= prices.length <= 10^5`
- `0 <= prices[i] <= 10^4`

---

## 📝 Interview Tips

1. **Clarify**: Can we hold the stock over multiple days? Must we make exactly one transaction? / Chỉ được 1 lần mua-bán, không bắt buộc phải giao dịch
2. **Brute force**: Try all pairs (i, j) where i < j — O(n²) / Thử tất cả cặp mua-bán
3. **Optimize**: Track running minimum — single pass O(n) / Duyệt 1 lần, cập nhật giá min liên tục
4. **Edge cases**: All same prices → 0; single element → 0; strictly decreasing → 0
5. **Follow-up**: Multiple transactions allowed? → LC 122; with cooldown? → LC 309

---

## Solutions

{% raw %}

/\*\*

- Solution 1: Brute Force
- Time: O(n²) — try every buy/sell pair
- Space: O(1) — no extra memory
  \*/
  function maxProfitBrute(prices: number[]): number {
  let maxProfit = 0;

for (let i = 0; i < prices.length - 1; i++) {
for (let j = i + 1; j < prices.length; j++) {
maxProfit = Math.max(maxProfit, prices[j] - prices[i]);
}
}

return maxProfit;
}

/\*\*

- Solution 2: One-Pass Greedy (Optimal)
- Time: O(n) — single scan, update min price and max profit
- Space: O(1) — two variables only
  \*/
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
console.log(maxProfit([1])); // 0 (edge: single day)

{% endraw %}

---

## 🔗 Related Problems

- [Maximum Subarray](./03-maximum-subarray.md) — cùng tư duy Kadane, tìm max gain liên tiếp
- [Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) — biến thể cho phép nhiều giao dịch
- [Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) — thêm ràng buộc cooldown
