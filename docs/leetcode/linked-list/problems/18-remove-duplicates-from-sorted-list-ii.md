---
layout: page
title: "Remove Duplicates from Sorted List II"
difficulty: Medium
category: Linked-List
tags: [Linked List, Two Pointers]
leetcode_url: "https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii"
---

# Remove Duplicates from Sorted List II / Xoá Tất Cả Node Trùng Lặp Trong Danh Sách Đã Sắp Xếp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dummy Head + Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Rotate List](https://leetcode.com/problems/rotate-list) | [Partition List](https://leetcode.com/problems/partition-list)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống người kiểm soát hàng đợi — nếu thấy hai người liên tiếp có cùng tên, loại BỎ HẾT những người tên đó, không giữ lại người nào. Khác với bài I chỉ giữ lại một.

**Pattern Recognition:**

- Signal: "sorted linked list" + "remove ALL duplicates" → **Dummy Head + Skip pointer**
- Key insight: dùng dummy node trước head; con trỏ `prev` trỏ đến node cuối đã xác nhận "sạch"
- Khi phát hiện duplicate (node.val == node.next.val), skip toàn bộ dãy cùng giá trị đó

**Visual — [1→1→2→3→3→null]:**

```
dummy → 1 → 1 → 2 → 3 → 3 → null
prev↑   cur↑

cur.val==cur.next.val → DUPLICATE! val=1
  skip: move cur until cur.val ≠ 1 (cur→2)
  prev.next = cur (dummy→2)
  prev stays, cur = cur.next (cur→3)

cur.val==cur.next.val → DUPLICATE! val=3
  skip: cur→null
  prev.next = null

Result: dummy → 2 → null
```

---

## Problem Description

Given the head of a sorted linked list, delete ALL nodes with duplicate numbers. ([LeetCode #82](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii))

Difficulty: Medium | Acceptance: 49.9%

Only nodes with **unique** values remain. Return the modified list head.

**Example 1:** `1→1→2→3→3` → `2`

**Example 2:** `1→2→3→3→4→4→5` → `1→2→5`

Constraints: `0 ≤ list length ≤ 300`, `-100 ≤ Node.val ≤ 100`, list is sorted

---

## 📝 Interview Tips

1. **Clarify**: "Remove ALL nodes của giá trị đó, hay chỉ bỏ duplicates giữ một?" / Remove ALL occurrences (unlike problem I)
2. **Dummy head**: "Dùng dummy node trước head — tránh edge case khi head bị xoá" / Dummy prevents null-check for new head
3. **prev pointer**: "`prev` = node cuối đã sạch; chỉ advance prev khi node hiện tại không có duplicate" / prev skips over entire duplicate groups
4. **Inner skip**: "Vòng while bên trong: bỏ qua tất cả nodes có cùng val khi phát hiện duplicate" / Inner loop exhausts the duplicate run
5. **Edge cases**: "All same values → `[1,1,1]` → `[]`; No duplicates → list unchanged" / Handle fully-duplicate lists
6. **Follow-up**: "Unsorted list? → Cần HashMap đếm frequency trước, pass thứ hai để xoá" / Sort first or use HashMap

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

/** Helper to build list from array */
function buildList(arr: number[]): ListNode | null {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

/** Helper to print list */
function printList(head: ListNode | null): string {
  const res: number[] = [];
  while (head) {
    res.push(head.val);
    head = head.next;
  }
  return res.join("→") || "null";
}

/**
 * Solution 1: Dummy head + prev pointer (Optimal)
 * Time: O(n) — single pass
 * Space: O(1) — in-place pointer manipulation
 */
function deleteDuplicates(head: ListNode | null): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev: ListNode = dummy;

  let cur = head;
  while (cur !== null) {
    // Check if current node starts a duplicate sequence
    if (cur.next !== null && cur.val === cur.next.val) {
      const dupVal = cur.val;
      // Skip ALL nodes with this value
      while (cur !== null && cur.val === dupVal) {
        cur = cur.next;
      }
      // Connect prev to the first non-duplicate node
      prev.next = cur;
    } else {
      // No duplicate: advance prev
      prev = cur;
      cur = cur.next;
    }
  }

  return dummy.next;
}

// === Test Cases ===
console.log(printList(deleteDuplicates(buildList([1, 1, 2, 3, 3])))); // 2→3
console.log(printList(deleteDuplicates(buildList([1, 2, 3, 3, 4, 4, 5])))); // 1→2→5
console.log(printList(deleteDuplicates(buildList([1, 1, 1])))); // null
console.log(printList(deleteDuplicates(buildList([1, 2, 3])))); // 1→2→3
console.log(printList(deleteDuplicates(null))); // null

/**
 * Solution 2: Recursive approach
 * Time: O(n)
 * Space: O(n) — recursion stack depth n in worst case
 */
function deleteDuplicatesRecursive(head: ListNode | null): ListNode | null {
  if (head === null) return null;

  // If current node is start of duplicates, skip entire group
  if (head.next !== null && head.val === head.next.val) {
    const dupVal = head.val;
    let node: ListNode | null = head;
    while (node !== null && node.val === dupVal) node = node.next;
    return deleteDuplicatesRecursive(node); // continue from first non-dup
  }

  // No duplicate at head: keep it and recurse on tail
  head.next = deleteDuplicatesRecursive(head.next);
  return head;
}

console.log(printList(deleteDuplicatesRecursive(buildList([1, 1, 2, 3, 3])))); // 2→3
console.log(printList(deleteDuplicatesRecursive(buildList([1, 2, 3, 3, 4, 4, 5])))); // 1→2→5
```

---

## 🔗 Related Problems

- [Remove Duplicates from Sorted List](https://leetcode.com/problems/remove-duplicates-from-sorted-list) — easier: keep one copy
- [Partition List](https://leetcode.com/problems/partition-list) — similar dummy-head two-pointer technique
- [Sort List](https://leetcode.com/problems/sort-list) — linked list manipulation
- [Reorder List](https://leetcode.com/problems/reorder-list) — multi-pointer linked list
- [Remove Duplicates from Sorted List II — LeetCode](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii) — problem page
