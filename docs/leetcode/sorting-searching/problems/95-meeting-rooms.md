---
layout: page
title: "Meeting Rooms"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Sorting]
leetcode_url: "https://leetcode.com/problems/meeting-rooms"
---

# Meeting Rooms / Phòng Họp

> **Difficulty**: 🟢 Easy | **Category**: Sorting-Searching | **Pattern**: Sort + Overlap Check

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như xếp lịch họp trong công ty — nếu có hai cuộc họp giao thời gian nhau thì không thể tham dự cả hai. Sắp xếp theo giờ bắt đầu rồi kiểm tra xem cuộc họp sau có bắt đầu trước khi cuộc trước kết thúc không.

**Pattern Recognition:**

- Check if any two intervals overlap → sort by start → compare adjacent pairs
- One person can attend all → no overlaps allowed → **Sort + Linear Scan**
- Classic prerequisite to Meeting Rooms II

**Visual:**

```
intervals=[[0,30],[5,10],[15,20]]
Sort by start: [[0,30],[5,10],[15,20]]
Check: [0,30] vs [5,10]: 5 < 30 → OVERLAP → false

intervals=[[7,10],[2,4]]
Sort: [[2,4],[7,10]]
Check: [2,4] vs [7,10]: 7 >= 4 → no overlap → true
```

## Problem Description

Given an array of meeting time intervals `intervals[i]=[start_i, end_i]`, determine if a person could attend all meetings (i.e., no two meetings overlap). Return `true` if possible.

**Example:**

- intervals=[[0,30],[5,10],[15,20]] → false (first and second meeting overlap)
- intervals=[[7,10],[2,4]] → true
- intervals=[] → true

**Constraints:** 0 ≤ intervals.length ≤ 10⁴, intervals[i].length = 2, 0 ≤ start_i < end_i ≤ 10⁶

## 📝 Interview Tips

1. **Clarify**: Does touching (end_i === start_j) count as overlap? (No, end is exclusive)
2. **Approach**: Sort by start time, check if any meeting starts before previous ends
3. **Edge cases**: Empty array → true, single meeting → true, back-to-back meetings → true
4. **Optimize**: O(n log n) is optimal — can't do better without sorting
5. **Follow-up**: Minimum rooms needed? (Meeting Rooms II) What's the max meetings attended if some overlap?
6. **Complexity**: Time O(n log n), Space O(1)

## Solutions

```typescript
// Solution 1: Sort + Linear Scan — Time: O(n log n) | Space: O(1)
function canAttendMeetings(intervals: number[][]): boolean {
  intervals.sort((a, b) => a[0] - b[0]);

  for (let i = 1; i < intervals.length; i++) {
    // If current meeting starts before previous ends → overlap
    if (intervals[i][0] < intervals[i - 1][1]) {
      return false;
    }
  }

  return true;
}

// Solution 2: Check all pairs (Brute Force) — Time: O(n²) | Space: O(1)
function canAttendMeetings2(intervals: number[][]): boolean {
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      const [s1, e1] = intervals[i];
      const [s2, e2] = intervals[j];
      // Two intervals overlap if one starts before the other ends
      if (Math.max(s1, s2) < Math.min(e1, e2)) {
        return false;
      }
    }
  }
  return true;
}

// Solution 3: Using Set of sorted events — Time: O(n log n) | Space: O(n)
function canAttendMeetings3(intervals: number[][]): boolean {
  if (intervals.length <= 1) return true;

  // Create sorted array of (time, type) where type: 0=start, 1=end
  // Process ends before starts at same time (end then start = no overlap)
  const events: [number, number][] = [];
  for (const [s, e] of intervals) {
    events.push([s, 1]); // 1 = start
    events.push([e, 0]); // 0 = end (process before start at same time)
  }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  let active = 0;
  for (const [, type] of events) {
    if (type === 1) active++;
    else active--;
    if (active > 1) return false;
  }

  return true;
}

// Tests
console.log(
  canAttendMeetings([
    [0, 30],
    [5, 10],
    [15, 20],
  ]),
); // false
console.log(
  canAttendMeetings([
    [7, 10],
    [2, 4],
  ]),
); // true
console.log(canAttendMeetings([])); // true
console.log(canAttendMeetings([[1, 5]])); // true
console.log(
  canAttendMeetings([
    [1, 5],
    [5, 10],
  ]),
); // true (touching, not overlapping)
```

## 🔗 Related Problems

| Problem                                                                              | Relationship                             |
| ------------------------------------------------------------------------------------ | ---------------------------------------- |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii)                   | Minimum rooms = max overlapping meetings |
| [Merge Intervals](https://leetcode.com/problems/merge-intervals)                     | Combine all overlapping intervals        |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) | Remove minimum to eliminate overlaps     |
