---
layout: page
title: "Binary Search Tree Iterator"
difficulty: Medium
category: Tree-Graph
tags: [Stack, Tree, Design, Binary Search Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/binary-search-tree-iterator"
---

# Binary Search Tree Iterator / Iterator Cho Cây Tìm Kiếm Nhị Phân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Controlled Recursion with Stack

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI**: In-order traversal BST cho dãy tăng dần — nhưng ta cần "lazy" (từng phần tử một, không duyệt hết rồi lưu). Dùng stack để mô phỏng đệ quy: luôn đẩy tất cả nút bên trái xuống stack. Khi `next()` được gọi, pop đỉnh stack, rồi đẩy toàn bộ cây con bên phải vào.

**EN**: Simulate in-order with explicit stack. Push all left nodes first. On `next()`: pop top → push all lefts of `top.right`. This gives O(1) amortized `next()` and O(h) space.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Binary Search Tree Iterator example:**

```
BST:      Stack state:
  7       [7,3,1]  ← pushed all lefts
 / \
3   15    next() → pop 1 → push rights of 1 (none) → return 1
/ \  \    stack: [7,3]
1   5  20 next() → pop 3 → push rights of 3: [5] → stack: [7,5]
          next() → pop 5 → stack: [7]
          ...
```

---

## Problem Description

| #   | Title                          | Difficulty | Pattern                |
| --- | ------------------------------ | ---------- | ---------------------- |
| 94  | Binary Tree Inorder Traversal  | 🟢 Easy    | Stack / Recursion      |
| 173 | Binary Search Tree Iterator II | 🟡 Medium  | Bidirectional Iterator |
| 281 | Zigzag Iterator                | 🟡 Medium  | Design Iterator        |
| 284 | Peeking Iterator               | 🟡 Medium  | Iterator Pattern       |

---

## 📝 Interview Tips

- 🇻🇳 Không nên duyệt hết và lưu mảng — tốn O(n) space ngay từ đầu, không "lazy".
- 🇬🇧 Don't pre-collect all values — that wastes O(n) upfront; the stack approach is O(h).
- 🇻🇳 Hàm `pushLeft(node)`: đẩy node và tất cả con trái của nó vào stack — gọi mỗi khi pop.
- 🇬🇧 `pushLeft(node)`: push node and all its left descendants — called after every pop.
- 🇻🇳 `hasNext()` chỉ cần kiểm tra `stack.length > 0` — O(1).
- 🇬🇧 `hasNext()` is simply `stack.length > 0` — O(1) guaranteed.

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

// ─── Solution 1: Stack-based lazy in-order (O(h) space) ───
// next(): O(1) amortized  hasNext(): O(1)
class BSTIterator {
  private stack: TreeNode[] = [];

  constructor(root: TreeNode | null) {
    this.pushLeft(root);
  }

  private pushLeft(node: TreeNode | null): void {
    while (node) {
      this.stack.push(node);
      node = node.left;
    }
  }

  next(): number {
    const node = this.stack.pop()!;
    this.pushLeft(node.right); // prepare right subtree
    return node.val;
  }

  hasNext(): boolean {
    return this.stack.length > 0;
  }
}

// ─── Solution 2: Pre-order array (simple but O(n) space) ───
// Useful as brute-force explanation in interviews
class BSTIteratorSimple {
  private vals: number[] = [];
  private idx = 0;

  constructor(root: TreeNode | null) {
    const inorder = (node: TreeNode | null): void => {
      if (!node) return;
      inorder(node.left);
      this.vals.push(node.val);
      inorder(node.right);
    };
    inorder(root);
  }

  next(): number {
    return this.vals[this.idx++];
  }

  hasNext(): boolean {
    return this.idx < this.vals.length;
  }
}

// ─── Solution 3: Generator-based (elegant ES6) ───
class BSTIteratorGenerator {
  private gen: Generator<number>;
  private current: IteratorResult<number>;

  constructor(root: TreeNode | null) {
    this.gen = this.inorder(root);
    this.current = this.gen.next();
  }

  private *inorder(node: TreeNode | null): Generator<number> {
    if (!node) return;
    yield* this.inorder(node.left);
    yield node.val;
    yield* this.inorder(node.right);
  }

  next(): number {
    const val = this.current.value as number;
    this.current = this.gen.next();
    return val;
  }

  hasNext(): boolean {
    return !this.current.done;
  }
}

// ─── Tests ───
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

const bst = makeTree([7, 3, 15, 1, 5, null, 20]);
const iter = new BSTIterator(bst);
const results: number[] = [];
while (iter.hasNext()) results.push(iter.next());
console.log(results); // [1, 3, 5, 7, 15, 20]

const iter2 = new BSTIteratorGenerator(makeTree([7, 3, 15, 1, 5, null, 20]));
const r2: number[] = [];
while (iter2.hasNext()) r2.push(iter2.next());
console.log(r2); // [1, 3, 5, 7, 15, 20]
```

---

## 🔗 Related Problems

| #   | Title                          | Difficulty | Pattern                |
| --- | ------------------------------ | ---------- | ---------------------- |
| 94  | Binary Tree Inorder Traversal  | 🟢 Easy    | Stack / Recursion      |
| 173 | Binary Search Tree Iterator II | 🟡 Medium  | Bidirectional Iterator |
| 281 | Zigzag Iterator                | 🟡 Medium  | Design Iterator        |
| 284 | Peeking Iterator               | 🟡 Medium  | Iterator Pattern       |
