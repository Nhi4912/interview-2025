---
layout: page
title: "Maximize Total Tastiness of Purchased Fruits"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/maximize-total-tastiness-of-purchased-fruits"
---

# Maximize Total Tastiness of Purchased Fruits / Tối Đa Hóa Độ Ngon Khi Mua Trái Cây

🟡 Medium | 2D Knapsack DP | LeetCode 2431

## 🧠 Intuition / Tư Duy

**Tiếng Việt:** Bạn đang mua trái cây tại chợ. Mỗi trái có giá và độ ngon. Bạn có ngân sách và một số coupon (mỗi coupon giảm 50% giá). Bài toán là knapsack 2D: `dp[i][j]` = độ ngon tối đa khi xét i trái đầu với i coupon còn lại và ngân sách j.

```
fruits = [[2,4],[3,5],[4,6]], budget=7, couponCount=1
Without coupon: buy [2,4]+[3,5]=9 tastiness, cost 5 ≤ 7 ✓
With coupon on [4,6]: cost = 2+4/2=2+2=4 ≤ 7, tastiness=4+6=10 ✓
                       or [3,5]/2: cost=2+1.5... (integer division)

Best: buy fruits[0](cost 2) and fruits[2] with coupon (cost 2) → 4+6=10
```

## Problem Description

You are given a 0-indexed 2D integer array `fruits` where `fruits[i] = [price_i, tastiness_i]`, an integer `budget` (total money), and an integer `couponCount` (number of coupons, each halves a fruit's price using floor division). Maximize the total tastiness of purchased fruits without exceeding budget.

**Example 1:**

- Input: `fruits = [[2,4],[3,5],[4,6]]`, `budget = 7`, `couponCount = 1`
- Output: `10` — Buy fruit 0 (price 2) and fruit 2 with coupon (price 4→2); total cost 4, tastiness 10

**Example 2:**

- Input: `fruits = [[1,1],[2,2],[3,3]]`, `budget = 4`, `couponCount = 0`
- Output: `3` — Buy fruits 0 and 1: cost 3, tastiness 3

## 📝 Interview Tips

- 🎯 **Key insight / Chìa khoá:** 3D DP: item index × coupons used × budget. Because `couponCount` and `budget` are bounded, this is tractable
- 📊 **DP state / Trạng thái DP:** `dp[coupons][money]` = max tastiness with coupons coupons remaining and money budget remaining
- 🔢 **Transition / Công thức:** For each fruit: skip it, buy at full price, or buy with a coupon (if available)
- ⚡ **Complexity / Độ phức tạp:** O(n × couponCount × budget) — iterate over fruits, coupons, budget
- 🚫 **Edge case / Trường hợp đặc biệt:** coupon price = `Math.floor(price / 2)`; couponCount can be 0
- 💡 **Optimize / Tối ưu:** Use rolling 2D array (current item only needs previous row)

## Solutions

```typescript
/**
 * Approach 1: 3D DP → optimized to 2D rolling
 * Time: O(n * couponCount * budget)
 * Space: O(couponCount * budget)
 *
 * dp[c][b] = max tastiness using at most c coupons and spending at most b budget
 * on items considered so far
 */
function maxTastiness(fruits: number[][], budget: number, couponCount: number): number {
  // dp[c][b] = max tastiness with c coupons left and b budget remaining
  const dp: number[][] = Array.from({ length: couponCount + 1 }, () =>
    new Array(budget + 1).fill(0),
  );

  for (const [price, tastiness] of fruits) {
    const discountPrice = Math.floor(price / 2);
    // Iterate backwards to avoid reusing same fruit
    for (let c = couponCount; c >= 0; c--) {
      for (let b = budget; b >= 0; b--) {
        // Option 1: skip this fruit (dp[c][b] stays)

        // Option 2: buy at full price
        if (b >= price) {
          dp[c][b] = Math.max(dp[c][b], dp[c][b - price] + tastiness);
        }

        // Option 3: buy with coupon
        if (c > 0 && b >= discountPrice) {
          dp[c][b] = Math.max(dp[c][b], dp[c - 1][b - discountPrice] + tastiness);
        }
      }
    }
  }

  return dp[couponCount][budget];
}

console.log(
  maxTastiness(
    [
      [2, 4],
      [3, 5],
      [4, 6],
    ],
    7,
    1,
  ),
); // 10
console.log(
  maxTastiness(
    [
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    4,
    0,
  ),
); // 3
console.log(
  maxTastiness(
    [
      [1, 2],
      [2, 3],
    ],
    3,
    1,
  ),
); // 5 (buy both: 1 + 2/2=1, total=2, tastiness=5)
```

```typescript
/**
 * Approach 2: Recursive memoization with Map
 * Time: O(n * couponCount * budget)
 * Space: O(n * couponCount * budget)
 */
function maxTastiness2(fruits: number[][], budget: number, couponCount: number): number {
  const n = fruits.length;
  const memo = new Map<string, number>();

  function dp(i: number, coupons: number, money: number): number {
    if (i === n || money === 0) return 0;

    const key = `${i},${coupons},${money}`;
    if (memo.has(key)) return memo.get(key)!;

    const [price, tastiness] = fruits[i];
    const discountPrice = Math.floor(price / 2);

    // Skip
    let best = dp(i + 1, coupons, money);

    // Buy at full price
    if (money >= price) {
      best = Math.max(best, tastiness + dp(i + 1, coupons, money - price));
    }

    // Buy with coupon
    if (coupons > 0 && money >= discountPrice) {
      best = Math.max(best, tastiness + dp(i + 1, coupons - 1, money - discountPrice));
    }

    memo.set(key, best);
    return best;
  }

  return dp(0, couponCount, budget);
}

console.log(
  maxTastiness2(
    [
      [2, 4],
      [3, 5],
      [4, 6],
    ],
    7,
    1,
  ),
); // 10
console.log(
  maxTastiness2(
    [
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    4,
    0,
  ),
); // 3
```

## 🔗 Related Problems

| Problem                                                                     | Difficulty | Key Concept          |
| --------------------------------------------------------------------------- | ---------- | -------------------- |
| [0/1 Knapsack](https://leetcode.com/problems/partition-equal-subset-sum/)   | 🟡 Medium  | Classic Knapsack     |
| [Shopping Offers](https://leetcode.com/problems/shopping-offers/)           | 🟡 Medium  | Knapsack + Discounts |
| [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii/) | 🟡 Medium  | DP on sums           |
| [Target Sum](https://leetcode.com/problems/target-sum/)                     | 🟡 Medium  | Subset sum DP        |
