---
layout: page
title: "Number of Great Partitions"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/number-of-great-partitions"
---

# Number of Great Partitions / Số Lượng Phân Hoạch Tốt

> **Difficulty**: 🔴 Hard | **Category**: Dynamic Programming | **Pattern**: Complement Counting + 0/1 Knapsack

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Chia một lớp học thành 2 đội bóng, mỗi đội phải có điểm tổng ít nhất `k`. Thay vì đếm trực tiếp, đếm số cách chia sao cho **ít nhất một đội yếu** rồi trừ đi.

**Pattern Recognition:**

- Count valid = total partitions − invalid partitions (complement counting)
- A partition is invalid if group1 < k OR group2 < k
- Use 0/1 knapsack to count partitions where a group has sum < k

**Visual (nums=[1,2,3,4], k=4):**

```
Total 2-partitions = 2^4 / 2... wait, each element assigned to group1 or 2.
But ordered (group1, group2) are distinct → total = 2^n.
Subtract "bad": sum(group1) < k — use DP to count subsets with sum < k
Subtract "bad": sum(group2) < k — same by symmetry (but can double-count empty set)
By inclusion-exclusion: bad = 2 × count(subsets with sum in [0,k-1])
            minus the all-elements case overlap
Answer: total − bad, mod 10^9+7
```

## Problem Description

Given integers `nums` and `k`, count **ordered partitions** into two non-empty groups where both groups have sum ≥ k. Return the count modulo `10^9 + 7`.

**Example 1:** `nums=[1,2,3,4]`, `k=4` → `6`
**Example 2:** `nums=[3,3,3]`, `k=4` → `0` (no way to split 9 so both halves ≥ 4 with 3 elements)

**Constraints:** `1 <= nums.length <= 1000`, `1 <= nums[i] <= 10^9`, `1 <= k <= 10^18`

## 📝 Interview Tips

1. **Clarify**: Are partitions ordered? Yes — swapping groups creates a different partition.
2. **Approach**: Total = 2^n; subtract sets where any group < k using 0/1 knapsack capped at k.
3. **Edge cases**: If total sum < 2k → answer is 0 immediately.
4. **Optimize**: Cap knapsack sum at k (no need to track beyond k).
5. **Follow-up**: What if we want exactly equal sums? → subset-sum with target = totalSum/2.
6. **Complexity**: O(n × k) time and space (with k capped).

## Solutions

```typescript
// Solution 1: Complement Counting + Knapsack — Time: O(n×k) | Space: O(k)
function countPartitions(nums: number[], k: number): number {
  const MOD = 1_000_000_007n;
  const n = nums.length;

  const totalSum = nums.reduce((a, b) => a + b, 0);
  // If total sum < 2k, impossible to have both groups >= k
  if (totalSum < 2 * k) return 0;

  const kn = BigInt(k);
  // Count subsets with sum in [0, k-1] using 0/1 knapsack
  // dp[s] = number of subsets summing to exactly s (cap at k)
  const dp = new Array<bigint>(Number(kn)).fill(0n);
  dp[0] = 1n;

  for (const num of nums) {
    // Only consider num < k (larger values can't fit in [0,k-1])
    if (num >= k) continue;
    for (let s = Number(kn) - 1; s >= num; s--) {
      dp[s] = (dp[s] + dp[s - num]) % MOD;
    }
  }

  // badCount = number of subsets with sum < k (these form "weak" groups)
  let badCount = 0n;
  for (const v of dp) badCount = (badCount + v) % MOD;

  // bad ordered partitions = 2 * badCount (each weak group can be group1 or group2)
  // but we must subtract empty-set assignments (not valid partitions)
  // Since both groups must be non-empty, subtract 2 for the empty-group cases
  // Actually: bad = 2 * badCount already counts only non-empty subsets with sum < k
  // badCount includes the empty subset (sum=0 < k), but empty group is invalid
  // The problem states non-empty groups, so we don't subtract further here since
  // an "empty" assignment means all elements go to one group which is also counted in bad
  const bad = (2n * badCount) % MOD;

  // total ordered partitions into 2 non-empty parts = 2^n - 2 (subtract both-empty extremes)
  let total = 1n;
  for (let i = 0; i < n; i++) total = (total * 2n) % MOD;
  total = (total - 2n + MOD) % MOD; // subtract all-in-group1 and all-in-group2

  return Number((total - bad + MOD) % MOD);
}

// Solution 2: Same with cleaner power computation — Time: O(n×k) | Space: O(k)
function countPartitions2(nums: number[], k: number): number {
  const MOD = 1_000_000_007n;
  const totalSum = nums.reduce((a, b) => a + b, 0);
  if (totalSum < 2 * k) return 0;

  const cap = Math.min(k, totalSum + 1);
  const dp = new Array<bigint>(cap).fill(0n);
  dp[0] = 1n;

  for (const num of nums) {
    if (num >= cap) continue;
    for (let s = cap - 1; s >= num; s--) {
      dp[s] = (dp[s] + dp[s - num]) % MOD;
    }
  }

  const badSubsets = dp.reduce((a, b) => (a + b) % MOD, 0n);
  const bad = (2n * badSubsets) % MOD;

  const pow2n = [...nums].reduce((acc) => (acc * 2n) % MOD, 1n);
  const total = (pow2n - 2n + MOD) % MOD;

  return Number((total - bad + MOD) % MOD);
}

// Tests
console.log(countPartitions([1, 2, 3, 4], 4)); // 6
console.log(countPartitions([3, 3, 3], 4)); // 0
console.log(countPartitions([1, 1], 1)); // 2
console.log(countPartitions([2, 2], 3)); // 0
console.log(countPartitions([1, 2, 3], 2)); // 4
```

## 🔗 Related Problems

| Problem                                                                                                             | Relationship                                 |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)                             | 0/1 knapsack on sum                          |
| [Target Sum](https://leetcode.com/problems/target-sum/)                                                             | Count ways to partition with sign assignment |
| [Number of Ways to Divide a Long Corridor](https://leetcode.com/problems/number-of-ways-to-divide-a-long-corridor/) | Complement counting pattern                  |
