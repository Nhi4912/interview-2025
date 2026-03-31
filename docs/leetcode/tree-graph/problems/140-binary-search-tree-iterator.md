---
layout: page
title: "Binary Search Tree Iterator"
difficulty: Medium
category: Tree-Graph
tags: [Stack, Tree, Design, Binary Search Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/binary-search-tree-iterator"
---

# Binary Search Tree Iterator / Binary Search Tree Iterator

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Flatten Nested List Iterator](https://leetcode.com/problems/flatten-nested-list-iterator) | [Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Binary Search Tree Iterator example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Binary Search Tree Iterator. ([LeetCode](https://leetcode.com/problems/binary-search-tree-iterator))

Difficulty: Medium | Acceptance: 74.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/binary-search-tree-iterator) for full constraints

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
function binarySearchTreeIteratorBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function binarySearchTreeIterator(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(binarySearchTreeIterator(/* example 1 */)); // expected
// console.log(binarySearchTreeIterator(/* example 2 */)); // expected
// console.log(binarySearchTreeIterator(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Flatten Nested List Iterator](https://leetcode.com/problems/flatten-nested-list-iterator) — same pattern: DFS
- [Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream) — same pattern: Binary Search
- [Closest Binary Search Tree Value II](https://leetcode.com/problems/closest-binary-search-tree-value-ii) — same pattern: Two Pointers
- [Verify Preorder Sequence in Binary Search Tree](https://leetcode.com/problems/verify-preorder-sequence-in-binary-search-tree) — same pattern: Monotonic Stack
- [Binary Search Tree Iterator — LeetCode](https://leetcode.com/problems/binary-search-tree-iterator) — problem page
