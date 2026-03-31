---
layout: page
title: "Find the K-Beauty of a Number"
difficulty: Easy
category: String
tags: [Math, String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/find-the-k-beauty-of-a-number"
---

# Find the K-Beauty of a Number / Find the K-Beauty of a Number

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii) | [Integer to English Words](https://leetcode.com/problems/integer-to-english-words)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find the K-Beauty of a Number example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Find the K-Beauty of a Number. ([LeetCode](https://leetcode.com/problems/find-the-k-beauty-of-a-number))

Difficulty: Easy | Acceptance: 61.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-the-k-beauty-of-a-number) for full constraints

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
function findTheKBeautyOfANumberBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findTheKBeautyOfANumber(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findTheKBeautyOfANumber(/* example 1 */)); // expected
// console.log(findTheKBeautyOfANumber(/* example 2 */)); // expected
// console.log(findTheKBeautyOfANumber(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii) — same pattern: Stack
- [Integer to English Words](https://leetcode.com/problems/integer-to-english-words) — same pattern: Math
- [Multiply Strings](https://leetcode.com/problems/multiply-strings) — same pattern: Math
- [Basic Calculator](https://leetcode.com/problems/basic-calculator) — same pattern: Stack
- [Find the K-Beauty of a Number — LeetCode](https://leetcode.com/problems/find-the-k-beauty-of-a-number) — problem page
