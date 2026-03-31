---
layout: page
title: "Closest Binary Search Tree Value"
difficulty: Easy
category: Tree-Graph
tags: [Binary Search, Tree, Depth-First Search, Binary Search Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/closest-binary-search-tree-value"
---

# Closest Binary Search Tree Value / Closest Binary Search Tree Value

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Recover Binary Search Tree](https://leetcode.com/problems/recover-binary-search-tree) | [Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Closest Binary Search Tree Value example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Closest Binary Search Tree Value. ([LeetCode](https://leetcode.com/problems/closest-binary-search-tree-value))

Difficulty: Easy | Acceptance: 49.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/closest-binary-search-tree-value) for full constraints

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
function closestBinarySearchTreeValueBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function closestBinarySearchTreeValue(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(closestBinarySearchTreeValue(/* example 1 */)); // expected
// console.log(closestBinarySearchTreeValue(/* example 2 */)); // expected
// console.log(closestBinarySearchTreeValue(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Recover Binary Search Tree](https://leetcode.com/problems/recover-binary-search-tree) — same pattern: Binary Search
- [Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree) — same pattern: Binary Search
- [Binary Search Tree to Greater Sum Tree](https://leetcode.com/problems/binary-search-tree-to-greater-sum-tree) — same pattern: Binary Search
- [Two Sum IV - Input is a BST](https://leetcode.com/problems/two-sum-iv-input-is-a-bst) — same pattern: Two Pointers
- [Closest Binary Search Tree Value — LeetCode](https://leetcode.com/problems/closest-binary-search-tree-value) — problem page
