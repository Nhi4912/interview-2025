---
layout: page
title: "Collect Coins in a Tree"
difficulty: Hard
category: Tree-Graph
tags: [Array, Tree, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/collect-coins-in-a-tree"
---

# Collect Coins in a Tree / Thu Thập Đồng Xu Trong Cây

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Topological Sort (Leaf Pruning)
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như dọn dẹp khu phố bỏ hoang — trước tiên loại bỏ các ngõ cụt không có gì đáng thu (lá trống), sau đó cắt thêm 2 lớp lá ngoài cùng vì ta có thể thu xu từ xa 2 bước. Phần còn lại mới thực sự phải đi qua.

**Pattern Recognition:**

- Signal: "collect from tree" + "reach within distance 2" → **Leaf pruning (2 rounds)**
- Phase 1: Remove leaves with `coins[i]=0` repeatedly (they serve no purpose)
- Phase 2: Remove leaves 2 more times (since we can reach 2 hops away without traversing)
- Answer = 2 × remaining edges (go and return on each edge)

**Visual:**

```
coins = [1,0,0,0,0,1]  edges = [[0,1],[1,2],[2,3],[3,4],[4,5]]
Tree: 0-1-2-3-4-5  (path)

Phase 1: Remove 0-coin leaves: nodes 1,2,3,4 are leaves with coins=0
  Remove 1 (leaf, coin=0) → tree: 0-2-3-4-5 → remove 2 → 0-3-4-5...
  Actually: start: 0(1)-1(0)-2(0)-3(0)-4(0)-5(1)
  Leaves: 0 and 5. coin[0]=1≠0, coin[5]=1≠0 → no phase-1 removal

Phase 2 (round 1): Remove leaves 0 and 5
  Remaining: 1-2-3-4

Phase 2 (round 2): Remove leaves 1 and 4
  Remaining: 2-3 (one edge)

Answer = 2 × 1 = 2
```

## Problem Description

Given a tree with n nodes, `coins[i]` coins at node i, and edge list. Collect all coins by starting at any node and traversing edges (each traversal costs 1 move). You can collect coins within distance 2 of your current position. Return minimum edges to traverse.

Example 1: `coins=[1,0,0,0,0,1], edges=[[0,1],[1,2],[2,3],[3,4],[4,5]]` → `2`
Example 2: `coins=[0,0,0,1,1,0,0,1], edges=[[0,1],[0,2],[1,3],[1,4],[2,5],[5,6],[5,7]]` → `2`

## 📝 Interview Tips

1. **Clarify**: "Thu xu trong bán kính 2 từ vị trí → không cần đi đến đúng vị trí đó" / Reach within 2 hops
2. **Phase 1 insight**: "Lá không có xu là vô dụng — xóa chúng đi không ảnh hưởng kết quả" / Prune 0-coin leaves
3. **Phase 2 insight**: "Xóa thêm 2 lớp lá vì từ node bất kỳ có thể thu trong radius 2" / 2-round leaf peeling
4. **Answer formula**: "Mỗi cạnh đi 2 lần (đi và về) → ans = 2 × số cạnh còn lại" / 2× remaining edges
5. **Edge cases**: "n=1 → 0; Tất cả xu=0 → 0; Chỉ 2 node với xu → cạnh giữa cần traversal không?"
6. **Complexity**: "Time O(n) | Space O(n) for adjacency sets"

## Solutions

```typescript
/** Solution 1: Naive DFS — try each starting node, count traversals
 * Time: O(n²) | Space: O(n)
 */
function collectCoinsBrute(coins: number[], edges: number[][]): number {
  const n = coins.length;
  if (n <= 2) return 0;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // Collect all nodes with coins, find connected "must visit" subtree
  const hasCoin = new Set(coins.map((c, i) => (c > 0 ? i : -1)).filter((i) => i >= 0));
  if (hasCoin.size === 0) return 0;

  // Prune: find smallest subtree containing all coin nodes
  // Count edges that are "necessary" — part of Steiner tree-like structure
  // For simplicity: BFS from coin nodes to find required nodes
  // (This brute force is approximate — see optimal solution for correctness)
  let minEdges = Infinity;
  for (let start = 0; start < n; start++) {
    let edgeCount = 0;
    const visited = new Set<number>([start]);
    const stack = [start];
    while (stack.length > 0) {
      const node = stack.pop()!;
      for (const next of adj[node]) {
        if (!visited.has(next)) {
          visited.add(next);
          edgeCount += 2;
          stack.push(next);
        }
      }
    }
    minEdges = Math.min(minEdges, edgeCount);
  }
  return minEdges; // Upper bound; correct solution uses pruning below
}

/** Solution 2: Leaf pruning — optimal O(n) solution
 * Time: O(n) | Space: O(n)
 */
function collectCoins(coins: number[], edges: number[][]): number {
  const n = coins.length;
  if (n <= 2) return 0;

  const adj: Set<number>[] = Array.from({ length: n }, () => new Set<number>());
  for (const [u, v] of edges) {
    adj[u].add(v);
    adj[v].add(u);
  }

  // Phase 1: Remove leaves with 0 coins repeatedly (topological pruning)
  const queue: number[] = [];
  for (let i = 0; i < n; i++) {
    if (adj[i].size === 1 && coins[i] === 0) queue.push(i);
  }

  while (queue.length > 0) {
    const leaf = queue.shift()!;
    for (const neighbor of adj[leaf]) {
      adj[neighbor].delete(leaf);
      if (adj[neighbor].size === 1 && coins[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
    adj[leaf].clear();
  }

  // Phase 2: Remove all leaves twice (radius-2 coverage)
  for (let round = 0; round < 2; round++) {
    const leaves: number[] = [];
    for (let i = 0; i < n; i++) {
      if (adj[i].size === 1) leaves.push(i);
    }
    for (const leaf of leaves) {
      for (const neighbor of adj[leaf]) {
        adj[neighbor].delete(leaf);
      }
      adj[leaf].clear();
    }
  }

  // Count remaining edges: each node's degree summed = 2 × edges
  let edgeSum = 0;
  for (let i = 0; i < n; i++) edgeSum += adj[i].size;
  return edgeSum; // = 2 × remaining_edges = answer (go + return each edge)
}

/** Solution 3: Same algorithm using degree array (no Set, slightly faster)
 * Time: O(n) | Space: O(n)
 */
function collectCoinsV3(coins: number[], edges: number[][]): number {
  const n = coins.length;
  const degree = new Array(n).fill(0);
  const removed = new Array(n).fill(false);
  const adj: number[][] = Array.from({ length: n }, () => []);

  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
    degree[u]++;
    degree[v]++;
  }

  // Phase 1: topological remove 0-coin leaves
  let q: number[] = [];
  for (let i = 0; i < n; i++) {
    if (degree[i] === 1 && coins[i] === 0) q.push(i);
  }
  while (q.length > 0) {
    const next: number[] = [];
    for (const node of q) {
      removed[node] = true;
      for (const nb of adj[node]) {
        if (!removed[nb]) {
          degree[nb]--;
          if (degree[nb] === 1 && coins[nb] === 0) next.push(nb);
        }
      }
    }
    q = next;
  }

  // Phase 2: remove leaves twice
  for (let round = 0; round < 2; round++) {
    const leaves = [];
    for (let i = 0; i < n; i++) {
      if (!removed[i] && degree[i] === 1) leaves.push(i);
    }
    for (const node of leaves) {
      removed[node] = true;
      for (const nb of adj[node]) {
        if (!removed[nb]) degree[nb]--;
      }
    }
  }

  // Count remaining edges
  let edgeCount = 0;
  for (const [u, v] of edges) {
    if (!removed[u] && !removed[v]) edgeCount++;
  }
  return edgeCount * 2;
}

// Tests
console.log(
  collectCoins(
    [1, 0, 0, 0, 0, 1],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
  ),
); // 2
console.log(
  collectCoins(
    [0, 0, 0, 1, 1, 0, 0, 1],
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
      [5, 6],
      [5, 7],
    ],
  ),
); // 2
console.log(
  collectCoinsV3(
    [1, 0, 0, 0, 0, 1],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
  ),
); // 2
console.log(collectCoins([0], [])); // 0
console.log(collectCoins([1, 1], [[0, 1]])); // 0 (2 nodes, adjacent — no need to traverse)
console.log(
  collectCoinsV3(
    [0, 0, 0, 1, 1, 0, 0, 1],
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
      [5, 6],
      [5, 7],
    ],
  ),
); // 2
```

## 🔗 Related Problems

| Problem                                                                                                                          | Relationship                             |
| -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters) | Tree DFS / leaf processing               |
| [Parallel Courses III](https://leetcode.com/problems/parallel-courses-iii)                                                       | Topological sort with DP                 |
| [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree)                                               | Tree DP — traverse to compute aggregates |
