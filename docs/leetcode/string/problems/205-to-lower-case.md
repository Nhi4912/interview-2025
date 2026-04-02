---
layout: page
title: "To Lower Case"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/to-lower-case"
---

# To Lower Case / Chuyển Thành Chữ Thường

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Phép so sánh:** Giống bảng chữ cái — chữ hoa A-Z có mã ASCII 65-90, chữ thường a-z có mã 97-122. Khoảng cách luôn là 32. Dùng bit OR với 32 (`| 0x20`) để bật bit thứ 5, chuyển hoa → thường.

```
ASCII trick:
 'A' = 65  = 0100 0001
 'a' = 97  = 0110 0001
 diff = 32 = 0010 0000

 'A' | 32 = 97 = 'a'  ✓
 'Z' | 32 = 122 = 'z' ✓
 'a' | 32 = 97 = 'a'  (already lower, no change)
 '5' | 32 = unchanged (non-alpha bit patterns safe)
```

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — To Lower Case example:**

```typescript
function toLowerCase(s: string): string {
  return s
    .split("")
    .map((ch) => {
      const code = ch.charCodeAt(0);
      // Uppercase A-Z: 65-90
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(code + 32);
      }
      return ch;
    })
    .join("");
}
```

---

## Problem Description

Given a string `s`, return the string with all uppercase letters converted to lowercase.

**Example 1:** `"Hello"` → `"hello"`

**Example 2:** `"here"` → `"here"`

**Example 3:** `"LOVELY"` → `"lovely"`

**Constraints:** `1 <= s.length <= 100`, s consists of printable ASCII characters

---

## 📝 Interview Tips

- **Built-in:** `s.toLowerCase()` — always mention the obvious solution first in interviews
- **Manual ASCII:** Check `ch >= 'A' && ch <= 'Z'`, then add 32 to char code
- **Bit trick:** `ch.charCodeAt(0) | 32` converts uppercase to lowercase (safe for letters only)
- **Why manual?** Interview may restrict built-ins — shows understanding of ASCII table
- **Edge cases:** Non-alpha chars (digits, symbols) must pass through unchanged
- **Complexity:** O(n) time, O(n) space for result string

---

## Solutions

```typescript
function toLowerCase(s: string): string {
  return s.toLowerCase();
}

function toLowerCase(s: string): string {
  return s
    .split("")
    .map((ch) => {
      const code = ch.charCodeAt(0);
      // Uppercase A-Z: 65-90
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(code + 32);
      }
      return ch;
    })
    .join("");
}

function toLowerCase(s: string): string {
  const result: string[] = [];
  for (const ch of s) {
    const code = ch.charCodeAt(0);
    // Set bit 5 (value 32) to convert uppercase → lowercase
    // Safe because for lowercase and non-alpha, OR with 32 doesn't change letter identity
    if (code >= 65 && code <= 90) {
      result.push(String.fromCharCode(code | 32));
    } else {
      result.push(ch);
    }
  }
  return result.join("");
}
```

---

## 🔗 Related Problems

| #    | Problem                       | Difficulty | Tags          |
| ---- | ----------------------------- | ---------- | ------------- |
| 709  | To Lower Case                 | Easy       | String        |
| 520  | Detect Capital                | Easy       | String        |
| 944  | Delete Columns to Make Sorted | Easy       | Array, String |
| 1170 | Compare Strings by Frequency  | Easy       | String        |
