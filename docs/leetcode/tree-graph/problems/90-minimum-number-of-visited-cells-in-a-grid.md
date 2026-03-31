---
layout: page
title: "Minimum Number of Visited Cells in a Grid"
difficulty: Hard
category: Tree-Graph
tags: [Array, Dynamic Programming, Stack, Breadth-First Search, Union Find]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid"
---

# Minimum Number of Visited Cells in a Grid / Minimum Number of Visited Cells in a Grid

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle) | [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.

**Pattern Recognition:**

- Signal: "group elements" + "connectivity queries" → **Union Find**
- Bài này thuộc dạng Union Find — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Number of Visited Cells in a Grid example:**

```
// TODO: Add step-by-step visual for Union Find
// Show one complete example with state at each step
```

---

## Problem Description

Minimum Number of Visited Cells in a Grid. ([LeetCode](https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid))

Difficulty: Hard | Acceptance: 22.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid) for full constraints

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
function minimumNumberOfVisitedCellsInAGridBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Union Find
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumNumberOfVisitedCellsInAGrid(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Union Find
  // Hint: Use union-find with path compression and union by rank
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumNumberOfVisitedCellsInAGrid(/* example 1 */)); // expected
// console.log(minimumNumberOfVisitedCellsInAGrid(/* example 2 */)); // expected
// console.log(minimumNumberOfVisitedCellsInAGrid(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle) — same pattern: Monotonic Stack
- [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) — same pattern: Union Find
- [Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort) — same pattern: Union Find
- [Find the Safest Path in a Grid](https://leetcode.com/problems/find-the-safest-path-in-a-grid) — same pattern: Union Find
- [Minimum Number of Visited Cells in a Grid — LeetCode](https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid) — problem page
