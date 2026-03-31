---
layout: page
title: "Break a Palindrome"
difficulty: Medium
category: String
tags: [String, Greedy]
leetcode_url: "https://leetcode.com/problems/break-a-palindrome"
---

# Break a Palindrome / Phá Vỡ Chuỗi Palindrome

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii) | [Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Muốn phá một tấm gương đối xứng với chi phí nhỏ nhất — đập vào điểm không phải tâm đối xứng, chọn điểm gần bên trái nhất để kết quả nhỏ nhất theo lexicographic order.

**Pattern Recognition:**

- Signal: "replace one char" + "lexicographically smallest non-palindrome" → **Greedy, two cases**
- Case 1: Thay ký tự `!= 'a'` đầu tiên (không phải tâm) thành `'a'` → nhỏ nhất có thể
- Case 2: Nếu toàn `'a'` hoặc chỉ toàn tâm là `'a'` → thay ký tự cuối thành `'b'`
- Key insight: nếu length=1 → trả về `""` (không thể phá)

**Visual — s="abcba" (length=5):**

```
 a b c b a
 0 1 2 3 4   mid = 2

Case 1: scan left half [0..1] for first char != 'a'
  i=0: 'a' → skip
  i=1: 'b' != 'a' AND i != mid=2 → replace → "aacba"
  "aacba" is NOT palindrome ✅ and lex smaller

s="aabaa": all non-mid chars are 'a' → Case 2 → "aabab"
```

---

## Problem Description

Given a palindrome string `palindrome`, replace exactly one character with any lowercase letter to make it **not** a palindrome. Return the **lexicographically smallest** such string. If impossible, return `""`.

```
Example 1: palindrome="abccba" → "aaccba"  (change b→a at index 1)
Example 2: palindrome="a"      → ""         (length 1, impossible)
Example 3: palindrome="aa"     → "ab"        (change last 'a'→'b')
```

Constraints: `1 <= palindrome.length <= 1000`, only lowercase English letters.

---

## 📝 Interview Tips

1. **Clarify**: "Length 1 → trả về \"\"? Kết quả phải lex smallest?" / Length-1 edge case, must be lex smallest?
2. **Brute force**: "Thử thay từng vị trí bằng 'a'..'z', check palindrome" → O(n²) / Try all positions and chars
3. **Greedy insight**: "Chỉ cần 2 cases — thay 'a' sớm nhất hoặc thay cuối thành 'b'" / Only 2 greedy cases needed
4. **Edge cases**: "\"a\" → \"\", \"aa\" → \"ab\", toàn 'a' → đổi cuối thành 'b'" / Single char, all-'a' string
5. **Why skip mid?**: "Giữa của palindrome lẻ không ảnh hưởng đối xứng — không cần đổi" / Center char doesn't affect symmetry
6. **Complexity**: "O(n) — một lần scan là đủ" / Linear scan, no nested loops needed

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — try every position and char
 * Time: O(26n^2) — for each position, try 26 chars, check palindrome O(n)
 * Space: O(n)
 */
function breakAPalindromeBrute(palindrome: string): string {
  const isPalin = (s: string) => s === s.split("").reverse().join("");
  const arr = palindrome.split("");
  let best = "";

  for (let i = 0; i < arr.length; i++) {
    const orig = arr[i];
    for (let c = 97; c <= 122; c++) {
      const ch = String.fromCharCode(c);
      if (ch === orig) continue;
      arr[i] = ch;
      const candidate = arr.join("");
      if (!isPalin(candidate)) {
        if (best === "" || candidate < best) best = candidate;
      }
      arr[i] = orig;
    }
  }
  return best;
}

/**
 * Solution 2: Greedy — two-case O(n)
 * Time: O(n) — single left-half scan
 * Space: O(n) — result string (or O(1) if mutate in place)
 */
function breakAPalindrome(palindrome: string): string {
  const n = palindrome.length;
  if (n === 1) return "";

  const arr = palindrome.split("");

  // Case 1: Find first non-'a' char in left half (exclude center for odd length)
  for (let i = 0; i < Math.floor(n / 2); i++) {
    if (arr[i] !== "a") {
      arr[i] = "a";
      return arr.join("");
    }
  }

  // Case 2: All left-half chars are 'a' (e.g., "aabaa" or "aa")
  // Change last char to 'b'
  arr[n - 1] = "b";
  return arr.join("");
}

// === Test Cases ===
console.log(breakAPalindrome("abccba")); // "aaccba"
console.log(breakAPalindrome("a")); // ""
console.log(breakAPalindrome("aa")); // "ab"
console.log(breakAPalindrome("aba")); // "aaa"? No → "abb" — wait: left half=['a'], all 'a' → change last → "abb"
```

---

## 🔗 Related Problems

- [Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii) — check if palindrome after at most one deletion
- [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring) — palindrome detection
- [Remove K Digits](https://leetcode.com/problems/remove-k-digits) — greedy lex-smallest construction
- [Largest Number](https://leetcode.com/problems/largest-number) — greedy ordering for optimal string
