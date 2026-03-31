---
layout: page
title: "Longest Increasing Path in a Matrix"
difficulty: Hard
category: Tree-Graph
tags: [Array, Dynamic Programming, Depth-First Search, Breadth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix"
---

# Longest Increasing Path in a Matrix / Longest Increasing Path in a Matrix

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Topological Sort
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Sliding Puzzle](https://leetcode.com/problems/sliding-puzzle) | [Minimum Runes to Add to Cast Spell](https://leetcode.com/problems/minimum-runes-to-add-to-cast-spell)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống sắp xếp thứ tự học môn — môn A prerequisite của B thì A phải học trước. Topological sort xếp thứ tự sao cho mọi dependency được thoả mãn.

**Pattern Recognition:**

- Signal: "dependency ordering" + "DAG" → **Topological Sort**
- Bài này thuộc dạng Topological Sort — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Longest Increasing Path in a Matrix example:**

```
// TODO: Add step-by-step visual for Topological Sort
// Show one complete example with state at each step
```

---

## Problem Description

Longest Increasing Path in a Matrix. ([LeetCode](https://leetcode.com/problems/longest-increasing-path-in-a-matrix))

Difficulty: Hard | Acceptance: 55.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) for full constraints

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
function longestIncreasingPathInAMatrixBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Topological Sort
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function longestIncreasingPathInAMatrix(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Topological Sort
  // Hint: Use in-degree counting or DFS post-order
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(longestIncreasingPathInAMatrix(/* example 1 */)); // expected
// console.log(longestIncreasingPathInAMatrix(/* example 2 */)); // expected
// console.log(longestIncreasingPathInAMatrix(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Sliding Puzzle](https://leetcode.com/problems/sliding-puzzle) — same pattern: Backtracking
- [Minimum Runes to Add to Cast Spell](https://leetcode.com/problems/minimum-runes-to-add-to-cast-spell) — same pattern: Topological Sort
- [Course Schedule](https://leetcode.com/problems/course-schedule) — same pattern: Topological Sort
- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Longest Increasing Path in a Matrix — LeetCode](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) — problem page
