---
layout: page
title: "Get Biggest Three Rhombus Sums in a Grid"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Math, Sorting, Heap (Priority Queue), Matrix]
leetcode_url: "https://leetcode.com/problems/get-biggest-three-rhombus-sums-in-a-grid"
---

# Get Biggest Three Rhombus Sums in a Grid / Ba Tổng Hình Thoi Lớn Nhất Trong Lưới

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Diagonal Prefix Sum + Top-K
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) | [Best Meeting Point](https://leetcode.com/problems/best-meeting-point)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như tính chu vi hình thoi vẽ trên giấy kẻ ô vuông — thay vì đi từng bước một, ta dùng "tổng tiền tố đường chéo" để tính mỗi cạnh trong O(1). Bốn cạnh hình thoi đều là các đoạn chéo ↘ hoặc ↙.

**Pattern Recognition:**

- Signal: "sum of border of rhombus" on grid → **Diagonal Prefix Sum**
- Size-0 rhombus = single cell; size-k = diamond with half-diagonal k
- Key insight: precompute `dl[r][c]` (↘ prefix) và `dr[r][c]` (↙ prefix) để query mỗi cạnh O(1)

**Visual — rhombus size=1 centered at (1,1) in 3×3 grid:**

```
     col  0  1  2
row 0:       T(0,1)
row 1:  L(1,0)  R(1,2)
row 2:       B(2,1)

Top-Right side  = T→R = dl[1][2] - dl[0][1]   (↘ diagonal)
Right-Bottom    = R→B = dr[2][1] - dr[1][2]   (↙ diagonal)
Bottom-Left     = B→L = dl[2][1] - dl[1][0]   (↘ reversed, use dl)
Left-Top        = L→T = dr[1][0] - dr[0][1]   (↙ reversed)
subtract 4 corner vertices counted twice
```

---

## Problem Description

Given an `m×n` integer matrix `grid`, return the **3 largest unique rhombus border sums**. A size-k rhombus centered at `(r,c)` has top at `(r-k,c)`, left at `(r,c-k)`, etc. Size-0 = single cell. Return fewer than 3 if fewer unique sums exist. ([LeetCode 1878](https://leetcode.com/problems/get-biggest-three-rhombus-sums-in-a-grid))

Difficulty: Medium | Acceptance: 49.3%

```
Example 1: grid=[[3,4,5,1,3],[3,3,4,2,3],[20,30,200,40,10],[1,5,5,4,1],[4,3,2,2,5]]
           → [228,216,211]
Example 2: grid=[[1,2,1],[2,3,2],[1,2,1]]  → [8,3,2]
Example 3: grid=[[7,7,7]]  → [7]
```

Constraints: `m, n ∈ [1,50]`, `grid[i][j] ∈ [1,10^5]`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Rhombus có tính ô bên trong không?" → Chỉ tính viền border, không tính interior
2. **Size 0 / Kích thước 0**: Đừng quên size=0 là single cell — đây thường là edge case bị bỏ sót
3. **Diagonal prefix / Tiền tố chéo**: Precompute dl[r][c] theo hướng ↘ và dr[r][c] theo hướng ↙ để query O(1)
4. **Top-K unique / Giá trị duy nhất**: Dùng Set + sort để giữ top-3 unique; khi >3 phần tử, loại bỏ nhỏ nhất
5. **Vertex deduplication / Trừ đỉnh**: 4 cạnh dùng prefix sum sẽ đếm 4 đỉnh 2 lần — nhớ trừ đi
6. **Complexity / Độ phức tạp**: O(m·n·min(m,n)) with diagonal prefix — vs O(m·n·k²) brute force

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — walk border of each rhombus cell by cell
 * Time: O(m * n * min(m,n)^2)  Space: O(1) extra
 */
function getBiggestThreeBrute(grid: number[][]): number[] {
  const m = grid.length,
    n = grid[0].length;
  const candidates: number[] = [];

  const addUnique = (v: number) => {
    if (!candidates.includes(v)) candidates.push(v);
    candidates.sort((a, b) => b - a);
    if (candidates.length > 3) candidates.pop();
  };

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      addUnique(grid[r][c]); // size 0
      for (let k = 1; r - k >= 0 && r + k < m && c - k >= 0 && c + k < n; k++) {
        let sum = 0;
        for (let d = 0; d < k; d++) {
          sum += grid[r - k + d][c + d]; // top → right
          sum += grid[r + d][c + k - d]; // right → bottom
          sum += grid[r + k - d][c - d]; // bottom → left
          sum += grid[r - d][c - k + d]; // left → top
        }
        addUnique(sum);
      }
    }
  }
  return candidates;
}

/**
 * Solution 2: Diagonal Prefix Sum (Optimal)
 * Time: O(m * n * min(m,n))  Space: O(m * n)
 *
 * dl[r][c] = prefix sum along ↘ diagonal up to row r, col c (1-indexed)
 * dr[r][c] = prefix sum along ↙ diagonal up to row r, col c (1-indexed)
 * Rhombus size k centered at (r,c) (1-indexed):
 *   top-right edge = dl[r][c+k] - dl[r-k-1][c-1]   but vertex at (r,c+k) in two edges
 */
function getBiggestThree(grid: number[][]): number[] {
  const m = grid.length,
    n = grid[0].length;
  // 1-indexed, extra padding so dl[r-1][c-1] is safe
  const dl = Array.from({ length: m + 2 }, () => new Array(n + 2).fill(0));
  const dr = Array.from({ length: m + 2 }, () => new Array(n + 2).fill(0));

  for (let r = 1; r <= m; r++) {
    for (let c = 1; c <= n; c++) {
      dl[r][c] = dl[r - 1][c - 1] + grid[r - 1][c - 1];
      dr[r][c] = dr[r - 1][c + 1] + grid[r - 1][c - 1];
    }
  }

  // Sum of ↘ diagonal from (r1,c1) to (r2,c2) inclusive (1-indexed)
  const qDL = (r1: number, c1: number, r2: number, c2: number) => dl[r2][c2] - dl[r1 - 1][c1 - 1];
  // Sum of ↙ diagonal from (r1,c1) to (r2,c2) inclusive (1-indexed, c decreases)
  const qDR = (r1: number, c1: number, r2: number, c2: number) => dr[r2][c2] - dr[r1 - 1][c1 + 1];

  const top3 = new Set<number>();
  const addTop3 = (v: number) => {
    top3.add(v);
    if (top3.size > 3) {
      const arr = [...top3].sort((a, b) => a - b);
      top3.delete(arr[0]);
    }
  };

  for (let r = 1; r <= m; r++) {
    for (let c = 1; c <= n; c++) {
      addTop3(grid[r - 1][c - 1]); // size 0
      for (let k = 1; r - k >= 1 && r + k <= m && c - k >= 1 && c + k <= n; k++) {
        // 4 sides, vertices at: top(r-k,c), right(r,c+k), bottom(r+k,c), left(r,c-k)
        const topRight = qDL(r - k, c, r, c + k); // ↘: top → right
        const rightBot = qDR(r, c + k, r + k, c); // ↙: right → bottom
        const botLeft = qDL(r, c - k, r + k, c); // ↘: left → bottom (reversed)
        const leftTop = qDR(r - k, c, r, c - k); // ↙: top → left (reversed)
        // Each vertex is counted in two sides → subtract once
        const rhombusSum =
          topRight +
          rightBot +
          botLeft +
          leftTop -
          grid[r - k - 1][c - 1] - // top vertex
          grid[r - 1][c + k - 1] - // right vertex
          grid[r + k - 1][c - 1] - // bottom vertex
          grid[r - 1][c - k - 1]; // left vertex
        addTop3(rhombusSum);
      }
    }
  }
  return [...top3].sort((a, b) => b - a);
}

// === Tests ===
console.log(
  JSON.stringify(
    getBiggestThree([
      [3, 4, 5, 1, 3],
      [3, 3, 4, 2, 3],
      [20, 30, 200, 40, 10],
      [1, 5, 5, 4, 1],
      [4, 3, 2, 2, 5],
    ]),
  ),
); // [228,216,211]
console.log(
  JSON.stringify(
    getBiggestThree([
      [1, 2, 1],
      [2, 3, 2],
      [1, 2, 1],
    ]),
  ),
); // [8,3,2]
console.log(JSON.stringify(getBiggestThree([[7, 7, 7]]))); // [7]
console.log(
  JSON.stringify(
    getBiggestThreeBrute([
      [1, 2, 1],
      [2, 3, 2],
      [1, 2, 1],
    ]),
  ),
); // [8,3,2]
```

---

## 🔗 Related Problems

| Problem                                                                                                                   | Relationship                  |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| [1878. Get Biggest Three Rhombus Sums in a Grid](https://leetcode.com/problems/get-biggest-three-rhombus-sums-in-a-grid)  | This problem                  |
| [304. Range Sum Query 2D](https://leetcode.com/problems/range-sum-query-2d-immutable/)                                    | 2D prefix sum technique       |
| [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)                    | Maintaining top-k elements    |
| [1074. Number of Submatrices That Sum to Target](https://leetcode.com/problems/number-of-submatrices-that-sum-to-target/) | 2D prefix sum + counting      |
| [221. Maximal Square](https://leetcode.com/problems/maximal-square/)                                                      | Matrix DP with shape patterns |
