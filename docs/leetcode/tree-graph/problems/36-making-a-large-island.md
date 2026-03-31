---
layout: page
title: "Making A Large Island"
difficulty: Hard
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Union Find, Matrix]
leetcode_url: "https://leetcode.com/problems/making-a-large-island"
---

# Making A Large Island / Making A Large Island

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Max Area of Island](https://leetcode.com/problems/max-area-of-island) | [Surrounded Regions](https://leetcode.com/problems/surrounded-regions)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.

**Pattern Recognition:**

- Signal: "group elements" + "connectivity queries" → **Union Find**
- Bài này thuộc dạng Union Find — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Making A Large Island example:**

```
// TODO: Add step-by-step visual for Union Find
// Show one complete example with state at each step
```

---

## Problem Description

Making A Large Island. ([LeetCode](https://leetcode.com/problems/making-a-large-island))

Difficulty: Hard | Acceptance: 54.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/making-a-large-island) for full constraints

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
function makingALargeIslandBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Union Find
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function makingALargeIsland(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Union Find
  // Hint: Use union-find with path compression and union by rank
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(makingALargeIsland(/* example 1 */)); // expected
// console.log(makingALargeIsland(/* example 2 */)); // expected
// console.log(makingALargeIsland(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Max Area of Island](https://leetcode.com/problems/max-area-of-island) — same pattern: Union Find
- [Surrounded Regions](https://leetcode.com/problems/surrounded-regions) — same pattern: Union Find
- [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) — same pattern: Union Find
- [Count Sub Islands](https://leetcode.com/problems/count-sub-islands) — same pattern: Union Find
- [Making A Large Island — LeetCode](https://leetcode.com/problems/making-a-large-island) — problem page
