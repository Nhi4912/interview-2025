---
layout: page
title: "Subtree of Another Tree"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Depth-First Search, String Matching, Binary Tree, Hash Function]
leetcode_url: "https://leetcode.com/problems/subtree-of-another-tree"
---

# Subtree of Another Tree / Cây Con Của Cây Khác

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DFS + isSameTree
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Same Tree](https://leetcode.com/problems/same-tree) | [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như tìm một đoạn nhạc trong bản nhạc dài — với mỗi vị trí trong bản nhạc chính (root), thử so khớp với đoạn nhạc cần tìm (subRoot). Nếu khớp thì tìm thấy; không thì tìm ở trái/phải.

**Pattern Recognition:**

- Signal: "is subRoot a subtree of root?" → **DFS on root, isSameTree at each node**
- Composed problem: `isSubtree = isSameTree(root, subRoot) || isSubtree(root.left) || isSubtree(root.right)`
- Optimize: serialize trees to strings → use KMP/string matching for O(M+N)

**Visual:**

```
root:           subRoot:
    3               4
   / \             / \
  4   5           1   2
 / \
1   2

Check isSameTree(4, 4)? Yes! → true ✓

root:           subRoot:
    3               4
   / \             / \
  4   5           1   2
 / \
1   2
    \
     0
isSameTree(node4, subRoot4)? No (node4 has extra child 0) → false ✗
```

---

## Problem Description

Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a node in `root` whose subtree is **identical** (same structure and node values) to `subRoot`.

**Example 1:** `root=[3,4,5,1,2]`, `subRoot=[4,1,2]` → `true`
**Example 2:** `root=[3,4,5,1,2,null,null,null,null,0]`, `subRoot=[4,1,2]` → `false` (extra node 0)

Constraints: root has `1–2000` nodes, subRoot has `1–1000` nodes, `-10⁴ ≤ val ≤ 10⁴`.

---

## 📝 Interview Tips

1. **Decompose**: "Chia thành 2 hàm: `isSameTree` và `isSubtree`" / Break into two clean helper functions
2. **isSameTree base cases**: "Cả hai null → true; một null → false; giá trị khác → false" / Handle null cases first in isSameTree
3. **Complexity**: "O(M·N) với M, N là kích thước 2 cây — acceptable với constraints" / O(M·N) is fine for given constraints
4. **Serialize optimization**: "Serialize cả 2 cây thành string, dùng KMP → O(M+N)" / String + KMP reduces to O(M+N)
5. **Edge cases**: "subRoot là single node? root == subRoot? subRoot lớn hơn root?" / Single node, identical trees, size comparison
6. **Follow-up**: "Nếu cây rất lớn (N=10⁶)? → Tree hashing hoặc Merkle hash" / Tree hashing for large inputs

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
 * Solution 1: DFS + isSameTree (clean, interview-standard)
 * Time: O(M·N) — for each of M nodes in root, compare up to N nodes
 * Space: O(max(H_root, H_sub)) — recursion stack
 */
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true;
  if (!p || !q) return false;
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (!root) return false;
  if (isSameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

/**
 * Solution 2: Serialize + String matching (optimal for large trees)
 * Time: O(M + N) — serialize both + string includes check
 * Space: O(M + N) — serialized strings
 * Note: use unique delimiters to avoid false matches (e.g., #1# != #12#)
 */
function isSubtreeSerialize(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  function serialize(node: TreeNode | null): string {
    if (!node) return "#null";
    return `#${node.val}${serialize(node.left)}${serialize(node.right)}`;
  }
  return serialize(root).includes(serialize(subRoot!));
}

// === Test Cases ===
const root1 = new TreeNode(3, new TreeNode(4, new TreeNode(1), new TreeNode(2)), new TreeNode(5));
const sub1 = new TreeNode(4, new TreeNode(1), new TreeNode(2));
console.log(isSubtree(root1, sub1)); // true
console.log(isSubtreeSerialize(root1, sub1)); // true

const root2 = new TreeNode(
  3,
  new TreeNode(4, new TreeNode(1), new TreeNode(2, null, new TreeNode(0))),
  new TreeNode(5),
);
console.log(isSubtree(root2, sub1)); // false
console.log(isSubtreeSerialize(root2, sub1)); // false

// Edge: single node
console.log(isSubtree(new TreeNode(1), new TreeNode(1))); // true
```

---

## 🔗 Related Problems

| Problem                                                                                                          | Pattern             | Difficulty |
| ---------------------------------------------------------------------------------------------------------------- | ------------------- | ---------- |
| [Same Tree](https://leetcode.com/problems/same-tree)                                                             | DFS structure match | 🟢 Easy    |
| [Symmetric Tree](https://leetcode.com/problems/symmetric-tree)                                                   | DFS mirror check    | 🟢 Easy    |
| [Count Univalue Subtrees](https://leetcode.com/problems/count-univalue-subtrees)                                 | DFS post-order      | 🟡 Medium  |
| [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | DFS LCA             | 🟡 Medium  |
| [Find Duplicate Subtrees](https://leetcode.com/problems/find-duplicate-subtrees)                                 | Tree serialization  | 🟡 Medium  |
