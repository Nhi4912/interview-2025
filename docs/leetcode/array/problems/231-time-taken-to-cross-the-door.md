---
layout: page
title: "Time Taken to Cross the Door"
difficulty: Hard
category: Array
tags: [Array, Queue, Simulation]
leetcode_url: "https://leetcode.com/problems/time-taken-to-cross-the-door"
---

# Time Taken to Cross the Door / Time Taken to Cross the Door

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game) | [Time Needed to Buy Tickets](https://leetcode.com/problems/time-needed-to-buy-tickets)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống hàng xếp mua vé — ai đến trước được phục vụ trước (FIFO). Thường dùng trong BFS và scheduling.

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Queue**
- Bài này thuộc dạng Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Time Taken to Cross the Door example:**

```
// TODO: Add step-by-step visual for Queue
// Show one complete example with state at each step
```

---

## Problem Description

Time Taken to Cross the Door. ([LeetCode](https://leetcode.com/problems/time-taken-to-cross-the-door))

Difficulty: Hard | Acceptance: 49.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/time-taken-to-cross-the-door) for full constraints

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
function timeTakenToCrossTheDoorBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function timeTakenToCrossTheDoor(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Queue
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(timeTakenToCrossTheDoor(/* example 1 */)); // expected
// console.log(timeTakenToCrossTheDoor(/* example 2 */)); // expected
// console.log(timeTakenToCrossTheDoor(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game) — same pattern: Queue
- [Time Needed to Buy Tickets](https://leetcode.com/problems/time-needed-to-buy-tickets) — same pattern: Queue
- [Design Snake Game](https://leetcode.com/problems/design-snake-game) — same pattern: Queue
- [Number of Students Unable to Eat Lunch](https://leetcode.com/problems/number-of-students-unable-to-eat-lunch) — same pattern: Stack
- [Time Taken to Cross the Door — LeetCode](https://leetcode.com/problems/time-taken-to-cross-the-door) — problem page
