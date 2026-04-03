---
layout: page
title: "Search a 2D Matrix"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Matrix]
leetcode_url: "https://leetcode.com/problems/search-a-2d-matrix"
---

# Search a 2D Matrix / Tìm Kiếm Trong Ma Trận 2D

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search on Virtual 1D Array
> **Frequency**: ⭐ Tier 2 — Gặp ở 20+ companies
> **See also**: [Search a 2D Matrix II](https://leetcode.com/problems/search-a-2d-matrix-ii) | [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống tìm tên học sinh trong sổ điểm danh gồm nhiều trang — mỗi trang đã xếp theo thứ tự, và trang sau luôn bắt đầu từ số lớn hơn trang trước. Toàn bộ sổ như một danh sách dài đã sort. Bạn không cần lật từng trang — chỉ cần mở giữa sổ, xem số, rồi chọn nửa phù hợp.

**Pattern Recognition:**

- Signal: "sorted rows + each row starts > last row" → ma trận là **virtual sorted 1D array**
- Ánh xạ: index `mid` trong mảng 1D → `row = Math.floor(mid / cols)`, `col = mid % cols`
- Nếu chỉ cần tìm target: 1 lần binary search O(log(m×n))

**Visual — target=3 in [[1,3,5,7],[10,11,16,20],[23,30,34,60]]:**

```
Virtual 1D: [1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60]
             0  1  2  3   4   5   6   7   8   9  10  11
            lo=0                              hi=11

Step 1: mid=5 → row=5//4=1, col=5%4=1 → matrix[1][1]=11
        11 > 3 → hi = 4

Step 2: lo=0, hi=4, mid=2 → row=0, col=2 → matrix[0][2]=5
        5 > 3 → hi = 1

Step 3: lo=0, hi=1, mid=0 → matrix[0][0]=1
        1 < 3 → lo = 1

Step 4: lo=1, hi=1, mid=1 → matrix[0][1]=3 == target ✅ return true
```

---

## Problem Description

Given an `m × n` integer matrix where each row is sorted left-to-right and the first integer of each row is greater than the last integer of the previous row. Given an integer `target`, return `true` if `target` is in the matrix, `false` otherwise. Must run in O(log(m×n)). ([LeetCode 74](https://leetcode.com/problems/search-a-2d-matrix))

```
Input: matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3   → true
Input: matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=13  → false
Input: matrix=[[1]], target=1 → true
```

Constraints: `1 <= m, n <= 100`, `-10⁴ <= matrix[i][j], target <= 10⁴`

---

## 📝 Interview Tips

1. **Clarify**: "Mỗi hàng đã sorted VÀ hàng sau bắt đầu > hàng trước — đây là điều kiện mạnh hơn Matrix II" / Rows sorted + cross-row sorted: stronger than Matrix II
2. **1D mapping**: "Treat m×n as sorted 1D: mid → row=mid÷cols, col=mid%cols" / Key formula to memorize
3. **Two binary searches**: "Tìm hàng bằng BS (first col), rồi tìm trong hàng đó — cũng O(log m + log n)" / Alternatively: two separate BS
4. **Matrix II difference**: "Bài này strict sorted cross-rows; Matrix II chỉ sorted trong hàng/cột — cần khác algorithm" / Distinguish from Matrix II (staircase search)
5. **Boundary**: "lo=0, hi=m\*n-1, dùng `lo <= hi`" / Standard binary search bounds
6. **Edge cases**: "Matrix 1×1, target nhỏ hơn min hoặc lớn hơn max" / Single cell, target out of range

---

## Solutions

```typescript
/**
 * Solution 1: Linear Scan (Brute Force)
 * Name: Row-by-Row Scan
 * Time: O(m*n) — check every cell
 * Space: O(1)
 */
function searchMatrixLinear(matrix: number[][], target: number): boolean {
  for (const row of matrix) {
    for (const val of row) {
      if (val === target) return true;
    }
  }
  return false;
}

/**
 * Solution 2: Two Binary Searches
 * Name: Double Binary Search
 * Time: O(log m + log n) — find row, then find column
 * Space: O(1)
 */
function searchMatrixTwoBS(matrix: number[][], target: number): boolean {
  const m = matrix.length,
    n = matrix[0].length;

  // Find the row: last row where first element <= target
  let top = 0,
    bot = m - 1,
    row = -1;
  while (top <= bot) {
    const mid = top + Math.floor((bot - top) / 2);
    if (matrix[mid][0] <= target) {
      row = mid;
      top = mid + 1;
    } else bot = mid - 1;
  }
  if (row === -1) return false;

  // Binary search within that row
  let lo = 0,
    hi = n - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (matrix[row][mid] === target) return true;
    else if (matrix[row][mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}

/**
 * Solution 3: Virtual 1D Binary Search (Most Elegant)
 * Name: Virtual 1D Binary Search
 * Time: O(log(m*n)) — single binary search
 * Space: O(1)
 */
function searchMatrix(matrix: number[][], target: number): boolean {
  const m = matrix.length,
    n = matrix[0].length;
  let lo = 0,
    hi = m * n - 1;

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const row = Math.floor(mid / n);
    const col = mid % n;
    const val = matrix[row][col];

    if (val === target) return true;
    else if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }

  return false;
}

// === Test Cases ===
const m1 = [
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60],
];
console.log(searchMatrix(m1, 3)); // true
console.log(searchMatrix(m1, 13)); // false
console.log(searchMatrix([[1]], 1)); // true
console.log(searchMatrix([[1]], 2)); // false
console.log(searchMatrixTwoBS(m1, 16)); // true
console.log(
  searchMatrixLinear(
    [
      [1, 2, 3],
      [4, 5, 6],
    ],
    5,
  ),
); // true
```

---

## 🔗 Related Problems

| Problem                                                                                                          | Relationship                                    |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [Search a 2D Matrix II](https://leetcode.com/problems/search-a-2d-matrix-ii)                                     | Weaker constraint: use staircase O(m+n) instead |
| [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array)       | Binary search on modified sorted array          |
| [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix) | Binary search on value range in matrix          |
| [Find Peak Element](https://leetcode.com/problems/find-peak-element)                                             | Binary search on unsorted — slope property      |
| [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self)         | Binary search with sorted structure             |

```

```
