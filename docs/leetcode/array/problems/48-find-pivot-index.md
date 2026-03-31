---
layout: page
title: "Find Pivot Index"
difficulty: Easy
category: Array
tags: [Array, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/find-pivot-index"
---

# Find Pivot Index / Find Pivot Index

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) | [Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find Pivot Index example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Find Pivot Index. ([LeetCode](https://leetcode.com/problems/find-pivot-index))

Difficulty: Easy | Acceptance: 60.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-pivot-index) for full constraints

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
function findPivotIndexBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findPivotIndex(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findPivotIndex(/* example 1 */)); // expected
// console.log(findPivotIndex(/* example 2 */)); // expected
// console.log(findPivotIndex(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) — same pattern: Prefix Sum
- [Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight) — same pattern: Prefix Sum
- [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k) — same pattern: Sliding Window
- [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) — same pattern: Prefix Sum
- [Find Pivot Index — LeetCode](https://leetcode.com/problems/find-pivot-index) — problem page
