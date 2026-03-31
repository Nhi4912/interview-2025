---
layout: page
title: "Majority Element"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Divide and Conquer, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/majority-element"
---

# Majority Element / Majority Element

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Divide and Conquer
> **Frequency**: 📘 Tier 3 — Gặp ở 19 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Task Scheduler](https://leetcode.com/problems/task-scheduler)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chia đội để thi đấu — chia bài toán thành các phần nhỏ, giải riêng từng phần rồi ghép kết quả lại.

**Pattern Recognition:**

- Signal: "split problem in half" + "merge results" → **Divide and Conquer**
- Bài này thuộc dạng Divide and Conquer — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Majority Element example:**

```
// TODO: Add step-by-step visual for Divide and Conquer
// Show one complete example with state at each step
```

---

## Problem Description

Majority Element. ([LeetCode](https://leetcode.com/problems/majority-element))

Difficulty: Easy | Acceptance: 65.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/majority-element) for full constraints

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
function majorityElementBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Divide and Conquer
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function majorityElement(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Divide and Conquer
  // Hint: Split in half, solve recursively, merge results
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(majorityElement(/* example 1 */)); // expected
// console.log(majorityElement(/* example 2 */)); // expected
// console.log(majorityElement(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — same pattern: Heap / Priority Queue
- [Majority Element II](https://leetcode.com/problems/majority-element-ii) — same pattern: Sorting
- [Rank Teams by Votes](https://leetcode.com/problems/rank-teams-by-votes) — same pattern: Sorting
- [Majority Element — LeetCode](https://leetcode.com/problems/majority-element) — problem page
