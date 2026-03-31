---
layout: page
title: "Inorder Successor in BST II"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Binary Search Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/inorder-successor-in-bst-ii"
---

# Inorder Successor in BST II / Phần tử kế tiếp inorder trong BST II

🟡 Medium | BST | Parent Pointer | Tree Traversal

---

## 🧠 Intuition

**Vietnamese:** Successor inorder trong BST là phần tử nhỏ nhất lớn hơn `node.val`. Có hai trường hợp:

1. **Có con phải:** Successor là nút nhỏ nhất trong cây con phải (đi phải rồi cứ đi trái).
2. **Không có con phải:** Đi lên qua con trỏ `parent` cho đến khi ta đến từ nhánh trái — cha đó là successor.

**English:** The inorder successor is the smallest node greater than `node.val`.

- If `node.right` exists: go right once, then keep going left → smallest in right subtree.
- Else: climb via parent until you arrive as a **left** child — that parent is the successor.

```
BST:        5
           / \
          3   6
         / \
        2   4

Successor of 3: has right child 4 → go to 4, no left → successor = 4
Successor of 4: no right child → go up (4 is right child of 3, keep climbing)
                → 4 is right of 3, climb; 3 is left of 5 → successor = 5
Successor of 6: no right child, 6 is right of 5, no parent → null (largest)
```

---

## 📝 Interview Tips

- 🔑 **Key insight / Nhận xét chính:** Two distinct cases — right subtree exists vs. must climb via parent pointer.
- 📊 **Case 1 rule / Quy tắc ca 1:** `go right once, then always left` to find minimum of right subtree.
- ⚡ **Case 2 rule / Quy tắc ca 2:** `climb parent while node is a right child` — the first parent you arrive as left child is the answer.
- 🎯 **No BST search needed / Không cần tìm kiếm BST:** Having `parent` pointers removes the need for root access.
- 🧩 **Edge case / Trường hợp đặc biệt:** Node is the rightmost (largest) — climbing will eventually reach null parent → return null.
- 📏 **Complexity / Độ phức tạp:** O(h) time where h is tree height; O(1) extra space.

---

## Solutions

### Solution 1 — Parent Pointer Navigation

```typescript
class Node {
  val: number;
  left: Node | null;
  right: Node | null;
  parent: Node | null;
  constructor(v: number) {
    this.val = v;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

/**
 * Case 1: node has right child → find leftmost in right subtree.
 * Case 2: no right child → climb until arriving as left child.
 *
 * Time:  O(h)
 * Space: O(1)
 */
function inorderSuccessor(node: Node): Node | null {
  // Case 1: right subtree exists
  if (node.right) {
    let cur: Node = node.right;
    while (cur.left) cur = cur.left;
    return cur;
  }
  // Case 2: climb until we come from a left branch
  let cur: Node | null = node;
  while (cur.parent && cur === cur.parent.right) {
    cur = cur.parent;
  }
  return cur.parent; // null if node was the largest
}

// Manual tree construction for testing
function buildBST(vals: number[]): Node | null {
  if (!vals.length) return null;
  const nodes = vals.map((v) => new Node(v));
  // For test: build a simple BST by insertion
  function insert(root: Node | null, n: Node, par: Node | null): Node {
    if (!root) {
      n.parent = par;
      return n;
    }
    if (n.val < root.val) root.left = insert(root.left, n, root);
    else root.right = insert(root.right, n, root);
    return root;
  }
  let root: Node | null = null;
  for (const node of nodes) root = insert(root, node, null);
  return root;
}

function findNode(root: Node | null, val: number): Node | null {
  if (!root) return null;
  if (root.val === val) return root;
  return val < root.val ? findNode(root.left, val) : findNode(root.right, val);
}

const root = buildBST([5, 3, 6, 2, 4]);
console.log(inorderSuccessor(findNode(root, 3)!)?.val); // 4
console.log(inorderSuccessor(findNode(root, 4)!)?.val); // 5
console.log(inorderSuccessor(findNode(root, 6)!)); // null
console.log(inorderSuccessor(findNode(root, 2)!)?.val); // 3
```

---

## 🔗 Related Problems

| #   | Problem                            | Difficulty | Pattern           |
| --- | ---------------------------------- | ---------- | ----------------- |
| 285 | Inorder Successor in BST           | Medium     | BST Traversal     |
| 510 | Inorder Successor in BST II (this) | Medium     | Parent Pointer    |
| 173 | Binary Search Tree Iterator        | Medium     | Inorder Traversal |
