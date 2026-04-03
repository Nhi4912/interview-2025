---
layout: page
title: "Find Servers That Handled Most Number of Requests"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Greedy, Heap (Priority Queue), Ordered Set]
leetcode_url: "https://leetcode.com/problems/find-servers-that-handled-most-number-of-requests"
---

# Find Servers That Handled Most Number of Requests / Tìm Server Xử Lý Nhiều Request Nhất

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Heap + Sorted Set Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy nghĩ như điều phối server trong data center. Request i muốn server `i%k`. Nếu bận, thử server tiếp theo theo vòng. Ta cần: (1) biết server nào **đang rảnh** và (2) **giải phóng** server khi job xong — heap giúp giải phóng hiệu quả.

**Pattern Recognition:**

- Signal: "assign to next available" + "release by time" → **Min-Heap + Sorted Available Set**
- Min-heap (endTime, serverId) → giải phóng server đúng thời điểm
- Sorted available array + binary search → tìm server tiếp theo >= preferred

**Visual — Request assignment flow:**

```
k=3  servers: [0,1,2]

Request 0 (t=1, load=5): preferred=0%3=0, available=[0,1,2]
  → assign server 0, busy=[(6,0)]           count=[1,0,0]

Request 1 (t=2, load=2): preferred=1%3=1, available=[1,2]
  → assign server 1, busy=[(4,1),(6,0)]     count=[1,1,0]

Request 3 (t=4, load=3): t=4→free server1, available=[1,2]
  preferred=3%3=0, find >=0 → server 1
  → busy=[(6,0),(7,1)]                      count=[1,2,0]

Winner: server 1 with count=2  ✅
```

---

## Problem Description

