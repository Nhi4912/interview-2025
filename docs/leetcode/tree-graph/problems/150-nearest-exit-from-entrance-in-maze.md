---
layout: page
title: "Nearest Exit from Entrance in Maze"
difficulty: Medium
category: Tree-Graph
tags: [Array, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/nearest-exit-from-entrance-in-maze"
---

# Nearest Exit from Entrance in Maze / Nearest Exit from Entrance in Maze

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Rotting Oranges](https://leetcode.com/problems/rotting-oranges) | [Max Area of Island](https://leetcode.com/problems/max-area-of-island)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như ném đá xuống ao — sóng lan ra theo từng vòng đều đặn. Khám phá hết tất cả ở khoảng cách 1, rồi mới sang khoảng cách 2.

**Pattern Recognition:**

- Signal: "shortest path (unweighted)" + "level-order" → **BFS**
- Bài này thuộc dạng BFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Nearest Exit from Entrance in Maze example:**

```
Level 0:     [root]
Level 1:   [A, B]
Level 2: [C, D, E]

BFS: process level by level using queue
```

---

## Problem Description

Nearest Exit from Entrance in Maze. ([LeetCode](https://leetcode.com/problems/nearest-exit-from-entrance-in-maze))

Difficulty: Medium | Acceptance: 47.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/nearest-exit-from-entrance-in-maze) for full constraints

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
function nearestExitFromEntranceInMazeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — BFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function nearestExitFromEntranceInMaze(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using BFS
  // Hint: Use queue, process level by level
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(nearestExitFromEntranceInMaze(/* example 1 */)); // expected
// console.log(nearestExitFromEntranceInMaze(/* example 2 */)); // expected
// console.log(nearestExitFromEntranceInMaze(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Rotting Oranges](https://leetcode.com/problems/rotting-oranges) — same pattern: BFS
- [Max Area of Island](https://leetcode.com/problems/max-area-of-island) — same pattern: Union Find
- [Making A Large Island](https://leetcode.com/problems/making-a-large-island) — same pattern: Union Find
- [Snakes and Ladders](https://leetcode.com/problems/snakes-and-ladders) — same pattern: BFS
- [Nearest Exit from Entrance in Maze — LeetCode](https://leetcode.com/problems/nearest-exit-from-entrance-in-maze) — problem page
