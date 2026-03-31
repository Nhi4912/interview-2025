---
layout: page
title: "Largest Merge Of Two Strings"
difficulty: Medium
category: String
tags: [Two Pointers, String, Greedy]
leetcode_url: "https://leetcode.com/problems/largest-merge-of-two-strings"
---

# Largest Merge Of Two Strings / Largest Merge Of Two Strings

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Partition Labels](https://leetcode.com/problems/partition-labels) | [Lexicographically Smallest Palindrome](https://leetcode.com/problems/lexicographically-smallest-palindrome)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như hai hàng người chờ ghép vào đội hình — mỗi lượt chọn người đứng đầu hàng nào có "tên" từ điển lớn hơn bước vào trước. Nhưng nếu hai đầu hàng bằng nhau, phải nhìn xa hơn để quyết định hàng nào nên đi trước.

**Visual — Greedy comparison of remaining suffixes:**

```
word1 = "cabaa"   word2 = "bcaaa"
i=0              j=0

Step 1: word1[0:]="cabaa" vs word2[0:]="bcaaa"
        'c' > 'b' → take from word1 → merge="c", i=1

Step 2: word1[1:]="abaa" vs word2[0:]="bcaaa"
        'a' < 'b' → take from word2 → merge="cb", j=1

Step 3: word1[1:]="abaa" vs word2[1:]="caaa"
        'a' < 'c' → take from word2 → merge="cbc", j=2

Step 4: word1[1:]="abaa" vs word2[2:]="aaa"
        "abaa" > "aaa" → take from word1 → merge="cbca", i=2
...
Final: "cbcabaaaaa"

Critical: when s[i]==s[j], compare full remaining strings!
"ab" vs "a" → "ab">"a" (tie-breaking by looking deeper)
```

---

## Problem Description

Given two strings `word1` and `word2`, build a **merge** string by repeatedly taking the first character of whichever remaining string is **lexicographically larger**. If equal, take from either. Return the largest possible merge.

**Example 1:** `word1 = "cabaa"`, `word2 = "bcaaa"` → `"cbcabaaaaa"`
**Example 2:** `word1 = "abcabc"`, `word2 = "abdcaba"` → `"abdcabcabcaba"`

Constraints: `1 <= word1.length, word2.length <= 3000`.

---

## 📝 Interview Tips

1. **Greedy proof**: "Luôn lấy đầu của chuỗi lớn hơn — chứng minh bằng phản chứng: lấy chuỗi nhỏ hơn không bao giờ tốt hơn" / Always take from larger string — proved by contradiction
2. **Tie-breaking**: "Khi s[i]==s[j], phải so sánh toàn bộ phần còn lại — không phải chỉ một ký tự" / When chars are equal, compare full remaining suffixes, not just current char
3. **Complexity**: "O(n²) do so sánh chuỗi — chấp nhận với n≤3000; dùng suffix array để O(n log n)" / O(n²) due to string comparison; acceptable for n≤3000
4. **Corner cases**: "Một chuỗi hết trước — ghép phần còn lại của chuỗi kia" / When one string exhausted, append remainder of other
5. **Wrong approach**: "KHÔNG so sánh chỉ word1[i] với word2[j] khi bằng nhau — cần so full suffix" / DON'T just compare single chars when equal; must compare full suffixes
6. **Follow-up**: "Dùng suffix array hoặc Z-function để tie-break O(1)" / Use suffix array for O(1) tie-breaking → O(n log n) total

---

## Solutions

```typescript
/**
 * Solution 1: Greedy with direct string comparison (O(n²) but clean)
 * At each step, compare remaining suffixes of word1 and word2.
 * Take the first character from whichever suffix is larger.
 * Time: O(n²) — each comparison is O(n), done O(n) times
 * Space: O(n) — result array
 */
function largestMerge(word1: string, word2: string): string {
  let i = 0, j = 0;
  const result: string[] = [];

  while (i < word1.length || j < word2.length) {
    // Take from word1 if its remaining suffix >= word2's remaining suffix
    if (i < word1.length && (j >= word2.length || word1.slice(i) >= word2.slice(j))) {
      result.push(word1[i++]);
    } else {
      result.push(word2[j++]);
    }
  }

  return result.join('');
}

/**
 * Solution 2: Greedy with manual character-by-character suffix comparison
 * Avoids JS substring allocations by comparing in-place.
 * Time: O(n²) worst case — same complexity but fewer allocations
 * Space: O(n) — result array
 */
function largestMergeOpt(word1: string, word2: string): string {
  const compareSuffixes = (w1: string, i: number, w2: string, j: number): number => {
    // Returns positive if w1[i:] > w2[j:], negative if less, 0 if equal
    while (i < w1.length && j < w2.length) {
      if (w1[i] > w2[j]) return 1;
      if (w1[i] < w2[j]) return -1;
      i++; j++;
    }
    return (w1.length - i) - (w2.length - j);
  };

  let i = 0, j = 0;
  const result: string[] = [];

  while (i < word1.length || j < word2.length) {
    if (i < word1.length && (j >= word2.length || compareSuffixes(word1, i, word2, j) >= 0)) {
      result.push(word1[i++]);
    } else {
      result.push(word2[j++]);
    }
  }

  return result.join('');
}

// === Test Cases ===
console.log(largestMerge('cabaa', 'bcaaa'));       // "cbcabaaaaa"
console.log(largestMerge('abcabc', 'abdcaba'));    // "abdcabcabcaba"
console.log(largestMerge('a', 'b'));               // "ba"
console.log(largestMerge('abc', 'abc'));            // "aabbcc" (equal strings, interleave)
console.log(largestMerge('z', ''));                // "z"
```

---

## 🔗 Related Problems

| Problem | Pattern | Difficulty |
|---------|---------|-----------|
| [Partition Labels](https://leetcode.com/problems/partition-labels) | Greedy | Medium |
| [Lexicographically Smallest Palindrome](https://leetcode.com/problems/lexicographically-smallest-palindrome) | Greedy | Easy |
| [Smallest String With Swaps](https://leetcode.com/problems/smallest-string-with-swaps) | Union Find | Medium |
| [Maximum Number of Non-overlapping Palindrome Substrings](https://leetcode.com/problems/maximum-number-of-non-overlapping-palindrome-substrings) | Greedy | Hard |
