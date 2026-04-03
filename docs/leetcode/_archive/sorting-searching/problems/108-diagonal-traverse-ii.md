---
layout: page
title: "Diagonal Traverse II"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/diagonal-traverse-ii"
---

# Diagonal Traverse II / Duyệt Đường Chéo II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Group by Diagonal Key
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống xếp học sinh theo nhóm — mỗi "nhóm chéo" gồm những học sinh có cùng tổng hàng + cột (i+j). Trong mỗi nhóm, đọc từ hàng lớn nhất xuống nhỏ nhất (bottom-up). Khi biết nhóm, chỉ cần gom và sắp xếp!

**Pattern Recognition:**

- All cells on same anti-diagonal share the same `row + col` value
- Jagged array → traverse bottom-to-top within each diagonal
- Group by `i+j`, collect `(row, value)`, sort rows descending within group

**Visual:**

```
nums = [[1,2,3],[4,5,6],[7,8,9]]

Diagonal 0 (i+j=0): (0,0)=1
Diagonal 1 (i+j=1): (0,1)=2, (1,0)=4  → bottom-up: [4,2]
Diagonal 2 (i+j=2): (0,2)=3, (1,1)=5, (2,0)=7 → [7,5,3]
Diagonal 3 (i+j=3): (1,2)=6, (2,1)=8  → [8,6]
Diagonal 4 (i+j=4): (2,2)=9

Result: [1,4,2,7,5,3,8,6,9] ✅
```

## Problem Description

Given a 2D jagged array `nums` (rows can have different lengths), return all elements in **anti-diagonal order** (bottom-left to top-right). Within each diagonal, process from bottom row to top row. `1 ≤ nums.length ≤ 10^5`, total elements ≤ `10^5`.

**Example 1:** `nums=[[1,2,3],[4,5,6],[7,8,9]]` → `[1,4,2,7,5,3,8,6,9]`
**Example 2:** `nums=[[1,2,3,4,5],[6,7],[8],[9,10]]` → `[1,6,2,8,7,3,9,4,10,5]`

## 📝 Interview Tips

1. **Clarify**: "Jagged array" — các hàng có thể có độ dài khác nhau / Rows can have different lengths; handle out-of-bounds
2. **Approach**: Group by (row+col), within group sort by row descending / Group by diagonal key, sort rows desc
3. **Edge cases**: Một hàng duy nhất; hàng rỗng; tam giác / Single row; empty rows; triangular shapes
4. **Optimize**: Hash map group by (i+j) → O(N) where N = total elements / Single pass grouping is O(N)
5. **Test**: `[[1,2],[3]]` → `[1,3,2]` (check diagonal 1: row=1→3, row=0→2) / Small jagged array
6. **Follow-up**: Duyệt diagonal theo hướng ngược lại? / What if we traverse top-to-bottom within diagonals?

## Solutions

```typescript
/** Solution 1: Group by (row+col), sort rows descending within each group
 * Time: O(N log N) | Space: O(N) where N = total elements
 */
function findDiagonalOrder(nums: number[][]): number[] {
  // Map from diagonal key (i+j) to list of [row, value]
  const diags = new Map<number, [number, number][]>();

  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums[i].length; j++) {
      const key = i + j;
      if (!diags.has(key)) diags.set(key, []);
      diags.get(key)!.push([i, nums[i][j]]);
    }
  }

  const result: number[] = [];
  // Process diagonals in order 0, 1, 2, ...
  const maxKey = Math.max(...diags.keys());
  for (let k = 0; k <= maxKey; k++) {
    const group = diags.get(k);
    if (!group) continue;
    // Sort by row descending (bottom rows first)
    group.sort((a, b) => b[0] - a[0]);
    for (const [, val] of group) result.push(val);
  }
  return result;
}

/** Solution 2: BFS-style — start from column 0 of each row
 * Visit (0, j) as starting points for each diagonal beginning at row j
 * Time: O(N) | Space: O(N)
 */
function findDiagonalOrder2(nums: number[][]): number[] {
  const result: number[] = [];
  // Groups indexed by diagonal = i + j; built in row order so already bottom-first within each diag when reversed
  const map: number[][] = [];

  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums[i].length; j++) {
      const d = i + j;
      if (!map[d]) map[d] = [];
      map[d].push(nums[i][j]);
    }
  }

  // Within each diagonal, we added rows 0,1,2... so reverse for bottom-up
  for (const diag of map) {
    if (diag) {
      for (let k = diag.length - 1; k >= 0; k--) {
        result.push(diag[k]);
      }
    }
  }
  return result;
}

// Test cases
console.log(
  findDiagonalOrder([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
); // [1,4,2,7,5,3,8,6,9]
console.log(findDiagonalOrder([[1, 2, 3, 4, 5], [6, 7], [8], [9, 10]])); // [1,6,2,8,7,3,9,4,10,5]
console.log(
  findDiagonalOrder2([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
); // [1,4,2,7,5,3,8,6,9]
console.log(findDiagonalOrder([[1], [2, 3], [4, 5, 6]])); // [1,2,4,3,5,6]
```

## 🔗 Related Problems

| Problem                                                                                | Relationship                                                  |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse)                   | Original version on rectangular matrix, alternating direction |
| [Sort the Matrix Diagonally](https://leetcode.com/problems/sort-the-matrix-diagonally) | Group by diagonal key (i-j), sort within group                |
| [Toeplitz Matrix](https://leetcode.com/problems/toeplitz-matrix)                       | Verify same value along each diagonal (i-j grouping)          |
