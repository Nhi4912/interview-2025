---
layout: page
title: "Minimum Cost For Tickets"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/minimum-cost-for-tickets"
---

# Minimum Cost For Tickets / Chi Phí Vé Tối Thiểu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Linear DP
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Coin Change](https://leetcode.com/problems/coin-change)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như mua vé xe buýt theo tháng, tuần, hay ngày — mỗi ngày bạn quyết định loại vé nào rẻ nhất để bao phủ các chuyến đi tiếp theo.

**Pattern Recognition:**

- Signal: "minimum cost" + "cover certain days" + "pass duration" → **Linear DP**
- `dp[i]` = chi phí tối thiểu để đi tất cả ngày ≤ i
- Key insight: Với ngày không phải ngày đi, `dp[i] = dp[i-1]`; với ngày đi, thử 3 loại vé

**Visual — days=[1,4,6,7,8,20], costs=[2,7,15]:**

```
Day:  1   2   3   4   5   6   7   8  ...  20
Trip? Y   N   N   Y   N   Y   Y   Y       Y

dp[0] = 0
dp[1] = min(dp[0]+2, dp[0]+7, dp[0]+15) = 2  (1-day pass)
dp[2] = dp[1] = 2  (not a travel day)
dp[3] = dp[2] = 2
dp[4] = min(dp[3]+2, dp[0]+7, dp[0]+15) = 4  (two 1-day passes)
...
Answer = dp[last_day] = 11
```

---

## Problem Description

Given sorted array `days` (travel days of the year 1–365) and `costs` array of size 3 (cost of 1-day, 7-day, 30-day passes), return minimum cost to travel on every day in `days`. ([LeetCode 983](https://leetcode.com/problems/minimum-cost-for-tickets))

- Example 1: `days=[1,4,6,7,8,20], costs=[2,7,15]` → `11`
- Example 2: `days=[1,2,3,4,5,6,7,8,9,10,30,31], costs=[2,7,15]` → `17`

Constraints: `1 ≤ days.length ≤ 365`, `1 ≤ days[i] ≤ 365`, `1 ≤ costs[i] ≤ 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Days có sorted không? Có duplicate không?" / Are days sorted and unique?
2. **Brute force**: "Recursion: với mỗi ngày đi, thử 3 loại vé" / Try all 3 pass choices for each travel day — O(3^n)
3. **State**: "`dp[i]` = min cost for days 1..i; non-travel days copy previous" / Skip non-travel days cheaply
4. **Transition**: "Pass d ngày từ ngày i sẽ cover đến i+d-1 → `dp[i] = min(dp[i-1]+cost[0], dp[max(0,i-7)]+cost[1], dp[max(0,i-30)]+cost[2])`" / Subtract pass duration
5. **Space**: "Chỉ cần mảng dp[0..365] vì ngày tối đa 365" / Fixed size array — O(365)
6. **Edge case**: "Day 1 travel: compare all three pass options from dp[0]" / Always check boundary

---

## Solutions

```typescript
/**
 * Solution 1: Recursion + Memoization (Top-Down)
 * Time: O(365) — bounded by year size
 * Space: O(365)
 */
function mincostTicketsMemo(days: number[], costs: number[]): number {
  const travelDays = new Set(days);
  const memo = new Array(366).fill(-1);

  function dp(day: number): number {
    if (day > 365) return 0;
    if (memo[day] !== -1) return memo[day];
    if (!travelDays.has(day)) {
      memo[day] = dp(day + 1);
    } else {
      memo[day] = Math.min(costs[0] + dp(day + 1), costs[1] + dp(day + 7), costs[2] + dp(day + 30));
    }
    return memo[day];
  }

  return dp(1);
}

/**
 * Solution 2: Bottom-Up DP over days 1..365
 * Time: O(365) — constant
 * Space: O(365)
 */
function mincostTickets(days: number[], costs: number[]): number {
  const lastDay = days[days.length - 1];
  const travelDays = new Set(days);
  const dp = new Array(lastDay + 1).fill(0);

  for (let i = 1; i <= lastDay; i++) {
    if (!travelDays.has(i)) {
      dp[i] = dp[i - 1]; // no travel today, carry over
    } else {
      dp[i] = Math.min(
        dp[i - 1] + costs[0], // 1-day pass
        dp[Math.max(0, i - 7)] + costs[1], // 7-day pass
        dp[Math.max(0, i - 30)] + costs[2], // 30-day pass
      );
    }
  }

  return dp[lastDay];
}

// === Test Cases ===
console.log(mincostTickets([1, 4, 6, 7, 8, 20], [2, 7, 15])); // 11
console.log(mincostTickets([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 30, 31], [2, 7, 15])); // 17
console.log(mincostTickets([1], [2, 7, 15])); // 2
console.log(mincostTickets([1, 365], [2, 7, 15])); // 4
```

---

## 🔗 Related Problems

- [Coin Change](https://leetcode.com/problems/coin-change) — cùng dạng min-cost DP với denominations
- [Jump Game II](https://leetcode.com/problems/jump-game-ii) — DP/Greedy với jump coverage
- [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling) — interval scheduling DP
- [Minimum Number of Days to Eat N Oranges](https://leetcode.com/problems/minimum-number-of-days-to-eat-n-oranges) — min steps DP
- [Cheapest Flights Within K Stops](https://leetcode.com/problems/find-the-cheapest-flight-within-k-stops) — min cost path DP
