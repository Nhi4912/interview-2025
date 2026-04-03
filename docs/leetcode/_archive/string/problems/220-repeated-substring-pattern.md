---
layout: page
title: "Repeated Substring Pattern"
difficulty: Easy
category: String
tags: [String, String Matching]
leetcode_url: "https://leetcode.com/problems/repeated-substring-pattern"
---

# Repeated Substring Pattern / Mẫu Chuỗi Lặp Lại

> **Difficulty**: 🟢 Easy | **Category**: String | **Pattern**: KMP / String Doubling

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như kiểm tra một bài hát có phải là đoạn điệp khúc lặp lại không — nếu ghép bài hát với chính nó rồi bỏ đầu bỏ đuôi, bài hát vẫn xuất hiện ở giữa.

**Pattern Recognition:**

- Classic trick: if `s` is made of repeated substring, then `s` appears in `(s+s)[1..-1]`
- KMP approach: check if last value of failure function creates a valid period
- Period p = n - lps[n-1]; valid if p divides n

**Visual:**

```
s = "abcabc"

Method 1 (doubling):
  s+s = "abcabcabcabc"
  strip first & last: "bcabcabcab"
  find "abcabc" in "bcabcabcab" → YES at index 3 → true ✓

Method 2 (KMP lps):
  s = "abcabc", n=6
  lps = [0,0,0,1,2,3]
  period = n - lps[n-1] = 6 - 3 = 3
  n % period = 6 % 3 = 0 → true ✓

s = "abac"
  lps = [0,0,1,0]
  period = 4 - 0 = 4 = n → not a repeat → false
```

## Problem Description

Given a string `s`, return `true` if it can be constructed by taking a substring and repeating it at least twice.

**Example 1:** `s = "abab"` → `true` ("ab" repeated twice)
**Example 2:** `s = "aba"` → `false`
**Example 3:** `s = "abcabcabcabc"` → `true` ("abcabc" or "abc")

**Constraints:** `1 <= s.length <= 10^4`, lowercase letters only

## 📝 Interview Tips

1. **Clarify**: Substring must repeat at least twice (so length ≤ n/2)
2. **Approach**: String doubling trick: check if s appears in (s+s)[1:-1]
3. **Edge cases**: Length 1 → always false; length 2 → both chars must match
4. **Optimize**: KMP failure function gives O(n) with O(n) space
5. **Follow-up**: Find the shortest such repeating substring?
6. **Complexity**: Time O(n), Space O(n)

## Solutions

```typescript
// Solution 1: String Doubling Trick — Time: O(n) | Space: O(n)
function repeatedSubstringPattern(s: string): boolean {
  const doubled = s + s;
  // Remove first and last character, check if s appears inside
  const inner = doubled.slice(1, doubled.length - 1);
  return inner.includes(s);
}

// Solution 2: KMP Failure Function — Time: O(n) | Space: O(n)
function repeatedSubstringPattern2(s: string): boolean {
  const n = s.length;
  const lps = new Array<number>(n).fill(0);

  // Build KMP partial-match table (failure function)
  let len = 0;
  let i = 1;
  while (i < n) {
    if (s[i] === s[len]) {
      lps[i++] = ++len;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i++] = 0;
    }
  }

  const period = n - lps[n - 1];
  // Valid repeating pattern if period < n AND n is divisible by period
  return period < n && n % period === 0;
}

// Solution 3: Brute Force Substring Check — Time: O(n^2) | Space: O(n)
function repeatedSubstringPattern3(s: string): boolean {
  const n = s.length;

  // Try all possible pattern lengths from 1 to n/2
  for (let len = 1; len <= Math.floor(n / 2); len++) {
    if (n % len !== 0) continue;

    const pattern = s.slice(0, len);
    const reps = n / len;
    if (pattern.repeat(reps) === s) return true;
  }

  return false;
}

// Tests
console.log(repeatedSubstringPattern("abab")); // true
console.log(repeatedSubstringPattern("aba")); // false
console.log(repeatedSubstringPattern("abcabcabcabc")); // true
console.log(repeatedSubstringPattern("a")); // false
console.log(repeatedSubstringPattern("aa")); // true
```

## 🔗 Related Problems

| Problem                                                                                                 | Relationship                               |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [Implement strStr()](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/) | KMP string matching foundation             |
| [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/)                               | KMP failure function application           |
| [String Compression](https://leetcode.com/problems/string-compression/)                                 | Run-length encoding / repetition detection |
