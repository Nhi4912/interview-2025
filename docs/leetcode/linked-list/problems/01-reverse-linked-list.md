---
layout: page
title: "Reverse Linked List"
difficulty: Easy
category: Linked List
tags: [Linked List, Iterative]
leetcode_url: "https://leetcode.com/problems/reverse-linked-list/"
---

# Reverse Linked List / Đảo Ngược Danh Sách Liên Kết

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Linked List (Iterative Reversal)
> **Frequency**: 🔥 Tier 1 — xuất hiện rất thường trong vòng phone screen và onsite
> **See also**: [Merge Two Sorted Lists](./02-merge-two-sorted-lists.md) | [Palindrome Linked List](./03-palindrome-linked-list.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn có một đoàn tàu đang di chuyển — bạn cần đổi hướng từng toa tàu một. Mỗi toa chỉ được móc vào toa phía sau, vì vậy bạn cần lưu tạm toa kế tiếp trước khi đổi hướng. Sau khi đổi hết, đầu tàu cũ trở thành đuôi tàu mới.

**Pattern Recognition:**

- Signal: "reverse / đảo ngược linked list" → **Iterative Reversal with 3 pointers**
- Không thể đi ngược trên singly linked list → phải giữ `prev`, `curr`, `next`
- Mỗi bước: đổi hướng `curr.next`, rồi tiến cả 3 con trỏ lên

**Visual — Iterative Reversal on [1→2→3→4→5]:**

```
Initial:  prev=null  curr=1→2→3→4→5

Step 1:   next=2, 1.next=null, prev=1, curr=2
          null←1  2→3→4→5

Step 2:   next=3, 2.next=1,    prev=2, curr=3
          null←1←2  3→4→5

Step 3:   next=4, 3.next=2,    prev=3, curr=4
          null←1←2←3  4→5

Step 4:   next=5, 4.next=3,    prev=4, curr=5
          null←1←2←3←4  5

Step 5:   next=null, 5.next=4, prev=5, curr=null
          null←1←2←3←4←5

Return: prev=5  (new head)
```

---

## Problem Description

Given the head of a singly linked list, reverse the list and return the reversed list's head. Each node's `next` pointer must be redirected to the previous node.

```
Example 1: [1,2,3,4,5] → [5,4,3,2,1]
Example 2: [1,2]       → [2,1]
Example 3: []          → []
```

Constraints:

- The number of nodes is in the range `[0, 5000]`
- `-5000 <= Node.val <= 5000`

---

## 📝 Interview Tips

1. **Clarify**: Singly or doubly linked list? / Danh sách đơn hay đôi?
2. **Brute force**: Collect all values into array, reverse, rebuild — O(n) time, O(n) space / Lưu vào mảng rồi xây lại
3. **Optimize**: In-place with 3 pointers — O(n) time, O(1) space / Dùng 3 con trỏ, không cần bộ nhớ thêm
4. **Edge cases**: Empty list, single node / Danh sách rỗng, 1 phần tử
5. **Follow-up**: Reverse only k nodes at a time (LC 25) / Đảo ngược từng nhóm k nút

---

## Solutions

{% raw %}

interface ListNode {
val: number;
next: ListNode | null;
}

/\*\*

- Solution 1: Stack / Array (Brute Force)
- Time: O(n) — two passes: collect values then rebuild
- Space: O(n) — stores all node values in an array
  \*/
  function reverseListBrute(head: ListNode | null): ListNode | null {
  const vals: number[] = [];
  let curr = head;
  while (curr) { vals.push(curr.val); curr = curr.next; }

if (!vals.length) return null;
const dummy: ListNode = { val: 0, next: null };
let node = dummy;
for (const v of vals.reverse()) {
node.next = { val: v, next: null };
node = node.next;
}
return dummy.next;
}

/\*\*

- Solution 2: Iterative with 3 Pointers (Optimal)
- Time: O(n) — single pass, each node visited once
- Space: O(1) — only three pointer variables
  \*/
  function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;

while (curr) {
const next = curr.next; // 1. save next before overwriting
curr.next = prev; // 2. reverse the link
prev = curr; // 3. advance prev
curr = next; // 4. advance curr
}

return prev; // prev is the new head
}

// === Test Cases ===
const list1: ListNode = { val: 1, next: { val: 2, next: { val: 3, next: { val: 4, next: { val: 5, next: null } } } } };
console.log(reverseList(list1)); // 5→4→3→2→1
console.log(reverseList(null)); // null

{% endraw %}

---

## 🔗 Related Problems

- [Merge Two Sorted Lists](./02-merge-two-sorted-lists.md) — cùng thao tác con trỏ trên linked list
- [Palindrome Linked List](./03-palindrome-linked-list.md) — dùng reverse làm bước phụ để so sánh nửa sau
