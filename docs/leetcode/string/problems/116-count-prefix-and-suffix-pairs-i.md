---
layout: page
title: "Count Prefix and Suffix Pairs I"
difficulty: Easy
category: String
tags: [Array, String, Trie, Rolling Hash, String Matching]
leetcode_url: "https://leetcode.com/problems/count-prefix-and-suffix-pairs-i"
---

# Count Prefix and Suffix Pairs I / Đếm Cặp Prefix-Suffix I

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii) | [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống kiểm tra xem tên một người có vừa là họ vừa là đệm của người khác không. Với chuỗi ngắn, kiểm tra trực tiếp là đủ nhanh.

**Pattern Recognition:**

- Signal: "is prefix AND suffix" + small n (≤ 50 strings, ≤ 50 chars) → **Brute Force O(n²)**
- Key insight: `isPrefixAndSuffix(str1, str2)` = `str2.startsWith(str1) && str2.endsWith(str1)`.
- Part II (large n) → cần trie hoặc Z-function, nhưng Part I đủ với O(n²·L).

**Visual:**

```
words = ["a","aba","ababa","aa"]

Pairs (i < j) where words[i] is prefix AND suffix of words[j]:
  (0,1): "a" prefix of "aba"? ✓  suffix of "aba"? ✓  → COUNT
  (0,2): "a" prefix of "ababa"? ✓  suffix? ✓  → COUNT
  (0,3): "a" prefix of "aa"? ✓  suffix? ✓  → COUNT
  (1,2): "aba" prefix of "ababa"? ✓  suffix? ✓  → COUNT
  (2,3): "ababa" longer than "aa" → skip
  (1,3): "aba" longer than "aa" → skip
Total = 4
```

---

## Problem Description

Given a 0-indexed string array `words`, return the number of pairs `(i, j)` where `i < j` such that `words[i]` is both a prefix and a suffix of `words[j]`. ([LeetCode](https://leetcode.com/problems/count-prefix-and-suffix-pairs-i))

Difficulty: Easy | Acceptance: ~67%

```
Example 1: words = ["a","aba","ababa","aa"] → 4
  (0,1),(0,2),(0,3),(1,2) are valid pairs

Example 2: words = ["pa","papa","ma","mama"] → 2
  (0,1): "pa" is prefix+suffix of "papa" ✓
  (2,3): "ma" is prefix+suffix of "mama" ✓

Example 3: words = ["abab","ab"] → 0
  Only pair (0,1): "abab" longer than "ab" → skip
```

Constraints:

- `1 <= words.length <= 50`
- `1 <= words[i].length <= 10`
- All lowercase English letters

---

## 📝 Interview Tips

1. **Clarify**: "i < j nghĩa là cặp có thứ tự?" / i < j means ordered pairs, count each once.
2. **Brute force**: "O(n²·L) đủ nhanh với n=50, L=10" / O(n²·L) totally fine for these constraints.
3. **Optimize**: "Part II cần Z-function hoặc trie; Part I không cần" / Part I brute is optimal, Part II needs Z-algo.
4. **Check**: "words[i] phải ngắn hơn hoặc bằng words[j]" / words[i].length ≤ words[j].length required.
5. **Edge cases**: "words[i] = words[j] → là prefix và suffix của chính nó → đếm nếu i < j" / Same string always qualifies.
6. **Follow-up**: "Nếu n=10^5? → dùng Z-function với mỗi string làm key" / Z-function or trie for Part II.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Direct string methods
 * Time: O(n² · L) — n pairs × L for startsWith/endsWith
 * Space: O(1)
 */
function countPrefixSuffixPairsBrute(words: string[]): number {
  let count = 0;
  const n = words.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (words[j].startsWith(words[i]) && words[j].endsWith(words[i])) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Solution 2: Explicit prefix/suffix check (shows the logic clearly)
 * Time: O(n² · L)
 * Space: O(1)
 */
function isPrefixAndSuffix(str1: string, str2: string): boolean {
  const L1 = str1.length;
  const L2 = str2.length;
  if (L1 > L2) return false;

  // Check prefix: str2[0..L1-1] === str1
  for (let k = 0; k < L1; k++) {
    if (str2[k] !== str1[k]) return false;
  }
  // Check suffix: str2[L2-L1..L2-1] === str1
  for (let k = 0; k < L1; k++) {
    if (str2[L2 - L1 + k] !== str1[k]) return false;
  }
  return true;
}

function countPrefixSuffixPairs(words: string[]): number {
  let count = 0;
  const n = words.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isPrefixAndSuffix(words[i], words[j])) count++;
    }
  }
  return count;
}

/**
 * Solution 3: Z-function based (optimal for Part II style)
 * Time: O(n² · L) same here, but shows the pattern for Part II
 * Space: O(L) per call
 *
 * isPrefixAndSuffix using Z-function:
 * Concat str1 + '#' + str2, check Z[L1+1+k] >= L1 for k=L2-L1
 */
function zFunction(s: string): number[] {
  const n = s.length;
  const z = new Array(n).fill(0);
  z[0] = n;
  let l = 0,
    r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] > r) {
      l = i;
      r = i + z[i];
    }
  }
  return z;
}

function countPrefixSuffixPairsZ(words: string[]): number {
  let count = 0;
  const n = words.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const s1 = words[i],
        s2 = words[j];
      if (s1.length > s2.length) continue;
      const concat = s1 + "#" + s2;
      const z = zFunction(concat);
      const L1 = s1.length,
        L2 = s2.length;
      // Prefix: z[L1+1] >= L1
      // Suffix: z[L1+1 + (L2-L1)] >= L1
      if (z[L1 + 1] >= L1 && z[L1 + 1 + (L2 - L1)] >= L1) count++;
    }
  }
  return count;
}

// === Test Cases ===
console.log(countPrefixSuffixPairs(["a", "aba", "ababa", "aa"])); // 4
console.log(countPrefixSuffixPairs(["pa", "papa", "ma", "mama"])); // 2
console.log(countPrefixSuffixPairs(["abab", "ab"])); // 0
console.log(countPrefixSuffixPairsBrute(["a", "aba", "ababa", "aa"])); // 4
console.log(countPrefixSuffixPairsZ(["a", "aba", "ababa", "aa"])); // 4
```

---

## 🔗 Related Problems

| Problem                                                                                                | Pattern           | Difficulty |
| ------------------------------------------------------------------------------------------------------ | ----------------- | ---------- |
| [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii)     | Z-function / Trie | Hard       |
| [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome)                               | KMP / Z-function  | Hard       |
| [Implement strStr()](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) | KMP               | Easy       |
| [Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix)                             | KMP / Z-function  | Hard       |
