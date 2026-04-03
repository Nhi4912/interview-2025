---
layout: page
title: "Binary Tree Tilt"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/binary-tree-tilt"
---

# Binary Tree Tilt / Độ Nghiêng Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | [Same Tree](https://leetcode.com/problems/same-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như cân thăng bằng — mỗi nút là một chiếc cân, độ nghiêng là hiệu tuyệt đối giữa tổng bên trái và tổng bên phải. DFS postorder trả về tổng cây con và tích lũy tổng độ nghiêng trong một lần duyệt.

**Visual — postorder DFS accumulates tilt:**

```
Tree:     4
         / \
        2   9
       / \    \
      3   5    7

DFS(3): L=0 R=0 → tilt+=|0-0|=0, returns 3
DFS(5): L=0 R=0 → tilt+=|0-0|=0, returns 5
DFS(2): L=3 R=5 → tilt+=|3-5|=2, returns 10
DFS(7): L=0 R=0 → tilt+=|0-0|=0, returns 7
DFS(9): L=0 R=7 → tilt+=|0-7|=7, returns 16
DFS(4): L=10 R=16→ tilt+=|10-16|=6, returns 30

Total tilt = 0+0+2+0+7+6 = 15 ✓
```

---

## Problem Description

Given the root of a binary tree, return the **sum of every tree node's tilt**. The tilt of a node is the **absolute difference** between the sum of its left subtree values and the sum of its right subtree values. Missing subtrees have sum 0. ([LeetCode 563](https://leetcode.com/problems/binary-tree-tilt))

**Example 1:** root = [1,2,3] → **1** (node 1 tilt = |2−3| = 1)
**Example 2:** root = [4,2,9,3,5,null,7] → **15**
**Example 3:** root = [21,7,14,1,1,2,2,3,3] → **9**

**Constraints:** 0–10⁴ nodes, −1000 ≤ val ≤ 1000, answer fits 32-bit integer.

---

## 📝 Interview Tips

1. **Clarify**: "Tilt là giá trị tuyệt đối đúng không?" / Tilt is always ≥ 0 (absolute difference).
2. **Nhận dạng**: Cần subtree sum → postorder DFS: tính con trước, cha sau / Leaves first = postorder.
3. **Trick**: Dùng closure `totalTilt` bên ngoài thay vì trả về tuple / Closure keeps return value simple.
4. **Brute force trap**: Gọi subtreeSum riêng từng node → O(n²). One-pass DFS → O(n).
5. **Edge case**: Null root → 0; single node → 0 (both subtrees empty).
6. **Follow-up**: "Tìm node có tilt lớn nhất?" / Track max during the same DFS pass.

---

## Solutions

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * Solution 1: Brute Force — recompute subtree sum for every node
 * Time: O(n²) — subtreeSum is O(n), called for each of n nodes
 * Space: O(h) — recursion stack
 */
function findTiltBrute(root: TreeNode | null): number {
  const subtreeSum = (node: TreeNode | null): number => {
    if (!node) return 0;
    return node.val + subtreeSum(node.left) + subtreeSum(node.right);
  };
  const tilt = (node: TreeNode | null): number => {
    if (!node) return 0;
    return (
      Math.abs(subtreeSum(node.left) - subtreeSum(node.right)) + tilt(node.left) + tilt(node.right)
    );
  };
  return tilt(root);
}

/**
 * Solution 2: Optimal — single postorder DFS pass
 * Time: O(n) — each node visited once
 * Space: O(h) — O(log n) balanced, O(n) skewed
 */
function findTilt(root: TreeNode | null): number {
  let totalTilt = 0;

  // Returns subtree sum; accumulates tilt as side effect
  const dfs = (node: TreeNode | null): number => {
    if (!node) return 0;
    const leftSum = dfs(node.left);
    const rightSum = dfs(node.right);
    totalTilt += Math.abs(leftSum - rightSum);
    return node.val + leftSum + rightSum;
  };

  dfs(root);
  return totalTilt;
}

// === Test Cases ===
const buildTree = (vals: (number | null)[]): TreeNode | null => {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0]!);
  const q: TreeNode[] = [root];
  let i = 1;
  while (i < vals.length) {
    const node = q.shift()!;
    if (vals[i] != null) {
      node.left = new TreeNode(vals[i]!);
      q.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] != null) {
      node.right = new TreeNode(vals[i]!);
      q.push(node.right);
    }
    i++;
  }
  return root;
};

console.log(findTilt(buildTree([1, 2, 3]))); // 1
console.log(findTilt(buildTree([4, 2, 9, 3, 5, null, 7]))); // 15
console.log(findTilt(buildTree([21, 7, 14, 1, 1, 2, 2, 3, 3]))); // 9
console.log(findTilt(null)); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                          | Pattern       | Difficulty |
| ---------------------------------------------------------------------------------------------------------------- | ------------- | ---------- |
| [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree)                                 | DFS + closure | Easy       |
| [Path Sum III](https://leetcode.com/problems/path-sum-iii)                                                       | DFS postorder | Medium     |
| [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | DFS           | Medium     |
| [Same Tree](https://leetcode.com/problems/same-tree)                                                             | DFS           | Easy       |
| [Binary Tree Tilt — LeetCode](https://leetcode.com/problems/binary-tree-tilt)                                    | —             | Easy       |
