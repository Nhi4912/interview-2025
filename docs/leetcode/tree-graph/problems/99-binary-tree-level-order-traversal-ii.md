---
layout: page
title: "Binary Tree Level Order Traversal II"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/binary-tree-level-order-traversal-ii"
---

# Binary Tree Level Order Traversal II / Duyệt Cây Nhị Phân Theo Tầng (Ngược)

> **Difficulty**: 🟡 Medium | **Category**: Tree-Graph | **Pattern**: BFS Level-by-Level + Reverse

## 🧠 Intuition / Tư Duy

**Như đọc tầng lầu từ dưới lên trên** — trong một tòa nhà, thay vì liệt kê từ tầng cao nhất xuống, bạn đọc từ tầng trệt lên. Đơn giản chỉ cần duyệt BFS bình thường rồi đảo ngược kết quả.

**Pattern Recognition:**

- Level-order (BFS) bình thường → thu thập từng tầng → reverse cuối cùng
- Hoặc dùng `unshift` thay vì `push` để thêm mỗi tầng vào đầu
- BFS với queue, process từng level một batch

**Visual:**

```
     3
    / \
   9  20
     /  \
    15   7
BFS: [[3],[9,20],[15,7]]
Reversed: [[15,7],[9,20],[3]]
```

## Problem Description

Given the root of a binary tree, return the bottom-up level order traversal — nodes at the deepest level first, then up to root level, left to right within each level.

**Example:** Tree `[3,9,20,null,null,15,7]` → `[[15,7],[9,20],[3]]`

**Constraints:** 0 ≤ n ≤ 2000, -1000 ≤ node.val ≤ 1000

## 📝 Interview Tips

1. **Clarify**: Bottom-up means deepest level first. Within each level, left-to-right order is preserved.
2. **Approach**: Standard BFS collecting each level, then reverse the result array.
3. **Edge cases**: Empty tree → `[]`. Single node → `[[root.val]]`. All left children (skewed tree) fine.
4. **Optimize**: Prepend each level to result using `unshift` to avoid O(n) final reverse — but `reverse()` is cleaner.
5. **Follow-up**: What if you need right-to-left within each level too? Alternate direction each level → Zigzag traversal.
6. **Complexity**: O(n) time, O(n) space for queue + result.

## Solutions

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

// Solution 1: BFS + reverse
// Time: O(n) | Space: O(n)
function levelOrderBottom(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const level: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }

  return result.reverse();
}

// Solution 2: BFS with unshift (prepend each level)
// Time: O(n) | Space: O(n)
function levelOrderBottom2(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const level: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.unshift(level); // Prepend instead of append
  }

  return result;
}

// Solution 3: DFS collecting levels by depth, then reverse
// Time: O(n) | Space: O(n)
function levelOrderBottom3(root: TreeNode | null): number[][] {
  const levels: number[][] = [];

  function dfs(node: TreeNode | null, depth: number): void {
    if (!node) return;
    if (depth === levels.length) levels.push([]);
    levels[depth].push(node.val);
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }

  dfs(root, 0);
  return levels.reverse();
}

// Helper
function buildTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0] as number);
  const queue = [root];
  let i = 1;
  while (i < vals.length) {
    const node = queue.shift()!;
    if (i < vals.length && vals[i] !== null) {
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
console.log(JSON.stringify(levelOrderBottom(buildTree([3, 9, 20, null, null, 15, 7]))));
// [[15,7],[9,20],[3]]

console.log(JSON.stringify(levelOrderBottom2(buildTree([1]))));
// [[1]]

console.log(JSON.stringify(levelOrderBottom3(null)));
// []

console.log(JSON.stringify(levelOrderBottom(buildTree([1, 2, 3, 4, 5]))));
// [[4,5],[2,3],[1]]
```

## 🔗 Related Problems

| Problem                                                                                                             | Relationship                            |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)               | Same, top-down version                  |
| [Binary Tree Zigzag Level Order Traversal](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/) | Level order with alternating direction  |
| [Average of Levels in Binary Tree](https://leetcode.com/problems/average-of-levels-in-binary-tree/)                 | Same BFS pattern, different computation |
