---
layout: page
title: "Longest Palindrome"
difficulty: Easy
category: String
tags: [Hash Table, String, Greedy]
leetcode_url: "https://leetcode.com/problems/longest-palindrome"
---

# Longest Palindrome / Palindrome Dài Nhất Có Thể Tạo

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Greedy + Counting
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Reorganize String](https://leetcode.com/problems/reorganize-string) | [Largest Palindromic Number](https://leetcode.com/problems/largest-palindromic-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống xếp hàng đôi — mỗi ký tự có thể đứng theo cặp (trái-phải trong palindrome). Nếu ký tự xuất hiện chẵn lần, dùng hết. Lẻ lần thì dùng (count - 1) và còn chỗ cho 1 ký tự đứng giữa.

**Pattern Recognition:**

- Signal: "maximum length palindrome from char pool" → **Greedy counting**
- Key insight: palindrome cần các ký tự theo cặp, tối đa 1 ký tự đứng giữa

**Visual — Count pairs:**

```
s = "aabbccc"
freq: a=2, b=2, c=3

a: 2 (chẵn) → dùng cả 2  → contribute 2
b: 2 (chẵn) → dùng cả 2  → contribute 2
c: 3 (lẻ)   → dùng 2     → contribute 2, còn 1 → dùng làm trung tâm

length = 2+2+2 + 1 (center) = 7
palindrome: "abcacba" ✅
```

---

## Problem Description

Given a string `s` of lowercase and/or uppercase letters, return the **length** of the longest palindrome that can be built using those letters. ([LeetCode 409](https://leetcode.com/problems/longest-palindrome))

**Example 1:** `s = "abccccdd"` → `7` (e.g., `"dccaccd"`)
**Example 2:** `s = "a"` → `1`

Constraints: `1 <= s.length <= 2000`, `s` consists of lowercase and uppercase English letters

---

## 📝 Interview Tips

1. **Clarify**: "Chữ hoa và thường có khác nhau không?" / Are uppercase and lowercase treated differently? (Yes, 'A' ≠ 'a')
2. **Brute force**: "Không cần thử palindrome cụ thể, chỉ cần đếm số ký tự theo tần suất" / No need to construct — just count
3. **Optimize**: "Mỗi ký tự xuất hiện chẵn lần đóng góp toàn bộ; lẻ thì đóng góp (count-1) + có thể 1 trung tâm" / Even→all, odd→(count-1) + 1 center
4. **Edge cases**: `s = "a"` → length 1; all unique chars → length 1; all same → length n
5. **Follow-up**: "Nếu cần trả về chuỗi palindrome thực sự?" / Build the actual string by placing pairs + optional center
6. **Complexity**: "O(n) thời gian, O(1) space với array 128 chars" / O(n) time, O(1) space

---

## Solutions

```typescript
/**
 * Solution 1: Frequency Map
 * Time: O(n) — count chars, then iterate map
 * Space: O(1) — at most 52 distinct letters
 */
function longestPalindrome(s: string): number {
  const freq = new Map<string, number>();
  for (const c of s) freq.set(c, (freq.get(c) ?? 0) + 1);

  let length = 0;
  let hasOdd = false;

  for (const count of freq.values()) {
    length += Math.floor(count / 2) * 2;
    if (count % 2 === 1) hasOdd = true;
  }

  return hasOdd ? length + 1 : length;
}

/**
 * Solution 2: Array-based counting (faster constant)
 * Time: O(n) — single pass
 * Space: O(1) — fixed 128-slot array
 */
function longestPalindromeArr(s: string): number {
  const freq = new Array(128).fill(0);
  for (const c of s) freq[c.charCodeAt(0)]++;

  let length = 0;
  let hasOdd = false;

  for (const count of freq) {
    length += count & ~1; // floor to even: count - (count % 2)
    if (count & 1) hasOdd = true;
  }

  return hasOdd ? length + 1 : length;
}

// === Test Cases ===
console.log(longestPalindrome("abccccdd")); // → 7
console.log(longestPalindrome("a")); // → 1
console.log(longestPalindrome("Aa")); // → 1 (A ≠ a)
console.log(longestPalindrome("aabb")); // → 4
console.log(longestPalindromeArr("abccccdd")); // → 7
```

---

## 🔗 Related Problems

| Problem                                                                                                                                   | Difficulty | Pattern              |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------- |
| [Reorganize String](https://leetcode.com/problems/reorganize-string)                                                                      | 🟡 Medium  | Greedy + Heap        |
| [Largest Palindromic Number](https://leetcode.com/problems/largest-palindromic-number)                                                    | 🟡 Medium  | Greedy               |
| [Minimum Deletions to Make Char Frequencies Unique](https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique) | 🟡 Medium  | Greedy               |
| [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring)                                              | 🟡 Medium  | Expand Around Center |
| [Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning)                                                          | 🟡 Medium  | Backtracking         |
