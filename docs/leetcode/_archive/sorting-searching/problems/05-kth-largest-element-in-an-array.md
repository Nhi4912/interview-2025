---
layout: page
title: "Kth Largest Element in an Array"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Divide and Conquer, Sorting, Heap (Priority Queue), Quickselect]
leetcode_url: "https://leetcode.com/problems/kth-largest-element-in-an-array"
---

# Kth Largest Element in an Array / Phần Tử Lớn Thứ K Trong Mảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap / Quickselect
> **Frequency**: 🔥 Tier 1 — Gặp ở 60+ companies (Amazon, Google, Microsoft)
> **See also**: [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) | [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cuộc thi chọn "Top K học sinh giỏi nhất" — bạn không cần xếp hạng toàn bộ lớp, chỉ cần duy trì danh sách K người giỏi nhất. Min-heap giữ người yếu nhất trong top-K ở đỉnh, sẵn sàng bị thay thế.

**Pattern Recognition:**

- Signal: "k-th largest/smallest", "top-k elements" → **Min-Heap size k** hoặc **Quickselect**
- Min-heap: sau khi duyệt hết, đỉnh heap là phần tử lớn thứ K
- Quickselect: partition-based, tương tự quicksort nhưng chỉ đệ quy 1 nhánh

**Visual — Min-Heap size k=2 trên [3,2,1,5,6,4]:**

```
Insert 3: heap=[3]          Insert 5: heap=[3,5] → push 5, size=2 OK
Insert 2: heap=[2,3]        Insert 6: heap=[5,6] → 5 replaces 3 (3<5)
Insert 1: heap=[2,3] → pop  Insert 4: heap=[5,6] → 4<5, skip
  1 < heap.peek()=2, skip
Kth largest = heap.peek() = 5 ✅
```

---

## Problem Description

Given an integer array `nums` and an integer `k`, return the k-th largest element in the array (not the k-th distinct element). You must solve it in O(n) average time using quickselect, or O(n log k) using a heap.

```
Example 1: nums=[3,2,1,5,6,4], k=2  → 5
Example 2: nums=[3,2,3,1,2,4,5,5,6], k=4 → 4
```

Constraints: `1 <= k <= nums.length <= 10^5`, `-10^4 <= nums[i] <= 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "k có thể bằng n không?" / Can k equal n (last largest)? Confirm constraints.
2. **Brute force**: Sort desc in O(n log n) → return nums[k-1]; good start point.
3. **Heap approach**: Min-heap size k → O(n log k); great for streaming data.
4. **Quickselect**: O(n) average but O(n²) worst; use random pivot to avoid worst case.
5. **Follow-up**: "Nếu data stream thì dùng heap; nếu cần nhiều queries thì sort một lần."
6. **Edge cases**: k=1 (max element), k=n (min element), all duplicates.

---

## Solutions

```typescript
/**
 * Solution 1: Sort Descending
 * Time: O(n log n) — built-in sort
 * Space: O(1) — in-place sort (modifies input)
 */
function findKthLargest1(nums: number[], k: number): number {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}

// ─── Min-Heap helper ────────────────────────────────────────────────────────
class MinHeap {
  private h: number[] = [];
  get size() {
    return this.h.length;
  }
  peek() {
    return this.h[0];
  }

  push(v: number) {
    this.h.push(v);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p] <= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }

  pop(): number {
    const top = this.h[0];
    const last = this.h.pop()!;
    if (this.h.length > 0) {
      this.h[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1,
          r = 2 * i + 2;
        if (l < this.h.length && this.h[l] < this.h[s]) s = l;
        if (r < this.h.length && this.h[r] < this.h[s]) s = r;
        if (s === i) break;
        [this.h[i], this.h[s]] = [this.h[s], this.h[i]];
        i = s;
      }
    }
    return top;
  }
}

/**
 * Solution 2: Min-Heap of size k
 * Time: O(n log k) — each element triggers at most one push+pop = O(log k)
 * Space: O(k) — heap stores exactly k elements
 */
function findKthLargest2(nums: number[], k: number): number {
  const heap = new MinHeap();
  for (const num of nums) {
    heap.push(num);
    if (heap.size > k) heap.pop(); // evict smallest, keep top-k
  }
  return heap.peek(); // smallest of top-k = kth largest
}

/**
 * Solution 3: Quickselect (optimal average case)
 * Time: O(n) average, O(n²) worst — randomised pivot avoids worst case
 * Space: O(1) — in-place partition
 */
function findKthLargest(nums: number[], k: number): number {
  const target = nums.length - k; // kth largest = (n-k)th smallest

  function partition(lo: number, hi: number): number {
    // Random pivot swap to avoid O(n²) worst case
    const pi = lo + Math.floor(Math.random() * (hi - lo + 1));
    [nums[pi], nums[hi]] = [nums[hi], nums[pi]];
    const pivot = nums[hi];
    let p = lo;
    for (let i = lo; i < hi; i++) {
      if (nums[i] <= pivot) {
        [nums[p], nums[i]] = [nums[i], nums[p]];
        p++;
      }
    }
    [nums[p], nums[hi]] = [nums[hi], nums[p]];
    return p;
  }

  let lo = 0,
    hi = nums.length - 1;
  while (lo < hi) {
    const p = partition(lo, hi);
    if (p === target) return nums[p];
    else if (p < target) lo = p + 1;
    else hi = p - 1;
  }
  return nums[lo];
}

// === Test Cases ===
console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2)); // 5
console.log(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 4
console.log(findKthLargest2([3, 2, 1, 5, 6, 4], 2)); // 5
console.log(findKthLargest1([3, 2, 1, 5, 6, 4], 2)); // 5
```

---

## 🔗 Related Problems

| Problem                                                                                                | Relationship                       |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) | This problem                       |
| [295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)       | Two heaps — dynamic k-th element   |
| [347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)                 | Same heap pattern, frequency-keyed |
| [973. K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/)           | Min-heap size k on distance        |
| [912. Sort an Array](https://leetcode.com/problems/sort-an-array/)                                     | Full sort — related to quickselect |
