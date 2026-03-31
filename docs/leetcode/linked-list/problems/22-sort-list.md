---
layout: page
title: "Sort List"
difficulty: Medium
category: Linked-List
tags: [Linked List, Two Pointers, Divide and Conquer, Sorting, Merge Sort]
leetcode_url: "https://leetcode.com/problems/sort-list"
---

# Sort List / Sắp Xếp Danh Sách Liên Kết

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Divide & Conquer / Merge Sort
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Sort an Array](https://leetcode.com/problems/sort-an-array) | [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chia đôi xấp bài, sắp xếp từng nửa rồi gộp lại. Với linked list, ta tìm điểm giữa bằng slow/fast pointer, chia đôi, đệ quy, rồi merge hai nửa đã sorted.

**Pattern Recognition:**

- Signal: "sort linked list" + "O(n log n)" + "O(1) space" → **Bottom-Up Merge Sort**
- Top-Down merge sort dùng O(log n) recursion stack; Bottom-Up dùng O(1) thực sự
- Key insight: slow/fast pointer tìm middle → cut → merge hai sorted list là O(n)

**Visual — Merge Sort on Linked List:**

```
Input: 4 → 2 → 1 → 3

Split:   [4 → 2]    [1 → 3]
Split:   [4] [2]    [1] [3]
Merge:   [2 → 4]    [1 → 3]
Merge:   1 → 2 → 3 → 4  ✅

Bottom-Up: chunk size 1,2,4... iteratively merge runs
```

---

## Problem Description

Sort a linked list in O(n log n) time and O(1) memory (space). ([LeetCode #148](https://leetcode.com/problems/sort-list))

Difficulty: Medium | Acceptance: 61.8%

- **Example 1**: `[4,2,1,3]` → `[1,2,3,4]`
- **Example 2**: `[-1,5,3,4,0]` → `[-1,0,3,4,5]`
- **Example 3**: `[]` → `[]`

Constraints:

- Number of nodes: `[0, 5×10⁴]`
- `-10⁵ ≤ Node.val ≤ 10⁵`

---

## 📝 Interview Tips

1. **Clarify**: "Yêu cầu O(1) space hay O(log n) stack được chấp nhận không?" / Is O(log n) recursion stack acceptable?
2. **Brute force**: "Gom values vào array, sort, ghi lại — O(n log n), O(n)" / Collect values, sort, write back — simple but O(n) space
3. **Top-Down**: "Slow/fast để tìm middle, đệ quy hai nửa, merge — O(log n) stack" / Classic recursive merge sort, O(log n) stack space
4. **Bottom-Up**: "Lặp với chunk size 1,2,4... merge từng cặp — O(1) space thực sự" / Iterative, true O(1) space
5. **Merge step**: "Dùng dummy head khi merge hai list — tránh edge cases" / Dummy head simplifies merge
6. **Edge cases**: "List rỗng hoặc 1 node → return ngay" / Empty or single node — return immediately

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
function fromArr(a: number[]): ListNode | null {
  const d = new ListNode(0);
  let c = d;
  for (const v of a) {
    c.next = new ListNode(v);
    c = c.next;
  }
  return d.next;
}
function toArr(h: ListNode | null): number[] {
  const r: number[] = [];
  while (h) {
    r.push(h.val);
    h = h.next;
  }
  return r;
}

/**
 * Solution 1: Collect & Sort (Array)
 * Time: O(n log n) — JS built-in sort
 * Space: O(n) — values array
 */
function sortListArray(head: ListNode | null): ListNode | null {
  if (!head) return null;
  const vals: number[] = [];
  for (let c: ListNode | null = head; c; c = c.next) vals.push(c.val);
  vals.sort((a, b) => a - b);
  let c: ListNode | null = head,
    i = 0;
  while (c) {
    c.val = vals[i++];
    c = c.next;
  }
  return head;
}

/**
 * Solution 2: Top-Down Merge Sort (Recursive)
 * Time: O(n log n) — log n levels, O(n) work per level
 * Space: O(log n) — recursion stack depth
 */
function sortList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  // Find middle and split
  let slow: ListNode = head,
    fast: ListNode | null = head.next;
  while (fast && fast.next) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  const mid = slow.next;
  slow.next = null;
  return merge(sortList(head), sortList(mid));
}

function merge(a: ListNode | null, b: ListNode | null): ListNode | null {
  const d = new ListNode(0);
  let c = d;
  while (a && b) {
    if (a.val <= b.val) {
      c.next = a;
      a = a.next;
    } else {
      c.next = b;
      b = b.next;
    }
    c = c.next;
  }
  c.next = a ?? b;
  return d.next;
}

/**
 * Solution 3: Bottom-Up Merge Sort (Iterative)
 * Time: O(n log n) — log n passes, each O(n)
 * Space: O(1) — no recursion, only pointers
 */
function sortListBottomUp(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  let len = 0;
  for (let c: ListNode | null = head; c; c = c.next) len++;
  const dummy = new ListNode(0, head);
  for (let sz = 1; sz < len; sz *= 2) {
    let prev = dummy,
      cur: ListNode | null = dummy.next;
    while (cur) {
      const left = cur;
      const right = splitOff(left, sz);
      cur = splitOff(right, sz);
      const tail = mergeInto(prev, left, right);
      tail.next = cur;
      prev = tail;
    }
  }
  return dummy.next;
}

function splitOff(node: ListNode | null, n: number): ListNode | null {
  for (let i = 1; i < n && node?.next; i++) node = node.next;
  if (!node) return null;
  const rest = node.next;
  node.next = null;
  return rest;
}

function mergeInto(prev: ListNode, a: ListNode | null, b: ListNode | null): ListNode {
  let c = prev;
  while (a && b) {
    if (a.val <= b.val) {
      c.next = a;
      a = a.next;
    } else {
      c.next = b;
      b = b.next;
    }
    c = c.next!;
  }
  c.next = a ?? b;
  while (c.next) c = c.next;
  return c;
}

// === Test Cases ===
console.log(toArr(sortList(fromArr([4, 2, 1, 3])))); // [1,2,3,4]
console.log(toArr(sortList(fromArr([-1, 5, 3, 4, 0])))); // [-1,0,3,4,5]
console.log(toArr(sortList(null))); // []
console.log(toArr(sortListBottomUp(fromArr([4, 2, 1, 3])))); // [1,2,3,4]
```

---

## 🔗 Related Problems

- [Sort an Array](https://leetcode.com/problems/sort-an-array) — merge sort on arrays, no pointer complexity
- [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists) — the merge subroutine
- [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists) — generalized merge with heap
- [Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list) — slow/fast pointer for midpoint
- [Sort Colors](https://leetcode.com/problems/sort-colors) — in-place sort with 3 categories
