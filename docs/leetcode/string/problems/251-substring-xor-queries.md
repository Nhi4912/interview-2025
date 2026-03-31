---
layout: page
title: "Substring XOR Queries"
difficulty: Medium
category: String
tags: [Array, Hash Table, String, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/substring-xor-queries"
---

# Substring XOR Queries / Substring XOR Queries

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring) | [Number of Valid Words for Each Puzzle](https://leetcode.com/problems/number-of-valid-words-for-each-puzzle)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Làm việc trực tiếp với bit (0/1) — nhanh hơn phép toán thông thường. XOR, AND, OR, shift là các công cụ chính.

**Pattern Recognition:**

- Signal: "binary representation" + "XOR/AND/OR properties" → **Bit Manipulation**
- Bài này thuộc dạng Bit Manipulation — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Substring XOR Queries example:**

```
// TODO: Add step-by-step visual for Bit Manipulation
// Show one complete example with state at each step
```

---

## Problem Description

Substring XOR Queries. ([LeetCode](https://leetcode.com/problems/substring-xor-queries))

Difficulty: Medium | Acceptance: 34.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/substring-xor-queries) for full constraints

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
function substringXorQueriesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Bit Manipulation
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function substringXorQueries(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Bit Manipulation
  // Hint: Use XOR, AND, OR, shift operations on bits
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(substringXorQueries(/* example 1 */)); // expected
// console.log(substringXorQueries(/* example 2 */)); // expected
// console.log(substringXorQueries(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring) — same pattern: Prefix Sum
- [Number of Valid Words for Each Puzzle](https://leetcode.com/problems/number-of-valid-words-for-each-puzzle) — same pattern: Trie
- [Count Pairs Of Similar Strings](https://leetcode.com/problems/count-pairs-of-similar-strings) — same pattern: Bit Manipulation
- [Count the Number of Consistent Strings](https://leetcode.com/problems/count-the-number-of-consistent-strings) — same pattern: Bit Manipulation
- [Substring XOR Queries — LeetCode](https://leetcode.com/problems/substring-xor-queries) — problem page
