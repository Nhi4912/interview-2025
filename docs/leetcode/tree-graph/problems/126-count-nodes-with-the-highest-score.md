---
layout: page
title: "Count Nodes With the Highest Score"
difficulty: Medium
category: Tree-Graph
tags: [Array, Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/count-nodes-with-the-highest-score"
---

# Count Nodes With the Highest Score / Count Nodes With the Highest Score

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Path Sum IV](https://leetcode.com/problems/path-sum-iv) | [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đi trong mê cung — bạn đi sâu hết một ngõ, nếu cụt thì quay lại ngã rẽ gần nhất chưa thử.

**Pattern Recognition:**

- Signal: "traverse tree/graph" + "all paths" → **DFS**
- Bài này thuộc dạng DFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Count Nodes With the Highest Score example:**

```
       root
      /    \
     A      B
    / \      \
   C   D      E

DFS: root → A → C → D → B → E
Use: recursion or explicit stack
```

---

## Problem Description

Count Nodes With the Highest Score. ([LeetCode](https://leetcode.com/problems/count-nodes-with-the-highest-score))

Difficulty: Medium | Acceptance: 51.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/count-nodes-with-the-highest-score) for full constraints

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
function countNodesWithTheHighestScoreBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — DFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function countNodesWithTheHighestScore(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using DFS
  // Hint: Use recursion or stack, track visited nodes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(countNodesWithTheHighestScore(/* example 1 */)); // expected
// console.log(countNodesWithTheHighestScore(/* example 2 */)); // expected
// console.log(countNodesWithTheHighestScore(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Path Sum IV](https://leetcode.com/problems/path-sum-iv) — same pattern: DFS
- [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) — same pattern: DFS
- [Same Tree](https://leetcode.com/problems/same-tree) — same pattern: BFS
- [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) — same pattern: BFS
- [Count Nodes With the Highest Score — LeetCode](https://leetcode.com/problems/count-nodes-with-the-highest-score) — problem page
