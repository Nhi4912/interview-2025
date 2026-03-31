---
layout: page
title: "Game of Life"
difficulty: Medium
category: Array
tags: [Array, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/game-of-life"
---

# Game of Life / Game of Life

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Matrix / Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) | [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Phân tích bài "Game of Life" — xác định pattern phù hợp dựa trên constraints và input/output.

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Matrix / Simulation**
- Bài này thuộc dạng Matrix / Simulation — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Game of Life example:**

```
// TODO: Add step-by-step visual for Matrix / Simulation
// Show one complete example with state at each step
```

---

## Problem Description

Game of Life. ([LeetCode](https://leetcode.com/problems/game-of-life))

Difficulty: Medium | Acceptance: 71.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/game-of-life) for full constraints

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
function gameOfLifeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Matrix / Simulation
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function gameOfLife(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Matrix / Simulation
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(gameOfLife(/* example 1 */)); // expected
// console.log(gameOfLife(/* example 2 */)); // expected
// console.log(gameOfLife(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) — same pattern: Matrix / Simulation
- [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii) — same pattern: Matrix / Simulation
- [Candy Crush](https://leetcode.com/problems/candy-crush) — same pattern: Two Pointers
- [Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse) — same pattern: Matrix / Simulation
- [Game of Life — LeetCode](https://leetcode.com/problems/game-of-life) — problem page
