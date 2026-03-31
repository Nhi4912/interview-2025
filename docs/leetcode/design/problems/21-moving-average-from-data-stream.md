---
layout: page
title: "Moving Average from Data Stream"
difficulty: Easy
category: Design
tags: [Array, Design, Queue, Data Stream]
leetcode_url: "https://leetcode.com/problems/moving-average-from-data-stream"
---

# Moving Average from Data Stream / Trung Bình Trượt Từ Luồng Dữ Liệu

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Queue / Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Design Front Middle Back Queue](https://leetcode.com/problems/design-front-middle-back-queue) | [Number of Recent Calls](https://leetcode.com/problems/number-of-recent-calls)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống băng chuyền sân bay có giới hạn `size` chỗ — khi thêm vali mới, nếu đầy thì vali cũ nhất bị đẩy ra. Tổng khối lượng luôn chỉ tính `size` vali gần nhất.

**Pattern Recognition:**

- Signal: "average of last k elements" + "data stream" → **Circular Queue / Sliding Window**
- Key insight: dùng queue có giới hạn size; khi full, dequeue phần tử cũ nhất và cập nhật running sum
- Tránh tính lại toàn bộ sum mỗi lần — dùng `windowSum += val - removed`

**Visual — MovingAverage(size=3):**

```
Stream:  1   10   3   5
Queue:  [1] [1,10] [1,10,3]  [10,3,5]  ← oldest falls off
Sum:     1    11     14        18
Avg:    1.0  5.5   4.667      6.0

next(5): queue full → remove 1, add 5
  sum = 14 - 1 + 5 = 18
  avg = 18 / 3 = 6.0
```

---

## Problem Description

Compute moving average of last `size` values from a data stream. ([LeetCode #346](https://leetcode.com/problems/moving-average-from-data-stream))

Difficulty: Easy | Acceptance: 79.9%

- `MovingAverage(size)` — init window of given size
- `next(val)` → average of last `size` values (or fewer if not enough yet)

**Example:**

```
m = MovingAverage(3)
m.next(1)  → 1.0       window=[1]
m.next(10) → 5.5       window=[1,10]
m.next(3)  → 4.667     window=[1,10,3]
m.next(5)  → 6.0       window=[10,3,5]  (1 removed)
```

Constraints: `1 ≤ size ≤ 1000`, `−10^5 ≤ val ≤ 10^5`, up to `10^4` calls

---

## 📝 Interview Tips

1. **Clarify**: "Cần average của đúng `size` phần tử hay tất cả phần tử đã nhận?" / Only last `size` elements
2. **Running sum**: "Đừng tính lại sum từ đầu mỗi lần — cập nhật incremental" / Maintain running sum, O(1) per call
3. **Queue eviction**: "Khi queue đầy, trừ phần tử cũ nhất khỏi sum trước khi thêm mới" / Dequeue oldest, update sum
4. **Circular buffer**: "Circular array với head/tail index hiệu quả hơn JS array shift()" / Array shift is O(n); circular is O(1)
5. **Edge case**: "Khi chưa đủ `size` phần tử, chia cho số phần tử thực tế" / Use `Math.min(count, size)` as divisor
6. **Follow-up**: "Weighted moving average? → thêm weight array và tính tổng có trọng số" / Weight each position differently

---

## Solutions

```typescript
/**
 * Solution 1: Queue with array shift (simple but O(n) shift)
 * Time: O(n) per next() due to array shift
 * Space: O(size)
 */
class MovingAverageSimple {
  private window: number[] = [];
  private sum = 0;

  constructor(private size: number) {}

  next(val: number): number {
    this.window.push(val);
    this.sum += val;
    if (this.window.length > this.size) {
      this.sum -= this.window.shift()!; // O(n) shift
    }
    return this.sum / this.window.length;
  }
}

/**
 * Solution 2: Circular Buffer (Optimal)
 * Time: O(1) per next() — fixed-size array, no shifting
 * Space: O(size) — circular array
 */
class MovingAverage {
  private buf: number[];
  private head = 0;
  private count = 0;
  private sum = 0;

  constructor(private size: number) {
    this.buf = new Array(size).fill(0);
  }

  next(val: number): number {
    // Evict oldest element if window is full
    if (this.count === this.size) {
      this.sum -= this.buf[this.head]; // remove oldest
    } else {
      this.count++;
    }

    this.buf[this.head] = val;
    this.sum += val;
    this.head = (this.head + 1) % this.size; // advance circular pointer

    return this.sum / this.count;
  }
}

// === Test Cases ===
const m = new MovingAverage(3);
console.log(m.next(1)); // 1.0
console.log(m.next(10)); // 5.5
console.log(m.next(3)); // 4.6666...
console.log(m.next(5)); // 6.0

const m2 = new MovingAverage(1);
console.log(m2.next(4)); // 4.0
console.log(m2.next(7)); // 7.0  (window size 1, only last val)

/**
 * Solution 3: Running sum with count (cleaner, array-based)
 * Time: O(1) per next()
 * Space: O(size)
 */
class MovingAverage3 {
  private q: number[] = [];
  private windowSum = 0;

  constructor(private size: number) {}

  next(val: number): number {
    this.q.push(val);
    this.windowSum += val;
    if (this.q.length > this.size) this.windowSum -= this.q[this.q.length - 1 - this.size];
    const len = Math.min(this.q.length, this.size);
    return this.windowSum / len;
  }
}
```

---

## 🔗 Related Problems

- [Number of Recent Calls](https://leetcode.com/problems/number-of-recent-calls) — queue-based sliding window
- [Design Front Middle Back Queue](https://leetcode.com/problems/design-front-middle-back-queue) — advanced queue design
- [Design Snake Game](https://leetcode.com/problems/design-snake-game) — queue for body tracking
- [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum) — sliding window with deque
- [Moving Average from Data Stream — LeetCode](https://leetcode.com/problems/moving-average-from-data-stream) — problem page
