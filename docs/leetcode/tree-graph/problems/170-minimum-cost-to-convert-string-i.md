---
layout: page
title: "Minimum Cost to Convert String I"
difficulty: Medium
category: Tree-Graph
tags: [Array, String, Graph, Shortest Path]
leetcode_url: "https://leetcode.com/problems/minimum-cost-to-convert-string-i"
---

# Minimum Cost to Convert String I / Minimum Cost to Convert String I

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Shortest Path (BFS/Dijkstra)
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Evaluate Division](https://leetcode.com/problems/evaluate-division) | [Minimum Cost to Convert String II](https://leetcode.com/problems/minimum-cost-to-convert-string-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tìm đường đi ngắn nhất trên Google Maps — BFS cho đồ thị không trọng số, Dijkstra cho có trọng số dương.

**Pattern Recognition:**

- Signal: "shortest/minimum path with weights" → **Dijkstra/BFS**
- Bài này thuộc dạng Shortest Path (BFS/Dijkstra) — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Cost to Convert String I example:**

```
// TODO: Add step-by-step visual for Shortest Path (BFS/Dijkstra)
// Show one complete example with state at each step
```

---

## Problem Description

Minimum Cost to Convert String I. ([LeetCode](https://leetcode.com/problems/minimum-cost-to-convert-string-i))

Difficulty: Medium | Acceptance: 57.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-cost-to-convert-string-i) for full constraints

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
function minimumCostToConvertStringIBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Shortest Path (BFS/Dijkstra)
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumCostToConvertStringI(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Shortest Path (BFS/Dijkstra)
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumCostToConvertStringI(/* example 1 */)); // expected
// console.log(minimumCostToConvertStringI(/* example 2 */)); // expected
// console.log(minimumCostToConvertStringI(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Minimum Cost to Convert String II](https://leetcode.com/problems/minimum-cost-to-convert-string-ii) — same pattern: Shortest Path (BFS/Dijkstra)
- [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula) — same pattern: Topological Sort
- [Find All Possible Recipes from Given Supplies](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies) — same pattern: Topological Sort
- [Minimum Cost to Convert String I — LeetCode](https://leetcode.com/problems/minimum-cost-to-convert-string-i) — problem page
