---
layout: page
title: "Max Number of K-Sum Pairs"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/max-number-of-k-sum-pairs"
---

# Max Number of K-Sum Pairs / Max Number of K-Sum Pairs

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays) | [Longest String Chain](https://leetcode.com/problems/longest-string-chain)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Max Number of K-Sum Pairs example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Max Number of K-Sum Pairs. ([LeetCode](https://leetcode.com/problems/max-number-of-k-sum-pairs))

Difficulty: Medium | Acceptance: 56.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/max-number-of-k-sum-pairs) for full constraints

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
function maxNumberOfKSumPairsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maxNumberOfKSumPairs(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maxNumberOfKSumPairs(/* example 1 */)); // expected
// console.log(maxNumberOfKSumPairs(/* example 2 */)); // expected
// console.log(maxNumberOfKSumPairs(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays) — same pattern: Two Pointers
- [Longest String Chain](https://leetcode.com/problems/longest-string-chain) — same pattern: Two Pointers
- [Divide Players Into Teams of Equal Skill](https://leetcode.com/problems/divide-players-into-teams-of-equal-skill) — same pattern: Two Pointers
- [Maximum Total Damage With Spell Casting](https://leetcode.com/problems/maximum-total-damage-with-spell-casting) — same pattern: Two Pointers
- [Max Number of K-Sum Pairs — LeetCode](https://leetcode.com/problems/max-number-of-k-sum-pairs) — problem page
