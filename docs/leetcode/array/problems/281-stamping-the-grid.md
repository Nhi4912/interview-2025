---
layout: page
title: "Stamping the Grid"
difficulty: Hard
category: Array
tags: [Array, Greedy, Matrix, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/stamping-the-grid"
---

# Stamping the Grid / Stamping the Grid

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) | [Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Stamping the Grid example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Stamping the Grid. ([LeetCode](https://leetcode.com/problems/stamping-the-grid))

Difficulty: Hard | Acceptance: 33.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/stamping-the-grid) for full constraints

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
function stampingTheGridBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function stampingTheGrid(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(stampingTheGrid(/* example 1 */)); // expected
// console.log(stampingTheGrid(/* example 2 */)); // expected
// console.log(stampingTheGrid(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) — same pattern: Prefix Sum
- [Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable) — same pattern: Prefix Sum
- [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) — same pattern: Sliding Window
- [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal) — same pattern: Prefix Sum
- [Stamping the Grid — LeetCode](https://leetcode.com/problems/stamping-the-grid) — problem page
