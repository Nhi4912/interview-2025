---
layout: page
title: "Path with Maximum Probability"
difficulty: Medium
category: Tree-Graph
tags: [Array, Graph, Heap (Priority Queue), Shortest Path]
leetcode_url: "https://leetcode.com/problems/path-with-maximum-probability"
---

# Path with Maximum Probability / Đường Đi Với Xác Suất Lớn Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Shortest Path (Dijkstra — Max variant)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Minimum Cost to Buy Apples](https://leetcode.com/problems/minimum-cost-to-buy-apples) | [Minimum Time to Visit a Cell In a Grid](https://leetcode.com/problems/minimum-time-to-visit-a-cell-in-a-grid)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tìm đường ngắn nhất trên Google Maps, nhưng thay vì **tổng nhỏ nhất**, ta tìm **tích xác suất lớn nhất**. Dijkstra vẫn hoạt động: thay vì `dist = min(dist, d + w)`, ta dùng `prob = max(prob, p * w)`. Luôn xử lý node có xác suất cao nhất trước — điều này đảm bảo khi pop một node, đó là xác suất tốt nhất có thể.

**Pattern Recognition:**

- Signal: "graph + edge weights + optimal path" → **Dijkstra variant**
- Thay min-heap (tổng) bằng max-heap (tích xác suất)
- Key: xác suất ∈ (0,1] → tích luôn giảm khi đi thêm edge → Dijkstra correctness giữ nguyên

**Visual — Max-Probability Dijkstra:**

```
n=3, edges=[[0,1],[1,2],[0,2]], prob=[0.5,0.5,0.2], start=0, end=2

Graph: 0 --0.5-- 1 --0.5-- 2
       |                   |
       +-------0.2---------+

prob[] = [1.0, 0.0, 0.0]
Heap (max): [(1.0, node=0)]

Pop (1.0, 0): process neighbors
  → 1: 1.0 × 0.5 = 0.50 > 0.0 → prob[1]=0.50, push (0.50,1)
  → 2: 1.0 × 0.2 = 0.20 > 0.0 → prob[2]=0.20, push (0.20,2)

Pop (0.5, 1): process neighbors
  → 0: 0.5 × 0.5 = 0.25 < prob[0]=1.0, skip
  → 2: 0.5 × 0.5 = 0.25 > prob[2]=0.20 → prob[2]=0.25, push (0.25,2)

Pop (0.25, 2): node == end_node → return 0.25 ✓
```

---

## Problem Description

Undirected weighted graph with `n` nodes (0-indexed). `edges[i]=[u,v]`, `succProb[i]` = probability of success on edge i. Find the **path with maximum probability** from `start_node` to `end_node`. Return 0 if unreachable.

- `2 ≤ n ≤ 10^4`, `0 ≤ edges.length ≤ 2×10^4`, `0 < succProb[i] ≤ 1`

```
Example 1: n=3, edges=[[0,1],[1,2],[0,2]], prob=[0.5,0.5,0.2], start=0, end=2 → 0.25000
  Path 0→1→2: 0.5×0.5=0.25 > direct 0→2: 0.2

Example 2: n=3, edges=[[0,1],[1,2],[0,2]], prob=[0.5,0.5,0.3], start=0, end=2 → 0.30000
  Direct 0→2: 0.3 > 0→1→2: 0.25

Example 3: n=3, edges=[[0,1]], prob=[0.5], start=0, end=2 → 0  (unreachable)
```

---

## 📝 Interview Tips

1. **Dijkstra variant** — "Maximize product" thay vì "minimize sum" → flip heap: max-heap thay min-heap / _Recognize Dijkstra variant: maximize product — flip the comparison direction_
2. **Early termination** — Dừng ngay khi pop `end_node`: đó là xác suất tối ưu / _Stop immediately when end_node is popped — that's the optimal probability_
3. **Correctness proof** — Xác suất ∈ (0,1] → tích luôn ≤ từng thừa số → Dijkstra greedy vẫn đúng / _Probabilities in (0,1] so products are non-increasing — greedy still correct_
4. **No built-in heap** — TypeScript thiếu heap; dùng sorted array trong interview, ghi chú O(E log E) / _No built-in heap in TS; sorted array simulation is fine for interviews_
5. **Bellman-Ford fallback** — O(V×E) nhưng dễ code hơn nếu quên Dijkstra; đủ pass với constraints / _Bellman-Ford is O(V×E) but easier — acceptable for n=10^4, E=2×10^4_
6. **Edge case** — start == end → return 1.0 (không cần di chuyển) / _If start equals end, probability is 1.0 — no travel needed_

