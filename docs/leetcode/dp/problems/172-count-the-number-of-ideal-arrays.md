---
layout: page
title: "Count the Number of Ideal Arrays"
difficulty: Hard
category: Dynamic Programming
tags: [Math, Dynamic Programming, Combinatorics, Number Theory]
leetcode_url: "https://leetcode.com/problems/count-the-number-of-ideal-arrays"
---

# Count the Number of Ideal Arrays / Đếm Số Mảng Lý Tưởng

🔴 Hard | Dynamic Programming · Combinatorics · Number Theory

---

## 🧠 Intuition

**EN:** Every ideal array `a[0] ≤ a[1] ≤ … ≤ a[n-1]` where each element divides the next is equivalent to choosing a **divisibility chain** `v1 | v2 | … | vk ≤ maxValue` then distributing `n` slots into `k` groups (stars-and-bars = `C(n-1, k-1)`).

**VI:** Mỗi mảng lý tưởng tương đương chuỗi chia hết `v1 | v2 | … | vk`, sau đó dùng "sao và gạch ngang" phân bổ n vị trí → `C(n-1, k-1)`.

```
Chain 1|2|6 (len=3), n=4 positions:
  [1,1,2,6]  [1,2,2,6]  [1,2,6,6] → C(3,2)=3 ways

dp[v][k] = # chains of length k ending at v
Sieve: for each d, add dp[d][k-1] to all multiples v of d

Answer = Σ dp[v][k] * C(n-1, k-1)   for all v, k
Max chain length = log2(maxValue) ≤ 13
```

---

## 📝 Interview Tips

- 🔑 **EN:** Key: ideal array ↔ divisibility chain of length k placed in n slots via `C(n-1,k-1)`. **VI:** Mảng lý tưởng ↔ chuỗi chia hết độ dài k, xếp vào n vị trí theo C(n-1,k-1).
- 🔑 **EN:** Max chain length is `log2(maxValue)` ≤ 13 since each step at least doubles. **VI:** Độ dài chuỗi tối đa là log2(maxValue) ≤ 13 vì mỗi bước ít nhất nhân đôi.
- 🔑 **EN:** Sieve-style DP: `dp[v][k] += dp[d][k-1]` for every divisor `d` of `v`. **VI:** DP kiểu sàng: `dp[v][k] += dp[d][k-1]` với mọi ước d của v.
- 🔑 **EN:** Precompute Pascal's triangle mod 1e9+7 for combinations. **VI:** Tính trước tam giác Pascal mod 1e9+7.
- 🔑 **EN:** Outer loop over k (chain length), inner sieve over all d and multiples. **VI:** Vòng ngoài qua k, vòng trong sàng qua d và bội số.
- 🔑 **EN:** Answer uses BigInt to avoid 32-bit overflow in intermediate products. **VI:** Dùng BigInt tránh tràn số khi nhân trung gian.

---

## 💡 Solutions

```typescript
/**
 * Stars-and-bars + Divisibility Chain DP
 * Time: O(maxValue * log(maxValue) * maxLen)  Space: O(maxValue * maxLen)
 */
function idealArrays(n: number, maxValue: number): number {
  const MOD = 1_000_000_007n;
  const MAX_LEN = 14; // log2(10^4) < 14

  // dp[v][k] = number of divisibility chains of length k ending at v
  const dp: bigint[][] = Array.from({ length: maxValue + 1 }, () =>
    new Array(MAX_LEN + 1).fill(0n),
  );
  for (let v = 1; v <= maxValue; v++) dp[v][1] = 1n;

  // Sieve: for each d, propagate to all multiples
  for (let k = 2; k <= MAX_LEN; k++) {
    for (let d = 1; d <= maxValue; d++) {
      if (dp[d][k - 1] === 0n) continue;
      for (let v = 2 * d; v <= maxValue; v += d) {
        dp[v][k] = (dp[v][k] + dp[d][k - 1]) % MOD;
      }
    }
  }

  // Pascal's triangle: C[i][j] = C(i, j)
  const C: bigint[][] = Array.from({ length: n }, () => new Array(MAX_LEN + 1).fill(0n));
  C[0][0] = 1n;
  for (let i = 1; i < n; i++) {
    C[i][0] = 1n;
    for (let j = 1; j <= Math.min(i, MAX_LEN); j++) {
      C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % MOD;
    }
  }

  let ans = 0n;
  for (let v = 1; v <= maxValue; v++) {
    for (let k = 1; k <= MAX_LEN && k <= n; k++) {
      if (dp[v][k] === 0n) continue;
      ans = (ans + dp[v][k] * C[n - 1][k - 1]) % MOD;
    }
  }
  return Number(ans);
}

/**
 * Alternative: count using modular inverse for C(n-1, k-1)
 * Time: O(maxValue * log(maxValue) * maxLen)  Space: O(maxValue * maxLen)
 */
function idealArraysV2(n: number, maxValue: number): number {
  const MOD = 1_000_000_007;
  const MAX_LEN = 14;

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }
  function modpow(base: number, exp: number, mod: number): number {
    let result = 1;
    base %= mod;
    for (; exp > 0; exp >>= 1) {
      if (exp & 1) result = (result * base) % mod;
      base = (base * base) % mod;
    }
    return result;
  }
  function modinv(a: number, mod: number): number {
    return modpow(a, mod - 2, mod);
  }
  function comb(n_: number, k: number): number {
    if (k < 0 || k > n_) return 0;
    let num = 1,
      den = 1;
    for (let i = 0; i < k; i++) {
      num = (num * ((n_ - i) % MOD)) % MOD;
      den = (den * (i + 1)) % MOD;
    }
    return (num * modinv(den, MOD)) % MOD;
  }

  const dp = Array.from({ length: maxValue + 1 }, () => new Array(MAX_LEN + 1).fill(0));
  for (let v = 1; v <= maxValue; v++) dp[v][1] = 1;
  for (let k = 2; k <= MAX_LEN; k++) {
    for (let d = 1; d <= maxValue; d++) {
      if (!dp[d][k - 1]) continue;
      for (let v = 2 * d; v <= maxValue; v += d) dp[v][k] = (dp[v][k] + dp[d][k - 1]) % MOD;
    }
  }

  let ans = 0;
  for (let v = 1; v <= maxValue; v++)
    for (let k = 1; k <= MAX_LEN && k <= n; k++)
      if (dp[v][k]) ans = (ans + dp[v][k] * comb(n - 1, k - 1)) % MOD;
  return ans;
}

// Tests
console.log(idealArrays(2, 5)); // 10
console.log(idealArrays(5, 3)); // 11
console.log(idealArrays(1, 1)); // 1
console.log(idealArrays(3, 7)); // 29
console.log(idealArraysV2(2, 5)); // 10  (cross-check)
```

---

## 🔗 Related Problems

| Problem                                                                                                                   | Difficulty | Pattern            |
| ------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Count All Valid Pickup and Delivery Options](https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options/) | 🔴 Hard    | Combinatorics      |
| [Count Sorted Vowel Strings](https://leetcode.com/problems/count-sorted-vowel-strings/)                                   | 🟡 Medium  | Stars and Bars     |
| [Number of Music Playlists](https://leetcode.com/problems/number-of-music-playlists/)                                     | 🔴 Hard    | DP + Combinatorics |
