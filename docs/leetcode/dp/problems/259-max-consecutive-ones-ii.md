---
layout: page
title: "Max Consecutive Ones II"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Sliding Window]
leetcode_url: "https://leetcode.com/problems/max-consecutive-ones-ii"
---

# Max Consecutive Ones II / Max Consecutive Ones II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest Subarray of 1's After Deleting One Element](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element) | [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Max Consecutive Ones II example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Max Consecutive Ones II. ([LeetCode](https://leetcode.com/problems/max-consecutive-ones-ii))

Difficulty: Medium | Acceptance: 51.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/max-consecutive-ones-ii) for full constraints

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
function maxConsecutiveOnesIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maxConsecutiveOnesIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maxConsecutiveOnesIi(/* example 1 */)); // expected
// console.log(maxConsecutiveOnesIi(/* example 2 */)); // expected
// console.log(maxConsecutiveOnesIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Longest Subarray of 1's After Deleting One Element](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element) — same pattern: Sliding Window
- [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum) — same pattern: Monotonic Queue
- [Arithmetic Slices](https://leetcode.com/problems/arithmetic-slices) — same pattern: Sliding Window
- [Maximum Length of Repeated Subarray](https://leetcode.com/problems/maximum-length-of-repeated-subarray) — same pattern: Sliding Window
- [Max Consecutive Ones II — LeetCode](https://leetcode.com/problems/max-consecutive-ones-ii) — problem page
