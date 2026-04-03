---
layout: page
title: "Find the Derangement of An Array"
difficulty: Medium
category: Dynamic Programming
tags: [Math, Dynamic Programming, Combinatorics]
leetcode_url: "https://leetcode.com/problems/find-the-derangement-of-an-array"
---

# Find the Derangement of An Array / Đếm Số Hoán Vị Lệch Vị

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Count All Valid Pickup and Delivery Options](https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options) | [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chia thư vào hộp — mỗi bức thư KHÔNG được vào hộp của chính nó.
Bạn có thể đặt thư `i` vào bất kỳ hộp `j ≠ i` nào. Câu hỏi: có bao nhiêu cách sắp xếp hoàn toàn như vậy?

**Pattern Recognition:**

- Signal: "permutation where no element stays in original position" → **Derangement DP**
- Recurrence: `D(n) = (n-1) * (D(n-1) + D(n-2))` — phần tử `n` có thể swap với bất kỳ `n-1` phần tử nào
- Key insight: Base cases `D(1)=0`, `D(2)=1` → rolling variables thay mảng

**Visual — Derangement xây dần từ base cases:**

```
D(1) = 0     (chỉ có [1], luôn bị lệch → 0 cách)
D(2) = 1     ([2,1] — hoán đổi cho nhau)
D(3) = 2*( D(2)+D(1) ) = 2*(1+0) = 2   → [2,3,1], [3,1,2]
D(4) = 3*( D(3)+D(2) ) = 3*(2+1) = 9
D(n) = (n-1)*(D(n-1)+D(n-2))   mod 1e9+7

Index:  1  2  3  4   5   6 ...
D(n):   0  1  2  9  44 265 ...
```

---

## Problem Description

Given an integer `n`, return the number of **derangements** of the array `[1, 2, ..., n]`
(permutations where **no** element appears at its original 1-indexed position). Answer modulo `10^9 + 7`.

```
Example 1: n = 3  → 2      ([2,3,1] and [3,1,2])
Example 2: n = 2  → 1      ([2,1])
Example 3: n = 1  → 0      (only [1], which is "in place")
```

Constraints: `1 <= n <= 10^6`

---

## 📝 Interview Tips

1. **Clarify**: "Derangement = zero fixed-points permutation" — confirm mod 10^9+7 requirement
2. **Derive recurrence**: Place element `n` in slot `j` (n-1 choices); swap `j` back → `D(n-1)`, don't swap → `D(n-2)`
3. **Base cases**: `D(1)=0`, `D(2)=1` — spell them out before writing the loop
4. **Overflow**: Use `BigInt` for intermediate products since `(n-1) * D(n-1)` can exceed 2^53 for large `n`
5. **Space optimize**: `dp[i]` only needs `dp[i-1]` and `dp[i-2]` → two rolling variables, O(1) space
6. **Edge case**: `n=1` returns 0 immediately; memoized recursion must guard this to avoid infinite descent

---

## Solutions

```typescript
const MOD = 1_000_000_007n;

// ─── Solution 1: Recursive with Memoization ───────────────────────────────
// Time: O(n)  Space: O(n)  — top-down, intuitive
function findDerangementMemo(n: number): number {
  const memo = new Map<number, bigint>();

  function D(k: number): bigint {
    if (k === 1) return 0n;
    if (k === 2) return 1n;
    if (memo.has(k)) return memo.get(k)!;
    const res = (BigInt(k - 1) * ((D(k - 1) + D(k - 2)) % MOD)) % MOD;
    memo.set(k, res);
    return res;
  }

  return Number(D(n));
}

// ─── Solution 2: Iterative with Rolling Variables ─────────────────────────
// Time: O(n)  Space: O(1)  — optimal, interview-preferred
function findDerangement(n: number): number {
  if (n === 1) return 0;
  if (n === 2) return 1;

  let prev2 = 0n; // D(1)
  let prev1 = 1n; // D(2)

  for (let i = 3; i <= n; i++) {
    const curr = (BigInt(i - 1) * ((prev1 + prev2) % MOD)) % MOD;
    prev2 = prev1;
    prev1 = curr;
  }

  return Number(prev1);
}

// === Test Cases ===
console.log(findDerangement(1)); // 0
console.log(findDerangement(2)); // 1
console.log(findDerangement(3)); // 2
console.log(findDerangement(4)); // 9
console.log(findDerangement(5)); // 44
console.log(findDerangement(6)); // 265

console.log(findDerangementMemo(3)); // 2
console.log(findDerangementMemo(5)); // 44
```

---

## 🔗 Related Problems

| Problem                                                                                                                  | Pattern             | Notes                                                |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------- | ---------------------------------------------------- |
| [Count All Valid Pickup and Delivery Options](https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options) | Combinatorics DP    | Similar modular product recurrence                   |
| [Number of Music Playlists](https://leetcode.com/problems/number-of-music-playlists)                                     | DP with constraints | No repeat within window — related no-repeat counting |
| [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i)                 | Prefix Sum DP       | Multi-dimensional state DP                           |
| [Find the Count of Monotonic Pairs II](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii)               | Prefix Sum DP       | Optimised with prefix sums                           |
