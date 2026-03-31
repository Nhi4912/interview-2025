---
layout: page
title: "Mark Elements on Array by Performing Queries"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Sorting, Heap (Priority Queue), Simulation]
leetcode_url: "https://leetcode.com/problems/mark-elements-on-array-by-performing-queries"
---

# Mark Elements on Array by Performing Queries / Mark Elements on Array by Performing Queries

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Meeting Rooms III](https://leetcode.com/problems/meeting-rooms-iii) | [Find Score of an Array After Marking All Elements](https://leetcode.com/problems/find-score-of-an-array-after-marking-all-elements)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống phòng cấp cứu — bệnh nhân nặng nhất luôn được ưu tiên, bất kể ai đến trước. Heap giữ phần tử quan trọng nhất ở đầu.

**Pattern Recognition:**

- Signal: "k-th largest/smallest" + "top-k elements" → **Heap**
- Bài này thuộc dạng Heap / Priority Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Mark Elements on Array by Performing Queries example:**

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

Mark Elements on Array by Performing Queries. ([LeetCode](https://leetcode.com/problems/mark-elements-on-array-by-performing-queries))

Difficulty: Medium | Acceptance: 47.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/mark-elements-on-array-by-performing-queries) for full constraints

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
function markElementsOnArrayByPerformingQueriesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Heap / Priority Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function markElementsOnArrayByPerformingQueries(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Heap / Priority Queue
  // Hint: Use min/max heap to efficiently track k-th element
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(markElementsOnArrayByPerformingQueries(/* example 1 */)); // expected
// console.log(markElementsOnArrayByPerformingQueries(/* example 2 */)); // expected
// console.log(markElementsOnArrayByPerformingQueries(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Meeting Rooms III](https://leetcode.com/problems/meeting-rooms-iii) — same pattern: Heap / Priority Queue
- [Find Score of an Array After Marking All Elements](https://leetcode.com/problems/find-score-of-an-array-after-marking-all-elements) — same pattern: Heap / Priority Queue
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — same pattern: Heap / Priority Queue
- [Mark Elements on Array by Performing Queries — LeetCode](https://leetcode.com/problems/mark-elements-on-array-by-performing-queries) — problem page
