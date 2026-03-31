---
layout: page
title: "Find the Winner of the Circular Game"
difficulty: Medium
category: Array
tags: [Array, Math, Recursion, Queue, Simulation]
leetcode_url: "https://leetcode.com/problems/find-the-winner-of-the-circular-game"
---

# Find the Winner of the Circular Game / Find the Winner of the Circular Game

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Predict the Winner](https://leetcode.com/problems/predict-the-winner) | [Time Needed to Buy Tickets](https://leetcode.com/problems/time-needed-to-buy-tickets)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống hàng xếp mua vé — ai đến trước được phục vụ trước (FIFO). Thường dùng trong BFS và scheduling.

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Queue**
- Bài này thuộc dạng Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find the Winner of the Circular Game example:**

```
// TODO: Add step-by-step visual for Queue
// Show one complete example with state at each step
```

---

## Problem Description

Find the Winner of the Circular Game. ([LeetCode](https://leetcode.com/problems/find-the-winner-of-the-circular-game))

Difficulty: Medium | Acceptance: 82.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-the-winner-of-the-circular-game) for full constraints

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
function findTheWinnerOfTheCircularGameBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findTheWinnerOfTheCircularGame(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Queue
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findTheWinnerOfTheCircularGame(/* example 1 */)); // expected
// console.log(findTheWinnerOfTheCircularGame(/* example 2 */)); // expected
// console.log(findTheWinnerOfTheCircularGame(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Predict the Winner](https://leetcode.com/problems/predict-the-winner) — same pattern: Dynamic Programming
- [Time Needed to Buy Tickets](https://leetcode.com/problems/time-needed-to-buy-tickets) — same pattern: Queue
- [Design Snake Game](https://leetcode.com/problems/design-snake-game) — same pattern: Queue
- [Double Modular Exponentiation](https://leetcode.com/problems/double-modular-exponentiation) — same pattern: Math
- [Find the Winner of the Circular Game — LeetCode](https://leetcode.com/problems/find-the-winner-of-the-circular-game) — problem page
