---
layout: page
title: "Reverse Words in a String"
difficulty: Medium
category: String
tags: [Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/reverse-words-in-a-string"
---

# Reverse Words in a String / Đảo Ngược Thứ Tự Từ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Split + Reverse / In-Place Double Reverse
> **Frequency**: 📘 Tier 3 — Gặp ở 18 companies
> **See also**: [Reverse Words in a String III](https://leetcode.com/problems/reverse-words-in-a-string-iii) | [Rotate Array](https://leetcode.com/problems/rotate-array)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Khi đọc bảng tin quảng cáo theo chiều ngược lại — câu "Hôm nay trời đẹp" đọc ngược thành "đẹp trời nay Hôm". Cách đơn giản nhất: cắt câu thành từng từ, lấy từ cuối trước. Cách thông minh hơn (interview-worthy): lật toàn bộ câu rồi lật lại từng từ — như lật ngược cuốn sách rồi lật từng chương.

**Pattern Recognition:**

- Signal: "reverse order of words" + "trim spaces" → **Split + Filter + Reverse + Join**
- In-place O(1) space approach (for char array input): **Double Reverse**
  1. Reverse the entire string
  2. Reverse each individual word
  3. Trim leading/trailing spaces

**Visual — Double Reverse on " the sky is blue ":**

```
Original:  "  the sky is blue  "

Step 1: Trim + reverse entire string
         "eulb si yks eht"

Step 2: Reverse each word
         "eulb" → "blue"
         "si"   → "is"
         "yks"  → "sky"
         "eht"  → "the"
         Result: "blue is sky the"

That's the answer! ✅

Clean split approach (simpler, extra space):
"  the sky is blue  "
  .split(' ')     → ["", "", "the", "sky", "is", "blue", "", ""]
  .filter(Boolean)→ ["the", "sky", "is", "blue"]
  .reverse()      → ["blue", "is", "sky", "the"]
  .join(' ')      → "blue is sky the" ✅
```

---

## Problem Description

Given a string `s`, reverse the order of the words. A word is defined as a sequence of non-space characters. The input may contain leading/trailing spaces or multiple spaces between words — the output must have **single spaces** and no leading/trailing spaces. ([LeetCode 151](https://leetcode.com/problems/reverse-words-in-a-string))

```
Input: s = "the sky is blue"   → Output: "blue is sky the"
Input: s = "  hello world  "   → Output: "world hello"
Input: s = "a good   example"  → Output: "example good a"
```

Constraints: `1 <= s.length <= 10⁴`, `s` contains English letters, digits, and spaces

---

## 📝 Interview Tips

1. **Clarify**: "Output có cần loại bỏ multiple spaces không? / Should output normalize multiple spaces?" — Yes, single space only
2. **Split trick**: "`.split(' ')` để lại chuỗi rỗng từ khoảng trắng thừa — cần `.filter(Boolean)`" / `.split(' ')` leaves empty strings, filter them
3. **In-place**: "Nếu input là char array (C++/Java), dùng double reverse O(1) space" / For mutable char arrays use double-reverse trick
4. **Two pointers in-place**: "Collect words from right to left using two pointers" / Scan right-to-left, extract word-by-word
5. **Edge cases**: "Chỉ có spaces, một từ, many consecutive spaces" / All spaces, single word, many consecutive spaces
6. **Follow-up**: "Reverse words in-place with O(1) space? → reverse entire, then reverse each word" / Double-reverse trick

---

## Solutions

```typescript
/**
 * Solution 1: Split + Filter + Reverse + Join (Clean & Simple)
 * Name: Split and Reverse
 * Time: O(n) — split, filter, reverse, join are all O(n)
 * Space: O(n) — stores all words
 */
function reverseWordsSplit(s: string): string {
  return s
    .split(" ") // split on single space (may produce empty strings)
    .filter(Boolean) // remove empty strings from multiple spaces
    .reverse() // reverse the array of words
    .join(" "); // join with single space
}

/**
 * Solution 2: Regex Split (Handles all whitespace)
 * Name: Regex Split
 * Time: O(n)
 * Space: O(n)
 */
function reverseWords(s: string): string {
  return s.trim().split(/\s+/).reverse().join(" ");
  // \s+ matches one or more whitespace chars — handles tabs, multiple spaces
}

/**
 * Solution 3: Two Pointers (no built-in reverse)
 * Name: Two Pointer Right-to-Left
 * Time: O(n) — two passes maximum
 * Space: O(n) — result array
 */
function reverseWordsTwoPointers(s: string): string {
  const words: string[] = [];
  let i = s.length - 1;

  while (i >= 0) {
    // skip trailing spaces
    while (i >= 0 && s[i] === " ") i--;
    if (i < 0) break;

    // find start of word
    const end = i;
    while (i >= 0 && s[i] !== " ") i--;

    words.push(s.slice(i + 1, end + 1)); // extract word
  }

  return words.join(" ");
}

// === Test Cases ===
console.log(reverseWords("the sky is blue")); // "blue is sky the"
console.log(reverseWords("  hello world  ")); // "world hello"
console.log(reverseWords("a good   example")); // "example good a"
console.log(reverseWordsTwoPointers("  Bob    Loves  Alice   ")); // "Alice Loves Bob"
console.log(reverseWordsSplit("Alice does not even like bob")); // "bob like even not does Alice"
```

---

## 🔗 Related Problems

| Problem | Relationship |
|---|---|
| [Reverse Words in a String III](https://leetcode.com/problems/reverse-words-in-a-string-iii) | Simpler: no leading/trailing spaces, reverse chars in each word |
| [Rotate Array](https://leetcode.com/problems/rotate-array) | In-place reversal trick generalizes to array rotation |
| [Reverse String](https://leetcode.com/problems/reverse-string) | Same two-pointer reversal at char level |
| [String Compression](https://leetcode.com/problems/string-compression) | In-place read/write two-pointer manipulation |
| [Valid Palindrome](https://leetcode.com/problems/valid-palindrome) | Two-pointer left/right traversal on string |
