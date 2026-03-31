---
layout: page
title: "Lowest Common Ancestor of a Binary Tree"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree"
---

# Lowest Common Ancestor of a Binary Tree / Tổ Tiên Chung Thấp Nhất Của Cây Nhị Phân

> **Track**: Tree & Graph | **Difficulty**: 🟡 Medium | **Pattern**: Post-order DFS
> **Frequency**: 📗 Tier 1 — Gặp ở 40+ companies (Facebook, Amazon, Google, Microsoft)
> **See also**: [LCA of BST](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree) | [LCA of Deepest Leaves](https://leetcode.com/problems/lowest-common-ancestor-of-deepest-leaves)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai nút lá ngược lên gốc cây gia phả — LCA là người tổ đầu tiên mà cả hai đều có trong gia phả của mình. Trong DFS, khi một nút nhận kết quả từ cả hai con (hoặc là p/q), nó chính là LCA.

**Pattern Recognition:**

- Signal: "find lowest common ancestor", "binary tree" → **Post-order DFS**
- Recursive: trả về node nếu tìm thấy p hoặc q; nếu cả hai sub-tree trả về non-null → current node là LCA
- Iterative: track parent pointers, then walk ancestors of p to find first common with q's ancestors

**Visual — tree=[3,5,1,6,2,0,8], p=5, q=1:**

```
         3
        / \
       5   1    ← both found at depth 1, parent=3 is LCA
      / \ / \
     6  2 0  8

DFS(3): DFS(5)→finds p=5, returns 5
        DFS(1)→finds q=1, returns 1
        Both children non-null → node 3 is LCA ✅

If p=5, q=4 (child of 2 under 5):
DFS(5): DFS(6)→null, DFS(2)→finds 4, returns 4
        5 itself is p → return 5 (LCA=5 because it's ancestor of q=4)
```

---

## Problem Description

Given a binary tree and two nodes `p` and `q`, find their lowest common ancestor (LCA). The LCA is defined as the lowest node in the tree that has both `p` and `q` as descendants (a node can be a descendant of itself).

```
Example 1: tree=[3,5,1,6,2,0,8,null,null,7,4], p=5, q=1 → 3
Example 2: tree=[3,5,1,6,2,0,8,null,null,7,4], p=5, q=4 → 5
Example 3: tree=[1,2], p=1, q=2 → 1
```

Constraints: `2 <= number of nodes <= 10^5`, all values unique, `p ≠ q`, both p and q exist in the tree

---

## 📝 Interview Tips

1. **Clarify**: "p và q có chắc chắn tồn tại trong cây không?" / Both guaranteed in tree — simplifies base case.
2. **Post-order**: Xử lý children trước khi quyết định tại parent — return p/q if found, else null.
3. **Three cases**: (a) both subtrees return non-null → current is LCA; (b) only one → propagate that up; (c) current is p or q → return current (it covers the other as descendant).
4. **Iterative**: Dùng BFS/DFS để build parent map → walk p's ancestors → check which is first in q's ancestor set.
5. **BST variant**: If BST, use value comparison to navigate (LC 235) — O(log n) on balanced tree.
6. **Edge**: Root is p or q → root is always LCA.

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
 * Solution 1: Recursive Post-order DFS (Clean & Optimal)
 * Time: O(n) — visit every node once in worst case
 * Space: O(h) — call stack depth h (h=log n balanced, h=n skewed)
 *
 * Return value semantics:
 * - Return p or q if current node IS p or q
 * - Return null if neither p nor q found in subtree
 * - If both left and right are non-null → current node is LCA
 */
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (root === null || root === p || root === q) return root;

  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  // Both sides found p and q → this node is LCA
  if (left !== null && right !== null) return root;
  // Only one side found something → propagate it up
  return left !== null ? left : right;
}

/**
 * Solution 2: Iterative with Parent Pointers
 * Time: O(n) — DFS traversal + ancestor walk
 * Space: O(n) — parent map + ancestor set
 *
 * 1. DFS to build parent map for every node
 * 2. Collect all ancestors of p (including p itself) into a Set
 * 3. Walk q's ancestors upward until we find one in p's ancestor set
 */
function lowestCommonAncestor2(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (!root) return null;

  const parent = new Map<TreeNode, TreeNode | null>();
  parent.set(root, null);
  const stack: TreeNode[] = [root];

  // DFS to populate parent map for all nodes
  while (stack.length > 0 && (!parent.has(p) || !parent.has(q))) {
    const node = stack.pop()!;
    if (node.left) {
      parent.set(node.left, node);
      stack.push(node.left);
    }
    if (node.right) {
      parent.set(node.right, node);
      stack.push(node.right);
    }
  }

  // Collect all ancestors of p
  const ancestors = new Set<TreeNode>();
  let cur: TreeNode | null = p;
  while (cur !== null) {
    ancestors.add(cur);
    cur = parent.get(cur) ?? null;
  }

  // Walk q's ancestors upward until we hit one in p's ancestor set
  cur = q;
  while (cur !== null) {
    if (ancestors.has(cur)) return cur;
    cur = parent.get(cur) ?? null;
  }
  return null;
}

// === Test Cases ===
function buildTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0]!);
  const queue = [root];
  let i = 1;
  while (queue.length && i < vals.length) {
    const node = queue.shift()!;
    if (i < vals.length && vals[i] !== null) {
      node.left = new TreeNode(vals[i]!);
      queue.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      node.right = new TreeNode(vals[i]!);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

const tree1 = buildTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
const findNode = (root: TreeNode | null, val: number): TreeNode => {
  if (!root) return null as unknown as TreeNode; // guaranteed to exist in test
  if (root.val === val) return root;
  return findNode(root.left, val) ?? findNode(root.right, val);
};

console.log(lowestCommonAncestor(tree1, findNode(tree1!, 5), findNode(tree1!, 1))?.val); // 3
console.log(lowestCommonAncestor(tree1, findNode(tree1!, 5), findNode(tree1!, 4))?.val); // 5
console.log(lowestCommonAncestor2(tree1, findNode(tree1!, 5), findNode(tree1!, 1))?.val); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                | Relationship                                     |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| [236. Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) | This problem                                     |
| [235. Lowest Common Ancestor of a BST](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)  | Same but BST — use value comparison for O(log n) |
| [1644. LCA of Binary Tree II](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-ii/)               | p or q may not exist in tree                     |
| [1650. LCA of Binary Tree III](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iii/)             | Nodes have parent pointers                       |
| [1676. LCA of Binary Tree IV](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iv/)               | Multiple target nodes                            |
