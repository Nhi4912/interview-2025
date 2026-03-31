---
layout: page
title: "Design Memory Allocator"
difficulty: Medium
category: Design
tags: [Array, Hash Table, Design, Simulation]
leetcode_url: "https://leetcode.com/problems/design-memory-allocator"
---

# Design Memory Allocator / Thiết Kế Bộ Cấp Phát Bộ Nhớ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Design / Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Simple Bank System](https://leetcode.com/problems/simple-bank-system) | [Design Snake Game](https://leetcode.com/problems/design-snake-game)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bãi đỗ xe dãy dài — khi xe (mID) cần đậu `size` chỗ liên tiếp, tìm dãy trống đầu tiên đủ dài. Khi xe rời, giải phóng tất cả chỗ của xe đó.

**Pattern Recognition:**

- Signal: "contiguous allocation" + "free by ID" → **Array Simulation**
- Key insight: dùng array `mem[i]` = 0 (free) hoặc mID; scan từ trái để tìm block trống liên tiếp
- Constraints nhỏ (n ≤ 1000, ≤ 1000 calls) → O(n) per op là chấp nhận được

**Visual — allocate(4, 1) then allocate(3, 2) then free(1):**

```
n=10, initial: [0,0,0,0,0,0,0,0,0,0]

allocate(4,1): find 4 consecutive 0s starting idx 0 ✅
  mem: [1,1,1,1,0,0,0,0,0,0]  → returns 0

allocate(3,2): find 3 consecutive 0s starting idx 4 ✅
  mem: [1,1,1,1,2,2,2,0,0,0]  → returns 4

allocate(10,3): need 10 free → only 3 available ❌
  → returns -1

free(1): clear all cells with value 1
  mem: [0,0,0,0,2,2,2,0,0,0]  → returns 4

allocate(3,3): find 3 consecutive 0s starting idx 0 ✅
  mem: [3,3,3,0,2,2,2,0,0,0]  → returns 0
```

---

## Problem Description

