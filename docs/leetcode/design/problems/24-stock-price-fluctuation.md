---
layout: page
title: "Stock Price Fluctuation"
difficulty: Medium
category: Design
tags: [Hash Table, Design, Heap (Priority Queue), Data Stream, Ordered Set]
leetcode_url: "https://leetcode.com/problems/stock-price-fluctuation"
---

# Stock Price Fluctuation / Biến Động Giá Cổ Phiếu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap / Priority Queue + HashMap
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Design a Food Rating System](https://leetcode.com/problems/design-a-food-rating-system) | [Design Movie Rental System](https://leetcode.com/problems/design-movie-rental-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bảng điện tử chứng khoán — giá có thể được cập nhật (sửa lỗi) theo timestamp. Cần lấy current/max/min nhanh. Trick: dùng lazy deletion trong heap để bỏ qua giá trị cũ.

**Pattern Recognition:**

- Signal: "track max/min" + "updates can overwrite past values" → **HashMap + Lazy Heap**
- Key insight: HashMap lưu `timestamp → price` (hỗ trợ update); max/min heap với lazy deletion xử lý stale entries
- `current()` = giá tại timestamp cao nhất → lưu `latestTimestamp` riêng

**Visual — update + lazy deletion:**

```
update(1, 10): map={1:10}, maxHeap=[(10,1)], minHeap=[(10,1)], latest=1
update(1, 5):  map={1:5},  maxHeap=[(10,1),(5,1)], minHeap=[(5,1),(10,1)], latest=1
               ↑ stale (10,1) still in heap!

maximum(): peek maxHeap → (10,1); map[1]=5 ≠ 10 → STALE, pop
           peek maxHeap → (5,1);  map[1]=5 == 5  → VALID → return 5

current(): map[latestTimestamp] = map[1] = 5  → return 5
```

---

## Problem Description

Track stock prices with correction support. ([LeetCode #2034](https://leetcode.com/problems/stock-price-fluctuation))

Difficulty: Medium | Acceptance: 48.2%

- `update(timestamp, price)` — record/correct price at timestamp
- `current()` → price at maximum timestamp
- `maximum()` → highest price among all timestamps
- `minimum()` → lowest price among all timestamps

**Example:**

```
update(1, 10) → current()=10, max=10, min=10
update(2, 5)  → current()=5,  max=10, min=5
update(1, 3)  → current()=5,  max=5,  min=3  (timestamp 1 corrected!)
update(4, 2)  → current()=2,  max=5,  min=2
maximum()     → 5
minimum()     → 2
current()     → 2
```

Constraints: `1 ≤ timestamp, price ≤ 10^9`, up to `10^5` calls

---

## 📝 Interview Tips

1. **Clarify**: "Timestamp có thể được cập nhật nhiều lần không?" / Yes, same timestamp can be corrected
2. **Lazy deletion**: "Không xoá từ heap ngay khi update — đánh dấu stale và bỏ qua khi peek" / Lazy heap avoids expensive removal
3. **current()**: "Không phải giá gần nhất thêm vào, mà là giá tại timestamp MAX" / Track max timestamp, not insertion order
4. **JS heap**: "JS không có built-in heap — dùng mảng sorted hoặc implement MinHeap class" / Must implement heap or use sorted structure
5. **SortedMap alternative**: "Dùng TreeMap (Java)/SortedSet nếu ngôn ngữ hỗ trợ — O(log n) mà không cần lazy" / Language-native ordered maps simplify this
6. **Follow-up**: "Nếu cần range query (min/max trong khoảng timestamp)? → Segment tree" / Range queries need segment tree

---

## Solutions

```typescript
/**
 * Helper: MinHeap implementation for TypeScript
 */
class MinHeap {
  private data: [number, number][] = []; // [price, timestamp]

  push(item: [number, number]): void {
    this.data.push(item);
    this._bubbleUp(this.data.length - 1);
  }

  peek(): [number, number] {
    return this.data[0];
  }

  pop(): [number, number] {
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  get size() {
    return this.data.length;
  }

  private _bubbleUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[p][0] <= this.data[i][0]) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }

  private _sinkDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let min = i,
        l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this.data[l][0] < this.data[min][0]) min = l;
      if (r < n && this.data[r][0] < this.data[min][0]) min = r;
      if (min === i) break;
      [this.data[min], this.data[i]] = [this.data[i], this.data[min]];
      i = min;
    }
  }
}

/**
 * Solution 1: HashMap + Lazy Max/Min Heap
 * Time: O(log n) update; O(log n) amortized maximum/minimum; O(1) current
 * Space: O(n) — heap may accumulate stale entries but bounded by total updates
 */
class StockPrice {
  private priceMap = new Map<number, number>(); // timestamp → price
  private latestTs = 0;
  private maxHeap: MinHeap; // stores [-price, timestamp] to simulate max-heap
  private minHeap: MinHeap; // stores [price, timestamp]

  constructor() {
    this.maxHeap = new MinHeap();
    this.minHeap = new MinHeap();
  }

  update(timestamp: number, price: number): void {
    this.priceMap.set(timestamp, price);
    if (timestamp >= this.latestTs) this.latestTs = timestamp;
    // Push to both heaps; stale entries handled lazily
    this.maxHeap.push([-price, timestamp]);
    this.minHeap.push([price, timestamp]);
  }

  current(): number {
    return this.priceMap.get(this.latestTs)!;
  }

  maximum(): number {
    // Pop stale entries until top matches current map value
    while (true) {
      const [negPrice, ts] = this.maxHeap.peek();
      if (this.priceMap.get(ts) === -negPrice) return -negPrice;
      this.maxHeap.pop();
    }
  }

  minimum(): number {
    while (true) {
      const [price, ts] = this.minHeap.peek();
      if (this.priceMap.get(ts) === price) return price;
      this.minHeap.pop();
    }
  }
}

// === Test Cases ===
const sp = new StockPrice();
sp.update(1, 10);
sp.update(2, 5);
console.log(sp.current()); // 5  (latest ts=2)
console.log(sp.maximum()); // 10
console.log(sp.minimum()); // 5
sp.update(1, 3); // correct ts=1: was 10, now 3
console.log(sp.maximum()); // 5  (stale 10 evicted)
console.log(sp.minimum()); // 3
sp.update(4, 2);
console.log(sp.current()); // 2  (latest ts=4)
console.log(sp.maximum()); // 5
console.log(sp.minimum()); // 2

/**
 * Solution 2: HashMap + sorted Map (simpler, no lazy deletion needed)
 * Time: O(log n) all operations using JS Map iteration (or TreeMap in Java)
 * Space: O(n)
 * Note: JS Map preserves insertion order, not sorted — this uses a sorted array trick
 */
class StockPrice2 {
  private priceMap = new Map<number, number>();
  private priceCount = new Map<number, number>(); // price → frequency
  private latestTs = 0;

  update(timestamp: number, price: number): void {
    if (this.priceMap.has(timestamp)) {
      const old = this.priceMap.get(timestamp)!;
      const cnt = this.priceCount.get(old)! - 1;
      cnt === 0 ? this.priceCount.delete(old) : this.priceCount.set(old, cnt);
    }
    this.priceMap.set(timestamp, price);
    this.priceCount.set(price, (this.priceCount.get(price) ?? 0) + 1);
    if (timestamp >= this.latestTs) this.latestTs = timestamp;
  }

  current(): number {
    return this.priceMap.get(this.latestTs)!;
  }
  maximum(): number {
    return Math.max(...this.priceCount.keys());
  }
  minimum(): number {
    return Math.min(...this.priceCount.keys());
  }
}

const sp2 = new StockPrice2();
sp2.update(1, 10);
sp2.update(2, 5);
sp2.update(1, 3);
console.log(sp2.maximum()); // 5
console.log(sp2.minimum()); // 3
```

---

## 🔗 Related Problems

- [Design a Food Rating System](https://leetcode.com/problems/design-a-food-rating-system) — lazy heap with HashMap
- [Design Movie Rental System](https://leetcode.com/problems/design-movie-rental-system) — multi-key sorted structure
- [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream) — dual-heap technique
- [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum) — monotonic deque for running max
- [Stock Price Fluctuation — LeetCode](https://leetcode.com/problems/stock-price-fluctuation) — problem page
