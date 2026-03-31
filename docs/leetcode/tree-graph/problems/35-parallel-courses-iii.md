---
layout: page
title: "Parallel Courses III"
difficulty: Hard
category: Tree-Graph
tags: [Array, Dynamic Programming, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/parallel-courses-iii"
---

# Parallel Courses III / Parallel Courses III

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Topological Sort
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) | [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống sắp xếp thứ tự học môn — môn A prerequisite của B thì A phải học trước. Topological sort xếp thứ tự sao cho mọi dependency được thoả mãn.

**Pattern Recognition:**

- Signal: "dependency ordering" + "DAG" → **Topological Sort**
- Bài này thuộc dạng Topological Sort — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Parallel Courses III example:**

```
// TODO: Add step-by-step visual for Topological Sort
// Show one complete example with state at each step
```

---

## Problem Description

Parallel Courses III. ([LeetCode](https://leetcode.com/problems/parallel-courses-iii))

Difficulty: Hard | Acceptance: 66.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/parallel-courses-iii) for full constraints

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
function parallelCoursesIiiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Topological Sort
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function parallelCoursesIii(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Topological Sort
  // Hint: Use in-degree counting or DFS post-order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(parallelCoursesIii(/* example 1 */)); // expected
// console.log(parallelCoursesIii(/* example 2 */)); // expected
// console.log(parallelCoursesIii(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) — same pattern: Topological Sort
- [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula) — same pattern: Topological Sort
- [Find All Possible Recipes from Given Supplies](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies) — same pattern: Topological Sort
- [Collect Coins in a Tree](https://leetcode.com/problems/collect-coins-in-a-tree) — same pattern: Topological Sort
- [Parallel Courses III — LeetCode](https://leetcode.com/problems/parallel-courses-iii) — problem page
