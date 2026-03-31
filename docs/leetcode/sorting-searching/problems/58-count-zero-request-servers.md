---
layout: page
title: "Count Zero Request Servers"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Sliding Window, Sorting]
leetcode_url: "https://leetcode.com/problems/count-zero-request-servers"
---

# Count Zero Request Servers / Count Zero Request Servers

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) | [Longest Harmonious Subsequence](https://leetcode.com/problems/longest-harmonious-subsequence)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Count Zero Request Servers example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Count Zero Request Servers. ([LeetCode](https://leetcode.com/problems/count-zero-request-servers))

Difficulty: Medium | Acceptance: 34.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/count-zero-request-servers) for full constraints

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
function countZeroRequestServersBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function countZeroRequestServers(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(countZeroRequestServers(/* example 1 */)); // expected
// console.log(countZeroRequestServers(/* example 2 */)); // expected
// console.log(countZeroRequestServers(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) — same pattern: Sliding Window
- [Longest Harmonious Subsequence](https://leetcode.com/problems/longest-harmonious-subsequence) — same pattern: Sliding Window
- [Majority Element](https://leetcode.com/problems/majority-element) — same pattern: Divide and Conquer
- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Count Zero Request Servers — LeetCode](https://leetcode.com/problems/count-zero-request-servers) — problem page
