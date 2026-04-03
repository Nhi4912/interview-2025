---
layout: page
title: "Min Cost to Connect All Points"
difficulty: Medium
category: Tree-Graph
tags: [Array, Union Find, Graph, Minimum Spanning Tree]
leetcode_url: "https://leetcode.com/problems/min-cost-to-connect-all-points"
---

# Min Cost to Connect All Points / Chi Phí Tối Thiểu Để Kết Nối Tất Cả Điểm

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Minimum Spanning Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Connecting Cities With Minimum Cost](https://leetcode.com/problems/connecting-cities-with-minimum-cost) | [Find Critical and Pseudo-Critical Edges in MST](https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như lắp đặt đường dây điện nối tất cả thành phố với chi phí ít nhất — bạn cần N-1 đường dây (edges) nối N thành phố (nodes) sao cho tổng chi phí (Manhattan distance) là nhỏ nhất. Đây chính là bài toán Minimum Spanning Tree.

**Pattern Recognition:**

- Signal: "connect all points" + "minimize total edge weight" → **MST (Kruskal hoặc Prim)**
- Kruskal: sort tất cả edges, thêm edge ngắn nhất không tạo cycle (Union-Find)
- Prim: bắt đầu từ một node, luôn thêm edge rẻ nhất ra node chưa thăm

**Visual — Prim's Algorithm:**

```
Points: (0,0),(2,2),(3,10),(5,2),(7,0)
Start from (0,0):
  Add edge to (2,2): cost=4    inMST={(0,0),(2,2)}
  Add edge to (5,2): cost=3    inMST={...,(5,2)}
  Add edge to (7,0): cost=4    inMST={...,(7,0)}
  Add edge to (3,10): cost=10  inMST={...,(3,10)}
Total = 4+3+4+10 = 20
```

---

## Problem Description

Given an array of `points` where `points[i] = [xi, yi]`, find the minimum cost to connect all points. The cost of connecting two points is their Manhattan distance: `|xi - xj| + |yi - yj|`. ([LeetCode #1584](https://leetcode.com/problems/min-cost-to-connect-all-points))

**Example 1:** `points=[[0,0],[2,2],[3,10],[5,2],[7,0]]` → `20`
**Example 2:** `points=[[3,12],[-2,5],[-4,1]]` → `18`

---

## 📝 Interview Tips

1. **Clarify**: "Graph là complete graph (mọi cặp điểm đều nối được) — O(N²) edges" / Complete graph, N² edges
2. **Kruskal**: "Sort N² edges, dùng Union-Find để tránh cycle → O(N² log N)" / Sort all edges + Union-Find
3. **Prim**: "Min-heap: luôn chọn edge rẻ nhất đến node chưa thăm → O(N² log N) với heap, O(N²) không dùng heap" / Prim with dense graph optimization
4. **Dense graph**: "Khi N nhỏ (≤1000), Prim O(N²) không cần heap thường nhanh hơn trong practice" / For dense graphs Prim without heap is faster
5. **Union-Find**: "Kruskal cần Union-Find với path compression và union by rank" / Union-Find with optimizations
6. **Edge cases**: "Một điểm → cost = 0; hai điểm → một edge" / Single point, two points

---

## Solutions

```typescript
/**
 * Solution 1: Prim's Algorithm (O(N²) — optimal for dense graph)
 * Time: O(N²) — no heap needed for complete graph
 * Space: O(N) — minCost array
 */
function minCostConnectPointsPrim(points: number[][]): number {
  const n = points.length;
  if (n <= 1) return 0;

  const dist = (a: number, b: number) =>
    Math.abs(points[a][0] - points[b][0]) + Math.abs(points[a][1] - points[b][1]);

  const minEdge = new Array(n).fill(Infinity); // min cost to add each node to MST
  const inMST = new Array(n).fill(false);
  minEdge[0] = 0;
  let total = 0;

  for (let iter = 0; iter < n; iter++) {
    // Pick the unvisited node with minimum edge cost
    let u = -1;
    for (let v = 0; v < n; v++) {
      if (!inMST[v] && (u === -1 || minEdge[v] < minEdge[u])) u = v;
    }
    inMST[u] = true;
    total += minEdge[u];

    // Update minEdge for remaining nodes
    for (let v = 0; v < n; v++) {
      if (!inMST[v]) {
        const d = dist(u, v);
        if (d < minEdge[v]) minEdge[v] = d;
      }
    }
  }
  return total;
}

/**
 * Solution 2: Kruskal's Algorithm with Union-Find
 * Time: O(N² log N) — sort N² edges
 * Space: O(N²) — store all edges
 */
function minCostConnectPoints(points: number[][]): number {
  const n = points.length;
  if (n <= 1) return 0;

  // Build all edges
  const edges: [number, number, number][] = []; // [cost, i, j]
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const cost = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
      edges.push([cost, i, j]);
    }
  }
  edges.sort(([a], [b]) => a - b);

  // Union-Find
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);
  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(x: number, y: number): boolean {
    const px = find(x),
      py = find(y);
    if (px === py) return false;
    if (rank[px] < rank[py]) parent[px] = py;
    else if (rank[px] > rank[py]) parent[py] = px;
    else {
      parent[py] = px;
      rank[px]++;
    }
    return true;
  }

  let total = 0,
    edgesUsed = 0;
  for (const [cost, i, j] of edges) {
    if (union(i, j)) {
      total += cost;
      if (++edgesUsed === n - 1) break;
    }
  }
  return total;
}

// === Test Cases ===
console.log(
  minCostConnectPoints([
    [0, 0],
    [2, 2],
    [3, 10],
    [5, 2],
    [7, 0],
  ]),
); // 20
console.log(
  minCostConnectPoints([
    [3, 12],
    [-2, 5],
    [-4, 1],
  ]),
); // 18
console.log(
  minCostConnectPointsPrim([
    [0, 0],
    [2, 2],
    [3, 10],
    [5, 2],
    [7, 0],
  ]),
); // 20
console.log(minCostConnectPoints([[0, 0]])); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                                                          | Difficulty | Pattern      |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------ |
| [Connecting Cities With Minimum Cost](https://leetcode.com/problems/connecting-cities-with-minimum-cost)                                         | 🟡 Medium  | Kruskal/Prim |
| [Network Delay Time](https://leetcode.com/problems/network-delay-time)                                                                           | 🟡 Medium  | Dijkstra     |
| [Redundant Connection](https://leetcode.com/problems/redundant-connection)                                                                       | 🟡 Medium  | Union-Find   |
| [Find Critical and Pseudo-Critical Edges in MST](https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree) | 🔴 Hard    | MST variants |
