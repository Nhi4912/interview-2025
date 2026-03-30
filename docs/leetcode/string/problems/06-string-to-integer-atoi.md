---
layout: page
title: "String to Integer (atoi)"
difficulty: Medium
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/string-to-integer-atoi/"
---

# String to Integer (atoi) / Chuyển Chuỗi Thành Số Nguyên

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: State Machine / String Parsing
> **Frequency**: 📘 Tier 2 — Edge case gauntlet; tests disciplined parsing under many conditions
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Reverse Integer](./02-reverse-integer.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng một robot đọc bảng giá: nó bỏ qua khoảng trắng đầu, nhìn dấu `+`/`-`, đọc từng chữ số cho đến khi gặp chữ cái hoặc hết chuỗi, rồi kẹp kết quả vào phạm vi 32-bit. Robot không quay lại — chỉ đọc tiến một chiều.
- **Pattern Recognition:**
  - Parsing có thứ tự → State Machine: `whitespace → sign → digits → stop`
  - Overflow phải check TRƯỚC khi nhân 10 — không phải sau
  - "Clamp" (kẹp) không phải "return 0" như Reverse Integer — đọc đề kỹ!
- **Visual — `s = "   -42abc"`:**

```
State:  [START] ──spaces──▶ [SIGN] ──'-'──▶ [DIGITS] ──'a'──▶ [STOP]
         "   "               "-"              "42"               "abc" ignored

i=0: ' ' → skip (whitespace state)
i=1: ' ' → skip
i=2: ' ' → skip
i=3: '-' → sign = -1, advance
i=4: '4' → digit=4, result = 0*10+4 = 4
i=5: '2' → digit=2, result = 4*10+2 = 42
i=6: 'a' → not digit → STOP

return -1 * 42 = -42 ✓
```

## Problem Description

Implement `myAtoi(s)`: skip leading spaces, read optional sign, read digits until non-digit, clamp to `[-2³¹, 2³¹−1]`.

```
Input: s = "42"              → Output: 42
Input: s = "   -42"          → Output: -42
Input: s = "4193 with words" → Output: 4193
Input: s = "-91283472332"    → Output: -2147483648  (clamped to INT_MIN)
```

## 📝 Interview Tips

1. **List all edge cases before coding** / Trước khi code, liệt kê: khoảng trắng, dấu, overflow, chuỗi rỗng, chữ cái đầu.
2. **Clamp, don't return 0** / Khác với Reverse Integer: overflow → clamp về `INT_MAX`/`INT_MIN`, không phải `0`.
3. **Check overflow before multiplying** / `result > 214748364` → overflow chắc chắn; `=== 214748364 && digit > 7` → cũng overflow.
4. **Sign affects clamp direction** / `sign === 1 ? INT_MAX : INT_MIN` — không phải lúc nào cũng clamp về INT_MAX.
5. **Only one sign character allowed** / `"+-12"` → trả về `0` vì `+` đã đọc, gặp `-` là stop digit.
6. **Regex shortcut exists but misses overflow** / `parseInt(s.trim().match(/^[+-]?\d+/)?.[0])` — OK nếu dùng BigInt để clamp chính xác.

## Solutions

{% raw %}
/\*\*

- Solution 1 — Brute: Regex + parseInt
- Time: O(n) Space: O(n) — regex match allocates string
- Concise but relies on JS parseInt overflow behavior (not safe for all edge cases).
  \*/
  function myAtoiRegex(s: string): number {
  const match = s.trim().match(/^[+-]?\d+/);
  if (!match) return 0;
  const num = parseInt(match[0]);
  return Math.max(-2147483648, Math.min(2147483647, num));
  }

/\*\*

- Solution 2 — Optimal: State Machine
- Time: O(n) Space: O(1)
- Single pass: skip whitespace → read sign → read digits with overflow guard → clamp.
  \*/
  function myAtoi(s: string): number {
  const INT_MAX = 2147483647;
  const INT_MIN = -2147483648;
  let i = 0;
  let sign = 1;
  let result = 0;

// State 1: skip leading whitespace
while (i < s.length && s[i] === " ") i++;

// State 2: optional sign
if (i < s.length && (s[i] === "+" || s[i] === "-")) {
sign = s[i] === "-" ? -1 : 1;
i++;
}

// State 3: read digits with overflow check
while (i < s.length && s[i] >= "0" && s[i] <= "9") {
const digit = s[i].charCodeAt(0) - 48;

    if (result > Math.floor(INT_MAX / 10)) return sign === 1 ? INT_MAX : INT_MIN;
    if (result === Math.floor(INT_MAX / 10) && digit > 7) return sign === 1 ? INT_MAX : INT_MIN;

    result = result * 10 + digit;
    i++;

}

return sign \* result;
}

// Inline tests
console.assert(myAtoi("42") === 42, "simple positive: expected 42");
console.assert(myAtoi(" -42") === -42, "negative with spaces: expected -42");
console.assert(myAtoi("4193 with words") === 4193, "trailing text: expected 4193");
console.assert(myAtoi("-91283472332") === -2147483648, "overflow neg: expected INT_MIN");
{% endraw %}

## 🔗 Related Problems

- [7. Reverse Integer](./02-reverse-integer.md) — same overflow guard logic, but returns 0 (not clamp)
- [65. Valid Number](https://leetcode.com/problems/valid-number/) — stricter parsing, same state-machine approach
- [273. Integer to English Words](https://leetcode.com/problems/integer-to-english-words/) — inverse direction
- [9. Palindrome Number](https://leetcode.com/problems/palindrome-number/) — digit manipulation sibling
