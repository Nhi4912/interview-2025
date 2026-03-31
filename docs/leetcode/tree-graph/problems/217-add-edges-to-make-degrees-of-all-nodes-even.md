---
layout: page
title: "Add Edges to Make Degrees of All Nodes Even"
difficulty: Hard
category: Tree-Graph
tags: [Hash Table, Graph]
leetcode_url: "https://leetcode.com/problems/add-edges-to-make-degrees-of-all-nodes-even"
---

# Add Edges to Make Degrees of All Nodes Even / Thêm Cạnh Để Mọi Nút Có Bậc Chẵn

## Analogy / Tương Tự

> Trong mạng lưới điện, mỗi trạm biến áp có số dây kết nối (bậc). Quy tắc an toàn: mỗi trạm phải có số dây **chẵn**. Bạn được phép thêm **tối đa 2 dây mới** (không trùng dây cũ). Có thể làm được không?

## ASCII Visual

```
n=5, edges: 1-2,2-3,3-4,4-5,1-5
Degrees: 1→2, 2→2, 3→2, 4→2, 5→2  (all even! → already valid → return true)

n=4, edges: 1-2,3-4
Degrees: 1→1, 2→1, 3→1, 4→1  (4 odd-degree nodes)
Add 1-3 and 2-4 → all degrees become 2 → true
```

## Problem

Given an undirected graph with `n` nodes (1-indexed) and `edges`. Add **at most 2 edges** (no self-loops, no multi-edges) to make every node have even degree. Return `true` if possible.

## Interview Tips

1. **Count odd-degree nodes** — only 0, 2, or 4 odd-degree nodes can be fixed
2. **0 odd nodes** — already valid, return true immediately
3. **2 odd nodes** — try connecting them directly (if no edge exists). Or find a middle node connected to neither
4. **4 odd nodes** — must pair them into 2 new edges; try all 3 pairings: (a,b)+(c,d), (a,c)+(b,d), (a,d)+(b,c)
5. **Edge existence check** — use Set of `"u-v"` strings or adjacency Set per node
6. **Other counts** — 1 or 3 odd-degree nodes are impossible (handshaking lemma)

## Solutions

### Solution 1: Case Analysis on Odd-Degree Nodes

```typescript
function isPossible(n: number, edges: number[][]): boolean {
  const degree = new Array(n + 1).fill(0);
  const edgeSet = new Set<string>();

  for (const [u, v] of edges) {
    degree[u]++;
    degree[v]++;
    const key = u < v ? `${u}-${v}` : `${v}-${u}`;
    edgeSet.add(key);
  }

  const hasEdge = (u: number, v: number): boolean => {
    const key = u < v ? `${u}-${v}` : `${v}-${u}`;
    return edgeSet.has(key);
  };

  // Collect odd-degree nodes
  const odd: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (degree[i] % 2 === 1) odd.push(i);
  }

  if (odd.length === 0) return true;

  if (odd.length === 2) {
    const [a, b] = odd;
    // Option 1: connect a-b directly
    if (!hasEdge(a, b)) return true;
    // Option 2: find intermediate node c connected to neither
    for (let c = 1; c <= n; c++) {
      if (c === a || c === b) continue;
      if (!hasEdge(a, c) && !hasEdge(b, c)) return true;
    }
    return false;
  }

  if (odd.length === 4) {
    const [a, b, c, d] = odd;
    // Try 3 pairings
    if (!hasEdge(a, b) && !hasEdge(c, d)) return true;
    if (!hasEdge(a, c) && !hasEdge(b, d)) return true;
    if (!hasEdge(a, d) && !hasEdge(b, c)) return true;
    return false;
  }

  // 1 or 3 odd-degree nodes: impossible
  return false;
}

// Tests
console.log(
  isPossible(5, [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [1, 5],
  ]),
); // true
console.log(
  isPossible(4, [
    [1, 2],
    [3, 4],
  ]),
); // true
console.log(
  isPossible(4, [
    [1, 2],
    [1, 3],
    [1, 4],
  ]),
); // false
```

### Solution 2: Adjacency Set per Node (Faster Edge Check)

```typescript
function isPossibleV2(n: number, edges: number[][]): boolean {
  const degree = new Array(n + 1).fill(0);
  const adj: Set<number>[] = Array.from({ length: n + 1 }, () => new Set());

  for (const [u, v] of edges) {
    degree[u]++;
    degree[v]++;
    adj[u].add(v);
    adj[v].add(u);
  }

  const odd = [];
  for (let i = 1; i <= n; i++) if (degree[i] & 1) odd.push(i);

  if (odd.length === 0) return true;

  if (odd.length === 2) {
    const [a, b] = odd;
    if (!adj[a].has(b)) return true;
    for (let c = 1; c <= n; c++) {
      if (c !== a && c !== b && !adj[a].has(c) && !adj[b].has(c)) return true;
    }
    return false;
  }

  if (odd.length === 4) {
    const [a, b, c, d] = odd;
    if (!adj[a].has(b) && !adj[c].has(d)) return true;
    if (!adj[a].has(c) && !adj[b].has(d)) return true;
    if (!adj[a].has(d) && !adj[b].has(c)) return true;
    return false;
  }

  return false;
}

console.log(
  isPossibleV2(5, [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [1, 5],
  ]),
); // true
console.log(
  isPossibleV2(4, [
    [1, 2],
    [3, 4],
  ]),
); // true
```

## Related Problems

| #    | Problem                               | Difficulty | Tags          |
| ---- | ------------------------------------- | ---------- | ------------- |
| 2508 | Add Edges to Make Degrees Even (this) | Hard       | Graph         |
| 1615 | Maximal Network Rank                  | Medium     | Graph         |
| 1557 | Minimum Number of Vertices            | Medium     | Graph         |
| 997  | Find the Town Judge                   | Easy       | Graph, Degree |
