---
layout: page
title: "Apply Bitwise Operations to Make Strings Equal"
difficulty: Medium
category: String
tags: [String, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/apply-bitwise-operations-to-make-strings-equal"
---

# Apply Bitwise Operations to Make Strings Equal / Apply Bitwise Operations to Make Strings Equal

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Add Binary](https://leetcode.com/problems/add-binary) | [Palindrome Permutation](https://leetcode.com/problems/palindrome-permutation)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Làm việc trực tiếp với bit (0/1) — nhanh hơn phép toán thông thường. XOR, AND, OR, shift là các công cụ chính.

**Pattern Recognition:**

- Signal: "binary representation" + "XOR/AND/OR properties" → **Bit Manipulation**
- Bài này thuộc dạng Bit Manipulation — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Apply Bitwise Operations to Make Strings Equal example:**

```
// TODO: Add step-by-step visual for Bit Manipulation
// Show one complete example with state at each step
```

---

## Problem Description

Apply Bitwise Operations to Make Strings Equal. ([LeetCode](https://leetcode.com/problems/apply-bitwise-operations-to-make-strings-equal))

Difficulty: Medium | Acceptance: 41.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/apply-bitwise-operations-to-make-strings-equal) for full constraints

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
function applyBitwiseOperationsToMakeStringsEqualBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Bit Manipulation
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function applyBitwiseOperationsToMakeStringsEqual(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Bit Manipulation
  // Hint: Use XOR, AND, OR, shift operations on bits
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(applyBitwiseOperationsToMakeStringsEqual(/* example 1 */)); // expected
// console.log(applyBitwiseOperationsToMakeStringsEqual(/* example 2 */)); // expected
// console.log(applyBitwiseOperationsToMakeStringsEqual(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Add Binary](https://leetcode.com/problems/add-binary) — same pattern: Bit Manipulation
- [Palindrome Permutation](https://leetcode.com/problems/palindrome-permutation) — same pattern: Bit Manipulation
- [Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences) — same pattern: Sliding Window
- [IP to CIDR](https://leetcode.com/problems/ip-to-cidr) — same pattern: Bit Manipulation
- [Apply Bitwise Operations to Make Strings Equal — LeetCode](https://leetcode.com/problems/apply-bitwise-operations-to-make-strings-equal) — problem page
