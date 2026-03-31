---
layout: page
title: "Number of Days Between Two Dates"
difficulty: Easy
category: String
tags: [Math, String]
leetcode_url: "https://leetcode.com/problems/number-of-days-between-two-dates"
---

# Number of Days Between Two Dates / Số Ngày Giữa Hai Ngày

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Date Math
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> Giống như đếm số trang giữa hai trang sách — thay vì đếm từng trang một, bạn chuyển cả hai trang thành số thứ tự (tính từ trang đầu tiên), rồi lấy hiệu. Ở đây, "trang đầu tiên" là ngày 1970-01-01.

**Pattern Recognition:**

- Signal: "difference between two dates" → **Convert to epoch days, subtract**
- Cần xử lý năm nhuận: chia hết 4, ngoại trừ chia hết 100 nhưng chia hết 400 thì nhuận
- Parse string "YYYY-MM-DD", convert to total days from epoch

**Visual:**

```
date1 = "2019-06-29", date2 = "2019-06-30"
days("2019-06-29") = days from 1970-01-01 to 2019-06-29
days("2019-06-30") = days from 1970-01-01 to 2019-06-30
|days2 - days1| = 1

Leap year check: 2020 % 4 == 0 && (2020 % 100 != 0 || 2020 % 400 == 0) → true
```

## Problem Description

Given two dates `date1` and `date2` in format `"YYYY-MM-DD"`, return the absolute difference in days between the two dates.

- **Example 1**: `date1 = "2019-06-29"`, `date2 = "2019-06-30"` → `1`
- **Example 2**: `date1 = "2020-01-15"`, `date2 = "2019-12-31"` → `15`

**Constraints**: Dates are in range `[1971-01-01, 2100-12-31]`, dates are valid, `date1 != date2`.

## 📝 Interview Tips

1. **Clarify**: "Kết quả luôn dương (absolute value)?" / Always absolute value of difference
2. **Approach**: "Convert mỗi ngày sang số ngày kể từ epoch, lấy |diff|" / Convert to days since fixed epoch
3. **Edge cases**: "Năm nhuận như 2000, 1900 (không nhuận), 2100 (không nhuận)" / Century years need extra check
4. **Optimize**: "Date constructor built-in JS/TS cũng được, nhưng manual rõ ràng hơn" / Built-in Date object works too
5. **Test**: `"2000-01-01"` vs `"2000-03-01"` — 60 days (2000 is leap, Feb has 29 days)
6. **Follow-up**: "Nếu cần tính khoảng cách theo tuần, tháng, năm?" / Generalize to other units

## Solutions

```typescript
/** Solution 1: Built-in Date — đơn giản nhất
 * Time: O(1) | Space: O(1)
 */
function daysBetweenBuiltIn(date1: string, date2: string): number {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);
}

/** Solution 2: Manual epoch conversion — không phụ thuộc Date API
 * Time: O(Y) | Space: O(1) — Y = year range (~130 years max)
 */
function daysBetweenTwoDates(date1: string, date2: string): number {
  const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const daysInMonth = (m: number, y: number) => {
    const days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return m === 2 && isLeap(y) ? 29 : days[m];
  };

  const toDays = (date: string): number => {
    const [y, m, d] = date.split("-").map(Number);
    let total = d - 1;
    // Add months in current year
    for (let i = 1; i < m; i++) total += daysInMonth(i, y);
    // Add years from 1970 to y-1
    for (let yr = 1970; yr < y; yr++) total += isLeap(yr) ? 366 : 365;
    return total;
  };

  return Math.abs(toDays(date1) - toDays(date2));
}

/** Solution 3: Zeller/formula approach — direct calculation
 * Time: O(1) | Space: O(1)
 */
function numberOfDaysBetweenTwoDates(date1: string, date2: string): number {
  const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const toAbsDay = (dateStr: string): number => {
    let [y, m, d] = dateStr.split("-").map(Number);
    // Convert to days with Gregorian calendar logic
    // Use Jan 1 of year as reference
    let days = 0;
    // Days in previous years (from year 0)
    days +=
      365 * (y - 1) +
      Math.floor((y - 1) / 4) -
      Math.floor((y - 1) / 100) +
      Math.floor((y - 1) / 400);
    // Days in current year
    for (let i = 1; i < m; i++) days += i === 2 && isLeap(y) ? 29 : monthDays[i];
    days += d;
    return days;
  };

  return Math.abs(toAbsDay(date1) - toAbsDay(date2));
}

// Test cases
console.log(numberOfDaysBetweenTwoDates("2019-06-29", "2019-06-30")); // 1
console.log(numberOfDaysBetweenTwoDates("2020-01-15", "2019-12-31")); // 15
console.log(numberOfDaysBetweenTwoDates("2000-01-01", "2000-03-01")); // 60 (leap year)
console.log(numberOfDaysBetweenTwoDates("1971-06-29", "2010-09-23")); // 14331
```

## 🔗 Related Problems

| Problem                                                                              | Relationship                       |
| ------------------------------------------------------------------------------------ | ---------------------------------- |
| [Day of the Week](https://leetcode.com/problems/day-of-the-week)                     | Similar date-to-number conversion  |
| [Day of the Year](https://leetcode.com/problems/day-of-the-year)                     | Convert date to day-of-year number |
| [Count Days Spent Together](https://leetcode.com/problems/count-days-spent-together) | Date range intersection            |
