---
layout: page
title: "Reachable Nodes In Subdivided Graph"
difficulty: Hard
category: Tree & Graph
tags: [Graph, Heap (Priority Queue), Shortest Path, Dijkstra]
leetcode_url: "https://leetcode.com/problems/reachable-nodes-in-subdivided-graph"
---

# Reachable Nodes In Subdivided Graph / Các Node Có Thể Đến Được Trong Đồ Thị Phân Chia

> **Track**: Tree & Graph | **Difficulty**: 🔴 Hard | **Pattern**: Dijkstra's Algorithm
> **Frequency**: 📘 Tier 3 — Gặp ở Google
> **See also**: [Network Delay Time](https://leetcode.com/problems/network-delay-time) | [Path with Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy tưởng tượng bạn đang leo núi có nhiều trạm dừng giữa đường. Mỗi tuyến đường giữa hai thành phố A và B có một số trạm dừng nhỏ ở giữa. Bạn có đúng M bước chân. Câu hỏi: bạn có thể ghé thăm tối đa bao nhiêu điểm (cả thành phố lớn và trạm dừng)? Dùng Dijkstra tìm khoảng cách ngắn nhất từ node 0 đến mọi node lớn. Với mỗi cạnh (u,v,cnt), nếu cả u và v đều đến được, ta có thể đi qua cnt trạm nhỏ; ngược lại ta đi từ phía nào gần hơn.

## Visual (Minh họa trực quan)

```
edges = [[0,1,10],[0,2,1],[1,2,2]], maxMoves=6, n=3

After Dijkstra from 0:
  dist[0]=0, dist[1]=4 (via 0→2→1: 1+1+2=4? No: 0→1 costs 11 steps)
  Actually: 0→2 costs 2 steps (1 intermediate + 1 edge), 0→1 costs 11 steps
  With maxMoves=6: dist = {0:0, 1:∞, 2:2}
  dist[1] via 2: dist[2]+2+1 = 5 ≤ 6 → dist[1] = 5

Reachable big nodes: 0(dist=0≤6), 2(dist=2≤6), 1(dist=5≤6) = 3

For each edge, count reachable intermediate nodes:
  edge(0,1,10): from 0: min(6-0,10)=6; from 1: min(6-5,10)=1; total=min(6+1,10)=7→but only 10 nodes, take min=7
  edge(0,2,1):  from 0: min(6-0,1)=1; from 2: min(6-2,1)=1; total=min(2,1)=1
  edge(1,2,2):  from 1: min(6-5,2)=1; from 2: min(6-2,2)=2; total=min(3,2)=2

Total = 3 + 7 + 1 + 2 = 13 ✓
```

## Problem (Bài toán)

Given an undirected graph of `n` nodes (0-indexed). Each edge `[u, v, cnt]` has `cnt` new nodes inserted between `u` and `v`. Starting at node 0 with `maxMoves` steps, return the **maximum number of nodes** (original + subdivided) you can reach.

**Example 1:** `edges=[[0,1,10],[0,2,1],[1,2,2]], maxMoves=6, n=3` → `13`
**Example 2:** `edges=[[0,1,4],[1,2,6],[0,2,8],[1,3,1]], maxMoves=10, n=4` → `23`
**Example 3:** `edges=[[1,2,4],[1,4,5],[1,3,1],[2,3,4],[3,4,5]], maxMoves=17, n=5` → `1`

**Constraints:** `0 ≤ edges.length ≤ min(n*(n-1)/2, 10⁴)`, `0 ≤ cnt ≤ 10⁴`, `1 ≤ maxMoves ≤ 10⁹`, `1 ≤ n ≤ 300`

## Tips (Mẹo phỏng vấn)

- **Dijkstra on original nodes** / Dijkstra trên node gốc: Chạy Dijkstra chỉ trên n node gốc — khoảng cách thực tế qua cạnh (u,v,cnt) là cnt+1 bước
- **Count intermediate nodes per edge** / Đếm node trung gian mỗi cạnh: Với cạnh (u,v,cnt): có thể đi `max(0, maxMoves - dist[u])` từ u, `max(0, maxMoves - dist[v])` từ v; tổng bị chặn bởi cnt
- **Reachable original nodes** / Node gốc đến được: Đếm các node `i` có `dist[i] ≤ maxMoves`
- **Edge traversal from both ends** / Duyệt cạnh từ 2 đầu: `nodesFromU + nodesFromV ≤ cnt` — phải lấy min để không đếm trùng
- **Priority queue min-heap** / Hàng đợi min-heap: Dijkstra cần min-heap — JS không có built-in, implement bằng mảng sắp xếp hoặc binary heap
- **Infinity initialization** / Khởi tạo vô cực: `dist = Array(n).fill(Infinity)` — chỉ node 0 có dist=0

## Solution 1 - Dijkstra + Count Intermediates

```typescript
/**
 * @complexity Time: O((n+e) log n) | Space: O(n+e)
 * Dijkstra from node 0; count reachable original+intermediate nodes
 */
function reachableNodes(edges: number[][], maxMoves: number, n: number): number {
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, cnt] of edges) {
    adj[u].push([v, cnt + 1]); // cost = cnt subdivided + 1 to reach v
    adj[v].push([u, cnt + 1]);
  }

  // Dijkstra (simple O(n²) since n≤300)
  const dist = new Array(n).fill(Infinity);
  dist[0] = 0;
  const visited = new Uint8Array(n);

  for (let iter = 0; iter < n; iter++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!visited[i] && (u === -1 || dist[i] < dist[u])) u = i;
    if (u === -1 || dist[u] === Infinity) break;
    visited[u] = 1;
    for (const [v, w] of adj[u]) if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  }

  let total = 0;
  // Count reachable original nodes
  for (let i = 0; i < n; i++) if (dist[i] <= maxMoves) total++;

  // Count reachable intermediate nodes on each edge
  for (const [u, v, cnt] of edges) {
    const fromU = dist[u] <= maxMoves ? maxMoves - dist[u] : 0;
    const fromV = dist[v] <= maxMoves ? maxMoves - dist[v] : 0;
    total += Math.min(cnt, fromU + fromV);
  }

  return total;
}
```

## Solution 2 - Dijkstra with Min-Heap (Better for dense graphs)

```typescript
/**
 * @complexity Time: O((n+e) log(n+e)) | Space: O(n+e)
 * Priority queue Dijkstra for better performance with many edges
 */
function reachableNodesHeap(edges: number[][], maxMoves: number, n: number): number {
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, cnt] of edges) {
    adj[u].push([v, cnt + 1]);
    adj[v].push([u, cnt + 1]);
  }

  const dist = new Array(n).fill(Infinity);
  dist[0] = 0;
  // [dist, node] — simulate min-heap with sorted array push
  const pq: [number, number][] = [[0, 0]];

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }

  let total = 0;
  for (let i = 0; i < n; i++) if (dist[i] <= maxMoves) total++;
  for (const [u, v, cnt] of edges) {
    const fromU = dist[u] <= maxMoves ? maxMoves - dist[u] : 0;
    const fromV = dist[v] <= maxMoves ? maxMoves - dist[v] : 0;
    total += Math.min(cnt, fromU + fromV);
  }
  return total;
}
```

## Test Cases

```typescript
console.log(
  reachableNodes(
    [
      [0, 1, 10],
      [0, 2, 1],
      [1, 2, 2],
    ],
    6,
    3,
  ),
); // → 13
console.log(
  reachableNodesHeap(
    [
      [0, 1, 10],
      [0, 2, 1],
      [1, 2, 2],
    ],
    6,
    3,
  ),
); // → 13
```

## Related Problems

| Problem                         | Difficulty | Link                                                                    |
| ------------------------------- | ---------- | ----------------------------------------------------------------------- |
| Network Delay Time              | Medium     | [LC 743](https://leetcode.com/problems/network-delay-time)              |
| Path with Maximum Probability   | Medium     | [LC 1514](https://leetcode.com/problems/path-with-maximum-probability)  |
| Cheapest Flights Within K Stops | Medium     | [LC 787](https://leetcode.com/problems/cheapest-flights-within-k-stops) |
