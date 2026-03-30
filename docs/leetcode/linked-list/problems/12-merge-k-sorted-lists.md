---
layout: page
title: "Merge K Sorted Lists"
difficulty: Hard
category: Linked List
tags: [Linked List, Heap, Divide and Conquer, Merge Sort]
leetcode_url: "https://leetcode.com/problems/merge-k-sorted-lists/"
---

# Merge K Sorted Lists / Gộp K Danh Sách Đã Sắp Xếp

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Min-Heap / Divide & Conquer
> **Frequency**: 🔥 Tier 1 — Combines 2 patterns, very common at FAANG
> **See also**: [Merge Two Sorted Lists](./02-merge-two-sorted-lists.md) | [Find K Largest](../../sorting-searching/problems/02-find-k-largest-elements.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** K hàng người đang xếp hàng, mỗi hàng đã được sắp xếp theo thứ tự chiều cao. Bạn cần gộp tất cả vào 1 hàng duy nhất. Cách tối ưu: luôn chọn người **thấp nhất trong số người đứng đầu hàng** → Min-Heap lưu "đầu hàng" của mỗi danh sách.

**Pattern Recognition:**
- K sorted sequences → merge → **Min-Heap** (always pick global minimum efficiently)
- Alternative: **Divide & Conquer** — merge pairs like merge sort (O(N log k))
- Naive "merge one by one" = O(kN) — too slow when k is large

**Visual — Min-Heap approach:**
```
Lists: [1→4→5], [1→3→4], [2→6]

Initial heap (head of each list):
  heap = [(1,list0), (1,list1), (2,list2)]

Step 1: Pop min (1,list0) → output: 1
  Push next from list0: (4,list0)
  heap = [(1,list1), (2,list2), (4,list0)]

Step 2: Pop min (1,list1) → output: 1,1
  Push next from list1: (3,list1)
  heap = [(2,list2), (3,list1), (4,list0)]

Step 3: Pop min (2,list2) → output: 1,1,2
  Push next from list2: (6,list2)
  heap = [(3,list1), (4,list0), (6,list2)]

...continue until heap empty

Result: 1→1→2→3→4→4→5→6
```

**Visual — Divide & Conquer:**
```
k=4 lists: [L0, L1, L2, L3]

Round 1: merge pairs
  merge(L0,L1) → M01
  merge(L2,L3) → M23

Round 2: merge remaining
  merge(M01, M23) → final

log k rounds, each round O(N total) → O(N log k)
```

---

## Problem Description

You are given an array of `k` linked-lists, each sorted in ascending order. Merge all into one sorted linked-list.

```
Example 1: lists = [[1,4,5],[1,3,4],[2,6]] → [1,1,2,3,4,4,5,6]
Example 2: lists = [] → []
Example 3: lists = [[]] → []
```

---

## 📝 Interview Tips

1. **Start with Merge Two** — extend naturally to K
2. **Min-Heap vs D&C**: both O(N log k), heap = streaming-friendly, D&C = simpler code
3. **N = total nodes** across all lists, k = number of lists
4. **Heap doesn't exist in JS/TS** — implement or use sorted array (mention this tradeoff)
5. **Edge cases**: empty `lists`, lists containing `null`, single list

---

## Solutions

{% raw %}

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * Solution 1: Brute Force — collect, sort, rebuild
 * Time: O(N log N), Space: O(N)
 */
function mergeKLists_brute(lists: Array<ListNode | null>): ListNode | null {
  const values: number[] = [];
  for (let node of lists) {
    while (node) { values.push(node.val); node = node.next; }
  }
  values.sort((a, b) => a - b);
  const dummy = new ListNode(0);
  let curr = dummy;
  for (const val of values) { curr.next = new ListNode(val); curr = curr.next; }
  return dummy.next;
}

/**
 * Solution 2: Min-Heap simulation
 *
 * Use sorted array as min-heap (mention: real interview use proper heap).
 * Always extract minimum head, push its next.
 *
 * Time: O(N log k), Space: O(k) for heap
 */
function mergeKLists_heap(lists: Array<ListNode | null>): ListNode | null {
  // Simulate min-heap with sorted array [val, node]
  const heap: [number, ListNode][] = [];

  for (const node of lists) {
    if (node) heap.push([node.val, node]);
  }
  heap.sort((a, b) => a[0] - b[0]);

  const dummy = new ListNode(0);
  let curr = dummy;

  while (heap.length > 0) {
    const [, minNode] = heap.shift()!;
    curr.next = minNode;
    curr = curr.next;

    if (minNode.next) {
      // Insert next node maintaining sorted order
      const next: [number, ListNode] = [minNode.next.val, minNode.next];
      let i = heap.length;
      heap.push(next);
      while (i > 0 && heap[i][0] < heap[i-1][0]) {
        [heap[i], heap[i-1]] = [heap[i-1], heap[i]];
        i--;
      }
    }
  }
  return dummy.next;
}

/**
 * Solution 3: Divide & Conquer (Cleanest, O(N log k))
 *
 * Like merge sort: recursively merge pairs until one list remains.
 *
 * Time: O(N log k), Space: O(log k) call stack
 */
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) return null;
  if (lists.length === 1) return lists[0];

  function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    const dummy = new ListNode(0);
    let curr = dummy;
    while (l1 && l2) {
      if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
      else { curr.next = l2; l2 = l2.next; }
      curr = curr.next;
    }
    curr.next = l1 || l2;
    return dummy.next;
  }

  function divideAndConquer(arr: Array<ListNode | null>, left: number, right: number): ListNode | null {
    if (left === right) return arr[left];
    const mid = Math.floor((left + right) / 2);
    const l1 = divideAndConquer(arr, left, mid);
    const l2 = divideAndConquer(arr, mid + 1, right);
    return mergeTwoLists(l1, l2);
  }

  return divideAndConquer(lists, 0, lists.length - 1);
}

{% endraw %}

---

## 🔗 Related Problems

- [Merge Two Sorted Lists](./02-merge-two-sorted-lists.md) — prerequisite (must solve first)
- [Find K Largest](../../sorting-searching/problems/02-find-k-largest-elements.md) — same heap pattern
- [Top K Frequent Elements](../../array/problems/29-top-k-frequent-elements.md) — heap pattern family
