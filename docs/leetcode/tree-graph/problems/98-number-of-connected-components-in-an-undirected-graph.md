---
layout: page
title: "Number of Connected Components in an Undirected Graph"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph"
---

# Number of Connected Components in an Undirected Graph / Số Thành Phần Liên Thông

> **Difficulty**: 🟡 Medium | **Category**: Tree-Graph | **Pattern**: Connected Components (DFS/Union-Find)

## 🧠 Intuition / Tư Duy

**Như đếm số hòn đảo trong quần đảo** — các đảo nối với nhau bằng cầu thành một nhóm. Cho danh sách cầu (edges), đếm có bao nhiêu nhóm đảo độc lập. Mỗi lần DFS từ một node chưa thăm → đó là một thành phần mới.

**Pattern Recognition:**

- n nodes + edges → graph → connected components → DFS/BFS/Union-Find
- Đếm số lần DFS khởi động = số thành phần liên thông
- Union-Find: bắt đầu với n components, mỗi union thành công giảm đi 1

**Visual:**

```
n=5, edges=[[0,1],[1,2],[3,4]]
Adjacency: 0-1-2   3-4
DFS from 0: visits {0,1,2} → component 1
DFS from 3: visits {3,4}   → component 2
Answer = 2
```

## Problem Description

Given `n` nodes labeled `0` to `n-1` and a list of undirected edges, return the number of connected components.

**Example 1:** n=5, edges=`[[0,1],[1,2],[3,4]]` → `2`
**Example 2:** n=5, edges=`[[0,1],[1,2],[2,3],[3,4]]` → `1`

**Constraints:** 1 ≤ n ≤ 2000, 0 ≤ edges.length ≤ 5000, no self-loops, no duplicate edges

## 📝 Interview Tips

1. **Clarify**: Undirected graph — edges go both ways. Can n have no edges? Yes → n components.
2. **Approach**: Build adjacency list, DFS/BFS from each unvisited node. OR Union-Find for clean implementation.
3. **Edge cases**: n=1 with no edges → 1. All nodes connected → 1. No edges → n.
4. **Optimize**: Union-Find with path compression is O(E·α(n)) ≈ O(E). DFS is O(V+E).
5. **Follow-up**: What if edges can be added dynamically? Union-Find handles online queries perfectly.
6. **Complexity**: DFS/BFS O(V+E) time, O(V+E) space. Union-Find O(E·α(V)) time, O(V) space.

## Solutions

```typescript
// Solution 1: DFS with adjacency list
// Time: O(V+E) | Space: O(V+E)
function countComponents(n: number, edges: number[][]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const visited = new Array(n).fill(false);

  function dfs(node: number): void {
    visited[node] = true;
    for (const neighbor of adj[node]) {
      if (!visited[neighbor]) dfs(neighbor);
    }
  }

  let components = 0;
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfs(i);
      components++;
    }
  }
  return components;
}

// Solution 2: Union-Find with path compression + union by rank
// Time: O(E * α(V)) | Space: O(V)
function countComponents2(n: number, edges: number[][]): number {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);
  let components = n;

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x: number, y: number): boolean {
    const px = find(x),
      py = find(y);
    if (px === py) return false;
    if (rank[px] < rank[py]) parent[px] = py;
    else if (rank[px] > rank[py]) parent[py] = px;
    else {
      parent[py] = px;
      rank[px]++;
    }
    return true;
  }

  for (const [u, v] of edges) {
    if (union(u, v)) components--;
  }
  return components;
}

// Solution 3: BFS
// Time: O(V+E) | Space: O(V+E)
function countComponents3(n: number, edges: number[][]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const visited = new Array(n).fill(false);
  let components = 0;

  for (let start = 0; start < n; start++) {
    if (visited[start]) continue;
    components++;
    const queue = [start];
    visited[start] = true;
    while (queue.length) {
      const node = queue.shift()!;
      for (const nb of adj[node]) {
        if (!visited[nb]) {
          visited[nb] = true;
          queue.push(nb);
        }
      }
    }
  }
  return components;
}

// Tests
console.log(
  countComponents(5, [
    [0, 1],
    [1, 2],
    [3, 4],
  ]),
); // 2
console.log(
  countComponents(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ]),
); // 1
console.log(countComponents2(4, [])); // 4
console.log(
  countComponents2(3, [
    [0, 1],
    [0, 2],
  ]),
); // 1
console.log(
  countComponents3(6, [
    [0, 1],
    [2, 3],
    [4, 5],
  ]),
); // 3
```

## 🔗 Related Problems

| Problem                                                                     | Relationship                       |
| --------------------------------------------------------------------------- | ---------------------------------- |
| [Number of Provinces](https://leetcode.com/problems/number-of-provinces/)   | Same problem with adjacency matrix |
| [Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/)         | Components + cycle detection       |
| [Redundant Connection](https://leetcode.com/problems/redundant-connection/) | Union-Find to detect extra edge    |
