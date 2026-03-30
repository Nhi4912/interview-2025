---
layout: page
title: "Odd Even Linked List"
difficulty: Medium
category: Linked List
tags: [Linked List, Two Pointers]
leetcode_url: "https://leetcode.com/problems/odd-even-linked-list/"
---

# Odd Even Linked List / Sắp Xếp Node Chỉ Số Lẻ-Chẵn

> **Track**: Shared | **Difficulty**: 🟡 Medium
> **Pattern**: Two Pointers — Weaving Two Sub-lists | **Frequency**: 📘 Tier 2
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

## 🧠 Intuition / Tư Duy

**Analogy (Tiếng Việt):** Hãy tưởng tượng bạn có một hàng người được đánh số 1, 2, 3, 4, 5... Bạn muốn tách họ thành hai nhóm (lẻ và chẵn) nhưng không thay đổi thứ tự trong mỗi nhóm, rồi nối nhóm lẻ với nhóm chẵn. Thay vì tạo danh sách mới, bạn chỉnh con trỏ tại chỗ.

**Pattern Recognition:**

- Duy trì 2 sub-list (odd và even) bằng 2 con trỏ chạy song song
- `odd.next = even.next` → skip even node; `even.next = odd.next` → skip odd node
- Lưu `evenHead` trước vòng lặp để nối vào cuối odd list sau khi xong
- O(1) space vì chỉ re-link, không tạo node mới

**ASCII Visual:**

```
Input:  1 → 2 → 3 → 4 → 5 → null
        ↑odd ↑even
        ↑evenHead (saved)

Step 1: odd.next = 3, odd moves to 3
        even.next = 4, even moves to 4
        1 → 3       2 → 4 → 5

Step 2: odd.next = 5, odd moves to 5
        even.next = null, even moves to null
        1 → 3 → 5   2 → 4

Connect: odd.next = evenHead
Output: 1 → 3 → 5 → 2 → 4 → null
```

## Problem Description

Given the `head` of a singly linked list, group all odd-indexed nodes followed by even-indexed nodes. The **first node is index 1 (odd)**. Preserve relative order within each group.

Solve in **O(1) space** and **O(n) time**.

**Example 1:**

```
Input:  [1, 2, 3, 4, 5]
Output: [1, 3, 5, 2, 4]
```

**Example 2:**

```
Input:  [2, 1, 3, 5, 6, 4, 7]
Output: [2, 3, 6, 7, 1, 5, 4]
```

**Constraints:** 0 ≤ n ≤ 10^4. -10^6 ≤ Node.val ≤ 10^6.

## 📝 Interview Tips

- 🇻🇳 **Chú ý "odd/even" là chỉ số (index), KHÔNG phải giá trị** — node 1 (index 1) là "odd" dù val=2
- 🇬🇧 **Odd/even refers to position (1-indexed), not value** — a common trap interviewers set
- 🇻🇳 **Điều kiện vòng lặp:** `while (even && even.next)` — dừng khi even là null (list lẻ) hoặc even.next là null (list chẵn)
- 🇬🇧 **Loop guard** `even && even.next` handles both odd-length and even-length lists safely
- 🇻🇳 **Phải lưu evenHead trước** — sau vòng lặp, even có thể là null; không còn truy cập được nữa
- 🇬🇧 **Save `evenHead` before the loop** — the `even` pointer will advance and you'll lose the reference

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
 * Solution 1: Two Pointers In-Place (Optimal — required by problem)
 * Weave odd and even chains simultaneously, then link them.
 * Time: O(n) | Space: O(1)
 */
function oddEvenList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  let odd = head;
  let even = head.next;
  const evenHead = even; // save start of even chain

  while (even && even.next) {
    odd.next = even.next; // odd skips over even
    odd = odd.next!;
    even.next = odd.next; // even skips over next odd
    even = even.next!;
  }

  odd.next = evenHead; // attach even chain to end of odd chain
  return head;
}

/**
 * Solution 2: Separate Dummy Lists (Clearer logic, O(n) space)
 * Build odd and even chains independently, then concatenate.
 * Time: O(n) | Space: O(1) — reuses existing nodes, just two extra dummies
 */
function oddEvenListSeparate(head: ListNode | null): ListNode | null {
  const oddDummy = new ListNode(0);
  const evenDummy = new ListNode(0);
  let oddTail = oddDummy,
    evenTail = evenDummy;
  let cur = head;
  let idx = 1;

  while (cur) {
    const next = cur.next;
    cur.next = null; // detach
    if (idx % 2 === 1) {
      oddTail.next = cur;
      oddTail = cur;
    } else {
      evenTail.next = cur;
      evenTail = cur;
    }
    cur = next;
    idx++;
  }

  oddTail.next = evenDummy.next;
  return oddDummy.next;
}

// Inline tests
const mk = (a: number[]) =>
  a.reduceRight<ListNode | null>((next, val) => new ListNode(val, next), null);
const toArr = (h: ListNode | null): number[] => {
  const r: number[] = [];
  while (h) {
    r.push(h.val);
    h = h.next;
  }
  return r;
};

console.assert(
  JSON.stringify(toArr(oddEvenList(mk([1, 2, 3, 4, 5])))) === "[1,3,5,2,4]",
  "[1,2,3,4,5]",
);
console.assert(
  JSON.stringify(toArr(oddEvenList(mk([2, 1, 3, 5, 6, 4, 7])))) === "[2,3,6,7,1,5,4]",
  "7 elements",
);
console.assert(toArr(oddEvenList(null)).length === 0, "null");

console.assert(JSON.stringify(toArr(oddEvenListSeparate(mk([1, 2, 3, 4, 5])))) === "[1,3,5,2,4]");
```

{% endraw %}

## 🔗 Related Problems

- [328. Odd Even Linked List](https://leetcode.com/problems/odd-even-linked-list/) — this problem
- [86. Partition List](https://leetcode.com/problems/partition-list/) — similar partition idea, split by value threshold
- [143. Reorder List](https://leetcode.com/problems/reorder-list/) — interleave two halves (find middle + reverse)
- [21. Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/) — merge two independent chains
