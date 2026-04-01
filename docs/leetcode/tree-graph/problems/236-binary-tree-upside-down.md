---
layout: page
title: "Binary Tree Upside Down"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/binary-tree-upside-down"
---

# Binary Tree Upside Down / Lật Ngược Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | [Same Tree](https://leetcode.com/problems/same-tree)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Giống lật chiếc ô dù ngược — cán dù (root cũ) trở thành mép ngoài, và những cái nắp (right child cũ) trở thành tay cầm mới. Mỗi node con trái cũ là root mới, còn node cha cũ và con phải cũ trở thành left/right con của nó.

**Pattern Recognition:**

- Signal: "left-skewed binary tree" + "relink pointers" → **DFS / Iterative pointer relinking**
- Key insight: chỉ có nhánh trái mới có con; mỗi cặp `(parent, parent.right)` trở thành `(newRoot.left, newRoot.right)` theo thứ tự từ dưới lên

**Visual — Binary Tree Upside Down example:**

```
Input:      1           Output:     4
           / \                     / \
          2   3                   5   2
         / \                         / \
        4   5                       3   1

Step-by-step (bottom-up):
  reach leaf 4 → new root
  node=2: 4.left=2, 4.right=5  (2's right child=5)
  node=1: 2.left=1, 2.right=3  (1's right child=3)
  return 4 as new root
```

---

## 📝 Problem Description

Given a binary tree where every right child has no children (right node is always a leaf), and every left child either has no children or has children, flip the tree "upside down". The leftmost node becomes the new root; its sibling (right child of parent) becomes its left child; its parent becomes its right child.

**Example 1:** `[1,2,3,4,5]` → `[4,5,2,null,null,3,1]`
**Example 2:** `[]` → `[]`

Constraints: `0 ≤ nodes ≤ 10`, `-10 ≤ Node.val ≤ 10`, tree is left-skewed with sibling leaves.

---

## 🎯 Interview Tips

1. **Understand the constraint**: only left spine matters / Chỉ nhánh trái có cây con — right node luôn là lá
2. **Bottom-up recursion**: recurse to leftmost first, then relink on way back / Đệ quy xuống hết rồi móc lại khi quay về
3. **Iterative is cleaner**: track prev, prevRight pointers / Iterative dùng 2 biến prev là sạch hơn
4. **Save children before relinking** / Lưu left và right trước khi gán lại, tránh mất pointer
5. **Edge cases**: empty tree, single node, tree with only root-left / Cây rỗng, 1 node, chỉ có root và left
6. **Test with small examples**: draw arrows to trace relinks / Vẽ sơ đồ để trace pointer khi debug

---

## 💡 Solutions

### Approach 1: Recursive DFS — Bottom-Up

/\*_ @complexity Time: O(N) | Space: O(N) recursion stack _/

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

function upsideDownBinaryTreeRecursive(root: TreeNode | null): TreeNode | null {
  if (!root || !root.left) return root;
  // recurse to find new root (leftmost node)
  const newRoot = upsideDownBinaryTreeRecursive(root.left);
  // root.left is now the direct left child (parent of newRoot)
  // relink: root.left's left = root's right sibling; root.left's right = root
  root.left.left = root.right;
  root.left.right = root;
  // detach root's old children to avoid cycles
  root.left = null;
  root.right = null;
  return newRoot;
}
```

### Approach 2: Iterative — Optimal O(N) Time O(1) Space

/\*_ @complexity Time: O(N) | Space: O(1) _/

```typescript
function upsideDownBinaryTree(root: TreeNode | null): TreeNode | null {
  let cur: TreeNode | null = root;
  let prev: TreeNode | null = null;
  let prevRight: TreeNode | null = null;

  while (cur) {
    const nextLeft = cur.left; // save next iteration node
    const curRight = cur.right; // save current right sibling
    cur.left = prevRight; // new left = previous right sibling
    cur.right = prev; // new right = previous parent
    prev = cur; // advance prev
    prevRight = curRight; // advance prevRight
    cur = nextLeft; // move down left spine
  }
  return prev; // prev is now the deepest-left (new root)
}
```

---

## 🧪 Test Cases

```typescript
function build(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] == null) return null;
  const root = new TreeNode(vals[0]);
  const q = [root];
  let i = 1;
  while (q.length && i < vals.length) {
    const n = q.shift()!;
    if (vals[i] != null) {
      n.left = new TreeNode(vals[i]!);
      q.push(n.left);
    }
    i++;
    if (i < vals.length && vals[i] != null) {
      n.right = new TreeNode(vals[i]!);
      q.push(n.right);
    }
    i++;
  }
  return root;
}
function toArr(root: TreeNode | null): (number | null)[] {
  if (!root) return [];
  const res: (number | null)[] = [];
  const q = [root as TreeNode | null];
  while (q.length) {
    const n = q.shift()!;
    if (!n) {
      res.push(null);
      continue;
    }
    res.push(n.val);
    q.push(n.left);
    q.push(n.right);
  }
  return res;
}
console.log(toArr(upsideDownBinaryTree(build([1, 2, 3, 4, 5])))); // → [4,5,2,null,null,3,1]
console.log(toArr(upsideDownBinaryTree(build([])))); // → []
console.log(toArr(upsideDownBinaryTree(build([1, 2])))); // → [2,null,1]
console.log(toArr(upsideDownBinaryTreeRecursive(build([1, 2, 3, 4, 5])))); // → [4,5,2,null,null,3,1]
```

---

## Related Problems

| Problem                                                                                                                                          | Difficulty | Pattern           |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ----------------- |
| [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list)                                                                         | Easy       | Iterative Pointer |
| [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list)                                           | Medium     | DFS               |
| [Convert Binary Search Tree to Sorted Doubly Linked List](https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list) | Medium     | DFS               |
