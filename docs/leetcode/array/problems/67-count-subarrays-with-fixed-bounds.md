---
layout: page
title: "Count Subarrays With Fixed Bounds"
difficulty: Hard
category: Array
tags: [Array, Queue, Sliding Window, Monotonic Queue]
leetcode_url: "https://leetcode.com/problems/count-subarrays-with-fixed-bounds"
---

# Count Subarrays With Fixed Bounds / Count Subarrays With Fixed Bounds

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Monotonic Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit) | [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Phân tích bài "Count Subarrays With Fixed Bounds" — xác định pattern phù hợp dựa trên constraints và input/output.

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Monotonic Queue**
- Bài này thuộc dạng Monotonic Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Count Subarrays With Fixed Bounds example:**

```
// TODO: Add step-by-step visual for Monotonic Queue
// Show one complete example with state at each step
```

---

## Problem Description

Count Subarrays With Fixed Bounds. ([LeetCode](https://leetcode.com/problems/count-subarrays-with-fixed-bounds))

Difficulty: Hard | Acceptance: 69.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/count-subarrays-with-fixed-bounds) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Xác nhận input constraints, edge cases" / Confirm input size, types, edge cases with interviewer
2. **Brute force**: "Bắt đầu từ brute force, rồi optimize" / Always start with naive approach, then optimize
3. **Optimize**: "Phân tích bottleneck của brute force, tìm cách giảm" / Identify the bottleneck and reduce it
4. **Edge cases**: "Input rỗng, một phần tử, giá trị cực biên" / Empty input, single element, boundary values
5. **Follow-up**: "Nếu input rất lớn? Nếu cần streaming?" / What if input is huge? What about streaming?

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function countSubarraysWithFixedBoundsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Monotonic Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function countSubarraysWithFixedBounds(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Monotonic Queue
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(countSubarraysWithFixedBounds(/* example 1 */)); // expected
// console.log(countSubarraysWithFixedBounds(/* example 2 */)); // expected
// console.log(countSubarraysWithFixedBounds(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit) — same pattern: Monotonic Queue
- [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum) — same pattern: Monotonic Queue
- [Maximum Number of Robots Within Budget](https://leetcode.com/problems/maximum-number-of-robots-within-budget) — same pattern: Monotonic Queue
- [Maximum Number of Tasks You Can Assign](https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign) — same pattern: Monotonic Queue
- [Count Subarrays With Fixed Bounds — LeetCode](https://leetcode.com/problems/count-subarrays-with-fixed-bounds) — problem page
