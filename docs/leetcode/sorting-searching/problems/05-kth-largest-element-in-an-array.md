---
layout: page
title: "Kth Largest Element in an Array"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Divide and Conquer, Sorting, Heap (Priority Queue), Quickselect]
leetcode_url: "https://leetcode.com/problems/kth-largest-element-in-an-array"
---

# Kth Largest Element in an Array / Kth Largest Element in an Array

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap / Priority Queue
> **Frequency**: ⭐ Tier 2 — Gặp ở 33+ companies
> **See also**: [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) | [Query Kth Smallest Trimmed Number](https://leetcode.com/problems/query-kth-smallest-trimmed-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống phòng cấp cứu — bệnh nhân nặng nhất luôn được ưu tiên, bất kể ai đến trước. Heap giữ phần tử quan trọng nhất ở đầu.

**Pattern Recognition:**

- Signal: "k-th largest/smallest" + "top-k elements" → **Heap**
- Bài này thuộc dạng Heap / Priority Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Kth Largest Element in an Array example:**

```
Min Heap:
        1
       / \
      3   2
     / \
    7   4

Insert: add to end, bubble up
Extract: remove root, bubble down
```

---

## Problem Description

Kth Largest Element in an Array. ([LeetCode](https://leetcode.com/problems/kth-largest-element-in-an-array))

Difficulty: Medium | Acceptance: 68.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/kth-largest-element-in-an-array) for full constraints

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
function kthLargestElementInAnArrayBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Heap / Priority Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function kthLargestElementInAnArray(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Heap / Priority Queue
  // Hint: Use min/max heap to efficiently track k-th element
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(kthLargestElementInAnArray(/* example 1 */)); // expected
// console.log(kthLargestElementInAnArray(/* example 2 */)); // expected
// console.log(kthLargestElementInAnArray(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) — same pattern: Heap / Priority Queue
- [Query Kth Smallest Trimmed Number](https://leetcode.com/problems/query-kth-smallest-trimmed-number) — same pattern: Heap / Priority Queue
- [Sort an Array](https://leetcode.com/problems/sort-an-array) — same pattern: Heap / Priority Queue
- [Majority Element](https://leetcode.com/problems/majority-element) — same pattern: Divide and Conquer
- [Kth Largest Element in an Array — LeetCode](https://leetcode.com/problems/kth-largest-element-in-an-array) — problem page
