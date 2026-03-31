---
layout: page
title: "Unique Email Addresses"
difficulty: Easy
category: String
tags: [Array, Hash Table, String]
leetcode_url: "https://leetcode.com/problems/unique-email-addresses"
---

# Unique Email Addresses / Địa Chỉ Email Duy Nhất

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Set + String Parsing
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

## 🧠 Intuition / Tư Duy

> Giống như Google coi `alice.z+spam@leetcode.com` và `alicez@leetcode.com` là cùng một hộp thư — bỏ dấu chấm, bỏ phần sau `+`, rồi đếm địa chỉ duy nhất. Bài toán là parse + normalize + count.

**Pattern Recognition:**

- Signal: "normalize string" + "count unique" → **String Processing + Hash Set**
- Tách local/domain bằng `@`, xử lý local theo hai quy tắc
- Dùng Set để đếm unique tự động

**Visual:**

```
"alice.z+foo@leetcode.com"
  local="alice.z+foo"  domain="leetcode.com"
  1) split at '+' → "alice.z"
  2) remove dots   → "alicez"
  normalized = "alicez@leetcode.com"

"alicez@leetcode.com" → "alicez@leetcode.com"  ← same!
Set size = 1
```

## Problem Description

Each email has a local name and domain separated by `@`. Gmail rules: (1) dots in local name are ignored; (2) everything after `+` in local name is ignored. Return the number of unique email addresses that receive mail.

- **Example 1**: `emails = ["test.email+alex@leetcode.com","test.e.mail+bob.cathy@leetcode.com","testemail+david@lee.tcode.com"]` → `2`
- **Example 2**: `emails = ["a@leetcode.com","b@leetcode.com","c@leetcode.com"]` → `3`

**Constraints**: `1 <= emails.length <= 100`, `1 <= emails[i].length <= 100`, each email is valid.

## 📝 Interview Tips

1. **Clarify**: "Chỉ có dấu chấm và '+' cần xử lý không? Domain giữ nguyên?" / Only dots and plus sign in local, domain untouched
2. **Approach**: "Normalize từng email rồi bỏ vào Set" / Normalize each email then insert into Set
3. **Edge cases**: "Local toàn dấu chấm? '+' ngay đầu?" / All dots in local, '+' at start
4. **Optimize**: "Dùng regex hay manual parse đều được, O(n·L) là tối ưu" / Regex or manual both fine
5. **Test**: `["a.b+x@c.d","ab@c.d"]` → `1` (same after normalize)
6. **Follow-up**: "Nếu có nhiều quy tắc khác nhau theo domain?" / Different rules per domain

## Solutions

```typescript
/** Solution 1: Brute Force — split + replace + Set
 * Time: O(n·L) | Space: O(n·L)
 */
function uniqueEmailAddressesBrute(emails: string[]): number {
  const unique = new Set<string>();
  for (const email of emails) {
    const [local, domain] = email.split("@");
    const noPlus = local.split("+")[0]; // drop everything after +
    const noDots = noPlus.split(".").join(""); // remove dots
    unique.add(noDots + "@" + domain);
  }
  return unique.size;
}

/** Solution 2: Optimized — manual parse, avoid extra split allocations
 * Time: O(n·L) | Space: O(n·L)
 */
function uniqueEmailAddresses(emails: string[]): number {
  const unique = new Set<string>();
  for (const email of emails) {
    const atIdx = email.indexOf("@");
    const domain = email.slice(atIdx + 1);
    const local = email.slice(0, atIdx);
    const plusIdx = local.indexOf("+");
    const effectiveLocal = plusIdx === -1 ? local : local.slice(0, plusIdx);
    let normalized = "";
    for (const ch of effectiveLocal) {
      if (ch !== ".") normalized += ch;
    }
    unique.add(normalized + "@" + domain);
  }
  return unique.size;
}

/** Solution 3: Regex one-liner approach
 * Time: O(n·L) | Space: O(n·L)
 */
function uniqueEmailAddressesRegex(emails: string[]): number {
  return new Set(
    emails.map((e) => {
      const [local, domain] = e.split("@");
      return local.split("+")[0].replace(/\./g, "") + "@" + domain;
    }),
  ).size;
}

// Test cases
console.log(
  uniqueEmailAddresses([
    "test.email+alex@leetcode.com",
    "test.e.mail+bob.cathy@leetcode.com",
    "testemail+david@lee.tcode.com",
  ]),
); // 2
console.log(uniqueEmailAddresses(["a@leetcode.com", "b@leetcode.com", "c@leetcode.com"])); // 3
console.log(uniqueEmailAddresses(["a.b+x@c.d", "ab@c.d"])); // 1
```

## 🔗 Related Problems

| Problem                                                                          | Relationship                        |
| -------------------------------------------------------------------------------- | ----------------------------------- |
| [Defanging an IP Address](https://leetcode.com/problems/defanging-an-ip-address) | String transformation/normalization |
| [Detect Capital](https://leetcode.com/problems/detect-capital)                   | Simple string rule checking         |
| [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)       | Frequency counting with hash map    |
