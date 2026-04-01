---
layout: page
title: "Reshape the Matrix"
difficulty: Easy
category: Array
tags: [Array, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/reshape-the-matrix"
---

# Reshape the Matrix / Biến Đổi Hình Dạng Ma Trận

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Matrix / Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) | [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy tưởng tượng bạn đang xếp trứng vào khay. Khay cũ có 2 hàng × 3 cột, khay mới có 3 hàng × 2 cột. Bạn chỉ cần lấy từng quả trứng ra theo thứ tự hàng-ngang rồi đặt vào khay mới theo cùng thứ tự — tổng số trứng không đổi, chỉ thay đổi cách sắp xếp.

**Pattern Recognition:**

- Signal: "reshape", "same elements", fixed dimensions → **Flatten + Rebuild**
- Key insight: mọi phần tử tại `(i, j)` trong ma trận có thể ánh xạ tuyến tính: `index = i * cols + j`, từ đó tính lại `(index / newCols, index % newCols)`

**Visual — Reshape [[1,2],[3,4]] to (1,4):**

```
Original (2×2):          Flatten:        Result (1×4):
┌───┬───┐               [1, 2, 3, 4]    ┌───┬───┬───┬───┐
│ 1 │ 2 │  ─────────►               ──►│ 1 │ 2 │ 3 │ 4 │
├───┼───┤   row-major                   └───┴───┴───┴───┘
│ 3 │ 4 │
└───┴───┘
index(i,j) = i*2+j       index→(r,c):
(0,0)=0 (0,1)=1          0→(0,0) 1→(0,1)
(1,0)=2 (1,1)=3          2→(0,2) 3→(0,3)
```

---

## 📝 Problem Description

Given an `m × n` matrix `mat`, reshape it into a new `r × c` matrix with the same elements in row-major order. If the reshape is impossible, return the original matrix.

**Example 1:** `mat = [[1,2],[3,4]], r = 1, c = 4` → `[[1,2,3,4]]`
**Example 2:** `mat = [[1,2],[3,4]], r = 2, c = 4` → `[[1,2],[3,4]]` (impossible, return original)

**Constraints:** `1 ≤ m, n ≤ 100`, `0 ≤ mat[i][j] ≤ 1000`, `1 ≤ r, c ≤ 300`

---

## 🎯 Interview Tips

1. **Check feasibility first** / Kiểm tra tính khả thi trước: tổng số phần tử `m*n === r*c`
2. **Index math** / Dùng phép tính chỉ số: `flatIndex = i*cols + j`, rồi `newRow = flat/c`, `newCol = flat%c`
3. **Two approaches** / Hai cách: flatten rồi rebuild, hoặc tính trực tiếp chỉ số — cả hai đều O(m\*n)
4. **No extra flatten needed** / Không cần tạo mảng phẳng: tính trực tiếp `(i*cols+j)/c` và `(i*cols+j)%c`
5. **Edge case** / Trường hợp đặc biệt: `r=m, c=n` — trả về bản sao ma trận gốc
6. **Follow-up** / Mở rộng: transpose hay rotate cũng dùng mapping tương tự nhưng công thức khác

---

## 💡 Solutions

### Approach 1: Flatten Array — Brute Force

/\*_ @complexity Time: O(m×n) | Space: O(m×n) _/

```typescript
function matrixReshapeBrute(mat: number[][], r: number, c: number): number[][] {
  const m = mat.length,
    n = mat[0].length;
  if (m * n !== r * c) return mat;

  // Step 1: flatten to 1D
  const flat: number[] = [];
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) flat.push(mat[i][j]);

  // Step 2: rebuild into r×c
  const result: number[][] = [];
  for (let i = 0; i < r; i++) {
    result.push(flat.slice(i * c, i * c + c));
  }
  return result;
}
```

### Approach 2: Direct Index Mapping — Optimal

/\*_ @complexity Time: O(m×n) | Space: O(r×c) output only _/

```typescript
function matrixReshape(mat: number[][], r: number, c: number): number[][] {
  const m = mat.length,
    n = mat[0].length;
  if (m * n !== r * c) return mat;

  // Pre-allocate result matrix
  const result: number[][] = Array.from({ length: r }, () => new Array(c).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const flat = i * n + j; // linear index in original
      result[Math.floor(flat / c)][flat % c] = mat[i][j];
    }
  }
  return result;
}
```

---

## 🧪 Test Cases

```typescript
console.log(
  matrixReshape(
    [
      [1, 2],
      [3, 4],
    ],
    1,
    4,
  ),
); // → [[1,2,3,4]]
console.log(
  matrixReshape(
    [
      [1, 2],
      [3, 4],
    ],
    2,
    4,
  ),
); // → [[1,2],[3,4]] (impossible)
console.log(
  matrixReshape(
    [
      [1, 2, 3],
      [4, 5, 6],
    ],
    3,
    2,
  ),
); // → [[1,2],[3,4],[5,6]]
console.log(matrixReshape([[1]], 1, 1)); // → [[1]]
console.log(
  matrixReshapeBrute(
    [
      [1, 2],
      [3, 4],
    ],
    4,
    1,
  ),
); // → [[1],[2],[3],[4]]
```

---

## Related Problems

| Problem                                                            | Difficulty | Pattern          |
| ------------------------------------------------------------------ | ---------- | ---------------- |
| [Spiral Matrix](https://leetcode.com/problems/spiral-matrix)       | Medium     | Matrix Traversal |
| [Transpose Matrix](https://leetcode.com/problems/transpose-matrix) | Easy       | Matrix Mapping   |
| [Rotate Image](https://leetcode.com/problems/rotate-image)         | Medium     | In-place Matrix  |
