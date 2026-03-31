---
layout: page
title: "Repeated DNA Sequences"
difficulty: Medium
category: String
tags: [Hash Table, String, Bit Manipulation, Sliding Window, Rolling Hash]
leetcode_url: "https://leetcode.com/problems/repeated-dna-sequences"
---

# Repeated DNA Sequences / Repeated DNA Sequences

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Strings Differ by One Character](https://leetcode.com/problems/strings-differ-by-one-character) | [Unique Substrings With Equal Digit Frequency](https://leetcode.com/problems/unique-substrings-with-equal-digit-frequency)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Repeated DNA Sequences example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Repeated DNA Sequences. ([LeetCode](https://leetcode.com/problems/repeated-dna-sequences))

Difficulty: Medium | Acceptance: 51.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/repeated-dna-sequences) for full constraints

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
function repeatedDnaSequencesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function repeatedDnaSequences(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(repeatedDnaSequences(/* example 1 */)); // expected
// console.log(repeatedDnaSequences(/* example 2 */)); // expected
// console.log(repeatedDnaSequences(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Strings Differ by One Character](https://leetcode.com/problems/strings-differ-by-one-character) — same pattern: String Matching
- [Unique Substrings With Equal Digit Frequency](https://leetcode.com/problems/unique-substrings-with-equal-digit-frequency) — same pattern: String Matching
- [Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring) — same pattern: Sliding Window
- [Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words) — same pattern: Sliding Window
- [Repeated DNA Sequences — LeetCode](https://leetcode.com/problems/repeated-dna-sequences) — problem page
