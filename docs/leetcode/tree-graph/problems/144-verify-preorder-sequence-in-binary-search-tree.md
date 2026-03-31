---
layout: page
title: "Verify Preorder Sequence in Binary Search Tree"
difficulty: Medium
category: Tree-Graph
tags: [Array, Stack, Tree, Binary Search Tree, Recursion]
leetcode_url: "https://leetcode.com/problems/verify-preorder-sequence-in-binary-search-tree"
---

# Verify Preorder Sequence in Binary Search Tree / Verify Preorder Sequence in Binary Search Tree

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Construct Binary Search Tree from Preorder Traversal](https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal) | [Closest Binary Search Tree Value II](https://leetcode.com/problems/closest-binary-search-tree-value-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống dãy núi — giữ stack luôn đơn điệu (tăng hoặc giảm). Khi gặp phần tử phá vỡ tính đơn điệu, ta biết ngay đáp án cho các phần tử trước đó.

**Pattern Recognition:**

- Signal: "next greater/smaller element" → **Monotonic Stack**
- Bài này thuộc dạng Monotonic Stack — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Verify Preorder Sequence in Binary Search Tree example:**

```
arr = [2, 1, 5, 6, 2, 3]
stack (indices): []

i=0: push 0         stack=[0]          (vals: [2])
i=1: 1<2 → push     stack=[0,1]        (vals: [2,1])
i=2: 5>1 → pop, process; 5>2 → pop, process
     push           stack=[2]          (vals: [5])
...
```

---

## Problem Description

Verify Preorder Sequence in Binary Search Tree. ([LeetCode](https://leetcode.com/problems/verify-preorder-sequence-in-binary-search-tree))

Difficulty: Medium | Acceptance: 51.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/verify-preorder-sequence-in-binary-search-tree) for full constraints

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
function verifyPreorderSequenceInBinarySearchTreeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Monotonic Stack
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function verifyPreorderSequenceInBinarySearchTree(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Monotonic Stack
  // Hint: Maintain monotonic property, pop when new element breaks it
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(verifyPreorderSequenceInBinarySearchTree(/* example 1 */)); // expected
// console.log(verifyPreorderSequenceInBinarySearchTree(/* example 2 */)); // expected
// console.log(verifyPreorderSequenceInBinarySearchTree(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Construct Binary Search Tree from Preorder Traversal](https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal) — same pattern: Monotonic Stack
- [Closest Binary Search Tree Value II](https://leetcode.com/problems/closest-binary-search-tree-value-ii) — same pattern: Two Pointers
- [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator) — same pattern: Binary Search
- [Number of Ways to Reorder Array to Get Same BST](https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst) — same pattern: Union Find
- [Verify Preorder Sequence in Binary Search Tree — LeetCode](https://leetcode.com/problems/verify-preorder-sequence-in-binary-search-tree) — problem page
