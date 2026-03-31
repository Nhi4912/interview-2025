---
layout: page
title: "Count Vowel Strings in Ranges"
difficulty: Medium
category: String
tags: [Array, String, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/count-vowel-strings-in-ranges"
---

# Count Vowel Strings in Ranges / Count Vowel Strings in Ranges

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring) | [Number of Same-End Substrings](https://leetcode.com/problems/number-of-same-end-substrings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Count Vowel Strings in Ranges example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Count Vowel Strings in Ranges. ([LeetCode](https://leetcode.com/problems/count-vowel-strings-in-ranges))

Difficulty: Medium | Acceptance: 67.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/count-vowel-strings-in-ranges) for full constraints

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
function countVowelStringsInRangesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function countVowelStringsInRanges(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(countVowelStringsInRanges(/* example 1 */)); // expected
// console.log(countVowelStringsInRanges(/* example 2 */)); // expected
// console.log(countVowelStringsInRanges(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring) — same pattern: Prefix Sum
- [Number of Same-End Substrings](https://leetcode.com/problems/number-of-same-end-substrings) — same pattern: Prefix Sum
- [Shifting Letters II](https://leetcode.com/problems/shifting-letters-ii) — same pattern: Prefix Sum
- [Text Justification](https://leetcode.com/problems/text-justification) — same pattern: Matrix / Simulation
- [Count Vowel Strings in Ranges — LeetCode](https://leetcode.com/problems/count-vowel-strings-in-ranges) — problem page
