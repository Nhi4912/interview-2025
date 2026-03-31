---
layout: page
title: "Find Beautiful Indices in the Given Array I"
difficulty: Medium
category: Sorting-Searching
tags: [Two Pointers, String, Binary Search, Rolling Hash, String Matching]
leetcode_url: "https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-i"
---

# Find Beautiful Indices in the Given Array I / Find Beautiful Indices in the Given Array I

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Find Beautiful Indices in the Given Array II](https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-ii) | [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find Beautiful Indices in the Given Array I example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Find Beautiful Indices in the Given Array I. ([LeetCode](https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-i))

Difficulty: Medium | Acceptance: 38.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-i) for full constraints

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
function findBeautifulIndicesInTheGivenArrayIBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findBeautifulIndicesInTheGivenArrayI(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findBeautifulIndicesInTheGivenArrayI(/* example 1 */)); // expected
// console.log(findBeautifulIndicesInTheGivenArrayI(/* example 2 */)); // expected
// console.log(findBeautifulIndicesInTheGivenArrayI(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Find Beautiful Indices in the Given Array II](https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-ii) — same pattern: Two Pointers
- [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome) — same pattern: String Matching
- [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii) — same pattern: Trie
- [Count Prefix and Suffix Pairs I](https://leetcode.com/problems/count-prefix-and-suffix-pairs-i) — same pattern: Trie
- [Find Beautiful Indices in the Given Array I — LeetCode](https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-i) — problem page
