---
layout: page
title: "Reformat Date"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/reformat-date"
---

# Reformat Date / Định Dạng Lại Ngày Tháng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Processing
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống dịch lịch từ tiếng Anh sang ISO — tách chuỗi thành 3 phần (ngày, tháng, năm), tra bảng tháng, rồi ghép lại theo format `YYYY-MM-DD`.

**Pattern Recognition:**

- Input format: `"Day Month Year"` → `"20th Oct 2052"`
- Cần: strip suffix (st/nd/rd/th) từ ngày, map tháng → số, pad zero
- Split by space → 3 tokens, xử lý từng token

```
Input: "20th Oct 2052"
       ↓ split(" ")
tokens: ["20th", "Oct", "2052"]

"20th" → strip non-digits → "20" → padStart(2,'0') → "20"
"Oct"  → MONTHS map → 10 → padStart(2,'0') → "10"
"2052" → keep as-is → "2052"

Output: "2052-10-20" ✅
```

---

## Problem Description

Given a date string in the form `"Day Month Year"` (e.g. `"20th Oct 2052"`), reformat it to `"YYYY-MM-DD"`. Day has ordinal suffix (st/nd/rd/th), month is 3-letter English abbreviation, year is 4-digit.

**Examples:**

- `"20th Oct 2052"` → `"2052-10-20"`
- `"6th Jun 1933"` → `"1933-06-06"`
- `"26th May 1960"` → `"1960-05-26"`

**Constraints:** Date is always valid; day 1–31, months Jan–Dec

---

## 📝 Interview Tips

- 🇻🇳 Dùng `replace(/\D/g, '')` để strip suffix ordinal (st/nd/rd/th) từ ngày
- 🇺🇸 Map month abbrev to 2-digit string upfront; covers all 12 months
- 🇻🇳 `padStart(2, '0')` để đảm bảo day/month luôn 2 chữ số
- 🇺🇸 `split(' ')` gives exactly 3 tokens — reliable for this input format
- 🇻🇳 Không cần regex phức tạp — bài này là string manipulation đơn giản
- 🇺🇸 Alternative: use `parseInt` to strip the suffix, then format

---

## Solutions

### Solution 1 — Direct String Parsing

```typescript
/**
 * Split, map month, strip day suffix, pad zeros
 * Time: O(1) — fixed-size input (date is bounded)
 * Space: O(1)
 */
function reformatDate(date: string): string {
  const MONTHS: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const [dayStr, monthStr, year] = date.split(" ");
  // Strip ordinal suffix: "20th" → "20", "3rd" → "3"
  const day = dayStr.replace(/\D/g, "").padStart(2, "0");
  const month = MONTHS[monthStr];

  return `${year}-${month}-${day}`;
}

// Test cases
console.log(reformatDate("20th Oct 2052")); // "2052-10-20"
console.log(reformatDate("6th Jun 1933")); // "1933-06-06"
console.log(reformatDate("26th May 1960")); // "1960-05-26"
console.log(reformatDate("1st Jan 2000")); // "2000-01-01"
```

### Solution 2 — parseInt Approach

```typescript
/**
 * Use parseInt to auto-strip non-numeric suffix
 * parseInt("20th") === 20, parseInt("3rd") === 3
 * Time: O(1), Space: O(1)
 */
function reformatDate2(date: string): string {
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const parts = date.split(" ");
  const day = String(parseInt(parts[0])).padStart(2, "0");
  const month = String(MONTHS.indexOf(parts[1]) + 1).padStart(2, "0");
  const year = parts[2];
  return `${year}-${month}-${day}`;
}

console.log(reformatDate2("20th Oct 2052")); // "2052-10-20"
console.log(reformatDate2("1st Jan 2000")); // "2000-01-01"
```

---

## 🔗 Related Problems

- [8 - String to Integer (atoi)](https://leetcode.com/problems/string-to-integer-atoi/) — parsing digits from string with suffix
- [14 - Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/) — string manipulation
- [271 - Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings/) — string formatting
- [38 - Count and Say](https://leetcode.com/problems/count-and-say/) — string building pattern
