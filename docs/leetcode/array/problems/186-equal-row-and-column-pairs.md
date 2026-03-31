---
layout: page
title: "Equal Row and Column Pairs"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/equal-row-and-column-pairs"
---

# Equal Row and Column Pairs / Cặp Hàng Và Cột Bằng Nhau

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Find Winner on a Tic Tac Toe Game](https://leetcode.com/problems/find-winner-on-a-tic-tac-toe-game) | [Transpose Matrix](https://leetcode.com/problems/transpose-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống đối chiếu danh sách thi đua — mỗi hàng là một đội, mỗi cột là tiêu chí. Ta hash từng hàng thành chuỗi, lưu vào map, rồi hash từng cột và tra cứu. Mỗi lần tìm thấy = một cặp khớp.

**Visual:**

```
grid = [[3,2,1],
        [1,7,6],
        [2,7,7]]

Rows as strings:
  row0: "3,2,1" → count 1
  row1: "1,7,6" → count 1
  row2: "2,7,7" → count 1

Columns as strings:
  col0: "3,1,2" → no match
  col1: "2,7,7" → matches row2! +1
  col2: "1,6,7" → no match

Answer = 1
```

---

## Problem Description

Given an `n x n` integer matrix `grid`, return the number of pairs `(r, c)` such that **row r** and **column c** are equal (contain the same elements in the same order).

- Example 1: `grid=[[3,2,1],[1,7,6],[2,7,7]]` → `1` (row2 == col1: [2,7,7])
- Example 2: `grid=[[3,1,2,2],[1,4,4,5],[2,4,2,2],[2,4,2,2]]` → `3`

**Constraints:** `n == grid.length == grid[i].length`, `1 <= n <= 200`, `1 <= grid[i][j] <= 10^5`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Ma trận vuông n×n, so sánh hàng i với cột j theo thứ tự" / Square matrix, order matters.
2. **Key idea**: "Stringify rows → map. Stringify columns → lookup" / Hash rows, then match columns.
3. **Brute force**: "O(n³) — với mỗi cặp (r,c) so sánh n phần tử" / O(n³): compare each row-col pair.
4. **Hash map**: "O(n²) — encode row/col thành string, map[string]++ và lookup" / O(n²) via stringification.
5. **Encoding**: "Dùng dấu phân cách để tránh collision: '1,12' vs '11,2'" / Use delimiter to avoid hash collisions.
6. **Complexity**: "O(n²) thời gian và không gian — n² tổng phần tử" / O(n²) time and space.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force O(n^3)
 * Time: O(n^3) — n^2 pairs, each comparison O(n)
 * Space: O(1)
 */
function equalPairsBrute(grid: number[][]): number {
  const n = grid.length;
  let count = 0;

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      let match = true;
      for (let k = 0; k < n; k++) {
        if (grid[r][k] !== grid[k][c]) {
          match = false;
          break;
        }
      }
      if (match) count++;
    }
  }
  return count;
}

console.log(
  equalPairsBrute([
    [3, 2, 1],
    [1, 7, 6],
    [2, 7, 7],
  ]),
); // 1
console.log(
  equalPairsBrute([
    [3, 1, 2, 2],
    [1, 4, 4, 5],
    [2, 4, 2, 2],
    [2, 4, 2, 2],
  ]),
); // 3

/**
 * Solution 2: Hash Map with String Encoding — Optimal
 * Time: O(n^2) — build row map O(n^2), scan columns O(n^2)
 * Space: O(n^2) — store n row strings each of length O(n)
 *
 * Encode each row as "v0,v1,...,vn-1" and count occurrences.
 * Encode each column the same way and look up in the map.
 */
function equalPairs(grid: number[][]): number {
  const n = grid.length;
  const rowCount = new Map<string, number>();

  // Count each row encoding
  for (let r = 0; r < n; r++) {
    const key = grid[r].join(",");
    rowCount.set(key, (rowCount.get(key) ?? 0) + 1);
  }

  let count = 0;
  // Build each column and look up
  for (let c = 0; c < n; c++) {
    const colArr: number[] = [];
    for (let r = 0; r < n; r++) colArr.push(grid[r][c]);
    const key = colArr.join(",");
    count += rowCount.get(key) ?? 0;
  }

  return count;
}

console.log(
  equalPairs([
    [3, 2, 1],
    [1, 7, 6],
    [2, 7, 7],
  ]),
); // 1
console.log(
  equalPairs([
    [3, 1, 2, 2],
    [1, 4, 4, 5],
    [2, 4, 2, 2],
    [2, 4, 2, 2],
  ]),
); // 3
console.log(equalPairs([[1]])); // 1
console.log(
  equalPairs([
    [1, 1],
    [1, 1],
  ]),
); // 4
```

---

## 🔗 Related Problems

| Problem                                                                                              | Pattern           | Difficulty |
| ---------------------------------------------------------------------------------------------------- | ----------------- | ---------- |
| [Find Winner on a Tic Tac Toe Game](https://leetcode.com/problems/find-winner-on-a-tic-tac-toe-game) | Matrix Simulation | Easy       |
| [Transpose Matrix](https://leetcode.com/problems/transpose-matrix)                                   | Matrix            | Easy       |
| [Rotate Image](https://leetcode.com/problems/rotate-image)                                           | Matrix In-Place   | Medium     |
| [Game of Life](https://leetcode.com/problems/game-of-life)                                           | Matrix Simulation | Medium     |
