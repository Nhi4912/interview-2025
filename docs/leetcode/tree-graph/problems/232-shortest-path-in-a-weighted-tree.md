---
layout: page
title: "Shortest Path in a Weighted Tree"
difficulty: Hard
category: Tree-Graph
tags: [Array, Tree, Depth-First Search, Binary Indexed Tree, Segment Tree]
leetcode_url: "https://leetcode.com/problems/shortest-path-in-a-weighted-tree"
---

# Shortest Path in a Weighted Tree / Shortest Path in a Weighted Tree

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Segment Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem) | [Block Placement Queries](https://leetcode.com/problems/block-placement-queries)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Cấu trúc dữ liệu cho range queries — cập nhật và truy vấn đoạn trong O(log n).

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Segment Tree**
- Bài này thuộc dạng Segment Tree — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Shortest Path in a Weighted Tree example:**

```
// TODO: Add step-by-step visual for Segment Tree
// Show one complete example with state at each step
```

---

## Problem Description

Shortest Path in a Weighted Tree. ([LeetCode](https://leetcode.com/problems/shortest-path-in-a-weighted-tree))

Difficulty: Hard | Acceptance: 32.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/shortest-path-in-a-weighted-tree) for full constraints

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
function shortestPathInAWeightedTreeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Segment Tree
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function shortestPathInAWeightedTree(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Segment Tree
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(shortestPathInAWeightedTree(/* example 1 */)); // expected
// console.log(shortestPathInAWeightedTree(/* example 2 */)); // expected
// console.log(shortestPathInAWeightedTree(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem) — same pattern: Segment Tree
- [Block Placement Queries](https://leetcode.com/problems/block-placement-queries) — same pattern: Segment Tree
- [Number of Longest Increasing Subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence) — same pattern: Segment Tree
- [Difference Between Maximum and Minimum Price Sum](https://leetcode.com/problems/difference-between-maximum-and-minimum-price-sum) — same pattern: Dynamic Programming
- [Shortest Path in a Weighted Tree — LeetCode](https://leetcode.com/problems/shortest-path-in-a-weighted-tree) — problem page
