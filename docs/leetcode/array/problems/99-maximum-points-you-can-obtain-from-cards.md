---
layout: page
title: "Maximum Points You Can Obtain from Cards"
difficulty: Medium
category: Array
tags: [Array, Sliding Window, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards"
---

# Maximum Points You Can Obtain from Cards / Maximum Points You Can Obtain from Cards

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k) | [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Points You Can Obtain from Cards example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Maximum Points You Can Obtain from Cards. ([LeetCode](https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards))

Difficulty: Medium | Acceptance: 55.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards) for full constraints

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
function maximumPointsYouCanObtainFromCardsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumPointsYouCanObtainFromCards(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumPointsYouCanObtainFromCards(/* example 1 */)); // expected
// console.log(maximumPointsYouCanObtainFromCards(/* example 2 */)); // expected
// console.log(maximumPointsYouCanObtainFromCards(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k) — same pattern: Sliding Window
- [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum) — same pattern: Sliding Window
- [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii) — same pattern: Sliding Window
- [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) — same pattern: Sliding Window
- [Maximum Points You Can Obtain from Cards — LeetCode](https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards) — problem page
