---
layout: page
title: "Unique Substrings With Equal Digit Frequency"
difficulty: Medium
category: String
tags: [Hash Table, String, Rolling Hash, Counting, Hash Function]
leetcode_url: "https://leetcode.com/problems/unique-substrings-with-equal-digit-frequency"
---

# Unique Substrings With Equal Digit Frequency / Unique Substrings With Equal Digit Frequency

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: String Matching
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences) | [Strings Differ by One Character](https://leetcode.com/problems/strings-differ-by-one-character)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tìm pattern trong text — KMP, Rabin-Karp, hoặc Z-algorithm cho O(n+m) thay vì O(n*m) brute force.

**Pattern Recognition:**

- Signal: "find pattern in text" → **String Matching (KMP/Rabin-Karp)**
- Bài này thuộc dạng String Matching — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Unique Substrings With Equal Digit Frequency example:**

```
// TODO: Add step-by-step visual for String Matching
// Show one complete example with state at each step
```

---

## Problem Description

Unique Substrings With Equal Digit Frequency. ([LeetCode](https://leetcode.com/problems/unique-substrings-with-equal-digit-frequency))

Difficulty: Medium | Acceptance: 64.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/unique-substrings-with-equal-digit-frequency) for full constraints

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
function uniqueSubstringsWithEqualDigitFrequencyBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — String Matching
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function uniqueSubstringsWithEqualDigitFrequency(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using String Matching
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(uniqueSubstringsWithEqualDigitFrequency(/* example 1 */)); // expected
// console.log(uniqueSubstringsWithEqualDigitFrequency(/* example 2 */)); // expected
// console.log(uniqueSubstringsWithEqualDigitFrequency(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences) — same pattern: Sliding Window
- [Strings Differ by One Character](https://leetcode.com/problems/strings-differ-by-one-character) — same pattern: String Matching
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Reorganize String](https://leetcode.com/problems/reorganize-string) — same pattern: Heap / Priority Queue
- [Unique Substrings With Equal Digit Frequency — LeetCode](https://leetcode.com/problems/unique-substrings-with-equal-digit-frequency) — problem page
