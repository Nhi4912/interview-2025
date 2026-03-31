---
layout: page
title: "Find Indices With Index and Value Difference II"
difficulty: Medium
category: Array
tags: [Array, Two Pointers]
leetcode_url: "https://leetcode.com/problems/find-indices-with-index-and-value-difference-ii"
---

# Find Indices With Index and Value Difference II / Find Indices With Index and Value Difference II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Next Permutation](https://leetcode.com/problems/next-permutation) | [4Sum](https://leetcode.com/problems/4sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find Indices With Index and Value Difference II example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Find Indices With Index and Value Difference II. ([LeetCode](https://leetcode.com/problems/find-indices-with-index-and-value-difference-ii))

Difficulty: Medium | Acceptance: 31.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-indices-with-index-and-value-difference-ii) for full constraints

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
function findIndicesWithIndexAndValueDifferenceIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findIndicesWithIndexAndValueDifferenceIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findIndicesWithIndexAndValueDifferenceIi(/* example 1 */)); // expected
// console.log(findIndicesWithIndexAndValueDifferenceIi(/* example 2 */)); // expected
// console.log(findIndicesWithIndexAndValueDifferenceIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Next Permutation](https://leetcode.com/problems/next-permutation) — same pattern: Two Pointers
- [4Sum](https://leetcode.com/problems/4sum) — same pattern: Two Pointers
- [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays) — same pattern: Two Pointers
- [3Sum Closest](https://leetcode.com/problems/3sum-closest) — same pattern: Two Pointers
- [Find Indices With Index and Value Difference II — LeetCode](https://leetcode.com/problems/find-indices-with-index-and-value-difference-ii) — problem page
