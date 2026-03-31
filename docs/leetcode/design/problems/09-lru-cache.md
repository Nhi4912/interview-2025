---
layout: page
title: "LRU Cache"
difficulty: Medium
category: Design
tags: [Design, Hash Table, Doubly Linked List]
leetcode_url: "https://leetcode.com/problems/lru-cache/"
---

# LRU Cache / Bộ Nhớ Đệm LRU

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: HashMap + Doubly Linked List
> **Frequency**: 🔥 Tier 1 — Classic design problem, gặp ở mọi FAANG
> **See also**: [LFU Cache](https://leetcode.com/problems/lfu-cache/) | [Design Hit Counter](./07-design-hit-counter.md) | [All O(1) Data Structures](https://leetcode.com/problems/all-oone-data-structure/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bàn làm việc có 5 chỗ. Mỗi lần lấy tài liệu → đặt lên đầu bàn (most recently used). Khi bàn đầy và cần chỗ mới → bỏ tài liệu cuối bàn (least recently used). **HashMap** = tìm tài liệu O(1). **Doubly Linked List** = di chuyển lên đầu/bỏ cuối O(1).

**Pattern:** O(1) get + O(1) put → cần cả HashMap AND Doubly Linked List. Một mình HashMap không đủ (không track order). Một mình List không đủ (O(n) lookup).

**Visual:**

```
Capacity = 3. Operations: put(1), put(2), put(3), get(1), put(4)

After put(1,1): HEAD ↔ [1] ↔ TAIL
After put(2,2): HEAD ↔ [2] ↔ [1] ↔ TAIL   (newest at head)
After put(3,3): HEAD ↔ [3] ↔ [2] ↔ [1] ↔ TAIL
After get(1):   HEAD ↔ [1] ↔ [3] ↔ [2] ↔ TAIL   (1 moved to front)
After put(4,4): HEAD ↔ [4] ↔ [1] ↔ [3] ↔ TAIL   (2 evicted — LRU)
                                              ↑ 2 removed (tail)
```

---

## Problem Description

**LeetCode #146.** Design a data structure that follows LRU (Least Recently Used) cache constraints.

- `get(key)` → return value if exists, else -1. Mark as recently used.
- `put(key, value)` → insert/update. If capacity exceeded, evict LRU key.
- Both operations must be **O(1)**.

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **Nói data structure choice trước** — "HashMap for O(1) lookup + DLL for O(1) order updates; neither alone is sufficient"
2. **Dummy head/tail trick** — sentinel nodes eliminate edge cases khi insert/remove tại boundary
3. **JS Map shortcut** — JS `Map` duy trì insertion order → delete + re-insert = move-to-MRU, viết nhanh trong interview
4. **get cũng cập nhật order** — nhiều candidates quên `moveToHead` trong `get`, chỉ làm trong `put`
5. **Eviction là remove tail.prev** — không phải `tail` (vì tail là sentinel/dummy)
6. **Follow-up** — LFU Cache (#460): thêm frequency counter, dùng min-heap hoặc doubly-nested map

---

## Solutions

```typescript
// Solution 1: JavaScript Map (elegant, O(1) amortized) ← USE THIS IN INTERVIEW
// JS Map preserves insertion order → delete+re-insert = move to MRU
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
this.cache.delete(key); // remove
this.cache.set(key, value); // re-insert at end = most recently used
return value;
}

put(key: number, value: number): void {
if (this.cache.has(key)) {
this.cache.delete(key);
} else if (this.cache.size >= this.capacity) {
// first key = least recently used
this.cache.delete(this.cache.keys().next().value!);
}
this.cache.set(key, value);
}
}

// Solution 2: HashMap + Doubly Linked List (classic, truly O(1)) ← EXPLAIN INTERNALS
class ListNode {
key: number; val: number;
prev: ListNode | null = null;
next: ListNode | null = null;
constructor(key = 0, val = 0) { this.key = key; this.val = val; }
}

class LRUCacheClassic {
private cap: number;
private map: Map<number, ListNode>;
private head: ListNode; // dummy MRU sentinel
private tail: ListNode; // dummy LRU sentinel

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
this.insertFront(node); // move to MRU
return node.val;
}

put(key: number, value: number): void {
if (this.map.has(key)) {
this.remove(this.map.get(key)!);
} else if (this.map.size >= this.cap) {
const lru = this.tail.prev!; // evict LRU
this.remove(lru);
this.map.delete(lru.key);
}
const node = new ListNode(key, value);
this.insertFront(node);
this.map.set(key, node);
}
}
```

---

## 🔗 Related Problems

| #    | Problem                                                                               | Difficulty | Pattern       |
| ---- | ------------------------------------------------------------------------------------- | ---------- | ------------- |
| 460  | [LFU Cache](https://leetcode.com/problems/lfu-cache/)                                 | 🔴 Hard    | HashMap + DLL |
| 362  | [Design Hit Counter](https://leetcode.com/problems/design-hit-counter/)               | 🟡 Medium  | Queue / Deque |
| 432  | [All O(1) Data Structures](https://leetcode.com/problems/all-oone-data-structure/)    | 🔴 Hard    | HashMap + DLL |
| 1396 | [Design Underground System](https://leetcode.com/problems/design-underground-system/) | 🟡 Medium  | HashMap       |
