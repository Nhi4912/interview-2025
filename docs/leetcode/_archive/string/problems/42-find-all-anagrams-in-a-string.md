---
layout: page
title: "Find All Anagrams in a String"
difficulty: Medium
category: String
tags: [Hash Table, String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/find-all-anagrams-in-a-string"
---

# Find All Anagrams in a String / Tìm Tất Cả Vị Trí Anagram

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words) | [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như bạn đang kiểm tra từng ô cửa sổ có kích thước cố định trên một dãy phòng. Mỗi lần kéo cửa sổ sang phải một ô, bạn thêm phòng mới vào và bỏ phòng cũ ra — rồi so sánh bộ đồ đạc trong cửa sổ với bộ mẫu. Nếu khớp là tìm thấy anagram!

**Pattern Recognition:**

- Signal: "contiguous substring" + "fixed length" + "same characters" → **Fixed Sliding Window**
- Window size = `p.length`, slide from left to right across `s`
- Key insight: So sánh frequency map của window với frequency map của `p` — dùng `matches` counter để tránh so sánh toàn bộ map mỗi bước

**Visual — Find All Anagrams:**

```
s = "cbaebabacd",  p = "abc"
pFreq = {a:1, b:1, c:1}

i=0  window="cba"  freq={c:1,b:1,a:1}  matches=3 ✅ → [0]
i=1  slide: +e,-c  window="bae"  matches=2
i=2  slide: +b,-b  window="aeb"  matches=2
i=3  slide: +a,-a  window="eba"  matches=2
i=4  slide: +b,-e  window="bab"  matches=2
i=5  slide: +a,-b  window="aba"  matches=2
i=6  slide: +c,-a  window="bac"  freq={b:1,a:1,c:1} matches=3 ✅ → [6]
```

---

## Problem Description

Given two strings `s` and `p`, return an array of all the start indices of `p`'s anagrams in `s`. An anagram is a rearrangement of all characters in `p`. The answer may be returned in any order.

**Example 1:** `s = "cbaebabacd"`, `p = "abc"` → `[0, 6]`
**Example 2:** `s = "abab"`, `p = "ab"` → `[0, 1, 2]`

Constraints:

- `1 <= s.length, p.length <= 3 * 10^4`
- `s` and `p` consist of lowercase English letters

---

## 📝 Interview Tips

1. **Clarify (VN)**: "Cần contiguous substring hay subsequence?" / **EN**: Confirm anagram = same chars, contiguous window
2. **Brute force (VN)**: "Thử mọi window O(n·m) — sort từng window rồi so sánh" / **EN**: Sort each window → O(n·m·log m), then optimize
3. **Optimize (VN)**: "Fixed window size = len(p), dùng freq map + matches counter" / **EN**: Fixed window → add right char, remove left char, O(1) per slide
4. **Matches trick (VN)**: "Chỉ tăng/giảm `matches` khi freq đúng bằng target — tránh scan toàn bộ map" / **EN**: Track exact matches per character to avoid full map comparison
5. **Edge cases (VN)**: "p dài hơn s → return []" / **EN**: If `p.length > s.length` return empty immediately
6. **Follow-up (VN)**: "Nếu chỉ cần biết CÓ anagram hay không? → dùng bài 567" / **EN**: If only need existence → LC 567 Permutation in String

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — sort each window
 * Time: O(n * m * log m) — n windows, each sorted in O(m log m)
 * Space: O(m) — for sorting
 */
function findAnagramsBrute(s: string, p: string): number[] {
  const result: number[] = [];
  const pSorted = p.split("").sort().join("");
  for (let i = 0; i <= s.length - p.length; i++) {
    const window = s
      .slice(i, i + p.length)
      .split("")
      .sort()
      .join("");
    if (window === pSorted) result.push(i);
  }
  return result;
}

/**
 * Solution 2: Sliding Window with Frequency Map + Matches Counter
 * Time: O(n) — single pass, O(1) per slide (26-letter alphabet)
 * Space: O(1) — fixed-size frequency arrays (26 chars)
 */
function findAnagrams(s: string, p: string): number[] {
  if (p.length > s.length) return [];

  const result: number[] = [];
  const pFreq = new Array(26).fill(0);
  const wFreq = new Array(26).fill(0);
  const a = "a".charCodeAt(0);

  // Build frequency for p and initial window
  for (let i = 0; i < p.length; i++) {
    pFreq[p.charCodeAt(i) - a]++;
    wFreq[s.charCodeAt(i) - a]++;
  }

  // Count how many characters match exactly
  let matches = 0;
  for (let i = 0; i < 26; i++) {
    if (pFreq[i] === wFreq[i]) matches++;
  }

  for (let i = p.length; i < s.length; i++) {
    if (matches === 26) result.push(i - p.length);

    // Add new right character
    const rightIdx = s.charCodeAt(i) - a;
    if (wFreq[rightIdx] === pFreq[rightIdx]) matches--;
    wFreq[rightIdx]++;
    if (wFreq[rightIdx] === pFreq[rightIdx]) matches++;

    // Remove old left character
    const leftIdx = s.charCodeAt(i - p.length) - a;
    if (wFreq[leftIdx] === pFreq[leftIdx]) matches--;
    wFreq[leftIdx]--;
    if (wFreq[leftIdx] === pFreq[leftIdx]) matches++;
  }

  if (matches === 26) result.push(s.length - p.length);
  return result;
}

// === Test Cases ===
console.log(findAnagrams("cbaebabacd", "abc")); // [0, 6]
console.log(findAnagrams("abab", "ab")); // [0, 1, 2]
console.log(findAnagrams("aa", "bb")); // []
console.log(findAnagrams("a", "a")); // [0]
```

---

## 🔗 Related Problems

| Problem                                                                                                              | Pattern        | Difficulty |
| -------------------------------------------------------------------------------------------------------------------- | -------------- | ---------- |
| [Permutation in String](https://leetcode.com/problems/permutation-in-string)                                         | Sliding Window | 🟡 Medium  |
| [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring)                                   | Sliding Window | 🔴 Hard    |
| [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement)     | Sliding Window | 🟡 Medium  |
| [Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words) | Sliding Window | 🔴 Hard    |
| [Find All Anagrams in a String — LeetCode](https://leetcode.com/problems/find-all-anagrams-in-a-string)              | Sliding Window | 🟡 Medium  |
