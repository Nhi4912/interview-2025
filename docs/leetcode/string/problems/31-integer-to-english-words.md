---
layout: page
title: "Integer to English Words"
difficulty: Hard
category: String
tags: [Math, String, Recursion]
leetcode_url: "https://leetcode.com/problems/integer-to-english-words"
---

# Integer to English Words / Chuyển Số Nguyên Thành Chữ Tiếng Anh

> **Track**: String | **Difficulty**: 🔴 Hard | **Pattern**: Divide by 1000 Chunks + Lookup Tables
> **Frequency**: 📕 Tier 2 — Gặp ở 25+ companies (Amazon, Microsoft, Bloomberg)
> **See also**: [Excel Sheet Column Title](https://leetcode.com/problems/excel-sheet-column-title) | [Roman to Integer](https://leetcode.com/problems/roman-to-integer)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Khi đọc một số lớn như 1,234,567, bạn đọc từng nhóm 3 chữ số: "one million", "two hundred thirty-four thousand", "five hundred sixty-seven". Bài này làm y như vậy — chia số thành các nhóm 3 chữ số (chunk), xử lý từng chunk, rồi gắn hậu tố Thousand/Million/Billion.

**Pattern Recognition:**

- Signal: "convert number to words", "groups of thousands" → **Divide by 1000 chunks**
- Lookup tables cho ones (0-19) và tens (20, 30, ..., 90) — hardcode không tránh được
- Recursion hoặc iteration để xử lý chunk 3-digit: hundreds + tens + ones

**Visual — num = 1,000,010:**

```
1,000,010 = 1×10^6 + 0×10^3 + 10

Chunks (from right):    10         → "Ten"
                        0          → "" (skip)
                        1          → "One"
Suffixes:              ""          Thousand   Million

Result: "One Million Ten"

helper(10): 10 < 20 → ones[10] = "Ten"
helper(1):  1 < 20  → ones[1]  = "One"
```

---

## Problem Description

Given a non-negative integer `num`, convert it to its English words representation. Numbers are in range `[0, 2^31 - 1]` (0 to 2,147,483,647).

```
Example 1: num=123        → "One Hundred Twenty Three"
Example 2: num=12345      → "Twelve Thousand Three Hundred Forty Five"
Example 3: num=1000010    → "One Million Ten"
Example 4: num=0          → "Zero"
```

Constraints: `0 <= num <= 2^31 - 1`

---

## 📝 Interview Tips

1. **Clarify**: "num = 0 → 'Zero'? Có trailing spaces không?" / Edge case 0, and no trailing spaces.
2. **Chunk by 1000**: Process in groups of 3 digits — attach Thousand/Million/Billion suffix.
3. **helper(n)**: Xử lý n ∈ [1,999] — hundreds place + recursive for remainder.
4. **Teens**: 11-19 are irregular — hardcode as separate lookup (not "ten one").
5. **Skip zeros**: Chunk = 0 → skip entirely (don't add "Thousand" suffix for empty chunk).
6. **Joining**: Use filter to remove empty strings before joining with " ".

---

## Solutions

```typescript
/**
 * Solution 1: Recursive chunk processing
 * Time: O(log10 num) — process at most 4 chunks (billions, millions, thousands, ones)
 * Space: O(1) — fixed lookup tables, O(log10 num) call stack
 */
function numberToWords1(num: number): string {
  if (num === 0) return "Zero";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function helper(n: number): string {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    if (n < 100) return (tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "")).trim();
    return (ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + helper(n % 100) : "")).trim();
  }

  const thousands = ["", " Thousand", " Million", " Billion"];
  let result = "";
  let chunk = 0;

  while (num > 0) {
    const part = num % 1000;
    if (part !== 0) {
      result = helper(part) + thousands[chunk] + (result ? " " + result : "");
    }
    num = Math.floor(num / 1000);
    chunk++;
  }
  return result;
}

/**
 * Solution 2: Iterative with thousands array (cleaner)
 * Time: O(1) — at most 4 iterations
 * Space: O(1) — fixed tables
 *
 * Process num from left to right using divisors [10^9, 10^6, 10^3, 1].
 * For each divisor, extract the quotient, convert to words, append suffix.
 */
function numberToWords(num: number): string {
  if (num === 0) return "Zero";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function threeDigits(n: number): string {
    const parts: string[] = [];
    if (n >= 100) {
      parts.push(ones[Math.floor(n / 100)] + " Hundred");
      n %= 100;
    }
    if (n >= 20) {
      parts.push(tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : ""));
    } else if (n > 0) {
      parts.push(ones[n]);
    }
    return parts.join(" ");
  }

  const divisors = [1_000_000_000, 1_000_000, 1_000, 1];
  const suffixes = ["Billion", "Million", "Thousand", ""];
  const parts: string[] = [];

  for (let i = 0; i < divisors.length; i++) {
    if (num >= divisors[i]) {
      const chunk = Math.floor(num / divisors[i]);
      num %= divisors[i];
      parts.push(threeDigits(chunk) + (suffixes[i] ? " " + suffixes[i] : ""));
    }
  }
  return parts.join(" ");
}

// === Test Cases ===
console.log(numberToWords(0)); // "Zero"
console.log(numberToWords(123)); // "One Hundred Twenty Three"
console.log(numberToWords(12345)); // "Twelve Thousand Three Hundred Forty Five"
console.log(numberToWords(1000010)); // "One Million Ten"
console.log(numberToWords(1000000)); // "One Million"
console.log(numberToWords(2147483647)); // "Two Billion One Hundred Forty Seven Million Four Hundred Eighty Three Thousand Six Hundred Forty Seven"
console.log(numberToWords1(12345)); // "Twelve Thousand Three Hundred Forty Five"
```

---

## 🔗 Related Problems

| Problem                                                                                    | Relationship                          |
| ------------------------------------------------------------------------------------------ | ------------------------------------- |
| [273. Integer to English Words](https://leetcode.com/problems/integer-to-english-words/)   | This problem                          |
| [12. Integer to Roman](https://leetcode.com/problems/integer-to-roman/)                    | Similar chunk-based number conversion |
| [168. Excel Sheet Column Title](https://leetcode.com/problems/excel-sheet-column-title/)   | Base-26 number-to-string conversion   |
| [171. Excel Sheet Column Number](https://leetcode.com/problems/excel-sheet-column-number/) | Reverse string-to-number conversion   |
| [13. Roman to Integer](https://leetcode.com/problems/roman-to-integer/)                    | String-to-number with lookup table    |
