---
layout: page
title: "Maximum Length of Repeated Subarray"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Binary Search, Dynamic Programming, Sliding Window, Rolling Hash]
leetcode_url: "https://leetcode.com/problems/maximum-length-of-repeated-subarray"
---

# Maximum Length of Repeated Subarray / Maximum Length of Repeated Subarray

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest Repeating Substring](https://leetcode.com/problems/longest-repeating-substring) | [Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Length of Repeated Subarray example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Maximum Length of Repeated Subarray. ([LeetCode](https://leetcode.com/problems/maximum-length-of-repeated-subarray))

Difficulty: Medium | Acceptance: 51.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-length-of-repeated-subarray) for full constraints

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
function maximumLengthOfRepeatedSubarrayBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumLengthOfRepeatedSubarray(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumLengthOfRepeatedSubarray(/* example 1 */)); // expected
// console.log(maximumLengthOfRepeatedSubarray(/* example 2 */)); // expected
// console.log(maximumLengthOfRepeatedSubarray(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Longest Repeating Substring](https://leetcode.com/problems/longest-repeating-substring) — same pattern: Dynamic Programming
- [Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring) — same pattern: Sliding Window
- [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling) — same pattern: Dynamic Programming
- [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k) — same pattern: Sliding Window
- [Maximum Length of Repeated Subarray — LeetCode](https://leetcode.com/problems/maximum-length-of-repeated-subarray) — problem page
