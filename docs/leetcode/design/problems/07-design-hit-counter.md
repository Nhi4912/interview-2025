---
layout: page
title: "Design Hit Counter"
difficulty: Medium
category: Design
tags: [Array, Binary Search, Design, Queue]
leetcode_url: "https://leetcode.com/problems/design-hit-counter/"
---

# Design Hit Counter / Thiết Kế Bộ Đếm Lượt Truy Cập

> **Track**: Backend | **Difficulty**: 🟡 Medium | **Pattern**: Circular Buffer / Queue
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [LRU Cache](./01-lru-cache.md) | [Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy nghĩ đến máy đếm khách vào cửa hàng: bạn chỉ quan tâm lượt vào trong 5 phút gần nhất. Cách đơn giản nhất là xếp hàng (queue) — mỗi lượt vào là một số; khi hỏi "bao nhiêu người trong 5 phút qua?", bạn nhìn vào đầu hàng và đuổi những số hết hạn ra. Cách tối ưu hơn: chia 300 ô nhỏ (1 ô/giây), cứ đến giây mới thì ghi đè ô cũ — như kim đồng hồ quét vòng tròn.

**Pattern Recognition:**

- Signal: "count events in past N seconds", "timestamp monotonically increasing" → **Circular Buffer (N buckets)**
- Queue approach: O(1) hit, O(k) getHits (k = expired entries) — simple, unlimited memory
- Circular buffer: O(1) both; fixed O(300) space regardless of total hits — production-grade

**Visual — Queue approach, ops: hit(1), hit(2), hit(3), hit(300), getHits(301):**

```
hit(1)       → queue: [1]
hit(2)       → queue: [1, 2]
hit(3)       → queue: [1, 2, 3]
hit(300)     → queue: [1, 2, 3, 300]
getHits(301): expire ts <= 301-300=1 → pop 1 → queue: [2, 3, 300] → return 3 ✅
```

**Visual — Circular buffer, slot = timestamp % 300:**

```
hit(1)   → slot[1 % 300 = 1]:   {ts:1,   count:1}
hit(300) → slot[300 % 300 = 0]: {ts:300, count:1}
hit(301) → slot[301 % 300 = 1]: ts(1) ≠ 301 → overwrite → {ts:301, count:1}
getHits(301): sum slots where 301 - ts < 300
  slot[0]: 301 - 300 = 1  < 300 ✅ → +1
  slot[1]: 301 - 301 = 0  < 300 ✅ → +1
  total = 2
```

---

## Problem Description

Design a hit counter that counts hits received in the **past 5 minutes (300 seconds)**. Timestamps are always increasing.

```
ops:   ["HitCounter","hit","hit","hit","getHits","hit","getHits","getHits"]
args:  [[],          [1],  [2],  [3],  [4],      [300],[300],    [301]]
out:   [null,        null, null, null, 3,         null, 4,        3]
```

Constraints:

- `1 <= timestamp <= 2 * 10^9`
- Calls are chronological (monotonically increasing timestamps)
- At most 300 calls total to `hit` and `getHits`

---

## 📝 Interview Tips

1. **Clarify**: Multiple hits at same timestamp? / Có thể có nhiều hit cùng 1 timestamp không?
2. **Brute force**: Queue — push timestamp on `hit`; on `getHits`, trim expired entries, return `queue.length`. Simple, works perfectly for interview.
3. **Optimize**: Circular buffer of 300 slots — O(1) time, O(300) fixed space. Better for high-throughput systems.
4. **Edge cases**: `getHits` at timestamp = ts + 300 → that hit is expired (`ts <= timestamp - 300`). Off-by-one: `<=` not `<`.
5. **Follow-up**: Timestamps out of order? Distributed counters across servers? → need different architecture (sliding window log, Redis).

---

## Solutions

```typescript

/**

- Solution 1: Queue (Brute Force — clear interview starting point)
- Time: O(1) hit, O(n) getHits amortized — each ts evicted at most once
- Space: O(n) — stores every hit timestamp
  */
  class HitCounterQueue {
  private queue: number[] = [];

hit(timestamp: number): void {
this.queue.push(timestamp);
}

getHits(timestamp: number): number {
// Remove hits older than 300 seconds
while (this.queue.length > 0 && this.queue[0] <= timestamp - 300) {
this.queue.shift();
}
return this.queue.length;
}
}

/**

- Solution 2: Circular Buffer (Optimal)
- Time: O(1) hit, O(300) = O(1) getHits — fixed loop
- Space: O(300) = O(1) — independent of total hit count
  */
  class HitCounter {
  private timestamps = new Array(300).fill(0);
  private counts = new Array(300).fill(0);

hit(timestamp: number): void {
const slot = timestamp % 300;
if (this.timestamps[slot] !== timestamp) {
this.timestamps[slot] = timestamp; // new second: claim this slot
this.counts[slot] = 1;
} else {
this.counts[slot]++; // same second: accumulate
}
}

getHits(timestamp: number): number {
let total = 0;
for (let i = 0; i < 300; i++) {
if (timestamp - this.timestamps[i] < 300) {
total += this.counts[i];
}
}
return total;
}
}

// === Test Cases ===
const hc = new HitCounter();
hc.hit(1); hc.hit(2); hc.hit(3);
console.log(hc.getHits(4)); // 3
hc.hit(300);
console.log(hc.getHits(300)); // 4
console.log(hc.getHits(301)); // 3 (timestamp 1 is now expired)

```

---

## 🔗 Related Problems

- [LRU Cache](./01-lru-cache.md) — classic design problem with eviction policy
- [Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream/) — sliding window on stream
- [Logger Rate Limiter](https://leetcode.com/problems/logger-rate-limiter/) — timestamp-based deduplication
- [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/) — binary search on timestamps
