---
layout: page
title: "All Ancestors of a Node in a Directed Acyclic Graph"
difficulty: Medium
category: Tree & Graph
tags: [Depth-First Search, Breadth-First Search, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph"
---

# All Ancestors of a Node in a DAG / Tất Cả Tổ Tiên Trong Đồ Thị Có Hướng Không Chu Trình

> **Track**: Tree & Graph | **Difficulty**: 🟡 Medium | **Pattern**: Topological Sort / DFS on Reverse Graph
> **Frequency**: 📗 Tier 2 — Gặp ở Google, Amazon
> **See also**: [Course Schedule II](https://leetcode.com/problems/course-schedule-ii) | [Closest Ancestor in a DAG](https://leetcode.com/problems/closest-node-to-path-in-tree)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy tưởng tượng hệ thống phân cấp công ty: mỗi nhân viên có những người quản lý trực tiếp hoặc gián tiếp (tổ tiên). Cho danh sách các cặp "A quản lý B", hãy tìm tất cả người quản lý của từng người. Bí quyết: đảo ngược quan hệ (từ B→A thành A→B), rồi với mỗi node khởi phát DFS, đánh dấu "node này là tổ tiên của tất cả descendants" — cách này tránh phải tìm kiếm từ mỗi node.

## Visual (Minh họa trực quan)

```
n=8, edges: 0→3, 0→4, 1→3, 2→4, 2→7, 3→5, 3→6, 3→7, 4→6

Approach: For each node u, DFS to find all descendants, mark u as ancestor
  DFS from 0: reaches 3,4,5,6,7 → add 0 to ancestors[3,4,5,6,7]
  DFS from 1: reaches 3,5,6,7   → add 1 to ancestors[3,5,6,7]
  DFS from 2: reaches 4,6,7     → add 2 to ancestors[4,6,7]
  DFS from 3: reaches 5,6,7     → add 3 to ancestors[5,6,7]
  DFS from 4: reaches 6         → add 4 to ancestors[6]

Result (sorted): [[], [], [], [0,1], [0,2], [0,1,3], [0,1,2,3,4], [0,1,2,3]]
```

## Problem (Bài toán)

Given a DAG with `n` nodes (0-indexed) and a list of `edges` (directed), find all ancestors of each node. Return a list `answer` where `answer[i]` is the **sorted** list of all ancestor node indices of node `i`. An ancestor of node `v` is any node `u` such that there exists a directed path from `u` to `v`.

**Example 1:** `n=8, edges=[[0,3],[0,4],[1,3],[2,4],[2,7],[3,5],[3,6],[3,7],[4,6]]`
→ `[[],[],[],[0,1],[0,2],[0,1,3],[0,1,2,3,4],[0,1,2,3]]`

**Example 2:** `n=5, edges=[[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]`
→ `[[],[0],[0,1],[0,1,2],[0,1,2,3]]`

**Constraints:** `1 ≤ n ≤ 1000`, `0 ≤ edges.length ≤ min(2000, n*(n-1)/2)`, no duplicate edges

## Tips (Mẹo phỏng vấn)

- **DFS from each source** / DFS từ mỗi nguồn: Với mỗi node `u` là nguồn (outgoing edges), DFS xuôi chiều và đánh dấu `u` là tổ tiên của mọi node đến được
- **Sort guaranteed** / Đảm bảo thứ tự: Nếu duyệt u từ 0 → n-1 và mỗi u append vào descendants, kết quả tự động được sắp xếp
- **Topological + DP alternative** / Topo + DP: Dùng topological order, mỗi node kế thừa tập ancestor từ cha — dùng Set để deduplicate
- **DFS visited per source** / Visited riêng mỗi nguồn: Mỗi lần DFS từ u cần visited[] riêng để tránh nhầm
- **O(n²) is acceptable** / O(n²) chấp nhận được: n≤1000 nên O(n*(n+e)) ≈ O(n²+n*e) là fine
- **Use Set for dedup** / Dùng Set khử trùng: Topological approach cần Set vì có thể thêm cùng ancestor nhiều lần

## Solution 1 - DFS from Each Node

```typescript
/**
 * @complexity Time: O(n*(n+e)) | Space: O(n²) output
 * For each source node, DFS and mark it as ancestor of all reachable nodes
 */
function getAncestors(n: number, edges: number[][]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adj[u].push(v);
  const ancestors: number[][] = Array.from({ length: n }, () => []);

  function dfs(src: number, cur: number, visited: boolean[]): void {
    for (const nb of adj[cur]) {
      if (!visited[nb]) {
        visited[nb] = true;
        ancestors[nb].push(src); // src is ancestor of nb
        dfs(src, nb, visited);
      }
    }
  }

  for (let u = 0; u < n; u++) {
    const visited = new Array(n).fill(false);
    visited[u] = true;
    dfs(u, u, visited);
  }

  return ancestors; // already sorted because u goes 0..n-1
}
```

## Solution 2 - Topological Sort + Set Propagation (Optimal)

```typescript
/**
 * @complexity Time: O(n²) | Space: O(n²)
 * Toposort; each node inherits ancestors from all its parents via Set union
 */
function getAncestorsTopoSort(n: number, edges: number[][]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  const radj: number[][] = Array.from({ length: n }, () => []);
  const indegree = new Int32Array(n);

  for (const [u, v] of edges) {
    adj[u].push(v);
    radj[v].push(u);
    indegree[v]++;
  }

  const ancSets: Set<number>[] = Array.from({ length: n }, () => new Set());
  const queue: number[] = [];
  for (let i = 0; i < n; i++) if (indegree[i] === 0) queue.push(i);

  while (queue.length) {
    const u = queue.shift()!;
    for (const v of adj[u]) {
      // v inherits all of u's ancestors plus u itself
      ancSets[u].forEach((a) => ancSets[v].add(a));
      ancSets[v].add(u);
      if (--indegree[v] === 0) queue.push(v);
    }
  }

  return ancSets.map((s) => [...s].sort((a, b) => a - b));
}
```

## Test Cases

```typescript
console.log(
  getAncestors(8, [
    [0, 3],
    [0, 4],
    [1, 3],
    [2, 4],
    [2, 7],
    [3, 5],
    [3, 6],
    [3, 7],
    [4, 6],
  ]),
);
// → [[],[],[],[0,1],[0,2],[0,1,3],[0,1,2,3,4],[0,1,2,3]]

console.log(
  getAncestors(5, [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4],
  ]),
);
// → [[],[0],[0,1],[0,1,2],[0,1,2,3]]

console.log(
  getAncestorsTopoSort(3, [
    [0, 1],
    [0, 2],
    [1, 2],
  ]),
);
// → [[],[0],[0,1]]
```

## Related Problems

| Problem                         | Difficulty | Link                                                                 |
| ------------------------------- | ---------- | -------------------------------------------------------------------- |
| Course Schedule II              | Medium     | [LC 210](https://leetcode.com/problems/course-schedule-ii)           |
| Lowest Common Ancestor of a DAG | Hard       | [LC 1257](https://leetcode.com/problems/smallest-common-region)      |
| Find All People With Secret     | Hard       | [LC 2092](https://leetcode.com/problems/find-all-people-with-secret) |
