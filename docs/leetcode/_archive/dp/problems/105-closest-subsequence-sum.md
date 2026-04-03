---
layout: page
title: "Closest Subsequence Sum"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Two Pointers, Dynamic Programming, Bit Manipulation, Sorting]
leetcode_url: "https://leetcode.com/problems/closest-subsequence-sum"
---

# Closest Subsequence Sum / Tổng Dãy Con Gần Nhất

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Meet in the Middle
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Như cân bằng hai nhóm đi mua hàng — chia danh sách thành hai nửa, liệt kê tổng từng nửa, rồi tìm cặp ghép từ hai nhóm gần với target nhất.

**Pattern Recognition:**

- Signal: "subset sum closest to goal, n ≤ 40" → Meet in the Middle (too large for full DP)
- Generate all 2^20 subset sums for each half, sort one half
- Binary search for complement in sorted half

**Visual:**

```
nums = [5,-7,3,5], goal = 6
Left half: [5,-7] → sums: [0, 5, -7, -2]
Right half: [3,5] → sums: [0, 3, 5, 8]  (sorted)
For left_sum=-2, need 8 from right → -2+8=6=goal ✓ → |6-6|=0
```

## Problem Description

Given integer array `nums` and integer `goal`, find the sum of a non-empty **subsequence** closest to `goal`. Return the minimum absolute difference.

- Example 1: `nums = [5,-7,3,5]`, `goal = 6` → `0`
- Example 2: `nums = [7,-9,15,-2]`, `goal = -5` → `1`
- Constraints: `1 ≤ nums.length ≤ 40`, `-10^7 ≤ nums[i] ≤ 10^7`, `|goal| ≤ 10^9`

## 📝 Interview Tips

1. **Clarify**: Subsequence có thể là rỗng không? / Can the subsequence be empty? (No — must be non-empty, but we can include 0 sum trick)
2. **Approach**: Chia đôi mảng, sinh 2^20 tổng mỗi nửa, binary search / split + enumerate + bisect
3. **Edge cases**: Single element; all negatives when goal is positive; n=1
4. **Optimize**: Include 0 in both halves' sum sets; sort right half for binary search
5. **Test**: goal = 0 with mixed signs; goal larger than all possible sums
6. **Follow-up**: Exactly k elements in the subsequence?

## Solutions

```typescript
/** Solution 1: Meet in the Middle
 * Time: O(2^(n/2) * log(2^(n/2))) = O(n * 2^(n/2)) | Space: O(2^(n/2))
 */
function minAbsDifference(nums: number[], goal: number): number {
  const n = nums.length;
  const half = Math.floor(n / 2);

  function getSubsetSums(arr: number[]): number[] {
    const sums = [0];
    for (const x of arr) {
      const len = sums.length;
      for (let i = 0; i < len; i++) {
        sums.push(sums[i] + x);
      }
    }
    return sums;
  }

  const left = getSubsetSums(nums.slice(0, half)).sort((a, b) => a - b);
  const right = getSubsetSums(nums.slice(half)).sort((a, b) => a - b);

  let res = Infinity;

  for (const s of right) {
    const target = goal - s;
    // Binary search in left for value closest to target
    let lo = 0,
      hi = left.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const diff = Math.abs(left[mid] + s - goal);
      if (diff < res) res = diff;
      if (res === 0) return 0;
      if (left[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
  }

  return res;
}

/** Solution 2: Same approach with iterative left-right two-pointer merge
 * Time: O(2^(n/2) * log(2^(n/2))) | Space: O(2^(n/2))
 * After sorting both halves, use two pointers instead of binary search
 */
function minAbsDifference2(nums: number[], goal: number): number {
  const n = nums.length;
  const half = Math.floor(n / 2);

  function getSubsetSums(arr: number[]): number[] {
    const sums = [0];
    for (const x of arr) {
      const prev = [...sums];
      for (const p of prev) sums.push(p + x);
    }
    return sums.sort((a, b) => a - b);
  }

  const left = getSubsetSums(nums.slice(0, half));
  const right = getSubsetSums(nums.slice(half));

  let res = Infinity;
  let li = 0,
    ri = right.length - 1;

  // Two-pointer: left pointer goes right, right pointer goes left
  while (li < left.length && ri >= 0) {
    const cur = left[li] + right[ri];
    const diff = Math.abs(cur - goal);
    if (diff < res) res = diff;
    if (res === 0) return 0;
    if (cur < goal) li++;
    else ri--;
  }

  return res;
}

// Tests
console.log(minAbsDifference([5, -7, 3, 5], 6)); // 0
console.log(minAbsDifference([7, -9, 15, -2], -5)); // 1
console.log(minAbsDifference([1, 2, 3], 7)); // 1
console.log(minAbsDifference2([5, -7, 3, 5], 6)); // 0
console.log(minAbsDifference2([7, -9, 15, -2], -5)); // 1
```

## 🔗 Related Problems

| Problem                                                                                                                                                | Relationship                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| [Partition Array Into Two Arrays to Minimize Sum Difference](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference) | Same meet-in-middle technique |
| [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum)                                                                 | Subset sum DP (smaller n)     |
| [Maximum Sum of 3 Non-Overlapping Subarrays](https://leetcode.com/problems/maximum-sum-of-3-non-overlapping-subarrays)                                 | Optimal split search          |
