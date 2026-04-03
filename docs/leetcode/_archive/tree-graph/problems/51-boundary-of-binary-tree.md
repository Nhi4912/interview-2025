---
layout: page
title: "Boundary of Binary Tree"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/boundary-of-binary-tree"
---

# Boundary of Binary Tree / Viền Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS (3 separate traversals)
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view) | [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đi bộ vòng quanh chu vi của một khu rừng — đi xuống bên trái, qua các cây ở đáy, rồi đi ngược lên bên phải. Chia thành 3 phần độc lập: left boundary, leaves, right boundary.

**Pattern Recognition:**

- Signal: "collect nodes at boundary of tree" → **3 separate DFS traversals**
- Left boundary: top-down, prefer left child, exclude leaves
- Leaves: any leaf node (both subtrees)
- Right boundary: bottom-up, prefer right child, exclude leaves

**Visual — 3 boundary parts:**

```
         1         ← root (always included)
        / \
       2   3
      / \   \
     4   5   6
        / \
       7   8

Left boundary (top→down, no leaves):  [2]
Leaves (left→right):                  [4, 7, 8, 6]
Right boundary (bottom→up, no leaves):[3]

Result: [1, 2, 4, 7, 8, 6, 3]
```

---

## Problem Description

Cho cây nhị phân, trả về danh sách **boundary** theo thứ tự ngược chiều kim đồng hồ: root → left boundary → leaves (left-right) → right boundary (bottom-up). Không được trùng lặp node. ([LeetCode](https://leetcode.com/problems/boundary-of-binary-tree))

**Example 1:** root=[1,null,2,3,4] → `[1,3,4,2]`

**Example 2:** root=[1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,null,null,11] → `[1,2,4,7,11,9,10,6,3]`

Constraints: `1 <= n <= 10^4`, `-1000 <= val <= 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Anticlockwise: root, left boundary, leaves, right boundary (reversed)" / Counter-clockwise direction means left-first order
2. **Three parts**: "Chia độc lập: leftBoundary, leaves, rightBoundary (reversed)" / Split into 3 independent collections
3. **Exclude leaves**: "Left/right boundary không include leaves — tránh duplicate" / Left and right boundary excludes leaf nodes to avoid duplicates
4. **Prefer child**: "Left boundary: prefer left child; right boundary: prefer right child" / Left boundary always goes left if possible
5. **Edge cases**: "Root là leaf → chỉ trả [root.val]; chỉ có root → [root.val]" / Root as leaf, single node, right-only tree
6. **Follow-up**: "Nếu là n-ary tree?" / Handle n-ary tree? → same 3-part approach with first/last child

---

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

/**
 * Solution: Three-pass DFS
 * Time: O(n) — each node visited at most once across all passes
 * Space: O(n) — result array + recursion stack O(h)
 */
function boundaryOfBinaryTree(root: TreeNode | null): number[] {
  if (!root) return [];

  const isLeaf = (node: TreeNode): boolean => !node.left && !node.right;
  const result: number[] = [root.val];

  // 1. Left boundary: top-down, prefer left, exclude leaves
  function addLeftBoundary(node: TreeNode | null): void {
    if (!node || isLeaf(node)) return;
    result.push(node.val);
    if (node.left) addLeftBoundary(node.left);
    else addLeftBoundary(node.right); // fall back to right if no left
  }

  // 2. All leaves: left-to-right inorder
  function addLeaves(node: TreeNode | null): void {
    if (!node) return;
    if (isLeaf(node)) {
      result.push(node.val);
      return;
    }
    addLeaves(node.left);
    addLeaves(node.right);
  }

  // 3. Right boundary: bottom-up (collect then reverse), prefer right, exclude leaves
  function addRightBoundary(node: TreeNode | null): void {
    if (!node || isLeaf(node)) return;
    if (node.right) addRightBoundary(node.right);
    else addRightBoundary(node.left); // fall back to left if no right
    result.push(node.val); // push AFTER recursion = bottom-up
  }

  if (!isLeaf(root)) {
    addLeftBoundary(root.left);
    addLeaves(root.left);
    addLeaves(root.right);
    addRightBoundary(root.right);
  } else {
    // Root is a leaf, already added root.val above
  }

  return result;
}

// === Test Cases ===
function build(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] == null) return null;
  const root = new TreeNode(vals[0]!);
  const q = [root];
  let i = 1;
  while (i < vals.length) {
    const node = q.shift()!;
    if (i < vals.length && vals[i] != null) {
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
}

console.log(boundaryOfBinaryTree(build([1, null, 2, 3, 4]))); // [1,3,4,2]
console.log(boundaryOfBinaryTree(build([1]))); // [1] — root is leaf
console.log(boundaryOfBinaryTree(build([1, 2, 3, 4, 5, 6, null]))); // [1,2,4,5,6,3]
console.log(boundaryOfBinaryTree(build([1, 2, 3, 4, null, null, 5]))); // [1,2,4,5,3]
```

---

## 🔗 Related Problems

- [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view) — collect rightmost node per level (right boundary variant)
- [Binary Tree Vertical Order Traversal](https://leetcode.com/problems/binary-tree-vertical-order-traversal) — column-based traversal
- [Zigzag Level Order Traversal](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal) — BFS with direction alternation
- [Binary Tree Leaves](https://leetcode.com/problems/find-leaves-of-binary-tree) — collect leaves level by level
