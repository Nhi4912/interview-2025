---
layout: page
title: "Minimum Cost Walk in Weighted Graph"
difficulty: Hard
category: Tree-Graph
tags: [Array, Bit Manipulation, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/minimum-cost-walk-in-weighted-graph"
---

# Minimum Cost Walk in Weighted Graph / Minimum Cost Walk in Weighted Graph

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Evaluate Division](https://leetcode.com/problems/evaluate-division) | [Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.

**Pattern Recognition:**

- Signal: "group elements" + "connectivity queries" → **Union Find**
- Bài này thuộc dạng Union Find — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Cost Walk in Weighted Graph example:**

```
// TODO: Add step-by-step visual for Union Find
// Show one complete example with state at each step
```

---

## Problem Description

Minimum Cost Walk in Weighted Graph. ([LeetCode](https://leetcode.com/problems/minimum-cost-walk-in-weighted-graph))

Difficulty: Hard | Acceptance: 68.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-cost-walk-in-weighted-graph) for full constraints

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
function minimumCostWalkInWeightedGraphBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Union Find
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumCostWalkInWeightedGraph(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Union Find
  // Hint: Use union-find with path compression and union by rank
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumCostWalkInWeightedGraph(/* example 1 */)); // expected
// console.log(minimumCostWalkInWeightedGraph(/* example 2 */)); // expected
// console.log(minimumCostWalkInWeightedGraph(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points) — same pattern: Minimum Spanning Tree
- [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread) — same pattern: Union Find
- [Satisfiability of Equality Equations](https://leetcode.com/problems/satisfiability-of-equality-equations) — same pattern: Union Find
- [Minimum Cost Walk in Weighted Graph — LeetCode](https://leetcode.com/problems/minimum-cost-walk-in-weighted-graph) — problem page
