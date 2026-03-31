---
layout: page
title: "XOR Queries of a Subarray"
difficulty: Medium
category: Array
tags: [Array, Bit Manipulation, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/xor-queries-of-a-subarray"
---

# XOR Queries of a Subarray / XOR Queries of a Subarray

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Range Product Queries of Powers](https://leetcode.com/problems/range-product-queries-of-powers) | [Maximum OR](https://leetcode.com/problems/maximum-or)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — XOR Queries of a Subarray example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

XOR Queries of a Subarray. ([LeetCode](https://leetcode.com/problems/xor-queries-of-a-subarray))

Difficulty: Medium | Acceptance: 78.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/xor-queries-of-a-subarray) for full constraints

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
function xorQueriesOfASubarrayBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function xorQueriesOfASubarray(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(xorQueriesOfASubarray(/* example 1 */)); // expected
// console.log(xorQueriesOfASubarray(/* example 2 */)); // expected
// console.log(xorQueriesOfASubarray(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Range Product Queries of Powers](https://leetcode.com/problems/range-product-queries-of-powers) — same pattern: Prefix Sum
- [Maximum OR](https://leetcode.com/problems/maximum-or) — same pattern: Prefix Sum
- [Bitwise OR of All Subsequence Sums](https://leetcode.com/problems/bitwise-or-of-all-subsequence-sums) — same pattern: Prefix Sum
- [Minimum Number of K Consecutive Bit Flips](https://leetcode.com/problems/minimum-number-of-k-consecutive-bit-flips) — same pattern: Sliding Window
- [XOR Queries of a Subarray — LeetCode](https://leetcode.com/problems/xor-queries-of-a-subarray) — problem page
