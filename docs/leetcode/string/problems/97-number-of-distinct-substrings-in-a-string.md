---
layout: page
title: "Number of Distinct Substrings in a String"
difficulty: Medium
category: String
tags: [String, Trie, Rolling Hash, Suffix Array, Hash Function]
leetcode_url: "https://leetcode.com/problems/number-of-distinct-substrings-in-a-string"
---

# Number of Distinct Substrings in a String / Number of Distinct Substrings in a String

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii) | [Count Prefix and Suffix Pairs I](https://leetcode.com/problems/count-prefix-and-suffix-pairs-i)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cây thư mục — mỗi ký tự là một cấp. Tìm kiếm prefix cực nhanh O(L) với L là độ dài từ.

**Pattern Recognition:**

- Signal: "prefix search" + "dictionary of words" → **Trie**
- Bài này thuộc dạng Trie — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of Distinct Substrings in a String example:**

```
// TODO: Add step-by-step visual for Trie
// Show one complete example with state at each step
```

---

## Problem Description

Number of Distinct Substrings in a String. ([LeetCode](https://leetcode.com/problems/number-of-distinct-substrings-in-a-string))

Difficulty: Medium | Acceptance: 64.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-distinct-substrings-in-a-string) for full constraints

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
function numberOfDistinctSubstringsInAStringBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Trie
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfDistinctSubstringsInAString(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Trie
  // Hint: Build trie from dictionary, search by prefix
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfDistinctSubstringsInAString(/* example 1 */)); // expected
// console.log(numberOfDistinctSubstringsInAString(/* example 2 */)); // expected
// console.log(numberOfDistinctSubstringsInAString(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii) — same pattern: Trie
- [Count Prefix and Suffix Pairs I](https://leetcode.com/problems/count-prefix-and-suffix-pairs-i) — same pattern: Trie
- [Longest Repeating Substring](https://leetcode.com/problems/longest-repeating-substring) — same pattern: Dynamic Programming
- [Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring) — same pattern: Sliding Window
- [Number of Distinct Substrings in a String — LeetCode](https://leetcode.com/problems/number-of-distinct-substrings-in-a-string) — problem page
