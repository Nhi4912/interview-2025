---
layout: page
title: "Word Abbreviation"
difficulty: Hard
category: Sorting-Searching
tags: [Array, String, Greedy, Trie, Sorting]
leetcode_url: "https://leetcode.com/problems/word-abbreviation"
---

# Word Abbreviation / Viết Tắt Từ

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Greedy + Group by Prefix
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống đặt tên viết tắt cho nhân viên — nếu chỉ có một "John", viết tắt "J...n" là đủ. Nhưng nếu có "John" và "Joan", cần phân biệt bằng prefix dài hơn: "Jo...n" vs "Jo...n" → vẫn trùng → "Joh...n" vs "Joa...n". Cứ tăng prefix cho đến khi các chữ trong cùng nhóm tương tự không còn viết tắt giống nhau.

**Pattern Recognition:**

- Group words sharing same (first char + last char + length) → conflicts arise within groups
- For conflicting abbreviations, increase prefix length until unique
- Greedy: start with prefix=1, repeatedly extend for conflicting words

**Visual:**

```
words = ["like","god","internal","me","internet","interval","intension","face","intrusion"]

Group by (len, first, last):
  "internal","internet","interval","intension","intrusion" → all length 8, i..l/t/n

  Round 1: prefix=1 → "i6l","i6t","i6l","i6n","i6n" → conflicts!
  Round 2: prefix=2 → "in5l","in5t","in5l","in5n","in5n" → still conflicts
  Round 3: prefix=3 → "int4l","int4t","int4l","int4n","int4n" → conflicts
  ...keep going until all unique or word itself is shorter than abbrev
```

## Problem Description

Given `words[]`, for each word find its minimal abbreviation: `first_p_chars + (len - p - 1) + last_char`. If the abbreviation is not shorter than the word, keep the original. All abbreviations must be **unique** across the list; words sharing the same abbreviation must use longer prefixes. `1 ≤ words.length ≤ 400`, `2 ≤ words[i].length ≤ 400`.

**Example 1:** `["like","god","internal","me","internet","interval","intension","face","intrusion"]` → `["l2e","god","internal","me","i6t","interval","i6n","f2e","intr4n"]`
**Example 2:** `["aa","aaa"]` → `["aa","aaa"]`

## 📝 Interview Tips

1. **Clarify**: Abbreviation phải ngắn hơn từ gốc không? Nếu không ngắn hơn thì giữ nguyên / Keep original if abbrev is not shorter
2. **Approach**: Nhóm theo (first_char + last_char + length), tăng prefix cho nhóm có xung đột / Group and extend prefix length for conflicts
3. **Edge cases**: Từ có độ dài ≤ 3 không thể viết tắt có nghĩa; từ duy nhất trong nhóm / Short words; singleton groups
4. **Optimize**: Sort mỗi nhóm theo ký tự, dùng LCP để tính prefix cần thiết trong O(n·L²) / Use sorting for efficient conflict detection
5. **Test**: `["aa","aaa"]` → cả hai giữ nguyên vì không thể viết tắt / Verify non-abbreviable words
6. **Follow-up**: Có thể dùng Trie thay vì grouping? / Can you solve with a Trie instead of grouping?

## Solutions

```typescript
/** Helper: generate abbreviation with given prefix length */
function makeAbbr(word: string, p: number): string {
  const abbr = word[0].repeat(0) + word.slice(0, p) + (word.length - p - 1) + word[word.length - 1];
  // Keep original if not shorter
  return abbr.length >= word.length ? word : abbr;
}

/** Solution 1: Greedy Group + Extend Prefix
 * Time: O(n · L²) | Space: O(n · L)
 */
function wordsAbbreviation(words: string[]): string[] {
  const n = words.length;
  const prefix = new Array(n).fill(1);
  const result = words.map((w, i) => makeAbbr(w, prefix[i]));

  // Keep resolving conflicts
  let changed = true;
  while (changed) {
    changed = false;
    const abbrCount = new Map<string, number[]>(); // abbr → [indices]
    for (let i = 0; i < n; i++) {
      const a = result[i];
      if (!abbrCount.has(a)) abbrCount.set(a, []);
      abbrCount.get(a)!.push(i);
    }
    for (const [, indices] of abbrCount) {
      if (indices.length > 1) {
        // All words with same abbreviation need longer prefix
        for (const i of indices) {
          prefix[i]++;
          result[i] = makeAbbr(words[i], prefix[i]);
        }
        changed = true;
      }
    }
  }
  return result;
}

/** Solution 2: Sort within groups for efficient conflict detection
 * Time: O(n · L log n) | Space: O(n · L)
 */
function wordsAbbreviation2(words: string[]): string[] {
  const n = words.length;
  const result = new Array<string>(n);

  // Group indices by (length, first, last)
  const groups = new Map<string, number[]>();
  for (let i = 0; i < n; i++) {
    const w = words[i];
    const key = `${w.length}_${w[0]}_${w[w.length - 1]}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(i);
  }

  for (const indices of groups.values()) {
    if (indices.length === 1) {
      const i = indices[0];
      result[i] = makeAbbr(words[i], 1);
      continue;
    }
    // Sort group by full word, then compute LCP between consecutive pairs
    indices.sort((a, b) => words[a].localeCompare(words[b]));
    const prefix = new Array(indices.length).fill(1);
    for (let j = 0; j < indices.length - 1; j++) {
      const wa = words[indices[j]],
        wb = words[indices[j + 1]];
      let p = 1;
      while (p < wa.length && p < wb.length && wa[p] === wb[p]) p++;
      prefix[j] = Math.max(prefix[j], p);
      prefix[j + 1] = Math.max(prefix[j + 1], p);
    }
    for (let j = 0; j < indices.length; j++) {
      result[indices[j]] = makeAbbr(words[indices[j]], prefix[j]);
    }
  }
  return result;
}

// Test cases
console.log(
  wordsAbbreviation([
    "like",
    "god",
    "internal",
    "me",
    "internet",
    "interval",
    "intension",
    "face",
    "intrusion",
  ]),
);
// ["l2e","god","internal","me","i6t","interval","i6n","f2e","intr4n"]
console.log(wordsAbbreviation2(["aa", "aaa"])); // ["aa","aaa"]
console.log(wordsAbbreviation(["abcdefg", "abccefg"])); // ["abcd2g","abcc2g"] or similar unique abbrevs
```

## 🔗 Related Problems

| Problem                                                                              | Relationship                                |
| ------------------------------------------------------------------------------------ | ------------------------------------------- |
| [Unique Word Abbreviation](https://leetcode.com/problems/unique-word-abbreviation)   | Basic abbreviation uniqueness check         |
| [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) | Prefix grouping with sorted results         |
| [Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix)         | LCP computation used in conflict resolution |
