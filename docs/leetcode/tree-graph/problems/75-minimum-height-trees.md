---
layout: page
title: "Minimum Height Trees"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/minimum-height-trees"
---

# Minimum Height Trees / Cây Có Chiều Cao Nhỏ Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Leaf Trimming (Topological Sort)
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule) | [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như bóc vỏ hành tây từ ngoài vào — loại bỏ dần các lá ngoài cùng, rồi tiếp tục bóc lớp tiếp theo. Khi còn ≤ 2 nodes thì đó chính là root(s) tạo ra Minimum Height Tree. Đây là dạng đặc biệt của Topological Sort (leaf trimming).

**Pattern Recognition:**

- Signal: "find center(s) of tree" → **iterative leaf removal**
- Cây luôn có tối đa 2 centroid nodes
- Tương tự Kahn's algorithm nhưng bắt đầu từ leaves (degree=1) thay vì in-degree=0

**Visual:**

```
n=6, edges=[[3,0],[3,1],[3,2],[3,4],[5,4]]
    0   1   2
     \  |  /
      \ | /
       3 - 4 - 5

Round 1 (leaves: 0,1,2,5): remove → 3 and 4 remain
Round 2 (leaves: 3,4): both have degree 1 → ≤2 nodes → answer=[3,4]
```

---

## Problem Description

Given a tree with `n` nodes and `n-1` undirected edges, find all root labels such that rooting the tree at that label produces a tree of **minimum height**. A tree can have at most 2 such roots.

**Example 1:** `n=4, edges=[[1,0],[1,2],[1,3]]` → `[1]` (height 1 from center node 1)
**Example 2:** `n=6, edges=[[3,0],[3,1],[3,2],[3,4],[5,4]]` → `[3,4]`

Constraints: `1 <= n <= 2 × 10⁴`, edges form a valid tree.

---

## 📝 Interview Tips

1. **Key insight**: "Centroid của cây — node mà nếu root tại đó, height nhỏ nhất" / Tree centroid minimizes height; always 1-2 centroids
2. **Leaf trim**: "Giống BFS từ ngoài vào trong — loại lá, update degree" / Remove leaves layer by layer like Kahn's BFS
3. **Stopping condition**: "Dừng khi remaining ≤ 2 nodes — đó là answer" / Stop when ≤2 nodes left
4. **n=1 edge case**: "n=1 → [0]; n=2 → [0,1]" / Handle small inputs before building adjacency list
5. **Degree tracking**: "Khi remove leaf u, giảm degree của neighbor — nếu neighbor.degree==1 thì thành leaf mới" / Degree update cascades
6. **Follow-up**: "Nếu graph (có cycle)? Centroid decomposition?" / Trees only; cycle graphs need different approach

---

## Solutions

```typescript
/**
 * Solution 1: Iterative leaf trimming (optimal)
 * Time: O(N) — each node removed exactly once
 * Space: O(N) — adjacency list + degree array
 */
function findMinHeightTrees(n: number, edges: number[][]): number[] {
  if (n === 1) return [0];
  if (n === 2) return [0, 1];

  const degree = new Array(n).fill(0);
  const graph: Set<number>[] = Array.from({ length: n }, () => new Set());
  for (const [u, v] of edges) {
    graph[u].add(v);
    graph[v].add(u);
    degree[u]++;
    degree[v]++;
  }

  // Initialize with all leaf nodes (degree = 1)
  let leaves: number[] = [];
  for (let i = 0; i < n; i++) if (degree[i] === 1) leaves.push(i);

  let remaining = n;
  while (remaining > 2) {
    remaining -= leaves.length;
    const newLeaves: number[] = [];
    for (const leaf of leaves) {
      for (const neighbor of graph[leaf]) {
        graph[neighbor].delete(leaf);
        degree[neighbor]--;
        if (degree[neighbor] === 1) newLeaves.push(neighbor);
      }
    }
    leaves = newLeaves;
  }
  return leaves;
}

/**
 * Solution 2: Two-pass DFS to find diameter endpoints → midpoint(s)
 * Time: O(N) — two DFS traversals
 * Space: O(N) — graph + recursion
 */
function findMinHeightTreesDFS(n: number, edges: number[][]): number[] {
  if (n === 1) return [0];

  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  function bfsFarthest(start: number): [number, number[]] {
    const dist = new Array(n).fill(-1);
    dist[start] = 0;
    const q = [start];
    let farthest = start;
    const parent = new Array(n).fill(-1);
    while (q.length > 0) {
      const node = q.shift()!;
      for (const nb of graph[node]) {
        if (dist[nb] === -1) {
          dist[nb] = dist[node] + 1;
          parent[nb] = node;
          q.push(nb);
          if (dist[nb] > dist[farthest]) farthest = nb;
        }
      }
    }
    // Trace path back
    const path: number[] = [];
    let cur: number = farthest;
    while (cur !== -1) {
      path.push(cur);
      cur = parent[cur];
    }
    return [farthest, path];
  }

  const [end1] = bfsFarthest(0);
  const [, diamPath] = bfsFarthest(end1);
  const len = diamPath.length;
  // Center(s) of the diameter path
  if (len % 2 === 1) return [diamPath[Math.floor(len / 2)]];
  return [diamPath[Math.floor(len / 2)], diamPath[Math.floor(len / 2) - 1]];
}

// === Test Cases ===
console.log(
  findMinHeightTrees(4, [
    [1, 0],
    [1, 2],
    [1, 3],
  ]),
); // [1]
console.log(
  findMinHeightTrees(6, [
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 4],
    [5, 4],
  ]),
); // [3,4]
console.log(findMinHeightTrees(1, [])); // [0]
console.log(findMinHeightTrees(2, [[0, 1]])); // [0,1]
```

---

## 🔗 Related Problems

| Problem                                                                                                                          | Pattern           | Difficulty |
| -------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------- |
| [Course Schedule II](https://leetcode.com/problems/course-schedule-ii)                                                           | Topological Sort  | 🟡 Medium  |
| [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree)                                               | Two-pass DFS      | 🔴 Hard    |
| [Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters) | Tree DP           | 🔴 Hard    |
| [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree)                                                 | Tree DFS diameter | 🟢 Easy    |
| [Sort Items by Groups Respecting Dependencies](https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies)       | Topological Sort  | 🔴 Hard    |
