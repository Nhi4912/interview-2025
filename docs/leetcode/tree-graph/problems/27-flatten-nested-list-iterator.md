---
layout: page
title: "Flatten Nested List Iterator"
difficulty: Medium
category: Tree-Graph
tags: [Stack, Tree, Depth-First Search, Design, Queue]
leetcode_url: "https://leetcode.com/problems/flatten-nested-list-iterator"
---

# Flatten Nested List Iterator / Flatten Nested List Iterator

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 10 companies
> **See also**: [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator) | [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đi trong mê cung — bạn đi sâu hết một ngõ, nếu cụt thì quay lại ngã rẽ gần nhất chưa thử.

**Pattern Recognition:**

- Signal: "traverse tree/graph" + "all paths" → **DFS**
- Bài này thuộc dạng DFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Flatten Nested List Iterator example:**

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

Flatten Nested List Iterator. ([LeetCode](https://leetcode.com/problems/flatten-nested-list-iterator))

Difficulty: Medium | Acceptance: 65.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/flatten-nested-list-iterator) for full constraints

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
function flattenNestedListIteratorBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — DFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function flattenNestedListIterator(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using DFS
  // Hint: Use recursion or stack, track visited nodes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(flattenNestedListIterator(/* example 1 */)); // expected
// console.log(flattenNestedListIterator(/* example 2 */)); // expected
// console.log(flattenNestedListIterator(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator) — same pattern: Binary Search
- [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) — same pattern: BFS
- [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list) — same pattern: DFS
- [Closest Binary Search Tree Value II](https://leetcode.com/problems/closest-binary-search-tree-value-ii) — same pattern: Two Pointers
- [Flatten Nested List Iterator — LeetCode](https://leetcode.com/problems/flatten-nested-list-iterator) — problem page
