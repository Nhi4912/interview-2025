---
layout: page
title: "Reverse Linked List"
difficulty: Easy
category: Linked List
tags: [Linked List, Iterative]
leetcode_url: "https://leetcode.com/problems/reverse-linked-list/"
leetcode_number: 206
pattern: "In-place Reverse"
frequency_tier: 1
companies: [Google, Amazon, Meta, Microsoft, Apple]
target_time_minutes: 10
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Reverse Linked List / Đảo Ngược Danh Sách Liên Kết

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: In-place Reverse
> **Frequency**: 🔥 Tier 1 — xuất hiện rất thường trong phone screen và onsite
> **Target**: ⏱️ 10 min | **Companies**: Google, Amazon, Meta, Microsoft, Apple
> **See also**: [Merge Two Sorted Lists](./02-merge-two-sorted-lists.md) | [Palindrome Linked List](./03-palindrome-linked-list.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một đoàn tàu — bạn cần đổi hướng từng toa một. Mỗi toa chỉ được móc vào toa phía sau, nên bạn phải lưu tạm toa kế trước khi đổi hướng. Sau khi đổi hết, đầu tàu cũ trở thành đuôi tàu mới.

**Pattern Recognition:**

- Signal: "reverse linked list" → **Iterative Reversal with 3 pointers (prev, curr, next)**
- Không thể đi ngược trên singly linked list → phải giữ `prev`, `curr`, `next`
- Mỗi bước: lưu next → đổi hướng curr.next → tiến prev và curr lên

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
          null←1←2←3←4←5   → Return prev=5
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                       |
| ---------------- | -------------------------------------------------------------- |
| **When you see** | "reverse linked list", "reverse in-place", "flip pointers"     |
| **Think**        | 3-pointer swap — prev/curr/next, redirect one link per step    |
| **Template**     | `next = curr.next; curr.next = prev; prev = curr; curr = next` |
| **Time target**  | ⏱️ 10 min (Easy)                                               |

> 💡 **Memory hook / Móc nhớ:** "Lưu-Đổi-Tiến: lưu next, đổi hướng, tiến lên — 3 bước lặp lại!"

---

## Problem Description

Given the head of a singly linked list, reverse the list and return the reversed list's head.

```
Example 1: [1,2,3,4,5] → [5,4,3,2,1]
Example 2: [1,2]       → [2,1]
Example 3: []          → []
```

Constraints:

- `0 <= number of nodes <= 5000`
- `-5000 <= Node.val <= 5000`

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "Let me make sure I understand. We have a singly linked list.
> We need to reverse all the pointers so the last node becomes the head.
> Clarification: Is it singly linked? Can the list be empty?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "My first thought is to collect all values into an array and rebuild — O(n) time and O(n) space.
> But I can reverse in-place with three pointers: prev, curr, next.
> Each step redirects one link — O(n) time, O(1) space. Should I go ahead?"

### Step 3 — Implement / Viết Code (3-5 min)

> "I'll initialize prev=null and curr=head.
> In each iteration: save next, reverse curr.next to prev, advance both.
> When curr is null, prev is the new head."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Let me trace: [1→2→3]. prev=null, curr=1.
> Step 1: next=2, 1→null, prev=1, curr=2.
> Step 2: next=3, 2→1, prev=2, curr=3.
> Step 3: next=null, 3→2, prev=3, curr=null. Return 3. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — single pass. Space: O(1) — three pointers only.
> Edge cases: empty list → null, single node → itself.
> This is optimal. Follow-up: reverse k nodes at a time (LC 25)."

---

## 📝 Interview Tips

1. **Clarify**: Singly or doubly linked? / Danh sách đơn hay đôi?
2. **Brute force**: Collect values → reverse → rebuild — O(n) space / Lưu vào mảng rồi xây lại
3. **Optimize**: In-place 3 pointers — O(1) space / Dùng 3 con trỏ, không cần bộ nhớ thêm
4. **Edge cases**: Empty list, single node / Danh sách rỗng, 1 phần tử
5. **Follow-up**: Reverse k nodes at a time (LC 25) / Đảo ngược từng nhóm k nút

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                          | Why Wrong / Tại sao sai                              | Fix / Cách sửa                              |
| --- | ------------------------------------------ | ---------------------------------------------------- | ------------------------------------------- |
| 1   | Forget to save `next` before reversing     | `curr.next = prev` overwrites the forward link       | Always save `next = curr.next` first        |
| 2   | Return `curr` instead of `prev`            | When loop ends, curr is null — prev is new head      | Return `prev` after the while loop          |
| 3   | Skip explaining brute force to interviewer | Interviewer wants to see your progression of thought | Mention array approach first, then optimize |

---

## Solutions

```typescript
/**
 * Solution 1: Array Collect & Rebuild (Brute Force)
 * Time: O(n) — two passes: collect then rebuild
 * Space: O(n) — stores all node values
 */
function reverseListBrute(head: ListNode | null): ListNode | null {
  const vals: number[] = [];
  let curr = head;
  while (curr) {
    vals.push(curr.val);
    curr = curr.next;
  }
  if (!vals.length) return null;

  const dummy: ListNode = { val: 0, next: null };
  let node = dummy;
  for (const v of vals.reverse()) {
    node.next = { val: v, next: null };
    node = node.next;
  }
  return dummy.next;
}

/**
 * Solution 2: Iterative 3 Pointers (Optimal)
 * Time: O(n) — single pass, each node visited once
 * Space: O(1) — only three pointer variables
 */
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;

  while (curr) {
    const next = curr.next; // 1. save next
    curr.next = prev; // 2. reverse link
    prev = curr; // 3. advance prev
    curr = next; // 4. advance curr
  }

  return prev;
}

// === Test Cases ===
// reverseList([1,2,3,4,5]) → [5,4,3,2,1]
// reverseList([1,2])       → [2,1]
// reverseList(null)        → null
```

---

## 🔗 Related Problems

- [Merge Two Sorted Lists](./02-merge-two-sorted-lists.md) — cùng thao tác con trỏ trên linked list
- [Palindrome Linked List](./03-palindrome-linked-list.md) — dùng reverse làm bước phụ để so sánh nửa sau
- [Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/) — reverse một đoạn con
- [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/) — reverse từng nhóm k nút

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 10 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
