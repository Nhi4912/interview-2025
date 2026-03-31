---
layout: page
title: "Cut Off Trees for Golf Event"
difficulty: Hard
category: Tree-Graph
tags: [Array, Breadth-First Search, Heap (Priority Queue), Matrix]
leetcode_url: "https://leetcode.com/problems/cut-off-trees-for-golf-event"
---

# Cut Off Trees for Golf Event / Cut Off Trees for Golf Event

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Trapping Rain Water II](https://leetcode.com/problems/trapping-rain-water-ii) | [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống phòng cấp cứu — bệnh nhân nặng nhất luôn được ưu tiên, bất kể ai đến trước. Heap giữ phần tử quan trọng nhất ở đầu.

**Pattern Recognition:**

- Signal: "k-th largest/smallest" + "top-k elements" → **Heap**
- Bài này thuộc dạng Heap / Priority Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Cut Off Trees for Golf Event example:**

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

Cut Off Trees for Golf Event. ([LeetCode](https://leetcode.com/problems/cut-off-trees-for-golf-event))

Difficulty: Hard | Acceptance: 35.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/cut-off-trees-for-golf-event) for full constraints

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
function cutOffTreesForGolfEventBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Heap / Priority Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function cutOffTreesForGolfEvent(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Heap / Priority Queue
  // Hint: Use min/max heap to efficiently track k-th element
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(cutOffTreesForGolfEvent(/* example 1 */)); // expected
// console.log(cutOffTreesForGolfEvent(/* example 2 */)); // expected
// console.log(cutOffTreesForGolfEvent(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Trapping Rain Water II](https://leetcode.com/problems/trapping-rain-water-ii) — same pattern: Heap / Priority Queue
- [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water) — same pattern: Union Find
- [Minimum Number of Visited Cells in a Grid](https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid) — same pattern: Union Find
- [Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort) — same pattern: Union Find
- [Cut Off Trees for Golf Event — LeetCode](https://leetcode.com/problems/cut-off-trees-for-golf-event) — problem page
