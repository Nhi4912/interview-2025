---
layout: page
title: "Remove Nth Node From End of List"
difficulty: Medium
category: Linked List
tags: [Linked List, Two Pointers]
leetcode_url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/"
---

# Remove Nth Node From End of List / Xóa Node Thứ N Từ Cuối Danh Sách

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers (Fixed Gap)
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Middle of Linked List](https://leetcode.com/problems/middle-of-the-linked-list/) | [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng hai người chạy trên đường đua, một người xuất phát trước N+1 bước. Khi người chạy nhanh về đích (cuối danh sách), người chạy chậm đang đứng đúng vị trí node trước node cần xóa. Khoảng cách cố định giữa hai con trỏ là chìa khóa — không cần biết tổng độ dài danh sách.

**Pattern Recognition:**

- Signal: "nth from end" without known length, single pass → **Two Pointers with fixed N+1 gap**
- Fast đi trước N+1 bước (không phải N) để slow dừng ở node TRƯỚC node cần xóa
- Dummy node xử lý edge case xóa head mà không cần điều kiện riêng

**Visual — Remove 2nd from end: [1→2→3→4→5], n=2:**

```
Initial: dummy → 1 → 2 → 3 → 4 → 5 → null
         S,F

Step 1: Move F forward n+1=3 steps:
         dummy → 1 → 2 → 3 → 4 → 5 → null
         S            F

Step 2: Move S and F together until F=null:
         dummy → 1 → 2 → 3 → 4 → 5 → null
                          S        F(=null)

Step 3: S.next = S.next.next  (skip node 4)
Result:  1 → 2 → 3 → 5 ✅
```

---

## Problem Description

Given the head of a linked list, remove the nth node from the end and return the modified head.

```
Example 1: head=[1,2,3,4,5], n=2 → [1,2,3,5]
Example 2: head=[1], n=1         → []
Example 3: head=[1,2], n=1       → [1]
```

Constraints:

- 1 <= list length <= 30
- 0 <= node.val <= 100
- 1 <= n <= list length (n is always valid)

---

## 📝 Interview Tips

1. **Clarify**: Is n guaranteed valid (1 ≤ n ≤ length)? Can we remove the head? / VI: "n có luôn hợp lệ không? n có thể bằng độ dài danh sách (tức là xóa head) không?"
2. **Brute force**: Two-pass — first count length, then walk to position (length - n) / VI: Đi hai lần: lần đầu đếm độ dài L, lần hai đi đến vị trí L-n để xóa
3. **Optimize**: One-pass two pointers with gap N+1 — fast pointer signals when slow is in position / VI: Dùng hai con trỏ cách nhau N+1 bước, chỉ cần đi một lần qua danh sách
4. **Edge cases**: Removing head (n = length) → dummy node handles this without special-casing / VI: Dummy node giúp tránh xử lý riêng trường hợp xóa head, slow ở dummy khi fast đến cuối
5. **Follow-up**: What if you had to remove the kth from the start in the same pass? / VI: Làm sao xóa cả node thứ k từ đầu và thứ n từ cuối trong một lần đi?

---

## Solutions

{% raw %}

class ListNode {
val: number;
next: ListNode | null;
constructor(val = 0, next: ListNode | null = null) {
this.val = val; this.next = next;
}
}

/\*\*

- Solution 1: Two Pass — Count Length First (Brute Force)
- Time: O(n) — two full passes through the list
- Space: O(1) — only pointer variables
  \*/
  function removeNthFromEndTwoPass(head: ListNode | null, n: number): ListNode | null {
  let length = 0;
  let curr: ListNode | null = head;
  while (curr) { length++; curr = curr.next; }

const dummy = new ListNode(0, head);
curr = dummy;
// Walk to the node just before the target (length - n steps from dummy)
for (let i = 0; i < length - n; i++) curr = curr!.next;
curr!.next = curr!.next!.next; // skip the nth-from-end node
return dummy.next;
}

/\*\*

- Solution 2: Two Pointers with N+1 Gap (Optimal — One Pass)
- Time: O(n) — single traversal of the list
- Space: O(1) — two pointer variables only
  \*/
  function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let slow: ListNode = dummy;
  let fast: ListNode = dummy;

// Advance fast n+1 steps so the gap between slow and fast is n+1
for (let i = 0; i <= n; i++) fast = fast.next!;

// Move both pointers until fast reaches the end (null)
while (fast) {
slow = slow.next!;
fast = fast.next!;
}

// slow is now at the node just before the target
slow.next = slow.next!.next;
return dummy.next;
}

// === Test Cases ===
// Build helper: arrayToList([1,2,3,4,5]) → ListNode
// removeNthFromEnd(list([1,2,3,4,5]), 2) → [1,2,3,5]
// removeNthFromEnd(list([1]), 1) → []
// removeNthFromEnd(list([1,2]), 1) → [1]
// removeNthFromEnd(list([1,2,3,4,5]), 5) → [2,3,4,5] (remove head)

{% endraw %}

---

## 🔗 Related Problems

- [Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/) — same fast/slow pointer gap technique
- [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) — two pointer variant for cycle detection
- [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/) — foundational linked list manipulation
- [Delete Node in a Linked List](https://leetcode.com/problems/delete-node-in-a-linked-list/) — simpler node deletion variant
