---
layout: page
title: "Design Add and Search Words Data Structure"
difficulty: Medium
category: Tree-Graph
tags: [String, Depth-First Search, Design, Trie]
leetcode_url: "https://leetcode.com/problems/design-add-and-search-words-data-structure"
---

# Design Add and Search Words Data Structure / Design Add and Search Words Data Structure

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Design Search Autocomplete System](https://leetcode.com/problems/design-search-autocomplete-system) | [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cây thư mục — mỗi ký tự là một cấp. Tìm kiếm prefix cực nhanh O(L) với L là độ dài từ.

**Pattern Recognition:**

- Signal: "prefix search" + "dictionary of words" → **Trie**
- Bài này thuộc dạng Trie — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Design Add and Search Words Data Structure example:**

```
// TODO: Add step-by-step visual for Trie
// Show one complete example with state at each step
```

---

## Problem Description

Design Add and Search Words Data Structure. ([LeetCode](https://leetcode.com/problems/design-add-and-search-words-data-structure))

Difficulty: Medium | Acceptance: 47.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/design-add-and-search-words-data-structure) for full constraints

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
function designAddAndSearchWordsDataStructureBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Trie
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function designAddAndSearchWordsDataStructure(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Trie
  // Hint: Build trie from dictionary, search by prefix
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(designAddAndSearchWordsDataStructure(/* example 1 */)); // expected
// console.log(designAddAndSearchWordsDataStructure(/* example 2 */)); // expected
// console.log(designAddAndSearchWordsDataStructure(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Design Search Autocomplete System](https://leetcode.com/problems/design-search-autocomplete-system) — same pattern: Trie
- [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree) — same pattern: Trie
- [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) — same pattern: BFS
- [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system) — same pattern: Trie
- [Design Add and Search Words Data Structure — LeetCode](https://leetcode.com/problems/design-add-and-search-words-data-structure) — problem page
