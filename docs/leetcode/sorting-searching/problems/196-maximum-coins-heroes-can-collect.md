---
layout: page
title: "Maximum Coins Heroes Can Collect"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Sorting, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-coins-heroes-can-collect"
---

# Maximum Coins Heroes Can Collect / Maximum Coins Heroes Can Collect

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximum Total Beauty of the Gardens](https://leetcode.com/problems/maximum-total-beauty-of-the-gardens) | [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Coins Heroes Can Collect example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Maximum Coins Heroes Can Collect. ([LeetCode](https://leetcode.com/problems/maximum-coins-heroes-can-collect))

Difficulty: Medium | Acceptance: 68.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-coins-heroes-can-collect) for full constraints

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
function maximumCoinsHeroesCanCollectBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumCoinsHeroesCanCollect(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumCoinsHeroesCanCollect(/* example 1 */)); // expected
// console.log(maximumCoinsHeroesCanCollect(/* example 2 */)); // expected
// console.log(maximumCoinsHeroesCanCollect(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Maximum Total Beauty of the Gardens](https://leetcode.com/problems/maximum-total-beauty-of-the-gardens) — same pattern: Two Pointers
- [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays) — same pattern: Two Pointers
- [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom) — same pattern: Prefix Sum
- [Heaters](https://leetcode.com/problems/heaters) — same pattern: Two Pointers
- [Maximum Coins Heroes Can Collect — LeetCode](https://leetcode.com/problems/maximum-coins-heroes-can-collect) — problem page
