---
layout: page
title: "Convert Binary Search Tree to Sorted Doubly Linked List"
difficulty: Medium
category: Tree & Graph
tags: [Linked List, Stack, Tree, DFS, Binary Search Tree, Doubly-Linked List]
leetcode_url: "https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list"
---

# Convert BST to Sorted Doubly Linked List / Chuyển BST Thành Danh Sách Liên Kết Đôi

> **Track**: Tree & Graph | **Difficulty**: 🟡 Medium | **Pattern**: In-Order Traversal
> **Frequency**: 📗 Tier 2 — Hỏi nhiều ở Meta/Facebook
> **See also**: [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list) | [Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy nghĩ đến một dàn học sinh được xếp hàng theo cây gia phả (BST). Khi giáo viên yêu cầu xếp hàng theo chiều cao (in-order), học sinh tự kết nối tay: người trước chỉ sang phải người sau, người sau chỉ sang trái người trước — tạo thành chuỗi vòng tròn. Đây chính là chuyển đổi BST in-order thành circular doubly linked list: duyệt trái-giữa-phải, mỗi node kết nối với node liền kề, cuối cùng nối đầu và đuôi lại.

## Visual (Minh họa trực quan)

```
BST:        4
           / \
          2   5
         / \
        1   3

In-order: 1 → 2 → 3 → 4 → 5

Step-by-step link building:
  visit 1: prev=null, head=1, prev=1
  visit 2: prev=1, link 1↔2, prev=2
  visit 3: prev=2, link 2↔3, prev=3
  visit 4: prev=3, link 3↔4, prev=4
  visit 5: prev=4, link 4↔5, prev=5

Circular: 5.right = head(1), head(1).left = 5
Result: 1⇆2⇆3⇆4⇆5⇆(back to 1)
```

## Problem (Bài toán)

Convert a **BST** to a **sorted circular doubly linked list** in-place. Use the `left` pointer as `prev` and `right` pointer as `next`. The list must be **circular** — tail's right points to head, head's left points to tail. Return the smallest node (head).

**Example 1:** BST with nodes `[4,2,5,1,3]` → circular DLL: `1⇆2⇆3⇆4⇆5` (circular)
**Example 2:** Single node `[1]` → `1` (points to itself)
**Example 3:** Empty tree `[]` → `null`

**Constraints:** `0 ≤ number of nodes ≤ 2000`, `-1000 ≤ Node.val ≤ 1000`, all values unique

## Tips (Mẹo phỏng vấn)

- **In-order gives sorted** / In-order cho thứ tự sắp xếp: BST in-order luôn cho giá trị tăng dần — đây là chìa khóa
- **Track head and prev** / Theo dõi head và prev: `head` lưu node nhỏ nhất (node đầu tiên), `prev` lưu node vừa xử lý để link
- **Circular connection last** / Nối vòng sau cùng: Sau khi duyệt xong, nối `prev.right = head` và `head.left = prev`
- **In-place means reuse pointers** / Tái sử dụng con trỏ: Không tạo node mới — chỉ thay đổi `left`/`right` của node hiện có
- **Iterative to avoid stack overflow** / Dùng vòng lặp tránh tràn stack: n có thể đến 2000, iterative an toàn hơn
- **Edge case single node** / Node đơn: `head.left = head.right = head` — tự trỏ về mình

## Solution 1 - Recursive In-Order

```typescript
/**
 * @complexity Time: O(n) | Space: O(h) where h = tree height
 * Classic in-order DFS; link each node with previous in sorted order
 */
class Node {
  val: number;
  left: Node | null;
  right: Node | null;
  constructor(val: number, left?: Node | null, right?: Node | null) {
    this.val = val;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

function treeToDoublyList(root: Node | null): Node | null {
  if (!root) return null;
  let head: Node | null = null;
  let prev: Node | null = null;

  function inorder(node: Node | null): void {
    if (!node) return;
    inorder(node.left);
    if (prev) {
      prev.right = node;
      node.left = prev;
    } else head = node; // first node = head
    prev = node;
    inorder(node.right);
  }

  inorder(root);
  // Make circular
  prev!.right = head!;
  head!.left = prev!;
  return head;
}
```

## Solution 2 - Iterative In-Order (No Recursion)

```typescript
/**
 * @complexity Time: O(n) | Space: O(h) stack space
 * Morris traversal alternative or explicit stack; avoids call stack limit
 */
function treeToDoublyListIterative(root: Node | null): Node | null {
  if (!root) return null;
  const stack: Node[] = [];
  let curr: Node | null = root;
  let head: Node | null = null;
  let prev: Node | null = null;

  while (curr || stack.length) {
    while (curr) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop()!;

    if (prev) {
      prev.right = curr;
      curr.left = prev;
    } else head = curr;
    prev = curr;

    curr = curr.right;
  }

  // Circular link
  prev!.right = head!;
  head!.left = prev!;
  return head;
}
```

## Test Cases

```typescript
// Build BST: 4,2,5,1,3
const n1 = new Node(1),
  n2 = new Node(2),
  n3 = new Node(3);
const n4 = new Node(4),
  n5 = new Node(5);
n4.left = n2;
n4.right = n5;
n2.left = n1;
n2.right = n3;

const head = treeToDoublyList(n4);
// Print first 5 elements going right
let cur = head,
  vals: number[] = [];
for (let i = 0; i < 5; i++) {
  vals.push(cur!.val);
  cur = cur!.right;
}
console.log(vals); // → [1, 2, 3, 4, 5]
console.log(cur === head); // → true (circular)

console.log(treeToDoublyList(null)); // → null
console.log(treeToDoublyList(new Node(1))?.val); // → 1
```

## Related Problems

| Problem                            | Difficulty | Link                                                                              |
| ---------------------------------- | ---------- | --------------------------------------------------------------------------------- |
| Flatten Binary Tree to Linked List | Medium     | [LC 114](https://leetcode.com/problems/flatten-binary-tree-to-linked-list)        |
| Binary Tree Inorder Traversal      | Easy       | [LC 94](https://leetcode.com/problems/binary-tree-inorder-traversal)              |
| Convert Sorted List to BST         | Medium     | [LC 109](https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree) |
