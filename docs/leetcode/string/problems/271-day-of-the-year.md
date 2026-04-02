---
layout: page
title: "Day of the Year"
difficulty: Easy
category: String
tags: [Math, String]
leetcode_url: "https://leetcode.com/problems/day-of-the-year"
---

# Day of the Year / Ngày Thứ Mấy Trong Năm

> **Track**: String | **Difficulty**: 🟢 Easy | **Pattern**: Date Math
> **Frequency**: Low — bài luyện tập xử lý chuỗi ngày tháng và năm nhuận
> **See also**: [Number of Days Between Two Dates](https://leetcode.com/problems/number-of-days-between-two-dates) | [Count Days Spent Together](https://leetcode.com/problems/count-days-spent-together)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn là một nhà sư đang đếm ngày trong cuốn lịch cổ xưa. Mỗi tháng là một chương sách với số trang cố định (28/29/30/31 ngày). Để biết hôm nay là ngày thứ mấy trong năm, bạn cộng tổng số trang của tất cả các chương trước đó, rồi cộng thêm số trang đã đọc trong chương hiện tại. Điểm tinh tế là tháng 2 có 29 trang nếu năm đó là năm nhuận (chia hết cho 4, trừ khi chia hết cho 100, trừ khi chia hết cho 400).

**Pattern Recognition:**

- Signal: "parse date string" + "sum days in months" → **Array prefix sum + leap year check**
- Bài này thuộc dạng tính toán lịch — parse chuỗi "YYYY-MM-DD" rồi cộng dồn các tháng trước
- Key insight: tạo mảng days-per-month với tháng 2 phụ thuộc vào leap year, rồi `slice(0, month-1).reduce() + day`

**Visual — date = "2024-03-15" (leap year) example:**

```
Parse "2024-03-15" → year=2024, month=3, day=15

Leap year check:
  2024 % 4   = 0  ✓ (divisible by 4)
  2024 % 100 = 24 ≠ 0 → leap = true ✅

Days per month: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                 Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec

Sum months before March (indices 0 and 1):
  Jan=31 + Feb=29 = 60

Add current day: 60 + 15 = 75

Answer: 75
```

---

## Problem Description

Given a string `date` in `"YYYY-MM-DD"` format, return the day number of the year (January 1 = 1, December 31 = 365 or 366 in a leap year). ([LeetCode](https://leetcode.com/problems/day-of-the-year))

```
Example 1: date = "2019-01-09" → 9
Example 2: date = "2019-02-10" → 41    (31 + 10)
Example 3: date = "2003-03-01" → 60    (31 + 28 + 1, not leap)
Example 4: date = "2000-03-01" → 61    (31 + 29 + 1, year 2000 IS leap)
```

Constraints: date format `"YYYY-MM-DD"`, range 1900-01-01 to 2019-12-31.

---

## 📝 Interview Tips

1. **"Leap year has three conditions"** — _Năm nhuận: chia hết 4 VÀ không chia hết 100, HOẶC chia hết 400. Ví dụ: 2000 là nhuận, 1900 không phải._
2. **"Parse with split('-').map(Number)"** — _Cách gọn nhất: `date.split('-').map(Number)` cho `[year, month, day]` trực tiếp._
3. **"month is 1-indexed in string, 0-indexed in array"** — _Tháng 3 → cộng `months.slice(0, 2)` — dùng `m-1` làm slice end._
4. **"Date object alternative: use UTC to avoid timezone"** — _`new Date(date + 'T00:00:00Z')` đảm bảo không lệch múi giờ khi dùng Date API._
5. **"Precompute cumulative days for repeated queries"** — _Nếu query nhiều lần, tính prefix sum một lần rồi dùng lookup O(1)._
6. **"Sum prior months + current day — not current month"** — _Hay nhầm: cộng cả tháng hiện tại vào sum thay vì chỉ lấy phần ngày trong tháng đó._

---

## Solutions

```typescript
/** Solution 1: Month-days array + prefix sum  @complexity Time: O(1) | Space: O(1) */
function dayOfYear(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const months = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return months.slice(0, m - 1).reduce((sum, days) => sum + days, 0) + d;
}

/** Solution 2: Date object (UTC) — no manual leap-year logic  @complexity Time: O(1) | Space: O(1) */
function dayOfYear2(date: string): number {
  const cur = new Date(date + "T00:00:00Z");
  const jan1 = new Date(cur.getUTCFullYear() + "-01-01T00:00:00Z");
  return Math.round((cur.getTime() - jan1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

/** Solution 3: Precomputed cumulative table with leap offset  @complexity Time: O(1) | Space: O(1) */
function dayOfYear3(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  // cumDays[i] = days elapsed before month (i+1), for a non-leap year
  const cumDays = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const leapOffset = isLeap && m > 2 ? 1 : 0;
  return cumDays[m - 1] + leapOffset + d;
}

// === Test Cases ===
console.log(dayOfYear("2019-01-09")); // 9
console.log(dayOfYear("2019-02-10")); // 41
console.log(dayOfYear("2003-03-01")); // 60  (not leap year)
console.log(dayOfYear("2000-03-01")); // 61  (2000 IS leap: 2000%400=0)
console.log(dayOfYear("1900-03-01")); // 60  (1900 NOT leap: 1900%100=0 but %400≠0)
console.log(dayOfYear2("2024-12-31")); // 366 (2024 is leap)
console.log(dayOfYear3("2019-12-31")); // 365
```

---

## 🔗 Related Problems

| #    | Problem                          | Difficulty | Pattern      |
| ---- | -------------------------------- | ---------- | ------------ |
| 1360 | Number of Days Between Two Dates | Easy       | Date Math    |
| 1185 | Day of the Week                  | Easy       | Date Math    |
| 2409 | Count Days Spent Together        | Medium     | Date Math    |
| 12   | Integer to Roman                 | Medium     | Array Lookup |
