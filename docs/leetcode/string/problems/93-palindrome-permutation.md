---
layout: page
title: "Palindrome Permutation"
difficulty: Easy
category: String
tags: [Hash Table, String, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/palindrome-permutation"
---

# Palindrome Permutation / Palindrome Permutation

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences) | [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Làm việc trực tiếp với bit (0/1) — nhanh hơn phép toán thông thường. XOR, AND, OR, shift là các công cụ chính.

**Pattern Recognition:**

- Signal: "binary representation" + "XOR/AND/OR properties" → **Bit Manipulation**
- Bài này thuộc dạng Bit Manipulation — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Palindrome Permutation example:**

```
// TODO: Add step-by-step visual for Bit Manipulation
// Show one complete example with state at each step
```

---

## Problem Description

Palindrome Permutation. ([LeetCode](https://leetcode.com/problems/palindrome-permutation))

Difficulty: Easy | Acceptance: 68.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/palindrome-permutation) for full constraints

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
function palindromePermutationBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Bit Manipulation
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function palindromePermutation(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Bit Manipulation
  // Hint: Use XOR, AND, OR, shift operations on bits
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(palindromePermutation(/* example 1 */)); // expected
// console.log(palindromePermutation(/* example 2 */)); // expected
// console.log(palindromePermutation(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences) — same pattern: Sliding Window
- [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring) — same pattern: Prefix Sum
- [Number of Wonderful Substrings](https://leetcode.com/problems/number-of-wonderful-substrings) — same pattern: Prefix Sum
- [Find Longest Awesome Substring](https://leetcode.com/problems/find-longest-awesome-substring) — same pattern: Bit Manipulation
- [Palindrome Permutation — LeetCode](https://leetcode.com/problems/palindrome-permutation) — problem page
