---
layout: page
title: "Minimum Number of Refueling Stops"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-refueling-stops"
---

# Minimum Number of Refueling Stops / Số Lần Đổ Xăng Tối Thiểu

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming + Greedy Heap
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Task Scheduler](https://leetcode.com/problems/task-scheduler)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống lái xe đường dài — bạn muốn dừng đổ xăng ít nhất. Chiến lược tối ưu: khi gần hết xăng mà chưa đến đích, hãy nhìn lại tất cả trạm đã đi qua và đổ tại trạm có nhiều xăng nhất! Đây là greedy: "trả nợ" tại trạm tốt nhất đã bỏ qua, giống như hái quả ngon nhất trong rổ đã thu hoạch.

**Pattern Recognition:**

- Signal: "minimum steps to reach target with resource management" → **DP hoặc Greedy + Max-Heap**
- DP: dp[j] = max fuel sau j lần refuel
- Greedy: khi hết xăng, refuel tại trạm xăng nhiều nhất đã đi qua (max-heap)
- Key insight: Greedy với heap = "lazy refuel" — chỉ đổ khi cần, luôn chọn nhiều nhất

**Visual — target=100, startFuel=10, stations=[[10,60],[20,30],[30,30],[60,40]]:**

```
Greedy trace:
  Start: fuel=10
  Reach station 10 (fuel=60): push 60 to heap
  Reach station 20 (fuel=30): push 30 to heap
  Reach station 30 (fuel=30): push 30 to heap
  fuel=10, station 60: can't reach! Pop max=60 → fuel=70, stops=1
  Reach station 60 (fuel=10): push 40 to heap
  fuel=10, target=100: can't reach! Pop max=40 → fuel=50, stops=2
  Reach target 100? fuel=50 ≥ 40 remaining → YES ✅

DP table:
  dp[j] = max distance reachable with j stops
  dp[0]=10, after station[0]=(10,60): dp[1]=max(dp[1], dp[0]+60)=70
  ...
```

---

## Problem Description

A car starts at position 0 with `startFuel` liters. Stations are at positions `stations[i][0]` with `stations[i][1]` liters of fuel. The car uses 1 liter per unit distance. Return the **minimum number of refueling stops** to reach `target`, or `-1` if impossible.

**Example 1:**

```
Input:  target=1, startFuel=1, stations=[]
Output: 0  (reach directly)
```

**Example 2:**

```
Input:  target=100, startFuel=1, stations=[[10,100]]
Output: -1  (can't even reach station 10)
```

**Example 3:**

```
Input:  target=100, startFuel=10, stations=[[10,60],[20,30],[30,30],[60,40]]
Output: 2
```

**Constraints:** `1 ≤ target, startFuel ≤ 10⁹`, `0 ≤ stations.length ≤ 500`, `0 < stations[i][0] < target`, `1 ≤ stations[i][1] ≤ 10⁹`

---

## 📝 Interview Tips

1. **Clarify**: "Xe đi từ 0 đến target, stations đã được sort theo position chưa?" / Are stations sorted by position? (They are per constraints)
2. **DP state**: "dp[j] = max fuel (= max distance) sau đúng j lần refuel" / dp[j] = max fuel after exactly j stops
3. **DP transition**: "Với station i, process backwards: dp[j+1] = max(dp[j+1], dp[j] + fuel_i) nếu dp[j] ≥ pos_i" / Only refuel if reachable
4. **Greedy insight**: "Khi hết xăng → refuel tại trạm tốt nhất đã đi qua (max-heap) → O(n log n)" / Lazy greedy with max-heap O(n log n)
5. **Edge cases**: "startFuel ≥ target → return 0; không thể đến trạm đầu → return -1" / Direct reach or unreachable first station
6. **Follow-up**: "Nếu cần print lộ trình dừng?" / Track which stations were chosen for path reconstruction

---

## Solutions

```typescript
/**
 * Solution 1: Dynamic Programming
 * Time: O(n²) — for each station, update all dp[j] values
 * Space: O(n) — dp array of size n+1
 *
 * dp[j] = maximum fuel (distance) reachable using exactly j refueling stops
 * Base: dp[0] = startFuel
 * Transition: for station i with pos p and fuel f:
 *   if dp[j] >= p → dp[j+1] = max(dp[j+1], dp[j] + f)
 * Answer: smallest j where dp[j] >= target
 */
function minRefuelStopsDP(target: number, startFuel: number, stations: number[][]): number {
  const n = stations.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = startFuel;

  for (let i = 0; i < n; i++) {
    const [pos, fuel] = stations[i];
    // Process backwards to avoid using station i twice in same iteration
    for (let j = i; j >= 0; j--) {
      if (dp[j] >= pos) {
        // can we reach station i with j stops?
        dp[j + 1] = Math.max(dp[j + 1], dp[j] + fuel);
      }
    }
  }

  for (let j = 0; j <= n; j++) {
    if (dp[j] >= target) return j;
  }
  return -1;
}

/**
 * Solution 2: Greedy + Max-Heap
 * Time: O(n log n) — each station pushed/popped once
 * Space: O(n) — heap
 *
 * Idea: drive forward; when we can't proceed, retroactively refuel
 * at the most fuel-rich station we've passed (max-heap).
 * This is equivalent to choosing the globally optimal set of stops.
 */
function minRefuelStops(target: number, startFuel: number, stations: number[][]): number {
  // Max-heap of available fuel amounts
  const heap: number[] = [];

  const pushMax = (val: number) => {
    heap.push(val);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p] >= heap[i]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };

  const popMax = (): number => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let m = i,
          l = 2 * i + 1,
          r = 2 * i + 2;
        if (l < heap.length && heap[l] > heap[m]) m = l;
        if (r < heap.length && heap[r] > heap[m]) m = r;
        if (m === i) break;
        [heap[i], heap[m]] = [heap[m], heap[i]];
        i = m;
      }
    }
    return top;
  };

  let fuel = startFuel;
  let stops = 0;
  let i = 0;

  while (fuel < target) {
    // Collect all reachable stations into the heap
    while (i < stations.length && stations[i][0] <= fuel) {
      pushMax(stations[i][1]);
      i++;
    }
    if (heap.length === 0) return -1; // stranded — no reachable station
    fuel += popMax(); // retroactively stop at best station
    stops++;
  }
  return stops;
}

// === Test Cases ===
console.log(minRefuelStops(1, 1, [])); // 0
console.log(minRefuelStops(100, 1, [[10, 100]])); // -1
console.log(
  minRefuelStops(100, 10, [
    [10, 60],
    [20, 30],
    [30, 30],
    [60, 40],
  ]),
); // 2
console.log(
  minRefuelStopsDP(100, 10, [
    [10, 60],
    [20, 30],
    [30, 30],
    [60, 40],
  ]),
); // 2
console.log(minRefuelStops(1000000000, 1000000000, [])); // 0
```

---

## 🔗 Related Problems

| Problem                                                                              | Pattern              | Difficulty |
| ------------------------------------------------------------------------------------ | -------------------- | ---------- |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii)                           | Greedy / BFS         | Medium     |
| [Jump Game VII](https://leetcode.com/problems/jump-game-vii)                         | BFS / Sliding Window | Medium     |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                       | Greedy + Heap        | Medium     |
| [Gas Station](https://leetcode.com/problems/gas-station)                             | Greedy               | Medium     |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) | Greedy / DP          | Medium     |
