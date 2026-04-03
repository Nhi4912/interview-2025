---
layout: page
title: "Meeting Rooms II"
difficulty: Medium
category: Array
tags: [Array, Two Pointers, Greedy, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/meeting-rooms-ii/"
leetcode_number: 253
pattern: "Interval Scheduling (Min Heap / Sweep Line)"
frequency_tier: 2
companies: [Amazon, Google, Facebook, Bloomberg]
target_time_minutes: 25
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Meeting Rooms II / Phòng Họp II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sweep Line / Two Pointers on Intervals
> **Frequency**: ⭐ Tier 2 — Gặp ~50% interviews tại công ty có vòng system design nhẹ
> **See also**: [Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) | [Merge Intervals](https://leetcode.com/problems/merge-intervals/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như quản lý phòng khách sạn trong ngày bận — mỗi khi khách mới đến check-in (cuộc họp bắt đầu), bạn kiểm tra có phòng vừa checkout không; nếu có thì dùng lại, không thì mở phòng mới. Mấu chốt: tách riêng danh sách giờ check-in và checkout, sắp xếp cả hai, dùng hai con trỏ đếm "cao điểm" cần bao nhiêu phòng cùng lúc.

**Pattern Recognition:**

- Signal: "minimum rooms required", "overlapping intervals" → **Two Pointers trên sorted starts + ends**
- Tách mảng start và end, sort riêng → đếm số cuộc họp đồng thời tại mọi thời điểm
- Tương đương sweep line: mỗi start = +1 phòng cần, mỗi end = -1 phòng cần

**Visual — Two Pointers Walk-through:**

```
intervals = [[0,30], [5,10], [15,20]]
starts = [0,  5, 15]   sorted ↑
ends   = [10, 20, 30]  sorted ↑
          s↑   e↑

s=0  < e=10 → new meeting, rooms=1, s++
s=5  < e=10 → new meeting, rooms=2, s++   ← peak
s=15 ≥ e=10 → meeting ends, room freed, rooms=1, e++
s=15 < e=20 → new meeting, rooms=2, s++
done → maxRooms = 2 ✅
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| When you see... | Think... | Template |
|---|---|---|
| Minimum number of conference rooms / simultaneous intervals | Sort by start; use min-heap to track earliest end time; reuse room if heap.top ≤ current start | `sort by start; minHeap of end times; if heap.top <= start: pop; push current.end; answer = heap.size` |
| Maximum number of overlapping intervals at any point | Two-pointer sweep on sorted starts and ends | `starts.sort(); ends.sort(); for each start: if start < ends[e] rooms++ else e++; track max` |
| "Which meeting goes in which room?" (assignment, not just count) | Min-heap explicitly tracks which room ends earliest | Min-heap where each entry = end time of a specific room |
| Count events active at same time (concerts, tasks, processes) | Same sweep line pattern — generalization of meeting rooms | +1 at each start event, -1 at each end event, track running max |

**Memory hook:** "Phòng họp = heap end times — heap.top là phòng rảnh sớm nhất"

---

## Problem Description

Given an array of meeting time intervals `[start, end]`, find the minimum number of conference rooms required to hold all meetings simultaneously.

```
Example 1: [[0,30],[5,10],[15,20]]   → 2
Example 2: [[7,10],[2,4]]            → 1
Example 3: [[9,10],[4,9],[4,17]]     → 2
```

Constraints:

- 1 <= intervals.length <= 10^4
- 0 <= start < end <= 10^6

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

> **Understand:** "I need to find the minimum number of conference rooms to schedule all meetings without conflicts. Key question: if meeting A ends at time T and B starts at T, do they overlap? I'll assume no — the room is freed at T — but let me confirm. Input is not necessarily sorted."

> **Match:** "This is a classic interval scheduling problem — find the maximum number of intervals active simultaneously. I can solve it with a sweep line: sort start and end times separately, then use two pointers to count the peak concurrent meetings."

> **Plan:** "Extract all start times into one array and end times into another, sort both independently. Walk start pointer left-to-right: if current start < current end pointer value, a new meeting opens before any existing one ends → need an extra room; otherwise a room freed up, advance end pointer. Track the maximum rooms count seen."

> **Implement:** "O(n log n) for sorting, O(n) for the pointer scan. Space O(n) for the two sorted arrays. Alternative: min-heap on end times — same complexity but lets you track which room specifically becomes free first."

> **Review:** "[[0,30],[5,10],[15,20]]: starts=[0,5,15], ends=[10,20,30]. s=0 < e=10 → rooms=1. s=5 < e=10 → rooms=2. s=15 ≥ e=10 → e++, rooms stays 2 (endPtr now points to 20). s=15 < e=20 → rooms stays 2. maxRooms=2. Correct."

---

## 📝 Interview Tips

1. **Clarify**: If meeting A ends at time T and meeting B starts at T, do they overlap? (No — the room is freed at T.) / Kết thúc và bắt đầu cùng lúc T có overlap không? (Không — phòng được giải phóng ngay lúc T)
2. **Brute force**: For each meeting, scan all current rooms to find an available one → O(n²) / Với mỗi cuộc họp, quét toàn bộ phòng — O(n²)
3. **Approach**: "Sort start times and end times separately, then use two pointers. Whenever a new meeting starts before any current meeting ends, we need an extra room." / Sort riêng start/end, dùng 2 con trỏ đếm cao điểm
4. **Alternative**: Min-heap on end times — O(n log n) and also tracks which specific room ends earliest / Min-heap trên end times nếu cần biết phòng nào cụ thể
5. **Edge cases**: All meetings at same time → answer = n; all non-overlapping → answer = 1; single meeting → 1 / Tất cả cùng lúc = n phòng; không overlap = 1 phòng
6. **Follow-up**: "Which meetings go in which room?" → switch to min-heap to track actual room assignments / "Cuộc họp nào vào phòng nào?" → min-heap giải quyết được

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| Mistake | Why it happens | Correct approach |
|---|---|---|
| Sorting by end time instead of start time | Confusing this with other interval problems (e.g. non-overlapping intervals which sort by end) | Always sort by start time when finding max concurrent intervals — you process meetings in the order they begin |
| Not reusing a room when end ≤ start | Using strict `<` instead of `<=` for the heap-pop condition — keeps an extra unnecessary room open | Pop heap (reuse room) when `heap.top <= current.start`; the room is free at exactly its end time |
| Counting max overlaps using raw event points without sorting | Building a timeline array indexed by time value — breaks with large time ranges (up to 10^6) | Sort events and sweep with pointers or heap; do not use a time-indexed array |

---

## Solutions

```typescript

/**

- Solution 1: Brute Force — Sort + Scan Rooms
- Time: O(n²) — for each of n meetings, scan up to n existing rooms
- Space: O(n) — store end times of currently active rooms
  */
  function minMeetingRoomsBrute(intervals: number[][]): number {
  intervals.sort((a, b) => a[0] - b[0]);
  const roomEndTimes: number[] = [];

for (const [start, end] of intervals) {
const freeRoom = roomEndTimes.findIndex(t => t <= start);
if (freeRoom === -1) {
roomEndTimes.push(end); // No free room → open a new one
} else {
roomEndTimes[freeRoom] = end; // Reuse existing free room
}
}

return roomEndTimes.length;
}

/**

- Solution 2: Two Pointers on Sorted Start/End Arrays (Optimal)
- Time: O(n log n) — sorting dominates; pointer scan is O(n)
- Space: O(n) — two sorted arrays of size n
  */
  function minMeetingRooms(intervals: number[][]): number {
  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);

let rooms = 0, maxRooms = 0, endPtr = 0;

for (let startPtr = 0; startPtr < starts.length; startPtr++) {
if (starts[startPtr] < ends[endPtr]) {
rooms++; // A new meeting starts before any current meeting ends → need a room
} else {
endPtr++; // A meeting ended → that room is freed (rooms count stays same)
}
maxRooms = Math.max(maxRooms, rooms);
}

return maxRooms;
}

// === Test Cases ===
console.log(minMeetingRooms([[0,30],[5,10],[15,20]])); // 2 ✅
console.log(minMeetingRooms([[7,10],[2,4]])); // 1 ✅
console.log(minMeetingRooms([[9,10],[4,9],[4,17]])); // 2 ✅
console.log(minMeetingRoomsBrute([[0,30],[5,10],[15,20]])); // 2 ✅

```

---

## 🔗 Related Problems

- [Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) — simpler variant: can one person attend all meetings?
- [Merge Intervals](https://leetcode.com/problems/merge-intervals/) — interval manipulation prerequisite
- [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) — same sorted-intervals approach
- [Task Scheduler](https://leetcode.com/problems/task-scheduler/) — resource allocation with cooldown variant

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric | Target | Your Result |
|---|---|---|
| Time to solve | ≤ 25 min | ___ min |
| Solution correctness | All test cases pass | ✅ / ❌ |
| Space complexity | O(n) | ___ |
| Explained out loud | Yes | ✅ / ❌ |

**SRS Schedule:** First review → 1 day · Second → 3 days · Third → 7 days · Then → 14 days

| Date | Attempt # | Time (min) | Confidence (1-5) | Notes |
|---|---|---|---|---|
| | | | | |
