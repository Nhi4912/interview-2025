---
layout: page
title: "Shortest Subarray to be Removed to Make Array Sorted"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Stack, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted"
---

# Shortest Subarray to be Removed to Make Array Sorted / Shortest Subarray to be Removed to Make Array Sorted

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [132 Pattern](https://leetcode.com/problems/132-pattern) | [Create Maximum Number](https://leetcode.com/problems/create-maximum-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống dãy núi — giữ stack luôn đơn điệu (tăng hoặc giảm). Khi gặp phần tử phá vỡ tính đơn điệu, ta biết ngay đáp án cho các phần tử trước đó.

**Pattern Recognition:**

- Signal: "next greater/smaller element" → **Monotonic Stack**
- Bài này thuộc dạng Monotonic Stack — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Shortest Subarray to be Removed to Make Array Sorted example:**

```
arr = [2, 1, 5, 6, 2, 3]
stack (indices): []

i=0: push 0         stack=[0]          (vals: [2])
i=1: 1<2 → push     stack=[0,1]        (vals: [2,1])
i=2: 5>1 → pop, process; 5>2 → pop, process
     push           stack=[2]          (vals: [5])
...
```

---

## Problem Description

Shortest Subarray to be Removed to Make Array Sorted. ([LeetCode](https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted))

Difficulty: Medium | Acceptance: 51.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted) for full constraints

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
function shortestSubarrayToBeRemovedToMakeArraySortedBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Monotonic Stack
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function shortestSubarrayToBeRemovedToMakeArraySorted(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Monotonic Stack
  // Hint: Maintain monotonic property, pop when new element breaks it
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(shortestSubarrayToBeRemovedToMakeArraySorted(/* example 1 */)); // expected
// console.log(shortestSubarrayToBeRemovedToMakeArraySorted(/* example 2 */)); // expected
// console.log(shortestSubarrayToBeRemovedToMakeArraySorted(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [132 Pattern](https://leetcode.com/problems/132-pattern) — same pattern: Monotonic Stack
- [Create Maximum Number](https://leetcode.com/problems/create-maximum-number) — same pattern: Monotonic Stack
- [Maximum Width Ramp](https://leetcode.com/problems/maximum-width-ramp) — same pattern: Monotonic Stack
- [Find Building Where Alice and Bob Can Meet](https://leetcode.com/problems/find-building-where-alice-and-bob-can-meet) — same pattern: Segment Tree
- [Shortest Subarray to be Removed to Make Array Sorted — LeetCode](https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted) — problem page
