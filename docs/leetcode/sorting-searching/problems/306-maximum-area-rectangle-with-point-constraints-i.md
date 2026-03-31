---
layout: page
title: "Maximum Area Rectangle With Point Constraints I"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Math, Binary Indexed Tree, Segment Tree, Geometry]
leetcode_url: "https://leetcode.com/problems/maximum-area-rectangle-with-point-constraints-i"
---

# Maximum Area Rectangle With Point Constraints I / Maximum Area Rectangle With Point Constraints I

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Segment Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximum Area Rectangle With Point Constraints II](https://leetcode.com/problems/maximum-area-rectangle-with-point-constraints-ii) | [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Cấu trúc dữ liệu cho range queries — cập nhật và truy vấn đoạn trong O(log n).

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Segment Tree**
- Bài này thuộc dạng Segment Tree — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Area Rectangle With Point Constraints I example:**

```
// TODO: Add step-by-step visual for Segment Tree
// Show one complete example with state at each step
```

---

## Problem Description

Maximum Area Rectangle With Point Constraints I. ([LeetCode](https://leetcode.com/problems/maximum-area-rectangle-with-point-constraints-i))

Difficulty: Medium | Acceptance: 49.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-area-rectangle-with-point-constraints-i) for full constraints

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
function maximumAreaRectangleWithPointConstraintsIBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Segment Tree
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumAreaRectangleWithPointConstraintsI(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Segment Tree
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumAreaRectangleWithPointConstraintsI(/* example 1 */)); // expected
// console.log(maximumAreaRectangleWithPointConstraintsI(/* example 2 */)); // expected
// console.log(maximumAreaRectangleWithPointConstraintsI(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Maximum Area Rectangle With Point Constraints II](https://leetcode.com/problems/maximum-area-rectangle-with-point-constraints-ii) — same pattern: Segment Tree
- [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) — same pattern: Heap / Priority Queue
- [Maximum Number of Visible Points](https://leetcode.com/problems/maximum-number-of-visible-points) — same pattern: Sliding Window
- [Minimum Area Rectangle](https://leetcode.com/problems/minimum-area-rectangle) — same pattern: Sorting
- [Maximum Area Rectangle With Point Constraints I — LeetCode](https://leetcode.com/problems/maximum-area-rectangle-with-point-constraints-i) — problem page
