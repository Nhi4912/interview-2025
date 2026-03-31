---
layout: page
title: "Number of Students Unable to Eat Lunch"
difficulty: Easy
category: Array
tags: [Array, Stack, Queue, Simulation]
leetcode_url: "https://leetcode.com/problems/number-of-students-unable-to-eat-lunch"
---

# Number of Students Unable to Eat Lunch / Number of Students Unable to Eat Lunch

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Asteroid Collision](https://leetcode.com/problems/asteroid-collision) | [Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chồng đĩa — đĩa nào đặt cuối cùng sẽ được lấy ra đầu tiên (LIFO). Nhiều bài toán về matching và nesting dùng stack.

**Pattern Recognition:**

- Signal: "matching/nesting" + "most recent element" → **Stack**
- Bài này thuộc dạng Stack — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of Students Unable to Eat Lunch example:**

```
stack = []

push/pop from right →
Process: scan left to right, stack maintains invariant
```

---

## Problem Description

Number of Students Unable to Eat Lunch. ([LeetCode](https://leetcode.com/problems/number-of-students-unable-to-eat-lunch))

Difficulty: Easy | Acceptance: 78.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-students-unable-to-eat-lunch) for full constraints

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
function numberOfStudentsUnableToEatLunchBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Stack
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfStudentsUnableToEatLunch(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Stack
  // Hint: Push/pop to maintain invariant, process when stack condition changes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfStudentsUnableToEatLunch(/* example 1 */)); // expected
// console.log(numberOfStudentsUnableToEatLunch(/* example 2 */)); // expected
// console.log(numberOfStudentsUnableToEatLunch(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Asteroid Collision](https://leetcode.com/problems/asteroid-collision) — same pattern: Stack
- [Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game) — same pattern: Queue
- [Robot Collisions](https://leetcode.com/problems/robot-collisions) — same pattern: Stack
- [Time Needed to Buy Tickets](https://leetcode.com/problems/time-needed-to-buy-tickets) — same pattern: Queue
- [Number of Students Unable to Eat Lunch — LeetCode](https://leetcode.com/problems/number-of-students-unable-to-eat-lunch) — problem page
