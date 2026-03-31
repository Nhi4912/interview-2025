---
layout: page
title: "Find the Town Judge"
difficulty: Easy
category: Tree-Graph
tags: [Array, Hash Table, Graph]
leetcode_url: "https://leetcode.com/problems/find-the-town-judge"
---

# Find the Town Judge / Find the Town Judge

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Graph
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula) | [Find All Possible Recipes from Given Supplies](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống mạng lưới đường phố — mỗi ngã tư là một node, mỗi con đường là edge. Bài toán đặt ra: tìm đường ngắn nhất, kiểm tra có chu trình, hoặc đếm thành phần liên thông.

**Pattern Recognition:**

- Signal: "nodes and edges" + "connectivity/reachability" → **Graph**
- Bài này thuộc dạng Graph — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find the Town Judge example:**

```
// TODO: Add step-by-step visual for Graph
// Show one complete example with state at each step
```

---

## Problem Description

Find the Town Judge. ([LeetCode](https://leetcode.com/problems/find-the-town-judge))

Difficulty: Easy | Acceptance: 50.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-the-town-judge) for full constraints

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
function findTheTownJudgeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Graph
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findTheTownJudge(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Graph
  // Hint: Build adjacency list, choose BFS/DFS based on requirement
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findTheTownJudge(/* example 1 */)); // expected
// console.log(findTheTownJudge(/* example 2 */)); // expected
// console.log(findTheTownJudge(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula) — same pattern: Topological Sort
- [Find All Possible Recipes from Given Supplies](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies) — same pattern: Topological Sort
- [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread) — same pattern: Union Find
- [Minimize Malware Spread II](https://leetcode.com/problems/minimize-malware-spread-ii) — same pattern: Union Find
- [Find the Town Judge — LeetCode](https://leetcode.com/problems/find-the-town-judge) — problem page
