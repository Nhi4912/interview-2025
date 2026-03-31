---
layout: page
title: "Smallest Value of the Rearranged Number"
difficulty: Medium
category: Sorting-Searching
tags: [Math, Sorting]
leetcode_url: "https://leetcode.com/problems/smallest-value-of-the-rearranged-number"
---

# Smallest Value of the Rearranged Number / Smallest Value of the Rearranged Number

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Maximum Product of Three Numbers](https://leetcode.com/problems/maximum-product-of-three-numbers)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sau khi sắp xếp, nhiều bài toán trở nên đơn giản hơn — phần tử giống nhau nằm cạnh nhau, có thể dùng binary search, two pointers.

**Pattern Recognition:**

- Signal: "order matters" + "grouping/dedup" → **Sorting**
- Bài này thuộc dạng Sorting — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Smallest Value of the Rearranged Number example:**

```
// TODO: Add step-by-step visual for Sorting
// Show one complete example with state at each step
```

---

## Problem Description

Smallest Value of the Rearranged Number. ([LeetCode](https://leetcode.com/problems/smallest-value-of-the-rearranged-number))

Difficulty: Medium | Acceptance: 52.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/smallest-value-of-the-rearranged-number) for full constraints

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
function smallestValueOfTheRearrangedNumberBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sorting
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function smallestValueOfTheRearrangedNumber(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sorting
  // Hint: Sort first, then use property of sorted order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(smallestValueOfTheRearrangedNumber(/* example 1 */)); // expected
// console.log(smallestValueOfTheRearrangedNumber(/* example 2 */)); // expected
// console.log(smallestValueOfTheRearrangedNumber(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Maximum Product of Three Numbers](https://leetcode.com/problems/maximum-product-of-three-numbers) — same pattern: Sorting
- [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) — same pattern: Heap / Priority Queue
- [Maximum Number of Visible Points](https://leetcode.com/problems/maximum-number-of-visible-points) — same pattern: Sliding Window
- [Smallest Value of the Rearranged Number — LeetCode](https://leetcode.com/problems/smallest-value-of-the-rearranged-number) — problem page
