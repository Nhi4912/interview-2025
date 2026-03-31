---
layout: page
title: "Subarrays with K Different Integers"
difficulty: Hard
category: Array
tags: [Array, Hash Table, Sliding Window, Counting]
leetcode_url: "https://leetcode.com/problems/subarrays-with-k-different-integers"
---

# Subarrays with K Different Integers / Subarrays with K Different Integers

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Longest Harmonious Subsequence](https://leetcode.com/problems/longest-harmonious-subsequence) | [Majority Element](https://leetcode.com/problems/majority-element)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Subarrays with K Different Integers example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Subarrays with K Different Integers. ([LeetCode](https://leetcode.com/problems/subarrays-with-k-different-integers))

Difficulty: Hard | Acceptance: 65.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/subarrays-with-k-different-integers) for full constraints

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
function subarraysWithKDifferentIntegersBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function subarraysWithKDifferentIntegers(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(subarraysWithKDifferentIntegers(/* example 1 */)); // expected
// console.log(subarraysWithKDifferentIntegers(/* example 2 */)); // expected
// console.log(subarraysWithKDifferentIntegers(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Longest Harmonious Subsequence](https://leetcode.com/problems/longest-harmonious-subsequence) — same pattern: Sliding Window
- [Majority Element](https://leetcode.com/problems/majority-element) — same pattern: Divide and Conquer
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — same pattern: Heap / Priority Queue
- [Subarrays with K Different Integers — LeetCode](https://leetcode.com/problems/subarrays-with-k-different-integers) — problem page
