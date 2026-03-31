---
layout: page
title: "Evaluate Reverse Polish Notation"
difficulty: Medium
category: Array
tags: [Array, Math, Stack]
leetcode_url: "https://leetcode.com/problems/evaluate-reverse-polish-notation"
---

# Evaluate Reverse Polish Notation / Evaluate Reverse Polish Notation

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Maximum Frequency Score of a Subarray](https://leetcode.com/problems/maximum-frequency-score-of-a-subarray) | [The Score of Students Solving Math Expression](https://leetcode.com/problems/the-score-of-students-solving-math-expression)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chồng đĩa — đĩa nào đặt cuối cùng sẽ được lấy ra đầu tiên (LIFO). Nhiều bài toán về matching và nesting dùng stack.

**Pattern Recognition:**

- Signal: "matching/nesting" + "most recent element" → **Stack**
- Bài này thuộc dạng Stack — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Evaluate Reverse Polish Notation example:**

```
stack = []

push/pop from right →
Process: scan left to right, stack maintains invariant
```

---

## Problem Description

Evaluate Reverse Polish Notation. ([LeetCode](https://leetcode.com/problems/evaluate-reverse-polish-notation))

Difficulty: Medium | Acceptance: 55.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/evaluate-reverse-polish-notation) for full constraints

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
function evaluateReversePolishNotationBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Stack
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function evaluateReversePolishNotation(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Stack
  // Hint: Push/pop to maintain invariant, process when stack condition changes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(evaluateReversePolishNotation(/* example 1 */)); // expected
// console.log(evaluateReversePolishNotation(/* example 2 */)); // expected
// console.log(evaluateReversePolishNotation(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Maximum Frequency Score of a Subarray](https://leetcode.com/problems/maximum-frequency-score-of-a-subarray) — same pattern: Sliding Window
- [The Score of Students Solving Math Expression](https://leetcode.com/problems/the-score-of-students-solving-math-expression) — same pattern: Dynamic Programming
- [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) — same pattern: Monotonic Stack
- [Asteroid Collision](https://leetcode.com/problems/asteroid-collision) — same pattern: Stack
- [Evaluate Reverse Polish Notation — LeetCode](https://leetcode.com/problems/evaluate-reverse-polish-notation) — problem page
