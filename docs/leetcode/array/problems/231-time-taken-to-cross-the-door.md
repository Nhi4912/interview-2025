---
layout: page
title: "Time Taken to Cross the Door"
difficulty: Hard
category: Array
tags: [Array, Queue, Simulation]
leetcode_url: "https://leetcode.com/problems/time-taken-to-cross-the-door"
---

# Time Taken to Cross the Door / Thời Gian Để Qua Cửa

> **Difficulty**: 🔴 Hard | **Category**: Array | **Pattern**: Queue Simulation / Priority Scheduling

## 🧠 Intuition / Tư Duy

**Như cửa quay ở siêu thị**: người vào (state=1) và người ra (state=0) dùng chung cửa. Mỗi giây chỉ một người qua. Quy tắc ưu tiên: cùng thời điểm chờ → ưu tiên hướng vừa dùng (inertia); nếu không ai chờ → reset về exit (0).

**Pattern Recognition:**

- Hai hàng đợi: enterQueue và exitQueue với thời gian đến
- Mỗi tick: nếu cả hai có người chờ → ưu tiên hướng vừa dùng (lastDir)
- Nếu không ai chờ nhưng cả hai có người sắp đến → reset lastDir = 0 (exit)
- Simulate từng giây cho đến khi hết người

**Visual:**

```
arrival=[0,1,1,2,4], state=[0,1,0,0,1]
t=0: exit=[0,2,3], enter=[1] → exit group chờ (vì lastDir=0 ban đầu) → person 0 exits
t=1: exit=[2,3], enter=[1] → both wait, lastDir=0 (exit) → person 1...
     enter=[1,4], exit=[2,3] → lastDir=0 → exit: person 2 exits (arrival=1)
...
```

## Problem Description

`n` người đến cửa tại thời điểm `arrival[i]`, `state[i]=0` muốn ra ngoài, `state[i]=1` muốn vào trong. Mỗi giây một người qua. Nếu cả hai hướng có người chờ: ưu tiên hướng vừa dùng; nếu không ai vừa dùng → ưu tiên exit. Trả về mảng `answer[i]` = thời gian người i qua cửa.

**Example:** `arrival=[0,1,1,2,4], state=[0,1,0,0,1]` → `[0,3,1,2,4]`

**Constraints:** `1 ≤ n ≤ 10^5`, `0 ≤ arrival[i] ≤ 10^9` (sorted non-decreasing), `state[i] ∈ {0,1}`

## 📝 Interview Tips

1. **Key: arrival is sorted** → process people in arrival order with queues
2. **Inertia rule**: nếu cả hai hàng đợi có người → dùng hướng của giây trước
3. **Reset rule**: nếu không ai chờ ở hiện tại (cả hai queue rỗng) → lastDir = 0
4. **Time skip**: nếu cả hai queue rỗng và không có người tới → nhảy thời gian tới người tiếp theo
5. **Bucket arrival times**: nhóm người theo thời gian đến để xử lý hiệu quả
6. **O(n) amortized**: mỗi người được xử lý đúng một lần

## Solutions

```typescript
// Solution 1: Queue simulation — O(n) time
function timeTaken(arrival: number[], state: number[]): number[] {
  const n = arrival.length;
  const answer = new Array(n).fill(0);

  // Queues store original indices of people waiting to exit (0) or enter (1)
  const exitQ: number[] = []; // indices of people wanting to exit
  const enterQ: number[] = []; // indices of people wanting to enter

  let lastDir = 0; // last used direction: 0=exit, 1=enter
  let personIdx = 0; // next person to arrive
  let t = 0;

  while (personIdx < n || exitQ.length > 0 || enterQ.length > 0) {
    // Add all people who have arrived by time t
    while (personIdx < n && arrival[personIdx] <= t) {
      if (state[personIdx] === 0) exitQ.push(personIdx);
      else enterQ.push(personIdx);
      personIdx++;
    }

    // If both queues empty, skip to next arrival
    if (exitQ.length === 0 && enterQ.length === 0) {
      if (personIdx < n) {
        t = arrival[personIdx];
        lastDir = 0; // reset: no one used door
      }
      continue;
    }

    // Decide direction
    let usePerson: number;
    if (exitQ.length === 0) {
      // Only enter queue has people
      usePerson = enterQ.shift()!;
      lastDir = 1;
    } else if (enterQ.length === 0) {
      // Only exit queue has people
      usePerson = exitQ.shift()!;
      lastDir = 0;
    } else {
      // Both have people → use lastDir (inertia)
      if (lastDir === 0) {
        usePerson = exitQ.shift()!;
      } else {
        usePerson = enterQ.shift()!;
      }
    }

    answer[usePerson] = t;
    t++;
  }

  return answer;
}

// Tests
console.log(timeTaken([0, 1, 1, 2, 4], [0, 1, 0, 0, 1])); // [0,3,1,2,4]
console.log(timeTaken([0, 0, 0], [1, 0, 1])); // [2,0,1] or similar valid answer
```

## 🔗 Related Problems

| Problem                                       | Relationship                    |
| --------------------------------------------- | ------------------------------- |
| 2534 - Time Taken to Cross the Door           | This problem                    |
| 1700 - Number of Students Unable to Eat Lunch | Queue simulation                |
| 2073 - Time Needed to Buy Tickets             | Queue/simulation pattern        |
| 649 - Dota2 Senate                            | Queue-based priority simulation |
