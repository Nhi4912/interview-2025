---
layout: page
title: "String Transformation"
difficulty: Hard
category: Dynamic Programming
tags: [Math, String, Dynamic Programming, String Matching]
leetcode_url: "https://leetcode.com/problems/string-transformation"
---

# String Transformation / Biến Đổi Chuỗi

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming + Z-function / KMP
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Maximum Repeating Substring](https://leetcode.com/problems/maximum-repeating-substring) | [Word Break](https://leetcode.com/problems/word-break)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Như đếm số cách chia một bài diễn văn thành các đoạn, mỗi đoạn phải là phần đầu (prefix) của một câu chuẩn. Với bài diễn văn dài, dùng Z-function để biết tại mỗi vị trí, prefix dài nhất của str2 khớp với str1 — rồi DP đếm số cách phân hoạch.

**Pattern Recognition:**

- Signal: "partition str1 into pieces, each piece is prefix of str2" → **DP + String Matching**
- Z-function của `str2 + '#' + str1` cho biết tại mỗi vị trí i trong str1, khớp dài nhất với prefix của str2
- Key insight: dp[i] = số cách split str1[0..i-1], transition dùng Z-values để duyệt valid lengths

**Visual — str1 = "aaaa", str2 = "aa":**

```
Z-concat: "aa#aaaa"
Z-values:  [7,1,0,2,2,1,0]  (index 3..6 = positions in str1)
str1 pos:           0 1 2 3

dp[0] = 1 (base)
dp[2] += dp[0] → dp[2] = 1   (str1[0..1]="aa" is prefix of str2)
dp[2] += dp[0] → dp[2] = 1   (len=2 only)
dp[4] += dp[2] → dp[4] = 1
dp[4] += dp[2] → dp[4] = 2   (two ways: "aa|aa" and... both splits)
Answer: dp[4] = 2
```

---

## Problem Description

Given strings `str1` and `str2`, count the number of ways to partition `str1` into contiguous non-empty substrings such that every substring is a **prefix** of `str2`. Return the count modulo `10^9 + 7`.

- Example 1: `str1 = "aab"`, `str2 = "aabab"` → `2` (splits: `"a|ab"`, `"aa|b"` wait, only prefixes of str2="aabab" count: "a","aa","aab","aaba","aabab")
- Example 2: `str1 = "aa"`, `str2 = "a"` → `1` (only valid split: `"a|a"`)

Constraints: `1 <= str1.length, str2.length <= 10^5`, lowercase English letters

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Mỗi phần phải là prefix của str2, không phải substring tùy ý" / Each piece must be a prefix, not any substring
2. **Z-function**: Tính Z cho `str2 + '#' + str1` → Z[n2+1+i] = max prefix of str2 matching str1[i..]
3. **DP transition**: Với mỗi vị trí i, tất cả len từ 1 đến min(Z[n2+1+i], n2) đều valid
4. **Naive O(n²)** inner loop — for Hard problems this is often acceptable to show; optimize only if asked
5. **Modular arithmetic**: Mọi phép cộng đều `% MOD` — dùng BigInt hoặc chú ý overflow
6. **Edge case**: `str2.length < any piece needed` → some positions have Z=0 → dp stays 0 there

---

## Solutions

```typescript
/**
 * Z-function helper: Z[i] = length of longest common prefix of s and s[i..]
 * Time: O(n)
 */
function zFunction(s: string): number[] {
  const n = s.length;
  const z = new Array(n).fill(0);
  z[0] = n;
  let l = 0,
    r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] > r) {
      l = i;
      r = i + z[i];
    }
  }
  return z;
}

/**
 * Solution 1: Brute Force DP — O(n1 * n2) per position
 * Time: O(n1² · n2) worst case
 * Space: O(n1)
 */
function stringTransformationBrute(str1: string, str2: string): number {
  const MOD = 1_000_000_007;
  const n1 = str1.length;
  const dp = new Array(n1 + 1).fill(0);
  dp[0] = 1;
  for (let i = 0; i < n1; i++) {
    if (!dp[i]) continue;
    for (let len = 1; i + len <= n1; len++) {
      if (str2.startsWith(str1.slice(i, i + len))) {
        dp[i + len] = (dp[i + len] + dp[i]) % MOD;
      } else break; // prefixes only — once mismatch, longer won't match
    }
  }
  return dp[n1];
}

/**
 * Solution 2: DP + Z-function (Optimal)
 * Time: O((n1 + n2)) for Z-function + O(n1 * avg_match) for DP transitions
 * Space: O(n1 + n2)
 */
function stringTransformation(str1: string, str2: string): number {
  const MOD = 1_000_000_007;
  const n1 = str1.length;
  const n2 = str2.length;

  // Build Z on combined string: str2 + '#' + str1
  const combined = str2 + "#" + str1;
  const z = zFunction(combined);

  const dp = new Array(n1 + 1).fill(0);
  dp[0] = 1;

  for (let i = 0; i < n1; i++) {
    if (!dp[i]) continue;
    // z[n2+1+i] = how far str1[i..] matches prefix of str2
    const matchLen = Math.min(z[n2 + 1 + i], n2);
    for (let len = 1; len <= matchLen; len++) {
      dp[i + len] = (dp[i + len] + dp[i]) % MOD;
    }
  }

  return dp[n1];
}

// === Test Cases ===
console.log(stringTransformation("aab", "aabab")); // 2
console.log(stringTransformation("aa", "a")); // 1
console.log(stringTransformation("abc", "abcd")); // 1
console.log(stringTransformation("aaa", "a")); // 1
```

---

## 🔗 Related Problems

- [Word Break](https://leetcode.com/problems/word-break) — same DP structure, dictionary instead of single prefix string
- [Maximum Repeating Substring](https://leetcode.com/problems/maximum-repeating-substring) — simpler string DP without Z-function
- [Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix) — KMP failure function foundation
- [Find All Good Strings](https://leetcode.com/problems/find-all-good-strings) — string DP with automaton
- [Count the Number of Powerful Integers](https://leetcode.com/problems/count-the-number-of-powerful-integers) — digit DP with string constraints
