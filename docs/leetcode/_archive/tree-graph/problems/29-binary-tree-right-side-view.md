---
layout: page
title: "Binary Tree Right Side View"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/binary-tree-right-side-view"
---

# Binary Tree Right Side View / Nhìn Cây Nhị Phân Từ Bên Phải

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS / DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal) | [Populating Next Right Pointers](https://leetcode.com/problems/populating-next-right-pointers-in-each-node)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Đứng nhìn cây từ bên phải — ở mỗi tầng bạn chỉ thấy node ngoài cùng bên phải. BFS xử lý từng tầng, lấy phần tử cuối; DFS duyệt phải trước, ghi lần đầu gặp depth mới.

**Pattern Recognition:**

- Signal: "rightmost node at each level" → **BFS level-order** hoặc **DFS right-first**
- BFS: trực quan — lấy phần tử cuối mỗi level
- DFS: duyệt right trước, ghi nhận khi depth == result.length (first time at this depth)

**Visual — `[1,2,3,null,5,null,4]`:**

```
        1          ← see 1
       / \
      2   3        ← see 3 (rightmost)
       \   \
        5   4      ← see 4 (rightmost)

BFS:  level 0: [1]       → take 1
      level 1: [2, 3]    → take 3
      level 2: [5, 4]    → take 4
Result: [1, 3, 4]

DFS (right first):
  depth=0: visit 1 → result=[1]
  depth=1: visit 3 → result=[1,3]
  depth=2: visit 4 → result=[1,3,4]
  depth=1: visit 2 → depth < result.length, skip
  depth=2: visit 5 → depth < result.length, skip
```

---

## Problem Description

Given the root of a binary tree, imagine standing on the right side looking at the tree. Return the values of the nodes visible from the right side, ordered from top to bottom. ([LeetCode 199](https://leetcode.com/problems/binary-tree-right-side-view))

**Example 1:** `root = [1,2,3,null,5,null,4]` → `[1,3,4]`
**Example 2:** `root = [1,null,3]` → `[1,3]`

**Constraints:** `0 ≤ nodes ≤ 100`, `-100 ≤ Node.val ≤ 100`

---

## 📝 Interview Tips

1. **Clarify**: "Rightmost node ở mỗi level, kể cả khi chỉ có left child?" / Rightmost at each level, even if only left child exists?
2. **BFS approach**: "Queue-based level-order: lấy phần tử cuối mỗi level" / Standard BFS, record last node of each level
3. **DFS approach**: "Duyệt right trước left, ghi nhận node đầu tiên gặp ở mỗi depth" / DFS right-first: first node at each depth is the rightmost
4. **DFS insight**: "result.length == depth nghĩa là đây là lần đầu đến depth này" / When result.length === depth, it's first visit to this depth
5. **Edge cases**: "Cây rỗng → []; cây một node → [root.val]; cây lệch trái → vẫn thấy đủ tầng" / Empty tree, left-skewed still shows all levels
6. **Follow-up**: "Left side view → DFS left trước, hoặc BFS lấy phần tử đầu mỗi level" / Left side view: DFS left-first, or BFS take first element

---

## Solutions

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

/**
 * Solution 1: BFS Level-Order — take last node of each level
 * Process tree level by level with a queue.
 * At end of each level, the last node is visible from the right.
 * Time: O(n) — visits every node once
 * Space: O(w) where w = max width (at most n/2 for last level)
 */
function rightSideViewBFS(root: TreeNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      if (i === levelSize - 1) result.push(node.val); // last node in level
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  return result;
}

/**
 * Solution 2: DFS Right-First with Depth Tracking
 * Traverse right child before left child. The first node visited at each
 * depth is the rightmost node visible from the right side.
 * Time: O(n) — visits every node once
 * Space: O(h) call stack where h = tree height
 */
function rightSideView(root: TreeNode | null): number[] {
  const result: number[] = [];

  const dfs = (node: TreeNode | null, depth: number): void => {
    if (!node) return;
    // First visit to this depth → it's the rightmost node
    if (depth === result.length) result.push(node.val);
    dfs(node.right, depth + 1); // right first!
    dfs(node.left, depth + 1);
  };

  dfs(root, 0);
  return result;
}

// === Test Cases ===
// Build: [1,2,3,null,5,null,4]
const root1 = new TreeNode(1);
root1.left = new TreeNode(2);
root1.right = new TreeNode(3);
root1.left.right = new TreeNode(5);
root1.right.right = new TreeNode(4);
console.log(rightSideView(root1)); // [1, 3, 4]
console.log(rightSideViewBFS(root1)); // [1, 3, 4]

// Build: [1,null,3]
const root2 = new TreeNode(1);
root2.right = new TreeNode(3);
console.log(rightSideView(root2)); // [1, 3]

// Left-skewed: [1,2,null,3]
const root3 = new TreeNode(1);
root3.left = new TreeNode(2);
root3.left.left = new TreeNode(3);
console.log(rightSideView(root3)); // [1, 2, 3]

console.log(rightSideView(null)); // []
```

---

## 🔗 Related Problems

| Problem                                                                                                     | Pattern         | Difficulty |
| ----------------------------------------------------------------------------------------------------------- | --------------- | ---------- |
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal)        | BFS level order | 🟡 Medium  |
| [Populating Next Right Pointers](https://leetcode.com/problems/populating-next-right-pointers-in-each-node) | Level-by-level  | 🟡 Medium  |
| [Deepest Leaves Sum](https://leetcode.com/problems/deepest-leaves-sum)                                      | Last level BFS  | 🟡 Medium  |
| [Find Largest Value in Each Tree Row](https://leetcode.com/problems/find-largest-value-in-each-tree-row)    | BFS per level   | 🟡 Medium  |
