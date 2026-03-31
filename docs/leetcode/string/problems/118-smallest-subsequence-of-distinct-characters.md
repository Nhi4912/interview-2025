---
layout: page
title: "Smallest Subsequence of Distinct Characters"
difficulty: Medium
category: String
tags: [String, Stack, Greedy, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/smallest-subsequence-of-distinct-characters"
---

# Smallest Subsequence of Distinct Characters / Smallest Subsequence of Distinct Characters

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Remove K Digits](https://leetcode.com/problems/remove-k-digits) | [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống dãy núi — giữ stack luôn đơn điệu (tăng hoặc giảm). Khi gặp phần tử phá vỡ tính đơn điệu, ta biết ngay đáp án cho các phần tử trước đó.

**Pattern Recognition:**

- Signal: "next greater/smaller element" → **Monotonic Stack**
- Bài này thuộc dạng Monotonic Stack — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Smallest Subsequence of Distinct Characters example:**

```
arr = [2, 1, 5, 6, 2, 3]
stack (indices): []

i=0: push 0         stack=[0]          (vals: [2])
i=1: 1<2 → push     stack=[0,1]        (vals: [2,1])
i=2: 5>1 → pop, process; 5>2 → pop, process
     push           stack=[2]          (vals: [5])
...
```

---

## Problem Description

Smallest Subsequence of Distinct Characters. ([LeetCode](https://leetcode.com/problems/smallest-subsequence-of-distinct-characters))

Difficulty: Medium | Acceptance: 62.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/smallest-subsequence-of-distinct-characters) for full constraints

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
function smallestSubsequenceOfDistinctCharactersBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Monotonic Stack
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function smallestSubsequenceOfDistinctCharacters(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Monotonic Stack
  // Hint: Maintain monotonic property, pop when new element breaks it
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(smallestSubsequenceOfDistinctCharacters(/* example 1 */)); // expected
// console.log(smallestSubsequenceOfDistinctCharacters(/* example 2 */)); // expected
// console.log(smallestSubsequenceOfDistinctCharacters(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Remove K Digits](https://leetcode.com/problems/remove-k-digits) — same pattern: Monotonic Stack
- [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters) — same pattern: Monotonic Stack
- [Smallest K-Length Subsequence With Occurrences of a Letter](https://leetcode.com/problems/smallest-k-length-subsequence-with-occurrences-of-a-letter) — same pattern: Monotonic Stack
- [Minimum Number of Swaps to Make the String Balanced](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced) — same pattern: Two Pointers
- [Smallest Subsequence of Distinct Characters — LeetCode](https://leetcode.com/problems/smallest-subsequence-of-distinct-characters) — problem page
