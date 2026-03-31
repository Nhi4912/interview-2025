---
layout: page
title: "Maximum Sum of Subsequence With Non-adjacent Elements"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Divide and Conquer, Dynamic Programming, Segment Tree]
leetcode_url: "https://leetcode.com/problems/maximum-sum-of-subsequence-with-non-adjacent-elements"
---

# Maximum Sum of Subsequence With Non-adjacent Elements / Maximum Sum of Subsequence With Non-adjacent Elements

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Segment Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem) | [Number of Longest Increasing Subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Cấu trúc dữ liệu cho range queries — cập nhật và truy vấn đoạn trong O(log n).

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Segment Tree**
- Bài này thuộc dạng Segment Tree — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Sum of Subsequence With Non-adjacent Elements example:**

```
// TODO: Add step-by-step visual for Segment Tree
// Show one complete example with state at each step
```

---

## Problem Description

Maximum Sum of Subsequence With Non-adjacent Elements. ([LeetCode](https://leetcode.com/problems/maximum-sum-of-subsequence-with-non-adjacent-elements))

Difficulty: Hard | Acceptance: 15.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-sum-of-subsequence-with-non-adjacent-elements) for full constraints

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
function maximumSumOfSubsequenceWithNonAdjacentElementsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Segment Tree
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumSumOfSubsequenceWithNonAdjacentElements(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Segment Tree
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumSumOfSubsequenceWithNonAdjacentElements(/* example 1 */)); // expected
// console.log(maximumSumOfSubsequenceWithNonAdjacentElements(/* example 2 */)); // expected
// console.log(maximumSumOfSubsequenceWithNonAdjacentElements(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem) — same pattern: Segment Tree
- [Number of Longest Increasing Subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence) — same pattern: Segment Tree
- [Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray) — same pattern: Monotonic Queue
- [Count Number of Teams](https://leetcode.com/problems/count-number-of-teams) — same pattern: Segment Tree
- [Maximum Sum of Subsequence With Non-adjacent Elements — LeetCode](https://leetcode.com/problems/maximum-sum-of-subsequence-with-non-adjacent-elements) — problem page
