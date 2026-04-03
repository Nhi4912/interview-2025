---
layout: page
title: "Scramble String"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/scramble-string"
---

# Scramble String / Chuỗi Xáo Trộn

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: 3D Interval DP
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Interleaving String](https://leetcode.com/problems/interleaving-string) | [Burst Balloons](https://leetcode.com/problems/burst-balloons)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chia một tờ giấy thành hai mảnh rồi có thể hoán đổi hoặc giữ nguyên thứ tự — mỗi cách chia tạo ra một cây nhị phân khác nhau. Hai chuỗi là scramble nếu tồn tại một cây như vậy.

**Pattern Recognition:**

- Signal: "recursive split + optional swap" + two same-length strings → **3D Interval DP**
- `dp[i][j][len]` = liệu `s1[i..i+len-1]` có thể scramble thành `s2[j..j+len-1]`
- Key insight: Với mỗi split point k, kiểm tra hai trường hợp (swap/no-swap)

**Visual — s1="great", s2="rgeat":**

```
Split "great" at k=1: "g" | "reat"
  No swap:  isScramble("g","r") AND isScramble("reat","geat") → false
  Swap:     isScramble("g","t") AND isScramble("reat","rgea") → ...

Split at k=2: "gr" | "eat"
  Swap:     isScramble("gr","at") AND isScramble("eat","rge") → ...
  No swap:  isScramble("gr","rg") AND isScramble("eat","eat") → true ✓
```

---

## Problem Description

Given strings `s1` and `s2` of the same length, return true if `s2` is a scrambled version of `s1`. A scramble is formed by recursively splitting a string and optionally swapping the two halves. ([LeetCode 87](https://leetcode.com/problems/scramble-string))

- Example 1: `s1="great", s2="rgeat"` → `true`
- Example 2: `s1="abcde", s2="caebd"` → `false`
- Example 3: `s1="a", s2="a"` → `true`

Constraints: `s1.length == s2.length`, `1 ≤ s1.length ≤ 30`

---

## 📝 Interview Tips

1. **Clarify**: "Hai chuỗi luôn cùng độ dài không?" / Always same length? What about empty strings?
2. **Brute force**: "Recursion: thử mọi split point và 2 cases (swap/no-swap)" / O(n! \* 2^n) — exponential
3. **Pruning**: "Nếu sorted chars khác nhau → false ngay" / Quick anagram check reduces exponential branches
4. **State**: "`dp[i][j][len]` = s1 bắt đầu i, s2 bắt đầu j, độ dài len" / 3D boolean DP
5. **Order**: "Tăng dần len từ 1 → n; len=1 là base case khi s1[i]==s2[j]" / Fill by increasing length
6. **Complexity**: "O(n⁴) time, O(n³) space — acceptable for n≤30" / State _ transition = n³ _ n = n⁴

---

## Solutions

```typescript
/**
 * Solution 1: Recursion + Memoization (Top-Down)
 * Time: O(n⁴) — n³ states, n transitions each
 * Space: O(n³)
 */
function isScrambleMemo(s1: string, s2: string): boolean {
  const memo = new Map<string, boolean>();

  function dp(a: string, b: string): boolean {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    // Prune: sorted chars must match
    if ([...a].sort().join("") !== [...b].sort().join("")) return false;
    const key = `${a}|${b}`;
    if (memo.has(key)) return memo.get(key)!;

    const n = a.length;
    let res = false;
    for (let k = 1; k < n && !res; k++) {
      // No swap: a[0..k-1] → b[0..k-1], a[k..] → b[k..]
      if (dp(a.slice(0, k), b.slice(0, k)) && dp(a.slice(k), b.slice(k))) res = true;
      // Swap: a[0..k-1] → b[n-k..], a[k..] → b[0..n-k-1]
      if (dp(a.slice(0, k), b.slice(n - k)) && dp(a.slice(k), b.slice(0, n - k))) res = true;
    }
    memo.set(key, res);
    return res;
  }

  return dp(s1, s2);
}

/**
 * Solution 2: Bottom-Up 3D DP
 * Time: O(n⁴) — O(n³) states × O(n) split points
 * Space: O(n³)
 */
function isScramble(s1: string, s2: string): boolean {
  const n = s1.length;
  // dp[len][i][j] = isScramble(s1[i..i+len-1], s2[j..j+len-1])
  const dp: boolean[][][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: n }, () => new Array(n).fill(false)),
  );

  // Base: length 1
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) dp[1][i][j] = s1[i] === s2[j];

  // Fill by increasing length
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      for (let j = 0; j <= n - len; j++) {
        for (let k = 1; k < len; k++) {
          // No swap
          if (dp[k][i][j] && dp[len - k][i + k][j + k]) {
            dp[len][i][j] = true;
            break;
          }
          // Swap
          if (dp[k][i][j + len - k] && dp[len - k][i + k][j]) {
            dp[len][i][j] = true;
            break;
          }
        }
      }
    }
  }

  return dp[n][0][0];
}

// === Test Cases ===
console.log(isScramble("great", "rgeat")); // true
console.log(isScramble("abcde", "caebd")); // false
console.log(isScramble("a", "a")); // true
console.log(isScramble("ab", "ba")); // true
```

---

## 🔗 Related Problems

- [Interleaving String](https://leetcode.com/problems/interleaving-string) — 2D DP hai chuỗi hợp nhau
- [Burst Balloons](https://leetcode.com/problems/burst-balloons) — interval DP với split point
- [Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii) — interval DP trên string
- [Strange Printer](https://leetcode.com/problems/strange-printer) — interval DP khó
- [Zuma Game](https://leetcode.com/problems/zuma-game) — interval DP xóa chuỗi
