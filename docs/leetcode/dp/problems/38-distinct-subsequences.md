---
layout: page
title: "Distinct Subsequences"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/distinct-subsequences"
---

# Distinct Subsequences / Đếm Xâu Con Riêng Biệt

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: 2D DP (String Matching)
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Edit Distance](https://leetcode.com/problems/edit-distance) | [Interleaving String](https://leetcode.com/problems/interleaving-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đếm số cách chọn nhân viên từ danh sách dài để tạo ra một nhóm cố định — mỗi lần chọn người ở vị trí i thì có thể dùng hoặc bỏ qua họ, và kết quả tích lũy từ các lựa chọn trước.

**Pattern Recognition:**

- Signal: "count distinct ways" + "two strings" + "subsequence" → **2D String DP**
- `dp[i][j]` = số cách tạo ra `t[0..j-1]` từ `s[0..i-1]`
- Key insight: Khi `s[i-1] == t[j-1]`, ta có thể match hoặc bỏ qua ký tự đó

**Visual — s="rabbbit", t="rabbit":**

```
     ""  r  a  b  b  i  t
""  [ 1  0  0  0  0  0  0 ]
r   [ 1  1  0  0  0  0  0 ]
a   [ 1  1  1  0  0  0  0 ]
b   [ 1  1  1  1  0  0  0 ]
b   [ 1  1  1  2  1  0  0 ]
b   [ 1  1  1  3  3  0  0 ]
i   [ 1  1  1  3  3  3  0 ]
t   [ 1  1  1  3  3  3  3 ]  ← answer = 3
```

---

## Problem Description

Given strings `s` and `t`, return the number of distinct subsequences of `s` which equals `t`. A subsequence is formed by deleting some (or no) elements from `s` without changing the relative order. ([LeetCode 115](https://leetcode.com/problems/distinct-subsequences))

- Example 1: `s="rabbbit", t="rabbit"` → `3` (three ways to remove one 'b')
- Example 2: `s="babgbag", t="bag"` → `5`

Constraints: `1 ≤ s.length ≤ 1000`, `1 ≤ t.length ≤ 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Có cần đường dẫn cụ thể không hay chỉ count?" / Just count or enumerate all subsequences?
2. **Brute force**: "Thử mọi subset của s, check xem có bằng t không" / Try all subsets of s — O(2^n)
3. **State**: "`dp[i][j]` = cách dùng `s[0..i-1]` tạo `t[0..j-1]`" / Mismatch → skip s[i-1]; match → skip OR use it
4. **Transition**: "Nếu ký tự match: `dp[i][j] = dp[i-1][j] + dp[i-1][j-1]`, không match: `dp[i][j] = dp[i-1][j]`" / Two choices on match
5. **Space opt**: "Chỉ cần row trước → dùng 1D array, đi từ phải sang trái" / Roll to 1D array
6. **Overflow**: "Answer có thể rất lớn — TypeScript number đủ cho n≤1000" / No BigInt needed here

---

## Solutions

```typescript
/**
 * Solution 1: Recursion + Memoization (Top-Down)
 * Time: O(m*n) — m=s.length, n=t.length
 * Space: O(m*n) — memo table
 */
function distinctSubsequencesMemo(s: string, t: string): number {
  const memo = new Map<string, number>();

  function dp(i: number, j: number): number {
    if (j === 0) return 1; // matched all of t
    if (i === 0) return 0; // exhausted s, t not empty
    const key = `${i},${j}`;
    if (memo.has(key)) return memo.get(key)!;

    let res = dp(i - 1, j); // always skip s[i-1]
    if (s[i - 1] === t[j - 1]) {
      res += dp(i - 1, j - 1); // also use s[i-1] to match t[j-1]
    }
    memo.set(key, res);
    return res;
  }

  return dp(s.length, t.length);
}

/**
 * Solution 2: Bottom-Up DP with Space Optimization
 * Time: O(m*n)
 * Space: O(n) — single row rolling array
 */
function distinctSubsequences(s: string, t: string): number {
  const m = s.length,
    n = t.length;
  // dp[j] = ways to form t[0..j-1] from s processed so far
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; // empty t is always matched

  for (let i = 1; i <= m; i++) {
    // Traverse right-to-left to avoid using s[i-1] twice
    for (let j = n; j >= 1; j--) {
      if (s[i - 1] === t[j - 1]) {
        dp[j] += dp[j - 1];
      }
    }
  }

  return dp[n];
}

// === Test Cases ===
console.log(distinctSubsequences("rabbbit", "rabbit")); // 3
console.log(distinctSubsequences("babgbag", "bag")); // 5
console.log(distinctSubsequences("a", "b")); // 0
console.log(distinctSubsequences("aaa", "aa")); // 3
```

---

## 🔗 Related Problems

- [Edit Distance](https://leetcode.com/problems/edit-distance) — cùng dạng 2D string DP, thêm insert/delete/replace
- [Interleaving String](https://leetcode.com/problems/interleaving-string) — 2D DP khớp hai chuỗi nguồn
- [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence) — dạng LCS cơ bản
- [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) — pattern matching với wildcard
- [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences) — variant nhiều pattern
