---
layout: page
title: "Vowels of All Substrings"
difficulty: Medium
category: Dynamic Programming
tags: [Math, String, Dynamic Programming, Combinatorics]
leetcode_url: "https://leetcode.com/problems/vowels-of-all-substrings"
---

# Vowels of All Substrings / Vowels of All Substrings

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Count the Number of Good Subsequences](https://leetcode.com/problems/count-the-number-of-good-subsequences) | [String Transformation](https://leetcode.com/problems/string-transformation)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đếm số lần mỗi người xuất hiện trong tất cả các cuộc họp — thay vì liệt kê mọi cuộc họp, hỏi "người này tham gia bao nhiêu cuộc?" Với ký tự nguyên âm ở vị trí i: nó thuộc (i+1) × (n-i) substrings.

**Visual — word = "aba", n=3:**

```
All substrings: "a","ab","aba","b","ba","a"
Vowels contribution:
  idx 0 ('a'): appears in substrings starting at 0, ending at 0,1,2
               = (0+1) × (3-0) = 1 × 3 = 3 substrings
  idx 1 ('b'): consonant, skip
  idx 2 ('a'): appears in substrings starting at 0,1,2, ending at 2
               = (2+1) × (3-2) = 3 × 1 = 3 substrings

Total = 3 + 3 = 6

Verify by brute force:
  "a"→1, "ab"→1, "aba"→2, "b"→0, "ba"→1, "a"→1 = 6 ✓

Formula: for vowel at index i (0-based):
  contribution = (i + 1) * (n - i)
```

---

## Problem Description

Given a string `word`, return the **sum of the number of vowels** ('a', 'e', 'i', 'o', 'u') in every **substring** of `word`. ([LeetCode](https://leetcode.com/problems/vowels-of-all-substrings))

Difficulty: Medium | Acceptance: 54.7%

**Example 1:**

```
Input: word = "aba"
Output: 6
Explanation: All substrings: "a"(1), "ab"(1), "aba"(2), "b"(0), "ba"(1), "a"(1) = 6
```

**Example 2:**

```
Input: word = "abc"
Output: 3
Explanation: "a"(1), "ab"(1), "abc"(1), "b"(0), "bc"(0), "c"(0) = 3
```

Constraints:

- `1 <= word.length <= 10^5`
- `word` consists of lowercase English letters

---

## 📝 Interview Tips

1. **Key insight**: "Mỗi nguyên âm ở vị trí i (0-indexed) đóng góp vào (i+1)×(n-i) substrings" / Each vowel contributes to exactly (i+1)\*(n-i) substrings.
2. **Why?**: "(i+1) cách chọn điểm bắt đầu (0..i) × (n-i) cách chọn điểm kết thúc (i..n-1)" / Start can be anywhere 0..i, end anywhere i..n-1.
3. **O(n) solution**: "Duyệt một lần, cộng đóng góp của mỗi nguyên âm" / Single pass, O(1) per character.
4. **No DP needed**: "Bài này thực ra là toán tổ hợp, không cần DP table" / Pure math, though often categorized as DP.
5. **Edge cases**: "Không có nguyên âm → 0. Tất cả nguyên âm → sum of (i+1)\*(n-i)" / All vowels or no vowels.
6. **Overflow**: "n lên đến 10^5: (i+1)\*(n-i) tối đa ~2.5×10^9, cần number hoặc BigInt" / Max contribution ~2.5B, use number carefully (within safe integer).

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force O(n²)
 * Time: O(n²) — enumerate all substrings
 * Space: O(1)
 */
function countVowelsBrute(word: string): number {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  let total = 0;
  const n = word.length;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      for (let k = i; k <= j; k++) {
        if (vowels.has(word[k])) total++;
      }
    }
  }
  return total;
}

/**
 * Solution 2: Combinatorics O(n)
 * Time: O(n) — single pass
 * Space: O(1)
 *
 * For vowel at index i (0-based):
 *   - Number of substrings containing it = (i+1) * (n-i)
 *   - (i+1) choices for start (indices 0..i)
 *   - (n-i) choices for end (indices i..n-1)
 */
function countVowels(word: string): number {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  const n = word.length;
  let total = 0;

  for (let i = 0; i < n; i++) {
    if (vowels.has(word[i])) {
      total += (i + 1) * (n - i);
    }
  }

  return total;
}

/**
 * Solution 3: One-liner
 * Time: O(n) | Space: O(1)
 */
function countVowelsOneLiner(word: string): number {
  const n = word.length;
  return [...word].reduce((sum, ch, i) => sum + ("aeiou".includes(ch) ? (i + 1) * (n - i) : 0), 0);
}

// === Test Cases ===
console.log(countVowels("aba")); // 6
console.log(countVowels("abc")); // 3
console.log(countVowels("aeiou")); // 5+8+9+8+5 = 35... check: 1*5 + 2*4 + 3*3 + 4*2 + 5*1 = 5+8+9+8+5=35
console.log(countVowels("a")); // 1
console.log(countVowels("xyz")); // 0
```
