---
layout: page
title: "Minimum Deletions to Make Array Divisible"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Math, Sorting, Heap (Priority Queue), Number Theory]
leetcode_url: "https://leetcode.com/problems/minimum-deletions-to-make-array-divisible"
---

# Minimum Deletions to Make Array Divisible / Minimum Deletions to Make Array Divisible

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) | [Get Biggest Three Rhombus Sums in a Grid](https://leetcode.com/problems/get-biggest-three-rhombus-sums-in-a-grid)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống phòng cấp cứu — bệnh nhân nặng nhất luôn được ưu tiên, bất kể ai đến trước. Heap giữ phần tử quan trọng nhất ở đầu.

**Pattern Recognition:**

- Signal: "k-th largest/smallest" + "top-k elements" → **Heap**
- Bài này thuộc dạng Heap / Priority Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Deletions to Make Array Divisible example:**

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

Minimum Deletions to Make Array Divisible. ([LeetCode](https://leetcode.com/problems/minimum-deletions-to-make-array-divisible))

Difficulty: Hard | Acceptance: 57.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-deletions-to-make-array-divisible) for full constraints

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
function minimumDeletionsToMakeArrayDivisibleBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Heap / Priority Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumDeletionsToMakeArrayDivisible(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Heap / Priority Queue
  // Hint: Use min/max heap to efficiently track k-th element
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumDeletionsToMakeArrayDivisible(/* example 1 */)); // expected
// console.log(minimumDeletionsToMakeArrayDivisible(/* example 2 */)); // expected
// console.log(minimumDeletionsToMakeArrayDivisible(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) — same pattern: Heap / Priority Queue
- [Get Biggest Three Rhombus Sums in a Grid](https://leetcode.com/problems/get-biggest-three-rhombus-sums-in-a-grid) — same pattern: Prefix Sum
- [Sell Diminishing-Valued Colored Balls](https://leetcode.com/problems/sell-diminishing-valued-colored-balls) — same pattern: Binary Search
- [Stone Game VI](https://leetcode.com/problems/stone-game-vi) — same pattern: Heap / Priority Queue
- [Minimum Deletions to Make Array Divisible — LeetCode](https://leetcode.com/problems/minimum-deletions-to-make-array-divisible) — problem page
