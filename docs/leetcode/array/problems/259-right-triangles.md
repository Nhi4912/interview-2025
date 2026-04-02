---
layout: page
title: "Right Triangles"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Math, Combinatorics, Counting]
leetcode_url: "https://leetcode.com/problems/right-triangles"
---

# Right Triangles / Tam Giác Vuông

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Counting / Combinatorics
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Count Nice Pairs in an Array](https://leetcode.com/problems/count-nice-pairs-in-an-array) | [Number of Rectangles That Can Form The Largest Square](https://leetcode.com/problems/number-of-rectangles-that-can-form-the-largest-square)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một bản đồ thành phố dạng lưới, mỗi ô có thể có đèn đường (1) hoặc không (0). Bạn muốn đếm số lượng "ngã tư hình chữ L" — tức ba cột đèn tạo thành góc vuông. Đỉnh góc vuông luôn là điểm giao của một hàng và một cột. Thay vì kiểm tra từng bộ ba, ta nhận ra: mỗi đèn (r,c) có thể là đỉnh góc vuông với (rowCount[r] - 1) đèn cùng hàng và (colCount[c] - 1) đèn cùng cột — nhân lại ta ra số tam giác có đỉnh tại đó.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Right Triangles example:**

```
grid = [[0,1,0],      rowCount = [1, 2, 1]
        [1,1,1],      colCount = [1, 3, 1]
        [0,1,0]]

Cell (1,1)=1: rowCount[1]=2, colCount[1]=3
  → (2-1) * (3-1) = 1 * 2 = 2 triangles

Cell (1,0)=1: rowCount[1]=2, colCount[0]=1
  → (2-1) * (1-1) = 0

Cell (0,1)=1: rowCount[0]=1, colCount[1]=3
  → (1-1) * (3-1) = 0

Total = 2 ✓
```

---

## Problem Description

Given an `m x n` 2D binary grid, return the number of **right triangles** that can be formed from three cells (all value `1`). The right angle vertex shares its row with one cell and its column with the third cell.

**Example 1:** `grid = [[0,1,0],[0,1,1],[0,1,0]]` → `2`
**Example 2:** `grid = [[1,0,0],[0,1,0],[0,0,1]]` → `0`
**Example 3:** `grid = [[1,1],[1,1]]` → `4`

**Constraints:** `1 ≤ m, n ≤ 1000`, `grid[i][j] ∈ {0, 1}`

---

## 📝 Interview Tips

- **Combinatorics insight** / Tư duy tổ hợp: Mỗi ô `(r,c)=1` là đỉnh góc vuông → đóng góp `(rowCount[r]-1) * (colCount[c]-1)` tam giác
- **Precompute row/col counts** / Đếm trước: Duyệt một lần để tính `rowCount[]` và `colCount[]` → tổng O(m\*n)
- **Why subtract 1** / Tại sao trừ 1: Phải loại bỏ chính ô đó khỏi hàng và cột của nó
- **Overflow guard** / Tránh tràn số: Tích `(rowCount-1)*(colCount-1)` có thể lớn, dùng `number` JS là đủ với m,n≤1000
- **Brute O(m²n²)** / Brute force: Duyệt mọi cặp ô cùng hàng + mọi ô cùng cột — quá chậm
- **Edge case** / Trường hợp đặc biệt: Hàng hoặc cột chỉ có 1 ô value 1 → không tạo được tam giác từ đỉnh đó

---

## Solutions

```typescript
/**
 * @complexity Time: O(m²·n²) | Space: O(1)
 * For each cell=1 as right-angle vertex, try all row+col combos
 */
function rightTrianglesBrute(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  let count = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] !== 1) continue;
      for (let c2 = 0; c2 < n; c2++) {
        if (c2 !== c && grid[r][c2] === 1) {
          for (let r2 = 0; r2 < m; r2++) {
            if (r2 !== r && grid[r2][c] === 1) count++;
          }
        }
      }
    }
  }
  return count;
}

/**
 * @complexity Time: O(m·n) | Space: O(m+n)
 * For each cell (r,c)=1: triangles = (rowCount[r]-1) * (colCount[c]-1)
 */
function rightTriangles(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const rowCount = new Array(m).fill(0);
  const colCount = new Array(n).fill(0);

  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (grid[r][c] === 1) {
        rowCount[r]++;
        colCount[c]++;
      }

  let count = 0;
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (grid[r][c] === 1) count += (rowCount[r] - 1) * (colCount[c] - 1);

  return count;
}

// === Test Cases ===
console.log(
  rightTriangles([
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
  ]),
); // → 2
console.log(
  rightTriangles([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]),
); // → 0
console.log(
  rightTriangles([
    [1, 1],
    [1, 1],
  ]),
); // → 4
console.log(rightTriangles([[1]])); // → 0 (single cell)
console.log(
  rightTrianglesBrute([
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
  ]),
); // → 2
```

---

## 🔗 Related Problems

| Problem                                | Difficulty | Link                                                                            |
| -------------------------------------- | ---------- | ------------------------------------------------------------------------------- |
| Count Nice Pairs in an Array           | Medium     | [LC 1814](https://leetcode.com/problems/count-nice-pairs-in-an-array)           |
| Number of Boomerangs                   | Medium     | [LC 447](https://leetcode.com/problems/number-of-boomerangs)                    |
| Count Square Submatrices with All Ones | Medium     | [LC 1277](https://leetcode.com/problems/count-square-submatrices-with-all-ones) |
