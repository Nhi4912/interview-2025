---
layout: page
title: "Score After Flipping Matrix"
difficulty: Medium
category: Array
tags: [Array, Greedy, Bit Manipulation, Matrix]
leetcode_url: "https://leetcode.com/problems/score-after-flipping-matrix"
---

# Score After Flipping Matrix / Score After Flipping Matrix

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Shortest Path to Get All Keys](https://leetcode.com/problems/shortest-path-to-get-all-keys) | [Reconstruct a 2-Row Binary Matrix](https://leetcode.com/problems/reconstruct-a-2-row-binary-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ăn buffet — mỗi lần bạn chọn món ngon nhất hiện tại. Nếu chứng minh được rằng chọn tham lam từng bước vẫn tối ưu toàn cục, thì Greedy là đáp án.

**Pattern Recognition:**

- Signal: "locally optimal → globally optimal" + "sorting + selection" → **Greedy**
- Bài này thuộc dạng Greedy — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Score After Flipping Matrix example:**

```
// TODO: Add step-by-step visual for Greedy
// Show one complete example with state at each step
```

---

## Problem Description

Score After Flipping Matrix. ([LeetCode](https://leetcode.com/problems/score-after-flipping-matrix))

Difficulty: Medium | Acceptance: 80.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/score-after-flipping-matrix) for full constraints

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
function scoreAfterFlippingMatrixBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Greedy
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function scoreAfterFlippingMatrix(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Greedy
  // Hint: Sort by key metric, make locally optimal choice at each step
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(scoreAfterFlippingMatrix(/* example 1 */)); // expected
// console.log(scoreAfterFlippingMatrix(/* example 2 */)); // expected
// console.log(scoreAfterFlippingMatrix(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Shortest Path to Get All Keys](https://leetcode.com/problems/shortest-path-to-get-all-keys) — same pattern: BFS
- [Reconstruct a 2-Row Binary Matrix](https://leetcode.com/problems/reconstruct-a-2-row-binary-matrix) — same pattern: Greedy
- [Cinema Seat Allocation](https://leetcode.com/problems/cinema-seat-allocation) — same pattern: Greedy
- [Find the Maximum Sum of Node Values](https://leetcode.com/problems/find-the-maximum-sum-of-node-values) — same pattern: Dynamic Programming
- [Score After Flipping Matrix — LeetCode](https://leetcode.com/problems/score-after-flipping-matrix) — problem page
