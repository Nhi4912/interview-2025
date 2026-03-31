---
layout: page
title: "Flatten a Multilevel Doubly Linked List"
difficulty: Medium
category: Tree-Graph
tags: [Linked List, Depth-First Search, Doubly-Linked List]
leetcode_url: "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list"
---

# Flatten a Multilevel Doubly Linked List / Làm Phẳng Danh Sách Liên Kết Đôi Đa Cấp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống cuốn sách có các chú thích dài — khi gặp chú thích (child), bạn chèn toàn bộ chú thích đó vào ngay vị trí hiện tại, rồi tiếp tục đọc. Mỗi khi node có `child`, ta "kéo căng" chuỗi child vào giữa node hiện tại và node tiếp theo, rồi xóa con trỏ child.

**Pattern Recognition:**

- "Multilevel linked list" with child pointers → DFS/recursion to flatten each level
- Key pointer manipulation: `curr → [child chain] → curr.next`
- After insert: find tail of child chain, link it to `curr.next`

**Visual:**

```
1 - 2 - 3 - 4 - 5 - 6
        |
        7 - 8 - 9 - 10
            |
            11 - 12

Step 1: At node 3, has child 7
  Find tail of [7-8-9-10-11-12] = 12
  Link: 3 → 7 ..12 → 4
  Remove 3.child

Step 2 (from 7): At node 8, has child 11
  Find tail of [11-12] = 12
  Link: 8 → 11 ..12 → 9

Result: 1-2-3-7-8-11-12-9-10-4-5-6 ✅
```

## Problem Description

A multilevel doubly linked list has nodes with `prev`, `next`, and `child` pointers. The child may point to another doubly linked list. Flatten it so all nodes appear in a single-level doubly linked list in DFS order.

**Example 1:** `1-2-3-4-5-6` with `3.child→7-8-9-10` and `8.child→11-12` → `1-2-3-7-8-11-12-9-10-4-5-6`
**Example 2:** `[]` → `[]`

**Constraints:** Node count `[0, 1000]`, values `1 <= val <= 10^5`, no cycles.

## 📝 Interview Tips

1. **Clarify**: Output vẫn là doubly linked list đúng không? Prev/next đều phải chính xác / Confirm both prev and next pointers must be correct.
2. **Approach**: Recursion hoặc iterative stack — khi gặp child, flatten child trước rồi chèn vào / On each child, flatten recursively or push next to stack.
3. **Edge cases**: Node cuối có child; node chỉ có child, không có next / Last node with child; node with child but no next.
4. **Optimize**: Iterative với stack tránh stack overflow cho list rất dài / Iterative avoids recursion stack overflow.
5. **Test**: Nhiều level lồng nhau; list chỉ có 1 node có child / Deeply nested or single-node-with-child.
6. **Follow-up**: Cách unflatten (phục hồi cấu trúc gốc)? Cần lưu vị trí child ban đầu / How to unflatten back to original structure?

## Solutions

```typescript
class _Node {
  val: number;
  prev: _Node | null;
  next: _Node | null;
  child: _Node | null;
  constructor(
    val: number,
    prev: _Node | null = null,
    next: _Node | null = null,
    child: _Node | null = null,
  ) {
    this.val = val;
    this.prev = prev;
    this.next = next;
    this.child = child;
  }
}

/** Solution 1: Iterative — insert child chain inline
 * Time: O(n) | Space: O(1) extra (no recursion/stack)
 */
function flatten(head: _Node | null): _Node | null {
  let curr = head;
  while (curr !== null) {
    if (curr.child !== null) {
      const child = curr.child;
      const next = curr.next;

      // Find tail of child chain
      let tail = child;
      while (tail.next !== null) tail = tail.next;

      // Link curr → child
      curr.next = child;
      child.prev = curr;
      curr.child = null;

      // Link tail → next
      tail.next = next;
      if (next !== null) next.prev = tail;
    }
    curr = curr.next;
  }
  return head;
}

/** Solution 2: Recursive DFS — returns tail of flattened sublist
 * Time: O(n) | Space: O(depth) recursion stack
 */
function flattenRecursive(head: _Node | null): _Node | null {
  if (!head) return null;

  // Returns [head, tail] of the flattened list
  function dfs(node: _Node): [_Node, _Node] {
    let curr: _Node = node;
    let tail: _Node = node;

    while (curr !== null) {
      tail = curr;
      if (curr.child !== null) {
        const [childHead, childTail] = dfs(curr.child);
        const nextNode = curr.next;

        curr.next = childHead;
        childHead.prev = curr;
        curr.child = null;

        childTail.next = nextNode;
        if (nextNode !== null) nextNode.prev = childTail;

        tail = childTail;
        if (nextNode === null) break;
        curr = nextNode;
      } else {
        curr = curr.next!;
      }
    }
    return [node, tail];
  }

  const [h] = dfs(head);
  return h;
}

/** Solution 3: Stack-based DFS
 * Time: O(n) | Space: O(n)
 */
function flattenStack(head: _Node | null): _Node | null {
  if (!head) return null;
  const stack: _Node[] = [];
  let curr: _Node | null = head;
  let prev: _Node | null = null;

  stack.push(head);
  while (stack.length > 0) {
    curr = stack.pop()!;
    if (prev !== null) {
      prev.next = curr;
      curr.prev = prev;
    }
    if (curr.next !== null) stack.push(curr.next);
    if (curr.child !== null) {
      stack.push(curr.child);
      curr.child = null;
    }
    prev = curr;
  }
  return head;
}

// Helper to build list and verify
function buildList(vals: number[], childAt?: number, childVals?: number[]): _Node | null {
  if (!vals.length) return null;
  const nodes = vals.map((v) => new _Node(v));
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
    nodes[i + 1].prev = nodes[i];
  }
  if (childAt !== undefined && childVals) {
    nodes[childAt].child = buildList(childVals);
  }
  return nodes[0];
}

function listToArray(head: _Node | null): number[] {
  const res: number[] = [];
  while (head) {
    res.push(head.val);
    head = head.next;
  }
  return res;
}

// Test
const list1 = buildList([1, 2, 3, 4, 5, 6], 2, [7, 8, 9, 10]);
console.log(listToArray(flatten(list1))); // [1,2,3,7,8,9,10,4,5,6]

const list2 = buildList([1, 2, 3], 2, [4, 5]);
console.log(listToArray(flattenRecursive(list2))); // [1,2,3,4,5]
```

## 🔗 Related Problems

| Problem                                                                                                                                          | Relationship                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list)                                           | DFS flatten tree to linked list in-order  |
| [Convert Binary Search Tree to Sorted Doubly Linked List](https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list) | BST → doubly linked list via in-order DFS |
| [Design Linked List](https://leetcode.com/problems/design-linked-list)                                                                           | Linked list pointer manipulation practice |
