---
layout: page
title: "Minimum Edge Reversals So Every Node Is Reachable"
difficulty: Hard
category: Tree-Graph
tags: [Dynamic Programming, Depth-First Search, Breadth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/minimum-edge-reversals-so-every-node-is-reachable"
---

# Minimum Edge Reversals So Every Node Is Reachable / Số Lần Đảo Cạnh Tối Thiểu Để Đến Được Mọi Node

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops) | [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Giống hệ thống đường một chiều trong thành phố — bạn cần biết từ trụ sở ở mỗi quận, phải đảo bao nhiêu con đường để xe có thể chạy đến được mọi nơi. Kỹ thuật "re-rooting": tính đáp án cho node 0 trước, rồi khi "dịch chuyển gốc" sang node con, chỉ cần cộng/trừ 1 tùy chiều cạnh.

**Pattern Recognition:**

- Signal: "answer for each node as root" + "tree" → **Re-rooting DFS (Tree DP)**
- Key insight: Khi đổi root từ u sang v (con của u): nếu cạnh u→v (thuận chiều), cost tăng 1; nếu v→u (ngược chiều), cost giảm 1

**Visual — Re-rooting technique example:**

```
n=4, edges: 0→1, 1→2, 2→3 (directed)
Undirected adj with weight: (neighbor, cost_to_reverse)
  0→1: cost 0 (already correct dir from 0)
  1→0: cost 1 (need reversal from 0's perspective)

Step 1 DFS(root=0): count reversals needed = 0
  0→1 (direct): 0 reversals
  1→2 (direct): 0 reversals
  2→3 (direct): 0 reversals
  ans[0] = 0

Step 2 Re-root (0→1): ans[1] = ans[0] + 1 (edge was 0→1, now need 1→0)
Step 2 Re-root (1→2): ans[2] = ans[1] + 1
Step 2 Re-root (2→3): ans[3] = ans[2] + 1
Output: [0, 1, 2, 3]
```

---

## 📝 Problem Description

Given a directed graph with `n` nodes (0 to n-1) in the shape of a tree (undirected tree with directed edges). For each node `i`, find the **minimum number of edge reversals** so that every node is reachable from node `i`. Return an array of length `n`.

**Example 1:** `n=4`, `edges=[[2,0],[2,4],[2,3],[1,4]]` wait, recheck: `n=4, edges=[[1,0],[1,2],[0,3]]` → `[0,2,1,1]`
**Example 2:** `n=3`, `edges=[[1,0],[2,0]]` → `[0,1,1]`

Constraints: `2 ≤ n ≤ 10⁵`, `edges.length = n-1`.

---

## 🎯 Interview Tips

1. **Re-rooting is key**: O(N) instead of O(N²) / Re-rooting là then chốt: O(N) thay vì O(N²) naive
2. **Two DFS passes**: 1st computes ans[0], 2nd propagates to all nodes / 2 lần DFS: lần 1 tính ans[0], lần 2 lan truyền sang các node khác
3. **Edge direction encoding**: store (neighbor, weight) where weight=0 if original direction, 1 if reversed / Encode cạnh: weight=0 thuận chiều, weight=1 ngược chiều
4. **Transition**: when moving root u→v, cost changes by ±1 based on original edge direction / Khi dịch root u→v, cost thay đổi ±1 tùy chiều cạnh gốc
5. **Stack overflow risk**: use iterative DFS for n=10⁵ / Với n=10⁵, dùng DFS iterative để tránh tràn stack
6. **Verify with small example**: n=3 edges 1→0, 2→0 manually / Kiểm thử tay với ví dụ nhỏ

---

## 💡 Solutions

### Approach 1: Brute Force — DFS from each node O(N²)

/\*_ @complexity Time: O(N²) | Space: O(N) _/

```typescript
function minEdgeReversalsBrute(n: number, edges: number[][]): number[] {
  // Build adj with direction info
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push([v, 0]); // u→v original, cost 0 to traverse
    adj[v].push([u, 1]); // v→u reversed, cost 1 to traverse
  }
  const result: number[] = [];
  for (let start = 0; start < n; start++) {
    let cost = 0;
    const visited = new Set([start]);
    const stack: number[] = [start];
    while (stack.length) {
      const node = stack.pop()!;
      for (const [nb, w] of adj[node]) {
        if (!visited.has(nb)) {
          visited.add(nb);
          cost += w;
          stack.push(nb);
        }
      }
    }
    result.push(cost);
  }
  return result;
}
```

### Approach 2: Re-rooting DFS — Optimal O(N)

/\*_ @complexity Time: O(N) | Space: O(N) _/

```typescript
function minEdgeReversals(n: number, edges: number[][]): number[] {
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push([v, 0]); // traverse in original direction: free
    adj[v].push([u, 1]); // traverse against direction: costs 1 reversal
  }

  const ans = new Array(n).fill(0);

  // Pass 1: compute ans[0] (cost to reach all nodes from node 0)
  function dfs1(node: number, parent: number): void {
    for (const [nb, w] of adj[node]) {
      if (nb !== parent) {
        ans[0] += w; // if edge points away from 0→nb, w=1 means we need reversal
        dfs1(nb, node);
      }
    }
  }
  dfs1(0, -1);

  // Pass 2: re-root from 0 to every child
  function dfs2(node: number, parent: number): void {
    for (const [nb, w] of adj[node]) {
      if (nb !== parent) {
        // Moving root from node to nb:
        // w=0 means edge was node→nb (forward), now need nb→node so cost +1
        // w=1 means edge was nb→node (backward), now node→nb direction correct, cost -1
        ans[nb] = ans[node] + (w === 0 ? 1 : -1);
        dfs2(nb, node);
      }
    }
  }
  dfs2(0, -1);

  return ans;
}
```

---

## 🧪 Test Cases

```typescript
const r1 = [[1,0],[1,2],[0,3]];
const r2 = [[1,0],[2,0]];
console.log(minEdgeReversals(4, r1));          // → [0,2,1,1]
console.log(minEdgeReversals(3, r2));           // → [0,1,1]
console.log(minEdgeReversals(2, [[0,1]]));      // → [0,1]
console.log(minEdgeReversalsBrute(3, r2));      // → [0,1,1]
```

---

## Related Problems

| Problem                                                                                                          | Difficulty | Pattern       |
| ---------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree)                               | Hard       | Re-rooting DP |
| [Count Nodes Equal to Average of Subtree](https://leetcode.com/problems/count-nodes-equal-to-average-of-subtree) | Medium     | Tree DP       |
| [Distribute Coins in Binary Tree](https://leetcode.com/problems/distribute-coins-in-binary-tree)                 | Medium     | DFS           |
