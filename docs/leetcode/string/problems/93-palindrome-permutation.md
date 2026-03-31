---
layout: page
title: "Palindrome Permutation"
difficulty: Easy
category: String
tags: [Hash Table, String, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/palindrome-permutation"
---

# Palindrome Permutation / Hoán Vị Palindrome

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences) | [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Để xếp gương (palindrome), mỗi ký tự cần xuất hiện chẵn lần (ghép đôi), trừ tối đa 1 ký tự đứng giữa. Dùng XOR bit — mỗi ký tự toggle bit: nếu cuối cùng còn ≤1 bit bật, câu trả lời là true.

```
s = "aab"
a: bit 0 toggled → 1
a: bit 0 toggled → 0
b: bit 1 toggled → 1

mask = 0b10 → popcount = 1 ≤ 1 → true ✅

s = "abc"
mask = 0b111 → popcount = 3 > 1 → false ❌
```

---

## Problem Description

Given a string `s`, return `true` if any permutation of `s` can form a **palindrome**, otherwise return `false`.

**Example 1:** `s="aab"` → `true` (permutation "aba" is palindrome)
**Example 2:** `s="carerac"` → `true` ("racecar")
**Example 3:** `s="code"` → `false`

Constraints: `1 ≤ s.length ≤ 5000`, `s` contains only lowercase English letters.

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Chỉ lowercase? Có khoảng trắng không?" / Only lowercase letters? Spaces?
2. **Key insight / Ý tưởng**: Palindrome cần tối đa 1 ký tự có số lần xuất hiện lẻ
3. **Brute force / Vét cạn**: Count frequencies, count odds → O(n) time, O(26) space
4. **Optimize / Tối ưu**: Dùng XOR bitmask để tránh đếm: toggle bit per char, check ≤1 bit set
5. **Edge cases / Trường hợp đặc biệt**: Chuỗi 1 ký tự → true; chuỗi rỗng → true (empty is palindrome)
6. **Follow-up / Hỏi thêm**: "Tìm tất cả hoán vị palindrome?" / Generate all palindrome permutations (LeetCode 267)

---

## Solutions

```typescript
/**
 * Solution 1: Frequency count — count chars with odd frequency
 * Time: O(n)
 * Space: O(1) — fixed 26-letter alphabet
 */
function canPermutePalindromeFreq(s: string): boolean {
  const freq = new Array(26).fill(0);
  for (const ch of s) freq[ch.charCodeAt(0) - 97]++;
  const odds = freq.filter((f) => f % 2 !== 0).length;
  return odds <= 1;
}
console.log(canPermutePalindromeFreq("aab")); // true
console.log(canPermutePalindromeFreq("code")); // false
console.log(canPermutePalindromeFreq("carerac")); // true

/**
 * Solution 2: Bitmask XOR (Optimal)
 * Toggle bit for each character; palindrome possible iff at most 1 bit set.
 * mask & (mask-1) == 0 means exactly 0 or 1 bit set.
 * Time: O(n)
 * Space: O(1)
 */
function canPermutePalindrome(s: string): boolean {
  let mask = 0;
  for (const ch of s) {
    mask ^= 1 << (ch.charCodeAt(0) - 97);
  }
  // mask has at most 1 bit set ↔ mask is 0 or a power of 2
  return mask === 0 || (mask & (mask - 1)) === 0;
}

console.log(canPermutePalindrome("aab")); // true
console.log(canPermutePalindrome("code")); // false
console.log(canPermutePalindrome("carerac")); // true
console.log(canPermutePalindrome("a")); // true
```

---

## 🔗 Related Problems

| Problem                                                                                                | Pattern          | Difficulty |
| ------------------------------------------------------------------------------------------------------ | ---------------- | ---------- |
| [Palindrome Permutation II](https://leetcode.com/problems/palindrome-permutation-ii)                   | Backtracking     | Medium     |
| [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring) | Prefix Sum + Bit | Hard       |
| [Number of Wonderful Substrings](https://leetcode.com/problems/number-of-wonderful-substrings)         | Bitmask          | Medium     |
| [Valid Anagram](https://leetcode.com/problems/valid-anagram)                                           | Hash Map         | Easy       |

---

## 🔑 Bitmask Trick

For each char: `mask ^= (1 << charIndex)`. After all chars:
- `mask === 0` → all paired → even-length palindrome
- `mask & (mask-1) === 0` → exactly one unpaired → odd-length palindrome
- Otherwise → not possible

## ⏱️ Complexity Summary

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Frequency count | O(n) | O(26) | Easy to explain |
| Bitmask XOR | O(n) | O(1) | Elegant, same time |
