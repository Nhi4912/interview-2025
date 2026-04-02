---
layout: page
title: "Count Complete Tree Nodes"
difficulty: Easy
category: Tree-Graph
tags: [Binary Search, Bit Manipulation, Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/count-complete-tree-nodes"
---

# count complete tree nodes

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Vietnamese analogy:** Cây nhị phân đầy đủ (complete) có tính chất đặc biệt: nếu chiều cao trái = chiều cao phải, thì cây đó là "perfect" và có `2^h - 1` nút. Dùng tính chất này để tính O(log²n) thay vì O(n).

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
Height h=3 (perfect tree):
      1
    /   \
   2     3
  / \   / \
 4   5 6   7
Nodes = 2^3 - 1 = 7

Complete but not perfect:
      1
    /   \
   2     3
  / \   /
 4   5 6
Left height=3, Right height=2 → recurse
```

---

---

## Problem Description

Given the `root` of a **complete binary tree**, return the number of nodes. Design an algorithm that runs in **O(log²n)** time.

**Constraints:**

- `0 <= Number of nodes <= 5 * 10^4`
- `-10^5 <= Node.val <= 10^5`
- Tree is **complete** binary tree

---

---

## 📝 Interview Tips

- 🔑 **O(n) trivial** via DFS — but the problem hints at O(log²n)
- 🔑 **O(log²n) trick:** compare left-most and right-most heights; if equal → perfect subtree → `2^h - 1`
- 🔑 If heights differ → recurse on both subtrees (at least one will be perfect)
- ⚠️ Height calculation: go left-most for left height, go right-most for right height
- ⚠️ Bit shift: `(1 << h) - 1` gives node count for perfect tree of height `h`
- 💡 Each recursive call does O(log n) work; recursion depth is O(log n) → total O(log²n)

---

---

## Solutions

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

function countNodes(root: TreeNode | null): number {
  if (!root) return 0;

  function leftHeight(node: TreeNode | null): number {
    let h = 0;
    while (node) {
      h++;
      node = node.left;
    }
    return h;
  }

  function rightHeight(node: TreeNode | null): number {
    let h = 0;
    while (node) {
      h++;
      node = node.right;
    }
    return h;
  }

  const lh = leftHeight(root);
  const rh = rightHeight(root);

  if (lh === rh) {
    // Perfect binary tree: 2^h - 1 nodes
    return (1 << lh) - 1;
  }

  // Not perfect: recurse on both subtrees
  return 1 + countNodes(root.left) + countNodes(root.right);
}

function countNodesDFS(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + countNodesDFS(root.left) + countNodesDFS(root.right);
}

function countNodesBinarySearch(root: TreeNode | null): number {
  if (!root) return 0;

  // Get height (number of levels)
  let height = 0;
  let node: TreeNode | null = root;
  while (node?.left) {
    height++;
    node = node.left;
  }

  if (height === 0) return 1;

  // Binary search for last node in bottom level
  // Nodes in bottom level are indexed 0 to 2^height - 1
  function exists(idx: number): boolean {
    let lo = 0,
      hi = (1 << height) - 1;
    let cur: TreeNode | null = root;
    for (let i = 0; i < height; i++) {
      const mid = Math.floor((lo + hi) / 2);
      if (idx <= mid) {
        cur = cur!.left;
        hi = mid;
      } else {
        cur = cur!.right;
        lo = mid + 1;
      }
    }
    return cur !== null;
  }

  let lo = 0,
    hi = (1 << height) - 1;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (exists(mid)) lo = mid;
    else hi = mid - 1;
  }

  return (1 << height) + lo; // Nodes above bottom + position of last node + 1
}
```

---

## 🔗 Related Problems

| #   | Problem                           | Difficulty | Tags      |
| --- | --------------------------------- | ---------- | --------- |
| 104 | Maximum Depth of Binary Tree      | 🟢 Easy    | Tree, DFS |
| 951 | Flip Equivalent Binary Trees      | 🟡 Medium  | Tree, DFS |
| 958 | Check Completeness of Binary Tree | 🟡 Medium  | Tree, BFS |
| 993 | Cousins in Binary Tree            | 🟢 Easy    | Tree, BFS |
