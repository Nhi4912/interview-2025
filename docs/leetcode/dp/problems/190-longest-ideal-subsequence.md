---
layout: page
title: "Longest Ideal Subsequence"
difficulty: Medium
category: Dynamic Programming
tags: [Hash Table, String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/longest-ideal-subsequence"
---

# Longest Ideal Subsequence / Dãy Con Lý Tưởng Dài Nhất

🟡 Medium | DP on Characters | LeetCode 2370

## 🧠 Intuition / Tư Duy

**Tiếng Việt:** Một dãy con "lý tưởng" là dãy tăng và chênh lệch giữa hai ký tự liền kề ≤ k. Thay vì duyệt tất cả cặp O(n²), ta duy trì `dp[c]` = độ dài dãy con lý tưởng dài nhất kết thúc bằng ký tự c. Với mỗi ký tự mới, tìm giá trị tốt nhất trong cửa sổ [c-k, c+k].

```
s = "acfgbd", k = 2

Process 'a'(0): check chars in [-2, 2] → none yet, dp[0]=1
Process 'c'(2): check [0,4] → dp[0]='a'=1, dp[2]=max(1,1+1)=2
Process 'f'(5): check [3,7] → dp[3..7]=0, dp[5]=1
Process 'g'(6): check [4,8] → dp[5]='f'=1, dp[6]=2
Process 'b'(1): check [-1,3] → dp[0]='a'=1, dp[2]='c'=2, dp[1]=3
Process 'd'(3): check [1,5] → dp[1]='b'=3, dp[3]=4

Answer = max(dp) = 4 ["acbd"]
```

## Problem Description

A string `s` is ideal if all adjacent characters differ by at most `k` positions in the alphabet. Given string `s` and integer `k`, return the length of the **longest ideal subsequence** of `s`.

**Example 1:**

- Input: `s = "acfgbd"`, `k = 2`
- Output: `4` — e.g., "acbd": |a-c|=2, |c-b|=1, |b-d|=2 ≤ 2

**Example 2:**

- Input: `s = "abcd"`, `k = 3`
- Output: `4` — entire string is ideal

## 📝 Interview Tips

- 🎯 **Key insight / Chìa khoá:** `dp[c]` = longest ideal subseq ending at char c; for each char ci in s, extend from best dp in window [ci-k, ci+k]
- 📊 **Window scan / Quét cửa sổ:** Scan at most 2k+1 values; since k ≤ 25 and alphabet=26, inner loop is O(1)
- 🔢 **Transition / Công thức:** `dp[ci] = max(dp[j] for j in [ci-k..ci+k]) + 1`
- ⚡ **Complexity / Độ phức tạp:** O(n × k) where k ≤ 25, so effectively O(n)
- 🚫 **Edge case / Trường hợp đặc biệt:** k ≥ 25 means entire string can be ideal (all chars differ by ≤ 25)
- 💡 **vs LIS / So với LIS:** Similar to LIS but window-restricted; no binary search needed since alphabet bounded

## Solutions

```typescript
/**
 * Approach 1: DP with character window scan
 * Time: O(n * min(k, 26))
 * Space: O(26)
 *
 * dp[c] = longest ideal subsequence ending with character c
 */
function longestIdealString(s: string, k: number): number {
  const dp = new Array(26).fill(0);

  for (const ch of s) {
    const ci = ch.charCodeAt(0) - 97;

    // Find max dp value in window [ci-k, ci+k] within [0,25]
    let best = 0;
    const lo = Math.max(0, ci - k);
    const hi = Math.min(25, ci + k);
    for (let j = lo; j <= hi; j++) {
      best = Math.max(best, dp[j]);
    }

    dp[ci] = best + 1;
  }

  return Math.max(...dp);
}

console.log(longestIdealString("acfgbd", 2)); // 4
console.log(longestIdealString("abcd", 3)); // 4
console.log(longestIdealString("a", 0)); // 1
console.log(longestIdealString("pvjcci", 4)); // 2
```

```typescript
/**
 * Approach 2: Top-down memoization (for understanding)
 * Time: O(n * 26)
 * Space: O(n * 26)
 */
function longestIdealString2(s: string, k: number): number {
  const n = s.length;
  // memo[i][last] = longest ideal subseq starting at i with last char being last
  const memo = new Map<string, number>();

  function dp(i: number, last: number): number {
    if (i === n) return 0;
    const key = `${i},${last}`;
    if (memo.has(key)) return memo.get(key)!;

    const ci = s.charCodeAt(i) - 97;

    // Skip current character
    let res = dp(i + 1, last);

    // Take current character if |ci - last| <= k
    if (last === -1 || Math.abs(ci - last) <= k) {
      res = Math.max(res, 1 + dp(i + 1, ci));
    }

    memo.set(key, res);
    return res;
  }

  return dp(0, -1);
}

console.log(longestIdealString2("acfgbd", 2)); // 4
console.log(longestIdealString2("abcd", 3)); // 4
```

```typescript
/**
 * Approach 3: Segment tree for O(n log 26) — overkill but shows the pattern
 * Simplified: just demonstrate the O(n) pass with explicit array
 * Time: O(n)
 * Space: O(26)
 */
function longestIdealString3(s: string, k: number): number {
  const dp = new Int32Array(26);
  let ans = 0;

  for (let idx = 0; idx < s.length; idx++) {
    const ci = s.charCodeAt(idx) - 97;
    let best = 0;
    for (let j = Math.max(0, ci - k); j <= Math.min(25, ci + k); j++) {
      if (dp[j] > best) best = dp[j];
    }
    dp[ci] = best + 1;
    if (dp[ci] > ans) ans = dp[ci];
  }

  return ans;
}

console.log(longestIdealString3("acfgbd", 2)); // 4
console.log(longestIdealString3("abcd", 3)); // 4
```

## 🔗 Related Problems

| Problem                                                                                         | Difficulty | Key Concept      |
| ----------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) | 🟡 Medium  | Classic LIS DP   |
| [Longest Arithmetic Subsequence](https://leetcode.com/problems/longest-arithmetic-subsequence/) | 🟡 Medium  | DP on difference |
| [Longest String Chain](https://leetcode.com/problems/longest-string-chain/)                     | 🟡 Medium  | DP on strings    |
| [Wiggle Subsequence](https://leetcode.com/problems/wiggle-subsequence/)                         | 🟡 Medium  | DP alternating   |
