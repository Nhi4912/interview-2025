---
layout: page
title: "Populating Next Right Pointers in Each Node II"
difficulty: Medium
category: Tree-Graph
tags: [Linked List, Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii"
---

# Populating Next Right Pointers in Each Node II / Nối Con Trỏ Next Cho Cây Nhị Phân Bất Kỳ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS / O(1) Space Pointer
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Populating Next Right Pointers in Each Node](https://leetcode.com/problems/populating-next-right-pointers-in-each-node) | [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như nối các học sinh ngồi cùng hàng trong lớp bằng sợi dây — đi từ trái sang phải trong mỗi hàng, nối mỗi người với người kế tiếp. Dùng con trỏ level trên để duyệt và nối level dưới mà không cần queue.

**Pattern Recognition:**

- Signal: "populate next pointers" + "arbitrary binary tree" → **BFS level-order** hoặc **O(1) space với dummy node**
- BFS: xử lý từng level, nối prev→curr trong level
- O(1) space: dùng `prev` pointer đi qua các children của current level nodes via `next` pointers

**Visual — O(1) space approach:**

```
Level 1:  1 → NULL
           ↓ (children)
Level 2:  2 → 3 → NULL     (use dummy head to chain)
Level 3:  4 → 5 → 7 → NULL

At level 1: iterate via next, chain children into level 2
  dummy → 2 → 3
At level 2: iterate via next, chain children into level 3
  dummy → 4 → 5 → 7
```

---

## Problem Description

Given a binary tree (not necessarily perfect), populate each node's `next` pointer to point to the next right node in the same level. If no next right node exists, set `next = null`. ([LeetCode #117](https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii))

**Example 1:** `root = [1,2,3,4,5,null,7]` → each node's next points to its right neighbor; `5.next = 7`
**Example 2:** `root = []` → `[]`

---

## 📝 Interview Tips

1. **Clarify**: "Cây có perfect không? (Không) — khác với bài I" / Not perfect binary tree, unlike part I
2. **BFS approach**: "Queue + level-order, nối node với node tiếp theo trong cùng level" / Standard BFS solution
3. **O(1) space**: "Dùng dummy node làm head của next level, duyệt current level qua next pointers" / Dummy node + prev pointer
4. **Dummy node trick**: "dummy.next trỏ đến node đầu tiên của next level; reset sau mỗi level" / Dummy simplifies edge case
5. **Edge cases**: "Node có thể chỉ có left child, chỉ có right child, hoặc không có con nào" / Handle partial children
6. **Follow-up**: "Bài I (perfect tree) có thể O(1) space dễ hơn vì biết cấu trúc cây" / Perfect tree is simpler

---

## Solutions

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  next: TreeNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

/**
 * Solution 1: BFS with Queue
 * Time: O(N) — visit each node once
 * Space: O(W) — W = max width of tree
 */
function connectBFS(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      // Connect to next node in same level
      node.next = i < size - 1 ? queue[0] : null;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return root;
}

/**
 * Solution 2: O(1) Space — use existing next pointers + dummy head
 * Time: O(N)
 * Space: O(1) — only pointer variables
 */
function connect(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  let levelHead: TreeNode | null = root;

  while (levelHead) {
    const dummy = new TreeNode(0); // dummy head for next level
    let prev: TreeNode = dummy; // tail of next level chain
    let curr: TreeNode | null = levelHead;

    // Traverse current level via next pointers
    while (curr) {
      if (curr.left) {
        prev.next = curr.left;
        prev = prev.next;
      }
      if (curr.right) {
        prev.next = curr.right;
        prev = prev.next;
      }
      curr = curr.next;
    }

    levelHead = dummy.next; // move to next level
  }
  return root;
}

// === Test Cases ===
function buildNextLevelResult(root: TreeNode | null): string[] {
  const result: string[] = [];
  let row: TreeNode | null = root;
  while (row) {
    const vals: string[] = [];
    let curr: TreeNode | null = row;
    while (curr) {
      vals.push(String(curr.val));
      curr = curr.next;
    }
    vals.push("#");
    result.push(...vals);
    // find first child
    let next: TreeNode | null = null;
    let scan: TreeNode | null = row;
    while (scan && !next) {
      next = scan.left ?? scan.right;
      scan = scan.next;
    }
    row = next;
  }
  return result;
}

const r = new TreeNode(1);
r.left = new TreeNode(2);
r.right = new TreeNode(3);
r.left.left = new TreeNode(4);
r.left.right = new TreeNode(5);
r.right.right = new TreeNode(7);
connect(r);
console.log(buildNextLevelResult(r)); // ['1','#','2','3','#','4','5','7','#']
```

---

## 🔗 Related Problems

| Problem                                                                                                                  | Difficulty | Pattern                   |
| ------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------- |
| [Populating Next Right Pointers in Each Node](https://leetcode.com/problems/populating-next-right-pointers-in-each-node) | 🟡 Medium  | O(1) space (perfect tree) |
| [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view)                                 | 🟡 Medium  | BFS level-order           |
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal)                     | 🟡 Medium  | BFS                       |
| [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list)                   | 🟡 Medium  | DFS in-place              |
