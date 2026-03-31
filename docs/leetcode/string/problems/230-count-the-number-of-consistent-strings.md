---
layout: page
title: "Count the Number of Consistent Strings"
difficulty: Easy
category: String
tags: [Array, Hash Table, String, Bit Manipulation, Counting]
leetcode_url: "https://leetcode.com/problems/count-the-number-of-consistent-strings"
---

# Count the Number of Consistent Strings / Count the Number of Consistent Strings

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Count Pairs Of Similar Strings](https://leetcode.com/problems/count-pairs-of-similar-strings) | [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Làm việc trực tiếp với bit (0/1) — nhanh hơn phép toán thông thường. XOR, AND, OR, shift là các công cụ chính.

**Pattern Recognition:**

- Signal: "binary representation" + "XOR/AND/OR properties" → **Bit Manipulation**
- Bài này thuộc dạng Bit Manipulation — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Count the Number of Consistent Strings example:**

```
// TODO: Add step-by-step visual for Bit Manipulation
// Show one complete example with state at each step
```

---

## Problem Description

Count the Number of Consistent Strings. ([LeetCode](https://leetcode.com/problems/count-the-number-of-consistent-strings))

Difficulty: Easy | Acceptance: 88.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/count-the-number-of-consistent-strings) for full constraints

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
function countTheNumberOfConsistentStringsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Bit Manipulation
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function countTheNumberOfConsistentStrings(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Bit Manipulation
  // Hint: Use XOR, AND, OR, shift operations on bits
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(countTheNumberOfConsistentStrings(/* example 1 */)); // expected
// console.log(countTheNumberOfConsistentStrings(/* example 2 */)); // expected
// console.log(countTheNumberOfConsistentStrings(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Count Pairs Of Similar Strings](https://leetcode.com/problems/count-pairs-of-similar-strings) — same pattern: Bit Manipulation
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Subdomain Visit Count](https://leetcode.com/problems/subdomain-visit-count) — same pattern: Hash Map
- [Rank Teams by Votes](https://leetcode.com/problems/rank-teams-by-votes) — same pattern: Sorting
- [Count the Number of Consistent Strings — LeetCode](https://leetcode.com/problems/count-the-number-of-consistent-strings) — problem page
