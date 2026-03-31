---
layout: page
title: "Leftmost Column with at Least a One"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Matrix, Interactive]
leetcode_url: "https://leetcode.com/problems/leftmost-column-with-at-least-a-one"
---

# Leftmost Column with at Least a One / Leftmost Column with at Least a One

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix) | [Search a 2D Matrix II](https://leetcode.com/problems/search-a-2d-matrix-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Leftmost Column with at Least a One example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Leftmost Column with at Least a One. ([LeetCode](https://leetcode.com/problems/leftmost-column-with-at-least-a-one))

Difficulty: Medium | Acceptance: 54.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/leftmost-column-with-at-least-a-one) for full constraints

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
function leftmostColumnWithAtLeastAOneBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function leftmostColumnWithAtLeastAOne(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(leftmostColumnWithAtLeastAOne(/* example 1 */)); // expected
// console.log(leftmostColumnWithAtLeastAOne(/* example 2 */)); // expected
// console.log(leftmostColumnWithAtLeastAOne(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix) — same pattern: Binary Search
- [Search a 2D Matrix II](https://leetcode.com/problems/search-a-2d-matrix-ii) — same pattern: Binary Search
- [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) — same pattern: Union Find
- [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix) — same pattern: Binary Search
- [Leftmost Column with at Least a One — LeetCode](https://leetcode.com/problems/leftmost-column-with-at-least-a-one) — problem page
