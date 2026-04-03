---
layout: page
title: "Minimum Cost to Make Array Equal"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Greedy, Sorting, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/minimum-cost-to-make-array-equal"
---

# Minimum Cost to Make Array Equal / Chi Phí Tối Thiểu Để Mảng Bằng Nhau

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search + Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) | [Maximum Total Beauty of the Gardens](https://leetcode.com/problems/maximum-total-beauty-of-the-gardens)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Hãy nghĩ bài toán như "cân bằng khối lượng" — mỗi `nums[i]` có trọng số `cost[i]`. Chi phí thay đổi `nums[i]` lên/xuống 1 đơn vị là `cost[i]`. Giá trị tối ưu là **weighted median** — giống như điểm cân bằng của một chiếc cân với các quả nặng khác nhau.

```
nums = [1,3,5,2], cost = [2,3,1,14]
Weighted median: tổng cost = 20, target khi prefix_cost >= 10

Sort by nums: [(1,2),(2,14),(3,3),(5,1)]
prefix cost:  [2,   16,   19,  20]
              ↑ first >= 10 → target = 2

Cost = 2*|1-2| + 14*|2-2| + 3*|3-2| + 1*|5-2| = 2+0+3+3 = 8  ✅
```

---

## Problem Description

Given arrays `nums` and `cost` of the same length, change `nums` so all elements are equal. Changing `nums[i]` by 1 (increment or decrement) costs `cost[i]`. Return the **minimum total cost**.

- **Example 1:** `nums = [1,3,5,2], cost = [2,3,1,14]` → `8`
- **Example 2:** `nums = [2,2,2,2,2], cost = [4,2,8,1,3]` → `0`

---

## 📝 Interview Tips

- ⚖️ **Weighted median:** Tối ưu không phải mean mà là weighted median — tổng cost bên trái = tổng cost bên phải
- 📈 **Convex function:** Hàm cost(target) là hình chữ V convex → có thể binary search trên derivative
- 🔍 **Binary search approach:** `f(t) - f(t-1) = sum(cost[i] where nums[i] <= t-1) - sum(cost[i] where nums[i] >= t)` — tìm điểm crossover
- 📊 **Prefix sum:** Sort by nums, build prefix sum of costs → evaluate O(1) per candidate target
- ⚠️ **Large values:** nums[i] up to 10^6 — don't iterate all possible targets, use candidate values only
- 💡 **Ternary search:** Hàm convex → ternary search cũng hoạt động O(n log(max_val))

---

## Solutions

### Solution 1: Sort + weighted median via prefix sum

```typescript
/**
 * Sort by value, find weighted median, compute cost with prefix sums
 * Time: O(n log n)  Space: O(n)
 */
function minCost(nums: number[], cost: number[]): number {
  const n = nums.length;
  // Pair and sort by value
  const pairs = nums.map((v, i) => [v, cost[i]]);
  pairs.sort((a, b) => a[0] - b[0]);

  // Build prefix sums of cost
  const prefCost = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefCost[i + 1] = prefCost[i] + pairs[i][1];
  const totalCost = prefCost[n];

  // Find weighted median: first index where prefix cost >= totalCost/2
  let target = pairs[0][0];
  for (let i = 0; i < n; i++) {
    if (prefCost[i + 1] * 2 >= totalCost) {
      target = pairs[i][0];
      break;
    }
  }

  // Compute total cost to move all elements to target
  let ans = 0n;
  for (let i = 0; i < n; i++) {
    ans += BigInt(Math.abs(pairs[i][0] - target)) * BigInt(pairs[i][1]);
  }
  return Number(ans);
}

console.log(minCost([1, 3, 5, 2], [2, 3, 1, 14])); // 8
console.log(minCost([2, 2, 2, 2, 2], [4, 2, 8, 1, 3])); // 0
```

### Solution 2: Binary search on target (ternary search approach)

```typescript
/**
 * Ternary search over candidate target values — convex cost function
 * Time: O(n log n)  Space: O(n)
 */
function minCostTernary(nums: number[], cost: number[]): number {
  const calcCost = (target: number): bigint => {
    let total = 0n;
    for (let i = 0; i < nums.length; i++) {
      total += BigInt(Math.abs(nums[i] - target)) * BigInt(cost[i]);
    }
    return total;
  };

  let lo = Math.min(...nums);
  let hi = Math.max(...nums);

  while (hi - lo > 2) {
    const m1 = lo + Math.floor((hi - lo) / 3);
    const m2 = hi - Math.floor((hi - lo) / 3);
    if (calcCost(m1) <= calcCost(m2)) hi = m2;
    else lo = m1;
  }

  let ans = BigInt(Number.MAX_SAFE_INTEGER);
  for (let t = lo; t <= hi; t++) ans = ans < calcCost(t) ? ans : calcCost(t);
  return Number(ans);
}

console.log(minCostTernary([1, 3, 5, 2], [2, 3, 1, 14])); // 8
console.log(minCostTernary([1, 1000000], [1, 1])); // 999999
```

---

## 🔗 Related Problems

| Problem                                                                                                               | Difficulty | Connection                         |
| --------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------- |
| [Minimum Moves to Equal Array Elements II](https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/)   | 🟡 Medium  | Same idea, unit costs              |
| [Weighted Median](https://en.wikipedia.org/wiki/Weighted_median)                                                      | —          | Mathematical foundation            |
| [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element/)       | 🟡 Medium  | Cost-constrained equalization      |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/)                                     | 🔴 Hard    | Binary search + prefix sum         |
| [Minimum Cost to Make Array Non-decreasing](https://leetcode.com/problems/minimum-cost-to-make-array-non-decreasing/) | 🔴 Hard    | Extension with ordering constraint |
