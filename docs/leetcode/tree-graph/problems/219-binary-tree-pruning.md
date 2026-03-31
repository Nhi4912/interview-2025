---
layout: page
title: "Binary Tree Pruning"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/binary-tree-pruning"
---

# Binary Tree Pruning / Cắt Tỉa Cây Nhị Phân

## Analogy / Tương Tự

> Bạn có một cây bonsai. Quy tắc: **cắt bỏ mọi cành không có lá giá trị 1**. Một cành được giữ lại chỉ khi bản thân nó hoặc ít nhất một nhánh con của nó chứa số 1. Cắt từ dưới lên (hậu tố).

## ASCII Visual

```
Input:           After pruning:
      1                1
     / \              / \
    0   1            0   1
   / \   \            \
  0   0   0            (no children - subtrees had no 1s)

Left subtree of 1: nodes 0,0,0 → prune all
Right subtree: 1,0 → keep 1, prune 0
Result: 1 → right=1, left=0(no children)
```

## Problem

Given the `root` of a binary tree where every node has value 0 or 1. Prune the tree so that subtrees **not containing a 1** are removed. Return the root of the pruned tree (null if root itself should be removed).

## Interview Tips

1. **Postorder DFS** — process children before deciding parent (bottom-up)
2. **Prune condition** — remove a node if: value=0 AND no left child AND no right child (after recursive pruning)
3. **Null check** — if node is null, return null
4. **In-place modification** — set child to null when pruned
5. **Root itself** — may become null if it's 0 with no surviving children
6. **Time/Space** — O(n) time, O(h) space for recursion stack

## Solutions

### Solution 1: Recursive Postorder

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

function pruneTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;

  // First prune children (postorder)
  root.left = pruneTree(root.left);
  root.right = pruneTree(root.right);

  // Prune this node if it's 0 with no surviving children
  if (root.val === 0 && !root.left && !root.right) return null;

  return root;
}

// Helper to serialize tree
function serialize(root: TreeNode | null): string {
  if (!root) return "null";
  return `[${root.val},${serialize(root.left)},${serialize(root.right)}]`;
}

// Test 1: [1,null,0,0,1] → [1,null,0,null,1]
const t1 = new TreeNode(1, null, new TreeNode(0, new TreeNode(0), new TreeNode(1)));
console.log(serialize(pruneTree(t1))); // [1,null,[0,null,[1,null,null]]]

// Test 2: [1,0,1,0,0,0,1]
const t2 = new TreeNode(
  1,
  new TreeNode(0, new TreeNode(0), new TreeNode(0)),
  new TreeNode(1, new TreeNode(0), new TreeNode(1)),
);
console.log(serialize(pruneTree(t2)));
```

### Solution 2: Helper Function (Returns containsOne)

```typescript
function pruneTreeV2(root: TreeNode | null): TreeNode | null {
  function containsOne(node: TreeNode | null): boolean {
    if (!node) return false;
    const leftHas = containsOne(node.left);
    const rightHas = containsOne(node.right);
    if (!leftHas) node.left = null;
    if (!rightHas) node.right = null;
    return node.val === 1 || leftHas || rightHas;
  }

  return containsOne(root) ? root : null;
}

const t3 = new TreeNode(
  1,
  new TreeNode(0, new TreeNode(0), new TreeNode(0)),
  new TreeNode(1, new TreeNode(0), new TreeNode(1)),
);
console.log(serialize(pruneTreeV2(t3)));
```

### Solution 3: Iterative Postorder

```typescript
function pruneTreeIterative(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  const stack: [TreeNode, TreeNode | null, boolean][] = [[root, null, false]];

  while (stack.length) {
    const [node, parent, isLeft] = stack[stack.length - 1];

    if (!node.left && !node.right) {
      // Leaf: prune if 0
      stack.pop();
      if (node.val === 0 && parent) {
        if (isLeft) parent.left = null;
        else parent.right = null;
      }
    } else {
      // Push unvisited children
      stack.pop();
      stack.push([node, parent, isLeft]); // re-push to process after children
      if (node.right) stack.push([node.right, node, false]);
      if (node.left) stack.push([node.left, node, true]);
    }
  }

  return root.val === 0 && !root.left && !root.right ? null : root;
}

const t4 = new TreeNode(0, new TreeNode(0, new TreeNode(0), null), new TreeNode(1));
console.log(serialize(pruneTreeIterative(t4))); // only right subtree with 1
```

## Related Problems

| #    | Problem                          | Difficulty | Tags      |
| ---- | -------------------------------- | ---------- | --------- |
| 814  | Binary Tree Pruning (this)       | Medium     | DFS, Tree |
| 669  | Trim a Binary Search Tree        | Medium     | DFS, BST  |
| 112  | Path Sum                         | Easy       | DFS       |
| 1325 | Delete Leaves With a Given Value | Medium     | DFS, Tree |
