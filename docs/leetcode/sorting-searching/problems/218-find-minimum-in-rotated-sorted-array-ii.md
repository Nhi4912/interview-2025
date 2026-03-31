---
layout: page
title: "Find Minimum in Rotated Sorted Array II"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii"
---

# Find Minimum in Rotated Sorted Array II / Find Minimum in Rotated Sorted Array II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find Minimum in Rotated Sorted Array II example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Find Minimum in Rotated Sorted Array II. ([LeetCode](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii))

Difficulty: Hard | Acceptance: 44.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii) for full constraints

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
function findMinimumInRotatedSortedArrayIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findMinimumInRotatedSortedArrayIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findMinimumInRotatedSortedArrayIi(/* example 1 */)); // expected
// console.log(findMinimumInRotatedSortedArrayIi(/* example 2 */)); // expected
// console.log(findMinimumInRotatedSortedArrayIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) — same pattern: Binary Search
- [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas) — same pattern: Binary Search
- [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix) — same pattern: Binary Search
- [Find Peak Element](https://leetcode.com/problems/find-peak-element) — same pattern: Binary Search
- [Find Minimum in Rotated Sorted Array II — LeetCode](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii) — problem page
