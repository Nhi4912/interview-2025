---
layout: page
title: "Count the Number of Square-Free Subsets"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming, Bit Manipulation, Bitmask]
leetcode_url: "https://leetcode.com/problems/count-the-number-of-square-free-subsets"
---

# Count the Number of Square-Free Subsets / Count the Number of Square-Free Subsets

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [The Number of Good Subsets](https://leetcode.com/problems/the-number-of-good-subsets) | [Minimum Number of Lines to Cover Points](https://leetcode.com/problems/minimum-number-of-lines-to-cover-points)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.

**Pattern Recognition:**

- Signal: "min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**
- Bài này thuộc dạng Dynamic Programming — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Count the Number of Square-Free Subsets example:**

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

Count the Number of Square-Free Subsets. ([LeetCode](https://leetcode.com/problems/count-the-number-of-square-free-subsets))

Difficulty: Medium | Acceptance: 25.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/count-the-number-of-square-free-subsets) for full constraints

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
function countTheNumberOfSquareFreeSubsetsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Dynamic Programming
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function countTheNumberOfSquareFreeSubsets(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Dynamic Programming
  // Hint: Define dp state, find transition, optimize space if possible
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(countTheNumberOfSquareFreeSubsets(/* example 1 */)); // expected
// console.log(countTheNumberOfSquareFreeSubsets(/* example 2 */)); // expected
// console.log(countTheNumberOfSquareFreeSubsets(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [The Number of Good Subsets](https://leetcode.com/problems/the-number-of-good-subsets) — same pattern: Dynamic Programming
- [Minimum Number of Lines to Cover Points](https://leetcode.com/problems/minimum-number-of-lines-to-cover-points) — same pattern: Backtracking
- [Maximize Score After N Operations](https://leetcode.com/problems/maximize-score-after-n-operations) — same pattern: Backtracking
- [Partition Array Into Two Arrays to Minimize Sum Difference](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference) — same pattern: Two Pointers
- [Count the Number of Square-Free Subsets — LeetCode](https://leetcode.com/problems/count-the-number-of-square-free-subsets) — problem page
