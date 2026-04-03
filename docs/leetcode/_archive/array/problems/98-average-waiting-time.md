---
layout: page
title: "Average Waiting Time"
difficulty: Medium
category: Array
tags: [Array, Simulation]
leetcode_url: "https://leetcode.com/problems/average-waiting-time"
---

# Average Waiting Time / Thời Gian Chờ Trung Bình

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Task Scheduler](https://leetcode.com/problems/task-scheduler) | [Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống hàng đợi tại nhà hàng — bếp chỉ có một người. Nếu bếp đang bận, khách phải chờ bếp xong rồi mới bắt đầu nấu. Nếu bếp rảnh, khách ngồi vào là nấu ngay.

**Visual:**

```
customers = [[1,2],[2,5],[4,3]]

Chef free at t=0:
  Customer 1: arrives=1, cook=2 → start=1, done=3, wait=3-1=2
  Customer 2: arrives=2, cook=5 → start=max(3,2)=3, done=8, wait=8-2=6
  Customer 3: arrives=4, cook=3 → start=max(8,4)=8, done=11, wait=11-4=7

Total wait = 2+6+7 = 15, average = 15/3 = 5.0
```

---

## Problem Description

There is a restaurant with a single chef. Customers arrive at times `customers[i][0]` and need `customers[i][1]` time to prepare. The chef serves customers in arrival order. Return the **average waiting time** of all customers.

- Example 1: `customers=[[1,2],[2,5],[4,3]]` → `5.0`
- Example 2: `customers=[[5,2],[5,4],[10,3],[20,1]]` → `3.25`

**Constraints:** `1 <= customers.length <= 10^5`, `1 <= arrival_i, time_i <= 10^4`, `arrival_i <= arrival_{i+1}` (sorted by arrival)

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Customers đã được sort theo arrival time chưa?" / Customers are given in order.
2. **Key formula**: "start_time = max(currentTime, arrival), finish = start + cookTime" / Chef waits for customer OR customer waits for chef.
3. **Track chef's free time**: "Chỉ cần một biến `currentTime` theo dõi khi bếp rảnh" / Single variable for chef's next available time.
4. **Waiting time**: "Wait = finish_time - arrival_time (không phải start - arrival)" / Wait counts from arrival to finish, including cook time.
5. **Floating point**: "Dùng số nguyên cho sum, chia float ở cuối" / Accumulate integer sum, divide at end.
6. **Complexity**: "O(n) — một vòng lặp" / Single pass, O(n) time O(1) space.

---

## Solutions

```typescript
/**
 * Solution 1: Direct Simulation
 * Time: O(n) — one pass through all customers
 * Space: O(1) — only track currentTime and totalWait
 */
function averageWaitingTimeSimple(customers: number[][]): number {
  let currentTime = 0; // when the chef becomes free
  let totalWait = 0;

  for (const [arrival, cookTime] of customers) {
    // Chef starts cooking when available (either waits for customer, or customer waits)
    const startCook = Math.max(currentTime, arrival);
    const finishTime = startCook + cookTime;
    totalWait += finishTime - arrival; // customer wait = total time from arrival to served
    currentTime = finishTime;
  }

  return totalWait / customers.length;
}

console.log(
  averageWaitingTimeSimple([
    [1, 2],
    [2, 5],
    [4, 3],
  ]),
); // 5.0
console.log(
  averageWaitingTimeSimple([
    [5, 2],
    [5, 4],
    [10, 3],
    [20, 1],
  ]),
); // 3.25
console.log(averageWaitingTimeSimple([[2, 3]])); // 3.0

/**
 * Solution 2: Explicit variable naming (same algorithm, more readable)
 * Time: O(n), Space: O(1)
 */
function averageWaitingTime(customers: number[][]): number {
  let chefFreeAt = 0;
  let totalWaitTime = 0;
  const n = customers.length;

  for (let i = 0; i < n; i++) {
    const arrival = customers[i][0];
    const cookDuration = customers[i][1];

    // If chef is busy when customer arrives, customer queues up
    // If chef is free, chef waits (idle) until customer arrives
    chefFreeAt = Math.max(chefFreeAt, arrival) + cookDuration;

    // Waiting time = time food is ready - time customer arrived
    totalWaitTime += chefFreeAt - arrival;
  }

  return totalWaitTime / n;
}

console.log(
  averageWaitingTime([
    [1, 2],
    [2, 5],
    [4, 3],
  ]),
); // 5.0
console.log(
  averageWaitingTime([
    [5, 2],
    [5, 4],
    [10, 3],
    [20, 1],
  ]),
); // 3.25
```

---

## 🔗 Related Problems

| Problem                                                                                                | Pattern              | Difficulty |
| ------------------------------------------------------------------------------------------------------ | -------------------- | ---------- |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                                         | Greedy Simulation    | Medium     |
| [Minimum Time to Complete All Tasks](https://leetcode.com/problems/minimum-time-to-complete-all-tasks) | Greedy               | Hard       |
| [Car Pooling](https://leetcode.com/problems/car-pooling)                                               | Simulation + Sorting | Medium     |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii)                                     | Heap / Intervals     | Medium     |
