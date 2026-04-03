---
layout: page
title: "Diameter of Binary Tree"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/diameter-of-binary-tree"
---

# Diameter of Binary Tree / Đường Kính Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | [Same Tree](https://leetcode.com/problems/same-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tìm con đường dài nhất giữa hai làng qua một ngọn đồi — đỉnh đồi là "nút giao" giữa hai nhánh. Tại mỗi nút, đường kính đi qua nút đó = chiều cao nhánh trái + chiều cao nhánh phải.

**Pattern Recognition:**

- Signal: "longest path in tree" + "path may not pass through root" → **DFS returning height, update global max**
- At each node: diameter candidate = `leftHeight + rightHeight`
- Key insight: DFS returns **height** (for parent's use), but updates **global diameter** at each node

**Visual — Diameter calculation:**

```
        1
       / \
      2   3
     / \
    4   5

DFS post-order:
  node 4: left=0, right=0 → height=1, diam candidate=0
  node 5: left=0, right=0 → height=1, diam candidate=0
  node 2: left=1, right=1 → height=2, diam candidate=2 ← global max!
  node 3: left=0, right=0 → height=1, diam candidate=0
  node 1: left=2, right=1 → height=3, diam candidate=3 ← new max!

Answer: 3 (path: 4→2→1→3  or  5→2→1→3)
```

---

## Problem Description

Given the root of a binary tree, return the length of the **diameter** of the tree — the length of the longest path between any two nodes. The path may or may not pass through the root. Length is measured in number of edges.

- Example 1: `[1,2,3,4,5]` → `3` (path 4→2→1→3 or 5→2→1→3)
- Example 2: `[1,2]` → `1`

Constraints: `1 <= nodes <= 10^4`, node values `-100 to 100`.

---

## 📝 Interview Tips

1. **Clarify**: "Đường kính tính bằng số cạnh (edges), không phải số nút" / Diameter = edges, not nodes; path [4,2,1,3] has 3 edges
2. **Brute force O(n²)**: "Với mỗi nút tính height(left)+height(right) — gọi height() O(n) → tổng O(n²)" / Naive: recompute height per node is O(n²)
3. **Optimal O(n)**: "DFS trả về height, đồng thời update global max diameter tại mỗi nút" / Single DFS pass: return height up, update max sideways
4. **Return value**: "DFS trả về HEIGHT (cho parent dùng), không trả về diameter" / Common mistake: returning diameter instead of height
5. **Edge cases**: "Root null → 0; single node → 0; linear tree → n-1" / Null/single node = 0; chain = n-1 edges
6. **Follow-up**: "Diameter của N-ary tree? Weighted edges? Same approach, adjust height/path calculation" / Generalizes naturally

---

## Solutions

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val = 0) {
    this.val = val;
  }
}

/**
 * Solution 1: Brute Force O(n²) — compute height at each node separately
 * Time: O(N^2) — height() called once per node
 * Space: O(H) — recursion depth
 */
function diameterOfBinaryTreeBrute(root: TreeNode | null): number {
  function height(node: TreeNode | null): number {
    if (!node) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  }

  function diam(node: TreeNode | null): number {
    if (!node) return 0;
    const throughRoot = height(node.left) + height(node.right);
    return Math.max(throughRoot, diam(node.left), diam(node.right));
  }

  return diam(root);
}

/**
 * Solution 2: Single DFS — return height, update global max diameter
 * Time: O(N) — each node visited exactly once
 * Space: O(H) — recursion stack (H = tree height)
 */
function diameterOfBinaryTree(root: TreeNode | null): number {
  let maxDiameter = 0;

  function dfs(node: TreeNode | null): number {
    if (!node) return 0;
    const leftH = dfs(node.left);
    const rightH = dfs(node.right);
    maxDiameter = Math.max(maxDiameter, leftH + rightH);
    return 1 + Math.max(leftH, rightH); // return height to parent
  }

  dfs(root);
  return maxDiameter;
}

// === Test Cases ===
// Build [1,2,3,4,5]
const t1 = new TreeNode(1);
t1.left = new TreeNode(2);
t1.right = new TreeNode(3);
t1.left.left = new TreeNode(4);
t1.left.right = new TreeNode(5);
console.log(diameterOfBinaryTree(t1)); // 3

// Build [1,2]
const t2 = new TreeNode(1);
t2.left = new TreeNode(2);
console.log(diameterOfBinaryTree(t2)); // 1

// Single node
console.log(diameterOfBinaryTree(new TreeNode(1))); // 0

// Linear chain 1→2→3→4
const t4 = new TreeNode(1);
t4.right = new TreeNode(2);
t4.right.right = new TreeNode(3);
t4.right.right.right = new TreeNode(4);
console.log(diameterOfBinaryTree(t4)); // 3
```

---

## 🔗 Related Problems

- [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum) — same DFS pattern but with weighted sums
- [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) — DFS returning node info up the tree
- [Height of Binary Tree After Subtree Removal Queries](https://leetcode.com/problems/height-of-binary-tree-after-subtree-removal-queries) — height calculation variants
- [Balanced Binary Tree](https://leetcode.com/problems/balanced-binary-tree) — DFS returning height to check balance
