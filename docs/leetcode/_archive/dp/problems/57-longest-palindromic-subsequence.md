---
layout: page
title: "Longest Palindromic Subsequence"
difficulty: Medium
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/longest-palindromic-subsequence"
---

# Longest Palindromic Subsequence / Dãy Con Đối Xứng Dài Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming (Interval DP)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring) | [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Như gấp đôi tờ giấy và ghép các ký tự đối xứng — nếu hai đầu giống nhau ta ghép chúng vào dãy con, nếu không ta chọn bên dài hơn. Bài toán được rút gọn dần từ ngoài vào trong.

**Pattern Recognition:**

- Signal: "longest palindromic subsequence" = LCS(s, reverse(s)) → **Interval DP**
- dp[i][j] = độ dài dãy con đối xứng dài nhất của s[i..j]
- Key insight: nếu s[i]==s[j] → dp[i][j] = dp[i+1][j-1] + 2, else max(dp[i+1][j], dp[i][j-1])

**Visual — s = "bbbab":**

```
     b  b  b  a  b
  b [1  2  3  3  4]
  b [   1  2  2  3]
  b [      1  1  3]
  a [         1  1]
  b [            1]

Diagonal fill: len 1→ len 2→ ... → len 5
dp[0][4] = 4  ("bbbb" is longest palindromic subseq)
```

---

## Problem Description

Given string `s`, return the length of the longest palindromic subsequence (characters don't need to be contiguous).

- Example 1: `s = "bbbab"` → `4` (`"bbbb"`)
- Example 2: `s = "cbbd"` → `2` (`"bb"`)
- Example 3: `s = "a"` → `1`

Constraints: `1 <= s.length <= 1000`, lowercase English letters

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Subsequence (không liên tiếp) khác Substring (liên tiếp)" / Subsequence vs substring distinction
2. **Alternative approach**: LPS = LCS(s, reverse(s)) — reuses familiar LCS code
3. **Interval DP**: dp[i][j] built from smaller intervals outward — fill by increasing length
4. **Transition**: `s[i]==s[j]` → `dp[i][j] = dp[i+1][j-1] + 2`; else `max(dp[i+1][j], dp[i][j-1])`
5. **Space optimize**: Có thể dùng 2 hàng (prev/curr) thay vì n×n — nhưng cần cẩn thận về thứ tự
6. **Edge**: `len=1` → dp[i][i]=1; `len=2` → dp[i][i+1] = (s[i]==s[i+1] ? 2 : 1)

---

## Solutions

```typescript
/**
 * Solution 1: LCS-based approach (LPS = LCS with reverse)
 * Time: O(n²) — LCS on two strings of length n
 * Space: O(n²) — LCS dp table
 */
function longestPalindromeSubseqLCS(s: string): number {
  const n = s.length;
  const rev = s.split("").reverse().join("");
  // Standard LCS dp
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        s[i - 1] === rev[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[n][n];
}

/**
 * Solution 2: Interval DP (Classic, Optimal)
 * Time: O(n²) — O(n²) states, O(1) transition each
 * Space: O(n²) — 2D dp table
 */
function longestPalindromeSubseq(s: string): number {
  const n = s.length;
  // dp[i][j] = length of longest palindromic subsequence in s[i..j]
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // Base case: every single character is a palindrome of length 1
  for (let i = 0; i < n; i++) dp[i][i] = 1;

  // Fill by increasing subarray length
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      if (s[i] === s[j]) {
        // Both ends match: extend inner palindrome by 2
        dp[i][j] = (len === 2 ? 0 : dp[i + 1][j - 1]) + 2;
      } else {
        // Take best from either shrinking left or right
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[0][n - 1];
}

// === Test Cases ===
console.log(longestPalindromeSubseq("bbbab")); // 4
console.log(longestPalindromeSubseq("cbbd")); // 2
console.log(longestPalindromeSubseq("a")); // 1
console.log(longestPalindromeSubseq("agbdba")); // 5 ("abdba")
```

---

## 🔗 Related Problems

- [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence) — LPS is a special case (LCS with reverse)
- [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings) — count palindromic substrings (not subsequences)
- [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring) — longest contiguous palindrome (Manacher's)
- [Minimum Insertion Steps to Make a String Palindrome](https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome) — n - LPS = min insertions
- [Count Palindromic Subsequences](https://leetcode.com/problems/count-palindromic-subsequences) — harder counting variant
