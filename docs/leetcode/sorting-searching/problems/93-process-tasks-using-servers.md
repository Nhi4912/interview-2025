---
layout: page
title: "Process Tasks Using Servers"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/process-tasks-using-servers"
---

# Process Tasks Using Servers / Xử Lý Công Việc Bằng Máy Chủ

> **Difficulty**: 🟡 Medium | **Category**: Sorting-Searching | **Pattern**: Dual Heap Simulation

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như phân công công việc ở bưu điện — có hàng đợi máy rảnh và hàng đợi máy bận. Khi đến giờ task mới, đưa máy bận đã xong về hàng rảnh, rồi giao task cho máy rảnh ưu tiên nhất.

**Pattern Recognition:**

- Free servers need priority → min-heap by (weight, index) → **Dual Heap**
- Busy servers finish at future time → min-heap by (finish_time, index)
- Simulate time: at task i's arrival, release finished servers, assign best free server

**Visual:**

```
servers=[3,3,2], tasks=[1,2,3,2,1,2]
free heap (weight,idx): [(2,2),(3,0),(3,1)]
busy heap (finish,weight,idx): []

t=0: task[0]=1 → assign server 2(w=2): free=[(3,0),(3,1)], busy=[(1,2,2)]
t=1: task[1]=2 → server 2 done(t=1) → free=[(2,2),(3,0),(3,1)] → assign 2: busy=[(3,2,2),(3,0),(3,1)]
...
result=[2,2,0,2,1,2]
```

## Problem Description

You have `servers[i]` (weight values) servers and `tasks[j]` (duration) tasks. Task `j` arrives at time `j`. Assign each task to the free server with smallest weight (break ties by index). If no server is free, wait until the earliest one becomes free. Return the server index assigned to each task.

**Example:**

- servers=[3,3,2], tasks=[1,2,3,2,1,2] → [2,2,0,2,1,2]
- servers=[5,1,4,3,2], tasks=[2,1,2,4,5,2,1] → [1,4,1,4,1,3,2]

**Constraints:** 1 ≤ servers.length, tasks.length ≤ 2×10⁵, 1 ≤ servers[i], tasks[j] ≤ 2×10⁵

## 📝 Interview Tips

1. **Clarify**: How to break ties between servers? (smallest weight, then smallest index)
2. **Approach**: Two min-heaps: free servers (weight, idx) and busy servers (finishTime, weight, idx)
3. **Edge cases**: More tasks than servers (must wait), all servers same weight, tasks of length 1
4. **Optimize**: JavaScript lacks built-in heap — must implement or simulate with sorted structures
5. **Follow-up**: What if tasks have priorities too?
6. **Complexity**: Time O((n+m) log n), Space O(n)

## Solutions

```typescript
// Min-Heap helper
class MinHeap<T> {
  private data: T[] = [];
  constructor(private compare: (a: T, b: T) => number) {}

  push(val: T): void {
    this.data.push(val);
    this.bubbleUp(this.data.length - 1);
  }

  pop(): T | undefined {
    if (!this.data.length) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  peek(): T | undefined {
    return this.data[0];
  }
  size(): number {
    return this.data.length;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(this.data[i], this.data[parent]) < 0) {
        [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
        i = parent;
      } else break;
    }
  }

  private sinkDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let min = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this.compare(this.data[l], this.data[min]) < 0) min = l;
      if (r < n && this.compare(this.data[r], this.data[min]) < 0) min = r;
      if (min === i) break;
      [this.data[i], this.data[min]] = [this.data[min], this.data[i]];
      i = min;
    }
  }
}

// Solution 1: Dual Min-Heap Simulation — Time: O((n+m) log n) | Space: O(n)
function assignTasks(servers: number[], tasks: number[]): number[] {
  // Free: [weight, index]
  const free = new MinHeap<[number, number]>((a, b) => a[0] - b[0] || a[1] - b[1]);
  // Busy: [finishTime, weight, index]
  const busy = new MinHeap<[number, number, number]>(
    (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2],
  );

  for (let i = 0; i < servers.length; i++) free.push([servers[i], i]);

  const result: number[] = [];

  for (let t = 0; t < tasks.length; t++) {
    const taskTime = t; // task j arrives at time j

    // Release servers that finished by time t
    while (busy.size() > 0 && busy.peek()![0] <= taskTime) {
      const [, w, idx] = busy.pop()!;
      free.push([w, idx]);
    }

    if (free.size() > 0) {
      const [w, idx] = free.pop()!;
      result.push(idx);
      busy.push([taskTime + tasks[t], w, idx]);
    } else {
      // No free server: wait for earliest
      const [finishTime, w, idx] = busy.pop()!;
      result.push(idx);
      busy.push([finishTime + tasks[t], w, idx]);
    }
  }

  return result;
}

// Tests
console.log(assignTasks([3, 3, 2], [1, 2, 3, 2, 1, 2])); // [2,2,0,2,1,2]
console.log(assignTasks([5, 1, 4, 3, 2], [2, 1, 2, 4, 5, 2, 1])); // [1,4,1,4,1,3,2]
console.log(assignTasks([1], [1, 2, 3])); // [0,0,0]
```

## 🔗 Related Problems

| Problem                                                                                                          | Relationship                        |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                                                   | Assign tasks with cooldowns         |
| [Find Servers That Handled Most Requests](https://leetcode.com/problems/find-servers-that-handled-most-requests) | Similar server-task assignment      |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii)                                               | Min-heap to track room availability |
