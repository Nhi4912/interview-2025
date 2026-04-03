---
layout: page
title: "Sum of Distances in Tree"
difficulty: Hard
category: Tree-Graph
tags: [Dynamic Programming, Tree, Depth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/sum-of-distances-in-tree"
---

# Sum of Distances in Tree / Tổng Khoảng Cách Trong Cây

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Two-Pass DFS (Re-rooting)
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Distribute Coins in Binary Tree](https://leetcode.com/problems/distribute-coins-in-binary-tree) | [Binary Tree Cameras](https://leetcode.com/problems/binary-tree-cameras)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như mạng đường sắt hình cây — bạn muốn biết từ mỗi thành phố, tổng khoảng cách đến tất cả thành phố khác là bao nhiêu. Brute force BFS từ mỗi node là O(N²). Trick: tính kết quả cho node gốc (pass 1), rồi "rerooting" — dịch chuyển góc nhìn từ parent sang child (pass 2).

**Pattern Recognition:**

- Signal: "sum of distances from each node" + tree → **Two-pass DFS re-rooting**
- Pass 1: từ root, tính `cnt[v]` (số nodes trong subtree v) và `ans[0]` (tổng dist từ root)
- Pass 2: re-root từ parent `u` sang child `v`: `ans[v] = ans[u] - cnt[v] + (n - cnt[v])`

**Visual:**

```
     0
   / | \
  1  2  3

Pass 1 (root=0):
cnt[1]=1, cnt[2]=1, cnt[3]=1, cnt[0]=4
ans[0] = 0+1+1+1 = 3

Pass 2 (re-root from 0→1):
Moving root to node 1:
  - nodes in subtree(1) = 1: get 1 closer → -1
  - nodes outside subtree(1) = 3: get 1 farther → +3
  ans[1] = ans[0] - cnt[1] + (n - cnt[1]) = 3 - 1 + 3 = 5
```

---

## Problem Description

Given an undirected tree with `n` nodes labeled `0` to `n-1` and a list of edges, return an array `answer` where `answer[i]` is the sum of distances from node `i` to all other nodes.

**Example:** `n=6, edges=[[0,1],[0,2],[2,3],[2,4],[2,5]]` → `[8,12,6,10,10,10]`

Constraints: `1 <= n <= 3 × 10⁴`, edges form a valid tree (n-1 edges, connected).

---

## 📝 Interview Tips

1. **Brute force first**: "O(N²) — BFS từ mỗi node; với N=3×10⁴ thì quá chậm" / State O(N²) brute force then improve
2. **Re-rooting key formula**: "`ans[v] = ans[u] - cnt[v] + (n - cnt[v])`" / Memorize this recurrence
3. **cnt array**: "`cnt[v]` = số nodes trong subtree của v khi root=0" / Count subtree sizes in pass 1
4. **Pass 1 order**: "Post-order DFS để tính cnt và ans[0] từ dưới lên" / Bottom-up for pass 1
5. **Pass 2 order**: "Pre-order DFS để propagate ans từ root xuống" / Top-down for pass 2
6. **Edge cases**: "n=1 → tất cả [0]; n=2 → [1,1]" / Handle trivial cases

---

## Solutions

```typescript
/**
 * Solution 1: Two-Pass DFS (Re-rooting) — optimal
 * Time: O(N) — two DFS passes, each O(N)
 * Space: O(N) — adjacency list + cnt + ans arrays
 */
function sumOfDistancesInTree(n: number, edges: number[][]): number[] {
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const cnt = new Array(n).fill(1); // subtree size
  const ans = new Array(n).fill(0); // answer for each node

  // Pass 1: post-order DFS from root=0
  // Compute cnt[node] and ans[0] (sum of distances from node 0)
  function dfs1(node: number, parent: number): void {
    for (const child of graph[node]) {
      if (child === parent) continue;
      dfs1(child, node);
      cnt[node] += cnt[child];
      ans[node] += ans[child] + cnt[child]; // all child subtree nodes +1 step
    }
  }

  // Pass 2: pre-order DFS, re-root from parent to child
  function dfs2(node: number, parent: number): void {
    for (const child of graph[node]) {
      if (child === parent) continue;
      // Moving root from node → child:
      //   cnt[child] nodes get 1 closer, (n - cnt[child]) nodes get 1 farther
      ans[child] = ans[node] - cnt[child] + (n - cnt[child]);
      dfs2(child, node);
    }
  }

  dfs1(0, -1);
  dfs2(0, -1);
  return ans;
}

/**
 * Solution 2: Iterative version (avoids stack overflow for n=30000)
 * Time: O(N) | Space: O(N)
 */
function sumOfDistancesIterative(n: number, edges: number[][]): number[] {
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const cnt = new Array(n).fill(1);
  const ans = new Array(n).fill(0);
  const order: number[] = [];
  const parent = new Array(n).fill(-1);
  const visited = new Array(n).fill(false);

  // BFS to get topological order
  const queue = [0];
  visited[0] = true;
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const child of graph[node]) {
      if (!visited[child]) {
        visited[child] = true;
        parent[child] = node;
        queue.push(child);
      }
    }
  }

  // Pass 1: bottom-up (reverse BFS order)
  for (let i = order.length - 1; i >= 1; i--) {
    const v = order[i],
      p = parent[v];
    cnt[p] += cnt[v];
    ans[p] += ans[v] + cnt[v];
  }

  // Pass 2: top-down (BFS order)
  for (let i = 1; i < order.length; i++) {
    const v = order[i],
      p = parent[v];
    ans[v] = ans[p] - cnt[v] + (n - cnt[v]);
  }
  return ans;
}

// === Test Cases ===
console.log(
  sumOfDistancesInTree(6, [
    [0, 1],
    [0, 2],
    [2, 3],
    [2, 4],
    [2, 5],
  ]),
);
// [8,12,6,10,10,10]
console.log(sumOfDistancesInTree(1, [])); // [0]
console.log(sumOfDistancesInTree(2, [[1, 0]])); // [1,1]
```

---

## 🔗 Related Problems

| Problem                                                                                                                    | Pattern        | Difficulty |
| -------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------- |
| [Distribute Coins in Binary Tree](https://leetcode.com/problems/distribute-coins-in-binary-tree)                           | Post-order DFS | 🟡 Medium  |
| [Binary Tree Cameras](https://leetcode.com/problems/binary-tree-cameras)                                                   | Greedy DFS     | 🔴 Hard    |
| [Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees)                                                 | Leaf trimming  | 🟡 Medium  |
| [Difference Between Max and Min Price Sum](https://leetcode.com/problems/difference-between-maximum-and-minimum-price-sum) | Re-rooting DP  | 🔴 Hard    |
| [Count Nodes Equal to Average of Subtree](https://leetcode.com/problems/count-nodes-equal-to-average-of-subtree)           | Post-order DFS | 🟡 Medium  |
