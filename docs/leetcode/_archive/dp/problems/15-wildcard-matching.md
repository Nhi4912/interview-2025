---
layout: page
title: "Wildcard Matching"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming, Greedy, Recursion]
leetcode_url: "https://leetcode.com/problems/wildcard-matching"
---

# Wildcard Matching / Khớp Ký Tự Đại Diện

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: 2D DP / Greedy with Star Tracking
> **Frequency**: 📘 Tier 3 — Gặp ở 19 companies
> **See also**: [Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching) | [Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Nghĩ tới tính năng tìm kiếm file trên máy tính: gõ `*.txt` để tìm mọi file `.txt`, hoặc `report_?.pdf` để tìm `report_1.pdf`, `report_2.pdf`. Dấu `*` khớp mọi chuỗi bất kỳ, dấu `?` khớp đúng một ký tự bất kỳ. Bài toán này hỏi: chuỗi `s` có thể tìm thấy bởi pattern `p` không?

**Pattern Recognition:**

- Signal: "match entire string" + "wildcard ? and \*" + "overlapping subproblems" → **2D DP**
- `dp[i][j]` = "s[0..i-1] khớp với p[0..j-1]"
- `*` có thể match empty (dùng dp[i][j-1]) hoặc nhiều ký tự (dùng dp[i-1][j])

**Visual — dp table for s="adceb", p="*a*b":**

```
    ""  *   a   *   b
""  T   T   F   F   F
a   F   T   T   T   F
d   F   T   F   T   F
c   F   T   F   T   F
e   F   T   F   T   F
b   F   T   F   T   T  ← answer dp[5][4] = true ✅

Transitions:
  p[j]='?' or s[i]==p[j]: dp[i][j] = dp[i-1][j-1]
  p[j]='*':               dp[i][j] = dp[i][j-1]   (match empty)
                                   OR dp[i-1][j]   (match one more char)
```

---

## Problem Description

Given input string `s` and pattern `p` with `?` (match any single char) and `*` (match any sequence including empty), return `true` if `p` matches the **entire** string `s`. ([LeetCode 44](https://leetcode.com/problems/wildcard-matching))

```
Input: s="aa",  p="a"   → false  (pattern must match full string)
Input: s="aa",  p="*"   → true   (* matches "aa")
Input: s="cb",  p="?a"  → false  (b ≠ a)
Input: s="adceb", p="*a*b" → true
```

Constraints: `0 <= s.length, p.length <= 2000`, lowercase letters + `?` `*`

---

## 📝 Interview Tips

1. **Clarify**: "Pattern phải khớp toàn bộ s, không chỉ substring / Pattern must match entire s, not just a part"
2. **Distinguish from Regex**: "`*` ở đây match any sequence, không giống regex (regex `*` cần ký tự trước)" / Unlike regex, `*` here stands alone
3. **State definition**: "dp[i][j] = s[0..i-1] matches p[0..j-1]" / Define clearly before coding
4. **Base cases**: "dp[0][0]=true; dp[0][j]=true chỉ khi p[0..j-1] đều là `*`" / Handle empty string edge cases
5. **Space optimize**: "Chỉ cần dp[i-1][...] nên có thể dùng 1D array + prev variable" / Roll to 1D
6. **Greedy alternative**: "Track vị trí `*` cuối cùng và reset khi cần — O(n) space" / Greedy tracks last star

---

## Solutions

```typescript
/**
 * Solution 1: Recursion + Memoization (Top-Down DP)
 * Name: Top-Down DP
 * Time: O(m*n) — each (i,j) computed once
 * Space: O(m*n) — memo table
 */
function isMatchMemo(s: string, p: string): boolean {
  const memo = new Map<string, boolean>();

  function dp(i: number, j: number): boolean {
    if (j === p.length) return i === s.length;
    if (i === s.length) {
      // remaining pattern must all be '*'
      for (let k = j; k < p.length; k++) if (p[k] !== "*") return false;
      return true;
    }
    const key = `${i},${j}`;
    if (memo.has(key)) return memo.get(key)!;

    let result: boolean;
    if (p[j] === "*") {
      result = dp(i, j + 1) || dp(i + 1, j); // skip '*' OR consume one char
    } else {
      result = (p[j] === "?" || s[i] === p[j]) && dp(i + 1, j + 1);
    }
    memo.set(key, result);
    return result;
  }

  return dp(0, 0);
}

/**
 * Solution 2: Bottom-Up 2D DP (Optimal clarity)
 * Name: 2D DP Table
 * Time: O(m*n) — fill entire table
 * Space: O(m*n) — dp table
 */
function isMatch(s: string, p: string): boolean {
  const m = s.length,
    n = p.length;
  // dp[i][j] = s[0..i-1] matches p[0..j-1]
  const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;

  // empty string matches leading stars
  for (let j = 1; j <= n; j++) {
    if (p[j - 1] === "*") dp[0][j] = dp[0][j - 1];
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "*") {
        dp[i][j] = dp[i][j - 1] || dp[i - 1][j]; // empty or one-more
      } else if (p[j - 1] === "?" || s[i - 1] === p[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }

  return dp[m][n];
}

/**
 * Solution 3: Greedy with Star Tracking
 * Name: Greedy (Space-Optimal)
 * Time: O(m*n) worst case
 * Space: O(1)
 */
function isMatchGreedy(s: string, p: string): boolean {
  let si = 0,
    pi = 0,
    starPos = -1,
    matchPos = 0;

  while (si < s.length) {
    if (pi < p.length && (p[pi] === "?" || p[pi] === s[si])) {
      si++;
      pi++;
    } else if (pi < p.length && p[pi] === "*") {
      starPos = pi;
      matchPos = si;
      pi++; // star matches empty for now
    } else if (starPos !== -1) {
      matchPos++;
      si = matchPos;
      pi = starPos + 1; // star eats one more char
    } else {
      return false;
    }
  }

  // remaining pattern must be all '*'
  while (pi < p.length && p[pi] === "*") pi++;
  return pi === p.length;
}

// === Test Cases ===
console.log(isMatch("aa", "a")); // false
console.log(isMatch("aa", "*")); // true
console.log(isMatch("cb", "?a")); // false
console.log(isMatch("adceb", "*a*b")); // true
console.log(isMatch("acdcb", "a*c?b")); // false
console.log(isMatchGreedy("", "*")); // true
console.log(isMatchGreedy("", "")); // true
```

---

## 🔗 Related Problems

| Problem                                                                                  | Relationship                                        |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching) | Same 2D DP but `*` means "0+ of previous char"      |
| [Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string)       | Greedy range tracking for `*` as `(`, `)`, or empty |
| [Edit Distance](https://leetcode.com/problems/edit-distance)                             | 2D DP on two strings, similar table structure       |
| [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence)   | Same 2D DP skeleton                                 |
| [Is Subsequence](https://leetcode.com/problems/is-subsequence)                           | Simplified matching without wildcards               |
