---
layout: page
title: "Synonymous Sentences"
difficulty: Medium
category: Backtracking
tags: [Array, Hash Table, String, Backtracking, Union Find]
leetcode_url: "https://leetcode.com/problems/synonymous-sentences"
---

# Synonymous Sentences / Synonymous Sentences

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Word Break II](https://leetcode.com/problems/word-break-ii) | [Accounts Merge](https://leetcode.com/problems/accounts-merge)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.

**Pattern Recognition:**

- Signal: "group elements" + "connectivity queries" → **Union Find**
- Bài này thuộc dạng Union Find — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Synonymous Sentences example:**

```
// TODO: Add step-by-step visual for Union Find
// Show one complete example with state at each step
```

---

## Problem Description

Synonymous Sentences. ([LeetCode](https://leetcode.com/problems/synonymous-sentences))

Difficulty: Medium | Acceptance: 56.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/synonymous-sentences) for full constraints

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
function synonymousSentencesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Union Find
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function synonymousSentences(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Union Find
  // Hint: Use union-find with path compression and union by rank
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(synonymousSentences(/* example 1 */)); // expected
// console.log(synonymousSentences(/* example 2 */)); // expected
// console.log(synonymousSentences(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Word Break II](https://leetcode.com/problems/word-break-ii) — same pattern: Trie
- [Accounts Merge](https://leetcode.com/problems/accounts-merge) — same pattern: Union Find
- [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word) — same pattern: Backtracking
- [Similar String Groups](https://leetcode.com/problems/similar-string-groups) — same pattern: Union Find
- [Synonymous Sentences — LeetCode](https://leetcode.com/problems/synonymous-sentences) — problem page
