---
layout: page
title: "Shortest Word Distance II"
difficulty: Medium
category: Design
tags: [Array, Hash Table, Two Pointers, String, Design]
leetcode_url: "https://leetcode.com/problems/shortest-word-distance-ii"
---

# Shortest Word Distance II / Shortest Word Distance II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Longest String Chain](https://leetcode.com/problems/longest-string-chain) | [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Shortest Word Distance II example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Shortest Word Distance II. ([LeetCode](https://leetcode.com/problems/shortest-word-distance-ii))

Difficulty: Medium | Acceptance: 62.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/shortest-word-distance-ii) for full constraints

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
function shortestWordDistanceIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function shortestWordDistanceIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(shortestWordDistanceIi(/* example 1 */)); // expected
// console.log(shortestWordDistanceIi(/* example 2 */)); // expected
// console.log(shortestWordDistanceIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Longest String Chain](https://leetcode.com/problems/longest-string-chain) — same pattern: Two Pointers
- [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula) — same pattern: Topological Sort
- [Dot Product of Two Sparse Vectors](https://leetcode.com/problems/dot-product-of-two-sparse-vectors) — same pattern: Two Pointers
- [Design a Food Rating System](https://leetcode.com/problems/design-a-food-rating-system) — same pattern: Heap / Priority Queue
- [Shortest Word Distance II — LeetCode](https://leetcode.com/problems/shortest-word-distance-ii) — problem page
