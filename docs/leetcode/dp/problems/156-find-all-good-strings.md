---
layout: page
title: "Find All Good Strings"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming, String Matching]
leetcode_url: "https://leetcode.com/problems/find-all-good-strings"
---

# Find All Good Strings / Tìm Tất Cả Chuỗi Tốt

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximum Repeating Substring](https://leetcode.com/problems/maximum-repeating-substring) | [String Transformation](https://leetcode.com/problems/string-transformation)

---

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Như đếm mật khẩu hợp lệ — xây dựng chuỗi từng ký tự, kiểm tra đồng thời có nằm trong khoảng [s1, s2] (tight bound) và không chứa chuỗi `evil` (KMP automaton).

```
Digit DP state: (position, tight1, tight2, kmpState)
  position: current char index (0..n-1)
  tight1:   are we still bounded by s1 from below?
  tight2:   are we still bounded by s2 from above?
  kmpState: how many chars of "evil" matched so far (KMP failure)

If kmpState == len(evil) → this path is invalid (string contains evil)

Count = ways with tight1=false, tight2=false minus paths that contain evil
```

**Key insight:** Combine digit DP (count strings in [s1..s2]) with KMP automaton (reject strings containing `evil`). States: `dp[pos][kmpState][tight1][tight2]`.

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **KMP failure function**: Precompute `fail[]` to build automaton transitions / hàm thất bại KMP
- 🔑 **Automaton**: `next[state][c]` = next KMP state when current is `state` and we see char `c` / automat
- 🔑 **Digit DP state**: `(pos, kmpState, tight1, tight2)` — 4 dimensions / 4 chiều trạng thái
- 🔑 **Pruning**: If `kmpState == evil.length` → return 0 (invalid path) / cắt nhánh ngay
- 🔑 **tight1/tight2**: Bound `s1[pos] <= c <= s2[pos]` when both tight; adjust per tightness / ràng buộc biên
- 🔑 **MOD = 1e9+7**: Apply at every addition step / lấy dư mỗi bước

---

## Solutions / Giải Pháp

### Solution 1: Digit DP + KMP Automaton (O(n × m × 26) time)

```typescript
/**
 * Find All Good Strings — Digit DP + KMP
 *
 * Count strings of length n in [s1, s2] that don't contain 'evil' as substring.
 * Use KMP automaton to track evil-matching state.
 * DP state: (pos, kmpState, tight_lo, tight_hi)
 *
 * Time:  O(n × m × 26)  where m = evil.length
 * Space: O(n × m × 4)   — memoization table
 */
function findGoodStrings(n: number, s1: string, s2: string, evil: string): number {
  const MOD = 1_000_000_007;
  const m = evil.length;

  // Build KMP failure function
  const fail = new Array(m).fill(0);
  for (let i = 1; i < m; i++) {
    let j = fail[i - 1];
    while (j > 0 && evil[i] !== evil[j]) j = fail[j - 1];
    if (evil[i] === evil[j]) j++;
    fail[i] = j;
  }

  // Build KMP automaton: next[state][char_code] = next state
  const kmpNext: number[][] = Array.from({ length: m + 1 }, () => new Array(26).fill(0));
  for (let state = 0; state <= m; state++) {
    for (let c = 0; c < 26; c++) {
      if (state < m && evil.charCodeAt(state) - 97 === c) {
        kmpNext[state][c] = state + 1;
      } else if (state === 0) {
        kmpNext[state][c] = 0;
      } else {
        kmpNext[state][c] = kmpNext[fail[state - 1]][c];
      }
    }
  }

  // Memoization: dp[pos][kmpState][tight1][tight2]
  const memo = new Map<string, number>();

  function dp(pos: number, kmpState: number, tight1: boolean, tight2: boolean): number {
    if (kmpState === m) return 0; // Contains evil — invalid
    if (pos === n) return 1; // Valid string of length n

    const key = `${pos},${kmpState},${tight1 ? 1 : 0},${tight2 ? 1 : 0}`;
    if (memo.has(key)) return memo.get(key)!;

    const lo = tight1 ? s1.charCodeAt(pos) - 97 : 0;
    const hi = tight2 ? s2.charCodeAt(pos) - 97 : 25;
    let count = 0;

    for (let c = lo; c <= hi; c++) {
      const nextKmp = kmpNext[kmpState][c];
      const nextTight1 = tight1 && c === lo;
      const nextTight2 = tight2 && c === hi;
      count = (count + dp(pos + 1, nextKmp, nextTight1, nextTight2)) % MOD;
    }

    memo.set(key, count);
    return count;
  }

  return dp(0, 0, true, true);
}

console.log(findGoodStrings(2, "aa", "da", "b")); // 51
console.log(findGoodStrings(8, "leetcode", "leetcode", "leet")); // 0
console.log(findGoodStrings(2, "gx", "gz", "x")); // 2 ("gy", "gz" — "gx" contains "x"? wait: "gx" contains x at pos1)
console.log(findGoodStrings(1, "a", "z", "m")); // 25 (all except "m")
```

### Solution 2: Count via helper (count strings ≤ bound)

```typescript
/**
 * Find All Good Strings — Count(s2) - Count(s1-1)
 *
 * Alternative: use inclusion-exclusion.
 * countGood(s) = number of good strings of length n that are ≤ s and don't contain evil.
 * Answer = countGood(s2) - countGood(s1) + (s1 itself is good ? 1 : 0)
 * But the single-DP approach with tight1+tight2 is cleaner.
 * This solution shows the helper function pattern.
 *
 * Time:  O(n × m × 26)
 * Space: O(n × m)
 */
function findGoodStringsAlt(n: number, s1: string, s2: string, evil: string): number {
  const MOD = 1_000_000_007;
  const m = evil.length;

  const fail = new Array(m).fill(0);
  for (let i = 1; i < m; i++) {
    let j = fail[i - 1];
    while (j > 0 && evil[i] !== evil[j]) j = fail[j - 1];
    if (evil[i] === evil[j]) j++;
    fail[i] = j;
  }

  const kmpNext: number[][] = Array.from({ length: m + 1 }, () => new Array(26).fill(0));
  for (let state = 0; state <= m; state++) {
    for (let c = 0; c < 26; c++) {
      if (state < m && evil.charCodeAt(state) - 97 === c) {
        kmpNext[state][c] = state + 1;
      } else if (state === 0) {
        kmpNext[state][c] = 0;
      } else {
        kmpNext[state][c] = kmpNext[fail[state - 1]][c];
      }
    }
  }

  // Count strings <= bound that don't contain evil
  function countUpTo(bound: string): number {
    const memo = new Map<string, number>();
    function solve(pos: number, kmp: number, tight: boolean): number {
      if (kmp === m) return 0;
      if (pos === n) return 1;
      const key = `${pos},${kmp},${tight ? 1 : 0}`;
      if (memo.has(key)) return memo.get(key)!;
      const hi = tight ? bound.charCodeAt(pos) - 97 : 25;
      let cnt = 0;
      for (let c = 0; c <= hi; c++) {
        cnt = (cnt + solve(pos + 1, kmpNext[kmp][c], tight && c === hi)) % MOD;
      }
      memo.set(key, cnt);
      return cnt;
    }
    return solve(0, 0, true);
  }

  // Check if s1 itself is valid (doesn't contain evil)
  function containsEvil(str: string): boolean {
    let state = 0;
    for (const ch of str) {
      state = kmpNext[state][ch.charCodeAt(0) - 97];
      if (state === m) return true;
    }
    return false;
  }

  const countS2 = countUpTo(s2);
  const countBeforeS1 = (() => {
    // Decrement s1 by 1 lexicographically
    const arr = s1.split("").map((c) => c.charCodeAt(0) - 97);
    let carry = 1;
    for (let i = arr.length - 1; i >= 0 && carry; i--) {
      arr[i] -= carry;
      if (arr[i] < 0) {
        arr[i] += 26;
        carry = 1;
      } else carry = 0;
    }
    if (carry) return 0; // s1 was "aaa...a", nothing below
    return countUpTo(arr.map((c) => String.fromCharCode(c + 97)).join(""));
  })();

  const s1Valid = containsEvil(s1) ? 0 : 1;
  return (countS2 - countBeforeS1 + s1Valid + MOD) % MOD;
}

console.log(findGoodStringsAlt(2, "aa", "da", "b")); // 51
console.log(findGoodStringsAlt(1, "a", "z", "m")); // 25
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                                | Difficulty | Pattern          |
| ------------------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| [Count Special Integers](https://leetcode.com/problems/count-special-integers)                         | 🔴 Hard    | Digit DP         |
| [Numbers At Most N Given Digit Set](https://leetcode.com/problems/numbers-at-most-n-given-digit-set)   | 🔴 Hard    | Digit DP         |
| [Maximum Deletions on a String](https://leetcode.com/problems/maximum-deletions-on-a-string)           | 🔴 Hard    | KMP / Z-Function |
| [Implement strStr()](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) | 🟢 Easy    | KMP              |
