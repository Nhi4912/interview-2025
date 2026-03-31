---
layout: page
title: "Maximum Number of Visible Points"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Math, Geometry, Sliding Window, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-visible-points"
---

# Maximum Number of Visible Points / Maximum Number of Visible Points

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) | [Minimum Area Rectangle](https://leetcode.com/problems/minimum-area-rectangle)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Number of Visible Points example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Maximum Number of Visible Points. ([LeetCode](https://leetcode.com/problems/maximum-number-of-visible-points))

Difficulty: Hard | Acceptance: 37.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-number-of-visible-points) for full constraints

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
function maximumNumberOfVisiblePointsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumNumberOfVisiblePoints(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumNumberOfVisiblePoints(/* example 1 */)); // expected
// console.log(maximumNumberOfVisiblePoints(/* example 2 */)); // expected
// console.log(maximumNumberOfVisiblePoints(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) — same pattern: Heap / Priority Queue
- [Minimum Area Rectangle](https://leetcode.com/problems/minimum-area-rectangle) — same pattern: Sorting
- [Minimize Manhattan Distances](https://leetcode.com/problems/minimize-manhattan-distances) — same pattern: Sorting
- [Maximum Area Rectangle With Point Constraints I](https://leetcode.com/problems/maximum-area-rectangle-with-point-constraints-i) — same pattern: Segment Tree
- [Maximum Number of Visible Points — LeetCode](https://leetcode.com/problems/maximum-number-of-visible-points) — problem page
