---
layout: page
title: "Design A Leaderboard"
difficulty: Medium
category: Design
tags: [Hash Table, Design, Sorting]
leetcode_url: "https://leetcode.com/problems/design-a-leaderboard"
---

# Design A Leaderboard / Design A Leaderboard

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system) | [Design a Todo List](https://leetcode.com/problems/design-a-todo-list)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sau khi sắp xếp, nhiều bài toán trở nên đơn giản hơn — phần tử giống nhau nằm cạnh nhau, có thể dùng binary search, two pointers.

**Pattern Recognition:**

- Signal: "order matters" + "grouping/dedup" → **Sorting**
- Bài này thuộc dạng Sorting — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Design A Leaderboard example:**

```
// TODO: Add step-by-step visual for Sorting
// Show one complete example with state at each step
```

---

## Problem Description

Design A Leaderboard. ([LeetCode](https://leetcode.com/problems/design-a-leaderboard))

Difficulty: Medium | Acceptance: 68.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/design-a-leaderboard) for full constraints

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
function designALeaderboardBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sorting
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function designALeaderboard(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sorting
  // Hint: Sort first, then use property of sorted order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(designALeaderboard(/* example 1 */)); // expected
// console.log(designALeaderboard(/* example 2 */)); // expected
// console.log(designALeaderboard(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system) — same pattern: Trie
- [Design a Todo List](https://leetcode.com/problems/design-a-todo-list) — same pattern: Sorting
- [Design a File Sharing System](https://leetcode.com/problems/design-a-file-sharing-system) — same pattern: Heap / Priority Queue
- [Tweet Counts Per Frequency](https://leetcode.com/problems/tweet-counts-per-frequency) — same pattern: Binary Search
- [Design A Leaderboard — LeetCode](https://leetcode.com/problems/design-a-leaderboard) — problem page
