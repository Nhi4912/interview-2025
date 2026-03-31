---
layout: page
title: "Build Array Where You Can Find The Maximum Exactly K Comparisons"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/build-array-where-you-can-find-the-maximum-exactly-k-comparisons"
---

# Build Array Where You Can Find The Maximum Exactly K Comparisons / Build Array Where You Can Find The Maximum Exactly K Comparisons

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) | [Find All Good Indices](https://leetcode.com/problems/find-all-good-indices)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Build Array Where You Can Find The Maximum Exactly K Comparisons example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Build Array Where You Can Find The Maximum Exactly K Comparisons. ([LeetCode](https://leetcode.com/problems/build-array-where-you-can-find-the-maximum-exactly-k-comparisons))

Difficulty: Hard | Acceptance: 66.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/build-array-where-you-can-find-the-maximum-exactly-k-comparisons) for full constraints

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
function buildArrayWhereYouCanFindTheMaximumExactlyKComparisonsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function buildArrayWhereYouCanFindTheMaximumExactlyKComparisons(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(buildArrayWhereYouCanFindTheMaximumExactlyKComparisons(/* example 1 */)); // expected
// console.log(buildArrayWhereYouCanFindTheMaximumExactlyKComparisons(/* example 2 */)); // expected
// console.log(buildArrayWhereYouCanFindTheMaximumExactlyKComparisons(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) — same pattern: Prefix Sum
- [Find All Good Indices](https://leetcode.com/problems/find-all-good-indices) — same pattern: Prefix Sum
- [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i) — same pattern: Prefix Sum
- [Find the Count of Monotonic Pairs II](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii) — same pattern: Prefix Sum
- [Build Array Where You Can Find The Maximum Exactly K Comparisons — LeetCode](https://leetcode.com/problems/build-array-where-you-can-find-the-maximum-exactly-k-comparisons) — problem page
