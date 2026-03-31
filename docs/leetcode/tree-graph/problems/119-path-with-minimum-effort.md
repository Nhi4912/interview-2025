---
layout: page
title: "Path With Minimum Effort"
difficulty: Medium
category: Tree-Graph
tags: [Array, Binary Search, Depth-First Search, Breadth-First Search, Union Find]
leetcode_url: "https://leetcode.com/problems/path-with-minimum-effort"
---

# Path With Minimum Effort / Path With Minimum Effort

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) | [Path With Maximum Minimum Value](https://leetcode.com/problems/path-with-maximum-minimum-value)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.

**Pattern Recognition:**

- Signal: "group elements" + "connectivity queries" → **Union Find**
- Bài này thuộc dạng Union Find — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Path With Minimum Effort example:**

```
// TODO: Add step-by-step visual for Union Find
// Show one complete example with state at each step
```

---

## Problem Description

Path With Minimum Effort. ([LeetCode](https://leetcode.com/problems/path-with-minimum-effort))

Difficulty: Medium | Acceptance: 61.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/path-with-minimum-effort) for full constraints

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
function pathWithMinimumEffortBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Union Find
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function pathWithMinimumEffort(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Union Find
  // Hint: Use union-find with path compression and union by rank
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(pathWithMinimumEffort(/* example 1 */)); // expected
// console.log(pathWithMinimumEffort(/* example 2 */)); // expected
// console.log(pathWithMinimumEffort(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) — same pattern: Union Find
- [Path With Maximum Minimum Value](https://leetcode.com/problems/path-with-maximum-minimum-value) — same pattern: Union Find
- [Find the Safest Path in a Grid](https://leetcode.com/problems/find-the-safest-path-in-a-grid) — same pattern: Union Find
- [Last Day Where You Can Still Cross](https://leetcode.com/problems/last-day-where-you-can-still-cross) — same pattern: Union Find
- [Path With Minimum Effort — LeetCode](https://leetcode.com/problems/path-with-minimum-effort) — problem page
