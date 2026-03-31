---
layout: page
title: "Minimum Cost of Buying Candies With Discount"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-cost-of-buying-candies-with-discount"
---

# Minimum Cost of Buying Candies With Discount / Chi Phí Tối Thiểu Mua Kẹo Có Giảm Giá

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Greedy + Sort
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Giống mua hàng khuyến mãi "mua 2 tặng 1":** luôn muốn cái được tặng miễn phí phải là cái đắt nhất có thể. Sort giảm dần → mỗi nhóm 3, cái thứ 3 (rẻ nhất trong nhóm) được miễn phí — tối đa tiết kiệm.

**Pattern Recognition:**

- Signal: "buy 2 get 1 free + minimize cost + must buy all" → **Sort descending + skip every 3rd**
- Greedy proof: sau khi sort desc, phần tử tại index 2,5,8,... là lớn nhất có thể trong vị trí miễn phí
- Không cần DP — quyết định tham lam từng nhóm 3 là tối ưu toàn cục

**Visual:**

```
cost = [1,2,3,4,5,6] → sorted desc: [6,5,4,3,2,1]
idx:                                    0  1  2  3  4  5
                                       pay pay FREE pay pay FREE

Group 1: buy [6,5], get [4] free → pay 11
Group 2: buy [3,2], get [1] free → pay  5
Total = 16 | Savings = 4+1 = 5

vs worst case grouping [6,1,5 free] → save 5, but less optimal
Greedy: always free the 3rd-largest → maximizes savings ✅
```

## Problem Description

Given a `cost[]` array, you must buy all candies. The rule: **for every two you buy (paying full price), the third cheapest one is free**. Return the minimum total cost to buy all candies.

- Example 1: `[1,2,3]` → `5` (buy 3+2=5, get candy worth 1 free)
- Example 2: `[6,5,7,9,2,2]` → `23`
- Constraints: `1 ≤ cost.length ≤ 1000`, `1 ≤ cost[i] ≤ 100`

## 📝 Interview Tips

1. **Clarify**: Phải mua TẤT CẢ kẹo không? / Must we buy ALL candies? Yes — minimize cost to buy entire array
2. **Approach**: Sort desc, sum all, subtract values at indices 2,5,8,... / Greedy group-of-3
3. **Edge cases**: 1 hoặc 2 kẹo → không được miễn phí (không đủ nhóm 3) / 1-2 candies → no discount
4. **Optimize**: Đã là O(n log n) tối ưu — không thể tốt hơn vì phải đọc mọi phần tử / Already optimal
5. **Follow-up**: Buy k get 1 free? / → skip every (k+1)-th element after sort; what if k varies? → harder
6. **Complexity**: Time O(n log n), Space O(log n) for in-place sort / Simple and clean

## Solutions

```typescript
/** Solution 1: Sort + Skip Every 3rd
 * Time: O(n log n) | Space: O(log n)
 */
function minimumCostBrute(cost: number[]): number {
  cost.sort((a, b) => b - a); // descending
  let total = 0;
  for (let i = 0; i < cost.length; i++) {
    if ((i + 1) % 3 !== 0) total += cost[i]; // skip index 2, 5, 8, ... (free)
  }
  return total;
}

/** Solution 2: Sort + Subtract Saved Items (clearest reasoning)
 * Time: O(n log n) | Space: O(log n)
 */
function minimumCost(cost: number[]): number {
  cost.sort((a, b) => b - a);
  const total = cost.reduce((s, c) => s + c, 0);
  // Subtract values at free positions: index 2, 5, 8, ...
  let saved = 0;
  for (let i = 2; i < cost.length; i += 3) saved += cost[i];
  return total - saved;
}

/** Solution 3: Group-of-3 Processing
 * Time: O(n log n) | Space: O(log n)
 */
function minimumCostGroups(cost: number[]): number {
  cost.sort((a, b) => b - a);
  let total = 0;
  for (let i = 0; i < cost.length; i += 3) {
    total += cost[i]; // 1st in group: pay
    if (i + 1 < cost.length) total += cost[i + 1]; // 2nd in group: pay
    // cost[i + 2] if exists: FREE — skip it
  }
  return total;
}

// Tests
console.log(minimumCost([1, 2, 3])); // 5
console.log(minimumCost([6, 5, 7, 9, 2, 2])); // 23
console.log(minimumCost([5, 5])); // 10 (no discount: only 2 candies)
console.log(minimumCost([1])); // 1
console.log(minimumCostGroups([1, 2, 3, 4, 5, 6])); // 16 (groups: [6,5,FREE 4],[3,2,FREE 1])
console.log(minimumCostBrute([3, 3, 3])); // 6  (buy 2, get 1 free: 3+3=6)
console.log(minimumCost([100, 100, 100, 100])); // 200 (two free from 4 items)
```

## 🔗 Related Problems

| Problem                                                                                                                | Relationship              |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| [Largest Number](https://leetcode.com/problems/largest-number)                                                         | Custom sort greedy        |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals)                                   | Greedy interval selection |
| [Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons) | Sort + greedy sweep       |
