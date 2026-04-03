---
layout: page
title: "Average Time of Process per Machine"
difficulty: Easy
category: Others
tags: [Database]
leetcode_url: "https://leetcode.com/problems/average-time-of-process-per-machine"
---

# Average Time of Process per Machine / Thời Gian Xử Lý Trung Bình Mỗi Máy

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Self-JOIN / Conditional Aggregation
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Rising Temperature](https://leetcode.com/problems/rising-temperature) | [Immediate Food Delivery II](https://leetcode.com/problems/immediate-food-delivery-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Bạn có nhật ký máy sản xuất — mỗi tiến trình ghi hai sự kiện: "bắt đầu" (start) và "kết thúc" (end). Muốn tính thời gian xử lý trung bình mỗi máy, bạn ghép mỗi sự kiện start với sự kiện end tương ứng (cùng machine_id + process_id), tính hiệu thời gian, rồi lấy trung bình theo máy.

**Pattern Recognition:**

- Signal: "pair start/end events for same machine+process" → **Self-JOIN** on (machine_id, process_id)
- Alternative: **Conditional AVG** — `AVG(end_time) - AVG(start_time)` when grouped by machine
- Key insight: For each machine, AVG(end) - AVG(start) = AVG(end - start) (algebraically equivalent)

**Visual:**

```
Activity table:
machine_id | process_id | activity_type | timestamp
0          | 0          | start         | 0.712
0          | 0          | end           | 1.520   ← process time = 1.520 - 0.712 = 0.808
0          | 1          | start         | 3.140
0          | 1          | end           | 4.120   ← process time = 4.120 - 3.140 = 0.980
1          | 0          | start         | 0.550
1          | 0          | end           | 1.550   ← process time = 1.000

Machine 0: avg(0.808, 0.980) = 0.894
Machine 1: avg(1.000) = 1.000

Result: machine_id=0 → 0.894, machine_id=1 → 1.000
```

---

## Problem Description

Given `Activity(machine_id, process_id, activity_type, timestamp)` where each process has exactly one 'start' and one 'end' event, compute the **average processing time per machine** (avg of end-start durations). Round to 3 decimal places.

**Example:** Machine 0 has 2 processes taking 0.808 and 0.980 → avg = 0.894.

**Constraints:** `1 <= machines <= 100`, `1 <= processes per machine <= 100`, timestamps are floats.

---

## 📝 Interview Tips

1. **Self-JOIN trick**: "Join bảng với chính nó: a1 là start, a2 là end, cùng machine_id+process_id" / Pair rows by joining on (machine_id, process_id) with different activity_type
2. **Conditional AVG shortcut**: "AVG(end) - AVG(start) = AVG(end-start) — tính gộp không cần join" / Mathematically equivalent: separate AVGs per type then subtract
3. **ROUND to 3 decimals**: "ROUND(x, 3) — đề bài yêu cầu 3 chữ số thập phân" / Output must be rounded to 3 decimal places
4. **Guaranteed pairing**: "Đề bảo đảm mỗi start có đúng một end" / No need to handle unpaired events — the problem guarantees pairs
5. **Machine with 1 process**: "AVG của 1 số = chính số đó — vẫn đúng" / Single-process machines work correctly with AVG
6. **Follow-up**: "Nếu start có thể thiếu end? Cần LEFT JOIN và handle NULL" / Handle missing pairs with COALESCE in real scenarios

---

## Solutions

### SQL Solution 1 — Self-JOIN on (machine_id, process_id)

```sql
-- Time: O(n) — join on indexed columns
-- Space: O(n/2) — n/2 paired rows
SELECT a1.machine_id,
       ROUND(AVG(a2.timestamp - a1.timestamp), 3) AS processing_time
FROM Activity a1
JOIN Activity a2
  ON a1.machine_id  = a2.machine_id
 AND a1.process_id  = a2.process_id
 AND a1.activity_type = 'start'
 AND a2.activity_type = 'end'
GROUP BY a1.machine_id;
```

### SQL Solution 2 — Conditional Aggregation (No Self-JOIN)

```sql
-- AVG(end_times) - AVG(start_times) = AVG(durations)
SELECT machine_id,
       ROUND(
           AVG(CASE WHEN activity_type = 'end'   THEN timestamp ELSE NULL END) -
           AVG(CASE WHEN activity_type = 'start' THEN timestamp ELSE NULL END),
           3
       ) AS processing_time
FROM Activity
GROUP BY machine_id;
```

### SQL Solution 3 — SUM Approach with COUNT

```sql
SELECT machine_id,
       ROUND(
           SUM(CASE WHEN activity_type = 'end'   THEN  timestamp ELSE 0 END) +
           SUM(CASE WHEN activity_type = 'start' THEN -timestamp ELSE 0 END)
           / (COUNT(*) / 2),  -- number of processes = total rows / 2
           3
       ) AS processing_time
FROM Activity
GROUP BY machine_id;
```

### TypeScript Simulation

```typescript
/**
 * Simulate: Average Time of Process per Machine
 * Time: O(n) — single pass through activities
 * Space: O(m) — m distinct machines
 */
interface Activity {
  machine_id: number;
  process_id: number;
  activity_type: "start" | "end";
  timestamp: number;
}

function averageTimePerMachine(
  activities: Activity[],
): Array<{ machine_id: number; processing_time: number }> {
  // Map: machineId → processId → { start?, end? }
  const processes = new Map<number, Map<number, { start?: number; end?: number }>>();

  for (const act of activities) {
    if (!processes.has(act.machine_id)) processes.set(act.machine_id, new Map());
    const machineMap = processes.get(act.machine_id)!;
    if (!machineMap.has(act.process_id)) machineMap.set(act.process_id, {});
    const proc = machineMap.get(act.process_id)!;
    proc[act.activity_type] = act.timestamp;
  }

  const result: Array<{ machine_id: number; processing_time: number }> = [];

  for (const [machine_id, machineMap] of processes) {
    let totalTime = 0;
    let count = 0;
    for (const { start, end } of machineMap.values()) {
      if (start !== undefined && end !== undefined) {
        totalTime += end - start;
        count++;
      }
    }
    const avg = count > 0 ? totalTime / count : 0;
    result.push({ machine_id, processing_time: Math.round(avg * 1000) / 1000 });
  }

  return result.sort((a, b) => a.machine_id - b.machine_id);
}

// === Test Cases ===
const activities = [
  { machine_id: 0, process_id: 0, activity_type: "start" as const, timestamp: 0.712 },
  { machine_id: 0, process_id: 0, activity_type: "end" as const, timestamp: 1.52 },
  { machine_id: 0, process_id: 1, activity_type: "start" as const, timestamp: 3.14 },
  { machine_id: 0, process_id: 1, activity_type: "end" as const, timestamp: 4.12 },
  { machine_id: 1, process_id: 0, activity_type: "start" as const, timestamp: 0.55 },
  { machine_id: 1, process_id: 0, activity_type: "end" as const, timestamp: 1.55 },
  { machine_id: 2, process_id: 0, activity_type: "start" as const, timestamp: 1.0 },
  { machine_id: 2, process_id: 0, activity_type: "end" as const, timestamp: 1.115 },
];

console.log(averageTimePerMachine(activities));
// [{ machine_id: 0, processing_time: 0.894 },
//  { machine_id: 1, processing_time: 1.000 },
//  { machine_id: 2, processing_time: 0.115 }]

// Single process per machine
const single = [
  { machine_id: 1, process_id: 0, activity_type: "start" as const, timestamp: 2.0 },
  { machine_id: 1, process_id: 0, activity_type: "end" as const, timestamp: 3.5 },
];
console.log(averageTimePerMachine(single)); // [{ machine_id: 1, processing_time: 1.5 }]
```

---

## 🔗 Related Problems

- [Rising Temperature](https://leetcode.com/problems/rising-temperature) — self-join on sequential rows
- [Immediate Food Delivery II](https://leetcode.com/problems/immediate-food-delivery-ii) — conditional aggregation
- [Game Play Analysis I](https://leetcode.com/problems/game-play-analysis-i) — aggregate per player/machine
- [Consecutive Numbers](https://leetcode.com/problems/consecutive-numbers) — pairing adjacent rows
