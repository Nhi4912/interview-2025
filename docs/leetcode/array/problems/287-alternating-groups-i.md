---
layout: page
title: "Alternating Groups I"
difficulty: Easy
category: Array
tags: [Array, Sliding Window]
leetcode_url: "https://leetcode.com/problems/alternating-groups-i"
---

# Alternating Groups I / Alternating Groups I

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k) | [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Alternating Groups I example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Alternating Groups I. ([LeetCode](https://leetcode.com/problems/alternating-groups-i))

Difficulty: Easy | Acceptance: 67.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/alternating-groups-i) for full constraints

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
function alternatingGroupsIBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function alternatingGroupsI(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(alternatingGroupsI(/* example 1 */)); // expected
// console.log(alternatingGroupsI(/* example 2 */)); // expected
// console.log(alternatingGroupsI(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k) — same pattern: Sliding Window
- [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum) — same pattern: Sliding Window
- [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii) — same pattern: Sliding Window
- [Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit) — same pattern: Monotonic Queue
- [Alternating Groups I — LeetCode](https://leetcode.com/problems/alternating-groups-i) — problem page
