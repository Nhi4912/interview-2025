---
layout: page
title: "Find the Count of Monotonic Pairs II"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming, Combinatorics, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii"
---

# Find the Count of Monotonic Pairs II / Find the Count of Monotonic Pairs II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i) | [Number of Sub-arrays With Odd Sum](https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find the Count of Monotonic Pairs II example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Find the Count of Monotonic Pairs II. ([LeetCode](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii))

Difficulty: Hard | Acceptance: 23.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii) for full constraints

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
function findTheCountOfMonotonicPairsIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findTheCountOfMonotonicPairsIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findTheCountOfMonotonicPairsIi(/* example 1 */)); // expected
// console.log(findTheCountOfMonotonicPairsIi(/* example 2 */)); // expected
// console.log(findTheCountOfMonotonicPairsIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i) — same pattern: Prefix Sum
- [Number of Sub-arrays With Odd Sum](https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum) — same pattern: Prefix Sum
- [The Number of Beautiful Subsets](https://leetcode.com/problems/the-number-of-beautiful-subsets) — same pattern: Backtracking
- [Stone Game VIII](https://leetcode.com/problems/stone-game-viii) — same pattern: Prefix Sum
- [Find the Count of Monotonic Pairs II — LeetCode](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii) — problem page
