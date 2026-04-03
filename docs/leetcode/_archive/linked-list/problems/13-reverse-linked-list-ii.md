---
layout: page
title: "Reverse Linked List II"
difficulty: Medium
category: Linked-List
tags: [Linked List]
leetcode_url: "https://leetcode.com/problems/reverse-linked-list-ii"
---

# Reverse Linked List II / Đảo Ngược Danh Sách Liên Kết II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Linked List In-Place Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 16 companies (Amazon, Microsoft)
> **See also**: [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list) | [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đoàn tàu — chỉ cần nối lại các khớp nối, không cần di chuyển cả toa. Để đảo đoạn [left, right], giữ con trỏ "trước đoạn" và lần lượt "cắm" node tiếp theo vào đầu đoạn đã đảo.

**Pattern Recognition:**

- Signal: "reverse a sublist", "left to right" → **Dummy Node + In-place insertion**
- Dùng dummy node tránh edge case khi left=1 (head thay đổi)
- One-pass: giữ `prev` (trước đoạn) và `curr` (tail của đoạn đảo), dùng kỹ thuật "insert at front"

**Visual — head=[1,2,3,4,5], left=2, right=4:**

```
dummy→1→2→3→4→5   prev=1, curr=2

Iteration 1 (insert 3 after prev):
  next=3, curr.next=4, next.next=prev.next(=2), prev.next=3
  → dummy→1→3→2→4→5   curr=2 (curr stays as tail of reversed part)

Iteration 2 (insert 4 after prev):
  next=4, curr.next=5, next.next=prev.next(=3), prev.next=4
  → dummy→1→4→3→2→5   ✅

Return dummy.next = 1→4→3→2→5
```

---

## Problem Description

Given the head of a singly linked list and integers `left` and `right` (1-indexed), reverse the nodes from position `left` to `right`, and return the list's head.

```
Example 1: head=[1,2,3,4,5], left=2, right=4  → [1,4,3,2,5]
Example 2: head=[5], left=1, right=1            → [5]
```

Constraints: `1 <= n <= 500`, `-500 <= val <= 500`, `1 <= left <= right <= n`

---

## 📝 Interview Tips

1. **Clarify**: "left và right có thể bằng nhau không (không đảo gì)?" / left=right → no change.
2. **Dummy node**: Thêm dummy trước head để xử lý left=1 đồng nhất — không cần check edge case.
3. **One-pass insight**: Giữ `prev` cố định, `curr` là tail của đoạn đảo, lần lượt insert vào front.
4. **Vẽ ví dụ**: Luôn vẽ linked list trước khi code — dễ sai pointer nếu không visualize.
5. **Dry-run**: Check lại sau khi viết bằng trace tay với ví dụ nhỏ.
6. **Follow-up**: "Reverse k-group (25)? Rotate list? Swap pairs?" — tất cả dùng cùng kỹ thuật.

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

// Helper: build list from array
function fromArr(vals: number[]): ListNode | null {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of vals) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}
// Helper: list to array for printing
function toArr(head: ListNode | null): number[] {
  const res: number[] = [];
  while (head) {
    res.push(head.val);
    head = head.next;
  }
  return res;
}

/**
 * Solution 1: Extract + Reverse + Reconnect
 * Time: O(n) — one pass to find section + one pass to reverse + reconnect
 * Space: O(1) — pure pointer manipulation, no extra structure
 */
function reverseBetween1(head: ListNode | null, left: number, right: number): ListNode | null {
  const dummy = new ListNode(0);
  dummy.next = head;
  let prev: ListNode = dummy;

  // Move prev to node just before position `left`
  for (let i = 1; i < left; i++) prev = prev.next!;

  // Reverse the sublist [left..right] by disconnecting & reversing
  let curr = prev.next,
    prevSub: ListNode | null = null;
  for (let i = 0; i <= right - left; i++) {
    const next = curr!.next;
    curr!.next = prevSub;
    prevSub = curr;
    curr = next;
  }
  // Reconnect: prev → reversed head, reversed tail → curr (node after right)
  prev.next!.next = curr; // old left node (now tail) → node after right
  prev.next = prevSub; // prev → old right node (now head of reversed)
  return dummy.next;
}

/**
 * Solution 2: One-Pass Iterative — "Insert at Front" technique
 * Time: O(n) — single pass, (right-left) insert operations
 * Space: O(1)
 *
 * Keep `prev` fixed at position left-1.
 * Keep `curr` as the tail of the already-reversed segment.
 * Each step: pick curr.next, insert it right after prev.
 */
function reverseBetween(head: ListNode | null, left: number, right: number): ListNode | null {
  const dummy = new ListNode(0);
  dummy.next = head;
  let prev: ListNode = dummy;

  for (let i = 1; i < left; i++) prev = prev.next!; // advance prev to left-1

  const curr = prev.next!; // curr = node at position `left` (becomes tail after reversal)
  for (let i = 0; i < right - left; i++) {
    const next = curr.next!; // node to be moved to front
    curr.next = next.next; // detach `next` from curr
    next.next = prev.next; // `next` points to current front of reversed segment
    prev.next = next; // prev now points to `next` (new front)
  }
  return dummy.next;
}

// === Test Cases ===
console.log(toArr(reverseBetween(fromArr([1, 2, 3, 4, 5]), 2, 4))); // [1,4,3,2,5]
console.log(toArr(reverseBetween(fromArr([5]), 1, 1))); // [5]
console.log(toArr(reverseBetween(fromArr([1, 2, 3]), 1, 3))); // [3,2,1]
console.log(toArr(reverseBetween1(fromArr([1, 2, 3, 4, 5]), 2, 4))); // [1,4,3,2,5]
```

---

## 🔗 Related Problems

| Problem                                                                                 | Relationship                         |
| --------------------------------------------------------------------------------------- | ------------------------------------ |
| [92. Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/)     | This problem                         |
| [206. Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)          | Simpler version — reverse whole list |
| [25. Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/) | Harder — reverse every k nodes       |
| [24. Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/)           | Special case: k=2 reverse groups     |
| [61. Rotate List](https://leetcode.com/problems/rotate-list/)                           | Similar pointer manipulation         |
