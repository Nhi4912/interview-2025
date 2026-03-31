---
layout: page
title: "Modify the Matrix"
difficulty: Easy
category: Array
tags: [Array, Matrix]
leetcode_url: "https://leetcode.com/problems/modify-the-matrix"
---

# Modify the Matrix / Chỉnh Sửa Ma Trận

🟢 Easy | Array · Matrix | LeetCode #3033

## 🧠 Intuition / Tư Duy

**Vietnamese:** Như điền ô trống trong bảng — mỗi `-1` cần được thay bằng giá trị lớn nhất trong cùng cột. Duyệt mỗi cột một lần để tìm max, sau đó thay thế các ô `-1`.

```
matrix = [[1,-1,2],
          [4,-1,6],
          [7, 8, 9]]

Column 0: max=7, no -1
Column 1: max=8, replace -1 at rows 0,1 → [8,8,8]
Column 2: max=9, no -1

Result: [[1,8,2],
         [4,8,6],
         [7,8,9]]
```

## Problem Description

Given a 0-indexed `m×n` integer matrix, replace every `-1` with the **maximum value in its column**. Return the modified matrix.

Two-pass approach per column: first find the column max (ignoring -1), then replace all -1s.

**Example 1:**

```
matrix=[[1,-1,2],[4,-1,6],[7,8,9]]
Output: [[1,8,2],[4,8,6],[7,8,9]]
```

**Example 2:**

```
matrix=[[3,-1],[5,2]]
Output: [[3,2],[5,2]]
```

## 📝 Interview Tips

- **🔑 Column-wise traversal / Duyệt theo cột:** Process column by column — find max first, then replace -1s
- **🎯 Two-pass / Hai lượt:** Pass 1: find column max ignoring -1. Pass 2: replace -1 with that max
- **⚠️ -1 in max / -1 khi tìm max:** Skip -1 values when computing column max (`filter` or conditional max)
- **🔄 In-place modification / Sửa tại chỗ:** Can modify the input matrix directly — no need for extra matrix
- **📊 Complexity / Độ phức tạp:** O(m×n) time — each cell visited twice; O(1) extra space
- **🌟 Row version / Phiên bản theo hàng:** If problem asked for row max instead, same approach transposed

## Solutions

```typescript
/**
 * Approach 1: Two-pass column scan — find max then replace
 * Time: O(m*n)
 * Space: O(1) extra (modifies in place)
 */
function modifiedMatrix(matrix: number[][]): number[][] {
  const m = matrix.length;
  const n = matrix[0].length;

  for (let col = 0; col < n; col++) {
    // Pass 1: find column max (skip -1)
    let colMax = -Infinity;
    for (let row = 0; row < m; row++) {
      if (matrix[row][col] !== -1) {
        colMax = Math.max(colMax, matrix[row][col]);
      }
    }
    // Pass 2: replace -1 with column max
    for (let row = 0; row < m; row++) {
      if (matrix[row][col] === -1) {
        matrix[row][col] = colMax;
      }
    }
  }

  return matrix;
}

console.log(
  modifiedMatrix([
    [1, -1, 2],
    [4, -1, 6],
    [7, 8, 9],
  ]),
);
// [[1,8,2],[4,8,6],[7,8,9]]
console.log(
  modifiedMatrix([
    [3, -1],
    [5, 2],
  ]),
);
// [[3,2],[5,2]]
console.log(modifiedMatrix([[-1]]));
// [[-1]] (no other value in column)
```

```typescript
/**
 * Approach 2: Precompute all column maxes first
 * Time: O(m*n)
 * Space: O(n) for columnMax array
 */
function modifiedMatrixV2(matrix: number[][]): number[][] {
  const m = matrix.length;
  const n = matrix[0].length;

  // Compute all column maxes in one pass
  const colMax = new Array(n).fill(-Infinity);
  for (let row = 0; row < m; row++) {
    for (let col = 0; col < n; col++) {
      if (matrix[row][col] !== -1) {
        colMax[col] = Math.max(colMax[col], matrix[row][col]);
      }
    }
  }

  // Second pass: replace -1
  for (let row = 0; row < m; row++) {
    for (let col = 0; col < n; col++) {
      if (matrix[row][col] === -1) {
        matrix[row][col] = colMax[col];
      }
    }
  }

  return matrix;
}

console.log(
  modifiedMatrixV2([
    [1, -1, 2],
    [4, -1, 6],
    [7, 8, 9],
  ]),
);
// [[1,8,2],[4,8,6],[7,8,9]]
```

## 🔗 Related Problems

| Problem                                                                 | Difficulty | Pattern          |
| ----------------------------------------------------------------------- | ---------- | ---------------- |
| [Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes/)   | 🟡 Medium  | Matrix           |
| [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/)           | 🟡 Medium  | Matrix Traversal |
| [Transpose Matrix](https://leetcode.com/problems/transpose-matrix/)     | 🟢 Easy    | Matrix           |
| [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/) | 🟡 Medium  | Binary Search    |
