---
layout: page
title: "Find the City With the Smallest Number of Neighbors at a Threshold Distance"
difficulty: Medium
category: Tree-Graph
tags: [Dynamic Programming, Graph, Shortest Path]
leetcode_url: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance"
---

# find the city with the smallest number of neighbors at a threshold distance

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Vietnamese analogy:** Với ngưỡng khoảng cách `d`, đếm mỗi thành phố có thể đến bao nhiêu thành phố khác. Thành phố nào đến được ít nhất (tức biệt lập hơn), với index lớn nhất nếu hòa — đó là kết quả.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
n=4, edges=[[0,1,3],[1,2,1],[1,3,4],[2,3,1]], dist=4

Shortest paths (Floyd-Warshall):
     0   1   2   3
0  [ 0,  3,  4,  5]
1  [ 3,  0,  1,  2]
2  [ 4,  1,  0,  1]
3  [ 5,  2,  1,  0]

Neighbors within dist=4:
  City 0: {1,2} → 2 neighbors
  City 1: {0,2,3} → 3 neighbors
  City 2: {0,1,3} → 3 neighbors
  City 3: {1,2} → 2 neighbors

Min = 2, largest index = city 3 → answer = 3
```

---

---

## Problem Description

Given `n` cities and `edges[i] = [from, to, weight]`, find the city with the **fewest** number of cities reachable within distance `distanceThreshold`. Return the city with the largest index if tied.

**Constraints:**

- `2 <= n <= 100`
- `1 <= edges.length <= n*(n-1)/2`
- `1 <= distanceThreshold <= 10^4`

---

---

## 📝 Interview Tips

- 🔑 **Floyd-Warshall** is perfect here: O(n³), compute all-pairs shortest paths
- 🔑 Initialize `dist[i][i] = 0`, `dist[i][j] = weight` for edges, `Infinity` otherwise
- 🔑 After Floyd-Warshall, count neighbors within threshold for each city
- ⚠️ Return city with **fewest** neighbors; if tied, return **largest index**
- ⚠️ Iterate cities from high to low index to naturally get largest index on tie
- 💡 Dijkstra from each city also works: O(n·(E log V))

---

---

## Solutions

```typescript
function findTheCity(n: number, edges: number[][], distanceThreshold: number): number {
  const INF = Infinity;
  const dist: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : INF)),
  );

  // Initialize with direct edges
  for (const [u, v, w] of edges) {
    dist[u][v] = w;
    dist[v][u] = w;
  }

  // Floyd-Warshall
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== INF && dist[k][j] !== INF) {
          dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
        }
      }
    }
  }

  let bestCity = -1,
    minNeighbors = Infinity;

  for (let i = 0; i < n; i++) {
    let neighbors = 0;
    for (let j = 0; j < n; j++) {
      if (i !== j && dist[i][j] <= distanceThreshold) neighbors++;
    }
    // Use <= to prefer larger index on tie
    if (neighbors <= minNeighbors) {
      minNeighbors = neighbors;
      bestCity = i;
    }
  }

  return bestCity;
}

function findTheCityDijkstra(n: number, edges: number[][], distanceThreshold: number): number {
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  }

  function dijkstra(src: number): number {
    const d = new Array(n).fill(Infinity);
    d[src] = 0;
    // Simple priority queue using sorted array (n<=100 so OK)
    const pq: [number, number][] = [[0, src]]; // [dist, node]

    while (pq.length > 0) {
      pq.sort((a, b) => a[0] - b[0]);
      const [cost, u] = pq.shift()!;
      if (cost > d[u]) continue;
      for (const [v, w] of adj[u]) {
        if (d[u] + w < d[v]) {
          d[v] = d[u] + w;
          pq.push([d[v], v]);
        }
      }
    }

    let count = 0;
    for (let i = 0; i < n; i++) {
      if (i !== src && d[i] <= distanceThreshold) count++;
    }
    return count;
  }

  let bestCity = -1,
    minNeighbors = Infinity;
  for (let i = 0; i < n; i++) {
    const neighbors = dijkstra(i);
    if (neighbors <= minNeighbors) {
      minNeighbors = neighbors;
      bestCity = i;
    }
  }

  return bestCity;
}
```

---

## 🔗 Related Problems

| #    | Problem                                 | Difficulty | Tags          |
| ---- | --------------------------------------- | ---------- | ------------- |
| 743  | Network Delay Time                      | 🟡 Medium  | Dijkstra      |
| 787  | Cheapest Flights Within K Stops         | 🟡 Medium  | DP, Dijkstra  |
| 1631 | Path With Minimum Effort                | 🟡 Medium  | Dijkstra, BFS |
| 1976 | Number of Ways to Arrive at Destination | 🟡 Medium  | Dijkstra, DP  |
