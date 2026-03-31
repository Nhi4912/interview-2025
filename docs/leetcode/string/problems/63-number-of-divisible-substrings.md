---
layout: page
title: "Number of Divisible Substrings"
difficulty: Medium
category: String
tags: [Hash Table, String, Counting, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/number-of-divisible-substrings"
---

# Number of Divisible Substrings / Number of Divisible Substrings

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Number of Same-End Substrings](https://leetcode.com/problems/number-of-same-end-substrings) | [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of Divisible Substrings example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Number of Divisible Substrings. ([LeetCode](https://leetcode.com/problems/number-of-divisible-substrings))

Difficulty: Medium | Acceptance: 73.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-divisible-substrings) for full constraints

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
function numberOfDivisibleSubstringsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfDivisibleSubstrings(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfDivisibleSubstrings(/* example 1 */)); // expected
// console.log(numberOfDivisibleSubstrings(/* example 2 */)); // expected
// console.log(numberOfDivisibleSubstrings(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Number of Same-End Substrings](https://leetcode.com/problems/number-of-same-end-substrings) — same pattern: Prefix Sum
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Reorganize String](https://leetcode.com/problems/reorganize-string) — same pattern: Heap / Priority Queue
- [Ransom Note](https://leetcode.com/problems/ransom-note) — same pattern: Hash Map
- [Number of Divisible Substrings — LeetCode](https://leetcode.com/problems/number-of-divisible-substrings) — problem page
