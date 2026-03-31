---
layout: page
title: "Rank Transform of a Matrix"
difficulty: Hard
category: Tree-Graph
tags: [Array, Union Find, Graph, Topological Sort, Sorting]
leetcode_url: "https://leetcode.com/problems/rank-transform-of-a-matrix"
---

# Rank Transform of a Matrix / Rank Transform of a Matrix

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Topological Sort
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) | [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống sắp xếp thứ tự học môn — môn A prerequisite của B thì A phải học trước. Topological sort xếp thứ tự sao cho mọi dependency được thoả mãn.

**Pattern Recognition:**

- Signal: "dependency ordering" + "DAG" → **Topological Sort**
- Bài này thuộc dạng Topological Sort — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Rank Transform of a Matrix example:**

```
// TODO: Add step-by-step visual for Topological Sort
// Show one complete example with state at each step
```

---

## Problem Description

Rank Transform of a Matrix. ([LeetCode](https://leetcode.com/problems/rank-transform-of-a-matrix))

Difficulty: Hard | Acceptance: 41.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/rank-transform-of-a-matrix) for full constraints

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
function rankTransformOfAMatrixBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Topological Sort
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function rankTransformOfAMatrix(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Topological Sort
  // Hint: Use in-degree counting or DFS post-order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(rankTransformOfAMatrix(/* example 1 */)); // expected
// console.log(rankTransformOfAMatrix(/* example 2 */)); // expected
// console.log(rankTransformOfAMatrix(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) — same pattern: Topological Sort
- [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula) — same pattern: Topological Sort
- [Minimum Runes to Add to Cast Spell](https://leetcode.com/problems/minimum-runes-to-add-to-cast-spell) — same pattern: Topological Sort
- [Maximum Number of Points From Grid Queries](https://leetcode.com/problems/maximum-number-of-points-from-grid-queries) — same pattern: Union Find
- [Rank Transform of a Matrix — LeetCode](https://leetcode.com/problems/rank-transform-of-a-matrix) — problem page
