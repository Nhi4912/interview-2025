---
layout: page
title: "Sort Array by Increasing Frequency"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Sorting]
leetcode_url: "https://leetcode.com/problems/sort-array-by-increasing-frequency"
---

# Sort Array by Increasing Frequency / Sort Array by Increasing Frequency

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Majority Element](https://leetcode.com/problems/majority-element) | [Missing Number](https://leetcode.com/problems/missing-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sau khi sắp xếp, nhiều bài toán trở nên đơn giản hơn — phần tử giống nhau nằm cạnh nhau, có thể dùng binary search, two pointers.

**Pattern Recognition:**

- Signal: "order matters" + "grouping/dedup" → **Sorting**
- Bài này thuộc dạng Sorting — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Sort Array by Increasing Frequency example:**

```
// TODO: Add step-by-step visual for Sorting
// Show one complete example with state at each step
```

---

## Problem Description

Sort Array by Increasing Frequency. ([LeetCode](https://leetcode.com/problems/sort-array-by-increasing-frequency))

Difficulty: Easy | Acceptance: 80.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/sort-array-by-increasing-frequency) for full constraints

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
function sortArrayByIncreasingFrequencyBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sorting
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function sortArrayByIncreasingFrequency(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sorting
  // Hint: Sort first, then use property of sorted order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(sortArrayByIncreasingFrequency(/* example 1 */)); // expected
// console.log(sortArrayByIncreasingFrequency(/* example 2 */)); // expected
// console.log(sortArrayByIncreasingFrequency(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Majority Element](https://leetcode.com/problems/majority-element) — same pattern: Divide and Conquer
- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays) — same pattern: Two Pointers
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Sort Array by Increasing Frequency — LeetCode](https://leetcode.com/problems/sort-array-by-increasing-frequency) — problem page
