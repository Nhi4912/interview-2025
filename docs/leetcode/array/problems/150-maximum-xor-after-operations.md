---
layout: page
title: "Maximum XOR After Operations"
difficulty: Medium
category: Array
tags: [Array, Math, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/maximum-xor-after-operations"
---

# Maximum XOR After Operations / Maximum XOR After Operations

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [The Number of Good Subsets](https://leetcode.com/problems/the-number-of-good-subsets)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Làm việc trực tiếp với bit (0/1) — nhanh hơn phép toán thông thường. XOR, AND, OR, shift là các công cụ chính.

**Pattern Recognition:**

- Signal: "binary representation" + "XOR/AND/OR properties" → **Bit Manipulation**
- Bài này thuộc dạng Bit Manipulation — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum XOR After Operations example:**

```
// TODO: Add step-by-step visual for Bit Manipulation
// Show one complete example with state at each step
```

---

## Problem Description

Maximum XOR After Operations. ([LeetCode](https://leetcode.com/problems/maximum-xor-after-operations))

Difficulty: Medium | Acceptance: 79.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-xor-after-operations) for full constraints

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
function maximumXorAfterOperationsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Bit Manipulation
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumXorAfterOperations(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Bit Manipulation
  // Hint: Use XOR, AND, OR, shift operations on bits
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumXorAfterOperations(/* example 1 */)); // expected
// console.log(maximumXorAfterOperations(/* example 2 */)); // expected
// console.log(maximumXorAfterOperations(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [The Number of Good Subsets](https://leetcode.com/problems/the-number-of-good-subsets) — same pattern: Dynamic Programming
- [Transform to Chessboard](https://leetcode.com/problems/transform-to-chessboard) — same pattern: Bit Manipulation
- [Chalkboard XOR Game](https://leetcode.com/problems/chalkboard-xor-game) — same pattern: Bit Manipulation
- [Maximum XOR After Operations — LeetCode](https://leetcode.com/problems/maximum-xor-after-operations) — problem page
