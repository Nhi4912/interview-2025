---
layout: page
title: "Maximum Sum Circular Subarray"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Divide and Conquer, Dynamic Programming, Queue, Monotonic Queue]
leetcode_url: "https://leetcode.com/problems/maximum-sum-circular-subarray"
---

# Maximum Sum Circular Subarray / Tổng Mảng Con Vòng Tròn Lớn Nhất

> **Difficulty**: 🟡 Medium | **Category**: Dynamic Programming | **Pattern**: Kadane's Algorithm / Circular Array Trick

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Một vòng quay nhạc cụ — bạn chọn một đoạn liên tiếp (có thể "vắt" qua điểm nối đầu-cuối). Tổng lớn nhất hoặc là đoạn giữa (thẳng), hoặc đoạn "vòng" = tổng tất cả trừ đoạn giữa nhỏ nhất.

**Pattern Recognition:**

- Circular subarray = either normal subarray OR wrap-around subarray
- Wrap-around sum = totalSum − minSubarraySum (remove minimum middle)
- Handle edge case: if all elements negative, answer is maxSubarray (cannot use circular)

**Visual (nums=[1,-2,3,-2]):**

```
Normal Kadane:  max subarray = [3] = 3
Circular trick: totalSum=0, minSubarray=[-2+3+-2]=-1? no, min=-2+3-2=-1
                circular = 0 - (-4) = 4? let me recalc
nums=[1,-2,3,-2]: total=0
minKadane: -2,-2+3=1,-2+3-2=-1,-2,-2 → min=-2
circular = 0 - (-2) = 2
max(3, 2) = 3. Answer: 3

nums=[5,-3,5]: total=7, minSubarray=-3, circular=7-(-3)=10, normal=5+5=10 → 10
```

## Problem Description

Given a **circular** integer array, return the **maximum sum** of a non-empty subarray. The subarray may wrap around the end/beginning of the array.

**Example 1:** `nums=[1,-2,3,-2]` → `3` (subarray `[3]`)
**Example 2:** `nums=[5,-3,5]` → `10` (wrap-around `[5,5]`)
**Example 3:** `nums=[-3,-2,-3]` → `-2` (must include at least one element)

**Constraints:** `1 <= n <= 3×10^4`, `-3×10^4 <= nums[i] <= 3×10^4`

## 📝 Interview Tips

1. **Clarify**: Subarray must be non-empty? Yes. Can entire array be selected? Yes.
2. **Approach**: max(maxKadane, totalSum − minKadane); but if all negative, return maxKadane.
3. **Edge cases**: All negative → circular answer would be 0 (empty), disallow → use maxKadane.
4. **Optimize**: Single pass tracking both max and min Kadane simultaneously.
5. **Follow-up**: What if we need the actual indices? → Track start/end during Kadane.
6. **Complexity**: O(n) time, O(1) space.

## Solutions

```typescript
// Solution 1: Kadane + Circular Trick — Time: O(n) | Space: O(1)
function maxSubarraySumCircular(nums: number[]): number {
  let totalSum = 0;
  let maxSum = -Infinity,
    curMax = 0;
  let minSum = Infinity,
    curMin = 0;

  for (const num of nums) {
    curMax = Math.max(num, curMax + num);
    maxSum = Math.max(maxSum, curMax);

    curMin = Math.min(num, curMin + num);
    minSum = Math.min(minSum, curMin);

    totalSum += num;
  }

  // If all elements are negative, maxSum is the answer (can't use circular wrap)
  // Because circular = totalSum - minSum would be 0 (empty subarray)
  return maxSum > 0 ? Math.max(maxSum, totalSum - minSum) : maxSum;
}

// Solution 2: Explicit Kadane separation — Time: O(n) | Space: O(1)
function maxSubarraySumCircular2(nums: number[]): number {
  // Standard max subarray (Kadane's)
  function maxKadane(arr: number[]): number {
    let best = arr[0],
      cur = arr[0];
    for (let i = 1; i < arr.length; i++) {
      cur = Math.max(arr[i], cur + arr[i]);
      best = Math.max(best, cur);
    }
    return best;
  }

  // Min subarray (inverted Kadane's)
  function minKadane(arr: number[]): number {
    let best = arr[0],
      cur = arr[0];
    for (let i = 1; i < arr.length; i++) {
      cur = Math.min(arr[i], cur + arr[i]);
      best = Math.min(best, cur);
    }
    return best;
  }

  const total = nums.reduce((a, b) => a + b, 0);
  const maxNormal = maxKadane(nums);
  const minMiddle = minKadane(nums);

  // Circular case invalid if minMiddle = total (whole array is min → circular would be empty)
  const maxCircular = total - minMiddle;
  return maxCircular === 0 ? maxNormal : Math.max(maxNormal, maxCircular);
}

// Solution 3: One-pass with min/max tracking — Time: O(n) | Space: O(1)
function maxSubarraySumCircular3(nums: number[]): number {
  const n = nums.length;
  let maxEnd = nums[0],
    minEnd = nums[0];
  let maxResult = nums[0],
    minResult = nums[0];
  let total = nums[0];

  for (let i = 1; i < n; i++) {
    maxEnd = Math.max(nums[i], maxEnd + nums[i]);
    minEnd = Math.min(nums[i], minEnd + nums[i]);
    maxResult = Math.max(maxResult, maxEnd);
    minResult = Math.min(minResult, minEnd);
    total += nums[i];
  }

  return maxResult > 0 ? Math.max(maxResult, total - minResult) : maxResult;
}

// Tests
console.log(maxSubarraySumCircular([1, -2, 3, -2])); // 3
console.log(maxSubarraySumCircular([5, -3, 5])); // 10
console.log(maxSubarraySumCircular([-3, -2, -3])); // -2
console.log(maxSubarraySumCircular([1])); // 1
console.log(maxSubarraySumCircular([2, -1, 2])); // 4 (wrap: 2+2)
```

## 🔗 Related Problems

| Problem                                                                                                                     | Relationship                       |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)                                                         | Same problem without circular wrap |
| [Maximum Sum of Two Non-Overlapping Subarrays](https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/) | Extension with multiple subarrays  |
| [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)                                       | Subarray sum constraints           |
