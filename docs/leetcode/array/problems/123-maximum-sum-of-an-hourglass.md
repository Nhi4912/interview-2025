---
layout: page
title: "Maximum Sum of an Hourglass"
difficulty: Medium
category: Array
tags: [Array, Matrix, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-sum-of-an-hourglass"
---

# Maximum Sum of an Hourglass / Tổng Cát Đồng Hồ Tối Đa

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable) | [Get Biggest Three Rhombus Sums in a Grid](https://leetcode.com/problems/get-biggest-three-rhombus-sums-in-a-grid)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống hình **cát đồng hồ** — 3 ô hàng trên, 1 ô tâm giữa, 3 ô hàng dưới (7 ô tổng). Duyệt tất cả tâm hợp lệ `(i,j)` với `1 ≤ i ≤ m-2` và `1 ≤ j ≤ n-2`, cộng 7 ô và lấy max.

```
Grid:
1  2  3  4
4  5  6  7     Hourglass center (1,1): top=[1,2,3], mid=5, bot=[4+5+6]
7  8  9  1  →  = 6+5+15 = 26? No: top=1+2+3=6, mid=5, bot=7+8+9=24 → 35
2  3  4  5     Wait: bot row = grid[2][0..2] = 7+8+9=24? sum=6+5+24=35
```

---

## Problem Description / Mô Tả Bài Toán

Cho lưới `m × n` (m, n ≥ 3). **Cát đồng hồ** tâm `(i,j)`: hàng trên `[i-1][j-1..j+1]` + tâm `[i][j]` + hàng dưới `[i+1][j-1..j+1]`. Trả về **tổng cát đồng hồ lớn nhất**.

- **Input:** `grid=[[6,2,1,3],[4,2,1,5],[9,2,8,7],[4,1,2,9]]` → **Output:** `30`
- **Input:** `grid=[[1,2,3],[4,5,6],[7,8,9]]` → **Output:** `35`

**Constraints:** `m = n = grid.length`, `3 <= m, n <= 150`, `0 <= grid[i][j] <= 10^6`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Valid hourglass centers: row in [1, m-2], col in [1, n-2]. **VI:** Tâm hợp lệ: hàng trong [1, m-2], cột trong [1, n-2].
2. **EN:** Direct sum of 7 cells is O(1) per center → total O(m×n) — already optimal. **VI:** Tính 7 ô là O(1) mỗi tâm → tổng O(m×n) — đã tối ưu.
3. **EN:** Prefix sum optimization: precompute 3-element row windows, then combine rows. **VI:** Tối ưu prefix sum: tính trước cửa sổ 3 ô mỗi hàng.
4. **EN:** All values ≥ 0, so initialize max to -Infinity or 0 (either works). **VI:** Tất cả giá trị ≥ 0, khởi tạo max = -Infinity cho an toàn.
5. **EN:** The hourglass is always exactly 7 cells — no variable size. **VI:** Cát đồng hồ luôn đúng 7 ô.
6. **EN:** Follow-up: 2D prefix sums let you compute any rectangular region in O(1). **VI:** Mở rộng: prefix sum 2D tính hình chữ nhật O(1).

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Direct Enumeration  O(m×n) time, O(1) space ─────────────────
function maxSum(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  let maxHourglass = -Infinity;

  for (let i = 1; i < m - 1; i++) {
    for (let j = 1; j < n - 1; j++) {
      const top = grid[i - 1][j - 1] + grid[i - 1][j] + grid[i - 1][j + 1];
      const mid = grid[i][j];
      const bot = grid[i + 1][j - 1] + grid[i + 1][j] + grid[i + 1][j + 1];
      maxHourglass = Math.max(maxHourglass, top + mid + bot);
    }
  }

  return maxHourglass;
}

// ─── Solution 2: Row Prefix Sums  O(m×n) time, O(m×n) space ─────────────────
// Precompute sum of consecutive 3 elements per row → combine for each center
function maxSumPrefix(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;

  // rowSum3[i][j] = grid[i][j] + grid[i][j+1] + grid[i][j+2]
  const rowSum3: number[][] = Array.from({ length: m }, () => new Array(n - 2).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j <= n - 3; j++) {
      rowSum3[i][j] = grid[i][j] + grid[i][j + 1] + grid[i][j + 2];
    }
  }

  let maxHourglass = -Infinity;
  // Center is at (i, j+1) for each window starting at column j
  for (let i = 1; i < m - 1; i++) {
    for (let j = 0; j <= n - 3; j++) {
      const hourglassSum = rowSum3[i - 1][j] + grid[i][j + 1] + rowSum3[i + 1][j];
      maxHourglass = Math.max(maxHourglass, hourglassSum);
    }
  }

  return maxHourglass;
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(
  maxSum([
    [6, 2, 1, 3],
    [4, 2, 1, 5],
    [9, 2, 8, 7],
    [4, 1, 2, 9],
  ]),
); // 30
console.log(
  maxSum([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
); // 35
console.log(
  maxSum([
    [0, 0, 0],
    [0, 9, 0],
    [0, 0, 0],
  ]),
); // 9
console.log(
  maxSumPrefix([
    [6, 2, 1, 3],
    [4, 2, 1, 5],
    [9, 2, 8, 7],
    [4, 1, 2, 9],
  ]),
); // 30
console.log(
  maxSumPrefix([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
); // 35
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                            | Difficulty | Pattern       |
| ---- | -------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| 304  | [Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable)       | 🟡 Medium  | Prefix Sum 2D |
| 2022 | [Convert 1D Array Into 2D Array](https://leetcode.com/problems/convert-1d-array-into-2d-array)     | 🟢 Easy    | Matrix        |
| 2088 | [Count Fertile Pyramids in a Land](https://leetcode.com/problems/count-fertile-pyramids-in-a-land) | 🔴 Hard    | Matrix DP     |
