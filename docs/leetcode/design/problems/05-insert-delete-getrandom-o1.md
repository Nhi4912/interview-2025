---
layout: page
title: "Insert Delete GetRandom O(1)"
difficulty: Medium
category: Design
tags: [Array, Hash Table, Math, Design, Randomized]
leetcode_url: "https://leetcode.com/problems/insert-delete-getrandom-o1/"
leetcode_number: 380
pattern: "HashMap + Array for O(1) Random"
frequency_tier: 2
companies: [Amazon, Google, Meta, Lyft]
target_time_minutes: 25
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Insert Delete GetRandom O(1) / Chèn Xóa Lấy Ngẫu Nhiên O(1)

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: HashMap + Array
> **Frequency**: ⭐ Tier 2 — Gặp ~45% interviews
> **See also**: [LRU Cache](./09-lru-cache.md) | [Min Stack](./01-min-stack.md) | [Shuffle an Array](./02-shuffle-an-array.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy nghĩ đến cái trống xổ số: bạn cần thêm/xóa vé trong O(1) và quay ngẫu nhiên trong O(1). Xóa từ giữa mảng tốn O(n) vì phải dịch chuyển. Trick: **hoán đổi vé cần xóa với vé cuối cùng**, rồi xóa vé cuối (luôn O(1)). HashMap lưu vị trí từng vé để tìm chúng ngay lập tức.

**Pattern Recognition:**

- Signal: "design", "O(1) insert/delete/getRandom" → **HashMap + Array hybrid** — neither alone achieves all three
- Array → O(1) random index access for `getRandom`; HashMap → O(1) lookup for `remove`
- The key trick: swap-with-last-then-pop avoids O(n) array shifting on deletion

**Visual — insert(1), insert(2), insert(3), remove(2):**

```
After insert(1), insert(2), insert(3):
  arr = [1,  2,  3]
  map = {1:0, 2:1, 3:2}

remove(2):
  idx  = map[2] = 1
  last = arr[2]  = 3

  Swap arr[idx] ← last:   arr = [1, 3, 3]
  Update map[last] ← idx: map = {1:0, 3:1, 2:1}

  Pop arr:    arr = [1, 3]
  Delete map[2]:  map = {1:0, 3:1}

getRandom(): random index in [0,1] → returns 1 or 3 ✅
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| When you see... | Think... | Template | Time target |
|---|---|---|---|
| Insert/delete/getRandom all O(1) required | HashMap for O(1) lookup + Array for O(1) random access — neither structure alone can do all three | HashMap stores val→index; Array stores values; swap-delete keeps array dense | < 5 min to recognize |
| "Design a set/collection with random access" | The bottleneck is O(1) delete from a random position — solved by swap-with-last trick | `arr[idx] = arr[last]; map[last] = idx; arr.pop(); map.delete(val)` | < 15 min to code |
| Follow-up: "allow duplicates" (LC 381) | Store all indices per value in a Set; on delete, remove one index, update the set | `map: val → Set<index>`; pick any index from set to swap | < 25 min total |

**Memory hook:** "Random = array; fast lookup = map; delete O(1) = swap với cuối rồi pop" — ba vai trò, hai cấu trúc.

---

## Problem Description

Implement `RandomizedSet` class with three average O(1) operations:

- `insert(val)` → returns `true` if val was not already present
- `remove(val)` → returns `true` if val was present
- `getRandom()` → returns a uniformly random element (set is guaranteed non-empty)

```
Example:
  insert(1) → true,  insert(2) → true,  remove(2) → true
  insert(2) → true,  getRandom() → 1 or 2
  remove(1) → true,  insert(2) → false (already exists)
  getRandom() → 2
```

Constraints:

- -2^31 <= val <= 2^31 - 1
- At most 2×10^5 calls; getRandom only called when set is non-empty

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

> **U — Understand:** "We need a data structure supporting insert, remove, and getRandom — all in average O(1). Insert returns false if duplicate, remove returns false if not found, getRandom must be truly uniform. Can I assume getRandom is never called on an empty set, as the constraints state?"

> **M — Match:** "This is a classic design problem where no single data structure achieves all three operations in O(1). HashMap gives O(1) insert/remove/lookup but getRandom is O(n) since we'd need to iterate. Array gives O(1) getRandom via random index but remove is O(n) for the shift. The key insight: combine both, and use the swap-with-last trick to make deletion O(1)."

> **P — Plan:** "Maintain two structures: an array `arr` of values, and a HashMap `map` from value to its index in `arr`. Insert: push to array, record index in map. Remove: look up index in map, swap that element with the last element, update map for the swapped element, pop array, delete from map. getRandom: pick a random index in [0, arr.length-1]."

> **I — Implement:** "For remove, one edge case: if we're deleting the last element, the self-swap is harmless — we update map[last]=idx which is the same entry, then pop and delete. This avoids a conditional branch. Let me code the class... `map: Map<number,number>`, `arr: number[]`, then the three methods as described."

> **R — Review & E — Evaluate:** "Tracing insert(1,2,3) then remove(2): arr=[1,2,3], map={1:0,2:1,3:2}. idx=1, last=3. arr[1]=3 → arr=[1,3,3]. map[3]=1. arr.pop() → arr=[1,3]. map.delete(2) → map={1:0,3:1}. getRandom picks index 0 or 1, returns 1 or 3. Correct. All three operations are O(1) amortized. Space O(n) for both structures."

---

## 📝 Interview Tips

1. **Clarify**: What if insert is called with an existing value? What if remove is called on missing value? / Insert trùng trả false hay throw? Remove phần tử không tồn tại?
2. **Brute force**: Array only — insert O(1), getRandom O(1), but remove needs `indexOf` = O(n). Fails requirement / Chỉ dùng mảng: xóa O(n) vì cần tìm vị trí.
3. **Key insight**: Swap target element with last element before popping → O(1) delete without shifting / Trick: hoán đổi với cuối rồi pop — mảng luôn compact.
4. **Edge cases**: Removing the last element (idx === arr.length-1) — self-swap is harmless but must still pop and delete from map / Xóa phần tử cuối: tự hoán đổi với chính nó, vẫn đúng.
5. **Follow-up**: Insert Delete GetRandom with duplicates (LC 381) → store all indices per value in a Set / Cho phép trùng lặp: mỗi value lưu danh sách index.

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| Mistake | Why it's wrong | Fix |
|---|---|---|
| Using only a Set or HashMap for getRandom | `Set` has no O(1) random index access — you must iterate or convert to array, making it O(n) | Maintain a separate array alongside the map; array index gives O(1) random element access |
| Deleting from middle of array without swap trick | Naive `splice(idx, 1)` shifts all elements after idx — O(n) time, defeats the purpose | Swap target with last element, then `arr.pop()` — pop is always O(1), no shifting needed |
| Not updating HashMap after swap | After swap, the element that moved from the end to `idx` still has its old index in the map — stale reference causes wrong deletions later | Always do `map.set(last, idx)` before `map.delete(val)`; order matters when `val === last` |

---

## Solutions

```typescript

/**

- Solution 1: Array Only (Brute Force)
- insert: O(1) amortized
- remove: O(n) — must scan to find index ← does NOT meet requirement
- getRandom: O(1)
  */
  class RandomizedSetBrute {
  private arr: number[] = [];

insert(val: number): boolean {
if (this.arr.includes(val)) return false; // O(n) check
this.arr.push(val);
return true;
}

remove(val: number): boolean {
const idx = this.arr.indexOf(val); // O(n) ← bottleneck
if (idx === -1) return false;
this.arr.splice(idx, 1); // O(n) shift
return true;
}

getRandom(): number {
return this.arr[Math.floor(Math.random() * this.arr.length)];
}
}

/**

- Solution 2: HashMap + Array with Swap-to-Delete (Optimal)
- insert: O(1) — push to array + map update
- remove: O(1) — swap with last, pop, update map
- getRandom: O(1) — random index into dense array
  */
  class RandomizedSet {
  private map: Map<number, number> = new Map(); // val → array index
  private arr: number[] = [];

insert(val: number): boolean {
if (this.map.has(val)) return false;
this.arr.push(val);
this.map.set(val, this.arr.length - 1);
return true;
}

remove(val: number): boolean {
if (!this.map.has(val)) return false;
const idx = this.map.get(val)!;
const last = this.arr[this.arr.length - 1];

    // Overwrite slot with last element (handles self-swap when idx = last)
    this.arr[idx] = last;
    this.map.set(last, idx);

    // Shrink array and remove deleted value from map
    this.arr.pop();
    this.map.delete(val);
    return true;

}

getRandom(): number {
return this.arr[Math.floor(Math.random() * this.arr.length)];
}
}

// === Test Cases ===
const rs = new RandomizedSet();
console.log(rs.insert(1)); // true (set={1})
console.log(rs.remove(2)); // false (2 not present)
console.log(rs.insert(2)); // true (set={1,2})
console.log(rs.insert(2)); // false (duplicate)
console.log(rs.remove(1)); // true (set={2})
console.log(rs.getRandom()); // 2 (only element)

```

---

## 🔗 Related Problems

- [LRU Cache](./09-lru-cache.md) — same HashMap + auxiliary structure design pattern
- [Shuffle an Array](./02-shuffle-an-array.md) — same random index access concept on arrays
- [Min Stack](./01-min-stack.md) — design problem achieving O(1) for additional operation
- [Insert Delete GetRandom O(1) — Duplicates Allowed](https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed/) — harder variant where each value may appear multiple times

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric | Target | My result |
|---|---|---|
| Time to solve | ≤ 25 min | \_\_\_ min |
| Recognized pattern | ≤ 3 min | \_\_\_ min |
| Implemented swap-delete correctly | No O(n) ops | [ ] Yes [ ] No |
| Handled self-swap edge case | idx === last | [ ] Yes [ ] No |
| Explained all three O(1) operations | Clearly | [ ] Yes [ ] No |

**SRS Schedule:**

- First solve → review in 1 day
- Correct (shaky) → review in 3 days
- Correct (confident) → review in 7 days
- Mastered → review in 14 days

**Review Log:**

| Date | Result | Notes |
|---|---|---|
| \_\_\_\_ | ⬜ unsolved / 🟡 hint needed / 🟢 solved | |
