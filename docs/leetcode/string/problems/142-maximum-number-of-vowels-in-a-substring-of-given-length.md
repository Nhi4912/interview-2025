---
layout: page
title: "Maximum Number of Vowels in a Substring of Given Length"
difficulty: Medium
category: String
tags: [String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length"
---

# Maximum Number of Vowels in a Substring of Given Length / Maximum Number of Vowels in a Substring of Given Length

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words) | [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Number of Vowels in a Substring of Given Length example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Maximum Number of Vowels in a Substring of Given Length. ([LeetCode](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length))

Difficulty: Medium | Acceptance: 60.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length) for full constraints

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
function maximumNumberOfVowelsInASubstringOfGivenLengthBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumNumberOfVowelsInASubstringOfGivenLength(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumNumberOfVowelsInASubstringOfGivenLength(/* example 1 */)); // expected
// console.log(maximumNumberOfVowelsInASubstringOfGivenLength(/* example 2 */)); // expected
// console.log(maximumNumberOfVowelsInASubstringOfGivenLength(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words) — same pattern: Sliding Window
- [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement) — same pattern: Sliding Window
- [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string) — same pattern: Sliding Window
- [Permutation in String](https://leetcode.com/problems/permutation-in-string) — same pattern: Sliding Window
- [Maximum Number of Vowels in a Substring of Given Length — LeetCode](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length) — problem page
