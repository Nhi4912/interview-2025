---
layout: page
title: "Number of Subarrays That Match a Pattern I"
difficulty: Medium
category: String
tags: [Array, Rolling Hash, String Matching, Hash Function]
leetcode_url: "https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-i"
---

# Number of Subarrays That Match a Pattern I / Number of Subarrays That Match a Pattern I

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: String Matching
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii) | [Number of Subarrays That Match a Pattern II](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tìm pattern trong text — KMP, Rabin-Karp, hoặc Z-algorithm cho O(n+m) thay vì O(n*m) brute force.

**Pattern Recognition:**

- Signal: "find pattern in text" → **String Matching (KMP/Rabin-Karp)**
- Bài này thuộc dạng String Matching — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of Subarrays That Match a Pattern I example:**

```
// TODO: Add step-by-step visual for String Matching
// Show one complete example with state at each step
```

---

## Problem Description

Number of Subarrays That Match a Pattern I. ([LeetCode](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-i))

Difficulty: Medium | Acceptance: 66.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-i) for full constraints

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
function numberOfSubarraysThatMatchAPatternIBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — String Matching
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfSubarraysThatMatchAPatternI(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using String Matching
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfSubarraysThatMatchAPatternI(/* example 1 */)); // expected
// console.log(numberOfSubarraysThatMatchAPatternI(/* example 2 */)); // expected
// console.log(numberOfSubarraysThatMatchAPatternI(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii) — same pattern: Trie
- [Number of Subarrays That Match a Pattern II](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-ii) — same pattern: String Matching
- [Count Prefix and Suffix Pairs I](https://leetcode.com/problems/count-prefix-and-suffix-pairs-i) — same pattern: Trie
- [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome) — same pattern: String Matching
- [Number of Subarrays That Match a Pattern I — LeetCode](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-i) — problem page
