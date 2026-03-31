---
layout: page
title: "Bitwise OR of All Subsequence Sums"
difficulty: Medium
category: Array
tags: [Array, Math, Bit Manipulation, Brainteaser, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/bitwise-or-of-all-subsequence-sums"
---

# Bitwise OR of All Subsequence Sums / Bitwise OR of All Subsequence Sums

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Chalkboard XOR Game](https://leetcode.com/problems/chalkboard-xor-game) | [Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Bitwise OR of All Subsequence Sums example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Bitwise OR of All Subsequence Sums. ([LeetCode](https://leetcode.com/problems/bitwise-or-of-all-subsequence-sums))

Difficulty: Medium | Acceptance: 64.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/bitwise-or-of-all-subsequence-sums) for full constraints

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
function bitwiseOrOfAllSubsequenceSumsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function bitwiseOrOfAllSubsequenceSums(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(bitwiseOrOfAllSubsequenceSums(/* example 1 */)); // expected
// console.log(bitwiseOrOfAllSubsequenceSums(/* example 2 */)); // expected
// console.log(bitwiseOrOfAllSubsequenceSums(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Chalkboard XOR Game](https://leetcode.com/problems/chalkboard-xor-game) — same pattern: Bit Manipulation
- [Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight) — same pattern: Prefix Sum
- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays) — same pattern: Sliding Window
- [Bitwise OR of All Subsequence Sums — LeetCode](https://leetcode.com/problems/bitwise-or-of-all-subsequence-sums) — problem page
