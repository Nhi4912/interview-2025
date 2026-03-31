---
layout: page
title: "Substring with Concatenation of All Words"
difficulty: Hard
category: String
tags: [Hash Table, String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/substring-with-concatenation-of-all-words"
---

# Substring with Concatenation of All Words / Chuỗi Con Chứa Ghép Nối Tất Cả Từ

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 10 companies
> **See also**: [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string) | [Permutation in String](https://leetcode.com/problems/permutation-in-string)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Tưởng tượng một chuỗi hạt — mỗi "từ" là một nhóm k hạt. Bạn muốn tìm mọi vị trí mà nếu đọc liên tiếp m nhóm hạt (mỗi nhóm k hạt) thì đúng là danh sách từ đã cho. Sliding window nhảy từng k bước (word size), không từng ký tự.

**Pattern Recognition:** Fixed-length words, need all permutations → HashMap của words + sliding window bước wordLen.

```
s="barfoothefoobarman", words=["foo","bar"]
wordLen=3, totalLen=6, n=18

Start offsets 0,1,2 (modulo wordLen):
offset=0: check [0..5]="barfoo" → {bar:1,foo:1} ✓ → index 0
          slide: drop "bar", add "man" → miss
          add "foo" at 9: check [3..8]="foothe"? keep sliding...
          at i=9: [9..14]="foobar" ✓ → index 9
```

---

## 📋 Problem / Bài Toán

Given string `s` and array `words` (all same length), return all starting indices where a substring of `s` is a **concatenation of all words** (in any order, each used exactly once).

- `s="barfoothefoobarman", words=["foo","bar"]` → `[0, 9]`
- `s="wordgoodgoodgoodbestword", words=["word","good","best","word"]` → `[]`
- `s="barfoofoobarthefoobarman", words=["bar","foo","the"]` → `[6, 9, 12]`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Word-level window**: Words are fixed length — slide by `wordLen` not by 1 char. Run `wordLen` separate passes (offsets 0..wordLen-1).
- 🔑 **Nhận biết**: "Permutation of fixed-length words" → đây là biến thể của Find All Anagrams nhưng ở word level.
- ⚡ **Brute O(n·m·k)**: Mỗi vị trí i, check m words — đơn giản để code trước, rồi nói về tối ưu.
- ⚡ **Sliding window O(n·k)**: Dùng `wordLen` passes, mỗi pass duy trì window bằng map — tốt nhất có thể.
- 🚨 **Duplicate words**: `words` có thể chứa duplicates — dùng frequency map, không phải Set.
- 💡 **totalLen check**: Nếu `i + totalLen > s.length` → không thể fit → break sớm.

---

## Solutions

### Solution 1 — Brute Force Check Each Position · O(n·m·k) time · O(m·k) space

```typescript
/**
 * For each valid starting position, extract m words of length wordLen
 * and compare against the target frequency map.
 * Time: O(n * m * k) where n=s.length, m=words.length, k=wordLen
 * Space: O(m * k)
 */
function findSubstring_brute(s: string, words: string[]): number[] {
  if (!s || !words.length) return [];
  const wordLen = words[0].length;
  const totalLen = wordLen * words.length;
  const result: number[] = [];

  const target = new Map<string, number>();
  for (const w of words) target.set(w, (target.get(w) ?? 0) + 1);

  for (let i = 0; i <= s.length - totalLen; i++) {
    const seen = new Map<string, number>();
    let j = 0;
    while (j < words.length) {
      const word = s.substring(i + j * wordLen, i + j * wordLen + wordLen);
      if (!target.has(word)) break;
      seen.set(word, (seen.get(word) ?? 0) + 1);
      if ((seen.get(word) ?? 0) > (target.get(word) ?? 0)) break;
      j++;
    }
    if (j === words.length) result.push(i);
  }
  return result;
}

console.log(findSubstring_brute("barfoothefoobarman", ["foo", "bar"])); // [0,9]
console.log(findSubstring_brute("wordgoodgoodgoodbestword", ["word", "good", "best", "word"])); // []
console.log(findSubstring_brute("barfoofoobarthefoobarman", ["bar", "foo", "the"])); // [6,9,12]
```

### Solution 2 — Sliding Window (Word-Size Step) · O(n·k) time · O(m·k) space

```typescript
/**
 * Run wordLen separate sliding windows (one per offset 0..wordLen-1).
 * Each window slides by wordLen steps, maintaining a frequency map.
 * When window is full, record position; when a word is invalid, reset.
 * Time: O(n * k) | Space: O(m * k)
 */
function findSubstring(s: string, words: string[]): number[] {
  if (!s || !words.length) return [];
  const wordLen = words[0].length;
  const numWords = words.length;
  const result: number[] = [];

  const target = new Map<string, number>();
  for (const w of words) target.set(w, (target.get(w) ?? 0) + 1);

  // Try each starting offset within first word-length
  for (let offset = 0; offset < wordLen; offset++) {
    const window = new Map<string, number>();
    let count = 0; // valid words in window
    let left = offset;

    for (let right = offset; right <= s.length - wordLen; right += wordLen) {
      const word = s.substring(right, right + wordLen);
      if (target.has(word)) {
        window.set(word, (window.get(word) ?? 0) + 1);
        count++;
        // shrink left if word appears too many times
        while ((window.get(word) ?? 0) > (target.get(word) ?? 0)) {
          const leftWord = s.substring(left, left + wordLen);
          window.set(leftWord, (window.get(leftWord) ?? 0) - 1);
          count--;
          left += wordLen;
        }
        if (count === numWords) result.push(left);
      } else {
        // invalid word → reset window
        window.clear();
        count = 0;
        left = right + wordLen;
      }
    }
  }
  return result;
}

console.log(findSubstring("barfoothefoobarman", ["foo", "bar"])); // [0,9]
console.log(findSubstring("wordgoodgoodgoodbestword", ["word", "good", "best", "word"])); // []
console.log(findSubstring("barfoofoobarthefoobarman", ["bar", "foo", "the"])); // [6,9,12]
console.log(findSubstring("a", ["a"])); // [0]
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                                                        | Difficulty | Pattern        |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------- | -------------- |
| [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string)                                   | 🟡 Medium  | Sliding Window |
| [Permutation in String](https://leetcode.com/problems/permutation-in-string)                                                   | 🟡 Medium  | Sliding Window |
| [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring)                                             | 🔴 Hard    | Sliding Window |
| [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters) | 🟡 Medium  | Sliding Window |