Có `k` server (0-indexed). Mỗi request i đến tại `arrival[i]`, cần `load[i]` thời gian. Gán cho server `i%k` nếu rảnh, nếu không thử server tiếp (circular). Trả về server nào xử lý nhiều request nhất. ([LeetCode 1606](https://leetcode.com/problems/find-servers-that-handled-most-number-of-requests))

- Example 1: `k=3, arrival=[1,2,3,4,5], load=[5,2,3,3,3]` → `[1]`
- Example 2: `k=3, arrival=[1,2,3,4], load=[1,2,1,2]` → `[0]`
- Example 3: `k=3, arrival=[1,2,3], load=[10,10,10]` → `[0,1,2]`

Constraints: `1 ≤ k ≤ 10⁵`, `1 ≤ arrival.length ≤ 10⁵`

---

## 📝 Interview Tips

1. **Clarify**: "Server rảnh nghĩa là endTime <= arrival hiện tại" / Server free when its end time <= current arrival
2. **Brute force**: "Mỗi request, scan toàn bộ servers O(n×k)" / Linear scan all servers per request
3. **Heap intuition**: "Min-heap theo endTime → biết ngay server nào rảnh tiếp theo" / Min-heap gives earliest-free server
4. **Sorted set**: "Cần tìm server >= preferred — sorted array + binary search" / Sorted structure for next-available lookup
5. **Wrap around**: "Nếu không tìm được >= preferred, lấy server đầu tiên trong available" / Wrap: take index 0 if none found right
6. **Complexity**: "O(n log k) với sorted set thực sự; O(nk) với sorted array + splice" / Note splice is O(k) per op

---

## Solutions

```typescript
// Inline min-heap for (endTime, serverId) pairs — sorted by endTime then serverId
class BusyHeap {
  private h: [number, number][] = [];
  push(v: [number, number]) {
    this.h.push(v);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      const [pt, pi] = this.h[p],
        [vt, vi] = this.h[i];
      if (pt > vt || (pt === vt && pi > vi)) {
        [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
        i = p;
      } else break;
    }
  }
  pop(): [number, number] {
    const top = this.h[0],
      last = this.h.pop()!;
    if (this.h.length) {
      this.h[0] = last;
      let i = 0;
      while (true) {
        let j = 2 * i + 1;
        if (j + 1 < this.h.length) {
          const [at, ai] = this.h[j],
            [bt, bi] = this.h[j + 1];
          if (bt < at || (bt === at && bi < ai)) j++;
        }
        if (j >= this.h.length) break;
        const [it, ii] = this.h[i],
          [jt, ji] = this.h[j];
        if (it < jt || (it === jt && ii < ji)) break;
        [this.h[i], this.h[j]] = [this.h[j], this.h[i]];
        i = j;
      }
    }
    return top;
  }
  peek(): [number, number] {
    return this.h[0];
  }
  size(): number {
    return this.h.length;
  }
}

/**
 * Solution 1: Brute Force — scan servers linearly per request
 * Time: O(n × k) — for each request, check servers one by one
 * Space: O(k) — endTimes array
 */
function findServersBruteForce(k: number, arrival: number[], load: number[]): number[] {
  const endTime = new Array(k).fill(0);
  const count = new Array(k).fill(0);
  for (let i = 0; i < arrival.length; i++) {
    const pref = i % k;
    let assigned = -1;
    for (let j = 0; j < k; j++) {
      const srv = (pref + j) % k;
      if (endTime[srv] <= arrival[i]) {
        assigned = srv;
        break;
      }
    }
    if (assigned !== -1) {
      endTime[assigned] = arrival[i] + load[i];
      count[assigned]++;
    }
  }
  const mx = Math.max(...count);
  return count.reduce((acc, c, i) => {
    if (c === mx) acc.push(i);
    return acc;
  }, [] as number[]);
}

/**
 * Solution 2: Min-Heap + Sorted Available Array (Optimal)
 * Time: O(n log k) with a true sorted set; O(nk) here due to splice on sorted array
 * Space: O(k) — heap and available list
 */
function findServersThatHandledMostNumberOfRequests(
  k: number,
  arrival: number[],
  load: number[],
): number[] {
  const available: number[] = Array.from({ length: k }, (_, i) => i);
  const busy = new BusyHeap();
  const count = new Array(k).fill(0);

  // Binary search: first index in available with value >= target
  function lowerBound(target: number): number {
    let lo = 0,
      hi = available.length;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (available[m] < target) lo = m + 1;
      else hi = m;
    }
    return lo;
  }

  for (let i = 0; i < arrival.length; i++) {
    const t = arrival[i];
    // Release servers whose jobs ended by time t
    while (busy.size() && busy.peek()[0] <= t) {
      const [, sid] = busy.pop();
      const pos = lowerBound(sid);
      available.splice(pos, 0, sid); // Insert back in sorted order
    }
    if (!available.length) continue; // All busy — drop request

    const preferred = i % k;
    let idx = lowerBound(preferred);
    if (idx >= available.length) idx = 0; // Wrap: use smallest available server

    const sid = available.splice(idx, 1)[0];
    count[sid]++;
    busy.push([t + load[i], sid]);
  }

  const maxCount = Math.max(...count);
  return count.reduce((acc, c, i) => {
    if (c === maxCount) acc.push(i);
    return acc;
  }, [] as number[]);
}

// === Test Cases ===
console.log(findServersThatHandledMostNumberOfRequests(3, [1, 2, 3, 4, 5], [5, 2, 3, 3, 3])); // [1]
console.log(findServersThatHandledMostNumberOfRequests(3, [1, 2, 3, 4], [1, 2, 1, 2])); // [0]
console.log(findServersThatHandledMostNumberOfRequests(3, [1, 2, 3], [10, 10, 10])); // [0,1,2]
console.log(findServersThatHandledMostNumberOfRequests(1, [1, 2], [1, 2])); // [0]
```

---

## 🔗 Related Problems

- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — greedy scheduling with cooldown periods
- [Minimize Deviation in Array](https://leetcode.com/problems/minimize-deviation-in-array) — heap-based greedy optimization
- [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem) — event-driven heap processing
- [Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit) — monotonic queue for range tracking
- [Find Servers That Handled Most Number of Requests — LeetCode](https://leetcode.com/problems/find-servers-that-handled-most-number-of-requests) — problem page
