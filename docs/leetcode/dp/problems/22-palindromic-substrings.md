---
layout: page
title: "Palindromic Substrings"
difficulty: Medium
category: Dynamic Programming
tags: [Two Pointers, String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/palindromic-substrings"
---

# Palindromic Substrings / Chuỗi Con Đối Xứng

> **Track**: DP + String | **Difficulty**: 🟡 Medium | **Pattern**: Expand Around Center
> **Frequency**: 📗 Tier 2 — Gặp ở 20+ companies (Amazon, Facebook, Google)
> **See also**: [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring) | [Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một tờ giấy gương — palindrome là chuỗi đọc xuôi ngược giống nhau. Cách hiệu quả nhất là chọn một tâm (có thể là 1 ký tự hoặc khoảng giữa 2 ký tự), rồi mở rộng ra hai phía khi còn khớp. Mỗi lần mở rộng thành công là tìm thêm một palindrome.

**Pattern Recognition:**

- Signal: "count palindromic substrings", "expand" → **Expand Around Center O(n²)**
- Tâm là 1 ký tự (odd length) hoặc 2 ký tự liền nhau (even length) → 2n-1 tâm
- DP table: `dp[i][j]` = true nếu `s[i..j]` là palindrome

**Visual — s = "aaa":**

```
Centers:  a   |   a   |   a
          0  0-1  1  1-2  2

Expand from center 0 (odd): "a" ✅
Expand from center 0-1 (even): s[0]=s[1]='a' → "aa" ✅, then out of bounds
Expand from center 1 (odd): "a", then s[0]=s[2]='a' → "aaa" ✅
Expand from center 1-2 (even): s[1]=s[2]='a' → "aa" ✅
Expand from center 2 (odd): "a" ✅

Total: 6 palindromes
```

---

## Problem Description

Given a string `s`, return the number of palindromic substrings in it. A substring is a contiguous sequence of characters within the string. Two substrings at different positions are counted separately even if they have the same characters.

```
Example 1: s="abc" → 3  ("a","b","c")
Example 2: s="aaa" → 6  ("a","a","a","aa","aa","aaa")
```

Constraints: `1 <= s.length <= 1000`, `s` consists of lowercase English letters

---

## 📝 Interview Tips

1. **Clarify**: "Single characters count as palindromes?" / Confirm length-1 substrings are valid (yes).
2. **Brute**: Check all O(n²) substrings in O(n) each → O(n³) total — too slow for n=1000.
3. **Expand**: 2n-1 centers, expand while matching → O(n²) time, O(1) space — optimal for most interviews.
4. **DP**: `dp[i][j] = s[i]===s[j] && (j-i<=2 || dp[i+1][j-1])` — O(n²) time + space.
5. **Odd vs Even**: Odd center = single char; Even center = pair of same chars — handle both.
6. **Manacher**: O(n) algorithm exists — mention if asked for optimal, but rarely required in interviews.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check all substrings
 * Time: O(n³) — O(n²) substrings × O(n) palindrome check each
 * Space: O(1)
 */
function countSubstrings1(s: string): number {
  let count = 0;
  const n = s.length;

  function isPalindrome(l: number, r: number): boolean {
    while (l < r) {
      if (s[l] !== s[r]) return false;
      l++;
      r--;
    }
    return true;
  }

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (isPalindrome(i, j)) count++;
    }
  }
  return count;
}

/**
 * Solution 2: Expand Around Center (Optimal practical)
 * Time: O(n²) — 2n-1 centers, each expands at most n/2 times
 * Space: O(1)
 *
 * For each center (single char OR gap between chars), expand outward
 * while s[left] === s[right]. Each successful expansion = one more palindrome.
 */
function countSubstrings(s: string): number {
  let count = 0;
  const n = s.length;

  function expand(l: number, r: number): void {
    while (l >= 0 && r < n && s[l] === s[r]) {
      count++;
      l--;
      r++;
    }
  }

  for (let i = 0; i < n; i++) {
    expand(i, i); // odd-length palindromes (center at i)
    expand(i, i + 1); // even-length palindromes (center between i and i+1)
  }
  return count;
}

/**
 * Solution 3: DP Table
 * Time: O(n²) — fill n×n table
 * Space: O(n²) — dp table
 *
 * dp[i][j] = true if s[i..j] is a palindrome.
 * Base: dp[i][i]=true (single chars), dp[i][i+1] = s[i]===s[i+1].
 * Transition: dp[i][j] = s[i]===s[j] && dp[i+1][j-1]
 * Iterate by length to ensure sub-problems are solved first.
 */
function countSubstrings3(s: string): number {
  const n = s.length;
  const dp: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  let count = 0;

  for (let len = 1; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (len === 1) dp[i][j] = true;
      else if (len === 2) dp[i][j] = s[i] === s[j];
      else dp[i][j] = s[i] === s[j] && dp[i + 1][j - 1];
      if (dp[i][j]) count++;
    }
  }
  return count;
}

// === Test Cases ===
console.log(countSubstrings("abc")); // 3
console.log(countSubstrings("aaa")); // 6
console.log(countSubstrings("a")); // 1
console.log(countSubstrings("aba")); // 4 ("a","b","a","aba")
console.log(countSubstrings1("aaa")); // 6
console.log(countSubstrings3("aaa")); // 6
```

---

## 🔗 Related Problems

| Problem                                                                                                | Relationship                              |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| [647. Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/)                   | This problem                              |
| [5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)       | Same expand technique, track max length   |
| [516. Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/) | DP variant — subsequence not substring    |
| [131. Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/)                 | Uses same palindrome check + backtracking |
| [680. Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/)                         | At-most-one deletion variant              |
