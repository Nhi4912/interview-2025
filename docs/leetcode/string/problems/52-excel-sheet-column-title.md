---
layout: page
title: "Excel Sheet Column Title"
difficulty: Easy
category: String
tags: [Math, String]
leetcode_url: "https://leetcode.com/problems/excel-sheet-column-title"
---

# Excel Sheet Column Title / Tiêu Đề Cột Excel

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math / Base Conversion
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Excel Sheet Column Number](https://leetcode.com/problems/excel-sheet-column-number) | [Integer to Roman](https://leetcode.com/problems/integer-to-roman)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giong nhu dem so trong he 26 chu cai — nhung co mot dieu ky la: khong co so "0"!
Trong Excel, cot 1=A, 26=Z, nhung 27=AA chu khong phai BA. Day la he so co so 26 nhung bat dau tu 1,
giong nhu dem: 1..26 (A..Z), 27..702 (AA..ZZ). Meo: truoc khi lay phan du, tru 1 de chuyen ve 0-indexed.

**Pattern Recognition:**

- Signal: "convert integer to base-N string" nhung 1-indexed, khong co digit 0 -> **Math loop**
- Brute force = vong while: `n-- -> char = A + (n%26) -> n = floor(n/26)` -> prepend char
- Key insight: `n--` truoc moi vong de bu cho viec khong co digit 0 (khac voi base-26 thong thuong)
- So sanh: base-10 `1..9,10=10`, base-26 Excel `1..26=Z, 27=AA` — shift by 1 each digit

**Visual — columnNumber = 701:**

**Visual — Excel Sheet Column Title example:**

```
Step 1: n=701 → n-- → n=700 → char = A+(700%26) = A+10 = 'K' → n=floor(700/26)=26
Step 2: n=26  → n-- → n=25  → char = A+(25%26)  = A+25 = 'Z' → n=floor(25/26)=0
Step 3: n=0   → STOP

Result (built backwards): 'K','Z' → reverse → "ZK" ✅

Verify: Z=26, ZK = 26*26 + 11 = 676+25 = 701 ✅

More examples:
  1  → A   (1-1=0,   0%26=0  → 'A')
  26 → Z   (26-1=25, 25%26=25 → 'Z')
  27 → AA  (27-1=26, 26%26=0 → 'A', 26/26=1 → 1-1=0 → 'A')
  28 → AB  (28-1=27, 27%26=1 → 'B', 27/26=1 → 1-1=0 → 'A')
```

---

---

## Problem Description

Given an integer `columnNumber`, return its corresponding **Excel column title**. Excel columns are labeled A through Z, then AA, AB, ..., AZ, BA, ..., ZZ, AAA, and so on (1-indexed, no zero digit).

**Example 1:**

```
Input:  columnNumber = 1
Output: "A"
```

**Example 2:**

```
Input:  columnNumber = 701
Output: "ZY"
```

**Constraints:** `1 <= columnNumber <= 2^31 - 1`

---

---

## 📝 Interview Tips

1. **Clarify**: "He so 26 nhung khong co digit 0 — khac base-26 thong thuong" / Confirm it is 1-indexed base-26 with no zero digit
2. **Key trick**: "Truoc moi vong, `n--` de shift ve 0-indexed truoc khi lay mod" / Do n-- before each mod to handle no-zero digit
3. **Build direction**: "Xay tu cuoi len dau — append roi reverse, hoac prepend vao dau string" / Build from least significant digit; reverse at end
4. **Verify manually**: "Kiem tra A=1, Z=26, AA=27, AZ=52, BA=53 de dam bao dung" / Spot-check A,Z,AA,AZ before submitting
5. **Edge cases**: "n=1 -> 'A'; n=26 -> 'Z'; n=27 -> 'AA'; n rat lon van hoat dong nho vong while" / Single char, boundary Z, two-char start all work
6. **Follow-up**: "Bai nguoc lai: Excel column title -> so nguyen (LC #171)" / Reverse: column title to number (LC #171)

---

---

## Solutions

```typescript
/**
 * Solution 1: Iterative Digit Extraction (Prepend)
 * Time: O(log_26(n)) — number of digits in base-26 representation
 * Space: O(log_26(n)) — result string length
 *
 * Key: decrement n before each mod to convert 1-indexed to 0-indexed.
 * This makes digit 1='A'(0), 26='Z'(25) work correctly.
 */
function convertToTitle(columnNumber: number): string {
  let result = "";
  let n = columnNumber;

  while (n > 0) {
    n--; // shift to 0-indexed (A=0, Z=25)
    result = String.fromCharCode(65 + (n % 26)) + result; // prepend char
    n = Math.floor(n / 26);
  }
  return result;
}

/**
 * Solution 2: Iterative with Array + Reverse
 * Time: O(log_26(n))
 * Space: O(log_26(n))
 *
 * Same logic but collect chars in array, reverse once at end.
 * Slightly cleaner for very long column names.
 */
function convertToTitleV2(columnNumber: number): string {
  const chars: string[] = [];
  let n = columnNumber;

  while (n > 0) {
    n--;
    chars.push(String.fromCharCode(65 + (n % 26)));
    n = Math.floor(n / 26);
  }
  return chars.reverse().join("");
}

/**
 * Solution 3: Recursive
 * Time: O(log_26(n))
 * Space: O(log_26(n)) — call stack depth
 */
function convertToTitleRecursive(columnNumber: number): string {
  if (columnNumber === 0) return "";
  const rem = (columnNumber - 1) % 26;
  return (
    convertToTitleRecursive(Math.floor((columnNumber - 1) / 26)) + String.fromCharCode(65 + rem)
  );
}

// === Test Cases ===
console.log(convertToTitle(1)); // "A"
console.log(convertToTitle(26)); // "Z"
console.log(convertToTitle(27)); // "AA"
console.log(convertToTitle(28)); // "AB"
console.log(convertToTitle(52)); // "AZ"
console.log(convertToTitle(701)); // "ZY"
console.log(convertToTitle(702)); // "ZZ"
console.log(convertToTitle(703)); // "AAA"
console.log(convertToTitle(2147483647)); // large input

// Verify all three versions match
const cases = [1, 2, 25, 26, 27, 28, 52, 53, 700, 701, 702, 703];
for (const c of cases) {
  const v1 = convertToTitle(c);
  const v2 = convertToTitleV2(c);
  const v3 = convertToTitleRecursive(c);
  console.assert(v1 === v2 && v2 === v3, `Mismatch at ${c}: ${v1} vs ${v2} vs ${v3}`);
}
console.log("All solutions agree");
```

---

## 🔗 Related Problems

| Problem                                                                              | Pattern          | Difficulty |
| ------------------------------------------------------------------------------------ | ---------------- | ---------- |
| [Excel Sheet Column Number](https://leetcode.com/problems/excel-sheet-column-number) | Math (reverse)   | Easy       |
| [Integer to Roman](https://leetcode.com/problems/integer-to-roman)                   | Greedy / Math    | Medium     |
| [Roman to Integer](https://leetcode.com/problems/roman-to-integer)                   | Math / String    | Easy       |
| [Integer to English Words](https://leetcode.com/problems/integer-to-english-words)   | Math / Recursion | Hard       |
| [Multiply Strings](https://leetcode.com/problems/multiply-strings)                   | Math / String    | Medium     |
