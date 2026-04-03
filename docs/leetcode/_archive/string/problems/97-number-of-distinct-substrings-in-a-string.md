---
layout: page
title: "Number of Distinct Substrings in a String"
difficulty: Medium
category: String
tags: [String, Trie, Rolling Hash, Suffix Array, Hash Function]
leetcode_url: "https://leetcode.com/problems/number-of-distinct-substrings-in-a-string"
---

# Number of Distinct Substrings in a String / Số Chuỗi Con Phân Biệt Trong Chuỗi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii) | [Count Prefix and Suffix Pairs I](https://leetcode.com/problems/count-prefix-and-suffix-pairs-i)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Tưởng tượng bạn cắm que từng suffix vào cây trie. Mỗi node mới tạo ra là một chuỗi con mới chưa gặp. Tổng số node (trừ root) = số chuỗi con phân biệt.

```
s = "aab"   All substrings: a, a, b, aa, ab, aab
Unique: {a, b, aa, ab, aab} → count = 5

Trie built from suffixes:
root → a → null (1)
     → a → b (2, new node b)
     → a → a → b (3, new node aa, 4 new node aab)
     → b (5, new node b... wait, b already? no)

Simpler: use Set of all substrings
```

---

## Problem Description

Given a string `s`, return the **number of distinct non-empty substrings** of `s`.

**Example 1:** `s="aab"` → `5` (substrings: "a","b","aa","ab","aab")
**Example 2:** `s="abcdefg"` → `28` (all 7\*8/2 = 28 since all chars unique)

Constraints: `1 ≤ s.length ≤ 500`, `s` contains only lowercase letters.

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Empty string tính không?" / Does empty substring count? (No, non-empty only)
2. **Brute force / Vét cạn**: Enumerate all O(n²) substrings, add to Set → O(n²) time, O(n²) space
3. **Trie approach / Dùng Trie**: Insert all suffixes, count new nodes → O(n²) time, O(n²) space
4. **Advanced / Nâng cao**: Suffix Array + LCP array gives O(n log n) solution
5. **Edge cases / Trường hợp đặc biệt**: All same char "aaa" → n\*(n+1)/2 - (duplicates) careful counting
6. **Follow-up / Hỏi thêm**: "Độ dài n=10^5?" / Use suffix automaton or suffix array for O(n log n)

---

## Solutions

```typescript
/**
 * Solution 1: Set of all substrings (Brute Force)
 * Time: O(n³) — O(n²) substrings × O(n) to hash each, or O(n²) with slice
 * Space: O(n²)
 */
function countDistinctSubstringsBrute(s: string): number {
  const seen = new Set<string>();
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j <= s.length; j++) {
      seen.add(s.substring(i, j));
    }
  }
  return seen.size;
}
console.log(countDistinctSubstringsBrute("aab")); // 5
console.log(countDistinctSubstringsBrute("abcdefg")); // 28

/**
 * Solution 2: Trie — insert all suffixes, count newly created nodes
 * Each new trie node represents a previously unseen substring.
 * Time: O(n²) — insert n suffixes, each up to n chars
 * Space: O(n²) — trie nodes
 */
function countDistinctSubstrings(s: string): number {
  type TrieNode = Map<string, TrieNode>;
  const root: TrieNode = new Map();
  let count = 0;

  for (let i = 0; i < s.length; i++) {
    let node = root;
    for (let j = i; j < s.length; j++) {
      const ch = s[j];
      if (!node.has(ch)) {
        node.set(ch, new Map());
        count++; // new node = new distinct substring
      }
      node = node.get(ch)!;
    }
  }
  return count;
}

console.log(countDistinctSubstrings("aab")); // 5
console.log(countDistinctSubstrings("abcdefg")); // 28
console.log(countDistinctSubstrings("aaa")); // 3  ("a","aa","aaa")
console.log(countDistinctSubstrings("a")); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                                                | Pattern                 | Difficulty |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------- |
| [Longest Repeating Substring](https://leetcode.com/problems/longest-repeating-substring)                                               | Binary Search + Hashing | Medium     |
| [Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring)                                               | Suffix Array            | Hard       |
| [Count Unique Characters of All Substrings](https://leetcode.com/problems/count-unique-characters-of-all-substrings-of-a-given-string) | Contribution Technique  | Hard       |
| [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree)                                               | Trie                    | Medium     |
