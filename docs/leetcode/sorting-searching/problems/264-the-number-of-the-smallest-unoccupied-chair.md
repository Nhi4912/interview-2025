---
layout: page
title: "The Number of the Smallest Unoccupied Chair"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/the-number-of-the-smallest-unoccupied-chair"
---

# The Number of the Smallest Unoccupied Chair / Số Ghế Trống Nhỏ Nhất

> **Track**: Sorting-Searching | **Difficulty**: 🟡 Medium | **Pattern**: Min-Heap Simulation
> **Frequency**: ★★★ Common — heap simulation, gặp ở các bài scheduling/event
> **See also**: [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) | [Task Scheduler](https://leetcode.com/problems/task-scheduler/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một quán cà phê với dãy ghế đánh số từ 0. Khách đến, ngồi vào ghế số nhỏ nhất còn trống; khi về, ghế đó được giải phóng. Ta dùng hai hàng đợi ưu tiên (min-heap): một cái theo dõi ghế trống (sorted by chair number), một cái theo dõi khi nào khách rời đi (sorted by departure time). Khi khách mới đến, ta thu hồi tất cả ghế của khách đã rời rồi mới chọn ghế nhỏ nhất.

**Pattern Recognition:**

- Signal: "assign smallest available resource" + "events: arrive/depart" → **Two Min-Heaps**
- Bài này thuộc dạng event-driven simulation với heap để track tài nguyên trống
- Key insight: Heap 1 = available chairs (min by chair#), Heap 2 = occupied chairs (min by departure time)

**Visual — Two-heap simulation:**

```
times=[[1,4],[2,3],[4,6]], targetFriend=1

Sort by arrival: friend0[1,4], friend1[2,3], friend2[4,6]
available: [0,1,2]  occupied: []

t=1: friend0 arrives → chair=0, occupied:[(4,0)]
t=2: friend1 arrives → chair=1, occupied:[(3,1),(4,0)]  ← targetFriend! ans=1
t=3: friend1 leaves  → occupied:[(4,0)], available:[1]
t=4: friend0 leaves, friend2 arrives → available:[0,1]→chair=0
Answer: 1
```

---

## Problem Description

There are `n` chairs in a waiting room, numbered `0` to `n-1`. Given `times[i] = [arrival_i, leaving_i]` and `targetFriend`, return the **chair number** that `targetFriend` sits on. The friend always sits on the **smallest available** chair. ([LeetCode](https://leetcode.com/problems/the-number-of-the-smallest-unoccupied-chair))

```
Example 1: times=[[1,4],[2,3],[4,6]], targetFriend=1  → 1
Example 2: times=[[3,10],[1,5],[2,6]], targetFriend=0 → 2
```

Constraints: `n == times.length`, `2 <= n <= 10^4`, no two arrivals are the same

---

## 📝 Interview Tips

1. **Sort friends by arrival time** — _Sắp xếp theo thời gian đến để xử lý sự kiện theo thứ tự_
2. **Two heaps: available chairs (min) + departures (min by leave time)** — _Heap ghế trống và heap thời gian rời đi_
3. **Release chairs before assigning new one** — _Trước khi xếp ghế mới, giải phóng tất cả ghế của khách đã rời_
4. **Remember original index of targetFriend after sorting** — _Sau khi sort, cần nhớ friend nào là targetFriend_
5. **Initialize available heap with [0..n-1]** — _Ban đầu tất cả n ghế đều trống_
6. **Time O(n log n), Space O(n)** — _Sort O(n log n) + mỗi phần tử heap push/pop O(log n)_

---

## Solutions

```typescript
// Min-heap (binary heap) implementation
class MinHeap<T> {
  private data: T[] = [];
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
      if (this.cmp(this.data[i], this.data[p]) >= 0) break;
      [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
      i = p;
    }
  }
  private _sinkDown(i: number) {
    const n = this.data.length;
    while (true) {
      let min = i,
        l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this.cmp(this.data[l], this.data[min]) < 0) min = l;
      if (r < n && this.cmp(this.data[r], this.data[min]) < 0) min = r;
      if (min === i) break;
      [this.data[i], this.data[min]] = [this.data[min], this.data[i]];
      i = min;
    }
  }
}

/** Solution 1: Brute Force @complexity Time: O(n²) | Space: O(n) */
function smallestChairBrute(times: number[][], targetFriend: number): number {
  const n = times.length;
  const chairs = new Array(n).fill(0); // 0 = free, >0 = busy until that time
  const order = times.map((t, i) => [t[0], t[1], i]).sort((a, b) => a[0] - b[0]);
  for (const [arr, dep, idx] of order) {
    // Free all chairs that left before arr
    for (let c = 0; c < n; c++) if (chairs[c] <= arr) chairs[c] = 0;
    const chair = chairs.indexOf(0);
    chairs[chair] = dep;
    if (idx === targetFriend) return chair;
  }
  return -1;
}

/** Solution 2: Two Min-Heaps @complexity Time: O(n log n) | Space: O(n) */
function smallestChair(times: number[][], targetFriend: number): number {
  const n = times.length;
  const order = times.map((t, i) => [t[0], t[1], i]).sort((a, b) => a[0] - b[0]);

  // available: min-heap of free chair numbers
  const available = new MinHeap<number>((a, b) => a - b);
  for (let i = 0; i < n; i++) available.push(i);

  // occupied: min-heap of [leaveTime, chairNumber]
  const occupied = new MinHeap<[number, number]>((a, b) => a[0] - b[0]);

  for (const [arr, dep, idx] of order) {
    // Release chairs that became free before/at arrival
    while (occupied.size > 0 && occupied.peek()[0] <= arr) {
      available.push(occupied.pop()[1]);
    }
    const chair = available.pop();
    if (idx === targetFriend) return chair;
    occupied.push([dep, chair]);
  }
  return -1;
}

// === Test Cases ===
console.log(
  smallestChair(
    [
      [1, 4],
      [2, 3],
      [4, 6],
    ],
    1,
  ),
); // 1
console.log(
  smallestChair(
    [
      [3, 10],
      [1, 5],
      [2, 6],
    ],
    0,
  ),
); // 2
```

---

## 🔗 Related Problems

| #   | Problem                                                                                                  | Difficulty | Pattern           |
| --- | -------------------------------------------------------------------------------------------------------- | ---------- | ----------------- |
| 1   | [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)                                      | Medium     | Heap / Sweep Line |
| 2   | [Task Scheduler](https://leetcode.com/problems/task-scheduler/)                                          | Medium     | Heap / Greedy     |
| 3   | [Process Tasks Using Servers](https://leetcode.com/problems/process-tasks-using-servers/)                | Medium     | Two Heaps         |
| 4   | [Maximum Number of Events](https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/) | Medium     | Greedy / Heap     |
