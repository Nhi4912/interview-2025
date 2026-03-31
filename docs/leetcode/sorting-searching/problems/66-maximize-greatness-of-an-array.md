---
layout: page
title: "Maximize Greatness of an Array"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximize-greatness-of-an-array"
---

# Maximize Greatness of an Array / Maximize Greatness of an Array

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Boats to Save People](https://leetcode.com/problems/boats-to-save-people) | [Maximum Number of Tasks You Can Assign](https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximize Greatness of an Array example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Maximize Greatness of an Array. ([LeetCode](https://leetcode.com/problems/maximize-greatness-of-an-array))

Difficulty: Medium | Acceptance: 58.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximize-greatness-of-an-array) for full constraints

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
function maximizeGreatnessOfAnArrayBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximizeGreatnessOfAnArray(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximizeGreatnessOfAnArray(/* example 1 */)); // expected
// console.log(maximizeGreatnessOfAnArray(/* example 2 */)); // expected
// console.log(maximizeGreatnessOfAnArray(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Boats to Save People](https://leetcode.com/problems/boats-to-save-people) — same pattern: Two Pointers
- [Maximum Number of Tasks You Can Assign](https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign) — same pattern: Monotonic Queue
- [Assign Cookies](https://leetcode.com/problems/assign-cookies) — same pattern: Two Pointers
- [Most Profit Assigning Work](https://leetcode.com/problems/most-profit-assigning-work) — same pattern: Two Pointers
- [Maximize Greatness of an Array — LeetCode](https://leetcode.com/problems/maximize-greatness-of-an-array) — problem page
