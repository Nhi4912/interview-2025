---
layout: page
title: "Reverse Substrings Between Each Pair of Parentheses"
difficulty: Medium
category: String
tags: [String, Stack]
leetcode_url: "https://leetcode.com/problems/reverse-substrings-between-each-pair-of-parentheses"
---

# Reverse Substrings Between Each Pair of Parentheses / Reverse Substrings Between Each Pair of Parentheses

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Decode String](https://leetcode.com/problems/decode-string) | [Simplify Path](https://leetcode.com/problems/simplify-path)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chồng đĩa — đĩa nào đặt cuối cùng sẽ được lấy ra đầu tiên (LIFO). Nhiều bài toán về matching và nesting dùng stack.

**Pattern Recognition:**

- Signal: "matching/nesting" + "most recent element" → **Stack**
- Bài này thuộc dạng Stack — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Reverse Substrings Between Each Pair of Parentheses example:**

```
stack = []

push/pop from right →
Process: scan left to right, stack maintains invariant
```

---

## Problem Description

Reverse Substrings Between Each Pair of Parentheses. ([LeetCode](https://leetcode.com/problems/reverse-substrings-between-each-pair-of-parentheses))

Difficulty: Medium | Acceptance: 71.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/reverse-substrings-between-each-pair-of-parentheses) for full constraints

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
function reverseSubstringsBetweenEachPairOfParenthesesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Stack
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function reverseSubstringsBetweenEachPairOfParentheses(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Stack
  // Hint: Push/pop to maintain invariant, process when stack condition changes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(reverseSubstringsBetweenEachPairOfParentheses(/* example 1 */)); // expected
// console.log(reverseSubstringsBetweenEachPairOfParentheses(/* example 2 */)); // expected
// console.log(reverseSubstringsBetweenEachPairOfParentheses(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Decode String](https://leetcode.com/problems/decode-string) — same pattern: Stack
- [Simplify Path](https://leetcode.com/problems/simplify-path) — same pattern: Stack
- [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii) — same pattern: Stack
- [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses) — same pattern: Dynamic Programming
- [Reverse Substrings Between Each Pair of Parentheses — LeetCode](https://leetcode.com/problems/reverse-substrings-between-each-pair-of-parentheses) — problem page
