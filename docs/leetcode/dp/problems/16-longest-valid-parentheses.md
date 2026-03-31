---
layout: page
title: "Longest Valid Parentheses"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming, Stack]
leetcode_url: "https://leetcode.com/problems/longest-valid-parentheses"
---

# Longest Valid Parentheses / Longest Valid Parentheses

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 19 companies
> **See also**: [Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string) | [The Score of Students Solving Math Expression](https://leetcode.com/problems/the-score-of-students-solving-math-expression)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.

**Pattern Recognition:**

- Signal: "min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**
- Bài này thuộc dạng Dynamic Programming — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Longest Valid Parentheses example:**

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

Longest Valid Parentheses. ([LeetCode](https://leetcode.com/problems/longest-valid-parentheses))

Difficulty: Hard | Acceptance: 36.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/longest-valid-parentheses) for full constraints

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
function longestValidParenthesesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Dynamic Programming
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function longestValidParentheses(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Dynamic Programming
  // Hint: Define dp state, find transition, optimize space if possible
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(longestValidParentheses(/* example 1 */)); // expected
// console.log(longestValidParentheses(/* example 2 */)); // expected
// console.log(longestValidParentheses(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string) — same pattern: Dynamic Programming
- [The Score of Students Solving Math Expression](https://leetcode.com/problems/the-score-of-students-solving-math-expression) — same pattern: Dynamic Programming
- [Minimum Deletions to Make String Balanced](https://leetcode.com/problems/minimum-deletions-to-make-string-balanced) — same pattern: Dynamic Programming
- [Zuma Game](https://leetcode.com/problems/zuma-game) — same pattern: Dynamic Programming
- [Longest Valid Parentheses — LeetCode](https://leetcode.com/problems/longest-valid-parentheses) — problem page
