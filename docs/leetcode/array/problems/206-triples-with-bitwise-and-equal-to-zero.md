---
layout: page
title: "Triples with Bitwise AND Equal To Zero"
difficulty: Hard
category: Array
tags: [Array, Hash Table, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/triples-with-bitwise-and-equal-to-zero"
---

# Triples with Bitwise AND Equal To Zero / Triples with Bitwise AND Equal To Zero

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Two Out of Three](https://leetcode.com/problems/two-out-of-three)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Làm việc trực tiếp với bit (0/1) — nhanh hơn phép toán thông thường. XOR, AND, OR, shift là các công cụ chính.

**Pattern Recognition:**

- Signal: "binary representation" + "XOR/AND/OR properties" → **Bit Manipulation**
- Bài này thuộc dạng Bit Manipulation — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Triples with Bitwise AND Equal To Zero example:**

```
// TODO: Add step-by-step visual for Bit Manipulation
// Show one complete example with state at each step
```

---

## Problem Description

Triples with Bitwise AND Equal To Zero. ([LeetCode](https://leetcode.com/problems/triples-with-bitwise-and-equal-to-zero))

Difficulty: Hard | Acceptance: 59.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/triples-with-bitwise-and-equal-to-zero) for full constraints

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
function triplesWithBitwiseAndEqualToZeroBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Bit Manipulation
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function triplesWithBitwiseAndEqualToZero(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Bit Manipulation
  // Hint: Use XOR, AND, OR, shift operations on bits
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(triplesWithBitwiseAndEqualToZero(/* example 1 */)); // expected
// console.log(triplesWithBitwiseAndEqualToZero(/* example 2 */)); // expected
// console.log(triplesWithBitwiseAndEqualToZero(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Two Out of Three](https://leetcode.com/problems/two-out-of-three) — same pattern: Bit Manipulation
- [Cinema Seat Allocation](https://leetcode.com/problems/cinema-seat-allocation) — same pattern: Greedy
- [Minimum Operations to Collect Elements](https://leetcode.com/problems/minimum-operations-to-collect-elements) — same pattern: Bit Manipulation
- [Triples with Bitwise AND Equal To Zero — LeetCode](https://leetcode.com/problems/triples-with-bitwise-and-equal-to-zero) — problem page
