---
layout: page
title: "Path Sum"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/path-sum"
---

# Path Sum / Tổng Đường Đi

> **Difficulty**: 🟢 Easy | **Category**: Tree-Graph | **Pattern**: DFS with Running Sum

## 🧠 Intuition / Tư Duy

**Như kiểm tra xem có một con đường từ tầng trên xuống tầng trệt trong tòa nhà mà tổng phí qua mỗi tầng đúng bằng ngân sách không** — đi từ gốc xuống lá, cộng dồn chi phí từng node, kiểm tra khi đến lá.

**Pattern Recognition:**

- Root-to-leaf path + sum → DFS, trừ dần target hoặc cộng dồn
- Leaf node = cả hai con đều null → điểm kiểm tra
- Cây rỗng → false (không có đường nào)

**Visual:**

```
        5         targetSum = 22
       / \
      4   8
     /   / \
    11  13   4
   /  \       \
  7    2        1
Path 5→4→11→2 = 5+4+11+2 = 22 ✓
```

## Problem Description

Given the root of a binary tree and an integer `targetSum`, return `true` if there exists a root-to-leaf path such that adding up all node values equals `targetSum`. A leaf node has no children.

**Example 1:** Tree `[5,4,8,11,null,13,4,7,2,null,null,null,1]`, targetSum=22 → `true`
**Example 2:** Tree `[1,2,3]`, targetSum=5 → `false`

**Constraints:** 0 ≤ n ≤ 5000, -1000 ≤ node.val ≤ 1000, -10^9 ≤ targetSum ≤ 10^9

## 📝 Interview Tips

1. **Clarify**: Is it root-to-leaf only? Yes — leaf = both children null. What if tree is empty? Return false.
2. **Approach**: DFS subtracting node value from target; return true when remaining==0 at a leaf.
3. **Edge cases**: Empty tree → false. Single node → check node.val == target. Negative values allowed.
4. **Optimize**: Early return on first found path. BFS alternative also O(n).
5. **Follow-up**: What if you need to return all such paths? → Path Sum II (backtracking). Count paths not needing root-to-leaf? → Path Sum III.
6. **Complexity**: O(n) time, O(h) space where h is tree height (O(n) worst for skewed tree).

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

// Solution 1: Recursive DFS — subtract from target
// Time: O(n) | Space: O(h)
function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  if (!root) return false;
  const remaining = targetSum - root.val;
  // Leaf node check
  if (!root.left && !root.right) return remaining === 0;
  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}

// Solution 2: Iterative BFS with (node, remainingSum) pairs
// Time: O(n) | Space: O(n)
function hasPathSum2(root: TreeNode | null, targetSum: number): boolean {
  if (!root) return false;
  const queue: [TreeNode, number][] = [[root, targetSum - root.val]];

  while (queue.length > 0) {
    const [node, remaining] = queue.shift()!;
    if (!node.left && !node.right && remaining === 0) return true;
    if (node.left) queue.push([node.left, remaining - node.left.val]);
    if (node.right) queue.push([node.right, remaining - node.right.val]);
  }
  return false;
}

// Solution 3: Iterative DFS with explicit stack
// Time: O(n) | Space: O(h)
function hasPathSum3(root: TreeNode | null, targetSum: number): boolean {
  if (!root) return false;
  const stack: [TreeNode, number][] = [[root, targetSum - root.val]];

  while (stack.length > 0) {
    const [node, remaining] = stack.pop()!;
    if (!node.left && !node.right && remaining === 0) return true;
    if (node.right) stack.push([node.right, remaining - node.right.val]);
    if (node.left) stack.push([node.left, remaining - node.left.val]);
  }
  return false;
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
console.log(hasPathSum(buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]), 22)); // true
console.log(hasPathSum(buildTree([1, 2, 3]), 5)); // false
console.log(hasPathSum(null, 0)); // false
console.log(hasPathSum2(buildTree([1, 2]), 1)); // false (not leaf)
console.log(hasPathSum3(buildTree([-2, null, -3]), -5)); // true
```

## 🔗 Related Problems

| Problem                                                                             | Relationship                          |
| ----------------------------------------------------------------------------------- | ------------------------------------- |
| [Path Sum II](https://leetcode.com/problems/path-sum-ii/)                           | Return all valid paths (backtracking) |
| [Path Sum III](https://leetcode.com/problems/path-sum-iii/)                         | Count paths (not just root-to-leaf)   |
| [Sum Root to Leaf Numbers](https://leetcode.com/problems/sum-root-to-leaf-numbers/) | Same traversal, different combination |
