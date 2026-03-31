---
layout: page
title: "K-th Smallest in Lexicographical Order"
difficulty: Hard
category: String
tags: [Trie]
leetcode_url: "https://leetcode.com/problems/k-th-smallest-in-lexicographical-order"
---

# K-th Smallest in Lexicographical Order / K-th Smallest in Lexicographical Order

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree) | [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cây thư mục — mỗi ký tự là một cấp. Tìm kiếm prefix cực nhanh O(L) với L là độ dài từ.

**Pattern Recognition:**

- Signal: "prefix search" + "dictionary of words" → **Trie**
- Bài này thuộc dạng Trie — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — K-th Smallest in Lexicographical Order example:**

```
// TODO: Add step-by-step visual for Trie
// Show one complete example with state at each step
```

---

## Problem Description

K-th Smallest in Lexicographical Order. ([LeetCode](https://leetcode.com/problems/k-th-smallest-in-lexicographical-order))

Difficulty: Hard | Acceptance: 45.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/k-th-smallest-in-lexicographical-order) for full constraints

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
function kThSmallestInLexicographicalOrderBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Trie
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function kThSmallestInLexicographicalOrder(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Trie
  // Hint: Build trie from dictionary, search by prefix
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(kThSmallestInLexicographicalOrder(/* example 1 */)); // expected
// console.log(kThSmallestInLexicographicalOrder(/* example 2 */)); // expected
// console.log(kThSmallestInLexicographicalOrder(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree) — same pattern: Trie
- [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) — same pattern: Trie
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Word Break II](https://leetcode.com/problems/word-break-ii) — same pattern: Trie
- [K-th Smallest in Lexicographical Order — LeetCode](https://leetcode.com/problems/k-th-smallest-in-lexicographical-order) — problem page
