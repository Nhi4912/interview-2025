---
layout: page
title: "Find Longest Special Substring That Occurs Thrice II"
difficulty: Medium
category: Sorting-Searching
tags: [Hash Table, String, Binary Search, Sliding Window, Counting]
leetcode_url: "https://leetcode.com/problems/find-longest-special-substring-that-occurs-thrice-ii"
---

# Find Longest Special Substring That Occurs Thrice II / Find Longest Special Substring That Occurs Thrice II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Substrings of Size Three with Distinct Characters](https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters) | [Number of Equal Count Substrings](https://leetcode.com/problems/number-of-equal-count-substrings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find Longest Special Substring That Occurs Thrice II example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Find Longest Special Substring That Occurs Thrice II. ([LeetCode](https://leetcode.com/problems/find-longest-special-substring-that-occurs-thrice-ii))

Difficulty: Medium | Acceptance: 38.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-longest-special-substring-that-occurs-thrice-ii) for full constraints

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
function findLongestSpecialSubstringThatOccursThriceIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findLongestSpecialSubstringThatOccursThriceIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findLongestSpecialSubstringThatOccursThriceIi(/* example 1 */)); // expected
// console.log(findLongestSpecialSubstringThatOccursThriceIi(/* example 2 */)); // expected
// console.log(findLongestSpecialSubstringThatOccursThriceIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Substrings of Size Three with Distinct Characters](https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters) — same pattern: Sliding Window
- [Number of Equal Count Substrings](https://leetcode.com/problems/number-of-equal-count-substrings) — same pattern: Sliding Window
- [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) — same pattern: Binary Search
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Find Longest Special Substring That Occurs Thrice II — LeetCode](https://leetcode.com/problems/find-longest-special-substring-that-occurs-thrice-ii) — problem page
