---
layout: page
title: "Shortest Palindrome"
difficulty: Hard
category: String
tags: [String, Rolling Hash, String Matching, Hash Function]
leetcode_url: "https://leetcode.com/problems/shortest-palindrome"
---

# Shortest Palindrome / Palindrome Ngắn Nhất

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: String Matching
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii) | [Count Prefix and Suffix Pairs I](https://leetcode.com/problems/count-prefix-and-suffix-pairs-i)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như thợ cắt gương tìm phần đối xứng lớn nhất từ cạnh trái — nếu `"aacecaaa"` đã đối xứng đến ký tự nào từ đầu, ta chỉ cần thêm phần còn lại (đã đảo ngược) vào trước. Bài toán giảm về: **tìm palindrome dài nhất bắt đầu từ index 0**.

**Pattern Recognition:**

- Signal: "shortest palindrome by prepending" → **KMP on s + '#' + reverse(s)**
- Tìm longest palindromic prefix của `s` bằng KMP failure function
- Key insight: Kết hợp `s + '#' + rev(s)` → failure function cuối cùng cho độ dài palindromic prefix

**Visual — Shortest Palindrome with KMP:**

```
s = "aacecaaa"
rev = "aaacecaa"
combined = "aacecaaa#aaacecaa"

KMP failure function (partial match table):
 a a c e c a a a # a a a c e c a a
 0 1 0 0 0 1 2 2 0 1 2 2 3 4 5 6 7

Last value = 7 → longest palindromic prefix has length 7 ("aacecaa")
Remaining: s[7..] = "a" → reversed = "a"
Result: "a" + "aacecaaa" = "aaacecaaa"

s = "abcd"
rev = "dcba"
combined = "abcd#dcba"
failure: 0 0 0 0 0 0 0 0 0 → last = 0
Remaining: s[0..] = "abcd" → reversed = "dcb"
Result: "dcb" + "abcd" = "dcbabcd"
```

---

## Problem Description

Given a string `s`, you can add characters in front of it. Find and return the shortest palindrome you can find by performing this transformation. Essentially, find the longest palindromic prefix of `s`, then prepend the reverse of the remaining suffix.

**Example 1:** `s = "aacecaaa"` → `"aaacecaaa"`
**Example 2:** `s = "abcd"` → `"dcbabcd"`

Constraints:

- `0 <= s.length <= 5 * 10^4`
- `s` consists of lowercase English letters only

---

## 📝 Interview Tips

1. **Clarify (VN)**: "Chỉ thêm vào ĐẦU, không thêm vào cuối và không xóa ký tự nào" / **EN**: Only prepending allowed — no appending or deletions
2. **Brute force (VN)**: "Thử từng prefix: kiểm tra palindrome O(n) → O(n²) tổng" / **EN**: Try all prefixes from longest to shortest, check if palindrome — O(n²)
3. **Key reduction (VN)**: "Bài này = tìm palindromic prefix dài nhất của s" / **EN**: Finding longest palindromic prefix is the core sub-problem
4. **KMP insight (VN)**: "s + '#' + reverse(s): failure function cuối = độ dài palindromic prefix" / **EN**: Concatenate with sentinel `#` to prevent overlap matching
5. **Why '#' separator (VN)**: "Ngăn KMP match vượt qua ranh giới giữa s và rev(s)" / **EN**: Separator ensures no cross-boundary matches in the combined string
6. **Follow-up (VN)**: "Nếu cần THÊM VÀO CUỐI thay vì đầu? → reverse bài toán" / **EN**: Appending version — reverse the problem symmetrically

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — try each prefix
 * Time: O(n²) — check each prefix if palindrome
 * Space: O(n) — string operations
 */
function shortestPalindromeBrute(s: string): string {
  if (s.length <= 1) return s;
  // Find longest palindromic prefix by trying from full length down
  for (let end = s.length; end >= 0; end--) {
    const prefix = s.slice(0, end);
    const rev = prefix.split("").reverse().join("");
    if (prefix === rev) {
      // prefix is palindrome — prepend reverse of remaining suffix
      const suffix = s.slice(end);
      return suffix.split("").reverse().join("") + s;
    }
  }
  return s;
}

/**
 * Solution 2: KMP Failure Function — O(n)
 * Time: O(n) — KMP on combined string of length 2n+1
 * Space: O(n) — failure function array
 *
 * Build combined = s + '#' + reverse(s)
 * The last value of the KMP failure function = length of longest palindromic prefix
 */
function shortestPalindrome(s: string): string {
  if (s.length <= 1) return s;

  const rev = s.split("").reverse().join("");
  const combined = s + "#" + rev;
  const n = combined.length;

  // Build KMP partial match (failure) table
  const fail = new Array(n).fill(0);
  for (let i = 1, j = 0; i < n; i++) {
    while (j > 0 && combined[i] !== combined[j]) j = fail[j - 1];
    if (combined[i] === combined[j]) j++;
    fail[i] = j;
  }

  // fail[n-1] = length of longest palindromic prefix of s
  const palindromeLen = fail[n - 1];

  // Prepend the reverse of the non-palindromic suffix
  const suffix = s.slice(palindromeLen);
  return suffix.split("").reverse().join("") + s;
}

/**
 * Solution 3: Rolling Hash — O(n) average, avoids worst-case string comparison
 * Time: O(n) average
 * Space: O(1) extra
 */
function shortestPalindromeHash(s: string): string {
  const n = s.length;
  const BASE = 31,
    MOD = 1e9 + 7;
  let forward = 0,
    backward = 0,
    power = 1;
  let palindromeLen = 0;

  for (let i = 0; i < n; i++) {
    const c = s.charCodeAt(i) - 96;
    forward = (forward * BASE + c) % MOD;
    backward = (backward + c * power) % MOD;
    power = (power * BASE) % MOD;
    if (forward === backward) palindromeLen = i + 1;
  }

  const suffix = s.slice(palindromeLen);
  return suffix.split("").reverse().join("") + s;
}

// === Test Cases ===
console.log(shortestPalindrome("aacecaaa")); // "aaacecaaa"
console.log(shortestPalindrome("abcd")); // "dcbabcd"
console.log(shortestPalindrome("")); // ""
console.log(shortestPalindrome("a")); // "a"
console.log(shortestPalindrome("aa")); // "aa"
console.log(shortestPalindrome("aba")); // "aba"
```

---

## 🔗 Related Problems

| Problem                                                                                                                                | Pattern           | Difficulty |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------- |
| [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring)                                           | DP / Two Pointers | 🟡 Medium  |
| [Palindrome Pairs](https://leetcode.com/problems/palindrome-pairs)                                                                     | Trie / KMP        | 🔴 Hard    |
| [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) | KMP               | 🟢 Easy    |
| [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii)                                     | Trie              | 🔴 Hard    |
| [Shortest Palindrome — LeetCode](https://leetcode.com/problems/shortest-palindrome)                                                    | KMP               | 🔴 Hard    |
