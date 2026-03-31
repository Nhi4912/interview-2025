---
layout: page
title: "All O`one Data Structure"
difficulty: Hard
category: Linked-List
tags: [Hash Table, Linked List, Design, Doubly-Linked List]
leetcode_url: "https://leetcode.com/problems/all-oone-data-structure"
---

# All O`one Data Structure / Cấu Trúc Dữ Liệu All-O(1)

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Doubly Linked List + HashMap
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [LFU Cache](https://leetcode.com/problems/lfu-cache) | [Design Authentication Manager](https://leetcode.com/problems/design-authentication-manager)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như bảng xếp hạng âm nhạc — mỗi "cấp độ" (frequency) là một hàng, trong hàng có nhiều bài hát (keys). Tăng một bài → chuyển lên hàng trên. Giảm → chuyển xuống. Min/Max → đọc hàng đầu/cuối. Tất cả O(1).

**Pattern Recognition:**

- Signal: "O(1) getMin/getMax" + "dynamic counts" → **Doubly Linked List of frequency buckets**
- Mỗi Bucket = một count value + Set of keys với count đó; list sorted tăng dần theo count
- HashMap key→count biết key đang ở bucket nào; HashMap count→Bucket truy cập O(1)
- Dummy head/tail làm sentinels → không cần check null khi insert/delete

**Visual — Bucket structure:**

```
dummy_min ↔ [cnt=1 {a,b}] ↔ [cnt=3 {c}] ↔ dummy_max

inc("a"):  a moves from cnt=1 → cnt=2 (new bucket created)
dummy_min ↔ [cnt=1 {b}] ↔ [cnt=2 {a}] ↔ [cnt=3 {c}] ↔ dummy_max

getMinKey() → head.next.keys → "b"
getMaxKey() → tail.prev.keys → "c"
```

---

## Problem Description

Design a data structure supporting `inc(key)`, `dec(key)`, `getMaxKey()`, `getMinKey()` all in O(1). ([LeetCode #432](https://leetcode.com/problems/all-oone-data-structure))

Difficulty: Hard | Acceptance: 44.1%

- `inc(key)`: insert key at count 1, or increment existing count by 1
- `dec(key)`: decrement count; remove key if count reaches 0
- `getMaxKey()` / `getMinKey()`: return any key with max/min count; `""` if empty

Constraints:

- `1 ≤ key.length ≤ 10`, lowercase English letters
- At most `5×10⁴` calls; `dec` only called on existing keys

---

## 📝 Interview Tips

1. **Clarify**: "getMax/Min có thể trả về bất kỳ key nào với giá trị đó không?" / Can we return any key with that max/min count?
2. **Brute force**: "HashMap key→count + scan all entries O(n) for min/max" / Too slow for large inputs
3. **Key insight**: "Maintain list sorted by count — then min/max is O(1) head/tail read" / Sorted structure enables O(1) extremes
4. **Bucket design**: "Mỗi bucket = một count + Set của keys; list = sorted by count tăng dần" / Each bucket holds one count level
5. **Insert/Delete**: "Khi freq tăng, move key sang bucket count+1 (tạo mới nếu chưa có)" / Move between adjacent buckets
6. **Empty bucket**: "Bucket rỗng phải bị xóa khỏi list ngay" / Remove empty buckets to keep list clean

---

## Solutions

```typescript
/**
 * Solution: Doubly Linked List of Frequency Buckets + HashMaps
 * Time: O(1) — all four operations
 * Space: O(n) — n unique keys across all buckets
 */
class Bucket {
  count: number;
  keys: Set<string>;
  prev: Bucket | null = null;
  next: Bucket | null = null;
  constructor(count: number) {
    this.count = count;
    this.keys = new Set();
  }
}

class AllOne {
  private keyCount = new Map<string, number>();
  private countBucket = new Map<number, Bucket>();
  private head: Bucket; // dummy min sentinel
  private tail: Bucket; // dummy max sentinel

  constructor() {
    this.head = new Bucket(0);
    this.tail = new Bucket(Infinity);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private insertAfter(prev: Bucket, b: Bucket): void {
    b.prev = prev;
    b.next = prev.next;
    prev.next!.prev = b;
    prev.next = b;
  }

  private removeBucket(b: Bucket): void {
    b.prev!.next = b.next;
    b.next!.prev = b.prev;
    this.countBucket.delete(b.count);
  }

  inc(key: string): void {
    const old = this.keyCount.get(key) ?? 0;
    const nw = old + 1;
    this.keyCount.set(key, nw);
    if (!this.countBucket.has(nw)) {
      const prev = old === 0 ? this.head : this.countBucket.get(old)!;
      const nb = new Bucket(nw);
      this.insertAfter(prev, nb);
      this.countBucket.set(nw, nb);
    }
    this.countBucket.get(nw)!.keys.add(key);
    if (old > 0) {
      const ob = this.countBucket.get(old)!;
      ob.keys.delete(key);
      if (ob.keys.size === 0) this.removeBucket(ob);
    }
  }

  dec(key: string): void {
    const old = this.keyCount.get(key)!;
    const nw = old - 1;
    if (nw === 0) this.keyCount.delete(key);
    else {
      this.keyCount.set(key, nw);
      if (!this.countBucket.has(nw)) {
        const prev = this.countBucket.get(old)!.prev!;
        const nb = new Bucket(nw);
        this.insertAfter(prev, nb);
        this.countBucket.set(nw, nb);
      }
      this.countBucket.get(nw)!.keys.add(key);
    }
    const ob = this.countBucket.get(old)!;
    ob.keys.delete(key);
    if (ob.keys.size === 0) this.removeBucket(ob);
  }

  getMaxKey(): string {
    if (this.tail.prev === this.head) return "";
    return this.tail.prev!.keys.values().next().value as string;
  }

  getMinKey(): string {
    if (this.head.next === this.tail) return "";
    return this.head.next!.keys.values().next().value as string;
  }
}

// === Test Cases ===
const obj = new AllOne();
obj.inc("a");
obj.inc("b");
obj.inc("b");
obj.inc("c");
obj.inc("c");
obj.inc("c");
console.log(obj.getMaxKey()); // "c"
console.log(obj.getMinKey()); // "a"
obj.dec("c");
obj.dec("c");
console.log(obj.getMaxKey()); // "b" or "c" (both count=1... wait "b"=2, "c"=1)

const obj2 = new AllOne();
obj2.inc("hello");
obj2.inc("hello");
console.log(obj2.getMaxKey()); // "hello"
console.log(obj2.getMinKey()); // "hello"
obj2.dec("hello");
console.log(obj2.getMinKey()); // "hello"
```

---

## 🔗 Related Problems

- [LFU Cache](https://leetcode.com/problems/lfu-cache) — same frequency-bucket doubly linked list idea
- [LRU Cache](https://leetcode.com/problems/lru-cache) — doubly linked list for O(1) eviction
- [Design Authentication Manager](https://leetcode.com/problems/design-authentication-manager) — time-based key tracking
- [Design HashMap](https://leetcode.com/problems/design-hashmap) — hash table fundamentals
- [First Unique Character in a String](https://leetcode.com/problems/first-unique-character-in-a-string) — frequency + ordering
