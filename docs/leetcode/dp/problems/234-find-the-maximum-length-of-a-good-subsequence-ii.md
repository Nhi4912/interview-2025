---
layout: page
title: "Find the Maximum Length of a Good Subsequence II"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Hash Table, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/find-the-maximum-length-of-a-good-subsequence-ii"
---

# Find the Maximum Length of a Good Subsequence II / Find the Maximum Length of a Good Subsequence II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest String Chain](https://leetcode.com/problems/longest-string-chain) | [Word Break II](https://leetcode.com/problems/word-break-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.

**Pattern Recognition:**

- Signal: "min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**
- Bài này thuộc dạng Dynamic Programming — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find the Maximum Length of a Good Subsequence II example:**

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

Find the Maximum Length of a Good Subsequence II. ([LeetCode](https://leetcode.com/problems/find-the-maximum-length-of-a-good-subsequence-ii))

Difficulty: Hard | Acceptance: 24.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-the-maximum-length-of-a-good-subsequence-ii) for full constraints

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
function findTheMaximumLengthOfAGoodSubsequenceIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Dynamic Programming
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findTheMaximumLengthOfAGoodSubsequenceIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Dynamic Programming
  // Hint: Define dp state, find transition, optimize space if possible
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findTheMaximumLengthOfAGoodSubsequenceIi(/* example 1 */)); // expected
// console.log(findTheMaximumLengthOfAGoodSubsequenceIi(/* example 2 */)); // expected
// console.log(findTheMaximumLengthOfAGoodSubsequenceIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Longest String Chain](https://leetcode.com/problems/longest-string-chain) — same pattern: Two Pointers
- [Word Break II](https://leetcode.com/problems/word-break-ii) — same pattern: Trie
- [Delete and Earn](https://leetcode.com/problems/delete-and-earn) — same pattern: Dynamic Programming
- [Maximum Total Damage With Spell Casting](https://leetcode.com/problems/maximum-total-damage-with-spell-casting) — same pattern: Two Pointers
- [Find the Maximum Length of a Good Subsequence II — LeetCode](https://leetcode.com/problems/find-the-maximum-length-of-a-good-subsequence-ii) — problem page
