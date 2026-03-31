---
layout: page
title: "Range Sum Query 2D - Immutable"
difficulty: Medium
category: Design
tags: [Array, Design, Matrix, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/range-sum-query-2d-immutable"
---

# Range Sum Query 2D - Immutable / Truy Vấn Tổng Vùng Ma Trận 2D

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum (2D)
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula) | [Maximum Sum of an Hourglass](https://leetcode.com/problems/maximum-sum-of-an-hourglass)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bản đồ địa hình tích luỹ — mỗi ô lưu tổng tất cả ô từ góc trên-trái đến ô đó. Khi cần tổng bất kỳ hình chữ nhật nào, chỉ cần 4 phép toán O(1) nhờ inclusion-exclusion.

**Pattern Recognition:**

- Signal: "multiple range queries" + "matrix" + "immutable" → **2D Prefix Sum**
- Key insight: `prefix[i][j]` = tổng tất cả ô trong `[0..i-1][0..j-1]` (1-indexed với padding)
- Query formula: `sum(r1,c1,r2,c2) = P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]`

**Visual — Prefix Sum construction:**

```
Matrix:          Prefix (1-indexed with zero-pad row/col):
3  0  1  4       0  0  0  0  0
5  6  3  2       0  3  3  4  8
1  2  0  1  →   0  8 14 18 24
2  7  0  6       0  9 17 21 28
                 0 11 26 30 40

sumRegion(2,1,4,3) — rows 2-4, cols 1-3 (0-indexed)
= P[5][4] - P[2][4] - P[5][1] + P[2][1]
= 40      - 8       - 11      + 3  = 24 ✅
```

---

## Problem Description

Handle multiple rectangle sum queries on an immutable 2D matrix. ([LeetCode #304](https://leetcode.com/problems/range-sum-query-2d-immutable))

Difficulty: Medium | Acceptance: 56.5%

- `NumMatrix(matrix)` — preprocess once
- `sumRegion(row1, col1, row2, col2)` → sum of all elements inside `[row1,col1]..[row2,col2]`

**Example:**

```
matrix = [
  [3, 0, 1, 4, 2],
  [5, 6, 3, 2, 1],
  [1, 2, 0, 1, 5],
  [4, 1, 0, 1, 7],
  [1, 0, 3, 0, 5]
]
sumRegion(2,1,4,3) → 8
sumRegion(1,1,2,2) → 11
sumRegion(1,2,2,4) → 12
```

Constraints: `1 ≤ m,n ≤ 200`, `−10^4 ≤ matrix[i][j] ≤ 10^4`, up to `10^4` queries

---

## 📝 Interview Tips

1. **Clarify**: "Queries nhiều hay ít? Matrix thay đổi không?" / Many queries + immutable → always prefix sum
2. **Brute force**: "O(m\*n) mỗi query → TLE với 10^4 queries" / Nested loop per query is too slow
3. **2D prefix**: "Xây dựng prefix O(m\*n), mỗi query O(1) với inclusion-exclusion" / Build once, query forever
4. **Padding trick**: "Thêm hàng/cột 0 ở đầu để tránh out-of-bounds khi tính prefix" / 1-indexed prefix avoids edge checks
5. **Formula**: "`P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]`" / Memorise this inclusion-exclusion
6. **Follow-up**: "Mutable matrix? → Binary Indexed Tree 2D or segment tree" / Updates require BIT/segment tree

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — recompute each query
 * Time: O(m*n) per query
 * Space: O(1) extra (stores matrix reference)
 */
class NumMatrixBrute {
  constructor(private matrix: number[][]) {}

  sumRegion(row1: number, col1: number, row2: number, col2: number): number {
    let sum = 0;
    for (let r = row1; r <= row2; r++) for (let c = col1; c <= col2; c++) sum += this.matrix[r][c];
    return sum;
  }
}

/**
 * Solution 2: 2D Prefix Sum (Optimal)
 * Time: O(m*n) constructor, O(1) per query
 * Space: O(m*n) for prefix table
 *
 * prefix[i][j] = sum of matrix[0..i-1][0..j-1]  (1-indexed, 0-padded border)
 * Build: prefix[i][j] = matrix[i-1][j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]
 * Query: P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]
 */
class NumMatrix {
  private prefix: number[][];

  constructor(matrix: number[][]) {
    const m = matrix.length,
      n = matrix[0].length;
    // 1-indexed prefix with zero border row and column
    this.prefix = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        this.prefix[i][j] =
          matrix[i - 1][j - 1] +
          this.prefix[i - 1][j] +
          this.prefix[i][j - 1] -
          this.prefix[i - 1][j - 1];
      }
    }
  }

  // row1,col1,row2,col2 are 0-indexed in the original matrix
  sumRegion(row1: number, col1: number, row2: number, col2: number): number {
    const p = this.prefix;
    return p[row2 + 1][col2 + 1] - p[row1][col2 + 1] - p[row2 + 1][col1] + p[row1][col1];
  }
}

// === Test Cases ===
const nm = new NumMatrix([
  [3, 0, 1, 4, 2],
  [5, 6, 3, 2, 1],
  [1, 2, 0, 1, 5],
  [4, 1, 0, 1, 7],
  [1, 0, 3, 0, 5],
]);
console.log(nm.sumRegion(2, 1, 4, 3)); // 8
console.log(nm.sumRegion(1, 1, 2, 2)); // 11
console.log(nm.sumRegion(1, 2, 2, 4)); // 12

// Edge: single cell
const nm2 = new NumMatrix([[5]]);
console.log(nm2.sumRegion(0, 0, 0, 0)); // 5
```

---

## 🔗 Related Problems

- [Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable) — 1D version (simpler)
- [Maximum Sum of an Hourglass](https://leetcode.com/problems/maximum-sum-of-an-hourglass) — 2D prefix sum application
- [Subrectangle Queries](https://leetcode.com/problems/subrectangle-queries) — mutable version (Design)
- [Product of the Last K Numbers](https://leetcode.com/problems/product-of-the-last-k-numbers) — prefix product variant
- [Range Sum Query 2D - Immutable — LeetCode](https://leetcode.com/problems/range-sum-query-2d-immutable) — problem page
