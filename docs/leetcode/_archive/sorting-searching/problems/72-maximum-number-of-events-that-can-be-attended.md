---
layout: page
title: "Maximum Number of Events That Can Be Attended"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended"
---

# Maximum Number of Events That Can Be Attended / Số Sự Kiện Tối Đa Có Thể Tham Dự

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Task Scheduler](https://leetcode.com/problems/task-scheduler) | [IPO](https://leetcode.com/problems/ipo)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có nhiều sự kiện (hội nghị, buổi tiệc) và mỗi ngày chỉ tham dự được một. Chiến lược tham lam: **mỗi ngày, chọn sự kiện kết thúc sớm nhất trong các sự kiện đang mở**. Nếu hôm nay có 3 sự kiện có thể tham dự, ưu tiên cái hết hạn sớm nhất — vì cái kết thúc muộn hơn còn có thể làm ngày sau.

**Pattern Recognition:**

- Sort events by start day
- Min-heap on end day: track available events for "today"
- Each day: add newly started events, pop expired ones, attend earliest-ending

**Visual — events=[[1,2],[2,3],[3,4]], simulating day by day:**

```
Sort by start: [[1,2],[2,3],[3,4]]
Day 1: add [1,2] → heap=[2]. Attend→ heap=[], count=1
Day 2: add [2,3] → heap=[3]. Attend→ heap=[], count=2
Day 3: add [3,4] → heap=[4]. Attend→ heap=[], count=3 ✅
```

---

## Problem Description

Given `events[i] = [startDay, endDay]`, you may attend one event per day (any day in `[startDay, endDay]`). Return the **maximum** number of events you can attend.

- Example 1: `events = [[1,2],[2,3],[3,4]]` → `3`
- Example 2: `events = [[1,2],[2,3],[3,4],[1,2]]` → `4`

---

## 📝 Interview Tips

1. **Clarify**: "Mỗi ngày chỉ được tham dự 1 sự kiện?" / Exactly one event per day?
2. **Greedy key**: "Luôn ưu tiên sự kiện kết thúc sớm nhất để không lãng phí" / Prefer earliest-ending to avoid waste
3. **Min-heap**: "Heap lưu end day của các sự kiện đang available" / Min-heap on end day of available events
4. **Remove expired**: "Trước khi attend, bỏ sự kiện đã hết hạn khỏi heap" / Pop events with endDay < today
5. **Day simulation**: "Iterate from min start to max end day" / Simulate each day explicitly
6. **Follow-up**: "Nếu có thể tham dự tối đa k sự kiện?" / What if you can attend up to k events?

---

## Solutions

```typescript
/**
 * Solution 1: Greedy + Min-Heap on end day
 * Time: O((n + D) log n) — D = max day, n = events
 * Space: O(n) — heap
 */
function maxEvents(events: number[][]): number {
  events.sort((a, b) => a[0] - b[0]); // sort by start day
  // Simulate min-heap with sorted array (for clarity in interviews)
  const available: number[] = []; // stores end days
  let count = 0,
    i = 0;
  const maxDay = Math.max(...events.map((e) => e[1]));

  const heapPush = (val: number) => {
    available.push(val);
    available.sort((a, b) => a - b);
  };
  const heapPop = () => available.shift()!;

  for (let day = 1; day <= maxDay; day++) {
    // Add all events starting today
    while (i < events.length && events[i][0] === day) {
      heapPush(events[i][1]);
      i++;
    }
    // Remove expired events
    while (available.length > 0 && available[0] < day) {
      heapPop();
    }
    // Attend earliest-ending available event
    if (available.length > 0) {
      heapPop();
      count++;
    }
  }
  return count;
}

/**
 * Solution 2: Event pointer approach (avoid day simulation for large ranges)
 * Same greedy logic, iterate only over distinct days with events
 * Time: O(n log n)
 * Space: O(n)
 */
function maxEvents2(events: number[][]): number {
  events.sort((a, b) => a[0] - b[0]);
  const n = events.length;
  const endHeap: number[] = [];
  let i = 0,
    count = 0;

  // Get all unique days we need to visit
  const days = new Set<number>();
  for (const [s, e] of events) {
    days.add(s);
  }

  for (const day of [...days].sort((a, b) => a - b)) {
    while (i < n && events[i][0] <= day) {
      endHeap.push(events[i][1]);
      i++;
    }
    endHeap.sort((a, b) => a - b);
    // Remove expired
    while (endHeap.length > 0 && endHeap[0] < day) endHeap.shift();
    if (endHeap.length > 0) {
      endHeap.shift();
      count++;
    }
  }
  return count;
}

// === Test Cases ===
console.log(
  maxEvents([
    [1, 2],
    [2, 3],
    [3, 4],
  ]),
); // 3
console.log(
  maxEvents([
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 2],
  ]),
); // 4
console.log(
  maxEvents([
    [1, 4],
    [4, 4],
    [2, 2],
    [3, 4],
    [1, 1],
  ]),
); // 4
```

---

## 🔗 Related Problems

| Problem                                                                                                                            | Pattern            | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------- |
| [Maximum Number of Events That Can Be Attended II](https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended-ii) | DP + Binary Search | Hard       |
| [IPO](https://leetcode.com/problems/ipo)                                                                                           | Two Heaps + Greedy | Hard       |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                                                                     | Greedy + Heap      | Medium     |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii)                                                                 | Heap + Sort        | Medium     |
