---
layout: page
title: "Cheapest Flights Within K Stops"
difficulty: Medium
category: Tree-Graph
tags: [Dynamic Programming, Depth-First Search, Breadth-First Search, Graph, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/cheapest-flights-within-k-stops"
---

# Cheapest Flights Within K Stops / Chuyến Bay Rẻ Nhất Trong K Điểm Dừng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bellman-Ford / Modified BFS

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như bạn đặt vé máy bay giá rẻ — bạn có thể bay thẳng nhưng đắt, hoặc quá cảnh qua K sân bay trung gian để rẻ hơn. Bellman-Ford thư giãn các cạnh theo từng "vòng" (mỗi vòng = thêm 1 điểm dừng), đảm bảo sau K+1 vòng ta có giá tốt nhất với tối đa K điểm dừng.

**Pattern Recognition:**

- Signal: "shortest path with constraint on hops/stops" → **Bellman-Ford with K iterations**
- Dijkstra thông thường không xử lý được ràng buộc số bước — cần track (cost, stops)
- Key insight: dp[k][v] = min cost to reach v using at most k edges; roll array to save space

**Visual — Bellman-Ford relaxation:**

```
n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1

Initial:  dist = [0, INF, INF, INF]  (cost from src=0)

Round 1 (k=0 stops, 1 edge):
  0→1: dist[1] = min(INF, 0+100) = 100
  1→3: dist[3] = min(INF, INF+600) = INF  (prev dist[1]=INF, use prev round)
  After: dist = [0, 100, INF, INF]

Round 2 (k=1 stop, 2 edges):
  1→2: dist[2] = min(INF, 100+100) = 200
  1→3: dist[3] = min(INF, 100+600) = 700
  After: dist = [0, 100, 200, 700]

Answer: dist[3] = 700  ✓
```

---

## Problem Description

There are `n` cities connected by flights. Given an array `flights[i] = [from, to, price]`, find the **cheapest price** from `src` to `dst` with **at most `k` stops**. Return `-1` if no such route exists.

**Example 1:**

- Input: `n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1` → Output: `700`

**Example 2:**

- Input: `n=3, flights=[[0,1,100],[1,2,100],[0,2,500]], src=0, dst=2, k=1` → Output: `200`

**Constraints:**

- `1 <= n <= 100`, `0 <= flights.length <= (n*(n-1)/2)`
- `1 <= k < n`, `src != dst`

---

## 📝 Interview Tips

1. **Clarify**: "K stops nghĩa là K+1 edges" / K stops means K+1 edges in path — confirm this
2. **Brute force**: "DFS/BFS tracking (node, stops_left) — exponential without memoization" / DFS state space is too large without DP
3. **Bellman-Ford**: "Chạy K+1 lần relaxation; dùng bản sao dist để tránh carry-over trong cùng vòng" / Run K+1 rounds; copy prev dist to avoid same-round updates
4. **Dijkstra**: "Có thể dùng modified Dijkstra với state (cost, node, stops) trong heap" / Modified Dijkstra with state (cost, node, stops) also works
5. **Edge cases**: "src == dst, không có flight nào, đảo ngược edges" / src equals dst, no flights at all, disconnected graph
6. **Complexity**: "Bellman-Ford: O(K×E), Dijkstra: O(E log(E×K))" / Bellman-Ford O(K·E) vs Dijkstra O(E·log(E·K))

---

## Solutions

```typescript
/**
 * Solution 1: Bellman-Ford (K+1 relaxation rounds)
 * Time: O((K+1) × E) where E = number of flights
 * Space: O(n) for distance array
 *
 * Key: use a COPY of prev round's distances to avoid
 * using edges added in the same round (would allow >K stops).
 */
function findCheapestPrice(
  n: number,
  flights: number[][],
  src: number,
  dst: number,
  k: number,
): number {
  const INF = Infinity;
  let dist = new Array(n).fill(INF);
  dist[src] = 0;

  for (let i = 0; i <= k; i++) {
    const prev = [...dist]; // snapshot of current distances
    for (const [from, to, price] of flights) {
      if (prev[from] < INF) {
        dist[to] = Math.min(dist[to], prev[from] + price);
      }
    }
  }
  return dist[dst] === INF ? -1 : dist[dst];
}

/**
 * Solution 2: Modified Dijkstra with stop constraint
 * Time: O(E × log(E × K)) — heap-based
 * Space: O(n × K) for best-cost-per-(node, stops) tracking
 *
 * State: [cost, node, stopsUsed]
 * Prune: skip if stopsUsed > k, or if we've found cheaper at same stops
 */
function findCheapestPriceDijkstra(
  n: number,
  flights: number[][],
  src: number,
  dst: number,
  k: number,
): number {
  // Build adjacency list
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [from, to, price] of flights) adj[from].push([to, price]);

  // Min-heap: [cost, node, stopsUsed]
  const heap: [number, number, number][] = [[0, src, 0]];
  // best[node][stops] = min cost to reach node using exactly `stops` stops
  const best = Array.from({ length: n }, () => new Array(k + 2).fill(Infinity));
  best[src][0] = 0;

  // Simple array-based min-heap extraction
  while (heap.length > 0) {
    heap.sort((a, b) => a[0] - b[0]);
    const [cost, node, stops] = heap.shift()!;
    if (node === dst) return cost;
    if (stops > k) continue;
    for (const [next, price] of adj[node]) {
      const newCost = cost + price;
      if (newCost < best[next][stops + 1]) {
        best[next][stops + 1] = newCost;
        heap.push([newCost, next, stops + 1]);
      }
    }
  }
  return -1;
}

// === Test Cases ===
console.log(
  findCheapestPrice(
    4,
    [
      [0, 1, 100],
      [1, 2, 100],
      [2, 0, 100],
      [1, 3, 600],
      [2, 3, 200],
    ],
    0,
    3,
    1,
  ),
); // 700
console.log(
  findCheapestPrice(
    3,
    [
      [0, 1, 100],
      [1, 2, 100],
      [0, 2, 500],
    ],
    0,
    2,
    1,
  ),
); // 200
console.log(
  findCheapestPrice(
    3,
    [
      [0, 1, 100],
      [1, 2, 100],
      [0, 2, 500],
    ],
    0,
    2,
    0,
  ),
); // 500
console.log(
  findCheapestPriceDijkstra(
    4,
    [
      [0, 1, 100],
      [1, 2, 100],
      [2, 0, 100],
      [1, 3, 600],
      [2, 3, 200],
    ],
    0,
    3,
    1,
  ),
); // 700
```

---

## 🔗 Related Problems

| Problem                                                                                                              | Pattern                 | Difficulty |
| -------------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------- |
| [Network Delay Time](https://leetcode.com/problems/network-delay-time)                                               | Dijkstra / Bellman-Ford | Medium     |
| [Path with Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort)                                   | Modified Dijkstra       | Medium     |
| [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water)                                           | Binary Search + BFS     | Hard       |
| [Minimum Cost to Reach Destination in Time](https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time) | DP + Graph              | Hard       |
| [Find Edges in Shortest Paths](https://leetcode.com/problems/find-edges-in-shortest-paths)                           | Dijkstra                | Hard       |
