---
layout: page
title: "Existence of a Substring in a String and Its Reverse"
difficulty: Easy
category: String
tags: [Hash Table, String]
leetcode_url: "https://leetcode.com/problems/existence-of-a-substring-in-a-string-and-its-reverse"
---

# Existence of a Substring in a String and Its Reverse / Existence of a Substring in a String and Its Reverse

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) | [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống từ điển — tra cứu tức thì O(1). Đổi space lấy time, lưu thông tin đã thấy để tránh tìm lại.

**Pattern Recognition:**

- Signal: "find complement/match in O(1)" → **Hash Map**
- Bài này thuộc dạng Hash Map — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Existence of a Substring in a String and Its Reverse example:**

```
Scan array:
i=0: num=2, need=target-2=7 → not in map → map={2:0}
i=1: num=7, need=target-7=2 → found in map! → return [map[2], 1] ✅

Key insight: store complement for O(1) lookup
```

---

## Problem Description

Existence of a Substring in a String and Its Reverse. ([LeetCode](https://leetcode.com/problems/existence-of-a-substring-in-a-string-and-its-reverse))

Difficulty: Easy | Acceptance: 65.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/existence-of-a-substring-in-a-string-and-its-reverse) for full constraints

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
function existenceOfASubstringInAStringAndItsReverseBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Hash Map
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function existenceOfASubstringInAStringAndItsReverse(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Hash Map
  // Hint: Store seen values for O(1) lookup of complement/match
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(existenceOfASubstringInAStringAndItsReverse(/* example 1 */)); // expected
// console.log(existenceOfASubstringInAStringAndItsReverse(/* example 2 */)); // expected
// console.log(existenceOfASubstringInAStringAndItsReverse(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) — same pattern: Binary Search
- [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree) — same pattern: Trie
- [Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings) — same pattern: Hash Map
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Existence of a Substring in a String and Its Reverse — LeetCode](https://leetcode.com/problems/existence-of-a-substring-in-a-string-and-its-reverse) — problem page
