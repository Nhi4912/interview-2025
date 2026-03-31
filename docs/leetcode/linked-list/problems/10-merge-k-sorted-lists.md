---
layout: page
title: "Merge k Sorted Lists"
difficulty: Hard
category: Linked List
tags: [Linked List, Divide and Conquer, Heap, Priority Queue, Merge Sort]
leetcode_url: "https://leetcode.com/problems/merge-k-sorted-lists/"
---

# Merge k Sorted Lists / Gộp k Danh Sách Đã Sắp Xếp

> **Track**: Blind 75 | **Difficulty**: 🔴 Hard
> **Pattern**: Divide & Conquer / Min-Heap | **Frequency**: 📗 Tier 1
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

## 🧠 Intuition / Tư Duy

**Analogy (Tiếng Việt):** Hãy tưởng tượng k nhân viên ngân hàng mỗi người có một xếp hồ sơ được sắp xếp. Cách hiệu quả nhất để gộp tất cả: mỗi lần lấy tờ hồ sơ nhỏ nhất từ đỉnh của mọi xếp (Min-Heap), hoặc gộp từng cặp xếp rồi cặp kết quả (Divide & Conquer — như merge sort).

**Pattern Recognition:**

- Naive "pick minimum từ k heads": O(kN) — quá chậm khi k lớn
- **Divide & Conquer**: giảm k list thành k/2, lặp lại → O(N log k)
- **Min-Heap**: luôn pop phần tử nhỏ nhất → O(N log k)
- N = tổng số node, k = số danh sách

**ASCII Visual:**

```
k=3 lists:  [1→4→5]  [1→3→4]  [2→6]

Divide & Conquer:
Round 1:  merge([1→4→5],[1→3→4]) → [1→1→3→4→4→5]
          merge([2→6], null)      → [2→6]
Round 2:  merge above two         → [1→1→2→3→4→4→5→6] ✓

Min-Heap approach:
  heap: {1(A), 1(B), 2(C)}
  pop 1(A) → push 4(A): {1(B), 2(C), 4(A)}
  pop 1(B) → push 3(B): {2(C), 3(B), 4(A)}
  ... continues until empty
```

## Problem Description

Given an array of `k` linked lists, each sorted in ascending order, merge them into one sorted list.

**Example 1:**

```
Input:  [[1,4,5], [1,3,4], [2,6]]
Output: [1,1,2,3,4,4,5,6]
```

**Example 2:** `[]` → `[]` &nbsp;&nbsp; `[[]]` → `[]`

**Constraints:** 0 ≤ k ≤ 10^4. 0 ≤ each list length ≤ 500. Total nodes ≤ 10^4.

## 📝 Interview Tips

- 🇻🇳 **Bắt đầu bằng brute force** (collect all → sort → rebuild O(N log N)) rồi tiến lên O(N log k)
- 🇬🇧 **Progression:** brute force → compare one-by-one O(kN) → heap/D&C O(N log k)
- 🇻🇳 **D&C vs Heap:** D&C dễ code hơn (dùng `mergeTwoLists` viết trước); Heap tốt hơn khi k rất lớn
- 🇬🇧 **D&C is interview-preferred** — reuses `mergeTwoLists` (LC #21), shows pattern recognition
- 🇻🇳 **JavaScript không có built-in heap** — phải tự implement hoặc dùng sorted array O(k log k) per step
- 🇬🇧 **Mention real-world:** k-way merge is used in external sorting, MapReduce, and database query merging

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
 * Solution 1: Divide & Conquer (Optimal, Interview Standard)
 * Iteratively pair up lists and merge pairs, halving k each round.
 * Time: O(N log k) | Space: O(1) iterative, O(log k) if recursive
 */
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) return null;

  while (lists.length > 1) {
    const merged: Array<ListNode | null> = [];
    for (let i = 0; i < lists.length; i += 2) {
      merged.push(mergeTwoLists(lists[i], lists[i + 1] ?? null));
    }
    lists = merged;
  }
  return lists[0];
}

function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let cur = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      cur.next = l1;
      l1 = l1.next;
    } else {
      cur.next = l2;
      l2 = l2.next;
    }
    cur = cur.next!;
  }
  cur.next = l1 ?? l2;
  return dummy.next;
}

/**
 * Solution 2: Min-Heap (O(k) space, always processes global minimum)
 * Push initial heads; pop min, add to result, push next from same list.
 * Time: O(N log k) | Space: O(k) for heap
 *
 * JS has no built-in heap — simulated here with a sorted array.
 * In interview: mention you'd use a proper MinHeap or Java's PriorityQueue.
 */
function mergeKListsHeap(lists: Array<ListNode | null>): ListNode | null {
  // Sorted array as simple heap (fine for small k; note O(k) per insertion)
  let heap: ListNode[] = lists.filter(Boolean) as ListNode[];
  heap.sort((a, b) => a.val - b.val);

  const dummy = new ListNode(0);
  let cur = dummy;

  while (heap.length) {
    const node = heap.shift()!;
    cur.next = node;
    cur = cur.next;
    if (node.next) {
      // Insert next node maintaining sorted order
      let i = heap.length;
      heap.push(node.next);
      while (i > 0 && heap[i].val < heap[i - 1].val) {
        [heap[i], heap[i - 1]] = [heap[i - 1], heap[i]];
        i--;
      }
    }
  }
  return dummy.next;
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

const inp1 = [mk([1, 4, 5]), mk([1, 3, 4]), mk([2, 6])];
console.assert(JSON.stringify(toArr(mergeKLists(inp1))) === "[1,1,2,3,4,4,5,6]", "3 lists");
console.assert(mergeKLists([]) === null, "empty");
console.assert(
  JSON.stringify(toArr(mergeKListsHeap([mk([1, 4, 5]), mk([1, 3, 4]), mk([2, 6])]))) ===
    "[1,1,2,3,4,4,5,6]",
  "heap",
);
```

```

## 🔗 Related Problems

- [21. Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/) — core building block used here
- [264. Ugly Number II](https://leetcode.com/problems/ugly-number-ii/) — k-way merge pattern with a heap
- [378. Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) — heap over k sorted sequences
- [373. Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) — similar heap-based k-stream merge
