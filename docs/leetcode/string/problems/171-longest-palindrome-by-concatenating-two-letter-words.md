---
layout: page
title: "Longest Palindrome by Concatenating Two Letter Words"
difficulty: Medium
category: String
tags: [Array, Hash Table, String, Greedy, Counting]
leetcode_url: "https://leetcode.com/problems/longest-palindrome-by-concatenating-two-letter-words"
---

# Longest Palindrome by Concatenating Two Letter Words / Chuỗi Đối Xứng Dài Nhất Bằng Cách Ghép Các Từ Hai Chữ

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Để tạo palindrome từ các từ 2 ký tự: **Nhóm 1** — ghép `"ab"` với `"ba"` (reverse của nhau): mỗi cặp đóng góp 4 ký tự. **Nhóm 2** — từ tự đối xứng `"aa"`, `"bb"`: mỗi cặp đóng góp 4 ký tự, và 1 từ thừa có thể đặt chính giữa (+2). Tổng = `4 * pairs + 4 * selfPairs + (2 nếu có từ self-palindrome lẻ)`.

**EN:** Two categories: (1) non-palindrome pairs `"ab"+"ba"` add 4 chars each. (2) self-palindromes `"aa"` can pair with each other for 4 chars, and one leftover can sit in the middle for +2.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Longest Palindrome by Concatenating Two Letter Words example:**

```
words = ["lc","cl","gg"]
"lc"↔"cl": 1 pair → 4 chars
"gg"↔"gg": but only 1 "gg", so 1 leftover → center → 2 chars
Total = 4 + 2 = 6 → "lc" + "gg" + "cl"

words = ["ab","ty","yt","lc","cl","ab"]
"ty"+"yt" → 4, "lc"+"cl" → 4, "ab"→1 leftover (no "ba"), no center
Total = 8
```

---

## Problem Description

| #   | Problem                       | Difficulty | Key Idea                      |
| --- | ----------------------------- | ---------- | ----------------------------- |
| 409 | Longest Palindrome            | 🟢 Easy    | Count odd-frequency chars     |
| 336 | Palindrome Pairs              | 🔴 Hard    | Pair all words for palindrome |
| 5   | Longest Palindromic Substring | 🟡 Medium  | Expand around center          |

---

## 📝 Interview Tips

- 🇻🇳 **Hai loại từ:** từ không đối xứng (cần reverse của nó) và từ tự đối xứng (`"aa"`)
- 🇬🇧 **Two categories:** asymmetric words need their reverse; symmetric words pair with themselves
- 🇻🇳 **Đếm cặp:** `min(count["ab"], count["ba"])` cặp — mỗi cặp = 4 ký tự
- 🇬🇧 **Pair count:** `Math.min(freq[w], freq[reverse(w)])` pairs per asymmetric pair
- 🇻🇳 **Từ tự palindrome:** đếm floor(count/2) cặp — 1 thừa → có thể làm trung tâm
- 🇬🇧 **Self-palindromes:** `Math.floor(freq["aa"] / 2)` full pairs + check if any odd count remains
- 🇻🇳 **Tránh đếm 2 lần:** chỉ xét `"ab"` khi `a <= b` để không đếm cả `"ab"` lẫn `"ba"`
- 🇬🇧 **Avoid double counting:** iterate asymmetric pairs once by checking `w[0] <= w[1]`

---

## Solutions

```typescript
/**
 * Count pairs from asymmetric words and self-palindromes separately.
 * Time: O(n) | Space: O(n)
 */
function longestPalindrome(words: string[]): number {
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);

  let length = 0;
  let hasOddSelfPalin = false;

  for (const [w, cnt] of freq) {
    const rev = w[1] + w[0];
    if (w === rev) {
      // Self-palindrome: "aa", "bb", etc.
      length += Math.floor(cnt / 2) * 4;
      if (cnt % 2 === 1) hasOddSelfPalin = true;
    } else if (w < rev) {
      // Asymmetric pair — process once (w < rev avoids double counting)
      const pairs = Math.min(cnt, freq.get(rev) ?? 0);
      length += pairs * 4;
    }
  }

  if (hasOddSelfPalin) length += 2;
  return length;
}

console.log(longestPalindrome(["lc", "cl", "gg"])); // 6
console.log(longestPalindrome(["ab", "ty", "yt", "lc", "cl", "ab"])); // 8
console.log(longestPalindrome(["cc", "ll", "xx"])); // 2
console.log(longestPalindrome(["aa", "aa"])); // 8
console.log(longestPalindrome(["aa", "bb"])); // 2

/**
 * Same logic using a 26x26 frequency array for O(1) lookup.
 * Time: O(n) | Space: O(26*26) = O(1)
 */
function longestPalindrome2(words: string[]): number {
  const freq: number[][] = Array.from({ length: 26 }, () => new Array(26).fill(0));
  for (const w of words) {
    freq[w.charCodeAt(0) - 97][w.charCodeAt(1) - 97]++;
  }

  let length = 0;
  let centerUsed = false;

  for (let i = 0; i < 26; i++) {
    // Self-palindromes: i == j
    const sc = freq[i][i];
    length += Math.floor(sc / 2) * 4;
    if (sc % 2 === 1) centerUsed = true;

    // Asymmetric pairs: (i, j) with i < j
    for (let j = i + 1; j < 26; j++) {
      const pairs = Math.min(freq[i][j], freq[j][i]);
      length += pairs * 4;
    }
  }

  if (centerUsed) length += 2;
  return length;
}

console.log(longestPalindrome2(["lc", "cl", "gg"])); // 6
console.log(longestPalindrome2(["ab", "ty", "yt", "lc", "cl", "ab"])); // 8
console.log(longestPalindrome2(["cc", "ll", "xx"])); // 2

/**
 * Greedily consume pairs: remove matched pairs from freq map.
 * Time: O(n) | Space: O(n)
 */
function longestPalindrome3(words: string[]): number {
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);

  let len = 0,
    center = 0;
  for (const [w, cnt] of freq) {
    const rev = w[1] + w[0];
    if (w === rev) {
      len += Math.floor(cnt / 2) * 4;
      if (cnt % 2 === 1) center = 2;
    } else {
      const mirror = freq.get(rev) ?? 0;
      len += Math.min(cnt, mirror) * 4;
    }
  }
  return len + center;
}

console.log(longestPalindrome3(["lc", "cl", "gg"])); // 6
console.log(longestPalindrome3(["aa", "aa"])); // 8
```

---

## 🔗 Related Problems

| #   | Problem                       | Difficulty | Key Idea                      |
| --- | ----------------------------- | ---------- | ----------------------------- |
| 409 | Longest Palindrome            | 🟢 Easy    | Count odd-frequency chars     |
| 336 | Palindrome Pairs              | 🔴 Hard    | Pair all words for palindrome |
| 5   | Longest Palindromic Substring | 🟡 Medium  | Expand around center          |
