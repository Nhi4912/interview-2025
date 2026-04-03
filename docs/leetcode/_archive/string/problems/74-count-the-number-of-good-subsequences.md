---
layout: page
title: "Count the Number of Good Subsequences"
difficulty: Medium
category: String
tags: [Hash Table, Math, String, Combinatorics, Counting]
leetcode_url: "https://leetcode.com/problems/count-the-number-of-good-subsequences"
---

# Count the Number of Good Subsequences / Đếm Số Subsequence Tốt

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math / Combinatorics
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống chọn đồng phục — một "subsequence tốt" là khi mỗi màu sắc xuất hiện đúng số lần như nhau. Với mỗi "số lần k", đếm cách chọn k lần từ mỗi ký tự đủ điều kiện.

**Pattern Recognition:**

- "Good" = every char appears same # times → enumerate possible count k
- For each k: chars with freq >= k can each contribute C(freq[c], k) ways
- Product formula: `Π(1 + C(freq[c], k))` − 1 = all non-empty good subseqs at count k
- Requires modular arithmetic with precomputed factorials

```
s = "aabb"  freq: a→2, b→2

k=1: C(2,1)=2 for 'a', C(2,1)=2 for 'b'
  ways = (1+2)(1+2) - 1 = 9 - 1 = 8
  (pick any non-empty subset of {a,b}, each contributing k=1 copies)

k=2: C(2,2)=1 for 'a', C(2,2)=1 for 'b'
  ways = (1+1)(1+1) - 1 = 4 - 1 = 3

Total = 8 + 3 = 11 ✅
```

---

## Problem Description

A **good** subsequence of string `s` is non-empty and each character in it appears the **same number of times**. Return the number of good subsequences modulo `10^9 + 7`.

**Examples:**

- `s = "aabb"` → `11`
- `s = "leet"` → `12`
- `s = "abcd"` → `15` (each character chosen 0 or 1 times; 2^4 - 1 = 15)

**Constraints:** `1 ≤ s.length ≤ 10^4`, lowercase English letters only

---

## 📝 Interview Tips

- 🇻🇳 Enumerate k từ 1 đến max_freq, dùng công thức tích để đếm tổ hợp
- 🇺🇸 `Π(1 + C(freq[c], k)) - 1` for chars with freq >= k gives count for each k
- 🇻🇳 Cần modular inverse để tính C(n,k) mod p — dùng Fermat's little theorem
- 🇺🇸 Precompute `fact[]` and `invFact[]` up to `s.length` — O(n) setup
- 🇻🇳 Dùng `BigInt` trong TypeScript để tránh integer overflow với MOD 10^9+7
- 🇺🇸 Only 26 chars × max_freq iterations → O(26n) = O(n) total

---

## Solutions

### Solution 1 — Combinatorics with Modular Arithmetic

```typescript
/**
 * For each possible count k, compute product of (1 + C(freq[c], k)) over all chars
 * Time: O(26 * maxFreq + n) ≈ O(n)
 * Space: O(n) — factorial tables
 */
function countGoodSubsequences(s: string): number {
  const MOD = 1_000_000_007n;
  const n = s.length;

  // Precompute factorials and inverse factorials mod MOD
  const fact = new Array<bigint>(n + 1);
  const invFact = new Array<bigint>(n + 1);
  fact[0] = 1n;
  for (let i = 1; i <= n; i++) fact[i] = (fact[i - 1] * BigInt(i)) % MOD;

  const modpow = (base: bigint, exp: bigint, mod: bigint): bigint => {
    let result = 1n;
    base %= mod;
    while (exp > 0n) {
      if (exp & 1n) result = (result * base) % mod;
      base = (base * base) % mod;
      exp >>= 1n;
    }
    return result;
  };

  invFact[n] = modpow(fact[n], MOD - 2n, MOD);
  for (let i = n - 1; i >= 0; i--) invFact[i] = (invFact[i + 1] * BigInt(i + 1)) % MOD;

  const comb = (n_: number, k: number): bigint => {
    if (k > n_ || k < 0) return 0n;
    return (((fact[n_] * invFact[k]) % MOD) * invFact[n_ - k]) % MOD;
  };

  // Count character frequencies
  const freq = new Map<string, number>();
  for (const c of s) freq.set(c, (freq.get(c) ?? 0) + 1);

  const maxFreq = Math.max(...freq.values());
  let total = 0n;

  for (let k = 1; k <= maxFreq; k++) {
    let ways = 1n;
    for (const f of freq.values()) {
      if (f >= k) ways = (ways * (1n + comb(f, k))) % MOD;
    }
    total = (total + ways - 1n + MOD) % MOD; // subtract 1 for empty selection
  }

  return Number(total);
}

// Test cases
console.log(countGoodSubsequences("aabb")); // 11
console.log(countGoodSubsequences("leet")); // 12
console.log(countGoodSubsequences("abcd")); // 15
console.log(countGoodSubsequences("a")); // 1
```

---

## 🔗 Related Problems

- [2842 - Count K-Subsequences of a String With Maximum Beauty](https://leetcode.com/problems/count-k-subsequences-of-a-string-with-maximum-beauty/) — combinatorics + freq
- [1220 - Count Vowels Permutation](https://leetcode.com/problems/count-vowels-permutation/) — combinatorics with DP
- [2338 - Count the Number of Ideal Arrays](https://leetcode.com/problems/count-the-number-of-ideal-arrays/) — combinatorics
- [62 - Unique Paths](https://leetcode.com/problems/unique-paths/) — C(m+n, m) combinatorics
