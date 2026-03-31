---
layout: page
title: "Convert Sorted List to Binary Search Tree"
difficulty: Medium
category: Tree-Graph
tags: [Linked List, Divide and Conquer, Tree, Binary Search Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree"
---

# Convert Sorted List to Binary Search Tree / Convert Sorted List to Binary Search Tree

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Convert Binary Search Tree to Sorted Doubly Linked List](https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list) | [Number of Ways to Reorder Array to Get Same BST](https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Convert Sorted List to Binary Search Tree example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Convert Sorted List to Binary Search Tree. ([LeetCode](https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree))

Difficulty: Medium | Acceptance: 64.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Input đã sorted? Cần tìm vị trí chính xác hay boundary?" / Is input sorted? Exact match or boundary?
2. **Brute force**: "Linear scan O(n)" → optimize with binary search O(log n) / Start linear, suggest binary
3. **Optimize**: "Chú ý lo/hi boundary: lo <= hi hay lo < hi? mid±1 hay mid?" / Watch boundary conditions carefully
4. **Edge cases**: "Mảng rỗng, một phần tử, target không tồn tại, overflow mid" / Empty, single, not found, overflow

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function convertSortedListToBinarySearchTreeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function convertSortedListToBinarySearchTree(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(convertSortedListToBinarySearchTree(/* example 1 */)); // expected
// console.log(convertSortedListToBinarySearchTree(/* example 2 */)); // expected
// console.log(convertSortedListToBinarySearchTree(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Convert Binary Search Tree to Sorted Doubly Linked List](https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list) — same pattern: Binary Search
- [Number of Ways to Reorder Array to Get Same BST](https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst) — same pattern: Union Find
- [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees) — same pattern: Dynamic Programming
- [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list) — same pattern: DFS
- [Convert Sorted List to Binary Search Tree — LeetCode](https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree) — problem page
