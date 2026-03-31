---
layout: page
title: "Walking Robot Simulation"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Simulation]
leetcode_url: "https://leetcode.com/problems/walking-robot-simulation"
---

# Walking Robot Simulation / Walking Robot Simulation

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Simple Bank System](https://leetcode.com/problems/simple-bank-system) | [Design Memory Allocator](https://leetcode.com/problems/design-memory-allocator)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống từ điển — tra cứu tức thì O(1). Đổi space lấy time, lưu thông tin đã thấy để tránh tìm lại.

**Pattern Recognition:**

- Signal: "find complement/match in O(1)" → **Hash Map**
- Bài này thuộc dạng Hash Map — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Walking Robot Simulation example:**

```
Scan array:
i=0: num=2, need=target-2=7 → not in map → map={2:0}
i=1: num=7, need=target-7=2 → found in map! → return [map[2], 1] ✅

Key insight: store complement for O(1) lookup
```

---

## Problem Description

Walking Robot Simulation. ([LeetCode](https://leetcode.com/problems/walking-robot-simulation))

Difficulty: Medium | Acceptance: 58.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/walking-robot-simulation) for full constraints

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
function walkingRobotSimulationBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Hash Map
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function walkingRobotSimulation(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Hash Map
  // Hint: Store seen values for O(1) lookup of complement/match
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(walkingRobotSimulation(/* example 1 */)); // expected
// console.log(walkingRobotSimulation(/* example 2 */)); // expected
// console.log(walkingRobotSimulation(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Simple Bank System](https://leetcode.com/problems/simple-bank-system) — same pattern: Design
- [Design Memory Allocator](https://leetcode.com/problems/design-memory-allocator) — same pattern: Design
- [Task Scheduler II](https://leetcode.com/problems/task-scheduler-ii) — same pattern: Hash Map
- [Find Winner on a Tic Tac Toe Game](https://leetcode.com/problems/find-winner-on-a-tic-tac-toe-game) — same pattern: Hash Map
- [Walking Robot Simulation — LeetCode](https://leetcode.com/problems/walking-robot-simulation) — problem page
