---
layout: page
title: "Minimum Sideway Jumps"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-sideway-jumps"
---

# Minimum Sideway Jumps / Số Lần Nhảy Ngang Tối Thiểu

---

## 🧠 Intuition / Tư Duy

**Analogy:** > Ếch đi trên đường có 3 làn, gặp chướng ngại vật phải nhảy sang làn khác (tốn 1 lần nhảy ngang).  
> Giống đổi làn trên cao tốc: đổi làn ít nhất để đến đích, tránh các điểm chắn đường.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Sideway Jumps example:**

```
obstacles = [0, 1, 2, 3, 0]  (frog starts lane 2, point 0)

Point:  0   1   2   3   4
Lane 1: .   X   .   .   .
Lane 2: .   .   X   .   .    ← frog starts here
Lane 3: .   .   .   X   .

dp = [Inf, 0, Inf] at point 0 (lane 2 = index 1 = 0 jumps)
After point 1 (obs lane 1): lane 1 blocked → dp=[Inf,0,1] then minimize
After point 2 (obs lane 2): dp=[1,Inf,1]
After point 3 (obs lane 3): dp=[1,2,Inf]
At point 4: min=1, answer=1
```

---

## Problem Description

A frog starts at lane 2, point 0. Road has `n` points (0 to n), 3 lanes.
`obstacles[i]` = blocked lane at point `i` (0 = none).
A **sideway jump** moves to another lane at the same point (+1 jump).
Return the **minimum** number of sideway jumps to reach any lane at point `n`.

**Constraints:** `2 <= obstacles.length <= 5 * 10^5`, `0 <= obstacles[i] <= 3`

---

## 📝 Interview Tips

1. **DP state** — `dp[lane]` = min jumps to reach current point in that lane (1-indexed lanes).
2. **At each point** — block the obstacle lane (set to INF), then propagate min (jumping costs 1).
3. **Propagation** — `dp[l] = min(dp[l], min(dp) + 1)` for unblocked lanes.
4. **Greedy works** — at each step, the frog jumps to minimize cost; no future info needed.
5. **Initialization** — `dp = [1, 0, 1]` (lane 1: 1 jump, lane 2: 0 jumps, lane 3: 1 jump) since frog is at lane 2.
6. **Answer** — `min(dp[0..2])` after processing all points.

---

## Solutions

```typescript
function minSideJumps(obstacles: number[]): number {
  const INF = Infinity;
  // dp[0..2] for lanes 1,2,3 (0-indexed)
  let dp = [1, 0, 1]; // frog starts at lane 2 (index 1)

  for (let i = 1; i < obstacles.length; i++) {
    const obs = obstacles[i];

    // Block the obstacle lane
    if (obs > 0) dp[obs - 1] = INF;

    // Propagate minimum to unblocked lanes (cost 1 to jump)
    const minJumps = Math.min(dp[0], dp[1], dp[2]);
    for (let lane = 0; lane < 3; lane++) {
      if (obs - 1 !== lane && dp[lane] > minJumps) {
        dp[lane] = minJumps + 1;
      }
    }
  }

  return Math.min(dp[0], dp[1], dp[2]);
}

console.log(minSideJumps([0, 1, 2, 3, 0])); // 2
console.log(minSideJumps([0, 1, 1, 3, 3, 0])); // 1
console.log(minSideJumps([0, 2, 1, 0, 3, 0])); // 0
console.log(minSideJumps([0, 0])); // 0 (no obstacles)

function minSideJumpsV2(obstacles: number[]): number {
  // dp[i] = min jumps to be in lane i+1 at current point
  let dp = [1, 0, 1];

  for (let p = 1; p < obstacles.length; p++) {
    const block = obstacles[p] - 1; // 0-indexed blocked lane (-1 if none)

    // Step 1: carry forward (no jump needed if lane not blocked)
    const next = [...dp];
    if (block >= 0) next[block] = Infinity; // can't be in blocked lane

    // Step 2: allow lateral jumps — find min across unblocked and +1
    const minCost = Math.min(...next);
    for (let lane = 0; lane < 3; lane++) {
      if (lane !== block) {
        next[lane] = Math.min(next[lane], minCost + 1);
      }
    }
    // Re-block obstacle (can't jump into it)
    if (block >= 0) next[block] = Infinity;

    dp = next;
  }

  return Math.min(...dp);
}

console.log(minSideJumpsV2([0, 1, 2, 3, 0])); // 2
console.log(minSideJumpsV2([0, 1, 1, 3, 3, 0])); // 1
console.log(minSideJumpsV2([0, 2, 1, 0, 3, 0])); // 0

function minSideJumpsBFS(obstacles: number[]): number {
  // Validate using BFS on state (point, lane)
  const n = obstacles.length - 1;
  // dist[point][lane] = min jumps
  const dist = Array.from({ length: n + 1 }, () => [Infinity, Infinity, Infinity]);
  dist[0][1] = 0; // start: point 0, lane 2 (index 1)
  dist[0][0] = 1; // lateral jump to lane 1
  dist[0][2] = 1; // lateral jump to lane 3

  for (let p = 0; p < n; p++) {
    for (let lane = 0; lane < 3; lane++) {
      if (dist[p][lane] === Infinity) continue;
      const nextP = p + 1;
      const obs = obstacles[nextP] - 1;
      // Move forward
      if (obs !== lane) {
        dist[nextP][lane] = Math.min(dist[nextP][lane], dist[p][lane]);
        // Jump to other lanes
        for (let other = 0; other < 3; other++) {
          if (other !== lane && other !== obs) {
            dist[nextP][other] = Math.min(dist[nextP][other], dist[p][lane] + 1);
          }
        }
      }
    }
  }

  return Math.min(...dist[n]);
}

console.log(minSideJumpsBFS([0, 1, 2, 3, 0])); // 2
console.log(minSideJumpsBFS([0, 1, 1, 3, 3, 0])); // 1
console.log(minSideJumpsBFS([0, 2, 1, 0, 3, 0])); // 0
```

---

## 🔗 Related Problems

| Problem                                                     | Difficulty | Key Concept  |
| ----------------------------------------------------------- | ---------- | ------------ |
| [Jump Game](https://leetcode.com/problems/jump-game/)       | Medium     | Greedy       |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii/) | Medium     | Greedy       |
| [Frog Jump](https://leetcode.com/problems/frog-jump/)       | Hard       | DP on states |
