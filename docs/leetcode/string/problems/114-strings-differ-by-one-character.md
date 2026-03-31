---
layout: page
title: "Strings Differ by One Character"
difficulty: Medium
category: String
tags: [Hash Table, String, Rolling Hash, Hash Function]
leetcode_url: "https://leetcode.com/problems/strings-differ-by-one-character"
---

# Strings Differ by One Character / Strings Differ by One Character

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: String Matching
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences) | [Unique Substrings With Equal Digit Frequency](https://leetcode.com/problems/unique-substrings-with-equal-digit-frequency)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tìm pattern trong text — KMP, Rabin-Karp, hoặc Z-algorithm cho O(n+m) thay vì O(n*m) brute force.

**Pattern Recognition:**

- Signal: "find pattern in text" → **String Matching (KMP/Rabin-Karp)**
- Bài này thuộc dạng String Matching — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Strings Differ by One Character example:**

```
// TODO: Add step-by-step visual for String Matching
// Show one complete example with state at each step
```

---

## Problem Description

Strings Differ by One Character. ([LeetCode](https://leetcode.com/problems/strings-differ-by-one-character))

Difficulty: Medium | Acceptance: 41.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/strings-differ-by-one-character) for full constraints

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
function stringsDifferByOneCharacterBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — String Matching
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function stringsDifferByOneCharacter(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using String Matching
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(stringsDifferByOneCharacter(/* example 1 */)); // expected
// console.log(stringsDifferByOneCharacter(/* example 2 */)); // expected
// console.log(stringsDifferByOneCharacter(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences) — same pattern: Sliding Window
- [Unique Substrings With Equal Digit Frequency](https://leetcode.com/problems/unique-substrings-with-equal-digit-frequency) — same pattern: String Matching
- [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome) — same pattern: String Matching
- [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii) — same pattern: Trie
- [Strings Differ by One Character — LeetCode](https://leetcode.com/problems/strings-differ-by-one-character) — problem page
