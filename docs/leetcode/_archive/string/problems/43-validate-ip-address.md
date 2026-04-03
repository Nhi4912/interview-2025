---
layout: page
title: "Validate IP Address"
difficulty: Medium
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/validate-ip-address"
---

# Validate IP Address / Kiểm Tra Địa Chỉ IP

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: String Processing
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Text Justification](https://leetcode.com/problems/text-justification) | [Decode String](https://leetcode.com/problems/decode-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhân viên bưu điện kiểm tra địa chỉ gửi thư — IPv4 như số nhà.đường.phường.quận (4 phần, mỗi phần 0–255, không có số 0 thừa ở đầu), còn IPv6 như mã bưu chính quốc tế gồm 8 nhóm ký tự hex. Nhầm định dạng là thư lạc.

**Pattern Recognition:**

- Signal: "string validation" + "two possible formats" → **String Processing with split**
- Nếu có dấu `.` → thử IPv4; nếu có dấu `:` → thử IPv6
- Key insight: Tách chuỗi rồi validate từng phần — xử lý riêng edge cases như leading zeros

**Visual — Validate IP Address:**

```
"172.16.254.1"  → split('.') → ["172","16","254","1"]
  ✅ 4 parts
  ✅ each non-empty, no leading zero, integer 0-255
  → "IPv4"

"2001:0db8:85a3:0:0:8A2E:0370:7334"
  → split(':') → 8 groups
  ✅ 8 parts, each 1-4 hex chars
  → "IPv6"

"256.0.0.1"   → 256 > 255 → "Neither"
"02.0.0.1"    → leading zero → "Neither"
"1.1.1.1."    → trailing dot → 5 parts → "Neither"
```

---

## Problem Description

Given a string `queryIP`, return `"IPv4"` if it is a valid IPv4 address, `"IPv6"` if it is a valid IPv6 address, or `"Neither"` if it is not a valid IP address.

A valid **IPv4** address has exactly 4 decimal integers `[0, 255]` separated by `.` with no leading zeros.
A valid **IPv6** address has exactly 8 groups of 1–4 hexadecimal digits separated by `:`.

**Example 1:** `"172.16.254.1"` → `"IPv4"`
**Example 2:** `"2001:0db8:85a3:0:0:8A2E:0370:7334"` → `"IPv6"`
**Example 3:** `"256.0.0.1"` → `"Neither"`

Constraints:

- `queryIP` consists of English letters, digits, `.`, and `:`

---

## 📝 Interview Tips

1. **Clarify (VN)**: "IPv6 có phân biệt hoa thường không?" / **EN**: IPv6 hex digits are case-insensitive (`a-f` and `A-F` both valid)
2. **Brute force (VN)**: "Split theo delimiter rồi validate từng phần" / **EN**: Split then validate each chunk — clean and readable
3. **Trap IPv4 (VN)**: "Leading zeros: '01' là invalid, nhưng '0' thì OK" / **EN**: `"0"` is valid but `"01"` is not — parse int and compare
4. **Trap IPv6 (VN)**: "Mỗi group phải từ 1–4 ký tự hex, không được rỗng" / **EN**: Empty groups (from `::`) are invalid in this problem
5. **Edge cases (VN)**: "Trailing '.' hay ':' sẽ tạo phần rỗng → invalid" / **EN**: `"1.1.1.1."` splits to 5 parts including empty — catch this
6. **Follow-up (VN)**: "Nếu cần hỗ trợ CIDR notation như `192.168.1.0/24`?" / **EN**: Extend to support CIDR prefix notation

---

## Solutions

```typescript
/**
 * Solution 1: Straightforward split + validate
 * Time: O(n) — single pass through string
 * Space: O(n) — split creates array of parts
 */
function validateIPv4(s: string): boolean {
  const parts = s.split(".");
  if (parts.length !== 4) return false;
  for (const part of parts) {
    if (part.length === 0 || part.length > 3) return false;
    // Leading zero check: "01" invalid, "0" valid
    if (part.length > 1 && part[0] === "0") return false;
    // Must be all digits
    if (!/^\d+$/.test(part)) return false;
    const num = parseInt(part, 10);
    if (num < 0 || num > 255) return false;
  }
  return true;
}

function validateIPv6(s: string): boolean {
  const parts = s.split(":");
  if (parts.length !== 8) return false;
  const hexChars = /^[0-9a-fA-F]{1,4}$/;
  for (const part of parts) {
    if (!hexChars.test(part)) return false;
  }
  return true;
}

/**
 * Solution 2: Combined validator (Optimal)
 * Time: O(n) — split + validate each part
 * Space: O(1) — only a few variables besides the split array
 */
function validIPAddress(queryIP: string): string {
  if (queryIP.includes(".")) {
    return validateIPv4(queryIP) ? "IPv4" : "Neither";
  } else if (queryIP.includes(":")) {
    return validateIPv6(queryIP) ? "IPv6" : "Neither";
  }
  return "Neither";
}

// === Test Cases ===
console.log(validIPAddress("172.16.254.1")); // "IPv4"
console.log(validIPAddress("2001:0db8:85a3:0:0:8A2E:0370:7334")); // "IPv6"
console.log(validIPAddress("256.0.0.1")); // "Neither"
console.log(validIPAddress("2001:0db8:85a3:00000:0:8A2E:0370:7334")); // "Neither" (>4 hex)
console.log(validIPAddress("1.1.1.1.")); // "Neither" (trailing dot)
console.log(validIPAddress("01.01.01.01")); // "Neither" (leading zeros)
console.log(validIPAddress("::1")); // "Neither"
```

---

## 🔗 Related Problems

| Problem                                                                             | Pattern           | Difficulty |
| ----------------------------------------------------------------------------------- | ----------------- | ---------- |
| [Valid Number](https://leetcode.com/problems/valid-number)                          | String Processing | 🔴 Hard    |
| [Decode String](https://leetcode.com/problems/decode-string)                        | Stack             | 🟡 Medium  |
| [Simplify Path](https://leetcode.com/problems/simplify-path)                        | Stack             | 🟡 Medium  |
| [IP to CIDR](https://leetcode.com/problems/ip-to-cidr)                              | String Processing | 🟡 Medium  |
| [Validate IP Address — LeetCode](https://leetcode.com/problems/validate-ip-address) | String Processing | 🟡 Medium  |
