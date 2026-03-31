---
layout: page
title: "Task Scheduler II"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Simulation]
leetcode_url: "https://leetcode.com/problems/task-scheduler-ii"
---

# Task Scheduler II / Lịch Tác Vụ II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy Simulation + Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống xếp lịch công việc — mỗi loại công việc có thời gian chờ tối thiểu giữa hai lần làm. Không thể đổi thứ tự task, nên ta chỉ cần track ngày sẵn sàng tiếp theo của mỗi task type và "nhảy" tới đó nếu cần.

**Pattern Recognition:**

- Signal: "tasks in fixed order, cooldown between same type" → **Greedy + Hash Map**
- Khác Task Scheduler I: order cố định, không thể sắp xếp lại
- Key insight: với mỗi task, `day = max(day+1, nextAvailable[task])`, rồi cập nhật nextAvailable

**Visual — Day Tracking:**

```
tasks=[1,2,1,2,3,1], space=3
day=1: task=1 → next=1, update next[1]=1+3+1=5
day=2: task=2 → next=2, update next[2]=2+3+1=6
day=3: task=1 → next[1]=5 > 3, day=max(3,5)=5, update next[1]=9
day=6: task=2 → next[2]=6, day=6, update next[2]=10
day=7: task=3 → new, day=7, update next[3]=11
day=8: task=1 → next[1]=9>8, day=9, update next[1]=13
Final day = 9
```

---

## Problem Description

Given integer array `tasks` (type of each task, must execute in order) and integer `space` (minimum gap between two same-type tasks), return the **minimum number of days** to finish all tasks. ([LeetCode](https://leetcode.com/problems/task-scheduler-ii))

Difficulty: Medium | Acceptance: 54.0%

- Example 1: `tasks=[1,2,1,2,3,1], space=3` → `9`
- Example 2: `tasks=[5,8,8,5], space=2` → `6`

Constraints: `1 ≤ tasks.length ≤ 10^5`, `1 ≤ tasks[i] ≤ 10^9`, `1 ≤ space ≤ 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "Task phải thực hiện đúng thứ tự trong mảng, không thể hoán đổi" / Tasks must be executed in given order — cannot reorder
2. **Vs Task Scheduler I**: "Bài I có thể sắp xếp lại → dùng heap; bài II cố định thứ tự → greedy đơn giản hơn" / Task Scheduler I allows reordering; this one doesn't
3. **Greedy**: "Mỗi ngày chỉ làm 1 task. Nếu bị block, nhảy thẳng đến ngày sẵn sàng" / Each day do 1 task; if blocked, jump to ready day
4. **Update formula**: "`nextAvail[task] = day + space + 1` sau khi hoàn thành" / After completing: next available = current day + space + 1
5. **Edge cases**: "Tất cả task khác nhau → mỗi ngày làm 1 task, tổng = n ngày" / All different types: n days total
6. **Follow-up**: "Nếu mỗi task có độ dài khác nhau? → cộng duration vào day" / Variable task durations: add duration to day

---

## Solutions

```typescript
/**
 * Solution 1: Simulation with set tracking current day
 * Time: O(n·space) — worst case advance day one by one (TLE for large space)
 * Space: O(k) — k unique task types
 */
function taskSchedulerIIBrute(tasks: number[], space: number): number {
  const lastDone = new Map<number, number>();
  let day = 0;

  for (const task of tasks) {
    day++;
    if (lastDone.has(task)) {
      const earliest = lastDone.get(task)! + space + 1;
      if (day < earliest) day = earliest; // wait (jump to earliest)
    }
    lastDone.set(task, day);
  }

  return day;
}

/**
 * Solution 2: Greedy — track next available day per task type
 * Time: O(n) — one pass, O(1) per task with hash map
 * Space: O(k) — k = number of unique task types
 *
 * Key: nextAvailable[task] = earliest day we can do this task again.
 * Each task: day = max(day+1, nextAvailable[task]), then update nextAvailable.
 */
function taskSchedulerII(tasks: number[], space: number): number {
  // nextAvailable[task] = earliest day we can schedule this task type
  const nextAvailable = new Map<number, number>();
  let day = 0;

  for (const task of tasks) {
    day++; // advance to next day

    // If this task type has a cooldown constraint, skip to the ready day
    if (nextAvailable.has(task)) {
      day = Math.max(day, nextAvailable.get(task)!);
    }

    // Schedule the task on 'day', set next available day
    nextAvailable.set(task, day + space + 1);
  }

  return day;
}

// === Test Cases ===
console.log(taskSchedulerII([1, 2, 1, 2, 3, 1], 3)); // 9
console.log(taskSchedulerII([5, 8, 8, 5], 2)); // 6
console.log(taskSchedulerII([1, 2, 3], 3)); // 3 (all different)
console.log(taskSchedulerII([1, 1, 1], 2)); // 7 (1→day1, 1→day4, 1→day7)
```

---

## 🔗 Related Problems

- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — cooldown scheduler with reordering (use heap/greedy)
- [Rearrange String k Distance Apart](https://leetcode.com/problems/rearrange-string-k-distance-apart) — place chars with min gap (reorderable)
- [Process Tasks Using Servers](https://leetcode.com/problems/process-tasks-using-servers) — task assignment with priority queue
- [Reorganize String](https://leetcode.com/problems/reorganize-string) — rearrange with same-char cooldown of 1
- [Design Task Manager](https://leetcode.com/problems/design-task-manager) — task tracking with priority
