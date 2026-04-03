---
layout: page
title: "Running Sum of 1d Array"
difficulty: Easy
category: Array
tags: [Array, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/running-sum-of-1d-array"
---

# Running Sum of 1d Array / Tổng Luỹ Tiến Của Mảng 1D

🟢 Easy | Array · Prefix Sum | LeetCode #1480

## 🧠 Intuition / Tư Duy

**Vietnamese:** Như đếm tiền tích luỹ — mỗi ngày cộng thêm số tiền hôm nay vào tổng ngày hôm qua. Kết quả tại vị trí `i` là tổng tất cả phần tử từ đầu đến `i`.

```
nums  = [1, 2, 3, 4]

Step 0: result[0] = 1
Step 1: result[1] = 1+2 = 3
Step 2: result[2] = 3+3 = 6
Step 3: result[3] = 6+4 = 10

Result: [1, 3, 6, 10]
```

## Problem Description

Given an array `nums`, return the **running sum** where `runningSum[i] = sum(nums[0]...nums[i])`. Each element is the sum of all previous elements plus itself.

This is the foundational **prefix sum** pattern — building it once enables O(1) range sum queries.

**Example 1:**

```
nums=[1,2,3,4]
Output: [1,3,6,10]
```

**Example 2:**

```
nums=[3,1,2,10,1]
Output: [3,4,6,16,17]
```

## 📝 Interview Tips

- **🔑 Foundation pattern / Nền tảng:** This is the building block for prefix sums — master it, then use it in harder problems
- **🔄 In-place option / Tại chỗ:** Can modify input: `nums[i] += nums[i-1]` — saves O(n) space if mutation is allowed
- **📊 Range query power / Sức mạnh truy vấn:** After building, `sum(l..r) = prefix[r+1] - prefix[l]` in O(1)
- **⚠️ Off-by-one / Lỗi lệch 1:** When prefix array has size n+1, `prefix[0]=0`; when same size, start from index 1
- **🎯 Interview follow-up / Câu hỏi tiếp theo:** "Given prefix sum, answer Q range queries in O(Q) total vs O(Q·N) brute force"
- **🌟 Variants / Biến thể:** 2D prefix sum for matrix problems, difference arrays for range updates

## Solutions

```typescript
/**
 * Approach 1: New array prefix sum
 * Time: O(n)
 * Space: O(n)
 */
function runningSum(nums: number[]): number[] {
  const result = new Array(nums.length);
  result[0] = nums[0];
  for (let i = 1; i < nums.length; i++) {
    result[i] = result[i - 1] + nums[i];
  }
  return result;
}

console.log(runningSum([1, 2, 3, 4])); // [1,3,6,10]
console.log(runningSum([1, 1, 1, 1, 1])); // [1,2,3,4,5]
console.log(runningSum([3, 1, 2, 10, 1])); // [3,4,6,16,17]
```

```typescript
/**
 * Approach 2: In-place modification (O(1) extra space)
 * Time: O(n)
 * Space: O(1) extra — modifies input
 */
function runningSumInPlace(nums: number[]): number[] {
  for (let i = 1; i < nums.length; i++) {
    nums[i] += nums[i - 1];
  }
  return nums;
}

console.log(runningSumInPlace([1, 2, 3, 4])); // [1,3,6,10]
console.log(runningSumInPlace([3, 1, 2, 10, 1])); // [3,4,6,16,17]
```

```typescript
/**
 * Approach 3: Using reduce (functional style)
 * Time: O(n)
 * Space: O(n)
 */
function runningSumFunctional(nums: number[]): number[] {
  let acc = 0;
  return nums.map((n) => (acc += n));
}

console.log(runningSumFunctional([1, 2, 3, 4])); // [1,3,6,10]
console.log(runningSumFunctional([1, 1, 1, 1, 1])); // [1,2,3,4,5]
```

## 🔗 Related Problems

| Problem                                                                                     | Difficulty | Pattern           |
| ------------------------------------------------------------------------------------------- | ---------- | ----------------- |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)               | 🟡 Medium  | Prefix Sum + Hash |
| [Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/)     | 🟢 Easy    | Prefix Sum        |
| [K Radius Subarray Averages](https://leetcode.com/problems/k-radius-subarray-averages/)     | 🟡 Medium  | Prefix Sum        |
| [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) | 🟡 Medium  | Prefix Product    |
