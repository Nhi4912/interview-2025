---
layout: page
title: "Number of Distinct Roll Sequences"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming, Memoization]
leetcode_url: "https://leetcode.com/problems/number-of-distinct-roll-sequences"
---

# Number of Distinct Roll Sequences / Number of Distinct Roll Sequences

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Fibonacci Number](https://leetcode.com/problems/fibonacci-number) | [Word Break II](https://leetcode.com/problems/word-break-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.

**Pattern Recognition:**

- Signal: "min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**
- Bài này thuộc dạng Dynamic Programming — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of Distinct Roll Sequences example:**

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

Number of Distinct Roll Sequences. ([LeetCode](https://leetcode.com/problems/number-of-distinct-roll-sequences))

Difficulty: Hard | Acceptance: 57.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-distinct-roll-sequences) for full constraints

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
function numberOfDistinctRollSequencesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Dynamic Programming
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfDistinctRollSequences(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Dynamic Programming
  // Hint: Define dp state, find transition, optimize space if possible
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfDistinctRollSequences(/* example 1 */)); // expected
// console.log(numberOfDistinctRollSequences(/* example 2 */)); // expected
// console.log(numberOfDistinctRollSequences(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Fibonacci Number](https://leetcode.com/problems/fibonacci-number) — same pattern: Dynamic Programming
- [Word Break II](https://leetcode.com/problems/word-break-ii) — same pattern: Trie
- [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) — same pattern: Topological Sort
- [N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number) — same pattern: Dynamic Programming
- [Number of Distinct Roll Sequences — LeetCode](https://leetcode.com/problems/number-of-distinct-roll-sequences) — problem page
