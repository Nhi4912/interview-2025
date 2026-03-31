---
layout: page
title: "Critical Connections in a Network"
difficulty: Hard
category: Tree-Graph
tags: [Depth-First Search, Graph, Biconnected Component]
leetcode_url: "https://leetcode.com/problems/critical-connections-in-a-network"
---

# Critical Connections in a Network / Các kết nối quan trọng trong mạng

🔴 Hard | Graph | Tarjan's Bridge Algorithm | DFS

---

## 🧠 Intuition

**Vietnamese:** Một cạnh là "cầu" (bridge) nếu xóa nó sẽ chia đồ thị thành 2 phần không liên thông. Dùng thuật toán Tarjan: mỗi đỉnh có `disc` (thời điểm khám phá) và `low` (đỉnh sớm nhất có thể đến được qua nhánh DFS). Nếu `low[v] > disc[u]`, cạnh `u-v` là cầu.

**English:** A **bridge** is an edge whose removal disconnects the graph. Tarjan's algorithm tracks discovery time `disc` and `low` (earliest reachable ancestor). Edge `(u,v)` is a bridge when `low[v] > disc[u]` — `v`'s subtree cannot back-reach `u` or earlier.

```
0 -- 1 -- 2
     |
     3

DFS from 0: disc=[0,1,2,3], low=[0,0,2,3]
Edge (1,2): low[2]=2 > disc[1]=1 → BRIDGE
Edge (1,3): low[3]=3 > disc[1]=1 → BRIDGE
Edge (0,1): low[1]=0 = disc[0]=0 → not bridge (back-edge via cycle)
```

---

## 📝 Interview Tips

- 🔑 **Key insight / Nhận xét chính:** Bridge detection requires `low[v] > disc[u]` (strictly greater), not `>=`.
- 📊 **Avoid parent edge / Tránh cạnh cha:** Pass `parent` node into DFS so you don't traverse back via the same undirected edge.
- ⚡ **low update rule / Cập nhật low:** `low[u] = min(low[u], low[v])` for tree edges; `low[u] = min(low[u], disc[v])` for back-edges.
- 🎯 **Directed vs undirected / Có hướng vs vô hướng:** This is undirected — skip the direct parent edge, but allow other back-edges.
- 🧩 **Multiple edges / Nhiều cạnh song song:** Two edges between same pair → neither is a bridge. Track by index, not node ID.
- 📏 **Complexity / Độ phức tạp:** O(V + E) — single DFS pass.

---

## Solutions

### Solution 1 — Tarjan's Bridge Algorithm

```typescript
/**
 * Tarjan's bridge-finding DFS.
 * disc[u] = discovery time; low[u] = min discovery time reachable from subtree.
 * Edge (u,v) is bridge if low[v] > disc[u].
 *
 * Time:  O(V + E)
 * Space: O(V + E)
 */
function criticalConnections(n: number, connections: number[][]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of connections) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const disc = new Array<number>(n).fill(-1);
  const low = new Array<number>(n).fill(-1);
  const bridges: number[][] = [];
  let timer = 0;

  function dfs(u: number, parent: number): void {
    disc[u] = low[u] = timer++;
    for (const v of adj[u]) {
      if (v === parent) continue;
      if (disc[v] === -1) {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) bridges.push([u, v]);
      } else {
        low[u] = Math.min(low[u], disc[v]);
      }
    }
  }

  for (let i = 0; i < n; i++) if (disc[i] === -1) dfs(i, -1);
  return bridges;
}

console.log(
  criticalConnections(4, [
    [0, 1],
    [1, 2],
    [2, 0],
    [1, 3],
  ]),
);
// [[1,3]]
console.log(criticalConnections(2, [[0, 1]]));
// [[0,1]]
```

### Solution 2 — Iterative DFS (Stack-based, avoids recursion limit)

```typescript
/**
 * Iterative version using explicit stack to avoid call-stack overflow on large inputs.
 *
 * Time:  O(V + E)
 * Space: O(V + E)
 */
function criticalConnections2(n: number, connections: number[][]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of connections) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const disc = new Array<number>(n).fill(-1);
  const low = new Array<number>(n).fill(-1);
  const parent = new Array<number>(n).fill(-1);
  const bridges: number[][] = [];
  let timer = 0;

  // stack stores [node, neighborIndex]
  const stack: [number, number][] = [];
  for (let start = 0; start < n; start++) {
    if (disc[start] !== -1) continue;
    stack.push([start, 0]);
    disc[start] = low[start] = timer++;
    while (stack.length) {
      const [u, i] = stack[stack.length - 1];
      if (i < adj[u].length) {
        stack[stack.length - 1][1]++;
        const v = adj[u][i];
        if (v === parent[u]) continue;
        if (disc[v] === -1) {
          parent[v] = u;
          disc[v] = low[v] = timer++;
          stack.push([v, 0]);
        } else {
          low[u] = Math.min(low[u], disc[v]);
        }
      } else {
        stack.pop();
        if (parent[u] !== -1) {
          low[parent[u]] = Math.min(low[parent[u]], low[u]);
          if (low[u] > disc[parent[u]]) bridges.push([parent[u], u]);
        }
      }
    }
  }
  return bridges;
}

console.log(
  criticalConnections2(4, [
    [0, 1],
    [1, 2],
    [2, 0],
    [1, 3],
  ]),
); // [[1,3]]
```

---

## 🔗 Related Problems

| #    | Problem                                     | Difficulty | Pattern          |
| ---- | ------------------------------------------- | ---------- | ---------------- |
| 1192 | Critical Connections (this)                 | Hard       | Tarjan's Bridge  |
| 1568 | Minimum Number of Days to Disconnect Island | Hard       | Bridge Detection |
| 323  | Number of Connected Components              | Medium     | DFS / Union Find |
