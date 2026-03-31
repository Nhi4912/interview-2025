---
layout: page
title: "Longest Palindromic Substring"
difficulty: Medium
category: String
tags: [String, Dynamic Programming, Two Pointers]
leetcode_url: "https://leetcode.com/problems/longest-palindromic-substring/"
---

# Longest Palindromic Substring / Chuỗi Con Đối Xứng Dài Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Expand Around Center
> **Frequency**: 🔥 Tier 1 — Classic string problem, many follow-ups
> **See also**: [Valid Palindrome](./05-valid-palindrome.md) | [Palindrome Partitioning](../../backtracking/problems/10-palindrome-partitioning.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tìm tấm gương đối xứng dài nhất trong một dãy. Mỗi vị trí có thể là **tâm** của một palindrome. Từ tâm, mở rộng ra hai phía chừng nào còn đối xứng. Làm điều này cho mọi vị trí → lấy kết quả dài nhất.

**Pattern Recognition:**
- Palindrome centered at position i: expand left/right while `s[l] == s[r]`
- Two cases: odd length `"aba"` (center = 1 char) và even length `"abba"` (center = 2 chars)
- DP approach: `dp[i][j] = true` if `s[i..j]` is palindrome — but O(n²) space
- Expand Around Center: O(n²) time, **O(1) space** — preferred

**Visual — Expand Around Center:**
```
s = "r a c e c a r"
     0 1 2 3 4 5 6

Center i=3 ('e') — odd expansion:
  l=3, r=3  → "e"         ✓
  l=2, r=4  → "c e c"     ✓  s[2]='c' == s[4]='c'
  l=1, r=5  → "a c e c a" ✓  s[1]='a' == s[5]='a'
  l=0, r=6  → "r a c e c a r" ✓ s[0]='r' == s[6]='r'
  l=-1 → STOP  ←  found palindrome len=7 ⭐

Visual expansion at center=3:
          ← ← l                          r → →
  r  a  c [e] c  a  r
           ↑ center

Step 1:  r  a [c  e  c] a  r   s[2]==s[4] ✓ expand
Step 2:  r [a  c  e  c  a] r   s[1]==s[5] ✓ expand
Step 3: [r  a  c  e  c  a  r]  s[0]==s[6] ✓ expand
Step 4:  l=-1, r=7 → out of bounds → STOP

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Even center example — s = "c b b d"
                            0 1 2 3

Even center between i=1,i+1=2 ('b','b'):
  l=1, r=2  → "bb"   s[1]='b' == s[2]='b' ✓
  l=0, r=3  → "cbbd" s[0]='c' ≠ s[3]='d' ✗ STOP
  → palindrome "bb" len=2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DP Table approach — s = "aba":

     a  b  a
  a [T  F  T]   ← dp[0][2]: s[0]==s[2] && dp[1][1]=T → True
  b [   T  F]   ← dp[1][1]: single char
  a [      T]   ← dp[2][2]: single char

dp[i][j] = (s[i]==s[j]) && (j-i<=2 || dp[i+1][j-1])
```

---

## Problem Description

Given a string `s`, return the longest palindromic substring in `s`.

```
Example 1: s = "babad" → "bab" (or "aba")
Example 2: s = "cbbd" → "bb"
Example 3: s = "a" → "a"
Example 4: s = "ac" → "a"
```

---

## 📝 Interview Tips

1. **Clarify**: "Should I return start index or the substring?" (substring)
2. **Two cases**: always handle odd AND even length centers
3. **Don't forget O(1) space** — Expand Around Center > DP (same time, less space)
4. **Manacher's O(n)**: know it exists, but rarely needed in interviews
5. **Follow-ups**: Longest Palindromic Subsequence (DP), Count Palindromic Substrings

---

## Solutions

```typescript

/**
 * Solution 1: Brute Force — Check all substrings
 * Time: O(n³), Space: O(1)
 */
function longestPalindrome_brute(s: string): string {
  let longest = '';
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j <= s.length; j++) {
      const sub = s.slice(i, j);
      const rev = sub.split('').reverse().join('');
      if (sub === rev && sub.length > longest.length) {
        longest = sub;
      }
    }
  }
  return longest;
}

/**
 * Solution 2: Dynamic Programming
 * dp[i][j] = true if s[i..j] is a palindrome
 *
 * Time: O(n²), Space: O(n²)
 */
function longestPalindrome_dp(s: string): string {
  const n = s.length;
  const dp: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  let start = 0, maxLen = 1;

  // Every single char is palindrome
  for (let i = 0; i < n; i++) dp[i][i] = true;

  // Check length 2
  for (let i = 0; i < n - 1; i++) {
    if (s[i] === s[i + 1]) {
      dp[i][i + 1] = true;
      start = i;
      maxLen = 2;
    }
  }

  // Check length 3+
  for (let len = 3; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      if (s[i] === s[j] && dp[i + 1][j - 1]) {
        dp[i][j] = true;
        if (len > maxLen) { start = i; maxLen = len; }
      }
    }
  }
  return s.slice(start, start + maxLen);
}

/**
 * Solution 3: Expand Around Center (Optimal practical)
 *
 * For each center (single char or pair), expand outward while palindrome.
 *
 * Time: O(n²), Space: O(1) — best space complexity
 */
function longestPalindrome(s: string): string {
  if (s.length < 2) return s;

  let start = 0, maxLen = 1;

  function expand(left: number, right: number): void {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      if (right - left + 1 > maxLen) {
        maxLen = right - left + 1;
        start = left;
      }
      left--;
      right++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    expand(i, i);     // odd length: center at i
    expand(i, i + 1); // even length: center between i and i+1
  }

  return s.slice(start, start + maxLen);
}

// === Test Cases ===
console.log(longestPalindrome("babad")); // "bab" or "aba"
console.log(longestPalindrome("cbbd"));  // "bb"
console.log(longestPalindrome("a"));     // "a"
console.log(longestPalindrome("ac"));    // "a"
console.log(longestPalindrome("racecar")); // "racecar"

```

---

## 🔗 Related Problems

- [Valid Palindrome](./05-valid-palindrome.md) — prerequisite
- [Palindrome Partitioning](../../backtracking/problems/10-palindrome-partitioning.md) — backtracking + palindrome
- [Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/) — DP follow-up
