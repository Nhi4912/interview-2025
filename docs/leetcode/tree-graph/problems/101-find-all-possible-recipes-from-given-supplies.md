---
layout: page
title: "Find All Possible Recipes from Given Supplies"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, String, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies"
---

# Find All Possible Recipes from Given Supplies / Find All Possible Recipes from Given Supplies

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Topological Sort
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula) | [Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống sắp xếp thứ tự học môn — môn A prerequisite của B thì A phải học trước. Topological sort xếp thứ tự sao cho mọi dependency được thoả mãn.

**Pattern Recognition:**

- Signal: "dependency ordering" + "DAG" → **Topological Sort**
- Bài này thuộc dạng Topological Sort — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find All Possible Recipes from Given Supplies example:**

```
// TODO: Add step-by-step visual for Topological Sort
// Show one complete example with state at each step
```

---

## Problem Description

Find All Possible Recipes from Given Supplies. ([LeetCode](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies))

Difficulty: Medium | Acceptance: 56.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies) for full constraints

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
function findAllPossibleRecipesFromGivenSuppliesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Topological Sort
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findAllPossibleRecipesFromGivenSupplies(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Topological Sort
  // Hint: Use in-degree counting or DFS post-order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findAllPossibleRecipesFromGivenSupplies(/* example 1 */)); // expected
// console.log(findAllPossibleRecipesFromGivenSupplies(/* example 2 */)); // expected
// console.log(findAllPossibleRecipesFromGivenSupplies(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula) — same pattern: Topological Sort
- [Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters) — same pattern: Topological Sort
- [Frequencies of Shortest Supersequences](https://leetcode.com/problems/frequencies-of-shortest-supersequences) — same pattern: Topological Sort
- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Find All Possible Recipes from Given Supplies — LeetCode](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies) — problem page
