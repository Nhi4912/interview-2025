---
layout: page
title: "Simplify Path"
difficulty: Medium
category: String
tags: [String, Stack]
leetcode_url: "https://leetcode.com/problems/simplify-path"
---

# Simplify Path / Simplify Path

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack
> **Frequency**: ⭐ Tier 2 — Gặp ở 22+ companies
> **See also**: [Decode String](https://leetcode.com/problems/decode-string) | [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chồng đĩa — đĩa nào đặt cuối cùng sẽ được lấy ra đầu tiên (LIFO). Nhiều bài toán về matching và nesting dùng stack.

**Pattern Recognition:**

- Signal: "matching/nesting" + "most recent element" → **Stack**
- Bài này thuộc dạng Stack — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Simplify Path example:**

```
stack = []

push/pop from right →
Process: scan left to right, stack maintains invariant
```

---

## Problem Description

Simplify Path. ([LeetCode](https://leetcode.com/problems/simplify-path))

Difficulty: Medium | Acceptance: 47.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/simplify-path) for full constraints

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
function simplifyPathBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Stack
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function simplifyPath(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Stack
  // Hint: Push/pop to maintain invariant, process when stack condition changes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(simplifyPath(/* example 1 */)); // expected
// console.log(simplifyPath(/* example 2 */)); // expected
// console.log(simplifyPath(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Decode String](https://leetcode.com/problems/decode-string) — same pattern: Stack
- [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii) — same pattern: Stack
- [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses) — same pattern: Dynamic Programming
- [Basic Calculator](https://leetcode.com/problems/basic-calculator) — same pattern: Stack
- [Simplify Path — LeetCode](https://leetcode.com/problems/simplify-path) — problem page
