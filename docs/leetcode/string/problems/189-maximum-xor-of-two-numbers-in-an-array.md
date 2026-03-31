---
layout: page
title: "Maximum XOR of Two Numbers in an Array"
difficulty: Medium
category: String
tags: [Array, Hash Table, Bit Manipulation, Trie]
leetcode_url: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array"
---

# Maximum XOR of Two Numbers in an Array / Maximum XOR of Two Numbers in an Array

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Number of Valid Words for Each Puzzle](https://leetcode.com/problems/number-of-valid-words-for-each-puzzle) | [Maximum Strong Pair XOR I](https://leetcode.com/problems/maximum-strong-pair-xor-i)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cây thư mục — mỗi ký tự là một cấp. Tìm kiếm prefix cực nhanh O(L) với L là độ dài từ.

**Pattern Recognition:**

- Signal: "prefix search" + "dictionary of words" → **Trie**
- Bài này thuộc dạng Trie — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum XOR of Two Numbers in an Array example:**

```
// TODO: Add step-by-step visual for Trie
// Show one complete example with state at each step
```

---

## Problem Description

Maximum XOR of Two Numbers in an Array. ([LeetCode](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array))

Difficulty: Medium | Acceptance: 53.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array) for full constraints

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
function maximumXorOfTwoNumbersInAnArrayBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Trie
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumXorOfTwoNumbersInAnArray(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Trie
  // Hint: Build trie from dictionary, search by prefix
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumXorOfTwoNumbersInAnArray(/* example 1 */)); // expected
// console.log(maximumXorOfTwoNumbersInAnArray(/* example 2 */)); // expected
// console.log(maximumXorOfTwoNumbersInAnArray(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Number of Valid Words for Each Puzzle](https://leetcode.com/problems/number-of-valid-words-for-each-puzzle) — same pattern: Trie
- [Maximum Strong Pair XOR I](https://leetcode.com/problems/maximum-strong-pair-xor-i) — same pattern: Trie
- [Maximum Strong Pair XOR II](https://leetcode.com/problems/maximum-strong-pair-xor-ii) — same pattern: Trie
- [Maximum Genetic Difference Query](https://leetcode.com/problems/maximum-genetic-difference-query) — same pattern: Trie
- [Maximum XOR of Two Numbers in an Array — LeetCode](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array) — problem page
