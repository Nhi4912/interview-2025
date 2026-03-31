---
layout: page
title: "Expressive Words"
difficulty: Medium
category: String
tags: [Array, Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/expressive-words"
---

# Expressive Words / Expressive Words

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest String Chain](https://leetcode.com/problems/longest-string-chain) | [Shortest Word Distance II](https://leetcode.com/problems/shortest-word-distance-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Expressive Words example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Expressive Words. ([LeetCode](https://leetcode.com/problems/expressive-words))

Difficulty: Medium | Acceptance: 46.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/expressive-words) for full constraints

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
function expressiveWordsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function expressiveWords(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(expressiveWords(/* example 1 */)); // expected
// console.log(expressiveWords(/* example 2 */)); // expected
// console.log(expressiveWords(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Longest String Chain](https://leetcode.com/problems/longest-string-chain) — same pattern: Two Pointers
- [Shortest Word Distance II](https://leetcode.com/problems/shortest-word-distance-ii) — same pattern: Two Pointers
- [Maximum Number of Removable Characters](https://leetcode.com/problems/maximum-number-of-removable-characters) — same pattern: Two Pointers
- [Camelcase Matching](https://leetcode.com/problems/camelcase-matching) — same pattern: Trie
- [Expressive Words — LeetCode](https://leetcode.com/problems/expressive-words) — problem page
