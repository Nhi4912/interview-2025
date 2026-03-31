---
layout: page
title: "Binary Search Tree to Greater Sum Tree"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Search Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/binary-search-tree-to-greater-sum-tree"
---

# Binary Search Tree to Greater Sum Tree / Binary Search Tree to Greater Sum Tree

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Recover Binary Search Tree](https://leetcode.com/problems/recover-binary-search-tree) | [Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Binary Search Tree to Greater Sum Tree example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Binary Search Tree to Greater Sum Tree. ([LeetCode](https://leetcode.com/problems/binary-search-tree-to-greater-sum-tree))

Difficulty: Medium | Acceptance: 88.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/binary-search-tree-to-greater-sum-tree) for full constraints

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
function binarySearchTreeToGreaterSumTreeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function binarySearchTreeToGreaterSumTree(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(binarySearchTreeToGreaterSumTree(/* example 1 */)); // expected
// console.log(binarySearchTreeToGreaterSumTree(/* example 2 */)); // expected
// console.log(binarySearchTreeToGreaterSumTree(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Recover Binary Search Tree](https://leetcode.com/problems/recover-binary-search-tree) — same pattern: Binary Search
- [Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree) — same pattern: Binary Search
- [Two Sum IV - Input is a BST](https://leetcode.com/problems/two-sum-iv-input-is-a-bst) — same pattern: Two Pointers
- [Closest Binary Search Tree Value II](https://leetcode.com/problems/closest-binary-search-tree-value-ii) — same pattern: Two Pointers
- [Binary Search Tree to Greater Sum Tree — LeetCode](https://leetcode.com/problems/binary-search-tree-to-greater-sum-tree) — problem page
