---
layout: page
title: "Find Servers That Handled Most Number of Requests"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Greedy, Heap (Priority Queue), Ordered Set]
leetcode_url: "https://leetcode.com/problems/find-servers-that-handled-most-number-of-requests"
---

# Find Servers That Handled Most Number of Requests / Find Servers That Handled Most Number of Requests

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Minimize Deviation in Array](https://leetcode.com/problems/minimize-deviation-in-array) | [Task Scheduler](https://leetcode.com/problems/task-scheduler)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống phòng cấp cứu — bệnh nhân nặng nhất luôn được ưu tiên, bất kể ai đến trước. Heap giữ phần tử quan trọng nhất ở đầu.

**Pattern Recognition:**

- Signal: "k-th largest/smallest" + "top-k elements" → **Heap**
- Bài này thuộc dạng Heap / Priority Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find Servers That Handled Most Number of Requests example:**

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

Find Servers That Handled Most Number of Requests. ([LeetCode](https://leetcode.com/problems/find-servers-that-handled-most-number-of-requests))

Difficulty: Hard | Acceptance: 44.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-servers-that-handled-most-number-of-requests) for full constraints

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
function findServersThatHandledMostNumberOfRequestsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Heap / Priority Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findServersThatHandledMostNumberOfRequests(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Heap / Priority Queue
  // Hint: Use min/max heap to efficiently track k-th element
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findServersThatHandledMostNumberOfRequests(/* example 1 */)); // expected
// console.log(findServersThatHandledMostNumberOfRequests(/* example 2 */)); // expected
// console.log(findServersThatHandledMostNumberOfRequests(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Minimize Deviation in Array](https://leetcode.com/problems/minimize-deviation-in-array) — same pattern: Heap / Priority Queue
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — same pattern: Heap / Priority Queue
- [Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit) — same pattern: Monotonic Queue
- [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem) — same pattern: Segment Tree
- [Find Servers That Handled Most Number of Requests — LeetCode](https://leetcode.com/problems/find-servers-that-handled-most-number-of-requests) — problem page
