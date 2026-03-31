---
layout: page
title: "Count Increasing Quadruplets"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Binary Indexed Tree, Enumeration, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/count-increasing-quadruplets"
---

# Count Increasing Quadruplets / Count Increasing Quadruplets

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Indexed Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) | [Longest Mountain in Array](https://leetcode.com/problems/longest-mountain-in-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống Segment Tree nhưng đơn giản hơn — dùng cho prefix sum queries và point updates.

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Binary Indexed Tree**
- Bài này thuộc dạng Binary Indexed Tree — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Count Increasing Quadruplets example:**

```
// TODO: Add step-by-step visual for Binary Indexed Tree
// Show one complete example with state at each step
```

---

## Problem Description

Count Increasing Quadruplets. ([LeetCode](https://leetcode.com/problems/count-increasing-quadruplets))

Difficulty: Hard | Acceptance: 33.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/count-increasing-quadruplets) for full constraints

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
function countIncreasingQuadrupletsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Indexed Tree
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function countIncreasingQuadruplets(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Indexed Tree
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(countIncreasingQuadruplets(/* example 1 */)); // expected
// console.log(countIncreasingQuadruplets(/* example 2 */)); // expected
// console.log(countIncreasingQuadruplets(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) — same pattern: Prefix Sum
- [Longest Mountain in Array](https://leetcode.com/problems/longest-mountain-in-array) — same pattern: Two Pointers
- [Find All Good Indices](https://leetcode.com/problems/find-all-good-indices) — same pattern: Prefix Sum
- [Number of Longest Increasing Subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence) — same pattern: Segment Tree
- [Count Increasing Quadruplets — LeetCode](https://leetcode.com/problems/count-increasing-quadruplets) — problem page
