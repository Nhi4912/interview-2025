---
layout: page
title: "Minimum Depth of Binary Tree"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/minimum-depth-of-binary-tree"
---

# Minimum Depth of Binary Tree / Độ Sâu Nhỏ Nhất Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree) | [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như tìm tầng thấp nhất trong tòa nhà có cửa ra vào — BFS duyệt từng tầng từ dưới lên, dừng ngay khi gặp tầng đầu tiên có "cửa ra" (leaf node). BFS tốt hơn DFS ở đây vì dừng sớm hơn khi cây lệch.

**Pattern Recognition:**

- Signal: "minimum depth" + "binary tree" → **BFS level-order** (stop at first leaf)
- DFS works but visits entire tree; BFS short-circuits on first leaf found
- Gotcha: node chỉ có 1 con KHÔNG phải leaf — phải check cả hai con null

**Visual:**

```
        3
       / \
      9  20
        /  \
       15   7

BFS Level 1: [3]       — not leaf (has children)
BFS Level 2: [9, 20]   — node 9 is leaf! return depth=2

DFS would also visit 15, 7 unnecessarily
```

---

## Problem Description

Given a binary tree, find the **minimum depth** — the number of nodes along the shortest path from the root to the nearest leaf node. A leaf is a node with no children.

**Example 1:** Tree `[3,9,20,null,null,15,7]` → `2` (path: 3→9)
**Example 2:** Tree `[2,null,3,null,4,null,5,null,6]` → `5` (single chain)

Constraints: `0 <= number of nodes <= 10⁵`, `-1000 <= Node.val <= 1000`.

---

## 📝 Interview Tips

1. **Clarify**: "Leaf là node không có con trái VÀ phải — node chỉ có 1 con không phải leaf" / Leaf = both children null
2. **BFS advantage**: "BFS dừng sớm ở leaf đầu tiên — tốt hơn DFS khi cây sâu lệch" / BFS finds first leaf faster
3. **DFS gotcha**: "Nếu dùng DFS, node chỉ có 1 con → đừng return min(left,right) — phải skip subtree rỗng" / DFS must skip null subtrees
4. **Edge cases**: "root=null → 0; single node → 1" / Handle null root and single-node tree
5. **One child node**: "Node có chỉ 1 con → depth từ con null = 0, không tính → bắt buộc đi theo con có tồn tại" / Must go down existing child
6. **Follow-up**: "Maximum depth thì sao?" / Swap min→max and remove early exit in BFS

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
 * Solution 1: BFS level-order (early exit at first leaf)
 * Time: O(N) worst case, O(N/2) average for balanced tree
 * Space: O(N) — queue holds up to one full level
 */
function minDepth(root: TreeNode | null): number {
  if (!root) return 0;
  const queue: TreeNode[] = [root];
  let depth = 1;

  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      if (!node.left && !node.right) return depth; // first leaf found
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    depth++;
  }
  return depth;
}

/**
 * Solution 2: DFS recursive (careful with one-child nodes)
 * Time: O(N) — visits all nodes
 * Space: O(H) — recursion stack, H = height
 */
function minDepthDFS(root: TreeNode | null): number {
  if (!root) return 0;
  // If only one child exists, must go down that child (not count empty branch)
  if (!root.left) return 1 + minDepthDFS(root.right);
  if (!root.right) return 1 + minDepthDFS(root.left);
  return 1 + Math.min(minDepthDFS(root.left), minDepthDFS(root.right));
}

// === Test Cases ===
// Build: [3,9,20,null,null,15,7]
const t1 = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
console.log(minDepth(t1)); // 2
console.log(minDepthDFS(t1)); // 2

// Build: [2,null,3,null,4,null,5,null,6] — right-skewed chain
const t2 = new TreeNode(
  2,
  null,
  new TreeNode(3, null, new TreeNode(4, null, new TreeNode(5, null, new TreeNode(6)))),
);
console.log(minDepth(t2)); // 5
console.log(minDepth(null)); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                              | Pattern             | Difficulty |
| ---------------------------------------------------------------------------------------------------- | ------------------- | ---------- |
| [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree)           | DFS/BFS depth       | 🟢 Easy    |
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal) | BFS level-order     | 🟡 Medium  |
| [Same Tree](https://leetcode.com/problems/same-tree)                                                 | DFS structure check | 🟢 Easy    |
| [Path Sum](https://leetcode.com/problems/path-sum)                                                   | DFS root-to-leaf    | 🟢 Easy    |
| [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view)             | BFS last-per-level  | 🟡 Medium  |
