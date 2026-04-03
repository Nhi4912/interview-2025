---
layout: page
title: "Word Pattern"
difficulty: Easy
category: String
tags: [Hash Table, String]
leetcode_url: "https://leetcode.com/problems/word-pattern"
---

# Word Pattern / Mẫu Từ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) | [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống dịch mã Caesar — mỗi chữ cái mẫu ánh xạ sang đúng một từ, và mỗi từ chỉ ứng với đúng một chữ cái. Cần ánh xạ **hai chiều** (bijection). Nếu 'a'→"dog" thì không thể 'b'→"dog".

```
pattern = "abba"   s = "dog cat cat dog"
words   = ["dog","cat","cat","dog"]

Forward map: a→dog, b→cat, b→cat✓, a→dog✓
Reverse map: dog→a, cat→b, cat→b✓, dog→a✓

If pattern = "abba", s = "dog cat cat fish":
  a→dog but fish≠dog at index 3 → false ❌
```

---

## Problem Description

Given a `pattern` string and a string `s`, determine if `s` follows the same pattern, where every letter in `pattern` maps **bijectively** to a non-empty word in `s`.

**Example 1:** `pattern="abba", s="dog cat cat dog"` → `true`
**Example 2:** `pattern="abba", s="dog cat cat fish"` → `false`
**Example 3:** `pattern="aaaa", s="dog cat cat dog"` → `false`

Constraints: `1 ≤ pattern.length ≤ 300`, `s` contains only lowercase words separated by spaces.

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Số từ và độ dài pattern có bằng nhau không?" / Word count must equal pattern length?
2. **Key insight / Ý tưởng**: Cần bijection — ánh xạ hai chiều, không chỉ một chiều
3. **Brute force / Vét cạn**: This IS the optimal approach — O(n) single pass with two maps
4. **Common mistake / Lỗi thường gặp**: Chỉ map một chiều → sẽ bị "aa" → "dog cat" pass sai
5. **Edge cases / Trường hợp đặc biệt**: pattern.length ≠ words.length → false immediately
6. **Follow-up / Hỏi thêm**: "Nếu pattern là chuỗi từ thay vì ký tự?" / Word Pattern II (regex/backtrack)

---

## Solutions

```typescript
/**
 * Solution 1: Two HashMaps for bijection
 * Time: O(n) where n = number of words
 * Space: O(n)
 */
function wordPattern(pattern: string, s: string): boolean {
  const words = s.split(" ");
  if (pattern.length !== words.length) return false;

  const charToWord = new Map<string, string>();
  const wordToChar = new Map<string, string>();

  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    const word = words[i];

    if (charToWord.has(ch) && charToWord.get(ch) !== word) return false;
    if (wordToChar.has(word) && wordToChar.get(word) !== ch) return false;

    charToWord.set(ch, word);
    wordToChar.set(word, ch);
  }
  return true;
}

console.log(wordPattern("abba", "dog cat cat dog")); // true
console.log(wordPattern("abba", "dog cat cat fish")); // false
console.log(wordPattern("aaaa", "dog cat cat dog")); // false
console.log(wordPattern("abba", "dog dog dog dog")); // false

/**
 * Solution 2: Index normalization — map each sequence to first-seen indices
 * Both pattern and words must produce the same index sequence.
 * Time: O(n)
 * Space: O(n)
 */
function wordPatternIndex(pattern: string, s: string): boolean {
  const words = s.split(" ");
  if (pattern.length !== words.length) return false;

  const normalize = (arr: string[]): string => {
    const map = new Map<string, number>();
    return arr
      .map((x) => {
        if (!map.has(x)) map.set(x, map.size);
        return map.get(x);
      })
      .join(",");
  };

  return normalize([...pattern]) === normalize(words);
}

console.log(wordPatternIndex("abba", "dog cat cat dog")); // true
console.log(wordPatternIndex("abba", "dog cat cat fish")); // false
```

---

## 🔗 Related Problems

| Problem                                                                            | Pattern      | Difficulty |
| ---------------------------------------------------------------------------------- | ------------ | ---------- |
| [Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings)             | Hash Map     | Easy       |
| [Word Pattern II](https://leetcode.com/problems/word-pattern-ii)                   | Backtracking | Medium     |
| [Find and Replace Pattern](https://leetcode.com/problems/find-and-replace-pattern) | Hash Map     | Medium     |
| [Group Anagrams](https://leetcode.com/problems/group-anagrams)                     | Hash Map     | Medium     |
