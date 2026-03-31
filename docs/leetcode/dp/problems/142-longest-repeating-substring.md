---
layout: page
title: "Longest Repeating Substring"
difficulty: Medium
category: Dynamic Programming
tags: [String, Binary Search, Dynamic Programming, Rolling Hash, Suffix Array]
leetcode_url: "https://leetcode.com/problems/longest-repeating-substring"
---

# Longest Repeating Substring / Chuỗi Con Lặp Dài Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DP Matrix / Binary Search + Rolling Hash

## 🧠 Intuition

**VI:** Giống bài LCS nhưng so sánh chuỗi với chính nó (không so `s[i]` với `s[i]`). Dùng ma trận DP `dp[i][j]` = độ dài chuỗi con chung kết tại `s[i-1]` và `s[j-1]`, với điều kiện `i ≠ j`.

```
s = "abcabc"

dp[i][j] = length of longest common substring ending at s[i-1] and s[j-1], i≠j

     ""  a   b   c   a   b   c
""    0   0   0   0   0   0   0
 a    0   0   0   0   1   0   0
 b    0   0   0   0   0   2   0
 c    0   0   0   0   0   0   3  ← ans = 3 ("abc")
 a    0   1   0   0   0   0   0
 b    0   0   2   0   1   0   0
 c    0   0   0   3   0   2   0

Only cells where i≠j contribute (diagonal i==j excluded)
```

## 📝 Interview Tips

- 🔑 **EN:** Key constraint: `i ≠ j` — same index positions must not overlap | **VI:** Điều kiện quan trọng: `i ≠ j` để tránh so sánh cùng vị trí trong chuỗi
- 🔑 **EN:** Binary search + rolling hash is O(n log n) — better for large inputs | **VI:** Binary search + hash tốt hơn khi n lớn (O(n log n) vs O(n²))
- 🔑 **EN:** DP approach: `dp[i][j] = dp[i-1][j-1] + 1` when `s[i-1]===s[j-1] && i≠j` | **VI:** Transition giống common subarray nhưng thêm ràng buộc `i≠j`
- 🔑 **EN:** Binary search monotonicity: if length L exists, length L-1 also exists | **VI:** Tính đơn điệu: nếu L hợp lệ thì L-1 cũng hợp lệ → binary search được
- 🔑 **EN:** Rolling hash: build set of hashes for length L, check duplicates | **VI:** Hash chuỗi con: dùng set để phát hiện chuỗi con trùng nhau
- 🔑 **EN:** Suffix Array + LCP is O(n log n) optimal but complex for interviews | **VI:** Suffix Array là O(n log n) tối ưu nhưng phức tạp khi implement

## Solutions

```typescript
// ─── Solution 1: DP Matrix — O(n²) time, O(n²) space ─────────────────────
function longestRepeatingSubstringDP(s: string): number {
  const n = s.length;
  // dp[i][j] = common substring length ending at s[i-1] and s[j-1]
  // Only valid when i !== j (positions must differ)
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  let ans = 0;

  for (let i = 1; i <= n; i++) {
    for (let j = i + 1; j <= n; j++) {
      // j > i ensures non-overlapping prefix
      if (s[i - 1] === s[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        ans = Math.max(ans, dp[i][j]);
      }
    }
  }
  return ans;
}

// ─── Solution 2: Binary Search + Rolling Hash — O(n log n) ────────────────
function longestRepeatingSubstring(s: string): number {
  const n = s.length;
  const MOD = 1_000_000_007n,
    BASE = 31n;

  // Check if any substring of length `len` appears at least twice
  function hasRepeat(len: number): boolean {
    let h = 0n,
      pow = 1n;
    const codes = Array.from(s, (ch) => BigInt(ch.charCodeAt(0) - 96));

    for (let i = 0; i < len; i++) {
      h = (h * BASE + codes[i]) % MOD;
      if (i > 0) pow = (pow * BASE) % MOD;
    }
    const seen = new Set<bigint>([h]);

    for (let i = len; i < n; i++) {
      h = (h - ((codes[i - len] * pow) % MOD) + MOD) % MOD;
      h = (h * BASE + codes[i]) % MOD;
      if (seen.has(h)) return true;
      seen.add(h);
    }
    return false;
  }

  let lo = 0,
    hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (hasRepeat(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// ─── Tests ─────────────────────────────────────────────────────────────────
console.log(longestRepeatingSubstring("abcabc")); // 3  ("abc")
console.log(longestRepeatingSubstring("aabcaabdaab")); // 3  ("aab")
console.log(longestRepeatingSubstring("aaaaa")); // 4  ("aaaa")
console.log(longestRepeatingSubstringDP("abcabc")); // 3
console.log(longestRepeatingSubstringDP("aaaaa")); // 4
```

## 🔗 Related Problems

| #    | Title                               | Difficulty | Connection                             |
| ---- | ----------------------------------- | ---------- | -------------------------------------- |
| 1044 | Longest Duplicate Substring         | 🔴 Hard    | Same problem without length constraint |
| 718  | Maximum Length of Repeated Subarray | 🟡 Medium  | Two separate arrays instead of one     |
| 1143 | Longest Common Subsequence          | 🟡 Medium  | Subsequence variant (allows gaps)      |
| 187  | Repeated DNA Sequences              | 🟡 Medium  | Fixed-length rolling hash for repeats  |
