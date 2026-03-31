---
layout: page
title: "Graph Valid Tree"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/graph-valid-tree"
---

# Graph Valid Tree / Đồ Thị Hợp Lệ Là Cây

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Evaluate Division](https://leetcode.com/problems/evaluate-division) | [Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như kiểm tra cây gia phả — một cây hợp lệ phải: (1) không có vòng lặp và (2) mọi người đều kết nối. Tương tự, graph là cây khi có đúng `n-1` edges và tất cả nodes liên thông.

**Pattern Recognition:**

- Signal: "is this a valid tree?" → **2 conditions**: `edges == n-1` AND `fully connected`
- Union Find: với mỗi edge, nếu 2 đỉnh đã cùng component → có cycle → không phải cây
- Hoặc DFS: đếm edges và kiểm tra visited count

**Visual:**

```
n=5, edges=[[0,1],[0,2],[0,3],[1,4]] → Valid Tree ✓
    0
   /|\
  1 2 3
  |
  4
edges=4 == n-1=4, all 5 nodes reachable

n=5, edges=[[0,1],[1,2],[2,3],[1,3],[1,4]] → Invalid ✗
  cycle: 1-2-3-1
```

---

## Problem Description

Given `n` nodes labeled `0` to `n-1` and a list of undirected `edges`, return `true` if the graph forms a valid tree. A valid tree has no cycles and all nodes are connected (i.e., exactly `n-1` edges with full connectivity).

**Example 1:** `n=5, edges=[[0,1],[0,2],[0,3],[1,4]]` → `true`
**Example 2:** `n=5, edges=[[0,1],[1,2],[2,3],[1,3],[1,4]]` → `false` (cycle exists)

Constraints: `1 <= n <= 2000`, `0 <= edges.length <= 5000`, edges are unique, no self-loops.

---

## 📝 Interview Tips

1. **Key insight**: "Cây ↔ n-1 edges + connected — kiểm tra 2 điều kiện này" / Tree = n-1 edges AND connected; check both
2. **Early exit**: "Nếu edges.length !== n-1 → return false ngay" / Quick reject if edge count is wrong
3. **Union Find**: "Khi union 2 nodes đã cùng root → cycle → false" / Union Find detects cycle on same-component merge
4. **DFS alt**: "DFS từ node 0, đếm visited nodes — nếu < n thì không connected" / DFS can also work: count reachable nodes
5. **Edge cases**: "n=1, edges=[] → true (single node is valid tree)" / Single node with no edges is valid
6. **Follow-up**: "Nếu directed graph? Directed acyclic + single root?" / Directed version requires topological sort + in-degree check

---

## Solutions

```typescript
/**
 * Solution 1: Union Find with path compression + union by rank
 * Time: O(N · α(N)) ≈ O(N) — α is inverse Ackermann
 * Space: O(N) — parent and rank arrays
 */
function validTreeUnionFind(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false; // quick check

  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]); // path compression
    return parent[x];
  }

  function union(a: number, b: number): boolean {
    const ra = find(a),
      rb = find(b);
    if (ra === rb) return false; // cycle detected
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else {
      parent[rb] = ra;
      rank[ra]++;
    }
    return true;
  }

  for (const [u, v] of edges) {
    if (!union(u, v)) return false;
  }
  return true;
}

/**
 * Solution 2: DFS reachability check
 * Time: O(N + E) — build adjacency list + DFS
 * Space: O(N + E) — graph + visited set
 */
function validTree(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false;

  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const visited = new Set<number>();
  const stack = [0];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (visited.has(node)) continue;
    visited.add(node);
    for (const nb of graph[node]) stack.push(nb);
  }
  return visited.size === n;
}

// === Test Cases ===
console.log(
  validTree(5, [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 4],
  ]),
); // true
console.log(
  validTree(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [1, 3],
    [1, 4],
  ]),
); // false
console.log(validTree(1, [])); // true
console.log(validTree(2, [[0, 1]])); // true
```

---

## 🔗 Related Problems

| Problem                                                                                                                        | Pattern          | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ---------- |
| [Number of Provinces](https://leetcode.com/problems/number-of-provinces)                                                       | Union Find       | 🟡 Medium  |
| [Redundant Connection](https://leetcode.com/problems/redundant-connection)                                                     | Union Find cycle | 🟡 Medium  |
| [Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected) | Union Find       | 🟡 Medium  |
| [Possible Bipartition](https://leetcode.com/problems/possible-bipartition)                                                     | BFS bipartite    | 🟡 Medium  |
| [Minimum Spanning Tree (Kruskal)](https://leetcode.com/problems/connecting-cities-with-minimum-cost)                           | Union Find       | 🟡 Medium  |
