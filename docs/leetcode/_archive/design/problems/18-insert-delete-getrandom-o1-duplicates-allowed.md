---
layout: page
title: "Insert Delete GetRandom O(1) - Duplicates allowed"
difficulty: Hard
category: Design
tags: [Array, Hash Table, Math, Design, Randomized]
leetcode_url: "https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed"
---

# Insert Delete GetRandom O(1) - Duplicates allowed / Thêm Xóa Lấy Ngẫu Nhiên O(1) Cho Phép Trùng

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Design (Array + HashMap)
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Insert Delete GetRandom O(1)](https://leetcode.com/problems/insert-delete-getrandom-o1) | [Random Pick Index](https://leetcode.com/problems/random-pick-index)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống version khó hơn của bài cùng tên không trùng — thêm Map từ `val → Set<indices>`. Khi xóa, đổi phần tử cần xóa với phần tử cuối mảng (swap-and-pop), rồi cập nhật cả hai trong Map.

**Pattern Recognition:**

- O(1) random → dùng array (index by position)
- O(1) insert/delete → dùng map (`val → Set<array indices>`)
- Delete trick: **swap với phần tử cuối** → pop, update map

```
insert(1): arr=[1],     map={1:{0}}
insert(1): arr=[1,1],   map={1:{0,1}}
insert(2): arr=[1,1,2], map={1:{0,1}, 2:{2}}
remove(1): pick any index of 1 → say idx=1
  swap arr[1] with arr[2] (last): arr=[1,2,1]
  pop: arr=[1,2], update map={1:{0}, 2:{1}}
getRandom(): random from arr=[1,2]
```

---

## Problem Description

Design a data structure that supports all following operations in **average O(1)**:

- `insert(val)` — insert a value. Return `true` if not present before, `false` if already existed.
- `remove(val)` — remove **one** occurrence of `val`. Return `true` if present, `false` if not.
- `getRandom()` — return a **random** element with probability proportional to its frequency.

**Example:**

```
rc.insert(1)  → true
rc.insert(1)  → false  (already exists)
rc.insert(2)  → true
rc.getRandom() → 1 or 2 (1 has 2x probability)
rc.remove(1)  → true
rc.getRandom() → 1 or 2 (equal probability now)
```

**Constraints:** `-2^31 ≤ val ≤ 2^31 - 1`, at most `2×10^5` calls

---

## 📝 Interview Tips

- 🇻🇳 **Khác bài không trùng**: Map lưu `Set<index>` thay vì `index` để quản lý nhiều vị trí
- 🇬🇧 Key difference from no-duplicate version: Map stores `Set<indices>` to track all positions
- 🇻🇳 **Swap-and-pop xóa O(1)**: lấy 1 index của `val` từ Set, swap với `arr[last]`, cập nhật cả hai trong map
- 🇬🇧 Delete in O(1): take one index from `val`'s set, swap with last array element, update both entries in map
- 🇻🇳 **Cẩn thận edge case**: nếu `val === lastVal` (xóa phần tử là chính phần tử cuối), không cần thêm lại
- 🇬🇧 Edge case: if `val === lastVal` (deleting the last element itself), skip the re-insert step for `lastVal`

---

## Solutions

### Solution 1: Array + Map of Sets

```typescript
/**
 * RandomizedCollection supporting duplicates, all operations O(1) average
 * Time: insert O(1), remove O(1), getRandom O(1)
 * Space: O(N) N = number of elements currently in collection
 */
class RandomizedCollection {
  private arr: number[];
  private map: Map<number, Set<number>>; // val → set of indices in arr

  constructor() {
    this.arr = [];
    this.map = new Map();
  }

  insert(val: number): boolean {
    const isNew = !this.map.has(val) || this.map.get(val)!.size === 0;
    if (!this.map.has(val)) this.map.set(val, new Set());
    this.map.get(val)!.add(this.arr.length);
    this.arr.push(val);
    return isNew;
  }

  remove(val: number): boolean {
    if (!this.map.has(val) || this.map.get(val)!.size === 0) return false;

    // Pick any index of val (use first from Set iterator)
    const removeIdx = this.map.get(val)!.values().next().value as number;
    const lastIdx = this.arr.length - 1;
    const lastVal = this.arr[lastIdx];

    // Swap removeIdx with last
    this.arr[removeIdx] = lastVal;

    // Update map for lastVal: remove lastIdx, add removeIdx (unless same element)
    this.map.get(lastVal)!.delete(lastIdx);
    if (removeIdx !== lastIdx) {
      this.map.get(lastVal)!.add(removeIdx);
    }

    // Remove val's index
    this.map.get(val)!.delete(removeIdx);

    this.arr.pop();
    return true;
  }

  getRandom(): number {
    const idx = Math.floor(Math.random() * this.arr.length);
    return this.arr[idx];
  }
}

// Test
const rc = new RandomizedCollection();
console.log(rc.insert(1)); // true (new)
console.log(rc.insert(1)); // false (duplicate)
console.log(rc.insert(2)); // true
// getRandom: 1 with prob 2/3, 2 with prob 1/3
console.log(rc.remove(1)); // true
// After remove: arr has [1,2], getRandom: 50/50

// Edge: remove last element
const rc2 = new RandomizedCollection();
rc2.insert(0);
rc2.insert(1);
rc2.remove(0);
console.log(rc2.insert(2)); // true
console.log(rc2.getRandom()); // 1 or 2
console.log(rc2.remove(2)); // true
console.log(rc2.getRandom()); // 1
```

---

## 🔗 Related Problems

- [381. Insert Delete GetRandom O(1) - Duplicates allowed](https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed) ← this
- [380. Insert Delete GetRandom O(1)](https://leetcode.com/problems/insert-delete-getrandom-o1) — same without duplicates
- [398. Random Pick Index](https://leetcode.com/problems/random-pick-index) — random from duplicate indices
- [528. Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight) — weighted random
- [706. Design HashMap](https://leetcode.com/problems/design-hashmap) — custom hash map
