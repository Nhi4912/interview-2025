---
layout: page
title: "Word Break II"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Hash Table, String, Dynamic Programming, Backtracking]
leetcode_url: "https://leetcode.com/problems/word-break-ii"
---

# Word Break II / Word Break II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word) | [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cây thư mục — mỗi ký tự là một cấp. Tìm kiếm prefix cực nhanh O(L) với L là độ dài từ.

**Pattern Recognition:**

- Signal: "prefix search" + "dictionary of words" → **Trie**
- Bài này thuộc dạng Trie — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Word Break II example:**

```
// TODO: Add step-by-step visual for Trie
// Show one complete example with state at each step
```

---

## Problem Description

Word Break II. ([LeetCode](https://leetcode.com/problems/word-break-ii))

Difficulty: Hard | Acceptance: 53.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/word-break-ii) for full constraints

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
function wordBreakIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Trie
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function wordBreakIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Trie
  // Hint: Build trie from dictionary, search by prefix
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(wordBreakIi(/* example 1 */)); // expected
// console.log(wordBreakIi(/* example 2 */)); // expected
// console.log(wordBreakIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word) — same pattern: Backtracking
- [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences) — same pattern: Trie
- [Extra Characters in a String](https://leetcode.com/problems/extra-characters-in-a-string) — same pattern: Trie
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Word Break II — LeetCode](https://leetcode.com/problems/word-break-ii) — problem page
