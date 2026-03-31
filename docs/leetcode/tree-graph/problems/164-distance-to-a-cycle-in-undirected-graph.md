---
layout: page
title: "Distance to a Cycle in Undirected Graph"
difficulty: Hard
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/distance-to-a-cycle-in-undirected-graph"
---

# Distance to a Cycle in Undirected Graph / Khoảng cách đến chu trình trong đồ thị vô hướng

🔴 Hard | Graph | Topological Trim | BFS

---

## 🧠 Intuition

**Vietnamese:** Đồ thị liên thông n đỉnh n cạnh có đúng 1 chu trình. Loại bỏ các "cây con" lá bằng cách liên tục xóa đỉnh bậc 1 (như topological sort) — các đỉnh còn lại tạo thành chu trình. Sau đó BFS từ tất cả các đỉnh chu trình.

**English:** A connected graph with n nodes and n edges has exactly one cycle. Repeatedly trim degree-1 leaves (like topological peeling) until remaining nodes form the cycle. Then multi-source BFS from all cycle nodes assigns distances.

```
Graph: 0-1-2-3-4-2   (cycle: 2-3-4)
       leaf chain: 0-1-2

Trim: remove 0 (deg 1), then 1 (deg 1) → cycle = {2,3,4}
BFS: dist[2]=0, dist[3]=0, dist[4]=0, dist[1]=1, dist[0]=2
```

---

## 📝 Interview Tips

- 🔑 **Key insight / Nhận xét chính:** The problem guarantees exactly n edges for n nodes (connected) → exactly 1 cycle.
- 📊 **Topological peel / Tỉa lá:** Maintain degree array; enqueue nodes of degree 1 repeatedly until cycle nodes remain.
- ⚡ **Multi-source BFS / BFS đa nguồn:** Initialize queue with all cycle nodes at distance 0; spread outward to leaves.
- 🎯 **Why not DFS cycle-find / Tại sao không DFS:** DFS cycle detection works but is harder to implement cleanly; degree-peel is simpler.
- 🧩 **Edge case / Trường hợp đặc biệt:** A self-loop or triangle — handled naturally by degree-peel.
- 📏 **Complexity / Độ phức tạp:** O(n) time (each node/edge processed constant times), O(n) space.

---

## Solutions

### Solution 1 — Degree-Peel + Multi-source BFS

```typescript
/**
 * 1. Trim all leaves iteratively until only the cycle remains.
 * 2. Multi-source BFS from cycle nodes to compute distances.
 *
 * Time:  O(n)
 * Space: O(n)
 */
function distanceToCycle(n: number, edges: number[][]): number[] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  const deg = new Array<number>(n).fill(0);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
    deg[u]++;
    deg[v]++;
  }

  // Phase 1: peel leaves to expose the cycle
  const inCycle = new Array<boolean>(n).fill(true);
  let leaves: number[] = [];
  for (let i = 0; i < n; i++) if (deg[i] === 1) leaves.push(i);

  while (leaves.length) {
    const next: number[] = [];
    for (const leaf of leaves) {
      inCycle[leaf] = false;
      for (const nb of adj[leaf]) {
        if (inCycle[nb]) {
          deg[nb]--;
          if (deg[nb] === 1) next.push(nb);
        }
      }
    }
    leaves = next;
  }

  // Phase 2: BFS from cycle nodes
  const dist = new Array<number>(n).fill(-1);
  const queue: number[] = [];
  for (let i = 0; i < n; i++) {
    if (inCycle[i]) {
      dist[i] = 0;
      queue.push(i);
    }
  }

  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    for (const nb of adj[cur]) {
      if (dist[nb] === -1) {
        dist[nb] = dist[cur] + 1;
        queue.push(nb);
      }
    }
  }
  return dist;
}

console.log(
  distanceToCycle(7, [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 2],
    [0, 1],
    [5, 2],
    [6, 5],
  ]),
);
// Node 2,3,4 are cycle → distances: [2,1,0,0,0,1,2]
console.log(
  distanceToCycle(3, [
    [0, 1],
    [1, 2],
    [2, 0],
  ]),
); // [0,0,0] all on cycle
```

---

## 🔗 Related Problems

| #    | Problem                  | Difficulty | Pattern          |
| ---- | ------------------------ | ---------- | ---------------- |
| 310  | Minimum Height Trees     | Medium     | Topological Peel |
| 207  | Course Schedule          | Medium     | Topological Sort |
| 2204 | Distance to Cycle (this) | Hard       | Peel + BFS       |
