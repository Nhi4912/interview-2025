---
layout: page
title: "Finding Pairs With a Certain Sum"
difficulty: Medium
category: Design
tags: [Array, Hash Table, Design]
leetcode_url: "https://leetcode.com/problems/finding-pairs-with-a-certain-sum"
---

# Finding Pairs With a Certain Sum / Finding Pairs With a Certain Sum

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Design
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Design HashMap](https://leetcode.com/problems/design-hashmap) | [Snapshot Array](https://leetcode.com/problems/snapshot-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bài Design yêu cầu xây dựng cấu trúc dữ liệu — quan trọng là chọn đúng cấu trúc nền và đảm bảo các operations đạt complexity yêu cầu.

**Pattern Recognition:**

- Signal: "implement class with specific API" → **Design**
- Bài này thuộc dạng Design — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Finding Pairs With a Certain Sum example:**

```
// TODO: Add step-by-step visual for Design
// Show one complete example with state at each step
```

---

## Problem Description

Finding Pairs With a Certain Sum. ([LeetCode](https://leetcode.com/problems/finding-pairs-with-a-certain-sum))

Difficulty: Medium | Acceptance: 49.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/finding-pairs-with-a-certain-sum) for full constraints

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
function findingPairsWithACertainSumBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Design
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findingPairsWithACertainSum(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Design
  // Hint: Choose right data structure combination for required operations
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findingPairsWithACertainSum(/* example 1 */)); // expected
// console.log(findingPairsWithACertainSum(/* example 2 */)); // expected
// console.log(findingPairsWithACertainSum(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Design HashMap](https://leetcode.com/problems/design-hashmap) — same pattern: Linked List
- [Snapshot Array](https://leetcode.com/problems/snapshot-array) — same pattern: Binary Search
- [Insert Delete GetRandom O(1) - Duplicates allowed](https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed) — same pattern: Math
- [Simple Bank System](https://leetcode.com/problems/simple-bank-system) — same pattern: Design
- [Finding Pairs With a Certain Sum — LeetCode](https://leetcode.com/problems/finding-pairs-with-a-certain-sum) — problem page
