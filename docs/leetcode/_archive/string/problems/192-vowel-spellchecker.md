---
layout: page
title: "Vowel Spellchecker"
difficulty: Medium
category: String
tags: [Array, Hash Table, String]
leetcode_url: "https://leetcode.com/problems/vowel-spellchecker"
---

# Vowel Spellchecker / Kiểm Tra Chính Tả Nguyên Âm

🟡 Medium | Array, Hash Table, String

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Như một từ điển thông minh với 3 cấp ưu tiên: (1) khớp hoàn hảo, (2) khớp không phân biệt hoa/thường, (3) khớp khi thay nguyên âm. Dùng HashMap cho mỗi cấp.

```
wordlist = ["KiTe","KiTe","KiTe","Hare","Hare"]

Exact set:    {KiTe, Hare}
Lower map:    {kite→KiTe, hare→Hare}
Vowel map:    {k_t_→KiTe, h_r_→Hare}  (_ = any vowel)

Query "kite" → lower("kite")="kite" found → "KiTe"
Query "KiTe" → exact match "KiTe" → "KiTe"
Query "KaIE" → not exact, lower="kaie" not found
             → vowel("kaie") = "k__e" matches "k_t_"? No
             → vowel("KaIE") = "k__e" → check vowel map
```

## Problem Description

Given a `wordlist` and `queries`, for each query return: (1) the word itself if it exists exactly, (2) the first dictionary word that matches case-insensitively, (3) the first word matching after replacing all vowels, or (4) `""` if nothing matches.

- **Example 1:** `wordlist=["KiTe","KiTe"]`, `queries=["kite","Kite","KiTe","Hare","hare","Hare","harez"]` → `["KiTe","KiTe","KiTe","Hare","Hare","Hare",""]`
- **Example 2:** `wordlist=["yellow"]`, `queries=["YellOw"]` → `["yellow"]`

## 📝 Interview Tips

- **🇻🇳 Ba cấp ưu tiên** — exact > case-insensitive > vowel-insensitive / Three priority levels
- **🇻🇳 Xây HashMap trước** — O(n) build, O(1) query mỗi từ / Pre-build HashMaps for O(1) query
- **🇻🇳 Vowel key** — thay a,e,i,o,u bằng '_' để chuẩn hóa / Replace vowels with '_' to normalize
- **🇻🇳 Thứ tự wordlist** — first occurrence wins (Map preserves insertion order) / First occurrence wins
- **🇻🇳 Exact Set** tách biệt với lower/vowel Maps / Keep exact match as a Set
- **🇻🇳 Vowels** = a, e, i, o, u (lowercase) — nhớ cả hoa khi chuẩn hóa / Lowercase vowels for normalization

## Solutions

### Solution 1: Three-Level HashMap (Optimal)

```typescript
/**
 * Build exact set, lowercase map, and vowel-pattern map
 * Time: O(n + q) where n=wordlist.length, q=queries.length
 * Space: O(n)
 */
function spellchecker(wordlist: string[], queries: string[]): string[] {
  const vowels = new Set(["a", "e", "i", "o", "u"]);

  const toVowelKey = (word: string): string => word.toLowerCase().replace(/[aeiou]/g, "*");

  // Build lookup structures
  const exactSet = new Set(wordlist);
  const lowerMap = new Map<string, string>(); // lowercase → first word
  const vowelMap = new Map<string, string>(); // vowel-key → first word

  // Process in reverse so first occurrence wins in forward iteration
  for (const word of wordlist) {
    const lower = word.toLowerCase();
    const vKey = toVowelKey(word);

    // Use set to ensure first occurrence wins (overwrite = last wins, so iterate forward = last stored)
    // We want first occurrence → only set if not already present
    if (!lowerMap.has(lower)) lowerMap.set(lower, word);
    if (!vowelMap.has(vKey)) vowelMap.set(vKey, word);
  }

  return queries.map((query) => {
    // Level 1: exact match
    if (exactSet.has(query)) return query;

    // Level 2: case-insensitive match
    const lowerQuery = query.toLowerCase();
    if (lowerMap.has(lowerQuery)) return lowerMap.get(lowerQuery)!;

    // Level 3: vowel-insensitive match
    const vKey = toVowelKey(query);
    if (vowelMap.has(vKey)) return vowelMap.get(vKey)!;

    // No match
    return "";
  });
}

// Test cases
console.log(
  spellchecker(
    ["KiTe", "KiTe", "KiTe", "Hare", "Hare"],
    ["kite", "Kite", "KiTe", "Hare", "hare", "Hare", "harez"],
  ),
);
// ["KiTe","KiTe","KiTe","Hare","Hare","Hare",""]

console.log(spellchecker(["yellow"], ["YellOw"])); // ["yellow"]
```

