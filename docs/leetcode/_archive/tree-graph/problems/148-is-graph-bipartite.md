---
layout: page
title: "Is Graph Bipartite?"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/is-graph-bipartite"
---

# Is Graph Bipartite? / Đồ Thị Có Hai Phần Không?

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS/DFS 2-Coloring
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Possible Bipartition](https://leetcode.com/problems/possible-bipartition) | [Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy (VI):** Như chia học sinh vào hai đội — nếu hai người là bạn thì phải ở đội khác nhau. BFS/DFS tô màu: nếu hàng xóm cùng màu → không chia được.

**Analogy (EN):** Try to 2-color the graph. BFS/DFS: assign color 0 to start node, color 1 to all its neighbors. If a neighbor already has the same color → not bipartite.

```
Graph: 1─2─3─4─1  (cycle of 4 → bipartite)
Color: 0 1 0 1

   1(0) ── 2(1)
   │            │
   4(1) ── 3(0)   ✅ alternating colors

Odd-cycle: 1─2─3─1 → NOT bipartite
   1(0) ── 2(1) ── 3(?) same as 1 → conflict ❌
```

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Graph có thể không liên thông không?" / Graph may be disconnected — must check all components
2. **Pattern / Nhận dạng**: "Chia 2 nhóm, không conflict" → 2-coloring = bipartite check
3. **Edge case / Biên**: Node cô lập (không cạnh nào) vẫn là bipartite / Isolated nodes are always ok
4. **BFS vs DFS**: Cả hai đều OK — BFS dễ tránh stack overflow hơn / Both work; BFS avoids deep recursion
5. **Union Find alt / Cách khác**: Với mỗi node u, union tất cả neighbors của u với nhau; nếu u và neighbor cùng set → false
6. **Follow-up**: "Nếu graph có hướng?" → same logic, color by edge direction / Directed graph same idea

---

## Solutions

```typescript
/**
 * Solution 1: BFS 2-Coloring
 * Time: O(V + E) — visit each node and edge once
 * Space: O(V) — color array + queue
 *
 * Tô màu BFS: bắt đầu từ mỗi node chưa tô, gán màu xen kẽ.
 * Nếu hàng xóm cùng màu → return false.
 */
function isBipartiteBFS(graph: number[][]): boolean {
  const n = graph.length;
  const color = new Array(n).fill(-1); // -1 = unvisited

  for (let start = 0; start < n; start++) {
    if (color[start] !== -1) continue; // already colored
    const queue: number[] = [start];
    color[start] = 0;

    while (queue.length > 0) {
      const node = queue.shift()!;
      for (const neighbor of graph[node]) {
        if (color[neighbor] === -1) {
          color[neighbor] = 1 - color[node]; // flip color
          queue.push(neighbor);
        } else if (color[neighbor] === color[node]) {
          return false; // same color conflict
        }
      }
    }
  }
  return true;
}

/**
 * Solution 2: DFS 2-Coloring (recursive)
 * Time: O(V + E) — visit each node and edge once
 * Space: O(V) — color array + recursion stack
 *
 * DFS tô màu đệ quy — cùng logic nhưng dùng call stack.
 */
function isBipartite(graph: number[][]): boolean {
  const n = graph.length;
  const color = new Array(n).fill(-1);

  function dfs(node: number, c: number): boolean {
    color[node] = c;
    for (const neighbor of graph[node]) {
      if (color[neighbor] === -1) {
        if (!dfs(neighbor, 1 - c)) return false;
      } else if (color[neighbor] === c) {
        return false;
      }
    }
    return true;
  }

  for (let i = 0; i < n; i++) {
    if (color[i] === -1 && !dfs(i, 0)) return false;
  }
  return true;
}

/**
 * Solution 3: Union Find
 * Time: O(V + E · α(V)) — near linear with path compression
 * Space: O(V) — parent array
 *
 * Với mỗi node u, union tất cả neighbors của u với nhau.
 * Nếu u và bất kỳ neighbor nào cùng set → not bipartite.
 */
function isBipartiteUF(graph: number[][]): boolean {
  const n = graph.length;
  const parent = Array.from({ length: n }, (_, i) => i);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(a: number, b: number): void {
    parent[find(a)] = find(b);
  }

  for (let u = 0; u < n; u++) {
    if (graph[u].length === 0) continue;
    for (const v of graph[u]) {
      if (find(u) === find(v)) return false; // u and v in same set
      union(graph[u][0], v); // union all neighbors of u together
    }
  }
  return true;
}

// === Test Cases ===
console.log(
  isBipartite([
    [1, 3],
    [0, 2],
    [1, 3],
    [0, 2],
  ]),
); // true  (4-cycle)
console.log(
  isBipartite([
    [1, 2, 3],
    [0, 2],
    [0, 1, 3],
    [0, 2],
  ]),
); // false (odd cycle)
console.log(isBipartite([[]])); // true  (isolated node)
console.log(
  isBipartiteBFS([
    [1, 3],
    [0, 2],
    [1, 3],
    [0, 2],
  ]),
); // true
console.log(
  isBipartiteUF([
    [1, 3],
    [0, 2],
    [1, 3],
    [0, 2],
  ]),
); // true
```

---

## 🔗 Related Problems

| Problem                                                                    | Pattern        | Difficulty |
| -------------------------------------------------------------------------- | -------------- | ---------- |
| [Possible Bipartition](https://leetcode.com/problems/possible-bipartition) | 2-Coloring     | 🟡 Medium  |
| [Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree)         | Union Find     | 🟡 Medium  |
| [Evaluate Division](https://leetcode.com/problems/evaluate-division)       | Weighted Graph | 🟡 Medium  |
| [Accounts Merge](https://leetcode.com/problems/accounts-merge)             | Union Find     | 🟡 Medium  |
