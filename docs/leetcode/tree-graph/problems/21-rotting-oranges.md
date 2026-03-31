---
layout: page
title: "Rotting Oranges"
difficulty: Medium
category: Tree-Graph
tags: [Array, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/rotting-oranges"
---

# Rotting Oranges / Rotting Oranges

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS
> **Frequency**: ⭐ Tier 2 — Gặp ở 25+ companies
> **See also**: [Max Area of Island](https://leetcode.com/problems/max-area-of-island) | [Making A Large Island](https://leetcode.com/problems/making-a-large-island)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như ném đá xuống ao — sóng lan ra theo từng vòng đều đặn. Khám phá hết tất cả ở khoảng cách 1, rồi mới sang khoảng cách 2.

**Pattern Recognition:**

- Signal: "shortest path (unweighted)" + "level-order" → **BFS**
- Bài này thuộc dạng BFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Rotting Oranges example:**

```
Level 0:     [root]
Level 1:   [A, B]
Level 2: [C, D, E]

BFS: process level by level using queue
```

---

## Problem Description

Rotting Oranges. ([LeetCode](https://leetcode.com/problems/rotting-oranges))

Difficulty: Medium | Acceptance: 56.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/rotting-oranges) for full constraints

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
function rottingOrangesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — BFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function rottingOranges(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using BFS
  // Hint: Use queue, process level by level
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(rottingOranges(/* example 1 */)); // expected
// console.log(rottingOranges(/* example 2 */)); // expected
// console.log(rottingOranges(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Max Area of Island](https://leetcode.com/problems/max-area-of-island) — same pattern: Union Find
- [Making A Large Island](https://leetcode.com/problems/making-a-large-island) — same pattern: Union Find
- [Snakes and Ladders](https://leetcode.com/problems/snakes-and-ladders) — same pattern: BFS
- [Shortest Distance from All Buildings](https://leetcode.com/problems/shortest-distance-from-all-buildings) — same pattern: BFS
- [Rotting Oranges — LeetCode](https://leetcode.com/problems/rotting-oranges) — problem page
