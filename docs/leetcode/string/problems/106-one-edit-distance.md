---
layout: page
title: "One Edit Distance"
difficulty: Medium
category: String
tags: [Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/one-edit-distance"
---

# One Edit Distance / Khoảng Cách Chỉnh Sửa Một Lần

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers + Case Analysis
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

## 🧠 Intuition / Tư Duy

> Giống như so sánh hai bản thảo của một câu — bạn đọc đồng thời từng ký tự. Khi gặp chỗ khác nhau đầu tiên, bạn kiểm tra: nếu thay thế một ký tự, hoặc chèn/xóa một ký tự, phần còn lại có giống nhau không? Chỉ có ba loại thao tác.

**Pattern Recognition:**

- Signal: "strings differ by exactly 1" → **Case Analysis on length diff**
- Nếu `|lenS - lenT| > 1` → luôn false
- Ba trường hợp: cùng độ dài (replace), dài hơn 1 (insert/delete)

**Visual:**

```
s="ab" t="acb"  |len diff|=1 → insert case
  i        j
  a  ==  a   → advance both
  b  !=  c   → skip j → check s[i..] == t[j+1..]
             → "b" == "b" ✓ → true

s="abc" t="abc" → same length, no diff → false (0 edits, not 1)
s="abc" t="abd" → replace at pos 2 → "ab"=="ab" ✓ → true
```

## Problem Description

Given two strings `s` and `t`, return `true` if they are exactly **one edit distance** apart (insert, delete, or replace one character), `false` otherwise. Note: identical strings return `false`.

- **Example 1**: `s = "ab"`, `t = "acb"` → `true` (insert `c` at index 1)
- **Example 2**: `s = ""`, `t = ""` → `false` (0 edits, not 1)

**Constraints**: `0 <= s.length, t.length <= 10^4`.

## 📝 Interview Tips

1. **Clarify**: "Chuỗi giống hệt nhau (0 edit) trả về false?" / Identical strings return false, not true
2. **Approach**: "Chia 3 case theo độ dài, xử lý từng case riêng" / Branch on length difference first
3. **Edge cases**: `s=""`, `t="a"` → true; `s=""`, `t="ab"` → false; `s=t` → false
4. **Optimize**: "Two pointers O(n) thay EditDistance O(n²)" / Avoid full DP — two pointer is O(n)
5. **Test**: `s="a", t="b"` → true (replace); `s="abc", t="bc"` → true (delete first)
6. **Follow-up**: "Tổng quát hóa cho k edits?" / Edit Distance DP for arbitrary k

## Solutions

```typescript
/** Solution 1: Full Edit Distance DP (overkill, chỉ check == 1)
 * Time: O(m·n) | Space: O(m·n)
 */
function isOneEditDistanceDP(s: string, t: string): boolean {
  const m = s.length,
    n = t.length;
  if (Math.abs(m - n) > 1) return false;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === t[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n] === 1;
}

/** Solution 2: Two Pointers — O(n) time O(1) space
 * Time: O(n) | Space: O(1)
 */
function isOneEditDistance(s: string, t: string): boolean {
  const m = s.length,
    n = t.length;
  if (Math.abs(m - n) > 1) return false;
  // Ensure s is the shorter (or equal) string
  if (m > n) return isOneEditDistance(t, s);

  for (let i = 0; i < m; i++) {
    if (s[i] !== t[i]) {
      if (m === n) {
        // Replace: rest must be identical
        return s.slice(i + 1) === t.slice(i + 1);
      } else {
        // Insert into s (delete from t): skip one char in t
        return s.slice(i) === t.slice(i + 1);
      }
    }
  }
  // All chars of s match prefix of t → valid only if t is exactly 1 longer
  return n - m === 1;
}

// Test cases
console.log(isOneEditDistance("ab", "acb")); // true (insert)
console.log(isOneEditDistance("", "")); // false (0 edits)
console.log(isOneEditDistance("", "a")); // true (insert)
console.log(isOneEditDistance("abc", "abd")); // true (replace)
console.log(isOneEditDistance("abc", "bc")); // true (delete first)
console.log(isOneEditDistance("abc", "abc")); // false (0 edits)
```

## 🔗 Related Problems

| Problem                                                                                                                                | Relationship                  |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| [Edit Distance](https://leetcode.com/problems/edit-distance)                                                                           | Generalized k-edit DP version |
| [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) | Two-pointer string comparison |
| [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence)                                                 | Edit distance family via DP   |
