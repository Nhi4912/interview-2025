---
layout: page
title: "Car Pooling"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Sorting, Heap (Priority Queue), Simulation, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/car-pooling"
---

# Car Pooling / Đi Nhờ Xe

> **Difficulty**: 🟡 Medium | **Category**: Sorting-Searching | **Pattern**: Difference Array / Events Sweep

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như theo dõi số hành khách trên xe buýt — mỗi điểm dừng có người lên và xuống, chỉ cần đảm bảo số người trên xe không vượt quá capacity tại bất kỳ điểm nào.

**Pattern Recognition:**

- Passengers board at `from`, alight at `to` → interval events → **Difference Array / Sweep Line**
- At each stop: add boarders, subtract alighters → check running total ≤ capacity
- Sort events by position → process chronologically

**Visual:**

```
trips=[[2,1,5],[3,3,7]], capacity=4
Events: +2@1, -2@5, +3@3, -3@7
Sort:   [1:+2, 3:+3, 5:-2, 7:-3]
Running: 0→2→5→ EXCEEDS 4! return false

trips=[[2,1,5],[3,3,7]], capacity=5
Running: 0→2→5→3→0  max=5 ≤ 5 → true
```

## Problem Description

You drive a vehicle with `capacity` seats (excluding driver). Given `trips[i]=[numPassengers, from, to]`, return `true` if it's possible to pick up all passengers without exceeding capacity at any point. Passengers are picked up at `from` and dropped off at `to`.

**Example:**

- trips=[[2,1,5],[3,3,7]], capacity=4 → false
- trips=[[2,1,5],[3,3,7]], capacity=5 → true

**Constraints:** 1 ≤ trips.length ≤ 1000, 0 ≤ from < to ≤ 1000, 1 ≤ capacity ≤ 10⁵

## 📝 Interview Tips

1. **Clarify**: Are passengers dropped off before new ones board at same stop? (Yes: `to` is exclusive)
2. **Approach**: Difference array at stops, or sort events (board/alight) by position
3. **Edge cases**: Multiple trips same location, single trip, capacity=1
4. **Optimize**: Since stops ≤ 1000, O(max_stop) difference array beats O(n log n) sort
5. **Follow-up**: Return the minimum capacity needed instead of true/false
6. **Complexity**: Time O(n + max_stop) with diff array or O(n log n) with events sort

## Solutions

```typescript
// Solution 1: Difference Array — Time: O(n + max_stop) | Space: O(max_stop)
function carPooling(trips: number[][], capacity: number): boolean {
  const diff = new Array(1001).fill(0);

  for (const [num, from, to] of trips) {
    diff[from] += num;
    diff[to] -= num; // passengers exit before pickup at same stop
  }

  let current = 0;
  for (let stop = 0; stop <= 1000; stop++) {
    current += diff[stop];
    if (current > capacity) return false;
  }

  return true;
}

// Solution 2: Sort Events — Time: O(n log n) | Space: O(n)
function carPooling2(trips: number[][], capacity: number): boolean {
  // Create events: [stop, change] — negative for drop-off
  const events: [number, number][] = [];
  for (const [num, from, to] of trips) {
    events.push([from, num]);
    events.push([to, -num]);
  }
  // Sort by stop; drop-offs before pickups at same stop (negative first)
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  let current = 0;
  for (const [, change] of events) {
    current += change;
    if (current > capacity) return false;
  }

  return true;
}

// Solution 3: Bucket by stop — Time: O(n + max_stop) | Space: O(max_stop)
function carPooling3(trips: number[][], capacity: number): boolean {
  const board = new Array(1001).fill(0);
  const alight = new Array(1001).fill(0);

  for (const [num, from, to] of trips) {
    board[from] += num;
    alight[to] += num;
  }

  let current = 0;
  for (let stop = 0; stop <= 1000; stop++) {
    current -= alight[stop]; // drop off first
    current += board[stop]; // then pick up
    if (current > capacity) return false;
  }

  return true;
}

// Tests
console.log(
  carPooling(
    [
      [2, 1, 5],
      [3, 3, 7],
    ],
    4,
  ),
); // false
console.log(
  carPooling(
    [
      [2, 1, 5],
      [3, 3, 7],
    ],
    5,
  ),
); // true
console.log(
  carPooling(
    [
      [3, 2, 7],
      [3, 7, 9],
      [8, 3, 9],
    ],
    11,
  ),
); // true
console.log(carPooling([[1, 0, 1]], 1)); // true
console.log(
  carPooling(
    [
      [2, 0, 2],
      [2, 0, 2],
    ],
    3,
  ),
); // false
```

## 🔗 Related Problems

| Problem                                                                              | Relationship                       |
| ------------------------------------------------------------------------------------ | ---------------------------------- |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii)                   | Interval overlap counting          |
| [Corporate Flight Bookings](https://leetcode.com/problems/corporate-flight-bookings) | Same difference array on intervals |
| [My Calendar III](https://leetcode.com/problems/my-calendar-iii)                     | Max overlap in intervals           |
