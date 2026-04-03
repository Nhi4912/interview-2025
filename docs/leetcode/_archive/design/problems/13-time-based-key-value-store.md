---
layout: page
title: "Time Based Key-Value Store"
difficulty: Medium
category: Design
tags: [Hash Table, String, Binary Search, Design]
leetcode_url: "https://leetcode.com/problems/time-based-key-value-store"
---

# Time Based Key-Value Store / Kho Lưu Trữ Key-Value Theo Thời Gian

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: HashMap + Binary Search
> **Frequency**: ⭐ Tier 2 — Gặp ở 21+ companies

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống như xem lịch sử giá vé máy bay — mỗi ngày có một giá khác nhau. Khi hỏi "giá vào ngày X" mà không có giá chính xác, bạn muốn giá gần nhất _trước_ ngày X. Timestamps luôn tăng dần khi set → có thể binary search để tìm timestamp lớn nhất ≤ target.

**Pattern Recognition:**

- Signal: "key-value with timestamp" + "latest value at or before time t" → **HashMap + Binary Search**
- `set`: `map[key].push([timestamp, value])` — timestamps tăng dần → array tự nhiên sorted
- `get`: binary search trong `map[key]` tìm timestamp lớn nhất ≤ `timestamp`

**Visual — set("foo",1,"bar"), set("foo",2,"baz"), get("foo",1), get("foo",3):**

```
map = { "foo": [[1,"bar"], [2,"baz"]] }

get("foo", 1):
  Binary search in [[1,"bar"],[2,"baz"]] for timestamp ≤ 1
  → [1,"bar"] → return "bar" ✅

get("foo", 3):
  Binary search for timestamp ≤ 3
  [1,"bar"]: 1≤3 ✓  [2,"baz"]: 2≤3 ✓ → largest = [2,"baz"]
  → return "baz" ✅

get("foo", 0):
  No timestamp ≤ 0 → return "" ✅
```

---

## Problem Description

Thiết kế time-based key-value store với 2 operations: `set(key, value, timestamp)` lưu value tại timestamp, `get(key, timestamp)` trả về value của key tại timestamp lớn nhất ≤ timestamp cho trước. ([LeetCode 981](https://leetcode.com/problems/time-based-key-value-store))

Difficulty: Medium | Acceptance: 49.4%

```
Example:
  set("foo", "bar", 1)
  set("foo", "baz", 2)
  get("foo", 1)  → "bar"
  get("foo", 3)  → "baz"   (dùng timestamp=2, gần nhất ≤ 3)
  get("foo", 0)  → ""      (không có timestamp nào ≤ 0)
```

Constraints:

- `1 <= key.length, value.length <= 100`
- `1 <= timestamp <= 10^7`
- Timestamps của set() luôn tăng nghiêm ngặt
- At most `2 * 10^5` calls tổng cộng

---

## 📝 Interview Tips

1. **Clarify**: "Timestamps của set() có đảm bảo tăng không? — CÓ, quan trọng!" / Are set() timestamps strictly increasing? YES — this enables binary search
2. **Data structure**: "`Map<string, Array<[number, string]>>` — lưu cặp [timestamp, value]" / Map of key to sorted array of [timestamp, value] pairs
3. **Binary search target**: "Tìm index lớn nhất mà `arr[mid][0] <= timestamp`" / Find rightmost index where timestamp ≤ target
4. **Template**: "Upper-bound: lo=0, hi=arr.length-1, ans=-1. Nếu arr[mid][0]≤t → ans=mid, lo=mid+1" / Upper-bound template with result variable
5. **Not found**: "Nếu không có timestamp nào ≤ t → return `''`" / Return empty string if no valid timestamp found
6. **Follow-up**: "Nếu timestamps không sorted (random order)?" / What if timestamps aren't sorted? Need sorted insert or different structure

---

## Solutions

```typescript
/**
 * Solution 1: Linear Scan
 * Name: Brute Force Linear Get
 * set Time: O(1) | get Time: O(n) per query
 * Space: O(n)
 */
class TimeMapLinear {
  private store: Map<string, [number, string][]>;

  constructor() {
    this.store = new Map();
  }

  set(key: string, value: string, timestamp: number): void {
    if (!this.store.has(key)) this.store.set(key, []);
    this.store.get(key)!.push([timestamp, value]);
  }

  get(key: string, timestamp: number): string {
    const entries = this.store.get(key) ?? [];
    let result = "";
    for (const [ts, val] of entries) {
      if (ts <= timestamp) result = val;
    }
    return result;
  }
}

/**
 * Solution 2: HashMap + Binary Search  ← OPTIMAL
 * Name: Sorted Array + Binary Search
 * set Time: O(1) — append (timestamps are strictly increasing)
 * get Time: O(log n) — binary search
 * Space: O(n)
 */
class TimeMap {
  private store: Map<string, [number, string][]>;

  constructor() {
    this.store = new Map();
  }

  set(key: string, value: string, timestamp: number): void {
    if (!this.store.has(key)) this.store.set(key, []);
    this.store.get(key)!.push([timestamp, value]);
  }

  get(key: string, timestamp: number): string {
    const entries = this.store.get(key);
    if (!entries || entries.length === 0) return "";

    // Binary search: find rightmost timestamp <= given timestamp
    let lo = 0,
      hi = entries.length - 1,
      ans = -1;

    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (entries[mid][0] <= timestamp) {
        ans = mid; // valid — try to find a later one
        lo = mid + 1;
      } else {
        hi = mid - 1; // timestamp too large — go left
      }
    }

    return ans === -1 ? "" : entries[ans][1];
  }
}

// === Test Cases ===
const tm = new TimeMap();
tm.set("foo", "bar", 1);
tm.set("foo", "baz", 2);
console.log(tm.get("foo", 1)); // "bar"
console.log(tm.get("foo", 3)); // "baz"
console.log(tm.get("foo", 0)); // ""
tm.set("love", "high", 10);
tm.set("love", "low", 20);
console.log(tm.get("love", 5)); // ""
console.log(tm.get("love", 10)); // "high"
console.log(tm.get("love", 15)); // "high"
console.log(tm.get("love", 20)); // "low"
```

---

## 🔗 Related Problems

| Problem                                                                                    | Relationship                              |
| ------------------------------------------------------------------------------------------ | ----------------------------------------- |
| [Snapshot Array](https://leetcode.com/problems/snapshot-array)                             | Same pattern: binary search on timestamps |
| [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system) | HashMap-based design                      |
| [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree)   | HashMap design pattern                    |
| [Range Module](https://leetcode.com/problems/range-module)                                 | Binary search on sorted intervals         |
| [My Calendar I](https://leetcode.com/problems/my-calendar-i)                               | Binary search for time ranges             |
