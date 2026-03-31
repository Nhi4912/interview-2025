---
layout: page
title: "Design Graph With Shortest Path Calculator"
difficulty: Hard
category: Tree-Graph
tags: [Graph, Design, Heap (Priority Queue), Shortest Path]
leetcode_url: "https://leetcode.com/problems/design-graph-with-shortest-path-calculator"
---

# Design Graph With Shortest Path Calculator / Thiết Kế Đồ Thị Tính Đường Đi Ngắn Nhất

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dijkstra per Query

## 🧠 Intuition

**VI**: Đây là bài thiết kế đồ thị có trọng số có hướng với khả năng thêm cạnh động. Vì không có cách nào tốt hơn để handle "dynamic graph + shortest path" mà không precompute lại, ta dùng Dijkstra mỗi lần query. Adjacency list lưu cạnh, MinHeap (ưu tiên khoảng cách nhỏ) để Dijkstra chuẩn.

**EN**: Dynamic directed weighted graph — can add edges at any time. No precomputation can stay valid after `addEdge`. Run Dijkstra from scratch on each `shortestPath` query. Use adjacency list + min-heap (simulated with sorted array in interview).

```
Graph: n=4, edges=[[0,2,5],[0,1,2],[1,2,1],[3,0,3]]
Query shortestPath(3,2):
  Dijkstra from 3: dist[3]=0 → via 0: dist[0]=3
                   via 0→1: dist[1]=5, via 0→2: dist[2]=8
                   via 1→2: dist[2]=min(8,5+1)=6 ✓
addEdge([1,3,4]) → shortestPath(0,3): 0→1→3 = 2+4=6
```

## 📝 Interview Tips

- 🇻🇳 Dijkstra mỗi query là O((V+E) log V) — với n≤100 và query≤100 là hoàn toàn OK.
- 🇬🇧 Per-query Dijkstra is O((V+E) log V) — with n≤100 this is fast enough.
- 🇻🇳 Dùng adjacency list (Map hoặc array of arrays) để thêm cạnh O(1).
- 🇬🇧 Adjacency list for O(1) edge insertion; Dijkstra reads it per query.
- 🇻🇳 Handle trường hợp không có đường đi: trả về -1 nếu `dist[dst] === Infinity`.
- 🇬🇧 Return -1 if `dist[dst]` remains Infinity after Dijkstra finishes.

## Solutions

```typescript
// ─── Solution 1: Adjacency list + Dijkstra per query ───
// Constructor: O(E)  addEdge: O(1)  shortestPath: O((V+E) log V)
class Graph {
  private adj: Map<number, [number, number][]>; // src → [[dst, cost], ...]
  private n: number;

  constructor(n: number, edges: number[][]) {
    this.n = n;
    this.adj = new Map();
    for (let i = 0; i < n; i++) this.adj.set(i, []);
    for (const [src, dst, cost] of edges) {
      this.adj.get(src)!.push([dst, cost]);
    }
  }

  addEdge(edge: number[]): void {
    const [src, dst, cost] = edge;
    if (!this.adj.has(src)) this.adj.set(src, []);
    this.adj.get(src)!.push([dst, cost]);
  }

  shortestPath(node1: number, node2: number): number {
    const dist = new Array(this.n).fill(Infinity);
    dist[node1] = 0;

    // Min-heap: [distance, node] — simulated with sorted array for interview clarity
    // In production use a proper binary heap
    const pq: [number, number][] = [[0, node1]];

    while (pq.length) {
      // Extract minimum
      let minIdx = 0;
      for (let i = 1; i < pq.length; i++) {
        if (pq[i][0] < pq[minIdx][0]) minIdx = i;
      }
      const [d, u] = pq[minIdx];
      pq.splice(minIdx, 1);

      if (d > dist[u]) continue; // stale entry
      if (u === node2) return d;

      for (const [v, w] of this.adj.get(u) ?? []) {
        if (dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          pq.push([dist[v], v]);
        }
      }
    }

    return dist[node2] === Infinity ? -1 : dist[node2];
  }
}

// ─── Solution 2: Same but with proper binary min-heap ───
class MinHeap {
  private data: [number, number][] = [];
  push(item: [number, number]): void {
    this.data.push(item);
    this._bubbleUp(this.data.length - 1);
  }
  pop(): [number, number] | undefined {
    if (!this.data.length) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length) {
      this.data[0] = last;
      this._sinkDown(0);
    }
    return top;
  }
  get size() {
    return this.data.length;
  }
  private _bubbleUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[p][0] <= this.data[i][0]) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }
  private _sinkDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let min = i,
        l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this.data[l][0] < this.data[min][0]) min = l;
      if (r < n && this.data[r][0] < this.data[min][0]) min = r;
      if (min === i) break;
      [this.data[min], this.data[i]] = [this.data[i], this.data[min]];
      i = min;
    }
  }
}

class GraphOptimal {
  private adj: [number, number][][];
  constructor(n: number, edges: number[][]) {
    this.adj = Array.from({ length: n }, () => []);
    for (const [s, d, c] of edges) this.adj[s].push([d, c]);
  }
  addEdge(edge: number[]): void {
    this.adj[edge[0]].push([edge[1], edge[2]]);
  }
  shortestPath(node1: number, node2: number): number {
    const dist = new Array(this.adj.length).fill(Infinity);
    dist[node1] = 0;
    const heap = new MinHeap();
    heap.push([0, node1]);
    while (heap.size) {
      const [d, u] = heap.pop()!;
      if (d > dist[u]) continue;
      if (u === node2) return d;
      for (const [v, w] of this.adj[u]) {
        if (dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          heap.push([dist[v], v]);
        }
      }
    }
    return dist[node2] === Infinity ? -1 : dist[node2];
  }
}

// Tests
const g = new Graph(4, [
  [0, 2, 5],
  [0, 1, 2],
  [1, 2, 1],
  [3, 0, 3],
]);
console.log(g.shortestPath(3, 2)); // 6
console.log(g.shortestPath(0, 3)); // -1
g.addEdge([1, 3, 4]);
console.log(g.shortestPath(0, 3)); // 6

const g2 = new GraphOptimal(4, [
  [0, 2, 5],
  [0, 1, 2],
  [1, 2, 1],
  [3, 0, 3],
]);
console.log(g2.shortestPath(3, 2)); // 6
g2.addEdge([1, 3, 4]);
console.log(g2.shortestPath(0, 3)); // 6
```

## 🔗 Related Problems

| #    | Title                           | Difficulty | Pattern                 |
| ---- | ------------------------------- | ---------- | ----------------------- |
| 743  | Network Delay Time              | 🟡 Medium  | Dijkstra                |
| 787  | Cheapest Flights Within K Stops | 🟡 Medium  | Bellman-Ford / Dijkstra |
| 1514 | Path with Maximum Probability   | 🟡 Medium  | Dijkstra                |
| 1631 | Path With Minimum Effort        | 🟡 Medium  | Dijkstra                |
