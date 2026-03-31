---
layout: page
title: "Design Phone Directory"
difficulty: Medium
category: Design
tags: [Design, Hash Table, Queue]
leetcode_url: "https://leetcode.com/problems/design-phone-directory/"
---

# Design Phone Directory / Thiết Kế Danh Bạ Điện Thoại

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Resource Pool Design
> **Frequency**: 📘 Tier 3
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese)**: Tưởng tượng một kho vé đánh số từ 0 đến `maxNumbers-1`. Bạn có thể lấy một vé bất kỳ (`get`), kiểm tra vé số X còn không (`check`), hoặc trả vé lại kho (`release`). Đây là bài toán quản lý resource pool có thể tái sử dụng.

**Pattern Recognition**: Resource pool với get/release → dùng `Set` để track số available cho O(1) check; hoặc `Queue` để get theo thứ tự FIFO. Set linh hoạt hơn vì hỗ trợ check O(1) natively.

**ASCII Visual**:

```
maxNumbers = 3
Init:        available = {0, 1, 2}
get()    →   0, available = {1, 2}
get()    →   1, available = {2}
check(2) →   true
get()    →   2, available = {}
check(2) →   false
release(2) → available = {2}
check(2) →   true
```

## Problem Description

Design a phone directory (`0` to `maxNumbers-1`) with:

- `get()` — return any unassigned number, or `-1`.
- `check(number)` — return `true` if available.
- `release(number)` — return number to pool.

**Example**:

```
PhoneDirectory(3):
get() → 0    get() → 1    check(2) → true
get() → 2    check(2) → false
release(2)   check(2) → true
```

**Constraints**: `1 ≤ maxNumbers ≤ 10⁴`, ≤ 2×10⁴ calls.

## 📝 Interview Tips

- **Set approach**: O(n) init, O(1) per get/check/release — đủ tốt cho constraints này.
- **Avoid double-release**: Trả về số đã available không được tạo duplicate trong set — Set handles this natively.
- **get() returns any**: Không cần theo thứ tự đặc biệt, `values().next().value` trả về phần tử đầu tiên trong Set là đủ.
- **Release invalid**: `release(-1)` hoặc `release(maxNumbers)` phải bị bỏ qua silently.
- **Queue variant**: Dùng mảng như queue cho get() FIFO — dễ đọc hơn nhưng check() cần thêm `Set<used>` để O(1).
- **Scale follow-up**: Với 10⁹ numbers, lazy initialization — chỉ track `used` set thay vì `available` set.

## Solutions

```typescript
/**

- Design Phone Directory — LeetCode #379
-
- Set of available numbers: O(n) init, O(1) per get/check/release.
- Set handles duplicate-release automatically (idempotent add).
  */
  class PhoneDirectory {
  private available: Set<number>;
  private max: number;

constructor(maxNumbers: number) {
this.max = maxNumbers;
this.available = new Set<number>();
for (let i = 0; i < maxNumbers; i++) this.available.add(i);
}

/**

- Return any unassigned number, or -1 if none left.
- Trả về số chưa được cấp phát bất kỳ, hoặc -1 nếu hết.
  */
  get(): number {
  if (this.available.size === 0) return -1;
  const num = this.available.values().next().value!;
  this.available.delete(num);
  return num;
  }

/**

- True if number is still in the available pool.
- Kiểm tra số có còn trong pool không.
  */
  check(number: number): boolean {
  return this.available.has(number);
  }

/**

- Return number to pool; silently ignore out-of-range.
- Trả số về pool; bỏ qua số ngoài phạm vi.
  */
  release(number: number): void {
  if (number >= 0 && number < this.max) this.available.add(number);
  }
  }

// Inline tests — LeetCode example
const dir = new PhoneDirectory(3);
console.assert(dir.get() === 0);
console.assert(dir.get() === 1);
console.assert(dir.check(2) === true);
console.assert(dir.get() === 2);
console.assert(dir.check(2) === false);
dir.release(2);
console.assert(dir.check(2) === true);
console.assert(dir.get() === 2, 'released 2 is the only available number');
console.assert(dir.get() === -1, 'all exhausted');

// Release invalid numbers — should not crash
dir.release(-1);
dir.release(3);
console.assert(dir.check(0) === false, 'out-of-range release has no effect');

// Double-release is idempotent
const dir2 = new PhoneDirectory(2);
dir2.get(); // takes 0
dir2.release(0);
dir2.release(0); // double release
console.assert(dir2.get() === 0, 'double release does not create phantom numbers');
dir2.get(); // takes 1
console.assert(dir2.get() === -1, 'only 2 numbers total');
```

## 🔗 Related Problems

- [LC 146 — LRU Cache](https://leetcode.com/problems/lru-cache/) — resource management with eviction
- [LC 432 — All O(1) Data Structure](https://leetcode.com/problems/all-oone-data-structure/) — O(1) insert/delete/getMax
- [LC 705 — Design HashSet](https://leetcode.com/problems/design-hashset/) — set fundamentals
- [LC 706 — Design HashMap](https://leetcode.com/problems/design-hashmap/) — map fundamentals
