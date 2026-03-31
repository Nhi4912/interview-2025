---
layout: page
title: "Remove Duplicates from Sorted List"
difficulty: Easy
category: Linked-List
tags: [Linked List]
leetcode_url: "https://leetcode.com/problems/remove-duplicates-from-sorted-list"
---

# Remove Duplicates from Sorted List / Xóa Phần Tử Trùng Trong Danh Sách Đã Sắp Xếp

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Linked List Traversal
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Remove Duplicates from Sorted List II](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii) | [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Đoàn tàu đã xếp theo thứ tự — nếu hai toa liên tiếp có cùng số hiệu, bỏ qua toa sau bằng cách nhảy qua nó. Chỉ cần sửa "khớp nối" chứ không cần di chuyển toa.

**Pattern Recognition:**

- Signal: "sorted linked list" + "remove duplicates" → **Traverse + skip same-value nodes**
- Sorted đảm bảo các phần tử giống nhau luôn liền kề — chỉ cần so với node kế tiếp
- Không cần dummy head vì head không bao giờ bị xóa (chỉ xóa các bản sao)

**Visual — `1 → 1 → 2 → 3 → 3 → null`:**

```
cur=1 → cur.next=1 same → skip: cur.next = cur.next.next
      → now: 1 → 2 → 3 → 3 → null
cur=1 → cur.next=2 diff → advance cur
cur=2 → cur.next=3 diff → advance cur
cur=3 → cur.next=3 same → skip: cur.next = cur.next.next
      → now: 1 → 2 → 3 → null
cur=3 → cur.next=null → done ✅
```

---

## Problem Description

Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well. ([LeetCode 83](https://leetcode.com/problems/remove-duplicates-from-sorted-list))

**Example 1:** `1 → 1 → 2` → `1 → 2`
**Example 2:** `1 → 1 → 2 → 3 → 3` → `1 → 2 → 3`

**Constraints:** `0 ≤ nodes ≤ 300`, `-100 ≤ Node.val ≤ 100`, list is sorted ascending

---

## 📝 Interview Tips

1. **Clarify**: "Giữ lại một bản, xóa tất cả bản sao? Hay xóa cả node gốc?" / Keep one copy or delete all occurrences? (This problem keeps one)
2. **Key insight**: "Vì list đã sorted, duplicate luôn liền kề — so `cur.val == cur.next.val`" / Sorted means duplicates are always adjacent
3. **No dummy needed**: "Head không bao giờ bị xóa (chỉ xóa bản sao) → không cần dummy node" / Head is never removed, no dummy required
4. **Recursive**: "Cũng giải được bằng đệ quy — base case: null hoặc single node" / Recursion works cleanly for this problem
5. **Edge cases**: "Danh sách rỗng, một node, tất cả giống nhau (`1→1→1`)" / Empty list, single node, all same value
6. **Follow-up**: "Remove ALL nodes with duplicates (LC 82) → cần dummy head và prev pointer" / Variant: remove all occurrences needs dummy + prev

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

// Helper: list to array
function toArray(head: ListNode | null): number[] {
  const res: number[] = [];
  while (head) {
    res.push(head.val);
    head = head.next;
  }
  return res;
}

/**
 * Solution 1: Iterative — skip duplicate next nodes
 * Traverse with cur pointer. When cur.val === cur.next.val, skip next.
 * Otherwise advance cur. Simple single-pass O(n).
 * Time: O(n) — single pass through list
 * Space: O(1) — only cur pointer, in-place modification
 */
function deleteDuplicates(head: ListNode | null): ListNode | null {
  let cur = head;
  while (cur !== null && cur.next !== null) {
    if (cur.val === cur.next.val) {
      cur.next = cur.next.next; // skip the duplicate
    } else {
      cur = cur.next; // advance only when no duplicate found
    }
  }
  return head;
}

/**
 * Solution 2: Recursive
 * Base case: null or single node → already duplicate-free.
 * Recurse on tail, then fix current node if it matches processed head.
 * Time: O(n) — one recursive call per node
 * Space: O(n) — call stack depth equals list length
 */
function deleteDuplicatesRecursive(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  head.next = deleteDuplicatesRecursive(head.next);
  // If current value equals processed next, skip current
  return head.val === head.next?.val ? head.next : head;
}

// === Test Cases ===
console.log(toArray(deleteDuplicates(buildList([1, 1, 2])))); // [1, 2]
console.log(toArray(deleteDuplicates(buildList([1, 1, 2, 3, 3])))); // [1, 2, 3]
console.log(toArray(deleteDuplicates(buildList([1])))); // [1]
console.log(toArray(deleteDuplicates(buildList([1, 1, 1])))); // [1]
console.log(toArray(deleteDuplicates(null))); // []
console.log(toArray(deleteDuplicatesRecursive(buildList([1, 1, 2, 3, 3])))); // [1, 2, 3]
```

---

## 🔗 Related Problems

| Problem                                                                                                      | Pattern                | Difficulty |
| ------------------------------------------------------------------------------------------------------------ | ---------------------- | ---------- |
| [Remove Duplicates from Sorted List II](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii) | Delete all occurrences | 🟡 Medium  |
| [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array)     | Same idea, array       | 🟢 Easy    |
| [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists)                               | Linked list pointer    | 🟢 Easy    |
| [Delete Node in a Linked List](https://leetcode.com/problems/delete-node-in-a-linked-list)                   | Node deletion          | 🟡 Medium  |
