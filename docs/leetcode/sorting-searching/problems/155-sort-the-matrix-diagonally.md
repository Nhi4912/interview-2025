---
layout: page
title: "Sort the Matrix Diagonally"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Sorting, Matrix]
leetcode_url: "https://leetcode.com/problems/sort-the-matrix-diagonally"
---

# Sort the Matrix Diagonally / Sort the Matrix Diagonally

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Best Meeting Point](https://leetcode.com/problems/best-meeting-point) | [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Sau khi sắp xếp, nhiều bài toán trở nên đơn giản hơn — phần tử giống nhau nằm cạnh nhau, có thể dùng binary search, two pointers.

**Pattern Recognition:**

- Signal: "order matters" + "grouping/dedup" → **Sorting**
- Bài này thuộc dạng Sorting — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Sort the Matrix Diagonally example:**

```
// TODO: Add step-by-step visual for Sorting
// Show one complete example with state at each step
```

---

## Problem Description

Sort the Matrix Diagonally. ([LeetCode](https://leetcode.com/problems/sort-the-matrix-diagonally))

Difficulty: Medium | Acceptance: 83.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/sort-the-matrix-diagonally) for full constraints

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
function sortTheMatrixDiagonallyBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sorting
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function sortTheMatrixDiagonally(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sorting
  // Hint: Sort first, then use property of sorted order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(sortTheMatrixDiagonally(/* example 1 */)); // expected
// console.log(sortTheMatrixDiagonally(/* example 2 */)); // expected
// console.log(sortTheMatrixDiagonally(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Best Meeting Point](https://leetcode.com/problems/best-meeting-point) — same pattern: Sorting
- [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix) — same pattern: Binary Search
- [Get Biggest Three Rhombus Sums in a Grid](https://leetcode.com/problems/get-biggest-three-rhombus-sums-in-a-grid) — same pattern: Prefix Sum
- [Largest Submatrix With Rearrangements](https://leetcode.com/problems/largest-submatrix-with-rearrangements) — same pattern: Greedy
- [Sort the Matrix Diagonally — LeetCode](https://leetcode.com/problems/sort-the-matrix-diagonally) — problem page
