---
layout: page
title: "Delete Node in a Linked List"
difficulty: Medium
category: Linked List
tags: [Linked List]
leetcode_url: "https://leetcode.com/problems/delete-node-in-a-linked-list/"
---

# Delete Node in a Linked List / Xóa Node Trong Danh Sách Liên Kết

> **Track**: Shared | **Difficulty**: 🟡 Medium
> **Pattern**: In-place Node Modification | **Frequency**: 📘 Tier 3
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

## 🧠 Intuition / Tư Duy

**Analogy (Tiếng Việt):** Bạn đứng trong hàng và bị yêu cầu "biến mất" nhưng không ai biết ai đứng trước bạn. Giải pháp: bạn chép tên người đứng sau bạn lên thẻ của mình, rồi đẩy người đó ra khỏi hàng. Kết quả: bạn "trở thành" người sau, còn người sau thực sự biến mất.

**Pattern Recognition:**

- Không có truy cập vào head, không có node trước → không thể xóa node theo cách thông thường
- Trick duy nhất: **copy value từ node kế tiếp** vào node hiện tại, rồi skip node kế tiếp
- Đây là câu hỏi kiểm tra tư duy, không phải thuật toán phức tạp — đừng overthink

**ASCII Visual:**

```
Before: 4 → [5] → 1 → 9 → null   (xóa node có val=5)
              ↑ node được truyền vào

Step 1: Copy next val:  4 → [1] → 1 → 9 → null
Step 2: Skip next:      4 → [1] → 9 → null   ✓
```

## Problem Description

Write a function to delete a given `node` from a singly linked list. You are **only given access to that node** — not the head.

It is guaranteed the node to delete is **not the tail**.

**Example 1:**

```
Input:  head = [4,5,1,9], node = 5
Output: [4,1,9]
```

**Example 2:**

```
Input:  head = [4,5,1,9], node = 1
Output: [4,5,9]
```

**Constraints:** List has 2–1000 nodes. All values unique. Node to delete is not the tail.

## 📝 Interview Tips

- 🇻🇳 **Đây là trick question!** — Không có cách xóa node thực sự; ta chỉ "giả vờ" bằng cách copy giá trị
- 🇬🇧 **It's a trick question:** You cannot delete the actual node; instead you overwrite it with the next node's data
- 🇻🇳 **Tại sao không xóa được node thật?** — Vì không có node trước để update `.next`, và không có head để traverse lại
- 🇬🇧 **Why can't you delete the real node?** — No previous node reference, no head access
- 🇻🇳 **Assumption quan trọng:** Node không phải tail (đảm bảo `node.next` luôn tồn tại) — confirm với interviewer
- 🇬🇧 **Unique values** guarantee makes the problem well-defined; mention this observation shows attention to constraints

## Solutions

```typescript

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
 * Solution 1: Copy-Next Trick (Only viable O(1) solution)
 * Copy next node's value into current node, then skip next node.
 * Time: O(1) | Space: O(1)
 *
 * Key insight: we can't remove "this" node, but we can make it
 * look like the next node and remove the next node instead.
 */
function deleteNode(node: ListNode): void {
  // Guaranteed: node.next is not null (node is not tail)
  node.val = node.next!.val;
  node.next = node.next!.next;
}

/**
 * Solution 2: Explicit intermediate reference (same idea, more readable)
 * Time: O(1) | Space: O(1)
 */
function deleteNodeClear(node: ListNode): void {
  const nextNode = node.next!;
  node.val = nextNode.val;
  node.next = nextNode.next;
  // nextNode is now orphaned and GC-eligible
}

// Inline tests
function makeList(vals: number[]): ListNode {
  const nodes = vals.map((v) => new ListNode(v));
  nodes.forEach((n, i) => {
    if (i < nodes.length - 1) n.next = nodes[i + 1];
  });
  return nodes[0];
}
function toArr(head: ListNode | null): number[] {
  const r: number[] = [];
  while (head) {
    r.push(head.val);
    head = head.next;
  }
  return r;
}

// Delete node with val=5 from [4,5,1,9]
const list1 = makeList([4, 5, 1, 9]);
const node5 = list1.next!; // node with val=5
deleteNode(node5);
console.assert(JSON.stringify(toArr(list1)) === JSON.stringify([4, 1, 9]), "delete 5");

// Delete node with val=1 from [4,5,1,9]
const list2 = makeList([4, 5, 1, 9]);
const node1 = list2.next!.next!; // node with val=1
deleteNodeClear(node1);
console.assert(JSON.stringify(toArr(list2)) === JSON.stringify([4, 5, 9]), "delete 1");
```

```

## 🔗 Related Problems

- [19. Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) — standard deletion with head access
- [203. Remove Linked List Elements](https://leetcode.com/problems/remove-linked-list-elements/) — remove by value
- [82. Remove Duplicates from Sorted List II](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/) — more complex deletion
- [1474. Delete N Nodes After M Nodes of a Linked List](https://leetcode.com/problems/delete-n-nodes-after-m-nodes-of-a-linked-list/)
