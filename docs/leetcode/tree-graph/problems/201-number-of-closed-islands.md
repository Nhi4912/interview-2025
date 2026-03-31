---
layout: page
title: "Number of Closed Islands"
difficulty: Medium
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Union Find, Matrix]
leetcode_url: "https://leetcode.com/problems/number-of-closed-islands"
---

# Number of Closed Islands / Number of Closed Islands

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Max Area of Island](https://leetcode.com/problems/max-area-of-island) | [Making A Large Island](https://leetcode.com/problems/making-a-large-island)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.

**Pattern Recognition:**

- Signal: "group elements" + "connectivity queries" → **Union Find**
- Bài này thuộc dạng Union Find — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of Closed Islands example:**

```
// TODO: Add step-by-step visual for Union Find
// Show one complete example with state at each step
```

---

## Problem Description

Number of Closed Islands. ([LeetCode](https://leetcode.com/problems/number-of-closed-islands))

Difficulty: Medium | Acceptance: 66.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-closed-islands) for full constraints

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
function numberOfClosedIslandsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Union Find
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfClosedIslands(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Union Find
  // Hint: Use union-find with path compression and union by rank
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfClosedIslands(/* example 1 */)); // expected
// console.log(numberOfClosedIslands(/* example 2 */)); // expected
// console.log(numberOfClosedIslands(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Max Area of Island](https://leetcode.com/problems/max-area-of-island) — same pattern: Union Find
- [Making A Large Island](https://leetcode.com/problems/making-a-large-island) — same pattern: Union Find
- [Surrounded Regions](https://leetcode.com/problems/surrounded-regions) — same pattern: Union Find
- [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) — same pattern: Union Find
- [Number of Closed Islands — LeetCode](https://leetcode.com/problems/number-of-closed-islands) — problem page
