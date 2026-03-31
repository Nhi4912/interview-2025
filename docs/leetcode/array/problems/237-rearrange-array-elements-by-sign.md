---
layout: page
title: "Rearrange Array Elements by Sign"
difficulty: Medium
category: Array
tags: [Array, Two Pointers, Simulation]
leetcode_url: "https://leetcode.com/problems/rearrange-array-elements-by-sign"
---

# Rearrange Array Elements by Sign / Rearrange Array Elements by Sign

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Candy Crush](https://leetcode.com/problems/candy-crush) | [Total Cost to Hire K Workers](https://leetcode.com/problems/total-cost-to-hire-k-workers)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Rearrange Array Elements by Sign example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Rearrange Array Elements by Sign. ([LeetCode](https://leetcode.com/problems/rearrange-array-elements-by-sign))

Difficulty: Medium | Acceptance: 84.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/rearrange-array-elements-by-sign) for full constraints

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
function rearrangeArrayElementsBySignBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function rearrangeArrayElementsBySign(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(rearrangeArrayElementsBySign(/* example 1 */)); // expected
// console.log(rearrangeArrayElementsBySign(/* example 2 */)); // expected
// console.log(rearrangeArrayElementsBySign(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Candy Crush](https://leetcode.com/problems/candy-crush) — same pattern: Two Pointers
- [Total Cost to Hire K Workers](https://leetcode.com/problems/total-cost-to-hire-k-workers) — same pattern: Two Pointers
- [Find the Array Concatenation Value](https://leetcode.com/problems/find-the-array-concatenation-value) — same pattern: Two Pointers
- [Flipping an Image](https://leetcode.com/problems/flipping-an-image) — same pattern: Two Pointers
- [Rearrange Array Elements by Sign — LeetCode](https://leetcode.com/problems/rearrange-array-elements-by-sign) — problem page
