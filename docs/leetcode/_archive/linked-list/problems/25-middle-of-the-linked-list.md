---
layout: page
title: "Middle of the Linked List"
difficulty: Easy
category: Linked-List
tags: [Linked List, Two Pointers]
leetcode_url: "https://leetcode.com/problems/middle-of-the-linked-list"
---

# Middle of the Linked List / Tìm Node Giữa Danh Sách Liên Kết

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers (Slow/Fast)
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Rotate List](https://leetcode.com/problems/rotate-list) | [Remove Duplicates from Sorted List II](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như hai người chạy trên cùng một đoạn đường — người nhanh chạy 2 bước, người chậm chạy 1 bước. Khi người nhanh chạm đích (hết list), người chậm đang đứng ở giữa.

**Pattern Recognition:**

- Signal: "find middle" + "linked list" + "one pass" → **Slow/Fast Pointer**
- Fast đi 2 bước, Slow đi 1 bước mỗi iteration
- Key insight: khi `fast` reaches end, `slow` is at exact middle; for even length → second middle

**Visual — Slow/Fast Pointer:**

```
Odd  [1→2→3→4→5]:  s=1,f=1 → s=2,f=3 → s=3,f=5 → f.next=null → return slow=3 ✅
Even [1→2→3→4]:    s=1,f=1 → s=2,f=3 → s=3,f=null → return slow=3 ✅
Even [1→2→3→4→5→6]:s=1,f=1 → s=2,f=3 → s=3,f=5 → s=4,f=null → return slow=4 ✅
```

---

## Problem Description

Given the head of a singly linked list, return the middle node. If two middle nodes exist, return the **second** middle node. ([LeetCode #876](https://leetcode.com/problems/middle-of-the-linked-list))

Difficulty: Easy | Acceptance: 80.6%

- **Example 1**: `[1,2,3,4,5]` → node `3` (prints `[3,4,5]`)
- **Example 2**: `[1,2,3,4,5,6]` → node `4` (prints `[4,5,6]`)

Constraints:

- Number of nodes: `[1, 100]`
- `1 ≤ Node.val ≤ 100`

---

## 📝 Interview Tips

1. **Clarify**: "Nếu số node chẵn, middle là node thứ mấy?" / For even length, first or second middle?
2. **Brute force**: "Đếm độ dài n, duyệt lại n/2 lần — O(n) hai pass" / Count length then traverse n/2 — two passes
3. **Optimize**: "Slow/fast pointer — O(n) một pass, O(1) space" / Single pass with two-pointer trick
4. **Even case**: "Khởi tạo cả slow và fast = head → slow dừng ở second middle" / Both start at head for second-middle behavior
5. **Edge cases**: "1 node → return head; 2 nodes → return second" / Both handled naturally by the algorithm

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
 * Solution 1: Count Length (Two Pass)
 * Time: O(n) — two traversals
 * Space: O(1) — only pointer variables
 */
function middleNodeCount(head: ListNode | null): ListNode | null {
  let len = 0;
  for (let c = head; c; c = c.next) len++;
  let mid = Math.floor(len / 2);
  let cur = head;
  while (mid-- > 0) cur = cur!.next;
  return cur;
}

/**
 * Solution 2: Slow/Fast Pointer (One Pass) — Optimal
 * Time: O(n) — single traversal; fast moves 2x → n/2 iterations
 * Space: O(1) — two pointer variables
 */
function middleNode(head: ListNode | null): ListNode | null {
  let slow = head,
    fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}

// === Test Cases ===
console.log(toArr(middleNode(fromArr([1, 2, 3, 4, 5])))); // [3,4,5]
console.log(toArr(middleNode(fromArr([1, 2, 3, 4, 5, 6])))); // [4,5,6]
console.log(toArr(middleNode(fromArr([1])))); // [1]
console.log(toArr(middleNode(fromArr([1, 2])))); // [2]
console.log(toArr(middleNodeCount(fromArr([1, 2, 3, 4, 5, 6])))); // [4,5,6]
```

---

## 🔗 Related Problems

- [Rotate List](https://leetcode.com/problems/rotate-list) — slow/fast variant for k-th from end
- [Remove Duplicates from Sorted List II](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii) — two-pointer list traversal
- [Sort List](https://leetcode.com/problems/sort-list) — uses middle-finding as split step in merge sort
- [Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list) — find middle then reverse second half
- [Reorder List](https://leetcode.com/problems/reorder-list) — uses middle as split point for the merge
