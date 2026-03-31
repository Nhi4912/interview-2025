---
layout: page
title: "Minimum Number of Flips to Convert Binary Matrix to Zero Matrix"
difficulty: Hard
category: Tree-Graph
tags: [Array, Hash Table, Bit Manipulation, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix"
---

# Minimum Number of Flips to Convert Binary Matrix to Zero Matrix / Minimum Number of Flips to Convert Binary Matrix to Zero Matrix

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Shortest Path to Get All Keys](https://leetcode.com/problems/shortest-path-to-get-all-keys) | [Sum of Remoteness of All Cells](https://leetcode.com/problems/sum-of-remoteness-of-all-cells)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như ném đá xuống ao — sóng lan ra theo từng vòng đều đặn. Khám phá hết tất cả ở khoảng cách 1, rồi mới sang khoảng cách 2.

**Pattern Recognition:**

- Signal: "shortest path (unweighted)" + "level-order" → **BFS**
- Bài này thuộc dạng BFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Number of Flips to Convert Binary Matrix to Zero Matrix example:**

```
Level 0:     [root]
Level 1:   [A, B]
Level 2: [C, D, E]

BFS: process level by level using queue
```

---

## Problem Description

Minimum Number of Flips to Convert Binary Matrix to Zero Matrix. ([LeetCode](https://leetcode.com/problems/minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix))

Difficulty: Hard | Acceptance: 72.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix) for full constraints

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
function minimumNumberOfFlipsToConvertBinaryMatrixToZeroMatrixBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — BFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumNumberOfFlipsToConvertBinaryMatrixToZeroMatrix(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using BFS
  // Hint: Use queue, process level by level
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumNumberOfFlipsToConvertBinaryMatrixToZeroMatrix(/* example 1 */)); // expected
// console.log(minimumNumberOfFlipsToConvertBinaryMatrixToZeroMatrix(/* example 2 */)); // expected
// console.log(minimumNumberOfFlipsToConvertBinaryMatrixToZeroMatrix(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Shortest Path to Get All Keys](https://leetcode.com/problems/shortest-path-to-get-all-keys) — same pattern: BFS
- [Sum of Remoteness of All Cells](https://leetcode.com/problems/sum-of-remoteness-of-all-cells) — same pattern: Union Find
- [Rotting Oranges](https://leetcode.com/problems/rotting-oranges) — same pattern: BFS
- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Minimum Number of Flips to Convert Binary Matrix to Zero Matrix — LeetCode](https://leetcode.com/problems/minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix) — problem page
