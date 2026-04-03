---
layout: page
title: "Reverse Words in a String III"
difficulty: Easy
category: String
tags: [Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/reverse-words-in-a-string-iii"
---

# Reverse Words in a String III / Đảo Ngược Ký Tự Trong Từng Từ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) | [String Compression](https://leetcode.com/problems/string-compression)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như đọc chữ viết ngược trong gương — mỗi từ trong câu sẽ được phản chiếu lại (ký tự đầu thành cuối, cuối thành đầu), nhưng thứ tự các từ trong câu vẫn giữ nguyên. Bạn chỉ cần che từng từ bằng một tờ giấy rồi lật ngược lại.

**Pattern Recognition:**

- Signal: "reverse each word individually" → **Split + Reverse, or Two Pointers per word**
- Tách câu theo khoảng trắng, đảo từng từ, nối lại
- Key insight: Hai con trỏ `L` và `R` đặt ở đầu/cuối mỗi từ để swap in-place

**Visual — Reverse Words in a String III:**

```
s = "Let's take LeetCode contest"
         ↓ split by ' '
["Let's", "take", "LeetCode", "contest"]
         ↓ reverse each word
["s'teL", "ekat", "edoCteeL", "tsetn oc"]

Wait: "contest" → "tsetn oc"? No — "contest" → "tsetnoc"

["s'teL", "ekat", "edoCteeL", "tsetnoc"]
         ↓ join by ' '
"s'teL ekat edoCteeL tsetnoc"

Two Pointer on char array (in-place):
"Let's take ..."
 L   R        → swap L,R until L>R, then move to next word
```

---

## Problem Description

Given a string `s`, reverse the order of characters in each word within a sentence while still preserving whitespace and initial word order.

**Example 1:** `s = "Let's take LeetCode contest"` → `"s'teL ekat edoCteeL tsetnoc"`
**Example 2:** `s = "Mr Ding"` → `"rM gniD"`

Constraints:

- `1 <= s.length <= 5 * 10^4`
- `s` contains printable ASCII characters
- `s` does not contain leading or trailing spaces
- There is at least one word, all words separated by a single space

---

## 📝 Interview Tips

1. **Clarify (VN)**: "Có khoảng trắng thừa ở đầu/cuối không? Bài này đảm bảo không có" / **EN**: Confirm no leading/trailing spaces and single space between words
2. **Simple approach (VN)**: "Split → map(reverse) → join: 3 dòng code, O(n)" / **EN**: Split by space, reverse each word's characters, rejoin — clean O(n)
3. **In-place (VN)**: "Two pointers cho mỗi từ: L=start, R=end, swap đến giữa" / **EN**: In-place: for each word use two pointers swapping from both ends
4. **Space optimization (VN)**: "In-place dùng O(1) extra (ngoài input array chars)" / **EN**: In-place avoids split allocation — useful if input is mutable char array
5. **Edge cases (VN)**: "Từ một ký tự giữ nguyên, câu một từ" / **EN**: Single-char words unchanged, single-word input
6. **Follow-up (VN)**: "Nếu cần đảo thứ tự CẢ câu (không phải từng từ) → Reverse Words in a String (LC 151)" / **EN**: Reversing word ORDER (not chars) → LC 151, LC 186

---

## Solutions

```typescript
/**
 * Solution 1: Split + Map + Join (Most Readable)
 * Time: O(n) — split O(n), each word reversed O(word length), join O(n)
 * Space: O(n) — for the split array and reversed strings
 */
function reverseWordsSplit(s: string): string {
  return s
    .split(" ")
    .map((word) => word.split("").reverse().join(""))
    .join(" ");
}

/**
 * Solution 2: Two Pointers In-Place on char array
 * Time: O(n) — single pass, each char swapped at most once
 * Space: O(n) — char array (JS strings are immutable, so array needed)
 */
function reverseWords(s: string): string {
  const chars = s.split("");
  let start = 0;

  for (let i = 0; i <= chars.length; i++) {
    // End of a word: either space or end of string
    if (i === chars.length || chars[i] === " ") {
      let left = start;
      let right = i - 1;
      // Reverse the word in-place
      while (left < right) {
        [chars[left], chars[right]] = [chars[right], chars[left]];
        left++;
        right--;
      }
      start = i + 1; // next word starts after the space
    }
  }

  return chars.join("");
}

/**
 * Solution 3: Regex-based one-liner (fun alternative)
 * Time: O(n) — regex processes each word once
 * Space: O(n) — intermediate strings
 */
function reverseWordsRegex(s: string): string {
  return s.replace(/\S+/g, (word) => word.split("").reverse().join(""));
}

// === Test Cases ===
console.log(reverseWords("Let's take LeetCode contest")); // "s'teL ekat edoCteeL tsetnoc"
console.log(reverseWords("Mr Ding")); // "rM gniD"
console.log(reverseWords("a")); // "a"
console.log(reverseWords("God Ding")); // "doG gniD"
```

---

## 🔗 Related Problems

| Problem                                                                                                 | Pattern      | Difficulty |
| ------------------------------------------------------------------------------------------------------- | ------------ | ---------- |
| [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string)                    | Two Pointers | 🟡 Medium  |
| [Reverse Words in a String II](https://leetcode.com/problems/reverse-words-in-a-string-ii)              | Two Pointers | 🟡 Medium  |
| [String Compression](https://leetcode.com/problems/string-compression)                                  | Two Pointers | 🟡 Medium  |
| [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings)                          | Two Pointers | 🟡 Medium  |
| [Reverse Words in a String III — LeetCode](https://leetcode.com/problems/reverse-words-in-a-string-iii) | Two Pointers | 🟢 Easy    |
