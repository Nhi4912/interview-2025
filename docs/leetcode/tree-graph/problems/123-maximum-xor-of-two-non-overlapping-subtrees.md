---
layout: page
title: "Maximum XOR of Two Non-Overlapping Subtrees"
difficulty: Hard
category: Tree-Graph
tags: [Tree, Depth-First Search, Graph, Trie]
leetcode_url: "https://leetcode.com/problems/maximum-xor-of-two-non-overlapping-subtrees"
---

# Maximum XOR of Two Non-Overlapping Subtrees / Maximum XOR of Two Non-Overlapping Subtrees

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree) | [Minimum Fuel Cost to Report to the Capital](https://leetcode.com/problems/minimum-fuel-cost-to-report-to-the-capital)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cây thư mục — mỗi ký tự là một cấp. Tìm kiếm prefix cực nhanh O(L) với L là độ dài từ.

**Pattern Recognition:**

- Signal: "prefix search" + "dictionary of words" → **Trie**
- Bài này thuộc dạng Trie — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum XOR of Two Non-Overlapping Subtrees example:**

```
// TODO: Add step-by-step visual for Trie
// Show one complete example with state at each step
```

---

## Problem Description

Maximum XOR of Two Non-Overlapping Subtrees. ([LeetCode](https://leetcode.com/problems/maximum-xor-of-two-non-overlapping-subtrees))

Difficulty: Hard | Acceptance: 49.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-xor-of-two-non-overlapping-subtrees) for full constraints

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
function maximumXorOfTwoNonOverlappingSubtreesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Trie
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumXorOfTwoNonOverlappingSubtrees(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Trie
  // Hint: Build trie from dictionary, search by prefix
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumXorOfTwoNonOverlappingSubtrees(/* example 1 */)); // expected
// console.log(maximumXorOfTwoNonOverlappingSubtrees(/* example 2 */)); // expected
// console.log(maximumXorOfTwoNonOverlappingSubtrees(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree) — same pattern: Dynamic Programming
- [Minimum Fuel Cost to Report to the Capital](https://leetcode.com/problems/minimum-fuel-cost-to-report-to-the-capital) — same pattern: BFS
- [Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters) — same pattern: Topological Sort
- [Most Profitable Path in a Tree](https://leetcode.com/problems/most-profitable-path-in-a-tree) — same pattern: BFS
- [Maximum XOR of Two Non-Overlapping Subtrees — LeetCode](https://leetcode.com/problems/maximum-xor-of-two-non-overlapping-subtrees) — problem page