Design a memory allocator with `n` contiguous blocks. ([LeetCode #2502](https://leetcode.com/problems/design-memory-allocator))

Difficulty: Medium | Acceptance: 48.4%

- `Allocator(n)` — initialize `n` free memory blocks (0-indexed)
- `allocate(size, mID)` → allocate `size` consecutive free blocks, assign `mID`; return leftmost index, or `-1` if impossible
- `freeMemory(mID)` → free all blocks with `mID`; return count of freed blocks

**Example:**

```
Allocator(10)
allocate(1, 1) → 0   mem: [1,0,0,0,0,0,0,0,0,0]
allocate(1, 2) → 1   mem: [1,2,0,0,0,0,0,0,0,0]
allocate(1, 3) → 2
allocate(1, 4) → 3
allocate(1, 5) → 4
allocate(1, 6) → 5
allocate(1, 1) → 6   (mID=1 again, two separate blocks)
allocate(1, 1) → 7
allocate(1, 1) → 8
freeMemory(1)  → 4   (freed indices 0,6,7,8)
allocate(1, 1) → 0
```

Constraints: `1 ≤ n, size, mID ≤ 1000`, up to `1000` calls

---

## 📝 Interview Tips

1. **Clarify**: "Allocation là contiguous blocks? Free là theo mID không phân biệt vị trí?" / Yes: contiguous allocate, free all by mID
2. **Linear scan**: "n ≤ 1000 → O(n) scan per allocate OK; không cần interval tree" / Small constraints allow brute-force
3. **First-fit**: "Tìm block đầu tiên đủ size — đếm streak, reset khi gặp occupied cell" / Classic first-fit strategy
4. **Free by mID**: "Scan toàn bộ array, reset cell về 0 nếu cell == mID" / Single pass, count freed cells
5. **Multiple mID**: "Cùng mID có thể có nhiều blocks rời rạc — freeMemory giải phóng tất cả" / mID can be reused
6. **Follow-up**: "n lớn? → interval tree hoặc segment tree với lazy propagation" / Large n needs O(log n) per op

---

## Solutions

```typescript
/**
 * Solution 1: Array simulation — first-fit allocation
 * Time: O(n) allocate, O(n) freeMemory — n ≤ 1000, acceptable
 * Space: O(n) — mem array
 */
class Allocator {
  private mem: number[];

  constructor(n: number) {
    this.mem = new Array(n).fill(0); // 0 = free
  }

  /** Find leftmost run of `size` consecutive free cells; assign mID */
  allocate(size: number, mID: number): number {
    let streak = 0;
    for (let i = 0; i < this.mem.length; i++) {
      if (this.mem[i] === 0) {
        streak++;
        if (streak === size) {
          // Fill backwards from i
          const start = i - size + 1;
          for (let j = start; j <= i; j++) this.mem[j] = mID;
          return start;
        }
      } else {
        streak = 0; // reset on occupied cell
      }
    }
    return -1; // not enough contiguous space
  }

  /** Free all blocks with mID; return count freed */
  freeMemory(mID: number): number {
    let freed = 0;
    for (let i = 0; i < this.mem.length; i++) {
      if (this.mem[i] === mID) {
        this.mem[i] = 0;
        freed++;
      }
    }
    return freed;
  }
}

// === Test Cases ===
const alloc = new Allocator(10);
console.log(alloc.allocate(1, 1)); // 0
console.log(alloc.allocate(1, 2)); // 1
console.log(alloc.allocate(1, 3)); // 2
console.log(alloc.allocate(1, 4)); // 3
console.log(alloc.allocate(1, 5)); // 4
console.log(alloc.allocate(1, 6)); // 5
console.log(alloc.allocate(1, 1)); // 6
console.log(alloc.allocate(1, 1)); // 7
console.log(alloc.allocate(1, 1)); // 8
console.log(alloc.freeMemory(1)); // 4  (freed 0,6,7,8)
console.log(alloc.allocate(1, 1)); // 0

/**
 * Solution 2: With streak-start tracking (avoids backward fill)
 * Time: O(n) allocate, O(n) freeMemory
 * Space: O(n)
 */
class Allocator2 {
  private mem: number[];

  constructor(n: number) {
    this.mem = new Array(n).fill(0);
  }

  allocate(size: number, mID: number): number {
    let start = -1,
      streak = 0;
    for (let i = 0; i <= this.mem.length; i++) {
      if (i < this.mem.length && this.mem[i] === 0) {
        if (streak === 0) start = i;
        streak++;
        if (streak === size) {
          this.mem.fill(mID, start, start + size);
          return start;
        }
      } else {
        streak = 0;
        start = -1;
      }
    }
    return -1;
  }

  freeMemory(mID: number): number {
    return this.mem.reduce((cnt, v, i) => {
      if (v === mID) {
        this.mem[i] = 0;
        return cnt + 1;
      }
      return cnt;
    }, 0);
  }
}

const a2 = new Allocator2(5);
console.log(a2.allocate(2, 10)); // 0
console.log(a2.allocate(2, 20)); // 2
console.log(a2.allocate(2, 30)); // -1 (only 1 free)
console.log(a2.freeMemory(10)); // 2
console.log(a2.allocate(2, 30)); // 0
```

---

## 🔗 Related Problems

- [Simple Bank System](https://leetcode.com/problems/simple-bank-system) — validate-then-mutate design
- [Design Snake Game](https://leetcode.com/problems/design-snake-game) — stateful simulation
- [Design HashMap](https://leetcode.com/problems/design-hashmap) — array-backed design
- [Snapshot Array](https://leetcode.com/problems/snapshot-array) — array design with versioning
- [Design Memory Allocator — LeetCode](https://leetcode.com/problems/design-memory-allocator) — problem page
