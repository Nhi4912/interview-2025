---
layout: page
title: "Substrings of Size Three with Distinct Characters"
difficulty: Easy
category: String
tags: [Hash Table, String, Sliding Window, Counting]
leetcode_url: "https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters"
---

# Substrings of Size Three with Distinct Characters / Substrings of Size Three with Distinct Characters

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Number of Equal Count Substrings](https://leetcode.com/problems/number-of-equal-count-substrings) | [Find Longest Special Substring That Occurs Thrice II](https://leetcode.com/problems/find-longest-special-substring-that-occurs-thrice-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Substrings of Size Three with Distinct Characters example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Substrings of Size Three with Distinct Characters. ([LeetCode](https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters))

Difficulty: Easy | Acceptance: 75.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters) for full constraints

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
function substringsOfSizeThreeWithDistinctCharactersBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function substringsOfSizeThreeWithDistinctCharacters(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(substringsOfSizeThreeWithDistinctCharacters(/* example 1 */)); // expected
// console.log(substringsOfSizeThreeWithDistinctCharacters(/* example 2 */)); // expected
// console.log(substringsOfSizeThreeWithDistinctCharacters(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Number of Equal Count Substrings](https://leetcode.com/problems/number-of-equal-count-substrings) — same pattern: Sliding Window
- [Find Longest Special Substring That Occurs Thrice II](https://leetcode.com/problems/find-longest-special-substring-that-occurs-thrice-ii) — same pattern: Sliding Window
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words) — same pattern: Sliding Window
- [Substrings of Size Three with Distinct Characters — LeetCode](https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters) — problem page
