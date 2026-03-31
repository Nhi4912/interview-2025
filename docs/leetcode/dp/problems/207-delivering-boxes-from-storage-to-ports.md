---
layout: page
title: "Delivering Boxes from Storage to Ports"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Segment Tree, Queue, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/delivering-boxes-from-storage-to-ports"
---

## 🚢 1687. Delivering Boxes from Storage to Ports / Giao Hộp Từ Kho Đến Cảng

**Difficulty:** 🔴 Hard

---

## 🧠 Intuition

**Analogy (Vietnamese):** Bạn có một chiếc tàu chở hàng với giới hạn số hộp (`maxBoxes`) và tải trọng (`maxWeight`). Mỗi chuyến, tàu lấy một đoạn liên tiếp `boxes[i..j]` từ kho, đến các cảng theo thứ tự, rồi quay về. Chi phí = số lần đổi cảng + 2 (đi + về). Tìm số chuyến tàu tối thiểu để giao tất cả hộp.

```
boxes=[[1,1],[2,1],[1,1]], maxBoxes=3, maxWeight=3
Trip 1: boxes[0..1] → ports 1,2 (change once) → cost = 1+2=3 trips? No, 3 legs
Trip 2: boxes[2]   → port 1                   → cost = 0+2=2 legs
Total = 5

dp[i] = min trips to deliver boxes[1..i]
dp[0] = 0
For window [j+1..i] fitting in tàu:
  cost = 2 + portChanges(j+1..i)
  dp[i] = min(dp[j] + cost)
Use monotone deque to maintain min dp[j] - portChanges_prefix[j]
```

**Key insight:** DP with sliding window. `dp[i]` = min trips for first i boxes. For valid window `[lo..i]`, `cost = dp[lo-1] + 2 + portChanges(lo..i)`. Maintain deque of optimal starting points.

---

## 📋 Problem Description

Given `boxes[i] = [port, weight]`, `maxBoxes`, `maxWeight`. Each trip: load consecutive boxes with total ≤ maxBoxes, total weight ≤ maxWeight. Trip cost = #port-changes in load + 2. Minimize total trip cost.

- Example: `boxes=[[1,1],[2,1],[1,1]], maxBoxes=3, maxWeight=3` → **4**
- Example: `boxes=[[1,2],[3,3],[3,1],[3,1],[2,4]], maxBoxes=3, maxWeight=6` → **6**

---

## 📝 Interview Tips

- 🎯 **DP definition**: `dp[i]` = min trips to deliver boxes[0..i-1] (1-indexed conveniently)
- 🎯 **Transition**: `dp[i] = min over valid j of (dp[j] + 2 + portDiff(j+1..i))` where `portDiff = changes[i] - changes[j]`
- 🎯 **Port changes prefix**: `diff[i]` = number of port changes in boxes[1..i]; `diff[i] = diff[i-1] + (box[i].port != box[i-1].port ? 1 : 0)`
- 🎯 **Monotone deque**: maintains min `dp[j] - diff[j]` over valid window [lo..i] (both count and weight constraints)
- 🎯 **Sliding window**: advance lo when box count or weight exceeds limit
- 🎯 **Complexity**: O(n) amortized with deque

---

## 💡 Solutions

### Solution 1: DP + Monotone Deque (Optimal O(n))

```typescript
function boxDelivering(
  boxes: number[][],
  portsCount: number,
  maxBoxes: number,
  maxWeight: number,
): number {
  const n = boxes.length;

  // diff[i] = number of port changes between box i-1 and box i (1-indexed)
  // diff[0] = 0, diff[1] = 0 (no previous box)
  const diff = new Array(n + 1).fill(0);
  for (let i = 2; i <= n; i++) {
    diff[i] = diff[i - 1] + (boxes[i - 1][0] !== boxes[i - 2][0] ? 1 : 0);
  }

  // dp[i] = min trips to deliver boxes[0..i-1]
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  // Deque stores indices j (of dp) as candidates for min(dp[j] - diff[j])
  // monotone increasing: front has minimum dp[j] - diff[j]
  const dq: number[] = [0]; // start with j=0
  let lo = 1; // left boundary of valid window (1-indexed box)
  let weightSum = 0;

  for (let i = 1; i <= n; i++) {
    // Add box i to current window (1-indexed: boxes[i-1])
    weightSum += boxes[i - 1][1];

    // Shrink window from left if constraints violated
    while (i - lo + 1 > maxBoxes || weightSum > maxWeight) {
      weightSum -= boxes[lo - 1][1];
      lo++;
      // Remove from deque front if it's no longer in window
      while (dq.length > 0 && dq[0] < lo - 1) dq.shift();
    }

    // dp[i] = dp[j] + diff[i] - diff[j] + 2
    //       = (dp[j] - diff[j]) + diff[i] + 2
    if (dq.length > 0) {
      const j = dq[0];
      dp[i] = dp[j] - diff[j] + diff[i] + 2;
    }

    // Maintain deque: add i as candidate (for dp[i])
    // Remove from back while dp[back] - diff[back] >= dp[i] - diff[i]
    while (dq.length > 0) {
      const back = dq[dq.length - 1];
      if (dp[back] - diff[back] >= dp[i] - diff[i]) dq.pop();
      else break;
    }
    dq.push(i);
  }

  return dp[n];
}
```

### Solution 2: DP + Deque with explicit window tracking

```typescript
function boxDeliveringV2(
  boxes: number[][],
  portsCount: number,
  maxBoxes: number,
  maxWeight: number,
): number {
  const n = boxes.length;

  // portChange[i] = 1 if boxes[i].port != boxes[i-1].port, else 0 (for i>0)
  const portChange = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    portChange[i] = boxes[i][0] !== boxes[i - 1][0] ? 1 : 0;
  }

  // prefix port changes: pChange[i] = sum of portChange[0..i-1]
  const pChange = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) pChange[i] = pChange[i - 1] + portChange[i - 1];

  // dp[i] = min trips to deliver first i boxes
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  // Monotone deque of j values, ordered by dp[j] - pChange[j] ascending
  const deque: number[] = [0];
  let left = 0; // deque front pointer
  let windowStart = 1; // lo of valid [windowStart..i] window
  let wt = 0;

  for (let i = 1; i <= n; i++) {
    wt += boxes[i - 1][1];

    // Shrink window
    while (i - windowStart + 1 > maxBoxes || wt > maxWeight) {
      wt -= boxes[windowStart - 1][1];
      windowStart++;
    }
    // Advance deque front past invalid indices
    while (left < deque.length && deque[left] < windowStart - 1) left++;

    if (left < deque.length) {
      const j = deque[left];
      dp[i] = dp[j] - pChange[j] + pChange[i] + 2;
    }

    // Add i to deque (maintain monotone property)
    const val = dp[i] - pChange[i];
    while (
      deque.length > left &&
      dp[deque[deque.length - 1]] - pChange[deque[deque.length - 1]] >= val
    ) {
      deque.pop();
    }
    deque.push(i);
  }

  return dp[n];
}
```

---

## 🔗 Related Problems

| Problem                                                                                                            | Difficulty | Key Technique       |
| ------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------- |
| [1696. Jump Game VI](https://leetcode.com/problems/jump-game-vi/)                                                  | Medium     | DP + Monotone Deque |
| [1425. Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum/)                    | Hard       | DP + Monotone Deque |
| [862. Shortest Subarray with Sum at Least K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/) | Hard       | Monotone Deque      |
| [1235. Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling/)          | Hard       | DP + Binary Search  |
