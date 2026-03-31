---
layout: page
title: "Sort Integers by The Number of 1 Bits"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Bit Manipulation, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits"
---

# Sort Integers by The Number of 1 Bits / Sort Integers by The Number of 1 Bits

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Majority Element](https://leetcode.com/problems/majority-element) | [Missing Number](https://leetcode.com/problems/missing-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sau khi sắp xếp, nhiều bài toán trở nên đơn giản hơn — phần tử giống nhau nằm cạnh nhau, có thể dùng binary search, two pointers.

**Pattern Recognition:**

- Signal: "order matters" + "grouping/dedup" → **Sorting**
- Bài này thuộc dạng Sorting — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Sort Integers by The Number of 1 Bits example:**

```
// TODO: Add step-by-step visual for Sorting
// Show one complete example with state at each step
```

---

## Problem Description

Sort Integers by The Number of 1 Bits. ([LeetCode](https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits))

Difficulty: Easy | Acceptance: 78.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits) for full constraints

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
function sortIntegersByTheNumberOf1BitsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sorting
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function sortIntegersByTheNumberOf1Bits(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sorting
  // Hint: Sort first, then use property of sorted order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(sortIntegersByTheNumberOf1Bits(/* example 1 */)); // expected
// console.log(sortIntegersByTheNumberOf1Bits(/* example 2 */)); // expected
// console.log(sortIntegersByTheNumberOf1Bits(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Majority Element](https://leetcode.com/problems/majority-element) — same pattern: Divide and Conquer
- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — same pattern: Heap / Priority Queue
- [Sort Integers by The Number of 1 Bits — LeetCode](https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits) — problem page
