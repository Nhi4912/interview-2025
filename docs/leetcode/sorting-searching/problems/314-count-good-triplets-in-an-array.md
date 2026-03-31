---
layout: page
title: "Count Good Triplets in an Array"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Divide and Conquer, Binary Indexed Tree, Segment Tree]
leetcode_url: "https://leetcode.com/problems/count-good-triplets-in-an-array"
---

# Count Good Triplets in an Array / Count Good Triplets in an Array

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Segment Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions) | [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Cấu trúc dữ liệu cho range queries — cập nhật và truy vấn đoạn trong O(log n).

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Segment Tree**
- Bài này thuộc dạng Segment Tree — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Count Good Triplets in an Array example:**

```
// TODO: Add step-by-step visual for Segment Tree
// Show one complete example with state at each step
```

---

## Problem Description

Count Good Triplets in an Array. ([LeetCode](https://leetcode.com/problems/count-good-triplets-in-an-array))

Difficulty: Hard | Acceptance: 66.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/count-good-triplets-in-an-array) for full constraints

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
function countGoodTripletsInAnArrayBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Segment Tree
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function countGoodTripletsInAnArray(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Segment Tree
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(countGoodTripletsInAnArray(/* example 1 */)); // expected
// console.log(countGoodTripletsInAnArray(/* example 2 */)); // expected
// console.log(countGoodTripletsInAnArray(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions) — same pattern: Segment Tree
- [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self) — same pattern: Segment Tree
- [Count of Range Sum](https://leetcode.com/problems/count-of-range-sum) — same pattern: Segment Tree
- [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem) — same pattern: Segment Tree
- [Count Good Triplets in an Array — LeetCode](https://leetcode.com/problems/count-good-triplets-in-an-array) — problem page
