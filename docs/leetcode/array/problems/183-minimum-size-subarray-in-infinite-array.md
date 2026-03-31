---
layout: page
title: "Minimum Size Subarray in Infinite Array"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Sliding Window, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/minimum-size-subarray-in-infinite-array"
---

# Minimum Size Subarray in Infinite Array / Minimum Size Subarray in Infinite Array

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays) | [Minimum Operations to Reduce X to Zero](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Size Subarray in Infinite Array example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Minimum Size Subarray in Infinite Array. ([LeetCode](https://leetcode.com/problems/minimum-size-subarray-in-infinite-array))

Difficulty: Medium | Acceptance: 31.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-size-subarray-in-infinite-array) for full constraints

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
function minimumSizeSubarrayInInfiniteArrayBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumSizeSubarrayInInfiniteArray(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumSizeSubarrayInInfiniteArray(/* example 1 */)); // expected
// console.log(minimumSizeSubarrayInInfiniteArray(/* example 2 */)); // expected
// console.log(minimumSizeSubarrayInInfiniteArray(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays) — same pattern: Sliding Window
- [Minimum Operations to Reduce X to Zero](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero) — same pattern: Sliding Window
- [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) — same pattern: Prefix Sum
- [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k) — same pattern: Sliding Window
- [Minimum Size Subarray in Infinite Array — LeetCode](https://leetcode.com/problems/minimum-size-subarray-in-infinite-array) — problem page
