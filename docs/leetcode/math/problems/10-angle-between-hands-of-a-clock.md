---
layout: page
title: "Angle Between Hands of a Clock"
difficulty: Medium
category: Math
tags: [Math]
leetcode_url: "https://leetcode.com/problems/angle-between-hands-of-a-clock"
---

# Angle Between Hands of a Clock / Góc Giữa Hai Kim Đồng Hồ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math — Geometry
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Minimum Time Difference](https://leetcode.com/problems/minimum-time-difference) | [Find Missing Observations](https://leetcode.com/problems/find-missing-observations)

---

## 🧠 Intuition / Tư Duy

**Analogy (🇻🇳):** Chiếc đồng hồ có 360°. Kim phút quay đều: 360°/60 = **6°/phút**. Kim giờ chậm hơn: 360°/12 giờ = **30°/giờ**, cộng thêm **0.5°/phút** (vì nó cũng di chuyển theo phút). Tính góc mỗi kim từ số 12, rồi lấy hiệu tuyệt đối và chọn góc nhỏ hơn (≤ 180°).

**Pattern Recognition:**

- Signal: "clock" + "angle" → công thức trực tiếp, không cần loop
- Kim phút: `minutes × 6` degrees
- Kim giờ: `(hour % 12) × 30 + minutes × 0.5` degrees
- Góc giữa: `|hourAngle - minuteAngle|`, lấy `min(diff, 360 - diff)`
- Chú ý `hour % 12` — hour=12 phải xử lý thành 0°

**Visual — 3:30:**

```
         12 (0°)
          |
  9 ------+------ 3 (90°)
  (270°)  |
          6 (180°)

hour=3, minutes=30:
  Minute hand: 30 × 6  = 180° (at 6)
  Hour hand:   3 × 30 + 30 × 0.5 = 90 + 15 = 105° (between 3 and 4)

  Diff = |105 - 180| = 75°
  min(75, 285) = 75°
```

---

## Problem Description

Given a clock time as `hour` and `minutes`, return the smaller angle (in degrees) formed between the hour and minute hands. ([LeetCode 1344](https://leetcode.com/problems/angle-between-hands-of-a-clock))

Difficulty: Medium | Acceptance: 64.2%

- **Example 1**: hour=12, minutes=30 → `165.0`
- **Example 2**: hour=3, minutes=30 → `75.0`
- **Example 3**: hour=3, minutes=15 → `7.5`

Constraints: `1 ≤ hour ≤ 12`, `0 ≤ minutes ≤ 59`

---

## 📝 Interview Tips

1. **Clarify**: "hour=12 tương đương 0 giờ — cần `hour % 12`" / hour=12 maps to 0°, not 360°
2. **Two formulas**: "Kim phút = min×6; Kim giờ = hour%12×30 + min×0.5" / Memorize both formulas
3. **Smaller arc**: "Góc có thể > 180°; luôn trả về min(angle, 360−angle)" / Always return the smaller of the two arcs
4. **Float result**: "Kết quả có thể là .5° (vd: 3:15 → 7.5°)" / Result is multiple of 0.5, often fractional
5. **Edge cases**: "12:00 → 0°; 6:00 → 180°; 3:00 → 90°" / These are clean reference angles to verify
6. **Follow-up**: "Trả về radian thay vì degree?" / Multiply final answer by Math.PI / 180

---

## Solutions

```typescript
/**
 * Solution 1: Direct Formula (optimal — only one approach needed)
 * Time: O(1)
 * Space: O(1)
 *
 * Minute hand speed: 360° / 60 min = 6°/min
 * Hour hand speed:   360° / 12 hr  = 30°/hr = 0.5°/min
 * Return the smaller of the two possible arcs between the hands.
 */
function angleClock(hour: number, minutes: number): number {
  const minuteAngle = minutes * 6; // 6° per minute
  const hourAngle = (hour % 12) * 30 + minutes * 0.5; // 30° per hour + drift

  const diff = Math.abs(hourAngle - minuteAngle);
  return Math.min(diff, 360 - diff);
}

/**
 * Solution 2: Step-by-Step (same complexity, more readable for interviews)
 * Time: O(1)
 * Space: O(1)
 */
function angleClockVerbose(hour: number, minutes: number): number {
  const FULL_CIRCLE = 360;
  const HOURS_ON_CLOCK = 12;
  const MINS_ON_CLOCK = 60;

  // Minute hand: completes full circle in 60 minutes
  const minuteAngle = (minutes / MINS_ON_CLOCK) * FULL_CIRCLE;

  // Hour hand: completes full circle in 12 hours, also drifts with minutes
  const hourAngle =
    ((hour % HOURS_ON_CLOCK) / HOURS_ON_CLOCK) * FULL_CIRCLE +
    (minutes / MINS_ON_CLOCK) * (FULL_CIRCLE / HOURS_ON_CLOCK);

  const rawDiff = Math.abs(hourAngle - minuteAngle);
  return Math.min(rawDiff, FULL_CIRCLE - rawDiff);
}

// === Test Cases ===
console.log(angleClock(12, 30)); // 165.0
console.log(angleClock(3, 30)); // 75.0
console.log(angleClock(3, 15)); // 7.5
console.log(angleClock(6, 0)); // 180.0
console.log(angleClock(12, 0)); // 0.0
console.log(angleClock(1, 57)); // 76.5
```

---

## 🔗 Related Problems

- [Minimum Time Difference](https://leetcode.com/problems/minimum-time-difference) — clock arithmetic and circular distance
- [Number of Minutes to Finish Race](https://leetcode.com/problems/minimum-speed-to-arrive-on-time) — time/rate calculations
- [Check if the Sentence Is Pangram](https://leetcode.com/problems/check-if-the-sentence-is-pangram) — simple counting/checking pattern
- [Find Closest Number to Zero](https://leetcode.com/problems/find-closest-number-to-zero) — absolute difference minimization
- [Angle Between Hands of a Clock — LeetCode](https://leetcode.com/problems/angle-between-hands-of-a-clock) — problem page
