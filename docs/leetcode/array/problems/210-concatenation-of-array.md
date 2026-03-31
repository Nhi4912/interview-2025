---
layout: page
title: "Concatenation of Array"
difficulty: Easy
category: Array
tags: [Array, Simulation]
leetcode_url: "https://leetcode.com/problems/concatenation-of-array"
---

# Concatenation of Array / Nối Mảng

🟢 Easy | Array · Simulation | LeetCode #1929

## 🧠 Intuition / Tư Duy

**Vietnamese:** Đơn giản nhất có thể — tạo một mảng mới gấp đôi và điền `ans[i] = ans[i+n] = nums[i]`. Hoặc dùng spread operator: `[...nums, ...nums]`.

```
nums = [1, 2, 1]
n = 3

ans[0] = nums[0] = 1
ans[1] = nums[1] = 2
ans[2] = nums[2] = 1
ans[3] = nums[0] = 1
ans[4] = nums[1] = 2
ans[5] = nums[2] = 1

Result: [1, 2, 1, 1, 2, 1]
```

## Problem Description

Given integer array `nums` of length `n`, return the **concatenation** of `nums` with itself — an array of length `2n` where `ans[i] = nums[i]` and `ans[i+n] = nums[i]` for all `0 <= i < n`.

This is the foundational building block used in circular array problems — doubling the array simplifies wraparound logic.

**Example 1:**

```
nums=[1,2,1]
Output: [1,2,1,1,2,1]
```

**Example 2:**

```
nums=[1,3,2,1]
Output: [1,3,2,1,1,3,2,1]
```

## 📝 Interview Tips

- **🔑 One-liner / Một dòng lệnh:** `return [...nums, ...nums]` — cleanest and fast enough for interviews
- **⚡ In-place building / Xây dựng tại chỗ:** Pre-allocate size 2n; `ans[i] = ans[i+n] = nums[i]` — single loop
- **🔄 Modular index / Chỉ số modulo:** Pattern `nums[i % n]` appears in circular problems — this concatenation enables it
- **📦 Use cases / Ứng dụng:** Circular array problems, sliding window on circular arrays, rotated array search
- **📊 Complexity / Độ phức tạp:** O(n) time, O(n) space — irreducible since output is size 2n
- **🌟 Follow-up / Câu hỏi tiếp theo:** "How would you handle k concatenations?" → Use modulo `i % n` to index without building k-copy array

## Solutions

```typescript
/**
 * Approach 1: Spread operator — idiomatic TypeScript
 * Time: O(n)
 * Space: O(n)
 */
function getConcatenation(nums: number[]): number[] {
  return [...nums, ...nums];
}

console.log(getConcatenation([1, 2, 1])); // [1,2,1,1,2,1]
console.log(getConcatenation([1, 3, 2, 1])); // [1,3,2,1,1,3,2,1]
console.log(getConcatenation([0])); // [0,0]
```

```typescript
/**
 * Approach 2: Preallocated array with index formula
 * Time: O(n)
 * Space: O(n)
 */
function getConcatenationV2(nums: number[]): number[] {
  const n = nums.length;
  const ans = new Array(2 * n);
  for (let i = 0; i < n; i++) {
    ans[i] = nums[i];
    ans[i + n] = nums[i];
  }
  return ans;
}

console.log(getConcatenationV2([1, 2, 1])); // [1,2,1,1,2,1]
console.log(getConcatenationV2([1, 3, 2, 1])); // [1,3,2,1,1,3,2,1]
```

```typescript
/**
 * Approach 3: Using concat (for k repetitions generalization)
 * Time: O(n)
 * Space: O(n)
 */
function getConcatenationGeneral(nums: number[], k: number = 2): number[] {
  let result: number[] = [];
  for (let i = 0; i < k; i++) result = result.concat(nums);
  return result;
}

console.log(getConcatenationGeneral([1, 2, 1])); // [1,2,1,1,2,1]
console.log(getConcatenationGeneral([1, 2], 3)); // [1,2,1,2,1,2]
```

## 🔗 Related Problems

| Problem                                                                                                               | Difficulty | Pattern                  |
| --------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------ |
| [Running Sum of 1d Array](https://leetcode.com/problems/running-sum-of-1d-array/)                                     | 🟢 Easy    | Array                    |
| [Shuffle the Array](https://leetcode.com/problems/shuffle-the-array/)                                                 | 🟢 Easy    | Array                    |
| [Minimum Swaps to Group All 1s Together II](https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii/) | 🟡 Medium  | Circular, Sliding Window |
| [Find the Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)       | 🟡 Medium  | Binary Search            |
