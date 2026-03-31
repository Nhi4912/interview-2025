---
layout: page
title: "Number of Operations to Make Network Connected"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/number-of-operations-to-make-network-connected"
---

# Number of Operations to Make Network Connected / Số Thao Tác Kết Nối Mạng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Evaluate Division](https://leetcode.com/problems/evaluate-division) | [Possible Bipartition](https://leetcode.com/problems/possible-bipartition)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như hệ thống đường ống nước — nếu có đường ống dư thừa (hai nơi đã thông nhau mà vẫn nối thêm), ta có thể dùng đường ống đó để nối hai khu vực chưa thông. Cần `components - 1` đường ống để nối tất cả.

**Pattern Recognition:**

- Signal: "count connected components" + "spare/redundant edges" → **Union Find**
- Key insight: If `edges < n-1` → impossible (-1). Otherwise: answer = components - 1
- Redundant edges = edges that connect already-connected nodes → available to move

**Visual — Network connection example:**

```
n=6, edges=[[0,1],[0,2],[0,3],[1,2],[1,3]]

Union Find steps:
  union(0,1): parent[1]=0   components=5
  union(0,2): parent[2]=0   components=4
  union(0,3): parent[3]=0   components=3
  union(1,2): 0==0, REDUNDANT (+1 spare)
  union(1,3): 0==0, REDUNDANT (+1 spare)

Components: {0,1,2,3}, {4}, {5}  → 3 components
Need 3-1=2 moves. Spare edges=2 >= 2 ✓ → Answer: 2
```

---

## Problem Description

Given `n` computers (labeled 0 to n-1) and a list of `connections` (cables between two computers), find the minimum number of cable moves needed to connect all computers. Return `-1` if impossible.

- Example 1: `n=4, connections=[[0,1],[0,2],[1,2]]` → `1` (move one redundant cable to connect node 3)
- Example 2: `n=6, connections=[[0,1],[0,2],[0,3],[1,2]]` → `-1` (only 4 cables for 6 nodes, need 5)

Constraints: `1 <= n <= 10^5`, `1 <= connections.length <= min(n*(n-1)/2, 10^5)`.

---

## 📝 Interview Tips

1. **Clarify**: "Graph có thể có nhiều components, cần kiểm tra enough edges trước" / Check feasibility: if edges < n-1, return -1
2. **Key insight**: "Cần n-1 cạnh để nối n nodes thành cây. Thiếu → -1" / Spanning tree needs exactly n-1 edges
3. **Union Find**: "Đếm components + redundant edges. Answer = components - 1" / Count with UF; answer is components - 1
4. **BFS/DFS alt**: "DFS đếm connected components, đồng thời đếm cạnh thừa" / DFS through adjacency list counting components
5. **Edge cases**: "n=1 → 0 moves needed; tất cả đã connected → 0" / Already connected or single node → 0
6. **Follow-up**: "Dynamic edges được thêm/xóa? Dùng dynamic connectivity (link-cut tree)" / Dynamic graph needs link-cut tree

---

## Solutions

```typescript
/**
 * Solution 1: DFS — count connected components and extra edges
 * Time: O(N + E) — traverse all nodes and edges
 * Space: O(N + E) — adjacency list + visited
 */
function makeConnectedDFS(n: number, connections: number[][]): number {
  if (connections.length < n - 1) return -1;

  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of connections) {
    adj[a].push(b);
    adj[b].push(a);
  }

  const visited = new Array<boolean>(n).fill(false);
  let components = 0;

  function dfs(node: number): void {
    visited[node] = true;
    for (const neighbor of adj[node]) {
      if (!visited[neighbor]) dfs(neighbor);
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfs(i);
      components++;
    }
  }

  return components - 1;
}

/**
 * Solution 2: Union Find — optimal with path compression
 * Time: O((N + E) * α(N)) ≈ O(N + E)
 * Space: O(N) — parent array only
 */
function makeConnected(n: number, connections: number[][]): number {
  if (connections.length < n - 1) return -1;

  const parent: number[] = Array.from({ length: n }, (_, i) => i);
  const rank: number[] = new Array(n).fill(0);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(a: number, b: number): boolean {
    const ra = find(a),
      rb = find(b);
    if (ra === rb) return false;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else {
      parent[rb] = ra;
      rank[ra]++;
    }
    return true;
  }

  let components = n;
  for (const [a, b] of connections) {
    if (union(a, b)) components--;
  }

  return components - 1;
}

// === Test Cases ===
console.log(
  makeConnected(4, [
    [0, 1],
    [0, 2],
    [1, 2],
  ]),
); // 1
console.log(
  makeConnected(6, [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
  ]),
); // -1 (only 4 edges for 6 nodes)
console.log(makeConnected(1, [])); // 0 (single node, already connected)
console.log(
  makeConnected(6, [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
  ]),
); // 2
```

---

## 🔗 Related Problems

- [Number of Provinces](https://leetcode.com/problems/number-of-provinces) — count components with Union Find
- [Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree) — check if graph is connected with n-1 edges
- [Possible Bipartition](https://leetcode.com/problems/possible-bipartition) — Union Find on conflict graph
- [Redundant Connection](https://leetcode.com/problems/redundant-connection) — find the edge that creates a cycle
