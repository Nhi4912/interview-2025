---
layout: page
title: "Shopping Offers"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Backtracking, Bit Manipulation, Memoization]
leetcode_url: "https://leetcode.com/problems/shopping-offers"
---

# Shopping Offers / Ưu Đãi Mua Sắm

> **Difficulty**: 🟡 Medium | **Category**: Dynamic Programming | **Pattern**: Memoized DFS / Multi-dimensional Knapsack

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Đi siêu thị có nhiều combo khuyến mãi — bạn có thể mua combo (2 táo + 1 cam = 5k) hoặc mua lẻ. Tìm cách chi tiêu ít nhất để đủ số lượng cần.

**Pattern Recognition:**

- Multiple item types + bundles → multi-dimensional state (current needs vector)
- State = remaining needs → can memoize on tuple of remaining counts
- Try each special offer that "fits" remaining needs, plus buy-at-retail baseline

**Visual (price=[2,5], special=[[3,0,5],[1,2,10]], needs=[3,2]):**

```
State [3,2]:
  Buy all retail: 3×2 + 2×5 = 16
  Try offer [3,0,5]: new state [0,2] → cost=5+0×2+2×5=15
  Try offer [1,2,10]: new state [2,0] → cost=10+2×2+0×5=14 ✓
Answer: 14
```

## Problem Description

Given item prices, special bundle offers, and a needs list, return the **minimum cost** to buy exactly the needed quantities. You can use each special offer multiple times but cannot buy more than needed.

**Example:** `price=[2,5]`, `special=[[3,0,5],[1,2,10]]`, `needs=[3,2]` → `14`
(Use offer [1,2,10] → costs 10, then buy 2 extra item-0 at $2 each = 14)

**Constraints:** `1 <= n <= 6`, `0 <= price[i] <= 10`, `0 <= needs[i] <= 10`, offers ≤ 100

## 📝 Interview Tips

1. **Clarify**: Can we exceed needs? No — can only use an offer if all item counts fit remaining need.
2. **Approach**: DFS + memoization on the `needs` state vector (tuple as map key).
3. **Edge cases**: Offer with 0 discount (retail sum ≥ offer price) — still try it; it's valid but not helpful.
4. **Optimize**: Prune offers that are more expensive than buying items individually (optional).
5. **Follow-up**: What if we can exceed needs? Then it becomes unbounded knapsack.
6. **Complexity**: O(k × ∏(needs[i]+1)) where k = number of offers.

## Solutions

```typescript
// Solution 1: DFS + Memoization — Time: O(k × ∏(n[i]+1)) | Space: O(∏(n[i]+1))
function shoppingOffers(price: number[], special: number[][], needs: number[]): number {
  const memo = new Map<string, number>();

  function dfs(remaining: number[]): number {
    const key = remaining.join(",");
    if (memo.has(key)) return memo.get(key)!;

    // Base: buy everything at retail price
    let best = remaining.reduce((sum, cnt, i) => sum + cnt * price[i], 0);

    // Try each special offer
    for (const offer of special) {
      const next: number[] = [];
      let valid = true;
      for (let i = 0; i < remaining.length; i++) {
        if (offer[i] > remaining[i]) {
          valid = false;
          break;
        }
        next.push(remaining[i] - offer[i]);
      }
      if (valid) {
        const offerCost = offer[offer.length - 1];
        best = Math.min(best, offerCost + dfs(next));
      }
    }

    memo.set(key, best);
    return best;
  }

  return dfs(needs);
}

// Solution 2: Bottom-up iterating all states — Time: O(k × ∏(n[i]+1)) | Space: O(∏(n[i]+1))
function shoppingOffers2(price: number[], special: number[][], needs: number[]): number {
  const n = needs.length;
  const dp = new Map<string, number>();

  // Generate all possible states via BFS-like iteration
  function getRetailCost(state: number[]): number {
    return state.reduce((s, c, i) => s + c * price[i], 0);
  }

  function encode(state: number[]): string {
    return state.join(",");
  }

  // Iterate states from [0,0,...] to needs in all dims
  const ranges = needs.map((n) => n + 1);
  const total = ranges.reduce((a, b) => a * b, 1);

  for (let mask = 0; mask < total; mask++) {
    const state: number[] = [];
    let tmp = mask;
    for (let i = 0; i < n; i++) {
      state.push(tmp % ranges[i]);
      tmp = Math.floor(tmp / ranges[i]);
    }

    let best = getRetailCost(state);
    for (const offer of special) {
      const prev: number[] = [];
      let valid = true;
      for (let i = 0; i < n; i++) {
        if (offer[i] > state[i]) {
          valid = false;
          break;
        }
        prev.push(state[i] - offer[i]);
      }
      if (valid) {
        const prevCost = dp.get(encode(prev)) ?? getRetailCost(prev);
        best = Math.min(best, prevCost + offer[n]);
      }
    }
    dp.set(encode(state), best);
  }

  return dp.get(encode(needs)) ?? getRetailCost(needs);
}

// Tests
console.log(
  shoppingOffers(
    [2, 5],
    [
      [3, 0, 5],
      [1, 2, 10],
    ],
    [3, 2],
  ),
); // 14
console.log(
  shoppingOffers(
    [2, 3, 4],
    [
      [1, 1, 0, 4],
      [2, 2, 1, 9],
    ],
    [1, 2, 1],
  ),
); // 11
console.log(shoppingOffers([1], [], [5])); // 5
console.log(shoppingOffers([2, 5], [[1, 1, 8]], [2, 2])); // 14 (use offer twice)
console.log(shoppingOffers([0], [[1, 0]], [1])); // 0
```

## 🔗 Related Problems

| Problem                                                                       | Relationship                          |
| ----------------------------------------------------------------------------- | ------------------------------------- |
| [Coin Change](https://leetcode.com/problems/coin-change/)                     | Unbounded selection with optimal cost |
| [Knapsack Problem](https://leetcode.com/problems/partition-equal-subset-sum/) | Multi-item capacity DP                |
| [Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/)       | DFS + memoization on remaining target |
