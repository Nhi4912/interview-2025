---
layout: page
title: "Serialize and Deserialize Binary Tree"
difficulty: Hard
category: Tree-Graph
tags: [String, Tree, Depth-First Search, Breadth-First Search, Design]
leetcode_url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree"
---

# Serialize and Deserialize Binary Tree / Serialize and Deserialize Binary Tree

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 10 companies
> **See also**: [Same Tree](https://leetcode.com/problems/same-tree) | [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như ném đá xuống ao — sóng lan ra theo từng vòng đều đặn. Khám phá hết tất cả ở khoảng cách 1, rồi mới sang khoảng cách 2.

**Pattern Recognition:**

- Signal: "shortest path (unweighted)" + "level-order" → **BFS**
- Bài này thuộc dạng BFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Serialize and Deserialize Binary Tree example:**

```
Level 0:     [root]
Level 1:   [A, B]
Level 2: [C, D, E]

BFS: process level by level using queue
```

---

## Problem Description

Serialize and Deserialize Binary Tree. ([LeetCode](https://leetcode.com/problems/serialize-and-deserialize-binary-tree))

Difficulty: Hard | Acceptance: 59.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) for full constraints

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
function serializeAndDeserializeBinaryTreeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — BFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function serializeAndDeserializeBinaryTree(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using BFS
  // Hint: Use queue, process level by level
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(serializeAndDeserializeBinaryTree(/* example 1 */)); // expected
// console.log(serializeAndDeserializeBinaryTree(/* example 2 */)); // expected
// console.log(serializeAndDeserializeBinaryTree(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Same Tree](https://leetcode.com/problems/same-tree) — same pattern: BFS
- [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view) — same pattern: BFS
- [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree) — same pattern: BFS
- [Amount of Time for Binary Tree to Be Infected](https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected) — same pattern: BFS
- [Serialize and Deserialize Binary Tree — LeetCode](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) — problem page
