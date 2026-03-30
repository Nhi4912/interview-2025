---
layout: page
title: "Linked List Cycle"
difficulty: Easy
category: Linked List
tags: [Linked List, Two Pointers, Hash Table, Fast/Slow Pointer]
leetcode_url: "https://leetcode.com/problems/linked-list-cycle/"
---

# Linked List Cycle / Phát Hiện Vòng Lặp Trong Danh Sách Liên Kết

> **Track**: Blind 75 | **Difficulty**: 🟢 Easy
> **Pattern**: Floyd's Cycle Detection (Fast/Slow Pointer) | **Frequency**: 📗 Tier 1
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

## 🧠 Intuition / Tư Duy

**Analogy (Tiếng Việt):** Hãy tưởng tượng hai người chạy trên một đường đua hình tròn — một người chạy nhanh gấp đôi người kia. Nếu đường đua có vòng lặp, người nhanh sẽ chắc chắn đuổi kịp người chậm và gặp nhau. Nếu không có vòng lặp, người nhanh sẽ về đích trước.

**Pattern Recognition:**

- Fast pointer di chuyển 2 bước, slow pointer 1 bước
- Nếu có cycle: fast sẽ "wrap around" và gặp slow trong vòng lặp
- Nếu không có cycle: fast đạt null trước
- Không cần bộ nhớ phụ — đây là lý do Floyd's algorithm ưu việt hơn HashSet

**ASCII Visual:**

```
No cycle:  1 → 2 → 3 → null   fast reaches null → false

Cycle:     3 → 2 → 0 → -4
                ↑_______↑   (tail points back to index 1)

  Step 1:  slow=3, fast=3
  Step 2:  slow=2, fast=0
  Step 3:  slow=0, fast=2   (fast wrapped)
  Step 4:  slow=-4, fast=-4  MEET → true
```

## Problem Description

Given `head` of a linked list, determine if it has a cycle. Return `true` if any node can be reached again by following `next` pointers.

**Example 1:**

```
Input:  3 → 2 → 0 → -4 → (back to node 2)
Output: true
```

**Example 2:**

```
Input:  1 → 2 → (back to node 1)
Output: true
```

**Example 3:**

```
Input:  1 → null
Output: false
```

## 📝 Interview Tips

- 🇻🇳 **Floyd's là câu trả lời mong đợi** — HashSet đúng nhưng O(n) space; fast/slow là O(1) space và được hỏi thêm
- 🇬🇧 **Expect follow-up:** "Can you do it in O(1) space?" — pivot immediately to Floyd's
- 🇻🇳 **Tại sao fast nhảy 2 bước mà chắc chắn gặp slow?** — Khoảng cách giữa hai pointer giảm 1 mỗi bước khi trong vòng lặp
- 🇬🇧 **Why does fast always catch slow?** — Each iteration the gap shrinks by 1; within ≤ cycle_length steps they meet
- 🇻🇳 **Điều kiện dừng:** `while (fast && fast.next)` — kiểm tra `fast.next` trước khi nhảy 2 bước để tránh null dereference
- 🇬🇧 **Bonus:** Floyd's can also find cycle start (LeetCode #142) — mention for brownie points

## Solutions

{% raw %}

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
 * Solution 1: Floyd's Cycle Detection — Fast/Slow Pointer (Optimal)
 * Time: O(n) | Space: O(1)
 *
 * If cycle exists: fast laps slow, they meet.
 * If no cycle: fast reaches null.
 */
function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

/**
 * Solution 2: Hash Set (Simpler to reason about, O(n) space)
 * Store each visited node; if we see one twice, there's a cycle.
 * Time: O(n) | Space: O(n)
 */
function hasCycleSet(head: ListNode | null): boolean {
  const visited = new Set<ListNode>();
  let cur = head;
  while (cur) {
    if (visited.has(cur)) return true;
    visited.add(cur);
    cur = cur.next;
  }
  return false;
}

// Inline tests
// Build:  1 → 2 → 3 → null  (no cycle)
const a = new ListNode(1, new ListNode(2, new ListNode(3)));
console.assert(hasCycle(a) === false, "no cycle");
console.assert(hasCycleSet(a) === false, "no cycle set");

// Build:  1 → 2 → 3 → (back to 2)  (cycle)
const n1 = new ListNode(1);
const n2 = new ListNode(2);
const n3 = new ListNode(3);
n1.next = n2;
n2.next = n3;
n3.next = n2; // cycle!
console.assert(hasCycle(n1) === true, "has cycle");
console.assert(hasCycleSet(n1) === true, "has cycle set");

console.assert(hasCycle(null) === false, "null");
```

{% endraw %}

## 🔗 Related Problems

- [142. Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/) — find where cycle starts (same Floyd's, extra reset step)
- [287. Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/) — Floyd's applied to array indices
- [876. Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/) — fast/slow pointer without cycle
- [202. Happy Number](https://leetcode.com/problems/happy-number/) — cycle detection on a number sequence
