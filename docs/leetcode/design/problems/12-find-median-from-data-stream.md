---
layout: page
title: "Find Median from Data Stream"
difficulty: Hard
category: Design
tags: [Two Pointers, Design, Sorting, Heap (Priority Queue), Data Stream]
leetcode_url: "https://leetcode.com/problems/find-median-from-data-stream"
---

# Find Median from Data Stream / Tìm Trung Vị Từ Luồng Dữ Liệu

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Two Heaps
> **Frequency**: ⭐ Tier 2 — Gặp ở 23+ companies

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Tưởng tượng lớp học chia làm hai nhóm: nhóm học sinh yếu (nửa dưới) và nhóm học sinh giỏi (nửa trên). Muốn biết điểm trung vị, chỉ cần xem học sinh giỏi nhất của nhóm yếu và học sinh kém nhất của nhóm giỏi. Duy trì hai "heap" như hai nhóm này — luôn cân bằng kích thước.

**Pattern Recognition:**

- Signal: "dynamic median" + "streaming data" → **Two Heaps**
- `maxHeap` (lower half): top = phần tử lớn nhất của nửa nhỏ
- `minHeap` (upper half): top = phần tử nhỏ nhất của nửa lớn
- Invariant: `|maxHeap.size - minHeap.size| <= 1`
- Median = top of larger heap, or average of both tops

**Visual — addNum sequence: [5, 15, 1, 3]:**

```
addNum(5):
  maxHeap=[5] minHeap=[]   median=5

addNum(15):
  Push to maxHeap=[15,5], balance → move 15→minHeap
  maxHeap=[5]  minHeap=[15]  median=(5+15)/2=10

addNum(1):
  1 <= maxTop(5) → maxHeap=[5,1] minHeap=[15]
  sizes: 2 vs 1 → balance: move 5→minHeap
  maxHeap=[1]  minHeap=[5,15]  median=???
  Wait: 1 element each side now → no...
  Actually: maxHeap=[5,1] size=2, minHeap=[15] size=1
  diff=1 → ok since sizes differ by 1
  median = maxHeap.top() = 5

addNum(3):
  3 <= maxTop(5) → push to maxHeap=[5,3,1] size=3
  minHeap=[15] size=1 → diff=2 → rebalance: move 5→minHeap
  maxHeap=[3,1] minHeap=[5,15]
  median = (3+5)/2 = 4
```

---

## Problem Description

Thiết kế data structure hỗ trợ 2 operations: `addNum(num)` thêm số vào stream, `findMedian()` trả về trung vị hiện tại. ([LeetCode 295](https://leetcode.com/problems/find-median-from-data-stream))

Difficulty: Hard | Acceptance: 53.3%

```
Example:
  addNum(1) → stream: [1]          findMedian() → 1.0
  addNum(2) → stream: [1,2]        findMedian() → 1.5
  addNum(3) → stream: [1,2,3]      findMedian() → 2.0
```

Constraints:

- `-10^5 <= num <= 10^5`
- At most `5 * 10^4` calls to `addNum` and `findMedian`
- At least one element before calling `findMedian`

---

## 📝 Interview Tips

1. **Clarify**: "Có thể có số trùng? Có giới hạn số lần gọi không?" / Duplicates allowed? Call count limit?
2. **Why two heaps**: "Sort lại mỗi lần → O(n log n); two heaps → O(log n) per add, O(1) per findMedian" / Sorting each time is O(n log n); two heaps gives O(log n) add
3. **JS heap**: "JavaScript không có built-in heap — implement MinHeap, dùng maxHeap = MinHeap với giá trị âm" / JS has no built-in heap — negate values to simulate max-heap
4. **Balance rule**: "Sau mỗi push, rebalance nếu size diff > 1. maxHeap size = minHeap size hoặc +1" / Rebalance after each insert; maxHeap can be same size or one larger
5. **Edge case**: "Stream rỗng khi gọi findMedian? Stream 1 phần tử?" / Empty stream or single element
6. **Follow-up**: "Nếu 99% số nằm trong [0,100]? → Bucket sort / count array" / If 99% numbers in small range, use bucket counting

---

## Solutions

```typescript
/**
 * Min-Heap implementation (needed since JS has no built-in heap)
 */
class MinHeap {
  private data: number[] = [];
  push(val: number): void {
    this.data.push(val);
    this._bubbleUp(this.data.length - 1);
  }
  pop(): number {
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this._sinkDown(0);
    }
    return top;
  }
  peek(): number {
    return this.data[0];
  }
  size(): number {
    return this.data.length;
  }
  private _bubbleUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[p] <= this.data[i]) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }
  private _sinkDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let min = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this.data[l] < this.data[min]) min = l;
      if (r < n && this.data[r] < this.data[min]) min = r;
      if (min === i) break;
      [this.data[min], this.data[i]] = [this.data[i], this.data[min]];
      i = min;
    }
  }
}

/**
 * Solution: Two Heaps  ← OPTIMAL
 * Name: Max-Heap (lower) + Min-Heap (upper)
 * addNum Time: O(log n) — heap operations
 * findMedian Time: O(1) — peek tops
 * Space: O(n)
 */
class MedianFinder {
  private lo: MinHeap; // max-heap simulated via negation (lower half)
  private hi: MinHeap; // min-heap (upper half)

  constructor() {
    this.lo = new MinHeap(); // stores negated values → acts as max-heap
    this.hi = new MinHeap();
  }

  addNum(num: number): void {
    // Always push to lo first (negate for max-heap behavior)
    this.lo.push(-num);

    // Ensure lo's max <= hi's min
    if (this.hi.size() > 0 && -this.lo.peek() > this.hi.peek()) {
      this.hi.push(-this.lo.pop());
    }

    // Balance sizes: lo can have at most 1 more than hi
    if (this.lo.size() > this.hi.size() + 1) {
      this.hi.push(-this.lo.pop());
    } else if (this.hi.size() > this.lo.size()) {
      this.lo.push(-this.hi.pop());
    }
  }

  findMedian(): number {
    if (this.lo.size() > this.hi.size()) return -this.lo.peek();
    return (-this.lo.peek() + this.hi.peek()) / 2;
  }
}

// === Test Cases ===
const mf = new MedianFinder();
mf.addNum(1);
console.log(mf.findMedian()); // 1
mf.addNum(2);
console.log(mf.findMedian()); // 1.5
mf.addNum(3);
console.log(mf.findMedian()); // 2
mf.addNum(4);
console.log(mf.findMedian()); // 2.5
mf.addNum(5);
console.log(mf.findMedian()); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                          | Relationship                   |
| ------------------------------------------------------------------------------------------------ | ------------------------------ |
| [Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream) | Single min-heap variant        |
| [Sliding Window Median](https://leetcode.com/problems/sliding-window-median)                     | Two heaps with removal         |
| [Find Median from Data Stream II](https://leetcode.com/problems/find-median-from-data-stream)    | Same problem                   |
| [IPO](https://leetcode.com/problems/ipo)                                                         | Two heaps for greedy selection |
| [Maximize Capital](https://leetcode.com/problems/ipo)                                            | Similar two-heap design        |
