---
layout: page
title: "Flower Planting With No Adjacent"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/flower-planting-with-no-adjacent"
---

# Flower Planting With No Adjacent / Flower Planting With No Adjacent

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule) | [Evaluate Division](https://leetcode.com/problems/evaluate-division)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như ném đá xuống ao — sóng lan ra theo từng vòng đều đặn. Khám phá hết tất cả ở khoảng cách 1, rồi mới sang khoảng cách 2.

**Pattern Recognition:**

- Signal: "shortest path (unweighted)" + "level-order" → **BFS**
- Bài này thuộc dạng BFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Flower Planting With No Adjacent example:**

```
Level 0:     [root]
Level 1:   [A, B]
Level 2: [C, D, E]

BFS: process level by level using queue
```

---

## Problem Description

Flower Planting With No Adjacent. ([LeetCode](https://leetcode.com/problems/flower-planting-with-no-adjacent))

Difficulty: Medium | Acceptance: 52.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/flower-planting-with-no-adjacent) for full constraints

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
function flowerPlantingWithNoAdjacentBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — BFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function flowerPlantingWithNoAdjacent(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using BFS
  // Hint: Use queue, process level by level
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(flowerPlantingWithNoAdjacent(/* example 1 */)); // expected
// console.log(flowerPlantingWithNoAdjacent(/* example 2 */)); // expected
// console.log(flowerPlantingWithNoAdjacent(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Course Schedule](https://leetcode.com/problems/course-schedule) — same pattern: Topological Sort
- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops) — same pattern: Shortest Path (BFS/Dijkstra)
- [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) — same pattern: Topological Sort
- [Flower Planting With No Adjacent — LeetCode](https://leetcode.com/problems/flower-planting-with-no-adjacent) — problem page
