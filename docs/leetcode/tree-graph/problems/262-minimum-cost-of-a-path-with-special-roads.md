---
layout: page
title: "Minimum Cost of a Path With Special Roads"
difficulty: Medium
category: Tree-Graph
tags: [Array, Graph, Heap (Priority Queue), Shortest Path]
leetcode_url: "https://leetcode.com/problems/minimum-cost-of-a-path-with-special-roads"
---

# Minimum Cost of a Path With Special Roads / Chi Phí Tối Thiểu Đến Đích Với Các Đường Đặc Biệt

> **Track**: Tree-Graph | **Difficulty**: 🟡 Medium | **Pattern**: Dijkstra — Virtual Node Shortest Path
> **Frequency**: 📘 Tier 3 — Gặp ở Google, Meta
> **See also**: [1976 Number of Ways to Arrive at Destination](https://leetcode.com/problems/number-of-ways-to-arrive-at-destination) | [778 Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn cần di chuyển trên mặt phẳng 2D từ điểm xuất phát đến đích, bình thường phí là khoảng cách Manhattan. Nhưng có một số "cổng dịch chuyển" đặc biệt — bước vào cổng ở (x1,y1), bước ra ở (x2,y2) với chi phí cố định thấp hơn. Như game Mario có ống nước: đi thẳng thì tốn nhiều bước, nhưng chui vào ống có thể nhảy xa hơn với chi phí rẻ hơn. Dijkstra trên tập các "điểm thú vị" (start, target, endpoints của special roads).

**Pattern Recognition:**

- Signal: "2D plane movement, special shortcuts with fixed cost, minimize total cost" → **Dijkstra on key points**
- Bài này thuộc dạng Dijkstra với không gian trạng thái là tọa độ (x, y) liên tục
- Key insight: chỉ có hữu hạn "điểm thú vị" — start, target, và 2 endpoints mỗi special road; từ mọi điểm, chi phí đến bất kỳ điểm nào = |Δx|+|Δy| (Manhattan) hoặc dùng special road nếu rẻ hơn

**Visual — Dijkstra on key points:**

```
start=(0,0), target=(5,5), specialRoads=[[1,1,3,3,1]]

Key points: (0,0), (5,5), (1,1), (3,3)

Distances (Manhattan from each point to others):
  (0,0)→(5,5) = 10  (direct walk)
  (0,0)→(1,1) = 2   (walk to road start)
  (1,1)→(3,3) = 1   (use special road! saves 4-1=3)
  (3,3)→(5,5) = 4   (walk to target)

Path via special road: 2 + 1 + 4 = 7 < 10 ← better!

Dijkstra:
  heap: [(0, 0,0)]
  pop (0, 0,0) → relax all key points
    dist[5,5] = 10
    dist[1,1] = 2; dist[3,3] = 4 (direct)
  pop (2, 1,1) → use special road: dist[3,3] = min(4, 2+1) = 3
  pop (3, 3,3) → dist[5,5] = min(10, 3+4) = 7
  pop (7, 5,5) → reached target! ans = 7
```

---

## Problem Description

You start at `start = [startX, startY]` and want to reach `target = [targetX, targetY]` on an infinite 2D grid. Moving normally costs Manhattan distance. You're also given `specialRoads[i] = [x1,y1,x2,y2,cost]` — you can teleport from (x1,y1) to (x2,y2) paying `cost`. Find the minimum total cost to reach target. ([LeetCode](https://leetcode.com/problems/minimum-cost-of-a-path-with-special-roads))

```
Example 1: start=[1,1], target=[4,5], specialRoads=[[1,2,3,3,2],[3,4,4,5,1]] → 5
Example 2: start=[3,2], target=[5,7], specialRoads=[[0,0,3,2,1],[3,2,5,5,1]] → 7
```

Constraints: 1 ≤ specialRoads.length ≤ 200; coordinates in [0, 10⁵].

---

## 📝 Interview Tips

1. **Only "interesting" points matter: start, target, and all road endpoints** — _Chỉ cần xét các điểm "thú vị": start, target, 2 đầu mỗi đường đặc biệt_
2. **Normal movement between any two points costs Manhattan distance** — _Đi thường giữa bất kỳ hai điểm nào = khoảng cách Manhattan |Δx|+|Δy|_
3. **Use Dijkstra (min-heap) on these key points** — _Dùng Dijkstra với heap trên tập điểm thú vị — không gian nhỏ dù tọa độ lớn_
4. **From any key point, try: walk directly to target OR walk to a road's x1,y1 then use the road** — _Từ mỗi điểm: thử đi thẳng đến đích, hoặc đến đầu vào của road rồi dùng road_
5. **Road benefit: use if cost_road < Manhattan(x1,y1,x2,y2)** — _Chỉ dùng road khi nó thực sự rẻ hơn đi bộ thẳng_
6. **Map key by (x,y) string or use Map<string, number> for dist** — _Lưu dist bằng Map với key là chuỗi tọa độ vì không gian liên tục_

---

## Solutions

```typescript
/** Solution 1: Dijkstra on key points using min-heap simulation
 * @complexity Time: O(k² log k) where k = specialRoads.length | Space: O(k) */
function minimumCost(start: number[], target: number[], specialRoads: number[][]): number {
  const manhattan = (x1: number, y1: number, x2: number, y2: number) =>
    Math.abs(x2 - x1) + Math.abs(y2 - y1);

  const key = (x: number, y: number) => `${x},${y}`;

  // Collect all interesting points
  const points: [number, number][] = [
    [start[0], start[1]],
    [target[0], target[1]],
  ];
  for (const [x1, y1, x2, y2] of specialRoads) {
    points.push([x1, y1], [x2, y2]);
  }

  const dist = new Map<string, number>();
  for (const [x, y] of points) dist.set(key(x, y), Infinity);
  dist.set(key(start[0], start[1]), 0);

  // Min-heap simulation: sorted array (small N allows this)
  const heap: [number, number, number][] = [[0, start[0], start[1]]]; // [cost, x, y]

  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [d, cx, cy] = heap.shift()!;
    const ck = key(cx, cy);
    if (d > (dist.get(ck) ?? Infinity)) continue;

    // Walk directly to target
    const toTarget = d + manhattan(cx, cy, target[0], target[1]);
    if (toTarget < (dist.get(key(target[0], target[1])) ?? Infinity)) {
      dist.set(key(target[0], target[1]), toTarget);
      heap.push([toTarget, target[0], target[1]]);
    }

    // Use each special road
    for (const [x1, y1, x2, y2, cost] of specialRoads) {
      const newDist = d + manhattan(cx, cy, x1, y1) + cost;
      const k2 = key(x2, y2);
      if (newDist < (dist.get(k2) ?? Infinity)) {
        dist.set(k2, newDist);
        heap.push([newDist, x2, y2]);
      }
    }
  }

  return dist.get(key(target[0], target[1]))!;
}

/** Solution 2: Cleaner O(k²) DP — relax until convergence
 * @complexity Time: O(k²) Bellman-Ford style | Space: O(k) */
function minimumCost2(start: number[], target: number[], specialRoads: number[][]): number {
  const m = (x1: number, y1: number, x2: number, y2: number) =>
    Math.abs(x2 - x1) + Math.abs(y2 - y1);

  // dp[i] = min cost to reach x2,y2 of road i
  const n = specialRoads.length;
  const dp: number[] = new Array(n).fill(Infinity);
  let ans = m(start[0], start[1], target[0], target[1]);

  // Multiple relaxation passes (like Bellman-Ford)
  for (let pass = 0; pass < n + 1; pass++) {
    for (let i = 0; i < n; i++) {
      const [x1, y1, x2, y2, cost] = specialRoads[i];
      // Cost to reach x2,y2 via road i from start directly
      let best = m(start[0], start[1], x1, y1) + cost;
      // Or via another road j then this road
      for (let j = 0; j < n; j++) {
        if (j !== i && dp[j] < Infinity) {
          const [, , jx2, jy2] = specialRoads[j];
          best = Math.min(best, dp[j] + m(jx2, jy2, x1, y1) + cost);
        }
      }
      dp[i] = Math.min(dp[i], best);
      ans = Math.min(ans, dp[i] + m(x2, y2, target[0], target[1]));
    }
  }
  return ans;
}

// === Test Cases ===
console.log(
  minimumCost(
    [1, 1],
    [4, 5],
    [
      [1, 2, 3, 3, 2],
      [3, 4, 4, 5, 1],
    ],
  ),
); // 5
console.log(
  minimumCost(
    [3, 2],
    [5, 7],
    [
      [0, 0, 3, 2, 1],
      [3, 2, 5, 5, 1],
    ],
  ),
); // 7
console.log(
  minimumCost2(
    [1, 1],
    [4, 5],
    [
      [1, 2, 3, 3, 2],
      [3, 4, 4, 5, 1],
    ],
  ),
); // 5
```

---

## 🔗 Related Problems

| #    | Problem                                      | Difficulty | Pattern        |
| ---- | -------------------------------------------- | ---------- | -------------- |
| 743  | Network Delay Time                           | Medium     | Dijkstra       |
| 1976 | Number of Ways to Arrive at Destination      | Medium     | Dijkstra       |
| 1514 | Path with Maximum Probability                | Medium     | Dijkstra       |
| 1368 | Minimum Cost to Make at Least One Valid Path | Hard       | Dijkstra + BFS |
