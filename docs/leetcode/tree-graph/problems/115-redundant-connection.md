---
layout: page
title: "Redundant Connection"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/redundant-connection"
---

# Redundant Connection / Kết Nối Thừa

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Evaluate Division](https://leetcode.com/problems/evaluate-division) | [Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng bạn xây dựng mạng lưới từng bước: thêm từng cạnh vào. Ban đầu mỗi người trong nhóm riêng. Khi nối hai người **chưa cùng nhóm** → nhóm gộp lại (Union). Khi nối hai người **đã cùng nhóm** → cạnh đó tạo cycle, chính là "redundant connection"! Union Find phát hiện điều này trong O(α(n)) ≈ O(1) mỗi thao tác.

**Pattern Recognition:**

- Signal: "detect cycle in undirected graph" + "which edge creates cycle" → **Union Find**
- Duyệt tuần tự, `union(u,v)` trả `false` khi `find(u)==find(v)` → đó là cạnh thừa
- DFS/BFS cũng đúng nhưng Union Find O(n·α(n)) tối ưu hơn

**Visual — Union Find Cycle Detection:**

```
edges = [[1,2],[1,3],[2,3]]
Initial parent: [0,1,2,3]  (each node is its own root)

Process [1,2]: find(1)=1, find(2)=2 → different → union
  parent: [0,1,1,3]  (2 → 1)

Process [1,3]: find(1)=1, find(3)=3 → different → union
  parent: [0,1,1,1]  (3 → 1)

Process [2,3]: find(2)=find(1)=1, find(3)=find(1)=1
  Same root! → cycle → return [2,3] ✓

Path compression (find):
  find(2): parent[2]=1, parent[1]=1 → return 1
  find(3): parent[3]=1, parent[1]=1 → return 1
```

---

## Problem Description

Given a tree with `n` nodes (labeled `1..n`) plus **one extra edge** that creates a cycle. Return the **redundant edge** — remove it and the graph is a valid tree again. If multiple valid answers exist, return the last one in input order.

- `n == edges.length`, `3 ≤ n ≤ 1000`, edges form a graph with exactly one cycle

```
Example 1: edges=[[1,2],[1,3],[2,3]] → [2,3]
  Remove [2,3]: tree 1–2, 1–3 ✓

Example 2: edges=[[1,2],[2,3],[3,4],[1,4],[1,5]] → [1,4]
  Remove [1,4]: tree 1–2–3–4, 1–5 ✓
```

---

## 📝 Interview Tips

1. **Union Find vs DFS** — Union Find O(n·α(n)) optimal; DFS O(n²) simpler to explain / _Both correct; Union Find faster asymptotically, DFS easier to implement from scratch_
2. **Path compression** — `parent[x] = find(parent[x])` flattens tree, gần O(1) per call / _Path compression makes each find near-constant amortized_
3. **Union by rank** — Luôn gắn cây nhỏ dưới cây lớn để tránh chain thoái hóa / _Attach smaller tree under larger to prevent O(n) chains_
4. **1-indexed** — Nodes từ 1..n → cần parent array kích thước n+1 / _Nodes are 1-indexed — allocate parent array of size n+1_
5. **Return first cycle edge** — Duyệt tuần tự, cạnh đầu tiên khiến `find(u)==find(v)` là đáp án / _The first edge where find(u)==find(v) is the answer — it's also the last in tree-building order_
6. **Follow-up** — Bài có directed graph version: LC 685 Redundant Connection II / _Directed version (LC 685) is harder — handles nodes with in-degree 2_

---

## Solutions

```typescript
/**
 * Solution 1: DFS Cycle Detection
 * Time: O(n²) — DFS for each edge in worst case
 * Space: O(n + E) — adjacency list + visited
 * Build graph incrementally; before adding edge, check if path already exists.
 */
function findRedundantConnectionDFS(edges: number[][]): number[] {
  const n = edges.length;
  const graph: number[][] = Array.from({ length: n + 1 }, () => []);

  function hasPath(src: number, dest: number, visited: Set<number>): boolean {
    if (src === dest) return true;
    visited.add(src);
    for (const nb of graph[src]) {
      if (!visited.has(nb) && hasPath(nb, dest, visited)) return true;
    }
    return false;
  }

  for (const [u, v] of edges) {
    if (hasPath(u, v, new Set())) return [u, v]; // cycle found before adding
    graph[u].push(v);
    graph[v].push(u);
  }
  return [];
}

/**
 * Solution 2: Union Find with Path Compression + Union by Rank
 * Time: O(n · α(n)) ≈ O(n) — inverse Ackermann is near-constant
 * Space: O(n)
 * Optimal: each edge processed in near-O(1), return first edge creating a cycle.
 */
function findRedundantConnection(edges: number[][]): number[] {
  const n = edges.length;
  const parent = Array.from({ length: n + 1 }, (_, i) => i);
  const rank = new Array(n + 1).fill(0);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]); // path compression
    return parent[x];
  }

  function union(x: number, y: number): boolean {
    const px = find(x),
      py = find(y);
    if (px === py) return false; // same component → cycle!
    if (rank[px] < rank[py]) parent[px] = py;
    else if (rank[px] > rank[py]) parent[py] = px;
    else {
      parent[py] = px;
      rank[px]++;
    }
    return true;
  }

  for (const [u, v] of edges) {
    if (!union(u, v)) return [u, v]; // first edge creating cycle = redundant
  }
  return [];
}

// === Test Cases ===
console.log(
  JSON.stringify(
    findRedundantConnection([
      [1, 2],
      [1, 3],
      [2, 3],
    ]),
  ),
); // [2,3]
console.log(
  JSON.stringify(
    findRedundantConnection([
      [1, 2],
      [2, 3],
      [3, 4],
      [1, 4],
      [1, 5],
    ]),
  ),
); // [1,4]
console.log(
  JSON.stringify(
    findRedundantConnection([
      [1, 2],
      [2, 3],
      [1, 3],
    ]),
  ),
); // [1,3]

console.log(
  JSON.stringify(
    findRedundantConnectionDFS([
      [1, 2],
      [1, 3],
      [2, 3],
    ]),
  ),
); // [2,3]
console.log(
  JSON.stringify(
    findRedundantConnectionDFS([
      [1, 2],
      [2, 3],
      [3, 4],
      [1, 4],
      [1, 5],
    ]),
  ),
); // [1,4]
```

---

## 🔗 Related Problems

| Problem                                                                                                               | Pattern                     | Difficulty |
| --------------------------------------------------------------------------------------------------------------------- | --------------------------- | ---------- |
| [Redundant Connection II](https://leetcode.com/problems/redundant-connection-ii)                                      | Union Find (directed graph) | Hard       |
| [Number of Connected Components](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph) | Union Find                  | Medium     |
| [Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree)                                                    | Union Find                  | Medium     |
| [Accounts Merge](https://leetcode.com/problems/accounts-merge)                                                        | Union Find                  | Medium     |
