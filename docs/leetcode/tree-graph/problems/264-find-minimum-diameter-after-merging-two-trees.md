---
layout: page
title: "Find Minimum Diameter After Merging Two Trees"
difficulty: Hard
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/find-minimum-diameter-after-merging-two-trees"
---

# Find Minimum Diameter After Merging Two Trees / Đường Kính Tối Thiểu Sau Khi Gộp Hai Cây

> **Track**: Tree-Graph | **Difficulty**: 🔴 Hard | **Pattern**: DFS/BFS — Tree Diameter + Math Insight
> **Frequency**: 📘 Tier 3 — Gặp ở Google, Meta (Weekly Contest)
> **See also**: [543 Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree) | [310 Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có hai chiếc gậy (cây), và muốn nối chúng bằng một đoạn thêm để tạo thành hình chữ T (hoặc thẳng). Đường kính của hình mới = cạnh dài nhất từ đầu này qua điểm nối đến đầu kia. Để tối thiểu hóa, bạn nối ở "giữa" mỗi gậy — trung tâm của gậy có thể giảm nửa đường kính khi kết nối. Kết quả cuối là max của ba khả năng: (1) đường kính gậy 1 vẫn lớn nhất, (2) đường kính gậy 2 vẫn lớn nhất, hoặc (3) đường đi dài nhất qua cả hai gậy = ceil(d1/2) + 1 + ceil(d2/2).

**Pattern Recognition:**

- Signal: "merge two trees with one edge, minimize resulting diameter" → **Tree Diameter + Math Formula**
- Bài này thuộc dạng tính đường kính cây + áp dụng công thức toán học khi gộp
- Key insight: `answer = max(d1, d2, ceil(d1/2) + ceil(d2/2) + 1)` — dùng 2 BFS hoặc DFS để tính d1, d2

**Visual — Merging logic:**

```
Tree1: diameter d1=4  (path: A-B-C-D-E, length 4)
Tree2: diameter d2=6  (path: P-Q-R-S-T-U-V, length 6)

Best merge: connect center of tree1 to center of tree2
  center of tree1 = node at distance ⌈d1/2⌉=2 from endpoints
  center of tree2 = node at distance ⌈d2/2⌉=3 from endpoints

New path through both = ⌈4/2⌉ + 1 + ⌈6/2⌉ = 2 + 1 + 3 = 6

Answer = max(d1=4, d2=6, 6) = 6

Another example:
  d1=3, d2=3
  ceil(3/2)+1+ceil(3/2) = 2+1+2 = 5
  max(3, 3, 5) = 5
```

---

## Problem Description

You have two undirected trees with n and m nodes respectively (given as edge lists). Connect them with exactly one edge to form one tree. Find the minimum possible diameter of the resulting tree. ([LeetCode](https://leetcode.com/problems/find-minimum-diameter-after-merging-two-trees))

```
Example 1: edges1=[[0,1],[0,2],[0,3]], edges2=[[0,1]] → 3
Example 2: edges1=[[0,1],[1,2],[2,3],[3,4]], edges2=[[0,1],[1,2],[2,3]] → 5
```

Constraints: 1 ≤ n, m ≤ 10⁵; valid tree edges.

---

## 📝 Interview Tips

1. **Formula: answer = max(d1, d2, ceil(d1/2) + ceil(d2/2) + 1)** — _Công thức đóng gói toàn bộ logic — học thuộc và chứng minh được_
2. **Find tree diameter with two BFS (or DFS): BFS from any node → find farthest → BFS again** — _Đường kính cây: BFS từ bất kỳ đỉnh → tìm đỉnh xa nhất → BFS lại từ đó_
3. **Diameter = max path between any two nodes (count edges, not nodes)** — _Đường kính = số cạnh trên đường đi dài nhất — không phải số đỉnh_
4. **Single-node tree has diameter 0** — _Cây 1 đỉnh có đường kính 0 — xử lý edge case này_
5. **ceil(d/2) = Math.floor((d+1)/2) in integer arithmetic** — _Công thức làm tròn lên cho số nguyên: ⌈d/2⌉ = (d+1)>>1_
6. **Why not connect arbitrary nodes? Because center minimizes the "arm length" into each tree** — _Tại sao nối vào trung tâm? Vì nối vào trung tâm giảm thiểu cánh tay dài nhất từ điểm nối đến lá xa nhất_

---

## Solutions

```typescript
/** Solution 1: Two-BFS diameter + formula
 * @complexity Time: O(n + m) | Space: O(n + m) */
function minimumDiameterAfterMerge(edges1: number[][], edges2: number[][]): number {
  function buildAdj(n: number, edges: number[][]): number[][] {
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      adj[u].push(v);
      adj[v].push(u);
    }
    return adj;
  }

  function bfsFarthest(adj: number[][], start: number): [number, number] {
    // Returns [farthestNode, distance]
    const n = adj.length;
    const dist = new Array(n).fill(-1);
    dist[start] = 0;
    const queue: number[] = [start];
    let farthest = start,
      maxDist = 0;
    while (queue.length) {
      const node = queue.shift()!;
      for (const next of adj[node]) {
        if (dist[next] === -1) {
          dist[next] = dist[node] + 1;
          queue.push(next);
          if (dist[next] > maxDist) {
            maxDist = dist[next];
            farthest = next;
          }
        }
      }
    }
    return [farthest, maxDist];
  }

  function treeDiameter(edges: number[][]): number {
    const n = edges.length + 1;
    if (n === 1) return 0;
    const adj = buildAdj(n, edges);
    const [far1] = bfsFarthest(adj, 0);
    const [, d] = bfsFarthest(adj, far1);
    return d;
  }

  const d1 = treeDiameter(edges1);
  const d2 = treeDiameter(edges2);
  const merged = Math.ceil(d1 / 2) + Math.ceil(d2 / 2) + 1;
  return Math.max(d1, d2, merged);
}

/** Solution 2: DFS diameter (returns height, updates diameter in closure)
 * @complexity Time: O(n + m) | Space: O(n + m) */
function minimumDiameterAfterMerge2(edges1: number[][], edges2: number[][]): number {
  function dfsDiameter(edges: number[][]): number {
    const n = edges.length + 1;
    if (n === 1) return 0;
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      adj[u].push(v);
      adj[v].push(u);
    }

    let diameter = 0;
    function dfs(node: number, parent: number): number {
      let maxH = 0;
      for (const next of adj[node]) {
        if (next === parent) continue;
        const h = dfs(next, node) + 1;
        diameter = Math.max(diameter, maxH + h);
        maxH = Math.max(maxH, h);
      }
      return maxH;
    }
    dfs(0, -1);
    return diameter;
  }

  const d1 = dfsDiameter(edges1);
  const d2 = dfsDiameter(edges2);
  return Math.max(d1, d2, Math.ceil(d1 / 2) + Math.ceil(d2 / 2) + 1);
}

// === Test Cases ===
console.log(
  minimumDiameterAfterMerge(
    [
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    [[0, 1]],
  ),
); // 3
console.log(
  minimumDiameterAfterMerge(
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  ),
); // 5
console.log(
  minimumDiameterAfterMerge2(
    [
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    [[0, 1]],
  ),
); // 3
console.log(minimumDiameterAfterMerge([], [])); // 1 (two single nodes)
```

---

## 🔗 Related Problems

| #    | Problem                  | Difficulty | Pattern           |
| ---- | ------------------------ | ---------- | ----------------- |
| 543  | Diameter of Binary Tree  | Easy       | DFS post-order    |
| 1245 | Tree Diameter            | Medium     | BFS twice         |
| 310  | Minimum Height Trees     | Medium     | BFS leaf trimming |
| 834  | Sum of Distances in Tree | Hard       | DFS re-rooting    |
