---
layout: page
title: "Intersection of Two Arrays"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Two Pointers, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/intersection-of-two-arrays"
---

# Intersection of Two Arrays / Intersection of Two Arrays

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 12 companies
> **See also**: [Maximum Total Damage With Spell Casting](https://leetcode.com/problems/maximum-total-damage-with-spell-casting) | [K-diff Pairs in an Array](https://leetcode.com/problems/k-diff-pairs-in-an-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Intersection of Two Arrays example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Intersection of Two Arrays. ([LeetCode](https://leetcode.com/problems/intersection-of-two-arrays))

Difficulty: Easy | Acceptance: 76.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/intersection-of-two-arrays) for full constraints

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
function intersectionOfTwoArraysBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function intersectionOfTwoArrays(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(intersectionOfTwoArrays(/* example 1 */)); // expected
// console.log(intersectionOfTwoArrays(/* example 2 */)); // expected
// console.log(intersectionOfTwoArrays(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Maximum Total Damage With Spell Casting](https://leetcode.com/problems/maximum-total-damage-with-spell-casting) — same pattern: Two Pointers
- [K-diff Pairs in an Array](https://leetcode.com/problems/k-diff-pairs-in-an-array) — same pattern: Two Pointers
- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Longest String Chain](https://leetcode.com/problems/longest-string-chain) — same pattern: Two Pointers
- [Intersection of Two Arrays — LeetCode](https://leetcode.com/problems/intersection-of-two-arrays) — problem page
