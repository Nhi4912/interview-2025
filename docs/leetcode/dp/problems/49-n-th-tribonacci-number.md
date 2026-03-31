---
layout: page
title: "N-th Tribonacci Number"
difficulty: Easy
category: Dynamic Programming
tags: [Math, Dynamic Programming, Memoization]
leetcode_url: "https://leetcode.com/problems/n-th-tribonacci-number"
---

# N-th Tribonacci Number / N-th Tribonacci Number

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Fibonacci Number](https://leetcode.com/problems/fibonacci-number) | [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.

**Pattern Recognition:**

- Signal: "min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**
- Bài này thuộc dạng Dynamic Programming — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — N-th Tribonacci Number example:**

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

N-th Tribonacci Number. ([LeetCode](https://leetcode.com/problems/n-th-tribonacci-number))

Difficulty: Easy | Acceptance: 63.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/n-th-tribonacci-number) for full constraints

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
function nThTribonacciNumberBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Dynamic Programming
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function nThTribonacciNumber(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Dynamic Programming
  // Hint: Define dp state, find transition, optimize space if possible
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(nThTribonacciNumber(/* example 1 */)); // expected
// console.log(nThTribonacciNumber(/* example 2 */)); // expected
// console.log(nThTribonacciNumber(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Fibonacci Number](https://leetcode.com/problems/fibonacci-number) — same pattern: Dynamic Programming
- [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses) — same pattern: Dynamic Programming
- [The Score of Students Solving Math Expression](https://leetcode.com/problems/the-score-of-students-solving-math-expression) — same pattern: Dynamic Programming
- [Flip Game II](https://leetcode.com/problems/flip-game-ii) — same pattern: Backtracking
- [N-th Tribonacci Number — LeetCode](https://leetcode.com/problems/n-th-tribonacci-number) — problem page
