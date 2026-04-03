---
layout: page
title: "Minimum Insertion Steps to Make a String Palindrome"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome"
---

# Minimum Insertion Steps to Make a String Palindrome / Số Bước Chèn Tối Thiểu Để Tạo Palindrome

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Interval DP / LPS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) | [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như gấp tờ giấy — để chuỗi thành palindrome, bạn "gấp" hai đầu vào giữa. Mỗi cặp ký tự không khớp cần 1 lần chèn. Số lần chèn = `n - LPS(s)` (chiều dài Palindromic Subsequence dài nhất).

**Pattern Recognition:**

- Method 1: `n - LPS(s)` — số ký tự không thuộc LPS cần chèn thêm
- Method 2: Interval DP — `dp[i][j]` = số chèn tối thiểu để `s[i..j]` thành palindrome

```
s = "mbadm", n=5

LPS("mbadm") = "madam" = 3... wait:
LPS = "mdm" length 3? or "mam"? Let me check:
  s = m,b,a,d,m → LPS = "mam" (indices 0,2,4) or "mdm" (0,3,4) → length 3

Interval DP:
dp[i][j]:
  s="m"→0, s="b"→0, s="a"→0, s="d"→0, s="m"→0 (base: single char)
  s="mb"→1, s="ba"→1, s="ad"→1, s="dm"→1
  s="mba"→2(m≠a→min(dp[0][1],dp[1][2])+1=2), s="bad"→2, s="adm"→1(a≠m→min(1,1)+1=2?
  → s="adm": a≠m, dp[1][2]+1=2 or dp[0][1]+1=2 → 2)
  ...
  s="mbadm": m==m → dp[1][3]="bad"→2 → dp[0][4]=2
Answer = 2
```

---

## Problem Description / Mô Tả Bài Toán

Cho chuỗi `s`. Mỗi bước, có thể chèn một ký tự bất kỳ vào **bất kỳ vị trí** nào. Trả về **số bước tối thiểu** để `s` thành palindrome.

**Example 1:** `s="zzazz"` → `0` (đã là palindrome)
**Example 2:** `s="mbadm"` → `2`
**Example 3:** `s="leetcode"` → `5`

**Constraints:** `1 ≤ s.length ≤ 500`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Key insight: min insertions = n - LPS(s). The characters not in LPS each need one insertion to mirror.
   **VI:** Nhận thức chính: số chèn tối thiểu = n - LPS(s). Ký tự không trong LPS cần chèn 1 bản đối xứng.

2. **EN:** Interval DP: if s[i]==s[j], dp[i][j]=dp[i+1][j-1]; else dp[i][j]=min(dp[i+1][j], dp[i][j-1])+1.
   **VI:** Interval DP: s[i]==s[j] → dp[i+1][j-1]; else → min(dp[i+1][j], dp[i][j-1])+1.

3. **EN:** Both approaches are O(n²) time and space. The LPS-based approach is more elegant.
   **VI:** Cả hai đều O(n²) thời gian và không gian. Cách dùng LPS thanh lịch hơn.

4. **EN:** Space optimization: the interval DP can be space-optimized using 2 rows instead of full matrix.
   **VI:** Tối ưu không gian: interval DP có thể dùng 2 hàng thay vì ma trận đầy đủ.

5. **EN:** Edge cases: single char → 0, already palindrome → 0, "ab" → 1.
   **VI:** Edge: 1 ký tự → 0, palindrome sẵn → 0, "ab" → 1.

6. **EN:** The number of insertions = number of deletions = n - LPS = LCS(s, reverse(s)) distance.
   **VI:** Số chèn = số xóa = n - LPS = khoảng cách theo LCS(s, reverse(s)).

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: n - LPS (Longest Palindromic Subsequence) — O(n²) ───────────
// Minimum insertions = n - length of longest palindromic subsequence (LPS).
// LPS(s) = LCS(s, reverse(s))
function minInsertions_lps(s: string): number {
  const n = s.length;
  const rev = s.split("").reverse().join("");

  // Standard LCS dp
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === rev[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return n - dp[n][n]; // n - LPS length
}

// ─── Solution 2: Interval DP (direct) — O(n²) ────────────────────────────────
// dp[i][j] = min insertions to make s[i..j] a palindrome.
// Base: dp[i][i]=0 (single char), dp[i][i-1]=0 (empty string).
// Transition:
//   s[i]==s[j]: dp[i][j] = dp[i+1][j-1]
//   else:       dp[i][j] = min(dp[i+1][j], dp[i][j-1]) + 1
function minInsertions(s: string): number {
  const n = s.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // Fill by increasing length of substring
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      if (s[i] === s[j]) {
        dp[i][j] = dp[i + 1][j - 1]; // already matched, no insertion needed
      } else {
        dp[i][j] = Math.min(dp[i + 1][j], dp[i][j - 1]) + 1;
      }
    }
  }
  return dp[0][n - 1];
}

// ─── Solution 3: Interval DP with Space Optimization — O(n²) time, O(n) space ─
function minInsertions_space(s: string): number {
  const n = s.length;
  let dp = new Array(n).fill(0); // dp[j] represents dp[i][j]
  let prev = new Array(n).fill(0);

  for (let i = n - 2; i >= 0; i--) {
    prev = dp.slice();
    dp = new Array(n).fill(0);
    for (let j = i + 1; j < n; j++) {
      if (s[i] === s[j]) {
        dp[j] = j === i + 1 ? 0 : prev[j - 1]; // dp[i+1][j-1]
      } else {
        dp[j] = Math.min(prev[j], dp[j - 1]) + 1;
      }
    }
  }
  return dp[n - 1];
}

// ─── Tests ────────────────────────────────────────────────────────────────────
console.log(minInsertions("zzazz")); // 0  (already palindrome)
console.log(minInsertions("mbadm")); // 2
console.log(minInsertions("leetcode")); // 5
console.log(minInsertions("ab")); // 1
console.log(minInsertions_lps("mbadm")); // 2
console.log(minInsertions_lps("leetcode")); // 5
console.log(minInsertions_space("mbadm")); // 2
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                                                                                          | Difficulty | Pattern              |
| --- | ------------------------------------------------------------------------------------------------ | ---------- | -------------------- |
| 516 | [Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence) | 🟡 Medium  | Interval DP / LCS    |
| 647 | [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings)                   | 🟡 Medium  | Expand Around Center |
| 5   | [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring)     | 🟡 Medium  | DP / Manacher        |
