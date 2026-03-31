---
layout: page
title: "Subarray With Elements Greater Than Varying Threshold"
difficulty: Hard
category: Array
tags: [Array, Stack, Union Find, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/subarray-with-elements-greater-than-varying-threshold"
---

# Subarray With Elements Greater Than Varying Threshold / Subarray With Elements Greater Than Varying Threshold

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Minimum Number of Visited Cells in a Grid](https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid) | [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.

**Pattern Recognition:**

- Signal: "group elements" + "connectivity queries" → **Union Find**
- Bài này thuộc dạng Union Find — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Subarray With Elements Greater Than Varying Threshold example:**

```
// TODO: Add step-by-step visual for Union Find
// Show one complete example with state at each step
```

---

## Problem Description

Subarray With Elements Greater Than Varying Threshold. ([LeetCode](https://leetcode.com/problems/subarray-with-elements-greater-than-varying-threshold))

Difficulty: Hard | Acceptance: 44.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/subarray-with-elements-greater-than-varying-threshold) for full constraints

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
function subarrayWithElementsGreaterThanVaryingThresholdBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Union Find
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function subarrayWithElementsGreaterThanVaryingThreshold(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Union Find
  // Hint: Use union-find with path compression and union by rank
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(subarrayWithElementsGreaterThanVaryingThreshold(/* example 1 */)); // expected
// console.log(subarrayWithElementsGreaterThanVaryingThreshold(/* example 2 */)); // expected
// console.log(subarrayWithElementsGreaterThanVaryingThreshold(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Minimum Number of Visited Cells in a Grid](https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid) — same pattern: Union Find
- [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) — same pattern: Monotonic Stack
- [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle) — same pattern: Monotonic Stack
- [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i) — same pattern: Monotonic Stack
- [Subarray With Elements Greater Than Varying Threshold — LeetCode](https://leetcode.com/problems/subarray-with-elements-greater-than-varying-threshold) — problem page
