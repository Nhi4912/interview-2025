---
layout: page
title: "Reverse Nodes in k-Group"
difficulty: Hard
category: Linked-List
tags: [Linked List, Recursion]
leetcode_url: "https://leetcode.com/problems/reverse-nodes-in-k-group"
---

# Reverse Nodes in k-Group / Đảo Ngược Linked List Theo Nhóm k

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Iterative k-Group Reversal with Dummy Head
> **Frequency**: ⭐ Tier 2 — Gặp ở 28+ companies
> **See also**: [Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs) | [Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii)

---

## 🧠 Intuition / Tư Duy

- **Analogy:** Tưởng tượng bạn có một đoàn sinh viên xếp hàng. Cứ k người một nhóm, bạn cho nhóm đó quay đầu lại (người đứng cuối lên đầu). Nhóm nào không đủ k người (nhóm cuối) thì giữ nguyên. Sau mỗi nhóm, nối đuôi nhóm này vào đầu nhóm tiếp theo.

- **Pattern Recognition:**
  - Signal: "reverse in k-group" + "linked list" → **Dummy head + group reversal loop**
  - Bước 1: Kiểm tra còn đủ k node không (getKth helper)
  - Bước 2: Đảo ngược k nodes hiện tại
  - Bước 3: Nối `groupPrev.next = tail` và `head.next = nextGroup`
  - Bước 4: Chuyển con trỏ đến nhóm tiếp theo

- **Visual — list = 1→2→3→4→5, k=2:**

```
dummy → 1 → 2 → 3 → 4 → 5 → null
  │
groupPrev

Round 1: groupPrev=dummy, head=1, kth=2
  Reverse [1,2]:  2 → 1
  Connect: dummy → 2 → 1 → (next group starts at 3)
  groupPrev = 1 (now tail of reversed group)

Round 2: groupPrev=1, head=3, kth=4
  Reverse [3,4]:  4 → 3
  Connect: 1 → 4 → 3 → (next group starts at 5)
  groupPrev = 3

Round 3: groupPrev=3, head=5, kth=null (< k nodes left)
  STOP — leave 5 as-is

Result: dummy → 2 → 1 → 4 → 3 → 5 ✓
```

---

## Problem Description

Given the head of a linked list, reverse the nodes of the list `k` at a time.
Nodes not part of a complete group of k are left as-is. Must do it **in-place**.

```
Input:  1→2→3→4→5, k=2  →  2→1→4→3→5
Input:  1→2→3→4→5, k=3  →  3→2→1→4→5
Input:  1→2,        k=3  →  1→2   (less than k nodes, unchanged)
```

Constraints: `1 ≤ k ≤ n ≤ 5000`, node values in [0, 1000].

---

## 📝 Interview Tips

1. **Dummy head luôn hữu ích**: Tránh xử lý edge case của head node / **Dummy head**: simplifies head replacement case
2. **getKth helper**: Hàm kiểm tra còn đủ k node và trả về node thứ k / **getKth helper**: check if k nodes exist, return k-th node
3. **4 con trỏ cần track**: `groupPrev`, `groupNext`, `head` (đầu group), `kth` (cuối group) / **4 pointers**: prev/next of group, group head/tail
4. **Đảo ngược trong nhóm**: Standard linked list reversal nhưng chỉ đến `kth.next` / **In-group reversal**: standard reverse but stop at group boundary
5. **Kết nối sau khi đảo**: `groupPrev.next = kth`, `head.next = groupNext` / **Reconnect**: tail of group → next group; prev → new group head
6. **Recursive cũng hợp lệ**: Gọi đệ quy cho phần còn lại sau k nodes / **Recursion**: `head.next = reverseKGroup(groupNext, k)` after reversing first group

---

## Solutions

```typescript
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * Helper: get the k-th node from start, or null if fewer than k nodes
 */
function getKth(node: ListNode | null, k: number): ListNode | null {
  while (node && k > 0) {
    node = node.next;
    k--;
  }
  return node;
}

/**
 * Solution 1: Iterative with Dummy Head (Optimal)
 * Time: O(n) | Space: O(1)
 */
function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let groupPrev = dummy;

  while (true) {
    const kth = getKth(groupPrev, k);
    if (!kth) break; // fewer than k nodes remain

    const groupNext = kth.next;
    // Reverse k nodes starting from groupPrev.next
    let prev: ListNode | null = groupNext;
    let curr: ListNode | null = groupPrev.next;
    while (curr !== groupNext) {
      const tmp = curr!.next;
      curr!.next = prev;
      prev = curr;
      curr = tmp;
    }
    // Connect reversed group
    const groupHead = groupPrev.next!; // original head is now tail
    groupPrev.next = kth; // new group head
    groupPrev = groupHead; // advance groupPrev to new tail
  }
  return dummy.next;
}

/**
 * Solution 2: Recursive (elegant)
 * Time: O(n) | Space: O(n/k) stack frames
 */
function reverseKGroupRecursive(head: ListNode | null, k: number): ListNode | null {
  const kth = getKth(head, k);
  if (!kth) return head; // fewer than k nodes, leave unchanged

  const groupNext = kth.next;
  // Reverse this group
  let prev: ListNode | null = null,
    curr = head;
  while (curr !== groupNext) {
    const tmp = curr!.next;
    curr!.next = prev;
    prev = curr;
    curr = tmp;
  }
  // head is now the tail; connect to next reversed group
  head!.next = reverseKGroupRecursive(groupNext, k);
  return prev; // prev is the new head (was kth)
}

// Helper to build and print list
function buildList(arr: number[]): ListNode | null {
  if (!arr.length) return null;
  const head = new ListNode(arr[0]);
  let cur = head;
  for (let i = 1; i < arr.length; i++) {
    cur.next = new ListNode(arr[i]);
    cur = cur.next;
  }
  return head;
}
function listToArr(head: ListNode | null): number[] {
  const r: number[] = [];
  while (head) {
    r.push(head.val);
    head = head.next;
  }
  return r;
}

// === Test Cases ===
console.log(listToArr(reverseKGroup(buildList([1, 2, 3, 4, 5]), 2))); // [2,1,4,3,5]
console.log(listToArr(reverseKGroup(buildList([1, 2, 3, 4, 5]), 3))); // [3,2,1,4,5]
console.log(listToArr(reverseKGroup(buildList([1, 2]), 3))); // [1,2]
```

---

## 🔗 Related Problems

| Problem                                                                        | Relationship                               |
| ------------------------------------------------------------------------------ | ------------------------------------------ |
| [Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs)       | Special case: k=2 reverse in pairs         |
| [Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii) | Reverse sublist between positions m and n  |
| [Rotate List](https://leetcode.com/problems/rotate-list)                       | Different linked list segment manipulation |
| [Reorder List](https://leetcode.com/problems/reorder-list)                     | Combine halves with in-place modification  |
