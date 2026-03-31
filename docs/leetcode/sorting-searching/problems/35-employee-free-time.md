---
layout: page
title: "Employee Free Time"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Line Sweep, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/employee-free-time"
---

# Employee Free Time / Thời Gian Rảnh Của Nhân Viên

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Merge Intervals / Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Merge Intervals](https://leetcode.com/problems/merge-intervals) | [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn là quản lý văn phòng, cần tìm những khoảng thời gian không ai làm việc để tổ chức họp toàn thể. Gom tất cả lịch làm việc của mọi nhân viên lại, sắp xếp theo thời điểm bắt đầu, rồi quét qua để tìm "khoảng trống" — khi một ca làm việc bắt đầu sau khi ca trước đã kết thúc.

**Pattern Recognition:**

- Signal: "list of intervals" + "find gaps/free time" → **Flatten + Sort + Sweep**
- Không quan trọng interval của nhân viên nào — gộp tất cả, sort theo `start`
- Gap tồn tại khi `intervals[i].start > currentEnd` → `[currentEnd, intervals[i].start]`

**Visual — Flatten, Sort, Find Gaps:**

```
Employee 1: [[1,3],[6,7]]
Employee 2: [[2,4]]
Employee 3: [[2,5],[9,12]]

Flattened: [[1,3],[6,7],[2,4],[2,5],[9,12]]
Sorted:    [[1,3],[2,4],[2,5],[6,7],[9,12]]

Sweep with currentEnd tracker:
  [1,3]: currentEnd = 3
  [2,4]: 2 ≤ 3 → overlap, currentEnd = max(3,4) = 4
  [2,5]: 2 ≤ 4 → overlap, currentEnd = max(4,5) = 5
  [6,7]: 6 > 5 → GAP! → free time [5,6], currentEnd = 7
  [9,12]:9 > 7 → GAP! → free time [7,9], currentEnd = 12

Result: [[5,6],[7,9]] ✅
```

---

## Problem Description

Given a list `schedule` of employees where `schedule[i]` is a list of non-overlapping `Interval`s for employee `i` (sorted), return the list of finite intervals representing the **free time for all employees** (intervals where no employee is working). ([LeetCode 759](https://leetcode.com/problems/employee-free-time))

**Example 1:** `schedule = [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]` → `[[5,6],[7,9]]`
**Example 2:** `schedule = [[[1,3],[6,7]],[[9,12]]]` → `[[3,6],[7,9]]`

**Constraints:** `1 <= schedule.length, schedule[i].length <= 50`, `0 <= Interval.start < Interval.end <= 10⁸`.

---

## 📝 Interview Tips

1. **Clarify** / Làm rõ: "Free time của TẤT CẢ nhân viên cùng lúc hay từng người?" / All employees simultaneously free?
2. **Key insight** / Điểm mấu chốt: Nhân viên nào sở hữu interval không quan trọng — gộp tất cả rồi merge
3. **Sort by start** / Sắp xếp: Sort theo `start` time — gaps hiện ra khi `next.start > currentEnd`
4. **Heap variant** / Heap: Dùng min-heap có thể tránh sort toàn bộ nếu mỗi list đã sorted — O(n log k)
5. **Edge cases** / Biên: Không có free time (mọi lúc đều có người), free time ở đầu/cuối không tính
6. **Boundary** / Ranh giới: Câu hỏi hỏi "finite intervals" — không tính trước 0 hay sau last end

---

## Solutions

```typescript
// Interval class definition (provided by LeetCode)
class Interval {
  start: number;
  end: number;
  constructor(start?: number, end?: number) {
    this.start = start ?? 0;
    this.end = end ?? 0;
  }
}

/**
 * Solution 1: Brute Force — Flatten, Sort, Merge, Find Gaps
 * Time: O(n log n) — n = total number of intervals across all employees
 * Space: O(n) — flat list + result
 *
 * This is already the cleanest approach; no true "brute force" is simpler.
 */
function employeeFreeTimeFlatten(schedule: Interval[][]): Interval[] {
  // Step 1: Flatten all intervals into one list
  const all: Interval[] = [];
  for (const emp of schedule) {
    for (const interval of emp) {
      all.push(interval);
    }
  }

  // Step 2: Sort by start time
  all.sort((a, b) => a.start - b.start);

  // Step 3: Sweep and find gaps
  const result: Interval[] = [];
  let currentEnd = all[0].end;

  for (let i = 1; i < all.length; i++) {
    const { start, end } = all[i];
    if (start > currentEnd) {
      // Gap found between currentEnd and next interval's start
      result.push(new Interval(currentEnd, start));
    }
    currentEnd = Math.max(currentEnd, end);
  }

  return result;
}

/**
 * Solution 2: Min-Heap — merge k sorted lists approach
 * Time: O(n log k) — k employees, n total intervals
 * Space: O(k) — heap size equals number of employees
 *
 * Seed heap with each employee's first interval. Pop minimum start,
 * detect gap vs prev end, then push that employee's next interval.
 */
function employeeFreeTime(schedule: Interval[][]): Interval[] {
  type H = [Interval, number, number]; // [interval, empIdx, intIdx]
  const heap: H[] = [];
  const push = (e: H) => {
    heap.push(e);
    heap.sort((a, b) => a[0].start - b[0].start);
  };
  const pop = (): H => heap.shift()!;

  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i].length) push([schedule[i][0], i, 0]);
  }

  const result: Interval[] = [];
  let prev: Interval | null = null;

  while (heap.length > 0) {
    const [curr, ei, ii] = pop();
    if (prev !== null && curr.start > prev.end) {
      result.push(new Interval(prev.end, curr.start)); // free time gap
    }
    // Extend or set prev
    prev =
      !prev || curr.start > prev.end
        ? curr
        : new Interval(prev.start, Math.max(prev.end, curr.end));
    if (ii + 1 < schedule[ei].length) push([schedule[ei][ii + 1], ei, ii + 1]);
  }

  return result;
}

// === Test Cases ===
const I = (s: number, e: number) => new Interval(s, e);
const fmt = (iv: Interval[]) => iv.map((i) => [i.start, i.end]);

console.log(fmt(employeeFreeTime([[I(1, 3), I(6, 7)], [I(2, 4)], [I(2, 5), I(9, 12)]]))); // [[5,6],[7,9]]
console.log(fmt(employeeFreeTime([[I(1, 3), I(6, 7)], [I(9, 12)]]))); // [[3,6],[7,9]]
console.log(fmt(employeeFreeTime([[I(1, 2)], [I(2, 3)]]))); // [] (no free time)
```

---

## 🔗 Related Problems

| Problem                                                                                  | Pattern            | Difficulty |
| ---------------------------------------------------------------------------------------- | ------------------ | ---------- |
| [Merge Intervals](https://leetcode.com/problems/merge-intervals)                         | Sort + Sweep       | 🟡 Medium  |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii)                       | Sort + Heap        | 🟡 Medium  |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals)     | Greedy             | 🟡 Medium  |
| [Interval List Intersections](https://leetcode.com/problems/interval-list-intersections) | Two Pointers       | 🟡 Medium  |
| [My Calendar I](https://leetcode.com/problems/my-calendar-i)                             | Interval Insertion | 🟡 Medium  |
