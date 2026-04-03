---
layout: page
title: "Swap Nodes in Pairs"
difficulty: Medium
category: Linked-List
tags: [Linked List, Recursion]
leetcode_url: "https://leetcode.com/problems/swap-nodes-in-pairs"
---

# Swap Nodes in Pairs / Hoán Đổi Từng Cặp Nút

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Linked List Pointer Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group) | [Reorder List](https://leetcode.com/problems/reorder-list)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy nghĩ đến đoàn tàu với các toa đôi — bạn muốn đổi chỗ toa A-B thành B-A, rồi C-D thành D-C. Bạn không di chuyển cả toa, chỉ nối lại các khớp nối. Dùng dummy node ở đầu để xử lý cặp đầu tiên đồng nhất.

**Pattern:** `prev → second → first → rest` — ba con trỏ để làm một lần swap.

```
Before: dummy → 1 → 2 → 3 → 4 → null
         prev   ^   ^
               first second

Step 1: dummy → 2 → 1 → 3 → 4
                     ^   ^   ^
                   prev  f   s

Step 2: dummy → 2 → 1 → 4 → 3 → null ✅
```

---

Cho danh sách liên kết, **hoán đổi mỗi cặp nút kề nhau** và trả về đầu danh sách. Chỉ được thay đổi con trỏ, không được thay đổi giá trị nút.

- `1 → 2 → 3 → 4` → `2 → 1 → 4 → 3`
- `1 → 2 → 3` → `2 → 1 → 3` (nút lẻ cuối giữ nguyên)
- `[]` → `[]`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Dummy node**: giúp xử lý head đồng nhất — không cần case đặc biệt cho cặp đầu tiên
- 🇺🇸 **3 pointer pattern**: `prev`, `first`, `second` — update 3 links per swap cycle
- 🇻🇳 **Sau swap**: `prev` di chuyển đến `first` (nay ở vị trí thứ hai); tiến thêm 2 bước
- 🇺🇸 **Recursive solution**: cleaner code but O(n) stack space — prefer iterative in interviews
- 🇻🇳 **Điều kiện vòng lặp**: `while (first && second)` — nút lẻ cuối tự giữ nguyên
- 🇺🇸 **Space**: Iterative is O(1) extra; Recursive is O(n/2) call stack

---

## Solutions

### Solution 1: Recursive — O(n) time, O(n) stack space

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
 * Recursively swap head with head.next, then recurse on remainder
 * Time: O(n) | Space: O(n/2) call stack
 */
function swapPairsRecursive(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head; // 0 or 1 node: nothing to swap

  const second = head.next;
  // head becomes second position; recurse for nodes after second
  head.next = swapPairsRecursive(second.next);
  second.next = head;

  return second; // second is new head of this pair
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

console.log(print(swapPairsRecursive(build([1, 2, 3, 4])))); // 2 → 1 → 4 → 3
console.log(print(swapPairsRecursive(build([1, 2, 3])))); // 2 → 1 → 3
console.log(print(swapPairsRecursive(build([])))); // []
```

### Solution 2: Iterative with Dummy Node — O(n) time, O(1) space ✅ Optimal

```typescript
/**
 * Use dummy head + prev pointer to swap pairs in-place iteratively
 * Time: O(n) | Space: O(1)
 */
function swapPairs(head: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  dummy.next = head;
  let prev: ListNode = dummy;

  while (prev.next && prev.next.next) {
    const first = prev.next;
    const second = prev.next.next;

    // Re-wire: prev → second → first → (what was after second)
    first.next = second.next;
    second.next = first;
    prev.next = second;

    prev = first; // first is now in 2nd position; advance prev past the pair
  }

  return dummy.next;
}

console.log(print(swapPairs(build([1, 2, 3, 4])))); // 2 → 1 → 4 → 3
console.log(print(swapPairs(build([1, 2, 3])))); // 2 → 1 → 3
console.log(print(swapPairs(build([1])))); // 1
console.log(print(swapPairs(build([])))); // []
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                            | Difficulty | Pattern                |
| ---------------------------------------------------------------------------------- | ---------- | ---------------------- |
| [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group) | 🔴 Hard    | Generalized swap pairs |
| [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list)           | 🟢 Easy    | Foundation skill       |
| [Reorder List](https://leetcode.com/problems/reorder-list)                         | 🟡 Medium  | Linked list pointer    |
