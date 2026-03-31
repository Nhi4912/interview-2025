---
layout: page
title: "Most Profitable Path in a Tree"
difficulty: Medium
category: Tree-Graph
tags: [Array, Tree, Depth-First Search, Breadth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/most-profitable-path-in-a-tree"
---

# Most Profitable Path in a Tree / Con Đường Lợi Nhuận Nhất Trong Cây

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS + Path Simulation

## 🧠 Intuition

**VI**: Alice đi từ gốc xuống lá, Bob đi từ `bob` lên gốc. Họ cùng thu tiền ở cổng, nhưng nếu đến cùng lúc thì chia đôi. Chiến lược: (1) Tìm đường đi của Bob từ `bob` lên gốc + thời gian tới mỗi nút. (2) DFS cho Alice, tại mỗi nút xem Bob có đến trước/cùng lúc/sau hay không để quyết định lấy bao nhiêu.

**EN**: Find Bob's path to root with timestamps first. Then DFS Alice root→leaf, at each gate compare Alice's time vs Bob's time to determine income (full / half / 0).

```
Tree:              Bob path: 3→1→0
0                  bobTime: {3:0, 1:1, 0:2}
├─1
│ ├─2 (leaf)       Alice at node 1, time=1: Bob arrives at time=1 → half
│ └─3 (bob)        Alice at node 3, time=2: Bob left (time 0) → 0
└─4 (leaf)         Alice at node 2, time=2: Bob never → full
amount=[-2,4,2,-4,6]
Alice path 0→1→2: -2 + 4/2 + 2 = 2
Alice path 0→1→3: -2 + 4/2 + 0 = 0
Alice path 0→4:   -2 + 6 = 4 ← MAX
```

## 📝 Interview Tips

- 🇻🇳 Tìm đường Bob trước bằng DFS/BFS từ gốc đến `bob`, lưu thời gian tới từng nút.
- 🇬🇧 Find Bob's path first: DFS from root to node `bob`, record arrival time per node.
- 🇻🇳 Alice đến leaf tại thời điểm `depth` — so sánh với `bobTime[node]` để tính tiền.
- 🇬🇧 Alice reaches a node at depth `d`; compare with `bobTime[node]`: d < bt → full, d === bt → half, d > bt → 0.
- 🇻🇳 Alice chỉ có leaf mới tính kết quả — dùng `!adj[node] has children besides parent` để phát hiện leaf.
- 🇬🇧 Only leaf nodes (no unvisited neighbors) contribute to Alice's final score comparison.

## Solutions

```typescript
// ─── Solution: DFS Bob's path + DFS Alice's max profit ───
// Time: O(n)  Space: O(n)
function mostProfitablePath(edges: number[][], bob: number, amount: number[]): number {
  const n = amount.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // Step 1: Find Bob's path to root (node 0) and record arrival times
  const bobTime = new Map<number, number>();

  function findBob(node: number, parent: number, time: number): boolean {
    bobTime.set(node, time);
    if (node === 0) return true;
    for (const next of adj[node]) {
      if (next !== parent && findBob(next, node, time + 1)) return true;
    }
    bobTime.delete(node); // backtrack — not on path to root
    return false;
  }

  findBob(bob, -1, 0);

  // Step 2: DFS Alice from root to leaves, maximize profit
  let maxProfit = -Infinity;

  function dfsAlice(node: number, parent: number, depth: number, profit: number): void {
    // Income at this node for Alice
    const bt = bobTime.get(node);
    let income = 0;
    if (bt === undefined)
      income = amount[node]; // Bob never here
    else if (bt > depth)
      income = amount[node]; // Alice arrives first
    else if (bt === depth) income = amount[node] >> 1; // Same time → split
    // bt < depth → Bob already closed gate, Alice gets 0

    const newProfit = profit + income;
    let isLeaf = true;
    for (const next of adj[node]) {
      if (next !== parent) {
        isLeaf = false;
        dfsAlice(next, node, depth + 1, newProfit);
      }
    }
    if (isLeaf) maxProfit = Math.max(maxProfit, newProfit);
  }

  dfsAlice(0, -1, 0, 0);
  return maxProfit;
}

// ─── Solution 2: Iterative BFS for Bob + recursive DFS for Alice ───
// Time: O(n)  Space: O(n)
function mostProfitablePath2(edges: number[][], bob: number, amount: number[]): number {
  const n = amount.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // BFS from bob to root to find path
  const parent = new Array(n).fill(-1);
  const visited = new Uint8Array(n);
  const queue = [bob];
  visited[bob] = 1;
  while (queue.length) {
    const cur = queue.shift()!;
    for (const next of adj[cur]) {
      if (!visited[next]) {
        visited[next] = 1;
        parent[next] = cur;
        queue.push(next);
      }
    }
  }
  // Trace Bob's path from bob → root, assign times
  const bobTime = new Map<number, number>();
  let cur = 0,
    t = 0; // root is 0
  // We traced parents from bob's BFS — but we need path from bob to root
  // Simpler: trace path from root via parent[] back from bob
  let node = bob,
    time = 0;
  while (node !== -1) {
    bobTime.set(node, time++);
    node = parent[node];
  }
  // Now bobTime[x] = how long bob takes to reach x (counted from bob, so we need to flip)
  // Actually flip: path length from bob to root, bob arrives at step 0
  // But we stored from bob outward. The path bob→root gives correct arrival times.

  let maxProfit = -Infinity;
  function dfs(nd: number, par: number, depth: number, profit: number): void {
    const bt = bobTime.get(nd);
    let income = 0;
    if (bt === undefined) income = amount[nd];
    else if (bt > depth) income = amount[nd];
    else if (bt === depth) income = amount[nd] >> 1;
    const np = profit + income;
    let leaf = true;
    for (const nx of adj[nd]) {
      if (nx !== par) {
        leaf = false;
        dfs(nx, nd, depth + 1, np);
      }
    }
    if (leaf) maxProfit = Math.max(maxProfit, np);
  }
  dfs(0, -1, 0, 0);
  return maxProfit;
}

// Tests
console.log(
  mostProfitablePath(
    [
      [0, 1],
      [1, 2],
      [1, 3],
      [3, 4],
    ],
    3,
    [-2, 4, 2, -4, 6],
  ),
); // 6
console.log(mostProfitablePath([[0, 1]], 1, [-7280, 2350])); // -7280
```

## 🔗 Related Problems

| #    | Title                                           | Difficulty | Pattern      |
| ---- | ----------------------------------------------- | ---------- | ------------ |
| 337  | House Robber III                                | 🟡 Medium  | Tree DP      |
| 543  | Diameter of Binary Tree                         | 🟢 Easy    | DFS          |
| 2096 | Step-By-Step Directions From a Binary Tree Node | 🟡 Medium  | DFS + LCA    |
| 834  | Sum of Distances in Tree                        | 🔴 Hard    | Two-pass DFS |
