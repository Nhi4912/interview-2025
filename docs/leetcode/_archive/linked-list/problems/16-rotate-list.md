---
layout: page
title: "Rotate List"
difficulty: Medium
category: Linked-List
tags: [Linked List, Two Pointers]
leetcode_url: "https://leetcode.com/problems/rotate-list"
---

# Rotate List / Xoay Danh Sách Liên Kết

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Linked List / Make Circular
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [Remove Duplicates from Sorted List II](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii) | [Partition List](https://leetcode.com/problems/partition-list)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Xoay một vòng tròn — thay vì di chuyển từng phần tử, bạn nối đuôi vào đầu tạo vòng, rồi cắt ở điểm đúng. Tổng xoay `k` lần trên list độ dài `n` bằng `k % n` lần thực sự.

**Pattern:** 1) Tính length + nối tail vào head (circular). 2) Tìm new tail ở `n - k%n - 1` bước từ đầu. 3) Cắt.

```
1 → 2 → 3 → 4 → 5, k=2

Make circular: 1 → 2 → 3 → 4 → 5 → (back to 1)
n=5, effective k = 2 % 5 = 2
New tail at position: 5 - 2 - 1 = 2 (0-indexed) → node with val=3
New head = node with val=4

Break at 3: 4 → 5 → 1 → 2 → 3 ✅
```

---

Cho danh sách liên kết `head` và số nguyên `k`, **xoay phải** danh sách `k` bước. Xoay phải 1 bước = phần tử cuối chuyển lên đầu.

- `1 → 2 → 3 → 4 → 5, k=2` → `4 → 5 → 1 → 2 → 3`
- `0 → 1 → 2, k=4` → `2 → 0 → 1`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **`k % n`**: nếu k ≥ n, xoay nhiều vòng → chỉ cần xoay `k % n` lần thực sự
- 🇺🇸 **Make circular trick**: join tail to head → find new cut point → break the ring
- 🇻🇳 **Vị trí new tail**: là nút thứ `n - k%n - 1` từ đầu (0-indexed)
- 🇺🇸 **Edge cases**: empty list, single node, or `k % n === 0` → return head unchanged
- 🇻🇳 **Đếm độ dài**: phải duyệt toàn bộ list 1 lần để biết n trước khi tính điểm cắt
- 🇺🇸 **Alternative**: find new tail as (n - k%n - 1) steps from head, new head is tail.next

---

## Solutions

### Solution 1: Make Circular + Break at Point — O(n) time, O(1) space ✅ Optimal

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
 * Connect tail to head (circular), then find new tail and break
 * Time: O(n) | Space: O(1)
 */
function rotateRight(head: ListNode | null, k: number): ListNode | null {
  if (!head || !head.next || k === 0) return head;

  // Step 1: Find tail and count length
  let tail = head;
  let n = 1;
  while (tail.next) {
    tail = tail.next;
    n++;
  }

  // Step 2: Effective rotation (avoid full cycles)
  const steps = k % n;
  if (steps === 0) return head;

  // Step 3: Make circular
  tail.next = head;

  // Step 4: Find new tail = (n - steps - 1) steps from old head
  let newTail = head;
  for (let i = 0; i < n - steps - 1; i++) {
    newTail = newTail.next!;
  }

  // Step 5: Break the circle; new head is newTail.next
  const newHead = newTail.next!;
  newTail.next = null;

  return newHead;
}

// Helpers
const build = (vals: number[]): ListNode | null => {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of vals) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
};
const print = (h: ListNode | null): string => {
  const r: number[] = [];
  while (h) {
    r.push(h.val);
    h = h.next;
  }
  return r.join(" → ") || "[]";
};

console.log(print(rotateRight(build([1, 2, 3, 4, 5]), 2))); // 4 → 5 → 1 → 2 → 3
console.log(print(rotateRight(build([0, 1, 2]), 4))); // 2 → 0 → 1
console.log(print(rotateRight(build([1, 2]), 1))); // 2 → 1
console.log(print(rotateRight(build([1]), 100))); // 1
```

### Solution 2: Find New Tail Directly — O(n) time, O(1) space

```typescript
/**
 * Compute length, locate new tail explicitly without making circular
 * Time: O(n) | Space: O(1)
 */
function rotateRightV2(head: ListNode | null, k: number): ListNode | null {
  if (!head || !head.next) return head;

  // Count length
  let n = 0,
    cur: ListNode | null = head;
  while (cur) {
    n++;
    cur = cur.next;
  }

  const steps = k % n;
  if (steps === 0) return head;

  // Walk to new tail: node at index (n - steps - 1)
  let newTail: ListNode = head;
  for (let i = 0; i < n - steps - 1; i++) {
    newTail = newTail.next!;
  }

  const newHead = newTail.next!;
  // Connect old tail to old head
  let oldTail = newHead;
  while (oldTail.next) oldTail = oldTail.next;
  oldTail.next = head;

  newTail.next = null;
  return newHead;
}

console.log(print(rotateRightV2(build([1, 2, 3, 4, 5]), 2))); // 4 → 5 → 1 → 2 → 3
console.log(print(rotateRightV2(build([0, 1, 2]), 4))); // 2 → 0 → 1
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                  | Difficulty | Pattern                    |
| ------------------------------------------------------------------------ | ---------- | -------------------------- |
| [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list) | 🟢 Easy    | Linked list manipulation   |
| [Reorder List](https://leetcode.com/problems/reorder-list)               | 🟡 Medium  | Find mid + reverse + merge |
| [Partition List](https://leetcode.com/problems/partition-list)           | 🟡 Medium  | Split and rejoin           |
