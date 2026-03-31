---
layout: page
title: "Excel Sheet Column Number"
difficulty: Easy
category: String
tags: [Math, String]
leetcode_url: "https://leetcode.com/problems/excel-sheet-column-number"
---

# Excel Sheet Column Number / Số Cột Bảng Tính Excel

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii) | [Integer to English Words](https://leetcode.com/problems/integer-to-english-words)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống đổi số từ hệ thập phân — nhưng đây là hệ cơ số 26, không có số 0. A=1, B=2, ..., Z=26. "AB" = A×26 + B = 1×26 + 2 = 28. Xử lý từ trái sang phải, nhân cộng dồn.

```
columnTitleToNumber("AB"):
  result = 0
  'A' → result = 0 * 26 + 1  = 1
  'B' → result = 1 * 26 + 2  = 28

columnTitleToNumber("ZY"):
  'Z' → result = 0 * 26 + 26 = 26
  'Y' → result = 26 * 26 + 25 = 701
```

---

## Problem Description

Given a string `columnTitle` that represents an Excel column title (A, B, ..., Z, AA, AB, ...), return its corresponding column number.

**Example 1:** `"A"` → `1`; `"Z"` → `26`; `"AA"` → `27`
**Example 2:** `"AB"` → `28`; `"ZY"` → `701`

Constraints: `1 ≤ columnTitle.length ≤ 7`, `columnTitle` consists of uppercase English letters.

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Có phân biệt hoa thường không?" / Case-sensitive input? (always uppercase)
2. **Brute force / Vét cạn**: Không cần — đây đã là tối ưu O(n) / This is already optimal
3. **Key insight / Ý tưởng**: Đây là hệ cơ số 26 (base-26), A=1 đến Z=26 / Base-26 where A=1 not 0
4. **Khác hex / Lưu ý**: Không có chữ số 0 trong hệ này — A là 1, không phải 0
5. **Edge cases / Trường hợp đặc biệt**: Chuỗi 1 ký tự (A→1, Z→26); chuỗi dài 7 ký tự
6. **Follow-up / Hỏi thêm**: "Ngược lại — từ số ra chuỗi?" / Reverse: Excel Sheet Column Title (LeetCode 168)

---

## Solutions

```typescript
/**
 * Solution 1: Iterative base-26 conversion (left to right)
 * Time: O(n) — one pass through the string
 * Space: O(1)
 */
function titleToNumber(columnTitle: string): number {
  let result = 0;
  for (const ch of columnTitle) {
    result = result * 26 + (ch.charCodeAt(0) - "A".charCodeAt(0) + 1);
  }
  return result;
}

console.log(titleToNumber("A")); // 1
console.log(titleToNumber("Z")); // 26
console.log(titleToNumber("AA")); // 27
console.log(titleToNumber("AB")); // 28
console.log(titleToNumber("ZY")); // 701

/**
 * Solution 2: Using reduce (functional style)
 * Time: O(n)
 * Space: O(n) — spread to array, though input is small (≤7 chars)
 */
function titleToNumberFunctional(columnTitle: string): number {
  return [...columnTitle].reduce((acc, ch) => {
    return acc * 26 + (ch.charCodeAt(0) - 64); // 'A' = 65, so -64 gives 1
  }, 0);
}

console.log(titleToNumberFunctional("A")); // 1
console.log(titleToNumberFunctional("ZY")); // 701
console.log(titleToNumberFunctional("FXSHRXW")); // 2147483647
```

---

## 🔗 Related Problems

| Problem                                                                              | Pattern | Difficulty |
| ------------------------------------------------------------------------------------ | ------- | ---------- |
| [Excel Sheet Column Title](https://leetcode.com/problems/excel-sheet-column-title)   | Math    | Easy       |
| [Integer to Roman](https://leetcode.com/problems/integer-to-roman)                   | Math    | Medium     |
| [Roman to Integer](https://leetcode.com/problems/roman-to-integer)                   | Math    | Easy       |
| [Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings) | String  | Medium     |

---

## 🔢 Base Conversion Notes

Excel uses **bijective base-26** — no zero digit. A=1, Z=26, AA=27.

```
"AB" = 1×26 + 2 = 28
"ZY" = 26×26 + 25 = 701
```

## ⏱️ Complexity Summary

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Iterative scan | O(n) | O(1) | n ≤ 7, effectively constant |
| Functional reduce | O(n) | O(n) | Spreads string to array |
