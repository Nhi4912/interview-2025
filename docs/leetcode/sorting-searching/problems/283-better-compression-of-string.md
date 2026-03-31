---
layout: page
title: "Better Compression of String"
difficulty: Medium
category: Sorting-Searching
tags: [Hash Table, String, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/better-compression-of-string"
---

# Better Compression of String / Better Compression of String

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Reorganize String](https://leetcode.com/problems/reorganize-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sau khi sắp xếp, nhiều bài toán trở nên đơn giản hơn — phần tử giống nhau nằm cạnh nhau, có thể dùng binary search, two pointers.

**Pattern Recognition:**

- Signal: "order matters" + "grouping/dedup" → **Sorting**
- Bài này thuộc dạng Sorting — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Better Compression of String example:**

```
// TODO: Add step-by-step visual for Sorting
// Show one complete example with state at each step
```

---

## Problem Description

Better Compression of String. ([LeetCode](https://leetcode.com/problems/better-compression-of-string))

Difficulty: Medium | Acceptance: 75.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/better-compression-of-string) for full constraints

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
function betterCompressionOfStringBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sorting
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function betterCompressionOfString(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sorting
  // Hint: Sort first, then use property of sorted order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(betterCompressionOfString(/* example 1 */)); // expected
// console.log(betterCompressionOfString(/* example 2 */)); // expected
// console.log(betterCompressionOfString(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Reorganize String](https://leetcode.com/problems/reorganize-string) — same pattern: Heap / Priority Queue
- [Rank Teams by Votes](https://leetcode.com/problems/rank-teams-by-votes) — same pattern: Sorting
- [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency) — same pattern: Heap / Priority Queue
- [Better Compression of String — LeetCode](https://leetcode.com/problems/better-compression-of-string) — problem page
