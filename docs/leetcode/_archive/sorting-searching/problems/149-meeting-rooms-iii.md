---
layout: page
title: "Meeting Rooms III"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Hash Table, Sorting, Heap (Priority Queue), Simulation]
leetcode_url: "https://leetcode.com/problems/meeting-rooms-iii"
---

# Meeting Rooms III / Phòng Họp III

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Heap Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii) | [Task Scheduler](https://leetcode.com/problems/task-scheduler)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng một khách sạn có n phòng đánh số 0..n-1. Khách đến theo lịch họp, luôn muốn phòng số nhỏ nhất còn trống. Nếu không có phòng trống, chờ phòng xong sớm nhất rồi dùng lại. Dùng 2 heap: **available** (min-heap theo room id) và **busy** (min-heap theo end time).

```
n=2, meetings=[[0,10],[1,5],[2,7],[3,4]]
Sort meetings: [[0,10],[1,5],[2,7],[3,4]]

t=0: available=[0,1] → room 0 gets [0,10], busy=[(10,0)]
t=1: available=[1]   → room 1 gets [1,6], busy=[(6,1),(10,0)]
t=2: no available, busy.top=(6,1) → room 1 free at 6 delayed
     room 1 gets [6, 6+(7-2)=11], busy=[(10,0),(11,1)]
t=3: no available, busy.top=(10,0) → room 0 gets [10,10+(4-3)=11]
count: room0=2, room1=2 → return 0 (smallest)
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Hai heap** — available (min room id) + busy (min end time) là pattern kinh điển / two-heap pattern for room/server allocation
- 🇻🇳 **Delay meetings** — cuộc họp trễ vẫn giữ nguyên _duration_, chỉ start thay đổi / delayed meetings preserve duration, not end time
- 🇻🇳 **Sort meetings by start** — quan trọng để xử lý đúng thứ tự / sorting by start is mandatory for correct simulation
- 🇻🇳 **JS MinHeap** — JS không có built-in, cần implement hoặc dùng array sort / JavaScript lacks built-in heap, use sorted array for interviews
- 🇻🇳 **Tie-breaking** — khi nhiều phòng trống cùng lúc, chọn room id nhỏ nhất / when multiple rooms free simultaneously, pick smallest id
- 🇻🇳 **Complexity** — O(m log n) với m = số cuộc họp, n = số phòng / O(m log n) where m=meetings, n=rooms

---

## Solutions

### Solution 1: Min-Heap Simulation (Array-based) — O(m log m + m·n)

```typescript
/**
 * Simulate with available/busy arrays sorted as heaps
 * Time: O(m log m + m·n)  Space: O(n)
 * (For interviews: simple array sort is acceptable for small n)
 */
function mostBooked(n: number, meetings: number[][]): number {
  meetings.sort((a, b) => a[0] - b[0]);

  const count = new Array(n).fill(0);
  // busy: [endTime, roomId] sorted by endTime then roomId
  const busy: [number, number][] = [];
  // available rooms sorted ascending
  const available: number[] = Array.from({ length: n }, (_, i) => i);

  for (const [start, end] of meetings) {
    // Free up rooms that finished by current start
    while (busy.length > 0 && busy[0][0] <= start) {
      const [, roomId] = busy.shift()!;
      // Insert back in sorted order
      let pos = 0;
      while (pos < available.length && available[pos] < roomId) pos++;
      available.splice(pos, 0, roomId);
    }

    if (available.length > 0) {
      const roomId = available.shift()!;
      count[roomId]++;
      busy.push([end, roomId]);
      busy.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));
    } else {
      // Wait for earliest-ending room
      busy.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));
      const [endTime, roomId] = busy.shift()!;
      const duration = end - start;
      count[roomId]++;
      busy.push([endTime + duration, roomId]);
      busy.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));
    }
  }

  let best = 0;
  for (let i = 1; i < n; i++) {
    if (count[i] > count[best]) best = i;
  }
  return best;
}

console.log(
  mostBooked(2, [
    [0, 10],
    [1, 5],
    [2, 7],
    [3, 4],
  ]),
); // 0
console.log(
  mostBooked(3, [
    [1, 20],
    [2, 10],
    [3, 5],
    [4, 9],
    [6, 8],
  ]),
); // 1
```

### Solution 2: Priority Queue Simulation — O(m log m + m log n)

```typescript
/**
 * Proper min-heap for O(log n) push/pop
 * Time: O(m log m + m log n)  Space: O(n + m)
 */
function mostBooked2(n: number, meetings: number[][]): number {
  meetings.sort((a, b) => a[0] - b[0]);
  const count = new Array(n).fill(0);

  // MinHeap by custom comparator
  class MinHeap<T> {
    data: T[] = [];
    constructor(private cmp: (a: T, b: T) => number) {}
    push(val: T) {
      this.data.push(val);
      this._bubbleUp(this.data.length - 1);
    }
    pop(): T {
      const top = this.data[0];
      const last = this.data.pop()!;
      if (this.data.length > 0) {
        this.data[0] = last;
        this._sinkDown(0);
      }
      return top;
    }
    peek(): T {
      return this.data[0];
    }
    get size() {
      return this.data.length;
    }
    private _bubbleUp(i: number) {
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (this.cmp(this.data[i], this.data[p]) < 0) {
          [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
          i = p;
        } else break;
      }
    }
    private _sinkDown(i: number) {
      const n = this.data.length;
      while (true) {
        let smallest = i,
          l = 2 * i + 1,
          r = 2 * i + 2;
        if (l < n && this.cmp(this.data[l], this.data[smallest]) < 0) smallest = l;
        if (r < n && this.cmp(this.data[r], this.data[smallest]) < 0) smallest = r;
        if (smallest === i) break;
        [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
        i = smallest;
      }
    }
  }

  const avail = new MinHeap<number>((a, b) => a - b);
  for (let i = 0; i < n; i++) avail.push(i);
  const busy = new MinHeap<[number, number]>((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));

  for (const [start, end] of meetings) {
    while (busy.size > 0 && busy.peek()[0] <= start) {
      avail.push(busy.pop()[1]);
    }
    if (avail.size > 0) {
      const room = avail.pop();
      count[room]++;
      busy.push([end, room]);
    } else {
      const [endTime, room] = busy.pop();
      count[room]++;
      busy.push([endTime + (end - start), room]);
    }
  }

  return count.indexOf(Math.max(...count));
}

console.log(
  mostBooked2(2, [
    [0, 10],
    [1, 5],
    [2, 7],
    [3, 4],
  ]),
); // 0
console.log(
  mostBooked2(3, [
    [1, 20],
    [2, 10],
    [3, 5],
    [4, 9],
    [6, 8],
  ]),
); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                  | Difficulty | Pattern          |
| ---------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii)                       | 🟡 Medium  | Heap / Intervals |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                           | 🟡 Medium  | Greedy + Heap    |
| [Earliest Appointment](https://leetcode.com/problems/meeting-scheduler)                  | 🟡 Medium  | Two Pointers     |
| [Process Tasks Using Servers](https://leetcode.com/problems/process-tasks-using-servers) | 🟡 Medium  | Min-Heap         |
