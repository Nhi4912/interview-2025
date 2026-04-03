---
layout: page
title: "Minimum Time to Revert Word to Initial State II"
difficulty: Hard
category: String
tags: [String, Rolling Hash, String Matching, Hash Function]
leetcode_url: "https://leetcode.com/problems/minimum-time-to-revert-word-to-initial-state-ii"
---

# Minimum Time to Revert Word to Initial State II / Minimum Time to Revert Word to Initial State II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Z-function / String Matching
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome) | [Minimum Time to Revert Word to Initial State I](https://leetcode.com/problems/minimum-time-to-revert-word-to-initial-state-i)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như băng truyền tải — mỗi giây xén k ký tự đầu rồi nối k ký tự mới vào cuối. Để băng trở về trạng thái ban đầu, phần đuôi còn lại phải khớp với đầu băng gốc (ta có thể chọn bất kỳ k ký tự nào để nối). Z-function trả lời chính xác câu hỏi này trong O(n).

**Visual — Z-function for prefix matching:**

```
word = "aabaab",  k = 2

Z-function: z[i] = len of longest prefix of word starting at word[i]
z = [6, 1, 0, 3, 1, 0]
     ^               
     z[0]=n by convention

t=1: check z[2]=0 ≥ 6-2=4? NO
t=2: check z[4]=1 ≥ 6-4=2? NO
t=3: check t*k=6 ≥ n=6? YES → return 3

word = "abacaba",  k = 2
z = [7, 0, 1, 0, 3, 0, 1]

t=1: z[2]=1 ≥ 7-2=5? NO
t=2: z[4]=3 ≥ 7-4=3? YES → return 2

Condition: z[t*k] >= n - t*k  (suffix word[t*k:] matches prefix of length n-t*k)
```

---

## Problem Description

Same as Part I but with `1 <= word.length <= 10^5`. Each second: remove first `k` chars, append any `k` chars. Find minimum seconds to restore `word`.

**Example 1:** `word = "abacaba"`, `k = 2` → `2`
**Example 2:** `word = "abacaba"`, `k = 4` → `1`

Constraints: `1 <= word.length <= 10^5`, `1 <= k <= word.length`.

---

## 📝 Interview Tips

1. **Z-function**: "z[i] = độ dài prefix dài nhất bắt đầu tại word[i] — xây dựng O(n)" / z[i] = longest prefix starting at word[i] — built in O(n) with Z-algorithm
2. **Key condition**: "word[t*k:] là prefix của word ⟺ z[t*k] ≥ n - t*k" / word[t*k:] is prefix of word iff z[t*k] ≥ n - t*k
3. **Early termination**: "t*k ≥ n → toàn bộ đã thay thế — luôn return t" / t*k ≥ n: entirely replaced, always return t
4. **Max iterations**: "Tối đa ceil(n/k) iterations — tổng O(n/k) kiểm tra sau O(n) build" / At most ceil(n/k) checks after O(n) build → O(n) total
5. **Rolling hash alternative**: "Rabin-Karp cũng được — hash word[t*k:n] và hash word[0:n-t*k]" / Rolling hash also works: compare hash(word[t*k:]) with hash(word[:n-t*k])
6. **KMP alternative**: "Dùng KMP failure function cũng cho kết quả tương đương" / KMP failure function gives equivalent info to Z-function here

---

## Solutions

```typescript
/**
 * Helper: build Z-function
 * z[i] = length of longest substring starting at s[i] that is also a prefix of s.
 * z[0] = n by convention.
 * Time: O(n), Space: O(n)
 */
function buildZFunction(s: string): number[] {
  const n = s.length;
  const z = new Array(n).fill(0);
  z[0] = n;
  let l = 0, r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] > r) { l = i; r = i + z[i]; }
  }
  return z;
}

/**
 * Solution 1: Z-function (optimal)
 * Build Z-array once. For each t, check if word[t*k:] matches prefix of length n-t*k.
 * Time: O(n) — Z-function O(n) + at most ceil(n/k) O(1) lookups
 * Space: O(n) — Z-array
 */
function minimumTimeII(word: string, k: number): number {
  const n = word.length;
  const z = buildZFunction(word);

  for (let t = 1; ; t++) {
    if (t * k >= n) return t;               // entire word replaced, can restore
    if (z[t * k] >= n - t * k) return t;    // suffix word[t*k:] == prefix of same length
  }
}

/**
 * Solution 2: Rolling Hash (alternative approach)
 * Use polynomial rolling hash to compare word[t*k : n] with word[0 : n-t*k].
 * Useful when Z-function is not immediately obvious in an interview.
 * Time: O(n) — precompute prefix hashes
 * Space: O(n) — hash arrays
 */
function minimumTimeIIHash(word: string, k: number): number {
  const n = word.length;
  const MOD = 1_000_000_007n;
  const BASE = 31n;

  // Precompute prefix hashes and powers
  const h = new Array<bigint>(n + 1).fill(0n);
  const pw = new Array<bigint>(n + 1).fill(1n);
  for (let i = 0; i < n; i++) {
    h[i + 1] = (h[i] * BASE + BigInt(word.charCodeAt(i) - 96)) % MOD;
    pw[i + 1] = pw[i] * BASE % MOD;
  }

  const getHash = (l: number, r: number): bigint => {
    // hash of word[l..r-1]
    return (h[r] - h[l] * pw[r - l] % MOD + MOD * MOD) % MOD;
  };

  for (let t = 1; ; t++) {
    const removed = t * k;
    if (removed >= n) return t;
    const remain = n - removed;
    // Compare word[removed : n] with word[0 : remain]
    if (getHash(removed, n) === getHash(0, remain)) {
      // Double-check to avoid hash collision (important in practice)
      if (word.slice(removed) === word.slice(0, remain)) return t;
    }
  }
}

// === Test Cases ===
console.log(minimumTimeII('abacaba', 2));    // 2
console.log(minimumTimeII('abacaba', 4));    // 1
console.log(minimumTimeII('abc', 3));        // 1
console.log(minimumTimeII('aaa', 1));        // 1
console.log(minimumTimeII('abab', 2));       // 1  (z[2]=2 >= 4-2=2)
```

---

## 🔗 Related Problems

| Problem | Pattern | Difficulty |
|---------|---------|-----------|
| [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome) | KMP / Z-function | Hard |
| [Minimum Time to Revert Word I](https://leetcode.com/problems/minimum-time-to-revert-word-to-initial-state-i) | String Matching | Medium |
| [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii) | Z-function + Trie | Hard |
| [Find Beautiful Indices in the Given Array II](https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-ii) | KMP | Hard |
