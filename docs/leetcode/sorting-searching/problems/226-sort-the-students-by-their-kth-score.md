---
layout: page
title: "Sort the Students by Their Kth Score"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Sorting, Matrix]
leetcode_url: "https://leetcode.com/problems/sort-the-students-by-their-kth-score"
---

# Sort the Students by Their Kth Score / Xếp Hạng Học Sinh Theo Điểm Thứ K

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Best Meeting Point](https://leetcode.com/problems/best-meeting-point) | [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như bảng xếp hạng học sinh theo môn thi thứ k — ta chỉ đơn giản sắp xếp các hàng (học sinh) theo cột thứ k (môn thi) theo thứ tự giảm dần.

**Pattern Recognition:**

- Signal: "sort rows by specific column" → stable sort with key
- Key insight: `score[i][k]` là khóa sắp xếp; sort descending → hàng đầu là học sinh điểm cao nhất môn k

**Visual — Sort Students by Kth Score:**

```
score = [[10,6,9,1],
          [7,5,11,2],
          [4,8,3,15]], k=2

Column 2 values: [9, 11, 3]
Sort rows descending by col[2]:
  Row 1 (col=11): [7,5,11,2]   ← highest
  Row 0 (col=9):  [10,6,9,1]   ← second
  Row 2 (col=3):  [4,8,3,15]   ← lowest

Result: [[7,5,11,2],[10,6,9,1],[4,8,3,15]]
```

---

## Problem Description

Given a 2D integer array `score` of size `m x n` and an integer `k`, sort the students (rows) in **descending order** based on their scores in column `k`. Return the sorted matrix.

Difficulty: Medium | Acceptance: 85.6%

```
Example 1:
  Input:  score = [[10,6,9,1],[7,5,11,2],[4,8,3,15]], k = 2
  Output: [[7,5,11,2],[10,6,9,1],[4,8,3,15]]

Example 2:
  Input:  score = [[3,4],[5,6]], k = 0
  Output: [[5,6],[3,4]]
```

Constraints:

- `m == score.length`
- `n == score[i].length`
- `1 <= m, n <= 250`
- `1 <= score[i][j] <= 10^5`
- `score` consists of distinct integers
- `0 <= k < n`

---

## 📝 Interview Tips

1. **Clarify**: "Sắp xếp tăng dần hay giảm dần? Bài này giảm dần (điểm cao nhất ở trên)" / Confirm descending order (highest score first).
2. **Stable sort**: "Nếu hai học sinh cùng điểm môn k, thứ tự giữa họ có quan trọng không?" / Ask if ties need stable ordering (problem says distinct, so no ties).
3. **In-place vs copy**: "Có thể sort tại chỗ — score.sort() thay đổi input" / sort() mutates input; if that's not ok, spread copy first.
4. **Key selector**: "Dùng `(a, b) => b[k] - a[k]` làm comparator giảm dần" / Use `b[k] - a[k]` for descending comparator.
5. **Matrix dimensions**: "m rows là học sinh, n columns là môn thi; k < n" / m students, n exams; ensure k is valid index.
6. **Follow-up**: "Sắp xếp theo nhiều tiêu chí (primary môn k, secondary môn j)? Dùng comparator kết hợp" / Multi-key sort: chain comparators.

---

## Solutions

```typescript
/**
 * Solution 1: Direct Sort by Column k
 * Time: O(m log m) — sort m rows
 * Space: O(1) — in-place sort (ignoring sort overhead)
 */
function sortStudents(score: number[][], k: number): number[][] {
  return score.sort((a, b) => b[k] - a[k]);
}

/**
 * Solution 2: Sort index array, then remap (non-mutating)
 * Time: O(m log m)
 * Space: O(m) — index array
 */
function sortStudentsNonMutating(score: number[][], k: number): number[][] {
  const indices = score.map((_, i) => i);
  indices.sort((i, j) => score[j][k] - score[i][k]);
  return indices.map((i) => score[i]);
}

/**
 * Solution 3: With tie-breaking on secondary column (extended)
 * Time: O(m log m)
 * Space: O(1)
 */
function sortStudentsMultiKey(score: number[][], k: number, tieBreakCol?: number): number[][] {
  return [...score].sort((a, b) => {
    const primary = b[k] - a[k];
    if (primary !== 0 || tieBreakCol === undefined) return primary;
    return b[tieBreakCol] - a[tieBreakCol];
  });
}

// === Test Cases ===
console.log(
  sortStudents(
    [
      [10, 6, 9, 1],
      [7, 5, 11, 2],
      [4, 8, 3, 15],
    ],
    2,
  ),
);
// [[7,5,11,2],[10,6,9,1],[4,8,3,15]]

console.log(
  sortStudents(
    [
      [3, 4],
      [5, 6],
    ],
    0,
  ),
);
// [[5,6],[3,4]]

console.log(
  sortStudentsNonMutating(
    [
      [10, 6, 9, 1],
      [7, 5, 11, 2],
      [4, 8, 3, 15],
    ],
    2,
  ),
);
// [[7,5,11,2],[10,6,9,1],[4,8,3,15]]

console.log(
  sortStudents(
    [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
    1,
  ),
);
// [[7,8,9],[4,5,6],[1,2,3]]
```

---

## 🔗 Related Problems

- [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix) — matrix + binary search
- [Largest Submatrix With Rearrangements](https://leetcode.com/problems/largest-submatrix-with-rearrangements) — column-wise sort
- [Get Biggest Three Rhombus Sums in a Grid](https://leetcode.com/problems/get-biggest-three-rhombus-sums-in-a-grid) — matrix traversal
- [Sort Array by Parity](https://leetcode.com/problems/sort-array-by-parity) — custom sort comparator
- [Sort the Students by Their Kth Score — LeetCode](https://leetcode.com/problems/sort-the-students-by-their-kth-score) — problem page
