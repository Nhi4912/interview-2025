---
layout: page
title: "Flatten 2D Vector"
difficulty: Medium
category: Design
tags: [Design, Two Pointers, Iterator]
leetcode_url: "https://leetcode.com/problems/flatten-2d-vector/"
---

# Flatten 2D Vector / Làm Phẳng Vector 2D

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Iterator Design / Two Pointers
> **Frequency**: 📘 Tier 3
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese)**: Bạn có nhiều danh sách mua sắm. Thay vì gộp tất cả vào một danh sách dài rồi đọc, bạn chỉ cần ghi nhớ "tôi đang ở trang nào, cuốn nào". Khi hết trang, lật sang cuốn kế. Bỏ qua cuốn trống.

**Pattern Recognition**: Iterator cho cấu trúc lồng nhau → hai con trỏ `(row, col)` + helper `advance()` để skip hàng rỗng. Gọi `advance()` ở constructor và sau mỗi `next()`.

**ASCII Visual**:

```
vec = [[1,2], [], [3], [4,5]]
       ↑↑                     row=0, col=0 → next()=1
          ↑                   row=0, col=1 → next()=2
              [row=1 empty → skip]
                  ↑           row=2, col=0 → next()=3
                      ↑↑      row=3, col=0 → next()=4
```

## Problem Description

Design an iterator to flatten a 2D vector, supporting `next()` and `hasNext()`.

**Example**:

```
Input:  ["Vector2D","next","next","next","hasNext","hasNext","next","hasNext"]
        [[[[1,2],[3],[4]]],[],    [],    [],    [],       [],       [],    []  ]
Output: [null,            1,     2,     3,     true,     true,     4,     false]
```

**Constraints**: `0 ≤ vec.length ≤ 200`, `0 ≤ vec[i].length ≤ 500`, ≤ 10⁵ calls.

## 📝 Interview Tips

- **Đừng flatten trước**: Pre-flatten trong constructor tốn O(n) space. Two-pointer dùng O(1) extra space.
- **Don't pre-flatten**: Two-pointer approach is O(1) extra space vs O(n) for eager flattening.
- **Empty rows are a trap**: Phải skip hàng rỗng — thiếu bước này là lỗi phổ biến nhất. Tách ra thành `advance()` riêng.
- **`hasNext()` must be idempotent**: Gọi nhiều lần liên tiếp không được thay đổi state.
- **Edge cases**: `vec = []` và `vec = [[], [], []]` — cả hai đều `hasNext() === false` ngay sau constructor.
- **Lazy advance**: `advance()` ở constructor đặt sẵn con trỏ tại phần tử hợp lệ đầu tiên, sau đó chỉ cần `hasNext()` kiểm tra `row < vec.length`.

## Solutions

```typescript
/**

- Flatten 2D Vector — LeetCode #251
-
- Two-pointer approach with lazy row-skip.
- Time: O(1) amortized per next()/hasNext() | Space: O(1) extra
-
- Key: advance() skips empty rows; called in constructor and after next().
  */
  class Vector2D {
  private vec: number[][];
  private row = 0;
  private col = 0;

constructor(vec: number[][]) {
this.vec = vec;
this.advance();
}

/**

- Skip past any empty rows to land on the next valid element.
- Bỏ qua các hàng rỗng đến phần tử hợp lệ kế tiếp.
  */
  private advance(): void {
  while (this.row < this.vec.length && this.col >= this.vec[this.row].length) {
  this.row++;
  this.col = 0;
  }
  }

next(): number {
const val = this.vec[this.row][this.col++];
this.advance();
return val;
}

hasNext(): boolean {
return this.row < this.vec.length;
}
}

// Inline tests
const v = new Vector2D([[1, 2], [], [3], [4]]);
console.assert(v.next() === 1);
console.assert(v.next() === 2);
console.assert(v.hasNext() === true);
console.assert(v.next() === 3);
console.assert(v.hasNext() === true);
console.assert(v.next() === 4);
console.assert(v.hasNext() === false);

// Edge: all-empty rows
const allEmpty = new Vector2D([[], [], []]);
console.assert(allEmpty.hasNext() === false);

// Edge: empty vector
const emptyVec = new Vector2D([]);
console.assert(emptyVec.hasNext() === false);

// hasNext() is idempotent
const v2 = new Vector2D([[5]]);
console.assert(v2.hasNext() === true);
console.assert(v2.hasNext() === true, 'hasNext twice should not advance state');
console.assert(v2.next() === 5);
```

## 🔗 Related Problems

- [LC 341 — Flatten Nested List Iterator](https://leetcode.com/problems/flatten-nested-list-iterator/) — arbitrary nesting depth
- [LC 284 — Peeking Iterator](https://leetcode.com/problems/peeking-iterator/) — iterator augmentation pattern
- [LC 173 — Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator/) — tree iterator design
- [LC 900 — RLE Iterator](https://leetcode.com/problems/rle-iterator/) — custom iterator with state
