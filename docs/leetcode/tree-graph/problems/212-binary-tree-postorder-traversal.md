---
layout: page
title: "Binary Tree Postorder Traversal"
difficulty: Easy
category: Tree-Graph
tags: [Stack, Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/binary-tree-postorder-traversal"
---

# Binary Tree Postorder Traversal / Binary Tree Postorder Traversal

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list) | [Closest Binary Search Tree Value II](https://leetcode.com/problems/closest-binary-search-tree-value-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đi trong mê cung — bạn đi sâu hết một ngõ, nếu cụt thì quay lại ngã rẽ gần nhất chưa thử.

**Pattern Recognition:**

- Signal: "traverse tree/graph" + "all paths" → **DFS**
- Bài này thuộc dạng DFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Binary Tree Postorder Traversal example:**

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

Binary Tree Postorder Traversal. ([LeetCode](https://leetcode.com/problems/binary-tree-postorder-traversal))

Difficulty: Easy | Acceptance: 75.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/binary-tree-postorder-traversal) for full constraints

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
function binaryTreePostorderTraversalBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — DFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function binaryTreePostorderTraversal(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using DFS
  // Hint: Use recursion or stack, track visited nodes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(binaryTreePostorderTraversal(/* example 1 */)); // expected
// console.log(binaryTreePostorderTraversal(/* example 2 */)); // expected
// console.log(binaryTreePostorderTraversal(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list) — same pattern: DFS
- [Closest Binary Search Tree Value II](https://leetcode.com/problems/closest-binary-search-tree-value-ii) — same pattern: Two Pointers
- [Convert Binary Search Tree to Sorted Doubly Linked List](https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list) — same pattern: Binary Search
- [Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal) — same pattern: DFS
- [Binary Tree Postorder Traversal — LeetCode](https://leetcode.com/problems/binary-tree-postorder-traversal) — problem page
