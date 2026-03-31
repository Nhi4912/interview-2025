---
layout: page
title: "Maximum Sum Circular Subarray"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Divide and Conquer, Dynamic Programming, Queue, Monotonic Queue]
leetcode_url: "https://leetcode.com/problems/maximum-sum-circular-subarray"
---

# Maximum Sum Circular Subarray / Maximum Sum Circular Subarray

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Jump Game VI](https://leetcode.com/problems/jump-game-vi) | [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Phân tích bài "Maximum Sum Circular Subarray" — xác định pattern phù hợp dựa trên constraints và input/output.

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Monotonic Queue**
- Bài này thuộc dạng Monotonic Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Sum Circular Subarray example:**

```
// TODO: Add step-by-step visual for Monotonic Queue
// Show one complete example with state at each step
```

---

## Problem Description

Maximum Sum Circular Subarray. ([LeetCode](https://leetcode.com/problems/maximum-sum-circular-subarray))

Difficulty: Medium | Acceptance: 47.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-sum-circular-subarray) for full constraints

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
function maximumSumCircularSubarrayBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Monotonic Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumSumCircularSubarray(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Monotonic Queue
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumSumCircularSubarray(/* example 1 */)); // expected
// console.log(maximumSumCircularSubarray(/* example 2 */)); // expected
// console.log(maximumSumCircularSubarray(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Jump Game VI](https://leetcode.com/problems/jump-game-vi) — same pattern: Monotonic Queue
- [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum) — same pattern: Monotonic Queue
- [Delivering Boxes from Storage to Ports](https://leetcode.com/problems/delivering-boxes-from-storage-to-ports) — same pattern: Segment Tree
- [Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit) — same pattern: Monotonic Queue
- [Maximum Sum Circular Subarray — LeetCode](https://leetcode.com/problems/maximum-sum-circular-subarray) — problem page
