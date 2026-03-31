---
layout: page
title: "Number of Valid Subarrays"
difficulty: Hard
category: Array
tags: [Array, Stack, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/number-of-valid-subarrays"
---

# Number of Valid Subarrays / Số Mảng Con Hợp Lệ

> **Difficulty**: 🔴 Hard | **Category**: Array | **Pattern**: Monotonic Stack

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như đếm xem mỗi người trong hàng có thể nhìn thấy bao nhiêu người phía trước mà không ai cao hơn họ — mỗi người là "trưởng nhóm" của một dãy con, và dãy kết thúc khi gặp người thấp hơn.

**Pattern Recognition:**

- Valid subarray = starts at index i, all elements ≥ nums[i] (leftmost is minimum)
- For each i, count how many j ≥ i form a valid subarray = next index where nums[j] < nums[i]
- Monotonic stack stores indices; when popped, `stack.top` is the next smaller element

**Visual:**

```
nums = [1, 4, 2, 5, 3]
       idx 0  1  2  3  4

For idx 0 (val=1): next smaller? none → valid subarrays ending at 1,2,3,4 = 5
For idx 1 (val=4): next smaller at idx 2 → 1 valid subarray [4]
For idx 2 (val=2): next smaller? none → valid [2],[2,5],[2,5,3] = 3
For idx 3 (val=5): next smaller at idx 4 → 1 valid [5]
For idx 4 (val=3): next smaller? none → 1 valid [3]
Total = 5+1+3+1+1 = 11
```

## Problem Description

Given an array `nums`, count the number of non-empty subarrays where the leftmost element is not larger than any other element in the subarray (i.e., the leftmost element is the minimum).

**Example 1:** `nums = [1,4,2,5,3]` → `11`
**Example 2:** `nums = [3,2,1]` → `3` (only single-element subarrays are valid)

**Constraints:** `1 ≤ nums.length ≤ 5×10^4`, `0 ≤ nums[i] ≤ 10^5`

## 📝 Interview Tips

1. **Clarify**: Is the leftmost element strictly or non-strictly minimum? (Non-strict: ≤)
2. **Approach**: For each i, count (next smaller index - i); use monotonic stack for O(n)
3. **Edge cases**: All ascending (many valid), all descending (only n singles)
4. **Optimize**: Monotonic stack gives O(n); brute force is O(n²)
5. **Follow-up**: What if we need subarrays where the max is at a specific position?
6. **Complexity**: Time O(n), Space O(n)

## Solutions

```typescript
// Solution 1: Monotonic Stack — Time: O(n) | Space: O(n)
function validSubarrays(nums: number[]): number {
  const n = nums.length;
  const stack: number[] = []; // stores indices
  let count = 0;

  for (let i = 0; i < n; i++) {
    // Pop indices whose subarray ended (found a smaller element)
    while (stack.length > 0 && nums[stack[stack.length - 1]] > nums[i]) {
      const idx = stack.pop()!;
      count += i - idx;
    }
    stack.push(i);
  }

  // Remaining elements in stack: their subarrays extend to end of array
  while (stack.length > 0) {
    const idx = stack.pop()!;
    count += n - idx;
  }

  return count;
}

// Solution 2: Next Smaller Element precompute — Time: O(n) | Space: O(n)
function validSubarrays2(nums: number[]): number {
  const n = nums.length;
  const nextSmaller = new Array(n).fill(n); // default: no smaller found
  const stack: number[] = [];

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] > nums[i]) {
      nextSmaller[stack.pop()!] = i;
    }
    stack.push(i);
  }

  let total = 0;
  for (let i = 0; i < n; i++) {
    total += nextSmaller[i] - i;
  }

  return total;
}

// Solution 3: Brute force (O(n²) for verification) — Time: O(n^2) | Space: O(1)
function validSubarraysBrute(nums: number[]): number {
  const n = nums.length;
  let count = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (nums[j] < nums[i]) break;
      count++;
    }
  }

  return count;
}

// Tests
console.log(validSubarrays([1, 4, 2, 5, 3])); // 11
console.log(validSubarrays([3, 2, 1])); // 3
console.log(validSubarrays([1, 1, 1])); // 6
console.log(validSubarrays2([1, 4, 2, 5, 3])); // 11
// Verify brute matches stack solution
console.log(validSubarraysBrute([1, 4, 2, 5, 3]) === validSubarrays([1, 4, 2, 5, 3])); // true
```

## 🔗 Related Problems

| Problem                                                                                                            | Relationship                             |
| ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| [Largest Rectangle in Histogram (LeetCode 84)](https://leetcode.com/problems/largest-rectangle-in-histogram/)      | Monotonic stack for span counting        |
| [Next Greater Element I (LeetCode 496)](https://leetcode.com/problems/next-greater-element-i/)                     | Next smaller/greater via monotonic stack |
| [Number of Subarrays with Min Equals First (LeetCode 2104)](https://leetcode.com/problems/sum-of-subarray-ranges/) | Subarray range/min tracking              |
