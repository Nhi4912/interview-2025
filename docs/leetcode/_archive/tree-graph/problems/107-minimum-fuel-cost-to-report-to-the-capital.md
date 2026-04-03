---
layout: page
title: "Minimum Fuel Cost to Report to the Capital"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/minimum-fuel-cost-to-report-to-the-capital"
---

# Minimum Fuel Cost to Report to the Capital / Chi Phí Nhiên Liệu Tối Thiểu Về Thủ Đô

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS on Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Hãy tưởng tượng các đại biểu từ các tỉnh phải về thủ đô (node 0) bằng xe có `seats` chỗ. Trên mỗi con đường, bao nhiêu người phải đi qua? = số node trong subtree. Số xe cần cho đoạn đường đó = `ceil(người / seats)`. DFS hậu tự (post-order) tính từ lá lên: trước tiên biết subtree size, rồi cộng chi phí từng cạnh.

**Pattern Recognition:**

- Tree + "cost per edge depends on subtree below" → post-order DFS
- Each edge cost = `ceil(subtree_size / seats)` (minimum trips needed)
- Total fuel = sum of costs over all edges

**Visual:**

```
roads=[[0,1],[0,2],[0,3],[3,4],[3,5]], seats=5

Tree:        0
           / | \
          1  2  3
               / \
              4   5

Subtree sizes: 1→1, 2→1, 4→1, 5→1, 3→3, 0→6

Edge 1→0: ceil(1/5)=1 trip → 1 fuel
Edge 2→0: ceil(1/5)=1 trip → 1 fuel
Edge 4→3: ceil(1/5)=1 trip → 1 fuel
Edge 5→3: ceil(1/5)=1 trip → 1 fuel
Edge 3→0: ceil(3/5)=1 trip → 1 fuel

Total = 5 ✅
```

## Problem Description

A tree with `n` nodes (0-indexed) and `n-1` undirected roads. Each node has one representative. A car holds `seats` people. Everyone must travel to node 0. Return the minimum fuel needed (1 fuel per road segment per trip). Fuel = number of trips × 1 (per road traversal).

**Example 1:** `roads=[[0,1],[0,2],[0,3],[3,4],[3,5]], seats=5` → `5`
**Example 2:** `roads=[[3,1],[3,2],[1,0],[0,4],[0,5],[4,6]], seats=2` → `7`

**Constraints:** `1 <= n <= 10^5`, `roads.length == n-1`, `1 <= seats <= 10^5`

## 📝 Interview Tips

1. **Clarify**: Mọi người về node 0. Xe có thể đón người dọc đường không? (Có, miễn không quá seats) / Cars can pick up passengers along the way within seat limit.
2. **Approach**: Post-order DFS — tính subtree size từ lá, mỗi cạnh cộng `ceil(size/seats)` / Post-order DFS summing ceil(subtreeSize/seats) per edge.
3. **Edge cases**: n=1 → 0 (chỉ có thủ đô); seats≥n → mỗi cạnh chỉ 1 trip / Single node or very large seats.
4. **Optimize**: DFS O(n) là optimal — chỉ cần 1 lần traversal / Single O(n) DFS pass is optimal.
5. **Test**: Chuỗi thẳng (chain): 0-1-2-3 với seats=2 / Test chain topology.
6. **Follow-up**: Nếu có nhiều thủ đô? Hoặc xe có trọng số fuel khác nhau? / What if multiple capitals or varied fuel costs?

## Solutions

```typescript
/** Solution 1: Post-order DFS
 * Time: O(n) | Space: O(n)
 */
function minimumFuelCost(roads: number[][], seats: number): number {
  const n = roads.length + 1;
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of roads) {
    graph[u].push(v);
    graph[v].push(u);
  }

  let fuel = 0;

  // Returns number of people in subtree rooted at `node` (excluding parent)
  function dfs(node: number, parent: number): number {
    let people = 1; // this node's representative
    for (const neighbor of graph[node]) {
      if (neighbor === parent) continue;
      const subtreePeople = dfs(neighbor, node);
      // Trips needed for this edge = ceil(subtreePeople / seats)
      fuel += Math.ceil(subtreePeople / seats);
      people += subtreePeople;
    }
    return people;
  }

  dfs(0, -1);
  return fuel;
}

/** Solution 2: Iterative post-order using topological sort (BFS from leaves)
 * Time: O(n) | Space: O(n)
 * Avoids recursion stack overflow for large n
 */
function minimumFuelCostIterative(roads: number[][], seats: number): number {
  const n = roads.length + 1;
  if (n === 1) return 0;

  const graph: number[][] = Array.from({ length: n }, () => []);
  const degree = new Array(n).fill(0);
  for (const [u, v] of roads) {
    graph[u].push(v);
    graph[v].push(u);
    degree[u]++;
    degree[v]++;
  }

  const people = new Array(n).fill(1); // each node has 1 representative
  let fuel = 0;

  // Start from all leaves (degree=1, excluding root 0)
  const queue: number[] = [];
  for (let i = 1; i < n; i++) {
    if (degree[i] === 1) queue.push(i);
  }

  while (queue.length > 0) {
    const node = queue.shift()!;
    fuel += Math.ceil(people[node] / seats);
    // Find parent (the neighbor with lower degree / not yet processed)
    for (const neighbor of graph[node]) {
      if (degree[neighbor] > 0) {
        people[neighbor] += people[node];
        degree[neighbor]--;
        if (degree[neighbor] === 1 && neighbor !== 0) {
          queue.push(neighbor);
        }
      }
    }
    degree[node] = 0; // mark as processed
  }

  return fuel;
}

// Test cases
console.log(
  minimumFuelCost(
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [3, 4],
      [3, 5],
    ],
    5,
  ),
); // 5
console.log(
  minimumFuelCost(
    [
      [3, 1],
      [3, 2],
      [1, 0],
      [0, 4],
      [0, 5],
      [4, 6],
    ],
    2,
  ),
); // 7
console.log(minimumFuelCost([], 1)); // 0 (single node)

console.log(
  minimumFuelCostIterative(
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [3, 4],
      [3, 5],
    ],
    5,
  ),
); // 5
console.log(
  minimumFuelCostIterative(
    [
      [3, 1],
      [3, 2],
      [1, 0],
      [0, 4],
      [0, 5],
      [4, 6],
    ],
    2,
  ),
); // 7
```

## 🔗 Related Problems

| Problem                                                                                                          | Relationship                                |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [Most Profitable Path in a Tree](https://leetcode.com/problems/most-profitable-path-in-a-tree)                   | DFS on tree với cost accumulation           |
| [Count Nodes Equal to Average of Subtree](https://leetcode.com/problems/count-nodes-equal-to-average-of-subtree) | Post-order DFS computing subtree properties |
| [Distribute Coins in Binary Tree](https://leetcode.com/problems/distribute-coins-in-binary-tree)                 | Post-order DFS, cost per edge = excess flow |
