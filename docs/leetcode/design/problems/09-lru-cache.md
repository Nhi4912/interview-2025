---
layout: page
title: "LRU Cache"
difficulty: Medium
category: Design
tags: [Design, Hash Table, Doubly Linked List]
leetcode_url: "https://leetcode.com/problems/lru-cache/"
leetcode_number: 146
pattern: "HashMap + Doubly Linked List"
frequency_tier: 1
companies: [Amazon, Meta, Google, Microsoft, Apple]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# LRU Cache / Bộ Nhớ Đệm LRU

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: HashMap + Doubly Linked List
> **Frequency**: 🔥 Tier 1 — Classic design problem, gặp ở mọi FAANG
> **Target**: ⏱️ 20 min | **Companies**: Amazon, Meta, Google, Microsoft, Apple
> **See also**: [LFU Cache](https://leetcode.com/problems/lfu-cache/) | [Design Hit Counter](./07-design-hit-counter.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bàn làm việc có 5 chỗ. Mỗi lần lấy tài liệu → đặt lên đầu bàn (most recently used). Bàn đầy → bỏ tài liệu cuối bàn (least recently used). **HashMap** = tìm O(1). **DLL** = di chuyển lên đầu/bỏ cuối O(1).

**Pattern Recognition:**

- Signal: "O(1) get + O(1) put with eviction order" → **HashMap + Doubly Linked List**
- HashMap alone: no order. List alone: O(n) lookup. Combined: O(1) for both

**Visual — Capacity=3, ops: put(1), put(2), put(3), get(1), put(4):**

```
put(1,1): HEAD ↔ [1] ↔ TAIL
put(2,2): HEAD ↔ [2] ↔ [1] ↔ TAIL
put(3,3): HEAD ↔ [3] ↔ [2] ↔ [1] ↔ TAIL
get(1):   HEAD ↔ [1] ↔ [3] ↔ [2] ↔ TAIL   (1 moved to front)
put(4,4): HEAD ↔ [4] ↔ [1] ↔ [3] ↔ TAIL   (2 evicted — LRU)
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                    |
| ---------------- | --------------------------------------------------------------------------- |
| **When you see** | "O(1) get/put", "cache with eviction", "least recently used"                |
| **Think**        | HashMap + DLL — map for O(1) lookup, DLL for O(1) order manipulation        |
| **Template**     | `map.get(key) → remove(node) → insertFront(node); evict: remove(tail.prev)` |
| **Time target**  | ⏱️ 20 min (Medium)                                                          |

> 💡 **Memory hook / Móc nhớ:** "Bàn làm việc: HashMap là mục lục, DLL là chồng giấy — tìm nhanh, xếp nhanh"

---

## Problem Description

Design a data structure that follows LRU cache constraints:

- `get(key)` → return value if exists, else -1. Mark as recently used.
- `put(key, value)` → insert/update. If capacity exceeded, evict LRU key.
- Both operations must be **O(1)**.

```
Example: cap=2, put(1,1), put(2,2), get(1)→1, put(3,3), get(2)→-1 (evicted)
```

Constraints:

- 1 <= capacity <= 3000; 0 <= key, value <= 10⁴; at most 2 × 10⁵ calls

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "So I need O(1) get and put, with LRU eviction when capacity is full.
> get also counts as 'using' the key — it should move to most recently used.
> Clarification: put on existing key updates the value and refreshes its position?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "For O(1) lookup I need a HashMap. For O(1) order tracking, a Doubly Linked List.
> Head = MRU, tail = LRU. Dummy sentinels eliminate edge cases.
> HashMap maps key → node for direct access. Should I code this?"

### Step 3 — Implement / Viết Code (5-7 min)

> "ListNode class with key, val, prev, next.
> LRUCache has map, head/tail sentinels.
> Helpers: remove(node) and insertFront(node). get/put use these."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace: cap=2. put(1,1)→[1]. put(2,2)→[2,1]. get(1)→move [1] front→[1,2], return 1.
> put(3,3): evict [2], add→[3,1]. get(2)→-1. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(1) for both. Space: O(capacity). Edge cases: get missing key; capacity=1.
> Follow-up: LFU Cache — frequency counter, much harder."

---

## 📝 Interview Tips

1. **Explain choice**: "HashMap for O(1) lookup + DLL for O(1) order — neither alone suffices"
2. **Dummy sentinels**: Head/tail dummies eliminate boundary edge cases
3. **JS Map shortcut**: `Map` preserves insertion order → delete + re-insert = move-to-MRU
4. **get updates order**: Many forget `moveToHead` in `get`, only do it in `put`

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                     | Why Wrong / Tại sao sai                             | Fix / Cách sửa                                     |
| --- | ------------------------------------- | --------------------------------------------------- | -------------------------------------------------- |
| 1   | Forget to update order in `get()`     | get must also refresh the key as "recently used"    | Always `remove(node) + insertFront(node)` in get   |
| 2   | Evict `tail` instead of `tail.prev`   | `tail` is a dummy sentinel, not an actual entry     | Evict `tail.prev`, then `map.delete(lru.key)`      |
| 3   | Forget to delete from map on eviction | Map grows unbounded, stale keys return wrong values | Always `map.delete(evictedNode.key)` when evicting |

---

## Solutions

```typescript
// Solution 1: JavaScript Map (elegant, O(1) amortized) ← Interview shortcut
class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;
  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) this.cache.delete(this.cache.keys().next().value!);
    this.cache.set(key, value);
  }
}

// Solution 2: HashMap + Doubly Linked List (classic, truly O(1))
class ListNode {
  key: number;
  val: number;
  prev: ListNode | null = null;
  next: ListNode | null = null;
  constructor(key = 0, val = 0) {
    this.key = key;
    this.val = val;
  }
}

class LRUCacheClassic {
  private cap: number;
  private map: Map<number, ListNode>;
  private head: ListNode; // MRU sentinel
  private tail: ListNode; // LRU sentinel

  constructor(capacity: number) {
    this.cap = capacity;
    this.map = new Map();
    this.head = new ListNode();
    this.tail = new ListNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private remove(node: ListNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private insertFront(node: ListNode): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  get(key: number): number {
    const node = this.map.get(key);
    if (!node) return -1;
    this.remove(node);
    this.insertFront(node);
    return node.val;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) this.remove(this.map.get(key)!);
    else if (this.map.size >= this.cap) {
      const lru = this.tail.prev!;
      this.remove(lru);
      this.map.delete(lru.key);
    }
    const node = new ListNode(key, value);
    this.insertFront(node);
    this.map.set(key, node);
  }
}

// === Test Cases ===
const c = new LRUCache(2);
c.put(1, 1);
c.put(2, 2);
console.log(c.get(1)); // 1
c.put(3, 3);
console.log(c.get(2)); // -1 (evicted)
```

---

## 🔗 Related Problems

- [LFU Cache](https://leetcode.com/problems/lfu-cache/) — frequency-based eviction
- [Design Hit Counter](./07-design-hit-counter.md) — queue/deque pattern

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 20 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
