---
layout: page
title: "Network Delay Time"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Graph, Heap (Priority Queue), Shortest Path]
leetcode_url: "https://leetcode.com/problems/network-delay-time"
---

# Network Delay Time / Thời Gian Trễ Mạng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Shortest Path (Dijkstra)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống tín hiệu wifi lan ra từ router — tín hiệu đi theo đường nhanh nhất đến mỗi thiết bị. Dijkstra luôn xử lý node "gần nhất chưa xử lý" trước (greedy), giống như sóng lan theo tốc độ đường truyền. Kết quả là thời gian node cuối cùng nhận được tín hiệu.

**Pattern Recognition:**

- Weighted directed graph + shortest path from single source → Dijkstra
- Answer = max of all shortest distances (last node to receive signal)
- If any node unreachable → return -1

**Visual:**

```
times = [[2,1,1],[2,3,1],[3,4,1]], n=4, k=2
Graph: 2→1(w=1), 2→3(w=1), 3→4(w=1)

Dijkstra from node 2:
dist = [∞, ∞, 0, ∞, ∞]  (1-indexed)
MinHeap: [(0, 2)]

Pop (0,2): process neighbors 1(dist=1), 3(dist=1)
MinHeap: [(1,1),(1,3)]
dist = [∞, 1, 0, 1, ∞]

Pop (1,1): no outgoing edges
Pop (1,3): process neighbor 4(dist=1+1=2)
dist = [∞, 1, 0, 1, 2]

All nodes reached. Answer = max(1, 0, 1, 2) = 2 ✅
```

## Problem Description

There are `n` network nodes labeled 1 to `n`. Given `times[i] = [ui, vi, wi]` (directed edge from `ui` to `vi` with travel time `wi`), and a starting node `k`, return the minimum time for **all** nodes to receive the signal. Return `-1` if impossible.

**Example 1:** `times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2` → `2`
**Example 2:** `times=[[1,2,1]], n=2, k=1` → `1`
**Example 3:** `times=[[1,2,1]], n=2, k=2` → `-1`

**Constraints:** `1 <= k <= n <= 100`, `1 <= times.length <= 6000`, positive weights.

## 📝 Interview Tips

1. **Clarify**: Graph có directed edges không? Có negative weights không? / Directed graph, no negative weights (use Dijkstra).
2. **Approach**: Dijkstra từ source k, lấy max của tất cả shortest distances / Dijkstra from k, take max dist.
3. **Edge cases**: Node không thể reach → return -1; n=1 → return 0 / Unreachable node or single node.
4. **Optimize**: Min-heap giả lập bằng array sort (n nhỏ ≤100) hoặc Bellman-Ford O(VE) / For small n, even Bellman-Ford works.
5. **Test**: Disconnected graph → -1; star graph from center / Test disconnected components.
6. **Follow-up**: Negative weights? → Bellman-Ford. K stops limit? → Modified Dijkstra / For negative weights use Bellman-Ford.

## Solutions

```typescript
/** Solution 1: Dijkstra with min-heap simulation
 * Time: O((V+E) log V) | Space: O(V+E)
 */
function networkDelayTime(times: number[][], n: number, k: number): number {
  // Build adjacency list (1-indexed)
  const graph = new Map<number, [number, number][]>();
  for (let i = 1; i <= n; i++) graph.set(i, []);
  for (const [u, v, w] of times) {
    graph.get(u)!.push([v, w]);
  }

  // Dijkstra with simple priority queue (sorted array for small n)
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  // [distance, node]
  const pq: [number, number][] = [[0, k]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;
    if (d > dist[u]) continue; // stale entry
    for (const [v, w] of graph.get(u)!) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }

  const maxDist = Math.max(...dist.slice(1));
  return maxDist === Infinity ? -1 : maxDist;
}

/** Solution 2: Bellman-Ford — handles edge cases, simpler code
 * Time: O(V·E) | Space: O(V)
 */
function networkDelayTimeBF(times: number[][], n: number, k: number): number {
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;

  // Relax all edges V-1 times
  for (let i = 0; i < n - 1; i++) {
    let updated = false;
    for (const [u, v, w] of times) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        updated = true;
      }
    }
    if (!updated) break;
  }

  const maxDist = Math.max(...dist.slice(1));
  return maxDist === Infinity ? -1 : maxDist;
}

/** Solution 3: DFS with memoization (works for DAG-like graphs)
 * Time: O(V·E) worst | Space: O(V+E)
 */
function networkDelayTimeDFS(times: number[][], n: number, k: number): number {
  const graph = new Map<number, [number, number][]>();
  for (let i = 1; i <= n; i++) graph.set(i, []);
  for (const [u, v, w] of times) graph.get(u)!.push([v, w]);

  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;

  function dfs(node: number, d: number): void {
    if (d > dist[node]) return;
    for (const [next, w] of graph.get(node)!) {
      if (d + w < dist[next]) {
        dist[next] = d + w;
        dfs(next, d + w);
      }
    }
  }

  dfs(k, 0);
  const maxDist = Math.max(...dist.slice(1));
  return maxDist === Infinity ? -1 : maxDist;
}

// Test cases
console.log(
  networkDelayTime(
    [
      [2, 1, 1],
      [2, 3, 1],
      [3, 4, 1],
    ],
    4,
    2,
  ),
); // 2
console.log(networkDelayTime([[1, 2, 1]], 2, 1)); // 1
console.log(networkDelayTime([[1, 2, 1]], 2, 2)); // -1

console.log(
  networkDelayTimeBF(
    [
      [2, 1, 1],
      [2, 3, 1],
      [3, 4, 1],
    ],
    4,
    2,
  ),
); // 2
console.log(
  networkDelayTimeDFS(
    [
      [2, 1, 1],
      [2, 3, 1],
      [3, 4, 1],
    ],
    4,
    2,
  ),
); // 2
```

## 🔗 Related Problems

| Problem                                                                                                                                                          | Relationship                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops)                                                                 | Dijkstra/Bellman-Ford với K-stops constraint |
| [Path with Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability)                                                                     | Dijkstra với max instead of min              |
| [Find the City With the Smallest Number of Neighbors](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance) | Floyd-Warshall all-pairs shortest path       |
