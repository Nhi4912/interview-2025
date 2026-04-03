---
layout: page
title: "Design HashMap"
difficulty: Easy
category: Linked-List
tags: [Array, Hash Table, Linked List, Design, Hash Function]
leetcode_url: "https://leetcode.com/problems/design-hashmap"
---

# Design HashMap / Thiết Kế HashMap

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Table / Chaining
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Design HashSet](https://leetcode.com/problems/design-hashset) | [LFU Cache](https://leetcode.com/problems/lfu-cache)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tủ hồ sơ với nhiều ngăn — mỗi key được hash vào một ngăn (bucket). Nếu nhiều key cùng ngăn, lưu thành danh sách liên kết (separate chaining). Tìm kiếm chỉ cần scan ngăn đó, không cần scan toàn bộ.

**Pattern Recognition:**

- Signal: "implement HashMap without built-in hash" → **Array of buckets + Chaining**
- Key insight: `hash(key) = key % BUCKET_SIZE`; mỗi bucket là một linked list của `(key, value)` pairs
- Load factor: với BUCKET_SIZE lớn (e.g. 1009 prime), collisions hiếm → O(1) average

**Visual — put(1,1), put(1001,2), get(1001):**

```
BUCKET_SIZE = 1000
hash(1)    = 1     → bucket[1]:  [(1,1)]
hash(1001) = 1     → bucket[1]:  [(1,1) → (1001,2)]  collision → chain
hash(2001) = 1     → bucket[1]:  [(1,1) → (1001,2) → (2001,3)]

get(1001):  bucket[1] → scan → find key=1001 → return 2
remove(1):  bucket[1] → scan → unlink (1,1) → [(1001,2) → (2001,3)]
```

---

## Problem Description

Implement a HashMap without using built-in hash table libraries. ([LeetCode #706](https://leetcode.com/problems/design-hashmap))

Difficulty: Easy | Acceptance: 65.9%

- `put(key, value)` — insert/update key-value pair
- `get(key)` → stored value, or `-1` if not found
- `remove(key)` — remove key if present

**Example:**

```
put(1, 1) → map: {1:1}
put(2, 2) → map: {1:1, 2:2}
get(1)    → 1
get(3)    → -1
put(2, 1) → map: {1:1, 2:1}  (update)
get(2)    → 1
remove(2) → map: {1:1}
get(2)    → -1
```

Constraints: `0 ≤ key, value ≤ 10^6`, up to `10^4` calls

---

## 📝 Interview Tips

1. **Clarify**: "Key range là gì? Có thể dùng array đơn giản không?" / key ≤ 10^6 → direct array viable; but chaining is more general
2. **Bucket count**: "Chọn BUCKET_SIZE là số nguyên tố (e.g. 1009) để phân bố đều hơn" / Prime size reduces clustering
3. **Chaining**: "Mỗi bucket là linked list — thêm dummy head để đơn giản hoá insert/delete" / Dummy head avoids null-check edge cases
4. **Update vs Insert**: "Trong put: scan bucket trước — nếu key tồn tại thì UPDATE, không append" / Must check existence before inserting
5. **Remove**: "Cần con trỏ `prev` để unlink node — dummy head rất hữu ích ở đây" / prev pointer needed for O(1) removal
6. **Follow-up**: "Dynamic resizing khi load factor cao? → rehash khi count/buckets > 0.75" / Real HashMaps rehash at ~75% load

---

## Solutions

```typescript
/**
 * Solution 1: Array of Linked Lists (Separate Chaining)
 * Time: O(1) average per operation (O(n/k) worst case with n keys, k buckets)
 * Space: O(n + k) — n entries across k buckets
 */
interface KVNode {
  key: number;
  val: number;
  next: KVNode | null;
}

class MyHashMap {
  private static BUCKET = 1009; // prime for better distribution
  private buckets: (KVNode | null)[];

  constructor() {
    this.buckets = new Array(MyHashMap.BUCKET).fill(null);
  }

  private hash(key: number): number {
    return key % MyHashMap.BUCKET;
  }

  put(key: number, value: number): void {
    const h = this.hash(key);
    if (this.buckets[h] === null) {
      this.buckets[h] = { key, val: value, next: null };
      return;
    }
    let cur = this.buckets[h]!;
    while (true) {
      if (cur.key === key) {
        cur.val = value;
        return;
      } // update
      if (cur.next === null) break;
      cur = cur.next;
    }
    cur.next = { key, val: value, next: null }; // append
  }

  get(key: number): number {
    let cur = this.buckets[this.hash(key)];
    while (cur !== null) {
      if (cur.key === key) return cur.val;
      cur = cur.next;
    }
    return -1;
  }

  remove(key: number): void {
    const h = this.hash(key);
    if (this.buckets[h] === null) return;

    // Use dummy head to simplify head removal
    const dummy: KVNode = { key: -1, val: -1, next: this.buckets[h] };
    let prev = dummy,
      cur = this.buckets[h];
    while (cur !== null) {
      if (cur.key === key) {
        prev.next = cur.next;
        break;
      }
      prev = cur;
      cur = cur.next;
    }
    this.buckets[h] = dummy.next;
  }
}

// === Test Cases ===
const hm = new MyHashMap();
hm.put(1, 1);
hm.put(2, 2);
console.log(hm.get(1)); // 1
console.log(hm.get(3)); // -1
hm.put(2, 1); // update
console.log(hm.get(2)); // 1
hm.remove(2);
console.log(hm.get(2)); // -1

// Collision test (keys with same hash)
hm.put(0, 10);
hm.put(1009, 20); // hash(0)==hash(1009) with BUCKET=1009
console.log(hm.get(0)); // 10
console.log(hm.get(1009)); // 20
hm.remove(0);
console.log(hm.get(0)); // -1
console.log(hm.get(1009)); // 20 (still there)

/**
 * Solution 2: Direct Array (simple, works for small key range)
 * Time: O(1) all operations
 * Space: O(max_key) — 10^6+1 entries
 */
class MyHashMapDirect {
  private data: number[];
  constructor() {
    this.data = new Array(10 ** 6 + 1).fill(-1);
  }
  put(key: number, value: number): void {
    this.data[key] = value;
  }
  get(key: number): number {
    return this.data[key];
  }
  remove(key: number): void {
    this.data[key] = -1;
  }
}
```

---

## 🔗 Related Problems

- [Design HashSet](https://leetcode.com/problems/design-hashset) — simpler: only key, no value
- [LFU Cache](https://leetcode.com/problems/lfu-cache) — advanced HashMap-based design
- [Snapshot Array](https://leetcode.com/problems/snapshot-array) — array design with versioning
- [Two Sum](https://leetcode.com/problems/two-sum) — classic HashMap application
- [Design HashMap — LeetCode](https://leetcode.com/problems/design-hashmap) — problem page
