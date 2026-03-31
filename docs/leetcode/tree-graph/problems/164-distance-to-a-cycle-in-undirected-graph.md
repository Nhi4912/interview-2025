---
layout: page
title: "Distance to a Cycle in Undirected Graph"
difficulty: Hard
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/distance-to-a-cycle-in-undirected-graph"
---

# Distance to a Cycle in Undirected Graph / Distance to a Cycle in Undirected Graph

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Evaluate Division](https://leetcode.com/problems/evaluate-division) | [Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.

**Pattern Recognition:**

- Signal: "group elements" + "connectivity queries" → **Union Find**
- Bài này thuộc dạng Union Find — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Distance to a Cycle in Undirected Graph example:**

```
// TODO: Add step-by-step visual for Union Find
// Show one complete example with state at each step
```

---

## Problem Description

Distance to a Cycle in Undirected Graph. ([LeetCode](https://leetcode.com/problems/distance-to-a-cycle-in-undirected-graph))

Difficulty: Hard | Acceptance: 72.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/distance-to-a-cycle-in-undirected-graph) for full constraints

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
function distanceToACycleInUndirectedGraphBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Union Find
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function distanceToACycleInUndirectedGraph(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Union Find
  // Hint: Use union-find with path compression and union by rank
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(distanceToACycleInUndirectedGraph(/* example 1 */)); // expected
// console.log(distanceToACycleInUndirectedGraph(/* example 2 */)); // expected
// console.log(distanceToACycleInUndirectedGraph(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected) — same pattern: Union Find
- [Possible Bipartition](https://leetcode.com/problems/possible-bipartition) — same pattern: Union Find
- [Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree) — same pattern: Union Find
- [Distance to a Cycle in Undirected Graph — LeetCode](https://leetcode.com/problems/distance-to-a-cycle-in-undirected-graph) — problem page
