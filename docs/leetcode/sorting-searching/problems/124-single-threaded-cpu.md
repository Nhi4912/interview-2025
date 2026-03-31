---
layout: page
title: "Single-Threaded CPU"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/single-threaded-cpu"
---

# Single-Threaded CPU / CPU Đơn Luồng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Giống phòng khám đa khoa:** bệnh nhân xếp hàng theo giờ hẹn, nhưng bác sĩ ưu tiên người có ca mổ ngắn nhất. Heap min giúp luôn chọn ca ngắn nhất sẵn có.

**Pattern Recognition:**

- Signal: "tasks with arrive time + process time + pick by priority" → **Simulation + Min-Heap**
- Nếu CPU rảnh, nhảy thẳng đến enqueueTime nhỏ nhất kế tiếp
- Tie-break bằng originalIndex → heap sort theo `[processingTime, origIdx]`

**Visual:**

```
tasks = [[1,2],[2,4],[3,2],[4,1]]  → sorted by enqueue: same
time=0: no task available
time=1: enqueue task0=[2,0] → heap:[(2,0)]
  → process task0, time=1+2=3
time=3: enqueue task1=(4,1),task2=(2,2) → heap:[(2,2),(4,1)]
  → process task2, time=3+2=5
time=5: enqueue task3=(1,3) → heap:[(1,3),(4,1)]
  → process task3, time=5+1=6
time=6: heap:[(4,1)] → process task1
Result: [0, 2, 3, 1] ✅
```

## Problem Description

Given `n` tasks each with `[enqueueTime, processingTime]`, a single-threaded CPU picks the task with the **smallest processingTime** (ties: smallest original index) from all tasks available at the current time. Return the order tasks were processed.

- Example 1: `[[1,2],[2,4],[3,2],[4,1]]` → `[0,2,3,1]`
- Example 2: `[[7,10],[7,12],[7,5],[7,4],[7,2]]` → `[4,3,2,0,1]`

## 📝 Interview Tips

1. **Clarify**: Có thể có nhiều tasks cùng enqueueTime không? / Can multiple tasks arrive at the same time?
2. **Approach**: Sort by enqueueTime, dùng min-heap / Sort tasks by arrive time, maintain min-heap by (processingTime, idx)
3. **Edge cases**: CPU rảnh phải nhảy time / If heap empty, jump time to next task's enqueue
4. **Optimize**: Sort O(n log n) + heap O(n log n) → tổng O(n log n) / Overall O(n log n)
5. **Follow-up**: Nếu có nhiều CPU? / What if there are multiple CPUs? → assignment problem
6. **Complexity**: Time O(n log n), Space O(n) / Time O(n log n), Space O(n)

## Solutions

```typescript
/** Solution 1: Brute Force – Array Scan Each Step
 * Time: O(n²) | Space: O(n)
 */
function singleThreadedCpuBrute(tasks: number[][]): number[] {
  const n = tasks.length;
  const done = new Array(n).fill(false);
  const result: number[] = [];
  let time = 0;

  while (result.length < n) {
    let best = -1;
    for (let i = 0; i < n; i++) {
      if (!done[i] && tasks[i][0] <= time) {
        if (
          best === -1 ||
          tasks[i][1] < tasks[best][1] ||
          (tasks[i][1] === tasks[best][1] && i < best)
        )
          best = i;
      }
    }
    if (best === -1) {
      // Jump to earliest available task
      let minT = Infinity;
      for (let i = 0; i < n; i++) if (!done[i]) minT = Math.min(minT, tasks[i][0]);
      time = minT;
    } else {
      done[best] = true;
      time += tasks[best][1];
      result.push(best);
    }
  }
  return result;
}

/** Solution 2: Sort + Min-Heap Simulation
 * Time: O(n log n) | Space: O(n)
 */
function singleThreadedCpu(tasks: number[][]): number[] {
  // Sort by enqueue time; keep original index
  const sorted = tasks.map((t, i) => [t[0], t[1], i]).sort((a, b) => a[0] - b[0] || a[2] - b[2]);
  // Min-heap: [processingTime, originalIdx]
  const heap: [number, number][] = [];
  const push = (item: [number, number]) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] > heap[i][0] || (heap[p][0] === heap[i][0] && heap[p][1] > heap[i][1])) {
        [heap[p], heap[i]] = [heap[i], heap[p]];
        i = p;
      } else break;
    }
  };
  const pop = (): [number, number] => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i,
          l = 2 * i + 1,
          r = 2 * i + 2;
        const lt = (a: [number, number], b: [number, number]) =>
          a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
        if (l < heap.length && lt(heap[l], heap[s])) s = l;
        if (r < heap.length && lt(heap[r], heap[s])) s = r;
        if (s === i) break;
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      }
    }
    return top;
  };

  const result: number[] = [];
  let time = 0,
    j = 0;
  while (result.length < tasks.length) {
    while (j < sorted.length && sorted[j][0] <= time) {
      push([sorted[j][1], sorted[j][2]]);
      j++;
    }
    if (heap.length === 0) {
      time = sorted[j][0];
      continue;
    }
    const [proc, origIdx] = pop();
    result.push(origIdx);
    time += proc;
  }
  return result;
}

// Tests
console.log(
  JSON.stringify(
    singleThreadedCpu([
      [1, 2],
      [2, 4],
      [3, 2],
      [4, 1],
    ]),
  ),
); // [0,2,3,1]
console.log(
  JSON.stringify(
    singleThreadedCpu([
      [7, 10],
      [7, 12],
      [7, 5],
      [7, 4],
      [7, 2],
    ]),
  ),
); // [4,3,2,0,1]
console.log(
  JSON.stringify(
    singleThreadedCpu([
      [1, 1],
      [2, 2],
      [3, 3],
    ]),
  ),
); // [0,1,2]
console.log(
  JSON.stringify(
    singleThreadedCpuBrute([
      [1, 2],
      [2, 4],
      [3, 2],
      [4, 1],
    ]),
  ),
); // [0,2,3,1]
```

## 🔗 Related Problems

| Problem                                                                                    | Relationship                |
| ------------------------------------------------------------------------------------------ | --------------------------- |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                             | Greedy scheduling with heap |
| [IPO](https://leetcode.com/problems/ipo)                                                   | Sort + two-heap greedy      |
| [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream) | Dual-heap maintenance       |
