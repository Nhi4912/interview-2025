---
layout: page
title: "Regular Expression Matching"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming, Recursion]
leetcode_url: "https://leetcode.com/problems/regular-expression-matching/"
---

# Regular Expression Matching / Khớp Biểu Thức Chính Quy

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DP (Top-Down Memoization + Bottom-Up)
> **Frequency**: 📘 Tier 1 — LC #10; iconic FAANG question; tests recursive thinking + DP conversion
> **See also**: [Maximum Product Subarray](./12-maximum-product-subarray.md) | [Wildcard Matching LC #44](https://leetcode.com/problems/wildcard-matching/)

## 🧠 Intuition / Tư Duy

- **Analogy:** Như thợ may đo quần áo theo mẫu (pattern). Dấu `.` là vải vạn năng khớp bất kỳ hình dạng. Dấu `*` cho phép dùng 0 hoặc nhiều lần mảnh vải phía trước — quan trọng: `*` không đứng một mình, luôn theo sau ký tự trước nó. Khi gặp `a*`, ta thử "bỏ qua hoàn toàn" hoặc "dùng ít nhất một lần và ở lại".

- **Pattern Recognition:**
  - Signal: pattern matching với wildcard → DP on (string_index, pattern_index)
  - Khi `p[j+1] == '*'`: hai lựa chọn — skip `x*` (dp(i, j+2)) hoặc match (dp(i+1, j) nếu khớp ký tự)
  - Khi không có `*`: phải match chính xác rồi tiến cả hai → `dp(i+1, j+1)`

- **Visual — s="aa", p="a\*" (kết quả: true):**

```
dp(i,j) = can s[i:] match p[j:]?

dp(0,0): p[0]='a', p[1]='*'  → star case
  Option A (skip a*):  dp(0,2) → j=2≥len(p)=2 → i=0<len(s)=2 → FALSE
  Option B (use once): firstMatch('a'=='a')=T, dp(1,0)
    → p[1]='*' still, try dp(1,2) → j≥len, i=1<2 → FALSE
    → use once more: dp(2,0)
      → dp(2,2) → j≥len, i=2==len → TRUE ✓

Answer: TRUE  (a* matched "aa")
```

## Problem Description

Given string `s` and pattern `p` with `.` (any single char) and `*` (zero or more of preceding), return `true` if `s` matches `p` **entirely**.

```
s="aa",  p="a"   → false  ("a" can't cover "aa")
s="aa",  p="a*"  → true   (a* = zero or more 'a')
s="ab",  p=".*"  → true   (.* = any chars, any count)
s="aab", p="c*a*b" → true (c*="", a*="aa", b="b")
```

## 📝 Interview Tips

1. **`*` không đứng một mình — luôn đi kèm ký tự trước: kiểm tra `p[j+1]=='*'` / `*` always pairs with preceding char: check `p[j+1]=='*'`**
2. **Hai nhánh của `*`: skip hoàn toàn (`dp(i, j+2)`) OR match và ở lại (`firstMatch && dp(i+1, j)`) / Two branches: skip x\* entirely OR consume one char and stay**
3. **Top-down memo vs bottom-up: cùng complexity, bottom-up thường nhanh hơn do không có overhead đệ quy / Both O(m×n); bottom-up avoids recursion overhead**
4. **Base case: `dp[m][n] = true` (cả hai hết) — fill từ bottom-right về top-left / Base: dp[m][n]=true; fill bottom-up from (m,n) toward (0,0)**
5. **Wildcard matching (LC #44) giống nhưng `*` match bất kỳ chuỗi, không phụ thuộc ký tự trước / LC #44 differs: `*` matches any sequence independently**
6. **Lỗi phổ biến: quên kiểm tra `i < s.length` trước khi so sánh `s[i]` / Common bug: check `i < m` before accessing `s[i]`**

## Solutions

{% raw %}
/\*\*

- Solution 1 — Top-Down Memoization
- Time: O(m×n) | Space: O(m×n) memo + O(m+n) stack
  \*/
  function isMatch(s: string, p: string): boolean {
  const m = s.length, n = p.length;
  const memo = new Map<string, boolean>();

function dp(i: number, j: number): boolean {
if (j >= n) return i >= m;
const key = `${i},${j}`;
if (memo.has(key)) return memo.get(key)!;

    const firstMatch = i < m && (p[j] === s[i] || p[j] === '.');

    let result: boolean;
    if (j + 1 < n && p[j + 1] === '*') {
      // Skip "x*" entirely OR match one char and stay at same pattern position
      result = dp(i, j + 2) || (firstMatch && dp(i + 1, j));
    } else {
      result = firstMatch && dp(i + 1, j + 1);
    }

    memo.set(key, result);
    return result;

}

return dp(0, 0);
}

/\*\*

- Solution 2 — Bottom-Up DP ✅ Recommended for interviews
- dp[i][j] = does s[i:] match p[j:]? Fill from (m,n) → (0,0)
- Time: O(m×n) | Space: O(m×n)
  \*/
  function isMatchDP(s: string, p: string): boolean {
  const m = s.length, n = p.length;
  const dp: boolean[][] = Array.from({ length: m + 1 }, () =>
  new Array(n + 1).fill(false)
  );
  dp[m][n] = true;

for (let i = m; i >= 0; i--) {
for (let j = n - 1; j >= 0; j--) {
const firstMatch = i < m && (p[j] === s[i] || p[j] === '.');

      if (j + 1 < n && p[j + 1] === '*') {
        dp[i][j] = dp[i][j + 2] || (firstMatch && dp[i + 1][j]);
      } else {
        dp[i][j] = firstMatch && dp[i + 1][j + 1];
      }
    }

}

return dp[0][0];
}

// ── inline tests ──
// isMatch("aa", "a") → false
// isMatch("aa", "a*") → true
// isMatch("ab", ".*") → true
// isMatch("aab", "c*a*b") → true
// isMatch("mississippi", "mis*is*p\*.") → false
{% endraw %}

## 🔗 Related Problems

- [LC #44 Wildcard Matching](https://leetcode.com/problems/wildcard-matching/) — `*` matches any sequence (simpler star semantics)
- [LC #72 Edit Distance](https://leetcode.com/problems/edit-distance/) — 2D DP on two strings
- [LC #1143 Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) — 2D string DP foundation
- [LC #97 Interleaving String](https://leetcode.com/problems/interleaving-string/) — similar (i,j) DP pattern
