---
layout: page
title: "Maximum Total Reward Using Operations II"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/maximum-total-reward-using-operations-ii"
---

## 🏆 3182. Maximum Total Reward Using Operations II / Tổng Phần Thưởng Tối Đa (II)

**Difficulty:** 🔴 Hard

---

## 🧠 Intuition

**Analogy (Vietnamese):** Giống bài I, nhưng `rewardValues` có thể lên tới 100,000 — mảng boolean thông thường sẽ TLE. Trick: dùng **BigInt như một bitset**. Mỗi bit trong BigInt đại diện cho một tổng có thể đạt được. Shift và OR thay vì vòng lặp — cực nhanh!

```
dp as BigInt bitset: bit i is set ↔ sum i is reachable

For value v:
  - Take only sums s where s < v: mask = (1n << BigInt(v)) - 1n
  - Shift those bits left by v: dp |= (dp & mask) << BigInt(v)
  - This adds v to all reachable sums less than v in one operation!

Example: v=3, dp = 0b...1101 (sums 0,2,3 reachable)
  mask = (1<<3)-1 = 0b111
  dp & mask = 0b101 (sums 0,2 are < 3)
  shift left 3: 0b101000 (sums 3,5 become reachable)
  dp |= → sums {0,2,3,5,6} reachable
```

---

## 📋 Problem Description

Same as 3181 but `rewardValues.length` up to 50,000 and values up to 100,000. The naive O(n × maxVal) DP would be too slow without bitset optimization.

- Example: `rewardValues = [1,6,4,3,2]` → **11**
- Example: `rewardValues = [1,1,3,3]` → **4**

---

## 📝 Interview Tips

- 🎯 **BigInt as bitset**: JavaScript BigInt supports arbitrary precision; bit operations on it are O(bits/64)
- 🎯 **Key operation**: `dp |= (dp & mask) << BigInt(v)` where `mask = (1n << v) - 1n`
- 🎯 **Why mask?**: Only sums `s < v` can be extended by `v` (constraint: `v > current total`)
- 🎯 **Dedup**: remove duplicate values (only unique matters for reachability)
- 🎯 **Answer**: highest set bit in final dp BigInt
- 🎯 **Complexity**: O(n × maxVal / 64) with bitset — roughly O(n × 1563) for maxVal=100000

---

## 💡 Solutions

### Solution 1: BigInt Bitset DP (Optimal)

```typescript
function maxTotalReward(rewardValues: number[]): number {
  const vals = [...new Set(rewardValues)].sort((a, b) => a - b);

  // dp as BigInt: bit i set = sum i is reachable
  let dp = 1n; // sum 0 is reachable (bit 0)

  for (const v of vals) {
    const bv = BigInt(v);
    // mask: keep only sums < v (bits 0..v-1)
    const mask = (1n << bv) - 1n;
    // shift those reachable sums by v (add v to each)
    dp |= (dp & mask) << bv;
  }

  // Find highest set bit = maximum reachable sum
  let result = 0n;
  let temp = dp;
  while (temp > 0n) {
    temp >>= 1n;
    result++;
  }
  return Number(result) - 1;
}
```

### Solution 2: BigInt with bit_length helper

```typescript
function maxTotalRewardV2(rewardValues: number[]): number {
  const vals = [...new Set(rewardValues)].sort((a, b) => a - b);

  let dp = 1n;

  for (const v of vals) {
    const bv = BigInt(v);
    dp |= (dp & ((1n << bv) - 1n)) << bv;
  }

  // dp.toString(2).length - 1 = position of highest set bit
  return dp.toString(2).length - 1;
}
```

### Solution 3: Boolean Array fallback (for smaller constraints, shows logic)

```typescript
function maxTotalRewardFallback(rewardValues: number[]): number {
  const vals = [...new Set(rewardValues)].sort((a, b) => a - b);
  const maxVal = vals[vals.length - 1];
  const limit = 2 * maxVal;

  const dp = new Uint8Array(limit);
  dp[0] = 1;

  for (const v of vals) {
    // Iterate backwards through sums less than v
    for (let s = v - 1; s >= 0; s--) {
      if (dp[s] && s + v < limit) dp[s + v] = 1;
    }
  }

  for (let s = limit - 1; s >= 0; s--) {
    if (dp[s]) return s;
  }
  return 0;
}
```

---

## 🔗 Related Problems

| Problem                                                                                                                         | Difficulty | Key Technique       |
| ------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| [3181. Maximum Total Reward I](https://leetcode.com/problems/maximum-total-reward-using-operations-i/)                          | Medium     | Boolean Array DP    |
| [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)                                    | Medium     | 0/1 Knapsack Bitset |
| [1449. Number of Ways to Form Target](https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/) | Hard       | DP                  |
| [2915. Length of Longest Subsequence Sum](https://leetcode.com/problems/length-of-the-longest-subsequence-that-sums-to-target/) | Medium     | DP                  |