### Solution 2: Functional Single-Pass Query

```typescript
/**
 * Same approach, more functional style
 * Time: O(n + q)  Space: O(n)
 */
function spellcheckerV2(wordlist: string[], queries: string[]): string[] {
  const normalize = (w: string) => w.toLowerCase().replace(/[aeiou]/g, "#");

  const exact = new Set(wordlist);
  const caseMap: Record<string, string> = {};
  const vowelMap: Record<string, string> = {};

  for (const w of wordlist) {
    const lk = w.toLowerCase();
    const vk = normalize(w);
    if (!caseMap[lk]) caseMap[lk] = w;
    if (!vowelMap[vk]) vowelMap[vk] = w;
  }

  return queries.map((q) => {
    if (exact.has(q)) return q;
    if (caseMap[q.toLowerCase()]) return caseMap[q.toLowerCase()];
    if (vowelMap[normalize(q)]) return vowelMap[normalize(q)];
    return "";
  });
}

// Test cases
console.log(spellcheckerV2(["ae", "aa"], ["UU"])); // ["ae"] vowel key "*" matches
```

### Solution 3: Explicit Priority Chain with Helper

```typescript
/**
 * Explicit priority with named helper functions
 * Time: O(n + q)  Space: O(n)
 */
function spellcheckerV3(wordlist: string[], queries: string[]): string[] {
  const isVowel = (c: string) => "aeiouAEIOU".includes(c);
  const toKey = (w: string) =>
    w
      .split("")
      .map((c) => (isVowel(c) ? "." : c.toLowerCase()))
      .join("");

  const exactSet = new Set(wordlist);
  const lc = new Map<string, string>();
  const vk = new Map<string, string>();

  for (const w of wordlist) {
    const lKey = w.toLowerCase();
    const vKey = toKey(w);
    if (!lc.has(lKey)) lc.set(lKey, w);
    if (!vk.has(vKey)) vk.set(vKey, w);
  }

  return queries.map((q) => {
    if (exactSet.has(q)) return q;
    return lc.get(q.toLowerCase()) ?? vk.get(toKey(q)) ?? "";
  });
}

// Test cases
console.log(spellcheckerV3(["KiTe", "KiTe"], ["kite"])); // ["KiTe"]
console.log(spellcheckerV3(["yellow"], ["YellOw"])); // ["yellow"]
```

## 🔗 Related Problems

| Problem                                                                             | Difficulty | Similarity                     |
| ----------------------------------------------------------------------------------- | ---------- | ------------------------------ |
| [Unique Word Abbreviation](https://leetcode.com/problems/unique-word-abbreviation/) | 🟡 Medium  | Word pattern matching          |
| [Word Pattern](https://leetcode.com/problems/word-pattern/)                         | 🟢 Easy    | HashMap mapping                |
| [Find and Replace Pattern](https://leetcode.com/problems/find-and-replace-pattern/) | 🟡 Medium  | Pattern normalization          |
| [Group Anagrams](https://leetcode.com/problems/group-anagrams/)                     | 🟡 Medium  | Key normalization for grouping |
