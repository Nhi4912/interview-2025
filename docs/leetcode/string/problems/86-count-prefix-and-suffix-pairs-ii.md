---
layout: page
title: "Count Prefix and Suffix Pairs II"
difficulty: Hard
category: String
tags: [Array, String, Trie, Rolling Hash, String Matching]
leetcode_url: "https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii"
---

# Count Prefix and Suffix Pairs II / Đếm Cặp Tiền Tố Và Hậu Tố II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Trie on Zipped Pairs
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Count Prefix and Suffix Pairs I](https://leetcode.com/problems/count-prefix-and-suffix-pairs-i) | [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống kiểm tra từ có thể đứng đầu và đuôi của từ khác — ví dụ "ab" là prefix và suffix của "abab". Để xét đồng thời prefix và suffix, ta zip cặp (s[0],s[-1]), (s[1],s[-2]),... thành ký tự kép và xây Trie từ đó.

**Pattern Recognition:**

- Signal: "is word[i] both prefix AND suffix of word[j]?" → **Trie on character pairs**
- Key insight: word `w` is prefix+suffix of `s` iff the pair-sequence `zip(w, reverse(w))` is a prefix of `zip(s, reverse(s))`

**Visual — Pair-Trie:**

```
words = ["a","aba","ababa","aa"]

For "ababa": zip with reverse("ababa")="ababa"
  pairs: (a,a),(b,b),(a,a),(b,b),(a,a)

For "aba" as prefix+suffix check against "ababa":
  zip "aba" with reverse("aba")="aba" → pairs: (a,a),(b,b),(a,a)
  These pairs are a prefix of "ababa" pairs → YES ✅

Build trie as we process each word j from left to right.
For each j, count how many previous words form a valid prefix+suffix in O(|words[j]|).
```

---

## Problem Description

Given a 0-indexed string array `words`, count all pairs `(i, j)` where `i < j` and `words[i]` is both a **prefix** and a **suffix** of `words[j]`. ([LeetCode 3045](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii))

**Example 1:** `words=["a","aba","ababa","aa"]` → `4`
**Example 2:** `words=["pa","papa","ma","mama"]` → `2`

Constraints: `1 <= words.length <= 10^5`, `1 <= words[i].length <= 10^5`, total length ≤ `5 × 10^5`

---

## 📝 Interview Tips

1. **Clarify**: "i < j nghiêm ngặt, không có cặp (i,i)" / Strictly i < j, no self-pairs
2. **Brute force**: "O(n²·L) — kiểm tra mọi cặp → TLE với n=10^5" / O(n²·L) too slow
3. **Key insight**: "Zip (s[k], s[n-1-k]) thành pair → prefix+suffix check trở thành prefix-only check trên Trie" / Reduce to prefix problem via pairing
4. **Optimize**: "Xây Trie từ trái sang phải; khi thêm words[j] tra Trie → count các từ trước đó khớp" / Insert left-to-right, query before inserting
5. **Edge cases**: "words[i].length > words[j].length → không thể là prefix+suffix" / Filter by length automatically in Trie
6. **Complexity**: "O(total_chars) time and space — mỗi ký tự xử lý một lần trong Trie" / Linear in total characters

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force O(n² · L) — correct but TLE for large input
 * Time: O(n² · L)
 * Space: O(1) extra
 */
function countPrefixSuffixPairsIIBrute(words: string[]): number {
  let count = 0;
  for (let j = 1; j < words.length; j++) {
    for (let i = 0; i < j; i++) {
      const wi = words[i],
        wj = words[j];
      if (wj.startsWith(wi) && wj.endsWith(wi)) count++;
    }
  }
  return count;
}

/**
 * Solution 2: Trie on character pairs (optimal)
 * Key: zip s with reverse(s) → (s[k], s[n-1-k]) pairs as trie keys
 * Time: O(total length of all words)
 * Space: O(total length of all words)
 */
function countPrefixSuffixPairs(words: string[]): number {
  // Trie node: children keyed by pair string, count of words ending here
  const root: Map<string, any> = new Map();

  let result = 0;

  for (const word of words) {
    const n = word.length;
    // Query: count words in trie that are prefix+suffix of current word
    let node = root;
    for (let k = 0; k < n; k++) {
      const key = `${word[k]},${word[n - 1 - k]}`;
      if (!node.has(key)) break;
      node = node.get(key);
      result += node.get("$") ?? 0;
    }

    // Insert current word into trie
    let cur = root;
    for (let k = 0; k < n; k++) {
      const key = `${word[k]},${word[n - 1 - k]}`;
      if (!cur.has(key)) cur.set(key, new Map());
      cur = cur.get(key);
    }
    cur.set("$", (cur.get("$") ?? 0) + 1);
  }

  return result;
}

// === Test Cases ===
console.log(countPrefixSuffixPairs(["a", "aba", "ababa", "aa"])); // → 4
console.log(countPrefixSuffixPairs(["pa", "papa", "ma", "mama"])); // → 2
console.log(countPrefixSuffixPairs(["abab", "ab"])); // → 0 (j must be > i)
console.log(countPrefixSuffixPairsBrute(["a", "aba", "ababa", "aa"])); // → 4 (verify brute)
```
