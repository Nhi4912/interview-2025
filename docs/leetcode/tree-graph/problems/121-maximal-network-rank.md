---
layout: page
title: "Maximal Network Rank"
difficulty: Medium
category: Tree-Graph
tags: [Graph]
leetcode_url: "https://leetcode.com/problems/maximal-network-rank"
---

# Maximal Network Rank / Maximal Network Rank

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Graph
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule) | [Evaluate Division](https://leetcode.com/problems/evaluate-division)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống mạng lưới đường phố — mỗi ngã tư là một node, mỗi con đường là edge. Bài toán đặt ra: tìm đường ngắn nhất, kiểm tra có chu trình, hoặc đếm thành phần liên thông.

**Pattern Recognition:**

- Signal: "nodes and edges" + "connectivity/reachability" → **Graph**
- Bài này thuộc dạng Graph — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximal Network Rank example:**

```
// TODO: Add step-by-step visual for Graph
// Show one complete example with state at each step
```

---

## Problem Description

Maximal Network Rank. ([LeetCode](https://leetcode.com/problems/maximal-network-rank))

Difficulty: Medium | Acceptance: 65.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximal-network-rank) for full constraints

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
function maximalNetworkRankBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Graph
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximalNetworkRank(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Graph
  // Hint: Build adjacency list, choose BFS/DFS based on requirement
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximalNetworkRank(/* example 1 */)); // expected
// console.log(maximalNetworkRank(/* example 2 */)); // expected
// console.log(maximalNetworkRank(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Course Schedule](https://leetcode.com/problems/course-schedule) — same pattern: Topological Sort
- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops) — same pattern: Shortest Path (BFS/Dijkstra)
- [Reconstruct Itinerary](https://leetcode.com/problems/reconstruct-itinerary) — same pattern: DFS
- [Maximal Network Rank — LeetCode](https://leetcode.com/problems/maximal-network-rank) — problem page
