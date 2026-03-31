---
layout: page
title: "Palindrome Pairs"
difficulty: Hard
category: String
tags: [Array, Hash Table, String, Trie]
leetcode_url: "https://leetcode.com/problems/palindrome-pairs"
---

# Palindrome Pairs / Cặp Palindrome

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Hash Map + Palindrome Check
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring) | [Word Break II](https://leetcode.com/problems/word-break-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ghép hai mảnh gương soi — nếu mảnh A ngược lại bằng mảnh B thì ghép lại thành một tấm gương hoàn hảo (palindrome). Dùng hash map để tra cứu O(1) thay vì O(n²) brute force.

**Pattern Recognition:**

- Signal: "concatenation forms palindrome" + "lookup by reverse" → **Hash Map**
- Key insight: `words[i] + words[j]` là palindrome khi prefix/suffix của một từ khớp với reverse của từ kia

**Visual — Hash Map lookup:**

```
words = ["abcd","dcba","lls","s","sssll"]
map = { "abcd":0, "dcba":1, "lls":2, "s":3, "sssll":4 }

For "lls" (index 2):
  prefix "" → reverse="" in map? yes (empty) → check "lls" palindrome? no
  prefix "l" → reverse="l"? no
  prefix "ll" → reverse="ll"? no
  suffix "s" → reverse="s" in map (index 3)! → check "ll" palindrome? yes → pair (3,2)
  suffix "ls" → reverse="sl"? no
  → also check full reverse "sll" → "lls" reversed? no ... "s" reversed="s" in map → (2,3)
```

---

## Problem Description

Given an array of **unique** strings `words`, return all index pairs `[i, j]` where `words[i] + words[j]` is a palindrome. ([LeetCode 336](https://leetcode.com/problems/palindrome-pairs))

**Example 1:** `words = ["abcd","dcba","lls","s","sssll"]` → `[[0,1],[1,0],[3,2],[2,4]]`
**Example 2:** `words = ["bat","tab","cat"]` → `[[0,1],[1,0]]`

Constraints: `1 <= words.length <= 5000`, `0 <= words[i].length <= 300`, each word is unique

---

## 📝 Interview Tips

1. **Clarify**: "Từ có thể là chuỗi rỗng không?" / Can words contain empty strings? (Yes — empty + palindrome = palindrome)
2. **Brute force**: "O(n²·L) — thử mọi cặp và check palindrome" / Try every pair and verify — too slow for n=5000
3. **Optimize**: "Dùng hash map lưu index theo từ, với mỗi từ chia thành prefix/suffix" / Split each word and lookup reverse
4. **Edge cases**: "Từ rỗng ghép với palindrome bất kỳ → kết quả hợp lệ" / Empty string pairs with any palindrome
5. **Follow-up**: "Dùng Trie thay hash map để handle longer prefix searches" / Trie enables prefix-by-prefix traversal
6. **Complexity**: "O(n·L²) — với mỗi từ dài L, ta chia thành L+1 cặp prefix/suffix" / O(n·L²) time with hash map

---

## Solutions

```typescript
/**
 * Helper: check if string is palindrome
 */
function isPalin(s: string, l: number, r: number): boolean {
  while (l < r) {
    if (s[l++] !== s[r--]) return false;
  }
  return true;
}

/**
 * Solution 1: Hash Map — reverse lookup
 * Time: O(n · L²) — for each word, check all O(L) splits, each isPalin is O(L)
 * Space: O(n · L) — hash map storage
 */
function palindromePairs(words: string[]): number[][] {
  const map = new Map<string, number>();
  for (let i = 0; i < words.length; i++) map.set(words[i], i);

  const result: number[][] = [];

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const n = w.length;

    for (let k = 0; k <= n; k++) {
      // Case 1: left part is palindrome → find reverse of right part before i
      if (isPalin(w, 0, k - 1)) {
        const rev = w.slice(k).split("").reverse().join("");
        const j = map.get(rev);
        if (j !== undefined && j !== i) result.push([j, i]);
      }
      // Case 2: right part is palindrome → find reverse of left part after i
      // (skip k === n to avoid duplicates with Case 1 when k === 0)
      if (k !== n && isPalin(w, k, n - 1)) {
        const rev = w.slice(0, k).split("").reverse().join("");
        const j = map.get(rev);
        if (j !== undefined && j !== i) result.push([i, j]);
      }
    }
  }

  return result;
}

// === Test Cases ===
console.log(palindromePairs(["abcd", "dcba", "lls", "s", "sssll"]));
// → [[1,0],[0,1],[3,2],[2,4]] (order may vary)
console.log(palindromePairs(["bat", "tab", "cat"]));
// → [[0,1],[1,0]]
console.log(palindromePairs(["a", ""]));
// → [[0,1],[1,0]]
```

---

## 🔗 Related Problems

| Problem                                                                                      | Difficulty | Pattern              |
| -------------------------------------------------------------------------------------------- | ---------- | -------------------- |
| [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring) | 🟡 Medium  | Expand Around Center |
| [Word Break II](https://leetcode.com/problems/word-break-ii)                                 | 🔴 Hard    | DP + Hash Set        |
| [Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii)       | 🔴 Hard    | DP                   |
| [Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii)                     | 🟢 Easy    | Two Pointers         |
| [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome)                     | 🔴 Hard    | KMP                  |
