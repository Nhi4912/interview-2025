---
layout: page
title: "Count All Valid Pickup and Delivery Options"
difficulty: Hard
category: Dynamic Programming
tags: [Math, Dynamic Programming, Combinatorics]
leetcode_url: "https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options"
---

# Count All Valid Pickup and Delivery Options / Count All Valid Pickup and Delivery Options

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i) | [Find the Count of Monotonic Pairs II](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.

**Pattern Recognition:**

- Signal: "min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**
- Bài này thuộc dạng Dynamic Programming — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Count All Valid Pickup and Delivery Options example:**

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

Count All Valid Pickup and Delivery Options. ([LeetCode](https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options))

Difficulty: Hard | Acceptance: 64.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options) for full constraints

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
function countAllValidPickupAndDeliveryOptionsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Dynamic Programming
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function countAllValidPickupAndDeliveryOptions(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Dynamic Programming
  // Hint: Define dp state, find transition, optimize space if possible
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(countAllValidPickupAndDeliveryOptions(/* example 1 */)); // expected
// console.log(countAllValidPickupAndDeliveryOptions(/* example 2 */)); // expected
// console.log(countAllValidPickupAndDeliveryOptions(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i) — same pattern: Prefix Sum
- [Find the Count of Monotonic Pairs II](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii) — same pattern: Prefix Sum
- [Number of Music Playlists](https://leetcode.com/problems/number-of-music-playlists) — same pattern: Dynamic Programming
- [Find the Derangement of An Array](https://leetcode.com/problems/find-the-derangement-of-an-array) — same pattern: Dynamic Programming
- [Count All Valid Pickup and Delivery Options — LeetCode](https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options) — problem page
