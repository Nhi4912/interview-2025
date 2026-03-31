---
layout: page
title: "Minimum Time to Revert Word to Initial State II"
difficulty: Hard
category: String
tags: [String, Rolling Hash, String Matching, Hash Function]
leetcode_url: "https://leetcode.com/problems/minimum-time-to-revert-word-to-initial-state-ii"
---

# Minimum Time to Revert Word to Initial State II / Minimum Time to Revert Word to Initial State II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: String Matching
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome) | [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tìm pattern trong text — KMP, Rabin-Karp, hoặc Z-algorithm cho O(n+m) thay vì O(n*m) brute force.

**Pattern Recognition:**

- Signal: "find pattern in text" → **String Matching (KMP/Rabin-Karp)**
- Bài này thuộc dạng String Matching — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Time to Revert Word to Initial State II example:**

```
// TODO: Add step-by-step visual for String Matching
// Show one complete example with state at each step
```

---

## Problem Description

Minimum Time to Revert Word to Initial State II. ([LeetCode](https://leetcode.com/problems/minimum-time-to-revert-word-to-initial-state-ii))

Difficulty: Hard | Acceptance: 34.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-time-to-revert-word-to-initial-state-ii) for full constraints

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
function minimumTimeToRevertWordToInitialStateIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — String Matching
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumTimeToRevertWordToInitialStateIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using String Matching
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumTimeToRevertWordToInitialStateIi(/* example 1 */)); // expected
// console.log(minimumTimeToRevertWordToInitialStateIi(/* example 2 */)); // expected
// console.log(minimumTimeToRevertWordToInitialStateIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome) — same pattern: String Matching
- [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii) — same pattern: Trie
- [Count Prefix and Suffix Pairs I](https://leetcode.com/problems/count-prefix-and-suffix-pairs-i) — same pattern: Trie
- [Find Beautiful Indices in the Given Array I](https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-i) — same pattern: Two Pointers
- [Minimum Time to Revert Word to Initial State II — LeetCode](https://leetcode.com/problems/minimum-time-to-revert-word-to-initial-state-ii) — problem page
