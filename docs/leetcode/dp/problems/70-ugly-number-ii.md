---
layout: page
title: "Ugly Number II"
difficulty: Medium
category: Dynamic Programming
tags: [Hash Table, Math, Dynamic Programming, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/ugly-number-ii"
---

# Ugly Number II / Ugly Number II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Count Number of Texts](https://leetcode.com/problems/count-number-of-texts) | [The Number of Beautiful Subsets](https://leetcode.com/problems/the-number-of-beautiful-subsets)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.

**Pattern Recognition:**

- Signal: "min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**
- Bài này thuộc dạng Dynamic Programming — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Ugly Number II example:**

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

Ugly Number II. ([LeetCode](https://leetcode.com/problems/ugly-number-ii))

Difficulty: Medium | Acceptance: 49.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/ugly-number-ii) for full constraints

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
function uglyNumberIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Dynamic Programming
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function uglyNumberIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Dynamic Programming
  // Hint: Define dp state, find transition, optimize space if possible
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(uglyNumberIi(/* example 1 */)); // expected
// console.log(uglyNumberIi(/* example 2 */)); // expected
// console.log(uglyNumberIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Count Number of Texts](https://leetcode.com/problems/count-number-of-texts) — same pattern: Dynamic Programming
- [The Number of Beautiful Subsets](https://leetcode.com/problems/the-number-of-beautiful-subsets) — same pattern: Backtracking
- [Minimum Number of Lines to Cover Points](https://leetcode.com/problems/minimum-number-of-lines-to-cover-points) — same pattern: Backtracking
- [Happy Number](https://leetcode.com/problems/happy-number) — same pattern: Two Pointers
- [Ugly Number II — LeetCode](https://leetcode.com/problems/ugly-number-ii) — problem page
