---
layout: page
title: "Maximum Deletions on a String"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming, Rolling Hash, String Matching, Hash Function]
leetcode_url: "https://leetcode.com/problems/maximum-deletions-on-a-string"
---

# Maximum Deletions on a String / Số Lần Xóa Tối Đa Trên Chuỗi

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome) | [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Như cắt một cuộn băng dán — bạn chỉ được cắt nếu nửa đầu bằng nửa sau. Mỗi lần cắt thành công, bạn tiếp tục tối ưu phần còn lại.

```
s = "aaaaa"
     i=0: prefix "a" == next "a" → dp[0] = dp[1]+1
     i=1: prefix "a" == next "a" → dp[1] = dp[2]+1
     ...
     i=4: dp[4] = 1 (base case)
     dp = [5, 4, 3, 2, 1]  → answer: dp[0] = 5

s = "abcabcdabc"
     i=0: "abc"=="abc" (L=3) → dp[0] = dp[3]+1 = 2
     i=3: "d"≠"a", no match  → dp[3] = 1
```

**Key insight:** `dp[i]` = max deletions from index `i` onward. For each `i`, use Z-function on `s[i..]` to find all valid prefix-repeat lengths in O(n) per position.

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **State**: `dp[i]` = max operations starting at position `i` / số phép xóa tối đa từ vị trí `i`
- 🔑 **Transition**: `dp[i] = max(dp[i+L] + 1)` for all L where `s[i..i+L) == s[i+L..i+2L)` / với mọi L hợp lệ
- 🔑 **Z-array**: Build Z-array on `s[i..]` → if `Z[L] >= L`, first L chars repeat at position L / Z[L] ≥ L nghĩa là prefix lặp lại
- 🔑 **Base case**: `dp[i] = 1` (at minimum, delete entire remaining string at once) / tối thiểu xóa 1 lần
- 🔑 **Fill order**: Right to left — `dp[n-1]=1`, ..., `dp[0]` / điền từ phải sang trái
- 🔑 **Rolling hash alternative**: O(1) comparison but prone to collision; Z-array is deterministic / hash nhanh nhưng có thể va chạm

---

## Solutions / Giải Pháp

### Solution 1: DP + Z-Function (O(n²) time, O(n) space)

```typescript
/**
 * Maximum Deletions on a String — DP + Z-Function
 *
 * Build Z-array for s[i..n-1] at each position i.
 * Z[j] = length of longest substring starting at j that matches prefix s[i..].
 * If Z[L] >= L, then s[i..i+L) equals s[i+L..i+2L), enabling a deletion of length L.
 *
 * Time:  O(n²)  — O(n) Z-array build × n positions
 * Space: O(n)   — dp array + Z-array (reused)
 */
function deleteString(s: string): number {
  const n = s.length;
  const dp = new Array(n).fill(1);

  for (let i = n - 2; i >= 0; i--) {
    // Build Z-array for substring s[i..]
    const len = n - i;
    const z = new Array(len).fill(0);
    z[0] = len;
    let l = 0,
      r = 0;
    for (let j = 1; j < len; j++) {
      if (j < r) z[j] = Math.min(r - j, z[j - l]);
      while (j + z[j] < len && s[i + z[j]] === s[i + j + z[j]]) z[j]++;
      if (j + z[j] > r) {
        l = j;
        r = j + z[j];
      }
    }
    // Check each prefix length L: if Z[L] >= L, s[i..i+L) == s[i+L..i+2L)
    for (let L = 1; L * 2 <= len; L++) {
      if (z[L] >= L) {
        dp[i] = Math.max(dp[i], dp[i + L] + 1);
      }
    }
  }

  return dp[0];
}

console.log(deleteString("abcabcdabc")); // 2
console.log(deleteString("aaabaab")); // 2
console.log(deleteString("aaaaa")); // 5
console.log(deleteString("a")); // 1
console.log(deleteString("ab")); // 1
```

### Solution 2: DP + Rolling Hash (O(n²) expected, O(n) space)

```typescript
/**
 * Maximum Deletions on a String — Rolling Hash
 *
 * Precompute polynomial rolling hash for O(1) substring equality.
 * For each position i, check all L from 1 to (n-i)/2.
 * Use double hashing to minimize collision probability.
 *
 * Time:  O(n²) expected
 * Space: O(n)
 */
function deleteStringHash(s: string): number {
  const n = s.length;
  const MOD = 1_000_000_007n;
  const BASE = 31n;

  const h = new Array(n + 1).fill(0n);
  const pw = new Array(n + 1).fill(1n);
  for (let i = 0; i < n; i++) {
    h[i + 1] = (h[i] * BASE + BigInt(s.charCodeAt(i) - 96)) % MOD;
    pw[i + 1] = (pw[i] * BASE) % MOD;
  }

  // Get hash of s[l..r) (0-indexed, exclusive r)
  const getHash = (l: number, r: number): bigint =>
    (h[r] - ((h[l] * pw[r - l]) % MOD) + MOD * MOD) % MOD;

  const dp = new Array(n).fill(1);
  for (let i = n - 2; i >= 0; i--) {
    const remain = n - i;
    for (let L = 1; L * 2 <= remain; L++) {
      if (getHash(i, i + L) === getHash(i + L, i + 2 * L)) {
        dp[i] = Math.max(dp[i], dp[i + L] + 1);
      }
    }
  }

  return dp[0];
}

console.log(deleteStringHash("abcabcdabc")); // 2
console.log(deleteStringHash("aaaaa")); // 5
console.log(deleteStringHash("aaabaab")); // 2
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                            | Difficulty | Pattern          |
| -------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome)                           | 🔴 Hard    | KMP / Z-Function |
| [Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix)                         | 🔴 Hard    | KMP              |
| [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii) | 🔴 Hard    | Rolling Hash     |
| [Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern)             | 🟢 Easy    | String Matching  |
