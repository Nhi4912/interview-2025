---
layout: page
title: "Partition Array Into Two Arrays to Minimize Sum Difference"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Two Pointers, Binary Search, Dynamic Programming, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference"
---

# Partition Array Into Two Arrays to Minimize Sum Difference / Partition Array Into Two Arrays to Minimize Sum Difference

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum) | [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Partition Array Into Two Arrays to Minimize Sum Difference example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Partition Array Into Two Arrays to Minimize Sum Difference. ([LeetCode](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference))

Difficulty: Hard | Acceptance: 21.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Mảng đã sorted chưa? Có duplicate không?" / Ask if array is sorted and if duplicates exist
2. **Brute force**: "Dùng 2 vòng for O(n²)" → optimize with two pointers O(n) / Start with nested loops, then optimize
3. **Optimize**: "Vì mảng sorted, dùng 2 con trỏ L/R tiến vào giữa" / Since sorted, use L/R pointers moving inward
4. **Edge cases**: "Mảng rỗng, một phần tử, tất cả giống nhau" / Empty array, single element, all same values

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function partitionArrayIntoTwoArraysToMinimizeSumDifferenceBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function partitionArrayIntoTwoArraysToMinimizeSumDifference(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(partitionArrayIntoTwoArraysToMinimizeSumDifference(/* example 1 */)); // expected
// console.log(partitionArrayIntoTwoArraysToMinimizeSumDifference(/* example 2 */)); // expected
// console.log(partitionArrayIntoTwoArraysToMinimizeSumDifference(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum) — same pattern: Two Pointers
- [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number) — same pattern: Two Pointers
- [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement) — same pattern: Backtracking
- [Optimal Account Balancing](https://leetcode.com/problems/optimal-account-balancing) — same pattern: Backtracking
- [Partition Array Into Two Arrays to Minimize Sum Difference — LeetCode](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference) — problem page
