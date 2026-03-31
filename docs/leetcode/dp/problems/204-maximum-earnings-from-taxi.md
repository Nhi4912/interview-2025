---
layout: page
title: "Maximum Earnings From Taxi"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Hash Table, Binary Search, Dynamic Programming, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-earnings-from-taxi"
---

## 🚕 2008. Maximum Earnings From Taxi / Thu Nhập Tối Đa Từ Taxi

**Difficulty:** 🟡 Medium

---

## 🧠 Intuition

**Analogy (Vietnamese):** Bạn là tài xế taxi trên đường thẳng. Mỗi chuyến đi từ điểm `start` đến `end` kiếm được `tip + (end - start)` đồng. Chuyến này kết thúc ở `end`, bạn chỉ có thể bắt chuyến mới bắt đầu từ điểm ≥ `end`. Tìm cách chọn chuyến để tối đa thu nhập.

```
n=5, rides=[[2,5,4],[1,5,1]]
Sort by end: [[1,5,1],[2,5,4]]

dp[i] = max earnings at position i
dp[0]=0, dp[1]=0, ..., dp[n]=?

For ride [1,5,1]: earnings = 4 + (5-1) = 5, from dp[1]=0 → dp[5]=5
For ride [2,5,4]: earnings = 4 + (5-2) = 7, from dp[2]=0 → dp[5]=max(5,7)=7

Answer: dp[5] = 7
```

**Key insight:** Sort rides by **end point**. `dp[i]` = max earnings when taxi is at position `i`. For each ride `[s,e,tip]`, `dp[e] = max(dp[e], dp[s] + e - s + tip)`. Use binary search or hash map to find `dp[s]` efficiently.

---

## 📋 Problem Description

Given `n` (road length) and `rides = [[start, end, tip]]`. Each ride earns `end - start + tip`. Non-overlapping rides only (next start ≥ prev end). Maximize total earnings.

- Example: `n=5`, `rides=[[2,5,4],[1,5,1]]` → **7**
- Example: `n=20`, `rides=[[1,6,1],[3,10,2],[10,12,3],[11,12,2],[12,15,2],[13,18,1]]` → **20**

---

## 📝 Interview Tips

- 🎯 **Sort by end**: enables forward DP where we use previous `dp[s]` values
- 🎯 **DP on positions**: `dp[i]` = max profit taxi can earn up to position i
- 🎯 **Transition**: for ride `[s,e,t]`, `dp[e] = max(dp[e], dp[s] + e - s + t)`
- 🎯 **Propagate**: `dp[i] = max(dp[i], dp[i-1])` to carry max forward between positions
- 🎯 **Or hash map**: group rides by end; iterate position 1..n; update dp[end] for each ride ending here
- 🎯 **Complexity**: O(n + m) with hash map approach; O(m log m) with sort + binary search

---

## 💡 Solutions

### Solution 1: DP + Hash Map (Group by End Point)

```typescript
function maxTaxiEarnings(n: number, rides: number[][]): number {
  // Group rides by their end point
  const byEnd = new Map<number, [number, number, number][]>();
  for (const ride of rides) {
    const [s, e, t] = ride;
    const arr = byEnd.get(e) ?? [];
    arr.push([s, e, t]);
    byEnd.set(e, arr);
  }

  // dp[i] = max earnings with taxi at position i
  const dp = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    // Carry forward from previous position
    dp[i] = dp[i - 1];
    // Try completing any ride that ends at i
    for (const [s, e, t] of byEnd.get(i) ?? []) {
      dp[i] = Math.max(dp[i], dp[s] + (e - s) + t);
    }
  }

  return dp[n];
}
```

### Solution 2: Sort by End + DP Array

```typescript
function maxTaxiEarningsSort(n: number, rides: number[][]): number {
  // Sort rides by end point
  rides.sort((a, b) => a[1] - b[1]);
  const dp = new Array(n + 1).fill(0);

  let ri = 0;
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i - 1]; // no ride ends at i
    while (ri < rides.length && rides[ri][1] === i) {
      const [s, e, t] = rides[ri];
      dp[i] = Math.max(dp[i], dp[s] + (e - s) + t);
      ri++;
    }
  }

  return dp[n];
}
```

### Solution 3: Sort + Binary Search (memory efficient for large n)

```typescript
function maxTaxiEarningsBinarySearch(n: number, rides: number[][]): number {
  rides.sort((a, b) => a[1] - b[1]);
  const m = rides.length;

  // dp[i] = max earnings considering rides[0..i-1]
  // dp[0] = 0 (no rides)
  const dp = new Array(m + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    const [s, e, t] = rides[i - 1];
    const earn = e - s + t;

    // Binary search: find last ride that ends <= s
    let lo = 0,
      hi = i - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (rides[mid - 1][1] <= s) lo = mid;
      else hi = mid - 1;
    }

    dp[i] = Math.max(dp[i - 1], dp[lo] + earn);
  }

  return dp[m];
}
```

---

## 🔗 Related Problems

| Problem                                                                                                                                   | Difficulty | Key Technique      |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [1235. Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling/)                                 | Hard       | DP + Binary Search |
| [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)                                                | Medium     | Greedy             |
| [646. Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain/)                                          | Medium     | Greedy / DP        |
| [1751. Maximum Number of Events That Can Be Attended II](https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended-ii/) | Hard       | DP + Binary Search |
