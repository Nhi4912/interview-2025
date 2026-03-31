---
layout: page
title: "Design Snake Game"
difficulty: Medium
category: Design
tags: [Array, Hash Table, Design, Queue, Simulation]
leetcode_url: "https://leetcode.com/problems/design-snake-game"
---

# Design Snake Game / Design Snake Game

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Simple Bank System](https://leetcode.com/problems/simple-bank-system) | [Design Memory Allocator](https://leetcode.com/problems/design-memory-allocator)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống hàng xếp mua vé — ai đến trước được phục vụ trước (FIFO). Thường dùng trong BFS và scheduling.

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Queue**
- Bài này thuộc dạng Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Design Snake Game example:**

```
// TODO: Add step-by-step visual for Queue
// Show one complete example with state at each step
```

---

## Problem Description

Design Snake Game. ([LeetCode](https://leetcode.com/problems/design-snake-game))

Difficulty: Medium | Acceptance: 39.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/design-snake-game) for full constraints

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
function designSnakeGameBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function designSnakeGame(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Queue
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(designSnakeGame(/* example 1 */)); // expected
// console.log(designSnakeGame(/* example 2 */)); // expected
// console.log(designSnakeGame(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Simple Bank System](https://leetcode.com/problems/simple-bank-system) — same pattern: Design
- [Design Memory Allocator](https://leetcode.com/problems/design-memory-allocator) — same pattern: Design
- [Implement Router](https://leetcode.com/problems/implement-router) — same pattern: Binary Search
- [Design HashMap](https://leetcode.com/problems/design-hashmap) — same pattern: Linked List
- [Design Snake Game — LeetCode](https://leetcode.com/problems/design-snake-game) — problem page
