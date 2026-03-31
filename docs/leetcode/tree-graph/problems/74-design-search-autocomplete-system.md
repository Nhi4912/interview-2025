---
layout: page
title: "Design Search Autocomplete System"
difficulty: Hard
category: Tree-Graph
tags: [String, Depth-First Search, Design, Trie, Sorting]
leetcode_url: "https://leetcode.com/problems/design-search-autocomplete-system"
---

# Design Search Autocomplete System / Design Search Autocomplete System

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream) | [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cây thư mục — mỗi ký tự là một cấp. Tìm kiếm prefix cực nhanh O(L) với L là độ dài từ.

**Pattern Recognition:**

- Signal: "prefix search" + "dictionary of words" → **Trie**
- Bài này thuộc dạng Trie — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Design Search Autocomplete System example:**

```
// TODO: Add step-by-step visual for Trie
// Show one complete example with state at each step
```

---

## Problem Description

Design Search Autocomplete System. ([LeetCode](https://leetcode.com/problems/design-search-autocomplete-system))

Difficulty: Hard | Acceptance: 49.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/design-search-autocomplete-system) for full constraints

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
function designSearchAutocompleteSystemBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Trie
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function designSearchAutocompleteSystem(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Trie
  // Hint: Build trie from dictionary, search by prefix
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(designSearchAutocompleteSystem(/* example 1 */)); // expected
// console.log(designSearchAutocompleteSystem(/* example 2 */)); // expected
// console.log(designSearchAutocompleteSystem(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream) — same pattern: Two Pointers
- [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) — same pattern: Trie
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system) — same pattern: Trie
- [Design Search Autocomplete System — LeetCode](https://leetcode.com/problems/design-search-autocomplete-system) — problem page
