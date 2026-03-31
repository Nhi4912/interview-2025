---
layout: page
title: "Possible Bipartition"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/possible-bipartition"
---

# Possible Bipartition / Phân Chia Hai Nhóm Khả Thi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Evaluate Division](https://leetcode.com/problems/evaluate-division) | [Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chia đội cho buổi tiệc — A ghét B thì phải ở nhóm khác nhau. Nếu A ghét B và B ghét C, thì A và C cùng nhóm. Nhưng nếu A cũng ghét C → vô lý → không thể chia được (odd cycle).

**Pattern Recognition:**

- Signal: "split into 2 groups where enemies must be separate" → **Graph Bipartite Check**
- BFS/DFS 2-coloring: color = group (0 or 1); if neighbor has same color → return false
- Key insight: Problem = "Is the conflict graph bipartite?" (no odd-length cycles)

**Visual — Graph coloring step-by-step:**

```
n=4, dislikes=[[1,2],[1,3],[2,4]]

Graph: 1--2--4
        \
         3

BFS from 1 (color=0):
  color[1]=0 → neighbors 2,3 → color[2]=1, color[3]=1
  color[2]=1 → neighbor 4 → color[4]=0
  color[4]=0 → no uncolored neighbors

No conflict! → true  (group A: {1,4}, group B: {2,3})
```

---

## Problem Description

Given `n` people labeled `1..n` and a list of `dislikes` pairs (person A and B dislike each other), determine if it's possible to split everyone into two groups such that no two people who dislike each other are in the same group.

- Example 1: `n=4, dislikes=[[1,2],[1,3],[2,4]]` → `true` (group {1,4} and {2,3})
- Example 2: `n=3, dislikes=[[1,2],[1,3],[2,3]]` → `false` (triangle = odd cycle, can't 2-color)

Constraints: `1 <= n <= 2000`, `0 <= dislikes.length <= 10^4`.

---

## 📝 Interview Tips

1. **Clarify**: "Dislike quan hệ là 2 chiều? Graph undirected?" / Dislikes are symmetric → undirected graph
2. **Reframe**: "Bipartite = có thể 2-color graph không? Odd cycle → không thể" / Problem is exactly graph bipartite check
3. **BFS coloring**: "Assign color 0/1, nếu neighbor cùng color → return false" / BFS is clean and easy to explain
4. **Union Find alt**: "Group enemies với nhau via `union(dislikeA, dislikeB)` — check root collisions" / UF: union neighbors together, if same root as node → conflict
5. **Edge cases**: "Người không có ai ghét → luôn ok. Isolated nodes → assign any group" / Isolated nodes are always fine
6. **Follow-up**: "K-partite partition? NP-hard for K≥3, greedy coloring approximation" / 3-coloring is NP-hard

---

## Solutions

```typescript
/**
 * Solution 1: BFS Graph Coloring — 2-color the conflict graph
 * Time: O(N + E) — visit all nodes and edges once
 * Space: O(N + E) — adjacency list + color array
 */
function possibleBipartitionBFS(n: number, dislikes: number[][]): boolean {
  const adj: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [a, b] of dislikes) {
    adj[a].push(b);
    adj[b].push(a);
  }

  const color = new Array<number>(n + 1).fill(-1);

  for (let start = 1; start <= n; start++) {
    if (color[start] !== -1) continue;
    color[start] = 0;
    const queue: number[] = [start];
    while (queue.length > 0) {
      const node = queue.shift()!;
      for (const neighbor of adj[node]) {
        if (color[neighbor] === -1) {
          color[neighbor] = 1 - color[node];
          queue.push(neighbor);
        } else if (color[neighbor] === color[node]) {
          return false; // same group conflict
        }
      }
    }
  }

  return true;
}

/**
 * Solution 2: Union Find — group enemies together, detect contradiction
 * For each node, all its enemies should be in one group (union them together).
 * If a node and its enemy share the same root → impossible.
 * Time: O((N + E) * α(N)) ≈ O(N + E)
 * Space: O(N) — parent array
 */
function possibleBipartition(n: number, dislikes: number[][]): boolean {
  const adj: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [a, b] of dislikes) {
    adj[a].push(b);
    adj[b].push(a);
  }

  const parent: number[] = Array.from({ length: n + 1 }, (_, i) => i);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(a: number, b: number): void {
    parent[find(a)] = find(b);
  }

  for (let node = 1; node <= n; node++) {
    for (const enemy of adj[node]) {
      // node and enemy must be in different groups
      // so all enemies of node are in the same group
      if (find(node) === find(enemy)) return false;
      union(adj[node][0], enemy);
    }
  }

  return true;
}

// === Test Cases ===
console.log(
  possibleBipartitionBFS(4, [
    [1, 2],
    [1, 3],
    [2, 4],
  ]),
); // true
console.log(
  possibleBipartitionBFS(3, [
    [1, 2],
    [1, 3],
    [2, 3],
  ]),
); // false (triangle)
console.log(
  possibleBipartitionBFS(5, [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [1, 5],
  ]),
); // false (odd cycle)
console.log(possibleBipartitionBFS(4, [])); // true (no constraints)
```

---

## 🔗 Related Problems

- [Is Graph Bipartite?](https://leetcode.com/problems/is-graph-bipartite) — same problem, direct bipartite check on adjacency list
- [Number of Provinces](https://leetcode.com/problems/number-of-provinces) — Union Find connected components
- [Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree) — Union Find cycle detection
- [Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected) — connected components with Union Find
