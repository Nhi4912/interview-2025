---
layout: page
title: "Rotate String"
difficulty: Easy
category: String
tags: [String, String Matching]
leetcode_url: "https://leetcode.com/problems/rotate-string"
---

# Rotate String / Xoay Chuỗi

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Matching
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) | [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như dây chuyền băng tải vòng tròn trong nhà máy — mọi cách xoay đều xuất hiện trong một vòng quay đầy đủ. Nếu bạn nối băng tải thành hai vòng `s+s`, thì tất cả các phiên bản xoay của `s` đều xuất hiện như một chuỗi con bên trong!

**Pattern Recognition:**

- Signal: "rotation check" → **Double string trick: `s+s` contains all rotations**
- Nếu `goal` là rotation của `s`, thì `goal` phải xuất hiện trong `s+s`
- Key insight: `s + s` chứa mọi rotation của `s` → bài toán giảm về substring search

**Visual — Rotate String:**

```
s    = "abcde"
goal = "cdeab"

s + s = "abcdeabcde"
              ↑↑↑↑↑
         contains "cdeab" ✅ → true

s    = "abcde"
goal = "abced"

s + s = "abcdeabcde"
        does NOT contain "abced" → false

All rotations of "abc" visible in "abcabc":
  "abcabc"
   abc       rotation 0
    bca      rotation 1
     cab     rotation 2
```

---

## Problem Description

Given two strings `s` and `goal`, return `true` if and only if `s` can become `goal` after some number of shifts. A shift moves the leftmost character of `s` to the rightmost position.

**Example 1:** `s = "abcde"`, `goal = "cdeab"` → `true`
**Example 2:** `s = "abcde"`, `goal = "abced"` → `false`

Constraints:

- `1 <= s.length, goal.length <= 100`
- `s` and `goal` consist of lowercase English letters

---

## 📝 Interview Tips

1. **Clarify (VN)**: "Xoay bao nhiêu lần cũng được? Đồng nghĩa kiểm tra mọi rotation" / **EN**: Any number of shifts allowed — check all n rotations
2. **Brute force (VN)**: "Thử từng rotation O(n²) — tạo chuỗi xoay rồi so sánh" / **EN**: Try each of n rotations, each comparison O(n) → O(n²) total
3. **Optimize (VN)**: "s+s chứa mọi rotation → dùng `includes()` O(n)" / **EN**: Concatenate `s+s` and check if `goal` is a substring — O(n)
4. **Length check (VN)**: "Nếu độ dài khác nhau thì chắc chắn false" / **EN**: Must check lengths are equal first — different lengths can't be rotations
5. **Edge cases (VN)**: `s = ""` và `goal = ""` → `true` (zero rotations) / **EN**: Empty strings are trivially equal (vacuous rotation)
6. **Follow-up (VN)**: "Nếu cần tìm số lần xoay tối thiểu?" / **EN**: Find minimum shifts → find index of goal in s+s, then mod n

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — try each rotation
 * Time: O(n²) — n rotations, each comparison O(n)
 * Space: O(n) — building rotation string
 */
function rotateStringBrute(s: string, goal: string): boolean {
  if (s.length !== goal.length) return false;
  for (let i = 0; i < s.length; i++) {
    const rotated = s.slice(i) + s.slice(0, i);
    if (rotated === goal) return true;
  }
  return false;
}

/**
 * Solution 2: Double String Trick (Optimal)
 * Time: O(n) — single substring search in string of length 2n
 * Space: O(n) — for the doubled string
 *
 * Key insight: every rotation of s appears as a substring of s+s
 */
function rotateString(s: string, goal: string): boolean {
  if (s.length !== goal.length) return false;
  return (s + s).includes(goal);
}

/**
 * Solution 3: KMP for O(n) guaranteed (no built-in)
 * Useful when you can't use built-in string search
 * Time: O(n) — KMP preprocessing + search
 * Space: O(n) — failure function array
 */
function rotateStringKMP(s: string, goal: string): boolean {
  if (s.length !== goal.length) return false;
  const text = s + s;
  const pattern = goal;
  const n = text.length,
    m = pattern.length;

  // Build KMP failure function
  const fail = new Array(m).fill(0);
  for (let i = 1, j = 0; i < m; i++) {
    while (j > 0 && pattern[i] !== pattern[j]) j = fail[j - 1];
    if (pattern[i] === pattern[j]) j++;
    fail[i] = j;
  }

  // KMP search
  for (let i = 0, j = 0; i < n; i++) {
    while (j > 0 && text[i] !== pattern[j]) j = fail[j - 1];
    if (text[i] === pattern[j]) j++;
    if (j === m) return true;
  }
  return false;
}

// === Test Cases ===
console.log(rotateString("abcde", "cdeab")); // true
console.log(rotateString("abcde", "abced")); // false
console.log(rotateString("", "")); // true
console.log(rotateString("a", "a")); // true
console.log(rotateString("aa", "a")); // false (different lengths)
```

---

## 🔗 Related Problems

| Problem                                                                                                                                | Pattern         | Difficulty |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------- |
| [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) | String Matching | 🟢 Easy    |
| [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome)                                                               | KMP             | 🔴 Hard    |
| [Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern)                                                 | String Matching | 🟢 Easy    |
| [Maximum Repeating Substring](https://leetcode.com/problems/maximum-repeating-substring)                                               | String Matching | 🟢 Easy    |
| [Rotate String — LeetCode](https://leetcode.com/problems/rotate-string)                                                                | String Matching | 🟢 Easy    |
