---
layout: page
title: "Shortest Subarray With OR at Least K I"
difficulty: Easy
category: Array
tags: [Array, Bit Manipulation, Sliding Window]
leetcode_url: "https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-i"
---

# Shortest Subarray With OR at Least K I / Shortest Subarray With OR at Least K I

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Shortest Subarray With OR at Least K II](https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-ii) | [Longest Nice Subarray](https://leetcode.com/problems/longest-nice-subarray)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Shortest Subarray With OR at Least K I example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Shortest Subarray With OR at Least K I. ([LeetCode](https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-i))

Difficulty: Easy | Acceptance: 42.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-i) for full constraints

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
function shortestSubarrayWithOrAtLeastKIBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function shortestSubarrayWithOrAtLeastKI(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(shortestSubarrayWithOrAtLeastKI(/* example 1 */)); // expected
// console.log(shortestSubarrayWithOrAtLeastKI(/* example 2 */)); // expected
// console.log(shortestSubarrayWithOrAtLeastKI(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Shortest Subarray With OR at Least K II](https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-ii) — same pattern: Sliding Window
- [Longest Nice Subarray](https://leetcode.com/problems/longest-nice-subarray) — same pattern: Sliding Window
- [Minimum Number of K Consecutive Bit Flips](https://leetcode.com/problems/minimum-number-of-k-consecutive-bit-flips) — same pattern: Sliding Window
- [Maximum Strong Pair XOR I](https://leetcode.com/problems/maximum-strong-pair-xor-i) — same pattern: Trie
- [Shortest Subarray With OR at Least K I — LeetCode](https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-i) — problem page
