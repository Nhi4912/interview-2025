---
layout: page
title: "Check if a Parentheses String Can Be Valid"
difficulty: Medium
category: String
tags: [String, Stack, Greedy]
leetcode_url: "https://leetcode.com/problems/check-if-a-parentheses-string-can-be-valid"
---

# Check if a Parentheses String Can Be Valid / Check if a Parentheses String Can Be Valid

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Remove K Digits](https://leetcode.com/problems/remove-k-digits) | [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chồng đĩa — đĩa nào đặt cuối cùng sẽ được lấy ra đầu tiên (LIFO). Nhiều bài toán về matching và nesting dùng stack.

**Pattern Recognition:**

- Signal: "matching/nesting" + "most recent element" → **Stack**
- Bài này thuộc dạng Stack — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Check if a Parentheses String Can Be Valid example:**

```
stack = []

push/pop from right →
Process: scan left to right, stack maintains invariant
```

---

## Problem Description

Check if a Parentheses String Can Be Valid. ([LeetCode](https://leetcode.com/problems/check-if-a-parentheses-string-can-be-valid))

Difficulty: Medium | Acceptance: 44.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/check-if-a-parentheses-string-can-be-valid) for full constraints

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
function checkIfAParenthesesStringCanBeValidBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Stack
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function checkIfAParenthesesStringCanBeValid(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Stack
  // Hint: Push/pop to maintain invariant, process when stack condition changes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(checkIfAParenthesesStringCanBeValid(/* example 1 */)); // expected
// console.log(checkIfAParenthesesStringCanBeValid(/* example 2 */)); // expected
// console.log(checkIfAParenthesesStringCanBeValid(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Remove K Digits](https://leetcode.com/problems/remove-k-digits) — same pattern: Monotonic Stack
- [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters) — same pattern: Monotonic Stack
- [Minimum Number of Swaps to Make the String Balanced](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced) — same pattern: Two Pointers
- [Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string) — same pattern: Dynamic Programming
- [Check if a Parentheses String Can Be Valid — LeetCode](https://leetcode.com/problems/check-if-a-parentheses-string-can-be-valid) — problem page
