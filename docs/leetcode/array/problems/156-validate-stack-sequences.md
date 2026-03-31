---
layout: page
title: "Validate Stack Sequences"
difficulty: Medium
category: Array
tags: [Array, Stack, Simulation]
leetcode_url: "https://leetcode.com/problems/validate-stack-sequences"
---

# Validate Stack Sequences / Validate Stack Sequences

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Asteroid Collision](https://leetcode.com/problems/asteroid-collision) | [Robot Collisions](https://leetcode.com/problems/robot-collisions)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chồng đĩa — đĩa nào đặt cuối cùng sẽ được lấy ra đầu tiên (LIFO). Nhiều bài toán về matching và nesting dùng stack.

**Pattern Recognition:**

- Signal: "matching/nesting" + "most recent element" → **Stack**
- Bài này thuộc dạng Stack — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Validate Stack Sequences example:**

```
stack = []

push/pop from right →
Process: scan left to right, stack maintains invariant
```

---

## Problem Description

Validate Stack Sequences. ([LeetCode](https://leetcode.com/problems/validate-stack-sequences))

Difficulty: Medium | Acceptance: 69.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/validate-stack-sequences) for full constraints

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
function validateStackSequencesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Stack
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function validateStackSequences(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Stack
  // Hint: Push/pop to maintain invariant, process when stack condition changes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(validateStackSequences(/* example 1 */)); // expected
// console.log(validateStackSequences(/* example 2 */)); // expected
// console.log(validateStackSequences(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Asteroid Collision](https://leetcode.com/problems/asteroid-collision) — same pattern: Stack
- [Robot Collisions](https://leetcode.com/problems/robot-collisions) — same pattern: Stack
- [Number of Students Unable to Eat Lunch](https://leetcode.com/problems/number-of-students-unable-to-eat-lunch) — same pattern: Stack
- [Baseball Game](https://leetcode.com/problems/baseball-game) — same pattern: Stack
- [Validate Stack Sequences — LeetCode](https://leetcode.com/problems/validate-stack-sequences) — problem page
