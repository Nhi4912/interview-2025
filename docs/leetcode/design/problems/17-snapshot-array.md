---
layout: page
title: "Snapshot Array"
difficulty: Medium
category: Design
tags: [Array, Hash Table, Binary Search, Design]
leetcode_url: "https://leetcode.com/problems/snapshot-array"
---

# Snapshot Array / Mảng Có Lịch Sử Snapshot

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search + Design
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) | [Online Election](https://leetcode.com/problems/online-election)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống Git — không lưu toàn bộ mảng mỗi lần snapshot (quá tốn bộ nhớ), chỉ lưu **những thay đổi** (delta). Mỗi index có một danh sách `[snapId, value]`. Khi `get(index, snapId)`, binary search tìm snapId lớn nhất `≤ snapId`.

**Pattern Recognition:**

- Per-index history → `Array<[snapId, val]>[]`
- `get` = binary search for largest `snapId ≤ requested` → **upper bound - 1**

```
snap_id=0: set(0,5)  → arr[0]=[(0,5)]
snap()      → snap_id becomes 1
snap_id=1: set(0,6)  → arr[0]=[(0,5),(1,6)]
snap()      → snap_id becomes 2
get(0, 0)   → binary search in [(0,5),(1,6)] for snap≤0 → (0,5) → return 5
get(0, 1)   → binary search for snap≤1 → (1,6) → return 6
```

---

## Problem Description

Implement `SnapshotArray` with:

- `SnapshotArray(length)` — initialize array of given length with all 0s
- `set(index, val)` — set `arr[index] = val`
- `snap()` — take a snapshot, return the current `snap_id` (starts at 0, increments each call)
- `get(index, snap_id)` — return `arr[index]` at the time of the given snapshot

**Example:**

```
sa = new SnapshotArray(3)
sa.set(0, 5)
sa.snap()        → 0
sa.set(0, 6)
sa.get(0, 0)     → 5
sa.get(0, 1)     → 6  (snap 1 doesn't exist yet — returns last known = 6 at current snap)
```

**Constraints:** `1 ≤ length ≤ 5×10^4`, `0 ≤ val ≤ 10^9`, at most `5×10^4` calls

---

## 📝 Interview Tips

- 🇻🇳 **Không lưu toàn bộ mảng mỗi snap** — chỉ lưu delta (changed values) để tiết kiệm memory
- 🇬🇧 Never copy the full array per snapshot — store only changed `(snapId, value)` pairs per index
- 🇻🇳 `get` dùng **binary search upper_bound - 1**: tìm snapId lớn nhất ≤ requested snap_id
- 🇬🇧 `get` uses binary search: find the rightmost entry with `snapId ≤ target`
- 🇻🇳 Initialize mỗi index với `[(0, 0)]` để luôn có ít nhất 1 entry (snap 0, giá trị 0)
- 🇬🇧 Seed each index with `[[0, 0]]` so binary search always finds at least one baseline entry

---

## Solutions

### Solution 1: Per-Index History + Binary Search

```typescript
/**
 * Snapshot Array — per-index history with binary search retrieval
 * Time: set O(1), snap O(1), get O(log S) where S = number of snapshots for that index
 * Space: O(S_total) — total number of set calls across all indices
 */
class SnapshotArray {
  private history: Array<Array<[number, number]>>; // history[i] = [[snapId, val], ...]
  private snapId: number;

  constructor(length: number) {
    // Seed every index with (snapId=0, val=0) as baseline
    this.history = Array.from({ length }, () => [[0, 0]]);
    this.snapId = 0;
  }

  set(index: number, val: number): void {
    const h = this.history[index];
    // Overwrite if same snapId (avoid duplicates for this snap)
    if (h[h.length - 1][0] === this.snapId) {
      h[h.length - 1][1] = val;
    } else {
      h.push([this.snapId, val]);
    }
  }

  snap(): number {
    return this.snapId++;
  }

  get(index: number, snap_id: number): number {
    const h = this.history[index];
    // Binary search: find rightmost entry with snapId <= snap_id
    let lo = 0,
      hi = h.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (h[mid][0] <= snap_id) lo = mid;
      else hi = mid - 1;
    }
    return h[lo][1];
  }
}

const sa = new SnapshotArray(3);
sa.set(0, 5);
console.log(sa.snap()); // 0
sa.set(0, 6);
console.log(sa.get(0, 0)); // 5 (value at snap 0)
console.log(sa.snap()); // 1
console.log(sa.get(0, 1)); // 6

// Edge: get before any set
const sa2 = new SnapshotArray(2);
sa2.snap();
console.log(sa2.get(0, 0)); // 0 (default)
console.log(sa2.get(1, 0)); // 0
```

---

## 🔗 Related Problems

- [1146. Snapshot Array](https://leetcode.com/problems/snapshot-array) ← this
- [981. Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) — same pattern: timestamped get
- [699. Online Election](https://leetcode.com/problems/online-election) — binary search on timestamps
- [732. My Calendar III](https://leetcode.com/problems/my-calendar-iii) — interval versioning
- [307. Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable) — array with updates
