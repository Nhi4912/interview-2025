---
layout: page
title: "Count Palindromic Subsequences"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/count-palindromic-subsequences"
---

# Count Palindromic Subsequences / Đếm Dãy Con Đối Xứng

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming (Interval DP with dedup)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence) | [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Như đếm số kiểu gương đối xứng khác nhau tạo ra từ một chuỗi ký tự — không đếm trùng. Với mỗi cặp ký tự giống nhau ở hai đầu dải, ta cộng số palindrome của dải bên trong, nhưng cần trừ đi phần trùng lặp cẩn thận.

**Pattern Recognition:**

- Signal: "count **distinct** palindromic subsequences" → **Interval DP with careful dedup**
- dp[i][j] = số dãy con đối xứng phân biệt trong s[i..j], kết quả mod 10^9+7
- Key insight: khi s[i]==s[j], tìm vị trí lo (trái) và hi (phải) tiếp theo của ký tự đó bên trong

**Visual — s = "bcb":**

```
dp[i][i] = 1 for all i  (single chars)

len=2: s[1][2]="cb" → s[1]≠s[2] → dp[1][2] = dp[2][2]+dp[1][1]-dp[2][1] = 1+1-0 = 2
len=3: s[0][2]="bcb" → s[0]==s[2]=='b'
  lo=hi (no 'b' inside [1..1]) → lo>hi
  dp[0][2] = 2*dp[1][1] + 2 = 2*1+2 = 4
  ("b","c","bb","bcb")
```

---

## Problem Description

Given string `s` over `{'a','b','c','d'}`, return the number of **distinct** non-empty palindromic subsequences mod `10^9 + 7`.

- Example 1: `s = "bccb"` → `6` (b, c, bb, cc, bcb, bccb)
- Example 2: `s = "abcdabcdabcdabcdabcdabcdabcdabcddcbadcbadcbadcbadcbadcbadcbadcba"` → `104860361`

Constraints: `1 <= s.length <= 1000`, `s[i]` in `{'a','b','c','d'}`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Distinct = không đếm cùng string 2 lần, dù đến từ chỉ số khác nhau"
2. **Why 3 cases?** Khi s[i]==s[j], số lần ký tự đó xuất hiện bên trong quyết định dedup cần thiết
3. **Case lo>hi**: không có ký tự s[i] bên trong → thêm 2 mới: s[i] đơn và s[i]..s[j] đôi → +2
4. **Case lo==hi**: có đúng 1 ở giữa → thêm s[i]+s[j] đôi (s[i] đơn đã được đếm) → +1
5. **Case lo<hi**: thêm dp nội + 2, trừ dp giữa lo và hi để tránh đếm trùng
6. **Modular**: Dùng BigInt để tránh overflow JavaScript, cuối cùng convert về Number

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Generate all subsequences, dedup with Set
 * Time: O(2^n * n) — generate all 2^n subsequences, check palindrome
 * Space: O(2^n) — set of distinct palindromes
 */
function countPalindromicSubsequencesBrute(s: string): number {
  const MOD = 1_000_000_007;
  const seen = new Set<string>();
  const n = s.length;

  function isPalin(t: string): boolean {
    let l = 0,
      r = t.length - 1;
    while (l < r) {
      if (t[l++] !== t[r--]) return false;
    }
    return true;
  }

  for (let mask = 1; mask < 1 << n; mask++) {
    let sub = "";
    for (let i = 0; i < n; i++) if (mask & (1 << i)) sub += s[i];
    if (isPalin(sub)) seen.add(sub);
  }

  return seen.size % MOD;
}

/**
 * Solution 2: Interval DP (Optimal)
 * Time: O(n²) — O(n²) states, O(n) inner search → O(n³) worst case but typical O(n²)
 * Space: O(n²) — 2D dp table (BigInt for precision)
 */
function countPalindromicSubsequences(s: string): number {
  const MOD = 1_000_000_007n;
  const n = s.length;
  const dp: bigint[][] = Array.from({ length: n }, () => new Array(n).fill(0n));

  // Base: each single character is 1 palindromic subsequence
  for (let i = 0; i < n; i++) dp[i][i] = 1n;

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;

      if (s[i] !== s[j]) {
        // Inclusion-exclusion: union of palindromes in [i+1..j] and [i..j-1]
        dp[i][j] = (dp[i + 1][j] + dp[i][j - 1] - dp[i + 1][j - 1] + MOD) % MOD;
      } else {
        // s[i] === s[j]: find innermost occurrences of s[i] inside [i+1, j-1]
        let lo = i + 1,
          hi = j - 1;
        while (lo <= hi && s[lo] !== s[i]) lo++;
        while (lo <= hi && s[hi] !== s[i]) hi--;

        if (lo > hi) {
          // No s[i] inside: inner palindromes * 2, plus "s[i]" and "s[i]s[j]"
          dp[i][j] = (dp[i + 1][j - 1] * 2n + 2n) % MOD;
        } else if (lo === hi) {
          // Exactly one s[i] inside: inner * 2, plus "s[i]s[j]" (s[i] already counted)
          dp[i][j] = (dp[i + 1][j - 1] * 2n + 1n) % MOD;
        } else {
          // Two or more s[i] inside: inner*2 minus duplicates between lo and hi
          dp[i][j] = (dp[i + 1][j - 1] * 2n - dp[lo + 1][hi - 1] + MOD) % MOD;
        }
      }
    }
  }

  return Number(dp[0][n - 1]);
}

// === Test Cases ===
console.log(countPalindromicSubsequences("bccb")); // 6
console.log(countPalindromicSubsequences("b")); // 1
console.log(countPalindromicSubsequences("bcb")); // 4
console.log(countPalindromicSubsequences("abcd")); // 4
```

---

## 🔗 Related Problems

- [Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence) — easier variant (length not count)
- [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings) — count contiguous palindromic substrings
- [Count Different Palindromic Subsequences](https://leetcode.com/problems/count-different-palindromic-subsequences) — LeetCode 730 same problem
- [Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences) — count distinct subsequences matching a pattern
- [Interleaving String](https://leetcode.com/problems/interleaving-string) — 2D string DP
