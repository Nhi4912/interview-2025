---
layout: page
title: "Number of Wonderful Substrings"
difficulty: Medium
category: String
tags: [Hash Table, String, Bit Manipulation, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/number-of-wonderful-substrings"
---

# Number of Wonderful Substrings / Number of Wonderful Substrings

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring) | [Number of Divisible Substrings](https://leetcode.com/problems/number-of-divisible-substrings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of Wonderful Substrings example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Number of Wonderful Substrings. ([LeetCode](https://leetcode.com/problems/number-of-wonderful-substrings))

Difficulty: Medium | Acceptance: 66.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-wonderful-substrings) for full constraints

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
function numberOfWonderfulSubstringsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfWonderfulSubstrings(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfWonderfulSubstrings(/* example 1 */)); // expected
// console.log(numberOfWonderfulSubstrings(/* example 2 */)); // expected
// console.log(numberOfWonderfulSubstrings(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring) — same pattern: Prefix Sum
- [Number of Divisible Substrings](https://leetcode.com/problems/number-of-divisible-substrings) — same pattern: Prefix Sum
- [Palindrome Permutation](https://leetcode.com/problems/palindrome-permutation) — same pattern: Bit Manipulation
- [Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences) — same pattern: Sliding Window
- [Number of Wonderful Substrings — LeetCode](https://leetcode.com/problems/number-of-wonderful-substrings) — problem page
