---
layout: page
title: "Painting the Walls"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/painting-the-walls"
---

# Painting the Walls / Sơn Tường

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming (0/1 Knapsack reframe)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum) | [Coin Change](https://leetcode.com/problems/coin-change)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Có hai thợ sơn — thợ trả tiền (paid) và thợ miễn phí (free). Khi thợ trả tiền sơn 1 tường mất `time[i]` giờ, thợ miễn phí đồng thời sơn được `time[i]` tường khác. Tổng số tường 2 thợ phủ = `1 + time[i]`. Bài toán thành: chọn tập tường cho thợ trả tiền sao cho tổng coverage >= n, tối thiểu chi phí.

**Pattern Recognition:**

- Signal: "minimize cost, cover all n items, each paid item covers (1+time[i]) items" → **0/1 Knapsack**
- dp[j] = chi phí tối thiểu để phủ j tường
- Key insight: `dp[j] = min(dp[j], dp[max(0, j - 1 - time[i])] + cost[i])` — backward pass

**Visual — cost=[1,2,3,2], time=[1,2,3,2], n=4:**

```
dp = [0, INF, INF, INF, INF]  (cover 0..4 walls)

Wall 0 (cost=1, time=1, covers 2):
  j=4: dp[max(0,4-2)]=dp[2]=INF → skip
  j=3: dp[max(0,3-2)]=dp[1]=INF → skip
  j=2: dp[max(0,0)]=dp[0]=0 → dp[2]=1
  j=1: dp[max(0,0)]=dp[0]=0 → dp[1]=1
  dp=[0,1,1,INF,INF]

Wall 1 (cost=2, time=2, covers 3):
  j=4: dp[max(0,4-3)]=dp[1]=1 → dp[4]=3
  j=3: dp[max(0,0)]=dp[0]=0 → dp[3]=2
  ... dp=[0,1,1,2,3]
Answer: dp[4] = 3
```

---

## Problem Description

You have `n` walls to paint. Paid painter paints wall `i` with `cost[i]` in `time[i]` units. Free painter simultaneously paints `time[i]` walls (for free) while paid painter works. Find minimum cost to paint all `n` walls.

- Example 1: `cost=[1,2,3,2]`, `time=[1,2,3,2]` → `3`
- Example 2: `cost=[2,3,4,2]`, `time=[1,1,1,1]` → `4`

Constraints: `1 <= cost.length == time.length <= 500`, `1 <= cost[i] <= 10^6`, `1 <= time[i] <= 500`

---

## 📝 Interview Tips

1. **Reframe the problem**: Paid painter for wall i → covers (1 + time[i]) walls total → standard knapsack item
2. **Knapsack direction**: Coverage = weight, cost = value to minimize → `dp[j]` = min cost to cover j walls
3. **Backward loop**: Process j from n down to 1 (0/1 knapsack — each wall assigned at most once)
4. **Key formula**: `dp[j] = min(dp[j], dp[max(0, j-1-time[i])] + cost[i])` — `max(0,...)` handles overshoot
5. **Init**: `dp[0]=0`, `dp[1..n]=Infinity` — fill min-cost from scratch
6. **Why max(0,...)?** Covering more than n walls is fine — treat it as covering exactly n

---

## Solutions

```typescript
/**
 * Solution 1: Top-down Memoization
 * Time: O(n²) — n walls × n remaining states
 * Space: O(n²) — memo map
 */
function paintWallsMemo(cost: number[], time: number[]): number {
  const n = cost.length;
  const memo: Map<string, number> = new Map();

  function dp(i: number, remaining: number): number {
    if (remaining <= 0) return 0; // all walls covered
    if (i === n) return Infinity; // ran out of paid options
    const key = `${i},${remaining}`;
    if (memo.has(key)) return memo.get(key)!;

    // Skip wall i (don't assign to paid painter)
    const skip = dp(i + 1, remaining);
    // Assign wall i to paid painter: covers 1 + time[i] walls
    const take = cost[i] + dp(i + 1, remaining - 1 - time[i]);
    const res = Math.min(skip, take);
    memo.set(key, res);
    return res;
  }

  return dp(0, n);
}

/**
 * Solution 2: 0/1 Knapsack Bottom-up (Optimal)
 * Time: O(n²) — n items × n capacity
 * Space: O(n) — 1D dp array
 */
function paintWalls(cost: number[], time: number[]): number {
  const n = cost.length;
  // dp[j] = minimum cost to cover exactly j walls (using paid painter for subset)
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 0; i < n; i++) {
    // Backward pass (0/1 knapsack — each wall used at most once as paid)
    for (let j = n; j >= 1; j--) {
      // Assigning wall i to paid painter covers (1 + time[i]) walls
      const prevIdx = Math.max(0, j - 1 - time[i]);
      if (dp[prevIdx] !== Infinity) {
        dp[j] = Math.min(dp[j], dp[prevIdx] + cost[i]);
      }
    }
  }

  return dp[n];
}

// === Test Cases ===
console.log(paintWalls([1, 2, 3, 2], [1, 2, 3, 2])); // 3
console.log(paintWalls([2, 3, 4, 2], [1, 1, 1, 1])); // 4
console.log(paintWalls([1], [1])); // 1
console.log(paintWalls([26, 53, 10], [1, 1, 1])); // 36
```

---

## 🔗 Related Problems

- [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum) — same 0/1 knapsack template
- [Coin Change](https://leetcode.com/problems/coin-change) — minimize coins (unbounded knapsack)
- [Maximum Profit From Trading Stocks](https://leetcode.com/problems/maximum-profit-from-trading-stocks) — maximize profit variant of knapsack
- [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii) — knapsack with balance goal
- [Ones and Zeroes](https://leetcode.com/problems/ones-and-zeroes) — 2D knapsack variant
