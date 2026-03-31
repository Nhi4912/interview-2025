---
layout: page
title: "Find the Longest Valid Obstacle Course at Each Position"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Binary Indexed Tree]
leetcode_url: "https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position"
---

# Find the Longest Valid Obstacle Course at Each Position / Find the Longest Valid Obstacle Course at Each Position

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Indexed Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Block Placement Queries](https://leetcode.com/problems/block-placement-queries) | [Online Majority Element In Subarray](https://leetcode.com/problems/online-majority-element-in-subarray)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống Segment Tree nhưng đơn giản hơn — dùng cho prefix sum queries và point updates.

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Binary Indexed Tree**
- Bài này thuộc dạng Binary Indexed Tree — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find the Longest Valid Obstacle Course at Each Position example:**

```
// TODO: Add step-by-step visual for Binary Indexed Tree
// Show one complete example with state at each step
```

---

## Problem Description

Find the Longest Valid Obstacle Course at Each Position. ([LeetCode](https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position))

Difficulty: Hard | Acceptance: 62.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position) for full constraints

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
function findTheLongestValidObstacleCourseAtEachPositionBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Indexed Tree
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findTheLongestValidObstacleCourseAtEachPosition(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Indexed Tree
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findTheLongestValidObstacleCourseAtEachPosition(/* example 1 */)); // expected
// console.log(findTheLongestValidObstacleCourseAtEachPosition(/* example 2 */)); // expected
// console.log(findTheLongestValidObstacleCourseAtEachPosition(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Block Placement Queries](https://leetcode.com/problems/block-placement-queries) — same pattern: Segment Tree
- [Online Majority Element In Subarray](https://leetcode.com/problems/online-majority-element-in-subarray) — same pattern: Segment Tree
- [Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions) — same pattern: Segment Tree
- [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self) — same pattern: Segment Tree
- [Find the Longest Valid Obstacle Course at Each Position — LeetCode](https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position) — problem page
