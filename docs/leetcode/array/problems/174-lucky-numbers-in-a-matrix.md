---
layout: page
title: "Lucky Numbers in a Matrix"
difficulty: Easy
category: Array
tags: [Array, Matrix]
leetcode_url: "https://leetcode.com/problems/lucky-numbers-in-a-matrix"
---

# Lucky Numbers in a Matrix / Số May Mắn Trong Ma Trận

🟢 Easy | Tags: Array, Matrix

---

## 🧠 Intuition / Trực Giác

**VN:** Số may mắn là số nhỏ nhất trong hàng VÀ lớn nhất trong cột. Tìm tập hợp min mỗi hàng, tìm tập hợp max mỗi cột, giao điểm chính là đáp án.

```
matrix = [[3, 7, 8],
           [9, 11, 13],
           [15, 16, 17]]

row-mins: {3, 9, 15}
col-maxes: {15, 16, 17}
intersection: {15} ← lucky number
```

---

## 📝 Interview Tips

- 🇻🇳 Một số lucky luôn là unique — chứng minh: nếu có 2 số lucky trong cùng cột, chúng cùng là max của cột đó, mâu thuẫn.
- 🇺🇸 At most one lucky number exists — if two were in the same col, both would be col-max, contradiction.
- 🇻🇳 Dùng Set cho row-mins để lookup O(1) khi duyệt col-maxes.
- 🇺🇸 Store row-mins in a Set for O(1) lookup when iterating col-maxes.
- 🇻🇳 Nếu không có giao điểm, trả về mảng rỗng.
- 🇺🇸 Return empty array if no intersection is found.

---

## 💡 Solutions

### Solution 1: Row-Min Set × Col-Max Scan

```typescript
/**
 * Collect min of each row into a Set; check if any col-max is in that Set.
 * Time: O(m*n) | Space: O(m)
 */
function luckyNumbers(matrix: number[][]): number[] {
  const m = matrix.length,
    n = matrix[0].length;

  // Collect minimum value of each row
  const rowMins = new Set<number>();
  for (let i = 0; i < m; i++) {
    let minVal = matrix[i][0];
    for (let j = 1; j < n; j++) minVal = Math.min(minVal, matrix[i][j]);
    rowMins.add(minVal);
  }

  // Find maximum of each column; check against rowMins
  const result: number[] = [];
  for (let j = 0; j < n; j++) {
    let colMax = matrix[0][j];
    for (let i = 1; i < m; i++) colMax = Math.max(colMax, matrix[i][j]);
    if (rowMins.has(colMax)) result.push(colMax);
  }

  return result;
}

console.log(
  luckyNumbers([
    [3, 7, 8],
    [9, 11, 13],
    [15, 16, 17],
  ]),
); // [15]
console.log(
  luckyNumbers([
    [1, 10, 4, 2],
    [9, 3, 8, 7],
    [15, 16, 17, 12],
  ]),
); // [12]
console.log(
  luckyNumbers([
    [7, 8],
    [1, 2],
  ]),
); // [7]
```

### Solution 2: Two-Pass with Row-Min Array

```typescript
/**
 * Explicit two-pass: collect row mins array, collect col maxes array, intersect.
 * Time: O(m*n) | Space: O(m + n)
 */
function luckyNumbers2(matrix: number[][]): number[] {
  const m = matrix.length,
    n = matrix[0].length;

  const rowMin = matrix.map((row) => Math.min(...row));
  const colMax = Array.from({ length: n }, (_, j) => Math.max(...matrix.map((row) => row[j])));

  const result: number[] = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === rowMin[i] && matrix[i][j] === colMax[j]) {
        result.push(matrix[i][j]);
      }
    }
  }

  return result;
}

console.log(
  luckyNumbers2([
    [3, 7, 8],
    [9, 11, 13],
    [15, 16, 17],
  ]),
); // [15]
console.log(
  luckyNumbers2([
    [1, 10, 4, 2],
    [9, 3, 8, 7],
    [15, 16, 17, 12],
  ]),
); // [12]
```

---

## 🔗 Related Problems

| Problem                                                                                                                   | Difficulty | Pattern     |
| ------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| [Special Positions in a Binary Matrix](https://leetcode.com/problems/special-positions-in-a-binary-matrix/)               | 🟢 Easy    | Matrix Scan |
| [Row With Maximum Ones](https://leetcode.com/problems/row-with-maximum-ones/)                                             | 🟢 Easy    | Matrix      |
| [Find the Maximum Element Along the Diagonal](https://leetcode.com/problems/find-the-maximum-element-along-the-diagonal/) | 🟢 Easy    | Matrix      |
