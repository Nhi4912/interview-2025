---
layout: page
title: "Valid Word Abbreviation"
difficulty: Easy
category: String
tags: [Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/valid-word-abbreviation"
---

# Valid Word Abbreviation / Valid Word Abbreviation

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) | [String Compression](https://leetcode.com/problems/string-compression)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Valid Word Abbreviation example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Valid Word Abbreviation. ([LeetCode](https://leetcode.com/problems/valid-word-abbreviation))

Difficulty: Easy | Acceptance: 36.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/valid-word-abbreviation) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Mảng đã sorted chưa? Có duplicate không?" / Ask if array is sorted and if duplicates exist
2. **Brute force**: "Dùng 2 vòng for O(n²)" → optimize with two pointers O(n) / Start with nested loops, then optimize
3. **Optimize**: "Vì mảng sorted, dùng 2 con trỏ L/R tiến vào giữa" / Since sorted, use L/R pointers moving inward
4. **Edge cases**: "Mảng rỗng, một phần tử, tất cả giống nhau" / Empty array, single element, all same values

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function validWordAbbreviationBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function validWordAbbreviation(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(validWordAbbreviation(/* example 1 */)); // expected
// console.log(validWordAbbreviation(/* example 2 */)); // expected
// console.log(validWordAbbreviation(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) — same pattern: Two Pointers
- [String Compression](https://leetcode.com/problems/string-compression) — same pattern: Two Pointers
- [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string) — same pattern: Two Pointers
- [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings) — same pattern: Two Pointers
- [Valid Word Abbreviation — LeetCode](https://leetcode.com/problems/valid-word-abbreviation) — problem page
