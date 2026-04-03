---
layout: page
title: "Odd String Difference"
difficulty: Easy
category: String
tags: [Array, Hash Table, String]
leetcode_url: "https://leetcode.com/problems/odd-string-difference"
---

# Odd String Difference / Chuỗi Khác Biệt Lẻ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Longest String Chain](https://leetcode.com/problems/longest-string-chain)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Bạn có n bức tranh, (n-1) bức trông giống nhau qua "chữ ký" — khoảng cách giữa các ký tự liên tiếp. Bức còn lại có chữ ký khác biệt. Dùng HashMap để nhóm theo chữ ký, tìm nhóm có đúng 1 phần tử.

```
words = ["adc","wzy","abc"]
Difference arrays:
  "adc" → [3,-1]   (d-a=3, c-d=-1)
  "wzy" → [3,-1]   (z-w=3, y-z=-1)
  "abc" → [1,1]    ← odd one out!

map: "[3,-1]" → ["adc","wzy"]
     "[1,1]"  → ["abc"]  ← size 1 → answer
```

---

## Problem Description

Given an array of strings `words` where each string has the same length, compute the **difference array** for each word (array of consecutive character code differences). Return the word whose difference array is unique among all words.

**Example 1:** `words=["adc","wzy","abc"]` → `"abc"`
**Example 2:** `words=["aaa","bob","pop","xyz"]` → `"bob"`

Constraints: `3 ≤ words.length ≤ 100`, all words same length `2 ≤ word.length ≤ 20`.

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Đảm bảo luôn có đúng 1 chuỗi lẻ?" / Guaranteed exactly one odd word out?
2. **Brute force / Vét cạn**: Compare each word's diff array to all others → O(n² \* L)
3. **Key insight / Ý tưởng**: Convert diff array to string key, group by key, find group of size 1
4. **Optimize / Tối ưu**: Single pass O(n\*L) with HashMap keyed on serialized diff array
5. **Edge cases / Trường hợp đặc biệt**: All same except one; words with same characters in different order
6. **Follow-up / Hỏi thêm**: "Nếu có k chuỗi lẻ?" / Same approach, find groups with count != majority count

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — compare each pair's difference arrays
 * Time: O(n² * L)
 * Space: O(L)
 */
function oddStringBrute(words: string[]): string {
  const getDiff = (w: string): number[] =>
    Array.from({ length: w.length - 1 }, (_, i) => w.charCodeAt(i + 1) - w.charCodeAt(i));

  for (let i = 0; i < words.length; i++) {
    const di = getDiff(words[i]);
    let isOdd = true;
    for (let j = 0; j < words.length; j++) {
      if (i === j) continue;
      const dj = getDiff(words[j]);
      if (di.join(",") === dj.join(",")) {
        isOdd = false;
        break;
      }
    }
    if (isOdd) return words[i];
  }
  return "";
}
console.log(oddStringBrute(["adc", "wzy", "abc"])); // "abc"

/**
 * Solution 2: HashMap grouping (Optimal)
 * Time: O(n * L) — one pass to build map, one to find size-1 group
 * Space: O(n * L)
 */
function oddString(words: string[]): string {
  const map = new Map<string, string[]>();

  for (const word of words) {
    const diff: number[] = [];
    for (let i = 1; i < word.length; i++) {
      diff.push(word.charCodeAt(i) - word.charCodeAt(i - 1));
    }
    const key = diff.join(",");
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(word);
  }

  for (const [, group] of map) {
    if (group.length === 1) return group[0];
  }
  return "";
}

console.log(oddString(["adc", "wzy", "abc"])); // "abc"
console.log(oddString(["aaa", "bob", "pop", "xyz"])); // "bob"
console.log(oddString(["abc", "xyz", "def"])); // "abc" or whichever is unique
```

---

## 🔗 Related Problems

| Problem                                                                  | Pattern          | Difficulty |
| ------------------------------------------------------------------------ | ---------------- | ---------- |
| [Find the Difference](https://leetcode.com/problems/find-the-difference) | Hash Map         | Easy       |
| [Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings)   | Hash Map         | Easy       |
| [Group Anagrams](https://leetcode.com/problems/group-anagrams)           | Hash Map         | Medium     |
| [Find the Odd Int](https://leetcode.com/problems/single-number)          | Bit Manipulation | Easy       |
