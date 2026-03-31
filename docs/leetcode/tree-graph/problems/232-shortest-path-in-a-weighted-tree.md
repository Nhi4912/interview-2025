---
layout: page
title: "Shortest Path in a Weighted Tree"
difficulty: Hard
category: Tree-Graph
tags: [Array, Tree, Depth-First Search, Binary Indexed Tree, Segment Tree]
leetcode_url: "https://leetcode.com/problems/shortest-path-in-a-weighted-tree"
---

# Shortest Path in a Weighted Tree / Đường Đi Ngắn Nhất Trong Cây Có Trọng Số

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Euler Tour + BIT
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem) | [Block Placement Queries](https://leetcode.com/problems/block-placement-queries)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như hệ thống đường cao tốc cây — cập nhật phí đường một đoạn, và truy vấn tổng phí từ thủ đô (root) đến thành phố x. Euler tour biến "cập nhật cả nhánh cây" thành "cập nhật đoạn liên tiếp", và BIT xử lý range-update point-query trong O(log n).

**Visual — Euler tour maps subtree to contiguous range:**

```
Tree (root=1):    1
                 / \
                2   3
               / \
              4   5

DFS in-times: 1→0, 2→1, 4→2, 5→3, 3→4   (example)
out-times:    1→4, 2→3, 4→2, 5→3, 3→4

Subtree of 2 = nodes {2,4,5} → in-times [1,3]

Edge update (2,w_new): dist changes for ALL nodes in subtree(2)
→ Range update [in[2], out[2]] = [1,3] by delta

BIT (difference array style):
  range_update(l, r, d): bit[l]+=d, bit[r+1]-=d
  point_query(x): prefix_sum(in[x])

Query node 4: dist[4] + bit_query(in[4]) = base_dist[4] + delta
```

---

## Problem Description

Given a rooted tree with `n` nodes (root = 1) and weighted edges. Process `q` queries: **Type 1** `[1, u, v, w]` updates edge `(u,v)` weight to `w`. **Type 2** `[2, x]` returns the distance from root (node 1) to node `x`. ([LeetCode 3531](https://leetcode.com/problems/shortest-path-in-a-weighted-tree))

**Example:** n=4, edges=[[1,2,3],[1,3,5],[2,4,1]], queries=[[2,4],[1,1,2,4],[2,4]] → [4, 5]
(Initial dist[4]=3+1=4; update edge(1,2) to 4 → dist[4]=4+1=5)

**Constraints:** 2 ≤ n ≤ 10⁵, 1 ≤ queries ≤ 10⁵, edge weights 1–10⁵.

---

## 📝 Interview Tips

1. **Key insight**: Cập nhật edge (u,v) thay đổi dist của tất cả nodes trong subtree của child / Range update!
2. **Euler tour**: DFS gán in[v]/out[v]; subtree(v) = nodes với in-time trong [in[v], out[v]] / Contiguous range.
3. **BIT range-update**: Dùng difference array trong BIT: update(l, d) + update(r+1, -d) / Point query = prefix sum.
4. **Find child**: Edge (u,v): parent[v]=u thì v là child; hoặc parent[u]=v thì u là child / Pre-compute parent array.
5. **Edge case**: Cập nhật edge mà weight không thay đổi → delta=0, BIT không thay đổi.
6. **Follow-up**: "Nếu update node value thay vì edge weight?" / Same approach: range update on subtree.

---

## Solutions

```typescript
/**
 * Solution 1: Recompute from scratch for each type-2 query
 * Time: O(q·n) — each query might need full DFS
 * Space: O(n)
 */
function shortestPathBrute(n: number, edges: number[][], queries: number[][]): number[] {
  const adj: [number, number][][] = Array.from({ length: n + 1 }, () => []);
  const edgeWeight = new Map<string, number>();

  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
    edgeWeight.set(`${u},${v}`, w);
    edgeWeight.set(`${v},${u}`, w);
  }

  const result: number[] = [];
  for (const q of queries) {
    if (q[0] === 1) {
      const [, u, v, w] = q;
      // Update adjacency list weight
      for (const e of adj[u]) if (e[0] === v) e[1] = w;
      for (const e of adj[v]) if (e[0] === u) e[1] = w;
    } else {
      // BFS from root
      const dist = new Array(n + 1).fill(-1);
      dist[1] = 0;
      const queue: number[] = [1];
      let head = 0;
      while (head < queue.length) {
        const u = queue[head++];
        for (const [v, w] of adj[u]) {
          if (dist[v] === -1) {
            dist[v] = dist[u] + w;
            queue.push(v);
          }
        }
      }
      result.push(dist[q[1]]);
    }
  }
  return result;
}

/**
 * Solution 2: Euler Tour + BIT (range-update, point-query)
 * Pre-compute: DFS to assign in/out times and initial dist from root.
 * Type 1 update: find child, compute delta, BIT range-update subtree.
 * Type 2 query: baseDist[x] + BIT.pointQuery(in[x]).
 * Time: O((n + q) log n)
 * Space: O(n)
 */
function shortestPathWeightedTree(n: number, edges: number[][], queries: number[][]): number[] {
  const adj: [number, number][][] = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  }

  const parent = new Array(n + 1).fill(0);
  const parentEdgeW = new Array(n + 1).fill(0);
  const baseDist = new Array(n + 1).fill(0);
  const inTime = new Array(n + 1).fill(0);
  const outTime = new Array(n + 1).fill(0);
  let timer = 0;

  // Iterative DFS for Euler tour
  const visited = new Array(n + 1).fill(false);
  type Frame = { node: number; par: number; ci: number };
  const stack: Frame[] = [{ node: 1, par: 0, ci: 0 }];
  visited[1] = true;

  while (stack.length > 0) {
    const frame = stack[stack.length - 1];
    const { node, par } = frame;

    if (frame.ci === 0) {
      // first visit: assign in-time
      inTime[node] = timer++;
    }

    // Advance to next unvisited child
    let advanced = false;
    while (frame.ci < adj[node].length) {
      const [child, w] = adj[node][frame.ci];
      frame.ci++;
      if (!visited[child]) {
        visited[child] = true;
        parent[child] = node;
        parentEdgeW[child] = w;
        baseDist[child] = baseDist[node] + w;
        stack.push({ node: child, par: node, ci: 0 });
        advanced = true;
        break;
      }
    }

    if (!advanced) {
      outTime[node] = timer - 1;
      stack.pop();
    }
  }

  // BIT for difference-array range-update / point-query
  const bit = new Array(n + 2).fill(0);
  const bitUpdate = (i: number, val: number) => {
    for (i++; i <= n; i += i & -i) bit[i] += val;
  };
  const bitQuery = (i: number): number => {
    let s = 0;
    for (i++; i > 0; i -= i & -i) s += bit[i];
    return s;
  };
  const rangeUpdate = (l: number, r: number, d: number) => {
    bitUpdate(l, d);
    if (r + 1 <= n - 1) bitUpdate(r + 1, -d);
  };

  const result: number[] = [];
  for (const q of queries) {
    if (q[0] === 1) {
      const [, u, v, wNew] = q;
      // Determine which is child
      const child = parent[v] === u ? v : u;
      const delta = wNew - parentEdgeW[child];
      parentEdgeW[child] = wNew;
      rangeUpdate(inTime[child], outTime[child], delta);
    } else {
      const x = q[1];
      result.push(baseDist[x] + bitQuery(inTime[x]));
    }
  }
  return result;
}

// === Test Cases ===
console.log(
  JSON.stringify(
    shortestPathWeightedTree(
      4,
      [
        [1, 2, 3],
        [1, 3, 5],
        [2, 4, 1],
      ],
      [
        [2, 4],
        [1, 1, 2, 4],
        [2, 4],
      ],
    ),
  ),
); // [4, 5]

console.log(
  JSON.stringify(
    shortestPathWeightedTree(
      3,
      [
        [1, 2, 2],
        [1, 3, 4],
      ],
      [
        [2, 2],
        [2, 3],
        [1, 1, 2, 1],
        [2, 2],
      ],
    ),
  ),
); // [2, 4, 1]
```

---

## 🔗 Related Problems

| Problem                                                                                                                            | Pattern      | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- |
| [Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable)                                                 | BIT          | Medium     |
| [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem)                                                           | Segment Tree | Hard       |
| [Difference Between Maximum and Minimum Price Sum](https://leetcode.com/problems/difference-between-maximum-and-minimum-price-sum) | Tree DP      | Hard       |
| [Block Placement Queries](https://leetcode.com/problems/block-placement-queries)                                                   | Segment Tree | Hard       |
| [Shortest Path in a Weighted Tree — LeetCode](https://leetcode.com/problems/shortest-path-in-a-weighted-tree)                      | —            | Hard       |
