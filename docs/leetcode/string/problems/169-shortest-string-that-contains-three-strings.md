---
layout: page
title: "Shortest String That Contains Three Strings"
difficulty: Medium
category: String
tags: [String, Greedy, Enumeration]
leetcode_url: "https://leetcode.com/problems/shortest-string-that-contains-three-strings"
---

# Shortest String That Contains Three Strings / Chuỗi Ngắn Nhất Chứa Ba Chuỗi

🟡 Medium | 🏷️ String, Greedy, Enumeration

## 🧠 Intuition

**VI:** Tìm chuỗi ngắn nhất chứa `a`, `b`, `c` làm substring. Thử tất cả 6 hoán vị `[a,b,c]`, với mỗi hoán vị, hợp nhất 3 chuỗi theo thứ tự bằng cách tìm **overlap tối đa** giữa đuôi chuỗi trước và đầu chuỗi sau. Chọn kết quả ngắn nhất (nếu bằng nhau, chọn lex nhỏ hơn).

**EN:** Try all 6 permutations of [a, b, c]. For each ordering, merge consecutive strings by finding their maximum suffix-prefix overlap. Return the shortest merged result (lexicographically smallest if tie).

```
a="abc", b="bca", c="aab"
Ordering [abc, bca, aab]:
  "abc" + "bca" → overlap "bc" → "abca"
  "abca" + "aab" → overlap "a" → "abcaab"  len=6

Ordering [aab, abc, bca]:
  "aab"+"abc" → overlap "ab" → "aabc"
  "aabc"+"bca" → overlap "bc" → "aabca"  len=5 ✅
```

## 📝 Interview Tips

- 🇻🇳 **Brute force hợp lý:** 3! = 6 hoán vị — hoàn toàn chấp nhận được
- 🇬🇧 **Only 6 permutations:** 3! = 6, each merge is O(n) — total O(6n) = O(n)
- 🇻🇳 **Overlap function:** tìm độ dài overlap lớn nhất của suffix(s1) khớp prefix(s2)
- 🇬🇧 **Overlap merge:** find max `k` where `s1.endsWith(s2.slice(0,k))` then `s1 + s2.slice(k)`
- 🇻🇳 **Xử lý containment:** nếu `s2 ⊂ s1` thì không cần thêm gì cả
- 🇬🇧 **Containment check:** if one string contains another, overlap = full second string length
- 🇻🇳 **Tie-breaking:** cùng độ dài thì chọn chuỗi nhỏ hơn theo alphabet
- 🇬🇧 **Tie-breaking:** same length? take lexicographically smaller string

## Solutions

### Solution 1: Enumerate all 6 permutations

```typescript
/**
 * Try all 3! permutations, merge with maximum overlap, pick shortest+lex.
 * Time: O(n^2) per merge, 6 permutations → O(6 * n^2) = O(n^2)
 * Space: O(n)
 */
function minimumString(a: string, b: string, c: string): string {
  function merge(s1: string, s2: string): string {
    if (s1.includes(s2)) return s1;
    if (s2.includes(s1)) return s2;
    // Find max overlap: suffix of s1 = prefix of s2
    for (let k = Math.min(s1.length, s2.length); k >= 1; k--) {
      if (s1.endsWith(s2.slice(0, k))) return s1 + s2.slice(k);
    }
    return s1 + s2;
  }

  const perms: [string, string, string][] = [
    [a, b, c],
    [a, c, b],
    [b, a, c],
    [b, c, a],
    [c, a, b],
    [c, b, a],
  ];

  let best = "";
  for (const [x, y, z] of perms) {
    const candidate = merge(merge(x, y), z);
    if (
      best === "" ||
      candidate.length < best.length ||
      (candidate.length === best.length && candidate < best)
    ) {
      best = candidate;
    }
  }
  return best;
}

console.log(minimumString("abc", "bca", "aab")); // "aabc" or "aabca"
console.log(minimumString("ab", "ba", "aba")); // "aba"
console.log(minimumString("aa", "aa", "aa")); // "aa"
```

### Solution 2: KMP-based overlap for efficiency

```typescript
/**
 * Use KMP failure function for O(n) overlap computation.
 * Time: O(n) per merge, 6 perms → O(6n) = O(n) | Space: O(n)
 */
function minimumString2(a: string, b: string, c: string): string {
  function kmpOverlap(s1: string, s2: string): number {
    if (s1.includes(s2)) return s2.length; // s2 fully inside s1
    const combined = s2 + "#" + s1;
    const fail = [0];
    for (let i = 1; i < combined.length; i++) {
      let k = fail[i - 1];
      while (k > 0 && combined[i] !== combined[k]) k = fail[k - 1];
      fail.push(combined[i] === combined[k] ? k + 1 : 0);
    }
    return fail[combined.length - 1];
  }

  function merge(s1: string, s2: string): string {
    if (s1.includes(s2)) return s1;
    const overlap = kmpOverlap(s1, s2);
    return s1 + s2.slice(overlap);
  }

  const strs = [a, b, c];
  const perms = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ];
  let best = "";
  for (const [i, j, k] of perms) {
    const candidate = merge(merge(strs[i], strs[j]), strs[k]);
    if (
      best === "" ||
      candidate.length < best.length ||
      (candidate.length === best.length && candidate < best)
    ) {
      best = candidate;
    }
  }
  return best;
}

console.log(minimumString2("abc", "bca", "aab")); // "aabc"
console.log(minimumString2("ab", "ba", "aba")); // "aba"
```

## 🔗 Related Problems

| #    | Problem                                | Difficulty | Key Idea            |
| ---- | -------------------------------------- | ---------- | ------------------- |
| 1092 | Shortest Common Supersequence          | 🔴 Hard    | DP supersequence    |
| 943  | Find the Shortest Superstring          | 🔴 Hard    | TSP + DP on subsets |
| 28   | Find the Index of the First Occurrence | 🟢 Easy    | KMP string matching |
