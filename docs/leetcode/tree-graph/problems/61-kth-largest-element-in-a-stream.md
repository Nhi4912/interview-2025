---
layout: page
title: "Kth Largest Element in a Stream"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Design, Binary Search Tree, Heap (Priority Queue), Binary Tree]
leetcode_url: "https://leetcode.com/problems/kth-largest-element-in-a-stream"
---

# Kth Largest Element in a Stream / Phần Tử Lớn Thứ K Trong Luồng Dữ Liệu

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Closest Binary Search Tree Value II](https://leetcode.com/problems/closest-binary-search-tree-value-ii) | [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bảng xếp hạng Top-K — bạn chỉ cần giữ đúng K người giỏi nhất. Khi có người mới vào, so sánh với người yếu nhất trong top-K. Nếu mới giỏi hơn → thay thế. Min-heap (kích thước K) luôn cho thấy người yếu nhất trong top-K ở đầu.

**Pattern Recognition:**

- Signal: "maintain kth largest in dynamic stream" → **Min-Heap of size K**
- The minimum in a size-K heap = the Kth largest overall
- Key insight: Push new element, if heap size > K pop the minimum; heap[0] = kth largest

**Visual — Min-heap of size k=3:**

```
Stream: add(4), add(5), add(8), add(2), add(3)
k = 3

After add(4): heap=[4]         → size<k, return -
After add(5): heap=[4,5]       → size<k, return -
After add(8): heap=[4,5,8]     → kth=4
After add(2): 2<heap[0]=4 skip → kth=4
After add(3): 3<heap[0]=4 skip → kth=4

Now add(6): push→[4,5,8,6], pop 4 → heap=[5,6,8] → kth=5
```

---

## Problem Description

Design a class `KthLargest` that finds the kth largest element in a stream. Initialize with integer `k` and an array `nums`. The `add(val)` method appends `val` to the stream and returns the kth largest element currently in the stream.

- Example: `k=3, nums=[4,5,8,2]`; `add(3)→4`, `add(5)→5`, `add(10)→5`, `add(9)→8`, `add(4)→8`
- Example: `k=1, nums=[]`; `add(-3)→-3`, `add(-2)→-2`

Constraints: `1 <= k <= 10^4`, `0 <= nums.length <= 10^4`, `-10^4 <= val <= 10^4`, at most `10^4` calls to `add`.

---

## 📝 Interview Tips

1. **Clarify**: "k luôn valid — stream sẽ có ít nhất k phần tử khi gọi add?" / Confirmed: at most k-1 elements before add is called
2. **Key insight**: "Min-heap size K: minimum trong heap = kth largest. Bất ngờ nhưng đúng!" / Counter-intuitive: smallest of top-K = kth largest
3. **Why min not max**: "Max-heap cho largest, nhưng kth largest cần biết người yếu nhất trong top-K" / Min-heap efficiently exposes the Kth element
4. **JS no built-in heap**: "Tự implement min-heap bằng array; hoặc dùng sorted array cho simplicity" / Must implement or simulate in JS/TS
5. **Edge cases**: "nums rỗng, k=1 (always return max), val nhỏ hơn tất cả" / Empty init, k=1 = max stream, small values
6. **Follow-up**: "Kth smallest? Dùng Max-heap size K thay vì Min-heap" / Mirror: max-heap of size K → kth smallest at top

---

## Solutions

```typescript
/**
 * MinHeap helper — standard binary heap implementation
 */
class MinHeap {
  private data: number[] = [];

  get size(): number {
    return this.data.length;
  }
  get top(): number {
    return this.data[0];
  }

  push(val: number): void {
    this.data.push(val);
    this.bubbleUp(this.data.length - 1);
  }

  pop(): number {
    const min = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent] <= this.data[i]) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  private sinkDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this.data[l] < this.data[smallest]) smallest = l;
      if (r < n && this.data[r] < this.data[smallest]) smallest = r;
      if (smallest === i) break;
      [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
      i = smallest;
    }
  }
}

/**
 * KthLargest: min-heap of size k; heap.top = kth largest
 * Time: O(log k) per add — heap push/pop
 * Space: O(k) — heap stores at most k elements
 */
class KthLargest {
  private heap: MinHeap;
  private k: number;

  constructor(k: number, nums: number[]) {
    this.k = k;
    this.heap = new MinHeap();
    for (const num of nums) this.add(num);
  }

  add(val: number): number {
    this.heap.push(val);
    if (this.heap.size > this.k) this.heap.pop();
    return this.heap.top;
  }
}

// === Test Cases ===
const kth = new KthLargest(3, [4, 5, 8, 2]);
console.log(kth.add(3)); // 4
console.log(kth.add(5)); // 5
console.log(kth.add(10)); // 5
console.log(kth.add(9)); // 8
console.log(kth.add(4)); // 8

const kth2 = new KthLargest(1, []);
console.log(kth2.add(-3)); // -3
console.log(kth2.add(-2)); // -2
console.log(kth2.add(-4)); // -2
```

---

## 🔗 Related Problems

- [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream) — two heaps to maintain median dynamically
- [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) — static version, quickselect O(N) average
- [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements) — heap for frequency-based top-K
- [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator) — BST in-order streaming
