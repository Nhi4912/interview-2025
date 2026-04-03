---
layout: page
title: "Take Gifts From the Richest Pile"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Heap (Priority Queue), Simulation]
leetcode_url: "https://leetcode.com/problems/take-gifts-from-the-richest-pile"
---

# Take Gifts From the Richest Pile / Lấy Quà Từ Đống Lớn Nhất

🟢 Easy | 🏷️ Array, Heap (Priority Queue), Simulation

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Bạn có nhiều đống kẹo. Mỗi giây bạn lấy đống lớn nhất, giữ lại `floor(sqrt(pile))` viên, và bỏ phần còn lại đi. Sau k giây, cộng tổng tất cả đống còn lại. Dùng max-heap để luôn lấy đống lớn nhất hiệu quả — không cần sort lại từ đầu mỗi lần.

```
gifts = [25,64,9,4,100], k=4

Step 1: max=100 → replace with floor(sqrt(100))=10  → [25,64,9,4,10]
Step 2: max=64  → replace with floor(sqrt(64)) =8   → [25,8,9,4,10]
Step 3: max=25  → replace with floor(sqrt(25)) =5   → [5,8,9,4,10]
Step 4: max=10  → replace with floor(sqrt(10)) =3   → [5,8,9,4,3]
Sum = 5+8+9+4+3 = 29
```

## Problem Description

You are given an integer array `gifts` representing gift piles and an integer `k`. In each second, pick the **largest** pile, leave `floor(sqrt(pile))` gifts, and discard the rest. After `k` seconds, return the **total** number of gifts remaining.

**Example 1:** `gifts = [25,64,9,4,100], k = 4` → `29`

**Example 2:** `gifts = [1,1,1,1], k = 4` → `4` (sqrt(1)=1, nothing changes)

## 📝 Interview Tips

- 🔑 **Data structure / Cấu trúc dữ liệu:** Max-heap (invert with negatives in JS) for O(log n) per operation
- 🔑 **Early exit / Thoát sớm:** If `pile === 1`, sqrt(1)=1, heap never changes; can terminate early
- 🔑 **Simulation / Mô phỏng:** k ≤ 10^3 and n ≤ 10^3; even O(nk) brute force fits in time
- ⚠️ **Floor vs Round / Sàn vs Làm tròn:** Must use `Math.floor(Math.sqrt(pile))`, not `Math.round`
- ⚠️ **Sum overflow / Tràn tổng:** Max sum = 10^3 × 10^9 = 10^12 → use `BigInt` or check bounds; fits in JS `number` (2^53)
- 🔗 **Pattern / Mẫu:** Repeated max extraction and reinsertion → max-heap simulation

## Solutions

### Solution 1: Max-Heap Simulation

```typescript
/**
 * Use a max-heap (via negated min-heap) to always access the largest pile.
 * Time: O((n + k) log n)  Space: O(n)
 */
function pickGifts(gifts: number[], k: number): number {
  // Max-heap using negatives (JS has no built-in heap)
  const heap = [...gifts].map((x) => -x);

  // Heapify
  const heapify = (arr: number[], i: number) => {
    const n = arr.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && arr[l] < arr[smallest]) smallest = l;
      if (r < n && arr[r] < arr[smallest]) smallest = r;
      if (smallest === i) break;
      [arr[i], arr[smallest]] = [arr[smallest], arr[i]];
      i = smallest;
    }
  };

  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) heapify(heap, i);

  const pop = (): number => {
    const top = -heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    heapify(heap, 0);
    return top;
  };

  const push = (val: number) => {
    heap.push(-val);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent] > heap[i]) {
        [heap[parent], heap[i]] = [heap[i], heap[parent]];
        i = parent;
      } else break;
    }
  };

  for (let i = 0; i < k; i++) {
    const max = pop();
    if (max === 1) {
      push(1);
      break;
    } // No more reduction possible
    push(Math.floor(Math.sqrt(max)));
  }

  return heap.reduce((sum, v) => sum + -v, 0);
}

console.log(pickGifts([25, 64, 9, 4, 100], 4)); // 29
console.log(pickGifts([1, 1, 1, 1], 4)); // 4
console.log(pickGifts([9], 1)); // 3
```

### Solution 2: Sort Each Round (Simple, O(nk log n))

```typescript
/**
 * Sort array each round, replace max, repeat.
 * Time: O(k * n log n)  Space: O(1)
 * Good for small inputs; easy to reason about correctness.
 */
function pickGiftsSimple(gifts: number[], k: number): number {
  const arr = [...gifts];
  for (let i = 0; i < k; i++) {
    arr.sort((a, b) => b - a);
    arr[0] = Math.floor(Math.sqrt(arr[0]));
  }
  return arr.reduce((s, v) => s + v, 0);
}

console.log(pickGiftsSimple([25, 64, 9, 4, 100], 4)); // 29
console.log(pickGiftsSimple([1, 1, 1, 1], 4)); // 4
```

### Solution 3: One-liner with Array Max

```typescript
/**
 * Find and replace max index each iteration.
 * Time: O(n*k)  Space: O(n)
 */
function pickGiftsLinear(gifts: number[], k: number): number {
  const arr = [...gifts];
  for (let i = 0; i < k; i++) {
    const maxIdx = arr.indexOf(Math.max(...arr));
    arr[maxIdx] = Math.floor(Math.sqrt(arr[maxIdx]));
  }
  return arr.reduce((s, v) => s + v, 0);
}

console.log(pickGiftsLinear([25, 64, 9, 4, 100], 4)); // 29
console.log(pickGiftsLinear([1, 1, 1, 1], 4)); // 4
```

## 🔗 Related Problems

| Problem                                                                                           | Difficulty | Pattern                 |
| ------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| [Last Stone Weight](https://leetcode.com/problems/last-stone-weight/)                             | Easy       | Max-heap simulation     |
| [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/)           | Medium     | Min-heap / partial sort |
| [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)       | Hard       | Two heaps               |
| [Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/) | Easy       | Min-heap of size k      |
