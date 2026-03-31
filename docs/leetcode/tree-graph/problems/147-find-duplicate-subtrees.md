---
layout: page
title: "Find Duplicate Subtrees"
difficulty: Medium
category: Tree-Graph
tags: [Hash Table, Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/find-duplicate-subtrees"
---

# Find Duplicate Subtrees / Find Duplicate Subtrees

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree) | [Amount of Time for Binary Tree to Be Infected](https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đi trong mê cung — bạn đi sâu hết một ngõ, nếu cụt thì quay lại ngã rẽ gần nhất chưa thử.

**Pattern Recognition:**

- Signal: "traverse tree/graph" + "all paths" → **DFS**
- Bài này thuộc dạng DFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find Duplicate Subtrees example:**

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

Find Duplicate Subtrees. ([LeetCode](https://leetcode.com/problems/find-duplicate-subtrees))

Difficulty: Medium | Acceptance: 60.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-duplicate-subtrees) for full constraints

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
function findDuplicateSubtreesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — DFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findDuplicateSubtrees(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using DFS
  // Hint: Use recursion or stack, track visited nodes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findDuplicateSubtrees(/* example 1 */)); // expected
// console.log(findDuplicateSubtrees(/* example 2 */)); // expected
// console.log(findDuplicateSubtrees(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree) — same pattern: BFS
- [Amount of Time for Binary Tree to Be Infected](https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected) — same pattern: BFS
- [Vertical Order Traversal of a Binary Tree](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree) — same pattern: BFS
- [Two Sum IV - Input is a BST](https://leetcode.com/problems/two-sum-iv-input-is-a-bst) — same pattern: Two Pointers
- [Find Duplicate Subtrees — LeetCode](https://leetcode.com/problems/find-duplicate-subtrees) — problem page
