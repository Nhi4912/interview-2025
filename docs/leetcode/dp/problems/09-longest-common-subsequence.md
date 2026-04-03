---
layout: page
title: "Longest Common Subsequence"
difficulty: Medium
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/longest-common-subsequence/"
leetcode_number: 1143
pattern: "2D DP (classic subsequence)"
frequency_tier: 2
companies: [Google, Amazon, Microsoft, Oracle]
target_time_minutes: 25
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Longest Common Subsequence / Dãy Con Chung Dài Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: 2D DP
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Edit Distance](./07-edit-distance.md) | [Longest Increasing Subsequence](./06-longest-increasing-subsequence.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giả sử bạn có hai bản thảo truyện và muốn tìm đoạn cốt truyện chung dài nhất giữa hai bản — không cần liên tiếp, chỉ cần cùng thứ tự xuất hiện. Thay vì so sánh toàn bộ, bạn xây một bảng so sánh từng cặp ký tự và điền dần: nếu hai ký tự trùng nhau, ta kế thừa từ góc trên-trái cộng 1; nếu không, ta lấy max từ ô trên hoặc ô trái.

**Pattern Recognition:**

- Signal: "two strings", "common subsequence", "length of longest" → **2D DP table**
- Subproblem: `dp[i][j]` = LCS length of `text1[0..i-1]` and `text2[0..j-1]`
- Recurrence: match → `dp[i-1][j-1] + 1`; no match → `max(dp[i-1][j], dp[i][j-1])`

**Visual — text1 = "abcde", text2 = "ace":**

```
      ""  a  c  e
  ""   0  0  0  0
  a    0  1  1  1    'a'=='a' → dp[0][0]+1=1
  b    0  1  1  1    'b'!='a' → max(dp[1][1], dp[2][0])=1
  c    0  1  2  2    'c'=='c' → dp[2][1]+1=2
  d    0  1  2  2    'd'!='c' → max(dp[3][2], dp[4][1])=2
  e    0  1  2  3    'e'=='e' → dp[4][2]+1=3  ✅
```

---

## Problem Description

Given two strings `text1` and `text2`, return the **length** of their longest common subsequence. A subsequence preserves relative order but doesn't need to be contiguous. Return 0 if none exists.

```
Example 1: text1="abcde", text2="ace"  → 3   (LCS = "ace")
Example 2: text1="abc",   text2="abc"  → 3   (LCS = "abc")
Example 3: text1="abc",   text2="def"  → 0   (no common characters)
```

Constraints:

- `1 <= text1.length, text2.length <= 1000`
- Both strings contain only lowercase English letters

---

## 📝 Interview Tips

1. **Clarify**: Return length or the actual subsequence string? / Trả về độ dài hay chuỗi thực tế?
2. **Brute force**: Đệ quy thuần — thử tất cả cặp (i, j) không memo. O(2^(m+n)) time — quá chậm, chỉ dùng để giải thích tư duy.
3. **Optimize**: 2D DP bottom-up — fill `dp[i][j]` từ (0,0) đến (m,n). O(m·n) time, O(m·n) space.
4. **Space optimize**: Chỉ cần 2 rows (prev + curr) → O(min(m,n)) space — đề cập nếu interviewer hỏi follow-up.
5. **Edge cases**: No common chars → return 0; identical strings → return full length; single char strings.
6. **Follow-up**: Return actual LCS string — backtrack qua dp table từ `[m][n]` về `[0][0]` theo chiều match/non-match.

---

## Solutions

```typescript

/**

- Solution 1: Recursion with Memoization (Top-Down)
- Time: O(m·n) — each (i,j) pair computed exactly once
- Space: O(m·n) — memo map + O(m+n) recursion stack
  */
  function lcsTopDown(text1: string, text2: string): number {
  const memo = new Map<string, number>();

function dfs(i: number, j: number): number {
if (i >= text1.length || j >= text2.length) return 0;
const key = `${i},${j}`;
if (memo.has(key)) return memo.get(key)!;

    const result = text1[i] === text2[j]
      ? 1 + dfs(i + 1, j + 1)
      : Math.max(dfs(i + 1, j), dfs(i, j + 1));

    memo.set(key, result);
    return result;

}

return dfs(0, 0);
}

/**

- Solution 2: DP Bottom-Up 2D Table (Optimal — interview standard)
- Time: O(m·n) — fill entire table
- Space: O(m·n) — dp table; reducible to O(n) with rolling 1D array
  */
  function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;
  // dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

for (let i = 1; i <= m; i++) {
for (let j = 1; j <= n; j++) {
if (text1[i - 1] === text2[j - 1]) {
dp[i][j] = dp[i - 1][j - 1] + 1; // characters match → extend LCS
} else {
dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // take best excluding one
}
}
}

return dp[m][n];
}

// === Test Cases ===
console.log(longestCommonSubsequence("abcde", "ace")); // 3
console.log(longestCommonSubsequence("abc", "abc")); // 3
console.log(longestCommonSubsequence("abc", "def")); // 0
console.log(longestCommonSubsequence("bl", "yby")); // 1

```

---

## 🔗 Related Problems

- [Edit Distance](./07-edit-distance.md) — 2D DP with insert/delete/replace operations
- [Longest Increasing Subsequence](./06-longest-increasing-subsequence.md) — 1D DP on single sequence
- [Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/) — count occurrences of LCS
- [Shortest Common Supersequence](https://leetcode.com/problems/shortest-common-supersequence/) — build string using LCS result
