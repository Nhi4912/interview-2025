---
layout: page
title: "Maximum Width of Binary Tree"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/maximum-width-of-binary-tree"
---

# Maximum Width of Binary Tree / Chiều Rộng Tối Đa Của Cây Nhị Phân

> **Difficulty**: 🟡 Medium | **Category**: Tree-Graph | **Pattern**: BFS with Node Indexing

## 🧠 Intuition / Tư Duy

**Như đo chiều rộng mỗi tầng trong một tòa nhà có nhiều căn phòng bỏ trống** — chiều rộng = khoảng cách từ căn phòng đầu tiên đến cuối cùng ở mỗi tầng, kể cả các phòng trống ở giữa. Đánh số mỗi node như heap array: node i có con trái 2i và con phải 2i+1.

**Pattern Recognition:**

- Width tính cả null nodes ở giữa → cần index vị trí trong "perfect binary tree"
- BFS theo tầng, lưu index mỗi node → width = lastIndex - firstIndex + 1
- Integer overflow risk: normalize indices mỗi tầng (subtract min of level)

**Visual:**

```
        1 [idx=1]
       / \
      3   2   [idx=2,3]
     / \   \
    5   3   9  [idx=4,5,7]
Level 3 width = 7-4+1 = 4 (includes null at index 6)
Answer = max(1, 2, 4) = 4
```

## Problem Description

Given the root of a binary tree, return the **maximum width** of the tree. Width of a level = number of nodes between leftmost and rightmost non-null nodes (including null nodes in between).

**Example:** Tree `[1,3,2,5,3,null,9]` → `4` (level 3: positions 5,3,\_,9 = width 4)

**Constraints:** 1 ≤ n ≤ 3000, -100 ≤ node.val ≤ 100

## 📝 Interview Tips

1. **Clarify**: Width includes gaps between leftmost and rightmost nodes at a level. Null nodes between count.
2. **Approach**: BFS with (node, index) pairs. For root index=0 (or 1), left child = 2*i, right = 2*i+1.
3. **Edge cases**: Single node → 1. All left-leaning → always 1. Normalize indices per level to prevent BigInt overflow.
4. **Optimize**: Normalize: subtract the first index of each level from all indices at that level. Prevents 2^3000 numbers.
5. **Follow-up**: What's the diameter of a binary tree? That's a different problem (longest path), use DFS.
6. **Complexity**: O(n) time, O(n) space for BFS queue.

## Solutions

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val; this.left = left; this.right = right;
  }
}

// Solution 1: BFS with index normalization per level
// Time: O(n) | Space: O(n)
function widthOfBinaryTree(root: TreeNode | null): number {
  if (!root) return 0;
  let maxWidth = 0;
  // Queue stores [node, index] pairs
  let queue: [TreeNode, number][] = [[root, 0]];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const firstIdx = queue[0][1];
    let lastIdx = firstIdx;

    const nextQueue: [TreeNode, number][] = [];
    for (let i = 0; i < levelSize; i++) {
      const [node, idx] = queue[i];
      // Normalize to prevent overflow
      const normalizedIdx = idx - firstIdx;
      lastIdx = normalizedIdx;

      if (node.left) nextQueue.push([node.left, 2 * normalizedIdx]);
      if (node.right) nextQueue.push([node.right, 2 * normalizedIdx + 1]);
    }

    maxWidth = Math.max(maxWidth, lastIdx - 0 + 1);
    queue = nextQueue;
  }

  return maxWidth;
}

// Solution 2: DFS tracking (depth → first index at that depth)
// Time: O(n) | Space: O(h)
function widthOfBinaryTree2(root: TreeNode | null): number {
  const firstIdxAtDepth: number[] = [];
  let maxWidth = 0;

  function dfs(node: TreeNode | null, depth: number, idx: number): void {
    if (!node) return;
    // Normalize: subtract first index at this depth
    if (depth === firstIdxAtDepth.length) {
      firstIdxAtDepth.push(idx);
    }
    const normalizedIdx = idx - firstIdxAtDepth[depth];
    maxWidth = Math.max(maxWidth, normalizedIdx + 1);

    dfs(node.left, depth + 1, 2 * normalizedIdx);
    dfs(node.right, depth + 1, 2 * normalizedIdx + 1);
  }

  dfs(root, 0, 0);
  return maxWidth;
}

// Helper
function buildTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0] as number);
  const queue = [root];
  let i = 1;
  while (i < vals.length) {
    const node = queue.shift()!;
    if (i < vals.length && vals[i] !== null) { node.left = new TreeNode(vals[i] as number); queue.push(node.left); }
    i++;
    if (i < vals.length && vals[i] !== null) { node.right = new TreeNode(vals[i] as number); queue.push(node.right); }
    i++;
  }
  return root;
}

// Tests
console.log(widthOfBinaryTree(buildTree([1,3,2,5,3,null,9])));               // 4
console.log(widthOfBinaryTree(buildTree([1,3,2,5,null,null,9,6,null,7]))));  // 7
console.log(widthOfBinaryTree2(buildTree([1])));                             // 1
console.log(widthOfBinaryTree2(buildTree([1,2,3,null,4,null,5])));           // 2
console.log(widthOfBinaryTree(buildTree([1,2,null,3,null,4,null,5])));       // 1
```

## 🔗 Related Problems

| Problem                                                                                                   | Relationship                              |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)     | BFS level-by-level foundation             |
| [Find Largest Value in Each Tree Row](https://leetcode.com/problems/find-largest-value-in-each-tree-row/) | Same BFS structure, different aggregation |
| [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/)                         | Width in different sense (longest path)   |
