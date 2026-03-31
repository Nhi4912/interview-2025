---
layout: page
title: "Product of the Last K Numbers"
difficulty: Medium
category: Design
tags: [Array, Math, Design, Data Stream, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/product-of-the-last-k-numbers"
---

# Product of the Last K Numbers / Product of the Last K Numbers

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight) | [Insert Delete GetRandom O(1) - Duplicates allowed](https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Product of the Last K Numbers example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Product of the Last K Numbers. ([LeetCode](https://leetcode.com/problems/product-of-the-last-k-numbers))

Difficulty: Medium | Acceptance: 62.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/product-of-the-last-k-numbers) for full constraints

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
function productOfTheLastKNumbersBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function productOfTheLastKNumbers(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(productOfTheLastKNumbers(/* example 1 */)); // expected
// console.log(productOfTheLastKNumbers(/* example 2 */)); // expected
// console.log(productOfTheLastKNumbers(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight) — same pattern: Prefix Sum
- [Insert Delete GetRandom O(1) - Duplicates allowed](https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed) — same pattern: Math
- [Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable) — same pattern: Prefix Sum
- [Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream) — same pattern: Queue
- [Product of the Last K Numbers — LeetCode](https://leetcode.com/problems/product-of-the-last-k-numbers) — problem page
