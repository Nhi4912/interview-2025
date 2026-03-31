---
layout: page
title: "Partition List"
difficulty: Medium
category: Linked-List
tags: [Linked List, Two Pointers]
leetcode_url: "https://leetcode.com/problems/partition-list"
---

# Partition List / Phân Hoạch Danh Sách Liên Kết

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Dummy Heads
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Rotate List](https://leetcode.com/problems/rotate-list) | [Remove Duplicates from Sorted List II](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chia học sinh thành hai hàng — hàng "nhỏ hơn x" và hàng "lớn hơn hoặc bằng x". Duyệt danh sách một lần, mỗi node tự xếp vào đúng hàng. Cuối cùng nối hai hàng lại.

**Pattern Recognition:**

- Signal: "partition linked list" + "preserve relative order" → **Two Dummy Heads**
- Key insight: tạo hai danh sách con (less và greater/equal); nối chúng ở cuối
- Tuyệt đối không dùng sort — cần giữ thứ tự tương đối gốc

**Visual — partition([1,4,3,2,5,2], x=3):**

```
Input:  1 → 4 → 3 → 2 → 5 → 2

dL (dummy Less):    dL → 1 → 2 → 2 → null
dG (dummy GreaterEq):  dG → 4 → 3 → 5 → null

Join: less.next = greaterEq.next  (skip dG)
      greaterEq.tail.next = null  (terminate)

Result: 1 → 2 → 2 → 4 → 3 → 5
```

---

## Problem Description

Given the head of a linked list and value `x`, partition so all nodes with `val < x` come before nodes with `val ≥ x`. ([LeetCode #86](https://leetcode.com/problems/partition-list))

Difficulty: Medium | Acceptance: 59.0%

**Preserve the original relative order** within each partition.

**Example 1:** `[1,4,3,2,5,2]`, x=3 → `[1,2,2,4,3,5]`

**Example 2:** `[2,1]`, x=2 → `[1,2]`

Constraints: `0 ≤ list length ≤ 200`, `-100 ≤ Node.val ≤ 200`, `-200 ≤ x ≤ 200`

---

## 📝 Interview Tips

1. **Clarify**: "Stable partition — giữ thứ tự tương đối trong mỗi nhóm?" / Yes, relative order preserved within each group
2. **Two lists**: "Tạo hai danh sách riêng (< x) và (≥ x), nối sau — đơn giản và O(n)" / Two-list approach is cleanest
3. **Dummy heads**: "Mỗi danh sách con dùng dummy head — tránh xử lý head null" / Dummy heads for both less and greater lists
4. **Terminate**: "QUAN TRỌNG: set `geTail.next = null` tránh cycle sau khi nối" / Must null-terminate the second list
5. **Edge cases**: "List rỗng, tất cả < x, tất cả ≥ x — two-dummy approach xử lý tự nhiên" / All cases handled naturally
6. **Follow-up**: "Array partition (Dutch flag problem)? → 3-way partition với 3 pointers" / Array version is classic 3-way partition

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

function buildList(arr: number[]): ListNode | null {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

function printList(head: ListNode | null): string {
  const res: number[] = [];
  while (head) {
    res.push(head.val);
    head = head.next;
  }
  return res.join("→") || "null";
}

/**
 * Solution 1: Two dummy-headed lists (Optimal)
 * Time: O(n) — single pass through list
 * Space: O(1) — rearranges existing nodes, no allocation
 */
function partition(head: ListNode | null, x: number): ListNode | null {
  // Two dummy heads for "less than x" and "greater-or-equal to x" lists
  const lessHead = new ListNode(0);
  const geHead = new ListNode(0);
  let less = lessHead;
  let ge = geHead;

  let cur = head;
  while (cur !== null) {
    if (cur.val < x) {
      less.next = cur;
      less = less.next;
    } else {
      ge.next = cur;
      ge = ge.next;
    }
    cur = cur.next;
  }

  // CRITICAL: terminate the ge list to avoid cycles
  ge.next = null;
  // Join: less tail → ge head (skip dummy)
  less.next = geHead.next;

  return lessHead.next;
}

// === Test Cases ===
console.log(printList(partition(buildList([1, 4, 3, 2, 5, 2]), 3))); // 1→2→2→4→3→5
console.log(printList(partition(buildList([2, 1]), 2))); // 1→2
console.log(printList(partition(buildList([1, 1]), 2))); // 1→1  (all < x)
console.log(printList(partition(buildList([3, 4, 5]), 3))); // 3→4→5  (all ≥ x)
console.log(printList(partition(null, 1))); // null

/**
 * Solution 2: Collect and rebuild (clear, slightly more space)
 * Time: O(n)
 * Space: O(n) — two arrays to collect values
 */
function partition2(head: ListNode | null, x: number): ListNode | null {
  const less: number[] = [],
    ge: number[] = [];
  let cur = head;
  while (cur) {
    (cur.val < x ? less : ge).push(cur.val);
    cur = cur.next;
  }

  const all = [...less, ...ge];
  const dummy = new ListNode(0);
  let node = dummy;
  for (const v of all) {
    node.next = new ListNode(v);
    node = node.next;
  }
  return dummy.next;
}

console.log(printList(partition2(buildList([1, 4, 3, 2, 5, 2]), 3))); // 1→2→2→4→3→5
console.log(printList(partition2(buildList([2, 1]), 2))); // 1→2
```

---

## 🔗 Related Problems

- [Remove Duplicates from Sorted List II](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii) — dummy head + skip technique
- [Sort List](https://leetcode.com/problems/sort-list) — merge-sort on linked list
- [Reorder List](https://leetcode.com/problems/reorder-list) — in-place list restructuring
- [Rotate List](https://leetcode.com/problems/rotate-list) — cycle and cut technique
- [Partition List — LeetCode](https://leetcode.com/problems/partition-list) — problem page
