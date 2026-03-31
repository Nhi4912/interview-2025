---
layout: page
title: "Max Increase to Keep City Skyline"
difficulty: Medium
category: Array
tags: [Array, Greedy, Matrix]
leetcode_url: "https://leetcode.com/problems/max-increase-to-keep-city-skyline"
---

# Max Increase to Keep City Skyline / Max Increase to Keep City Skyline

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Reconstruct a 2-Row Binary Matrix](https://leetcode.com/problems/reconstruct-a-2-row-binary-matrix) | [Largest Submatrix With Rearrangements](https://leetcode.com/problems/largest-submatrix-with-rearrangements)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ăn buffet — mỗi lần bạn chọn món ngon nhất hiện tại. Nếu chứng minh được rằng chọn tham lam từng bước vẫn tối ưu toàn cục, thì Greedy là đáp án.

**Pattern Recognition:**

- Signal: "locally optimal → globally optimal" + "sorting + selection" → **Greedy**
- Bài này thuộc dạng Greedy — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Max Increase to Keep City Skyline example:**

```
// TODO: Add step-by-step visual for Greedy
// Show one complete example with state at each step
```

---

## Problem Description

Max Increase to Keep City Skyline. ([LeetCode](https://leetcode.com/problems/max-increase-to-keep-city-skyline))

Difficulty: Medium | Acceptance: 86.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/max-increase-to-keep-city-skyline) for full constraints

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
function maxIncreaseToKeepCitySkylineBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Greedy
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maxIncreaseToKeepCitySkyline(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Greedy
  // Hint: Sort by key metric, make locally optimal choice at each step
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maxIncreaseToKeepCitySkyline(/* example 1 */)); // expected
// console.log(maxIncreaseToKeepCitySkyline(/* example 2 */)); // expected
// console.log(maxIncreaseToKeepCitySkyline(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Reconstruct a 2-Row Binary Matrix](https://leetcode.com/problems/reconstruct-a-2-row-binary-matrix) — same pattern: Greedy
- [Largest Submatrix With Rearrangements](https://leetcode.com/problems/largest-submatrix-with-rearrangements) — same pattern: Greedy
- [Maximum Matrix Sum](https://leetcode.com/problems/maximum-matrix-sum) — same pattern: Greedy
- [Score After Flipping Matrix](https://leetcode.com/problems/score-after-flipping-matrix) — same pattern: Greedy
- [Max Increase to Keep City Skyline — LeetCode](https://leetcode.com/problems/max-increase-to-keep-city-skyline) — problem page
