---
layout: page
title: "Isomorphic Strings"
difficulty: Easy
category: String
tags: [Hash Table, String]
leetcode_url: "https://leetcode.com/problems/isomorphic-strings"
---

# Isomorphic Strings / Chuỗi Đẳng Cấu

> **Track**: String | **Difficulty**: 🟢 Easy | **Pattern**: Bidirectional Hash Map
> **Frequency**: 📗 Tier 2 — Gặp ở 20+ companies (Amazon, Google, Facebook)
> **See also**: [Word Pattern](https://leetcode.com/problems/word-pattern) | [Find and Replace Pattern](https://leetcode.com/problems/find-and-replace-pattern)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hai chuỗi isomorphic giống như mã hoá Caesar — mỗi ký tự trong `s` ánh xạ 1-1 với một ký tự trong `t`. Cần kiểm tra **hai chiều**: `s[i]→t[i]` và `t[i]→s[i]` — nếu chỉ kiểm tra một chiều, "aa"↔"ab" sẽ bị nhận sai là isomorphic.

**Pattern Recognition:**

- Signal: "consistent character mapping", "one-to-one relationship" → **Bidirectional HashMap**
- Two maps: `sToT` (s char → t char) and `tToS` (t char → s char)
- Alternative: transform both strings to position-first-seen pattern and compare

**Visual — s="paper", t="title":**

```
i=0: s[0]='p', t[0]='t'  → sToT[p]=t, tToS[t]=p ✅
i=1: s[1]='a', t[1]='i'  → sToT[a]=i, tToS[i]=a ✅
i=2: s[2]='p', t[2]='t'  → sToT[p]=t ✅, tToS[t]=p ✅ (consistent)
i=3: s[3]='e', t[3]='l'  → sToT[e]=l, tToS[l]=e ✅
i=4: s[4]='r', t[4]='e'  → sToT[r]=e, tToS[e]=r ✅
→ true ✅

s="foo", t="bar":
i=0: sToT[f]=b, tToS[b]=f ✅
i=1: sToT[o]=a, tToS[a]=o ✅
i=2: s[2]='o', sToT[o]=a ✅ but t[2]='r' ≠ 'a' → false ❌
```

---

## Problem Description

Given two strings `s` and `t`, determine if they are isomorphic. Two strings are isomorphic if the characters in `s` can be replaced to get `t` — all occurrences of a character must be replaced with another character while preserving order. No two characters may map to the same character, but a character may map to itself.

```
Example 1: s="egg", t="add"   → true  (e→a, g→d)
Example 2: s="foo", t="bar"   → false (o maps to both a and r)
Example 3: s="paper", t="title" → true
Example 4: s="badc", t="baba" → false (a and c both map to a)
```

Constraints: `1 <= s.length <= 5×10^4`, `s.length == t.length`, lowercase letters or digits

---

## 📝 Interview Tips

1. **Clarify**: "Cả chữ hoa/thường? Digits?" / Usually lowercase — confirm character set.
2. **One map is not enough**: `s="ab", t="aa"` — one map thinks ok, but 'a' and 'b' both map to 'a'.
3. **Two maps**: Check both `s[i]→t[i]` and `t[i]→s[i]` for consistency in same loop.
4. **Pattern encoding**: Transform both to index-of-first-occurrence strings → compare strings.
5. **Array vs Map**: For lowercase letters, use `int[128]` arrays instead of Map for speed.
6. **Word Pattern (LC 290)**: Same idea but split string into words first.

---

## Solutions

```typescript
/**
 * Solution 1: Two HashMaps (bidirectional)
 * Time: O(n) — single pass through both strings
 * Space: O(k) — k = unique characters in alphabet (bounded by 26 or 128)
 */
function isIsomorphic1(s: string, t: string): boolean {
  const sToT = new Map<string, string>();
  const tToS = new Map<string, string>();

  for (let i = 0; i < s.length; i++) {
    const sc = s[i],
      tc = t[i];
    // Check s → t mapping
    if (sToT.has(sc) && sToT.get(sc) !== tc) return false;
    // Check t → s mapping (prevents two s-chars mapping to same t-char)
    if (tToS.has(tc) && tToS.get(tc) !== sc) return false;
    sToT.set(sc, tc);
    tToS.set(tc, sc);
  }
  return true;
}

/**
 * Solution 2: Transform to Pattern String
 * Time: O(n)
 * Space: O(n) — pattern strings
 *
 * Replace each char with the index of its first occurrence.
 * If both s and t produce the same pattern → isomorphic.
 * e.g. "egg" → "011", "add" → "011" → equal → true
 *      "foo" → "011", "bar" → "012" → not equal → false
 */
function isIsomorphic2(s: string, t: string): boolean {
  function encode(str: string): string {
    const map = new Map<string, number>();
    return str
      .split("")
      .map((c) => {
        if (!map.has(c)) map.set(c, map.size);
        return map.get(c);
      })
      .join(",");
  }
  return encode(s) === encode(t);
}

/**
 * Solution 3: Single pass with index arrays (fastest)
 * Time: O(n)
 * Space: O(1) — fixed-size arrays for ASCII (128 chars)
 *
 * Store last-seen index+1 for each char in s and t.
 * At position i, if last-seen indices differ → not isomorphic.
 * Using index+1 (not index) so 0 means "not seen yet".
 */
function isIsomorphic(s: string, t: string): boolean {
  const sMap = new Array(128).fill(0); // char code → last position + 1
  const tMap = new Array(128).fill(0);

  for (let i = 0; i < s.length; i++) {
    const sc = s.charCodeAt(i),
      tc = t.charCodeAt(i);
    if (sMap[sc] !== tMap[tc]) return false;
    sMap[sc] = i + 1;
    tMap[tc] = i + 1;
  }
  return true;
}

// === Test Cases ===
console.log(isIsomorphic("egg", "add")); // true
console.log(isIsomorphic("foo", "bar")); // false
console.log(isIsomorphic("paper", "title")); // true
console.log(isIsomorphic("badc", "baba")); // false
console.log(isIsomorphic("ab", "aa")); // false
console.log(isIsomorphic("a", "a")); // true
console.log(isIsomorphic1("egg", "add")); // true
console.log(isIsomorphic2("paper", "title")); // true
```

---

## 🔗 Related Problems

| Problem                                                                                  | Relationship                             |
| ---------------------------------------------------------------------------------------- | ---------------------------------------- |
| [205. Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings/)             | This problem                             |
| [290. Word Pattern](https://leetcode.com/problems/word-pattern/)                         | Same bijection check, but words vs chars |
| [291. Word Pattern II](https://leetcode.com/problems/word-pattern-ii/)                   | Backtracking variant without spaces      |
| [890. Find and Replace Pattern](https://leetcode.com/problems/find-and-replace-pattern/) | Apply isomorphism check across word list |
| [242. Valid Anagram](https://leetcode.com/problems/valid-anagram/)                       | Related string character mapping         |
