---
layout: page
title: "Minimum Cost to Buy Apples"
difficulty: Medium
category: Tree-Graph
tags: [Array, Graph, Heap (Priority Queue), Shortest Path]
leetcode_url: "https://leetcode.com/problems/minimum-cost-to-buy-apples"
---

# Minimum Cost to Buy Apples / Minimum Cost to Buy Apples

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Shortest Path (BFS/Dijkstra)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Path with Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability) | [Minimum Time to Visit a Cell In a Grid](https://leetcode.com/problems/minimum-time-to-visit-a-cell-in-a-grid)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tìm đường đi ngắn nhất trên Google Maps — BFS cho đồ thị không trọng số, Dijkstra cho có trọng số dương.

**Pattern Recognition:**

- Signal: "shortest/minimum path with weights" → **Dijkstra/BFS**
- Bài này thuộc dạng Shortest Path (BFS/Dijkstra) — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Cost to Buy Apples example:**

```
// TODO: Add step-by-step visual for Shortest Path (BFS/Dijkstra)
// Show one complete example with state at each step
```

---

## Problem Description

Minimum Cost to Buy Apples. ([LeetCode](https://leetcode.com/problems/minimum-cost-to-buy-apples))

Difficulty: Medium | Acceptance: 67.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-cost-to-buy-apples) for full constraints

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
function minimumCostToBuyApplesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Shortest Path (BFS/Dijkstra)
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumCostToBuyApples(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Shortest Path (BFS/Dijkstra)
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumCostToBuyApples(/* example 1 */)); // expected
// console.log(minimumCostToBuyApples(/* example 2 */)); // expected
// console.log(minimumCostToBuyApples(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Path with Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability) — same pattern: Shortest Path (BFS/Dijkstra)
- [Minimum Time to Visit a Cell In a Grid](https://leetcode.com/problems/minimum-time-to-visit-a-cell-in-a-grid) — same pattern: Shortest Path (BFS/Dijkstra)
- [Minimum Cost to Make at Least One Valid Path in a Grid](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid) — same pattern: Shortest Path (BFS/Dijkstra)
- [Minimum Cost of a Path With Special Roads](https://leetcode.com/problems/minimum-cost-of-a-path-with-special-roads) — same pattern: Shortest Path (BFS/Dijkstra)
- [Minimum Cost to Buy Apples — LeetCode](https://leetcode.com/problems/minimum-cost-to-buy-apples) — problem page
