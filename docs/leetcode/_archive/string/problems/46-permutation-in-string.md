---
layout: page
title: "Permutation in String"
difficulty: Medium
category: String
tags: [Hash Table, Two Pointers, String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/permutation-in-string"
---

# Permutation in String / Kiểm Tra Hoán Vị Trong Chuỗi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words) | [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như kiểm tra một túi mua sắm — bạn có danh sách hàng cần mua (s1), rồi đẩy giỏ hàng (window) dọc theo kệ siêu thị (s2). Mỗi lần di chuyển, bạn thêm hàng mới vào giỏ và bỏ hàng cũ ra. Khi giỏ hàng chứa đúng mọi thứ trong danh sách là tìm thấy!

**Pattern Recognition:**

- Signal: "check if permutation exists as substring" → **Fixed-size Sliding Window**
- Window size = `s1.length`, maintain character frequency counts
- Key insight: Dùng `matches` counter — chỉ cập nhật khi freq thay đổi qua ngưỡng target

**Visual — Permutation in String:**

```
s1 = "ab"  →  need: {a:1, b:1}
s2 = "eidbaooo"

window size = 2
i=0: "ei"  {e:1,i:1}  matches=0 ❌
i=1: "id"  {i:1,d:1}  matches=0 ❌
i=2: "db"  {d:1,b:1}  matches=1 ❌
i=3: "ba"  {b:1,a:1}  matches=2 ✅ → return true

s1 = "ab", s2 = "eidboaoo"
No window of size 2 has {a:1,b:1} → return false
```

---

## Problem Description

Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise. In other words, return `true` if one of `s1`'s permutations is a substring of `s2`.

**Example 1:** `s1 = "ab"`, `s2 = "eidbaooo"` → `true` (`"ba"` at index 3)
**Example 2:** `s1 = "ab"`, `s2 = "eidboaoo"` → `false`

Constraints:

- `1 <= s1.length, s2.length <= 10^4`
- `s1` and `s2` consist of lowercase English letters

---

## 📝 Interview Tips

1. **Clarify (VN)**: "Permutation = cùng ký tự, khác thứ tự, contiguous trong s2?" / **EN**: Confirm permutation must appear as a contiguous substring
2. **Brute force (VN)**: "Generate all permutations O(m!) rồi tìm trong s2 — quá chậm" / **EN**: Generating all permutations is factorial — obviously too slow
3. **Optimize (VN)**: "Fixed window = len(s1), slide qua s2, so freq map O(n)" / **EN**: Fixed-size window avoids regeneration; O(n) total
4. **Matches trick (VN)**: "Counter `matches` tránh so sánh toàn bộ 26 slot mỗi bước" / **EN**: Track number of perfectly-matched chars to get O(1) check
5. **Edge cases (VN)**: "s1 dài hơn s2 → false ngay lập tức" / **EN**: If `s1.length > s2.length` return false immediately
6. **Follow-up (VN)**: "Trả về vị trí bắt đầu → bài 438 Find All Anagrams" / **EN**: Return all start positions → LC 438 Find All Anagrams in a String

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check sorted window each step
 * Time: O(n * m * log m) — n positions, sort m chars each
 * Space: O(m) — for sorting
 */
function checkInclusionBrute(s1: string, s2: string): boolean {
  if (s1.length > s2.length) return false;
  const sorted1 = s1.split("").sort().join("");
  for (let i = 0; i <= s2.length - s1.length; i++) {
    const window = s2
      .slice(i, i + s1.length)
      .split("")
      .sort()
      .join("");
    if (window === sorted1) return true;
  }
  return false;
}

/**
 * Solution 2: Sliding Window with Frequency Array + Matches Counter
 * Time: O(n) — single pass, O(1) per step (26-char alphabet)
 * Space: O(1) — two arrays of size 26
 */
function checkInclusion(s1: string, s2: string): boolean {
  if (s1.length > s2.length) return false;

  const freq1 = new Array(26).fill(0);
  const freq2 = new Array(26).fill(0);
  const a = 97; // 'a'.charCodeAt(0)

  // Build frequency for s1 and initial window of s2
  for (let i = 0; i < s1.length; i++) {
    freq1[s1.charCodeAt(i) - a]++;
    freq2[s2.charCodeAt(i) - a]++;
  }

  // Count matching positions
  let matches = 0;
  for (let i = 0; i < 26; i++) {
    if (freq1[i] === freq2[i]) matches++;
  }

  for (let i = s1.length; i < s2.length; i++) {
    if (matches === 26) return true;

    // Add incoming right char
    const right = s2.charCodeAt(i) - a;
    if (freq2[right] === freq1[right]) matches--;
    freq2[right]++;
    if (freq2[right] === freq1[right]) matches++;

    // Remove outgoing left char
    const left = s2.charCodeAt(i - s1.length) - a;
    if (freq2[left] === freq1[left]) matches--;
    freq2[left]--;
    if (freq2[left] === freq1[left]) matches++;
  }

  return matches === 26;
}

// === Test Cases ===
console.log(checkInclusion("ab", "eidbaooo")); // true
console.log(checkInclusion("ab", "eidboaoo")); // false
console.log(checkInclusion("adc", "dcda")); // true  ("cda" at index 1)
console.log(checkInclusion("a", "b")); // false
console.log(checkInclusion("abc", "ab")); // false (s1 longer)
```

---

## 🔗 Related Problems

| Problem                                                                                                              | Pattern        | Difficulty |
| -------------------------------------------------------------------------------------------------------------------- | -------------- | ---------- |
| [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string)                         | Sliding Window | 🟡 Medium  |
| [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring)                                   | Sliding Window | 🔴 Hard    |
| [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement)     | Sliding Window | 🟡 Medium  |
| [Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words) | Sliding Window | 🔴 Hard    |
| [Permutation in String — LeetCode](https://leetcode.com/problems/permutation-in-string)                              | Sliding Window | 🟡 Medium  |
