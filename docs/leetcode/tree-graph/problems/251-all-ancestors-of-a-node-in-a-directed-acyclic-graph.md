---
layout: page
title: "All Ancestors of a Node in a Directed Acyclic Graph"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph"
---

# All Ancestors of a Node in a Directed Acyclic Graph / All Ancestors of a Node in a Directed Acyclic Graph

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Topological Sort
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule) | [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống sắp xếp thứ tự học môn — môn A prerequisite của B thì A phải học trước. Topological sort xếp thứ tự sao cho mọi dependency được thoả mãn.

**Pattern Recognition:**

- Signal: "dependency ordering" + "DAG" → **Topological Sort**
- Bài này thuộc dạng Topological Sort — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — All Ancestors of a Node in a Directed Acyclic Graph example:**

```
// TODO: Add step-by-step visual for Topological Sort
// Show one complete example with state at each step
```

---

## Problem Description

All Ancestors of a Node in a Directed Acyclic Graph. ([LeetCode](https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph))

Difficulty: Medium | Acceptance: 61.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph) for full constraints

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
function allAncestorsOfANodeInADirectedAcyclicGraphBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Topological Sort
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function allAncestorsOfANodeInADirectedAcyclicGraph(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Topological Sort
  // Hint: Use in-degree counting or DFS post-order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(allAncestorsOfANodeInADirectedAcyclicGraph(/* example 1 */)); // expected
// console.log(allAncestorsOfANodeInADirectedAcyclicGraph(/* example 2 */)); // expected
// console.log(allAncestorsOfANodeInADirectedAcyclicGraph(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Course Schedule](https://leetcode.com/problems/course-schedule) — same pattern: Topological Sort
- [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) — same pattern: Topological Sort
- [Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees) — same pattern: Topological Sort
- [Sort Items by Groups Respecting Dependencies](https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies) — same pattern: Topological Sort
- [All Ancestors of a Node in a Directed Acyclic Graph — LeetCode](https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph) — problem page
