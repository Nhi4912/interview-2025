---
layout: page
title: "Maximum Length of Subarray With Positive Product"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/maximum-length-of-subarray-with-positive-product"
---

# Maximum Length of Subarray With Positive Product / Maximum Length of Subarray With Positive Product

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.

**Pattern Recognition:**

- Signal: "min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**
- Bài này thuộc dạng Dynamic Programming — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Length of Subarray With Positive Product example:**

```
dp table:
i:     0    1    2    3    4    ...
dp[i]: base  ?    ?    ?    ?

Transition: dp[i] = f(dp[i-1], dp[i-2], ...)
Base case:  dp[0] = ...
Answer:     dp[n] or max(dp)
```

---

## Problem Description

Maximum Length of Subarray With Positive Product. ([LeetCode](https://leetcode.com/problems/maximum-length-of-subarray-with-positive-product))

Difficulty: Medium | Acceptance: 44.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-length-of-subarray-with-positive-product) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Cần giá trị tối ưu hay cần reconstruct solution?" / Need optimal value or actual solution path?
2. **Brute force**: "Recursion O(2^n)" → add memoization → bottom-up DP / Start recursive, add memo, convert to iterative
3. **State definition**: "Xác định dp[i] nghĩa là gì, transition từ đâu" / Define state clearly before coding
4. **Edge cases**: "Base cases, n=0/1, negative values, overflow" / Check base cases and boundary values
5. **Space optimize**: "Nếu dp[i] chỉ phụ thuộc dp[i-1] → dùng 2 biến thay vì mảng" / Roll variables if possible

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumLengthOfSubarrayWithPositiveProductBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Dynamic Programming
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumLengthOfSubarrayWithPositiveProduct(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Dynamic Programming
  // Hint: Define dp state, find transition, optimize space if possible
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumLengthOfSubarrayWithPositiveProduct(/* example 1 */)); // expected
// console.log(maximumLengthOfSubarrayWithPositiveProduct(/* example 2 */)); // expected
// console.log(maximumLengthOfSubarrayWithPositiveProduct(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Jump Game II](https://leetcode.com/problems/jump-game-ii) — same pattern: Dynamic Programming
- [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) — same pattern: Prefix Sum
- [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) — same pattern: Dynamic Programming
- [Minimum Number of Taps to Open to Water a Garden](https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden) — same pattern: Dynamic Programming
- [Maximum Length of Subarray With Positive Product — LeetCode](https://leetcode.com/problems/maximum-length-of-subarray-with-positive-product) — problem page
