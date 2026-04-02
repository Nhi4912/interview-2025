---
layout: page
title: "Maximum Total Reward Using Operations I"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/maximum-total-reward-using-operations-i"
---

# maximum total reward using operations i

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Bạn có một bộ thẻ điểm. Mỗi lần chọn thẻ có giá trị `v`, bạn chỉ được chọn nếu `v > tổng điểm hiện tại`. Sau đó cộng `v` vào tổng. Mục tiêu: tổng điểm cao nhất có thể. Giống như leo thang — chỉ leo bước tiếp nếu bước đó **cao hơn** tổng các bước đã leo.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
rewardValues = [1, 6, 4, 3, 2], sorted = [1,2,3,4,6]

Reachable totals (dp set):
Start: {0}
Add 1 (>0): {0,1}
Add 2 (>1): {0,1,2,3}      ← 0+2, 1+2
Add 3 (>2): {0,1,2,3,4,6}  ← 3+3
Add 4 (>3): {0,1,2,3,4,5,6,7,8,10}
Add 6 (>5): {... can reach 11}
Answer: max reachable = 11
```

---

---

## Problem Description

Given `rewardValues[]`, perform operations: pick any unused element `v` where `v > currentTotal`, then `total += v`. Return maximum achievable total. Elements can be used at most once; best strategy is to sort and use DP on reachable sums.

- Example: `rewardValues = [1,1,3,3]` → **4**
- Example: `rewardValues = [1,6,4,3,2]` → **11**

---

---

## 📝 Interview Tips

- 🎯 **Sort first**: to ensure we process in increasing order (only use each value once)
- 🎯 **DP set**: `dp[s] = true` means sum `s` is reachable; iterate from high to low to avoid reuse
- 🎯 **Key constraint**: `v > currentTotal` means if current total is `s`, we can only add `v > s`
- 🎯 **Dedup**: remove duplicates from `rewardValues` — only min cost per value matters (here, it's just "use or not")
- 🎯 **Upper bound**: max total ≤ 2 × max(rewardValues) - 1, since last value must be > half total
- 🎯 **Complexity**: O(n × maxVal) time; for Part I maxVal ≤ 2000, so O(n²) is fine

---

---

## Solutions

```typescript
function maxTotalReward(rewardValues: number[]): number {
  // Sort and deduplicate
  const vals = [...new Set(rewardValues)].sort((a, b) => a - b);
  const maxVal = vals[vals.length - 1];
  // max achievable total < 2 * maxVal
  const limit = 2 * maxVal;

  // dp[s] = can we reach sum s?
  const dp = new Uint8Array(limit);
  dp[0] = 1;

  for (const v of vals) {
    // Process from high to low to avoid picking v twice
    // Only add v to sums s where s < v (constraint: v > current total)
    for (let s = v - 1; s >= 0; s--) {
      if (dp[s]) dp[s + v] = 1;
    }
  }

  // Find maximum reachable sum
  for (let s = limit - 1; s >= 0; s--) {
    if (dp[s]) return s;
  }
  return 0;
}

function maxTotalRewardSet(rewardValues: number[]): number {
  const vals = [...new Set(rewardValues)].sort((a, b) => a - b);
  let reachable = new Set<number>([0]);

  for (const v of vals) {
    const next = new Set(reachable);
    for (const s of reachable) {
      if (s < v) next.add(s + v); // constraint: v > current total
    }
    reachable = next;
  }

  return Math.max(...reachable);
}

function maxTotalRewardGreedy(rewardValues: number[]): number {
  const vals = [...new Set(rewardValues)].sort((a, b) => a - b);
  const n = vals.length;
  const maxVal = vals[n - 1];
  const dp = new Uint8Array(2 * maxVal);
  dp[0] = 1;

  for (let i = 0; i < n; i++) {
    const v = vals[i];
    // For each reachable sum s < v, mark s+v as reachable
    for (let s = 0; s < v; s++) {
      if (dp[s]) dp[s + v] = 1;
    }
  }

  for (let s = 2 * maxVal - 1; s >= 0; s--) {
    if (dp[s]) return s;
  }
  return 0;
}
```

---

## 🔗 Related Problems

| Problem                                                                                                                                             | Difficulty | Key Technique |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)                                                        | Medium     | 0/1 Knapsack  |
| [494. Target Sum](https://leetcode.com/problems/target-sum/)                                                                                        | Medium     | DP            |
| [3182. Maximum Total Reward Using Operations II](https://leetcode.com/problems/maximum-total-reward-using-operations-ii/)                           | Hard       | Bitset DP     |
| [2915. Length of the Longest Subsequence That Sums to Target](https://leetcode.com/problems/length-of-the-longest-subsequence-that-sums-to-target/) | Medium     | DP            |
