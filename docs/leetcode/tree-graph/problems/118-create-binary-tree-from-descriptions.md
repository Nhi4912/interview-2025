---
layout: page
title: "Create Binary Tree From Descriptions"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/create-binary-tree-from-descriptions"
---

# Create Binary Tree From Descriptions / Create Binary Tree From Descriptions

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Tree Traversal
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Construct Binary Tree from Inorder and Postorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal) | [Path Sum IV](https://leetcode.com/problems/path-sum-iv)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng khám phá cây gia phả — bạn có thể đi từ gốc xuống lá (top-down) hoặc từ lá lên gốc (bottom-up), tuỳ câu hỏi cần trả lời.

**Pattern Recognition:**

- Signal: "binary tree" + "traverse/collect values" → **Tree Traversal**
- Bài này thuộc dạng Tree Traversal — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Create Binary Tree From Descriptions example:**

```
        1
       / \
      2   3
     / \
    4   5

Inorder:   4, 2, 5, 1, 3
Preorder:  1, 2, 4, 5, 3
Postorder: 4, 5, 2, 3, 1
```

---

## Problem Description

Create Binary Tree From Descriptions. ([LeetCode](https://leetcode.com/problems/create-binary-tree-from-descriptions))

Difficulty: Medium | Acceptance: 81.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/create-binary-tree-from-descriptions) for full constraints

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
function createBinaryTreeFromDescriptionsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Tree Traversal
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function createBinaryTreeFromDescriptions(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Tree Traversal
  // Hint: Choose traversal order based on what info you need
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(createBinaryTreeFromDescriptions(/* example 1 */)); // expected
// console.log(createBinaryTreeFromDescriptions(/* example 2 */)); // expected
// console.log(createBinaryTreeFromDescriptions(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Construct Binary Tree from Inorder and Postorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal) — same pattern: Tree Traversal
- [Path Sum IV](https://leetcode.com/problems/path-sum-iv) — same pattern: DFS
- [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree) — same pattern: BFS
- [Amount of Time for Binary Tree to Be Infected](https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected) — same pattern: BFS
- [Create Binary Tree From Descriptions — LeetCode](https://leetcode.com/problems/create-binary-tree-from-descriptions) — problem page
