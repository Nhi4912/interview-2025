---
layout: page
title: "Minimum Cost Walk in Weighted Graph"
difficulty: Hard
category: Tree-Graph
tags: [Array, Bit Manipulation, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/minimum-cost-walk-in-weighted-graph"
---

# Minimum Cost Walk in Weighted Graph / Chi Phí Nhỏ Nhất Đi Bộ Trong Đồ Thị Có Trọng Số

🔴 Hard | Union Find | Bitwise AND

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Mỗi cạnh có một "bộ lọc bit". Khi đi qua cạnh, bạn AND kết quả với trọng số của cạnh đó. Mục tiêu: tối thiểu hóa kết quả AND cuối cùng. **AND chỉ có thể giảm hoặc giữ nguyên** — vì vậy đi qua nhiều cạnh hơn = AND nhỏ hơn hoặc bằng. Đi qua **tất cả cạnh trong thành phần liên thông** cho kết quả tối thiểu.

```
Component with edges: w1=5(101), w2=3(011), w3=6(110)
AND of all = 101 & 011 & 110 = 000 = 0
For any query (u,v) in same component → answer = 0
```

**Key insight:** If `s` and `t` are in the same connected component, the minimum cost walk is the AND of ALL edge weights in that component (since we can traverse edges multiple times). If different components, return -1.

## Problem Description

Given an undirected weighted graph with `n` nodes and weighted edges, process queries `[s, t]`: find minimum cost walk from `s` to `t` where cost = AND of all traversed edge weights. You may revisit nodes and edges.

**Example 1:**

- Input: `n=5, edges=[[0,1,7],[1,3,7],[1,2,1]], queries=[[0,3],[3,4]]`
- Output: `[1,-1]`

**Example 2:**

- Input: `n=3, edges=[[0,2,7],[0,1,15],[1,2,6],[1,2,1]], queries=[[1,2]]`
- Output: `[0]`

## 📝 Interview Tips

- **Q: Why AND all edges in a component? / Tại sao AND tất cả cạnh trong thành phần?**
  - A: AND can only decrease; revisiting all edges gives the minimum / AND chỉ có thể giảm, đi qua tất cả cạnh cho kết quả nhỏ nhất.
- **Q: Why -1 for different components? / Tại sao -1 cho thành phần khác?**
  - A: No path exists between them / Không có đường nối chúng.
- **Q: Time complexity? / Độ phức tạp?**
  - A: O((n + E) _ α(n) + Q) / O((n + E) _ α(n) + Q).
- **Q: What if s == t? / Nếu s == t?**
  - A: Cost is 0 — no edges traversed / Chi phí là 0.
- **Q: Can we pre-compute per component? / Có thể tính trước theo thành phần không?**
  - A: Yes — AND all edge weights per component into componentAND map / Có — AND tất cả cạnh trong thành phần.
- **Q: Why Union Find and not DFS? / Tại sao dùng Union Find thay DFS?**
  - A: Union Find efficiently merges components and propagates AND values / Union Find hiệu quả hơn trong việc gộp và cập nhật AND.

## Solutions

### Solution 1: Union Find with Component AND

```typescript
/**
 * Minimum cost walk using Union Find + bitwise AND.
 * Time: O((n+E)*α(n) + Q)  Space: O(n)
 */
function minimumCost(n: number, edges: number[][], queries: number[][]): number[] {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);
  // compAND[root] = AND of all edges in the component
  const compAND = new Array(n).fill((1 << 20) - 1); // all bits 1

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(a: number, b: number, w: number): void {
    const pa = find(a),
      pb = find(b);
    const mergedAND = compAND[pa] & compAND[pb] & w;
    if (pa === pb) {
      compAND[pa] &= w;
      return;
    }
    if (rank[pa] < rank[pb]) {
      parent[pa] = pb;
      compAND[pb] = mergedAND;
    } else if (rank[pa] > rank[pb]) {
      parent[pb] = pa;
      compAND[pa] = mergedAND;
    } else {
      parent[pb] = pa;
      compAND[pa] = mergedAND;
      rank[pa]++;
    }
  }

  for (const [u, v, w] of edges) union(u, v, w);

  const result: number[] = [];
  for (const [s, t] of queries) {
    if (s === t) {
      result.push(0);
      continue;
    }
    const ps = find(s),
      pt = find(t);
    if (ps !== pt) result.push(-1);
    else result.push(compAND[ps]);
  }
  return result;
}

// Tests
console.log(
  minimumCost(
    5,
    [
      [0, 1, 7],
      [1, 3, 7],
      [1, 2, 1],
    ],
    [
      [0, 3],
      [3, 4],
    ],
  ),
);
// [1,-1]
console.log(
  minimumCost(
    3,
    [
      [0, 2, 7],
      [0, 1, 15],
      [1, 2, 6],
      [1, 2, 1],
    ],
    [[1, 2]],
  ),
);
// [0]
console.log(
  minimumCost(
    2,
    [],
    [
      [0, 1],
      [1, 1],
    ],
  ),
);
// [-1,0]
```

### Solution 2: BFS Component AND Pre-computation

```typescript
/**
 * Minimum cost walk using BFS to build component AND values.
 * Time: O(n + E + Q)  Space: O(n + E)
 */
function minimumCostBFS(n: number, edges: number[][], queries: number[][]): number[] {
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  }

  const comp = new Array(n).fill(-1);
  const compANDs: number[] = [];

  for (let i = 0; i < n; i++) {
    if (comp[i] !== -1) continue;
    const cid = compANDs.length;
    compANDs.push((1 << 20) - 1);
    const queue = [i];
    comp[i] = cid;
    while (queue.length) {
      const u = queue.shift()!;
      for (const [v, w] of adj[u]) {
        compANDs[cid] &= w;
        if (comp[v] === -1) {
          comp[v] = cid;
          queue.push(v);
        }
      }
    }
  }

  return queries.map(([s, t]) => {
    if (s === t) return 0;
    if (comp[s] !== comp[t]) return -1;
    return compANDs[comp[s]];
  });
}

// Tests
console.log(
  minimumCostBFS(
    5,
    [
      [0, 1, 7],
      [1, 3, 7],
      [1, 2, 1],
    ],
    [
      [0, 3],
      [3, 4],
    ],
  ),
);
// [1,-1]
```

## 🔗 Related Problems

| #    | Problem                                         | Difficulty | Key Concept |
| ---- | ----------------------------------------------- | ---------- | ----------- |
| 1202 | Smallest String With Swaps                      | Medium     | Union Find  |
| 547  | Number of Provinces                             | Medium     | Union Find  |
| 1697 | Checking Existence of Edge Length Limited Paths | Hard       | Union Find  |
| 928  | Minimize Malware Spread II                      | Hard       | Union Find  |
