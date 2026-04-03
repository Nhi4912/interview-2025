---
layout: page
title: "Height Checker"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Sorting, Counting Sort]
leetcode_url: "https://leetcode.com/problems/height-checker"
---

# Height Checker / Height Checker

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [H-Index](https://leetcode.com/problems/h-index) | [How Many Numbers Are Smaller Than the Current Number](https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sau khi sắp xếp, nhiều bài toán trở nên đơn giản hơn — phần tử giống nhau nằm cạnh nhau, có thể dùng binary search, two pointers.

**Pattern Recognition:**

- Signal: "order matters" + "grouping/dedup" → **Sorting**
- Bài này thuộc dạng Sorting — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Height Checker example:**

```
// TODO: Add step-by-step visual for Sorting
// Show one complete example with state at each step
```

---

## Problem Description

Height Checker. ([LeetCode](https://leetcode.com/problems/height-checker))

Difficulty: Easy | Acceptance: 81.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/height-checker) for full constraints

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
function heightCheckerBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sorting
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function heightChecker(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sorting
  // Hint: Sort first, then use property of sorted order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(heightChecker(/* example 1 */)); // expected
// console.log(heightChecker(/* example 2 */)); // expected
// console.log(heightChecker(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [H-Index](https://leetcode.com/problems/h-index) — same pattern: Sorting
- [How Many Numbers Are Smaller Than the Current Number](https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number) — same pattern: Sorting
- [Sort an Array](https://leetcode.com/problems/sort-an-array) — same pattern: Heap / Priority Queue
- [Relative Sort Array](https://leetcode.com/problems/relative-sort-array) — same pattern: Sorting
- [Height Checker — LeetCode](https://leetcode.com/problems/height-checker) — problem page
