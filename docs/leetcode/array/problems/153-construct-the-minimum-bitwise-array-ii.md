---
layout: page
title: "Construct the Minimum Bitwise Array II"
difficulty: Medium
category: Array
tags: [Array, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/construct-the-minimum-bitwise-array-ii"
---

# Construct the Minimum Bitwise Array II / Construct the Minimum Bitwise Array II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Làm việc trực tiếp với bit (0/1) — nhanh hơn phép toán thông thường. XOR, AND, OR, shift là các công cụ chính.

**Pattern Recognition:**

- Signal: "binary representation" + "XOR/AND/OR properties" → **Bit Manipulation**
- Bài này thuộc dạng Bit Manipulation — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Construct the Minimum Bitwise Array II example:**

```
// TODO: Add step-by-step visual for Bit Manipulation
// Show one complete example with state at each step
```

---

## Problem Description

Construct the Minimum Bitwise Array II. ([LeetCode](https://leetcode.com/problems/construct-the-minimum-bitwise-array-ii))

Difficulty: Medium | Acceptance: 34.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/construct-the-minimum-bitwise-array-ii) for full constraints

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
function constructTheMinimumBitwiseArrayIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Bit Manipulation
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function constructTheMinimumBitwiseArrayIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Bit Manipulation
  // Hint: Use XOR, AND, OR, shift operations on bits
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(constructTheMinimumBitwiseArrayIi(/* example 1 */)); // expected
// console.log(constructTheMinimumBitwiseArrayIi(/* example 2 */)); // expected
// console.log(constructTheMinimumBitwiseArrayIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number) — same pattern: Two Pointers
- [Subsets II](https://leetcode.com/problems/subsets-ii) — same pattern: Backtracking
- [Partition Array Into Two Arrays to Minimize Sum Difference](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference) — same pattern: Two Pointers
- [Construct the Minimum Bitwise Array II — LeetCode](https://leetcode.com/problems/construct-the-minimum-bitwise-array-ii) — problem page
