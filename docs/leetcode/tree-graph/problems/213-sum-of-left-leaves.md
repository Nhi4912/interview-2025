---
layout: page
title: "Sum of Left Leaves"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/sum-of-left-leaves"
---

# Sum of Left Leaves / Tổng Các Lá Bên Trái

## Analogy / Tương Tự

> Trong một gia phả, "lá bên trái" là người **con trưởng không có con** (là con trái và không có con cái). Hãy tính tổng "số điểm" của tất cả những người như vậy.

## ASCII Visual

```
        3
       / \
      9   20
         /  \
        15   7

Left leaves: 9 (left child of 3, no children)
             15 (left child of 20, no children)
Sum = 9 + 15 = 24

Note: 7 is a RIGHT leaf → NOT counted
```

## Problem

Given the `root` of a binary tree, return the **sum of all left leaves**. A left leaf is a leaf node that is the left child of its parent.

## Interview Tips

1. **Track direction** — pass a boolean `isLeft` to know if current node is a left child
2. **Leaf check** — a leaf has no left AND no right child
3. **Only left leaves count** — right leaves are ignored even if they're leaves
4. **BFS alternative** — use queue, tag each item with direction
5. **Base cases** — null node returns 0; leaf returns val only if isLeft=true
6. **Edge case** — single node tree: root is not a left leaf, return 0

## Solutions

### Solution 1: DFS Recursive

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

function sumOfLeftLeaves(root: TreeNode | null): number {
  function dfs(node: TreeNode | null, isLeft: boolean): number {
    if (!node) return 0;
    // It's a left leaf
    if (!node.left && !node.right && isLeft) return node.val;
    return dfs(node.left, true) + dfs(node.right, false);
  }
  return dfs(root, false);
}

// Build: [3,9,20,null,null,15,7]
const root1 = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
console.log(sumOfLeftLeaves(root1)); // 24
console.log(sumOfLeftLeaves(new TreeNode(1))); // 0
```

### Solution 2: BFS Iterative

```typescript
function sumOfLeftLeavesBFS(root: TreeNode | null): number {
  if (!root) return 0;
  let sum = 0;
  // Queue stores [node, isLeft]
  const queue: [TreeNode, boolean][] = [[root, false]];

  while (queue.length) {
    const [node, isLeft] = queue.shift()!;
    if (!node.left && !node.right) {
      if (isLeft) sum += node.val;
      continue;
    }
    if (node.left) queue.push([node.left, true]);
    if (node.right) queue.push([node.right, false]);
  }
  return sum;
}

console.log(sumOfLeftLeavesBFS(root1)); // 24
```

### Solution 3: Iterative DFS with Stack

```typescript
function sumOfLeftLeavesStack(root: TreeNode | null): number {
  if (!root) return 0;
  let sum = 0;
  const stack: [TreeNode, boolean][] = [[root, false]];

  while (stack.length) {
    const [node, isLeft] = stack.pop()!;
    if (!node.left && !node.right) {
      if (isLeft) sum += node.val;
      continue;
    }
    if (node.right) stack.push([node.right, false]);
    if (node.left) stack.push([node.left, true]);
  }
  return sum;
}

const root2 = new TreeNode(1, new TreeNode(2, new TreeNode(4), new TreeNode(5)), new TreeNode(3));
console.log(sumOfLeftLeavesStack(root2)); // 4 (only node 4 is a left leaf)
```

## Related Problems

| #    | Problem                            | Difficulty | Tags      |
| ---- | ---------------------------------- | ---------- | --------- |
| 112  | Path Sum                           | Easy       | DFS, Tree |
| 257  | Binary Tree Paths                  | Easy       | DFS, Tree |
| 1022 | Sum of Root To Leaf Binary Numbers | Easy       | DFS       |
| 1448 | Count Good Nodes in Binary Tree    | Medium     | DFS       |
