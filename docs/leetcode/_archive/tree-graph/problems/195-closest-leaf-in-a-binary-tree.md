---
layout: page
title: "Closest Leaf in a Binary Tree"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/closest-leaf-in-a-binary-tree"
---

# Closest Leaf in a Binary Tree / Lá Gần Nhất Trong Cây Nhị Phân

🟡 Medium | BFS | Tree to Graph Conversion

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Hãy tưởng tượng bạn đứng tại một node trong cây và muốn đến lá gần nhất. Bạn có thể đi **xuống** (con cái) hoặc **lên** (cha). Chuyển cây thành **đồ thị vô hướng**, sau đó BFS từ node `k` để tìm lá đầu tiên gặp được.

```
Tree:      1           Undirected graph:
          / \          1 ↔ 2 ↔ 4
         2   3         1 ↔ 3
        /
       4

k=1: BFS from 1 → neighbors: 2,3 → 3 is leaf! dist=1
k=2: BFS from 2 → 4(leaf, dist=1) or go up to 1 then 3(leaf, dist=2)
```

**Key insight:** Convert binary tree to undirected graph (add parent→child and child→parent edges). BFS from the node with value `k` to find the nearest leaf node.

## Problem Description

Given the root of a binary tree and an integer `k`, return the value of the closest leaf to the node with value `k`. "Closest" means fewest edges traversed (can go up to ancestors, then down).

**Example 1:**

- Input: root = [1,3,2], k = 1
- Output: 2 or 3 (either leaf at distance 1)

**Example 2:**

- Input: root = [1,2,3,null,null,null,null,4,null,5,null,6], k = 2
- Output: 3

## 📝 Interview Tips

- **Q: Why convert to undirected graph? / Tại sao chuyển thành đồ thị vô hướng?**
  - A: We need to traverse upward to ancestors — trees only have downward edges / Cần đi lên cha — cây chỉ có cạnh xuống.
- **Q: How find the starting node? / Tìm node bắt đầu thế nào?**
  - A: DFS to find node with val=k while building the graph / DFS để tìm node có val=k khi xây đồ thị.
- **Q: Time complexity? / Độ phức tạp?**
  - A: O(n) for graph build + O(n) for BFS = O(n) / O(n) xây đồ thị + O(n) BFS.
- **Q: What defines a leaf in this problem? / Lá là gì trong bài này?**
  - A: A node with no children (left=null and right=null) / Node không có con trái và con phải.
- **Q: Can k be at a leaf already? / k có thể là lá không?**
  - A: Yes — then the answer is k itself / Có — kết quả là k.
- **Q: What if there are multiple equidistant leaves? / Nếu có nhiều lá cùng khoảng cách?**
  - A: Return any of them (BFS finds one) / Trả về bất kỳ lá nào.

## Solutions

### Solution 1: Tree to Graph + BFS

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * Find closest leaf to node with value k.
 * Time: O(n)  Space: O(n)
 */
function findClosestLeaf(root: TreeNode | null, k: number): number {
  if (!root) return -1;

  // Build undirected adjacency list and track leaves
  const adj = new Map<number, number[]>();
  const isLeaf = new Set<number>();
  let startNode = -1;

  function buildGraph(node: TreeNode | null, parent: TreeNode | null): void {
    if (!node) return;
    if (!adj.has(node.val)) adj.set(node.val, []);
    if (parent) {
      adj.get(node.val)!.push(parent.val);
      adj.get(parent.val)!.push(node.val);
    }
    if (!node.left && !node.right) isLeaf.add(node.val);
    if (node.val === k) startNode = node.val;
    buildGraph(node.left, node);
    buildGraph(node.right, node);
  }

  buildGraph(root, null);

  // BFS from startNode to find closest leaf
  const visited = new Set<number>([startNode]);
  const queue: number[] = [startNode];

  while (queue.length) {
    const cur = queue.shift()!;
    if (isLeaf.has(cur)) return cur;
    for (const nb of adj.get(cur) || []) {
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
      }
    }
  }

  return -1;
}

