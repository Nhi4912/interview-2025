---
layout: page
title: "Alert Using Same Key-Card Three or More Times in a One Hour Period"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, String, Sorting]
leetcode_url: "https://leetcode.com/problems/alert-using-same-key-card-three-or-more-times-in-a-one-hour-period"
---

# Alert Using Same Key-Card Three or More Times in a One Hour Period / Cảnh Báo Dùng Thẻ Ba Lần Trong Một Giờ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map + Sort + Sliding Window

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese analogy**: Mỗi nhân viên có danh sách giờ quẹt thẻ. Sắp xếp theo thời gian. Với mỗi nhân viên, dùng cửa sổ trượt kích thước 3: nếu `times[i] - times[i-2] <= 60` thì họ đã dùng thẻ 3 lần trong 1 giờ → cảnh báo.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Alert Using Same Key-Card Three or More Times in a One Hour Period example:**

```
keyName = ["a","b","a","b","b","a"]
keyTime = ["20:00","17:00","18:00","23:59","01:00","05:00"]

Group by name:
  a → ["18:00","20:00","05:00"] → sort → [300, 320, 305] (minutes)
     sorted minutes: [300, 305, 320]
     window: 320 - 300 = 20 ≤ 60 → ALERT ✓
  b → ["17:00","23:59","01:00"] → minutes: [1020, 1439, 60]
     sorted: [60, 1020, 1439]
     window: 1439 - 60 = 1379 > 60 → no alert

result: ["a"]
```

---

## Problem Description

| #    | Problem                                                | Pattern        |
| ---- | ------------------------------------------------------ | -------------- |
| 1604 | Alert Using Same Key-Card Three or More Times          | This problem   |
| 220  | Contains Duplicate III                                 | Sliding Window |
| 1759 | Count Number of Homogenous Substrings                  | Sliding Window |
| 395  | Longest Substring with At Least K Repeating Characters | Sliding Window |

---

## 📝 Interview Tips

- 🔑 **Convert to minutes** / Chuyển "HH:MM" sang số phút để so sánh dễ hơn
- 🔑 **Group by name** / Gom tất cả lần quẹt thẻ theo tên nhân viên
- 🔑 **Sort per person** / Sort mảng thời gian của từng người tăng dần
- 🔑 **Sliding window size 3** / So sánh `times[i]` và `times[i-2]`: nếu ≤ 60 phút → alert
- 🔑 **Sort names** / Đề yêu cầu kết quả theo thứ tự alphabet
- 🔑 **Edge** / Nhân viên chỉ quẹt < 3 lần không thể bị alert

---

## Solutions

```typescript
// ─── Helper: parse "HH:MM" to total minutes ───
function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// ─── Solution 1: Hash Map + Sort + Sliding Window — O(n log n) ───
function alertNames(keyName: string[], keyTime: string[]): string[] {
  // Group times by employee
  const map = new Map<string, number[]>();
  for (let i = 0; i < keyName.length; i++) {
    const name = keyName[i];
    if (!map.has(name)) map.set(name, []);
    map.get(name)!.push(toMinutes(keyTime[i]));
  }

  const alerts: string[] = [];

  for (const [name, times] of map) {
    times.sort((a, b) => a - b); // sort ascending
    // Check any window of 3 consecutive times within 60 minutes
    for (let i = 2; i < times.length; i++) {
      if (times[i] - times[i - 2] <= 60) {
        alerts.push(name);
        break; // one alert per person
      }
    }
  }

  alerts.sort(); // lexicographic order
  return alerts;
}

console.log(
  alertNames(
    ["a", "b", "a", "b", "b", "a"],
    ["20:00", "17:00", "18:00", "23:59", "01:00", "05:00"],
  ),
); // ["a"]

console.log(
  alertNames(
    ["daniel", "daniel", "daniel", "luis", "luis", "luis"],
    ["10:00", "10:40", "11:00", "09:00", "11:00", "13:00"],
  ),
); // ["daniel"]

// ─── Solution 2: Same logic, destructured parsing ───
function alertNamesV2(keyName: string[], keyTime: string[]): string[] {
  const groups: Map<string, number[]> = new Map();

  for (let i = 0; i < keyName.length; i++) {
    const [hh, mm] = keyTime[i].split(":");
    const mins = +hh * 60 + +mm;
    const arr = groups.get(keyName[i]);
    if (arr) arr.push(mins);
    else groups.set(keyName[i], [mins]);
  }

  const result: string[] = [];
  for (const [name, times] of groups) {
    times.sort((a, b) => a - b);
    for (let i = 2; i < times.length; i++) {
      if (times[i] - times[i - 2] <= 60) {
        result.push(name);
        break;
      }
    }
  }
  return result.sort();
}

console.log(
  alertNamesV2(
    ["a", "b", "a", "b", "b", "a"],
    ["20:00", "17:00", "18:00", "23:59", "01:00", "05:00"],
  ),
); // ["a"]
```

---

## 🔗 Related Problems

| #    | Problem                                                | Pattern        |
| ---- | ------------------------------------------------------ | -------------- |
| 1604 | Alert Using Same Key-Card Three or More Times          | This problem   |
| 220  | Contains Duplicate III                                 | Sliding Window |
| 1759 | Count Number of Homogenous Substrings                  | Sliding Window |
| 395  | Longest Substring with At Least K Repeating Characters | Sliding Window |
