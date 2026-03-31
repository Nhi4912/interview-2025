---
layout: page
title: "Kth Smallest Element in a Sorted Matrix"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Sorting, Heap (Priority Queue), Matrix]
leetcode_url: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix"
---

# Kth Smallest Element in a Sorted Matrix / Kth Smallest Element in a Sorted Matrix

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) | [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Kth Smallest Element in a Sorted Matrix example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Kth Smallest Element in a Sorted Matrix. ([LeetCode](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix))

Difficulty: Medium | Acceptance: 63.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix) for full constraints

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
function kthSmallestElementInASortedMatrixBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function kthSmallestElementInASortedMatrix(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(kthSmallestElementInASortedMatrix(/* example 1 */)); // expected
// console.log(kthSmallestElementInASortedMatrix(/* example 2 */)); // expected
// console.log(kthSmallestElementInASortedMatrix(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) — same pattern: Trie
- [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements) — same pattern: Sliding Window
- [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) — same pattern: Union Find
- [Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort) — same pattern: Union Find
- [Kth Smallest Element in a Sorted Matrix — LeetCode](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix) — problem page
