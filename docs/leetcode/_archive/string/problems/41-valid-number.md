---
layout: page
title: "Valid Number"
difficulty: Hard
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/valid-number"
---

# Valid Number / Kiểm Tra Số Hợp Lệ

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: String Processing
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Text Justification](https://leetcode.com/problems/text-justification) | [Decode String](https://leetcode.com/problems/decode-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhân viên hải quan kiểm tra hộ chiếu — họ phải xem xét từng phần theo đúng thứ tự: ảnh, ngày hết hạn, chữ ký. Một hộ chiếu hợp lệ cần tất cả các phần đều đúng quy định, thiếu hay sai bất kỳ phần nào là từ chối ngay.

**Pattern Recognition:**

- Signal: "string transformation/validation" → **String Processing**
- Số hợp lệ gồm: số nguyên, số thập phân, ký hiệu khoa học `e/E`
- Key insight: Theo dõi các flag `hasNum`, `hasDot`, `hasE` — thứ tự xuất hiện quyết định tính hợp lệ

**Visual — Valid Number parsing:**

```
Input: "-3.14e+5"
        │ │  │ │└─ digit after e+  ✅
        │ │  │ └── sign after e    ✅
        │ │  └──── 'e' exponent    ✅
        │ └─────── decimal dot     ✅
        └───────── leading sign    ✅

States: [sign?][digits][.digits?] [e/E [sign?] digits]
        └──── integer/decimal ──┘ └─── exponent part ──┘

"-3.14e+5" → hasNum=true, hasDot=true, hasE=true → VALID ✅
"99e2.5"   → dot after 'e' → INVALID ❌
"--6"      → two signs → INVALID ❌
```

---

## Problem Description

Given a string `s`, return `true` if `s` is a valid number. A valid number can be an integer, a decimal, or a number in scientific notation (with `e` or `E`). Signs (`+`/`-`) are optional. A decimal must have at least one digit. Scientific notation requires digits before and after `e/E`.

**Example 1:** `s = "2"` → `true`
**Example 2:** `s = "e3"` → `false` (no digit before `e`)
**Example 3:** `s = "99e2.5"` → `false` (decimal after `e`)
**Example 4:** `s = "-90E3"` → `true`

Constraints:

- `1 <= s.length <= 20`
- `s` consists of English letters, digits, `+`, `-`, or `.`

---

## 📝 Interview Tips

1. **Clarify (VN)**: "Số khoa học như `1e10` có hợp lệ không?" / **EN**: Confirm if scientific notation `e/E` is allowed
2. **Brute force (VN)**: "Dùng regex để match các pattern hợp lệ" / **EN**: Regex can match all valid patterns in one shot
3. **Optimize (VN)**: "Dùng state machine — theo dõi flags hasNum/hasDot/hasE" / **EN**: Track boolean flags as you scan left-to-right
4. **Edge cases (VN)**: "`.5`, `5.`, `+`, `e`, `1e+` đều là invalid" / **EN**: Empty integer part, trailing `e`, sign without digit
5. **Trap (VN)**: "Dấu `+/-` chỉ được ở đầu hoặc ngay sau `e/E`" / **EN**: Sign is only valid at position 0 or right after `e/E`
6. **Follow-up (VN)**: "Nếu cần parse giá trị thực sự thì dùng BigDecimal?" / **EN**: What if you need the actual float value after validation?

---

## Solutions

```typescript
/**
 * Solution 1: Regex — concise one-liner
 * Time: O(n) — regex scan
 * Space: O(1) — no extra storage
 */
function isNumberRegex(s: string): boolean {
  // Pattern: optional sign, then integer or decimal, optional exponent
  return /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(s.trim());
}

/**
 * Solution 2: State Machine (Interview-Friendly)
 * Time: O(n) — single pass
 * Space: O(1) — only flag variables
 *
 * Track three flags:
 *  hasNum  — we've seen at least one digit in current section
 *  hasDot  — we've seen a decimal point
 *  hasE    — we've seen an exponent marker
 * After 'e'/'E', reset hasNum and hasDot flags for the exponent part.
 */
function isNumber(s: string): boolean {
  s = s.trim();
  let hasNum = false;
  let hasDot = false;
  let hasE = false;

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    if (c >= "0" && c <= "9") {
      hasNum = true;
    } else if (c === ".") {
      // Dot invalid after 'e' or second dot
      if (hasE || hasDot) return false;
      hasDot = true;
    } else if (c === "e" || c === "E") {
      // Exponent invalid if already seen, or no digit before it
      if (hasE || !hasNum) return false;
      hasE = true;
      hasNum = false; // reset: need digits after e
    } else if (c === "+" || c === "-") {
      // Sign only valid at start or right after e/E
      if (i !== 0 && s[i - 1] !== "e" && s[i - 1] !== "E") return false;
    } else {
      return false; // unknown character
    }
  }

  return hasNum; // must end with at least one digit
}

// === Test Cases ===
console.log(isNumber("2")); // true
console.log(isNumber("0089")); // true
console.log(isNumber("-0.1")); // true
console.log(isNumber("+3.14")); // true
console.log(isNumber("4.")); // true
console.log(isNumber("-.9")); // true
console.log(isNumber("2e10")); // true
console.log(isNumber("-90E3")); // true
console.log(isNumber("53.5e93")); // true
console.log(isNumber("abc")); // false
console.log(isNumber("1e")); // false
console.log(isNumber("e3")); // false
console.log(isNumber("99e2.5")); // false
console.log(isNumber("--6")); // false
```

---

## 🔗 Related Problems

| Problem                                                                        | Pattern           | Difficulty |
| ------------------------------------------------------------------------------ | ----------------- | ---------- |
| [Text Justification](https://leetcode.com/problems/text-justification)         | Simulation        | 🔴 Hard    |
| [Decode String](https://leetcode.com/problems/decode-string)                   | Stack             | 🟡 Medium  |
| [Simplify Path](https://leetcode.com/problems/simplify-path)                   | Stack             | 🟡 Medium  |
| [Atoi String to Integer](https://leetcode.com/problems/string-to-integer-atoi) | String Processing | 🟡 Medium  |
| [Valid Number — LeetCode](https://leetcode.com/problems/valid-number)          | String Processing | 🔴 Hard    |
