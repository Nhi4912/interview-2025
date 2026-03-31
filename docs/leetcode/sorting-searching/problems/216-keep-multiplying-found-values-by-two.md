---
layout: page
title: "Keep Multiplying Found Values by Two"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Sorting, Simulation]
leetcode_url: "https://leetcode.com/problems/keep-multiplying-found-values-by-two"
---

# Keep Multiplying Found Values by Two / Keep Multiplying Found Values by Two

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Mark Elements on Array by Performing Queries](https://leetcode.com/problems/mark-elements-on-array-by-performing-queries) | [Meeting Rooms III](https://leetcode.com/problems/meeting-rooms-iii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sau khi sắp xếp, nhiều bài toán trở nên đơn giản hơn — phần tử giống nhau nằm cạnh nhau, có thể dùng binary search, two pointers.

**Pattern Recognition:**

- Signal: "order matters" + "grouping/dedup" → **Sorting**
- Bài này thuộc dạng Sorting — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Keep Multiplying Found Values by Two example:**

```
// TODO: Add step-by-step visual for Sorting
// Show one complete example with state at each step
```

---

## Problem Description

Keep Multiplying Found Values by Two. ([LeetCode](https://leetcode.com/problems/keep-multiplying-found-values-by-two))

Difficulty: Easy | Acceptance: 71.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/keep-multiplying-found-values-by-two) for full constraints

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
function keepMultiplyingFoundValuesByTwoBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sorting
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function keepMultiplyingFoundValuesByTwo(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sorting
  // Hint: Sort first, then use property of sorted order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(keepMultiplyingFoundValuesByTwo(/* example 1 */)); // expected
// console.log(keepMultiplyingFoundValuesByTwo(/* example 2 */)); // expected
// console.log(keepMultiplyingFoundValuesByTwo(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Mark Elements on Array by Performing Queries](https://leetcode.com/problems/mark-elements-on-array-by-performing-queries) — same pattern: Heap / Priority Queue
- [Meeting Rooms III](https://leetcode.com/problems/meeting-rooms-iii) — same pattern: Heap / Priority Queue
- [Find Score of an Array After Marking All Elements](https://leetcode.com/problems/find-score-of-an-array-after-marking-all-elements) — same pattern: Heap / Priority Queue
- [Majority Element](https://leetcode.com/problems/majority-element) — same pattern: Divide and Conquer
- [Keep Multiplying Found Values by Two — LeetCode](https://leetcode.com/problems/keep-multiplying-found-values-by-two) — problem page
