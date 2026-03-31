---
layout: page
title: "Most Visited Sector in  a Circular Track"
difficulty: Easy
category: Array
tags: [Array, Simulation]
leetcode_url: "https://leetcode.com/problems/most-visited-sector-in-a-circular-track"
---

# Most Visited Sector in a Circular Track / Khu Vực Được Ghé Thăm Nhiều Nhất Trên Đường Đua Vòng

🟢 Easy | Array · Simulation | LeetCode #1560

## 🧠 Intuition / Tư Duy

**Vietnamese:** Như đường đua vòng tròn — runner đi qua từng khu vực theo chiều kim đồng hồ. Thay vì mô phỏng từng bước, quan sát: khu vực được thăm nhiều nhất luôn nằm trong đoạn `[rounds[0]..rounds[last]]` (chiều kim đồng hồ) hoặc `[1..rounds[last]]` và `[rounds[0]..n]` nếu rounds[-1] < rounds[0].

```
n=4, rounds=[1,3,1,2]

Lap 1: 1→2→3
Lap 2: 3→4→1
Lap 3: 1→2

Visits: 1=3, 2=2, 3=2, 4=1
Most: [1]

Key insight: start=rounds[0], end=rounds[last]
If end >= start: sectors [start..end]
If end < start:  sectors [1..end] + [start..n]
```

## Problem Description

Given `n` sectors (1-indexed) and an array `rounds` where `rounds[i]` is the finish sector of round `i`, the runner starts at `rounds[0]` and visits sectors clockwise. Return **all sectors visited the maximum number of times**, sorted ascending.

The runner always starts at `rounds[0]` before round 1. The key observation reduces simulation to just comparing first and last positions.

**Example 1:**

```
n=4, rounds=[1,3,1,2]
Output: [1,2]  // sector 1 visited 3 times, sector 2 visited 2 times... wait
// Actually output: [1] — sector 1 visited most
```

**Example 2:**

```
n=2, rounds=[2,1,2,1,2]
Output: [2]
```

## 📝 Interview Tips

- **🔑 Key observation / Quan sát then chốt:** Only first and last round positions matter — intermediate full laps visit everything equally
- **🎯 Two cases / Hai trường hợp:** If `end >= start`: answer is `[start..end]`; if `end < start`: `[1..end]` + `[start..n]`
- **🔄 Why it works / Tại sao đúng:** Full laps contribute equal visits to all sectors; partial laps [start→end] skew the distribution
- **⚠️ Simulation fallback / Mô phỏng dự phòng:** If unsure during interview, simulate by building a frequency array — O(n + rounds×n)
- **📊 Complexity / Độ phức tạp:** O(n) with the observation, O(rounds×n) with brute simulation
- **🌟 Edge case / Trường hợp biên:** `rounds[0] == rounds[last]` with single lap → all sectors from start to start

## Solutions

```typescript
/**
 * Approach 1: Mathematical observation — O(n) time
 * Key: only start and end positions of partial lap matter
 * Time: O(n)
 * Space: O(n) for output
 */
function mostVisited(n: number, rounds: number[]): number[] {
  const start = rounds[0];
  const end = rounds[rounds.length - 1];
  const result: number[] = [];

  if (end >= start) {
    for (let i = start; i <= end; i++) result.push(i);
  } else {
    for (let i = 1; i <= end; i++) result.push(i);
    for (let i = start; i <= n; i++) result.push(i);
  }

  return result;
}

console.log(mostVisited(4, [1, 3, 1, 2])); // [1,2]
console.log(mostVisited(2, [2, 1, 2, 1, 2])); // [2]
console.log(mostVisited(7, [1, 3, 5, 7])); // [1,2,3,4,5,6,7]
```

```typescript
/**
 * Approach 2: Simulation with frequency array
 * Time: O(rounds.length * n) — slower but illustrates the problem
 * Space: O(n)
 */
function mostVisitedSimulation(n: number, rounds: number[]): number[] {
  const visits = new Array(n + 1).fill(0);

  // Visit rounds[0] before any round
  let current = rounds[0];
  visits[current]++;

  for (let r = 1; r < rounds.length; r++) {
    const target = rounds[r];
    while (current !== target) {
      current = (current % n) + 1; // move clockwise
      visits[current]++;
    }
  }

  const maxVisits = Math.max(...visits);
  const result: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (visits[i] === maxVisits) result.push(i);
  }
  return result;
}

console.log(mostVisitedSimulation(4, [1, 3, 1, 2])); // [1,2]
console.log(mostVisitedSimulation(2, [2, 1, 2, 1, 2])); // [2]
```

## 🔗 Related Problems

| Problem                                                                                                     | Difficulty | Pattern      |
| ----------------------------------------------------------------------------------------------------------- | ---------- | ------------ |
| [Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game/) | 🟡 Medium  | Simulation   |
| [Design Circular Queue](https://leetcode.com/problems/design-circular-queue/)                               | 🟡 Medium  | Queue        |
| [Circular Array Loop](https://leetcode.com/problems/circular-array-loop/)                                   | 🟡 Medium  | Two Pointers |
| [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/)                                               | 🟡 Medium  | Simulation   |
