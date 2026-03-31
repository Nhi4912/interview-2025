---
layout: page
title: "Minimum Cost to Split an Array"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Hash Table, Dynamic Programming, Counting]
leetcode_url: "https://leetcode.com/problems/minimum-cost-to-split-an-array"
---

# Minimum Cost to Split an Array / Chi Phí Tối Thiểu Để Chia Mảng

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximum Total Damage With Spell Casting](https://leetcode.com/problems/maximum-total-damage-with-spell-casting) | [Majority Element](https://leetcode.com/problems/majority-element)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như cắt thanh sô-cô-la — mỗi lần cắt tốn một khoản phí cố định `k`, cộng thêm
"độ phức tạp" của đoạn vừa tách ra (số phần tử xuất hiện nhiều hơn 1 lần).
Chọn điểm cắt khéo léo để tổng phí nhỏ nhất.

**Pattern Recognition:**

- Signal: "minimum cost to partition" + "subarray cost depends on frequencies" → **DP trên prefix**
- State: `dp[i]` = chi phí nhỏ nhất để phân chia `nums[0..i-1]`
- Transition: `dp[i] = min over j<i { dp[j] + importance(nums[j..i-1]) }`

**Visual — DP bảng cho `nums=[1,2,1,3,2,1,3]`, `k=2`:**

```
nums index:  0  1  2  3  4  5  6
             1  2  1  3  2  1  3

dp[0] = 0  (empty prefix, zero cost)

For dp[3], subarray [1,2,1]:
  1 appears twice → 1 duplicate element
  importance = k + 1 = 3
  dp[3] = dp[0] + 3 = 3

For dp[7], try last segment = full array:
  frequencies: {1:3, 2:2, 3:2} → 3 elements with freq≥2
  importance = k + 3 = 5
  dp[7] = dp[0] + 5 = 5   ← optimal for this example

Key: iterate j from i-1 → 0, grow freq map leftward (incremental O(n^2))
```

---

## Problem Description

Given integer array `nums` and integer `k`, split `nums` into non-empty subarrays.
The cost of a subarray is `k + importance(subarray)` where **importance = count of distinct
elements appearing ≥ 2 times**. Return the **minimum total cost** over all possible splits.

```
Example 1: nums=[1,2,1,3,2,1,3], k=2  → 8
Example 2: nums=[1,2,1,2,1,2,1,2], k=2 → 10
Example 3: nums=[1,1],             k=0  → 1   (one subarray [1,1], importance=1)
```

Constraints: `1 <= k <= 10^9`, `1 <= nums.length <= 1000`, `1 <= nums[i] <= nums.length`

---

## 📝 Interview Tips

1. **Clarify**: "importance = count of _distinct_ elements with freq ≥ 2, not total duplicate count"
2. **State definition**: `dp[i]` = min cost to handle `nums[0..i-1]`; final answer is `dp[n]`
3. **Transition direction**: For each `i`, sweep `j` from `i-1` down to `0` while maintaining a freq map — O(n²) total
4. **Incremental freq**: Growing the subarray leftward lets you reuse the map; `dups++` only when freq hits exactly 2
5. **Edge case**: A single-element subarray always has `importance = 0`, so `dp[i] ≥ dp[i-1] + k`
6. **Complexity**: O(n²) time, O(n) space — acceptable for `n ≤ 1000`; no known sub-quadratic solution

---

## Solutions

```typescript
// ─── Solution 1: Brute Force O(n³) — rebuild freq each subarray ──────────
// Time: O(n³)  Space: O(n)  — TLE on large n, good for understanding
function minCostBrute(nums: number[], k: number): number {
  const n = nums.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      // Count elements in nums[j..i-1] appearing more than once
      const freq = new Map<number, number>();
      let dups = 0;
      for (let x = j; x < i; x++) {
        const f = (freq.get(nums[x]) ?? 0) + 1;
        freq.set(nums[x], f);
        if (f === 2) dups++; // This element just became a "duplicate"
      }
      dp[i] = Math.min(dp[i], dp[j] + k + dups);
    }
  }

  return dp[n];
}

// ─── Solution 2: Optimized DP — incremental freq tracking O(n²) ──────────
// Time: O(n²)  Space: O(n)  — interview-preferred, clean and correct
function minCostSplit(nums: number[], k: number): number {
  const n = nums.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= n; i++) {
    // Grow subarray nums[j..i-1] leftward from j=i-1 to j=0
    const freq = new Map<number, number>();
    let dups = 0; // Distinct elements with freq >= 2

    for (let j = i - 1; j >= 0; j--) {
      const f = (freq.get(nums[j]) ?? 0) + 1;
      freq.set(nums[j], f);
      if (f === 2) dups++; // First time this element becomes a duplicate

      if (dp[j] < Infinity) {
        dp[i] = Math.min(dp[i], dp[j] + k + dups);
      }
    }
  }

  return dp[n];
}

// ─── Solution 3: Same O(n²) but right-to-left outer loop (LeetCode style) ─
// Time: O(n²)  Space: O(n)  — equivalent, sometimes cleaner to reason about
function minCost(nums: number[], k: number): number {
  const n = nums.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let start = 0; start < n; start++) {
    if (dp[start] === Infinity) continue;
    const freq = new Map<number, number>();
    let dups = 0;

    for (let end = start; end < n; end++) {
      const f = (freq.get(nums[end]) ?? 0) + 1;
      freq.set(nums[end], f);
      if (f === 2) dups++;

      // Subarray nums[start..end], cost this segment then check dp[end+1]
      dp[end + 1] = Math.min(dp[end + 1], dp[start] + k + dups);
    }
  }

  return dp[n];
}

// === Test Cases ===
console.log(minCost([1, 2, 1, 3, 2, 1, 3], 2)); // 8
console.log(minCost([1, 2, 1, 2, 1, 2, 1, 2], 2)); // 10
console.log(minCost([1, 1], 0)); // 1
console.log(minCost([1], 5)); // 5  (one subarray, no dups)
console.log(minCost([1, 2, 3], 10)); // 10 (keep whole array, 0 dups)

// Verify brute matches optimized
console.log(minCostBrute([1, 2, 1, 3, 2, 1, 3], 2) === minCost([1, 2, 1, 3, 2, 1, 3], 2)); // true
console.log(minCostSplit([1, 2, 1, 2, 1, 2, 1, 2], 2) === minCost([1, 2, 1, 2, 1, 2, 1, 2], 2)); // true
```

---

## 🔗 Related Problems

| Problem                                                                                                          | Pattern          | Notes                                                    |
| ---------------------------------------------------------------------------------------------------------------- | ---------------- | -------------------------------------------------------- |
| [Maximum Total Damage With Spell Casting](https://leetcode.com/problems/maximum-total-damage-with-spell-casting) | DP + Frequency   | Similar "cost depends on element counts" pattern         |
| [Partition Array for Maximum Sum](https://leetcode.com/problems/partition-array-for-maximum-sum)                 | DP on partitions | Fixed window size, O(n·k) transition                     |
| [Strange Printer II](https://leetcode.com/problems/strange-printer-ii)                                           | Interval DP      | Partition optimisation over 2D                           |
| [Minimum Cost to Cut a Stick](https://leetcode.com/problems/minimum-cost-to-cut-a-stick)                         | Interval DP      | Cost accumulates across all cuts                         |
| [Majority Element](https://leetcode.com/problems/majority-element)                                               | Counting         | Frequency-dominant element — simpler counting subproblem |
