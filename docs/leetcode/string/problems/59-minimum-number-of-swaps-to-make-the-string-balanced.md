---
layout: page
title: "Minimum Number of Swaps to Make the String Balanced"
difficulty: Medium
category: String
tags: [Two Pointers, String, Stack, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced"
---

# Minimum Number of Swaps to Make the String Balanced / Minimum Number of Swaps to Make the String Balanced

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Backspace String Compare](https://leetcode.com/problems/backspace-string-compare) | [Remove K Digits](https://leetcode.com/problems/remove-k-digits)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Number of Swaps to Make the String Balanced example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Minimum Number of Swaps to Make the String Balanced. ([LeetCode](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced))

Difficulty: Medium | Acceptance: 78.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced) for full constraints

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
function minimumNumberOfSwapsToMakeTheStringBalancedBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumNumberOfSwapsToMakeTheStringBalanced(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumNumberOfSwapsToMakeTheStringBalanced(/* example 1 */)); // expected
// console.log(minimumNumberOfSwapsToMakeTheStringBalanced(/* example 2 */)); // expected
// console.log(minimumNumberOfSwapsToMakeTheStringBalanced(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Backspace String Compare](https://leetcode.com/problems/backspace-string-compare) — same pattern: Two Pointers
- [Remove K Digits](https://leetcode.com/problems/remove-k-digits) — same pattern: Monotonic Stack
- [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters) — same pattern: Monotonic Stack
- [Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string) — same pattern: Dynamic Programming
- [Minimum Number of Swaps to Make the String Balanced — LeetCode](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced) — problem page
