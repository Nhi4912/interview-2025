---
layout: page
title: "Maximum Number of Non-overlapping Palindrome Substrings"
difficulty: Hard
category: Dynamic Programming
tags: [Two Pointers, String, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-non-overlapping-palindrome-substrings"
---

# Maximum Number of Non-overlapping Palindrome Substrings / Maximum Number of Non-overlapping Palindrome Substrings

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) | [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Number of Non-overlapping Palindrome Substrings example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Maximum Number of Non-overlapping Palindrome Substrings. ([LeetCode](https://leetcode.com/problems/maximum-number-of-non-overlapping-palindrome-substrings))

Difficulty: Hard | Acceptance: 41.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-number-of-non-overlapping-palindrome-substrings) for full constraints

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
function maximumNumberOfNonOverlappingPalindromeSubstringsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumNumberOfNonOverlappingPalindromeSubstrings(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumNumberOfNonOverlappingPalindromeSubstrings(/* example 1 */)); // expected
// console.log(maximumNumberOfNonOverlappingPalindromeSubstrings(/* example 2 */)); // expected
// console.log(maximumNumberOfNonOverlappingPalindromeSubstrings(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) — same pattern: Dynamic Programming
- [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings) — same pattern: Two Pointers
- [Is Subsequence](https://leetcode.com/problems/is-subsequence) — same pattern: Two Pointers
- [Longest String Chain](https://leetcode.com/problems/longest-string-chain) — same pattern: Two Pointers
- [Maximum Number of Non-overlapping Palindrome Substrings — LeetCode](https://leetcode.com/problems/maximum-number-of-non-overlapping-palindrome-substrings) — problem page