---

## Solutions

```typescript
/**
 * Solution 1: Bellman-Ford — Relax edges V-1 times
 * Time: O(V × E) — up to 10^4 × 2×10^4 iterations worst case
 * Space: O(V + E)
 * Good fallback when Dijkstra isn't top of mind.
 */
function maxProbabilityBF(
  n: number,
  edges: number[][],
  succProb: number[],
  start_node: number,
  end_node: number,
): number {
  const prob = new Array(n).fill(0);
  prob[start_node] = 1.0;

  for (let iter = 0; iter < n - 1; iter++) {
    let updated = false;
    for (let i = 0; i < edges.length; i++) {
      const [u, v] = edges[i];
      const w = succProb[i];
      if (prob[u] * w > prob[v]) {
        prob[v] = prob[u] * w;
        updated = true;
      }
      if (prob[v] * w > prob[u]) {
        prob[u] = prob[v] * w;
        updated = true;
      }
    }
    if (!updated) break; // converged early
  }
  return prob[end_node];
}

/**
 * Solution 2: Max-Dijkstra with sorted array heap simulation
 * Time: O(E log E) — heap operations
 * Space: O(V + E)
 * Optimal: processes highest-prob node first, early-exit on reaching end.
 */
function maxProbability(
  n: number,
  edges: number[][],
  succProb: number[],
  start_node: number,
  end_node: number,
): number {
  const graph: [number, number][][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < edges.length; i++) {
    const [u, v] = edges[i];
    graph[u].push([v, succProb[i]]);
    graph[v].push([u, succProb[i]]);
  }

  const prob = new Array(n).fill(0);
  prob[start_node] = 1.0;
  // [probability, node] — simulate max-heap with sorted array
  const heap: [number, number][] = [[1.0, start_node]];

  while (heap.length > 0) {
    heap.sort((a, b) => b[0] - a[0]); // largest prob first
    const [p, node] = heap.shift()!;

    if (node === end_node) return p; // early exit: optimal answer
    if (p < prob[node]) continue; // stale heap entry

    for (const [next, edgeProb] of graph[node]) {
      const newProb = p * edgeProb;
      if (newProb > prob[next]) {
        prob[next] = newProb;
        heap.push([newProb, next]);
      }
    }
  }
  return 0;
}

// === Test Cases ===
const e1 = [
  [0, 1],
  [1, 2],
  [0, 2],
];
console.log(maxProbability(3, e1, [0.5, 0.5, 0.2], 0, 2)); // 0.25
console.log(maxProbability(3, e1, [0.5, 0.5, 0.3], 0, 2)); // 0.30
console.log(maxProbability(3, [[0, 1]], [0.5], 0, 2)); // 0
console.log(maxProbability(2, [[1, 0]], [0.5], 0, 1)); // 0.5

console.log(maxProbabilityBF(3, e1, [0.5, 0.5, 0.2], 0, 2)); // 0.25
console.log(maxProbabilityBF(3, e1, [0.5, 0.5, 0.3], 0, 2)); // 0.30
```

---

## 🔗 Related Problems

| Problem                                                                                          | Pattern                 | Difficulty |
| ------------------------------------------------------------------------------------------------ | ----------------------- | ---------- |
| [Network Delay Time](https://leetcode.com/problems/network-delay-time)                           | Dijkstra (min-sum)      | Medium     |
| [Minimum Cost to Buy Apples](https://leetcode.com/problems/minimum-cost-to-buy-apples)           | Multi-source Dijkstra   | Medium     |
| [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops) | Dijkstra / Bellman-Ford | Medium     |
| [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water)                       | Dijkstra (minimize max) | Hard       |
