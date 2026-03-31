---
layout: page
title: "Number of Possible Sets of Closing Branches"
difficulty: Hard
category: Tree-Graph
tags: [Bit Manipulation, Graph, Heap (Priority Queue), Enumeration, Shortest Path]
leetcode_url: "https://leetcode.com/problems/number-of-possible-sets-of-closing-branches"
---

# Number of Possible Sets of Closing Branches / Number of Possible Sets of Closing Branches

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Shortest Path (BFS/Dijkstra)
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops) | [Network Delay Time](https://leetcode.com/problems/network-delay-time)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tìm đường đi ngắn nhất trên Google Maps — BFS cho đồ thị không trọng số, Dijkstra cho có trọng số dương.

**Pattern Recognition:**

- Signal: "shortest/minimum path with weights" → **Dijkstra/BFS**
- Bài này thuộc dạng Shortest Path (BFS/Dijkstra) — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of Possible Sets of Closing Branches example:**

```
// TODO: Add step-by-step visual for Shortest Path (BFS/Dijkstra)
// Show one complete example with state at each step
```

---

## Problem Description

Number of Possible Sets of Closing Branches. ([LeetCode](https://leetcode.com/problems/number-of-possible-sets-of-closing-branches))

Difficulty: Hard | Acceptance: 48.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-possible-sets-of-closing-branches) for full constraints

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
function numberOfPossibleSetsOfClosingBranchesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Shortest Path (BFS/Dijkstra)
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfPossibleSetsOfClosingBranches(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Shortest Path (BFS/Dijkstra)
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfPossibleSetsOfClosingBranches(/* example 1 */)); // expected
// console.log(numberOfPossibleSetsOfClosingBranches(/* example 2 */)); // expected
// console.log(numberOfPossibleSetsOfClosingBranches(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops) — same pattern: Shortest Path (BFS/Dijkstra)
- [Network Delay Time](https://leetcode.com/problems/network-delay-time) — same pattern: Shortest Path (BFS/Dijkstra)
- [Path with Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability) — same pattern: Shortest Path (BFS/Dijkstra)
- [Minimum Cost to Buy Apples](https://leetcode.com/problems/minimum-cost-to-buy-apples) — same pattern: Shortest Path (BFS/Dijkstra)
- [Number of Possible Sets of Closing Branches — LeetCode](https://leetcode.com/problems/number-of-possible-sets-of-closing-branches) — problem page
