---
layout: page
title: "Sparse Matrix Multiplication"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Matrix]
leetcode_url: "https://leetcode.com/problems/sparse-matrix-multiplication"
---

# Sparse Matrix Multiplication / Nhân Ma Trận Thưa

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula) | [Minimum Operations to Write the Letter Y on a Grid](https://leetcode.com/problems/minimum-operations-to-write-the-letter-y-on-a-grid)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống **sách thưa trang trống** — hầu hết ô đều là 0. Nhân thông thường lãng phí tính `0 × x = 0`. Chỉ tính khi **cả hai nhân tử ≠ 0**.

**Key:** `C[i][j] = Σ_k A[i][k] × B[k][j]`. Skip khi A[i][k]=0, tiết kiệm phần lớn phép tính trong ma trận thưa.

```
A = [[1,0,0],     B = [[7,0,0],
     [-1,0,3]]         [0,0,0],
                        [0,0,1]]
i=0,k=0: A[0][0]=1≠0 → j=0: B[0][0]=7 → C[0][0]+=7
         k=1: A[0][1]=0 → skip
         k=2: A[0][2]=0 → skip
i=1,k=0: A[1][0]=-1≠0 → C[1][0]+=-7
         k=2: A[1][2]=3≠0 → C[1][2]+=3
Result: [[7,0,0],[-7,0,3]]
```

---

## Problem Description / Mô Tả Bài Toán

Cho hai ma trận `mat1` (m×k) và `mat2` (k×n), phần lớn phần tử là 0. Trả về tích `mat1 × mat2` (m×n), bỏ qua phép tính với số 0.

- **Input:** `mat1=[[1,0,0],[-1,0,3]], mat2=[[7,0,0],[0,0,0],[0,0,1]]` → **Output:** `[[7,0,0],[-7,0,3]]`

**Constraints:** `1 <= m, n, k <= 100`, `-100 <= mat[i][j] <= 100`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Skip inner loop when mat1[i][k] == 0 — biggest win for sparse matrices. **VI:** Bỏ qua vòng lặp trong khi mat1[i][k]=0 — tiết kiệm nhiều nhất.
2. **EN:** Standard matrix multiply O(m×k×n); sparse version is the same worst case but much faster in practice. **VI:** Worst case vẫn O(m×k×n) nhưng nhanh hơn nhiều trong thực tế.
3. **EN:** Precompute non-zero indices of mat1 per row for cleaner code. **VI:** Tính trước vị trí khác 0 của mat1 theo hàng.
4. **EN:** For very large sparse matrices: store as list of (row, col, val) triples. **VI:** Ma trận thưa rất lớn → lưu dạng (row, col, val).
5. **EN:** The result matrix is not necessarily sparse. **VI:** Ma trận kết quả không nhất thiết thưa.
6. **EN:** Mention CSR (Compressed Sparse Row) as a follow-up format. **VI:** Đề cập CSR trong câu mở rộng.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Skip Zeros (Optimized)  O(m*k*n) worst, fast in practice ────
function multiply(mat1: number[][], mat2: number[][]): number[][] {
  const m = mat1.length,
    k = mat1[0].length,
    n = mat2[0].length;
  const result: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));

  for (let i = 0; i < m; i++) {
    for (let p = 0; p < k; p++) {
      if (mat1[i][p] === 0) continue; // skip zero row element in mat1
      for (let j = 0; j < n; j++) {
        if (mat2[p][j] === 0) continue; // skip zero column element in mat2
        result[i][j] += mat1[i][p] * mat2[p][j];
      }
    }
  }

  return result;
}

// ─── Solution 2: Hashmap Precomputation (scales well for very sparse) ─────────
function multiplyHashmap(mat1: number[][], mat2: number[][]): number[][] {
  const m = mat1.length,
    k = mat1[0].length,
    n = mat2[0].length;
  const result: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));

  // Build mat2 lookup: row p → list of [col j, value]
  const mat2ByRow = new Map<number, Array<[number, number]>>();
  for (let p = 0; p < k; p++) {
    for (let j = 0; j < n; j++) {
      if (mat2[p][j] !== 0) {
        if (!mat2ByRow.has(p)) mat2ByRow.set(p, []);
        mat2ByRow.get(p)!.push([j, mat2[p][j]]);
      }
    }
  }

  // Multiply using non-zero entries only
  for (let i = 0; i < m; i++) {
    for (let p = 0; p < k; p++) {
      if (mat1[i][p] === 0) continue;
      for (const [j, v2] of mat2ByRow.get(p) ?? []) {
        result[i][j] += mat1[i][p] * v2;
      }
    }
  }

  return result;
}

// ─── Tests ───────────────────────────────────────────────────────────────────
const A = [
  [1, 0, 0],
  [-1, 0, 3],
];
const B = [
  [7, 0, 0],
  [0, 0, 0],
  [0, 0, 1],
];
console.log(multiply(A, B)); // [[7,0,0],[-7,0,3]]
console.log(
  multiply(
    [
      [1, 0],
      [0, 0],
    ],
    [
      [0, 0],
      [0, 0],
    ],
  ),
); // [[0,0],[0,0]]
console.log(multiplyHashmap(A, B)); // [[7,0,0],[-7,0,3]]
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                        | Difficulty | Pattern |
| ---- | ------------------------------------------------------------------------------ | ---------- | ------- |
| 74   | [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix)         | 🟡 Medium  | Matrix  |
| 54   | [Spiral Matrix](https://leetcode.com/problems/spiral-matrix)                   | 🟡 Medium  | Matrix  |
| 1901 | [Find a Peak Element II](https://leetcode.com/problems/find-a-peak-element-ii) | 🟡 Medium  | Matrix  |
