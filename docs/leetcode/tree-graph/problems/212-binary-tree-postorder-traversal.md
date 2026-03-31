---
layout: page
title: "Binary Tree Postorder Traversal"
difficulty: Easy
category: Tree-Graph
tags: [Stack, Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/binary-tree-postorder-traversal"
---

# Binary Tree Postorder Traversal / Duyệt Cây Nhị Phân Theo Thứ Tự Hậu Tố

## Analogy / Tương Tự

> Khi dọn nhà, bạn dọn phòng con cái trước, rồi phòng của bạn sau. **Postorder = con trái → con phải → cha**. Cha luôn được xử lý **sau** các con của nó.

## ASCII Visual

```
      1
     / \
    2   3
   / \
  4   5

Postorder: 4 → 5 → 2 → 3 → 1
(left subtree first, then right, finally root)
```

## Problem

Given the `root` of a binary tree, return the **postorder traversal** of its nodes' values (left → right → root).

## Interview Tips

1. **Recursive is trivial** — but interviewer likely wants iterative
2. **Iterative trick** — reverse of modified preorder (root→right→left reversed = left→right→root)
3. **Two-stack approach** — stack1 processes root→right→left, stack2 reverses it
4. **Morris traversal** — O(1) space but complex; mention only if pressed
5. **Null checks** — always handle null root
6. **Order matters** — postorder is used in: tree deletion, expression evaluation, dependency resolution

## Solutions

### Solution 1: Recursive

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

function postorderTraversalRecursive(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (!node) return;
    dfs(node.left);
    dfs(node.right);
    result.push(node.val);
  }
  dfs(root);
  return result;
}

// Build tree: [1,null,2,3]
const root1 = new TreeNode(1, null, new TreeNode(2, new TreeNode(3), null));
console.log(postorderTraversalRecursive(root1)); // [3, 2, 1]
console.log(postorderTraversalRecursive(null)); // []
```

### Solution 2: Iterative (Reverse Preorder)

```typescript
function postorderTraversal(root: TreeNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  const stack: TreeNode[] = [root];

  // Modified preorder: root → right → left, then reverse
  while (stack.length) {
    const node = stack.pop()!;
    result.push(node.val);
    if (node.left) stack.push(node.left); // left pushed second → processed last
    if (node.right) stack.push(node.right); // right pushed first → processed first
  }

  return result.reverse(); // reverses root→right→left to left→right→root
}

const root2 = new TreeNode(1, new TreeNode(2, new TreeNode(4), new TreeNode(5)), new TreeNode(3));
console.log(postorderTraversal(root2)); // [4, 5, 2, 3, 1]
```

### Solution 3: Iterative with Explicit State

```typescript
function postorderTraversalStack(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let curr: TreeNode | null = root;
  let lastVisited: TreeNode | null = null;

  while (curr || stack.length) {
    if (curr) {
      stack.push(curr);
      curr = curr.left;
    } else {
      const peek = stack[stack.length - 1];
      // If right child exists and not yet visited, go right
      if (peek.right && lastVisited !== peek.right) {
        curr = peek.right;
      } else {
        result.push(peek.val);
        lastVisited = stack.pop()!;
      }
    }
  }
  return result;
}

console.log(postorderTraversalStack(root2)); // [4, 5, 2, 3, 1]
```

## Related Problems

| #   | Problem                         | Difficulty | Tags       |
| --- | ------------------------------- | ---------- | ---------- |
| 94  | Binary Tree Inorder Traversal   | Easy       | Stack, DFS |
| 144 | Binary Tree Preorder Traversal  | Easy       | Stack, DFS |
| 145 | Binary Tree Postorder Traversal | Easy       | Stack, DFS |
| 590 | N-ary Tree Postorder Traversal  | Easy       | Stack, DFS |
