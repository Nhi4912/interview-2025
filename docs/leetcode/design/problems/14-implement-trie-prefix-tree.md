---
layout: page
title: "Implement Trie (Prefix Tree)"
difficulty: Medium
category: Design
tags: [Hash Table, String, Design, Trie]
leetcode_url: "https://leetcode.com/problems/implement-trie-prefix-tree"
---

# Implement Trie (Prefix Tree) / Implement Trie (Prefix Tree)

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 17 companies
> **See also**: [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system) | [Design File System](https://leetcode.com/problems/design-file-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cây thư mục — mỗi ký tự là một cấp. Tìm kiếm prefix cực nhanh O(L) với L là độ dài từ.

**Pattern Recognition:**

- Signal: "prefix search" + "dictionary of words" → **Trie**
- Bài này thuộc dạng Trie — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Implement Trie (Prefix Tree) example:**

```
// TODO: Add step-by-step visual for Trie
// Show one complete example with state at each step
```

---

## Problem Description

Implement Trie (Prefix Tree). ([LeetCode](https://leetcode.com/problems/implement-trie-prefix-tree))

Difficulty: Medium | Acceptance: 67.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/implement-trie-prefix-tree) for full constraints

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
function implementTriePrefixTreeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Trie
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function implementTriePrefixTree(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Trie
  // Hint: Build trie from dictionary, search by prefix
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(implementTriePrefixTree(/* example 1 */)); // expected
// console.log(implementTriePrefixTree(/* example 2 */)); // expected
// console.log(implementTriePrefixTree(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system) — same pattern: Trie
- [Design File System](https://leetcode.com/problems/design-file-system) — same pattern: Trie
- [Map Sum Pairs](https://leetcode.com/problems/map-sum-pairs) — same pattern: Trie
- [Implement Trie II (Prefix Tree)](https://leetcode.com/problems/implement-trie-ii-prefix-tree) — same pattern: Trie
- [Implement Trie (Prefix Tree) — LeetCode](https://leetcode.com/problems/implement-trie-prefix-tree) — problem page
