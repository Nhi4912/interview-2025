---
layout: page
title: "Expressive Words"
difficulty: Medium
category: String
tags: [Array, Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/expressive-words"
---

# Expressive Words / Từ Ngữ Điệu

🟡 Medium | 🏷️ Array, Two Pointers, String

## 🧠 Intuition

**VI:** Một từ gốc có thể "kéo dài" thành `s` bằng cách lặp ký tự. Quy tắc: nếu `s` có đoạn `k` ký tự giống nhau liên tiếp thì đoạn tương ứng trong `word` phải có `j` ký tự sao cho `j == k` (không kéo) hoặc `k >= 3` (đoạn trong `s` đủ dài để kéo). Dùng **run-length encoding** để so sánh.

**EN:** Convert both strings to run-length encoding (char, count). A run in `word` can "stretch" to a run in `s` if `s`'s count `>= 3` and `word`'s count `<= s`'s count; otherwise counts must match exactly.

```
s    = "heeellooo"  →  [h,1][e,3][l,2][o,3]
word = "hello"      →  [h,1][e,2][l,2][o,1]
       h:1==1 ✅  e:2≤3,3≥3 ✅  l:2==2 ✅  o:1≤3,3≥3 ✅  → STRETCHY!

word = "helo"       →  [h,1][e,1][l,1][o,1]
       e:1≤3,3≥3 ✅  l:1≤2,but 2<3 ❌  → NOT stretchy
```

## 📝 Interview Tips

- 🇻🇳 **Run-length encoding:** nhóm các ký tự liên tiếp giống nhau thành `(char, count)` pairs
- 🇬🇧 **RLE first:** convert both s and word to RLE, then compare run by run
- 🇻🇳 **Điều kiện kéo dài:** đoạn trong `s` phải `>= 3` VÀ đoạn trong `word` phải `<= s`
- 🇬🇧 **Stretch rule:** `sCount >= 3 && wordCount <= sCount`, OR exact match `sCount == wordCount`
- 🇻🇳 **Fail fast:** số đoạn RLE khác nhau → ngay lập tức sai
- 🇬🇧 **Same char check:** chars at each run must match, else immediately false

## Solutions

### Solution 1: Run-length encoding comparison

```typescript
/**
 * Build RLE for s once, then check each word against it.
 * Time: O(n + m * L) where n=|s|, m=|words|, L=avg word length
 * Space: O(n) for s's RLE
 */
function expressiveWords(s: string, words: string[]): number {
  function getRLE(str: string): [string, number][] {
    const rle: [string, number][] = [];
    let i = 0;
    while (i < str.length) {
      let j = i;
      while (j < str.length && str[j] === str[i]) j++;
      rle.push([str[i], j - i]);
      i = j;
    }
    return rle;
  }

  function isStretchy(word: string): boolean {
    const sRLE = getRLE(s);
    const wRLE = getRLE(word);
    if (sRLE.length !== wRLE.length) return false;
    for (let i = 0; i < sRLE.length; i++) {
      const [sc, sk] = sRLE[i];
      const [wc, wk] = wRLE[i];
      if (sc !== wc) return false;
      if (sk === wk) continue; // exact match: OK
      if (sk >= 3 && wk <= sk) continue; // stretchy: OK
      return false;
    }
    return true;
  }

  return words.filter(isStretchy).length;
}

console.log(expressiveWords("heeellooo", ["hello", "hi", "helo"])); // 1
console.log(expressiveWords("zzzzzyyyyy", ["zzyy", "zy", "zyy"])); // 3
```

### Solution 2: Two-pointer without RLE array

```typescript
/**
 * Direct two-pointer on raw strings.
 * Time: O(n + m * L) | Space: O(1) extra per word
 */
function expressiveWords2(s: string, words: string[]): number {
  function isStretchy(word: string): boolean {
    let i = 0,
      j = 0;
    while (i < s.length && j < word.length) {
      if (s[i] !== word[j]) return false;
      let si = i,
        wj = j;
      while (i < s.length && s[i] === s[si]) i++;
      while (j < word.length && word[j] === word[wj]) j++;
      const sk = i - si,
        wk = j - wj;
      if (sk !== wk && (sk < 3 || wk > sk)) return false;
    }
    return i === s.length && j === word.length;
  }

  return words.filter(isStretchy).length;
}

console.log(expressiveWords2("heeellooo", ["hello", "hi", "helo"])); // 1
console.log(expressiveWords2("aaa", ["aaaa"])); // 0
console.log(expressiveWords2("aaa", ["a", "aa", "aaa"])); // 3
```

## 🔗 Related Problems

| #    | Problem                                 | Difficulty | Key Idea                    |
| ---- | --------------------------------------- | ---------- | --------------------------- |
| 443  | String Compression                      | 🟡 Medium  | Run-length encoding         |
| 1163 | Last Substring in Lexicographical Order | 🔴 Hard    | Two-pointer on strings      |
| 844  | Backspace String Compare                | 🟢 Easy    | Two-pointer string matching |
