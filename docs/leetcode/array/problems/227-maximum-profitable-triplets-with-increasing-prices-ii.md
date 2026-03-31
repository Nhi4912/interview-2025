---
layout: page
title: "Maximum Profitable Triplets With Increasing Prices II"
difficulty: Hard
category: Array
tags: [Array, Binary Indexed Tree, Segment Tree]
leetcode_url: "https://leetcode.com/problems/maximum-profitable-triplets-with-increasing-prices-ii"
---

# Maximum Profitable Triplets With Increasing Prices II / Bộ Ba Lợi Nhuận Tối Đa Với Giá Tăng Dần II

> **Difficulty**: 🔴 Hard | **Category**: Array | **Pattern**: Binary Indexed Tree (Fenwick Tree)

## 🧠 Intuition / Tư Duy

**Như buôn hàng ba lần**: mua hàng giá thấp, bán giữa chừng lấy lợi nhuận cao nhất, rồi bán lần nữa ở giá cao hơn. Cần tìm bộ ba chỉ số i<j<k với prices[i]<prices[j]<prices[k] sao cho profits[j] tối đa khi kết hợp max profits[i] bên trái và max profits[k] bên phải.

**Pattern Recognition:**

- For each j: cần max profit[i] where prices[i] < prices[j] (BIT range max query)
- For each j: cần max profit[k] where prices[k] > prices[j] (BIT range max query suffix)
- Coordinate compress prices, then use two BITs (prefix max, suffix max)

**Visual:**

```
prices  = [10, 2, 3, 4]
profits = [100,2, 7, 5]
For j=2 (price=3, profit=7):
  leftMax  = max profit where price < 3 → price=2 → profit=2
  rightMax = max profit where price > 3 → price=4 → profit=5
  total = 2 + 7 + 5 = 14 ✓
```

## Problem Description

Cho hai mảng `prices` và `profits` cùng độ dài n. Tìm **tổng lợi nhuận tối đa** của một bộ ba chỉ số (i, j, k) với i < j < k, prices[i] < prices[j] < prices[k]. Trả về tổng max hoặc -1 nếu không tồn tại.

**Example 1:** `prices=[10,2,3,4], profits=[100,2,7,5]` → `14` (i=1,j=2,k=3)
**Example 2:** `prices=[1,2,3,4,5], profits=[1,5,3,4,6]` → `15`

**Constraints:** `3 ≤ n ≤ 5×10^4`, `1 ≤ prices[i] ≤ 10^9`, `1 ≤ profits[i] ≤ 10^6`, prices distinct.

## 📝 Interview Tips

1. **Brute force O(n³)**: không chấp nhận được với n=5×10^4
2. **Key insight**: fix j, tìm left max và right max bằng BIT range max
3. **Coordinate compression**: prices tối đa 10^9 → nén về [1..n]
4. **BIT for range max**: khác BIT sum thông thường — update(i, val), query(1..i) max
5. **Hai pass**: (1) left to right build leftMax BIT, (2) right to left build rightMax BIT
6. **Answer**: cho mỗi j, ans = max(ans, leftBIT.query(price[j]-1) + profit[j] + rightBIT.query(price[j]+1..max))

## Solutions

```typescript
// BIT for prefix/suffix max queries
class BITMax {
  private tree: number[];
  private n: number;
  constructor(n: number) {
    this.n = n;
    this.tree = new Array(n + 1).fill(0);
  }
  update(i: number, val: number): void {
    for (; i <= this.n; i += i & -i) this.tree[i] = Math.max(this.tree[i], val);
  }
  query(i: number): number {
    // max in [1..i]
    let res = 0;
    for (; i > 0; i -= i & -i) res = Math.max(res, this.tree[i]);
    return res;
  }
}

// Solution 1: Two BITs (prefix max + suffix max) — O(n log n)
function maxProfit(prices: number[], profits: number[]): number {
  const n = prices.length;
  // Coordinate compression
  const sorted = [...new Set(prices)].sort((a, b) => a - b);
  const rank = new Map<number, number>();
  sorted.forEach((p, i) => rank.set(p, i + 1));
  const m = sorted.length;

  const compPrices = prices.map((p) => rank.get(p)!);

  // leftMax[j] = max profit[i] where prices[i] < prices[j], i < j
  const leftMax = new Array(n).fill(0);
  const bitLeft = new BITMax(m);
  for (let j = 0; j < n; j++) {
    leftMax[j] = bitLeft.query(compPrices[j] - 1); // strictly less
    bitLeft.update(compPrices[j], profits[j]);
  }

  // rightMax[j] = max profit[k] where prices[k] > prices[j], k > j
  // Use suffix BIT: reverse prices, query for > becomes query for <
  const rightMax = new Array(n).fill(0);
  const bitRight = new BITMax(m);
  for (let j = n - 1; j >= 0; j--) {
    // query prices > compPrices[j] → in reversed BIT = query(m - compPrices[j])
    const revRank = m - compPrices[j];
    rightMax[j] = bitRight.query(revRank - 1 > 0 ? revRank - 1 : 0);
    bitRight.update(m - compPrices[j] + 1, profits[j]);
  }

  let ans = -1;
  for (let j = 1; j < n - 1; j++) {
    if (leftMax[j] > 0 && rightMax[j] > 0) {
      ans = Math.max(ans, leftMax[j] + profits[j] + rightMax[j]);
    }
  }
  return ans;
}

// Tests
console.log(maxProfit([10, 2, 3, 4], [100, 2, 7, 5])); // 14
console.log(maxProfit([1, 2, 3, 4, 5], [1, 5, 3, 4, 6])); // 15
console.log(maxProfit([4, 3, 2, 1], [33, 17, 19, 21])); // -1
```

## 🔗 Related Problems

| Problem                                   | Relationship                 |
| ----------------------------------------- | ---------------------------- |
| 2907 - Maximum Profitable Triplets I      | Same, smaller n → O(n²) OK   |
| 315 - Count of Smaller Numbers After Self | BIT for range queries        |
| 493 - Reverse Pairs                       | Merge sort / BIT pattern     |
| 327 - Count of Range Sum                  | Coordinate compression + BIT |
