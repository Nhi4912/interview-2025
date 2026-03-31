---
layout: page
title: "K Highest Ranked Items Within a Price Range"
difficulty: Medium
category: Tree-Graph
tags: [Array, Breadth-First Search, Sorting, Heap (Priority Queue), Matrix]
leetcode_url: "https://leetcode.com/problems/k-highest-ranked-items-within-a-price-range"
---

# K Highest Ranked Items Within a Price Range / K Highest Ranked Items Within a Price Range

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximum Number of Points From Grid Queries](https://leetcode.com/problems/maximum-number-of-points-from-grid-queries) | [Trapping Rain Water II](https://leetcode.com/problems/trapping-rain-water-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống phòng cấp cứu — bệnh nhân nặng nhất luôn được ưu tiên, bất kể ai đến trước. Heap giữ phần tử quan trọng nhất ở đầu.

**Pattern Recognition:**

- Signal: "k-th largest/smallest" + "top-k elements" → **Heap**
- Bài này thuộc dạng Heap / Priority Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — K Highest Ranked Items Within a Price Range example:**

```
Min Heap:
        1
       / \
      3   2
     / \
    7   4

Insert: add to end, bubble up
Extract: remove root, bubble down
```

---

## Problem Description

K Highest Ranked Items Within a Price Range. ([LeetCode](https://leetcode.com/problems/k-highest-ranked-items-within-a-price-range))

Difficulty: Medium | Acceptance: 44.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/k-highest-ranked-items-within-a-price-range) for full constraints

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
function kHighestRankedItemsWithinAPriceRangeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Heap / Priority Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function kHighestRankedItemsWithinAPriceRange(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Heap / Priority Queue
  // Hint: Use min/max heap to efficiently track k-th element
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(kHighestRankedItemsWithinAPriceRange(/* example 1 */)); // expected
// console.log(kHighestRankedItemsWithinAPriceRange(/* example 2 */)); // expected
// console.log(kHighestRankedItemsWithinAPriceRange(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Maximum Number of Points From Grid Queries](https://leetcode.com/problems/maximum-number-of-points-from-grid-queries) — same pattern: Union Find
- [Trapping Rain Water II](https://leetcode.com/problems/trapping-rain-water-ii) — same pattern: Heap / Priority Queue
- [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) — same pattern: Union Find
- [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix) — same pattern: Binary Search
- [K Highest Ranked Items Within a Price Range — LeetCode](https://leetcode.com/problems/k-highest-ranked-items-within-a-price-range) — problem page
