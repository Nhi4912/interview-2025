---
layout: page
title: "Apply Operations to Make String Empty"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/apply-operations-to-make-string-empty"
---

# Apply Operations to Make String Empty / Apply Operations to Make String Empty

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Majority Element](https://leetcode.com/problems/majority-element) | [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sau khi sắp xếp, nhiều bài toán trở nên đơn giản hơn — phần tử giống nhau nằm cạnh nhau, có thể dùng binary search, two pointers.

**Pattern Recognition:**

- Signal: "order matters" + "grouping/dedup" → **Sorting**
- Bài này thuộc dạng Sorting — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Apply Operations to Make String Empty example:**

```
// TODO: Add step-by-step visual for Sorting
// Show one complete example with state at each step
```

---

## Problem Description

Apply Operations to Make String Empty. ([LeetCode](https://leetcode.com/problems/apply-operations-to-make-string-empty))

Difficulty: Medium | Acceptance: 56.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/apply-operations-to-make-string-empty) for full constraints

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
function applyOperationsToMakeStringEmptyBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sorting
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function applyOperationsToMakeStringEmpty(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sorting
  // Hint: Sort first, then use property of sorted order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(applyOperationsToMakeStringEmpty(/* example 1 */)); // expected
// console.log(applyOperationsToMakeStringEmpty(/* example 2 */)); // expected
// console.log(applyOperationsToMakeStringEmpty(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Majority Element](https://leetcode.com/problems/majority-element) — same pattern: Divide and Conquer
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — same pattern: Heap / Priority Queue
- [Majority Element II](https://leetcode.com/problems/majority-element-ii) — same pattern: Sorting
- [Apply Operations to Make String Empty — LeetCode](https://leetcode.com/problems/apply-operations-to-make-string-empty) — problem page
