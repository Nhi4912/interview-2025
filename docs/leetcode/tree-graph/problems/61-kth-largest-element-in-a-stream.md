---
layout: page
title: "Kth Largest Element in a Stream"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Design, Binary Search Tree, Heap (Priority Queue), Binary Tree]
leetcode_url: "https://leetcode.com/problems/kth-largest-element-in-a-stream"
---

# Kth Largest Element in a Stream / Kth Largest Element in a Stream

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Closest Binary Search Tree Value II](https://leetcode.com/problems/closest-binary-search-tree-value-ii) | [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Kth Largest Element in a Stream example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Kth Largest Element in a Stream. ([LeetCode](https://leetcode.com/problems/kth-largest-element-in-a-stream))

Difficulty: Easy | Acceptance: 59.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/kth-largest-element-in-a-stream) for full constraints

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
function kthLargestElementInAStreamBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function kthLargestElementInAStream(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(kthLargestElementInAStream(/* example 1 */)); // expected
// console.log(kthLargestElementInAStream(/* example 2 */)); // expected
// console.log(kthLargestElementInAStream(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Closest Binary Search Tree Value II](https://leetcode.com/problems/closest-binary-search-tree-value-ii) — same pattern: Two Pointers
- [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator) — same pattern: Binary Search
- [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream) — same pattern: Two Pointers
- [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees) — same pattern: Dynamic Programming
- [Kth Largest Element in a Stream — LeetCode](https://leetcode.com/problems/kth-largest-element-in-a-stream) — problem page
