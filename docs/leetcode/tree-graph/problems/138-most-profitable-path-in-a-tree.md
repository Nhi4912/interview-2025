---
layout: page
title: "Most Profitable Path in a Tree"
difficulty: Medium
category: Tree-Graph
tags: [Array, Tree, Depth-First Search, Breadth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/most-profitable-path-in-a-tree"
---

# Most Profitable Path in a Tree / Most Profitable Path in a Tree

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Reachable Nodes With Restrictions](https://leetcode.com/problems/reachable-nodes-with-restrictions) | [Evaluate Division](https://leetcode.com/problems/evaluate-division)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như ném đá xuống ao — sóng lan ra theo từng vòng đều đặn. Khám phá hết tất cả ở khoảng cách 1, rồi mới sang khoảng cách 2.

**Pattern Recognition:**

- Signal: "shortest path (unweighted)" + "level-order" → **BFS**
- Bài này thuộc dạng BFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Most Profitable Path in a Tree example:**

```
Level 0:     [root]
Level 1:   [A, B]
Level 2: [C, D, E]

BFS: process level by level using queue
```

---

## Problem Description

Most Profitable Path in a Tree. ([LeetCode](https://leetcode.com/problems/most-profitable-path-in-a-tree))

Difficulty: Medium | Acceptance: 67.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/most-profitable-path-in-a-tree) for full constraints

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
function mostProfitablePathInATreeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — BFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function mostProfitablePathInATree(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using BFS
  // Hint: Use queue, process level by level
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(mostProfitablePathInATree(/* example 1 */)); // expected
// console.log(mostProfitablePathInATree(/* example 2 */)); // expected
// console.log(mostProfitablePathInATree(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Reachable Nodes With Restrictions](https://leetcode.com/problems/reachable-nodes-with-restrictions) — same pattern: Union Find
- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) — same pattern: Topological Sort
- [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread) — same pattern: Union Find
- [Most Profitable Path in a Tree — LeetCode](https://leetcode.com/problems/most-profitable-path-in-a-tree) — problem page
