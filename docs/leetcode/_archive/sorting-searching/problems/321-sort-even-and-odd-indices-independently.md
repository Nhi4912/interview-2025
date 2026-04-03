---
layout: page
title: "Sort Even and Odd Indices Independently"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Sorting]
leetcode_url: "https://leetcode.com/problems/sort-even-and-odd-indices-independently"
---

# Sort Even and Odd Indices Independently / Sort Even and Odd Indices Independently

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) | [4Sum](https://leetcode.com/problems/4sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sau khi sắp xếp, nhiều bài toán trở nên đơn giản hơn — phần tử giống nhau nằm cạnh nhau, có thể dùng binary search, two pointers.

**Pattern Recognition:**

- Signal: "order matters" + "grouping/dedup" → **Sorting**
- Bài này thuộc dạng Sorting — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Sort Even and Odd Indices Independently example:**

```
// TODO: Add step-by-step visual for Sorting
// Show one complete example with state at each step
```

---

## Problem Description

Sort Even and Odd Indices Independently. ([LeetCode](https://leetcode.com/problems/sort-even-and-odd-indices-independently))

Difficulty: Easy | Acceptance: 62.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/sort-even-and-odd-indices-independently) for full constraints

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
function sortEvenAndOddIndicesIndependentlyBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sorting
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function sortEvenAndOddIndicesIndependently(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sorting
  // Hint: Sort first, then use property of sorted order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(sortEvenAndOddIndicesIndependently(/* example 1 */)); // expected
// console.log(sortEvenAndOddIndicesIndependently(/* example 2 */)); // expected
// console.log(sortEvenAndOddIndicesIndependently(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) — same pattern: Heap / Priority Queue
- [4Sum](https://leetcode.com/problems/4sum) — same pattern: Two Pointers
- [Majority Element](https://leetcode.com/problems/majority-element) — same pattern: Divide and Conquer
- [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling) — same pattern: Dynamic Programming
- [Sort Even and Odd Indices Independently — LeetCode](https://leetcode.com/problems/sort-even-and-odd-indices-independently) — problem page
