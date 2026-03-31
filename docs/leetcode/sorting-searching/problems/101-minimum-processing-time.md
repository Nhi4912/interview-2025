---
layout: page
title: "Minimum Processing Time"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-processing-time"
---

# Minimum Processing Time / Thời Gian Xử Lý Tối Thiểu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống xếp lịch công việc — bạn có nhiều bộ xử lý, mỗi bộ nhận 4 task. Để **hoàn thành sớm nhất**, hãy ghép bộ xử lý nhanh nhất với 4 task **nặng nhất**. Tại sao? Vì bộ chậm dù sao cũng chậm — không lãng phí bộ nhanh cho task nhẹ.

**Pattern Recognition:**

- n processors × 4 tasks each → assign heaviest tasks to fastest processors
- Greedy proof: swapping any assignment only worsens the maximum finish time
- Sort both arrays; match largest processor free-time with 4 largest tasks

**Visual:**

```
processorTime = [8, 10]   (sorted asc → [8, 10])
tasks = [2,2,3,1,8,7,4,5] (sorted desc → [8,7,5,4,3,2,2,1])

Processor 0 (free at 8):  tasks[0..3] = [8,7,5,4] → finish = 8 + 8 = 16
Processor 1 (free at 10): tasks[4..7] = [3,2,2,1] → finish = 10 + 3 = 13

Answer = max(16, 13) = 16 ✅
```

## Problem Description

You have `n` processors, each with a free time given in `processorTime[]`. There are `4*n` tasks in `tasks[]`. Assign exactly 4 tasks to each processor. The finish time for processor `i` is `processorTime[i] + max(its 4 tasks)`. Return the **minimum possible maximum finish time**.

**Example 1:** `processorTime = [8,10]`, `tasks = [2,2,3,1,8,7,4,5]` → `16`
**Example 2:** `processorTime = [10,20]`, `tasks = [2,3,1,2,5,8,4,3]` → `23`

## 📝 Interview Tips

1. **Clarify**: Mỗi processor nhận đúng 4 task? Minimize maximum hay sum? / Each processor takes exactly 4 tasks; minimize the maximum finish time
2. **Approach**: Sắp xếp cả hai mảng — processor tự do sớm nhất nhận 4 task lớn nhất / Sort both; pair fastest processor with heaviest tasks
3. **Edge cases**: Tất cả task bằng nhau; một processor; processorTime=0 / All tasks equal; single processor
4. **Optimize**: Greedy là tối ưu ở đây — không cần DP / Pure greedy, no need for DP
5. **Test**: `processorTime=[8,10]`, `tasks=[2,2,3,1,8,7,4,5]` → 16 / Trace through example manually
6. **Follow-up**: Nếu mỗi processor nhận k task (không chỉ 4)? / What if each processor takes k tasks instead of 4?

## Solutions

```typescript
/** Solution 1: Greedy — sort processors asc, tasks desc; match greedily
 * Time: O(n log n) | Space: O(1) extra
 */
function minimumProcessingTime(processorTime: number[], tasks: number[]): number {
  processorTime.sort((a, b) => a - b); // slowest last
  tasks.sort((a, b) => b - a); // heaviest first

  let ans = 0;
  for (let i = 0; i < processorTime.length; i++) {
    // Processor i gets tasks at indices [4i, 4i+1, 4i+2, 4i+3]
    // Heaviest of those 4 is tasks[4*i] (sorted desc)
    const finishTime = processorTime[i] + tasks[4 * i];
    ans = Math.max(ans, finishTime);
  }
  return ans;
}

/** Solution 2: Explicit grouping — clearer for explanation
 * Time: O(n log n) | Space: O(n)
 */
function minimumProcessingTime2(processorTime: number[], tasks: number[]): number {
  const pt = [...processorTime].sort((a, b) => a - b);
  const t = [...tasks].sort((a, b) => b - a);

  const finishTimes = pt.map((free, i) => free + t[4 * i]);
  return Math.max(...finishTimes);
}

// Test cases
console.log(minimumProcessingTime([8, 10], [2, 2, 3, 1, 8, 7, 4, 5])); // 16
console.log(minimumProcessingTime([10, 20], [2, 3, 1, 2, 5, 8, 4, 3])); // 23
console.log(minimumProcessingTime2([8, 10], [2, 2, 3, 1, 8, 7, 4, 5])); // 16
```

## 🔗 Related Problems

| Problem                                                        | Relationship                                      |
| -------------------------------------------------------------- | ------------------------------------------------- |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler) | Assign tasks to minimize time with constraints    |
| [Assign Cookies](https://leetcode.com/problems/assign-cookies) | Greedy matching of two sorted arrays              |
| [IPO](https://leetcode.com/problems/ipo)                       | Greedy with heap to maximize profit by task order |
