---
layout: page
title: "Reverse Odd Levels of Binary Tree"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/reverse-odd-levels-of-binary-tree"
---

# Reverse Odd Levels of Binary Tree / Đảo Ngược Các Tầng Lẻ Của Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS Level-order

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI**: Cây là cây nhị phân hoàn hảo (perfect binary tree). Duyệt BFS theo từng tầng, thu thập tất cả nút ở tầng lẻ (level 1, 3, 5...), đảo ngược mảng giá trị, rồi gán lại. Không cần đảo cấu trúc cây — chỉ hoán đổi giá trị!

**EN**: Perfect binary tree → BFS level by level. At odd levels collect nodes, reverse their `.val` array and reassign. Swap values only, not structure.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Reverse Odd Levels of Binary Tree example:**

```
Before:              After:
      2                    2
    /   \               /    \
   3     5     →       5      3
  / \ / \             / \   / \
 8  13 21 34        8  13 21  34
Level 0 (even): [2]      → no change
Level 1 (odd):  [3, 5]   → swap → [5, 3]
Level 2 (even): [8,13,21,34] → no change
```

---

## Problem Description

| #   | Title                                       | Difficulty | Pattern         |
| --- | ------------------------------------------- | ---------- | --------------- |
| 226 | Invert Binary Tree                          | 🟢 Easy    | DFS/BFS         |
| 116 | Populating Next Right Pointers in Each Node | 🟡 Medium  | BFS             |
| 199 | Binary Tree Right Side View                 | 🟡 Medium  | BFS Level-order |
| 102 | Binary Tree Level Order Traversal           | 🟡 Medium  | BFS             |

---

## 📝 Interview Tips

- 🇻🇳 Cây hoàn hảo (perfect binary tree) đảm bảo tầng chẵn có 2^level nút — luôn cặp đối xứng.
- 🇬🇧 Perfect binary tree guarantees symmetric structure — pairs always exist at odd levels.
- 🇻🇳 Chỉ hoán đổi `.val`, không cần thay đổi `.left`/`.right` — đơn giản hơn nhiều.
- 🇬🇧 Swap `.val` only — no pointer manipulation needed.
- 🇻🇳 Giải pháp DFS đệ quy: duyệt đồng thời hai nút đối xứng, hoán đổi giá trị tại tầng lẻ.
- 🇬🇧 DFS approach: traverse symmetric pairs simultaneously, swap at odd levels.

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

// ─── Solution 1: BFS level-order, reverse odd-level values ───
// Time: O(n)  Space: O(n)
function reverseOddLevels(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  const queue: TreeNode[] = [root];
  let level = 0;

  while (queue.length) {
    const size = queue.length;
    const nodes: TreeNode[] = [];
    for (let i = 0; i < size; i++) {
      const node = queue[i];
      nodes.push(node);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    queue.splice(0, size);

    if (level % 2 === 1) {
      // Reverse values in-place at this odd level
      let l = 0,
        r = nodes.length - 1;
      while (l < r) {
        [nodes[l].val, nodes[r].val] = [nodes[r].val, nodes[l].val];
        l++;
        r--;
      }
    }
    level++;
  }
  return root;
}

// ─── Solution 2: DFS with symmetric pair traversal ───
// Time: O(n)  Space: O(log n) — only height deep
function reverseOddLevels2(root: TreeNode | null): TreeNode | null {
  function dfs(left: TreeNode | null, right: TreeNode | null, level: number): void {
    if (!left || !right) return;
    if (level % 2 === 1) {
      // Odd level — swap values of this symmetric pair
      [left.val, right.val] = [right.val, left.val];
    }
    // Traverse outer and inner pairs of children
    dfs(left.left, right.right, level + 1);
    dfs(left.right, right.left, level + 1);
  }

  if (root) dfs(root.left, root.right, 1);
  return root;
}

// ─── Test helpers ───
function makeTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length) return null;
  const root = new TreeNode(vals[0] as number);
  const q: TreeNode[] = [root];
  let i = 1;
  while (i < vals.length) {
    const node = q.shift()!;
    if (vals[i] !== null) {
      node.left = new TreeNode(vals[i] as number);
      q.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      node.right = new TreeNode(vals[i] as number);
      q.push(node.right);
    }
    i++;
  }
  return root;
}

function treeToArray(root: TreeNode | null): (number | null)[] {
  if (!root) return [];
  const result: (number | null)[] = [];
  const q: (TreeNode | null)[] = [root];
  while (q.length) {
    const node = q.shift()!;
    if (!node) {
      result.push(null);
      continue;
    }
    result.push(node.val);
    q.push(node.left);
    q.push(node.right);
  }
  while (result[result.length - 1] === null) result.pop();
  return result;
}

const t1 = makeTree([2, 3, 5, 8, 13, 21, 34]);
reverseOddLevels(t1);
console.log(treeToArray(t1)); // [2,5,3,8,13,21,34]

const t2 = makeTree([7, 13, 11]);
reverseOddLevels2(t2);
console.log(treeToArray(t2)); // [7,11,13]
```

---

## 🔗 Related Problems

| #   | Title                                       | Difficulty | Pattern         |
| --- | ------------------------------------------- | ---------- | --------------- |
| 226 | Invert Binary Tree                          | 🟢 Easy    | DFS/BFS         |
| 116 | Populating Next Right Pointers in Each Node | 🟡 Medium  | BFS             |
| 199 | Binary Tree Right Side View                 | 🟡 Medium  | BFS Level-order |
| 102 | Binary Tree Level Order Traversal           | 🟡 Medium  | BFS             |
