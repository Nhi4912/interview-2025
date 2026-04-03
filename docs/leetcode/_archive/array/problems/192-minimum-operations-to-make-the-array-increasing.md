---
layout: page
title: "Minimum Operations to Make the Array Increasing"
difficulty: Easy
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-operations-to-make-the-array-increasing"
---

# Minimum Operations to Make the Array Increasing / Số Thao Tác Tối Thiểu Để Mảng Tăng Dần

🟢 Easy | Array · Greedy

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Bạn có một dãy số và muốn nó tăng nghiêm ngặt. Mỗi thao tác tăng một phần tử lên 1. Với mỗi phần tử nhỏ hơn hoặc bằng phần tử trước, hãy nâng nó lên `prev + 1` — đây là cách tốt nhất vì tăng ít nhất có thể.

```
nums = [1, 1, 1]
  i=0: base, keep 1
  i=1: 1 ≤ 1 → raise to 2, ops += 2-1 = 1
  i=2: 1 ≤ 2 → raise to 3, ops += 3-1 = 2
Total ops = 3

nums = [3, 1, 2]
  i=0: base, keep 3
  i=1: 1 ≤ 3 → raise to 4, ops += 4-1 = 3
  i=2: 2 ≤ 4 → raise to 5, ops += 5-2 = 3
Total ops = 6
```

## Problem Description

Given array `nums`, in one operation you can increment any element by 1. Return the minimum number of operations to make `nums` **strictly increasing**.

- **Example 1**: `nums = [1,1,1]` → `3` (make it [1,2,3])
- **Example 2**: `nums = [1,5,2,4,1]` → `14` (make it [1,5,6,7,8])

## 📝 Interview Tips

- 💡 **Greedy minimum / Tham lam tối thiểu**: Only raise to exactly `prev+1` when needed — never raise more / chỉ nâng đúng `prev+1`
- 🔍 **In-place tracking / Theo dõi tại chỗ**: Track what the current element "should be" after raising / theo dõi giá trị hiện tại sau khi nâng
- ⚠️ **Operations count / Đếm thao tác**: ops += max(0, prev + 1 - current) / công thức đơn giản
- 🧮 **O(n) single pass / Một lượt O(n)**: Scan left to right, update prev / quét từ trái sang phải
- 📊 **No extra space / Không gian O(1)**: Only need previous value / chỉ cần giá trị trước
- 🎯 **Edge case / Trường hợp đặc biệt**: Already strictly increasing → 0 operations / đã tăng dần → 0 thao tác

## Solutions

### Solution 1: Greedy Single Pass (Optimal)

```typescript
/**
 * Raise each element to at least prev+1 when needed
 * Time: O(n) | Space: O(1)
 */
function minOperations(nums: number[]): number {
  let ops = 0;
  let prev = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const needed = prev + 1;
    if (nums[i] <= prev) {
      ops += needed - nums[i];
      prev = needed;
    } else {
      prev = nums[i];
    }
  }
  return ops;
}

// Tests
console.log(minOperations([1, 1, 1])); // 3
console.log(minOperations([1, 5, 2, 4, 1])); // 14
console.log(minOperations([8])); // 0
console.log(minOperations([1, 2, 3])); // 0
console.log(minOperations([3, 1, 2])); // 6
```

### Solution 2: Accumulate Required Value

```typescript
/**
 * Track required minimum value at each position
 * Time: O(n) | Space: O(1)
 */
function minOperationsV2(nums: number[]): number {
  let ops = 0;
  let minRequired = nums[0];
  for (let i = 1; i < nums.length; i++) {
    minRequired = Math.max(nums[i], minRequired + 1);
    ops += minRequired - nums[i];
  }
  return ops;
}

// Tests
console.log(minOperationsV2([1, 1, 1])); // 3
console.log(minOperationsV2([1, 5, 2, 4, 1])); // 14
console.log(minOperationsV2([3, 1, 2])); // 6
```

### Solution 3: Reduce functional style

```typescript
/**
 * Functional reduce approach
 * Time: O(n) | Space: O(1)
 */
function minOperationsReduce(nums: number[]): number {
  const { ops } = nums.reduce(
    ({ ops, prev }, cur) => {
      const needed = Math.max(cur, prev + 1);
      return { ops: ops + needed - cur, prev: needed };
    },
    { ops: 0, prev: nums[0] - 1 },
  );
  return ops;
}

// Tests
console.log(minOperationsReduce([1, 1, 1])); // 3
console.log(minOperationsReduce([1, 5, 2, 4, 1])); // 14
console.log(minOperationsReduce([1])); // 0
```

## 🔗 Related Problems

| #    | Problem                                         | Difficulty | Tags            |
| ---- | ----------------------------------------------- | ---------- | --------------- |
| 665  | Non-decreasing Array                            | Medium     | Greedy          |
| 1827 | Minimum Operations to Make the Array Increasing | Easy       | Greedy          |
| 2126 | Destroying Asteroids                            | Medium     | Greedy, Sorting |
| 2214 | Minimum Health to Beat Game                     | Medium     | Greedy          |
