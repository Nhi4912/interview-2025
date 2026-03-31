---
layout: page
title: "Minimum Absolute Difference Between Elements With Constraint"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Ordered Set]
leetcode_url: "https://leetcode.com/problems/minimum-absolute-difference-between-elements-with-constraint"
---

# Minimum Absolute Difference Between Elements With Constraint / Minimum Absolute Difference Between Elements With Constraint

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Partition Array Into Two Arrays to Minimize Sum Difference](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference) | [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Absolute Difference Between Elements With Constraint example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Minimum Absolute Difference Between Elements With Constraint. ([LeetCode](https://leetcode.com/problems/minimum-absolute-difference-between-elements-with-constraint))

Difficulty: Medium | Acceptance: 34.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-absolute-difference-between-elements-with-constraint) for full constraints

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
function minimumAbsoluteDifferenceBetweenElementsWithConstraintBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumAbsoluteDifferenceBetweenElementsWithConstraint(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumAbsoluteDifferenceBetweenElementsWithConstraint(/* example 1 */)); // expected
// console.log(minimumAbsoluteDifferenceBetweenElementsWithConstraint(/* example 2 */)); // expected
// console.log(minimumAbsoluteDifferenceBetweenElementsWithConstraint(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Partition Array Into Two Arrays to Minimize Sum Difference](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference) — same pattern: Two Pointers
- [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom) — same pattern: Prefix Sum
- [132 Pattern](https://leetcode.com/problems/132-pattern) — same pattern: Monotonic Stack
- [Implement Router](https://leetcode.com/problems/implement-router) — same pattern: Binary Search
- [Minimum Absolute Difference Between Elements With Constraint — LeetCode](https://leetcode.com/problems/minimum-absolute-difference-between-elements-with-constraint) — problem page
