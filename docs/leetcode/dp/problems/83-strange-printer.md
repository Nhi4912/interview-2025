---
layout: page
title: "Strange Printer"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/strange-printer"
---

# Strange Printer / Máy In Kỳ Lạ

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) | [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như sơn một bức tường — máy in mỗi lượt in một ký tự liên tiếp trên toàn đoạn, đoạn sau có thể ghi đè đoạn trước. Nếu hai ký tự ở hai đầu bằng nhau, ta có thể "gộp" chúng vào một lần in — tiết kiệm được một lượt.

**Pattern Recognition:**

- Signal: "minimum operations on substrings with merging when endpoints match" → **Interval DP**
- `dp[i][j]` = số lần in tối thiểu để hoàn thành `s[i..j]`
- Key transition: nếu `s[k] == s[j]` với k ∈ [i, j-1], ta có thể in s[k] và s[j] cùng lúc

**Visual — Interval DP for s = "aaabbb":**

```
dp[i][i] = 1 for all i (single char = 1 turn)

dp[0][1]='aa': s[0]==s[1] → dp[0][0]+0 = 1  (extend 'a' to cover both)
dp[0][2]='aaa': = 1  (one 'aaa' print)
dp[3][5]='bbb': = 1  (one 'bbb' print)
dp[0][5]='aaabbb': dp[0][4]+1 = 3? No.
  k=3: s[3]='b'≠s[5]='b'? Actually s[3]='b'=s[5]='b' → dp[0][3]+dp[4][4] = 2+1 = 3?
  Best: dp[0][2]+dp[3][5] via split = 1+1 = 2 ✓
```

---

## Problem Description

A strange printer can print a sequence of **same characters** at once on any substring, overwriting whatever was there. Return the **minimum number of turns** to print string `s`. ([LeetCode 664](https://leetcode.com/problems/strange-printer))

**Example 1:** `s="aaabbb"` → `2` (print 'aaa' then 'bbb')

**Example 2:** `s="aba"` → `2` (print 'aaa' then overprint middle with 'b')

Constraints: `1 <= s.length <= 100`

---

## 📝 Interview Tips

1. **Recognize interval DP**: "Tối ưu trên đoạn con → dp[i][j], tính từ đoạn ngắn đến đoạn dài" / Optimize over substrings → compute shorter intervals first
2. **Base case**: "dp[i][i] = 1 (mỗi ký tự đơn cần 1 lần in)" / Single character always needs 1 turn
3. **Key transition**: "dp[i][j] = dp[i][j-1] + 1 mặc định, nhưng nếu s[k]==s[j] thì dp[i][j] = min(dp[i][k]+dp[k+1][j-1])" / When s[k]==s[j], merge prints of s[k] and s[j]
4. **Why merge saves**: "Khi in s[k], mở rộng đến s[j] miễn phí vì cùng ký tự; sau đó chỉ in s[k+1..j-1]" / Extending the print of s[k] to cover s[j] costs 0 extra
5. **Degenerate case**: "dp[k+1][j-1] = 0 khi k+1 > j-1 (khoảng rỗng)" / Empty range has cost 0
6. **Fill order**: "Tính theo độ dài đoạn tăng dần: len=1,2,...,n" / Fill by increasing substring length

---

## Solutions

```typescript
/**
 * Solution 1: Interval DP — bottom-up by length
 * Time: O(n^3) — three nested loops over interval bounds
 * Space: O(n^2) — dp table
 */
function strangePrinter(s: string): number {
  const n = s.length;

  // dp[i][j] = min turns to print s[i..j]
  // dp[i][j] = 0 when i > j (empty range)
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // Fill by increasing substring length
  for (let i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (let j = i + 1; j < n; j++) {
      // Default: print s[j] separately
      dp[i][j] = dp[i][j - 1] + 1;

      // Try merging: if s[k] == s[j], print s[k] and s[j] together
      for (let k = i; k < j; k++) {
        if (s[k] === s[j]) {
          const mid = k + 1 <= j - 1 ? dp[k + 1][j - 1] : 0;
          dp[i][j] = Math.min(dp[i][j], dp[i][k] + mid);
        }
      }
    }
  }

  return dp[0][n - 1];
}

/**
 * Solution 2: Memoized recursion — top-down for clarity
 * Time: O(n^3) — O(n^2) states × O(n) transition
 * Space: O(n^2) — memoization table
 */
function strangePrinterMemo(s: string): number {
  const n = s.length;
  const memo: number[][] = Array.from({ length: n }, () => new Array(n).fill(-1));

  function dp(i: number, j: number): number {
    if (i > j) return 0;
    if (i === j) return 1;
    if (memo[i][j] !== -1) return memo[i][j];

    let res = dp(i, j - 1) + 1; // print s[j] as new turn
    for (let k = i; k < j; k++) {
      if (s[k] === s[j]) {
        res = Math.min(res, dp(i, k) + dp(k + 1, j - 1));
      }
    }
    return (memo[i][j] = res);
  }

  return dp(0, n - 1);
}

// === Test Cases ===
console.log(strangePrinter("aaabbb")); // 2
console.log(strangePrinter("aba")); // 2
console.log(strangePrinter("a")); // 1
console.log(strangePrinter("abcba")); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                    | Difficulty | Pattern          |
| ------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| [Strange Printer II](https://leetcode.com/problems/strange-printer-ii)                     | 🔴 Hard    | Topological Sort |
| [Burst Balloons](https://leetcode.com/problems/burst-balloons)                             | 🔴 Hard    | Interval DP      |
| [Minimum Cost to Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones) | 🔴 Hard    | Interval DP      |
| [Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii)     | 🔴 Hard    | DP               |
| [Interleaving String](https://leetcode.com/problems/interleaving-string)                   | 🟡 Medium  | 2D DP            |
