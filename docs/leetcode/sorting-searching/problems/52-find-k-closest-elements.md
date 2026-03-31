---
layout: page
title: "Find K Closest Elements"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Sliding Window, Sorting]
leetcode_url: "https://leetcode.com/problems/find-k-closest-elements"
---

# Find K Closest Elements / Find K Closest Elements

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction) | [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find K Closest Elements example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Find K Closest Elements. ([LeetCode](https://leetcode.com/problems/find-k-closest-elements))

Difficulty: Medium | Acceptance: 48.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-k-closest-elements) for full constraints

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
function findKClosestElementsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findKClosestElements(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findKClosestElements(/* example 1 */)); // expected
// console.log(findKClosestElements(/* example 2 */)); // expected
// console.log(findKClosestElements(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction) — same pattern: Two Pointers
- [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) — same pattern: Trie
- [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays) — same pattern: Two Pointers
- [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) — same pattern: Sliding Window
- [Find K Closest Elements — LeetCode](https://leetcode.com/problems/find-k-closest-elements) — problem page
