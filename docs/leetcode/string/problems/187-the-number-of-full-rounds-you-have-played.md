---
layout: page
title: "The Number of Full Rounds You Have Played"
difficulty: Medium
category: String
tags: [Math, String]
leetcode_url: "https://leetcode.com/problems/the-number-of-full-rounds-you-have-played"
---

# The Number of Full Rounds You Have Played / Số Vòng Chơi Hoàn Chỉnh

🟡 Medium | Math, String

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Các vòng chơi bắt đầu vào phút 0, 15, 30, 45 mỗi giờ. Bạn chỉ tính vòng hoàn chỉnh nếu bắt đầu trước hoặc đúng lúc vòng đó bắt đầu VÀ kết thúc sau hoặc đúng lúc vòng đó kết thúc.

```
startTime = "12:01"  finishTime = "12:44"
→ start_min = 12*60+1  = 721
→ end_min   = 12*60+44 = 764
→ first round starts at ceil(721/15)*15 = 735 (12:15)
→ last  round ends   at floor(764/15)*15 = 750 (12:30)
→ rounds = (750-735)/15 = 1
```

## Problem Description

A game has rounds that start every 15 minutes (at xx:00, xx:15, xx:30, xx:45). Given a start time and finish time as `"HH:MM"` strings, return the number of **full rounds** you played. If `finishTime < startTime`, the game crosses midnight.

- **Example 1:** `startTime = "12:01"`, `finishTime = "12:44"` → `1`
- **Example 2:** `startTime = "20:00"`, `finishTime = "06:00"` → `40` (crosses midnight)

## 📝 Interview Tips

- **🇻🇳 Chuyển sang phút** — HH\*60 + MM giúp tính toán dễ hơn / Convert to minutes first
- **🇻🇳 Vượt nửa đêm** → cộng thêm 24*60 vào thời gian kết thúc / Midnight crossing → add 24*60 to finish
- **🇻🇳 Vòng đầu tiên** = ceil(start/15) * 15 / First valid round start = ceil(start/15)*15
- **🇻🇳 Vòng cuối cùng** = floor(end/15) * 15 / Last valid round end = floor(end/15)*15
- **🇻🇳 Kết quả** = max(0, (end_rounded - start_rounded) / 15) / Result = max(0, diff/15)
- **🇻🇳 Edge** → nếu start == finish và không qua nửa đêm → 0 rounds / If equal and no midnight cross → 0

## Solutions

### Solution 1: Convert to Minutes, Handle Midnight

```typescript
/**
 * Convert to minutes, handle midnight crossing
 * Time: O(1)  Space: O(1)
 */
function numberOfRounds(startTime: string, finishTime: string): number {
  const toMinutes = (t: string): number => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  let start = toMinutes(startTime);
  let end = toMinutes(finishTime);

  // Handle midnight crossing
  if (end < start) end += 24 * 60;

  // Round start UP to next 15-min mark
  const roundedStart = Math.ceil(start / 15) * 15;
  // Round end DOWN to previous 15-min mark
  const roundedEnd = Math.floor(end / 15) * 15;

  return Math.max(0, (roundedEnd - roundedStart) / 15);
}

// Test cases
console.log(numberOfRounds("12:01", "12:44")); // 1
console.log(numberOfRounds("20:00", "06:00")); // 40
console.log(numberOfRounds("00:00", "23:59")); // 95
console.log(numberOfRounds("00:00", "00:00")); // 0
console.log(numberOfRounds("01:29", "01:31")); // 0
```

### Solution 2: Explicit Round Counting

```typescript
/**
 * Find first and last valid round explicitly
 * Time: O(1)  Space: O(1)
 */
function numberOfRoundsV2(startTime: string, finishTime: string): number {
  const parse = (t: string): number => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  let s = parse(startTime);
  let e = parse(finishTime);
  if (e < s) e += 1440; // 24 * 60

  // First full round starts at the nearest multiple of 15 >= s
  const firstRoundStart = Math.ceil(s / 15) * 15;
  // Last full round ends at the nearest multiple of 15 <= e
  const lastRoundEnd = Math.floor(e / 15) * 15;

  if (lastRoundEnd <= firstRoundStart) return 0;
  return (lastRoundEnd - firstRoundStart) / 15;
}

// Test cases
console.log(numberOfRoundsV2("12:01", "12:44")); // 1
console.log(numberOfRoundsV2("20:00", "06:00")); // 40
console.log(numberOfRoundsV2("00:30", "00:45")); // 1
```

### Solution 3: Bit Manipulation (Integer Division)

```typescript
/**
 * Use integer division directly — no ceil/floor
 * Time: O(1)  Space: O(1)
 */
function numberOfRoundsV3(startTime: string, finishTime: string): number {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = finishTime.split(":").map(Number);

  let s = sh * 60 + sm;
  let e = eh * 60 + em;
  if (e < s) e += 1440;

  // Integer division gives floor; for ceiling: Math.ceil(s/15) = ~~((s+14)/15)
  const startRound = ~~((s + 14) / 15); // ceil
  const endRound = ~~(e / 15); // floor

  return Math.max(0, endRound - startRound);
}

// Test cases
console.log(numberOfRoundsV3("12:01", "12:44")); // 1
console.log(numberOfRoundsV3("20:00", "06:00")); // 40
console.log(numberOfRoundsV3("00:00", "23:59")); // 95
```

## 🔗 Related Problems

| Problem                                                                                                                                       | Difficulty | Similarity            |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| [Minimum Number of Operations to Make Array Continuous](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/) | 🔴 Hard    | Range / interval math |
| [Meeting Rooms](https://leetcode.com/problems/meeting-rooms/)                                                                                 | 🟢 Easy    | Time interval logic   |
| [Count Positions on Street With Required Brightness](https://leetcode.com/problems/count-positions-on-street-with-required-brightness/)       | 🟡 Medium  | Range math            |
| [Determine if Two Events Have Conflict](https://leetcode.com/problems/determine-if-two-events-have-conflict/)                                 | 🟢 Easy    | Time comparison       |
