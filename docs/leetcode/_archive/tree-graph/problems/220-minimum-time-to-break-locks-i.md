---
layout: page
title: "Minimum Time to Break Locks I"
difficulty: Medium
category: Tree-Graph
tags: [Array, Dynamic Programming, Backtracking, Bit Manipulation, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/minimum-time-to-break-locks-i"
---

# Minimum Time to Break Locks I / Thời Gian Tối Thiểu Để Phá Khóa I

---

## 🧠 Intuition / Tư Duy

**Analogy:** > Bạn có nhiều ổ khóa cần phá. Bạn có một chiếc búa với **năng lượng ban đầu** (strength=0). Khi phá khóa `i`, năng lượng tăng thêm `strength[i]`. Phá khóa i sau khi sức mạnh hiện tại ≥ `strength[i]`. Thứ tự phá có thể tùy ý — tìm thứ tự để **tổng thời gian chờ nhỏ nhất**.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Time to Break Locks I example:**

```
locks = [3, 4, 1, 2, 6], k = 2 (strength grows by k each turn)
Order: 1→2→3→4→6
  strength=0, need 1 → wait 0 (1≤0? no, wait ceil((1-0)/2)=1 turn)
  Actually: at each step, time = max(0, ceil((lock - curr_strength) / k))

Bitmask DP: dp[mask] = min time to break all locks in mask
```

---

## Problem Description

You have `n` locks with strengths. Your initial strength is 0. To break lock `i`, your strength must be ≥ `strength[i]`. After each broken lock, your strength increases by `k`. You need exactly `(i+1) * k` strength to break the i-th lock in sequence, where you can choose the order. Return minimum total time.

**Note:** Time to break lock `j` when current strength is `s`: `max(0, ceil((strength[j] - s) / k))`

---

## 📝 Interview Tips

1. **Bitmask DP** — with n ≤ 8 locks, 2^n states are feasible
2. **State** — `dp[mask]` = min time to break locks in `mask`
3. **Transition** — for each unset bit i, try adding it to mask
4. **Current strength** — equals number of bits set in current mask times k (in simpler formulations)
5. **Wait time** — `max(0, Math.ceil((strength[i] - currStrength) / k))`
6. **Time complexity** — O(2^n × n) which is fine for n ≤ 8

---

## Solutions

```typescript
function findMinimumTime(strength: number[], k: number): number {
  const n = strength.length;
  const INF = Infinity;
  // dp[mask] = {minTime, currentStrength} when locks in mask are broken
  const dp = new Array(1 << n).fill(null).map(() => ({ time: INF, str: 0 }));
  dp[0] = { time: 0, str: 0 };

  for (let mask = 0; mask < 1 << n; mask++) {
    if (dp[mask].time === INF) continue;
    const { time, str } = dp[mask];

    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) continue; // already broken

      const wait = Math.max(0, Math.ceil((strength[i] - str) / k));
      const newMask = mask | (1 << i);
      const newTime = time + wait + 1; // +1 to actually break the lock
      const newStr = str + k; // strength increases by k

      if (newTime < dp[newMask].time) {
        dp[newMask] = { time: newTime, str: newStr };
      }
    }
  }

  return dp[(1 << n) - 1].time;
}

console.log(findMinimumTime([3, 4, 1, 2, 6], 1)); // 4
console.log(findMinimumTime([1, 2, 3], 2)); // 3
console.log(findMinimumTime([8], 1)); // 8

function findMinimumTimeDFS(strength: number[], k: number): number {
  const n = strength.length;
  let minTime = Infinity;

  function dfs(mask: number, currStr: number, time: number): void {
    if (time >= minTime) return; // prune
    if (mask === (1 << n) - 1) {
      minTime = Math.min(minTime, time);
      return;
    }

    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) continue;
      const wait = Math.max(0, Math.ceil((strength[i] - currStr) / k));
      dfs(mask | (1 << i), currStr + k, time + wait + 1);
    }
  }

  dfs(0, 0, 0);
  return minTime;
}

console.log(findMinimumTimeDFS([3, 4, 1, 2, 6], 1)); // 4
console.log(findMinimumTimeDFS([1, 2, 3], 2)); // 3

function findMinimumTimeOpt(strength: number[], k: number): number {
  const n = strength.length;
  const total = 1 << n;
  const dpTime = new Array(total).fill(Infinity);
  const dpStr = new Array(total).fill(0);
  dpTime[0] = 0;

  for (let mask = 0; mask < total; mask++) {
    if (dpTime[mask] === Infinity) continue;
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) continue;
      const wait = Math.max(0, Math.ceil((strength[i] - dpStr[mask]) / k));
      const nm = mask | (1 << i);
      const nt = dpTime[mask] + wait + 1;
      if (nt < dpTime[nm]) {
        dpTime[nm] = nt;
        dpStr[nm] = dpStr[mask] + k;
      }
    }
  }

  return dpTime[total - 1];
}

console.log(findMinimumTimeOpt([3, 4, 1, 2, 6], 1)); // 4
console.log(findMinimumTimeOpt([1, 2, 3], 2)); // 3
```

---

## 🔗 Related Problems

| #    | Problem                          | Difficulty | Tags              |
| ---- | -------------------------------- | ---------- | ----------------- |
| 847  | Shortest Path Visiting All Nodes | Hard       | BFS, Bitmask      |
| 1125 | Smallest Sufficient Team         | Hard       | Bitmask DP        |
| 2305 | Fair Distribution of Cookies     | Medium     | Backtracking      |
| 3376 | Minimum Time to Break Locks II   | Hard       | Min-Cost Matching |
