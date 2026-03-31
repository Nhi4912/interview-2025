---
layout: page
title: "Rising Temperature"
difficulty: Easy
category: Others
tags: [Database]
leetcode_url: "https://leetcode.com/problems/rising-temperature"
---

# Rising Temperature / Nhiệt Độ Tăng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Self-JOIN / LAG Window Function
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Average Time of Process per Machine](https://leetcode.com/problems/average-time-of-process-per-machine) | [Consecutive Numbers](https://leetcode.com/problems/consecutive-numbers)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Bạn đang theo dõi nhiệt độ mỗi ngày. Muốn biết "hôm nay nóng hơn hôm qua không?", bạn so sánh nhiệt độ hôm nay với nhiệt độ đúng ngày hôm qua. Trong SQL, đây là bài toán so sánh giữa hai dòng liên tiếp theo thời gian — dùng self-JOIN hoặc LAG().

**Pattern Recognition:**

- Signal: "compare row with previous day" → **Self-JOIN** on `DATEDIFF(w1.recordDate, w2.recordDate) = 1`
- Or: **LAG() window function** to access previous row's value
- Key insight: `DATEDIFF` so sánh ngày chính xác, không dùng `id - 1` vì dữ liệu có thể thiếu ngày

**Visual:**

```
Weather table:
id | recordDate | temperature
1  | 2015-01-01 | 10
2  | 2015-01-02 | 25   ← 25 > 10, yesterday = Jan 1 ✅
3  | 2015-01-03 | 20   ← 20 < 25, NOT rising ❌
4  | 2015-01-04 | 30   ← 30 > 20, yesterday = Jan 3 ✅

Self-JOIN w1=today, w2=yesterday:
w1.date=Jan2, w2.date=Jan1 → 25>10 → include id=2
w1.date=Jan3, w2.date=Jan2 → 20<25 → exclude id=3
w1.date=Jan4, w2.date=Jan3 → 30>20 → include id=4

Result: [2, 4]
```

---

## Problem Description

Given `Weather(id, recordDate, temperature)`, find all dates' `id` where the temperature is **higher than the previous day**. Days may not be consecutive — use date arithmetic, not id arithmetic.

**Example:** Dates Jan1=10°, Jan2=25°, Jan3=20°, Jan4=30° → ids `[2, 4]`

**Constraints:** `1 <= n <= 500`, each date appears at most once, all dates valid.

---

## 📝 Interview Tips

1. **Use DATEDIFF not id difference**: "id không đảm bảo liên tiếp, phải so ngày bằng DATEDIFF" / Gaps in ids can exist; always compare actual dates
2. **Self-JOIN direction**: "w1 là hôm nay, w2 là hôm qua: DATEDIFF(w1.date, w2.date) = 1" / DATEDIFF(today, yesterday) = 1 (positive)
3. **LAG alternative**: "LAG(temperature, 1) OVER (ORDER BY recordDate) lấy nhiệt độ hôm qua" / More efficient, no join needed
4. **NULL handling**: "Ngày đầu tiên không có hôm qua, LAG trả về NULL" / WHERE clause with NULL comparison safely excludes first record
5. **Edge case**: "Chỉ có 1 ngày → không có ngày trước → kết quả rỗng" / Single-row table returns empty result
6. **Return id**: "Trả về id, không phải date" / The output is the id column, not the date

---

## Solutions

### SQL Solution 1 — Self-JOIN with DATEDIFF (Classic)

```sql
-- Time: O(n²) worst case — cross join filtered by date condition
-- Space: O(1)
SELECT w1.id
FROM Weather w1
JOIN Weather w2
  ON DATEDIFF(w1.recordDate, w2.recordDate) = 1
 AND w1.temperature > w2.temperature;
```

### SQL Solution 2 — LAG Window Function (Modern, Efficient)

```sql
-- Time: O(n log n) — sort once for window
-- Space: O(n) — window function buffer
SELECT id
FROM (
    SELECT id,
           temperature,
           LAG(temperature) OVER (ORDER BY recordDate) AS prev_temp,
           LAG(recordDate)  OVER (ORDER BY recordDate) AS prev_date,
           recordDate
    FROM Weather
) t
WHERE temperature > prev_temp
  AND DATEDIFF(recordDate, prev_date) = 1;  -- ensure consecutive days
```

### SQL Solution 3 — Subquery Approach

```sql
SELECT w1.id
FROM Weather w1
WHERE w1.temperature > (
    SELECT w2.temperature
    FROM Weather w2
    WHERE w2.recordDate = DATE_SUB(w1.recordDate, INTERVAL 1 DAY)
);
```

### TypeScript Simulation

```typescript
/**
 * Simulate: Rising Temperature
 * Time: O(n log n) — sort by date
 * Space: O(n) — sorted copy
 */
interface WeatherRecord {
  id: number;
  recordDate: string;
  temperature: number;
}

function risingTemperature(weather: WeatherRecord[]): number[] {
  // Sort by date ascending
  const sorted = [...weather].sort(
    (a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime(),
  );

  const result: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const today = sorted[i];
    const yesterday = sorted[i - 1];
    const diffMs = new Date(today.recordDate).getTime() - new Date(yesterday.recordDate).getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays === 1 && today.temperature > yesterday.temperature) {
      result.push(today.id);
    }
  }

  return result;
}

// === Test Cases ===
const weather = [
  { id: 1, recordDate: "2015-01-01", temperature: 10 },
  { id: 2, recordDate: "2015-01-02", temperature: 25 },
  { id: 3, recordDate: "2015-01-03", temperature: 20 },
  { id: 4, recordDate: "2015-01-04", temperature: 30 },
];
console.log(risingTemperature(weather)); // [2, 4]

// Edge: only one record
console.log(risingTemperature([{ id: 1, recordDate: "2020-01-01", temperature: 15 }])); // []

// Edge: gap in dates (Jan1 → Jan3, skip Jan2)
const gapped = [
  { id: 1, recordDate: "2020-01-01", temperature: 10 },
  { id: 2, recordDate: "2020-01-03", temperature: 30 }, // not consecutive
];
console.log(risingTemperature(gapped)); // [] — gap means not "previous day"
```

---

## 🔗 Related Problems

- [Average Time of Process per Machine](https://leetcode.com/problems/average-time-of-process-per-machine) — self-join on paired rows
- [Consecutive Numbers](https://leetcode.com/problems/consecutive-numbers) — compare adjacent rows
- [Last Person to Fit in the Bus](https://leetcode.com/problems/last-person-to-fit-in-the-bus) — window function + ordering
- [Game Play Analysis I](https://leetcode.com/problems/game-play-analysis-i) — MIN date per group
