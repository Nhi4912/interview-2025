---
layout: page
title: "Logger Rate Limiter"
difficulty: Easy
category: Design
tags: [Hash Table, Design, Data Stream]
leetcode_url: "https://leetcode.com/problems/logger-rate-limiter"
---

# Logger Rate Limiter / Bộ Giới Hạn Tốc Độ Logger

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Design (HashMap)
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Stock Price Fluctuation](https://leetcode.com/problems/stock-price-fluctuation) | [Design Hit Counter](https://leetcode.com/problems/design-hit-counter)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bộ lọc spam — ghi nhớ lần cuối bạn thấy mỗi tin nhắn. Nếu tin nhắn xuất hiện lại trong vòng 10 giây, chặn lại; ngược lại cho qua và cập nhật thời điểm.

**Pattern Recognition:**

- Rate limiting per message → `Map<message, lastTimestamp>`
- Allow if `timestamp - lastSeen >= 10`, else block

```
t=1,  msg="foo" → lastSeen={}       → PRINT, store {foo:1}
t=2,  msg="bar" → lastSeen={foo:1}  → PRINT, store {foo:1,bar:2}
t=3,  msg="foo" → foo lastSeen=1, 3-1=2 < 10 → BLOCK
t=11, msg="foo" → foo lastSeen=1, 11-1=10 >= 10 → PRINT, update {foo:11}
```

---

## Problem Description

Design a logger system that receives a stream of `(timestamp, message)` pairs. A message should be **printed** if it has not been printed in the last 10 seconds (i.e., `currentTime - lastPrintedTime >= 10`). Return `true` if the message should print, `false` otherwise.

**Example:**

```
logger.shouldPrintMessage(1, "foo")  → true
logger.shouldPrintMessage(2, "bar")  → true
logger.shouldPrintMessage(3, "foo")  → false
logger.shouldPrintMessage(8, "bar")  → false
logger.shouldPrintMessage(10, "foo") → false
logger.shouldPrintMessage(11, "foo") → true
```

**Constraints:** `0 ≤ timestamp ≤ 10^9`, up to `10^4` calls, timestamps non-decreasing

---

## 📝 Interview Tips

- 🇻🇳 **HashMap đơn giản** đủ dùng — `message → lastPrintTime`, O(1) per query
- 🇬🇧 Simple HashMap is optimal — store `message → lastAllowedTime`, O(1) lookup & update
- 🇻🇳 Follow-up: nếu message cũ không cần thiết → dùng **sliding window** (deque) để giới hạn memory
- 🇬🇧 Follow-up memory concern: use a queue/deque to expire old messages and bound memory to O(window)
- 🇻🇳 **Cập nhật khi nào?** Chỉ update `lastSeen` khi message được in (return true)
- 🇬🇧 Only update the stored timestamp when message is **allowed** (return true), not on every call

---

## Solutions

### Solution 1: HashMap — O(1) per call

```typescript
/**
 * Rate limiter: allow a message if not seen in the past 10 seconds
 * Time: O(1) per shouldPrintMessage call
 * Space: O(M) M = number of unique messages seen
 */
class Logger {
  private lastPrint: Map<string, number>;

  constructor() {
    this.lastPrint = new Map();
  }

  shouldPrintMessage(timestamp: number, message: string): boolean {
    const last = this.lastPrint.get(message) ?? -Infinity;
    if (timestamp - last >= 10) {
      this.lastPrint.set(message, timestamp);
      return true;
    }
    return false;
  }
}

const logger = new Logger();
console.log(logger.shouldPrintMessage(1, "foo")); // true
console.log(logger.shouldPrintMessage(2, "bar")); // true
console.log(logger.shouldPrintMessage(3, "foo")); // false
console.log(logger.shouldPrintMessage(8, "bar")); // false
console.log(logger.shouldPrintMessage(10, "foo")); // false
console.log(logger.shouldPrintMessage(11, "foo")); // true
```

### Solution 2: Sliding Window (Bounded Memory)

```typescript
/**
 * Logger with bounded memory: expire entries older than 10s
 * Useful when there are millions of unique messages but only recent ones matter
 * Time: O(1) amortized (each message enters/exits queue once)
 * Space: O(W) W = unique messages within any 10-second window
 */
class LoggerBounded {
  private lastPrint: Map<string, number> = new Map();
  private queue: Array<[number, string]> = []; // [timestamp, message]

  shouldPrintMessage(timestamp: number, message: string): boolean {
    // Expire entries older than 10 seconds
    while (this.queue.length && timestamp - this.queue[0][0] >= 10) {
      const [, msg] = this.queue.shift()!;
      // Only delete if the stored time is the old one (not updated)
      if (this.lastPrint.get(msg)! <= timestamp - 10) {
        this.lastPrint.delete(msg);
      }
    }
    const last = this.lastPrint.get(message) ?? -Infinity;
    if (timestamp - last >= 10) {
      this.lastPrint.set(message, timestamp);
      this.queue.push([timestamp, message]);
      return true;
    }
    return false;
  }
}

const lb = new LoggerBounded();
console.log(lb.shouldPrintMessage(1, "foo")); // true
console.log(lb.shouldPrintMessage(11, "foo")); // true  (10s elapsed)
console.log(lb.shouldPrintMessage(12, "foo")); // false (only 1s since t=11)
```

---

## 🔗 Related Problems

- [359. Logger Rate Limiter](https://leetcode.com/problems/logger-rate-limiter) ← this
- [362. Design Hit Counter](https://leetcode.com/problems/design-hit-counter) — count hits in last 300s
- [981. Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) — timestamp keyed storage
- [703. Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream) — data stream design
- [933. Number of Recent Calls](https://leetcode.com/problems/number-of-recent-calls) — sliding window queue
