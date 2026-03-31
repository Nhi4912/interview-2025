---
layout: page
title: "Cheapest Flights Within K Stops"
difficulty: Medium
category: Tree-Graph
tags: [Dynamic Programming, Depth-First Search, Breadth-First Search, Graph, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/cheapest-flights-within-k-stops"
---

# Cheapest Flights Within K Stops / Cheapest Flights Within K Stops

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Shortest Path (BFS/Dijkstra)
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Network Delay Time](https://leetcode.com/problems/network-delay-time) | [Find Edges in Shortest Paths](https://leetcode.com/problems/find-edges-in-shortest-paths)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tìm đường đi ngắn nhất trên Google Maps — BFS cho đồ thị không trọng số, Dijkstra cho có trọng số dương.

**Pattern Recognition:**

- Signal: "shortest/minimum path with weights" → **Dijkstra/BFS**
- Bài này thuộc dạng Shortest Path (BFS/Dijkstra) — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Cheapest Flights Within K Stops example:**

```
// TODO: Add step-by-step visual for Shortest Path (BFS/Dijkstra)
// Show one complete example with state at each step
```

---

## Problem Description

Cheapest Flights Within K Stops. ([LeetCode](https://leetcode.com/problems/cheapest-flights-within-k-stops))

Difficulty: Medium | Acceptance: 40.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/cheapest-flights-within-k-stops) for full constraints

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
function cheapestFlightsWithinKStopsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Shortest Path (BFS/Dijkstra)
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function cheapestFlightsWithinKStops(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Shortest Path (BFS/Dijkstra)
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(cheapestFlightsWithinKStops(/* example 1 */)); // expected
// console.log(cheapestFlightsWithinKStops(/* example 2 */)); // expected
// console.log(cheapestFlightsWithinKStops(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Network Delay Time](https://leetcode.com/problems/network-delay-time) — same pattern: Shortest Path (BFS/Dijkstra)
- [Find Edges in Shortest Paths](https://leetcode.com/problems/find-edges-in-shortest-paths) — same pattern: Shortest Path (BFS/Dijkstra)
- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) — same pattern: Topological Sort
- [Cheapest Flights Within K Stops — LeetCode](https://leetcode.com/problems/cheapest-flights-within-k-stops) — problem page
