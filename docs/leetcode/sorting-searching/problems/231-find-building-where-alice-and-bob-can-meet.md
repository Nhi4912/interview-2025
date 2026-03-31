---
layout: page
title: "Find Building Where Alice and Bob Can Meet"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Stack, Binary Indexed Tree, Segment Tree]
leetcode_url: "https://leetcode.com/problems/find-building-where-alice-and-bob-can-meet"
---

# Find Building Where Alice and Bob Can Meet / Find Building Where Alice and Bob Can Meet

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Segment Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem) | [Block Placement Queries](https://leetcode.com/problems/block-placement-queries)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Cấu trúc dữ liệu cho range queries — cập nhật và truy vấn đoạn trong O(log n).

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Segment Tree**
- Bài này thuộc dạng Segment Tree — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find Building Where Alice and Bob Can Meet example:**

```
// TODO: Add step-by-step visual for Segment Tree
// Show one complete example with state at each step
```

---

## Problem Description

Find Building Where Alice and Bob Can Meet. ([LeetCode](https://leetcode.com/problems/find-building-where-alice-and-bob-can-meet))

Difficulty: Hard | Acceptance: 52.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-building-where-alice-and-bob-can-meet) for full constraints

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
function findBuildingWhereAliceAndBobCanMeetBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Segment Tree
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findBuildingWhereAliceAndBobCanMeet(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Segment Tree
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findBuildingWhereAliceAndBobCanMeet(/* example 1 */)); // expected
// console.log(findBuildingWhereAliceAndBobCanMeet(/* example 2 */)); // expected
// console.log(findBuildingWhereAliceAndBobCanMeet(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem) — same pattern: Segment Tree
- [Block Placement Queries](https://leetcode.com/problems/block-placement-queries) — same pattern: Segment Tree
- [Minimum Number of Visited Cells in a Grid](https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid) — same pattern: Union Find
- [Shortest Subarray to be Removed to Make Array Sorted](https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted) — same pattern: Monotonic Stack
- [Find Building Where Alice and Bob Can Meet — LeetCode](https://leetcode.com/problems/find-building-where-alice-and-bob-can-meet) — problem page
