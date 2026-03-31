---
layout: page
title: "Encode and Decode TinyURL"
difficulty: Medium
category: Design
tags: [Hash Table, String, Design, Hash Function]
leetcode_url: "https://leetcode.com/problems/encode-and-decode-tinyurl"
---

# Encode and Decode TinyURL / Encode and Decode TinyURL

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Design
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) | [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bài Design yêu cầu xây dựng cấu trúc dữ liệu — quan trọng là chọn đúng cấu trúc nền và đảm bảo các operations đạt complexity yêu cầu.

**Pattern Recognition:**

- Signal: "implement class with specific API" → **Design**
- Bài này thuộc dạng Design — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Encode and Decode TinyURL example:**

```
// TODO: Add step-by-step visual for Design
// Show one complete example with state at each step
```

---

## Problem Description

Encode and Decode TinyURL. ([LeetCode](https://leetcode.com/problems/encode-and-decode-tinyurl))

Difficulty: Medium | Acceptance: 86.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/encode-and-decode-tinyurl) for full constraints

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
function encodeAndDecodeTinyurlBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Design
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function encodeAndDecodeTinyurl(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Design
  // Hint: Choose right data structure combination for required operations
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(encodeAndDecodeTinyurl(/* example 1 */)); // expected
// console.log(encodeAndDecodeTinyurl(/* example 2 */)); // expected
// console.log(encodeAndDecodeTinyurl(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) — same pattern: Binary Search
- [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree) — same pattern: Trie
- [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system) — same pattern: Trie
- [Design HashMap](https://leetcode.com/problems/design-hashmap) — same pattern: Linked List
- [Encode and Decode TinyURL — LeetCode](https://leetcode.com/problems/encode-and-decode-tinyurl) — problem page
