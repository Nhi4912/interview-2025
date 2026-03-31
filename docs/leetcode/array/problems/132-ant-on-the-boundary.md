---
layout: page
title: "Ant on the Boundary"
difficulty: Easy
category: Array
tags: [Array, Simulation, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/ant-on-the-boundary"
---

# Ant on the Boundary / Ant on the Boundary

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Car Pooling](https://leetcode.com/problems/car-pooling) | [Spiral Matrix](https://leetcode.com/problems/spiral-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Ant on the Boundary example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Ant on the Boundary. ([LeetCode](https://leetcode.com/problems/ant-on-the-boundary))

Difficulty: Easy | Acceptance: 73.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/ant-on-the-boundary) for full constraints

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
function antOnTheBoundaryBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function antOnTheBoundary(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(antOnTheBoundary(/* example 1 */)); // expected
// console.log(antOnTheBoundary(/* example 2 */)); // expected
// console.log(antOnTheBoundary(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Car Pooling](https://leetcode.com/problems/car-pooling) — same pattern: Prefix Sum
- [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) — same pattern: Matrix / Simulation
- [Text Justification](https://leetcode.com/problems/text-justification) — same pattern: Matrix / Simulation
- [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) — same pattern: Prefix Sum
- [Ant on the Boundary — LeetCode](https://leetcode.com/problems/ant-on-the-boundary) — problem page
