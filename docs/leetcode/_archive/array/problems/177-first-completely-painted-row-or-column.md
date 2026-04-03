---
layout: page
title: "First Completely Painted Row or Column"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Matrix]
leetcode_url: "https://leetcode.com/problems/first-completely-painted-row-or-column"
---

# First Completely Painted Row or Column / Hàng Hoặc Cột Được Tô Đầy Tiên

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VN:** Lưu trước vị trí (hàng, cột) của từng số trong ma trận. Khi tô số theo thứ tự `arr`, tăng bộ đếm cho hàng và cột tương ứng. Hàng/cột nào bộ đếm đạt đủ `n` hoặc `m` là xong.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — First Completely Painted Row or Column example:**

```
mat = [[2,3],[1,4]], arr = [2,1,3,4]
pos: 1→(1,0), 2→(0,0), 3→(0,1), 4→(1,1)

k=0: paint 2 → row[0]=1, col[0]=1
k=1: paint 1 → row[1]=1, col[0]=2 == m=2 → return 1
```

---

---

## Problem Description

| Problem                                                                                                                                 | Difficulty | Pattern     |
| --------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| [Painting a Grid With Three Different Colors](https://leetcode.com/problems/painting-a-grid-with-three-different-colors/)               | 🔴 Hard    | DP / Matrix |
| [Check if Every Row and Column Contains All Numbers](https://leetcode.com/problems/check-if-every-row-and-column-contains-all-numbers/) | 🟢 Easy    | Matrix      |
| [Score After Flipping Matrix](https://leetcode.com/problems/score-after-flipping-matrix/)                                               | 🟡 Medium  | Greedy      |

---

## 📝 Interview Tips

- 🇻🇳 Tiền xử lý vị trí vào HashMap để tra cứu O(1) thay vì tìm kiếm O(m\*n).
- 🇺🇸 Pre-build a position map for O(1) lookup instead of O(m\*n) search per element.
- 🇻🇳 Bộ đếm cho mỗi hàng = số ô đã tô; hoàn thành khi bằng `n` (số cột).
- 🇺🇸 Row counter == n means full row painted; col counter == m means full column.
- 🇻🇳 Dùng `arr[k]` vì `arr` là hoán vị của `1..m*n`, mỗi số xuất hiện đúng một lần.
- 🇺🇸 `arr` is a permutation of all cell values so every cell is painted exactly once.

---

---

## Solutions

```typescript
/**
 * Pre-map each value to its (row, col); increment counters as arr is processed.
 * Time: O(m*n) | Space: O(m*n)
 */
function firstCompleteIndex(arr: number[], mat: number[][]): number {
  const m = mat.length,
    n = mat[0].length;

  // Build value → position map
  const pos = new Map<number, [number, number]>();
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) pos.set(mat[i][j], [i, j]);

  const rowCount = new Array<number>(m).fill(0);
  const colCount = new Array<number>(n).fill(0);

  for (let k = 0; k < arr.length; k++) {
    const [r, c] = pos.get(arr[k])!;
    rowCount[r]++;
    colCount[c]++;
    if (rowCount[r] === n || colCount[c] === m) return k;
  }

  return -1; // unreachable: arr is a complete permutation
}

console.log(
  firstCompleteIndex(
    [1, 3, 4, 2],
    [
      [1, 4],
      [2, 3],
    ],
  ),
); // 2
console.log(
  firstCompleteIndex(
    [2, 8, 7, 4, 1, 3, 5, 6, 9],
    [
      [3, 2, 5],
      [1, 4, 6],
      [8, 7, 9],
    ],
  ),
); // 3

/**
 * Encode position as flat index row*n+col stored in array indexed by value.
 * Time: O(m*n) | Space: O(m*n)
 */
function firstCompleteIndex2(arr: number[], mat: number[][]): number {
  const m = mat.length,
    n = mat[0].length;
  const total = m * n;

  // posRow[v] and posCol[v] indexed directly (values are 1..m*n)
  const posRow = new Int32Array(total + 1);
  const posCol = new Int32Array(total + 1);
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) {
      posRow[mat[i][j]] = i;
      posCol[mat[i][j]] = j;
    }

  const rowCount = new Int32Array(m);
  const colCount = new Int32Array(n);

  for (let k = 0; k < arr.length; k++) {
    const v = arr[k];
    const r = posRow[v],
      c = posCol[v];
    if (++rowCount[r] === n || ++colCount[c] === m) return k;
  }

  return -1;
}

console.log(
  firstCompleteIndex2(
    [1, 3, 4, 2],
    [
      [1, 4],
      [2, 3],
    ],
  ),
); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                                                                 | Difficulty | Pattern     |
| --------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| [Painting a Grid With Three Different Colors](https://leetcode.com/problems/painting-a-grid-with-three-different-colors/)               | 🔴 Hard    | DP / Matrix |
| [Check if Every Row and Column Contains All Numbers](https://leetcode.com/problems/check-if-every-row-and-column-contains-all-numbers/) | 🟢 Easy    | Matrix      |
| [Score After Flipping Matrix](https://leetcode.com/problems/score-after-flipping-matrix/)                                               | 🟡 Medium  | Greedy      |
