---
layout: page
title: "Minimize Connected Groups by Inserting Interval"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Sliding Window, Sorting]
leetcode_url: "https://leetcode.com/problems/minimize-connected-groups-by-inserting-interval"
---

# Minimize Connected Groups by Inserting Interval / Minimize Connected Groups by Inserting Interval

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements) | [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimize Connected Groups by Inserting Interval example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Minimize Connected Groups by Inserting Interval. ([LeetCode](https://leetcode.com/problems/minimize-connected-groups-by-inserting-interval))

Difficulty: Medium | Acceptance: 50.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimize-connected-groups-by-inserting-interval) for full constraints

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
function minimizeConnectedGroupsByInsertingIntervalBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimizeConnectedGroupsByInsertingInterval(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimizeConnectedGroupsByInsertingInterval(/* example 1 */)); // expected
// console.log(minimizeConnectedGroupsByInsertingInterval(/* example 2 */)); // expected
// console.log(minimizeConnectedGroupsByInsertingInterval(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements) — same pattern: Sliding Window
- [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) — same pattern: Sliding Window
- [Apply Operations to Maximize Frequency Score](https://leetcode.com/problems/apply-operations-to-maximize-frequency-score) — same pattern: Sliding Window
- [Maximum White Tiles Covered by a Carpet](https://leetcode.com/problems/maximum-white-tiles-covered-by-a-carpet) — same pattern: Sliding Window
- [Minimize Connected Groups by Inserting Interval — LeetCode](https://leetcode.com/problems/minimize-connected-groups-by-inserting-interval) — problem page
