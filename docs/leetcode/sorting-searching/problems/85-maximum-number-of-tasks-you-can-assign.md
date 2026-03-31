---
layout: page
title: "Maximum Number of Tasks You Can Assign"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Greedy, Queue]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign"
---

# Maximum Number of Tasks You Can Assign / Số Nhiệm Vụ Tối Đa Có Thể Giao

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search + Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Most Profit Assigning Work](https://leetcode.com/problems/most-profit-assigning-work) | [Valid Triangle Number](https://leetcode.com/problems/valid-triangle-number)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Bạn quản lý công trường — công nhân mạnh nhất làm việc khó nhất. Bạn có `pills` viên thuốc tăng lực (`strength + strength_bonus`). Câu hỏi: tối đa có thể giao bao nhiêu nhiệm vụ? **Binary search** trên số nhiệm vụ `k`, rồi **greedy check** xem `k` nhiệm vụ dễ nhất có thể hoàn thành không.

```
tasks=[3,2,1], workers=[0,3,3], pills=1, strength=1
Sort tasks asc: [1,2,3], workers desc: [3,3,0]

Binary search: can we do k=2 tasks?
  Tasks: [1,2], Workers (top-2): [3,3]
  Greedy: hardest task=2, strongest worker=3 (no pill needed) ✓
           next task=1, next worker=3 (no pill needed) ✓
  → YES, k=2 is feasible → try k=3

k=3: Tasks=[1,2,3], Workers=[3,3,0]
  task=3: worker=3? ✓ but worker 0 needs pill: 0+1=1 < 3 ✗
  → Try weakest worker that can do task with pill
  → pill: 0+1=1 < 3, no valid worker → FAIL
  → answer = 2
```

---

## Problem Description

Given `tasks[i]` (minimum strength required) and `workers[j]` (strength), and `pills` of `strength` bonus each, find the **maximum number of tasks** that can be assigned (each worker does at most one task).

- **Example 1:** `tasks=[3,2,1], workers=[0,3,3], pills=1, strength=1` → `3`
- **Example 2:** `tasks=[5,4], workers=[0,0,0], pills=1, strength=5` → `1`

---

## 📝 Interview Tips

- 🔍 **Binary search on answer:** "Maximum number" → BS on k from 0 to min(n,m); check if k tasks feasible
- 🎯 **Greedy check:** Take k easiest tasks, k strongest workers. For each task (hardest first): try strongest worker without pill; if not strong enough, find weakest worker that CAN with pill
- 🔄 **Deque for pill candidates:** Workers who can do a task with pill form a window → use sorted structure
- 📊 **Complexity:** O(n log n + m log m + min(n,m) × log(min(n,m)) × log(min(n,m)))
- ⚠️ **Greedy direction:** Process tasks from hardest → easiest; for each task try to save pills
- 💡 **Why BS works:** Feasibility is monotone — if k tasks possible, then k-1 tasks also possible

---

## Solutions

### Solution 1: Binary search + greedy with sorted window

```typescript
/**
 * Binary search on k; greedy check using sorted array as ordered set
 * Time: O(n log n + m log m + min(n,m) * log²(min(n,m)))  Space: O(n+m)
 */
function maxTaskAssign(
  tasks: number[],
  workers: number[],
  pills: number,
  strength: number,
): number {
  tasks.sort((a, b) => a - b);
  workers.sort((a, b) => a - b);
  const n = tasks.length,
    m = workers.length;

  const canAssign = (k: number): boolean => {
    // Take k easiest tasks, k strongest workers
    const kTasks = tasks.slice(0, k);
    // Workers: top-k strongest (sorted asc, take last k)
    const kWorkers = workers.slice(m - k).sort((a, b) => a - b);
    let pillsLeft = pills;

    // Process tasks from hardest to easiest
    // Use a simple sorted array to simulate ordered set of available workers
    const available = [...kWorkers];

    for (let i = k - 1; i >= 0; i--) {
      const task = kTasks[i];
      // Can the strongest available worker do this task without pill?
      if (available[available.length - 1] >= task) {
        available.pop();
      } else {
        // Find the weakest worker who can do it WITH a pill
        if (pillsLeft === 0) return false;
        // Binary search: find first worker >= task - strength
        const boosted = task - strength;
        let lo = 0,
          hi = available.length - 1,
          idx = -1;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          if (available[mid] >= boosted) {
            idx = mid;
            hi = mid - 1;
          } else lo = mid + 1;
        }
        if (idx === -1) return false;
        available.splice(idx, 1);
        pillsLeft--;
      }
    }
    return true;
  };

  let lo = 0,
    hi = Math.min(n, m);
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (canAssign(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

console.log(maxTaskAssign([3, 2, 1], [0, 3, 3], 1, 1)); // 3
console.log(maxTaskAssign([5, 4], [0, 0, 0], 1, 5)); // 1
console.log(maxTaskAssign([10, 15, 30], [0, 10, 10, 10, 10], 3, 10)); // 2
```

### Solution 2: Cleaner greedy check with explicit deque

```typescript
/**
 * Same approach, cleaner check function — processes tasks hardest first
 * Time: O(n log n + m log m + k log² k)  Space: O(k)
 */
function maxTaskAssign2(
  tasks: number[],
  workers: number[],
  pills: number,
  strength: number,
): number {
  tasks.sort((a, b) => a - b);
  workers.sort((a, b) => b - a);
  const n = tasks.length,
    m = workers.length;

  const feasible = (k: number): boolean => {
    const wk = workers.slice(0, k).sort((a, b) => a - b); // k strongest, asc
    const tk = tasks.slice(0, k); // k easiest, asc
    let p = pills;

    for (let i = k - 1; i >= 0; i--) {
      // Try strongest worker first
      if (wk[wk.length - 1] >= tk[i]) {
        wk.pop();
        continue;
      }
      if (p === 0) return false;
      // Find weakest worker that can do task[i] with pill
      let lo = 0,
        hi = wk.length - 1,
        best = -1;
      const minNeeded = tk[i] - strength;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (wk[mid] >= minNeeded) {
          best = mid;
          hi = mid - 1;
        } else lo = mid + 1;
      }
      if (best === -1) return false;
      wk.splice(best, 1);
      p--;
    }
    return true;
  };

  let lo = 0,
    hi = Math.min(n, m);
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (feasible(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

console.log(maxTaskAssign2([3, 2, 1], [0, 3, 3], 1, 1)); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                               | Difficulty | Connection                               |
| --------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------- |
| [Most Profit Assigning Work](https://leetcode.com/problems/most-profit-assigning-work/)                               | 🟡 Medium  | Binary search + greedy worker assignment |
| [Minimum Difficulty of a Job Schedule](https://leetcode.com/problems/minimum-difficulty-of-a-job-schedule/)           | 🔴 Hard    | Task-worker assignment with constraints  |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler/)                                                       | 🟡 Medium  | Greedy scheduling                        |
| [Maximize the Minimum Powered City](https://leetcode.com/problems/maximize-the-minimum-powered-city/)                 | 🔴 Hard    | Binary search on answer + greedy check   |
| [Find the Maximum Number of Marked Indices](https://leetcode.com/problems/find-the-maximum-number-of-marked-indices/) | 🟡 Medium  | Binary search + greedy matching          |
