---
layout: page
title: "Shortest Common Supersequence"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/shortest-common-supersequence"
---

# Shortest Common Supersequence / Chuỗi Siêu Ngắn Nhất Chung

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) | [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses)

---

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Như hợp nhất hai hàng đợi — giữ nguyên thứ tự của cả hai. Các ký tự chung (LCS) chỉ xuất hiện một lần; các ký tự không chung xen kẽ.

```
str1 = "abac", str2 = "cab"
LCS  = "ab"  (length 2)
SCS  = "cabac" (length 5 = 4+3-2)

Reconstruction via LCS table:
     ""  c  a  b
  ""  0  1  2  3
  a   1  1  1  2
  b   2  2  2  1*  ← matched 'b'
  a   3  3  2  2
  c   4  3  3  3

Walk back: 'b' matched → keep once, 'a' matched → keep once,
           remaining 'c' from str2, 'a','c' from str1
→ "cabac"
```

**Key insight:** `|SCS| = |str1| + |str2| - |LCS|`. Build LCS DP table, then reconstruct SCS by tracing back: when chars match, include once; otherwise include the char from the string with larger remaining LCS.

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **SCS length formula**: `len(str1) + len(str2) - len(LCS)` / độ dài = tổng trừ LCS
- 🔑 **LCS DP**: `dp[i][j]` = LCS length of `str1[0..i)` and `str2[0..j)` / DP tiêu chuẩn LCS
- 🔑 **Reconstruction**: Walk `dp` from `[m][n]` back to `[0][0]` — match → include once, else include mismatched char / truy vết lùi
- 🔑 **When str1[i]==str2[j]**: Add char once and move both `i`, `j` back / ký tự chung thêm 1 lần
- 🔑 **When different**: Move in direction of larger `dp` value, prepend that char / đi theo hướng LCS lớn hơn
- 🔑 **Don't forget remaining**: After reaching `i=0` or `j=0`, append rest of other string / thêm phần còn lại

---

## Solutions / Giải Pháp

### Solution 1: LCS DP + Reconstruction (O(mn) time and space)

```typescript
/**
 * Shortest Common Supersequence — LCS-based DP
 *
 * 1. Compute LCS dp table (standard O(mn)).
 * 2. Reconstruct SCS by tracing back dp table:
 *    - If chars match: include once, move diagonally.
 *    - Else: include char from larger dp side, move that pointer back.
 * 3. Prepend any remaining characters from either string.
 *
 * Time:  O(m × n)
 * Space: O(m × n)
 */
function shortestCommonSupersequence(str1: string, str2: string): string {
  const m = str1.length,
    n = str2.length;

  // Build LCS dp table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Reconstruct SCS by tracing back
  const result: string[] = [];
  let i = m,
    j = n;
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      result.push(str1[i - 1]); // Common char: include once
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      result.push(str1[i - 1]); // Take from str1
      i--;
    } else {
      result.push(str2[j - 1]); // Take from str2
      j--;
    }
  }
  // Append remaining characters
  while (i > 0) {
    result.push(str1[i - 1]);
    i--;
  }
  while (j > 0) {
    result.push(str2[j - 1]);
    j--;
  }

  return result.reverse().join("");
}

console.log(shortestCommonSupersequence("abac", "cab")); // "cabac" (length 5)
console.log(shortestCommonSupersequence("aces", "abcde")); // "abcdes" (length 6)
console.log(shortestCommonSupersequence("abc", "abc")); // "abc" (length 3)
console.log(shortestCommonSupersequence("a", "b")); // "ab" (length 2)
```

### Solution 2: Length Only (O(mn) time, O(n) space)

```typescript
/**
 * Shortest Common Supersequence — Length Only
 *
 * If only the length is needed: |SCS| = m + n - |LCS|.
 * Space-optimized LCS with rolling array.
 *
 * Time:  O(m × n)
 * Space: O(n)
 */
function shortestCommonSupersequenceLen(str1: string, str2: string): number {
  const m = str1.length,
    n = str2.length;
  let prev = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    const curr = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    prev = curr;
  }

  const lcsLen = prev[n];
  return m + n - lcsLen;
}

console.log(shortestCommonSupersequenceLen("abac", "cab")); // 5
console.log(shortestCommonSupersequenceLen("aces", "abcde")); // 6
console.log(shortestCommonSupersequenceLen("abc", "abc")); // 3
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                            | Difficulty | Pattern |
| -------------------------------------------------------------------------------------------------- | ---------- | ------- |
| [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence)             | 🟡 Medium  | 2D DP   |
| [Edit Distance](https://leetcode.com/problems/edit-distance)                                       | 🟡 Medium  | 2D DP   |
| [Interleaving String](https://leetcode.com/problems/interleaving-string)                           | 🟡 Medium  | 2D DP   |
| [Delete Operation for Two Strings](https://leetcode.com/problems/delete-operation-for-two-strings) | 🟡 Medium  | LCS     |
