---
layout: page
title: "Guess the Word"
difficulty: Hard
category: String
tags: [Array, Math, String, Interactive, Game Theory]
leetcode_url: "https://leetcode.com/problems/guess-the-word"
---

# Guess the Word / Guess the Word

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Remove Colored Pieces if Both Neighbors are the Same Color](https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color) | [Minimum Time Difference](https://leetcode.com/problems/minimum-time-difference)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bài toán cần công thức hoặc tính chất toán học — không cần brute force nếu nhận ra pattern.

**Pattern Recognition:**

- Signal: "pattern/formula" + "number properties" → **Math**
- Bài này thuộc dạng Math — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Guess the Word example:**

```
// TODO: Add step-by-step visual for Math
// Show one complete example with state at each step
```

---

## Problem Description

Guess the Word. ([LeetCode](https://leetcode.com/problems/guess-the-word))

Difficulty: Hard | Acceptance: 37.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/guess-the-word) for full constraints

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
function guessTheWordBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Math
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function guessTheWord(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Math
  // Hint: Find mathematical pattern or formula
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(guessTheWord(/* example 1 */)); // expected
// console.log(guessTheWord(/* example 2 */)); // expected
// console.log(guessTheWord(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Remove Colored Pieces if Both Neighbors are the Same Color](https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color) — same pattern: Greedy
- [Minimum Time Difference](https://leetcode.com/problems/minimum-time-difference) — same pattern: Sorting
- [Predict the Winner](https://leetcode.com/problems/predict-the-winner) — same pattern: Dynamic Programming
- [Verbal Arithmetic Puzzle](https://leetcode.com/problems/verbal-arithmetic-puzzle) — same pattern: Backtracking
- [Guess the Word — LeetCode](https://leetcode.com/problems/guess-the-word) — problem page
