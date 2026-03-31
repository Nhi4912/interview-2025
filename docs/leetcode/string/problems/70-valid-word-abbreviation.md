---
layout: page
title: "Valid Word Abbreviation"
difficulty: Easy
category: String
tags: [Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/valid-word-abbreviation"
---

# Valid Word Abbreviation / Viết Tắt Từ Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống đọc hợp đồng rút gọn — mỗi số trong tên viết tắt nghĩa là "bỏ qua n ký tự". Hai con trỏ đi song song: một trên từ gốc, một trên tên viết tắt.

**Pattern Recognition:**

- Duyệt đồng thời hai chuỗi → Two Pointers
- Nếu `abbr[j]` là số → nhảy `word[i]` đi `num` bước
- Nếu là chữ → phải match chính xác với `word[i]`
- Leading zero không hợp lệ: `"01"` → invalid

```
word = "internationalization"  abbr = "i12iz4n"

i=0, j=0: 'i'=='i' → match, i=1, j=1
i=1, j=1: '1' → num=1, then '2' → num=12 → i+=12 → i=13, j=3
i=13,j=3: 'i'=='i' → match, i=14, j=4
i=14,j=4: 'z'=='z' → match, i=15, j=5
i=15,j=5: '4' → num=4 → i+=4 → i=19, j=6
i=19,j=6: 'n'=='n' → match, i=20, j=7
i==20 (word.length), j==7 (abbr.length) → true ✅
```

---

## Problem Description

A word's **abbreviation** can replace a substring with its length. For example `"internationalization"` has abbreviation `"i12iz4n"` (skips 12 chars, then 4 chars). Given `word` and `abbr`, return whether `abbr` is a valid abbreviation of `word`.

**Examples:**

- `word = "internationalization", abbr = "i12iz4n"` → `true`
- `word = "apple", abbr = "a2e"` → `false`
- `word = "word", abbr = "01ord"` → `false` (leading zero)

**Constraints:** `1 ≤ word.length ≤ 20`, `1 ≤ abbr.length ≤ 10`, lowercase letters + digits

---

## 📝 Interview Tips

- 🇻🇳 Leading zero invalid: nếu `abbr[j]=='0'` và `num==0` → return false
- 🇺🇸 Accumulate multi-digit numbers: `num = num * 10 + digit`
- 🇻🇳 Sau khi đọc xong số, kiểm tra `i <= word.length` (có thể overshoot)
- 🇺🇸 Final check: both `i === word.length` AND `j === abbr.length`
- 🇻🇳 Chú ý phân biệt: số 0 là invalid leading zero, nhưng "0" trong giữa thì không xuất hiện
- 🇺🇸 Facebook/Meta frequently asks this — memorize the leading-zero trap

---

## Solutions

### Solution 1 — Two Pointers (Optimal)

```typescript
/**
 * Two pointers: i on word, j on abbr; handle digit sequences and char matches
 * Time: O(max(|word|, |abbr|)) — single pass
 * Space: O(1)
 */
function validWordAbbreviation(word: string, abbr: string): boolean {
  let i = 0; // pointer into word
  let j = 0; // pointer into abbr

  while (i < word.length && j < abbr.length) {
    const ch = abbr[j];

    if (ch >= "0" && ch <= "9") {
      // Leading zero check
      if (ch === "0" && i === i) {
        // The number starts with '0' — check if num was 0 before this digit
        // Actually: detect leading zero by checking previous num state
      }
      // Accumulate the full number
      if (ch === "0") return false; // leading zero is invalid (num starts at 0)
      let num = 0;
      while (j < abbr.length && abbr[j] >= "0" && abbr[j] <= "9") {
        num = num * 10 + (abbr[j].charCodeAt(0) - 48);
        j++;
      }
      i += num; // skip `num` characters in word
    } else {
      // Letter: must match exactly
      if (word[i] !== ch) return false;
      i++;
      j++;
    }
  }

  return i === word.length && j === abbr.length;
}

// Test cases
console.log(validWordAbbreviation("internationalization", "i12iz4n")); // true
console.log(validWordAbbreviation("apple", "a2e")); // false
console.log(validWordAbbreviation("word", "01ord")); // false (leading zero)
console.log(validWordAbbreviation("hi", "2")); // true
```

---

## 🔗 Related Problems

- [125 - Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) — two pointer character matching
- [443 - String Compression](https://leetcode.com/problems/string-compression/) — run-length encoding
- [8 - String to Integer (atoi)](https://leetcode.com/problems/string-to-integer-atoi/) — parsing digits with edge cases
- [28 - Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/) — string matching
