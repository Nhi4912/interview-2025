---
layout: page
title: "Merge Two Sorted Lists"
difficulty: Easy
category: Linked List
tags: [Linked List, Two Pointers, Merge]
leetcode_url: "https://leetcode.com/problems/merge-two-sorted-lists/"
---

# Merge Two Sorted Lists / Gộp Hai Danh Sách Đã Sắp Xếp

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Linked List (Merge)
> **Frequency**: 🔥 Tier 1 — bài nền tảng của Merge Sort và Merge K Sorted Lists
> **See also**: [Reverse Linked List](./01-reverse-linked-list.md) | [Merge K Sorted Lists](./12-merge-k-sorted-lists.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy nghĩ đến hai hàng người xếp hàng vào rạp chiếu phim, mỗi hàng đã được sắp theo thứ tự chiều cao. Bảo vệ đứng ở đầu chọn người thấp hơn ở đầu mỗi hàng cho vào trước. Khi một hàng hết người, cả phần còn lại của hàng kia vào thẳng — không cần kiểm tra thêm.

**Pattern Recognition:**

- Signal: "merge two sorted / gộp hai danh sách đã sắp" → **Dummy Node + Two Pointer Walk**
- Dummy node loại bỏ xử lý đặc biệt cho node đầu tiên của kết quả
- Khi một list hết, nối thẳng list còn lại — không cần duyệt từng node

**Visual — Merge [1→2→4] and [1→3→4]:**

```
dummy→?   p1=1→2→4   p2=1→3→4

Step 1: p1.val(1) <= p2.val(1) → tail→1(p1), p1=2→4
        dummy→1        p1=2→4   p2=1→3→4

Step 2: p1.val(2) >  p2.val(1) → tail→1(p2), p2=3→4
        dummy→1→1      p1=2→4   p2=3→4

Step 3: p1.val(2) <= p2.val(3) → tail→2(p1), p1=4
        dummy→1→1→2    p1=4     p2=3→4

Step 4: p1.val(4) >  p2.val(3) → tail→3(p2), p2=4
        dummy→1→1→2→3  p1=4     p2=4

Step 5: p1.val(4) <= p2.val(4) → tail→4(p1), p1=null → attach p2=4
        dummy→1→1→2→3→4→4

Return: dummy.next = 1→1→2→3→4→4
```

---

## Problem Description

Given heads of two sorted linked lists, merge them into one sorted list by splicing together nodes from both lists. Return the head of the merged list.

```
Example 1: list1=[1,2,4], list2=[1,3,4] → [1,1,2,3,4,4]
Example 2: list1=[],      list2=[]      → []
Example 3: list1=[],      list2=[0]     → [0]
```

Constraints:

- Number of nodes in each list: `[0, 50]`
- `-100 <= Node.val <= 100`
- Both lists are sorted in non-decreasing order

---

## 📝 Interview Tips

1. **Clarify**: Can values be equal? Can lists have different lengths? / Giá trị có thể trùng không? Độ dài có khác nhau không?
2. **Brute force**: Collect all values, sort, rebuild — O((n+m) log(n+m)) / Gộp hai mảng rồi sắp xếp
3. **Optimize**: Walk both lists with dummy node — O(n+m) time, O(1) space / Dùng dummy node, không tốn bộ nhớ thêm
4. **Edge cases**: One or both lists empty / Một hoặc cả hai danh sách rỗng
5. **Follow-up**: Merge K sorted lists using this as a subroutine (LC 23) / Gộp K danh sách dùng heap hoặc divide & conquer

---

## Solutions

```typescript

interface ListNode {
val: number;
next: ListNode | null;
}

/**

- Solution 1: Recursive (Brute Force style)
- Time: O(n + m) — visit each node once
- Space: O(n + m) — recursion call stack depth equals total nodes
  */
  function mergeTwoListsRecursive(
  list1: ListNode | null,
  list2: ListNode | null
  ): ListNode | null {
  if (!list1) return list2;
  if (!list2) return list1;

if (list1.val <= list2.val) {
list1.next = mergeTwoListsRecursive(list1.next, list2);
return list1;
} else {
list2.next = mergeTwoListsRecursive(list1, list2.next);
return list2;
}
}

/**

- Solution 2: Iterative with Dummy Node (Optimal)
- Time: O(n + m) — single pass through both lists
- Space: O(1) — only dummy node + one tail pointer
  */
  function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null
  ): ListNode | null {
  const dummy: ListNode = { val: 0, next: null };
  let tail = dummy;

while (list1 && list2) {
if (list1.val <= list2.val) {
tail.next = list1;
list1 = list1.next;
} else {
tail.next = list2;
list2 = list2.next;
}
tail = tail.next;
}

tail.next = list1 ?? list2; // attach whichever list still has nodes
return dummy.next;
}

// === Test Cases ===
const l1: ListNode = { val: 1, next: { val: 2, next: { val: 4, next: null } } };
const l2: ListNode = { val: 1, next: { val: 3, next: { val: 4, next: null } } };
console.log(mergeTwoLists(l1, l2)); // 1→1→2→3→4→4
console.log(mergeTwoLists(null, null)); // null

```

---

## 🔗 Related Problems

- [Reverse Linked List](./01-reverse-linked-list.md) — cùng thao tác con trỏ linked list cơ bản
- [Merge K Sorted Lists](./12-merge-k-sorted-lists.md) — mở rộng bài này dùng heap hoặc divide & conquer
