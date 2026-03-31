---
layout: page
title: "Maximum Strength of K Disjoint Subarrays"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-strength-of-k-disjoint-subarrays"
---

# Maximum Strength of K Disjoint Subarrays / Maximum Strength of K Disjoint Subarrays

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) | [Find All Good Indices](https://leetcode.com/problems/find-all-good-indices)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Strength of K Disjoint Subarrays example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Maximum Strength of K Disjoint Subarrays. ([LeetCode](https://leetcode.com/problems/maximum-strength-of-k-disjoint-subarrays))

Difficulty: Hard | Acceptance: 26.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-strength-of-k-disjoint-subarrays) for full constraints

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
function maximumStrengthOfKDisjointSubarraysBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumStrengthOfKDisjointSubarrays(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumStrengthOfKDisjointSubarrays(/* example 1 */)); // expected
// console.log(maximumStrengthOfKDisjointSubarrays(/* example 2 */)); // expected
// console.log(maximumStrengthOfKDisjointSubarrays(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) — same pattern: Prefix Sum
- [Find All Good Indices](https://leetcode.com/problems/find-all-good-indices) — same pattern: Prefix Sum
- [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i) — same pattern: Prefix Sum
- [Find the Count of Monotonic Pairs II](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii) — same pattern: Prefix Sum
- [Maximum Strength of K Disjoint Subarrays — LeetCode](https://leetcode.com/problems/maximum-strength-of-k-disjoint-subarrays) — problem page
