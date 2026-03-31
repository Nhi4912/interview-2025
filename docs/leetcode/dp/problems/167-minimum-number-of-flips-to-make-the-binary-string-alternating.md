---
layout: page
title: "Minimum Number of Flips to Make the Binary String Alternating"
difficulty: Medium
category: Dynamic Programming
tags: [String, Dynamic Programming, Sliding Window]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-flips-to-make-the-binary-string-alternating"
---

# Minimum Number of Flips to Make the Binary String Alternating / Minimum Number of Flips to Make the Binary String Alternating

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Minimum Window Subsequence](https://leetcode.com/problems/minimum-window-subsequence) | [Wildcard Matching](https://leetcode.com/problems/wildcard-matching)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Number of Flips to Make the Binary String Alternating example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Minimum Number of Flips to Make the Binary String Alternating. ([LeetCode](https://leetcode.com/problems/minimum-number-of-flips-to-make-the-binary-string-alternating))

Difficulty: Medium | Acceptance: 40.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-number-of-flips-to-make-the-binary-string-alternating) for full constraints

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
function minimumNumberOfFlipsToMakeTheBinaryStringAlternatingBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumNumberOfFlipsToMakeTheBinaryStringAlternating(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumNumberOfFlipsToMakeTheBinaryStringAlternating(/* example 1 */)); // expected
// console.log(minimumNumberOfFlipsToMakeTheBinaryStringAlternating(/* example 2 */)); // expected
// console.log(minimumNumberOfFlipsToMakeTheBinaryStringAlternating(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Minimum Window Subsequence](https://leetcode.com/problems/minimum-window-subsequence) — same pattern: Sliding Window
- [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) — same pattern: Dynamic Programming
- [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses) — same pattern: Dynamic Programming
- [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings) — same pattern: Two Pointers
- [Minimum Number of Flips to Make the Binary String Alternating — LeetCode](https://leetcode.com/problems/minimum-number-of-flips-to-make-the-binary-string-alternating) — problem page
