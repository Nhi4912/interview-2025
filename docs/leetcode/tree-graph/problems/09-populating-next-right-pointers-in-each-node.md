---
layout: page
title: "Populating Next Right Pointers in Each Node"
difficulty: Medium
category: Tree/Graph
tags: [Tree, Breadth-First Search, Linked List]
leetcode_url: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/"
---

# Populating Next Right Pointers in Each Node / Điền Con Trỏ Next Theo Từng Tầng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS Level Order / O(1) Space Pointer Linking
> **Frequency**: 📘 Tier 2 — Gặp ~40% interviews, hay bị hỏi biến thể O(1) space
> **See also**: [Populating Next Right Pointers II](https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/) | [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nối dây điện qua các học sinh ngồi cùng hàng trong lớp — học sinh đầu tiên nối với người kế bên, cứ thế cho đến cuối hàng (cuối hàng → null). Với cây hoàn hảo (perfect binary tree), đặc biệt hơn: ta có thể dùng chính dây điện hàng trên để di chuyển, không cần danh sách hàng đợi.

**Pattern Recognition:**

- Signal: "next right pointer", "level-by-level linking" → **BFS hoặc O(1) pointer trick (perfect BT only)**
- BFS approach: xử lý từng level, kết nối `current.next = queue[0]` sau mỗi dequeue (trừ node cuối)
- O(1) space: dùng `leftmost` để nhảy tầng, dùng `current.next` đã nối ở tầng trên để duyệt ngang

**Visual — Nối next pointers trên [1,2,3,4,5,6,7]:**

```
Before:                      After:
        1                           1 → NULL
       / \                         / \
      2   3          →            2 → 3 → NULL
     / \ / \                     / \ / \
    4  5 6  7                   4→5→6→7 → NULL

O(1) approach: at level 1, use node.next to walk:
  node=2: 2.left.next = 2.right (→ 4.next=5)
          2.right.next = 2.next.left (→ 5.next=6)
  node=3: 3.left.next = 3.right (→ 6.next=7)
          3.right.next = null
```

---

## Problem Description

Given a **perfect binary tree** (all leaves at same level, every parent has two children), populate each `next` pointer to point to its next right node, or `null` if none.

```
Example 1: root = [1,2,3,4,5,6,7]
           → each node's next points to the node immediately to its right on the same level
Example 2: root = []  → null
```

---

## 📝 Interview Tips

1. **Clarify**: Perfect binary tree (this problem) vs. arbitrary binary tree ([LeetCode 117](https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/)) — different constraints, different optimal solution.
2. **BFS first**: Giải BFS queue trước để confirm correctness, rồi optimize về O(1) space.
3. **O(1) insight**: "I already set next pointers for level N — I can walk level N using those nexts to set level N+1" / Dùng con trỏ next đã nối để đi ngang, không cần queue.
4. **Perfect BT constraint**: O(1) solution works ONLY for perfect BT because every node has exactly 0 or 2 children. Biến thể II ([LC 117]) cần cách khác.
5. **Termination**: `while (leftmost.left)` — dừng khi đến tầng lá (lá không có con).
6. **Space**: BFS = O(n) (queue), O(1) solution = O(1) extra space (chỉ dùng vài con trỏ).

---

## Solutions

```typescript
// Note: Node class with val, left, right, next is provided by LeetCode environment

// Solution 1: BFS with Queue (Clear and correct)
// Time: O(n) — each node visited once
// Space: O(n) — queue holds at most one full level (up to n/2 nodes)
function connect(root: Node | null): Node | null {
if (!root) return null;
const queue: Node[] = [root];
while (queue.length > 0) {
const size = queue.length;
for (let i = 0; i < size; i++) {
const node = queue.shift()!;
node.next = i < size - 1 ? queue[0] : null; // connect to next in level
if (node.left) queue.push(node.left);
if (node.right) queue.push(node.right);
}
}
return root;
}

// Solution 2: O(1) Space — Use already-set next pointers (Optimal for perfect BT)
// Time: O(n) — visit each node once
// Space: O(1) — only a few pointer variables, no queue
function connectOptimal(root: Node | null): Node | null {
if (!root) return null;
let leftmost = root; // start of each level
while (leftmost.left) { // stop at leaf level
let curr = leftmost;
while (curr) {
// Connect left child → right child (same parent)
curr.left!.next = curr.right;
// Connect right child → next parent's left child
if (curr.next) curr.right!.next = curr.next.left;
curr = curr.next; // walk level using already-set nexts
}
leftmost = leftmost.left; // drop to next level
}
return root;
}

// === Test Cases ===
// Build perfect binary tree [1,2,3,4,5,6,7]
const n4 = new Node(4); const n5 = new Node(5);
const n6 = new Node(6); const n7 = new Node(7);
const n2 = new Node(2, n4, n5); const n3 = new Node(3, n6, n7);
const root = new Node(1, n2, n3);

connectOptimal(root);
console.log(root.next); // null ✅ (root has no next)
console.log(n2.next?.val); // 3 ✅
console.log(n4.next?.val); // 5 ✅
console.log(n7.next); // null ✅ (last in level)
```

---

## 🔗 Related Problems

- [Populating Next Right Pointers II](https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/) — harder variant: arbitrary binary tree, O(1) solution is trickier
- [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) — same BFS structure, collect into arrays instead of linking
- [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/) — BFS, use last element per level
- [Connect All Siblings](https://leetcode.com/problems/connect-all-siblings-of-a-binary-tree/) — variation: connect across all levels, not just within one
