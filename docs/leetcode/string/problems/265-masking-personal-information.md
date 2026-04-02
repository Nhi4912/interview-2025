---
layout: page
title: "Masking Personal Information"
difficulty: Medium
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/masking-personal-information"
---

# Masking Personal Information / Che Giấu Thông Tin Cá Nhân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: String Parsing / Simulation
> **Frequency**: 📘 Tier 2 — Gặp ở 5 companies
> **See also**: [Validate Email Address](https://leetcode.com/problems/detect-capital) | [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hệ thống ngân hàng luôn hiển thị thông tin ẩn danh: email `"John_Smith@example.com"` thành `"j*****h@example.com"`, số điện thoại `"+1-212-555-0100"` thành `"+*-***-***-0100"`. Như cảnh vệ che bảng tên — chỉ để lộ ký tự đầu/cuối email, và 4 số cuối điện thoại. Điểm khó là xử lý đúng hai loại đầu vào (email vs phone), bóc tách phần quan trọng, và định dạng mã quốc gia nếu có. Quy tắc đơn giản: email nhận dạng bởi `@`, phone nhận dạng bởi chỉ còn chữ số sau khi xóa `-()+ `.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Masking Personal Information example:**

```
Email: "LeetCode@LeetCode.com"
  1. lowercase:  "leetcode@leetcode.com"
  2. split @:    local="leetcode", domain="leetcode.com"
  3. mask local: first='l', last='e' → "l*****e"
  4. result:     "l*****e@leetcode.com"

Phone: "+1(123)456-7890"
  1. extract digits: "11234567890"  (11 digits = 10 local + 1 country)
  2. last 4:          "7890"
  3. local format:    "***-***-7890"
  4. prefix:         "+*-" (1 extra digit)
  5. result:          "+*-***-***-7890"

Phone: "1(234)567-8901 x12"  → digits = "123456789012" (12 digits)
  → "+**-***-***-8901" (2 country code digits)
```

---

## Problem Description

Given a personal information string (email or phone), return its masked version:

- **Email**: lowercase, keep first and last char of local part, mask middle 5 chars as `*****`
- **Phone**: keep last 4 digits as `***-***-XXXX`; prepend country code as `+*...* -` (one `*` per extra digit beyond 10)

**Example 1:** `s = "LeetCode@LeetCode.com"` → `"l*****e@leetcode.com"`
**Example 2:** `s = "+86(20)123-4567"` → `"+**-***-***-4567"` (12 digits total, 2 country code)
**Example 3:** `s = "1(555)555-5555"` → `"+*-***-***-5555"` (11 digits, 1 country code)

**Constraints:** `s` is a valid email or phone number per the problem definition

---

## 📝 Interview Tips

- **Email vs Phone detection** / Phân biệt loại: `s.includes('@')` → email; otherwise → phone
- **Email: lowercase first** / Email cần lowercase: Cả local lẫn domain đều cần `toLowerCase()` trước khi xử lý
- **Phone: strip non-digits** / Phone: xóa không phải số: `replace(/\D/g, '')` bỏ tất cả `+-() ` chỉ giữ chữ số
- **Country code length** / Độ dài mã quốc gia: `digits.length - 10` = số ký tự `*` trong prefix (nếu 10 chính xác thì không có prefix)
- **Local mask always 5 stars** / Luôn 5 dấu sao: Email luôn dùng `*****` bất kể độ dài local thực tế
- **Split at first @** / Tách tại @ đầu tiên: Dùng `s.indexOf('@')` thay vì `split('@')` để tránh trường hợp @ trong domain (không hợp lệ nhưng phòng ngừa)

---

## Solutions

```typescript
/**
 * @complexity Time: O(n) | Space: O(n)
 * Detect type, apply appropriate masking rules
 */
function maskPII(s: string): string {
  if (s.includes("@")) {
    // Email: lowercase, mask local middle
    const lower = s.toLowerCase();
    const at = lower.indexOf("@");
    const local = lower.slice(0, at);
    const domain = lower.slice(at + 1);
    return local[0] + "*****" + local[local.length - 1] + "@" + domain;
  } else {
    // Phone: extract digits only
    const digits = s.replace(/\D/g, "");
    const local = "***-***-" + digits.slice(-4);
    const extra = digits.length - 10;
    if (extra === 0) return local;
    return "+" + "*".repeat(extra) + "-" + local;
  }
}

/**
 * @complexity Time: O(n) | Space: O(n)
 * Use regex for cleaner digit extraction and email parsing
 */
function maskPIIRegex(s: string): string {
  const emailMatch = s.match(/^(.+)@(.+)$/);
  if (emailMatch) {
    const local = emailMatch[1].toLowerCase();
    const domain = emailMatch[2].toLowerCase();
    return `${local[0]}*****${local.at(-1)}@${domain}`;
  }
  // Phone
  const digits = s.replace(/\D/g, "");
  const tail = digits.slice(-10);
  const country = digits.slice(0, -10);
  const masked = `***-***-${tail.slice(-4)}`;
  return country.length ? `+${"*".repeat(country.length)}-${masked}` : masked;
}

/**
 * @complexity Time: O(n) | Space: O(1)
 * Pre-define phone prefix strings for common lengths (10-13 digits)
 */
function maskPIITableDriven(s: string): string {
  if (s.includes("@")) {
    const [local, ...rest] = s.toLowerCase().split("@");
    return `${local[0]}*****${local.at(-1)}@${rest.join("@")}`;
  }
  const digits = s.replace(/\D/g, "");
  const PREFIX: Record<number, string> = {
    10: "",
    11: "+*-",
    12: "+**-",
    13: "+***-",
  };
  const prefix = PREFIX[digits.length] ?? `+${"*".repeat(digits.length - 10)}-`;
  return `${prefix}***-***-${digits.slice(-4)}`;
}

// === Test Cases ===
console.log(maskPII("LeetCode@LeetCode.com")); // → "l*****e@leetcode.com"
console.log(maskPII("AB@qq.com")); // → "a*****b@qq.com"
console.log(maskPII("1(234)567-8901")); // → "+*-***-***-8901"
console.log(maskPII("+86(20)123-4567")); // → "+**-***-***-4567"
console.log(maskPIIRegex("1(555)555-5555")); // → "+*-***-***-5555"
console.log(maskPIITableDriven("(234) 567-8901")); // → "***-***-8901"
```

---

## 🔗 Related Problems

| Problem                 | Difficulty | Link                                                            |
| ----------------------- | ---------- | --------------------------------------------------------------- |
| License Key Formatting  | Easy       | [LC 482](https://leetcode.com/problems/license-key-formatting)  |
| Decode the Message      | Easy       | [LC 2325](https://leetcode.com/problems/decode-the-message)     |
| Strong Password Checker | Hard       | [LC 420](https://leetcode.com/problems/strong-password-checker) |
