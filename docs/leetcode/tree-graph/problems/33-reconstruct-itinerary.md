---
layout: page
title: "Reconstruct Itinerary"
difficulty: Hard
category: Tree-Graph
tags: [Depth-First Search, Graph, Eulerian Circuit]
leetcode_url: "https://leetcode.com/problems/reconstruct-itinerary"
---

# Reconstruct Itinerary / Reconstruct Itinerary

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Valid Arrangement of Pairs](https://leetcode.com/problems/valid-arrangement-of-pairs) | [Course Schedule](https://leetcode.com/problems/course-schedule)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đi trong mê cung — bạn đi sâu hết một ngõ, nếu cụt thì quay lại ngã rẽ gần nhất chưa thử.

**Pattern Recognition:**

- Signal: "traverse tree/graph" + "all paths" → **DFS**
- Bài này thuộc dạng DFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Reconstruct Itinerary example:**

```
       root
      /    \
     A      B
    / \      \
   C   D      E

DFS: root → A → C → D → B → E
Use: recursion or explicit stack
```

---

## Problem Description

Reconstruct Itinerary. ([LeetCode](https://leetcode.com/problems/reconstruct-itinerary))

Difficulty: Hard | Acceptance: 43.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/reconstruct-itinerary) for full constraints

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
function reconstructItineraryBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — DFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function reconstructItinerary(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using DFS
  // Hint: Use recursion or stack, track visited nodes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(reconstructItinerary(/* example 1 */)); // expected
// console.log(reconstructItinerary(/* example 2 */)); // expected
// console.log(reconstructItinerary(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Valid Arrangement of Pairs](https://leetcode.com/problems/valid-arrangement-of-pairs) — same pattern: DFS
- [Course Schedule](https://leetcode.com/problems/course-schedule) — same pattern: Topological Sort
- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops) — same pattern: Shortest Path (BFS/Dijkstra)
- [Reconstruct Itinerary — LeetCode](https://leetcode.com/problems/reconstruct-itinerary) — problem page
