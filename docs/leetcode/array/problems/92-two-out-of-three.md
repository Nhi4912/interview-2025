---
layout: page
title: "Two Out of Three"
difficulty: Easy
category: Array
tags: [Array, Hash Table, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/two-out-of-three"
---

# Two Out of Three / Two Out of Three

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Cinema Seat Allocation](https://leetcode.com/problems/cinema-seat-allocation)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Làm việc trực tiếp với bit (0/1) — nhanh hơn phép toán thông thường. XOR, AND, OR, shift là các công cụ chính.

**Pattern Recognition:**

- Signal: "binary representation" + "XOR/AND/OR properties" → **Bit Manipulation**
- Bài này thuộc dạng Bit Manipulation — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Two Out of Three example:**

```
// TODO: Add step-by-step visual for Bit Manipulation
// Show one complete example with state at each step
```

---

## Problem Description

Two Out of Three. ([LeetCode](https://leetcode.com/problems/two-out-of-three))

Difficulty: Easy | Acceptance: 76.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/two-out-of-three) for full constraints

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
function twoOutOfThreeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Bit Manipulation
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function twoOutOfThree(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Bit Manipulation
  // Hint: Use XOR, AND, OR, shift operations on bits
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(twoOutOfThree(/* example 1 */)); // expected
// console.log(twoOutOfThree(/* example 2 */)); // expected
// console.log(twoOutOfThree(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Cinema Seat Allocation](https://leetcode.com/problems/cinema-seat-allocation) — same pattern: Greedy
- [Minimum Operations to Collect Elements](https://leetcode.com/problems/minimum-operations-to-collect-elements) — same pattern: Bit Manipulation
- [Triples with Bitwise AND Equal To Zero](https://leetcode.com/problems/triples-with-bitwise-and-equal-to-zero) — same pattern: Bit Manipulation
- [Two Out of Three — LeetCode](https://leetcode.com/problems/two-out-of-three) — problem page
