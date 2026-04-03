---
layout: page
title: "Bitwise XOR of All Pairings"
difficulty: Medium
category: Array
tags: [Array, Bit Manipulation, Brainteaser]
leetcode_url: "https://leetcode.com/problems/bitwise-xor-of-all-pairings"
---

# Bitwise XOR of All Pairings / Bitwise XOR of All Pairings

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Chalkboard XOR Game](https://leetcode.com/problems/chalkboard-xor-game) | [Bitwise OR of All Subsequence Sums](https://leetcode.com/problems/bitwise-or-of-all-subsequence-sums)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Làm việc trực tiếp với bit (0/1) — nhanh hơn phép toán thông thường. XOR, AND, OR, shift là các công cụ chính.

**Pattern Recognition:**

- Signal: "binary representation" + "XOR/AND/OR properties" → **Bit Manipulation**
- Bài này thuộc dạng Bit Manipulation — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Bitwise XOR of All Pairings example:**

```
// TODO: Add step-by-step visual for Bit Manipulation
// Show one complete example with state at each step
```

---

## Problem Description

Bitwise XOR of All Pairings. ([LeetCode](https://leetcode.com/problems/bitwise-xor-of-all-pairings))

Difficulty: Medium | Acceptance: 67.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/bitwise-xor-of-all-pairings) for full constraints

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
function bitwiseXorOfAllPairingsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Bit Manipulation
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function bitwiseXorOfAllPairings(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Bit Manipulation
  // Hint: Use XOR, AND, OR, shift operations on bits
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(bitwiseXorOfAllPairings(/* example 1 */)); // expected
// console.log(bitwiseXorOfAllPairings(/* example 2 */)); // expected
// console.log(bitwiseXorOfAllPairings(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Chalkboard XOR Game](https://leetcode.com/problems/chalkboard-xor-game) — same pattern: Bit Manipulation
- [Bitwise OR of All Subsequence Sums](https://leetcode.com/problems/bitwise-or-of-all-subsequence-sums) — same pattern: Prefix Sum
- [Longest Subarray With Maximum Bitwise AND](https://leetcode.com/problems/longest-subarray-with-maximum-bitwise-and) — same pattern: Bit Manipulation
- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Bitwise XOR of All Pairings — LeetCode](https://leetcode.com/problems/bitwise-xor-of-all-pairings) — problem page
