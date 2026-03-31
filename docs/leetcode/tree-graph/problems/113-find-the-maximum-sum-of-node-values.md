---
layout: page
title: "Find the Maximum Sum of Node Values"
difficulty: Hard
category: Tree-Graph
tags: [Array, Dynamic Programming, Greedy, Bit Manipulation, Tree]
leetcode_url: "https://leetcode.com/problems/find-the-maximum-sum-of-node-values"
---

# Find the Maximum Sum of Node Values / Find the Maximum Sum of Node Values

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) | [Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.

**Pattern Recognition:**

- Signal: "min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**
- Bài này thuộc dạng Dynamic Programming — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find the Maximum Sum of Node Values example:**

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

Find the Maximum Sum of Node Values. ([LeetCode](https://leetcode.com/problems/find-the-maximum-sum-of-node-values))

Difficulty: Hard | Acceptance: 69.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-the-maximum-sum-of-node-values) for full constraints

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
function findTheMaximumSumOfNodeValuesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Dynamic Programming
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findTheMaximumSumOfNodeValues(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Dynamic Programming
  // Hint: Define dp state, find transition, optimize space if possible
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findTheMaximumSumOfNodeValues(/* example 1 */)); // expected
// console.log(findTheMaximumSumOfNodeValues(/* example 2 */)); // expected
// console.log(findTheMaximumSumOfNodeValues(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) — same pattern: Dynamic Programming
- [Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum) — same pattern: Two Pointers
- [Minimize the Maximum Difference of Pairs](https://leetcode.com/problems/minimize-the-maximum-difference-of-pairs) — same pattern: Dynamic Programming
- [Greatest Sum Divisible by Three](https://leetcode.com/problems/greatest-sum-divisible-by-three) — same pattern: Dynamic Programming
- [Find the Maximum Sum of Node Values — LeetCode](https://leetcode.com/problems/find-the-maximum-sum-of-node-values) — problem page
