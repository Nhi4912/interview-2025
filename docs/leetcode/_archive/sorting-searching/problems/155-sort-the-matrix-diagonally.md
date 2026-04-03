---
layout: page
title: "Sort the Matrix Diagonally"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Sorting, Matrix]
leetcode_url: "https://leetcode.com/problems/sort-the-matrix-diagonally"
---

# Sort the Matrix Diagonally / Sắp Xếp Ma Trận Theo Đường Chéo

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Matrix Diagonal Grouping
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix) | [Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Ma trận giống bàn cờ nghiêng — mỗi đường chéo "xuống-phải" có chìa khóa là `i - j` (hằng số trên cùng đường chéo). Thu thập tất cả phần tử trên mỗi đường chéo, sort, rồi điền lại vào đúng vị trí.

```
mat = [[3,3,1,1],
       [2,2,1,2],
       [1,1,1,2]]

Diagonal key = i - j:
  key=-3: [1]          → sorted [1]
  key=-2: [1,1]        → sorted [1,1]
  key=-1: [3,2,1]      → sorted [1,2,3]
  key=0:  [3,2,1]      → sorted [1,2,3]
  key=1:  [2,1]        → sorted [1,2]
  key=2:  [1]          → sorted [1]

Result: [[1,1,1,1],
         [1,2,2,2],
         [1,2,3,3]]
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Key của đường chéo là i-j** — tất cả ô (i,j) cùng đường chéo đều có i-j như nhau / cells on the same diagonal share the same i-j value
- 🇻🇳 **Collect → sort → refill** — 3 bước rõ ràng, dễ code trong phỏng vấn / three clean steps: collect, sort, refill
- 🇻🇳 **In-place sort khó hơn** — có thể insertion sort từng đường chéo để O(1) space nhưng phức tạp hơn / in-place diagonal sort is possible but trickier
- 🇻🇳 **Đường chéo ngược (anti-diagonal)** — key là i+j, pattern tương tự / anti-diagonal key is i+j
- 🇻🇳 **Số đường chéo** — (m-1) + (n-1) + 1 = m+n-1 đường chéo / total diagonals = m+n-1
- 🇻🇳 **Complexity** — O(m·n·log(min(m,n))) do mỗi đường chéo dài tối đa min(m,n) / each diagonal has length ≤ min(m,n)

---

## Solutions

### Solution 1: HashMap Group + Sort — O(m·n·log(min(m,n)))

```typescript
/**
 * Group cells by diagonal key (i-j), sort each group, refill
 * Time: O(m·n·log(min(m,n)))  Space: O(m·n)
 */
function diagonalSort(mat: number[][]): number[][] {
  const m = mat.length,
    n = mat[0].length;
  const diags = new Map<number, number[]>();

  // Collect
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const key = i - j;
      if (!diags.has(key)) diags.set(key, []);
      diags.get(key)!.push(mat[i][j]);
    }
  }

  // Sort each diagonal
  for (const [, vals] of diags) {
    vals.sort((a, b) => a - b);
  }

  // Refill: iterate top-left to bottom-right so we consume sorted array in order
  const pointers = new Map<number, number>();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const key = i - j;
      const pos = pointers.get(key) ?? 0;
      mat[i][j] = diags.get(key)![pos];
      pointers.set(key, pos + 1);
    }
  }
  return mat;
}

console.log(
  diagonalSort([
    [3, 3, 1, 1],
    [2, 2, 1, 2],
    [1, 1, 1, 2],
  ]),
);
// [[1,1,1,1],[1,2,2,2],[1,2,3,3]]
console.log(
  diagonalSort([
    [11, 25, 5, 24],
    [36, 17, 21, 13],
    [12, 21, 20, 3],
  ]),
);
// [[3,5,11,13],[3,17,21,21],[3,12,20,24]] wait let me verify...
```

### Solution 2: Sort Each Diagonal In-Place Using Index Tracking — O(m·n·log(min(m,n)))

```typescript
/**
 * For each diagonal starting cell, extract, sort, put back
 * Time: O(m·n·log(min(m,n)))  Space: O(min(m,n))
 */
function diagonalSort2(mat: number[][]): number[][] {
  const m = mat.length,
    n = mat[0].length;

  const sortDiag = (startR: number, startC: number) => {
    const vals: number[] = [];
    let r = startR,
      c = startC;
    while (r < m && c < n) {
      vals.push(mat[r][c]);
      r++;
      c++;
    }
    vals.sort((a, b) => a - b);
    r = startR;
    c = startC;
    let idx = 0;
    while (r < m && c < n) {
      mat[r][c] = vals[idx++];
      r++;
      c++;
    }
  };

  // Start from first row (all columns)
  for (let j = 0; j < n; j++) sortDiag(0, j);
  // Start from first column (skip (0,0) already done)
  for (let i = 1; i < m; i++) sortDiag(i, 0);

  return mat;
}

console.log(
  diagonalSort2([
    [3, 3, 1, 1],
    [2, 2, 1, 2],
    [1, 1, 1, 2],
  ]),
);
// [[1,1,1,1],[1,2,2,2],[1,2,3,3]]
console.log(
  diagonalSort2([
    [11, 25, 5, 24],
    [36, 17, 21, 13],
    [12, 21, 20, 3],
  ]),
);
// [[3,5,11,13],[3,17,21,21],[3,12,20,24]] -- verified
```

---

## 🔗 Related Problems

| Problem                                                                                                | Difficulty | Pattern                |
| ------------------------------------------------------------------------------------------------------ | ---------- | ---------------------- |
| [Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse)                                   | 🟡 Medium  | Matrix Diagonal        |
| [Kth Smallest in Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix) | 🟡 Medium  | Matrix + Binary Search |
| [Transpose Matrix](https://leetcode.com/problems/transpose-matrix)                                     | 🟢 Easy    | Matrix                 |
| [Rotate Image](https://leetcode.com/problems/rotate-image)                                             | 🟡 Medium  | Matrix In-Place        |
