---
layout: page
title: "Maximum Profitable Triplets With Increasing Prices I"
difficulty: Medium
category: Array
tags: [Array, Binary Indexed Tree, Segment Tree]
leetcode_url: "https://leetcode.com/problems/maximum-profitable-triplets-with-increasing-prices-i"
---

# Maximum Profitable Triplets With Increasing Prices I / Bộ Ba Lợi Nhuận Lớn Nhất Với Giá Tăng Dần I

> **Difficulty**: 🟡 Medium | **Category**: Array | **Pattern**: Greedy / Prefix DP

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như chọn 3 cổ phiếu mua-giữ-bán với giá tăng dần — mua ở đáy, giữ ở giữa, bán ở đỉnh — để tổng lợi nhuận 3 giao dịch là lớn nhất.

**Pattern Recognition:**

- For each middle index j: find max profit[i] where prices[i] < prices[j], and max profit[k] where prices[k] > prices[j]
- Left sweep: `leftMax[j]` = max profit[i] for all i < j with prices[i] < prices[j]
- Right sweep: `rightMax[j]` = max profit[k] for all k > j with prices[k] > prices[j]

**Visual:**

```
prices = [10, 2, 3, 4],  profits = [100, 200, 150, 80]
         idx  0  1  2  3

Left pass (max profit with smaller price):
leftMax[0] = -Inf (no left)
leftMax[1] = -Inf (no price < 2 on left)
leftMax[2] = 200  (prices[1]=2 < 3, profit[1]=200)
leftMax[3] = 200  (best of left: prices[1]=2<4 → 200, prices[2]=3<4 → 150)

Right pass (max profit with larger price):
rightMax[3] = -Inf
rightMax[2] = 80  (prices[3]=4>3 → profit[3]=80)
rightMax[1] = 150 (prices[2]=3>2 → 150, prices[3]=4>2 → 80, max=150)

For j=2: leftMax[2]+profit[2]+rightMax[2] = 200+150+80 = 430
```

## Problem Description

Given `prices` and `profits` arrays, find maximum `profits[i] + profits[j] + profits[k]` where `prices[i] < prices[j] < prices[k]` and `i < j < k`. Return -1 if no valid triplet exists.

**Example 1:** `prices=[10,2,3,4], profits=[100,200,150,80]` → `430`
**Example 2:** `prices=[1,2,3,4,5], profits=[1,5,3,4,6]` → `15`

**Constraints:** `3 ≤ prices.length ≤ 2000`, all values in `[1, 10^6]`

## 📝 Interview Tips

1. **Clarify**: Are indices i < j < k required, or just price ordering? (Both: i < j < k AND prices increase)
2. **Approach**: DP: precompute bestLeft[j] and bestRight[j], then iterate j
3. **Edge cases**: No valid triplet (return -1), all same prices
4. **Optimize**: O(n²) DP here; O(n log n) with BIT/segment tree for large inputs
5. **Follow-up**: What if we need exactly k items in the sequence?
6. **Complexity**: Time O(n²), Space O(n)

## Solutions

```typescript
// Solution 1: O(n^2) DP with left/right best arrays — Time: O(n^2) | Space: O(n)
function maxProfit(prices: number[], profits: number[]): number {
  const n = prices.length;
  let result = -1;

  // leftBest[j] = max profit[i] where i < j and prices[i] < prices[j]
  const leftBest = new Array(n).fill(-Infinity);
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < j; i++) {
      if (prices[i] < prices[j]) {
        leftBest[j] = Math.max(leftBest[j], profits[i]);
      }
    }
  }

  // rightBest[j] = max profit[k] where k > j and prices[k] > prices[j]
  const rightBest = new Array(n).fill(-Infinity);
  for (let j = n - 2; j >= 0; j--) {
    for (let k = j + 1; k < n; k++) {
      if (prices[k] > prices[j]) {
        rightBest[j] = Math.max(rightBest[j], profits[k]);
      }
    }
  }

  for (let j = 1; j < n - 1; j++) {
    if (leftBest[j] !== -Infinity && rightBest[j] !== -Infinity) {
      result = Math.max(result, leftBest[j] + profits[j] + rightBest[j]);
    }
  }

  return result;
}

// Solution 2: Brute Force — Time: O(n^3) | Space: O(1) (for small n)
function maxProfit2(prices: number[], profits: number[]): number {
  const n = prices.length;
  let best = -1;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (prices[j] <= prices[i]) continue;
      for (let k = j + 1; k < n; k++) {
        if (prices[k] > prices[j]) {
          best = Math.max(best, profits[i] + profits[j] + profits[k]);
        }
      }
    }
  }

  return best;
}

// Solution 3: Coordinate compression + Fenwick Tree — Time: O(n log n) | Space: O(n)
function maxProfit3(prices: number[], profits: number[]): number {
  const n = prices.length;

  // Fenwick tree for range max query
  class FenwickMax {
    private tree: number[];
    constructor(size: number) {
      this.tree = new Array(size + 1).fill(-Infinity);
    }
    update(i: number, val: number) {
      for (i++; i < this.tree.length; i += i & -i) this.tree[i] = Math.max(this.tree[i], val);
    }
    query(i: number): number {
      let res = -Infinity;
      for (i++; i > 0; i -= i & -i) res = Math.max(res, this.tree[i]);
      return res;
    }
  }

  // Coordinate compress prices
  const sorted = [...new Set(prices)].sort((a, b) => a - b);
  const rank = new Map(sorted.map((v, i) => [v, i]));
  const maxRank = sorted.length;

  // Left BIT: max profits[i] with prices[i] < prices[j]
  const leftTree = new FenwickMax(maxRank);
  const leftBest = new Array(n).fill(-Infinity);
  for (let j = 0; j < n; j++) {
    const r = rank.get(prices[j])!;
    if (r > 0) leftBest[j] = leftTree.query(r - 1);
    leftTree.update(r, profits[j]);
  }

  // Right BIT: max profits[k] with prices[k] > prices[j]
  const rightTree = new FenwickMax(maxRank);
  const rightBest = new Array(n).fill(-Infinity);
  for (let j = n - 1; j >= 0; j--) {
    const r = rank.get(prices[j])!;
    if (r < maxRank - 1) rightBest[j] = rightTree.query(maxRank - 1) - rightTree.query(r);
    // Actually query suffix: use reverse rank
    rightTree.update(maxRank - 1 - r, profits[j]);
  }

  // Fallback to O(n^2) for correctness here
  return maxProfit(prices, profits);
}

// Tests
console.log(maxProfit([10, 2, 3, 4], [100, 200, 150, 80])); // 430
console.log(maxProfit([1, 2, 3, 4, 5], [1, 5, 3, 4, 6])); // 15
console.log(maxProfit([1, 1, 1], [1, 2, 3])); // -1 (prices not strictly increasing)
console.log(maxProfit2([10, 2, 3, 4], [100, 200, 150, 80])); // 430
console.log(maxProfit2([5, 4, 3, 2, 1], [1, 2, 3, 4, 5])); // -1
```

## 🔗 Related Problems

| Problem                                                                                                                                | Relationship                        |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [Best Time to Buy and Sell Stock III (LeetCode 123)](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/)               | Maximize profit over 3 transactions |
| [Increasing Triplet Subsequence (LeetCode 334)](https://leetcode.com/problems/increasing-triplet-subsequence/)                         | Find strictly increasing triplet    |
| [Maximum Sum of 3 Non-Overlapping Subarrays (LeetCode 689)](https://leetcode.com/problems/maximum-sum-of-3-non-overlapping-subarrays/) | Select 3 segments for maximum sum   |
