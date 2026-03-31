---
layout: page
title: "Longest Subarray With Maximum Bitwise AND"
difficulty: Medium
category: Array
tags: [Array, Bit Manipulation, Brainteaser]
leetcode_url: "https://leetcode.com/problems/longest-subarray-with-maximum-bitwise-and"
---

# Longest Subarray With Maximum Bitwise AND / Longest Subarray With Maximum Bitwise AND

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Chalkboard XOR Game](https://leetcode.com/problems/chalkboard-xor-game) | [Bitwise XOR of All Pairings](https://leetcode.com/problems/bitwise-xor-of-all-pairings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Làm việc trực tiếp với bit (0/1) — nhanh hơn phép toán thông thường. XOR, AND, OR, shift là các công cụ chính.

**Pattern Recognition:**

- Signal: "binary representation" + "XOR/AND/OR properties" → **Bit Manipulation**
- Bài này thuộc dạng Bit Manipulation — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Longest Subarray With Maximum Bitwise AND example:**

```
// TODO: Add step-by-step visual for Bit Manipulation
// Show one complete example with state at each step
```

---

## Problem Description

Longest Subarray With Maximum Bitwise AND. ([LeetCode](https://leetcode.com/problems/longest-subarray-with-maximum-bitwise-and))

Difficulty: Medium | Acceptance: 61.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/longest-subarray-with-maximum-bitwise-and) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Xác nhận input constraints, edge cases" / Confirm input size, types, edge cases with interviewer
2. **Brute force**: "Bắt đầu từ brute force, rồi optimize" / Always start with naive approach, then optimize
3. **Optimize**: "Phân tích bottleneck của brute force, tìm cách giảm" / Identify the bottleneck and reduce it
4. **Edge cases**: "Input rỗng, một phần tử, giá trị cực biên" / Empty input, single element, boundary values
5. **Follow-up**: "Nếu input rất lớn? Nếu cần streaming?" / What if input is huge? What about streaming?

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function longestSubarrayWithMaximumBitwiseAndBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Bit Manipulation
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function longestSubarrayWithMaximumBitwiseAnd(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Bit Manipulation
  // Hint: Use XOR, AND, OR, shift operations on bits
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(longestSubarrayWithMaximumBitwiseAnd(/* example 1 */)); // expected
// console.log(longestSubarrayWithMaximumBitwiseAnd(/* example 2 */)); // expected
// console.log(longestSubarrayWithMaximumBitwiseAnd(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Chalkboard XOR Game](https://leetcode.com/problems/chalkboard-xor-game) — same pattern: Bit Manipulation
- [Bitwise XOR of All Pairings](https://leetcode.com/problems/bitwise-xor-of-all-pairings) — same pattern: Bit Manipulation
- [Bitwise OR of All Subsequence Sums](https://leetcode.com/problems/bitwise-or-of-all-subsequence-sums) — same pattern: Prefix Sum
- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Longest Subarray With Maximum Bitwise AND — LeetCode](https://leetcode.com/problems/longest-subarray-with-maximum-bitwise-and) — problem page
