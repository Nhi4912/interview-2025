---
layout: page
title: "Interleaving String"
difficulty: Medium
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/interleaving-string"
---

# Interleaving String / Chuỗi Xen Kẽ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: 2D DP — String Matching
> **Frequency**: 📘 Tier 2 — Gặp ở Google, Amazon; bài 2D DP kinh điển với 3 chuỗi
> **See also**: [Edit Distance](https://leetcode.com/problems/edit-distance) | [Wildcard Matching](https://leetcode.com/problems/wildcard-matching)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng hai hàng xe đang nhập vào một làn — mỗi xe từ hàng 1 hoặc hàng 2 vào theo thứ tự ban đầu của hàng đó. Câu hỏi: có thể nhập xe để tạo ra đúng chuỗi xe s3 không? DP track trạng thái `(đã dùng i ký tự của s1, đã dùng j ký tự của s2)`.

- **Pattern Recognition:**
  - `dp[i][j]` = có thể tạo `s3[0..i+j-1]` từ `s1[0..i-1]` xen kẽ `s2[0..j-1]`
  - Transition: `dp[i][j] = (dp[i-1][j] && s1[i-1]==s3[i+j-1]) || (dp[i][j-1] && s2[j-1]==s3[i+j-1])`
  - Base case: `dp[0][0] = true`, `dp[i][0] = s1[0..i-1] == s3[0..i-1]`
  - Optimize: rolling 1D array vì `dp[i][j]` chỉ phụ thuộc `dp[i-1][j]` và `dp[i][j-1]`

- **Visual — s1="aab", s2="axy", s3="aaxaby":**
  ```
        ""   a    x    y
  ""  [ T    F    F    F ]
  a   [ T    T    F    F ]
  a   [ F    T    T    F ]
  b   [ F    F    T*   F ]
  *T: s3="aaxaby"[4]='b', từ dp[2][2] + s1[2]='b'=='b' → T ✅
  Đáp án = dp[3][3] = ...
  ```

## Problem Description

Cho ba chuỗi `s1`, `s2`, `s3`, kiểm tra xem `s3` có được tạo thành bởi **xen kẽ** `s1` và `s2` hay không (giữ nguyên thứ tự tương đối của ký tự trong mỗi chuỗi gốc).

| Input                                     | Output  | Giải thích    |
| ----------------------------------------- | ------- | ------------- |
| `s1="aabcc", s2="dbbca", s3="aadbbcbcac"` | `true`  | Có thể xen kẽ |
| `s1="aabcc", s2="dbbca", s3="aadbbbaccc"` | `false` | Không thể     |
| `s1="", s2="", s3=""`                     | `true`  | Cả ba rỗng    |

## 📝 Interview Tips

- 🇻🇳 Bước đầu tiên: kiểm tra `len(s1)+len(s2) != len(s3)` → return false ngay / 🇬🇧 _First check: if len(s1)+len(s2) ≠ len(s3) → false immediately_
- 🇻🇳 `dp[i][j]` không phải "prefix match" mà là "feasibility" — có tồn tại cách xen kẽ hợp lệ / 🇬🇧 _dp[i][j] is a feasibility question, not a value — true/false whether interleaving is possible_
- 🇻🇳 1D rolling: `dp[j]` tương ứng với `dp[i][j]`, cập nhật từ trái sang phải, dùng lại từ row trước / 🇬🇧 _1D rolling: dp[j] represents current row's dp[i][j] — reuse previous row values naturally_
- 🇻🇳 Brute force O(2^(n+m)) để giải thích trực quan trước khi chuyển sang DP / 🇬🇧 _Mention brute force recursion O(2^(n+m)) first to build intuition, then memoize_

## Solutions

```typescript
/**
 * Solution 1: Recursive Brute Force (Intuition Builder)
 * Tại mỗi bước: dùng ký tự tiếp theo của s1 HOẶC s2.
 * Không hiệu quả nhưng thể hiện rõ cấu trúc bài toán.
 *
 * @time O(2^(n+m)) — mỗi bước có 2 lựa chọn
 * @space O(n+m) — stack depth
 */
function isInterleaveBrute(s1: string, s2: string, s3: string): boolean {
  if (s1.length + s2.length !== s3.length) return false;

  function dfs(i: number, j: number): boolean {
    if (i === s1.length && j === s2.length) return true;
    const k = i + j;
    const takeS1 = i < s1.length && s1[i] === s3[k] && dfs(i + 1, j);
    const takeS2 = j < s2.length && s2[j] === s3[k] && dfs(i, j + 1);
    return takeS1 || takeS2;
  }

  return dfs(0, 0);
}

/**
 * Solution 2: 2D DP Table — Bottom-Up
 * dp[i][j] = true nếu s3[0..i+j-1] là interleaving của s1[0..i-1] và s2[0..j-1].
 *
 * @time O(n*m) — n=len(s1), m=len(s2)
 * @space O(n*m) — bảng DP 2D
 */
function isInterleave(s1: string, s2: string, s3: string): boolean {
  const m = s1.length;
  const n = s2.length;
  if (m + n !== s3.length) return false;

  // dp[i][j]: s3[0..i+j-1] có thể tạo từ s1[0..i-1] xen kẽ s2[0..j-1]
  const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;

  // Base: chỉ dùng s1 (j=0)
  for (let i = 1; i <= m; i++) {
    dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];
  }
  // Base: chỉ dùng s2 (i=0)
  for (let j = 1; j <= n; j++) {
    dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const k = i + j - 1;
      dp[i][j] =
        (dp[i - 1][j] && s1[i - 1] === s3[k]) || // lấy từ s1
        (dp[i][j - 1] && s2[j - 1] === s3[k]); // lấy từ s2
    }
  }

  return dp[m][n];
}

console.log(isInterleave("aabcc", "dbbca", "aadbbcbcac")); // true
console.log(isInterleave("aabcc", "dbbca", "aadbbbaccc")); // false
console.log(isInterleave("", "", "")); // true
console.log(isInterleave("a", "", "a")); // true

/**
 * Solution 3: 1D Rolling DP — Space Optimized
 * Chỉ cần 1 row vì dp[i][j] phụ thuộc dp[i-1][j] (row trên) và dp[i][j-1] (trái).
 * Row trên = giá trị dp[j] chưa cập nhật từ iteration trước.
 *
 * @time O(n*m) — cùng độ phức tạp
 * @space O(m) — chỉ 1 array kích thước m+1
 */
function isInterleave1D(s1: string, s2: string, s3: string): boolean {
  const m = s1.length;
  const n = s2.length;
  if (m + n !== s3.length) return false;

  // dp[j] tương ứng với dp[current_i][j]
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;

  // Khởi tạo row 0: chỉ dùng s2
  for (let j = 1; j <= n; j++) {
    dp[j] = dp[j - 1] && s2[j - 1] === s3[j - 1];
  }

  for (let i = 1; i <= m; i++) {
    // dp[0] cho row i: chỉ dùng s1[0..i-1]
    dp[0] = dp[0] && s1[i - 1] === s3[i - 1];

    for (let j = 1; j <= n; j++) {
      const k = i + j - 1;
      dp[j] =
        (dp[j] && s1[i - 1] === s3[k]) || // dp[i-1][j]: row trên (chưa overwrite)
        (dp[j - 1] && s2[j - 1] === s3[k]); // dp[i][j-1]: đã cập nhật ở bước trước
    }
  }

  return dp[n];
}

console.log(isInterleave1D("aabcc", "dbbca", "aadbbcbcac")); // true
console.log(isInterleave1D("aabcc", "dbbca", "aadbbbaccc")); // false
console.log(isInterleave1D("", "", "")); // true
```

## 🔗 Related Problems

| Problem                                                                                      | Pattern      | Difficulty |
| -------------------------------------------------------------------------------------------- | ------------ | ---------- |
| [72. Edit Distance](https://leetcode.com/problems/edit-distance)                             | 2D String DP | 🔴 Hard    |
| [44. Wildcard Matching](https://leetcode.com/problems/wildcard-matching)                     | 2D DP        | 🔴 Hard    |
| [10. Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching) | 2D DP        | 🔴 Hard    |
| [1143. Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence) | 2D String DP | 🟡 Medium  |
