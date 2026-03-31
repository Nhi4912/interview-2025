---
layout: page
title: "Reverse Words in a String II"
difficulty: Medium
category: String
tags: [Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/reverse-words-in-a-string-ii"
---

# Reverse Words in a String II / Reverse Words in a String II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers / In-Place
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string) | [String Compression](https://leetcode.com/problems/string-compression)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như lật ngược một cuốn sách rồi lật lại từng chương — lật toàn bộ mảng trước (các chữ trong mỗi từ bị đảo), rồi lật lại từng từ để chữ đúng thứ tự, nhưng thứ tự từ đã được đảo ngược.

**Visual — Reverse-all then reverse-each-word:**

```
Input:  ['t','h','e',' ','s','k','y',' ','i','s',' ','b','l','u','e']

Step 1: Reverse entire array
        ['e','u','l','b',' ','s','i',' ','y','k','s',' ','e','h','t']

Step 2: Reverse each word (separated by spaces)
  "eulb" → "blue"
  "si"   → "is"
  "yks"  → "sky"
  "eht"  → "the"

Result: ['b','l','u','e',' ','i','s',' ','s','k','y',' ','t','h','e']
        "blue is sky the" ✅

O(n) time, O(1) extra space — perfect for in-place constraint!
```

---

## Problem Description

Given a character array `s`, reverse the order of the **words** in-place. Words are separated by single spaces, no leading/trailing spaces.

**Example 1:** `['t','h','e',' ','s','k','y',' ','i','s',' ','b','l','u','e']` → `['b','l','u','e',' ','i','s',' ','s','k','y',' ','t','h','e']`
**Example 2:** `['a']` → `['a']`

Constraints: `1 <= s.length <= 10^5`, `s[i]` is a printable ASCII character, words separated by exactly one space, no leading/trailing spaces.

---

## 📝 Interview Tips

1. **Clarify**: "In-place quan trọng — không được tạo mảng mới, O(1) extra space" / In-place is key: no extra array allowed, O(1) extra space
2. **Two-step trick**: "Đảo toàn bộ → đảo từng từ — trick cổ điển cho bài này" / Reverse all then reverse each word: classic O(n) in-place trick
3. **Find words**: "Dùng hai con trỏ start/end để xác định ranh giới từng từ" / Use start/end pointers to find word boundaries
4. **Edge cases**: "Một từ duy nhất, một ký tự, từ có độ dài khác nhau" / Single word, single char, words of varying lengths
5. **Follow-up**: "Nếu có nhiều spaces? → xử lý thêm bước trim" / Multiple spaces → need extra trimming step
6. **Compare with #151**: "Bài I dùng string → split/join, bài II dùng char array → phải in-place" / String version can use split/join; char array version must be in-place

---

## Solutions

```typescript
/**
 * Solution 1: Extra space — split by space, reverse, rejoin (for understanding)
 * Time: O(n) — one pass to split + rejoin
 * Space: O(n) — new array (violates in-place requirement but illustrates logic)
 */
function reverseWordsBrute(s: string[]): void {
  const words = s.join('').split(' ').reverse();
  const result = words.join(' ').split('');
  for (let i = 0; i < s.length; i++) s[i] = result[i];
}

/**
 * Helper: reverse a portion of the array in-place
 */
function reverseRange(arr: string[], l: number, r: number): void {
  while (l < r) {
    [arr[l], arr[r]] = [arr[r], arr[l]];
    l++;
    r--;
  }
}

/**
 * Solution 2: Optimal — reverse all, then reverse each word in-place
 * Step 1: Reverse the entire array → words are in correct order but each reversed
 * Step 2: Find each word and reverse it back → words are correct
 * Time: O(n) — two linear passes total
 * Space: O(1) — pure in-place, no extra allocations
 */
function reverseWordsII(s: string[]): void {
  const n = s.length;

  // Step 1: reverse entire array
  reverseRange(s, 0, n - 1);

  // Step 2: reverse each individual word
  let start = 0;
  for (let i = 0; i <= n; i++) {
    if (i === n || s[i] === ' ') {
      reverseRange(s, start, i - 1);
      start = i + 1;
    }
  }
}

// === Test Cases ===
const s1 = ['t','h','e',' ','s','k','y',' ','i','s',' ','b','l','u','e'];
reverseWordsII(s1);
console.log(s1.join(''));  // "blue is sky the"

const s2 = ['a',' ','b'];
reverseWordsII(s2);
console.log(s2.join(''));  // "b a"

const s3 = ['h','e','l','l','o'];
reverseWordsII(s3);
console.log(s3.join(''));  // "hello"  (single word, unchanged)
```

---

## 🔗 Related Problems

| Problem | Pattern | Difficulty |
|---------|---------|-----------|
| [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string) | Two Pointers | Medium |
| [String Compression](https://leetcode.com/problems/string-compression) | Two Pointers | Medium |
| [Rotate Array](https://leetcode.com/problems/rotate-array) | Two Pointers | Medium |
| [Find the Index of the First Occurrence](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) | String | Easy |
