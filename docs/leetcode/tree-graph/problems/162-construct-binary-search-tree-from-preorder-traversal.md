---
layout: page
title: "Construct Binary Search Tree from Preorder Traversal"
difficulty: Medium
category: Tree-Graph
tags: [Array, Stack, Tree, Binary Search Tree, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal"
---

# Construct Binary Search Tree from Preorder Traversal / Xây dựng BST từ duyệt preorder

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Mỗi phần tử trong preorder là gốc của cây con. Dùng stack đơn điệu giảm dần — khi gặp giá trị lớn hơn đỉnh stack, đó là con phải; nếu nhỏ hơn, là con trái.

**English:** Preorder visits root before children. Use a **monotonic decreasing stack** — if the new value is larger than the stack top, it's the right child of the last popped node; otherwise it's the left child of the stack top.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Construct Binary Search Tree from Preorder Traversal example:**

```
preorder = [8, 5, 1, 7, 10, 12]

stack: [8]
  5 < 8  → left child of 8;  stack: [8,5]
  1 < 5  → left child of 5;  stack: [8,5,1]
  7 > 1, pop 1; 7 < 5, stop → right child of 1? No: right child of 5
         ...build:    8
                     / \
                    5   10
                   / \    \
                  1   7    12
```

---

---

## Problem Description

| #    | Problem                                       | Difficulty | Pattern          |
| ---- | --------------------------------------------- | ---------- | ---------------- |
| 105  | Construct Binary Tree from Preorder & Inorder | Medium     | Divide & Conquer |
| 1008 | Construct BST from Preorder (this)            | Medium     | Monotonic Stack  |
| 255  | Verify Preorder Sequence in BST               | Medium     | Monotonic Stack  |

---

## 📝 Interview Tips

- 🔑 **Key insight / Nhận xét chính:** Preorder = root, left subtree, right subtree. BST property: left < root < right.
- 📊 **Bound recursion / Đệ quy với giới hạn:** Pass (min, max) bounds; insert when `min < val < max`.
- ⚡ **Monotonic stack O(n) / Stack đơn điệu:** Each node pushed/popped once → O(n) total.
- 🎯 **Common mistake / Lỗi thường gặp:** Forgetting that all values in a BST are unique — no need for duplicate handling.
- 🧩 **Edge case / Trường hợp đặc biệt:** Single-element array → single node, no children.
- 📏 **Complexity / Độ phức tạp:** Recursive O(n log n) avg, O(n²) worst; monotonic stack O(n).

---

---

## Solutions

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(v: number) {
    this.val = v;
    this.left = null;
    this.right = null;
  }
}

/**
 * Recursively insert each preorder value into a BST.
 * Guided by upper-bound to split left/right subtrees.
 *
 * Time:  O(n log n) avg, O(n²) worst (sorted input)
 * Space: O(n)
 */
function bstFromPreorder(preorder: number[]): TreeNode | null {
  let idx = 0;
  function build(min: number, max: number): TreeNode | null {
    if (idx >= preorder.length || preorder[idx] < min || preorder[idx] > max) return null;
    const node = new TreeNode(preorder[idx++]);
    node.left = build(min, node.val);
    node.right = build(node.val, max);
    return node;
  }
  return build(-Infinity, Infinity);
}

// Helper to serialize for testing
function serialize(root: TreeNode | null): (number | null)[] {
  if (!root) return [];
  const res: (number | null)[] = [];
  const q: (TreeNode | null)[] = [root];
  while (q.length) {
    const n = q.shift()!;
    res.push(n ? n.val : null);
    if (n) {
      q.push(n.left);
      q.push(n.right);
    }
  }
  while (res[res.length - 1] === null) res.pop();
  return res;
}

console.log(serialize(bstFromPreorder([8, 5, 1, 7, 10, 12]))); // [8,5,10,1,7,null,12]
console.log(serialize(bstFromPreorder([1, 3]))); // [1,null,3]

/**
 * Maintain a decreasing stack. For each value:
 *   - Pop while stack top < current → last popped is parent (right child).
 *   - Stack top (if any) >= current → it is parent (left child).
 *
 * Time:  O(n)
 * Space: O(n)
 */
function bstFromPreorder2(preorder: number[]): TreeNode | null {
  if (!preorder.length) return null;
  const root = new TreeNode(preorder[0]);
  const stack: TreeNode[] = [root];
  for (let i = 1; i < preorder.length; i++) {
    const node = new TreeNode(preorder[i]);
    let parent = stack[stack.length - 1];
    while (stack.length && stack[stack.length - 1].val < preorder[i]) {
      parent = stack.pop()!;
    }
    if (parent.val < preorder[i]) parent.right = node;
    else parent.left = node;
    stack.push(node);
  }
  return root;
}

console.log(serialize(bstFromPreorder2([8, 5, 1, 7, 10, 12]))); // [8,5,10,1,7,null,12]
```

---

## 🔗 Related Problems

| #    | Problem                                       | Difficulty | Pattern          |
| ---- | --------------------------------------------- | ---------- | ---------------- |
| 105  | Construct Binary Tree from Preorder & Inorder | Medium     | Divide & Conquer |
| 1008 | Construct BST from Preorder (this)            | Medium     | Monotonic Stack  |
| 255  | Verify Preorder Sequence in BST               | Medium     | Monotonic Stack  |
