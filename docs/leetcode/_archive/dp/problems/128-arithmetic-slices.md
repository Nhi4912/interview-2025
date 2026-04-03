---
layout: page
title: "Arithmetic Slices"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Sliding Window]
leetcode_url: "https://leetcode.com/problems/arithmetic-slices"
---

# Arithmetic Slices / Đoạn Con Cấp Số Cộng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 | **Company tags**: Yelp, Google

## 🧠 Intuition / Tư Duy

**Analogy:** Như đoàn tàu có thể kéo dài — mỗi khi thêm một toa mới với khoảng cách đúng, tất cả đoàn tàu hiện tại đều được kéo dài thêm một toa, tạo thêm đúng dp[i-1]+1 đoàn tàu mới hợp lệ.

**Pattern Recognition:**

- "Count subarrays of length ≥ 3 with constant difference" → DP on extension count
- dp[i] = number of new arithmetic slices ending at i; dp[i] = dp[i-1]+1 when diff matches
- Accumulate dp[i] into total: each slice ending at i is a new unique slice

**Visual:**

```
nums = [1, 2, 3, 4]
       diff=1  diff=1  diff=1

i=2: diff(1,2)=diff(2,3)=1 → dp[2]=1  new slices: {[1,2,3]}          total=1
i=3: diff(2,3)=diff(3,4)=1 → dp[3]=2  new slices: {[2,3,4],[1,2,3,4]} total=3
Answer = 1 + 2 = 3
```

## Problem Description

Given an integer array `nums`, return the number of arithmetic subarrays of at least 3 elements (contiguous, constant difference).

Examples: [1,2,3,4] → 3; [1] → 0; [1,2,3,8,9,10] → 2.

## 📝 Interview Tips

1. **Clarify**: Subarray (liên tiếp) chứ không phải subsequence / confirm contiguous subarray not subsequence.
2. **Approach**: dp[i] = new slices ending at i; khi diff match thì dp[i]=dp[i-1]+1, else dp[i]=0; tổng dp[i] là đáp án.
3. **Edge cases**: n < 3 → return 0; mảng toàn cùng giá trị → d=0 cũng là cấp số cộng hợp lệ.
4. **Optimize**: Không cần lưu mảng dp — biến `cur` theo dõi streak hiện tại đủ rồi / O(1) space.
5. **Follow-up**: Arithmetic Slices II (LC 446) = count arithmetic subsequences — khó hơn nhiều, dùng HashMap DP.
6. **Complexity**: Time O(n), Space O(1).

## Solutions

```typescript
/** Solution 1: DP array
 * Time: O(n) | Space: O(n)
 */
function numberOfArithmeticSlices(nums: number[]): number {
  const n = nums.length;
  if (n < 3) return 0;
  const dp = new Array<number>(n).fill(0);
  let total = 0;
  for (let i = 2; i < n; i++) {
    if (nums[i] - nums[i - 1] === nums[i - 1] - nums[i - 2]) {
      dp[i] = dp[i - 1] + 1;
      total += dp[i];
    }
  }
  return total;
}

/** Solution 2: O(1) space with rolling counter
 * Time: O(n) | Space: O(1)
 */
function numberOfArithmeticSlices2(nums: number[]): number {
  const n = nums.length;
  if (n < 3) return 0;
  let cur = 0,
    total = 0;
  for (let i = 2; i < n; i++) {
    if (nums[i] - nums[i - 1] === nums[i - 1] - nums[i - 2]) {
      cur++;
      total += cur;
    } else {
      cur = 0;
    }
  }
  return total;
}

/** Solution 3: Identify runs — count by run length
 * For a maximal arithmetic run of length L: total slices = (L-2)*(L-1)/2
 * Time: O(n) | Space: O(1)
 */
function numberOfArithmeticSlices3(nums: number[]): number {
  const n = nums.length;
  if (n < 3) return 0;
  let total = 0;
  let runLen = 2; // current run length (at least 2 elements)
  for (let i = 2; i < n; i++) {
    if (nums[i] - nums[i - 1] === nums[i - 1] - nums[i - 2]) {
      runLen++;
    } else {
      const ext = runLen - 2; // how many extra elements beyond length 2
      total += (ext * (ext + 1)) / 2;
      runLen = 2;
    }
  }
  const ext = runLen - 2;
  total += (ext * (ext + 1)) / 2;
  return total;
}

// Tests
console.log(numberOfArithmeticSlices([1, 2, 3, 4])); // 3
console.log(numberOfArithmeticSlices([1])); // 0
console.log(numberOfArithmeticSlices([1, 2, 3, 8, 9, 10])); // 2
console.log(numberOfArithmeticSlices2([1, 2, 3, 4])); // 3
console.log(numberOfArithmeticSlices3([1, 2, 3, 4, 5])); // 6
console.log(numberOfArithmeticSlices([1, 1, 1, 1])); // 3
```

## 🔗 Related Problems

| Problem                                                                                                                | Relationship                           |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [Arithmetic Slices II – Subsequence](https://leetcode.com/problems/arithmetic-slices-ii-subsequence)                   | Count arithmetic subsequences — harder |
| [Longest Arithmetic Subsequence](https://leetcode.com/problems/longest-arithmetic-subsequence)                         | Find the longest, not count all        |
| [Maximum Sum of 3 Non-Overlapping Subarrays](https://leetcode.com/problems/maximum-sum-of-3-non-overlapping-subarrays) | Subarray DP with accumulation          |
