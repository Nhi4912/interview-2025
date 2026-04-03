---
layout: page
title: "Maximize Sum of Weights after Edge Removals"
difficulty: Hard
category: Tree-Graph
tags: [Dynamic Programming, Tree, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/maximize-sum-of-weights-after-edge-removals"
---

# Maximize Sum of Weights after Edge Removals / Tối Đa Tổng Trọng Số Sau Khi Xóa Cạnh

---

## 🧠 Intuition / Tư Duy

**Analogy:** > Bạn có một cây gia phả. Mỗi mối quan hệ cha-con có điểm số. Quy tắc: mỗi người chỉ được giữ tối đa **k mối quan hệ** (degree ≤ k). Hãy chọn giữ lại những mối quan hệ có tổng điểm cao nhất.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximize Sum of Weights after Edge Removals example:**

```
Tree (k=2):           Strategy per node:
    0                  - Keep top-k heaviest child edges
   /|\                 - dp[v][0] = no parent edge kept
  1  2  3              - dp[v][1] = parent edge kept (one slot used)
 w=5 w=3 w=8

Node 0: edges to 1(5), 2(3), 3(8), keep top-2 → 8+5=13
```

---

## Problem Description

Given a tree with `n` nodes (0-indexed) and weighted edges, and integer `k`. Each node can have at most `k` edges in the final subgraph. Maximize the total sum of edge weights in the remaining edges.

---

## 📝 Interview Tips

1. **Tree DP** — for each node, decide how many edges to keep with parent vs children
2. **Two states** — `dp[node][0]` (no parent edge kept) and `dp[node][1]` (parent edge kept, 1 slot used)
3. **Greedy within DP** — sort child contributions, greedily pick top ones
4. **Contribution difference** — for each child, compute the gain of keeping vs not keeping its edge
5. **Root at 0** — root the tree, then DFS; parent edge decision propagates
6. **Time complexity** — O(n log n) due to sorting children at each node

---

## Solutions

```typescript
function maximizeSumOfWeights(edges: number[][], k: number): number {
  const n = edges.length + 1;
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  }

  // Returns [dp0, dp1]:
  //   dp0 = max weight sum in subtree when parent edge is NOT kept
  //   dp1 = max weight sum in subtree when parent edge IS kept (uses 1 slot)
  function dfs(node: number, parent: number): [number, number] {
    // gains[i] = extra weight gained by keeping edge to child i
    const gains: number[] = [];
    let baseSum = 0; // sum assuming no child edges kept

    for (const [child, w] of adj[node]) {
      if (child === parent) continue;
      const [c0, c1] = dfs(child, node);
      baseSum += c0;
      // gain of keeping this edge = w + c1 - c0 (switch child from no-edge to edge)
      gains.push(w + c1 - c0);
    }

    // Sort gains descending, greedily pick top ones
    gains.sort((a, b) => b - a);

    // dp0: can use up to k slots for children
    let dp0 = baseSum;
    for (let i = 0; i < Math.min(k, gains.length); i++) {
      if (gains[i] <= 0) break;
      dp0 += gains[i];
    }

    // dp1: parent uses 1 slot, so only k-1 slots for children
    let dp1 = baseSum;
    for (let i = 0; i < Math.min(k - 1, gains.length); i++) {
      if (gains[i] <= 0) break;
      dp1 += gains[i];
    }

    return [dp0, dp1];
  }

  return dfs(0, -1)[0];
}

// Tests
console.log(
  maximizeSumOfWeights(
    [
      [0, 1, 4],
      [1, 2, 6],
      [2, 3, 5],
    ],
    2,
  ),
); // 15  (keep all 3 edges, each node degree≤2)
console.log(
  maximizeSumOfWeights(
    [
      [0, 1, 5],
      [1, 2, 10],
      [0, 3, 7],
    ],
    1,
  ),
); // 17 (keep 1-2 and 0-3)

function maximizeSumOfWeightsIterative(edges: number[][], k: number): number {
  const n = edges.length + 1;
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  }

  const dp0 = new Array(n).fill(0);
  const dp1 = new Array(n).fill(0);
  const order: number[] = [];
  const par = new Array(n).fill(-1);
  const parW = new Array(n).fill(0);
  const visited = new Array(n).fill(false);
  const stack = [0];
  visited[0] = true;

  while (stack.length) {
    const node = stack.pop()!;
    order.push(node);
    for (const [child, w] of adj[node]) {
      if (!visited[child]) {
        visited[child] = true;
        par[child] = node;
        parW[child] = w;
        stack.push(child);
      }
    }
  }

  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];
    const gains: number[] = [];
    let baseSum = 0;
    for (const [child, w] of adj[node]) {
      if (child === par[node]) continue;
      baseSum += dp0[child];
      gains.push(w + dp1[child] - dp0[child]);
    }
    gains.sort((a, b) => b - a);
    dp0[node] = baseSum;
    for (let j = 0; j < Math.min(k, gains.length); j++) {
      if (gains[j] <= 0) break;
      dp0[node] += gains[j];
    }
    dp1[node] = baseSum;
    for (let j = 0; j < Math.min(k - 1, gains.length); j++) {
      if (gains[j] <= 0) break;
      dp1[node] += gains[j];
    }
  }

  return dp0[0];
}

console.log(
  maximizeSumOfWeightsIterative(
    [
      [0, 1, 4],
      [1, 2, 6],
      [2, 3, 5],
    ],
    2,
  ),
); // 15
```

---

## 🔗 Related Problems

| #    | Problem                                     | Difficulty | Tags      |
| ---- | ------------------------------------------- | ---------- | --------- |
| 968  | Binary Tree Cameras                         | Hard       | Tree DP   |
| 337  | House Robber III                            | Medium     | Tree DP   |
| 2458 | Height of Binary Tree After Subtree Removal | Hard       | DFS       |
| 1245 | Tree Diameter                               | Medium     | Tree, DFS |
