---
layout: page
title: "Max Sum of Rectangle No Larger Than K"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Matrix, Prefix Sum, Ordered Set]
leetcode_url: "https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k"
---

# Max Sum of Rectangle No Larger Than K / Max Sum of Rectangle No Larger Than K

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom) | [Maximum Side Length of a Square with Sum Less than or Equal to Threshold](https://leetcode.com/problems/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Max Sum of Rectangle No Larger Than K example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Max Sum of Rectangle No Larger Than K. ([LeetCode](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k))

Difficulty: Hard | Acceptance: 44.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k) for full constraints

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
function maxSumOfRectangleNoLargerThanKBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maxSumOfRectangleNoLargerThanK(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maxSumOfRectangleNoLargerThanK(/* example 1 */)); // expected
// console.log(maxSumOfRectangleNoLargerThanK(/* example 2 */)); // expected
// console.log(maxSumOfRectangleNoLargerThanK(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom) — same pattern: Prefix Sum
- [Maximum Side Length of a Square with Sum Less than or Equal to Threshold](https://leetcode.com/problems/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold) — same pattern: Prefix Sum
- [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix) — same pattern: Binary Search
- [Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight) — same pattern: Prefix Sum
- [Max Sum of Rectangle No Larger Than K — LeetCode](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k) — problem page
