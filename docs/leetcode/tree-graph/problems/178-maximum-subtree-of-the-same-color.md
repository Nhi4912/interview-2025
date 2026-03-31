---
layout: page
title: "Maximum Subtree of the Same Color"
difficulty: Medium
category: Tree-Graph
tags: [Array, Dynamic Programming, Tree, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/maximum-subtree-of-the-same-color"
---

# Maximum Subtree of the Same Color / Cây Con Tối Đa Cùng Màu

🟡 Medium | Post-order DFS: Color Uniformity Check | [LeetCode 2440](https://leetcode.com/problems/maximum-subtree-of-the-same-color)

---

## 🧠 Intuition / Trực giác

**Vietnamese:** Duyệt cây theo thứ tự hậu (post-order DFS). Với mỗi nút, kiểm tra xem tất cả các nút trong cây con của nó có cùng màu không. Một cây con "hợp lệ" khi: màu nút hiện tại = màu tất cả con, VÀ tất cả cây con của con cũng hợp lệ. Trả về kích thước lớn nhất.

```
colors=[1,1,2,1,3,2]  edges=[[0,1],[0,2],[1,3],[1,4],[2,5]]
       0(1)
      / \
   1(1)  2(2)
  / \     \
3(1) 4(3)  5(2)

Post-order at node 1: children=[3,4]
  node3: color=1, size=1, allSameColor=true
  node4: color=3, size=1, allSameColor=true
  node1: colors[1]=1 ≠ colors[4]=3 → NOT uniform
  → size of subtree(1) = 3 but not all same color

Post-order at node 2: child=[5], colors[2]=colors[5]=2 → VALID, size=2
ans = max valid subtree size
```

---

## 📝 Interview Tips / Gợi ý phỏng vấn

- 🔑 **EN:** Post-order DFS: children first, then decide validity for current node | **VI:** Xử lý con trước, rồi quyết định nút hiện tại
- 🔑 **EN:** Track two values per node: subtree_size and is_uniform (all same color) | **VI:** Mỗi nút lưu: kích thước cây con và có đồng màu không
- 🔑 **EN:** A node's subtree is uniform if its color matches ALL children's color AND all children are uniform | **VI:** Đồng màu khi màu khớp tất cả con VÀ tất cả con cũng đồng màu
- 🔑 **EN:** Leaf nodes are always valid (trivially all same color) | **VI:** Nút lá luôn hợp lệ
- 🔑 **EN:** Build adjacency list, not just parent-child (edges undirected → root at 0) | **VI:** Xây danh sách kề, đồ thị vô hướng → gốc tại 0
- 🔑 **EN:** Time O(n) with iterative DFS to avoid stack overflow on large n | **VI:** O(n) với DFS lặp để tránh tràn ngăn xếp

---

## 💡 Solutions / Giải pháp

```typescript
/**
 * Post-order DFS — Track uniform subtree sizes
 * Time: O(n)  Space: O(n) for adjacency list + recursion stack
 */
function maximumSubtreeSize(edges: number[][], colors: number[]): number {
  const n = colors.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  let ans = 1;
  // Returns [subtree_size, is_uniform_color]
  const dfs = (node: number, parent: number): [number, boolean] => {
    let size = 1;
    let uniform = true;

    for (const child of adj[node]) {
      if (child === parent) continue;
      const [childSize, childUniform] = dfs(child, node);
      size += childSize;
      // Not uniform if child color differs OR child subtree isn't uniform
      if (!childUniform || colors[child] !== colors[node]) uniform = false;
    }

    if (uniform) ans = Math.max(ans, size);
    return [size, uniform];
  };

  dfs(0, -1);
  return ans;
}

// Test cases
console.log(
  maximumSubtreeSize(
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
    ],
    [1, 1, 2, 1, 3, 2],
  ),
); // 2
console.log(
  maximumSubtreeSize(
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
    ],
    [1, 1, 1, 1, 1, 1],
  ),
); // 6
console.log(maximumSubtreeSize([[0, 1]], [1, 2])); // 1
```

```typescript
/**
 * Iterative post-order DFS using explicit stack
 * Time: O(n)  Space: O(n) — avoids call stack overflow
 */
function maximumSubtreeSizeIter(edges: number[][], colors: number[]): number {
  const n = colors.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const parent = new Array(n).fill(-1);
  const order: number[] = [];
  const visited = new Array(n).fill(false);

  // Build post-order using iterative DFS
  const stack = [0];
  visited[0] = true;
  while (stack.length) {
    const node = stack.pop()!;
    order.push(node);
    for (const child of adj[node]) {
      if (!visited[child]) {
        visited[child] = true;
        parent[child] = node;
        stack.push(child);
      }
    }
  }

  const size = new Array(n).fill(1);
  const uniform = new Array(n).fill(true);
  let ans = 1;

  // Process in reverse order (leaves first)
  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];
    for (const child of adj[node]) {
      if (child === parent[node]) continue;
      size[node] += size[child];
      if (!uniform[child] || colors[child] !== colors[node]) uniform[node] = false;
    }
    if (uniform[node]) ans = Math.max(ans, size[node]);
  }

  return ans;
}

console.log(
  maximumSubtreeSizeIter(
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
    ],
    [1, 1, 2, 1, 3, 2],
  ),
); // 2
console.log(
  maximumSubtreeSizeIter(
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
    ],
    [1, 1, 1, 1, 1, 1],
  ),
); // 6
```

---

## 🔗 Related Problems / Bài liên quan

| Problem                                                                                                                      | Difficulty | Key Idea                |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| [Subtree of Another Tree 572](https://leetcode.com/problems/subtree-of-another-tree)                                         | Easy       | Tree matching via DFS   |
| [Count Good Nodes in Binary Tree 1448](https://leetcode.com/problems/count-good-nodes-in-binary-tree)                        | Medium     | Post-order DFS counting |
| [Binary Tree Cameras 968](https://leetcode.com/problems/binary-tree-cameras)                                                 | Hard       | Post-order greedy DP    |
| [Max Points After Collecting Coins 2930](https://leetcode.com/problems/maximum-points-after-collecting-coins-from-all-nodes) | Hard       | Tree DP                 |
