---
layout: page
title: "Count All Valid Pickup and Delivery Options"
difficulty: Hard
category: Dynamic Programming
tags: [Math, Dynamic Programming, Combinatorics]
leetcode_url: "https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options"
---

# Count All Valid Pickup and Delivery Options / Đếm Tất Cả Lựa Chọn Giao Hàng Hợp Lệ

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Combinatorics / DP
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Number of Music Playlists](https://leetcode.com/problems/number-of-music-playlists) | [Find the Derangement of An Array](https://leetcode.com/problems/find-the-derangement-of-an-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Khi đã có 2(k-1) vị trí xếp, bạn cần chèn cặp thứ k (P_k lấy hàng, D_k giao hàng) vào (2k-1) khe trống. P_k và D_k phải theo thứ tự, nên số cách = C(2k-1, 2) + (2k-1) = k\*(2k-1).

**Pattern Recognition:**

- Khi thêm cặp thứ k vào dãy 2(k-1) phần tử: có (2k-1) khe trống
- Chọn 2 vị trí cho P_k và D_k (P_k trước D_k): = k \* (2k-1) cách
- `f(k) = f(k-1) * k * (2k-1)` mod 10^9+7

**Visual — Combinatorics:**

```
n=1: 1 way:   P1 D1
n=2: insert P2,D2 into 3 slots of "P1 D1":
  _P1_D1_  (3 slots)
  Choose 2 of 3 slots, P2 before D2:
  C(3,2) + 3 (same slot) = 3 + 3 = 6 ✓

f(1) = 1
f(2) = 1 * 2 * 3 = 6
f(3) = 6 * 3 * 5 = 90
```

---

## Problem Description

Given `n` orders with pickup and delivery for each, count the number of valid orderings of all `2n` operations such that for each order `i`, pickup `P_i` always happens before delivery `D_i`. Return the count modulo `10^9 + 7`. ([LeetCode #1359](https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options))

**Example 1:** `n = 1` → `1` (only [P1, D1])
**Example 2:** `n = 2` → `6` (P1,P2,D1,D2 and 5 others)

Constraints: `1 <= n <= 500`

---

## 📝 Interview Tips

1. **Clarify**: "Pi phải trước Di trong kết quả cuối cùng / Each Pi must strictly precede Di in the sequence"
2. **Combinatorics key**: "Khi chèn cặp thứ k, có 2k-1 khe trống, chọn 2 vị trí (có thứ tự) / Insert k-th pair into available slots"
3. **Counting formula**: "C(2k-1,2) cách chọn 2 khe khác nhau + (2k-1) cách chọn cùng khe (P trước D) = k\*(2k-1)"
4. **Modular arithmetic**: "Nhân tất cả với mod 10^9+7, cẩn thận overflow khi dùng BigInt / Use modular multiply"
5. **DP formulation**: "dp[i] = dp[i-1] _ i _ (2i-1) % MOD / Clean DP recurrence"
6. **Edge cases**: "n=1 → 1, n=500 → rất lớn nên cần mod / Large n requires BigInt or careful modular mul"

---

## Solutions

```typescript
/**
 * Solution 1: Combinatorics DP
 * Time: O(n) — single loop from 1 to n
 * Space: O(1) — rolling single variable
 *
 * Formula: f(k) = f(k-1) * k * (2k-1) mod MOD
 * Reasoning: inserting k-th pair into 2k-1 available slots,
 * P_k before D_k: k*(2k-1) ways.
 */
function countOrders(n: number): number {
  const MOD = 1_000_000_007n;
  let result = 1n;

  for (let k = 2; k <= n; k++) {
    // k ways to pick slot for P_k relative to D_k, (2k-1) total slot pairs
    result = (result * BigInt(k) * BigInt(2 * k - 1)) % MOD;
  }
  return Number(result);
}

/**
 * Solution 2: Mathematical Closed Form
 * Time: O(n)
 * Space: O(1)
 *
 * Total permutations of 2n elements = (2n)!
 * Each pair (Pi,Di) must be ordered → divide by 2^n
 * f(n) = (2n)! / 2^n mod MOD
 * Equivalent to the DP since: product_{k=1}^{n} k*(2k-1) = (2n)!/2^n
 */
function countOrdersMath(n: number): number {
  const MOD = 1_000_000_007n;
  let result = 1n;
  const N = BigInt(n);

  // Compute (2n)! / 2^n mod MOD using Fermat's little theorem for modular inverse
  // Or simply iterate: for k from 1 to n: result *= k * (2k-1)
  for (let k = 1n; k <= N; k++) {
    result = (result * k * (2n * k - 1n)) % MOD;
  }
  return Number(result);
}

// === Test Cases ===
console.log(countOrders(1)); // 1
console.log(countOrders(2)); // 6
console.log(countOrders(3)); // 90
console.log(countOrders(7)); // 681080400
```

---

## 🔗 Related Problems

| Problem                                                                                                  | Pattern            | Difficulty |
| -------------------------------------------------------------------------------------------------------- | ------------------ | ---------- |
| [Number of Music Playlists](https://leetcode.com/problems/number-of-music-playlists)                     | DP + Combinatorics | Hard       |
| [Find the Derangement of An Array](https://leetcode.com/problems/find-the-derangement-of-an-array)       | DP                 | Medium     |
| [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i) | DP + Prefix Sum    | Hard       |
| [Unique Permutations](https://leetcode.com/problems/permutations-ii)                                     | Backtracking       | Medium     |
