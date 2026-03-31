---
layout: page
title: "Minimum Edge Weight Equilibrium Queries in a Tree"
difficulty: Hard
category: Tree-Graph
tags: [Array, Tree, Graph, Strongly Connected Component]
leetcode_url: "https://leetcode.com/problems/minimum-edge-weight-equilibrium-queries-in-a-tree"
---

# Minimum Edge Weight Equilibrium Queries in a Tree / Minimum Edge Weight Equilibrium Queries in a Tree

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Graph
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Collect Coins in a Tree](https://leetcode.com/problems/collect-coins-in-a-tree) | [Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống mạng lưới đường phố — mỗi ngã tư là một node, mỗi con đường là edge. Bài toán đặt ra: tìm đường ngắn nhất, kiểm tra có chu trình, hoặc đếm thành phần liên thông.

**Pattern Recognition:**

- Signal: "nodes and edges" + "connectivity/reachability" → **Graph**
- Bài này thuộc dạng Graph — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Edge Weight Equilibrium Queries in a Tree example:**

```
// TODO: Add step-by-step visual for Graph
// Show one complete example with state at each step
```

---

## Problem Description

Minimum Edge Weight Equilibrium Queries in a Tree. ([LeetCode](https://leetcode.com/problems/minimum-edge-weight-equilibrium-queries-in-a-tree))

Difficulty: Hard | Acceptance: 42.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-edge-weight-equilibrium-queries-in-a-tree) for full constraints

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
function minimumEdgeWeightEquilibriumQueriesInATreeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Graph
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumEdgeWeightEquilibriumQueriesInATree(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Graph
  // Hint: Build adjacency list, choose BFS/DFS based on requirement
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumEdgeWeightEquilibriumQueriesInATree(/* example 1 */)); // expected
// console.log(minimumEdgeWeightEquilibriumQueriesInATree(/* example 2 */)); // expected
// console.log(minimumEdgeWeightEquilibriumQueriesInATree(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Collect Coins in a Tree](https://leetcode.com/problems/collect-coins-in-a-tree) — same pattern: Topological Sort
- [Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters) — same pattern: Topological Sort
- [Most Profitable Path in a Tree](https://leetcode.com/problems/most-profitable-path-in-a-tree) — same pattern: BFS
- [Reachable Nodes With Restrictions](https://leetcode.com/problems/reachable-nodes-with-restrictions) — same pattern: Union Find
- [Minimum Edge Weight Equilibrium Queries in a Tree — LeetCode](https://leetcode.com/problems/minimum-edge-weight-equilibrium-queries-in-a-tree) — problem page
