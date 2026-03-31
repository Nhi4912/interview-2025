---
layout: page
title: "Vertical Order Traversal of a Binary Tree"
difficulty: Hard
category: Tree-Graph
tags: [Hash Table, Tree, Depth-First Search, Breadth-First Search, Sorting]
leetcode_url: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree"
---

# Vertical Order Traversal of a Binary Tree / Vertical Order Traversal of a Binary Tree

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Binary Tree Vertical Order Traversal](https://leetcode.com/problems/binary-tree-vertical-order-traversal) | [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như ném đá xuống ao — sóng lan ra theo từng vòng đều đặn. Khám phá hết tất cả ở khoảng cách 1, rồi mới sang khoảng cách 2.

**Pattern Recognition:**

- Signal: "shortest path (unweighted)" + "level-order" → **BFS**
- Bài này thuộc dạng BFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Vertical Order Traversal of a Binary Tree example:**

```
Level 0:     [root]
Level 1:   [A, B]
Level 2: [C, D, E]

BFS: process level by level using queue
```

---

## Problem Description

Vertical Order Traversal of a Binary Tree. ([LeetCode](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree))

Difficulty: Hard | Acceptance: 51.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree) for full constraints

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
function verticalOrderTraversalOfABinaryTreeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — BFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function verticalOrderTraversalOfABinaryTree(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using BFS
  // Hint: Use queue, process level by level
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(verticalOrderTraversalOfABinaryTree(/* example 1 */)); // expected
// console.log(verticalOrderTraversalOfABinaryTree(/* example 2 */)); // expected
// console.log(verticalOrderTraversalOfABinaryTree(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Binary Tree Vertical Order Traversal](https://leetcode.com/problems/binary-tree-vertical-order-traversal) — same pattern: BFS
- [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree) — same pattern: BFS
- [Amount of Time for Binary Tree to Be Infected](https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected) — same pattern: BFS
- [Two Sum IV - Input is a BST](https://leetcode.com/problems/two-sum-iv-input-is-a-bst) — same pattern: Two Pointers
- [Vertical Order Traversal of a Binary Tree — LeetCode](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree) — problem page
