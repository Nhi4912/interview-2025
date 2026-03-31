---
layout: page
title: "Power of Two"
difficulty: Easy
category: Math
tags: [Math, Bit Manipulation, Recursion]
leetcode_url: "https://leetcode.com/problems/power-of-two"
---

# Power of Two / Power of Two

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Power of Four](https://leetcode.com/problems/power-of-four) | [Pow(x, n)](https://leetcode.com/problems/powx-n)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Làm việc trực tiếp với bit (0/1) — nhanh hơn phép toán thông thường. XOR, AND, OR, shift là các công cụ chính.

**Pattern Recognition:**

- Signal: "binary representation" + "XOR/AND/OR properties" → **Bit Manipulation**
- Bài này thuộc dạng Bit Manipulation — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Power of Two example:**

```
// TODO: Add step-by-step visual for Bit Manipulation
// Show one complete example with state at each step
```

---

## Problem Description

Power of Two. ([LeetCode](https://leetcode.com/problems/power-of-two))

Difficulty: Easy | Acceptance: 48.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/power-of-two) for full constraints

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
function powerOfTwoBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Bit Manipulation
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function powerOfTwo(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Bit Manipulation
  // Hint: Use XOR, AND, OR, shift operations on bits
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(powerOfTwo(/* example 1 */)); // expected
// console.log(powerOfTwo(/* example 2 */)); // expected
// console.log(powerOfTwo(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Power of Four](https://leetcode.com/problems/power-of-four) — same pattern: Bit Manipulation
- [Pow(x, n)](https://leetcode.com/problems/powx-n) — same pattern: Math
- [Integer to English Words](https://leetcode.com/problems/integer-to-english-words) — same pattern: Math
- [Basic Calculator](https://leetcode.com/problems/basic-calculator) — same pattern: Stack
- [Power of Two — LeetCode](https://leetcode.com/problems/power-of-two) — problem page
