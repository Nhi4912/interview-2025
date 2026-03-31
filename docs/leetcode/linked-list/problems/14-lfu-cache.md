---
layout: page
title: "LFU Cache"
difficulty: Hard
category: Linked-List
tags: [Hash Table, Linked List, Design, Doubly-Linked List]
leetcode_url: "https://leetcode.com/problems/lfu-cache"
---

# LFU Cache / Bộ Nhớ Cache LFU

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: HashMap + Doubly-Linked List per Frequency Bucket
> **Frequency**: 📘 Tier 2 — Gặp ở Google, Meta, Amazon; bài design kinh điển O(1) get/put
> **See also**: [LRU Cache](https://leetcode.com/problems/lru-cache) | [All O`one Data Structure](https://leetcode.com/problems/all-oone-data-structure)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng một thư viện có nhiều kệ sách, mỗi kệ chứa sách được mượn cùng số lần. Khi thêm sách mới vào kệ đầy, ta phải bỏ sách ít được mượn nhất (và cũ nhất nếu bằng nhau). Mỗi kệ là một danh sách LRU riêng.

- **Pattern Recognition:**
  - LFU = Least Frequently Used: evict item có frequency thấp nhất; nếu bằng → evict LRU trong nhóm đó
  - Cần O(1): `keyMap[key] → node`, `freqMap[freq] → DoublyLinkedList`, track `minFreq`
  - Khi `get/put` một key: tăng frequency, chuyển node từ `freqMap[f]` sang `freqMap[f+1]`

- **Visual — HashMap + Frequency Buckets:**

  ```
  keyMap:   {1: Node(val=1,freq=2), 2: Node(val=2,freq=1)}
  freqMap:  {1: [Node2], 2: [Node1]}
  minFreq:  1

  get(1): freq[1]→2, chuyển Node1: freqMap[2]→[Node1], freqMap[3]→[Node1]
          minFreq = 1 (Node2 vẫn ở freq=1)

  put(3, capacity=2): evict freqMap[minFreq=1].tail → bỏ Node2
                      thêm Node3 vào freqMap[1], minFreq=1
  ```

## Problem Description

Thiết kế cấu trúc dữ liệu LFU Cache với capacity cho trước. Mỗi `get(key)` trả về giá trị hoặc -1 và tăng frequency. Mỗi `put(key, value)` thêm/cập nhật key; khi đầy phải evict key có frequency thấp nhất (tie-break: LRU).

| Operations                   | Input      | Output                    |
| ---------------------------- | ---------- | ------------------------- |
| `put(1,1), put(2,2), get(1)` | capacity=2 | `1`                       |
| `put(3,3)`                   | —          | evict key=2 (freq=1, LRU) |
| `get(2), get(3)`             | —          | `-1`, `3`                 |

## 📝 Interview Tips

- 🇻🇳 Sự khác biệt LRU vs LFU: LRU = thời gian truy cập gần nhất; LFU = tổng số lần truy cập / 🇬🇧 _LRU evicts least recently used; LFU evicts least frequently used — very different eviction logic_
- 🇻🇳 Key trick: mỗi bucket tần suất là một danh sách LRU — khi tần suất bằng nhau ta evict đầu danh sách đó / 🇬🇧 _Each frequency bucket is itself an LRU list — evict from head of minFreq bucket_
- 🇻🇳 `minFreq` chỉ reset về 1 khi `put` key mới; `get` không bao giờ giảm minFreq / 🇬🇧 _minFreq only resets to 1 on new key insert; get/update never decreases minFreq_
- 🇻🇳 Capacity = 0 là edge case quan trọng — mọi put đều bị bỏ qua / 🇬🇧 _Capacity=0 edge case: all puts are no-ops_
- 🇻🇳 Cập nhật value của key đã tồn tại vẫn phải tăng frequency / 🇬🇧 _Updating an existing key still increments its frequency_

## Solutions

```typescript
/**
 * Solution 1: HashMap + Doubly-Linked List per Frequency Bucket — O(1) get/put
 *
 * Cấu trúc:
 *   keyMap[key]    → {val, freq, node trong DLL}
 *   freqMap[freq]  → DoublyLinkedList (head = MRU, tail = LRU)
 *   minFreq        → frequency thấp nhất hiện tại
 *
 * @time O(1) — tất cả get, put, evict đều O(1)
 * @space O(capacity) — keyMap + freqMap tổng cộng tối đa 2*capacity nodes
 */
class LFUCache {
  private capacity: number;
  private minFreq: number;
  private keyMap: Map<number, { val: number; freq: number; node: DLLNode }>;
  private freqMap: Map<number, DoublyLinkedList>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.minFreq = 0;
    this.keyMap = new Map();
    this.freqMap = new Map();
  }

  get(key: number): number {
    if (!this.keyMap.has(key)) return -1;
    const entry = this.keyMap.get(key)!;
    this.incrementFreq(key, entry);
    return entry.val;
  }

  put(key: number, value: number): void {
    if (this.capacity <= 0) return;

    if (this.keyMap.has(key)) {
      const entry = this.keyMap.get(key)!;
      entry.val = value;
      this.incrementFreq(key, entry);
      return;
    }

    // evict nếu đầy
    if (this.keyMap.size >= this.capacity) {
      const minList = this.freqMap.get(this.minFreq)!;
      const evicted = minList.removeLast();
      if (evicted) this.keyMap.delete(evicted.key);
    }

    // thêm node mới với freq=1
    const node = new DLLNode(key, value);
    this.keyMap.set(key, { val: value, freq: 1, node });
    if (!this.freqMap.has(1)) this.freqMap.set(1, new DoublyLinkedList());
    this.freqMap.get(1)!.addFirst(node);
    this.minFreq = 1;
  }

  private incrementFreq(key: number, entry: { val: number; freq: number; node: DLLNode }): void {
    const { freq, node } = entry;
    // xoá khỏi bucket freq cũ
    this.freqMap.get(freq)!.remove(node);
    if (this.freqMap.get(freq)!.size === 0) {
      this.freqMap.delete(freq);
      if (this.minFreq === freq) this.minFreq++;
    }
    // thêm vào bucket freq+1
    const newFreq = freq + 1;
    entry.freq = newFreq;
    if (!this.freqMap.has(newFreq)) this.freqMap.set(newFreq, new DoublyLinkedList());
    this.freqMap.get(newFreq)!.addFirst(node);
  }
}

class DLLNode {
  key: number;
  val: number;
  prev: DLLNode | null = null;
  next: DLLNode | null = null;
  constructor(key: number, val: number) {
    this.key = key;
    this.val = val;
  }
}

class DoublyLinkedList {
  private head: DLLNode; // sentinel head (MRU end)
  private tail: DLLNode; // sentinel tail (LRU end)
  size: number;

  constructor() {
    this.head = new DLLNode(-1, -1);
    this.tail = new DLLNode(-1, -1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.size = 0;
  }

  addFirst(node: DLLNode): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
    this.size++;
  }

  remove(node: DLLNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
    this.size--;
  }

  removeLast(): DLLNode | null {
    if (this.size === 0) return null;
    const last = this.tail.prev!;
    this.remove(last);
    return last;
  }
}

// Test
const lfu = new LFUCache(2);
lfu.put(1, 1);
lfu.put(2, 2);
console.log(lfu.get(1)); // 1  (freq[1]=2, freq[2]=1)
lfu.put(3, 3); // evict key=2 (minFreq=1, LRU in freq-1 bucket)
console.log(lfu.get(2)); // -1 (evicted)
console.log(lfu.get(3)); // 3
lfu.put(4, 4); // evict key=3 (minFreq=1)
console.log(lfu.get(1)); // 1
console.log(lfu.get(3)); // -1 (evicted)
console.log(lfu.get(4)); // 4
```

## 🔗 Related Problems

| Problem                                                                                | Pattern            | Difficulty |
| -------------------------------------------------------------------------------------- | ------------------ | ---------- |
| [146. LRU Cache](https://leetcode.com/problems/lru-cache)                              | HashMap + DLL      | 🟡 Medium  |
| [432. All O`one Data Structure](https://leetcode.com/problems/all-oone-data-structure) | Doubly-Linked List | 🔴 Hard    |
| [895. Maximum Frequency Stack](https://leetcode.com/problems/maximum-frequency-stack)  | HashMap + Stack    | 🔴 Hard    |
| [460. LFU Cache](https://leetcode.com/problems/lfu-cache)                              | Design             | 🔴 Hard    |
