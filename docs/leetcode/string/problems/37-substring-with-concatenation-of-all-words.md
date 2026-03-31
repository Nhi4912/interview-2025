---
layout: page
title: "Substring with Concatenation of All Words"
difficulty: Hard
category: String
tags: [Hash Table, String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/substring-with-concatenation-of-all-words"
---

# Substring with Concatenation of All Words / Substring with Concatenation of All Words

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 10 companies
> **See also**: [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement) | [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Substring with Concatenation of All Words example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Substring with Concatenation of All Words. ([LeetCode](https://leetcode.com/problems/substring-with-concatenation-of-all-words))

Difficulty: Hard | Acceptance: 33.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/substring-with-concatenation-of-all-words) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Cần contiguous subarray hay subsequence?" / Subarray (contiguous) vs subsequence (non-contiguous)
2. **Brute force**: "Thử mọi subarray O(n²)" → optimize with sliding window O(n) / Try all subarrays then optimize
3. **Optimize**: "Dùng window expand/shrink, track state bằng map/counter" / Use expand right, shrink left pattern
4. **Edge cases**: "Chuỗi rỗng, k > array length, tất cả unique/duplicate" / Empty input, k exceeds length

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function substringWithConcatenationOfAllWordsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function substringWithConcatenationOfAllWords(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(substringWithConcatenationOfAllWords(/* example 1 */)); // expected
// console.log(substringWithConcatenationOfAllWords(/* example 2 */)); // expected
// console.log(substringWithConcatenationOfAllWords(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement) — same pattern: Sliding Window
- [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string) — same pattern: Sliding Window
- [Permutation in String](https://leetcode.com/problems/permutation-in-string) — same pattern: Sliding Window
- [Longest Substring with At Most K Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters) — same pattern: Sliding Window
- [Substring with Concatenation of All Words — LeetCode](https://leetcode.com/problems/substring-with-concatenation-of-all-words) — problem page
