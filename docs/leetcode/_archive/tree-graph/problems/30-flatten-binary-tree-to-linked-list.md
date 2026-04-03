---
layout: page
title: "Flatten Binary Tree to Linked List"
difficulty: Medium
category: Tree-Graph
tags: [Linked List, Stack, Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list"
---

# Flatten Binary Tree to Linked List / Duỗi Cây Nhị Phân Thành Danh Sách Liên Kết

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS / Morris Traversal

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như bạn đang cuộn một tờ giấy gấp origami phức tạp thành một dải thẳng — bạn mở từng nếp gấp theo thứ tự pre-order (gốc → trái → phải), sau đó nối chúng lại bằng liên kết phải. Không cần tạo node mới, chỉ cần kéo thẳng những gì đã có.

**Pattern Recognition:**

- Signal: "flatten tree in-place" + "pre-order traversal" → **DFS / Morris Traversal**
- Cây nhị phân → danh sách liên kết = pre-order: node → left subtree → right subtree
- Key insight: Với mỗi node, nối đuôi subtree trái vào đầu subtree phải, rồi đặt subtree trái vào phải

**Visual — Flatten step-by-step:**

```
Input:        1             Step 1: node=1, find rightmost of left (=3)
             / \            Connect right(3)->right subtree(4,5,6)
            2   5    →      2
           / \ / \         / \
          3  4 6           3   4
                               \
                                5
                               / \
                              6
Step 2: move left(2) to right, null left
    1
     \
      2
       \
        3
         \
          4
           \
            5
             \
              6   ✓ pre-order: 1→2→3→4→5→6
```

---

## Problem Description

Given the `root` of a binary tree, flatten it to a linked list **in-place**. The linked list should use the same `TreeNode` class where `right` pointer points to the next node and `left` is always `null`. The order must match a **pre-order traversal**.

**Example 1:**

- Input: `root = [1,2,5,3,4,null,6]` → Output: `[1,null,2,null,3,null,4,null,5,null,6]`

**Example 2:**

- Input: `root = []` → Output: `[]`

**Constraints:**

- Number of nodes in tree: `[0, 2000]`
- `-100 <= Node.val <= 100`

---

## 📝 Interview Tips

1. **Clarify**: "Có được dùng extra space không?" / Can we use extra space (stack/array) or must it be O(1)?
2. **Brute force**: "Thu thập pre-order vào mảng, rồi nối lại" / Collect pre-order into array, relink nodes
3. **Optimize**: "Morris traversal: với mỗi node, tìm rightmost của left, nối right vào đó" / Morris: find tail of left subtree, attach right there
4. **Edge cases**: "Root null, chỉ có right children, chỉ có left children" / Null root, only-right or only-left chains
5. **Follow-up**: "Làm thế nào để unflatten lại?" / How would you restore the original tree?
6. **Complexity**: "O(n) time, O(1) space với Morris — tốt hơn O(n) space của stack approach" / Morris is O(n)/O(1) vs stack O(n)/O(n)

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
 * Solution 1: Recursive DFS (collect then relink)
 * Time: O(n) — visit each node once
 * Space: O(n) — store all nodes in array + O(h) call stack
 */
function flattenBruteForce(root: TreeNode | null): void {
  const nodes: TreeNode[] = [];
  function preorder(node: TreeNode | null): void {
    if (!node) return;
    nodes.push(node);
    preorder(node.left);
    preorder(node.right);
  }
  preorder(root);
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].left = null;
    nodes[i].right = nodes[i + 1];
  }
  if (nodes.length > 0) nodes[nodes.length - 1].left = null;
}

/**
 * Solution 2: Morris Traversal (in-place, O(1) space)
 * Time: O(n) — each node visited at most twice
 * Space: O(1) — no extra space beyond pointers
 *
 * Key idea: For each node with a left child,
 *   1. Find the rightmost node of its left subtree
 *   2. Connect that rightmost node's right → current node's right subtree
 *   3. Move left subtree to right, set left = null
 */
function flatten(root: TreeNode | null): void {
  let curr = root;
  while (curr) {
    if (curr.left) {
      // Find rightmost node of left subtree
      let rightmost = curr.left;
      while (rightmost.right) rightmost = rightmost.right;
      // Connect rightmost's right to curr's right subtree
      rightmost.right = curr.right;
      // Move left subtree to right position
      curr.right = curr.left;
      curr.left = null;
    }
    curr = curr.right;
  }
}

// === Test Cases ===
function buildTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0]!);
  const queue = [root];
  let i = 1;
  while (i < vals.length) {
    const node = queue.shift()!;
    if (vals[i] !== null) {
      node.left = new TreeNode(vals[i]!);
      queue.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      node.right = new TreeNode(vals[i]!);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}
function toList(root: TreeNode | null): number[] {
  const res: number[] = [];
  while (root) {
    res.push(root.val);
    root = root.right;
  }
  return res;
}

const t1 = buildTree([1, 2, 5, 3, 4, null, 6]);
flatten(t1);
console.log(toList(t1)); // [1, 2, 3, 4, 5, 6]

const t2 = buildTree([]);
flatten(t2);
console.log(toList(t2)); // []

const t3 = buildTree([1, null, 2, null, 3]);
flatten(t3);
console.log(toList(t3)); // [1, 2, 3]
```

---

## 🔗 Related Problems

| Problem                                                                                                                           | Pattern         | Difficulty |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------- |
| [Convert BST to Sorted Doubly Linked List](https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list) | In-order DFS    | Medium     |
| [Populating Next Right Pointers in Each Node II](https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii)    | BFS / Morris    | Medium     |
| [Linked List in Binary Tree](https://leetcode.com/problems/linked-list-in-binary-tree)                                            | DFS             | Medium     |
| [Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal)                                    | DFS / Iterative | Easy       |
| [House Robber III](https://leetcode.com/problems/house-robber-iii)                                                                | Tree DP         | Medium     |
