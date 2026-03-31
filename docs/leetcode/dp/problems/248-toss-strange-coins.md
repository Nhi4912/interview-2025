---
layout: page
title: "Toss Strange Coins"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming, Probability and Statistics]
leetcode_url: "https://leetcode.com/problems/toss-strange-coins"
---

# Toss Strange Coins / Toss Strange Coins

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Predict the Winner](https://leetcode.com/problems/predict-the-winner) | [Count Strictly Increasing Subarrays](https://leetcode.com/problems/count-strictly-increasing-subarrays)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.

**Pattern Recognition:**

- Signal: "min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**
- Bài này thuộc dạng Dynamic Programming — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Toss Strange Coins example:**

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

Toss Strange Coins. ([LeetCode](https://leetcode.com/problems/toss-strange-coins))

Difficulty: Medium | Acceptance: 58.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/toss-strange-coins) for full constraints

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
function tossStrangeCoinsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Dynamic Programming
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function tossStrangeCoins(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Dynamic Programming
  // Hint: Define dp state, find transition, optimize space if possible
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(tossStrangeCoins(/* example 1 */)); // expected
// console.log(tossStrangeCoins(/* example 2 */)); // expected
// console.log(tossStrangeCoins(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Predict the Winner](https://leetcode.com/problems/predict-the-winner) — same pattern: Dynamic Programming
- [Count Strictly Increasing Subarrays](https://leetcode.com/problems/count-strictly-increasing-subarrays) — same pattern: Dynamic Programming
- [The Number of Good Subsets](https://leetcode.com/problems/the-number-of-good-subsets) — same pattern: Dynamic Programming
- [Airplane Seat Assignment Probability](https://leetcode.com/problems/airplane-seat-assignment-probability) — same pattern: Dynamic Programming
- [Toss Strange Coins — LeetCode](https://leetcode.com/problems/toss-strange-coins) — problem page
