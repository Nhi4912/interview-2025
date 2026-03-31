---
layout: page
title: "Min Cost to Connect All Points"
difficulty: Medium
category: Tree-Graph
tags: [Array, Union Find, Graph, Minimum Spanning Tree]
leetcode_url: "https://leetcode.com/problems/min-cost-to-connect-all-points"
---

# Min Cost to Connect All Points / Min Cost to Connect All Points

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Minimum Spanning Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Evaluate Division](https://leetcode.com/problems/evaluate-division) | [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tìm tập edges có tổng trọng số nhỏ nhất nối tất cả nodes — dùng Kruskal (sort + union find) hoặc Prim (heap).

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Minimum Spanning Tree**
- Bài này thuộc dạng Minimum Spanning Tree — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Min Cost to Connect All Points example:**

```
// TODO: Add step-by-step visual for Minimum Spanning Tree
// Show one complete example with state at each step
```

---

## Problem Description

Min Cost to Connect All Points. ([LeetCode](https://leetcode.com/problems/min-cost-to-connect-all-points))

Difficulty: Medium | Acceptance: 69.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/min-cost-to-connect-all-points) for full constraints

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
function minCostToConnectAllPointsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Minimum Spanning Tree
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minCostToConnectAllPoints(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Minimum Spanning Tree
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minCostToConnectAllPoints(/* example 1 */)); // expected
// console.log(minCostToConnectAllPoints(/* example 2 */)); // expected
// console.log(minCostToConnectAllPoints(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread) — same pattern: Union Find
- [Satisfiability of Equality Equations](https://leetcode.com/problems/satisfiability-of-equality-equations) — same pattern: Union Find
- [Rank Transform of a Matrix](https://leetcode.com/problems/rank-transform-of-a-matrix) — same pattern: Topological Sort
- [Min Cost to Connect All Points — LeetCode](https://leetcode.com/problems/min-cost-to-connect-all-points) — problem page
