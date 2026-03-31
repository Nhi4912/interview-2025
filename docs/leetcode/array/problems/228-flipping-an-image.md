---
layout: page
title: "Flipping an Image"
difficulty: Easy
category: Array
tags: [Array, Two Pointers, Bit Manipulation, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/flipping-an-image"
---

# Flipping an Image / Flipping an Image

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Candy Crush](https://leetcode.com/problems/candy-crush) | [Spiral Matrix](https://leetcode.com/problems/spiral-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Flipping an Image example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Flipping an Image. ([LeetCode](https://leetcode.com/problems/flipping-an-image))

Difficulty: Easy | Acceptance: 83.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/flipping-an-image) for full constraints

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
function flippingAnImageBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function flippingAnImage(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(flippingAnImage(/* example 1 */)); // expected
// console.log(flippingAnImage(/* example 2 */)); // expected
// console.log(flippingAnImage(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Candy Crush](https://leetcode.com/problems/candy-crush) — same pattern: Two Pointers
- [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) — same pattern: Matrix / Simulation
- [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii) — same pattern: Matrix / Simulation
- [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number) — same pattern: Two Pointers
- [Flipping an Image — LeetCode](https://leetcode.com/problems/flipping-an-image) — problem page
