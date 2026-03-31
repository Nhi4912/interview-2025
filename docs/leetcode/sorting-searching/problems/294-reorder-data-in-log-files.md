---
layout: page
title: "Reorder Data in Log Files"
difficulty: Medium
category: Sorting-Searching
tags: [Array, String, Sorting]
leetcode_url: "https://leetcode.com/problems/reorder-data-in-log-files"
---

# Reorder Data in Log Files / Reorder Data in Log Files

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Largest Number](https://leetcode.com/problems/largest-number) | [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sau khi sắp xếp, nhiều bài toán trở nên đơn giản hơn — phần tử giống nhau nằm cạnh nhau, có thể dùng binary search, two pointers.

**Pattern Recognition:**

- Signal: "order matters" + "grouping/dedup" → **Sorting**
- Bài này thuộc dạng Sorting — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Reorder Data in Log Files example:**

```
// TODO: Add step-by-step visual for Sorting
// Show one complete example with state at each step
```

---

## Problem Description

Reorder Data in Log Files. ([LeetCode](https://leetcode.com/problems/reorder-data-in-log-files))

Difficulty: Medium | Acceptance: 56.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/reorder-data-in-log-files) for full constraints

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
function reorderDataInLogFilesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sorting
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function reorderDataInLogFiles(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sorting
  // Hint: Sort first, then use property of sorted order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(reorderDataInLogFiles(/* example 1 */)); // expected
// console.log(reorderDataInLogFiles(/* example 2 */)); // expected
// console.log(reorderDataInLogFiles(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Largest Number](https://leetcode.com/problems/largest-number) — same pattern: Greedy
- [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) — same pattern: Trie
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Longest String Chain](https://leetcode.com/problems/longest-string-chain) — same pattern: Two Pointers
- [Reorder Data in Log Files — LeetCode](https://leetcode.com/problems/reorder-data-in-log-files) — problem page
