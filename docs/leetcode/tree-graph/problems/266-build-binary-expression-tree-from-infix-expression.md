---
layout: page
title: "Build Binary Expression Tree From Infix Expression"
difficulty: Hard
category: Tree-Graph
tags: [String, Stack, Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/build-binary-expression-tree-from-infix-expression"
---

# Build Binary Expression Tree From Infix Expression / Build Binary Expression Tree From Infix Expression

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Tree Traversal
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) | [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng khám phá cây gia phả — bạn có thể đi từ gốc xuống lá (top-down) hoặc từ lá lên gốc (bottom-up), tuỳ câu hỏi cần trả lời.

**Pattern Recognition:**

- Signal: "binary tree" + "traverse/collect values" → **Tree Traversal**
- Bài này thuộc dạng Tree Traversal — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Build Binary Expression Tree From Infix Expression example:**

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

Build Binary Expression Tree From Infix Expression. ([LeetCode](https://leetcode.com/problems/build-binary-expression-tree-from-infix-expression))

Difficulty: Hard | Acceptance: 62.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/build-binary-expression-tree-from-infix-expression) for full constraints

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
function buildBinaryExpressionTreeFromInfixExpressionBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Tree Traversal
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function buildBinaryExpressionTreeFromInfixExpression(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Tree Traversal
  // Hint: Choose traversal order based on what info you need
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(buildBinaryExpressionTreeFromInfixExpression(/* example 1 */)); // expected
// console.log(buildBinaryExpressionTreeFromInfixExpression(/* example 2 */)); // expected
// console.log(buildBinaryExpressionTreeFromInfixExpression(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) — same pattern: BFS
- [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list) — same pattern: DFS
- [Binary Tree Paths](https://leetcode.com/problems/binary-tree-paths) — same pattern: Backtracking
- [Step-By-Step Directions From a Binary Tree Node to Another](https://leetcode.com/problems/step-by-step-directions-from-a-binary-tree-node-to-another) — same pattern: DFS
- [Build Binary Expression Tree From Infix Expression — LeetCode](https://leetcode.com/problems/build-binary-expression-tree-from-infix-expression) — problem page
