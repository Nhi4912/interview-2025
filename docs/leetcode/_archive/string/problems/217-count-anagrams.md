---
layout: page
title: "Count Anagrams"
difficulty: Hard
category: String
tags: [Hash Table, Math, String, Combinatorics, Counting]
leetcode_url: "https://leetcode.com/problems/count-anagrams"
---

# Count Anagrams / Đếm Các Hoán Vị Từ

> **Difficulty**: 🔴 Hard | **Category**: String | **Pattern**: Combinatorics + Modular Arithmetic

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như đếm số cách xếp các chữ cái của từng từ trong câu — mỗi từ có số hoán vị riêng, nhân tất cả lại ra đáp số (modulo tránh tràn số).

**Pattern Recognition:**

- Each word contributes `word.length! / (freq[c1]! * freq[c2]! * ...)` permutations
- Multiply across all words (mod 10^9+7)
- Need modular inverse for division in modular arithmetic

**Visual:**

```
s = "too hot"
Words: ["too", "hot"]

"too": len=3, freq={t:1,o:2}
  perms = 3! / (1! * 2!) = 6 / 2 = 3

"hot": len=3, freq={h:1,o:1,t:1}
  perms = 3! / (1! * 1! * 1!) = 6

Total = 3 * 6 = 18
```

## Problem Description

Given a string `s` of words separated by spaces, return the total number of ways to arrange letters of each word (anagrams), multiplied across all words. Answer mod `10^9 + 7`.

**Example 1:** `s = "too hot"` → `18`
**Example 2:** `s = "aa"` → `1`

**Constraints:** `2 <= s.length <= 10^5`, `s` has no leading/trailing spaces, words separated by single space, lowercase letters only

## 📝 Interview Tips

1. **Clarify**: Each word is permuted independently; multiply all counts
2. **Approach**: Precompute factorials and modular inverses; for each word compute multinomial coefficient
3. **Edge cases**: All same chars in a word → 1 permutation; single-char word → 1
4. **Optimize**: Precompute fact[] and inv_fact[] up to max length once
5. **Follow-up**: What if we want distinct permutations only? (same approach, multinomial handles it)
6. **Complexity**: Time O(n), Space O(n)

## Solutions

```typescript
// Solution 1: Factorial + Modular Inverse (Fermat's Little Theorem) — Time: O(n) | Space: O(n)
function countAnagrams(s: string): number {
  const MOD = 1_000_000_007n;
  const words = s.split(" ");
  const maxLen = Math.max(...words.map((w) => w.length)) + 1;

  // Precompute factorials and inverse factorials
  const fact = new Array<bigint>(maxLen + 1);
  const inv_fact = new Array<bigint>(maxLen + 1);
  fact[0] = 1n;
  for (let i = 1; i <= maxLen; i++) fact[i] = (fact[i - 1] * BigInt(i)) % MOD;

  function modpow(base: bigint, exp: bigint, mod: bigint): bigint {
    let result = 1n;
    base %= mod;
    while (exp > 0n) {
      if (exp & 1n) result = (result * base) % mod;
      base = (base * base) % mod;
      exp >>= 1n;
    }
    return result;
  }

  inv_fact[maxLen] = modpow(fact[maxLen], MOD - 2n, MOD);
  for (let i = maxLen - 1; i >= 0; i--) {
    inv_fact[i] = (inv_fact[i + 1] * BigInt(i + 1)) % MOD;
  }

  let result = 1n;

  for (const word of words) {
    const freq: Record<string, number> = {};
    for (const c of word) freq[c] = (freq[c] || 0) + 1;

    // Multinomial: word.length! / product(freq[c]!)
    let ways = fact[word.length];
    for (const cnt of Object.values(freq)) {
      ways = (ways * inv_fact[cnt]) % MOD;
    }
    result = (result * ways) % MOD;
  }

  return Number(result);
}

// Solution 2: Per-word modular inverse computation — Time: O(n log n) | Space: O(n)
function countAnagrams2(s: string): number {
  const MOD = 1_000_000_007n;

  function modpow(base: bigint, exp: bigint, mod: bigint): bigint {
    let r = 1n;
    base %= mod;
    while (exp > 0n) {
      if (exp & 1n) r = (r * base) % mod;
      base = (base * base) % mod;
      exp >>= 1n;
    }
    return r;
  }

  function factorial(n: number): bigint {
    let r = 1n;
    for (let i = 2n; i <= BigInt(n); i++) r = (r * i) % MOD;
    return r;
  }

  let result = 1n;

  for (const word of s.split(" ")) {
    const freq: Record<string, number> = {};
    for (const c of word) freq[c] = (freq[c] || 0) + 1;

    let ways = factorial(word.length);
    for (const cnt of Object.values(freq)) {
      ways = (ways * modpow(factorial(cnt), MOD - 2n, MOD)) % MOD;
    }
    result = (result * ways) % MOD;
  }

  return Number(result);
}

// Tests
console.log(countAnagrams("too hot")); // 18
console.log(countAnagrams("aa")); // 1
console.log(countAnagrams("abc")); // 6
console.log(countAnagrams("ab cd")); // 4
console.log(countAnagrams("aab cd")); // 6
```

## 🔗 Related Problems

| Problem                                                                                                                       | Relationship                               |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [Permutations](https://leetcode.com/problems/permutations/)                                                                   | Counting all permutations                  |
| [Permutations II](https://leetcode.com/problems/permutations-ii/)                                                             | Permutations with duplicates (multinomial) |
| [Number of Ways to Rearrange Sticks](https://leetcode.com/problems/number-of-ways-to-rearrange-sticks-with-k-sticks-visible/) | Combinatorics with modular arithmetic      |
