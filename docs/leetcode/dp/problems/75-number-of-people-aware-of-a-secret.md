---
layout: page
title: "Number of People Aware of a Secret"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming, Queue, Simulation]
leetcode_url: "https://leetcode.com/problems/number-of-people-aware-of-a-secret"
---

# Number of People Aware of a Secret / Number of People Aware of a Secret

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game) | [Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.

**Pattern Recognition:**

- Signal: "min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**
- Bài này thuộc dạng Dynamic Programming — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of People Aware of a Secret example:**

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

Number of People Aware of a Secret. ([LeetCode](https://leetcode.com/problems/number-of-people-aware-of-a-secret))

Difficulty: Medium | Acceptance: 46.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-people-aware-of-a-secret) for full constraints

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
function numberOfPeopleAwareOfASecretBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Dynamic Programming
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfPeopleAwareOfASecret(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Dynamic Programming
  // Hint: Define dp state, find transition, optimize space if possible
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfPeopleAwareOfASecret(/* example 1 */)); // expected
// console.log(numberOfPeopleAwareOfASecret(/* example 2 */)); // expected
// console.log(numberOfPeopleAwareOfASecret(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game) — same pattern: Queue
- [Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray) — same pattern: Monotonic Queue
- [Time Needed to Rearrange a Binary String](https://leetcode.com/problems/time-needed-to-rearrange-a-binary-string) — same pattern: Dynamic Programming
- [Time Needed to Buy Tickets](https://leetcode.com/problems/time-needed-to-buy-tickets) — same pattern: Queue
- [Number of People Aware of a Secret — LeetCode](https://leetcode.com/problems/number-of-people-aware-of-a-secret) — problem page
