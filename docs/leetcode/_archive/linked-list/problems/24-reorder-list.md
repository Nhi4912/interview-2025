---
layout: page
title: "Reorder List"
difficulty: Medium
category: Linked-List
tags: [Linked List, Two Pointers, Stack, Recursion]
leetcode_url: "https://leetcode.com/problems/reorder-list"
---

# Reorder List / Sắp Xếp Lại Danh Sách Liên Kết

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Find Middle + Reverse + Merge
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Maximum Twin Sum of a Linked List](https://leetcode.com/problems/maximum-twin-sum-of-a-linked-list) | [Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp hàng zipper — lấy người đầu hàng, rồi người cuối, rồi người thứ hai, rồi áp chót... Để lấy từ cuối O(1) ta đảo ngược nửa sau của list, rồi merge hai nửa xen kẽ.

**Pattern Recognition:**

- Signal: "L0→Ln→L1→Ln-1" → **Find Middle + Reverse Second Half + Interleave**
- 3 bước chuẩn — slow/fast tìm middle, reverse nửa sau, merge xen kẽ
- Key insight: sau khi reverse nửa sau, bài toán trở thành merge hai list tuần tự

**Visual — Reorder List:**

```
Input:  1 → 2 → 3 → 4 → 5

Step 1 (find mid):  [1→2→3]  [4→5]
Step 2 (reverse):   [1→2→3]  [5→4]
Step 3 (merge):      1→5→2→4→3  ✅

Even: 1→2→3→4  →  mid=[1→2] rev=[4→3]  →  1→4→2→3 ✅
```

---

## Problem Description

Given the head of a singly linked list, reorder it as L0→Ln→L1→Ln-1→L2→Ln-2→... in-place. ([LeetCode #143](https://leetcode.com/problems/reorder-list))

Difficulty: Medium | Acceptance: 62.5%

- **Example 1**: `[1,2,3,4]` → `[1,4,2,3]`
- **Example 2**: `[1,2,3,4,5]` → `[1,5,2,4,3]`

Constraints:

- Number of nodes: `[1, 5×10⁴]`
- `1 ≤ Node.val ≤ 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Modify in-place? Không cần return node?" / In-place modification; function returns void
2. **Brute force**: "Gom nodes vào array, dùng L/R pointer để nối — O(n) time O(n) space" / Collect in array, index with L/R pointers
3. **Optimal**: "Find middle + reverse second half + merge — O(n) time O(1) space" / Three passes, all in-place
4. **Split trick**: "slow.next = null sau khi tìm middle để cắt list thành 2" / Must null-terminate first half after split
5. **Edge cases**: "1 node → no-op, 2 nodes → chỉ 1 swap" / Single and two-node lists handle naturally
6. **Merge step**: "Dùng temp pointers fn/sn để lưu next trước khi nối" / Save next pointers before rewiring

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
 * Solution 1: Array of Nodes + Two Pointers
 * Time: O(n) — one collect pass + one merge pass
 * Space: O(n) — stores all node references
 */
function reorderListArray(head: ListNode | null): void {
  if (!head) return;
  const nodes: ListNode[] = [];
  for (let c: ListNode | null = head; c; c = c.next) nodes.push(c);
  let l = 0,
    r = nodes.length - 1;
  while (l < r) {
    nodes[l].next = nodes[r];
    l++;
    if (l === r) break;
    nodes[r].next = nodes[l];
    r--;
  }
  nodes[l].next = null;
}

/**
 * Solution 2: Find Middle + Reverse + Merge (Optimal)
 * Time: O(n) — three O(n) passes
 * Space: O(1) — only pointer variables
 */
function reorderList(head: ListNode | null): void {
  if (!head || !head.next) return;

  // Step 1: Find middle via slow/fast pointer
  let slow: ListNode = head,
    fast: ListNode | null = head;
  while (fast.next && fast.next.next) {
    slow = slow.next!;
    fast = fast.next.next;
  }

  // Step 2: Reverse second half
  let prev: ListNode | null = null;
  let cur: ListNode | null = slow.next;
  slow.next = null; // cut list
  while (cur) {
    const nxt = cur.next;
    cur.next = prev;
    prev = cur;
    cur = nxt;
  }

  // Step 3: Interleave first half and reversed second half
  let first: ListNode | null = head;
  let second: ListNode | null = prev;
  while (second) {
    const fn = first!.next,
      sn = second.next;
    first!.next = second;
    second.next = fn;
    first = fn;
    second = sn;
  }
}

// === Test Cases ===
const l1 = fromArr([1, 2, 3, 4]);
reorderList(l1);
console.log(toArr(l1)); // [1,4,2,3]

const l2 = fromArr([1, 2, 3, 4, 5]);
reorderList(l2);
console.log(toArr(l2)); // [1,5,2,4,3]

const l3 = fromArr([1]);
reorderList(l3);
console.log(toArr(l3)); // [1]

const l4 = fromArr([1, 2]);
reorderList(l4);
console.log(toArr(l4)); // [1,2]
```

---

## 🔗 Related Problems

- [Maximum Twin Sum of a Linked List](https://leetcode.com/problems/maximum-twin-sum-of-a-linked-list) — same middle + reverse pattern
- [Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list) — same three-step approach
- [Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list) — the splitting step
- [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list) — the reversing step
- [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group) — generalized in-place reversal
