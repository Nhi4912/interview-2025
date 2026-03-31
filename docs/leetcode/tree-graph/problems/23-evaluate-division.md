---
layout: page
title: "Evaluate Division"
difficulty: Medium
category: Tree-Graph
tags: [Array, String, Depth-First Search, Breadth-First Search, Union Find]
leetcode_url: "https://leetcode.com/problems/evaluate-division"
---

# Evaluate Division / Đánh Giá Phép Chia

> **Track**: Tree & Graph | **Difficulty**: 🟡 Medium | **Pattern**: Weighted Graph + DFS/BFS
> **Frequency**: 📗 Tier 2 — Gặp ở 25+ companies (Google, Amazon, Facebook)
> **See also**: [Accounts Merge](https://leetcode.com/problems/accounts-merge) | [Path With Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng các biến số như các thành phố, và mỗi phép chia `a/b = k` là một con đường từ `a` đến `b` với "trọng số" `k` (và con đường ngược `b→a` có trọng số `1/k`). Để tính `a/c`, bạn tìm đường đi `a→b→c` và nhân các trọng số dọc đường.

**Pattern Recognition:**

- Signal: "variable ratios", "transitive division", "find a/c given a/b and b/c" → **Weighted Directed Graph**
- Build adjacency list: `a→b` with weight `k`, `b→a` with weight `1/k`
- Query: DFS/BFS from `src` to `dst`, multiply edge weights along path

**Visual — equations=[a/b=2, b/c=3], query=[a/c]:**

```
Graph:
  a ——(2)——→ b ——(3)——→ c
  a ←—(0.5)— b ←—(1/3)— c

DFS(a → c):
  Visit a, explore neighbor b with weight 2
  Visit b, explore neighbor c with weight 3
  Reach c → accumulated = 2 * 3 = 6 ✅

DFS(x → y) where x not in graph → -1
DFS(a → a) = 1.0 (same node)
```

---

## Problem Description

Given equations in the form `Ai / Bi = ki` and queries `[Cj, Dj]`, return the answers to all queries. If an answer doesn't exist, return `-1.0`. Variables are strings; all given equations are consistent.

```
Example 1: equations=[["a","b"],["b","c"]], values=[2.0,3.0]
           queries=[["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]
           → [6.0, 0.5, -1.0, 1.0, -1.0]
Example 2: equations=[["a","b"]], values=[0.5]
           queries=[["a","b"],["b","a"],["a","c"],["x","y"]]
           → [0.5, 2.0, -1.0, -1.0]
```

Constraints: `1 <= equations.length <= 20`, variable name length 1-5, `0 < values[i] <= 200`

---

## 📝 Interview Tips

1. **Clarify**: "Có `a/a` query không? Biến không xuất hiện trong equations?" / Self-division = 1.0, unknown = -1.0.
2. **Model as graph**: Each equation → 2 directed edges (both directions) in a weighted graph.
3. **DFS**: Multiply weights along path, use visited set to avoid cycles.
4. **BFS**: Queue stores (node, accumulated product) — find when reaching destination.
5. **Union Find**: Store root + ratio to root for each node — O(α) per query after build.
6. **Edge**: src === dst → 1.0 if node exists, else -1.0.

---

## Solutions

```typescript
/**
 * Solution 1: Build Graph + DFS per query
 * Time: O((V+E) * Q) — Q queries, each DFS is O(V+E)
 * Space: O(V+E) — adjacency list
 *
 * V = unique variables, E = 2 * equations.length (bidirectional)
 */
function calcEquation1(equations: string[][], values: number[], queries: string[][]): number[] {
  // Build adjacency list: node → [(neighbor, weight)]
  const graph = new Map<string, [string, number][]>();

  for (let i = 0; i < equations.length; i++) {
    const [a, b] = equations[i];
    const k = values[i];
    if (!graph.has(a)) graph.set(a, []);
    if (!graph.has(b)) graph.set(b, []);
    graph.get(a)!.push([b, k]);
    graph.get(b)!.push([a, 1 / k]);
  }

  function dfs(src: string, dst: string, visited: Set<string>): number {
    if (!graph.has(src)) return -1;
    if (src === dst) return 1;
    visited.add(src);
    for (const [neighbor, weight] of graph.get(src)!) {
      if (!visited.has(neighbor)) {
        const result = dfs(neighbor, dst, visited);
        if (result !== -1) return weight * result;
      }
    }
    return -1;
  }

  return queries.map(([c, d]) => dfs(c, d, new Set()));
}

/**
 * Solution 2: Build Graph + BFS per query
 * Time: O((V+E) * Q)
 * Space: O(V+E + V) — graph + BFS queue
 */
function calcEquation(equations: string[][], values: number[], queries: string[][]): number[] {
  const graph = new Map<string, [string, number][]>();

  for (let i = 0; i < equations.length; i++) {
    const [a, b] = equations[i];
    const k = values[i];
    if (!graph.has(a)) graph.set(a, []);
    if (!graph.has(b)) graph.set(b, []);
    graph.get(a)!.push([b, k]);
    graph.get(b)!.push([a, 1 / k]);
  }

  function bfs(src: string, dst: string): number {
    if (!graph.has(src) || !graph.has(dst)) return -1;
    if (src === dst) return 1;

    const queue: [string, number][] = [[src, 1]];
    const visited = new Set<string>([src]);

    while (queue.length > 0) {
      const [node, product] = queue.shift()!;
      for (const [neighbor, weight] of graph.get(node)!) {
        if (neighbor === dst) return product * weight;
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, product * weight]);
        }
      }
    }
    return -1;
  }

  return queries.map(([c, d]) => bfs(c, d));
}

/**
 * Solution 3: Union Find with weights (ratio to root)
 * Time: O((V+E) * α(V)) build + O(α(V)) per query
 * Space: O(V)
 *
 * Each node stores (root, ratio_to_root).
 * find() path-compresses and accumulates ratios.
 * union() merges two components maintaining ratio consistency.
 */
function calcEquationUF(equations: string[][], values: number[], queries: string[][]): number[] {
  const parent = new Map<string, string>();
  const ratio = new Map<string, number>(); // node → ratio to parent

  function find(x: string): [string, number] {
    if (!parent.has(x)) return [x, 1];
    const [root, r] = find(parent.get(x)!);
    parent.set(x, root);
    ratio.set(x, (ratio.get(x) ?? 1) * r);
    return [root, ratio.get(x)!];
  }

  function union(a: string, b: string, k: number): void {
    if (!parent.has(a)) {
      parent.set(a, a);
      ratio.set(a, 1);
    }
    if (!parent.has(b)) {
      parent.set(b, b);
      ratio.set(b, 1);
    }
    const [ra, ka] = find(a);
    const [rb, kb] = find(b);
    if (ra !== rb) {
      parent.set(ra, rb);
      ratio.set(ra, (k * kb) / ka);
    }
  }

  for (let i = 0; i < equations.length; i++) {
    union(equations[i][0], equations[i][1], values[i]);
  }

  return queries.map(([c, d]) => {
    if (!parent.has(c) || !parent.has(d)) return -1;
    const [rc, kc] = find(c);
    const [rd, kd] = find(d);
    if (rc !== rd) return -1;
    return kc / kd;
  });
}

// === Test Cases ===
const eq1 = [
    ["a", "b"],
    ["b", "c"],
  ],
  v1 = [2.0, 3.0];
const q1 = [
  ["a", "c"],
  ["b", "a"],
  ["a", "e"],
  ["a", "a"],
  ["x", "x"],
];
console.log(calcEquation(eq1, v1, q1)); // [6.0, 0.5, -1.0, 1.0, -1.0]
console.log(calcEquation1(eq1, v1, q1)); // [6.0, 0.5, -1.0, 1.0, -1.0]
console.log(calcEquationUF(eq1, v1, q1)); // [6.0, 0.5, -1.0, 1.0, -1.0]

const eq2 = [["a", "b"]],
  v2 = [0.5];
const q2 = [
  ["a", "b"],
  ["b", "a"],
  ["a", "c"],
  ["x", "y"],
];
console.log(calcEquation(eq2, v2, q2)); // [0.5, 2.0, -1.0, -1.0]
```

---

## 🔗 Related Problems

| Problem                                                                                                                                                                 | Relationship                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| [399. Evaluate Division](https://leetcode.com/problems/evaluate-division/)                                                                                              | This problem                     |
| [684. Redundant Connection](https://leetcode.com/problems/redundant-connection/)                                                                                        | Union Find on undirected graph   |
| [721. Accounts Merge](https://leetcode.com/problems/accounts-merge/)                                                                                                    | Union Find to merge components   |
| [1334. Find the City With the Smallest Number of Neighbors](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/) | Weighted graph shortest path     |
| [1631. Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/)                                                                               | Weighted graph path optimization |
