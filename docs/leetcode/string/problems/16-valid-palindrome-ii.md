---
layout: page
title: "Valid Palindrome II"
difficulty: Easy
category: String
tags: [String, Two Pointers, Greedy]
leetcode_url: "https://leetcode.com/problems/valid-palindrome-ii/"
---

# Valid Palindrome II / Palindrome Hợp Lệ II

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers + One-Skip Greedy
> **Frequency**: 📗 Tier 2 — Meta's favorite phone screen; tests two-pointer fluency
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Minimum Window Substring](15-minimum-window-substring.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Giống như đọc một chuỗi từ hai đầu vào giữa — khi gặp hai ký tự không khớp, bạn được phép bỏ qua _một_ ký tự (bên trái hoặc bên phải) rồi tiếp tục kiểm tra. Nếu sau khi bỏ qua mà chuỗi còn lại là palindrome, trả lời là `true`. Chỉ được bỏ qua đúng một lần.

- **Pattern Recognition:**
  - Kiểm tra palindrome từ hai đầu → **Two Pointers** hội tụ vào giữa
  - Khi không khớp: thử bỏ ký tự trái **hoặc** ký tự phải → **Greedy fork** (chỉ tại điểm không khớp đầu tiên)
  - Không cần tạo chuỗi con thực sự — chỉ cần truyền chỉ số `[l, r]` vào hàm helper

- **Visual — "abca":**

  ```
  s = "abca"
  l=0  r=3: s[0]='a' == s[3]='a' ✓  → l=1, r=2
  l=1  r=2: s[1]='b' ≠  s[2]='c' ✗  → MISMATCH

  Fork:
  ① Skip left  → isPalin(s, l=2, r=2): 'c'=='c' ✓  → true
  ② (no need to check skip right)

  Result: true   (delete 'b' → "aca" is palindrome)
  ```

## Problem Description

Given string `s`, return `true` if it can become a palindrome by deleting **at most one** character.

```
Input: "aba"   → Output: true  (already palindrome)
Input: "abca"  → Output: true  (delete 'c' → "aba")
Input: "abc"   → Output: false (no single deletion works)
```

## 📝 Interview Tips

1. **Greedy is safe / Greedy là đúng**: The first mismatch is the only place a deletion can help — no benefit from checking earlier positions.
2. **Two branches, not two passes / Hai nhánh, không hai lần duyệt**: At the mismatch, try `isPalin(l+1, r)` OR `isPalin(l, r-1)` — whichever returns `true` wins.
3. **Don't create substrings / Không tạo chuỗi con**: Pass indices to the helper — avoids O(n) allocation and keeps Space O(1).
4. **Already a palindrome / Đã là palindrome**: If the outer loop completes without mismatch, return `true` immediately — no deletion needed.
5. **Common extension: k deletions / Mở rộng phổ biến: k lần xóa**: Meta often asks this follow-up. Two-pointer with a `deletions` counter still works up to small k; for large k use DP on LPS.

## Solutions

{% raw %}
/\*\*

- Valid Palindrome II
- https://leetcode.com/problems/valid-palindrome-ii/
  \*/

/\*\*

- Solution 1: Two Pointers + isPalin Helper (Standard)
- At first mismatch, try skipping left char or right char.
- Time O(n) | Space O(1)
  \*/
  function validPalindrome(s: string): boolean {
  function isPalin(l: number, r: number): boolean {
  while (l < r) {
  if (s[l] !== s[r]) return false;
  l++;
  r--;
  }
  return true;
  }

let l = 0;
let r = s.length - 1;

while (l < r) {
if (s[l] !== s[r]) {
return isPalin(l + 1, r) || isPalin(l, r - 1);
}
l++;
r--;
}

return true;
}

/\*\*

- Solution 2: Greedy Two-Pass (explicit mismatch detection)
- Separate the "find first mismatch" step from the "check both options" step.
- Time O(n) | Space O(1) — slightly clearer intent at interview
  \*/
  function validPalindromeGreedy(s: string): boolean {
  function isPalinRange(l: number, r: number): boolean {
  while (l < r) {
  if (s[l] !== s[r]) return false;
  l++;
  r--;
  }
  return true;
  }

let l = 0;
let r = s.length - 1;

// Find first mismatch position
while (l < r && s[l] === s[r]) {
l++;
r--;
}

// No mismatch → already a palindrome
if (l >= r) return true;

// Try removing either character at the mismatch
return isPalinRange(l + 1, r) || isPalinRange(l, r - 1);
}

// Inline tests
console.log(validPalindrome("aba")); // true
console.log(validPalindrome("abca")); // true
console.log(validPalindromeGreedy("abc")); // false
console.log(validPalindromeGreedy("deeee")); // true
{% endraw %}

## 🔗 Related Problems

- [125. Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) — Base problem (ignore non-alphanumeric)
- [5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/) — Expand-around-center approach
- [516. Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/) — DP for k-deletion generalization
- [1216. Valid Palindrome III](https://leetcode.com/problems/valid-palindrome-iii/) — Paid; k deletions allowed (DP)
- [680. Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/) — This problem (self-reference for bookmarking)
