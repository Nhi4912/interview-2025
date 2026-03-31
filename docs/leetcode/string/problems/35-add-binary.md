---
layout: page
title: "Add Binary"
difficulty: Easy
category: String
tags: [Math, String, Bit Manipulation, Simulation]
leetcode_url: "https://leetcode.com/problems/add-binary"
---

# Add Binary / Add Binary

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [Multiply Strings](https://leetcode.com/problems/multiply-strings) | [Add Strings](https://leetcode.com/problems/add-strings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Làm việc trực tiếp với bit (0/1) — nhanh hơn phép toán thông thường. XOR, AND, OR, shift là các công cụ chính.

**Pattern Recognition:**

- Signal: "binary representation" + "XOR/AND/OR properties" → **Bit Manipulation**
- Bài này thuộc dạng Bit Manipulation — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Add Binary example:**

```
// TODO: Add step-by-step visual for Bit Manipulation
// Show one complete example with state at each step
```

---

## Problem Description

Add Binary. ([LeetCode](https://leetcode.com/problems/add-binary))

Difficulty: Easy | Acceptance: 55.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/add-binary) for full constraints

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
function addBinaryBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Bit Manipulation
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function addBinary(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Bit Manipulation
  // Hint: Use XOR, AND, OR, shift operations on bits
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(addBinary(/* example 1 */)); // expected
// console.log(addBinary(/* example 2 */)); // expected
// console.log(addBinary(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Multiply Strings](https://leetcode.com/problems/multiply-strings) — same pattern: Math
- [Add Strings](https://leetcode.com/problems/add-strings) — same pattern: Math
- [Robot Bounded In Circle](https://leetcode.com/problems/robot-bounded-in-circle) — same pattern: Math
- [Fraction Addition and Subtraction](https://leetcode.com/problems/fraction-addition-and-subtraction) — same pattern: Math
- [Add Binary — LeetCode](https://leetcode.com/problems/add-binary) — problem page
