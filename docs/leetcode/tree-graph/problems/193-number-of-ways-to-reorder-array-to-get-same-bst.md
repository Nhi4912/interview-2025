---
layout: page
title: "Number of Ways to Reorder Array to Get Same BST"
difficulty: Hard
category: Tree-Graph
tags: [Array, Math, Divide and Conquer, Dynamic Programming, Tree]
leetcode_url: "https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst"
---

# Number of Ways to Reorder Array to Get Same BST / Number of Ways to Reorder Array to Get Same BST

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees) | [Unique Binary Search Trees II](https://leetcode.com/problems/unique-binary-search-trees-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.

**Pattern Recognition:**

- Signal: "group elements" + "connectivity queries" → **Union Find**
- Bài này thuộc dạng Union Find — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of Ways to Reorder Array to Get Same BST example:**

```
// TODO: Add step-by-step visual for Union Find
// Show one complete example with state at each step
```

---

## Problem Description

Number of Ways to Reorder Array to Get Same BST. ([LeetCode](https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst))

Difficulty: Hard | Acceptance: 53.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst) for full constraints

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
function numberOfWaysToReorderArrayToGetSameBstBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Union Find
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfWaysToReorderArrayToGetSameBst(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Union Find
  // Hint: Use union-find with path compression and union by rank
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfWaysToReorderArrayToGetSameBst(/* example 1 */)); // expected
// console.log(numberOfWaysToReorderArrayToGetSameBst(/* example 2 */)); // expected
// console.log(numberOfWaysToReorderArrayToGetSameBst(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees) — same pattern: Dynamic Programming
- [Unique Binary Search Trees II](https://leetcode.com/problems/unique-binary-search-trees-ii) — same pattern: Backtracking
- [Convert Sorted List to Binary Search Tree](https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree) — same pattern: Binary Search
- [Verify Preorder Sequence in Binary Search Tree](https://leetcode.com/problems/verify-preorder-sequence-in-binary-search-tree) — same pattern: Monotonic Stack
- [Number of Ways to Reorder Array to Get Same BST — LeetCode](https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst) — problem page
