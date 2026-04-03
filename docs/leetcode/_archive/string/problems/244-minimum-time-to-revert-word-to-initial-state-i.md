---
layout: page
title: "Minimum Time to Revert Word to Initial State I"
difficulty: Medium
category: String
tags: [String, Rolling Hash, String Matching, Hash Function]
leetcode_url: "https://leetcode.com/problems/minimum-time-to-revert-word-to-initial-state-i"
---

# Minimum Time to Revert Word to Initial State I / Minimum Time to Revert Word to Initial State I

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: String Matching
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome) | [Minimum Time to Revert Word to Initial State II](https://leetcode.com/problems/minimum-time-to-revert-word-to-initial-state-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như cuộn băng tải liên tục — mỗi giây cắt đi k ký tự đầu và dán k ký tự mới vào cuối. Muốn băng trở lại ban đầu, phần còn lại sau khi cắt phải khớp với đầu chuỗi gốc (vì ta có thể chọn k ký tự dán vào tùy ý).

**Visual — Check if suffix matches prefix:**

```
word = "abacaba",  k = 2

t=1: remove first 2 → "acaba" (len=5)
     Need word[2:] = "acaba" to be prefix of "abacaba" of length 5
     "abaca" ≠ "acaba" → NO

t=2: remove first 4 → "aba" (len=3)
     Need word[4:] = "aba" to be prefix of "abacaba" of length 3
     "aba" == "aba" ✅ → append "caba" to restore → answer = 2

t=3: remove first 6 → "a" (len=1) → prefix match trivially
t=4: remove all 8 ≥ 7 → empty → can refill entirely → answer ≤ 4

Condition: word[t*k : ] == word[0 : n - t*k]  OR  t*k >= n
```

---

## Problem Description

You have a string `word` and integer `k`. Each second you: remove the **first** `k` characters, then **append** any `k` characters to the end. Find the **minimum number of seconds** until `word` returns to its initial state.

**Example 1:** `word = "abacaba"`, `k = 2` → `2`  
**Example 2:** `word = "abacaba"`, `k = 4` → `1`

Constraints: `1 <= word.length <= 50`, `1 <= k <= word.length`.

---

## 📝 Interview Tips

1. **Key insight**: "Sau t giây, word[t*k:] phải là prefix của word — phần còn lại quyết định cấu trúc" / After t seconds, word[t*k:] must equal the prefix of word of same length
2. **Base case**: "Khi t*k >= n, toàn bộ chuỗi được thay thế — luôn có thể khôi phục" / When t*k ≥ n, entire word is replaced — always possible
3. **Brute force OK**: "n ≤ 50 → O(n²) là ổn; dùng string.startsWith hoặc slice" / n ≤ 50: O(n²) brute force fine; use startsWith or slice
4. **Upper bound**: "Câu trả lời tối đa là ceil(n/k) — sau đó toàn bộ chuỗi đã thay thế" / Max answer is ceil(n/k): after that, entire string replaced
5. **Compare with Hard**: "Bài II n ≤ 10^5 → dùng Z-function O(n); bài I n ≤ 50 → brute force OK" / Part II needs Z-function for large n; Part I brute force is sufficient
6. **Edge cases**: "k=n → answer always 1; word toàn ký tự giống nhau → answer luôn 1" / k=n → always 1 second; all same chars → always 1

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — try each t from 1 upward
 * After t seconds, check if word[t*k:] is a prefix of word.
 * If yes, we can append the right chars to restore word.
 * Time: O(n²/k) — at most ceil(n/k) iterations, each O(n) comparison
 * Space: O(n) — substring slices
 */
function minimumTimeBrute(word: string, k: number): number {
  const n = word.length;
  for (let t = 1; ; t++) {
    const removed = t * k;
    if (removed >= n) return t; // entire word gone, refill with original
    const suffix = word.slice(removed);       // word[t*k:]
    const prefix = word.slice(0, n - removed); // word[0 : n-t*k]
    if (suffix === prefix) return t;
  }
}

/**
 * Solution 2: Using startsWith for clarity
 * word[t*k:] must match word[0: n - t*k], which means word.startsWith(word[t*k:])
 * Time: O(n²/k) — same complexity, slightly cleaner
 * Space: O(n)
 */
function minimumTimeI(word: string, k: number): number {
  const n = word.length;
  for (let t = 1; ; t++) {
    if (t * k >= n) return t;
    // Check: is word[t*k:] a prefix of word?
    if (word.startsWith(word.slice(t * k))) return t;
  }
}

/**
 * Solution 3: KMP Z-function (overkill for n≤50, but shows the pattern for Part II)
 * Build Z-array where z[i] = length of longest prefix of word that starts at word[i].
 * Then for each t, check z[t*k] >= n - t*k.
 * Time: O(n) — Z-function construction + O(n/k) iterations
 * Space: O(n) — Z-array
 */
function zFunction(s: string): number[] {
  const n = s.length;
  const z = new Array(n).fill(0);
  z[0] = n;
  let l = 0, r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] > r) { l = i; r = i + z[i]; }
  }
  return z;
}

function minimumTimeIZ(word: string, k: number): number {
  const n = word.length;
  const z = zFunction(word);
  for (let t = 1; ; t++) {
    if (t * k >= n) return t;
    if (z[t * k] >= n - t * k) return t;
  }
}

// === Test Cases ===
console.log(minimumTimeI('abacaba', 2));    // 2
console.log(minimumTimeI('abacaba', 4));    // 1
console.log(minimumTimeI('abc', 3));        // 1  (k=n → always 1)
console.log(minimumTimeI('aaa', 1));        // 1  (all same → suffix always prefix)
console.log(minimumTimeI('abab', 2));       // 1  (word[2:]="ab" == prefix "ab")
```

---

## 🔗 Related Problems

| Problem | Pattern | Difficulty |
|---------|---------|-----------|
| [Minimum Time to Revert Word to Initial State II](https://leetcode.com/problems/minimum-time-to-revert-word-to-initial-state-ii) | Z-function | Hard |
| [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome) | KMP / Z-function | Hard |
| [Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern) | KMP | Easy |
| [Find Beautiful Indices in the Given Array I](https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-i) | String Matching | Medium |
