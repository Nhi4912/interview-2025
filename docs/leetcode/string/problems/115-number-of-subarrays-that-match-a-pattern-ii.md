---
layout: page
title: "Number of Subarrays That Match a Pattern II"
difficulty: Hard
category: String
tags: [Array, Rolling Hash, String Matching, Hash Function]
leetcode_url: "https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-ii"
---

# Number of Subarrays That Match a Pattern II / Number of Subarrays That Match a Pattern II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: String Matching
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Number of Subarrays That Match a Pattern I](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-i) | [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tìm pattern trong text — KMP, Rabin-Karp, hoặc Z-algorithm cho O(n+m) thay vì O(n*m) brute force.

**Pattern Recognition:**

- Signal: "find pattern in text" → **String Matching (KMP/Rabin-Karp)**
- Bài này thuộc dạng String Matching — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of Subarrays That Match a Pattern II example:**

```
// TODO: Add step-by-step visual for String Matching
// Show one complete example with state at each step
```

---

## Problem Description

Number of Subarrays That Match a Pattern II. ([LeetCode](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-ii))

Difficulty: Hard | Acceptance: 32.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-ii) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Xác nhận input constraints, edge cases" / Confirm input size, types, edge cases with interviewer
2. **Brute force**: "Bắt đầu từ brute force, rồi optimize" / Always start with naive approach, then optimize
3. **Optimize**: "Phân tích bottleneck của brute force, tìm cách giảm" / Identify the bottleneck and reduce it
4. **Edge cases**: "Input rỗng, một phần tử, giá trị cực biên" / Empty input, single element, boundary values
5. **Follow-up**: "Nếu input rất lớn? Nếu cần streaming?" / What if input is huge? What about streaming?

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfSubarraysThatMatchAPatternIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — String Matching
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfSubarraysThatMatchAPatternIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using String Matching
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfSubarraysThatMatchAPatternIi(/* example 1 */)); // expected
// console.log(numberOfSubarraysThatMatchAPatternIi(/* example 2 */)); // expected
// console.log(numberOfSubarraysThatMatchAPatternIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Number of Subarrays That Match a Pattern I](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-i) — same pattern: String Matching
- [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii) — same pattern: Trie
- [Count Prefix and Suffix Pairs I](https://leetcode.com/problems/count-prefix-and-suffix-pairs-i) — same pattern: Trie
- [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome) — same pattern: String Matching
- [Number of Subarrays That Match a Pattern II — LeetCode](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-ii) — problem page
