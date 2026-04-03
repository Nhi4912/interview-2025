---
layout: page
title: "Longest Unequal Adjacent Groups Subsequence II"
difficulty: Medium
category: Dynamic Programming
tags: [Array, String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/longest-unequal-adjacent-groups-subsequence-ii"
---

# Longest Unequal Adjacent Groups Subsequence II / Longest Unequal Adjacent Groups Subsequence II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest String Chain](https://leetcode.com/problems/longest-string-chain) | [Word Break II](https://leetcode.com/problems/word-break-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.

**Pattern Recognition:**

- Signal: "min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**
- Bài này thuộc dạng Dynamic Programming — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Longest Unequal Adjacent Groups Subsequence II example:**

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

Longest Unequal Adjacent Groups Subsequence II. ([LeetCode](https://leetcode.com/problems/longest-unequal-adjacent-groups-subsequence-ii))

Difficulty: Medium | Acceptance: 51.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/longest-unequal-adjacent-groups-subsequence-ii) for full constraints

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
function longestUnequalAdjacentGroupsSubsequenceIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Dynamic Programming
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function longestUnequalAdjacentGroupsSubsequenceIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Dynamic Programming
  // Hint: Define dp state, find transition, optimize space if possible
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(longestUnequalAdjacentGroupsSubsequenceIi(/* example 1 */)); // expected
// console.log(longestUnequalAdjacentGroupsSubsequenceIi(/* example 2 */)); // expected
// console.log(longestUnequalAdjacentGroupsSubsequenceIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Longest String Chain](https://leetcode.com/problems/longest-string-chain) — same pattern: Two Pointers
- [Word Break II](https://leetcode.com/problems/word-break-ii) — same pattern: Trie
- [Number of Ways to Form a Target String Given a Dictionary](https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary) — same pattern: Dynamic Programming
- [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences) — same pattern: Trie
- [Longest Unequal Adjacent Groups Subsequence II — LeetCode](https://leetcode.com/problems/longest-unequal-adjacent-groups-subsequence-ii) — problem page
