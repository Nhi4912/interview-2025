---
layout: page
title: "Convert Sorted List to Binary Search Tree"
difficulty: Medium
category: Tree-Graph
tags: [Linked List, Divide and Conquer, Tree, Binary Search Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree"
---

# Convert Sorted List to Binary Search Tree / Chuyển Danh Sách Đã Sắp Xếp Thành BST Cân Bằng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Divide and Conquer
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Convert Sorted Array to Binary Search Tree](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree) | [Convert Binary Search Tree to Sorted Doubly Linked List](https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chia đôi cuốn sách để lập mục lục — chọn trang giữa làm gốc, nửa trái thành cây trái, nửa phải thành cây phải. Làm đệ quy đảm bảo cây cân bằng.

**Pattern Recognition:**

- Signal: "sorted list → height-balanced BST" → **Divide & Conquer với slow/fast pointer**
- Tìm phần tử giữa bằng slow/fast pointer, cắt danh sách, đệ quy hai nửa
- Key insight: phần tử giữa luôn là root của BST con để đảm bảo cân bằng

**Visual — Convert Sorted List:**

```
-10 → -3 → 0 → 5 → 9
       ↑ slow (mid)
      root = -3
     /          \
-10 → (end)   0 → 5 → 9
  root=-10     root=5 (mid)
              /    \
             0      9
Result:     -3
           /   \
        -10     5
               / \
              0   9
```

---

## Problem Description

Given the head of a singly linked list where elements are sorted in ascending order, convert it to a height-balanced binary search tree. ([LeetCode #109](https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree))

A height-balanced BST is one where the depth of the two subtrees of every node never differs by more than 1.

**Example 1:** `head = [-10,-3,0,5,9]` → `[0,-3,9,-10,null,5]`
**Example 2:** `head = []` → `[]`

---

## 📝 Interview Tips

1. **Clarify**: "Height-balanced là điều kiện bắt buộc không? Có thể có nhiều kết quả hợp lệ" / Multiple valid balanced BSTs exist
2. **Approach 1**: "Convert list → array rồi dùng binary search O(N log N), O(N) space" / Array conversion is simpler
3. **Approach 2**: "Slow/fast pointer tìm mid, cắt list, đệ quy — O(N log N), O(log N) space" / In-place with pointers
4. **Slow/fast pointer**: "Fast đi 2 bước, slow đi 1 bước → slow dừng ở mid" / Classic midpoint technique
5. **Edge cases**: "List rỗng → null; một phần tử → single root; hai phần tử → root + left child" / Handle empty and tiny lists
6. **Follow-up**: "Nếu là array sorted thì O(N) bằng cách dùng index trực tiếp" / Array version is O(N)

---

## Solutions

```typescript
class ListNode {
  val: number;
  next: ListNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}
class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

/**
 * Solution 1: Convert to Array, then Divide & Conquer
 * Time: O(N) — one pass to array + O(N) build
 * Space: O(N) — array storage
 */
function sortedListToBSTArray(head: ListNode | null): TreeNode | null {
  const arr: number[] = [];
  for (let curr = head; curr; curr = curr.next) arr.push(curr.val);

  function build(lo: number, hi: number): TreeNode | null {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    const node = new TreeNode(arr[mid]);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, arr.length - 1);
}

/**
 * Solution 2: Slow/Fast Pointer (O(log N) space)
 * Time: O(N log N) — finding mid at each level costs O(N) total across all levels
 * Space: O(log N) — recursion depth for balanced tree
 */
function sortedListToBST(head: ListNode | null): TreeNode | null {
  if (!head) return null;
  if (!head.next) return new TreeNode(head.val);

  // Find the node just before the middle
  let prev: ListNode | null = null;
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  while (fast && fast.next) {
    prev = slow;
    slow = slow!.next;
    fast = fast.next.next;
  }

  // slow is now the middle node; disconnect left half
  if (prev) prev.next = null;

  const root = new TreeNode(slow!.val);
  root.left = prev ? sortedListToBST(head) : null;
  root.right = sortedListToBST(slow!.next);
  return root;
}

// Helper to build list
function buildList(vals: number[]): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy;
  for (const v of vals) {
    curr.next = new ListNode(v);
    curr = curr.next;
  }
  return dummy.next;
}
function inorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [...inorder(root.left), root.val, ...inorder(root.right)];
}

// === Test Cases ===
const list1 = buildList([-10, -3, 0, 5, 9]);
console.log(inorder(sortedListToBST(list1))); // [-10,-3,0,5,9] (sorted = valid BST)
console.log(inorder(sortedListToBSTArray(buildList([-10, -3, 0, 5, 9])))); // [-10,-3,0,5,9]
console.log(sortedListToBST(null)); // null
```

---

## 🔗 Related Problems

| Problem                                                                                                                | Difficulty | Pattern           |
| ---------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------- |
| [Convert Sorted Array to Binary Search Tree](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree) | 🟢 Easy    | Divide & conquer  |
| [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list)                 | 🟡 Medium  | DFS in-place      |
| [Linked List in Binary Tree](https://leetcode.com/problems/linked-list-in-binary-tree)                                 | 🟡 Medium  | DFS matching      |
| [Balance a Binary Search Tree](https://leetcode.com/problems/balance-a-binary-search-tree)                             | 🟡 Medium  | Inorder + rebuild |
