---
layout: page
title: "Hexspeak"
difficulty: Easy
category: String
tags: [Math, String]
leetcode_url: "https://leetcode.com/problems/hexspeak"
---

# Hexspeak / Mã Thập Lục Phân Biết Nói

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Conversion
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Excel Sheet Column Title](https://leetcode.com/problems/excel-sheet-column-title) | [To Lower Case](https://leetcode.com/problems/to-lower-case)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hexspeak là "ngôn ngữ bí mật của lập trình viên" — dùng các ký tự hex trông giống chữ cái. Số `1` trông như chữ `I`, số `0` trông như chữ `O`, còn `A`→`F` vốn đã là chữ rồi. Bài toán giống như dịch một tờ tiền giả: chuyển số thập phân sang hex, rồi thay `0→O`, `1→I`. Nếu kết quả còn chứa chữ số `2–9` (không thể "ngụy trang" thành chữ cái), trả về `"ERROR"`. Thử với `257` → `101` hex → `IOI` ✓; với `3` → `3` hex → `"ERROR"` vì `3` không hóa trang được.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Hexspeak example:**

```
num = "257"
  Step 1: parseInt("257") = 257
  Step 2: 257 .toString(16) = "101"
  Step 3: Replace digits:  '1'→'I', '0'→'O', '1'→'I'
  Result: "IOI"  ✓

num = "3"
  Step 1: parseInt("3") = 3
  Step 2: 3 .toString(16) = "3"
  Step 3: '3' is digit 2-9 → invalid
  Result: "ERROR"

num = "747"
  hex = "2eb"  →  uppercase = "2EB"
  '2' is digit 2-9 → "ERROR"

num = "188"
  hex = "bc"  →  uppercase = "BC"
  All chars in {A-F} → "BC"  ✓
```

---

## Problem Description

Given a decimal number `num` as a string, convert it to hexadecimal then replace `0→O` and `1→I`. If the result only contains letters from `{A, B, C, D, E, F, I, O}`, return it; otherwise return `"ERROR"`.

**Example 1:** `num = "257"` → `"IOI"` (257 = 0x101, 1→I, 0→O, 1→I)
**Example 2:** `num = "3"` → `"ERROR"` (3 = 0x3, digit 2–9 not allowed)
**Example 3:** `num = "188"` → `"BC"` (188 = 0xBC, all valid letters)

**Constraints:** `1 ≤ num.length ≤ 12`, `num` represents a non-negative integer, no leading zeros (except `"0"` itself), `0 ≤ num < 2^31`

---

## 📝 Interview Tips

- **Parse as integer first** / Chuyển về số nguyên trước: Dùng `parseInt(num)` hoặc `BigInt(num)` để xử lý số lớn gần `2^31`
- **toUpperCase trước khi kiểm tra** / Uppercase first: `toString(16).toUpperCase()` → tránh case-sensitive bug với a-f vs A-F
- **Valid set nhỏ** / Small valid set: Chỉ `{A,B,C,D,E,F,I,O}` hợp lệ — dễ check bằng Set hoặc regex `/^[A-FIO]+$/`
- **Map 0→O và 1→I** / Replace map: Chỉ `0` và `1` được thay, còn `2-9` báo lỗi ngay
- **BigInt cho số lớn** / BigInt for safety: `num` có thể gần `2^31-1` (~2 tỷ), vừa với `number` nhưng dùng `BigInt` an toàn hơn
- **Edge: num="0"** / Edge case zero: `0` → hex `"0"` → replace `0→O` → `"O"` ✓ hợp lệ

---

## Solutions

```typescript
/**
 * @complexity Time: O(log n) | Space: O(log n)
 * Convert to hex, validate each char, replace 0/1
 */
function toHexspeak(num: string): string {
  const hex = parseInt(num).toString(16).toUpperCase();
  let result = "";
  for (const ch of hex) {
    if (ch === "0") result += "O";
    else if (ch === "1") result += "I";
    else if (ch >= "2" && ch <= "9") return "ERROR";
    else result += ch; // A-F: valid as-is
  }
  return result;
}

/**
 * @complexity Time: O(log n) | Space: O(log n)
 * Do all replacements first, then validate with single regex
 */
function toHexspeakRegex(num: string): string {
  const hex = parseInt(num).toString(16).toUpperCase().replace(/0/g, "O").replace(/1/g, "I");

  return /^[A-FIO]+$/.test(hex) ? hex : "ERROR";
}

/**
 * @complexity Time: O(log n) | Space: O(log n)
 * Uses BigInt to safely handle numbers near 2^31
 */
function toHexspeakBigInt(num: string): string {
  const hex = BigInt(num).toString(16).toUpperCase();
  const VALID = new Set("ABCDEFIO");
  let result = "";
  for (const ch of hex) {
    if (ch === "0") result += "O";
    else if (ch === "1") result += "I";
    else if (!VALID.has(ch)) return "ERROR";
    else result += ch;
  }
  return result;
}

// === Test Cases ===
console.log(toHexspeak("257")); // → "IOI"
console.log(toHexspeak("3")); // → "ERROR"
console.log(toHexspeak("188")); // → "BC"
console.log(toHexspeak("0")); // → "O"
console.log(toHexspeak("2147483647")); // → "IIIIIIIIIIIIIIII" or "ERROR"
console.log(toHexspeakRegex("257")); // → "IOI"
console.log(toHexspeakBigInt("747")); // → "ERROR"
console.log(toHexspeakBigInt("16")); // → "IO"  (0x10 → "10" → "IO")
```

---

## 🔗 Related Problems

| Problem                   | Difficulty | Link                                                              |
| ------------------------- | ---------- | ----------------------------------------------------------------- |
| Excel Sheet Column Title  | Easy       | [LC 168](https://leetcode.com/problems/excel-sheet-column-title)  |
| Number to Words           | Hard       | [LC 273](https://leetcode.com/problems/integer-to-english-words)  |
| Encode and Decode TinyURL | Medium     | [LC 535](https://leetcode.com/problems/encode-and-decode-tinyurl) |
