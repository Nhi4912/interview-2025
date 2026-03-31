---
layout: page
title: "Course Schedule III"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Greedy, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/course-schedule-iii"
---

# Course Schedule III / Lịch Học III

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Greedy + Max-Heap
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Giống đặt lịch du lịch với deadline cố định:** sort các chuyến theo ngày phải trở về. Nếu chuyến hiện tại vượt deadline, thay bằng chuyến ngắn nhất đã lên kế hoạch (giải phóng thời gian nhiều nhất).

**Pattern Recognition:**

- Signal: "max courses + deadlines + minimize time used" → **Sort by deadline + Greedy with Max-Heap**
- Sort by lastDay: xử lý deadline sớm trước để tối ưu slot thời gian
- Max-heap of durations: nếu khoá mới không vừa, swap với khoá dài nhất (giảm total time)

**Visual:**

```
courses=[[100,200],[200,1300],[1000,1250],[2000,3200]]
After sort by lastDay: same order

time=0: add [100] → heap=[100], time=100
time=100: add [200] → heap=[200,100], time=300
time=300: add [1000]? 300+1000=1300>1250 ❌
  Swap longest(1000→not in heap yet, compare)? 200 > nothing
  Actually: 300+1000=1300>1250, heap.max=200 < 1000 → don't swap
time=300: add [2000] → 300+2000=2300≤3200 ✅ → heap=[2000,200,100], time=2300
Answer: 3 courses ✅
```

## Problem Description

Given `courses[i] = [duration_i, lastDay_i]`, find the **maximum number of courses** you can take. Each course must be completed by `lastDay_i` (start any time, continuous, no overlap needed).

- Example 1: `[[100,200],[200,1300],[1000,1250],[2000,3200]]` → `3`
- Example 2: `[[1,2]]` → `1`
- Example 3: `[[3,2],[4,3]]` → `0`

## 📝 Interview Tips

1. **Clarify**: Khoá học có thể chồng không? / Can courses overlap? No, must be sequential
2. **Approach**: Sort by lastDay, greedy swap với max-heap / Sort + max-heap swap strategy
3. **Edge cases**: duration > lastDay → khoá không thể học / Course impossible if duration > lastDay
4. **Optimize**: Tại sao swap? Nếu khoá dài hơn max-in-heap thì swap → cùng số khoá nhưng time nhỏ hơn / Swap maintains count, reduces time
5. **Follow-up**: Nếu mỗi khoá có credit? / If each course has credit/weight? → weighted version harder
6. **Complexity**: Time O(n log n), Space O(n) / Sort + n heap operations

## Solutions

```typescript
/** Solution 1: Greedy Without Heap (slower but intuitive)
 * Time: O(n² log n) | Space: O(n)
 */
function scheduleCourseIIIBrute(courses: number[][]): number {
  courses.sort((a, b) => a[1] - b[1]);
  const taken: number[] = [];
  let time = 0;

  for (const [dur, last] of courses) {
    if (time + dur <= last) {
      taken.push(dur);
      time += dur;
    } else {
      // Replace longest taken course if current is shorter
      let maxIdx = -1;
      for (let i = 0; i < taken.length; i++)
        if (maxIdx === -1 || taken[i] > taken[maxIdx]) maxIdx = i;
      if (maxIdx !== -1 && taken[maxIdx] > dur) {
        time -= taken[maxIdx];
        taken.splice(maxIdx, 1);
        taken.push(dur);
        time += dur;
      }
    }
  }
  return taken.length;
}

/** Solution 2: Sort by Deadline + Max-Heap
 * Time: O(n log n) | Space: O(n)
 */
function scheduleCourseIII(courses: number[][]): number {
  courses.sort((a, b) => a[1] - b[1]);

  // Max-heap on duration
  const heap: number[] = [];
  const pushMax = (x: number) => {
    heap.push(x);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p] < heap[i]) {
        [heap[p], heap[i]] = [heap[i], heap[p]];
        i = p;
      } else break;
    }
  };
  const popMax = (): number => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i,
          l = 2 * i + 1,
          r = 2 * i + 2;
        if (l < heap.length && heap[l] > heap[s]) s = l;
        if (r < heap.length && heap[r] > heap[s]) s = r;
        if (s === i) break;
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      }
    }
    return top;
  };
  const peekMax = () => heap[0];

  let time = 0;
  for (const [dur, last] of courses) {
    if (time + dur <= last) {
      pushMax(dur);
      time += dur;
    } else if (heap.length > 0 && peekMax() > dur) {
      // Swap: remove longest, add current → save time, same count
      time -= popMax();
      pushMax(dur);
      time += dur;
    }
    // else: skip this course entirely
  }
  return heap.length;
}

// Tests
console.log(
  scheduleCourseIII([
    [100, 200],
    [200, 1300],
    [1000, 1250],
    [2000, 3200],
  ]),
); // 3
console.log(scheduleCourseIII([[1, 2]])); // 1
console.log(
  scheduleCourseIII([
    [3, 2],
    [4, 3],
  ]),
); // 0
console.log(
  scheduleCourseIII([
    [5, 5],
    [4, 6],
    [2, 6],
  ]),
); // 2
console.log(
  scheduleCourseIIIBrute([
    [100, 200],
    [200, 1300],
    [1000, 1250],
    [2000, 3200],
  ]),
); // 3
console.log(
  scheduleCourseIII([
    [1, 2],
    [2, 3],
  ]),
); // 2
```

## 🔗 Related Problems

| Problem                                                                                      | Relationship                       |
| -------------------------------------------------------------------------------------------- | ---------------------------------- |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                               | Greedy scheduling with constraints |
| [IPO](https://leetcode.com/problems/ipo)                                                     | Sort + two-heap greedy selection   |
| [Maximum Performance of a Team](https://leetcode.com/problems/maximum-performance-of-a-team) | Sort + min-heap eviction           |
