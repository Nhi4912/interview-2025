---
layout: page
title: "Lowest Common Ancestor of a Binary Search Tree"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Search Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree"
---

# Lowest Common Ancestor of a Binary Search Tree / Tổ Tiên Chung Thấp Nhất Của BST

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BST Property Navigation
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Trong BST, mọi node bên trái nhỏ hơn root, bên phải lớn hơn. Nếu p và q đều nhỏ hơn node → LCA ở bên trái. Đều lớn hơn → ở bên phải. Ngược chiều nhau (hoặc một trong hai = node) → node đó chính là LCA.

**Pattern Recognition:**

- Signal: "BST" + "find LCA" → **Navigate using BST property, no recursion through both subtrees needed**
- LCA là node đầu tiên mà p và q "phân kỳ" (diverge)
- Key insight: không cần traverse toàn bộ cây như binary tree LCA

**Visual — BST LCA bằng divergence point:**

```
BST:         p=2, q=8
      6
     / \
    2   8       ← Both 2 and 8: 2<6 và 8>6 → diverge at 6 ✅
   / \ / \      LCA = 6
  0  4 7  9

p=2, q=4:
  At 6: both < 6 → go left to 2
  At 2: p=2 = node → LCA = 2 ✅ (q=4 is in subtree of 2)
```

---

## Problem Description

Cho BST và hai node p, q đều tồn tại trong cây. Tìm **Lowest Common Ancestor (LCA)** — node thấp nhất mà cả p và q đều là descendant (một node là descendant của chính nó). ([LeetCode](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree))

**Example 1:** root=[6,2,8,0,4,7,9], p=2, q=8 → Output: `6`

**Example 2:** root=[6,2,8,0,4,7,9], p=2, q=4 → Output: `2`

Constraints: `2 <= n <= 10^5`, `-10^9 <= val <= 10^9`, p ≠ q, both guaranteed in tree

---

## 📝 Interview Tips

1. **Clarify**: "BST hay binary tree thường? BST có thể navigate không cần visit all nodes" / BST vs general tree — BST allows O(h) navigation
2. **BST property**: "Nếu p, q đều < node → đi trái; đều > node → đi phải; ngược chiều → LCA là node này" / Use BST property to decide direction
3. **Iterative vs recursive**: "Iterative dễ implement, tránh stack overflow" / Iterative avoids recursion overhead
4. **Complexity**: "O(h) time, O(1) space (iterative)" / O(h) where h is tree height
5. **Edge cases**: "p là ancestor của q (hoặc ngược lại) → đúng vì definition includes self" / One is ancestor of other — still works
6. **Follow-up**: "Nếu là binary tree thường (không phải BST)?" / General binary tree → problem 236, need full DFS

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
 * Solution 1: Recursive — using BST property
 * Time: O(h) — h = height of tree, O(log n) balanced, O(n) skewed
 * Space: O(h) — recursion call stack
 */
function lowestCommonAncestorRecursive(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode,
): TreeNode | null {
  if (!root) return null;
  if (p.val < root.val && q.val < root.val) return lowestCommonAncestorRecursive(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lowestCommonAncestorRecursive(root.right, p, q);
  // p and q diverge here, or one of them equals root
  return root;
}

/**
 * Solution 2: Iterative — O(1) space
 * Time: O(h) — traverse down from root
 * Space: O(1) — no recursion stack
 */
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  let node = root;
  while (node) {
    if (p.val < node.val && q.val < node.val) {
      node = node.left; // both in left subtree
    } else if (p.val > node.val && q.val > node.val) {
      node = node.right; // both in right subtree
    } else {
      // p and q are on different sides, or one equals node
      return node;
    }
  }
  return null;
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
function findNode(root: TreeNode | null, val: number): TreeNode | null {
  if (!root) return null;
  if (root.val === val) return root;
  return findNode(root.left, val) ?? findNode(root.right, val);
}

const bst = build([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]);
console.log(lowestCommonAncestor(bst, findNode(bst, 2)!, findNode(bst, 8)!)?.val); // 6
console.log(lowestCommonAncestor(bst, findNode(bst, 2)!, findNode(bst, 4)!)?.val); // 2
console.log(lowestCommonAncestor(bst, findNode(bst, 3)!, findNode(bst, 5)!)?.val); // 4
console.log(lowestCommonAncestor(bst, findNode(bst, 0)!, findNode(bst, 9)!)?.val); // 6
```

---

## 🔗 Related Problems

- [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) — bài khó hơn: general tree, cần DFS đầy đủ O(n)
- [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree) — verify BST property giống cách navigate ở đây
- [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst) — inorder traversal trên BST
- [Delete Node in a BST](https://leetcode.com/problems/delete-node-in-a-bst) — BST property navigation để tìm và xóa node
