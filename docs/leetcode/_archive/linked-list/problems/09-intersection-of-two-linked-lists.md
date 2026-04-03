---
layout: page
title: "Intersection of Two Linked Lists"
difficulty: Easy
category: Linked List
tags: [Linked List, Two Pointers, Hash Table]
leetcode_url: "https://leetcode.com/problems/intersection-of-two-linked-lists/"
---

# Intersection of Two Linked Lists / Điểm Giao Nhau Của Hai Danh Sách Liên Kết

> **Track**: Blind 75 | **Difficulty**: 🟢 Easy
> **Pattern**: Two Pointers — Path Equalization | **Frequency**: 📗 Tier 1
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

## 🧠 Intuition / Tư Duy

**Analogy (Tiếng Việt):** Hai người xuất phát từ hai địa điểm khác nhau nhưng đều đi đến cùng một đích. Nếu sau khi về đích, mỗi người tiếp tục đi theo con đường của người kia ngay từ đầu — cả hai sẽ đến điểm giao nhau cùng lúc, vì tổng quãng đường đi là bằng nhau (a + c + b = b + c + a).

**Pattern Recognition:**

- pA đi: listA (len=a) + listB (len=b) = a+b bước
- pB đi: listB (len=b) + listA (len=a) = b+a bước
- Khi gặp nhau: cả hai đã đi đúng a+b bước — nếu có giao điểm thì gặp nhau tại đó; nếu không thì cùng là null

**ASCII Visual:**

```
A: a1 → a2 ────────────┐
                        c1 → c2 → c3 → null
B: b1 → b2 → b3 ───────┘

pA path: a1→a2→c1→c2→c3→null→b1→b2→b3→[c1] ← MEET
pB path: b1→b2→b3→c1→c2→c3→null→a1→a2→[c1] ← MEET
Total: (2+3)=5 steps before c1 for both ✓
```

## Problem Description

Given heads of two singly linked lists `headA` and `headB`, return the node where they intersect (same node object, not just same value). Return `null` if no intersection.

**Example:**

```
listA:    4 → 1 ─────────────┐
                         8 → 4 → 5 → null
listB: 5 → 6 → 1 ────────────┘

Output: node with val=8
```

**No intersection:**

```
listA: 2 → 6 → 4 → null
listB: 1 → 5 → null
Output: null
```

**Constraints:** Lists have no cycles. Must preserve original structure.

## 📝 Interview Tips

- 🇻🇳 **Trick quan trọng:** "Intersection" nghĩa là **cùng node object** (cùng địa chỉ bộ nhớ), không phải cùng value
- 🇬🇧 **Key insight:** Intersection means same **node reference**, not same value — check with `===` not `==`
- 🇻🇳 **Khi pA/pB đến null:** chuyển sang head của list kia — KHÔNG phải sang `.next` của null
- 🇬🇧 **Pointer switch:** when pointer hits null, reassign to other list's head (not null.next)
- 🇻🇳 **Nếu không có intersection:** cả hai sẽ về null cùng lúc, vòng lặp kết thúc, return null
- 🇬🇧 **HashSet approach** is O(m+n) space but trivial to code — start there then optimize to O(1)

## Solutions

```typescript

```typescript
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * Solution 1: Two Pointers — Path Equalization (Optimal)
 * Each pointer walks both lists; total path length equalizes.
 * Time: O(m + n) | Space: O(1)
 */
function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  let pA = headA;
  let pB = headB;

  // When pA reaches null → redirect to headB; same for pB
  // They will meet at intersection after m+n steps, or both null (no intersection)
  while (pA !== pB) {
    pA = pA ? pA.next : headB;
    pB = pB ? pB.next : headA;
  }
  return pA; // null if no intersection
}

/**
 * Solution 2: Hash Set (Easier to explain, O(n) space)
 * Store all nodes of listA, then scan listB for first match.
 * Time: O(m + n) | Space: O(m)
 */
function getIntersectionNodeSet(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  const seen = new Set<ListNode>();
  let cur = headA;
  while (cur) {
    seen.add(cur);
    cur = cur.next;
  }

  cur = headB;
  while (cur) {
    if (seen.has(cur)) return cur;
    cur = cur.next;
  }
  return null;
}

// Inline tests — build intersecting lists
const shared1 = new ListNode(8, new ListNode(4, new ListNode(5)));
const listA = new ListNode(4, new ListNode(1, shared1));
const listB = new ListNode(5, new ListNode(6, new ListNode(1, shared1)));

console.assert(getIntersectionNode(listA, listB) === shared1, "intersection at 8");
console.assert(getIntersectionNodeSet(listA, listB) === shared1, "set: intersection at 8");

// No intersection
const la = new ListNode(2, new ListNode(6, new ListNode(4)));
const lb = new ListNode(1, new ListNode(5));
console.assert(getIntersectionNode(la, lb) === null, "no intersection");
console.assert(getIntersectionNodeSet(la, lb) === null, "set: no intersection");
```

```

## 🔗 Related Problems

- [141. Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) — detect cycle, related two-pointer technique
- [142. Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/) — find cycle entry point
- [160. Intersection of Two Linked Lists](https://leetcode.com/problems/intersection-of-two-linked-lists/) — this problem
- [1. Two Sum](https://leetcode.com/problems/two-sum/) — HashSet lookup pattern in different domain
- [599. Minimum Index Sum of Two Lists](https://leetcode.com/problems/minimum-index-sum-of-two-lists/) — intersection concept with arrays
