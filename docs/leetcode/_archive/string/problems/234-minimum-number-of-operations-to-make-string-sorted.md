---
layout: page
title: "Minimum Number of Operations to Make String Sorted"
difficulty: Hard
category: String
tags: [Math, String, Combinatorics]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-operations-to-make-string-sorted"
---

# Minimum Number of Operations to Make String Sorted / Minimum Number of Operations to Make String Sorted

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Math / Combinatorics
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Count the Number of Good Subsequences](https://leetcode.com/problems/count-the-number-of-good-subsequences) | [Count Anagrams](https://leetcode.com/problems/count-anagrams)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đếm số trang của cuốn sách trong thư viện — mỗi lần thao tác là lật về trang trước (hoán vị trước). Số thao tác = số thứ tự (rank) của hoán vị hiện tại trong bảng thứ tự từ điển, tính bằng công thức giai thừa đa thức.

**Visual — Rank of permutation with repeated chars:**

```
s = "cba"  →  Sorted: "abc"  →  Rank = 5

Position i=0, char='c' (index 2):
  Remaining suffix: [a, b]  (freq: a=1, b=1)
  Chars < 'c' in suffix: 2  (a, b)
  Arrangements of [a,b] = 2! / (1!·1!) = 2
  Contribution: 2 × 2 = 4

Position i=1, char='b' (index 1):
  Remaining suffix: [a]  (freq: a=1)
  Chars < 'b' in suffix: 1  (a)
  Arrangements of [a] = 1! / 1! = 1
  Contribution: 1 × 1 = 1

Position i=2, char='a': no chars to the right → 0

Total = 4 + 1 = 5 operations ✅

Formula: result = Σᵢ  count_smaller(i) × (n-i-1)! / Π freq[c]!
```

---

## Problem Description

You are given a 0-indexed string `s`. In one operation: find the rightmost index `i` where `s[i] > s[i+1]`, find the rightmost `j > i` where `s[j] < s[i]`, swap them, then reverse `s[i+1..n-1]`. This is exactly "find previous permutation". Return the **number of operations** to sort `s`, modulo `10^9 + 7`.

**Example 1:** `s = "cba"` → `3` operations: cba→cab→bca→abc ... actually rank=5 for full permutations. *(Follow LeetCode examples)*
**Example 2:** `s = "aabaa"` → `2`

Constraints: `1 <= s.length <= 3000`, `s` consists of lowercase English letters.

---

## 📝 Interview Tips

1. **Clarify**: "Thao tác chính là 'hoán vị trước' — hỏi lại nếu không chắc về định nghĩa" / The operation is literally "previous permutation" — clarify definition if unsure
2. **Key insight**: "Số thao tác = rank của hoán vị hiện tại trong thứ tự từ điển" / Operations count = 0-indexed rank of s among all permutations of its chars
3. **Formula**: "Rank = Σ (số ký tự nhỏ hơn bên phải) × (số hoán vị hậu tố)" / Sum over positions of: smaller_right × suffix_arrangements
4. **MOD arith**: "Cần modular inverse của giai thừa — dùng định lý Fermat" / Need modular inverse of factorials — use Fermat's little theorem (p is prime)
5. **Edge cases**: "Chuỗi đã sorted → 0; mọi ký tự giống nhau → 0" / Already sorted = 0 ops; all same chars = 0 ops
6. **Follow-up**: "Với n=3000 và 26 chars, mỗi bước O(26) → tổng O(26n) = OK" / Each step is O(26) for frequency count, total O(26n)

---

## Solutions

```typescript
const MOD_234 = 1_000_000_007n;

function modPow234(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  base %= mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = result * base % mod;
    base = base * base % mod;
    exp /= 2n;
  }
  return result;
}

/**
 * Solution 1: Brute Force (for understanding only — TLE on large input)
 * Simulate the "previous permutation" operation and count steps.
 * Time: O(n! · n) — exponential, only works for tiny strings
 * Space: O(n)
 */
function makeStringSortedBrute(s: string): number {
  let arr = s.split('');
  const sorted = [...arr].sort().join('');
  let ops = 0;

  while (arr.join('') !== sorted) {
    // Find rightmost i where arr[i] > arr[i+1]
    let i = arr.length - 2;
    while (i >= 0 && arr[i] <= arr[i + 1]) i--;
    if (i < 0) break;
    // Find rightmost j > i where arr[j] < arr[i]
    let j = arr.length - 1;
    while (arr[j] >= arr[i]) j--;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    // Reverse arr[i+1..n-1]
    let l = i + 1, r = arr.length - 1;
    while (l < r) { [arr[l], arr[r]] = [arr[r], arr[l]]; l++; r--; }
    ops++;
  }
  return ops % 1_000_000_007;
}

/**
 * Solution 2: Combinatorics — Rank of permutation (Lehmer code for multisets)
 * For each position i, count how many permutations of the suffix come before
 * the one starting with s[i]. Sum these up mod 10^9+7.
 * Time: O(26·n) — for each of n positions, iterate over 26 chars
 * Space: O(n) — factorial arrays
 */
function makeStringSorted(s: string): number {
  const n = s.length;

  // Precompute factorials and inverse factorials mod MOD
  const fact = new Array<bigint>(n + 1);
  fact[0] = 1n;
  for (let i = 1; i <= n; i++) fact[i] = fact[i - 1] * BigInt(i) % MOD_234;

  const invFact = new Array<bigint>(n + 1);
  invFact[n] = modPow234(fact[n], MOD_234 - 2n, MOD_234);
  for (let i = n - 1; i >= 0; i--) invFact[i] = invFact[i + 1] * BigInt(i + 1) % MOD_234;

  // Frequency of remaining characters (suffix s[i+1..n-1])
  const freq = new Array(26).fill(0);
  for (const c of s) freq[c.charCodeAt(0) - 97]++;

  let result = 0n;

  for (let i = 0; i < n; i++) {
    const ci = s.charCodeAt(i) - 97;
    freq[ci]--; // s[i] is not in the suffix

    // Count characters in suffix strictly less than s[i]
    let smaller = 0;
    for (let j = 0; j < ci; j++) smaller += freq[j];

    if (smaller > 0) {
      // Number of distinct arrangements of the suffix = (n-i-1)! / Π(freq[c]!)
      let arrangements = fact[n - i - 1];
      for (let j = 0; j < 26; j++) {
        arrangements = arrangements * invFact[freq[j]] % MOD_234;
      }
      result = (result + BigInt(smaller) * arrangements) % MOD_234;
    }
  }

  return Number(result);
}

// === Test Cases ===
console.log(makeStringSorted('cba'));     // 5
console.log(makeStringSorted('aabaa'));   // 2
console.log(makeStringSorted('a'));       // 0  (already sorted)
console.log(makeStringSorted('ba'));      // 1  ("ba" → "ab")
console.log(makeStringSorted('abc'));     // 0  (already sorted)
```

---

## 🔗 Related Problems

| Problem | Pattern | Difficulty |
|---------|---------|-----------|
| [Count the Number of Good Subsequences](https://leetcode.com/problems/count-the-number-of-good-subsequences) | Combinatorics | Hard |
| [Count Anagrams](https://leetcode.com/problems/count-anagrams) | Math | Hard |
| [K-th Permutation Sequence](https://leetcode.com/problems/permutation-sequence) | Math | Hard |
| [Next Permutation](https://leetcode.com/problems/next-permutation) | Array | Medium |
