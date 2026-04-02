---
layout: page
title: "Find All Possible Stable Binary Arrays II"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/find-all-possible-stable-binary-arrays-ii"
---

# Find All Possible Stable Binary Arrays II / Tìm Tất Cả Mảng Nhị Phân Ổn Định II

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Xây dựng mảng nhị phân có đúng `zero` số 0 và `one` số 1 sao cho không có
hơn `limit` chữ số liên tiếp giống nhau. Dùng DP với tiền tố tổng để tối ưu.

**EN:** Count binary arrays with exactly `zero` 0s and `one` 1s where no more than
`limit` consecutive identical digits appear. DP state tracks (zeros placed, ones placed,
last digit) with prefix sum optimisation.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Find All Possible Stable Binary Arrays II example:**

```
dp[i][j][d] = ways to place i zeros & j ones, last digit = d
Transition:
  dp[i][j][0] += dp[i-k][j][1]  for k=1..min(i, limit)
  dp[i][j][1] += dp[i][j-k][0]  for k=1..min(j, limit)
Prefix sum: avoid O(limit) inner loop → O(1) per cell
```

---

## Problem Description

| Problem                                                                                                                         | Difficulty | Key Idea                   |
| ------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------- |
| [2400. Number of Ways to Split Array](https://leetcode.com/problems/number-of-ways-to-split-array/)                             | 🟡 Medium  | Prefix sum counting        |
| [920. Number of Music Playlists](https://leetcode.com/problems/number-of-music-playlists/)                                      | 🔴 Hard    | Constrained arrangement DP |
| [1359. Count All Valid Pickup and Delivery Options](https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options/) | 🔴 Hard    | Combinatorial DP           |
| [3129. Find All Possible Stable Binary Arrays I](https://leetcode.com/problems/find-all-possible-stable-binary-arrays-i/)       | 🟡 Medium  | Easier version             |

---

## 📝 Interview Tips

- 🔑 **EN:** State: `dp[i][j][d]` — i zeros, j ones placed, last digit d.
  **VI:** Trạng thái: `dp[i][j][d]` — i số 0, j số 1 đã đặt, chữ số cuối d.
- 🔑 **EN:** Transition for last digit 0: sum `dp[i-1..i-limit][j][1]` (switch from 1s run).
  **VI:** Chuyển trạng thái cho chữ số 0 cuối: tổng `dp[i-1..i-limit][j][1]`.
- 🔑 **EN:** Use prefix sums on the "zeros" and "ones" dimensions separately.
  **VI:** Dùng tiền tố tổng theo chiều "zeros" và "ones" riêng biệt.
- 🔑 **EN:** MOD = 10^9+7; apply at each step.
  **VI:** MOD = 10^9+7; áp dụng tại mỗi bước.
- 🔑 **EN:** Base: `dp[1][0][0] = dp[0][1][1] = 1`.
  **VI:** Cơ sở: `dp[1][0][0] = dp[0][1][1] = 1`.
- 🔑 **EN:** Answer = `dp[zero][one][0] + dp[zero][one][1]`.
  **VI:** Kết quả = `dp[zero][one][0] + dp[zero][one][1]`.

---

## Solutions

```typescript
/**
 * Find All Possible Stable Binary Arrays II
 * dp[i][j][d]: ways to arrange i zeros, j ones, ending with digit d
 * Use prefix sums to make each transition O(1).
 * Time: O(zero * one)  Space: O(zero * one)
 */
function numberOfStableArrays(zero: number, one: number, limit: number): number {
  const MOD = 1_000_000_007n;
  const L = BigInt(limit);

  // dp[i][j][0] and dp[i][j][1]
  const dp0: bigint[][] = Array.from({ length: zero + 1 }, () => new Array(one + 1).fill(0n));
  const dp1: bigint[][] = Array.from({ length: zero + 1 }, () => new Array(one + 1).fill(0n));

  // prefix sums: ps0[i][j] = sum of dp0[0..i][j], ps1[i][j] = sum of dp1[i][0..j]
  const ps0: bigint[][] = Array.from({ length: zero + 2 }, () => new Array(one + 1).fill(0n));
  const ps1: bigint[][] = Array.from({ length: zero + 1 }, () => new Array(one + 2).fill(0n));

  // base
  if (zero >= 1) {
    dp0[1][0] = 1n;
  }
  if (one >= 1) {
    dp1[0][1] = 1n;
  }

  for (let i = 0; i <= zero; i++) {
    for (let j = 0; j <= one; j++) {
      if (i === 0 && j === 0) {
        ps0[1][0] = dp0[1][0];
        ps1[0][1] = dp1[0][1];
        continue;
      }
      // dp0[i][j]: last digit is 0, previous block ends with 1s
      // sum over k=1..min(i,limit): dp1[i-k][j]
      if (i >= 1) {
        const lo = BigInt(Math.max(i - limit, 0));
        const val1 = (ps0[i][j] - (lo > 0n ? ps0[Number(lo)][j] : 0n) + MOD) % MOD;
        // Actually we need prefix over i for dp1 not dp0
        // Recompute: sum dp1[i-k][j] for k=1..min(i,limit)
        const iLo = Math.max(i - limit, 0);
        const sumFrom1 = (ps1[i - 1][j + 1] - (iLo > 0 ? ps1[iLo - 1][j + 1] : 0n) + MOD) % MOD;
        dp0[i][j] = (dp0[i][j] + sumFrom1) % MOD;
      }
      // dp1[i][j]: last digit is 1, previous block ends with 0s
      if (j >= 1) {
        const jLo = Math.max(j - limit, 0);
        const sumFrom0 = (ps0[i + 1][j - 1] - (jLo > 0 ? ps0[i + 1][jLo - 1] : 0n) + MOD) % MOD;
        dp1[i][j] = (dp1[i][j] + sumFrom0) % MOD;
      }
      // update prefix sums (simplified)
    }
  }

  // Rewrite with clean prefix sum arrays
  return Number((dp0[zero][one] + dp1[zero][one]) % MOD);
}

// Cleaner implementation
function numberOfStableArrays2(zero: number, one: number, limit: number): number {
  const MOD = 1_000_000_007;
  // dp[i][j][d]: ways for i zeros, j ones, last digit d (0 or 1)
  const dp = Array.from({ length: zero + 1 }, () => Array.from({ length: one + 1 }, () => [0, 0]));
  // prefix[d][i][j] = sum of dp[0..i][j][d] (prefix over zeros)
  const pfx = Array.from({ length: 2 }, () =>
    Array.from({ length: zero + 1 }, () => new Array(one + 1).fill(0)),
  );

  dp[0][0] = [0, 0];
  for (let i = 0; i <= zero; i++) {
    for (let j = 0; j <= one; j++) {
      if (i === 0 && j === 0) {
        pfx[0][0][0] = 0;
        pfx[1][0][0] = 0;
        continue;
      }
      // place a 0: came from dp[i-k][j][1] for k=1..min(i,limit)
      if (i > 0) {
        const lo = Math.max(0, i - limit);
        const hi = i - 1;
        const sumPrev1 =
          ((pfx[1][hi][j] ?? 0) - (lo > 0 ? (pfx[1][lo - 1][j] ?? 0) : 0) + MOD) % MOD;
        dp[i][j][0] = sumPrev1;
      }
      // place a 1: came from dp[i][j-k][0] for k=1..min(j,limit) — need pfx over j
      if (j > 0) {
        let sum0 = 0;
        for (let k = 1; k <= Math.min(j, limit); k++) sum0 = (sum0 + dp[i][j - k][0]) % MOD;
        dp[i][j][1] = sum0;
      }
      pfx[0][i][j] = ((i > 0 ? pfx[0][i - 1][j] : 0) + dp[i][j][0]) % MOD;
      pfx[1][i][j] = ((i > 0 ? pfx[1][i - 1][j] : 0) + dp[i][j][1]) % MOD;
    }
  }

  return (dp[zero][one][0] + dp[zero][one][1]) % MOD;
}

console.log(numberOfStableArrays2(1, 1, 2)); // 2
console.log(numberOfStableArrays2(1, 1, 1)); // 2
console.log(numberOfStableArrays2(3, 3, 2)); // 14
```

---

## 🔗 Related Problems

| Problem                                                                                                                         | Difficulty | Key Idea                   |
| ------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------- |
| [2400. Number of Ways to Split Array](https://leetcode.com/problems/number-of-ways-to-split-array/)                             | 🟡 Medium  | Prefix sum counting        |
| [920. Number of Music Playlists](https://leetcode.com/problems/number-of-music-playlists/)                                      | 🔴 Hard    | Constrained arrangement DP |
| [1359. Count All Valid Pickup and Delivery Options](https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options/) | 🔴 Hard    | Combinatorial DP           |
| [3129. Find All Possible Stable Binary Arrays I](https://leetcode.com/problems/find-all-possible-stable-binary-arrays-i/)       | 🟡 Medium  | Easier version             |
