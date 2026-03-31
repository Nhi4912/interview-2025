---
layout: page
title: "Maximum Number of Tasks You Can Assign"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Greedy, Queue]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign"
---

# Maximum Number of Tasks You Can Assign / Maximum Number of Tasks You Can Assign

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Monotonic Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Most Profit Assigning Work](https://leetcode.com/problems/most-profit-assigning-work) | [Valid Triangle Number](https://leetcode.com/problems/valid-triangle-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Phân tích bài "Maximum Number of Tasks You Can Assign" — xác định pattern phù hợp dựa trên constraints và input/output.

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Monotonic Queue**
- Bài này thuộc dạng Monotonic Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Number of Tasks You Can Assign example:**

```
// TODO: Add step-by-step visual for Monotonic Queue
// Show one complete example with state at each step
```

---

## Problem Description

Maximum Number of Tasks You Can Assign. ([LeetCode](https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign))

Difficulty: Hard | Acceptance: 50.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign) for full constraints

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
function maximumNumberOfTasksYouCanAssignBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Monotonic Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumNumberOfTasksYouCanAssign(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Monotonic Queue
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumNumberOfTasksYouCanAssign(/* example 1 */)); // expected
// console.log(maximumNumberOfTasksYouCanAssign(/* example 2 */)); // expected
// console.log(maximumNumberOfTasksYouCanAssign(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Most Profit Assigning Work](https://leetcode.com/problems/most-profit-assigning-work) — same pattern: Two Pointers
- [Valid Triangle Number](https://leetcode.com/problems/valid-triangle-number) — same pattern: Two Pointers
- [Maximum Total Beauty of the Gardens](https://leetcode.com/problems/maximum-total-beauty-of-the-gardens) — same pattern: Two Pointers
- [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays) — same pattern: Two Pointers
- [Maximum Number of Tasks You Can Assign — LeetCode](https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign) — problem page
