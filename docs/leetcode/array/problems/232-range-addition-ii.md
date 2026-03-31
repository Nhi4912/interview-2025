---
layout: page
title: "Range Addition II"
difficulty: Easy
category: Array
tags: [Array, Math]
leetcode_url: "https://leetcode.com/problems/range-addition-ii"
---

# Range Addition II / Cộng Dải II

> **Difficulty**: 🟢 Easy | **Category**: Array | **Pattern**: Math / Greedy Observation

## 🧠 Intuition / Tư Duy

**Như tìm giao nhau của nhiều hình chữ nhật**: mỗi phép cộng tác động lên vùng từ (0,0) đến (row-1, col-1). Giá trị lớn nhất luôn nằm trong phần giao nhau của tất cả các vùng đó.

**Pattern Recognition:**

- Mỗi operation [r, c] tăng tất cả ô trong [0..r-1][0..c-1]
- Vùng được cộng nhiều nhất = giao của tất cả các hình chữ nhật = intersection
- Intersection = [0..minRow-1][0..minCol-1] → diện tích = minRow \* minCol

**Visual:**

```
m=3, n=3, ops=[[2,2],[3,3]]
Op1: adds to [0..1][0..1] (2×2 region)
Op2: adds to [0..2][0..2] (3×3 region)
Intersection: [0..1][0..1] = 2×2 = 4 cells all have max value
Answer = 2*2 = 4
```

## Problem Description

Ma trận `m×n` khởi tạo bằng 0. Với mỗi `ops[i] = [ai, bi]`: cộng 1 vào tất cả ô trong `[0..ai-1][0..bi-1]`. Trả về **số lượng ô có giá trị lớn nhất**.

**Example 1:** `m=3, n=3, ops=[[2,2],[3,3]]` → `4`
**Example 2:** `m=3, n=3, ops=[[2,2],[3,3],[3,3],[3,3],[2,2],[3,3],[3,3],[3,3],[2,2],[3,3],[3,3],[3,3]]` → `4`
**Example 3:** `m=3, n=3, ops=[]` → `9`

**Constraints:** `1 ≤ m,n ≤ 4×10^4`, `0 ≤ ops.length ≤ 10^4`, `1 ≤ ops[i][0] ≤ m`, `1 ≤ ops[i][1] ≤ n`

## 📝 Interview Tips

1. **Key insight**: giá trị max ở (0,0) chắc chắn, và vùng max là giao của tất cả hình chữ nhật
2. **If ops empty**: toàn bộ ma trận = 0 → answer = m\*n
3. **No need to simulate**: chỉ tìm min row và min col trong tất cả operations
4. **O(k)**: k = số operations, không cần xây dựng ma trận
5. **Chú ý**: ops[i] là inclusive (length), không phải index
6. **Phân biệt với Range Addition I**: bài I yêu cầu diff array, bài này chỉ cần math

## Solutions

```typescript
// Solution 1: Find intersection — O(k) time, O(1) space
function maxCount(m: number, n: number, ops: number[][]): number {
  if (ops.length === 0) return m * n;
  let minRow = m,
    minCol = n;
  for (const [r, c] of ops) {
    minRow = Math.min(minRow, r);
    minCol = Math.min(minCol, c);
  }
  return minRow * minCol;
}

// Solution 2: Explicit reduce (functional style)
function maxCountV2(m: number, n: number, ops: number[][]): number {
  if (!ops.length) return m * n;
  const minRow = ops.reduce((acc, op) => Math.min(acc, op[0]), m);
  const minCol = ops.reduce((acc, op) => Math.min(acc, op[1]), n);
  return minRow * minCol;
}

// Solution 3: Destructuring + single-pass reduce
function maxCountV3(m: number, n: number, ops: number[][]): number {
  return ops
    .reduce(([mr, mc], [r, c]) => [Math.min(mr, r), Math.min(mc, c)], [m, n])
    .reduce((a, b) => a * b);
}

// Tests
console.log(
  maxCount(3, 3, [
    [2, 2],
    [3, 3],
  ]),
); // 4
console.log(maxCount(3, 3, [])); // 9
console.log(
  maxCount(3, 3, [
    [2, 2],
    [3, 3],
    [2, 2],
  ]),
); // 4
console.log(
  maxCountV2(3, 3, [
    [2, 2],
    [3, 3],
  ]),
); // 4
console.log(
  maxCountV3(3, 3, [
    [2, 2],
    [3, 3],
  ]),
); // 4
```

## 🔗 Related Problems

| Problem                    | Relationship                       |
| -------------------------- | ---------------------------------- |
| 370 - Range Addition       | Range update with difference array |
| 598 - Range Addition II    | This problem                       |
| 2381 - Shifting Letters II | Range update simulation            |
| 731 - My Calendar II       | Interval intersection counting     |
