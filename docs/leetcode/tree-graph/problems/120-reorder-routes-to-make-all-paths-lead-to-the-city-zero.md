---
layout: page
title: "Reorder Routes to Make All Paths Lead to the City Zero"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero"
---

# Reorder Routes to Make All Paths Lead to the City Zero / Sắp Xếp Lại Đường Về Thành Phố 0

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS/DFS from Root (Edge Direction)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule) | [Evaluate Division](https://leetcode.com/problems/evaluate-division)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hình dung n thành phố kết nối như một cây có gốc. Mục tiêu: tất cả đường đi phải "về" node 0. BFS từ node 0 ra ngoài: nếu gặp cạnh **đi ra xa** 0 (theo hướng gốc), thì đó là cạnh cần đảo chiều (cost +1). Nếu cạnh **đã hướng về** 0, không cần làm gì (cost 0).

**Pattern Recognition:**

- Signal: "tree graph + directed edges + all paths to root" → **BFS/DFS from root, count wrong-direction edges**
- Key: BFS từ 0, khi traverse edge `node→next`: nếu original direction là `node→next` thì cạnh đang hướng đi xa 0 → cần reverse
- Encode undirected graph: cạnh gốc `(u,v)` với tag `1` (cần reverse khi đi theo hướng này), cạnh ngược `(v,u)` với tag `0`

**Visual — BFS Edge Direction:**

```
n=6, connections=[[0,1],[1,3],[2,3],[4,0],[4,5]]

Original directed: 0→1, 1→3, 2→3, 4→0, 4→5
Goal: all cities → 0

Build undirected graph with direction tags:
  0: [(1,cost=1), (4,cost=0)]   → 1 means "this is original direction → need reverse when going away from 0"
  1: [(0,cost=0), (3,cost=1)]
  ...

BFS from 0:
  0 → 1 (tag=1, reverse needed): result+=1 → visit 1
  0 → 4 (tag=0, already toward 0): result+=0 → visit 4
  1 → 3 (tag=1): result+=1 → visit 3
  4 → 5 (tag=1): result+=1 → visit 5
  3 → 2 (tag=0, 2→3 was original): result+=0 → visit 2

Total = 3 ✓
```

---

## Problem Description

`n` cities (0 to n-1) connected by `n-1` **directed roads** forming a tree (undirected). Reorder the **minimum number of roads** so that every city can reach city 0. Return that minimum count.

- `2 ≤ n ≤ 5×10^4`, `connections[i] = [a_i, b_i]` (directed road from a_i to b_i)

```
Example 1: n=6, connections=[[0,1],[1,3],[2,3],[4,0],[4,5]] → 3
  Reverse: [0,1]→[1,0], [1,3]→[3,1], [4,5]→[5,4]
  New: 1→0, 3→1, 3→2, 4→0, 5→4 → all reach 0 ✓

Example 2: n=5, connections=[[1,0],[1,2],[3,2],[3,4]] → 2
  Reverse [1,2] and [3,4]
```

---

## 📝 Interview Tips

1. **Edge encoding trick** — Lưu cả cạnh gốc (cost=1) và cạnh ngược (cost=0) trong adjacency list để BFS không biết hướng gốc / _Store original edge with cost=1 and reverse with cost=0 — BFS determines direction implicitly_
2. **BFS from 0** — Sóng lan từ 0 ra; mỗi edge đi "ra" (original direction, away from 0) cần reverse / _BFS from root 0; each edge traversed in original direction (away from 0) needs reversal_
3. **DFS equally valid** — DFS cũng cho kết quả đúng, cùng logic; BFS thường dễ visualize hơn / _DFS works equally well — BFS is easier to reason about level by level_
4. **Tree structure** — Vì là cây (n-1 edges, connected), không cần xử lý cycle / _Tree structure guarantees no cycles — BFS visits each node exactly once_
5. **Complexity** — O(n) time và space / _O(n) — linear, each edge visited twice (original + reverse)_
6. **Edge case** — n=2: 1 edge, answer is 0 hoặc 1 tuỳ hướng / _n=2: answer is 0 if road points toward 0, else 1_

---

## Solutions

```typescript
/**
 * Solution 1: BFS from Node 0 with Direction Tags
 * Time: O(n) — BFS visits each node/edge once
 * Space: O(n) — adjacency list + visited array
 *
 * Key insight: build undirected graph with edge tags.
 * Original edge (u→v): store (v, cost=1) in adj[u] and (u, cost=0) in adj[v].
 * BFS from 0: when we traverse (node → next) with cost=1, need reversal.
 */
function minReorder(n: number, connections: number[][]): number {
  // adj[u] = [(neighbor, cost)] where cost=1 means "original direction" (needs reversal)
  const adj: [number, number][][] = Array.from({ length: n }, () => []);

  for (const [u, v] of connections) {
    adj[u].push([v, 1]); // original: u→v, going away from 0 costs 1 reversal
    adj[v].push([u, 0]); // reverse: v→u, going toward 0 costs 0
  }

  const visited = new Array(n).fill(false);
  const queue: number[] = [0];
  visited[0] = true;
  let result = 0;

  while (queue.length > 0) {
    const node = queue.shift()!;
    for (const [next, cost] of adj[node]) {
      if (!visited[next]) {
        visited[next] = true;
        result += cost; // cost=1 means this edge points away from 0 → reverse it
        queue.push(next);
      }
    }
  }
  return result;
}

/**
 * Solution 2: DFS — same logic, recursive
 * Time: O(n), Space: O(n) — recursion stack
 */
function minReorderDFS(n: number, connections: number[][]): number {
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v] of connections) {
    adj[u].push([v, 1]);
    adj[v].push([u, 0]);
  }

  const visited = new Array(n).fill(false);
  let result = 0;

  function dfs(node: number): void {
    visited[node] = true;
    for (const [next, cost] of adj[node]) {
      if (!visited[next]) {
        result += cost;
        dfs(next);
      }
    }
  }

  dfs(0);
  return result;
}

// === Test Cases ===
console.log(
  minReorder(6, [
    [0, 1],
    [1, 3],
    [2, 3],
    [4, 0],
    [4, 5],
  ]),
); // 3
console.log(
  minReorder(5, [
    [1, 0],
    [1, 2],
    [3, 2],
    [3, 4],
  ]),
); // 2
console.log(
  minReorder(3, [
    [1, 0],
    [2, 0],
  ]),
); // 0  (both already → 0)
console.log(
  minReorder(3, [
    [0, 1],
    [0, 2],
  ]),
); // 2  (both need reversal)

console.log(
  minReorderDFS(6, [
    [0, 1],
    [1, 3],
    [2, 3],
    [4, 0],
    [4, 5],
  ]),
); // 3
console.log(
  minReorderDFS(5, [
    [1, 0],
    [1, 2],
    [3, 2],
    [3, 4],
  ]),
); // 2
```

---

## 🔗 Related Problems

| Problem                                                                            | Pattern                 | Difficulty |
| ---------------------------------------------------------------------------------- | ----------------------- | ---------- |
| [Course Schedule](https://leetcode.com/problems/course-schedule)                   | Topological Sort        | Medium     |
| [Clone Graph](https://leetcode.com/problems/clone-graph)                           | BFS/DFS graph traversal | Medium     |
| [Number of Islands](https://leetcode.com/problems/number-of-islands)               | BFS/DFS grid            | Medium     |
| [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree) | DFS re-rooting          | Hard       |
