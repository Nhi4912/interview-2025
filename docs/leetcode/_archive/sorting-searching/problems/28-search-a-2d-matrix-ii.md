---
layout: page
title: "Search a 2D Matrix II"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Divide and Conquer, Matrix]
leetcode_url: "https://leetcode.com/problems/search-a-2d-matrix-ii"
---

# Search a 2D Matrix II / Tìm Kiếm trong Ma Trận 2D II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix) | [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như tìm số nhà trên bản đồ thành phố — đường ngang tăng dần từ trái sang phải, đường dọc tăng dần từ trên xuống dưới. Xuất phát từ góc trên-phải: nếu giá trị quá lớn thì đi sang trái, quá nhỏ thì đi xuống — mỗi bước loại bỏ cả một hàng hoặc cột.

**Pattern Recognition:**

- Signal: matrix sorted row-wise AND column-wise → **"Staircase" search từ góc trên-phải**
- Tại mỗi ô `(r, c)`: nếu `> target` loại cột `c` (đi trái), nếu `< target` loại hàng `r` (đi xuống)
- Tổng bước đi tối đa: `m + n` (không quay đầu)

**Visual — Staircase Search from Top-Right:**

```
matrix = [[1,  4,  7, 11],     target = 5
           [2,  5,  8, 12],
           [3,  6,  9, 16],
           [10, 13, 14, 17]]

Start: (0,3) → 11 > 5 → go left
       (0,2) →  7 > 5 → go left
       (0,1) →  4 < 5 → go down
       (1,1) →  5 == 5 → FOUND ✅

Each step eliminates one row or one column.
Total moves ≤ m + n = O(m+n)
```

---

## Problem Description

Given an `m x n` integer matrix where each row is sorted left-to-right and each column is sorted top-to-bottom, return `true` if `target` is in the matrix. ([LeetCode 240](https://leetcode.com/problems/search-a-2d-matrix-ii))

**Example 1:** `matrix = [[1,4,7,11],[2,5,8,12],[3,6,9,16],[10,13,14,17]], target = 5` → `true`
**Example 2:** `matrix = [[1,4,7,11],[2,5,8,12],[3,6,9,16],[10,13,14,17]], target = 20` → `false`

**Constraints:** `m, n` in `[1, 300]`, `-10⁹ <= matrix[i][j] <= 10⁹`, rows and columns sorted.

---

## 📝 Interview Tips

1. **Clarify** / Làm rõ: "Matrix sorted theo cả hàng lẫn cột?" / Confirm both row & column sort guarantee
2. **Brute force** / Thô: Scan toàn bộ O(m×n) — nêu ngay rồi đề xuất tối ưu hơn
3. **Why top-right?** / Tại sao góc trên-phải: Góc đó có tính loại trừ rõ ràng — lớn hơn → trái, nhỏ hơn → xuống
4. **Binary search per row** / Tìm nhị phân từng hàng: O(m log n) — tốt hơn brute force nhưng chưa optimal
5. **Optimal** / Tối ưu: Staircase O(m+n) — tốt nhất có thể cho bài này
6. **Edge cases** / Biên: Ma trận 1×1, target nhỏ hơn min, lớn hơn max, nằm ở đường chéo chính

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Linear Scan
 * Time: O(m × n) — visit every cell
 * Space: O(1)
 */
function searchMatrixBrute(matrix: number[][], target: number): boolean {
  for (const row of matrix) {
    for (const val of row) {
      if (val === target) return true;
    }
  }
  return false;
}

/**
 * Solution 2: Binary Search per Row
 * Time: O(m log n) — binary search each of m rows
 * Space: O(1)
 */
function searchMatrixBinaryPerRow(matrix: number[][], target: number): boolean {
  for (const row of matrix) {
    let lo = 0,
      hi = row.length - 1;
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (row[mid] === target) return true;
      else if (row[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}

/**
 * Solution 3: Staircase Search from Top-Right (Optimal)
 * Time: O(m + n) — at most m+n steps, each eliminates a row or column
 * Space: O(1)
 *
 * Start at top-right corner where the "staircase" property holds:
 *   going LEFT decreases value, going DOWN increases value
 */
function searchMatrix(matrix: number[][], target: number): boolean {
  let row = 0;
  let col = matrix[0].length - 1;

  while (row < matrix.length && col >= 0) {
    const val = matrix[row][col];
    if (val === target) return true;
    else if (val > target)
      col--; // eliminate this column
    else row++; // eliminate this row
  }

  return false;
}

// === Test Cases ===
const m1 = [
  [1, 4, 7, 11],
  [2, 5, 8, 12],
  [3, 6, 9, 16],
  [10, 13, 14, 17],
];
console.log(searchMatrix(m1, 5)); // true
console.log(searchMatrix(m1, 20)); // false
console.log(searchMatrix([[1]], 1)); // true
console.log(searchMatrix([[1]], 2)); // false
```

---

## 🔗 Related Problems

| Problem                                                                                                          | Pattern              | Difficulty |
| ---------------------------------------------------------------------------------------------------------------- | -------------------- | ---------- |
| [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix)                                           | Binary Search        | 🟡 Medium  |
| [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix) | Binary Search / Heap | 🟡 Medium  |
| [Find a Peak Element II](https://leetcode.com/problems/find-a-peak-element-ii)                                   | Binary Search        | 🟡 Medium  |
| [Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes)                                             | Matrix               | 🟡 Medium  |
| [Spiral Matrix](https://leetcode.com/problems/spiral-matrix)                                                     | Matrix Traversal     | 🟡 Medium  |
