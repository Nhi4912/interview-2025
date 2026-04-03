---
layout: page
title: "Find and Replace Pattern"
difficulty: Medium
category: String
tags: [Array, Hash Table, String]
leetcode_url: "https://leetcode.com/problems/find-and-replace-pattern"
---

# Find and Replace Pattern / Tìm Từ Theo Mẫu Bijective

> **Track**: String | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map / Isomorphism
> **Frequency**: Medium — bài kinh điển về ánh xạ bijective (một-một)
> **See also**: [Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings) | [Word Pattern](https://leetcode.com/problems/word-pattern)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang học ngôn ngữ bí mật của nhóm bạn — mỗi chữ cái trong từ khóa (pattern) tương ứng với đúng một chữ cái trong từ thật, và mỗi chữ thật chỉ được dùng cho đúng một chữ khóa (bijection). Bài này giống như giải mã bản đồ chữ cái: "mgg" khớp với "bee" vì m→b, g→e (ánh xạ nhất quán), nhưng "aqq" không khớp với "bee" vì a→b, q→e nhưng q cũng cần → e — không vi phạm, "aqq" = "bee" OK. Cách kiểm tra nhanh nhất: **chuẩn hóa** cả hai thành cùng dạng số thứ tự.

**Pattern Recognition:**

- Signal: "words matching a pattern bijectively" → **Isomorphism via canonical form or two maps**
- Bài này thuộc dạng kiểm tra đẳng cấu chuỗi — mỗi ký tự pattern map sang đúng 1 ký tự word và ngược lại
- Key insight: chuẩn hóa cả word lẫn pattern về dạng "0,1,1,2" bằng cách đánh số thứ tự xuất hiện

**Visual — pattern = "abb", words = ["mno","mee","aqq"] example:**

```
normalize("abb") → a→0, b→1 → "0,1,1"

"mno": m→0, n→1, o→2 → "0,1,2"  ≠ "0,1,1" ✗
"mee": m→0, e→1      → "0,1,1"  = "0,1,1" ✓
"aqq": a→0, q→1      → "0,1,1"  = "0,1,1" ✓

Answer: ["mee", "aqq"]

Bijection check (two-map approach for "mee" vs "abb"):
  i=0: m→a (w2p[m]=a), a→m (p2w[a]=m) ✓
  i=1: e→b, b→e ✓
  i=2: e→b, b→e (already mapped, consistent) ✓
```

---

## Problem Description

Given a list of `words` and a `pattern`, return all words that match the pattern. A word matches the pattern if there is a **bijection** (one-to-one, onto) between letters of the word and letters of the pattern. ([LeetCode](https://leetcode.com/problems/find-and-replace-pattern))

```
Example 1: words = ["aa","bb","cc"], pattern = "xx" → ["aa","bb","cc"]
Example 2: words = ["abc","deq","mee","aqq","dkd","ccc"], pattern = "abb"
           → ["mee","aqq"]
```

Constraints: `1 <= words.length <= 50`, `1 <= words[i].length == pattern.length <= 20`, all lowercase.

---

## 📝 Interview Tips

1. **"Canonical form: map each char to its first-occurrence index"** — _Chuẩn hóa "abb"→"0,1,1" và "mee"→"0,1,1", so sánh string equality — đơn giản nhất._
2. **"Two maps needed: word→pattern AND pattern→word"** — _Một map không đủ: "ab"→"aa" sẽ fail nếu chỉ check word→pat vì a→a và b→a vi phạm injective từ word._
3. **"Length must match first"** — _Nếu word.length ≠ pattern.length → không thể match — tiết kiệm thời gian._
4. **"Bijection ≠ just one direction"** — _"ab" vs "cc": a→c và b→c — không phải bijection vì c bị map tới cả a lẫn b._
5. **"Normalize approach is cleaner and generalizable"** — _Normalize work tốt cho bài Isomorphic Strings (205) và Word Pattern (290) cùng pattern._
6. **"Follow-up: stream of words, keep a compiled pattern"** — _Precompute normalized pattern một lần, rồi so sánh với từng word — O(L) mỗi word._

---

## Solutions

```typescript
/** Solution 1: Canonical form normalization  @complexity Time: O(N×L) | Space: O(L) */
function findAndReplacePattern(words: string[], pattern: string): string[] {
  const normalize = (s: string): string => {
    const map = new Map<string, number>();
    let idx = 0;
    return s
      .split("")
      .map((c) => {
        if (!map.has(c)) map.set(c, idx++);
        return map.get(c)!;
      })
      .join(",");
  };

  const pNorm = normalize(pattern);
  return words.filter((w) => normalize(w) === pNorm);
}

/** Solution 2: Two bidirectional maps (bijection check)  @complexity Time: O(N×L) | Space: O(L) */
function findAndReplacePattern2(words: string[], pattern: string): string[] {
  const matches = (word: string, pat: string): boolean => {
    if (word.length !== pat.length) return false;
    const w2p = new Map<string, string>(); // word char → pattern char
    const p2w = new Map<string, string>(); // pattern char → word char
    for (let i = 0; i < word.length; i++) {
      const wc = word[i],
        pc = pat[i];
      if (w2p.has(wc) && w2p.get(wc) !== pc) return false;
      if (p2w.has(pc) && p2w.get(pc) !== wc) return false;
      w2p.set(wc, pc);
      p2w.set(pc, wc);
    }
    return true;
  };

  return words.filter((w) => matches(w, pattern));
}

// === Test Cases ===
console.log(findAndReplacePattern(["aa", "bb", "cc"], "xx"));
// ["aa","bb","cc"]
console.log(findAndReplacePattern(["abc", "deq", "mee", "aqq", "dkd", "ccc"], "abb"));
// ["mee","aqq"]
console.log(findAndReplacePattern2(["abc", "deq", "mee", "aqq", "dkd", "ccc"], "abb"));
// ["mee","aqq"]
console.log(findAndReplacePattern(["a", "b", "c"], "a"));
// ["a","b","c"]
console.log(findAndReplacePattern(["aab", "aba", "baa"], "aab"));
// ["aab"]
```

---

## 🔗 Related Problems

| #   | Problem            | Difficulty | Pattern      |
| --- | ------------------ | ---------- | ------------ |
| 205 | Isomorphic Strings | Easy       | Hash Map     |
| 290 | Word Pattern       | Easy       | Hash Map     |
| 291 | Word Pattern II    | Medium     | Backtracking |
| 49  | Group Anagrams     | Medium     | Hash Map     |
