---
layout: page
title: "Maximum Profit From Trading Stocks"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/maximum-profit-from-trading-stocks"
---

# Maximum Profit From Trading Stocks / Lợi Nhuận Tối Đa Từ Giao Dịch Cổ Phiếu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming (0/1 Knapsack)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock) | [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Như đi chợ với ngân sách cố định — mỗi món hàng có giá hôm nay và giá tương lai. Bạn muốn mua một số món để kiếm lời tối đa mà không vượt ngân sách. Đây chính là bài toán **0/1 Knapsack** với `weight = present[i]`, `value = future[i] - present[i]`.

**Pattern Recognition:**

- Signal: "budget constraint" + "buy each stock at most once" + "maximize profit" → **0/1 Knapsack**
- Chỉ mua khi `future[i] > present[i]` (có lãi)
- Key insight: dp[j] = max profit with budget j → update backwards để tránh dùng item 2 lần

**Visual — present=[2,1,3], future=[4,3,2], budget=3:**

```
profit = [2, 2, -1] → chỉ xét item 0 (profit=2,cost=2) và item 1 (profit=2,cost=1)

dp init: [0, 0, 0, 0]  (budget 0..3)

Item 0 (cost=2, profit=2):  dp[3]=max(0,dp[1]+2)=2, dp[2]=max(0,dp[0]+2)=2
  dp: [0, 0, 2, 2]

Item 1 (cost=1, profit=2):  dp[3]=max(2,dp[2]+2)=4, dp[2]=max(2,dp[1]+2)=4, dp[1]=max(0,dp[0]+2)=2
  dp: [0, 2, 4, 4]

Answer: dp[3] = 4
```

---

## Problem Description

Given `present[i]` (current price) and `future[i]` (future price) of n stocks, and an integer `budget`. Buy each stock at most once. Return the maximum profit achievable without spending more than `budget`. Profit from stock i = `future[i] - present[i]` (only if positive).

- Example 1: `present=[5,4,3,2,1]`, `future=[8,5,4,3,2]`, `budget=5` → `5`
- Example 2: `present=[2,1,3]`, `future=[4,3,2]`, `budget=3` → `4`

Constraints: `n == present.length == future.length`, `1 <= n <= 1000`, `0 <= present[i], future[i] <= 10^6`, `0 <= budget <= 10^6`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Mua cổ phiếu = tiêu present[i], bán = nhận future[i], lời = hiệu số" / Confirm profit definition
2. **Recognize knapsack**: budget = knapsack capacity, present[i] = weight, profit = value
3. **Filter negatives**: Bỏ qua cổ phiếu có future <= present — không bao giờ có lợi
4. **Backward loop**: Duyệt j từ budget xuống 0 để đảm bảo 0/1 (không mua cùng stock 2 lần)
5. **Space**: O(budget) — chỉ cần 1D dp array
6. **Edge case**: Tất cả present[i] > budget → không mua được gì → return 0

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Try all subsets
 * Time: O(2^n) — enumerate all subsets of stocks
 * Space: O(n) — recursion stack
 */
function maximumProfitBrute(present: number[], future: number[], budget: number): number {
  const n = present.length;
  let best = 0;

  function dfs(i: number, remaining: number, profit: number): void {
    best = Math.max(best, profit);
    if (i === n) return;
    // Skip stock i
    dfs(i + 1, remaining, profit);
    // Buy stock i if affordable and profitable
    const gain = future[i] - present[i];
    if (gain > 0 && remaining >= present[i]) {
      dfs(i + 1, remaining - present[i], profit + gain);
    }
  }

  dfs(0, budget, 0);
  return best;
}

/**
 * Solution 2: 0/1 Knapsack DP (Optimal)
 * Time: O(n * budget) — classic knapsack
 * Space: O(budget) — 1D rolling dp array
 */
function maximumProfit(present: number[], future: number[], budget: number): number {
  const n = present.length;
  // dp[j] = max profit achievable spending exactly j dollars (or less, since we fill 0s)
  const dp = new Array(budget + 1).fill(0);

  for (let i = 0; i < n; i++) {
    const cost = present[i];
    const gain = future[i] - present[i];
    if (gain <= 0) continue; // never profitable, skip

    // Backward pass to ensure each stock used at most once
    for (let j = budget; j >= cost; j--) {
      dp[j] = Math.max(dp[j], dp[j - cost] + gain);
    }
  }

  return dp[budget];
}

// === Test Cases ===
console.log(maximumProfit([5, 4, 3, 2, 1], [8, 5, 4, 3, 2], 5)); // 5
console.log(maximumProfit([2, 1, 3], [4, 3, 2], 3)); // 4
console.log(maximumProfit([3, 3, 3], [3, 3, 3], 5)); // 0
console.log(maximumProfit([1], [2], 0)); // 0
```

---

## 🔗 Related Problems

- [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum) — same 0/1 knapsack pattern
- [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii) — knapsack variant
- [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock) — stocks without budget constraint
- [Coin Change](https://leetcode.com/problems/coin-change) — unbounded knapsack (each item unlimited times)
- [Target Sum](https://leetcode.com/problems/target-sum) — knapsack with sign assignment
