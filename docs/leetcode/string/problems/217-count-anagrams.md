---
layout: page
title: "Count Anagrams"
difficulty: Hard
category: String
tags: [Hash Table, Math, String, Combinatorics, Counting]
leetcode_url: "https://leetcode.com/problems/count-anagrams"
---

# Count Anagrams / Count Anagrams

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Count the Number of Good Subsequences](https://leetcode.com/problems/count-the-number-of-good-subsequences) | [Right Triangles](https://leetcode.com/problems/right-triangles)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bài toán cần công thức hoặc tính chất toán học — không cần brute force nếu nhận ra pattern.

**Pattern Recognition:**

- Signal: "pattern/formula" + "number properties" → **Math**
- Bài này thuộc dạng Math — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Count Anagrams example:**

```
// TODO: Add step-by-step visual for Math
// Show one complete example with state at each step
```

---

## Problem Description

Count Anagrams. ([LeetCode](https://leetcode.com/problems/count-anagrams))

Difficulty: Hard | Acceptance: 35.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/count-anagrams) for full constraints

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
function countAnagramsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Math
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function countAnagrams(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Math
  // Hint: Find mathematical pattern or formula
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(countAnagrams(/* example 1 */)); // expected
// console.log(countAnagrams(/* example 2 */)); // expected
// console.log(countAnagrams(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Count the Number of Good Subsequences](https://leetcode.com/problems/count-the-number-of-good-subsequences) — same pattern: Math
- [Right Triangles](https://leetcode.com/problems/right-triangles) — same pattern: Math
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Reorganize String](https://leetcode.com/problems/reorganize-string) — same pattern: Heap / Priority Queue
- [Count Anagrams — LeetCode](https://leetcode.com/problems/count-anagrams) — problem page
