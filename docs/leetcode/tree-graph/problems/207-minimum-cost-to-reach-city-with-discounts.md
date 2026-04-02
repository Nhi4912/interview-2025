---
layout: page
title: "Minimum Cost to Reach City With Discounts"
difficulty: Medium
category: Tree-Graph
tags: [Graph, Heap (Priority Queue), Shortest Path]
leetcode_url: "https://leetcode.com/problems/minimum-cost-to-reach-city-with-discounts"
---

# minimum cost to reach city with discounts

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Vietnamese analogy:** Đi từ thành phố 0 đến thành phố n-1 có tối đa `discounts` lần giảm 50% chi phí đường. Dùng Dijkstra nhưng mở rộng state: `(city, discountsUsed)` để theo dõi số lần đã giảm giá.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
State: (cost, city, discountsLeft)
At each edge with weight w:
  Option 1: pay w      → (cost+w,   next, d)
  Option 2: pay w/2    → (cost+w/2, next, d-1)  if d > 0

Dijkstra on this 2D state space.
```

---

---

## Problem Description

Given `n` cities, `highways[i] = [city1, city2, toll]` (undirected), and `discounts` (number of half-price uses allowed), find minimum cost to travel from city `0` to city `n-1`. Return `-1` if impossible.

**Constraints:**

- `2 <= n <= 1000`
- `1 <= highways.length <= 1000`
- `0 <= discounts <= 500`

---

---

## 📝 Interview Tips

- 🔑 **Dijkstra with state** `(city, discountsUsed)` — classic "layered graph" pattern
- 🔑 State space: `n × (discounts+1)` — each city can be visited with 0..discounts used
- 🔑 For each edge, try both paying full and paying half (if discounts remain)
- ⚠️ Half price = `Math.floor(toll / 2)` (integer division)
- ⚠️ Don't just track best distance per city — must track per `(city, discountsUsed)` pair
- 💡 This is the same pattern as "cheapest flights within K stops" — 2D DP/Dijkstra

---

---

## Solutions

```typescript
function minimumCost(n: number, highways: number[][], discounts: number): number {
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of highways) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  }

  // dist[city][discountsUsed] = minimum cost
  const INF = Infinity;
  const dist: number[][] = Array.from({ length: n }, () => new Array(discounts + 1).fill(INF));
  dist[0][0] = 0;

  // Min-heap: [cost, city, discountsUsed]
  const heap: [number, number, number][] = [[0, 0, 0]];

  function heapPush(item: [number, number, number]) {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (heap[p][0] <= heap[i][0]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  }

  function heapPop(): [number, number, number] {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let smallest = i;
        const l = 2 * i + 1,
          r = 2 * i + 2;
        if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l;
        if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r;
        if (smallest === i) break;
        [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
        i = smallest;
      }
    }
    return top;
  }

  while (heap.length > 0) {
    const [cost, city, used] = heapPop();
    if (cost > dist[city][used]) continue;
    if (city === n - 1) return cost;

    for (const [next, toll] of adj[city]) {
      // Option 1: no discount
      const newCost1 = cost + toll;
      if (newCost1 < dist[next][used]) {
        dist[next][used] = newCost1;
        heapPush([newCost1, next, used]);
      }
      // Option 2: use discount
      if (used < discounts) {
        const newCost2 = cost + Math.floor(toll / 2);
        if (newCost2 < dist[next][used + 1]) {
          dist[next][used + 1] = newCost2;
          heapPush([newCost2, next, used + 1]);
        }
      }
    }
  }

  return Math.min(...dist[n - 1]) === INF ? -1 : Math.min(...dist[n - 1]);
}

function minimumCostDP(n: number, highways: number[][], discounts: number): number {
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of highways) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  }

  // dp[d][city] = min cost reaching city using exactly d discounts
  const INF = Infinity;
  const dp: number[][] = Array.from({ length: discounts + 1 }, () => new Array(n).fill(INF));
  dp[0][0] = 0;

  // Run Dijkstra across all layers
  const pq: [number, number, number][] = [[0, 0, 0]]; // [cost, node, discountsUsed]
  pq.sort((a, b) => a[0] - b[0]);

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [cost, u, d] = pq.shift()!;
    if (cost > dp[d][u]) continue;

    for (const [v, w] of adj[u]) {
      if (cost + w < dp[d][v]) {
        dp[d][v] = cost + w;
        pq.push([dp[d][v], v, d]);
      }
      if (d < discounts && cost + Math.floor(w / 2) < dp[d + 1][v]) {
        dp[d + 1][v] = cost + Math.floor(w / 2);
        pq.push([dp[d + 1][v], v, d + 1]);
      }
    }
  }

  let ans = INF;
  for (let d = 0; d <= discounts; d++) ans = Math.min(ans, dp[d][n - 1]);
  return ans === INF ? -1 : ans;
}
```

---

## 🔗 Related Problems

| #    | Problem                                   | Difficulty | Tags         |
| ---- | ----------------------------------------- | ---------- | ------------ |
| 787  | Cheapest Flights Within K Stops           | 🟡 Medium  | DP, Dijkstra |
| 743  | Network Delay Time                        | 🟡 Medium  | Dijkstra     |
| 1928 | Minimum Cost to Reach Destination in Time | 🔴 Hard    | DP, Graph    |
| 1976 | Number of Ways to Arrive at Destination   | 🟡 Medium  | Dijkstra, DP |
