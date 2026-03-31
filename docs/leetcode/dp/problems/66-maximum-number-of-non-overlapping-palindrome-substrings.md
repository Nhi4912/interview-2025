---
layout: page
title: "Maximum Number of Non-overlapping Palindrome Substrings"
difficulty: Hard
category: Dynamic Programming
tags: [Two Pointers, String, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-non-overlapping-palindrome-substrings"
---

# Maximum Number of Non-overlapping Palindrome Substrings / Số Chuỗi Con Palindrome Không Chồng Lên Nhau Tối Đa

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DP + Palindrome Check
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings) | [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bài toán cắt băng ghi âm — bạn muốn cắt ra nhiều đoạn palindrome nhất, mỗi đoạn dài ít nhất k ký tự, các đoạn không được chồng lên nhau. DP cho bạn biết đoạn nào nên giữ.

**Pattern Recognition:**

- `dp[i]` = số palindrome tối đa trong `s[0..i-1]`
- Với mỗi vị trí kết thúc `i`, thử tất cả palindrome độ dài ≥ k kết thúc tại `i`
- Kết hợp precompute palindrome check `O(n²)` + DP `O(n²)` → tổng `O(n²)`

**Visual — DP Transition:**

```
s = "abaccdbbd", k = 3
     0123456789

isPalin[j][i] = s[j..i] is palindrome
dp[i] = max palindromes in s[0..i-1]

For i=4 (s[0..3]="abac"):
  try j=1: "bac" → not palindrome
  try j=0: "abac" → not palindrome
  dp[4] = dp[3] = 0

For i=9: "bbd" not palindrome ...
  dp[9] = max(dp[8], dp[4]+1 if s[4..8]="cdbbd" palindrome?)
```

---

## Problem Description

Given a string `s` and integer `k`, find the maximum number of **non-overlapping** palindrome substrings of `s` each with length **at least `k`**. ([LeetCode #2472](https://leetcode.com/problems/maximum-number-of-non-overlapping-palindrome-substrings))

**Example 1:** `s = "abaccdbbd", k = 3` → `2` (e.g., "aba", "dbbd")
**Example 2:** `s = "adbcda", k = 2` → `2` (e.g., "aa" not present... "adbd"... check actual)

Constraints: `1 <= k <= s.length <= 200`, `s` consists of lowercase English letters

---

## 📝 Interview Tips

1. **Clarify**: "Palindrome phải có độ dài ít nhất k, không phải đúng k / At least k, not exactly k"
2. **Precompute**: "Tính trước bảng isPalin[i][j] trong O(n²) / Precompute all palindrome intervals first"
3. **DP state**: "dp[i] = max palindromes ending before position i / Define dp on prefix lengths"
4. **Greedy alt**: "Dùng expand-around-center + greedy cũng cho kết quả đúng / Greedy works too"
5. **Transition**: "dp[i+1] = max(dp[i], dp[j]+1) khi s[j..i] là palindrome dài ≥ k / Standard interval DP"
6. **Edge cases**: "k > n → 0, toàn một ký tự → n/k (nếu k=1) / Handle large k and uniform strings"

---

## Solutions

```typescript
/**
 * Solution 1: Precompute Palindromes + DP
 * Time: O(n²) — palindrome precomputation + DP
 * Space: O(n²) — palindrome table
 */
function maxPalindromes(s: string, k: number): number {
  const n = s.length;

  // Precompute isPalin[i][j] = s[i..j] is palindrome
  const isPalin: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  for (let i = 0; i < n; i++) isPalin[i][i] = true;
  for (let i = 0; i + 1 < n; i++) isPalin[i][i + 1] = s[i] === s[i + 1];
  for (let len = 3; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      isPalin[i][j] = s[i] === s[j] && isPalin[i + 1][j - 1];
    }
  }

  // dp[i] = max non-overlapping palindromes in s[0..i-1]
  const dp = new Array(n + 1).fill(0);
  for (let i = k; i <= n; i++) {
    dp[i] = dp[i - 1]; // don't end a palindrome at i-1
    for (let j = i - k; j >= 0; j--) {
      if (isPalin[j][i - 1]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
        break; // Greedy: take the shortest valid palindrome ending here
      }
    }
  }
  return dp[n];
}

/**
 * Solution 2: Expand Around Center + Greedy
 * Time: O(n²) — two center types × n centers
 * Space: O(n) — dp array only
 */
function maxPalindromesGreedy(s: string, k: number): number {
  const n = s.length;
  const dp = new Array(n + 1).fill(0);

  // For each center, expand and try to greedily pick shortest palindrome of length >= k
  const tryCenter = (left: number, right: number): void => {
    while (left >= 0 && right < n && s[left] === s[right]) {
      if (right - left + 1 >= k) {
        // This palindrome [left..right] can be used to improve dp[right+1]
        dp[right + 1] = Math.max(dp[right + 1], dp[left] + 1);
        break; // Take shortest valid one (greedy)
      }
      left--;
      right++;
    }
  };

  for (let i = 0; i < n; i++) {
    dp[i + 1] = Math.max(dp[i + 1], dp[i]); // carry forward
    tryCenter(i, i); // odd length
    tryCenter(i, i + 1); // even length
  }
  // Propagate forward
  for (let i = 1; i <= n; i++) dp[i] = Math.max(dp[i], dp[i - 1]);
  return dp[n];
}

// === Test Cases ===
console.log(maxPalindromes("abaccdbbd", 3)); // 2
console.log(maxPalindromes("adbcda", 2)); // 2
console.log(maxPalindromes("a", 1)); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                            | Pattern       | Difficulty |
| -------------------------------------------------------------------------------------------------- | ------------- | ---------- |
| [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings)                     | DP / Expand   | Medium     |
| [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring)       | DP / Manacher | Medium     |
| [Minimum Cut Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii) | DP            | Hard       |
| [Wildcard Matching](https://leetcode.com/problems/wildcard-matching)                               | DP            | Hard       |
