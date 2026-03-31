---
layout: page
title: "Best Meeting Point"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Math, Sorting, Matrix]
leetcode_url: "https://leetcode.com/problems/best-meeting-point"
---

# Best Meeting Point / Best Meeting Point

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Get Biggest Three Rhombus Sums in a Grid](https://leetcode.com/problems/get-biggest-three-rhombus-sums-in-a-grid) | [Minimum Operations to Make a Uni-Value Grid](https://leetcode.com/problems/minimum-operations-to-make-a-uni-value-grid)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sau khi sắp xếp, nhiều bài toán trở nên đơn giản hơn — phần tử giống nhau nằm cạnh nhau, có thể dùng binary search, two pointers.

**Pattern Recognition:**

- Signal: "order matters" + "grouping/dedup" → **Sorting**
- Bài này thuộc dạng Sorting — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Best Meeting Point example:**

```
// TODO: Add step-by-step visual for Sorting
// Show one complete example with state at each step
```

---

## Problem Description

Best Meeting Point. ([LeetCode](https://leetcode.com/problems/best-meeting-point))

Difficulty: Hard | Acceptance: 61.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/best-meeting-point) for full constraints

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
function bestMeetingPointBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sorting
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function bestMeetingPoint(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sorting
  // Hint: Sort first, then use property of sorted order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(bestMeetingPoint(/* example 1 */)); // expected
// console.log(bestMeetingPoint(/* example 2 */)); // expected
// console.log(bestMeetingPoint(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Get Biggest Three Rhombus Sums in a Grid](https://leetcode.com/problems/get-biggest-three-rhombus-sums-in-a-grid) — same pattern: Prefix Sum
- [Minimum Operations to Make a Uni-Value Grid](https://leetcode.com/problems/minimum-operations-to-make-a-uni-value-grid) — same pattern: Sorting
- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Maximum Product of Three Numbers](https://leetcode.com/problems/maximum-product-of-three-numbers) — same pattern: Sorting
- [Best Meeting Point — LeetCode](https://leetcode.com/problems/best-meeting-point) — problem page
