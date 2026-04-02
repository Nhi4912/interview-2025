---
layout: page
title: "Invert Binary Tree"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/invert-binary-tree"
---

# Invert Binary Tree / Đảo Ngược Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DFS / BFS

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI**: Bài toán kinh điển về đệ quy cây. Để đảo ngược cây: hoán đổi con trái và con phải của nút hiện tại, rồi đệ quy làm tương tự cho hai con. Đây là post-order DFS hoặc pre-order — cả hai đều hoạt động vì ta chỉ swap.

**EN**: Classic recursion problem. Invert = swap left/right children at every node. Works top-down (pre-order) or bottom-up (post-order). BFS level-order works too — swap children while enqueuing.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Invert Binary Tree example:**

```
Before:          After:
      4                4
    /   \           /    \
   2     7    →    7      2
  / \   / \       / \   / \
 1   3 6   9     9   6 3   1

At each node: [left, right] = [right, left]
Then recurse into both children.
```

---

## Problem Description

| #    | Title                             | Difficulty | Pattern |
| ---- | --------------------------------- | ---------- | ------- |
| 101  | Symmetric Tree                    | 🟢 Easy    | DFS/BFS |
| 100  | Same Tree                         | 🟢 Easy    | DFS     |
| 951  | Flip Equivalent Binary Trees      | 🟡 Medium  | DFS     |
| 2415 | Reverse Odd Levels of Binary Tree | 🟡 Medium  | BFS     |

---

## 📝 Interview Tips

- 🇻🇳 Đây là bài "warm-up" phỏng vấn — phải code nhanh và clean trong 2 phút.
- 🇬🇧 Classic warm-up — aim for clean code in 2 minutes; mention both recursive + iterative.
- 🇻🇳 Recursive: 3 dòng code. Iterative BFS: queue-based. Iterative DFS: stack-based.
- 🇬🇧 Recursive solution is 3 lines; also explain iterative BFS for follow-up.
- 🇻🇳 Base case: `if (!root) return null` — xử lý null trước khi swap.
- 🇬🇧 Base case: handle null before swapping; single node is already "inverted".

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

// ─── Solution 1: Recursive DFS (pre-order swap) ───
// Time: O(n)  Space: O(h) — h = height of tree
function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  // Swap left and right children
  [root.left, root.right] = [root.right, root.left];
  // Recursively invert subtrees
  invertTree(root.left);
  invertTree(root.right);
  return root;
}

// ─── Solution 2: BFS Level-order ───
// Time: O(n)  Space: O(n) — at most n/2 nodes in queue (last level)
function invertTreeBFS(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  const queue: TreeNode[] = [root];
  while (queue.length) {
    const node = queue.shift()!;
    // Swap children
    [node.left, node.right] = [node.right, node.left];
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return root;
}

// ─── Solution 3: Iterative DFS (stack) ───
// Time: O(n)  Space: O(h)
function invertTreeStack(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  const stack: TreeNode[] = [root];
  while (stack.length) {
    const node = stack.pop()!;
    [node.left, node.right] = [node.right, node.left];
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
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

const t1 = makeTree([4, 2, 7, 1, 3, 6, 9]);
invertTree(t1);
console.log(treeToArray(t1)); // [4,7,2,9,6,3,1]

const t2 = makeTree([2, 1, 3]);
invertTreeBFS(t2);
console.log(treeToArray(t2)); // [2,3,1]

const t3 = makeTree([]);
console.log(invertTree(t3)); // null
```

---

## 🔗 Related Problems

| #    | Title                             | Difficulty | Pattern |
| ---- | --------------------------------- | ---------- | ------- |
| 101  | Symmetric Tree                    | 🟢 Easy    | DFS/BFS |
| 100  | Same Tree                         | 🟢 Easy    | DFS     |
| 951  | Flip Equivalent Binary Trees      | 🟡 Medium  | DFS     |
| 2415 | Reverse Odd Levels of Binary Tree | 🟡 Medium  | BFS     |
