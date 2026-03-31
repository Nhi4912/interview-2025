---
layout: page
title: "Maximize the Confusion of an Exam"
difficulty: Medium
category: Sorting-Searching
tags: [String, Binary Search, Sliding Window, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximize-the-confusion-of-an-exam"
---

# Maximize the Confusion of an Exam / Maximize the Confusion of an Exam

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Get Equal Substrings Within Budget](https://leetcode.com/problems/get-equal-substrings-within-budget) | [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximize the Confusion of an Exam example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Maximize the Confusion of an Exam. ([LeetCode](https://leetcode.com/problems/maximize-the-confusion-of-an-exam))

Difficulty: Medium | Acceptance: 68.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximize-the-confusion-of-an-exam) for full constraints

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
function maximizeTheConfusionOfAnExamBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximizeTheConfusionOfAnExam(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximizeTheConfusionOfAnExam(/* example 1 */)); // expected
// console.log(maximizeTheConfusionOfAnExam(/* example 2 */)); // expected
// console.log(maximizeTheConfusionOfAnExam(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Get Equal Substrings Within Budget](https://leetcode.com/problems/get-equal-substrings-within-budget) — same pattern: Sliding Window
- [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k) — same pattern: Sliding Window
- [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum) — same pattern: Sliding Window
- [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii) — same pattern: Sliding Window
- [Maximize the Confusion of an Exam — LeetCode](https://leetcode.com/problems/maximize-the-confusion-of-an-exam) — problem page