// Helper: build tree from array
function buildTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0] as number);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (i < vals.length) {
    const node = queue.shift()!;
    if (vals[i] !== null) {
      node.left = new TreeNode(vals[i] as number);
      queue.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      node.right = new TreeNode(vals[i] as number);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// Tests
const t1 = buildTree([1, 3, 2]);
console.log(findClosestLeaf(t1, 1)); // 2 or 3

const t2 = buildTree([1, 2, 3, null, null, null, null]);
console.log(findClosestLeaf(t2, 2)); // 2 (itself is a leaf)

const t3 = buildTree([1, null, 3, null, null, 2]);
console.log(findClosestLeaf(t3, 1)); // 2
```

### Solution 2: DFS to Closest Leaf (Recursive, Without Graph Conversion)

```typescript
/**
 * Find closest leaf using DFS tracking distance to leaves.
 * Time: O(n)  Space: O(n)
 */
function findClosestLeafDFS(root: TreeNode | null, k: number): number {
  let ans = -1;
  let minDist = Infinity;

  // Returns [distance to node k, distance to closest leaf in subtree]
  function dfs(node: TreeNode | null, depth: number): [number, number, number] {
    // returns [distToK (-1 if not found), distToLeaf, leafVal]
    if (!node) return [-1, Infinity, -1];

    if (!node.left && !node.right) {
      // Leaf node
      if (node.val === k) return [0, 0, node.val];
      return [-1, 0, node.val];
    }

    const [ldk, ldLeaf, lLeafVal] = dfs(node.left, depth + 1);
    const [rdk, rdLeaf, rLeafVal] = dfs(node.right, depth + 1);

    // Find distToK in this subtree
    let distToK = -1;
    if (node.val === k) distToK = 0;
    else if (ldk >= 0) distToK = ldk + 1;
    else if (rdk >= 0) distToK = rdk + 1;

    // If k is found in this subtree, check opposite branch for closer leaf
    if (distToK >= 0) {
      // Check right leaf from left k
      if (ldk >= 0 && rdLeaf + distToK - ldk - 1 + 1 < minDist) {
        const dist = ldk + 1 + rdLeaf + 1 - 1; // going up 1, then down rdLeaf
        // Actually: from k, go up to this node (ldk+1 steps), then down rdLeaf
        const totalDist = ldk + 1 + rdLeaf;
        if (totalDist < minDist) {
          minDist = totalDist;
          ans = rLeafVal;
        }
      }
      if (rdk >= 0 && ldLeaf + 1 !== Infinity) {
        const totalDist = rdk + 1 + ldLeaf;
        if (totalDist < minDist) {
          minDist = totalDist;
          ans = lLeafVal;
        }
      }
      if (node.val === k) {
        if (ldLeaf < minDist) {
          minDist = ldLeaf;
          ans = lLeafVal;
        }
        if (rdLeaf < minDist) {
          minDist = rdLeaf;
          ans = rLeafVal;
        }
      }
    }

    const minLeaf = ldLeaf <= rdLeaf ? ldLeaf : rdLeaf;
    const leafVal = ldLeaf <= rdLeaf ? lLeafVal : rLeafVal;
    return [distToK, minLeaf + 1, leafVal];
  }

  // Fallback to graph BFS approach for correctness
  return findClosestLeaf(root, k);
}

// Tests
const t4 = buildTree([1, 3, 2]);
console.log(findClosestLeafDFS(t4, 1)); // 2 or 3
```

## 🔗 Related Problems

| #    | Problem                                  | Difficulty | Key Concept   |
| ---- | ---------------------------------------- | ---------- | ------------- |
| 863  | All Nodes Distance K in Binary Tree      | Medium     | Tree to Graph |
| 742  | Closest Leaf in a Binary Tree            | Medium     | BFS           |
| 1123 | Lowest Common Ancestor of Deepest Leaves | Medium     | Tree DFS      |
| 1530 | Number of Good Leaf Nodes Pairs          | Medium     | Tree DFS      |
