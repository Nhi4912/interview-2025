---
layout: page
title: "Determine if Two Events Have Conflict"
difficulty: Easy
category: String
tags: [Array, String]
leetcode_url: "https://leetcode.com/problems/determine-if-two-events-have-conflict"
---

# Determine if Two Events Have Conflict / Xác Định Hai Sự Kiện Có Xung Đột

🟢 Easy | Array, String

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Hai đoạn thẳng trên trục thời gian có giao nhau không? Hai sự kiện **không** xung đột chỉ khi sự kiện này kết thúc **trước** khi sự kiện kia bắt đầu.

```
Event1: [─────────]      "01:15" → "02:00"
Event2:        [──────]  "02:00" → "03:00"

Overlap at 02:00 → CONFLICT = true

Event1: [─────]          "01:15" → "01:59"
Event2:         [──────] "02:00" → "03:00"

No overlap → CONFLICT = false
```

## Problem Description

Given two events `event1 = [start1, end1]` and `event2 = [start2, end2]` where each time is a string `"HH:MM"`, determine if they **conflict** (have any overlapping time, inclusive of endpoints).

- **Example 1:** `event1 = ["01:15","02:00"]`, `event2 = ["02:00","03:00"]` → `true` (they share 02:00)
- **Example 2:** `event1 = ["01:00","02:00"]`, `event2 = ["02:01","03:00"]` → `false`

## 📝 Interview Tips

- **🇻🇳 Phủ định dễ hơn** — hai đoạn không giao khi A kết trước B bắt đầu HOẶC B kết trước A bắt đầu / Negation is simpler
- **🇻🇳 So sánh chuỗi** "HH:MM" hoạt động vì định dạng cố định / String comparison works — fixed "HH:MM" format is lexicographically consistent
- **🇻🇳 Không cần chuyển sang phút** với bài này / No need to convert to minutes for this problem
- **🇻🇳 Xung đột khi** start1 <= end2 AND start2 <= end1 / Conflict when start1 ≤ end2 AND start2 ≤ end1
- **🇻🇳 Endpoint tính** — inclusive endpoints mean a single shared minute = conflict / Endpoints are inclusive
- **🇻🇳 Classic interval overlap** pattern — memorize for interviews / Memorize the overlap formula

## Solutions

### Solution 1: String Comparison (Simplest)

```typescript
/**
 * Direct string comparison — works because "HH:MM" is lexicographically ordered
 * Time: O(1)  Space: O(1)
 */
function haveConflict(event1: string[], event2: string[]): boolean {
  const [start1, end1] = event1;
  const [start2, end2] = event2;

  // Two events conflict if they overlap
  // They do NOT conflict only if one ends before the other begins
  return !(end1 < start2 || end2 < start1);
}

// Test cases
console.log(haveConflict(["01:15", "02:00"], ["02:00", "03:00"])); // true
console.log(haveConflict(["01:00", "02:00"], ["02:01", "03:00"])); // false
console.log(haveConflict(["10:00", "11:00"], ["14:00", "15:00"])); // false
console.log(haveConflict(["00:00", "23:59"], ["10:00", "11:00"])); // true
```

### Solution 2: Overlap Condition (Positive Form)

```typescript
/**
 * Positive overlap condition: start1 <= end2 AND start2 <= end1
 * Time: O(1)  Space: O(1)
 */
function haveConflictV2(event1: string[], event2: string[]): boolean {
  return event1[0] <= event2[1] && event2[0] <= event1[1];
}

// Test cases
console.log(haveConflictV2(["01:15", "02:00"], ["02:00", "03:00"])); // true
console.log(haveConflictV2(["01:00", "02:00"], ["02:01", "03:00"])); // false
```

### Solution 3: Convert to Minutes for Clarity

```typescript
/**
 * Convert to minutes for explicit numeric comparison
 * Time: O(1)  Space: O(1)
 */
function haveConflictV3(event1: string[], event2: string[]): boolean {
  const toMin = (t: string): number => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const s1 = toMin(event1[0]),
    e1 = toMin(event1[1]);
  const s2 = toMin(event2[0]),
    e2 = toMin(event2[1]);

  // Overlap: max of starts <= min of ends
  return Math.max(s1, s2) <= Math.min(e1, e2);
}

// Test cases
console.log(haveConflictV3(["01:15", "02:00"], ["02:00", "03:00"])); // true
console.log(haveConflictV3(["01:00", "02:00"], ["02:01", "03:00"])); // false
console.log(haveConflictV3(["10:00", "11:00"], ["14:00", "15:00"])); // false
```

## 🔗 Related Problems

| Problem                                                                                                           | Difficulty | Similarity          |
| ----------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| [Meeting Rooms](https://leetcode.com/problems/meeting-rooms/)                                                     | 🟢 Easy    | Interval overlap    |
| [Merge Intervals](https://leetcode.com/problems/merge-intervals/)                                                 | 🟡 Medium  | Interval merging    |
| [Number of Full Rounds You Have Played](https://leetcode.com/problems/the-number-of-full-rounds-you-have-played/) | 🟡 Medium  | Time string math    |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)                             | 🟡 Medium  | Interval scheduling |
